// src/components/game/ChallengeDiscoverySection.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getRecommendedChallenges,
  getUnviewedDiscoveries,
  ChallengeRecommendation,
  ChallengeDiscovery
} from '@/services/challengeDiscoveryService';
import { updateChallenge, ChallengeStatus } from '@/services/challengeService';
import ChallengeRecommendationCard from './ChallengeRecommendationCard';
import ChallengeDiscoveryCard from './ChallengeDiscoveryCard';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { ChallengeDiscoveryCardLabels, ChallengeRecommendationCardLabels } from '@/types';

interface ChallengeDiscoverySectionProps {
  onChallengeAccepted?: () => void;
  onChallengeViewed?: (challengeId: number) => void;
  labels?: {
    challengeDiscoveryCard?: ChallengeDiscoveryCardLabels;
    challengeRecommendationCard?: ChallengeRecommendationCardLabels;
  };
}

/**
 * Challenge discovery section component
 * Used to display challenge discoveries and recommendations
 *
 * @param onChallengeAccepted - Callback function when a challenge is accepted
 * @param onChallengeViewed - Callback function when a challenge is viewed
 * @param labels - Localized labels for the component
 */
const ChallengeDiscoverySection: React.FC<ChallengeDiscoverySectionProps> = ({
  onChallengeAccepted,
  onChallengeViewed,
  labels
}) => {
  // 移除不必要的控制台日志
  // console.log('ChallengeDiscoverySection labels:', labels);
  const [recommendations, setRecommendations] = useState<ChallengeRecommendation[]>([]);
  const [discoveries, setDiscoveries] = useState<ChallengeDiscovery[]>([]);
  const [currentDiscoveryIndex, setCurrentDiscoveryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // 加载推荐和发现
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取未查看的挑战发现
      const unviewedDiscoveries = await getUnviewedDiscoveries();
      setDiscoveries(unviewedDiscoveries);

      // 获取推荐的挑战
      const recommendedChallenges = await getRecommendedChallenges('current-user');
      // Convert ChallengeRecord[] to ChallengeRecommendation[]
      const recommendationsData = recommendedChallenges.slice(0, 3).map(challenge => ({
        challenge,
        score: 0,
        reason: ''
      }));
      setRecommendations(recommendationsData);
    } catch (err) {
      console.error('Failed to load challenge discoveries:', err);
      setError('加载挑战发现失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadData();
  }, []);

  // 注册数据刷新监听
  useRegisterTableRefresh('challengeDiscoveries', loadData);
  useRegisterTableRefresh('challenges', loadData);

  // 处理接受挑战
  const handleAcceptChallenge = async (challengeId: number) => {
    try {
      // 更新挑战状态为活跃
      await updateChallenge(challengeId, {
        status: ChallengeStatus.ACTIVE
      });

      // 重新加载数据
      await loadData();

      // 通知父组件
      if (onChallengeAccepted) {
        onChallengeAccepted();
      }
    } catch (err) {
      console.error('Failed to accept challenge:', err);
      setError('接受挑战失败，请重试');
    }
  };

  // 处理查看挑战详情
  const handleViewChallengeDetails = (challengeId: number) => {
    // 通知父组件
    if (onChallengeViewed) {
      onChallengeViewed(challengeId);
    }
  };

  // 处理接受发现的挑战
  const handleAcceptDiscovery = () => {
    // 移除当前发现
    setDiscoveries(prevDiscoveries =>
      prevDiscoveries.filter((_, index) => index !== currentDiscoveryIndex)
    );

    // 重置索引
    setCurrentDiscoveryIndex(0);

    // 通知父组件
    if (onChallengeAccepted) {
      onChallengeAccepted();
    }
  };

  // 处理拒绝发现的挑战
  const handleDeclineDiscovery = () => {
    // 移除当前发现
    setDiscoveries(prevDiscoveries =>
      prevDiscoveries.filter((_, index) => index !== currentDiscoveryIndex)
    );

    // 重置索引
    setCurrentDiscoveryIndex(0);
  };

  // 处理关闭发现卡片
  const handleCloseDiscovery = () => {
    // 移除当前发现
    setDiscoveries(prevDiscoveries =>
      prevDiscoveries.filter((_, index) => index !== currentDiscoveryIndex)
    );

    // 重置索引
    setCurrentDiscoveryIndex(0);
  };

  // 切换显示推荐
  const toggleRecommendations = () => {
    setShowRecommendations(prev => !prev);
  };

  // 当前发现
  const currentDiscovery = discoveries.length > 0 ? discoveries[currentDiscoveryIndex] : null;

  // 容器变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // 项目变体
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  if (isLoading) {
    return (
      <div className="challenge-discovery-section p-4">
        <LoadingSpinner variant="jade" size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="challenge-discovery-section p-4">
        <div className="error-message text-red-500 mb-2">{error}</div>
        <Button variant="jade" onClick={loadData}>
          重试
        </Button>
      </div>
    );
  }

  return (
    <div className="challenge-discovery-section">
      {/* 挑战发现卡片 */}
      {currentDiscovery && (
        <div className="challenge-discovery-container mb-6">
          <ChallengeDiscoveryCard
            discovery={currentDiscovery}
            onAccept={handleAcceptDiscovery}
            onDecline={handleDeclineDiscovery}
            onClose={handleCloseDiscovery}
            labels={labels?.challengeDiscoveryCard}
          />
        </div>
      )}

      {/* 挑战推荐区域 */}
      <div className="challenge-recommendations-container">
        <div className="section-header flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">推荐挑战</h3>
          <Button
            variant="secondary"
            size="small"
            onClick={toggleRecommendations}
          >
            {showRecommendations ? '隐藏推荐' : '查看推荐'}
          </Button>
        </div>

        <AnimatePresence>
          {showRecommendations && (
            <motion.div
              className="recommendations-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {recommendations.length > 0 ? (
                recommendations.map((recommendation) => (
                  <motion.div
                    key={`recommendation-${recommendation.challenge.id}`}
                    variants={itemVariants}
                  >
                    <ChallengeRecommendationCard
                      recommendation={recommendation}
                      onAccept={handleAcceptChallenge}
                      onViewDetails={handleViewChallengeDetails}
                      labels={labels?.challengeRecommendationCard}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="no-recommendations col-span-full text-center p-4 text-gray-500"
                  variants={itemVariants}
                >
                  暂无推荐挑战
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChallengeDiscoverySection;
