// src/components/notification/NotificationManager.tsx
import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/context/NotificationProvider';
import NotificationToast from './NotificationToast';
import NotificationCenter from './NotificationCenter';
import { Notification } from '@/types/notification';

/**
 * 通知管理器组件
 *
 * 管理应用程序中的通知显示，包括Toast和通知中心
 */
const NotificationManager: React.FC = () => {
  // 状态
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // 上下文
  const { notifications, preferences } = useNotifications();

  // 监听新通知
  useEffect(() => {
    // 如果通知列表为空，直接返回
    if (!notifications.length) return;

    // 获取最新的通知
    const latestNotification = notifications[0];

    // 检查是否已经在活动Toast中
    const isAlreadyActive = activeToasts.some(toast => toast.id === latestNotification.id);

    // 如果已经在活动Toast中，直接返回
    if (isAlreadyActive) return;

    // 检查通知是否已读
    if (latestNotification.read) return;

    // 检查通知类型是否启用
    const typePreference = preferences.typePreferences[latestNotification.type];
    if (!preferences.enabled || !typePreference?.enabled) return;

    // 添加到活动Toast
    setActiveToasts(prev => [latestNotification, ...prev].slice(0, 3)); // 最多显示3个
  }, [notifications, activeToasts, preferences]);

  // 处理关闭Toast
  const handleCloseToast = (id: string) => {
    setActiveToasts(prev => prev.filter(toast => toast.id !== id));
  };


  // 处理关闭通知中心
  const handleCloseNotificationCenter = () => {
    setIsNotificationCenterOpen(false);
  };

  return (
    <>
      {/* 通知Toast */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2 max-w-sm">
        {activeToasts.map(toast => (
          <NotificationToast
            key={toast.id}
            notification={toast}
            onClose={() => handleCloseToast(toast.id)}
            autoClose={true}
            duration={preferences.displayDuration}
          />
        ))}
      </div>

      {/* 通知中心 */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={handleCloseNotificationCenter}
      />
    </>
  );
};

export default NotificationManager;
