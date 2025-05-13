// src/components/task/TaskReminderNotification.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TaskReminderRecord, 
  getUnviewedReminders,
  markReminderAsViewed,
  markReminderAsCompleted
} from '@/services/taskReminderService';
import { getTask } from '@/services/taskService';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';

interface TaskReminderNotificationProps {
  onTaskClick?: (taskId: number) => void;
  onDismiss?: (reminder: TaskReminderRecord) => void;
}

/**
 * 任务提醒通知组件
 * 用于显示任务提醒通知，使用熊猫信使主题
 */
const TaskReminderNotification: React.FC<TaskReminderNotificationProps> = ({
  onTaskClick,
  onDismiss
}) => {
  const [reminders, setReminders] = useState<TaskReminderRecord[]>([]);
  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [taskTitles, setTaskTitles] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // 当前用户ID（在实际应用中，这应该从用户会话中获取）
  const userId = 'current-user';

  // 加载未查看的提醒
  const loadReminders = async () => {
    try {
      setIsLoading(true);
      const unviewedReminders = await getUnviewedReminders(userId);
      setReminders(unviewedReminders);
      
      // 如果有未查看的提醒，显示通知
      if (unviewedReminders.length > 0) {
        setIsVisible(true);
        
        // 加载任务标题
        const titles: Record<number, string> = {};
        for (const reminder of unviewedReminders) {
          const task = await getTask(reminder.taskId);
          if (task) {
            titles[reminder.taskId] = task.title;
          }
        }
        setTaskTitles(titles);
        
        // 播放通知音效
        playSound(SoundType.NOTIFICATION, 0.5);
      }
    } catch (err) {
      console.error('Failed to load task reminders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadReminders();
  }, []);

  // 注册数据刷新监听
  useRegisterTableRefresh('taskReminders', loadReminders);

  // 处理查看任务
  const handleViewTask = async () => {
    if (reminders.length === 0) return;
    
    const currentReminder = reminders[currentReminderIndex];
    
    try {
      // 标记为已查看
      await markReminderAsViewed(currentReminder.id!);
      
      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.5);
      
      // 隐藏通知
      setIsVisible(false);
      
      // 通知父组件
      if (onTaskClick) {
        setTimeout(() => {
          onTaskClick(currentReminder.taskId);
        }, 300); // 等待关闭动画完成
      }
    } catch (err) {
      console.error('Failed to mark reminder as viewed:', err);
    }
  };

  // 处理稍后提醒
  const handleRemindLater = async () => {
    if (reminders.length === 0) return;
    
    const currentReminder = reminders[currentReminderIndex];
    
    try {
      // 标记为已查看
      await markReminderAsViewed(currentReminder.id!);
      
      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.3);
      
      // 移除当前提醒
      setReminders(prevReminders => 
        prevReminders.filter((_, index) => index !== currentReminderIndex)
      );
      
      // 重置索引
      setCurrentReminderIndex(0);
      
      // 如果没有更多提醒，隐藏通知
      if (reminders.length <= 1) {
        setIsVisible(false);
      }
    } catch (err) {
      console.error('Failed to mark reminder as viewed:', err);
    }
  };

  // 处理忽略
  const handleDismiss = async () => {
    if (reminders.length === 0) return;
    
    const currentReminder = reminders[currentReminderIndex];
    
    try {
      // 标记为已完成
      await markReminderAsCompleted(currentReminder.id!);
      
      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.3);
      
      // 移除当前提醒
      setReminders(prevReminders => 
        prevReminders.filter((_, index) => index !== currentReminderIndex)
      );
      
      // 重置索引
      setCurrentReminderIndex(0);
      
      // 如果没有更多提醒，隐藏通知
      if (reminders.length <= 1) {
        setIsVisible(false);
      }
      
      // 通知父组件
      if (onDismiss) {
        onDismiss(currentReminder);
      }
    } catch (err) {
      console.error('Failed to mark reminder as completed:', err);
    }
  };

  // 如果没有提醒或不可见，不显示任何内容
  if (reminders.length === 0 || !isVisible) {
    return null;
  }

  const currentReminder = reminders[currentReminderIndex];
  const taskTitle = taskTitles[currentReminder.taskId] || '未知任务';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="task-reminder-notification fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-jade-200 z-50"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {/* 通知头部 */}
          <div className="notification-header bg-jade-50 p-3 border-b border-jade-200">
            <div className="flex items-center">
              <div className="panda-messenger mr-2">
                <span className="text-2xl">🐼📬</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-md font-bold text-jade-800">熊猫信使</h3>
                <p className="text-xs text-jade-600">
                  任务提醒
                </p>
              </div>
              <div className="reminder-count">
                {reminders.length > 1 && (
                  <span className="text-xs bg-jade-100 text-jade-800 px-2 py-1 rounded-full">
                    {currentReminderIndex + 1}/{reminders.length}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* 通知内容 */}
          <div className="notification-content p-3">
            <div className="task-title font-bold mb-2">
              {taskTitle}
            </div>
            <p className="text-gray-700 mb-3">
              {currentReminder.message || '你有一个任务需要处理。'}
            </p>
            
            <div className="reminder-time text-xs text-gray-500 mb-3">
              提醒时间: {new Date(currentReminder.reminderTime).toLocaleString()}
            </div>
            
            <div className="notification-actions flex justify-end gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={handleDismiss}
              >
                忽略
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={handleRemindLater}
              >
                稍后
              </Button>
              <Button
                variant="jade"
                size="small"
                onClick={handleViewTask}
              >
                查看任务
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskReminderNotification;
