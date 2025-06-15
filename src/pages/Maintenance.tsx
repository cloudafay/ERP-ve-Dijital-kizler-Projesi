import React, { useState } from 'react';
import BackToHomeButton from '../components/BackToHomeButton';

const MaintenancePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedMachine, setSelectedMachine] = useState('all');

  const machines = [
    { id: 'machine1', name: 'Şişe Üfleme Makinesi #1', status: 'running', health: 95 },
    { id: 'machine2', name: 'Dolum Makinesi #1', status: 'maintenance', health: 78 },
    { id: 'machine3', name: 'Etiketleme Makinesi #1', status: 'running', health: 92 },
    { id: 'machine4', name: 'Kapak Takma Makinesi #1', status: 'warning', health: 84 }
  ];

  const maintenanceSchedule = [
    {
      id: 1,
      machine: 'Şişe Üfleme Makinesi #1',
      type: 'Önleyici Bakım',
      scheduled: '2024-01-20 09:00',
      duration: '4 saat',
      technician: 'Ahmet Yılmaz',
      priority: 'medium',
      status: 'planned'
    },
    {
      id: 2,
      machine: 'Dolum Makinesi #1',
      type: 'Acil Onarım',
      scheduled: '2024-01-16 14:30',
      duration: '2 saat',
      technician: 'Mehmet Kaya',
      priority: 'high',
      status: 'in-progress'
    },
    {
      id: 3,
      machine: 'Etiketleme Makinesi #1',
      type: 'Rutin Kontrol',
      scheduled: '2024-01-22 11:00',
      duration: '1 saat',
      technician: 'Fatma Demir',
      priority: 'low',
      status: 'planned'
    }
  ];

  const workOrders = [
    {
      id: 'WO-001',
      title: 'Dolum pompası değişimi',
      machine: 'Dolum Makinesi #1',
      description: 'Ana dolum pompasında titreşim ve sızıntı problemi',
      priority: 'high',
      status: 'in-progress',
      created: '2024-01-15 08:30',
      assignee: 'Mehmet Kaya',
      estimatedCost: '₺ 3,500'
    },
    {
      id: 'WO-002',
      title: 'Konveyör bant ayarı',
      machine: 'Etiketleme Makinesi #1',
      description: 'Konveyör bantında hız dengesizliği',
      priority: 'medium',
      status: 'pending',
      created: '2024-01-14 16:45',
      assignee: 'Fatma Demir',
      estimatedCost: '₺ 850'
    },
    {
      id: 'WO-003',
      title: 'Sıcaklık sensörü kalibrasyonu',
      machine: 'Şişe Üfleme Makinesi #1',
      description: 'Üfleme fırınında sıcaklık sensörü kalibrasyonu',
      priority: 'low',
      status: 'completed',
      created: '2024-01-12 10:15',
      assignee: 'Ahmet Yılmaz',
      estimatedCost: '₺ 450'
    }
  ];

  const spareParts = [
    { name: 'Dolum Pompası Mühür Seti', stock: 5, minimum: 2, cost: '₺ 180' },
    { name: 'Konveyör Kayışı', stock: 8, minimum: 3, cost: '₺ 320' },
    { name: 'Sıcaklık Sensörü', stock: 1, minimum: 2, cost: '₺ 850' },
    { name: 'Servo Motor', stock: 2, minimum: 1, cost: '₺ 2,400' },
    { name: 'PLC Kartı', stock: 0, minimum: 1, cost: '₺ 1,200' }
  ];

  const handleCreateWorkOrder = () => {
    alert('🔧 YENİ İŞ EMRİ OLUŞTUR\n\nMakine: ' + (selectedMachine === 'all' ? 'Seçiniz' : machines.find(m => m.id === selectedMachine)?.name) + '\nProblem: [Açıklama giriniz]\nÖncelik: Yüksek/Orta/Düşük\nTahmini Süre: [Saat]\nAtanan Teknisyen: [Seçiniz]\n\nİş emri oluşturuluyor...');
  };

  const handleScheduleMaintenance = () => {
    alert('📅 BAKIM PLANLA\n\nMakine: ' + (selectedMachine === 'all' ? 'Seçiniz' : machines.find(m => m.id === selectedMachine)?.name) + '\nBakım Türü: Önleyici/Düzeltici/Acil\nTarih: [Seç]\nSaat: [Seç]\nTahmini Süre: [Saat]\nTeknisyen: [Ata]\n\nBakım planlanıyor...');
  };

  const handleOrderPart = (partName: string) => {
    alert(`📦 YEDEK PARÇA SİPARİŞİ\n\nParça: ${partName}\nMiktar: [Giriniz]\nTedarikçi: [Seçiniz]\nTahmini Teslimat: 3-5 iş günü\nOnay: [Bekliyor]\n\nSipariş oluşturuluyor...`);
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
              🔧 Bakım Yönetimi
            </h1>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>
              Makine bakımlarını planlayın ve takip edin
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <BackToHomeButton />
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">Tüm Makineler</option>
              {machines.map(machine => (
                <option key={machine.id} value={machine.id}>{machine.name}</option>
              ))}
            </select>
            <button
              onClick={handleScheduleMaintenance}
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
              📅 Bakım Planla
            </button>
            <button
              onClick={handleCreateWorkOrder}
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
              ➕ İş Emri Oluştur
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
            { id: 'overview', label: 'Genel Bakış', icon: '📊' },
            { id: 'schedule', label: 'Bakım Planı', icon: '📅' },
            { id: 'workorders', label: 'İş Emirleri', icon: '🔧' },
            { id: 'spareparts', label: 'Yedek Parça', icon: '📦' }
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
            
            {/* Makine Durumu */}
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
                🏭 Makine Durumu
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {machines.map((machine) => (
                  <div key={machine.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 
                          machine.status === 'running' ? '#10b981' :
                          machine.status === 'maintenance' ? '#f59e0b' : '#ef4444'
                      }} />
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                          {machine.name}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          textTransform: 'capitalize'
                        }}>
                          {machine.status === 'running' ? '🟢 Çalışıyor' : 
                           machine.status === 'maintenance' ? '🟡 Bakımda' : '🔴 Uyarı'}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: machine.health >= 90 ? '#10b981' : machine.health >= 70 ? '#f59e0b' : '#ef4444'
                      }}>
                        %{machine.health}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Sağlık
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bugünkü Bakımlar */}
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
                📅 Bugünkü Bakımlar
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {maintenanceSchedule.filter(m => m.status === 'in-progress' || m.scheduled.includes('2024-01-16')).map((maintenance) => (
                  <div key={maintenance.id} style={{
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
                      <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                        {maintenance.machine}
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: maintenance.priority === 'high' ? '#fee2e2' : 
                                       maintenance.priority === 'medium' ? '#fef3c7' : '#f0f9ff',
                        color: maintenance.priority === 'high' ? '#dc2626' : 
                               maintenance.priority === 'medium' ? '#d97706' : '#0284c7'
                      }}>
                        {maintenance.priority === 'high' ? 'Yüksek' : 
                         maintenance.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '8px' }}>
                      {maintenance.type} • {maintenance.duration}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      👤 {maintenance.technician} • 🕐 {maintenance.scheduled.split(' ')[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'schedule' && (
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
              📅 Bakım Programı
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {maintenanceSchedule.map((maintenance) => (
                <div key={maintenance.id} style={{
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
                      backgroundColor: maintenance.priority === 'high' ? '#fee2e2' : 
                                     maintenance.priority === 'medium' ? '#fef3c7' : '#f0f9ff',
                      borderRadius: '12px'
                    }}>
                      {maintenance.type === 'Acil Onarım' ? '🚨' : 
                       maintenance.type === 'Önleyici Bakım' ? '🔧' : '🔍'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {maintenance.machine}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                        {maintenance.type} • {maintenance.duration}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        👤 {maintenance.technician} • 📅 {maintenance.scheduled}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: maintenance.status === 'in-progress' ? '#dcfce7' : '#e0f2fe',
                      color: maintenance.status === 'in-progress' ? '#166534' : '#0c4a6e'
                    }}>
                      {maintenance.status === 'in-progress' ? '🔄 Devam Ediyor' : '📋 Planlandı'}
                    </span>
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
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'workorders' && (
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
              🔧 İş Emirleri
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {workOrders.map((order) => (
                <div key={order.id} style={{
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
                          {order.id}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: order.priority === 'high' ? '#fee2e2' : 
                                         order.priority === 'medium' ? '#fef3c7' : '#f0f9ff',
                          color: order.priority === 'high' ? '#dc2626' : 
                                 order.priority === 'medium' ? '#d97706' : '#0284c7'
                        }}>
                          {order.priority === 'high' ? 'Yüksek' : 
                           order.priority === 'medium' ? 'Orta' : 'Düşük'}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: order.status === 'in-progress' ? '#dcfce7' : 
                                         order.status === 'pending' ? '#fef3c7' : '#f0fdf4',
                          color: order.status === 'in-progress' ? '#166534' : 
                                 order.status === 'pending' ? '#d97706' : '#15803d'
                        }}>
                          {order.status === 'in-progress' ? '🔄 Devam Ediyor' : 
                           order.status === 'pending' ? '⏳ Bekliyor' : '✅ Tamamlandı'}
                        </span>
                      </div>
                      <h3 style={{
                        fontWeight: '600',
                        marginBottom: '8px',
                        fontSize: '1rem'
                      }}>
                        {order.title}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        {order.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        <span>🏭 {order.machine}</span>
                        <span>👤 {order.assignee}</span>
                        <span>📅 {order.created}</span>
                        <span>💰 {order.estimatedCost}</span>
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
                      Detay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'spareparts' && (
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
              📦 Yedek Parça Stok Durumu
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {spareParts.map((part, index) => (
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
                      backgroundColor: part.stock <= part.minimum ? '#fee2e2' : '#f0fdf4',
                      borderRadius: '12px'
                    }}>
                      📦
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {part.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Mevcut: {part.stock} adet • Minimum: {part.minimum} adet • {part.cost}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: part.stock <= part.minimum ? '#fee2e2' : '#f0fdf4',
                      color: part.stock <= part.minimum ? '#dc2626' : '#166534'
                    }}>
                      {part.stock <= part.minimum ? '⚠️ Kritik Seviye' : '✅ Yeterli'}
                    </span>
                    <button
                      onClick={() => handleOrderPart(part.name)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.75rem',
                        backgroundColor: part.stock <= part.minimum ? '#dc2626' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {part.stock <= part.minimum ? '🚨 Acil Sipariş' : '📦 Sipariş Ver'}
                    </button>
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

export default MaintenancePage; 