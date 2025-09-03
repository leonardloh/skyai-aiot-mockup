import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { activeAlerts } from '../data/mockData';

const AlertsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const unresolvedAlerts = activeAlerts.filter(alert => !alert.resolved);

  return (
    <>
      {/* Floating Alert Button */}
      {unresolvedAlerts.length > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors z-40"
        >
          <div className="relative">
            <AlertTriangle size={24} />
            <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {unresolvedAlerts.length}
            </span>
          </div>
        </button>
      )}

      {/* Alerts Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {unresolvedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.severity === 'critical' ? 'bg-red-50 border-red-200' :
                    alert.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                    alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle size={16} className={
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'high' ? 'text-orange-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      } />
                      <span className="text-xs font-medium uppercase tracking-wide">
                        {alert.severity} - {alert.type}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              ))}

              {unresolvedAlerts.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
                  <p className="text-gray-600">No active alerts in your system.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertsPanel;