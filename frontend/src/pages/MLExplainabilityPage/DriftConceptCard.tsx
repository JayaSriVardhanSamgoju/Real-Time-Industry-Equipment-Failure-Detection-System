import React from 'react';
import { GlowCard } from '@/components/ui/GlowCard';
import { TrendingUp } from 'lucide-react';

export const DriftConceptCard: React.FC = () => {
  return (
    <GlowCard className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded bg-blue/10">
          <TrendingUp className="w-5 h-5 text-blue" />
        </div>
        <h3 className="text-lg font-display text-text-primary">Concept Drift</h3>
      </div>
      
      <p className="text-sm font-body text-text-secondary mb-4">
        Machine learning models degrade over time as the physical equipment ages and its "normal" operational signature changes.
      </p>

      <div className="space-y-3 flex-1">
        <div className="p-3 bg-bg-elevated rounded border border-bg-border relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-red/20 to-transparent pointer-events-none" />
          <div className="text-xs font-display text-text-primary mb-1">EvidentlyAI Integration</div>
          <p className="text-xs text-text-secondary leading-relaxed">
            We compute the Kolmogorov-Smirnov (KS) distance between the live data distribution and the training data distribution. If distance exceeds limits, automated retraining is triggered via MLflow.
          </p>
        </div>
      </div>
    </GlowCard>
  );
};
