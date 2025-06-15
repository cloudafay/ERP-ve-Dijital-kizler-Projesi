import React, { useState } from 'react';
import BackToHomeButton from '../components/BackToHomeButton';

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('production');
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const reports = [
    { 
      id: 'production', 
      name: 'Üretim Raporu', 
      icon: '📊',
      description: 'Günlük, haftalık ve aylık üretim verileri',
      color: '#3b82f6'
    },
    { 
      id: 'quality', 
      name: 'Kalite Raporu', 
      icon: '✅',
      description: 'Kalite kontrol ve hata analizleri',
      color: '#10b981'
    },
    { 
      id: 'maintenance', 
      name: 'Bakım Raporu', 
      icon: '🔧',
      description: 'Bakım faaliyetleri ve maliyet analizi',
      color: '#f59e0b'
    },
    { 
      id: 'energy', 
      name: 'Enerji Raporu', 
      icon: '⚡',
      description: 'Enerji tüketimi ve verimlilik',
      color: '#8b5cf6'
    },
    { 
      id: 'financial', 
      name: 'Mali Rapor', 
      icon: '💰',
      description: 'Maliyet analizi ve karlılık',
      color: '#ef4444'
    },
    { 
      id: 'inventory', 
      name: 'Stok Raporu', 
      icon: '📦',
      description: 'Hammadde ve ürün stok durumu',
      color: '#06b6d4'
    }
  ];

  const mockData = {
    production: {
      today: { value: '15,420', unit: 'adet', change: '+5.2%', trend: 'up' },
      week: { value: '98,750', unit: 'adet', change: '+12.8%', trend: 'up' },
      month: { value: '421,230', unit: 'adet', change: '+8.4%', trend: 'up' },
      details: [
        { metric: 'Ortalama Saatlik Üretim', value: '642 adet/saat' },
        { metric: 'Makine Verimliliği', value: '%94.2' },
        { metric: 'Hedef Karşılanma', value: '%108.5' },
        { metric: 'En Üretken Vardiya', value: 'Gündüz (08:00-16:00)' }
      ]
    },
    quality: {
      today: { value: '99.2%', unit: 'başarı', change: '+0.8%', trend: 'up' },
      week: { value: '98.9%', unit: 'başarı', change: '+1.2%', trend: 'up' },
      month: { value: '98.7%', unit: 'başarı', change: '+2.1%', trend: 'up' },
      details: [
        { metric: 'Hatalı Ürün Oranı', value: '%0.8' },
        { metric: 'Müşteri Şikayeti', value: '3 adet' },
        { metric: 'Kalite Kontrol Geçiş', value: '%99.2' },
        { metric: 'Retür Oranı', value: '%0.3' }
      ]
    },
    maintenance: {
      today: { value: '3', unit: 'bakım', change: '-2', trend: 'down' },
      week: { value: '18', unit: 'bakım', change: '+4', trend: 'up' },
      month: { value: '76', unit: 'bakım', change: '-8', trend: 'down' },
      details: [
        { metric: 'Önleyici Bakım Oranı', value: '%78.9' },
        { metric: 'Ortalama Arıza Süresi', value: '2.4 saat' },
        { metric: 'Bakım Maliyeti', value: '₺ 42,350' },
        { metric: 'Makine Kullanılabilirlik', value: '%96.1' }
      ]
    },
    energy: {
      today: { value: '2,840', unit: 'kWh', change: '-3.2%', trend: 'down' },
      week: { value: '18,650', unit: 'kWh', change: '+2.1%', trend: 'up' },
      month: { value: '84,230', unit: 'kWh', change: '-5.8%', trend: 'down' },
      details: [
        { metric: 'Enerji Verimliliği', value: '2.8 kWh/ürün' },
        { metric: 'Karbon Ayak İzi', value: '1.2 ton CO2' },
        { metric: 'Enerji Maliyeti', value: '₺ 15,890' },
        { metric: 'Yenilenebilir Enerji', value: '%23.4' }
      ]
    }
  };

  const currentData = mockData[selectedReport as keyof typeof mockData] || mockData.production;

  const handleExportReport = () => {
    const reportData = {
      reportType: selectedReport,
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      data: currentData
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport}-raporu-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('📊 Rapor başarıyla indirildi!');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleScheduleReport = () => {
    alert('📧 Rapor Zamanlama\n\nRapor otomatik gönderim ayarları:\n• Günlük: Her gün 09:00\n• Haftalık: Pazartesi 09:00\n• Aylık: Ayın 1\'i 09:00\n\nE-posta adresi: mustafa.yardim@aquatech.com');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 50%, #e8eaf6 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #2563eb, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              📊 Analitik Raporlar
            </h1>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>
              Detaylı performans analizleri ve veri raporları
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <BackToHomeButton />
            <button
              onClick={handleScheduleReport}
              style={{
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                color: '#374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📧 Zamanla
            </button>
            <button
              onClick={handlePrintReport}
              style={{
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                color: '#374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🖨️ Yazdır
            </button>
            <button
              onClick={handleExportReport}
              style={{
                padding: '12px 16px',
                background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📥 İndir
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
          
          {/* Sol Panel - Rapor Türleri */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📋 Rapor Türleri
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    background: selectedReport === report.id 
                      ? `linear-gradient(135deg, ${report.color}15, ${report.color}05)`
                      : 'transparent',
                    boxShadow: selectedReport === report.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <div style={{
                    fontSize: '1.5rem',
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: selectedReport === report.id ? report.color + '20' : '#f3f4f6'
                  }}>
                    {report.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: selectedReport === report.id ? '600' : '500',
                      color: selectedReport === report.id ? report.color : '#374151',
                      marginBottom: '4px'
                    }}>
                      {report.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: '1.3'
                    }}>
                      {report.description}
                    </div>
                  </div>
                  {selectedReport === report.id && (
                    <div style={{
                      width: '4px',
                      height: '24px',
                      backgroundColor: report.color,
                      borderRadius: '2px'
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sağ Panel - Rapor İçeriği */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Period Selector */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  📅 Rapor Dönemi
                </h3>
                
                <div style={{
                  display: 'flex',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '12px',
                  padding: '4px'
                }}>
                  {[
                    { id: 'today', label: 'Bugün' },
                    { id: 'week', label: 'Bu Hafta' },
                    { id: 'month', label: 'Bu Ay' }
                  ].map((period) => (
                    <button
                      key={period.id}
                      onClick={() => setSelectedPeriod(period.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: selectedPeriod === period.id ? 'white' : 'transparent',
                        color: selectedPeriod === period.id ? '#374151' : '#6b7280',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: selectedPeriod === period.id ? '600' : '400',
                        boxShadow: selectedPeriod === period.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ana Metrikler */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {reports.find(r => r.id === selectedReport)?.icon} {reports.find(r => r.id === selectedReport)?.name} - {
                  selectedPeriod === 'today' ? 'Bugün' :
                  selectedPeriod === 'week' ? 'Bu Hafta' : 'Bu Ay'
                }
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '24px'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: reports.find(r => r.id === selectedReport)?.color,
                    marginBottom: '8px'
                  }}>
                    {currentData[selectedPeriod as keyof typeof currentData]?.value}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '8px'
                  }}>
                    {currentData[selectedPeriod as keyof typeof currentData]?.unit}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: currentData[selectedPeriod as keyof typeof currentData]?.trend === 'up' ? '#10b981' : '#ef4444'
                  }}>
                    {currentData[selectedPeriod as keyof typeof currentData]?.trend === 'up' ? '📈' : '📉'}
                    {currentData[selectedPeriod as keyof typeof currentData]?.change}
                  </div>
                </div>
              </div>

              {/* Detaylar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {currentData.details?.map((detail, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '4px'
                    }}>
                      {detail.metric}
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {detail.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grafik Placeholder */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ fontSize: '3rem' }}>📈</div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Interaktif Grafik
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                maxWidth: '400px'
              }}>
                Bu alan gelişmiş grafik kütüphanesi entegrasyonu ile trend analizleri, 
                karşılaştırmalı grafikler ve interaktif veri görselleştirmeleri içerecektir.
              </div>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#e5e7eb',
                border: 'none',
                borderRadius: '6px',
                color: '#6b7280',
                cursor: 'not-allowed'
              }}>
                🚧 Yakında
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 