// src/components/notification/NotificationToast.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification, NotificationPriority } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useLanguage } from '@/context/LanguageProvider';
import { useNotifications } from '@/context/NotificationProvider';

// 通知Toast属性
interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

/**
 * 通知Toast组件
 * 
 * 显示单个通知的弹出提示
 */
const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  // 状态
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  
  // 上下文
  const { markAsRead } = useNotifications();
  const { language } = useLanguage();
  
  // 获取优先级样式
  const getPriorityStyles = () => {
    switch (notification.priority) {
      case NotificationPriority.URGENT:
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-400',
          iconColor: 'text-red-500',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        };
      case NotificationPriority.HIGH:
        return {
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-400',
          iconColor: 'text-amber-500',
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-700'
        };
      case NotificationPriority.MEDIUM:
        return {
          bgColor: 'bg-jade-50',
          borderColor: 'border-jade-400',
          iconColor: 'text-jade-500',
          titleColor: 'text-jade-800',
          messageColor: 'text-jade-700'
        };
      case NotificationPriority.LOW:
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-400',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        };
    }
  };
  
  // 格式化时间
  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: language === 'zh' ? zhCN : enUS
    });
  };
  
  // 处理关闭
  const handleClose = () => {
    setIsVisible(false);
    
    // 清除定时器
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    // 标记为已读
    markAsRead(notification.id);
    
    // 延迟调用onClose，等待动画完成
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  // 处理点击
  const handleClick = () => {
    // 如果有导航动作，执行导航
    const navigateAction = notification.actions?.find(action => action.type === 'navigate');
    if (navigateAction) {
      window.location.href = navigateAction.value;
    }
    
    // 关闭通知
    handleClose();
  };
  
  // 自动关闭效果
  useEffect(() => {
    if (autoClose) {
      // 设置自动关闭定时器
      const timeout = setTimeout(() => {
        handleClose();
      }, duration);
      
      setTimeoutId(timeout);
      
      // 设置进度条更新间隔
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress < 0 ? 0 : newProgress;
        });
      }, 100);
      
      setIntervalId(interval);
      
      // 清理函数
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [autoClose, duration]);
  
  // 获取样式
  const styles = getPriorityStyles();
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`notification-toast ${styles.bgColor} border ${styles.borderColor} rounded-lg shadow-md p-4 mb-3 max-w-sm w-full cursor-pointer`}
          onClick={handleClick}
        >
          <div className="flex items-start">
            {/* 图标 */}
            {notification.icon && (
              <div className={`flex-shrink-0 mr-3 ${styles.iconColor}`}>
                <img src={notification.icon} alt="" className="w-6 h-6" />
              </div>
            )}
            
            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className={`text-sm font-medium ${styles.titleColor} truncate`}>
                  {notification.title}
                </h3>
                
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                >
                  <span className="sr-only">关闭</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              
              <p className={`text-xs ${styles.messageColor} mt-1`}>
                {notification.message}
              </p>
              
              {/* 时间 */}
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(notification.timestamp)}
              </p>
              
              {/* 图片 */}
              {notification.image && (
                <div className="mt-2">
                  <img
                    src={notification.image}
                    alt=""
                    className="rounded-md w-full h-auto max-h-32 object-cover"
                  />
                </div>
              )}
              
              {/* 动作按钮 */}
              {notification.actions && notification.actions.length > 0 && (
                <div className="mt-3 flex space-x-2">
                  {notification.actions.map((action, index) => (
                    <button
                      key={index}
                      className="px-2 py-1 text-xs rounded-md bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (action.type === 'navigate') {
                          window.location.href = action.value;
                        } else if (action.type === 'dismiss') {
                          handleClose();
                        }
                        // 其他动作类型可以在这里处理
                      }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* 进度条 */}
          {autoClose && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-jade-500 h-1 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
