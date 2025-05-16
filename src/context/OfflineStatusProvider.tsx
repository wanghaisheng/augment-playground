// src/context/OfflineStatusProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

/**
 * 离线状态上下文类型
 */
interface OfflineStatusContextType {
  isOnline: boolean;
  pendingSyncCount: number;
  lastOnlineTime: Date | null;
  lastOfflineTime: Date | null;
  syncPendingActions: () => Promise<number>;
}

// 创建上下文
const OfflineStatusContext = createContext<OfflineStatusContextType | undefined>(undefined);

/**
 * 离线状态提供者属性
 */
interface OfflineStatusProviderProps {
  children: ReactNode;
}

/**
 * 离线状态提供者组件
 * 提供应用的在线/离线状态和相关功能
 */
export const OfflineStatusProvider: React.FC<OfflineStatusProviderProps> = ({ children }) => {
  const offlineStatus = useOfflineStatus();
  
  return (
    <OfflineStatusContext.Provider value={offlineStatus}>
      {children}
    </OfflineStatusContext.Provider>
  );
};

/**
 * 使用离线状态钩子
 * 在组件中获取离线状态和相关功能
 */
export function useOfflineStatusContext(): OfflineStatusContextType {
  const context = useContext(OfflineStatusContext);
  
  if (context === undefined) {
    throw new Error('useOfflineStatusContext must be used within an OfflineStatusProvider');
  }
  
  return context;
}
