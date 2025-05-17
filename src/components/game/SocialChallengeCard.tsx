// src/components/game/SocialChallengeCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { SocialChallengeRecord, SocialChallengeType } from '@/services/socialChallengeService';
import { ChallengeDifficulty, ChallengeStatus } from '@/services/challengeService';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';

interface SocialChallengeCardProps {
  challenge: SocialChallengeRecord;
  isParticipant?: boolean;
  onJoin?: (challengeId: number) => void;
  onLeave?: (challengeId: number) => void;
  onViewDetails?: (challengeId: number) => void;
  onShare?: (challengeId: number, inviteCode: string) => void;
}

/**
 * 社交挑战卡片组件
 * 用于显示社交挑战和相关操作
 */
const SocialChallengeCard: React.FC<SocialChallengeCardProps> = ({
  challenge,
  isParticipant = false,
  onJoin,
  onLeave,
  onViewDetails,
  onShare
}) => {
  // 处理加入挑战
  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.5);

    // 通知父组件
    if (onJoin) {
      onJoin(challenge.id!);
    }
  };

  // 处理离开挑战
  const handleLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.5);

    // 通知父组件
    if (onLeave) {
      onLeave(challenge.id!);
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

  // 处理分享挑战
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.5);

    // 通知父组件
    if (onShare && challenge.inviteCode) {
      onShare(challenge.id!, challenge.inviteCode);
    }
  };

  // 获取挑战类型标签和样式
  const getTypeInfo = (type: SocialChallengeType) => {
    switch (type) {
      case SocialChallengeType.COOPERATIVE:
        return { label: '合作', className: 'bg-green-100 text-green-800' };
      case SocialChallengeType.COMPETITIVE:
        return { label: '竞争', className: 'bg-red-100 text-red-800' };
      case SocialChallengeType.TEAM:
        return { label: '团队', className: 'bg-blue-100 text-blue-800' };
      default:
        return { label: '未知', className: 'bg-gray-100 text-gray-800' };
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

  // 获取状态标签和样式
  const getStatusInfo = (status: ChallengeStatus) => {
    switch (status) {
      case ChallengeStatus.ACTIVE:
        return { label: '进行中', className: 'bg-green-100 text-green-800' };
      case ChallengeStatus.COMPLETED:
        return { label: '已完成', className: 'bg-blue-100 text-blue-800' };
      case ChallengeStatus.FAILED:
        return { label: '失败', className: 'bg-red-100 text-red-800' };
      case ChallengeStatus.UPCOMING:
        return { label: '即将开始', className: 'bg-amber-100 text-amber-800' };
      default:
        return { label: '未知', className: 'bg-gray-100 text-gray-800' };
    }
  };

  const typeInfo = getTypeInfo(challenge.type);
  const difficultyInfo = getDifficultyInfo(challenge.difficulty);
  const statusInfo = getStatusInfo(challenge.status);

  return (
    <motion.div
      className="social-challenge-card border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleViewDetails}
    >
      {/* 卡片头部 */}
      <div className="card-header p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="challenge-icon-title flex items-center">
            <div className="challenge-icon mr-3">
              <img
                src={challenge.iconPath || '/assets/challenges/social_default.svg'}
                alt={challenge.title}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/assets/challenges/social_default.svg';
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">{challenge.title}</h3>
              <div className="challenge-meta flex flex-wrap gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs ${typeInfo.className}`}>
                  {typeInfo.label}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${difficultyInfo.className}`}>
                  {difficultyInfo.label}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>
                {challenge.isPublic ? (
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    公开
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    私密
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="challenge-participants">
            <span className="text-sm text-gray-600">
              {challenge.participantIds.length}/{challenge.maxParticipants} 参与者
            </span>
          </div>
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="card-content p-4">
        <div className="challenge-description mb-4">
          <p className="text-sm text-gray-700 line-clamp-3">{challenge.description}</p>
        </div>

        <div className="challenge-progress mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">进度</span>
            <span className="text-xs font-bold">{challenge.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-jade-500 h-2.5 rounded-full"
              style={{ width: `${challenge.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="challenge-dates text-xs text-gray-500 mb-2">
          <p>开始日期: {new Date(challenge.startDate).toLocaleDateString()}</p>
          {challenge.endDate && (
            <p>结束日期: {new Date(challenge.endDate).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      {/* 卡片底部 */}
      <div className="card-footer bg-gray-50 p-3 border-t border-gray-200 flex justify-end gap-2">
        {isParticipant ? (
          <>
            {challenge.inviteCode && (
              <Button
                variant="secondary"
                size="small"
                onClick={handleShare}
              >
                分享
              </Button>
            )}
            {challenge.status === ChallengeStatus.ACTIVE && challenge.creatorId !== 'current-user' && (
              <Button
                variant="error"
                size="small"
                onClick={handleLeave}
              >
                退出
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="jade"
            size="small"
            onClick={handleJoin}
            disabled={
              challenge.status !== ChallengeStatus.ACTIVE ||
              challenge.participantIds.length >= challenge.maxParticipants
            }
          >
            加入
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default SocialChallengeCard;
