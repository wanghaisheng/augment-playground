// src/components/animation/OptimizedInkAnimation.tsx
import React, { ReactNode, useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  InkAnimationType,
  InkColorType,
  generateInkSpreadElements,
  generateInkStrokeElements,
  generateInkFlowElements,
  generateInkDropElements,
  generateInkLoadingElements
} from '@/utils/inkAnimationUtils';
import { useAnimationPerformance } from '@/context/AnimationPerformanceProvider';

interface OptimizedInkAnimationProps {
  children?: ReactNode;
  type?: InkAnimationType;
  color?: InkColorType;
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
  className?: string;
  style?: React.CSSProperties;
  onAnimationComplete?: () => void;
  priority?: 'low' | 'medium' | 'high';
}

/**
 * 优化的水墨动画组件，根据设备性能自动调整动画效果
 */
const OptimizedInkAnimation: React.FC<OptimizedInkAnimationProps> = ({
  children,
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
  className = '',
  style,
  onAnimationComplete,
  priority = 'medium',
  ...props
}) => {
  // 获取动画性能配置
  const {
    config,
    isLowPerformanceMode,
    isReducedMotionMode,
    isAnimationEnabled
  } = useAnimationPerformance();

  // 从配置中获取是否启用复杂动画
  const isComplexAnimationsEnabled = config.enableComplexAnimations;

  // 状态
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [inkElements, setInkElements] = useState<ReactNode[]>([]);

  // 根据性能配置调整动画参数
  const adjustedConfig = useMemo(() => {
    // 如果禁用动画或复杂动画，返回空配置
    if (!isAnimationEnabled || !isComplexAnimationsEnabled) {
      return {
        type,
        color,
        count: 0,
        duration,
        delay,
        size,
        opacity,
        blur,
        spread,
        originX,
        originY
      };
    }

    // 如果启用减少动作模式，使用简化的配置
    if (isReducedMotionMode) {
      return {
        type,
        color,
        count: 1,
        duration: 0.5,
        delay: 0,
        size: size * 0.5,
        opacity: opacity * 0.5,
        blur: blur * 0.5,
        spread: 0,
        originX,
        originY
      };
    }

    // 根据设备性能调整配置
    if (isLowPerformanceMode) {
      // 低性能设备上只显示高优先级动画
      if (priority !== 'high') {
        return {
          type,
          color,
          count: 0,
          duration,
          delay,
          size,
          opacity,
          blur,
          spread,
          originX,
          originY
        };
      }

      return {
        type,
        color,
        count: Math.min(2, count),
        duration: duration * 0.8,
        delay: 0,
        size: size * 0.8,
        opacity: opacity * 0.8,
        blur: blur * 0.5,
        spread: spread * 0.5,
        originX,
        originY
      };
    }

    // 根据动画质量调整配置
    switch (config.animationQuality) {
      case 'low':
        return {
          type,
          color,
          count: Math.min(3, count),
          duration: duration * 0.8,
          delay: delay * 0.5,
          size: size * 0.8,
          opacity: opacity * 0.8,
          blur: blur * 0.5,
          spread: spread * 0.8,
          originX,
          originY
        };
      case 'medium':
        return {
          type,
          color,
          count: Math.min(count, config.maxParticleCount / 2),
          duration: duration * 0.9,
          delay: delay * 0.8,
          size: size * 0.9,
          opacity: opacity * 0.9,
          blur: blur * 0.8,
          spread: spread * 0.9,
          originX,
          originY
        };
      case 'high':
      default:
        return {
          type,
          color,
          count: Math.min(count, config.maxParticleCount),
          duration,
          delay,
          size,
          opacity,
          blur,
          spread,
          originX,
          originY
        };
    }
  }, [
    type, color, count, duration, delay, size, opacity, blur, spread, originX, originY,
    isAnimationEnabled, isComplexAnimationsEnabled, isLowPerformanceMode, isReducedMotionMode,
    config.animationQuality, config.maxParticleCount, priority
  ]);

  // 生成水墨元素
  const generateInkElements = () => {
    switch (adjustedConfig.type) {
      case 'spread':
        return generateInkSpreadElements(adjustedConfig);
      case 'stroke':
        return generateInkStrokeElements(adjustedConfig);
      case 'flow':
        return generateInkFlowElements(adjustedConfig);
      case 'drop':
        return generateInkDropElements(adjustedConfig);
      case 'loading':
        return generateInkLoadingElements(adjustedConfig);
      default:
        return generateInkSpreadElements(adjustedConfig);
    }
  };

  // 播放动画
  const playAnimation = () => {
    if (!isPlaying && isAnimationEnabled && isComplexAnimationsEnabled) {
      setIsPlaying(true);
    }
  };

  // 停止动画 - 保留但未使用，可能在未来版本中使用
  const stopAnimation = () => {
    setIsPlaying(false);
  };

  // Prevent unused variable warning
  void stopAnimation;

  // 处理动画完成
  const handleAnimationComplete = () => {
    if (loop && isAnimationEnabled && isComplexAnimationsEnabled) {
      // 如果是循环模式，重新播放动画
      setInkElements(generateInkElements());
    } else {
      // 否则停止播放
      setIsPlaying(false);
    }

    // 调用回调
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  // 初始化和更新水墨元素
  useEffect(() => {
    if (isPlaying && isAnimationEnabled && isComplexAnimationsEnabled) {
      setInkElements(generateInkElements());
    }
  }, [isPlaying, adjustedConfig, isAnimationEnabled, isComplexAnimationsEnabled, generateInkElements]);

  // 如果禁用动画或复杂动画，直接渲染子元素
  if (!isAnimationEnabled || !isComplexAnimationsEnabled ||
      (isLowPerformanceMode && priority !== 'high')) {
    return (
      <div
        className={`ink-animation-container ink-${color} ${className}`}
        style={{
          position: 'relative',
          ...(style || {})
        }}
        {...props}
      >
        {children && (
          <div
            className="ink-animation-content"
            style={{
              position: 'relative',
              zIndex: 2
            }}
          >
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`ink-animation-container ink-${color} ${className}`}
      style={{
        position: 'relative',
        ...(style || {})
      }}
      onClick={playAnimation}
      {...props}
    >
      {/* 水墨元素 */}
      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {isPlaying && inkElements}
      </AnimatePresence>

      {/* 子元素 */}
      {children && (
        <div
          className="ink-animation-content"
          style={{
            position: 'relative',
            zIndex: 2
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default OptimizedInkAnimation;
