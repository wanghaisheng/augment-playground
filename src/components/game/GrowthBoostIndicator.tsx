// src/components/game/GrowthBoostIndicator.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGrowthBoostMultiplier, getActiveGrowthBoosts } from '@/services/growthBoostService';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import InkIcon from '@/components/common/InkIcon';

interface GrowthBoostIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * 成长速度加成指示器组件
 * 显示当前的成长速度加成倍数
 */
const GrowthBoostIndicator: React.FC<GrowthBoostIndicatorProps> = ({
  size = 'medium',
  // showLabel = true, // 未使用的属性
  className = '',
  onClick
}) => {
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [activeBoosts, setActiveBoosts] = useState<any[]>([]);
  const { labels } = useLocalizedView<null, { growthBoostLabel?: string; activeBoostsTitle?: string; noActiveBoostsMessage?: string }>('growthBoostIndicator', () => Promise.resolve({ data: null, labels: { growthBoostLabel: '成长速度', activeBoostsTitle: '激活的成长加成', noActiveBoostsMessage: '没有激活的成长加成' } }));

  // 加载成长速度加成数据
  const loadBoostData = async () => {
    try {
      setIsLoading(true);
      const boostMultiplier = await getGrowthBoostMultiplier();
      setMultiplier(boostMultiplier);

      const boosts = await getActiveGrowthBoosts();
      setActiveBoosts(boosts);
    } catch (err) {
      console.error('Failed to load growth boost data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadBoostData();
  }, []);

  // 注册数据刷新监听
  const handleBoostDataUpdate = () => {
    loadBoostData();
  };

  // 监听成长速度加成表的变化
  useRegisterTableRefresh('growthBoosts', handleBoostDataUpdate);

  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowDetails(!showDetails);
    }
  };

  // 尺寸映射
  const sizeMap = {
    small: {
      container: 'h-6 text-xs',
      icon: 'xs',
      badge: 'text-xs px-1'
    },
    medium: {
      container: 'h-8 text-sm',
      icon: 'sm',
      badge: 'text-sm px-1.5'
    },
    large: {
      container: 'h-10 text-base',
      icon: 'md',
      badge: 'text-base px-2'
    }
  };

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  // 详情面板变体
  const detailsVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  // 如果没有加成，不显示组件
  if (multiplier <= 1.0 && !isLoading) {
    return null;
  }

  return (
    <div className={`growth-boost-indicator-container relative ${className}`}>
      <AnimatePresence>
        <motion.div
          key="growth-boost-indicator"
          className={`growth-boost-indicator flex items-center gap-1 px-2 rounded-full bg-gradient-to-r from-jade-500 to-jade-600 text-white cursor-pointer ${sizeMap[size].container}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClick}
        >
          <InkIcon
            type="resource-experience"
            size={sizeMap[size].icon as 'xs' | 'sm' | 'md' | 'lg' | 'xl'}
          />
          <span className="font-medium">
            {labels?.growthBoostLabel || '成长速度'}: x{multiplier.toFixed(1)}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* 详情面板 */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            key="growth-boost-details"
            className="growth-boost-details absolute top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-lg z-10 w-64"
            variants={detailsVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-lg font-semibold text-jade-700 mb-2">
              {labels?.activeBoostsTitle || '激活的成长加成'}
            </h3>
            {activeBoosts.length > 0 ? (
              <ul className="space-y-2">
                {activeBoosts.map((boost, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-6 h-6 flex-shrink-0 bg-jade-100 rounded-full flex items-center justify-center text-jade-600">
                      +
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {boost.source} (x{boost.boostValue.toFixed(1)})
                      </p>
                      <p className="text-xs text-gray-500">{boost.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                {labels?.noActiveBoostsMessage || '没有激活的成长加成'}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GrowthBoostIndicator;
