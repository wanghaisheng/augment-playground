// src/components/tasks/EnhancedTaskCard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TaskRecord, 
  TaskStatus, 
  TaskPriority, 
  TaskType, 
  completeTask 
} from '@/services/taskService';
import { getTaskCategory } from '@/services/taskCategoryService';
import { hasSubtasks } from '@/services/subtaskService';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import EnhancedTaskDetailDialog from './EnhancedTaskDetailDialog';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OptimizedAnimatedItem from '@/components/animation/OptimizedAnimatedItem';

interface EnhancedTaskCardProps {
  task: TaskRecord;
  index?: number;
  onComplete?: (taskId: number) => void;
  onEdit?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  onTaskUpdated?: () => void;
  className?: string;
  disableAnimation?: boolean;
  priority?: 'low' | 'medium' | 'high';
  labels?: {
    status?: {
      overdue?: string;
      completed?: string;
      inProgress?: string;
      notStarted?: string;
    };
    priority?: {
      low?: string;
      medium?: string;
      high?: string;
      urgent?: string;
    };
    buttons?: {
      complete?: string;
      edit?: string;
      delete?: string;
      viewDetails?: string;
    };
    errors?: {
      completeTaskFailed?: string;
    };
    subtasks?: {
      hasSubtasks?: string;
    };
  };
}

/**
 * 增强版任务卡片组件
 * 用于显示任务信息和操作，支持动画和多语言
 * 
 * @param task - 任务数据
 * @param index - 任务索引（用于动画）
 * @param onComplete - 完成任务回调
 * @param onEdit - 编辑任务回调
 * @param onDelete - 删除任务回调
 * @param onTaskUpdated - 任务更新回调
 * @param className - 自定义类名
 * @param disableAnimation - 是否禁用动画
 * @param priority - 动画优先级
 * @param labels - 本地化标签
 */
const EnhancedTaskCard: React.FC<EnhancedTaskCardProps> = ({
  task,
  index = 0,
  onComplete,
  onEdit,
  onDelete,
  onTaskUpdated,
  className = '',
  disableAnimation = false,
  priority = 'medium',
  labels: propLabels
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [hasSubtasksList, setHasSubtasksList] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    status: {
      overdue: propLabels?.status?.overdue || componentLabels?.taskCard?.status?.overdue || "Overdue",
      completed: propLabels?.status?.completed || componentLabels?.taskCard?.status?.completed || "Completed",
      inProgress: propLabels?.status?.inProgress || componentLabels?.taskCard?.status?.inProgress || "In Progress",
      notStarted: propLabels?.status?.notStarted || componentLabels?.taskCard?.status?.notStarted || "Not Started"
    },
    priority: {
      low: propLabels?.priority?.low || componentLabels?.taskCard?.priority?.low || "Low",
      medium: propLabels?.priority?.medium || componentLabels?.taskCard?.priority?.medium || "Medium",
      high: propLabels?.priority?.high || componentLabels?.taskCard?.priority?.high || "High",
      urgent: propLabels?.priority?.urgent || componentLabels?.taskCard?.priority?.urgent || "Urgent"
    },
    buttons: {
      complete: propLabels?.buttons?.complete || componentLabels?.taskCard?.buttons?.complete || "Complete",
      edit: propLabels?.buttons?.edit || componentLabels?.taskCard?.buttons?.edit || "Edit",
      delete: propLabels?.buttons?.delete || componentLabels?.taskCard?.buttons?.delete || "Delete",
      viewDetails: propLabels?.buttons?.viewDetails || componentLabels?.taskCard?.buttons?.viewDetails || "View Details"
    },
    errors: {
      completeTaskFailed: propLabels?.errors?.completeTaskFailed || componentLabels?.taskCard?.errors?.completeTaskFailed || "Failed to complete task"
    },
    subtasks: {
      hasSubtasks: propLabels?.subtasks?.hasSubtasks || componentLabels?.taskCard?.subtasks?.hasSubtasks || "Contains subtasks"
    }
  };

  // 加载任务分类
  useEffect(() => {
    const loadCategory = async () => {
      if (task.categoryId) {
        try {
          const category = await getTaskCategory(task.categoryId);
          if (category) {
            setCategoryName(category.name);
          }
        } catch (err) {
          console.error('Failed to load task category:', err);
        }
      }
    };

    loadCategory();
  }, [task.categoryId]);

  // 检查是否有子任务
  useEffect(() => {
    const checkSubtasks = async () => {
      if (task.id) {
        try {
          const hasSubtasksList = await hasSubtasks(task.id);
          setHasSubtasksList(hasSubtasksList);
        } catch (err) {
          console.error('Failed to check subtasks:', err);
        }
      }
    };

    checkSubtasks();
  }, [task.id]);

  // 处理完成任务
  const handleCompleteTask = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡

    try {
      setIsCompleting(true);
      setError(null);

      // 完成任务
      await completeTask(task.id!);

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 通知父组件
      if (onComplete) {
        onComplete(task.id!);
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
      setError(labels.errors.completeTaskFailed);
    } finally {
      setIsCompleting(false);
    }
  };

  // 处理编辑任务
  const handleEditTask = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡

    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    // 调用编辑回调
    if (onEdit) {
      onEdit(task.id!);
    }
  };

  // 处理删除任务
  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡

    // 确认删除
    if (window.confirm('Are you sure you want to delete this task?')) {
      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.3);

      // 调用删除回调
      if (onDelete) {
        onDelete(task.id!);
      }
    }
  };

  // 处理查看任务详情
  const handleViewDetails = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    // 显示详情对话框
    setShowDetailDialog(true);
  };

  // 处理任务更新
  const handleTaskUpdated = () => {
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  // 检查任务是否过期
  const isOverdue = () => {
    if (!task.dueDate || task.status === TaskStatus.COMPLETED) {
      return false;
    }
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    
    return dueDate < now;
  };

  // 获取优先级信息
  const getPriorityInfo = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return { label: labels.priority.low, className: 'bg-blue-100 text-blue-800' };
      case TaskPriority.MEDIUM:
        return { label: labels.priority.medium, className: 'bg-green-100 text-green-800' };
      case TaskPriority.HIGH:
        return { label: labels.priority.high, className: 'bg-orange-100 text-orange-800' };
      case TaskPriority.URGENT:
        return { label: labels.priority.urgent, className: 'bg-red-100 text-red-800' };
      default:
        return { label: labels.priority.medium, className: 'bg-green-100 text-green-800' };
    }
  };

  // 渲染任务卡片
  return (
    <>
      <OptimizedAnimatedItem
        className={`enhanced-task-card ${className}`}
        index={index}
        priority={priority}
        disableAnimation={disableAnimation}
      >
        <motion.div
          className={`task-card p-3 rounded-lg shadow-md ${
            task.status === TaskStatus.COMPLETED ? 'bg-gray-50' : 'bg-white'
          } ${
            isOverdue() ? 'border-l-4 border-red-500' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewDetails}
        >
          <div className="task-header flex justify-between items-start mb-2">
            <div className="task-title-container">
              <h3 className={`text-md font-bold ${
                task.status === TaskStatus.COMPLETED ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              <div className="task-meta flex flex-wrap gap-1 mt-1">
                {task.categoryId && categoryName && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                    {categoryName}
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityInfo(task.priority).className}`}>
                  {getPriorityInfo(task.priority).label}
                </span>
                {isOverdue() && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                    {labels.status.overdue}
                  </span>
                )}
                {hasSubtasksList && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                    {labels.subtasks.hasSubtasks}
                  </span>
                )}
              </div>
            </div>
            <div className="task-actions">
              {task.status !== TaskStatus.COMPLETED && (
                <Button
                  variant="jade"
                  size="small"
                  onClick={handleCompleteTask}
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <LoadingSpinner variant="white" size="small" />
                  ) : (
                    labels.buttons.complete
                  )}
                </Button>
              )}
            </div>
          </div>

          {task.description && (
            <div className="task-description mb-2">
              <p className={`text-sm ${
                task.status === TaskStatus.COMPLETED ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description}
              </p>
            </div>
          )}

          <div className="task-footer flex justify-between items-center">
            <div className="task-dates text-xs text-gray-500">
              {task.dueDate && (
                <span className={`${isOverdue() ? 'text-red-500 font-medium' : ''}`}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="task-actions flex gap-2">
              <button
                className="text-xs text-jade-600 hover:text-jade-800"
                onClick={handleEditTask}
              >
                {labels.buttons.edit}
              </button>
              <button
                className="text-xs text-red-600 hover:text-red-800"
                onClick={handleDeleteTask}
              >
                {labels.buttons.delete}
              </button>
            </div>
          </div>
        </motion.div>
      </OptimizedAnimatedItem>

      {/* 任务详情对话框 */}
      {showDetailDialog && (
        <EnhancedTaskDetailDialog
          isOpen={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
          taskId={task.id!}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </>
  );
};

export default EnhancedTaskCard;
