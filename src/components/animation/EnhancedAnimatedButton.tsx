// src/components/animation/EnhancedAnimatedButton.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import Button, { ButtonVariant, ButtonColor } from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import {
  generateBurstParticles,
  generateFountainParticles,
  generateInkParticles,
  getParticleColorsByVariant
} from '@/utils/particleEffects';

// 按钮动画类型
export type ButtonAnimationType =
  | 'scale'
  | 'glow'
  | 'pulse'
  | 'bounce'
  | 'shake'
  | 'ripple'
  | 'ink'
  | 'inkSpread';

// 按钮音效类型
export type ButtonSoundType =
  | 'click'
  | 'success'
  | 'error'
  | 'none';

// 按钮粒子效果类型
export type ButtonParticleType =
  | 'burst'
  | 'fountain'
  | 'ink'
  | 'sparkle'
  | 'none';

// 增强动画按钮属性
interface EnhancedAnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'variant' | 'size' | 'color'> {
  variant?: ButtonVariant;
  size?: 'small' | 'medium' | 'large';
  color?: ButtonColor;
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  animationType?: ButtonAnimationType;
  soundType?: ButtonSoundType;
  particleType?: ButtonParticleType;
  particleCount?: number;
  soundVolume?: number;
  disabled?: boolean;
  disableAnimation?: boolean;
  disableParticles?: boolean;
  disableSound?: boolean;
}

/**
 * 增强的动画按钮组件，支持多种动画效果、音效和粒子效果
 */
const EnhancedAnimatedButton: React.FC<EnhancedAnimatedButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  color: themeColor = 'jade',
  isLoading = false,
  loadingText,
  children,
  className = '',
  onClick,
  animationType = 'scale',
  soundType = 'click',
  particleType = 'burst',
  particleCount = 20,
  soundVolume = 0.5,
  disabled = false,
  disableAnimation = false,
  disableParticles = false,
  disableSound = false
}) => {
  // 状态
  const [isPressed, setIsPressed] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const buttonRef = useRef<HTMLDivElement>(null);

  // 处理点击事件
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    // 播放音效
    if (!disableSound) {
      playButtonSound(soundType, soundVolume);
    }

    // 显示粒子效果
    if (!disableParticles) {
      setShowParticles(true);
      generateParticles();
    }

    // 调用原始点击事件处理函数
    if (onClick) {
      onClick(e);
    }
  };

  // 播放按钮音效
  const playButtonSound = (type: ButtonSoundType, volume: number) => {
    switch (type) {
      case 'click':
        playSound(SoundType.CLICK, volume);
        break;
      case 'success':
        playSound(SoundType.SUCCESS, volume);
        break;
      case 'error':
        playSound(SoundType.ERROR, volume);
        break;
      case 'none':
      default:
        break;
    }
  };

  // 生成粒子效果
  const generateParticles = () => {
    const particleColorBase = (themeColor === 'jade' || themeColor === 'gold') ? themeColor : 'jade';
    const colors = getParticleColorsByVariant(particleColorBase);
    let newParticles: React.ReactNode[] = [];

    switch (particleType) {
      case 'burst':
        newParticles = generateBurstParticles({
          count: particleCount,
          colors,
          spread: 360,
          distance: [30, 60],
          duration: [0.5, 1],
          size: [4, 8],
          particleType: ['circle', 'square']
        });
        break;
      case 'fountain':
        newParticles = generateFountainParticles({
          count: particleCount,
          colors,
          spread: 180,
          distance: [40, 80],
          duration: [0.8, 1.5],
          gravity: 1.2,
          particleType: ['circle', 'star']
        });
        break;
      case 'ink':
        newParticles = generateInkParticles({
          count: particleCount,
          colors: ['#000000', '#333333', '#555555'],
          spread: 360,
          distance: [20, 40],
          duration: [1, 2],
          size: [5, 10],
          particleType: 'ink'
        });
        break;
      case 'sparkle':
        newParticles = generateBurstParticles({
          count: particleCount,
          colors: themeColor === 'gold' ? ['#FFD700', '#FFC107', '#FFEB3B'] : colors,
          spread: 360,
          distance: [20, 40],
          duration: [0.3, 0.8],
          size: [2, 5],
          particleType: 'star'
        });
        break;
      case 'none':
      default:
        newParticles = [];
        break;
    }

    setParticles(newParticles);
  };

  // 清除粒子效果
  useEffect(() => {
    if (showParticles) {
      const timer = setTimeout(() => {
        setShowParticles(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showParticles]);

  // 根据动画类型获取动画属性
  const getAnimationProps = () => {
    if (disableAnimation) {
      return {};
    }

    switch (animationType) {
      case 'scale':
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        };
      case 'glow':
        return {
          whileHover: {
            boxShadow: themeColor === 'jade'
              ? '0 0 15px rgba(136, 176, 75, 0.7)'
              : themeColor === 'gold'
                ? '0 0 15px rgba(212, 175, 55, 0.7)'
                : '0 0 15px rgba(59, 130, 246, 0.5)'
          },
          whileTap: { scale: 0.98 }
        };
      case 'pulse':
        return {
          whileHover: {
            scale: [1, 1.05, 1.03],
            transition: {
              duration: 0.8,
              repeat: Infinity as number,
              repeatType: 'reverse' as const
            }
          },
          whileTap: { scale: 0.95 }
        };
      case 'bounce':
        return {
          whileHover: { y: [0, -5, 0], transition: { duration: 0.6, repeat: Infinity } },
          whileTap: { y: 2 }
        };
      case 'shake':
        return {
          whileHover: {
            x: [0, -2, 2, -2, 0],
            transition: { duration: 0.4, repeat: Infinity }
          },
          whileTap: { scale: 0.95 }
        };
      case 'ripple':
        return {
          whileTap: {
            scale: 0.98,
            transition: { duration: 0.1 }
          }
        };
      case 'inkSpread':
        return {
          whileHover: { scale: 1.02 },
          whileTap: {
            scale: 0.98,
            filter: themeColor === 'jade' || themeColor === 'gold' ? 'brightness(0.9)' : 'brightness(1.1)'
          },
          transition: { duration: 0.1 }
        };
      default:
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        };
    }
  };

  // 获取按钮大小样式
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return 'text-sm py-1 px-3';
      case 'large':
        return 'text-lg py-3 px-6';
      case 'medium':
      default:
        return 'text-base py-2 px-4';
    }
  };

  const animationProps = getAnimationProps();
  const sizeStyle = getSizeStyle();

  return (
    <div
      ref={buttonRef}
      className={`enhanced-animated-button-container relative ${className}`}
      style={{ display: 'inline-block' }}
    >
      <motion.div
        className={`enhanced-animated-button ${sizeStyle}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        onTapStart={() => setIsPressed(true)}
        onTap={() => setIsPressed(false)}
        onTapCancel={() => setIsPressed(false)}
        whileHover={animationProps.whileHover}
        whileTap={animationProps.whileTap}
      >
        <Button
          variant={variant === 'secondary' ? 'outlined' : variant}
          isLoading={isLoading}
          loadingText={loadingText}
          onClick={handleClick}
          disabled={disabled}
          className={sizeStyle}
          style={{ width: '100%', height: '100%' }}
        >
          {children}
        </Button>
      </motion.div>

      {/* 粒子效果 */}
      <AnimatePresence>
        {showParticles && !disableParticles && (
          <div className="particle-container absolute top-0 left-0 w-full h-full pointer-events-none">
            {particles}
          </div>
        )}
      </AnimatePresence>

      {/* 涟漪效果 */}
      {animationType === 'ripple' && isPressed && !disableAnimation && (
        <motion.div
          className="ripple-effect absolute top-0 left-0 w-full h-full pointer-events-none"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            borderRadius: 'inherit',
            backgroundColor: themeColor === 'primary'
              ? 'rgba(255, 255, 255, 0.2)'
              : themeColor === 'jade'
                ? 'rgba(136, 176, 75, 0.3)'
                : themeColor === 'gold'
                  ? 'rgba(212, 175, 55, 0.3)'
                  : 'rgba(59, 130, 246, 0.2)',
            position: 'absolute',
          }}
        />
      )}
    </div>
  );
};

export default EnhancedAnimatedButton;
