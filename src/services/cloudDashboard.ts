import { format, subDays, subHours, subMinutes } from 'date-fns';

export interface DashboardMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  timestamp: Date;
  category: 'production' | 'quality' | 'efficiency' | 'energy' | 'maintenance';
}

export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
  machineId: string;
  metricType: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'gauge' | 'heatmap';
  position: { x: number; y: number; w: number; h: number };
  config: {
    dataSource: string;
    query: string;
    refreshInterval: number;
    chartType?: 'line' | 'bar' | 'area' | 'pie';
    thresholds?: { warning: number; critical: number };
  };
  data?: any[];
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
}

export class CloudDashboardService {
  private static instance: CloudDashboardService;
  private dashboards: Map<string, Dashboard> = new Map();
  private metrics: Map<string, DashboardMetric[]> = new Map();
  private timeSeries: Map<string, TimeSeriesPoint[]> = new Map();
  private isConnected = false;

  private constructor() {
    this.initializeDefaultDashboards();
    this.startDataSimulation();
  }

  public static getInstance(): CloudDashboardService {
    if (!CloudDashboardService.instance) {
      CloudDashboardService.instance = new CloudDashboardService();
    }
    return CloudDashboardService.instance;
  }

  // Bulut bağlantısını simüle et
  public async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        console.log('🌐 Cloud Dashboard Service connected');
        resolve(true);
      }, 1000);
    });
  }

  public isCloudConnected(): boolean {
    return this.isConnected;
  }

  // Varsayılan dashboard'ları oluştur
  private initializeDefaultDashboards(): void {
    const productionDashboard: Dashboard = {
      id: 'production-overview',
      name: 'Üretim Genel Bakış',
      description: 'Ana üretim metrikleri ve performans göstergeleri',
      tags: ['production', 'overview', 'kpi'],
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: 'system',
      widgets: [
        {
          id: 'production-rate',
          title: 'Üretim Hızı',
          type: 'chart',
          position: { x: 0, y: 0, w: 6, h: 4 },
          config: {
            dataSource: 'timescale',
            query: 'SELECT * FROM production_metrics WHERE timestamp > NOW() - INTERVAL \'24 hours\'',
            refreshInterval: 30,
            chartType: 'line',
            thresholds: { warning: 1000, critical: 800 }
          }
        },
        {
          id: 'efficiency-gauge',
          title: 'Genel Verimlilik',
          type: 'gauge',
          position: { x: 6, y: 0, w: 3, h: 4 },
          config: {
            dataSource: 'timescale',
            query: 'SELECT AVG(efficiency) FROM machine_metrics WHERE timestamp > NOW() - INTERVAL \'1 hour\'',
            refreshInterval: 60,
            thresholds: { warning: 80, critical: 70 }
          }
        },
        {
          id: 'quality-metrics',
          title: 'Kalite Metrikleri',
          type: 'metric',
          position: { x: 9, y: 0, w: 3, h: 4 },
          config: {
            dataSource: 'timescale',
            query: 'SELECT * FROM quality_metrics ORDER BY timestamp DESC LIMIT 1',
            refreshInterval: 120
          }
        },
        {
          id: 'machine-status',
          title: 'Makine Durumları',
          type: 'heatmap',
          position: { x: 0, y: 4, w: 12, h: 4 },
          config: {
            dataSource: 'timescale',
            query: 'SELECT machine_id, status, efficiency FROM machine_status',
            refreshInterval: 30
          }
        }
      ]
    };

    const energyDashboard: Dashboard = {
      id: 'energy-monitoring',
      name: 'Enerji İzleme',
      description: 'Enerji tüketimi ve optimizasyon metrikleri',
      tags: ['energy', 'sustainability', 'cost'],
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: 'system',
      widgets: [
        {
          id: 'energy-consumption',
          title: 'Enerji Tüketimi (kWh)',
          type: 'chart',
          position: { x: 0, y: 0, w: 8, h: 4 },
          config: {
            dataSource: 'timescale',
            query: 'SELECT * FROM energy_consumption WHERE timestamp > NOW() - INTERVAL \'7 days\'',
            refreshInterval: 300,
            chartType: 'area'
          }
        },
        {
          id: 'cost-analysis',
          title: 'Maliyet Analizi',
          type: 'chart',
          position: { x: 8, y: 0, w: 4, h: 4 },
          config: {
            dataSource: 'timescale',
            query: 'SELECT * FROM energy_costs WHERE timestamp > NOW() - INTERVAL \'30 days\'',
            refreshInterval: 3600,
            chartType: 'bar'
          }
        }
      ]
    };

    this.dashboards.set(productionDashboard.id, productionDashboard);
    this.dashboards.set(energyDashboard.id, energyDashboard);
  }

  // Veri simülasyonunu başlat
  private startDataSimulation(): void {
    // Her 30 saniyede bir yeni veri üret
    setInterval(() => {
      this.generateMetrics();
      this.generateTimeSeries();
    }, 30000);

    // İlk veriyi hemen üret
    this.generateMetrics();
    this.generateTimeSeries();
  }

  // Metrik verilerini üret
  private generateMetrics(): void {
    const now = new Date();
    const categories: DashboardMetric['category'][] = ['production', 'quality', 'efficiency', 'energy', 'maintenance'];
    
    categories.forEach(category => {
      const metrics: DashboardMetric[] = [];
      
      switch (category) {
        case 'production':
          metrics.push({
            id: 'production-rate',
            name: 'Üretim Hızı',
            value: 1200 + Math.random() * 300,
            unit: 'şişe/saat',
            trend: Math.random() > 0.5 ? 'up' : 'down',
            change: (Math.random() - 0.5) * 10,
            timestamp: now,
            category
          });
          break;
        case 'quality':
          metrics.push({
            id: 'quality-score',
            name: 'Kalite Skoru',
            value: 95 + Math.random() * 4,
            unit: '%',
            trend: Math.random() > 0.3 ? 'up' : 'stable',
            change: (Math.random() - 0.5) * 2,
            timestamp: now,
            category
          });
          break;
        case 'efficiency':
          metrics.push({
            id: 'overall-efficiency',
            name: 'Genel Verimlilik',
            value: 85 + Math.random() * 10,
            unit: '%',
            trend: Math.random() > 0.4 ? 'up' : 'down',
            change: (Math.random() - 0.5) * 5,
            timestamp: now,
            category
          });
          break;
        case 'energy':
          metrics.push({
            id: 'energy-consumption',
            name: 'Enerji Tüketimi',
            value: 450 + Math.random() * 100,
            unit: 'kWh',
            trend: Math.random() > 0.6 ? 'down' : 'up',
            change: (Math.random() - 0.5) * 20,
            timestamp: now,
            category
          });
          break;
        case 'maintenance':
          metrics.push({
            id: 'maintenance-score',
            name: 'Bakım Skoru',
            value: 90 + Math.random() * 8,
            unit: '%',
            trend: 'stable',
            change: (Math.random() - 0.5) * 1,
            timestamp: now,
            category
          });
          break;
      }
      
      this.metrics.set(category, metrics);
    });
  }

  // Zaman serisi verilerini üret
  private generateTimeSeries(): void {
    const now = new Date();
    const machines = ['INJ-001', 'BLW-001', 'LBL-001', 'PKG-001'];
    const metricTypes = ['efficiency', 'production_rate', 'energy_consumption', 'quality_score'];

    machines.forEach(machineId => {
      metricTypes.forEach(metricType => {
        const key = `${machineId}-${metricType}`;
        let series = this.timeSeries.get(key) || [];

        // Son 24 saatlik veri tut
        series = series.filter(point => 
          now.getTime() - point.timestamp.getTime() < 24 * 60 * 60 * 1000
        );

        // Yeni veri noktası ekle
        const baseValue = this.getBaseValueForMetric(metricType);
        const value = baseValue + (Math.random() - 0.5) * baseValue * 0.2;

        series.push({
          timestamp: now,
          value,
          machineId,
          metricType
        });

        this.timeSeries.set(key, series);
      });
    });
  }

  private getBaseValueForMetric(metricType: string): number {
    switch (metricType) {
      case 'efficiency': return 85;
      case 'production_rate': return 1200;
      case 'energy_consumption': return 450;
      case 'quality_score': return 96;
      default: return 100;
    }
  }

  // Dashboard CRUD işlemleri
  public async getDashboards(): Promise<Dashboard[]> {
    return Array.from(this.dashboards.values());
  }

  public async getDashboard(id: string): Promise<Dashboard | null> {
    return this.dashboards.get(id) || null;
  }

  public async createDashboard(dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dashboard> {
    const newDashboard: Dashboard = {
      ...dashboard,
      id: `dashboard-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.dashboards.set(newDashboard.id, newDashboard);
    return newDashboard;
  }

  public async updateDashboard(id: string, updates: Partial<Dashboard>): Promise<Dashboard | null> {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) return null;

    const updatedDashboard = {
      ...dashboard,
      ...updates,
      updatedAt: new Date()
    };

    this.dashboards.set(id, updatedDashboard);
    return updatedDashboard;
  }

  public async deleteDashboard(id: string): Promise<boolean> {
    return this.dashboards.delete(id);
  }

  // Veri sorgulama
  public async getMetrics(category?: DashboardMetric['category']): Promise<DashboardMetric[]> {
    if (category) {
      return this.metrics.get(category) || [];
    }
    
    const allMetrics: DashboardMetric[] = [];
    this.metrics.forEach(metrics => allMetrics.push(...metrics));
    return allMetrics;
  }

  public async getTimeSeries(
    machineId?: string, 
    metricType?: string, 
    timeRange?: { start: Date; end: Date }
  ): Promise<TimeSeriesPoint[]> {
    let results: TimeSeriesPoint[] = [];
    
    this.timeSeries.forEach((series, key) => {
      const [keyMachineId, keyMetricType] = key.split('-');
      
      if (machineId && keyMachineId !== machineId) return;
      if (metricType && keyMetricType !== metricType) return;
      
      let filteredSeries = series;
      if (timeRange) {
        filteredSeries = series.filter(point => 
          point.timestamp >= timeRange.start && point.timestamp <= timeRange.end
        );
      }
      
      results.push(...filteredSeries);
    });
    
    return results.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Widget veri sorgulama
  public async getWidgetData(widget: DashboardWidget): Promise<any[]> {
    const { config } = widget;
    
    // Simulated query execution
    switch (widget.type) {
      case 'chart':
        if (config.query.includes('production_metrics')) {
          return await this.getTimeSeries(undefined, 'production_rate');
        }
        if (config.query.includes('energy_consumption')) {
          return await this.getTimeSeries(undefined, 'energy_consumption');
        }
        break;
        
      case 'gauge':
        if (config.query.includes('efficiency')) {
          const metrics = await this.getMetrics('efficiency');
          return metrics.slice(0, 1);
        }
        break;
        
      case 'metric':
        if (config.query.includes('quality_metrics')) {
          return await this.getMetrics('quality');
        }
        break;
        
      case 'heatmap':
        if (config.query.includes('machine_status')) {
          const machines = ['INJ-001', 'BLW-001', 'LBL-001', 'PKG-001'];
          return machines.map(machineId => ({
            machineId,
            status: Math.random() > 0.8 ? 'error' : Math.random() > 0.6 ? 'warning' : 'ok',
            efficiency: 70 + Math.random() * 30
          }));
        }
        break;
    }
    
    return [];
  }

  // Gerçek zamanlı veri akışı
  public subscribeToRealTimeData(callback: (data: any) => void): () => void {
    const interval = setInterval(() => {
      const randomMetric = Array.from(this.metrics.values()).flat()[0];
      if (randomMetric) {
        callback({
          type: 'metric_update',
          data: randomMetric
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }

  // Performans istatistikleri
  public async getPerformanceStats(): Promise<{
    totalDashboards: number;
    totalWidgets: number;
    dataPoints: number;
    uptime: string;
    lastUpdate: Date;
  }> {
    const totalWidgets = Array.from(this.dashboards.values())
      .reduce((sum, dashboard) => sum + dashboard.widgets.length, 0);
    
    const dataPoints = Array.from(this.timeSeries.values())
      .reduce((sum, series) => sum + series.length, 0);

    return {
      totalDashboards: this.dashboards.size,
      totalWidgets,
      dataPoints,
      uptime: '99.9%',
      lastUpdate: new Date()
    };
  }
}

// Singleton instance export
export const cloudDashboard = CloudDashboardService.getInstance(); 