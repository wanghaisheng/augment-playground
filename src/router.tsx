// src/router.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy load page components
const HomePage = lazy(() => import('@/pages/HomePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const TasksPage = lazy(() => import('@/pages/TasksPage'));
const AbilitiesPage = lazy(() => import('@/pages/AbilitiesPage'));
const ChallengesPage = lazy(() => import('@/pages/ChallengesPage'));
const TimelyRewardsPage = lazy(() => import('@/pages/TimelyRewardsPage'));
const TeaRoomPage = lazy(() => import('@/pages/TeaRoomPage'));
const StorePage = lazy(() => import('@/pages/StorePage'));
const VipBenefitsPage = lazy(() => import('@/pages/VipBenefitsPage'));
const BattlePassPage = lazy(() => import('@/pages/BattlePassPage'));

const AppRouter: React.FC = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingSpinner variant="jade" text="Loading view..." />}>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/abilities" element={<AbilitiesPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/rewards" element={<TimelyRewardsPage />} />
        <Route path="/tearoom" element={<TeaRoomPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/vip-benefits" element={<VipBenefitsPage />} />
        <Route path="/battle-pass" element={<BattlePassPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} /> {/* Fallback route */}
      </Routes>
    </Suspense>
  );
};
export default AppRouter;