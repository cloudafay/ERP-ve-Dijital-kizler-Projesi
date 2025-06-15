import React, { useState } from 'react';
import BackToHomeButton from '../components/BackToHomeButton';

const QualityPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('metrics');

  const qualityMetrics = {
    overall: { score: 98.7, trend: '+2.1%', status: 'excellent' },
    defectRate: { value: 0.8, unit: '%', target: 1.0, status: 'good' },
    customerSatisfaction: { value: 94.5, unit: '%', target: 90.0, status: 'excellent' },
    returnRate: { value: 0.3, unit: '%', target: 0.5, status: 'excellent' },
    firstPassYield: { value: 99.2, unit: '%', target: 98.0, status: 'excellent' }
  };

  const qualityTests = [
    {
      id: 'QT-001',
      product: 'Su Şişesi 500ml',
      test: 'Sızıntı Testi',
      batch: 'B2024-0115-001',
      status: 'passed',
      operator: 'Ayşe Kaya',
      timestamp: '2024-01-15 14:30',
      result: 'Başarılı - Sızıntı yok'
    },
    {
      id: 'QT-002', 
      product: 'Su Şişesi 1L',
      test: 'Basınç Dayanımı',
      batch: 'B2024-0115-002',
      status: 'failed',
      operator: 'Mehmet Çelik',
      timestamp: '2024-01-15 13:45',
      result: 'Başarısız - Basınç 2.1 bar altında'
    },
    {
      id: 'QT-003',
      product: 'Su Şişesi 500ml',
      test: 'Etiket Kalitesi',
      batch: 'B2024-0115-003',
      status: 'passed',
      operator: 'Fatma Demir',
      timestamp: '2024-01-15 12:15',
      result: 'Başarılı - Etiket merkezi'
    },
    {
      id: 'QT-004',
      product: 'Su Şişesi 1.5L',
      test: 'Dolum Hacmi',
      batch: 'B2024-0115-004',
      status: 'warning',
      operator: 'Ali Yılmaz',
      timestamp: '2024-01-15 11:20',
      result: 'Uyarı - 1495ml (5ml eksik)'
    }
  ];

  const nonConformities = [
    {
      id: 'NC-001',
      title: 'Etiket Kaydırma Sorunu',
      product: 'Su Şişesi 500ml',
      severity: 'medium',
      status: 'in-investigation',
      reportedBy: 'Ayşe Kaya',
      date: '2024-01-15 10:30',
      description: 'Etiketlerin 2-3mm sola kaydığı tespit edildi.',
      rootCause: 'Araştırılıyor',
      corrective: 'Etiketleme makinesinin kalibrasyonu yapılacak'
    },
    {
      id: 'NC-002',
      title: 'Basınç Dayanımı Düşüklüğü',
      product: 'Su Şişesi 1L',
      severity: 'high',
      status: 'corrective-action',
      reportedBy: 'Mehmet Çelik',
      date: '2024-01-15 13:45',
      description: 'Batch B2024-0115-002 şişelerinde basınç dayanımı düşük.',
      rootCause: 'Üfleme sıcaklığı standart altında',
      corrective: 'Sıcaklık ayarları düzeltildi, batch karantinaya alındı'
    },
    {
      id: 'NC-003',
      title: 'Dolum Hacmi Eksikliği',
      product: 'Su Şişesi 1.5L',
      severity: 'low',
      status: 'completed',
      reportedBy: 'Ali Yılmaz',
      date: '2024-01-15 11:20',
      description: '5ml dolum eksikliği tespit edildi.',
      rootCause: 'Dolum pompası ayarı',
      corrective: 'Pompa kalibrasyonu yapıldı - Tamamlandı'
    }
  ];

  const qualityStandards = [
    {
      standard: 'ISO 9001:2015',
      scope: 'Kalite Yönetim Sistemi',
      status: 'certified',
      validUntil: '2025-03-15',
      certBody: 'TÜV SÜD'
    },
    {
      standard: 'ISO 22000:2018',
      scope: 'Gıda Güvenliği',
      status: 'certified',
      validUntil: '2024-11-20',
      certBody: 'SGS'
    },
    {
      standard: 'HACCP',
      scope: 'Gıda Güvenliği Analizi',
      status: 'certified',
      validUntil: '2024-08-10',
      certBody: 'Bureau Veritas'
    },
    {
      standard: 'TSE 266',
      scope: 'İçme Suyu Standardı',
      status: 'renewal-required',
      validUntil: '2024-02-28',
      certBody: 'TSE'
    }
  ];

  const handleCreateTest = () => {
    alert('🧪 YENİ KALİTE TESTİ\n\nÜrün: [Seçiniz]\nTest Türü: [Seçiniz]\nBatch No: [Giriniz]\nOperatör: [Atayınız]\nTest Saati: [Şimdi]\n\nTest oluşturuluyor...');
  };

  const handleCreateNCR = () => {
    alert('📋 UYGUNSUZLUK RAPORU\n\nBaşlık: [Giriniz]\nÜrün: [Seçiniz]\nCiddiyet: [Yüksek/Orta/Düşük]\nAçıklama: [Detay]\nRaporlayan: [Adınız]\n\nUygunsuzluk raporu oluşturuluyor...');
  };

  const handleInvestigateNC = (ncId: string) => {
    alert(`🔍 UYGUNSUZLUK ARAŞTIRMASI\n\nRapor No: ${ncId}\n\nKök Neden Analizi:\n• 5 Neden Tekniği\n• Balık Kılçığı Diyagramı\n• Pareto Analizi\n\nDüzeltici Eylem Planı:\n• Acil Eylem\n• Kalıcı Çözüm\n• Önleyici Tedbirler\n\nAraştırma başlatılıyor...`);
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
              ✅ Kalite Yönetimi
            </h1>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>
              Kalite kontrol ve uygunluk yönetimi
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <BackToHomeButton />
            <button
              onClick={handleCreateNCR}
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
              📋 Uygunsuzluk Raporu
            </button>
            <button
              onClick={handleCreateTest}
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
              🧪 Yeni Test
            </button>
          </div>
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
            { id: 'metrics', label: 'Kalite Metrikleri', icon: '📊' },
            { id: 'tests', label: 'Test Sonuçları', icon: '🧪' },
            { id: 'nonconformities', label: 'Uygunsuzluklar', icon: '⚠️' },
            { id: 'standards', label: 'Sertifikalar', icon: '📋' }
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
        {selectedTab === 'metrics' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Genel Kalite Skoru */}
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
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🏆 Genel Kalite Skoru
              </h2>
              
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  fontSize: '4rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #10b981, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '8px'
                }}>
                  {qualityMetrics.overall.score}%
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#10b981'
                }}>
                  📈 {qualityMetrics.overall.trend}
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    (Bu ay)
                  </span>
                </div>
              </div>
              
              <div style={{
                padding: '16px',
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                border: '1px solid #bbf7d0',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#166534', marginBottom: '4px' }}>
                  🌟 Mükemmel Performans
                </div>
                <div style={{ fontSize: '0.875rem', color: '#15803d' }}>
                  Hedefin %8.7 üzerinde kalite skoru
                </div>
              </div>
            </div>

            {/* Detaylı Metrikler */}
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
                📈 Detaylı Metrikler
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'defectRate', label: 'Hata Oranı', icon: '🔍', good: 'low' },
                  { key: 'customerSatisfaction', label: 'Müşteri Memnuniyeti', icon: '😊', good: 'high' },
                  { key: 'returnRate', label: 'İade Oranı', icon: '↩️', good: 'low' },
                  { key: 'firstPassYield', label: 'İlk Geçiş Verimi', icon: '✅', good: 'high' }
                ].map((metric) => {
                  const data = qualityMetrics[metric.key as keyof typeof qualityMetrics];
                  const isGood = metric.good === 'high' ? 
                    (data as any).value >= (data as any).target : 
                    (data as any).value <= (data as any).target;
                  
                  return (
                    <div key={metric.key} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.25rem' }}>{metric.icon}</span>
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                            {metric.label}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            Hedef: {(data as any).target}{(data as any).unit}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: isGood ? '#10b981' : '#ef4444'
                        }}>
                          {(data as any).value}{(data as any).unit}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: isGood ? '#10b981' : '#ef4444'
                        }}>
                          {isGood ? '✅ Hedefte' : '⚠️ Hedef Dışı'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'tests' && (
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
              🧪 Son Test Sonuçları
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {qualityTests.map((test) => (
                <div key={test.id} style={{
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
                      backgroundColor: test.status === 'passed' ? '#dcfce7' : 
                                     test.status === 'failed' ? '#fee2e2' : '#fef3c7',
                      borderRadius: '12px'
                    }}>
                      {test.status === 'passed' ? '✅' : 
                       test.status === 'failed' ? '❌' : '⚠️'}
                    </div>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontWeight: '600' }}>{test.id}</span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: test.status === 'passed' ? '#dcfce7' : 
                                         test.status === 'failed' ? '#fee2e2' : '#fef3c7',
                          color: test.status === 'passed' ? '#166534' : 
                                 test.status === 'failed' ? '#dc2626' : '#d97706'
                        }}>
                          {test.status === 'passed' ? 'BAŞARILI' : 
                           test.status === 'failed' ? 'BAŞARISIZ' : 'UYARI'}
                        </span>
                      </div>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                        {test.product} - {test.test}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                        Batch: {test.batch} • {test.result}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        👤 {test.operator} • 🕐 {test.timestamp}
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
                    Detay
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'nonconformities' && (
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
              ⚠️ Uygunsuzluk Raporları
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {nonConformities.map((nc) => (
                <div key={nc.id} style={{
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#6b7280'
                        }}>
                          {nc.id}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: nc.severity === 'high' ? '#fee2e2' : 
                                         nc.severity === 'medium' ? '#fef3c7' : '#f0f9ff',
                          color: nc.severity === 'high' ? '#dc2626' : 
                                 nc.severity === 'medium' ? '#d97706' : '#0284c7'
                        }}>
                          {nc.severity === 'high' ? 'YÜKSEK' : 
                           nc.severity === 'medium' ? 'ORTA' : 'DÜŞÜK'}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: nc.status === 'in-investigation' ? '#fef3c7' : 
                                         nc.status === 'corrective-action' ? '#dbeafe' : '#dcfce7',
                          color: nc.status === 'in-investigation' ? '#d97706' : 
                                 nc.status === 'corrective-action' ? '#1d4ed8' : '#166534'
                        }}>
                          {nc.status === 'in-investigation' ? '🔍 ARAŞTIRMADA' : 
                           nc.status === 'corrective-action' ? '🔧 DÜZELTİCİ EYLEM' : '✅ TAMAMLANDI'}
                        </span>
                      </div>
                      <h3 style={{
                        fontWeight: '600',
                        marginBottom: '8px',
                        fontSize: '1rem'
                      }}>
                        {nc.title}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        {nc.description}
                      </p>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        <strong>Kök Neden:</strong> {nc.rootCause}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        <strong>Düzeltici Eylem:</strong> {nc.corrective}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        <span>🏭 {nc.product}</span>
                        <span>👤 {nc.reportedBy}</span>
                        <span>📅 {nc.date}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                      {nc.status === 'in-investigation' && (
                        <button
                          onClick={() => handleInvestigateNC(nc.id)}
                          style={{
                            padding: '8px 12px',
                            fontSize: '0.75rem',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          🔍 Araştır
                        </button>
                      )}
                      <button style={{
                        padding: '8px 12px',
                        fontSize: '0.75rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}>
                        Detay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'standards' && (
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
              📋 Kalite Sertifikaları ve Standartlar
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {qualityStandards.map((standard, index) => (
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
                      backgroundColor: standard.status === 'certified' ? '#dcfce7' : '#fee2e2',
                      borderRadius: '12px'
                    }}>
                      {standard.status === 'certified' ? '✅' : '⚠️'}
                    </div>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                          {standard.standard}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: standard.status === 'certified' ? '#dcfce7' : '#fee2e2',
                          color: standard.status === 'certified' ? '#166534' : '#dc2626'
                        }}>
                          {standard.status === 'certified' ? 'GEÇERLİ' : 'YENİLEME GEREKLİ'}
                        </span>
                      </div>
                      <div style={{ fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        {standard.scope}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        <span>🏢 {standard.certBody}</span>
                        <span>📅 Geçerlilik: {standard.validUntil}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button style={{
                    padding: '8px 12px',
                    fontSize: '0.75rem',
                    backgroundColor: standard.status === 'certified' ? '#3b82f6' : '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}>
                    {standard.status === 'certified' ? '📄 Sertifika' : '🔄 Yenile'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityPage; 