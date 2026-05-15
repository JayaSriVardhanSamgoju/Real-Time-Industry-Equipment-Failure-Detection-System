import React from 'react';
import { PageContainer } from '@/layouts/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { COPY } from '@/config/copy';
import { IsolationForestViz } from './IsolationForestViz';
import { SlidingWindowDemo } from './SlidingWindowDemo';
import { FeatureEngineeringCard } from './FeatureEngineeringCard';
import { AdaptiveThresholdExplainer } from './AdaptiveThresholdExplainer';
import { DriftConceptCard } from './DriftConceptCard';

const MLExplainabilityPage: React.FC = () => {
  return (
    <PageContainer>
      <SectionHeader 
        title={COPY.explainability.title} 
        subtitle={COPY.explainability.subtitle} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
          <IsolationForestViz />
        </div>
        <div>
          <FeatureEngineeringCard />
        </div>
        <div>
          <SlidingWindowDemo />
        </div>
        <div className="xl:col-span-1">
          <AdaptiveThresholdExplainer />
        </div>
        <div>
          <DriftConceptCard />
        </div>
      </div>
    </PageContainer>
  );
};

export default MLExplainabilityPage;
