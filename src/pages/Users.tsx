import React, { useState, useEffect } from 'react';
import BackToHomeButton from '../components/BackToHomeButton';

const UsersPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const users = [
    {
      id: 1,
      name: 'Mustafa Yardım',
      email: 'mustafa.yardim@aquatech.com',
      role: 'Operatör',
      department: 'Üretim',
      status: 'active',
      lastLogin: '2024-01-15 14:30',
      permissions: ['production_view', 'quality_test', 'maintenance_request'],
      avatar: '👨‍💼'
    },
    {
      id: 2,
      name: 'Ayşe Kaya',
      email: 'ayse.kaya@aquatech.com',
      role: 'Kalite Kontrol Uzmanı',
      department: 'Kalite',
      status: 'active',
      lastLogin: '2024-01-15 13:45',
      permissions: ['quality_all', 'reports_view', 'nonconformity_create'],
      avatar: '👩‍🔬'
    },
    {
      id: 3,
      name: 'Mehmet Çelik',
      email: 'mehmet.celik@aquatech.com',
      role: 'Bakım Teknisyeni',
      department: 'Bakım',
      status: 'active',
      lastLogin: '2024-01-15 12:15',
      permissions: ['maintenance_all', 'workorder_manage', 'spareparts_view'],
      avatar: '👨‍🔧'
    },
    {
      id: 4,
      name: 'Fatma Demir',
      email: 'fatma.demir@aquatech.com',
      role: 'Vardiya Sorumlusu',
      department: 'Üretim',
      status: 'active',
      lastLogin: '2024-01-15 11:20',
      permissions: ['production_all', 'shift_manage', 'reports_create'],
      avatar: '👩‍💼'
    },
    {
      id: 5,
      name: 'Ali Yılmaz',
      email: 'ali.yilmaz@aquatech.com',
      role: 'Sistem Yöneticisi',
      department: 'IT',
      status: 'active',
      lastLogin: '2024-01-15 10:30',
      permissions: ['admin_all', 'user_manage', 'system_config'],
      avatar: '👨‍💻'
    },
    {
      id: 6,
      name: 'Zeynep Özkan',
      email: 'zeynep.ozkan@aquatech.com',
      role: 'Muhasebe Uzmanı',
      department: 'Mali İşler',
      status: 'inactive',
      lastLogin: '2024-01-10 16:45',
      permissions: ['financial_view', 'reports_financial'],
      avatar: '👩‍💼'
    }
  ];

  const roles = [
    {
      name: 'Sistem Yöneticisi',
      description: 'Tam sistem erişimi ve kullanıcı yönetimi',
      users: 1,
      permissions: 15,
      color: '#dc2626'
    },
    {
      name: 'Vardiya Sorumlusu',
      description: 'Üretim yönetimi ve vardiya kontrolü',
      users: 2,
      permissions: 12,
      color: '#2563eb'
    },
    {
      name: 'Kalite Kontrol Uzmanı',
      description: 'Kalite testleri ve uygunsuzluk yönetimi',
      users: 1,
      permissions: 8,
      color: '#059669'
    },
    {
      name: 'Bakım Teknisyeni',
      description: 'Bakım operasyonları ve iş emirleri',
      users: 3,
      permissions: 10,
      color: '#d97706'
    },
    {
      name: 'Operatör',
      description: 'Temel üretim izleme ve raporlama',
      users: 8,
      permissions: 5,
      color: '#7c3aed'
    }
  ];

  const permissions = [
    { id: 'production_view', name: 'Üretim İzleme', category: 'Üretim' },
    { id: 'production_all', name: 'Üretim Yönetimi', category: 'Üretim' },
    { id: 'quality_test', name: 'Kalite Testi', category: 'Kalite' },
    { id: 'quality_all', name: 'Kalite Yönetimi', category: 'Kalite' },
    { id: 'maintenance_request', name: 'Bakım Talebi', category: 'Bakım' },
    { id: 'maintenance_all', name: 'Bakım Yönetimi', category: 'Bakım' },
    { id: 'reports_view', name: 'Rapor Görüntüleme', category: 'Raporlar' },
    { id: 'reports_create', name: 'Rapor Oluşturma', category: 'Raporlar' },
    { id: 'user_manage', name: 'Kullanıcı Yönetimi', category: 'Sistem' },
    { id: 'admin_all', name: 'Tam Yetki', category: 'Sistem' }
  ];

  const auditLogs = [
    {
      id: 1,
      user: 'Ali Yılmaz',
      action: 'Kullanıcı oluşturdu',
      target: 'Zeynep Özkan',
      timestamp: '2024-01-15 09:30',
      ip: '192.168.1.105',
      success: true
    },
    {
      id: 2,
      user: 'Mustafa Yardım',
      action: 'Giriş yaptı',
      target: 'Sistem',
      timestamp: '2024-01-15 08:15',
      ip: '192.168.1.102',
      success: true
    },
    {
      id: 3,
      user: 'Admin',
      action: 'Şifre değiştirdi',
      target: 'Ayşe Kaya',
      timestamp: '2024-01-14 16:45',
      ip: '192.168.1.100',
      success: true
    },
    {
      id: 4,
      user: 'Bilinmeyen',
      action: 'Başarısız giriş',
      target: 'Sistem',
      timestamp: '2024-01-14 14:20',
      ip: '192.168.1.200',
      success: false
    }
  ];

  const handleCreateUser = () => {
    alert('👤 YENİ KULLANICI OLUŞTUR\n\nAd Soyad: [Giriniz]\nE-posta: [Giriniz]\nRol: [Seçiniz]\nDepartman: [Seçiniz]\nŞifre: [Otomatik oluştur]\nYetkiler: [Rol bazlı]\n\nKullanıcı oluşturuluyor...');
  };

  const handleEditUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    alert(`✏️ KULLANICI DÜZENLE\n\nKullanıcı: ${user?.name}\nE-posta: ${user?.email}\nRol: ${user?.role}\nDepartman: ${user?.department}\nDurum: ${user?.status === 'active' ? 'Aktif' : 'Pasif'}\n\nDüzenleme sayfası açılıyor...`);
  };

  const handleToggleStatus = (userId: number) => {
    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === 'active' ? 'pasif' : 'aktif';
    alert(`🔄 DURUM DEĞİŞTİR\n\nKullanıcı: ${user?.name}\nMevcut Durum: ${user?.status === 'active' ? 'Aktif' : 'Pasif'}\nYeni Durum: ${newStatus}\n\nOnaylıyor musunuz?`);
  };

  const handleResetPassword = (userId: number) => {
    const user = users.find(u => u.id === userId);
    alert(`🔑 ŞİFRE SIFIRLAMA\n\nKullanıcı: ${user?.name}\nE-posta: ${user?.email}\n\nYeni şifre otomatik oluşturulacak ve e-posta ile gönderilecek.\n\nOnaylıyor musunuz?`);
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
              👥 Kullanıcı Yönetimi
            </h1>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>
              Sistem kullanıcıları ve yetki yönetimi
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <BackToHomeButton />
            <button
              onClick={handleCreateUser}
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
              ➕ Yeni Kullanıcı
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
            { id: 'users', label: 'Kullanıcılar', icon: '👥' },
            { id: 'roles', label: 'Roller & Yetkiler', icon: '🎭' },
            { id: 'audit', label: 'Denetim Logları', icon: '📋' }
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
        {selectedTab === 'users' && (
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
              👥 Sistem Kullanıcıları
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {users.map((user) => (
                <div key={user.id} style={{
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
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: user.status === 'active' ? '#dcfce7' : '#fee2e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {user.avatar}
                    </div>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                          {user.name}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: user.status === 'active' ? '#dcfce7' : '#fee2e2',
                          color: user.status === 'active' ? '#166534' : '#dc2626'
                        }}>
                          {user.status === 'active' ? '🟢 AKTİF' : '🔴 PASİF'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                        {user.role} • {user.department}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        📧 {user.email} • 🕐 Son giriş: {user.lastLogin}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleEditUser(user.id)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.75rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      onClick={() => handleResetPassword(user.id)}
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
                      🔑 Şifre
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.75rem',
                        backgroundColor: user.status === 'active' ? '#dc2626' : '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {user.status === 'active' ? '🚫 Pasifleştir' : '✅ Aktifleştir'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'roles' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Roller */}
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
                🎭 Kullanıcı Rolleri
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {roles.map((role, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: '600',
                          fontSize: '1rem',
                          color: role.color,
                          marginBottom: '4px'
                        }}>
                          {role.name}
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          marginBottom: '8px'
                        }}>
                          {role.description}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          <span>👥 {role.users} kullanıcı</span>
                          <span>🔒 {role.permissions} yetki</span>
                        </div>
                      </div>
                      <button style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        backgroundColor: role.color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}>
                        Düzenle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yetkiler */}
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
                🔒 Sistem Yetkileri
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Üretim', 'Kalite', 'Bakım', 'Raporlar', 'Sistem'].map((category) => (
                  <div key={category} style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '12px'
                    }}>
                      {category}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {permissions.filter(p => p.category === category).map((permission) => (
                        <div key={permission.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <span style={{ fontSize: '0.75rem' }}>
                            {permission.name}
                          </span>
                          <span style={{
                            fontSize: '0.625rem',
                            fontWeight: '600',
                            padding: '2px 6px',
                            borderRadius: '9999px',
                            backgroundColor: '#e5e7eb',
                            color: '#6b7280'
                          }}>
                            {permission.id}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'audit' && (
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
              📋 Denetim Logları
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {auditLogs.map((log) => (
                <div key={log.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: log.success ? '#10b981' : '#ef4444'
                    }} />
                    <div>
                      <div style={{
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        marginBottom: '4px'
                      }}>
                        <span style={{ color: '#374151' }}>{log.user}</span>
                        <span style={{ color: '#6b7280' }}> • {log.action}</span>
                        {log.target !== 'Sistem' && (
                          <span style={{ color: '#6b7280' }}> • {log.target}</span>
                        )}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        🕐 {log.timestamp} • 🌐 {log.ip}
                      </div>
                    </div>
                  </div>
                  
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    backgroundColor: log.success ? '#dcfce7' : '#fee2e2',
                    color: log.success ? '#166534' : '#dc2626'
                  }}>
                    {log.success ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage; 