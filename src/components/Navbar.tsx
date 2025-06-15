import React, { useState, useRef, useEffect } from 'react';
import { useDigitalTwinStore } from '../lib/store';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  ChevronDown, 
  Clock, 
  AlertTriangle, 
  Info, 
  List, 
  X, 
  Filter, 
  CheckCircle, 
  FileText,
  Menu,
  Search,
  Maximize2,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, sidebarOpen = false }) => {
  const { alerts, systemStatus } = useDigitalTwinStore();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showAllNotificationsPanel, setShowAllNotificationsPanel] = useState(false);
  const [selectedNotificationType, setSelectedNotificationType] = useState<string>('all');
  const [acknowledgedNotifications, setAcknowledgedNotifications] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadAlertsCount = alerts.filter(alert => !alert.acknowledged && !acknowledgedNotifications.has(alert.id)).length;

  const handleProfileAction = (action: string) => {
    setIsProfileOpen(false);
    
    switch (action) {
      case 'profile':
        window.open('/profile.html', '_blank');
        break;
      case 'settings':
        window.open('/settings.html', '_blank');
        break;
      case 'security':
        window.open('/security.html', '_blank');
        break;
      case 'logout':
        if (confirm('🚪 Çıkış Yapmak İstediğinizden Emin Misiniz?\n\nMevcut oturumunuz sonlandırılacak ve giriş sayfasına yönlendirileceksiniz.')) {
          alert('✅ Güvenli çıkış yapıldı. Tekrar görüşmek üzere!');
        }
        break;
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleShowAllNotifications = () => {
    setIsNotificationOpen(false);
    setShowAllNotificationsPanel(true);
  };

  const handleCloseAllNotifications = () => {
    setShowAllNotificationsPanel(false);
    setSelectedNotificationType('all');
  };

  const handleAcknowledgeNotification = (alertId: string) => {
    const newAcknowledged = new Set(acknowledgedNotifications);
    newAcknowledged.add(alertId);
    setAcknowledgedNotifications(newAcknowledged);
    
    setToastMessage('✅ Bildirim başarıyla onaylandı');
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const getFilteredNotifications = () => {
    const unacknowledgedAlerts = alerts.filter(alert => !acknowledgedNotifications.has(alert.id));
    if (selectedNotificationType === 'all') return unacknowledgedAlerts;
    return unacknowledgedAlerts.filter(alert => alert.type === selectedNotificationType);
  };

  const getNotificationTypeCount = (type: string) => {
    const unacknowledgedAlerts = alerts.filter(alert => !acknowledgedNotifications.has(alert.id));
    if (type === 'all') {
      return unacknowledgedAlerts.length;
    }
    return unacknowledgedAlerts.filter(alert => alert.type === type).length;
  };

  const getUnacknowledgedNotificationsCount = () => {
    return alerts.filter(alert => !acknowledgedNotifications.has(alert.id)).length;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <>
      {/* Modern Navbar */}
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 fixed w-full z-40 top-0">
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-20'}`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* Sol Taraf - Logo ve Menu */}
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={onMenuClick}
                  className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden transition-all duration-200"
                >
                  <Menu className="h-5 w-5" />
                </button>
                
                {/* Logo ve Başlık - Sadece mobilde göster */}
                <div className="flex items-center lg:hidden">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">AquaTech</h1>
                  </div>
                </div>

                {/* Sistem Durumu - Desktop */}
                <div className="hidden lg:flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                    systemStatus.isConnected 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      systemStatus.isConnected ? 'bg-green-500' : 'bg-red-500'
                    } animate-pulse`}></div>
                    <span>{systemStatus.isConnected ? 'Sistem Aktif' : 'Bağlantı Kesildi'}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Son güncelleme: {systemStatus.lastUpdate.toLocaleTimeString('tr-TR')}
                  </div>
                </div>
              </div>

              {/* Orta - Arama (Desktop) */}
              <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Makine, uyarı veya rapor ara..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Sağ Taraf - Aksiyonlar */}
              <div className="flex items-center space-x-2">
                


                {/* Tema Değiştirici */}
                <button 
                  onClick={toggleTheme}
                  className="hidden lg:flex p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                {/* Bildirimler */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={handleNotificationClick}
                    className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadAlertsCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-bold shadow-lg">
                        {unreadAlertsCount > 9 ? '9+' : unreadAlertsCount}
                      </span>
                    )}
                  </button>

                  {/* Bildirim Dropdown */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                                              <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Bell className="h-5 w-5 text-blue-500" />
                          Bildirimler
                          {unreadAlertsCount > 0 && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                              {unreadAlertsCount} yeni
                            </span>
                          )}
                        </h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {alerts.length > 0 ? (
                          alerts.slice(0, 5).map((alert, index) => (
                            <div key={index} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!alert.acknowledged && !acknowledgedNotifications.has(alert.id) ? 'bg-blue-50/50' : ''}`}>
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  alert.type === 'critical' ? 'bg-red-500' : 
                                  alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{alert.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{alert.machineId}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(alert.timestamp).toLocaleString('tr-TR')}
                                  </p>
                                </div>
                                {!alert.acknowledged && !acknowledgedNotifications.has(alert.id) && (
                                  <button
                                    onClick={() => handleAcknowledgeNotification(alert.id)}
                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200 transition-colors flex-shrink-0"
                                  >
                                    Onayla
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p>Henüz bildirim yok</p>
                          </div>
                        )}
                      </div>
                      {alerts.length > 5 && (
                        <div className="p-3 border-t border-gray-100 bg-gray-50">
                          <button 
                            onClick={handleShowAllNotifications}
                            className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            Tüm bildirimleri görüntüle ({alerts.length})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profil */}
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                  >
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Mustafa Yardım</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Operatör</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {/* Profil Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                                              <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Mustafa Yardım</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Sistem Operatörü</p>
                            </div>
                          </div>
                        </div>
                      
                      <div className="py-2">
                        <button 
                          onClick={() => handleProfileAction('profile')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <User className="h-4 w-4 mr-3 text-gray-400" />
                          Profil Ayarları
                        </button>
                        <button 
                          onClick={() => handleProfileAction('settings')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-400" />
                          Sistem Ayarları
                        </button>
                        <button 
                          onClick={() => handleProfileAction('security')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Shield className="h-4 w-4 mr-3 text-gray-400" />
                          Güvenlik
                        </button>
                      </div>
                      
                                              <div className="border-t border-gray-100 dark:border-gray-700">
                        <button 
                          onClick={() => handleProfileAction('logout')}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Toast Bildirimi */}
      {showToast && (
        <div className="fixed top-20 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-in-right">
          {toastMessage}
        </div>
      )}

      {/* Tüm Bildirimler Paneli */}
      {showAllNotificationsPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="h-6 w-6 text-blue-500" />
                  Tüm Bildirimler ({getUnacknowledgedNotificationsCount()})
                </h2>
                <button 
                  onClick={handleCloseAllNotifications}
                  className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Filtre Butonları */}
              <div className="flex items-center gap-2 mt-4">
                <Filter className="h-4 w-4 text-gray-500" />
                <button 
                  onClick={() => setSelectedNotificationType('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedNotificationType === 'all' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tümü ({getNotificationTypeCount('all')})
                </button>
                <button 
                  onClick={() => setSelectedNotificationType('critical')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedNotificationType === 'critical' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Kritik ({getNotificationTypeCount('critical')})
                </button>
                <button 
                  onClick={() => setSelectedNotificationType('warning')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedNotificationType === 'warning' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Uyarı ({getNotificationTypeCount('warning')})
                </button>
                <button 
                  onClick={() => setSelectedNotificationType('info')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedNotificationType === 'info' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Bilgi ({getNotificationTypeCount('info')})
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-96">
              {getFilteredNotifications().length > 0 ? (
                getFilteredNotifications().map((alert, index) => (
                  <div key={index} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${getNotificationBg(alert.type)}`}>
                    <div className="flex items-start gap-4">
                      {getNotificationIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                            <p className="text-sm text-gray-600 mt-1">Makine: {alert.machineId}</p>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.timestamp).toLocaleString('tr-TR')}
                            </p>
                          </div>
                          {!acknowledgedNotifications.has(alert.id) && (
                            <button
                              onClick={() => handleAcknowledgeNotification(alert.id)}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Onayla
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Bu kategoride bildirim yok</p>
                  <p className="text-sm mt-1">Seçili filtrede gösterilecek bildirim bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
