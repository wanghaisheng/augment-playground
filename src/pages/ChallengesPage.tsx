// src/pages/ChallengesPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChallengeStatus,
  ChallengeType,
  ChallengeDifficulty,
  initializeChallengeCategories,
  generateTestChallengeData
} from '@/services/challengeService';
import ChallengeList from '@/components/game/ChallengeList';
import PageTransition from '@/components/animation/PageTransition';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import AnimatedButton from '@/components/animation/AnimatedButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { fetchChallengesPageView } from '@/services';
import { ChallengesPageSkeleton } from '@/components/skeleton';
import type { ChallengesPageViewLabelsBundle } from '@/types';

/**
 * Challenges Page
 * Displays challenge list and filter options
 */
const ChallengesPage: React.FC = () => {
  const [filter, setFilter] = useState<{
    status?: ChallengeStatus;
    type?: ChallengeType;
    difficulty?: ChallengeDifficulty;
  }>({
    status: ChallengeStatus.ACTIVE
  });

  const [isGeneratingData, setIsGeneratingData] = useState(false);

  const {
    labels: pageLabels,
    isPending,
    isError,
    error,
    refetch
  } = useLocalizedView<null, ChallengesPageViewLabelsBundle>(
    'challengesPageViewContent',
    fetchChallengesPageView
  );

  // Initialize challenge categories
  useEffect(() => {
    initializeChallengeCategories();
  }, []);

  // Handle status filter
  const handleStatusFilter = (status?: ChallengeStatus) => {
    setFilter(prev => ({ ...prev, status }));
  };

  // Handle type filter
  const handleTypeFilter = (type?: ChallengeType) => {
    setFilter(prev => ({ ...prev, type }));
  };

  // Handle difficulty filter
  const handleDifficultyFilter = (difficulty?: ChallengeDifficulty) => {
    setFilter(prev => ({ ...prev, difficulty }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilter({});
  };

  // Generate test data
  const handleGenerateTestData = async () => {
    try {
      setIsGeneratingData(true);
      await generateTestChallengeData();
      // Refresh the page to show new data
      window.location.reload();
    } catch (error) {
      console.error('Error generating test data:', error);
    } finally {
      setIsGeneratingData(false);
    }
  };

  // Show loading state
  if (isPending) {
    return (
      <PageTransition>
        <div className="challenges-page">
          <ChallengesPageSkeleton />
        </div>
      </PageTransition>
    );
  }

  // Show error state
  if (isError) {
    return (
      <PageTransition>
        <div className="challenges-page">
          <ErrorDisplay
            error={error}
            title={pageLabels?.errorTitle || "Challenge Page Error"}
            messageTemplate={pageLabels?.errorMessage || "Failed to load challenges: {message}"}
            onRetry={refetch}
            retryButtonText={pageLabels?.retryButtonText || "Retry"}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <motion.div
        className="challenges-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="page-header">
          <h1 className="page-title">{pageLabels?.pageTitle || 'Challenges'}</h1>
          <button
            className="generate-test-data-button"
            onClick={handleGenerateTestData}
            disabled={isGeneratingData}
          >
            {isGeneratingData ? 'Generating...' : 'Generate Test Data'}
          </button>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <h3 className="filter-title">{pageLabels?.statusFilterLabel || 'Status'}</h3>
            <div className="filter-buttons">
              <AnimatedButton
                onClick={() => handleStatusFilter(undefined)}
                className={!filter.status ? 'active' : ''}
              >
                {pageLabels?.filters?.allLabel || 'All'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(ChallengeStatus.ACTIVE)}
                className={filter.status === ChallengeStatus.ACTIVE ? 'active' : ''}
              >
                {pageLabels?.filters?.activeLabel || 'Active'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(ChallengeStatus.COMPLETED)}
                className={filter.status === ChallengeStatus.COMPLETED ? 'active' : ''}
              >
                {pageLabels?.filters?.completedLabel || 'Completed'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(ChallengeStatus.UPCOMING)}
                className={filter.status === ChallengeStatus.UPCOMING ? 'active' : ''}
              >
                {pageLabels?.filters?.upcomingLabel || 'Upcoming'}
              </AnimatedButton>
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">{pageLabels?.typeFilterLabel || 'Type'}</h3>
            <div className="filter-buttons">
              <AnimatedButton
                onClick={() => handleTypeFilter(undefined)}
                className={!filter.type ? 'active' : ''}
              >
                {pageLabels?.filters?.typeAllLabel || 'All'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(ChallengeType.DAILY)}
                className={filter.type === ChallengeType.DAILY ? 'active' : ''}
              >
                {pageLabels?.filters?.typeDailyLabel || 'Daily'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(ChallengeType.WEEKLY)}
                className={filter.type === ChallengeType.WEEKLY ? 'active' : ''}
              >
                {pageLabels?.filters?.typeWeeklyLabel || 'Weekly'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(ChallengeType.EVENT)}
                className={filter.type === ChallengeType.EVENT ? 'active' : ''}
              >
                {pageLabels?.filters?.typeEventLabel || 'Event'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(ChallengeType.ONGOING)}
                className={filter.type === ChallengeType.ONGOING ? 'active' : ''}
              >
                {pageLabels?.filters?.typeOngoingLabel || 'Ongoing'}
              </AnimatedButton>
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">{pageLabels?.difficultyFilterLabel || 'Difficulty'}</h3>
            <div className="filter-buttons">
              <AnimatedButton
                onClick={() => handleDifficultyFilter(undefined)}
                className={!filter.difficulty ? 'active' : ''}
              >
                {pageLabels?.filters?.difficultyAllLabel || 'All'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleDifficultyFilter(ChallengeDifficulty.EASY)}
                className={filter.difficulty === ChallengeDifficulty.EASY ? 'active' : ''}
              >
                {pageLabels?.filters?.difficultyEasyLabel || 'Easy'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleDifficultyFilter(ChallengeDifficulty.MEDIUM)}
                className={filter.difficulty === ChallengeDifficulty.MEDIUM ? 'active' : ''}
              >
                {pageLabels?.filters?.difficultyMediumLabel || 'Medium'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleDifficultyFilter(ChallengeDifficulty.HARD)}
                className={filter.difficulty === ChallengeDifficulty.HARD ? 'active' : ''}
              >
                {pageLabels?.filters?.difficultyHardLabel || 'Hard'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleDifficultyFilter(ChallengeDifficulty.EXPERT)}
                className={filter.difficulty === ChallengeDifficulty.EXPERT ? 'active' : ''}
              >
                {pageLabels?.filters?.difficultyExpertLabel || 'Expert'}
              </AnimatedButton>
            </div>
          </div>

          <div className="filter-actions">
            <AnimatedButton onClick={clearAllFilters} className="clear-filters-button">
              {pageLabels?.filters?.clearFiltersLabel || 'Clear All Filters'}
            </AnimatedButton>
          </div>
        </div>

        <div className="challenges-container">
          <ChallengeList
            filter={filter}
            labels={{
              ...pageLabels?.challengeCard,
              statusLabel: pageLabels?.statusFilterLabel,
              typeLabel: pageLabels?.typeFilterLabel,
              difficultyLabel: pageLabels?.difficultyFilterLabel,
              noItemsMessage: pageLabels?.noChallengesMessage
            }}
          />
        </div>
      </motion.div>
    </PageTransition>
  );
};

export default ChallengesPage;
