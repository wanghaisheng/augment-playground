// src/animations/components.tsx
import React, { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { 
  fadeIn, 
  slideUp, 
  pageTransition, 
  listItem, 
  inkSpread, 
  scrollUnroll 
} from './variants';
import { createContainerVariants } from './presets';

// 动画容器组件接口
interface AnimatedContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  staggerChildren?: number;
  delayChildren?: number;
  className?: string;
  initial?: string;
  animate?: string;
  exit?: string;
}

/**
 * 动画容器组件，用于为子元素添加交错动画效果
 */
export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
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

// 动画项组件接口
interface AnimatedItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  index?: number;
  className?: string;
  initial?: string;
  animate?: string;
  exit?: string;
}

/**
 * 动画项组件，用于为列表项添加动画效果
 */
export const AnimatedItem: React.FC<AnimatedItemProps> = ({
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

// 页面过渡组件接口
interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  className?: string;
}

/**
 * 页面过渡组件，用于为页面添加进入和退出动画
 */
export const PageTransitionWrapper: React.FC<PageTransitionProps> = ({
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

// 淡入组件接口
interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  duration?: number;
}

/**
 * 淡入组件，用于为元素添加淡入动画
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  variants = fadeIn,
  className = '',
  duration,
  ...props
}) => {
  // 如果提供了持续时间，则创建自定义变体
  const customVariants = duration ? {
    ...fadeIn,
    visible: {
      ...fadeIn.visible,
      transition: { duration }
    }
  } : variants;

  return (
    <motion.div
      className={className}
      variants={customVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
};

// 滑入组件接口
interface SlideInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * 滑入组件，用于为元素添加滑入动画
 */
export const SlideIn: React.FC<SlideInProps> = ({
  children,
  variants = slideUp,
  className = '',
  direction = 'up',
  ...props
}) => {
  // 根据方向选择变体
  const getDirectionVariants = () => {
    switch (direction) {
      case 'up':
        return slideUp;
      case 'down':
        return {
          ...slideUp,
          hidden: { opacity: 0, y: -20 },
          exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
        };
      case 'left':
        return {
          ...slideUp,
          hidden: { opacity: 0, x: -20, y: 0 },
          visible: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
          exit: { opacity: 0, x: -20, y: 0, transition: { duration: 0.2 } }
        };
      case 'right':
        return {
          ...slideUp,
          hidden: { opacity: 0, x: 20, y: 0 },
          visible: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
          exit: { opacity: 0, x: 20, y: 0, transition: { duration: 0.2 } }
        };
      default:
        return slideUp;
    }
  };

  const directionVariants = variants === slideUp ? getDirectionVariants() : variants;

  return (
    <motion.div
      className={className}
      variants={directionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
};

// 水墨动画组件接口
interface InkAnimationProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  className?: string;
}

/**
 * 水墨动画组件，用于为元素添加水墨扩散动画
 */
export const InkAnimation: React.FC<InkAnimationProps> = ({
  children,
  variants = inkSpread,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      className={`ink-animation ${className}`}
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

// 卷轴动画组件接口
interface ScrollAnimationProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  isOpen?: boolean;
}

/**
 * 卷轴动画组件，用于为元素添加卷轴展开/收起动画
 */
export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  variants = scrollUnroll,
  className = '',
  isOpen = true,
  ...props
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`scroll-animation ${className}`}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
