// MQTT Data Stream Service
// Modern Senaryo: Fabrikadaki tüm IoT cihazlarından gerçek zamanlı veri toplama ve dağıtım

export interface MQTTMessage {
  id: string;
  topic: string;
  payload: any;
  timestamp: Date;
  qos: 0 | 1 | 2;
  retained: boolean;
  deviceId: string;
  messageType: 'sensor_data' | 'alarm' | 'status' | 'command' | 'heartbeat';
}

export interface MQTTTopic {
  topic: string;
  description: string;
  dataType: string;
  updateFrequency: number; // seconds
  subscribers: number;
  lastMessage?: Date;
  messageCount: number;
  isActive: boolean;
}

export interface MQTTDevice {
  deviceId: string;
  deviceName: string;
  deviceType: 'sensor' | 'plc' | 'gateway' | 'actuator' | 'camera';
  location: string;
  isOnline: boolean;
  lastSeen: Date;
  publishedTopics: string[];
  subscribedTopics: string[];
  messagesSent: number;
  messagesReceived: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  batteryLevel?: number;
  signalStrength?: number;
}

export interface MQTTBrokerStats {
  totalConnections: number;
  activeConnections: number;
  totalMessages: number;
  messagesPerSecond: number;
  totalTopics: number;
  activeTopics: number;
  dataVolume: number; // MB
  uptime: number; // seconds
  lastRestart: Date;
}

export interface DataStreamMetrics {
  totalDataPoints: number;
  dataPointsPerSecond: number;
  averageLatency: number; // ms
  dataLossPercentage: number;
  compressionRatio: number;
  bandwidthUsage: number; // Mbps
  errorRate: number;
  duplicateMessages: number;
}

class MQTTDataStreamService {
  private static instance: MQTTDataStreamService;
  private messages: MQTTMessage[] = [];
  private topics: Map<string, MQTTTopic> = new Map();
  private devices: Map<string, MQTTDevice> = new Map();
  private subscribers: Map<string, ((message: MQTTMessage) => void)[]> = new Map();
  private brokerStats: MQTTBrokerStats;
  private streamMetrics: DataStreamMetrics;
  private isConnected: boolean = true;
  private messageIdCounter: number = 1;

  private constructor() {
    this.initializeBrokerStats();
    this.initializeStreamMetrics();
    this.initializeDevices();
    this.initializeTopics();
    this.startDataSimulation();
    this.startMetricsCollection();
  }

  public static getInstance(): MQTTDataStreamService {
    if (!MQTTDataStreamService.instance) {
      MQTTDataStreamService.instance = new MQTTDataStreamService();
    }
    return MQTTDataStreamService.instance;
  }

  private initializeBrokerStats(): void {
    this.brokerStats = {
      totalConnections: 0,
      activeConnections: 0,
      totalMessages: 0,
      messagesPerSecond: 0,
      totalTopics: 0,
      activeTopics: 0,
      dataVolume: 0,
      uptime: 0,
      lastRestart: new Date()
    };
  }

  private initializeStreamMetrics(): void {
    this.streamMetrics = {
      totalDataPoints: 0,
      dataPointsPerSecond: 0,
      averageLatency: 12.5,
      dataLossPercentage: 0.02,
      compressionRatio: 3.2,
      bandwidthUsage: 2.8,
      errorRate: 0.001,
      duplicateMessages: 0
    };
  }

  private initializeDevices(): void {
    const deviceConfigs = [
      {
        deviceId: 'temp-sensor-001',
        deviceName: 'Kalıp Sıcaklık Sensörü #1',
        deviceType: 'sensor' as const,
        location: 'Üretim Hattı A - Enjeksiyon',
        publishedTopics: ['factory/production/line-a/temperature', 'factory/production/line-a/status'],
        subscribedTopics: ['factory/commands/calibration'],
        batteryLevel: 85,
        signalStrength: 92
      },
      {
        deviceId: 'pressure-sensor-002',
        deviceName: 'Hidrolik Basınç Sensörü',
        deviceType: 'sensor' as const,
        location: 'Üretim Hattı A - Hidrolik Sistem',
        publishedTopics: ['factory/production/line-a/pressure', 'factory/production/line-a/vibration'],
        subscribedTopics: ['factory/commands/maintenance'],
        batteryLevel: 78,
        signalStrength: 88
      },
      {
        deviceId: 'plc-siemens-001',
        deviceName: 'Siemens S7-1500 PLC',
        deviceType: 'plc' as const,
        location: 'Kontrol Paneli A',
        publishedTopics: ['factory/plc/siemens/data', 'factory/plc/siemens/alarms', 'factory/plc/siemens/status'],
        subscribedTopics: ['factory/commands/plc', 'factory/commands/production'],
        signalStrength: 98
      },
      {
        deviceId: 'gateway-edge-001',
        deviceName: 'Edge Gateway Ana',
        deviceType: 'gateway' as const,
        location: 'Veri Merkezi',
        publishedTopics: ['factory/edge/analytics', 'factory/edge/health', 'factory/edge/sync'],
        subscribedTopics: ['factory/commands/edge', 'factory/cloud/sync'],
        signalStrength: 95
      },
      {
        deviceId: 'flow-sensor-003',
        deviceName: 'Su Akış Sensörü',
        deviceType: 'sensor' as const,
        location: 'Su Arıtma Ünitesi',
        publishedTopics: ['factory/water/flow', 'factory/water/quality'],
        subscribedTopics: ['factory/commands/water'],
        batteryLevel: 92,
        signalStrength: 85
      },
      {
        deviceId: 'vision-camera-001',
        deviceName: 'Kalite Kontrol Kamerası',
        deviceType: 'camera' as const,
        location: 'Kalite Kontrol İstasyonu',
        publishedTopics: ['factory/quality/vision', 'factory/quality/defects'],
        subscribedTopics: ['factory/commands/quality'],
        signalStrength: 90
      }
    ];

    deviceConfigs.forEach(config => {
      const device: MQTTDevice = {
        ...config,
        isOnline: true,
        lastSeen: new Date(),
        messagesSent: Math.floor(Math.random() * 10000) + 1000,
        messagesReceived: Math.floor(Math.random() * 1000) + 100,
        connectionQuality: 'excellent'
      };
      this.devices.set(device.deviceId, device);
    });

    this.brokerStats.totalConnections = this.devices.size;
    this.brokerStats.activeConnections = Array.from(this.devices.values()).filter(d => d.isOnline).length;
  }

  private initializeTopics(): void {
    const topicConfigs = [
      {
        topic: 'factory/production/line-a/temperature',
        description: 'Üretim hattı A sıcaklık verileri',
        dataType: 'float',
        updateFrequency: 2
      },
      {
        topic: 'factory/production/line-a/pressure',
        description: 'Hidrolik sistem basınç verileri',
        dataType: 'float',
        updateFrequency: 1
      },
      {
        topic: 'factory/production/line-a/status',
        description: 'Üretim hattı durum bilgileri',
        dataType: 'json',
        updateFrequency: 5
      },
      {
        topic: 'factory/plc/siemens/data',
        description: 'Siemens PLC veri akışı',
        dataType: 'json',
        updateFrequency: 1
      },
      {
        topic: 'factory/plc/siemens/alarms',
        description: 'PLC alarm bildirimleri',
        dataType: 'json',
        updateFrequency: 0 // Event-based
      },
      {
        topic: 'factory/water/flow',
        description: 'Su akış hızı verileri',
        dataType: 'float',
        updateFrequency: 3
      },
      {
        topic: 'factory/water/quality',
        description: 'Su kalitesi parametreleri',
        dataType: 'json',
        updateFrequency: 10
      },
      {
        topic: 'factory/quality/vision',
        description: 'Görsel kalite kontrol verileri',
        dataType: 'json',
        updateFrequency: 0.5
      },
      {
        topic: 'factory/edge/analytics',
        description: 'Edge computing analiz sonuçları',
        dataType: 'json',
        updateFrequency: 5
      },
      {
        topic: 'factory/energy/consumption',
        description: 'Enerji tüketim verileri',
        dataType: 'json',
        updateFrequency: 2
      }
    ];

    topicConfigs.forEach(config => {
      const topic: MQTTTopic = {
        ...config,
        subscribers: Math.floor(Math.random() * 5) + 1,
        messageCount: Math.floor(Math.random() * 50000) + 10000,
        isActive: true
      };
      this.topics.set(topic.topic, topic);
    });

    this.brokerStats.totalTopics = this.topics.size;
    this.brokerStats.activeTopics = Array.from(this.topics.values()).filter(t => t.isActive).length;
  }

  private startDataSimulation(): void {
    setInterval(() => {
      this.simulateDeviceMessages();
      this.updateDeviceStatus();
      this.updateBrokerStats();
    }, 1000); // Her saniye
  }

  private simulateDeviceMessages(): void {
    this.devices.forEach(device => {
      if (!device.isOnline) return;

      device.publishedTopics.forEach(topicName => {
        const topic = this.topics.get(topicName);
        if (!topic || !topic.isActive) return;

        // Güncelleme frekansına göre mesaj gönder
        if (topic.updateFrequency === 0 || Math.random() < (1 / topic.updateFrequency)) {
          const message = this.generateMessage(device, topicName);
          this.publishMessage(message);
        }
      });
    });
  }

  private generateMessage(device: MQTTDevice, topicName: string): MQTTMessage {
    const topic = this.topics.get(topicName);
    let payload: any;

    // Topic'e göre gerçekçi veri üret
    switch (topicName) {
      case 'factory/production/line-a/temperature':
        payload = {
          value: 185.5 + (Math.random() - 0.5) * 10,
          unit: '°C',
          sensorId: device.deviceId,
          quality: 'good'
        };
        break;

      case 'factory/production/line-a/pressure':
        payload = {
          value: 180.2 + (Math.random() - 0.5) * 20,
          unit: 'bar',
          sensorId: device.deviceId,
          quality: 'good'
        };
        break;

      case 'factory/production/line-a/status':
        payload = {
          status: Math.random() > 0.1 ? 'running' : 'idle',
          bottleCount: Math.floor(Math.random() * 5) + 1,
          lineSpeed: 850 + (Math.random() - 0.5) * 50,
          efficiency: 85 + Math.random() * 15
        };
        break;

      case 'factory/plc/siemens/data':
        payload = {
          cpuUsage: 20 + Math.random() * 60,
          memoryUsage: 40 + Math.random() * 40,
          cycleTime: 10 + Math.random() * 5,
          ioStatus: 'normal',
          tags: {
            'DB1.DBD0': Math.floor(Math.random() * 1000),
            'DB1.DBD4': 850 + (Math.random() - 0.5) * 50,
            'M0.0': Math.random() > 0.95
          }
        };
        break;

      case 'factory/water/flow':
        payload = {
          value: 125.8 + (Math.random() - 0.5) * 20,
          unit: 'L/min',
          sensorId: device.deviceId,
          quality: 'good'
        };
        break;

      case 'factory/water/quality':
        payload = {
          ph: 7.2 + (Math.random() - 0.5) * 0.5,
          chlorine: 0.8 + (Math.random() - 0.5) * 0.2,
          turbidity: 0.1 + Math.random() * 0.1,
          temperature: 15 + Math.random() * 5
        };
        break;

      case 'factory/quality/vision':
        payload = {
          defectDetected: Math.random() < 0.02,
          bottleShape: 95 + Math.random() * 5,
          labelAlignment: 98 + Math.random() * 2,
          surfaceQuality: 97 + Math.random() * 3,
          confidence: 85 + Math.random() * 15
        };
        break;

      case 'factory/edge/analytics':
        payload = {
          anomalyScore: Math.random() * 100,
          predictedMaintenance: Math.random() < 0.1,
          efficiency: 85 + Math.random() * 15,
          recommendations: Math.random() < 0.2 ? ['Check temperature sensor', 'Schedule maintenance'] : []
        };
        break;

      case 'factory/energy/consumption':
        payload = {
          totalPower: 150 + Math.random() * 50,
          efficiency: 85 + Math.random() * 15,
          carbonFootprint: 75 + Math.random() * 25,
          cost: 2.5 + Math.random() * 1
        };
        break;

      default:
        payload = {
          value: Math.random() * 100,
          timestamp: new Date().toISOString()
        };
    }

    return {
      id: `msg-${this.messageIdCounter++}`,
      topic: topicName,
      payload,
      timestamp: new Date(),
      qos: Math.random() > 0.8 ? 1 : 0,
      retained: Math.random() > 0.9,
      deviceId: device.deviceId,
      messageType: this.getMessageType(topicName)
    };
  }

  private getMessageType(topicName: string): MQTTMessage['messageType'] {
    if (topicName.includes('alarm')) return 'alarm';
    if (topicName.includes('status')) return 'status';
    if (topicName.includes('command')) return 'command';
    if (topicName.includes('heartbeat')) return 'heartbeat';
    return 'sensor_data';
  }

  private publishMessage(message: MQTTMessage): void {
    // Mesajı kaydet
    this.messages.push(message);
    
    // Son 10000 mesajı tut
    if (this.messages.length > 10000) {
      this.messages = this.messages.slice(-10000);
    }

    // Topic istatistiklerini güncelle
    const topic = this.topics.get(message.topic);
    if (topic) {
      topic.messageCount++;
      topic.lastMessage = message.timestamp;
    }

    // Device istatistiklerini güncelle
    const device = this.devices.get(message.deviceId);
    if (device) {
      device.messagesSent++;
      device.lastSeen = message.timestamp;
    }

    // Subscriber'lara bildir
    const topicSubscribers = this.subscribers.get(message.topic) || [];
    const wildcardSubscribers = this.subscribers.get('*') || [];
    
    [...topicSubscribers, ...wildcardSubscribers].forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });

    // Broker istatistiklerini güncelle
    this.brokerStats.totalMessages++;
    this.brokerStats.dataVolume += this.calculateMessageSize(message) / (1024 * 1024); // MB
  }

  private calculateMessageSize(message: MQTTMessage): number {
    // Basit mesaj boyutu hesaplama (bytes)
    return JSON.stringify(message).length;
  }

  private updateDeviceStatus(): void {
    this.devices.forEach(device => {
      // Rastgele bağlantı problemleri simüle et
      if (Math.random() < 0.001) { // %0.1 olasılık
        device.isOnline = false;
        device.connectionQuality = 'disconnected';
      } else if (!device.isOnline && Math.random() < 0.1) { // %10 olasılık ile geri bağlan
        device.isOnline = true;
        device.connectionQuality = 'excellent';
        device.lastSeen = new Date();
      }

      // Sinyal gücü ve bağlantı kalitesi güncelle
      if (device.isOnline) {
        device.signalStrength = Math.max(60, Math.min(100, 
          device.signalStrength! + (Math.random() - 0.5) * 5
        ));

        if (device.signalStrength! > 90) device.connectionQuality = 'excellent';
        else if (device.signalStrength! > 75) device.connectionQuality = 'good';
        else device.connectionQuality = 'poor';

        // Batarya seviyesi güncelle (sensörler için)
        if (device.batteryLevel !== undefined) {
          device.batteryLevel = Math.max(0, device.batteryLevel - Math.random() * 0.01);
        }
      }
    });

    this.brokerStats.activeConnections = Array.from(this.devices.values()).filter(d => d.isOnline).length;
  }

  private updateBrokerStats(): void {
    this.brokerStats.uptime++;
    
    // Saniye başına mesaj sayısını hesapla
    const recentMessages = this.messages.filter(m => 
      Date.now() - m.timestamp.getTime() < 1000
    );
    this.brokerStats.messagesPerSecond = recentMessages.length;

    // Stream metriklerini güncelle
    this.streamMetrics.totalDataPoints = this.messages.length;
    this.streamMetrics.dataPointsPerSecond = this.brokerStats.messagesPerSecond;
    this.streamMetrics.averageLatency = 10 + Math.random() * 10;
    this.streamMetrics.bandwidthUsage = 2 + Math.random() * 2;
  }

  private startMetricsCollection(): void {
    setInterval(() => {
      this.collectPerformanceMetrics();
    }, 5000); // Her 5 saniyede metrik toplama
  }

  private collectPerformanceMetrics(): void {
    // Veri kaybı simülasyonu
    this.streamMetrics.dataLossPercentage = Math.random() * 0.1;
    
    // Hata oranı simülasyonu
    this.streamMetrics.errorRate = Math.random() * 0.01;
    
    // Sıkıştırma oranı
    this.streamMetrics.compressionRatio = 2.8 + Math.random() * 1;
    
    // Duplicate mesajlar
    this.streamMetrics.duplicateMessages += Math.random() < 0.001 ? 1 : 0;
  }

  // Public Methods
  public subscribe(topic: string, callback: (message: MQTTMessage) => void): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic)!.push(callback);

    // Topic subscriber sayısını güncelle
    const topicObj = this.topics.get(topic);
    if (topicObj) {
      topicObj.subscribers++;
    }
  }

  public unsubscribe(topic: string, callback: (message: MQTTMessage) => void): void {
    const subscribers = this.subscribers.get(topic);
    if (subscribers) {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
        
        // Topic subscriber sayısını güncelle
        const topicObj = this.topics.get(topic);
        if (topicObj) {
          topicObj.subscribers = Math.max(0, topicObj.subscribers - 1);
        }
      }
    }
  }

  public getRecentMessages(topic?: string, limit: number = 100): MQTTMessage[] {
    let filteredMessages = this.messages;
    
    if (topic) {
      filteredMessages = this.messages.filter(m => m.topic === topic);
    }
    
    return filteredMessages.slice(-limit).reverse();
  }

  public getTopics(): MQTTTopic[] {
    return Array.from(this.topics.values());
  }

  public getDevices(): MQTTDevice[] {
    return Array.from(this.devices.values());
  }

  public getBrokerStats(): MQTTBrokerStats {
    return { ...this.brokerStats };
  }

  public getStreamMetrics(): DataStreamMetrics {
    return { ...this.streamMetrics };
  }

  public isConnectedToBroker(): boolean {
    return this.isConnected;
  }

  public simulateNetworkIssue(): void {
    this.isConnected = false;
    console.log('🔴 MQTT Broker bağlantısı kesildi');
    
    setTimeout(() => {
      this.isConnected = true;
      console.log('🟢 MQTT Broker bağlantısı geri geldi');
    }, Math.random() * 10000 + 5000); // 5-15 saniye
  }

  public getTopicHierarchy(): any {
    const hierarchy: any = {};
    
    this.topics.forEach((topic, topicName) => {
      const parts = topicName.split('/');
      let current = hierarchy;
      
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = index === parts.length - 1 ? topic : {};
        }
        current = current[part];
      });
    });
    
    return hierarchy;
  }

  public getDataQualityReport(): any {
    return {
      totalMessages: this.messages.length,
      messageTypes: this.getMessageTypeDistribution(),
      deviceHealth: this.getDeviceHealthSummary(),
      topicActivity: this.getTopicActivitySummary(),
      qualityMetrics: this.streamMetrics,
      recommendations: this.generateQualityRecommendations()
    };
  }

  private getMessageTypeDistribution(): any {
    const distribution: any = {};
    this.messages.forEach(message => {
      distribution[message.messageType] = (distribution[message.messageType] || 0) + 1;
    });
    return distribution;
  }

  private getDeviceHealthSummary(): any {
    const devices = Array.from(this.devices.values());
    return {
      total: devices.length,
      online: devices.filter(d => d.isOnline).length,
      excellent: devices.filter(d => d.connectionQuality === 'excellent').length,
      good: devices.filter(d => d.connectionQuality === 'good').length,
      poor: devices.filter(d => d.connectionQuality === 'poor').length,
      lowBattery: devices.filter(d => d.batteryLevel && d.batteryLevel < 20).length
    };
  }

  private getTopicActivitySummary(): any {
    const topics = Array.from(this.topics.values());
    return {
      total: topics.length,
      active: topics.filter(t => t.isActive).length,
      highFrequency: topics.filter(t => t.updateFrequency > 0 && t.updateFrequency <= 1).length,
      mediumFrequency: topics.filter(t => t.updateFrequency > 1 && t.updateFrequency <= 5).length,
      lowFrequency: topics.filter(t => t.updateFrequency > 5).length
    };
  }

  private generateQualityRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.streamMetrics.dataLossPercentage > 0.05) {
      recommendations.push('Veri kaybı oranı yüksek - ağ bağlantısını kontrol edin');
    }
    
    if (this.streamMetrics.averageLatency > 50) {
      recommendations.push('Ortalama gecikme yüksek - broker performansını optimize edin');
    }
    
    if (this.streamMetrics.errorRate > 0.005) {
      recommendations.push('Hata oranı yüksek - cihaz konfigürasyonlarını gözden geçirin');
    }
    
    const lowBatteryDevices = Array.from(this.devices.values()).filter(d => d.batteryLevel && d.batteryLevel < 20);
    if (lowBatteryDevices.length > 0) {
      recommendations.push(`${lowBatteryDevices.length} cihazın bataryası düşük - değiştirin`);
    }
    
    return recommendations;
  }
}

export default MQTTDataStreamService; 