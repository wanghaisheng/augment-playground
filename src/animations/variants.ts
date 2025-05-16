// src/animations/variants.ts
import { Variants } from 'framer-motion';

/**
 * 淡入动画变体
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

/**
 * 淡入缩放动画变体
 */
export const fadeInScale: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.9
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3 }
  }
};

/**
 * 从下方滑入动画变体
 */
export const slideUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 24 
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

/**
 * 从上方滑入动画变体
 */
export const slideDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 24 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

/**
 * 从左侧滑入动画变体
 */
export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -50 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 24 
    }
  },
  exit: { 
    opacity: 0, 
    x: -50,
    transition: { duration: 0.2 }
  }
};

/**
 * 从右侧滑入动画变体
 */
export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 50 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 24 
    }
  },
  exit: { 
    opacity: 0, 
    x: 50,
    transition: { duration: 0.2 }
  }
};

/**
 * 弹跳动画变体
 */
export const bounce: Variants = {
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
      stiffness: 400,
      damping: 10
    }
  },
  exit: { 
    opacity: 0,
    y: 50,
    scale: 0.9,
    transition: { duration: 0.3 }
  }
};

/**
 * 旋转动画变体
 */
export const rotate: Variants = {
  hidden: { 
    opacity: 0,
    rotate: -90
  },
  visible: { 
    opacity: 1,
    rotate: 0,
    transition: { 
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0,
    rotate: 90,
    transition: { duration: 0.3 }
  }
};

/**
 * 脉冲动画变体
 */
export const pulse: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8
  },
  visible: { 
    opacity: 1,
    scale: [0.8, 1.1, 1],
    transition: { 
      duration: 0.6,
      times: [0, 0.7, 1]
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3 }
  }
};

/**
 * 金光闪烁动画变体
 */
export const goldenGlow: Variants = {
  hidden: { 
    opacity: 0, 
    filter: 'brightness(0.8) saturate(0.8)'
  },
  visible: { 
    opacity: 1, 
    filter: 'brightness(1.2) saturate(1.2)',
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: { 
    opacity: 0, 
    filter: 'brightness(1.5) saturate(1.5)',
    transition: { duration: 0.3 }
  }
};

/**
 * 列表项动画变体（用于列表中的项目，带有交错效果）
 */
export const listItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.1,
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
};

/**
 * 页面过渡动画变体
 */
export const pageTransition: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

/**
 * 水墨扩散动画变体
 */
export const inkSpread: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.5,
    filter: 'blur(10px)'
  },
  visible: { 
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.8,
      ease: [0.17, 0.67, 0.83, 0.67] // 模拟水墨扩散效果
    }
  },
  exit: { 
    opacity: 0,
    scale: 1.2,
    filter: 'blur(5px)',
    transition: { duration: 0.5 }
  }
};

/**
 * 卷轴展开动画变体
 */
export const scrollUnroll: Variants = {
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
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1] // 缓动函数模拟卷轴展开
    }
  },
  exit: { 
    opacity: 0,
    height: 0,
    scaleY: 0,
    transition: { duration: 0.5 }
  }
};
