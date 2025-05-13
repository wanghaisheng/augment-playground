// src/components/animation/AnimatedTaskList.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
import { RewardRecord } from '@/services/rewardService';
import { useTableRefresh } from '@/hooks/useDataRefresh';
import { TimelyRewardRecord } from '@/services/timelyRewardService';
import AnimatedContainer from './AnimatedContainer';
import AnimatedTaskCard from './AnimatedTaskCard';
import AnimatedButton from './AnimatedButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RewardModal from '@/components/game/RewardModal';
import TimelyRewardCard from '@/components/game/TimelyRewardCard';
import { createContainerVariants } from '@/utils/animation';

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

  // 加载任务
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const taskList = await getAllTasks(filter);
      setTasks(taskList);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('加载任务失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  // 初始加载和刷新触发器变化时加载任务
  useEffect(() => {
    loadTasks();
  }, [loadTasks, refreshTrigger]);

  // 使用 useTableRefresh 监听任务表的变化
  useTableRefresh('tasks', (taskData) => {
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
          if (!filter ||
              ((!filter.status || taskData.status === filter.status) &&
               (!filter.categoryId || taskData.categoryId === filter.categoryId) &&
               (!filter.type || taskData.type === filter.type) &&
               (!filter.priority || taskData.priority === filter.priority))) {
            return [...prevTasks, taskData];
          }
          return prevTasks;
        }
      });
    } else {
      // 如果没有特定任务数据，则重新加载所有任务
      loadTasks();
    }
  });

  // 处理完成任务
  const handleCompleteTask = async (taskId: number) => {
    try {
      setIsLoading(true);

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

      // 显示奖励
      if (result.rewards && result.rewards.length > 0) {
        setRewards(result.rewards);
        setShowRewardModal(true);
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
          setShowTimelyReward(true);
        }
      }
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

      // 不需要手动更新任务列表，数据同步服务会自动触发更新
      // 但为了UI立即响应，我们仍然更新本地状态
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('删除任务失败，请重试');
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
    return <LoadingSpinner variant="jade" text="加载任务中..." />;
  }

  if (error) {
    return (
      <div className="task-list-error">
        <p>{error}</p>
        <AnimatedButton variant="jade" onClick={() => window.location.reload()}>
          重试
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
        <p>暂无任务</p>
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

      {/* 及时奖励模态框 */}
      {showTimelyReward && timelyReward && (
        <div className="timely-reward-modal">
          <div className="timely-reward-modal-backdrop" onClick={handleCloseTimelyReward}></div>
          <div className="timely-reward-modal-content">
            <h3 className="timely-reward-modal-title">及时奖励</h3>
            <p className="timely-reward-modal-description">
              恭喜！你在规定时间内完成了任务，获得了及时奖励！
            </p>
            <TimelyRewardCard
              reward={timelyReward}
              onComplete={() => {}}
            />
            <div className="timely-reward-modal-actions">
              <AnimatedButton onClick={handleCloseTimelyReward}>
                关闭
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedTaskList;
