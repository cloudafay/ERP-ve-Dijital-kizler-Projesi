import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductionCounter from '../components/ProductionCounter';
import MachineStatusCards from '../components/MachineStatusCards';
import ProductionChart from '../components/ProductionChart';
import AlertsPanel from '../components/AlertsPanel';
import PerformanceTable from '../components/PerformanceTable';
import DigitalTwin3D from '../components/DigitalTwin3D';
import AIDashboard from '../components/AIDashboard';
import IoTMonitor from '../components/IoTMonitor';
import DataStreamPanel from '../components/DataStreamPanel';
import PLCDashboard from './PLCDashboard';
import EdgeEnergyDashboard from './EdgeEnergyDashboard';
import { useDigitalTwinStore } from '../lib/store';
import { iotSimulator } from '../lib/iotSimulator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Responsive, WidthProvider } from 'react-grid-layout';
import DashboardWidget from '../components/dashboard/DashboardWidget';
import { cloudDashboard } from '../services/cloudDashboard';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  BarChart3, 
  Brain, 
  Cpu, 
  Factory, 
  Gauge, 
  Router,
  TrendingUp,
  Zap,
  Cloud,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Edit3,
  Save,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  Monitor,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Settings,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [cloudDashboards, setCloudDashboards] = useState<any[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<any>(null);
  const [layouts, setLayouts] = useState<any>({});
  
  const { 
    machines, 
    productionData, 
    systemStatus, 
    alerts, 
    initializeSystem, 
    simulateRealTimeData 
  } = useDigitalTwinStore();

  // Sistem başlatma
  useEffect(() => {
    // Digital Twin store'u başlat
    initializeSystem();

    // IoT simülasyonunu başlat
    iotSimulator.startSimulation();

    // Bulut dashboard'ı başlat
    const initCloudDashboard = async () => {
      const connected = await cloudDashboard.connect();
      setIsCloudConnected(connected);
      
      const dashboards = await cloudDashboard.getDashboards();
      setCloudDashboards(dashboards);
      
      if (dashboards.length > 0) {
        setCurrentDashboard(dashboards[0]);
      }
    };
    
    initCloudDashboard();

    // Gerçek zamanlı veri simülasyonunu başlat
    const dataInterval = setInterval(() => {
      simulateRealTimeData();
    }, 3000);

    // Üretim verilerini güncelle
    const productionInterval = setInterval(() => {
      const { updateProductionData } = useDigitalTwinStore.getState();
      updateProductionData({
        dailyCount: productionData.dailyCount + Math.floor(Math.random() * 3),
        hourlyRate: 280 + Math.floor(Math.random() * 20),
        efficiency: 90 + Math.random() * 8,
        oeeScore: 85 + Math.random() * 10,
      });
    }, 5000);

    // Bulut bağlantı durumunu kontrol et
    const cloudInterval = setInterval(() => {
      setIsCloudConnected(cloudDashboard.isCloudConnected());
    }, 5000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(productionInterval);
      clearInterval(cloudInterval);
      iotSimulator.stopSimulation();
    };
  }, []);

  const criticalAlerts = alerts.filter(alert => alert.type === 'critical' && !alert.resolved).length;
  const warningAlerts = alerts.filter(alert => alert.type === 'warning' && !alert.resolved).length;
  const runningMachines = machines.filter(machine => machine.status === 'running').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Ana İçerik - Navbar ile çakışmayı önlemek için pt-20 eklendi */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-20'} pt-20 px-4 sm:px-6 lg:px-8 pb-8`}>
          
          {/* Başlık */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dijital İkiz - Su Şişesi Fabrikası
            </h1>
            <div className="flex items-center gap-4">
              <Badge variant={systemStatus.isConnected ? "default" : "destructive"}>
                {systemStatus.isConnected ? 'Sistem Aktif' : 'Bağlantı Kesildi'}
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Son güncelleme: {systemStatus.lastUpdate.toLocaleTimeString('tr-TR')}
              </span>
            </div>
          </div>

          {/* KPI Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {/* Günlük Üretim */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Günlük Üretim</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {productionData.dailyCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {productionData.hourlyRate}/saat
                    </p>
                  </div>
                  <Factory className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            {/* Verimlilik */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Verimlilik</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {productionData.efficiency.toFixed(1)}%
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      +2.3% bu hafta
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            {/* OEE Skoru */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">OEE Skoru</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {productionData.oeeScore.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Hedef: 90%
                    </p>
                  </div>
                  <Gauge className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>

            {/* Aktif Makineler */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Aktif Makineler</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {runningMachines}/{machines.length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {((runningMachines/machines.length)*100).toFixed(0)}% çalışıyor
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-500 dark:text-orange-400" />
                </div>
              </CardContent>
            </Card>

            {/* Uyarılar */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Aktif Uyarılar</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {criticalAlerts + warningAlerts}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {criticalAlerts} kritik, {warningAlerts} uyarı
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ana Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview" className="w-full">
              {/* TabsList gizli - sidebar tarafından kontrol ediliyor */}
              <TabsList className="hidden">
                <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                <TabsTrigger value="production">Üretim</TabsTrigger>
                <TabsTrigger value="ai-dashboard">AI Analiz</TabsTrigger>
                <TabsTrigger value="iot-monitor">IoT</TabsTrigger>
                <TabsTrigger value="plc-dashboard">PLC</TabsTrigger>
                <TabsTrigger value="edge-energy">Enerji</TabsTrigger>
                <TabsTrigger value="cloud-dashboard">Bulut</TabsTrigger>
              </TabsList>

              {/* Tab İçerikleri */}
              <div className="p-6">
                {/* Genel Bakış */}
                <TabsContent value="overview" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                          <BarChart3 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                          Üretim Performansı
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ProductionChart />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                          <Activity className="h-5 w-5 text-green-500 dark:text-green-400" />
                          Makine Durumları
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <MachineStatusCards />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                          <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
                          Sistem Uyarıları
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <AlertsPanel alertsCount={alerts.length} />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <Monitor className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                        Performans Tablosu
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PerformanceTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Üretim */}
                <TabsContent value="production" className="mt-0">
                  <div className="space-y-6">
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                          <Factory className="h-5 w-5 text-green-500 dark:text-green-400" />
                          3D Dijital İkiz
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DigitalTwin3D />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* AI Dashboard */}
                <TabsContent value="ai-dashboard" className="mt-0">
                  <AIDashboard />
                </TabsContent>

                {/* IoT Monitor */}
                <TabsContent value="iot-monitor" className="mt-0">
                  <IoTMonitor />
                </TabsContent>

                {/* PLC Dashboard */}
                <TabsContent value="plc-dashboard" className="mt-0">
                  <PLCDashboard />
                </TabsContent>

                {/* Edge Energy */}
                <TabsContent value="edge-energy" className="mt-0">
                  <EdgeEnergyDashboard />
                </TabsContent>

                {/* Cloud Dashboard */}
                <TabsContent value="cloud-dashboard" className="mt-0 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Cloud className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bulut Dashboard</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Merkezi izleme ve analiz platformu</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                        isCloudConnected 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {isCloudConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                        {isCloudConnected ? 'Bağlı' : 'Bağlantı Yok'}
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {cloudDashboards.length} dashboard • {currentDashboard?.widgets?.length || 0} widget
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                          className="gap-2"
                        >
                          {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                          {isEditing ? 'Kaydet' : 'Düzenle'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Grid */}
                  {currentDashboard && currentDashboard.widgets && (
                    <div className="min-h-[600px]">
                      <ResponsiveGridLayout
                        className="layout"
                        layouts={layouts}
                        onLayoutChange={(layout, layouts) => setLayouts(layouts)}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={60}
                        isDraggable={isEditing}
                        isResizable={isEditing}
                        margin={[16, 16]}
                        containerPadding={[0, 0]}
                      >
                        {currentDashboard.widgets.map((widget: any) => (
                          <div key={widget.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <DashboardWidget widget={widget} />
                          </div>
                        ))}
                      </ResponsiveGridLayout>
                    </div>
                  )}

                  {/* Feature Showcase */}
                  {!currentDashboard && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center">
                              <LayoutGrid className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Sürükle & Bırak</h3>
                          </div>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Widget'ları istediğiniz gibi düzenleyin ve kişiselleştirin
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-green-500 rounded-xl flex items-center justify-center">
                              <Database className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-green-900">Gerçek Zamanlı</h3>
                          </div>
                          <p className="text-sm text-green-700">
                            Canlı veri akışı ile anlık performans takibi
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-purple-500 rounded-xl flex items-center justify-center">
                              <Brain className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-purple-900">AI Analiz</h3>
                          </div>
                          <p className="text-sm text-purple-700">
                            Yapay zeka destekli öngörülü analiz ve raporlama
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
