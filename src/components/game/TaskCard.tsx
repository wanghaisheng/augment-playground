/**
 * @deprecated 此组件已废弃，请使用 EnhancedTaskCard 组件代替。
 * 此组件将在下一个主要版本中移除。
 *
 * EnhancedTaskCard 提供了以下优势：
 * 1. 与数据刷新机制集成，自动响应数据变化
 * 2. 支持多语言和自定义标签
 * 3. 使用优化的动画效果，提供更流畅的用户体验
 * 4. 支持动画优先级和在低性能设备上禁用动画
 * 5. 更好的错误处理和加载状态管理
 */

import React from 'react';
import { TaskRecord, TaskPriority, TaskStatus, TaskType } from '@/services/taskService';
import EnhancedTaskCard from '@/components/tasks/EnhancedTaskCard';

interface TaskCardLabels {
  subtasks?: {
    hasSubtasks?: string;
  };
  buttons?: {
    complete?: string;
    edit?: string;
    delete?: string;
  };
}

interface TaskCardProps {
  task: TaskRecord;
  onComplete?: (taskId: number) => void;
  onEdit?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  onTaskUpdated?: () => void;
  className?: string;
  labels?: TaskCardLabels;
}

/**
 * 任务卡片组件，显示任务信息和操作按钮
 *
 * @deprecated 此组件已废弃，请使用 EnhancedTaskCard 组件代替。
 */
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onEdit,
  onDelete,
  onTaskUpdated,
  className = '',
  labels
}) => {
  // 使用 EnhancedTaskCard 实现
  return (
    <EnhancedTaskCard
      task={task}
      onComplete={onComplete}
      onEdit={onEdit}
      onDelete={onDelete}
      onTaskUpdated={onTaskUpdated}
      className={className}
      labels={{
        subtasks: labels?.subtasks,
        buttons: labels?.buttons
      }}
    />
  );
};

export default TaskCard;
