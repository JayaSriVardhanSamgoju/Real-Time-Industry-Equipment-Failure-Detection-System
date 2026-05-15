import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import LandingPage from '@/pages/LandingPage';
import MonitoringDashboard from '@/pages/MonitoringDashboard';
import ArchitecturePage from '@/pages/ArchitecturePage';
import MLExplainabilityPage from '@/pages/MLExplainabilityPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<RootLayout />}>
          <Route path="/dashboard" element={<MonitoringDashboard />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/explainability" element={<MLExplainabilityPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
