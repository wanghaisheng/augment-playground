// src/components/game/TaskDetailDialog.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollDialog from './ScrollDialog';
import Button from '@/components/common/Button';
import { TaskRecord, TaskStatus, TaskPriority, TaskType, updateTask, completeTask } from '@/services/taskService';
import { hasSubtasks, convertTaskToParentTask } from '@/services/subtaskService';
import SubtaskList from '@/components/tasks/SubtaskList';
import { playSound, SoundType } from '@/utils/sound';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { RewardRecord } from '@/services/rewardService';
import RewardModal from './RewardModal';

interface TaskDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskRecord;
  onTaskUpdated?: () => void;
}

/**
 * 任务详情对话框组件
 * 用于显示任务详情、管理子任务和完成任务
 */
const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  isOpen,
  onClose,
  task,
  onTaskUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubtasksList, setHasSubtasksList] = useState(false);
  const [isAddingSubtasks, setIsAddingSubtasks] = useState(false);
  const [subtaskTitles, setSubtaskTitles] = useState<string[]>([]);
  const [currentSubtaskTitle, setCurrentSubtaskTitle] = useState('');
  const [isCompletingTask, setIsCompletingTask] = useState(false);
  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);

  // 检查任务是否有子任务
  useEffect(() => {
    const checkSubtasks = async () => {
      if (task && task.id) {
        try {
          const hasSubtasksList = await hasSubtasks(task.id);
          setHasSubtasksList(hasSubtasksList);
        } catch (err) {
          console.error('Failed to check subtasks:', err);
        }
      }
    };

    if (isOpen) {
      checkSubtasks();
    }
  }, [task, isOpen]);

  // 处理添加子任务
  const handleAddSubtask = () => {
    if (!currentSubtaskTitle.trim()) return;
    
    setSubtaskTitles([...subtaskTitles, currentSubtaskTitle.trim()]);
    setCurrentSubtaskTitle('');
  };

  // 处理移除子任务
  const handleRemoveSubtask = (index: number) => {
    const newSubtaskTitles = [...subtaskTitles];
    newSubtaskTitles.splice(index, 1);
    setSubtaskTitles(newSubtaskTitles);
  };

  // 处理转换为带有子任务的任务
  const handleConvertToParentTask = async () => {
    if (subtaskTitles.length === 0) return;

    try {
      setIsAddingSubtasks(true);
      setError(null);
      
      await convertTaskToParentTask(task.id!, subtaskTitles);
      
      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);
      
      // 重置状态
      setSubtaskTitles([]);
      setHasSubtasksList(true);
      
      // 通知父组件任务已更新
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      console.error('Failed to convert task to parent task:', err);
      setError('转换任务失败，请重试');
    } finally {
      setIsAddingSubtasks(false);
    }
  };

  // 处理完成任务
  const handleCompleteTask = async () => {
    try {
      setIsCompletingTask(true);
      setError(null);
      
      // 完成任务
      const result = await completeTask(task.id!);
      
      // 设置奖励
      setRewards(result.rewards);
      
      // 播放成功音效
      playSound(SoundType.TASK_COMPLETE, 0.5);
      
      // 显示奖励模态框
      setShowRewardModal(true);
      
      // 通知父组件任务已更新
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
      setError('完成任务失败，请重试');
    } finally {
      setIsCompletingTask(false);
    }
  };

  // 处理关闭奖励模态框
  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    onClose();
  };

  // 获取任务优先级标签
  const getPriorityLabel = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return '高';
      case TaskPriority.MEDIUM:
        return '中';
      case TaskPriority.LOW:
        return '低';
      default:
        return '未知';
    }
  };

  // 获取任务类型标签
  const getTypeLabel = (type: TaskType): string => {
    switch (type) {
      case TaskType.MAIN:
        return '主线任务';
      case TaskType.DAILY:
        return '日常任务';
      case TaskType.SIDE:
        return '支线任务';
      default:
        return '未知';
    }
  };

  // 获取任务状态标签
  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return '待办';
      case TaskStatus.IN_PROGRESS:
        return '进行中';
      case TaskStatus.COMPLETED:
        return '已完成';
      case TaskStatus.ARCHIVED:
        return '已归档';
      default:
        return '未知';
    }
  };

  return (
    <>
      <ScrollDialog
        isOpen={isOpen}
        onClose={onClose}
        title="任务详情"
        closeOnOutsideClick={!isCompletingTask}
        closeOnEsc={!isCompletingTask}
        showCloseButton={!isCompletingTask}
      >
        <div className="task-detail-content p-4">
          {error && (
            <div className="error-message text-red-500 mb-4">{error}</div>
          )}
          
          <div className="task-header mb-4">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <div className="task-meta flex flex-wrap gap-2 mt-2">
              <span className="task-priority px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                优先级: {getPriorityLabel(task.priority)}
              </span>
              <span className="task-type px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {getTypeLabel(task.type)}
              </span>
              <span className={`task-status px-2 py-1 rounded-full text-xs ${
                task.status === TaskStatus.COMPLETED
                  ? 'bg-green-100 text-green-800'
                  : task.status === TaskStatus.IN_PROGRESS
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {getStatusLabel(task.status)}
              </span>
            </div>
          </div>
          
          {task.description && (
            <div className="task-description mb-4">
              <h3 className="text-lg font-bold mb-1">描述</h3>
              <p className="text-gray-700">{task.description}</p>
            </div>
          )}
          
          {task.dueDate && (
            <div className="task-due-date mb-4">
              <h3 className="text-lg font-bold mb-1">截止日期</h3>
              <p className="text-gray-700">{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          )}
          
          {/* 子任务列表 */}
          {hasSubtasksList && (
            <SubtaskList
              parentTaskId={task.id!}
              onSubtasksChange={setHasSubtasksList}
            />
          )}
          
          {/* 添加子任务表单 */}
          {!hasSubtasksList && task.status !== TaskStatus.COMPLETED && (
            <div className="add-subtasks-section mt-4">
              <h3 className="text-lg font-bold mb-2">添加子任务</h3>
              
              <div className="subtask-input-container mb-2">
                <div className="flex">
                  <input
                    type="text"
                    value={currentSubtaskTitle}
                    onChange={(e) => setCurrentSubtaskTitle(e.target.value)}
                    placeholder="输入子任务标题..."
                    className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-jade-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSubtask();
                      }
                    }}
                  />
                  <Button
                    variant="jade"
                    onClick={handleAddSubtask}
                    disabled={!currentSubtaskTitle.trim()}
                    className="rounded-l-none"
                  >
                    添加
                  </Button>
                </div>
              </div>
              
              {subtaskTitles.length > 0 && (
                <div className="subtask-list-preview mb-4">
                  <h4 className="text-md font-bold mb-1">子任务列表预览</h4>
                  <ul className="list-disc pl-5">
                    {subtaskTitles.map((title, index) => (
                      <li key={index} className="flex items-center justify-between mb-1">
                        <span>{title}</span>
                        <button
                          onClick={() => handleRemoveSubtask(index)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="移除子任务"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant="gold"
                    onClick={handleConvertToParentTask}
                    disabled={isAddingSubtasks || subtaskTitles.length === 0}
                    className="mt-2"
                  >
                    {isAddingSubtasks ? (
                      <LoadingSpinner variant="white" size="small" />
                    ) : (
                      '创建子任务'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* 任务操作按钮 */}
          <div className="task-actions mt-4 flex justify-end">
            {task.status !== TaskStatus.COMPLETED && (
              <Button
                variant="jade"
                onClick={handleCompleteTask}
                disabled={isCompletingTask}
                className="mr-2"
              >
                {isCompletingTask ? (
                  <LoadingSpinner variant="white" size="small" />
                ) : (
                  '完成任务'
                )}
              </Button>
            )}
            
            <Button variant="secondary" onClick={onClose}>
              关闭
            </Button>
          </div>
        </div>
      </ScrollDialog>
      
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

export default TaskDetailDialog;
