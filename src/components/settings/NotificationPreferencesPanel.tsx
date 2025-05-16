// src/components/settings/NotificationPreferencesPanel.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/context/NotificationProvider';
import { 
  NotificationType, 
  NotificationPriority 
} from '@/types/notification';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import Button from '@/components/common/Button';
import Switch from '@/components/common/Switch';
import { playSound, SoundType } from '@/utils/sound';

/**
 * 通知偏好设置面板组件
 * 
 * 用于设置通知偏好，包括全局设置和各类型通知的设置
 */
const NotificationPreferencesPanel: React.FC = () => {
  // 上下文
  const { preferences, savePreferences, updateTypePreference } = useNotifications();
  
  // 状态
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [timeInputs, setTimeInputs] = useState({
    startTime: preferences.doNotDisturb.startTime,
    endTime: preferences.doNotDisturb.endTime
  });
  
  // 本地化标签
  const { labels } = useLocalizedView({
    scope: 'settings',
    labels: {
      notifications: {
        title: {
          en: 'Notification Settings',
          zh: '通知设置'
        },
        globalSettings: {
          en: 'Global Settings',
          zh: '全局设置'
        },
        enableNotifications: {
          en: 'Enable Notifications',
          zh: '启用通知'
        },
        sound: {
          en: 'Sound',
          zh: '声音'
        },
        vibration: {
          en: 'Vibration',
          zh: '振动'
        },
        desktop: {
          en: 'Desktop Notifications',
          zh: '桌面通知'
        },
        showOnLockScreen: {
          en: 'Show on Lock Screen',
          zh: '在锁屏上显示'
        },
        displayDuration: {
          en: 'Display Duration',
          zh: '显示时长'
        },
        seconds: {
          en: 'seconds',
          zh: '秒'
        },
        doNotDisturb: {
          en: 'Do Not Disturb',
          zh: '勿扰模式'
        },
        from: {
          en: 'From',
          zh: '从'
        },
        to: {
          en: 'to',
          zh: '到'
        },
        notificationTypes: {
          en: 'Notification Types',
          zh: '通知类型'
        },
        priority: {
          en: 'Priority',
          zh: '优先级'
        },
        priorityLevels: {
          low: {
            en: 'Low',
            zh: '低'
          },
          medium: {
            en: 'Medium',
            zh: '中'
          },
          high: {
            en: 'High',
            zh: '高'
          },
          urgent: {
            en: 'Urgent',
            zh: '紧急'
          }
        },
        typeLabels: {
          task_due_soon: {
            en: 'Task Due Soon',
            zh: '任务即将到期'
          },
          task_overdue: {
            en: 'Task Overdue',
            zh: '任务已过期'
          },
          task_completed: {
            en: 'Task Completed',
            zh: '任务已完成'
          },
          task_reminder: {
            en: 'Task Reminder',
            zh: '任务提醒'
          },
          challenge_available: {
            en: 'Challenge Available',
            zh: '新挑战可用'
          },
          challenge_completed: {
            en: 'Challenge Completed',
            zh: '挑战已完成'
          },
          challenge_expiring: {
            en: 'Challenge Expiring',
            zh: '挑战即将过期'
          },
          achievement_unlocked: {
            en: 'Achievement Unlocked',
            zh: '解锁成就'
          },
          level_up: {
            en: 'Level Up',
            zh: '等级提升'
          },
          panda_mood_low: {
            en: 'Panda Mood Low',
            zh: '熊猫心情低落'
          },
          panda_energy_low: {
            en: 'Panda Energy Low',
            zh: '熊猫能量不足'
          },
          panda_evolution: {
            en: 'Panda Evolution',
            zh: '熊猫进化'
          },
          system_update: {
            en: 'System Update',
            zh: '系统更新'
          },
          feature_announcement: {
            en: 'Feature Announcement',
            zh: '功能公告'
          },
          maintenance: {
            en: 'Maintenance',
            zh: '维护通知'
          },
          friend_request: {
            en: 'Friend Request',
            zh: '好友请求'
          },
          friend_activity: {
            en: 'Friend Activity',
            zh: '好友活动'
          },
          vip_expiring: {
            en: 'VIP Expiring',
            zh: 'VIP即将到期'
          },
          vip_benefit: {
            en: 'VIP Benefit',
            zh: 'VIP福利'
          },
          custom: {
            en: 'Custom',
            zh: '自定义通知'
          }
        },
        saveButton: {
          en: 'Save Settings',
          zh: '保存设置'
        },
        resetButton: {
          en: 'Reset to Defaults',
          zh: '恢复默认设置'
        },
        advancedSettings: {
          en: 'Advanced Settings',
          zh: '高级设置'
        },
        hideAdvancedSettings: {
          en: 'Hide Advanced Settings',
          zh: '隐藏高级设置'
        }
      }
    }
  });
  
  // 当preferences变化时更新本地状态
  useEffect(() => {
    setLocalPreferences(preferences);
    setTimeInputs({
      startTime: preferences.doNotDisturb.startTime,
      endTime: preferences.doNotDisturb.endTime
    });
  }, [preferences]);
  
  // 处理全局开关变化
  const handleGlobalToggle = (enabled: boolean) => {
    playSound(SoundType.BUTTON_CLICK);
    setLocalPreferences(prev => ({
      ...prev,
      enabled
    }));
  };
  
  // 处理声音开关变化
  const handleSoundToggle = (enabled: boolean) => {
    playSound(SoundType.BUTTON_CLICK);
    setLocalPreferences(prev => ({
      ...prev,
      sound: enabled
    }));
  };
  
  // 处理振动开关变化
  const handleVibrationToggle = (enabled: boolean) => {
    playSound(SoundType.BUTTON_CLICK);
    setLocalPreferences(prev => ({
      ...prev,
      vibration: enabled
    }));
  };
  
  // 处理桌面通知开关变化
  const handleDesktopToggle = (enabled: boolean) => {
    playSound(SoundType.BUTTON_CLICK);
    
    // 如果启用，请求权限
    if (enabled && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    
    setLocalPreferences(prev => ({
      ...prev,
      desktop: enabled
    }));
  };
  
  // 处理锁屏显示开关变化
  const handleLockScreenToggle = (enabled: boolean) => {
    playSound(SoundType.BUTTON_CLICK);
    setLocalPreferences(prev => ({
      ...prev,
      showOnLockScreen: enabled
    }));
  };
  
  // 处理显示时长变化
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLocalPreferences(prev => ({
      ...prev,
      displayDuration: value
    }));
  };
  
  // 处理勿扰模式开关变化
  const handleDoNotDisturbToggle = (enabled: boolean) => {
    playSound(SoundType.BUTTON_CLICK);
    setLocalPreferences(prev => ({
      ...prev,
      doNotDisturb: {
        ...prev.doNotDisturb,
        enabled
      }
    }));
  };
  
  // 处理时间输入变化
  const handleTimeInputChange = (field: 'startTime' | 'endTime', value: string) => {
    setTimeInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // 处理时间输入失去焦点
  const handleTimeInputBlur = () => {
    setLocalPreferences(prev => ({
      ...prev,
      doNotDisturb: {
        ...prev.doNotDisturb,
        startTime: timeInputs.startTime,
        endTime: timeInputs.endTime
      }
    }));
  };
  
  // 处理通知类型开关变化
  const handleTypeToggle = (type: NotificationType, enabled: boolean) => {
    playSound(SoundType.BUTTON_CLICK);
    setLocalPreferences(prev => ({
      ...prev,
      typePreferences: {
        ...prev.typePreferences,
        [type]: {
          ...prev.typePreferences[type],
          enabled
        }
      }
    }));
  };
  
  // 处理通知类型优先级变化
  const handlePriorityChange = (type: NotificationType, priority: NotificationPriority) => {
    playSound(SoundType.BUTTON_CLICK);
    setLocalPreferences(prev => ({
      ...prev,
      typePreferences: {
        ...prev.typePreferences,
        [type]: {
          ...prev.typePreferences[type],
          priority
        }
      }
    }));
  };
  
  // 保存设置
  const handleSaveSettings = async () => {
    playSound(SoundType.BUTTON_CLICK);
    await savePreferences(localPreferences);
  };
  
  // 重置为默认设置
  const handleResetSettings = () => {
    playSound(SoundType.BUTTON_CLICK);
    setLocalPreferences(preferences);
  };
  
  // 获取通知类型名称
  const getTypeLabel = (type: NotificationType) => {
    return labels.notifications.typeLabels[type as keyof typeof labels.notifications.typeLabels];
  };
  
  // 获取优先级名称
  const getPriorityLabel = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.LOW:
        return labels.notifications.priorityLevels.low;
      case NotificationPriority.MEDIUM:
        return labels.notifications.priorityLevels.medium;
      case NotificationPriority.HIGH:
        return labels.notifications.priorityLevels.high;
      case NotificationPriority.URGENT:
        return labels.notifications.priorityLevels.urgent;
      default:
        return labels.notifications.priorityLevels.medium;
    }
  };
  
  // 按类别分组通知类型
  const notificationTypesByCategory = {
    task: [
      NotificationType.TASK_DUE_SOON,
      NotificationType.TASK_OVERDUE,
      NotificationType.TASK_COMPLETED,
      NotificationType.TASK_REMINDER
    ],
    challenge: [
      NotificationType.CHALLENGE_AVAILABLE,
      NotificationType.CHALLENGE_COMPLETED,
      NotificationType.CHALLENGE_EXPIRING
    ],
    achievement: [
      NotificationType.ACHIEVEMENT_UNLOCKED,
      NotificationType.LEVEL_UP
    ],
    panda: [
      NotificationType.PANDA_MOOD_LOW,
      NotificationType.PANDA_ENERGY_LOW,
      NotificationType.PANDA_EVOLUTION
    ],
    system: [
      NotificationType.SYSTEM_UPDATE,
      NotificationType.FEATURE_ANNOUNCEMENT,
      NotificationType.MAINTENANCE
    ],
    social: [
      NotificationType.FRIEND_REQUEST,
      NotificationType.FRIEND_ACTIVITY
    ],
    vip: [
      NotificationType.VIP_EXPIRING,
      NotificationType.VIP_BENEFIT
    ],
    other: [
      NotificationType.CUSTOM
    ]
  };
  
  // 类别名称
  const categoryNames = {
    task: '任务',
    challenge: '挑战',
    achievement: '成就',
    panda: '熊猫',
    system: '系统',
    social: '社交',
    vip: 'VIP',
    other: '其他'
  };
  
  return (
    <div className="notification-preferences-panel">
      <h3 className="text-lg font-medium mb-4 text-jade-800">
        {labels.notifications.title}
      </h3>
      
      {/* 全局设置 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-md font-medium mb-3 text-jade-700">
          {labels.notifications.globalSettings}
        </h4>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {labels.notifications.enableNotifications}
          </span>
          <Switch
            checked={localPreferences.enabled}
            onChange={handleGlobalToggle}
            size="medium"
            color="jade"
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {labels.notifications.sound}
          </span>
          <Switch
            checked={localPreferences.sound}
            onChange={handleSoundToggle}
            disabled={!localPreferences.enabled}
            size="medium"
            color="jade"
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {labels.notifications.vibration}
          </span>
          <Switch
            checked={localPreferences.vibration}
            onChange={handleVibrationToggle}
            disabled={!localPreferences.enabled}
            size="medium"
            color="jade"
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {labels.notifications.desktop}
          </span>
          <Switch
            checked={localPreferences.desktop}
            onChange={handleDesktopToggle}
            disabled={!localPreferences.enabled}
            size="medium"
            color="jade"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">
              {labels.notifications.displayDuration}
            </span>
            <span className="text-sm text-gray-500">
              {localPreferences.displayDuration / 1000} {labels.notifications.seconds}
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="10000"
            step="1000"
            value={localPreferences.displayDuration}
            onChange={handleDurationChange}
            disabled={!localPreferences.enabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          />
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {labels.notifications.doNotDisturb}
          </span>
          <Switch
            checked={localPreferences.doNotDisturb.enabled}
            onChange={handleDoNotDisturbToggle}
            disabled={!localPreferences.enabled}
            size="medium"
            color="jade"
          />
        </div>
        
        {localPreferences.doNotDisturb.enabled && (
          <div className="flex items-center space-x-2 ml-4 mt-2">
            <span className="text-xs text-gray-500">
              {labels.notifications.from}
            </span>
            <input
              type="time"
              value={timeInputs.startTime}
              onChange={(e) => handleTimeInputChange('startTime', e.target.value)}
              onBlur={handleTimeInputBlur}
              disabled={!localPreferences.enabled}
              className="text-xs p-1 border border-gray-300 rounded"
            />
            <span className="text-xs text-gray-500">
              {labels.notifications.to}
            </span>
            <input
              type="time"
              value={timeInputs.endTime}
              onChange={(e) => handleTimeInputChange('endTime', e.target.value)}
              onBlur={handleTimeInputBlur}
              disabled={!localPreferences.enabled}
              className="text-xs p-1 border border-gray-300 rounded"
            />
          </div>
        )}
      </div>
      
      {/* 高级设置切换 */}
      <div className="mb-4">
        <Button
          variant="text"
          color="jade"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="text-sm"
        >
          {showAdvancedSettings 
            ? labels.notifications.hideAdvancedSettings 
            : labels.notifications.advancedSettings}
        </Button>
      </div>
      
      {/* 高级设置 */}
      <AnimatePresence>
        {showAdvancedSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-md font-medium mb-3 text-jade-700">
                {labels.notifications.notificationTypes}
              </h4>
              
              {/* 通知类型设置 */}
              {Object.entries(notificationTypesByCategory).map(([category, types]) => (
                <div key={category} className="mb-4 pb-3 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                  <h5 className="text-sm font-medium text-jade-600 mb-2">
                    {categoryNames[category as keyof typeof categoryNames]}
                  </h5>
                  
                  {types.map(type => (
                    <div key={type} className="mb-3 last:mb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">
                          {getTypeLabel(type)}
                        </span>
                        <Switch
                          checked={localPreferences.typePreferences[type]?.enabled ?? true}
                          onChange={(checked) => handleTypeToggle(type, checked)}
                          disabled={!localPreferences.enabled}
                          size="small"
                          color="jade"
                        />
                      </div>
                      
                      <div className="flex items-center ml-4">
                        <span className="text-xs text-gray-500 mr-2">
                          {labels.notifications.priority}:
                        </span>
                        <select
                          value={localPreferences.typePreferences[type]?.priority ?? NotificationPriority.MEDIUM}
                          onChange={(e) => handlePriorityChange(type, e.target.value as NotificationPriority)}
                          disabled={!localPreferences.enabled || !localPreferences.typePreferences[type]?.enabled}
                          className="text-xs p-1 border border-gray-300 rounded bg-white disabled:opacity-50"
                        >
                          <option value={NotificationPriority.LOW}>
                            {labels.notifications.priorityLevels.low}
                          </option>
                          <option value={NotificationPriority.MEDIUM}>
                            {labels.notifications.priorityLevels.medium}
                          </option>
                          <option value={NotificationPriority.HIGH}>
                            {labels.notifications.priorityLevels.high}
                          </option>
                          <option value={NotificationPriority.URGENT}>
                            {labels.notifications.priorityLevels.urgent}
                          </option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 操作按钮 */}
      <div className="flex justify-between mt-4">
        <Button
          variant="outlined"
          color="jade"
          onClick={handleResetSettings}
        >
          {labels.notifications.resetButton}
        </Button>
        <Button
          variant="jade"
          onClick={handleSaveSettings}
        >
          {labels.notifications.saveButton}
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferencesPanel;
