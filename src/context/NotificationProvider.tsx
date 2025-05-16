// src/context/NotificationProvider.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Notification, 
  NotificationType, 
  NotificationPriority,
  NotificationPreferences,
  defaultNotificationPreferences
} from '@/types/notification';
import {
  getNotifications,
  addNotification as addNotificationService,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getNotificationPreferences,
  saveNotificationPreferences,
  updateNotificationTypePreference
} from '@/services/notificationService';
import { useDataRefresh } from './DataRefreshProvider';

// 通知上下文接口
interface NotificationContextType {
  // 通知列表
  notifications: Notification[];
  // 未读通知数量
  unreadCount: number;
  // 通知偏好设置
  preferences: NotificationPreferences;
  // 是否正在加载
  loading: boolean;
  // 添加通知
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Promise<Notification>;
  // 标记通知为已读
  markAsRead: (notificationId: string) => Promise<void>;
  // 标记所有通知为已读
  markAllAsRead: () => Promise<void>;
  // 删除通知
  removeNotification: (notificationId: string) => Promise<void>;
  // 清除所有通知
  clearAll: () => Promise<void>;
  // 保存偏好设置
  savePreferences: (preferences: NotificationPreferences) => Promise<void>;
  // 更新特定类型的通知偏好设置
  updateTypePreference: (
    type: NotificationType,
    enabled: boolean,
    priority?: NotificationPriority
  ) => Promise<void>;
  // 刷新通知
  refreshNotifications: () => Promise<void>;
}

// 创建通知上下文
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// 通知提供者属性
interface NotificationProviderProps {
  children: React.ReactNode;
}

/**
 * 通知提供者组件
 * 
 * 管理应用程序中的通知状态和操作
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  // 状态
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 数据刷新上下文
  const { registerRefreshListener } = useDataRefresh();
  
  // 加载通知
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const notificationData = await getNotifications();
      setNotifications(notificationData);
      
      // 计算未读数量
      const unreadNotifications = notificationData.filter(notification => !notification.read);
      setUnreadCount(unreadNotifications.length);
      
      // 加载偏好设置
      const preferencesData = await getNotificationPreferences();
      setPreferences(preferencesData);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 添加通知
  const addNotification = useCallback(async (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ): Promise<Notification> => {
    const newNotification = await addNotificationService(notification);
    
    // 刷新通知列表
    await loadNotifications();
    
    return newNotification;
  }, [loadNotifications]);
  
  // 标记通知为已读
  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    await markNotificationAsRead(notificationId);
    
    // 更新状态
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // 更新未读数量
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);
  
  // 标记所有通知为已读
  const markAllAsRead = useCallback(async (): Promise<void> => {
    await markAllNotificationsAsRead();
    
    // 更新状态
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // 更新未读数量
    setUnreadCount(0);
  }, []);
  
  // 删除通知
  const removeNotification = useCallback(async (notificationId: string): Promise<void> => {
    await deleteNotification(notificationId);
    
    // 更新状态
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    setNotifications(updatedNotifications);
    
    // 更新未读数量
    const unreadNotifications = updatedNotifications.filter(notification => !notification.read);
    setUnreadCount(unreadNotifications.length);
  }, [notifications]);
  
  // 清除所有通知
  const clearAll = useCallback(async (): Promise<void> => {
    await clearAllNotifications();
    
    // 更新状态
    setNotifications([]);
    setUnreadCount(0);
  }, []);
  
  // 保存偏好设置
  const savePreferences = useCallback(async (newPreferences: NotificationPreferences): Promise<void> => {
    await saveNotificationPreferences(newPreferences);
    
    // 更新状态
    setPreferences(newPreferences);
  }, []);
  
  // 更新特定类型的通知偏好设置
  const updateTypePreference = useCallback(async (
    type: NotificationType,
    enabled: boolean,
    priority?: NotificationPriority
  ): Promise<void> => {
    await updateNotificationTypePreference(type, enabled, priority);
    
    // 更新状态
    setPreferences(prev => ({
      ...prev,
      typePreferences: {
        ...prev.typePreferences,
        [type]: {
          enabled,
          priority: priority || prev.typePreferences[type]?.priority || NotificationPriority.MEDIUM
        }
      }
    }));
  }, []);
  
  // 刷新通知
  const refreshNotifications = useCallback(async (): Promise<void> => {
    await loadNotifications();
  }, [loadNotifications]);
  
  // 初始化
  useEffect(() => {
    loadNotifications();
    
    // 注册数据刷新回调
    const unregister = registerRefreshListener('notifications', loadNotifications);
    
    return () => {
      unregister();
    };
  }, [loadNotifications, registerRefreshListener]);
  
  // 上下文值
  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    preferences,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    savePreferences,
    updateTypePreference,
    refreshNotifications
  };
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * 使用通知上下文的Hook
 * @returns 通知上下文
 */
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};
