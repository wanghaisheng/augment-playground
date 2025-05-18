// src/components/tasks/EnhancedTaskDetailDialog.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TaskRecord,
  getTask,
  updateTask,
  completeTask,
  TaskStatus,
  TaskPriority,
  TaskType
} from '@/services/taskService';
import { getTaskCategory } from '@/services/taskCategoryService';
import { getTaskReminders } from '@/services/taskReminderService';
import { hasSubtasks, convertTaskToParentTask } from '@/services/subtaskService';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import TraditionalWindowModal from '@/components/common/TraditionalWindowModal';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SubtaskList from '@/components/tasks/SubtaskList';
import TaskReminderForm from '@/components/task/TaskReminderForm';
import EnhancedTaskForm from './EnhancedTaskForm';
import EnhancedDataLoader from '@/components/common/EnhancedDataLoader';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';
import RewardModal from '@/components/game/RewardModal';

interface EnhancedTaskDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  onTaskUpdated?: () => void;
  onTaskCompleted?: (task: TaskRecord) => void;
  labels?: {
    title?: string;
    tabs?: {
      details?: string;
      subtasks?: string;
      reminders?: string;
    };
    buttons?: {
      complete?: string;
      edit?: string;
      delete?: string;
      addSubtasks?: string;
      addReminder?: string;
      close?: string;
      retry?: string;
    };
    fields?: {
      category?: string;
      priority?: string;
      type?: string;
      dueDate?: string;
      createdAt?: string;
      completedAt?: string;
      description?: string;
    };
    errors?: {
      loadFailed?: string;
      completeFailed?: string;
      notFound?: string;
    };
  };
}

/**
 * 增强版任务详情对话框组件
 * 用于显示任务详情、子任务和提醒，支持多语言和动画
 * 
 * @param isOpen - 是否打开对话框
 * @param onClose - 关闭对话框回调
 * @param taskId - 任务ID
 * @param onTaskUpdated - 任务更新回调
 * @param onTaskCompleted - 任务完成回调
 * @param labels - 本地化标签
 */
const EnhancedTaskDetailDialog: React.FC<EnhancedTaskDetailDialogProps> = ({
  isOpen,
  onClose,
  taskId,
  onTaskUpdated,
  onTaskCompleted,
  labels: propLabels
}) => {
  const [task, setTask] = useState<TaskRecord | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'subtasks' | 'reminders'>('details');
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminders, setReminders] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [rewards, setRewards] = useState<any[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    title: propLabels?.title || componentLabels?.taskDetail?.title || "Task Details",
    tabs: {
      details: propLabels?.tabs?.details || componentLabels?.taskDetail?.tabs?.details || "Details",
      subtasks: propLabels?.tabs?.subtasks || componentLabels?.taskDetail?.tabs?.subtasks || "Subtasks",
      reminders: propLabels?.tabs?.reminders || componentLabels?.taskDetail?.tabs?.reminders || "Reminders"
    },
    buttons: {
      complete: propLabels?.buttons?.complete || componentLabels?.taskDetail?.buttons?.complete || "Complete",
      edit: propLabels?.buttons?.edit || componentLabels?.taskDetail?.buttons?.edit || "Edit",
      delete: propLabels?.buttons?.delete || componentLabels?.taskDetail?.buttons?.delete || "Delete",
      addSubtasks: propLabels?.buttons?.addSubtasks || componentLabels?.taskDetail?.buttons?.addSubtasks || "Add Subtasks",
      addReminder: propLabels?.buttons?.addReminder || componentLabels?.taskDetail?.buttons?.addReminder || "Add Reminder",
      close: propLabels?.buttons?.close || componentLabels?.taskDetail?.buttons?.close || "Close",
      retry: propLabels?.buttons?.retry || componentLabels?.taskDetail?.buttons?.retry || "Retry"
    },
    fields: {
      category: propLabels?.fields?.category || componentLabels?.taskDetail?.fields?.category || "Category",
      priority: propLabels?.fields?.priority || componentLabels?.taskDetail?.fields?.priority || "Priority",
      type: propLabels?.fields?.type || componentLabels?.taskDetail?.fields?.type || "Type",
      dueDate: propLabels?.fields?.dueDate || componentLabels?.taskDetail?.fields?.dueDate || "Due Date",
      createdAt: propLabels?.fields?.createdAt || componentLabels?.taskDetail?.fields?.createdAt || "Created At",
      completedAt: propLabels?.fields?.completedAt || componentLabels?.taskDetail?.fields?.completedAt || "Completed At",
      description: propLabels?.fields?.description || componentLabels?.taskDetail?.fields?.description || "Description"
    },
    errors: {
      loadFailed: propLabels?.errors?.loadFailed || componentLabels?.taskDetail?.errors?.loadFailed || "Failed to load task",
      completeFailed: propLabels?.errors?.completeFailed || componentLabels?.taskDetail?.errors?.completeFailed || "Failed to complete task",
      notFound: propLabels?.errors?.notFound || componentLabels?.taskDetail?.errors?.notFound || "Task not found"
    }
  };

  // 加载任务数据
  const loadTaskData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取任务数据
      const taskData = await getTask(taskId);
      if (taskData) {
        setTask(taskData);

        // 获取任务分类
        if (taskData.categoryId) {
          const category = await getTaskCategory(taskData.categoryId);
          if (category) {
            setCategoryName(category.name);
          }
        }

        // 获取任务提醒
        const taskReminders = await getTaskReminders(taskId);
        setReminders(taskReminders);
      } else {
        setError(labels.errors.notFound);
      }
    } catch (err) {
      console.error('Failed to load task data:', err);
      setError(labels.errors.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (isOpen && taskId) {
      loadTaskData();
    }
  }, [isOpen, taskId]);

  // 注册数据刷新监听
  useRegisterTableRefresh('tasks', loadTaskData);
  useRegisterTableRefresh('subtasks', loadTaskData);
  useRegisterTableRefresh('taskReminders', loadTaskData);

  // 处理完成任务
  const handleCompleteTask = async () => {
    if (!task || !task.id) return;

    try {
      setIsCompleting(true);
      setError(null);

      // 完成任务
      const result = await completeTask(task.id);

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 显示奖励
      if (result.rewards && result.rewards.length > 0) {
        setRewards(result.rewards);
        setShowRewardModal(true);
      }

      // 刷新任务数据
      await loadTaskData();

      // 通知父组件
      if (onTaskCompleted && task) {
        onTaskCompleted(task);
      }

      // 通知任务更新
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
      setError(labels.errors.completeFailed);
    } finally {
      setIsCompleting(false);
    }
  };

  // 处理编辑任务
  const handleEditTask = () => {
    setIsEditing(true);
  };

  // 处理任务更新
  const handleTaskFormSubmit = async (updatedTask: Partial<TaskRecord>) => {
    if (!task || !task.id) return;

    try {
      // 更新任务
      await updateTask(task.id, updatedTask);

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.3);

      // 刷新任务数据
      await loadTaskData();

      // 退出编辑模式
      setIsEditing(false);

      // 通知任务更新
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  // 处理提醒创建
  const handleReminderCreated = async () => {
    // 关闭提醒表单
    setShowReminderForm(false);

    // 刷新任务数据
    await loadTaskData();

    // 通知任务更新
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  // 关闭奖励模态框
  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    setRewards([]);
  };

  // 获取优先级文本
  const getPriorityText = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW: return "Low";
      case TaskPriority.MEDIUM: return "Medium";
      case TaskPriority.HIGH: return "High";
      case TaskPriority.URGENT: return "Urgent";
      default: return "Unknown";
    }
  };

  // 获取任务类型文本
  const getTypeText = (type: TaskType) => {
    switch (type) {
      case TaskType.DAILY: return "Daily";
      case TaskType.WEEKLY: return "Weekly";
      case TaskType.MONTHLY: return "Monthly";
      case TaskType.ONE_TIME: return "One-time";
      default: return "Unknown";
    }
  };

  // 渲染任务详情
  const renderTaskDetails = () => {
    if (!task) return null;

    return (
      <div className="task-details">
        <div className="task-info grid grid-cols-2 gap-4 mb-4">
          {categoryName && (
            <div className="task-category">
              <h4 className="text-sm font-bold text-gray-600">{labels.fields.category}</h4>
              <p>{categoryName}</p>
            </div>
          )}
          <div className="task-priority">
            <h4 className="text-sm font-bold text-gray-600">{labels.fields.priority}</h4>
            <p>{getPriorityText(task.priority)}</p>
          </div>
          <div className="task-type">
            <h4 className="text-sm font-bold text-gray-600">{labels.fields.type}</h4>
            <p>{getTypeText(task.type)}</p>
          </div>
          {task.dueDate && (
            <div className="task-due-date">
              <h4 className="text-sm font-bold text-gray-600">{labels.fields.dueDate}</h4>
              <p>{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          )}
          <div className="task-created-at">
            <h4 className="text-sm font-bold text-gray-600">{labels.fields.createdAt}</h4>
            <p>{new Date(task.createdAt).toLocaleDateString()}</p>
          </div>
          {task.completedAt && (
            <div className="task-completed-at">
              <h4 className="text-sm font-bold text-gray-600">{labels.fields.completedAt}</h4>
              <p>{new Date(task.completedAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {task.description && (
          <div className="task-description mb-4">
            <h4 className="text-sm font-bold text-gray-600 mb-1">{labels.fields.description}</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        <div className="task-actions flex justify-end gap-2 mt-4">
          {task.status !== TaskStatus.COMPLETED && (
            <Button
              variant="jade"
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
          <Button
            variant="secondary"
            onClick={handleEditTask}
          >
            {labels.buttons.edit}
          </Button>
        </div>
      </div>
    );
  };

  // 渲染子任务
  const renderSubtasks = () => {
    if (!task || !task.id) return null;

    return (
      <div className="task-subtasks">
        <SubtaskList parentTaskId={task.id} />
      </div>
    );
  };

  // 渲染提醒
  const renderReminders = () => {
    if (!task || !task.id) return null;

    return (
      <div className="task-reminders">
        {reminders.length > 0 ? (
          <div className="reminders-list">
            {reminders.map(reminder => (
              <div key={reminder.id} className="reminder-item p-3 bg-gray-50 rounded-lg mb-2">
                <div className="reminder-time font-medium">
                  {new Date(reminder.reminderTime).toLocaleString()}
                </div>
                {reminder.message && (
                  <div className="reminder-message text-sm text-gray-600 mt-1">
                    {reminder.message}
                  </div>
                )}
                <div className="reminder-status text-xs text-gray-500 mt-1">
                  {reminder.isCompleted ? "Completed" : "Pending"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reminders text-center p-4">
            <p className="text-gray-500">No reminders set for this task</p>
          </div>
        )}

        <div className="reminder-actions flex justify-end mt-4">
          <Button
            variant="jade"
            onClick={() => setShowReminderForm(true)}
          >
            {labels.buttons.addReminder}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <TraditionalWindowModal
        isOpen={isOpen}
        onClose={onClose}
        title={labels.title}
        closeOnOutsideClick={!isCompleting && !isEditing}
        closeOnEsc={!isCompleting && !isEditing}
        showCloseButton={!isCompleting && !isEditing}
        size="large"
      >
        <EnhancedDataLoader
          isLoading={isLoading}
          isError={!!error}
          error={error}
          data={task}
          onRetry={loadTaskData}
          skeletonVariant="jade"
          skeletonLayout="list"
          skeletonCount={4}
        >
          {(task) => (
            <div className="enhanced-task-detail p-4">
              {isEditing ? (
                <EnhancedTaskForm
                  initialTask={task}
                  onSubmit={handleTaskFormSubmit}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <OptimizedAnimatedContainer priority="high">
                  <h2 className="text-xl font-bold mb-4">{task.title}</h2>

                  {/* 选项卡 */}
                  <div className="tabs-container mb-4">
                    <div className="tabs flex border-b border-gray-200">
                      <button
                        className={`tab-button py-2 px-4 ${
                          activeTab === 'details' ? 'border-b-2 border-jade-500 text-jade-600' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('details')}
                      >
                        {labels.tabs.details}
                      </button>
                      <button
                        className={`tab-button py-2 px-4 ${
                          activeTab === 'subtasks' ? 'border-b-2 border-jade-500 text-jade-600' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('subtasks')}
                      >
                        {labels.tabs.subtasks}
                      </button>
                      <button
                        className={`tab-button py-2 px-4 ${
                          activeTab === 'reminders' ? 'border-b-2 border-jade-500 text-jade-600' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('reminders')}
                      >
                        {labels.tabs.reminders}
                      </button>
                    </div>
                  </div>

                  {/* 选项卡内容 */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'details' && renderTaskDetails()}
                      {activeTab === 'subtasks' && renderSubtasks()}
                      {activeTab === 'reminders' && renderReminders()}
                    </motion.div>
                  </AnimatePresence>
                </OptimizedAnimatedContainer>
              )}
            </div>
          )}
        </EnhancedDataLoader>
      </TraditionalWindowModal>

      {/* 提醒表单 */}
      {showReminderForm && task && (
        <TaskReminderForm
          isOpen={showReminderForm}
          onClose={() => setShowReminderForm(false)}
          taskId={task.id!}
          onReminderCreated={handleReminderCreated}
        />
      )}

      {/* 奖励模态框 */}
      {showRewardModal && (
        <RewardModal
          isOpen={showRewardModal}
          onClose={handleCloseRewardModal}
          rewards={rewards}
        />
      )}
    </>
  );
};

export default EnhancedTaskDetailDialog;
