import { z } from 'zod';
import CryptoJS from 'crypto-js';

// GDPR veri kategorileri
export enum GDPRDataCategory {
  PERSONAL_IDENTIFIABLE = 'personal_identifiable',
  SENSITIVE_PERSONAL = 'sensitive_personal',
  OPERATIONAL = 'operational',
  TECHNICAL = 'technical',
  ANONYMOUS = 'anonymous'
}

// Anonimleştirme teknikleri
export enum AnonymizationTechnique {
  PSEUDONYMIZATION = 'pseudonymization',
  GENERALIZATION = 'generalization',
  SUPPRESSION = 'suppression',
  NOISE_ADDITION = 'noise_addition',
  DATA_MASKING = 'data_masking',
  K_ANONYMITY = 'k_anonymity'
}

// GDPR yasal dayanakları
export enum LegalBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_TASK = 'public_task',
  LEGITIMATE_INTERESTS = 'legitimate_interests'
}

// Veri şemaları
export const PersonalDataSchema = z.object({
  id: z.string().uuid(),
  dataSubjectId: z.string(),
  category: z.nativeEnum(GDPRDataCategory),
  fieldName: z.string(),
  originalValue: z.string(),
  anonymizedValue: z.string().optional(),
  technique: z.nativeEnum(AnonymizationTechnique).optional(),
  legalBasis: z.nativeEnum(LegalBasis),
  consentTimestamp: z.date().optional(),
  retentionPeriod: z.number(), // days
  createdAt: z.date(),
  lastAccessedAt: z.date().optional(),
  scheduledDeletionAt: z.date().optional(),
  isAnonymized: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

export const ConsentRecordSchema = z.object({
  id: z.string().uuid(),
  dataSubjectId: z.string(),
  purpose: z.string(),
  legalBasis: z.nativeEnum(LegalBasis),
  consentGiven: z.boolean(),
  consentTimestamp: z.date(),
  consentWithdrawnAt: z.date().optional(),
  consentSource: z.string(), // web, mobile, paper, etc.
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  dataCategories: z.array(z.nativeEnum(GDPRDataCategory)),
  retentionPeriod: z.number(),
  isActive: z.boolean().default(true),
  version: z.string().default('1.0'),
});

export const DataProcessingActivitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  controller: z.string(),
  processor: z.string().optional(),
  legalBasis: z.nativeEnum(LegalBasis),
  dataCategories: z.array(z.nativeEnum(GDPRDataCategory)),
  dataSubjects: z.array(z.string()),
  purposes: z.array(z.string()),
  recipients: z.array(z.string()).optional(),
  transfersToThirdCountries: z.boolean().default(false),
  retentionPeriod: z.number(),
  securityMeasures: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean().default(true),
});

export type PersonalData = z.infer<typeof PersonalDataSchema>;
export type ConsentRecord = z.infer<typeof ConsentRecordSchema>;
export type DataProcessingActivity = z.infer<typeof DataProcessingActivitySchema>;

// GDPR uyumluluk servisi
export class GDPRComplianceService {
  private static instance: GDPRComplianceService;
  private personalDataStore: Map<string, PersonalData[]> = new Map();
  private consentRecords: Map<string, ConsentRecord[]> = new Map();
  private processingActivities: Map<string, DataProcessingActivity> = new Map();
  private encryptionKey: string;
  private anonymizationRules: Map<string, AnonymizationRule> = new Map();

  private constructor() {
    this.encryptionKey = this.generateEncryptionKey();
    this.initializeDefaultRules();
    this.startAutomaticProcesses();
  }

  public static getInstance(): GDPRComplianceService {
    if (!GDPRComplianceService.instance) {
      GDPRComplianceService.instance = new GDPRComplianceService();
    }
    return GDPRComplianceService.instance;
  }

  // Anonimleştirme kuralları
  private initializeDefaultRules() {
    // E-posta adresleri için kural
    this.anonymizationRules.set('email', {
      field: 'email',
      technique: AnonymizationTechnique.PSEUDONYMIZATION,
      category: GDPRDataCategory.PERSONAL_IDENTIFIABLE,
      retentionDays: 2555, // 7 yıl
      rule: (value: string) => {
        const [localPart, domain] = value.split('@');
        const hashedLocal = CryptoJS.SHA256(localPart + this.encryptionKey).toString().substring(0, 8);
        return `user_${hashedLocal}@${domain}`;
      }
    });

    // Telefon numaraları için kural
    this.anonymizationRules.set('phone', {
      field: 'phone',
      technique: AnonymizationTechnique.DATA_MASKING,
      category: GDPRDataCategory.PERSONAL_IDENTIFIABLE,
      retentionDays: 2555,
      rule: (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length >= 10) {
          return digits.substring(0, 3) + '*'.repeat(digits.length - 6) + digits.substring(digits.length - 3);
        }
        return '*'.repeat(value.length);
      }
    });

    // İsim için kural
    this.anonymizationRules.set('name', {
      field: 'name',
      technique: AnonymizationTechnique.PSEUDONYMIZATION,
      category: GDPRDataCategory.PERSONAL_IDENTIFIABLE,
      retentionDays: 2555,
      rule: (value: string) => {
        const hash = CryptoJS.SHA256(value + this.encryptionKey).toString().substring(0, 8);
        return `Person_${hash}`;
      }
    });

    // IP adresi için kural
    this.anonymizationRules.set('ipAddress', {
      field: 'ipAddress',
      technique: AnonymizationTechnique.GENERALIZATION,
      category: GDPRDataCategory.TECHNICAL,
      retentionDays: 365,
      rule: (value: string) => {
        const parts = value.split('.');
        if (parts.length === 4) {
          return `${parts[0]}.${parts[1]}.*.* `;
        }
        return '*.*.*.* ';
      }
    });

    // Sensoryal konum verileri için kural
    this.anonymizationRules.set('location', {
      field: 'location',
      technique: AnonymizationTechnique.NOISE_ADDITION,
      category: GDPRDataCategory.SENSITIVE_PERSONAL,
      retentionDays: 1095, // 3 yıl
      rule: (value: string) => {
        // Koordinatları parse et ve gürültü ekle
        const coords = value.split(',').map(Number);
        if (coords.length === 2) {
          const noise = 0.001; // ~100m
          const lat = coords[0] + (Math.random() - 0.5) * noise;
          const lon = coords[1] + (Math.random() - 0.5) * noise;
          return `${lat.toFixed(6)},${lon.toFixed(6)}`;
        }
        return value;
      }
    });
  }

  // Kişisel veri kaydetme
  public async recordPersonalData(data: {
    dataSubjectId: string;
    fieldName: string;
    value: string;
    category: GDPRDataCategory;
    legalBasis: LegalBasis;
    retentionDays?: number;
    consentTimestamp?: Date;
  }): Promise<PersonalData> {
    const personalData: PersonalData = {
      id: crypto.randomUUID(),
      dataSubjectId: data.dataSubjectId,
      category: data.category,
      fieldName: data.fieldName,
      originalValue: await this.encryptValue(data.value),
      legalBasis: data.legalBasis,
      consentTimestamp: data.consentTimestamp,
      retentionPeriod: data.retentionDays || this.getDefaultRetentionPeriod(data.category),
      createdAt: new Date(),
      isAnonymized: false,
      isDeleted: false,
    };

    // Otomatik anonimleştirme kontrolü
    const rule = this.anonymizationRules.get(data.fieldName);
    if (rule && this.shouldAnonymizeImmediately(data.category)) {
      personalData.anonymizedValue = rule.rule(data.value);
      personalData.technique = rule.technique;
      personalData.isAnonymized = true;
    }

    // Saklama süresi hesaplama
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + personalData.retentionPeriod);
    personalData.scheduledDeletionAt = deletionDate;

    // Store'a kaydet
    if (!this.personalDataStore.has(data.dataSubjectId)) {
      this.personalDataStore.set(data.dataSubjectId, []);
    }
    this.personalDataStore.get(data.dataSubjectId)!.push(personalData);

    return personalData;
  }

  // Rıza kaydı oluşturma
  public async recordConsent(data: {
    dataSubjectId: string;
    purpose: string;
    legalBasis: LegalBasis;
    consentGiven: boolean;
    dataCategories: GDPRDataCategory[];
    source: string;
    ipAddress?: string;
    userAgent?: string;
    retentionDays?: number;
  }): Promise<ConsentRecord> {
    const consent: ConsentRecord = {
      id: crypto.randomUUID(),
      dataSubjectId: data.dataSubjectId,
      purpose: data.purpose,
      legalBasis: data.legalBasis,
      consentGiven: data.consentGiven,
      consentTimestamp: new Date(),
      consentSource: data.source,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      dataCategories: data.dataCategories,
      retentionPeriod: data.retentionDays || 2555, // 7 yıl default
      isActive: data.consentGiven,
      version: '1.0',
    };

    if (!this.consentRecords.has(data.dataSubjectId)) {
      this.consentRecords.set(data.dataSubjectId, []);
    }
    this.consentRecords.get(data.dataSubjectId)!.push(consent);

    return consent;
  }

  // Veri anonimleştirme
  public async anonymizeData(personalDataId: string): Promise<boolean> {
    // Veriyi bul
    for (const [dataSubjectId, dataList] of this.personalDataStore.entries()) {
      const dataIndex = dataList.findIndex(d => d.id === personalDataId);
      if (dataIndex !== -1) {
        const personalData = dataList[dataIndex];
        
        if (personalData.isAnonymized) {
          return true; // Zaten anonimleştirilmiş
        }

        const rule = this.anonymizationRules.get(personalData.fieldName);
        if (rule) {
          // Orijinal değeri çöz
          const originalValue = await this.decryptValue(personalData.originalValue);
          
          // Anonimleştir
          personalData.anonymizedValue = rule.rule(originalValue);
          personalData.technique = rule.technique;
          personalData.isAnonymized = true;
          
          // Orijinal değeri sil (GDPR uyumluluğu için)
          personalData.originalValue = '';
          
          return true;
        }
      }
    }
    
    return false;
  }

  // Unutulma hakkı (Right to be forgotten)
  public async processErasureRequest(dataSubjectId: string, reason?: string): Promise<{
    success: boolean;
    deletedRecords: number;
    anonymizedRecords: number;
    errors: string[];
  }> {
    const result = {
      success: true,
      deletedRecords: 0,
      anonymizedRecords: 0,
      errors: [] as string[],
    };

    try {
      // Kişisel verileri sil veya anonimleştir
      const personalData = this.personalDataStore.get(dataSubjectId) || [];
      
      for (const data of personalData) {
        if (this.canBeDeleted(data)) {
          data.isDeleted = true;
          data.originalValue = '';
          data.anonymizedValue = '';
          result.deletedRecords++;
        } else if (!data.isAnonymized) {
          // Silinemeyen veriler anonimleştirilir
          await this.anonymizeData(data.id);
          result.anonymizedRecords++;
        }
      }

      // Rıza kayıtlarını işaretle
      const consents = this.consentRecords.get(dataSubjectId) || [];
      consents.forEach(consent => {
        consent.consentWithdrawnAt = new Date();
        consent.isActive = false;
      });

      // Log kaydı oluştur
      await this.logGDPRAction({
        action: 'data_erasure',
        dataSubjectId,
        reason: reason || 'User request',
        timestamp: new Date(),
        details: {
          deletedRecords: result.deletedRecords,
          anonymizedRecords: result.anonymizedRecords,
        },
      });

    } catch (error) {
      result.success = false;
      result.errors.push(`Erasure failed: ${error}`);
    }

    return result;
  }

  // Veri taşınabilirlik hakkı (Data portability)
  public async exportPersonalData(dataSubjectId: string, format: 'json' | 'csv' | 'xml' = 'json'): Promise<{
    data: any;
    format: string;
    timestamp: Date;
  }> {
    const personalData = this.personalDataStore.get(dataSubjectId) || [];
    const consents = this.consentRecords.get(dataSubjectId) || [];

    const exportData = {
      dataSubjectId,
      personalData: await Promise.all(personalData
        .filter(d => !d.isDeleted)
        .map(async d => ({
          id: d.id,
          field: d.fieldName,
          value: d.isAnonymized ? d.anonymizedValue : await this.decryptValue(d.originalValue),
          category: d.category,
          createdAt: d.createdAt,
          isAnonymized: d.isAnonymized,
        }))),
      consents: consents.map(c => ({
        purpose: c.purpose,
        consentGiven: c.consentGiven,
        timestamp: c.consentTimestamp,
        isActive: c.isActive,
        dataCategories: c.dataCategories,
      })),
      exportTimestamp: new Date(),
    };

    // Log kaydı
    await this.logGDPRAction({
      action: 'data_export',
      dataSubjectId,
      timestamp: new Date(),
      details: { format, recordCount: personalData.length },
    });

    return {
      data: exportData,
      format,
      timestamp: new Date(),
    };
  }

  // Otomatik süreçler
  private startAutomaticProcesses() {
    // Her gün gece yarısı otomatik temizlik
    setInterval(() => {
      this.performAutomaticDataMaintenance();
    }, 24 * 60 * 60 * 1000);

    // Her saat anonimleştirme kontrolü
    setInterval(() => {
      this.performScheduledAnonymization();
    }, 60 * 60 * 1000);

    // Her 6 saatte bir uyumluluk kontrolü
    setInterval(() => {
      this.performComplianceCheck();
    }, 6 * 60 * 60 * 1000);
  }

  private async performAutomaticDataMaintenance() {
    const now = new Date();
    let deletedCount = 0;
    let anonymizedCount = 0;

    for (const [dataSubjectId, dataList] of this.personalDataStore.entries()) {
      for (const data of dataList) {
        // Saklama süresi dolmuş veriler
        if (data.scheduledDeletionAt && data.scheduledDeletionAt <= now && !data.isDeleted) {
          if (this.canBeDeleted(data)) {
            data.isDeleted = true;
            data.originalValue = '';
            data.anonymizedValue = '';
            deletedCount++;
          } else if (!data.isAnonymized) {
            await this.anonymizeData(data.id);
            anonymizedCount++;
          }
        }
      }
    }

    console.log(`Automatic maintenance completed: ${deletedCount} deleted, ${anonymizedCount} anonymized`);
  }

  private async performScheduledAnonymization() {
    for (const [dataSubjectId, dataList] of this.personalDataStore.entries()) {
      for (const data of dataList) {
        if (!data.isAnonymized && this.shouldAnonymizeAutomatically(data)) {
          await this.anonymizeData(data.id);
        }
      }
    }
  }

  private async performComplianceCheck(): Promise<{
    compliant: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Rıza geçerliliği kontrolü
    for (const [dataSubjectId, consents] of this.consentRecords.entries()) {
      const activeConsents = consents.filter(c => c.isActive);
      if (activeConsents.length === 0) {
        const hasPersonalData = this.personalDataStore.has(dataSubjectId);
        if (hasPersonalData) {
          issues.push(`Data subject ${dataSubjectId} has no active consent but has personal data`);
          recommendations.push(`Review and obtain valid consent or anonymize data for ${dataSubjectId}`);
        }
      }
    }

    // Saklama süresi kontrolü
    const now = new Date();
    for (const [dataSubjectId, dataList] of this.personalDataStore.entries()) {
      const overdueData = dataList.filter(d => 
        d.scheduledDeletionAt && d.scheduledDeletionAt <= now && !d.isDeleted && !d.isAnonymized
      );
      
      if (overdueData.length > 0) {
        issues.push(`${overdueData.length} overdue data records for subject ${dataSubjectId}`);
        recommendations.push(`Schedule immediate anonymization or deletion for overdue records`);
      }
    }

    return {
      compliant: issues.length === 0,
      issues,
      recommendations,
    };
  }

  // Yardımcı metodlar
  private async encryptValue(value: string): Promise<string> {
    return CryptoJS.AES.encrypt(value, this.encryptionKey).toString();
  }

  private async decryptValue(encryptedValue: string): Promise<string> {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private generateEncryptionKey(): string {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }

  private getDefaultRetentionPeriod(category: GDPRDataCategory): number {
    switch (category) {
      case GDPRDataCategory.PERSONAL_IDENTIFIABLE:
        return 2555; // 7 yıl
      case GDPRDataCategory.SENSITIVE_PERSONAL:
        return 1095; // 3 yıl
      case GDPRDataCategory.OPERATIONAL:
        return 1825; // 5 yıl
      case GDPRDataCategory.TECHNICAL:
        return 365; // 1 yıl
      default:
        return 730; // 2 yıl
    }
  }

  private shouldAnonymizeImmediately(category: GDPRDataCategory): boolean {
    return category === GDPRDataCategory.SENSITIVE_PERSONAL;
  }

  private shouldAnonymizeAutomatically(data: PersonalData): boolean {
    const daysSinceCreation = (Date.now() - data.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Hassas veriler 90 gün sonra otomatik anonimleştir
    if (data.category === GDPRDataCategory.SENSITIVE_PERSONAL && daysSinceCreation > 90) {
      return true;
    }
    
    // Kişisel tanımlayıcı veriler 1 yıl sonra anonimleştir
    if (data.category === GDPRDataCategory.PERSONAL_IDENTIFIABLE && daysSinceCreation > 365) {
      return true;
    }
    
    return false;
  }

  private canBeDeleted(data: PersonalData): boolean {
    // Yasal yükümlülük varsa silinmez, anonimleştirilir
    return data.legalBasis !== LegalBasis.LEGAL_OBLIGATION;
  }

  private async logGDPRAction(action: {
    action: string;
    dataSubjectId: string;
    timestamp: Date;
    reason?: string;
    details?: any;
  }) {
    // GDPR eylemlerini loglama (audit trail için)
    console.log('GDPR Action:', action);
    // Gerçek uygulamada güvenli log sistemine kaydedilir
  }

  // Public API metodları
  public async getPersonalDataSummary(dataSubjectId: string) {
    const personalData = this.personalDataStore.get(dataSubjectId) || [];
    const consents = this.consentRecords.get(dataSubjectId) || [];

    return {
      dataSubjectId,
      totalRecords: personalData.length,
      anonymizedRecords: personalData.filter(d => d.isAnonymized).length,
      deletedRecords: personalData.filter(d => d.isDeleted).length,
      activeConsents: consents.filter(c => c.isActive).length,
      dataCategories: [...new Set(personalData.map(d => d.category))],
      oldestRecord: personalData.reduce((oldest, current) => 
        current.createdAt < oldest.createdAt ? current : oldest, personalData[0])?.createdAt,
      nextScheduledDeletion: personalData
        .filter(d => d.scheduledDeletionAt && !d.isDeleted)
        .reduce((earliest, current) => 
          current.scheduledDeletionAt! < earliest ? current.scheduledDeletionAt! : earliest, 
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
    };
  }

  public async generateComplianceReport(): Promise<{
    overview: any;
    dataSubjects: number;
    personalDataRecords: number;
    anonymizedRecords: number;
    deletedRecords: number;
    activeConsents: number;
    complianceIssues: string[];
    recommendations: string[];
    lastAuditDate: Date;
  }> {
    const complianceCheck = await this.performComplianceCheck();
    
    let totalPersonalData = 0;
    let totalAnonymized = 0;
    let totalDeleted = 0;
    let totalActiveConsents = 0;

    for (const [_, dataList] of this.personalDataStore.entries()) {
      totalPersonalData += dataList.length;
      totalAnonymized += dataList.filter(d => d.isAnonymized).length;
      totalDeleted += dataList.filter(d => d.isDeleted).length;
    }

    for (const [_, consents] of this.consentRecords.entries()) {
      totalActiveConsents += consents.filter(c => c.isActive).length;
    }

    return {
      overview: {
        compliant: complianceCheck.compliant,
        lastCheck: new Date(),
      },
      dataSubjects: this.personalDataStore.size,
      personalDataRecords: totalPersonalData,
      anonymizedRecords: totalAnonymized,
      deletedRecords: totalDeleted,
      activeConsents: totalActiveConsents,
      complianceIssues: complianceCheck.issues,
      recommendations: complianceCheck.recommendations,
      lastAuditDate: new Date(),
    };
  }
}

// Anonimleştirme kuralı interface'i
interface AnonymizationRule {
  field: string;
  technique: AnonymizationTechnique;
  category: GDPRDataCategory;
  retentionDays: number;
  rule: (value: string) => string;
}

// Singleton instance export
export const gdprService = GDPRComplianceService.getInstance(); 