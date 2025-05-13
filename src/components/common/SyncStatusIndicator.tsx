// src/components/common/SyncStatusIndicator.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SyncStatus, getCurrentSyncStatus, getPendingSyncCount, manualSync } from '@/services/dataSyncService';

interface SyncStatusIndicatorProps {
  showCount?: boolean;
  showLabel?: boolean;
  variant?: 'minimal' | 'standard' | 'detailed';
}

/**
 * 数据同步状态指示器组件
 * 显示当前同步状态和待同步项目数量
 *
 * @param showCount - 是否显示待同步项目数量
 * @param showLabel - 是否显示状态标签
 * @param variant - 显示变体
 */
const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  showCount = true,
  showLabel = true,
  variant = 'standard'
}) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.IDLE);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // 更新同步状态和待同步项目数量
  useEffect(() => {
    const updateStatus = async () => {
      try {
        const status = getCurrentSyncStatus();
        let count = 0;

        try {
          count = await getPendingSyncCount();
        } catch (countErr) {
          console.error('Failed to get pending sync count:', countErr);
        }

        setSyncStatus(status);
        setPendingCount(count);

        // 如果有待同步项目或正在同步，则显示指示器
        setIsVisible(count > 0 || status === SyncStatus.SYNCING);
      } catch (err) {
        console.error('Failed to update sync status:', err);
      }
    };

    // 初始更新
    updateStatus();

    // 定期更新，更频繁地检查
    const interval = setInterval(updateStatus, 1000);

    // 添加事件监听器，在网络状态变化时更新
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // 添加自定义事件监听器，在添加同步项目时更新
    const handleSyncItemAdded = () => updateStatus();
    window.addEventListener('syncItemAdded', handleSyncItemAdded);

    // 添加自定义事件监听器，在同步状态变化时更新
    const handleSyncStatusChanged = (event: Event) => {
      const customEvent = event as CustomEvent<SyncStatus>;
      setSyncStatus(customEvent.detail);
      updateStatus();
    };
    window.addEventListener('syncStatusChanged', handleSyncStatusChanged);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      window.removeEventListener('syncItemAdded', handleSyncItemAdded);
      window.removeEventListener('syncStatusChanged', handleSyncStatusChanged);
    };
  }, []);

  // 手动触发同步
  const handleManualSync = async () => {
    try {
      await manualSync();
    } catch (err) {
      console.error('Manual sync failed:', err);
    }
  };

  // 获取状态图标
  const getStatusIcon = () => {
    switch (syncStatus) {
      case SyncStatus.SYNCING:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="sync-icon syncing"
          >
            ↻
          </motion.div>
        );
      case SyncStatus.SUCCESS:
        return <div className="sync-icon success">✓</div>;
      case SyncStatus.ERROR:
        return <div className="sync-icon error">✗</div>;
      default:
        return <div className="sync-icon idle">⟳</div>;
    }
  };

  // 获取状态标签
  const getStatusLabel = () => {
    switch (syncStatus) {
      case SyncStatus.SYNCING:
        return '同步中...';
      case SyncStatus.SUCCESS:
        return '同步成功';
      case SyncStatus.ERROR:
        return '同步失败';
      default:
        return '待同步';
    }
  };

  // 始终显示同步状态指示器，除非是最小变体且没有待同步项目
  if (!isVisible && variant === 'minimal') {
    return null;
  }

  // 最小变体
  if (variant === 'minimal') {
    return (
      <motion.div
        className="sync-status-indicator minimal"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={handleManualSync}
      >
        {getStatusIcon()}
      </motion.div>
    );
  }

  // 获取状态类名
  const getStatusClassName = () => {
    switch (syncStatus) {
      case SyncStatus.SYNCING:
        return 'syncing';
      case SyncStatus.SUCCESS:
        return 'success';
      case SyncStatus.ERROR:
        return 'error';
      default:
        return 'idle';
    }
  };

  // 标准变体
  return (
    <AnimatePresence>
      <motion.div
        className={`sync-status-indicator ${variant} ${getStatusClassName()}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={handleManualSync}
      >
        {getStatusIcon()}

        {showLabel && (
          <span className="sync-label">{getStatusLabel()}</span>
        )}

        {showCount && pendingCount > 0 && (
          <span className="sync-count">{pendingCount}</span>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SyncStatusIndicator;
