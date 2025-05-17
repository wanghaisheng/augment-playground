// src/components/game/AchievementUnlockNotification.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollDialog from './ScrollDialog';
import Button from '@/components/common/Button';
import { RewardType, RewardRarity } from '@/services/rewardService';
import { playSound, SoundType } from '@/utils/sound';
import VipBoostPrompt from '@/components/vip/VipBoostPrompt';
import { initializeVipBoostPromptLabels } from '@/data/vipBoostPromptLabels';
import { isUserVip } from '@/services/storeService';
import { useAsyncEffectOnce } from '@/hooks/useAsyncEffect';
import { useStableCallback } from '@/hooks/useStableCallback';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward?: {
    type: RewardType;
    amount: number;
    baseAmount?: number;
    vipAmount?: number;
    name: string;
    description: string;
    iconPath: string;
  };
}

interface AchievementUnlockNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  onClaimReward?: (achievementId: string) => void;
  labels?: {
    title?: string;
    congratsText?: string;
    rewardText?: string;
    claimButtonText?: string;
    closeButtonText?: string;
  };
}

/**
 * 成就解锁通知组件
 * 显示成就解锁和奖励信息
 */
const AchievementUnlockNotification: React.FC<AchievementUnlockNotificationProps> = ({
  achievement,
  onClose,
  onClaimReward,
  labels
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showVipPrompt, setShowVipPrompt] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isVip, setIsVip] = useState(false);

  // 默认标签
  const title = labels?.title || '成就解锁';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const congratsText = labels?.congratsText || '恭喜解锁成就！';
  const rewardText = labels?.rewardText || '奖励';
  const claimButtonText = labels?.claimButtonText || '领取奖励';
  const closeButtonText = labels?.closeButtonText || '关闭';

  // 初始化 - 使用useAsyncEffectOnce替代useEffect
  useAsyncEffectOnce(async () => {
    // 播放成就解锁音效
    playSound(SoundType.ACHIEVEMENT, 0.6);

    // 初始化VIP助推提示标签
    initializeVipBoostPromptLabels();

    // 检查用户是否是VIP
    const vipStatus = await isUserVip('current-user');
    setIsVip(vipStatus);
  });

  // 处理动画完成 - 使用useStableCallback确保回调函数稳定
  const handleAnimationComplete = useStableCallback(() => {
    setAnimationComplete(true);

    // 如果有奖励，并且奖励有VIP加成，显示VIP助推提示
    if (achievement.reward &&
        achievement.reward.baseAmount !== undefined &&
        achievement.reward.vipAmount !== undefined &&
        achievement.reward.vipAmount > achievement.reward.baseAmount) {
      // 延迟显示VIP助推提示
      setTimeout(() => {
        setShowVipPrompt(true);
      }, 1000);
    }
  });

  // 处理领取奖励 - 使用useStableCallback确保回调函数稳定
  const handleClaimReward = useStableCallback(() => {
    if (onClaimReward) {
      onClaimReward(achievement.id);
    }
    onClose();
  });

  // 处理关闭VIP助推提示 - 使用useStableCallback确保回调函数稳定
  const handleCloseVipPrompt = useStableCallback(() => {
    setShowVipPrompt(false);
  });

  // 获取稀有度颜色
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'legendary': return 'gold';
      case 'epic': return 'purple';
      case 'rare': return 'blue';
      case 'uncommon': return 'green';
      default: return 'gray';
    }
  };

  // 获取稀有度名称
  const getRarityName = (rarity: string): string => {
    switch (rarity) {
      case 'legendary': return '传说';
      case 'epic': return '史诗';
      case 'rare': return '稀有';
      case 'uncommon': return '不常见';
      default: return '普通';
    }
  };

  return (
    <>
      <ScrollDialog
        isOpen={true}
        onClose={onClose}
        title={title}
        closeOnOutsideClick={false}
        closeOnEsc={false}
        showCloseButton={true}
        footer={null}
      >
        <div className="achievement-unlock-content">
          <motion.div
            className="achievement-unlock-animation"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={handleAnimationComplete}
          >
            <div className={`achievement-icon ${achievement.rarity}`}>
              {achievement.icon || '🏆'}
            </div>

            <h3 className="achievement-name">{achievement.name}</h3>

            <div className={`achievement-rarity ${achievement.rarity}`}>
              {getRarityName(achievement.rarity)}
            </div>

            <p className="achievement-description">{achievement.description}</p>

            <div className="achievement-unlock-date">
              {achievement.unlockedAt && (
                <span>解锁于 {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
              )}
            </div>

            <AnimatePresence>
              {animationComplete && achievement.reward && (
                <motion.div
                  className="achievement-reward"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="reward-title">{rewardText}</h4>

                  <div className="reward-content">
                    <div className="reward-icon">
                      <img
                        src={achievement.reward.iconPath}
                        alt={achievement.reward.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/assets/rewards/generic.svg';
                        }}
                      />
                    </div>

                    <div className="reward-details">
                      <h5 className="reward-name">{achievement.reward.name}</h5>
                      <p className="reward-description">{achievement.reward.description}</p>
                      <p className="reward-amount">x{achievement.reward.amount}</p>
                    </div>
                  </div>

                  {onClaimReward && (
                    <Button
                      variant="gold"
                      className="claim-reward-button"
                      onClick={handleClaimReward}
                    >
                      {claimButtonText}
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {animationComplete && !achievement.reward && (
                <motion.div
                  className="achievement-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button variant="jade" onClick={onClose}>
                    {closeButtonText}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </ScrollDialog>

      {/* VIP助推提示 */}
      {achievement.reward && achievement.reward.baseAmount !== undefined && achievement.reward.vipAmount !== undefined && (
        <VipBoostPrompt
          isOpen={showVipPrompt}
          onClose={handleCloseVipPrompt}
          rewardType={achievement.reward.type}
          baseAmount={achievement.reward.baseAmount}
          vipAmount={achievement.reward.vipAmount}
          rarity={achievement.reward.type === RewardType.ITEM ? RewardRarity.RARE : RewardRarity.COMMON}
          promptType="achievement"
        />
      )}
    </>
  );
};

export default AchievementUnlockNotification;
