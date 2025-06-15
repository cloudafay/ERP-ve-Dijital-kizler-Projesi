// Energy Monitoring & Optimization Service
// Modern Senaryo: Akıllı enerji sensörleri ile gerçek zamanlı tüketim analizi ve optimizasyon

export interface EnergyDevice {
  id: string;
  name: string;
  location: string;
  deviceType: 'motor' | 'compressor' | 'heater' | 'cooling' | 'lighting' | 'conveyor' | 'pump';
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  currentPower: number; // kW
  voltage: number; // V
  current: number; // A
  powerFactor: number;
  frequency: number; // Hz
  temperature: number; // °C
  efficiency: number; // %
  totalEnergyConsumed: number; // kWh
  operatingHours: number;
  lastMaintenance: Date;
  carbonFootprint: number; // kg CO2
}

export interface EnergyAlert {
  id: string;
  deviceId: string;
  alertType: 'high_consumption' | 'efficiency_drop' | 'power_quality' | 'predictive_failure' | 'carbon_limit';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendation: string;
  potentialSavings: number; // kWh/day
  timestamp: Date;
  acknowledged: boolean;
}

export interface EnergyOptimization {
  id: string;
  optimizationType: 'load_balancing' | 'peak_shaving' | 'demand_response' | 'efficiency_improvement';
  description: string;
  estimatedSavings: number; // kWh/month
  costSavings: number; // TL/month
  co2Reduction: number; // kg CO2/month
  implementationCost: number; // TL
  paybackPeriod: number; // months
  status: 'proposed' | 'approved' | 'implementing' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface EnergyTariff {
  timeSlot: string;
  startHour: number;
  endHour: number;
  rate: number; // TL/kWh
  type: 'peak' | 'off_peak' | 'shoulder';
  demandCharge: number; // TL/kW
}

class EnergyMonitoringService {
  private static instance: EnergyMonitoringService;
  private energyDevices: EnergyDevice[] = [];
  private energyAlerts: EnergyAlert[] = [];
  private optimizations: EnergyOptimization[] = [];
  private tariffStructure: EnergyTariff[] = [];
  private subscribers: ((data: any) => void)[] = [];
  private totalEnergyBudget: number = 50000; // kWh/month
  private carbonEmissionLimit: number = 25000; // kg CO2/month
  private energyPrice: number = 2.85; // TL/kWh ortalama

  private constructor() {
    this.initializeEnergyDevices();
    this.initializeTariffStructure();
    this.startEnergyMonitoring();
    this.generateOptimizationRecommendations();
  }

  public static getInstance(): EnergyMonitoringService {
    if (!EnergyMonitoringService.instance) {
      EnergyMonitoringService.instance = new EnergyMonitoringService();
    }
    return EnergyMonitoringService.instance;
  }

  private initializeEnergyDevices(): void {
    this.energyDevices = [
      {
        id: 'motor-001',
        name: 'Ana Üretim Motoru #1',
        location: 'Üretim Hattı A',
        deviceType: 'motor',
        status: 'active',
        currentPower: 45.8,
        voltage: 380,
        current: 78.5,
        powerFactor: 0.85,
        frequency: 50.1,
        temperature: 68.5,
        efficiency: 92.3,
        totalEnergyConsumed: 1247.5,
        operatingHours: 6840,
        lastMaintenance: new Date('2024-01-15'),
        carbonFootprint: 623.75
      },
      {
        id: 'compressor-001',
        name: 'Hava Kompresörü Ana',
        location: 'Kompresör Odası',
        deviceType: 'compressor',
        status: 'active',
        currentPower: 22.3,
        voltage: 380,
        current: 38.2,
        powerFactor: 0.88,
        frequency: 49.9,
        temperature: 72.1,
        efficiency: 89.7,
        totalEnergyConsumed: 892.4,
        operatingHours: 5420,
        lastMaintenance: new Date('2024-01-20'),
        carbonFootprint: 446.2
      },
      {
        id: 'heater-001',
        name: 'Kalıp Isıtıcısı #1',
        location: 'Üretim Hattı A',
        deviceType: 'heater',
        status: 'active',
        currentPower: 18.7,
        voltage: 380,
        current: 32.1,
        powerFactor: 0.95,
        frequency: 50.0,
        temperature: 185.3,
        efficiency: 94.2,
        totalEnergyConsumed: 756.8,
        operatingHours: 6200,
        lastMaintenance: new Date('2024-01-10'),
        carbonFootprint: 378.4
      },
      {
        id: 'cooling-001',
        name: 'Soğutma Sistemi Ana',
        location: 'Soğutma Merkezi',
        deviceType: 'cooling',
        status: 'active',
        currentPower: 35.2,
        voltage: 380,
        current: 60.8,
        powerFactor: 0.82,
        frequency: 50.2,
        temperature: 12.8,
        efficiency: 87.5,
        totalEnergyConsumed: 1124.6,
        operatingHours: 7200,
        lastMaintenance: new Date('2024-01-25'),
        carbonFootprint: 562.3
      },
      {
        id: 'conveyor-001',
        name: 'Ana Konveyör Sistemi',
        location: 'Paketleme Hattı',
        deviceType: 'conveyor',
        status: 'active',
        currentPower: 8.9,
        voltage: 380,
        current: 15.2,
        powerFactor: 0.90,
        frequency: 50.1,
        temperature: 45.2,
        efficiency: 91.8,
        totalEnergyConsumed: 445.7,
        operatingHours: 6500,
        lastMaintenance: new Date('2024-01-18'),
        carbonFootprint: 222.85
      },
      {
        id: 'pump-001',
        name: 'Su Arıtma Pompası',
        location: 'Su Arıtma Ünitesi',
        deviceType: 'pump',
        status: 'active',
        currentPower: 12.4,
        voltage: 380,
        current: 21.3,
        powerFactor: 0.87,
        frequency: 49.8,
        temperature: 52.7,
        efficiency: 88.9,
        totalEnergyConsumed: 623.2,
        operatingHours: 7800,
        lastMaintenance: new Date('2024-01-12'),
        carbonFootprint: 311.6
      }
    ];
  }

  private initializeTariffStructure(): void {
    this.tariffStructure = [
      {
        timeSlot: 'Gece Tarifesi',
        startHour: 23,
        endHour: 6,
        rate: 1.95,
        type: 'off_peak',
        demandCharge: 45.20
      },
      {
        timeSlot: 'Gündüz Tarifesi',
        startHour: 6,
        endHour: 17,
        rate: 2.85,
        type: 'shoulder',
        demandCharge: 68.50
      },
      {
        timeSlot: 'Puant Tarifesi',
        startHour: 17,
        endHour: 23,
        rate: 4.25,
        type: 'peak',
        demandCharge: 95.80
      }
    ];
  }

  private startEnergyMonitoring(): void {
    setInterval(() => {
      this.updateEnergyMetrics();
      this.analyzeEnergyConsumption();
      this.checkEnergyAlerts();
      this.optimizeEnergyUsage();
      this.notifySubscribers();
    }, 5000); // Her 5 saniyede güncelle
  }

  private updateEnergyMetrics(): void {
    this.energyDevices.forEach(device => {
      // Gerçekçi enerji metrik güncellemeleri
      const baseLoad = this.getBaseLoad(device.deviceType);
      const variation = (Math.random() - 0.5) * 0.2; // ±10% varyasyon
      
      device.currentPower = Math.max(0, baseLoad * (1 + variation));
      device.current = device.currentPower / (device.voltage * Math.sqrt(3) * device.powerFactor) * 1000;
      device.voltage = 380 + (Math.random() - 0.5) * 10; // ±5V varyasyon
      device.frequency = 50 + (Math.random() - 0.5) * 0.5; // ±0.25Hz varyasyon
      device.powerFactor = Math.max(0.7, Math.min(0.98, device.powerFactor + (Math.random() - 0.5) * 0.02));
      
      // Sıcaklık güncellemesi
      device.temperature = this.updateTemperature(device);
      
      // Verimlilik hesaplama
      device.efficiency = this.calculateEfficiency(device);
      
      // Toplam enerji tüketimi (kWh olarak)
      device.totalEnergyConsumed += (device.currentPower * 5) / (1000 * 3600); // 5 saniye için
      
      // Karbon ayak izi (0.5 kg CO2/kWh faktörü ile)
      device.carbonFootprint = device.totalEnergyConsumed * 0.5;
      
      // Çalışma saatleri
      if (device.status === 'active') {
        device.operatingHours += 5 / 3600; // 5 saniye = 5/3600 saat
      }
    });
  }

  private getBaseLoad(deviceType: string): number {
    const baseLoads = {
      motor: 45,
      compressor: 22,
      heater: 18,
      cooling: 35,
      conveyor: 9,
      pump: 12,
      lighting: 5
    };
    return baseLoads[deviceType] || 10;
  }

  private updateTemperature(device: EnergyDevice): number {
    const targetTemps = {
      motor: 70,
      compressor: 75,
      heater: 185,
      cooling: 15,
      conveyor: 45,
      pump: 55,
      lighting: 35
    };
    
    const target = targetTemps[device.deviceType] || 50;
    const current = device.temperature;
    const loadFactor = device.currentPower / this.getBaseLoad(device.deviceType);
    
    // Yük faktörüne göre sıcaklık ayarlaması
    const targetAdjusted = target + (loadFactor - 1) * 10;
    
    // Yavaş sıcaklık değişimi simülasyonu
    return current + (targetAdjusted - current) * 0.1 + (Math.random() - 0.5) * 2;
  }

  private calculateEfficiency(device: EnergyDevice): number {
    let efficiency = 95; // Başlangıç verimi
    
    // Sıcaklığa göre verim kaybı
    const optimalTemp = device.deviceType === 'heater' ? 185 : 60;
    const tempDiff = Math.abs(device.temperature - optimalTemp);
    efficiency -= tempDiff * 0.1;
    
    // Güç faktörüne göre verim
    efficiency *= device.powerFactor;
    
    // Yaşlanma faktörü (çalışma saatlerine göre)
    const agingFactor = Math.max(0.8, 1 - (device.operatingHours / 100000) * 0.2);
    efficiency *= agingFactor;
    
    return Math.max(70, Math.min(98, efficiency));
  }

  private analyzeEnergyConsumption(): void {
    const totalPower = this.energyDevices.reduce((sum, device) => sum + device.currentPower, 0);
    const averageEfficiency = this.energyDevices.reduce((sum, device) => sum + device.efficiency, 0) / this.energyDevices.length;
    
    // Yüksek tüketim kontrolü
    if (totalPower > 180) { // 180 kW üzeri
      this.createEnergyAlert('high_consumption', 'critical', 
        `Toplam güç tüketimi kritik seviyede: ${totalPower.toFixed(1)} kW`,
        'Acil olmayan ekipmanları kapatın, yük dengelemesi yapın');
    }
    
    // Düşük verimlilik kontrolü
    if (averageEfficiency < 85) {
      this.createEnergyAlert('efficiency_drop', 'high',
        `Ortalama sistem verimi düşük: %${averageEfficiency.toFixed(1)}`,
        'Bakım planlaması yapın, eski ekipmanları değiştirin');
    }
  }

  private checkEnergyAlerts(): void {
    this.energyDevices.forEach(device => {
      // Güç faktörü kontrolü
      if (device.powerFactor < 0.8) {
        this.createEnergyAlert('power_quality', 'medium',
          `${device.name} güç faktörü düşük: ${device.powerFactor.toFixed(2)}`,
          'Güç faktörü düzeltme kondansatörleri ekleyin');
      }
      
      // Aşırı ısınma kontrolü
      const maxTemp = device.deviceType === 'heater' ? 200 : 80;
      if (device.temperature > maxTemp) {
        this.createEnergyAlert('predictive_failure', 'high',
          `${device.name} aşırı ısınıyor: ${device.temperature.toFixed(1)}°C`,
          'Soğutma sistemini kontrol edin, bakım planlayın');
      }
      
      // Verimlilik düşüşü kontrolü
      if (device.efficiency < 80) {
        this.createEnergyAlert('efficiency_drop', 'medium',
          `${device.name} verimi düşük: %${device.efficiency.toFixed(1)}`,
          'Bakım gerekli, parça değişimi değerlendirin');
      }
    });
    
    // Karbon emisyon limiti kontrolü
    const totalCarbon = this.energyDevices.reduce((sum, device) => sum + device.carbonFootprint, 0);
    if (totalCarbon > this.carbonEmissionLimit * 0.9) {
      this.createEnergyAlert('carbon_limit', 'high',
        `Karbon emisyonu limite yaklaşıyor: ${totalCarbon.toFixed(0)} kg CO2`,
        'Yenilenebilir enerji kaynaklarını değerlendirin');
    }
  }

  private createEnergyAlert(type: string, severity: string, message: string, recommendation: string): void {
    const existingAlert = this.energyAlerts.find(alert => 
      alert.alertType === type && alert.message === message && !alert.acknowledged
    );
    
    if (!existingAlert) {
      const alert: EnergyAlert = {
        id: `alert-${Date.now()}`,
        deviceId: '',
        alertType: type as any,
        severity: severity as any,
        message,
        recommendation,
        potentialSavings: Math.random() * 100 + 50,
        timestamp: new Date(),
        acknowledged: false
      };
      
      this.energyAlerts.push(alert);
    }
  }

  private optimizeEnergyUsage(): void {
    // Yük dengeleme optimizasyonu
    this.generateLoadBalancingOptimization();
    
    // Puant saatlerde tüketim azaltma
    this.generatePeakShavingOptimization();
    
    // Verimlilik iyileştirme
    this.generateEfficiencyOptimization();
  }

  private generateLoadBalancingOptimization(): void {
    const highLoadDevices = this.energyDevices.filter(device => 
      device.currentPower > this.getBaseLoad(device.deviceType) * 1.2
    );
    
    if (highLoadDevices.length > 0) {
      const optimization: EnergyOptimization = {
        id: `opt-${Date.now()}`,
        optimizationType: 'load_balancing',
        description: 'Yüksek yüklü ekipmanların çalışma saatlerini yeniden planla',
        estimatedSavings: 450,
        costSavings: 1282.5,
        co2Reduction: 225,
        implementationCost: 5000,
        paybackPeriod: 4,
        status: 'proposed',
        priority: 'medium'
      };
      
      if (!this.optimizations.find(opt => opt.optimizationType === 'load_balancing' && opt.status === 'proposed')) {
        this.optimizations.push(optimization);
      }
    }
  }

  private generatePeakShavingOptimization(): void {
    const currentHour = new Date().getHours();
    const isPeakHour = currentHour >= 17 && currentHour < 23;
    
    if (isPeakHour) {
      const optimization: EnergyOptimization = {
        id: `opt-peak-${Date.now()}`,
        optimizationType: 'peak_shaving',
        description: 'Puant saatlerde kritik olmayan ekipmanları kapatarak maliyeti düşür',
        estimatedSavings: 320,
        costSavings: 1360,
        co2Reduction: 160,
        implementationCost: 2000,
        paybackPeriod: 2,
        status: 'proposed',
        priority: 'high'
      };
      
      if (!this.optimizations.find(opt => opt.optimizationType === 'peak_shaving' && opt.status === 'proposed')) {
        this.optimizations.push(optimization);
      }
    }
  }

  private generateEfficiencyOptimization(): void {
    const lowEfficiencyDevices = this.energyDevices.filter(device => device.efficiency < 85);
    
    if (lowEfficiencyDevices.length > 0) {
      const optimization: EnergyOptimization = {
        id: `opt-eff-${Date.now()}`,
        optimizationType: 'efficiency_improvement',
        description: `${lowEfficiencyDevices.length} adet düşük verimli ekipmanı yenile`,
        estimatedSavings: 680,
        costSavings: 1938,
        co2Reduction: 340,
        implementationCost: 25000,
        paybackPeriod: 13,
        status: 'proposed',
        priority: 'medium'
      };
      
      if (!this.optimizations.find(opt => opt.optimizationType === 'efficiency_improvement' && opt.status === 'proposed')) {
        this.optimizations.push(optimization);
      }
    }
  }

  private generateOptimizationRecommendations(): void {
    setInterval(() => {
      // Haftalık optimizasyon önerileri
      if (Math.random() < 0.1) { // %10 olasılık
        this.generateDemandResponseOptimization();
      }
    }, 60000); // Her dakika kontrol et
  }

  private generateDemandResponseOptimization(): void {
    const optimization: EnergyOptimization = {
      id: `opt-dr-${Date.now()}`,
      optimizationType: 'demand_response',
      description: 'Elektrik şebekesi talep yanıt programına katılım',
      estimatedSavings: 850,
      costSavings: 2422.5,
      co2Reduction: 425,
      implementationCost: 8000,
      paybackPeriod: 3,
      status: 'proposed',
      priority: 'high'
    };
    
    this.optimizations.push(optimization);
  }

  private notifySubscribers(): void {
    const data = {
      energyDevices: this.energyDevices,
      energyAlerts: this.energyAlerts.slice(-10),
      optimizations: this.optimizations.slice(-5),
      totalPowerConsumption: this.energyDevices.reduce((sum, device) => sum + device.currentPower, 0),
      totalEnergyConsumed: this.energyDevices.reduce((sum, device) => sum + device.totalEnergyConsumed, 0),
      totalCarbonFootprint: this.energyDevices.reduce((sum, device) => sum + device.carbonFootprint, 0),
      averageEfficiency: this.energyDevices.reduce((sum, device) => sum + device.efficiency, 0) / this.energyDevices.length,
      currentTariff: this.getCurrentTariff(),
      estimatedMonthlyCost: this.calculateMonthlyCost(),
      timestamp: new Date()
    };
    
    this.subscribers.forEach(callback => callback(data));
  }

  private getCurrentTariff(): EnergyTariff {
    const currentHour = new Date().getHours();
    return this.tariffStructure.find(tariff => 
      currentHour >= tariff.startHour && currentHour < tariff.endHour
    ) || this.tariffStructure[1]; // Varsayılan gündüz tarifesi
  }

  private calculateMonthlyCost(): number {
    const totalMonthlyConsumption = this.energyDevices.reduce((sum, device) => 
      sum + (device.currentPower * 24 * 30), 0
    );
    return totalMonthlyConsumption * this.energyPrice;
  }

  // Public methods
  public subscribe(callback: (data: any) => void): void {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: (data: any) => void): void {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  }

  public getEnergyDevices(): EnergyDevice[] {
    return [...this.energyDevices];
  }

  public getEnergyAlerts(): EnergyAlert[] {
    return [...this.energyAlerts];
  }

  public getOptimizations(): EnergyOptimization[] {
    return [...this.optimizations];
  }

  public acknowledgeAlert(alertId: string): void {
    const alert = this.energyAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  public approveOptimization(optimizationId: string): void {
    const optimization = this.optimizations.find(o => o.id === optimizationId);
    if (optimization) {
      optimization.status = 'approved';
    }
  }

  public getCurrentData(): any {
    return {
      energyDevices: this.energyDevices,
      energyAlerts: this.energyAlerts.slice(-10),
      optimizations: this.optimizations.slice(-5),
      totalPowerConsumption: this.energyDevices.reduce((sum, device) => sum + device.currentPower, 0),
      totalEnergyConsumed: this.energyDevices.reduce((sum, device) => sum + device.totalEnergyConsumed, 0),
      totalCarbonFootprint: this.energyDevices.reduce((sum, device) => sum + device.carbonFootprint, 0),
      averageEfficiency: this.energyDevices.reduce((sum, device) => sum + device.efficiency, 0) / this.energyDevices.length,
      currentTariff: this.getCurrentTariff(),
      estimatedMonthlyCost: this.calculateMonthlyCost(),
      timestamp: new Date()
    };
  }

  public getEnergyDashboardData(): any {
    return {
      totalDevices: this.energyDevices.length,
      activeDevices: this.energyDevices.filter(d => d.status === 'active').length,
      totalPower: this.energyDevices.reduce((sum, device) => sum + device.currentPower, 0),
      averageEfficiency: this.energyDevices.reduce((sum, device) => sum + device.efficiency, 0) / this.energyDevices.length,
      totalCarbon: this.energyDevices.reduce((sum, device) => sum + device.carbonFootprint, 0),
      activeAlerts: this.energyAlerts.filter(a => !a.acknowledged).length,
      pendingOptimizations: this.optimizations.filter(o => o.status === 'proposed').length,
      currentTariff: this.getCurrentTariff(),
      estimatedMonthlyCost: this.calculateMonthlyCost()
    };
  }
}

export default EnergyMonitoringService; 