// Online Learning Service
// Sürekli öğrenen (online learning) modellerle otomatik model güncelleme sistemi

import { MachineHealthData, MLModelMetrics, FailurePrediction } from './predictiveMaintenanceAI';
import { OEEData, ProductionLineOEE } from './oeeAnalytics';

export interface OnlineLearningConfig {
  modelUpdateFrequency: number; // minutes
  batchSize: number;
  learningRate: number;
  adaptationThreshold: number; // 0-1, model güncelleme için minimum accuracy düşüş eşiği
  maxModelAge: number; // hours, maksimum model yaşı
  enableAutoRetrain: boolean;
  dataRetentionDays: number;
  validationSplitRatio: number; // 0-1
}

export interface ModelPerformanceMetrics {
  modelId: string;
  modelType: 'predictive_maintenance' | 'oee_prediction' | 'quality_control' | 'energy_optimization';
  currentAccuracy: number;
  previousAccuracy: number;
  accuracyTrend: 'improving' | 'stable' | 'declining';
  dataPointsProcessed: number;
  lastUpdateTime: Date;
  nextScheduledUpdate: Date;
  adaptationScore: number; // 0-100, modelin yeni verilere uyum skoru
  driftDetected: boolean;
  retrainRecommended: boolean;
}

export interface LearningEvent {
  eventId: string;
  timestamp: Date;
  eventType: 'data_ingestion' | 'model_update' | 'performance_evaluation' | 'drift_detection' | 'retrain_trigger';
  modelId: string;
  details: any;
  performanceImpact: number; // -100 to +100
  actionTaken: string;
}

export interface AdaptivePrediction extends FailurePrediction {
  modelConfidence: number;
  dataFreshness: number; // 0-100, verinin ne kadar güncel olduğu
  adaptationLevel: number; // 0-100, modelin ne kadar adapte olduğu
  learningProgress: number; // 0-100, öğrenme ilerlemesi
}

export interface IncrementalModelState {
  modelId: string;
  weights: number[];
  biases: number[];
  featureImportance: Map<string, number>;
  lastTrainingData: any[];
  performanceHistory: number[];
  driftScore: number;
  stabilityIndex: number;
}

class OnlineLearningService {
  private config: OnlineLearningConfig = {
    modelUpdateFrequency: 30, // 30 dakikada bir güncelleme
    batchSize: 50,
    learningRate: 0.001,
    adaptationThreshold: 0.05, // %5 accuracy düşüşü
    maxModelAge: 24, // 24 saat
    enableAutoRetrain: true,
    dataRetentionDays: 90,
    validationSplitRatio: 0.2
  };

  private modelStates: Map<string, IncrementalModelState> = new Map();
  private learningEvents: LearningEvent[] = [];
  private performanceMetrics: Map<string, ModelPerformanceMetrics> = new Map();
  private incomingDataBuffer: Map<string, any[]> = new Map();
  private updateScheduler: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeModels();
    this.startUpdateScheduler();
  }

  // Model başlatma
  private initializeModels(): void {
    const modelTypes = ['predictive_maintenance', 'oee_prediction', 'quality_control', 'energy_optimization'];
    
    modelTypes.forEach(type => {
      const modelState: IncrementalModelState = {
        modelId: `${type}_model_v1`,
        weights: this.initializeWeights(20), // 20 feature için başlangıç ağırlıkları
        biases: this.initializeBiases(5), // 5 output için bias değerleri
        featureImportance: new Map(),
        lastTrainingData: [],
        performanceHistory: [0.85, 0.87, 0.89, 0.91, 0.93], // Başlangıç performans geçmişi
        driftScore: 0,
        stabilityIndex: 95
      };

      this.modelStates.set(type, modelState);

      const metrics: ModelPerformanceMetrics = {
        modelId: modelState.modelId,
        modelType: type as any,
        currentAccuracy: 0.93,
        previousAccuracy: 0.91,
        accuracyTrend: 'improving',
        dataPointsProcessed: 15420,
        lastUpdateTime: new Date(Date.now() - 30 * 60 * 1000), // 30 dakika önce
        nextScheduledUpdate: new Date(Date.now() + 30 * 60 * 1000), // 30 dakika sonra
        adaptationScore: 87,
        driftDetected: false,
        retrainRecommended: false
      };

      this.performanceMetrics.set(type, metrics);
    });
  }

  // Yeni veri ekleme ve online learning
  public async ingestData(modelType: string, data: MachineHealthData | OEEData): Promise<void> {
    if (!this.incomingDataBuffer.has(modelType)) {
      this.incomingDataBuffer.set(modelType, []);
    }

    const buffer = this.incomingDataBuffer.get(modelType)!;
    buffer.push({
      ...data,
      ingestionTime: new Date()
    });

    // Buffer dolduğunda incremental learning yap
    if (buffer.length >= this.config.batchSize) {
      await this.performIncrementalLearning(modelType, buffer);
      this.incomingDataBuffer.set(modelType, []); // Buffer'ı temizle
    }

    this.logLearningEvent({
      eventId: `data_${Date.now()}`,
      timestamp: new Date(),
      eventType: 'data_ingestion',
      modelId: this.modelStates.get(modelType)?.modelId || '',
      details: { dataType: typeof data, bufferSize: buffer.length },
      performanceImpact: 0,
      actionTaken: 'Data added to buffer'
    });
  }

  // Incremental learning gerçekleştirme
  private async performIncrementalLearning(modelType: string, newData: any[]): Promise<void> {
    const modelState = this.modelStates.get(modelType);
    const metrics = this.performanceMetrics.get(modelType);
    
    if (!modelState || !metrics) return;

    // Feature extraction
    const features = this.extractFeaturesFromBatch(newData);
    
    // Concept drift detection
    const driftDetected = this.detectConceptDrift(modelState, features);
    
    if (driftDetected) {
      metrics.driftDetected = true;
      this.logLearningEvent({
        eventId: `drift_${Date.now()}`,
        timestamp: new Date(),
        eventType: 'drift_detection',
        modelId: modelState.modelId,
        details: { driftScore: modelState.driftScore },
        performanceImpact: -10,
        actionTaken: 'Concept drift detected, adapting model'
      });
    }

    // Incremental model update
    const previousAccuracy = metrics.currentAccuracy;
    await this.updateModelWeights(modelState, features);
    
    // Performance evaluation
    const newAccuracy = await this.evaluateModelPerformance(modelState, features);
    
    // Update metrics
    metrics.previousAccuracy = previousAccuracy;
    metrics.currentAccuracy = newAccuracy;
    metrics.accuracyTrend = this.calculateAccuracyTrend(metrics.performanceHistory);
    metrics.dataPointsProcessed += newData.length;
    metrics.lastUpdateTime = new Date();
    metrics.nextScheduledUpdate = new Date(Date.now() + this.config.modelUpdateFrequency * 60 * 1000);
    metrics.adaptationScore = this.calculateAdaptationScore(modelState);

    // Model performansı düştüyse retrain öner
    if (previousAccuracy - newAccuracy > this.config.adaptationThreshold) {
      metrics.retrainRecommended = true;
      
      if (this.config.enableAutoRetrain) {
        await this.triggerModelRetrain(modelType);
      }
    }

    this.logLearningEvent({
      eventId: `update_${Date.now()}`,
      timestamp: new Date(),
      eventType: 'model_update',
      modelId: modelState.modelId,
      details: { 
        previousAccuracy, 
        newAccuracy, 
        dataPoints: newData.length,
        driftDetected 
      },
      performanceImpact: (newAccuracy - previousAccuracy) * 100,
      actionTaken: 'Model weights updated with incremental learning'
    });
  }

  // Concept drift detection
  private detectConceptDrift(modelState: IncrementalModelState, newFeatures: any[]): boolean {
    if (modelState.lastTrainingData.length === 0) {
      modelState.lastTrainingData = newFeatures.slice(-100); // Son 100 veri noktasını sakla
      return false;
    }

    // Statistical drift detection using Kolmogorov-Smirnov test simulation
    const driftScore = this.calculateStatisticalDrift(modelState.lastTrainingData, newFeatures);
    modelState.driftScore = driftScore;

    // Drift threshold: 0.3 (30% değişim)
    const driftThreshold = 0.3;
    
    if (driftScore > driftThreshold) {
      modelState.stabilityIndex = Math.max(0, modelState.stabilityIndex - 10);
      return true;
    } else {
      modelState.stabilityIndex = Math.min(100, modelState.stabilityIndex + 1);
      return false;
    }
  }

  // Model ağırlıklarını güncelleme (Stochastic Gradient Descent)
  private async updateModelWeights(modelState: IncrementalModelState, features: any[]): Promise<void> {
    // Simulated incremental learning with gradient descent
    const learningRate = this.config.learningRate;
    
    features.forEach((feature, index) => {
      const gradient = this.calculateGradient(feature, modelState.weights);
      
      // Weight update: w = w - α * gradient
      modelState.weights = modelState.weights.map((weight, i) => 
        weight - learningRate * gradient[i % gradient.length]
      );

      // Feature importance güncelleme
      Object.keys(feature).forEach(key => {
        const currentImportance = modelState.featureImportance.get(key) || 0;
        const newImportance = currentImportance + Math.abs(gradient[0]) * 0.1;
        modelState.featureImportance.set(key, newImportance);
      });
    });

    // Bias güncelleme
    modelState.biases = modelState.biases.map(bias => 
      bias - learningRate * (Math.random() - 0.5) * 0.01
    );
  }

  // Model performansını değerlendirme
  private async evaluateModelPerformance(modelState: IncrementalModelState, testData: any[]): Promise<number> {
    // Cross-validation simulation
    const validationSize = Math.floor(testData.length * this.config.validationSplitRatio);
    const validationData = testData.slice(0, validationSize);
    
    let correctPredictions = 0;
    
    validationData.forEach(data => {
      const prediction = this.makePrediction(modelState, data);
      const actual = this.getActualValue(data);
      
      // Accuracy calculation (simplified)
      if (Math.abs(prediction - actual) < 0.1) {
        correctPredictions++;
      }
    });

    const accuracy = validationData.length > 0 ? correctPredictions / validationData.length : 0.9;
    modelState.performanceHistory.push(accuracy);
    
    // Son 10 performans değerini tut
    if (modelState.performanceHistory.length > 10) {
      modelState.performanceHistory = modelState.performanceHistory.slice(-10);
    }

    return accuracy;
  }

  // Adaptive prediction with online learning insights
  public async getAdaptivePrediction(modelType: string, inputData: MachineHealthData): Promise<AdaptivePrediction | null> {
    const modelState = this.modelStates.get(modelType);
    const metrics = this.performanceMetrics.get(modelType);
    
    if (!modelState || !metrics) return null;

    // Base prediction (mevcut predictive maintenance AI'dan)
    const basePrediction = await this.getBasePrediction(inputData);
    if (!basePrediction) return null;

    // Online learning enhancements
    const modelConfidence = this.calculateModelConfidence(modelState, metrics);
    const dataFreshness = this.calculateDataFreshness(inputData);
    const adaptationLevel = metrics.adaptationScore;
    const learningProgress = this.calculateLearningProgress(modelState);

    // Adaptive adjustments
    const adaptedRiskScore = this.adaptRiskScore(basePrediction.riskScore, modelState, inputData);
    const adaptedConfidence = Math.min(95, basePrediction.confidenceLevel * (modelConfidence / 100));

    return {
      ...basePrediction,
      riskScore: adaptedRiskScore,
      confidenceLevel: adaptedConfidence,
      modelConfidence,
      dataFreshness,
      adaptationLevel,
      learningProgress,
      recommendations: [
        ...basePrediction.recommendations,
        `Model güven seviyesi: ${modelConfidence.toFixed(1)}%`,
        `Veri güncelliği: ${dataFreshness.toFixed(1)}%`,
        `Öğrenme ilerlemesi: ${learningProgress.toFixed(1)}%`
      ]
    };
  }

  // Model retraining tetikleme
  private async triggerModelRetrain(modelType: string): Promise<void> {
    const modelState = this.modelStates.get(modelType);
    const metrics = this.performanceMetrics.get(modelType);
    
    if (!modelState || !metrics) return;

    // Full model retrain simulation
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye simülasyon

    // Reset model state with improved parameters
    modelState.weights = this.initializeWeights(modelState.weights.length);
    modelState.biases = this.initializeBiases(modelState.biases.length);
    modelState.performanceHistory = [0.95]; // Retrain sonrası yüksek performans
    modelState.driftScore = 0;
    modelState.stabilityIndex = 100;

    // Update metrics
    metrics.currentAccuracy = 0.95;
    metrics.previousAccuracy = 0.93;
    metrics.accuracyTrend = 'improving';
    metrics.lastUpdateTime = new Date();
    metrics.driftDetected = false;
    metrics.retrainRecommended = false;
    metrics.adaptationScore = 95;

    this.logLearningEvent({
      eventId: `retrain_${Date.now()}`,
      timestamp: new Date(),
      eventType: 'retrain_trigger',
      modelId: modelState.modelId,
      details: { reason: 'Performance degradation', newAccuracy: 0.95 },
      performanceImpact: 20,
      actionTaken: 'Full model retrain completed'
    });
  }

  // Update scheduler başlatma
  private startUpdateScheduler(): void {
    if (this.updateScheduler) {
      clearInterval(this.updateScheduler);
    }

    this.updateScheduler = setInterval(async () => {
      for (const [modelType, metrics] of this.performanceMetrics.entries()) {
        if (new Date() >= metrics.nextScheduledUpdate) {
          const buffer = this.incomingDataBuffer.get(modelType) || [];
          if (buffer.length > 0) {
            await this.performIncrementalLearning(modelType, buffer);
            this.incomingDataBuffer.set(modelType, []);
          }
        }
      }
    }, this.config.modelUpdateFrequency * 60 * 1000);
  }

  // Public API methods
  public getModelPerformanceMetrics(): ModelPerformanceMetrics[] {
    return Array.from(this.performanceMetrics.values());
  }

  public getLearningEvents(limit: number = 50): LearningEvent[] {
    return this.learningEvents.slice(-limit);
  }

  public getOnlineLearningConfig(): OnlineLearningConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<OnlineLearningConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Scheduler'ı yeniden başlat
    this.startUpdateScheduler();
  }

  public getModelState(modelType: string): IncrementalModelState | null {
    return this.modelStates.get(modelType) || null;
  }

  // Helper methods
  private initializeWeights(size: number): number[] {
    return Array.from({ length: size }, () => (Math.random() - 0.5) * 0.1);
  }

  private initializeBiases(size: number): number[] {
    return Array.from({ length: size }, () => Math.random() * 0.01);
  }

  private extractFeaturesFromBatch(data: any[]): any[] {
    return data.map(item => ({
      temperature: item.temperature || 0,
      pressure: item.pressure || 0,
      vibration: item.vibration || 0,
      efficiency: item.efficiency || 0,
      timestamp: item.timestamp || new Date()
    }));
  }

  private calculateStatisticalDrift(oldData: any[], newData: any[]): number {
    // Simplified KS test simulation
    if (oldData.length === 0 || newData.length === 0) return 0;
    
    const oldMean = oldData.reduce((sum, d) => sum + (d.temperature || 0), 0) / oldData.length;
    const newMean = newData.reduce((sum, d) => sum + (d.temperature || 0), 0) / newData.length;
    
    return Math.abs(oldMean - newMean) / Math.max(oldMean, newMean, 1);
  }

  private calculateGradient(feature: any, weights: number[]): number[] {
    // Simplified gradient calculation
    return weights.map((w, i) => (Math.random() - 0.5) * 0.01);
  }

  private makePrediction(modelState: IncrementalModelState, data: any): number {
    // Simplified prediction using weights
    const features = [data.temperature || 0, data.pressure || 0, data.efficiency || 0];
    return features.reduce((sum, f, i) => sum + f * (modelState.weights[i] || 0), 0);
  }

  private getActualValue(data: any): number {
    // Simulated actual value
    return data.efficiency || Math.random();
  }

  private calculateAccuracyTrend(history: number[]): 'improving' | 'stable' | 'declining' {
    if (history.length < 3) return 'stable';
    
    const recent = history.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const older = history.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    
    if (recent > older + 0.02) return 'improving';
    if (recent < older - 0.02) return 'declining';
    return 'stable';
  }

  private calculateAdaptationScore(modelState: IncrementalModelState): number {
    const stabilityWeight = 0.4;
    const performanceWeight = 0.4;
    const driftWeight = 0.2;
    
    const avgPerformance = modelState.performanceHistory.reduce((a, b) => a + b, 0) / modelState.performanceHistory.length;
    const driftPenalty = Math.max(0, 100 - modelState.driftScore * 100);
    
    return Math.min(100, 
      modelState.stabilityIndex * stabilityWeight +
      avgPerformance * 100 * performanceWeight +
      driftPenalty * driftWeight
    );
  }

  private calculateModelConfidence(modelState: IncrementalModelState, metrics: ModelPerformanceMetrics): number {
    const accuracyWeight = 0.5;
    const stabilityWeight = 0.3;
    const freshnessWeight = 0.2;
    
    const freshnessScore = Math.max(0, 100 - (Date.now() - metrics.lastUpdateTime.getTime()) / (1000 * 60 * 60)); // Hours to score
    
    return Math.min(100,
      metrics.currentAccuracy * 100 * accuracyWeight +
      modelState.stabilityIndex * stabilityWeight +
      freshnessScore * freshnessWeight
    );
  }

  private calculateDataFreshness(data: MachineHealthData): number {
    const dataAge = Date.now() - data.timestamp.getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    return Math.max(0, 100 - (dataAge / maxAge) * 100);
  }

  private calculateLearningProgress(modelState: IncrementalModelState): number {
    if (modelState.performanceHistory.length < 2) return 0;
    
    const firstPerformance = modelState.performanceHistory[0];
    const latestPerformance = modelState.performanceHistory[modelState.performanceHistory.length - 1];
    
    return Math.max(0, Math.min(100, (latestPerformance - firstPerformance) * 100 + 50));
  }

  private adaptRiskScore(baseRiskScore: number, modelState: IncrementalModelState, data: MachineHealthData): number {
    // Feature importance bazlı risk skoru adaptasyonu
    let adaptationFactor = 1.0;
    
    const tempImportance = modelState.featureImportance.get('temperature') || 0;
    const pressureImportance = modelState.featureImportance.get('pressure') || 0;
    
    if (data.temperature > 250 && tempImportance > 0.5) {
      adaptationFactor += 0.1; // Risk artır
    }
    
    if (data.pressure > 150 && pressureImportance > 0.3) {
      adaptationFactor += 0.05; // Risk artır
    }
    
    return Math.min(100, Math.max(0, baseRiskScore * adaptationFactor));
  }

  private async getBasePrediction(data: MachineHealthData): Promise<FailurePrediction | null> {
    // Mevcut predictive maintenance AI'dan prediction al
    // Bu gerçek implementasyonda predictiveMaintenanceAI.predictFailure() çağrılacak
    return {
      machineId: data.machineId,
      riskLevel: 'medium',
      riskScore: 45,
      predictedFailureTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      confidenceLevel: 85,
      failureType: 'Thermal degradation',
      primaryCause: 'Temperature fluctuation',
      recommendations: ['Monitor temperature closely', 'Schedule preventive maintenance'],
      affectedComponents: ['Heating element', 'Temperature sensor'],
      estimatedCost: 2500,
      preventiveActions: []
    };
  }

  private logLearningEvent(event: LearningEvent): void {
    this.learningEvents.push(event);
    
    // Son 1000 eventi tut
    if (this.learningEvents.length > 1000) {
      this.learningEvents = this.learningEvents.slice(-1000);
    }
  }

  // Cleanup
  public destroy(): void {
    if (this.updateScheduler) {
      clearInterval(this.updateScheduler);
      this.updateScheduler = null;
    }
  }
}

// Singleton instance
export const onlineLearningService = new OnlineLearningService();
export default OnlineLearningService;