// src/components/offline/OfflineAwarePage.tsx
import React, { ReactNode } from 'react';
import { useOfflineStatusContext } from '@/context/OfflineStatusProvider';
import { useLanguage } from '@/context/LanguageProvider';
import OfflineFallback from './OfflineFallback';

interface OfflineAwarePageProps {
  children: ReactNode;
  tableName: string;
  recordId?: string | number;
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
  requiresOnline?: boolean;
}

/**
 * 离线感知页面组件
 * 包装页面组件，提供离线支持
 */
const OfflineAwarePage: React.FC<OfflineAwarePageProps> = ({
  children,
  tableName,
  recordId,
  fallback,
  loadingComponent,
  requiresOnline = false
}) => {
  const { isOnline } = useOfflineStatusContext();
  const { language } = useLanguage();
  
  // 如果需要在线且当前离线，显示离线提示
  if (requiresOnline && !isOnline) {
    return (
      <div className="offline-required-page bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {language === 'zh' ? '需要网络连接' : 'Internet Connection Required'}
        </h3>
        <p className="text-gray-600 mb-4">
          {language === 'zh'
            ? '此功能需要网络连接。请连接到互联网后重试。'
            : 'This feature requires an internet connection. Please connect to the internet and try again.'}
        </p>
      </div>
    );
  }
  
  // 使用OfflineFallback组件处理离线状态
  return (
    <OfflineFallback
      tableName={tableName}
      recordId={recordId}
      fallback={fallback}
      loadingComponent={loadingComponent}
    >
      {children}
    </OfflineFallback>
  );
};

export default OfflineAwarePage;
