export interface EnvironmentalData {
  temperature: number;
  humidity: number;
  co2: number;
  lighting: number;
  ph: number;
  soilMoisture: number;
  timestamp: Date;
}

export interface PlantData {
  id: string;
  name: string;
  type: string;
  healthScore: number;
  growthStage: 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest';
  status: 'healthy' | 'warning' | 'critical';
  lastWatered: Date;
  daysToHarvest?: number;
  location: {
    row: number;
    column: number;
  };
}

export interface IrrigationData {
  ph: number;
  ec: number; // Electrical Conductivity
  waterLevel: number;
  nutrientLevel: number;
  lastIrrigation: Date;
  nextScheduled: Date;
  zone: string;
}

export interface HarvestPrediction {
  plantId: string;
  plantName: string;
  estimatedYield: number;
  qualityScore: number;
  harvestDate: Date;
  confidence: number;
}

export interface AlertData {
  id: string;
  type: 'environmental' | 'plant' | 'irrigation' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'prediction' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  category: 'environmental' | 'irrigation' | 'harvesting';
  timestamp: Date;
}