// src/utils/animationPerformance.ts
import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * 动画性能配置
 */
export interface AnimationPerformanceConfig {
  // 是否启用动画
  enableAnimations: boolean;
  // 是否启用复杂动画（如粒子效果、水墨动画等）
  enableComplexAnimations: boolean;
  // 是否启用背景动画
  enableBackgroundAnimations: boolean;
  // 动画质量 (low, medium, high)
  animationQuality: 'low' | 'medium' | 'high';
  // 最大粒子数量
  maxParticleCount: number;
  // 是否使用硬件加速
  useHardwareAcceleration: boolean;
  // 是否使用减少动作模式（适用于可访问性）
  useReducedMotion: boolean;
  // 是否启用动画节流（在低性能设备上）
  enableAnimationThrottling: boolean;
  // 动画帧率限制
  frameRateLimit: number;
  // 是否启用动画缓存
  enableAnimationCaching: boolean;
}

/**
 * 默认动画性能配置
 */
export const defaultAnimationPerformanceConfig: AnimationPerformanceConfig = {
  enableAnimations: true,
  enableComplexAnimations: true,
  enableBackgroundAnimations: true,
  animationQuality: 'high',
  maxParticleCount: 100,
  useHardwareAcceleration: true,
  useReducedMotion: false,
  enableAnimationThrottling: false,
  frameRateLimit: 60,
  enableAnimationCaching: true
};

/**
 * 低性能设备的动画性能配置
 */
export const lowPerformanceConfig: AnimationPerformanceConfig = {
  enableAnimations: true,
  enableComplexAnimations: false,
  enableBackgroundAnimations: false,
  animationQuality: 'low',
  maxParticleCount: 20,
  useHardwareAcceleration: true,
  useReducedMotion: false,
  enableAnimationThrottling: true,
  frameRateLimit: 30,
  enableAnimationCaching: true
};

/**
 * 中性能设备的动画性能配置
 */
export const mediumPerformanceConfig: AnimationPerformanceConfig = {
  enableAnimations: true,
  enableComplexAnimations: true,
  enableBackgroundAnimations: true,
  animationQuality: 'medium',
  maxParticleCount: 50,
  useHardwareAcceleration: true,
  useReducedMotion: false,
  enableAnimationThrottling: false,
  frameRateLimit: 60,
  enableAnimationCaching: true
};

/**
 * 高性能设备的动画性能配置
 */
export const highPerformanceConfig: AnimationPerformanceConfig = {
  enableAnimations: true,
  enableComplexAnimations: true,
  enableBackgroundAnimations: true,
  animationQuality: 'high',
  maxParticleCount: 100,
  useHardwareAcceleration: true,
  useReducedMotion: false,
  enableAnimationThrottling: false,
  frameRateLimit: 60,
  enableAnimationCaching: true
};

/**
 * 无障碍模式的动画性能配置
 */
export const accessibilityConfig: AnimationPerformanceConfig = {
  enableAnimations: true,
  enableComplexAnimations: false,
  enableBackgroundAnimations: false,
  animationQuality: 'low',
  maxParticleCount: 0,
  useHardwareAcceleration: true,
  useReducedMotion: true,
  enableAnimationThrottling: false,
  frameRateLimit: 30,
  enableAnimationCaching: true
};

/**
 * 检测设备性能
 * @returns 设备性能级别 ('low', 'medium', 'high')
 */
export const detectDevicePerformance = (): 'low' | 'medium' | 'high' => {
  // 检查是否在服务器端渲染
  if (typeof window === 'undefined') {
    return 'medium';
  }

  // 检查是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // 检查设备内存（如果可用）
  const deviceMemory = (navigator as any).deviceMemory || 4;

  // 检查处理器核心数（如果可用）
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;

  // 检查是否为低端设备
  if (
    isMobile &&
    (deviceMemory < 4 || hardwareConcurrency < 4)
  ) {
    return 'low';
  }

  // 检查是否为高端设备
  if (
    !isMobile ||
    (deviceMemory >= 8 && hardwareConcurrency >= 8)
  ) {
    return 'high';
  }

  // 默认为中等性能
  return 'medium';
};

/**
 * 检测是否启用减少动作模式
 * @returns 是否启用减少动作模式
 */
export const detectReducedMotion = (): boolean => {
  // 检查是否在服务器端渲染
  if (typeof window === 'undefined') {
    return false;
  }

  // 检查是否启用减少动作模式
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * 获取动画性能配置
 * @returns 动画性能配置
 */
export const getAnimationPerformanceConfig = (): AnimationPerformanceConfig => {
  // 检查是否在服务器端渲染
  if (typeof window === 'undefined') {
    return defaultAnimationPerformanceConfig;
  }

  // 从本地存储中获取配置
  const storedConfig = localStorage.getItem('animationPerformanceConfig');
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig);
    } catch (error) {
      console.error('Failed to parse animation performance config:', error);
    }
  }

  // 检测设备性能
  const devicePerformance = detectDevicePerformance();
  
  // 检测是否启用减少动作模式
  const reducedMotion = detectReducedMotion();
  
  // 如果启用减少动作模式，使用无障碍配置
  if (reducedMotion) {
    return accessibilityConfig;
  }
  
  // 根据设备性能返回相应的配置
  switch (devicePerformance) {
    case 'low':
      return lowPerformanceConfig;
    case 'medium':
      return mediumPerformanceConfig;
    case 'high':
      return highPerformanceConfig;
    default:
      return defaultAnimationPerformanceConfig;
  }
};

/**
 * 保存动画性能配置
 * @param config 动画性能配置
 */
export const saveAnimationPerformanceConfig = (config: AnimationPerformanceConfig): void => {
  // 检查是否在服务器端渲染
  if (typeof window === 'undefined') {
    return;
  }

  // 保存到本地存储
  localStorage.setItem('animationPerformanceConfig', JSON.stringify(config));
};

/**
 * 重置动画性能配置
 */
export const resetAnimationPerformanceConfig = (): void => {
  // 检查是否在服务器端渲染
  if (typeof window === 'undefined') {
    return;
  }

  // 从本地存储中删除配置
  localStorage.removeItem('animationPerformanceConfig');
};

/**
 * 使用动画帧率限制
 * @param callback 回调函数
 * @param fps 帧率
 * @returns 带有帧率限制的回调函数
 */
export const useAnimationFrameThrottle = (
  callback: (time: number) => void,
  fps: number = 60
): ((time: number) => void) => {
  const fpsInterval = useRef(1000 / fps);
  const lastTime = useRef(0);

  return useCallback(
    (time: number) => {
      // 计算时间差
      const elapsed = time - lastTime.current;

      // 如果时间差大于帧率间隔，执行回调
      if (elapsed > fpsInterval.current) {
        lastTime.current = time - (elapsed % fpsInterval.current);
        callback(time);
      }
    },
    [callback, fpsInterval]
  );
};

/**
 * 使用动画性能监控
 * @returns 动画性能监控对象
 */
export const useAnimationPerformanceMonitor = () => {
  const [fps, setFps] = useState<number>(60);
  const [isLowPerformance, setIsLowPerformance] = useState<boolean>(false);
  const [config, setConfig] = useState<AnimationPerformanceConfig>(
    getAnimationPerformanceConfig()
  );
  
  const frameTimestamps = useRef<number[]>([]);
  const animationFrameId = useRef<number | null>(null);
  
  // 监控帧率
  useEffect(() => {
    const monitorFps = (time: number) => {
      // 添加当前时间戳
      frameTimestamps.current.push(time);
      
      // 只保留最近 60 帧的时间戳
      if (frameTimestamps.current.length > 60) {
        frameTimestamps.current.shift();
      }
      
      // 计算帧率
      if (frameTimestamps.current.length >= 2) {
        const elapsed = time - frameTimestamps.current[0];
        const calculatedFps = Math.round((frameTimestamps.current.length - 1) * 1000 / elapsed);
        setFps(calculatedFps);
        
        // 检查是否为低性能设备
        setIsLowPerformance(calculatedFps < 30);
        
        // 如果是低性能设备，自动调整配置
        if (calculatedFps < 30 && config.animationQuality !== 'low') {
          const newConfig = { ...config, animationQuality: 'low' as const };
          setConfig(newConfig);
          saveAnimationPerformanceConfig(newConfig);
        }
      }
      
      // 继续监控
      animationFrameId.current = requestAnimationFrame(monitorFps);
    };
    
    // 开始监控
    animationFrameId.current = requestAnimationFrame(monitorFps);
    
    // 清理
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [config]);
  
  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<AnimationPerformanceConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    saveAnimationPerformanceConfig(updatedConfig);
  }, [config]);
  
  return {
    fps,
    isLowPerformance,
    config,
    updateConfig
  };
};

/**
 * 使用动画性能配置
 * @returns 动画性能配置
 */
export const useAnimationPerformanceConfig = () => {
  const [config, setConfig] = useState<AnimationPerformanceConfig>(
    getAnimationPerformanceConfig()
  );
  
  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<AnimationPerformanceConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    saveAnimationPerformanceConfig(updatedConfig);
  }, [config]);
  
  return {
    config,
    updateConfig
  };
};
