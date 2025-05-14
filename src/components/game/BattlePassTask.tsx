// src/components/game/BattlePassTask.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BattlePassTaskRecord, BattlePassTaskType } from '@/types/battle-pass';
import { playSound, SoundType } from '@/utils/sound';
import { getTaskProgress } from '@/services/battlePassTaskTrackingService';

/**
 * Props for the BattlePassTask component
 */
export interface BattlePassTaskProps {
  /** The task record containing all task data */
  task: BattlePassTaskRecord;
  /** Optional progress percentage (0-100). If not provided, will fetch from service */
  progress?: number;
  /** Callback function when task is completed */
  onCompleteTask: (taskId: number) => void;
  /** Localized labels for the component */
  labels: BattlePassTaskLabels;
  /** Optional user ID for fetching progress. Defaults to 'current-user' */
  userId?: string;
}

/**
 * Localized labels for the BattlePassTask component
 */
export interface BattlePassTaskLabels {
  /** Labels for different task types */
  taskTypes?: {
    daily?: string;
    weekly?: string;
    seasonal?: string;
  };
  /** Label for task progress */
  taskProgressLabel?: string;
  /** Label for completed tasks */
  taskCompletedLabel?: string;
}

/**
 * Battle Pass Task component
 * Displays a single task in the Battle Pass with progress and completion status
 */
const BattlePassTask: React.FC<BattlePassTaskProps> = ({
  task,
  progress: initialProgress,
  onCompleteTask,
  labels,
  userId = 'current-user' // Default user ID
}) => {
  // State for task progress
  const [taskProgress, setTaskProgress] = useState<{
    currentValue: number;
    targetValue: number;
    isCompleted: boolean;
    progressPercentage: number;
  }>({
    currentValue: 0,
    targetValue: task.targetValue,
    isCompleted: false,
    progressPercentage: initialProgress || 0
  });

  // Fetch task progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      if (initialProgress !== undefined) {
        // Use provided progress if available
        setTaskProgress({
          currentValue: Math.floor((initialProgress / 100) * task.targetValue),
          targetValue: task.targetValue,
          isCompleted: initialProgress >= 100,
          progressPercentage: initialProgress
        });
        return;
      }

      try {
        const progress = await getTaskProgress(userId, task.id!);
        const percentage = progress.targetValue > 0
          ? Math.min(100, Math.floor((progress.currentValue / progress.targetValue) * 100))
          : 0;

        setTaskProgress({
          currentValue: progress.currentValue,
          targetValue: progress.targetValue,
          isCompleted: progress.isCompleted,
          progressPercentage: percentage
        });
      } catch (error) {
        console.error(`Failed to fetch progress for task ${task.id}:`, error);
      }
    };

    fetchProgress();
  }, [task.id, userId, initialProgress, task.targetValue]);

  const isCompleted = taskProgress.isCompleted;

  // Get task type label
  const getTaskTypeLabel = () => {
    switch (task.taskType) {
      case BattlePassTaskType.DAILY:
        return labels.taskTypes?.daily || 'Daily';
      case BattlePassTaskType.WEEKLY:
        return labels.taskTypes?.weekly || 'Weekly';
      case BattlePassTaskType.SEASONAL:
        return labels.taskTypes?.seasonal || 'Seasonal';
      default:
        return task.taskType;
    }
  };

  // Get task type class
  const getTaskTypeClass = () => {
    switch (task.taskType) {
      case BattlePassTaskType.DAILY:
        return 'daily-task';
      case BattlePassTaskType.WEEKLY:
        return 'weekly-task';
      case BattlePassTaskType.SEASONAL:
        return 'seasonal-task';
      default:
        return '';
    }
  };

  // Handle complete button click
  const handleCompleteTask = () => {
    if (isCompleted) return;

    playSound(SoundType.SUCCESS);
    onCompleteTask(task.id!);
  };

  return (
    <motion.div
      className={`battle-pass-task ${getTaskTypeClass()} ${isCompleted ? 'completed' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="task-header">
        <div className="task-name">{task.taskName}</div>
        <div className={`task-type-badge ${getTaskTypeClass()}`}>
          {getTaskTypeLabel()}
        </div>
      </div>

      <div className="task-progress-section">
        <div className="task-progress-label">
          {isCompleted
            ? (labels.taskCompletedLabel || 'Completed')
            : `${labels.taskProgressLabel || 'Progress'}: ${taskProgress.currentValue}/${taskProgress.targetValue}`
          }
        </div>

        <div className="task-progress-bar">
          <div
            className="task-progress-fill"
            style={{ width: `${taskProgress.progressPercentage}%` }}
          ></div>
        </div>

        <div className="task-reward">
          <span className="task-exp-reward">+{task.expReward} EXP</span>
        </div>
      </div>

      {!isCompleted && (
        <button
          className="task-complete-button"
          onClick={handleCompleteTask}
        >
          Complete
        </button>
      )}
    </motion.div>
  );
};

export default BattlePassTask;
