// src/components/animation/AnimatedButton.tsx
import * as React from 'react';
import { motion } from 'framer-motion';
// Import Button types from local file to avoid JSX parsing issues
import { ButtonColor, ButtonSize, ButtonShape, ButtonVariant } from './ButtonTypes';
// Import the actual Button component at runtime
const Button = React.lazy(() => import('../common/Button'));

// 动画按钮属性
interface AnimatedButtonProps {
  // Motion props
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  style?: React.CSSProperties;
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  whileHover?: any;
  whileTap?: any;
  className?: string;
  buttonClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  animationPreset?: 'scale' | 'glow' | 'pulse' | 'bounce' | 'shake' | 'none';
  initialAnimation?: boolean;
  disableAnimation?: boolean;
  disabled?: boolean;
}

/**
 * 增强的动画按钮组件，为Button组件添加动画效果
 *
 * @param color - 按钮颜色
 * @param size - 按钮大小
 * @param shape - 按钮形状
 * @param variant - 按钮变种
 * @param isLoading - 是否显示加载状态
 * @param loadingText - 加载状态文本
 * @param startIcon - 按钮左侧图标
 * @param endIcon - 按钮右侧图标
 * @param fullWidth - 是否占满容器宽度
 * @param children - 子元素
 * @param whileHover - 自定义悬停动画
 * @param whileTap - 自定义点击动画
 * @param className - 容器CSS类名
 * @param buttonClassName - 按钮CSS类名
 * @param onClick - 点击事件处理函数
 * @param animationPreset - 动画预设
 * @param initialAnimation - 是否显示初始动画
 * @param disableAnimation - 是否禁用动画
 * @param disabled - 是否禁用按钮
 */
const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  color = 'jade',
  size = 'medium',
  shape = 'rounded',
  variant = 'filled',
  isLoading = false,
  loadingText,
  startIcon,
  endIcon,
  fullWidth = false,
  children,
  whileHover,
  whileTap,
  className = '',
  buttonClassName = '',
  onClick,
  animationPreset = 'scale',
  initialAnimation = true,
  disableAnimation = false,
  disabled = false
}) => {
  // 根据预设和颜色设置不同的动画效果
  const getAnimationProps = () => {
    if (disableAnimation) {
      return {};
    }

    // 如果提供了自定义动画，使用自定义动画
    if (whileHover || whileTap) {
      return {
        whileHover,
        whileTap
      };
    }

    // 根据预设设置动画
    switch (animationPreset) {
      case 'scale':
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        };
      case 'glow':
        return {
          whileHover: {
            boxShadow: color === 'jade'
              ? '0 0 15px rgba(136, 176, 75, 0.7)'
              : color === 'gold'
                ? '0 0 15px rgba(212, 175, 55, 0.7)'
                : color === 'cinnabar'
                  ? '0 0 15px rgba(215, 62, 53, 0.7)'
                  : color === 'blue'
                    ? '0 0 15px rgba(26, 109, 176, 0.7)'
                    : color === 'purple'
                      ? '0 0 15px rgba(93, 57, 84, 0.7)'
                      : '0 0 15px rgba(248, 200, 220, 0.7)'
          },
          whileTap: { scale: 0.98 }
        };
      case 'pulse':
        return {
          whileHover: {
            scale: [1, 1.05, 1.03],
            transition: {
              duration: 0.8,
              repeat: Infinity,
              repeatType: 'reverse'
            }
          },
          whileTap: { scale: 0.95 }
        };
      case 'bounce':
        return {
          whileHover: {
            y: [0, -5, 0],
            transition: {
              duration: 0.6,
              repeat: Infinity
            }
          },
          whileTap: { y: 2 }
        };
      case 'shake':
        return {
          whileHover: {
            x: [0, -2, 2, -2, 0],
            transition: {
              duration: 0.4,
              repeat: Infinity
            }
          },
          whileTap: { scale: 0.95 }
        };
      case 'none':
        return {};
      default:
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        };
    }
  };

  const animationProps = getAnimationProps();

  return React.createElement(
    motion.div,
    {
      className: `animated-button-container ${className}`,
      style: {
        display: 'inline-block',
        position: 'relative',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      },
      initial: initialAnimation ? { opacity: 0, y: 10 } : undefined,
      animate: initialAnimation ? { opacity: 1, y: 0 } : undefined,
      exit: initialAnimation ? { opacity: 0, y: 10 } : undefined,
      whileHover: disabled ? undefined : animationProps.whileHover,
      whileTap: disabled ? undefined : animationProps.whileTap
    },
    React.createElement(
      React.Suspense,
      { fallback: React.createElement('div', { className: 'loading-button' }, 'Loading...') },
      React.createElement(
        Button,
        {
          color,
          size,
          shape,
          variant,
          isLoading,
          loadingText,
          startIcon,
          endIcon,
          fullWidth,
          onClick: disabled ? undefined : onClick,
          className: buttonClassName,
          style: { width: '100%', height: '100%' },
          disabled: disabled || isLoading
        },
        children
      )
    )
  );
};

export default AnimatedButton;
