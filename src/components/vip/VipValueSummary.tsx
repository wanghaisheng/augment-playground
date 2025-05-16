// src/components/vip/VipValueSummary.tsx
import React, { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';
import {
  VipValueStats,
  calculateVipValueStats
} from '@/services/vipValueCalculatorService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchVipValueView } from '@/services/localizedContentService';
import { Language } from '@/types';

interface VipValueSummaryProps {
  userId: string;
  onViewDetails?: () => void;
  compact?: boolean;
  className?: string;
}

/**
 * VIP价值摘要组件
 *
 * 以紧凑的形式展示VIP会员的价值
 */
const VipValueSummary: React.FC<VipValueSummaryProps> = ({
  userId,
  onViewDetails,
  compact = false,
  className = ''
}) => {
  const [valueStats, setValueStats] = useState<VipValueStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { lastRefresh } = useDataRefreshContext();

  // Function to fetch localized content for VIP value
  const fetchVipValueViewFn = useCallback(async (lang: Language) => {
    try {
      return await fetchVipValueView(lang);
    } catch (error) {
      console.error('Error fetching VIP value view:', error);
      throw error;
    }
  }, []);

  // Fetch localized content for the VIP value
  const { data: viewData } = useLocalizedView<null, { labels: { [key: string]: string } }>('vipValue', fetchVipValueViewFn);

  // 创建加载VIP价值统计数据的函数
  const loadVipValueStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 计算VIP价值统计数据
      const stats = await calculateVipValueStats(userId);
      setValueStats(stats);
    } catch (error) {
      console.error('Failed to load VIP value stats:', error);
      setError('加载VIP价值统计数据失败');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // 初始加载VIP价值统计数据
  useEffect(() => {
    loadVipValueStats();
  }, [loadVipValueStats]);

  // 监听数据刷新
  useEffect(() => {
    // 检查是否有VIP相关的数据刷新
    if (lastRefresh['vipSubscriptions'] || lastRefresh['tasks'] ||
        lastRefresh['rewards'] || lastRefresh['meditations']) {
      loadVipValueStats();
    }
  }, [lastRefresh, loadVipValueStats]);

  // 处理查看详情
  const handleViewDetails = () => {
    playSound(SoundType.BUTTON_CLICK);
    if (onViewDetails) {
      onViewDetails();
    }
  };

  // 格式化货币
  const formatCurrency = (num: number) => {
    return `¥${num.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`;
  };

  // 格式化倍数
  const formatMultiplier = (num: number) => {
    return `${num.toFixed(1)}x`;
  };

  // Get content from viewData
  const content = viewData?.labels || {};

  // 渲染加载状态
  const renderLoading = () => (
    <div className="flex justify-center items-center h-16">
      <LoadingSpinner variant="gold" size="small" />
    </div>
  );

  // 渲染错误状态
  const renderError = () => (
    <div className="text-center p-2">
      <div className="text-red-500 text-sm">{error}</div>
    </div>
  );

  // 渲染紧凑模式
  const renderCompact = () => {
    if (!valueStats) return null;

    return (
      <div className="compact-summary flex items-center">
        <div className="value-icon mr-3 text-2xl">💰</div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700">
            {content.vipValueTitle || 'VIP会员价值'}
          </div>
          <div className="text-lg font-bold text-gold-600">
            {formatCurrency(valueStats.totalValue.estimatedMonthlySavings)} / {content.month || '月'}
          </div>
        </div>

        <Button
          variant="text"
          size="small"
          onClick={handleViewDetails}
          className="text-gold-600"
        >
          {content.detailsButton || '详情'}
        </Button>
      </div>
    );
  };

  // 渲染标准模式
  const renderStandard = () => {
    if (!valueStats) return null;

    return (
      <div className="standard-summary">
        <div className="flex items-center mb-3">
          <div className="value-icon mr-3 text-3xl">💰</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gold-700">
              {content.vipValueTitle || 'VIP会员价值'}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="value-item bg-gold-50 rounded-lg p-3 border border-gold-200">
            <div className="text-sm text-gray-600 mb-1">
              {content.monthlySavings || '每月节省'}
            </div>
            <div className="text-xl font-bold text-gold-600">
              {formatCurrency(valueStats.totalValue.estimatedMonthlySavings)}
            </div>
          </div>

          <div className="value-item bg-gold-50 rounded-lg p-3 border border-gold-200">
            <div className="text-sm text-gray-600 mb-1">
              {content.returnOnInvestment || '投资回报率'}
            </div>
            <div className="text-xl font-bold text-gold-600">
              {formatMultiplier(valueStats.totalValue.returnOnInvestment)}
            </div>
          </div>
        </div>

        <div className="boost-summary mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            {content.boostSummary || '加成摘要'}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="boost-item">
              <div className="text-sm text-gray-600 mb-1">🎋</div>
              <div className="text-sm font-medium text-jade-600">
                {formatMultiplier(valueStats.resourceBoost.bambooBonus)}
              </div>
            </div>

            <div className="boost-item">
              <div className="text-sm text-gray-600 mb-1">🪙</div>
              <div className="text-sm font-medium text-amber-600">
                {formatMultiplier(valueStats.resourceBoost.coinsBonus)}
              </div>
            </div>

            <div className="boost-item">
              <div className="text-sm text-gray-600 mb-1">⭐</div>
              <div className="text-sm font-medium text-purple-600">
                {formatMultiplier(valueStats.growthBoost.experienceBonus)}
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="gold"
          size="small"
          onClick={handleViewDetails}
          className="w-full"
        >
          {content.viewDetailsButton || '查看详细价值分析'}
        </Button>
      </div>
    );
  };

  return (
    <div className={`vip-value-summary ${className}`}>
      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : compact ? (
        renderCompact()
      ) : (
        renderStandard()
      )}
    </div>
  );
};

export default VipValueSummary;
