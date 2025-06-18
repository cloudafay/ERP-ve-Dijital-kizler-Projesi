import { z } from 'zod';
import { DatabaseService } from './database';
import { useDigitalTwinStore } from './store';

// Veri tipleri için Zod şemaları
export const SensorDataSchema = z.object({
  id: z.string().uuid(),
  deviceId: z.string(),
  machineId: z.string(),
  type: z.enum(['temperature', 'pressure', 'vibration', 'flow', 'power', 'humidity']),
  value: z.number().finite(),
  unit: z.string(),
  timestamp: z.date(),
  quality: z.enum(['good', 'poor', 'bad']).default('good'),
  validated: z.boolean().default(false),
  rawValue: z.number().finite().optional(),
  calibrationOffset: z.number().default(0),
});

export const ProcessedDataSchema = z.object({
  id: z.string().uuid(),
  sourceDataId: z.string().uuid(),
  aggregationType: z.enum(['average', 'sum', 'min', 'max', 'count']),
  value: z.number().finite(),
  confidence: z.number().min(0).max(1),
  timestamp: z.date(),
  metadata: z.record(z.any()).optional(),
});

export const ValidationRuleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  machineType: z.string(),
  sensorType: z.string(),
  rules: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    expectedRange: z.object({
      min: z.number(),
      max: z.number(),
    }).optional(),
    correlationRules: z.array(z.object({
      correlatedSensor: z.string(),
      correlation: z.enum(['positive', 'negative', 'inverse']),
      threshold: z.number().min(0).max(1),
    })).optional(),
    anomalyThreshold: z.number().min(0).max(1).default(0.95),
    timeWindowMinutes: z.number().positive().default(5),
  }),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SensorData = z.infer<typeof SensorDataSchema>;
export type ProcessedData = z.infer<typeof ProcessedDataSchema>;
export type ValidationRule = z.infer<typeof ValidationRuleSchema>;

// Doğrulama sonucu tipleri
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  confidence: number;
  metadata: Record<string, any>;
}

export interface ValidationError {
  type: 'range' | 'correlation' | 'anomaly' | 'consistency' | 'schema';
  field: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  value?: any;
  expectedValue?: any;
  suggestedAction?: string;
}

export interface ValidationWarning {
  type: 'drift' | 'calibration' | 'quality';
  message: string;
  field: string;
  value?: any;
  suggestedAction?: string;
}

// Ana veri doğrulama servisi
export class DataValidationService {
  private static instance: DataValidationService;
  private validationRules: Map<string, ValidationRule[]> = new Map();
  private historicalData: Map<string, SensorData[]> = new Map();
  private processedDataCache: Map<string, ProcessedData[]> = new Map();
  private validationSubscribers: ((result: ValidationResult) => void)[] = [];

  private constructor() {
    this.initializeDefaultRules();
    this.startBackgroundValidation();
  }

  public static getInstance(): DataValidationService {
    if (!DataValidationService.instance) {
      DataValidationService.instance = new DataValidationService();
    }
    return DataValidationService.instance;
  }

  // Varsayılan doğrulama kurallarını başlat
  private initializeDefaultRules() {
    // Sıcaklık sensörleri için kurallar
    this.addValidationRule({
      id: crypto.randomUUID(),
      name: 'Enjeksiyon Makinesi Sıcaklık Kontrolü',
      description: 'Enjeksiyon makinesi için normal sıcaklık aralığı kontrolü',
      machineType: 'injection',
      sensorType: 'temperature',
      rules: {
        min: 180,
        max: 220,
        expectedRange: { min: 190, max: 210 },
        anomalyThreshold: 0.95,
        timeWindowMinutes: 5,
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Titreşim sensörleri için kurallar
    this.addValidationRule({
      id: crypto.randomUUID(),
      name: 'Şişirme Makinesi Titreşim Kontrolü',
      description: 'Şişirme makinesi titreşim değerleri kontrolü',
      machineType: 'blowing',
      sensorType: 'vibration',
      rules: {
        min: 0,
        max: 5,
        expectedRange: { min: 0.5, max: 2.0 },
        correlationRules: [{
          correlatedSensor: 'speed',
          correlation: 'positive',
          threshold: 0.7,
        }],
        anomalyThreshold: 0.9,
        timeWindowMinutes: 3,
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Basınç sensörleri için kurallar
    this.addValidationRule({
      id: crypto.randomUUID(),
      name: 'Basınç Sistemi Kontrolü',
      description: 'Sistem basınç değerleri için güvenlik kontrolü',
      machineType: 'all',
      sensorType: 'pressure',
      rules: {
        min: 1,
        max: 10,
        expectedRange: { min: 2, max: 8 },
        anomalyThreshold: 0.95,
        timeWindowMinutes: 2,
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Ham veri doğrulama
  public async validateRawData(data: any): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      confidence: 1.0,
      metadata: {},
    };

    try {
      // Şema doğrulama
      const validatedData = SensorDataSchema.parse(data);
      result.metadata.schemaValid = true;

      // Makine tipi ve sensör tipine göre kuralları al
      const rules = this.getValidationRules(validatedData.machineId, validatedData.type);
      
      // Her kural için doğrulama yap
      for (const rule of rules) {
        const ruleResult = await this.applyValidationRule(validatedData, rule);
        
        result.errors.push(...ruleResult.errors);
        result.warnings.push(...ruleResult.warnings);
        result.confidence = Math.min(result.confidence, ruleResult.confidence);
      }

      // Geçmiş verilerle tutarlılık kontrolü
      const consistencyResult = await this.checkDataConsistency(validatedData);
      result.errors.push(...consistencyResult.errors);
      result.warnings.push(...consistencyResult.warnings);

      result.isValid = result.errors.length === 0;

      // Sonucu abonelere bildir
      this.notifySubscribers(result);

      return result;

    } catch (error) {
      if (error instanceof z.ZodError) {
        result.isValid = false;
        result.errors = error.errors.map(err => ({
          type: 'schema',
          field: err.path.join('.'),
          message: err.message,
          severity: 'high' as const,
          value: err.received,
          suggestedAction: 'Veri formatını düzeltin',
        }));
        result.confidence = 0;
      } else {
        result.isValid = false;
        result.errors.push({
          type: 'consistency',
          field: 'unknown',
          message: `Doğrulama hatası: ${error}`,
          severity: 'critical',
          suggestedAction: 'Sistem yöneticisine başvurun',
        });
        result.confidence = 0;
      }

      return result;
    }
  }

  // İşlenmiş veri doğrulama
  public async validateProcessedData(
    processedData: any,
    sourceData: SensorData[]
  ): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      confidence: 1.0,
      metadata: {},
    };

    try {
      // Şema doğrulama
      const validatedData = ProcessedDataSchema.parse(processedData);
      
      // Kaynak veri ile tutarlılık kontrolü
      const consistencyCheck = this.validateProcessingLogic(validatedData, sourceData);
      result.errors.push(...consistencyCheck.errors);
      result.warnings.push(...consistencyCheck.warnings);
      result.confidence = Math.min(result.confidence, consistencyCheck.confidence);

      // Istatistiksel tutarlılık kontrolü
      const statisticalCheck = this.performStatisticalValidation(validatedData, sourceData);
      result.errors.push(...statisticalCheck.errors);
      result.warnings.push(...statisticalCheck.warnings);

      result.isValid = result.errors.length === 0;
      
      return result;

    } catch (error) {
      if (error instanceof z.ZodError) {
        result.isValid = false;
        result.errors = error.errors.map(err => ({
          type: 'schema',
          field: err.path.join('.'),
          message: err.message,
          severity: 'high' as const,
          suggestedAction: 'Processed data formatını düzeltin',
        }));
      }
      
      return result;
    }
  }

  // Doğrulama kuralı uygulama
  private async applyValidationRule(
    data: SensorData,
    rule: ValidationRule
  ): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      confidence: 1.0,
      metadata: {},
    };

    // Aralık kontrolü
    if (rule.rules.min !== undefined && data.value < rule.rules.min) {
      result.errors.push({
        type: 'range',
        field: 'value',
        message: `Değer minimum sınırın altında: ${data.value} < ${rule.rules.min}`,
        severity: 'high',
        value: data.value,
        expectedValue: rule.rules.min,
        suggestedAction: 'Sensör kalibrasyonunu kontrol edin',
      });
    }

    if (rule.rules.max !== undefined && data.value > rule.rules.max) {
      result.errors.push({
        type: 'range',
        field: 'value',
        message: `Değer maksimum sınırı aştı: ${data.value} > ${rule.rules.max}`,
        severity: 'critical',
        value: data.value,
        expectedValue: rule.rules.max,
        suggestedAction: 'Acil kontrol gerekli - makineyi durdurun',
      });
    }

    // Beklenen aralık kontrolü (uyarı seviyesi)
    if (rule.rules.expectedRange) {
      const { min, max } = rule.rules.expectedRange;
      if (data.value < min || data.value > max) {
        result.warnings.push({
          type: 'drift',
          field: 'value',
          message: `Değer beklenen aralık dışında: ${data.value} (Beklenen: ${min}-${max})`,
          value: data.value,
          suggestedAction: 'Işletme parametrelerini gözden geçirin',
        });
        result.confidence *= 0.8;
      }
    }

    // Anomali tespiti
    const anomalyScore = await this.calculateAnomalyScore(data);
    if (anomalyScore > rule.rules.anomalyThreshold) {
      result.errors.push({
        type: 'anomaly',
        field: 'value',
        message: `Anomali tespit edildi (Skor: ${anomalyScore.toFixed(3)})`,
        severity: anomalyScore > 0.98 ? 'critical' : 'medium',
        value: data.value,
        suggestedAction: 'Detaylı inceleme yapın',
      });
    }

    // Korelasyon kontrolü
    if (rule.rules.correlationRules) {
      for (const corrRule of rule.rules.correlationRules) {
        const correlationResult = await this.checkCorrelation(data, corrRule);
        if (!correlationResult.isValid) {
          result.warnings.push({
            type: 'drift',
            field: 'correlation',
            message: correlationResult.message,
            suggestedAction: 'Ilgili sensörleri kontrol edin',
          });
        }
      }
    }

    result.isValid = result.errors.length === 0;
    return result;
  }

  // Veri tutarlılığı kontrolü
  private async checkDataConsistency(data: SensorData): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      confidence: 1.0,
      metadata: {},
    };

    // Geçmiş veri ile karşılaştırma
    const historicalData = this.getHistoricalData(data.deviceId, 10);
    
    if (historicalData.length > 0) {
      const avgValue = historicalData.reduce((sum, d) => sum + d.value, 0) / historicalData.length;
      const stdDev = Math.sqrt(
        historicalData.reduce((sum, d) => sum + Math.pow(d.value - avgValue, 2), 0) / historicalData.length
      );

      // Z-score hesapla
      const zScore = Math.abs((data.value - avgValue) / stdDev);
      
      if (zScore > 3) { // 3 sigma kuralı
        result.warnings.push({
          type: 'drift',
          field: 'value',
          message: `Değer istatistiksel olarak normal dağılım dışında (Z-score: ${zScore.toFixed(2)})`,
          value: data.value,
          suggestedAction: 'Sensör drift analizi yapın',
        });
        result.confidence *= 0.7;
      }
    }

    // Zaman damgası tutarlılığı
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - data.timestamp.getTime());
    const maxAllowedDelay = 5 * 60 * 1000; // 5 dakika

    if (timeDiff > maxAllowedDelay) {
      result.errors.push({
        type: 'consistency',
        field: 'timestamp',
        message: `Veri zaman damgası çok eski veya gelecek tarihli (${timeDiff / 1000} saniye fark)`,
        severity: 'medium',
        value: data.timestamp,
        expectedValue: now,
        suggestedAction: 'Sistem saati senkronizasyonunu kontrol edin',
      });
    }

    // Kalibrasyon durumu kontrolü
    if (data.calibrationOffset && Math.abs(data.calibrationOffset) > 5) {
      result.warnings.push({
        type: 'calibration',
        field: 'calibrationOffset',
        message: `Yüksek kalibrasyon offseti: ${data.calibrationOffset}`,
        value: data.calibrationOffset,
        suggestedAction: 'Sensör yeniden kalibre edilmeli',
      });
    }

    result.isValid = result.errors.length === 0;
    return result;
  }

  // İşleme mantığı doğrulama
  private validateProcessingLogic(
    processedData: ProcessedData,
    sourceData: SensorData[]
  ): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      confidence: 1.0,
      metadata: {},
    };

    if (sourceData.length === 0) {
      result.errors.push({
        type: 'consistency',
        field: 'sourceData',
        message: 'İşlenmiş veri için kaynak veri bulunamadı',
        severity: 'critical',
        suggestedAction: 'Veri işleme pipeline\'ını kontrol edin',
      });
      return result;
    }

    // Aggregation doğrulama
    let expectedValue: number;
    const values = sourceData.map(d => d.value);

    switch (processedData.aggregationType) {
      case 'average':
        expectedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case 'sum':
        expectedValue = values.reduce((sum, val) => sum + val, 0);
        break;
      case 'min':
        expectedValue = Math.min(...values);
        break;
      case 'max':
        expectedValue = Math.max(...values);
        break;
      case 'count':
        expectedValue = values.length;
        break;
      default:
        result.errors.push({
          type: 'consistency',
          field: 'aggregationType',
          message: `Bilinmeyen aggregation tipi: ${processedData.aggregationType}`,
          severity: 'high',
          suggestedAction: 'Geçerli aggregation tipi kullanın',
        });
        return result;
    }

    // Tolerance kontrolü (%5)
    const tolerance = Math.abs(expectedValue * 0.05);
    if (Math.abs(processedData.value - expectedValue) > tolerance) {
      result.errors.push({
        type: 'consistency',
        field: 'value',
        message: `İşlenmiş değer beklenen değerden farklı: ${processedData.value} vs ${expectedValue}`,
        severity: 'high',
        value: processedData.value,
        expectedValue: expectedValue,
        suggestedAction: 'Veri işleme algoritmasını kontrol edin',
      });
    }

    result.isValid = result.errors.length === 0;
    return result;
  }

  // İstatistiksel doğrulama
  private performStatisticalValidation(
    processedData: ProcessedData,
    sourceData: SensorData[]
  ): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      confidence: processedData.confidence,
      metadata: {},
    };

    // Güven skoru kontrolü
    if (processedData.confidence < 0.5) {
      result.warnings.push({
        type: 'quality',
        field: 'confidence',
        message: `Düşük güven skoru: ${processedData.confidence}`,
        value: processedData.confidence,
        suggestedAction: 'Kaynak verilerin kalitesini artırın',
      });
    }

    // Kaynak veri kalitesi kontrolü
    const poorQualityCount = sourceData.filter(d => d.quality === 'poor' || d.quality === 'bad').length;
    const qualityRatio = poorQualityCount / sourceData.length;

    if (qualityRatio > 0.3) {
      result.warnings.push({
        type: 'quality',
        field: 'sourceDataQuality',
        message: `Kaynak verilerin %${(qualityRatio * 100).toFixed(1)}'i düşük kalitede`,
        value: qualityRatio,
        suggestedAction: 'Sensör bakımı yapın',
      });
    }

    return result;
  }

  // Yardımcı metodlar
  private async calculateAnomalyScore(data: SensorData): Promise<number> {
    // Basit anomali skoru hesaplama (gerçek uygulamada ML model kullanılabilir)
    const historicalData = this.getHistoricalData(data.deviceId, 50);
    
    if (historicalData.length < 10) {
      return 0; // Yeterli geçmiş veri yok
    }

    const values = historicalData.map(d => d.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    );

    const zScore = Math.abs((data.value - mean) / stdDev);
    
    // Z-score'u 0-1 aralığına normalize et
    return Math.min(zScore / 4, 1);
  }

  private async checkCorrelation(
    data: SensorData,
    rule: any
  ): Promise<{ isValid: boolean; message: string }> {
    // Korelasyon kontrolü implementasyonu
    // Bu basit bir implementasyon, gerçek uygulamada daha sofistike olabilir
    return {
      isValid: true,
      message: 'Korelasyon normal seviyede',
    };
  }

  // Veri yönetimi metodları
  public addValidationRule(rule: ValidationRule) {
    const key = `${rule.machineType}_${rule.sensorType}`;
    if (!this.validationRules.has(key)) {
      this.validationRules.set(key, []);
    }
    this.validationRules.get(key)!.push(rule);
  }

  public getValidationRules(machineId: string, sensorType: string): ValidationRule[] {
    // Makine tipini belirle (basit implementasyon)
    const machineType = machineId.includes('injection') ? 'injection' : 
                       machineId.includes('blowing') ? 'blowing' : 'all';
    
    const specificRules = this.validationRules.get(`${machineType}_${sensorType}`) || [];
    const generalRules = this.validationRules.get(`all_${sensorType}`) || [];
    
    return [...specificRules, ...generalRules].filter(rule => rule.isActive);
  }

  public addHistoricalData(data: SensorData) {
    if (!this.historicalData.has(data.deviceId)) {
      this.historicalData.set(data.deviceId, []);
    }
    
    const deviceData = this.historicalData.get(data.deviceId)!;
    deviceData.push(data);
    
    // Son 1000 kayıtı tut
    if (deviceData.length > 1000) {
      deviceData.splice(0, deviceData.length - 1000);
    }
  }

  public getHistoricalData(deviceId: string, limit: number = 50): SensorData[] {
    const data = this.historicalData.get(deviceId) || [];
    return data.slice(-limit);
  }

  // Abonelik sistemi
  public subscribe(callback: (result: ValidationResult) => void) {
    this.validationSubscribers.push(callback);
  }

  public unsubscribe(callback: (result: ValidationResult) => void) {
    const index = this.validationSubscribers.indexOf(callback);
    if (index > -1) {
      this.validationSubscribers.splice(index, 1);
    }
  }

  private notifySubscribers(result: ValidationResult) {
    this.validationSubscribers.forEach(callback => {
      try {
        callback(result);
      } catch (error) {
        console.error('Validation subscriber error:', error);
      }
    });
  }

  // Arka plan doğrulama servisi
  private startBackgroundValidation() {
    setInterval(() => {
      this.performPeriodicValidation();
    }, 30000); // Her 30 saniyede bir
  }

  private async performPeriodicValidation() {
    // Tüm cihazlar için son verileri kontrol et
    for (const [deviceId, data] of this.historicalData.entries()) {
      if (data.length > 0) {
        const latestData = data[data.length - 1];
        const timeSinceLastData = Date.now() - latestData.timestamp.getTime();
        
        // 5 dakikadan uzun süredir veri gelmeyen cihazları işaretle
        if (timeSinceLastData > 5 * 60 * 1000) {
          this.notifySubscribers({
            isValid: false,
            errors: [{
              type: 'consistency',
              field: 'timestamp',
              message: `Cihaz ${deviceId} ${Math.floor(timeSinceLastData / 60000)} dakikadır veri göndermiyor`,
              severity: 'medium',
              suggestedAction: 'Cihaz bağlantısını kontrol edin',
            }],
            warnings: [],
            confidence: 0,
            metadata: { deviceId, timeSinceLastData },
          });
        }
      }
    }
  }

  // Raporlama metodları
  public getValidationSummary(timeRange: { start: Date; end: Date }) {
    const summary = {
      totalValidations: 0,
      successfulValidations: 0,
      failedValidations: 0,
      warningCount: 0,
      errorsByType: {} as Record<string, number>,
      averageConfidence: 0,
      deviceStatistics: {} as Record<string, any>,
    };

    // Implementasyon detayları...
    return summary;
  }

  public exportValidationReport(format: 'json' | 'csv' | 'pdf' = 'json') {
    // Rapor export implementasyonu...
    return { message: 'Report generation not implemented yet' };
  }
}

// Singleton instance export
export const dataValidationService = DataValidationService.getInstance(); 