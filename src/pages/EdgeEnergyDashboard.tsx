import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, Zap, Cloud, CloudOff, Activity, TrendingUp, AlertTriangle, CheckCircle, Battery, Cpu, HardDrive, Thermometer } from 'lucide-react';
import EdgeComputingService from '../services/edgeComputing';
import EnergyMonitoringService from '../services/energyMonitoring';

interface EdgeEnergyDashboardProps {
  showNavigation?: boolean;
}

const EdgeEnergyDashboard: React.FC<EdgeEnergyDashboardProps> = ({ showNavigation = true }) => {
  const [activeTab, setActiveTab] = useState<'edge' | 'energy'>('edge');
  const [edgeData, setEdgeData] = useState<any>(null);
  const [energyData, setEnergyData] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    const edgeService = EdgeComputingService.getInstance();
    const energyService = EnergyMonitoringService.getInstance();

    const handleEdgeData = (data: any) => setEdgeData(data);
    const handleEnergyData = (data: any) => setEnergyData(data);

    if (isMonitoring) {
      // İlk veri yüklemesi - hemen başlat
      const initialEdgeData = edgeService.getCurrentData();
      const initialEnergyData = energyService.getCurrentData();
      
      setEdgeData(initialEdgeData);
      setEnergyData(initialEnergyData);

      // Subscription'ları başlat
      edgeService.subscribe(handleEdgeData);
      energyService.subscribe(handleEnergyData);

      // Periyodik güncelleme için interval
      const interval = setInterval(() => {
        const currentEdgeData = edgeService.getCurrentData();
        const currentEnergyData = energyService.getCurrentData();
        
        setEdgeData(currentEdgeData);
        setEnergyData(currentEnergyData);
      }, 2000); // Her 2 saniyede bir güncelle

      return () => {
        clearInterval(interval);
        edgeService.unsubscribe(handleEdgeData);
        energyService.unsubscribe(handleEnergyData);
      };
    }
  }, [isMonitoring]);

  const getDeviceIcon = (deviceType: string) => {
    const icons = {
      motor: '⚙️',
      compressor: '🔧',
      heater: '🔥',
      cooling: '❄️',
      conveyor: '📦',
      pump: '💧',
      lighting: '💡'
    };
    return icons[deviceType] || '⚡';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      online: 'text-green-600 bg-green-100',
      offline: 'text-red-600 bg-red-100',
      processing: 'text-blue-600 bg-blue-100',
      active: 'text-green-600 bg-green-100',
      idle: 'text-yellow-600 bg-yellow-100',
      maintenance: 'text-orange-600 bg-orange-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'border-blue-200 bg-blue-50',
      medium: 'border-yellow-200 bg-yellow-50',
      high: 'border-orange-200 bg-orange-50',
      critical: 'border-red-200 bg-red-50'
    };
    return colors[severity] || 'border-gray-200 bg-gray-50';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
            <h1 className="text-3xl font-bold text-gray-900">🌐 Edge Computing & Enerji İzleme</h1>
            <p className="text-gray-600 mt-2">Modern endüstriyel IoT ve akıllı enerji yönetimi sistemi</p>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              İzlemeyi Başlat
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

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('edge')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'edge'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Edge Computing
            </div>
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'energy'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Enerji İzleme
            </div>
          </button>
        </nav>
      </div>

      {/* Edge Computing Tab */}
      {activeTab === 'edge' && (
        <div className="space-y-6">
          {/* Edge Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Edge Cihazları</p>
                  <p className="text-2xl font-bold">{edgeData?.edgeDevices?.length || 3}</p>
                </div>
                <Cloud className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bulut Bağlantısı</p>
                  <p className={`text-2xl font-bold ${edgeData?.cloudConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {edgeData?.cloudConnected ? 'Aktif' : 'Kesildi'}
                  </p>
                </div>
                {edgeData?.cloudConnected ? 
                  <Cloud className="w-8 h-8 text-green-500" /> : 
                  <CloudOff className="w-8 h-8 text-red-500" />
                }
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Yerel Analizler</p>
                  <p className="text-2xl font-bold text-blue-600">{edgeData?.localAnalyses?.length || 0}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Kritik Uyarılar</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {edgeData?.localAnalyses?.filter(a => a.criticalAlert)?.length || 0}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Modern Senaryo Açıklaması */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🚀 Modern Senaryo: Edge Computing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">📡 Yerel Veri İşleme</h4>
                <p>Fabrikada internet bağlantısı kesilse bile, edge cihazları kritik analizleri yerel olarak yapmaya devam eder. AI algoritmaları anomali tespiti ve tahmine dayalı bakım analizlerini kesintisiz sürdürür.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">🧠 Akıllı Senkronizasyon</h4>
                <p>Bağlantı geri geldiğinde, tüm yerel analizler ve veriler otomatik olarak buluta senkronize edilir. Hiçbir kritik bilgi kaybolmaz ve merkezi sistem güncel kalır.</p>
              </div>
            </div>
          </div>

          {/* Edge Devices */}
          {edgeData?.edgeDevices && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  Edge Computing Cihazları
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {edgeData.edgeDevices.map((device: any) => (
                    <div key={device.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{device.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(device.status)}`}>
                          {device.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                          📍 {device.location}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>CPU</span>
                              <span>{device.cpuUsage?.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  device.cpuUsage > 80 ? 'bg-red-500' : 
                                  device.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`} 
                                style={{ width: `${device.cpuUsage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Bellek</span>
                              <span>{device.memoryUsage?.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  device.memoryUsage > 80 ? 'bg-red-500' : 
                                  device.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`} 
                                style={{ width: `${device.memoryUsage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span>Sıcaklık:</span>
                          <span className={`font-medium ${device.temperature > 50 ? 'text-red-600' : 'text-green-600'}`}>
                            {device.temperature?.toFixed(1)}°C
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span>Son Senkronizasyon:</span>
                          <span className="text-gray-500">
                            {device.lastSync ? new Date(device.lastSync).toLocaleTimeString('tr-TR') : 'N/A'}
                          </span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          {device.cloudConnected ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                              <Cloud className="w-3 h-3" />
                              Bulut Bağlı
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded flex items-center gap-1">
                              <CloudOff className="w-3 h-3" />
                              Yerel Mod
                            </span>
                          )}
                          {device.localProcessingActive && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              🧠 AI Aktif
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Local Analyses */}
          {edgeData?.localAnalyses && edgeData.localAnalyses.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Yerel AI Analizleri
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {edgeData.localAnalyses.slice(0, 5).map((analysis: any) => (
                    <div key={analysis.id} className={`border rounded-lg p-4 ${getSeverityColor(analysis.result?.severity || 'low')}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">
                              {analysis.analysisType === 'anomaly_detection' ? '🔍 Anomali Tespiti' :
                               analysis.analysisType === 'predictive_maintenance' ? '🔧 Tahmine Dayalı Bakım' :
                               analysis.analysisType === 'quality_control' ? '✅ Kalite Kontrol' :
                               '⚡ Enerji Optimizasyonu'}
                            </span>
                            <span className="text-xs text-gray-500">
                              Güven: %{analysis.confidence?.toFixed(0)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {analysis.result?.recommendation || 'Analiz tamamlandı'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{new Date(analysis.timestamp).toLocaleString('tr-TR')}</span>
                            {analysis.syncedToCloud ? (
                              <span className="text-green-600">✅ Buluta senkronize</span>
                            ) : (
                              <span className="text-orange-600">⏳ Senkronizasyon bekliyor</span>
                            )}
                          </div>
                        </div>
                        {analysis.criticalAlert && (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Energy Monitoring Tab */}
      {activeTab === 'energy' && (
        <div className="space-y-6">
          {/* Modern Senaryo Açıklaması */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3">⚡ Modern Senaryo: Akıllı Enerji Yönetimi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
              <div>
                <h4 className="font-medium mb-2">📊 Gerçek Zamanlı İzleme</h4>
                <p>IoT sensörleri ile tüm ekipmanların enerji tüketimi, verimlilik ve karbon ayak izi anlık olarak izlenir. Puant saatlerde otomatik optimizasyon devreye girer.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">🎯 Akıllı Optimizasyon</h4>
                <p>AI algoritmaları enerji tüketim paternlerini analiz ederek yük dengeleme, puant saatlerde tüketim azaltma ve verimlilik iyileştirme önerileri sunar.</p>
              </div>
            </div>
          </div>

          {/* Energy Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Toplam Güç</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {energyData?.totalPowerConsumption?.toFixed(1) || '0'} kW
                  </p>
                </div>
                <Zap className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ortalama Verim</p>
                  <p className="text-2xl font-bold text-green-600">
                    %{energyData?.averageEfficiency?.toFixed(1) || '0'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Karbon Ayak İzi</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {energyData?.totalCarbonFootprint?.toFixed(0) || '0'} kg CO₂
                  </p>
                </div>
                <div className="text-2xl">🌱</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aylık Maliyet</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₺{energyData?.estimatedMonthlyCost?.toFixed(0) || '0'}
                  </p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </div>
          </div>

          {/* Current Tariff */}
          {energyData?.currentTariff && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Mevcut Tarife</h3>
                  <p className="text-gray-600">{energyData.currentTariff.timeSlot}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ₺{energyData.currentTariff.rate}/kWh
                  </p>
                  <p className="text-sm text-gray-500">
                    {energyData.currentTariff.startHour}:00 - {energyData.currentTariff.endHour}:00
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Energy Devices */}
          {energyData?.energyDevices && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Battery className="w-5 h-5" />
                  Enerji Tüketen Cihazlar
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {energyData.energyDevices.map((device: any) => (
                    <div key={device.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <span className="text-2xl">{getDeviceIcon(device.deviceType)}</span>
                          {device.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(device.status)}`}>
                          {device.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Güç:</span>
                            <p className="font-medium">{device.currentPower?.toFixed(1)} kW</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Verim:</span>
                            <p className={`font-medium ${device.efficiency > 85 ? 'text-green-600' : 'text-orange-600'}`}>
                              %{device.efficiency?.toFixed(1)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Sıcaklık:</span>
                            <p className={`font-medium ${device.temperature > 80 ? 'text-red-600' : 'text-green-600'}`}>
                              {device.temperature?.toFixed(1)}°C
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Güç Faktörü:</span>
                            <p className={`font-medium ${device.powerFactor < 0.8 ? 'text-red-600' : 'text-green-600'}`}>
                              {device.powerFactor?.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Toplam Tüketim:</span>
                            <span>{device.totalEnergyConsumed?.toFixed(1)} kWh</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Karbon Ayak İzi:</span>
                            <span>{device.carbonFootprint?.toFixed(1)} kg CO₂</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Çalışma Saati:</span>
                            <span>{device.operatingHours?.toFixed(0)} saat</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Energy Alerts */}
          {energyData?.energyAlerts && energyData.energyAlerts.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Enerji Uyarıları
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {energyData.energyAlerts.slice(0, 5).map((alert: any) => (
                    <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{alert.message}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{alert.recommendation}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{new Date(alert.timestamp).toLocaleString('tr-TR')}</span>
                            <span>Potansiyel Tasarruf: {alert.potentialSavings?.toFixed(0)} kWh/gün</span>
                          </div>
                        </div>
                        {!alert.acknowledged && (
                          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                            Onayla
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Energy Optimizations */}
          {energyData?.optimizations && energyData.optimizations.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Optimizasyon Önerileri
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {energyData.optimizations.slice(0, 3).map((optimization: any) => (
                    <div key={optimization.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{optimization.description}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              optimization.priority === 'high' ? 'bg-red-100 text-red-700' :
                              optimization.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {optimization.priority.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Tasarruf:</span>
                              <p className="font-medium text-green-600">{optimization.estimatedSavings} kWh/ay</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Maliyet Tasarrufu:</span>
                              <p className="font-medium text-green-600">₺{optimization.costSavings}/ay</p>
                            </div>
                            <div>
                              <span className="text-gray-600">CO₂ Azaltım:</span>
                              <p className="font-medium text-green-600">{optimization.co2Reduction} kg/ay</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Geri Ödeme:</span>
                              <p className="font-medium">{optimization.paybackPeriod} ay</p>
                            </div>
                          </div>
                        </div>
                        {optimization.status === 'proposed' && (
                          <button className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                            Onayla
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EdgeEnergyDashboard; 