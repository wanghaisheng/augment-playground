// src/components/animation/AnimatedTaskCard.tsx
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import TaskCard from '@/components/game/TaskCard';
import { TaskRecord } from '@/services/taskService';
import { listItem } from '@/utils/animation';
import { useComponentLabels } from '@/hooks/useComponentLabels';

interface AnimatedTaskCardProps {
  task: TaskRecord;
  onComplete?: (taskId: number) => void;
  onEdit?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  index?: number;
  className?: string;
}

/**
 * 动画任务卡片组件，为TaskCard组件添加动画效果
 *
 * @param task - 任务数据
 * @param onComplete - 完成任务回调
 * @param onEdit - 编辑任务回调
 * @param onDelete - 删除任务回调
 * @param index - 索引，用于计算动画延迟
 * @param className - CSS类名
 */
const AnimatedTaskCard = forwardRef<HTMLDivElement, AnimatedTaskCardProps>(({
  task,
  onComplete,
  onEdit,
  onDelete,
  index = 0,
  className = ''
}, ref) => {
  // Get component labels
  const { labels: componentLabels } = useComponentLabels();

  // Task card labels
  const taskCardLabels = {
    subtasks: {
      hasSubtasks: componentLabels?.taskCard?.subtasksIndicator
    },
    buttons: {
      complete: componentLabels?.taskCard?.completeButton,
      edit: componentLabels?.taskCard?.editButton,
      delete: componentLabels?.taskCard?.deleteButton
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={listItem}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      layout
      layoutId={`task-${task.id}`}
      whileHover={{
        y: -5,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.2 }
      }}
    >
      <TaskCard
        task={task}
        onComplete={onComplete}
        onEdit={onEdit}
        onDelete={onDelete}
        className={className}
        labels={taskCardLabels}
      />
    </motion.div>
  );
});

AnimatedTaskCard.displayName = 'AnimatedTaskCard';

export default AnimatedTaskCard;
