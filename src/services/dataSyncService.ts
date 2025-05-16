// src/services/dataSyncService.ts
import { db } from '@/db-old';
import { queryClient } from '@/services/queryClient';

// 同步状态枚举
export enum SyncStatus {
  IDLE = 'idle',
  SYNCING = 'syncing',
  SUCCESS = 'success',
  ERROR = 'error'
}

// 同步项目类型
export interface SyncItem {
  id: string;
  table: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: Date;
  retryCount: number;
  status: SyncStatus;
  error?: string;
}

// 同步配置
interface SyncConfig {
  autoSyncInterval: number; // 自动同步间隔（毫秒）
  maxRetryCount: number; // 最大重试次数
  batchSize: number; // 批量同步大小
}

// 默认同步配置
const DEFAULT_SYNC_CONFIG: SyncConfig = {
  autoSyncInterval: 60000, // 1分钟
  maxRetryCount: 3,
  batchSize: 10
};

// 当前同步状态
let currentSyncStatus: SyncStatus = SyncStatus.IDLE;
let syncConfig: SyncConfig = DEFAULT_SYNC_CONFIG;
let autoSyncInterval: NodeJS.Timeout | null = null;

/**
 * 初始化数据同步服务
 * @param config 同步配置
 */
export function initializeDataSync(config: Partial<SyncConfig> = {}): void {
  // 合并配置
  syncConfig = { ...DEFAULT_SYNC_CONFIG, ...config };

  // 启动自动同步
  startAutoSync();

  console.log('Data sync service initialized');
}

/**
 * 启动自动同步
 */
function startAutoSync(): void {
  if (autoSyncInterval) {
    clearInterval(autoSyncInterval);
  }

  autoSyncInterval = setInterval(() => {
    syncPendingItems().catch(err => {
      console.error('Auto sync failed:', err);
    });
  }, syncConfig.autoSyncInterval);
}

/**
 * 停止自动同步
 */
export function stopAutoSync(): void {
  if (autoSyncInterval) {
    clearInterval(autoSyncInterval);
    autoSyncInterval = null;
  }
}

/**
 * 添加同步项目
 * @param table 表名
 * @param action 操作类型
 * @param data 数据
 */
export async function addSyncItem(
  table: string,
  action: 'create' | 'update' | 'delete',
  data: any
): Promise<void> {
  try {
    // 检查表是否存在
    if (!db.tables.some(t => t.name === 'syncQueue')) {
      console.warn('syncQueue table does not exist yet, creating it');
      // 在实际应用中，这里应该创建表或重新初始化数据库
      // 但在这个示例中，我们只是记录警告并返回
      return;
    }

    // 检查数据是否有效
    if (!data || !data.id) {
      console.warn('Invalid data for sync item, skipping', data);
      return;
    }

    const syncItem: SyncItem = {
      id: `${table}_${data.id}_${Date.now()}`,
      table,
      action,
      data,
      timestamp: new Date(),
      retryCount: 0,
      status: SyncStatus.IDLE
    };

    // 添加到同步队列
    await db.table('syncQueue').add(syncItem);

    // 触发自定义事件，通知同步状态指示器更新
    try {
      const syncEvent = new CustomEvent('syncItemAdded', { detail: syncItem });
      window.dispatchEvent(syncEvent);
    } catch (eventErr) {
      console.error('Failed to dispatch sync event:', eventErr);
    }

    console.log(`Sync item added: ${table} ${action}`, data.id);

    // 如果是在线状态，立即尝试同步
    if (navigator.onLine) {
      syncPendingItems().catch(err => {
        console.error('Sync failed:', err);
      });
    }
  } catch (err) {
    console.error('Failed to add sync item:', err);
  }
}

/**
 * 同步待处理项目
 */
export async function syncPendingItems(): Promise<void> {
  // 如果已经在同步中，则跳过
  if (currentSyncStatus === SyncStatus.SYNCING) {
    return;
  }

  // 如果离线，则跳过
  if (!navigator.onLine) {
    return;
  }

  // 检查表是否存在
  try {
    if (!db.tables.some(table => table.name === 'syncQueue')) {
      console.warn('syncQueue table does not exist yet');
      return;
    }
  } catch (err) {
    console.error('Error checking syncQueue table:', err);
    return;
  }

  try {
    // 更新同步状态并触发事件
    currentSyncStatus = SyncStatus.SYNCING;
    const syncEvent = new CustomEvent('syncStatusChanged', { detail: currentSyncStatus });
    window.dispatchEvent(syncEvent);

    console.log('Sync started');

    // 获取待处理项目
    const pendingItems = await db.table('syncQueue')
      .where('status')
      .equals(SyncStatus.IDLE)
      .or('status')
      .equals(SyncStatus.ERROR)
      .filter(item => item.retryCount < syncConfig.maxRetryCount)
      .limit(syncConfig.batchSize)
      .toArray();

    if (pendingItems.length === 0) {
      currentSyncStatus = SyncStatus.IDLE;
      const syncCompleteEvent = new CustomEvent('syncStatusChanged', { detail: currentSyncStatus });
      window.dispatchEvent(syncCompleteEvent);
      console.log('No pending items to sync');
      return;
    }

    console.log(`Found ${pendingItems.length} items to sync`);

    // 批量处理项目
    for (const item of pendingItems) {
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
      } catch (err) {
        console.error(`Sync item ${item.id} failed:`, err);

        // 更新重试次数和状态
        await db.table('syncQueue').update(item.id, {
          retryCount: item.retryCount + 1,
          status: SyncStatus.ERROR,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }

    // 清理已成功的项目
    await db.table('syncQueue')
      .where('status')
      .equals(SyncStatus.SUCCESS)
      .delete();

    // 更新同步状态并触发事件
    currentSyncStatus = SyncStatus.SUCCESS;
    const syncSuccessEvent = new CustomEvent('syncStatusChanged', { detail: currentSyncStatus });
    window.dispatchEvent(syncSuccessEvent);

    console.log('Sync completed successfully');

    // 2秒后重置状态为空闲
    setTimeout(() => {
      currentSyncStatus = SyncStatus.IDLE;
      const resetEvent = new CustomEvent('syncStatusChanged', { detail: currentSyncStatus });
      window.dispatchEvent(resetEvent);
    }, 2000);
  } catch (err) {
    console.error('Sync failed:', err);
    currentSyncStatus = SyncStatus.ERROR;

    // 触发错误事件
    const syncErrorEvent = new CustomEvent('syncStatusChanged', { detail: currentSyncStatus });
    window.dispatchEvent(syncErrorEvent);
  }
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
  // 这将通过 DataRefreshProvider 传播到所有使用 useDataRefresh 和 useTableRefresh 的组件
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
 * 获取当前同步状态
 */
export function getCurrentSyncStatus(): SyncStatus {
  return currentSyncStatus;
}

/**
 * 获取待同步项目数量
 */
export async function getPendingSyncCount(): Promise<number> {
  try {
    // 检查表是否存在
    if (!db.tables.some(table => table.name === 'syncQueue')) {
      console.warn('syncQueue table does not exist yet');
      return 0;
    }

    return db.table('syncQueue')
      .where('status')
      .equals(SyncStatus.IDLE)
      .or('status')
      .equals(SyncStatus.ERROR)
      .count();
  } catch (err) {
    console.error('Error getting pending sync count:', err);
    return 0;
  }
}

/**
 * 手动触发同步
 */
export async function manualSync(): Promise<void> {
  return syncPendingItems();
}
