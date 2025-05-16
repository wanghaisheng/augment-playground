// src/hooks/useOfflineAction.ts
import { useCallback } from 'react';
import { useOfflineStatusContext } from '@/context/OfflineStatusProvider';
import { recordOfflineAction } from '@/services/offlineService';
import { useLanguage } from '@/context/LanguageProvider';

/**
 * 离线操作钩子返回类型
 */
interface UseOfflineActionReturn {
  performAction: <T>(
    actionType: string,
    onlineAction: () => Promise<T>,
    tableName: string,
    offlineAction?: () => Promise<T>,
    recordId?: string | number
  ) => Promise<T | null>;
  isOnline: boolean;
}

/**
 * 离线操作钩子
 * 提供在线/离线状态下执行操作的能力
 */
export function useOfflineAction(): UseOfflineActionReturn {
  const { isOnline } = useOfflineStatusContext();
  const { language } = useLanguage();
  
  /**
   * 执行操作
   * @param actionType 操作类型
   * @param onlineAction 在线操作函数
   * @param tableName 表名
   * @param offlineAction 离线操作函数
   * @param recordId 记录ID
   * @returns 操作结果
   */
  const performAction = useCallback(async <T>(
    actionType: string,
    onlineAction: () => Promise<T>,
    tableName: string,
    offlineAction?: () => Promise<T>,
    recordId?: string | number
  ): Promise<T | null> => {
    try {
      if (isOnline) {
        // 在线状态，执行在线操作
        return await onlineAction();
      } else if (offlineAction) {
        // 离线状态，有离线操作函数，执行离线操作
        const result = await offlineAction();
        
        // 记录离线操作
        await recordOfflineAction(
          actionType,
          result,
          tableName,
          recordId
        );
        
        return result;
      } else {
        // 离线状态，没有离线操作函数，记录离线操作
        console.warn(`Cannot perform action ${actionType} while offline`);
        
        // 显示离线提示
        alert(
          language === 'zh'
            ? `无法在离线状态下执行此操作：${actionType}。操作将在恢复连接后同步。`
            : `Cannot perform action ${actionType} while offline. The action will be synced when connection is restored.`
        );
        
        return null;
      }
    } catch (error) {
      console.error(`Failed to perform ${actionType} action:`, error);
      
      // 尝试记录离线操作
      if (!isOnline) {
        try {
          await recordOfflineAction(
            actionType,
            { error: error instanceof Error ? error.message : String(error) },
            tableName,
            recordId
          );
        } catch (recordError) {
          console.error('Failed to record offline action:', recordError);
        }
      }
      
      throw error;
    }
  }, [isOnline, language]);
  
  return {
    performAction,
    isOnline
  };
}
