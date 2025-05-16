// src/hooks/useOptimizedDataRefresh.ts
import { useCallback, useRef, useEffect } from 'react';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';

/**
 * A hook that optimizes data refresh by debouncing multiple refresh triggers
 * and batching them into a single refresh operation.
 * 
 * @param tables An array of table names to listen for changes
 * @param refreshCallback The callback function to run when data needs to be refreshed
 * @param debounceMs The debounce time in milliseconds (default: 100ms)
 * 
 * @example
 * const loadData = useCallback(async () => {
 *   const result = await fetchData();
 *   setData(result);
 * }, []);
 * 
 * useOptimizedDataRefresh(['tasks', 'challenges'], loadData);
 */
export function useOptimizedDataRefresh(
  tables: string[],
  refreshCallback: () => Promise<void> | void,
  debounceMs: number = 100
): void {
  const { registerRefreshListener } = useDataRefreshContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef<boolean>(false);
  const pendingRefreshRef = useRef<boolean>(false);
  
  // Create a stable refresh function that debounces multiple calls
  const debouncedRefresh = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // If already refreshing, mark as pending and return
    if (isRefreshingRef.current) {
      pendingRefreshRef.current = true;
      return;
    }
    
    // Set timeout to refresh after debounce period
    timeoutRef.current = setTimeout(async () => {
      try {
        isRefreshingRef.current = true;
        await refreshCallback();
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        isRefreshingRef.current = false;
        
        // If a refresh was requested while refreshing, trigger another refresh
        if (pendingRefreshRef.current) {
          pendingRefreshRef.current = false;
          debouncedRefresh();
        }
      }
    }, debounceMs);
  }, [refreshCallback, debounceMs]);
  
  // Register for table refreshes
  useEffect(() => {
    // Register for each table
    const unregisterFunctions = tables.map(table => 
      registerRefreshListener(table, debouncedRefresh)
    );
    
    // Cleanup function to unregister all listeners
    return () => {
      unregisterFunctions.forEach(unregister => unregister());
      
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [tables, registerRefreshListener, debouncedRefresh]);
}

/**
 * A hook that optimizes data refresh by throttling refresh operations
 * to prevent too many refreshes in a short period of time.
 * 
 * @param tables An array of table names to listen for changes
 * @param refreshCallback The callback function to run when data needs to be refreshed
 * @param throttleMs The minimum time between refreshes in milliseconds (default: 500ms)
 * 
 * @example
 * const loadData = useCallback(async () => {
 *   const result = await fetchData();
 *   setData(result);
 * }, []);
 * 
 * useThrottledDataRefresh(['tasks', 'challenges'], loadData);
 */
export function useThrottledDataRefresh(
  tables: string[],
  refreshCallback: () => Promise<void> | void,
  throttleMs: number = 500
): void {
  const { registerRefreshListener } = useDataRefreshContext();
  const lastRefreshTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef<boolean>(false);
  
  // Create a stable refresh function that throttles calls
  const throttledRefresh = useCallback(() => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
    
    // If already refreshing or throttled, return
    if (isRefreshingRef.current || (timeSinceLastRefresh < throttleMs && timeoutRef.current)) {
      return;
    }
    
    // If enough time has passed, refresh immediately
    if (timeSinceLastRefresh >= throttleMs) {
      lastRefreshTimeRef.current = now;
      isRefreshingRef.current = true;
      
      Promise.resolve(refreshCallback())
        .catch(error => console.error('Error refreshing data:', error))
        .finally(() => {
          isRefreshingRef.current = false;
        });
    } 
    // Otherwise, schedule a refresh for later
    else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        lastRefreshTimeRef.current = Date.now();
        isRefreshingRef.current = true;
        
        Promise.resolve(refreshCallback())
          .catch(error => console.error('Error refreshing data:', error))
          .finally(() => {
            isRefreshingRef.current = false;
          });
      }, throttleMs - timeSinceLastRefresh);
    }
  }, [refreshCallback, throttleMs]);
  
  // Register for table refreshes
  useEffect(() => {
    // Register for each table
    const unregisterFunctions = tables.map(table => 
      registerRefreshListener(table, throttledRefresh)
    );
    
    // Cleanup function to unregister all listeners
    return () => {
      unregisterFunctions.forEach(unregister => unregister());
      
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [tables, registerRefreshListener, throttledRefresh]);
}
