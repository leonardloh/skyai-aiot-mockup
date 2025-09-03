import React, { useState } from 'react';
import { Sprout, Droplets, Calendar, TrendingUp, Filter } from 'lucide-react';
import { plantsGrid } from '../data/mockData';
import type { PlantData } from '../types/dashboard';

interface PlantHealthGridProps {
  compact?: boolean;
}

const PlantHealthGrid: React.FC<PlantHealthGridProps> = ({ compact = false }) => {
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPlants = filterStatus === 'all' 
    ? plantsGrid 
    : plantsGrid.filter(plant => plant.status === filterStatus);

  const healthStats = {
    healthy: plantsGrid.filter(p => p.status === 'healthy').length,
    warning: plantsGrid.filter(p => p.status === 'warning').length,
    critical: plantsGrid.filter(p => p.status === 'critical').length,
    averageHealth: plantsGrid.reduce((sum, p) => sum + p.healthScore, 0) / plantsGrid.length
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'seedling': return 'bg-green-200 text-green-800';
      case 'vegetative': return 'bg-blue-200 text-blue-800';
      case 'flowering': return 'bg-purple-200 text-purple-800';
      case 'fruiting': return 'bg-orange-200 text-orange-800';
      case 'harvest': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getStageAbbreviation = (stage: string) => {
    switch (stage) {
      case 'seedling': return 'S';
      case 'vegetative': return 'V';
      case 'flowering': return 'F';
      case 'fruiting': return 'Fr';
      case 'harvest': return 'H';
      default: return '?';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (compact) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4">Plant Health Overview</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{healthStats.healthy}</div>
            <div className="text-sm text-accent">Healthy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{healthStats.warning}</div>
            <div className="text-sm text-accent">Warning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{healthStats.critical}</div>
            <div className="text-sm text-accent">Critical</div>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-1">
          {plantsGrid.slice(0, 16).map((plant) => (
            <div
              key={plant.id}
              className={`aspect-square rounded border-2 cursor-pointer relative ${
                plant.status === 'healthy' ? 'bg-green-100 border-green-300' :
                plant.status === 'warning' ? 'bg-yellow-100 border-yellow-300' :
                'bg-red-100 border-red-300'
              }`}
              title={`${plant.name} - ${plant.type} - ${plant.healthScore.toFixed(1)}% health - ${plant.growthStage}${plant.daysToHarvest ? ` - ${plant.daysToHarvest} days to harvest` : ''}`}
            >
              <div className="w-full h-full p-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <Sprout size={10} className={
                    plant.status === 'healthy' ? 'text-green-600' :
                    plant.status === 'warning' ? 'text-yellow-600' :
                    'text-red-600'
                  } />
                  <span className="text-xs font-mono font-bold">
                    {String.fromCharCode(65 + plant.location.row)}{plant.location.column + 1}
                  </span>
                </div>
                <div className="text-center">
                  <div className={`text-xs font-bold ${
                    plant.status === 'healthy' ? 'text-green-700' :
                    plant.status === 'warning' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {plant.healthScore.toFixed(0)}%
                  </div>
                </div>
                <div className="flex justify-center">
                  <span className={`text-xs px-1 rounded ${getStageColor(plant.growthStage)}`}>
                    {getStageAbbreviation(plant.growthStage)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Sprout size={24} className="text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-accent mb-1">Healthy Plants</h3>
          <p className="text-2xl font-bold text-primary">{healthStats.healthy}</p>
          <p className="text-xs text-accent mt-1">85%+ health score</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-accent mb-1">Need Attention</h3>
          <p className="text-2xl font-bold text-primary">{healthStats.warning}</p>
          <p className="text-xs text-accent mt-1">70-84% health score</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Droplets size={24} className="text-red-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-accent mb-1">Critical</h3>
          <p className="text-2xl font-bold text-primary">{healthStats.critical}</p>
          <p className="text-xs text-accent mt-1">&lt;70% health score</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-accent mb-1">Average Health</h3>
          <p className="text-2xl font-bold text-primary">{healthStats.averageHealth.toFixed(1)}%</p>
          <p className="text-xs text-accent mt-1">Overall farm health</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Plant Grid (6×8)</h3>
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-accent" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Plants</option>
              <option value="healthy">Healthy</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Plant Grid */}
        <div className="grid grid-cols-8 gap-3 mb-6">
          {Array.from({ length: 48 }, (_, i) => {
            const plant = filteredPlants.find(p => p.location.row * 8 + p.location.column === i);
            
            if (!plant && filterStatus !== 'all') {
              return (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg opacity-30"></div>
              );
            }

            if (!plant) {
              return (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-xs">Empty</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={plant.id}
                onClick={() => setSelectedPlant(plant)}
                className={`aspect-square rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                  plant.status === 'healthy' ? 'bg-green-100 border-green-300 hover:border-green-500' :
                  plant.status === 'warning' ? 'bg-yellow-100 border-yellow-300 hover:border-yellow-500' :
                  'bg-red-100 border-red-300 hover:border-red-500'
                } ${selectedPlant?.id === plant.id ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="w-full h-full p-2 flex flex-col justify-between text-xs">
                  <div className="flex justify-between items-start">
                    <Sprout size={14} className={
                      plant.status === 'healthy' ? 'text-green-600' :
                      plant.status === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    } />
                    <span className="text-xs font-mono font-bold">
                      {String.fromCharCode(65 + plant.location.row)}{plant.location.column + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-1">
                    <div className="text-center">
                      <div className="text-xs font-semibold text-primary truncate">
                        {plant.type}
                      </div>
                      <div className={`text-xs font-bold ${
                        plant.status === 'healthy' ? 'text-green-700' :
                        plant.status === 'warning' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {plant.healthScore.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className={`h-1.5 rounded-full ${getHealthColor(plant.healthScore)}`}></div>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-1 py-0.5 rounded ${getStageColor(plant.growthStage)}`}>
                        {getStageAbbreviation(plant.growthStage)}
                      </span>
                      {plant.daysToHarvest && (
                        <span className="text-xs text-accent font-medium">
                          {plant.daysToHarvest}d
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span>Healthy (85%+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
              <span>Warning (70-84%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
              <span>Critical (&lt;70%)</span>
            </div>
          </div>
          
          <div className="text-xs text-accent space-y-1">
            <div><strong>Card Information:</strong></div>
            <div>• <strong>Top Right:</strong> Grid position (e.g., A1, B3)</div>
            <div>• <strong>Center:</strong> Plant type and health percentage</div>
            <div>• <strong>Bottom Left:</strong> Growth stage (S=Seedling, V=Vegetative, F=Flowering, Fr=Fruiting, H=Harvest)</div>
            <div>• <strong>Bottom Right:</strong> Days to harvest (when applicable)</div>
          </div>
        </div>
      </div>

      {/* Plant Details Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-primary">{selectedPlant.name}</h3>
              <button
                onClick={() => setSelectedPlant(null)}
                className="text-accent hover:text-primary"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-accent mb-1">Health Score</label>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${getHealthColor(selectedPlant.healthScore)}`}></div>
                    <span className="text-lg font-semibold">{selectedPlant.healthScore.toFixed(1)}%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent mb-1">Growth Stage</label>
                  <span className={`px-2 py-1 rounded text-sm ${getStageColor(selectedPlant.growthStage)}`}>
                    {selectedPlant.growthStage}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-accent mb-1">Location</label>
                <span className="font-mono">
                  Row {String.fromCharCode(65 + selectedPlant.location.row)}, 
                  Column {selectedPlant.location.column + 1}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-accent mb-1">Last Watered</label>
                <span>{selectedPlant.lastWatered.toLocaleDateString()}</span>
              </div>
              
              {selectedPlant.daysToHarvest && (
                <div>
                  <label className="block text-sm font-medium text-accent mb-1">Days to Harvest</label>
                  <span className="font-semibold text-primary">{selectedPlant.daysToHarvest} days</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantHealthGrid;