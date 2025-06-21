import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Activity, 
  Zap, 
  Thermometer, 
  Gauge, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Brain,
  Cpu,
  Battery,
  Wrench,
  Target,
  DollarSign
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Enhanced machine interface
interface EnhancedMachine {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'idle' | 'maintenance' | 'error';
  metrics: {
    temperature: number;
    pressure: number;
    speed: number;
    efficiency: number;
    vibration: number;
    power: number;
    oee: number;
  };
  predictions: {
    failureRisk: number;
    maintenanceDays: number;
    qualityTrend: 'up' | 'down' | 'stable';
    energySaving: number;
  };
  aiInsights: string[];
}

// Sample enhanced data
const enhancedMachines: EnhancedMachine[] = [
  {
    id: 'INJ001',
    name: 'Enjeksiyon Makinesi #1',
    type: 'injection',
    status: 'running',
    metrics: {
      temperature: 245,
      pressure: 85,
      speed: 1200,
      efficiency: 94,
      vibration: 2.3,
      power: 45.2,
      oee: 89.2
    },
    predictions: {
      failureRisk: 15,
      maintenanceDays: 12,
      qualityTrend: 'stable',
      energySaving: 8
    },
    aiInsights: [
      'Normal operation pattern detected',
      'Slight temperature increase trend',
      'Recommend cooling system check'
    ]
  },
  {
    id: 'BLW002',
    name: 'Şişirme Makinesi #2',
    type: 'blowing',
    status: 'running',
    metrics: {
      temperature: 120,
      pressure: 40,
      speed: 800,
      efficiency: 87,
      vibration: 1.8,
      power: 32.1,
      oee: 84.1
    },
    predictions: {
      failureRisk: 35,
      maintenanceDays: 6,
      qualityTrend: 'down',
      energySaving: 12
    },
    aiInsights: [
      'Declining efficiency pattern',
      'Irregular vibration detected',
      'Urgent maintenance recommended'
    ]
  },
  {
    id: 'LBL003',
    name: 'Etiketleme Hattı #3',
    type: 'labeling',
    status: 'idle',
    metrics: {
      temperature: 25,
      pressure: 15,
      speed: 0,
      efficiency: 0,
      vibration: 0.1,
      power: 5.2,
      oee: 0
    },
    predictions: {
      failureRisk: 5,
      maintenanceDays: 25,
      qualityTrend: 'stable',
      energySaving: 0
    },
    aiInsights: [
      'Machine in standby mode',
      'All systems normal',
      'Ready for operation'
    ]
  }
];

// Performance chart data
const performanceData = [
  { time: '00:00', efficiency: 92, quality: 98 },
  { time: '02:00', efficiency: 94, quality: 97 },
  { time: '04:00', efficiency: 91, quality: 99 },
  { time: '06:00', efficiency: 89, quality: 96 },
  { time: '08:00', efficiency: 93, quality: 98 },
  { time: '10:00', efficiency: 95, quality: 97 },
  { time: '12:00', efficiency: 88, quality: 95 }
];

// Energy consumption data  
const energyData = [
  { machine: 'INJ001', consumption: 45.2, optimal: 41.5 },
  { machine: 'BLW002', consumption: 32.1, optimal: 28.3 },
  { machine: 'LBL003', consumption: 5.2, optimal: 5.2 },
  { machine: 'PKG004', consumption: 28.7, optimal: 25.9 }
];

// Risk assessment colors
const RISK_COLORS = {
  low: '#10b981',
  medium: '#f59e0b', 
  high: '#ef4444',
  critical: '#dc2626'
};

const getRiskLevel = (risk: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (risk < 20) return 'low';
  if (risk < 40) return 'medium';
  if (risk < 70) return 'high';
  return 'critical';
};

const getRiskColor = (risk: number) => RISK_COLORS[getRiskLevel(risk)];

const DigitalTwinAdvancedDashboard: React.FC = () => {
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true);

  // Calculate overall metrics
  const runningMachines = enhancedMachines.filter(m => m.status === 'running');
  const avgOEE = runningMachines.reduce((sum, m) => sum + m.metrics.oee, 0) / runningMachines.length;
  const totalPower = enhancedMachines.reduce((sum, m) => sum + m.metrics.power, 0);
  const avgEfficiency = runningMachines.reduce((sum, m) => sum + m.metrics.efficiency, 0) / runningMachines.length;

  // High-risk machines
  const highRiskMachines = enhancedMachines.filter(m => m.predictions.failureRisk > 30);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏭 Dijital İkiz Kontrol Merkezi</h1>
          <p className="text-gray-600 mt-1">Gelişmiş AI analizi ile gerçek zamanlı üretim izleme</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={aiInsightsEnabled ? "default" : "outline"}
            onClick={() => setAiInsightsEnabled(!aiInsightsEnabled)}
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Analizi
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Genel OEE</p>
                <p className="text-2xl font-bold">{avgOEE.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Ortalama Verimlilik</p>
                <p className="text-2xl font-bold">{avgEfficiency.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Toplam Güç</p>
                <p className="text-2xl font-bold">{totalPower.toFixed(1)} kW</p>
              </div>
              <Zap className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Risk Uyarıları</p>
                <p className="text-2xl font-bold">{highRiskMachines.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="machines">Makine Detayları</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="predictions">AI Tahmin</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performans Trendi</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Energy Consumption */}
            <Card>
              <CardHeader>
                <CardTitle>Enerji Tüketimi</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="machine" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="consumption" fill="#f59e0b" name="Mevcut" />
                    <Bar dataKey="optimal" fill="#10b981" name="Optimal" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Machine Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {enhancedMachines.map((machine) => (
              <Card key={machine.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedMachine(machine.id)}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{machine.name}</span>
                    <Badge variant={
                      machine.status === 'running' ? 'default' :
                      machine.status === 'idle' ? 'secondary' :
                      machine.status === 'maintenance' ? 'outline' : 'destructive'
                    }>
                      {machine.status === 'running' ? 'Çalışıyor' :
                       machine.status === 'idle' ? 'Beklemede' :
                       machine.status === 'maintenance' ? 'Bakımda' : 'Hata'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* OEE Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>OEE Skoru</span>
                      <span className="font-semibold">{machine.metrics.oee}%</span>
                    </div>
                    <Progress value={machine.metrics.oee} className="h-2" />
                  </div>

                  {/* Risk Assessment */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Arıza Riski</span>
                      <span className="font-semibold" style={{ color: getRiskColor(machine.predictions.failureRisk) }}>
                        {machine.predictions.failureRisk}%
                      </span>
                    </div>
                    <Progress 
                      value={machine.predictions.failureRisk} 
                      className="h-2"
                      style={{ color: getRiskColor(machine.predictions.failureRisk) }}
                    />
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3" />
                      <span>{machine.metrics.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3" />
                      <span>{machine.metrics.pressure} bar</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>{machine.metrics.power} kW</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>{machine.metrics.vibration}</span>
                    </div>
                  </div>

                  {/* Maintenance Countdown */}
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      <span>Bakım: {machine.predictions.maintenanceDays} gün</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Machines Tab */}
        <TabsContent value="machines">
          <div className="grid grid-cols-1 gap-6">
            {enhancedMachines.map((machine) => (
              <Card key={machine.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{machine.name}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline">{machine.type}</Badge>
                      <Badge variant={
                        machine.status === 'running' ? 'default' : 
                        machine.status === 'idle' ? 'secondary' : 'destructive'
                      }>
                        {machine.status}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Metrics */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Anlık Metrikler</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Sıcaklık</span>
                          <span className="font-semibold">{machine.metrics.temperature}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Basınç</span>
                          <span className="font-semibold">{machine.metrics.pressure} bar</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Hız</span>
                          <span className="font-semibold">{machine.metrics.speed} rpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Verimlilik</span>
                          <span className="font-semibold">{machine.metrics.efficiency}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Predictions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">AI Tahminleri</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Arıza Riski</span>
                          <span className="font-semibold" style={{ color: getRiskColor(machine.predictions.failureRisk) }}>
                            {machine.predictions.failureRisk}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Bakım</span>
                          <span className="font-semibold">{machine.predictions.maintenanceDays} gün</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Kalite Trendi</span>
                          <div className="flex items-center gap-1">
                            {machine.predictions.qualityTrend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                            {machine.predictions.qualityTrend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                            {machine.predictions.qualityTrend === 'stable' && <Activity className="w-4 h-4 text-gray-500" />}
                            <span className="font-semibold">{machine.predictions.qualityTrend}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Enerji Tasarrufu</span>
                          <span className="font-semibold text-green-600">{machine.predictions.energySaving}%</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    {aiInsightsEnabled && (
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          AI İçgörüleri
                        </h4>
                        <div className="space-y-2">
                          {machine.aiInsights.map((insight, index) => (
                            <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                              {insight}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>OEE Analizi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Genel OEE</span>
                    <span className="text-2xl font-bold">{avgOEE.toFixed(1)}%</span>
                  </div>
                  <Progress value={avgOEE} className="h-3" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Erişilebilirlik</span>
                      <span>95.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performans</span>
                      <span>{avgEfficiency.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kalite</span>
                      <span>97.4%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maliyet Optimizasyonu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-semibold">Yıllık Tasarruf Potansiyeli</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Enerji Tasarrufu</span>
                      <span className="font-semibold text-green-600">₺12,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Bakım Optimizasyonu</span>
                      <span className="font-semibold text-green-600">₺18,700</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Kalite İyileştirme</span>
                      <span className="font-semibold text-green-600">₺9,300</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold">Toplam</span>
                      <span className="font-bold text-green-600">₺40,500</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Tahmin Analizi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Risk Assessment */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Risk Değerlendirmesi</h4>
                    {enhancedMachines.map((machine) => (
                      <div key={machine.id} className="flex items-center justify-between p-3 border rounded">
                        <span className="font-medium">{machine.name}</span>
                        <Badge 
                          variant={getRiskLevel(machine.predictions.failureRisk) === 'low' ? 'default' : 'destructive'}
                          style={{ backgroundColor: getRiskColor(machine.predictions.failureRisk) }}
                        >
                          {getRiskLevel(machine.predictions.failureRisk).toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Maintenance Schedule */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Bakım Takvimi</h4>
                    {enhancedMachines
                      .sort((a, b) => a.predictions.maintenanceDays - b.predictions.maintenanceDays)
                      .map((machine) => (
                        <div key={machine.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <span className="font-medium">{machine.name}</span>
                            <p className="text-sm text-gray-600">{machine.predictions.maintenanceDays} gün kaldı</p>
                          </div>
                          <Wrench className="w-5 h-5 text-gray-400" />
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DigitalTwinAdvancedDashboard; 