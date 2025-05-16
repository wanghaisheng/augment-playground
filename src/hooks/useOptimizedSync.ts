// src/hooks/useOptimizedSync.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  getSyncState, 
  manualSync, 
  getSyncConfig, 
  updateSyncConfig,
  addOptimizedSyncItem
} from '@/services/optimizedSyncService';
import { SyncStatus } from '@/services/dataSyncService';

interface UseOptimizedSyncResult {
  // 同步状态
  status: SyncStatus;
  // 是否正在同步
  isSyncing: boolean;
  // 是否有错误
  hasError: boolean;
  // 是否在线
  isOnline: boolean;
  // 待同步项目数量
  pendingCount: number;
  // 同步进度（0-100）
  syncProgress: number;
  // 最后同步时间
  lastSyncTime: Date | null;
  // 同步历史
  syncHistory: Array<{
    timestamp: Date;
    status: SyncStatus;
    itemCount: number;
    error?: string;
  }>;
  // 手动触发同步
  triggerSync: () => Promise<void>;
  // 添加同步项目
  addSyncItem: (
    table: string,
    action: 'create' | 'update' | 'delete',
    data: any,
    priority?: number
  ) => Promise<void>;
  // 获取同步配置
  syncConfig: ReturnType<typeof getSyncConfig>;
  // 更新同步配置
  updateConfig: (newConfig: Parameters<typeof updateSyncConfig>[0]) => void;
}

/**
 * 使用优化的同步服务的Hook
 * 
 * @returns 同步状态和操作
 */
export function useOptimizedSync(): UseOptimizedSyncResult {
  // 同步状态
  const [syncState, setSyncState] = useState(getSyncState());
  // 同步配置
  const [syncConfig, setSyncConfig] = useState(getSyncConfig());
  
  // 监听同步状态变化
  useEffect(() => {
    const handleSyncStatusChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSyncState(customEvent.detail);
    };
    
    const handleSyncCountChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSyncState(prev => ({
        ...prev,
        pendingCount: customEvent.detail.pendingCount
      }));
    };
    
    const handleNetworkStatusChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSyncState(prev => ({
        ...prev,
        isOnline: customEvent.detail.isOnline
      }));
    };
    
    // 添加事件监听器
    window.addEventListener('syncStatusChanged', handleSyncStatusChanged);
    window.addEventListener('syncCountChanged', handleSyncCountChanged);
    window.addEventListener('networkStatusChanged', handleNetworkStatusChanged);
    
    // 清理函数
    return () => {
      window.removeEventListener('syncStatusChanged', handleSyncStatusChanged);
      window.removeEventListener('syncCountChanged', handleSyncCountChanged);
      window.removeEventListener('networkStatusChanged', handleNetworkStatusChanged);
    };
  }, []);
  
  // 手动触发同步
  const triggerSync = useCallback(async () => {
    try {
      await manualSync();
    } catch (err) {
      console.error('Manual sync failed:', err);
    }
  }, []);
  
  // 添加同步项目
  const addSyncItem = useCallback(async (
    table: string,
    action: 'create' | 'update' | 'delete',
    data: any,
    priority: number = 3
  ) => {
    try {
      await addOptimizedSyncItem(table, action, data, priority);
    } catch (err) {
      console.error('Failed to add sync item:', err);
    }
  }, []);
  
  // 更新同步配置
  const updateConfig = useCallback((newConfig: Parameters<typeof updateSyncConfig>[0]) => {
    updateSyncConfig(newConfig);
    setSyncConfig(getSyncConfig());
  }, []);
  
  return {
    status: syncState.status,
    isSyncing: syncState.status === SyncStatus.SYNCING,
    hasError: syncState.status === SyncStatus.ERROR,
    isOnline: syncState.isOnline,
    pendingCount: syncState.pendingCount,
    syncProgress: syncState.syncProgress,
    lastSyncTime: syncState.lastSyncTime,
    syncHistory: syncState.syncHistory,
    triggerSync,
    addSyncItem,
    syncConfig,
    updateConfig
  };
}

/**
 * 使用优化的表同步的Hook
 * 
 * @param table 表名
 * @returns 同步状态和操作
 */
export function useTableSync(table: string): Omit<UseOptimizedSyncResult, 'addSyncItem'> & {
  addSyncItem: (
    action: 'create' | 'update' | 'delete',
    data: any,
    priority?: number
  ) => Promise<void>;
} {
  const sync = useOptimizedSync();
  
  // 添加表特定的同步项目
  const addSyncItem = useCallback(async (
    action: 'create' | 'update' | 'delete',
    data: any,
    priority: number = 3
  ) => {
    await sync.addSyncItem(table, action, data, priority);
  }, [sync.addSyncItem, table]);
  
  return {
    ...sync,
    addSyncItem
  };
}

/**
 * 使用优化的实体同步的Hook
 * 
 * @param table 表名
 * @param entityId 实体ID
 * @returns 同步状态和操作
 */
export function useEntitySync(table: string, entityId: string): Omit<UseOptimizedSyncResult, 'addSyncItem'> & {
  updateEntity: (data: any, priority?: number) => Promise<void>;
  deleteEntity: (priority?: number) => Promise<void>;
} {
  const tableSync = useTableSync(table);
  
  // 更新实体
  const updateEntity = useCallback(async (
    data: any,
    priority: number = 3
  ) => {
    // 确保数据包含ID
    const entityData = { ...data, id: entityId };
    await tableSync.addSyncItem('update', entityData, priority);
  }, [tableSync.addSyncItem, entityId]);
  
  // 删除实体
  const deleteEntity = useCallback(async (
    priority: number = 3
  ) => {
    await tableSync.addSyncItem('delete', { id: entityId }, priority);
  }, [tableSync.addSyncItem, entityId]);
  
  return {
    ...tableSync,
    updateEntity,
    deleteEntity
  };
}
