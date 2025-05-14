// src/components/game/BattlePassLeaderboard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interface for a leaderboard entry
 */
export interface LeaderboardEntry {
  /** User ID */
  userId: string;
  /** User name */
  userName: string;
  /** User avatar URL */
  avatarUrl?: string;
  /** User level in the battle pass */
  level: number;
  /** User experience points */
  exp: number;
  /** Whether the user has premium pass */
  hasPremiumPass: boolean;
  /** User rank in the leaderboard */
  rank: number;
}

/**
 * Props for the BattlePassLeaderboard component
 */
export interface BattlePassLeaderboardProps {
  /** Array of leaderboard entries */
  entries: LeaderboardEntry[];
  /** Current user's ID */
  currentUserId: string;
  /** Callback function when the refresh button is clicked */
  onRefresh?: () => void;
  /** Whether the leaderboard is loading */
  isLoading?: boolean;
  /** Localized labels for the component */
  labels: {
    /** Title for the leaderboard */
    leaderboardTitle?: string;
    /** Label for the rank column */
    rankLabel?: string;
    /** Label for the player column */
    playerLabel?: string;
    /** Label for the level column */
    levelLabel?: string;
    /** Label for the premium badge */
    premiumBadgeLabel?: string;
    /** Label for the refresh button */
    refreshButtonLabel?: string;
    /** Label for when there are no entries */
    noEntriesLabel?: string;
    /** Label for the loading state */
    loadingLabel?: string;
    /** Label for "You" indicator */
    youLabel?: string;
  };
}

/**
 * Battle Pass Leaderboard Component
 * Displays a leaderboard of users ranked by their battle pass progress
 */
const BattlePassLeaderboard: React.FC<BattlePassLeaderboardProps> = ({
  entries,
  currentUserId,
  onRefresh,
  isLoading = false,
  labels
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Default labels
  const leaderboardTitle = labels.leaderboardTitle || 'Leaderboard';
  const rankLabel = labels.rankLabel || 'Rank';
  const playerLabel = labels.playerLabel || 'Player';
  const levelLabel = labels.levelLabel || 'Level';
  const premiumBadgeLabel = labels.premiumBadgeLabel || 'Premium';
  const refreshButtonLabel = labels.refreshButtonLabel || 'Refresh';
  const noEntriesLabel = labels.noEntriesLabel || 'No entries yet';
  const loadingLabel = labels.loadingLabel || 'Loading...';
  const youLabel = labels.youLabel || 'You';

  // Find current user's entry
  const currentUserEntry = entries.find(entry => entry.userId === currentUserId);

  return (
    <>
      <button
        className="leaderboard-button jade-button"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
          <path d="M8 21H12M16 21H12M12 21V17M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17ZM17 3L15 5M15 5L17 7M15 5H20M7 3L9 5M9 5L7 7M9 5H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {leaderboardTitle}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="leaderboard-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="leaderboard-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="leaderboard-header">
                <h2>{leaderboardTitle}</h2>
                <button
                  className="refresh-button"
                  onClick={e => {
                    e.stopPropagation();
                    onRefresh && onRefresh();
                  }}
                  disabled={isLoading}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" className={isLoading ? 'spinning' : ''}>
                    <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {refreshButtonLabel}
                </button>
                <button
                  className="close-button"
                  onClick={() => setIsOpen(false)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="leaderboard-content">
                {isLoading ? (
                  <div className="leaderboard-loading">
                    <div className="loading-spinner"></div>
                    <p>{loadingLabel}</p>
                  </div>
                ) : entries.length > 0 ? (
                  <div className="leaderboard-table">
                    <div className="leaderboard-table-header">
                      <div className="rank-column">{rankLabel}</div>
                      <div className="player-column">{playerLabel}</div>
                      <div className="level-column">{levelLabel}</div>
                    </div>
                    <div className="leaderboard-table-body">
                      {entries.map(entry => (
                        <div 
                          key={entry.userId} 
                          className={`leaderboard-row ${entry.userId === currentUserId ? 'current-user' : ''}`}
                        >
                          <div className="rank-column">
                            {entry.rank <= 3 ? (
                              <div className={`top-rank rank-${entry.rank}`}>
                                {entry.rank}
                              </div>
                            ) : (
                              <div className="normal-rank">{entry.rank}</div>
                            )}
                          </div>
                          <div className="player-column">
                            <div className="player-avatar">
                              {entry.avatarUrl ? (
                                <img src={entry.avatarUrl} alt={entry.userName} />
                              ) : (
                                <div className="default-avatar">
                                  {entry.userName.charAt(0).toUpperCase()}
                                </div>
                              )}
                              {entry.hasPremiumPass && (
                                <div className="premium-badge" title={premiumBadgeLabel}>
                                  ⭐
                                </div>
                              )}
                            </div>
                            <div className="player-name">
                              {entry.userName}
                              {entry.userId === currentUserId && (
                                <span className="you-indicator">{youLabel}</span>
                              )}
                            </div>
                          </div>
                          <div className="level-column">
                            <div className="level-badge">
                              {entry.level}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="no-entries">
                    <p>{noEntriesLabel}</p>
                  </div>
                )}
              </div>

              {currentUserEntry && (
                <div className="current-user-section">
                  <div className="current-user-header">
                    Your Ranking
                  </div>
                  <div className="current-user-info">
                    <div className="rank-column">
                      {currentUserEntry.rank <= 3 ? (
                        <div className={`top-rank rank-${currentUserEntry.rank}`}>
                          {currentUserEntry.rank}
                        </div>
                      ) : (
                        <div className="normal-rank">{currentUserEntry.rank}</div>
                      )}
                    </div>
                    <div className="player-column">
                      <div className="player-avatar">
                        {currentUserEntry.avatarUrl ? (
                          <img src={currentUserEntry.avatarUrl} alt={currentUserEntry.userName} />
                        ) : (
                          <div className="default-avatar">
                            {currentUserEntry.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {currentUserEntry.hasPremiumPass && (
                          <div className="premium-badge" title={premiumBadgeLabel}>
                            ⭐
                          </div>
                        )}
                      </div>
                      <div className="player-name">
                        {currentUserEntry.userName}
                        <span className="you-indicator">{youLabel}</span>
                      </div>
                    </div>
                    <div className="level-column">
                      <div className="level-badge">
                        {currentUserEntry.level}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BattlePassLeaderboard;
