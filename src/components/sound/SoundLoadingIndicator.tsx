// src/components/sound/SoundLoadingIndicator.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAudioLoadStats } from '@/utils/soundLoader';

interface SoundLoadingIndicatorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showLabel?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

/**
 * 音效加载指示器组件
 * 
 * 显示音效加载进度
 */
const SoundLoadingIndicator: React.FC<SoundLoadingIndicatorProps> = ({
  position = 'bottom-right',
  showLabel = true,
  autoHide = true,
  autoHideDelay = 3000
}) => {
  // 状态
  const [stats, setStats] = useState<{
    total: number;
    loaded: number;
    loading: number;
    error: number;
    idle: number;
    averageLoadTime: number;
  }>({
    total: 0,
    loaded: 0,
    loading: 0,
    error: 0,
    idle: 0,
    averageLoadTime: 0
  });
  
  const [visible, setVisible] = useState(true);
  
  // 获取音效加载统计信息
  useEffect(() => {
    // 初始获取统计信息
    try {
      const currentStats = getAudioLoadStats();
      setStats(currentStats);
    } catch (error) {
      console.debug('Failed to get audio load stats:', error);
    }
    
    // 定时更新统计信息
    const intervalId = setInterval(() => {
      try {
        const currentStats = getAudioLoadStats();
        setStats(currentStats);
        
        // 如果所有音效都已加载且启用了自动隐藏，则在延迟后隐藏
        if (autoHide && currentStats.total > 0 && currentStats.loaded === currentStats.total) {
          setTimeout(() => {
            setVisible(false);
          }, autoHideDelay);
          
          // 清除定时器
          clearInterval(intervalId);
        }
      } catch (error) {
        console.debug('Failed to get audio load stats:', error);
      }
    }, 1000);
    
    // 清理函数
    return () => {
      clearInterval(intervalId);
    };
  }, [autoHide, autoHideDelay]);
  
  // 计算加载进度
  const progress = stats.total > 0 ? (stats.loaded / stats.total) * 100 : 0;
  
  // 获取位置样式
  const getPositionStyle = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };
  
  // 如果没有音效或者已经隐藏，则不显示
  if (stats.total === 0 || !visible) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`fixed ${getPositionStyle()} z-50 bg-white bg-opacity-90 rounded-lg shadow-md p-2 flex items-center space-x-2 border border-jade-200`}
        style={{ maxWidth: '200px' }}
      >
        {/* 加载图标 */}
        <div className="relative w-6 h-6">
          <svg
            className="w-6 h-6 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          <svg
            className="absolute top-0 left-0 w-6 h-6 text-jade-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${(progress / 100) * 63} 63`}
            transform="rotate(-90 12 12)"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-jade-700">
            {Math.round(progress)}%
          </div>
        </div>
        
        {/* 标签 */}
        {showLabel && (
          <div className="text-xs text-gray-600">
            <div>音效加载中</div>
            <div className="text-xs text-gray-500">
              {stats.loaded}/{stats.total} 已加载
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SoundLoadingIndicator;
