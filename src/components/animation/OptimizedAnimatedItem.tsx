// src/components/animation/OptimizedAnimatedItem.tsx
import React, { ReactNode, useMemo } from 'react';
import { motion, Variants, HTMLMotionProps, TargetAndTransition, VariantLabels, AnimationControls } from 'framer-motion';
import { listItem } from '@/utils/animation';
import { useAnimationPerformance } from '@/context/AnimationPerformanceProvider';

// 使用Omit排除与HTMLMotionProps冲突的属性
interface OptimizedAnimatedItemProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'variants'> {
  children: ReactNode;
  variants?: Variants;
  index?: number;
  className?: string;
  // 使用Framer Motion的类型定义
  initial?: boolean | TargetAndTransition | VariantLabels | undefined;
  animate?: boolean | TargetAndTransition | VariantLabels | AnimationControls | undefined;
  exit?: TargetAndTransition | VariantLabels | undefined;
  priority?: 'low' | 'medium' | 'high';
  disableOnLowPerformance?: boolean;
}

/**
 * 优化的动画项组件，根据设备性能自动调整动画效果
 *
 * @param children - 子元素
 * @param variants - 动画变体
 * @param index - 项目索引，用于计算延迟
 * @param className - CSS类名
 * @param initial - 初始动画状态
 * @param animate - 动画状态
 * @param exit - 退出动画状态
 * @param priority - 动画优先级，低性能设备上只显示高优先级动画
 * @param disableOnLowPerformance - 是否在低性能设备上禁用动画
 */
const OptimizedAnimatedItem: React.FC<OptimizedAnimatedItemProps> = ({
  children,
  variants = listItem,
  index = 0,
  className = '',
  initial = 'hidden',
  animate = 'visible',
  exit = 'exit',
  priority = 'medium',
  disableOnLowPerformance = false,
  ...props
}) => {
  // 获取动画性能配置
  const {
    config,
    isLowPerformanceMode,
    isReducedMotionMode,
    isAnimationEnabled
  } = useAnimationPerformance();

  // 根据性能配置调整索引
  const adjustedIndex = useMemo(() => {
    if (isReducedMotionMode || !isAnimationEnabled) {
      return 0;
    }

    if (isLowPerformanceMode) {
      return priority === 'high' ? Math.floor(index / 2) : 0;
    }

    switch (config.animationQuality) {
      case 'low':
        return Math.floor(index / 2);
      case 'medium':
        return Math.floor(index * 0.8);
      case 'high':
      default:
        return index;
    }
  }, [index, isLowPerformanceMode, isReducedMotionMode, isAnimationEnabled, config.animationQuality, priority]);

  // 如果在低性能设备上禁用动画，直接渲染子元素
  if ((isLowPerformanceMode && disableOnLowPerformance) ||
      (isLowPerformanceMode && priority === 'low') ||
      !isAnimationEnabled) {
    // 创建一个不包含motion特定属性的props对象
    const {
      initial, animate, exit, variants, transition,
      whileHover, whileTap, whileInView, whileFocus, whileDrag,
      style, // Extract style to avoid passing it twice
      ...divProps
    } = props;

    return (
      <div
        className={className}
        style={style}
        {...divProps}
      >
        {children}
      </div>
    );
  }

  // 如果启用减少动作模式，使用简化的动画
  if (isReducedMotionMode) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  // 使用硬件加速
  const transformStyle = config.useHardwareAcceleration
    ? { willChange: 'opacity, transform' }
    : {};

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      custom={adjustedIndex}
      style={{
        ...props.style,
        ...transformStyle
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default OptimizedAnimatedItem;
