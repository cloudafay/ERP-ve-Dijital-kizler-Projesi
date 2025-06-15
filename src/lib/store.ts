import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Tiplar
export interface SensorData {
  id: string;
  machineId: string;
  sensorType: 'temperature' | 'vibration' | 'pressure' | 'speed' | 'energy';
  value: number;
  unit: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

export interface MachineStatus {
  id: string;
  name: string;
  type: 'injection' | 'blowing' | 'labeling' | 'packaging';
  status: 'running' | 'stopped' | 'maintenance' | 'error';
  efficiency: number;
  temperature: number;
  vibration: number;
  speed: number;
  energyConsumption: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  totalProduction: number;
  currentShift: string;
  digitalTwinModel?: any;
}

export interface Alert {
  id: string;
  machineId: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
}

export interface AIForecast {
  id: string;
  machineId: string;
  predictionType: 'failure' | 'maintenance' | 'efficiency' | 'quality';
  probability: number;
  estimatedTime: Date;
  recommendations: string[];
  confidenceScore: number;
}

export interface QualityMetrics {
  id: string;
  bottleCount: number;
  defectRate: number;
  qualityScore: number;
  timestamp: Date;
  bottleType: string;
  batchId: string;
}

export interface DigitalTwinState {
  // Sensör verileri
  sensorData: SensorData[];
  
  // Makine durumları
  machines: MachineStatus[];
  
  // Alarmlar
  alerts: Alert[];
  
  // AI tahminleri
  forecasts: AIForecast[];
  
  // Kalite metrikleri
  qualityMetrics: QualityMetrics[];
  
  // Üretim verileri
  productionData: {
    dailyCount: number;
    hourlyRate: number;
    efficiency: number;
    oeeScore: number;
    carbonFootprint: number;
    energyEfficiency: number;
  };
  
  // Sistem durumu
  systemStatus: {
    isConnected: boolean;
    lastUpdate: Date;
    activeUsers: number;
    systemHealth: number;
  };
  
  // Actions
  addSensorData: (data: Omit<SensorData, 'id' | 'timestamp'>) => void;
  updateMachine: (machineId: string, updates: Partial<MachineStatus>) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  addForecast: (forecast: Omit<AIForecast, 'id'>) => void;
  updateQualityMetrics: (metrics: Omit<QualityMetrics, 'id' | 'timestamp'>) => void;
  updateProductionData: (data: Partial<DigitalTwinState['productionData']>) => void;
  initializeSystem: () => void;
  simulateRealTimeData: () => void;
}

export const useDigitalTwinStore = create<DigitalTwinState>((set, get) => ({
  sensorData: [],
  machines: [],
  alerts: [],
  forecasts: [],
  qualityMetrics: [],
  
  productionData: {
    dailyCount: 15420,
    hourlyRate: 285,
    efficiency: 94.2,
    oeeScore: 89.5,
    carbonFootprint: 2.4,
    energyEfficiency: 87.3,
  },
  
  systemStatus: {
    isConnected: true,
    lastUpdate: new Date(),
    activeUsers: 8,
    systemHealth: 98.5,
  },
  
  addSensorData: (data) => {
    const newSensorData: SensorData = {
      ...data,
      id: uuidv4(),
      timestamp: new Date(),
    };
    
    set((state) => ({
      sensorData: [newSensorData, ...state.sensorData.slice(0, 999)], // Son 1000 kayıt
    }));
  },
  
  updateMachine: (machineId, updates) => {
    set((state) => ({
      machines: state.machines.map((machine) =>
        machine.id === machineId ? { ...machine, ...updates } : machine
      ),
    }));
  },
  
  addAlert: (alert) => {
    const newAlert: Alert = {
      ...alert,
      id: uuidv4(),
      timestamp: new Date(),
    };
    
    set((state) => ({
      alerts: [newAlert, ...state.alerts],
    }));
  },
  
  acknowledgeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ),
    }));
  },
  
  resolveAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ),
    }));
  },
  
  addForecast: (forecast) => {
    const newForecast: AIForecast = {
      ...forecast,
      id: uuidv4(),
    };
    
    set((state) => ({
      forecasts: [newForecast, ...state.forecasts.slice(0, 49)], // Son 50 tahmin
    }));
  },
  
  updateQualityMetrics: (metrics) => {
    const newMetrics: QualityMetrics = {
      ...metrics,
      id: uuidv4(),
      timestamp: new Date(),
    };
    
    set((state) => ({
      qualityMetrics: [newMetrics, ...state.qualityMetrics.slice(0, 99)], // Son 100 kalite kaydı
    }));
  },
  
  updateProductionData: (data) => {
    set((state) => ({
      productionData: { ...state.productionData, ...data },
    }));
  },
  
  initializeSystem: () => {
    // Başlangıç makinelerini oluştur
    const initialMachines: MachineStatus[] = [
      {
        id: 'machine-001',
        name: 'Enjeksiyon Makinesi #1',
        type: 'injection',
        status: 'running',
        efficiency: 94.5,
        temperature: 185.2,
        vibration: 0.45,
        speed: 120,
        energyConsumption: 45.2,
        lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
        totalProduction: 15420,
        currentShift: 'A',
      },
      {
        id: 'machine-002',
        name: 'Şişirme Makinesi #1',
        type: 'blowing',
        status: 'running',
        efficiency: 91.8,
        temperature: 78.5,
        vibration: 0.32,
        speed: 95,
        energyConsumption: 32.1,
        lastMaintenance: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        totalProduction: 14850,
        currentShift: 'A',
      },
      {
        id: 'machine-003',
        name: 'Etiketleme Hattı #1',
        type: 'labeling',
        status: 'running',
        efficiency: 96.2,
        temperature: 25.8,
        vibration: 0.15,
        speed: 180,
        energyConsumption: 12.5,
        lastMaintenance: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        totalProduction: 15100,
        currentShift: 'A',
      },
      {
        id: 'machine-004',
        name: 'Paketleme Hattı #1',
        type: 'packaging',
        status: 'maintenance',
        efficiency: 0,
        temperature: 22.1,
        vibration: 0.05,
        speed: 0,
        energyConsumption: 2.1,
        lastMaintenance: new Date(),
        nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        totalProduction: 14200,
        currentShift: 'A',
      },
    ];
    
    set(() => ({
      machines: initialMachines,
    }));
  },
  
  simulateRealTimeData: () => {
    const { machines, addSensorData, updateMachine, addAlert, addForecast } = get();
    
    machines.forEach((machine) => {
      if (machine.status === 'running') {
        // Sensör verilerini simüle et
        const tempVariation = (Math.random() - 0.5) * 10;
        const vibVariation = (Math.random() - 0.5) * 0.2;
        const speedVariation = (Math.random() - 0.5) * 20;
        
        const newTemp = machine.temperature + tempVariation;
        const newVib = Math.max(0, machine.vibration + vibVariation);
        const newSpeed = Math.max(0, machine.speed + speedVariation);
        
        // Sensör verilerini ekle
        addSensorData({
          machineId: machine.id,
          sensorType: 'temperature',
          value: newTemp,
          unit: '°C',
          status: newTemp > 200 ? 'critical' : newTemp > 190 ? 'warning' : 'normal',
        });
        
        addSensorData({
          machineId: machine.id,
          sensorType: 'vibration',
          value: newVib,
          unit: 'mm/s',
          status: newVib > 0.8 ? 'critical' : newVib > 0.6 ? 'warning' : 'normal',
        });
        
        addSensorData({
          machineId: machine.id,
          sensorType: 'speed',
          value: newSpeed,
          unit: 'rpm',
          status: 'normal',
        });
        
        // Makine durumunu güncelle
        updateMachine(machine.id, {
          temperature: newTemp,
          vibration: newVib,
          speed: newSpeed,
          efficiency: Math.max(80, Math.min(100, machine.efficiency + (Math.random() - 0.5) * 2)),
        });
        
        // Kritik durumlar için alarm oluştur
        if (newTemp > 200) {
          addAlert({
            machineId: machine.id,
            type: 'critical',
            message: `${machine.name} - Kritik sıcaklık seviyesi: ${newTemp.toFixed(1)}°C`,
            acknowledged: false,
            resolved: false,
          });
        }
        
        if (newVib > 0.8) {
          addAlert({
            machineId: machine.id,
            type: 'warning',
            message: `${machine.name} - Yüksek titreşim tespit edildi: ${newVib.toFixed(2)} mm/s`,
            acknowledged: false,
            resolved: false,
          });
        }
        
        // AI tahminleri oluştur (rastgele)
        if (Math.random() < 0.1) { // %10 ihtimal
          addForecast({
            machineId: machine.id,
            predictionType: 'maintenance',
            probability: 0.75 + Math.random() * 0.2,
            estimatedTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
            recommendations: [
              'Vibrasyon seviyelerini kontrol edin',
              'Yağlama sistemini gözden geçirin',
              'Kalibrasyon yapın',
            ],
            confidenceScore: 0.85 + Math.random() * 0.1,
          });
        }
      }
    });
  },
})); 