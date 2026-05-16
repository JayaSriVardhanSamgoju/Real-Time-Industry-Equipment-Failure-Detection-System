import React from 'react';
import { ComponentNode } from './ComponentNode';
import { DataFlowParticles } from './DataFlowParticles';

interface Props {
  activeNodeId: string | null;
  onNodeClick: (id: string) => void;
}

export const PipelineGraph: React.FC<Props> = ({ activeNodeId, onNodeClick }) => {
  // A glowing horizontal circuit line with particles
  const HorizontalTrace = () => (
    <div className="relative w-8 lg:w-16 h-[2px] bg-bg-border/60 mx-2 hidden md:block">
      <DataFlowParticles count={2} className="w-full h-[4px] -top-[1px]" />
    </div>
  );

  // A glowing vertical circuit line between levels
  const VerticalTrace = () => (
    <div className="flex flex-col items-center justify-center my-6">
      <div className="relative w-[2px] h-12 bg-bg-border/60">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-cyan to-transparent opacity-80 animate-[pulse_1.5s_infinite]" />
        </div>
      </div>
      <div className="w-3 h-3 border-2 border-cyan rounded-full bg-bg-base shadow-[0_0_10px_rgba(0,212,255,0.5)] -mt-1 z-10" />
    </div>
  );

  const LevelContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="relative flex flex-col items-center p-6 rounded-2xl border border-bg-border/50 bg-bg-elevated/30 backdrop-blur-sm w-full max-w-4xl shadow-lg">
      <div className="absolute top-0 left-6 -translate-y-1/2 bg-bg-surface px-3 py-1 text-xs font-display tracking-widest text-text-muted border border-bg-border rounded-full uppercase shadow-md">
        {title}
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-y-6 w-full pt-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full py-16 px-4 md:px-8 overflow-hidden relative">
      {/* Background Circuit Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
        backgroundSize: '100px 100px',
        backgroundPosition: 'center center'
      }} />

      <div className="flex flex-col items-center justify-center relative z-10 max-w-5xl mx-auto">
        
        {/* Phase 1: Edge / Ingestion */}
        <LevelContainer title="Phase 1: Edge Ingestion">
          <ComponentNode id="sensor" label="Sensor Simulator" type="source" isActive={activeNodeId === 'sensor'} onClick={() => onNodeClick('sensor')} />
        </LevelContainer>

        <VerticalTrace />

        {/* Phase 2: Data Brokerage */}
        <LevelContainer title="Phase 2: Stream Brokerage">
          <ComponentNode id="kafka_prod" label="Kafka Producer" type="stream" isActive={activeNodeId === 'kafka_prod'} onClick={() => onNodeClick('kafka_prod')} />
          <div className="md:hidden w-[2px] h-6 bg-bg-border/60 my-2" />
          <HorizontalTrace />
          <ComponentNode id="kafka_broker" label="Kafka Broker" type="stream" isActive={activeNodeId === 'kafka_broker'} onClick={() => onNodeClick('kafka_broker')} />
          <div className="md:hidden w-[2px] h-6 bg-bg-border/60 my-2" />
          <HorizontalTrace />
          <ComponentNode id="consumer" label="Stream Consumer" type="stream" isActive={activeNodeId === 'consumer'} onClick={() => onNodeClick('consumer')} />
        </LevelContainer>

        <VerticalTrace />

        {/* Phase 3: ML Processing */}
        <LevelContainer title="Phase 3: AI Inference Engine">
          <ComponentNode id="feature_eng" label="Feature Eng." type="compute" isActive={activeNodeId === 'feature_eng'} onClick={() => onNodeClick('feature_eng')} />
          <div className="md:hidden w-[2px] h-6 bg-bg-border/60 my-2" />
          <HorizontalTrace />
          <ComponentNode id="isolation_forest" label="Isolation Forest" type="ml" isActive={activeNodeId === 'isolation_forest'} onClick={() => onNodeClick('isolation_forest')} />
        </LevelContainer>

        <VerticalTrace />

        {/* Phase 4: Action & Delivery */}
        <LevelContainer title="Phase 4: Alerting & Delivery">
          <ComponentNode id="alert_system" label="Alert System" type="alert" isActive={activeNodeId === 'alert_system'} onClick={() => onNodeClick('alert_system')} />
          <div className="md:hidden w-[2px] h-6 bg-bg-border/60 my-2" />
          <HorizontalTrace />
          <ComponentNode id="fastapi" label="FastAPI Server" type="api" isActive={activeNodeId === 'fastapi'} onClick={() => onNodeClick('fastapi')} />
        </LevelContainer>

        <VerticalTrace />

        {/* Phase 5: Presentation */}
        <LevelContainer title="Phase 5: Presentation Layer">
          <ComponentNode id="dashboard" label="React Dashboard" type="api" isActive={activeNodeId === 'dashboard'} onClick={() => onNodeClick('dashboard')} />
        </LevelContainer>

      </div>
    </div>
  );
};
