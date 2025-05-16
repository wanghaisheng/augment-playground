// src/hooks/useAsyncEffect.ts
import { useEffect } from 'react';

/**
 * A hook that simplifies using async functions in useEffect
 * 
 * @param effect The async effect function to run
 * @param deps The dependencies array for the effect
 * @param cleanup An optional cleanup function
 * 
 * @example
 * useAsyncEffect(async () => {
 *   const data = await fetchData();
 *   setData(data);
 * }, [fetchData]);
 */
export function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps: React.DependencyList,
  cleanup?: () => void
): void {
  useEffect(() => {
    let mounted = true;
    let cleanupFromEffect: void | (() => void);
    
    const runEffect = async () => {
      try {
        cleanupFromEffect = await effect();
      } catch (error) {
        console.error('Error in async effect:', error);
      }
    };
    
    runEffect();
    
    return () => {
      mounted = false;
      
      // Run the cleanup function from the effect if it exists
      if (typeof cleanupFromEffect === 'function') {
        cleanupFromEffect();
      }
      
      // Run the cleanup function passed to useAsyncEffect if it exists
      if (cleanup) {
        cleanup();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * A hook that runs an async effect only once on mount
 * 
 * @param effect The async effect function to run
 * @param cleanup An optional cleanup function
 * 
 * @example
 * useAsyncEffectOnce(async () => {
 *   const data = await fetchInitialData();
 *   setData(data);
 * });
 */
export function useAsyncEffectOnce(
  effect: () => Promise<void | (() => void)>,
  cleanup?: () => void
): void {
   
  useAsyncEffect(effect, [], cleanup);
}

/**
 * A hook that runs an async effect when a condition is true
 * 
 * @param condition The condition to check
 * @param effect The async effect function to run
 * @param deps The dependencies array for the effect
 * @param cleanup An optional cleanup function
 * 
 * @example
 * useConditionalAsyncEffect(
 *   isLoggedIn,
 *   async () => {
 *     const userData = await fetchUserData();
 *     setUserData(userData);
 *   },
 *   [isLoggedIn]
 * );
 */
export function useConditionalAsyncEffect(
  condition: boolean,
  effect: () => Promise<void | (() => void)>,
  deps: React.DependencyList,
  cleanup?: () => void
): void {
  useAsyncEffect(
    async () => {
      if (condition) {
        return await effect();
      }
      return;
    },
    [condition, ...deps],
    cleanup
  );
}
