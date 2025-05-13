// src/components/animation/PageTransition.tsx
import React, { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { pageTransition } from '@/utils/animation';

interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  className?: string;
}

/**
 * 页面过渡组件，用于为页面添加进入和退出动画
 * 
 * @param children - 子元素
 * @param variants - 动画变体
 * @param className - CSS类名
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variants = pageTransition,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
