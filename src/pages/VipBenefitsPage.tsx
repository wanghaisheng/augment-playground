import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { VipBenefitsPageViewLabelsBundle, Language } from '@/types';
import { fetchVipBenefitsPageView } from '@/services/localizedContentService';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import VipBenefitCard from '@/components/vip/VipBenefitCard';
import VipSubscriptionOptions from '@/components/vip/VipSubscriptionOptions';
import VipHighlightDemo from '@/components/vip/VipHighlightDemo';
import PainPointDemo from '@/components/vip/PainPointDemo';
import VipValueSummary from '@/components/vip/VipValueSummary';
import VipValueModal from '@/components/vip/VipValueModal';
import ResourceShortageDemo from '@/components/vip/ResourceShortageDemo';
import PandaSkinDemo from '@/components/vip/PandaSkinDemo';
import { usePandaState } from '@/context/PandaStateProvider';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import { playSound, SoundType, enableSound } from '@/utils/sound';
import { initializeVipBenefitsLabels } from '@/data/vipBenefitsLabels';
import { VipBenefitsPageSkeleton } from '@/components/skeleton';
import { useAuth } from '@/context/AuthContext';
import '@/game-theme.css';

// VipBenefitsPageLabels interface has been removed as it's not used

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
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const { registerRefreshListener } = useDataRefreshContext();
  const [showSubscriptionOptions, setShowSubscriptionOptions] = useState<boolean>(false);
  const [showVipValueModal, setShowVipValueModal] = useState<boolean>(false);

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
    labels
  } = useLocalizedView<null, VipBenefitsPageViewLabelsBundle>('vipBenefits', fetchVipBenefitsView);

  // Register refresh listener for pandaState and initialize labels
  useEffect(() => {
    // 初始化VIP特权标签
    initializeVipBenefitsLabels();

    const unregister = registerRefreshListener('pandaState', (updatedState) => {
      if (updatedState) {
        refreshState();
      }
    });

    return () => {
      unregister();
    };
  }, [registerRefreshListener, refreshState]);

  // Default labels as fallback
  const defaultLabels: VipBenefitsPageViewLabelsBundle = {
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

  // Combine fetched labels with default labels
  const pageLabels = labels || defaultLabels;

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

  // Handle show VIP value modal
  const handleShowVipValueModal = useCallback(() => {
    playSound(SoundType.CLICK);
    setShowVipValueModal(true);
  }, []);

  if (isLoading) {
    return <VipBenefitsPageSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} title="VIP Benefits Error" onRetry={fetchVipBenefitsView.bind(null, 'en')} />;
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
          {pageLabels.buttons?.back ?? 'Back'}
        </button>
        <h1 className="vip-title">
          {pageLabels.headerTitle ?? 'Become a Panda Guardian'}
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
            ? (pageLabels.alreadyVipMessage ?? 'You are already enjoying all the VIP benefits as a Panda Guardian!')
            : (pageLabels.headerSubtitle ?? 'Unlock exclusive benefits and accelerate your growth')}
        </p>
      </motion.div>

      {/* Benefits Comparison Section */}
      <motion.div
        className="benefits-comparison"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="compare-title">{pageLabels.compareTitle ?? 'Compare Benefits'}</h2>

        <div className="comparison-header">
          <div className="comparison-column-header free">
            <h3>{pageLabels.freeTitle ?? 'Free Panda Friend'}</h3>
          </div>
          <div className="comparison-column-header vip">
            <h3>{pageLabels.vipTitle ?? 'VIP Panda Guardian'}</h3>
          </div>
        </div>

        {/* Identity Benefits */}
        <div className="benefit-category">
          <h4 className="category-title">{pageLabels.benefitCategories?.identity ?? 'Identity'}</h4>
          <VipBenefitCard
            title={pageLabels.benefits?.avatarFrame?.title ?? 'Avatar Frame'}
            freeBenefit={pageLabels.benefits?.avatarFrame?.free ?? 'Basic frame'}
            vipBenefit={pageLabels.benefits?.avatarFrame?.vip ?? 'Dynamic bamboo leaf frame'}
            isVip={pandaState?.isVip || false}
            valueType="items"
            showValueComparison={true}
            valueMultiplier={1.5}
            labels={pageLabels.benefitCardLabels}
          />
          <VipBenefitCard
            title={pageLabels.benefits?.title?.title ?? 'Title Display'}
            freeBenefit={pageLabels.benefits?.title?.free ?? 'None'}
            vipBenefit={pageLabels.benefits?.title?.vip ?? '"Guardian" title next to name'}
            isVip={pandaState?.isVip || false}
            valueType="items"
            showValueComparison={true}
            valueMultiplier={2}
            labels={pageLabels.benefitCardLabels}
          />
        </div>

        {/* Resources Benefits */}
        <div className="benefit-category">
          <h4 className="category-title">{pageLabels.benefitCategories?.resources ?? 'Resources'}</h4>
          <VipBenefitCard
            title={pageLabels.benefits?.bambooReward?.title ?? 'Bamboo Rewards'}
            freeBenefit={pageLabels.benefits?.bambooReward?.free ?? 'Normal (x1)'}
            vipBenefit={pageLabels.benefits?.bambooReward?.vip ?? 'Double (x2)'}
            isVip={pandaState?.isVip || false}
            valueType="currency"
            showValueComparison={true}
            valueMultiplier={2}
            labels={pageLabels.benefitCardLabels}
          />
          <VipBenefitCard
            title={pageLabels.benefits?.growthSpeed?.title ?? 'Panda Growth Speed'}
            freeBenefit={pageLabels.benefits?.growthSpeed?.free ?? 'Normal speed'}
            vipBenefit={pageLabels.benefits?.growthSpeed?.vip ?? '+50% experience'}
            isVip={pandaState?.isVip || false}
            valueType="percentage"
            showValueComparison={true}
            valueMultiplier={1.5}
            labels={pageLabels.benefitCardLabels}
          />
        </div>

        {/* Features Benefits */}
        <div className="benefit-category">
          <h4 className="category-title">{pageLabels.benefitCategories?.features ?? 'Features'}</h4>
          <VipBenefitCard
            title={pageLabels.benefits?.luckyDraw?.title ?? 'Daily Lucky Draw'}
            freeBenefit={pageLabels.benefits?.luckyDraw?.free ?? '1 time'}
            vipBenefit={pageLabels.benefits?.luckyDraw?.vip ?? '3 times'}
            isVip={pandaState?.isVip || false}
            valueType="multiplier"
            showValueComparison={true}
            valueMultiplier={3}
            labels={pageLabels.benefitCardLabels}
          />
          <VipBenefitCard
            title={pageLabels.benefits?.customGoals?.title ?? 'Custom Goals'}
            freeBenefit={pageLabels.benefits?.customGoals?.free ?? '1 goal'}
            vipBenefit={pageLabels.benefits?.customGoals?.vip ?? '5 goals'}
            isVip={pandaState?.isVip || false}
            valueType="items"
            showValueComparison={true}
            valueMultiplier={5}
            labels={pageLabels.benefitCardLabels}
          />
        </div>

        {/* Exclusive Content Benefits */}
        <div className="benefit-category">
          <h4 className="category-title">{pageLabels.benefitCategories?.exclusive ?? 'Exclusive Content'}</h4>
          <VipBenefitCard
            title={pageLabels.benefits?.pandaSkins?.title ?? 'Panda Appearances'}
            freeBenefit={pageLabels.benefits?.pandaSkins?.free ?? 'Basic skins'}
            vipBenefit={pageLabels.benefits?.pandaSkins?.vip ?? 'Exclusive VIP skins'}
            isVip={pandaState?.isVip || false}
            valueType="items"
            showValueComparison={true}
            valueMultiplier={10}
            labels={pageLabels.benefitCardLabels}
          />
          <VipBenefitCard
            title={pageLabels.benefits?.specialTasks?.title ?? 'Special Quests'}
            freeBenefit={pageLabels.benefits?.specialTasks?.free ?? 'None'}
            vipBenefit={pageLabels.benefits?.specialTasks?.vip ?? 'Exclusive "Secret Garden" series'}
            isVip={pandaState?.isVip || false}
            valueType="feature"
            showValueComparison={false}
            labels={pageLabels.benefitCardLabels}
          />
          <VipBenefitCard
            title={pageLabels.benefits?.meditation?.title ?? 'Meditation Courses'}
            freeBenefit={pageLabels.benefits?.meditation?.free ?? 'Basic courses'}
            vipBenefit={pageLabels.benefits?.meditation?.vip ?? 'All premium courses'}
            isVip={pandaState?.isVip || false}
            valueType="feature"
            showValueComparison={false}
            labels={pageLabels.benefitCardLabels}
          />
        </div>
      </motion.div>

      {/* VIP Value Summary */}
      <motion.div
        className="vip-value-section max-w-4xl mx-auto mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gold-200 p-4">
          <VipValueSummary
            userId="current-user"
            onViewDetails={handleShowVipValueModal}
            className="mb-4"
          />

          <div className="text-center">
            <button
              className="text-gold-600 text-sm font-medium hover:text-gold-700 focus:outline-none"
              onClick={handleShowVipValueModal}
            >
              查看详细价值分析
            </button>
          </div>
        </div>
      </motion.div>

      {/* Call to Action / Subscription Options */}
      {!pandaState?.isVip && !showSubscriptionOptions && (
      <motion.div
          className="cta-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button
            className="subscribe-button primary-button jade-variant-button"
          onClick={handleSubscribeClick}
        >
            {pageLabels.buttons?.subscribe ?? 'Become a Guardian'}
        </button>
      </motion.div>
      )}

      {showSubscriptionOptions && (
        <VipSubscriptionOptions
          onClose={() => setShowSubscriptionOptions(false)}
          labels={pageLabels.vipSubscriptionOptionsLabels} // This label bundle needs to be defined in types
        />
      )}

      {/* VIP高光时刻演示 - 仅在开发环境中显示 */}
      {import.meta.env.DEV && (
        <div className="mt-8 max-w-4xl mx-auto">
          <VipHighlightDemo />
        </div>
      )}

      {/* 痛点解决方案演示 - 仅在开发环境中显示 */}
      {import.meta.env.DEV && (
        <div className="mt-8 max-w-4xl mx-auto">
          <PainPointDemo />
        </div>
      )}

      {/* 资源不足提示演示 - 仅在开发环境中显示 */}
      {import.meta.env.DEV && (
        <div className="mt-8 max-w-4xl mx-auto">
          <ResourceShortageDemo />
        </div>
      )}

      {/* 熊猫皮肤演示 - 仅在开发环境中显示 */}
      {import.meta.env.DEV && (
        <div className="mt-8 max-w-4xl mx-auto">
          <PandaSkinDemo />
        </div>
      )}

      {/* VIP价值模态框 */}
      <VipValueModal
        isOpen={showVipValueModal}
        onClose={() => setShowVipValueModal(false)}
        userId={userId || ''}
        isVip={pandaState?.isVip || false}
        labels={pageLabels.vipValueModalLabels}
      />
    </div>
  );
};

export default VipBenefitsPage;

