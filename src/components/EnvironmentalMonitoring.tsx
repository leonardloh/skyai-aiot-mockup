import React from 'react';
import { Thermometer, Droplets, Wind, Sun } from 'lucide-react';
import { currentEnvironmental } from '../data/mockData';

interface EnvironmentalMonitoringProps {
  compact?: boolean;
}

const EnvironmentalMonitoring: React.FC<EnvironmentalMonitoringProps> = ({ compact = false }) => {
  const metrics = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${currentEnvironmental.temperature.toFixed(1)}°C`,
      status: currentEnvironmental.temperature >= 20 && currentEnvironmental.temperature <= 26 ? 'normal' : 'warning',
      range: '20-26°C'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${currentEnvironmental.humidity.toFixed(1)}%`,
      status: currentEnvironmental.humidity >= 60 && currentEnvironmental.humidity <= 70 ? 'normal' : 'warning',
      range: '60-70%'
    },
    {
      icon: Wind,
      label: 'CO₂',
      value: `${currentEnvironmental.co2.toFixed(0)} ppm`,
      status: currentEnvironmental.co2 <= 500 ? 'normal' : 'warning',
      range: '< 500 ppm'
    },
    {
      icon: Sun,
      label: 'Light',
      value: `${currentEnvironmental.lighting.toFixed(0)} lux`,
      status: currentEnvironmental.lighting >= 800 ? 'normal' : 'warning',
      range: '> 800 lux'
    }
  ];

  if (compact) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Monitoring</h3>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  metric.status === 'normal' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <Icon size={20} className={
                    metric.status === 'normal' ? 'text-green-600' : 'text-yellow-600'
                  } />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="font-semibold text-gray-900">{metric.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${
                  metric.status === 'normal' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <Icon size={24} className={
                    metric.status === 'normal' ? 'text-green-600' : 'text-yellow-600'
                  } />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.label}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-xs text-gray-500 mt-1">Optimal: {metric.range}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnvironmentalMonitoring;