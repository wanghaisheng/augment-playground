// src/context/DataRefreshProvider.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { DataRefreshEvent } from '@/types/dataRefresh';

// 数据刷新上下文类型
interface DataRefreshContextType {
  lastRefresh: Record<string, DataRefreshEvent | null>;
  refreshTable: (table: string, data?: any) => void;
  registerRefreshListener: (table: string, callback: (data?: any) => void) => () => void;
}

// 创建上下文
const DataRefreshContext = createContext<DataRefreshContextType | undefined>(undefined);

// Provider组件属性
interface DataRefreshProviderProps {
  children: ReactNode;
}

/**
 * 数据刷新Provider组件
 * 提供全局数据刷新管理功能
 */
export const DataRefreshProvider: React.FC<DataRefreshProviderProps> = ({ children }) => {
  const [lastRefresh, setLastRefresh] = useState<Record<string, DataRefreshEvent | null>>({});
  const [listeners, setListeners] = useState<Record<string, Set<(data?: any) => void>>>({});

  // 监听数据刷新事件
  useEffect(() => {
    const handleDataRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<DataRefreshEvent>;
      const { table, data } = customEvent.detail;

      // 更新最近一次刷新的数据
      setLastRefresh(prev => ({
        ...prev,
        [table]: { table, data }
      }));

      // 通知该表的所有监听器
      if (listeners[table]) {
        listeners[table].forEach(callback => {
          try {
            callback(data);
          } catch (err) {
            console.error(`Error in refresh listener for table ${table}:`, err);
          }
        });
      }
    };

    // 添加事件监听器
    window.addEventListener('dataRefresh', handleDataRefresh);

    // 清理函数
    return () => {
      window.removeEventListener('dataRefresh', handleDataRefresh);
    };
  }, [listeners]);

  // 刷新表数据
  const refreshTable = useCallback((table: string, data?: any) => {
    const refreshEvent = new CustomEvent('dataRefresh', {
      detail: { table, data }
    });
    window.dispatchEvent(refreshEvent);
  }, []);

  // 注册刷新监听器
  const registerRefreshListener = useCallback((table: string, callback: (data?: any) => void) => {
    setListeners(prev => {
      const tableListeners = prev[table] || new Set();
      tableListeners.add(callback);

      return {
        ...prev,
        [table]: tableListeners
      };
    });

    // 返回取消注册的函数
    return () => {
      setListeners(prev => {
        const tableListeners = prev[table];
        if (tableListeners) {
          tableListeners.delete(callback);

          return {
            ...prev,
            [table]: tableListeners
          };
        }
        return prev;
      });
    };
  }, []);

  // 提供上下文值
  const contextValue: DataRefreshContextType = useMemo(() => ({
    lastRefresh,
    refreshTable,
    registerRefreshListener
  }), [lastRefresh, refreshTable, registerRefreshListener]);

  return (
    <DataRefreshContext.Provider value={contextValue}>
      {children}
    </DataRefreshContext.Provider>
  );
};

/**
 * 使用数据刷新的Hook
 * @returns 数据刷新上下文
 */
export const useDataRefreshContext = (): DataRefreshContextType => {
  const context = useContext(DataRefreshContext);
  if (context === undefined) {
    throw new Error('useDataRefreshContext must be used within a DataRefreshProvider');
  }
  return context;
};

/**
 * 使用数据刷新的Hook (别名)
 * 提供与useDataRefreshContext相同的功能，但名称更简洁
 * @returns 数据刷新上下文
 */
export const useDataRefresh = useDataRefreshContext;
