// src/animations/presets.ts
import { Variants } from 'framer-motion';

/**
 * 创建带有延迟的容器动画变体
 * @param staggerChildren 子元素之间的延迟时间
 * @param delayChildren 所有子元素的初始延迟
 */
export const createContainerVariants = (
  staggerChildren = 0.1, 
  delayChildren = 0
): Variants => ({
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren,
      delayChildren
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
});

/**
 * 创建带有自定义延迟的列表项动画变体
 * @param delay 延迟时间
 */
export const createListItemVariants = (delay = 0.1): Variants => ({
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * delay,
      type: 'spring', 
      stiffness: 300, 
      damping: 24 
    }
  }),
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.2 }
  }
});

/**
 * 创建带有自定义参数的弹跳动画变体
 * @param stiffness 弹簧刚度
 * @param damping 弹簧阻尼
 */
export const createBounceVariants = (
  stiffness = 400, 
  damping = 10
): Variants => ({
  hidden: { 
    opacity: 0,
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness,
      damping
    }
  },
  exit: { 
    opacity: 0,
    y: 50,
    scale: 0.9,
    transition: { duration: 0.3 }
  }
});

/**
 * 创建带有自定义参数的淡入动画变体
 * @param duration 动画持续时间
 * @param exitDuration 退出动画持续时间
 */
export const createFadeInVariants = (
  duration = 0.5, 
  exitDuration = 0.3
): Variants => ({
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration }
  },
  exit: { 
    opacity: 0,
    transition: { duration: exitDuration }
  }
});

/**
 * 创建带有自定义参数的滑入动画变体
 * @param direction 滑入方向 ('up' | 'down' | 'left' | 'right')
 * @param distance 滑入距离
 */
export const createSlideVariants = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance = 20
): Variants => {
  const getDirectionProps = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
    }
  };

  const directionProps = getDirectionProps();

  return {
    hidden: { 
      opacity: 0, 
      ...directionProps
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24 
      }
    },
    exit: { 
      opacity: 0, 
      ...directionProps,
      transition: { duration: 0.2 }
    }
  };
};

/**
 * 创建带有自定义参数的水墨扩散动画变体
 * @param duration 动画持续时间
 * @param blurAmount 模糊量
 */
export const createInkSpreadVariants = (
  duration = 0.8, 
  blurAmount = 10
): Variants => ({
  hidden: { 
    opacity: 0,
    scale: 0.5,
    filter: `blur(${blurAmount}px)`
  },
  visible: { 
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { 
      duration,
      ease: [0.17, 0.67, 0.83, 0.67] // 模拟水墨扩散效果
    }
  },
  exit: { 
    opacity: 0,
    scale: 1.2,
    filter: `blur(${blurAmount / 2}px)`,
    transition: { duration: duration / 1.6 }
  }
});

/**
 * 创建带有自定义参数的卷轴展开动画变体
 * @param duration 动画持续时间
 */
export const createScrollUnrollVariants = (duration = 0.8): Variants => ({
  hidden: { 
    opacity: 0,
    height: 0,
    scaleY: 0
  },
  visible: { 
    opacity: 1,
    height: 'auto',
    scaleY: 1,
    transition: { 
      duration,
      ease: [0.33, 1, 0.68, 1] // 缓动函数模拟卷轴展开
    }
  },
  exit: { 
    opacity: 0,
    height: 0,
    scaleY: 0,
    transition: { duration: duration / 1.6 }
  }
});

/**
 * 创建带有自定义参数的脉冲动画变体
 * @param duration 动画持续时间
 * @param scale 缩放比例数组 [初始, 最大, 最终]
 */
export const createPulseVariants = (
  duration = 0.6, 
  scale: [number, number, number] = [0.8, 1.1, 1]
): Variants => ({
  hidden: { 
    opacity: 0,
    scale: scale[0]
  },
  visible: { 
    opacity: 1,
    scale: scale,
    transition: { 
      duration,
      times: [0, 0.7, 1]
    }
  },
  exit: { 
    opacity: 0,
    scale: scale[0],
    transition: { duration: duration / 2 }
  }
});
