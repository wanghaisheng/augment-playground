// src/components/animation/InkCard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InkColorType } from '@/utils/inkAnimationUtils';

// 水墨卡片组件属性
interface InkCardProps {
  children: React.ReactNode;
  color?: InkColorType;
  width?: string | number;
  height?: string | number;
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
  splashEffect?: boolean;
  hoverEffect?: boolean;
}

/**
 * 水墨卡片组件
 * 
 * @param children - 卡片内容
 * @param color - 水墨颜色
 * @param width - 卡片宽度
 * @param height - 卡片高度
 * @param onClick - 点击事件处理函数
 * @param className - CSS类名
 * @param interactive - 是否可交互
 * @param splashEffect - 是否显示水墨飞溅效果
 * @param hoverEffect - 是否显示悬停效果
 */
const InkCard: React.FC<InkCardProps> = ({
  children,
  color = 'black',
  width = '100%',
  height = 'auto',
  onClick,
  className = '',
  interactive = true,
  splashEffect = true,
  hoverEffect = true
}) => {
  // 状态
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(false);
  
  // 处理点击事件
  const handleClick = () => {
    if (!interactive) return;
    
    // 显示水墨飞溅效果
    if (splashEffect) {
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 800);
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
      opacity: [0, 0.2, 0],
      scale: [0, 1, 1.5],
      transition: { 
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };
  
  // 生成随机水墨飞溅
  const generateRandomSplashes = () => {
    const splashes = [];
    const count = 3;
    
    for (let i = 0; i < count; i++) {
      const size = 20 + Math.random() * 40;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = i * 0.1;
      
      splashes.push(
        <motion.div
          key={`splash-${i}`}
          className="ink-card-splash"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: size,
            height: size,
            backgroundColor: `var(--ink-color-lighter)`
          }}
          variants={splashVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{
            delay
          }}
        />
      );
    }
    
    return splashes;
  };
  
  return (
    <motion.div
      className={`ink-card ink-${color} ${className}`}
      style={{
        width,
        height,
        cursor: interactive ? 'pointer' : 'default'
      }}
      onClick={handleClick}
      onHoverStart={() => {
        if (interactive && hoverEffect) {
          setIsHovered(true);
        }
      }}
      onHoverEnd={() => {
        if (interactive && hoverEffect) {
          setIsHovered(false);
        }
      }}
      whileHover={interactive && hoverEffect ? { 
        scale: 1.02,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
      } : {}}
      whileTap={interactive ? { 
        scale: 0.98
      } : {}}
    >
      {/* 水墨飞溅效果 */}
      <AnimatePresence>
        {showSplash && splashEffect && generateRandomSplashes()}
      </AnimatePresence>
      
      {/* 悬停效果 */}
      <AnimatePresence>
        {isHovered && hoverEffect && (
          <motion.div
            className="ink-card-hover-effect"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: `var(--ink-color-lighter)`,
              opacity: 0,
              zIndex: 0,
              borderRadius: 'inherit'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      
      {/* 卡片内容 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
};

export default InkCard;
