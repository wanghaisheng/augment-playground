// src/context/SkeletonProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 骨架屏上下文接口
interface SkeletonContextType {
  // 是否启用骨架屏
  isEnabled: boolean;
  // 设置是否启用骨架屏
  setIsEnabled: (enabled: boolean) => void;
  // 是否显示骨架屏
  isVisible: boolean;
  // 设置是否显示骨架屏
  setIsVisible: (visible: boolean) => void;
  // 骨架屏持续时间（毫秒）
  duration: number;
  // 设置骨架屏持续时间
  setDuration: (duration: number) => void;
  // 骨架屏最小显示时间（毫秒）
  minDuration: number;
  // 设置骨架屏最小显示时间
  setMinDuration: (duration: number) => void;
  // 骨架屏变体样式
  variant: 'default' | 'jade' | 'gold';
  // 设置骨架屏变体样式
  setVariant: (variant: 'default' | 'jade' | 'gold') => void;
  // 显示骨架屏
  showSkeleton: (options?: ShowSkeletonOptions) => void;
  // 隐藏骨架屏
  hideSkeleton: () => void;
  // 是否正在加载
  isLoading: boolean;
  // 设置是否正在加载
  setIsLoading: (loading: boolean) => void;
}

// 显示骨架屏选项
interface ShowSkeletonOptions {
  duration?: number;
  variant?: 'default' | 'jade' | 'gold';
  minDuration?: number;
}

// 创建骨架屏上下文
const SkeletonContext = createContext<SkeletonContextType | undefined>(undefined);

// 骨架屏提供者属性接口
interface SkeletonProviderProps {
  children: ReactNode;
  defaultEnabled?: boolean;
  defaultDuration?: number;
  defaultMinDuration?: number;
  defaultVariant?: 'default' | 'jade' | 'gold';
}

/**
 * 骨架屏提供者组件
 * 
 * 提供骨架屏配置和相关功能
 */
export const SkeletonProvider: React.FC<SkeletonProviderProps> = ({ 
  children,
  defaultEnabled = true,
  defaultDuration = 1000,
  defaultMinDuration = 500,
  defaultVariant = 'jade'
}) => {
  // 状态
  const [isEnabled, setIsEnabled] = useState<boolean>(defaultEnabled);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(defaultDuration);
  const [minDuration, setMinDuration] = useState<number>(defaultMinDuration);
  const [variant, setVariant] = useState<'default' | 'jade' | 'gold'>(defaultVariant);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showStartTime, setShowStartTime] = useState<number | null>(null);
  const [hideTimeoutId, setHideTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // 显示骨架屏
  const showSkeleton = (options?: ShowSkeletonOptions) => {
    if (!isEnabled) return;
    
    // 清除之前的定时器
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      setHideTimeoutId(null);
    }
    
    // 设置显示开始时间
    setShowStartTime(Date.now());
    
    // 设置选项
    if (options?.duration) {
      setDuration(options.duration);
    }
    
    if (options?.minDuration) {
      setMinDuration(options.minDuration);
    }
    
    if (options?.variant) {
      setVariant(options.variant);
    }
    
    // 显示骨架屏
    setIsVisible(true);
    setIsLoading(true);
  };
  
  // 隐藏骨架屏
  const hideSkeleton = () => {
    if (!isVisible || !showStartTime) return;
    
    // 计算已显示时间
    const elapsedTime = Date.now() - showStartTime;
    
    // 如果已显示时间小于最小显示时间，延迟隐藏
    if (elapsedTime < minDuration) {
      const remainingTime = minDuration - elapsedTime;
      
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
        setIsLoading(false);
        setShowStartTime(null);
        setHideTimeoutId(null);
      }, remainingTime);
      
      setHideTimeoutId(timeoutId);
    } else {
      // 否则立即隐藏
      setIsVisible(false);
      setIsLoading(false);
      setShowStartTime(null);
    }
  };
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
      }
    };
  }, [hideTimeoutId]);
  
  // 上下文值
  const contextValue: SkeletonContextType = {
    isEnabled,
    setIsEnabled,
    isVisible,
    setIsVisible,
    duration,
    setDuration,
    minDuration,
    setMinDuration,
    variant,
    setVariant,
    showSkeleton,
    hideSkeleton,
    isLoading,
    setIsLoading
  };
  
  return (
    <SkeletonContext.Provider value={contextValue}>
      {children}
    </SkeletonContext.Provider>
  );
};

/**
 * 使用骨架屏上下文
 * @returns 骨架屏上下文
 */
export const useSkeleton = (): SkeletonContextType => {
  const context = useContext(SkeletonContext);
  
  if (!context) {
    throw new Error('useSkeleton must be used within a SkeletonProvider');
  }
  
  return context;
};

/**
 * 使用骨架屏加载
 * @param isLoading 是否正在加载
 * @param options 骨架屏选项
 */
export const useSkeletonLoading = (
  isLoading: boolean,
  options?: ShowSkeletonOptions
) => {
  const { showSkeleton, hideSkeleton } = useSkeleton();
  
  useEffect(() => {
    if (isLoading) {
      showSkeleton(options);
    } else {
      hideSkeleton();
    }
  }, [isLoading, showSkeleton, hideSkeleton, options]);
};
