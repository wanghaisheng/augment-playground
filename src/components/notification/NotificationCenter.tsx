// src/components/notification/NotificationCenter.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/context/NotificationProvider';
import { Notification, NotificationPriority } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useLanguage } from '@/context/LanguageProvider';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';

// 通知中心属性
interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 通知中心组件
 * 
 * 显示所有通知的列表，并提供管理功能
 */
const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose
}) => {
  // 状态
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  
  // 上下文
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();
  const { language } = useLanguage();
  
  // 过滤通知
  useEffect(() => {
    if (activeTab === 'unread') {
      setFilteredNotifications(notifications.filter(notification => !notification.read));
    } else {
      setFilteredNotifications(notifications);
    }
  }, [activeTab, notifications]);
  
  // 格式化时间
  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: language === 'zh' ? zhCN : enUS
    });
  };
  
  // 获取优先级样式
  const getPriorityStyles = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300',
          iconColor: 'text-red-500',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        };
      case NotificationPriority.HIGH:
        return {
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-300',
          iconColor: 'text-amber-500',
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-700'
        };
      case NotificationPriority.MEDIUM:
        return {
          bgColor: 'bg-jade-50',
          borderColor: 'border-jade-300',
          iconColor: 'text-jade-500',
          titleColor: 'text-jade-800',
          messageColor: 'text-jade-700'
        };
      case NotificationPriority.LOW:
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-300',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        };
    }
  };
  
  // 处理标记为已读
  const handleMarkAsRead = (id: string) => {
    playSound(SoundType.BUTTON_CLICK);
    markAsRead(id);
  };
  
  // 处理标记所有为已读
  const handleMarkAllAsRead = () => {
    playSound(SoundType.BUTTON_CLICK);
    markAllAsRead();
  };
  
  // 处理删除通知
  const handleRemoveNotification = (id: string) => {
    playSound(SoundType.BUTTON_CLICK);
    removeNotification(id);
  };
  
  // 处理清除所有通知
  const handleClearAll = () => {
    playSound(SoundType.BUTTON_CLICK);
    clearAll();
  };
  
  // 处理切换标签
  const handleTabChange = (tab: 'all' | 'unread') => {
    playSound(SoundType.BUTTON_CLICK);
    setActiveTab(tab);
  };
  
  // 处理通知点击
  const handleNotificationClick = (notification: Notification) => {
    // 如果有导航动作，执行导航
    const navigateAction = notification.actions?.find(action => action.type === 'navigate');
    if (navigateAction) {
      window.location.href = navigateAction.value;
    }
    
    // 标记为已读
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // 关闭通知中心
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-jade-800">
                通知中心
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-jade-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={onClose}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            
            {/* 标签页 */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'all'
                    ? 'text-jade-600 border-b-2 border-jade-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('all')}
              >
                全部
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'unread'
                    ? 'text-jade-600 border-b-2 border-jade-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('unread')}
              >
                未读
                {unreadCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-jade-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* 通知列表 */}
            <div className="overflow-y-auto max-h-[50vh]">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p className="mt-4">
                    {activeTab === 'unread' ? '没有未读通知' : '没有通知'}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => {
                    const styles = getPriorityStyles(notification.priority);
                    
                    return (
                      <li
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? styles.bgColor : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
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
                              
                              <div className="flex items-center">
                                {!notification.read && (
                                  <span className="inline-block w-2 h-2 bg-jade-500 rounded-full mr-2"></span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {formatTime(notification.timestamp)}
                                </span>
                              </div>
                            </div>
                            
                            <p className={`text-xs ${styles.messageColor} mt-1`}>
                              {notification.message}
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
                            
                            {/* 操作按钮 */}
                            <div className="mt-2 flex justify-end space-x-2">
                              {!notification.read && (
                                <button
                                  className="text-xs text-jade-600 hover:text-jade-800"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                >
                                  标记为已读
                                </button>
                              )}
                              <button
                                className="text-xs text-red-600 hover:text-red-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveNotification(notification.id);
                                }}
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            
            {/* 底部操作 */}
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <Button
                variant="outlined"
                color="jade"
                size="small"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                全部标为已读
              </Button>
              <Button
                variant="outlined"
                color="red"
                size="small"
                onClick={handleClearAll}
                disabled={filteredNotifications.length === 0}
              >
                清空通知
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
