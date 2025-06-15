import React, { useState, useRef, useEffect } from 'react';
import { useDigitalTwinStore } from '../lib/store';
import { 
  BarChart3, 
  Factory, 
  Brain, 
  Router, 
  Zap, 
  AlertTriangle, 
  FileBarChart, 
  Wrench, 
  Settings,
  Home,
  ChevronDown,
  Activity,
  Shield,
  Users,
  Database,
  Cloud,
  Cpu,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Monitor,
  TrendingUp,
  Calendar,
  FileText,
  Star,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
  Globe,
  Wifi,
  Bluetooth,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  HardDrive,
  MemoryStick,
  Gauge,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Moon,
  ChevronUp
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab = 'overview', onTabChange }) => {
  const { alerts, systemStatus, machines } = useDigitalTwinStore();
  const [expandedSections, setExpandedSections] = useState<string[]>(['main', 'management']);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const unreadAlerts = alerts.filter(alert => !alert.acknowledged).length;
  const runningMachines = machines.filter(machine => machine.status === 'running').length;
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical' && !alert.acknowledged).length;

  // Scroll durumunu kontrol et
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setCanScrollUp(scrollTop > 20);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 20);
    }
  };

  // Mouse wheel event handler
  const handleWheel = (e: WheelEvent) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      e.stopPropagation();
      
      const delta = e.deltaY;
      const scrollAmount = Math.abs(delta) > 50 ? delta : delta * 3; // Daha hassas ve hızlı scroll
      
      scrollContainerRef.current.scrollBy({
        top: scrollAmount,
        behavior: 'auto' // Daha responsive için auto kullan
      });
      
      // Scroll pozisyonunu hemen güncelle
      setTimeout(checkScrollPosition, 10);
    }
  };

  // Scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      // Scroll position listener
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      
      // Mouse wheel listener
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
      
      checkScrollPosition(); // İlk kontrol
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
        scrollContainer.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  // Scroll fonksiyonları
  const scrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 200,
        behavior: 'smooth'
      });
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleMenuClick = (tabValue: string) => {
    const mainModules = [
      'overview', 'production', 'ai-dashboard', 'iot-monitor', 
      'plc-dashboard', 'edge-energy', 'cloud-dashboard'
    ];
    
    if (mainModules.includes(tabValue)) {
      if (onTabChange) {
        onTabChange(tabValue);
      }
    } else {
      const managementPages = ['alerts', 'reports', 'maintenance', 'quality', 'users', 'data', 'settings'];
      if (managementPages.includes(tabValue)) {
        const path = tabValue === 'settings' ? '/system-settings' : `/${tabValue}`;
        window.location.href = path;
        return;
      }
    }
    
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const mainMenuItems = [
    { 
      id: 'overview', 
      name: 'Genel Bakış', 
      pageTitle: 'Ana Dashboard',
      icon: Home, 
      count: null,
      description: 'Sistem genel durumu ve KPI\'lar',
      destination: 'Ana Sayfa Sekmesi',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600'
    },
    { 
      id: 'production', 
      name: '3D Dijital İkiz', 
      pageTitle: 'Üretim Simülasyonu',
      icon: Factory, 
      count: runningMachines,
      description: 'Fabrika 3D görselleştirme',
      destination: 'Üretim Sekmesi',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600'
    },

    { 
      id: 'ai-dashboard', 
      name: 'AI Analizi', 
      pageTitle: 'Yapay Zeka Dashboard',
      icon: Brain, 
      count: null,
      description: 'Makine öğrenmesi ve tahminler',
      destination: 'AI Analiz Sekmesi',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600'
    },
    { 
      id: 'iot-monitor', 
      name: 'IoT İzleme', 
      pageTitle: 'Sensör Ağı Yönetimi',
      icon: Router, 
      count: machines.length,
      description: 'Bağlı cihaz ve sensör takibi',
      destination: 'IoT Monitoring Sekmesi',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600'
    },
    { 
      id: 'plc-dashboard', 
      name: 'PLC & Kontrol', 
      pageTitle: 'Endüstriyel Kontrol Sistemi',
      icon: Cpu, 
      count: null,
      description: 'PLC sistemleri ve otomasyon',
      destination: 'PLC Dashboard Sekmesi',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-indigo-600'
    },
    { 
      id: 'edge-energy', 
      name: 'Edge & Enerji', 
      pageTitle: 'Enerji Yönetim Sistemi',
      icon: Zap, 
      count: null,
      description: 'Edge computing ve enerji analizi',
      destination: 'Enerji Dashboard Sekmesi',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-yellow-600'
    },
    { 
      id: 'cloud-dashboard', 
      name: 'Bulut Platform', 
      pageTitle: 'Merkezi Bulut Yönetimi',
      icon: Cloud, 
      count: null,
      description: 'Bulut tabanlı analiz ve raporlama',
      destination: 'Cloud Dashboard Sekmesi',
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      gradientFrom: 'from-sky-500',
      gradientTo: 'to-sky-600'
    }
  ];

  const managementItems = [
    { 
      id: 'alerts', 
      name: 'Sistem Uyarıları', 
      pageTitle: 'Uyarı ve Bildirim Merkezi',
      icon: AlertTriangle, 
      count: unreadAlerts,
      description: 'Kritik sistem bildirimleri',
      destination: '/alerts',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-red-600'
    },
    { 
      id: 'reports', 
      name: 'Raporlar', 
      pageTitle: 'Analitik Rapor Merkezi',
      icon: FileBarChart, 
      count: null,
      description: 'Detaylı performans raporları',
      destination: '/reports',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-indigo-600'
    },
    { 
      id: 'maintenance', 
      name: 'Bakım Yönetimi', 
      pageTitle: 'Preventif Bakım Sistemi',
      icon: Wrench, 
      count: null,
      description: 'Bakım planlaması ve takibi',
      destination: '/maintenance',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600'
    },
    { 
      id: 'quality', 
      name: 'Kalite Kontrol', 
      pageTitle: 'Kalite Güvence Sistemi',
      icon: Shield, 
      count: null,
      description: 'Kalite standartları ve kontrol',
      destination: '/quality',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-emerald-600'
    },
    { 
      id: 'users', 
      name: 'Kullanıcı Yönetimi', 
      pageTitle: 'Kullanıcı ve Yetki Yönetimi',
      icon: Users, 
      count: systemStatus.activeUsers,
      description: 'Kullanıcı hesapları ve izinler',
      destination: '/users',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-pink-600'
    },
    { 
      id: 'data', 
      name: 'Veri Yönetimi', 
      pageTitle: 'Veri Depolama ve Arşiv',
      icon: Database, 
      count: null,
      description: 'Veri yedekleme ve arşivleme',
      destination: '/data',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      gradientFrom: 'from-cyan-500',
      gradientTo: 'to-cyan-600'
    },
    { 
      id: 'settings', 
      name: 'Sistem Ayarları', 
      pageTitle: 'Sistem Konfigürasyonu',
      icon: Settings, 
      count: null,
      description: 'Genel sistem ayarları',
      destination: '/system-settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      gradientFrom: 'from-gray-500',
      gradientTo: 'to-gray-600'
    }
  ];



  // Dinamik genişlik hesaplama
  const shouldExpand = isOpen || isHovered;
  const sidebarWidth = shouldExpand ? 'w-96' : 'w-20';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
            <div
        className={`
          fixed top-0 left-0 h-screen bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 dark:border-gray-700/50 z-40 
          transition-all duration-700 ease-out group flex flex-col
          ${sidebarWidth}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Header */}
        <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm">
          {shouldExpand && (
            <div className={`flex items-center gap-4 transition-all duration-500 ${shouldExpand ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-xl">
                  <Factory className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">AquaTech</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Dijital İkiz Platformu</p>
              </div>
            </div>
          )}
          
          {!shouldExpand && (
            <div className="w-full flex justify-center">
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-xl">
                  <Factory className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </div>
          )}
        </div>



        {/* Scrollable Content Area */}
        <div className="flex-1 relative min-h-0">
          {/* Scroll Indicators */}
          {/* Üst scroll göstergesi */}
          {canScrollUp && (
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/90 dark:from-gray-900/90 to-transparent z-10 flex items-center justify-center">
              <button
                onClick={scrollUp}
                className="p-1 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 group"
                title="Yukarı kaydır"
              >
                <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>
            </div>
          )}

          {/* Alt scroll göstergesi */}
          {canScrollDown && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 dark:from-gray-900/90 to-transparent z-10 flex items-center justify-center">
              <button
                onClick={scrollDown}
                className="p-1 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 group"
                title="Aşağı kaydır"
              >
                <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>
            </div>
          )}

          {/* Navigation */}
          <div 
            ref={scrollContainerRef}
            className="h-full overflow-y-auto py-6 px-4 bg-gradient-to-b from-gray-50/20 to-white/50 custom-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
          >
            
            {/* Ana Modüller */}
            <div className="mb-8">
              {shouldExpand && (
                <div className={`flex items-center justify-between mb-5 px-2 transition-all duration-500 ${shouldExpand ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Ana Modüller
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleSection('main')}
                    className="p-2 hover:bg-white/60 rounded-xl transition-all duration-200"
                  >
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                      expandedSections.includes('main') ? 'rotate-180' : ''
                    }`} />
                  </button>
                </div>
              )}
              
              {(expandedSections.includes('main') || !shouldExpand) && (
                <div className="space-y-3">
                  {mainMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isItemHovered = hoveredItem === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`
                          w-full group relative overflow-hidden rounded-2xl transition-all duration-700 
                          hover:scale-[1.02] hover:shadow-xl transform-gpu
                          ${isActive 
                            ? `bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} text-white shadow-2xl scale-[1.02]` 
                            : 'text-gray-700 hover:bg-white/80 hover:shadow-lg'
                          }
                        `}
                        style={{
                          transitionDelay: shouldExpand ? `${index * 50}ms` : '0ms'
                        }}
                      >
                        {/* Animated background */}
                        {(isActive || isItemHovered) && (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-50">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                          </div>
                        )}
                        
                        <div className="relative flex items-center gap-4 px-5 py-4">
                          <div className={`
                            flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300
                            ${isActive 
                              ? 'bg-white/25 text-white shadow-inner backdrop-blur-sm' 
                              : 'bg-gray-100 text-gray-600 group-hover:bg-white group-hover:scale-110 group-hover:shadow-lg'
                            }
                          `}>
                            <Icon className="h-6 w-6" />
                          </div>
                          
                          {shouldExpand && (
                            <div className={`flex-1 min-w-0 text-left transition-all duration-500 ${
                              shouldExpand ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-bold text-base truncate">
                                  {item.name}
                                </div>
                                {item.count !== null && (
                                  <span className={`
                                    px-3 py-1 text-xs font-bold rounded-full
                                    ${isActive 
                                      ? 'bg-white/30 text-white backdrop-blur-sm' 
                                      : 'bg-gray-200 text-gray-700'
                                    }
                                  `}>
                                    {item.count}
                                  </span>
                                )}
                              </div>
                              <div className={`text-sm mb-2 truncate ${
                                isActive ? 'text-white/90' : 'text-gray-600'
                              }`}>
                                {item.pageTitle}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className={`text-xs truncate ${
                                  isActive ? 'text-white/70' : 'text-gray-500'
                                }`}>
                                  → {item.destination}
                                </div>
                                <ArrowRight className={`h-4 w-4 transition-all duration-300 ${
                                  isActive ? 'text-white/60' : 'text-gray-400'
                                } ${isItemHovered ? 'translate-x-1' : ''}`} />
                              </div>
                            </div>
                          )}
                          
                          {!shouldExpand && item.count !== null && (
                            <span className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                              {item.count > 9 ? '9+' : item.count}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Yönetim Paneli */}
            <div>
              {shouldExpand && (
                <div className={`flex items-center justify-between mb-5 px-2 transition-all duration-500 delay-300 ${shouldExpand ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg"></div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Yönetim Paneli
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleSection('management')}
                    className="p-2 hover:bg-white/60 rounded-xl transition-all duration-200"
                  >
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                      expandedSections.includes('management') ? 'rotate-180' : ''
                    }`} />
                  </button>
                </div>
              )}
              
              {(expandedSections.includes('management') || !shouldExpand) && (
                <div className="space-y-3">
                  {managementItems.map((item, index) => {
                    const Icon = item.icon;
                    const isItemHovered = hoveredItem === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="w-full group relative overflow-hidden rounded-2xl transition-all duration-700 hover:scale-[1.02] hover:shadow-xl text-gray-700 hover:bg-white/80 transform-gpu"
                        style={{
                          transitionDelay: shouldExpand ? `${(index + mainMenuItems.length) * 50}ms` : '0ms'
                        }}
                      >
                        {isItemHovered && (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 opacity-50">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                          </div>
                        )}
                        
                        <div className="relative flex items-center gap-4 px-5 py-4">
                          <div className="flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center bg-gray-100 text-gray-600 group-hover:bg-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                            <Icon className="h-6 w-6" />
                          </div>
                          
                          {shouldExpand && (
                            <div className={`flex-1 min-w-0 text-left transition-all duration-500 delay-200 ${
                              shouldExpand ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-bold text-base truncate">
                                  {item.name}
                                </div>
                                {item.count !== null && item.count > 0 && (
                                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-600">
                                    {item.count}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 mb-2 truncate">
                                {item.pageTitle}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500 truncate">
                                  → {item.destination}
                                </div>
                                <ExternalLink className={`h-4 w-4 text-gray-400 transition-all duration-300 ${
                                  isItemHovered ? 'translate-x-1' : ''
                                }`} />
                              </div>
                            </div>
                          )}
                          
                          {!shouldExpand && item.count !== null && item.count > 0 && (
                            <span className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                              {item.count > 9 ? '9+' : item.count}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>



        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200/50 p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
          {shouldExpand ? (
            <div className={`space-y-4 transition-all duration-500 delay-500 ${shouldExpand ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm">
                <div className={`w-4 h-4 rounded-full ${
                  systemStatus.isConnected ? 'bg-green-500' : 'bg-red-500'
                } animate-pulse shadow-lg`}></div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900">
                    {systemStatus.isConnected ? 'Sistem Aktif' : 'Bağlantı Kesildi'}
                  </div>
                  <div className="text-xs text-gray-600">
                    Durum: {systemStatus.isConnected ? 'Online' : 'Offline'} • {systemStatus.activeUsers} kullanıcı
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 font-bold">
                  AquaTech Digital Twin v2.1.0
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  © {new Date().getFullYear()} - Endüstri 4.0 Çözümleri
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className={`w-5 h-5 rounded-full ${
                systemStatus.isConnected ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse shadow-lg`}></div>
              <div className="text-xs text-gray-500 font-bold text-center">
                v2.1
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
