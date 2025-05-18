// src/components/tasks/EnhancedTaskList.tsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  TaskRecord,
  TaskStatus,
  TaskPriority,
  TaskType,
  getAllTasks,
  completeTask,
  deleteTask
} from '@/services/taskService';
import { getTaskCategory } from '@/services/taskCategoryService';
import { RewardRecord } from '@/services/rewardService';
import { TimelyRewardRecord } from '@/services/timelyRewardService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';
import EnhancedTaskCard from './EnhancedTaskCard';
import EnhancedDataLoader from '@/components/common/EnhancedDataLoader';
import Button from '@/components/common/Button';
import RewardModal from '@/components/game/RewardModal';
import TimelyRewardCard from '@/components/game/TimelyRewardCard';
import TaskCompletionAnimation from '@/components/animation/TaskCompletionAnimation';
import { createContainerVariants } from '@/utils/animation';
import { TaskCardSkeleton } from '@/components/skeleton';

interface EnhancedTaskListProps {
  onEditTask: (taskId: number) => void;
  filter?: {
    status?: TaskStatus;
    categoryId?: number;
    type?: TaskType;
    priority?: TaskPriority;
  };
  refreshTrigger?: number;
  className?: string;
  emptyStateComponent?: React.ReactNode;
  errorStateComponent?: React.ReactNode;
  showCompletionAnimation?: boolean;
  showRewards?: boolean;
  showTimelyRewards?: boolean;
  labels?: {
    emptyState?: string;
    errorState?: string;
    retryButton?: string;
  };
}

/**
 * 增强版任务列表组件
 * 提供更丰富的功能和更好的用户体验
 *
 * @param onEditTask - 编辑任务回调
 * @param filter - 过滤条件
 * @param refreshTrigger - 刷新触发器
 * @param className - 自定义类名
 * @param emptyStateComponent - 自定义空状态组件
 * @param errorStateComponent - 自定义错误状态组件
 * @param showCompletionAnimation - 是否显示任务完成动画
 * @param showRewards - 是否显示奖励
 * @param showTimelyRewards - 是否显示定时奖励
 * @param labels - 本地化标签
 */
const EnhancedTaskList: React.FC<EnhancedTaskListProps> = ({
  onEditTask,
  filter,
  refreshTrigger = 0,
  className = '',
  emptyStateComponent,
  errorStateComponent,
  showCompletionAnimation = true,
  showRewards = true,
  showTimelyRewards = true,
  labels
}) => {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [timelyReward, setTimelyReward] = useState<TimelyRewardRecord | null>(null);
  const [showTimelyReward, setShowTimelyReward] = useState(false);
  const [completedTask, setCompletedTask] = useState<TaskRecord | null>(null);
  const [showCompletionAnim, setShowCompletionAnim] = useState(false);
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const localizedLabels = {
    emptyState: labels?.emptyState || componentLabels?.taskList?.emptyState || "No tasks available",
    errorState: labels?.errorState || componentLabels?.taskList?.errorState || "Failed to load tasks",
    retryButton: labels?.retryButton || componentLabels?.taskList?.retryButton || "Retry"
  };

  // 加载任务
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const taskList = await getAllTasks(filter);
      setTasks(taskList);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载和刷新触发
  useEffect(() => {
    loadTasks();
  }, [filter, refreshTrigger]);

  // 注册数据刷新监听
  useRegisterTableRefresh('tasks', loadTasks);
  useRegisterTableRefresh('taskCompletions', loadTasks);

  // 处理完成任务
  const handleCompleteTask = async (taskId: number) => {
    try {
      // 查找任务
      const taskToComplete = tasks.find(t => t.id === taskId);
      if (!taskToComplete) return;

      // 完成任务
      const result = await completeTask(taskId);

      // 显示完成动画
      if (showCompletionAnimation) {
        setCompletedTask(taskToComplete);
        setShowCompletionAnim(true);
      }

      // 显示奖励
      if (showRewards && result.rewards && result.rewards.length > 0) {
        setRewards(result.rewards);
        setShowRewardModal(true);
      }

      // 显示定时奖励
      if (showTimelyRewards && result.timelyReward) {
        setTimelyReward(result.timelyReward);
        setShowTimelyReward(true);
      }

      // 刷新任务列表
      await loadTasks();
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  // 处理删除任务
  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      await loadTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // 关闭奖励模态框
  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    setRewards([]);
  };

  // 关闭定时奖励
  const handleCloseTimelyReward = () => {
    setShowTimelyReward(false);
    setTimelyReward(null);
  };

  // 关闭完成动画
  const handleCompletionAnimEnd = () => {
    setShowCompletionAnim(false);
    setCompletedTask(null);
  };

  // 排序任务
  const sortedTasks = [...tasks].sort((a, b) => {
    // 首先按状态排序（未完成在前）
    if (a.status !== b.status) {
      return a.status === TaskStatus.COMPLETED ? 1 : -1;
    }
    
    // 然后按优先级排序（高优先级在前）
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    
    // 最后按截止日期排序（近期在前）
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }
    
    // 如果都没有截止日期，按创建时间排序
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // 渲染任务列表
  return (
    <div className={`enhanced-task-list ${className}`}>
      <EnhancedDataLoader
        isLoading={isLoading}
        isError={!!error}
        error={error}
        data={sortedTasks}
        loadingText="Loading tasks..."
        errorTitle={localizedLabels.errorState}
        onRetry={loadTasks}
        emptyState={emptyStateComponent || (
          <div className="task-list-empty text-center p-4">
            <p className="text-gray-500">{localizedLabels.emptyState}</p>
          </div>
        )}
        errorComponent={errorStateComponent}
        skeletonComponent={
          <div className="task-list-skeleton">
            {[...Array(3)].map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        }
        skeletonCount={3}
        skeletonVariant="jade"
      >
        {(tasks) => (
          <>
            <OptimizedAnimatedContainer
              variants={createContainerVariants(0.05, 0)}
              className="task-list-container"
              priority="high"
            >
              <AnimatePresence mode="popLayout">
                {sortedTasks.map((task, index) => (
                  <EnhancedTaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onComplete={handleCompleteTask}
                    onEdit={onEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </AnimatePresence>
            </OptimizedAnimatedContainer>

            {/* 任务完成动画 */}
            {showCompletionAnim && completedTask && (
              <TaskCompletionAnimation
                task={completedTask}
                onAnimationComplete={handleCompletionAnimEnd}
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

            {/* 定时奖励 */}
            {showTimelyReward && timelyReward && (
              <TimelyRewardCard
                reward={timelyReward}
                onClose={handleCloseTimelyReward}
              />
            )}
          </>
        )}
      </EnhancedDataLoader>
    </div>
  );
};

export default EnhancedTaskList;
