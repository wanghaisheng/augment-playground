// src/services/notificationService.ts
import { v4 as uuidv4 } from 'uuid';
import type { 
  Notification, 
  NotificationPreferences
} from '@/types/notification'; // Type-only imports
import { 
  NotificationType, 
  NotificationPriority,
  NotificationActionType,
  defaultNotificationPreferences
} from '@/types/notification'; // Value imports (enums, consts)
import { playSound, SoundType } from '@/utils/sound';
import { getLocalStorage, setLocalStorage } from '@/utils/storage';

// 本地存储键
const NOTIFICATIONS_STORAGE_KEY = 'panda_habit_notifications';
const NOTIFICATION_PREFS_STORAGE_KEY = 'panda_habit_notification_preferences';

/**
 * 获取所有通知
 * @returns 通知列表
 */
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const storedNotifications = getLocalStorage<Notification[]>(NOTIFICATIONS_STORAGE_KEY);
    return storedNotifications || [];
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return [];
  }
};

/**
 * 保存通知列表
 * @param notifications 通知列表
 */
export const saveNotifications = async (notifications: Notification[]): Promise<void> => {
  try {
    setLocalStorage(NOTIFICATIONS_STORAGE_KEY, notifications);
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
};

/**
 * 添加通知
 * @param notification 通知对象（不需要ID和时间戳）
 * @returns 添加后的通知对象
 */
export const addNotification = async (
  notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
): Promise<Notification> => {
  try {
    // 获取当前通知列表
    const notifications = await getNotifications();
    
    // 创建新通知
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      timestamp: Date.now(),
      read: false
    };
    
    // 添加到列表
    const updatedNotifications = [newNotification, ...notifications];
    
    // 保存更新后的列表
    await saveNotifications(updatedNotifications);
    
    // 获取通知偏好设置
    const preferences = await getNotificationPreferences();
    
    // 如果启用了声音，播放通知音效
    if (preferences.enabled && preferences.sound && 
        preferences.typePreferences[notification.type]?.enabled) {
      playNotificationSound(notification.priority);
    }
    
    // 如果启用了桌面通知，显示桌面通知
    if (preferences.enabled && preferences.desktop && 
        preferences.typePreferences[notification.type]?.enabled) {
      showDesktopNotification(newNotification);
    }
    
    return newNotification;
  } catch (error) {
    console.error('Failed to add notification:', error);
    throw error;
  }
};

/**
 * 标记通知为已读
 * @param notificationId 通知ID
 * @returns 是否成功
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    
    await saveNotifications(updatedNotifications);
    return true;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return false;
  }
};

/**
 * 标记所有通知为已读
 * @returns 是否成功
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    await saveNotifications(updatedNotifications);
    return true;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return false;
  }
};

/**
 * 删除通知
 * @param notificationId 通知ID
 * @returns 是否成功
 */
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    await saveNotifications(updatedNotifications);
    return true;
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return false;
  }
};

/**
 * 清除所有通知
 * @returns 是否成功
 */
export const clearAllNotifications = async (): Promise<boolean> => {
  try {
    await saveNotifications([]);
    return true;
  } catch (error) {
    console.error('Failed to clear all notifications:', error);
    return false;
  }
};

/**
 * 获取未读通知数量
 * @returns 未读通知数量
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const notifications = await getNotifications();
    return notifications.filter(notification => !notification.read).length;
  } catch (error) {
    console.error('Failed to get unread notification count:', error);
    return 0;
  }
};

/**
 * 获取通知偏好设置
 * @returns 通知偏好设置
 */
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  try {
    const storedPreferences = getLocalStorage<NotificationPreferences>(NOTIFICATION_PREFS_STORAGE_KEY);
    return storedPreferences || defaultNotificationPreferences;
  } catch (error) {
    console.error('Failed to get notification preferences:', error);
    return defaultNotificationPreferences;
  }
};

/**
 * 保存通知偏好设置
 * @param preferences 通知偏好设置
 * @returns 是否成功
 */
export const saveNotificationPreferences = async (
  preferences: NotificationPreferences
): Promise<boolean> => {
  try {
    setLocalStorage(NOTIFICATION_PREFS_STORAGE_KEY, preferences);
    return true;
  } catch (error) {
    console.error('Failed to save notification preferences:', error);
    return false;
  }
};

/**
 * 更新特定类型的通知偏好设置
 * @param type 通知类型
 * @param enabled 是否启用
 * @param priority 优先级
 * @returns 是否成功
 */
export const updateNotificationTypePreference = async (
  type: NotificationType,
  enabled: boolean,
  priority?: NotificationPriority
): Promise<boolean> => {
  try {
    const preferences = await getNotificationPreferences();
    
    const updatedPreferences: NotificationPreferences = {
      ...preferences,
      typePreferences: {
        ...preferences.typePreferences,
        [type]: {
          enabled,
          priority: priority || preferences.typePreferences[type]?.priority || NotificationPriority.MEDIUM
        }
      }
    };
    
    return await saveNotificationPreferences(updatedPreferences);
  } catch (error) {
    console.error('Failed to update notification type preference:', error);
    return false;
  }
};

/**
 * 播放通知音效
 * @param priority 通知优先级
 */
const playNotificationSound = (priority: NotificationPriority): void => {
  switch (priority) {
    case NotificationPriority.URGENT:
      playSound(SoundType.NOTIFICATION);
      break;
    case NotificationPriority.HIGH:
      playSound(SoundType.NOTIFICATION);
      break;
    case NotificationPriority.MEDIUM:
      playSound(SoundType.NOTIFICATION);
      break;
    case NotificationPriority.LOW:
      playSound(SoundType.NOTIFICATION);
      break;
    default:
      // For any other unhandled valid priority, or if a new one is added without a case, play the default.
      // Or, if specific sounds are desired for other priorities, they can be added here.
      playSound(SoundType.NOTIFICATION);
      break;
  }
};

/**
 * 显示桌面通知
 * @param notification 通知对象
 */
const showDesktopNotification = (notification: Notification): void => {
  if (Notification.permission === 'granted') {
    const desktopNotificationOptions: NotificationOptions = {
      body: notification.message,
      icon: notification.icon || '/assets/icons/logo.png',
      tag: notification.id, // Use notification ID as tag for coalescing
      // Note: Standard actions are more complex and might require service worker context for full functionality.
      // For simple client-side notifications, custom handling of 'actions' from our internal Notification type
      // would typically happen in the 'click' event handler of the notification if needed.
    };

    // Conditionally add renotify if a tag is present
    if (desktopNotificationOptions.tag) {
      (desktopNotificationOptions as any).renotify = true;
    }

    if (notification.image) {
      // Conditionally add the image property if it exists on our internal notification type
      // and if the browser's NotificationOptions supports it (or ignores it gracefully).
      (desktopNotificationOptions as any).image = notification.image;
    }

    try {
      const dn = new window.Notification(notification.title, desktopNotificationOptions);
      // Setup onclick handler for the actual desktop notification
      dn.onclick = () => {
        // If there's a navigate action in our internal notification, perform it
        const navigateAction = notification.actions?.find(action => action.type === NotificationActionType.NAVIGATE);
        if (navigateAction && navigateAction.value) {
          window.location.href = navigateAction.value; // Or use a router if available
        }
        // Mark our internal notification as read
        markNotificationAsRead(notification.id);
        // Focus the window
        window.focus();
        // Close this specific desktop notification
        dn.close();
      };
      dn.onerror = () => {
        console.error('Desktop notification error for:', notification.title);
      };

    } catch (e) {
      console.error("Error displaying desktop notification:", e);
    }
  }
};
