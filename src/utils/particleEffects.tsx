// src/utils/particleEffects.tsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * 粒子类型
 */
export type ParticleType = 'circle' | 'square' | 'triangle' | 'star' | 'ink' | 'bamboo' | 'leaf' | 'sparkle' | 'glow';

/**
 * 粒子效果类型
 */
export type ParticleEffectType = 'burst' | 'radial' | 'fountain' | 'explosion' | 'sparkle' | 'ink' | 'evolution';

/**
 * 进化动画阶段
 */
export type EvolutionStage = 'preparation' | 'transformation' | 'completion';

/**
 * 粒子效果配置
 */
export interface ParticleEffectConfig {
  count: number;
  colors: string[];
  size?: number | [number, number]; // 固定大小或[最小值, 最大值]
  duration?: number | [number, number]; // 固定持续时间或[最小值, 最大值]
  distance?: number | [number, number]; // 固定距离或[最小值, 最大值]
  spread?: number; // 扩散角度范围（0-360）
  gravity?: number; // 重力效果（0表示无重力）
  fadeOut?: boolean; // 是否淡出
  particleType?: ParticleType | ParticleType[]; // 粒子类型或类型数组
  originX?: number; // 起始点X坐标（0-1）
  originY?: number; // 起始点Y坐标（0-1）
  container?: DOMRect; // 容器尺寸
  stage?: EvolutionStage; // 进化阶段
}

/**
 * 默认粒子效果配置
 */
const defaultConfig: ParticleEffectConfig = {
  count: 20,
  colors: ['#FFD700', '#FF6347', '#7CFC00', '#00BFFF', '#FF69B4', '#9370DB'],
  size: [5, 10],
  duration: [0.5, 1.5],
  distance: [50, 100],
  spread: 360,
  gravity: 0.5,
  fadeOut: true,
  particleType: 'circle',
  originX: 0.5,
  originY: 0.5
};

/**
 * 根据按钮变体获取粒子颜色
 * @param variant 按钮变体
 * @returns 粒子颜色数组
 */
export const getParticleColorsByVariant = (variant: 'primary' | 'secondary' | 'jade' | 'gold'): string[] => {
  switch (variant) {
    case 'jade':
      return ['#88B04B', '#A9D18E', '#C5E0B4', '#E2EFDA', '#FFFFFF'];
    case 'gold':
      return ['#FFD700', '#FFC107', '#FFEB3B', '#FFF59D', '#FFFDE7'];
    case 'primary':
      return ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];
    case 'secondary':
      return ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6'];
    default:
      return ['#FFD700', '#FF6347', '#7CFC00', '#00BFFF', '#FF69B4', '#9370DB'];
  }
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
 * 生成随机颜色
 * @param colors 颜色数组
 * @returns 随机颜色
 */
const randomColor = (colors: string[]): string => {
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * 生成粒子元素
 * @param type 粒子类型
 * @param color 粒子颜色
 * @param size 粒子大小
 * @returns 粒子元素
 */
const getParticleElement = (type: ParticleType, color: string, size: number): React.ReactNode => {
  switch (type) {
    case 'circle':
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color
          }}
        />
      );
    case 'square':
      return (
        <div
          style={{
            width: size,
            height: size,
            backgroundColor: color
          }}
        />
      );
    case 'triangle':
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`
          }}
        />
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    case 'ink':
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            filter: 'blur(2px)'
          }}
        />
      );
    case 'bamboo':
      return (
        <svg width={size} height={size * 1.5} viewBox="0 0 24 36" fill={color}>
          <rect x="8" y="0" width="8" height="36" rx="4" />
        </svg>
      );
    case 'leaf':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      );
    case 'sparkle':
      return (
        <div
          style={{
            position: 'relative',
            width: size,
            height: size
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: size,
              height: size / 5,
              backgroundColor: color,
              transform: 'translate(-50%, -50%) rotate(0deg)',
              borderRadius: size / 10
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: size,
              height: size / 5,
              backgroundColor: color,
              transform: 'translate(-50%, -50%) rotate(45deg)',
              borderRadius: size / 10
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: size,
              height: size / 5,
              backgroundColor: color,
              transform: 'translate(-50%, -50%) rotate(90deg)',
              borderRadius: size / 10
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: size,
              height: size / 5,
              backgroundColor: color,
              transform: 'translate(-50%, -50%) rotate(135deg)',
              borderRadius: size / 10
            }}
          />
        </div>
      );
    case 'glow':
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: `0 0 ${size / 2}px ${size / 4}px ${color}`,
            opacity: 0.7
          }}
        />
      );
    default:
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color
          }}
        />
      );
  }
};

/**
 * 生成爆发式粒子效果
 * @param config 粒子效果配置
 * @returns 粒子元素数组
 */
export const generateBurstParticles = (config: Partial<ParticleEffectConfig> = {}): React.ReactNode[] => {
  // 合并配置
  const mergedConfig = { ...defaultConfig, ...config };
  const particles: React.ReactNode[] = [];

  // 粒子数量
  const { count, colors } = mergedConfig;

  // 粒子大小范围
  const minSize = Array.isArray(mergedConfig.size) ? mergedConfig.size[0] : (mergedConfig.size || 5);
  const maxSize = Array.isArray(mergedConfig.size) ? mergedConfig.size[1] : (mergedConfig.size || 10);

  // 粒子持续时间范围
  const minDuration = Array.isArray(mergedConfig.duration) ? mergedConfig.duration[0] : (mergedConfig.duration || 0.5);
  const maxDuration = Array.isArray(mergedConfig.duration) ? mergedConfig.duration[1] : (mergedConfig.duration || 1.5);

  // 粒子距离范围
  const minDistance = Array.isArray(mergedConfig.distance) ? mergedConfig.distance[0] : (mergedConfig.distance || 50);
  const maxDistance = Array.isArray(mergedConfig.distance) ? mergedConfig.distance[1] : (mergedConfig.distance || 100);

  // 粒子类型
  const particleTypes = Array.isArray(mergedConfig.particleType)
    ? mergedConfig.particleType
    : [mergedConfig.particleType || 'circle'];

  // 生成粒子
  for (let i = 0; i < count; i++) {
    // 随机角度（弧度）
    const spreadValue = mergedConfig.spread ?? 360;
    const angle = (i / count) * spreadValue * (Math.PI / 180) + ((360 - spreadValue) / 2) * (Math.PI / 180);

    // 随机距离
    const distance = random(minDistance, maxDistance);

    // 随机大小
    const size = random(minSize, maxSize);

    // 随机持续时间
    const duration = random(minDuration, maxDuration);

    // 随机颜色
    const color = randomColor(colors);

    // 随机粒子类型
    const particleType = particleTypes[Math.floor(Math.random() * particleTypes.length)];

    // 计算终点位置
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    // 重力效果
    const gravity = mergedConfig.gravity || 0;

    // 获取原点坐标，默认为中心点
    const originX = mergedConfig.originX ?? 0.5;
    const originY = mergedConfig.originY ?? 0.5;

    // 创建粒子
    particles.push(
      <motion.div
        key={`particle-${i}`}
        style={{
          position: 'absolute',
          top: `${originY * 100}%`,
          left: `${originX * 100}%`,
          zIndex: 10,
          pointerEvents: 'none'
        }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
        animate={{
          x,
          y: gravity ? y + gravity * distance : y,
          opacity: mergedConfig.fadeOut ? [1, 1, 0] : 1,
          scale: [0, 1, gravity ? 0.5 : 1]
        }}
        transition={{
          duration,
          ease: 'easeOut'
        }}
      >
        {getParticleElement(particleType, color, size)}
      </motion.div>
    );
  }

  return particles;
};

/**
 * 生成喷泉式粒子效果
 * @param config 粒子效果配置
 * @returns 粒子元素数组
 */
export const generateFountainParticles = (config: Partial<ParticleEffectConfig> = {}): React.ReactNode[] => {
  // 合并配置
  const mergedConfig = {
    ...defaultConfig,
    spread: 180,
    gravity: 1,
    originY: 1,
    ...config
  };

  return generateBurstParticles(mergedConfig);
};

/**
 * 生成水墨扩散粒子效果
 * @param config 粒子效果配置
 * @returns 粒子元素数组
 */
export const generateInkParticles = (config: Partial<ParticleEffectConfig> = {}): React.ReactNode[] => {
  // 合并配置
  const mergedConfig = {
    ...defaultConfig,
    particleType: 'ink',
    fadeOut: true,
    ...config
  };

  return generateBurstParticles(mergedConfig);
};

/**
 * 生成闪光粒子效果
 * @param config 粒子效果配置
 * @returns 粒子元素数组
 */
export const generateSparkleParticles = (config: Partial<ParticleEffectConfig> = {}): React.ReactNode[] => {
  // 合并配置
  const mergedConfig = {
    ...defaultConfig,
    count: config.count || 15,
    colors: config.colors || ['#FFD700', '#FFEB3B', '#FFC107', '#FFFDE7'],
    particleType: 'sparkle',
    size: [8, 15],
    duration: [0.8, 1.5],
    distance: [20, 40],
    spread: 360,
    gravity: 0.2,
    fadeOut: true,
    ...config
  };

  return generateBurstParticles(mergedConfig);
};

/**
 * 生成进化动画粒子效果
 * @param config 粒子效果配置
 * @returns 粒子元素数组
 */
export const generateEvolutionParticles = (config: Partial<ParticleEffectConfig> = {}): React.ReactNode[] => {
  const { stage = 'preparation' /*, container */ } = config;
  const particles: React.ReactNode[] = [];

  // 根据进化阶段生成不同的粒子效果
  switch (stage) {
    case 'preparation':
      // 准备阶段：绿色能量粒子围绕熊猫
      return generatePreparationParticles(config);

    case 'transformation':
      // 变形阶段：金色闪光粒子和星星
      return generateTransformationParticles(config);

    case 'completion':
      // 完成阶段：庆祝粒子爆发
      return generateCompletionParticles(config);

    default:
      return particles;
  }
};

/**
 * 生成准备阶段粒子效果
 * @param config 粒子效果配置
 * @returns 粒子元素数组
 */
const generatePreparationParticles = (config: Partial<ParticleEffectConfig> = {}): React.ReactNode[] => {
  // 绿色能量粒子，缓慢上升
  const mergedConfig = {
    ...defaultConfig,
    count: config.count || 15,
    colors: config.colors || ['#8dc63f', '#a5d867', '#c1e698'],
    particleType: 'circle',
    size: [3, 8],
    duration: [1.5, 3],
    distance: [30, 60],
    spread: 360,
    gravity: -0.5, // 负重力，使粒子上升
    fadeOut: true,
    originX: 0.5,
    originY: 0.7,
    ...config
  };

  const particles = generateBurstParticles(mergedConfig);

  // 添加一些叶子粒子
  const leafConfig = {
    ...mergedConfig,
    count: Math.floor(mergedConfig.count / 3),
    particleType: 'leaf',
    size: [8, 12],
    duration: [2, 4],
    distance: [40, 80]
  };

  particles.push(...generateBurstParticles(leafConfig));

  return particles;
};

/**
 * 生成变形阶段粒子效果
 * @param config 粒子效果配置
 * @returns 粒子元素数组
 */
const generateTransformationParticles = (config: Partial<ParticleEffectConfig> = {}): React.ReactNode[] => {
  // 金色闪光粒子，从中心向外爆发
  const mergedConfig = {
    ...defaultConfig,
    count: config.count || 30,
    colors: config.colors || ['#ffd700', '#ffeb3b', '#fff9c4'],
    particleType: ['star', 'sparkle', 'glow'],
    size: [5, 15],
    duration: [1, 2.5],
    distance: [50, 100],
    spread: 360,
    gravity: 0,
    fadeOut: true,
    originX: 0.5,
    originY: 0.5,
    ...config
  };

  const particles = generateBurstParticles(mergedConfig);

  // 添加一些环绕粒子
  if (config.container) {
    const { width, height } = config.container;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;

    // 创建环绕粒子
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      particles.push(
        <motion.div
          key={`orbit-particle-${i}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#ffd700',
            boxShadow: '0 0 10px 5px rgba(255, 215, 0, 0.7)',
            zIndex: 10,
            pointerEvents: 'none'
          }}
          initial={{ x, y, opacity: 0, scale: 0 }}
          animate={{
            x: [x, centerX + Math.cos(angle + Math.PI * 2) * radius],
            y: [y, centerY + Math.sin(angle + Math.PI * 2) * radius],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0]
          }}
          transition={{
            duration: 3,
            times: [0, 0.1, 0.9, 1],
            ease: 'easeInOut',
            repeat: 1,
            repeatType: 'reverse'
          }}
        />
      );
    }
  }

  return particles;
};

/**
 * 生成完成阶段粒子效果
 * @param config 粒子效果配置
 * @returns 粒子元素数组
 */
const generateCompletionParticles = (config: Partial<ParticleEffectConfig> = {}): React.ReactNode[] => {
  // 庆祝粒子爆发，多彩的粒子
  const mergedConfig = {
    ...defaultConfig,
    count: config.count || 20,
    colors: config.colors || ['#ff5722', '#ff9800', '#ffeb3b', '#8bc34a', '#03a9f4'],
    particleType: ['circle', 'star', 'sparkle'],
    size: [4, 10],
    duration: [1, 2],
    distance: [40, 80],
    spread: 360,
    gravity: 0.8,
    fadeOut: true,
    originX: 0.5,
    originY: 0.4,
    ...config
  };

  const particles = generateBurstParticles(mergedConfig);

  // 添加一些闪光效果
  if (config.container) {
    const { width, height } = config.container;

    for (let i = 0; i < 5; i++) {
      const size = random(20, 40);
      const x = random(width * 0.2, width * 0.8);
      const y = random(height * 0.2, height * 0.7);
      const delay = random(0, 1);

      particles.push(
        <motion.div
          key={`flash-${i}`}
          style={{
            position: 'absolute',
            top: y,
            left: x,
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 0 20px 10px rgba(255, 255, 255, 0.6)',
            zIndex: 5,
            pointerEvents: 'none'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 1,
            delay,
            ease: 'easeOut'
          }}
        />
      );
    }
  }

  return particles;
};