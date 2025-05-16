// src/types/notification.ts

/**
 * 通知优先级
 */
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * 通知类型
 */
export enum NotificationType {
  // 任务相关
  TASK_DUE_SOON = 'task_due_soon',         // 任务即将到期
  TASK_OVERDUE = 'task_overdue',           // 任务已过期
  TASK_COMPLETED = 'task_completed',       // 任务已完成
  TASK_REMINDER = 'task_reminder',         // 任务提醒
  
  // 挑战相关
  CHALLENGE_AVAILABLE = 'challenge_available', // 新挑战可用
  CHALLENGE_COMPLETED = 'challenge_completed', // 挑战已完成
  CHALLENGE_EXPIRING = 'challenge_expiring',   // 挑战即将过期
  
  // 成就相关
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked', // 解锁成就
  LEVEL_UP = 'level_up',                         // 等级提升
  
  // 熊猫相关
  PANDA_MOOD_LOW = 'panda_mood_low',       // 熊猫心情低落
  PANDA_ENERGY_LOW = 'panda_energy_low',   // 熊猫能量不足
  PANDA_EVOLUTION = 'panda_evolution',     // 熊猫进化
  
  // 系统相关
  SYSTEM_UPDATE = 'system_update',         // 系统更新
  FEATURE_ANNOUNCEMENT = 'feature_announcement', // 功能公告
  MAINTENANCE = 'maintenance',             // 维护通知
  
  // 社交相关
  FRIEND_REQUEST = 'friend_request',       // 好友请求
  FRIEND_ACTIVITY = 'friend_activity',     // 好友活动
  
  // VIP相关
  VIP_EXPIRING = 'vip_expiring',           // VIP即将到期
  VIP_BENEFIT = 'vip_benefit',             // VIP福利
  
  // 其他
  CUSTOM = 'custom'                        // 自定义通知
}

/**
 * 通知动作类型
 */
export enum NotificationActionType {
  NAVIGATE = 'navigate',   // 导航到特定页面
  FUNCTION = 'function',   // 执行特定函数
  DISMISS = 'dismiss',     // 忽略通知
  SNOOZE = 'snooze'        // 稍后提醒
}

/**
 * 通知动作接口
 */
export interface NotificationAction {
  // 动作类型
  type: NotificationActionType;
  // 动作标签
  label: string;
  // 动作值（如导航路径或函数名）
  value: string;
  // 动作图标（可选）
  icon?: string;
  // 动作参数（可选）
  params?: Record<string, unknown>;
}

/**
 * 通知接口
 */
export interface Notification {
  // 通知ID
  id: string;
  // 通知类型
  type: NotificationType;
  // 通知标题
  title: string;
  // 通知内容
  message: string;
  // 通知时间
  timestamp: number;
  // 通知优先级
  priority: NotificationPriority;
  // 是否已读
  read: boolean;
  // 通知图标
  icon?: string;
  // 通知图片
  image?: string;
  // 通知动作
  actions?: NotificationAction[];
  // 通知相关ID（如任务ID、挑战ID等）
  relatedId?: string;
  // 通知额外数据
  data?: Record<string, unknown>;
  // 通知过期时间（可选，毫秒时间戳）
  expiresAt?: number;
  // 通知分组ID（可选，用于将相关通知分组）
  groupId?: string;
}

/**
 * 通知偏好设置接口
 */
export interface NotificationPreferences {
  // 是否启用通知
  enabled: boolean;
  // 是否启用声音
  sound: boolean;
  // 是否启用振动
  vibration: boolean;
  // 是否启用桌面通知
  desktop: boolean;
  // 是否在锁屏时显示通知
  showOnLockScreen: boolean;
  // 通知显示时长（毫秒）
  displayDuration: number;
  // 每种通知类型的偏好设置
  typePreferences: Record<NotificationType, {
    enabled: boolean;
    priority: NotificationPriority;
  }>;
  // 免打扰时间段
  doNotDisturb: {
    enabled: boolean;
    startTime: string; // 格式: "HH:MM"
    endTime: string;   // 格式: "HH:MM"
  };
}

/**
 * 默认通知偏好设置
 */
export const defaultNotificationPreferences: NotificationPreferences = {
  enabled: true,
  sound: true,
  vibration: true,
  desktop: true,
  showOnLockScreen: true,
  displayDuration: 5000,
  typePreferences: {
    [NotificationType.TASK_DUE_SOON]: { enabled: true, priority: NotificationPriority.HIGH },
    [NotificationType.TASK_OVERDUE]: { enabled: true, priority: NotificationPriority.HIGH },
    [NotificationType.TASK_COMPLETED]: { enabled: true, priority: NotificationPriority.MEDIUM },
    [NotificationType.TASK_REMINDER]: { enabled: true, priority: NotificationPriority.MEDIUM },
    [NotificationType.CHALLENGE_AVAILABLE]: { enabled: true, priority: NotificationPriority.MEDIUM },
    [NotificationType.CHALLENGE_COMPLETED]: { enabled: true, priority: NotificationPriority.MEDIUM },
    [NotificationType.CHALLENGE_EXPIRING]: { enabled: true, priority: NotificationPriority.HIGH },
    [NotificationType.ACHIEVEMENT_UNLOCKED]: { enabled: true, priority: NotificationPriority.MEDIUM },
    [NotificationType.LEVEL_UP]: { enabled: true, priority: NotificationPriority.MEDIUM },
    [NotificationType.PANDA_MOOD_LOW]: { enabled: true, priority: NotificationPriority.MEDIUM },
    [NotificationType.PANDA_ENERGY_LOW]: { enabled: true, priority: NotificationPriority.MEDIUM },
    [NotificationType.PANDA_EVOLUTION]: { enabled: true, priority: NotificationPriority.MEDIUM },
    [NotificationType.SYSTEM_UPDATE]: { enabled: true, priority: NotificationPriority.LOW },
    [NotificationType.FEATURE_ANNOUNCEMENT]: { enabled: true, priority: NotificationPriority.LOW },
    [NotificationType.MAINTENANCE]: { enabled: true, priority: NotificationPriority.HIGH },
    [NotificationType.FRIEND_REQUEST]: { enabled: true, priority: NotificationPriority.MEDIUM },
    [NotificationType.FRIEND_ACTIVITY]: { enabled: true, priority: NotificationPriority.LOW },
    [NotificationType.VIP_EXPIRING]: { enabled: true, priority: NotificationPriority.HIGH },
    [NotificationType.VIP_BENEFIT]: { enabled: true, priority: NotificationPriority.MEDIUM },
    [NotificationType.CUSTOM]: { enabled: true, priority: NotificationPriority.MEDIUM }
  },
  doNotDisturb: {
    enabled: false,
    startTime: "22:00",
    endTime: "07:00"
  }
};
