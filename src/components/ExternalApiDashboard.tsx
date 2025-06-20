import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Download,
  ExternalLink,
  Globe,
  Lock,
  Plus,
  RefreshCw,
  Server,
  Settings,
  Shield,
  TrendingUp,
  Upload,
  Users,
  Zap,
  AlertTriangle,
  Activity,
  BarChart3,
  FileText,
  Link2,
  Monitor,
  Play,
  XCircle,
} from 'lucide-react';
import {
  useExternalSystems,
  useDataExport,
  useSyncMonitoring,
  useDataMapping,
  useMockDataGeneration,
  ExternalSystemType,
  DataFormat,
  SecurityProtocol,
  type ExternalSystem,
} from '../hooks/useExternalApi';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const systemTypeLabels = {
  [ExternalSystemType.SUPPLIER]: 'Tedarikçi',
  [ExternalSystemType.CUSTOMER]: 'Müşteri',
  [ExternalSystemType.ERP]: 'ERP',
  [ExternalSystemType.WAREHOUSE]: 'Depo',
  [ExternalSystemType.LOGISTICS]: 'Lojistik',
  [ExternalSystemType.QUALITY]: 'Kalite',
  [ExternalSystemType.MAINTENANCE]: 'Bakım',
  [ExternalSystemType.ANALYTICS]: 'Analitik',
};

const securityProtocolLabels = {
  [SecurityProtocol.API_KEY]: 'API Key',
  [SecurityProtocol.OAUTH2]: 'OAuth 2.0',
  [SecurityProtocol.JWT]: 'JWT',
  [SecurityProtocol.BASIC_AUTH]: 'Basic Auth',
  [SecurityProtocol.MUTUAL_TLS]: 'Mutual TLS',
  [SecurityProtocol.HMAC]: 'HMAC',
};

const formatLabels = {
  [DataFormat.JSON]: 'JSON',
  [DataFormat.XML]: 'XML',
  [DataFormat.CSV]: 'CSV',
  [DataFormat.EDI]: 'EDI',
  [DataFormat.REST]: 'REST',
  [DataFormat.SOAP]: 'SOAP',
};

export function ExternalApiDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSystem, setSelectedSystem] = useState<ExternalSystem | null>(null);
  const [isAddSystemOpen, setIsAddSystemOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportDataType, setExportDataType] = useState<'production' | 'inventory' | 'quality' | 'maintenance'>('production');

  const {
    systems,
    activeSystems,
    isLoading: systemsLoading,
    addSystem,
    updateSystem,
    deleteSystem,
    testConnection,
    isProcessing,
  } = useExternalSystems();

  const {
    exportProduction,
    exportInventory,
    exportQuality,
    exportMaintenance,
    isExporting,
  } = useDataExport();

  const {
    syncLogs,
    statistics,
    isLoading: statsLoading,
    getRecentLogs,
    getFailedSyncs,
    getRunningSyncs,
  } = useSyncMonitoring();

  const {
    mappings,
    selectedSystemId,
    setSelectedSystemId,
    addMapping,
  } = useDataMapping();

  const {
    generateProductionData,
    generateInventoryData,
    generateQualityData,
    generateMaintenanceData,
  } = useMockDataGeneration();

  const recentLogs = getRecentLogs(10);
  const failedSyncs = getFailedSyncs();
  const runningSyncs = getRunningSyncs();

  // Form state for adding new system
  const [newSystemForm, setNewSystemForm] = useState({
    name: '',
    type: ExternalSystemType.ERP,
    baseUrl: '',
    apiVersion: '',
    format: DataFormat.JSON,
    security: SecurityProtocol.API_KEY,
    credentials: {} as Record<string, string>,
    rateLimit: 1000,
    timeout: 30000,
    description: '',
  });

  const handleAddSystem = () => {
    addSystem.mutate(newSystemForm);
    setIsAddSystemOpen(false);
    setNewSystemForm({
      name: '',
      type: ExternalSystemType.ERP,
      baseUrl: '',
      apiVersion: '',
      format: DataFormat.JSON,
      security: SecurityProtocol.API_KEY,
      credentials: {},
      rateLimit: 1000,
      timeout: 30000,
      description: '',
    });
  };

  const handleExportData = () => {
    if (!selectedSystem) return;

    const systemId = selectedSystem.id;
    const options = { validateData: true, batchSize: 50 };

    switch (exportDataType) {
      case 'production':
        const productionData = generateProductionData(25);
        exportProduction.mutate({ systemId, data: productionData, options });
        break;
      case 'inventory':
        const inventoryData = generateInventoryData(15);
        exportInventory.mutate({ systemId, data: inventoryData });
        break;
      case 'quality':
        const qualityData = generateQualityData(10);
        exportQuality.mutate({ systemId, data: qualityData });
        break;
      case 'maintenance':
        const maintenanceData = generateMaintenanceData(8);
        exportMaintenance.mutate({ systemId, data: maintenanceData });
        break;
    }

    setIsExportDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'running': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (systemsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Harici sistemler yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Harici API Entegrasyonları</h1>
          <p className="text-gray-600 mt-2">
            Tedarikçi, müşteri ve diğer harici sistemlerle veri paylaşımı
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddSystemOpen} onOpenChange={setIsAddSystemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Sistem Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Yeni Harici Sistem</DialogTitle>
                <DialogDescription>
                  Yeni bir harici sistem entegrasyonu ekleyin
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Sistem Adı</Label>
                  <Input
                    id="name"
                    value={newSystemForm.name}
                    onChange={(e) => setNewSystemForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ör. SAP ERP Sistemi"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Sistem Türü</Label>
                  <Select 
                    value={newSystemForm.type} 
                    onValueChange={(value) => setNewSystemForm(prev => ({ ...prev, type: value as ExternalSystemType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(systemTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="baseUrl">Base URL</Label>
                  <Input
                    id="baseUrl"
                    value={newSystemForm.baseUrl}
                    onChange={(e) => setNewSystemForm(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="https://api.example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="apiVersion">API Versiyonu</Label>
                    <Input
                      id="apiVersion"
                      value={newSystemForm.apiVersion}
                      onChange={(e) => setNewSystemForm(prev => ({ ...prev, apiVersion: e.target.value }))}
                      placeholder="v1.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="format">Veri Formatı</Label>
                    <Select 
                      value={newSystemForm.format} 
                      onValueChange={(value) => setNewSystemForm(prev => ({ ...prev, format: value as DataFormat }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(formatLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="security">Güvenlik Protokolü</Label>
                  <Select 
                    value={newSystemForm.security} 
                    onValueChange={(value) => setNewSystemForm(prev => ({ ...prev, security: value as SecurityProtocol }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(securityProtocolLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={newSystemForm.description}
                    onChange={(e) => setNewSystemForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Bu sistem hakkında kısa açıklama..."
                  />
                </div>
                <Button onClick={handleAddSystem} className="w-full" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Ekleniyor...
                    </>
                  ) : (
                    'Sistem Ekle'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="systems">Sistemler</TabsTrigger>
          <TabsTrigger value="export">Veri Aktarımı</TabsTrigger>
          <TabsTrigger value="monitoring">İzleme</TabsTrigger>
          <TabsTrigger value="mappings">Veri Mapping</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Sistem</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.totalSystems || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {statistics?.activeSystems || 0} aktif sistem
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bugünkü Senkronizasyon</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.last24Hours || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Son 24 saatte
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Başarı Oranı</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics?.totalSyncs 
                    ? Math.round(((statistics.successfulSyncs || 0) / statistics.totalSyncs) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {statistics?.successfulSyncs || 0}/{statistics?.totalSyncs || 0} başarılı
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Veri Hacmi</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(statistics?.dataVolumeToday || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Bugün aktarılan kayıt
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sistem Türleri Dağılımı</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(statistics?.systemsByType || {}).map(([type, count]) => ({
                        name: systemTypeLabels[type as ExternalSystemType] || type,
                        value: count,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(statistics?.systemsByType || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Son Senkronizasyon Logları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <div className={getStatusColor(log.status)}>
                          {getStatusIcon(log.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{log.operation}</p>
                          <p className="text-xs text-gray-500">{log.recordCount} kayıt</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.startTime.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="systems" className="space-y-4">
          <div className="grid gap-4">
            {systems.map((system) => (
              <Card key={system.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Globe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{system.name}</CardTitle>
                        <CardDescription>{system.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {system.isActive ? (
                        <Badge variant="default">Aktif</Badge>
                      ) : (
                        <Badge variant="secondary">Pasif</Badge>
                      )}
                      <Badge variant="outline">
                        {systemTypeLabels[system.type]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">URL</p>
                      <p className="font-medium">{system.baseUrl}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Versiyon</p>
                      <p className="font-medium">{system.apiVersion}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Format</p>
                      <p className="font-medium">{formatLabels[system.format]}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Güvenlik</p>
                      <p className="font-medium">{securityProtocolLabels[system.security]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection.mutate(system.id)}
                      disabled={testConnection.isPending}
                    >
                      {testConnection.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4" />
                      )}
                      <span className="ml-1">Bağlantı Testi</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSystem(system);
                        setIsExportDialogOpen(true);
                      }}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Veri Gönder
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSystem.mutate({ 
                        id: system.id, 
                        updates: { isActive: !system.isActive } 
                      })}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      {system.isActive ? 'Durdur' : 'Başlat'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Veri Aktarım Paneli</CardTitle>
              <CardDescription>
                Üretim, envanter, kalite ve bakım verilerini harici sistemlere aktarın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeSystems.map((system) => (
                  <Card key={system.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded">
                          <ExternalLink className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{system.name}</h3>
                          <p className="text-xs text-gray-500">{systemTypeLabels[system.type]}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedSystem(system);
                          setIsExportDialogOpen(true);
                        }}
                        disabled={isExporting}
                      >
                        {isExporting ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-1" />
                        )}
                        Veri Gönder
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Veri Aktarımı</DialogTitle>
                <DialogDescription>
                  {selectedSystem?.name} sistemine veri aktarın
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dataType">Veri Türü</Label>
                  <Select value={exportDataType} onValueChange={(value: any) => setExportDataType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Üretim Verileri (25 kayıt)</SelectItem>
                      <SelectItem value="inventory">Envanter Verileri (15 kayıt)</SelectItem>
                      <SelectItem value="quality">Kalite Verileri (10 kayıt)</SelectItem>
                      <SelectItem value="maintenance">Bakım Verileri (8 kayıt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p><strong>Hedef Sistem:</strong> {selectedSystem?.name}</p>
                  <p><strong>Format:</strong> {selectedSystem && formatLabels[selectedSystem.format]}</p>
                  <p><strong>Güvenlik:</strong> {selectedSystem && securityProtocolLabels[selectedSystem.security]}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="flex-1"
                  >
                    {isExporting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Aktarılıyor...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Veri Gönder
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                    İptal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Aktif İşlemler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {runningSyncs.length}
                </div>
                <p className="text-sm text-gray-600">Şu anda çalışan senkronizasyon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Başarısız İşlemler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {failedSyncs.length}
                </div>
                <p className="text-sm text-gray-600">Hatalı senkronizasyon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Ortalama Süre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statistics?.avgResponseTime ? Math.round(statistics.avgResponseTime / 1000) : 0}s
                </div>
                <p className="text-sm text-gray-600">Ortalama yanıt süresi</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Senkronizasyon Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Durum</TableHead>
                    <TableHead>Sistem</TableHead>
                    <TableHead>İşlem</TableHead>
                    <TableHead>Kayıt Sayısı</TableHead>
                    <TableHead>Başlama Zamanı</TableHead>
                    <TableHead>Süre</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLogs.map((log) => {
                    const system = systems.find(s => s.id === log.systemId);
                    const duration = log.endTime 
                      ? Math.round((log.endTime.getTime() - log.startTime.getTime()) / 1000)
                      : '-';
                    
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className={`flex items-center gap-1 ${getStatusColor(log.status)}`}>
                            {getStatusIcon(log.status)}
                            <span className="capitalize">{log.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{system?.name || log.systemId}</TableCell>
                        <TableCell className="capitalize">{log.operation}</TableCell>
                        <TableCell>{log.recordCount.toLocaleString()}</TableCell>
                        <TableCell>{log.startTime.toLocaleString()}</TableCell>
                        <TableCell>{duration}s</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mappings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Veri Mapping Yönetimi</CardTitle>
              <CardDescription>
                Harici sistemler için veri alan eşleştirmelerini yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Sistem Seçin</Label>
                  <Select value={selectedSystemId} onValueChange={setSelectedSystemId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bir sistem seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {systems.map((system) => (
                        <SelectItem key={system.id} value={system.id}>
                          {system.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSystemId && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Mevcut Mapping'ler</h3>
                    {mappings.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Kaynak Alan</TableHead>
                            <TableHead>Hedef Alan</TableHead>
                            <TableHead>Dönüşüm</TableHead>
                            <TableHead>Zorunlu</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mappings.map((mapping) => (
                            <TableRow key={mapping.id}>
                              <TableCell className="font-mono text-sm">
                                {mapping.sourceField}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {mapping.targetField}
                              </TableCell>
                              <TableCell>
                                {mapping.transformation || '-'}
                              </TableCell>
                              <TableCell>
                                {mapping.isRequired ? (
                                  <Badge variant="default">Evet</Badge>
                                ) : (
                                  <Badge variant="secondary">Hayır</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Bu sistem için henüz mapping tanımlanmamış
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Günlük Senkronizasyon Trendi</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={Array.from({ length: 7 }, (_, i) => ({
                      day: `Gün ${i + 1}`,
                      successful: Math.floor(Math.random() * 50) + 20,
                      failed: Math.floor(Math.random() * 10),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="successful" stroke="#10b981" name="Başarılı" />
                    <Line type="monotone" dataKey="failed" stroke="#ef4444" name="Başarısız" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sistem Performansı</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={activeSystems.map(system => ({
                      name: system.name.split(' ')[0],
                      responseTime: Math.floor(Math.random() * 3000) + 500,
                      successRate: Math.floor(Math.random() * 30) + 70,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="responseTime" fill="#3b82f6" name="Yanıt Süresi (ms)" />
                    <Bar dataKey="successRate" fill="#10b981" name="Başarı Oranı (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Veri Hacmi Analizi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(statistics?.dataVolumeToday || 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Bugün</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor((statistics?.dataVolumeToday || 0) * 6.8).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Bu Hafta</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor((statistics?.dataVolumeToday || 0) * 28.5).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Bu Ay</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.floor((statistics?.dataVolumeToday || 0) * 365).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Yıllık Tahmini</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}