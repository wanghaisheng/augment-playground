// src/components/task/TaskCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TaskRecord,
  completeTask,
  TaskStatus,
  TaskPriority
} from '@/services/taskService';
import { getTaskCategory } from '@/services/taskCategoryService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import TaskDetailDialog from './TaskDetailDialog';

interface TaskCardLabels {
  priority?: {
    high?: string;
    medium?: string;
    low?: string;
    unknown?: string;
  };
  status?: {
    overdue?: string;
  };
  buttons?: {
    complete?: string;
    viewDetails?: string;
  };
  dates?: {
    dueDate?: string;
  };
  errors?: {
    completeTaskFailed?: string;
  };
}

interface TaskCardProps {
  task: TaskRecord;
  onTaskCompleted?: (task: TaskRecord) => void;
  onTaskUpdated?: () => void;
  labels?: TaskCardLabels;
}

/**
 * 任务卡片组件
 * 用于显示任务信息和操作
 */
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskCompleted,
  onTaskUpdated,
  labels
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // 加载任务分类
  React.useEffect(() => {
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

  // 处理完成任务
  const handleCompleteTask = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡

    try {
      setIsCompleting(true);
      setError(null);

      // 完成任务
      const completedTask = await completeTask(task.id!);

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 通知父组件
      if (onTaskCompleted) {
        onTaskCompleted(task);
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
      setError(labels?.errors?.completeTaskFailed || 'Failed to complete task, please try again');
    } finally {
      setIsCompleting(false);
    }
  };

  // 处理查看任务详情
  const handleViewDetails = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    // 显示详情对话框
    setShowDetailDialog(true);
  };

  // Get priority label and style
  const getPriorityInfo = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return { label: labels?.priority?.high || 'High', className: 'bg-red-100 text-red-800' };
      case TaskPriority.MEDIUM:
        return { label: labels?.priority?.medium || 'Medium', className: 'bg-yellow-100 text-yellow-800' };
      case TaskPriority.LOW:
        return { label: labels?.priority?.low || 'Low', className: 'bg-green-100 text-green-800' };
      default:
        return { label: labels?.priority?.unknown || 'Unknown', className: 'bg-gray-100 text-gray-800' };
    }
  };

  // 检查任务是否已过期
  const isOverdue = () => {
    return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED;
  };

  return (
    <>
      <motion.div
        className={`task-card p-3 rounded-lg shadow-md ${
          task.status === TaskStatus.COMPLETED ? 'bg-gray-50' : 'bg-white'
        } ${
          isOverdue() ? 'border-l-4 border-red-500' : ''
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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
              {task.categoryId && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                  {categoryName}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityInfo(task.priority).className}`}>
                {getPriorityInfo(task.priority).label}
              </span>
              {isOverdue() && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                  {labels?.status?.overdue || "Overdue"}
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
                  labels?.buttons?.complete || "Complete"
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
                {labels?.dates?.dueDate || "Due date"}: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="task-details-link text-xs text-jade-600 cursor-pointer">
            {labels?.buttons?.viewDetails || "View details"}
          </div>
        </div>

        {error && (
          <div className="error-message mt-2 text-xs text-red-500">
            {error}
          </div>
        )}
      </motion.div>

      {/* 任务详情对话框 */}
      {showDetailDialog && (
        <TaskDetailDialog
          isOpen={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
          taskId={task.id!}
          onTaskUpdated={onTaskUpdated}
          onTaskCompleted={onTaskCompleted}
        />
      )}
    </>
  );
};

export default TaskCard;
