// src/components/animation/InkSplash.tsx
import React, { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { inkSplash } from '@/utils/animation';

interface InkSplashProps extends HTMLMotionProps<'div'> {
  children?: ReactNode;
  variants?: Variants;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  onClick?: () => void;
}

/**
 * 水墨效果动画组件，用于创建中国风水墨动画效果
 * 
 * @param children - 子元素
 * @param variants - 动画变体
 * @param className - CSS类名
 * @param size - 大小
 * @param color - 颜色
 * @param onClick - 点击事件处理函数
 */
const InkSplash: React.FC<InkSplashProps> = ({
  children,
  variants = inkSplash,
  className = '',
  size = 'medium',
  color = 'var(--royal-jade)',
  onClick,
  ...props
}) => {
  // 根据大小设置样式
  const sizeStyles = {
    small: { width: '50px', height: '50px' },
    medium: { width: '100px', height: '100px' },
    large: { width: '150px', height: '150px' }
  };

  return (
    <motion.div
      className={`ink-splash ${className}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        ...sizeStyles[size],
        backgroundColor: color,
        borderRadius: '50%',
        filter: 'blur(5px)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...props.style
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default InkSplash;
