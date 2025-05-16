// src/services/offlineService.ts
import { db } from '@/db-old';
import { addSyncItem, SyncItem, SyncStatus } from './dataSyncService';
import type { OfflineStateRecord, OfflineActionRecord } from '@/types';

/**
 * 初始化离线支持
 */
export async function initializeOfflineSupport(): Promise<void> {
  try {
    // 检查是否已有离线状态记录
    const offlineState = await getOfflineState();
    
    if (!offlineState) {
      // 创建初始离线状态记录
      const initialState: Omit<OfflineStateRecord, 'id'> = {
        isOnline: navigator.onLine,
        lastOnlineTime: navigator.onLine ? new Date() : new Date(0),
        lastOfflineTime: navigator.onLine ? null : new Date(),
        pendingSyncCount: 0,
        updatedAt: new Date()
      };
      
      await db.offlineState.add(initialState);
    }
    
    // 设置网络状态监听器
    setupNetworkListeners();
    
    console.log('Offline support initialized');
  } catch (error) {
    console.error('Failed to initialize offline support:', error);
  }
}

/**
 * 设置网络状态监听器
 */
function setupNetworkListeners(): void {
  // 监听在线状态变化
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}

/**
 * 处理在线状态
 */
async function handleOnline(): Promise<void> {
  try {
    // 更新离线状态
    const offlineState = await getOfflineState();
    
    if (offlineState) {
      const updatedState: OfflineStateRecord = {
        ...offlineState,
        isOnline: true,
        lastOnlineTime: new Date(),
        updatedAt: new Date()
      };
      
      await db.offlineState.update(offlineState.id!, updatedState);
    }
    
    // 尝试同步离线操作
    await syncOfflineActions();
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('app:online'));
    
    console.log('App is online');
  } catch (error) {
    console.error('Failed to handle online state:', error);
  }
}

/**
 * 处理离线状态
 */
async function handleOffline(): Promise<void> {
  try {
    // 更新离线状态
    const offlineState = await getOfflineState();
    
    if (offlineState) {
      const updatedState: OfflineStateRecord = {
        ...offlineState,
        isOnline: false,
        lastOfflineTime: new Date(),
        updatedAt: new Date()
      };
      
      await db.offlineState.update(offlineState.id!, updatedState);
    }
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('app:offline'));
    
    console.log('App is offline');
  } catch (error) {
    console.error('Failed to handle offline state:', error);
  }
}

/**
 * 获取离线状态
 * @returns 离线状态记录
 */
export async function getOfflineState(): Promise<OfflineStateRecord | null> {
  try {
    // 获取离线状态记录
    const offlineStates = await db.offlineState.toArray();
    
    // 应该只有一条记录
    return offlineStates.length > 0 ? offlineStates[0] : null;
  } catch (error) {
    console.error('Failed to get offline state:', error);
    return null;
  }
}

/**
 * 检查是否在线
 * @returns 是否在线
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * 记录离线操作
 * @param actionType 操作类型
 * @param actionData 操作数据
 * @param tableName 表名
 * @param recordId 记录ID
 * @returns 是否成功记录
 */
export async function recordOfflineAction(
  actionType: string,
  actionData: any,
  tableName: string,
  recordId: number | string | null = null
): Promise<boolean> {
  try {
    // 创建离线操作记录
    const offlineAction: Omit<OfflineActionRecord, 'id'> = {
      actionType,
      actionData: JSON.stringify(actionData),
      tableName,
      recordId,
      createdAt: new Date(),
      processedAt: null,
      syncItemId: null,
      isError: false,
      errorMessage: null
    };
    
    // 添加到数据库
    await db.offlineActions.add(offlineAction);
    
    // 更新待同步计数
    await updatePendingSyncCount();
    
    return true;
  } catch (error) {
    console.error('Failed to record offline action:', error);
    return false;
  }
}

/**
 * 更新待同步计数
 */
async function updatePendingSyncCount(): Promise<void> {
  try {
    // 获取未处理的离线操作数量
    const pendingCount = await db.offlineActions
      .filter(item => item.processedAt === null)
      .count();
    
    // 更新离线状态
    const offlineState = await getOfflineState();
    
    if (offlineState) {
      const updatedState: OfflineStateRecord = {
        ...offlineState,
        pendingSyncCount: pendingCount,
        updatedAt: new Date()
      };
      
      await db.offlineState.update(offlineState.id!, updatedState);
    }
  } catch (error) {
    console.error('Failed to update pending sync count:', error);
  }
}

/**
 * 同步离线操作
 * @returns 同步的操作数量
 */
export async function syncOfflineActions(): Promise<number> {
  // 如果不在线，不执行同步
  if (!navigator.onLine) {
    return 0;
  }
  
  try {
    // 获取未处理的离线操作
    const pendingActions = await db.offlineActions
      .filter(item => item.processedAt === null)
      .toArray();
    
    if (pendingActions.length === 0) {
      return 0;
    }
    
    let syncedCount = 0;
    
    // 处理每个离线操作
    for (const action of pendingActions) {
      try {
        const actionData = JSON.parse(action.actionData);
        
        // 添加同步项
        await addSyncItem(
          action.tableName,
          action.actionType as any,
          actionData
        );
        
        // 更新离线操作记录
        const updatedAction: OfflineActionRecord = {
          ...action,
          processedAt: new Date(),
          syncItemId: null
        };
        
        await db.offlineActions.update(action.id!, updatedAction);
        
        syncedCount++;
      } catch (error) {
        // 记录错误
        const errorAction: OfflineActionRecord = {
          ...action,
          processedAt: new Date(),
          isError: true,
          errorMessage: error instanceof Error ? error.message : String(error)
        };
        
        await db.offlineActions.update(action.id!, errorAction);
        
        console.error('Failed to sync offline action:', error);
      }
    }
    
    // 更新待同步计数
    await updatePendingSyncCount();
    
    return syncedCount;
  } catch (error) {
    console.error('Failed to sync offline actions:', error);
    return 0;
  }
}

/**
 * 获取待同步操作数量
 * @returns 待同步操作数量
 */
export async function getPendingSyncCount(): Promise<number> {
  try {
    const offlineState = await getOfflineState();
    return offlineState ? offlineState.pendingSyncCount : 0;
  } catch (error) {
    console.error('Failed to get pending sync count:', error);
    return 0;
  }
}

/**
 * 清除已处理的离线操作
 * @param olderThanDays 清除多少天前的操作
 * @returns 清除的操作数量
 */
export async function clearProcessedOfflineActions(olderThanDays: number = 7): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    // 获取已处理且早于截止日期的操作
    const oldActions = await db.offlineActions
      .filter(action => action.processedAt !== null && new Date(action.processedAt!) < cutoffDate)
      .toArray();
    
    // 删除这些操作
    await db.offlineActions.bulkDelete(oldActions.map(action => action.id!));
    
    return oldActions.length;
  } catch (error) {
    console.error('Failed to clear processed offline actions:', error);
    return 0;
  }
}

export async function getOfflineQueue(): Promise<SyncItem[]> {
  try {
    return await db.syncQueue.toArray();
  } catch (error) {
    console.error('Failed to get offline queue:', error);
    return [];
  }
}

export async function processOfflineActions(): Promise<void> {
  try {
    await db.syncQueue.orderBy('timestamp').toArray();
  } catch (error) {
    console.error('Failed to process offline actions:', error);
  }
}

export async function clearOfflineQueue(): Promise<void> {
  try {
    await db.syncQueue.clear();
  } catch (error) {
    console.error('Failed to clear offline queue:', error);
  }
}

export async function checkAndTriggerSync(): Promise<void> {
  try {
    console.log('checkAndTriggerSync called, syncStatus check commented out for now.');
  } catch (error) {
    console.error('Failed to check and trigger sync:', error);
  }
}

export async function updateSyncStatus(newStatus: Partial<SyncStatus>): Promise<void> {
  try {
    console.log('updateSyncStatus called, syncStatus update commented out for now.', newStatus);
  } catch (error) {
    console.error('Failed to update sync status:', error);
  }
}

export async function initializeOfflineDb(): Promise<void> {
  try {
    console.log('Offline DB initialized (tables should be defined in db.ts).');
  } catch (error) {
    console.error('Failed to initialize offline DB:', error);
  }
}
