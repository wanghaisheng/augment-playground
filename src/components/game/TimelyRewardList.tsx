// src/components/game/TimelyRewardList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  TimelyRewardRecord,
  TimelyRewardStatus,
  TimelyRewardType,
  getAllTimelyRewards,
  completeTimelyReward,
  updateTimelyRewardsStatus
} from '@/services/timelyRewardService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import TimelyRewardCard from './TimelyRewardCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RewardModal from '@/components/game/RewardModal';
import { RewardRecord } from '@/services/rewardService';
import ScrollDialog from './ScrollDialog';
import LuckyPointsDisplay from './LuckyPointsDisplay';
import { TimelyRewardCardLabels } from '@/types';

interface TimelyRewardListProps {
  filter?: {
    status?: TimelyRewardStatus;
    type?: TimelyRewardType;
  };
  onSelectReward?: (reward: TimelyRewardRecord) => void;
  labels?: TimelyRewardCardLabels;
}

/**
 * Timely reward list component
 * Displays a list of timely rewards with filtering and selection support
 */
const TimelyRewardList: React.FC<TimelyRewardListProps> = ({ filter, onSelectReward, labels }) => {
  // Add console log to check labels
  console.log('TimelyRewardList labels:', labels);
  const [rewards, setRewards] = useState<TimelyRewardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [earnedRewards, setEarnedRewards] = useState<RewardRecord[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<TimelyRewardRecord | null>(null);
  const [showRewardDetails, setShowRewardDetails] = useState(false);

  // 加载及时奖励
  const loadTimelyRewards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 更新及时奖励状态
      await updateTimelyRewardsStatus();

      // 获取及时奖励列表
      const rewardList = await getAllTimelyRewards(filter);
      setRewards(rewardList);
    } catch (err) {
      console.error('Failed to load timely rewards:', err);
      setError('Failed to load timely rewards, please try again');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  // 初始加载
  useEffect(() => {
    loadTimelyRewards();
  }, [loadTimelyRewards]);

  // 定义奖励数据更新处理函数
  const handleRewardDataUpdate = useCallback((rewardData: any) => {
    // 如果有特定奖励数据，则更新该奖励
    if (rewardData && rewardData.id) {
      setRewards(prevRewards => {
        // 检查奖励是否已存在
        const rewardExists = prevRewards.some(reward => reward.id === rewardData.id);

        if (rewardExists) {
          // 更新现有奖励
          return prevRewards.map(reward =>
            reward.id === rewardData.id ? { ...reward, ...rewardData } : reward
          );
        } else {
          // 添加新奖励（如果符合过滤条件）
          if (!filter ||
              ((!filter.status || rewardData.status === filter.status) &&
               (!filter.type || rewardData.type === filter.type))) {
            return [...prevRewards, rewardData];
          }
          return prevRewards;
        }
      });
    } else {
      // 如果没有特定奖励数据，则重新加载所有奖励
      loadTimelyRewards();
    }
  }, [loadTimelyRewards, filter]);

  // 使用 useRegisterTableRefresh hook 监听及时奖励表的变化
  useRegisterTableRefresh('timelyRewards', handleRewardDataUpdate);

  // 处理选择奖励
  const handleSelectReward = (reward: TimelyRewardRecord) => {
    setSelectedReward(reward);
    setShowRewardDetails(true);

    if (onSelectReward) {
      onSelectReward(reward);
    }
  };

  // Get type text for a reward with localization
  const getTypeTextForReward = (reward: TimelyRewardRecord) => {
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

  // Get status text for a reward with localization
  const getStatusTextForReward = (reward: TimelyRewardRecord) => {
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

  // 处理完成奖励
  const handleCompleteReward = async (rewardId: number) => {
    try {
      setIsLoading(true);

      // 完成奖励并获取奖励
      const rewards = await completeTimelyReward(rewardId);

      // 更新奖励列表
      setRewards(prevRewards =>
        prevRewards.map(reward =>
          reward.id === rewardId
            ? {
                ...reward,
                status: TimelyRewardStatus.COMPLETED,
                progress: 100,
                completedTime: new Date()
              }
            : reward
        )
      );

      // 显示奖励
      if (rewards && rewards.length > 0) {
        setEarnedRewards(rewards);
        setShowRewardModal(true);
      }
    } catch (err) {
      console.error('Failed to complete timely reward:', err);
      setError('Failed to complete timely reward, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  // 关闭奖励模态框
  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
  };

  // 关闭奖励详情
  const handleCloseRewardDetails = () => {
    setShowRewardDetails(false);
    setSelectedReward(null);
  };

  // 如果正在加载，显示加载动画
  if (isLoading && rewards.length === 0) {
    return <LoadingSpinner />;
  }

  // 如果有错误，显示错误信息
  if (error && rewards.length === 0) {
    return <div className="error-message">{error}</div>;
  }

  // 如果没有奖励，显示提示信息
  if (rewards.length === 0) {
    return <div className="no-rewards-message">{labels?.noRewardsMessage || "No timely rewards available"}</div>;
  }

  return (
    <div className="timely-reward-list">
      <div className="lucky-points-container">
        <LuckyPointsDisplay />
      </div>

      <AnimatePresence>
        {rewards.map(reward => (
          <TimelyRewardCard
            key={reward.id}
            reward={reward}
            onClick={handleSelectReward}
            onComplete={handleCompleteReward}
            labels={labels}
          />
        ))}
      </AnimatePresence>

      {/* 奖励模态框 */}
      {showRewardModal && (
        <RewardModal
          rewards={earnedRewards}
          onClose={handleCloseRewardModal}
          isOpen={showRewardModal}
        />
      )}

      {/* 奖励详情 */}
      {showRewardDetails && selectedReward && (
        <ScrollDialog
          title={selectedReward.title}
          onClose={handleCloseRewardDetails}
          isOpen={showRewardDetails}
        >
          <div className="reward-details">
            <div className="reward-header">
              <img
                src={selectedReward.iconPath}
                alt={selectedReward.title}
                className="reward-icon-large"
              />
              <div className="reward-meta-details">
                <div className="reward-type">
                  {labels?.typeLabel || "Type"}: {getTypeTextForReward(selectedReward)}
                </div>
                <div className="reward-status">
                  {labels?.statusLabel || "Status"}: {getStatusTextForReward(selectedReward)}
                </div>
                <div className="reward-lucky-points">
                  {labels?.luckyPointsLabel || "Lucky Points"}: {selectedReward.luckyPoints}
                </div>
              </div>
            </div>

            <div className="reward-description-full">
              {selectedReward.description}
            </div>

            <div className="reward-progress-details">
              <h4>{labels?.progressLabel || "Progress"}: {selectedReward.progress}%</h4>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${selectedReward.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="reward-time-details">
              <div>{labels?.startTimeLabel || "Start Time"}: {new Date(selectedReward.startTime).toLocaleString()}</div>
              <div>{labels?.endTimeLabel || "End Time"}: {new Date(selectedReward.endTime).toLocaleString()}</div>
              {selectedReward.completedTime && (
                <div>{labels?.completedTimeLabel || "Completed Time"}: {new Date(selectedReward.completedTime).toLocaleString()}</div>
              )}
            </div>

            {selectedReward.status === TimelyRewardStatus.ACTIVE && (
              <button
                className="complete-reward-button-large"
                onClick={() => handleCompleteReward(selectedReward.id!)}
                disabled={selectedReward.progress < 100}
              >
                {selectedReward.progress >= 100
                  ? (labels?.claimRewardButton || 'Claim Reward')
                  : (labels?.continueEffortButton || 'Keep Going')}
              </button>
            )}
          </div>
        </ScrollDialog>
      )}
    </div>
  );
};

export default TimelyRewardList;
