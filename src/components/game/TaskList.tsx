// src/components/game/TaskList.tsx
import React, { useState, useEffect } from 'react';
import {
  TaskRecord,
  TaskStatus,
  TaskPriority,
  TaskType,
  TaskCategoryRecord,
  getAllTasks,
  getAllTaskCategories,
  completeTask,
  deleteTask
} from '@/services/taskService';
import TaskCard from './TaskCard';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TaskListProps {
  onEditTask: (taskId: number) => void;
  filter?: {
    status?: TaskStatus;
    categoryId?: number;
    type?: TaskType;
    priority?: TaskPriority;
  };
  refreshTrigger?: number; // 用于触发刷新的值
}

/**
 * 任务列表组件，显示任务卡片列表
 */
const TaskList: React.FC<TaskListProps> = ({
  onEditTask,
  filter,
  refreshTrigger = 0
}) => {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [categories, setCategories] = useState<Record<number, TaskCategoryRecord>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载任务和类别
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 加载任务
        const taskList = await getAllTasks(filter);
        setTasks(taskList);

        // 加载类别
        const categoryList = await getAllTaskCategories();
        const categoryMap: Record<number, TaskCategoryRecord> = {};
        categoryList.forEach(category => {
          if (category.id) {
            categoryMap[category.id] = category;
          }
        });
        setCategories(categoryMap);
      } catch (err) {
        console.error('Failed to load tasks:', err);
        setError('加载任务失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filter, refreshTrigger]);

  // 处理完成任务
  const handleCompleteTask = async (taskId: number) => {
    try {
      setIsLoading(true);
      await completeTask(taskId);

      // 更新任务列表
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? { ...task, status: TaskStatus.COMPLETED, completedAt: new Date() }
            : task
        )
      );
    } catch (err) {
      console.error('Failed to complete task:', err);
      setError('完成任务失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理删除任务
  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('确定要删除这个任务吗？')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteTask(taskId);

      // 更新任务列表
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('删除任务失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取任务类别名称
  const getCategoryName = (categoryId: number) => {
    return categories[categoryId]?.name || '未分类';
  };

  // 按优先级排序任务
  const sortedTasks = [...tasks].sort((a, b) => {
    // 首先按状态排序（未完成的在前）
    if (a.status !== b.status) {
      if (a.status === TaskStatus.COMPLETED) return 1;
      if (b.status === TaskStatus.COMPLETED) return -1;
    }

    // 然后按优先级排序
    const priorityOrder = {
      [TaskPriority.HIGH]: 0,
      [TaskPriority.MEDIUM]: 1,
      [TaskPriority.LOW]: 2
    };

    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (isLoading && tasks.length === 0) {
    return <LoadingSpinner variant="jade" text="加载任务中..." />;
  }

  if (error) {
    return (
      <div className="task-list-error">
        <p>{error}</p>
        <Button variant="jade" onClick={() => window.location.reload()}>
          重试
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>暂无任务</p>
      </div>
    );
  }

  // 处理任务更新
  const handleTaskUpdated = async () => {
    try {
      setIsLoading(true);
      const taskList = await getAllTasks(filter);
      setTasks(taskList);
    } catch (err) {
      console.error('Failed to reload tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-list">
      {isLoading && (
        <div className="task-list-loading-overlay">
          <LoadingSpinner variant="jade" />
        </div>
      )}

      {sortedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={handleCompleteTask}
          onEdit={onEditTask}
          onDelete={handleDeleteTask}
          onTaskUpdated={handleTaskUpdated}
        />
      ))}
    </div>
  );
};

export default TaskList;
