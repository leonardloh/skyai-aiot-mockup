import type { 
  EnvironmentalData, 
  PlantData, 
  IrrigationData, 
  HarvestPrediction, 
  AlertData, 
  AIInsight
} from '../types/dashboard';

// Environmental data for the last 24 hours
export const environmentalHistory: EnvironmentalData[] = Array.from({ length: 24 }, (_, i) => ({
  temperature: 22 + Math.sin(i * 0.2) * 3 + Math.random() * 2,
  humidity: 65 + Math.sin(i * 0.15) * 10 + Math.random() * 5,
  co2: 400 + Math.random() * 100,
  lighting: i >= 6 && i <= 18 ? 800 + Math.random() * 200 : 50 + Math.random() * 30,
  ph: 6.0 + Math.random() * 1.0, // pH range 6.0-7.0
  soilMoisture: 60 + Math.random() * 20, // Moisture 60-80%
  timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000)
}));

export const currentEnvironmental: EnvironmentalData = {
  temperature: 24.5,
  humidity: 68,
  co2: 450,
  lighting: 950,
  ph: 6.2,
  soilMoisture: 68.5,
  timestamp: new Date()
};

// Plant data grid (6x8 = 48 plants)
export const plantsGrid: PlantData[] = Array.from({ length: 48 }, (_, i) => {
  const row = Math.floor(i / 8);
  const column = i % 8;
  const plantTypes = ['Tomato', 'Lettuce', 'Cucumber', 'Pepper', 'Herbs', 'Spinach'];
  const stages = ['seedling', 'vegetative', 'flowering', 'fruiting', 'harvest'] as const;
  
  const healthScore = 60 + Math.random() * 40;
  const status = healthScore > 85 ? 'healthy' : healthScore > 70 ? 'warning' : 'critical';
  
  return {
    id: `plant-${i + 1}`,
    name: `${plantTypes[i % plantTypes.length]} ${i + 1}`,
    type: plantTypes[i % plantTypes.length],
    healthScore,
    growthStage: stages[Math.floor(Math.random() * stages.length)],
    status,
    lastWatered: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
    daysToHarvest: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 5 : undefined,
    location: { row, column }
  };
});

// Irrigation zones data
export const irrigationZones: IrrigationData[] = [
  {
    ph: 6.2,
    ec: 1.8,
    waterLevel: 85,
    nutrientLevel: 92,
    lastIrrigation: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nextScheduled: new Date(Date.now() + 4 * 60 * 60 * 1000),
    zone: 'Zone A'
  },
  {
    ph: 6.5,
    ec: 2.1,
    waterLevel: 72,
    nutrientLevel: 78,
    lastIrrigation: new Date(Date.now() - 1 * 60 * 60 * 1000),
    nextScheduled: new Date(Date.now() + 5 * 60 * 60 * 1000),
    zone: 'Zone B'
  },
  {
    ph: 6.0,
    ec: 1.9,
    waterLevel: 95,
    nutrientLevel: 88,
    lastIrrigation: new Date(Date.now() - 3 * 60 * 60 * 1000),
    nextScheduled: new Date(Date.now() + 3 * 60 * 60 * 1000),
    zone: 'Zone C'
  }
];

// Harvest predictions
export const harvestPredictions: HarvestPrediction[] = [
  {
    plantId: 'plant-5',
    plantName: 'Tomato 5',
    estimatedYield: 2.5,
    qualityScore: 92,
    harvestDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    confidence: 0.87
  },
  {
    plantId: 'plant-12',
    plantName: 'Cucumber 4',
    estimatedYield: 1.8,
    qualityScore: 88,
    harvestDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    confidence: 0.91
  },
  {
    plantId: 'plant-23',
    plantName: 'Pepper 7',
    estimatedYield: 0.9,
    qualityScore: 95,
    harvestDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    confidence: 0.83
  },
  {
    plantId: 'plant-31',
    plantName: 'Lettuce 7',
    estimatedYield: 0.4,
    qualityScore: 89,
    harvestDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    confidence: 0.94
  }
];

// Active alerts
export const activeAlerts: AlertData[] = [
  {
    id: 'alert-1',
    type: 'environmental',
    severity: 'medium',
    message: 'CO₂ levels approaching upper threshold in Zone B',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    resolved: false
  },
  {
    id: 'alert-2',
    type: 'plant',
    severity: 'high',
    message: 'Plant health score below 70% detected in Plant 34',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    resolved: false
  },
  {
    id: 'alert-3',
    type: 'irrigation',
    severity: 'low',
    message: 'Water level in Zone A below 80%',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    resolved: false
  }
];

// AI insights
export const aiInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'recommendation',
    title: 'Optimize Lighting Schedule',
    description: 'Analysis shows 15% savings possible by adjusting lighting timing for current growth stages',
    confidence: 0.89,
    impact: 'medium',
    category: 'environmental',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 'insight-2',
    type: 'prediction',
    title: 'Harvest Window Optimization',
    description: 'Predicted 8% yield increase if harvest timing is shifted by 2-3 days based on quality trends',
    confidence: 0.92,
    impact: 'high',
    category: 'harvesting',
    timestamp: new Date(Date.now() - 60 * 60 * 1000)
  },
  {
    id: 'insight-3',
    type: 'optimization',
    title: 'Nutrient Efficiency Improvement',
    description: 'EC levels can be reduced by 0.2 units in Zone C while maintaining optimal growth',
    confidence: 0.85,
    impact: 'medium',
    category: 'irrigation',
    timestamp: new Date(Date.now() - 90 * 60 * 1000)
  }
];