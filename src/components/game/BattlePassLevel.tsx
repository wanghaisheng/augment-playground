// src/components/game/BattlePassLevel.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { BattlePassLevelWithRewards } from '@/types/battle-pass';
import { playSound, SoundType } from '@/utils/sound';

/**
 * Props for the BattlePassLevel component
 */
export interface BattlePassLevelProps {
  /** The level data with rewards information */
  level: BattlePassLevelWithRewards;
  /** The user's current level in the Battle Pass */
  currentLevel: number;
  /** Whether the user has purchased the Battle Pass */
  isPurchased: boolean;
  /** Array of level numbers for which the user has claimed free rewards */
  claimedFreeLevels: number[];
  /** Array of level numbers for which the user has claimed paid rewards */
  claimedPaidLevels: number[];
  /** Callback function when a reward is claimed */
  onClaimReward: (levelNumber: number, rewardType: 'free' | 'paid') => void;
  /** Callback function when the user levels up */
  onLevelUp?: (previousLevel: number, newLevel: number) => void;
  /** Localized labels for the component */
  labels: BattlePassLevelLabels;
}

/**
 * Localized labels for the BattlePassLevel component
 */
export interface BattlePassLevelLabels {
  /** Label for the claim reward button */
  claimRewardButton?: string;
  /** Label for already claimed rewards */
  alreadyClaimedLabel?: string;
  /** Label for locked rewards */
  lockedRewardLabel?: string;
  /** Label for VIP-only rewards */
  vipOnlyLabel?: string;
}

/**
 * Battle Pass Level component
 * Displays a single level in the Battle Pass with free and paid rewards
 */
const BattlePassLevel: React.FC<BattlePassLevelProps> = ({
  level,
  currentLevel,
  isPurchased,
  claimedFreeLevels,
  claimedPaidLevels,
  onClaimReward,
  onLevelUp,
  labels
}) => {
  const isLevelUnlocked = currentLevel >= level.levelNumber;
  const isFreeRewardClaimed = claimedFreeLevels.includes(level.levelNumber);
  const isPaidRewardClaimed = claimedPaidLevels.includes(level.levelNumber);

  // Handle claim button click
  const handleClaimFreeReward = () => {
    if (!isLevelUnlocked || isFreeRewardClaimed || !level.freeReward) return;

    playSound(SoundType.REWARD);
    onClaimReward(level.levelNumber, 'free');

    // Check if this reward would cause a level up
    if (level.freeReward.expReward && onLevelUp) {
      // Simulate level up for demo purposes
      // In a real app, this would be determined by the server
      const newLevel = currentLevel + 1;
      onLevelUp(currentLevel, newLevel);
    }
  };

  const handleClaimPaidReward = () => {
    if (!isLevelUnlocked || !isPurchased || isPaidRewardClaimed || !level.paidReward) return;

    playSound(SoundType.REWARD);
    onClaimReward(level.levelNumber, 'paid');

    // Check if this reward would cause a level up
    if (level.paidReward.expReward && onLevelUp) {
      // Simulate level up for demo purposes
      // In a real app, this would be determined by the server
      const newLevel = currentLevel + 1;
      onLevelUp(currentLevel, newLevel);
    }
  };

  return (
    <motion.div
      className={`battle-pass-level ${isLevelUnlocked ? 'unlocked' : 'locked'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="level-number">
        <span>{level.levelNumber}</span>
      </div>

      <div className="level-rewards">
        {/* Free Reward */}
        <div className={`free-reward ${isLevelUnlocked ? 'unlocked' : 'locked'}`}>
          {level.freeReward ? (
            <>
              <div className="reward-icon">
                <img
                  src={level.freeReward.iconAssetKey || '/assets/default-reward-icon.svg'}
                  alt={level.freeReward.itemName}
                />
              </div>
              <div className="reward-info">
                <div className="reward-name">{level.freeReward.itemName}</div>
                <div className="reward-quantity">x{level.freeReward.quantity}</div>
              </div>
              {isLevelUnlocked ? (
                isFreeRewardClaimed ? (
                  <div className="reward-claimed">
                    {labels.alreadyClaimedLabel || 'Claimed'}
                  </div>
                ) : (
                  <button
                    className="claim-button free-claim"
                    onClick={handleClaimFreeReward}
                  >
                    {labels.claimRewardButton || 'Claim'}
                  </button>
                )
              ) : (
                <div className="reward-locked">
                  {labels.lockedRewardLabel || 'Locked'}
                </div>
              )}
            </>
          ) : (
            <div className="no-reward">-</div>
          )}
        </div>

        {/* Paid Reward */}
        <div className={`paid-reward ${isLevelUnlocked && isPurchased ? 'unlocked' : 'locked'}`}>
          {level.paidReward ? (
            <>
              <div className="reward-icon premium">
                <img
                  src={level.paidReward.iconAssetKey || '/assets/default-premium-reward-icon.svg'}
                  alt={level.paidReward.itemName}
                />
              </div>
              <div className="reward-info">
                <div className="reward-name premium">{level.paidReward.itemName}</div>
                <div className="reward-quantity">x{level.paidReward.quantity}</div>
              </div>
              {isLevelUnlocked ? (
                isPurchased ? (
                  isPaidRewardClaimed ? (
                    <div className="reward-claimed premium">
                      {labels.alreadyClaimedLabel || 'Claimed'}
                    </div>
                  ) : (
                    <button
                      className="claim-button premium-claim"
                      onClick={handleClaimPaidReward}
                    >
                      {labels.claimRewardButton || 'Claim'}
                    </button>
                  )
                ) : (
                  <div className="reward-locked premium">
                    {labels.vipOnlyLabel || 'VIP Only'}
                  </div>
                )
              ) : (
                <div className="reward-locked premium">
                  {labels.lockedRewardLabel || 'Locked'}
                </div>
              )}
            </>
          ) : (
            <div className="no-reward">-</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BattlePassLevel;
