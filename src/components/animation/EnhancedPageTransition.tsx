// src/components/animation/EnhancedPageTransition.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { motion, Variants, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  basicPageTransition,
  inkSpreadPageTransition,
  scrollUnrollPageTransition,
  bambooBlindPageTransition,
  goldenGlowPageTransition,
  fallingLeavesPageTransition,
  ripplePageTransition,
  mistyPageTransition,
  getPageTransitionByPath
} from '@/animations/pageTransitions';

// 页面转场类型
export type PageTransitionType = 
  | 'basic'
  | 'inkSpread'
  | 'scrollUnroll'
  | 'bambooBlind'
  | 'goldenGlow'
  | 'fallingLeaves'
  | 'ripple'
  | 'misty'
  | 'auto';

// 页面转场组件接口
interface EnhancedPageTransitionProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  type?: PageTransitionType;
  className?: string;
  showDecorations?: boolean;
  decorationColor?: string;
  decorationOpacity?: number;
}

/**
 * 增强的页面转场组件，支持多种中国风页面转场效果
 * 
 * @param children - 子元素
 * @param type - 页面转场类型
 * @param className - CSS类名
 * @param showDecorations - 是否显示装饰元素
 * @param decorationColor - 装饰元素颜色
 * @param decorationOpacity - 装饰元素透明度
 */
const EnhancedPageTransition: React.FC<EnhancedPageTransitionProps> = ({
  children,
  type = 'auto',
  className = '',
  showDecorations = true,
  decorationColor = '#88B04B', // 默认使用翡翠绿色
  decorationOpacity = 0.2,
  ...props
}) => {
  const location = useLocation();
  const [variants, setVariants] = useState<Variants>(basicPageTransition);
  const [decorations, setDecorations] = useState<ReactNode[]>([]);

  // 根据类型设置变体
  useEffect(() => {
    if (type === 'auto') {
      // 自动根据路径选择变体
      setVariants(getPageTransitionByPath(location.pathname));
    } else {
      // 根据指定类型选择变体
      switch (type) {
        case 'inkSpread':
          setVariants(inkSpreadPageTransition);
          break;
        case 'scrollUnroll':
          setVariants(scrollUnrollPageTransition);
          break;
        case 'bambooBlind':
          setVariants(bambooBlindPageTransition);
          break;
        case 'goldenGlow':
          setVariants(goldenGlowPageTransition);
          break;
        case 'fallingLeaves':
          setVariants(fallingLeavesPageTransition);
          break;
        case 'ripple':
          setVariants(ripplePageTransition);
          break;
        case 'misty':
          setVariants(mistyPageTransition);
          break;
        default:
          setVariants(basicPageTransition);
      }
    }
  }, [type, location.pathname]);

  // 生成装饰元素
  useEffect(() => {
    if (!showDecorations) {
      setDecorations([]);
      return;
    }

    const currentType = type === 'auto' 
      ? getTransitionTypeFromPath(location.pathname) 
      : type;

    // 根据转场类型生成不同的装饰元素
    switch (currentType) {
      case 'fallingLeaves':
        setDecorations(generateFallingLeaves(10, decorationColor, decorationOpacity));
        break;
      case 'inkSpread':
        setDecorations(generateInkDrops(5, decorationColor, decorationOpacity));
        break;
      case 'scrollUnroll':
        setDecorations(generateScrollDecorations(decorationColor, decorationOpacity));
        break;
      case 'bambooBlind':
        setDecorations(generateBambooDecorations(decorationColor, decorationOpacity));
        break;
      case 'goldenGlow':
        setDecorations(generateGoldenParticles(15, '#FFD700', 0.3));
        break;
      case 'ripple':
        setDecorations(generateRipples(3, decorationColor, decorationOpacity));
        break;
      case 'misty':
        setDecorations(generateMistClouds(3, decorationColor, decorationOpacity));
        break;
      default:
        setDecorations([]);
    }
  }, [type, location.pathname, showDecorations, decorationColor, decorationOpacity]);

  // 根据路径获取转场类型
  const getTransitionTypeFromPath = (pathname: string): PageTransitionType => {
    switch (pathname) {
      case '/':
        return 'inkSpread';
      case '/tasks':
        return 'scrollUnroll';
      case '/abilities':
        return 'goldenGlow';
      case '/challenges':
        return 'bambooBlind';
      case '/rewards':
        return 'fallingLeaves';
      case '/tearoom':
        return 'ripple';
      case '/store':
        return 'goldenGlow';
      case '/vip-benefits':
        return 'goldenGlow';
      case '/battle-pass':
        return 'scrollUnroll';
      case '/avatar-frames':
        return 'misty';
      case '/settings':
        return 'basic';
      default:
        return 'basic';
    }
  };

  return (
    <motion.div
      className={`enhanced-page-transition ${className}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    >
      {/* 装饰元素 */}
      {showDecorations && decorations.length > 0 && (
        <div className="page-transition-decorations">
          <AnimatePresence>
            {decorations}
          </AnimatePresence>
        </div>
      )}

      {/* 页面内容 */}
      {children}
    </motion.div>
  );
};

// 生成飘落的竹叶装饰
const generateFallingLeaves = (count: number, color: string, opacity: number): ReactNode[] => {
  const leaves = [];
  for (let i = 0; i < count; i++) {
    const delay = Math.random() * 2;
    const duration = 3 + Math.random() * 4;
    const size = 20 + Math.random() * 30;
    const left = Math.random() * 100;
    
    leaves.push(
      <motion.div
        key={`leaf-${i}`}
        className="falling-leaf"
        style={{
          position: 'absolute',
          top: -size,
          left: `${left}%`,
          width: size,
          height: size * 2,
          opacity: opacity,
          zIndex: -1
        }}
        initial={{ top: -size, rotate: 0 }}
        animate={{
          top: `calc(100% + ${size}px)`,
          rotate: 360,
          x: Math.sin(i) * 100
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <svg viewBox="0 0 24 24" fill={color}>
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </motion.div>
    );
  }
  return leaves;
};

// 生成水墨滴落装饰
const generateInkDrops = (count: number, color: string, opacity: number): ReactNode[] => {
  const drops = [];
  for (let i = 0; i < count; i++) {
    const delay = Math.random() * 1.5;
    const duration = 2 + Math.random() * 3;
    const size = 30 + Math.random() * 50;
    const left = 10 + Math.random() * 80;
    const top = 10 + Math.random() * 80;
    
    drops.push(
      <motion.div
        key={`ink-drop-${i}`}
        className="ink-drop"
        style={{
          position: 'absolute',
          top: `${top}%`,
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          opacity: 0,
          zIndex: -1
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, opacity, 0],
          scale: [0, 1, 1.5],
          filter: ['blur(0px)', 'blur(5px)', 'blur(10px)']
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          repeatDelay: 3 + Math.random() * 5,
          ease: 'easeOut'
        }}
      />
    );
  }
  return drops;
};

// 生成卷轴装饰
const generateScrollDecorations = (color: string, opacity: number): ReactNode[] => {
  return [
    <motion.div
      key="scroll-top"
      className="scroll-decoration-top"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 20,
        background: color,
        opacity: opacity,
        zIndex: -1
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />,
    <motion.div
      key="scroll-bottom"
      className="scroll-decoration-bottom"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 20,
        background: color,
        opacity: opacity,
        zIndex: -1
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
    />
  ];
};

// 生成竹帘装饰
const generateBambooDecorations = (color: string, opacity: number): ReactNode[] => {
  const bambooSlats = [];
  const slatsCount = 10;
  
  for (let i = 0; i < slatsCount; i++) {
    bambooSlats.push(
      <motion.div
        key={`bamboo-slat-${i}`}
        className="bamboo-slat"
        style={{
          position: 'absolute',
          top: 0,
          left: `${i * (100 / slatsCount)}%`,
          width: `${80 / slatsCount}%`,
          height: '100%',
          background: color,
          opacity: opacity,
          zIndex: -1,
          transformOrigin: 'top'
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
      />
    );
  }
  
  return bambooSlats;
};

// 生成金色粒子装饰
const generateGoldenParticles = (count: number, color: string, opacity: number): ReactNode[] => {
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    const delay = Math.random() * 2;
    const duration = 1.5 + Math.random() * 2;
    const size = 5 + Math.random() * 10;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    
    particles.push(
      <motion.div
        key={`particle-${i}`}
        className="golden-particle"
        style={{
          position: 'absolute',
          top: `${top}%`,
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          opacity: 0,
          zIndex: -1,
          boxShadow: `0 0 ${size}px ${color}`
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, opacity, 0],
          scale: [0, 1, 0]
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          repeatDelay: 1 + Math.random() * 3,
          ease: 'easeInOut'
        }}
      />
    );
  }
  
  return particles;
};

// 生成水波纹装饰
const generateRipples = (count: number, color: string, opacity: number): ReactNode[] => {
  const ripples = [];
  
  for (let i = 0; i < count; i++) {
    const delay = i * 1.5;
    const duration = 3 + Math.random();
    
    ripples.push(
      <motion.div
        key={`ripple-${i}`}
        className="ripple"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          border: `2px solid ${color}`,
          opacity: 0,
          zIndex: -1,
          transform: 'translate(-50%, -50%)'
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, opacity, 0],
          scale: [0, 3, 6]
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          repeatDelay: 1,
          ease: 'easeOut'
        }}
      />
    );
  }
  
  return ripples;
};

// 生成云雾装饰
const generateMistClouds = (count: number, color: string, opacity: number): ReactNode[] => {
  const clouds = [];
  
  for (let i = 0; i < count; i++) {
    const delay = i * 0.5;
    const duration = 10 + Math.random() * 5;
    const size = 100 + Math.random() * 150;
    const top = Math.random() * 100;
    
    clouds.push(
      <motion.div
        key={`cloud-${i}`}
        className="mist-cloud"
        style={{
          position: 'absolute',
          top: `${top}%`,
          left: '-20%',
          width: size,
          height: size / 2,
          borderRadius: '50%',
          background: color,
          opacity: 0,
          zIndex: -1,
          filter: 'blur(40px)'
        }}
        initial={{ opacity: 0, left: '-20%' }}
        animate={{
          opacity: [0, opacity, 0],
          left: ['-20%', '120%']
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'linear'
        }}
      />
    );
  }
  
  return clouds;
};

export default EnhancedPageTransition;
