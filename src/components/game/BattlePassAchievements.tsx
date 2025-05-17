// src/components/game/BattlePassAchievements.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interface for an achievement
 */
export interface Achievement {
  /** Achievement ID */
  id: string;
  /** Achievement name */
  name: string;
  /** Achievement description */
  description: string;
  /** Achievement icon */
  icon?: string;
  /** Whether the achievement is unlocked */
  unlocked: boolean;
  /** Achievement progress (0-100) */
  progress: number;
  /** Achievement reward description */
  reward?: string;
  /** Achievement rarity (common, uncommon, rare, epic, legendary) */
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  /** Date when the achievement was unlocked */
  unlockedAt?: string;
}

/**
 * Props for the BattlePassAchievements component
 */
export interface BattlePassAchievementsProps {
  /** Array of achievements */
  achievements: Achievement[];
  /** Callback function when an achievement reward is claimed */
  onClaimReward?: (achievementId: string) => void;
  /** Localized labels for the component */
  labels: {
    /** Title for the achievements */
    achievementsTitle?: string;
    /** Label for the progress */
    progressLabel?: string;
    /** Label for the claim button */
    claimButtonLabel?: string;
    /** Label for the locked status */
    lockedLabel?: string;
    /** Label for the unlocked status */
    unlockedLabel?: string;
    /** Label for the close button */
    closeButtonLabel?: string;
    /** Label for when there are no achievements */
    noAchievementsLabel?: string;
    /** Labels for rarity levels */
    rarityLabels?: {
      common?: string;
      uncommon?: string;
      rare?: string;
      epic?: string;
      legendary?: string;
    };
  };
}

/**
 * Battle Pass Achievements Component
 * Displays a list of achievements for the battle pass
 */
const BattlePassAchievements: React.FC<BattlePassAchievementsProps> = ({
  achievements,
  onClaimReward,
  labels
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Default labels
  const achievementsTitle = labels.achievementsTitle || 'Achievements';
  const progressLabel = labels.progressLabel || 'Progress';
  const claimButtonLabel = labels.claimButtonLabel || 'Claim';
  const lockedLabel = labels.lockedLabel || 'Locked';
  const unlockedLabel = labels.unlockedLabel || 'Unlocked';
  // Close button label for future use
  // const closeButtonLabel = labels.closeButtonLabel || 'Close';
  const noAchievementsLabel = labels.noAchievementsLabel || 'No achievements yet';

  // Default rarity labels
  const rarityLabels = {
    common: labels.rarityLabels?.common || 'Common',
    uncommon: labels.rarityLabels?.uncommon || 'Uncommon',
    rare: labels.rarityLabels?.rare || 'Rare',
    epic: labels.rarityLabels?.epic || 'Epic',
    legendary: labels.rarityLabels?.legendary || 'Legendary'
  };

  // Get the count of unlocked achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <>
      <button
        className="achievements-button jade-button"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
          <path d="M12 15L8.5 12L12 9M12 15L15.5 12L12 9M12 15V3M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {achievementsTitle} ({unlockedCount}/{achievements.length})
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="achievements-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsOpen(false);
              setSelectedAchievement(null);
            }}
          >
            <motion.div
              className="achievements-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="achievements-header">
                <h2>{achievementsTitle}</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedAchievement(null);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="achievements-content">
                {achievements.length > 0 ? (
                  <div className="achievements-grid">
                    {achievements.map(achievement => (
                      <div
                        key={achievement.id}
                        className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'} ${achievement.rarity}`}
                        onClick={() => setSelectedAchievement(achievement)}
                      >
                        <div className="achievement-icon">
                          {achievement.icon || (
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 15L8.5 12L12 9M12 15L15.5 12L12 9M12 15V3M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <div className="achievement-info">
                          <div className="achievement-name">{achievement.name}</div>
                          <div className="achievement-progress">
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{ width: `${achievement.progress}%` }}
                              ></div>
                            </div>
                            <div className="progress-text">
                              {achievement.progress}%
                            </div>
                          </div>
                        </div>
                        <div className={`achievement-rarity-badge ${achievement.rarity}`}>
                          {rarityLabels[achievement.rarity]}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-achievements">
                    <p>{noAchievementsLabel}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="achievement-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              className={`achievement-detail-modal ${selectedAchievement.rarity}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="achievement-detail-header">
                <h2>{selectedAchievement.name}</h2>
                <div className={`achievement-rarity-badge ${selectedAchievement.rarity}`}>
                  {rarityLabels[selectedAchievement.rarity]}
                </div>
                <button
                  className="close-button"
                  onClick={() => setSelectedAchievement(null)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="achievement-detail-content">
                <div className="achievement-detail-icon">
                  {selectedAchievement.icon || (
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15L8.5 12L12 9M12 15L15.5 12L12 9M12 15V3M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                <div className="achievement-detail-description">
                  {selectedAchievement.description}
                </div>

                <div className="achievement-detail-progress">
                  <div className="progress-label">{progressLabel}</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${selectedAchievement.progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {selectedAchievement.progress}%
                  </div>
                </div>

                {selectedAchievement.reward && (
                  <div className="achievement-detail-reward">
                    <div className="reward-label">Reward</div>
                    <div className="reward-text">{selectedAchievement.reward}</div>
                  </div>
                )}

                <div className="achievement-detail-status">
                  {selectedAchievement.unlocked ? (
                    <div className="unlocked-status">
                      <span className="status-icon">✓</span>
                      <span className="status-text">{unlockedLabel}</span>
                      {selectedAchievement.unlockedAt && (
                        <span className="unlocked-date">
                          {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="locked-status">
                      <span className="status-icon">🔒</span>
                      <span className="status-text">{lockedLabel}</span>
                    </div>
                  )}
                </div>

                {selectedAchievement.unlocked && selectedAchievement.reward && onClaimReward && (
                  <button
                    className="claim-reward-button jade-button"
                    onClick={() => {
                      onClaimReward(selectedAchievement.id);
                      setSelectedAchievement(null);
                    }}
                  >
                    {claimButtonLabel}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BattlePassAchievements;
