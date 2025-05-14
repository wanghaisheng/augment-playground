// src/components/common/TaskCompletionToast.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for the TaskCompletionToast component
 */
export interface TaskCompletionToastProps {
  /** Whether the toast is visible */
  isVisible: boolean;
  /** Name of the completed task */
  taskName: string;
  /** Experience reward for completing the task */
  expReward: number;
  /** Callback function when the toast is closed */
  onClose: () => void;
  /** Delay in milliseconds before auto-closing the toast (default: 3000) */
  autoCloseDelay?: number;
}

/**
 * Toast notification for task completion
 * Shows a brief notification when a task is completed
 */
const TaskCompletionToast: React.FC<TaskCompletionToastProps> = ({
  isVisible,
  taskName,
  expReward,
  onClose,
  autoCloseDelay = 3000 // Default to 3 seconds
}) => {
  // Auto-close the toast after delay
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="task-completion-toast"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="toast-icon">✓</div>
          <div className="toast-content">
            <h3 className="toast-title">Task Completed!</h3>
            <p className="toast-message">{taskName}</p>
            <p className="toast-reward">+{expReward} EXP</p>
          </div>
          <button className="toast-close-button" onClick={onClose}>×</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskCompletionToast;
