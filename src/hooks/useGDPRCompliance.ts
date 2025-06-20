import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  gdprService, 
  GDPRDataCategory, 
  LegalBasis, 
  AnonymizationTechnique,
  PersonalData,
  ConsentRecord 
} from '../lib/gdprCompliance';
import { toast } from './use-toast';

// GDPR uyumluluk durumu hook'u
export function useGDPRCompliance() {
  const [complianceStatus, setComplianceStatus] = useState({
    isCompliant: true,
    lastCheck: new Date(),
    issues: [] as string[],
    recommendations: [] as string[],
  });

  const { data: complianceReport, isLoading, refetch } = useQuery({
    queryKey: ['gdpr-compliance-report'],
    queryFn: async () => {
      return await gdprService.generateComplianceReport();
    },
    refetchInterval: 5 * 60 * 1000, // Her 5 dakikada bir kontrol
  });

  // Effect to update compliance status when data changes
  useEffect(() => {
    if (complianceReport) {
      setComplianceStatus({
        isCompliant: complianceReport.overview.compliant,
        lastCheck: complianceReport.lastAuditDate,
        issues: complianceReport.complianceIssues,
        recommendations: complianceReport.recommendations,
      });
    }
  }, [complianceReport]);

  const forceComplianceCheck = useCallback(async () => {
    const result = await refetch();
    const data = result.data;
    toast({
      title: "GDPR Uyumluluk Kontrolü",
      description: data?.overview.compliant ? 
        "Sistem GDPR uyumlu" : 
        `${data?.complianceIssues.length} uyumluluk sorunu tespit edildi`,
      variant: data?.overview.compliant ? "default" : "destructive",
    });
    return data;
  }, [refetch]);

  return {
    complianceReport,
    complianceStatus,
    isLoading,
    forceComplianceCheck,
    refetch,
  };
}

// Kişisel veri yönetimi hook'u
export function usePersonalDataManagement() {
  const queryClient = useQueryClient();

  const recordPersonalData = useMutation({
    mutationFn: async (data: {
      dataSubjectId: string;
      fieldName: string;
      value: string;
      category: GDPRDataCategory;
      legalBasis: LegalBasis;
      retentionDays?: number;
      consentTimestamp?: Date;
    }) => {
      return await gdprService.recordPersonalData(data);
    },
  });

  useEffect(() => {
    if (recordPersonalData.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['personal-data'] });
      toast({
        title: "Kişisel Veri Kaydedildi",
        description: "Veri GDPR uyumlu şekilde kaydedildi",
      });
    }
    if (recordPersonalData.isError) {
      toast({
        title: "Veri Kaydetme Hatası",
        description: `Hata: ${recordPersonalData.error}`,
        variant: "destructive",
      });
    }
  }, [recordPersonalData.isSuccess, recordPersonalData.isError, recordPersonalData.error, queryClient]);

  const anonymizeData = useMutation({
    mutationFn: async (personalDataId: string) => {
      return await gdprService.anonymizeData(personalDataId);
    },
  });

  useEffect(() => {
    if (anonymizeData.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['personal-data'] });
      toast({
        title: "Veri Anonimleştirildi",
        description: "Kişisel veri başarıyla anonimleştirildi",
      });
    }
    if (anonymizeData.isError) {
      toast({
        title: "Anonimleştirme Hatası",
        description: `Hata: ${anonymizeData.error}`,
        variant: "destructive",
      });
    }
  }, [anonymizeData.isSuccess, anonymizeData.isError, anonymizeData.error, queryClient]);

  const processErasureRequest = useMutation({
    mutationFn: async ({ dataSubjectId, reason }: { dataSubjectId: string; reason?: string }) => {
      return await gdprService.processErasureRequest(dataSubjectId, reason);
    },
  });

  useEffect(() => {
    if (processErasureRequest.isSuccess && processErasureRequest.data) {
      queryClient.invalidateQueries({ queryKey: ['personal-data'] });
      queryClient.invalidateQueries({ queryKey: ['gdpr-compliance-report'] });
      
      const result = processErasureRequest.data;
      toast({
        title: "Unutulma Hakkı İşlemi Tamamlandı",
        description: `${result.deletedRecords} kayıt silindi, ${result.anonymizedRecords} kayıt anonimleştirildi`,
      });
    }
    if (processErasureRequest.isError) {
      toast({
        title: "Silme İşlemi Hatası",
        description: `Hata: ${processErasureRequest.error}`,
        variant: "destructive",
      });
    }
  }, [processErasureRequest.isSuccess, processErasureRequest.isError, processErasureRequest.error, processErasureRequest.data, queryClient]);

  const exportPersonalData = useMutation({
    mutationFn: async ({ 
      dataSubjectId, 
      format 
    }: { 
      dataSubjectId: string; 
      format: 'json' | 'csv' | 'xml' 
    }) => {
      return await gdprService.exportPersonalData(dataSubjectId, format);
    },
  });

  useEffect(() => {
    if (exportPersonalData.isSuccess && exportPersonalData.data && exportPersonalData.variables) {
      const result = exportPersonalData.data;
      const variables = exportPersonalData.variables;
      
      // Dosya indirme işlemi
      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: variables.format === 'json' ? 'application/json' : 'text/plain'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `personal-data-${variables.dataSubjectId}.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Veri Dışa Aktarıldı",
        description: "Kişisel veriler başarıyla dışa aktarıldı",
      });
    }
    if (exportPersonalData.isError) {
      toast({
        title: "Dışa Aktarma Hatası",
        description: `Hata: ${exportPersonalData.error}`,
        variant: "destructive",
      });
    }
  }, [exportPersonalData.isSuccess, exportPersonalData.isError, exportPersonalData.error, exportPersonalData.data, exportPersonalData.variables]);

  return {
    recordPersonalData,
    anonymizeData,
    processErasureRequest,
    exportPersonalData,
    isProcessing: recordPersonalData.isPending || 
                  anonymizeData.isPending || 
                  processErasureRequest.isPending || 
                  exportPersonalData.isPending,
  };
}

// Rıza yönetimi hook'u
export function useConsentManagement() {
  const queryClient = useQueryClient();

  const recordConsent = useMutation({
    mutationFn: async (data: {
      dataSubjectId: string;
      purpose: string;
      legalBasis: LegalBasis;
      consentGiven: boolean;
      dataCategories: GDPRDataCategory[];
      source: string;
      ipAddress?: string;
      userAgent?: string;
      retentionDays?: number;
    }) => {
      return await gdprService.recordConsent(data);
    },
  });

  useEffect(() => {
    if (recordConsent.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['consent-records'] });
      toast({
        title: "Rıza Kaydedildi",
        description: "Kullanıcı rızası başarıyla kaydedildi",
      });
    }
    if (recordConsent.isError) {
      toast({
        title: "Rıza Kaydetme Hatası",
        description: `Hata: ${recordConsent.error}`,
        variant: "destructive",
      });
    }
  }, [recordConsent.isSuccess, recordConsent.isError, recordConsent.error, queryClient]);

  const withdrawConsent = useMutation({
    mutationFn: async (dataSubjectId: string) => {
      // Tüm aktif rızaları geri çek
      return await gdprService.processErasureRequest(dataSubjectId, 'Consent withdrawn');
    },
  });

  useEffect(() => {
    if (withdrawConsent.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['consent-records'] });
      queryClient.invalidateQueries({ queryKey: ['gdpr-compliance-report'] });
      toast({
        title: "Rıza Geri Çekildi",
        description: "Kullanıcı rızası geri çekildi ve veriler işlendi",
      });
    }
    if (withdrawConsent.isError) {
      toast({
        title: "Rıza Geri Çekme Hatası",
        description: `Hata: ${withdrawConsent.error}`,
        variant: "destructive",
      });
    }
  }, [withdrawConsent.isSuccess, withdrawConsent.isError, withdrawConsent.error, queryClient]);

  return {
    recordConsent,
    withdrawConsent,
    isProcessing: recordConsent.isPending || withdrawConsent.isPending,
  };
}

// Veri saklama süresi yönetimi hook'u
export function useDataRetention() {
  const [retentionPolicies, setRetentionPolicies] = useState([
    {
      id: '1',
      name: 'Kişisel Tanımlayıcı Veriler',
      category: GDPRDataCategory.PERSONAL_IDENTIFIABLE,
      defaultRetentionDays: 2555, // 7 yıl
      legalBasis: 'Yasal yükümlülük',
      autoDelete: true,
      autoAnonymize: false,
    },
    {
      id: '2',
      name: 'Hassas Kişisel Veriler',
      category: GDPRDataCategory.SENSITIVE_PERSONAL,
      defaultRetentionDays: 1095, // 3 yıl
      legalBasis: 'Açık rıza',
      autoDelete: false,
      autoAnonymize: true,
    },
    {
      id: '3',
      name: 'Operasyonel Veriler',
      category: GDPRDataCategory.OPERATIONAL,
      defaultRetentionDays: 1825, // 5 yıl
      legalBasis: 'Meşru menfaat',
      autoDelete: true,
      autoAnonymize: false,
    },
    {
      id: '4',
      name: 'Teknik Veriler',
      category: GDPRDataCategory.TECHNICAL,
      defaultRetentionDays: 365, // 1 yıl
      legalBasis: 'Meşru menfaat',
      autoDelete: true,
      autoAnonymize: false,
    },
  ]);

  const { data: upcomingDeletions, isLoading } = useQuery({
    queryKey: ['upcoming-deletions'],
    queryFn: async () => {
      // Silinmesi yaklaşan veriler (simülasyon)
      const mockDeletions = [
        {
          dataSubjectId: 'user123',
          recordCount: 15,
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          category: GDPRDataCategory.PERSONAL_IDENTIFIABLE,
          canBePostponed: false,
        },
        {
          dataSubjectId: 'user456',
          recordCount: 8,
          scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          category: GDPRDataCategory.SENSITIVE_PERSONAL,
          canBePostponed: true,
        },
      ];
      return mockDeletions;
    },
    refetchInterval: 60 * 60 * 1000, // Her saat
  });

  const updateRetentionPolicy = useCallback((policyId: string, updates: any) => {
    setRetentionPolicies(prev => 
      prev.map(policy => 
        policy.id === policyId ? { ...policy, ...updates } : policy
      )
    );
    toast({
      title: "Saklama Politikası Güncellendi",
      description: "Veri saklama politikası başarıyla güncellendi",
    });
  }, []);

  return {
    retentionPolicies,
    upcomingDeletions: upcomingDeletions || [],
    isLoading,
    updateRetentionPolicy,
  };
}

// Veri anonimleştirme istatistikleri hook'u
export function useAnonymizationMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['anonymization-metrics'],
    queryFn: async () => {
      // Anonimleştirme istatistikleri (simülasyon)
      return {
        totalRecords: 15420,
        anonymizedRecords: 3240,
        pendingAnonymization: 180,
        deletedRecords: 520,
        anonymizationRate: 21.0,
        techniques: [
          { name: 'Pseudonymization', count: 1850, percentage: 57.1 },
          { name: 'Data Masking', count: 680, percentage: 21.0 },
          { name: 'Generalization', count: 420, percentage: 13.0 },
          { name: 'Noise Addition', count: 290, percentage: 8.9 },
        ],
        monthlyTrend: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleString('tr-TR', { month: 'short' }),
          anonymized: Math.floor(Math.random() * 200) + 100,
          deleted: Math.floor(Math.random() * 50) + 20,
        })),
        lastUpdate: new Date(),
      };
    },
    refetchInterval: 30 * 60 * 1000, // Her 30 dakika
  });

  return {
    metrics,
    isLoading,
  };
}

// Uyumluluk denetimi hook'u
export function useComplianceAudit() {
  const [auditHistory, setAuditHistory] = useState([
    {
      id: '1',
      date: new Date('2024-01-15'),
      type: 'Otomatik Kontrol',
      result: 'Uyumlu',
      issues: 0,
      recommendations: 2,
      auditor: 'Sistem',
    },
    {
      id: '2',
      date: new Date('2024-01-01'),
      type: 'Manuel Denetim',
      result: 'Uyumlu',
      issues: 1,
      recommendations: 3,
      auditor: 'Veri Koruma Uzmanı',
    },
  ]);

  const runComplianceAudit = useMutation({
    mutationFn: async (auditType: 'automatic' | 'manual') => {
      const report = await gdprService.generateComplianceReport();
      
      const newAudit = {
        id: Date.now().toString(),
        date: new Date(),
        type: auditType === 'automatic' ? 'Otomatik Kontrol' : 'Manuel Denetim',
        result: report.overview.compliant ? 'Uyumlu' : 'Uyumsuz',
        issues: report.complianceIssues.length,
        recommendations: report.recommendations.length,
        auditor: auditType === 'automatic' ? 'Sistem' : 'Veri Koruma Uzmanı',
      };

      setAuditHistory(prev => [newAudit, ...prev]);
      return newAudit;
    },
  });

  useEffect(() => {
    if (runComplianceAudit.isSuccess && runComplianceAudit.data) {
      const result = runComplianceAudit.data;
      toast({
        title: "Uyumluluk Denetimi Tamamlandı",
        description: `Sonuç: ${result.result} - ${result.issues} sorun, ${result.recommendations} öneri`,
        variant: result.result === 'Uyumlu' ? "default" : "destructive",
      });
    }
  }, [runComplianceAudit.isSuccess, runComplianceAudit.data]);

  return {
    auditHistory,
    runComplianceAudit,
    isAuditing: runComplianceAudit.isPending,
  };
}

// Tüm hook'ları export et
export {
  gdprService,
  GDPRDataCategory,
  LegalBasis,
  AnonymizationTechnique,
  type PersonalData,
  type ConsentRecord,
}; 