// src/hooks/useSkeletonLoader.ts
import { useState, useEffect, useCallback } from 'react';
import { useSkeleton } from '@/context/SkeletonProvider';

interface UseSkeletonLoaderOptions {
  // 是否自动显示骨架屏
  autoShow?: boolean;
  // 骨架屏变体样式
  variant?: 'default' | 'jade' | 'gold';
  // 骨架屏最小显示时间（毫秒）
  minDuration?: number;
  // 骨架屏持续时间（毫秒）
  duration?: number;
  // 初始加载状态
  initialLoading?: boolean;
}

interface UseSkeletonLoaderResult {
  // 是否正在加载
  isLoading: boolean;
  // 设置是否正在加载
  setIsLoading: (loading: boolean) => void;
  // 显示骨架屏
  showSkeleton: () => void;
  // 隐藏骨架屏
  hideSkeleton: () => void;
  // 是否显示骨架屏
  isVisible: boolean;
  // 包装异步函数，自动显示/隐藏骨架屏
  withSkeleton: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

/**
 * 使用骨架屏加载器
 * 
 * 提供骨架屏加载状态管理和异步函数包装
 * 
 * @param options 骨架屏加载器选项
 * @returns 骨架屏加载器结果
 */
export const useSkeletonLoader = (
  options: UseSkeletonLoaderOptions = {}
): UseSkeletonLoaderResult => {
  const {
    autoShow = true,
    variant = 'jade',
    minDuration = 500,
    duration = 1000,
    initialLoading = false
  } = options;
  
  // 获取骨架屏上下文
  const { 
    showSkeleton: contextShowSkeleton, 
    hideSkeleton: contextHideSkeleton,
    isVisible
  } = useSkeleton();
  
  // 加载状态
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  
  // 显示骨架屏
  const showSkeleton = useCallback(() => {
    contextShowSkeleton({
      variant,
      minDuration,
      duration
    });
    setIsLoading(true);
  }, [contextShowSkeleton, variant, minDuration, duration]);
  
  // 隐藏骨架屏
  const hideSkeleton = useCallback(() => {
    contextHideSkeleton();
    setIsLoading(false);
  }, [contextHideSkeleton]);
  
  // 包装异步函数，自动显示/隐藏骨架屏
  const withSkeleton = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      showSkeleton();
      const result = await asyncFn();
      return result;
    } finally {
      hideSkeleton();
    }
  }, [showSkeleton, hideSkeleton]);
  
  // 监听加载状态
  useEffect(() => {
    if (autoShow) {
      if (isLoading) {
        showSkeleton();
      } else {
        hideSkeleton();
      }
    }
  }, [isLoading, autoShow, showSkeleton, hideSkeleton]);
  
  // 初始加载状态
  useEffect(() => {
    if (initialLoading && autoShow) {
      showSkeleton();
    }
  }, [initialLoading, autoShow, showSkeleton]);
  
  return {
    isLoading,
    setIsLoading,
    showSkeleton,
    hideSkeleton,
    isVisible,
    withSkeleton
  };
};
