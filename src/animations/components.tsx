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
import OptimizedAnimatedItem from '@/components/animation/OptimizedAnimatedItem';

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
 *
 * @deprecated 此组件已废弃，请使用 OptimizedAnimatedContainer 组件代替。
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
  // 导入 OptimizedAnimatedContainer
  const OptimizedAnimatedContainer = React.lazy(() => import('@/components/animation/OptimizedAnimatedContainer'));

  return (
    <React.Suspense fallback={<div className="loading-container">Loading...</div>}>
      <OptimizedAnimatedContainer
        variants={variants}
        staggerChildren={staggerChildren}
        delayChildren={delayChildren}
        className={className}
        initial={initial}
        animate={animate}
        exit={exit}
        priority="medium" // 默认使用中等优先级
        disableOnLowPerformance={false} // 默认在低性能设备上不禁用动画
        {...props}
      >
        {children}
      </OptimizedAnimatedContainer>
    </React.Suspense>
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
 *
 * @deprecated 此组件已废弃，请使用 OptimizedAnimatedItem 组件代替。
 * 此组件将在下一个主要版本中移除。
 *
 * OptimizedAnimatedItem 提供了以下优势：
 * 1. 根据设备性能自动调整动画效果
 * 2. 支持低性能设备上禁用或简化动画
 * 3. 支持减少动作模式
 * 4. 使用硬件加速提高性能
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
  // 使用 OptimizedAnimatedItem 替代原始实现
  return (
    <OptimizedAnimatedItem
      className={className}
      variants={variants}
      index={index}
      initial={initial}
      animate={animate}
      exit={exit}
      priority="medium"
      {...props}
    >
      {children}
    </OptimizedAnimatedItem>
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
 *
 * @deprecated 此组件已废弃，请使用 EnhancedPageTransition 组件代替。
 */
export const PageTransitionWrapper: React.FC<PageTransitionProps> = ({
  children,
  variants,
  className = '',
  ...props
}) => {
  // 导入 EnhancedPageTransition
  const EnhancedPageTransition = React.lazy(() => import('@/components/animation/EnhancedPageTransition'));

  return (
    <React.Suspense fallback={<div className="loading-page-transition">Loading...</div>}>
      <EnhancedPageTransition
        type="basic" // 使用基础转场类型，保持与原 PageTransitionWrapper 一致
        className={className}
        showDecorations={false} // 默认不显示装饰元素，保持与原 PageTransitionWrapper 一致
        {...props}
      >
        {children}
      </EnhancedPageTransition>
    </React.Suspense>
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
  type?: 'spread' | 'stroke' | 'flow' | 'drop' | 'loading';
  color?: 'black' | 'jade' | 'blue' | 'red' | 'gold';
  count?: number;
  duration?: number;
  delay?: number;
  size?: number;
  opacity?: number;
  blur?: number;
  spread?: number;
  originX?: number;
  originY?: number;
  autoPlay?: boolean;
  loop?: boolean;
  onAnimationComplete?: () => void;
}

/**
 * 水墨动画组件，用于为元素添加水墨扩散动画
 *
 * @deprecated 此组件已废弃，请使用 OptimizedInkAnimation 组件代替。
 */
export const InkAnimation: React.FC<InkAnimationProps> = ({
  children,
  variants,
  className = '',
  type = 'spread',
  color = 'black',
  count = 5,
  duration = 1.5,
  delay = 0,
  size = 100,
  opacity = 0.8,
  blur = 5,
  spread = 360,
  originX = 0.5,
  originY = 0.5,
  autoPlay = true,
  loop = false,
  onAnimationComplete,
  ...props
}) => {
  // 导入 OptimizedInkAnimation
  const OptimizedInkAnimation = React.lazy(() => import('@/components/animation/OptimizedInkAnimation'));

  return (
    <React.Suspense fallback={<div className="loading-ink-animation">Loading...</div>}>
      <OptimizedInkAnimation
        type={type}
        color={color}
        count={count}
        duration={duration}
        delay={delay}
        size={size}
        opacity={opacity}
        blur={blur}
        spread={spread}
        originX={originX}
        originY={originY}
        autoPlay={autoPlay}
        loop={loop}
        className={className}
        onAnimationComplete={onAnimationComplete}
        priority="medium" // 默认使用中等优先级
        {...props}
      >
        {children}
      </OptimizedInkAnimation>
    </React.Suspense>
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
