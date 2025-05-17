// src/components/layout/AppShell.tsx
import React, { ReactNode } from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchGlobalLayoutView } from '@/services';
import Header from './Header';
import Navigation from './Navigation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import ChineseDecoration from '../decoration/ChineseDecoration';
import SyncStatusIndicator from '../common/SyncStatusIndicator';
import OptimizedSyncStatusIndicator from '../sync/OptimizedSyncStatusIndicator';
import OfflineStatusIndicator from '../offline/OfflineStatusIndicator';
import OfflineNotification from '../offline/OfflineNotification';
import type { GlobalLayoutLabelsBundle } from '@/types';

interface AppShellProps { children: ReactNode; }

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    labels: globalLabels, isPending, isError, error, isFetching, refetch
  } = useLocalizedView<null, GlobalLayoutLabelsBundle>(
    'globalLayoutViewContent', // Unique query key for this "view"
    fetchGlobalLayoutView
  );

  if (isPending && !globalLabels) {
    // Use a very generic loading text if global labels themselves are not available
    return <LoadingSpinner variant="jade" text="Initializing Application..." />;
  }

  if (isError || !globalLabels) { // Critical error if global labels fail
    return (
      <div style={{ padding: '20px' }}>
        <ErrorDisplay
          error={error} // Error from the hook
          title={globalLabels?.appErrorHeading || "Application Shell Error"}
          messageTemplate={globalLabels?.appErrorGeneralMessage || "Core UI failed. Details: {message}"}
          onRetry={refetch}
          retryButtonText="Retry Loading Shell"
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Add Chinese pattern decorative elements */}
      <div className="chinese-pattern top"></div>

      {/* 添加中国风装饰元素 */}
      <ChineseDecoration />

      <Header labels={globalLabels} isFetching={isFetching && !!globalLabels}/> {/* Pass fetching only if labels are loaded */}

      <main>{children}</main>

      {/* 移动应用底部导航 */}
      <Navigation labels={globalLabels} variant="bamboo" />

      {/* 同步状态指示器 */}
      <div className="sync-indicators">
        {/* 传统同步状态指示器（保持向后兼容） */}
        <SyncStatusIndicator variant="standard" showCount={true} showLabel={true} />

        {/* 优化的同步状态指示器 */}
        <OptimizedSyncStatusIndicator variant="badge" position="top-right" />

        {/* 离线状态指示器 */}
        <div className="offline-indicator-container mt-2">
          <OfflineStatusIndicator showPendingCount={true} showSyncButton={true} />
        </div>
      </div>

      {/* 离线通知 */}
      <OfflineNotification showDelay={1000} hideDelay={5000} />

      <div className="chinese-pattern bottom"></div>
    </div>
  );
};
export default AppShell;