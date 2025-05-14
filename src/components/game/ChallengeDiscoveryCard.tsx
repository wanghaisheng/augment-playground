// src/components/game/ChallengeDiscoveryCard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChallengeDiscovery, markDiscoveryAsViewed, acceptChallenge } from '@/services/challengeDiscoveryService';
import { ChallengeRecord, getChallenge, ChallengeDifficulty } from '@/services/challengeService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import { ChallengeDiscoveryCardLabels } from '@/types';

interface ChallengeDiscoveryCardProps {
  discovery: ChallengeDiscovery;
  onAccept?: () => void;
  onDecline?: () => void;
  onClose?: () => void;
  labels?: ChallengeDiscoveryCardLabels;
}

/**
 * Challenge discovery card component
 * Used to display discovered challenges and related actions
 *
 * @param discovery - Challenge discovery data
 * @param onAccept - Callback function when challenge is accepted
 * @param onDecline - Callback function when challenge is declined
 * @param onClose - Callback function when card is closed
 * @param labels - Localized labels for the component
 */
const ChallengeDiscoveryCard: React.FC<ChallengeDiscoveryCardProps> = ({
  discovery,
  onAccept,
  onDecline,
  onClose,
  labels
}) => {
  // Add console log to check labels
  console.log('ChallengeDiscoveryCard labels:', labels);
  const [challenge, setChallenge] = useState<ChallengeRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // 加载挑战数据
  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 获取挑战数据
        const challengeData = await getChallenge(discovery.challengeId);
        if (challengeData) {
          setChallenge(challengeData);

          // 标记为已查看
          if (!discovery.isViewed) {
            await markDiscoveryAsViewed(discovery.id!);
          }
        } else {
          setError(labels?.cannotLoadChallenge || 'Unable to load challenge data');
        }
      } catch (err) {
        console.error('Failed to load challenge:', err);
        setError(labels?.errorLoadingChallenge || 'Failed to load challenge, please try again');
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [discovery]);

  // 处理接受挑战
  const handleAccept = async () => {
    try {
      setIsAccepting(true);

      // 接受挑战
      await acceptChallenge(discovery.id!);

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 触发关闭动画
      setIsVisible(false);

      // 通知父组件
      if (onAccept) {
        setTimeout(() => {
          onAccept();
        }, 300); // 等待关闭动画完成
      }
    } catch (err) {
      console.error('Failed to accept challenge:', err);
      setError('接受挑战失败，请重试');
    } finally {
      setIsAccepting(false);
    }
  };

  // 处理拒绝挑战
  const handleDecline = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    // 触发关闭动画
    setIsVisible(false);

    // 通知父组件
    if (onDecline) {
      setTimeout(() => {
        onDecline();
      }, 300); // 等待关闭动画完成
    }
  };

  // 处理关闭卡片
  const handleClose = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    // 触发关闭动画
    setIsVisible(false);

    // 通知父组件
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 300); // 等待关闭动画完成
    }
  };

  // 获取难度标签和样式
  const getDifficultyInfo = (difficulty: ChallengeDifficulty) => {
    switch (difficulty) {
      case ChallengeDifficulty.EASY:
        return { label: '简单', className: 'bg-green-100 text-green-800' };
      case ChallengeDifficulty.MEDIUM:
        return { label: '中等', className: 'bg-blue-100 text-blue-800' };
      case ChallengeDifficulty.HARD:
        return { label: '困难', className: 'bg-orange-100 text-orange-800' };
      case ChallengeDifficulty.EXPERT:
        return { label: '专家', className: 'bg-red-100 text-red-800' };
      default:
        return { label: '未知', className: 'bg-gray-100 text-gray-800' };
    }
  };

  // 计算剩余时间
  const getRemainingTime = () => {
    if (!discovery.expiresAt) return '永不过期';

    const now = new Date();
    const expiresAt = new Date(discovery.expiresAt);
    const diffMs = expiresAt.getTime() - now.getTime();

    if (diffMs <= 0) return '已过期';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays}天${diffHours}小时`;
    } else {
      return `${diffHours}小时`;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="challenge-discovery-card border-2 border-gold rounded-lg overflow-hidden bg-white shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {/* 卡片头部 */}
          <div className="card-header bg-amber-50 p-4 border-b border-amber-200 relative">
            <div className="absolute top-2 right-2">
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label={labels?.closeButtonAriaLabel || "Close"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <h3 className="text-xl font-bold text-amber-800">发现新挑战！</h3>
            <p className="text-sm text-amber-600">
              剩余时间: {getRemainingTime()}
            </p>
          </div>

          {/* 卡片内容 */}
          <div className="card-content p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner variant="jade" size="medium" />
              </div>
            ) : error ? (
              <div className="error-message text-red-500 text-center p-4">
                {error}
              </div>
            ) : challenge ? (
              <div className="challenge-info">
                <div className="challenge-header flex items-center mb-3">
                  <div className="challenge-icon mr-3">
                    <img
                      src={challenge.iconPath}
                      alt={challenge.title}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/assets/challenges/default.svg';
                      }}
                    />
                  </div>
                  <div className="challenge-title-container">
                    <h4 className="text-lg font-bold">{challenge.title}</h4>
                    <div className="challenge-meta flex flex-wrap gap-2 mt-1">
                      {challenge.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyInfo(challenge.difficulty).className}`}>
                          {getDifficultyInfo(challenge.difficulty).label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="challenge-description mb-4">
                  <p className="text-gray-700">{challenge.description}</p>
                </div>

                <div className="challenge-dates text-sm text-gray-600 mb-4">
                  <p>{labels?.startDateLabel || 'Start Date'}: {new Date(challenge.startDate).toLocaleDateString()}</p>
                  {challenge.endDate && (
                    <p>{labels?.endDateLabel || 'End Date'}: {new Date(challenge.endDate).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                {labels?.cannotLoadChallenge || 'Unable to load challenge information'}
              </div>
            )}
          </div>

          {/* 卡片底部 */}
          <div className="card-footer bg-gray-50 p-4 border-t border-gray-200 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={handleDecline}
              disabled={isAccepting}
            >
              {labels?.laterButton || 'Maybe Later'}
            </Button>
            <Button
              variant="jade"
              onClick={handleAccept}
              disabled={isAccepting || !challenge}
            >
              {isAccepting ? (
                <LoadingSpinner variant="white" size="small" />
              ) : (
                labels?.acceptButton || 'Accept Challenge'
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChallengeDiscoveryCard;
