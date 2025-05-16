// src/components/game/LuckyPointsDisplay.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLuckyPointsTotal } from '@/services/timelyRewardService';
import { useOptimizedDataRefresh } from '@/hooks/useOptimizedDataRefresh';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useStableCallback } from '@/hooks/useStableCallback';
import { useAsyncEffectOnce } from '@/hooks/useAsyncEffect';
import { mergeLabelBundles } from '@/types';

interface LuckyPointsDisplayLabels {
  label: string;
  loadingText: string;
}

interface LuckyPointsDisplayProps {
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'large';
  labels?: Partial<LuckyPointsDisplayLabels>;
}

/**
 * 幸运点显示组件
 * 显示用户当前的幸运点数量
 */
const LuckyPointsDisplay: React.FC<LuckyPointsDisplayProps> = ({
  onClick,
  variant = 'default',
  labels: propLabels
}) => {
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // 使用组件标签钩子获取标签
  const { componentLabels } = useComponentLabels('luckyPointsDisplay');

  // 合并标签，优先使用props传入的标签，然后是组件标签，最后是默认标签
  const defaultLabels: LuckyPointsDisplayLabels = {
    label: 'Lucky Points',
    loadingText: 'Loading...'
  };

  // 使用mergeLabelBundles合并标签
  const mergedLabels = mergeLabelBundles<LuckyPointsDisplayLabels>(
    propLabels,
    mergeLabelBundles(componentLabels as Partial<LuckyPointsDisplayLabels>, defaultLabels)
  );

  // 加载幸运点数量 - 使用useStableCallback确保函数引用稳定
  const loadPoints = useStableCallback(async () => {
    try {
      setIsLoading(true);
      const total = await getLuckyPointsTotal();
      setPoints(total);
    } catch (err) {
      console.error('Failed to load lucky points:', err);
    } finally {
      setIsLoading(false);
    }
  });

  // 初始加载 - 使用useAsyncEffectOnce替代useEffect
  useAsyncEffectOnce(async () => {
    await loadPoints();
  });

  // 定义幸运点数据更新处理函数 - 使用useStableCallback确保函数引用稳定
  const handleLuckyPointsUpdate = useStableCallback(() => {
    loadPoints();
    setIsAnimating(true);

    // 动画结束后重置状态
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  });

  // 使用优化的数据刷新钩子替代直接的useRegisterTableRefresh
  useOptimizedDataRefresh(['luckyPoints'], loadPoints, 200);

  // 处理点击事件 - 使用useStableCallback确保函数引用稳定
  const handleClick = useStableCallback(() => {
    if (onClick) {
      onClick();
    }
  });

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
            <span className="loading-dots">{mergedLabels.loadingText}</span>
          ) : (
            <span>{points}</span>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="lucky-points-label">{mergedLabels.label}</div>
    </motion.div>
  );
};

export default LuckyPointsDisplay;
