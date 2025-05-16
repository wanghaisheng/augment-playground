// src/components/game/ResourceList.tsx
import React from 'react';
import { motion } from 'framer-motion';
import ResourceDisplay from './ResourceDisplay';
import { RewardType, RewardRarity } from '@/services/rewardService';

interface ResourceItem {
  id?: number;
  type: RewardType;
  amount: number;
  rarity?: RewardRarity;
  iconPath?: string;
  name?: string;
  baseAmount?: number;      // 基础数量（未加倍前）
  multiplier?: number;      // 倍数值
}

interface ResourceListProps {
  resources: ResourceItem[];
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  showAnimation?: boolean;
  onResourceClick?: (resource: ResourceItem) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * 资源列表组件
 * 用于显示多种资源
 */
const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  size = 'medium',
  showLabels = true,
  showAnimation = false,
  onResourceClick,
  orientation = 'horizontal',
  className = ''
}) => {
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

  // 处理资源点击
  const handleResourceClick = (resource: ResourceItem) => {
    if (onResourceClick) {
      onResourceClick(resource);
    }
  };

  return (
    <motion.div
      className={`resource-list ${orientation === 'horizontal' ? 'flex flex-row flex-wrap gap-2' : 'flex flex-col gap-2'} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {resources.map((resource, index) => (
        <motion.div
          key={`resource-${resource.id || index}`}
          variants={itemVariants}
          className="resource-list-item"
        >
          <ResourceDisplay
            type={resource.type}
            amount={resource.amount}
            rarity={resource.rarity}
            iconPath={resource.iconPath}
            size={size}
            showLabel={showLabels}
            showAnimation={showAnimation}
            onClick={() => handleResourceClick(resource)}
            baseAmount={resource.baseAmount}
            multiplier={resource.multiplier}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ResourceList;
