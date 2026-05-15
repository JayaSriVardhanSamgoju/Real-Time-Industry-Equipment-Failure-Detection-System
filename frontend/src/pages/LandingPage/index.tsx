import React from 'react';
import { PageContainer } from '@/layouts/PageContainer';
import { HeroSection } from './HeroSection';
import { CapabilityCards } from './CapabilityCards';
import { LivePreviewMetrics } from './LivePreviewMetrics';
import { COPY } from '@/config/copy';

const LandingPage: React.FC = () => {
  return (
    <PageContainer>
      <HeroSection />
      <CapabilityCards />
      <LivePreviewMetrics />
      
      <footer className="mt-20 py-8 border-t border-bg-border text-center">
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {COPY.footer.techStack.map(tech => (
            <span key={tech} className="px-3 py-1 rounded bg-bg-surface border border-bg-border text-xs text-text-muted font-mono">
              {tech}
            </span>
          ))}
        </div>
        <p className="text-sm text-text-muted font-display">
          {COPY.brand.name} • {COPY.brand.version}
        </p>
      </footer>
    </PageContainer>
  );
};

export default LandingPage;
