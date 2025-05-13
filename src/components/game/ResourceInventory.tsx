// src/components/game/ResourceInventory.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResourceList from './ResourceList';
import ResourceDisplay from './ResourceDisplay';
import { RewardType, RewardRarity, getPlayerCoins } from '@/services/rewardService';
import { getPandaExperience } from '@/services/pandaStateService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ResourceInventoryProps {
  showExperience?: boolean;
  showCoins?: boolean;
  showItems?: boolean;
  showBadges?: boolean;
  showAnimation?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * 资源库存组件
 * 用于显示玩家的资源库存
 */
const ResourceInventory: React.FC<ResourceInventoryProps> = ({
  showExperience = true,
  showCoins = true,
  showItems = false,
  showBadges = false,
  showAnimation = true,
  size = 'medium',
  className = ''
}) => {
  const [experience, setExperience] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 加载资源数据
  const loadResourceData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取经验值
      if (showExperience) {
        const exp = await getPandaExperience();
        setExperience(exp);
      }

      // 获取金币
      if (showCoins) {
        const playerCoins = await getPlayerCoins();
        setCoins(playerCoins);
      }

      // 获取物品和徽章的逻辑可以在这里添加

    } catch (err) {
      console.error('Failed to load resource data:', err);
      setError('加载资源数据失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadResourceData();
  }, [showExperience, showCoins, showItems, showBadges]);

  // 注册数据刷新监听
  const handleResourceDataUpdate = () => {
    loadResourceData();
  };

  // 监听奖励表的变化
  useRegisterTableRefresh('rewards', handleResourceDataUpdate);

  // 监听熊猫状态表的变化
  useRegisterTableRefresh('pandaState', handleResourceDataUpdate);

  // 创建资源列表
  const resources = [];

  if (showExperience) {
    resources.push({
      id: 1,
      type: RewardType.EXPERIENCE,
      amount: experience,
      rarity: RewardRarity.COMMON,
      iconPath: '/assets/rewards/experience.svg',
      name: '经验值'
    });
  }

  if (showCoins) {
    resources.push({
      id: 2,
      type: RewardType.COIN,
      amount: coins,
      rarity: RewardRarity.COMMON,
      iconPath: '/assets/rewards/coin.svg',
      name: '竹币'
    });
  }

  // 容器变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`resource-inventory-loading flex justify-center items-center p-4 ${className}`}>
        <LoadingSpinner variant="jade" size="small" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`resource-inventory-error text-red-500 text-center p-4 ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="resource-inventory"
        className={`resource-inventory ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ResourceList
          resources={resources}
          size={size}
          showLabels={true}
          showAnimation={showAnimation}
          orientation="horizontal"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ResourceInventory;
