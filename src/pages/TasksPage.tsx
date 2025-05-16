// src/pages/TasksPage.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchTasksPageView } from '@/services';
import TaskManager from '@/features/tasks/TaskManager';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { pageTransition } from '@/utils/animation';
import type { TasksPageViewLabelsBundle } from '@/types';
import TaskReminderNotification from '@/components/task/TaskReminderNotification';
import { checkDueSoonTasks, checkOverdueTasks } from '@/services/taskReminderService';
import { TasksPageSkeleton } from '@/components/skeleton';

const TasksPage: React.FC = () => {
  const {
    labels: pageLabels, isPending, isError, error, refetch
  } = useLocalizedView<null, TasksPageViewLabelsBundle>(
    'tasksPageViewContent',
    fetchTasksPageView
  );

  // 检查任务提醒
  useEffect(() => {
    const checkReminders = async () => {
      try {
        // 检查即将到期的任务
        await checkDueSoonTasks();

        // 检查已过期的任务
        await checkOverdueTasks();
      } catch (err) {
        console.error('Failed to check task reminders:', err);
      }
    };

    // 立即检查一次
    checkReminders();

    // 设置定时检查（每小时检查一次）
    const intervalId = setInterval(checkReminders, 60 * 60 * 1000);

    // 清理函数
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (isPending) { // 完整页面初始加载
    return (
      <div className="page-container">
        <div className="bamboo-frame">
          <TasksPageSkeleton />
        </div>
      </div>
    );
  }

  if (isError) { // 关键错误：页面标签加载失败
    return (
      <div className="page-content">
        <ErrorDisplay
          error={error}
          title={pageLabels?.errorTitle || "任务页面错误"}
          messageTemplate={pageLabels?.errorMessage || "无法加载任务数据: {message}"}
          onRetry={refetch}
          retryButtonText={pageLabels?.retryButtonText || "重试"}
        />
      </div>
    );
  }

  return (
    <>
      <div className="page-container">
        <div className="bamboo-frame">
          <h2>{pageLabels?.pageTitle || "任务管理"}</h2>

          <TaskManager labels={pageLabels?.taskManager} />
        </div>
      </div>

      {/* 任务提醒通知 */}
      <TaskReminderNotification
        onTaskClick={(taskId) => {
          // 这里可以添加导航到任务详情的逻辑
          console.log('Navigate to task:', taskId);
        }}
      />
    </>
  );
};

export default TasksPage;
