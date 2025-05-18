// src/pages/TeaRoomPage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReflectionTriggerRecord,
  ReflectionTriggerType,
  createReflectionTrigger
} from '@/services/reflectionService';
import Button from '@/components/common/Button';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import EnhancedReflectionModule from '@/components/reflection/EnhancedReflectionModule';
import ReflectionHistory from '@/components/reflection/ReflectionHistory';
import MoodTracker from '@/components/reflection/MoodTracker';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchTeaRoomPageView } from '@/services';
import type { TeaRoomPageViewLabelsBundle } from '@/types';
import { pageTransition } from '@/utils/animation';
import ReflectionTriggerNotification from '@/components/reflection/ReflectionTriggerNotification';
import { playSound, SoundType } from '@/utils/sound';
import { TeaRoomPageSkeleton } from '@/components/skeleton';
import { useNavigate } from 'react-router-dom';

/**
 * Tea Room Page
 * Provides reflection, mood tracking, and supportive feedback
 */
const TeaRoomPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReflectionModule, setShowReflectionModule] = useState(false);
  const [showReflectionHistory, setShowReflectionHistory] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<ReflectionTriggerRecord | null>(null);
  const _navigate = useNavigate();

  // Current user ID (in a real application, this should be retrieved from the user session)
  const userId = 'current-user';

  // Get localized labels
  const {
    labels: pageLabels,
    isPending: isLabelsPending,
    isError: isLabelsError,
    error: labelsError,
    refetch: refetchLabels
  } = useLocalizedView<null, TeaRoomPageViewLabelsBundle>(
    'teaRoomPageViewContent',
    fetchTeaRoomPageView
  );

  // Load page data
  const loadPageData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load other data here

    } catch (err) {
      console.error('Failed to load tea room data:', err);
      setError('Failed to load data, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial loading
  useEffect(() => {
    loadPageData();
  }, []);

  // Register data refresh listeners
  useRegisterTableRefresh('reflections', loadPageData);
  useRegisterTableRefresh('reflectionTriggers', loadPageData);
  useRegisterTableRefresh('moods', loadPageData);

  // Handle start reflection
  const handleStartReflection = () => {
    // Play click sound
    playSound(SoundType.BUTTON_CLICK, 0.5);

    // Create manual trigger record
    createReflectionTrigger({
      userId,
      type: ReflectionTriggerType.MANUAL
    });

    // Show reflection module
    setShowReflectionModule(true);
  };

  // Handle view history
  const handleViewHistory = () => {
    // Play click sound
    playSound(SoundType.BUTTON_CLICK, 0.5);

    // Show reflection history
    setShowReflectionHistory(true);
  };

  // Handle navigate to meditation page - Commented out as it's not used
  // const handleNavigateToMeditation = () => {
  //   // Play click sound
  //   playSound(SoundType.BUTTON_CLICK, 0.5);
  //
  //   // Navigate to meditation page
  //   navigate('/meditation');
  // };

  // Handle trigger accepted
  const handleTriggerAccepted = (trigger: ReflectionTriggerRecord) => {
    setSelectedTrigger(trigger);
    setShowReflectionModule(true);
  };

  // Handle reflection complete
  const handleReflectionComplete = () => {
    // Reset selected trigger
    setSelectedTrigger(null);

    // Reload page data
    loadPageData();
  };

  // Render page content
  const renderPageContent = () => {
    return (
      <div className="tea-room-content">
        <div className="bamboo-frame">
          <h2>{pageLabels?.pageTitle || "Tea Room"}</h2>
          <p className="text-gray-600 mb-6">
            {pageLabels?.reflectionSection?.description || "Take some time to reflect on your experiences, feelings, and thoughts to better understand yourself and find direction."}
          </p>

          <div className="tea-room-sections grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mood Tracking Section */}
            <div className="mood-tracking-section bg-white p-4 rounded-lg shadow-md border-l-4 border-jade-500">
              <h2 className="text-xl font-bold text-jade-700 mb-4">
                <span className="mr-2">🍵</span>
                {pageLabels?.moodTrackingSection?.title || "Mood Tracking"}
              </h2>
              <MoodTracker
              labels={pageLabels?.moodTrackingSection}
            />
            </div>

            {/* Reflection Section */}
            <div className="reflection-section bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500">
              <h2 className="text-xl font-bold text-amber-700 mb-4">
                <span className="mr-2">🪷</span>
                {pageLabels?.reflectionSection?.title || "Reflection"}
              </h2>
              <p className="text-gray-600 mb-4">
                {pageLabels?.reflectionSection?.description || "Taking time to reflect on your experiences, feelings, and thoughts can help you better understand yourself and find direction."}
              </p>
              <div className="reflection-actions flex flex-col gap-2">
                <Button
                  variant="jade"
                  onClick={handleStartReflection}
                  className="w-full"
                >
                  {pageLabels?.reflectionSection?.startReflectionButton || "Start Reflection"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleViewHistory}
                  className="w-full"
                >
                  {pageLabels?.reflectionSection?.viewHistoryButton || "View History"}
                </Button>
              </div>
            </div>
          </div>

          {/* Meditation Section - Commenting out due to incorrect label structure */}
          {/*
          <CollapsibleSection
            title={pageLabels?.meditationSection?.title || "Meditation"}
            defaultOpen={true}
          >
            <p className="text-gray-600 mb-4">
              {pageLabels?.meditationSection?.description || "Explore our collection of guided meditations to help you relax, focus, and find inner peace."}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="p-3 bg-jade-50 rounded-lg">
                <p className="text-gray-500">
                  <span className="font-medium">🔄 {pageLabels?.meditationSection?.currentStreak || "Current Streak"}:</span> {mockMeditationStats.currentStreak} {pageLabels?.meditationSection?.days || "days"}
                </p>
              </div>
              <div className="p-3 bg-jade-50 rounded-lg">
                <p className="text-gray-500">
                  <span className="font-medium">⏱️ {pageLabels?.meditationSection?.totalTime || "Total Time"}:</span> {mockMeditationStats.totalTime} {pageLabels?.meditationSection?.minutes || "minutes"}
                </p>
              </div>
            </div>
            <AnimatedButton
              variant="outline"
              color="jade"
              onClick={() => navigate('/meditation')}
            >
              {pageLabels?.meditationSection?.exploreButton || "Explore Meditations"}
            </AnimatedButton>
          </CollapsibleSection>
          */}

          {/* Daily Tips Section */}
          <div className="daily-tips-section bg-white p-4 rounded-lg shadow-md mt-6 border border-amber-200">
            <h2 className="text-xl font-bold text-amber-700 mb-4">
              <span className="mr-2">💡</span>
              {pageLabels?.dailyTipSection?.title || "Daily Wisdom"}
            </h2>
            <div className="daily-tip p-3 bg-amber-50 rounded-lg">
              <div className="flex items-start">
                <div className="tip-icon mr-3">
                  <span className="text-2xl">🎋</span>
                </div>
                <div className="tip-content">
                  <p className="text-gray-700">
                    {pageLabels?.dailyTipSection?.content || "Self-compassion is an essential part of mental health. When facing difficulties, try to treat yourself as you would a good friend, with understanding and kindness."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reflection Module */}
        {showReflectionModule && (
          <EnhancedReflectionModule
            isOpen={showReflectionModule}
            onClose={() => setShowReflectionModule(false)}
            trigger={selectedTrigger || undefined}
            onReflectionComplete={handleReflectionComplete}
            labels={pageLabels?.enhancedReflectionModule}
          />
        )}

        {/* Reflection History */}
        {showReflectionHistory && (
          <ReflectionHistory
            isOpen={showReflectionHistory}
            onClose={() => setShowReflectionHistory(false)}
          />
        )}

        {/* Reflection Trigger Notification */}
        <ReflectionTriggerNotification
          onTriggerAccepted={handleTriggerAccepted}
          labels={pageLabels?.reflectionTriggers}
        />
      </div>
    );
  };

  // Show loading state
  if (isLabelsPending && !pageLabels) {
    return (
      <motion.div
        className="page-container"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="bamboo-frame">
          <TeaRoomPageSkeleton />
        </div>
      </motion.div>
    );
  }

  // Show error state
  if (isLabelsError && !pageLabels) {
    return (
      <motion.div
        className="page-container"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="error-container text-center p-4">
          <ErrorDisplay
            error={labelsError}
            title="Tea Room Page Error"
            onRetry={refetchLabels}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="page-container">
      {isLoading ? (
        <TeaRoomPageSkeleton />
      ) : error ? (
        <div className="error-container text-center p-4">
          <div className="error-message text-red-500 mb-4">{error}</div>
          <Button variant="jade" onClick={loadPageData}>
            {pageLabels?.retryButtonText || "Retry"}
          </Button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {renderPageContent()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default TeaRoomPage;
