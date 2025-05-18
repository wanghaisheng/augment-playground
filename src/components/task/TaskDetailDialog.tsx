// src/components/task/TaskDetailDialog.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TaskRecord,
  getTask,
  updateTask,
  completeTask,
  TaskStatus,
  TaskPriority
} from '@/services/taskService';
import { getTaskCategory } from '@/services/taskCategoryService';
import { getTaskReminders } from '@/services/taskReminderService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import ScrollDialog from '@/components/game/ScrollDialog';
import SubtaskList from '@/components/tasks/SubtaskList';
import TaskReminderForm from '@/components/task/TaskReminderForm';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';

interface TaskDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  onTaskUpdated?: () => void;
  onTaskCompleted?: (task: TaskRecord) => void;
}

/**
 * 任务详情对话框组件
 * 用于显示任务详情、子任务和提醒
 */
const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  isOpen,
  onClose,
  taskId,
  onTaskUpdated,
  onTaskCompleted
}) => {
  const [task, setTask] = useState<TaskRecord | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'subtasks' | 'reminders'>('details');
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminders, setReminders] = useState<any[]>([]);

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
        setError('无法加载任务数据');
      }
    } catch (err) {
      console.error('Failed to load task data:', err);
      setError('加载任务数据失败，请重试');
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
    if (!task) return;

    try {
      setIsCompleting(true);

      // 完成任务
      const completedTask = await completeTask(task.id!);

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 通知父组件
      if (onTaskCompleted && task) {
        onTaskCompleted(task);
      }

      // 关闭对话框
      onClose();
    } catch (err) {
      console.error('Failed to complete task:', err);
      setError('完成任务失败，请重试');
    } finally {
      setIsCompleting(false);
    }
  };

  // 处理更新任务优先级
  const handleUpdatePriority = async (priority: TaskPriority) => {
    if (!task) return;

    try {
      // 更新任务
      await updateTask(task.id!, { priority });

      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.3);

      // 重新加载任务数据
      await loadTaskData();

      // 通知父组件
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      console.error('Failed to update task priority:', err);
      setError('更新任务优先级失败，请重试');
    }
  };

  // 处理创建提醒
  const handleCreateReminder = () => {
    setShowReminderForm(true);
  };

  // 处理提醒创建完成
  const handleReminderCreated = () => {
    // 重新加载任务数据
    loadTaskData();

    // 通知父组件
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  // 获取优先级标签和样式
  const getPriorityInfo = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return { label: '高', className: 'bg-red-100 text-red-800' };
      case TaskPriority.MEDIUM:
        return { label: '中', className: 'bg-yellow-100 text-yellow-800' };
      case TaskPriority.LOW:
        return { label: '低', className: 'bg-green-100 text-green-800' };
      default:
        return { label: '未知', className: 'bg-gray-100 text-gray-800' };
    }
  };

  // 渲染任务详情
  const renderTaskDetails = () => {
    if (!task) return null;

    return (
      <div className="task-details">
        <div className="task-header mb-4">
          <div className="task-meta flex flex-wrap gap-2 mb-2">
            {task.categoryId && (
              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                {categoryName}
              </span>
            )}
            <span className={`px-2 py-1 rounded-full text-xs ${getPriorityInfo(task.priority).className}`}>
              {getPriorityInfo(task.priority).label}优先级
            </span>
            {task.dueDate && (
              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                截止日期: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold">{task.title}</h3>

          {task.description && (
            <div className="task-description mt-2">
              <p className="text-gray-700">{task.description}</p>
            </div>
          )}
        </div>

        <div className="task-actions mb-4">
          <h3 className="text-md font-bold mb-2">任务操作</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="jade"
              onClick={handleCompleteTask}
              disabled={isCompleting || task.status === TaskStatus.COMPLETED}
            >
              {isCompleting ? (
                <LoadingSpinner variant="white" size="small" />
              ) : (
                task.status === TaskStatus.COMPLETED ? '已完成' : '完成任务'
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={handleCreateReminder}
            >
              创建提醒
            </Button>
          </div>
        </div>

        <div className="priority-selector mb-4">
          <h3 className="text-md font-bold mb-2">调整优先级</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`p-2 rounded-md ${
                task.priority === TaskPriority.LOW ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-800 border border-gray-300'
              }`}
              onClick={() => handleUpdatePriority(TaskPriority.LOW)}
            >
              低
            </button>
            <button
              className={`p-2 rounded-md ${
                task.priority === TaskPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-gray-100 text-gray-800 border border-gray-300'
              }`}
              onClick={() => handleUpdatePriority(TaskPriority.MEDIUM)}
            >
              中
            </button>
            <button
              className={`p-2 rounded-md ${
                task.priority === TaskPriority.HIGH ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gray-100 text-gray-800 border border-gray-300'
              }`}
              onClick={() => handleUpdatePriority(TaskPriority.HIGH)}
            >
              高
            </button>
          </div>
        </div>

        <div className="task-dates">
          <div className="text-sm text-gray-500">
            <p>创建时间: {new Date(task.createdAt).toLocaleString()}</p>
            {task.updatedAt && (
              <p>更新时间: {new Date(task.updatedAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 渲染子任务
  const renderSubtasks = () => {
    if (!task) return null;

    return (
      <div className="task-subtasks">
        <SubtaskList
          parentTaskId={task.id!}
        />
      </div>
    );
  };

  // 渲染提醒
  const renderReminders = () => {
    if (!task) return null;

    return (
      <div className="task-reminders">
        <div className="reminders-header flex justify-between items-center mb-4">
          <h3 className="text-md font-bold">任务提醒</h3>
          <Button
            variant="jade"
            size="small"
            onClick={handleCreateReminder}
          >
            添加提醒
          </Button>
        </div>

        {reminders.length === 0 ? (
          <div className="no-reminders text-center p-4 bg-gray-50 rounded-md">
            <p className="text-gray-500">暂无提醒</p>
          </div>
        ) : (
          <div className="reminders-list">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="reminder-item p-3 border-b border-gray-200 last:border-b-0"
              >
                <div className="reminder-time font-medium mb-1">
                  {new Date(reminder.reminderTime).toLocaleString()}
                </div>
                <div className="reminder-message text-gray-700 mb-1">
                  {reminder.message || '任务提醒'}
                </div>
                <div className="reminder-status flex gap-2">
                  {reminder.isViewed && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full">
                      已查看
                    </span>
                  )}
                  {reminder.isCompleted && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                      已完成
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <ScrollDialog
        isOpen={isOpen}
        onClose={onClose}
        title="任务详情"
        closeOnOutsideClick={!isCompleting}
        closeOnEsc={!isCompleting}
        showCloseButton={!isCompleting}
      >
        <div className="task-detail-dialog p-4">
          {isLoading ? (
            <div className="loading-container flex justify-center items-center h-32">
              <LoadingSpinner variant="jade" size="medium" />
            </div>
          ) : error ? (
            <div className="error-container text-center p-4">
              <div className="error-message text-red-500 mb-4">{error}</div>
              <Button variant="jade" onClick={loadTaskData}>
                重试
              </Button>
            </div>
          ) : task ? (
            <div className="task-content">
              {/* 选项卡 */}
              <div className="tabs-container mb-4">
                <div className="tabs flex border-b border-gray-200">
                  <button
                    className={`tab-button py-2 px-4 ${
                      activeTab === 'details' ? 'border-b-2 border-jade-500 text-jade-600 font-medium' : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('details')}
                  >
                    详情
                  </button>
                  <button
                    className={`tab-button py-2 px-4 ${
                      activeTab === 'subtasks' ? 'border-b-2 border-jade-500 text-jade-600 font-medium' : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('subtasks')}
                  >
                    子任务
                  </button>
                  <button
                    className={`tab-button py-2 px-4 ${
                      activeTab === 'reminders' ? 'border-b-2 border-jade-500 text-jade-600 font-medium' : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('reminders')}
                  >
                    提醒
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
            </div>
          ) : (
            <div className="not-found-container text-center p-4">
              <p className="text-gray-500">任务不存在或已被删除</p>
            </div>
          )}
        </div>
      </ScrollDialog>

      {/* 提醒表单 */}
      {showReminderForm && task && (
        <TaskReminderForm
          isOpen={showReminderForm}
          onClose={() => setShowReminderForm(false)}
          taskId={task.id!}
          onReminderCreated={handleReminderCreated}
        />
      )}
    </>
  );
};

export default TaskDetailDialog;
