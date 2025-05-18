// src/components/panda/EnhancedPandaAnimation.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useSkeletonContext } from '@/context/SkeletonProvider';
import EnhancedPandaAvatar from './EnhancedPandaAvatar';
import { PandaMood, EnergyLevel } from './EnhancedPandaAvatar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ParticleEffect from '@/components/animation/ParticleEffect';

// 熊猫动画类型
export type PandaAnimationType = 
  'idle' | 
  'pet' | 
  'feed' | 
  'play' | 
  'train' | 
  'sleep' | 
  'wake' | 
  'levelUp' | 
  'evolve' | 
  'celebrate' | 
  'dance';

interface EnhancedPandaAnimationProps {
  type: PandaAnimationType;
  mood?: PandaMood;
  energy?: EnergyLevel;
  size?: number;
  duration?: number;
  loop?: boolean;
  autoPlay?: boolean;
  onClick?: () => void;
  onAnimationComplete?: () => void;
  className?: string;
  showAccessories?: boolean;
  showEnvironment?: boolean;
  showParticles?: boolean;
  priority?: 'low' | 'medium' | 'high';
  disableOnLowPerformance?: boolean;
  labels?: {
    loading?: string;
    error?: string;
  };
}

/**
 * 增强版熊猫动画组件
 * 显示不同类型的熊猫动画，支持粒子效果和音效
 *
 * @param type - 动画类型
 * @param mood - 熊猫的情绪状态
 * @param energy - 熊猫的能量级别
 * @param size - 动画大小
 * @param duration - 动画持续时间（秒）
 * @param loop - 是否循环播放
 * @param autoPlay - 是否自动播放
 * @param onClick - 点击动画时的回调函数
 * @param onAnimationComplete - 动画完成时的回调函数
 * @param className - 额外的CSS类名
 * @param showAccessories - 是否显示装饰
 * @param showEnvironment - 是否显示环境
 * @param showParticles - 是否显示粒子效果
 * @param priority - 动画优先级
 * @param disableOnLowPerformance - 是否在低性能设备上禁用动画
 * @param labels - 本地化标签
 */
const EnhancedPandaAnimation: React.FC<EnhancedPandaAnimationProps> = ({
  type,
  mood = 'normal',
  energy = 'medium',
  size = 150,
  duration = 2,
  loop = false,
  autoPlay = false,
  onClick,
  onAnimationComplete,
  className = '',
  showAccessories = true,
  showEnvironment = false,
  showParticles = true,
  priority = 'medium',
  disableOnLowPerformance = false,
  labels: propLabels
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 获取骨架屏上下文
  const { isSkeletonVisible } = useSkeletonContext();
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    loading: propLabels?.loading || componentLabels?.pandaAnimation?.loading || "Loading animation...",
    error: propLabels?.error || componentLabels?.pandaAnimation?.error || "Failed to load animation"
  };

  // 动画变体
  const getAnimationVariants = (): Variants => {
    switch (type) {
      case 'pet':
        return {
          initial: { rotate: 0, scale: 1 },
          animate: {
            rotate: [0, -5, 5, -3, 3, 0],
            scale: [1, 1.05, 1, 1.03, 1],
            transition: {
              duration: duration,
              repeat: loop ? Infinity : 0,
              repeatDelay: 0.5
            }
          }
        };
      case 'feed':
        return {
          initial: { y: 0, scale: 1 },
          animate: {
            y: [0, -10, 0, -5, 0],
            scale: [1, 1.1, 1, 1.05, 1],
            transition: {
              duration: duration,
              repeat: loop ? Infinity : 0,
              repeatDelay: 0.5
            }
          }
        };
      case 'play':
        return {
          initial: { rotate: 0, x: 0 },
          animate: {
            rotate: [0, 10, -10, 5, -5, 0],
            x: [0, 10, -10, 5, -5, 0],
            transition: {
              duration: duration,
              repeat: loop ? Infinity : 0,
              repeatDelay: 0.5
            }
          }
        };
      case 'train':
        return {
          initial: { y: 0 },
          animate: {
            y: [0, -15, 0, -10, 0],
            transition: {
              duration: duration,
              repeat: loop ? Infinity : 0,
              repeatDelay: 0.5
            }
          }
        };
      case 'sleep':
        return {
          initial: { scale: 1 },
          animate: {
            scale: [1, 0.95, 1, 0.95, 1],
            transition: {
              duration: duration * 2,
              repeat: loop ? Infinity : 0,
              repeatDelay: 0
            }
          }
        };
      case 'wake':
        return {
          initial: { scale: 0.9, y: 5 },
          animate: {
            scale: [0.9, 1.1, 1],
            y: [5, -10, 0],
            transition: {
              duration: duration,
              repeat: loop ? Infinity : 0,
              repeatDelay: 1
            }
          }
        };
      case 'levelUp':
        return {
          initial: { scale: 1, y: 0 },
          animate: {
            scale: [1, 1.2, 1, 1.1, 1],
            y: [0, -20, 0, -10, 0],
            transition: {
              duration: duration,
              repeat: loop ? Infinity : 0,
              repeatDelay: 1
            }
          }
        };
      case 'evolve':
        return {
          initial: { scale: 1, rotate: 0, opacity: 1 },
          animate: {
            scale: [1, 0, 1.2, 1],
            rotate: [0, 180, 360, 0],
            opacity: [1, 0.5, 1],
            transition: {
              duration: duration * 1.5,
              repeat: loop ? Infinity : 0,
              repeatDelay: 1
            }
          }
        };
      case 'celebrate':
        return {
          initial: { y: 0, rotate: 0 },
          animate: {
            y: [0, -20, 0, -15, 0, -10, 0],
            rotate: [0, 5, -5, 3, -3, 0],
            transition: {
              duration: duration,
              repeat: loop ? Infinity : 0,
              repeatDelay: 0.5
            }
          }
        };
      case 'dance':
        return {
          initial: { x: 0, rotate: 0 },
          animate: {
            x: [0, 15, -15, 10, -10, 5, -5, 0],
            rotate: [0, 10, -10, 5, -5, 3, -3, 0],
            transition: {
              duration: duration,
              repeat: loop ? Infinity : 0,
              repeatDelay: 0.5
            }
          }
        };
      case 'idle':
      default:
        return {
          initial: { scale: 1 },
          animate: {
            scale: [1, 1.03, 1, 1.02, 1],
            transition: {
              duration: duration * 2,
              repeat: loop ? Infinity : 0,
              repeatDelay: 0
            }
          }
        };
    }
  };

  // 获取粒子效果类型
  const getParticleType = (): string => {
    switch (type) {
      case 'pet':
        return 'hearts';
      case 'feed':
        return 'food';
      case 'play':
        return 'stars';
      case 'train':
        return 'sweat';
      case 'levelUp':
        return 'sparkles';
      case 'evolve':
        return 'glow';
      case 'celebrate':
        return 'confetti';
      default:
        return '';
    }
  };

  // 获取动画音效
  const getAnimationSound = (): SoundType | null => {
    switch (type) {
      case 'pet':
        return SoundType.PANDA_HAPPY;
      case 'feed':
        return SoundType.PANDA_EAT;
      case 'play':
        return SoundType.PANDA_PLAY;
      case 'train':
        return SoundType.PANDA_TRAIN;
      case 'sleep':
        return SoundType.PANDA_SLEEP;
      case 'wake':
        return SoundType.PANDA_WAKE;
      case 'levelUp':
        return SoundType.LEVEL_UP;
      case 'evolve':
        return SoundType.EVOLVE;
      case 'celebrate':
        return SoundType.CELEBRATION;
      case 'dance':
        return SoundType.PANDA_HAPPY;
      default:
        return null;
    }
  };

  // 播放动画
  const playAnimation = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      
      // 播放音效
      const sound = getAnimationSound();
      if (sound) {
        playSound(sound, 0.5);
      }
      
      // 如果不是循环播放，设置定时器停止动画
      if (!loop) {
        setTimeout(() => {
          setIsPlaying(false);
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }, duration * 1000);
      }
    }
  };

  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      playAnimation();
    }
  };

  // 自动播放
  useEffect(() => {
    if (autoPlay) {
      playAnimation();
    }
  }, [autoPlay]);

  // 如果正在加载或显示骨架屏，显示加载状态
  if (isLoading || isSkeletonVisible) {
    return (
      <div 
        className={`enhanced-panda-animation-loading ${className}`}
        style={{ width: `${size}px`, height: `${size}px`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <LoadingSpinner variant="jade" text={labels.loading} />
      </div>
    );
  }

  // 如果有错误，显示错误状态
  if (error) {
    return (
      <div 
        className={`enhanced-panda-animation-error ${className}`}
        style={{ width: `${size}px`, height: `${size}px`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className="text-red-500 text-center">
          <p>{labels.error}</p>
        </div>
      </div>
    );
  }

  // 动画变体
  const animationVariants = getAnimationVariants();
  
  // 粒子效果类型
  const particleType = getParticleType();

  // 渲染熊猫动画
  return (
    <div
      ref={containerRef}
      className={`enhanced-panda-animation-container ${className}`}
      style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}
      onClick={handleClick}
    >
      <motion.div
        variants={animationVariants}
        initial="initial"
        animate={isPlaying ? "animate" : "initial"}
      >
        <EnhancedPandaAvatar
          mood={mood}
          energy={energy}
          size={size}
          animate={false}
          showAccessories={showAccessories}
          showEnvironment={showEnvironment}
          priority={priority}
          disableOnLowPerformance={disableOnLowPerformance}
        />
      </motion.div>

      {/* 粒子效果 */}
      {showParticles && isPlaying && particleType && (
        <AnimatePresence>
          <ParticleEffect
            type={particleType}
            count={20}
            duration={duration}
            containerRef={containerRef}
          />
        </AnimatePresence>
      )}
    </div>
  );
};

export default EnhancedPandaAnimation;
