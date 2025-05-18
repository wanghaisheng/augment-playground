// src/components/reflection/EnhancedReflectionList.tsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  ReflectionRecord,
  ReflectionStatus,
  getUserReflections,
  deleteReflection
} from '@/services/reflectionService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';
import EnhancedReflectionCard from './EnhancedReflectionCard';
import EnhancedDataLoader from '@/components/common/EnhancedDataLoader';
import Button from '@/components/common/Button';
import { createContainerVariants } from '@/utils/animation';
import { ReflectionCardSkeleton } from '@/components/skeleton';

interface EnhancedReflectionListProps {
  onSelectReflection: (reflection: ReflectionRecord) => void;
  filter?: {
    status?: ReflectionStatus;
    tags?: string[];
    mood?: string;
    startDate?: Date;
    endDate?: Date;
  };
  refreshTrigger?: number;
  className?: string;
  emptyStateComponent?: React.ReactNode;
  errorStateComponent?: React.ReactNode;
  labels?: {
    emptyState?: string;
    errorState?: string;
    retryButton?: string;
  };
}

/**
 * 增强版反思列表组件
 * 提供更丰富的功能和更好的用户体验
 *
 * @param onSelectReflection - 选择反思回调
 * @param filter - 过滤条件
 * @param refreshTrigger - 刷新触发器
 * @param className - 自定义类名
 * @param emptyStateComponent - 自定义空状态组件
 * @param errorStateComponent - 自定义错误状态组件
 * @param labels - 本地化标签
 */
const EnhancedReflectionList: React.FC<EnhancedReflectionListProps> = ({
  onSelectReflection,
  filter,
  refreshTrigger = 0,
  className = '',
  emptyStateComponent,
  errorStateComponent,
  labels: propLabels
}) => {
  const [reflections, setReflections] = useState<ReflectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    emptyState: propLabels?.emptyState || componentLabels?.reflectionList?.emptyState || "No reflections available",
    errorState: propLabels?.errorState || componentLabels?.reflectionList?.errorState || "Failed to load reflections",
    retryButton: propLabels?.retryButton || componentLabels?.reflectionList?.retryButton || "Retry"
  };

  // 加载反思
  const loadReflections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const reflectionList = await getUserReflections(filter);
      setReflections(reflectionList);
    } catch (err) {
      console.error('Failed to load reflections:', err);
      setError('Failed to load reflections');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载和刷新触发
  useEffect(() => {
    loadReflections();
  }, [filter, refreshTrigger]);

  // 注册数据刷新监听
  useRegisterTableRefresh('reflections', loadReflections);

  // 处理删除反思
  const handleDeleteReflection = async (reflectionId: number) => {
    try {
      await deleteReflection(reflectionId);
      await loadReflections();
    } catch (err) {
      console.error('Failed to delete reflection:', err);
    }
  };

  // 排序反思
  const sortedReflections = [...reflections].sort((a, b) => {
    // 首先按状态排序（未完成在前）
    if (a.status !== b.status) {
      return a.status === ReflectionStatus.COMPLETED ? 1 : -1;
    }
    
    // 然后按创建时间排序（最新在前）
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // 渲染反思列表
  return (
    <div className={`enhanced-reflection-list ${className}`}>
      <EnhancedDataLoader
        isLoading={isLoading}
        isError={!!error}
        error={error}
        data={sortedReflections}
        loadingText="Loading reflections..."
        errorTitle={labels.errorState}
        onRetry={loadReflections}
        emptyState={emptyStateComponent || (
          <div className="reflection-list-empty text-center p-4">
            <p className="text-gray-500">{labels.emptyState}</p>
          </div>
        )}
        errorComponent={errorStateComponent}
        skeletonComponent={
          <div className="reflection-list-skeleton">
            {[...Array(3)].map((_, i) => (
              <ReflectionCardSkeleton key={i} />
            ))}
          </div>
        }
        skeletonCount={3}
        skeletonVariant="jade"
      >
        {(reflections) => (
          <OptimizedAnimatedContainer
            variants={createContainerVariants(0.05, 0)}
            className="reflection-list-container"
            priority="high"
          >
            <AnimatePresence mode="popLayout">
              {sortedReflections.map((reflection, index) => (
                <EnhancedReflectionCard
                  key={reflection.id}
                  reflection={reflection}
                  index={index}
                  onSelect={onSelectReflection}
                  onDelete={handleDeleteReflection}
                  onReflectionUpdated={loadReflections}
                />
              ))}
            </AnimatePresence>
          </OptimizedAnimatedContainer>
        )}
      </EnhancedDataLoader>
    </div>
  );
};

export default EnhancedReflectionList;
