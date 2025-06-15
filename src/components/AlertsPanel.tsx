import React, { useState } from 'react';
import { useDigitalTwinStore } from '../lib/store';
import { AlertTriangle, Clock, Info, Shield, Phone, Power, X, CheckCircle, Wrench, Users, List, Filter, FileText, Download } from 'lucide-react';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  machine: string;
}

interface AlertsPanelProps {
  alertsCount: number;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alertsCount }) => {
  const { machines, addAlert, updateMachine } = useDigitalTwinStore();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [maintenanceRequested, setMaintenanceRequested] = useState(false);
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);
  const [emergencyConfirming, setEmergencyConfirming] = useState(false);
  const [showMaintenancePanel, setShowMaintenancePanel] = useState(false);
  const [maintenanceConfirming, setMaintenanceConfirming] = useState(false);
  const [showAllAlertsPanel, setShowAllAlertsPanel] = useState(false);
  const [selectedAlertType, setSelectedAlertType] = useState<string>('all');
  const [showAlertDetail, setShowAlertDetail] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'error',
      title: 'Makine Arızası',
      message: 'Etiketleme Makinesi 1 beklenmedik şekilde durdu',
      timestamp: '10:45',
      machine: 'LABELING_01'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Yüksek Sıcaklık',
      message: 'Kalıplama Makinesi 1 sıcaklığı normal değerlerin üzerinde',
      timestamp: '10:30',
      machine: 'MOLDING_01'
    },
    {
      id: '3',
      type: 'info',
      title: 'Bakım Zamanı',
      message: 'Dolum Hattı 2 için planlı bakım başladı',
      timestamp: '09:15',
      machine: 'FILLING_02'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Düşük Verimlilik',
      message: 'Kapak Takma 1 verimlilik %90\'ın altında',
      timestamp: '09:00',
      machine: 'CAPPING_01'
    }
  ];

  // Tüm sistem uyarıları (daha kapsamlı liste)
  const allAlerts: Alert[] = [
    {
      id: '1',
      type: 'error',
      title: 'Makine Arızası',
      message: 'Etiketleme Makinesi 1 beklenmedik şekilde durdu. Motor arızası tespit edildi.',
      timestamp: '10:45',
      machine: 'LABELING_01'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Yüksek Sıcaklık',
      message: 'Kalıplama Makinesi 1 sıcaklığı 85°C\'ye ulaştı. Normal değer 70-75°C arası.',
      timestamp: '10:30',
      machine: 'MOLDING_01'
    },
    {
      id: '3',
      type: 'info',
      title: 'Bakım Zamanı',
      message: 'Dolum Hattı 2 için planlı bakım başladı. Tahmini süre: 2 saat.',
      timestamp: '09:15',
      machine: 'FILLING_02'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Düşük Verimlilik',
      message: 'Kapak Takma 1 verimlilik %89\'a düştü. Hedef: %95 üzeri.',
      timestamp: '09:00',
      machine: 'CAPPING_01'
    },
    {
      id: '5',
      type: 'error',
      title: 'Güç Kesintisi',
      message: 'Hat 3\'te 2 dakikalık güç kesintisi yaşandı. Sistem yeniden başlatıldı.',
      timestamp: '08:45',
      machine: 'LINE_03'
    },
    {
      id: '6',
      type: 'info',
      title: 'Kalibrasyon Tamamlandı',
      message: 'Kalıplama Makinesi 2 kalibrasyon işlemi başarıyla tamamlandı.',
      timestamp: '08:30',
      machine: 'MOLDING_02'
    },
    {
      id: '7',
      type: 'warning',
      title: 'Stok Azalması',
      message: 'Hammadde deposu %15 seviyesine düştü. Tedarik gerekli.',
      timestamp: '08:15',
      machine: 'STORAGE_01'
    },
    {
      id: '8',
      type: 'error',
      title: 'Sensor Hatası',
      message: 'Dolum Hattı 1 seviye sensörü yanıt vermiyor.',
      timestamp: '08:00',
      machine: 'FILLING_01'
    },
    {
      id: '9',
      type: 'info',
      title: 'Vardiya Değişimi',
      message: 'Gece vardiyası teslim alındı. 12 operatör göreve başladı.',
      timestamp: '07:45',
      machine: 'SYSTEM'
    },
    {
      id: '10',
      type: 'warning',
      title: 'Yavaş Çalışma',
      message: 'Paketleme ünitesi normal hızın %80\'inde çalışıyor.',
      timestamp: '07:30',
      machine: 'PACKAGING_01'
    }
  ];

  const handleEmergencyStop = () => {
    setShowEmergencyPanel(true);
  };

  const confirmEmergencyStop = () => {
    setEmergencyConfirming(true);
    
    setTimeout(() => {
      setIsEmergencyActive(true);
      setShowEmergencyPanel(false);
      setEmergencyConfirming(false);
      
      // Tüm makineleri durdur
      machines.forEach(machine => {
        updateMachine(machine.id, {
          status: 'stopped',
          speed: 0,
          efficiency: 0
        });
      });

      // Acil durum uyarısı ekle
      addAlert({
        machineId: 'emergency-system',
        type: 'critical',
        message: '🚨 ACİL DURDUR aktif! Tüm makineler güvenlik protokolü ile durduruldu.',
        acknowledged: false,
        resolved: false
      });

      // 30 saniye sonra acil durum flagini kaldır
      setTimeout(() => {
        setIsEmergencyActive(false);
      }, 30000);

      // Simulated emergency response
      setTimeout(() => {
        addAlert({
          machineId: 'emergency-system',
          type: 'info',
          message: '📞 Acil müdahale ekibi bilgilendirildi. ETA: 5 dakika',
          acknowledged: false,
          resolved: false
        });
      }, 2000);
    }, 1500);
  };

  const cancelEmergencyStop = () => {
    setShowEmergencyPanel(false);
  };

  const handleMaintenanceRequest = () => {
    setShowMaintenancePanel(true);
  };

  const confirmMaintenanceRequest = () => {
    setMaintenanceConfirming(true);
    
    setTimeout(() => {
      setMaintenanceRequested(true);
      setShowMaintenancePanel(false);
      setMaintenanceConfirming(false);
      
      // Bakım çağrısı uyarısı ekle
      addAlert({
        machineId: 'maintenance-system',
        type: 'info',
        message: '🔧 Bakım ekibi çağrıldı. Müdahale ekibi hazırlanıyor...',
        acknowledged: false,
        resolved: false
      });

      // Simulated maintenance response
      setTimeout(() => {
        addAlert({
          machineId: 'maintenance-system',
          type: 'info',
          message: '👨‍🔧 Bakım ekibi yola çıktı. Tahmini varış: 12 dakika',
          acknowledged: false,
          resolved: false
        });
      }, 3000);

      setTimeout(() => {
        addAlert({
          machineId: 'maintenance-system',
          type: 'info',
          message: '✅ Bakım ekibi fabrikaya ulaştı ve çalışmaya başladı',
          acknowledged: false,
          resolved: false
        });
        setMaintenanceRequested(false);
      }, 15000);
    }, 1200);
  };

  const cancelMaintenanceRequest = () => {
    setShowMaintenancePanel(false);
  };

  const handleShowAllAlerts = () => {
    setShowAllAlertsPanel(true);
  };

  const handleCloseAllAlerts = () => {
    setShowAllAlertsPanel(false);
    setSelectedAlertType('all');
  };

  const getFilteredAlerts = () => {
    if (selectedAlertType === 'all') return allAlerts.filter(alert => !acknowledgedAlerts.has(alert.id));
    return allAlerts.filter(alert => alert.type === selectedAlertType && !acknowledgedAlerts.has(alert.id));
  };

  const getAlertTypeCount = (type: string) => {
    if (type === 'all') {
      return allAlerts.filter(alert => !acknowledgedAlerts.has(alert.id)).length;
    }
    return allAlerts.filter(alert => alert.type === type && !acknowledgedAlerts.has(alert.id)).length;
  };

  const getUnacknowledgedAlertsCount = () => {
    return allAlerts.filter(alert => !acknowledgedAlerts.has(alert.id)).length;
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    const newAcknowledged = new Set(acknowledgedAlerts);
    newAcknowledged.add(alertId);
    setAcknowledgedAlerts(newAcknowledged);
    
    // Toast bildirimini göster
    setToastMessage('✅ Uyarı başarıyla onaylandı ve çözüldü olarak işaretlendi');
    setShowToast(true);
    
    // 3 saniye sonra toast'ı gizle
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleShowAlertDetail = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowAlertDetail(true);
  };

  const handleCloseAlertDetail = () => {
    setShowAlertDetail(false);
    setSelectedAlert(null);
  };

  const handleExportReport = () => {
    // PDF export için PDFExportService kullan
    import('../utils/pdfExport').then(({ PDFExportService }) => {
      const alertsForExport = allAlerts.map(alert => ({
        ...alert,
        acknowledged: acknowledgedAlerts.has(alert.id)
      }));
      
      PDFExportService.exportAlerts(alertsForExport);
      
      // Başarı bildirimi göster
      setToastMessage('📊 Sistem uyarıları PDF raporu başarıyla oluşturuldu');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    });
  };

  const getDetailedAlertInfo = (alert: Alert) => {
    const details: any = {
      'LABELING_01': {
        technical: 'Motor arızası tespit edildi. Rulman hasarı olasılığı yüksek.',
        impact: 'Üretim hattı %100 durdu. Günlük üretim kaybı: ~2,400 ünite',
        recommendation: 'Motor değişimi gerekiyor. Bakım ekibi çağrılmalı.',
        priority: 'Kritik - Acil müdahale',
        estimatedRepair: '2-4 saat'
      },
      'MOLDING_01': {
        technical: 'Soğutma sistemi verimsizliği. Termostat arızası şüphesi.',
        impact: 'Kalite düşüşü riski. Üretim yavaşlatılması gerekebilir.',
        recommendation: 'Soğutma sistemi kontrolü ve termostat değişimi.',
        priority: 'Yüksek - 2 saat içinde',
        estimatedRepair: '1-2 saat'
      },
      'FILLING_02': {
        technical: 'Planlı bakım rutin prosedürü. Filtre değişimi ve kalibrasyon.',
        impact: 'Geçici durma. Diğer hatlar aktif kalacak.',
        recommendation: 'Mevcut bakım planına devam edilmesi.',
        priority: 'Normal - Planlanmış',
        estimatedRepair: '2 saat'
      }
    };
    
    return details[alert.machine] || {
      technical: 'Teknik detaylar analiz ediliyor...',
      impact: 'Etki analizi yapılıyor...',
      recommendation: 'Çözüm önerileri hazırlanıyor...',
      priority: 'Belirleniyor...',
      estimatedRepair: 'Hesaplanıyor...'
    };
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <Shield className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Sistem Uyarıları
          {alertsCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-pulse">
              {alertsCount}
            </span>
          )}
        </h2>
        <button 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          onClick={handleShowAllAlerts}
        >
          Tümünü Görüntüle
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getAlertBg(alert.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {alert.title}
                  </h3>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {alert.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {alert.machine}
                  </span>
                  <button 
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    onClick={() => handleShowAlertDetail(alert)}
                  >
                    📋 Detay
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hızlı Aksiyonlar */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          ⚡ Hızlı Müdahale
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleEmergencyStop}
            disabled={isEmergencyActive}
            className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              isEmergencyActive 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            <Power className="w-4 h-4" />
            {isEmergencyActive ? '🚨 ACİL DURUM AKTİF' : '🛑 Acil Durdur'}
          </button>
          
          <button 
            onClick={handleMaintenanceRequest}
            disabled={maintenanceRequested}
            className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              maintenanceRequested 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            <Phone className="w-4 h-4" />
            {maintenanceRequested ? '🔧 BAKIM ÇAĞRILDI' : '📞 Bakım Çağır'}
          </button>
        </div>
        
        {(isEmergencyActive || maintenanceRequested) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="font-medium">
                {isEmergencyActive && '🚨 Acil durum protokolü aktif - Güvenlik ekibi müdahale ediyor'}
                {maintenanceRequested && '🔧 Bakım ekibi çağrılıyor - Lütfen bekleyiniz...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Acil Durdurma Paneli */}
      {showEmergencyPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={cancelEmergencyStop}
          />
          
          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-md w-full transform transition-all duration-300 scale-100">
            {!emergencyConfirming ? (
              <>
                {/* Başlık */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <Power className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">⚠️ ACİL DURDUR</h2>
                  <p className="text-gray-600 text-sm">Bu işlem geri alınamaz ve tüm üretim durur!</p>
                </div>

                {/* Uyarı Listesi */}
                <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Sistem Durumu:
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Tüm makineler anında durdurulacak
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Güvenlik protokolü devreye girecek
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Acil müdahale ekibi bilgilendirilecek
                    </li>
                  </ul>
                </div>

                {/* Butonlar */}
                <div className="flex gap-3">
                  <button
                    onClick={cancelEmergencyStop}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    İptal
                  </button>
                  <button
                    onClick={confirmEmergencyStop}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Power className="w-4 h-4" />
                    DURDUR
                  </button>
                </div>
              </>
            ) : (
              /* Onaylama Ekranı */
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <Power className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-4">🚨 ACİL DURDUR AKTİF</h2>
                <p className="text-gray-600 mb-6">Sistem güvenlik protokolü ile durduruluyor...</p>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span>İşlem tamamlanıyor</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bakım Çağrısı Paneli */}
      {showMaintenancePanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={cancelMaintenanceRequest}
          />
          
          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-md w-full transform transition-all duration-300 scale-100">
            {!maintenanceConfirming ? (
              <>
                {/* Başlık */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">🔧 BAKIM ÇAĞRISI</h2>
                  <p className="text-gray-600 text-sm">Bakım ekibi 10-15 dakika içinde hazır olacak</p>
                </div>

                {/* Bakım Bilgileri */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Bakım Ekibi Bilgileri:
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Teknik Ekip: 3 uzman teknisyen
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Varış Süresi: 10-15 dakika
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      7/24 Destek: Aktif
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Öncelik: Yüksek (Üretim Hattı)
                    </li>
                  </ul>
                </div>

                {/* Beklenen İşlemler */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Bakım Süreci:
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-blue-200 rounded"></div>
                      <span>1. Ekip bilgilendirilmesi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-blue-200 rounded"></div>
                      <span>2. Sahaya hareket</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-blue-200 rounded"></div>
                      <span>3. Sistem analizi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-blue-200 rounded"></div>
                      <span>4. Bakım işlemleri</span>
                    </div>
                  </div>
                </div>

                {/* Butonlar */}
                <div className="flex gap-3">
                  <button
                    onClick={cancelMaintenanceRequest}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    İptal
                  </button>
                  <button
                    onClick={confirmMaintenanceRequest}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Phone className="w-4 h-4" />
                    ÇAĞIR
                  </button>
                </div>
              </>
            ) : (
              /* Onaylama Ekranı */
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">📞 BAKIM EKİBİ ÇAĞRILIYOR</h2>
                <p className="text-gray-600 mb-6">Teknik ekip bilgilendiriliyor ve sahaya hareket ediyor...</p>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-3 text-sm text-blue-700">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="font-medium">Bağlantı kuruluyor</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">Ekip ETA: 12 dakika</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tüm Uyarılar Paneli */}
      {showAllAlertsPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseAllAlerts}
          />
          
          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl mx-4 max-w-4xl w-full max-h-[90vh] transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <List className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Tüm Sistem Uyarıları</h2>
                    <p className="text-sm text-gray-600">
                      {getUnacknowledgedAlertsCount()} uyarı • Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseAllAlerts}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Filtreler */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Filtre:</span>
                </div>
                
                <button
                  onClick={() => setSelectedAlertType('all')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                    selectedAlertType === 'all'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tümü ({getUnacknowledgedAlertsCount()})
                </button>
                
                <button
                  onClick={() => setSelectedAlertType('error')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                    selectedAlertType === 'error'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🔴 Hata ({getAlertTypeCount('error')})
                </button>
                
                <button
                  onClick={() => setSelectedAlertType('warning')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                    selectedAlertType === 'warning'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🟡 Uyarı ({getAlertTypeCount('warning')})
                </button>
                
                <button
                  onClick={() => setSelectedAlertType('info')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                    selectedAlertType === 'info'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🔵 Bilgi ({getAlertTypeCount('info')})
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {getFilteredAlerts().map((alert) => (
                  <div
                    key={alert.id}
                    className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-lg ${getAlertBg(alert.type)}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {alert.title}
                          </h3>
                          <span className="text-xs text-gray-500 flex items-center gap-1 bg-white px-2 py-1 rounded-lg">
                            <Clock className="w-3 h-3" />
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {alert.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-white px-2 py-1 rounded border text-gray-700">
                              {alert.machine}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              alert.type === 'error' ? 'bg-red-100 text-red-700' :
                              alert.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {alert.type === 'error' ? 'Kritik' : 
                               alert.type === 'warning' ? 'Uyarı' : 'Bilgi'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                              onClick={() => handleShowAlertDetail(alert)}
                            >
                              📋 Detay
                            </button>
                            <button 
                              className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                                acknowledgedAlerts.has(alert.id)
                                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                              disabled={acknowledgedAlerts.has(alert.id)}
                            >
                              {acknowledgedAlerts.has(alert.id) ? '✅ Çözüldü' : '✅ Onayla'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {getFilteredAlerts().length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Uyarı Bulunamadı</h3>
                  <p className="text-gray-600">Seçili kategoride herhangi bir uyarı bulunmuyor.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 rounded-b-2xl border-t border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Gösterilen: {getFilteredAlerts().length} / {getUnacknowledgedAlertsCount()} uyarı
                </div>
                <div className="flex gap-2">
                  <button 
                    className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={handleExportReport}
                  >
                    📊 Rapor Al
                  </button>
                  <button 
                    onClick={handleCloseAllAlerts}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Bildirimi */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{toastMessage}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Detay Paneli */}
      {showAlertDetail && selectedAlert && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseAlertDetail}
          />
          
          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl mx-4 max-w-2xl w-full max-h-[85vh] overflow-hidden transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedAlert.type === 'error' ? 'bg-red-100' :
                    selectedAlert.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {getAlertIcon(selectedAlert.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedAlert.title}</h2>
                    <p className="text-sm text-gray-600">
                      {selectedAlert.machine} • {selectedAlert.timestamp}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseAlertDetail}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
              {/* Ana Açıklama */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Uyarı Açıklaması
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {selectedAlert.message}
                </p>
              </div>

              {/* Teknik Detaylar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(() => {
                  const details = getDetailedAlertInfo(selectedAlert);
                  return (
                    <>
                      {/* Teknik Analiz */}
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Teknik Analiz
                          </h4>
                          <p className="text-sm text-blue-700">{details.technical}</p>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Etki Analizi
                          </h4>
                          <p className="text-sm text-orange-700">{details.impact}</p>
                        </div>
                      </div>

                      {/* Çözüm ve Öneri */}
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Çözüm Önerisi
                          </h4>
                          <p className="text-sm text-green-700">{details.recommendation}</p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="font-semibold text-purple-800 mb-2">Öncelik Seviyesi</h4>
                          <p className="text-sm text-purple-700 font-medium">{details.priority}</p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Tahmini Onarım Süresi */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tahmini Onarım Süresi
                </h4>
                <p className="text-sm text-gray-700">{getDetailedAlertInfo(selectedAlert).estimatedRepair}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Detay ID: {selectedAlert.id} • Makine: {selectedAlert.machine}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseAlertDetail}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    handleAcknowledgeAlert(selectedAlert.id);
                    handleCloseAlertDetail();
                  }}
                  disabled={acknowledgedAlerts.has(selectedAlert.id)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    acknowledgedAlerts.has(selectedAlert.id)
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {acknowledgedAlerts.has(selectedAlert.id) ? '✅ Çözüldü' : '✅ Onayla & Kapat'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
