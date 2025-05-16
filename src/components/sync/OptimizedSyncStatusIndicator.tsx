// src/components/sync/OptimizedSyncStatusIndicator.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOptimizedSync } from '@/hooks/useOptimizedSync';
import { SyncStatus } from '@/services/dataSyncService';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useLanguage } from '@/context/LanguageProvider';

interface OptimizedSyncStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
  variant?: 'icon' | 'badge' | 'full';
  position?: 'top-right' | 'bottom-right' | 'inline';
}

/**
 * 优化的同步状态指示器组件
 *
 * 显示同步状态、待同步项目数量和同步历史
 */
const OptimizedSyncStatusIndicator: React.FC<OptimizedSyncStatusIndicatorProps> = ({
  className = '',
  showDetails = false,
  variant = 'icon',
  position = 'top-right'
}) => {
  // 同步状态
  const {
    status,
    isSyncing,
    hasError,
    isOnline,
    pendingCount,
    syncProgress,
    lastSyncTime,
    syncHistory,
    triggerSync
  } = useOptimizedSync();

  // 是否显示详情面板
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(showDetails);

  // 语言
  const { language } = useLanguage();

  // 处理点击同步按钮
  const handleSyncClick = () => {
    playSound(SoundType.BUTTON_CLICK);
    triggerSync();
  };

  // 处理点击详情按钮
  const handleDetailsClick = () => {
    playSound(SoundType.BUTTON_CLICK);
    setIsDetailsOpen(!isDetailsOpen);
  };

  // 获取状态图标
  const getStatusIcon = () => {
    if (!isOnline) {
      return (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
        </svg>
      );
    }

    switch (status) {
      case SyncStatus.SYNCING:
        return (
          <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case SyncStatus.SUCCESS:
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case SyncStatus.ERROR:
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
    }
  };

  // 获取状态文本
  const getStatusText = () => {
    if (!isOnline) {
      return language === 'zh' ? '离线' : 'Offline';
    }

    switch (status) {
      case SyncStatus.SYNCING:
        return language === 'zh' ? '同步中' : 'Syncing';
      case SyncStatus.SUCCESS:
        return language === 'zh' ? '已同步' : 'Synced';
      case SyncStatus.ERROR:
        return language === 'zh' ? '同步错误' : 'Sync Error';
      default:
        return language === 'zh' ? '空闲' : 'Idle';
    }
  };

  // 获取状态颜色
  const getStatusColor = () => {
    if (!isOnline) {
      return 'bg-gray-500';
    }

    switch (status) {
      case SyncStatus.SYNCING:
        return 'bg-blue-500';
      case SyncStatus.SUCCESS:
        return 'bg-green-500';
      case SyncStatus.ERROR:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    if (!date) return '';

    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: language === 'zh' ? zhCN : enUS
    });
  };

  // 渲染图标变体
  const renderIconVariant = () => (
    <div
      className={`sync-status-indicator-icon relative cursor-pointer ${className}`}
      onClick={handleDetailsClick}
    >
      <div className={`rounded-full p-2 ${hasError ? 'bg-red-100' : 'bg-gray-100'}`}>
        {getStatusIcon()}
      </div>

      {pendingCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {pendingCount > 99 ? '99+' : pendingCount}
        </div>
      )}
    </div>
  );

  // 渲染徽章变体
  const renderBadgeVariant = () => (
    <div
      className={`sync-status-indicator-badge flex items-center space-x-2 px-3 py-1 rounded-full cursor-pointer ${hasError ? 'bg-red-100' : 'bg-gray-100'} ${className}`}
      onClick={handleDetailsClick}
    >
      {getStatusIcon()}
      <span className="text-sm font-medium">{getStatusText()}</span>

      {pendingCount > 0 && (
        <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {pendingCount > 99 ? '99+' : pendingCount}
        </div>
      )}
    </div>
  );

  // 渲染完整变体
  const renderFullVariant = () => (
    <div className={`sync-status-indicator-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>

          {pendingCount > 0 && (
            <div className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {pendingCount} {language === 'zh' ? '待同步' : 'pending'}
            </div>
          )}
        </div>

        <Button
          color="silk"
          size="small"
          onClick={handleSyncClick}
          disabled={isSyncing || !isOnline}
        >
          {language === 'zh' ? '同步' : 'Sync'}
        </Button>
      </div>

      {isSyncing && (
        <div className="mb-2">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${syncProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">
            {syncProgress}%
          </div>
        </div>
      )}

      {lastSyncTime && (
        <div className="text-xs text-gray-500">
          {language === 'zh' ? '上次同步: ' : 'Last sync: '}
          {formatTime(lastSyncTime)}
        </div>
      )}
    </div>
  );

  // 渲染详情面板
  const renderDetailsPanel = () => (
    <AnimatePresence>
      {isDetailsOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`sync-details-panel bg-white rounded-lg shadow-lg p-4 z-50 ${
            position === 'top-right' ? 'absolute top-12 right-0 w-80' :
            position === 'bottom-right' ? 'absolute bottom-12 right-0 w-80' :
            'w-full mt-2'
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {language === 'zh' ? '同步状态' : 'Sync Status'}
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={handleDetailsClick}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                <span className="text-sm font-medium">{getStatusText()}</span>
              </div>

              <Button
                color="silk"
                size="small"
                onClick={handleSyncClick}
                disabled={isSyncing || !isOnline}
              >
                {language === 'zh' ? '同步' : 'Sync'}
              </Button>
            </div>

            {isSyncing && (
              <div className="mb-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${syncProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {syncProgress}%
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">
                  {language === 'zh' ? '待同步' : 'Pending'}
                </div>
                <div className="font-medium">{pendingCount}</div>
              </div>

              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">
                  {language === 'zh' ? '网络状态' : 'Network'}
                </div>
                <div className="font-medium">
                  {isOnline ?
                    (language === 'zh' ? '在线' : 'Online') :
                    (language === 'zh' ? '离线' : 'Offline')}
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">
                  {language === 'zh' ? '上次同步' : 'Last Sync'}
                </div>
                <div className="font-medium">
                  {lastSyncTime ? formatTime(lastSyncTime) : '-'}
                </div>
              </div>
            </div>
          </div>

          {syncHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                {language === 'zh' ? '同步历史' : 'Sync History'}
              </h4>

              <div className="max-h-40 overflow-y-auto">
                {syncHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="text-xs border-b border-gray-100 py-2 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          entry.status === SyncStatus.SUCCESS ? 'bg-green-500' :
                          entry.status === SyncStatus.ERROR ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}></div>
                        <span>
                          {entry.status === SyncStatus.SUCCESS ?
                            (language === 'zh' ? '成功' : 'Success') :
                            entry.status === SyncStatus.ERROR ?
                            (language === 'zh' ? '错误' : 'Error') :
                            (language === 'zh' ? '同步' : 'Sync')}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        {formatTime(entry.timestamp)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div>
                        {entry.itemCount} {language === 'zh' ? '项' : 'items'}
                      </div>
                      {entry.error && (
                        <div className="text-red-500">{entry.error}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`optimized-sync-status-indicator relative ${position === 'inline' ? 'inline-block' : 'block'}`}>
      {variant === 'icon' && renderIconVariant()}
      {variant === 'badge' && renderBadgeVariant()}
      {variant === 'full' && renderFullVariant()}

      {renderDetailsPanel()}
    </div>
  );
};

export default OptimizedSyncStatusIndicator;
