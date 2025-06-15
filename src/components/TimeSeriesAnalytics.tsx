import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Download, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { toast } from "sonner";
import { 
  timeSeriesStorage, 
  getCurrentMachineMetrics, 
  getTrendAnalysis, 
  getAggregatedData, 
  exportData,
  getStorageStats,
  type MachineMetrics,
  type TimeSeriesQuery 
} from '@/services/timeSeriesStorage';

interface ChartDataPoint {
  timestamp: string;
  [key: string]: string | number;
}

const TimeSeriesAnalytics: React.FC = () => {
  const [machineMetrics, setMachineMetrics] = useState<MachineMetrics[]>([]);
  const [selectedMachines, setSelectedMachines] = useState<string[]>(['INJ-001']);
  const [selectedMetric, setSelectedMetric] = useState<string>('fire_rate');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [aggregation, setAggregation] = useState<'raw' | 'hourly' | 'daily' | 'weekly' | 'monthly'>('hourly');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [storageStats, setStorageStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Metrik türleri ve açıklamaları
  const metricTypes = {
    fire_rate: { name: 'Fire Oranı', unit: '%', color: '#ef4444', icon: AlertTriangle },
    efficiency: { name: 'Verimlilik', unit: '%', color: '#22c55e', icon: CheckCircle },
    production_rate: { name: 'Üretim Hızı', unit: 'şişe/saat', color: '#3b82f6', icon: Activity },
    downtime: { name: 'Duruş Süresi', unit: 'dakika', color: '#f59e0b', icon: AlertTriangle },
    oee: { name: 'OEE', unit: '%', color: '#8b5cf6', icon: TrendingUp },
    quality_score: { name: 'Kalite Skoru', unit: '%', color: '#06b6d4', icon: CheckCircle }
  };

  // Makine listesi
  const machines = [
    { id: 'INJ-001', name: 'Enjeksiyon Makinesi 1' },
    { id: 'BLW-001', name: 'Şişirme Makinesi 1' },
    { id: 'LBL-001', name: 'Etiketleme Makinesi 1' },
    { id: 'PKG-001', name: 'Paketleme Makinesi 1' },
    { id: 'INJ-002', name: 'Enjeksiyon Makinesi 2' },
    { id: 'BLW-002', name: 'Şişirme Makinesi 2' }
  ];

  // Veri yükleme
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Her dakika güncelle
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadChartData();
  }, [selectedMachines, selectedMetric, timeRange, aggregation]);

  const loadData = async () => {
    try {
      const metrics = getCurrentMachineMetrics();
      setMachineMetrics(metrics);
      
      const stats = getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      toast.error('Veri yüklenirken hata oluştu');
    }
  };

  const loadChartData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      let startDate: Date;

      switch (timeRange) {
        case '1h':
          startDate = new Date(endDate.getTime() - (1 * 60 * 60 * 1000));
          break;
        case '6h':
          startDate = new Date(endDate.getTime() - (6 * 60 * 60 * 1000));
          break;
        case '24h':
          startDate = new Date(endDate.getTime() - (24 * 60 * 60 * 1000));
          break;
        case '7d':
          startDate = new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000));
          break;
        case '30d':
          startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000));
          break;
        default:
          startDate = new Date(endDate.getTime() - (24 * 60 * 60 * 1000));
      }

      const query: TimeSeriesQuery = {
        machineIds: selectedMachines,
        metricTypes: [selectedMetric],
        startDate,
        endDate,
        aggregation
      };

      const aggregatedData = getAggregatedData(query);
      
      // Chart data formatı
      const chartDataMap = new Map<string, ChartDataPoint>();

      aggregatedData.forEach(point => {
        const timestamp = point.timestamp.toISOString();
        if (!chartDataMap.has(timestamp)) {
          chartDataMap.set(timestamp, { timestamp });
        }
        const dataPoint = chartDataMap.get(timestamp)!;
        dataPoint[point.machineId] = point.avg;
      });

      const sortedData = Array.from(chartDataMap.values()).sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setChartData(sortedData);
    } catch (error) {
      console.error('Chart veri yükleme hatası:', error);
      toast.error('Grafik verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000)); // Son 7 gün

      const query: TimeSeriesQuery = {
        machineIds: selectedMachines,
        metricTypes: [selectedMetric],
        startDate,
        endDate,
        aggregation: 'raw'
      };

      // PDF export
      exportData(query, 'pdf');
      toast.success('PDF raporu başarıyla oluşturuldu');
    } catch (error) {
      console.error('Export hatası:', error);
      toast.error('PDF oluşturulurken hata oluştu');
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    switch (aggregation) {
      case 'hourly':
        return date.toLocaleString('tr-TR', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      case 'daily':
        return date.toLocaleDateString('tr-TR', { 
          month: 'short', 
          day: 'numeric' 
        });
      case 'weekly':
        return `${date.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })} Haftası`;
      case 'monthly':
        return date.toLocaleDateString('tr-TR', { 
          year: 'numeric', 
          month: 'long' 
        });
      default:
        return date.toLocaleTimeString('tr-TR');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Zaman Serisi Analitik</h2>
          <p className="text-muted-foreground">
            Fire oranları, makine verimliliği ve üretim metriklerinin zaman serisi analizi
          </p>
        </div>
        <Button onClick={handleExportData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Veri Dışa Aktar
        </Button>
      </div>

      {/* Storage Stats */}
      {storageStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Veri Depolama İstatistikleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {storageStats.totalDataPoints.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Toplam Veri Noktası</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {storageStats.machineCount}
                </div>
                <div className="text-sm text-muted-foreground">Aktif Makine</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {storageStats.metricTypes.length}
                </div>
                <div className="text-sm text-muted-foreground">Metrik Türü</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {storageStats.oldestTimestamp ? 
                    Math.ceil((Date.now() - new Date(storageStats.oldestTimestamp).getTime()) / (1000 * 60 * 60 * 24)) 
                    : 0}
                </div>
                <div className="text-sm text-muted-foreground">Gün Veri Geçmişi</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Machine Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machineMetrics.map((machine) => {
          const trendAnalysis = getTrendAnalysis(machine.machineId, 'efficiency', 24);
          return (
            <Card key={machine.machineId}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{machine.machineName}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {getTrendIcon(trendAnalysis.trend)}
                  <span className="text-sm">
                    {trendAnalysis.trend === 'stable' ? 'Stabil' : 
                     trendAnalysis.trend === 'increasing' ? 'Artış' : 'Azalış'}
                    {trendAnalysis.changePercent !== 0 && 
                      ` (${Math.abs(trendAnalysis.changePercent).toFixed(1)}%)`
                    }
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Fire Oranı:</span>
                    <Badge variant={machine.fireRate > 2 ? "destructive" : "secondary"}>
                      {machine.fireRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Verimlilik:</span>
                    <Badge variant={machine.efficiency > 85 ? "default" : "secondary"}>
                      {machine.efficiency.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Üretim:</span>
                    <span className="font-medium">{machine.productionRate.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>OEE:</span>
                    <Badge variant={machine.oee > 80 ? "default" : "secondary"}>
                      {machine.oee.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Zaman Serisi Grafiği</CardTitle>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Makine:</label>
              <Select 
                value={selectedMachines[0]} 
                onValueChange={(value) => setSelectedMachines([value])}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {machines.map(machine => (
                    <SelectItem key={machine.id} value={machine.id}>
                      {machine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Metrik:</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(metricTypes).map(([key, metric]) => (
                    <SelectItem key={key} value={key}>
                      {metric.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Zaman:</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Saat</SelectItem>
                  <SelectItem value="6h">6 Saat</SelectItem>
                  <SelectItem value="24h">24 Saat</SelectItem>
                  <SelectItem value="7d">7 Gün</SelectItem>
                  <SelectItem value="30d">30 Gün</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Agregasyon:</label>
              <Select value={aggregation} onValueChange={(value: any) => setAggregation(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raw">Ham</SelectItem>
                  <SelectItem value="hourly">Saatlik</SelectItem>
                  <SelectItem value="daily">Günlük</SelectItem>
                  <SelectItem value="weekly">Haftalık</SelectItem>
                  <SelectItem value="monthly">Aylık</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Veriler yükleniyor...</p>
              </div>
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTimestamp}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    label={{ 
                      value: metricTypes[selectedMetric as keyof typeof metricTypes]?.unit || '', 
                      angle: -90, 
                      position: 'insideLeft' 
                    }}
                  />
                  <Tooltip 
                    labelFormatter={(value) => formatTimestamp(value as string)}
                    formatter={(value: any, name: any) => [
                      `${Number(value).toFixed(2)} ${metricTypes[selectedMetric as keyof typeof metricTypes]?.unit || ''}`,
                      machines.find(m => m.id === name)?.name || name
                    ]}
                  />
                  <Legend 
                    formatter={(value) => machines.find(m => m.id === value)?.name || value}
                  />
                  {selectedMachines.map((machineId, index) => (
                    <Line
                      key={machineId}
                      type="monotone"
                      dataKey={machineId}
                      stroke={metricTypes[selectedMetric as keyof typeof metricTypes]?.color || '#3b82f6'}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Analizi</CardTitle>
          <CardDescription>Son 24 saatteki değişim trendleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metricTypes).map(([metricKey, metric]) => {
              const trendData = selectedMachines.map(machineId => {
                try {
                  const trend = getTrendAnalysis(machineId, metricKey, 24);
                  return {
                    machineId,
                    machineName: machines.find(m => m.id === machineId)?.name || machineId,
                    ...trend
                  };
                } catch (error) {
                  console.error('Trend analizi hatası:', error);
                  return {
                    machineId,
                    machineName: machines.find(m => m.id === machineId)?.name || machineId,
                    trend: 'stable' as const,
                    changePercent: 0,
                    currentValue: 0,
                    previousValue: 0
                  };
                }
              });

              return (
                <Card key={metricKey} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <metric.icon className="h-4 w-4" style={{ color: metric.color }} />
                    <h4 className="font-medium">{metric.name}</h4>
                  </div>
                  <div className="space-y-2">
                    {trendData.map(trend => (
                      <div key={trend.machineId} className="flex items-center justify-between text-sm">
                        <span className="truncate">{trend.machineName}</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(trend.trend)}
                          <span className={`font-medium ${
                            trend.trend === 'increasing' ? 'text-green-600' :
                            trend.trend === 'decreasing' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {trend.changePercent !== 0 ? 
                              `${trend.changePercent > 0 ? '+' : ''}${trend.changePercent.toFixed(1)}%` :
                              'Stabil'
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSeriesAnalytics;