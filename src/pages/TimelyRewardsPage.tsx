// src/pages/TimelyRewardsPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TimelyRewardStatus,
  TimelyRewardType,
  initializeTimelyRewards
} from '@/services/timelyRewardService';
import TimelyRewardList from '@/components/game/TimelyRewardList';
import LuckyDraw from '@/components/game/LuckyDraw';
import PageTransition from '@/components/animation/PageTransition';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import AnimatedButton from '@/components/animation/AnimatedButton';
import ScrollDialog from '@/components/game/ScrollDialog';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { fetchTimelyRewardsPageView } from '@/services';
import { TimelyRewardsPageSkeleton } from '@/components/skeleton';
import type { TimelyRewardsPageViewLabelsBundle } from '@/types';

/**
 * Timely Rewards Page
 * Displays timely rewards list and lucky draw
 */
const TimelyRewardsPage: React.FC = () => {
  const [filter, setFilter] = useState<{
    status?: TimelyRewardStatus;
    type?: TimelyRewardType;
  }>({
    status: TimelyRewardStatus.ACTIVE
  });
  const [showLuckyDraw, setShowLuckyDraw] = useState(false);

  const {
    labels: pageLabels,
    isPending,
    isError,
    error,
    refetch
  } = useLocalizedView<null, TimelyRewardsPageViewLabelsBundle>(
    'timelyRewardsPageViewContent',
    fetchTimelyRewardsPageView
  );

  // Initialize timely rewards
  useEffect(() => {
    initializeTimelyRewards();
  }, []);

  // Handle status filter
  const handleStatusFilter = (status?: TimelyRewardStatus) => {
    setFilter(prev => ({ ...prev, status }));
  };

  // Handle type filter
  const handleTypeFilter = (type?: TimelyRewardType) => {
    setFilter(prev => ({ ...prev, type }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilter({});
  };

  // Open lucky draw
  const openLuckyDraw = () => {
    setShowLuckyDraw(true);
  };

  // Close lucky draw
  const closeLuckyDraw = () => {
    setShowLuckyDraw(false);
  };

  if (isPending && !pageLabels) { // Full page initial loading
    return (
      <PageTransition>
        <TimelyRewardsPageSkeleton />
      </PageTransition>
    );
  }

  if (isError && !pageLabels) { // Critical error: page labels failed to load
    return (
      <div className="page-content">
        <ErrorDisplay error={error} title={pageLabels?.errorTitle || "Timely Rewards Page Error"} onRetry={refetch} />
      </div>
    );
  }

  return (
    <PageTransition>
      <motion.div
        className="timely-rewards-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="page-header">
          <h1 className="page-title">{pageLabels?.pageTitle || 'Timely Rewards'}</h1>
          <AnimatedButton
            onClick={openLuckyDraw}
            className="lucky-draw-button"
          >
            {pageLabels?.luckyDraw?.buttonText || 'Lucky Draw'}
          </AnimatedButton>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <h3 className="filter-title">{pageLabels?.filters?.statusSectionTitle || 'Status'}</h3>
            <div className="filter-buttons">
              <AnimatedButton
                onClick={() => handleStatusFilter(undefined)}
                className={!filter.status ? 'active' : ''}
              >
                {pageLabels?.filters?.allLabel || 'All'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(TimelyRewardStatus.ACTIVE)}
                className={filter.status === TimelyRewardStatus.ACTIVE ? 'active' : ''}
              >
                {pageLabels?.filters?.activeLabel || 'Active'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(TimelyRewardStatus.COMPLETED)}
                className={filter.status === TimelyRewardStatus.COMPLETED ? 'active' : ''}
              >
                {pageLabels?.filters?.completedLabel || 'Completed'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(TimelyRewardStatus.UPCOMING)}
                className={filter.status === TimelyRewardStatus.UPCOMING ? 'active' : ''}
              >
                {pageLabels?.filters?.upcomingLabel || 'Upcoming'}
              </AnimatedButton>
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">{pageLabels?.filters?.typeAllLabel || 'Type'}</h3>
            <div className="filter-buttons">
              <AnimatedButton
                onClick={() => handleTypeFilter(undefined)}
                className={!filter.type ? 'active' : ''}
              >
                {pageLabels?.filters?.typeAllLabel || 'All'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(TimelyRewardType.DAILY)}
                className={filter.type === TimelyRewardType.DAILY ? 'active' : ''}
              >
                {pageLabels?.filters?.typeDailyLabel || 'Daily Reward'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(TimelyRewardType.MORNING)}
                className={filter.type === TimelyRewardType.MORNING ? 'active' : ''}
              >
                {pageLabels?.filters?.typeMorningLabel || 'Early Bird Reward'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(TimelyRewardType.STREAK)}
                className={filter.type === TimelyRewardType.STREAK ? 'active' : ''}
              >
                {pageLabels?.filters?.typeStreakLabel || 'Streak Reward'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(TimelyRewardType.SPECIAL)}
                className={filter.type === TimelyRewardType.SPECIAL ? 'active' : ''}
              >
                {pageLabels?.filters?.typeSpecialLabel || 'Special Reward'}
              </AnimatedButton>
            </div>
          </div>

          <div className="filter-actions">
            <AnimatedButton onClick={clearAllFilters} className="clear-filters-button">
              {pageLabels?.filters?.clearFiltersLabel || 'Clear All Filters'}
            </AnimatedButton>
          </div>
        </div>

        <div className="rewards-container">
          <TimelyRewardList
            filter={filter}
            labels={pageLabels?.rewardCard}
          />
        </div>

        {/* Lucky Draw Modal */}
        {showLuckyDraw && (
          <ScrollDialog
            isOpen={showLuckyDraw}
            title={pageLabels?.luckyDraw?.title || 'Lucky Draw'}
            onClose={closeLuckyDraw}
          >
            <div className="lucky-draw-dialog">
              <LuckyDraw onClose={closeLuckyDraw} />
            </div>
          </ScrollDialog>
        )}
      </motion.div>
    </PageTransition>
  );
};

export default TimelyRewardsPage;
