import React from 'react';
import { harvestPredictions } from '../data/mockData';

const HarvestPredictions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Harvest Predictions</h2>
        
        <div className="space-y-4">
          {harvestPredictions.map((prediction) => (
            <div key={prediction.plantId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{prediction.plantName}</h3>
                  <p className="text-gray-600">Expected Yield: {prediction.estimatedYield} kg</p>
                  <p className="text-gray-600">Quality Score: {prediction.qualityScore}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Harvest Date</p>
                  <p className="font-semibold">{prediction.harvestDate.toLocaleDateString()}</p>
                  <p className="text-sm text-green-600">Confidence: {(prediction.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HarvestPredictions;