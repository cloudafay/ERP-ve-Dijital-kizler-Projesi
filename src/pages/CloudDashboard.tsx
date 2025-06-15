import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import DashboardWidget from '../components/dashboard/DashboardWidget';
import {
  Cloud,
  Plus,
  Settings,
  Search,
  Filter,
  LayoutGrid,
  Monitor,
  Zap,
  Activity,
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Share2,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { 
  Dashboard, 
  DashboardWidget as WidgetType, 
  cloudDashboard 
} from '../services/cloudDashboard';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const CloudDashboard: React.FC = () => {
  const [selectedDashboard, setSelectedDashboard] = useState<string>('production-overview');
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [isConnected, setIsConnected] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [layouts, setLayouts] = useState<any>({});

  const queryClient = useQueryClient();

  // Dashboard listesi sorgusu
  const { data: dashboards = [], isLoading: dashboardsLoading } = useQuery({
    queryKey: ['dashboards'],
    queryFn: () => cloudDashboard.getDashboards(),
    refetchInterval: 30000
  });

  // Seçili dashboard sorgusu
  const { data: currentDashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboard', selectedDashboard],
    queryFn: () => cloudDashboard.getDashboard(selectedDashboard),
    enabled: !!selectedDashboard,
    refetchInterval: 10000
  });

  // Performans istatistikleri sorgusu
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => cloudDashboard.getPerformanceStats(),
    refetchInterval: 60000
  });

  // Bulut bağlantısını kontrol et
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await cloudDashboard.connect();
      setIsConnected(connected);
    };
    
    checkConnection();
    
    // Bağlantı durumunu periyodik kontrol et
    const interval = setInterval(() => {
      setIsConnected(cloudDashboard.isCloudConnected());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filtrelenmiş dashboard'lar
  const filteredDashboards = dashboards.filter(dashboard => {
    const matchesSearch = dashboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dashboard.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTag === 'all' || dashboard.tags.includes(filterTag);
    return matchesSearch && matchesFilter;
  });

  // Tüm etiketleri al
  const allTags = Array.from(new Set(dashboards.flatMap(d => d.tags)));

  // Layout değişikliği
  const handleLayoutChange = (layout: any, layouts: any) => {
    setLayouts(layouts);
    
    if (currentDashboard && isEditing) {
      // Widget pozisyonlarını güncelle
      const updatedWidgets = currentDashboard.widgets.map(widget => {
        const layoutItem = layout.find((item: any) => item.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            position: {
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h
            }
          };
        }
        return widget;
      });

      // Dashboard'ı güncelle
      cloudDashboard.updateDashboard(currentDashboard.id, {
        widgets: updatedWidgets
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['dashboard', selectedDashboard] });
      });
    }
  };

  // Widget düzenleme
  const handleEditWidget = (widget: WidgetType) => {
    // Widget düzenleme modalını aç
    console.log('Edit widget:', widget);
  };

  // Widget silme
  const handleDeleteWidget = (widgetId: string) => {
    if (currentDashboard) {
      const updatedWidgets = currentDashboard.widgets.filter(w => w.id !== widgetId);
      cloudDashboard.updateDashboard(currentDashboard.id, {
        widgets: updatedWidgets
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['dashboard', selectedDashboard] });
      });
    }
  };

  // Dashboard kaydetme
  const handleSaveDashboard = () => {
    setIsEditing(false);
    queryClient.invalidateQueries({ queryKey: ['dashboard', selectedDashboard] });
  };

  // Dashboard dışa aktarma
  const handleExportDashboard = () => {
    if (currentDashboard) {
      const dataStr = JSON.stringify(currentDashboard, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `dashboard-${currentDashboard.name}-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  if (dashboardsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Dashboard'lar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bulut Dashboard</h1>
                <p className="text-sm text-gray-500">Merkezi İzleme ve Analiz Platformu</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {isConnected ? 'Bağlı' : 'Bağlantı Yok'}
              </div>
              
              {stats && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <LayoutGrid className="w-4 h-4" />
                    {stats.totalDashboards} Dashboard
                  </div>
                  <div className="flex items-center gap-1">
                    <Monitor className="w-4 h-4" />
                    {stats.totalWidgets} Widget
                  </div>
                  <div className="flex items-center gap-1">
                    <Database className="w-4 h-4" />
                    {stats.dataPoints.toLocaleString()} Veri Noktası
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportDashboard}
              disabled={!currentDashboard}
            >
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              disabled={!currentDashboard}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Düzenle
                </>
              )}
            </Button>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Dashboard
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Dashboard Oluştur</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Dashboard adı" />
                  <Input placeholder="Açıklama" />
                  <div className="flex gap-2">
                    <Button onClick={() => setShowCreateDialog(false)}>
                      Oluştur
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      İptal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-5rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Dashboard ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Etiket filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Etiketler</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dashboard List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredDashboards.map(dashboard => (
                <motion.div
                  key={dashboard.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedDashboard === dashboard.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDashboard(dashboard.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{dashboard.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{dashboard.description}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex flex-wrap gap-1">
                          {dashboard.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {dashboard.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{dashboard.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      {dashboard.widgets.length} widget
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {dashboardLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600">Dashboard yükleniyor...</p>
              </div>
            </div>
          ) : currentDashboard ? (
            <div className="h-full p-6">
              {/* Dashboard Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentDashboard.name}</h2>
                    <p className="text-gray-600">{currentDashboard.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Son güncelleme: {new Date(currentDashboard.updatedAt).toLocaleString('tr-TR')}
                    </Badge>
                    {isEditing && (
                      <Badge variant="secondary">
                        Düzenleme Modu
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Widgets Grid */}
              <div className="h-[calc(100%-8rem)]">
                <ResponsiveGridLayout
                  className="layout"
                  layouts={layouts}
                  onLayoutChange={handleLayoutChange}
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                  rowHeight={60}
                  isDraggable={isEditing}
                  isResizable={isEditing}
                  margin={[16, 16]}
                  containerPadding={[0, 0]}
                >
                  {currentDashboard.widgets.map(widget => (
                    <div
                      key={widget.id}
                      data-grid={{
                        x: widget.position.x,
                        y: widget.position.y,
                        w: widget.position.w,
                        h: widget.position.h,
                        minW: 2,
                        minH: 2
                      }}
                    >
                      <DashboardWidget
                        widget={widget}
                        onEdit={handleEditWidget}
                        onDelete={handleDeleteWidget}
                        isEditing={isEditing}
                      />
                    </div>
                  ))}
                </ResponsiveGridLayout>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Dashboard Seçin</h3>
                <p className="text-gray-600">Görüntülemek için sol panelden bir dashboard seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudDashboard; 