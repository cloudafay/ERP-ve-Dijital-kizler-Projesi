// Zaman Serisi Veri Depolama Servisi
// Fire oranları, makine verimliliği gibi metriklerin zaman serisi tabanlı depolanması

export interface TimeSeriesDataPoint {
  timestamp: Date;
  value: number;
  machineId: string;
  metricType: 'fire_rate' | 'efficiency' | 'production_rate' | 'downtime' | 'oee' | 'quality_score';
  unit: string;
  metadata?: Record<string, any>;
}

export interface MachineMetrics {
  machineId: string;
  machineName: string;
  fireRate: number; // Fire oranı (%)
  efficiency: number; // Verimlilik (%)
  productionRate: number; // Üretim hızı (şişe/saat)
  downtime: number; // Duruş süresi (dakika)
  oee: number; // Overall Equipment Effectiveness (%)
  qualityScore: number; // Kalite skoru (%)
  lastUpdated: Date;
}

export interface TimeSeriesQuery {
  machineIds?: string[];
  metricTypes?: string[];
  startDate: Date;
  endDate: Date;
  aggregation?: 'raw' | 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export interface AggregatedData {
  timestamp: Date;
  machineId: string;
  metricType: string;
  avg: number;
  min: number;
  max: number;
  count: number;
  sum: number;
}

class TimeSeriesStorageService {
  private dataPoints: TimeSeriesDataPoint[] = [];
  private readonly MAX_STORAGE_SIZE = 100000; // Maksimum veri noktası sayısı
  private readonly CLEANUP_THRESHOLD = 0.8; // %80 dolduğunda temizlik yap

  constructor() {
    this.initializeSampleData();
    this.startPeriodicDataGeneration();
  }

  // Örnek veri oluşturma
  private initializeSampleData(): void {
    const machines = [
      { id: 'INJ-001', name: 'Enjeksiyon Makinesi 1' },
      { id: 'BLW-001', name: 'Şişirme Makinesi 1' },
      { id: 'LBL-001', name: 'Etiketleme Makinesi 1' },
      { id: 'PKG-001', name: 'Paketleme Makinesi 1' },
      { id: 'INJ-002', name: 'Enjeksiyon Makinesi 2' },
      { id: 'BLW-002', name: 'Şişirme Makinesi 2' }
    ];

    const now = new Date();
    const hoursBack = 24 * 7; // Son 7 gün

    for (let i = 0; i < hoursBack; i++) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
      
      machines.forEach(machine => {
        // Fire oranı (0.5% - 3%)
        this.addDataPoint({
          timestamp,
          value: 0.5 + Math.random() * 2.5,
          machineId: machine.id,
          metricType: 'fire_rate',
          unit: '%',
          metadata: { machineName: machine.name }
        });

        // Verimlilik (75% - 95%)
        this.addDataPoint({
          timestamp,
          value: 75 + Math.random() * 20,
          machineId: machine.id,
          metricType: 'efficiency',
          unit: '%',
          metadata: { machineName: machine.name }
        });

        // Üretim hızı (800 - 1200 şişe/saat)
        this.addDataPoint({
          timestamp,
          value: 800 + Math.random() * 400,
          machineId: machine.id,
          metricType: 'production_rate',
          unit: 'şişe/saat',
          metadata: { machineName: machine.name }
        });

        // Duruş süresi (0 - 30 dakika)
        this.addDataPoint({
          timestamp,
          value: Math.random() * 30,
          machineId: machine.id,
          metricType: 'downtime',
          unit: 'dakika',
          metadata: { machineName: machine.name }
        });

        // OEE (60% - 90%)
        this.addDataPoint({
          timestamp,
          value: 60 + Math.random() * 30,
          machineId: machine.id,
          metricType: 'oee',
          unit: '%',
          metadata: { machineName: machine.name }
        });

        // Kalite skoru (85% - 99%)
        this.addDataPoint({
          timestamp,
          value: 85 + Math.random() * 14,
          machineId: machine.id,
          metricType: 'quality_score',
          unit: '%',
          metadata: { machineName: machine.name }
        });
      });
    }
  }

  // Periyodik veri üretimi
  private startPeriodicDataGeneration(): void {
    setInterval(() => {
      this.generateRealtimeData();
    }, 60000); // Her dakika yeni veri
  }

  private generateRealtimeData(): void {
    const machines = ['INJ-001', 'BLW-001', 'LBL-001', 'PKG-001', 'INJ-002', 'BLW-002'];
    const now = new Date();

    machines.forEach(machineId => {
      // Gerçekçi veri üretimi - önceki değerlere dayalı
      const lastData = this.getLatestDataForMachine(machineId);
      
      // Fire oranı - trend ile
      const lastFireRate = lastData.fire_rate || 1.5;
      const fireRateChange = (Math.random() - 0.5) * 0.2;
      const newFireRate = Math.max(0.1, Math.min(5, lastFireRate + fireRateChange));

      this.addDataPoint({
        timestamp: now,
        value: newFireRate,
        machineId,
        metricType: 'fire_rate',
        unit: '%'
      });

      // Verimlilik - fire oranı ile ters korelasyon
      const baseEfficiency = 90 - (newFireRate * 5);
      const efficiencyNoise = (Math.random() - 0.5) * 5;
      const newEfficiency = Math.max(70, Math.min(95, baseEfficiency + efficiencyNoise));

      this.addDataPoint({
        timestamp: now,
        value: newEfficiency,
        machineId,
        metricType: 'efficiency',
        unit: '%'
      });

      // Diğer metrikler...
      this.addDataPoint({
        timestamp: now,
        value: 900 + Math.random() * 200,
        machineId,
        metricType: 'production_rate',
        unit: 'şişe/saat'
      });

      this.addDataPoint({
        timestamp: now,
        value: Math.random() * 15,
        machineId,
        metricType: 'downtime',
        unit: 'dakika'
      });

      this.addDataPoint({
        timestamp: now,
        value: newEfficiency * 0.85 + Math.random() * 10,
        machineId,
        metricType: 'oee',
        unit: '%'
      });

      this.addDataPoint({
        timestamp: now,
        value: 90 + Math.random() * 9,
        machineId,
        metricType: 'quality_score',
        unit: '%'
      });
    });

    this.cleanupOldData();
  }

  // Veri noktası ekleme
  public addDataPoint(dataPoint: TimeSeriesDataPoint): void {
    this.dataPoints.push(dataPoint);
    
    // Bellek yönetimi
    if (this.dataPoints.length > this.MAX_STORAGE_SIZE * this.CLEANUP_THRESHOLD) {
      this.cleanupOldData();
    }
  }

  // Eski verileri temizleme
  private cleanupOldData(): void {
    const cutoffDate = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)); // 30 gün öncesi
    this.dataPoints = this.dataPoints.filter(point => point.timestamp > cutoffDate);
  }

  // Veri sorgulama
  public queryData(query: TimeSeriesQuery): TimeSeriesDataPoint[] {
    let filteredData = this.dataPoints.filter(point => 
      point.timestamp >= query.startDate && 
      point.timestamp <= query.endDate
    );

    if (query.machineIds && query.machineIds.length > 0) {
      filteredData = filteredData.filter(point => 
        query.machineIds!.includes(point.machineId)
      );
    }

    if (query.metricTypes && query.metricTypes.length > 0) {
      filteredData = filteredData.filter(point => 
        query.metricTypes!.includes(point.metricType)
      );
    }

    return filteredData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Agregasyon işlemleri
  public getAggregatedData(query: TimeSeriesQuery): AggregatedData[] {
    const rawData = this.queryData(query);
    const aggregation = query.aggregation || 'hourly';
    
    const groupedData = new Map<string, TimeSeriesDataPoint[]>();

    rawData.forEach(point => {
      const key = this.getAggregationKey(point.timestamp, point.machineId, point.metricType, aggregation);
      if (!groupedData.has(key)) {
        groupedData.set(key, []);
      }
      groupedData.get(key)!.push(point);
    });

    const aggregatedResults: AggregatedData[] = [];

    groupedData.forEach((points, key) => {
      const [timestamp, machineId, metricType] = key.split('|');
      const values = points.map(p => p.value);
      
      aggregatedResults.push({
        timestamp: new Date(timestamp),
        machineId,
        metricType,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
        sum: values.reduce((a, b) => a + b, 0)
      });
    });

    return aggregatedResults.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private getAggregationKey(timestamp: Date, machineId: string, metricType: string, aggregation: string): string {
    let aggregatedTimestamp: Date;

    switch (aggregation) {
      case 'hourly':
        aggregatedTimestamp = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate(), timestamp.getHours());
        break;
      case 'daily':
        aggregatedTimestamp = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate());
        break;
      case 'weekly':
        const weekStart = new Date(timestamp);
        weekStart.setDate(timestamp.getDate() - timestamp.getDay());
        aggregatedTimestamp = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
        break;
      case 'monthly':
        aggregatedTimestamp = new Date(timestamp.getFullYear(), timestamp.getMonth(), 1);
        break;
      default:
        aggregatedTimestamp = timestamp;
    }

    return `${aggregatedTimestamp.toISOString()}|${machineId}|${metricType}`;
  }

  // Makine için en son verileri getirme
  public getLatestDataForMachine(machineId: string): Record<string, number> {
    const latest: Record<string, number> = {};
    const metricTypes = ['fire_rate', 'efficiency', 'production_rate', 'downtime', 'oee', 'quality_score'];

    metricTypes.forEach(metricType => {
      const data = this.dataPoints
        .filter(p => p.machineId === machineId && p.metricType === metricType)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      if (data.length > 0) {
        latest[metricType] = data[0].value;
      }
    });

    return latest;
  }

  // Tüm makineler için güncel metrikleri getirme
  public getCurrentMachineMetrics(): MachineMetrics[] {
    const machines = ['INJ-001', 'BLW-001', 'LBL-001', 'PKG-001', 'INJ-002', 'BLW-002'];
    const machineNames = {
      'INJ-001': 'Enjeksiyon Makinesi 1',
      'BLW-001': 'Şişirme Makinesi 1',
      'LBL-001': 'Etiketleme Makinesi 1',
      'PKG-001': 'Paketleme Makinesi 1',
      'INJ-002': 'Enjeksiyon Makinesi 2',
      'BLW-002': 'Şişirme Makinesi 2'
    };

    return machines.map(machineId => {
      const latestData = this.getLatestDataForMachine(machineId);
      
      return {
        machineId,
        machineName: machineNames[machineId as keyof typeof machineNames],
        fireRate: latestData.fire_rate || 0,
        efficiency: latestData.efficiency || 0,
        productionRate: latestData.production_rate || 0,
        downtime: latestData.downtime || 0,
        oee: latestData.oee || 0,
        qualityScore: latestData.quality_score || 0,
        lastUpdated: new Date()
      };
    });
  }

  // Trend analizi
  public getTrendAnalysis(machineId: string, metricType: string, hours: number = 24): {
    trend: 'increasing' | 'decreasing' | 'stable';
    changePercent: number;
    currentValue: number;
    previousValue: number;
  } {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (hours * 60 * 60 * 1000));

    const data = this.queryData({
      machineIds: [machineId],
      metricTypes: [metricType],
      startDate,
      endDate
    });

    if (data.length < 2) {
      return {
        trend: 'stable',
        changePercent: 0,
        currentValue: data[0]?.value || 0,
        previousValue: data[0]?.value || 0
      };
    }

    const currentValue = data[data.length - 1].value;
    const previousValue = data[0].value;
    const changePercent = ((currentValue - previousValue) / previousValue) * 100;

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (Math.abs(changePercent) > 5) {
      trend = changePercent > 0 ? 'increasing' : 'decreasing';
    }

    return {
      trend,
      changePercent,
      currentValue,
      previousValue
    };
  }

  // Veri dışa aktarma
  public exportData(query: TimeSeriesQuery, format: 'json' | 'pdf' = 'json'): string | void {
    const data = this.queryData(query);

    if (format === 'pdf') {
      // PDF export için PDFExportService kullan - dynamic import
      import('../utils/pdfExport').then(({ PDFExportService }) => {
        const metricName = query.metricTypes?.[0] || 'tum_metrikler';
        PDFExportService.exportTimeSeriesData(data, metricName);
      }).catch(error => {
        console.error('PDF export hatası:', error);
      });
      return; // PDF export void döner
    }

    return JSON.stringify(data, null, 2);
  }

  // İstatistikler
  public getStorageStats(): {
    totalDataPoints: number;
    oldestTimestamp: Date | null;
    newestTimestamp: Date | null;
    machineCount: number;
    metricTypes: string[];
  } {
    const machineIds = new Set(this.dataPoints.map(p => p.machineId));
    const metricTypes = new Set(this.dataPoints.map(p => p.metricType));
    const timestamps = this.dataPoints.map(p => p.timestamp).sort((a, b) => a.getTime() - b.getTime());

    return {
      totalDataPoints: this.dataPoints.length,
      oldestTimestamp: timestamps[0] || null,
      newestTimestamp: timestamps[timestamps.length - 1] || null,
      machineCount: machineIds.size,
      metricTypes: Array.from(metricTypes)
    };
  }
}

// Singleton instance
export const timeSeriesStorage = new TimeSeriesStorageService();

// Export edilecek fonksiyonlar - bind ile this bağlamını koruyoruz
export const addDataPoint = timeSeriesStorage.addDataPoint.bind(timeSeriesStorage);
export const queryData = timeSeriesStorage.queryData.bind(timeSeriesStorage);
export const getAggregatedData = timeSeriesStorage.getAggregatedData.bind(timeSeriesStorage);
export const getCurrentMachineMetrics = timeSeriesStorage.getCurrentMachineMetrics.bind(timeSeriesStorage);
export const getTrendAnalysis = timeSeriesStorage.getTrendAnalysis.bind(timeSeriesStorage);
export const exportData = timeSeriesStorage.exportData.bind(timeSeriesStorage);
export const getStorageStats = timeSeriesStorage.getStorageStats.bind(timeSeriesStorage);