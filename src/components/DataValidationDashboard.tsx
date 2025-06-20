import React, { useState, useEffect } from 'react';
import { 
  useRealTimeValidation, 
  useDataQualityMetrics, 
  useDataConsistency,
  useValidationRules,
  ValidationResult 
} from '../hooks/useDataValidation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity, 
  TrendingUp, 
  Shield,
  Database,
  Clock,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';

export function DataValidationDashboard() {
  const {
    validationResults,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearResults,
    criticalErrors,
    warnings,
  } = useRealTimeValidation();

  const {
    metrics,
    qualityTrends,
    updateMetrics,
  } = useDataQualityMetrics();

  const {
    consistencyReport,
    consistencyIssues,
    checkDeviceConsistency,
    clearIssues,
  } = useDataConsistency();

  const {
    rules,
    isLoading: rulesLoading,
  } = useValidationRules();

  // Metrics'i validation sonuçlarıyla güncelle
  useEffect(() => {
    if (validationResults.length > 0) {
      updateMetrics(validationResults);
    }
  }, [validationResults, updateMetrics]);

  const severityColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Veri Doğrulama & Tutarlılık Kontrolü</h1>
          <p className="text-muted-foreground">
            Ham ve işlenmiş veriler arasında otomatik doğrulama sistemi
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            variant={isMonitoring ? "destructive" : "default"}
            className="flex items-center space-x-2"
          >
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Durdur</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Başlat</span>
              </>
            )}
          </Button>
          
          <Button
            onClick={clearResults}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Temizle</span>
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monitoring Durumu
            </CardTitle>
            <Activity className={cn(
              "h-4 w-4",
              isMonitoring ? "text-green-500" : "text-gray-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isMonitoring ? "Aktif" : "Pasif"}
            </div>
            <p className="text-xs text-muted-foreground">
              {validationResults.length} toplam kontrol
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Başarı Oranı
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.successRate * 100).toFixed(1)}%
            </div>
            <Progress 
              value={metrics.successRate * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kritik Hatalar
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {criticalErrors.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Son 100 kontrolde
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ortalama Güven
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.averageConfidence * 100).toFixed(1)}%
            </div>
            <Progress 
              value={metrics.averageConfidence * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Kritik Veri Hataları Tespit Edildi!</AlertTitle>
          <AlertDescription>
            {criticalErrors.length} adet kritik hata bulundu. Acil müdahale gerekebilir.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList>
          <TabsTrigger value="realtime">Gerçek Zamanlı</TabsTrigger>
          <TabsTrigger value="trends">Trend Analizi</TabsTrigger>
          <TabsTrigger value="consistency">Tutarlılık</TabsTrigger>
          <TabsTrigger value="rules">Kurallar</TabsTrigger>
        </TabsList>

        {/* Real-time Tab */}
        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Validation Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Son Doğrulama Sonuçları</span>
                </CardTitle>
                <CardDescription>
                  En son {validationResults.slice(0, 10).length} doğrulama sonucu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {validationResults.slice(0, 10).map((result, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        result.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        {result.isValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {result.isValid ? "Başarılı" : "Başarısız"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {result.errors.length} hata, {result.warnings.length} uyarı
                          </p>
                        </div>
                      </div>
                      <Badge variant={result.isValid ? "default" : "destructive"}>
                        {(result.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Error Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Hata Detayları</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {validationResults
                    .filter(r => !r.isValid)
                    .slice(0, 5)
                    .map((result, index) => (
                      <div key={index} className="space-y-2">
                        {result.errors.map((error, errorIndex) => (
                          <div
                            key={errorIndex}
                            className="flex items-start space-x-3 p-3 rounded-lg border border-red-200 bg-red-50"
                          >
                            {getSeverityIcon(error.severity)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-800">
                                {error.message}
                              </p>
                              <p className="text-xs text-red-600">
                                Alan: {error.field} | Tip: {error.type}
                              </p>
                              {error.suggestedAction && (
                                <p className="text-xs text-red-700 mt-1">
                                  Önerilen: {error.suggestedAction}
                                </p>
                              )}
                            </div>
                            <Badge 
                              variant="destructive" 
                              className={severityColors[error.severity as keyof typeof severityColors]}
                            >
                              {error.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Veri Kalitesi Trendi (24 Saat)</CardTitle>
                <CardDescription>
                  Başarı oranı ve güven skoru değişimi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={qualityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tickFormatter={(value) => `${value}:00`}
                    />
                    <YAxis domain={[0, 1]} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${(value * 100).toFixed(1)}%`,
                        name === 'successRate' ? 'Başarı Oranı' : 'Güven Skoru'
                      ]}
                      labelFormatter={(value) => `Saat: ${value}:00`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="successRate" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="successRate"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="averageConfidence" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="averageConfidence"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Validation Volume */}
            <Card>
              <CardHeader>
                <CardTitle>Doğrulama Hacmi</CardTitle>
                <CardDescription>
                  Saatlik doğrulama sayıları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={qualityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tickFormatter={(value) => `${value}:00`}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Doğrulama Sayısı']}
                      labelFormatter={(value) => `Saat: ${value}:00`}
                    />
                    <Bar 
                      dataKey="validationCount" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Consistency Tab */}
        <TabsContent value="consistency" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Consistency Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Tutarlılık Sorunları</span>
                </CardTitle>
                <CardDescription>
                  Son tespit edilen veri tutarlılığı sorunları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {consistencyIssues.slice(0, 10).map((issue, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        issue.severity === 'high' ? "border-red-200 bg-red-50" :
                        issue.severity === 'medium' ? "border-yellow-200 bg-yellow-50" :
                        "border-blue-200 bg-blue-50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        {getSeverityIcon(issue.severity)}
                        <div>
                          <p className="text-sm font-medium">
                            {issue.deviceId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {issue.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {issue.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          issue.severity === 'high' ? 'destructive' :
                          issue.severity === 'medium' ? 'default' :
                          'secondary'
                        }
                      >
                        {issue.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Consistency Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Tutarlılık İstatistikleri</CardTitle>
                <CardDescription>
                  Genel veri tutarlılığı metrikleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="text-2xl font-bold text-green-600">
                        {consistencyReport?.successfulValidations || 0}
                      </div>
                      <div className="text-sm text-green-700">
                        Tutarlı Veri
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
                      <div className="text-2xl font-bold text-red-600">
                        {consistencyIssues.length}
                      </div>
                      <div className="text-sm text-red-700">
                        Tutarsız Veri
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">
                      {consistencyReport?.averageConfidence ? 
                        `${(consistencyReport.averageConfidence * 100).toFixed(1)}%` : 
                        'N/A'
                      }
                    </div>
                    <div className="text-sm text-blue-700">
                      Ortalama Güven Skoru
                    </div>
                  </div>

                  <Button 
                    onClick={clearIssues}
                    variant="outline" 
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sorunları Temizle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Doğrulama Kuralları</span>
              </CardTitle>
              <CardDescription>
                Aktif veri doğrulama kuralları ve ayarları
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rulesLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Kurallar yükleniyor...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rules.length > 0 ? (
                    rules.map((rule, index) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {rule.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary">
                              {rule.machineType}
                            </Badge>
                            <Badge variant="outline">
                              {rule.sensorType}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={rule.isActive}
                            onCheckedChange={() => {}}
                          />
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Henüz doğrulama kuralı tanımlanmamış</p>
                      <Button className="mt-4" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Kural Ekle
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}