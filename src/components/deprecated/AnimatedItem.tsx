// src/components/animation/AnimatedItem.tsx
import React, { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps, TargetAndTransition, VariantLabels, AnimationControls } from 'framer-motion';
import { listItem } from '@/utils/animation';

// 使用Omit排除与HTMLMotionProps冲突的属性
interface AnimatedItemProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'variants'> {
  children: ReactNode;
  variants?: Variants;
  index?: number;
  className?: string;
  // 使用Framer Motion的类型定义
  initial?: boolean | TargetAndTransition | VariantLabels | undefined;
  animate?: boolean | TargetAndTransition | VariantLabels | AnimationControls | undefined;
  exit?: TargetAndTransition | VariantLabels | undefined;
}

/**
 * 动画项组件，用于为列表项添加动画效果
 *
 * @param children - 子元素
 * @param variants - 动画变体
 * @param index - 项目索引，用于计算延迟
 * @param className - CSS类名
 * @param initial - 初始动画状态
 * @param animate - 动画状态
 * @param exit - 退出动画状态
 */
const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  variants = listItem,
  index = 0,
  className = '',
  initial = 'hidden',
  animate = 'visible',
  exit = 'exit',
  ...props
}) => {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      custom={index}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedItem;
