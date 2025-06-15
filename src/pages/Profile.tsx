import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import BackToHomeButton from '../components/BackToHomeButton';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Award,
  TrendingUp,
  Target,
  Activity,
  Shield,
  Edit3,
  Camera,
  CheckCircle,
  Save,
  X,
  Plus,
  Star,
  Settings,
  Bell,
  Languages,
  Palette
} from 'lucide-react';
import ProfileService, { UserProfile, Achievement, Certification } from '../lib/profileService';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'certifications' | 'settings'>('overview');

  // Mustafa Yardım'ın ID'si (gerçek uygulamada auth context'ten gelecek)
  const currentUserId = 'clrkbgpop0000w5kj5y8x9z7h'; // Seed'deki user ID

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Email ile profil getir (seed'de oluşturulan kullanıcı)
      const userProfile = await ProfileService.getProfileByEmail('mustafa.yardim@company.com');
      if (userProfile) {
        setProfile(userProfile);
        setEditForm(userProfile);
      } else {
        // Fallback mock data if database is not accessible
        const mockProfile: UserProfile = {
          id: 'mock-id-1',
          name: 'Mustafa Yardım',
          email: 'mustafa.yardim@company.com',
          role: 'Operator',
          department: 'Production',
          position: 'Operatör',
          phone: '+90 532 123 45 67',
          address: 'İstanbul, Türkiye',
          startDate: '15 Mart 2019',
          employeeId: 'EMP-2019-0156',
          shift: 'Gündüz Vardiyası (08:00-16:00)',
          experience: '5 yıl 8 ay',
          efficiency: 94.5,
          attendance: 98.2,
          qualityScore: 96.8,
          safetyScore: 100,
          achievements: [
            {
              id: '1',
              title: 'Güvenlik Şampiyonu',
              description: 'Yıl boyunca hiç kaza yaşamadan çalıştı',
              date: '2024',
              icon: '🛡️',
              category: 'safety'
            },
            {
              id: '2',
              title: 'Kalite Ustası',
              description: 'Kalite kontrol testlerinde %100 başarı',
              date: '2023',
              icon: '🏆',
              category: 'quality'
            },
            {
              id: '3',
              title: 'Mükemmel Devam',
              description: 'Yıl boyunca hiç izin kullanmadı',
              date: '2023',
              icon: '📅',
              category: 'attendance'
            },
            {
              id: '4',
              title: 'Yenilik Ödülü',
              description: 'Üretim sürecinde iyileştirme önerisi',
              date: '2022',
              icon: '💡',
              category: 'innovation'
            }
          ],
          certifications: [
            {
              id: '1',
              name: 'İSG Eğitimi Sertifikası',
              issuer: 'Çalışma Bakanlığı',
              issueDate: '2024-01-15',
              expiryDate: '2027-01-15',
              verified: true
            },
            {
              id: '2',
              name: 'Makine Operatörlüğü Sertifikası',
              issuer: 'MEB',
              issueDate: '2019-03-10',
              verified: true
            },
            {
              id: '3',
              name: 'Kalite Yönetim Sistemi Eğitimi',
              issuer: 'TSE',
              issueDate: '2023-06-20',
              verified: true
            }
          ],
          theme: 'system',
          language: 'tr'
        };
        
        setProfile(mockProfile);
        setEditForm(mockProfile);
      }
    } catch (error) {
      console.error('Profile loading error:', error);
      // Use mock data as fallback on error
      const mockProfile: UserProfile = {
        id: 'mock-id-1',
        name: 'Mustafa Yardım',
        email: 'mustafa.yardim@company.com',
        role: 'Operator',
        department: 'Production',
        position: 'Operatör',
        phone: '+90 532 123 45 67',
        address: 'İstanbul, Türkiye',
        startDate: '15 Mart 2019',
        employeeId: 'EMP-2019-0156',
        shift: 'Gündüz Vardiyası (08:00-16:00)',
        experience: '5 yıl 8 ay',
        efficiency: 94.5,
        attendance: 98.2,
        qualityScore: 96.8,
        safetyScore: 100,
        achievements: [
          {
            id: '1',
            title: 'Güvenlik Şampiyonu',
            description: 'Yıl boyunca hiç kaza yaşamadan çalıştı',
            date: '2024',
            icon: '🛡️',
            category: 'safety'
          },
          {
            id: '2',
            title: 'Kalite Ustası',
            description: 'Kalite kontrol testlerinde %100 başarı',
            date: '2023',
            icon: '🏆',
            category: 'quality'
          }
        ],
        certifications: [
          {
            id: '1',
            name: 'İSG Eğitimi Sertifikası',
            issuer: 'Çalışma Bakanlığı',
            issueDate: '2024-01-15',
            verified: true
          }
        ],
        theme: 'system',
        language: 'tr'
      };
      
      setProfile(mockProfile);
      setEditForm(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const updatedProfile = await ProfileService.updateProfile(profile.id, editForm);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setIsEditing(false);
        // Success notification
        alert('✅ Profil başarıyla güncellendi!\n\nDeğişiklikler veritabanına kaydedildi.');
      }
    } catch (error) {
      console.error('Profile save error:', error);
      alert('❌ Profil güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAchievement = async () => {
    if (!profile) return;

    const title = prompt('🏆 Yeni Başarı\n\nBaşarı başlığı:');
    if (!title) return;

    const description = prompt('Başarı açıklaması:');
    if (!description) return;

    const newAchievement = {
      title,
      description,
      date: new Date().getFullYear().toString(),
      icon: '🏆',
      category: 'innovation' as const
    };

    const success = await ProfileService.addAchievement(profile.id, newAchievement);
    if (success) {
      loadProfile(); // Profili yeniden yükle
      alert('✅ Başarı eklendi!');
    }
  };

  const handleAddCertification = async () => {
    if (!profile) return;

    const name = prompt('📜 Yeni Sertifika\n\nSertifika adı:');
    if (!name) return;

    const issuer = prompt('Veren kurum:');
    if (!issuer) return;

    const newCertification = {
      name,
      issuer,
      issueDate: new Date().toISOString().split('T')[0],
      verified: true
    };

    const success = await ProfileService.addCertification(profile.id, newCertification);
    if (success) {
      loadProfile();
      alert('✅ Sertifika eklendi!');
    }
  };

  const handlePhotoUpload = () => {
    alert('📸 Profil Fotoğrafı Güncelleme\n\nFotoğraf yükleme özelliği yakında aktif olacak.\n\nDesteklenen formatlar: JPG, PNG, GIF\nMaksimum boyut: 5MB');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil Bulunamadı</h2>
          <p className="text-gray-600">Kullanıcı profili yüklenemedi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              👤 Kullanıcı Profili
            </h1>
            <p className="text-gray-600 mt-2">Kişisel bilgiler ve performans metrikleri</p>
          </div>
          <div className="flex gap-3">
            <BackToHomeButton />
            {isEditing ? (
              <>
                <Button 
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  İptal
                </Button>
                <Button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Düzenle
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-white/50">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: User },
            { id: 'achievements', label: 'Başarılar', icon: Award },
            { id: 'certifications', label: 'Sertifikalar', icon: Award },
            { id: 'settings', label: 'Tercihler', icon: Settings }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/60'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sol Panel - Profil Bilgileri */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Profil Kartı */}
              <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-2xl">
                      <User className="w-16 h-16 text-white" />
                    </div>
                    <button 
                      onClick={handlePhotoUpload}
                      className="absolute bottom-2 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder="İsim"
                        className="text-center"
                      />
                      <Input
                        value={editForm.position || ''}
                        onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                        placeholder="Pozisyon"
                        className="text-center"
                      />
                      <Input
                        value={editForm.department || ''}
                        onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                        placeholder="Departman"
                        className="text-center"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                      <p className="text-gray-600 mb-1">{profile.position || profile.role}</p>
                      <p className="text-sm text-gray-500 mb-4">{profile.department}</p>
                    </>
                  )}
                  
                  <div className="flex justify-center gap-2 mb-6">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      🟢 Aktif
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {profile.shift ? profile.shift.split(' ')[0] : 'Gündüz'} Vardiya
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* İletişim Bilgileri */}
              <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    📞 İletişim Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          type="email"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Telefon</label>
                        <Input
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          placeholder="+90 5XX XXX XX XX"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Adres</label>
                        <Textarea
                          value={editForm.address || ''}
                          onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                          placeholder="Şehir, ülke"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{profile.phone || 'Belirtilmemiş'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{profile.address || 'Belirtilmemiş'}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sağ Panel - Performans ve Detaylar */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Performans Metrikleri */}
              <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    📊 Performans Metrikleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Verimlilik', value: profile.efficiency || 94.5, color: 'blue', icon: '⚡' },
                      { label: 'Devam', value: profile.attendance || 98.2, color: 'green', icon: '📅' },
                      { label: 'Kalite', value: profile.qualityScore || 96.8, color: 'purple', icon: '🎯' },
                      { label: 'Güvenlik', value: profile.safetyScore || 100, color: 'orange', icon: '🛡️' }
                    ].map((metric, index) => (
                      <div key={index} className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg">{metric.icon}</div>
                            <div className="text-lg font-bold text-gray-800">
                              {metric.value}%
                            </div>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{metric.label}</p>
                        <p className="text-xs text-gray-500">Son 30 gün</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* İş Bilgileri */}
              <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    💼 İş Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Personel ID</label>
                        <Input
                          value={editForm.employeeId || ''}
                          onChange={(e) => setEditForm({...editForm, employeeId: e.target.value})}
                          placeholder="EMP-2024-XXX"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">İşe Başlama Tarihi</label>
                        <Input
                          value={editForm.startDate || ''}
                          onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                          placeholder="15 Mart 2019"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Vardiya</label>
                        <Input
                          value={editForm.shift || ''}
                          onChange={(e) => setEditForm({...editForm, shift: e.target.value})}
                          placeholder="Gündüz Vardiyası (08:00-16:00)"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Deneyim</label>
                        <Input
                          value={editForm.experience || ''}
                          onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
                          placeholder="5 yıl 8 ay"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-gray-600">
                            <Shield className="w-4 h-4" />
                            Personel ID:
                          </span>
                          <Badge variant="outline" className="font-mono">
                            {profile.employeeId || 'EMP-2024-001'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            İşe Başlama:
                          </span>
                          <span className="font-medium text-gray-800">
                            {profile.startDate || '15 Mart 2019'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            Vardiya:
                          </span>
                          <span className="font-medium text-gray-800">
                            {profile.shift || 'Gündüz (08:00-16:00)'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-gray-600">
                            <Activity className="w-4 h-4" />
                            Deneyim:
                          </span>
                          <span className="font-medium text-gray-800">
                            {profile.experience || '5 yıl 8 ay'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  🏆 Başarılar & Ödüller
                </CardTitle>
                <Button onClick={handleAddAchievement} size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Başarı Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(profile.achievements || []).map((achievement, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{achievement.description}</p>
                    <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                      {achievement.category}
                    </Badge>
                  </div>
                ))}
                
                {(!profile.achievements || profile.achievements.length === 0) && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Henüz başarı eklenmemiş</p>
                    <p className="text-sm">İlk başarınızı eklemek için yukarıdaki butona tıklayın</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  📜 Sertifikalar & Eğitimler
                </CardTitle>
                <Button onClick={handleAddCertification} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Sertifika Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(profile.certifications || []).map((cert, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-bold text-gray-900">{cert.name}</h3>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                          <p className="text-xs text-gray-500">Tarih: {cert.issueDate}</p>
                        </div>
                      </div>
                      {cert.verified && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Doğrulandı
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                {(!profile.certifications || profile.certifications.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Henüz sertifika eklenmemiş</p>
                    <p className="text-sm">İlk sertifikanızı eklemek için yukarıdaki butona tıklayın</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-500" />
                  🔔 Bildirim Tercihleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { key: 'email', label: 'Email Bildirimleri', icon: '📧' },
                    { key: 'push', label: 'Push Bildirimleri', icon: '📱' },
                    { key: 'sms', label: 'SMS Bildirimleri', icon: '💬' },
                    { key: 'alerts', label: 'Uyarı Bildirimleri', icon: '🚨' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        {item.label}
                      </span>
                      <Badge variant="outline" className="text-green-600">
                        Aktif
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-500" />
                  🎨 Görünüm & Dil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Tema
                    </span>
                    <Badge variant="outline">
                      {profile.theme || 'Sistem'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Dil
                    </span>
                    <Badge variant="outline">
                      {profile.language === 'tr' ? '🇹🇷 Türkçe' : '🇺🇸 English'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 