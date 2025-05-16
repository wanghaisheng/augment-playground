// src/hooks/useOfflineStatus.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  isOnline, 
  getOfflineState, 
  getPendingSyncCount, 
  syncOfflineActions 
} from '@/services/offlineService';

/**
 * 离线状态钩子返回类型
 */
interface UseOfflineStatusReturn {
  isOnline: boolean;
  pendingSyncCount: number;
  lastOnlineTime: Date | null;
  lastOfflineTime: Date | null;
  syncPendingActions: () => Promise<number>;
}

/**
 * 离线状态钩子
 * 提供应用的在线/离线状态和相关功能
 */
export function useOfflineStatus(): UseOfflineStatusReturn {
  const [online, setOnline] = useState<boolean>(isOnline());
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);
  const [lastOfflineTime, setLastOfflineTime] = useState<Date | null>(null);
  
  // 加载离线状态
  const loadOfflineState = useCallback(async () => {
    try {
      const state = await getOfflineState();
      
      if (state) {
        setOnline(state.isOnline);
        setPendingCount(state.pendingSyncCount);
        setLastOnlineTime(new Date(state.lastOnlineTime));
        setLastOfflineTime(state.lastOfflineTime ? new Date(state.lastOfflineTime) : null);
      }
    } catch (error) {
      console.error('Failed to load offline state:', error);
    }
  }, []);
  
  // 更新待同步计数
  const updatePendingCount = useCallback(async () => {
    try {
      const count = await getPendingSyncCount();
      setPendingCount(count);
    } catch (error) {
      console.error('Failed to update pending count:', error);
    }
  }, []);
  
  // 同步待处理操作
  const syncPendingActions = useCallback(async () => {
    try {
      const syncedCount = await syncOfflineActions();
      await updatePendingCount();
      return syncedCount;
    } catch (error) {
      console.error('Failed to sync pending actions:', error);
      return 0;
    }
  }, [updatePendingCount]);
  
  // 处理在线状态变化
  const handleOnlineStatusChange = useCallback(() => {
    setOnline(navigator.onLine);
    loadOfflineState();
    
    if (navigator.onLine) {
      // 如果恢复在线，尝试同步待处理操作
      syncPendingActions();
    }
  }, [loadOfflineState, syncPendingActions]);
  
  // 处理自定义事件
  const handleAppOnline = useCallback(() => {
    setOnline(true);
    loadOfflineState();
  }, [loadOfflineState]);
  
  const handleAppOffline = useCallback(() => {
    setOnline(false);
    loadOfflineState();
  }, [loadOfflineState]);
  
  // 设置事件监听器
  useEffect(() => {
    // 加载初始状态
    loadOfflineState();
    updatePendingCount();
    
    // 监听在线状态变化
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    // 监听自定义事件
    window.addEventListener('app:online', handleAppOnline);
    window.addEventListener('app:offline', handleAppOffline);
    
    // 定期更新待同步计数
    const intervalId = setInterval(updatePendingCount, 30000);
    
    return () => {
      // 清理事件监听器
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      window.removeEventListener('app:online', handleAppOnline);
      window.removeEventListener('app:offline', handleAppOffline);
      
      clearInterval(intervalId);
    };
  }, [
    loadOfflineState, 
    updatePendingCount, 
    handleOnlineStatusChange, 
    handleAppOnline, 
    handleAppOffline
  ]);
  
  return {
    isOnline: online,
    pendingSyncCount: pendingCount,
    lastOnlineTime,
    lastOfflineTime,
    syncPendingActions
  };
}
