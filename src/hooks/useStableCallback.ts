// src/hooks/useStableCallback.ts
import { useCallback, useRef } from 'react';

/**
 * A hook that returns a stable callback function that always has access to the latest props/state
 * without needing to add them to the dependency array.
 * 
 * This is useful for callbacks that need to access the latest state but don't need to
 * re-create the function when that state changes.
 * 
 * @param callback The callback function to stabilize
 * @returns A stable callback function
 * 
 * @example
 * // Without useStableCallback
 * const handleClick = useCallback(() => {
 *   console.log(count);
 * }, [count]); // Re-creates function when count changes
 * 
 * // With useStableCallback
 * const handleClick = useStableCallback(() => {
 *   console.log(count);
 * }); // Stable reference, always accesses latest count
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  // Keep a ref to the latest callback
  const callbackRef = useRef<T>(callback);
  
  // Update the ref whenever the callback changes
  callbackRef.current = callback;
  
  // Return a stable function that calls the latest callback
  return useCallback(
    ((...args: any[]) => {
      return callbackRef.current(...args);
    }) as T,
    []
  );
}

/**
 * A hook that returns a stable async callback function that always has access to the latest props/state
 * without needing to add them to the dependency array.
 * 
 * This is useful for async callbacks that need to access the latest state but don't need to
 * re-create the function when that state changes.
 * 
 * @param callback The async callback function to stabilize
 * @returns A stable async callback function
 * 
 * @example
 * // Without useStableAsyncCallback
 * const handleSubmit = useCallback(async () => {
 *   await submitForm(formData);
 * }, [formData, submitForm]); // Re-creates function when dependencies change
 * 
 * // With useStableAsyncCallback
 * const handleSubmit = useStableAsyncCallback(async () => {
 *   await submitForm(formData);
 * }); // Stable reference, always accesses latest formData and submitForm
 */
export function useStableAsyncCallback<T extends (...args: any[]) => Promise<any>>(callback: T): T {
  // Keep a ref to the latest callback
  const callbackRef = useRef<T>(callback);
  
  // Update the ref whenever the callback changes
  callbackRef.current = callback;
  
  // Return a stable function that calls the latest callback
  return useCallback(
    (async (...args: any[]) => {
      return await callbackRef.current(...args);
    }) as T,
    []
  );
}
