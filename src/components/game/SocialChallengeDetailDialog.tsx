// src/components/game/SocialChallengeDetailDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  SocialChallengeRecord,
  SocialChallengeType,
  SocialChallengeParticipation,
  getSocialChallenge,
  getChallengeParticipations,
  joinSocialChallenge,
  leaveSocialChallenge,
  contributeToChallenge
} from '@/services/socialChallengeService';
import { ChallengeDifficulty, ChallengeStatus } from '@/services/challengeService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import ScrollDialog from './ScrollDialog';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';

interface SocialChallengeDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: number;
  onChallengeUpdated?: () => void;
}

/**
 * 社交挑战详情对话框组件
 * 用于显示社交挑战的详细信息和参与者列表
 */
const SocialChallengeDetailDialog: React.FC<SocialChallengeDetailDialogProps> = ({
  isOpen,
  onClose,
  challengeId,
  onChallengeUpdated
}) => {
  const [challenge, setChallenge] = useState<SocialChallengeRecord | null>(null);
  const [participations, setParticipations] = useState<SocialChallengeParticipation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState(10);
  const [inviteCode, setInviteCode] = useState('');
  const [showInviteCode, setShowInviteCode] = useState(false);

  // 当前用户ID（在实际应用中，这应该从用户会话中获取）
  const currentUserId = 'current-user';

  // 检查当前用户是否是参与者
  const isParticipant = challenge?.participantIds.includes(currentUserId) || false;

  // 检查当前用户是否是创建者
  const isCreator = challenge?.creatorId === currentUserId;

  // 加载挑战数据
  const loadChallengeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取挑战数据
      const challengeData = await getSocialChallenge(challengeId);
      if (challengeData) {
        setChallenge(challengeData);
        setInviteCode(challengeData.inviteCode || '');

        // 获取参与记录
        const participationData = await getChallengeParticipations(challengeId);
        setParticipations(participationData);
      } else {
        setError('无法加载挑战数据');
      }
    } catch (err) {
      console.error('Failed to load challenge data:', err);
      setError('加载挑战数据失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (isOpen && challengeId) {
      loadChallengeData();
    }
  }, [isOpen, challengeId]);

  // 注册数据刷新监听
  useRegisterTableRefresh('socialChallenges', loadChallengeData);
  useRegisterTableRefresh('socialChallengeParticipations', loadChallengeData);

  // 处理加入挑战
  const handleJoin = async () => {
    if (!challenge) return;

    try {
      setIsJoining(true);
      setError(null);

      // 加入挑战
      await joinSocialChallenge(
        challengeId,
        currentUserId,
        challenge.isPublic ? undefined : inviteCode
      );

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 重新加载数据
      await loadChallengeData();

      // 通知父组件
      if (onChallengeUpdated) {
        onChallengeUpdated();
      }
    } catch (err) {
      console.error('Failed to join challenge:', err);
      setError('加入挑战失败，请重试');
    } finally {
      setIsJoining(false);
    }
  };

  // 处理离开挑战
  const handleLeave = async () => {
    try {
      setIsLeaving(true);
      setError(null);

      // 离开挑战
      await leaveSocialChallenge(challengeId, currentUserId);

      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.5);

      // 重新加载数据
      await loadChallengeData();

      // 通知父组件
      if (onChallengeUpdated) {
        onChallengeUpdated();
      }
    } catch (err) {
      console.error('Failed to leave challenge:', err);
      setError('离开挑战失败，请重试');
    } finally {
      setIsLeaving(false);
    }
  };

  // 处理贡献进度
  const handleContribute = async () => {
    try {
      setIsContributing(true);
      setError(null);

      // 贡献进度
      await contributeToChallenge(challengeId, currentUserId, contributionAmount);

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 重新加载数据
      await loadChallengeData();

      // 通知父组件
      if (onChallengeUpdated) {
        onChallengeUpdated();
      }
    } catch (err) {
      console.error('Failed to contribute to challenge:', err);
      setError('贡献进度失败，请重试');
    } finally {
      setIsContributing(false);
    }
  };

  // 处理复制邀请码
  const handleCopyInviteCode = () => {
    if (!inviteCode) return;

    navigator.clipboard.writeText(inviteCode)
      .then(() => {
        // 播放成功音效
        playSound(SoundType.SUCCESS, 0.3);
        alert('邀请码已复制到剪贴板');
      })
      .catch(err => {
        console.error('Failed to copy invite code:', err);
        alert('复制邀请码失败，请手动复制');
      });
  };

  // 获取挑战类型标签
  const getTypeLabel = (type: SocialChallengeType): string => {
    switch (type) {
      case SocialChallengeType.COOPERATIVE:
        return '合作型';
      case SocialChallengeType.COMPETITIVE:
        return '竞争型';
      case SocialChallengeType.TEAM:
        return '团队型';
      default:
        return '未知';
    }
  };

  // 获取难度标签
  const getDifficultyLabel = (difficulty: ChallengeDifficulty): string => {
    switch (difficulty) {
      case ChallengeDifficulty.EASY:
        return '简单';
      case ChallengeDifficulty.MEDIUM:
        return '中等';
      case ChallengeDifficulty.HARD:
        return '困难';
      case ChallengeDifficulty.EXPERT:
        return '专家';
      default:
        return '未知';
    }
  };

  // 获取状态标签
  const getStatusLabel = (status: ChallengeStatus): string => {
    switch (status) {
      case ChallengeStatus.ACTIVE:
        return '进行中';
      case ChallengeStatus.COMPLETED:
        return '已完成';
      case ChallengeStatus.FAILED:
        return '失败';
      case ChallengeStatus.UPCOMING:
        return '即将开始';
      case ChallengeStatus.EXPIRED:
        return '已过期';
      default:
        return '未知';
    }
  };

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title="社交挑战详情"
      closeOnOutsideClick={!isJoining && !isLeaving && !isContributing}
      closeOnEsc={!isJoining && !isLeaving && !isContributing}
      showCloseButton={!isJoining && !isLeaving && !isContributing}
    >
      <div className="social-challenge-detail p-4">
        {isLoading ? (
          <div className="loading-container flex justify-center items-center h-64">
            <LoadingSpinner variant="jade" size="medium" />
          </div>
        ) : error ? (
          <div className="error-container text-center p-4">
            <div className="error-message text-red-500 mb-4">{error}</div>
            <Button variant="jade" onClick={loadChallengeData}>
              重试
            </Button>
          </div>
        ) : challenge ? (
          <div className="challenge-content">
            {/* 挑战头部 */}
            <div className="challenge-header mb-6">
              <div className="flex items-center mb-3">
                <div className="challenge-icon mr-4">
                  <img
                    src={challenge.iconPath || '/assets/challenges/social_default.svg'}
                    alt={challenge.title}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/assets/challenges/social_default.svg';
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{challenge.title}</h2>
                  <div className="challenge-meta flex flex-wrap gap-2 mt-1">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {getTypeLabel(challenge.type)}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {getDifficultyLabel(challenge.difficulty)}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {getStatusLabel(challenge.status)}
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

              <div className="challenge-description mb-4">
                <p className="text-gray-700">{challenge.description}</p>
              </div>

              <div className="challenge-dates text-sm text-gray-600 mb-4">
                <p>开始日期: {new Date(challenge.startDate).toLocaleDateString()}</p>
                {challenge.endDate && (
                  <p>结束日期: {new Date(challenge.endDate).toLocaleDateString()}</p>
                )}
                <p>创建日期: {new Date(challenge.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="challenge-progress mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">进度</span>
                  <span className="text-sm font-bold">{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-jade-500 h-2.5 rounded-full"
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* 邀请码（仅对参与者显示） */}
              {isParticipant && !challenge.isPublic && (
                <div className="invite-code-section mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-bold">邀请码</h3>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setShowInviteCode(!showInviteCode)}
                    >
                      {showInviteCode ? '隐藏' : '显示'}
                    </Button>
                  </div>
                  {showInviteCode && (
                    <div className="invite-code-display mt-2 flex items-center">
                      <div className="invite-code bg-gray-100 p-2 rounded-md font-mono">
                        {inviteCode}
                      </div>
                      <Button
                        variant="secondary"
                        size="small"
                        className="ml-2"
                        onClick={handleCopyInviteCode}
                      >
                        复制
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 参与者列表 */}
            <div className="participants-section mb-6">
              <h3 className="text-lg font-bold mb-2">参与者 ({challenge.participantIds.length}/{challenge.maxParticipants})</h3>
              <div className="participants-list bg-gray-50 p-3 rounded-md">
                {participations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {participations.map((participation) => (
                      <div
                        key={participation.id}
                        className="participant-item flex items-center justify-between p-2 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="participant-info">
                          <div className="flex items-center">
                            <div className="participant-avatar mr-2">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-gray-600">
                                  {participation.userId.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {participation.userId === challenge.creatorId ? (
                                  <span className="flex items-center">
                                    {participation.userId}
                                    <span className="ml-1 text-xs px-1 py-0.5 bg-amber-100 text-amber-800 rounded">创建者</span>
                                  </span>
                                ) : (
                                  participation.userId
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                加入于 {new Date(participation.joinedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="participant-contribution">
                          <span className="text-sm font-bold">{participation.contribution}</span>
                          <span className="text-xs text-gray-500 ml-1">贡献</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-2">暂无参与者</p>
                )}
              </div>
            </div>

            {/* 操作区域 */}
            <div className="actions-section">
              {isParticipant ? (
                <div className="participant-actions">
                  {/* 贡献进度（仅对活跃挑战显示） */}
                  {challenge.status === ChallengeStatus.ACTIVE && (
                    <div className="contribute-section mb-4">
                      <h3 className="text-lg font-bold mb-2">贡献进度</h3>
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={contributionAmount}
                          onChange={(e) => setContributionAmount(parseInt(e.target.value))}
                          className="flex-grow mr-2"
                        />
                        <span className="text-lg font-bold w-8 text-center">{contributionAmount}</span>
                      </div>
                      <Button
                        variant="jade"
                        onClick={handleContribute}
                        disabled={isContributing || challenge.progress >= 100}
                        className="mt-2 w-full"
                      >
                        {isContributing ? (
                          <LoadingSpinner variant="white" size="small" />
                        ) : (
                          '贡献进度'
                        )}
                      </Button>
                    </div>
                  )}

                  {/* 离开挑战按钮（非创建者可见） */}
                  {!isCreator && challenge.status === ChallengeStatus.ACTIVE && (
                    <Button
                      variant="error"
                      onClick={handleLeave}
                      disabled={isLeaving}
                      className="w-full"
                    >
                      {isLeaving ? (
                        <LoadingSpinner variant="white" size="small" />
                      ) : (
                        '离开挑战'
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="non-participant-actions">
                  {/* 加入挑战按钮 */}
                  {challenge.status === ChallengeStatus.ACTIVE && challenge.participantIds.length < challenge.maxParticipants && (
                    <div>
                      {!challenge.isPublic && (
                        <div className="invite-code-input mb-2">
                          <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                            邀请码
                          </label>
                          <input
                            type="text"
                            id="inviteCode"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
                            placeholder="输入邀请码"
                            required={!challenge.isPublic}
                          />
                        </div>
                      )}
                      <Button
                        variant="jade"
                        onClick={handleJoin}
                        disabled={isJoining || (!challenge.isPublic && !inviteCode)}
                        className="w-full"
                      >
                        {isJoining ? (
                          <LoadingSpinner variant="white" size="small" />
                        ) : (
                          '加入挑战'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="not-found-container text-center p-4">
            <p className="text-gray-500">挑战不存在或已被删除</p>
          </div>
        )}
      </div>
    </ScrollDialog>
  );
};

export default SocialChallengeDetailDialog;
