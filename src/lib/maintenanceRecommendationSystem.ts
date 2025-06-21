// Maintenance Recommendation System
// Proactive maintenance planning with AI-driven insights

export interface MaintenanceTask {
  id: string;
  machineId: string;
  taskType: 'preventive' | 'predictive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  estimatedDuration: number; // hours
  estimatedCost: number;
  requiredParts: MaintenancePart[];
  requiredSkills: string[];
  scheduledDate: Date;
  deadline: Date;
  riskLevel: number; // 0-100
  impactOnProduction: 'none' | 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[]; // other task IDs
  instructions: MaintenanceInstruction[];
}

export interface MaintenancePart {
  partId: string;
  name: string;
  quantity: number;
  unitCost: number;
  supplier: string;
  leadTime: number; // days
  inStock: boolean;
  criticalPart: boolean;
}

export interface MaintenanceInstruction {
  step: number;
  description: string;
  safetyNotes: string[];
  toolsRequired: string[];
  estimatedTime: number; // minutes
  checkpoints: string[];
}

export interface MaintenancePlan {
  planId: string;
  planName: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  machines: string[];
  tasks: MaintenanceTask[];
  totalCost: number;
  totalDuration: number;
  riskReduction: number;
  productionImpact: number;
  recommendations: string[];
  kpis: MaintenanceKPI[];
}

export interface MaintenanceKPI {
  metric: string;
  current: number;
  target: number;
  improvement: number;
  unit: string;
}

export interface MaintenanceCalendar {
  date: Date;
  tasks: MaintenanceTask[];
  workload: number; // hours
  availability: 'available' | 'busy' | 'overloaded';
  conflicts: string[];
}

class MaintenanceRecommendationSystem {
  private maintenanceHistory: Map<string, MaintenanceTask[]> = new Map();
  private spareParts: Map<string, MaintenancePart[]> = new Map();
  private maintenanceTeam = {
    technicians: 4,
    specialists: 2,
    workingHours: 8,
    shiftPattern: '2-shift' // 16 hours coverage
  };

  // Generate maintenance recommendations based on machine condition
  public generateRecommendations(machineId: string, riskScore: number, failureType: string): MaintenanceTask[] {
    const tasks: MaintenanceTask[] = [];
    const baseDate = new Date();

    // Critical maintenance tasks based on risk score
    if (riskScore >= 80) {
      tasks.push(this.createEmergencyTask(machineId, failureType, baseDate));
    } else if (riskScore >= 60) {
      tasks.push(this.createHighPriorityTask(machineId, failureType, baseDate));
    } else if (riskScore >= 30) {
      tasks.push(this.createPreventiveTask(machineId, failureType, baseDate));
    }

    // Add routine maintenance tasks
    tasks.push(...this.generateRoutineTasks(machineId, baseDate));

    // Add predictive maintenance tasks
    tasks.push(...this.generatePredictiveTasks(machineId, riskScore, baseDate));

    return tasks.sort((a, b) => this.getPriorityWeight(a.priority) - this.getPriorityWeight(b.priority));
  }

  // Create comprehensive maintenance plan
  public createMaintenancePlan(machines: string[], timeframe: 'week' | 'month' | 'quarter'): MaintenancePlan {
    const planId = `PLAN_${Date.now()}`;
    const allTasks: MaintenanceTask[] = [];
    
    machines.forEach(machineId => {
      const riskScore = Math.floor(Math.random() * 100);
      const failureTypes = ['Termal Arıza', 'Mekanik Aşınma', 'Elektriksel Sorun'];
      const failureType = failureTypes[Math.floor(Math.random() * failureTypes.length)];
      const machineTasks = this.generateRecommendations(machineId, riskScore, failureType);
      allTasks.push(...machineTasks);
    });

    // Optimize task scheduling
    const optimizedTasks = this.optimizeTaskScheduling(allTasks, timeframe);
    
    const totalCost = optimizedTasks.reduce((sum, task) => sum + task.estimatedCost, 0);
    const totalDuration = optimizedTasks.reduce((sum, task) => sum + task.estimatedDuration, 0);
    
    return {
      planId,
      planName: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}ly Maintenance Plan`,
      period: timeframe === 'week' ? 'weekly' : timeframe === 'month' ? 'monthly' : 'quarterly',
      machines,
      tasks: optimizedTasks,
      totalCost,
      totalDuration,
      riskReduction: this.calculateRiskReduction(optimizedTasks),
      productionImpact: this.calculateProductionImpact(optimizedTasks),
      recommendations: this.generatePlanRecommendations(optimizedTasks),
      kpis: this.generateMaintenanceKPIs(optimizedTasks)
    };
  }

  // Create emergency maintenance task
  private createEmergencyTask(machineId: string, failureType: string, baseDate: Date): MaintenanceTask {
    return {
      id: `EMG_${machineId}_${Date.now()}`,
      machineId,
      taskType: 'emergency',
      priority: 'critical',
      title: `Acil ${failureType} Müdahalesi`,
      description: `${machineId} makinesinde kritik ${failureType} riski tespit edildi. Acil müdahale gerekli.`,
      estimatedDuration: 4,
      estimatedCost: 5000,
      requiredParts: this.getEmergencyParts(failureType),
      requiredSkills: ['Specialist', 'Electrical Technician'],
      scheduledDate: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours
      deadline: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000), // 8 hours
      riskLevel: 95,
      impactOnProduction: 'critical',
      dependencies: [],
      instructions: this.getEmergencyInstructions(failureType)
    };
  }

  // Create high priority maintenance task
  private createHighPriorityTask(machineId: string, failureType: string, baseDate: Date): MaintenanceTask {
    return {
      id: `HIGH_${machineId}_${Date.now()}`,
      machineId,
      taskType: 'predictive',
      priority: 'high',
      title: `${failureType} Önleyici Bakım`,
      description: `${machineId} makinesinde ${failureType} riski artıyor. Önleyici bakım planlanmalı.`,
      estimatedDuration: 6,
      estimatedCost: 2500,
      requiredParts: this.getPredictiveParts(failureType),
      requiredSkills: ['Technician', 'Mechanical Specialist'],
      scheduledDate: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000), // 1 day
      deadline: new Date(baseDate.getTime() + 72 * 60 * 60 * 1000), // 3 days
      riskLevel: 70,
      impactOnProduction: 'medium',
      dependencies: [],
      instructions: this.getPredictiveInstructions(failureType)
    };
  }

  // Create preventive maintenance task
  private createPreventiveTask(machineId: string, failureType: string, baseDate: Date): MaintenanceTask {
    return {
      id: `PREV_${machineId}_${Date.now()}`,
      machineId,
      taskType: 'preventive',
      priority: 'medium',
      title: `Rutin ${failureType} Kontrolü`,
      description: `${machineId} makinesinde rutin ${failureType} kontrolü ve bakımı.`,
      estimatedDuration: 3,
      estimatedCost: 800,
      requiredParts: this.getPreventiveParts(failureType),
      requiredSkills: ['Technician'],
      scheduledDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week
      deadline: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      riskLevel: 30,
      impactOnProduction: 'low',
      dependencies: [],
      instructions: this.getPreventiveInstructions(failureType)
    };
  }

  // Generate routine maintenance tasks
  private generateRoutineTasks(machineId: string, baseDate: Date): MaintenanceTask[] {
    const routineTasks = [
      {
        title: 'Günlük Kontrol',
        description: 'Günlük rutin kontrol ve temizlik',
        duration: 1,
        cost: 100,
        interval: 1 // days
      },
      {
        title: 'Haftalık Bakım',
        description: 'Yağlama ve filtre kontrolü',
        duration: 2,
        cost: 300,
        interval: 7 // days
      },
      {
        title: 'Aylık İnceleme',
        description: 'Detaylı performans analizi',
        duration: 4,
        cost: 800,
        interval: 30 // days
      }
    ];

    return routineTasks.map((routine, index) => ({
      id: `ROUTINE_${machineId}_${index}_${Date.now()}`,
      machineId,
      taskType: 'preventive' as const,
      priority: 'low' as const,
      title: routine.title,
      description: routine.description,
      estimatedDuration: routine.duration,
      estimatedCost: routine.cost,
      requiredParts: [],
      requiredSkills: ['Operator', 'Technician'],
      scheduledDate: new Date(baseDate.getTime() + routine.interval * 24 * 60 * 60 * 1000),
      deadline: new Date(baseDate.getTime() + (routine.interval + 2) * 24 * 60 * 60 * 1000),
      riskLevel: 10,
      impactOnProduction: 'none' as const,
      dependencies: [],
      instructions: []
    }));
  }

  // Generate predictive maintenance tasks
  private generatePredictiveTasks(machineId: string, riskScore: number, baseDate: Date): MaintenanceTask[] {
    const tasks: MaintenanceTask[] = [];

    if (riskScore > 40) {
      tasks.push({
        id: `PRED_${machineId}_VIBRATION_${Date.now()}`,
        machineId,
        taskType: 'predictive',
        priority: 'medium',
        title: 'Titreşim Analizi',
        description: 'Makine titreşim seviyelerinin detaylı analizi',
        estimatedDuration: 2,
        estimatedCost: 500,
        requiredParts: [],
        requiredSkills: ['Vibration Analyst'],
        scheduledDate: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        deadline: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        riskLevel: riskScore,
        impactOnProduction: 'low',
        dependencies: [],
        instructions: []
      });
    }

    return tasks;
  }

  // Optimize task scheduling based on resources and priorities
  private optimizeTaskScheduling(tasks: MaintenanceTask[], timeframe: string): MaintenanceTask[] {
    // Sort by priority and risk level
    const sortedTasks = tasks.sort((a, b) => {
      const priorityDiff = this.getPriorityWeight(a.priority) - this.getPriorityWeight(b.priority);
      if (priorityDiff !== 0) return priorityDiff;
      return b.riskLevel - a.riskLevel;
    });

    // Adjust scheduling based on resource availability
    let currentDate = new Date();
    const optimizedTasks = sortedTasks.map(task => {
      const optimizedTask = { ...task };
      
      // Ensure minimum time between tasks
      if (currentDate > task.scheduledDate) {
        optimizedTask.scheduledDate = new Date(currentDate);
        optimizedTask.deadline = new Date(currentDate.getTime() + (task.deadline.getTime() - task.scheduledDate.getTime()));
      }
      
      currentDate = new Date(optimizedTask.scheduledDate.getTime() + task.estimatedDuration * 60 * 60 * 1000);
      return optimizedTask;
    });

    return optimizedTasks;
  }

  // Get priority weight for sorting
  private getPriorityWeight(priority: string): number {
    const weights = { critical: 1, high: 2, medium: 3, low: 4 };
    return weights[priority as keyof typeof weights] || 5;
  }

  // Calculate machine risk score (mock implementation)
  private calculateMachineRisk(machineId: string): number {
    return Math.floor(Math.random() * 100);
  }

  // Predict failure type (mock implementation)
  private predictFailureType(machineId: string): string {
    const types = ['Termal Arıza', 'Mekanik Aşınma', 'Elektriksel Sorun', 'Hidrolik Kaçak'];
    return types[Math.floor(Math.random() * types.length)];
  }

  // Get emergency parts based on failure type
  private getEmergencyParts(failureType: string): MaintenancePart[] {
    const partMap: Record<string, MaintenancePart[]> = {
      'Termal Arıza': [
        { partId: 'COOL001', name: 'Soğutma Fanı', quantity: 1, unitCost: 500, supplier: 'TechParts', leadTime: 1, inStock: true, criticalPart: true }
      ],
      'Mekanik Aşınma': [
        { partId: 'BEAR001', name: 'Rulman Seti', quantity: 2, unitCost: 300, supplier: 'MechParts', leadTime: 2, inStock: true, criticalPart: true }
      ],
      default: []
    };
    return partMap[failureType] || partMap.default;
  }

  // Get predictive parts
  private getPredictiveParts(failureType: string): MaintenancePart[] {
    return [
      { partId: 'FILT001', name: 'Yağ Filtresi', quantity: 1, unitCost: 50, supplier: 'FilterCorp', leadTime: 3, inStock: true, criticalPart: false }
    ];
  }

  // Get preventive parts
  private getPreventiveParts(failureType: string): MaintenancePart[] {
    return [
      { partId: 'OIL001', name: 'Makine Yağı', quantity: 5, unitCost: 30, supplier: 'LubeCorp', leadTime: 1, inStock: true, criticalPart: false }
    ];
  }

  // Get emergency instructions
  private getEmergencyInstructions(failureType: string): MaintenanceInstruction[] {
    return [
      {
        step: 1,
        description: 'Makineyi güvenli şekilde durdurun',
        safetyNotes: ['LOTO prosedürü uygulayın', 'Kişisel koruyucu ekipman kullanın'],
        toolsRequired: ['Multimetre', 'İzolasyon anahtarı'],
        estimatedTime: 30,
        checkpoints: ['Güç kesildi', 'Sistem basıncı sıfır']
      },
      {
        step: 2,
        description: 'Arızalı bileşeni tespit edin',
        safetyNotes: ['Elektrik tehlikesine dikkat'],
        toolsRequired: ['Termal kamera', 'Titreşim ölçer'],
        estimatedTime: 60,
        checkpoints: ['Arıza lokasyonu belirlendi']
      }
    ];
  }

  // Get predictive instructions
  private getPredictiveInstructions(failureType: string): MaintenanceInstruction[] {
    return [
      {
        step: 1,
        description: 'Sistem performansını analiz edin',
        safetyNotes: ['Çalışan makineye dikkat'],
        toolsRequired: ['Performans ölçüm cihazı'],
        estimatedTime: 45,
        checkpoints: ['Baseline değerler alındı']
      }
    ];
  }

  // Get preventive instructions
  private getPreventiveInstructions(failureType: string): MaintenanceInstruction[] {
    return [
      {
        step: 1,
        description: 'Rutin kontrolleri gerçekleştirin',
        safetyNotes: ['Standart güvenlik prosedürleri'],
        toolsRequired: ['Kontrol listesi'],
        estimatedTime: 30,
        checkpoints: ['Tüm kontroller tamamlandı']
      }
    ];
  }

  // Calculate risk reduction from maintenance plan
  private calculateRiskReduction(tasks: MaintenanceTask[]): number {
    const totalRiskReduction = tasks.reduce((sum, task) => {
      const reductionMap = { critical: 30, high: 20, medium: 10, low: 5 };
      return sum + (reductionMap[task.priority as keyof typeof reductionMap] || 0);
    }, 0);
    return Math.min(100, totalRiskReduction);
  }

  // Calculate production impact
  private calculateProductionImpact(tasks: MaintenanceTask[]): number {
    const impactMap = { critical: 50, high: 30, medium: 15, low: 5, none: 0 };
    return tasks.reduce((sum, task) => sum + (impactMap[task.impactOnProduction] || 0), 0);
  }

  // Generate plan recommendations
  private generatePlanRecommendations(tasks: MaintenanceTask[]): string[] {
    const recommendations = [];
    
    const criticalTasks = tasks.filter(t => t.priority === 'critical').length;
    if (criticalTasks > 0) {
      recommendations.push(`${criticalTasks} kritik görev acil müdahale gerektiriyor`);
    }
    
    const totalCost = tasks.reduce((sum, task) => sum + task.estimatedCost, 0);
    if (totalCost > 20000) {
      recommendations.push('Yüksek maliyet - bütçe onayı gerekli');
    }
    
    recommendations.push('Yedek parça stokları kontrol edilmeli');
    recommendations.push('Teknisyen kapasitesi planlanmalı');
    
    return recommendations;
  }

  // Generate maintenance KPIs
  private generateMaintenanceKPIs(tasks: MaintenanceTask[]): MaintenanceKPI[] {
    return [
      {
        metric: 'MTBF (Ortalama Arıza Süresi)',
        current: 720,
        target: 1000,
        improvement: 38.9,
        unit: 'saat'
      },
      {
        metric: 'MTTR (Ortalama Tamir Süresi)',
        current: 4.2,
        target: 3.0,
        improvement: -28.6,
        unit: 'saat'
      },
      {
        metric: 'Bakım Maliyeti',
        current: 15000,
        target: 12000,
        improvement: -20.0,
        unit: 'TL/ay'
      },
      {
        metric: 'Planlı Bakım Oranı',
        current: 65,
        target: 85,
        improvement: 30.8,
        unit: '%'
      }
    ];
  }

  // Generate maintenance calendar
  public generateMaintenanceCalendar(plan: MaintenancePlan): MaintenanceCalendar[] {
    const calendar: MaintenanceCalendar[] = [];
    const startDate = new Date();
    
    for (let i = 0; i < 30; i++) { // 30 days
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dayTasks = plan.tasks.filter(task => 
        task.scheduledDate.toDateString() === date.toDateString()
      );
      
      const workload = dayTasks.reduce((sum, task) => sum + task.estimatedDuration, 0);
      
      calendar.push({
        date,
        tasks: dayTasks,
        workload,
        availability: workload <= 8 ? 'available' : workload <= 16 ? 'busy' : 'overloaded',
        conflicts: workload > 16 ? ['Kapasite aşımı'] : []
      });
    }
    
    return calendar;
  }
}

// Singleton instance
export const maintenanceRecommendationSystem = new MaintenanceRecommendationSystem();
export default maintenanceRecommendationSystem; 