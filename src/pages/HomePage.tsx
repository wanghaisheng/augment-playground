// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchHomePageView } from '@/services';
import WelcomeSection from '@/features/home/WelcomeSection';
import MoodsSection from '@/features/home/MoodsSection';
import PandaSection from '@/features/home/PandaSection';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import AnimatedButton from '@/components/animation/AnimatedButton';
import { pageTransition } from '@/utils/animation';
import { initializeGameData } from '@/services/gameInitService';
import type { HomePageViewDataPayload, HomePageViewLabelsBundle, ApiError } from '@/types';

const HomePage: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);

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
      // Refresh the page to show new data
      window.location.reload();
    } catch (error) {
      console.error('Error initializing game data:', error);
      alert('Failed to initialize game data. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  if (isPending && !pageLabels) { // Full page initial load
    return <LoadingSpinner variant="jade" text="Loading Home Page Content..." />;
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
    <motion.div
      className="page-container"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="bamboo-frame"> {/* Wrap content in bamboo-frame */}
        <h2>{pageLabels?.pageTitle || "Dashboard"}</h2>

        <WelcomeSection labels={pageLabels?.welcomeSection} username={pageData?.username} />

        <PandaSection labels={pageLabels?.pandaSection} />

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
            {isInitializing ? 'Initializing...' : 'Initialize Game Data'}
          </AnimatedButton>
          <p className="text-sm text-gray-500 mt-2">
            This will create sample data for all game systems
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
         {isLoadingData && pageLabels && ( // Show spinner for data if labels are present
             <LoadingSpinner variant="jade" text="Fetching latest data..." />
         )}
      </div>
    </motion.div>
  );
};
export default HomePage;