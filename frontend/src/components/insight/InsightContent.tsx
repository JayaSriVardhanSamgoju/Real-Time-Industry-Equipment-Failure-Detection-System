import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { InsightContent as InsightContentType } from '@/types/insight.types';
import { StatusBadge } from '@/components/cards/StatusBadge';
import { COPY } from '@/config/copy';
import { getSeverityColor, getSeverityGlow } from '@/utils/colorUtils';
import {
  Zap,
  ClipboardList,
  Bot,
  BarChart3,
  AlertTriangle,
  Link2,
  ChevronDown,
  ChevronUp,
  Pin
} from 'lucide-react';
import { useInsightStore } from '@/store/useInsightStore';

interface Props {
  content: InsightContentType;
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  color?: string;
}

const InsightSection: React.FC<SectionProps> = ({ icon, title, text, color = '#8B9CC8' }) => (
  <div className="py-3 border-b border-bg-border last:border-b-0">
    <div className="flex items-center gap-2 mb-1.5">
      <span style={{ color }}>{icon}</span>
      <span
        className="text-[10px] font-display uppercase tracking-widest"
        style={{ color }}
      >
        {title}
      </span>
    </div>
    <p className="text-text-secondary text-xs font-body leading-relaxed">{text}</p>
  </div>
);

export const InsightContent: React.FC<Props> = ({ content }) => {
  const [showTechnical, setShowTechnical] = useState(false);
  const { isPinned, unpinInsight } = useInsightStore();
  const severityColor = getSeverityColor(content.severity);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan" />
          <span className="text-xs font-display uppercase tracking-widest text-cyan">
            {COPY.insight.title}
          </span>
          <span className="text-text-muted text-xs">•</span>
          <span className="text-text-primary text-xs font-body">{content.sensorName}</span>
        </div>
        <div className="flex items-center gap-2">
          {isPinned && (
            <button 
              onClick={(e) => { e.stopPropagation(); unpinInsight(); }}
              className="p-1 rounded hover:bg-bg-elevated transition-colors"
              title="Unpin Insight"
            >
              <Pin className="w-3.5 h-3.5 text-cyan fill-cyan/20" />
            </button>
          )}
          <StatusBadge
            severity={content.severity === 'critical' ? 'HIGH' : content.severity === 'warning' ? 'MEDIUM' : 'LOW'}
          />
        </div>
      </div>

      {/* Live metric row */}
      <div
        className="flex items-center gap-4 p-3 rounded-card mb-3"
        style={{
          backgroundColor: `${severityColor}10`,
          border: `1px solid ${severityColor}30`,
          boxShadow: getSeverityGlow(content.severity),
        }}
      >
        <div>
          <div className="text-[10px] text-text-muted font-display uppercase">Value</div>
          <div className="text-lg font-mono font-bold" style={{ color: severityColor }}>
            {content.sensorValue.toFixed(1)}
            <span className="text-xs text-text-muted ml-0.5">{content.sensorUnit}</span>
          </div>
        </div>
        <div className="w-px h-8 bg-bg-border" />
        <div>
          <div className="text-[10px] text-text-muted font-display uppercase">Score</div>
          <div className="text-lg font-mono font-bold" style={{ color: severityColor }}>
            {content.anomalyScore.toFixed(3)}
          </div>
        </div>
        <div className="w-px h-8 bg-bg-border" />
        <div>
          <div className="text-[10px] text-text-muted font-display uppercase">Threshold</div>
          <div className="text-sm font-mono text-text-secondary">
            {content.thresholdValue.toFixed(3)}
          </div>
        </div>
      </div>

      {/* Five-layer explanation sections */}
      <InsightSection
        icon={<ClipboardList className="w-3.5 h-3.5" />}
        title={COPY.insight.sections.operational}
        text={content.operational}
        color="#00D4FF"
      />
      <InsightSection
        icon={<Bot className="w-3.5 h-3.5" />}
        title={COPY.insight.sections.mlReasoning}
        text={content.mlReasoning}
        color="#3B82F6"
      />
      <InsightSection
        icon={<BarChart3 className="w-3.5 h-3.5" />}
        title={COPY.insight.sections.statistical}
        text={content.statistical}
        color="#8B9CC8"
      />
      <InsightSection
        icon={<AlertTriangle className="w-3.5 h-3.5" />}
        title={COPY.insight.sections.riskAssessment}
        text={content.riskAssessment}
        color={severityColor}
      />
      <InsightSection
        icon={<Link2 className="w-3.5 h-3.5" />}
        title={COPY.insight.sections.correlations}
        text={content.correlations}
        color="#F59E0B"
      />

      {/* Technical details expandable */}
      {content.technicalDetails && (
        <div className="mt-2">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="flex items-center gap-2 text-text-muted text-xs font-display uppercase tracking-wider hover:text-cyan transition-colors w-full py-2"
          >
            {showTechnical ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {COPY.insight.sections.technicalDetails}
          </button>
          {showTechnical && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-bg-elevated rounded-card p-3 mt-1"
            >
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-text-muted font-display uppercase">Feature Vector</span>
                  <div className="font-mono text-xs text-text-secondary mt-1">
                    {Object.entries(content.technicalDetails.featureVector).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span>{k}:</span>
                        <span className="text-cyan">{typeof v === 'number' ? v.toFixed(4) : v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Isolation Depth:</span>
                  <span className="text-text-secondary font-mono">{content.technicalDetails.isolationDepth}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Window Size:</span>
                  <span className="text-text-secondary font-mono">{content.technicalDetails.slidingWindowSize}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Threshold Method:</span>
                  <span className="text-text-secondary font-mono text-[10px]">
                    {content.technicalDetails.adaptiveThresholdMethod}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
