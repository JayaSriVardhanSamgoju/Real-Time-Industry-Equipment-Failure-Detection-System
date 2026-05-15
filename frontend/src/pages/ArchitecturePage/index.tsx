import React, { useState } from 'react';
import { PageContainer } from '@/layouts/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { COPY } from '@/config/copy';
import { PipelineGraph } from './PipelineGraph';
import { ComponentDetailPanel } from './ComponentDetailPanel';

const ArchitecturePage: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <PageContainer>
      <SectionHeader 
        title={COPY.architecture.title} 
        subtitle={COPY.architecture.subtitle} 
      />
      
      <div className="relative mt-8 rounded-panel bg-bg-surface border border-bg-border overflow-hidden min-h-[600px] flex items-center justify-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, #1E2D40 1px, transparent 1px), linear-gradient(to bottom, #1E2D40 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.2
        }} />
        
        <PipelineGraph activeNodeId={activeNode} onNodeClick={setActiveNode} />
      </div>

      <ComponentDetailPanel 
        nodeId={activeNode} 
        onClose={() => setActiveNode(null)} 
      />
    </PageContainer>
  );
};

export default ArchitecturePage;
