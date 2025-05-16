// src/components/animation/RewardAnimation.tsx
import React, { useEffect, useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { RewardType, RewardRarity } from '@/services/rewardService';
import { playRewardSound } from '@/utils/sound';

interface RewardAnimationProps {
  type: RewardType;
  rarity: RewardRarity;
  iconPath: string;
  amount?: number;
  size?: number;
  onAnimationComplete?: () => void;
  animationStyle?: 'default' | 'burst' | 'float' | 'spin' | 'pulse';
  playSound?: boolean;
  soundVolume?: number;
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
  onAnimationComplete,
  animationStyle = 'default',
  playSound = true,
  soundVolume = 0.5
}) => {
  // 动画完成状态
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // 播放音效
  useEffect(() => {
    if (playSound) {
      playRewardSound(rarity, soundVolume);
    }
  }, [playSound, rarity, soundVolume]);
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

  // 获取图标动画变体
  const getIconVariants = (): Variants => {
    // 默认动画
    const defaultVariants: Variants = {
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

    // 爆发动画
    const burstVariants: Variants = {
      hidden: {
        scale: 0,
        opacity: 0,
      },
      visible: {
        scale: [0, 1.5, 1],
        opacity: [0, 1, 1],
        transition: {
          times: [0, 0.6, 1],
          duration: 1,
          ease: "easeOut"
        }
      },
      exit: {
        scale: [1, 1.2, 0],
        opacity: [1, 1, 0],
        transition: {
          duration: 0.5
        }
      }
    };

    // 浮动动画
    const floatVariants: Variants = {
      hidden: {
        y: 50,
        opacity: 0,
      },
      visible: {
        y: [50, -10, 0],
        opacity: [0, 1, 1],
        transition: {
          times: [0, 0.6, 1],
          duration: 1.2,
          ease: "easeOut"
        }
      },
      exit: {
        y: -50,
        opacity: 0,
        transition: {
          duration: 0.5
        }
      }
    };

    // 旋转动画
    const spinVariants: Variants = {
      hidden: {
        scale: 0,
        opacity: 0,
        rotate: 0
      },
      visible: {
        scale: 1,
        opacity: 1,
        rotate: 360 * 2,
        transition: {
          duration: 1.2,
          ease: "easeOut"
        }
      },
      exit: {
        scale: 0,
        opacity: 0,
        rotate: 180,
        transition: {
          duration: 0.5
        }
      }
    };

    // 脉冲动画
    const pulseVariants: Variants = {
      hidden: {
        scale: 0.8,
        opacity: 0,
      },
      visible: {
        scale: [0.8, 1.1, 1, 1.05, 1],
        opacity: 1,
        transition: {
          times: [0, 0.3, 0.5, 0.8, 1],
          duration: 1,
          ease: "easeInOut",
          repeat: 0
        }
      },
      exit: {
        scale: 0.8,
        opacity: 0,
        transition: {
          duration: 0.3
        }
      }
    };

    // 根据动画样式返回对应的变体
    switch (animationStyle) {
      case 'burst':
        return burstVariants;
      case 'float':
        return floatVariants;
      case 'spin':
        return spinVariants;
      case 'pulse':
        return pulseVariants;
      default:
        return defaultVariants;
    }
  };

  // 获取当前动画变体
  const iconVariants = getIconVariants();

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
  const getGlowVariants = (): Variants => {
    // 默认光晕动画
    const defaultGlowVariants: Variants = {
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

    // 稀有和史诗光晕动画（更强烈的脉冲）
    const rareGlowVariants: Variants = {
      hidden: {
        scale: 0.5,
        opacity: 0
      },
      visible: {
        scale: [0.5, 1.3, 0.9, 1.1, 1],
        opacity: [0, 0.9, 0.7, 0.8, 0.6],
        transition: {
          times: [0, 0.3, 0.5, 0.7, 1],
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }
    };

    // 传说光晕动画（彩虹色变化）
    const legendaryGlowVariants: Variants = {
      hidden: {
        scale: 0.5,
        opacity: 0
      },
      visible: {
        scale: [0.8, 1.2, 1, 1.1, 0.9, 1],
        opacity: [0.3, 0.8, 0.6, 0.7, 0.5, 0.6],
        transition: {
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          duration: 3,
          repeat: Infinity,
          repeatType: "loop"
        }
      }
    };

    // 根据稀有度返回对应的光晕动画
    if (rarity === RewardRarity.LEGENDARY) {
      return legendaryGlowVariants;
    } else if (rarity === RewardRarity.EPIC || rarity === RewardRarity.RARE) {
      return rareGlowVariants;
    } else {
      return defaultGlowVariants;
    }
  };

  const glowVariants = getGlowVariants();

  // 生成随机粒子
  const renderParticles = () => {
    const particleCount = getParticleCount(rarity);
    const particles: React.ReactNode[] = [];

    // 根据稀有度和动画样式调整粒子效果
    const getParticleStyle = () => {
      // 默认粒子样式
      if (animationStyle === 'default' || animationStyle === 'pulse') {
        // 标准放射状粒子
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * 360;
          const distance = Math.random() * 50 + 50;
          const delay = Math.random() * 0.3;
          const duration = Math.random() * 0.5 + 0.5;
          const size = Math.random() * 6 + 4;

          particles.push(
            <motion.div
              key={`standard-${i}`}
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
      }

      // 爆发式粒子 - 更多、更快的粒子
      if (animationStyle === 'burst') {
        for (let i = 0; i < particleCount * 1.5; i++) {
          const angle = Math.random() * 360;
          const distance = Math.random() * 80 + 40;
          const delay = Math.random() * 0.2;
          const duration = Math.random() * 0.4 + 0.3;
          const size = Math.random() * 5 + 3;

          particles.push(
            <motion.div
              key={`burst-${i}`}
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
                scale: [1, 2, 0]
              }}
              transition={{
                duration: duration,
                delay: delay,
                ease: 'easeOut'
              }}
            />
          );
        }
      }

      // 浮动粒子 - 上升的粒子
      if (animationStyle === 'float') {
        for (let i = 0; i < particleCount; i++) {
          const xOffset = (Math.random() - 0.5) * 80;
          const yDistance = -1 * (Math.random() * 60 + 40);
          const delay = Math.random() * 0.5;
          const duration = Math.random() * 1 + 1;
          const size = Math.random() * 6 + 3;

          particles.push(
            <motion.div
              key={`float-${i}`}
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
                x: xOffset / 3,
                y: 10,
                opacity: 0
              }}
              animate={{
                x: xOffset,
                y: yDistance,
                opacity: [0, 0.8, 0],
                scale: [0.8, 1.2, 0.5]
              }}
              transition={{
                duration: duration,
                delay: delay,
                ease: 'easeOut'
              }}
            />
          );
        }
      }

      // 旋转粒子 - 围绕中心旋转
      if (animationStyle === 'spin') {
        for (let i = 0; i < particleCount; i++) {
          const radius = Math.random() * 30 + 30;
          const startAngle = Math.random() * 360;
          const duration = Math.random() * 2 + 2;
          const delay = Math.random() * 0.3;
          const size = Math.random() * 5 + 3;

          particles.push(
            <motion.div
              key={`spin-${i}`}
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
                opacity: 0,
                x: Math.cos(startAngle * Math.PI / 180) * radius,
                y: Math.sin(startAngle * Math.PI / 180) * radius,
              }}
              animate={{
                opacity: [0, 0.8, 0.8, 0],
                x: [
                  Math.cos(startAngle * Math.PI / 180) * radius,
                  Math.cos((startAngle + 120) * Math.PI / 180) * radius,
                  Math.cos((startAngle + 240) * Math.PI / 180) * radius,
                  Math.cos((startAngle + 360) * Math.PI / 180) * radius
                ],
                y: [
                  Math.sin(startAngle * Math.PI / 180) * radius,
                  Math.sin((startAngle + 120) * Math.PI / 180) * radius,
                  Math.sin((startAngle + 240) * Math.PI / 180) * radius,
                  Math.sin((startAngle + 360) * Math.PI / 180) * radius
                ]
              }}
              transition={{
                duration: duration,
                delay: delay,
                ease: 'linear',
                times: [0, 0.33, 0.66, 1]
              }}
            />
          );
        }
      }

      // 传说级特效 - 额外的星星粒子
      if (rarity === RewardRarity.LEGENDARY) {
        // 添加星形粒子
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * 360;
          const distance = Math.random() * 30 + 60;
          const delay = Math.random() * 0.5 + 0.5;
          const duration = Math.random() * 1.5 + 1.5;

          particles.push(
            <motion.div
              key={`star-${i}`}
              style={{
                position: 'absolute',
                width: 10,
                height: 10,
                top: '50%',
                left: '50%',
                margin: '-5px 0 0 -5px',
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                backgroundColor: '#FFD700',
                boxShadow: '0 0 10px #FFD700'
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
                rotate: 0
              }}
              animate={{
                x: Math.cos(angle * Math.PI / 180) * distance,
                y: Math.sin(angle * Math.PI / 180) * distance,
                scale: [0, 1.5, 1, 1.2, 0],
                opacity: [0, 1, 1, 0.8, 0],
                rotate: 360
              }}
              transition={{
                duration: duration,
                delay: delay,
                ease: 'easeInOut',
                times: [0, 0.2, 0.4, 0.8, 1]
              }}
            />
          );
        }
      }
    };

    // 生成粒子
    getParticleStyle();

    return particles;
  };

  // 处理动画完成
  const handleAnimationComplete = () => {
    setIsAnimationComplete(true);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  // 获取传说级奖励的彩虹边框
  const getLegendaryBorder = () => {
    if (rarity === RewardRarity.LEGENDARY) {
      return (
        <motion.div
          style={{
            position: 'absolute',
            width: '110%',
            height: '110%',
            borderRadius: '50%',
            border: '3px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'content-box, border-box',
            top: '-5%',
            left: '-5%'
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      );
    }
    return null;
  };

  // 获取稀有级奖励的特殊边框
  const getRareBorder = () => {
    if (rarity === RewardRarity.RARE || rarity === RewardRarity.EPIC) {
      return (
        <motion.div
          style={{
            position: 'absolute',
            width: '110%',
            height: '110%',
            borderRadius: '50%',
            border: '2px solid',
            borderColor: rarity === RewardRarity.RARE ? '#0088ff' : '#a335ee',
            top: '-5%',
            left: '-5%'
          }}
          animate={{
            boxShadow: [
              `0 0 5px ${rarity === RewardRarity.RARE ? '#0088ff' : '#a335ee'}`,
              `0 0 15px ${rarity === RewardRarity.RARE ? '#0088ff' : '#a335ee'}`,
              `0 0 5px ${rarity === RewardRarity.RARE ? '#0088ff' : '#a335ee'}`
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      );
    }
    return null;
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
      {/* 特殊边框效果 */}
      {getLegendaryBorder()}
      {getRareBorder()}

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
      <AnimatePresence>
        {!isAnimationComplete && renderParticles()}
      </AnimatePresence>

      {/* 奖励图标 */}
      <motion.div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2
        }}
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onAnimationComplete={handleAnimationComplete}
      >
        <img
          src={iconPath}
          alt={`${type} reward`}
          style={{
            width: '80%',
            height: '80%',
            objectFit: 'contain',
            filter: rarity === RewardRarity.LEGENDARY
              ? 'drop-shadow(0 0 5px gold)'
              : rarity === RewardRarity.EPIC
                ? 'drop-shadow(0 0 3px purple)'
                : rarity === RewardRarity.RARE
                  ? 'drop-shadow(0 0 3px blue)'
                  : 'none'
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
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            zIndex: 3
          }}
          variants={amountVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {amount}
        </motion.div>
      )}

      {/* 稀有度指示器 - 只对稀有及以上显示 */}
      {(rarity === RewardRarity.RARE || rarity === RewardRarity.EPIC || rarity === RewardRarity.LEGENDARY) && (
        <motion.div
          style={{
            position: 'absolute',
            top: -15,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: rarity === RewardRarity.LEGENDARY
              ? '#FFD700'
              : rarity === RewardRarity.EPIC
                ? '#a335ee'
                : '#0088ff',
            color: 'white',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            boxShadow: `0 0 5px ${
              rarity === RewardRarity.LEGENDARY
                ? '#FFD700'
                : rarity === RewardRarity.EPIC
                  ? '#a335ee'
                  : '#0088ff'
            }`,
            zIndex: 3
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {rarity === RewardRarity.LEGENDARY
            ? '传说'
            : rarity === RewardRarity.EPIC
              ? '史诗'
              : '稀有'}
        </motion.div>
      )}
    </div>
  );
};

export default RewardAnimation;
