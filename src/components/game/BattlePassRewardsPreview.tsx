// src/components/game/BattlePassRewardsPreview.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BattlePassLevelWithRewards } from '@/types/battle-pass';

/**
 * Props for the BattlePassRewardsPreview component
 */
export interface BattlePassRewardsPreviewProps {
  /** Array of battle pass levels with rewards */
  levels: BattlePassLevelWithRewards[];
  /** Whether the user has purchased the premium pass */
  hasPremiumPass: boolean;
  /** Localized labels for the component */
  labels: {
    /** Title for the rewards preview */
    rewardsPreviewTitle?: string;
    /** Label for free rewards */
    freeRewardsLabel?: string;
    /** Label for premium rewards */
    premiumRewardsLabel?: string;
    /** Label for premium locked */
    premiumLockedLabel?: string;
    /** Label for close button */
    closeButtonLabel?: string;
  };
}

/**
 * Battle Pass Rewards Preview Component
 * Displays a preview of all rewards available in the battle pass
 */
const BattlePassRewardsPreview: React.FC<BattlePassRewardsPreviewProps> = ({
  levels,
  hasPremiumPass,
  labels
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free');

  // Default labels
  const rewardsPreviewTitle = labels.rewardsPreviewTitle || 'Rewards Preview';
  const freeRewardsLabel = labels.freeRewardsLabel || 'Free Rewards';
  const premiumRewardsLabel = labels.premiumRewardsLabel || 'Premium Rewards';
  const premiumLockedLabel = labels.premiumLockedLabel || 'Premium Pass Required';
  const closeButtonLabel = labels.closeButtonLabel || 'Close';

  // Filter rewards based on active tab
  const filteredRewards = levels
    .filter(level => {
      if (activeTab === 'free') {
        return level.freeReward;
      } else {
        return level.paidReward;
      }
    })
    .map(level => {
      return {
        level: level.levelNumber,
        reward: activeTab === 'free' ? level.freeReward : level.paidReward
      };
    });

  return (
    <>
      <button
        className="rewards-preview-button jade-button"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
          <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {rewardsPreviewTitle}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="rewards-preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="rewards-preview-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="rewards-preview-header">
                <h2>{rewardsPreviewTitle}</h2>
                <button
                  className="close-button"
                  onClick={() => setIsOpen(false)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="rewards-preview-tabs">
                <button
                  className={`tab-button ${activeTab === 'free' ? 'active' : ''}`}
                  onClick={() => setActiveTab('free')}
                >
                  {freeRewardsLabel}
                </button>
                <button
                  className={`tab-button ${activeTab === 'premium' ? 'active' : ''}`}
                  onClick={() => setActiveTab('premium')}
                >
                  {premiumRewardsLabel}
                  {!hasPremiumPass && activeTab === 'premium' && (
                    <span className="premium-lock-icon">🔒</span>
                  )}
                </button>
              </div>

              {!hasPremiumPass && activeTab === 'premium' && (
                <div className="premium-locked-message">
                  <div className="lock-icon">🔒</div>
                  <p>{premiumLockedLabel}</p>
                </div>
              )}

              <div className="rewards-preview-content">
                {filteredRewards.length > 0 ? (
                  <div className="rewards-grid">
                    {filteredRewards.map(item => (
                      <div key={item.level} className="reward-preview-item">
                        <div className="reward-level">Level {item.level}</div>
                        <div className="reward-icon">
                          {item.reward?.iconAssetKey || '🎁'}
                        </div>
                        <div className="reward-name">
                          {item.reward?.itemName}
                          {item.reward?.quantity > 1 && ` x${item.reward.quantity}`}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-rewards-message">
                    <p>No rewards available for this category.</p>
                  </div>
                )}
              </div>

              <div className="rewards-preview-footer">
                <button
                  className="close-preview-button jade-button"
                  onClick={() => setIsOpen(false)}
                >
                  {closeButtonLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BattlePassRewardsPreview;
