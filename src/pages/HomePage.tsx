// src/pages/HomePage.tsx
import React from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchHomePageView } from '@/services';
import WelcomeSection from '@/features/home/WelcomeSection';
import MoodsSection from '@/features/home/MoodsSection';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Button from '@/components/common/Button'; // Example of using common button
import type { HomePageViewDataPayload, HomePageViewLabelsBundle, ApiError } from '@/types';

const HomePage: React.FC = () => {
  const {
    data: pageData, labels: pageLabels, isPending, isError, error, refetch, isFetching
  } = useLocalizedView<HomePageViewDataPayload, HomePageViewLabelsBundle>(
    'homePageViewContent',
    fetchHomePageView
  );

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
    <div className="page-container"> {/* Use regular container first */}
      <div className="bamboo-frame"> {/* Wrap content in bamboo-frame */}
        <h2>{pageLabels?.pageTitle || "Dashboard"}</h2>

        <WelcomeSection labels={pageLabels?.welcomeSection} username={pageData?.username} />

        <MoodsSection
          labels={pageLabels?.moodsSection}
          moods={pageData?.moods}
          onRefresh={refetch}
          isFetching={isFetching}
        />

        {/* Example of a page-level button using a page-level label with jade style */}
        {pageLabels?.someActionText && (
          <Button
            variant="jade"
            onClick={() => alert('Action Confirmed!')}
            style={{marginTop: '20px'}}
          >
            {pageLabels.someActionText}
          </Button>
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
    </div>
  );
};
export default HomePage;