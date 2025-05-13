// src/components/game/ChallengeList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChallengeRecord,
  ChallengeStatus,
  ChallengeType,
  ChallengeDifficulty,
  getAllChallenges,
  completeChallenge
} from '@/services/challengeService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import ChallengeCard from './ChallengeCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RewardModal from '@/components/game/RewardModal';
import { RewardRecord } from '@/services/rewardService';
import ScrollDialog from './ScrollDialog';

interface ChallengeListProps {
  filter?: {
    status?: ChallengeStatus;
    type?: ChallengeType;
    difficulty?: ChallengeDifficulty;
  };
  onSelectChallenge?: (challenge: ChallengeRecord) => void;
}

/**
 * 挑战列表组件
 * 显示挑战列表，支持过滤和选择
 */
const ChallengeList: React.FC<ChallengeListProps> = ({ filter, onSelectChallenge }) => {
  const [challenges, setChallenges] = useState<ChallengeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeRecord | null>(null);
  const [showChallengeDetails, setShowChallengeDetails] = useState(false);

  // 加载挑战
  const loadChallenges = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const challengeList = await getAllChallenges(filter);
      setChallenges(challengeList);
    } catch (err) {
      console.error('Failed to load challenges:', err);
      setError('加载挑战失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  // 初始加载
  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  // 定义挑战数据更新处理函数
  const handleChallengeDataUpdate = useCallback((challengeData: any) => {
    // 如果有特定挑战数据，则更新该挑战
    if (challengeData && challengeData.id) {
      setChallenges(prevChallenges => {
        // 检查挑战是否已存在
        const challengeExists = prevChallenges.some(challenge => challenge.id === challengeData.id);

        if (challengeExists) {
          // 更新现有挑战
          return prevChallenges.map(challenge =>
            challenge.id === challengeData.id ? { ...challenge, ...challengeData } : challenge
          );
        } else {
          // 添加新挑战（如果符合过滤条件）
          if (!filter ||
              ((!filter.status || challengeData.status === filter.status) &&
               (!filter.type || challengeData.type === filter.type) &&
               (!filter.difficulty || challengeData.difficulty === filter.difficulty))) {
            return [...prevChallenges, challengeData];
          }
          return prevChallenges;
        }
      });
    } else {
      // 如果没有特定挑战数据，则重新加载所有挑战
      loadChallenges();
    }
  }, [loadChallenges, filter]);

  // 使用 useRegisterTableRefresh hook 监听挑战表的变化
  useRegisterTableRefresh('challenges', handleChallengeDataUpdate);

  // 处理选择挑战
  const handleSelectChallenge = (challenge: ChallengeRecord) => {
    setSelectedChallenge(challenge);
    setShowChallengeDetails(true);

    if (onSelectChallenge) {
      onSelectChallenge(challenge);
    }
  };

  // 处理完成挑战
  const handleCompleteChallenge = async (challengeId: number) => {
    try {
      setIsLoading(true);

      // 完成挑战并获取奖励
      const challengeRewards = await completeChallenge(challengeId);

      // 更新挑战列表
      setChallenges(prevChallenges =>
        prevChallenges.map(challenge =>
          challenge.id === challengeId
            ? {
                ...challenge,
                status: ChallengeStatus.COMPLETED,
                progress: 100,
                completedDate: new Date()
              }
            : challenge
        )
      );

      // 显示奖励
      if (challengeRewards && challengeRewards.length > 0) {
        setRewards(challengeRewards);
        setShowRewardModal(true);
      }
    } catch (err) {
      console.error('Failed to complete challenge:', err);
      setError('完成挑战失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 关闭奖励模态框
  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
  };

  // 关闭挑战详情
  const handleCloseChallengeDetails = () => {
    setShowChallengeDetails(false);
    setSelectedChallenge(null);
  };

  // 如果正在加载，显示加载动画
  if (isLoading && challenges.length === 0) {
    return <LoadingSpinner />;
  }

  // 如果有错误，显示错误信息
  if (error && challenges.length === 0) {
    return <div className="error-message">{error}</div>;
  }

  // 如果没有挑战，显示提示信息
  if (challenges.length === 0) {
    return <div className="no-challenges-message">暂无挑战</div>;
  }

  return (
    <div className="challenge-list">
      <AnimatePresence>
        {challenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onClick={handleSelectChallenge}
            onComplete={handleCompleteChallenge}
          />
        ))}
      </AnimatePresence>

      {/* 奖励模态框 */}
      {showRewardModal && (
        <RewardModal
          rewards={rewards}
          onClose={handleCloseRewardModal}
        />
      )}

      {/* 挑战详情 */}
      {showChallengeDetails && selectedChallenge && (
        <ScrollDialog
          title={selectedChallenge.title}
          onClose={handleCloseChallengeDetails}
        >
          <div className="challenge-details">
            <div className="challenge-header">
              <img
                src={selectedChallenge.iconPath}
                alt={selectedChallenge.title}
                className="challenge-icon-large"
              />
              <div className="challenge-meta-details">
                <div className="challenge-difficulty">
                  难度: {selectedChallenge.difficulty}
                </div>
                <div className="challenge-type">
                  类型: {selectedChallenge.type}
                </div>
                <div className="challenge-status">
                  状态: {selectedChallenge.status}
                </div>
              </div>
            </div>

            <div className="challenge-description-full">
              {selectedChallenge.description}
            </div>

            <div className="challenge-progress-details">
              <h4>进度: {selectedChallenge.progress}%</h4>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${selectedChallenge.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="challenge-dates-details">
              <div>开始日期: {selectedChallenge.startDate.toLocaleDateString()}</div>
              {selectedChallenge.endDate && (
                <div>结束日期: {selectedChallenge.endDate.toLocaleDateString()}</div>
              )}
              {selectedChallenge.completedDate && (
                <div>完成日期: {selectedChallenge.completedDate.toLocaleDateString()}</div>
              )}
            </div>

            {selectedChallenge.status === ChallengeStatus.ACTIVE && (
              <button
                className="complete-challenge-button-large"
                onClick={() => handleCompleteChallenge(selectedChallenge.id!)}
                disabled={selectedChallenge.progress < 100}
              >
                {selectedChallenge.progress >= 100 ? '完成挑战' : '继续努力'}
              </button>
            )}
          </div>
        </ScrollDialog>
      )}
    </div>
  );
};

export default ChallengeList;
