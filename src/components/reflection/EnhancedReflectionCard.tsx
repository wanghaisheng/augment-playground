// src/components/reflection/EnhancedReflectionCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ReflectionRecord, 
  ReflectionStatus,
  deleteReflection 
} from '@/services/reflectionService';
import { formatDate } from '@/utils/dateUtils';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OptimizedAnimatedItem from '@/components/animation/OptimizedAnimatedItem';
import EnhancedReflectionDetailDialog from './EnhancedReflectionDetailDialog';

interface EnhancedReflectionCardProps {
  reflection: ReflectionRecord;
  index?: number;
  onSelect?: (reflection: ReflectionRecord) => void;
  onDelete?: (reflectionId: number) => void;
  onReflectionUpdated?: () => void;
  className?: string;
  disableAnimation?: boolean;
  priority?: 'low' | 'medium' | 'high';
  labels?: {
    status?: {
      completed?: string;
      inProgress?: string;
    };
    buttons?: {
      view?: string;
      delete?: string;
    };
    errors?: {
      deleteFailed?: string;
    };
    tags?: {
      title?: string;
    };
    dates?: {
      created?: string;
      completed?: string;
    };
  };
}

/**
 * 增强版反思卡片组件
 * 用于显示反思记录信息和操作，支持动画和多语言
 * 
 * @param reflection - 反思记录数据
 * @param index - 反思索引（用于动画）
 * @param onSelect - 选择反思回调
 * @param onDelete - 删除反思回调
 * @param onReflectionUpdated - 反思更新回调
 * @param className - 自定义类名
 * @param disableAnimation - 是否禁用动画
 * @param priority - 动画优先级
 * @param labels - 本地化标签
 */
const EnhancedReflectionCard: React.FC<EnhancedReflectionCardProps> = ({
  reflection,
  index = 0,
  onSelect,
  onDelete,
  onReflectionUpdated,
  className = '',
  disableAnimation = false,
  priority = 'medium',
  labels: propLabels
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    status: {
      completed: propLabels?.status?.completed || componentLabels?.reflectionCard?.status?.completed || "Completed",
      inProgress: propLabels?.status?.inProgress || componentLabels?.reflectionCard?.status?.inProgress || "In Progress"
    },
    buttons: {
      view: propLabels?.buttons?.view || componentLabels?.reflectionCard?.buttons?.view || "View",
      delete: propLabels?.buttons?.delete || componentLabels?.reflectionCard?.buttons?.delete || "Delete"
    },
    errors: {
      deleteFailed: propLabels?.errors?.deleteFailed || componentLabels?.reflectionCard?.errors?.deleteFailed || "Failed to delete reflection"
    },
    tags: {
      title: propLabels?.tags?.title || componentLabels?.reflectionCard?.tags?.title || "Tags"
    },
    dates: {
      created: propLabels?.dates?.created || componentLabels?.reflectionCard?.dates?.created || "Created",
      completed: propLabels?.dates?.completed || componentLabels?.reflectionCard?.dates?.completed || "Completed"
    }
  };

  // 注册数据刷新监听
  useRegisterTableRefresh('reflections', () => {
    if (onReflectionUpdated) {
      onReflectionUpdated();
    }
  });

  // 处理删除反思
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡

    // 确认删除
    if (!window.confirm('Are you sure you want to delete this reflection?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      // 删除反思
      await deleteReflection(reflection.id!);

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.3);

      // 通知父组件
      if (onDelete) {
        onDelete(reflection.id!);
      }
    } catch (err) {
      console.error('Failed to delete reflection:', err);
      setError(labels.errors.deleteFailed);
    } finally {
      setIsDeleting(false);
    }
  };

  // 处理查看反思详情
  const handleViewDetails = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    // 如果有选择回调，调用它
    if (onSelect) {
      onSelect(reflection);
    } else {
      // 否则显示详情对话框
      setShowDetailDialog(true);
    }
  };

  // 处理反思更新
  const handleReflectionUpdated = () => {
    if (onReflectionUpdated) {
      onReflectionUpdated();
    }
  };

  // 渲染反思卡片
  return (
    <>
      <OptimizedAnimatedItem
        className={`enhanced-reflection-card ${className}`}
        index={index}
        priority={priority}
        disableAnimation={disableAnimation}
      >
        <motion.div
          className={`reflection-card p-3 rounded-lg shadow-md ${
            reflection.status === ReflectionStatus.COMPLETED ? 'bg-gray-50' : 'bg-white'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewDetails}
        >
          <div className="reflection-header flex justify-between items-start mb-2">
            <div className="reflection-title-container">
              <h3 className="text-md font-bold">
                {reflection.title || "Reflection"}
              </h3>
              <div className="reflection-meta flex flex-wrap gap-1 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  reflection.status === ReflectionStatus.COMPLETED 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {reflection.status === ReflectionStatus.COMPLETED 
                    ? labels.status.completed 
                    : labels.status.inProgress}
                </span>
                {reflection.mood && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                    {reflection.mood}
                  </span>
                )}
              </div>
            </div>
          </div>

          {reflection.content && (
            <div className="reflection-content mb-2">
              <p className="text-sm text-gray-600">
                {reflection.content.length > 100 
                  ? `${reflection.content.substring(0, 100)}...` 
                  : reflection.content}
              </p>
            </div>
          )}

          {reflection.tags && reflection.tags.length > 0 && (
            <div className="reflection-tags mb-2">
              <p className="text-xs text-gray-500 mb-1">{labels.tags.title}:</p>
              <div className="flex flex-wrap gap-1">
                {reflection.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="reflection-footer flex justify-between items-center">
            <div className="reflection-dates text-xs text-gray-500">
              <div>{labels.dates.created}: {formatDate(reflection.createdAt)}</div>
              {reflection.completedAt && (
                <div>{labels.dates.completed}: {formatDate(reflection.completedAt)}</div>
              )}
            </div>
            <div className="reflection-actions flex gap-2">
              <Button
                variant="jade"
                size="small"
                onClick={handleViewDetails}
              >
                {labels.buttons.view}
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <LoadingSpinner variant="white" size="small" />
                ) : (
                  labels.buttons.delete
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="reflection-error mt-2 text-xs text-red-500">
              {error}
            </div>
          )}
        </motion.div>
      </OptimizedAnimatedItem>

      {/* 反思详情对话框 */}
      {showDetailDialog && (
        <EnhancedReflectionDetailDialog
          isOpen={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
          reflectionId={reflection.id!}
          onReflectionUpdated={handleReflectionUpdated}
        />
      )}
    </>
  );
};

export default EnhancedReflectionCard;
