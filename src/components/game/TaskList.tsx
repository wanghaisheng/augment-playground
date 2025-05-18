/**
 * @deprecated 此组件已废弃，请使用 EnhancedTaskList 组件代替。
 * 此组件将在下一个主要版本中移除。
 *
 * EnhancedTaskList 提供了以下优势：
 * 1. 与数据刷新机制集成，自动响应数据变化
 * 2. 支持骨架屏加载，提供更好的用户体验
 * 3. 支持任务完成动画和奖励显示
 * 4. 支持多语言和自定义标签
 * 5. 使用优化的动画容器，提供更流畅的动画效果
 */

import React from 'react';
import {
  TaskStatus,
  TaskPriority,
  TaskType
} from '@/services/taskService';
import EnhancedTaskList from '@/components/tasks/EnhancedTaskList';

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
 *
 * @deprecated 此组件已废弃，请使用 EnhancedTaskList 组件代替。
 */
const TaskList: React.FC<TaskListProps> = ({
  onEditTask,
  filter,
  refreshTrigger = 0
}) => {
  // 使用 EnhancedTaskList 实现
  return (
    <EnhancedTaskList
      onEditTask={onEditTask}
      filter={filter}
      refreshTrigger={refreshTrigger}
    />
  );
};

export default TaskList;
