// src/utils/inkAnimationUtils.ts
import React from 'react';
import { motion } from 'framer-motion';

/**
 * 水墨动画类型
 */
export type InkAnimationType =
  | 'spread'
  | 'stroke'
  | 'flow'
  | 'drop'
  | 'text'
  | 'border'
  | 'loading';

/**
 * 水墨颜色类型
 */
export type InkColorType =
  | 'black'
  | 'jade'
  | 'blue'
  | 'red'
  | 'gold';

/**
 * 水墨动画配置
 */
export interface InkAnimationConfig {
  type: InkAnimationType;
  count?: number;
  color?: InkColorType;
  duration?: number;
  delay?: number;
  size?: number | [number, number]; // 固定大小或[最小值, 最大值]
  opacity?: number | [number, number]; // 固定不透明度或[最小值, 最大值]
  blur?: number | [number, number]; // 固定模糊量或[最小值, 最大值]
  spread?: number; // 扩散角度范围（0-360）
  originX?: number; // 起始点X坐标（0-1）
  originY?: number; // 起始点Y坐标（0-1）
}

/**
 * 默认水墨动画配置
 */
const defaultConfig: InkAnimationConfig = {
  type: 'spread',
  count: 3,
  color: 'black',
  duration: 2,
  delay: 0,
  size: [20, 50],
  opacity: [0.3, 0.8],
  blur: [2, 5],
  spread: 360,
  originX: 0.5,
  originY: 0.5
};

/**
 * 生成随机数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数
 */
const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * 生成水墨扩散效果
 * @param config 水墨动画配置
 * @returns 水墨元素数组
 */
export const generateInkSpreadElements = (config: Partial<InkAnimationConfig> = {}): React.ReactNode[] => {
  // 合并配置
  const mergedConfig = { ...defaultConfig, ...config, type: 'spread' };
  const elements: React.ReactNode[] = [];

  // 元素数量
  const { count, color } = mergedConfig;

  // 元素大小范围
  const minSize = Array.isArray(mergedConfig.size) ? mergedConfig.size[0] : (mergedConfig.size || 20);
  const maxSize = Array.isArray(mergedConfig.size) ? mergedConfig.size[1] : (mergedConfig.size || 50);

  // 元素不透明度范围
  const minOpacity = Array.isArray(mergedConfig.opacity) ? mergedConfig.opacity[0] : (mergedConfig.opacity || 0.3);
  const maxOpacity = Array.isArray(mergedConfig.opacity) ? mergedConfig.opacity[1] : (mergedConfig.opacity || 0.8);

  // 元素模糊量范围
  const minBlur = Array.isArray(mergedConfig.blur) ? mergedConfig.blur[0] : (mergedConfig.blur || 2);
  const maxBlur = Array.isArray(mergedConfig.blur) ? mergedConfig.blur[1] : (mergedConfig.blur || 5);

  // 生成元素
  for (let i = 0; i < count!; i++) {
    // 随机角度（弧度）
    const angle = (i / count!) * mergedConfig.spread! * (Math.PI / 180) + ((360 - mergedConfig.spread!) / 2) * (Math.PI / 180);

    // 随机大小
    const size = random(minSize, maxSize);

    // 随机不透明度
    const opacity = random(minOpacity, maxOpacity);

    // 随机模糊量
    const blur = random(minBlur, maxBlur);

    // 随机延迟
    const delay = mergedConfig.delay! + i * 0.2;

    // 随机持续时间
    const duration = mergedConfig.duration! + random(-0.5, 0.5);

    // 计算位置
    const distance = size / 2;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    // 创建元素
    elements.push(
      React.createElement(motion.div, {
        key: `ink-spread-${i}`,
        className: `ink-spread ink-${color}`,
        style: {
          top: `${mergedConfig.originY! * 100}%`,
          left: `${mergedConfig.originX! * 100}%`,
          width: size,
          height: size,
          backgroundColor: `var(--ink-color)`,
          filter: `blur(${blur}px)`,
          opacity: 0
        },
        initial: {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0
        },
        animate: {
          x,
          y,
          scale: [0, 1, 1.2],
          opacity: [0, opacity, 0]
        },
        transition: {
          duration,
          delay,
          ease: [0.17, 0.67, 0.83, 0.67]
        }
      })
    );
  }

  return elements;
};

/**
 * 生成水墨笔触效果
 * @param config 水墨动画配置
 * @returns 水墨元素数组
 */
export const generateInkStrokeElements = (config: Partial<InkAnimationConfig> = {}): React.ReactNode[] => {
  // 合并配置
  const mergedConfig = { ...defaultConfig, ...config, type: 'stroke' };
  const elements: React.ReactNode[] = [];

  // 元素数量
  const { count, color } = mergedConfig;

  // 元素大小范围
  const minSize = Array.isArray(mergedConfig.size) ? mergedConfig.size[0] : (mergedConfig.size || 20);
  const maxSize = Array.isArray(mergedConfig.size) ? mergedConfig.size[1] : (mergedConfig.size || 50);

  // 元素不透明度范围
  const minOpacity = Array.isArray(mergedConfig.opacity) ? mergedConfig.opacity[0] : (mergedConfig.opacity || 0.3);
  const maxOpacity = Array.isArray(mergedConfig.opacity) ? mergedConfig.opacity[1] : (mergedConfig.opacity || 0.8);

  // 元素模糊量范围
  const minBlur = Array.isArray(mergedConfig.blur) ? mergedConfig.blur[0] : (mergedConfig.blur || 2);
  const maxBlur = Array.isArray(mergedConfig.blur) ? mergedConfig.blur[1] : (mergedConfig.blur || 5);

  // 生成元素
  for (let i = 0; i < count!; i++) {
    // 随机角度（弧度）
    const angle = (i / count!) * mergedConfig.spread! * (Math.PI / 180) + ((360 - mergedConfig.spread!) / 2) * (Math.PI / 180);

    // 随机长度
    const length = random(minSize * 2, maxSize * 4);

    // 随机宽度
    const width = random(minSize / 4, maxSize / 2);

    // 随机不透明度
    const opacity = random(minOpacity, maxOpacity);

    // 随机模糊量
    const blur = random(minBlur, maxBlur);

    // 随机延迟
    const delay = mergedConfig.delay! + i * 0.1;

    // 随机持续时间
    const duration = mergedConfig.duration! + random(-0.3, 0.3);

    // 创建元素
    elements.push(
      React.createElement(motion.div, {
        key: `ink-stroke-${i}`,
        className: `ink-stroke ink-${color}`,
        style: {
          top: `${mergedConfig.originY! * 100}%`,
          left: `${mergedConfig.originX! * 100}%`,
          width: 0,
          height: width,
          backgroundColor: `var(--ink-color)`,
          filter: `blur(${blur}px)`,
          opacity: 0,
          transform: `rotate(${angle * (180 / Math.PI)}deg)`
        },
        initial: {
          width: 0,
          opacity: 0
        },
        animate: {
          width: length,
          opacity: [0, opacity, opacity, 0]
        },
        transition: {
          duration,
          delay,
          ease: 'easeOut',
          opacity: {
            times: [0, 0.2, 0.8, 1]
          }
        }
      })
    );
  }

  return elements;
};

/**
 * 生成水墨流动效果
 * @param config 水墨动画配置
 * @returns 水墨元素数组
 */
export const generateInkFlowElements = (config: Partial<InkAnimationConfig> = {}): React.ReactNode[] => {
  // 合并配置
  const mergedConfig = { ...defaultConfig, ...config, type: 'flow' };
  const elements: React.ReactNode[] = [];

  // 元素数量
  const { count, color } = mergedConfig;

  // 元素大小范围
  const minSize = Array.isArray(mergedConfig.size) ? mergedConfig.size[0] : (mergedConfig.size || 20);
  const maxSize = Array.isArray(mergedConfig.size) ? mergedConfig.size[1] : (mergedConfig.size || 50);

  // 元素不透明度范围
  const minOpacity = Array.isArray(mergedConfig.opacity) ? mergedConfig.opacity[0] : (mergedConfig.opacity || 0.3);
  const maxOpacity = Array.isArray(mergedConfig.opacity) ? mergedConfig.opacity[1] : (mergedConfig.opacity || 0.8);

  // 元素模糊量范围
  const minBlur = Array.isArray(mergedConfig.blur) ? mergedConfig.blur[0] : (mergedConfig.blur || 2);
  const maxBlur = Array.isArray(mergedConfig.blur) ? mergedConfig.blur[1] : (mergedConfig.blur || 5);

  // 生成元素
  for (let i = 0; i < count!; i++) {
    // 随机大小
    const size = random(minSize, maxSize);

    // 随机不透明度
    const opacity = random(minOpacity, maxOpacity);

    // 随机模糊量
    const blur = random(minBlur, maxBlur);

    // 随机延迟
    const delay = mergedConfig.delay! + i * 0.3;

    // 随机持续时间
    const duration = mergedConfig.duration! + random(-0.5, 1);

    // 随机方向
    const direction = Math.random() > 0.5 ? 1 : -1;

    // 随机位置
    const top = random(0, 100);
    const left = direction > 0 ? -size : 100;

    // 创建元素
    elements.push(
      React.createElement(motion.div, {
        key: `ink-flow-${i}`,
        className: `ink-flow ink-${color}`,
        style: {
          top: `${top}%`,
          left: `${left}%`,
          width: size,
          height: size * 0.6,
          backgroundColor: `var(--ink-color)`,
          filter: `blur(${blur}px)`,
          opacity: 0
        },
        initial: {
          opacity: 0,
          left: `${left}%`,
          borderRadius: '40% 60% 60% 40% / 70% 30% 70% 30%'
        },
        animate: {
          opacity: [0, opacity, 0],
          left: direction > 0 ? '120%' : `-${size}px`,
          borderRadius: [
            '40% 60% 60% 40% / 70% 30% 70% 30%',
            '40% 60% 30% 70% / 30% 30% 70% 70%',
            '60% 40% 30% 70% / 60% 30% 70% 40%'
          ]
        },
        transition: {
          duration,
          delay,
          ease: 'easeInOut',
          borderRadius: {
            repeat: Infinity,
            repeatType: 'mirror',
            duration: duration / 3
          }
        }
      })
    );
  }

  return elements;
};

/**
 * 生成水墨滴落效果
 * @param config 水墨动画配置
 * @returns 水墨元素数组
 */
export const generateInkDropElements = (config: Partial<InkAnimationConfig> = {}): React.ReactNode[] => {
  // 合并配置
  const mergedConfig = { ...defaultConfig, ...config, type: 'drop' };
  const elements: React.ReactNode[] = [];

  // 元素数量
  const { count, color } = mergedConfig;

  // 元素大小范围
  const minSize = Array.isArray(mergedConfig.size) ? mergedConfig.size[0] : (mergedConfig.size || 10);
  const maxSize = Array.isArray(mergedConfig.size) ? mergedConfig.size[1] : (mergedConfig.size || 30);

  // 元素不透明度范围
  const minOpacity = Array.isArray(mergedConfig.opacity) ? mergedConfig.opacity[0] : (mergedConfig.opacity || 0.5);
  const maxOpacity = Array.isArray(mergedConfig.opacity) ? mergedConfig.opacity[1] : (mergedConfig.opacity || 0.9);

  // 元素模糊量范围
  const minBlur = Array.isArray(mergedConfig.blur) ? mergedConfig.blur[0] : (mergedConfig.blur || 1);
  const maxBlur = Array.isArray(mergedConfig.blur) ? mergedConfig.blur[1] : (mergedConfig.blur || 3);

  // 生成元素
  for (let i = 0; i < count!; i++) {
    // 随机大小
    const size = random(minSize, maxSize);

    // 随机不透明度
    const opacity = random(minOpacity, maxOpacity);

    // 随机模糊量
    const blur = random(minBlur, maxBlur);

    // 随机延迟
    const delay = mergedConfig.delay! + i * 0.5;

    // 随机持续时间
    const duration = mergedConfig.duration! + random(-0.5, 0.5);

    // 随机位置
    const left = random(10, 90);

    // 创建元素
    elements.push(
      React.createElement(motion.div, {
        key: `ink-drop-${i}`,
        className: `ink-drop ink-${color}`,
        style: {
          top: `-${size}px`,
          left: `${left}%`,
          width: size,
          height: size * 1.2,
          backgroundColor: `var(--ink-color)`,
          filter: `blur(${blur}px)`,
          opacity: 0
        },
        initial: {
          y: -size,
          opacity: 0,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
        },
        animate: {
          y: ['0%', '100%'],
          opacity: [0, opacity, 0],
          borderRadius: [
            '50% 50% 50% 50% / 60% 60% 40% 40%',
            '40% 40% 60% 60% / 40% 40% 60% 60%',
            '30% 30% 70% 70% / 30% 30% 70% 70%'
          ]
        },
        transition: {
          y: {
            duration,
            ease: 'easeIn'
          },
          opacity: {
            duration,
            times: [0, 0.2, 1]
          },
          borderRadius: {
            duration: duration / 2,
            times: [0, 0.5, 1]
          },
          delay
        }
      })
    );
  }

  return elements;
};

/**
 * 生成水墨加载效果
 * @param config 水墨动画配置
 * @returns 水墨元素数组
 */
export const generateInkLoadingElements = (config: Partial<InkAnimationConfig> = {}): React.ReactNode[] => {
  // 合并配置
  const mergedConfig = { ...defaultConfig, ...config, type: 'loading', count: 3 };
  const elements: React.ReactNode[] = [];

  // 元素数量
  const { count, color } = mergedConfig;

  // 元素大小
  const size = Array.isArray(mergedConfig.size) ? mergedConfig.size[0] : (mergedConfig.size || 10);

  // 元素不透明度
  const opacity = Array.isArray(mergedConfig.opacity) ? mergedConfig.opacity[0] : (mergedConfig.opacity || 0.8);

  // 元素模糊量
  const blur = Array.isArray(mergedConfig.blur) ? mergedConfig.blur[0] : (mergedConfig.blur || 2);

  // 生成元素
  for (let i = 0; i < count!; i++) {
    // 计算位置
    const angle = (i / count!) * 2 * Math.PI;
    const x = Math.cos(angle) * 20;
    const y = Math.sin(angle) * 20;

    // 创建元素
    elements.push(
      React.createElement(motion.div, {
        key: `ink-loading-drop-${i}`,
        className: `ink-loading-drop ink-${color}`,
        style: {
          top: '50%',
          left: '50%',
          width: size,
          height: size,
          backgroundColor: `var(--ink-color)`,
          filter: `blur(${blur}px)`,
          opacity: opacity,
          x,
          y
        },
        animate: {
          scale: [1, 1.5, 1],
          opacity: [opacity, opacity * 0.5, opacity]
        },
        transition: {
          duration: 1.5,
          delay: i * 0.5,
          repeat: Infinity,
          repeatType: 'loop'
        }
      })
    );
  }

  return elements;
};
