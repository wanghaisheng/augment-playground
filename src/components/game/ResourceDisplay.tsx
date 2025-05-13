// src/components/game/ResourceDisplay.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RewardType, RewardRarity } from '@/services/rewardService';
import { playSound, SoundType } from '@/utils/sound';

interface ResourceDisplayProps {
  type: RewardType;
  amount: number;
  rarity?: RewardRarity;
  iconPath?: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showAnimation?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * 资源显示组件
 * 用于显示各种类型的资源（经验、金币、物品等）
 */
const ResourceDisplay: React.FC<ResourceDisplayProps> = ({
  type,
  amount,
  rarity = RewardRarity.COMMON,
  iconPath,
  size = 'medium',
  showLabel = true,
  showAnimation = false,
  onClick,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [prevAmount, setPrevAmount] = useState(amount);

  // 当金额变化时触发动画
  useEffect(() => {
    if (amount !== prevAmount && showAnimation) {
      // 播放音效
      if (amount > prevAmount) {
        // 增加资源时播放获得音效
        playSound(SoundType.SUCCESS, 0.3);
      } else if (amount < prevAmount) {
        // 减少资源时播放消耗音效
        playSound(SoundType.BUTTON_CLICK, 0.3);
      }

      // 触发动画
      setIsAnimating(true);
      
      // 更新显示金额
      const diff = amount - prevAmount;
      const duration = 1000; // 动画持续时间（毫秒）
      const steps = 20; // 动画步数
      const stepTime = duration / steps;
      const stepAmount = diff / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        setDisplayAmount(prevAmount + stepAmount * currentStep);
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayAmount(amount);
          setIsAnimating(false);
        }
      }, stepTime);
      
      // 更新前一个金额
      setPrevAmount(amount);
      
      // 清理函数
      return () => {
        clearInterval(interval);
      };
    } else if (amount !== prevAmount) {
      // 如果不显示动画，直接更新金额
      setDisplayAmount(amount);
      setPrevAmount(amount);
    }
  }, [amount, prevAmount, showAnimation]);

  // 获取资源类型的中文名称
  const getTypeName = (): string => {
    switch (type) {
      case RewardType.EXPERIENCE:
        return '经验';
      case RewardType.COIN:
        return '竹币';
      case RewardType.ITEM:
        return '物品';
      case RewardType.BADGE:
        return '徽章';
      default:
        return '资源';
    }
  };

  // 获取默认图标路径
  const getDefaultIconPath = (): string => {
    switch (type) {
      case RewardType.EXPERIENCE:
        return '/assets/rewards/experience.svg';
      case RewardType.COIN:
        return '/assets/rewards/coin.svg';
      case RewardType.ITEM:
        return `/assets/rewards/item_${rarity.toLowerCase()}.svg`;
      case RewardType.BADGE:
        return `/assets/rewards/badge_${rarity.toLowerCase()}.svg`;
      default:
        return '/assets/rewards/item_common.svg';
    }
  };

  // 获取尺寸样式
  const getSizeStyle = (): { containerSize: string, iconSize: string, fontSize: string } => {
    switch (size) {
      case 'small':
        return {
          containerSize: 'w-16 h-8',
          iconSize: 'w-6 h-6',
          fontSize: 'text-xs'
        };
      case 'large':
        return {
          containerSize: 'w-32 h-16',
          iconSize: 'w-12 h-12',
          fontSize: 'text-lg'
        };
      default: // medium
        return {
          containerSize: 'w-24 h-12',
          iconSize: 'w-8 h-8',
          fontSize: 'text-sm'
        };
    }
  };

  // 获取稀有度样式
  const getRarityStyle = (): { borderColor: string, glowColor: string, textColor: string } => {
    switch (rarity) {
      case RewardRarity.LEGENDARY:
        return {
          borderColor: 'border-gold',
          glowColor: 'shadow-gold',
          textColor: 'text-gold'
        };
      case RewardRarity.EPIC:
        return {
          borderColor: 'border-purple-500',
          glowColor: 'shadow-purple',
          textColor: 'text-purple-500'
        };
      case RewardRarity.RARE:
        return {
          borderColor: 'border-blue-500',
          glowColor: 'shadow-blue',
          textColor: 'text-blue-500'
        };
      case RewardRarity.UNCOMMON:
        return {
          borderColor: 'border-green-500',
          glowColor: 'shadow-green',
          textColor: 'text-green-500'
        };
      default:
        return {
          borderColor: 'border-gray-300',
          glowColor: 'shadow-sm',
          textColor: 'text-gray-700'
        };
    }
  };

  const { containerSize, iconSize, fontSize } = getSizeStyle();
  const { borderColor, glowColor, textColor } = getRarityStyle();

  return (
    <motion.div
      className={`resource-display flex items-center ${containerSize} ${borderColor} border rounded-full bg-white ${glowColor} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* 资源图标 */}
      <div className={`resource-icon ${iconSize} flex-shrink-0 ml-1`}>
        <img
          src={iconPath || getDefaultIconPath()}
          alt={getTypeName()}
          className="w-full h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = getDefaultIconPath();
          }}
        />
      </div>

      {/* 资源数量 */}
      <div className="resource-amount flex flex-col justify-center ml-1 flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={`amount-${displayAmount}`}
            initial={isAnimating ? { y: -10, opacity: 0 } : { y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${fontSize} font-bold ${textColor} text-center`}
          >
            {Math.round(displayAmount)}
          </motion.div>
        </AnimatePresence>
        
        {/* 资源类型标签 */}
        {showLabel && (
          <div className={`resource-label text-xs text-gray-500 text-center`}>
            {getTypeName()}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResourceDisplay;
