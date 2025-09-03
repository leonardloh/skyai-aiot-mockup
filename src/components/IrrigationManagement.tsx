import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, Beaker, Calendar, Settings, Play, Pause } from 'lucide-react';
import { irrigationZones } from '../data/mockData';

const IrrigationManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Irrigation Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {irrigationZones.map((zone, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{zone.zone}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">pH Level</span>
                  <span className="font-semibold">{zone.ph.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">EC Level</span>
                  <span className="font-semibold">{zone.ec.toFixed(1)} dS/m</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Water Level</span>
                  <span className="font-semibold">{zone.waterLevel}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Nutrients</span>
                  <span className="font-semibold">{zone.nutrientLevel}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IrrigationManagement;