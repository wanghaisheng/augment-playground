// src/services/syncInitializer.ts
import { initializeDataSync } from '@/services/dataSyncService';
import { initializeOptimizedSync } from '@/services/optimizedSyncService';

/**
 * 同步服务初始化器
 * 
 * 初始化数据同步服务，包括传统同步和优化同步
 */
export function initializeSyncServices(): void {
  // 初始化传统同步服务（保持向后兼容）
  initializeDataSync({
    autoSyncInterval: 60000, // 1分钟
    maxRetryCount: 3,
    batchSize: 10
  });
  
  // 初始化优化同步服务
  initializeOptimizedSync({
    autoSyncInterval: 30000, // 30秒
    maxRetryCount: 5,
    batchSize: 20,
    enableIncrementalSync: true,
    enablePrioritySync: true,
    networkCheckInterval: 10000, // 10秒
    syncThrottleTime: 2000, // 2秒
    syncTimeout: 30000, // 30秒
    retryDelay: 5000, // 5秒
    conflictResolution: 'client-wins',
    enableCompression: true,
    enableSyncLogging: true,
    priorityTables: ['tasks', 'pandaState', 'abilities'],
    syncCacheTime: 60000 // 1分钟
  });
  
  console.log('Sync services initialized');
}

/**
 * 获取用户同步偏好
 * 
 * 从本地存储中获取用户的同步偏好设置
 */
export function getUserSyncPreferences(): Record<string, any> {
  try {
    const storedPreferences = localStorage.getItem('syncPreferences');
    if (storedPreferences) {
      return JSON.parse(storedPreferences);
    }
  } catch (err) {
    console.error('Failed to parse sync preferences:', err);
  }
  
  return {};
}

/**
 * 保存用户同步偏好
 * 
 * 将用户的同步偏好设置保存到本地存储
 */
export function saveUserSyncPreferences(preferences: Record<string, any>): void {
  try {
    localStorage.setItem('syncPreferences', JSON.stringify(preferences));
  } catch (err) {
    console.error('Failed to save sync preferences:', err);
  }
}

/**
 * 应用用户同步偏好
 * 
 * 应用用户的同步偏好设置到同步服务
 */
export function applyUserSyncPreferences(): void {
  try {
    const preferences = getUserSyncPreferences();
    
    // 如果有存储的偏好设置，重新初始化优化同步服务
    if (Object.keys(preferences).length > 0) {
      initializeOptimizedSync(preferences);
      console.log('Applied user sync preferences');
    }
  } catch (err) {
    console.error('Failed to apply sync preferences:', err);
  }
}
