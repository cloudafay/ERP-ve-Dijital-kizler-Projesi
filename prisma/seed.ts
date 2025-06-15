import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Kullanıcıları oluştur
  const user1 = await prisma.user.create({
    data: {
      email: 'mustafa.yardim@company.com',
      name: 'Mustafa Yardım',
      role: 'Operator',
      department: 'Production',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'admin@company.com',
      name: 'System Admin',
      role: 'Admin',
      department: 'IT',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'maintenance@company.com',
      name: 'Maintenance Team',
      role: 'Technician',
      department: 'Maintenance',
    },
  });

  // Makineleri oluştur
  const machine1 = await prisma.machine.create({
    data: {
      name: 'Injection Molding #001',
      type: 'INJECTION',
      status: 'RUNNING',
      temperature: 185.5,
      vibration: 2.3,
      speed: 85.0,
      efficiency: 94.2,
      lastMaintenance: new Date('2024-01-01'),
      nextMaintenance: new Date('2024-02-01'),
    },
  });

  const machine2 = await prisma.machine.create({
    data: {
      name: 'CNC Milling #002',
      type: 'CNC',
      status: 'RUNNING',
      temperature: 65.2,
      vibration: 1.8,
      speed: 1200.0,
      efficiency: 89.7,
      lastMaintenance: new Date('2024-01-05'),
      nextMaintenance: new Date('2024-02-05'),
    },
  });

  const machine3 = await prisma.machine.create({
    data: {
      name: 'Assembly Line #003',
      type: 'ASSEMBLY',
      status: 'RUNNING',
      temperature: 25.0,
      vibration: 0.5,
      speed: 45.0,
      efficiency: 96.1,
      lastMaintenance: new Date('2024-01-10'),
      nextMaintenance: new Date('2024-02-10'),
    },
  });

  const machine4 = await prisma.machine.create({
    data: {
      name: 'Packaging Unit #004',
      type: 'PACKAGING',
      status: 'MAINTENANCE',
      temperature: 30.0,
      vibration: 1.2,
      speed: 0.0,
      efficiency: 0.0,
      lastMaintenance: new Date('2024-01-15'),
      nextMaintenance: new Date('2024-02-15'),
    },
  });

  // Sensörleri oluştur
  const sensors = [
    // Machine 1 sensors
    {
      deviceId: 'TEMP-001-01',
      name: 'Temperature Sensor 1',
      type: 'TEMPERATURE',
      value: 185.5,
      unit: '°C',
      machineId: machine1.id,
    },
    {
      deviceId: 'VIB-001-01',
      name: 'Vibration Sensor 1',
      type: 'VIBRATION',
      value: 2.3,
      unit: 'mm/s',
      machineId: machine1.id,
    },
    {
      deviceId: 'SPEED-001-01',
      name: 'Speed Sensor 1',
      type: 'SPEED',
      value: 85.0,
      unit: 'RPM',
      machineId: machine1.id,
    },
    {
      deviceId: 'ENERGY-001-01',
      name: 'Energy Sensor 1',
      type: 'ENERGY',
      value: 45.2,
      unit: 'kWh',
      machineId: machine1.id,
    },
    // Machine 2 sensors
    {
      deviceId: 'TEMP-002-01',
      name: 'Temperature Sensor 2',
      type: 'TEMPERATURE',
      value: 65.2,
      unit: '°C',
      machineId: machine2.id,
    },
    {
      deviceId: 'VIB-002-01',
      name: 'Vibration Sensor 2',
      type: 'VIBRATION',
      value: 1.8,
      unit: 'mm/s',
      machineId: machine2.id,
    },
    {
      deviceId: 'SPEED-002-01',
      name: 'Speed Sensor 2',
      type: 'SPEED',
      value: 1200.0,
      unit: 'RPM',
      machineId: machine2.id,
    },
    {
      deviceId: 'PRESSURE-002-01',
      name: 'Pressure Sensor 2',
      type: 'PRESSURE',
      value: 8.5,
      unit: 'bar',
      machineId: machine2.id,
    },
    // Machine 3 sensors
    {
      deviceId: 'TEMP-003-01',
      name: 'Temperature Sensor 3',
      type: 'TEMPERATURE',
      value: 25.0,
      unit: '°C',
      machineId: machine3.id,
    },
    {
      deviceId: 'SPEED-003-01',
      name: 'Speed Sensor 3',
      type: 'SPEED',
      value: 45.0,
      unit: 'units/min',
      machineId: machine3.id,
    },
    // Machine 4 sensors
    {
      deviceId: 'TEMP-004-01',
      name: 'Temperature Sensor 4',
      type: 'TEMPERATURE',
      value: 30.0,
      unit: '°C',
      machineId: machine4.id,
    },
    {
      deviceId: 'VIB-004-01',
      name: 'Vibration Sensor 4',
      type: 'VIBRATION',
      value: 1.2,
      unit: 'mm/s',
      machineId: machine4.id,
    },
  ];

  for (const sensor of sensors) {
    await prisma.sensor.create({ data: sensor });
  }

  // Alarmları oluştur
  const alerts = [
    {
      type: 'WARNING',
      severity: 'MEDIUM',
      title: 'Yüksek Sıcaklık Uyarısı',
      description: 'Injection Molding #001 sıcaklığı normal değerlerin üzerinde',
      machineId: machine1.id,
      userId: user1.id,
      status: 'ACTIVE',
    },
    {
      type: 'CRITICAL',
      severity: 'HIGH',
      title: 'Bakım Gerekli',
      description: 'Packaging Unit #004 acil bakım gerektiriyor',
      machineId: machine4.id,
      userId: user3.id,
      status: 'ACTIVE',
    },
    {
      type: 'INFO',
      severity: 'LOW',
      title: 'Planlı Bakım Hatırlatması',
      description: 'CNC Milling #002 için haftalık bakım zamanı yaklaşıyor',
      machineId: machine2.id,
      userId: user3.id,
      status: 'ACKNOWLEDGED',
    },
  ];

  for (const alert of alerts) {
    await prisma.alert.create({ data: alert });
  }

  // Bakım taleplerini oluştur
  const maintenanceRequests = [
    {
      type: 'EMERGENCY',
      priority: 'HIGH',
      title: 'Packaging Unit Motor Arızası',
      description: 'Ana motor çalışmıyor, acil müdahale gerekli',
      machineId: machine4.id,
      requestedBy: user1.id,
      status: 'IN_PROGRESS',
      scheduledDate: new Date(),
      estimatedCost: 5000,
    },
    {
      type: 'PREVENTIVE',
      priority: 'MEDIUM',
      title: 'CNC Haftalık Bakım',
      description: 'Rutin haftalık bakım ve kalibrasyon',
      machineId: machine2.id,
      requestedBy: user1.id,
      assignedTo: user3.id,
      status: 'PENDING',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
      estimatedCost: 500,
    },
    {
      type: 'CORRECTIVE',
      priority: 'LOW',
      title: 'Assembly Line Temizlik',
      description: 'Hat temizliği ve yağlama işlemi',
      machineId: machine3.id,
      requestedBy: user1.id,
      assignedTo: user3.id,
      status: 'COMPLETED',
      scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      estimatedCost: 200,
      actualCost: 180,
    },
  ];

  for (const request of maintenanceRequests) {
    await prisma.maintenanceRequest.create({ data: request });
  }

  // Üretim çalışmalarını oluştur
  const productionRuns = [
    {
      machineId: machine1.id,
      productName: 'Plastik Kapak A1',
      batchNumber: 'BATCH-2024-001',
      quantity: 1000,
      qualityScore: 96.5,
      defectRate: 2.1,
      energyUsed: 45.2,
      startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      status: 'COMPLETED',
    },
    {
      machineId: machine2.id,
      productName: 'Metal Parça B2',
      batchNumber: 'BATCH-2024-002',
      quantity: 500,
      qualityScore: 94.2,
      defectRate: 1.8,
      energyUsed: 32.1,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'RUNNING',
    },
    {
      machineId: machine3.id,
      productName: 'Montaj Ürün C3',
      batchNumber: 'BATCH-2024-003',
      quantity: 200,
      qualityScore: 98.1,
      defectRate: 0.5,
      energyUsed: 15.3,
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      endTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      status: 'COMPLETED',
    },
  ];

  for (const run of productionRuns) {
    await prisma.productionRun.create({ data: run });
  }

  // Enerji tüketim verilerini oluştur
  const energyData = [
    {
      machineId: machine1.id,
      consumption: 45.2,
      cost: 18.08,
      carbonFootprint: 22.6,
      period: 'HOURLY',
    },
    {
      machineId: machine2.id,
      consumption: 32.1,
      cost: 12.84,
      carbonFootprint: 16.05,
      period: 'HOURLY',
    },
    {
      machineId: machine3.id,
      consumption: 15.3,
      cost: 6.12,
      carbonFootprint: 7.65,
      period: 'HOURLY',
    },
    {
      facility: 'Main Factory',
      consumption: 125.0,
      cost: 50.0,
      carbonFootprint: 62.5,
      period: 'DAILY',
    },
  ];

  for (const energy of energyData) {
    await prisma.energyConsumption.create({ data: energy });
  }

  // Envanter oluştur
  const inventory = [
    {
      partNumber: 'PART-001',
      name: 'Motor Yağı 5L',
      category: 'Lubricants',
      quantity: 25,
      minStock: 10,
      unitCost: 45.50,
      supplier: 'Mobil Oil',
      location: 'Depo-A-01',
    },
    {
      partNumber: 'PART-002',
      name: 'Rulman 6204',
      category: 'Bearings',
      quantity: 50,
      minStock: 20,
      unitCost: 12.30,
      supplier: 'SKF',
      location: 'Depo-B-15',
    },
    {
      partNumber: 'PART-003',
      name: 'Sensör Kablosu 10m',
      category: 'Cables',
      quantity: 8,
      minStock: 15,
      unitCost: 23.75,
      supplier: 'Siemens',
      location: 'Depo-C-05',
    },
    {
      partNumber: 'PART-004',
      name: 'Plastik Granül Tip A',
      category: 'Raw Materials',
      quantity: 500,
      minStock: 100,
      unitCost: 2.80,
      supplier: 'Petkim',
      location: 'Depo-D-20',
    },
  ];

  for (const item of inventory) {
    await prisma.inventory.create({ data: item });
  }

  // Sistem logları oluştur
  const systemLogs = [
    {
      level: 'INFO',
      module: 'Authentication',
      action: 'User Login',
      details: 'Mustafa Yardım sisteme giriş yaptı',
      userId: user1.id,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      level: 'WARNING',
      module: 'Machine Monitoring',
      action: 'Temperature Alert',
      details: 'Injection Molding #001 sıcaklık uyarısı',
    },
    {
      level: 'ERROR',
      module: 'Production',
      action: 'Machine Failure',
      details: 'Packaging Unit #004 motor arızası',
    },
    {
      level: 'INFO',
      module: 'Maintenance',
      action: 'Maintenance Completed',
      details: 'Assembly Line #003 bakım tamamlandı',
      userId: user3.id,
    },
  ];

  for (const log of systemLogs) {
    await prisma.systemLog.create({ data: log });
  }

  // Kullanıcı oturumları oluştur
  const sessions = [
    {
      userId: user1.id,
      token: 'token-mustafa-001',
      deviceInfo: 'Chrome 120.0 / Windows 10',
      ipAddress: '192.168.1.101',
      location: 'İstanbul, Türkiye',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      isActive: true,
    },
    {
      userId: user2.id,
      token: 'token-admin-001',
      deviceInfo: 'Firefox 121.0 / Ubuntu 20.04',
      ipAddress: '192.168.1.102',
      location: 'Ankara, Türkiye',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      isActive: true,
    },
  ];

  for (const session of sessions) {
    await prisma.userSession.create({ data: session });
  }

  console.log('✅ Seed data created successfully!');
  console.log(`📊 Created:
  - ${3} users
  - ${4} machines
  - ${12} sensors
  - ${3} alerts
  - ${3} maintenance requests
  - ${3} production runs
  - ${4} energy consumption records
  - ${4} inventory items
  - ${4} system logs
  - ${2} user sessions`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 