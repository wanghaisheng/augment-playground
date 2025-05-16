// src/animations/pageTransitions.ts
import { Variants } from 'framer-motion';

/**
 * 基础页面过渡动画变体
 */
export const basicPageTransition: Variants = {
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
 * 水墨扩散页面过渡动画变体
 * 模拟水墨在纸上扩散的效果
 */
export const inkSpreadPageTransition: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.9,
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
    scale: 1.05,
    filter: 'blur(5px)',
    transition: { duration: 0.5 }
  }
};

/**
 * 卷轴展开页面过渡动画变体
 * 模拟中国传统卷轴展开的效果
 */
export const scrollUnrollPageTransition: Variants = {
  hidden: { 
    opacity: 0,
    height: 0,
    scaleY: 0,
    originY: 0
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
    scaleY: 0,
    originY: 1,
    transition: { duration: 0.5 }
  }
};

/**
 * 竹帘下降页面过渡动画变体
 * 模拟竹帘从上方下降的效果
 */
export const bambooBlindPageTransition: Variants = {
  hidden: { 
    opacity: 0,
    scaleY: 0,
    originY: 0
  },
  visible: { 
    opacity: 1,
    scaleY: 1,
    transition: { 
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1]
    }
  },
  exit: { 
    opacity: 0,
    scaleY: 0,
    originY: 0,
    transition: { duration: 0.4 }
  }
};

/**
 * 金光闪耀页面过渡动画变体
 * 模拟金光闪耀的效果
 */
export const goldenGlowPageTransition: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    filter: 'brightness(0.8) saturate(0.8)'
  },
  visible: { 
    opacity: 1,
    scale: 1,
    filter: 'brightness(1.2) saturate(1.2)',
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: { 
    opacity: 0,
    scale: 1.05,
    filter: 'brightness(1.5) saturate(1.5)',
    transition: { duration: 0.4 }
  }
};

/**
 * 飘落的竹叶页面过渡动画变体
 * 页面内容显示时伴随着飘落的竹叶效果
 */
export const fallingLeavesPageTransition: Variants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.4 }
  }
};

/**
 * 水波纹页面过渡动画变体
 * 模拟水波纹扩散的效果
 */
export const ripplePageTransition: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    borderRadius: '100%'
  },
  visible: { 
    opacity: 1,
    scale: 1,
    borderRadius: '0%',
    transition: { 
      duration: 0.7,
      ease: [0, 0.55, 0.45, 1]
    }
  },
  exit: { 
    opacity: 0,
    scale: 1.2,
    borderRadius: '100%',
    transition: { duration: 0.5 }
  }
};

/**
 * 云雾缭绕页面过渡动画变体
 * 模拟云雾缭绕的效果
 */
export const mistyPageTransition: Variants = {
  hidden: { 
    opacity: 0,
    filter: 'blur(15px)'
  },
  visible: { 
    opacity: 1,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: { 
    opacity: 0,
    filter: 'blur(15px)',
    transition: { duration: 0.5 }
  }
};

/**
 * 根据页面路径获取适合的页面过渡动画变体
 * @param pathname 页面路径
 * @returns 页面过渡动画变体
 */
export const getPageTransitionByPath = (pathname: string): Variants => {
  // 根据页面路径选择不同的过渡动画
  switch (pathname) {
    case '/':
      return inkSpreadPageTransition; // 首页使用水墨扩散效果
    case '/tasks':
      return scrollUnrollPageTransition; // 任务页面使用卷轴展开效果
    case '/abilities':
      return goldenGlowPageTransition; // 能力页面使用金光闪耀效果
    case '/challenges':
      return bambooBlindPageTransition; // 挑战页面使用竹帘下降效果
    case '/rewards':
      return fallingLeavesPageTransition; // 奖励页面使用飘落的竹叶效果
    case '/tearoom':
      return ripplePageTransition; // 茶室页面使用水波纹效果
    case '/store':
      return goldenGlowPageTransition; // 商店页面使用金光闪耀效果
    case '/vip-benefits':
      return goldenGlowPageTransition; // VIP福利页面使用金光闪耀效果
    case '/battle-pass':
      return scrollUnrollPageTransition; // 通行证页面使用卷轴展开效果
    case '/avatar-frames':
      return mistyPageTransition; // 头像框展示页面使用云雾缭绕效果
    case '/settings':
      return basicPageTransition; // 设置页面使用基础过渡效果
    default:
      return basicPageTransition; // 默认使用基础过渡效果
  }
};
