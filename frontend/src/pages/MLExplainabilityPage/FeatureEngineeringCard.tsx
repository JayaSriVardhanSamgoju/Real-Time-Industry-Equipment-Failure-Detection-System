import React from 'react';
import { GlowCard } from '@/components/ui/GlowCard';
import { Cpu } from 'lucide-react';

export const FeatureEngineeringCard: React.FC = () => {
  return (
    <GlowCard className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded bg-amber/10">
          <Cpu className="w-5 h-5 text-amber" />
        </div>
        <h3 className="text-lg font-display text-text-primary">Feature Engineering</h3>
      </div>
      
      <p className="text-sm font-body text-text-secondary mb-4">
        Raw sensor data is enriched to provide the Isolation Forest model with deeper context about the physical state of the equipment.
      </p>

      <div className="space-y-3 flex-1">
        <div className="p-3 bg-bg-elevated rounded border border-bg-border">
          <div className="text-xs font-display text-cyan mb-1">Temporal Features</div>
          <div className="font-mono text-xs text-text-muted">rolling_mean_temp, rolling_std_vib</div>
          <p className="text-[10px] mt-1 text-text-secondary">Captures how the current reading compares to the recent past.</p>
        </div>
        <div className="p-3 bg-bg-elevated rounded border border-bg-border">
          <div className="text-xs font-display text-amber mb-1">Cross-Sensor Features</div>
          <div className="font-mono text-xs text-text-muted">temp_vib_ratio</div>
          <p className="text-[10px] mt-1 text-text-secondary">Identifies friction (high temp + high vibration) vs external heating.</p>
        </div>
      </div>
    </GlowCard>
  );
};
