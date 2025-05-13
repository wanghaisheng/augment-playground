// src/components/game/TaskCard.tsx
import React from 'react';
import { TaskRecord, TaskPriority, TaskStatus, TaskType } from '@/services/taskService';

interface TaskCardProps {
  task: TaskRecord;
  onComplete?: (taskId: number) => void;
  onEdit?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  className?: string;
}

/**
 * 任务卡片组件，显示任务信息和操作按钮
 */
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onEdit,
  onDelete,
  className = ''
}) => {
  // 获取任务优先级对应的样式
  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'task-priority-high';
      case TaskPriority.MEDIUM:
        return 'task-priority-medium';
      case TaskPriority.LOW:
        return 'task-priority-low';
      default:
        return '';
    }
  };
  
  // 获取任务类型对应的样式
  const getTypeStyle = (type: TaskType) => {
    switch (type) {
      case TaskType.MAIN:
        return 'task-type-main';
      case TaskType.DAILY:
        return 'task-type-daily';
      case TaskType.SIDE:
        return 'task-type-side';
      default:
        return '';
    }
  };
  
  // 获取任务状态对应的样式
  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'task-status-completed';
      case TaskStatus.IN_PROGRESS:
        return 'task-status-in-progress';
      case TaskStatus.TODO:
        return 'task-status-todo';
      case TaskStatus.ARCHIVED:
        return 'task-status-archived';
      default:
        return '';
    }
  };
  
  // 格式化日期显示
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };
  
  // 处理完成任务
  const handleComplete = () => {
    if (onComplete && task.id) {
      onComplete(task.id);
    }
  };
  
  // 处理编辑任务
  const handleEdit = () => {
    if (onEdit && task.id) {
      onEdit(task.id);
    }
  };
  
  // 处理删除任务
  const handleDelete = () => {
    if (onDelete && task.id) {
      onDelete(task.id);
    }
  };
  
  return (
    <div className={`task-card ${getPriorityStyle(task.priority)} ${getStatusStyle(task.status)} ${className}`}>
      <div className="task-card-header">
        <div className={`task-type-badge ${getTypeStyle(task.type)}`}>
          {task.type.toUpperCase()}
        </div>
        <h3 className="task-title">{task.title}</h3>
      </div>
      
      {task.description && (
        <div className="task-description">
          {task.description}
        </div>
      )}
      
      <div className="task-meta">
        {task.dueDate && (
          <div className="task-due-date">
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
        )}
        
        {task.estimatedMinutes && (
          <div className="task-estimated-time">
            <span>Est: {task.estimatedMinutes} min</span>
          </div>
        )}
      </div>
      
      <div className="task-actions">
        {task.status !== TaskStatus.COMPLETED && (
          <button 
            className="task-action-complete jade-button-small"
            onClick={handleComplete}
            aria-label="Complete task"
          >
            完成
          </button>
        )}
        
        <button 
          className="task-action-edit"
          onClick={handleEdit}
          aria-label="Edit task"
        >
          编辑
        </button>
        
        <button 
          className="task-action-delete"
          onClick={handleDelete}
          aria-label="Delete task"
        >
          删除
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
