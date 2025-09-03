import React from 'react';
import { aiInsights } from '../data/mockData';

const AIInsightsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Insights</h2>
        
        <div className="space-y-4">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                  insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {insight.impact} impact
                </span>
              </div>
              
              <p className="text-gray-600 mb-3">{insight.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Category: {insight.category}</span>
                <span className="text-green-600">Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInsightsDashboard;