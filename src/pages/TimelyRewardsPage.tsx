// src/pages/TimelyRewardsPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TimelyRewardStatus,
  TimelyRewardType,
  initializeTimelyRewards
} from '@/services/timelyRewardService';
import TimelyRewardList from '@/components/game/TimelyRewardList';
import LuckyDraw from '@/components/game/LuckyDraw';
import PageTransition from '@/components/animation/PageTransition';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import AnimatedButton from '@/components/animation/AnimatedButton';
import ScrollDialog from '@/components/game/ScrollDialog';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { fetchTimelyRewardsPageView } from '@/services/localizedContentService';
import type { TimelyRewardsPageViewLabelsBundle } from '@/types';

/**
 * 及时奖励页面
 * 显示及时奖励列表和幸运抽奖
 */
const TimelyRewardsPage: React.FC = () => {
  const [filter, setFilter] = useState<{
    status?: TimelyRewardStatus;
    type?: TimelyRewardType;
  }>({
    status: TimelyRewardStatus.ACTIVE
  });
  const [showLuckyDraw, setShowLuckyDraw] = useState(false);

  const {
    labels: pageLabels,
    isPending,
    isError,
    error,
    refetch
  } = useLocalizedView<null, TimelyRewardsPageViewLabelsBundle>(
    'timelyRewardsPageViewContent',
    fetchTimelyRewardsPageView
  );

  // 初始化及时奖励
  useEffect(() => {
    initializeTimelyRewards();
  }, []);

  // 处理状态过滤
  const handleStatusFilter = (status?: TimelyRewardStatus) => {
    setFilter(prev => ({ ...prev, status }));
  };

  // 处理类型过滤
  const handleTypeFilter = (type?: TimelyRewardType) => {
    setFilter(prev => ({ ...prev, type }));
  };

  // 清除所有过滤器
  const clearAllFilters = () => {
    setFilter({});
  };

  // 打开幸运抽奖
  const openLuckyDraw = () => {
    setShowLuckyDraw(true);
  };

  // 关闭幸运抽奖
  const closeLuckyDraw = () => {
    setShowLuckyDraw(false);
  };

  if (isPending && !pageLabels) { // 完整页面初始加载
    return <LoadingSpinner variant="jade" text="加载及时奖励页面内容..." />;
  }

  if (isError && !pageLabels) { // 关键错误：页面标签加载失败
    return (
      <div className="page-content">
        <ErrorDisplay error={error} title="及时奖励页面错误" onRetry={refetch} />
      </div>
    );
  }

  return (
    <PageTransition>
      <motion.div
        className="timely-rewards-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="page-header">
          <h1 className="page-title">{pageLabels?.pageTitle || '及时奖励'}</h1>
          <AnimatedButton
            onClick={openLuckyDraw}
            className="lucky-draw-button"
          >
            {pageLabels?.luckyDraw?.buttonText || '幸运抽奖'}
          </AnimatedButton>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <h3 className="filter-title">状态</h3>
            <div className="filter-buttons">
              <AnimatedButton
                onClick={() => handleStatusFilter(undefined)}
                className={!filter.status ? 'active' : ''}
              >
                {pageLabels?.filters?.allLabel || '全部'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(TimelyRewardStatus.ACTIVE)}
                className={filter.status === TimelyRewardStatus.ACTIVE ? 'active' : ''}
              >
                {pageLabels?.filters?.activeLabel || '进行中'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(TimelyRewardStatus.COMPLETED)}
                className={filter.status === TimelyRewardStatus.COMPLETED ? 'active' : ''}
              >
                {pageLabels?.filters?.completedLabel || '已完成'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(TimelyRewardStatus.UPCOMING)}
                className={filter.status === TimelyRewardStatus.UPCOMING ? 'active' : ''}
              >
                {pageLabels?.filters?.upcomingLabel || '即将开始'}
              </AnimatedButton>
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">类型</h3>
            <div className="filter-buttons">
              <AnimatedButton
                onClick={() => handleTypeFilter(undefined)}
                className={!filter.type ? 'active' : ''}
              >
                {pageLabels?.filters?.typeAllLabel || '全部'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(TimelyRewardType.DAILY)}
                className={filter.type === TimelyRewardType.DAILY ? 'active' : ''}
              >
                {pageLabels?.filters?.typeDailyLabel || '每日奖励'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(TimelyRewardType.MORNING)}
                className={filter.type === TimelyRewardType.MORNING ? 'active' : ''}
              >
                {pageLabels?.filters?.typeMorningLabel || '早起鸟奖励'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(TimelyRewardType.STREAK)}
                className={filter.type === TimelyRewardType.STREAK ? 'active' : ''}
              >
                {pageLabels?.filters?.typeStreakLabel || '连续完成奖励'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(TimelyRewardType.SPECIAL)}
                className={filter.type === TimelyRewardType.SPECIAL ? 'active' : ''}
              >
                {pageLabels?.filters?.typeSpecialLabel || '特殊奖励'}
              </AnimatedButton>
            </div>
          </div>

          <div className="filter-actions">
            <AnimatedButton onClick={clearAllFilters} className="clear-filters-button">
              {pageLabels?.filters?.clearFiltersLabel || '清除所有过滤器'}
            </AnimatedButton>
          </div>
        </div>

        <div className="rewards-container">
          <TimelyRewardList filter={filter} />
        </div>

        {/* 幸运抽奖模态框 */}
        {showLuckyDraw && (
          <ScrollDialog
            isOpen={showLuckyDraw}
            title={pageLabels?.luckyDraw?.title || '幸运抽奖'}
            onClose={closeLuckyDraw}
          >
            <div className="lucky-draw-dialog">
              <LuckyDraw onClose={closeLuckyDraw} />
            </div>
          </ScrollDialog>
        )}
      </motion.div>
    </PageTransition>
  );
};

export default TimelyRewardsPage;
