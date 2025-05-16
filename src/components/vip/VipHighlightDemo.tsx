// src/components/vip/VipHighlightDemo.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import { triggerHighlightMoment, HighlightMomentType } from '@/services/highlightMomentService';
import { RewardType, RewardRarity } from '@/services/rewardService';
import { playSound, SoundType } from '@/utils/sound';

/**
 * VIP高光时刻演示组件
 * 
 * 用于测试不同类型的高光时刻VIP提示
 */
const VipHighlightDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // 触发高光时刻
  const triggerMoment = async (type: HighlightMomentType) => {
    try {
      setIsLoading(true);
      playSound(SoundType.BUTTON_CLICK);
      
      // 根据类型创建不同的高光时刻数据
      switch (type) {
        case HighlightMomentType.ACHIEVEMENT_UNLOCKED:
          await triggerHighlightMoment({
            type,
            title: '成就解锁：竹林守护者',
            description: '恭喜您解锁了"竹林守护者"成就！VIP会员可获得双倍奖励。',
            rewardType: RewardType.COIN,
            rewardAmount: 50,
            rarity: RewardRarity.RARE,
            sourceName: '竹林守护者',
            imageUrl: '/assets/achievements/bamboo_guardian.svg'
          });
          break;
          
        case HighlightMomentType.LEVEL_UP:
          await triggerHighlightMoment({
            type,
            title: '等级提升：熊猫大师',
            description: '恭喜您的熊猫升级到了10级！VIP会员可获得额外经验值。',
            rewardType: RewardType.EXPERIENCE,
            rewardAmount: 100,
            rarity: RewardRarity.UNCOMMON,
            sourceName: '等级10'
          });
          break;
          
        case HighlightMomentType.CHALLENGE_COMPLETED:
          await triggerHighlightMoment({
            type,
            title: '挑战完成：竹子收集者',
            description: '恭喜您完成了"竹子收集者"挑战！VIP会员可获得额外奖励。',
            rewardType: RewardType.COIN,
            rewardAmount: 75,
            rarity: RewardRarity.COMMON,
            sourceName: '竹子收集者'
          });
          break;
          
        case HighlightMomentType.RARE_REWARD:
          await triggerHighlightMoment({
            type,
            title: '稀有奖励：金色竹笋',
            description: '恭喜您获得了稀有奖励"金色竹笋"！VIP会员可获得额外物品。',
            rewardType: RewardType.ITEM,
            rewardAmount: 1,
            rarity: RewardRarity.EPIC,
            sourceName: '金色竹笋',
            imageUrl: '/assets/rewards/golden_bamboo.svg'
          });
          break;
          
        case HighlightMomentType.STREAK_MILESTONE:
          await triggerHighlightMoment({
            type,
            title: '连续打卡里程碑：30天',
            description: '恭喜您已连续打卡30天！VIP会员可获得额外奖励。',
            rewardType: RewardType.COIN,
            rewardAmount: 100,
            rarity: RewardRarity.UNCOMMON,
            sourceName: '30天连续打卡'
          });
          break;
          
        case HighlightMomentType.ABILITY_UNLOCKED:
          await triggerHighlightMoment({
            type,
            title: '能力解锁：竹子加速',
            description: '恭喜您解锁了"竹子加速"能力！VIP会员可获得更强大的能力效果。',
            rewardType: RewardType.ABILITY,
            rewardAmount: 1,
            rarity: RewardRarity.RARE,
            sourceName: '竹子加速'
          });
          break;
          
        default:
          await triggerHighlightMoment({
            type: HighlightMomentType.SPECIAL_EVENT,
            title: '特殊事件：熊猫节日',
            description: '熊猫节日来临！VIP会员可获得特殊奖励。',
            rewardType: RewardType.COIN,
            rewardAmount: 200,
            rarity: RewardRarity.LEGENDARY,
            sourceName: '熊猫节日'
          });
      }
    } catch (error) {
      console.error('Error triggering highlight moment:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-jade-800">VIP高光时刻演示</h2>
      <p className="text-gray-600 mb-6">点击下面的按钮触发不同类型的高光时刻VIP提示</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerMoment(HighlightMomentType.ACHIEVEMENT_UNLOCKED)}
            disabled={isLoading}
          >
            触发成就解锁
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerMoment(HighlightMomentType.LEVEL_UP)}
            disabled={isLoading}
          >
            触发等级提升
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerMoment(HighlightMomentType.CHALLENGE_COMPLETED)}
            disabled={isLoading}
          >
            触发挑战完成
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerMoment(HighlightMomentType.RARE_REWARD)}
            disabled={isLoading}
          >
            触发稀有奖励
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerMoment(HighlightMomentType.STREAK_MILESTONE)}
            disabled={isLoading}
          >
            触发连续打卡里程碑
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerMoment(HighlightMomentType.ABILITY_UNLOCKED)}
            disabled={isLoading}
          >
            触发能力解锁
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="md:col-span-2">
          <Button
            variant="gold"
            className="w-full"
            onClick={() => triggerMoment(HighlightMomentType.SPECIAL_EVENT)}
            disabled={isLoading}
          >
            触发特殊事件
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default VipHighlightDemo;
