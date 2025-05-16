// src/context/AnimationPerformanceProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AnimationPerformanceConfig, 
  getAnimationPerformanceConfig,
  saveAnimationPerformanceConfig,
  detectDevicePerformance,
  detectReducedMotion,
  lowPerformanceConfig,
  mediumPerformanceConfig,
  highPerformanceConfig,
  accessibilityConfig
} from '@/utils/animationPerformance';

// 动画性能上下文接口
interface AnimationPerformanceContextType {
  // 动画性能配置
  config: AnimationPerformanceConfig;
  // 更新动画性能配置
  updateConfig: (newConfig: Partial<AnimationPerformanceConfig>) => void;
  // 重置动画性能配置
  resetConfig: () => void;
  // 设备性能级别
  devicePerformance: 'low' | 'medium' | 'high';
  // 是否为低性能模式
  isLowPerformanceMode: boolean;
  // 是否为减少动作模式
  isReducedMotionMode: boolean;
  // 当前帧率
  currentFps: number;
  // 是否启用动画
  isAnimationEnabled: boolean;
  // 切换动画启用状态
  toggleAnimations: () => void;
  // 切换复杂动画启用状态
  toggleComplexAnimations: () => void;
  // 切换背景动画启用状态
  toggleBackgroundAnimations: () => void;
  // 设置动画质量
  setAnimationQuality: (quality: 'low' | 'medium' | 'high') => void;
  // 设置最大粒子数量
  setMaxParticleCount: (count: number) => void;
  // 切换硬件加速
  toggleHardwareAcceleration: () => void;
  // 切换减少动作模式
  toggleReducedMotion: () => void;
  // 切换动画节流
  toggleAnimationThrottling: () => void;
  // 设置帧率限制
  setFrameRateLimit: (limit: number) => void;
  // 切换动画缓存
  toggleAnimationCaching: () => void;
}

// 创建动画性能上下文
const AnimationPerformanceContext = createContext<AnimationPerformanceContextType | undefined>(undefined);

// 动画性能提供者属性接口
interface AnimationPerformanceProviderProps {
  children: ReactNode;
}

/**
 * 动画性能提供者组件
 * 
 * 提供动画性能配置和相关功能
 */
export const AnimationPerformanceProvider: React.FC<AnimationPerformanceProviderProps> = ({ 
  children 
}) => {
  // 状态
  const [config, setConfig] = useState<AnimationPerformanceConfig>(getAnimationPerformanceConfig());
  const [devicePerformance, setDevicePerformance] = useState<'low' | 'medium' | 'high'>('medium');
  const [isReducedMotionMode, setIsReducedMotionMode] = useState<boolean>(false);
  const [currentFps, setCurrentFps] = useState<number>(60);
  const [frameTimestamps, setFrameTimestamps] = useState<number[]>([]);
  
  // 初始化
  useEffect(() => {
    // 检测设备性能
    const detectedPerformance = detectDevicePerformance();
    setDevicePerformance(detectedPerformance);
    
    // 检测是否启用减少动作模式
    const reducedMotion = detectReducedMotion();
    setIsReducedMotionMode(reducedMotion);
    
    // 如果启用减少动作模式，使用无障碍配置
    if (reducedMotion) {
      setConfig(accessibilityConfig);
      saveAnimationPerformanceConfig(accessibilityConfig);
    } else {
      // 根据设备性能设置配置
      switch (detectedPerformance) {
        case 'low':
          setConfig(lowPerformanceConfig);
          saveAnimationPerformanceConfig(lowPerformanceConfig);
          break;
        case 'medium':
          setConfig(mediumPerformanceConfig);
          saveAnimationPerformanceConfig(mediumPerformanceConfig);
          break;
        case 'high':
          setConfig(highPerformanceConfig);
          saveAnimationPerformanceConfig(highPerformanceConfig);
          break;
      }
    }
    
    // 监听减少动作模式变化
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotionMode(e.matches);
      if (e.matches) {
        setConfig(accessibilityConfig);
        saveAnimationPerformanceConfig(accessibilityConfig);
      }
    };
    
    mediaQuery.addEventListener('change', handleReducedMotionChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);
  
  // 监控帧率
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    
    const monitorFps = (time: number) => {
      if (lastTime === 0) {
        lastTime = time;
        animationFrameId = requestAnimationFrame(monitorFps);
        return;
      }
      
      // 计算帧率
      const elapsed = time - lastTime;
      const fps = Math.round(1000 / elapsed);
      
      // 更新帧率
      setCurrentFps(prevFps => {
        // 平滑帧率
        return Math.round((prevFps * 0.9) + (fps * 0.1));
      });
      
      // 更新时间戳
      setFrameTimestamps(prev => {
        const newTimestamps = [...prev, time];
        if (newTimestamps.length > 60) {
          return newTimestamps.slice(-60);
        }
        return newTimestamps;
      });
      
      lastTime = time;
      animationFrameId = requestAnimationFrame(monitorFps);
    };
    
    animationFrameId = requestAnimationFrame(monitorFps);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  // 更新配置
  const updateConfig = (newConfig: Partial<AnimationPerformanceConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    saveAnimationPerformanceConfig(updatedConfig);
  };
  
  // 重置配置
  const resetConfig = () => {
    // 根据设备性能重置配置
    switch (devicePerformance) {
      case 'low':
        setConfig(lowPerformanceConfig);
        saveAnimationPerformanceConfig(lowPerformanceConfig);
        break;
      case 'medium':
        setConfig(mediumPerformanceConfig);
        saveAnimationPerformanceConfig(mediumPerformanceConfig);
        break;
      case 'high':
        setConfig(highPerformanceConfig);
        saveAnimationPerformanceConfig(highPerformanceConfig);
        break;
    }
  };
  
  // 切换动画启用状态
  const toggleAnimations = () => {
    updateConfig({ enableAnimations: !config.enableAnimations });
  };
  
  // 切换复杂动画启用状态
  const toggleComplexAnimations = () => {
    updateConfig({ enableComplexAnimations: !config.enableComplexAnimations });
  };
  
  // 切换背景动画启用状态
  const toggleBackgroundAnimations = () => {
    updateConfig({ enableBackgroundAnimations: !config.enableBackgroundAnimations });
  };
  
  // 设置动画质量
  const setAnimationQuality = (quality: 'low' | 'medium' | 'high') => {
    updateConfig({ animationQuality: quality });
  };
  
  // 设置最大粒子数量
  const setMaxParticleCount = (count: number) => {
    updateConfig({ maxParticleCount: count });
  };
  
  // 切换硬件加速
  const toggleHardwareAcceleration = () => {
    updateConfig({ useHardwareAcceleration: !config.useHardwareAcceleration });
  };
  
  // 切换减少动作模式
  const toggleReducedMotion = () => {
    updateConfig({ useReducedMotion: !config.useReducedMotion });
  };
  
  // 切换动画节流
  const toggleAnimationThrottling = () => {
    updateConfig({ enableAnimationThrottling: !config.enableAnimationThrottling });
  };
  
  // 设置帧率限制
  const setFrameRateLimit = (limit: number) => {
    updateConfig({ frameRateLimit: limit });
  };
  
  // 切换动画缓存
  const toggleAnimationCaching = () => {
    updateConfig({ enableAnimationCaching: !config.enableAnimationCaching });
  };
  
  // 上下文值
  const contextValue: AnimationPerformanceContextType = {
    config,
    updateConfig,
    resetConfig,
    devicePerformance,
    isLowPerformanceMode: devicePerformance === 'low' || currentFps < 30,
    isReducedMotionMode,
    currentFps,
    isAnimationEnabled: config.enableAnimations,
    toggleAnimations,
    toggleComplexAnimations,
    toggleBackgroundAnimations,
    setAnimationQuality,
    setMaxParticleCount,
    toggleHardwareAcceleration,
    toggleReducedMotion,
    toggleAnimationThrottling,
    setFrameRateLimit,
    toggleAnimationCaching
  };
  
  return (
    <AnimationPerformanceContext.Provider value={contextValue}>
      {children}
    </AnimationPerformanceContext.Provider>
  );
};

/**
 * 使用动画性能上下文
 * @returns 动画性能上下文
 */
export const useAnimationPerformance = (): AnimationPerformanceContextType => {
  const context = useContext(AnimationPerformanceContext);
  
  if (!context) {
    throw new Error('useAnimationPerformance must be used within an AnimationPerformanceProvider');
  }
  
  return context;
};
