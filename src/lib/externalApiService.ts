import { z } from 'zod';
import CryptoJS from 'crypto-js';

// API endpoint türleri
export enum ExternalSystemType {
  SUPPLIER = 'supplier',
  CUSTOMER = 'customer',
  ERP = 'erp',
  WAREHOUSE = 'warehouse',
  LOGISTICS = 'logistics',
  QUALITY = 'quality',
  MAINTENANCE = 'maintenance',
  ANALYTICS = 'analytics'
}

// Veri formatları
export enum DataFormat {
  JSON = 'json',
  XML = 'xml',
  CSV = 'csv',
  EDI = 'edi',
  REST = 'rest',
  SOAP = 'soap'
}

// Güvenlik protokolleri
export enum SecurityProtocol {
  API_KEY = 'api_key',
  OAUTH2 = 'oauth2',
  JWT = 'jwt',
  BASIC_AUTH = 'basic_auth',
  MUTUAL_TLS = 'mutual_tls',
  HMAC = 'hmac'
}

// Şema tanımlamaları
const ExternalSystemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(ExternalSystemType),
  baseUrl: z.string().url(),
  apiVersion: z.string(),
  format: z.nativeEnum(DataFormat),
  security: z.nativeEnum(SecurityProtocol),
  credentials: z.record(z.string()),
  rateLimit: z.number().optional(),
  timeout: z.number().optional(),
  isActive: z.boolean(),
  lastSync: z.date().optional(),
  description: z.string().optional(),
});

const DataMappingSchema = z.object({
  id: z.string(),
  systemId: z.string(),
  sourceField: z.string(),
  targetField: z.string(),
  transformation: z.string().optional(),
  validation: z.string().optional(),
  isRequired: z.boolean(),
});

const SyncLogSchema = z.object({
  id: z.string(),
  systemId: z.string(),
  operation: z.enum(['export', 'import', 'sync']),
  status: z.enum(['pending', 'running', 'success', 'error']),
  recordCount: z.number(),
  startTime: z.date(),
  endTime: z.date().optional(),
  errorMessage: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type ExternalSystem = z.infer<typeof ExternalSystemSchema>;
export type DataMapping = z.infer<typeof DataMappingSchema>;
export type SyncLog = z.infer<typeof SyncLogSchema>;

// Veri transfer nesneleri
export interface ProductionDataDTO {
  timestamp: string;
  machineId: string;
  productionRate: number;
  qualityScore: number;
  energyConsumption: number;
  defectCount: number;
  operatorId?: string;
}

export interface InventoryDataDTO {
  itemId: string;
  quantity: number;
  location: string;
  lastUpdated: string;
  expiryDate?: string;
  batchNumber?: string;
}

export interface QualityDataDTO {
  batchId: string;
  testResults: Array<{
    parameter: string;
    value: number;
    unit: string;
    status: 'pass' | 'fail' | 'warning';
  }>;
  inspector: string;
  timestamp: string;
}

export interface MaintenanceDataDTO {
  equipmentId: string;
  maintenanceType: 'preventive' | 'corrective' | 'emergency';
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  cost?: number;
}

// Harici API servisi
export class ExternalApiService {
  private static instance: ExternalApiService;
  private systems: Map<string, ExternalSystem> = new Map();
  private mappings: Map<string, DataMapping[]> = new Map();
  private syncLogs: SyncLog[] = [];
  private secretKey = 'digital-twin-api-key-2024';

  private constructor() {
    this.initializeDefaultSystems();
  }

  public static getInstance(): ExternalApiService {
    if (!ExternalApiService.instance) {
      ExternalApiService.instance = new ExternalApiService();
    }
    return ExternalApiService.instance;
  }

  private initializeDefaultSystems() {
    // Varsayılan harici sistemler
    const defaultSystems: ExternalSystem[] = [
      {
        id: 'sap-erp',
        name: 'SAP ERP Sistemi',
        type: ExternalSystemType.ERP,
        baseUrl: 'https://api.company-erp.com/v2',
        apiVersion: 'v2.1',
        format: DataFormat.JSON,
        security: SecurityProtocol.OAUTH2,
        credentials: {
          clientId: 'digital-twin-client',
          clientSecret: this.encryptCredential('erp-secret-key'),
          scope: 'production:read inventory:write'
        },
        rateLimit: 1000,
        timeout: 30000,
        isActive: true,
        description: 'Ana ERP sistemi entegrasyonu'
      },
      {
        id: 'supplier-portal',
        name: 'Tedarikçi Portalı',
        type: ExternalSystemType.SUPPLIER,
        baseUrl: 'https://suppliers.company.com/api',
        apiVersion: 'v1.0',
        format: DataFormat.JSON,
        security: SecurityProtocol.API_KEY,
        credentials: {
          apiKey: this.encryptCredential('supplier-api-key-2024'),
          webhookSecret: this.encryptCredential('webhook-secret')
        },
        rateLimit: 500,
        timeout: 15000,
        isActive: true,
        description: 'Tedarikçilerle entegrasyon'
      },
      {
        id: 'customer-portal',
        name: 'Müşteri Portalı',
        type: ExternalSystemType.CUSTOMER,
        baseUrl: 'https://customers.company.com/api/v3',
        apiVersion: 'v3.0',
        format: DataFormat.JSON,
        security: SecurityProtocol.JWT,
        credentials: {
          jwtSecret: this.encryptCredential('customer-jwt-secret'),
          issuer: 'digital-twin-system'
        },
        rateLimit: 2000,
        timeout: 20000,
        isActive: true,
        description: 'Müşteri siparişleri ve kalite raporları'
      },
      {
        id: 'warehouse-wms',
        name: 'Depo Yönetim Sistemi',
        type: ExternalSystemType.WAREHOUSE,
        baseUrl: 'https://wms.logistics.com/api',
        apiVersion: 'v2.5',
        format: DataFormat.XML,
        security: SecurityProtocol.BASIC_AUTH,
        credentials: {
          username: 'digital_twin_user',
          password: this.encryptCredential('wms-password-2024')
        },
        rateLimit: 300,
        timeout: 25000,
        isActive: true,
        description: 'Stok ve sevkiyat takibi'
      },
      {
        id: 'quality-lims',
        name: 'Kalite LIMS Sistemi',
        type: ExternalSystemType.QUALITY,
        baseUrl: 'https://lims.quality.com/rest',
        apiVersion: 'v4.2',
        format: DataFormat.JSON,
        security: SecurityProtocol.HMAC,
        credentials: {
          accessKey: 'AKIAIOSFODNN7EXAMPLE',
          secretKey: this.encryptCredential('lims-secret-key')
        },
        rateLimit: 100,
        timeout: 10000,
        isActive: true,
        description: 'Kalite test sonuçları entegrasyonu'
      },
      {
        id: 'maintenance-cmms',
        name: 'Bakım Yönetim Sistemi',
        type: ExternalSystemType.MAINTENANCE,
        baseUrl: 'https://cmms.maintenance.com/api/v1',
        apiVersion: 'v1.8',
        format: DataFormat.JSON,
        security: SecurityProtocol.API_KEY,
        credentials: {
          apiKey: this.encryptCredential('cmms-api-key'),
          tenantId: 'production-plant-001'
        },
        rateLimit: 200,
        timeout: 15000,
        isActive: false,
        description: 'Bakım planları ve iş emirleri'
      },
      {
        id: 'analytics-bi',
        name: 'İş Zekası Platformu',
        type: ExternalSystemType.ANALYTICS,
        baseUrl: 'https://bi.analytics.com/api',
        apiVersion: 'v2.0',
        format: DataFormat.JSON,
        security: SecurityProtocol.OAUTH2,
        credentials: {
          clientId: 'bi-integration-client',
          clientSecret: this.encryptCredential('bi-client-secret'),
          scope: 'data:read analytics:write'
        },
        rateLimit: 1500,
        timeout: 60000,
        isActive: true,
        description: 'Veri analitiği ve raporlama'
      }
    ];

    defaultSystems.forEach(system => {
      this.systems.set(system.id, system);
    });

    this.initializeDefaultMappings();
  }

  private initializeDefaultMappings() {
    // ERP sistemi için veri mapping'leri
    const erpMappings: DataMapping[] = [
      {
        id: 'erp-production-1',
        systemId: 'sap-erp',
        sourceField: 'machineData.productionRate',
        targetField: 'production_output',
        transformation: 'units_per_hour',
        isRequired: true
      },
      {
        id: 'erp-quality-1',
        systemId: 'sap-erp',
        sourceField: 'qualityMetrics.defectRate',
        targetField: 'quality_defect_rate',
        transformation: 'percentage',
        isRequired: true
      },
      {
        id: 'erp-energy-1',
        systemId: 'sap-erp',
        sourceField: 'energyData.consumption',
        targetField: 'energy_kwh',
        transformation: 'kilowatt_hours',
        isRequired: false
      }
    ];

    // Tedarikçi portalı mapping'leri
    const supplierMappings: DataMapping[] = [
      {
        id: 'supplier-inventory-1',
        systemId: 'supplier-portal',
        sourceField: 'inventory.rawMaterials',
        targetField: 'material_stock',
        transformation: 'inventory_levels',
        isRequired: true
      },
      {
        id: 'supplier-delivery-1',
        systemId: 'supplier-portal',
        sourceField: 'logistics.deliverySchedule',
        targetField: 'delivery_timeline',
        transformation: 'iso_datetime',
        isRequired: true
      }
    ];

    // Müşteri portalı mapping'leri
    const customerMappings: DataMapping[] = [
      {
        id: 'customer-orders-1',
        systemId: 'customer-portal',
        sourceField: 'orders.productionRequests',
        targetField: 'order_specifications',
        transformation: 'order_format',
        isRequired: true
      },
      {
        id: 'customer-quality-1',
        systemId: 'customer-portal',
        sourceField: 'qualityReports.customerFeedback',
        targetField: 'quality_feedback',
        transformation: 'feedback_score',
        isRequired: false
      }
    ];

    this.mappings.set('sap-erp', erpMappings);
    this.mappings.set('supplier-portal', supplierMappings);
    this.mappings.set('customer-portal', customerMappings);
  }

  private encryptCredential(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  private decryptCredential(encryptedValue: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Sistem yönetimi
  public addExternalSystem(system: Omit<ExternalSystem, 'id'>): ExternalSystem {
    const id = `system-${Date.now()}`;
    const newSystem: ExternalSystem = {
      ...system,
      id,
      credentials: this.encryptCredentials(system.credentials)
    };

    this.systems.set(id, newSystem);
    return newSystem;
  }

  public updateExternalSystem(id: string, updates: Partial<ExternalSystem>): boolean {
    const system = this.systems.get(id);
    if (!system) return false;

    if (updates.credentials) {
      updates.credentials = this.encryptCredentials(updates.credentials);
    }

    this.systems.set(id, { ...system, ...updates });
    return true;
  }

  public deleteExternalSystem(id: string): boolean {
    return this.systems.delete(id);
  }

  public getExternalSystems(): ExternalSystem[] {
    return Array.from(this.systems.values());
  }

  public getActiveExternalSystems(): ExternalSystem[] {
    return Array.from(this.systems.values()).filter(system => system.isActive);
  }

  private encryptCredentials(credentials: Record<string, string>): Record<string, string> {
    const encrypted: Record<string, string> = {};
    for (const [key, value] of Object.entries(credentials)) {
      encrypted[key] = this.encryptCredential(value);
    }
    return encrypted;
  }

  // Veri aktarımı metodları
  public async exportProductionData(
    systemId: string, 
    data: ProductionDataDTO[], 
    options?: { batchSize?: number; validateData?: boolean }
  ): Promise<{ success: boolean; exportedCount: number; errors?: string[] }> {
    const system = this.systems.get(systemId);
    if (!system || !system.isActive) {
      throw new Error(`System ${systemId} not found or inactive`);
    }

    const logEntry = this.createSyncLog(systemId, 'export', data.length);
    
    try {
      // Veri validasyonu
      if (options?.validateData) {
        data = this.validateProductionData(data);
      }

      // Veri mapping'i uygula
      const mappedData = this.applyDataMapping(systemId, data);

      // Batch processing
      const batchSize = options?.batchSize || 100;
      let exportedCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < mappedData.length; i += batchSize) {
        const batch = mappedData.slice(i, i + batchSize);
        
        try {
          await this.sendDataToSystem(system, batch, 'production');
          exportedCount += batch.length;
        } catch (error) {
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error}`);
        }
      }

      this.updateSyncLog(logEntry.id, 'success', exportedCount, errors.length > 0 ? errors.join('; ') : undefined);
      
      return {
        success: errors.length === 0,
        exportedCount,
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      this.updateSyncLog(logEntry.id, 'error', 0, String(error));
      throw error;
    }
  }

  public async exportInventoryData(
    systemId: string,
    data: InventoryDataDTO[]
  ): Promise<{ success: boolean; exportedCount: number }> {
    const system = this.systems.get(systemId);
    if (!system || !system.isActive) {
      throw new Error(`System ${systemId} not found or inactive`);
    }

    const logEntry = this.createSyncLog(systemId, 'export', data.length);

    try {
      const mappedData = this.applyDataMapping(systemId, data);
      await this.sendDataToSystem(system, mappedData, 'inventory');
      
      this.updateSyncLog(logEntry.id, 'success', data.length);
      
      return {
        success: true,
        exportedCount: data.length
      };
    } catch (error) {
      this.updateSyncLog(logEntry.id, 'error', 0, String(error));
      throw error;
    }
  }

  public async exportQualityData(
    systemId: string,
    data: QualityDataDTO[]
  ): Promise<{ success: boolean; exportedCount: number }> {
    const system = this.systems.get(systemId);
    if (!system || !system.isActive) {
      throw new Error(`System ${systemId} not found or inactive`);
    }

    const logEntry = this.createSyncLog(systemId, 'export', data.length);

    try {
      const mappedData = this.applyDataMapping(systemId, data);
      await this.sendDataToSystem(system, mappedData, 'quality');
      
      this.updateSyncLog(logEntry.id, 'success', data.length);
      
      return {
        success: true,
        exportedCount: data.length
      };
    } catch (error) {
      this.updateSyncLog(logEntry.id, 'error', 0, String(error));
      throw error;
    }
  }

  public async exportMaintenanceData(
    systemId: string,
    data: MaintenanceDataDTO[]
  ): Promise<{ success: boolean; exportedCount: number }> {
    const system = this.systems.get(systemId);
    if (!system || !system.isActive) {
      throw new Error(`System ${systemId} not found or inactive`);
    }

    const logEntry = this.createSyncLog(systemId, 'export', data.length);

    try {
      const mappedData = this.applyDataMapping(systemId, data);
      await this.sendDataToSystem(system, mappedData, 'maintenance');
      
      this.updateSyncLog(logEntry.id, 'success', data.length);
      
      return {
        success: true,
        exportedCount: data.length
      };
    } catch (error) {
      this.updateSyncLog(logEntry.id, 'error', 0, String(error));
      throw error;
    }
  }

  // İç yardımcı metodlar
  private validateProductionData(data: ProductionDataDTO[]): ProductionDataDTO[] {
    return data.filter(item => {
      return item.timestamp && 
             item.machineId && 
             typeof item.productionRate === 'number' &&
             typeof item.qualityScore === 'number';
    });
  }

  private applyDataMapping(systemId: string, data: any[]): any[] {
    const mappings = this.mappings.get(systemId);
    if (!mappings) return data;

    return data.map(item => {
      const mappedItem: any = {};
      mappings.forEach(mapping => {
        const sourceValue = this.getNestedValue(item, mapping.sourceField);
        if (sourceValue !== undefined) {
          mappedItem[mapping.targetField] = this.transformValue(sourceValue, mapping.transformation);
        }
      });
      return mappedItem;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private transformValue(value: any, transformation?: string): any {
    if (!transformation) return value;

    switch (transformation) {
      case 'percentage':
        return (value * 100).toFixed(2);
      case 'kilowatt_hours':
        return Math.round(value * 100) / 100;
      case 'iso_datetime':
        return new Date(value).toISOString();
      case 'units_per_hour':
        return Math.round(value);
      default:
        return value;
    }
  }

  private async sendDataToSystem(
    system: ExternalSystem,
    data: any[],
    dataType: string
  ): Promise<void> {
    // Simüle edilmiş API çağrısı
    const delay = Math.random() * 2000 + 1000; // 1-3 saniye
    
    await new Promise(resolve => setTimeout(resolve, delay));

    // Rate limiting kontrolü
    if (system.rateLimit && data.length > system.rateLimit) {
      throw new Error(`Rate limit exceeded: ${data.length} > ${system.rateLimit}`);
    }

    // Format kontrolü
    const formattedData = this.formatDataForSystem(data, system.format);
    
    console.log(`📤 Sending ${data.length} ${dataType} records to ${system.name}:`, {
      endpoint: `${system.baseUrl}/${dataType}`,
      format: system.format,
      recordCount: data.length,
      timestamp: new Date().toISOString()
    });

    // Başarı oranı simülasyonu (%95 başarı)
    if (Math.random() < 0.05) {
      throw new Error(`Network error connecting to ${system.name}`);
    }
  }

  private formatDataForSystem(data: any[], format: DataFormat): string {
    switch (format) {
      case DataFormat.JSON:
        return JSON.stringify(data, null, 2);
      case DataFormat.XML:
        return this.convertToXML(data);
      case DataFormat.CSV:
        return this.convertToCSV(data);
      default:
        return JSON.stringify(data);
    }
  }

  private convertToXML(data: any[]): string {
    const xmlItems = data.map(item => {
      const fields = Object.entries(item)
        .map(([key, value]) => `    <${key}>${value}</${key}>`)
        .join('\n');
      return `  <item>\n${fields}\n  </item>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<data>\n${xmlItems}\n</data>`;
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(item => 
      headers.map(header => `"${item[header] || ''}"`).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  }

  private createSyncLog(systemId: string, operation: 'export' | 'import' | 'sync', recordCount: number): SyncLog {
    const log: SyncLog = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      systemId,
      operation,
      status: 'running',
      recordCount,
      startTime: new Date()
    };

    this.syncLogs.push(log);
    return log;
  }

  private updateSyncLog(id: string, status: 'success' | 'error', recordCount?: number, errorMessage?: string): void {
    const log = this.syncLogs.find(l => l.id === id);
    if (log) {
      log.status = status;
      log.endTime = new Date();
      if (recordCount !== undefined) log.recordCount = recordCount;
      if (errorMessage) log.errorMessage = errorMessage;
    }
  }

  // Public getters
  public getSyncLogs(systemId?: string): SyncLog[] {
    if (systemId) {
      return this.syncLogs.filter(log => log.systemId === systemId);
    }
    return [...this.syncLogs];
  }

  public getSystemMappings(systemId: string): DataMapping[] {
    return this.mappings.get(systemId) || [];
  }

  public addDataMapping(systemId: string, mapping: Omit<DataMapping, 'id'>): DataMapping {
    const id = `mapping-${Date.now()}`;
    const newMapping: DataMapping = { ...mapping, id, systemId };
    
    const existing = this.mappings.get(systemId) || [];
    this.mappings.set(systemId, [...existing, newMapping]);
    
    return newMapping;
  }

  public testConnection(systemId: string): Promise<{ success: boolean; responseTime: number; error?: string }> {
    const system = this.systems.get(systemId);
    if (!system) {
      return Promise.resolve({ success: false, responseTime: 0, error: 'System not found' });
    }

    const startTime = Date.now();
    
    // Simüle edilmiş bağlantı testi
    return new Promise((resolve) => {
      const delay = Math.random() * 3000 + 500; // 0.5-3.5 saniye
      
      setTimeout(() => {
        const responseTime = Date.now() - startTime;
        const success = Math.random() > 0.1; // %90 başarı oranı
        
        resolve({
          success,
          responseTime,
          error: success ? undefined : 'Connection timeout or authentication failed'
        });
      }, delay);
    });
  }

  // İstatistikler
  public getSystemStatistics() {
    const systems = Array.from(this.systems.values());
    const logs = this.syncLogs;
    
    return {
      totalSystems: systems.length,
      activeSystems: systems.filter(s => s.isActive).length,
      systemsByType: systems.reduce((acc, system) => {
        acc[system.type] = (acc[system.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalSyncs: logs.length,
      successfulSyncs: logs.filter(l => l.status === 'success').length,
      failedSyncs: logs.filter(l => l.status === 'error').length,
      runningSyncs: logs.filter(l => l.status === 'running').length,
      last24Hours: logs.filter(l => 
        Date.now() - l.startTime.getTime() < 24 * 60 * 60 * 1000
      ).length,
      avgResponseTime: this.calculateAverageResponseTime(),
      dataVolumeToday: this.calculateDataVolumeToday()
    };
  }

  private calculateAverageResponseTime(): number {
    const completedLogs = this.syncLogs.filter(l => l.endTime);
    if (completedLogs.length === 0) return 0;
    
    const totalTime = completedLogs.reduce((sum, log) => {
      return sum + (log.endTime!.getTime() - log.startTime.getTime());
    }, 0);
    
    return Math.round(totalTime / completedLogs.length);
  }

  private calculateDataVolumeToday(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.syncLogs
      .filter(l => l.startTime >= today)
      .reduce((sum, log) => sum + log.recordCount, 0);
  }
}

// Singleton instance
export const externalApiService = ExternalApiService.getInstance();
