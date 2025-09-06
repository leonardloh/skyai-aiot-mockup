import React, { useState } from 'react';
import { useTheme } from './context/ThemeContext';
// Temporarily removing recharts and lucide-react until dependencies are resolved
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { Thermometer, Droplets, Leaf, Zap, AlertTriangle, TrendingUp, Settings, Activity } from 'lucide-react';
import './App.css';


// Mock data for comprehensive dashboard
const environmentalData = [
  { time: '00:00', temp: 22.5, humidity: 65, co2: 400, wind: 2.1, light: 0, pressure: 1013.2, soilTemp: 21.8, soilMoisture: 45, ph: 6.5 },
  { time: '06:00', temp: 20.1, humidity: 70, co2: 380, wind: 1.8, light: 150, pressure: 1013.8, soilTemp: 21.2, soilMoisture: 48, ph: 6.4 },
  { time: '12:00', temp: 26.3, humidity: 58, co2: 420, wind: 3.2, light: 850, pressure: 1012.5, soilTemp: 24.1, soilMoisture: 42, ph: 6.6 },
  { time: '18:00', temp: 24.8, humidity: 62, co2: 390, wind: 2.7, light: 320, pressure: 1012.9, soilTemp: 23.5, soilMoisture: 44, ph: 6.5 },
  { time: '24:00', temp: 22.0, humidity: 68, co2: 375, wind: 1.9, light: 0, pressure: 1013.1, soilTemp: 22.0, soilMoisture: 46, ph: 6.4 },
];

const environmentalZones = [
  { zone: 'A', temp: 24.2, humidity: 62, status: 'optimal', plants: 128, co2: 375, alerts: 0 },
  { zone: 'B', temp: 23.8, humidity: 65, status: 'good', plants: 95, co2: 385, alerts: 1 },
  { zone: 'C', temp: 25.1, humidity: 58, status: 'warning', plants: 112, co2: 420, alerts: 2 },
  { zone: 'D', temp: 22.9, humidity: 70, status: 'optimal', plants: 104, co2: 365, alerts: 0 },
  { zone: 'E', temp: 24.5, humidity: 60, status: 'good', plants: 87, co2: 390, alerts: 0 },
];

const environmentalAlerts = [
  { id: 1, type: 'critical', message: 'Zone C: Temperature exceeds optimal range', time: '14:32', priority: 'high' },
  { id: 2, type: 'warning', message: 'Zone B: Humidity levels trending low', time: '13:45', priority: 'medium' },
  { id: 3, type: 'info', message: 'Zone A: Optimal conditions maintained', time: '12:00', priority: 'low' },
];

const weatherForecast = [
  { day: 'Today', temp: '22°C', humidity: '65%', condition: 'Partly Cloudy', rain: '10%' },
  { day: 'Tomorrow', temp: '24°C', humidity: '58%', condition: 'Sunny', rain: '5%' },
  { day: 'Day 3', temp: '21°C', humidity: '72%', condition: 'Cloudy', rain: '30%' },
  { day: 'Day 4', temp: '23°C', humidity: '60%', condition: 'Sunny', rain: '0%' },
  { day: 'Day 5', temp: '25°C', humidity: '55%', condition: 'Sunny', rain: '0%' },
];

// SVG Chart Component for Environmental Data
interface EnvironmentalChartProps {
  data: any[];
  dataKey: string;
  color: string;
  title: string;
  unit: string;
  width?: number;
  height?: number;
}

interface ChartPoint {
  x: number;
  y: number;
  data: any;
  index: number;
}

const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ data, dataKey, color, title, unit, width = 300, height = 180 }) => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<ChartPoint | null>(null);
  
  const maxValue = Math.max(...data.map((d: any) => d[dataKey]));
  const minValue = Math.min(...data.map((d: any) => d[dataKey]));
  const range = maxValue - minValue || 1; // Avoid division by zero
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points: ChartPoint[] = data.map((item: any, index: number) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((item[dataKey] - minValue) / range) * chartHeight;
    return { x, y, data: item, index };
  });

  const pathPoints = points.map((p: ChartPoint) => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ backgroundColor: 'var(--color-background-card)', padding: '16px', borderRadius: '8px', marginBottom: '16px', position: 'relative', border: '1px solid var(--color-border)' }}>
      <h4 style={{ margin: '0 0 12px 0', color: 'var(--color-text-primary)', fontSize: '14px', fontWeight: '600' }}>{title}</h4>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginRight: '8px' }}>
          {(selectedPoint ? selectedPoint.data[dataKey] : data[data.length - 1][dataKey])}{unit}
        </span>
        <span style={{ fontSize: '12px', color: color }}>
          {selectedPoint ? `at ${selectedPoint.data.time}` : 'Current'}
        </span>
      </div>
      
      {/* Tooltip */}
      {hoveredPoint && (
        <div style={{
          position: 'absolute',
          left: `${hoveredPoint.x - 50}px`,
          top: `${hoveredPoint.y + 60}px`,
          backgroundColor: 'var(--color-background-nested)',
          border: `1px solid ${color}`,
          borderRadius: '4px',
          padding: '8px',
          fontSize: '12px',
          color: 'var(--color-text-primary)',
          pointerEvents: 'none',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <div style={{ color: color, fontWeight: 'bold' }}>{hoveredPoint.data[dataKey]}{unit}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>{hoveredPoint.data.time}</div>
        </div>
      )}
      
      <svg 
        width={width} 
        height={height} 
        style={{ overflow: 'visible', cursor: 'crosshair' }}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + chartHeight * ratio}
            x2={padding + chartWidth}
            y2={padding + chartHeight * ratio}
            stroke="var(--color-border)"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
        
        {/* Vertical grid lines */}
        {points.map((point, index) => (
          <line
            key={`vgrid-${index}`}
            x1={point.x}
            y1={padding}
            x2={point.x}
            y2={padding + chartHeight}
            stroke="var(--color-border)"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}
        
        {/* Chart area fill */}
        <path
          d={`M ${padding},${padding + chartHeight} L ${pathPoints} L ${padding + chartWidth},${padding + chartHeight} Z`}
          fill={color}
          opacity="0.1"
        />
        
        {/* Chart line */}
        <polyline
          points={pathPoints}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Interactive data points */}
        {points.map((point: ChartPoint, index: number) => (
          <g key={index}>
            {/* Hover area */}
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredPoint(point)}
              onClick={() => setSelectedPoint(selectedPoint?.index === index ? null : point)}
            />
            
            {/* Visible data point */}
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPoint?.index === index || selectedPoint?.index === index ? "5" : "3"}
              fill={hoveredPoint?.index === index || selectedPoint?.index === index ? '#ffffff' : color}
              stroke={color}
              strokeWidth={hoveredPoint?.index === index || selectedPoint?.index === index ? "2" : "0"}
              style={{ 
                transition: 'all 0.2s ease',
                filter: hoveredPoint?.index === index || selectedPoint?.index === index ? 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' : 'none'
              }}
            />
            
            {/* Selected point indicator */}
            {selectedPoint?.index === index && (
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity="0.5"
              />
            )}
          </g>
        ))}
        
        {/* Time labels */}
        {points.map((point: ChartPoint, index: number) => (
          <text
            key={index}
            x={point.x}
            y={height - 10}
            textAnchor="middle"
            fill={hoveredPoint?.index === index || selectedPoint?.index === index ? '#ffffff' : '#888888'}
            fontSize="10"
            style={{ transition: 'fill 0.2s ease' }}
          >
            {point.data.time}
          </text>
        ))}
        
        {/* Value labels on hover/select */}
        {(hoveredPoint || selectedPoint) && (
          <text
            x={(hoveredPoint || selectedPoint)!.x}
            y={(hoveredPoint || selectedPoint)!.y - 10}
            textAnchor="middle"
            fill={color}
            fontSize="12"
            fontWeight="bold"
          >
            {(hoveredPoint || selectedPoint)!.data[dataKey]}{unit}
          </text>
        )}
      </svg>
      
      {/* Chart controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '8px',
        fontSize: '10px',
        color: 'var(--color-text-secondary)'
      }}>
        <span>Min: {minValue}{unit}</span>
        <span>Max: {maxValue}{unit}</span>
        <span>Avg: {(data.reduce((sum: number, item: any) => sum + item[dataKey], 0) / data.length).toFixed(1)}{unit}</span>
      </div>
    </div>
  );
};

const plantHealthData = [
  { id: 'A1', name: 'Tomato #1', variety: 'Cherry Tomato', health: 95, stage: 'Flowering', ph: 6.8, moisture: 72, nutrients: 'Optimal', status: 'healthy', location: 'Zone A-1', plantedDate: '2024-11-15', daysToHarvest: 28, height: 185, leafCount: 47, diseases: [], lastWatered: '2 hours ago', temperature: 24.2, lightExposure: 850, aiScore: 94 },
  { id: 'A2', name: 'Lettuce #1', variety: 'Romaine', health: 88, stage: 'Vegetative', ph: 6.2, moisture: 68, nutrients: 'Good', status: 'healthy', location: 'Zone A-2', plantedDate: '2024-12-01', daysToHarvest: 15, height: 28, leafCount: 24, diseases: [], lastWatered: '4 hours ago', temperature: 22.8, lightExposure: 720, aiScore: 87 },
  { id: 'B1', name: 'Pepper #1', variety: 'Bell Pepper', health: 76, stage: 'Fruiting', ph: 5.8, moisture: 45, nutrients: 'Low N', status: 'warning', location: 'Zone B-1', plantedDate: '2024-10-20', daysToHarvest: 12, height: 156, leafCount: 39, diseases: ['Aphids (Minor)'], lastWatered: '6 hours ago', temperature: 26.1, lightExposure: 680, aiScore: 78 },
  { id: 'B2', name: 'Basil #1', variety: 'Sweet Basil', health: 92, stage: 'Harvest Ready', ph: 6.5, moisture: 78, nutrients: 'Optimal', status: 'healthy', location: 'Zone B-2', plantedDate: '2024-11-01', daysToHarvest: 3, height: 45, leafCount: 52, diseases: [], lastWatered: '1 hour ago', temperature: 23.5, lightExposure: 790, aiScore: 91 },
  { id: 'C1', name: 'Cucumber #1', variety: 'English Cucumber', health: 85, stage: 'Flowering', ph: 6.4, moisture: 71, nutrients: 'Good', status: 'healthy', location: 'Zone C-1', plantedDate: '2024-11-20', daysToHarvest: 25, height: 142, leafCount: 33, diseases: [], lastWatered: '3 hours ago', temperature: 25.0, lightExposure: 825, aiScore: 86 },
  { id: 'C2', name: 'Spinach #1', variety: 'Baby Spinach', health: 91, stage: 'Vegetative', ph: 6.7, moisture: 65, nutrients: 'Optimal', status: 'healthy', location: 'Zone C-2', plantedDate: '2024-12-05', daysToHarvest: 18, height: 15, leafCount: 18, diseases: [], lastWatered: '2 hours ago', temperature: 21.8, lightExposure: 600, aiScore: 89 },
  { id: 'D1', name: 'Kale #1', variety: 'Curly Kale', health: 79, stage: 'Vegetative', ph: 6.0, moisture: 58, nutrients: 'Low K', status: 'warning', location: 'Zone D-1', plantedDate: '2024-11-25', daysToHarvest: 22, height: 32, leafCount: 21, diseases: ['Leaf Spot (Mild)'], lastWatered: '5 hours ago', temperature: 20.5, lightExposure: 650, aiScore: 81 },
  { id: 'D2', name: 'Arugula #1', variety: 'Wild Arugula', health: 94, stage: 'Harvest Ready', ph: 6.3, moisture: 73, nutrients: 'Optimal', status: 'healthy', location: 'Zone D-2', plantedDate: '2024-11-10', daysToHarvest: 2, height: 22, leafCount: 28, diseases: [], lastWatered: '1 hour ago', temperature: 22.2, lightExposure: 710, aiScore: 93 },
  { id: 'E1', name: 'Radish #1', variety: 'Cherry Belle', health: 82, stage: 'Root Development', ph: 6.1, moisture: 62, nutrients: 'Good', status: 'healthy', location: 'Zone E-1', plantedDate: '2024-12-03', daysToHarvest: 14, height: 18, leafCount: 12, diseases: [], lastWatered: '4 hours ago', temperature: 19.8, lightExposure: 580, aiScore: 84 },
  { id: 'E2', name: 'Cilantro #1', variety: 'Slow Bolt', health: 67, stage: 'Vegetative', ph: 5.9, moisture: 41, nutrients: 'Low N+P', status: 'critical', location: 'Zone E-2', plantedDate: '2024-11-28', daysToHarvest: 20, height: 12, leafCount: 15, diseases: ['Nutrient Deficiency'], lastWatered: '8 hours ago', temperature: 24.8, lightExposure: 520, aiScore: 69 },
  { id: 'F1', name: 'Mint #1', variety: 'Peppermint', health: 96, stage: 'Harvest Ready', ph: 6.6, moisture: 81, nutrients: 'Optimal', status: 'healthy', location: 'Zone F-1', plantedDate: '2024-10-15', daysToHarvest: 1, height: 38, leafCount: 64, diseases: [], lastWatered: '30 mins ago', temperature: 23.1, lightExposure: 740, aiScore: 95 },
  { id: 'F2', name: 'Parsley #1', variety: 'Flat Leaf', health: 89, stage: 'Vegetative', ph: 6.4, moisture: 69, nutrients: 'Good', status: 'healthy', location: 'Zone F-2', plantedDate: '2024-11-22', daysToHarvest: 16, height: 26, leafCount: 31, diseases: [], lastWatered: '2 hours ago', temperature: 22.7, lightExposure: 690, aiScore: 88 }
];

// Plant Health Analytics Data
const plantHealthSummary = {
  total: 12,
  healthy: 8,
  warning: 3,
  critical: 1,
  avgHealth: 85.7,
  avgGrowthRate: 12.3,
  diseaseDetected: 3,
  readyToHarvest: 4
};

const diseaseAlerts = [
  { id: 1, plant: 'Pepper #1', disease: 'Aphids', severity: 'Minor', action: 'Apply neem oil spray', priority: 'medium', detected: '2 hours ago' },
  { id: 2, plant: 'Kale #1', disease: 'Leaf Spot', severity: 'Mild', action: 'Improve air circulation', priority: 'low', detected: '1 day ago' },
  { id: 3, plant: 'Cilantro #1', disease: 'Nutrient Deficiency', severity: 'Moderate', action: 'Apply balanced fertilizer', priority: 'high', detected: '6 hours ago' }
];

const growthStages = [
  { stage: 'Seedling', count: 0, color: '#8b5cf6' },
  { stage: 'Vegetative', count: 5, color: '#10b981' },
  { stage: 'Flowering', count: 2, color: '#f59e0b' },
  { stage: 'Fruiting', count: 1, color: '#ef4444' },
  { stage: 'Harvest Ready', count: 3, color: '#06b6d4' },
  { stage: 'Root Development', count: 1, color: '#84cc16' }
];

// Comprehensive Irrigation & Nutrient Management Data
const irrigationSummary = {
  totalWaterUsage: 2847,
  dailyTarget: 2635,
  efficiency: 92.5,
  activeZones: 6,
  scheduledIrrigations: 12,
  nutrientTankLevel: 78,
  avgMoisture: 68.3,
  waterSaved: 15.2
};

const irrigationZones = [
  { id: 'A', name: 'Tomato Section', status: 'active', moisture: 72, ph: 6.2, ec: 1.8, waterUsed: 485, target: 450, pressure: 2.1, lastIrrigation: '2 hours ago', nextScheduled: '14:30', plantCount: 24, soilTemp: 24.2 },
  { id: 'B', name: 'Leafy Greens', status: 'scheduled', moisture: 68, ph: 6.5, ec: 1.6, waterUsed: 372, target: 380, pressure: 2.0, lastIrrigation: '4 hours ago', nextScheduled: '15:00', plantCount: 18, soilTemp: 22.8 },
  { id: 'C', name: 'Herbs Garden', status: 'active', moisture: 75, ph: 6.8, ec: 1.4, waterUsed: 298, target: 320, pressure: 1.9, lastIrrigation: '1 hour ago', nextScheduled: '16:15', plantCount: 15, soilTemp: 23.5 },
  { id: 'D', name: 'Root Vegetables', status: 'optimal', moisture: 65, ph: 6.0, ec: 2.0, waterUsed: 521, target: 500, pressure: 2.2, lastIrrigation: '3 hours ago', nextScheduled: '17:00', plantCount: 22, soilTemp: 21.8 },
  { id: 'E', name: 'Pepper Corner', status: 'warning', moisture: 45, ph: 5.8, ec: 1.9, waterUsed: 428, target: 465, pressure: 1.8, lastIrrigation: '6 hours ago', nextScheduled: 'Now', plantCount: 12, soilTemp: 26.1 },
  { id: 'F', name: 'Cucumber Vines', status: 'active', moisture: 71, ph: 6.4, ec: 1.7, waterUsed: 743, target: 720, pressure: 2.0, lastIrrigation: '2.5 hours ago', nextScheduled: '18:45', plantCount: 8, soilTemp: 25.0 }
];

const nutrientMixtures = [
  { id: 1, name: 'Vegetative Growth', ratio: 'N-P-K 20-10-20', concentration: 1.2, tankLevel: 85, usage: '12L/day', target: 'Leafy Greens, Herbs', color: '#10b981' },
  { id: 2, name: 'Flowering Boost', ratio: 'N-P-K 10-30-20', concentration: 1.5, tankLevel: 72, usage: '8L/day', target: 'Tomatoes, Peppers', color: '#f59e0b' },
  { id: 3, name: 'Root Development', ratio: 'N-P-K 15-15-30', concentration: 1.0, tankLevel: 91, usage: '6L/day', target: 'Root Vegetables', color: '#8b5cf6' },
  { id: 4, name: 'Fruiting Formula', ratio: 'N-P-K 5-20-30', concentration: 1.8, tankLevel: 68, usage: '10L/day', target: 'Cucumbers, Tomatoes', color: '#ef4444' }
];

const irrigationSchedule = [
  { time: '06:00', zones: ['A', 'C'], duration: 15, type: 'Morning', status: 'completed', waterUsed: 45 },
  { time: '10:30', zones: ['B', 'F'], duration: 12, type: 'Mid-Morning', status: 'completed', waterUsed: 38 },
  { time: '14:30', zones: ['A', 'D'], duration: 18, type: 'Afternoon', status: 'scheduled', waterUsed: 0 },
  { time: '15:00', zones: ['B'], duration: 10, type: 'Afternoon', status: 'scheduled', waterUsed: 0 },
  { time: '16:15', zones: ['C', 'E'], duration: 20, type: 'Late Afternoon', status: 'scheduled', waterUsed: 0 },
  { time: '18:45', zones: ['F'], duration: 14, type: 'Evening', status: 'scheduled', waterUsed: 0 }
];

const waterQualityMetrics = [
  { parameter: 'pH Level', value: 6.3, optimal: '6.0-7.0', status: 'optimal', unit: '', color: '#00FF00' },
  { parameter: 'EC (Conductivity)', value: 1.7, optimal: '1.2-2.0', status: 'optimal', unit: 'mS/cm', color: '#00FF00' },
  { parameter: 'TDS', value: 850, optimal: '600-1000', status: 'optimal', unit: 'ppm', color: '#00FF00' },
  { parameter: 'Temperature', value: 22.5, optimal: '18-25', status: 'optimal', unit: '°C', color: '#00FF00' },
  { parameter: 'Dissolved Oxygen', value: 7.2, optimal: '6.0-8.0', status: 'optimal', unit: 'mg/L', color: '#00FF00' },
  { parameter: 'Chlorine', value: 0.1, optimal: '<0.5', status: 'optimal', unit: 'ppm', color: '#00FF00' }
];

const harvestPredictions = [
  { crop: 'Tomatoes', yield: '2.3 kg', date: '2024-01-15', confidence: 94 },
  { crop: 'Lettuce', yield: '1.8 kg', date: '2024-01-08', confidence: 88 },
  { crop: 'Peppers', yield: '1.1 kg', date: '2024-01-22', confidence: 76 },
];

// Comprehensive Harvest Prediction & Analytics Data
const harvestSummary = {
  totalPredictedYield: 18.7,
  weeklyTarget: 16.2,
  efficiency: 115.4,
  readyToHarvest: 8,
  plantsInProgress: 28,
  avgGrowthRate: 97.3,
  marketValue: 142.50,
  qualityScore: 92.1
};

const detailedHarvestPredictions = [
  { 
    id: 'T001', 
    crop: 'Cherry Tomatoes', 
    variety: 'Sweet 100', 
    zone: 'A1', 
    plantedDate: '2024-11-15', 
    predictedHarvestDate: '2024-01-15', 
    daysRemaining: 12, 
    currentStage: 'Fruiting', 
    stageProgress: 85,
    predictedYield: 2.3, 
    unit: 'kg', 
    confidence: 94, 
    quality: 'Premium', 
    marketPrice: 8.50, 
    estimatedValue: 19.55,
    aiFactors: ['Optimal temperature', 'Good light exposure', 'Balanced nutrients'],
    riskFactors: [],
    healthScore: 96,
    size: 'Medium',
    color: '#ef4444'
  },
  { 
    id: 'L001', 
    crop: 'Romaine Lettuce', 
    variety: 'Parris Island', 
    zone: 'B2', 
    plantedDate: '2024-12-01', 
    predictedHarvestDate: '2024-01-08', 
    daysRemaining: 5, 
    currentStage: 'Harvest Ready', 
    stageProgress: 98,
    predictedYield: 1.8, 
    unit: 'kg', 
    confidence: 88, 
    quality: 'High', 
    marketPrice: 4.20, 
    estimatedValue: 7.56,
    aiFactors: ['Consistent moisture', 'Cool temperature'],
    riskFactors: ['Monitor for bolting'],
    healthScore: 91,
    size: 'Large',
    color: '#10b981'
  },
  { 
    id: 'P001', 
    crop: 'Bell Peppers', 
    variety: 'California Wonder', 
    zone: 'E1', 
    plantedDate: '2024-10-20', 
    predictedHarvestDate: '2024-01-22', 
    daysRemaining: 19, 
    currentStage: 'Flowering', 
    stageProgress: 75,
    predictedYield: 1.1, 
    unit: 'kg', 
    confidence: 76, 
    quality: 'Standard', 
    marketPrice: 6.80, 
    estimatedValue: 7.48,
    aiFactors: ['Good pollination'],
    riskFactors: ['Low moisture detected', 'Aphid presence'],
    healthScore: 78,
    size: 'Medium',
    color: '#f59e0b'
  },
  { 
    id: 'B001', 
    crop: 'Sweet Basil', 
    variety: 'Genovese', 
    zone: 'C2', 
    plantedDate: '2024-11-01', 
    predictedHarvestDate: '2024-01-05', 
    daysRemaining: 2, 
    currentStage: 'Harvest Ready', 
    stageProgress: 100,
    predictedYield: 0.45, 
    unit: 'kg', 
    confidence: 96, 
    quality: 'Premium', 
    marketPrice: 12.00, 
    estimatedValue: 5.40,
    aiFactors: ['Perfect aroma development', 'Optimal leaf size'],
    riskFactors: [],
    healthScore: 98,
    size: 'Large',
    color: '#84cc16'
  },
  { 
    id: 'C001', 
    crop: 'English Cucumber', 
    variety: 'Telegraph', 
    zone: 'F1', 
    plantedDate: '2024-11-20', 
    predictedHarvestDate: '2024-01-25', 
    daysRemaining: 22, 
    currentStage: 'Flowering', 
    stageProgress: 68,
    predictedYield: 3.2, 
    unit: 'kg', 
    confidence: 82, 
    quality: 'High', 
    marketPrice: 3.50, 
    estimatedValue: 11.20,
    aiFactors: ['Strong vine growth', 'Good fruit set'],
    riskFactors: ['Monitor humidity levels'],
    healthScore: 87,
    size: 'Large',
    color: '#06b6d4'
  },
  { 
    id: 'S001', 
    crop: 'Baby Spinach', 
    variety: 'Space', 
    zone: 'B1', 
    plantedDate: '2024-12-05', 
    predictedHarvestDate: '2024-01-12', 
    daysRemaining: 9, 
    currentStage: 'Vegetative', 
    stageProgress: 80,
    predictedYield: 1.5, 
    unit: 'kg', 
    confidence: 90, 
    quality: 'Premium', 
    marketPrice: 7.20, 
    estimatedValue: 10.80,
    aiFactors: ['Rapid growth rate', 'Tender leaves'],
    riskFactors: [],
    healthScore: 93,
    size: 'Small',
    color: '#8b5cf6'
  },
  { 
    id: 'K001', 
    crop: 'Curly Kale', 
    variety: 'Winterbor', 
    zone: 'D1', 
    plantedDate: '2024-11-25', 
    predictedHarvestDate: '2024-01-18', 
    daysRemaining: 15, 
    currentStage: 'Vegetative', 
    stageProgress: 70,
    predictedYield: 2.1, 
    unit: 'kg', 
    confidence: 85, 
    quality: 'High', 
    marketPrice: 5.50, 
    estimatedValue: 11.55,
    aiFactors: ['Cold tolerance', 'Nutritious leaves'],
    riskFactors: ['Leaf spot detected'],
    healthScore: 81,
    size: 'Medium',
    color: '#84cc16'
  },
  { 
    id: 'A001', 
    crop: 'Wild Arugula', 
    variety: 'Sylvetta', 
    zone: 'D2', 
    plantedDate: '2024-11-10', 
    predictedHarvestDate: '2024-01-03', 
    daysRemaining: 0, 
    currentStage: 'Harvest Ready', 
    stageProgress: 100,
    predictedYield: 0.8, 
    unit: 'kg', 
    confidence: 97, 
    quality: 'Premium', 
    marketPrice: 9.50, 
    estimatedValue: 7.60,
    aiFactors: ['Intense flavor', 'Perfect texture'],
    riskFactors: [],
    healthScore: 95,
    size: 'Small',
    color: '#10b981'
  }
];

const harvestCalendar = [
  { date: '2024-01-03', crops: ['Wild Arugula'], totalYield: 0.8, value: 7.60, priority: 'high' },
  { date: '2024-01-05', crops: ['Sweet Basil'], totalYield: 0.45, value: 5.40, priority: 'high' },
  { date: '2024-01-08', crops: ['Romaine Lettuce'], totalYield: 1.8, value: 7.56, priority: 'medium' },
  { date: '2024-01-12', crops: ['Baby Spinach'], totalYield: 1.5, value: 10.80, priority: 'medium' },
  { date: '2024-01-15', crops: ['Cherry Tomatoes'], totalYield: 2.3, value: 19.55, priority: 'high' },
  { date: '2024-01-18', crops: ['Curly Kale'], totalYield: 2.1, value: 11.55, priority: 'low' },
  { date: '2024-01-22', crops: ['Bell Peppers'], totalYield: 1.1, value: 7.48, priority: 'medium' },
  { date: '2024-01-25', crops: ['English Cucumber'], totalYield: 3.2, value: 11.20, priority: 'low' }
];

const yieldAnalytics = {
  currentWeek: { predicted: 4.05, actual: 3.8, efficiency: 93.8 },
  lastWeek: { predicted: 3.2, actual: 3.45, efficiency: 107.8 },
  monthToDate: { predicted: 14.2, actual: 13.1, efficiency: 92.3 },
  bestPerforming: 'Sweet Basil',
  improvementNeeded: 'Bell Peppers',
  avgAccuracy: 91.2,
  totalRevenue: 142.50
};


// Comprehensive AI Insights & Analytics Data
const aiAnalyticsSummary = {
  totalInsights: 24,
  criticalAlerts: 3,
  optimizationOpportunities: 8,
  predictiveAccuracy: 94.2,
  systemHealth: 87.5,
  energyOptimization: 23.8,
  yieldImprovement: 15.2,
  costSavings: 1847.50
};

const comprehensiveAiInsights = [
  {
    id: 1,
    category: 'Growth Optimization',
    title: 'Increase Light Exposure for Zone A Tomatoes',
    description: 'ML analysis shows 18% yield improvement potential with extended light cycles during flowering phase.',
    impact: 'high',
    confidence: 96,
    priority: 'immediate',
    aiModel: 'Deep Learning Growth Predictor v2.1',
    dataPoints: 847,
    expectedGains: '+18% yield, +$24.50 revenue',
    implementation: 'Extend LED cycles by 2 hours daily',
    timeframe: '3-5 days implementation',
    tags: ['yield', 'lighting', 'revenue'],
    riskLevel: 'low',
    lastUpdated: '2 hours ago',
    visualization: 'trend-up'
  },
  {
    id: 2,
    category: 'Water Management',
    title: 'Smart Irrigation Schedule Adjustment',
    description: 'Predictive algorithms suggest reducing Zone C irrigation by 12% while maintaining optimal moisture.',
    impact: 'medium',
    confidence: 89,
    priority: 'today',
    aiModel: 'Hydro-Intelligence System v3.2',
    dataPoints: 1205,
    expectedGains: '-12% water usage, $15.30 savings',
    implementation: 'Adjust irrigation timer intervals',
    timeframe: '1 day implementation',
    tags: ['water', 'efficiency', 'cost'],
    riskLevel: 'low',
    lastUpdated: '4 hours ago',
    visualization: 'droplet'
  },
  {
    id: 3,
    category: 'Disease Prevention',
    title: 'Early Aphid Detection Alert',
    description: 'Computer vision detected early-stage aphid presence on Bell Peppers with 94% confidence.',
    impact: 'critical',
    confidence: 94,
    priority: 'urgent',
    aiModel: 'PlantVision Disease Detector v1.8',
    dataPoints: 324,
    expectedGains: 'Prevent $45 crop loss, maintain quality',
    implementation: 'Apply neem oil treatment immediately',
    timeframe: 'Within 6 hours',
    tags: ['disease', 'prevention', 'quality'],
    riskLevel: 'medium',
    lastUpdated: '1 hour ago',
    visualization: 'alert'
  },
  {
    id: 4,
    category: 'Nutrient Optimization',
    title: 'Precision Fertilizer Recommendation',
    description: 'AI analysis recommends custom N-P-K blend (15-20-25) for enhanced flowering in Zone D.',
    impact: 'high',
    confidence: 91,
    priority: 'this week',
    aiModel: 'NutriSense Optimization Engine v2.0',
    dataPoints: 672,
    expectedGains: '+22% flowering, +$18.75 value',
    implementation: 'Prepare custom nutrient blend',
    timeframe: '2-3 days preparation',
    tags: ['nutrients', 'flowering', 'optimization'],
    riskLevel: 'low',
    lastUpdated: '6 hours ago',
    visualization: 'chemistry'
  },
  {
    id: 5,
    category: 'Climate Control',
    title: 'Temperature Variance Optimization',
    description: 'Thermal analysis suggests 2°C temperature reduction during night cycles for better root development.',
    impact: 'medium',
    confidence: 87,
    priority: 'this week',
    aiModel: 'Climate Intelligence Pro v4.1',
    dataPoints: 956,
    expectedGains: '+15% root mass, better stability',
    implementation: 'Adjust HVAC night settings',
    timeframe: '1 day configuration',
    tags: ['temperature', 'growth', 'efficiency'],
    riskLevel: 'low',
    lastUpdated: '3 hours ago',
    visualization: 'thermometer'
  },
  {
    id: 6,
    category: 'Energy Efficiency',
    title: 'Peak Hour Energy Optimization',
    description: 'Load balancing AI identified 28% energy savings opportunity by shifting irrigation to off-peak hours.',
    impact: 'medium',
    confidence: 93,
    priority: 'this month',
    aiModel: 'PowerSense Energy Optimizer v1.5',
    dataPoints: 1834,
    expectedGains: '-28% energy cost, $67.40 monthly savings',
    implementation: 'Reschedule power-intensive operations',
    timeframe: '1 week optimization',
    tags: ['energy', 'cost', 'scheduling'],
    riskLevel: 'very low',
    lastUpdated: '8 hours ago',
    visualization: 'battery'
  },
  {
    id: 7,
    category: 'Harvest Timing',
    title: 'Optimal Harvest Window Prediction',
    description: 'Ripeness detection algorithm pinpoints exact harvest timing for maximum sweetness in cherry tomatoes.',
    impact: 'high',
    confidence: 97,
    priority: 'next 3 days',
    aiModel: 'RipeTime Predictor v2.3',
    dataPoints: 445,
    expectedGains: '+25% sweetness, premium pricing',
    implementation: 'Monitor daily ripeness scores',
    timeframe: 'Continuous monitoring',
    tags: ['harvest', 'quality', 'timing'],
    riskLevel: 'very low',
    lastUpdated: '30 minutes ago',
    visualization: 'calendar'
  },
  {
    id: 8,
    category: 'Air Quality',
    title: 'CO₂ Enhancement Opportunity',
    description: 'Atmospheric analysis suggests 15% CO₂ increase during peak photosynthesis hours for accelerated growth.',
    impact: 'medium',
    confidence: 85,
    priority: 'next week',
    aiModel: 'AtmoSense Gas Analyzer v3.0',
    dataPoints: 728,
    expectedGains: '+12% photosynthesis rate, faster growth',
    implementation: 'Install CO₂ supplementation system',
    timeframe: '5-7 days setup',
    tags: ['co2', 'growth', 'photosynthesis'],
    riskLevel: 'low',
    lastUpdated: '5 hours ago',
    visualization: 'air'
  }
];



const systemRecommendations = {
  immediate: [
    { action: 'Apply aphid treatment to Zone E peppers', impact: 'Prevent $45 crop loss', urgency: 'critical' },
    { action: 'Extend lighting for Zone A tomatoes', impact: '+18% yield increase', urgency: 'high' },
    { action: 'Adjust Zone C irrigation schedule', impact: '12% water savings', urgency: 'medium' }
  ],
  thisWeek: [
    { action: 'Prepare custom N-P-K fertilizer blend', impact: '+22% flowering boost', urgency: 'high' },
    { action: 'Configure night temperature settings', impact: '+15% root development', urgency: 'medium' },
    { action: 'Plan CO₂ supplementation installation', impact: '+12% growth acceleration', urgency: 'medium' }
  ],
  longTerm: [
    { action: 'Implement energy load balancing', impact: '$67.40 monthly savings', urgency: 'low' },
    { action: 'Optimize harvest timing protocols', impact: 'Premium quality pricing', urgency: 'low' }
  ]
};

const predictiveAnalytics = {
  nextWeekYield: { predicted: 15.7, confidence: 94.2, trend: 'increasing' },
  resourceEfficiency: { water: 92.3, energy: 87.8, nutrients: 95.1 },
  qualityProjection: { overall: 91.5, premium: 68.2, commercial: 31.8 },
  riskAssessment: { disease: 'low', weather: 'optimal', market: 'favorable' },
  profitabilityForecast: { revenue: 187.50, costs: 42.30, margin: 77.4 }
};

function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const { theme, toggleTheme } = useTheme();

  // Theme-aware style generator
  const getThemeStyles = () => {
    return {
      backgroundMain: theme === 'dark' ? '#e5e5e5' : '#F8F8F8',
      backgroundContainer: theme === 'dark' ? '#1a1a1a' : '#FFFFFF',
      backgroundCard: theme === 'dark' ? '#2a2a2a' : '#FFFFFF',
      backgroundNested: theme === 'dark' ? '#333333' : '#F8F8F8',
      textPrimary: theme === 'dark' ? '#ffffff' : '#252617',
      textSecondary: theme === 'dark' ? '#888888' : '#808080',
      border: theme === 'dark' ? '#444444' : '#E5E5E5',
      success: theme === 'dark' ? '#00FF00' : '#00AA00',
      warning: theme === 'dark' ? '#FF6B6B' : '#FF0000',
      buttonActive: '#00AA00',
      buttonInactive: theme === 'dark' ? 'transparent' : '#F0F0F0'
    };
  };

  const styles = getThemeStyles();

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'environmental', label: 'Environment', icon: 'environment' },
    { id: 'plants', label: 'Plant Health', icon: 'plant' },
    { id: 'irrigation', label: 'Irrigation', icon: 'water' },
    { id: 'harvest', label: 'Harvest Predict', icon: 'chart' },
    { id: 'ai-insights', label: 'AI Insights', icon: 'ai' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'environmental':
        return (
          <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '24px', marginTop: 0 }}>Environmental Monitoring</h2>
            
            {/* Current Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>◐</div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px 0', color: 'var(--color-text-primary)' }}>24.2°C</p>
                <p style={{ fontSize: '10px', color: '#00FF00', margin: 0 }}>Temperature</p>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>◎</div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px 0', color: 'var(--color-text-primary)' }}>62%</p>
                <p style={{ fontSize: '10px', color: '#00FF00', margin: 0 }}>Humidity</p>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>◈</div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px 0', color: 'var(--color-text-primary)' }}>375ppm</p>
                <p style={{ fontSize: '10px', color: '#00FF00', margin: 0 }}>CO₂ Level</p>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>◇</div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px 0', color: 'var(--color-text-primary)' }}>1.9m/s</p>
                <p style={{ fontSize: '10px', color: '#00FF00', margin: 0 }}>Wind Speed</p>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>◐</div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px 0', color: 'var(--color-text-primary)' }}>0 lux</p>
                <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)', margin: 0 }}>Light Intensity</p>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>◉</div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px 0', color: 'var(--color-text-primary)' }}>1013hPa</p>
                <p style={{ fontSize: '10px', color: '#00FF00', margin: 0 }}>Pressure</p>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>◐</div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px 0', color: 'var(--color-text-primary)' }}>22.0°C</p>
                <p style={{ fontSize: '10px', color: '#00FF00', margin: 0 }}>Soil Temp</p>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>◎</div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px 0', color: 'var(--color-text-primary)' }}>46%</p>
                <p style={{ fontSize: '10px', color: '#00FF00', margin: 0 }}>Soil Moisture</p>
              </div>
            </div>

            {/* Environmental Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <EnvironmentalChart 
                data={environmentalData} 
                dataKey="temp" 
                color="#ef4444" 
                title="Temperature Trend" 
                unit="°C"
              />
              <EnvironmentalChart 
                data={environmentalData} 
                dataKey="humidity" 
                color="#3b82f6" 
                title="Humidity Trend" 
                unit="%"
              />
              <EnvironmentalChart 
                data={environmentalData} 
                dataKey="co2" 
                color="#10b981" 
                title="CO₂ Level Trend" 
                unit="ppm"
              />
              <EnvironmentalChart 
                data={environmentalData} 
                dataKey="wind" 
                color="#8b5cf6" 
                title="Wind Speed Trend" 
                unit="m/s"
              />
              <EnvironmentalChart 
                data={environmentalData} 
                dataKey="light" 
                color="#f59e0b" 
                title="Light Intensity Trend" 
                unit=" lux"
              />
              <EnvironmentalChart 
                data={environmentalData} 
                dataKey="pressure" 
                color="#06b6d4" 
                title="Atmospheric Pressure" 
                unit="hPa"
              />
              <EnvironmentalChart 
                data={environmentalData} 
                dataKey="soilTemp" 
                color="#f97316" 
                title="Soil Temperature" 
                unit="°C"
              />
              <EnvironmentalChart 
                data={environmentalData} 
                dataKey="soilMoisture" 
                color="#84cc16" 
                title="Soil Moisture" 
                unit="%"
              />
            </div>

            {/* Zone Status and Alerts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {/* Zone Status */}
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Zone Status Overview</h3>
                {environmentalZones.map((zone) => (
                  <div key={zone.zone} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px',
                    marginBottom: '8px',
                    backgroundColor: 'var(--color-background-card)',
                    borderRadius: '6px',
                    border: `1px solid ${zone.status === 'optimal' ? 'var(--color-success)' : zone.status === 'good' ? '#3b82f6' : '#ef4444'}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: zone.status === 'optimal' ? '#00FF00' : zone.status === 'good' ? '#3b82f6' : '#ef4444',
                        marginRight: '12px'
                      }}></div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Zone {zone.zone}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{zone.plants} plants</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{zone.temp}°C | {zone.humidity}%</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{zone.co2}ppm CO₂</div>
                    </div>
                    {zone.alerts > 0 && (
                      <div style={{ 
                        backgroundColor: '#ef4444', 
                        color: 'var(--color-text-primary)', 
                        borderRadius: '12px', 
                        padding: '2px 8px', 
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {zone.alerts}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Environmental Alerts */}
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Environmental Alerts</h3>
                {environmentalAlerts.map((alert) => (
                  <div key={alert.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    marginBottom: '12px',
                    backgroundColor: 'var(--color-background-card)', border: `1px solid ${alert.type === 'critical' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#06b6d4'}`,
                    borderRadius: '6px',
                    borderLeft: `4px solid ${alert.type === 'critical' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#06b6d4'}`
                  }}>
                    <div style={{ fontSize: '16px', marginRight: '12px', color: 'var(--color-text-primary)' }}>
                      {alert.type === 'critical' ? '🔴' : alert.type === 'warning' ? '🟡' : '🔵'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                        {alert.message}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        {alert.time} • {alert.priority} priority
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Forecast */}
            <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>5-Day Weather Forecast</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                {weatherForecast.map((day, index) => (
                  <div key={index} style={{
                    backgroundColor: 'var(--color-background-card)',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: index === 0 ? '2px solid var(--color-success)' : '1px solid var(--color-border)'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                      {day.day}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                      {day.temp}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      {day.condition}
                    </div>
                    <div style={{ fontSize: '12px', color: '#3b82f6' }}>
                      💧 {day.rain} | 💨 {day.humidity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'plants':
        return (
          <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '24px', marginTop: 0 }}>Plant Health Monitoring</h2>
            
            {/* Health Summary Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>◉</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{plantHealthSummary.total}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Total Plants</div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#00FF00', marginBottom: '8px' }}>●</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00FF00', marginBottom: '4px' }}>{plantHealthSummary.healthy}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Healthy</div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#B8860B', marginBottom: '8px' }}>●</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#B8860B', marginBottom: '4px' }}>{plantHealthSummary.warning}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Warning</div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#FF6B6B', marginBottom: '8px' }}>●</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF6B6B', marginBottom: '4px' }}>{plantHealthSummary.critical}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Critical</div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>◈</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{plantHealthSummary.avgHealth}%</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Avg Health</div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>◎</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{plantHealthSummary.readyToHarvest}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Ready to Harvest</div>
              </div>
            </div>

            {/* Growth Stages Distribution */}
            <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Growth Stages Distribution</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                {growthStages.map((stage) => (
                  <div key={stage.stage} style={{ 
                    backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', 
                    padding: '12px', 
                    borderRadius: '6px',
                    borderLeft: `4px solid ${stage.color}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{stage.stage}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{stage.count} plants</div>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: stage.color }}>{stage.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disease Alerts */}
            <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Disease & Health Alerts</h3>
              {diseaseAlerts.map((alert) => (
                <div key={alert.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: 'var(--color-background-card)', border: `1px solid ${alert.priority === 'high' ? '#ef4444' : alert.priority === 'medium' ? '#f59e0b' : '#06b6d4'}`,
                  borderRadius: '6px',
                  borderLeft: `4px solid ${alert.priority === 'high' ? '#ef4444' : alert.priority === 'medium' ? '#f59e0b' : '#06b6d4'}`
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', marginRight: '8px' }}>{alert.plant}</span>
                      <span style={{ 
                        fontSize: '10px', 
                        padding: '2px 6px', 
                        backgroundColor: alert.priority === 'high' ? '#ef4444' : alert.priority === 'medium' ? '#f59e0b' : '#06b6d4',
                        color: 'var(--color-text-primary)',
                        borderRadius: '8px',
                        fontWeight: '500'
                      }}>
                        {alert.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{alert.disease}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Action: {alert.action}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{alert.detected}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Plant Grid */}
            <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Individual Plant Health</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {plantHealthData.map((plant) => (
                  <div key={plant.id} style={{ 
                    borderRadius: '8px', 
                    padding: '16px',
                    backgroundColor: 'var(--color-background-card)',
                    border: `2px solid ${plant.status === 'critical' ? '#ef4444' : plant.status === 'warning' ? '#f59e0b' : 'var(--color-success)'}`,
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}>
                    {/* Plant Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>{plant.name}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 2px 0' }}>{plant.variety} • {plant.location}</p>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>Planted: {plant.plantedDate}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '20px', 
                          fontWeight: 'bold', 
                          color: plant.health >= 90 ? '#00FF00' : plant.health >= 75 ? '#B8860B' : '#FF0000',
                          marginBottom: '2px'
                        }}>
                          {plant.health}%
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Health Score</div>
                      </div>
                    </div>

                    {/* Health Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Stage: </span>
                        <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{plant.stage}</span>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Height: </span>
                        <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{plant.height}cm</span>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>pH: </span>
                        <span style={{ color: plant.ph >= 6.0 && plant.ph <= 7.0 ? '#00FF00' : '#B8860B', fontWeight: '500' }}>{plant.ph}</span>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Moisture: </span>
                        <span style={{ color: plant.moisture >= 60 ? '#00FF00' : plant.moisture >= 40 ? '#B8860B' : '#FF6B6B', fontWeight: '500' }}>{plant.moisture}%</span>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Leaves: </span>
                        <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{plant.leafCount}</span>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Light: </span>
                        <span style={{ color: plant.lightExposure >= 700 ? '#00FF00' : '#B8860B', fontWeight: '500' }}>{plant.lightExposure} lux</span>
                      </div>
                    </div>

                    {/* Disease Status */}
                    {plant.diseases.length > 0 ? (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#ff6b6b', fontWeight: '500', marginBottom: '4px' }}>⚠ Active Issues:</div>
                        {plant.diseases.map((disease, index) => (
                          <div key={index} style={{ fontSize: '10px', color: '#ff6b6b', marginLeft: '12px' }}>• {disease}</div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '11px', color: '#00FF00', marginBottom: '12px' }}>✓ No diseases detected</div>
                    )}

                    {/* Harvest Information */}
                    <div style={{ 
                      backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', 
                      padding: '8px', 
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Days to Harvest</div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: plant.daysToHarvest <= 5 ? '#00FF00' : '#ffffff' }}>
                          {plant.daysToHarvest} days
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>AI Score</div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#06b6d4' }}>{plant.aiScore}</div>
                      </div>
                    </div>

                    {/* Last Watered */}
                    <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                      Last watered: {plant.lastWatered}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'irrigation':
        return (
          <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '24px', marginTop: 0 }}>Irrigation & Nutrient Management</h2>
            
            {/* Irrigation Summary Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#06b6d4', marginBottom: '8px' }}>◎</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{irrigationSummary.totalWaterUsage}L</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Total Water Used</div>
                <div style={{ fontSize: '10px', color: irrigationSummary.totalWaterUsage > irrigationSummary.dailyTarget ? '#FF6B6B' : '#00FF00', marginTop: '4px' }}>
                  Target: {irrigationSummary.dailyTarget}L
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#10b981', marginBottom: '8px' }}>◈</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{irrigationSummary.efficiency}%</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Water Efficiency</div>
                <div style={{ fontSize: '10px', color: '#00FF00', marginTop: '4px' }}>
                  ↑ {irrigationSummary.waterSaved}% improvement
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>◉</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{irrigationSummary.activeZones}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Active Zones</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  {irrigationSummary.scheduledIrrigations} scheduled
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#f59e0b', marginBottom: '8px' }}>◇</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{irrigationSummary.nutrientTankLevel}%</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Nutrient Level</div>
                <div style={{ fontSize: '10px', color: irrigationSummary.nutrientTankLevel < 30 ? '#FF6B6B' : '#00FF00', marginTop: '4px' }}>
                  {irrigationSummary.nutrientTankLevel < 30 ? 'Refill Soon' : 'Adequate'}
                </div>
              </div>
            </div>

            {/* Zone Status Grid */}
            <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Irrigation Zone Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
                {irrigationZones.map((zone) => (
                  <div key={zone.id} style={{
                    backgroundColor: 'var(--color-background-card)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${
                      zone.status === 'active' ? 'var(--color-success)' : 
                      zone.status === 'warning' ? '#FF6B6B' : 
                      zone.status === 'scheduled' ? '#f59e0b' : '#06b6d4'
                    }`
                  }}>
                    {/* Zone Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>Zone {zone.id} - {zone.name}</h4>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{zone.plantCount} plants • Last: {zone.lastIrrigation}</div>
                      </div>
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: 
                          zone.status === 'active' ? '#1f3d1f' : 
                          zone.status === 'warning' ? '#3d1f1f' : 
                          zone.status === 'scheduled' ? '#3d3a1f' : '#1f3d3d',
                        color: 
                          zone.status === 'active' ? '#00FF00' : 
                          zone.status === 'warning' ? '#FF6B6B' : 
                          zone.status === 'scheduled' ? '#f59e0b' : '#06b6d4'
                      }}>
                        {zone.status.toUpperCase()}
                      </div>
                    </div>

                    {/* Zone Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: zone.moisture >= 60 ? '#00FF00' : zone.moisture >= 40 ? '#B8860B' : '#FF6B6B' }}>
                          {zone.moisture}%
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Soil Moisture</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: zone.ph >= 6.0 && zone.ph <= 7.0 ? '#00FF00' : '#B8860B' }}>
                          {zone.ph}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>pH Level</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4' }}>
                          {zone.ec}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>EC (mS/cm)</div>
                      </div>
                    </div>

                    {/* Water Usage Progress */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Water Usage</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-primary)', fontWeight: '500' }}>{zone.waterUsed}L / {zone.target}L</span>
                      </div>
                      <div style={{ width: '100%', backgroundColor: 'var(--color-border)', borderRadius: '4px', height: '6px' }}>
                        <div style={{
                          backgroundColor: zone.waterUsed > zone.target ? '#FF6B6B' : '#00FF00',
                          height: '6px',
                          borderRadius: '4px',
                          width: `${Math.min((zone.waterUsed / zone.target) * 100, 100)}%`,
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      <span>Pressure: <span style={{ color: 'var(--color-text-primary)' }}>{zone.pressure} bar</span></span>
                      <span>Soil Temp: <span style={{ color: 'var(--color-text-primary)' }}>{zone.soilTemp}°C</span></span>
                      <span>Next: <span style={{ color: zone.nextScheduled === 'Now' ? '#FF6B6B' : '#00FF00' }}>{zone.nextScheduled}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Irrigation Schedule & Nutrient Management */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {/* Irrigation Schedule */}
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Today's Irrigation Schedule</h3>
                {irrigationSchedule.map((schedule, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    marginBottom: '8px',
                    backgroundColor: 'var(--color-background-card)', border: `1px solid ${schedule.status === 'completed' ? 'var(--color-success)' : schedule.status === 'scheduled' ? '#f59e0b' : 'var(--color-border)'}`,
                    borderRadius: '6px',
                    borderLeft: `4px solid ${schedule.status === 'completed' ? '#00FF00' : schedule.status === 'scheduled' ? '#f59e0b' : '#888888'}`
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginRight: '8px' }}>{schedule.time}</span>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          backgroundColor: schedule.status === 'completed' ? '#00FF00' : schedule.status === 'scheduled' ? '#f59e0b' : '#888888',
                          color: schedule.status === 'completed' ? '#000000' : '#ffffff',
                          borderRadius: '8px',
                          fontWeight: '500'
                        }}>
                          {schedule.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>Zones: {schedule.zones.join(', ')} • {schedule.duration} min</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{schedule.type} irrigation</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: schedule.status === 'completed' ? '#00FF00' : '#888888' }}>
                        {schedule.waterUsed > 0 ? `${schedule.waterUsed}L` : '--'}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Water Used</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nutrient Management */}
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Nutrient Management</h3>
                {nutrientMixtures.map((nutrient) => (
                  <div key={nutrient.id} style={{
                    padding: '12px',
                    marginBottom: '12px',
                    backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${nutrient.color}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{nutrient.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{nutrient.ratio} • {nutrient.concentration} EC</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: nutrient.tankLevel < 30 ? '#FF6B6B' : '#00FF00' }}>
                          {nutrient.tankLevel}%
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Tank Level</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                      <span>Usage: <span style={{ color: 'var(--color-text-primary)' }}>{nutrient.usage}</span></span>
                      <span>Target: <span style={{ color: 'var(--color-text-primary)' }}>{nutrient.target}</span></span>
                    </div>
                    {/* Tank Level Progress */}
                    <div style={{ width: '100%', backgroundColor: 'var(--color-border)', borderRadius: '3px', height: '4px' }}>
                      <div style={{
                        backgroundColor: nutrient.color,
                        height: '4px',
                        borderRadius: '3px',
                        width: `${nutrient.tankLevel}%`,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Water Quality Monitoring */}
            <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Water Quality Monitoring</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                {waterQualityMetrics.map((metric, index) => (
                  <div key={index} style={{
                    backgroundColor: 'var(--color-background-card)',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: `1px solid ${metric.color}`
                  }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{metric.parameter}</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: metric.color, marginBottom: '4px' }}>
                      {metric.value}{metric.unit}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Optimal: {metric.optimal}</div>
                    <div style={{
                      marginTop: '8px',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '9px',
                      fontWeight: '600',
                      backgroundColor: 'var(--color-background-card)', border: `1px solid ${metric.status === 'optimal' ? 'var(--color-success)' : '#ef4444'}`,
                      color: metric.status === 'optimal' ? '#00FF00' : '#FF6B6B'
                    }}>
                      {metric.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'harvest':
        return (
          <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '24px', marginTop: 0 }}>AI-Powered Harvest Predictions</h2>
            
            {/* Harvest Summary Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#00FF00', marginBottom: '8px' }}>◈</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{harvestSummary.totalPredictedYield}kg</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Predicted Yield</div>
                <div style={{ fontSize: '10px', color: harvestSummary.totalPredictedYield > harvestSummary.weeklyTarget ? '#00FF00' : '#FF6B6B', marginTop: '4px' }}>
                  Target: {harvestSummary.weeklyTarget}kg
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#06b6d4', marginBottom: '8px' }}>●</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{harvestSummary.efficiency}%</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Efficiency Rate</div>
                <div style={{ fontSize: '10px', color: '#00FF00', marginTop: '4px' }}>
                  ↑ 15.4% vs target
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#f59e0b', marginBottom: '8px' }}>◉</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{harvestSummary.readyToHarvest}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Ready to Harvest</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  {harvestSummary.plantsInProgress} in progress
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#10b981', marginBottom: '8px' }}>◎</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>${harvestSummary.marketValue}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Market Value</div>
                <div style={{ fontSize: '10px', color: '#00FF00', marginTop: '4px' }}>
                  Quality: {harvestSummary.qualityScore}%
                </div>
              </div>
            </div>

            {/* Harvest Calendar & Performance */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {/* Harvest Calendar */}
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Harvest Calendar - Next 7 Days</h3>
                {harvestCalendar.slice(0, 5).map((day, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    marginBottom: '8px',
                    backgroundColor: 'var(--color-background-card)', border: `1px solid ${day.priority === 'high' ? '#ef4444' : day.priority === 'medium' ? '#f59e0b' : '#06b6d4'}`,
                    borderRadius: '6px',
                    borderLeft: `4px solid ${day.priority === 'high' ? '#ef4444' : day.priority === 'medium' ? '#f59e0b' : '#06b6d4'}`
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginRight: '8px' }}>{day.date}</span>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          backgroundColor: day.priority === 'high' ? '#ef4444' : day.priority === 'medium' ? '#f59e0b' : '#06b6d4',
                          color: 'var(--color-text-primary)',
                          borderRadius: '8px',
                          fontWeight: '500'
                        }}>
                          {day.priority.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{day.crops.join(', ')}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{day.totalYield}kg yield</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#00FF00' }}>
                        ${day.value.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Est. Value</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Yield Performance Analytics */}
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Yield Performance Analytics</h3>
                
                {/* Current Week */}
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Current Week</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Predicted: {yieldAnalytics.currentWeek.predicted}kg</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>Actual: {yieldAnalytics.currentWeek.actual}kg</span>
                  </div>
                  <div style={{ fontSize: '12px', color: yieldAnalytics.currentWeek.efficiency >= 100 ? '#00FF00' : '#B8860B', fontWeight: '500' }}>
                    Efficiency: {yieldAnalytics.currentWeek.efficiency}%
                  </div>
                </div>

                {/* Last Week */}
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Last Week</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Predicted: {yieldAnalytics.lastWeek.predicted}kg</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>Actual: {yieldAnalytics.lastWeek.actual}kg</span>
                  </div>
                  <div style={{ fontSize: '12px', color: yieldAnalytics.lastWeek.efficiency >= 100 ? '#00FF00' : '#B8860B', fontWeight: '500' }}>
                    Efficiency: {yieldAnalytics.lastWeek.efficiency}%
                  </div>
                </div>

                {/* Performance Insights */}
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  <div style={{ marginBottom: '4px' }}>Best Performer: <span style={{ color: '#00FF00', fontWeight: '500' }}>{yieldAnalytics.bestPerforming}</span></div>
                  <div style={{ marginBottom: '4px' }}>Needs Attention: <span style={{ color: '#FF6B6B', fontWeight: '500' }}>{yieldAnalytics.improvementNeeded}</span></div>
                  <div>Prediction Accuracy: <span style={{ color: '#06b6d4', fontWeight: '500' }}>{yieldAnalytics.avgAccuracy}%</span></div>
                </div>
              </div>
            </div>

            {/* Detailed Harvest Predictions */}
            <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Detailed Crop Predictions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
                {detailedHarvestPredictions.map((prediction) => (
                  <div key={prediction.id} style={{
                    backgroundColor: 'var(--color-background-card)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${prediction.color}`,
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}>
                    {/* Prediction Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>{prediction.crop}</h4>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{prediction.variety} • Zone {prediction.zone}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Planted: {prediction.plantedDate}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: prediction.daysRemaining <= 3 ? '#00FF00' : prediction.daysRemaining <= 7 ? '#B8860B' : '#ffffff',
                          marginBottom: '2px'
                        }}>
                          {prediction.daysRemaining === 0 ? 'Ready!' : `${prediction.daysRemaining} days`}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>to harvest</div>
                      </div>
                    </div>

                    {/* Growth Progress */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Growth Progress</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-primary)', fontWeight: '500' }}>{prediction.stageProgress}% - {prediction.currentStage}</span>
                      </div>
                      <div style={{ width: '100%', backgroundColor: 'var(--color-border)', borderRadius: '4px', height: '6px' }}>
                        <div style={{
                          backgroundColor: prediction.color,
                          height: '6px',
                          borderRadius: '4px',
                          width: `${prediction.stageProgress}%`,
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>

                    {/* Yield & Value Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#00FF00' }}>
                          {prediction.predictedYield}{prediction.unit}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Predicted Yield</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#06b6d4' }}>
                          {prediction.confidence}%
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Confidence</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f59e0b' }}>
                          ${prediction.estimatedValue.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Est. Value</div>
                      </div>
                    </div>

                    {/* Quality & Health */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: 'var(--color-background-card)', border: `1px solid ${prediction.quality === 'Premium' ? 'var(--color-success)' : prediction.quality === 'High' ? '#06b6d4' : '#f59e0b'}`,
                        color: prediction.quality === 'Premium' ? '#00FF00' : prediction.quality === 'High' ? '#06b6d4' : '#f59e0b'
                      }}>
                        {prediction.quality} Quality
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                        Health: <span style={{ color: prediction.healthScore >= 90 ? '#00FF00' : prediction.healthScore >= 75 ? '#B8860B' : '#FF6B6B', fontWeight: '500' }}>{prediction.healthScore}%</span>
                      </div>
                    </div>

                    {/* AI Factors */}
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '11px', color: '#00FF00', fontWeight: '500', marginBottom: '4px' }}>✓ AI Factors:</div>
                      {prediction.aiFactors.slice(0, 2).map((factor, index) => (
                        <div key={index} style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginLeft: '12px', marginBottom: '2px' }}>• {factor}</div>
                      ))}
                    </div>

                    {/* Risk Factors */}
                    {prediction.riskFactors.length > 0 && (
                      <div>
                        <div style={{ fontSize: '11px', color: '#FF6B6B', fontWeight: '500', marginBottom: '4px' }}>⚠ Risk Factors:</div>
                        {prediction.riskFactors.map((risk, index) => (
                          <div key={index} style={{ fontSize: '10px', color: '#FF6B6B', marginLeft: '12px' }}>• {risk}</div>
                        ))}
                      </div>
                    )}

                    {/* Market Info */}
                    <div style={{ marginTop: '12px', padding: '8px', backgroundColor: 'var(--color-background-nested)', borderRadius: '4px', fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                      Market Price: <span style={{ color: 'var(--color-text-primary)' }}>${prediction.marketPrice}/kg</span> • 
                      Size: <span style={{ color: 'var(--color-text-primary)' }}>{prediction.size}</span> • 
                      Harvest: <span style={{ color: 'var(--color-text-primary)' }}>{prediction.predictedHarvestDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'ai-insights':
        return (
          <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '24px', marginTop: 0 }}>AI Insights & Recommendations</h2>
            
            {/* AI Analytics Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#06b6d4', marginBottom: '8px' }}>◇</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{aiAnalyticsSummary.totalInsights}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>AI Insights</div>
                <div style={{ fontSize: '10px', color: aiAnalyticsSummary.criticalAlerts > 0 ? '#FF6B6B' : '#00FF00', marginTop: '4px' }}>
                  {aiAnalyticsSummary.criticalAlerts} critical alerts
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#00FF00', marginBottom: '8px' }}>◈</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{aiAnalyticsSummary.predictiveAccuracy}%</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Prediction Accuracy</div>
                <div style={{ fontSize: '10px', color: '#00FF00', marginTop: '4px' }}>
                  ↑ +2.8% this month
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#f59e0b', marginBottom: '8px' }}>◉</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{aiAnalyticsSummary.optimizationOpportunities}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Optimizations</div>
                <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '4px' }}>
                  +{aiAnalyticsSummary.yieldImprovement}% yield potential
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#10b981', marginBottom: '8px' }}>◎</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>${aiAnalyticsSummary.costSavings}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Cost Savings</div>
                <div style={{ fontSize: '10px', color: '#10b981', marginTop: '4px' }}>
                  Monthly potential
                </div>
              </div>
            </div>

            {/* System Recommendations */}
            <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>System Recommendations</h3>
                
                {/* Immediate Actions */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444', marginBottom: '8px' }}>⚡ Immediate Actions</div>
                  {systemRecommendations.immediate.map((rec, index) => (
                    <div key={index} style={{
                      padding: '8px 12px',
                      marginBottom: '6px',
                      backgroundColor: 'var(--color-background-card)', border: '1px solid #FF6B6B',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      <div style={{ color: 'var(--color-text-primary)', marginBottom: '2px' }}>{rec.action}</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>Impact: {rec.impact}</div>
                    </div>
                  ))}
                </div>

                {/* This Week */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b', marginBottom: '8px' }}>🗓 This Week</div>
                  {systemRecommendations.thisWeek.map((rec, index) => (
                    <div key={index} style={{
                      padding: '8px 12px',
                      marginBottom: '6px',
                      backgroundColor: 'var(--color-background-card)', border: '1px solid #FFA500',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      <div style={{ color: 'var(--color-text-primary)', marginBottom: '2px' }}>{rec.action}</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>Impact: {rec.impact}</div>
                    </div>
                  ))}
                </div>

                {/* Long Term */}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#06b6d4', marginBottom: '8px' }}>🔮 Long Term</div>
                  {systemRecommendations.longTerm.map((rec, index) => (
                    <div key={index} style={{
                      padding: '8px 12px',
                      marginBottom: '6px',
                      backgroundColor: 'var(--color-background-card)', border: '1px solid #06b6d4',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      <div style={{ color: 'var(--color-text-primary)', marginBottom: '2px' }}>{rec.action}</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>Impact: {rec.impact}</div>
                    </div>
                  ))}
                </div>
            </div>

            {/* Predictive Analytics Dashboard */}
            <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Predictive Analytics Dashboard</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {/* Next Week Yield */}
                <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Next Week Yield</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00FF00', marginBottom: '4px' }}>
                    {predictiveAnalytics.nextWeekYield.predicted}kg
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Confidence: {predictiveAnalytics.nextWeekYield.confidence}%</div>
                  <div style={{ fontSize: '10px', color: '#00FF00', marginTop: '4px' }}>
                    ↑ {predictiveAnalytics.nextWeekYield.trend}
                  </div>
                </div>

                {/* Resource Efficiency */}
                <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px', textAlign: 'center' }}>Resource Efficiency</div>
                  <div style={{ fontSize: '11px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Water: </span>
                    <span style={{ color: '#06b6d4', fontWeight: '500' }}>{predictiveAnalytics.resourceEfficiency.water}%</span>
                  </div>
                  <div style={{ fontSize: '11px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Energy: </span>
                    <span style={{ color: '#f59e0b', fontWeight: '500' }}>{predictiveAnalytics.resourceEfficiency.energy}%</span>
                  </div>
                  <div style={{ fontSize: '11px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Nutrients: </span>
                    <span style={{ color: '#10b981', fontWeight: '500' }}>{predictiveAnalytics.resourceEfficiency.nutrients}%</span>
                  </div>
                </div>

                {/* Quality Projection */}
                <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Quality Projection</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00FF00', marginBottom: '4px' }}>
                    {predictiveAnalytics.qualityProjection.overall}%
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Premium: {predictiveAnalytics.qualityProjection.premium}%</div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Commercial: {predictiveAnalytics.qualityProjection.commercial}%</div>
                </div>

                {/* Profitability Forecast */}
                <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Profitability</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00FF00', marginBottom: '4px' }}>
                    {predictiveAnalytics.profitabilityForecast.margin}%
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Revenue: ${predictiveAnalytics.profitabilityForecast.revenue}</div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Costs: ${predictiveAnalytics.profitabilityForecast.costs}</div>
                </div>
              </div>
            </div>

            {/* Detailed AI Insights */}
            <div style={{ backgroundColor: 'var(--color-background-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Detailed AI Insights</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
                {comprehensiveAiInsights.map((insight) => (
                  <div key={insight.id} style={{
                    backgroundColor: 'var(--color-background-card)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${
                      insight.impact === 'critical' ? '#ef4444' : 
                      insight.impact === 'high' ? '#f59e0b' : 
                      insight.impact === 'medium' ? '#06b6d4' : 'var(--color-success)'
                    }`,
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}>
                    {/* Insight Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          backgroundColor: 'var(--color-background-card)', border: `1px solid ${insight.impact === 'critical' ? '#ef4444' : insight.impact === 'high' ? '#f59e0b' : '#06b6d4'}`,
                          color: insight.impact === 'critical' ? '#ef4444' : insight.impact === 'high' ? '#f59e0b' : '#06b6d4',
                          borderRadius: '8px',
                          fontWeight: '600',
                          marginBottom: '4px',
                          display: 'inline-block'
                        }}>
                          {insight.category}
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>{insight.title}</h4>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>AI Model: {insight.aiModel}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: insight.confidence >= 95 ? '#00FF00' : insight.confidence >= 90 ? '#B8860B' : '#f59e0b',
                          marginBottom: '2px'
                        }}>
                          {insight.confidence}%
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Confidence</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 12px 0', lineHeight: '1.4' }}>{insight.description}</p>

                    {/* Expected Gains & Implementation */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#00FF00', fontWeight: '500', marginBottom: '4px' }}>✓ Expected Gains:</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-primary)', marginLeft: '12px', marginBottom: '6px' }}>{insight.expectedGains}</div>
                      
                      <div style={{ fontSize: '12px', color: '#06b6d4', fontWeight: '500', marginBottom: '4px' }}>⚙ Implementation:</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-primary)', marginLeft: '12px' }}>{insight.implementation}</div>
                    </div>

                    {/* Metrics & Tags */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Data Points: </span>
                        <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{insight.dataPoints}</span>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Risk Level: </span>
                        <span style={{ 
                          color: insight.riskLevel === 'very low' ? '#00FF00' : 
                                insight.riskLevel === 'low' ? '#B8860B' : 
                                insight.riskLevel === 'medium' ? '#f59e0b' : '#ef4444', 
                          fontWeight: '500' 
                        }}>
                          {insight.riskLevel}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Priority: </span>
                        <span style={{ 
                          color: insight.priority === 'urgent' ? '#ef4444' : 
                                insight.priority === 'immediate' ? '#f59e0b' : 
                                insight.priority === 'today' ? '#B8860B' : '#06b6d4', 
                          fontWeight: '500' 
                        }}>
                          {insight.priority}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Timeline: </span>
                        <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{insight.timeframe}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                      {insight.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} style={{
                          fontSize: '9px',
                          padding: '2px 6px',
                          backgroundColor: 'var(--color-background-nested)',
                          color: 'var(--color-text-secondary)',
                          borderRadius: '8px',
                          border: '1px solid #444444'
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Last Updated */}
                    <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', textAlign: 'right' }}>
                      Updated: {insight.lastUpdated}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Key Performance Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>Active Plants</p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>1,247</p>
                  </div>
                  <div style={{ fontSize: '40px', color: 'var(--color-text-primary)' }}>◉</div>
                </div>
                <p style={{ fontSize: '12px', color: '#00FF00', margin: '12px 0 0 0' }}>↗ 12% from last month</p>
              </div>

              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>Avg Health Score</p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>89.2%</p>
                  </div>
                  <div style={{ fontSize: '40px', color: 'var(--color-text-primary)' }}>▤</div>
                </div>
                <p style={{ fontSize: '12px', color: '#00FF00', margin: '12px 0 0 0' }}>↗ 5.2% improvement</p>
              </div>

              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>Water Efficiency</p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>92.5%</p>
                  </div>
                  <div style={{ fontSize: '40px', color: 'var(--color-text-primary)' }}>◎</div>
                </div>
                <p style={{ fontSize: '12px', color: '#B8860B', margin: '12px 0 0 0' }}>↑ 8% above target</p>
              </div>

              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>Energy Usage</p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>23.4kW</p>
                  </div>
                  <div style={{ fontSize: '40px', color: 'var(--color-text-primary)' }}>◈</div>
                </div>
                <p style={{ fontSize: '12px', color: '#00FF00', margin: '12px 0 0 0' }}>↘ 3% efficiency gain</p>
              </div>

              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>AI Accuracy</p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>94.2%</p>
                  </div>
                  <div style={{ fontSize: '40px', color: 'var(--color-text-primary)' }}>◇</div>
                </div>
                <p style={{ fontSize: '12px', color: '#00FF00', margin: '12px 0 0 0' }}>↗ 2.8% this month</p>
              </div>

              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>Revenue Today</p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>$287</p>
                  </div>
                  <div style={{ fontSize: '40px', color: 'var(--color-text-primary)' }}>◐</div>
                </div>
                <p style={{ fontSize: '12px', color: '#00FF00', margin: '12px 0 0 0' }}>↗ $45 vs. yesterday</p>
              </div>
            </div>

            {/* Operational Summary Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              {/* Production Summary */}
              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Production Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--color-background-card)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00FF00' }}>18.7kg</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Weekly Yield</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--color-background-card)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#B8860B' }}>8</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Ready to Harvest</div>
                  </div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-success)', borderRadius: '6px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#00FF00', fontWeight: '500' }}>Top Performers:</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-primary)', marginTop: '4px' }}>Sweet Basil (98% health), Wild Arugula (95% health)</div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Market Value: <span style={{ color: '#00FF00', fontWeight: 'bold' }}>$142.50</span></div>
              </div>

              {/* System Health Overview */}
              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>System Health Overview</h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Environmental Status</span>
                    <span style={{ fontSize: '14px', color: '#00FF00', fontWeight: '500' }}>Optimal</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Irrigation Systems</span>
                    <span style={{ fontSize: '14px', color: '#00FF00', fontWeight: '500' }}>Active (6/6)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>AI Models</span>
                    <span style={{ fontSize: '14px', color: '#00FF00', fontWeight: '500' }}>Online (6/6)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Sensor Network</span>
                    <span style={{ fontSize: '14px', color: '#B8860B', fontWeight: '500' }}>98.5% Uptime</span>
                  </div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--color-background-card)', border: '1px solid #FF6B6B', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#FF6B6B', fontWeight: '500' }}>⚠ Active Alerts: 2</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Zone C pH critical, Bell Pepper aphids detected</div>
                </div>
              </div>

              {/* Resource Utilization */}
              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Resource Utilization</h3>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Water Usage</span>
                    <span style={{ fontSize: '12px', color: '#06b6d4', fontWeight: '500' }}>2,847L / 3,200L</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-background-card)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '89%', height: '100%', backgroundColor: '#06b6d4' }}></div>
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Nutrients</span>
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>78% Average</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-background-card)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', backgroundColor: '#10b981' }}></div>
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Energy</span>
                    <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '500' }}>87.8% Efficiency</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-background-card)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '88%', height: '100%', backgroundColor: '#f59e0b' }}></div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '12px' }}>Cost Savings: <span style={{ color: '#00FF00', fontWeight: 'bold' }}>$1,847 this month</span></div>
              </div>
            </div>

            {/* Alerts and Analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              {/* Critical Alerts */}
              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Critical Alerts</h3>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-background-card)', border: '1px solid #FF6B6B', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '20px', marginRight: '12px', color: '#ff6b6b' }}>⚠</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#ff6b6b', margin: '0 0 2px 0' }}>Zone C pH Critical</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>pH 5.2 - Immediate attention required</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-background-card)', border: '1px solid #FFA500', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '20px', marginRight: '12px', color: '#f59e0b' }}>◉</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#f59e0b', margin: '0 0 2px 0' }}>Bell Pepper Aphids</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>Minor infestation detected - Apply treatment</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-success)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '20px', marginRight: '12px', color: '#00FF00' }}>✓</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#00FF00', margin: '0 0 2px 0' }}>Zone A Optimal</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>All conditions within ideal range</p>
                  </div>
                </div>
              </div>

              {/* Today's Harvest Schedule */}
              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Today's Harvest Schedule</h3>
                {harvestCalendar.slice(0, 3).map((day, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '12px', backgroundColor: 'var(--color-background-card)', borderRadius: '6px' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', margin: '0 0 2px 0' }}>{day.crops.join(', ')}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>{day.date} • {day.totalYield}kg expected</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '10px',
                        padding: '2px 6px',
                        backgroundColor: day.priority === 'high' ? '#ef4444' : day.priority === 'medium' ? '#f59e0b' : '#06b6d4',
                        color: 'var(--color-text-primary)',
                        borderRadius: '8px',
                        fontWeight: '500',
                        marginBottom: '4px'
                      }}>
                        {day.priority.toUpperCase()}
                      </div>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#00FF00', margin: 0 }}>${day.value.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Growth Progress Summary */}
              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Growth Progress by Stage</h3>
                {growthStages.map((stage, index) => (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{stage.stage}</span>
                      <span style={{ fontSize: '14px', color: stage.color, fontWeight: '500' }}>{stage.count} plants</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-background-card)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(stage.count / plantHealthSummary.total) * 100}%`, 
                        height: '100%', 
                        backgroundColor: stage.color 
                      }}></div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '16px', padding: '8px', backgroundColor: 'var(--color-background-card)', borderRadius: '6px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Total: {plantHealthSummary.total} plants • Avg Growth Rate: {plantHealthSummary.avgGrowthRate}%
                </div>
              </div>

              {/* AI Insights Summary */}
              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>AI Insights Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--color-background-card)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#06b6d4' }}>24</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Total Insights</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--color-background-card)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>3</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Critical Actions</div>
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#00FF00', fontWeight: '500', marginBottom: '4px' }}>Top Recommendation:</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-primary)', backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-success)', padding: '8px', borderRadius: '4px' }}>
                    Extend LED lighting for Zone A tomatoes to increase yield by 18%
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Potential Savings: <span style={{ color: '#00FF00', fontWeight: 'bold' }}>$1,847/month</span></div>
              </div>
            </div>

            {/* Alerts and Predictions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>System Alerts</h3>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-background-card)', border: '1px solid #FF6B6B', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '20px', marginRight: '12px', color: 'var(--color-text-primary)' }}>△</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#ff6b6b', margin: '0 0 2px 0' }}>Zone C pH Critical</p>
                    <p style={{ fontSize: '12px', color: '#ff6b6b', margin: 0 }}>pH 5.2 - Immediate attention required</p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Today's Harvest</h3>
                {harvestPredictions.slice(0, 2).map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', margin: '0 0 2px 0' }}>{item.crop}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>Est. {item.date}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#00FF00', margin: '0 0 2px 0' }}>{item.yield}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>{item.confidence}% confidence</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Dashboard Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              <div style={{ 
                backgroundColor: styles.backgroundCard, 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: theme === 'dark' ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                border: theme === 'light' ? `1px solid ${styles.border}` : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: styles.textSecondary, margin: '0 0 4px 0' }}>Active Plants</p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: styles.textPrimary, margin: 0 }}>1,247</p>
                  </div>
                  <div style={{ fontSize: '48px', color: styles.textPrimary }}>◉</div>
                </div>
                <p style={{ fontSize: '14px', color: styles.success, margin: '16px 0 0 0' }}>↗ 12% from last month</p>
              </div>

              <div style={{ 
                backgroundColor: styles.backgroundCard, 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: theme === 'dark' ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                border: theme === 'light' ? `1px solid ${styles.border}` : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: styles.textSecondary, margin: '0 0 4px 0' }}>Avg Health Score</p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: styles.textPrimary, margin: 0 }}>89%</p>
                  </div>
                  <div style={{ fontSize: '48px', color: styles.textPrimary }}>◤</div>
                </div>
                <p style={{ fontSize: '14px', color: styles.success, margin: '16px 0 0 0' }}>↗ 5% improvement</p>
              </div>

              <div style={{ 
                backgroundColor: styles.backgroundCard, 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: theme === 'dark' ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                border: theme === 'light' ? `1px solid ${styles.border}` : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: styles.textSecondary, margin: '0 0 4px 0' }}>Water Usage</p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: styles.textPrimary, margin: 0 }}>847L</p>
                  </div>
                  <div style={{ fontSize: '48px', color: styles.textPrimary }}>◎</div>
                </div>
                <p style={{ fontSize: '14px', color: styles.warning, margin: '16px 0 0 0' }}>↑ 8% from target</p>
              </div>

              <div style={{ 
                backgroundColor: styles.backgroundCard, 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: theme === 'dark' ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                border: theme === 'light' ? `1px solid ${styles.border}` : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: styles.textSecondary, margin: '0 0 4px 0' }}>Energy Usage</p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: styles.textPrimary, margin: 0 }}>23.4kW</p>
                  </div>
                  <div style={{ fontSize: '48px', color: styles.textPrimary }}>◈</div>
                </div>
                <p style={{ fontSize: '14px', color: styles.success, margin: '16px 0 0 0' }}>↘ 3% efficiency gain</p>
              </div>

              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>Avg Health Score</p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>89%</p>
                  </div>
                  <div style={{ fontSize: '48px', color: 'var(--color-text-primary)' }}>▤</div>
                </div>
                <p style={{ fontSize: '14px', color: '#00FF00', margin: '16px 0 0 0' }}>↗ 5% improvement</p>
              </div>

              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>Water Usage</p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>847L</p>
                  </div>
                  <div style={{ fontSize: '48px', color: 'var(--color-text-primary)' }}>◎</div>
                </div>
                <p style={{ fontSize: '14px', color: '#FF6B6B', margin: '16px 0 0 0' }}>↑ 8% from target</p>
              </div>

              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>Energy Usage</p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>23.4kW</p>
                  </div>
                  <div style={{ fontSize: '48px', color: 'var(--color-text-primary)' }}>◈</div>
                </div>
                <p style={{ fontSize: '14px', color: '#00FF00', margin: '16px 0 0 0' }}>↘ 3% efficiency gain</p>
              </div>
            </div>

            {/* Alerts and Predictions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>System Alerts</h3>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-background-card)', border: '1px solid #FF6B6B', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '20px', marginRight: '12px', color: 'var(--color-text-primary)' }}>△</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#ff6b6b', margin: '0 0 2px 0' }}>Zone C pH Critical</p>
                    <p style={{ fontSize: '12px', color: '#ff6b6b', margin: 0 }}>pH 5.2 - Immediate attention required</p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--color-background-card)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', marginTop: 0 }}>Today's Harvest</h3>
                {harvestPredictions.slice(0, 2).map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', margin: '0 0 2px 0' }}>{item.crop}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>Est. {item.date}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#00FF00', margin: '0 0 2px 0' }}>{item.yield}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>{item.confidence}% confidence</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background-main)', padding: '20px' }}>
      {/* Main Container */}
      <div style={{ 
        backgroundColor: 'var(--color-background-container)', 
        borderRadius: '16px', 
        minHeight: 'calc(100vh - 40px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
      {/* Header */}
      <header style={{ backgroundColor: 'transparent', padding: '24px 32px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>Welcome back, Farmer</h1>
            <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', margin: 0 }}>Here's your agriculture overview</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              style={{ 
                padding: '12px', 
                backgroundColor: 'var(--color-background-nested)', 
                color: 'var(--color-text-primary)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '8px', 
                fontSize: '16px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-button-active)';
                e.currentTarget.style.color = theme === 'light' ? '#000000' : '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-nested)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              title={`Current theme: ${theme}, Click to switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px 16px', backgroundColor: 'var(--color-background-nested)', color: 'var(--color-text-secondary)', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>12 months</button>
              <button style={{ padding: '8px 16px', backgroundColor: 'var(--color-background-nested)', color: 'var(--color-text-secondary)', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>24 hours</button>
              <button style={{ padding: '8px 16px', backgroundColor: 'var(--color-background-nested)', color: 'var(--color-text-secondary)', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>30 days</button>
              <button style={{ padding: '8px 16px', backgroundColor: 'var(--color-button-active)', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>7 days</button>
            </div>
            <div style={{ fontSize: '24px', color: 'var(--color-text-primary)' }}>◇</div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <nav style={{ width: '256px', backgroundColor: 'transparent', padding: '0 24px', minHeight: 'calc(100vh - 140px)' }}>
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sidebarItems.map((item) => {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: activeSection === item.id ? 'var(--color-button-active)' : 'var(--color-button-inactive)',
                      color: activeSection === item.id ? '#000000' : 'var(--color-text-secondary)'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '12px' }}>
                      <path d={item.icon} fill={activeSection === item.id ? '#000000' : 'var(--color-text-secondary)'} />
                    </svg>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '24px 32px 32px 0' }}>
          {renderContent()}
        </main>
      </div>
      </div>
    </div>
  );
}

export default App;