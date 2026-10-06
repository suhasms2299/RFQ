import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RfqProvider } from '../hooks/useRfqs';
import AppLayout from '../layouts/AppLayout';
import BrokerDashboard from '../pages/BrokerDashboard';
import RFQDetailPage from '../pages/RFQDetailPage';
import TraderDashboard from '../pages/TraderDashboard';

export default function AppRoutes() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RfqProvider>
        <Routes>
          <Route path="/trader" element={<AppLayout role="trader" />}>
            <Route index element={<TraderDashboard />} />
            <Route path="rfq/:rfqId" element={<RFQDetailPage role="trader" />} />
          </Route>
          <Route path="/broker" element={<AppLayout role="broker" />}>
            <Route index element={<BrokerDashboard />} />
            <Route path="rfq/:rfqId" element={<RFQDetailPage role="broker" />} />
          </Route>
          <Route path="/" element={<Navigate to="/trader" replace />} />
          <Route path="*" element={<Navigate to="/trader" replace />} />
        </Routes>
      </RfqProvider>
    </BrowserRouter>
  );
}