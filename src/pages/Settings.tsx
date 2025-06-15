import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import BackToHomeButton from '../components/BackToHomeButton';
import { 
  Settings, 
  Bell, 
  Palette, 
  Globe, 
  Shield, 
  Database,
  Monitor,
  Volume2,
  Moon,
  Sun,
  Smartphone,
  Mail,
  CheckCircle,
  AlertTriangle,
  Save,
  RotateCcw
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    // Bildirim Ayarları
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    criticalAlerts: true,
    maintenanceAlerts: true,
    productionAlerts: true,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // Tema Ayarları
    theme: 'light',
    language: 'tr',
    fontSize: 'medium',
    highContrast: false,
    animations: true,
    
    // Sistem Ayarları
    autoRefresh: true,
    refreshInterval: 30,
    dataRetention: 90,
    backupEnabled: true,
    analyticsEnabled: true,
    
    // Güvenlik Ayarları
    twoFactorAuth: false,
    sessionTimeout: 60,
    ipWhitelist: false,
    auditLog: true
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Simulated save operation
    setTimeout(() => {
      setHasChanges(false);
      alert('✅ Ayarlar başarıyla kaydedildi!\n\nTüm değişiklikler sisteme uygulandı ve aktif edildi.');
    }, 1000);
  };

  const resetSettings = () => {
    if (confirm('🔄 AYARLARI SIFIRLA\n\nTüm ayarları fabrika varsayılanlarına döndürmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!')) {
      // Reset to defaults
      setSettings({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        criticalAlerts: true,
        maintenanceAlerts: true,
        productionAlerts: true,
        soundEnabled: true,
        vibrationEnabled: true,
        theme: 'light',
        language: 'tr',
        fontSize: 'medium',
        highContrast: false,
        animations: true,
        autoRefresh: true,
        refreshInterval: 30,
        dataRetention: 90,
        backupEnabled: true,
        analyticsEnabled: true,
        twoFactorAuth: false,
        sessionTimeout: 60,
        ipWhitelist: false,
        auditLog: true
      });
      setHasChanges(true);
      alert('🔄 Ayarlar varsayılan değerlere sıfırlandı!\n\nDeğişiklikleri kaydetmeyi unutmayın.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ⚙️ Sistem Ayarları
            </h1>
            <p className="text-gray-600 mt-2">Uygulama tercihlerinizi ve sistem ayarlarınızı yönetin</p>
          </div>
          
          <div className="flex gap-3">
            <BackToHomeButton />
            {hasChanges && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 animate-pulse">
                💾 Kaydedilmemiş değişiklikler
              </Badge>
            )}
            <Button 
              onClick={resetSettings}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Sıfırla
            </Button>
            <Button 
              onClick={saveSettings}
              disabled={!hasChanges}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg rounded-full p-1">
            <TabsTrigger value="notifications" className="rounded-full px-6 py-3 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              🔔 Bildirimler
            </TabsTrigger>
            <TabsTrigger value="theme" className="rounded-full px-6 py-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              🎨 Tema
            </TabsTrigger>
            <TabsTrigger value="system" className="rounded-full px-6 py-3 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              💻 Sistem
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-full px-6 py-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              🛡️ Güvenlik
            </TabsTrigger>
          </TabsList>

          {/* Bildirim Ayarları */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-500" />
                  📢 Bildirim Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Bildirim Türleri</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>📧 E-posta Bildirimleri</span>
                        <input type="checkbox" checked={settings.emailNotifications} onChange={(e) => updateSetting('emailNotifications', e.target.checked)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>🔔 Push Bildirimleri</span>
                        <input type="checkbox" checked={settings.pushNotifications} onChange={(e) => updateSetting('pushNotifications', e.target.checked)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>🔊 Ses Bildirimleri</span>
                        <input type="checkbox" checked={settings.soundEnabled} onChange={(e) => updateSetting('soundEnabled', e.target.checked)} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Uyarı Kategorileri</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>🚨 Kritik Uyarılar</span>
                        <input type="checkbox" checked={settings.criticalAlerts} onChange={(e) => updateSetting('criticalAlerts', e.target.checked)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>🔧 Bakım Uyarıları</span>
                        <input type="checkbox" checked={settings.maintenanceAlerts} onChange={(e) => updateSetting('maintenanceAlerts', e.target.checked)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>📊 Üretim Uyarıları</span>
                        <input type="checkbox" checked={settings.productionAlerts} onChange={(e) => updateSetting('productionAlerts', e.target.checked)} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tema Ayarları */}
          <TabsContent value="theme" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-500" />
                  🎨 Tema ve Görünüm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Tema Seçimi</h3>
                    <select value={settings.theme} onChange={(e) => updateSetting('theme', e.target.value)} className="w-full p-2 border rounded">
                      <option value="light">☀️ Açık Tema</option>
                      <option value="dark">🌙 Koyu Tema</option>
                      <option value="auto">🔄 Otomatik</option>
                    </select>
                    
                    <h3 className="font-medium text-gray-700">Yazı Boyutu</h3>
                    <select value={settings.fontSize} onChange={(e) => updateSetting('fontSize', e.target.value)} className="w-full p-2 border rounded">
                      <option value="small">Küçük</option>
                      <option value="medium">Orta</option>
                      <option value="large">Büyük</option>
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Dil Ayarları</h3>
                    <select value={settings.language} onChange={(e) => updateSetting('language', e.target.value)} className="w-full p-2 border rounded">
                      <option value="tr">🇹🇷 Türkçe</option>
                      <option value="en">🇺🇸 English</option>
                      <option value="de">🇩🇪 Deutsch</option>
                    </select>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>🎭 Animasyonlar</span>
                        <input type="checkbox" checked={settings.animations} onChange={(e) => updateSetting('animations', e.target.checked)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>🔍 Yüksek Kontrast</span>
                        <input type="checkbox" checked={settings.highContrast} onChange={(e) => updateSetting('highContrast', e.target.checked)} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sistem Ayarları */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-500" />
                  💻 Sistem Performansı
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Otomatik Yenileme</h3>
                    <div className="flex items-center justify-between">
                      <span>🔄 Otomatik Yenileme</span>
                      <input type="checkbox" checked={settings.autoRefresh} onChange={(e) => updateSetting('autoRefresh', e.target.checked)} />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Yenileme Sıklığı</label>
                      <select value={settings.refreshInterval} onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))} className="w-full p-2 border rounded">
                        <option value={10}>10 saniye</option>
                        <option value={30}>30 saniye</option>
                        <option value={60}>1 dakika</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Veri Yönetimi</h3>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Veri Saklama Süresi</label>
                      <select value={settings.dataRetention} onChange={(e) => updateSetting('dataRetention', parseInt(e.target.value))} className="w-full p-2 border rounded">
                        <option value={30}>30 gün</option>
                        <option value={90}>90 gün</option>
                        <option value={365}>1 yıl</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>💾 Otomatik Yedekleme</span>
                      <input type="checkbox" checked={settings.backupEnabled} onChange={(e) => updateSetting('backupEnabled', e.target.checked)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Güvenlik Ayarları */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  🛡️ Güvenlik Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Kimlik Doğrulama</h3>
                    <div className="flex items-center justify-between">
                      <span>🔒 İki Faktörlü Doğrulama</span>
                      <input type="checkbox" checked={settings.twoFactorAuth} onChange={(e) => updateSetting('twoFactorAuth', e.target.checked)} />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Oturum Zaman Aşımı</label>
                      <select value={settings.sessionTimeout} onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))} className="w-full p-2 border rounded">
                        <option value={15}>15 dakika</option>
                        <option value={30}>30 dakika</option>
                        <option value={60}>1 saat</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Erişim Kontrolü</h3>
                    <div className="flex items-center justify-between">
                      <span>🌐 IP Whitelist</span>
                      <input type="checkbox" checked={settings.ipWhitelist} onChange={(e) => updateSetting('ipWhitelist', e.target.checked)} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>📝 Denetim Logları</span>
                      <input type="checkbox" checked={settings.auditLog} onChange={(e) => updateSetting('auditLog', e.target.checked)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage; 