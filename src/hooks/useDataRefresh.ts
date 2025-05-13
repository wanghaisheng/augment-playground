// src/hooks/useDataRefresh.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import { DataRefreshEvent } from '@/types/dataRefresh';

/**
 * 自定义 Hook，用于监听数据刷新事件
 *
 * @param tables 要监听的表名数组
 * @param callback 数据刷新时的回调函数
 * @returns 最近一次刷新的数据
 */
export function useDataRefresh(
  tables: string[],
  callback?: (event: DataRefreshEvent) => void
): DataRefreshEvent | null {
  const [lastRefresh, setLastRefresh] = useState<DataRefreshEvent | null>(null);
  const { registerRefreshListener } = useDataRefreshContext();

  useEffect(() => {
    // 为每个表注册监听器
    const unregisterFunctions = tables.map(table => {
      return registerRefreshListener(table, (data) => {
        const event = { table, data };
        setLastRefresh(event);

        if (callback) {
          callback(event);
        }
      });
    });

    // 清理函数
    return () => {
      unregisterFunctions.forEach(unregister => unregister());
    };
  }, [tables, callback, registerRefreshListener]);

  return lastRefresh;
}

/**
 * 自定义 Hook，用于监听特定表的数据刷新事件
 *
 * @param table 要监听的表名
 * @param callback 数据刷新时的回调函数
 * @returns 最近一次刷新的数据
 */
export function useTableRefresh(
  table: string,
  callback?: (data: any) => void
): any | null {
  const [lastData, setLastData] = useState<any | null>(null);
  const { registerRefreshListener } = useDataRefreshContext();

  useEffect(() => {
    // 注册表监听器
    const unregister = registerRefreshListener(table, (data) => {
      setLastData(data);

      if (callback) {
        callback(data);
      }
    });

    // 清理函数
    return unregister;
  }, [table, callback, registerRefreshListener]);

  return lastData;
}

/**
 * 自定义 Hook，用于注册表数据刷新监听器
 *
 * @param table 要监听的表名
 * @param callback 数据刷新时的回调函数
 * @returns 取消注册的函数
 */
export function useRegisterTableRefresh(
  table: string,
  callback: (data: any) => void
): () => void {
  const { registerRefreshListener } = useDataRefreshContext();
  const callbackRef = useRef(callback);
  const unregisterFuncRef = useRef<(() => void) | null>(null);

  // Update callbackRef when the callback prop changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Effect for registering and unregistering the listener
  useEffect(() => {
    // Define a stable callback function that always uses the latest callback from ref
    const stableCallback = (data: any) => {
      callbackRef.current(data);
    };

    // Register the listener
    const unregister = registerRefreshListener(table, stableCallback);
    unregisterFuncRef.current = unregister; // Store the unregister function

    // Cleanup function: This is called when the component unmounts or dependencies change
    return () => {
      unregister();
      unregisterFuncRef.current = null; // Clear the ref after unregistering
    };
  }, [table, registerRefreshListener]); // Dependencies: re-run if table or registerRefreshListener changes

  // Return a memoized function that the caller can use to manually unregister.
  // This function is stable and safe to call multiple times (will only unregister once).
  const manualUnregister = useCallback(() => {
    if (unregisterFuncRef.current) {
      unregisterFuncRef.current();
      unregisterFuncRef.current = null; // Ensure it's only called once via this manual path
    }
  }, []); // This useCallback has no dependencies, so manualUnregister is stable.

  return manualUnregister;
}

/**
 * 手动触发数据刷新事件
 * 注意：此函数必须在React组件内部使用
 *
 * @param table 表名
 * @param data 数据
 */
export function useDataRefreshTrigger() {
  const { refreshTable } = useDataRefreshContext();

  return (table: string, data?: any): void => {
    refreshTable(table, data);
  };
}

/**
 * 直接触发数据刷新事件（不使用hook，可以在任何地方调用）
 *
 * @param table 表名
 * @param data 数据
 */
export function triggerDataRefresh(table: string, data?: any): void {
  const refreshEvent = new CustomEvent('dataRefresh', {
    detail: { table, data }
  });
  window.dispatchEvent(refreshEvent);
}
