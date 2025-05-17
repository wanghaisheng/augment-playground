// src/components/game/PandaAnimation.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PandaAvatar, { PandaMood, EnergyLevel } from '@/components/game/PandaAvatar';
import { playSound, SoundType } from '@/utils/sound';

// 熊猫动画类型
export type PandaAnimationType =
  | 'pet'      // 抚摸
  | 'eat'      // 吃东西
  | 'play'     // 玩耍
  | 'train'    // 训练
  | 'clean'    // 清洁
  | 'talk'     // 对话
  | 'happy'    // 开心
  | 'pose'     // 摆姿势
  | 'sleep'    // 睡觉
  | 'wake'     // 醒来
  | 'levelUp'  // 升级
  | 'idle';    // 待机

// 熊猫动画属性
interface PandaAnimationProps {
  type: PandaAnimationType;
  mood?: PandaMood;
  energy?: EnergyLevel;
  size?: number;
  duration?: number;
  loop?: boolean;
  autoPlay?: boolean;
  onAnimationComplete?: () => void;
  onClick?: () => void;
  className?: string;
  showAccessories?: boolean;
  showEnvironment?: boolean;
}

/**
 * 熊猫动画组件
 *
 * @param type - 动画类型
 * @param mood - 熊猫心情
 * @param energy - 熊猫能量
 * @param size - 熊猫大小
 * @param duration - 动画持续时间（秒）
 * @param loop - 是否循环播放
 * @param autoPlay - 是否自动播放
 * @param onAnimationComplete - 动画完成回调
 * @param onClick - 点击回调
 * @param className - 自定义类名
 * @param showAccessories - 是否显示装饰
 * @param showEnvironment - 是否显示环境
 */
const PandaAnimation: React.FC<PandaAnimationProps> = ({
  type = 'idle',
  mood = 'normal',
  energy = 'medium',
  size = 150,
  duration = 1,
  loop = false,
  autoPlay = true,
  onAnimationComplete,
  onClick,
  className = '',
  showAccessories = true,
  showEnvironment = false
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  // const [currentFrame, setCurrentFrame] = useState<number>(0); // 未使用的状态
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 动画配置
  const getAnimationConfig = () => {
    switch (type) {
      case 'pet':
        return {
          frames: 5,
          frameRate: 8,
          sound: SoundType.PANDA_HAPPY,
          variants: {
            x: [0, -5, 5, -3, 0],
            y: [0, -3, -5, -2, 0],
            rotate: [0, -2, 2, -1, 0],
            scale: [1, 1.05, 1.08, 1.03, 1]
          }
        };
      case 'eat':
        return {
          frames: 6,
          frameRate: 4,
          sound: SoundType.PANDA_EAT,
          variants: {
            y: [0, 2, 0, 2, 0, 2],
            scale: [1, 1.02, 1, 1.02, 1, 1.02]
          }
        };
      case 'play':
        return {
          frames: 8,
          frameRate: 6,
          sound: SoundType.PANDA_PLAY,
          variants: {
            rotate: [0, 5, -5, 5, -5, 3, -3, 0],
            y: [0, -10, 0, -8, 0, -5, 0, 0],
            scale: [1, 1.1, 1, 1.08, 1, 1.05, 1, 1]
          }
        };
      case 'train':
        return {
          frames: 6,
          frameRate: 5,
          sound: SoundType.PANDA_TRAIN,
          variants: {
            x: [0, 5, -5, 5, -5, 0],
            y: [0, -2, -2, -2, -2, 0],
            scale: [1, 1.03, 1.03, 1.03, 1.03, 1]
          }
        };
      case 'clean':
        return {
          frames: 5,
          frameRate: 4,
          sound: SoundType.WATER_SPLASH,
          variants: {
            rotate: [0, 3, -3, 3, 0],
            scale: [1, 1.02, 1, 1.02, 1]
          }
        };
      case 'talk':
        return {
          frames: 4,
          frameRate: 3,
          sound: SoundType.PANDA_TALK,
          variants: {
            y: [0, -2, 0, -2],
            scale: [1, 1.02, 1, 1.02]
          }
        };
      case 'happy':
        return {
          frames: 6,
          frameRate: 6,
          sound: SoundType.PANDA_HAPPY,
          variants: {
            y: [0, -10, 0, -8, 0, 0],
            rotate: [0, 3, -3, 2, -2, 0],
            scale: [1, 1.1, 1.05, 1.08, 1.03, 1]
          }
        };
      case 'pose':
        return {
          frames: 3,
          frameRate: 2,
          sound: SoundType.CAMERA_SHUTTER,
          variants: {
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }
        };
      case 'sleep':
        return {
          frames: 4,
          frameRate: 2,
          sound: SoundType.LULLABY,
          variants: {
            y: [0, 2, 4, 2],
            scale: [1, 0.98, 0.96, 0.98]
          }
        };
      case 'wake':
        return {
          frames: 5,
          frameRate: 4,
          sound: SoundType.MORNING_BELL,
          variants: {
            y: [2, 0, -2, 0, 0],
            scale: [0.96, 1, 1.03, 1.01, 1]
          }
        };
      case 'levelUp':
        return {
          frames: 8,
          frameRate: 8,
          sound: SoundType.LEVEL_UP,
          variants: {
            y: [0, -15, -10, -20, -10, -15, -5, 0],
            scale: [1, 1.2, 1.15, 1.25, 1.15, 1.1, 1.05, 1],
            rotate: [0, 5, -5, 3, -3, 2, -2, 0]
          }
        };
      case 'idle':
      default:
        return {
          frames: 4,
          frameRate: 1,
          sound: null,
          variants: {
            y: [0, -2, 0, -1],
            scale: [1, 1.01, 1, 1.005]
          }
        };
    }
  };

  // 播放动画
  const playAnimation = () => {
    if (isPlaying) return;

    setIsPlaying(true);
    // setCurrentFrame(0); // 未使用的状态更新

    // 播放音效
    const config = getAnimationConfig();
    if (config.sound) {
      playSound(config.sound, 0.5);
    }
  };

  // 停止动画
  const stopAnimation = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // 处理动画帧
  useEffect(() => {
    if (!isPlaying) return;

    const config = getAnimationConfig();
    const frameDuration = 1000 / config.frameRate;
    let frameCount = 0;
    let lastTime = 0;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const elapsed = time - lastTime;

      if (elapsed >= frameDuration) {
        lastTime = time;
        frameCount++;
        // setCurrentFrame(frameCount % config.frames); // 未使用的状态更新

        // 检查动画是否完成
        if (frameCount >= config.frames && !loop) {
          setIsPlaying(false);
          if (onAnimationComplete) {
            onAnimationComplete();
          }
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, loop, onAnimationComplete, type]);

  // 自动播放
  useEffect(() => {
    if (autoPlay) {
      playAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [autoPlay, type]);

  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (!isPlaying) {
      playAnimation();
    }
  };

  // 获取动画变体
  const config = getAnimationConfig();
  const animationVariants = {
    initial: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1
    },
    animate: {
      x: config.variants.x || [0],
      y: config.variants.y || [0],
      rotate: config.variants.rotate || [0],
      scale: config.variants.scale || [1],
      transition: {
        duration: duration,
        times: Array.from({ length: config.frames }).map((_, i) => i / (config.frames - 1)),
        repeat: loop ? Infinity : 0,
        repeatType: 'loop' as const
      }
    }
  };

  // 添加粒子效果
  const renderParticles = () => {
    if (!isPlaying) return null;

    switch (type) {
      case 'pet':
        return (
          <div className="panda-particles">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`heart-${i}`}
                className="heart-particle"
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 5)],
                  y: [-10 - i * 5, -30 - i * 10]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  ease: 'easeOut'
                }}
                style={{
                  position: 'absolute',
                  top: '30%',
                  left: '50%',
                  width: 10 + i * 2,
                  height: 10 + i * 2,
                  backgroundColor: '#ff6b6b',
                  borderRadius: '50% 50% 0 0',
                  transform: 'rotate(-45deg)',
                  zIndex: 10
                }}
              />
            ))}
          </div>
        );
      case 'eat':
        return (
          <div className="panda-particles">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`food-${i}`}
                className="food-particle"
                initial={{ opacity: 0, scale: 0, x: -20, y: 20 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [-20, 0],
                  y: [20, 0]
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.5,
                  ease: 'easeOut'
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '30%',
                  width: 15,
                  height: 15,
                  backgroundColor: '#8dc63f',
                  borderRadius: '50%',
                  zIndex: 10
                }}
              />
            ))}
          </div>
        );
      // 其他类型的粒子效果可以在这里添加
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`panda-animation-container ${className}`}
      style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}
      onClick={handleClick}
    >
      <motion.div
        variants={animationVariants}
        initial="initial"
        animate={isPlaying ? "animate" : "initial"}
      >
        <PandaAvatar
          mood={mood}
          energy={energy}
          size={size}
          animate={false}
          showAccessories={showAccessories}
          showEnvironment={showEnvironment}
        />
      </motion.div>

      {renderParticles()}
    </div>
  );
};

export default PandaAnimation;
