import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Settings,
  BarChart3,
  LineChart,
  RefreshCw,
  Database,
  Target,
  Gauge
} from 'lucide-react';
import { 
  onlineLearningService, 
  ModelPerformanceMetrics, 
  LearningEvent, 
  OnlineLearningConfig,
  AdaptivePrediction 
} from '../lib/onlineLearningService';

interface OnlineLearningDashboardProps {
  className?: string;
}

const OnlineLearningDashboard: React.FC<OnlineLearningDashboardProps> = ({ className }) => {
  const [metrics, setMetrics] = useState<ModelPerformanceMetrics[]>([]);
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [config, setConfig] = useState<OnlineLearningConfig>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [adaptivePrediction, setAdaptivePrediction] = useState<AdaptivePrediction | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const performanceMetrics = onlineLearningService.getModelPerformanceMetrics();
      const learningEvents = onlineLearningService.getLearningEvents(20);
      const currentConfig = onlineLearningService.getOnlineLearningConfig();
      
      setMetrics(performanceMetrics);
      setEvents(learningEvents);
      setConfig(currentConfig);
      
      if (performanceMetrics.length > 0 && !selectedModel) {
        setSelectedModel(performanceMetrics[0].modelType);
      }
    } catch (error) {
      console.error('Error loading online learning data:', error);
    }
  };

  const handleConfigUpdate = (key: keyof OnlineLearningConfig, value: any) => {
    if (!config) return;
    
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onlineLearningService.updateConfig({ [key]: value });
  };

  const triggerManualUpdate = async () => {
    setIsLoading(true);
    try {
      // Simulate manual model update
      await new Promise(resolve => setTimeout(resolve, 2000));
      await loadData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateAdaptivePrediction = async () => {
    if (!selectedModel) return;
    
    setIsLoading(true);
    try {
      // Simulate adaptive prediction
      const mockHealthData = {
        machineId: 'INJECTION_01',
        timestamp: new Date(),
        temperature: 245 + Math.random() * 20,
        pressure: 140 + Math.random() * 30,
        vibration: 3 + Math.random() * 4,
        speed: 85 + Math.random() * 10,
        efficiency: 88 + Math.random() * 8,
        cycleCount: Math.floor(Math.random() * 1000) + 5000,
        operatingHours: Math.floor(Math.random() * 8000) + 1000,
        errorCount: Math.floor(Math.random() * 5),
        maintenanceHistory: []
      };

      const prediction = await onlineLearningService.getAdaptivePrediction(selectedModel, mockHealthData);
      setAdaptivePrediction(prediction);
    } finally {
      setIsLoading(false);
    }
  };

  const getAccuracyTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'data_ingestion': return <Database className="w-4 h-4 text-blue-500" />;
      case 'model_update': return <RefreshCw className="w-4 h-4 text-green-500" />;
      case 'drift_detection': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'retrain_trigger': return <Zap className="w-4 h-4 text-purple-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getModelTypeDisplay = (type: string) => {
    const types = {
      'predictive_maintenance': 'Tahmine Dayalı Bakım',
      'oee_prediction': 'OEE Tahmini',
      'quality_control': 'Kalite Kontrolü',
      'energy_optimization': 'Enerji Optimizasyonu'
    };
    return types[type as keyof typeof types] || type;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Online Learning Dashboard</h2>
            <p className="text-gray-600">Sürekli öğrenen AI modelleri yönetim paneli</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={triggerManualUpdate} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Güncelleniyor...' : 'Manuel Güncelle'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Model Performansı</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Öğrenme Olayları</span>
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Adaptif Tahminler</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Yapılandırma</span>
          </TabsTrigger>
        </TabsList>

        {/* Model Performance Tab */}
        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <Card 
                key={metric.modelId} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedModel === metric.modelType ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedModel(metric.modelType)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {getModelTypeDisplay(metric.modelType)}
                    </CardTitle>
                    {getAccuracyTrendIcon(metric.accuracyTrend)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Doğruluk</span>
                      <span className="font-semibold">{(metric.currentAccuracy * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={metric.currentAccuracy * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Adaptasyon</span>
                      <span className="font-semibold">{metric.adaptationScore.toFixed(0)}%</span>
                    </div>
                    <Progress value={metric.adaptationScore} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      {metric.driftDetected && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Drift
                        </Badge>
                      )}
                      {metric.retrainRecommended && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Retrain
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTime(metric.lastUpdateTime)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Model View */}
          {selectedModel && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5" />
                  <span>{getModelTypeDisplay(selectedModel)} - Detaylı Görünüm</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const metric = metrics.find(m => m.modelType === selectedModel);
                  if (!metric) return null;
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Performans Metrikleri</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mevcut Doğruluk:</span>
                            <span className="font-semibold">{(metric.currentAccuracy * 100).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Önceki Doğruluk:</span>
                            <span className="font-semibold">{(metric.previousAccuracy * 100).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trend:</span>
                            <div className="flex items-center space-x-1">
                              {getAccuracyTrendIcon(metric.accuracyTrend)}
                              <span className="capitalize font-semibold">{metric.accuracyTrend}</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Adaptasyon Skoru:</span>
                            <span className="font-semibold">{metric.adaptationScore.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Veri İstatistikleri</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">İşlenen Veri:</span>
                            <span className="font-semibold">{metric.dataPointsProcessed.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Son Güncelleme:</span>
                            <span className="font-semibold">{formatTime(metric.lastUpdateTime)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sonraki Güncelleme:</span>
                            <span className="font-semibold">{formatTime(metric.nextScheduledUpdate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Model ID:</span>
                            <span className="font-mono text-sm">{metric.modelId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Durum Göstergeleri</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Concept Drift:</span>
                            <Badge variant={metric.driftDetected ? "destructive" : "secondary"}>
                              {metric.driftDetected ? "Tespit Edildi" : "Normal"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Retrain Önerisi:</span>
                            <Badge variant={metric.retrainRecommended ? "outline" : "secondary"}>
                              {metric.retrainRecommended ? "Öneriliyor" : "Gerekli Değil"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Model Durumu:</span>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Aktif
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Learning Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Son Öğrenme Olayları</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Henüz öğrenme olayı bulunmuyor
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.eventId} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full">
                        {getEventIcon(event.eventType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {event.eventType.replace('_', ' ')}
                          </h4>
                          <span className="text-sm text-gray-500">{formatTime(event.timestamp)}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{event.actionTaken}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">Model: {event.modelId}</span>
                          {event.performanceImpact !== 0 && (
                            <Badge 
                              variant={event.performanceImpact > 0 ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {event.performanceImpact > 0 ? '+' : ''}{event.performanceImpact.toFixed(1)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adaptive Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Adaptif Tahmin Analizi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedModel} 
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Model Seçin</option>
                  {metrics.map(metric => (
                    <option key={metric.modelType} value={metric.modelType}>
                      {getModelTypeDisplay(metric.modelType)}
                    </option>
                  ))}
                </select>
                <Button 
                  onClick={generateAdaptivePrediction}
                  disabled={!selectedModel || isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Brain className={`w-4 h-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
                  {isLoading ? 'Analiz Ediliyor...' : 'Adaptif Tahmin Oluştur'}
                </Button>
              </div>

              {adaptivePrediction && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Temel Tahmin</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Seviyesi:</span>
                        <Badge variant={
                          adaptivePrediction.riskLevel === 'critical' ? 'destructive' :
                          adaptivePrediction.riskLevel === 'high' ? 'destructive' :
                          adaptivePrediction.riskLevel === 'medium' ? 'outline' : 'secondary'
                        }>
                          {adaptivePrediction.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Skoru:</span>
                        <span className="font-semibold">{adaptivePrediction.riskScore.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Güven Seviyesi:</span>
                        <span className="font-semibold">{adaptivePrediction.confidenceLevel.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arıza Tipi:</span>
                        <span className="font-semibold">{adaptivePrediction.failureType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Online Learning Metrikleri</h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Model Güveni:</span>
                          <span className="font-semibold">{adaptivePrediction.modelConfidence.toFixed(1)}%</span>
                        </div>
                        <Progress value={adaptivePrediction.modelConfidence} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Veri Güncelliği:</span>
                          <span className="font-semibold">{adaptivePrediction.dataFreshness.toFixed(1)}%</span>
                        </div>
                        <Progress value={adaptivePrediction.dataFreshness} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Adaptasyon Seviyesi:</span>
                          <span className="font-semibold">{adaptivePrediction.adaptationLevel.toFixed(1)}%</span>
                        </div>
                        <Progress value={adaptivePrediction.adaptationLevel} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Öğrenme İlerlemesi:</span>
                          <span className="font-semibold">{adaptivePrediction.learningProgress.toFixed(1)}%</span>
                        </div>
                        <Progress value={adaptivePrediction.learningProgress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {adaptivePrediction && (
                <Alert>
                  <Brain className="w-4 h-4" />
                  <AlertDescription>
                    <strong>AI Önerisi:</strong> Bu tahmin online learning algoritmaları ile sürekli güncellenen 
                    model tarafından üretilmiştir. Model güven seviyesi {adaptivePrediction.modelConfidence.toFixed(1)}% 
                    ve veri güncelliği {adaptivePrediction.dataFreshness.toFixed(1)}% seviyesindedir.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {config && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Model Güncelleme Ayarları</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Güncelleme Sıklığı (dakika)</label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.modelUpdateFrequency]}
                        onValueChange={(value) => handleConfigUpdate('modelUpdateFrequency', value[0])}
                        max={120}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>5 dk</span>
                        <span className="font-semibold">{config.modelUpdateFrequency} dk</span>
                        <span>120 dk</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Batch Boyutu</label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.batchSize]}
                        onValueChange={(value) => handleConfigUpdate('batchSize', value[0])}
                        max={200}
                        min={10}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>10</span>
                        <span className="font-semibold">{config.batchSize}</span>
                        <span>200</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Öğrenme Oranı</label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.learningRate * 1000]}
                        onValueChange={(value) => handleConfigUpdate('learningRate', value[0] / 1000)}
                        max={10}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0.0001</span>
                        <span className="font-semibold">{config.learningRate.toFixed(4)}</span>
                        <span>0.01</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gauge className="w-5 h-5" />
                    <span>Adaptasyon Ayarları</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Otomatik Retrain</label>
                      <p className="text-xs text-gray-500">Model performansı düştüğünde otomatik retrain</p>
                    </div>
                    <Switch
                      checked={config.enableAutoRetrain}
                      onCheckedChange={(checked) => handleConfigUpdate('enableAutoRetrain', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Adaptasyon Eşiği (%)</label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.adaptationThreshold * 100]}
                        onValueChange={(value) => handleConfigUpdate('adaptationThreshold', value[0] / 100)}
                        max={20}
                        min={1}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1%</span>
                        <span className="font-semibold">{(config.adaptationThreshold * 100).toFixed(1)}%</span>
                        <span>20%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Maksimum Model Yaşı (saat)</label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.maxModelAge]}
                        onValueChange={(value) => handleConfigUpdate('maxModelAge', value[0])}
                        max={168}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1 saat</span>
                        <span className="font-semibold">{config.maxModelAge} saat</span>
                        <span>1 hafta</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Veri Saklama (gün)</label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.dataRetentionDays]}
                        onValueChange={(value) => handleConfigUpdate('dataRetentionDays', value[0])}
                        max={365}
                        min={7}
                        step={7}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>7 gün</span>
                        <span className="font-semibold">{config.dataRetentionDays} gün</span>
                        <span>1 yıl</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>Uyarı:</strong> Bu ayarlar tüm online learning modellerini etkiler. 
              Değişiklikler anında uygulanır ve sistem performansını etkileyebilir.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OnlineLearningDashboard; 