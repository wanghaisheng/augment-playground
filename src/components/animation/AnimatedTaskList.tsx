// src/components/animation/AnimatedTaskList.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
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

// 扩展Window接口，添加全局回调函数
declare global {
  interface Window {
    handleCompletionAnimationEnd?: () => void;
  }
}
import { RewardRecord } from '@/services/rewardService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { TimelyRewardRecord } from '@/services/timelyRewardService';
import AnimatedContainer from './AnimatedContainer';
import AnimatedTaskCard from './AnimatedTaskCard';
import AnimatedButton from './AnimatedButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RewardModal from '@/components/game/RewardModal';
import TimelyRewardCard from '@/components/game/TimelyRewardCard';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import TaskCompletionAnimation from './TaskCompletionAnimation';
import { createContainerVariants } from '@/utils/animation';
import { TaskCardSkeleton } from '@/components/skeleton';

interface AnimatedTaskListProps {
  onEditTask: (taskId: number) => void;
  filter?: {
    status?: TaskStatus;
    categoryId?: number;
    type?: TaskType;
    priority?: TaskPriority;
  };
  refreshTrigger?: number;
}

/**
 * 动画任务列表组件，为任务列表添加动画效果
 *
 * @param onEditTask - 编辑任务回调
 * @param filter - 过滤条件
 * @param refreshTrigger - 刷新触发器
 */
const AnimatedTaskList: React.FC<AnimatedTaskListProps> = ({
  onEditTask,
  filter,
  refreshTrigger = 0
}) => {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [timelyReward, setTimelyReward] = useState<TimelyRewardRecord | null>(null);
  const [showTimelyReward, setShowTimelyReward] = useState(false);
  const [completedTask, setCompletedTask] = useState<TaskRecord | null>(null);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

  // Get localized labels
  const { labels } = useComponentLabels();

  // 加载任务
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const taskList = await getAllTasks(filter);
      setTasks(taskList);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError(labels?.error?.loadingError || 'Failed to load tasks, please try again');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  // 初始加载和刷新触发器变化时加载任务
  useEffect(() => {
    loadTasks();
  }, [loadTasks, refreshTrigger]);

  // 定义任务数据更新处理函数 - 使用 useRef 来避免依赖变化
  const filterRef = useRef(filter);
  const loadTasksRef = useRef(loadTasks);

  // 更新 refs 当依赖变化时
  useEffect(() => {
    filterRef.current = filter;
    loadTasksRef.current = loadTasks;
  }, [filter, loadTasks]);

  // 使用稳定的回调函数，不依赖于 filter 或 loadTasks
  const handleTaskDataUpdate = useCallback((taskData: unknown) => {
    // 使用 ref 值而不是直接依赖
    const currentFilter = filterRef.current;
    const currentLoadTasks = loadTasksRef.current;

    // 如果有特定任务数据，则更新该任务
    if (taskData && taskData.id) {
      setTasks(prevTasks => {
        // 检查任务是否已存在
        const taskExists = prevTasks.some(task => task.id === taskData.id);

        if (taskExists) {
          // 更新现有任务
          return prevTasks.map(task =>
            task.id === taskData.id ? { ...task, ...taskData } : task
          );
        } else {
          // 添加新任务（如果符合过滤条件）
          if (!currentFilter ||
              ((!currentFilter.status || taskData.status === currentFilter.status) &&
               (!currentFilter.categoryId || taskData.categoryId === currentFilter.categoryId) &&
               (!currentFilter.type || taskData.type === currentFilter.type) &&
               (!currentFilter.priority || taskData.priority === currentFilter.priority))) {
            return [...prevTasks, taskData];
          }
          return prevTasks;
        }
      });
    } else {
      // 如果没有特定任务数据，则重新加载所有任务
      currentLoadTasks();
    }
  }, [/* 没有依赖项，使用 ref 来获取最新值 */]);

  // Use useRegisterTableRefresh hook to listen for task table changes
  // Call the hook at the top level. It will manage its own lifecycle.
  useRegisterTableRefresh('tasks', handleTaskDataUpdate);
  // console.log('AnimatedTaskList: Registered table refresh for tasks'); // Optional: for debugging

  // 处理完成任务
  const handleCompleteTask = async (taskId: number) => {
    try {
      setIsLoading(true);

      // 获取要完成的任务
      const taskToComplete = tasks.find(task => task.id === taskId);
      if (!taskToComplete) {
        throw new Error(labels?.error?.taskNotFound || 'Task not found');
      }

      // 先显示任务完成动画
      setCompletedTask(taskToComplete);
      setShowCompletionAnimation(true);

      // 完成任务并获取奖励
      const result = await completeTask(taskId);

      // 不需要手动更新任务列表，数据同步服务会自动触发更新
      // 但为了UI立即响应，我们仍然更新本地状态
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? { ...task, status: TaskStatus.COMPLETED, completedAt: new Date() }
            : task
        )
      );

      // 动画完成后显示奖励
      const handleCompletionAnimationEnd = () => {
        setShowCompletionAnimation(false);

        // 显示奖励
        if (result.rewards && result.rewards.length > 0) {
          setTimeout(() => {
            setRewards(result.rewards);
            setShowRewardModal(true);
          }, 300);
        }

        // 如果有及时奖励，显示及时奖励
        if (result.timelyReward) {
          setTimelyReward(result.timelyReward);

          // 延迟显示及时奖励，先显示任务奖励
          if (result.rewards && result.rewards.length > 0) {
            setTimeout(() => {
              setShowTimelyReward(true);
            }, 1000);
          } else {
            setTimeout(() => {
              setShowTimelyReward(true);
            }, 500);
          }
        }
      };

      // 如果动画已经完成，直接显示奖励
      if (!showCompletionAnimation) {
        handleCompletionAnimationEnd();
      } else {
        // 否则等待动画完成
        window.handleCompletionAnimationEnd = handleCompletionAnimationEnd;
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
      setError(labels?.error?.completeTaskError || 'Failed to complete task, please try again');
      setShowCompletionAnimation(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理删除任务
  const handleDeleteTask = async (taskId: number) => {
    // Convert DeleteConfirmationLabels to string if needed
    const confirmMessage = typeof labels?.deleteConfirmation === 'string'
      ? labels?.deleteConfirmation
      : 'Are you sure you want to delete this task?';
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteTask(taskId);

      // 不需要手动更新任务列表，数据同步服务会自动触发更新
      // 但为了UI立即响应，我们仍然更新本地状态
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(labels?.error?.deleteTaskError || 'Failed to delete task, please try again');
    } finally {
      setIsLoading(false);
    }
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
    return (
      <div className="task-list-skeleton">
        <TaskCardSkeleton variant="jade" />
        <TaskCardSkeleton variant="jade" />
        <TaskCardSkeleton variant="jade" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list-error">
        <p>{error}</p>
        <AnimatedButton variant="jade" onClick={() => window.location.reload()}>
          {labels?.button?.retry || "Retry"}
        </AnimatedButton>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <AnimatedContainer
        variants={createContainerVariants(0.1, 0.2)}
        className="task-list-empty"
      >
        <p>{labels?.emptyState?.noItems || "No tasks available"}</p>
      </AnimatedContainer>
    );
  }

  // 关闭奖励模态框
  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    setRewards([]);

    // 如果有及时奖励，显示及时奖励
    if (timelyReward && !showTimelyReward) {
      setTimeout(() => {
        setShowTimelyReward(true);
      }, 500);
    }
  };

  // 关闭及时奖励
  const handleCloseTimelyReward = () => {
    setShowTimelyReward(false);
    setTimelyReward(null);
  };

  return (
    <div className="task-list">
      {isLoading && (
        <div className="task-list-loading-overlay">
          <LoadingSpinner variant="jade" />
        </div>
      )}

      <AnimatedContainer
        variants={createContainerVariants(0.05, 0)}
      >
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task, index) => (
            <AnimatedTaskCard
              key={task.id}
              task={task}
              index={index}
              onComplete={handleCompleteTask}
              onEdit={onEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </AnimatePresence>
      </AnimatedContainer>

      {/* 奖励模态框 */}
      {showRewardModal && (
        <RewardModal
          isOpen={showRewardModal}
          onClose={handleCloseRewardModal}
          rewards={rewards}
        />
      )}

      {/* Timely reward modal */}
      {showTimelyReward && timelyReward && (
        <div className="timely-reward-modal">
          <div className="timely-reward-modal-backdrop" onClick={handleCloseTimelyReward}></div>
          <div className="timely-reward-modal-content">
            <h3 className="timely-reward-modal-title">{labels?.taskReminder?.title || "Timely Reward"}</h3>
            <p className="timely-reward-modal-description">
              {typeof labels?.timelyRewardCongrats === 'string'
                ? labels?.timelyRewardCongrats
                : "Congratulations! You completed the task in time and earned a timely reward!"}
            </p>
            <TimelyRewardCard
              reward={timelyReward}
              onComplete={() => {}}
              labels={{
                // Use default values for all TimelyRewardCard labels
                typeDaily: "Daily Reward",
                typeMorning: "Early Bird Reward",
                typeStreak: "Streak Reward",
                typeSpecial: "Special Reward",
                statusActive: "Active",
                statusCompleted: "Completed",
                statusExpired: "Expired",
                statusUpcoming: "Upcoming",
                remainingTimeLabel: "Remaining time",
                timeEnded: "Ended",
                hourUnit: "h",
                minuteUnit: "m",
                luckyPointsLabel: "Lucky Points",
                claimRewardButton: "Claim Reward",
                inProgressButton: "In Progress...",
                completedOnLabel: "Completed on"
              }}
            />
            <div className="timely-reward-modal-actions">
              <AnimatedButton onClick={handleCloseTimelyReward}>
                {labels?.modal?.close || "Close"}
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}

      {/* 任务完成动画 */}
      {showCompletionAnimation && completedTask && (
        <TaskCompletionAnimation
          task={completedTask}
          style={completedTask.priority === TaskPriority.HIGH ? 'fireworks' :
                 completedTask.type === TaskType.MAIN ? 'stars' : 'confetti'}
          onAnimationComplete={() => {
            setShowCompletionAnimation(false);
            // 调用全局回调函数（如果存在）
            if (window.handleCompletionAnimationEnd) {
              window.handleCompletionAnimationEnd();
              delete window.handleCompletionAnimationEnd;
            }
          }}
        />
      )}
    </div>
  );
};

export default AnimatedTaskList;
