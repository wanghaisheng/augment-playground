// src/features/tasks/TaskManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  TaskRecord,
  TaskStatus,
  TaskPriority,
  TaskType,
  createTask,
  updateTask,
  getAllTasks,
  initializeTaskCategories
} from '@/services/taskService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import TaskForm from '@/components/game/TaskForm';
import AnimatedTaskList from '@/components/animation/AnimatedTaskList';
import AnimatedButton from '@/components/animation/AnimatedButton';
import PageTransition from '@/components/animation/PageTransition';

interface TaskManagerLabels {
  sectionTitle?: string;
  createTaskButton?: string;
  filterAllLabel?: string;
  filterTodoLabel?: string;
  filterInProgressLabel?: string;
  filterCompletedLabel?: string;
  noTasksMessage?: string;
  taskForm?: {
    title?: {
      create?: string;
      edit?: string;
    };
    fields?: {
      titleLabel?: string;
      titlePlaceholder?: string;
      titleRequired?: string;
      descriptionLabel?: string;
      descriptionPlaceholder?: string;
      categoryLabel?: string;
      categoryPlaceholder?: string;
      categoryRequired?: string;
      typeLabel?: string;
      priorityLabel?: string;
      dueDateLabel?: string;
      estimatedTimeLabel?: string;
      estimatedTimePlaceholder?: string;
    };
    types?: {
      daily?: string;
      main?: string;
      side?: string;
    };
    priorities?: {
      low?: string;
      medium?: string;
      high?: string;
    };
    buttons?: {
      create?: string;
      save?: string;
      cancel?: string;
    };
  };
}

interface TaskManagerProps {
  labels?: TaskManagerLabels;
}

/**
 * 任务管理器组件，包含任务列表和任务表单
 */
const TaskManager: React.FC<TaskManagerProps> = ({ labels }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 默认标签
  const defaultLabels: TaskManagerLabels = {
    sectionTitle: '任务管理',
    createTaskButton: '创建新任务',
    filterAllLabel: '全部',
    filterTodoLabel: '待办',
    filterInProgressLabel: '进行中',
    filterCompletedLabel: '已完成',
    noTasksMessage: '暂无任务'
  };

  // 合并标签
  const mergedLabels = { ...defaultLabels, ...labels };

  // 使用 useRef 来避免依赖变化
  const setRefreshTriggerRef = React.useRef(setRefreshTrigger);

  // 更新 ref 当依赖变化时
  React.useEffect(() => {
    setRefreshTriggerRef.current = setRefreshTrigger;
  }, [setRefreshTrigger]);

  // 使用稳定的回调函数，不依赖于 setRefreshTrigger
  const handleDataRefresh = useCallback(() => {
    // 只需要触发刷新，不需要重新获取所有数据
    setRefreshTriggerRef.current(prev => prev + 1);
  }, []); // 没有依赖项，使用 ref 来获取最新值

  // 使用 useRegisterTableRefresh 监听 'tasks' 表的数据刷新
  useRegisterTableRefresh('tasks', handleDataRefresh);

  // 初始化任务类别
  useEffect(() => {
    initializeTaskCategories();
  }, []);

  // 处理创建任务
  const handleCreateTask = async (taskData: Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      await createTask(taskData);
      setShowForm(false);
      // 不需要手动触发刷新，数据同步服务会自动触发
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('创建任务失败，请重试');
    }
  };

  // 处理更新任务
  const handleUpdateTask = async (taskData: Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    if (!editingTask?.id) return;

    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowForm(false);
      // 不需要手动触发刷新，数据同步服务会自动触发
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('更新任务失败，请重试');
    }
  };

  // 处理编辑任务
  const handleEditTask = async (taskId: number) => {
    try {
      const tasks = await getAllTasks();
      const task = tasks.find(t => t.id === taskId);

      if (task) {
        setEditingTask(task);
        setShowForm(true);
      }
    } catch (error) {
      console.error('Failed to get task for editing:', error);
      alert('获取任务详情失败，请重试');
    }
  };

  // 处理取消表单
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <PageTransition className="task-manager">
      <div className="task-manager-header">
        <h2>{mergedLabels.sectionTitle}</h2>

        {!showForm && (
          <AnimatedButton
            variant="jade"
            onClick={() => setShowForm(true)}
          >
            {mergedLabels.createTaskButton}
          </AnimatedButton>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <PageTransition key="task-form">
            <TaskForm
              initialTask={editingTask || {}}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleCancelForm}
              labels={mergedLabels.taskForm}
            />
          </PageTransition>
        ) : (
          <PageTransition key="task-list">
            <div className="task-filter-tabs">
              <button
                className={statusFilter === undefined ? 'active' : ''}
                onClick={() => setStatusFilter(undefined)}
              >
                {mergedLabels.filterAllLabel}
              </button>
              <button
                className={statusFilter === TaskStatus.TODO ? 'active' : ''}
                onClick={() => setStatusFilter(TaskStatus.TODO)}
              >
                {mergedLabels.filterTodoLabel}
              </button>
              <button
                className={statusFilter === TaskStatus.IN_PROGRESS ? 'active' : ''}
                onClick={() => setStatusFilter(TaskStatus.IN_PROGRESS)}
              >
                {mergedLabels.filterInProgressLabel}
              </button>
              <button
                className={statusFilter === TaskStatus.COMPLETED ? 'active' : ''}
                onClick={() => setStatusFilter(TaskStatus.COMPLETED)}
              >
                {mergedLabels.filterCompletedLabel}
              </button>
            </div>

            <AnimatedTaskList
              onEditTask={handleEditTask}
              filter={{ status: statusFilter }}
              refreshTrigger={refreshTrigger}
            />
          </PageTransition>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default TaskManager;
