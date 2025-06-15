import { SensorData, MachineStatus, AIForecast } from './store';

export interface AnomalyDetection {
  id: string;
  machineId: string;
  anomalyType: 'temperature' | 'vibration' | 'speed' | 'pattern' | 'quality';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  detectedAt: Date;
  suggestedActions: string[];
}

export interface MaintenanceRecommendation {
  machineId: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedDowntime: number; // saat
  costEstimate: number; // TL
  maintenanceType: 'preventive' | 'corrective' | 'predictive';
  description: string;
  parts: string[];
  scheduledDate?: Date;
}

export interface QualityPrediction {
  batchId: string;
  predictedDefectRate: number;
  qualityScore: number;
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
}

export interface ProductionOptimization {
  currentEfficiency: number;
  potentialEfficiency: number;
  improvementAreas: {
    area: string;
    impact: number;
    effort: 'low' | 'medium' | 'high';
    description: string;
  }[];
  estimatedROI: number;
}

export class AIService {
  private static instance: AIService;
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
  
  // Anomali Tespiti - Düşük hassasiyet (dakikada max 1 anomali)
  detectAnomalies(sensorData: SensorData[], machines: MachineStatus[]): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];
    
    // Anomali tespit oranını azaltmak için rastgele kontrol
    const detectionChance = Math.random();
    if (detectionChance > 0.15) { // %85 olasılıkla anomali tespit etme
      return anomalies;
    }
    
    // Sadece bir makineyi kontrol et (rastgele)
    const randomMachine = machines[Math.floor(Math.random() * machines.length)];
    if (!randomMachine) return anomalies;
    
    const machineData = sensorData.filter(data => data.machineId === randomMachine.id);
    
    // Sıcaklık anomalisi - daha yüksek eşik
    const tempData = machineData.filter(data => data.sensorType === 'temperature');
    if (tempData.length > 0 && Math.random() > 0.7) { // %30 şans
      const avgTemp = tempData.reduce((sum, data) => sum + data.value, 0) / tempData.length;
      const tempStdDev = Math.sqrt(tempData.reduce((sum, data) => sum + Math.pow(data.value - avgTemp, 2), 0) / tempData.length);
      
      const latestTemp = tempData[0];
      // Daha yüksek eşik: 3 standart sapma yerine 2.5
      if (latestTemp && Math.abs(latestTemp.value - avgTemp) > 3.5 * tempStdDev) {
        anomalies.push({
          id: `anomaly-${Date.now()}-${randomMachine.id}`,
          machineId: randomMachine.id,
          anomalyType: 'temperature',
          severity: latestTemp.value > avgTemp + 3.5 * tempStdDev ? 'high' : 'medium',
          confidence: 0.85,
          description: `Beklenenden ${latestTemp.value > avgTemp ? 'yüksek' : 'düşük'} sıcaklık tespit edildi`,
          detectedAt: new Date(),
          suggestedActions: [
            'Soğutma sistemini kontrol edin',
            'Termostat ayarlarını gözden geçirin',
            'Sensör kalibrasyonu yapın'
          ]
        });
      }
    }
    
    // Titreşim anomalisi - daha yüksek eşik
    const vibData = machineData.filter(data => data.sensorType === 'vibration');
    if (vibData.length > 0 && Math.random() > 0.8 && anomalies.length === 0) { // %20 şans, ve sadece sıcaklık anomalisi yoksa
      const avgVib = vibData.reduce((sum, data) => sum + data.value, 0) / vibData.length;
      const latestVib = vibData[0];
      
      // Daha yüksek eşik: 2.5x yerine 1.5x
      if (latestVib && latestVib.value > avgVib * 2.5) {
        anomalies.push({
          id: `anomaly-${Date.now()}-vib-${randomMachine.id}`,
          machineId: randomMachine.id,
          anomalyType: 'vibration',
          severity: latestVib.value > avgVib * 3 ? 'critical' : 'high',
          confidence: 0.92,
          description: `Anormal titreşim seviyesi: ${latestVib.value.toFixed(2)} mm/s`,
          detectedAt: new Date(),
          suggestedActions: [
            'Makine bağlantılarını kontrol edin',
            'Yağlama sistemini gözden geçirin',
            'Balans ayarı yapın',
            'Acil bakım planlayın'
          ]
        });
      }
    }
    
    // Maksimum 1 anomali döndür
    return anomalies.slice(0, 1);
  }
  
  // Bakım Önerileri
  generateMaintenanceRecommendations(machines: MachineStatus[], sensorData: SensorData[]): MaintenanceRecommendation[] {
    const recommendations: MaintenanceRecommendation[] = [];
    
    machines.forEach(machine => {
      const daysSinceLastMaintenance = Math.floor((Date.now() - machine.lastMaintenance.getTime()) / (1000 * 60 * 60 * 24));
      const daysUntilNextMaintenance = Math.floor((machine.nextMaintenance.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      // Acil bakım gereksinimi
      if (machine.efficiency < 85 || machine.temperature > 200 || machine.vibration > 0.8) {
        recommendations.push({
          machineId: machine.id,
          urgency: 'critical',
          estimatedDowntime: 4,
          costEstimate: 15000,
          maintenanceType: 'corrective',
          description: 'Kritik performans düşüşü tespit edildi. Acil müdahale gerekli.',
          parts: ['Yağlama sistemi', 'Soğutma sistemi', 'Sensör kalibrasyonu'],
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 gün sonra
        });
      }
      
      // Önleyici bakım
      else if (daysUntilNextMaintenance <= 7) {
        recommendations.push({
          machineId: machine.id,
          urgency: 'medium',
          estimatedDowntime: 2,
          costEstimate: 8000,
          maintenanceType: 'preventive',
          description: 'Planlanan önleyici bakım yaklaşıyor.',
          parts: ['Filtreler', 'Yağ değişimi', 'Genel kontrol'],
          scheduledDate: machine.nextMaintenance
        });
      }
      
      // Tahmine dayalı bakım
      else if (machine.efficiency < 90 && daysSinceLastMaintenance > 20) {
        recommendations.push({
          machineId: machine.id,
          urgency: 'low',
          estimatedDowntime: 1,
          costEstimate: 5000,
          maintenanceType: 'predictive',
          description: 'Verimlilik düşüşü tespit edildi. Tahmine dayalı bakım öneriliyor.',
          parts: ['Performans optimizasyonu', 'Kalibrasyon'],
        });
      }
    });
    
    return recommendations;
  }
  
  // Kalite Tahmini
  predictQuality(machineStatus: MachineStatus[], currentBatch: string): QualityPrediction {
    // Makine durumlarına göre kalite tahmini
    const avgEfficiency = machineStatus.reduce((sum, machine) => sum + machine.efficiency, 0) / machineStatus.length;
    const runningMachines = machineStatus.filter(machine => machine.status === 'running').length;
    const totalMachines = machineStatus.length;
    
    // Risk faktörleri
    const riskFactors: string[] = [];
    let riskScore = 0;
    
    if (avgEfficiency < 90) {
      riskFactors.push('Düşük makine verimliliği');
      riskScore += 0.2;
    }
    
    if (runningMachines / totalMachines < 0.8) {
      riskFactors.push('Çok sayıda makine durmuş');
      riskScore += 0.3;
    }
    
    machineStatus.forEach(machine => {
      if (machine.temperature > 190) {
        riskFactors.push(`${machine.name} - Yüksek sıcaklık`);
        riskScore += 0.1;
      }
      if (machine.vibration > 0.6) {
        riskFactors.push(`${machine.name} - Yüksek titreşim`);
        riskScore += 0.1;
      }
    });
    
    const predictedDefectRate = Math.min(10, Math.max(0.5, 2 + riskScore * 8));
    const qualityScore = Math.max(75, 100 - predictedDefectRate * 2.5);
    
    return {
      batchId: currentBatch,
      predictedDefectRate,
      qualityScore,
      riskFactors,
      recommendations: [
        'Makine sıcaklıklarını optimize edin',
        'Titreşim seviyelerini azaltın',
        'Kalite kontrol sıklığını artırın',
        'Operatör eğitimi düzenleyin'
      ],
      confidence: 0.78
    };
  }
  
  // Üretim Optimizasyonu
  optimizeProduction(machines: MachineStatus[], productionData: any): ProductionOptimization {
    const currentEfficiency = productionData.efficiency;
    const bottlenecks = machines.filter(machine => machine.efficiency < 85);
    
    const improvementAreas = [
      {
        area: 'Makine Verimliliği',
        impact: 15,
        effort: 'medium' as const,
        description: 'Düşük performanslı makinelerin optimizasyonu'
      },
      {
        area: 'Enerji Tüketimi',
        impact: 8,
        effort: 'low' as const,
        description: 'Enerji tasarrufu algoritmaları'
      },
      {
        area: 'Kalite Kontrolü',
        impact: 12,
        effort: 'high' as const,
        description: 'Otomatik kalite kontrol sistemleri'
      },
      {
        area: 'Vardiya Optimizasyonu',
        impact: 10,
        effort: 'medium' as const,
        description: 'Vardiya planlaması ve kaynak dağılımı'
      }
    ];
    
    const potentialImprovement = improvementAreas.reduce((sum, area) => sum + area.impact, 0);
    const potentialEfficiency = Math.min(98, currentEfficiency + potentialImprovement * 0.3);
    
    return {
      currentEfficiency,
      potentialEfficiency,
      improvementAreas,
      estimatedROI: 2.4 // 2.4x yatırım getirisi
    };
  }
  
  // Enerji Optimizasyonu
  optimizeEnergy(machines: MachineStatus[]): {
    currentConsumption: number;
    optimizedConsumption: number;
    savingsPotential: number;
    recommendations: string[];
  } {
    const totalConsumption = machines.reduce((sum, machine) => sum + machine.energyConsumption, 0);
    const idleMachines = machines.filter(machine => machine.status !== 'running');
    
    // Boştaki makinelerin enerji tasarrufu
    const idleConsumption = idleMachines.reduce((sum, machine) => sum + machine.energyConsumption, 0);
    const optimizedConsumption = totalConsumption - (idleConsumption * 0.6); // %60 tasarruf
    
    return {
      currentConsumption: totalConsumption,
      optimizedConsumption,
      savingsPotential: totalConsumption - optimizedConsumption,
      recommendations: [
        'Boştaki makineleri uyku moduna alın',
        'Yük dengelemesi yapın',
        'Enerji verimli çalışma saatleri belirleyin',
        'Otomatik kapanma sistemleri kurun'
      ]
    };
  }
  
  // Karbon Ayak İzi Hesaplama
  calculateCarbonFootprint(machines: MachineStatus[], productionData: any): {
    dailyEmission: number; // kg CO2
    monthlyEmission: number;
    efficiency: 'excellent' | 'good' | 'average' | 'poor';
    recommendations: string[];
  } {
    const energyConsumption = machines.reduce((sum, machine) => sum + machine.energyConsumption, 0);
    const dailyEmission = energyConsumption * 0.45; // kWh -> kg CO2 (Türkiye elektrik karması)
    const monthlyEmission = dailyEmission * 30;
    
    let efficiency: 'excellent' | 'good' | 'average' | 'poor';
    if (dailyEmission < 100) efficiency = 'excellent';
    else if (dailyEmission < 200) efficiency = 'good';
    else if (dailyEmission < 300) efficiency = 'average';
    else efficiency = 'poor';
    
    return {
      dailyEmission,
      monthlyEmission,
      efficiency,
      recommendations: [
        'Yenilenebilir enerji kaynaklarına geçin',
        'Enerji verimliliğini artırın',
        'Karbon ofset programlarına katılın',
        'Üretim süreçlerini optimize edin'
      ]
    };
  }
}

export const aiService = AIService.getInstance(); 