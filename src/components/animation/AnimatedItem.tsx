// src/components/animation/AnimatedItem.tsx
import React, { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { listItem } from '@/utils/animation';

interface AnimatedItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  index?: number;
  className?: string;
  initial?: string | object;
  animate?: string | object;
  exit?: string | object;
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
