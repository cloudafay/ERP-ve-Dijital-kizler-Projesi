import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  dataValidationService, 
  ValidationResult, 
  SensorData, 
  ProcessedData, 
  ValidationRule 
} from '../lib/dataValidation';
import { useDigitalTwinStore } from '../lib/store';
import { toast } from '../hooks/use-toast';

// Real-time validation hook
export function useRealTimeValidation() {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const subscriberRef = useRef<((result: ValidationResult) => void) | null>(null);

  const startMonitoring = useCallback(() => {
    if (subscriberRef.current) {
      dataValidationService.unsubscribe(subscriberRef.current);
    }

    subscriberRef.current = (result: ValidationResult) => {
      setValidationResults(prev => {
        const updated = [result, ...prev].slice(0, 100); // Son 100 sonucu tut
        
        // Kritik hatalar için toast bildirimi
        if (!result.isValid && result.errors.some(e => e.severity === 'critical')) {
          toast({
            title: "Kritik Veri Hatası",
            description: result.errors[0].message,
            variant: "destructive",
          });
        }
        
        return updated;
      });
    };

    dataValidationService.subscribe(subscriberRef.current);
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    if (subscriberRef.current) {
      dataValidationService.unsubscribe(subscriberRef.current);
      subscriberRef.current = null;
    }
    setIsMonitoring(false);
  }, []);

  const clearResults = useCallback(() => {
    setValidationResults([]);
  }, []);

  useEffect(() => {
    return () => {
      if (subscriberRef.current) {
        dataValidationService.unsubscribe(subscriberRef.current);
      }
    };
  }, []);

  return {
    validationResults,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearResults,
    criticalErrors: validationResults.filter(r => 
      r.errors.some(e => e.severity === 'critical')
    ),
    warnings: validationResults.filter(r => r.warnings.length > 0),
  };
}

// Sensor data validation hook
export function useSensorDataValidation() {
  const queryClient = useQueryClient();

  const validateSensorData = useMutation({
    mutationFn: async (data: any): Promise<ValidationResult> => {
      return await dataValidationService.validateRawData(data);
    },
    onSuccess: (result, variables) => {
      // Başarılı doğrulama sonrası cache'i güncelle
      queryClient.setQueryData(
        ['validation-result', variables.id], 
        result
      );

      // Geçmiş verilere ekle (doğrulanmış veri ise)
      if (result.isValid) {
        dataValidationService.addHistoricalData(variables as SensorData);
      }
    },
    onError: (error) => {
      toast({
        title: "Veri Doğrulama Hatası",
        description: `Doğrulama işlemi başarısız: ${error}`,
        variant: "destructive",
      });
    },
  });

  const validateBatchData = useMutation({
    mutationFn: async (dataArray: any[]): Promise<ValidationResult[]> => {
      const results = await Promise.all(
        dataArray.map(data => dataValidationService.validateRawData(data))
      );
      return results;
    },
    onSuccess: (results) => {
      const invalidCount = results.filter(r => !r.isValid).length;
      if (invalidCount > 0) {
        toast({
          title: "Toplu Doğrulama Tamamlandı",
          description: `${results.length} veriden ${invalidCount} tanesi geçersiz`,
          variant: invalidCount > results.length / 2 ? "destructive" : "default",
        });
      }
    },
  });

  return {
    validateSensorData,
    validateBatchData,
    isValidating: validateSensorData.isPending || validateBatchData.isPending,
  };
}

// Processed data validation hook
export function useProcessedDataValidation() {
  const validateProcessedData = useMutation({
    mutationFn: async ({ 
      processedData, 
      sourceData 
    }: { 
      processedData: any; 
      sourceData: SensorData[] 
    }): Promise<ValidationResult> => {
      return await dataValidationService.validateProcessedData(processedData, sourceData);
    },
    onError: (error) => {
      toast({
        title: "İşlenmiş Veri Doğrulama Hatası",
        description: `Doğrulama işlemi başarısız: ${error}`,
        variant: "destructive",
      });
    },
  });

  return {
    validateProcessedData,
    isValidating: validateProcessedData.isPending,
  };
}

// Validation rules management hook
export function useValidationRules() {
  const { data: rules, isLoading, error, refetch } = useQuery({
    queryKey: ['validation-rules'],
    queryFn: async (): Promise<ValidationRule[]> => {
      // Gerçek uygulamada API'den gelecek
      return []; // Şimdilik boş array
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  const addRule = useMutation({
    mutationFn: async (rule: Omit<ValidationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ValidationRule> => {
      const newRule: ValidationRule = {
        ...rule,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      dataValidationService.addValidationRule(newRule);
      return newRule;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Doğrulama Kuralı Eklendi",
        description: "Yeni kural başarıyla oluşturuldu",
      });
    },
  });

  const updateRule = useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<ValidationRule> 
    }): Promise<ValidationRule> => {
      // Gerçek uygulamada API update
      const updatedRule = { ...updates, id, updatedAt: new Date() } as ValidationRule;
      return updatedRule;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Kural Güncellendi",
        description: "Doğrulama kuralı başarıyla güncellendi",
      });
    },
  });

  const deleteRule = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Gerçek uygulamada API delete
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Kural Silindi",
        description: "Doğrulama kuralı başarıyla silindi",
      });
    },
  });

  return {
    rules: rules || [],
    isLoading,
    error,
    addRule,
    updateRule,
    deleteRule,
    refetch,
  };
}

// Data consistency monitoring hook
export function useDataConsistency() {
  const store = useDigitalTwinStore();
  const [consistencyIssues, setConsistencyIssues] = useState<{
    timestamp: Date;
    deviceId: string;
    issueType: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[]>([]);

  const { data: consistencyReport, isLoading } = useQuery({
    queryKey: ['data-consistency-report'],
    queryFn: async () => {
      const report = dataValidationService.getValidationSummary({
        start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Son 24 saat
        end: new Date(),
      });
      return report;
    },
    refetchInterval: 5 * 60 * 1000, // Her 5 dakikada bir
  });

  const checkDeviceConsistency = useCallback(async (deviceId: string) => {
    try {
      const historicalData = dataValidationService.getHistoricalData(deviceId, 50);
      
      if (historicalData.length < 10) {
        return {
          isConsistent: true,
          message: 'Yeterli veri yok',
        };
      }

      // Veri tutarlılığı kontrolü
      const values = historicalData.map(d => d.value);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const stdDev = Math.sqrt(
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
      );

      const outliers = values.filter(val => Math.abs(val - mean) > 3 * stdDev);
      const outlierRatio = outliers.length / values.length;

      return {
        isConsistent: outlierRatio < 0.1, // %10'dan az outlier varsa tutarlı
        outlierRatio,
        mean,
        stdDev,
        message: outlierRatio > 0.1 ? 
          `%${(outlierRatio * 100).toFixed(1)} veri aykırı değer` : 
          'Veriler tutarlı',
      };
    } catch (error) {
      return {
        isConsistent: false,
        message: `Tutarlılık kontrolü hatası: ${error}`,
      };
    }
  }, []);

  const monitorAllDevices = useCallback(async () => {
    const machines = store.machines;
    const newIssues: typeof consistencyIssues = [];

    for (const machine of machines) {
      // Her makine için sensör cihazlarını kontrol et
      const deviceIds = [
        `${machine.id}-temperature-sensor`,
        `${machine.id}-vibration-sensor`,
        `${machine.id}-pressure-sensor`,
        `${machine.id}-power-sensor`,
      ];

      for (const deviceId of deviceIds) {
        const result = await checkDeviceConsistency(deviceId);
        
        if (!result.isConsistent) {
          newIssues.push({
            timestamp: new Date(),
            deviceId,
            issueType: 'consistency',
            description: result.message,
            severity: (result.outlierRatio || 0) > 0.2 ? 'high' : 'medium',
          });
        }
      }
    }

    setConsistencyIssues(prev => [...newIssues, ...prev].slice(0, 50));
  }, [store.machines, checkDeviceConsistency]);

  useEffect(() => {
    // İlk monitoring
    monitorAllDevices();

    // Her 10 dakikada bir monitoring
    const interval = setInterval(monitorAllDevices, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [monitorAllDevices]);

  return {
    consistencyReport,
    consistencyIssues,
    isLoading,
    checkDeviceConsistency,
    monitorAllDevices,
    clearIssues: () => setConsistencyIssues([]),
  };
}

// Real-time data quality metrics hook
export function useDataQualityMetrics() {
  const [metrics, setMetrics] = useState({
    totalValidations: 0,
    successRate: 0,
    averageConfidence: 0,
    criticalErrors: 0,
    warningCount: 0,
    lastUpdate: new Date(),
  });

  const { data: qualityTrends, isLoading } = useQuery({
    queryKey: ['data-quality-trends'],
    queryFn: async () => {
      // 24 saatlik trend verileri
      const hours = Array.from({ length: 24 }, (_, i) => {
        const time = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
        return {
          hour: time.getHours(),
          timestamp: time,
          validationCount: Math.floor(Math.random() * 100) + 50,
          successRate: 0.85 + Math.random() * 0.1,
          averageConfidence: 0.8 + Math.random() * 0.15,
        };
      });
      return hours;
    },
    refetchInterval: 5 * 60 * 1000,
  });

  const updateMetrics = useCallback((results: ValidationResult[]) => {
    if (results.length === 0) return;

    const successCount = results.filter(r => r.isValid).length;
    const totalConfidence = results.reduce((sum, r) => sum + r.confidence, 0);
    const criticalCount = results.filter(r => 
      r.errors.some(e => e.severity === 'critical')
    ).length;
    const warningCount = results.reduce((sum, r) => sum + r.warnings.length, 0);

    setMetrics({
      totalValidations: results.length,
      successRate: successCount / results.length,
      averageConfidence: totalConfidence / results.length,
      criticalErrors: criticalCount,
      warningCount,
      lastUpdate: new Date(),
    });
  }, []);

  return {
    metrics,
    qualityTrends: qualityTrends || [],
    isLoading,
    updateMetrics,
  };
}

// Export all hooks
export {
  dataValidationService,
  type ValidationResult,
  type SensorData,
  type ProcessedData,
  type ValidationRule,
}; 