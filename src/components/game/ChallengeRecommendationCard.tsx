// src/components/game/ChallengeRecommendationCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChallengeRecommendation } from '@/services/challengeDiscoveryService';
import { ChallengeDifficulty } from '@/services/challengeService';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import { ChallengeRecommendationCardLabels } from '@/types';

interface ChallengeRecommendationCardProps {
  recommendation: ChallengeRecommendation;
  onAccept?: (challengeId: number) => void;
  onViewDetails?: (challengeId: number) => void;
  labels?: ChallengeRecommendationCardLabels;
}

/**
 * Challenge recommendation card component
 * Used to display recommended challenges and related actions
 *
 * @param recommendation - Challenge recommendation data
 * @param onAccept - Callback function when challenge is accepted
 * @param onViewDetails - Callback function when challenge details are viewed
 * @param labels - Localized labels for the component
 */
const ChallengeRecommendationCard: React.FC<ChallengeRecommendationCardProps> = ({
  recommendation,
  onAccept,
  onViewDetails,
  labels
}) => {
  // Add console log to check labels
  console.log('ChallengeRecommendationCard labels:', labels);
  const { challenge, score, reason } = recommendation;

  // 处理接受挑战
  const handleAccept = () => {
    // 播放成功音效
    playSound(SoundType.SUCCESS, 0.5);

    // 通知父组件
    if (onAccept) {
      onAccept(challenge.id!);
    }
  };

  // 处理查看详情
  const handleViewDetails = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    // 通知父组件
    if (onViewDetails) {
      onViewDetails(challenge.id!);
    }
  };

  // Get difficulty label and style with localization
  const getDifficultyInfo = (difficulty: ChallengeDifficulty) => {
    switch (difficulty) {
      case ChallengeDifficulty.EASY:
        return {
          label: labels?.difficultyEasy || 'Easy',
          className: 'bg-green-100 text-green-800'
        };
      case ChallengeDifficulty.MEDIUM:
        return {
          label: labels?.difficultyMedium || 'Medium',
          className: 'bg-blue-100 text-blue-800'
        };
      case ChallengeDifficulty.HARD:
        return {
          label: labels?.difficultyHard || 'Hard',
          className: 'bg-orange-100 text-orange-800'
        };
      case ChallengeDifficulty.EXPERT:
        return {
          label: labels?.difficultyExpert || 'Expert',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          label: labels?.difficultyUnknown || 'Unknown',
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  // 获取推荐分数样式
  const getScoreStyle = (score: number) => {
    if (score >= 30) {
      return 'text-green-600';
    } else if (score >= 20) {
      return 'text-blue-600';
    } else if (score >= 10) {
      return 'text-amber-600';
    } else {
      return 'text-gray-600';
    }
  };

  return (
    <motion.div
      className="challenge-recommendation-card border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 卡片头部 */}
      <div className="card-header bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-md font-bold">{challenge.title}</h3>
        <div className="recommendation-score">
          <span className={`text-sm font-bold ${getScoreStyle(score)}`}>
            {labels?.matchScoreLabel || 'Match Score'}: {Math.min(100, Math.round(score * 2))}%
          </span>
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="card-content p-3">
        <div className="challenge-meta flex flex-wrap gap-2 mb-2">
          {challenge.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyInfo(challenge.difficulty).className}`}>
              {getDifficultyInfo(challenge.difficulty).label}
            </span>
          )}
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
          </span>
        </div>

        <div className="challenge-description mb-2">
          <p className="text-sm text-gray-700 line-clamp-2">{challenge.description}</p>
        </div>

        <div className="recommendation-reason mb-3">
          <p className="text-xs text-gray-600 italic">{reason}</p>
        </div>

        <div className="challenge-dates text-xs text-gray-500 mb-2">
          <p>{labels?.startDateLabel || 'Start Date'}: {new Date(challenge.startDate).toLocaleDateString()}</p>
          {challenge.endDate && (
            <p>{labels?.endDateLabel || 'End Date'}: {new Date(challenge.endDate).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      {/* 卡片底部 */}
      <div className="card-footer bg-gray-50 p-2 border-t border-gray-200 flex justify-end gap-2">
        <Button
          variant="secondary"
          size="small"
          onClick={handleViewDetails}
        >
          {labels?.viewDetailsButton || 'View Details'}
        </Button>
        <Button
          variant="jade"
          size="small"
          onClick={handleAccept}
        >
          {labels?.acceptButton || 'Accept Challenge'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ChallengeRecommendationCard;
