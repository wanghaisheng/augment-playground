// src/components/reflection/EnhancedReflectionHistory.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ReflectionRecord,
  ReflectionStatus,
  getUserReflections,
  getAllReflectionTags
} from '@/services/reflectionService';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import TraditionalWindowModal from '@/components/common/TraditionalWindowModal';
import Button from '@/components/common/Button';
import EnhancedReflectionList from './EnhancedReflectionList';
import EnhancedReflectionDetailDialog from './EnhancedReflectionDetailDialog';
import EnhancedInput from '@/components/common/EnhancedInput';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';

interface EnhancedReflectionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onReflectionSelected?: (reflection: ReflectionRecord) => void;
  labels?: {
    title?: string;
    filters?: {
      all?: string;
      completed?: string;
      inProgress?: string;
      search?: string;
      searchPlaceholder?: string;
      tags?: string;
      clearFilters?: string;
    };
    emptyState?: string;
    errorState?: string;
    retryButton?: string;
  };
}

/**
 * 增强版反思历史组件
 * 用于显示用户的反思历史记录，支持多语言和动画
 * 
 * @param isOpen - 是否打开对话框
 * @param onClose - 关闭对话框回调
 * @param onReflectionSelected - 选择反思回调
 * @param labels - 本地化标签
 */
const EnhancedReflectionHistory: React.FC<EnhancedReflectionHistoryProps> = ({
  isOpen,
  onClose,
  onReflectionSelected,
  labels: propLabels
}) => {
  const [filter, setFilter] = useState<{
    status?: ReflectionStatus;
    tags?: string[];
    search?: string;
  }>({});
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState<ReflectionRecord | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    title: propLabels?.title || componentLabels?.reflectionHistory?.title || "Reflection History",
    filters: {
      all: propLabels?.filters?.all || componentLabels?.reflectionHistory?.filters?.all || "All",
      completed: propLabels?.filters?.completed || componentLabels?.reflectionHistory?.filters?.completed || "Completed",
      inProgress: propLabels?.filters?.inProgress || componentLabels?.reflectionHistory?.filters?.inProgress || "In Progress",
      search: propLabels?.filters?.search || componentLabels?.reflectionHistory?.filters?.search || "Search",
      searchPlaceholder: propLabels?.filters?.searchPlaceholder || componentLabels?.reflectionHistory?.filters?.searchPlaceholder || "Search reflections...",
      tags: propLabels?.filters?.tags || componentLabels?.reflectionHistory?.filters?.tags || "Tags",
      clearFilters: propLabels?.filters?.clearFilters || componentLabels?.reflectionHistory?.filters?.clearFilters || "Clear Filters"
    },
    emptyState: propLabels?.emptyState || componentLabels?.reflectionHistory?.emptyState || "No reflections found",
    errorState: propLabels?.errorState || componentLabels?.reflectionHistory?.errorState || "Failed to load reflections",
    retryButton: propLabels?.retryButton || componentLabels?.reflectionHistory?.retryButton || "Retry"
  };

  // 加载标签
  const loadTags = async () => {
    try {
      setIsLoadingTags(true);
      const tags = await getAllReflectionTags();
      setAvailableTags(tags);
    } catch (err) {
      console.error('Failed to load reflection tags:', err);
    } finally {
      setIsLoadingTags(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (isOpen) {
      loadTags();
    }
  }, [isOpen]);

  // 注册数据刷新监听
  useRegisterTableRefresh('reflections', () => {
    loadTags();
    setRefreshTrigger(prev => prev + 1);
  });

  // 处理状态过滤
  const handleStatusFilter = (status?: ReflectionStatus) => {
    setFilter(prev => ({ ...prev, status }));
  };

  // 处理标签过滤
  const handleTagFilter = (tag: string) => {
    setFilter(prev => {
      const currentTags = prev.tags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      
      return {
        ...prev,
        tags: newTags.length > 0 ? newTags : undefined
      };
    });
  };

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setFilter(prev => ({
      ...prev,
      search: searchTerm || undefined
    }));
  };

  // 清除过滤器
  const handleClearFilters = () => {
    setFilter({});
  };

  // 处理选择反思
  const handleSelectReflection = (reflection: ReflectionRecord) => {
    if (onReflectionSelected) {
      onReflectionSelected(reflection);
    } else {
      setSelectedReflection(reflection);
    }
  };

  // 处理反思更新
  const handleReflectionUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <TraditionalWindowModal
        isOpen={isOpen}
        onClose={onClose}
        title={labels.title}
        size="large"
      >
        <div className="enhanced-reflection-history p-4">
          <OptimizedAnimatedContainer priority="high">
            {/* 过滤器 */}
            <div className="reflection-filters mb-4">
              <div className="filter-row flex flex-wrap gap-2 mb-2">
                <Button
                  variant={!filter.status ? 'jade' : 'secondary'}
                  size="small"
                  onClick={() => handleStatusFilter(undefined)}
                >
                  {labels.filters.all}
                </Button>
                <Button
                  variant={filter.status === ReflectionStatus.COMPLETED ? 'jade' : 'secondary'}
                  size="small"
                  onClick={() => handleStatusFilter(ReflectionStatus.COMPLETED)}
                >
                  {labels.filters.completed}
                </Button>
                <Button
                  variant={filter.status === ReflectionStatus.IN_PROGRESS ? 'jade' : 'secondary'}
                  size="small"
                  onClick={() => handleStatusFilter(ReflectionStatus.IN_PROGRESS)}
                >
                  {labels.filters.inProgress}
                </Button>
                {Object.keys(filter).length > 0 && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleClearFilters}
                  >
                    {labels.filters.clearFilters}
                  </Button>
                )}
              </div>

              <div className="search-row mb-2">
                <EnhancedInput
                  placeholder={labels.filters.searchPlaceholder}
                  value={filter.search || ''}
                  onChange={handleSearch}
                  prefixIcon="search"
                />
              </div>

              {availableTags.length > 0 && (
                <div className="tags-filter">
                  <p className="text-sm font-medium text-gray-700 mb-1">{labels.filters.tags}:</p>
                  <div className="tags-list flex flex-wrap gap-1">
                    {isLoadingTags ? (
                      <LoadingSpinner variant="jade" size="small" />
                    ) : (
                      availableTags.map((tag, index) => (
                        <Button
                          key={index}
                          variant={(filter.tags || []).includes(tag) ? 'jade' : 'secondary'}
                          size="small"
                          onClick={() => handleTagFilter(tag)}
                        >
                          {tag}
                        </Button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 反思列表 */}
            <EnhancedReflectionList
              onSelectReflection={handleSelectReflection}
              filter={filter}
              refreshTrigger={refreshTrigger}
              emptyStateComponent={
                <div className="reflection-list-empty text-center p-4">
                  <p className="text-gray-500">{labels.emptyState}</p>
                </div>
              }
              errorStateComponent={
                <div className="reflection-list-error text-center p-4">
                  <p className="text-red-500 mb-2">{labels.errorState}</p>
                  <Button
                    variant="jade"
                    onClick={() => setRefreshTrigger(prev => prev + 1)}
                  >
                    {labels.retryButton}
                  </Button>
                </div>
              }
            />
          </OptimizedAnimatedContainer>
        </div>
      </TraditionalWindowModal>

      {/* 反思详情对话框 */}
      {selectedReflection && (
        <EnhancedReflectionDetailDialog
          isOpen={!!selectedReflection}
          onClose={() => setSelectedReflection(null)}
          reflectionId={selectedReflection.id!}
          onReflectionUpdated={handleReflectionUpdated}
        />
      )}
    </>
  );
};

export default EnhancedReflectionHistory;
