// src/services/optimizedSyncService.ts
import { db } from '@/db-old';
import { queryClient } from '@/services/queryClient';
import { SyncStatus, SyncItem } from '@/services/dataSyncService';

// 优化的同步配置
interface OptimizedSyncConfig {
  // 自动同步间隔（毫秒）
  autoSyncInterval: number;
  // 最大重试次数
  maxRetryCount: number;
  // 批量同步大小
  batchSize: number;
  // 增量同步启用
  enableIncrementalSync: boolean;
  // 优先级同步启用
  enablePrioritySync: boolean;
  // 网络状态检测间隔（毫秒）
  networkCheckInterval: number;
  // 同步节流时间（毫秒）
  syncThrottleTime: number;
  // 同步超时时间（毫秒）
  syncTimeout: number;
  // 同步重试延迟（毫秒）
  retryDelay: number;
  // 同步冲突解决策略
  conflictResolution: 'client-wins' | 'server-wins' | 'manual';
  // 数据压缩启用
  enableCompression: boolean;
  // 同步日志启用
  enableSyncLogging: boolean;
  // 同步优先级表
  priorityTables: string[];
  // 同步缓存时间（毫秒）
  syncCacheTime: number;
}

// 默认优化同步配置
const DEFAULT_OPTIMIZED_SYNC_CONFIG: OptimizedSyncConfig = {
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
};

// 同步状态
interface SyncState {
  status: SyncStatus;
  lastSyncTime: Date | null;
  pendingCount: number;
  failedCount: number;
  successCount: number;
  isOnline: boolean;
  syncProgress: number;
  currentBatch: SyncItem[] | null;
  syncError: Error | null;
  syncHistory: SyncHistoryEntry[];
}

// 同步历史条目
interface SyncHistoryEntry {
  timestamp: Date;
  status: SyncStatus;
  itemCount: number;
  error?: string;
}

// 当前同步状态
const syncState: SyncState = {
  status: SyncStatus.IDLE,
  lastSyncTime: null,
  pendingCount: 0,
  failedCount: 0,
  successCount: 0,
  isOnline: navigator.onLine,
  syncProgress: 0,
  currentBatch: null,
  syncError: null,
  syncHistory: []
};

// 同步配置
let syncConfig: OptimizedSyncConfig = DEFAULT_OPTIMIZED_SYNC_CONFIG;

// 定时器
let autoSyncTimer: NodeJS.Timeout | null = null;
let networkCheckTimer: NodeJS.Timeout | null = null;
let syncThrottleTimer: NodeJS.Timeout | null = null;
let syncTimeoutTimer: NodeJS.Timeout | null = null;

// 同步锁，防止并发同步
let syncLock = false;

// 同步缓存
// const syncCache = new Map<string, { data: any, timestamp: number }>(); // Commented out as unused

/**
 * 初始化优化的数据同步服务
 * @param config 同步配置
 */
export function initializeOptimizedSync(config: Partial<OptimizedSyncConfig> = {}): void {
  // 合并配置
  syncConfig = { ...DEFAULT_OPTIMIZED_SYNC_CONFIG, ...config };

  // 启动网络状态检测
  startNetworkCheck();

  // 启动自动同步
  startAutoSync();

  // 添加在线/离线事件监听器
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  console.log('Optimized sync service initialized with config:', syncConfig);
}

/**
 * 启动网络状态检测
 */
function startNetworkCheck(): void {
  if (networkCheckTimer) {
    clearInterval(networkCheckTimer);
  }

  networkCheckTimer = setInterval(() => {
    checkNetworkStatus();
  }, syncConfig.networkCheckInterval);
}

/**
 * 检查网络状态
 */
async function checkNetworkStatus(): Promise<void> {
  try {
    // 简单的网络检测，可以替换为更复杂的实现
    const online = navigator.onLine;
    
    // 如果状态变化，更新并触发事件
    if (online !== syncState.isOnline) {
      syncState.isOnline = online;
      
      // 触发网络状态变化事件
      const networkEvent = new CustomEvent('networkStatusChanged', { 
        detail: { isOnline: online } 
      });
      window.dispatchEvent(networkEvent);
      
      // 如果恢复在线，尝试同步
      if (online) {
        console.log('Network connection restored, attempting to sync');
        syncPendingItems().catch(err => {
          console.error('Sync after network restore failed:', err);
        });
      }
    }
  } catch (err) {
    console.error('Network status check failed:', err);
  }
}

/**
 * 处理在线事件
 */
function handleOnline(): void {
  console.log('Device is online, updating sync state');
  syncState.isOnline = true;
  
  // 触发网络状态变化事件
  const networkEvent = new CustomEvent('networkStatusChanged', { 
    detail: { isOnline: true } 
  });
  window.dispatchEvent(networkEvent);
  
  // 尝试同步
  syncPendingItems().catch(err => {
    console.error('Sync after online event failed:', err);
  });
}

/**
 * 处理离线事件
 */
function handleOffline(): void {
  console.log('Device is offline, updating sync state');
  syncState.isOnline = false;
  
  // 触发网络状态变化事件
  const networkEvent = new CustomEvent('networkStatusChanged', { 
    detail: { isOnline: false } 
  });
  window.dispatchEvent(networkEvent);
}

/**
 * 启动自动同步
 */
function startAutoSync(): void {
  if (autoSyncTimer) {
    clearInterval(autoSyncTimer);
  }

  autoSyncTimer = setInterval(() => {
    if (syncState.isOnline) {
      syncPendingItems().catch(err => {
        console.error('Auto sync failed:', err);
      });
    }
  }, syncConfig.autoSyncInterval);
}

/**
 * 停止自动同步
 */
export function stopAutoSync(): void {
  if (autoSyncTimer) {
    clearInterval(autoSyncTimer);
    autoSyncTimer = null;
  }
  
  if (networkCheckTimer) {
    clearInterval(networkCheckTimer);
    networkCheckTimer = null;
  }
  
  // 移除事件监听器
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
  
  console.log('Auto sync stopped');
}

/**
 * 添加同步项目
 * @param table 表名
 * @param action 操作类型
 * @param data 数据
 * @param priority 优先级（1-5，5最高）
 */
export async function addOptimizedSyncItem(
  table: string,
  action: 'create' | 'update' | 'delete',
  data: any,
  priority: number = 3
): Promise<void> {
  try {
    // 检查表是否存在
    if (!db.tables.some(t => t.name === 'syncQueue')) {
      console.warn('syncQueue table does not exist yet, creating it');
      return;
    }

    // 检查数据是否有效
    if (!data || !data.id) {
      console.warn('Invalid data for sync item, skipping', data);
      return;
    }

    // 如果是增量同步，只存储变更的字段
    let syncData = data;
    if (syncConfig.enableIncrementalSync && action === 'update') {
      try {
        // 获取原始数据
        const originalData = await db.table(table).get(data.id);
        if (originalData) {
          // 只保留变更的字段
          const changedFields: Record<string, any> = { id: data.id };
          Object.keys(data).forEach(key => {
            if (JSON.stringify(data[key]) !== JSON.stringify(originalData[key])) {
              changedFields[key] = data[key];
            }
          });
          syncData = changedFields;
        }
      } catch (err) {
        console.error('Failed to compute incremental changes:', err);
        // 回退到完整数据
        syncData = data;
      }
    }

    // 如果启用压缩，压缩数据
    if (syncConfig.enableCompression && syncData) {
      try {
        // 这里只是示例，实际应用中应该使用真正的压缩算法
        syncData = {
          ...syncData,
          _compressed: true
        };
      } catch (err) {
        console.error('Failed to compress sync data:', err);
      }
    }

    const syncItem: SyncItem & { priority: number } = {
      id: `${table}_${data.id}_${Date.now()}`,
      table,
      action,
      data: syncData,
      timestamp: new Date(),
      retryCount: 0,
      status: SyncStatus.IDLE,
      priority
    };

    // 添加到同步队列
    await db.table('syncQueue').add(syncItem);

    // 更新待同步计数
    updatePendingSyncCount();

    // 触发自定义事件，通知同步状态指示器更新
    try {
      const syncEvent = new CustomEvent('syncItemAdded', { detail: syncItem });
      window.dispatchEvent(syncEvent);
    } catch (eventErr) {
      console.error('Failed to dispatch sync event:', eventErr);
    }

    console.log(`Optimized sync item added: ${table} ${action}`, data.id);

    // 如果是在线状态且是高优先级项目，立即尝试同步
    if (syncState.isOnline && (priority >= 4 || syncConfig.priorityTables.includes(table))) {
      // 使用节流来避免频繁同步
      throttledSync();
    }
  } catch (err) {
    console.error('Failed to add optimized sync item:', err);
  }
}

/**
 * 节流同步函数
 */
function throttledSync(): void {
  if (syncThrottleTimer) {
    // 已经有一个等待中的同步，不需要再设置
    return;
  }

  syncThrottleTimer = setTimeout(() => {
    syncThrottleTimer = null;
    syncPendingItems().catch(err => {
      console.error('Throttled sync failed:', err);
    });
  }, syncConfig.syncThrottleTime);
}

/**
 * 同步待处理项目
 */
export async function syncPendingItems(): Promise<void> {
  // 如果已经在同步中或离线，则跳过
  if (syncLock || !syncState.isOnline) {
    return;
  }

  // 获取同步锁
  syncLock = true;

  // 设置同步超时
  syncTimeoutTimer = setTimeout(() => {
    console.error('Sync operation timed out');
    syncLock = false;
    syncState.status = SyncStatus.ERROR;
    syncState.syncError = new Error('Sync operation timed out');
    
    // 触发同步状态变化事件
    const syncEvent = new CustomEvent('syncStatusChanged', { detail: syncState });
    window.dispatchEvent(syncEvent);
  }, syncConfig.syncTimeout);

  try {
    // 更新同步状态
    syncState.status = SyncStatus.SYNCING;
    syncState.syncProgress = 0;
    syncState.syncError = null;
    
    // 触发同步状态变化事件
    const syncStartEvent = new CustomEvent('syncStatusChanged', { detail: syncState });
    window.dispatchEvent(syncStartEvent);

    console.log('Optimized sync started');

    // 获取待处理项目
    const query = db.table('syncQueue')
      .where('status')
      .equals(SyncStatus.IDLE)
      .or('status')
      .equals(SyncStatus.ERROR)
      .filter(item => item.retryCount < syncConfig.maxRetryCount);

    // 如果启用优先级同步，先处理高优先级项目
    if (syncConfig.enablePrioritySync) {
      // 获取高优先级项目
      const highPriorityItems = await query
        .filter((item: SyncItem & { priority: number }) => item.priority >= 4 || syncConfig.priorityTables.includes(item.table))
        .limit(syncConfig.batchSize)
        .toArray();

      // 如果有高优先级项目，先处理它们
      if (highPriorityItems.length > 0) {
        await processSyncBatch(highPriorityItems);
      }
    }

    // 获取普通优先级项目
    const pendingItems = await query
      .limit(syncConfig.batchSize)
      .toArray();

    if (pendingItems.length === 0) {
      syncState.status = SyncStatus.IDLE;
      syncState.syncProgress = 100;
      syncState.lastSyncTime = new Date();
      
      // 添加同步历史
      addSyncHistoryEntry({
        timestamp: new Date(),
        status: SyncStatus.SUCCESS,
        itemCount: 0
      });
      
      // 触发同步状态变化事件
      const syncCompleteEvent = new CustomEvent('syncStatusChanged', { detail: syncState });
      window.dispatchEvent(syncCompleteEvent);
      
      console.log('No pending items to sync');
    } else {
      await processSyncBatch(pendingItems);
    }
  } catch (err) {
    console.error('Optimized sync failed:', err);
    syncState.status = SyncStatus.ERROR;
    syncState.syncError = err instanceof Error ? err : new Error(String(err));
    
    // 添加同步历史
    addSyncHistoryEntry({
      timestamp: new Date(),
      status: SyncStatus.ERROR,
      itemCount: 0,
      error: String(err)
    });
    
    // 触发同步状态变化事件
    const syncErrorEvent = new CustomEvent('syncStatusChanged', { detail: syncState });
    window.dispatchEvent(syncErrorEvent);
  } finally {
    // 清除同步超时
    if (syncTimeoutTimer) {
      clearTimeout(syncTimeoutTimer);
      syncTimeoutTimer = null;
    }
    
    // 释放同步锁
    syncLock = false;
    
    // 更新待同步计数
    updatePendingSyncCount();
  }
}

/**
 * 处理同步批次
 * @param items 同步项目
 */
async function processSyncBatch(items: SyncItem[]): Promise<void> {
  syncState.currentBatch = items;
  let successCount = 0;
  let failedCount = 0;
  
  console.log(`Processing ${items.length} sync items`);
  
  // 批量处理项目
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // 更新同步进度
    syncState.syncProgress = Math.round((i / items.length) * 100);
    
    try {
      // 在实际应用中，这里应该调用API进行同步
      // 这里只是模拟同步成功
      await simulateSyncItem(item);

      // 更新项目状态
      await db.table('syncQueue').update(item.id, {
        status: SyncStatus.SUCCESS
      });

      // 更新缓存，传递数据
      invalidateRelatedQueries(item.table, item.data);
      
      successCount++;
    } catch (err) {
      console.error(`Sync item ${item.id} failed:`, err);
      failedCount++;

      // 计算重试延迟（指数退避）
      const retryDelay = Math.min(
        syncConfig.retryDelay * Math.pow(2, item.retryCount),
        60000 // 最大1分钟
      );

      // 更新重试次数和状态
      await db.table('syncQueue').update(item.id, {
        retryCount: item.retryCount + 1,
        status: SyncStatus.ERROR,
        error: err instanceof Error ? err.message : String(err),
        nextRetryTime: new Date(Date.now() + retryDelay)
      });
    }
  }
  
  // 更新同步状态
  syncState.successCount += successCount;
  syncState.failedCount += failedCount;
  syncState.lastSyncTime = new Date();
  syncState.syncProgress = 100;
  syncState.status = failedCount > 0 ? SyncStatus.ERROR : SyncStatus.SUCCESS;
  
  // 添加同步历史
  addSyncHistoryEntry({
    timestamp: new Date(),
    status: syncState.status,
    itemCount: items.length,
    error: failedCount > 0 ? `${failedCount} items failed to sync` : undefined
  });
  
  // 清理已成功的项目
  await db.table('syncQueue')
    .where('status')
    .equals(SyncStatus.SUCCESS)
    .delete();
  
  // 触发同步状态变化事件
  const syncCompleteEvent = new CustomEvent('syncStatusChanged', { detail: syncState });
  window.dispatchEvent(syncCompleteEvent);
  
  console.log(`Sync batch completed: ${successCount} succeeded, ${failedCount} failed`);
}

/**
 * 模拟同步项目（实际应用中应替换为真实API调用）
 */
async function simulateSyncItem(item: SyncItem): Promise<void> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 模拟同步成功
  console.log(`Simulated sync for item ${item.id}:`, item);
}

/**
 * 使相关查询缓存失效
 * @param table 表名
 * @param data 数据
 */
function invalidateRelatedQueries(table: string, data?: any): void {
  // 触发自定义事件，通知组件刷新
  const refreshEvent = new CustomEvent('dataRefresh', {
    detail: { table, data }
  });
  window.dispatchEvent(refreshEvent);

  // 根据表名使相关查询缓存失效
  switch (table) {
    case 'tasks':
      // 如果有特定任务ID，只使该任务的缓存失效
      if (data && data.id) {
        queryClient.invalidateQueries({
          queryKey: ['tasks', data.id],
          exact: true
        });
        // 同时使任务列表缓存失效，但不重新获取数据
        queryClient.invalidateQueries({
          queryKey: ['tasks'],
          exact: true,
          refetchType: 'none'
        });
      } else {
        // 否则使所有任务缓存失效
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
      break;
    case 'pandaState':
      queryClient.invalidateQueries({ queryKey: ['pandaState'] });
      break;
    case 'abilities':
      queryClient.invalidateQueries({ queryKey: ['abilities'] });
      break;
    case 'rewards':
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      break;
    default:
      // 默认使所有查询缓存失效，但不重新获取数据
      queryClient.invalidateQueries({
        refetchType: 'none'
      });
  }
}

/**
 * 更新待同步计数
 */
async function updatePendingSyncCount(): Promise<void> {
  try {
    // 检查表是否存在
    if (!db.tables.some(table => table.name === 'syncQueue')) {
      syncState.pendingCount = 0;
      return;
    }

    const pendingCount = await db.table('syncQueue')
      .where('status')
      .equals(SyncStatus.IDLE)
      .or('status')
      .equals(SyncStatus.ERROR)
      .count();
    
    syncState.pendingCount = pendingCount;
    
    // 触发计数更新事件
    const countEvent = new CustomEvent('syncCountChanged', { 
      detail: { pendingCount } 
    });
    window.dispatchEvent(countEvent);
  } catch (err) {
    console.error('Error updating pending sync count:', err);
  }
}

/**
 * 添加同步历史条目
 */
function addSyncHistoryEntry(entry: SyncHistoryEntry): void {
  // 添加到历史记录
  syncState.syncHistory.unshift(entry);
  
  // 限制历史记录大小
  if (syncState.syncHistory.length > 20) {
    syncState.syncHistory = syncState.syncHistory.slice(0, 20);
  }
  
  // 如果启用同步日志，记录到控制台
  if (syncConfig.enableSyncLogging) {
    console.log('Sync history entry added:', entry);
  }
}

/**
 * 获取当前同步状态
 */
export function getSyncState(): SyncState {
  return { ...syncState };
}

/**
 * 手动触发同步
 */
export async function manualSync(): Promise<void> {
  return syncPendingItems();
}

/**
 * 清除同步历史
 */
export function clearSyncHistory(): void {
  syncState.syncHistory = [];
}

/**
 * 获取同步配置
 */
export function getSyncConfig(): OptimizedSyncConfig {
  return { ...syncConfig };
}

/**
 * 更新同步配置
 */
export function updateSyncConfig(newConfig: Partial<OptimizedSyncConfig>): void {
  syncConfig = { ...syncConfig, ...newConfig };
  
  // 重启自动同步和网络检测
  startAutoSync();
  startNetworkCheck();
  
  console.log('Sync config updated:', syncConfig);
}
