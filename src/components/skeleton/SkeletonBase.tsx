// src/components/skeleton/SkeletonBase.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonBaseProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  animate?: boolean;
  variant?: 'default' | 'jade' | 'gold';
}

/**
 * 基础骨架组件
 * 提供基础的脉动动画效果
 * 
 * @param width - 宽度
 * @param height - 高度
 * @param borderRadius - 边框圆角
 * @param className - 自定义CSS类名
 * @param style - 自定义样式
 * @param children - 子元素
 * @param animate - 是否启用动画
 * @param variant - 变体样式
 */
const SkeletonBase: React.FC<SkeletonBaseProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '0.25rem',
  className = '',
  style = {},
  children,
  animate = true,
  variant = 'default'
}) => {
  // 获取变体样式
  const getVariantStyle = () => {
    switch (variant) {
      case 'jade':
        return 'bg-gradient-to-r from-jade-200 to-jade-300';
      case 'gold':
        return 'bg-gradient-to-r from-amber-100 to-amber-200';
      default:
        return 'bg-gradient-to-r from-gray-200 to-gray-300';
    }
  };

  // 基础样式
  const baseStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: borderRadius,
    ...style
  };

  // 如果不需要动画，直接返回静态元素
  if (!animate) {
    return (
      <div
        className={`skeleton-base ${getVariantStyle()} ${className}`}
        style={baseStyle}
      >
        {children}
      </div>
    );
  }

  // 带动画的元素
  return (
    <motion.div
      className={`skeleton-base ${getVariantStyle()} ${className}`}
      style={baseStyle}
      animate={{
        opacity: [0.7, 0.9, 0.7],
        background: variant === 'jade' 
          ? ['linear-gradient(90deg, #e0f2f1 0%, #b2dfdb 50%, #e0f2f1 100%)'] 
          : variant === 'gold'
            ? ['linear-gradient(90deg, #fff8e1 0%, #ffe082 50%, #fff8e1 100%)']
            : ['linear-gradient(90deg, #f5f5f5 0%, #eeeeee 50%, #f5f5f5 100%)']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'reverse'
      }}
    >
      {children}
    </motion.div>
  );
};

export default SkeletonBase;
