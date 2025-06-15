import React, { useState } from 'react';
import BackToHomeButton from '../components/BackToHomeButton';

const DataPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const dataStats = {
    totalSize: '847.2 GB',
    dailyGrowth: '+2.3 GB',
    retentionDays: 2555,
    backupStatus: 'healthy',
    lastBackup: '2024-01-15 03:00'
  };

  const databases = [
    {
      name: 'Production_Data',
      type: 'PostgreSQL',
      size: '324.5 GB',
      status: 'healthy',
      lastBackup: '2024-01-15 03:00',
      records: '15.2M',
      description: 'Üretim verileri ve makine logları'
    },
    {
      name: 'Quality_Data',
      type: 'PostgreSQL',
      size: '89.7 GB',
      status: 'healthy',
      lastBackup: '2024-01-15 03:15',
      records: '4.1M',
      description: 'Kalite test sonuçları ve uygunsuzluklar'
    },
    {
      name: 'User_Data',
      type: 'PostgreSQL',
      size: '12.3 GB',
      status: 'healthy',
      lastBackup: '2024-01-15 03:30',
      records: '156K',
      description: 'Kullanıcı bilgileri ve yetkilendirme'
    },
    {
      name: 'Analytics_Cache',
      type: 'Redis',
      size: '8.9 GB',
      status: 'warning',
      lastBackup: 'N/A',
      records: '892K',
      description: 'Analitik veriler için önbellek'
    },
    {
      name: 'File_Storage',
      type: 'MinIO',
      size: '411.8 GB',
      status: 'healthy',
      lastBackup: '2024-01-15 04:00',
      records: '98.7K',
      description: 'Raporlar, dökümanlar ve medya dosyaları'
    }
  ];

  const backupJobs = [
    {
      id: 'BJ-001',
      name: 'Günlük Tam Yedek',
      schedule: 'Her gün 03:00',
      status: 'completed',
      lastRun: '2024-01-15 03:00',
      nextRun: '2024-01-16 03:00',
      duration: '47 dakika',
      size: '847.2 GB'
    },
    {
      id: 'BJ-002',
      name: 'Saatlik Artımlı Yedek',
      schedule: 'Her saat',
      status: 'running',
      lastRun: '2024-01-15 14:00',
      nextRun: '2024-01-15 15:00',
      duration: '3 dakika',
      size: '2.1 GB'
    },
    {
      id: 'BJ-003',
      name: 'Haftalık Arşiv',
      schedule: 'Pazar 02:00',
      status: 'scheduled',
      lastRun: '2024-01-14 02:00',
      nextRun: '2024-01-21 02:00',
      duration: '2.5 saat',
      size: '1.2 TB'
    }
  ];

  const dataRetention = [
    {
      category: 'Üretim Verileri',
      retention: '7 yıl',
      currentAge: '3.2 yıl',
      size: '324.5 GB',
      policy: 'Yasal gereklilik',
      autoDelete: true
    },
    {
      category: 'Kalite Kayıtları',
      retention: '10 yıl',
      currentAge: '2.8 yıl',
      size: '89.7 GB',
      policy: 'ISO 9001',
      autoDelete: true
    },
    {
      category: 'Kullanıcı Logları',
      retention: '1 yıl',
      currentAge: '8 ay',
      size: '5.2 GB',
      policy: 'KVKK',
      autoDelete: true
    },
    {
      category: 'Analitik Veriler',
      retention: '2 yıl',
      currentAge: '1.3 yıl',
      size: '156.8 GB',
      policy: 'İş kuralı',
      autoDelete: false
    },
    {
      category: 'Medya Dosyaları',
      retention: '5 yıl',
      currentAge: '1.8 yıl',
      size: '411.8 GB',
      policy: 'Dokümantasyon',
      autoDelete: false
    }
  ];

  const dataQuality = [
    { metric: 'Veri Bütünlüğü', score: 99.7, status: 'excellent' },
    { metric: 'Tutarlılık', score: 98.2, status: 'excellent' },
    { metric: 'Eksiksizlik', score: 96.8, status: 'good' },
    { metric: 'Doğruluk', score: 99.1, status: 'excellent' },
    { metric: 'Güncellik', score: 94.5, status: 'good' }
  ];

  const handleBackupNow = () => {
    alert('💾 MANUEL YEDEKLEME\n\nYedekleme türü: Tam yedek\nTahmini süre: 45-60 dakika\nDepolama alanı: ~850 GB\nÖncelik: Yüksek\n\nYedekleme başlatılsın mı?');
  };

  const handleRestoreData = () => {
    alert('🔄 VERİ GERİ YÜKLEME\n\n⚠️ DİKKAT: Bu işlem mevcut verileri etkileyebilir!\n\nGeri yükleme noktası seçiniz:\n• 2024-01-15 03:00 (Son tam yedek)\n• 2024-01-15 14:00 (Son artımlı)\n• Özel tarih seçimi\n\nDevam etmek için yetkilendirme gerekli.');
  };

  const handleExportData = () => {
    alert('📤 VERİ DIŞA AKTARMA\n\nFormat seçiniz:\n• CSV (Elektronik tablo)\n• JSON (API entegrasyonu)\n• SQL (Veritabanı)\n• PDF (Rapor)\n\nVeri aralığı:\n• Son 24 saat\n• Son 7 gün\n• Son 30 gün\n• Özel aralık\n\nDışa aktarma hazırlanıyor...');
  };

  const handleOptimizeDatabase = () => {
    alert('⚡ VERİTABANI OPTİMİZASYONU\n\nOptimizasyon işlemleri:\n• Index yeniden oluşturma\n• Fragmente tabloları birleştirme\n• İstatistikleri güncelleme\n• Geçici dosyaları temizleme\n\nTahmini süre: 15-20 dakika\nSistem performansı geçici olarak etkilenebilir.\n\nOptimizasyon başlatılsın mı?');
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
              💾 Veri Yönetimi
            </h1>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>
              Veri yedekleme, arşivleme ve kalite yönetimi
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <BackToHomeButton />
            <button
              onClick={handleExportData}
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
              📤 Dışa Aktar
            </button>
            <button
              onClick={handleRestoreData}
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
              🔄 Geri Yükle
            </button>
            <button
              onClick={handleBackupNow}
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
              💾 Manuel Yedek
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Toplam Veri', value: dataStats.totalSize, icon: '💾', color: '#3b82f6' },
            { label: 'Günlük Artış', value: dataStats.dailyGrowth, icon: '📈', color: '#10b981' },
            { label: 'Saklama Süresi', value: `${dataStats.retentionDays} gün`, icon: '📅', color: '#f59e0b' },
            { label: 'Son Yedek', value: dataStats.lastBackup.split(' ')[1], icon: '🕐', color: '#8b5cf6' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: stat.color,
                marginBottom: '4px'
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '24px',
          display: 'flex',
          gap: '4px'
        }}>
          {[
            { id: 'overview', label: 'Genel Bakış', icon: '📊' },
            { id: 'databases', label: 'Veritabanları', icon: '💾' },
            { id: 'backups', label: 'Yedeklemeler', icon: '🔄' },
            { id: 'retention', label: 'Saklama Politikaları', icon: '📅' },
            { id: 'quality', label: 'Veri Kalitesi', icon: '✅' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: selectedTab === tab.id ? 'white' : 'transparent',
                color: selectedTab === tab.id ? '#374151' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: selectedTab === tab.id ? '600' : '400',
                boxShadow: selectedTab === tab.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {selectedTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Sistem Durumu */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🖥️ Sistem Durumu
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '12px',
                  border: '1px solid #bbf7d0'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#166534' }}>
                      💾 Yedekleme Sistemi
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#15803d' }}>
                      Tüm sistemler sağlıklı
                    </div>
                  </div>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981'
                  }} />
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '12px',
                  border: '1px solid #bbf7d0'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#166534' }}>
                      🔄 Otomatik Yedekleme
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#15803d' }}>
                      Günlük yedekleme aktif
                    </div>
                  </div>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981'
                  }} />
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '12px',
                  border: '1px solid #bbf7d0'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#166534' }}>
                      📊 Veri Kalitesi
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#15803d' }}>
                      %98.2 kalite skoru
                    </div>
                  </div>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981'
                  }} />
                </div>
              </div>
            </div>

            {/* Hızlı İşlemler */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ⚡ Hızlı İşlemler
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={handleBackupNow}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600' }}>💾 Manuel Yedekleme</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      Anlık tam sistem yedeki
                    </div>
                  </div>
                  <div>▶️</div>
                </button>
                
                <button
                  onClick={handleOptimizeDatabase}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600' }}>⚡ Veritabanı Optimizasyonu</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      Performans iyileştirmesi
                    </div>
                  </div>
                  <div>▶️</div>
                </button>
                
                <button
                  onClick={handleExportData}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600' }}>📤 Veri Dışa Aktarma</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      Raporlar ve analiz için
                    </div>
                  </div>
                  <div>▶️</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'databases' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💾 Veritabanı Sistemleri
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {databases.map((db, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      padding: '12px',
                      backgroundColor: db.status === 'healthy' ? '#dcfce7' : '#fef3c7',
                      borderRadius: '12px'
                    }}>
                      💾
                    </div>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                          {db.name}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: '#e5e7eb',
                          color: '#6b7280'
                        }}>
                          {db.type}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: db.status === 'healthy' ? '#dcfce7' : '#fef3c7',
                          color: db.status === 'healthy' ? '#166534' : '#d97706'
                        }}>
                          {db.status === 'healthy' ? '✅ SAĞLIKLI' : '⚠️ UYARI'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                        {db.description}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        <span>💾 {db.size}</span>
                        <span>📊 {db.records} kayıt</span>
                        <span>🕐 Son yedek: {db.lastBackup}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button style={{
                    padding: '8px 12px',
                    fontSize: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}>
                    Yönet
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'backups' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🔄 Yedekleme İşleri
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {backupJobs.map((job) => (
                <div key={job.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      padding: '12px',
                      backgroundColor: job.status === 'completed' ? '#dcfce7' : 
                                     job.status === 'running' ? '#dbeafe' : '#fef3c7',
                      borderRadius: '12px'
                    }}>
                      {job.status === 'completed' ? '✅' : 
                       job.status === 'running' ? '🔄' : '📅'}
                    </div>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                          {job.name}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: job.status === 'completed' ? '#dcfce7' : 
                                         job.status === 'running' ? '#dbeafe' : '#fef3c7',
                          color: job.status === 'completed' ? '#166534' : 
                                 job.status === 'running' ? '#1d4ed8' : '#d97706'
                        }}>
                          {job.status === 'completed' ? 'TAMAMLANDI' : 
                           job.status === 'running' ? 'ÇALIŞIYOR' : 'PLANLI'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                        📅 {job.schedule}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        <span>🕐 Son: {job.lastRun}</span>
                        <span>⏰ Sonraki: {job.nextRun}</span>
                        <span>⏱️ Süre: {job.duration}</span>
                        <span>💾 Boyut: {job.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button style={{
                    padding: '8px 12px',
                    fontSize: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}>
                    Düzenle
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'retention' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📅 Veri Saklama Politikaları
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {dataRetention.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                        {item.category}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: item.autoDelete ? '#dcfce7' : '#fef3c7',
                        color: item.autoDelete ? '#166534' : '#d97706'
                      }}>
                        {item.autoDelete ? '🤖 OTOMATİK' : '👤 MANUEL'}
                      </span>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '12px',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <div>
                        <span style={{ fontWeight: '500' }}>Saklama Süresi:</span> {item.retention}
                      </div>
                      <div>
                        <span style={{ fontWeight: '500' }}>Mevcut Yaş:</span> {item.currentAge}
                      </div>
                      <div>
                        <span style={{ fontWeight: '500' }}>Boyut:</span> {item.size}
                      </div>
                      <div>
                        <span style={{ fontWeight: '500' }}>Politika:</span> {item.policy}
                      </div>
                    </div>
                  </div>
                  
                  <button style={{
                    padding: '8px 12px',
                    fontSize: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginLeft: '16px'
                  }}>
                    Düzenle
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'quality' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ✅ Veri Kalitesi Metrikleri
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {dataQuality.map((metric, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                        {metric.metric}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: metric.status === 'excellent' ? '#dcfce7' : '#fef3c7',
                        color: metric.status === 'excellent' ? '#166534' : '#d97706'
                      }}>
                        {metric.status === 'excellent' ? '🌟 MÜKEMMELs' : '👍 İYİ'}
                      </span>
                    </div>
                    
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${metric.score}%`,
                        height: '100%',
                        backgroundColor: metric.status === 'excellent' ? '#10b981' : '#f59e0b',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                  
                  <div style={{
                    textAlign: 'right',
                    marginLeft: '20px'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: metric.status === 'excellent' ? '#10b981' : '#f59e0b'
                    }}>
                      %{metric.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPage; 