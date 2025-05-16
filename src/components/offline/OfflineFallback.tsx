// src/components/offline/OfflineFallback.tsx
import React, { useState, useEffect } from 'react';
import { useOfflineStatusContext } from '@/context/OfflineStatusProvider';
import { useLanguage } from '@/context/LanguageProvider';
import { db } from '@/db-old';

interface OfflineFallbackProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  tableName: string;
  recordId?: string | number;
  loadingComponent?: React.ReactNode;
}

/**
 * 离线回退组件
 * 在离线状态下显示缓存的数据
 */
const OfflineFallback: React.FC<OfflineFallbackProps> = ({
  children,
  fallback,
  tableName,
  recordId,
  loadingComponent
}) => {
  const { isOnline } = useOfflineStatusContext();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [hasCachedData, setHasCachedData] = useState(false);
  
  // 检查是否有缓存数据
  useEffect(() => {
    const checkCachedData = async () => {
      if (!isOnline) {
        setIsLoading(true);
        try {
          // 检查表是否存在
          const tableExists = await db.tableExists(tableName);
          
          if (tableExists) {
            if (recordId) {
              // 检查特定记录
              const record = await db.table(tableName).get(recordId);
              setHasCachedData(!!record);
            } else {
              // 检查表中是否有记录
              const count = await db.table(tableName).count();
              setHasCachedData(count > 0);
            }
          } else {
            setHasCachedData(false);
          }
        } catch (error) {
          console.error('Failed to check cached data:', error);
          setHasCachedData(false);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    checkCachedData();
  }, [isOnline, tableName, recordId]);
  
  // 如果在线，直接显示子组件
  if (isOnline) {
    return <>{children}</>;
  }
  
  // 如果正在加载，显示加载组件
  if (isLoading) {
    return <>{loadingComponent || <div>Loading...</div>}</>;
  }
  
  // 如果离线且有缓存数据，显示子组件
  if (hasCachedData) {
    return (
      <div className="offline-cached-data">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
          <div className="flex items-center text-amber-700 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {language === 'zh'
              ? '您正在查看离线缓存的数据。部分功能可能不可用。'
              : 'You are viewing cached data while offline. Some features may be unavailable.'}
          </div>
        </div>
        {children}
      </div>
    );
  }
  
  // 如果离线且没有缓存数据，显示回退组件
  return (
    <>
      {fallback || (
        <div className="offline-no-data bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {language === 'zh' ? '无法加载数据' : 'Unable to Load Data'}
          </h3>
          <p className="text-gray-600 mb-4">
            {language === 'zh'
              ? '您当前处于离线状态，并且没有此内容的缓存数据。请连接网络后重试。'
              : 'You are currently offline and there is no cached data for this content. Please connect to the internet and try again.'}
          </p>
        </div>
      )}
    </>
  );
};

export default OfflineFallback;
