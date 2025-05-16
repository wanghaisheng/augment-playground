// src/components/offline/OfflineStatusIndicator.tsx
import React, { useState } from 'react';
import { useOfflineStatusContext } from '@/context/OfflineStatusProvider';
import { useLanguage } from '@/context/LanguageProvider';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { Tooltip } from '@/components/common/Tooltip';

interface OfflineStatusIndicatorProps {
  showPendingCount?: boolean;
  showSyncButton?: boolean;
  className?: string;
}

/**
 * 离线状态指示器组件
 * 显示应用的在线/离线状态和待同步操作数量
 */
const OfflineStatusIndicator: React.FC<OfflineStatusIndicatorProps> = ({
  showPendingCount = true,
  showSyncButton = true,
  className = ''
}) => {
  const { isOnline, pendingSyncCount, lastOnlineTime, lastOfflineTime, syncPendingActions } = useOfflineStatusContext();
  const { language } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // 处理同步按钮点击
  const handleSyncClick = async () => {
    if (isSyncing || !isOnline) return;
    
    setIsSyncing(true);
    try {
      await syncPendingActions();
    } finally {
      setIsSyncing(false);
    }
  };
  
  // 格式化时间
  const formatTime = (date: Date | null) => {
    if (!date) return '';
    
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: language === 'zh' ? zhCN : enUS
    });
  };
  
  // 获取状态文本
  const getStatusText = () => {
    if (isOnline) {
      return language === 'zh' ? '在线' : 'Online';
    } else {
      return language === 'zh' ? '离线' : 'Offline';
    }
  };
  
  // 获取提示文本
  const getTooltipText = () => {
    if (isOnline) {
      return language === 'zh'
        ? `在线 - 上次离线: ${lastOfflineTime ? formatTime(lastOfflineTime) : '未知'}`
        : `Online - Last offline: ${lastOfflineTime ? formatTime(lastOfflineTime) : 'Unknown'}`;
    } else {
      return language === 'zh'
        ? `离线 - 上次在线: ${formatTime(lastOnlineTime)}`
        : `Offline - Last online: ${formatTime(lastOnlineTime)}`;
    }
  };
  
  return (
    <div className={`offline-status-indicator flex items-center ${className}`}>
      <Tooltip content={getTooltipText()} placement="bottom">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm font-medium">
            {getStatusText()}
          </span>
        </div>
      </Tooltip>
      
      {showPendingCount && pendingSyncCount > 0 && (
        <div className="ml-3 flex items-center">
          <span className="text-sm text-amber-600">
            {language === 'zh'
              ? `${pendingSyncCount} 待同步`
              : `${pendingSyncCount} pending`}
          </span>
          
          {showSyncButton && isOnline && (
            <button
              className={`ml-2 text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors ${
                isSyncing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleSyncClick}
              disabled={isSyncing}
            >
              {isSyncing
                ? (language === 'zh' ? '同步中...' : 'Syncing...')
                : (language === 'zh' ? '同步' : 'Sync')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineStatusIndicator;
