// src/components/animation/AnimatedButton.tsx
import React from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import Button from '@/components/common/Button';

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'jade' | 'gold';
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  whileHover?: object;
  whileTap?: object;
  className?: string;
  onClick?: () => void;
}

/**
 * 动画按钮组件，为Button组件添加动画效果
 * 
 * @param variant - 按钮变体
 * @param isLoading - 是否显示加载状态
 * @param loadingText - 加载状态文本
 * @param children - 子元素
 * @param whileHover - 悬停动画
 * @param whileTap - 点击动画
 * @param className - CSS类名
 * @param onClick - 点击事件处理函数
 */
const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  loadingText,
  children,
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 },
  className = '',
  onClick,
  ...props
}) => {
  // 根据变体设置不同的动画效果
  const getAnimationProps = () => {
    switch (variant) {
      case 'jade':
        return {
          whileHover: { 
            scale: 1.05, 
            boxShadow: '0 0 15px rgba(136, 176, 75, 0.5)' 
          },
          whileTap: { 
            scale: 0.95 
          }
        };
      case 'gold':
        return {
          whileHover: { 
            scale: 1.05, 
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)' 
          },
          whileTap: { 
            scale: 0.95 
          }
        };
      default:
        return {
          whileHover,
          whileTap
        };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <motion.div
      className={`animated-button-container ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      {...animationProps}
      {...props}
    >
      <Button
        variant={variant}
        isLoading={isLoading}
        loadingText={loadingText}
        onClick={onClick}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
