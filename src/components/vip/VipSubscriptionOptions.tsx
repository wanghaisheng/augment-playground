import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { updatePandaVipStatus } from '@/services/pandaStateService';
import { activateVipSubscription } from '@/services/storeService';
import { usePandaState } from '@/context/PandaStateProvider';
import { playSound, SoundType, enableSound } from '@/utils/sound';
import SubscriptionRetentionFlow from './SubscriptionRetentionFlow';
import '@/game-theme.css';

interface VipSubscriptionOptionsProps {
  onClose: () => void;
  labels?: any;
}

interface SubscriptionPlan {
  id: string;
  title: string;
  price: string;
  monthlyPrice: string;
  benefits: string[];
  recommended: boolean;
  bestValue: boolean;
}

/**
 * VipSubscriptionOptions Component
 *
 * Displays subscription options for VIP membership with different tiers.
 * Uses luxurious game style with traditional Chinese elements and animations.
 *
 * @param onClose - Function to close the subscription options modal
 */
const VipSubscriptionOptions: React.FC<VipSubscriptionOptionsProps> = ({ onClose }) => {

  const { labels } = useComponentLabels();
  const { refreshState } = usePandaState();
  const [selectedPlan, setSelectedPlan] = useState<string>('seasonal');
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [showRetentionFlow, setShowRetentionFlow] = useState<boolean>(false);

  // Default labels with fallbacks
  const subscriptionLabels = {
    title: labels?.vipSubscription?.title || 'Choose Your Guardian Plan',
    subtitle: labels?.vipSubscription?.subtitle || 'Select the plan that suits you best',
    monthly: {
      title: labels?.vipSubscription?.monthly?.title || 'Monthly Guardian',
      price: labels?.vipSubscription?.monthly?.price || '$9.99',
      monthlyPrice: labels?.vipSubscription?.monthly?.monthlyPrice || '$9.99/month',
      benefits: (labels?.vipSubscription?.monthly?.benefits || 'All Guardian benefits,Monthly exclusive gift,Cancel anytime').split(',')
    },
    seasonal: {
      title: labels?.vipSubscription?.seasonal?.title || 'Seasonal Guardian',
      price: labels?.vipSubscription?.seasonal?.price || '$24.99',
      monthlyPrice: labels?.vipSubscription?.seasonal?.monthlyPrice || '$8.33/month',
      benefits: (labels?.vipSubscription?.seasonal?.benefits || 'All Guardian benefits,Seasonal exclusive gift,Priority support,10% bonus on all rewards').split(',')
    },
    annual: {
      title: labels?.vipSubscription?.annual?.title || 'Annual Guardian',
      price: labels?.vipSubscription?.annual?.price || '$79.99',
      monthlyPrice: labels?.vipSubscription?.annual?.monthlyPrice || '$6.67/month',
      benefits: (labels?.vipSubscription?.annual?.benefits || 'All Guardian benefits,Annual exclusive gift,VIP exclusive panda skin,Priority support,20% bonus on all rewards,Exclusive seasonal events').split(',')
    },
    buttons: {
      subscribe: labels?.vipSubscription?.buttons?.subscribe || 'Subscribe',
      restore: labels?.vipSubscription?.buttons?.restore || 'Restore Purchase',
      cancel: labels?.vipSubscription?.buttons?.cancel || 'Cancel'
    },
    badges: {
      recommended: labels?.vipSubscription?.badges?.recommended || 'RECOMMENDED',
      bestValue: labels?.vipSubscription?.badges?.bestValue || 'BEST VALUE'
    }
  };

  // Subscription plans
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      title: subscriptionLabels.monthly.title,
      price: subscriptionLabels.monthly.price,
      monthlyPrice: subscriptionLabels.monthly.monthlyPrice,
      benefits: subscriptionLabels.monthly.benefits,
      recommended: false,
      bestValue: false
    },
    {
      id: 'seasonal',
      title: subscriptionLabels.seasonal.title,
      price: subscriptionLabels.seasonal.price,
      monthlyPrice: subscriptionLabels.seasonal.monthlyPrice,
      benefits: subscriptionLabels.seasonal.benefits,
      recommended: true,
      bestValue: false
    },
    {
      id: 'annual',
      title: subscriptionLabels.annual.title,
      price: subscriptionLabels.annual.price,
      monthlyPrice: subscriptionLabels.annual.monthlyPrice,
      benefits: subscriptionLabels.annual.benefits,
      recommended: false,
      bestValue: true
    }
  ];

  // Handle subscription plan selection
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    enableSound(); // Enable sound on user interaction
    playSound(SoundType.BUTTON_CLICK);
  };

  // Handle subscription button click
  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);

      // Enable sound and play sound effect
      enableSound(); // Enable sound on user interaction
      playSound(SoundType.SUCCESS);

      // Get subscription details based on selected plan
      let tier = 1;
      let durationDays = 30;

      if (selectedPlan === 'monthly') {
        tier = 1;
        durationDays = 30;
      } else if (selectedPlan === 'seasonal') {
        tier = 2;
        durationDays = 90;
      } else if (selectedPlan === 'annual') {
        tier = 3;
        durationDays = 365;
      }

      // Activate VIP subscription
      const userId = 'current-user'; // In a real app, this would be the actual user ID
      const paymentMethod = 'app_store'; // Payment method

      await activateVipSubscription(userId, tier, durationDays, paymentMethod);

      // Update panda VIP status
      await updatePandaVipStatus(true);

      // Refresh panda state
      await refreshState();

      // Close the modal after subscription
      onClose();
    } catch (error) {
      console.error('Failed to subscribe:', error);
      playSound(SoundType.ERROR);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle restore purchase button click
  const handleRestorePurchase = async () => {
    try {
      setIsSubscribing(true);

      // Enable sound and play sound effect
      enableSound(); // Enable sound on user interaction
      playSound(SoundType.SUCCESS);

      // In a real app, this would check with the app store for previous purchases
      console.log('Checking for previous purchases...');

      // Simulate finding a previous purchase
      const foundPurchase = true;

      if (foundPurchase) {
        // Activate VIP subscription with the found purchase details
        const userId = 'current-user'; // In a real app, this would be the actual user ID
        const tier = 2; // Assuming the user had a seasonal subscription
        const durationDays = 90; // Remaining days from the previous subscription
        const paymentMethod = 'app_store'; // Payment method

        await activateVipSubscription(userId, tier, durationDays, paymentMethod);

        // Update panda VIP status
        await updatePandaVipStatus(true);

        // Refresh panda state
        await refreshState();

        // Close the modal after restore
        onClose();
      } else {
        // No previous purchase found
        alert('No previous purchase found.');
      }
    } catch (error) {
      console.error('Failed to restore purchase:', error);
      playSound(SoundType.ERROR);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <AnimatePresence>
      {showRetentionFlow ? (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SubscriptionRetentionFlow
            userId="current-user"
            onComplete={(retained) => {
              setShowRetentionFlow(false);
              if (!retained) {
                onClose();
              }
            }}
            onClose={() => setShowRetentionFlow(false)}
          />
        </motion.div>
      ) : (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="subscription-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.19, 1.0, 0.22, 1.0] }}
            onClick={(e) => e.stopPropagation()}
          >
          <button className="modal-close-button" onClick={onClose}>×</button>

          <div className="subscription-header">
            <h2>{subscriptionLabels.title}</h2>
            <p>{subscriptionLabels.subtitle}</p>
          </div>

          <div className="subscription-plans">
            {subscriptionPlans.map((plan) => {
              // Calculate savings compared to monthly plan
              let savingsInfo = null;
              if (plan.id !== 'monthly') {
                const monthlyPlan = subscriptionPlans.find(p => p.id === 'monthly');
                if (monthlyPlan) {
                  const monthlyPrice = parseFloat(monthlyPlan.price.replace('$', ''));
                  const planPrice = parseFloat(plan.price.replace('$', ''));
                  const months = plan.id === 'seasonal' ? 3 : 12;
                  const regularPrice = monthlyPrice * months;
                  const savings = regularPrice - planPrice;
                  const savingsPercent = Math.round((savings / regularPrice) * 100);
                  savingsInfo = { amount: savings.toFixed(2), percent: savingsPercent };
                }
              }

              return (
                <motion.div
                  key={plan.id}
                  className={`subscription-plan ${selectedPlan === plan.id ? 'selected' : ''}`}
                  whileHover={{ translateY: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  <div className="plan-header">
                    <h3>{plan.title}</h3>
                    {plan.recommended && (
                      <div className="plan-badge recommended">
                        {subscriptionLabels.badges.recommended}
                      </div>
                    )}
                    {plan.bestValue && (
                      <div className="plan-badge best-value">
                        {subscriptionLabels.badges.bestValue}
                      </div>
                    )}
                  </div>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="monthly-price">
                      {plan.monthlyPrice}
                      {savingsInfo && (
                        <span style={{ display: 'block', color: 'var(--ruyi-green)', marginTop: '4px', fontSize: '0.9rem' }}>
                          Save {savingsInfo.percent}% (${savingsInfo.amount})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="plan-benefits">
                    {plan.benefits.map((benefit, index) => (
                      <div key={index} className="benefit-item">
                        <span className="benefit-check">✓</span>
                        <span className="benefit-text">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="subscription-actions">
            <motion.button
              className="subscription-button"
              onClick={handleSubscribe}
              disabled={isSubscribing}
              whileHover={{ translateY: -3 }}
              whileTap={{ translateY: 1 }}
            >
              {isSubscribing ? 'Processing...' : subscriptionLabels.buttons.subscribe}
            </motion.button>
            <div className="secondary-actions">
              <button
                className="text-button restore-button"
                onClick={handleRestorePurchase}
                disabled={isSubscribing}
              >
                {isSubscribing ? 'Processing...' : subscriptionLabels.buttons.restore}
              </button>
              <button
                className="text-button cancel-button"
                onClick={() => setShowRetentionFlow(true)}
                disabled={isSubscribing}
              >
                {subscriptionLabels.buttons.cancel}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VipSubscriptionOptions;
