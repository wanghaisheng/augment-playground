// src/pages/ChallengesPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChallengeStatus,
  ChallengeType,
  ChallengeDifficulty,
  initializeChallengeCategories
} from '@/services/challengeService';
import ChallengeList from '@/components/game/ChallengeList';
import PageTransition from '@/components/animation/PageTransition';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import AnimatedButton from '@/components/animation/AnimatedButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { fetchChallengesPageView } from '@/services/localizedContentService';
import type { ChallengesPageViewLabelsBundle } from '@/types';

/**
 * 挑战页面
 * 显示挑战列表和过滤选项
 */
const ChallengesPage: React.FC = () => {
  const [filter, setFilter] = useState<{
    status?: ChallengeStatus;
    type?: ChallengeType;
    difficulty?: ChallengeDifficulty;
  }>({
    status: ChallengeStatus.ACTIVE
  });

  const {
    labels: pageLabels,
    isPending,
    isError,
    error,
    refetch
  } = useLocalizedView<null, ChallengesPageViewLabelsBundle>(
    'challengesPageViewContent',
    fetchChallengesPageView
  );

  // 初始化挑战类别
  useEffect(() => {
    initializeChallengeCategories();
  }, []);

  // 处理状态过滤
  const handleStatusFilter = (status?: ChallengeStatus) => {
    setFilter(prev => ({ ...prev, status }));
  };

  // 处理类型过滤
  const handleTypeFilter = (type?: ChallengeType) => {
    setFilter(prev => ({ ...prev, type }));
  };

  // 处理难度过滤
  const handleDifficultyFilter = (difficulty?: ChallengeDifficulty) => {
    setFilter(prev => ({ ...prev, difficulty }));
  };

  // 清除所有过滤器
  const clearAllFilters = () => {
    setFilter({});
  };

  // 显示加载状态
  if (isPending) {
    return (
      <PageTransition>
        <div className="challenges-page">
          <LoadingSpinner variant="jade" text="加载挑战中..." />
        </div>
      </PageTransition>
    );
  }

  // 显示错误状态
  if (isError) {
    return (
      <PageTransition>
        <div className="challenges-page">
          <ErrorDisplay
            error={error}
            title="加载挑战失败"
            messageTemplate="无法加载挑战数据: {message}"
            onRetry={refetch}
            retryButtonText="重试"
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <motion.div
        className="challenges-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="page-header">
          <h1 className="page-title">{pageLabels?.pageTitle || '挑战'}</h1>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <h3 className="filter-title">状态</h3>
            <div className="filter-buttons">
              <AnimatedButton
                onClick={() => handleStatusFilter(undefined)}
                className={!filter.status ? 'active' : ''}
              >
                全部
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(ChallengeStatus.ACTIVE)}
                className={filter.status === ChallengeStatus.ACTIVE ? 'active' : ''}
              >
                进行中
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(ChallengeStatus.COMPLETED)}
                className={filter.status === ChallengeStatus.COMPLETED ? 'active' : ''}
              >
                已完成
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleStatusFilter(ChallengeStatus.UPCOMING)}
                className={filter.status === ChallengeStatus.UPCOMING ? 'active' : ''}
              >
                即将开始
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
                全部
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(ChallengeType.DAILY)}
                className={filter.type === ChallengeType.DAILY ? 'active' : ''}
              >
                每日
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(ChallengeType.WEEKLY)}
                className={filter.type === ChallengeType.WEEKLY ? 'active' : ''}
              >
                每周
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(ChallengeType.EVENT)}
                className={filter.type === ChallengeType.EVENT ? 'active' : ''}
              >
                活动
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleTypeFilter(ChallengeType.ONGOING)}
                className={filter.type === ChallengeType.ONGOING ? 'active' : ''}
              >
                持续
              </AnimatedButton>
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">难度</h3>
            <div className="filter-buttons">
              <AnimatedButton
                onClick={() => handleDifficultyFilter(undefined)}
                className={!filter.difficulty ? 'active' : ''}
              >
                全部
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleDifficultyFilter(ChallengeDifficulty.EASY)}
                className={filter.difficulty === ChallengeDifficulty.EASY ? 'active' : ''}
              >
                简单
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleDifficultyFilter(ChallengeDifficulty.MEDIUM)}
                className={filter.difficulty === ChallengeDifficulty.MEDIUM ? 'active' : ''}
              >
                中等
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleDifficultyFilter(ChallengeDifficulty.HARD)}
                className={filter.difficulty === ChallengeDifficulty.HARD ? 'active' : ''}
              >
                困难
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleDifficultyFilter(ChallengeDifficulty.EXPERT)}
                className={filter.difficulty === ChallengeDifficulty.EXPERT ? 'active' : ''}
              >
                专家
              </AnimatedButton>
            </div>
          </div>

          <div className="filter-actions">
            <AnimatedButton onClick={clearAllFilters} className="clear-filters-button">
              清除所有过滤器
            </AnimatedButton>
          </div>
        </div>

        <div className="challenges-container">
          <ChallengeList filter={filter} />
        </div>
      </motion.div>
    </PageTransition>
  );
};

export default ChallengesPage;
