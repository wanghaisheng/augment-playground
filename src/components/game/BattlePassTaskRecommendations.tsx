// src/components/game/BattlePassTaskRecommendations.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BattlePassTaskRecord } from '@/types/battle-pass';

/**
 * Props for the BattlePassTaskRecommendations component
 */
export interface BattlePassTaskRecommendationsProps {
  /** Array of all available tasks */
  allTasks: BattlePassTaskRecord[];
  /** Current user level */
  userLevel: number;
  /** Callback function when a task is selected */
  onTaskSelected?: (taskId: string) => void;
  /** Localized labels for the component */
  labels: {
    /** Title for the recommendations */
    recommendationsTitle?: string;
    /** Label for the recommended tasks */
    recommendedTasksLabel?: string;
    /** Label for the easy tasks */
    easyTasksLabel?: string;
    /** Label for the quick tasks */
    quickTasksLabel?: string;
    /** Label for the high reward tasks */
    highRewardTasksLabel?: string;
    /** Label for the "Start Task" button */
    startTaskButtonLabel?: string;
    /** Label for when there are no recommendations */
    noRecommendationsLabel?: string;
    /** Label for the difficulty */
    difficultyLabel?: string;
    /** Label for the time */
    timeLabel?: string;
    /** Label for the reward */
    rewardLabel?: string;
  };
}

/**
 * Battle Pass Task Recommendations Component
 * Displays recommended tasks based on user level and preferences
 */
const BattlePassTaskRecommendations: React.FC<BattlePassTaskRecommendationsProps> = ({
  allTasks,
  userLevel,
  onTaskSelected,
  labels
}) => {
  const [recommendedTasks, setRecommendedTasks] = useState<BattlePassTaskRecord[]>([]);
  const [easyTasks, setEasyTasks] = useState<BattlePassTaskRecord[]>([]);
  const [quickTasks, setQuickTasks] = useState<BattlePassTaskRecord[]>([]);
  const [highRewardTasks, setHighRewardTasks] = useState<BattlePassTaskRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'recommended' | 'easy' | 'quick' | 'highReward'>('recommended');

  // Default labels
  const recommendationsTitle = labels.recommendationsTitle || 'Task Recommendations';
  const recommendedTasksLabel = labels.recommendedTasksLabel || 'Recommended';
  const easyTasksLabel = labels.easyTasksLabel || 'Easy';
  const quickTasksLabel = labels.quickTasksLabel || 'Quick';
  const highRewardTasksLabel = labels.highRewardTasksLabel || 'High Reward';
  const startTaskButtonLabel = labels.startTaskButtonLabel || 'Start Task';
  const noRecommendationsLabel = labels.noRecommendationsLabel || 'No recommendations available';
  const difficultyLabel = labels.difficultyLabel || 'Difficulty';
  const timeLabel = labels.timeLabel || 'Time';
  const rewardLabel = labels.rewardLabel || 'Reward';

  // Filter and sort tasks based on different criteria
  useEffect(() => {
    // Filter out completed tasks
    const incompleteTasks = allTasks.filter(task => !task.isCompleted);

    // Recommended tasks: balanced mix of difficulty, time, and reward
    const recommended = [...incompleteTasks]
      .sort((a, b) => {
        // Calculate a score based on time and reward
        // Use default values if properties don't exist
        const timeA = a.estimatedTimeMinutes || 30; // Default to 30 minutes if not specified
        const timeB = b.estimatedTimeMinutes || 30; // Default to 30 minutes if not specified
        const scoreA = (a.expReward / timeA) * 100;
        const scoreB = (b.expReward / timeB) * 100;
        return scoreB - scoreA;
      })
      .slice(0, 3);

    // Easy tasks: low estimated time
    const easy = [...incompleteTasks]
      .sort((a, b) => {
        const timeA = a.estimatedTimeMinutes || 30; // Default to 30 minutes if not specified
        const timeB = b.estimatedTimeMinutes || 30; // Default to 30 minutes if not specified
        return timeA - timeB;
      })
      .slice(0, 3);

    // Quick tasks: low estimated time
    const quick = [...incompleteTasks]
      .sort((a, b) => {
        const timeA = a.estimatedTimeMinutes || 30; // Default to 30 minutes if not specified
        const timeB = b.estimatedTimeMinutes || 30; // Default to 30 minutes if not specified
        return timeA - timeB;
      })
      .slice(0, 3);

    // High reward tasks: high exp reward
    const highReward = [...incompleteTasks]
      .sort((a, b) => b.expReward - a.expReward)
      .slice(0, 3);

    setRecommendedTasks(recommended);
    setEasyTasks(easy);
    setQuickTasks(quick);
    setHighRewardTasks(highReward);
  }, [allTasks, userLevel]);

  // Get the current tasks based on the active tab
  const getCurrentTasks = () => {
    switch (activeTab) {
      case 'recommended':
        return recommendedTasks;
      case 'easy':
        return easyTasks;
      case 'quick':
        return quickTasks;
      case 'highReward':
        return highRewardTasks;
      default:
        return recommendedTasks;
    }
  };

  // Get difficulty label based on difficulty level
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy';
    if (difficulty <= 4) return 'Medium';
    return 'Hard';
  };

  // Get difficulty color based on difficulty level
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return '#4caf50';
    if (difficulty <= 4) return '#ff9800';
    return '#f44336';
  };

  // Get time label based on estimated time
  const getTimeLabel = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const currentTasks = getCurrentTasks();

  return (
    <div className="task-recommendations">
      <h3 className="recommendations-title">{recommendationsTitle}</h3>

      <div className="recommendations-tabs">
        <button
          className={`tab-button ${activeTab === 'recommended' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommended')}
        >
          {recommendedTasksLabel}
        </button>
        <button
          className={`tab-button ${activeTab === 'easy' ? 'active' : ''}`}
          onClick={() => setActiveTab('easy')}
        >
          {easyTasksLabel}
        </button>
        <button
          className={`tab-button ${activeTab === 'quick' ? 'active' : ''}`}
          onClick={() => setActiveTab('quick')}
        >
          {quickTasksLabel}
        </button>
        <button
          className={`tab-button ${activeTab === 'highReward' ? 'active' : ''}`}
          onClick={() => setActiveTab('highReward')}
        >
          {highRewardTasksLabel}
        </button>
      </div>

      <div className="recommendations-content">
        {currentTasks.length > 0 ? (
          <div className="recommended-tasks-list">
            {currentTasks.map(task => (
              <motion.div
                key={task.id}
                className="recommended-task-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="task-name">{task.taskName}</div>
                <div className="task-description">{task.taskDescription}</div>

                <div className="task-metrics">
                  <div className="task-metric">
                    <span className="metric-label">{difficultyLabel}</span>
                    <span
                      className="metric-value"
                      style={{ color: getDifficultyColor(task.difficulty) }}
                    >
                      {getDifficultyLabel(task.difficulty)}
                    </span>
                  </div>

                  <div className="task-metric">
                    <span className="metric-label">{timeLabel}</span>
                    <span className="metric-value">
                      {getTimeLabel(task.estimatedTimeMinutes)}
                    </span>
                  </div>

                  <div className="task-metric">
                    <span className="metric-label">{rewardLabel}</span>
                    <span className="metric-value reward">
                      {task.expReward} XP
                    </span>
                  </div>
                </div>

                {onTaskSelected && (
                  <button
                    className="start-task-button jade-button"
                    onClick={() => onTaskSelected(task.id)}
                  >
                    {startTaskButtonLabel}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="no-recommendations">
            <p>{noRecommendationsLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattlePassTaskRecommendations;
