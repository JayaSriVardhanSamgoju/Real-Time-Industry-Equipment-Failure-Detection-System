import React from 'react';
import { useSensorStore } from '@/store/useSensorStore';
import { Settings, Cpu } from 'lucide-react';

export const EquipmentSelector: React.FC = () => {
  const { selectedEquipmentId, setSelectedEquipmentId, availableEquipments, liveData } = useSensorStore();

  // Helper to get health status for any equipment without switching to it
  const getEquipmentStatus = (id: string) => {
    const equipData = liveData.filter(d => d.equipment_id === id);
    if (equipData.length === 0) return 'NORMAL';
    const latest = equipData[equipData.length - 1];
    
    // Simple logic to determine status for the dot
    if (latest.temperature > 90 || latest.vibration > 1.5 || latest.is_anomaly) return 'FAILURE';
    if (latest.temperature > 80 || latest.vibration > 1.0) return 'UNSTABLE';
    return 'NORMAL';
  };

  const getStatusColor = (status: string) => {
    if (status === 'FAILURE') return 'bg-red shadow-[0_0_8px_#EF4444]';
    if (status === 'UNSTABLE') return 'bg-amber shadow-[0_0_8px_#F59E0B]';
    return 'bg-green shadow-[0_0_8px_#10B981]';
  };

  return (
    <div className="flex items-center gap-3 bg-bg-elevated/50 border border-bg-border p-2 rounded-xl backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-base rounded-lg border border-bg-border shadow-inner">
        <Cpu className="w-4 h-4 text-cyan" />
        <span className="text-xs font-display font-bold text-text-secondary uppercase tracking-wider">
          Node Status:
        </span>
      </div>
      
      <div className="flex gap-2">
        {availableEquipments.length > 0 ? (
          availableEquipments.map((id) => {
            const status = getEquipmentStatus(id);
            return (
              <button
                key={id}
                onClick={() => setSelectedEquipmentId(id)}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border flex items-center gap-2 ${
                  selectedEquipmentId === id
                    ? 'bg-cyan/10 border-cyan text-cyan shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                    : 'bg-bg-base border-bg-border text-text-muted hover:border-text-muted/50 hover:text-text-secondary'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status)}`} />
                {id}
                {status !== 'NORMAL' && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red"></span>
                  </span>
                )}
              </button>
            );
          })
        ) : (
          <div className="text-xs text-text-muted px-4 py-1.5 animate-pulse">
            Waiting for data stream...
          </div>
        )}
      </div>

      <div className="h-6 w-[1px] bg-bg-border mx-1" />
      
      <button className="p-2 hover:bg-bg-elevated rounded-lg transition-colors text-text-muted hover:text-text-primary">
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
};
