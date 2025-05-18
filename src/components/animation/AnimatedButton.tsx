// src/components/animation/AnimatedButton.tsx
import * as React from 'react';
import { motion } from 'framer-motion';
// Import Button types from local file to avoid JSX parsing issues
import { ButtonColor, ButtonSize, ButtonShape, ButtonVariant } from './ButtonTypes';
import { ButtonAnimationType } from './EnhancedAnimatedButton';
// Import EnhancedAnimatedButton for internal use
import EnhancedAnimatedButton from './EnhancedAnimatedButton';

/**
 * @deprecated 此组件将在未来版本中被废弃，建议直接使用 EnhancedAnimatedButton 组件。
 * EnhancedAnimatedButton 提供了更丰富的动画效果、粒子效果和音效。
 *
 * 当前版本的 AnimatedButton 内部已经使用 EnhancedAnimatedButton 实现，
 * 以保持向后兼容性，同时提供更好的用户体验。
 */

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
  loadingText: _loadingText,
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
              repeat: Infinity as number
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

  // 将 animationPreset 映射到 EnhancedAnimatedButton 的 animationType
  const mapAnimationPresetToType = (): ButtonAnimationType => {
    switch (animationPreset) {
      case 'scale':
        return 'scale';
      case 'glow':
        return 'glow';
      case 'pulse':
        return 'pulse';
      case 'bounce':
        return 'bounce';
      case 'shake':
        return 'shake';
      case 'none':
        return 'scale'; // 默认使用 scale，但禁用动画
      default:
        return 'scale';
    }
  };

  // 使用 EnhancedAnimatedButton 实现
  return (
    <EnhancedAnimatedButton
      variant={variant}
      color={color}
      size={size}
      shape={shape}
      isLoading={isLoading}
      loadingText={_loadingText}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      className={className}
      buttonClassName={buttonClassName}
      onClick={onClick}
      animationType={mapAnimationPresetToType()}
      disabled={disabled}
      disableAnimation={disableAnimation || animationPreset === 'none'}
      disableParticles={true} // 默认禁用粒子效果，保持与原 AnimatedButton 一致
      disableSound={true} // 默认禁用音效，保持与原 AnimatedButton 一致
      whileHover={whileHover}
      whileTap={whileTap}
      initial={initialAnimation ? { opacity: 0, y: 10 } : undefined}
      animate={initialAnimation ? { opacity: 1, y: 0 } : undefined}
      exit={initialAnimation ? { opacity: 0, y: 10 } : undefined}
    >
      {children}
    </EnhancedAnimatedButton>
  );
};

export default AnimatedButton;
