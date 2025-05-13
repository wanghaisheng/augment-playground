// src/components/animation/GoldenGlow.tsx
import React, { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { goldenGlow } from '@/utils/animation';

interface GoldenGlowProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  onClick?: () => void;
}

/**
 * 金光效果动画组件，用于创建中国风金光动画效果
 * 
 * @param children - 子元素
 * @param variants - 动画变体
 * @param className - CSS类名
 * @param intensity - 强度
 * @param onClick - 点击事件处理函数
 */
const GoldenGlow: React.FC<GoldenGlowProps> = ({
  children,
  variants = goldenGlow,
  className = '',
  intensity = 'medium',
  onClick,
  ...props
}) => {
  // 根据强度设置样式
  const intensityStyles = {
    low: { 
      boxShadow: '0 0 10px 2px rgba(212, 175, 55, 0.3)',
      filter: 'brightness(1.1) saturate(1.1)'
    },
    medium: { 
      boxShadow: '0 0 15px 5px rgba(212, 175, 55, 0.5)',
      filter: 'brightness(1.2) saturate(1.2)'
    },
    high: { 
      boxShadow: '0 0 20px 10px rgba(212, 175, 55, 0.7)',
      filter: 'brightness(1.3) saturate(1.3)'
    }
  };

  return (
    <motion.div
      className={`golden-glow ${className}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: 'relative',
        ...intensityStyles[intensity],
        ...props.style
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GoldenGlow;
