// src/components/animation/InkButton.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InkColorType } from '@/utils/inkAnimationUtils';
import { playSound, SoundType } from '@/utils/sound';

// 水墨按钮组件属性
interface InkButtonProps {
  children: React.ReactNode;
  color?: InkColorType;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  playSound?: boolean;
  splashEffect?: boolean;
  hoverEffect?: boolean;
}

/**
 * 水墨按钮组件
 *
 * @param children - 按钮内容
 * @param color - 水墨颜色
 * @param size - 按钮大小
 * @param onClick - 点击事件处理函数
 * @param disabled - 是否禁用
 * @param className - CSS类名
 * @param playSound - 是否播放音效
 * @param splashEffect - 是否显示水墨飞溅效果
 * @param hoverEffect - 是否显示悬停效果
 */
const InkButton: React.FC<InkButtonProps> = ({
  children,
  color = 'black',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  playSound: playSoundEffect = true,
  splashEffect = true,
  hoverEffect = true
}) => {
  // 状态
  // We track pressed state but don't directly use the value
  const [, setIsPressed] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(false);

  // 尺寸映射
  const sizeMap = {
    small: {
      padding: '6px 12px',
      fontSize: '14px'
    },
    medium: {
      padding: '8px 16px',
      fontSize: '16px'
    },
    large: {
      padding: '12px 24px',
      fontSize: '18px'
    }
  };

  // 处理点击事件
  const handleClick = () => {
    if (disabled) return;

    // 播放音效
    if (playSoundEffect) {
      playSound(SoundType.BUTTON_CLICK, 0.5);
    }

    // 显示水墨飞溅效果
    if (splashEffect) {
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 600);
    }

    // 调用回调
    if (onClick) {
      onClick();
    }
  };

  // 水墨飞溅动画变体
  const splashVariants = {
    hidden: {
      opacity: 0,
      scale: 0
    },
    visible: {
      opacity: [0, 0.3, 0],
      scale: [0, 1.5, 2],
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.button
      className={`ink-button ink-${color} ${className}`}
      style={{
        ...sizeMap[size],
        position: 'relative',
        overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
      onClick={handleClick}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onTapCancel={() => setIsPressed(false)}
      whileHover={hoverEffect && !disabled ? {
        scale: 1.05,
        filter: 'brightness(1.1)'
      } : {}}
      whileTap={!disabled ? {
        scale: 0.95
      } : {}}
      disabled={disabled}
    >
      {/* 水墨飞溅效果 */}
      <AnimatePresence>
        {showSplash && splashEffect && (
          <motion.div
            className="ink-button-splash"
            style={{
              backgroundColor: `var(--ink-color-light)`
            }}
            variants={splashVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
        )}
      </AnimatePresence>

      {/* 按钮内容 */}
      {children}
    </motion.button>
  );
};

export default InkButton;
