// src/components/offline/OfflineNotification.tsx
import React, { useState, useEffect } from 'react';
import { useOfflineStatusContext } from '@/context/OfflineStatusProvider';
import { useLanguage } from '@/context/LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineNotificationProps {
  showDelay?: number;
  hideDelay?: number;
  className?: string;
}

/**
 * 离线通知组件
 * 当应用离线时显示通知
 */
const OfflineNotification: React.FC<OfflineNotificationProps> = ({
  showDelay = 1000,
  hideDelay = 5000,
  className = ''
}) => {
  const { isOnline, pendingSyncCount } = useOfflineStatusContext();
  const { language } = useLanguage();
  const [show, setShow] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // 处理在线状态变化
  useEffect(() => {
    if (!isOnline) {
      // 延迟显示通知，避免短暂的网络波动
      const showTimeoutId = setTimeout(() => {
        setShow(true);
      }, showDelay);
      
      return () => {
        clearTimeout(showTimeoutId);
      };
    } else {
      // 如果恢复在线，延迟隐藏通知
      if (show) {
        const hideTimeoutId = setTimeout(() => {
          setShow(false);
        }, hideDelay);
        
        setHideTimeout(hideTimeoutId);
        
        return () => {
          if (hideTimeoutId) {
            clearTimeout(hideTimeoutId);
          }
        };
      }
    }
  }, [isOnline, show, showDelay, hideDelay]);
  
  // 清理超时
  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);
  
  // 处理关闭按钮点击
  const handleClose = () => {
    setShow(false);
  };
  
  // 获取通知文本
  const getNotificationText = () => {
    if (!isOnline) {
      return language === 'zh'
        ? '您当前处于离线状态。部分功能可能不可用，但您的操作将在恢复连接后同步。'
        : 'You are currently offline. Some features may be unavailable, but your actions will be synced when connection is restored.';
    } else if (pendingSyncCount > 0) {
      return language === 'zh'
        ? `您已恢复在线。${pendingSyncCount} 个操作正在同步中...`
        : `You are back online. ${pendingSyncCount} actions are being synced...`;
    }
    
    return language === 'zh'
      ? '您已恢复在线。'
      : 'You are back online.';
  };
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`offline-notification fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`px-4 py-3 rounded-lg shadow-lg max-w-md ${
            isOnline ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isOnline ? 'bg-green-100' : 'bg-amber-100'
                }`}>
                  {isOnline ? (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${
                  isOnline ? 'text-green-800' : 'text-amber-800'
                }`}>
                  {isOnline
                    ? (language === 'zh' ? '已恢复连接' : 'Connection Restored')
                    : (language === 'zh' ? '离线模式' : 'Offline Mode')}
                </p>
                <p className={`mt-1 text-sm ${
                  isOnline ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {getNotificationText()}
                </p>
              </div>
              
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  type="button"
                  className={`inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150 ${
                    isOnline ? 'hover:text-green-500' : 'hover:text-amber-500'
                  }`}
                  onClick={handleClose}
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineNotification;
