// src/components/game/BattlePassLevelUpModal.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, SoundType } from '@/utils/sound';

/**
 * Props for the BattlePassLevelUpModal component
 */
export interface BattlePassLevelUpModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback function when the modal is closed */
  onClose: () => void;
  /** The new level that the user has reached */
  level: number;
  /** Localized labels for the component */
  labels: BattlePassLevelUpModalLabels;
  /** Free reward for the level (optional) */
  freeReward?: {
    name: string;
    icon?: string;
    quantity: number;
  };
  /** Paid reward for the level (optional) */
  paidReward?: {
    name: string;
    icon?: string;
    quantity: number;
  };
  /** Whether the user has purchased the premium pass */
  hasPremiumPass?: boolean;
}

/**
 * Localized labels for the BattlePassLevelUpModal component
 */
export interface BattlePassLevelUpModalLabels {
  /** Title for the level up modal */
  levelUpTitle?: string;
  /** Message for the level up modal */
  levelUpMessage?: string;
  /** Label for the close button */
  closeButton?: string;
  /** Label for rewards section */
  rewardsTitle?: string;
  /** Label for free reward */
  freeRewardLabel?: string;
  /** Label for premium reward */
  premiumRewardLabel?: string;
  /** Label for premium locked */
  premiumLockedLabel?: string;
}

/**
 * Battle Pass Level Up Modal
 * Displays an animated modal when the user levels up in the Battle Pass
 */
const BattlePassLevelUpModal: React.FC<BattlePassLevelUpModalProps> = ({
  isOpen,
  onClose,
  level,
  labels,
  freeReward,
  paidReward,
  hasPremiumPass = false
}) => {
  // Play level up sound when modal opens
  useEffect(() => {
    if (isOpen) {
      playSound(SoundType.LEVEL_UP);
    }
  }, [isOpen]);

  // Default labels
  const levelUpTitle = labels.levelUpTitle || 'Level Up!';
  const levelUpMessage = labels.levelUpMessage || 'You have reached level {level} in the Battle Pass!';
  const closeButton = labels.closeButton || 'Continue';
  const rewardsTitle = labels.rewardsTitle || 'New Rewards Unlocked';
  const freeRewardLabel = labels.freeRewardLabel || 'Free Reward';
  const premiumRewardLabel = labels.premiumRewardLabel || 'Premium Reward';
  const premiumLockedLabel = labels.premiumLockedLabel || 'Premium Pass Required';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="battle-pass-level-up-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="battle-pass-level-up-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="level-up-content">
              <motion.div
                className="level-up-badge"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="level-number">{level}</span>
              </motion.div>

              <motion.h2
                className="level-up-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {levelUpTitle}
              </motion.h2>

              <motion.p
                className="level-up-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {levelUpMessage.replace('{level}', level.toString())}
              </motion.p>

              <motion.div
                className="level-up-rewards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h3>{rewardsTitle}</h3>
                <div className="rewards-list">
                  {/* Free reward */}
                  {freeReward && (
                    <motion.div
                      className="reward-item free-reward"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.0 }}
                    >
                      <div className="reward-badge">{freeRewardLabel}</div>
                      <div className="reward-icon">
                        {freeReward.icon || '🎁'}
                      </div>
                      <div className="reward-name">
                        {freeReward.name} {freeReward.quantity > 1 ? `x${freeReward.quantity}` : ''}
                      </div>
                    </motion.div>
                  )}

                  {/* Premium reward */}
                  {paidReward && (
                    <motion.div
                      className={`reward-item premium-reward ${!hasPremiumPass ? 'locked' : ''}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      <div className="reward-badge premium">{premiumRewardLabel}</div>
                      <div className="reward-icon">
                        {paidReward.icon || '💎'}
                      </div>
                      <div className="reward-name">
                        {paidReward.name} {paidReward.quantity > 1 ? `x${paidReward.quantity}` : ''}
                      </div>
                      {!hasPremiumPass && (
                        <div className="reward-locked-overlay">
                          <div className="lock-icon">🔒</div>
                          <div className="lock-text">{premiumLockedLabel}</div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.button
                className="close-button jade-button"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {closeButton}
              </motion.button>
            </div>

            {/* Animated particles */}
            <div className="level-up-particles">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    backgroundColor: ['#FFD700', '#00FF00', '#FF00FF', '#00FFFF'][i % 4]
                  }}
                  animate={{
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                    scale: Math.random() * 0.5 + 0.5,
                    opacity: [1, 0]
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    delay: Math.random() * 0.5,
                    repeat: Infinity,
                    repeatType: 'loop'
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BattlePassLevelUpModal;
