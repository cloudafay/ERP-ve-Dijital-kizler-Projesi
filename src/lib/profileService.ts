// Mock ProfileService - Tarayıcı uyumluluğu için Prisma kullanmıyoruz
// import prisma from './prisma';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  position?: string;
  phone?: string;
  address?: string;
  startDate?: string;
  employeeId?: string;
  shift?: string;
  experience?: string;
  profilePhoto?: string;
  bio?: string;
  skills?: string[];
  efficiency?: number;
  attendance?: number;
  qualityScore?: number;
  safetyScore?: number;
  achievements?: Achievement[];
  certifications?: Certification[];
  theme?: string;
  language?: string;
  notifications?: NotificationPreferences;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  category: 'safety' | 'quality' | 'efficiency' | 'innovation' | 'attendance';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verified: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  alerts: boolean;
  maintenance: boolean;
  reports: boolean;
}

// Mock veri depolama
const mockUserProfiles: { [key: string]: UserProfile } = {
  'mustafa.yardim@company.com': {
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
    bio: 'Deneyimli üretim operatörü, kalite odaklı çalışma anlayışı ile takım başarısına katkı sağlıyor.',
    skills: ['Makine Operatörlüğü', 'Kalite Kontrol', 'İSG Uygulamaları', 'Takım Çalışması', 'Problem Çözme'],
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
      },
      {
        id: '5',
        title: 'Verimlilik Uzmanı',
        description: 'Makine verimliliğini %15 artırdı',
        date: '2022',
        icon: '⚡',
        category: 'efficiency'
      }
    ],
    certifications: [
      {
        id: '1',
        name: 'İSG Eğitimi Sertifikası',
        issuer: 'Çalışma Bakanlığı',
        issueDate: '2024-01-15',
        expiryDate: '2027-01-15',
        credentialId: 'ISG-2024-0156',
        verified: true
      },
      {
        id: '2',
        name: 'Makine Operatörlüğü Sertifikası',
        issuer: 'MEB',
        issueDate: '2019-03-10',
        credentialId: 'MEB-MO-2019-0892',
        verified: true
      },
      {
        id: '3',
        name: 'Kalite Yönetim Sistemi Eğitimi',
        issuer: 'TSE',
        issueDate: '2023-06-20',
        credentialId: 'TSE-KY-2023-1456',
        verified: true
      },
      {
        id: '4',
        name: 'Endüstri 4.0 Temel Eğitimi',
        issuer: 'TÜBİTAK',
        issueDate: '2023-09-15',
        credentialId: 'TUB-E40-2023-7891',
        verified: true
      }
    ],
    theme: 'system',
    language: 'tr',
    notifications: {
      email: true,
      push: true,
      sms: false,
      alerts: true,
      maintenance: true,
      reports: false
    }
  }
};

export class ProfileService {
  // Profil getirme
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data'dan kullanıcı bul
      const profile = Object.values(mockUserProfiles).find(p => p.id === userId);
      return profile || null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  // Email ile kullanıcı bulma
  static async getProfileByEmail(email: string): Promise<UserProfile | null> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockUserProfiles[email] || null;
    } catch (error) {
      console.error('Error fetching profile by email:', error);
      return null;
    }
  }

  // Profil güncelleme
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data'da güncelle
      const profile = Object.values(mockUserProfiles).find(p => p.id === userId);
      if (!profile) return null;

      // Güncellemeleri uygula
      Object.assign(profile, updates);
      
      // Email key'i de güncellenebilir
      if (updates.email && updates.email !== profile.email) {
        delete mockUserProfiles[profile.email];
        mockUserProfiles[updates.email] = profile;
      } else {
        mockUserProfiles[profile.email] = profile;
      }

      return profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }

  // Performans metriklerini güncelleme
  static async updatePerformanceMetrics(userId: string, metrics: {
    efficiency?: number;
    attendance?: number;
    qualityScore?: number;
    safetyScore?: number;
  }): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const profile = Object.values(mockUserProfiles).find(p => p.id === userId);
      if (!profile) return false;

      Object.assign(profile, metrics);
      mockUserProfiles[profile.email] = profile;
      
      return true;
    } catch (error) {
      console.error('Error updating performance metrics:', error);
      return false;
    }
  }

  // Başarı ekleme
  static async addAchievement(userId: string, achievement: Omit<Achievement, 'id'>): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const profile = Object.values(mockUserProfiles).find(p => p.id === userId);
      if (!profile) return false;

      const newAchievement: Achievement = {
        ...achievement,
        id: Date.now().toString()
      };

      profile.achievements = [...(profile.achievements || []), newAchievement];
      mockUserProfiles[profile.email] = profile;

      return true;
    } catch (error) {
      console.error('Error adding achievement:', error);
      return false;
    }
  }

  // Sertifika ekleme
  static async addCertification(userId: string, certification: Omit<Certification, 'id'>): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const profile = Object.values(mockUserProfiles).find(p => p.id === userId);
      if (!profile) return false;

      const newCertification: Certification = {
        ...certification,
        id: Date.now().toString()
      };

      profile.certifications = [...(profile.certifications || []), newCertification];
      mockUserProfiles[profile.email] = profile;

      return true;
    } catch (error) {
      console.error('Error adding certification:', error);
      return false;
    }
  }

  // Başarı silme
  static async removeAchievement(userId: string, achievementId: string): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const profile = Object.values(mockUserProfiles).find(p => p.id === userId);
      if (!profile) return false;

      profile.achievements = profile.achievements?.filter(a => a.id !== achievementId) || [];
      mockUserProfiles[profile.email] = profile;

      return true;
    } catch (error) {
      console.error('Error removing achievement:', error);
      return false;
    }
  }

  // Sertifika silme
  static async removeCertification(userId: string, certificationId: string): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const profile = Object.values(mockUserProfiles).find(p => p.id === userId);
      if (!profile) return false;

      profile.certifications = profile.certifications?.filter(c => c.id !== certificationId) || [];
      mockUserProfiles[profile.email] = profile;

      return true;
    } catch (error) {
      console.error('Error removing certification:', error);
      return false;
    }
  }

  // Profil fotoğrafı güncelleme
  static async updateProfilePhoto(userId: string, photoUrl: string): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const profile = Object.values(mockUserProfiles).find(p => p.id === userId);
      if (!profile) return false;

      profile.profilePhoto = photoUrl;
      mockUserProfiles[profile.email] = profile;

      return true;
    } catch (error) {
      console.error('Error updating profile photo:', error);
      return false;
    }
  }

  // Tüm profilleri getirme
  static async getAllProfiles(): Promise<UserProfile[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      return Object.values(mockUserProfiles);
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }
  }

  // Kullanıcı istatistikleri
  static async getUserStats(userId: string): Promise<{
    totalLogins: number;
    lastLogin: Date | null;
    activeSessions: number;
    maintenanceRequests: number;
    resolvedAlerts: number;
  } | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const profile = Object.values(mockUserProfiles).find(p => p.id === userId);
      if (!profile) return null;

      // Mock istatistikler
      return {
        totalLogins: 1247,
        lastLogin: new Date(),
        activeSessions: 1,
        maintenanceRequests: 23,
        resolvedAlerts: 156
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }
}

export default ProfileService; 