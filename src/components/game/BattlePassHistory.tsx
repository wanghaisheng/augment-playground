// src/components/game/BattlePassHistory.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interface for a battle pass season history entry
 */
export interface BattlePassHistoryEntry {
  /** Season ID */
  seasonId: string;
  /** Season name */
  seasonName: string;
  /** Season theme */
  seasonTheme: string;
  /** Season start date */
  startDate: string;
  /** Season end date */
  endDate: string;
  /** User's final level */
  finalLevel: number;
  /** Maximum level of the season */
  maxLevel: number;
  /** Number of completed tasks */
  completedTasks: number;
  /** Total number of tasks */
  totalTasks: number;
  /** Number of claimed rewards */
  claimedRewards: number;
  /** Total number of rewards */
  totalRewards: number;
  /** Whether the user had premium pass */
  hadPremiumPass: boolean;
  /** User's rank in the season */
  finalRank?: number;
  /** Total number of players in the season */
  totalPlayers?: number;
  /** Notable rewards earned */
  notableRewards?: Array<{
    name: string;
    icon?: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  }>;
  /** Achievements earned in the season */
  achievements?: Array<{
    name: string;
    icon?: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  }>;
}

/**
 * Props for the BattlePassHistory component
 */
export interface BattlePassHistoryProps {
  /** Array of battle pass history entries */
  historyEntries: BattlePassHistoryEntry[];
  /** Callback function when a season is selected */
  onSeasonSelected?: (seasonId: string) => void;
  /** Localized labels for the component */
  labels: {
    /** Title for the history */
    historyTitle?: string;
    /** Label for the season */
    seasonLabel?: string;
    /** Label for the level */
    levelLabel?: string;
    /** Label for the tasks */
    tasksLabel?: string;
    /** Label for the rewards */
    rewardsLabel?: string;
    /** Label for the rank */
    rankLabel?: string;
    /** Label for the premium status */
    premiumStatusLabel?: string;
    /** Text for premium pass */
    premiumPassText?: string;
    /** Text for free pass */
    freePassText?: string;
    /** Label for the notable rewards */
    notableRewardsLabel?: string;
    /** Label for the achievements */
    achievementsLabel?: string;
    /** Label for the close button */
    closeButtonLabel?: string;
    /** Label for when there is no history */
    noHistoryLabel?: string;
    /** Label for the view details button */
    viewDetailsButtonLabel?: string;
    /** Label for the season dates */
    seasonDatesLabel?: string;
  };
}

/**
 * Battle Pass History Component
 * Displays a history of user's battle pass seasons
 */
const BattlePassHistory: React.FC<BattlePassHistoryProps> = ({
  historyEntries,
  onSeasonSelected,
  labels
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSeason, setSelectedSeason] = useState<BattlePassHistoryEntry | null>(null);

  // Default labels
  const historyTitle = labels.historyTitle || 'Season History';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const seasonLabel = labels.seasonLabel || 'Season';
  const levelLabel = labels.levelLabel || 'Level';
  const tasksLabel = labels.tasksLabel || 'Tasks';
  const rewardsLabel = labels.rewardsLabel || 'Rewards';
  const rankLabel = labels.rankLabel || 'Rank';
  const premiumStatusLabel = labels.premiumStatusLabel || 'Pass Type';
  const premiumPassText = labels.premiumPassText || 'Premium Pass';
  const freePassText = labels.freePassText || 'Free Pass';
  const notableRewardsLabel = labels.notableRewardsLabel || 'Notable Rewards';
  const achievementsLabel = labels.achievementsLabel || 'Achievements';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const closeButtonLabel = labels.closeButtonLabel || 'Close';
  const noHistoryLabel = labels.noHistoryLabel || 'No season history yet';
  const viewDetailsButtonLabel = labels.viewDetailsButtonLabel || 'View Details';
  const seasonDatesLabel = labels.seasonDatesLabel || 'Season Dates';

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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

  return (
    <>
      <button
        className="history-button jade-button"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
          <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {historyTitle}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="history-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsOpen(false);
              setSelectedSeason(null);
            }}
          >
            <motion.div
              className="history-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="history-header">
                <h2>{historyTitle}</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedSeason(null);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="history-content">
                {historyEntries.length > 0 ? (
                  <div className="history-list">
                    {historyEntries.map(entry => (
                      <div
                        key={entry.seasonId}
                        className={`history-item ${entry.seasonTheme}`}
                        onClick={() => setSelectedSeason(entry)}
                      >
                        <div className="season-header">
                          <h3 className="season-name">{entry.seasonName}</h3>
                          <span className="season-dates">
                            {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
                          </span>
                        </div>

                        <div className="season-stats">
                          <div className="stat-item">
                            <span className="stat-label">{levelLabel}</span>
                            <span className="stat-value">{entry.finalLevel}/{entry.maxLevel}</span>
                          </div>

                          <div className="stat-item">
                            <span className="stat-label">{tasksLabel}</span>
                            <span className="stat-value">{entry.completedTasks}/{entry.totalTasks}</span>
                          </div>

                          <div className="stat-item">
                            <span className="stat-label">{rewardsLabel}</span>
                            <span className="stat-value">{entry.claimedRewards}/{entry.totalRewards}</span>
                          </div>

                          {entry.finalRank && (
                            <div className="stat-item">
                              <span className="stat-label">{rankLabel}</span>
                              <span className="stat-value">{entry.finalRank}/{entry.totalPlayers || '?'}</span>
                            </div>
                          )}
                        </div>

                        <div className="season-footer">
                          <span className={`pass-type ${entry.hadPremiumPass ? 'premium' : 'free'}`}>
                            {entry.hadPremiumPass ? premiumPassText : freePassText}
                          </span>

                          <button
                            className="view-details-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSeasonSelected) {
                                onSeasonSelected(entry.seasonId);
                              }
                            }}
                          >
                            {viewDetailsButtonLabel}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-history">
                    <p>{noHistoryLabel}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSeason && (
          <motion.div
            className="season-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSeason(null)}
          >
            <motion.div
              className={`season-detail-modal ${selectedSeason.seasonTheme}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="season-detail-header">
                <h2>{selectedSeason.seasonName}</h2>
                <button
                  className="close-button"
                  onClick={() => setSelectedSeason(null)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="season-detail-content">
                <div className="season-detail-section">
                  <h3 className="section-title">{seasonDatesLabel}</h3>
                  <div className="season-dates-detail">
                    <div className="date-item">
                      <span className="date-label">Start</span>
                      <span className="date-value">{formatDate(selectedSeason.startDate)}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">End</span>
                      <span className="date-value">{formatDate(selectedSeason.endDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="season-detail-section">
                  <h3 className="section-title">Statistics</h3>
                  <div className="season-stats-detail">
                    <div className="stat-detail-item">
                      <span className="stat-detail-label">{levelLabel}</span>
                      <span className="stat-detail-value">{selectedSeason.finalLevel}/{selectedSeason.maxLevel}</span>
                      <div className="stat-progress-bar">
                        <div
                          className="stat-progress-fill"
                          style={{ width: `${(selectedSeason.finalLevel / selectedSeason.maxLevel) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="stat-detail-item">
                      <span className="stat-detail-label">{tasksLabel}</span>
                      <span className="stat-detail-value">{selectedSeason.completedTasks}/{selectedSeason.totalTasks}</span>
                      <div className="stat-progress-bar">
                        <div
                          className="stat-progress-fill"
                          style={{ width: `${(selectedSeason.completedTasks / selectedSeason.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="stat-detail-item">
                      <span className="stat-detail-label">{rewardsLabel}</span>
                      <span className="stat-detail-value">{selectedSeason.claimedRewards}/{selectedSeason.totalRewards}</span>
                      <div className="stat-progress-bar">
                        <div
                          className="stat-progress-fill"
                          style={{ width: `${(selectedSeason.claimedRewards / selectedSeason.totalRewards) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {selectedSeason.finalRank && (
                      <div className="stat-detail-item">
                        <span className="stat-detail-label">{rankLabel}</span>
                        <span className="stat-detail-value">{selectedSeason.finalRank}/{selectedSeason.totalPlayers || '?'}</span>
                        <div className="stat-progress-bar">
                          <div
                            className="stat-progress-fill"
                            style={{ width: `${(1 - (selectedSeason.finalRank / (selectedSeason.totalPlayers || 100))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="stat-detail-item">
                      <span className="stat-detail-label">{premiumStatusLabel}</span>
                      <span className={`stat-detail-value ${selectedSeason.hadPremiumPass ? 'premium' : 'free'}`}>
                        {selectedSeason.hadPremiumPass ? premiumPassText : freePassText}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedSeason.notableRewards && selectedSeason.notableRewards.length > 0 && (
                  <div className="season-detail-section">
                    <h3 className="section-title">{notableRewardsLabel}</h3>
                    <div className="rewards-grid">
                      {selectedSeason.notableRewards.map((reward, index) => (
                        <div key={index} className="reward-item">
                          <div
                            className="reward-icon"
                            style={{ borderColor: getRarityColor(reward.rarity) }}
                          >
                            {reward.icon || '🎁'}
                          </div>
                          <div className="reward-name">{reward.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSeason.achievements && selectedSeason.achievements.length > 0 && (
                  <div className="season-detail-section">
                    <h3 className="section-title">{achievementsLabel}</h3>
                    <div className="achievements-grid">
                      {selectedSeason.achievements.map((achievement, index) => (
                        <div key={index} className="achievement-item">
                          <div
                            className="achievement-icon"
                            style={{ borderColor: getRarityColor(achievement.rarity) }}
                          >
                            {achievement.icon || '🏆'}
                          </div>
                          <div className="achievement-name">{achievement.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BattlePassHistory;
