// src/animations/utils.ts
import { Variants } from 'framer-motion';

/**
 * 生成随机位置
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数
 */
export const randomPosition = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * 生成随机颜色
 * @param colors 颜色数组
 * @returns 随机颜色
 */
export const randomColor = (colors: string[]): string => {
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * 生成随机角度
 * @param min 最小角度
 * @param max 最大角度
 * @returns 随机角度
 */
export const randomAngle = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * 生成随机大小
 * @param min 最小大小
 * @param max 最大大小
 * @returns 随机大小
 */
export const randomSize = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * 生成随机延迟
 * @param min 最小延迟
 * @param max 最大延迟
 * @returns 随机延迟
 */
export const randomDelay = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * 生成随机持续时间
 * @param min 最小持续时间
 * @param max 最大持续时间
 * @returns 随机持续时间
 */
export const randomDuration = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * 生成粒子动画变体
 * @param index 粒子索引
 * @param type 粒子类型 ('confetti' | 'fireworks' | 'stars')
 * @returns 粒子动画变体
 */
export const generateParticleVariants = (
  index: number,
  type: 'confetti' | 'fireworks' | 'stars' = 'confetti'
): Variants => {
  // 根据粒子类型设置不同的动画参数
  // 声明变量在switch外部
  let angle: number;
  let distance: number;

  const getTypeParams = () => {
    switch (type) {
      case 'confetti':
        return {
          x: randomPosition(-100, 100),
          y: randomPosition(-100, 100),
          rotate: randomAngle(0, 360),
          scale: randomSize(0.5, 1.5),
          duration: randomDuration(1, 2)
        };
      case 'fireworks':
        // 计算随机角度和距离，模拟烟花爆炸效果
        angle = randomAngle(0, 360) * (Math.PI / 180);
        distance = randomPosition(50, 150);
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          scale: randomSize(0.3, 1),
          duration: randomDuration(0.8, 1.5)
        };
      case 'stars':
        return {
          x: randomPosition(-50, 50),
          y: randomPosition(-50, 50),
          scale: randomSize(0.5, 1.2),
          rotate: randomAngle(0, 180),
          duration: randomDuration(1.5, 2.5)
        };
    }
  };

  const params = getTypeParams();

  return {
    hidden: {
      opacity: 0,
      x: 0,
      y: 0,
      scale: 0
    },
    visible: {
      opacity: [0, 1, 0],
      x: params.x,
      y: params.y,
      scale: params.scale,
      rotate: params.rotate,
      transition: {
        duration: params.duration,
        delay: index * 0.02,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: { duration: 0.3 }
    }
  };
};

/**
 * 生成水墨滴落动画变体
 * @param index 水墨滴索引
 * @param direction 滴落方向 ('down' | 'up' | 'left' | 'right')
 * @returns 水墨滴动画变体
 */
export const generateInkDropVariants = (
  index: number,
  direction: 'down' | 'up' | 'left' | 'right' = 'down'
): Variants => {
  // 根据方向设置不同的动画参数
  const getDirectionParams = () => {
    const distance = randomPosition(20, 50);
    switch (direction) {
      case 'down':
        return { x: randomPosition(-10, 10), y: distance };
      case 'up':
        return { x: randomPosition(-10, 10), y: -distance };
      case 'left':
        return { x: -distance, y: randomPosition(-10, 10) };
      case 'right':
        return { x: distance, y: randomPosition(-10, 10) };
    }
  };

  const params = getDirectionParams();

  return {
    hidden: {
      opacity: 0,
      scale: 0,
      filter: 'blur(0px)'
    },
    visible: {
      opacity: [0, 0.7, 0],
      scale: [0, 1, 1.2],
      x: params.x,
      y: params.y,
      filter: ['blur(0px)', 'blur(2px)', 'blur(5px)'],
      transition: {
        duration: randomDuration(1.5, 2.5),
        delay: index * 0.1 + randomDelay(0, 0.5),
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: { duration: 0.3 }
    }
  };
};

/**
 * 生成闪烁动画变体
 * @param intensity 闪烁强度 ('low' | 'medium' | 'high')
 * @returns 闪烁动画变体
 */
export const generateGlowVariants = (
  intensity: 'low' | 'medium' | 'high' = 'medium'
): Variants => {
  // 根据强度设置不同的动画参数
  const getIntensityParams = () => {
    switch (intensity) {
      case 'low':
        return {
          brightness: [1, 1.1, 1],
          saturate: [1, 1.1, 1],
          duration: 2
        };
      case 'medium':
        return {
          brightness: [1, 1.2, 1],
          saturate: [1, 1.2, 1],
          duration: 1.5
        };
      case 'high':
        return {
          brightness: [1, 1.3, 1],
          saturate: [1, 1.3, 1],
          duration: 1
        };
    }
  };

  const params = getIntensityParams();

  return {
    hidden: {
      opacity: 0,
      filter: `brightness(${params.brightness[0]}) saturate(${params.saturate[0]})`
    },
    visible: {
      opacity: 1,
      filter: [
        `brightness(${params.brightness[0]}) saturate(${params.saturate[0]})`,
        `brightness(${params.brightness[1]}) saturate(${params.saturate[1]})`,
        `brightness(${params.brightness[0]}) saturate(${params.saturate[0]})`
      ],
      transition: {
        duration: params.duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };
};
