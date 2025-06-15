import React, { useState, useEffect } from 'react';
import { Radio, Database, Activity, Wifi, WifiOff, Battery, Signal, AlertCircle, CheckCircle, Clock, TrendingUp, MessageSquare, Layers, Filter } from 'lucide-react';
import MQTTDataStreamService from '../services/mqttDataStream';

const DataStreamPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'topics' | 'messages' | 'analytics'>('overview');
  const [mqttData, setMqttData] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [messageFilter, setMessageFilter] = useState<string>('all');

  useEffect(() => {
    const mqttService = MQTTDataStreamService.getInstance();

    const handleMqttData = () => {
      setMqttData({
        brokerStats: mqttService.getBrokerStats(),
        streamMetrics: mqttService.getStreamMetrics(),
        devices: mqttService.getDevices(),
        topics: mqttService.getTopics(),
        recentMessages: mqttService.getRecentMessages(selectedTopic, 50),
        dataQuality: mqttService.getDataQualityReport(),
        isConnected: mqttService.isConnectedToBroker()
      });
    };

    if (isMonitoring) {
      // İlk veri yüklemesi
      handleMqttData();
      
      // Periyodik güncelleme
      const interval = setInterval(handleMqttData, 2000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, selectedTopic]);

  const getDeviceIcon = (deviceType: string) => {
    const icons = {
      sensor: '📡',
      plc: '🔧',
      gateway: '🌐',
      actuator: '⚙️',
      camera: '📷'
    };
    return icons[deviceType] || '📱';
  };

  const getConnectionQualityColor = (quality: string) => {
    const colors = {
      excellent: 'text-green-600 bg-green-100',
      good: 'text-blue-600 bg-blue-100',
      poor: 'text-yellow-600 bg-yellow-100',
      disconnected: 'text-red-600 bg-red-100'
    };
    return colors[quality] || 'text-gray-600 bg-gray-100';
  };

  const getMessageTypeColor = (messageType: string) => {
    const colors = {
      sensor_data: 'text-blue-600 bg-blue-100',
      alarm: 'text-red-600 bg-red-100',
      status: 'text-green-600 bg-green-100',
      command: 'text-purple-600 bg-purple-100',
      heartbeat: 'text-gray-600 bg-gray-100'
    };
    return colors[messageType] || 'text-gray-600 bg-gray-100';
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}s ${minutes}d`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="w-6 h-6" />
            MQTT Veri Akışı İzleme
          </h2>
          <p className="text-gray-600 mt-1">Gerçek zamanlı IoT veri toplama ve dağıtım sistemi</p>
        </div>
        <div className="flex items-center gap-3">
          {isMonitoring && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Canlı İzleme Aktif</span>
            </div>
          )}
          {mqttData?.isConnected !== undefined && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              mqttData.isConnected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              {mqttData.isConnected ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
              <span className={`text-sm font-medium ${mqttData.isConnected ? 'text-green-700' : 'text-red-700'}`}>
                MQTT {mqttData.isConnected ? 'Bağlı' : 'Bağlantı Kesildi'}
              </span>
            </div>
          )}
          {!isMonitoring ? (
            <button 
              onClick={() => setIsMonitoring(true)} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
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

      {/* Modern Senaryo Açıklaması */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">🚀 Modern Senaryo: MQTT Veri Akışı</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">📡 Gerçek Zamanlı Veri Toplama</h4>
            <p>Fabrikadaki 6 farklı IoT cihazından MQTT protokolü ile saniyede onlarca veri noktası toplanır. Sıcaklık, basınç, kalite kontrol ve PLC verilerinin tümü merkezi broker üzerinden dağıtılır.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">🔄 Akıllı Veri Yönetimi</h4>
            <p>QoS seviyeleri, veri sıkıştırma ve otomatik yeniden bağlanma özellikleri ile %99.9 veri güvenilirliği sağlanır. Ağ kesintilerinde bile veri kaybı minimum seviyede tutulur.</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Genel Bakış', icon: Activity },
            { id: 'devices', name: 'Cihazlar', icon: Radio },
            { id: 'topics', name: 'Topic\'ler', icon: Layers },
            { id: 'messages', name: 'Mesajlar', icon: MessageSquare },
            { id: 'analytics', name: 'Analitik', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && mqttData && (
        <div className="space-y-6">
          {/* Broker Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aktif Bağlantılar</p>
                  <p className="text-2xl font-bold text-green-600">{mqttData.brokerStats.activeConnections}</p>
                  <p className="text-xs text-gray-500">/ {mqttData.brokerStats.totalConnections} toplam</p>
                </div>
                <Wifi className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mesaj/Saniye</p>
                  <p className="text-2xl font-bold text-blue-600">{mqttData.brokerStats.messagesPerSecond}</p>
                  <p className="text-xs text-gray-500">{mqttData.brokerStats.totalMessages.toLocaleString()} toplam</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aktif Topic</p>
                  <p className="text-2xl font-bold text-purple-600">{mqttData.brokerStats.activeTopics}</p>
                  <p className="text-xs text-gray-500">/ {mqttData.brokerStats.totalTopics} toplam</p>
                </div>
                <Layers className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Veri Hacmi</p>
                  <p className="text-2xl font-bold text-orange-600">{mqttData.brokerStats.dataVolume.toFixed(1)} MB</p>
                  <p className="text-xs text-gray-500">Uptime: {formatUptime(mqttData.brokerStats.uptime)}</p>
                </div>
                <Database className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Stream Metrics */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Veri Akışı Metrikleri
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{mqttData.streamMetrics.averageLatency.toFixed(1)}ms</div>
                  <div className="text-sm text-gray-600">Ortalama Gecikme</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(100, mqttData.streamMetrics.averageLatency)}%` }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">%{(100 - mqttData.streamMetrics.dataLossPercentage).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Veri Başarı Oranı</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: `${100 - mqttData.streamMetrics.dataLossPercentage}%` }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{mqttData.streamMetrics.compressionRatio.toFixed(1)}x</div>
                  <div className="text-sm text-gray-600">Sıkıştırma Oranı</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: `${Math.min(100, mqttData.streamMetrics.compressionRatio * 20)}%` }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{mqttData.streamMetrics.bandwidthUsage.toFixed(1)} Mbps</div>
                  <div className="text-sm text-gray-600">Bant Genişliği</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full bg-orange-500" style={{ width: `${Math.min(100, mqttData.streamMetrics.bandwidthUsage * 10)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Device Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Cihaz Durumu Özeti
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {mqttData.devices.slice(0, 6).map((device: any) => (
                  <div key={device.deviceId} className="text-center p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">{getDeviceIcon(device.deviceType)}</div>
                    <div className="text-sm font-medium text-gray-800 mb-1">{device.deviceName.split(' ')[0]}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getConnectionQualityColor(device.connectionQuality)}`}>
                      {device.isOnline ? 'Online' : 'Offline'}
                    </div>
                    {device.batteryLevel !== undefined && (
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Battery className={`w-3 h-3 ${device.batteryLevel > 20 ? 'text-green-600' : 'text-red-600'}`} />
                        <span className="text-xs">{device.batteryLevel.toFixed(0)}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diğer tab'lar için basit görünümler */}
      {activeTab === 'devices' && mqttData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">IoT Cihazları ({mqttData.devices.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mqttData.devices.slice(0, 4).map((device: any) => (
              <div key={device.deviceId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <span>{getDeviceIcon(device.deviceType)}</span>
                    {device.deviceName}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getConnectionQualityColor(device.connectionQuality)}`}>
                    {device.connectionQuality}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">📍 {device.location}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Gönderilen: {device.messagesSent.toLocaleString()}</div>
                  <div>Alınan: {device.messagesReceived.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'topics' && mqttData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">MQTT Topic'leri ({mqttData.topics.length})</h3>
          <div className="space-y-3">
            {mqttData.topics.slice(0, 6).map((topic: any) => (
              <div key={topic.topic} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-sm text-blue-600">{topic.topic}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${topic.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {topic.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Mesaj: {topic.messageCount.toLocaleString()}</span>
                  <span>Subscriber: {topic.subscribers}</span>
                  <span>Frekans: {topic.updateFrequency === 0 ? 'Event-based' : `${topic.updateFrequency}s`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'messages' && mqttData && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Canlı Mesajlar</h3>
            <select
              value={messageFilter}
              onChange={(e) => setMessageFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">Tüm Mesajlar</option>
              <option value="sensor_data">Sensör Verileri</option>
              <option value="alarm">Alarmlar</option>
              <option value="status">Durum</option>
            </select>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mqttData.recentMessages
              .filter((msg: any) => messageFilter === 'all' || msg.messageType === messageFilter)
              .slice(0, 10)
              .map((message: any) => (
              <div key={message.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getMessageTypeColor(message.messageType)}`}>
                      {message.messageType}
                    </span>
                    <span className="font-mono text-sm text-blue-600">{message.topic}</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString('tr-TR')}</span>
                </div>
                <div className="bg-gray-50 rounded p-2 font-mono text-xs">
                  {JSON.stringify(message.payload, null, 2).substring(0, 200)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && mqttData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Veri Kalitesi Analizi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Cihaz Sağlığı</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Online Cihazlar:</span>
                  <span className="font-bold text-green-600">{mqttData.dataQuality.deviceHealth.online}/{mqttData.dataQuality.deviceHealth.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mükemmel Bağlantı:</span>
                  <span className="font-bold text-green-600">{mqttData.dataQuality.deviceHealth.excellent}</span>
                </div>
                <div className="flex justify-between">
                  <span>Düşük Batarya:</span>
                  <span className="font-bold text-red-600">{mqttData.dataQuality.deviceHealth.lowBattery}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Topic Aktivitesi</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Aktif Topic:</span>
                  <span className="font-bold text-green-600">{mqttData.dataQuality.topicActivity.active}/{mqttData.dataQuality.topicActivity.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Yüksek Frekans:</span>
                  <span className="font-bold text-red-600">{mqttData.dataQuality.topicActivity.highFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Düşük Frekans:</span>
                  <span className="font-bold text-green-600">{mqttData.dataQuality.topicActivity.lowFrequency}</span>
                </div>
              </div>
            </div>
          </div>
          
          {mqttData.dataQuality.recommendations.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-3">Öneriler</h4>
              <div className="space-y-2">
                {mqttData.dataQuality.recommendations.slice(0, 3).map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-yellow-800">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataStreamPanel; 