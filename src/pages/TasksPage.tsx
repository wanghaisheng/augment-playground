// src/pages/TasksPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchTasksPageView } from '@/services';
import TaskManager from '@/features/tasks/TaskManager';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { pageTransition } from '@/utils/animation';
import type { TasksPageViewLabelsBundle, ApiError } from '@/types';

const TasksPage: React.FC = () => {
  const {
    labels: pageLabels, isPending, isError, error, refetch
  } = useLocalizedView<null, TasksPageViewLabelsBundle>(
    'tasksPageViewContent',
    fetchTasksPageView
  );

  if (isPending && !pageLabels) { // 完整页面初始加载
    return <LoadingSpinner variant="jade" text="加载任务页面内容..." />;
  }

  if (isError && !pageLabels) { // 关键错误：页面标签加载失败
    return (
      <div className="page-content">
        <ErrorDisplay error={error} title="任务页面错误" onRetry={refetch} />
      </div>
    );
  }

  return (
    <motion.div
      className="page-container"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="bamboo-frame">
        <h2>{pageLabels?.pageTitle || "任务管理"}</h2>

        <TaskManager labels={pageLabels?.taskManager} />
      </div>
    </motion.div>
  );
};

export default TasksPage;
