// src/components/game/SocialChallengeList.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  SocialChallengeRecord,
  getAllSocialChallenges,
  getUserSocialChallenges,
  getPublicSocialChallenges,
  joinSocialChallenge,
  leaveSocialChallenge
} from '@/services/socialChallengeService';

import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import SocialChallengeCard from './SocialChallengeCard';
import SocialChallengeForm from './SocialChallengeForm';
import SocialChallengeDetailDialog from './SocialChallengeDetailDialog';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';

interface SocialChallengeListProps {
  filter?: 'all' | 'my' | 'public';
  maxItems?: number;
  showCreateButton?: boolean;
  className?: string;
}

/**
 * 社交挑战列表组件
 * 用于显示社交挑战列表
 */
const SocialChallengeList: React.FC<SocialChallengeListProps> = ({
  filter = 'all',
  maxItems,
  showCreateButton = true,
  className = ''
}) => {
  const [challenges, setChallenges] = useState<SocialChallengeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [joinInviteCode, setJoinInviteCode] = useState('');

  // 当前用户ID（在实际应用中，这应该从用户会话中获取）
  const currentUserId = 'current-user';

  // 加载挑战数据
  const loadChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let challengesList: SocialChallengeRecord[] = [];

      // 根据过滤条件获取挑战
      switch (filter) {
        case 'my':
          challengesList = await getUserSocialChallenges(currentUserId);
          break;
        case 'public':
          challengesList = await getPublicSocialChallenges();
          break;
        default:
          challengesList = await getAllSocialChallenges();
          break;
      }

      // 限制数量
      if (maxItems && challengesList.length > maxItems) {
        challengesList = challengesList.slice(0, maxItems);
      }

      setChallenges(challengesList);
    } catch (err) {
      console.error('Failed to load social challenges:', err);
      setError('加载社交挑战失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadChallenges();
  }, [filter, maxItems]);

  // 注册数据刷新监听
  useRegisterTableRefresh('socialChallenges', loadChallenges);
  useRegisterTableRefresh('socialChallengeParticipations', loadChallenges);

  // 处理创建挑战
  const handleCreateChallenge = () => {
    setShowCreateForm(true);
  };

  // 处理挑战创建完成
  const handleChallengeCreated = () => {
    // 播放成功音效
    playSound(SoundType.SUCCESS, 0.5);

    // 重新加载挑战
    loadChallenges();
  };

  // 处理加入挑战
  const handleJoinChallenge = async (challengeId: number) => {
    try {
      // 获取挑战
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      // 如果是非公开挑战，需要邀请码
      if (!challenge.isPublic) {
        const code = prompt('请输入邀请码');
        if (!code) return;
        setJoinInviteCode(code);
      }

      // 加入挑战
      await joinSocialChallenge(
        challengeId,
        currentUserId,
        challenge.isPublic ? undefined : joinInviteCode
      );

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 重新加载挑战
      loadChallenges();
    } catch (err) {
      console.error('Failed to join challenge:', err);
      alert('加入挑战失败，请重试');
    }
  };

  // 处理离开挑战
  const handleLeaveChallenge = async (challengeId: number) => {
    try {
      // 确认离开
      if (!confirm('确定要离开这个挑战吗？')) return;

      // 离开挑战
      await leaveSocialChallenge(challengeId, currentUserId);

      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.5);

      // 重新加载挑战
      loadChallenges();
    } catch (err) {
      console.error('Failed to leave challenge:', err);
      alert('离开挑战失败，请重试');
    }
  };

  // 处理查看挑战详情
  const handleViewChallengeDetails = (challengeId: number) => {
    setSelectedChallengeId(challengeId);
    setShowDetailDialog(true);
  };

  // 处理分享挑战
  const handleShareChallenge = (_challengeId: number, inviteCode: string) => {
    // 复制邀请码到剪贴板
    navigator.clipboard.writeText(inviteCode)
      .then(() => {
        // 播放成功音效
        playSound(SoundType.SUCCESS, 0.3);
        alert('邀请码已复制到剪贴板');
      })
      .catch(err => {
        console.error('Failed to copy invite code:', err);
        alert('复制邀请码失败，请手动复制: ' + inviteCode);
      });
  };

  // 处理挑战更新
  const handleChallengeUpdated = () => {
    // 重新加载挑战
    loadChallenges();
  };

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

  return (
    <div className={`social-challenge-list ${className}`}>
      {/* 头部 */}
      <div className="list-header flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {filter === 'my' ? '我的社交挑战' :
           filter === 'public' ? '公开社交挑战' :
           '所有社交挑战'}
        </h2>
        {showCreateButton && (
          <Button
            variant="jade"
            onClick={handleCreateChallenge}
          >
            创建挑战
          </Button>
        )}
      </div>

      {/* 内容 */}
      <div className="list-content">
        {isLoading ? (
          <div className="loading-container flex justify-center items-center h-32">
            <LoadingSpinner variant="jade" size="medium" />
          </div>
        ) : error ? (
          <div className="error-container text-center p-4">
            <div className="error-message text-red-500 mb-4">{error}</div>
            <Button variant="jade" onClick={loadChallenges}>
              重试
            </Button>
          </div>
        ) : challenges.length > 0 ? (
          <motion.div
            className="challenges-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                variants={itemVariants}
              >
                <SocialChallengeCard
                  challenge={challenge}
                  isParticipant={challenge.participantIds.includes(currentUserId)}
                  onJoin={handleJoinChallenge}
                  onLeave={handleLeaveChallenge}
                  onViewDetails={handleViewChallengeDetails}
                  onShare={handleShareChallenge}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="empty-container text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              {filter === 'my' ? '你还没有参与任何社交挑战' :
               filter === 'public' ? '暂无公开的社交挑战' :
               '暂无社交挑战'}
            </p>
            {filter !== 'my' && showCreateButton && (
              <Button variant="jade" onClick={handleCreateChallenge}>
                创建第一个挑战
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 创建挑战表单 */}
      {showCreateForm && (
        <SocialChallengeForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onChallengeCreated={handleChallengeCreated}
        />
      )}

      {/* 挑战详情对话框 */}
      {showDetailDialog && selectedChallengeId !== null && (
        <SocialChallengeDetailDialog
          isOpen={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
          challengeId={selectedChallengeId}
          onChallengeUpdated={handleChallengeUpdated}
        />
      )}
    </div>
  );
};

export default SocialChallengeList;
