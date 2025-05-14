import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { VipBenefitsPageViewLabelsBundle, Language } from '@/types';
import { fetchVipBenefitsPageView } from '@/services/localizedContentService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import VipBenefitCard from '@/components/vip/VipBenefitCard';
import VipSubscriptionOptions from '@/components/vip/VipSubscriptionOptions';
import { usePandaState } from '@/context/PandaStateProvider';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import { playSound, SoundType, enableSound } from '@/utils/sound';
import '@/game-theme.css';

/**
 * VIP Benefits Overview Page
 *
 * This page displays the benefits of VIP subscription with a clear comparison
 * between free and VIP features. It follows the luxurious game style design
 * with traditional Chinese elements and animations.
 */
const VipBenefitsPage: React.FC = () => {
  const navigate = useNavigate();
  const { pandaState, refreshState } = usePandaState();
  const { registerRefreshListener } = useDataRefreshContext();
  const [showSubscriptionOptions, setShowSubscriptionOptions] = useState<boolean>(false);

  // Function to fetch localized content for VIP benefits page
  const fetchVipBenefitsView = useCallback(async (lang: Language) => {
    try {
      return await fetchVipBenefitsPageView(lang);
    } catch (error) {
      console.error('Error fetching VIP benefits view:', error);
      throw error;
    }
  }, []);

  // Fetch localized content for the VIP benefits page
  const {
    isLoading,
    error,
    data: viewData
  } = useLocalizedView<unknown, VipBenefitsPageViewLabelsBundle>('vipBenefits', fetchVipBenefitsView);

  // Register refresh listener for pandaState
  useEffect(() => {
    const unregister = registerRefreshListener('pandaState', (updatedState) => {
      if (updatedState) {
        refreshState();
      }
    });

    return () => {
      unregister();
    };
  }, [registerRefreshListener, refreshState]);

  // Labels with fallbacks
  const labels: VipBenefitsPageViewLabelsBundle = viewData?.labels || {
    pageTitle: 'VIP Benefits',
    headerTitle: 'Become a Panda Guardian',
    headerSubtitle: 'Unlock exclusive benefits and accelerate your growth',
    alreadyVipMessage: 'You are already enjoying all the VIP benefits as a Panda Guardian!',
    compareTitle: 'Compare Benefits',
    freeTitle: 'Free Panda Friend',
    vipTitle: 'VIP Panda Guardian',
    benefitCategories: {
      identity: 'Identity',
      resources: 'Resources',
      features: 'Features',
      exclusive: 'Exclusive Content'
    },
    benefits: {
      avatarFrame: {
        title: 'Avatar Frame',
        free: 'Basic frame',
        vip: 'Dynamic bamboo leaf frame'
      },
      title: {
        title: 'Title Display',
        free: 'None',
        vip: '"Guardian" title next to name'
      },
      bambooReward: {
        title: 'Bamboo Rewards',
        free: 'Normal (x1)',
        vip: 'Double (x2)'
      },
      growthSpeed: {
        title: 'Panda Growth Speed',
        free: 'Normal speed',
        vip: '+50% experience'
      },
      luckyDraw: {
        title: 'Daily Lucky Draw',
        free: '1 time',
        vip: '3 times'
      },
      customGoals: {
        title: 'Custom Goals',
        free: '1 goal',
        vip: '5 goals'
      },
      pandaSkins: {
        title: 'Panda Appearances',
        free: 'Basic skins',
        vip: 'Exclusive VIP skins'
      },
      specialTasks: {
        title: 'Special Quests',
        free: 'None',
        vip: 'Exclusive "Secret Garden" series'
      },
      meditation: {
        title: 'Meditation Courses',
        free: 'Basic courses',
        vip: 'All premium courses'
      }
    },
    buttons: {
      subscribe: 'Become a Guardian',
      viewOptions: 'View Subscription Options',
      back: 'Back'
    }
  };

  // Handle subscription button click
  const handleSubscribeClick = useCallback(() => {
    // Enable sound on user interaction
    enableSound();

    if (pandaState?.isVip) {
      // Already a VIP, show a message or navigate to a different page
      playSound(SoundType.SUCCESS);
      alert('You are already a VIP member!');
    } else {
      setShowSubscriptionOptions(true);
    }
  }, [pandaState?.isVip]);

  // Handle back button click
  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} errorType="generic" />;
  }

  return (
    <div className="vip-benefits-page">
      {/* Header Section */}
      <motion.div
        className="vip-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className="back-button jade-button"
          onClick={handleBackClick}
        >
          {labels.buttons.back}
        </button>
        <h1 className="vip-title">
          {labels.headerTitle}
          {pandaState?.isVip && (
            <motion.span
              className="vip-badge-header"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              VIP
            </motion.span>
          )}
        </h1>
        <p className="vip-subtitle">
          {pandaState?.isVip
            ? labels.alreadyVipMessage || 'You are already enjoying all the VIP benefits as a Panda Guardian!'
            : labels.headerSubtitle}
        </p>
      </motion.div>

      {/* Benefits Comparison Section */}
      <motion.div
        className="benefits-comparison"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="compare-title">{labels.compareTitle}</h2>

        <div className="comparison-header">
          <div className="comparison-column-header free">
            <h3>{labels.freeTitle}</h3>
          </div>
          <div className="comparison-column-header vip">
            <h3>{labels.vipTitle}</h3>
          </div>
        </div>

        {/* Identity Benefits */}
        <div className="benefit-category">
          <h4 className="category-title">{labels.benefitCategories.identity}</h4>
          <VipBenefitCard
            title={labels.benefits.avatarFrame.title}
            freeBenefit={labels.benefits.avatarFrame.free}
            vipBenefit={labels.benefits.avatarFrame.vip}
            isVip={pandaState?.isVip || false}
          />
          <VipBenefitCard
            title={labels.benefits.title.title}
            freeBenefit={labels.benefits.title.free}
            vipBenefit={labels.benefits.title.vip}
            isVip={pandaState?.isVip || false}
          />
        </div>

        {/* Resources Benefits */}
        <div className="benefit-category">
          <h4 className="category-title">{labels.benefitCategories.resources}</h4>
          <VipBenefitCard
            title={labels.benefits.bambooReward.title}
            freeBenefit={labels.benefits.bambooReward.free}
            vipBenefit={labels.benefits.bambooReward.vip}
            isVip={pandaState?.isVip || false}
          />
          <VipBenefitCard
            title={labels.benefits.growthSpeed.title}
            freeBenefit={labels.benefits.growthSpeed.free}
            vipBenefit={labels.benefits.growthSpeed.vip}
            isVip={pandaState?.isVip || false}
          />
        </div>

        {/* Features Benefits */}
        <div className="benefit-category">
          <h4 className="category-title">{labels.benefitCategories.features}</h4>
          <VipBenefitCard
            title={labels.benefits.luckyDraw.title}
            freeBenefit={labels.benefits.luckyDraw.free}
            vipBenefit={labels.benefits.luckyDraw.vip}
            isVip={pandaState?.isVip || false}
          />
          <VipBenefitCard
            title={labels.benefits.customGoals.title}
            freeBenefit={labels.benefits.customGoals.free}
            vipBenefit={labels.benefits.customGoals.vip}
            isVip={pandaState?.isVip || false}
          />
        </div>

        {/* Exclusive Content Benefits */}
        <div className="benefit-category">
          <h4 className="category-title">{labels.benefitCategories.exclusive}</h4>
          <VipBenefitCard
            title={labels.benefits.pandaSkins.title}
            freeBenefit={labels.benefits.pandaSkins.free}
            vipBenefit={labels.benefits.pandaSkins.vip}
            isVip={pandaState?.isVip || false}
          />
          <VipBenefitCard
            title={labels.benefits.specialTasks.title}
            freeBenefit={labels.benefits.specialTasks.free}
            vipBenefit={labels.benefits.specialTasks.vip}
            isVip={pandaState?.isVip || false}
          />
          <VipBenefitCard
            title={labels.benefits.meditation.title}
            freeBenefit={labels.benefits.meditation.free}
            vipBenefit={labels.benefits.meditation.vip}
            isVip={pandaState?.isVip || false}
          />
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="vip-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button
          className="gold-button subscribe-button"
          onClick={handleSubscribeClick}
          disabled={pandaState?.isVip}
        >
          {pandaState?.isVip ? 'Already a Guardian' : labels.buttons.subscribe}
        </button>
      </motion.div>

      {/* Subscription Options Modal */}
      {showSubscriptionOptions && (
        <VipSubscriptionOptions
          onClose={() => setShowSubscriptionOptions(false)}
        />
      )}
    </div>
  );
};

export default VipBenefitsPage;
