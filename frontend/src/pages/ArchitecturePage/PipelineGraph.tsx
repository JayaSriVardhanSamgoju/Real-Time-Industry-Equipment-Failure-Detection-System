import React from 'react';
import { ComponentNode } from './ComponentNode';
import { DataFlowParticles } from './DataFlowParticles';

interface Props {
  activeNodeId: string | null;
  onNodeClick: (id: string) => void;
}

export const PipelineGraph: React.FC<Props> = ({ activeNodeId, onNodeClick }) => {
  const FlowTrack = () => (
    <div className="relative w-12 h-1 bg-bg-border/50 rounded-full mx-2 hidden md:block">
      <DataFlowParticles count={3} />
    </div>
  );

  const FlowTrackVertical = () => (
    <div className="relative w-1 h-8 bg-bg-border/50 rounded-full my-2 block md:hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Simple CSS animation for vertical flow */}
        <div className="w-full h-full bg-gradient-to-b from-transparent via-cyan to-transparent opacity-50 animate-pulse" />
      </div>
    </div>
  );

  const Arrow = () => (
    <>
      <FlowTrack />
      <FlowTrackVertical />
    </>
  );

  return (
    <div className="w-full py-12 px-6 overflow-hidden">
      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-y-4 max-w-6xl mx-auto">
        <ComponentNode id="sensor" label="Sensor Simulator" type="source" isActive={activeNodeId === 'sensor'} onClick={() => onNodeClick('sensor')} />
        <Arrow />
        <ComponentNode id="kafka_prod" label="Kafka Producer" type="stream" isActive={activeNodeId === 'kafka_prod'} onClick={() => onNodeClick('kafka_prod')} />
        <Arrow />
        <ComponentNode id="kafka_broker" label="Kafka Broker" type="stream" isActive={activeNodeId === 'kafka_broker'} onClick={() => onNodeClick('kafka_broker')} />
        <Arrow />
        <ComponentNode id="consumer" label="Stream Consumer" type="stream" isActive={activeNodeId === 'consumer'} onClick={() => onNodeClick('consumer')} />
        <Arrow />
        <ComponentNode id="feature_eng" label="Feature Eng." type="compute" isActive={activeNodeId === 'feature_eng'} onClick={() => onNodeClick('feature_eng')} />
        <Arrow />
        <ComponentNode id="isolation_forest" label="Isolation Forest" type="ml" isActive={activeNodeId === 'isolation_forest'} onClick={() => onNodeClick('isolation_forest')} />
        <Arrow />
        <ComponentNode id="alert_system" label="Alert System" type="alert" isActive={activeNodeId === 'alert_system'} onClick={() => onNodeClick('alert_system')} />
        <Arrow />
        <ComponentNode id="fastapi" label="FastAPI Server" type="api" isActive={activeNodeId === 'fastapi'} onClick={() => onNodeClick('fastapi')} />
        <Arrow />
        <ComponentNode id="dashboard" label="React Dashboard" type="api" isActive={activeNodeId === 'dashboard'} onClick={() => onNodeClick('dashboard')} />
      </div>
    </div>
  );
};
