// src/components/vip/VipBoostPrompt.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { RewardType, RewardRarity } from '@/services/rewardService';
import { playSound, SoundType } from '@/utils/sound';
import { usePandaState } from '@/context/PandaStateProvider';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchVipBoostPromptView } from '@/services/localizedContentService';
import { Language } from '@/types';
import { HighlightMomentType } from '@/services/highlightMomentService';
import { generateSparkleParticles } from '@/utils/particleEffects.tsx';

interface VipBoostPromptProps {
  isOpen: boolean;
  onClose: () => void;
  rewardType: RewardType;
  baseAmount: number;
  vipAmount: number;
  rarity?: RewardRarity;
  source?: string;
  promptType?: HighlightMomentType | string;
  title?: string;
  description?: string;
  imageUrl?: string;
  animationLevel?: 'simple' | 'normal' | 'elaborate';
}

/**
 * VIP助推提示组件
 * 在成就解锁、任务完成等高光时刻展示VIP特权的好处
 */
const VipBoostPrompt: React.FC<VipBoostPromptProps> = ({
  isOpen,
  onClose,
  rewardType,
  baseAmount,
  vipAmount,
  rarity = RewardRarity.COMMON,
  source = '',
  promptType = 'generic',
  title,
  description,
  imageUrl,
  animationLevel = 'normal'
}) => {
  const navigate = useNavigate();
  const { pandaState } = usePandaState();
  const isVip = pandaState?.isVip || false;
  // isClosing state is used to manage animation timing during dialog close
  const [_isClosing, setIsClosing] = useState(false);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Function to fetch localized content for VIP boost prompt
  const fetchVipBoostPromptViewFn = React.useCallback(async (lang: Language) => {
    try {
      return await fetchVipBoostPromptView(lang);
    } catch (error) {
      console.error('Error fetching VIP boost prompt view:', error);
      throw error;
    }
  }, []);

  // Fetch localized content for the VIP boost prompt
  const { data: viewData } = useLocalizedView<null, { labels: { [key: string]: string } }>('vipBoostPrompt', fetchVipBoostPromptViewFn);

  // Get content from viewData with type assertion to handle the 'never' type issue
  const content = (viewData as any)?.labels || {};

  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.BUTTON_CLICK);
    onClose();
    navigate('/vip-benefits');
  };

  // 处理关闭
  const handleClose = () => {
    playSound(SoundType.BUTTON_CLICK);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // 生成粒子效果
  useEffect(() => {
    if (isOpen && containerRef && animationLevel !== 'simple') {
      // 播放音效
      playSound(isVip ? SoundType.SUCCESS : SoundType.NOTIFICATION, 0.5);

      // 获取容器尺寸
      const rect = containerRef.getBoundingClientRect();

      // 生成粒子
      const colors = isVip
        ? ['#ffd700', '#ffeb3b', '#ffc107'] // 金色系
        : ['#4caf50', '#8bc34a', '#cddc39']; // 绿色系

      const particleCount = animationLevel === 'elaborate' ? 30 : 15;

      setParticles(generateSparkleParticles({
        count: particleCount,
        colors,
        container: rect,
        size: [5, 15],
        duration: [1, 2],
        distance: [50, 100]
      }));

      // 清理粒子
      const timer = setTimeout(() => {
        setParticles([]);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, containerRef, isVip, animationLevel]);

  // 获取奖励类型文本
  const getRewardTypeText = () => {
    switch (rewardType) {
      case RewardType.EXPERIENCE:
        return content.experienceReward || '经验值';
      case RewardType.COIN:
        return content.coinReward || '竹币';
      case RewardType.ITEM:
        return content.itemReward || '物品';
      case RewardType.BADGE:
        return content.badgeReward || '徽章';
      case RewardType.ABILITY:
        return content.abilityReward || '能力';
      default:
        return content.genericReward || '奖励';
    }
  };

  // 获取提示类型标题
  const getPromptTitle = () => {
    // 如果提供了自定义标题，优先使用
    if (title) {
      return title;
    }

    if (isVip) {
      switch (promptType) {
        case 'achievement':
        case HighlightMomentType.ACHIEVEMENT_UNLOCKED:
          return content.vipAchievementTitle || 'VIP成就奖励加成!';
        case 'task':
          return content.vipTaskTitle || 'VIP任务奖励加成!';
        case HighlightMomentType.CHALLENGE_COMPLETED:
        case 'challenge':
          return content.vipChallengeTitle || 'VIP挑战奖励加成!';
        case 'bamboo':
          return content.vipBambooTitle || 'VIP竹子奖励加成!';
        case HighlightMomentType.LEVEL_UP:
          return content.vipLevelUpTitle || 'VIP等级提升加成!';
        case HighlightMomentType.RARE_REWARD:
          return content.vipRareRewardTitle || 'VIP稀有奖励加成!';
        case HighlightMomentType.STREAK_MILESTONE:
          return content.vipStreakMilestoneTitle || 'VIP连续打卡里程碑加成!';
        case HighlightMomentType.ABILITY_UNLOCKED:
          return content.vipAbilityUnlockedTitle || 'VIP能力解锁加成!';
        case HighlightMomentType.COLLECTION_COMPLETED:
          return content.vipCollectionCompletedTitle || 'VIP收集完成加成!';
        case HighlightMomentType.SPECIAL_EVENT:
          return content.vipSpecialEventTitle || 'VIP特殊事件加成!';
        default:
          return content.vipGenericTitle || 'VIP奖励加成!';
      }
    } else {
      switch (promptType) {
        case 'achievement':
        case HighlightMomentType.ACHIEVEMENT_UNLOCKED:
          return content.nonVipAchievementTitle || '成为VIP获得更多成就奖励!';
        case 'task':
          return content.nonVipTaskTitle || '成为VIP获得更多任务奖励!';
        case HighlightMomentType.CHALLENGE_COMPLETED:
        case 'challenge':
          return content.nonVipChallengeTitle || '成为VIP获得更多挑战奖励!';
        case 'bamboo':
          return content.nonVipBambooTitle || '成为VIP获得更多竹子奖励!';
        case HighlightMomentType.LEVEL_UP:
          return content.nonVipLevelUpTitle || '成为VIP获得更多等级提升奖励!';
        case HighlightMomentType.RARE_REWARD:
          return content.nonVipRareRewardTitle || '成为VIP获得更多稀有奖励!';
        case HighlightMomentType.STREAK_MILESTONE:
          return content.nonVipStreakMilestoneTitle || '成为VIP获得更多连续打卡里程碑奖励!';
        case HighlightMomentType.ABILITY_UNLOCKED:
          return content.nonVipAbilityUnlockedTitle || '成为VIP获得更多能力解锁奖励!';
        case HighlightMomentType.COLLECTION_COMPLETED:
          return content.nonVipCollectionCompletedTitle || '成为VIP获得更多收集完成奖励!';
        case HighlightMomentType.SPECIAL_EVENT:
          return content.nonVipSpecialEventTitle || '成为VIP获得更多特殊事件奖励!';
        default:
          return content.nonVipGenericTitle || '成为VIP获得更多奖励!';
      }
    }
  };

  // 获取提示描述
  const getPromptDescription = () => {
    // 如果提供了自定义描述，优先使用
    if (description) {
      return description;
    }

    const rewardTypeText = getRewardTypeText();
    const multiplier = (vipAmount / baseAmount).toFixed(1);
    const sourceText = source ? ` 来自 ${source}` : '';

    // 根据高光时刻类型和VIP状态获取不同的描述
    if (isVip) {
      switch (promptType) {
        case HighlightMomentType.LEVEL_UP:
          return content.vipLevelUpDescription?.replace('{rewardType}', rewardTypeText)
                                              .replace('{multiplier}', multiplier)
                                              .replace('{source}', sourceText) ||
                 `作为VIP会员，您的等级提升获得了${multiplier}倍的${rewardTypeText}奖励!`;

        case HighlightMomentType.ACHIEVEMENT_UNLOCKED:
          return content.vipAchievementDescription?.replace('{rewardType}', rewardTypeText)
                                                  .replace('{multiplier}', multiplier)
                                                  .replace('{source}', sourceText) ||
                 `作为VIP会员，您的成就${sourceText}获得了${multiplier}倍的${rewardTypeText}奖励!`;

        case HighlightMomentType.CHALLENGE_COMPLETED:
          return content.vipChallengeDescription?.replace('{rewardType}', rewardTypeText)
                                                .replace('{multiplier}', multiplier)
                                                .replace('{source}', sourceText) ||
                 `作为VIP会员，您完成挑战${sourceText}获得了${multiplier}倍的${rewardTypeText}奖励!`;

        case HighlightMomentType.RARE_REWARD:
          return content.vipRareRewardDescription?.replace('{rewardType}', rewardTypeText)
                                                 .replace('{multiplier}', multiplier)
                                                 .replace('{source}', sourceText) ||
                 `作为VIP会员，您获得稀有奖励${sourceText}时享受${multiplier}倍的${rewardTypeText}加成!`;

        default:
          return content.vipDescription?.replace('{rewardType}', rewardTypeText)
                                        .replace('{multiplier}', multiplier)
                                        .replace('{source}', sourceText) ||
                 `作为VIP会员，您获得了${multiplier}倍的${rewardTypeText}奖励${sourceText}!`;
      }
    } else {
      switch (promptType) {
        case HighlightMomentType.LEVEL_UP:
          return content.nonVipLevelUpDescription?.replace('{rewardType}', rewardTypeText)
                                                 .replace('{multiplier}', multiplier)
                                                 .replace('{source}', sourceText) ||
                 `成为VIP会员，您的等级提升将获得${multiplier}倍的${rewardTypeText}奖励!`;

        case HighlightMomentType.ACHIEVEMENT_UNLOCKED:
          return content.nonVipAchievementDescription?.replace('{rewardType}', rewardTypeText)
                                                     .replace('{multiplier}', multiplier)
                                                     .replace('{source}', sourceText) ||
                 `成为VIP会员，您的成就${sourceText}将获得${multiplier}倍的${rewardTypeText}奖励!`;

        case HighlightMomentType.CHALLENGE_COMPLETED:
          return content.nonVipChallengeDescription?.replace('{rewardType}', rewardTypeText)
                                                   .replace('{multiplier}', multiplier)
                                                   .replace('{source}', sourceText) ||
                 `成为VIP会员，您完成挑战${sourceText}将获得${multiplier}倍的${rewardTypeText}奖励!`;

        case HighlightMomentType.RARE_REWARD:
          return content.nonVipRareRewardDescription?.replace('{rewardType}', rewardTypeText)
                                                    .replace('{multiplier}', multiplier)
                                                    .replace('{source}', sourceText) ||
                 `成为VIP会员，您获得稀有奖励${sourceText}时将享受${multiplier}倍的${rewardTypeText}加成!`;

        default:
          return content.nonVipDescription?.replace('{rewardType}', rewardTypeText)
                                           .replace('{multiplier}', multiplier)
                                           .replace('{source}', sourceText) ||
                 `成为VIP会员，您将获得${multiplier}倍的${rewardTypeText}奖励${sourceText}!`;
      }
    }
  };

  // 获取奖励图标
  const getRewardIcon = () => {
    // 如果提供了自定义图片，优先使用
    if (imageUrl) {
      return imageUrl;
    }

    // 根据稀有度和奖励类型获取图标
    let rarityPrefix = '';
    switch (rarity) {
      case RewardRarity.COMMON:
        rarityPrefix = 'common';
        break;
      case RewardRarity.UNCOMMON:
        rarityPrefix = 'uncommon';
        break;
      case RewardRarity.RARE:
        rarityPrefix = 'rare';
        break;
      case RewardRarity.EPIC:
        rarityPrefix = 'epic';
        break;
      case RewardRarity.LEGENDARY:
        rarityPrefix = 'legendary';
        break;
      default:
        rarityPrefix = 'common';
    }

    // 根据高光时刻类型获取图标
    switch (promptType) {
      case HighlightMomentType.LEVEL_UP:
        return '/assets/rewards/level_up.svg';
      case HighlightMomentType.ACHIEVEMENT_UNLOCKED:
        return '/assets/rewards/achievement.svg';
      case HighlightMomentType.CHALLENGE_COMPLETED:
        return '/assets/rewards/challenge.svg';
      case HighlightMomentType.STREAK_MILESTONE:
        return '/assets/rewards/streak.svg';
      case HighlightMomentType.ABILITY_UNLOCKED:
        return '/assets/rewards/ability.svg';
      case HighlightMomentType.COLLECTION_COMPLETED:
        return '/assets/rewards/collection.svg';
      case HighlightMomentType.SPECIAL_EVENT:
        return '/assets/rewards/special_event.svg';
      default:
        // 如果不是特定的高光时刻类型，则根据奖励类型获取图标
        switch (rewardType) {
          case RewardType.EXPERIENCE:
            return '/assets/rewards/experience.svg';
          case RewardType.COIN:
            return '/assets/rewards/coin.svg';
          case RewardType.ITEM:
            return `/assets/rewards/item_${rarityPrefix}.svg`;
          case RewardType.BADGE:
            return '/assets/rewards/badge.svg';
          case RewardType.ABILITY:
            return '/assets/rewards/ability.svg';
          default:
            return '/assets/rewards/generic.svg';
        }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          ref={node => setContainerRef(node)}
          className="lattice-modal max-w-md w-full overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={e => e.stopPropagation()}
        >
          {/* 窗棂角落装饰 */}
          <div className="lattice-modal-corner-tr" aria-hidden="true" />
          <div className="lattice-modal-corner-bl" aria-hidden="true" />
          <div className="lattice-modal-corner-br" aria-hidden="true" />

          {/* 标题栏 */}
          <div className="lattice-modal-header">
            <h2 className="lattice-modal-title">
              {getPromptTitle()}
            </h2>
            <motion.button
              className="lattice-modal-close"
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="关闭"
            >
              ×
            </motion.button>
          </div>

          {/* 内容区域 */}
          <div className="lattice-modal-content">
            {/* 粒子效果 */}
            <div className="absolute inset-0 pointer-events-none">
              {particles}
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6 relative z-10">
              {/* 奖励图标 */}
              <motion.div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  isVip
                    ? 'bg-gold-50 border-2 border-gold-300 shadow-gold'
                    : 'bg-gray-50 border border-gray-300'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1.1, 1],
                  opacity: 1
                }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.6, 1]
                }}
              >
                <motion.img
                  src={getRewardIcon()}
                  alt="Reward"
                  className="w-12 h-12"
                  initial={{ rotate: -15 }}
                  animate={{ rotate: isVip ? [0, 15, 0, -15, 0] : 0 }}
                  transition={{
                    duration: 2,
                    repeat: isVip ? Infinity : 0,
                    repeatDelay: 3
                  }}
                />
              </motion.div>

              {/* 描述和奖励对比 */}
              <div className="flex-1">
                <motion.p
                  className="text-gray-700 mb-4 text-center md:text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {getPromptDescription()}
                </motion.p>

                {/* 奖励对比 */}
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* 标准奖励 */}
                  <div className="flex-1 bg-gray-100 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500 mb-1">{content.standardReward || '标准奖励'}</p>
                    <p className="text-xl font-bold">{baseAmount}</p>
                  </div>

                  {/* 箭头 */}
                  <motion.div
                    className="text-gray-400 flex-shrink-0"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.div>

                  {/* VIP奖励 */}
                  <motion.div
                    className={`flex-1 rounded-lg p-3 text-center ${
                      isVip
                        ? 'bg-gold-50 border border-gold-200'
                        : 'bg-gray-100 opacity-75'
                    }`}
                    animate={isVip ? {
                      boxShadow: ['0 0 0 rgba(212, 175, 55, 0)', '0 0 15px rgba(212, 175, 55, 0.5)', '0 0 0 rgba(212, 175, 55, 0)']
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: isVip ? Infinity : 0,
                      repeatDelay: 1
                    }}
                  >
                    <p className={`text-sm mb-1 ${isVip ? 'text-gold-600' : 'text-gray-500'}`}>
                      {content.vipReward || 'VIP奖励'}
                    </p>
                    <p className={`text-xl font-bold ${isVip ? 'text-gold-600' : 'text-gray-400'}`}>
                      {vipAmount}
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* 按钮区域 */}
            <motion.div
              className="flex justify-end space-x-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="secondary"
                onClick={handleClose}
              >
                {content.closeButton || '关闭'}
              </Button>

              {!isVip && (
                <Button
                  variant="gold"
                  onClick={handleNavigateToVip}
                >
                  {content.learnMoreButton || '了解VIP特权'}
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VipBoostPrompt;
