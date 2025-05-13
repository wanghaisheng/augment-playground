// src/components/game/ChallengeCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChallengeRecord, ChallengeStatus, ChallengeDifficulty } from '@/services/challengeService';
import ProgressBar from '@/components/common/ProgressBar';
import { formatTime } from '@/utils/dateUtils';

interface ChallengeCardProps {
  challenge: ChallengeRecord;
  onClick?: (challenge: ChallengeRecord) => void;
  onComplete?: (challengeId: number) => void;
}

/**
 * 挑战卡片组件
 * 显示挑战的基本信息和进度
 */
const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onClick, onComplete }) => {
  // 获取挑战状态对应的样式类
  const getStatusClass = () => {
    switch (challenge.status) {
      case ChallengeStatus.ACTIVE:
        return 'challenge-active';
      case ChallengeStatus.COMPLETED:
        return 'challenge-completed';
      case ChallengeStatus.EXPIRED:
        return 'challenge-expired';
      case ChallengeStatus.UPCOMING:
        return 'challenge-upcoming';
      default:
        return '';
    }
  };

  // 获取挑战难度对应的样式类
  const getDifficultyClass = () => {
    switch (challenge.difficulty) {
      case ChallengeDifficulty.EASY:
        return 'difficulty-easy';
      case ChallengeDifficulty.MEDIUM:
        return 'difficulty-medium';
      case ChallengeDifficulty.HARD:
        return 'difficulty-hard';
      case ChallengeDifficulty.EXPERT:
        return 'difficulty-expert';
      default:
        return '';
    }
  };

  // 获取挑战难度对应的文本
  const getDifficultyText = () => {
    switch (challenge.difficulty) {
      case ChallengeDifficulty.EASY:
        return '简单';
      case ChallengeDifficulty.MEDIUM:
        return '中等';
      case ChallengeDifficulty.HARD:
        return '困难';
      case ChallengeDifficulty.EXPERT:
        return '专家';
      default:
        return '';
    }
  };

  // 获取挑战状态对应的文本
  const getStatusText = () => {
    switch (challenge.status) {
      case ChallengeStatus.ACTIVE:
        return '进行中';
      case ChallengeStatus.COMPLETED:
        return '已完成';
      case ChallengeStatus.EXPIRED:
        return '已过期';
      case ChallengeStatus.UPCOMING:
        return '即将开始';
      default:
        return '';
    }
  };

  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick(challenge);
    }
  };

  // 处理完成挑战事件
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (onComplete && challenge.status === ChallengeStatus.ACTIVE) {
      onComplete(challenge.id!);
    }
  };

  return (
    <motion.div
      className={`challenge-card ${getStatusClass()} ${getDifficultyClass()}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="challenge-card-header">
        <div className="challenge-icon">
          <img src={challenge.iconPath} alt={challenge.title} />
        </div>
        <div className="challenge-title-section">
          <h3 className="challenge-title">{challenge.title}</h3>
          <div className="challenge-meta">
            <span className={`challenge-difficulty ${getDifficultyClass()}`}>
              {getDifficultyText()}
            </span>
            <span className={`challenge-status ${getStatusClass()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      <div className="challenge-card-body">
        <p className="challenge-description">{challenge.description}</p>

        <div className="challenge-progress-section">
          <ProgressBar
            progress={challenge.progress}
            total={100}
            showPercentage
            className={getStatusClass()}
          />
          <div className="challenge-dates">
            <span>开始: {formatTime(challenge.startDate, false)}</span>
            {challenge.endDate && (
              <span>结束: {formatTime(challenge.endDate, false)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="challenge-card-footer">
        {challenge.status === ChallengeStatus.ACTIVE && (
          <button
            className="complete-challenge-button"
            onClick={handleComplete}
            disabled={challenge.progress < 100}
          >
            {challenge.progress >= 100 ? '完成挑战' : '进行中...'}
          </button>
        )}
        {challenge.status === ChallengeStatus.COMPLETED && (
          <div className="challenge-completed-info">
            <span className="completion-date">
              完成于: {formatTime(challenge.completedDate!, false)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChallengeCard;
