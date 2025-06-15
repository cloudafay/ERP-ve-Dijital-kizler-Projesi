import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import BackToHomeButton from '../components/BackToHomeButton';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap, 
  Thermometer,
  AlertCircle,
  Shield,
  Wrench,
  Activity,
  Bell,
  BellOff,
  Filter,
  Search,
  ExternalLink,
  Eye,
  X,
  RefreshCw
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'maintenance' | 'quality';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  machine?: string;
  location?: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  category: string;
  impact: string;
  recommendedAction: string;
}

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('active');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showAcknowledgePanel, setShowAcknowledgePanel] = useState(false);
  const [showResolvePanel, setShowResolvePanel] = useState(false);
  const [actioningAlert, setActioningAlert] = useState<Alert | null>(null);
  const [showRefreshPanel, setShowRefreshPanel] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastRefreshTime, setLastRefreshTime] = useState<string>('');

  // Mock uyarı verileri
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: 'ALR-001',
        type: 'critical',
        severity: 'high',
        title: 'Dolum Makinesi Aşırı Sıcaklık',
        description: 'Dolum Makinesi #1\'de normal çalışma sıcaklığının üzerinde ölçüm tespit edildi.',
        machine: 'Dolum Makinesi #1',
        location: 'Üretim Hattı A',
        timestamp: '2024-01-15 14:32',
        status: 'active',
        category: 'Makine Sıcaklık',
        impact: 'Üretim durması riski, kalite problemi',
        recommendedAction: 'Soğutma sistemi kontrolü, acil bakım gerekli'
      },
      {
        id: 'ALR-002',
        type: 'warning',
        severity: 'medium',
        title: 'Etiketleme Hızı Düşük',
        description: 'Etiketleme makinesi beklenen hızın %15 altında çalışıyor.',
        machine: 'Etiketleme Makinesi #1',
        location: 'Paketleme Bölümü',
        timestamp: '2024-01-15 14:15',
        status: 'acknowledged',
        acknowledgedBy: 'Mehmet Kaya',
        category: 'Performans',
        impact: 'Üretim hedeflerinde gecikme',
        recommendedAction: 'Konveyör sistemi kontrolü, hız ayarı'
      },
      {
        id: 'ALR-003',
        type: 'maintenance',
        severity: 'medium',
        title: 'Önleyici Bakım Zamanı',
        description: 'Şişe üfleme makinesi için planlı bakım zamanı geldi.',
        machine: 'Şişe Üfleme Makinesi #1',
        location: 'Üretim Hattı B',
        timestamp: '2024-01-15 13:45',
        status: 'active',
        category: 'Planlı Bakım',
        impact: 'Bakım yapılmazsa arıza riski',
        recommendedAction: 'Bakım ekibini bilgilendir, planlama yap'
      },
      {
        id: 'ALR-004',
        type: 'quality',
        severity: 'high',
        title: 'Kalite Kontrol Hatası',
        description: 'Son 3 batch\'te kalite standartlarının altında ürün tespit edildi.',
        machine: 'Kalite Kontrol İstasyonu',
        location: 'Kalite Laboratuvarı',
        timestamp: '2024-01-15 13:20',
        status: 'acknowledged',
        acknowledgedBy: 'Fatma Demir',
        category: 'Kalite',
        impact: 'Müşteri memnuniyetsizliği riski',
        recommendedAction: 'Üretim parametrelerini kontrol et, kök neden analizi'
      },
      {
        id: 'ALR-005',
        type: 'info',
        severity: 'low',
        title: 'Vardiya Değişimi',
        description: 'Gece vardiyası personeli göreve başladı.',
        location: 'Genel',
        timestamp: '2024-01-15 12:00',
        status: 'resolved',
        resolvedBy: 'Sistem',
        resolvedAt: '2024-01-15 12:01',
        category: 'Bilgilendirme',
        impact: 'Etkisiz',
        recommendedAction: 'İşlem gerekmiyor'
      },
      {
        id: 'ALR-006',
        type: 'critical',
        severity: 'high',
        title: 'Acil Durum Butonu Aktivasyon',
        description: 'Üretim hattında acil durum butonu basıldı.',
        machine: 'Genel Sistem',
        location: 'Üretim Hattı A',
        timestamp: '2024-01-15 11:45',
        status: 'resolved',
        acknowledgedBy: 'Ali Yılmaz',
        resolvedBy: 'Ali Yılmaz',
        resolvedAt: '2024-01-15 11:47',
        category: 'Güvenlik',
        impact: 'Üretim durduruldu',
        recommendedAction: 'Güvenlik protokolü uygulandı'
      }
    ];

    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts.filter(alert => alert.status === 'active'));
  }, []);

  // Filtreleme ve arama
  useEffect(() => {
    let filtered = alerts;

    // Durum filtresi
    if (activeTab !== 'all') {
      filtered = filtered.filter(alert => alert.status === activeTab);
    }

    // Tür filtresi
    if (filterType !== 'all') {
      filtered = filtered.filter(alert => alert.type === filterType);
    }

    // Arama
    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.machine?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, activeTab, filterType, searchTerm]);

  // Otomatik yenileme
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Gerçek uygulamada API'den yeni uyarılar çekilir
      const now = new Date().toLocaleString('tr-TR');
      setLastRefreshTime(now);
      console.log('Uyarılar otomatik olarak yenilendi');
    }, refreshInterval * 1000); // refreshInterval saniye

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'maintenance': return <Wrench className="w-5 h-5" />;
      case 'quality': return <Shield className="w-5 h-5" />;
      case 'info': return <Bell className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: Alert['type'], severity: Alert['severity']) => {
    if (type === 'critical') return 'bg-red-500 text-white';
    if (type === 'warning') return 'bg-orange-500 text-white';
    if (type === 'maintenance') return 'bg-blue-500 text-white';
    if (type === 'quality') return 'bg-purple-500 text-white';
    if (severity === 'high') return 'bg-red-100 text-red-800';
    if (severity === 'medium') return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: Alert['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-red-100 text-red-800">🔴 Aktif</Badge>;
      case 'acknowledged':
        return <Badge className="bg-orange-100 text-orange-800">⏳ Onaylandı</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">✅ Çözüldü</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">❓ Bilinmiyor</Badge>;
    }
  };

  const handleAcknowledge = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setActioningAlert(alert);
      setShowAcknowledgePanel(true);
    }
  };

  const handleResolve = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setActioningAlert(alert);
      setShowResolvePanel(true);
    }
  };

  const confirmAcknowledge = (reason: string, assignee: string) => {
    if (actioningAlert) {
      setAlerts(prev => prev.map(alert => 
        alert.id === actioningAlert.id 
          ? { 
              ...alert, 
              status: 'acknowledged' as const, 
              acknowledgedBy: assignee,
              acknowledgeReason: reason,
              acknowledgedAt: new Date().toLocaleString('tr-TR')
            }
          : alert
      ));
      setShowAcknowledgePanel(false);
      setActioningAlert(null);
    }
  };

  const confirmResolve = (solution: string, notes: string, assignee: string) => {
    if (actioningAlert) {
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setAlerts(prev => prev.map(alert => 
        alert.id === actioningAlert.id 
          ? { 
              ...alert, 
              status: 'resolved' as const, 
              resolvedBy: assignee,
              resolvedAt: timestamp,
              solution: solution,
              resolveNotes: notes
            }
          : alert
      ));
      setShowResolvePanel(false);
      setActioningAlert(null);
    }
  };

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const handleRefresh = () => {
    setShowRefreshPanel(true);
  };

  const performRefresh = (options: {
    refreshType: string;
    includeResolved: boolean;
    clearCache: boolean;
    backgroundSync: boolean;
  }) => {
    const now = new Date().toLocaleString('tr-TR');
    setLastRefreshTime(now);
    
    // Simulated refresh based on options
    if (options.clearCache) {
      // Simulate cache clearing
      console.log('Cache cleared');
    }
    
    if (options.backgroundSync) {
      // Simulate background sync
      console.log('Background sync enabled');
    }
    
    // Update alerts based on refresh type
    if (options.refreshType === 'full') {
      // Full system refresh - could add new mock alerts
      console.log('Full system refresh performed');
    } else if (options.refreshType === 'incremental') {
      // Incremental refresh - only new/updated alerts
      console.log('Incremental refresh performed');
    }
    
    setShowRefreshPanel(false);
  };

  const stats = {
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    critical: alerts.filter(a => a.type === 'critical' && a.status === 'active').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              🚨 Sistem Uyarıları
            </h1>
            <p className="text-gray-600 mt-2">Anlık sistem bildirimleri ve uyarı yönetimi</p>
          </div>
          
          <div className="flex gap-3">
            <BackToHomeButton />
            <Button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant="outline"
              className={`${autoRefresh ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50'}`}
            >
              {autoRefresh ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
              {autoRefresh ? 'Otomatik Yenileme' : 'Manuel Mod'}
            </Button>
            <Button 
              onClick={handleRefresh}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenile
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.active}</div>
              <div className="text-sm text-gray-600">🔴 Aktif Uyarı</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.acknowledged}</div>
              <div className="text-sm text-gray-600">⏳ Onaylandı</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-sm text-gray-600">✅ Çözüldü</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
              <div className="text-sm text-gray-600">⚠️ Kritik</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Uyarı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tüm Türler</option>
                  <option value="critical">Kritik</option>
                  <option value="warning">Uyarı</option>
                  <option value="maintenance">Bakım</option>
                  <option value="quality">Kalite</option>
                  <option value="info">Bilgi</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredAlerts.length} uyarı gösteriliyor
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} defaultValue="active" onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
          <TabsList className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg rounded-full p-1">
            <TabsTrigger value="all" className="rounded-full px-6 py-2">
              📋 Tümü ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-full px-6 py-2">
              🔴 Aktif ({stats.active})
            </TabsTrigger>
            <TabsTrigger value="acknowledged" className="rounded-full px-6 py-2">
              ⏳ Onaylandı ({stats.acknowledged})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="rounded-full px-6 py-2">
              ✅ Çözüldü ({stats.resolved})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
                <CardContent className="p-8 text-center">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Uyarı Bulunamadı</h3>
                  <p className="text-gray-500">Seçilen kriterlere uygun uyarı bulunmuyor.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl hover:shadow-2xl transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-2 rounded-lg ${getAlertColor(alert.type, alert.severity)}`}>
                            {getAlertIcon(alert.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-gray-900">{alert.title}</h3>
                              {getStatusBadge(alert.status)}
                              <Badge variant="outline" className="text-xs">
                                {alert.severity === 'high' ? '🔴 Yüksek' : 
                                 alert.severity === 'medium' ? '🟡 Orta' : '🟢 Düşük'}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-700 mb-2">{alert.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">📍 Konum:</span> {alert.location}
                              </div>
                              <div>
                                <span className="font-medium">🕐 Zaman:</span> {alert.timestamp}
                              </div>
                              {alert.machine && (
                                <div>
                                  <span className="font-medium">🏭 Makine:</span> {alert.machine}
                                </div>
                              )}
                              <div>
                                <span className="font-medium">📂 Kategori:</span> {alert.category}
                              </div>
                            </div>
                            
                            {alert.acknowledgedBy && (
                              <div className="mt-2 text-sm text-orange-600">
                                ⏳ Onaylayan: {alert.acknowledgedBy}
                              </div>
                            )}
                            
                            {alert.resolvedBy && (
                              <div className="mt-2 text-sm text-green-600">
                                ✅ Çözen: {alert.resolvedBy} ({alert.resolvedAt})
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(alert)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {alert.status === 'active' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAcknowledge(alert.id)}
                                className="text-orange-600 border-orange-300 hover:bg-orange-50"
                              >
                                ✋ Onayla
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleResolve(alert.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                ✅ Çöz
                              </Button>
                            </>
                          )}
                          
                          {alert.status === 'acknowledged' && (
                            <Button
                              size="sm"
                              onClick={() => handleResolve(alert.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              ✅ Çöz
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Alert Detail Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getAlertIcon(selectedAlert.type)}
                    {selectedAlert.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAlert(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-gray-700">Durum:</label>
                    <div className="mt-1">{getStatusBadge(selectedAlert.status)}</div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Önem Derecesi:</label>
                    <div className="mt-1">
                      <Badge className={getAlertColor(selectedAlert.type, selectedAlert.severity)}>
                        {selectedAlert.severity === 'high' ? 'Yüksek' : 
                         selectedAlert.severity === 'medium' ? 'Orta' : 'Düşük'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Tarih/Saat:</label>
                    <div className="mt-1 text-gray-600">{selectedAlert.timestamp}</div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Kategori:</label>
                    <div className="mt-1 text-gray-600">{selectedAlert.category}</div>
                  </div>
                </div>
                
                <div>
                  <label className="font-medium text-gray-700">Açıklama:</label>
                  <div className="mt-1 text-gray-600">{selectedAlert.description}</div>
                </div>
                
                <div>
                  <label className="font-medium text-gray-700">Etki:</label>
                  <div className="mt-1 text-gray-600">{selectedAlert.impact}</div>
                </div>
                
                <div>
                  <label className="font-medium text-gray-700">Önerilen Eylem:</label>
                  <div className="mt-1 text-gray-600">{selectedAlert.recommendedAction}</div>
                </div>
                
                {selectedAlert.machine && (
                  <div>
                    <label className="font-medium text-gray-700">Etkilenen Makine:</label>
                    <div className="mt-1 text-gray-600">{selectedAlert.machine}</div>
                  </div>
                )}
                
                {selectedAlert.location && (
                  <div>
                    <label className="font-medium text-gray-700">Konum:</label>
                    <div className="mt-1 text-gray-600">{selectedAlert.location}</div>
                  </div>
                )}
                
                <div className="pt-4 border-t flex gap-2">
                  {selectedAlert.status === 'active' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleAcknowledge(selectedAlert.id);
                          setSelectedAlert(null);
                        }}
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        ✋ Onayla
                      </Button>
                      <Button
                        onClick={() => {
                          handleResolve(selectedAlert.id);
                          setSelectedAlert(null);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        ✅ Çöz
                      </Button>
                    </>
                  )}
                  
                  {selectedAlert.status === 'acknowledged' && (
                    <Button
                      onClick={() => {
                        handleResolve(selectedAlert.id);
                        setSelectedAlert(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      ✅ Çöz
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Acknowledge Panel */}
        {showAcknowledgePanel && actioningAlert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      ✋
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Uyarı Onaylama</h2>
                      <p className="text-orange-100">Uyarıyı onaylayarak sorumluluğu üstlenin</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAcknowledgePanel(false);
                      setActioningAlert(null);
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Alert Info */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${getAlertColor(actioningAlert.type, actioningAlert.severity)}`}>
                      {getAlertIcon(actioningAlert.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{actioningAlert.title}</h3>
                      <p className="text-sm text-gray-600">ID: {actioningAlert.id}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{actioningAlert.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">📍 Konum:</span> {actioningAlert.location}</div>
                    <div><span className="font-medium">🕐 Zaman:</span> {actioningAlert.timestamp}</div>
                    {actioningAlert.machine && (
                      <div><span className="font-medium">🏭 Makine:</span> {actioningAlert.machine}</div>
                    )}
                    <div><span className="font-medium">📂 Kategori:</span> {actioningAlert.category}</div>
                  </div>
                </div>

                <AcknowledgeForm 
                  onConfirm={confirmAcknowledge} 
                  onCancel={() => {
                    setShowAcknowledgePanel(false);
                    setActioningAlert(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Resolve Panel */}
        {showResolvePanel && actioningAlert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      ✅
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Uyarı Çözme</h2>
                      <p className="text-green-100">Uyarıyı çözerek kalıcı olarak kapatın</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowResolvePanel(false);
                      setActioningAlert(null);
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Alert Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${getAlertColor(actioningAlert.type, actioningAlert.severity)}`}>
                      {getAlertIcon(actioningAlert.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{actioningAlert.title}</h3>
                      <p className="text-sm text-gray-600">ID: {actioningAlert.id}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{actioningAlert.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">📍 Konum:</span> {actioningAlert.location}</div>
                    <div><span className="font-medium">🕐 Zaman:</span> {actioningAlert.timestamp}</div>
                    {actioningAlert.machine && (
                      <div><span className="font-medium">🏭 Makine:</span> {actioningAlert.machine}</div>
                    )}
                    <div><span className="font-medium">📂 Kategori:</span> {actioningAlert.category}</div>
                  </div>
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm"><span className="font-medium">💡 Önerilen Eylem:</span> {actioningAlert.recommendedAction}</p>
                  </div>
                </div>

                <ResolveForm 
                  onConfirm={confirmResolve} 
                  onCancel={() => {
                    setShowResolvePanel(false);
                    setActioningAlert(null);
                  }}
                />
              </div>
            </div>
                     </div>
         )}

         {/* Refresh Panel */}
         {showRefreshPanel && (
           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
             <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden">
               {/* Header */}
               <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-white/20 rounded-lg">
                       <RefreshCw className="w-6 h-6" />
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold">Sistem Yenileme</h2>
                       <p className="text-blue-100">Uyarıları yenile ve sistem ayarlarını yönet</p>
                     </div>
                   </div>
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => setShowRefreshPanel(false)}
                     className="text-white hover:bg-white/20"
                   >
                     <X className="w-5 h-5" />
                   </Button>
                 </div>
               </div>

               {/* Content */}
               <div className="p-6">
                 <RefreshForm 
                   onRefresh={performRefresh}
                   onCancel={() => setShowRefreshPanel(false)}
                   autoRefresh={autoRefresh}
                   setAutoRefresh={setAutoRefresh}
                   refreshInterval={refreshInterval}
                   setRefreshInterval={setRefreshInterval}
                   lastRefreshTime={lastRefreshTime}
                 />
               </div>
             </div>
           </div>
         )}
       </div>
     </div>
   );
 };
 
 // Acknowledge Form Component
const AcknowledgeForm: React.FC<{
  onConfirm: (reason: string, assignee: string) => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  const [assignee, setAssignee] = useState('Mustafa Yardım');
  const [priority, setPriority] = useState('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim() && assignee.trim()) {
      onConfirm(reason, assignee);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            👤 Sorumlu Kişi
          </label>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          >
            <option value="Mustafa Yardım">Mustafa Yardım</option>
            <option value="Mehmet Kaya">Mehmet Kaya</option>
            <option value="Fatma Demir">Fatma Demir</option>
            <option value="Ali Yılmaz">Ali Yılmaz</option>
            <option value="Ayşe Özkan">Ayşe Özkan</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⚡ Müdahale Önceliği
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="urgent">🔴 Acil (1 saat içinde)</option>
            <option value="high">🟡 Yüksek (4 saat içinde)</option>
            <option value="normal">🟢 Normal (1 gün içinde)</option>
            <option value="low">⚪ Düşük (Planlı bakımda)</option>
          </select>
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📝 Onaylama Nedeni / Müdahale Planı
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Bu uyarıyı neden onaylıyorsunuz? Nasıl bir müdahale planlıyorsunuz?"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          required
        />
      </div>

      {/* Quick Reasons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🚀 Hızlı Nedenler
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            "Teknik ekip bilgilendirildi",
            "Planlı bakım programlandı",
            "Geçici çözüm uygulandı",
            "Tedarikçi ile iletişime geçildi",
            "Operatör eğitimi planlandı",
            "Risk değerlendirmesi yapıldı"
          ].map((quickReason) => (
            <Button
              key={quickReason}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReason(quickReason)}
              className="text-xs hover:bg-orange-50 hover:border-orange-300"
            >
              {quickReason}
            </Button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          ❌ İptal
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          disabled={!reason.trim() || !assignee.trim()}
        >
          ✋ Uyarıyı Onayla
        </Button>
      </div>
    </form>
  );
};

// Resolve Form Component
const ResolveForm: React.FC<{
  onConfirm: (solution: string, notes: string, assignee: string) => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  const [solution, setSolution] = useState('');
  const [notes, setNotes] = useState('');
  const [assignee, setAssignee] = useState('Mustafa Yardım');
  const [solutionType, setSolutionType] = useState('repair');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (solution.trim() && assignee.trim()) {
      onConfirm(solution, notes, assignee);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            👤 Çözen Kişi
          </label>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="Mustafa Yardım">Mustafa Yardım</option>
            <option value="Mehmet Kaya">Mehmet Kaya</option>
            <option value="Fatma Demir">Fatma Demir</option>
            <option value="Ali Yılmaz">Ali Yılmaz</option>
            <option value="Ayşe Özkan">Ayşe Özkan</option>
          </select>
        </div>

        {/* Solution Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔧 Çözüm Türü
          </label>
          <select
            value={solutionType}
            onChange={(e) => setSolutionType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="repair">🔧 Onarım/Tamir</option>
            <option value="replacement">🔄 Parça Değişimi</option>
            <option value="adjustment">⚙️ Ayarlama/Kalibrasyon</option>
            <option value="maintenance">🛠️ Bakım İşlemi</option>
            <option value="software">💻 Yazılım Güncellemesi</option>
            <option value="process">📋 Süreç Değişikliği</option>
            <option value="training">🎓 Eğitim/Bilgilendirme</option>
            <option value="other">❓ Diğer</option>
          </select>
        </div>
      </div>

      {/* Solution Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ✅ Uygulanan Çözüm
        </label>
        <textarea
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="Bu sorunu nasıl çözdünüz? Hangi adımlar atıldı?"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          required
        />
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📋 Ek Notlar / Önlemler
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Gelecekte benzer sorunları önlemek için alınan önlemler, değiştirilen ayarlar vs."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Quick Solutions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🚀 Hızlı Çözümler
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Makine yeniden başlatıldı",
            "Sıcaklık ayarları düzeltildi",
            "Bozuk parça değiştirildi",
            "Yazılım güncellemesi yapıldı",
            "Kalibrasyon ayarlandı",
            "Temizlik ve bakım yapıldı",
            "Operatör eğitimi verildi",
            "Emniyet sistemi kontrol edildi"
          ].map((quickSolution) => (
            <Button
              key={quickSolution}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSolution(quickSolution)}
              className="text-xs hover:bg-green-50 hover:border-green-300"
            >
              {quickSolution}
            </Button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          ❌ İptal
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          disabled={!solution.trim() || !assignee.trim()}
        >
          ✅ Uyarıyı Çöz
        </Button>
      </div>
    </form>
  );
 };

// Refresh Form Component
const RefreshForm: React.FC<{
  onRefresh: (options: {
    refreshType: string;
    includeResolved: boolean;
    clearCache: boolean;
    backgroundSync: boolean;
  }) => void;
  onCancel: () => void;
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (value: number) => void;
  lastRefreshTime: string;
}> = ({ 
  onRefresh, 
  onCancel, 
  autoRefresh, 
  setAutoRefresh, 
  refreshInterval, 
  setRefreshInterval, 
  lastRefreshTime 
}) => {
  const [refreshType, setRefreshType] = useState('incremental');
  const [includeResolved, setIncludeResolved] = useState(false);
  const [clearCache, setClearCache] = useState(false);
  const [backgroundSync, setBackgroundSync] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRefresh({
      refreshType,
      includeResolved,
      clearCache,
      backgroundSync
    });
  };

  const refreshTypeOptions = [
    { value: 'incremental', label: '🔄 Artımlı Yenileme', desc: 'Sadece yeni/güncellenmiş uyarılar' },
    { value: 'full', label: '🔄 Tam Yenileme', desc: 'Tüm sistem verilerini yeniden yükle' },
    { value: 'priority', label: '⚡ Öncelikli Yenileme', desc: 'Kritik uyarıları önce yükle' },
    { value: 'selective', label: '🎯 Seçici Yenileme', desc: 'Belirli kategorileri yenile' }
  ];

  const intervalOptions = [
    { value: 10, label: '10 saniye (Hızlı)' },
    { value: 30, label: '30 saniye (Normal)' },
    { value: 60, label: '1 dakika (Yavaş)' },
    { value: 300, label: '5 dakika (Çok Yavaş)' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Current Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          📊 Mevcut Durum
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">🔄 Otomatik Yenileme:</span>
            <div className={`mt-1 px-2 py-1 rounded text-xs font-medium ${autoRefresh ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {autoRefresh ? '✅ Aktif' : '❌ Pasif'}
            </div>
          </div>
          <div>
            <span className="font-medium text-blue-700">⏱️ Yenileme Aralığı:</span>
            <div className="mt-1 text-blue-900">{refreshInterval} saniye</div>
          </div>
          <div>
            <span className="font-medium text-blue-700">🕐 Son Yenileme:</span>
            <div className="mt-1 text-blue-900">{lastRefreshTime || 'Henüz yenilenmedi'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Refresh Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🔄 Yenileme Türü
          </label>
          <div className="space-y-2">
            {refreshTypeOptions.map((option) => (
              <label key={option.value} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="refreshType"
                  value={option.value}
                  checked={refreshType === option.value}
                  onChange={(e) => setRefreshType(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Auto Refresh Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ⚙️ Otomatik Yenileme Ayarları
          </label>
          
          {/* Auto Refresh Toggle */}
          <div className="mb-4 p-3 border rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium">Otomatik Yenilemeyi Etkinleştir</div>
                <div className="text-sm text-gray-600">Uyarılar otomatik olarak yenilensin</div>
              </div>
            </label>
          </div>

          {/* Refresh Interval */}
          {autoRefresh && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⏱️ Yenileme Aralığı
              </label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {intervalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Background Sync */}
          <div className="p-3 border rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={backgroundSync}
                onChange={(e) => setBackgroundSync(e.target.checked)}
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium">Arka Plan Senkronizasyonu</div>
                <div className="text-sm text-gray-600">Sayfa aktif değilken de yenile</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          🔧 Gelişmiş Seçenekler
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={includeResolved}
              onChange={(e) => setIncludeResolved(e.target.checked)}
              className="w-4 h-4"
            />
            <div>
              <div className="font-medium">✅ Çözülen Uyarıları Dahil Et</div>
              <div className="text-sm text-gray-600">Çözülen uyarıları da yenile</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={clearCache}
              onChange={(e) => setClearCache(e.target.checked)}
              className="w-4 h-4"
            />
            <div>
              <div className="font-medium">🗑️ Önbelleği Temizle</div>
              <div className="text-sm text-gray-600">Tüm cached verileri sil</div>
            </div>
          </label>
        </div>
      </div>

      {/* System Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          📈 Sistem İstatistikleri
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">15</div>
            <div className="text-gray-600">Bugün Yenilendi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">98%</div>
            <div className="text-gray-600">Başarı Oranı</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">2.3s</div>
            <div className="text-gray-600">Ortalama Süre</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">24</div>
            <div className="text-gray-600">Toplam Kaynak</div>
          </div>
        </div>
      </div>

      {/* Quick Refresh Actions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          🚀 Hızlı Yenileme
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { type: 'incremental', label: '🔄 Hızlı Yenile', desc: 'Yeni uyarılar' },
            { type: 'full', label: '♻️ Tam Yenile', desc: 'Tüm sistem' },
            { type: 'priority', label: '⚡ Kritik Yenile', desc: 'Öncelikli' },
            { type: 'selective', label: '🎯 Seçici Yenile', desc: 'Kategori bazlı' }
          ].map((action) => (
            <Button
              key={action.type}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setRefreshType(action.type);
                onRefresh({
                  refreshType: action.type,
                  includeResolved: false,
                  clearCache: false,
                  backgroundSync: true
                });
              }}
              className="text-xs p-3 h-auto flex-col hover:bg-blue-50 hover:border-blue-300"
            >
              <div className="font-medium">{action.label}</div>
              <div className="text-gray-600">{action.desc}</div>
            </Button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          ❌ İptal
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          🔄 Şimdi Yenile
        </Button>
      </div>
    </form>
  );
};
 
 export default AlertsPage; 