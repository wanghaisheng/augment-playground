// src/components/game/BattlePassDailyCheckin.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interface for a daily check-in reward
 */
export interface DailyReward {
  /** Day number */
  day: number;
  /** Reward name */
  rewardName: string;
  /** Reward icon */
  rewardIcon?: string;
  /** Reward quantity */
  quantity: number;
  /** Whether the reward is claimed */
  isClaimed: boolean;
  /** Whether the reward is available to claim */
  isAvailable: boolean;
}

/**
 * Props for the BattlePassDailyCheckin component
 */
export interface BattlePassDailyCheckinProps {
  /** Array of daily rewards */
  rewards: DailyReward[];
  /** Current day */
  currentDay: number;
  /** Current streak */
  currentStreak: number;
  /** Callback function when a reward is claimed */
  onClaimReward?: (day: number) => Promise<boolean>;
  /** Localized labels for the component */
  labels: {
    /** Title for the check-in */
    checkinTitle?: string;
    /** Label for the claim button */
    claimButtonLabel?: string;
    /** Label for the close button */
    closeButtonLabel?: string;
    /** Label for the streak */
    streakLabel?: string;
    /** Label for the claimed status */
    claimedLabel?: string;
    /** Label for the today status */
    todayLabel?: string;
    /** Label for the locked status */
    lockedLabel?: string;
    /** Label for the reward claimed toast */
    rewardClaimedLabel?: string;
    /** Label for the day */
    dayLabel?: string;
  };
}

/**
 * Battle Pass Daily Check-in Component
 * Displays a daily check-in calendar with rewards
 */
const BattlePassDailyCheckin: React.FC<BattlePassDailyCheckinProps> = ({
  rewards,
  currentDay,
  currentStreak,
  onClaimReward,
  labels
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [claimingDay, setClaimingDay] = useState<number | null>(null);
  const [showRewardToast, setShowRewardToast] = useState<boolean>(false);
  const [claimedReward, setClaimedReward] = useState<DailyReward | null>(null);

  // Default labels
  const checkinTitle = labels.checkinTitle || 'Daily Check-in';
  const claimButtonLabel = labels.claimButtonLabel || 'Claim';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const closeButtonLabel = labels.closeButtonLabel || 'Close';
  const streakLabel = labels.streakLabel || 'Current Streak';
  const claimedLabel = labels.claimedLabel || 'Claimed';
  const todayLabel = labels.todayLabel || 'Today';
  const lockedLabel = labels.lockedLabel || 'Locked';
  const rewardClaimedLabel = labels.rewardClaimedLabel || 'Reward Claimed!';
  const dayLabel = labels.dayLabel || 'Day';

  // Handle claim reward
  const handleClaimReward = async (day: number) => {
    if (!onClaimReward) return;

    setClaimingDay(day);

    try {
      const success = await onClaimReward(day);

      if (success) {
        const reward = rewards.find(r => r.day === day);
        if (reward) {
          setClaimedReward(reward);
          setShowRewardToast(true);

          // Hide toast after 3 seconds
          setTimeout(() => {
            setShowRewardToast(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Failed to claim reward:', error);
    } finally {
      setClaimingDay(null);
    }
  };

  return (
    <>
      <button
        className="checkin-button jade-button"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
          <path d="M9 11L12 14L15 11M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 2V6M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {checkinTitle}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="checkin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="checkin-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="checkin-header">
                <h2>{checkinTitle}</h2>
                <div className="streak-counter">
                  <span className="streak-label">{streakLabel}</span>
                  <span className="streak-value">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</span>
                </div>
                <button
                  className="close-button"
                  onClick={() => setIsOpen(false)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="checkin-content">
                <div className="checkin-calendar">
                  {rewards.map(reward => (
                    <div
                      key={reward.day}
                      className={`calendar-day ${reward.isClaimed ? 'claimed' : ''} ${reward.day === currentDay ? 'today' : ''} ${!reward.isAvailable && !reward.isClaimed ? 'locked' : ''}`}
                    >
                      <div className="day-number">{dayLabel} {reward.day}</div>
                      <div className="day-reward">
                        <div className="reward-icon">
                          {reward.rewardIcon || '🎁'}
                        </div>
                        <div className="reward-info">
                          <div className="reward-name">{reward.rewardName}</div>
                          <div className="reward-quantity">x{reward.quantity}</div>
                        </div>
                      </div>
                      <div className="day-status">
                        {reward.isClaimed ? (
                          <span className="claimed-status">{claimedLabel}</span>
                        ) : reward.day === currentDay ? (
                          <button
                            className="claim-button jade-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClaimReward(reward.day);
                            }}
                            disabled={claimingDay === reward.day || !reward.isAvailable}
                          >
                            {claimingDay === reward.day ? '...' : claimButtonLabel}
                          </button>
                        ) : reward.day < currentDay ? (
                          <span className="missed-status">Missed</span>
                        ) : (
                          <span className="locked-status">{lockedLabel}</span>
                        )}
                      </div>
                      {reward.day === currentDay && (
                        <div className="today-marker">{todayLabel}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRewardToast && claimedReward && (
          <motion.div
            className="reward-toast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="toast-content">
              <div className="toast-icon">
                {claimedReward.rewardIcon || '🎁'}
              </div>
              <div className="toast-message">
                <h4>{rewardClaimedLabel}</h4>
                <p>
                  {claimedReward.rewardName} x{claimedReward.quantity}
                </p>
              </div>
              <button
                className="toast-close"
                onClick={() => setShowRewardToast(false)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BattlePassDailyCheckin;
