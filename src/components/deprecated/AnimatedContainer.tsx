// src/components/animation/AnimatedContainer.tsx
import React, { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps, TargetAndTransition, VariantLabels, AnimationControls } from 'framer-motion';
import { createContainerVariants } from '@/utils/animation';

// 使用Omit排除与HTMLMotionProps冲突的属性
interface AnimatedContainerProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'variants'> {
  children: ReactNode;
  variants?: Variants;
  staggerChildren?: number;
  delayChildren?: number;
  className?: string;
  // 使用Framer Motion的类型定义
  initial?: boolean | TargetAndTransition | VariantLabels | undefined;
  animate?: boolean | TargetAndTransition | VariantLabels | AnimationControls | undefined;
  exit?: TargetAndTransition | VariantLabels | undefined;
}

/**
 * 动画容器组件，用于为子元素添加交错动画效果
 *
 * @param children - 子元素
 * @param variants - 动画变体
 * @param staggerChildren - 子元素之间的延迟时间
 * @param delayChildren - 所有子元素的初始延迟
 * @param className - CSS类名
 * @param initial - 初始动画状态
 * @param animate - 动画状态
 * @param exit - 退出动画状态
 */
const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  variants,
  staggerChildren = 0.1,
  delayChildren = 0,
  className = '',
  initial = 'hidden',
  animate = 'visible',
  exit = 'exit',
  ...props
}) => {
  // 如果没有提供变体，则使用默认的容器变体
  const containerVariants = variants || createContainerVariants(staggerChildren, delayChildren);

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial={initial}
      animate={animate}
      exit={exit}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;
