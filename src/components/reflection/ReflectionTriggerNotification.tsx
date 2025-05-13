// src/components/reflection/ReflectionTriggerNotification.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ReflectionTriggerRecord, 
  ReflectionTriggerType,
  getUnviewedReflectionTriggers,
  markTriggerAsViewed,
  markTriggerAsCompleted
} from '@/services/reflectionService';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';

interface ReflectionTriggerNotificationProps {
  onTriggerAccepted?: (trigger: ReflectionTriggerRecord) => void;
  onTriggerDismissed?: (trigger: ReflectionTriggerRecord) => void;
}

/**
 * 反思触发通知组件
 * 用于显示反思触发通知并处理用户响应
 */
const ReflectionTriggerNotification: React.FC<ReflectionTriggerNotificationProps> = ({
  onTriggerAccepted,
  onTriggerDismissed
}) => {
  const [triggers, setTriggers] = useState<ReflectionTriggerRecord[]>([]);
  const [currentTriggerIndex, setCurrentTriggerIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 当前用户ID（在实际应用中，这应该从用户会话中获取）
  const userId = 'current-user';

  // 加载未查看的反思触发记录
  const loadTriggers = async () => {
    try {
      setIsLoading(true);
      const unviewedTriggers = await getUnviewedReflectionTriggers(userId);
      setTriggers(unviewedTriggers);
      
      // 如果有未查看的触发记录，显示通知
      if (unviewedTriggers.length > 0) {
        setIsVisible(true);
        // 播放通知音效
        playSound(SoundType.NOTIFICATION, 0.5);
      }
    } catch (err) {
      console.error('Failed to load reflection triggers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadTriggers();
  }, []);

  // 注册数据刷新监听
  useRegisterTableRefresh('reflectionTriggers', loadTriggers);

  // 处理接受反思
  const handleAccept = async () => {
    if (triggers.length === 0) return;
    
    const currentTrigger = triggers[currentTriggerIndex];
    
    try {
      // 标记为已查看
      await markTriggerAsViewed(currentTrigger.id!);
      
      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.5);
      
      // 隐藏通知
      setIsVisible(false);
      
      // 通知父组件
      if (onTriggerAccepted) {
        setTimeout(() => {
          onTriggerAccepted(currentTrigger);
        }, 300); // 等待关闭动画完成
      }
    } catch (err) {
      console.error('Failed to mark trigger as viewed:', err);
    }
  };

  // 处理稍后提醒
  const handleRemindLater = async () => {
    if (triggers.length === 0) return;
    
    const currentTrigger = triggers[currentTriggerIndex];
    
    try {
      // 标记为已查看
      await markTriggerAsViewed(currentTrigger.id!);
      
      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.3);
      
      // 移除当前触发记录
      setTriggers(prevTriggers => 
        prevTriggers.filter((_, index) => index !== currentTriggerIndex)
      );
      
      // 重置索引
      setCurrentTriggerIndex(0);
      
      // 如果没有更多触发记录，隐藏通知
      if (triggers.length <= 1) {
        setIsVisible(false);
      }
    } catch (err) {
      console.error('Failed to mark trigger as viewed:', err);
    }
  };

  // 处理忽略
  const handleDismiss = async () => {
    if (triggers.length === 0) return;
    
    const currentTrigger = triggers[currentTriggerIndex];
    
    try {
      // 标记为已完成
      await markTriggerAsCompleted(currentTrigger.id!);
      
      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.3);
      
      // 移除当前触发记录
      setTriggers(prevTriggers => 
        prevTriggers.filter((_, index) => index !== currentTriggerIndex)
      );
      
      // 重置索引
      setCurrentTriggerIndex(0);
      
      // 如果没有更多触发记录，隐藏通知
      if (triggers.length <= 1) {
        setIsVisible(false);
      }
      
      // 通知父组件
      if (onTriggerDismissed) {
        onTriggerDismissed(currentTrigger);
      }
    } catch (err) {
      console.error('Failed to mark trigger as completed:', err);
    }
  };

  // 获取触发类型标签
  const getTriggerTypeLabel = (type: ReflectionTriggerType): string => {
    switch (type) {
      case ReflectionTriggerType.MOOD_CHANGE:
        return '情绪变化';
      case ReflectionTriggerType.TASK_FAILURE:
        return '任务失败';
      case ReflectionTriggerType.DAILY_REFLECTION:
        return '每日反思';
      case ReflectionTriggerType.WEEKLY_REVIEW:
        return '每周回顾';
      case ReflectionTriggerType.MANUAL:
        return '手动触发';
      default:
        return '未知';
    }
  };

  // 获取触发消息
  const getTriggerMessage = (trigger: ReflectionTriggerRecord): string => {
    switch (trigger.type) {
      case ReflectionTriggerType.MOOD_CHANGE:
        return '熊猫注意到你的情绪有些波动，想和你聊聊吗？';
      case ReflectionTriggerType.TASK_FAILURE:
        return trigger.data?.taskTitle
          ? `任务"${trigger.data.taskTitle}"未能按时完成，想花点时间反思一下吗？`
          : '有一个任务未能按时完成，想花点时间反思一下吗？';
      case ReflectionTriggerType.DAILY_REFLECTION:
        return '今天过得如何？想花点时间进行每日反思吗？';
      case ReflectionTriggerType.WEEKLY_REVIEW:
        return '这周过得如何？想花点时间进行每周回顾吗？';
      case ReflectionTriggerType.MANUAL:
        return '想花点时间进行反思吗？';
      default:
        return '熊猫想和你聊聊，有时间吗？';
    }
  };

  // 如果没有触发记录或不可见，不显示任何内容
  if (triggers.length === 0 || !isVisible) {
    return null;
  }

  const currentTrigger = triggers[currentTriggerIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="reflection-trigger-notification fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-amber-200 z-50"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {/* 通知头部 */}
          <div className="notification-header bg-amber-50 p-3 border-b border-amber-200">
            <div className="flex items-center">
              <div className="panda-avatar mr-2">
                <span className="text-2xl">🐼</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-md font-bold text-amber-800">静心茶室</h3>
                <p className="text-xs text-amber-600">
                  {getTriggerTypeLabel(currentTrigger.type)}
                </p>
              </div>
              <div className="trigger-count">
                {triggers.length > 1 && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                    {currentTriggerIndex + 1}/{triggers.length}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* 通知内容 */}
          <div className="notification-content p-3">
            <p className="text-gray-700 mb-3">
              {getTriggerMessage(currentTrigger)}
            </p>
            
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
                onClick={handleAccept}
              >
                开始
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReflectionTriggerNotification;
