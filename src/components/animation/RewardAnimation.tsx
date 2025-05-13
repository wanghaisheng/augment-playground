// src/components/animation/RewardAnimation.tsx
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { RewardType, RewardRarity } from '@/services/rewardService';

interface RewardAnimationProps {
  type: RewardType;
  rarity: RewardRarity;
  iconPath: string;
  amount?: number;
  size?: number;
  onAnimationComplete?: () => void;
}

/**
 * 奖励动画组件
 * 显示奖励获取的动画效果
 *
 * @param type - 奖励类型
 * @param rarity - 奖励稀有度
 * @param iconPath - 图标路径
 * @param amount - 奖励数量
 * @param size - 图标大小
 * @param onAnimationComplete - 动画完成回调
 */
const RewardAnimation: React.FC<RewardAnimationProps> = ({
  type,
  rarity,
  iconPath,
  amount = 1,
  size = 100,
  onAnimationComplete
}) => {
  // 根据稀有度获取光晕颜色
  const getGlowColor = (rarity: RewardRarity): string => {
    switch (rarity) {
      case RewardRarity.COMMON:
        return 'rgba(255, 255, 255, 0.7)';
      case RewardRarity.UNCOMMON:
        return 'rgba(75, 175, 80, 0.7)';
      case RewardRarity.RARE:
        return 'rgba(33, 150, 243, 0.7)';
      case RewardRarity.EPIC:
        return 'rgba(156, 39, 176, 0.7)';
      case RewardRarity.LEGENDARY:
        return 'rgba(255, 193, 7, 0.7)';
      default:
        return 'rgba(255, 255, 255, 0.7)';
    }
  };

  // 根据稀有度获取粒子数量
  const getParticleCount = (rarity: RewardRarity): number => {
    switch (rarity) {
      case RewardRarity.COMMON:
        return 5;
      case RewardRarity.UNCOMMON:
        return 10;
      case RewardRarity.RARE:
        return 15;
      case RewardRarity.EPIC:
        return 20;
      case RewardRarity.LEGENDARY:
        return 25;
      default:
        return 5;
    }
  };

  // 图标动画变体
  const iconVariants: Variants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 100,
        duration: 0.8
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // 数量动画变体
  const amountVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  // 光晕动画变体
  const glowVariants: Variants = {
    hidden: {
      scale: 0.5,
      opacity: 0
    },
    visible: {
      scale: [0.5, 1.2, 1],
      opacity: [0, 0.8, 0.5],
      transition: {
        times: [0, 0.5, 1],
        duration: 1
      }
    }
  };

  // 生成随机粒子
  const renderParticles = () => {
    const particleCount = getParticleCount(rarity);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * 360;
      const distance = Math.random() * 50 + 50;
      const delay = Math.random() * 0.3;
      const duration = Math.random() * 0.5 + 0.5;
      const size = Math.random() * 6 + 4;

      particles.push(
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: getGlowColor(rarity),
            top: '50%',
            left: '50%',
            margin: `-${size / 2}px 0 0 -${size / 2}px`
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0
          }}
          animate={{
            x: Math.cos(angle * Math.PI / 180) * distance,
            y: Math.sin(angle * Math.PI / 180) * distance,
            opacity: [0, 1, 0],
            scale: [1, 1.5, 0.5]
          }}
          transition={{
            duration: duration,
            delay: delay,
            ease: 'easeOut'
          }}
        />
      );
    }

    return particles;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        margin: '0 auto'
      }}
    >
      {/* 光晕效果 */}
      <motion.div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: getGlowColor(rarity),
          top: 0,
          left: 0
        }}
        variants={glowVariants}
        initial="hidden"
        animate="visible"
      />

      {/* 粒子效果 */}
      {renderParticles()}

      {/* 奖励图标 */}
      <motion.div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onAnimationComplete={onAnimationComplete}
      >
        <img
          src={iconPath}
          alt={`${type} reward`}
          style={{
            width: '80%',
            height: '80%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            // 图标加载失败时使用默认图标
            const target = e.target as HTMLImageElement;
            target.onerror = null; // 防止无限循环
            target.src = type === RewardType.EXPERIENCE
              ? '/assets/rewards/experience.svg'
              : type === RewardType.COIN
                ? '/assets/rewards/coin.svg'
                : '/assets/rewards/item_common.svg';
          }}
        />
      </motion.div>

      {/* 数量显示 */}
      {amount > 1 && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: -10,
            right: -10,
            backgroundColor: 'var(--imperial-gold)',
            color: 'white',
            borderRadius: '50%',
            width: 30,
            height: 30,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
          variants={amountVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {amount}
        </motion.div>
      )}
    </div>
  );
};

export default RewardAnimation;
