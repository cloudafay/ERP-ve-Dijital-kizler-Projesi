import { SensorData, MachineStatus, useDigitalTwinStore } from './store';

export interface IoTDevice {
  id: string;
  machineId: string;
  type: 'temperature' | 'pressure' | 'vibration' | 'flow' | 'power' | 'humidity';
  name: string;
  location: string;
  status: 'online' | 'offline' | 'error';
  lastHeartbeat: Date;
  batteryLevel?: number;
  signalStrength: number;
  calibrationDate: Date;
  nextCalibration: Date;
}

export interface IoTMessage {
  deviceId: string;
  timestamp: Date;
  messageType: 'data' | 'heartbeat' | 'alert' | 'calibration';
  payload: any;
  qos: 0 | 1 | 2; // Quality of Service
}

export class IoTSimulator {
  private devices: Map<string, IoTDevice> = new Map();
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;
  private store: any;
  private initialized = false;

  constructor() {
    // Store'u lazy initialize et
    this.store = null;
  }

  private initializeStore() {
    if (!this.store && typeof useDigitalTwinStore !== 'undefined') {
      this.store = useDigitalTwinStore.getState();
      if (!this.initialized) {
        this.initializeDevices();
        this.initialized = true;
      }
    }
  }

  private initializeDevices() {
    if (!this.store || !this.store.machines) {
      console.warn('Store not ready, deferring device initialization');
      return;
    }
    
    const machines = this.store.machines;
    
    // Makine sensörleri
    machines.forEach((machine: MachineStatus) => {
      // Her makine için çoklu sensörler oluştur
      const sensorTypes = ['temperature', 'vibration', 'pressure', 'power'];
      
      sensorTypes.forEach((sensorType, index) => {
        const device: IoTDevice = {
          id: `${machine.id}-${sensorType}-sensor`,
          machineId: machine.id,
          type: sensorType as any,
          name: `${machine.name} - ${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Sensörü`,
          location: `Hat ${machine.id.split('-')[1]} - ${machine.type}`,
          status: Math.random() > 0.15 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'), // %85 online, %7.5 offline, %7.5 error
          lastHeartbeat: new Date(Date.now() - Math.random() * 300000), // Son 5 dakika içinde
          batteryLevel: sensorType === 'temperature' ? undefined : Math.floor(Math.random() * 80 + 20), // 20-100% arası
          signalStrength: Math.floor(Math.random() * 40 + 60), // 60-100% arası güçlü sinyal
          calibrationDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Son 90 gün
          nextCalibration: new Date(Date.now() + (180 + Math.random() * 180) * 24 * 60 * 60 * 1000) // 6-12 ay sonra
        };
        
        this.devices.set(device.id, device);
      });
    });

    // Ek bağımsız IoT cihazları ekle
    const additionalDevices = [
      {
        id: 'env-temp-001',
        machineId: 'factory-environment',
        type: 'temperature' as const,
        name: 'Fabrika Ortam Sıcaklığı',
        location: 'Ana Üretim Salonu',
        status: 'online' as const,
        batteryLevel: undefined,
        signalStrength: 95,
        description: 'Genel çevre izleme'
      },
      {
        id: 'env-humidity-001',
        machineId: 'factory-environment',
        type: 'humidity' as const,
        name: 'Nem Ölçer',
        location: 'Ana Üretim Salonu',
        status: 'online' as const,
        batteryLevel: 78,
        signalStrength: 92,
        description: 'Çevre nem kontrolü'
      },
      {
        id: 'air-quality-001',
        machineId: 'factory-environment',
        type: 'flow' as const,
        name: 'Hava Kalitesi Sensörü',
        location: 'Havalandırma Sistemi',
        status: 'online' as const,
        batteryLevel: 45,
        signalStrength: 88,
        description: 'İş güvenliği izleme'
      },
      {
        id: 'water-quality-001',
        machineId: 'quality-control',
        type: 'flow' as const,
        name: 'Su Kalitesi Ölçer',
        location: 'Su Arıtma Ünitesi',
        status: 'online' as const,
        batteryLevel: undefined,
        signalStrength: 85,
        description: 'Hammadde kalite kontrolü'
      },
      {
        id: 'security-cam-001',
        machineId: 'security-system',
        type: 'flow' as const,
        name: 'Güvenlik Kamerası #1',
        location: 'Ana Giriş',
        status: 'online' as const,
        batteryLevel: undefined,
        signalStrength: 98,
        description: 'Güvenlik ve izleme'
      },
      {
        id: 'security-cam-002',
        machineId: 'security-system',
        type: 'flow' as const,
        name: 'Güvenlik Kamerası #2',
        location: 'Üretim Hattı',
        status: 'online' as const,
        batteryLevel: undefined,
        signalStrength: 94,
        description: 'Üretim izleme'
      },
      {
        id: 'access-control-001',
        machineId: 'security-system',
        type: 'flow' as const,
        name: 'Kapı Erişim Kontrolü',
        location: 'Personel Girişi',
        status: 'error' as const,
        batteryLevel: 15,
        signalStrength: 67,
        description: 'Personel erişim takibi'
      },
      {
        id: 'energy-meter-001',
        machineId: 'power-management',
        type: 'power' as const,
        name: 'Ana Elektrik Sayacı',
        location: 'Elektrik Panosu',
        status: 'online' as const,
        batteryLevel: undefined,
        signalStrength: 100,
        description: 'Enerji tüketim izleme'
      },
      {
        id: 'ups-monitor-001',
        machineId: 'power-management',
        type: 'power' as const,
        name: 'UPS İzleme Sistemi',
        location: 'Server Odası',
        status: 'online' as const,
        batteryLevel: 92,
        signalStrength: 89,
        description: 'Kesintisiz güç kaynağı'
      },
      {
        id: 'fire-detector-001',
        machineId: 'safety-system',
        type: 'temperature' as const,
        name: 'Yangın Algılama #1',
        location: 'Üretim Salonu',
        status: 'online' as const,
        batteryLevel: 87,
        signalStrength: 91,
        description: 'Yangın güvenlik sistemi'
      },
      {
        id: 'fire-detector-002',
        machineId: 'safety-system',
        type: 'temperature' as const,
        name: 'Yangın Algılama #2',
        location: 'Depo Alanı',
        status: 'offline' as const,
        batteryLevel: 12,
        signalStrength: 45,
        description: 'Depo güvenlik sistemi'
      },
      {
        id: 'noise-monitor-001',
        machineId: 'environment-monitoring',
        type: 'vibration' as const,
        name: 'Gürültü Ölçer',
        location: 'Üretim Hattı Merkezi',
        status: 'online' as const,
        batteryLevel: 56,
        signalStrength: 83,
        description: 'İş sağlığı ve güvenliği'
      },
      {
        id: 'conveyor-speed-001',
        machineId: 'conveyor-system',
        type: 'flow' as const,
        name: 'Konveyör Hız Sensörü',
        location: 'Ana Konveyör Hattı',
        status: 'online' as const,
        batteryLevel: undefined,
        signalStrength: 96,
        description: 'Taşıma sistemi kontrolü'
      },
      {
        id: 'weight-scale-001',
        machineId: 'quality-control',
        type: 'pressure' as const,
        name: 'Hassas Terazi',
        location: 'Kalite Kontrol Masası',
        status: 'online' as const,
        batteryLevel: undefined,
        signalStrength: 87,
        description: 'Ürün ağırlık kontrolü'
      },
      {
        id: 'barcode-scanner-001',
        machineId: 'tracking-system',
        type: 'flow' as const,
        name: 'Barkod Tarayıcı #1',
        location: 'Paketleme Hattı',
        status: 'error' as const,
        batteryLevel: 34,
        signalStrength: 72,
        description: 'Ürün takip sistemi'
      },
      {
        id: 'rfid-reader-001',
        machineId: 'tracking-system',
        type: 'flow' as const,
        name: 'RFID Okuyucu',
        location: 'Sevkiyat Alanı',
        status: 'online' as const,
        batteryLevel: 63,
        signalStrength: 79,
        description: 'Palet takip sistemi'
      }
    ];

    additionalDevices.forEach(deviceData => {
      const device: IoTDevice = {
        id: deviceData.id,
        machineId: deviceData.machineId,
        type: deviceData.type,
        name: deviceData.name,
        location: deviceData.location,
        status: deviceData.status,
        lastHeartbeat: new Date(Date.now() - Math.random() * 300000),
        batteryLevel: deviceData.batteryLevel,
        signalStrength: deviceData.signalStrength,
        calibrationDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        nextCalibration: new Date(Date.now() + (90 + Math.random() * 180) * 24 * 60 * 60 * 1000)
      };
      
      this.devices.set(device.id, device);
    });
  }

  public startSimulation() {
    if (this.isRunning) return;
    
    // Store'u initialize et
    this.initializeStore();
    
    if (!this.store) {
      console.warn('Store not available, retrying in 1 second...');
      setTimeout(() => this.startSimulation(), 1000);
      return;
    }
    
    this.isRunning = true;
    console.log('IoT Simulation started...');
    
    // Ana veri akışı - her 2 saniyede bir
    this.intervalId = setInterval(() => {
      this.generateSensorData();
    }, 2000);

    // Heartbeat mesajları - her 30 saniyede bir
    setInterval(() => {
      this.sendHeartbeats();
    }, 30000);

    // Cihaz durumu güncellemeleri - her dakika
    setInterval(() => {
      this.updateDeviceStatus();
    }, 60000);

    // Kalibrasyon kontrolleri - her saat
    setInterval(() => {
      this.checkCalibrations();
    }, 3600000);
  }

  public stopSimulation() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    console.log('IoT Simulation stopped.');
  }

  private generateSensorData() {
    if (!this.store) {
      this.initializeStore();
      if (!this.store) return;
    }
    
    // Store'dan güncel veriyi al
    const currentState = useDigitalTwinStore.getState();
    const { addSensorData, machines } = currentState;
    
    this.devices.forEach((device) => {
      if (device.status !== 'online') return;
      
      const machine = machines.find(m => m.id === device.machineId);
      if (!machine) return;

      let value: number;
      let unit: string;
      let status: 'normal' | 'warning' | 'critical' = 'normal';

      // Makine tipine ve sensör tipine göre gerçekçi değerler üret
      switch (device.type) {
        case 'temperature':
          const baseTemp = this.getBaseTempForMachine(machine.type);
          value = baseTemp + (Math.random() - 0.5) * 20;
          unit = '°C';
          if (value > baseTemp + 15) status = 'critical';
          else if (value > baseTemp + 10) status = 'warning';
          break;

        case 'vibration':
          const baseVib = 0.3;
          value = baseVib + Math.random() * 0.5;
          unit = 'mm/s';
          if (value > 0.8) status = 'critical';
          else if (value > 0.6) status = 'warning';
          break;

        case 'pressure':
          const basePressure = this.getBasePressureForMachine(machine.type);
          value = basePressure + (Math.random() - 0.5) * 2;
          unit = 'bar';
          if (value < basePressure - 1.5 || value > basePressure + 1.5) status = 'critical';
          else if (value < basePressure - 1 || value > basePressure + 1) status = 'warning';
          break;

        case 'power':
          const basePower = machine.energyConsumption;
          value = basePower + (Math.random() - 0.5) * basePower * 0.2;
          unit = 'kW';
          if (value > basePower * 1.3) status = 'warning';
          break;

        default:
          value = Math.random() * 100;
          unit = '';
      }

      // Makine durumu sensör değerlerini etkiler
      if (machine.status === 'maintenance' || machine.status === 'stopped') {
        value *= 0.1; // Durmuş makine minimal değerler
      } else if (machine.status === 'error') {
        value *= 1.5; // Hatalı makine anormal değerler
        status = 'critical';
      }

      // Cihaz hatası simülasyonu
      if (Math.random() < 0.001) { // %0.1 olasılık
        device.status = 'error';
        this.sendAlert(device, 'Sensor communication error');
        return;
      }

      // Veriyi store'a ekle
      addSensorData({
        machineId: device.machineId,
        sensorType: device.type,
        value: Math.round(value * 100) / 100,
        unit,
        status
      });

      // MQTT benzeri mesaj simülasyonu
      this.publishMessage({
        deviceId: device.id,
        timestamp: new Date(),
        messageType: 'data',
        payload: {
          value,
          unit,
          status,
          deviceInfo: {
            batteryLevel: device.batteryLevel,
            signalStrength: device.signalStrength
          }
        },
        qos: 1
      });
    });
  }

  private sendHeartbeats() {
    this.devices.forEach((device) => {
      if (device.status === 'offline') return;

      device.lastHeartbeat = new Date();
      
      this.publishMessage({
        deviceId: device.id,
        timestamp: new Date(),
        messageType: 'heartbeat',
        payload: {
          status: device.status,
          batteryLevel: device.batteryLevel,
          signalStrength: device.signalStrength,
          uptime: Date.now() - device.calibrationDate.getTime()
        },
        qos: 0
      });
    });
  }

  private updateDeviceStatus() {
    this.devices.forEach((device) => {
      // Cihaz durumu rastgele değişebilir
      if (Math.random() < 0.02) { // %2 olasılık
        if (device.status === 'online') {
          device.status = Math.random() < 0.7 ? 'offline' : 'error';
        } else if (device.status === 'offline' && Math.random() < 0.8) {
          device.status = 'online';
        } else if (device.status === 'error' && Math.random() < 0.5) {
          device.status = 'online';
        }
      }

      // Batarya seviyesi güncelle (wireless sensörler için)
      if (device.batteryLevel !== undefined) {
        device.batteryLevel = Math.max(0, device.batteryLevel - Math.random() * 0.1);
        
        if (device.batteryLevel < 20) {
          this.sendAlert(device, `Low battery: ${device.batteryLevel.toFixed(1)}%`);
        }
      }

      // Sinyal gücü güncelle
      device.signalStrength = Math.max(10, Math.min(100, 
        device.signalStrength + (Math.random() - 0.5) * 10
      ));
    });
  }

  private checkCalibrations() {
    const now = new Date();
    
    this.devices.forEach((device) => {
      const daysSinceCalibration = (now.getTime() - device.calibrationDate.getTime()) / (1000 * 60 * 60 * 24);
      const daysUntilCalibration = (device.nextCalibration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      
      // Kalibrasyon uyarısı
      if (daysUntilCalibration <= 7 && daysUntilCalibration > 0) {
        this.sendAlert(device, `Calibration needed in ${Math.ceil(daysUntilCalibration)} days`);
      }
      
      // Geç kalibrasyon
      if (daysUntilCalibration <= 0) {
        device.status = 'error';
        this.sendAlert(device, 'Calibration overdue - sensor unreliable');
      }
    });
  }

  private sendAlert(device: IoTDevice, message: string) {
    if (!this.store) {
      this.initializeStore();
      if (!this.store) return;
    }
    
    // Store'dan güncel veriyi al
    const currentState = useDigitalTwinStore.getState();
    const { addAlert } = currentState;
    
    addAlert({
      machineId: device.machineId,
      type: device.status === 'error' ? 'critical' : 'warning',
      message: `${device.name}: ${message}`,
      acknowledged: false,
      resolved: false
    });

    this.publishMessage({
      deviceId: device.id,
      timestamp: new Date(),
      messageType: 'alert',
      payload: {
        severity: device.status === 'error' ? 'critical' : 'warning',
        message,
        deviceInfo: device
      },
      qos: 2
    });
  }

  private publishMessage(message: IoTMessage) {
    // MQTT/WebSocket simülasyonu - gerçek implementasyonda bu kısım
    // gerçek bir message broker'a gönderilir
    console.log(`[IoT] ${message.messageType.toUpperCase()} from ${message.deviceId}:`, message.payload);
    
    // Edge computing simülasyonu - kritik mesajlar yerel işlenir
    if (message.messageType === 'alert' && message.payload.severity === 'critical') {
      this.processEdgeAlert(message);
    }
  }

  private processEdgeAlert(message: IoTMessage) {
    // Edge computing - kritik uyarılar için yerel işlem
    console.log(`[EDGE] Processing critical alert locally: ${message.payload.message}`);
    
    // Otomatik aksiyon alabilir (makine durdurma, güvenlik protokolü vb.)
    const device = this.devices.get(message.deviceId);
    if (device && message.payload.message.includes('temperature')) {
      console.log(`[EDGE] Auto-action: Reducing machine speed for ${device.machineId}`);
      // Burada makine hızını düşürme komutu gönderilebilir
    }
  }

  private getBaseTempForMachine(machineType: string): number {
    switch (machineType) {
      case 'injection': return 180;
      case 'blowing': return 75;
      case 'labeling': return 25;
      case 'packaging': return 22;
      default: return 50;
    }
  }

  private getBasePressureForMachine(machineType: string): number {
    switch (machineType) {
      case 'injection': return 8;
      case 'blowing': return 6;
      case 'labeling': return 2;
      case 'packaging': return 1;
      default: return 3;
    }
  }

  // Public methods for monitoring
  public getDeviceStatus(): IoTDevice[] {
    return Array.from(this.devices.values());
  }

  public getDeviceById(id: string): IoTDevice | undefined {
    return this.devices.get(id);
  }

  public calibrateDevice(deviceId: string): boolean {
    const device = this.devices.get(deviceId);
    if (!device) return false;

    device.calibrationDate = new Date();
    device.nextCalibration = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 6 ay sonra
    device.status = 'online';

    this.publishMessage({
      deviceId,
      timestamp: new Date(),
      messageType: 'calibration',
      payload: {
        status: 'completed',
        calibrationDate: device.calibrationDate,
        nextCalibration: device.nextCalibration
      },
      qos: 1
    });

    return true;
  }

  public getNetworkStatistics() {
    const devices = Array.from(this.devices.values());
    
    return {
      totalDevices: devices.length,
      onlineDevices: devices.filter(d => d.status === 'online').length,
      offlineDevices: devices.filter(d => d.status === 'offline').length,
      errorDevices: devices.filter(d => d.status === 'error').length,
      avgSignalStrength: devices.reduce((sum, d) => sum + d.signalStrength, 0) / devices.length,
      lowBatteryDevices: devices.filter(d => d.batteryLevel && d.batteryLevel < 20).length,
      calibrationNeeded: devices.filter(d => 
        (d.nextCalibration.getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 7
      ).length
    };
  }
}

// Singleton instance
export const iotSimulator = new IoTSimulator(); 