// src/components/goals/CustomGoalCard.tsx
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CustomGoalRecord, CustomGoalCardLabels } from '@/types/index';
import { GoalStatus } from '@/types/goals';
import {
  updateCustomGoalProgress
} from '@/services/customGoalService';

import { playSound, SoundType } from '@/utils/sound';
import Button from '@/components/common/Button';


interface CustomGoalCardProps {
  goal: CustomGoalRecord;
  onEdit?: (goal: CustomGoalRecord) => void;
  onToggleComplete?: (goal: CustomGoalRecord) => void; // Added
  onDelete?: (goal: CustomGoalRecord) => void; // Added for page-level confirmation
  labels?: CustomGoalCardLabels; // Now uses imported type
}

/**
 * 自定义目标卡片组件
 */
const CustomGoalCard: React.FC<CustomGoalCardProps> = ({
  goal,
  onEdit,
  onToggleComplete,
  onDelete,
  labels
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting] = useState(false);
  const [progressValue, setProgressValue] = useState<number>(1);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [progressNotes, setProgressNotes] = useState('');
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // const { content } = useLocalizedView('customGoalCard'); // Removed, use props.labels
  // const { refreshData } = useDataRefreshContext(); // Removed as refreshData is not used directly by card

  // 计算进度百分比
  const progressPercentage = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) || 0;

  // 格式化日期
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // 获取目标状态文本
  const getGoalStatusText = useCallback(() => {
    switch (goal.status) {
      case GoalStatus.ACTIVE:
        return labels?.statusActive || 'Active';
      case GoalStatus.COMPLETED:
        return labels?.statusCompleted || 'Completed';
      case GoalStatus.ARCHIVED:
        return labels?.statusArchived || 'Archived';
      default:
        // Fallback if status is undefined or another value, can also rely on isAchieved
        return goal.isAchieved ? (labels?.statusCompleted || 'Completed') : (labels?.statusActive || 'Active');
    }
  }, [goal.status, goal.isAchieved, labels]);

  // 获取目标状态颜色
  const getGoalStatusColor = useCallback(() => {
    switch (goal.status) {
      case GoalStatus.ACTIVE:
        return 'bg-blue-500';
      case GoalStatus.COMPLETED:
        return 'bg-green-500';
      case GoalStatus.ARCHIVED:
        return 'bg-gray-500';
      default:
        // Fallback if status is undefined, can also rely on isAchieved
        return goal.isAchieved ? 'bg-green-500' : 'bg-blue-500';
    }
  }, [goal.status, goal.isAchieved]);

  // 处理更新进度
  const handleUpdateProgress = async () => {
    try {
      setIsUpdating(true);

      // 验证进度值
      if (progressValue <= 0) {
        playSound(SoundType.ERROR); // Added sound for validation error
        setIsUpdating(false);
        return;
      }

      const goalIdNumber = parseInt(goal.id, 10);
      if (isNaN(goalIdNumber)) {
        console.error('Invalid goal ID for progress update:', goal.id);
        playSound(SoundType.ERROR);
        setIsUpdating(false);
        return;
      }

      // 更新进度
      await updateCustomGoalProgress(goalIdNumber, progressValue, progressNotes);

      // 播放音效
      playSound(SoundType.SUCCESS);

      // 重置表单
      setProgressValue(1);
      setProgressNotes('');
      setShowProgressForm(false);
    } catch (error) {
      console.error('Failed to update goal progress:', error);
      playSound(SoundType.ERROR);
    } finally {
      setIsUpdating(false);
    }
  };

  // 处理删除目标
  const handleDeleteClick = () => {
    if (onDelete) {
      playSound(SoundType.BUTTON_CLICK); // Sound for button click before confirmation
      onDelete(goal);
    }
  };

  const handleToggleCompleteClick = () => {
    if (onToggleComplete) {
      // Sound is played by the parent page's handler after successful toggle
      onToggleComplete(goal);
    }
  };

  return (
    <motion.div
      className="custom-goal-card bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 目标头部 */}
      <div className="goal-header p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{goal.title}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${getGoalStatusColor()}`}>
                {getGoalStatusText()}
              </span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {onEdit && goal.status === GoalStatus.ACTIVE && (
              <button
                className="text-gray-500 hover:text-jade-600 p-1"
                onClick={() => { onEdit(goal); playSound(SoundType.BUTTON_CLICK); }}
                aria-label={labels?.editButton || "编辑"}
                title={labels?.editButton || "编辑"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            )}

            {onToggleComplete && (
              <button
                className={`p-1 rounded-full ${goal.status === GoalStatus.COMPLETED ? 'text-gray-500 hover:text-yellow-600' : 'text-gray-500 hover:text-green-600'}`}
                onClick={handleToggleCompleteClick}
                aria-label={goal.status === GoalStatus.COMPLETED ? (labels?.markActiveButton || 'Mark Active') : (labels?.markCompleteButton || 'Mark Complete')}
                title={goal.status === GoalStatus.COMPLETED ? (labels?.markActiveButton || 'Mark Active') : (labels?.markCompleteButton || 'Mark Complete')}
              >
                {goal.status === GoalStatus.COMPLETED ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.293a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}

            {onDelete && (
            <button
                className="text-gray-500 hover:text-red-600 p-1"
                onClick={handleDeleteClick}
              disabled={isDeleting}
                aria-label={labels?.deleteButton || "删除"}
                title={labels?.deleteButton || "删除"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              )}
          </div>
        </div>

        {goal.description && (
          <p className="text-gray-600 mt-2 text-sm">{goal.description}</p>
        )}
      </div>

      {/* 目标进度 */}
      <div className="goal-progress p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">
            {labels?.progressLabel || '进度'}
          </span>
          <span className="text-sm font-medium">
            {goal.currentValue} / {goal.targetValue} ({progressPercentage}%)
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-jade-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{labels?.startDateLabel || '开始'}: {formatDate(goal.createdAt)}</span>
          {goal.deadline && (
            <span>{labels?.endDateLabel || '结束'}: {formatDate(goal.deadline)}</span>
          )}
        </div>
      </div>

      {/* 更新进度表单 */}
      {goal.status === GoalStatus.ACTIVE && (
        <div className="goal-actions p-4 bg-gray-50">
          {showProgressForm ? (
            <div className="progress-form">
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  value={progressValue}
                  onChange={(e) => setProgressValue(parseInt(e.target.value) || 0)}
                  className="w-20 p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
                  min="1"
                  aria-label={labels?.addProgressValueLabel || 'Add progress value'}
                />
                <input
                  type="text"
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder={labels?.progressNotesPlaceholder || 'Progress notes (optional)'}
                  className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outlined" size="small" onClick={() => setShowProgressForm(false)}>
                  {labels?.cancelProgressButton || 'Cancel'}
                </Button>
                <Button color="primary" size="small" onClick={handleUpdateProgress} isLoading={isUpdating}>
                  {isUpdating ? (labels?.updateProgressButton || 'Updating...') : (labels?.logProgressButton || 'Log Progress')}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="jade" onClick={() => setShowProgressForm(true)} className="w-full">
              {labels?.logProgressButton || 'Log Progress'}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CustomGoalCard;
