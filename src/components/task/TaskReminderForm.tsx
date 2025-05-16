// src/components/task/TaskReminderForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  scheduleTaskReminder,
  createCustomReminder
} from '@/services/taskReminderService';
import { getTask } from '@/services/taskService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import ScrollDialog from '@/components/game/ScrollDialog';
import EnhancedTextArea from '@/components/common/EnhancedTextArea';
import EnhancedInput from '@/components/common/EnhancedInput';

interface TaskReminderFormProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  onReminderCreated?: () => void;
}

/**
 * 任务提醒表单组件
 * 用于创建任务提醒
 */
const TaskReminderForm: React.FC<TaskReminderFormProps> = ({
  isOpen,
  onClose,
  taskId,
  onReminderCreated
}) => {
  const [reminderType, setReminderType] = useState<'scheduled' | 'custom'>('scheduled');
  const [reminderDate, setReminderDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reminderTime, setReminderTime] = useState<string>('12:00');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>('');

  // 加载任务标题
  React.useEffect(() => {
    const loadTaskTitle = async () => {
      try {
        const task = await getTask(taskId);
        if (task) {
          setTaskTitle(task.title);
        }
      } catch (err) {
        console.error('Failed to load task:', err);
      }
    };

    if (isOpen && taskId) {
      loadTaskTitle();
    }
  }, [isOpen, taskId]);

  // 处理提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      // 创建提醒时间
      const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);

      // 检查提醒时间是否有效
      if (reminderDateTime < new Date()) {
        setError('提醒时间不能早于当前时间');
        return;
      }

      // 创建提醒
      if (reminderType === 'scheduled') {
        await scheduleTaskReminder(taskId, reminderDateTime);
      } else {
        if (!customMessage.trim()) {
          setError('请输入自定义消息');
          return;
        }

        await createCustomReminder(taskId, reminderDateTime, customMessage);
      }

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 通知父组件
      if (onReminderCreated) {
        onReminderCreated();
      }

      // 关闭对话框
      onClose();
    } catch (err) {
      console.error('Failed to create reminder:', err);
      setError('创建提醒失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title="创建任务提醒"
      closeOnOutsideClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
      showCloseButton={!isSubmitting}
    >
      <div className="task-reminder-form p-4">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message text-red-500 mb-4 p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* 任务信息 */}
          <div className="task-info mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-md font-bold mb-1">任务</h3>
            <p className="text-gray-700">{taskTitle}</p>
          </div>

          {/* 提醒类型 */}
          <div className="reminder-type-selector mb-4">
            <h3 className="text-md font-bold mb-2">提醒类型</h3>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={reminderType === 'scheduled' ? 'jade' : 'secondary'}
                onClick={() => setReminderType('scheduled')}
                className="flex-1"
              >
                计划提醒
              </Button>
              <Button
                type="button"
                variant={reminderType === 'custom' ? 'jade' : 'secondary'}
                onClick={() => setReminderType('custom')}
                className="flex-1"
              >
                自定义提醒
              </Button>
            </div>
          </div>

          {/* 提醒时间 */}
          <div className="reminder-time-selector mb-4">
            <h3 className="text-md font-bold mb-2">提醒时间</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <EnhancedInput
                  type="date"
                  id="reminderDate"
                  label="日期"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <EnhancedInput
                  type="time"
                  id="reminderTime"
                  label="时间"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* 自定义消息 */}
          {reminderType === 'custom' && (
            <div className="custom-message-input mb-4">
              <h3 className="text-md font-bold mb-2">自定义消息</h3>
              <EnhancedTextArea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="输入自定义提醒消息..."
                required={reminderType === 'custom'}
                minRows={3}
                maxRows={6}
                autoResize={true}
              />
            </div>
          )}

          {/* 提交按钮 */}
          <div className="form-actions flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              variant="jade"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner variant="white" size="small" />
              ) : (
                '创建提醒'
              )}
            </Button>
          </div>
        </form>
      </div>
    </ScrollDialog>
  );
};

export default TaskReminderForm;
