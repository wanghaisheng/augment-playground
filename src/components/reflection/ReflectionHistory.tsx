/**
 * @deprecated 此组件已废弃，请使用 EnhancedReflectionHistory 组件代替。
 * 此组件将在下一个主要版本中移除。
 *
 * EnhancedReflectionHistory 提供了以下优势：
 * 1. 与数据刷新机制集成，自动响应数据变化
 * 2. 支持骨架屏加载，提供更好的用户体验
 * 3. 支持标签过滤和搜索功能
 * 4. 支持多语言和自定义标签
 * 5. 使用优化的动画容器，提供更流畅的动画效果
 */

import React from 'react';
import {
  ReflectionRecord
} from '@/services/reflectionService';
import EnhancedReflectionHistory from './EnhancedReflectionHistory';

interface ReflectionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onReflectionSelected?: (reflection: ReflectionRecord) => void;
}

/**
 * 反思历史组件
 * 用于显示用户的反思历史记录
 *
 * @deprecated 此组件已废弃，请使用 EnhancedReflectionHistory 组件代替。
 */
const ReflectionHistory: React.FC<ReflectionHistoryProps> = ({
  isOpen,
  onClose,
  onReflectionSelected
}) => {
  // 使用 EnhancedReflectionHistory 实现
  return (
    <EnhancedReflectionHistory
      isOpen={isOpen}
      onClose={onClose}
      onReflectionSelected={onReflectionSelected}
      labels={{
        title: "反思历史",
        filters: {
          all: "全部",
          completed: "已完成",
          inProgress: "进行中",
          search: "搜索",
          searchPlaceholder: "搜索反思...",
          tags: "标签",
          clearFilters: "清除筛选"
        },
        emptyState: "暂无反思记录",
        errorState: "加载反思历史失败，请重试",
        retryButton: "重试"
      }}
    />
  );
};

export default ReflectionHistory;
