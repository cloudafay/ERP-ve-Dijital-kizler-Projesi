import React, { useState } from 'react';
import BackToHomeButton from '../components/BackToHomeButton';
import { GDPRComplianceDashboard } from '../components/GDPRComplianceDashboard';

const SecurityPage: React.FC = () => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const securityScore = 85;
  
  const loginHistory = [
    { date: '2024-01-15 08:30', device: 'Windows PC', location: 'İstanbul, TR', status: 'success' },
    { date: '2024-01-14 17:45', device: 'Android Mobile', location: 'İstanbul, TR', status: 'success' },
    { date: '2024-01-14 08:15', device: 'Windows PC', location: 'İstanbul, TR', status: 'success' },
    { date: '2024-01-13 15:20', device: 'Chrome Browser', location: 'İstanbul, TR', status: 'failed' },
    { date: '2024-01-13 08:30', device: 'Windows PC', location: 'İstanbul, TR', status: 'success' }
  ];

  const activeSessions = [
    { id: 1, device: 'Windows PC - Chrome', location: 'İstanbul, TR', lastActive: '2 dakika önce', current: true },
    { id: 2, device: 'Android Mobile', location: 'İstanbul, TR', lastActive: '1 saat önce', current: false },
    { id: 3, device: 'iPad Safari', location: 'İstanbul, TR', lastActive: '3 saat önce', current: false }
  ];

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('⚠️ Lütfen tüm alanları doldurun!');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('⚠️ Yeni şifreler eşleşmiyor!');
      return;
    }
    
    if (newPassword.length < 8) {
      alert('⚠️ Yeni şifre en az 8 karakter olmalıdır!');
      return;
    }
    
    setTimeout(() => {
      alert('✅ Şifre başarıyla değiştirildi!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };

  const handleTwoFactorToggle = () => {
    if (!twoFactorEnabled) {
      if (confirm('🔒 İki faktörlü kimlik doğrulama etkinleştirilsin mi?')) {
        setTwoFactorEnabled(true);
        alert('✅ İki faktörlü kimlik doğrulama etkinleştirildi!');
      }
    } else {
      if (confirm('⚠️ İki faktörlü kimlik doğrulama devre dışı bırakılsın mı?')) {
        setTwoFactorEnabled(false);
        alert('❌ İki faktörlü kimlik doğrulama devre dışı bırakıldı.');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 50%, #e8eaf6 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
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
              🛡️ Güvenlik Merkezi
            </h1>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>
              Hesap güvenliğinizi yönetin ve izleyin
            </p>
          </div>
          <BackToHomeButton />
        </div>

        {/* Güvenlik Skoru */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
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
            🛡️ Güvenlik Skoru
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  Genel Güvenlik Skoru
                </span>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: securityScore >= 80 ? '#16a34a' : securityScore >= 60 ? '#eab308' : '#dc2626'
                }}>
                  {securityScore}/100
                </span>
              </div>
              
              <div style={{
                width: '100%',
                height: '12px',
                backgroundColor: '#e5e7eb',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${securityScore}%`,
                  height: '100%',
                  background: securityScore >= 80 ? '#16a34a' : securityScore >= 60 ? '#eab308' : '#dc2626',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '8px' }}>
                {securityScore >= 80 ? '✅ Mükemmel güvenlik seviyesi' : 
                 securityScore >= 60 ? '⚠️ İyi güvenlik seviyesi' : '❌ Güvenlik iyileştirmesi gerekli'}
              </p>
            </div>
            
            <div>
              <h3 style={{ fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                Güvenlik Kontrolleri
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { item: 'Güçlü şifre kullanımı', status: 'good', score: 20 },
                  { item: 'İki faktörlü kimlik doğrulama', status: twoFactorEnabled ? 'good' : 'warning', score: twoFactorEnabled ? 25 : 0 },
                  { item: 'Güncel tarayıcı', status: 'good', score: 15 },
                  { item: 'Güvenli ağ bağlantısı', status: 'good', score: 15 },
                  { item: 'Son güvenlik güncellemeleri', status: 'good', score: 10 }
                ].map((check, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.875rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: check.status === 'good' ? '#16a34a' : '#eab308' }}>
                        {check.status === 'good' ? '✅' : '⚠️'}
                      </span>
                      <span>{check.item}</span>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      backgroundColor: check.status === 'good' ? '#f3f4f6' : '#fef3c7',
                      color: check.status === 'good' ? '#374151' : '#92400e',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontWeight: '600'
                    }}>
                      +{check.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Şifre Değişimi */}
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
              🔑 Şifre Değişimi
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Mevcut Şifre
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Mevcut şifrenizi girin"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Yeni Şifre
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yeni şifrenizi girin"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Yeni Şifre (Tekrar)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yeni şifrenizi tekrar girin"
                    style={{
                      width: '100%',
                      padding: '12px',
                      paddingRight: '40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}
                  >
                    {showPasswords ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#92400e'
              }}>
                ⚠️ Güçlü şifre oluşturmak için en az 8 karakter, büyük-küçük harf, rakam ve özel karakter kullanın.
              </div>
              
              <button
                onClick={handlePasswordChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                🔑 Şifreyi Değiştir
              </button>
            </div>
          </div>

          {/* İki Faktörlü Kimlik Doğrulama */}
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
              🔒 İki Faktörlü Kimlik Doğrulama
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ fontWeight: '500', margin: 0 }}>2FA Durumu</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                    {twoFactorEnabled ? 'Etkin - Hesabınız ekstra güvende' : 'Devre dışı - Güvenliği artırın'}
                  </p>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: twoFactorEnabled ? '#dcfce7' : '#fef3c7',
                  color: twoFactorEnabled ? '#166534' : '#92400e'
                }}>
                  {twoFactorEnabled ? '✅ Etkin' : '⚠️ Devre Dışı'}
                </span>
              </div>
              
              {twoFactorEnabled && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #16a34a',
                  borderRadius: '8px'
                }}>
                  <h4 style={{
                    fontWeight: '500',
                    color: '#166534',
                    marginBottom: '8px'
                  }}>
                    📱 Kayıtlı Telefon
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#16a34a', margin: 0 }}>
                    +90 532 ***45 67
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#15803d', margin: '4px 0 0 0' }}>
                    Doğrulama kodları bu numaraya gönderilir
                  </p>
                </div>
              )}
              
              <div>
                <h4 style={{ fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  2FA Özelliği Nasıl Çalışır?
                </h4>
                <ul style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li>• Giriş yaparken normal şifrenizi girin</li>
                  <li>• Telefonunuza 6 haneli kod gönderilir</li>
                  <li>• Bu kodu girerek girişi tamamlayın</li>
                  <li>• Hesabınız %90 daha güvenli olur</li>
                </ul>
              </div>
              
              <button
                onClick={handleTwoFactorToggle}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: twoFactorEnabled ? '#dc2626' : '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                📱 {twoFactorEnabled ? '❌ 2FA\'yı Devre Dışı Bırak' : '✅ 2FA\'yı Etkinleştir'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Aktif Oturumlar */}
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
              💻 Aktif Oturumlar
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeSessions.map((session) => (
                <div key={session.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#dbeafe',
                      borderRadius: '8px'
                    }}>
                      {session.device.includes('Mobile') ? '📱' : '💻'}
                    </div>
                    <div>
                      <p style={{
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        margin: 0
                      }}>
                        {session.device}
                        {session.current && <span style={{ marginLeft: '8px', color: '#16a34a', fontSize: '0.75rem' }}>• Bu Oturum</span>}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          📍 {session.location}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          🕐 {session.lastActive}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button style={{
                      padding: '6px 12px',
                      fontSize: '0.75rem',
                      color: '#dc2626',
                      backgroundColor: 'transparent',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      Sonlandır
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#1d4ed8', margin: 0 }}>
                ℹ️ Tanımadığınız bir cihaz görürseniz hemen şifrenizi değiştirin ve o oturumu sonlandırın.
              </p>
            </div>
          </div>

          {/* Giriş Geçmişi */}
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
              📅 Son Giriş Geçmişi
            </h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '320px',
              overflowY: 'auto'
            }}>
              {loginHistory.map((login, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: login.status === 'success' ? '#16a34a' : '#dc2626',
                    marginTop: '2px'
                  }} />
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      margin: 0
                    }}>
                      {login.status === 'success' ? '✅ Başarılı Giriş' : '❌ Başarısız Giriş'}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                      <div>🕐 {login.date}</div>
                      <div>{login.device.includes('Mobile') ? '📱' : '💻'} {login.device}</div>
                      <div>📍 {login.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* GDPR Uyumluluk Dashboard */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '24px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <GDPRComplianceDashboard />
        </div>
      </div>
    </div>
  );
};

export default SecurityPage; 