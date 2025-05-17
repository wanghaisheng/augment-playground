// src/components/game/BattlePassChallenges.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interface for a battle pass challenge
 */
export interface BattlePassChallenge {
  /** Challenge ID */
  id: string;
  /** Challenge name */
  name: string;
  /** Challenge description */
  description: string;
  /** Challenge icon */
  icon?: string;
  /** Challenge difficulty (1-5) */
  difficulty: number;
  /** Challenge end time */
  endTime: string;
  /** Challenge rewards */
  rewards: Array<{
    name: string;
    icon?: string;
    quantity: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  }>;
  /** Challenge steps */
  steps: Array<{
    description: string;
    isCompleted: boolean;
  }>;
  /** Whether the challenge is premium only */
  isPremiumOnly: boolean;
  /** Whether the user has accepted the challenge */
  isAccepted: boolean;
  /** Whether the challenge is completed */
  isCompleted: boolean;
  /** Whether the rewards have been claimed */
  hasClaimedRewards: boolean;
}

/**
 * Props for the BattlePassChallenges component
 */
export interface BattlePassChallengesProps {
  /** Array of battle pass challenges */
  challenges: BattlePassChallenge[];
  /** Whether the user has premium pass */
  hasPremiumPass: boolean;
  /** Callback function when a challenge is accepted */
  onAcceptChallenge?: (challengeId: string) => Promise<boolean>;
  /** Callback function when challenge rewards are claimed */
  onClaimRewards?: (challengeId: string) => Promise<boolean>;
  /** Localized labels for the component */
  labels: {
    /** Title for the challenges */
    challengesTitle?: string;
    /** Label for the accept button */
    acceptButtonLabel?: string;
    /** Label for the claim rewards button */
    claimRewardsButtonLabel?: string;
    /** Label for the close button */
    closeButtonLabel?: string;
    /** Label for when there are no challenges */
    noChallengesLabel?: string;
    /** Label for the premium only badge */
    premiumOnlyLabel?: string;
    /** Label for the challenge details button */
    challengeDetailsButtonLabel?: string;
    /** Label for the challenge rewards */
    challengeRewardsLabel?: string;
    /** Label for the challenge steps */
    challengeStepsLabel?: string;
    /** Label for the challenge difficulty */
    challengeDifficultyLabel?: string;
    /** Label for the challenge completed status */
    challengeCompletedLabel?: string;
    /** Label for the challenge accepted status */
    challengeAcceptedLabel?: string;
    /** Label for the challenge rewards claimed status */
    challengeRewardsClaimedLabel?: string;
    /** Label for the time remaining */
    timeRemainingLabel?: string;
    /** Label for days */
    daysLabel?: string;
    /** Label for hours */
    hoursLabel?: string;
    /** Label for minutes */
    minutesLabel?: string;
    /** Label for the challenge expired status */
    challengeExpiredLabel?: string;
  };
}

/**
 * Battle Pass Challenges Component
 * Displays a list of limited-time challenges for the battle pass
 */
const BattlePassChallenges: React.FC<BattlePassChallengesProps> = ({
  challenges,
  hasPremiumPass,
  onAcceptChallenge,
  onClaimRewards,
  labels
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedChallenge, setSelectedChallenge] = useState<BattlePassChallenge | null>(null);
  const [acceptingChallengeId, setAcceptingChallengeId] = useState<string | null>(null);
  const [claimingRewardsChallengeId, setClaimingRewardsChallengeId] = useState<string | null>(null);

  // Default labels
  const challengesTitle = labels.challengesTitle || 'Limited-Time Challenges';
  const acceptButtonLabel = labels.acceptButtonLabel || 'Accept';
  const claimRewardsButtonLabel = labels.claimRewardsButtonLabel || 'Claim Rewards';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const closeButtonLabel = labels.closeButtonLabel || 'Close';
  const noChallengesLabel = labels.noChallengesLabel || 'No challenges available';
  const premiumOnlyLabel = labels.premiumOnlyLabel || 'Premium Only';
  const challengeDetailsButtonLabel = labels.challengeDetailsButtonLabel || 'Details';
  const challengeRewardsLabel = labels.challengeRewardsLabel || 'Rewards';
  const challengeStepsLabel = labels.challengeStepsLabel || 'Steps';
  const challengeDifficultyLabel = labels.challengeDifficultyLabel || 'Difficulty';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const challengeCompletedLabel = labels.challengeCompletedLabel || 'Completed';
  const challengeAcceptedLabel = labels.challengeAcceptedLabel || 'Accepted';
  const challengeRewardsClaimedLabel = labels.challengeRewardsClaimedLabel || 'Rewards Claimed';
  const timeRemainingLabel = labels.timeRemainingLabel || 'Time Remaining';
  const daysLabel = labels.daysLabel || 'days';
  const hoursLabel = labels.hoursLabel || 'hours';
  const minutesLabel = labels.minutesLabel || 'minutes';
  const challengeExpiredLabel = labels.challengeExpiredLabel || 'Expired';

  // Calculate time remaining
  const calculateTimeRemaining = (endTimeString: string) => {
    const endTime = new Date(endTimeString).getTime();
    const now = Date.now();
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) {
      return { days: 0, hours: 0, minutes: 0, isExpired: true };
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, isExpired: false };
  };

  // Get rarity color
  const getRarityColor = (rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary') => {
    switch (rarity) {
      case 'common': return '#9e9e9e';
      case 'uncommon': return '#4caf50';
      case 'rare': return '#2196f3';
      case 'epic': return '#9c27b0';
      case 'legendary': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  // Get difficulty stars
  const getDifficultyStars = (difficulty: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`difficulty-star ${i < difficulty ? 'active' : 'inactive'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Handle accept challenge
  const handleAcceptChallenge = async (challengeId: string) => {
    if (!onAcceptChallenge) return;

    setAcceptingChallengeId(challengeId);

    try {
      const success = await onAcceptChallenge(challengeId);

      if (success) {
        // Show success message or update UI
      }
    } catch (error) {
      console.error('Failed to accept challenge:', error);
    } finally {
      setAcceptingChallengeId(null);
    }
  };

  // Handle claim rewards
  const handleClaimRewards = async (challengeId: string) => {
    if (!onClaimRewards) return;

    setClaimingRewardsChallengeId(challengeId);

    try {
      const success = await onClaimRewards(challengeId);

      if (success) {
        // Show success message or update UI
      }
    } catch (error) {
      console.error('Failed to claim rewards:', error);
    } finally {
      setClaimingRewardsChallengeId(null);
    }
  };

  // Filter active challenges
  const activeChallenges = challenges.filter(challenge => {
    const { isExpired } = calculateTimeRemaining(challenge.endTime);
    return !isExpired;
  });

  return (
    <>
      <button
        className="challenges-button jade-button"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
          <path d="M12 15H8M16 15H14M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21M12 3L8 7H16L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {challengesTitle}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="challenges-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsOpen(false);
              setSelectedChallenge(null);
            }}
          >
            <motion.div
              className="challenges-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="challenges-header">
                <h2>{challengesTitle}</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedChallenge(null);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="challenges-content">
                {activeChallenges.length > 0 ? (
                  <div className="challenges-list">
                    {activeChallenges.map(challenge => {
                      const timeRemaining = calculateTimeRemaining(challenge.endTime);
                      const completedSteps = challenge.steps.filter(step => step.isCompleted).length;
                      const totalSteps = challenge.steps.length;
                      const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

                      return (
                        <div
                          key={challenge.id}
                          className={`challenge-item ${challenge.isPremiumOnly && !hasPremiumPass ? 'premium-locked' : ''}`}
                          onClick={() => {
                            if (!challenge.isPremiumOnly || hasPremiumPass) {
                              setSelectedChallenge(challenge);
                            }
                          }}
                        >
                          <div className="challenge-icon">
                            {challenge.icon || '🏆'}
                            {challenge.isPremiumOnly && (
                              <div className="premium-badge" title={premiumOnlyLabel}>
                                ⭐
                              </div>
                            )}
                          </div>

                          <div className="challenge-info">
                            <h3 className="challenge-name">{challenge.name}</h3>
                            <p className="challenge-description">{challenge.description}</p>

                            <div className="challenge-time-remaining">
                              <span className="time-label">{timeRemainingLabel}:</span>
                              <span className="time-value">
                                {timeRemaining.days} {daysLabel}, {timeRemaining.hours} {hoursLabel}, {timeRemaining.minutes} {minutesLabel}
                              </span>
                            </div>

                            {challenge.isAccepted && (
                              <div className="challenge-progress">
                                <div className="progress-text">
                                  <span>{completedSteps}/{totalSteps}</span>
                                </div>
                                <div className="challenge-progress-bar">
                                  <div
                                    className="progress-fill"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="challenge-actions">
                            <div className="challenge-difficulty" title={`${challengeDifficultyLabel}: ${challenge.difficulty}/5`}>
                              {getDifficultyStars(challenge.difficulty)}
                            </div>

                            {challenge.isPremiumOnly && !hasPremiumPass ? (
                              <span className="premium-required">{premiumOnlyLabel}</span>
                            ) : challenge.isCompleted && !challenge.hasClaimedRewards ? (
                              <button
                                className="claim-rewards-button imperial-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClaimRewards(challenge.id);
                                }}
                                disabled={claimingRewardsChallengeId === challenge.id}
                              >
                                {claimingRewardsChallengeId === challenge.id ? '...' : claimRewardsButtonLabel}
                              </button>
                            ) : challenge.hasClaimedRewards ? (
                              <span className="rewards-claimed">{challengeRewardsClaimedLabel}</span>
                            ) : challenge.isAccepted ? (
                              <span className="challenge-accepted">{challengeAcceptedLabel}</span>
                            ) : (
                              <button
                                className="accept-challenge-button jade-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptChallenge(challenge.id);
                                }}
                                disabled={acceptingChallengeId === challenge.id}
                              >
                                {acceptingChallengeId === challenge.id ? '...' : acceptButtonLabel}
                              </button>
                            )}

                            <button
                              className="challenge-details-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!challenge.isPremiumOnly || hasPremiumPass) {
                                  setSelectedChallenge(challenge);
                                }
                              }}
                            >
                              {challengeDetailsButtonLabel}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-challenges">
                    <p>{noChallengesLabel}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            className="challenge-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              className="challenge-detail-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="challenge-detail-header">
                <h2>{selectedChallenge.name}</h2>
                <button
                  className="close-button"
                  onClick={() => setSelectedChallenge(null)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="challenge-detail-content">
                <div className="challenge-detail-icon">
                  {selectedChallenge.icon || '🏆'}
                </div>

                <div className="challenge-detail-description">
                  <p>{selectedChallenge.description}</p>
                </div>

                <div className="challenge-detail-info">
                  <div className="challenge-detail-difficulty">
                    <span className="detail-label">{challengeDifficultyLabel}</span>
                    <div className="difficulty-stars">
                      {getDifficultyStars(selectedChallenge.difficulty)}
                    </div>
                  </div>

                  <div className="challenge-detail-time">
                    <span className="detail-label">{timeRemainingLabel}</span>
                    <span className="detail-value">
                      {(() => {
                        const { days, hours, minutes, isExpired } = calculateTimeRemaining(selectedChallenge.endTime);
                        return isExpired
                          ? challengeExpiredLabel
                          : `${days} ${daysLabel}, ${hours} ${hoursLabel}, ${minutes} ${minutesLabel}`;
                      })()}
                    </span>
                  </div>
                </div>

                <div className="challenge-detail-steps">
                  <h3>{challengeStepsLabel}</h3>
                  <div className="steps-list">
                    {selectedChallenge.steps.map((step, index) => (
                      <div key={index} className={`step-item ${step.isCompleted ? 'completed' : ''}`}>
                        <div className="step-checkbox">
                          {step.isCompleted ? '✓' : '○'}
                        </div>
                        <div className="step-description">
                          {step.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="challenge-detail-rewards">
                  <h3>{challengeRewardsLabel}</h3>
                  <div className="rewards-grid">
                    {selectedChallenge.rewards.map((reward, index) => (
                      <div key={index} className="reward-item">
                        <div
                          className="reward-icon"
                          style={{ borderColor: getRarityColor(reward.rarity) }}
                        >
                          {reward.icon || '🎁'}
                        </div>
                        <div className="reward-info">
                          <div className="reward-name">{reward.name}</div>
                          <div className="reward-quantity">x{reward.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="challenge-detail-actions">
                  {selectedChallenge.isPremiumOnly && !hasPremiumPass ? (
                    <span className="premium-required">{premiumOnlyLabel}</span>
                  ) : selectedChallenge.isCompleted && !selectedChallenge.hasClaimedRewards ? (
                    <button
                      className="claim-rewards-button imperial-button"
                      onClick={() => handleClaimRewards(selectedChallenge.id)}
                      disabled={claimingRewardsChallengeId === selectedChallenge.id}
                    >
                      {claimingRewardsChallengeId === selectedChallenge.id ? '...' : claimRewardsButtonLabel}
                    </button>
                  ) : selectedChallenge.hasClaimedRewards ? (
                    <span className="rewards-claimed">{challengeRewardsClaimedLabel}</span>
                  ) : selectedChallenge.isAccepted ? (
                    <span className="challenge-accepted">{challengeAcceptedLabel}</span>
                  ) : (
                    <button
                      className="accept-challenge-button jade-button"
                      onClick={() => handleAcceptChallenge(selectedChallenge.id)}
                      disabled={acceptingChallengeId === selectedChallenge.id}
                    >
                      {acceptingChallengeId === selectedChallenge.id ? '...' : acceptButtonLabel}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BattlePassChallenges;
