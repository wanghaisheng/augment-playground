// src/components/game/TimelyRewardCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TimelyRewardRecord, TimelyRewardStatus, TimelyRewardType } from '@/services/timelyRewardService';
import ProgressBar from '@/components/common/ProgressBar';
import { formatTime } from '@/utils/dateUtils';

interface TimelyRewardCardProps {
  reward: TimelyRewardRecord;
  onClick?: (reward: TimelyRewardRecord) => void;
  onComplete?: (rewardId: number) => void;
}

/**
 * 及时奖励卡片组件
 * 显示及时奖励的基本信息和进度
 */
const TimelyRewardCard: React.FC<TimelyRewardCardProps> = ({ reward, onClick, onComplete }) => {
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

  // 获取奖励类型对应的文本
  const getTypeText = () => {
    switch (reward.type) {
      case TimelyRewardType.DAILY:
        return '每日奖励';
      case TimelyRewardType.MORNING:
        return '早起鸟奖励';
      case TimelyRewardType.STREAK:
        return '连续完成奖励';
      case TimelyRewardType.SPECIAL:
        return '特殊奖励';
      default:
        return '';
    }
  };

  // 获取奖励状态对应的文本
  const getStatusText = () => {
    switch (reward.status) {
      case TimelyRewardStatus.ACTIVE:
        return '进行中';
      case TimelyRewardStatus.COMPLETED:
        return '已完成';
      case TimelyRewardStatus.EXPIRED:
        return '已过期';
      case TimelyRewardStatus.UPCOMING:
        return '即将开始';
      default:
        return '';
    }
  };

  // 计算剩余时间
  const getRemainingTime = () => {
    const now = new Date();
    const endTime = new Date(reward.endTime);
    
    if (now > endTime) {
      return '已结束';
    }
    
    const diffMs = endTime.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}小时${diffMins}分钟`;
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
                剩余时间: {getRemainingTime()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="reward-card-footer">
        <div className="reward-points">
          <span className="lucky-points-icon">🍀</span>
          <span className="lucky-points-value">{reward.luckyPoints} 幸运点</span>
        </div>
        
        {reward.status === TimelyRewardStatus.ACTIVE && (
          <button 
            className="complete-reward-button"
            onClick={handleComplete}
            disabled={reward.progress < 100}
          >
            {reward.progress >= 100 ? '领取奖励' : '进行中...'}
          </button>
        )}
        {reward.status === TimelyRewardStatus.COMPLETED && (
          <div className="reward-completed-info">
            <span className="completion-date">
              完成于: {formatTime(reward.completedTime!)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TimelyRewardCard;
