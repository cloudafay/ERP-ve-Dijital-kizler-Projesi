import prisma from './prisma';
import { SensorData, MachineStatus, Alert, AIForecast, QualityMetrics } from './store';

export class DatabaseService {
  // Kullanıcı işlemleri
  static async createUser(data: {
    email: string;
    name: string;
    role: string;
    department: string;
  }) {
    return await prisma.user.create({ data });
  }

  static async getUsers() {
    return await prisma.user.findMany({
      include: {
        maintenanceRequests: true,
        alerts: true,
        sessions: true,
      },
    });
  }

  // Makine işlemleri
  static async getMachines() {
    return await prisma.machine.findMany({
      include: {
        sensors: true,
        alerts: true,
        maintenanceRequests: true,
        productionRuns: true,
      },
    });
  }

  static async updateMachineStatus(machineId: string, updates: {
    status?: string;
    temperature?: number;
    vibration?: number;
    speed?: number;
    efficiency?: number;
  }) {
    return await prisma.machine.update({
      where: { id: machineId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });
  }

  // Sensör işlemleri
  static async addSensorReading(data: {
    sensorId: string;
    value: number;
  }) {
    return await prisma.sensorReading.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    });
  }

  static async getSensorReadings(sensorId: string, limit: number = 100) {
    return await prisma.sensorReading.findMany({
      where: { sensorId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  // Alert işlemleri
  static async createAlert(data: {
    type: string;
    severity: string;
    title: string;
    description: string;
    machineId?: string;
    userId?: string;
  }) {
    return await prisma.alert.create({ data });
  }

  static async getActiveAlerts() {
    return await prisma.alert.findMany({
      where: { status: 'ACTIVE' },
      include: {
        machine: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async acknowledgeAlert(alertId: string) {
    return await prisma.alert.update({
      where: { id: alertId },
      data: { status: 'ACKNOWLEDGED' },
    });
  }

  static async resolveAlert(alertId: string) {
    return await prisma.alert.update({
      where: { id: alertId },
      data: { 
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });
  }

  // Bakım işlemleri
  static async createMaintenanceRequest(data: {
    type: string;
    priority: string;
    title: string;
    description: string;
    machineId: string;
    requestedBy: string;
    scheduledDate?: Date;
    estimatedCost?: number;
  }) {
    return await prisma.maintenanceRequest.create({ data });
  }

  static async getMaintenanceRequests(status?: string) {
    return await prisma.maintenanceRequest.findMany({
      where: status ? { status } : undefined,
      include: {
        machine: true,
        requester: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Üretim işlemleri
  static async startProductionRun(data: {
    machineId: string;
    productName: string;
    batchNumber: string;
    quantity: number;
  }) {
    return await prisma.productionRun.create({
      data: {
        ...data,
        startTime: new Date(),
        status: 'RUNNING',
      },
    });
  }

  static async completeProductionRun(
    productionRunId: string,
    data: {
      qualityScore?: number;
      defectRate?: number;
      energyUsed?: number;
    }
  ) {
    return await prisma.productionRun.update({
      where: { id: productionRunId },
      data: {
        ...data,
        endTime: new Date(),
        status: 'COMPLETED',
      },
    });
  }

  // Kalite test işlemleri
  static async createQualityTest(data: {
    productionRunId: string;
    testType: string;
    result: string;
    score: number;
    defects?: string;
  }) {
    return await prisma.qualityTest.create({ data });
  }

  // Enerji tüketimi işlemleri
  static async recordEnergyConsumption(data: {
    machineId?: string;
    facility?: string;
    consumption: number;
    cost?: number;
    carbonFootprint?: number;
    period: string;
  }) {
    return await prisma.energyConsumption.create({ data });
  }

  static async getEnergyConsumption(period: string, machineId?: string) {
    return await prisma.energyConsumption.findMany({
      where: {
        period,
        machineId: machineId || undefined,
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  // Envanter işlemleri
  static async updateInventory(partNumber: string, quantity: number) {
    return await prisma.inventory.upsert({
      where: { partNumber },
      update: { 
        quantity,
        lastUpdated: new Date(),
      },
      create: {
        partNumber,
        name: `Part ${partNumber}`,
        category: 'General',
        quantity,
        minStock: 10,
        unitCost: 0,
      },
    });
  }

  static async getLowStockItems() {
    return await prisma.inventory.findMany({
      where: {
        quantity: {
          lte: prisma.inventory.fields.minStock,
        },
      },
    });
  }

  // Sistem log işlemleri
  static async logSystemAction(data: {
    level: string;
    module: string;
    action: string;
    details?: string;
    userId?: string;
  }) {
    return await prisma.systemLog.create({ data });
  }

  static async getSystemLogs(level?: string, limit: number = 100) {
    return await prisma.systemLog.findMany({
      where: level ? { level } : undefined,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  // Kullanıcı oturum işlemleri
  static async createSession(data: {
    userId: string;
    token: string;
    deviceInfo?: string;
    ipAddress?: string;
    location?: string;
    expiresAt: Date;
  }) {
    return await prisma.userSession.create({ data });
  }

  static async getActiveSessions(userId?: string) {
    return await prisma.userSession.findMany({
      where: {
        userId: userId || undefined,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });
  }

  // Veri temizleme işlemleri
  static async cleanupOldData() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Eski sensör verilerini temizle
    await prisma.sensorReading.deleteMany({
      where: {
        timestamp: {
          lt: thirtyDaysAgo,
        },
      },
    });

    // Eski log kayıtlarını temizle
    await prisma.systemLog.deleteMany({
      where: {
        timestamp: {
          lt: thirtyDaysAgo,
        },
      },
    });

    // Süresi dolmuş oturumları temizle
    await prisma.userSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  // İstatistik işlemleri
  static async getProductionStats(startDate: Date, endDate: Date) {
    const productions = await prisma.productionRun.findMany({
      where: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        qualityTests: true,
      },
    });

    const totalQuantity = productions.reduce((sum, run) => sum + run.quantity, 0);
    const avgQualityScore = productions.reduce((sum, run) => sum + run.qualityScore, 0) / productions.length;
    const totalEnergyUsed = productions.reduce((sum, run) => sum + run.energyUsed, 0);

    return {
      totalProductions: productions.length,
      totalQuantity,
      avgQualityScore: avgQualityScore || 0,
      totalEnergyUsed,
      completedRuns: productions.filter(run => run.status === 'COMPLETED').length,
    };
  }
}

export default DatabaseService; 