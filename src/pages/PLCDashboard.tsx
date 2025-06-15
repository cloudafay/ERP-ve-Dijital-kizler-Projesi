import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface PLCDashboardProps {
  showNavigation?: boolean;
}

const PLCDashboard: React.FC<PLCDashboardProps> = ({ showNavigation = true }) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [plcData, setPLCData] = useState({
    siemens: {
      bottleCount: 15847,
      lineSpeed: 850.5,
      moldTemp: 185.7,
      hydraulicPressure: 180.2,
      emergencyStop: false,
      autoMode: true,
      memoryUsage: 45,
      cpuLoad: 23,
      cycleTime: 10
    },
    allenBradley: {
      conveyorSpeed: 2.5,
      labelCount: 8934,
      rejectCount: 23,
      packagingActive: true,
      memoryUsage: 38,
      cpuLoad: 19,
      cycleTime: 15
    },
    schneider: {
      waterFlow: 125.8,
      phLevel: 7.2,
      chlorineLevel: 0.8,
      filterCleanRequired: false,
      memoryUsage: 52,
      cpuLoad: 31,
      cycleTime: 20
    }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        // Siemens PLC verilerini güncelle
        setPLCData(prev => ({
          ...prev,
          siemens: {
            ...prev.siemens,
            bottleCount: prev.siemens.bottleCount + Math.floor(Math.random() * 3),
            lineSpeed: Math.max(800, Math.min(900, 850.5 + (Math.random() - 0.5) * 20)),
            moldTemp: Math.max(180, Math.min(190, 185.7 + (Math.random() - 0.5) * 2)),
            hydraulicPressure: Math.max(170, Math.min(190, 180.2 + (Math.random() - 0.5) * 5)),
            emergencyStop: Math.random() < 0.001, // %0.1 olasılık
            memoryUsage: Math.max(20, Math.min(90, prev.siemens.memoryUsage + (Math.random() - 0.5) * 3)),
            cpuLoad: Math.max(10, Math.min(80, prev.siemens.cpuLoad + (Math.random() - 0.5) * 5)),
            cycleTime: Math.max(8, Math.min(15, prev.siemens.cycleTime + (Math.random() - 0.5) * 1))
          },
          allenBradley: {
            ...prev.allenBradley,
            conveyorSpeed: Math.max(2.0, Math.min(3.0, 2.5 + (Math.random() - 0.5) * 0.3)),
            labelCount: prev.allenBradley.labelCount + Math.floor(Math.random() * 2),
            rejectCount: prev.allenBradley.rejectCount + (Math.random() < 0.02 ? 1 : 0),
            memoryUsage: Math.max(20, Math.min(90, prev.allenBradley.memoryUsage + (Math.random() - 0.5) * 2)),
            cpuLoad: Math.max(10, Math.min(80, prev.allenBradley.cpuLoad + (Math.random() - 0.5) * 4)),
            cycleTime: Math.max(12, Math.min(20, prev.allenBradley.cycleTime + (Math.random() - 0.5) * 1))
          },
          schneider: {
            ...prev.schneider,
            waterFlow: Math.max(100, Math.min(150, 125.8 + (Math.random() - 0.5) * 10)),
            phLevel: Math.max(6.5, Math.min(8.5, 7.2 + (Math.random() - 0.5) * 0.2)),
            chlorineLevel: Math.max(0.5, Math.min(2.0, 0.8 + (Math.random() - 0.5) * 0.1)),
            filterCleanRequired: Math.random() < 0.01, // %1 olasılık
            memoryUsage: Math.max(20, Math.min(90, prev.schneider.memoryUsage + (Math.random() - 0.5) * 3)),
            cpuLoad: Math.max(10, Math.min(80, prev.schneider.cpuLoad + (Math.random() - 0.5) * 6)),
            cycleTime: Math.max(15, Math.min(25, prev.schneider.cycleTime + (Math.random() - 0.5) * 1))
          }
        }));
      }, 2000); // Her 2 saniyede bir güncelle
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMonitoring]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {showNavigation && (
            <button 
              onClick={() => window.location.href = '/'} 
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors group"
              title="Ana Menüye Dön"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Ana Menü</span>
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔌 PLC & Sensör Yönetimi</h1>
            <p className="text-gray-600 mt-2">Endüstriyel otomasyon sistemleri ve sensör kalibrasyon merkezi</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isMonitoring && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Canlı İzleme Aktif</span>
            </div>
          )}
          {!isMonitoring ? (
            <button 
              onClick={() => setIsMonitoring(true)} 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              ▶️ İzlemeyi Başlat
            </button>
          ) : (
            <button 
              onClick={() => setIsMonitoring(false)} 
              className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              ⏹️ İzlemeyi Durdur
            </button>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam PLC</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="text-3xl">🏭</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Bağlantı</p>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
            <div className="text-3xl">🟢</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Sensör</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="text-3xl">📡</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kalibrasyon Gerekli</p>
              <p className="text-2xl font-bold text-yellow-600">2</p>
            </div>
            <div className="text-3xl">🔧</div>
          </div>
        </div>
      </div>

      {/* PLC Devices */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">🔌 PLC Cihazları</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Siemens PLC */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-2xl">🔷</span>
                  Ana Üretim Hattı PLC
                </h3>
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Bağlı</span>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Model:</span>
                    <p className="font-medium">Siemens S7-1515-2 PN</p>
                  </div>
                  <div>
                    <span className="text-gray-600">IP Adresi:</span>
                    <p className="font-medium">192.168.1.100:102</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Firmware:</span>
                    <p className="font-medium">V2.9.4</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Çevrim Süresi:</span>
                    <p className="font-medium">{plcData.siemens.cycleTime.toFixed(0)}ms</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Bellek Kullanımı</span>
                      <span>{plcData.siemens.memoryUsage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          plcData.siemens.memoryUsage > 80 ? 'bg-red-500' : 
                          plcData.siemens.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${plcData.siemens.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>CPU Yükü</span>
                      <span>{plcData.siemens.cpuLoad.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          plcData.siemens.cpuLoad > 70 ? 'bg-red-500' : 
                          plcData.siemens.cpuLoad > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${plcData.siemens.cpuLoad}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">Aktif Etiketler: 6</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Üretim Sayısı</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Hat Hızı</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Sıcaklık</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">+3 daha</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Allen-Bradley PLC */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-2xl">🔶</span>
                  Paketleme Hattı PLC
                </h3>
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Bağlı</span>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Model:</span>
                    <p className="font-medium">Allen-Bradley CompactLogix 5380</p>
                  </div>
                  <div>
                    <span className="text-gray-600">IP Adresi:</span>
                    <p className="font-medium">192.168.1.101:44818</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Firmware:</span>
                    <p className="font-medium">V33.011</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Çevrim Süresi:</span>
                    <p className="font-medium">{plcData.allenBradley.cycleTime.toFixed(0)}ms</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Bellek Kullanımı</span>
                      <span>{plcData.allenBradley.memoryUsage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          plcData.allenBradley.memoryUsage > 80 ? 'bg-red-500' : 
                          plcData.allenBradley.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${plcData.allenBradley.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>CPU Yükü</span>
                      <span>{plcData.allenBradley.cpuLoad.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          plcData.allenBradley.cpuLoad > 70 ? 'bg-red-500' : 
                          plcData.allenBradley.cpuLoad > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${plcData.allenBradley.cpuLoad}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">Aktif Etiketler: 4</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Konveyör Hızı</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Etiket Sayısı</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">+2 daha</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Schneider PLC */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-2xl">🟢</span>
                  Su Arıtma Sistemi PLC
                </h3>
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Bağlı</span>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Model:</span>
                    <p className="font-medium">Schneider Modicon M580</p>
                  </div>
                  <div>
                    <span className="text-gray-600">IP Adresi:</span>
                    <p className="font-medium">192.168.1.102:502</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Firmware:</span>
                    <p className="font-medium">V3.20</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Çevrim Süresi:</span>
                    <p className="font-medium">{plcData.schneider.cycleTime.toFixed(0)}ms</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Bellek Kullanımı</span>
                      <span>{plcData.schneider.memoryUsage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          plcData.schneider.memoryUsage > 80 ? 'bg-red-500' : 
                          plcData.schneider.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${plcData.schneider.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>CPU Yükü</span>
                      <span>{plcData.schneider.cpuLoad.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          plcData.schneider.cpuLoad > 70 ? 'bg-red-500' : 
                          plcData.schneider.cpuLoad > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${plcData.schneider.cpuLoad}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">Aktif Etiketler: 4</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Su Akışı</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">pH Seviyesi</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">+2 daha</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Calibration */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">🔧 Sensör Kalibrasyonu</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Kalıp Sıcaklık Sensörü #1</h3>
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Kalibre</span>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Mevcut Değer:</span>
                    <p className="font-medium">185.70°C</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Referans:</span>
                    <p className="font-medium">185.00°C</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Sapma:</span>
                    <p className="font-medium text-green-600">0.38%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tip:</span>
                    <p className="font-medium">Temperature</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Son Kalibrasyon:</span>
                    <span>15.01.2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sonraki Kalibrasyon:</span>
                    <span>15.04.2024</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">🤖 Otomatik</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Hidrolik Basınç Sensörü</h3>
                <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Kalibrasyon Gerekli</span>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Mevcut Değer:</span>
                    <p className="font-medium">180.20 bar</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Referans:</span>
                    <p className="font-medium">180.00 bar</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Sapma:</span>
                    <p className="font-medium text-yellow-600">2.11%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tip:</span>
                    <p className="font-medium">Pressure</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Son Kalibrasyon:</span>
                    <span>10.12.2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sonraki Kalibrasyon:</span>
                    <span className="text-red-600 font-medium">10.03.2024</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600 mb-1">Aktif Uyarılar:</p>
                  <div className="text-xs p-2 rounded bg-yellow-50 border border-yellow-200 mb-1">
                    <span className="font-medium">DRIFT_DETECTED:</span> Sensör drift tespit edildi
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">🤖 Otomatik</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">📈 Drift</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">pH Sensörü</h3>
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Kalibre</span>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Mevcut Değer:</span>
                    <p className="font-medium">7.20 pH</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Referans:</span>
                    <p className="font-medium">7.00 pH</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Sapma:</span>
                    <p className="font-medium text-green-600">2.86%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tip:</span>
                    <p className="font-medium">pH</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Son Kalibrasyon:</span>
                    <span>20.01.2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sonraki Kalibrasyon:</span>
                    <span>20.07.2024</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">🤖 Otomatik</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Data Section */}
      {isMonitoring && (
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold">📊 Canlı PLC Verileri</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Siemens PLC Data */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                🔷 Ana Üretim Hattı PLC
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Şişe Üretim Sayısı</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.siemens.bottleCount.toLocaleString('tr-TR')} adet</div>
                  <div className="text-xs text-gray-500 mt-1">DB1.DBD0 • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>
                
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Hat Hızı</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.siemens.lineSpeed.toFixed(1)} şişe/dk</div>
                  <div className="text-xs text-gray-500 mt-1">DB1.DBD4 • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Kalıp Sıcaklığı</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.siemens.moldTemp.toFixed(1)} °C</div>
                  <div className="text-xs text-gray-500 mt-1">DB2.DBD0 • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Hidrolik Basınç</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.siemens.hydraulicPressure.toFixed(1)} bar</div>
                  <div className="text-xs text-gray-500 mt-1">DB2.DBD4 • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>

                <div className={`rounded p-3 ${plcData.siemens.emergencyStop ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Acil Durdurma</span>
                    <span className={`px-2 py-1 text-xs rounded ${plcData.siemens.emergencyStop ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {plcData.siemens.emergencyStop ? 'ALARM' : 'GOOD'}
                    </span>
                  </div>
                  <div className="text-lg font-bold">{plcData.siemens.emergencyStop ? '🚨 Aktif' : '❌ Pasif'}</div>
                  <div className="text-xs text-gray-500 mt-1">M0.0 • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Otomatik Mod</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.siemens.autoMode ? '✅ Aktif' : '❌ Pasif'}</div>
                  <div className="text-xs text-gray-500 mt-1">M0.1 • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>
              </div>
            </div>

            {/* Allen-Bradley PLC Data */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                🔶 Paketleme Hattı PLC
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Konveyör Hızı</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.allenBradley.conveyorSpeed.toFixed(1)} m/s</div>
                  <div className="text-xs text-gray-500 mt-1">PackagingLine:I.Data[0] • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>
                
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Etiket Sayısı</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.allenBradley.labelCount.toLocaleString('tr-TR')} adet</div>
                  <div className="text-xs text-gray-500 mt-1">PackagingLine:I.Data[1] • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Red Edilen Ürün</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.allenBradley.rejectCount} adet</div>
                  <div className="text-xs text-gray-500 mt-1">QualityControl:I.Data[0] • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Paketleme Durumu</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.allenBradley.packagingActive ? '✅ Aktif' : '❌ Pasif'}</div>
                  <div className="text-xs text-gray-500 mt-1">PackagingLine:O.Data[0] • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>
              </div>
            </div>

            {/* Schneider PLC Data */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                🟢 Su Arıtma Sistemi PLC
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Su Akış Hızı</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.schneider.waterFlow.toFixed(1)} L/dk</div>
                  <div className="text-xs text-gray-500 mt-1">%MW100 • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>
                
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">pH Seviyesi</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.schneider.phLevel.toFixed(1)} pH</div>
                  <div className="text-xs text-gray-500 mt-1">%MW102 • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Klor Seviyesi</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GOOD</span>
                  </div>
                  <div className="text-lg font-bold">{plcData.schneider.chlorineLevel.toFixed(1)} ppm</div>
                  <div className="text-xs text-gray-500 mt-1">%MW104 • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>

                <div className={`rounded p-3 ${plcData.schneider.filterCleanRequired ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">Filtre Temizlik</span>
                    <span className={`px-2 py-1 text-xs rounded ${plcData.schneider.filterCleanRequired ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {plcData.schneider.filterCleanRequired ? 'WARNING' : 'GOOD'}
                    </span>
                  </div>
                  <div className="text-lg font-bold">{plcData.schneider.filterCleanRequired ? '🔧 Gerekli' : '❌ Gerekli Değil'}</div>
                  <div className="text-xs text-gray-500 mt-1">%M100 • {new Date().toLocaleTimeString('tr-TR')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PLCDashboard; 