// Edge Computing Service - Yerel Veri İşleme ve Analiz
// Modern Senaryo: Fabrikada internet bağlantısı kesilse bile kritik analizler devam eder

export interface EdgeDevice {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'processing';
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  temperature: number;
  lastSync: Date;
  cloudConnected: boolean;
  localProcessingActive: boolean;
}

export interface EdgeAnalysis {
  id: string;
  deviceId: string;
  analysisType: 'anomaly_detection' | 'predictive_maintenance' | 'quality_control' | 'energy_optimization';
  result: any;
  confidence: number;
  timestamp: Date;
  syncedToCloud: boolean;
  criticalAlert: boolean;
}

export interface LocalDataBuffer {
  id: string;
  deviceId: string;
  dataType: string;
  data: any[];
  bufferSize: number;
  lastProcessed: Date;
  pendingSync: boolean;
}

class EdgeComputingService {
  private static instance: EdgeComputingService;
  private edgeDevices: EdgeDevice[] = [];
  private localAnalyses: EdgeAnalysis[] = [];
  private dataBuffers: LocalDataBuffer[] = [];
  private isCloudConnected: boolean = true;
  private subscribers: ((data: any) => void)[] = [];

  private constructor() {
    this.initializeEdgeDevices();
    this.startLocalProcessing();
    this.simulateNetworkConditions();
  }

  public static getInstance(): EdgeComputingService {
    if (!EdgeComputingService.instance) {
      EdgeComputingService.instance = new EdgeComputingService();
    }
    return EdgeComputingService.instance;
  }

  private initializeEdgeDevices(): void {
    this.edgeDevices = [
      {
        id: 'edge-001',
        name: 'Ana Üretim Edge Gateway',
        location: 'Üretim Hattı A',
        status: 'online',
        cpuUsage: 45,
        memoryUsage: 62,
        storageUsage: 78,
        temperature: 42.5,
        lastSync: new Date(),
        cloudConnected: true,
        localProcessingActive: true
      },
      {
        id: 'edge-002',
        name: 'Paketleme Edge Node',
        location: 'Paketleme Bölümü',
        status: 'online',
        cpuUsage: 38,
        memoryUsage: 55,
        storageUsage: 65,
        temperature: 39.8,
        lastSync: new Date(),
        cloudConnected: true,
        localProcessingActive: true
      },
      {
        id: 'edge-003',
        name: 'Kalite Kontrol Edge AI',
        location: 'QC Laboratuvarı',
        status: 'processing',
        cpuUsage: 78,
        memoryUsage: 85,
        storageUsage: 45,
        temperature: 48.2,
        lastSync: new Date(),
        cloudConnected: true,
        localProcessingActive: true
      }
    ];

    // Yerel veri tamponlarını başlat
    this.dataBuffers = [
      {
        id: 'buffer-001',
        deviceId: 'edge-001',
        dataType: 'production_metrics',
        data: [],
        bufferSize: 1000,
        lastProcessed: new Date(),
        pendingSync: false
      },
      {
        id: 'buffer-002',
        deviceId: 'edge-002',
        dataType: 'packaging_quality',
        data: [],
        bufferSize: 500,
        lastProcessed: new Date(),
        pendingSync: false
      },
      {
        id: 'buffer-003',
        deviceId: 'edge-003',
        dataType: 'ai_vision_analysis',
        data: [],
        bufferSize: 200,
        lastProcessed: new Date(),
        pendingSync: false
      }
    ];
  }

  private startLocalProcessing(): void {
    setInterval(() => {
      this.processLocalData();
      this.runAnomalyDetection();
      this.performPredictiveMaintenance();
      this.updateEdgeDeviceMetrics();
      this.notifySubscribers();
    }, 3000); // Her 3 saniyede yerel işleme
  }

  private simulateNetworkConditions(): void {
    setInterval(() => {
      // %5 olasılıkla bağlantı problemi simüle et
      if (Math.random() < 0.05) {
        this.isCloudConnected = false;
        console.log('🔴 Bulut bağlantısı kesildi - Edge computing devreye girdi');
        
        // 10-30 saniye sonra bağlantıyı geri getir
        setTimeout(() => {
          this.isCloudConnected = true;
          console.log('🟢 Bulut bağlantısı geri geldi - Veri senkronizasyonu başladı');
          this.syncPendingData();
        }, Math.random() * 20000 + 10000);
      }
    }, 30000); // Her 30 saniyede kontrol et
  }

  private processLocalData(): void {
    this.dataBuffers.forEach(buffer => {
      // Simüle edilmiş veri ekleme
      const newData = this.generateMockData(buffer.dataType);
      buffer.data.push(newData);

      // Buffer boyutu kontrolü
      if (buffer.data.length > buffer.bufferSize) {
        buffer.data = buffer.data.slice(-buffer.bufferSize);
      }

      buffer.lastProcessed = new Date();
      
      if (!this.isCloudConnected) {
        buffer.pendingSync = true;
      }
    });
  }

  private generateMockData(dataType: string): any {
    const timestamp = new Date();
    
    switch (dataType) {
      case 'production_metrics':
        return {
          timestamp,
          bottleCount: Math.floor(Math.random() * 5) + 1,
          lineSpeed: 850 + (Math.random() - 0.5) * 50,
          temperature: 185 + (Math.random() - 0.5) * 10,
          pressure: 180 + (Math.random() - 0.5) * 20,
          vibration: Math.random() * 2 + 0.5
        };
      
      case 'packaging_quality':
        return {
          timestamp,
          labelAlignment: Math.random() * 100,
          sealQuality: Math.random() * 100,
          weightAccuracy: 99.5 + (Math.random() - 0.5) * 1,
          defectDetected: Math.random() < 0.02
        };
      
      case 'ai_vision_analysis':
        return {
          timestamp,
          bottleShape: Math.random() * 100,
          surfaceQuality: Math.random() * 100,
          colorConsistency: Math.random() * 100,
          dimensionAccuracy: 99.8 + (Math.random() - 0.5) * 0.4
        };
      
      default:
        return { timestamp, value: Math.random() * 100 };
    }
  }

  private runAnomalyDetection(): void {
    this.dataBuffers.forEach(buffer => {
      if (buffer.data.length < 10) return;

      const recentData = buffer.data.slice(-10);
      let anomalyDetected = false;
      let anomalyType = '';

      // Basit anomali tespiti algoritması
      if (buffer.dataType === 'production_metrics') {
        const avgTemp = recentData.reduce((sum, d) => sum + d.temperature, 0) / recentData.length;
        const avgPressure = recentData.reduce((sum, d) => sum + d.pressure, 0) / recentData.length;
        
        if (avgTemp > 195 || avgTemp < 175) {
          anomalyDetected = true;
          anomalyType = 'temperature_anomaly';
        }
        
        if (avgPressure > 200 || avgPressure < 160) {
          anomalyDetected = true;
          anomalyType = 'pressure_anomaly';
        }
      }

      if (anomalyDetected) {
        const analysis: EdgeAnalysis = {
          id: `analysis-${Date.now()}`,
          deviceId: buffer.deviceId,
          analysisType: 'anomaly_detection',
          result: {
            anomalyType,
            severity: Math.random() > 0.7 ? 'high' : 'medium',
            recommendation: this.getAnomalyRecommendation(anomalyType)
          },
          confidence: Math.random() * 30 + 70,
          timestamp: new Date(),
          syncedToCloud: this.isCloudConnected,
          criticalAlert: Math.random() > 0.8
        };

        this.localAnalyses.push(analysis);
      }
    });
  }

  private performPredictiveMaintenance(): void {
    this.edgeDevices.forEach(device => {
      // Basit tahmine dayalı bakım analizi
      const maintenanceScore = this.calculateMaintenanceScore(device);
      
      if (maintenanceScore > 75) {
        const analysis: EdgeAnalysis = {
          id: `maintenance-${Date.now()}`,
          deviceId: device.id,
          analysisType: 'predictive_maintenance',
          result: {
            maintenanceScore,
            recommendedAction: maintenanceScore > 90 ? 'immediate_maintenance' : 'schedule_maintenance',
            estimatedDaysUntilFailure: Math.floor(Math.random() * 30) + 5,
            components: this.getMaintenanceComponents(maintenanceScore)
          },
          confidence: Math.random() * 20 + 80,
          timestamp: new Date(),
          syncedToCloud: this.isCloudConnected,
          criticalAlert: maintenanceScore > 90
        };

        this.localAnalyses.push(analysis);
      }
    });
  }

  private calculateMaintenanceScore(device: EdgeDevice): number {
    // Basit bakım skoru hesaplama
    let score = 0;
    score += device.cpuUsage > 80 ? 30 : device.cpuUsage > 60 ? 15 : 0;
    score += device.memoryUsage > 85 ? 25 : device.memoryUsage > 70 ? 10 : 0;
    score += device.temperature > 50 ? 35 : device.temperature > 45 ? 20 : 0;
    score += Math.random() * 20; // Rastgele faktörler
    
    return Math.min(score, 100);
  }

  private getAnomalyRecommendation(anomalyType: string): string {
    const recommendations = {
      temperature_anomaly: 'Soğutma sistemini kontrol edin, kalıp sıcaklığını ayarlayın',
      pressure_anomaly: 'Hidrolik sistem basıncını kontrol edin, pompa performansını değerlendirin',
      vibration_anomaly: 'Motor yatakları ve bağlantıları kontrol edin',
      quality_anomaly: 'Kalite kontrol parametrelerini gözden geçirin'
    };
    
    return recommendations[anomalyType] || 'Sistem parametrelerini kontrol edin';
  }

  private getMaintenanceComponents(score: number): string[] {
    const components = ['Motor Yatakları', 'Hidrolik Pompalar', 'Soğutma Sistemi', 'Sensörler', 'Konveyör Bantları'];
    const count = score > 90 ? 3 : score > 75 ? 2 : 1;
    
    return components.sort(() => Math.random() - 0.5).slice(0, count);
  }

  private updateEdgeDeviceMetrics(): void {
    this.edgeDevices.forEach(device => {
      // Gerçekçi metrik güncellemeleri
      device.cpuUsage = Math.max(10, Math.min(95, device.cpuUsage + (Math.random() - 0.5) * 10));
      device.memoryUsage = Math.max(20, Math.min(95, device.memoryUsage + (Math.random() - 0.5) * 8));
      device.storageUsage = Math.max(30, Math.min(95, device.storageUsage + (Math.random() - 0.5) * 2));
      device.temperature = Math.max(25, Math.min(60, device.temperature + (Math.random() - 0.5) * 3));
      
      device.cloudConnected = this.isCloudConnected;
      
      if (this.isCloudConnected) {
        device.lastSync = new Date();
      }
    });
  }

  private syncPendingData(): void {
    this.dataBuffers.forEach(buffer => {
      if (buffer.pendingSync) {
        buffer.pendingSync = false;
        console.log(`📤 ${buffer.dataType} verileri buluta senkronize edildi`);
      }
    });

    this.localAnalyses.forEach(analysis => {
      if (!analysis.syncedToCloud) {
        analysis.syncedToCloud = true;
        console.log(`📤 ${analysis.analysisType} analizi buluta senkronize edildi`);
      }
    });
  }

  private notifySubscribers(): void {
    const data = {
      edgeDevices: this.edgeDevices,
      localAnalyses: this.localAnalyses.slice(-10), // Son 10 analiz
      dataBuffers: this.dataBuffers.map(buffer => ({
        ...buffer,
        data: buffer.data.slice(-5) // Son 5 veri noktası
      })),
      cloudConnected: this.isCloudConnected,
      timestamp: new Date()
    };

    this.subscribers.forEach(callback => callback(data));
  }

  // Public methods
  public subscribe(callback: (data: any) => void): void {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: (data: any) => void): void {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  }

  public getEdgeDevices(): EdgeDevice[] {
    return [...this.edgeDevices];
  }

  public getLocalAnalyses(): EdgeAnalysis[] {
    return [...this.localAnalyses];
  }

  public getDataBuffers(): LocalDataBuffer[] {
    return [...this.dataBuffers];
  }

  public isCloudConnectionActive(): boolean {
    return this.isCloudConnected;
  }

  public forceCloudDisconnection(): void {
    this.isCloudConnected = false;
    console.log('🔴 Bulut bağlantısı manuel olarak kesildi');
  }

  public restoreCloudConnection(): void {
    this.isCloudConnected = true;
    this.syncPendingData();
    console.log('🟢 Bulut bağlantısı manuel olarak geri getirildi');
  }

  public getCurrentData(): any {
    return {
      edgeDevices: this.edgeDevices,
      localAnalyses: this.localAnalyses.slice(-10), // Son 10 analiz
      dataBuffers: this.dataBuffers.map(buffer => ({
        ...buffer,
        data: buffer.data.slice(-5) // Son 5 veri noktası
      })),
      cloudConnected: this.isCloudConnected,
      timestamp: new Date()
    };
  }

  public getSystemStatus(): any {
    return {
      totalDevices: this.edgeDevices.length,
      onlineDevices: this.edgeDevices.filter(d => d.status === 'online').length,
      processingDevices: this.edgeDevices.filter(d => d.status === 'processing').length,
      cloudConnected: this.isCloudConnected,
      pendingAnalyses: this.localAnalyses.filter(a => !a.syncedToCloud).length,
      criticalAlerts: this.localAnalyses.filter(a => a.criticalAlert).length,
      lastUpdate: new Date()
    };
  }
}

export default EdgeComputingService; 