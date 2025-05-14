// src/components/game/TimelyRewardCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TimelyRewardRecord, TimelyRewardStatus, TimelyRewardType } from '@/services/timelyRewardService';
import ProgressBar from '@/components/common/ProgressBar';
import { formatTime } from '@/utils/dateUtils';
import { TimelyRewardCardLabels } from '@/types';

interface TimelyRewardCardProps {
  reward: TimelyRewardRecord;
  onClick?: (reward: TimelyRewardRecord) => void;
  onComplete?: (rewardId: number) => void;
  labels?: TimelyRewardCardLabels;
}

/**
 * Timely reward card component
 * Displays basic information and progress of a timely reward
 */
const TimelyRewardCard: React.FC<TimelyRewardCardProps> = ({ reward, onClick, onComplete, labels }) => {
  // Add console log to check labels
  console.log('TimelyRewardCard labels:', labels);
  // 获取奖励状态对应的样式类
  const getStatusClass = () => {
    switch (reward.status) {
      case TimelyRewardStatus.ACTIVE:
        return 'reward-active';
      case TimelyRewardStatus.COMPLETED:
        return 'reward-completed';
      case TimelyRewardStatus.EXPIRED:
        return 'reward-expired';
      case TimelyRewardStatus.UPCOMING:
        return 'reward-upcoming';
      default:
        return '';
    }
  };

  // Get reward type text with localization
  const getTypeText = () => {
    switch (reward.type) {
      case TimelyRewardType.DAILY:
        return labels?.typeDaily || 'Daily Reward';
      case TimelyRewardType.MORNING:
        return labels?.typeMorning || 'Early Bird Reward';
      case TimelyRewardType.STREAK:
        return labels?.typeStreak || 'Streak Reward';
      case TimelyRewardType.SPECIAL:
        return labels?.typeSpecial || 'Special Reward';
      default:
        return '';
    }
  };

  // Get reward status text with localization
  const getStatusText = () => {
    switch (reward.status) {
      case TimelyRewardStatus.ACTIVE:
        return labels?.statusActive || 'Active';
      case TimelyRewardStatus.COMPLETED:
        return labels?.statusCompleted || 'Completed';
      case TimelyRewardStatus.EXPIRED:
        return labels?.statusExpired || 'Expired';
      case TimelyRewardStatus.UPCOMING:
        return labels?.statusUpcoming || 'Upcoming';
      default:
        return '';
    }
  };

  // Calculate remaining time with localization
  const getRemainingTime = () => {
    const now = new Date();
    const endTime = new Date(reward.endTime);

    if (now > endTime) {
      return labels?.timeEnded || 'Ended';
    }

    const diffMs = endTime.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    const hourUnit = labels?.hourUnit || 'h';
    const minuteUnit = labels?.minuteUnit || 'm';

    return `${diffHrs}${hourUnit} ${diffMins}${minuteUnit}`;
  };

  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick(reward);
    }
  };

  // 处理完成奖励事件
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (onComplete && reward.status === TimelyRewardStatus.ACTIVE && reward.progress >= 100) {
      onComplete(reward.id!);
    }
  };

  return (
    <motion.div
      className={`timely-reward-card ${getStatusClass()}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="reward-card-header">
        <div className="reward-icon">
          <img src={reward.iconPath} alt={reward.title} />
        </div>
        <div className="reward-title-section">
          <h3 className="reward-title">{reward.title}</h3>
          <div className="reward-meta">
            <span className="reward-type">{getTypeText()}</span>
            <span className={`reward-status ${getStatusClass()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      <div className="reward-card-body">
        <p className="reward-description">{reward.description}</p>

        <div className="reward-progress-section">
          <ProgressBar
            progress={reward.progress}
            total={100}
            showPercentage
            className={getStatusClass()}
          />
          <div className="reward-time-info">
            <div className="reward-time-range">
              {formatTime(reward.startTime)} - {formatTime(reward.endTime)}
            </div>
            {reward.status === TimelyRewardStatus.ACTIVE && (
              <div className="reward-remaining-time">
                {labels?.remainingTimeLabel || 'Remaining time'}: {getRemainingTime()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="reward-card-footer">
        <div className="reward-points">
          <span className="lucky-points-icon">🍀</span>
          <span className="lucky-points-value">{reward.luckyPoints} {labels?.luckyPointsLabel || 'Lucky Points'}</span>
        </div>

        {reward.status === TimelyRewardStatus.ACTIVE && (
          <button
            className="complete-reward-button"
            onClick={handleComplete}
            disabled={reward.progress < 100}
          >
            {reward.progress >= 100 ? (labels?.claimRewardButton || 'Claim Reward') : (labels?.inProgressButton || 'In Progress...')}
          </button>
        )}
        {reward.status === TimelyRewardStatus.COMPLETED && (
          <div className="reward-completed-info">
            <span className="completion-date">
              {labels?.completedOnLabel || 'Completed on'}: {formatTime(reward.completedTime!)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TimelyRewardCard;
