// src/router.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EnhancedPageTransition from '@/components/animation/EnhancedPageTransition';
import '@/styles/pageTransitions.css';

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
const CustomGoalsPage = lazy(() => import('@/pages/CustomGoalsPage'));
const SocialComparisonPage = lazy(() => import('@/pages/SocialComparisonPage'));
const VipTaskSeriesPage = lazy(() => import('@/pages/VipTaskSeriesPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
const AvatarFrameShowcase = lazy(() => import('@/pages/AvatarFrameShowcase'));
const ButtonAnimationShowcase = lazy(() => import('@/pages/ButtonAnimationShowcase'));
const InkAnimationShowcase = lazy(() => import('@/pages/InkAnimationShowcase'));
const InputShowcase = lazy(() => import('@/pages/InputShowcase'));
const ButtonShowcase = lazy(() => import('@/pages/ButtonShowcase'));
const PandaInteractionShowcase = lazy(() => import('@/pages/PandaInteractionShowcase'));
const BambooCollectionPage = lazy(() => import('@/pages/BambooCollectionPage'));
const SoundTestingPage = lazy(() => import('@/pages/SoundTestingPage'));
const BambooPlantingPage = lazy(() => import('@/pages/BambooPlantingPage'));
const BambooTradingPage = lazy(() => import('@/pages/BambooTradingPage'));
const BambooDashboardPage = lazy(() => import('@/pages/BambooDashboardPage'));

const AppRouter: React.FC = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingSpinner variant="jade" text="Loading view..." />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <EnhancedPageTransition type="auto" className={`page-type-inkSpread`}>
              <HomePage />
            </EnhancedPageTransition>
          } />
          <Route path="/tasks" element={
            <EnhancedPageTransition type="auto" className={`page-type-scrollUnroll`}>
              <TasksPage />
            </EnhancedPageTransition>
          } />
          <Route path="/abilities" element={
            <EnhancedPageTransition type="auto" className={`page-type-goldenGlow`}>
              <AbilitiesPage />
            </EnhancedPageTransition>
          } />
          <Route path="/challenges" element={
            <EnhancedPageTransition type="auto" className={`page-type-bambooBlind`}>
              <ChallengesPage />
            </EnhancedPageTransition>
          } />
          <Route path="/rewards" element={
            <EnhancedPageTransition type="auto" className={`page-type-fallingLeaves`}>
              <TimelyRewardsPage />
            </EnhancedPageTransition>
          } />
          <Route path="/tearoom" element={
            <EnhancedPageTransition type="auto" className={`page-type-ripple`}>
              <TeaRoomPage />
            </EnhancedPageTransition>
          } />
          <Route path="/store" element={
            <EnhancedPageTransition type="auto" className={`page-type-goldenGlow`}>
              <StorePage />
            </EnhancedPageTransition>
          } />
          <Route path="/vip-benefits" element={
            <EnhancedPageTransition type="auto" className={`page-type-goldenGlow`}>
              <VipBenefitsPage />
            </EnhancedPageTransition>
          } />
          <Route path="/battle-pass" element={
            <EnhancedPageTransition type="auto" className={`page-type-scrollUnroll`}>
              <BattlePassPage />
            </EnhancedPageTransition>
          } />
          <Route path="/custom-goals" element={
            <EnhancedPageTransition type="auto" className={`page-type-inkSpread`}>
              <CustomGoalsPage />
            </EnhancedPageTransition>
          } />
          <Route path="/social" element={
            <EnhancedPageTransition type="auto" className={`page-type-slideUp`}>
              <SocialComparisonPage />
            </EnhancedPageTransition>
          } />
          <Route path="/vip-tasks" element={
            <EnhancedPageTransition type="auto" className={`page-type-inkSpread`}>
              <VipTaskSeriesPage />
            </EnhancedPageTransition>
          } />
          <Route path="/meditation" element={
            <EnhancedPageTransition type="auto" className={`page-type-fadeIn`}>
              <MeditationPage />
            </EnhancedPageTransition>
          } />
          <Route path="/avatar-frames" element={
            <EnhancedPageTransition type="auto" className={`page-type-misty`}>
              <AvatarFrameShowcase />
            </EnhancedPageTransition>
          } />
          <Route path="/button-animations" element={
            <EnhancedPageTransition type="auto" className={`page-type-basic`}>
              <ButtonAnimationShowcase />
            </EnhancedPageTransition>
          } />
          <Route path="/ink-animations" element={
            <EnhancedPageTransition type="auto" className={`page-type-basic`}>
              <InkAnimationShowcase />
            </EnhancedPageTransition>
          } />
          <Route path="/input-showcase" element={
            <EnhancedPageTransition type="auto" className={`page-type-basic`}>
              <InputShowcase />
            </EnhancedPageTransition>
          } />
          <Route path="/button-showcase" element={
            <EnhancedPageTransition type="auto" className={`page-type-basic`}>
              <ButtonShowcase />
            </EnhancedPageTransition>
          } />
          <Route path="/panda-interaction" element={
            <EnhancedPageTransition type="auto" className={`page-type-basic`}>
              <PandaInteractionShowcase />
            </EnhancedPageTransition>
          } />
          <Route path="/bamboo-collection" element={
            <EnhancedPageTransition type="auto" className={`page-type-basic`}>
              <BambooCollectionPage />
            </EnhancedPageTransition>
          } />
          <Route path="/settings" element={
            <EnhancedPageTransition type="auto" className={`page-type-basic`}>
              <SettingsPage />
            </EnhancedPageTransition>
          } />
          <Route path="/sound-testing" element={
            <EnhancedPageTransition type="auto" className={`page-type-basic`}>
              <SoundTestingPage />
            </EnhancedPageTransition>
          } />
          <Route path="/bamboo-planting" element={
            <EnhancedPageTransition type="auto" className={`page-type-bambooBlind`}>
              <BambooPlantingPage />
            </EnhancedPageTransition>
          } />
          <Route path="/bamboo-trading" element={
            <EnhancedPageTransition type="auto" className={`page-type-goldenGlow`}>
              <BambooTradingPage />
            </EnhancedPageTransition>
          } />
          <Route path="/bamboo-dashboard" element={
            <EnhancedPageTransition type="auto" className={`page-type-bambooBlind`}>
              <BambooDashboardPage />
            </EnhancedPageTransition>
          } />
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Fallback route */}
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};
export default AppRouter;