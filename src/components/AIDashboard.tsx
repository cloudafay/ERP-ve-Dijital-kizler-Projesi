import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  Zap,
  Leaf,
  Target,
  X,
  Clock,
  Activity,
  BarChart3,
  Shield
} from 'lucide-react';
import { useDigitalTwinStore } from '../lib/store';
import { aiService } from '../lib/aiService';

interface StoredAnomaly {
  id: string;
  machineId: string;
  anomalyType: 'temperature' | 'vibration' | 'speed' | 'pattern' | 'quality';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  detectedAt: Date;
  suggestedActions: string[];
  rootCause: string;
  aiAnalysis: string;
  technicalDetails: {
    currentValue: number;
    normalRange: string;
    deviationPercentage: number;
    impactLevel: string;
  };
  resolution?: {
    status: 'pending' | 'in-progress' | 'resolved';
    resolvedAt?: Date;
    notes?: string;
  };
}

const AIDashboard: React.FC = () => {
  const { machines, sensorData, productionData } = useDigitalTwinStore();
  const [allAnomalies, setAllAnomalies] = useState<StoredAnomaly[]>([]);
  const [maintenanceRecommendations, setMaintenanceRecommendations] = useState<any[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<StoredAnomaly | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  // AI açıklama veritabanı
  const getAIAnalysis = (anomaly: any, machine: any): { rootCause: string; aiAnalysis: string; technicalDetails: any } => {
    const analysisDatabase = {
      temperature: {
        high: {
          rootCause: "Soğutma sistemi verimsizliği veya aşırı yük",
          aiAnalysis: "Yapay zeka analizi: Sıcaklık sensörü verilerine göre, makinenin çalışma sıcaklığı optimal aralığın %25 üzerinde. Bu durum genellikle soğutma sistemindeki bir arıza, hava filtresinin kirlenmesi veya çalışma yükünün kapasiteyi aşması nedeniyle oluşur. Termal görüntüleme verileri, belirli bileşenlerde sıcaklık birikim noktaları olduğunu gösteriyor.",
          technicalDetails: {
            currentValue: 210,
            normalRange: "70-85°C",
            deviationPercentage: 25,
            impactLevel: "Yüksek"
          }
        },
        low: {
          rootCause: "Termostat arızası veya soğutma sistemi aşırı çalışması",
          aiAnalysis: "AI Değerlendirmesi: Düşük sıcaklık anomalisi tespit edildi. Bu durum genellikle termostat sensörü kalibrasyonu hatası veya soğutma sisteminin aşırı performans göstermesi nedeniyle oluşur. Enerji verimliliğini olumsuz etkileyebilir.",
          technicalDetails: {
            currentValue: 45,
            normalRange: "70-85°C",
            deviationPercentage: -35,
            impactLevel: "Orta"
          }
        }
      },
      vibration: {
        high: {
          rootCause: "Mekanik bileşen aşınması veya dengesizlik",
          aiAnalysis: "Gelişmiş Vibrasyon Analizi: FFT (Fast Fourier Transform) analizi sonuçları, belirli frekanslarda anormal titreşim patternleri olduğunu gösteriyor. Bu durum rulman aşınması, şaft dengesizliği veya kayış gevşekliği ile ilişkili olabilir. Makine öğrenmesi modeli, bu pattern'in %85 olasılıkla rulman problemi olduğunu tahmin ediyor.",
          technicalDetails: {
            currentValue: 1.2,
            normalRange: "0.1-0.5 mm/s",
            deviationPercentage: 140,
            impactLevel: "Kritik"
          }
        }
      },
      speed: {
        irregular: {
          rootCause: "Motor kontrol sistemi veya güç kaynağı sorunu",
          aiAnalysis: "Hız Anomalisi Raporu: Motor kontrol algoritması analizi, PWM sinyallerinde düzensizlik tespit etti. Bu durum, motor sürücü kartındaki elektronik bileşen yaşlanması veya güç kaynağı voltaj dalgalanmaları ile ilişkili olabilir.",
          technicalDetails: {
            currentValue: 1450,
            normalRange: "1800-2000 RPM",
            deviationPercentage: -20,
            impactLevel: "Orta"
          }
        }
      }
    };

    const type = anomaly.anomalyType;
    const level = anomaly.severity === 'critical' || anomaly.severity === 'high' ? 'high' : 'low';
    
    return analysisDatabase[type]?.[level] || {
      rootCause: "Sistem analizi devam ediyor",
      aiAnalysis: "Yapay zeka modeli bu anomali tipini analiz ediyor. Daha detaylı veri toplanması gerekiyor.",
      technicalDetails: {
        currentValue: 0,
        normalRange: "Belirleniyor",
        deviationPercentage: 0,
        impactLevel: "Araştırılıyor"
      }
    };
  };

  useEffect(() => {
    if (machines.length === 0) return;

    const runAIAnalysis = () => {
      const detectedAnomalies = aiService.detectAnomalies(sensorData, machines);
      
      // Yeni anomalileri mevcut listede yoksa ekle
      const newAnomalies: StoredAnomaly[] = detectedAnomalies
        .filter(newAnomaly => !allAnomalies.some(existing => existing.id === newAnomaly.id))
        .map(anomaly => {
          const machine = machines.find(m => m.id === anomaly.machineId);
          const analysis = getAIAnalysis(anomaly, machine);
          
          return {
            ...anomaly,
            ...analysis,
            resolution: { status: 'pending' as const }
          };
        });

      if (newAnomalies.length > 0) {
        setAllAnomalies(prev => [...prev, ...newAnomalies]);
      }

      const recommendations = aiService.generateMaintenanceRecommendations(machines, sensorData);
      setMaintenanceRecommendations(recommendations);
    };

    runAIAnalysis();
    const interval = setInterval(runAIAnalysis, 60000); // 60 saniye = 1 dakika
    return () => clearInterval(interval);
  }, [machines, sensorData, allAnomalies]);

  const openAnomalyDetail = (anomaly: StoredAnomaly) => {
    setSelectedAnomaly(anomaly);
    setShowDetailPanel(true);
  };

  const resolveAnomaly = (anomalyId: string) => {
    setAllAnomalies(prev => prev.map(anomaly => 
      anomaly.id === anomalyId 
        ? { 
            ...anomaly, 
            resolution: { 
              status: 'resolved' as const, 
              resolvedAt: new Date(),
              notes: 'Manuel olarak çözüldü olarak işaretlendi'
            }
          }
        : anomaly
    ));
  };

  const activeAnomalies = allAnomalies.filter(a => a.resolution?.status === 'pending');
  const resolvedAnomalies = allAnomalies.filter(a => a.resolution?.status === 'resolved');

  return (
    <div className="space-y-6">
      {/* AI Genel Bakış */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Güven Skoru</p>
                <p className="text-2xl font-bold text-green-600">94.2%</p>
              </div>
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif Anomali</p>
                <p className="text-2xl font-bold text-red-600">{activeAnomalies.filter(a => a.severity === 'critical' || a.severity === 'high').length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Tespit</p>
                <p className="text-2xl font-bold text-blue-600">{allAnomalies.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Çözülme Oranı</p>
                <p className="text-2xl font-bold text-green-600">{allAnomalies.length > 0 ? Math.round((resolvedAnomalies.length / allAnomalies.length) * 100) : 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analizleri */}
      <Tabs defaultValue="anomalies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="anomalies">Anomaliler</TabsTrigger>
          <TabsTrigger value="maintenance">Bakım</TabsTrigger>
          <TabsTrigger value="quality">Kalite</TabsTrigger>
          <TabsTrigger value="energy">Enerji</TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Gerçek Zamanlı Anomali Tespiti
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Aktif Anomaliler */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-red-600">Aktif Anomaliler</h3>
                {activeAnomalies.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>Şu anda aktif anomali bulunmamaktadır</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeAnomalies.map((anomaly) => (
                      <Alert key={anomaly.id} className="border-l-4 border-l-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className={`
                                  ${anomaly.severity === 'critical' ? 'border-red-500 text-red-700' : ''}
                                  ${anomaly.severity === 'high' ? 'border-orange-500 text-orange-700' : ''}
                                  ${anomaly.severity === 'medium' ? 'border-yellow-500 text-yellow-700' : ''}
                                  ${anomaly.severity === 'low' ? 'border-blue-500 text-blue-700' : ''}
                                `}>
                                  {anomaly.severity.toUpperCase()}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {Math.round(anomaly.confidence * 100)}% Güven
                                </Badge>
                              </div>
                              <p className="font-medium mb-1">{anomaly.description}</p>
                              <p className="text-sm text-gray-600 mb-2">
                                Makine: {machines.find(m => m.id === anomaly.machineId)?.name}
                              </p>
                              <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-2">
                                <p className="text-sm font-medium text-orange-800">🔍 Tespit Edilen Neden:</p>
                                <p className="text-sm text-orange-700">{anomaly.rootCause}</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                Tespit: {new Date(anomaly.detectedAt).toLocaleString('tr-TR')}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openAnomalyDetail(anomaly)}
                              >
                                📋 Detay
                              </Button>
                              <Button 
                                size="sm" 
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => resolveAnomaly(anomaly.id)}
                              >
                                ✅ Çözüldü
                              </Button>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>

              {/* Çözülmüş Anomaliler */}
              {resolvedAnomalies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-600">Çözülmüş Anomaliler</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {resolvedAnomalies.slice(-5).map((anomaly) => (
                      <div key={anomaly.id} className="border rounded-lg p-3 bg-green-50 border-green-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                ✅ ÇÖZÜLDÜ
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {machines.find(m => m.id === anomaly.machineId)?.name}
                              </span>
                            </div>
                            <p className="text-sm">{anomaly.description}</p>
                            <p className="text-xs text-gray-500">
                              Çözüldü: {anomaly.resolution?.resolvedAt ? new Date(anomaly.resolution.resolvedAt).toLocaleString('tr-TR') : '-'}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => openAnomalyDetail(anomaly)}
                          >
                            📋 Detay
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Akıllı Bakım Önerileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceRecommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge variant="outline" className="mb-1">
                          {rec.urgency.toUpperCase()}
                        </Badge>
                        <h3 className="font-medium">
                          {machines.find(m => m.id === rec.machineId)?.name}
                        </h3>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-gray-600">Tahmini Maliyet</p>
                        <p className="font-bold text-orange-600">₺{rec.costEstimate.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="default">
                        Planla
                      </Button>
                      <Button size="sm" variant="outline">
                        Ayrıntılar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Kalite Tahmini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Kalite Skoru</p>
                  <p className="text-3xl font-bold text-blue-600">92.1</p>
                  <Progress value={92.1} className="mt-2" />
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tahmini Fire Oranı</p>
                  <p className="text-3xl font-bold text-red-600">2.3%</p>
                  <Progress value={23} className="mt-2" />
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Güven Seviyesi</p>
                  <p className="text-3xl font-bold text-green-600">89.7%</p>
                  <Progress value={89.7} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Enerji Optimizasyonu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Mevcut Tüketim</p>
                  <p className="text-2xl font-bold text-blue-600">89.8 kWh</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Optimize Tüketim</p>
                  <p className="text-2xl font-bold text-green-600">76.3 kWh</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tasarruf</p>
                  <p className="text-2xl font-bold text-purple-600">13.5 kWh</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-800">Karbon Ayak İzi</h3>
                </div>
                <p className="text-sm text-green-700">
                  Günlük CO₂ Emisyonu: <span className="font-bold">40.4 kg</span>
                </p>
                <p className="text-sm text-green-700">
                  Aylık Tasarruf Potansiyeli: <span className="font-bold">405 kg CO₂</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modern Anomali Detay Paneli */}
      {showDetailPanel && selectedAnomaly && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">🔍 Anomali Detay Analizi</h2>
                  <p className="text-red-100">
                    {machines.find(m => m.id === selectedAnomaly.machineId)?.name} - {selectedAnomaly.anomalyType.toUpperCase()}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white hover:text-red-500"
                  onClick={() => setShowDetailPanel(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Temel Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Anomali Özeti
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Önem Derecesi:</span>
                        <Badge className={`
                          ${selectedAnomaly.severity === 'critical' ? 'bg-red-100 text-red-800' : ''}
                          ${selectedAnomaly.severity === 'high' ? 'bg-orange-100 text-orange-800' : ''}
                          ${selectedAnomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${selectedAnomaly.severity === 'low' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {selectedAnomaly.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Güven Oranı:</span>
                        <span className="font-medium">{Math.round(selectedAnomaly.confidence * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tespit Zamanı:</span>
                        <span className="font-medium">{new Date(selectedAnomaly.detectedAt).toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durum:</span>
                        <Badge variant={selectedAnomaly.resolution?.status === 'resolved' ? 'default' : 'secondary'}>
                          {selectedAnomaly.resolution?.status === 'resolved' ? '✅ Çözüldü' : '⏳ Beklemede'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Teknik Detaylar
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mevcut Değer:</span>
                        <span className="font-medium text-red-600">{selectedAnomaly.technicalDetails.currentValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Normal Aralık:</span>
                        <span className="font-medium">{selectedAnomaly.technicalDetails.normalRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sapma Oranı:</span>
                        <span className={`font-medium ${Math.abs(selectedAnomaly.technicalDetails.deviationPercentage) > 20 ? 'text-red-600' : 'text-orange-600'}`}>
                          {selectedAnomaly.technicalDetails.deviationPercentage > 0 ? '+' : ''}{selectedAnomaly.technicalDetails.deviationPercentage}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Etki Seviyesi:</span>
                        <span className="font-medium">{selectedAnomaly.technicalDetails.impactLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ana Neden Analizi */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  🔍 Kök Neden Analizi
                </h3>
                <p className="text-red-700 font-medium mb-2">{selectedAnomaly.rootCause}</p>
                <p className="text-red-600 text-sm">{selectedAnomaly.description}</p>
              </div>

              {/* AI Yapay Zeka Değerlendirmesi */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  🤖 Yapay Zeka Değerlendirmesi
                </h3>
                <p className="text-blue-700 leading-relaxed">{selectedAnomaly.aiAnalysis}</p>
              </div>

              {/* Önerilen Aksiyonlar */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Önerilen Çözümler
                </h3>
                <ul className="space-y-2">
                  {selectedAnomaly.suggestedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span className="text-green-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    resolveAnomaly(selectedAnomaly.id);
                    setShowDetailPanel(false);
                  }}
                  disabled={selectedAnomaly.resolution?.status === 'resolved'}
                >
                  ✅ Anomaliyi Çözüldü Olarak İşaretle
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDetailPanel(false)}
                >
                  📋 Rapor Oluştur
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowDetailPanel(false)}
                >
                  Kapat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDashboard; 