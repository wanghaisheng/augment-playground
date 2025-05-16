// src/components/animation/InkTextAnimation.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InkColorType } from '@/utils/inkAnimationUtils';

// 水墨文字动画组件属性
interface InkTextAnimationProps {
  text: string;
  color?: InkColorType;
  fontSize?: number;
  duration?: number;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  onComplete?: () => void;
  autoPlay?: boolean;
  loop?: boolean;
}

/**
 * 水墨文字动画组件
 * 
 * @param text - 要显示的文字
 * @param color - 水墨颜色
 * @param fontSize - 字体大小
 * @param duration - 动画持续时间
 * @param delay - 动画延迟时间
 * @param staggerDelay - 字符间延迟时间
 * @param className - CSS类名
 * @param onComplete - 动画完成回调
 * @param autoPlay - 是否自动播放
 * @param loop - 是否循环播放
 */
const InkTextAnimation: React.FC<InkTextAnimationProps> = ({
  text,
  color = 'black',
  fontSize = 36,
  duration = 2,
  delay = 0,
  staggerDelay = 0.1,
  className = '',
  onComplete,
  autoPlay = true,
  loop = false
}) => {
  // 状态
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isVisible, setIsVisible] = useState<boolean>(autoPlay);
  const characters = text.split('');
  
  // 播放动画
  const playAnimation = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setIsVisible(true);
    }
  };

  // 处理动画完成
  const handleAnimationComplete = () => {
    if (loop) {
      // 如果是循环播放，重新开始动画
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 500);
    } else {
      // 停止播放
      setIsPlaying(false);
    }

    // 调用回调
    if (onComplete) {
      onComplete();
    }
  };

  // 监听循环播放
  useEffect(() => {
    if (loop && !isPlaying) {
      setIsPlaying(true);
      setIsVisible(true);
    }
  }, [loop]);

  // 设置动画完成定时器
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        handleAnimationComplete();
      }, delay * 1000 + duration * 1000 + characters.length * staggerDelay * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, characters.length, delay, duration, staggerDelay]);

  // 字符动画变体
  const characterVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.5,
      filter: 'blur(10px)'
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        delay: delay + i * staggerDelay,
        duration: 0.5,
        ease: [0.17, 0.67, 0.83, 0.67] // 模拟水墨扩散效果
      }
    }),
    exit: (i: number) => ({
      opacity: 0,
      scale: 1.2,
      filter: 'blur(5px)',
      transition: {
        delay: i * (staggerDelay / 2),
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };
  
  // 墨滴动画变体
  const inkDropVariants = {
    hidden: { 
      opacity: 0,
      scale: 0
    },
    visible: (i: number) => ({
      opacity: [0, 0.7, 0.3],
      scale: [0, 1.5, 1],
      transition: {
        delay: delay + i * staggerDelay,
        duration: 0.8,
        ease: 'easeOut'
      }
    }),
    exit: (i: number) => ({
      opacity: 0,
      scale: 1.5,
      transition: {
        delay: i * (staggerDelay / 2),
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };

  return (
    <div 
      className={`ink-text-animation ink-${color} ${className}`}
      onClick={playAnimation}
      style={{ 
        display: 'inline-block',
        cursor: isPlaying ? 'default' : 'pointer'
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="ink-text-container"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {characters.map((char, index) => (
              <motion.div
                key={`${char}-${index}`}
                className="ink-text-character"
                style={{
                  position: 'relative',
                  margin: '0 2px'
                }}
                custom={index}
                variants={characterVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* 墨滴效果 */}
                <motion.div
                  className="ink-text-blob"
                  style={{
                    width: `${fontSize * 1.5}px`,
                    height: `${fontSize * 1.5}px`,
                    backgroundColor: `var(--ink-color-lighter)`
                  }}
                  custom={index}
                  variants={inkDropVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                />
                
                {/* 文字 */}
                <motion.span
                  className="ink-text"
                  style={{
                    fontSize: `${fontSize}px`,
                    color: `var(--ink-color)`
                  }}
                >
                  {char}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InkTextAnimation;
