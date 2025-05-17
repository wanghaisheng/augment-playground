// src/components/animation/EnhancedInkAnimation.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import { AnimatePresence, HTMLMotionProps } from 'framer-motion';
import {
  InkAnimationType,
  InkColorType,
  generateInkSpreadElements,
  generateInkStrokeElements,
  generateInkFlowElements,
  generateInkDropElements,
  generateInkLoadingElements
} from '@/utils/inkAnimationUtils';

// 水墨动画组件属性
interface EnhancedInkAnimationProps extends HTMLMotionProps<'div'> {
  children?: ReactNode;
  type?: InkAnimationType;
  color?: InkColorType;
  count?: number;
  duration?: number;
  delay?: number;
  size?: number | [number, number];
  opacity?: number | [number, number];
  blur?: number | [number, number];
  spread?: number;
  originX?: number;
  originY?: number;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  onAnimationComplete?: () => void;
}

/**
 * 增强的水墨动画组件
 *
 * @param children - 子元素
 * @param type - 水墨动画类型
 * @param color - 水墨颜色
 * @param count - 水墨元素数量
 * @param duration - 动画持续时间
 * @param delay - 动画延迟时间
 * @param size - 水墨元素大小
 * @param opacity - 水墨元素不透明度
 * @param blur - 水墨元素模糊量
 * @param spread - 水墨元素扩散角度范围
 * @param originX - 水墨元素起始点X坐标
 * @param originY - 水墨元素起始点Y坐标
 * @param className - CSS类名
 * @param autoPlay - 是否自动播放
 * @param loop - 是否循环播放
 * @param onAnimationComplete - 动画完成回调
 */
const EnhancedInkAnimation: React.FC<EnhancedInkAnimationProps> = ({
  children,
  type = 'spread',
  color = 'black',
  count = 3,
  duration = 2,
  delay = 0,
  size = [20, 50],
  opacity = [0.3, 0.8],
  blur = [2, 5],
  spread = 360,
  originX = 0.5,
  originY = 0.5,
  className = '',
  autoPlay = true,
  loop = false,
  onAnimationComplete,
  ...props
}) => {
  // 状态
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [inkElements, setInkElements] = useState<ReactNode[]>([]);

  // 配置
  const config = {
    type,
    color,
    count,
    duration,
    delay,
    size,
    opacity,
    blur,
    spread,
    originX,
    originY
  };

  // 生成水墨元素
  const generateInkElements = () => {
    switch (type) {
      case 'spread':
        return generateInkSpreadElements(config);
      case 'stroke':
        return generateInkStrokeElements(config);
      case 'flow':
        return generateInkFlowElements(config);
      case 'drop':
        return generateInkDropElements(config);
      case 'loading':
        return generateInkLoadingElements(config);
      default:
        return generateInkSpreadElements(config);
    }
  };

  // 播放动画
  const playAnimation = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  // 停止动画 - 定义但暂未使用
  // 注释掉未使用的函数
  // const stopAnimation = () => {
  //   setIsPlaying(false);
  // };

  // 处理动画完成
  const handleAnimationComplete = () => {
    if (loop) {
      // 如果是循环播放，重新生成水墨元素
      setInkElements(generateInkElements());
    } else if (!type.includes('loading')) {
      // 如果不是加载动画，停止播放
      setIsPlaying(false);
    }

    // 调用回调
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  // 初始化
  useEffect(() => {
    if (isPlaying) {
      setInkElements(generateInkElements());
    }
  }, [isPlaying, type, color, count, duration, delay, size, opacity, blur, spread, originX, originY, generateInkElements]);

  // 监听循环播放
  useEffect(() => {
    if (loop && !isPlaying) {
      setIsPlaying(true);
    }
  }, [loop, isPlaying]);

  return (
    <div
      className={`ink-animation-container ink-${color} ${className}`}
      style={{
        position: 'relative' as const,
        ...((props.style as React.CSSProperties) || {})
      }}
      onClick={playAnimation}
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

export default EnhancedInkAnimation;
