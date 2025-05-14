// src/components/game/BattlePassStats.tsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Props for the BattlePassStats component
 */
export interface BattlePassStatsProps {
  /** Current level of the user */
  currentLevel: number;
  /** Maximum level of the battle pass */
  maxLevel: number;
  /** Current experience points */
  currentExp: number;
  /** Experience points needed for next level */
  expForNextLevel: number;
  /** Total experience points earned */
  totalExpEarned: number;
  /** Number of completed tasks */
  completedTasks: number;
  /** Total number of tasks */
  totalTasks: number;
  /** Number of claimed rewards */
  claimedRewards: number;
  /** Total number of rewards */
  totalRewards: number;
  /** Days remaining in the season */
  daysRemaining: number;
  /** Whether the user has purchased the premium pass */
  hasPremiumPass: boolean;
  /** Localized labels for the component */
  labels: {
    /** Title for the stats section */
    statsTitle?: string;
    /** Label for progress section */
    progressLabel?: string;
    /** Label for level */
    levelLabel?: string;
    /** Label for experience */
    expLabel?: string;
    /** Label for tasks */
    tasksLabel?: string;
    /** Label for rewards */
    rewardsLabel?: string;
    /** Label for days remaining */
    daysRemainingLabel?: string;
    /** Label for premium status */
    premiumStatusLabel?: string;
    /** Text for premium pass */
    premiumPassText?: string;
    /** Text for free pass */
    freePassText?: string;
    /** Label for total exp earned */
    totalExpEarnedLabel?: string;
  };
}

/**
 * Battle Pass Stats Component
 * Displays statistics and analytics for the user's battle pass progress
 */
const BattlePassStats: React.FC<BattlePassStatsProps> = ({
  currentLevel,
  maxLevel,
  currentExp,
  expForNextLevel,
  totalExpEarned,
  completedTasks,
  totalTasks,
  claimedRewards,
  totalRewards,
  daysRemaining,
  hasPremiumPass,
  labels
}) => {
  // Default labels
  const statsTitle = labels.statsTitle || 'Battle Pass Statistics';
  const progressLabel = labels.progressLabel || 'Progress';
  const levelLabel = labels.levelLabel || 'Level';
  const expLabel = labels.expLabel || 'Experience';
  const tasksLabel = labels.tasksLabel || 'Tasks';
  const rewardsLabel = labels.rewardsLabel || 'Rewards';
  const daysRemainingLabel = labels.daysRemainingLabel || 'Days Remaining';
  const premiumStatusLabel = labels.premiumStatusLabel || 'Pass Type';
  const premiumPassText = labels.premiumPassText || 'Premium Pass';
  const freePassText = labels.freePassText || 'Free Pass';
  const totalExpEarnedLabel = labels.totalExpEarnedLabel || 'Total XP Earned';

  // Calculate percentages for progress bars
  const levelProgress = (currentLevel / maxLevel) * 100;
  const expProgress = (currentExp / expForNextLevel) * 100;
  const tasksProgress = (completedTasks / totalTasks) * 100;
  const rewardsProgress = (claimedRewards / totalRewards) * 100;

  return (
    <motion.div
      className="battle-pass-stats"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="stats-title">{statsTitle}</h2>
      
      <div className="stats-grid">
        {/* Level Progress */}
        <div className="stat-card">
          <div className="stat-header">
            <h3>{levelLabel}</h3>
            <span className="stat-value">{currentLevel}/{maxLevel}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
          <div className="stat-footer">
            <span className="stat-label">{progressLabel}</span>
            <span className="stat-percentage">{Math.round(levelProgress)}%</span>
          </div>
        </div>
        
        {/* Experience Progress */}
        <div className="stat-card">
          <div className="stat-header">
            <h3>{expLabel}</h3>
            <span className="stat-value">{currentExp}/{expForNextLevel}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${expProgress}%` }}
            ></div>
          </div>
          <div className="stat-footer">
            <span className="stat-label">{totalExpEarnedLabel}</span>
            <span className="stat-value">{totalExpEarned} XP</span>
          </div>
        </div>
        
        {/* Tasks Progress */}
        <div className="stat-card">
          <div className="stat-header">
            <h3>{tasksLabel}</h3>
            <span className="stat-value">{completedTasks}/{totalTasks}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${tasksProgress}%` }}
            ></div>
          </div>
          <div className="stat-footer">
            <span className="stat-label">{progressLabel}</span>
            <span className="stat-percentage">{Math.round(tasksProgress)}%</span>
          </div>
        </div>
        
        {/* Rewards Progress */}
        <div className="stat-card">
          <div className="stat-header">
            <h3>{rewardsLabel}</h3>
            <span className="stat-value">{claimedRewards}/{totalRewards}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${rewardsProgress}%` }}
            ></div>
          </div>
          <div className="stat-footer">
            <span className="stat-label">{progressLabel}</span>
            <span className="stat-percentage">{Math.round(rewardsProgress)}%</span>
          </div>
        </div>
      </div>
      
      <div className="additional-stats">
        <div className="stat-item">
          <span className="stat-label">{daysRemainingLabel}</span>
          <span className="stat-value">{daysRemaining}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{premiumStatusLabel}</span>
          <span className={`stat-value ${hasPremiumPass ? 'premium' : 'free'}`}>
            {hasPremiumPass ? premiumPassText : freePassText}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BattlePassStats;
