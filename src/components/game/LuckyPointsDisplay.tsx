// src/components/game/LuckyPointsDisplay.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLuckyPointsTotal } from '@/services/timelyRewardService';
import { useTableRefresh } from '@/hooks/useDataRefresh';

interface LuckyPointsDisplayProps {
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'large';
}

/**
 * 幸运点显示组件
 * 显示用户当前的幸运点数量
 */
const LuckyPointsDisplay: React.FC<LuckyPointsDisplayProps> = ({ 
  onClick, 
  variant = 'default' 
}) => {
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // 加载幸运点数量
  const loadPoints = async () => {
    try {
      setIsLoading(true);
      const total = await getLuckyPointsTotal();
      setPoints(total);
    } catch (err) {
      console.error('Failed to load lucky points:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadPoints();
  }, []);

  // 使用 useTableRefresh 监听幸运点表的变化
  useTableRefresh('luckyPoints', () => {
    loadPoints();
    setIsAnimating(true);
    
    // 动画结束后重置状态
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  });

  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // 获取变体类名
  const getVariantClass = () => {
    switch (variant) {
      case 'compact':
        return 'lucky-points-compact';
      case 'large':
        return 'lucky-points-large';
      default:
        return 'lucky-points-default';
    }
  };

  return (
    <motion.div
      className={`lucky-points-display ${getVariantClass()} ${isAnimating ? 'animating' : ''}`}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="lucky-points-icon">🍀</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={points}
          className="lucky-points-value"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <span className="loading-dots">...</span>
          ) : (
            <span>{points}</span>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="lucky-points-label">幸运点</div>
    </motion.div>
  );
};

export default LuckyPointsDisplay;
