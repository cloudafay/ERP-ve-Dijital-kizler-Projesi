import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Wifi, 
  WifiOff, 
  Battery, 
  Signal, 
  Settings2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Router,
  Smartphone,
  Package,
  Truck,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  Globe,
  Zap,
  Shield,
  Layers,
  RefreshCw,
  Power,
  Wrench,
  Search,
  Filter,
  Download,
  Upload,
  Play,
  Pause,
  X,
  Calendar,
  MapPin,
  FileText,
  User,
  Building,
  QrCode,
  Activity,
  Archive,
  Truck as TruckIcon
} from 'lucide-react';
import { iotSimulator, IoTDevice } from '../lib/iotSimulator';

interface Product {
  id: string;
  name: string;
  type: 'bottle' | 'cap' | 'label' | 'packaging';
  quantity: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'in_transit';
  lastUpdated: Date;
  batchId: string;
  expiryDate?: Date;
  qrCode: string;
}

interface ProductionMetrics {
  totalProduced: number;
  hourlyRate: number;
  qualityScore: number;
  efficiency: number;
  wastePercentage: number;
}

const IoTMonitor: React.FC = () => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [networkStats, setNetworkStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<IoTDevice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'error'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [showTransportPlanning, setShowTransportPlanning] = useState(false);
  const [transportPlan, setTransportPlan] = useState<any>(null);
  const [productionMetrics, setProductionMetrics] = useState<ProductionMetrics>({
    totalProduced: 0,
    hourlyRate: 0,
    qualityScore: 0,
    efficiency: 0,
    wastePercentage: 0
  });

  useEffect(() => {
    // IoT simülatörünü başlat
    iotSimulator.startSimulation();
    
    const updateData = () => {
      const deviceData = iotSimulator.getDeviceStatus();
      setDevices(deviceData);
      setNetworkStats(iotSimulator.getNetworkStatistics());
      
      // Simulated product data
      setProducts([
        {
          id: 'P001',
          name: '500ml Su Şişesi',
          type: 'bottle',
          quantity: 15420,
          location: 'Depo A-1',
          status: 'in_stock',
          lastUpdated: new Date(),
          batchId: 'B2024-001',
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          qrCode: 'QR001'
        },
        {
          id: 'P002',
          name: '1L Su Şişesi',
          type: 'bottle',
          quantity: 8750,
          location: 'Depo A-2',
          status: 'in_stock',
          lastUpdated: new Date(),
          batchId: 'B2024-002',
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          qrCode: 'QR002'
        },
        {
          id: 'P003',
          name: 'Plastik Kapak',
          type: 'cap',
          quantity: 2400,
          location: 'Depo B-1',
          status: 'low_stock',
          lastUpdated: new Date(),
          batchId: 'B2024-003',
          qrCode: 'QR003'
        },
        {
          id: 'P004',
          name: 'Ürün Etiketi',
          type: 'label',
          quantity: 850,
          location: 'Depo C-1',
          status: 'low_stock',
          lastUpdated: new Date(),
          batchId: 'B2024-004',
          qrCode: 'QR004'
        },
        {
          id: 'P005',
          name: '12li Paket Shrink',
          type: 'packaging',
          quantity: 0,
          location: 'Depo D-1',
          status: 'out_of_stock',
          lastUpdated: new Date(),
          batchId: 'B2024-005',
          qrCode: 'QR005'
        },
        {
          id: 'P006',
          name: '24lü Koli',
          type: 'packaging',
          quantity: 3200,
          location: 'Depo D-2',
          status: 'in_transit',
          lastUpdated: new Date(),
          batchId: 'B2024-006',
          qrCode: 'QR006'
        }
      ]);

      // Simulated production metrics
      setProductionMetrics({
        totalProduced: 45672 + Math.floor(Math.random() * 100),
        hourlyRate: 1250 + Math.floor(Math.random() * 50),
        qualityScore: 96.8 + Math.random() * 2,
        efficiency: 92.3 + Math.random() * 5,
        wastePercentage: 2.1 + Math.random() * 0.5
      });
    };

    updateData();
    const interval = setInterval(updateData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Filter devices based on search and status
  useEffect(() => {
    let filtered = devices;
    
    if (searchTerm) {
      filtered = filtered.filter(device => 
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(device => device.status === statusFilter);
    }
    
    setFilteredDevices(filtered);
  }, [devices, searchTerm, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSensorTypeIcon = (type: string) => {
    switch (type) {
      case 'temperature': return '🌡️';
      case 'vibration': return '📳';
      case 'pressure': return '💨';
      case 'power': return '⚡';
      default: return '📊';
    }
  };

  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'bottle': return '🍼';
      case 'cap': return '🔘';
      case 'label': return '🏷️';
      case 'packaging': return '📦';
      default: return '📋';
    }
  };

  const getProductStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
      case 'low_stock': return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200';
      case 'out_of_stock': return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200';
      case 'in_transit': return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getProductStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock': return <Badge className="bg-green-100 text-green-800 border-green-300">✅ Stokta</Badge>;
      case 'low_stock': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">⚠️ Az Stok</Badge>;
      case 'out_of_stock': return <Badge className="bg-red-100 text-red-800 border-red-300">❌ Tükendi</Badge>;
      case 'in_transit': return <Badge className="bg-blue-100 text-blue-800 border-blue-300">🚚 Yolda</Badge>;
      default: return <Badge variant="outline">❓ Bilinmiyor</Badge>;
    }
  };

  // Device management functions
  const handleDeviceRestart = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    if (confirm(`🔄 CİHAZ YENİDEN BAŞLATMA\n\n"${device.name}" cihazını yeniden başlatmak istediğinizden emin misiniz?\n\nİşlem 30-60 saniye sürecektir.`)) {
      console.log(`Restarting device: ${deviceId}`);
      
      // Show loading state
      const updatedDevices = devices.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'offline' as const }
          : device
      );
      setDevices(updatedDevices);
      
      // Simulate restart process
      setTimeout(() => {
        const finalDevices = devices.map(device => 
          device.id === deviceId 
            ? { 
                ...device, 
                status: 'online' as const, 
                lastHeartbeat: new Date(),
                signalStrength: 95 + Math.random() * 5,
                batteryLevel: device.batteryLevel ? Math.min(100, device.batteryLevel + Math.random() * 5) : undefined
              }
            : device
        );
        setDevices(finalDevices);
        alert(`✅ "${device.name}" başarıyla yeniden başlatıldı!\n\n• Bağlantı durumu: Çevrimiçi\n• Sinyal gücü: Güçlü\n• Sistem durumu: Normal`);
      }, 3000);
    }
  };

  const handleDeviceCalibration = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    if (confirm(`🔧 CİHAZ KALİBRASYONU\n\n"${device.name}" cihazının kalibrasyonunu başlatmak istediğinizden emin misiniz?\n\nKalibrasyon süreci:\n• Sistem kontrolleri: 2 dakika\n• Sensör ayarları: 3 dakika\n• Test ölçümleri: 1 dakika\n\nToplam süre: ~6 dakika`)) {
      console.log(`Calibrating device: ${deviceId}`);
      
      alert(`🔧 Kalibrasyon Başlatıldı!\n\n"${device.name}" cihazının kalibrasyonu başlıyor...\n\n⏳ Lütfen bekleyiniz, işlem 6 dakika sürecektir.`);
      
      if (iotSimulator.calibrateDevice(deviceId)) {
        setTimeout(() => {
          const updatedDevices = devices.map(device => 
            device.id === deviceId 
              ? { 
                  ...device, 
                  status: 'online' as const, 
                  calibrationDate: new Date(),
                  nextCalibration: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
                  signalStrength: 98 + Math.random() * 2,
                  batteryLevel: device.batteryLevel
                }
              : device
          );
          setDevices(updatedDevices);
          
          alert(`✅ Kalibrasyon Tamamlandı!\n\n"${device.name}" cihazının kalibrasyonu başarıyla tamamlandı.\n\n📊 Kalibrasyon Raporu:\n• Doğruluk: %99.8\n• Hassasiyet: ±0.1%\n• Sıcaklık kompensasyonu: Aktif\n• Sonraki kalibrasyon: ${new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')}`);
        }, 2000);
      }
    }
  };

  const handleDeviceToggle = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    const isOnline = device.status === 'online';
    const action = isOnline ? 'durdurmak' : 'başlatmak';
    
    if (confirm(`${isOnline ? '⏸️ CİHAZ DURDURMA' : '▶️ CİHAZ BAŞLATMA'}\n\n"${device.name}" cihazını ${action} istediğinizden emin misiniz?\n\n${isOnline ? '⚠️ Cihaz durdurulursa veri akışı kesilecektir.' : '✅ Cihaz başlatılırsa veri akışı devam edecektir.'}`)) {
      console.log(`Toggling device: ${deviceId}`);
      
      const updatedDevices = devices.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              status: device.status === 'online' ? 'offline' as const : 'online' as const,
              lastHeartbeat: new Date(),
              signalStrength: device.status === 'online' ? 0 : 90 + Math.random() * 10
            }
            : device
      );
      setDevices(updatedDevices);
      
      setTimeout(() => {
        alert(`${isOnline ? '⏸️' : '▶️'} "${device.name}" cihazı başarıyla ${isOnline ? 'durduruldu' : 'başlatıldı'}!\n\n• Yeni durum: ${isOnline ? 'Çevrimdışı' : 'Çevrimiçi'}\n• Sistem durumu: ${isOnline ? 'Durduruldu' : 'Aktif'}`);
      }, 1000);
    }
  };

  const handleDeviceDetails = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    const details = `📊 CİHAZ DETAY BİLGİLERİ\n\n` +
      `🏷️ Cihaz Adı: ${device.name}\n` +
      `📍 Lokasyon: ${device.location}\n` +
      `🔧 Tip: ${device.type}\n` +
      `🌐 Durum: ${device.status === 'online' ? '✅ Çevrimiçi' : device.status === 'error' ? '❌ Hatalı' : '⚫ Çevrimdışı'}\n` +
      `📶 Sinyal Gücü: ${device.signalStrength.toFixed(1)}%\n` +
      `${device.batteryLevel ? `🔋 Batarya: ${device.batteryLevel.toFixed(1)}%\n` : ''}` +
      `💓 Son Heartbeat: ${device.lastHeartbeat.toLocaleString('tr-TR')}\n` +
      `🔧 Son Kalibrasyon: ${device.calibrationDate.toLocaleDateString('tr-TR')}\n` +
      `📅 Sonraki Kalibrasyon: ${device.nextCalibration.toLocaleDateString('tr-TR')}\n\n` +
      `📈 PERFORMANS METRİKLERİ:\n` +
      `• Çalışma süresi: ${Math.floor(Math.random() * 720 + 80)} saat\n` +
      `• Veri paketleri: ${Math.floor(Math.random() * 50000 + 10000)}\n` +
      `• Hata oranı: %${(Math.random() * 0.5).toFixed(2)}\n` +
      `• Ortalama gecikme: ${Math.floor(Math.random() * 50 + 10)}ms`;

    alert(details);
  };

  const handleRefreshDevices = () => {
    alert('🔄 CİHAZ LİSTESİ YENİLENİYOR...\n\nTüm cihazlar yeniden taranıyor ve durumları güncelleniyor.\n\n⏳ Lütfen bekleyiniz...');
    
    // Simulate refresh process
    setTimeout(() => {
      const updatedDevices = devices.map(device => ({
        ...device,
        lastHeartbeat: new Date(),
        signalStrength: device.status === 'online' ? 85 + Math.random() * 15 : 0,
        batteryLevel: device.batteryLevel ? Math.max(20, device.batteryLevel + (Math.random() - 0.5) * 10) : undefined
      }));
      setDevices(updatedDevices);
      
      setTimeout(() => {
        alert(`✅ YENİLEME TAMAMLANDI!\n\n📊 Güncellenen Bilgiler:\n• Cihaz durumları\n• Sinyal güçleri\n• Batarya seviyeleri\n• Heartbeat zamanları\n\n📱 ${devices.filter(d => d.status === 'online').length}/${devices.length} cihaz çevrimiçi`);
      }, 1500);
    }, 2000);
  };

  const exportDeviceData = () => {
    if (confirm('📊 RAPOR İNDİRME\n\nIoT cihaz raporunu PDF olarak indirmek istediğinizden emin misiniz?\n\nRapor içeriği:\n• Tüm cihaz bilgileri\n• Performans metrikleri\n• Ağ istatistikleri\n• Zaman damgası')) {
      // PDF export için PDFExportService kullan
      import('../utils/pdfExport').then(({ PDFExportService }) => {
        const sensorData = devices.map(device => ({
          id: device.id,
          type: device.type,
          value: Math.random() * 100, // Simulated sensor value
          unit: device.type === 'temperature' ? '°C' : 
                device.type === 'pressure' ? 'bar' : 
                device.type === 'vibration' ? 'Hz' : 
                device.type === 'flow' ? 'L/min' : 
                device.type === 'power' ? 'kW' : '%',
          status: device.status,
          timestamp: device.lastHeartbeat,
          location: device.location
        }));
        
        PDFExportService.exportIoTData(sensorData);
        
        setTimeout(() => {
          alert('✅ RAPOR İNDİRİLDİ!\n\nIoT cihaz raporu başarıyla PDF olarak bilgisayarınıza indirildi.\n\n📁 Dosya konumu: İndirilenler klasörü\n📊 Rapor formatı: PDF');
        }, 1000);
      });
    }
  };

  const handleProductDetails = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const getDetailedProductInfo = (product: Product) => {
    const dailyConsumption = Math.floor(Math.random() * 500 + 100);
    const estimatedDays = Math.floor(product.quantity / dailyConsumption);
    const supplierInfo = {
      'bottle': 'AquaPlast Manufacturing',
      'cap': 'CapTech Solutions',
      'label': 'PrintPro Labels',
      'packaging': 'PackSmart Industries'
    };
    
    return {
      dailyConsumption,
      estimatedDays,
      supplier: supplierInfo[product.type],
      lotNumber: `LOT-${Math.floor(Math.random() * 9999 + 1000)}`,
      unitCost: Math.random() * 2 + 0.5,
      totalValue: (Math.random() * 2 + 0.5) * product.quantity,
      lastMovement: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      reorderLevel: Math.floor(dailyConsumption * 7), // 7 günlük stok
      maxCapacity: Math.floor(product.quantity * 1.5),
      temperature: product.type === 'bottle' ? '18-22°C' : 'Oda sıcaklığı',
      humidity: '45-65%'
    };
  };

  const generateProductReport = (product: Product) => {
    // PDF export için PDFExportService kullan
    import('../utils/pdfExport').then(({ PDFExportService }) => {
      const productInfo = getDetailedProductInfo(product);
      const statusText = {
        'in_stock': 'Stokta',
        'low_stock': 'Düşük Stok',
        'out_of_stock': 'Stok Yok',
        'in_transit': 'Yolda'
      };

      const headers = [
        'Özellik',
        'Değer'
      ];

      const data = [
        ['Ürün Adı', product.name],
        ['Kategori', product.type.charAt(0).toUpperCase() + product.type.slice(1)],
        ['Miktar', `${product.quantity.toLocaleString('tr-TR')} adet`],
        ['Konum', product.location],
        ['Durum', statusText[product.status]],
        ['Batch ID', product.batchId],
        ['QR Kod', product.qrCode],
        ['Son Güncelleme', product.lastUpdated.toLocaleString('tr-TR')],
        ['Son Kullanma Tarihi', product.expiryDate ? product.expiryDate.toLocaleDateString('tr-TR') : 'Belirtilmemiş'],
        ['Günlük Tüketim', `${productInfo.dailyConsumption.toLocaleString('tr-TR')} adet`],
        ['Tahmini Süre', `${productInfo.estimatedDays} gün`],
        ['Yeniden Sipariş Seviyesi', `${productInfo.reorderLevel.toLocaleString('tr-TR')} adet`],
        ['Maksimum Kapasite', `${productInfo.maxCapacity.toLocaleString('tr-TR')} adet`],
        ['Birim Maliyet', `₺${productInfo.unitCost.toFixed(2)}`],
        ['Toplam Değer', `₺${productInfo.totalValue.toLocaleString('tr-TR', {maximumFractionDigits: 2})}`],
        ['Tedarikçi', productInfo.supplier],
        ['Lot Numarası', productInfo.lotNumber],
        ['Sıcaklık', productInfo.temperature],
        ['Nem', productInfo.humidity],
        ['Son Hareket', productInfo.lastMovement.toLocaleDateString('tr-TR')]
      ];

      const currentDate = new Date();
      const fileName = `urun-raporu-${product.batchId}-${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}.pdf`;

      PDFExportService.exportToPDF({
        title: 'Ürün Detay Raporu',
        subtitle: `${product.name} - Batch ID: ${product.batchId}`,
        headers,
        data,
        filename: fileName
      });
    });
  };

  const generateQRCode = (product: Product) => {
    const productInfo = getDetailedProductInfo(product);
    const qrData = {
      productName: product.name,
      category: product.type,
      quantity: product.quantity,
      location: product.location,
      status: product.status,
      batchId: product.batchId,
      qrCode: product.qrCode,
      lastUpdated: product.lastUpdated.toISOString(),
      supplier: productInfo.supplier,
      lotNumber: productInfo.lotNumber,
      unitCost: productInfo.unitCost.toFixed(2),
      totalValue: productInfo.totalValue.toFixed(2),
      expiryDate: product.expiryDate ? product.expiryDate.toISOString() : null,
      dailyConsumption: productInfo.dailyConsumption,
      estimatedDays: productInfo.estimatedDays,
      temperature: productInfo.temperature,
      humidity: productInfo.humidity
    };

    const qrString = JSON.stringify(qrData);
    setQrCodeData(qrString);
    setShowQRCode(true);
  };

  const generateQRCodeSVG = (data: string) => {
    // Basit QR kod oluşturucu (gerçek projede qrcode.js gibi bir kütüphane kullanılmalı)
    const size = 200;
    const modules = 25; // QR kod modül sayısı
    const moduleSize = size / modules;
    
    // Basit bir pattern oluştur (gerçek QR kod değil, sadece görsel)
    let svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
    svgContent += `<rect width="${size}" height="${size}" fill="white"/>`;
    
    // QR kod pattern'i simüle et
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        // Basit bir pattern oluştur (data'ya göre)
        const shouldFill = (i + j + data.length) % 3 === 0 || 
                          (i === 0 || i === modules-1 || j === 0 || j === modules-1) ||
                          (i < 7 && j < 7) || (i < 7 && j > modules-8) || (i > modules-8 && j < 7);
        
        if (shouldFill) {
          svgContent += `<rect x="${j * moduleSize}" y="${i * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
        }
      }
    }
    
    svgContent += '</svg>';
    return svgContent;
  };

  const generateTransportPlan = (product: Product) => {
    const productInfo = getDetailedProductInfo(product);
    
    // Taşıma senaryoları
    const transportScenarios = [
      {
        id: 1,
        name: 'Standart Kargo',
        duration: '2-3 gün',
        cost: 150,
        reliability: 95,
        icon: '📦',
        description: 'Ekonomik ve güvenilir standart teslimat',
        carrier: 'AquaLogistics Kargo',
        trackingAvailable: true
      },
      {
        id: 2,
        name: 'Hızlı Teslimat',
        duration: '1-2 gün',
        cost: 280,
        reliability: 98,
        icon: '🚀',
        description: 'Acil durumlar için hızlı teslimat',
        carrier: 'FastMove Express',
        trackingAvailable: true
      },
      {
        id: 3,
        name: 'Aynı Gün Teslimat',
        duration: '4-8 saat',
        cost: 450,
        reliability: 92,
        icon: '⚡',
        description: 'Kritik ihtiyaçlar için aynı gün teslimat',
        carrier: 'RapidFlow Logistics',
        trackingAvailable: true
      }
    ];

    // Mevcut konumdan hedef konumlara mesafe hesabı (simüle)
    const destinations = [
      { name: 'Depo B-1', distance: 2.5, estimatedTime: '15 dakika' },
      { name: 'Depo C-1', distance: 4.8, estimatedTime: '25 dakika' },
      { name: 'Depo D-1', distance: 7.2, estimatedTime: '35 dakika' },
      { name: 'Üretim Hattı A', distance: 1.2, estimatedTime: '8 dakika' },
      { name: 'Kalite Kontrol', distance: 3.1, estimatedTime: '18 dakika' },
      { name: 'Sevkiyat Alanı', distance: 6.5, estimatedTime: '30 dakika' }
    ];

    // Araç bilgileri
    const vehicles = [
      {
        id: 'V001',
        type: 'Forklift',
        capacity: '2 ton',
        status: 'Müsait',
        location: 'Depo A-1',
        operator: 'Mehmet Özkan',
        icon: '🏗️'
      },
      {
        id: 'V002',
        type: 'Elektrikli Kargo Arabası',
        capacity: '500 kg',
        status: 'Kullanımda',
        location: 'Depo B-2',
        operator: 'Ayşe Demir',
        icon: '🚛'
      },
      {
        id: 'V003',
        type: 'Manuel Palet Jack',
        capacity: '1 ton',
        status: 'Müsait',
        location: 'Depo A-2',
        operator: 'Hasan Yılmaz',
        icon: '🔧'
      }
    ];

    // Önerilen taşıma planı
    const recommendedPlan = {
      priority: product.status === 'out_of_stock' ? 'Kritik' : 
                product.status === 'low_stock' ? 'Yüksek' : 'Normal',
      estimatedWeight: Math.round(product.quantity * 0.05 * 100) / 100, // kg
      recommendedVehicle: vehicles.find(v => v.status === 'Müsait'),
      estimatedDuration: '25-45 dakika',
      optimalTime: 'Vardiya arası (14:00-15:00)',
      specialRequirements: product.type === 'bottle' ? ['Kırılma riski', 'Dikkatli taşıma'] : 
                          product.type === 'packaging' ? ['Hacimli yük', 'Geniş araç'] : ['Standart taşıma'],
      route: destinations.slice(0, 3),
      totalCost: 75 + (Math.round(product.quantity * 0.001 * 10) / 10)
    };

    const plan = {
      product,
      productInfo,
      transportScenarios,
      destinations,
      vehicles,
      recommendedPlan,
      plannedDate: new Date(),
      plannedBy: 'Sistem Otomatiği'
    };

    setTransportPlan(plan);
    setShowTransportPlanning(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 space-y-8">
        {/* Modern Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🏭 IoT & Ürün İzleme Sistemi
            </h1>
            <p className="text-gray-600 mt-2">Gerçek zamanlı üretim ve stok takibi</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-white/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Sistem Aktif</span>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
              <Settings2 className="w-4 h-4 mr-2" />
              Ayarlar
            </Button>
          </div>
        </div>

        {/* Production Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Toplam Üretim</p>
                  <p className="text-2xl font-bold text-indigo-600">{productionMetrics.totalProduced.toLocaleString('tr-TR')}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Saatlik Üretim</p>
                  <p className="text-2xl font-bold text-green-600">{productionMetrics.hourlyRate}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Kalite Skoru</p>
                  <p className="text-2xl font-bold text-purple-600">%{productionMetrics.qualityScore.toFixed(1)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Verimlilik</p>
                  <p className="text-2xl font-bold text-blue-600">%{productionMetrics.efficiency.toFixed(1)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Atık Oranı</p>
                  <p className="text-2xl font-bold text-orange-600">%{productionMetrics.wastePercentage.toFixed(1)}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg rounded-full p-1">
            <TabsTrigger value="products" className="rounded-full px-6 py-3 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Package className="w-4 h-4" />
              🎯 Ürün Takibi
            </TabsTrigger>
            <TabsTrigger value="devices" className="rounded-full px-6 py-3 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Smartphone className="w-4 h-4" />
              📡 IoT Cihazları
            </TabsTrigger>
            <TabsTrigger value="network" className="rounded-full px-6 py-3 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Globe className="w-4 h-4" />
              🌐 Ağ Durumu
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  📦 Ürün Stok Durumu
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    {products.length} Ürün Takipte
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className={`${getProductStatusColor(product.status)} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl bg-white/50 p-2 rounded-lg">
                              {getProductTypeIcon(product.type)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">{product.name}</h3>
                              <p className="text-sm text-gray-600">{product.location}</p>
                            </div>
                          </div>
                          {getProductStatusBadge(product.status)}
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Miktar:</span>
                            <span className="text-lg font-bold text-gray-800">
                              {product.quantity.toLocaleString('tr-TR')} adet
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Batch ID:</span>
                            <span className="text-sm bg-white/70 px-2 py-1 rounded font-mono">{product.batchId}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">QR Kod:</span>
                            <span className="text-sm bg-white/70 px-2 py-1 rounded font-mono">{product.qrCode}</span>
                          </div>

                          {product.expiryDate && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">Son Kullanma:</span>
                              <span className="text-sm text-gray-600">
                                {product.expiryDate.toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Son Güncelleme:</span>
                            <span className="text-xs text-gray-500">
                              {product.lastUpdated.toLocaleTimeString('tr-TR')}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/50">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleProductDetails(product.id)}
                            className="w-full bg-white/50 hover:bg-white/80 border-white/50"
                          >
                            📊 Detayları Görüntüle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

                     {/* Devices Tab */}
           <TabsContent value="devices">
             <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
               <CardHeader>
                 <div className="flex items-center justify-between">
                   <CardTitle className="flex items-center gap-3 text-xl">
                     <div className="bg-gradient-to-r from-green-600 to-teal-600 p-2 rounded-lg">
                       <Smartphone className="w-6 h-6 text-white" />
                     </div>
                     📱 IoT Cihaz Listesi
                     <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
                       {devices.filter(d => d.status === 'online').length}/{devices.length} Aktif
                     </Badge>
                   </CardTitle>
                   
                   <div className="flex items-center gap-3">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       onClick={exportDeviceData}
                       className="bg-white/50 hover:bg-white/80"
                     >
                       <Download className="w-4 h-4 mr-2" />
                       📊 Rapor İndir
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={handleRefreshDevices}
                       className="bg-white/50 hover:bg-white/80"
                     >
                       <RefreshCw className="w-4 h-4 mr-2" />
                       🔄 Yenile
                     </Button>
                   </div>
                 </div>

                 {/* Search and Filter Controls */}
                 <div className="flex flex-col md:flex-row gap-4 mt-4 p-4 bg-white/30 rounded-lg border border-white/50">
                   <div className="flex-1">
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input
                         type="text"
                         placeholder="🔍 Cihaz ara (isim, lokasyon, tip)..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full pl-10 pr-4 py-2 bg-white/70 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     <Filter className="w-4 h-4 text-gray-600" />
                     <select
                       value={statusFilter}
                       onChange={(e) => setStatusFilter(e.target.value as any)}
                       className="px-3 py-2 bg-white/70 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                       <option value="all">🌐 Tüm Durumlar</option>
                       <option value="online">✅ Çevrimiçi</option>
                       <option value="offline">⚫ Çevrimdışı</option>
                       <option value="error">❌ Hatalı</option>
                     </select>
                   </div>
                   
                   <div className="text-sm text-gray-600 flex items-center gap-2">
                     <span>📋 {filteredDevices.length} / {devices.length} cihaz</span>
                   </div>
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredDevices.map((device) => (
                    <Card key={device.id} className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl bg-gradient-to-r from-blue-100 to-purple-100 p-2 rounded-lg">
                              {getSensorTypeIcon(device.type)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">{device.name}</h3>
                              <p className="text-sm text-gray-600">{device.location}</p>
                            </div>
                          </div>
                          <div className="bg-white/70 p-2 rounded-lg">
                            {getStatusIcon(device.status)}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Sinyal Gücü:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={device.signalStrength} className="w-16 h-2" />
                              <span className="text-sm font-bold">{device.signalStrength.toFixed(0)}%</span>
                            </div>
                          </div>

                          {device.batteryLevel && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">Batarya:</span>
                              <div className="flex items-center gap-2">
                                <Progress value={device.batteryLevel} className="w-16 h-2" />
                                <span className="text-sm font-bold">{device.batteryLevel.toFixed(0)}%</span>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Son Heartbeat:</span>
                            <span className="text-xs text-gray-500">
                              {device.lastHeartbeat.toLocaleTimeString('tr-TR')}
                            </span>
                          </div>
                        </div>

                                                 <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                           <Badge 
                             variant="outline" 
                             className={`w-full justify-center py-2 ${
                               device.status === 'online' ? 'bg-green-50 text-green-700 border-green-200' : 
                               device.status === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 
                               'bg-gray-50 text-gray-700 border-gray-200'
                             }`}
                           >
                             {device.status === 'online' ? '✅ ÇEVRIMIÇI' : 
                              device.status === 'error' ? '❌ HATA' : '⚫ ÇEVRIMDIŞI'}
                           </Badge>

                           {/* Device Management Buttons */}
                           <div className="flex gap-2">
                             <Button 
                               variant="outline" 
                               size="sm" 
                               onClick={() => handleDeviceToggle(device.id)}
                               className="flex-1 bg-white/50 hover:bg-white/80 text-xs"
                             >
                               {device.status === 'online' ? 
                                 <><Pause className="w-3 h-3 mr-1" />Durdur</> : 
                                 <><Play className="w-3 h-3 mr-1" />Başlat</>
                               }
                             </Button>
                             
                             {device.status === 'error' && (
                               <Button 
                                 variant="outline" 
                                 size="sm" 
                                 onClick={() => handleDeviceRestart(device.id)}
                                 className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 text-xs"
                               >
                                 <RefreshCw className="w-3 h-3 mr-1" />
                                 Yeniden Başlat
                               </Button>
                             )}
                             
                             <Button 
                               variant="outline" 
                               size="sm" 
                               onClick={() => handleDeviceCalibration(device.id)}
                               className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 text-xs"
                             >
                               <Wrench className="w-3 h-3 mr-1" />
                               Kalibrasyon
                             </Button>
                           </div>

                           {/* Additional Info */}
                           <div className="text-xs text-gray-500 space-y-1">
                             <div className="flex justify-between">
                               <span>🔧 Son Kalibrasyon:</span>
                               <span>{device.calibrationDate.toLocaleDateString('tr-TR')}</span>
                             </div>
                             <div className="flex justify-between">
                               <span>📅 Sonraki Kalibrasyon:</span>
                               <span className={`${
                                 (device.nextCalibration.getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 7 
                                   ? 'text-red-600 font-medium' 
                                   : 'text-gray-500'
                               }`}>
                                 {device.nextCalibration.toLocaleDateString('tr-TR')}
                               </span>
                             </div>
                           </div>
                         </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network">
            {networkStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Toplam Cihaz</p>
                        <p className="text-3xl font-bold text-blue-600">{networkStats.totalDevices}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Router className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Çevrimiçi</p>
                        <p className="text-3xl font-bold text-green-600">{networkStats.onlineDevices}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <Wifi className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Hatalı</p>
                        <p className="text-3xl font-bold text-red-600">{networkStats.errorDevices}</p>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Düşük Batarya</p>
                        <p className="text-3xl font-bold text-orange-600">{networkStats.lowBatteryDevices}</p>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-full">
                        <Battery className="w-8 h-8 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modern Ürün Detay Paneli */}
      {showProductDetail && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const productInfo = getDetailedProductInfo(selectedProduct);
              const statusText = {
                'in_stock': '✅ Stokta',
                'low_stock': '⚠️ Düşük Stok',
                'out_of_stock': '❌ Stok Yok',
                'in_transit': '🚛 Yolda'
              };
              
              return (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">📦 Ürün Detay Paneli</h2>
                        <p className="text-blue-100 text-lg">
                          {selectedProduct.name} - {selectedProduct.type.charAt(0).toUpperCase() + selectedProduct.type.slice(1)}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="text-white hover:bg-white hover:text-blue-600"
                        onClick={() => setShowProductDetail(false)}
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Temel Bilgiler */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Ana Bilgiler */}
                      <div className="md:col-span-2 space-y-4">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                            <Package className="w-5 h-5" />
                            Temel Ürün Bilgileri
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">📦 Ürün Adı:</span>
                                <span className="font-bold text-gray-800">{selectedProduct.name}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">📂 Kategori:</span>
                                <span className="font-medium capitalize">{selectedProduct.type}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">📊 Miktar:</span>
                                <span className="font-bold text-blue-600 text-lg">{selectedProduct.quantity.toLocaleString('tr-TR')} adet</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">📍 Konum:</span>
                                <span className="font-medium">{selectedProduct.location}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">🏷️ Batch ID:</span>
                                <span className="bg-gray-200 px-2 py-1 rounded font-mono text-sm">{selectedProduct.batchId}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">📱 QR Kod:</span>
                                <span className="bg-gray-200 px-2 py-1 rounded font-mono text-sm">{selectedProduct.qrCode}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">🔄 Durum:</span>
                                <Badge className={`
                                  ${selectedProduct.status === 'in_stock' ? 'bg-green-100 text-green-800' : ''}
                                  ${selectedProduct.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${selectedProduct.status === 'out_of_stock' ? 'bg-red-100 text-red-800' : ''}
                                  ${selectedProduct.status === 'in_transit' ? 'bg-blue-100 text-blue-800' : ''}
                                `}>
                                  {statusText[selectedProduct.status]}
                                </Badge>
                              </div>
                              {selectedProduct.expiryDate && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600 font-medium">📅 Son Kullanma:</span>
                                  <span className="font-medium">{selectedProduct.expiryDate.toLocaleDateString('tr-TR')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Durum Kartı */}
                      <div className="space-y-4">
                        <div className={`${getProductStatusColor(selectedProduct.status)} rounded-lg p-6 text-center`}>
                          <div className="text-4xl mb-2">{getProductTypeIcon(selectedProduct.type)}</div>
                          <h3 className="font-bold text-lg text-gray-800 mb-2">Stok Durumu</h3>
                          {getProductStatusBadge(selectedProduct.status)}
                          <div className="mt-4 space-y-2">
                            <div className="bg-white bg-opacity-50 rounded p-3">
                              <p className="text-sm text-gray-700">Son Güncelleme</p>
                              <p className="font-medium">{selectedProduct.lastUpdated.toLocaleString('tr-TR')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stok Analizi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          📊 Stok Analizi
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-blue-700">Günlük Tüketim:</span>
                            <span className="font-bold text-blue-800">{productInfo.dailyConsumption.toLocaleString('tr-TR')} adet</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-blue-700">Tahmini Süre:</span>
                            <span className="font-bold text-blue-800">{productInfo.estimatedDays} gün</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-blue-700">Yeniden Sipariş Seviyesi:</span>
                            <span className="font-bold text-blue-800">{productInfo.reorderLevel.toLocaleString('tr-TR')} adet</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-blue-700">Maksimum Kapasite:</span>
                            <span className="font-bold text-blue-800">{productInfo.maxCapacity.toLocaleString('tr-TR')} adet</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          💰 Mali Bilgiler
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-green-700">Birim Maliyet:</span>
                            <span className="font-bold text-green-800">₺{productInfo.unitCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-green-700">Toplam Değer:</span>
                            <span className="font-bold text-green-800">₺{productInfo.totalValue.toLocaleString('tr-TR', {maximumFractionDigits: 2})}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-green-700">Tedarikçi:</span>
                            <span className="font-bold text-green-800">{productInfo.supplier}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-green-700">Lot Numarası:</span>
                            <span className="font-bold text-green-800">{productInfo.lotNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Depolama Koşulları */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h3 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
                        <Archive className="w-5 h-5" />
                        🌡️ Depolama Koşulları
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white bg-opacity-50 rounded p-4 text-center">
                          <p className="text-sm text-orange-700">Sıcaklık</p>
                          <p className="font-bold text-orange-800">{productInfo.temperature}</p>
                        </div>
                        <div className="bg-white bg-opacity-50 rounded p-4 text-center">
                          <p className="text-sm text-orange-700">Nem</p>
                          <p className="font-bold text-orange-800">{productInfo.humidity}</p>
                        </div>
                        <div className="bg-white bg-opacity-50 rounded p-4 text-center">
                          <p className="text-sm text-orange-700">Son Hareket</p>
                          <p className="font-bold text-orange-800">{productInfo.lastMovement.toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                    </div>

                                         {/* Eylem Butonları */}
                     <div className="flex gap-3 pt-4 border-t">
                       <Button 
                         className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                         onClick={() => generateProductReport(selectedProduct)}
                       >
                         <FileText className="w-4 h-4 mr-2" />
                         📄 Rapor Oluştur
                       </Button>
                       <Button 
                         variant="outline" 
                         className="flex-1"
                         onClick={() => generateQRCode(selectedProduct)}
                       >
                         <QrCode className="w-4 h-4 mr-2" />
                         📱 QR Kod Yazdır
                       </Button>
                       <Button 
                         variant="outline" 
                         className="flex-1"
                         onClick={() => generateTransportPlan(selectedProduct)}
                       >
                         <TruckIcon className="w-4 h-4 mr-2" />
                         🚛 Taşıma Planla
                       </Button>
                       <Button 
                         variant="secondary"
                         onClick={() => setShowProductDetail(false)}
                       >
                         Kapat
                       </Button>
                     </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
             )}

      {/* QR Kod Modal */}
      {showQRCode && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">📱 QR Kod Görüntüleyici</h2>
                  <p className="text-green-100">
                    {selectedProduct.name} - QR Kod Bilgileri
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white hover:text-green-600"
                  onClick={() => setShowQRCode(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QR Kod */}
                <div className="text-center">
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div 
                      className="mx-auto mb-4"
                      dangerouslySetInnerHTML={{ __html: generateQRCodeSVG(qrCodeData) }}
                    />
                    <p className="text-sm text-gray-600 mb-2">QR Kod</p>
                    <Badge className="bg-green-100 text-green-800">
                      Ürün Bilgileri Kodlanmış
                    </Badge>
                  </div>
                </div>

                {/* QR Kod İçeriği */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 mb-3">📋 QR Kod İçeriği</h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                      {JSON.stringify(JSON.parse(qrCodeData), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Kullanım Bilgileri */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📖 QR Kod Kullanım Bilgileri</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Bu QR kod, ürünün tüm detay bilgilerini içermektedir</li>
                  <li>• Mobil cihazlarla taratarak ürün bilgilerine erişebilirsiniz</li>
                  <li>• QR kod JSON formatında yapılandırılmış veri içerir</li>
                  <li>• Stok takibi ve envanter yönetiminde kullanılabilir</li>
                </ul>
              </div>

              {/* QR Kod Özellikleri */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Format</p>
                  <p className="font-medium">JSON</p>
                </div>
                <div className="bg-white border rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Boyut</p>
                  <p className="font-medium">200x200</p>
                </div>
                <div className="bg-white border rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Kodlama</p>
                  <p className="font-medium">UTF-8</p>
                </div>
                <div className="bg-white border rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Veri Boyutu</p>
                  <p className="font-medium">{Math.round(qrCodeData.length / 1024 * 100) / 100} KB</p>
                </div>
              </div>

              {/* Eylem Butonları */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    // QR kodu görsel olarak yazdır
                    const printWindow = window.open('', '_blank');
                    const qrSvg = generateQRCodeSVG(qrCodeData);
                    printWindow?.document.write(`
                      <html>
                        <head>
                          <title>QR Kod - ${selectedProduct.name}</title>
                          <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                            .qr-container { display: inline-block; padding: 20px; border: 2px solid #000; }
                            .product-info { margin: 10px 0; font-size: 14px; }
                            @media print { body { margin: 0; } }
                          </style>
                        </head>
                        <body>
                          <div class="qr-container">
                            <h2>${selectedProduct.name}</h2>
                            <div class="product-info">
                              <strong>Batch ID:</strong> ${selectedProduct.batchId}<br>
                              <strong>QR Kod:</strong> ${selectedProduct.qrCode}<br>
                              <strong>Miktar:</strong> ${selectedProduct.quantity.toLocaleString('tr-TR')} adet<br>
                              <strong>Konum:</strong> ${selectedProduct.location}
                            </div>
                            ${qrSvg}
                            <div class="product-info">
                              <small>Tarih: ${new Date().toLocaleString('tr-TR')}</small>
                            </div>
                          </div>
                          <script>window.print(); window.close();</script>
                        </body>
                      </html>
                    `);
                    printWindow?.document.close();
                  }}
                >
                  🖨️ QR Kodu Yazdır
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    // QR kod verisini panoya kopyala
                    navigator.clipboard.writeText(qrCodeData).then(() => {
                      alert('QR kod verisi panoya kopyalandı!');
                    });
                  }}
                >
                  📋 Veriyi Kopyala
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // QR kod görselini indir
                    const svg = generateQRCodeSVG(qrCodeData);
                    const blob = new Blob([svg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `qr-kod-${selectedProduct.batchId}.svg`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  💾 QR İndir
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowQRCode(false)}
                >
                  Kapat
                </Button>
              </div>
            </div>
                     </div>
         </div>
       )}

      {/* Taşıma Planlama Modal */}
      {showTransportPlanning && transportPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">🚛 Taşıma Planlama Sistemi</h2>
                  <p className="text-orange-100 text-lg">
                    {transportPlan.product.name} - Lojistik Planlama
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white hover:text-orange-600"
                  onClick={() => setShowTransportPlanning(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Üst Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ürün Özeti */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Ürün Bilgileri
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ürün:</span>
                      <span className="font-medium">{transportPlan.product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Miktar:</span>
                      <span className="font-medium">{transportPlan.product.quantity.toLocaleString('tr-TR')} adet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ağırlık:</span>
                      <span className="font-medium">{transportPlan.recommendedPlan.estimatedWeight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kaynak:</span>
                      <span className="font-medium">{transportPlan.product.location}</span>
                    </div>
                  </div>
                </div>

                {/* Öncelik Bilgisi */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Öncelik Durumu
                  </h3>
                  <div className="text-center">
                    <Badge className={`text-lg px-4 py-2 ${
                      transportPlan.recommendedPlan.priority === 'Kritik' ? 'bg-red-100 text-red-800' :
                      transportPlan.recommendedPlan.priority === 'Yüksek' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {transportPlan.recommendedPlan.priority} Öncelik
                    </Badge>
                    <p className="text-sm text-blue-700 mt-2">
                      Tahmini Süre: {transportPlan.recommendedPlan.estimatedDuration}
                    </p>
                    <p className="text-sm text-blue-700">
                      Optimal Zaman: {transportPlan.recommendedPlan.optimalTime}
                    </p>
                  </div>
                </div>

                {/* Maliyet Özeti */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Maliyet Analizi
                  </h3>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">₺{transportPlan.recommendedPlan.totalCost}</p>
                    <p className="text-sm text-green-700">İç Taşıma Maliyeti</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-green-600">• Araç maliyeti dahil</p>
                      <p className="text-xs text-green-600">• Operatör ücreti dahil</p>
                      <p className="text-xs text-green-600">• Yakıt maliyeti dahil</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mevcut Araçlar */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TruckIcon className="w-5 h-5" />
                  🚗 Mevcut Araçlar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {transportPlan.vehicles.map((vehicle: any) => (
                    <div key={vehicle.id} className={`border-2 rounded-lg p-4 ${
                      vehicle.status === 'Müsait' ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{vehicle.icon}</span>
                          <div>
                            <h4 className="font-medium text-gray-800">{vehicle.type}</h4>
                            <p className="text-sm text-gray-600">{vehicle.id}</p>
                          </div>
                        </div>
                        <Badge variant={vehicle.status === 'Müsait' ? 'default' : 'secondary'}>
                          {vehicle.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Kapasite:</span>
                          <span className="font-medium">{vehicle.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Konum:</span>
                          <span className="font-medium">{vehicle.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Operatör:</span>
                          <span className="font-medium">{vehicle.operator}</span>
                        </div>
                      </div>
                      {vehicle.status === 'Müsait' && (
                        <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white">
                          ✅ Seç
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hedef Konumlar */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  📍 Hedef Konumlar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {transportPlan.destinations.map((destination: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{destination.name}</h4>
                        <Badge variant="outline">{destination.distance} km</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Tahmini süre: {destination.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dış Taşıma Seçenekleri */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TruckIcon className="w-5 h-5" />
                  🚚 Dış Taşıma Seçenekleri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {transportPlan.transportScenarios.map((scenario: any) => (
                    <div key={scenario.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{scenario.icon}</span>
                          <h4 className="font-medium text-gray-800">{scenario.name}</h4>
                        </div>
                        <Badge variant="outline">₺{scenario.cost}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">{scenario.description}</p>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Süre:</span>
                          <span className="font-medium">{scenario.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Güvenilirlik:</span>
                          <span className="font-medium">%{scenario.reliability}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taşıyıcı:</span>
                          <span className="font-medium text-xs">{scenario.carrier}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-3">
                        📞 Teklif Al
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Özel Gereksinimler */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  ⚠️ Özel Gereksinimler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-2">Taşıma Koşulları:</h4>
                    <ul className="space-y-1">
                      {transportPlan.recommendedPlan.specialRequirements.map((req: string, index: number) => (
                        <li key={index} className="text-sm text-yellow-700 flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-2">Dikkat Edilecekler:</h4>
                    <ul className="space-y-1 text-sm text-yellow-700">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Sıcaklık kontrolü gerekli
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Nem oranı %45-65 arası
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Ürün güvenlik protokolü
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Eylem Butonları */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  📅 Taşımayı Planla
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  📋 Plan Raporu
                </Button>
                <Button variant="outline" className="flex-1">
                  <User className="w-4 h-4 mr-2" />
                  👥 Ekip Ata
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowTransportPlanning(false)}
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

export default IoTMonitor; 