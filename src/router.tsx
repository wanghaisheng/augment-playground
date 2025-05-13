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
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} /> {/* Fallback route */}
      </Routes>
    </Suspense>
  );
};
export default AppRouter;