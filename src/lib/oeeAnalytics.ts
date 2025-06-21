// OEE Analytics Service
// Overall Equipment Effectiveness analysis and prediction

export interface OEEData {
  machineId: string;
  timestamp: Date;
  availability: number; // 0-100%
  performance: number; // 0-100%
  quality: number; // 0-100%
  oeeScore: number; // 0-100%
  plannedProductionTime: number; // minutes
  actualRunTime: number; // minutes
  downtime: number; // minutes
  idealCycleTime: number; // seconds
  totalCount: number;
  goodCount: number;
  defectCount: number;
}

export interface ProductionLineOEE {
  lineId: string;
  lineName: string;
  machines: string[];
  overallOEE: number;
  availability: number;
  performance: number;
  quality: number;
  bottleneckMachine: string;
  efficiency: 'excellent' | 'good' | 'fair' | 'poor';
  trend: 'improving' | 'stable' | 'declining';
  predictions: OEEPrediction[];
}

export interface OEEPrediction {
  timeframe: '1h' | '4h' | '8h' | '24h' | '7d';
  predictedOEE: number;
  confidence: number;
  factors: OEEFactor[];
  recommendations: string[];
}

export interface OEEFactor {
  factor: string;
  impact: number; // -100 to +100
  category: 'availability' | 'performance' | 'quality';
  description: string;
}

export interface OEEBenchmark {
  industry: string;
  worldClass: number; // 85%+
  good: number; // 70-85%
  fair: number; // 55-70%
  poor: number; // <55%
}

export interface DowntimeAnalysis {
  plannedDowntime: number;
  unplannedDowntime: number;
  breakdowns: number;
  setupChangeover: number;
  shortStops: number;
  reducedSpeed: number;
  startupYield: number;
  productionRejects: number;
}

class OEEAnalyticsService {
  private historicalData: Map<string, OEEData[]> = new Map();
  private benchmarks: OEEBenchmark = {
    industry: 'Plastic Manufacturing',
    worldClass: 85,
    good: 70,
    fair: 55,
    poor: 40
  };

  // Calculate OEE components
  public calculateOEE(
    plannedTime: number,
    downtime: number,
    idealCycleTime: number,
    totalCount: number,
    goodCount: number
  ): OEEData {
    // Availability = (Planned Production Time - Downtime) / Planned Production Time
    const availability = ((plannedTime - downtime) / plannedTime) * 100;
    
    // Performance = (Ideal Cycle Time × Total Count) / Operating Time
    const operatingTime = plannedTime - downtime;
    const performance = operatingTime > 0 ? 
      ((idealCycleTime * totalCount) / (operatingTime * 60)) * 100 : 0;
    
    // Quality = Good Count / Total Count
    const quality = totalCount > 0 ? (goodCount / totalCount) * 100 : 0;
    
    // OEE = Availability × Performance × Quality
    const oeeScore = (availability * performance * quality) / 10000;

    return {
      machineId: '',
      timestamp: new Date(),
      availability: Math.min(100, Math.max(0, availability)),
      performance: Math.min(100, Math.max(0, performance)),
      quality: Math.min(100, Math.max(0, quality)),
      oeeScore: Math.min(100, Math.max(0, oeeScore)),
      plannedProductionTime: plannedTime,
      actualRunTime: operatingTime,
      downtime,
      idealCycleTime,
      totalCount,
      goodCount,
      defectCount: totalCount - goodCount
    };
  }

  // Analyze production line OEE
  public analyzeProductionLine(machineIds: string[]): ProductionLineOEE {
    const machines = machineIds.map(id => this.getMachineOEE(id));
    const validMachines = machines.filter(m => m !== null) as OEEData[];
    
    if (validMachines.length === 0) {
      return this.getDefaultLineOEE(machineIds);
    }

    // Calculate line-level metrics
    const overallOEE = this.calculateLineOEE(validMachines);
    const availability = validMachines.reduce((sum, m) => sum + m.availability, 0) / validMachines.length;
    const performance = validMachines.reduce((sum, m) => sum + m.performance, 0) / validMachines.length;
    const quality = validMachines.reduce((sum, m) => sum + m.quality, 0) / validMachines.length;
    
    // Find bottleneck machine
    const bottleneckMachine = this.findBottleneck(validMachines);
    
    // Determine efficiency rating
    const efficiency = this.getEfficiencyRating(overallOEE);
    
    // Calculate trend
    const trend = this.calculateTrend(machineIds);
    
    // Generate predictions
    const predictions = this.generateOEEPredictions(validMachines);

    return {
      lineId: 'PRODUCTION_LINE_01',
      lineName: 'Su Şişesi Üretim Hattı',
      machines: machineIds,
      overallOEE,
      availability,
      performance,
      quality,
      bottleneckMachine,
      efficiency,
      trend,
      predictions
    };
  }

  // Calculate line-level OEE (considering bottleneck)
  private calculateLineOEE(machines: OEEData[]): number {
    // Line OEE is limited by the bottleneck machine
    const minOEE = Math.min(...machines.map(m => m.oeeScore));
    const avgOEE = machines.reduce((sum, m) => sum + m.oeeScore, 0) / machines.length;
    
    // Weighted average favoring bottleneck impact
    return (minOEE * 0.6) + (avgOEE * 0.4);
  }

  // Find bottleneck machine
  private findBottleneck(machines: OEEData[]): string {
    const bottleneck = machines.reduce((min, current) => 
      current.oeeScore < min.oeeScore ? current : min
    );
    return bottleneck.machineId;
  }

  // Get efficiency rating
  private getEfficiencyRating(oee: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (oee >= this.benchmarks.worldClass) return 'excellent';
    if (oee >= this.benchmarks.good) return 'good';
    if (oee >= this.benchmarks.fair) return 'fair';
    return 'poor';
  }

  // Calculate trend based on historical data
  private calculateTrend(machineIds: string[]): 'improving' | 'stable' | 'declining' {
    // Simulate trend calculation
    const trends = machineIds.map(id => {
      const data = this.historicalData.get(id) || [];
      if (data.length < 5) return 0;
      
      const recent = data.slice(-5).map(d => d.oeeScore);
      const older = data.slice(-10, -5).map(d => d.oeeScore);
      
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
      
      return recentAvg - olderAvg;
    });
    
    const avgTrend = trends.reduce((a, b) => a + b, 0) / trends.length;
    
    if (avgTrend > 2) return 'improving';
    if (avgTrend < -2) return 'declining';
    return 'stable';
  }

  // Generate OEE predictions
  private generateOEEPredictions(machines: OEEData[]): OEEPrediction[] {
    const currentOEE = machines.reduce((sum, m) => sum + m.oeeScore, 0) / machines.length;
    
    return [
      {
        timeframe: '1h',
        predictedOEE: this.adjustPrediction(currentOEE, 0.98),
        confidence: 95,
        factors: this.generateFactors('1h'),
        recommendations: this.generateRecommendations(currentOEE, '1h')
      },
      {
        timeframe: '4h',
        predictedOEE: this.adjustPrediction(currentOEE, 0.95),
        confidence: 88,
        factors: this.generateFactors('4h'),
        recommendations: this.generateRecommendations(currentOEE, '4h')
      },
      {
        timeframe: '8h',
        predictedOEE: this.adjustPrediction(currentOEE, 0.92),
        confidence: 82,
        factors: this.generateFactors('8h'),
        recommendations: this.generateRecommendations(currentOEE, '8h')
      },
      {
        timeframe: '24h',
        predictedOEE: this.adjustPrediction(currentOEE, 0.88),
        confidence: 75,
        factors: this.generateFactors('24h'),
        recommendations: this.generateRecommendations(currentOEE, '24h')
      }
    ];
  }

  // Adjust prediction based on various factors
  private adjustPrediction(baseOEE: number, reliability: number): number {
    const randomFactor = (Math.random() - 0.5) * 10; // ±5% variation
    const predicted = baseOEE * reliability + randomFactor;
    return Math.min(100, Math.max(0, predicted));
  }

  // Generate impact factors
  private generateFactors(timeframe: string): OEEFactor[] {
    const factors: OEEFactor[] = [];
    
    // Availability factors
    factors.push({
      factor: 'Planlı Bakım',
      impact: timeframe === '24h' ? -8 : -2,
      category: 'availability',
      description: 'Rutin bakım duruşları'
    });
    
    factors.push({
      factor: 'Makine Arızaları',
      impact: Math.random() > 0.7 ? -15 : -3,
      category: 'availability',
      description: 'Beklenmeyen duruşlar'
    });
    
    // Performance factors
    factors.push({
      factor: 'Operatör Verimliliği',
      impact: Math.random() * 10 - 5,
      category: 'performance',
      description: 'Operatör deneyimi ve motivasyonu'
    });
    
    factors.push({
      factor: 'Malzeme Kalitesi',
      impact: Math.random() * 8 - 4,
      category: 'performance',
      description: 'Hammadde kalite değişimi'
    });
    
    // Quality factors
    factors.push({
      factor: 'Kalıp Durumu',
      impact: Math.random() * 12 - 6,
      category: 'quality',
      description: 'Kalıp aşınması ve bakım durumu'
    });
    
    factors.push({
      factor: 'Çevresel Koşullar',
      impact: Math.random() * 6 - 3,
      category: 'quality',
      description: 'Sıcaklık ve nem değişimleri'
    });
    
    return factors;
  }

  // Generate recommendations based on OEE level
  private generateRecommendations(oee: number, timeframe: string): string[] {
    const recommendations: string[] = [];
    
    if (oee < 60) {
      recommendations.push('Acil müdahale gerekli - üretim hattını durdurun');
      recommendations.push('Kalite kontrol süreçlerini gözden geçirin');
      recommendations.push('Makine kalibrasyonu yapın');
    } else if (oee < 75) {
      recommendations.push('Performans iyileştirme planı hazırlayın');
      recommendations.push('Operatör eğitimi düzenleyin');
      recommendations.push('Bakım programını optimize edin');
    } else if (oee < 85) {
      recommendations.push('Sürekli iyileştirme projelerine odaklanın');
      recommendations.push('Veri analizi ile darboğazları tespit edin');
      recommendations.push('Önleyici bakım sıklığını artırın');
    } else {
      recommendations.push('Mükemmel performans - mevcut durumu koruyun');
      recommendations.push('En iyi uygulamaları diğer hatlara yaygınlaştırın');
      recommendations.push('Sürekli monitoring ile stabiliteyi sağlayın');
    }
    
    if (timeframe === '24h' || timeframe === '7d') {
      recommendations.push('Uzun vadeli trend analizi yapın');
      recommendations.push('Kapasite planlama için verileri kullanın');
    }
    
    return recommendations;
  }

  // Get machine OEE data
  private getMachineOEE(machineId: string): OEEData | null {
    // Simulate machine data
    const mockData: OEEData = {
      machineId,
      timestamp: new Date(),
      availability: 75 + Math.random() * 20,
      performance: 70 + Math.random() * 25,
      quality: 80 + Math.random() * 15,
      oeeScore: 0,
      plannedProductionTime: 480, // 8 hours
      actualRunTime: 420,
      downtime: 60,
      idealCycleTime: 30, // seconds
      totalCount: 800,
      goodCount: 720,
      defectCount: 80
    };
    
    // Calculate OEE score
    mockData.oeeScore = (mockData.availability * mockData.performance * mockData.quality) / 10000;
    
    return mockData;
  }

  // Default line OEE when no data available
  private getDefaultLineOEE(machineIds: string[]): ProductionLineOEE {
    return {
      lineId: 'PRODUCTION_LINE_01',
      lineName: 'Su Şişesi Üretim Hattı',
      machines: machineIds,
      overallOEE: 65,
      availability: 75,
      performance: 80,
      quality: 85,
      bottleneckMachine: machineIds[0] || 'INJ001',
      efficiency: 'fair',
      trend: 'stable',
      predictions: []
    };
  }

  // Analyze downtime breakdown
  public analyzeDowntime(machineId: string): DowntimeAnalysis {
    return {
      plannedDowntime: 45, // minutes
      unplannedDowntime: 35,
      breakdowns: 20,
      setupChangeover: 15,
      shortStops: 10,
      reducedSpeed: 25,
      startupYield: 8,
      productionRejects: 12
    };
  }

  // Get OEE benchmarks
  public getBenchmarks(): OEEBenchmark {
    return { ...this.benchmarks };
  }

  // Calculate Six Big Losses
  public calculateSixBigLosses(data: OEEData): any {
    return {
      equipmentFailure: data.downtime * 0.3,
      setupAdjustments: data.downtime * 0.25,
      idlingMinorStops: (data.plannedProductionTime - data.actualRunTime) * 0.4,
      reducedSpeed: (data.plannedProductionTime - data.actualRunTime) * 0.6,
      startupRejects: data.defectCount * 0.3,
      productionRejects: data.defectCount * 0.7
    };
  }
}

// Singleton instance
export const oeeAnalyticsService = new OEEAnalyticsService();
export default oeeAnalyticsService; 