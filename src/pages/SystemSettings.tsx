import React, { useState } from 'react';
import BackToHomeButton from '../components/BackToHomeButton';

const SystemSettingsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('general');
  
  // State for various settings
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [theme, setTheme] = useState('light');

  const systemInfo = {
    version: 'v2.1.4',
    buildDate: '2024-01-10',
    uptime: '15 gün 8 saat',
    lastUpdate: '2024-01-10 14:30',
    dbVersion: 'PostgreSQL 15.2',
    nodeVersion: 'Node.js 18.17.0'
  };

  const configSettings = [
    {
      category: 'Genel Ayarlar',
      settings: [
        { key: 'auto_refresh', label: 'Otomatik Yenileme', type: 'toggle', value: autoRefresh },
        { key: 'refresh_interval', label: 'Yenileme Aralığı (saniye)', type: 'number', value: refreshInterval },
        { key: 'theme', label: 'Tema', type: 'select', value: theme, options: ['light', 'dark', 'auto'] },
        { key: 'language', label: 'Dil', type: 'select', value: 'tr', options: ['tr', 'en'] }
      ]
    },
    {
      category: 'Bildirimler',
      settings: [
        { key: 'email_notifications', label: 'E-posta Bildirimleri', type: 'toggle', value: emailNotifications },
        { key: 'push_notifications', label: 'Anlık Bildirimler', type: 'toggle', value: pushNotifications },
        { key: 'alert_threshold', label: 'Uyarı Eşiği (%)', type: 'number', value: 85 },
        { key: 'notification_sound', label: 'Bildirim Sesi', type: 'toggle', value: true }
      ]
    },
    {
      category: 'Sistem',
      settings: [
        { key: 'maintenance_mode', label: 'Bakım Modu', type: 'toggle', value: maintenanceMode },
        { key: 'debug_mode', label: 'Hata Ayıklama Modu', type: 'toggle', value: debugMode },
        { key: 'log_level', label: 'Log Seviyesi', type: 'select', value: 'info', options: ['error', 'warn', 'info', 'debug'] },
        { key: 'session_timeout', label: 'Oturum Zaman Aşımı (dakika)', type: 'number', value: 120 }
      ]
    }
  ];

  const integrations = [
    {
      name: 'SAP ERP',
      status: 'connected',
      type: 'ERP',
      lastSync: '2024-01-15 14:30',
      config: { host: 'sap.aquatech.local', port: 3300 }
    },
    {
      name: 'Microsoft Teams',
      status: 'connected',
      type: 'Collaboration',
      lastSync: '2024-01-15 14:25',
      config: { webhook: 'https://outlook.office.com/webhook/...' }
    },
    {
      name: 'MQTT Broker',
      status: 'connected',
      type: 'IoT',
      lastSync: '2024-01-15 14:35',
      config: { host: 'mqtt.aquatech.local', port: 1883 }
    },
    {
      name: 'Grafana',
      status: 'error',
      type: 'Monitoring',
      lastSync: '2024-01-15 12:00',
      config: { url: 'http://grafana.aquatech.local:3000' }
    },
    {
      name: 'Backup Service',
      status: 'connected',
      type: 'Storage',
      lastSync: '2024-01-15 03:00',
      config: { provider: 'MinIO', bucket: 'aquatech-backups' }
    }
  ];

  const systemLogs = [
    {
      timestamp: '2024-01-15 14:30:15',
      level: 'INFO',
      component: 'UserAuth',
      message: 'Kullanıcı Mustafa Yardım sisteme giriş yaptı',
      ip: '192.168.1.102'
    },
    {
      timestamp: '2024-01-15 14:25:32',
      level: 'WARN',
      component: 'Database',
      message: 'Yavaş sorgu tespit edildi - execution time: 2.3s',
      query: 'SELECT * FROM production_data WHERE...'
    },
    {
      timestamp: '2024-01-15 14:20:45',
      level: 'ERROR',
      component: 'Integration',
      message: 'Grafana bağlantısı başarısız - Connection timeout',
      details: 'http://grafana.aquatech.local:3000'
    },
    {
      timestamp: '2024-01-15 14:15:12',
      level: 'INFO',
      component: 'Backup',
      message: 'Otomatik yedekleme tamamlandı - 847.2GB',
      duration: '47 dakika'
    }
  ];

  const handleSaveSettings = () => {
    alert('💾 AYARLAR KAYDET\n\nDeğişen ayarlar:\n• Otomatik Yenileme: ' + (autoRefresh ? 'Açık' : 'Kapalı') + '\n• Yenileme Aralığı: ' + refreshInterval + ' saniye\n• E-posta Bildirimleri: ' + (emailNotifications ? 'Açık' : 'Kapalı') + '\n• Bakım Modu: ' + (maintenanceMode ? 'Açık' : 'Kapalı') + '\n\nAyarlar kaydediliyor...');
  };

  const handleRestartSystem = () => {
    alert('🔄 SİSTEM YENİDEN BAŞLATMA\n\n⚠️ DİKKAT: Bu işlem sistemi geçici olarak kullanılamaz hale getirecektir!\n\nTahmini süre: 2-3 dakita\nEtkilenen kullanıcılar: Tüm aktif kullanıcılar\nVeri kaybı: Olmayacak\n\nDevam etmek için yönetici onayı gerekli.');
  };

  const handleTestIntegration = (name: string) => {
    alert(`🔗 ENTEGRASYON TESTİ\n\nServis: ${name}\nTest türü: Bağlantı kontrolü\nBeklenen süre: 10-15 saniye\n\nTest başlatılıyor...`);
  };

  const handleExportLogs = () => {
    alert('📄 LOG DOSYALARI DIŞA AKTAR\n\nFormat: JSON/CSV/TXT\nTarih aralığı: Son 7 gün\nFiltreleme: Tüm seviyeler\nBoyut: ~125MB\n\nDışa aktarma hazırlanıyor...');
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
              ⚙️ Sistem Ayarları
            </h1>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>
              Sistem konfigürasyonu ve yönetim ayarları
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <BackToHomeButton />
            <button
              onClick={handleRestartSystem}
              style={{
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #dc2626',
                borderRadius: '8px',
                color: '#dc2626',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🔄 Sistem Yeniden Başlat
            </button>
            <button
              onClick={handleSaveSettings}
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
              💾 Ayarları Kaydet
            </button>
          </div>
        </div>

        {/* System Info Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Sistem Sürümü', value: systemInfo.version, icon: '📱', color: '#3b82f6' },
            { label: 'Çalışma Süresi', value: systemInfo.uptime, icon: '⏰', color: '#10b981' },
            { label: 'Son Güncelleme', value: systemInfo.lastUpdate.split(' ')[0], icon: '🔄', color: '#f59e0b' },
            { label: 'Database', value: systemInfo.dbVersion.split(' ')[1], icon: '💾', color: '#8b5cf6' }
          ].map((info, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{info.icon}</div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: info.color,
                marginBottom: '4px'
              }}>
                {info.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {info.label}
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
            { id: 'general', label: 'Genel Ayarlar', icon: '⚙️' },
            { id: 'integrations', label: 'Entegrasyonlar', icon: '🔗' },
            { id: 'logs', label: 'Sistem Logları', icon: '📋' },
            { id: 'maintenance', label: 'Bakım', icon: '🔧' }
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
        {selectedTab === 'general' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            {configSettings.map((category, categoryIndex) => (
              <div key={categoryIndex} style={{
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
                  {category.category}
                </h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px'
                }}>
                  {category.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                          {setting.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {setting.key}
                        </div>
                      </div>
                      
                      <div>
                        {setting.type === 'toggle' && (
                          <button
                            onClick={() => {
                              if (setting.key === 'auto_refresh') setAutoRefresh(!autoRefresh);
                              if (setting.key === 'email_notifications') setEmailNotifications(!emailNotifications);
                              if (setting.key === 'push_notifications') setPushNotifications(!pushNotifications);
                              if (setting.key === 'maintenance_mode') setMaintenanceMode(!maintenanceMode);
                              if (setting.key === 'debug_mode') setDebugMode(!debugMode);
                            }}
                            style={{
                              width: '44px',
                              height: '24px',
                              backgroundColor: setting.value ? '#3b82f6' : '#d1d5db',
                              borderRadius: '12px',
                              border: 'none',
                              position: 'relative',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{
                              width: '20px',
                              height: '20px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              position: 'absolute',
                              top: '2px',
                              left: setting.value ? '22px' : '2px',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }} />
                          </button>
                        )}
                        
                        {setting.type === 'number' && (
                          <input
                            type="number"
                            value={setting.value}
                            onChange={(e) => {
                              if (setting.key === 'refresh_interval') setRefreshInterval(Number(e.target.value));
                            }}
                            style={{
                              width: '80px',
                              padding: '8px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '0.875rem'
                            }}
                          />
                        )}
                        
                        {setting.type === 'select' && (
                          <select
                            value={setting.value}
                            onChange={(e) => {
                              if (setting.key === 'theme') setTheme(e.target.value);
                            }}
                            style={{
                              padding: '8px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              backgroundColor: 'white'
                            }}
                          >
                            {setting.options?.map((option) => (
                              <option key={option} value={option}>
                                {option === 'light' ? 'Açık' :
                                 option === 'dark' ? 'Koyu' :
                                 option === 'auto' ? 'Otomatik' :
                                 option === 'tr' ? 'Türkçe' :
                                 option === 'en' ? 'English' :
                                 option}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'integrations' && (
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
              🔗 Sistem Entegrasyonları
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {integrations.map((integration, index) => (
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
                      backgroundColor: integration.status === 'connected' ? '#dcfce7' : '#fee2e2',
                      borderRadius: '12px'
                    }}>
                      {integration.type === 'ERP' ? '🏢' :
                       integration.type === 'Collaboration' ? '💬' :
                       integration.type === 'IoT' ? '📡' :
                       integration.type === 'Monitoring' ? '📊' :
                       integration.type === 'Storage' ? '💾' : '🔗'}
                    </div>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                          {integration.name}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: '#e5e7eb',
                          color: '#6b7280'
                        }}>
                          {integration.type}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: integration.status === 'connected' ? '#dcfce7' : '#fee2e2',
                          color: integration.status === 'connected' ? '#166534' : '#dc2626'
                        }}>
                          {integration.status === 'connected' ? '🟢 BAĞLI' : '🔴 HATA'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                        Son senkronizasyon: {integration.lastSync}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {Object.entries(integration.config).map(([key, value]) => (
                          <span key={key}>{key}: {value} • </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleTestIntegration(integration.name)}
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
                      🔍 Test
                    </button>
                    <button style={{
                      padding: '8px 12px',
                      fontSize: '0.75rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      ⚙️ Yapılandır
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'logs' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0
              }}>
                📋 Sistem Logları
              </h2>
              <button
                onClick={handleExportLogs}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.875rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                📄 Logları Dışa Aktar
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {systemLogs.map((log, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 
                      log.level === 'ERROR' ? '#ef4444' :
                      log.level === 'WARN' ? '#f59e0b' :
                      log.level === 'INFO' ? '#3b82f6' : '#6b7280',
                    marginTop: '6px'
                  }} />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <span style={{ color: '#6b7280' }}>{log.timestamp}</span>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 
                          log.level === 'ERROR' ? '#fee2e2' :
                          log.level === 'WARN' ? '#fef3c7' :
                          log.level === 'INFO' ? '#dbeafe' : '#f3f4f6',
                        color: 
                          log.level === 'ERROR' ? '#dc2626' :
                          log.level === 'WARN' ? '#d97706' :
                          log.level === 'INFO' ? '#2563eb' : '#6b7280'
                      }}>
                        {log.level}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#e5e7eb',
                        color: '#6b7280'
                      }}>
                        {log.component}
                      </span>
                    </div>
                    
                    <div style={{ color: '#374151', marginBottom: '4px' }}>
                      {log.message}
                    </div>
                    
                    {(log.ip || log.query || log.details || log.duration) && (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {log.ip && <span>IP: {log.ip} • </span>}
                        {log.query && <span>Query: {log.query} • </span>}
                        {log.details && <span>Details: {log.details} • </span>}
                        {log.duration && <span>Duration: {log.duration}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'maintenance' && (
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
              🔧 Sistem Bakımı
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                {
                  title: '🔄 Sistem Yeniden Başlatma',
                  description: 'Sistemi güvenli şekilde yeniden başlatır',
                  action: 'Yeniden Başlat',
                  color: '#dc2626',
                  onClick: handleRestartSystem
                },
                {
                  title: '🧹 Önbellek Temizleme',
                  description: 'Tüm sistem önbelleklerini temizler',
                  action: 'Temizle',
                  color: '#f59e0b',
                  onClick: () => alert('🧹 Önbellek temizleniyor...')
                },
                {
                  title: '⚡ Veritabanı Optimizasyonu',
                  description: 'Veritabanı performansını iyileştirir',
                  action: 'Optimize Et',
                  color: '#10b981',
                  onClick: () => alert('⚡ Veritabanı optimize ediliyor...')
                },
                {
                  title: '📊 Sistem Durumu Kontrolü',
                  description: 'Tüm sistem bileşenlerini kontrol eder',
                  action: 'Kontrol Et',
                  color: '#3b82f6',
                  onClick: () => alert('📊 Sistem durumu kontrol ediliyor...')
                }
              ].map((item, index) => (
                <div key={index} style={{
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '1rem'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '16px'
                  }}>
                    {item.description}
                  </p>
                  <button
                    onClick={item.onClick}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: item.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {item.action}
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

export default SystemSettingsPage; 