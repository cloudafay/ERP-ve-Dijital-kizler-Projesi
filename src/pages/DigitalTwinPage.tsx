import React from 'react';
import DigitalTwin3D from '../components/DigitalTwin3D';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Activity, 
  Zap, 
  Brain, 
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const DigitalTwinPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Dijital İkiz - Su Şişesi Üretim Hattı
              </h1>
              <p className="text-blue-200 mt-1">
                Gerçek zamanlı 3D simülasyon ve AI destekli üretim izleme
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Sistem Aktif
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                <Activity className="w-3 h-3 mr-1" />
                Canlı Veri
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-white">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm">OEE: </span>
              <span className="font-semibold">86.7%</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm">Verimlilik: </span>
              <span className="font-semibold">92.5%</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Güç: </span>
              <span className="font-semibold">77.3 kW</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-sm">Uyarılar: </span>
              <span className="font-semibold">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3D View */}
      <div className="relative">
        <DigitalTwin3D />
        
        {/* Floating AI Insights Panel */}
        <div className="absolute top-4 right-4 w-80 z-20">
          <Card className="bg-black/80 backdrop-blur-sm border-white/20 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5 text-blue-400" />
                AI İçgörüleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Production Insights */}
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-300">Üretim Analizi</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    <span>Üretim hızı hedefin %5 üzerinde</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-yellow-400" />
                    <span>Şişirme makinesinde verimlilik düşüşü</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span>Kalite oranı son hafta %2 arttı</span>
                  </div>
                </div>
              </div>

              {/* Predictions */}
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-300">Tahminler</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-500/20 p-2 rounded">
                    <p className="font-medium">Bakım Önerisi</p>
                    <p className="text-xs text-blue-200">
                      Şişirme makinesi #2 için 6 gün içinde bakım planlanmalı
                    </p>
                  </div>
                  <div className="bg-green-500/20 p-2 rounded">
                    <p className="font-medium">Enerji Optimizasyonu</p>
                    <p className="text-xs text-green-200">
                      %8 enerji tasarrufu potansiyeli tespit edildi
                    </p>
                  </div>
                </div>
              </div>

              {/* Real-time Metrics */}
              <div className="space-y-2">
                <h4 className="font-semibold text-yellow-300">Anlık Metrikler</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Genel Verimlilik</span>
                      <span>92.5%</span>
                    </div>
                    <Progress value={92.5} className="h-1 mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Kalite Skoru</span>
                      <span>97.8%</span>
                    </div>
                    <Progress value={97.8} className="h-1 mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Enerji Verimliliği</span>
                      <span>84.2%</span>
                    </div>
                    <Progress value={84.2} className="h-1 mt-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-white text-sm">
                <span>Son Güncelleme: {new Date().toLocaleTimeString('tr-TR')}</span>
                <span>•</span>
                <span>5 Makine Aktif</span>
                <span>•</span>
                <span>Günlük Üretim: 1,847 şişe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Canlı</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinPage; 