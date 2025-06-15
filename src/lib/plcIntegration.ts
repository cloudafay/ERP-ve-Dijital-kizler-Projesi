// PLC Integration Service - Siemens S7, Allen-Bradley, Schneider Electric desteği
export interface PLCDevice {
  id: string;
  name: string;
  brand: 'Siemens' | 'Allen-Bradley' | 'Schneider' | 'Mitsubishi';
  model: string;
  ipAddress: string;
  port: number;
  status: 'connected' | 'disconnected' | 'error' | 'maintenance';
  lastConnection: Date;
  firmware: string;
  tags: PLCTag[];
  cycleTime: number; // ms
  memoryUsage: number; // %
  cpuLoad: number; // %
}

export interface PLCTag {
  address: string;
  name: string;
  dataType: 'BOOL' | 'INT' | 'REAL' | 'DINT' | 'STRING';
  value: any;
  quality: 'GOOD' | 'BAD' | 'UNCERTAIN';
  timestamp: Date;
  description: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  alarmHigh?: number;
  alarmLow?: number;
}

export interface PLCConnection {
  deviceId: string;
  protocol: 'S7' | 'EtherNet/IP' | 'Modbus TCP' | 'OPC UA';
  connectionString: string;
  isSecure: boolean;
  retryCount: number;
  timeout: number;
}

export class PLCIntegrationService {
  private devices: Map<string, PLCDevice> = new Map();
  private connections: Map<string, PLCConnection> = new Map();
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private subscribers: ((data: PLCDataUpdate) => void)[] = [];

  constructor() {
    this.initializePLCDevices();
  }

  private initializePLCDevices() {
    // Siemens S7-1500 PLC - Ana Üretim Hattı
    const siemensPLC: PLCDevice = {
      id: 'plc-siemens-001',
      name: 'Ana Üretim Hattı PLC',
      brand: 'Siemens',
      model: 'S7-1515-2 PN',
      ipAddress: '192.168.1.100',
      port: 102,
      status: 'connected',
      lastConnection: new Date(),
      firmware: 'V2.9.4',
      cycleTime: 10, // 10ms
      memoryUsage: 45,
      cpuLoad: 23,
      tags: [
        {
          address: 'DB1.DBD0',
          name: 'Bottle_Production_Count',
          dataType: 'DINT',
          value: 15847,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Günlük şişe üretim sayısı',
          unit: 'adet'
        },
        {
          address: 'DB1.DBD4',
          name: 'Line_Speed',
          dataType: 'REAL',
          value: 850.5,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Hat hızı',
          unit: 'şişe/dk',
          minValue: 0,
          maxValue: 1200,
          alarmHigh: 1100,
          alarmLow: 100
        },
        {
          address: 'DB2.DBD0',
          name: 'Mold_Temperature_1',
          dataType: 'REAL',
          value: 185.7,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Kalıp sıcaklığı #1',
          unit: '°C',
          minValue: 160,
          maxValue: 200,
          alarmHigh: 195,
          alarmLow: 170
        },
        {
          address: 'DB2.DBD4',
          name: 'Hydraulic_Pressure',
          dataType: 'REAL',
          value: 180.2,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Hidrolik basınç',
          unit: 'bar',
          minValue: 150,
          maxValue: 200,
          alarmHigh: 190,
          alarmLow: 160
        },
        {
          address: 'M0.0',
          name: 'Emergency_Stop',
          dataType: 'BOOL',
          value: false,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Acil durdurma durumu'
        },
        {
          address: 'M0.1',
          name: 'Auto_Mode',
          dataType: 'BOOL',
          value: true,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Otomatik mod aktif'
        }
      ]
    };

    // Allen-Bradley CompactLogix - Paketleme Hattı
    const allenBradleyPLC: PLCDevice = {
      id: 'plc-ab-002',
      name: 'Paketleme Hattı PLC',
      brand: 'Allen-Bradley',
      model: 'CompactLogix 5380',
      ipAddress: '192.168.1.101',
      port: 44818,
      status: 'connected',
      lastConnection: new Date(),
      firmware: 'V33.011',
      cycleTime: 15,
      memoryUsage: 38,
      cpuLoad: 19,
      tags: [
        {
          address: 'PackagingLine:I.Data[0]',
          name: 'Conveyor_Speed',
          dataType: 'REAL',
          value: 2.5,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Konveyör hızı',
          unit: 'm/s',
          minValue: 0,
          maxValue: 5,
          alarmHigh: 4.5
        },
        {
          address: 'PackagingLine:I.Data[1]',
          name: 'Label_Count',
          dataType: 'DINT',
          value: 8934,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Etiket sayısı',
          unit: 'adet'
        },
        {
          address: 'QualityControl:I.Data[0]',
          name: 'Reject_Count',
          dataType: 'DINT',
          value: 23,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Red edilen ürün sayısı',
          unit: 'adet'
        },
        {
          address: 'PackagingLine:O.Data[0]',
          name: 'Packaging_Active',
          dataType: 'BOOL',
          value: true,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Paketleme aktif durumu'
        }
      ]
    };

    // Schneider Electric Modicon - Su Arıtma Sistemi
    const schneiderPLC: PLCDevice = {
      id: 'plc-schneider-003',
      name: 'Su Arıtma Sistemi PLC',
      brand: 'Schneider',
      model: 'Modicon M580',
      ipAddress: '192.168.1.102',
      port: 502,
      status: 'connected',
      lastConnection: new Date(),
      firmware: 'V3.20',
      cycleTime: 20,
      memoryUsage: 52,
      cpuLoad: 31,
      tags: [
        {
          address: '%MW100',
          name: 'Water_Flow_Rate',
          dataType: 'REAL',
          value: 125.8,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Su akış hızı',
          unit: 'L/dk',
          minValue: 100,
          maxValue: 200,
          alarmLow: 110
        },
        {
          address: '%MW102',
          name: 'pH_Level',
          dataType: 'REAL',
          value: 7.2,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'pH seviyesi',
          unit: 'pH',
          minValue: 6.5,
          maxValue: 8.5,
          alarmHigh: 8.0,
          alarmLow: 7.0
        },
        {
          address: '%MW104',
          name: 'Chlorine_Level',
          dataType: 'REAL',
          value: 0.8,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Klor seviyesi',
          unit: 'ppm',
          minValue: 0.5,
          maxValue: 2.0,
          alarmHigh: 1.5,
          alarmLow: 0.6
        },
        {
          address: '%M100',
          name: 'Filter_Clean_Required',
          dataType: 'BOOL',
          value: false,
          quality: 'GOOD',
          timestamp: new Date(),
          description: 'Filtre temizlik gereksinimi'
        }
      ]
    };

    this.devices.set(siemensPLC.id, siemensPLC);
    this.devices.set(allenBradleyPLC.id, allenBradleyPLC);
    this.devices.set(schneiderPLC.id, schneiderPLC);

    // Bağlantı bilgilerini ayarla
    this.connections.set('plc-siemens-001', {
      deviceId: 'plc-siemens-001',
      protocol: 'S7',
      connectionString: 'S7:192.168.1.100:102,0,1',
      isSecure: false,
      retryCount: 3,
      timeout: 5000
    });

    this.connections.set('plc-ab-002', {
      deviceId: 'plc-ab-002',
      protocol: 'EtherNet/IP',
      connectionString: 'EIP:192.168.1.101:44818',
      isSecure: true,
      retryCount: 3,
      timeout: 5000
    });

    this.connections.set('plc-schneider-003', {
      deviceId: 'plc-schneider-003',
      protocol: 'Modbus TCP',
      connectionString: 'MODBUS:192.168.1.102:502',
      isSecure: false,
      retryCount: 3,
      timeout: 5000
    });
  }

  public startDataCollection() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔌 PLC Data Collection started...');

    // Ana veri toplama döngüsü - her 1 saniyede
    this.intervalId = setInterval(() => {
      this.collectPLCData();
    }, 1000);

    // Bağlantı durumu kontrolü - her 30 saniyede
    setInterval(() => {
      this.checkConnections();
    }, 30000);

    // Alarm kontrolü - her 5 saniyede
    setInterval(() => {
      this.checkAlarms();
    }, 5000);
  }

  public stopDataCollection() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('🔌 PLC Data Collection stopped');
  }

  private collectPLCData() {
    this.devices.forEach((device) => {
      if (device.status !== 'connected') return;

      // Gerçek zamanlı veri simülasyonu
      device.tags.forEach((tag) => {
        const oldValue = tag.value;
        
        // Veri tipine göre değer güncelle
        switch (tag.dataType) {
          case 'REAL':
            if (tag.name.includes('Temperature')) {
              tag.value = this.simulateTemperature(tag.value, tag.minValue, tag.maxValue);
            } else if (tag.name.includes('Pressure')) {
              tag.value = this.simulatePressure(tag.value, tag.minValue, tag.maxValue);
            } else if (tag.name.includes('Speed') || tag.name.includes('Flow')) {
              tag.value = this.simulateFlow(tag.value, tag.minValue, tag.maxValue);
            } else if (tag.name.includes('pH')) {
              tag.value = this.simulatePH(tag.value);
            } else if (tag.name.includes('Chlorine')) {
              tag.value = this.simulateChlorine(tag.value);
            } else {
              tag.value = this.simulateGenericReal(tag.value, tag.minValue, tag.maxValue);
            }
            break;
            
          case 'DINT':
            if (tag.name.includes('Count')) {
              tag.value += Math.floor(Math.random() * 3); // 0-2 artış
            }
            break;
            
          case 'BOOL':
            if (tag.name.includes('Emergency')) {
              // %0.1 olasılıkla acil durum
              tag.value = Math.random() < 0.001;
            } else if (tag.name.includes('Filter_Clean')) {
              // %2 olasılıkla filtre temizlik gereksinimi
              tag.value = Math.random() < 0.02;
            }
            break;
        }

        tag.timestamp = new Date();
        
        // Kalite kontrolü
        tag.quality = this.determineDataQuality(tag);

        // Değer değişikliği varsa abonelere bildir
        if (oldValue !== tag.value) {
          this.notifySubscribers({
            deviceId: device.id,
            deviceName: device.name,
            tagAddress: tag.address,
            tagName: tag.name,
            oldValue,
            newValue: tag.value,
            timestamp: tag.timestamp,
            quality: tag.quality,
            unit: tag.unit
          });
        }
      });

      // PLC performans metrikleri güncelle
      device.cycleTime = Math.max(5, device.cycleTime + (Math.random() - 0.5) * 2);
      device.memoryUsage = Math.max(20, Math.min(90, device.memoryUsage + (Math.random() - 0.5) * 5));
      device.cpuLoad = Math.max(10, Math.min(80, device.cpuLoad + (Math.random() - 0.5) * 8));
    });
  }

  private simulateTemperature(current: number, min?: number, max?: number): number {
    const variation = (Math.random() - 0.5) * 2; // ±1°C
    const newValue = current + variation;
    return Math.max(min || 0, Math.min(max || 300, Number(newValue.toFixed(1))));
  }

  private simulatePressure(current: number, min?: number, max?: number): number {
    const variation = (Math.random() - 0.5) * 5; // ±2.5 bar
    const newValue = current + variation;
    return Math.max(min || 0, Math.min(max || 500, Number(newValue.toFixed(1))));
  }

  private simulateFlow(current: number, min?: number, max?: number): number {
    const variation = (Math.random() - 0.5) * 10; // ±5 birim
    const newValue = current + variation;
    return Math.max(min || 0, Math.min(max || 2000, Number(newValue.toFixed(1))));
  }

  private simulatePH(current: number): number {
    const variation = (Math.random() - 0.5) * 0.2; // ±0.1 pH
    const newValue = current + variation;
    return Math.max(6.0, Math.min(9.0, Number(newValue.toFixed(2))));
  }

  private simulateChlorine(current: number): number {
    const variation = (Math.random() - 0.5) * 0.1; // ±0.05 ppm
    const newValue = current + variation;
    return Math.max(0.3, Math.min(2.5, Number(newValue.toFixed(2))));
  }

  private simulateGenericReal(current: number, min?: number, max?: number): number {
    const variation = (Math.random() - 0.5) * (current * 0.05); // ±2.5% değişim
    const newValue = current + variation;
    return Math.max(min || 0, Math.min(max || current * 2, Number(newValue.toFixed(2))));
  }

  private determineDataQuality(tag: PLCTag): 'GOOD' | 'BAD' | 'UNCERTAIN' {
    // %95 iyi kalite, %3 belirsiz, %2 kötü
    const random = Math.random();
    if (random < 0.95) return 'GOOD';
    if (random < 0.98) return 'UNCERTAIN';
    return 'BAD';
  }

  private checkConnections() {
    this.devices.forEach((device) => {
      // %98 bağlantı başarı oranı
      if (Math.random() < 0.02) {
        device.status = Math.random() < 0.5 ? 'disconnected' : 'error';
        console.warn(`⚠️ PLC Connection lost: ${device.name}`);
      } else if (device.status !== 'maintenance') {
        device.status = 'connected';
        device.lastConnection = new Date();
      }
    });
  }

  private checkAlarms() {
    this.devices.forEach((device) => {
      device.tags.forEach((tag) => {
        if (tag.dataType === 'REAL' && typeof tag.value === 'number') {
          // Yüksek alarm kontrolü
          if (tag.alarmHigh && tag.value > tag.alarmHigh) {
            this.triggerAlarm(device, tag, 'HIGH', `${tag.name} yüksek alarm: ${tag.value} ${tag.unit || ''}`);
          }
          
          // Düşük alarm kontrolü
          if (tag.alarmLow && tag.value < tag.alarmLow) {
            this.triggerAlarm(device, tag, 'LOW', `${tag.name} düşük alarm: ${tag.value} ${tag.unit || ''}`);
          }
        }
      });
    });
  }

  private triggerAlarm(device: PLCDevice, tag: PLCTag, type: 'HIGH' | 'LOW', message: string) {
    console.warn(`🚨 PLC ALARM [${device.name}]: ${message}`);
    
    // Alarm sistemine bildir
    this.notifySubscribers({
      deviceId: device.id,
      deviceName: device.name,
      tagAddress: tag.address,
      tagName: tag.name,
      oldValue: null,
      newValue: tag.value,
      timestamp: new Date(),
      quality: 'BAD',
      unit: tag.unit,
      alarmType: type,
      alarmMessage: message
    });
  }

  public subscribe(callback: (data: PLCDataUpdate) => void) {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: (data: PLCDataUpdate) => void) {
    const index = this.subscribers.indexOf(callback);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  private notifySubscribers(data: PLCDataUpdate) {
    this.subscribers.forEach(callback => callback(data));
  }

  public getPLCDevices(): PLCDevice[] {
    return Array.from(this.devices.values());
  }

  public getPLCDevice(deviceId: string): PLCDevice | undefined {
    return this.devices.get(deviceId);
  }

  public writeTag(deviceId: string, tagAddress: string, value: any): boolean {
    const device = this.devices.get(deviceId);
    if (!device || device.status !== 'connected') return false;

    const tag = device.tags.find(t => t.address === tagAddress);
    if (!tag) return false;

    tag.value = value;
    tag.timestamp = new Date();
    tag.quality = 'GOOD';

    console.log(`✍️ PLC Write: ${device.name} - ${tag.name} = ${value}`);
    return true;
  }

  public getConnectionStatus(): { [deviceId: string]: string } {
    const status: { [deviceId: string]: string } = {};
    this.devices.forEach((device, id) => {
      status[id] = device.status;
    });
    return status;
  }
}

export interface PLCDataUpdate {
  deviceId: string;
  deviceName: string;
  tagAddress: string;
  tagName: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
  quality: 'GOOD' | 'BAD' | 'UNCERTAIN';
  unit?: string;
  alarmType?: 'HIGH' | 'LOW';
  alarmMessage?: string;
}

// Singleton instance
export const plcIntegrationService = new PLCIntegrationService(); 