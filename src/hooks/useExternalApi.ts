import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  externalApiService,
  ExternalSystem,
  ExternalSystemType,
  DataFormat,
  SecurityProtocol,
  SyncLog,
  DataMapping,
  ProductionDataDTO,
  InventoryDataDTO,
  QualityDataDTO,
  MaintenanceDataDTO,
} from '../lib/externalApiService';
import { toast } from './use-toast';

// Harici sistem yönetimi hook'u
export function useExternalSystems() {
  const queryClient = useQueryClient();

  const { data: systems, isLoading, refetch } = useQuery({
    queryKey: ['external-systems'],
    queryFn: async () => {
      return externalApiService.getExternalSystems();
    },
    refetchInterval: 30 * 1000, // Her 30 saniyede bir refresh
  });

  const { data: activeSystems } = useQuery({
    queryKey: ['external-systems-active'],
    queryFn: async () => {
      return externalApiService.getActiveExternalSystems();
    },
    refetchInterval: 30 * 1000,
  });

  const addSystem = useMutation({
    mutationFn: async (systemData: {
      name: string;
      type: ExternalSystemType;
      baseUrl: string;
      apiVersion: string;
      format: DataFormat;
      security: SecurityProtocol;
      credentials: Record<string, string>;
      rateLimit?: number;
      timeout?: number;
      description?: string;
    }) => {
      return externalApiService.addExternalSystem({
        ...systemData,
        isActive: true,
      });
    },
  });

  useEffect(() => {
    if (addSystem.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['external-systems'] });
      queryClient.invalidateQueries({ queryKey: ['external-systems-active'] });
      toast({
        title: "Harici Sistem Eklendi",
        description: "Yeni harici sistem başarıyla eklendi",
      });
    }
    if (addSystem.isError) {
      toast({
        title: "Sistem Ekleme Hatası",
        description: `Hata: ${addSystem.error}`,
        variant: "destructive",
      });
    }
  }, [addSystem.isSuccess, addSystem.isError, addSystem.error, queryClient]);

  const updateSystem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ExternalSystem> }) => {
      const success = externalApiService.updateExternalSystem(id, updates);
      if (!success) throw new Error('System not found');
      return success;
    },
  });

  useEffect(() => {
    if (updateSystem.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['external-systems'] });
      toast({
        title: "Sistem Güncellendi",
        description: "Harici sistem başarıyla güncellendi",
      });
    }
    if (updateSystem.isError) {
      toast({
        title: "Güncelleme Hatası",
        description: `Hata: ${updateSystem.error}`,
        variant: "destructive",
      });
    }
  }, [updateSystem.isSuccess, updateSystem.isError, updateSystem.error, queryClient]);

  const deleteSystem = useMutation({
    mutationFn: async (systemId: string) => {
      const success = externalApiService.deleteExternalSystem(systemId);
      if (!success) throw new Error('System not found');
      return success;
    },
  });

  useEffect(() => {
    if (deleteSystem.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['external-systems'] });
      queryClient.invalidateQueries({ queryKey: ['external-systems-active'] });
      toast({
        title: "Sistem Silindi",
        description: "Harici sistem başarıyla silindi",
      });
    }
    if (deleteSystem.isError) {
      toast({
        title: "Silme Hatası",
        description: `Hata: ${deleteSystem.error}`,
        variant: "destructive",
      });
    }
  }, [deleteSystem.isSuccess, deleteSystem.isError, deleteSystem.error, queryClient]);

  const testConnection = useMutation({
    mutationFn: async (systemId: string) => {
      return await externalApiService.testConnection(systemId);
    },
  });

  useEffect(() => {
    if (testConnection.isSuccess && testConnection.data) {
      const result = testConnection.data;
      toast({
        title: "Bağlantı Testi",
        description: result.success 
          ? `Bağlantı başarılı (${result.responseTime}ms)`
          : `Bağlantı başarısız: ${result.error}`,
        variant: result.success ? "default" : "destructive",
      });
    }
  }, [testConnection.isSuccess, testConnection.data]);

  return {
    systems: systems || [],
    activeSystems: activeSystems || [],
    isLoading,
    addSystem,
    updateSystem,
    deleteSystem,
    testConnection,
    refetch,
    isProcessing: addSystem.isPending || updateSystem.isPending || deleteSystem.isPending,
  };
}

// Veri aktarımı hook'u
export function useDataExport() {
  const queryClient = useQueryClient();

  const exportProduction = useMutation({
    mutationFn: async ({
      systemId,
      data,
      options
    }: {
      systemId: string;
      data: ProductionDataDTO[];
      options?: { batchSize?: number; validateData?: boolean };
    }) => {
      return await externalApiService.exportProductionData(systemId, data, options);
    },
  });

  useEffect(() => {
    if (exportProduction.isSuccess && exportProduction.data) {
      const result = exportProduction.data;
      queryClient.invalidateQueries({ queryKey: ['sync-logs'] });
      toast({
        title: "Üretim Verisi Aktarıldı",
        description: `${result.exportedCount} kayıt başarıyla aktarıldı`,
        variant: result.success ? "default" : "destructive",
      });
    }
    if (exportProduction.isError) {
      toast({
        title: "Veri Aktarım Hatası",
        description: `Hata: ${exportProduction.error}`,
        variant: "destructive",
      });
    }
  }, [exportProduction.isSuccess, exportProduction.isError, exportProduction.error, exportProduction.data, queryClient]);

  const exportInventory = useMutation({
    mutationFn: async ({
      systemId,
      data
    }: {
      systemId: string;
      data: InventoryDataDTO[];
    }) => {
      return await externalApiService.exportInventoryData(systemId, data);
    },
  });

  useEffect(() => {
    if (exportInventory.isSuccess && exportInventory.data) {
      const result = exportInventory.data;
      queryClient.invalidateQueries({ queryKey: ['sync-logs'] });
      toast({
        title: "Envanter Verisi Aktarıldı",
        description: `${result.exportedCount} kayıt başarıyla aktarıldı`,
      });
    }
    if (exportInventory.isError) {
      toast({
        title: "Envanter Aktarım Hatası",
        description: `Hata: ${exportInventory.error}`,
        variant: "destructive",
      });
    }
  }, [exportInventory.isSuccess, exportInventory.isError, exportInventory.error, exportInventory.data, queryClient]);

  const exportQuality = useMutation({
    mutationFn: async ({
      systemId,
      data
    }: {
      systemId: string;
      data: QualityDataDTO[];
    }) => {
      return await externalApiService.exportQualityData(systemId, data);
    },
  });

  useEffect(() => {
    if (exportQuality.isSuccess && exportQuality.data) {
      const result = exportQuality.data;
      queryClient.invalidateQueries({ queryKey: ['sync-logs'] });
      toast({
        title: "Kalite Verisi Aktarıldı",
        description: `${result.exportedCount} kayıt başarıyla aktarıldı`,
      });
    }
    if (exportQuality.isError) {
      toast({
        title: "Kalite Aktarım Hatası",
        description: `Hata: ${exportQuality.error}`,
        variant: "destructive",
      });
    }
  }, [exportQuality.isSuccess, exportQuality.isError, exportQuality.error, exportQuality.data, queryClient]);

  const exportMaintenance = useMutation({
    mutationFn: async ({
      systemId,
      data
    }: {
      systemId: string;
      data: MaintenanceDataDTO[];
    }) => {
      return await externalApiService.exportMaintenanceData(systemId, data);
    },
  });

  useEffect(() => {
    if (exportMaintenance.isSuccess && exportMaintenance.data) {
      const result = exportMaintenance.data;
      queryClient.invalidateQueries({ queryKey: ['sync-logs'] });
      toast({
        title: "Bakım Verisi Aktarıldı",
        description: `${result.exportedCount} kayıt başarıyla aktarıldı`,
      });
    }
    if (exportMaintenance.isError) {
      toast({
        title: "Bakım Aktarım Hatası",
        description: `Hata: ${exportMaintenance.error}`,
        variant: "destructive",
      });
    }
  }, [exportMaintenance.isSuccess, exportMaintenance.isError, exportMaintenance.error, exportMaintenance.data, queryClient]);

  return {
    exportProduction,
    exportInventory,
    exportQuality,
    exportMaintenance,
    isExporting: exportProduction.isPending || 
                 exportInventory.isPending || 
                 exportQuality.isPending || 
                 exportMaintenance.isPending,
  };
}

// Sync log'ları ve istatistikler hook'u
export function useSyncMonitoring() {
  const { data: syncLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['sync-logs'],
    queryFn: async () => {
      return externalApiService.getSyncLogs();
    },
    refetchInterval: 10 * 1000, // Her 10 saniyede bir refresh
  });

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['system-statistics'],
    queryFn: async () => {
      return externalApiService.getSystemStatistics();
    },
    refetchInterval: 30 * 1000, // Her 30 saniyede bir refresh
  });

  const getSystemLogs = useCallback((systemId: string) => {
    return externalApiService.getSyncLogs(systemId);
  }, []);

  const getRecentLogs = useCallback((limit: number = 10) => {
    return (syncLogs || [])
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }, [syncLogs]);

  const getFailedSyncs = useCallback(() => {
    return (syncLogs || []).filter(log => log.status === 'error');
  }, [syncLogs]);

  const getRunningSyncs = useCallback(() => {
    return (syncLogs || []).filter(log => log.status === 'running');
  }, [syncLogs]);

  return {
    syncLogs: syncLogs || [],
    statistics,
    isLoading: logsLoading || statsLoading,
    getSystemLogs,
    getRecentLogs,
    getFailedSyncs,
    getRunningSyncs,
  };
}

// Veri mapping yönetimi hook'u
export function useDataMapping() {
  const queryClient = useQueryClient();

  const [selectedSystemId, setSelectedSystemId] = useState<string>('');

  const { data: mappings, isLoading } = useQuery({
    queryKey: ['data-mappings', selectedSystemId],
    queryFn: async () => {
      if (!selectedSystemId) return [];
      return externalApiService.getSystemMappings(selectedSystemId);
    },
    enabled: !!selectedSystemId,
  });

  const addMapping = useMutation({
    mutationFn: async ({
      systemId,
      mapping
    }: {
      systemId: string;
      mapping: Omit<DataMapping, 'id' | 'systemId'>;
    }) => {
      return externalApiService.addDataMapping(systemId, mapping);
    },
  });

  useEffect(() => {
    if (addMapping.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['data-mappings'] });
      toast({
        title: "Mapping Eklendi",
        description: "Veri mapping'i başarıyla eklendi",
      });
    }
    if (addMapping.isError) {
      toast({
        title: "Mapping Ekleme Hatası",
        description: `Hata: ${addMapping.error}`,
        variant: "destructive",
      });
    }
  }, [addMapping.isSuccess, addMapping.isError, addMapping.error, queryClient]);

  return {
    mappings: mappings || [],
    isLoading,
    selectedSystemId,
    setSelectedSystemId,
    addMapping,
    isProcessing: addMapping.isPending,
  };
}

// Mock veri oluşturma hook'u
export function useMockDataGeneration() {
  const generateProductionData = useCallback((count: number = 10): ProductionDataDTO[] => {
    return Array.from({ length: count }, (_, i) => ({
      timestamp: new Date(Date.now() - (count - i) * 60 * 1000).toISOString(),
      machineId: `machine-${Math.floor(Math.random() * 5) + 1}`,
      productionRate: Math.floor(Math.random() * 100) + 50,
      qualityScore: Math.floor(Math.random() * 30) + 70,
      energyConsumption: Math.floor(Math.random() * 50) + 100,
      defectCount: Math.floor(Math.random() * 5),
      operatorId: `operator-${Math.floor(Math.random() * 10) + 1}`,
    }));
  }, []);

  const generateInventoryData = useCallback((count: number = 10): InventoryDataDTO[] => {
    const items = ['bottle-caps', 'plastic-bottles', 'labels', 'water-filters', 'packaging-boxes'];
    
    return Array.from({ length: count }, (_, i) => ({
      itemId: items[i % items.length],
      quantity: Math.floor(Math.random() * 1000) + 100,
      location: `warehouse-${Math.floor(Math.random() * 3) + 1}`,
      lastUpdated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      batchNumber: `BATCH-${Date.now()}-${i}`,
    }));
  }, []);

  const generateQualityData = useCallback((count: number = 10): QualityDataDTO[] => {
    return Array.from({ length: count }, (_, i) => ({
      batchId: `batch-${Date.now()}-${i}`,
      testResults: [
        {
          parameter: 'pH Level',
          value: 6.5 + Math.random() * 2,
          unit: 'pH',
          status: Math.random() > 0.1 ? 'pass' : 'warning',
        },
        {
          parameter: 'Turbidity',
          value: Math.random() * 0.5,
          unit: 'NTU',
          status: Math.random() > 0.05 ? 'pass' : 'fail',
        },
        {
          parameter: 'Temperature',
          value: 20 + Math.random() * 10,
          unit: '°C',
          status: 'pass',
        },
      ],
      inspector: `inspector-${Math.floor(Math.random() * 5) + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }, []);

  const generateMaintenanceData = useCallback((count: number = 10): MaintenanceDataDTO[] => {
    const types: ('preventive' | 'corrective' | 'emergency')[] = ['preventive', 'corrective', 'emergency'];
    const statuses: ('scheduled' | 'in_progress' | 'completed' | 'cancelled')[] = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    
    return Array.from({ length: count }, (_, i) => ({
      equipmentId: `equipment-${Math.floor(Math.random() * 10) + 1}`,
      maintenanceType: types[Math.floor(Math.random() * types.length)],
      scheduledDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      completedDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      technician: `technician-${Math.floor(Math.random() * 8) + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      cost: Math.floor(Math.random() * 5000) + 500,
    }));
  }, []);

  return {
    generateProductionData,
    generateInventoryData,
    generateQualityData,
    generateMaintenanceData,
  };
}

// Tüm hook'ları ve tipleri export et
export {
  ExternalSystemType,
  DataFormat,
  SecurityProtocol,
  type ExternalSystem,
  type SyncLog,
  type DataMapping,
  type ProductionDataDTO,
  type InventoryDataDTO,
  type QualityDataDTO,
  type MaintenanceDataDTO,
}; 