// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchHomePageView } from '@/services';
import WelcomeSection from '@/features/home/WelcomeSection';
import MoodsSection from '@/features/home/MoodsSection';
import PandaSection from '@/features/home/PandaSection';
import ResourcesSection from '@/features/home/ResourcesSection';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import AnimatedButton from '@/components/animation/AnimatedButton';
import GrowthBoostIndicator from '@/components/game/GrowthBoostIndicator';
import VipValueSummary from '@/components/vip/VipValueSummary';
import VipValueModal from '@/components/vip/VipValueModal';
import { initializeGameData } from '@/services/gameInitService';
import { HomePageSkeleton } from '@/components/skeleton';
import type { HomePageViewDataPayload, HomePageViewLabelsBundle, ApiError } from '@/types';
import { triggerDataRefresh } from '@/hooks/useDataRefresh';
import { usePandaState } from '@/context/PandaStateProvider';

const HomePage: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [showVipValueModal, setShowVipValueModal] = useState(false);
  const { pandaState } = usePandaState();

  const {
    data: pageData, labels: pageLabels, isPending, isError, error, refetch, isFetching
  } = useLocalizedView<HomePageViewDataPayload, HomePageViewLabelsBundle>(
    'homePageViewContent',
    fetchHomePageView
  );

  const handleInitializeGame = async () => {
    try {
      setIsInitializing(true);
      await initializeGameData();

      // Trigger data refresh for relevant tables instead of full page reload
      triggerDataRefresh('uiLabels');
      triggerDataRefresh('tasks');
      triggerDataRefresh('challenges');
      triggerDataRefresh('moods');
      triggerDataRefresh('pandaState');
      triggerDataRefresh('abilities');
      triggerDataRefresh('rewards');

      // Refresh the current view
      refetch();
    } catch (error) {
      console.error('Error initializing game data:', error);
      alert('Failed to initialize game data. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  // Handle showing VIP value modal
  const handleShowVipValueModal = () => {
    setShowVipValueModal(true);
  };

  if (isPending && !pageLabels) { // Full page initial load
    return (
      <div className="page-container">
        <div className="bamboo-frame">
          <HomePageSkeleton />
        </div>
      </div>
    );
  }

  if (isError && !pageLabels) { // Critical: Page labels failed
    return (
      <div className="page-content">
        <ErrorDisplay error={error} title="Home Page Error" onRetry={refetch} />
      </div>
    );
  }

  // If labels are partially/fully loaded, but an error occurred or still pending data
  // We can render the page shell with what we have.
  const isLoadingData = isPending || (isFetching && !pageData); // True if data is still being fetched/refetched

  return (
    <div className="page-container">
      <div className="bamboo-frame"> {/* Wrap content in bamboo-frame */}
        <div className="flex justify-between items-center">
          <h2>{pageLabels?.pageTitle || "Dashboard"}</h2>
          <GrowthBoostIndicator size="medium" />
        </div>

        <PandaSection labels={pageLabels?.pandaSection} />

        <ResourcesSection />

        <WelcomeSection labels={pageLabels?.welcomeSection} username={pageData?.username} />

        {/* VIP Value Summary */}
        {pandaState?.isVip && (
          <div className="vip-value-container bg-white rounded-lg shadow-sm border border-gold-100 p-3 mb-4">
            <VipValueSummary
              userId="current-user"
              onViewDetails={handleShowVipValueModal}
              compact={true}
            />
          </div>
        )}

        <MoodsSection
          labels={pageLabels?.moodsSection}
          moods={pageData?.moods}
          onRefresh={refetch}
          isFetching={isFetching}
        />

        {/* Initialize Game Data Button */}
        <div className="init-game-container" style={{marginTop: '20px', textAlign: 'center'}}>
          <AnimatedButton
            variant="gold"
            onClick={handleInitializeGame}
            disabled={isInitializing}
            style={{marginTop: '20px'}}
          >
            {isInitializing ? (pageLabels?.initializingText || 'Initializing...') : (pageLabels?.initializeGameText || 'Initialize Game Data')}
          </AnimatedButton>
          <p className="text-sm text-gray-500 mt-2">
            {pageLabels?.initializeGameDescription || 'This will create sample data for all game systems'}
          </p>
        </div>

        {/* Example of a page-level button using a page-level label with jade style */}
        {pageLabels?.someActionText && (
          <AnimatedButton
            variant="jade"
            onClick={() => alert('Action Confirmed!')}
            style={{marginTop: '20px'}}
          >
            {pageLabels.someActionText}
          </AnimatedButton>
        )}

        {/* Show specific data error if labels loaded but data part failed */}
        {isError && pageData === undefined && pageLabels && (
           <ErrorDisplay
              error={error}
              title={pageLabels.moodsSection?.sectionTitle || "Data Fetch Error"}
              messageTemplate="Could not load mood data. Details: {message}"
              onRetry={refetch}
           />
         )}
         {isLoadingData && pageLabels && ( // Show skeleton for data if labels are present
             <HomePageSkeleton />
         )}

         {/* VIP Value Modal */}
         <VipValueModal
           isOpen={showVipValueModal}
           onClose={() => setShowVipValueModal(false)}
           userId="current-user"
           isVip={pandaState?.isVip || false}
         />
      </div>
    </div>
  );
};
export default HomePage;