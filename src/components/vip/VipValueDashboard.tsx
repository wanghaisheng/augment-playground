// src/components/vip/VipValueDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface VipValueDashboardProps {
  userId: string;
  onSubscribe?: () => void;
  isVip: boolean;
}

/**
 * VIP价值仪表盘组件
 *
 * 展示VIP会员的价值和节省
 */
const VipValueDashboard: React.FC<VipValueDashboardProps> = ({
  userId,
  onSubscribe,
  isVip
}) => {
  const [valueStats, setValueStats] = useState<VipValueStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'exclusive'>('overview');
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

  // Get content from viewData
  const content = viewData?.labels || {};

  // 这个useEffect已经被移动到下面

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

  // 处理订阅
  const handleSubscribe = () => {
    playSound(SoundType.BUTTON_CLICK);
    if (onSubscribe) {
      onSubscribe();
    }
  };

  // 处理切换标签
  const handleTabChange = (tab: 'overview' | 'resources' | 'exclusive') => {
    playSound(SoundType.BUTTON_CLICK);
    setActiveTab(tab);
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  };

  // 格式化货币
  const formatCurrency = (num: number) => {
    return `¥${num.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`;
  };

  // 格式化百分比 - 暂时未使用，保留供将来使用
  // const formatPercent = (num: number) => {
  //   return `${(num * 100).toFixed(0)}%`;
  // };

  // 格式化倍数
  const formatMultiplier = (num: number) => {
    return `${num.toFixed(1)}x`;
  };

  // 渲染加载状态
  const renderLoading = () => (
    <div className="flex justify-center items-center h-40">
      <LoadingSpinner variant="gold" size="medium" />
    </div>
  );

  // 渲染错误状态
  const renderError = () => (
    <div className="text-center p-4">
      <div className="text-red-500 mb-4">{error}</div>
      <Button
        variant="secondary"
        onClick={() => window.location.reload()}
      >
        {content.retryButton || '重试'}
      </Button>
    </div>
  );

  // 渲染概览标签
  const renderOverviewTab = () => {
    if (!valueStats) return null;

    return (
      <div className="overview-tab">
        {/* 总价值卡片 */}
        <div className="value-card bg-gold-50 border border-gold-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-gold-700 mb-3">
            {content.totalValueTitle || 'VIP会员总价值'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="value-item text-center">
              <div className="text-sm text-gray-600 mb-1">
                {content.monthlySavings || '每月节省'}
              </div>
              <div className="text-2xl font-bold text-gold-600">
                {formatCurrency(valueStats.totalValue.estimatedMonthlySavings)}
              </div>
            </div>

            <div className="value-item text-center">
              <div className="text-sm text-gray-600 mb-1">
                {content.yearlySavings || '每年节省'}
              </div>
              <div className="text-2xl font-bold text-gold-600">
                {formatCurrency(valueStats.totalValue.estimatedYearlySavings)}
              </div>
            </div>

            <div className="value-item text-center">
              <div className="text-sm text-gray-600 mb-1">
                {content.returnOnInvestment || '投资回报率'}
              </div>
              <div className="text-2xl font-bold text-gold-600">
                {formatMultiplier(valueStats.totalValue.returnOnInvestment)}
              </div>
            </div>
          </div>
        </div>

        {/* 价值分类卡片 */}
        <div className="categories-card bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            {content.valueCategories || 'VIP会员价值分类'}
          </h3>

          <div className="space-y-4">
            {/* 资源加成 */}
            <div className="category-item">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium text-gray-700">
                  {content.resourceBoost || '资源加成'}
                </div>
                <div className="text-sm text-gold-600">
                  {formatCurrency(
                    valueStats.resourceBoost.totalBambooSaved * 0.1 +
                    valueStats.resourceBoost.totalCoinsSaved * 0.2
                  )}
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gold-500"
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ duration: 0.8 }}
                ></motion.div>
              </div>
            </div>

            {/* 成长速度加成 */}
            <div className="category-item">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium text-gray-700">
                  {content.growthBoost || '成长速度加成'}
                </div>
                <div className="text-sm text-gold-600">
                  {formatCurrency(valueStats.growthBoost.totalExperienceSaved * 0.5)}
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gold-500"
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                ></motion.div>
              </div>
            </div>

            {/* 专属内容 */}
            <div className="category-item">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium text-gray-700">
                  {content.exclusiveContent || '专属内容'}
                </div>
                <div className="text-sm text-gold-600">
                  {formatCurrency(
                    valueStats.exclusiveContent.vipSkins.totalCount * 15 +
                    valueStats.exclusiveContent.vipTasks.totalCount * 5 +
                    valueStats.exclusiveContent.vipMeditations.totalCount * 10
                  )}
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gold-500"
                  initial={{ width: 0 }}
                  animate={{ width: '35%' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                ></motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* 订阅信息卡片 */}
        {isVip && valueStats.subscription.isActive && (
          <div className="subscription-card bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {content.subscriptionInfo || '订阅信息'}
            </h3>

            <div className="flex items-center mb-4">
              <div className="subscription-status bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {content.activeStatus || '已激活'}
              </div>

              {valueStats.subscription.daysLeft > 0 && (
                <div className="ml-3 text-sm text-gray-600">
                  {content.daysLeft?.replace('{days}', valueStats.subscription.daysLeft.toString()) ||
                   `还剩 ${valueStats.subscription.daysLeft} 天`}
                </div>
              )}
            </div>

            {valueStats.subscription.endDate && (
              <div className="text-sm text-gray-600">
                {content.expirationDate?.replace(
                  '{date}',
                  new Date(valueStats.subscription.endDate).toLocaleDateString()
                ) ||
                 `到期日期: ${new Date(valueStats.subscription.endDate).toLocaleDateString()}`}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // 渲染资源标签
  const renderResourcesTab = () => {
    if (!valueStats) return null;

    return (
      <div className="resources-tab">
        {/* 资源加成卡片 */}
        <div className="resource-card bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            {content.resourceBoostTitle || '资源加成'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="boost-item bg-jade-50 border border-jade-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🎋</span>
                <div className="text-base font-medium text-jade-700">
                  {content.bambooBoost || '竹子加成'}
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-1">
                {content.boostMultiplier || '加成倍数'}:
                <span className="ml-2 font-bold text-jade-600">
                  {formatMultiplier(valueStats.resourceBoost.bambooBonus)}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                {content.totalSaved || '总节省'}:
                <span className="ml-2 font-bold text-jade-600">
                  {formatNumber(valueStats.resourceBoost.totalBambooSaved)}
                </span>
              </div>
            </div>

            <div className="boost-item bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🪙</span>
                <div className="text-base font-medium text-amber-700">
                  {content.coinsBoost || '金币加成'}
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-1">
                {content.boostMultiplier || '加成倍数'}:
                <span className="ml-2 font-bold text-amber-600">
                  {formatMultiplier(valueStats.resourceBoost.coinsBonus)}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                {content.totalSaved || '总节省'}:
                <span className="ml-2 font-bold text-amber-600">
                  {formatNumber(valueStats.resourceBoost.totalCoinsSaved)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="boost-item bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">⭐</span>
                <div className="text-base font-medium text-purple-700">
                  {content.experienceBoost || '经验值加成'}
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-1">
                {content.boostMultiplier || '加成倍数'}:
                <span className="ml-2 font-bold text-purple-600">
                  {formatMultiplier(valueStats.growthBoost.experienceBonus)}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                {content.totalSaved || '总节省'}:
                <span className="ml-2 font-bold text-purple-600">
                  {formatNumber(valueStats.growthBoost.totalExperienceSaved)}
                </span>
              </div>
            </div>

            <div className="boost-item bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🎯</span>
                <div className="text-base font-medium text-blue-700">
                  {content.customGoalsBoost || '自定义目标加成'}
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-1">
                {content.extraGoals || '额外目标数'}:
                <span className="ml-2 font-bold text-blue-600">
                  +{valueStats.customGoalsBoost.goalsBonus}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                {content.currentUsage || '当前使用'}:
                <span className="ml-2 font-bold text-blue-600">
                  {valueStats.customGoalsBoost.currentGoalsCount} / {valueStats.customGoalsBoost.maxGoalsCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染专属内容标签
  const renderExclusiveTab = () => {
    if (!valueStats) return null;

    return (
      <div className="exclusive-tab">
        {/* 专属皮肤卡片 */}
        <div className="exclusive-card bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            {content.exclusiveSkins || 'VIP专属皮肤'}
          </h3>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {content.unlockedSkins?.replace(
                '{unlocked}', valueStats.exclusiveContent.vipSkins.unlockedCount.toString()
              ).replace(
                '{total}', valueStats.exclusiveContent.vipSkins.totalCount.toString()
              ) ||
               `已解锁 ${valueStats.exclusiveContent.vipSkins.unlockedCount} / ${valueStats.exclusiveContent.vipSkins.totalCount}`}
            </div>

            <div className="text-sm font-medium text-gold-600">
              {content.estimatedValue?.replace(
                '{value}', formatCurrency(valueStats.exclusiveContent.vipSkins.totalCount * 15)
              ) ||
               `估值: ${formatCurrency(valueStats.exclusiveContent.vipSkins.totalCount * 15)}`}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="h-2 rounded-full bg-gold-500"
              initial={{ width: 0 }}
              animate={{ width: `${(valueStats.exclusiveContent.vipSkins.unlockedCount / valueStats.exclusiveContent.vipSkins.totalCount) * 100}%` }}
              transition={{ duration: 0.8 }}
            ></motion.div>
          </div>
        </div>

        {/* 专属任务卡片 */}
        <div className="exclusive-card bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            {content.exclusiveTasks || 'VIP专属任务'}
          </h3>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {content.completedTasks?.replace(
                '{completed}', valueStats.exclusiveContent.vipTasks.completedCount.toString()
              ).replace(
                '{total}', valueStats.exclusiveContent.vipTasks.totalCount.toString()
              ) ||
               `已完成 ${valueStats.exclusiveContent.vipTasks.completedCount} / ${valueStats.exclusiveContent.vipTasks.totalCount}`}
            </div>

            <div className="text-sm font-medium text-gold-600">
              {content.estimatedValue?.replace(
                '{value}', formatCurrency(valueStats.exclusiveContent.vipTasks.totalCount * 5)
              ) ||
               `估值: ${formatCurrency(valueStats.exclusiveContent.vipTasks.totalCount * 5)}`}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="h-2 rounded-full bg-gold-500"
              initial={{ width: 0 }}
              animate={{ width: `${(valueStats.exclusiveContent.vipTasks.completedCount / valueStats.exclusiveContent.vipTasks.totalCount) * 100}%` }}
              transition={{ duration: 0.8 }}
            ></motion.div>
          </div>
        </div>

        {/* 专属冥想卡片 */}
        <div className="exclusive-card bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            {content.exclusiveMeditations || 'VIP专属冥想'}
          </h3>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {content.completedMeditations?.replace(
                '{completed}', valueStats.exclusiveContent.vipMeditations.completedCount.toString()
              ).replace(
                '{total}', valueStats.exclusiveContent.vipMeditations.totalCount.toString()
              ) ||
               `已完成 ${valueStats.exclusiveContent.vipMeditations.completedCount} / ${valueStats.exclusiveContent.vipMeditations.totalCount}`}
            </div>

            <div className="text-sm font-medium text-gold-600">
              {content.estimatedValue?.replace(
                '{value}', formatCurrency(valueStats.exclusiveContent.vipMeditations.totalCount * 10)
              ) ||
               `估值: ${formatCurrency(valueStats.exclusiveContent.vipMeditations.totalCount * 10)}`}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="h-2 rounded-full bg-gold-500"
              initial={{ width: 0 }}
              animate={{ width: `${(valueStats.exclusiveContent.vipMeditations.completedCount / valueStats.exclusiveContent.vipMeditations.totalCount) * 100}%` }}
              transition={{ duration: 0.8 }}
            ></motion.div>
          </div>

          <div className="text-sm text-gray-600">
            {content.totalMeditationTime?.replace(
              '{minutes}', valueStats.exclusiveContent.vipMeditations.totalMinutes.toString()
            ) ||
             `总冥想时间: ${valueStats.exclusiveContent.vipMeditations.totalMinutes} 分钟`}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="vip-value-dashboard">
      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        <>
          {/* 标签切换 */}
          <div className="tabs-container mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`tab-button py-2 px-4 font-medium ${
                  activeTab === 'overview' ? 'text-gold-600 border-b-2 border-gold-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('overview')}
              >
                {content.overviewTab || '概览'}
              </button>
              <button
                className={`tab-button py-2 px-4 font-medium ${
                  activeTab === 'resources' ? 'text-gold-600 border-b-2 border-gold-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('resources')}
              >
                {content.resourcesTab || '资源加成'}
              </button>
              <button
                className={`tab-button py-2 px-4 font-medium ${
                  activeTab === 'exclusive' ? 'text-gold-600 border-b-2 border-gold-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('exclusive')}
              >
                {content.exclusiveTab || '专属内容'}
              </button>
            </div>
          </div>

          {/* 标签内容 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'resources' && renderResourcesTab()}
              {activeTab === 'exclusive' && renderExclusiveTab()}
            </motion.div>
          </AnimatePresence>

          {/* 订阅按钮 */}
          {!isVip && (
            <div className="subscribe-section mt-6">
              <Button
                variant="gold"
                onClick={handleSubscribe}
                className="w-full"
              >
                {content.subscribeButton || '立即订阅VIP'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VipValueDashboard;
