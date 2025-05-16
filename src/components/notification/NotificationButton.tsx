// src/components/notification/NotificationButton.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/context/NotificationProvider';
import NotificationCenter from './NotificationCenter';
import { playSound, SoundType } from '@/utils/sound';

// 通知按钮属性
interface NotificationButtonProps {
  className?: string;
  iconOnly?: boolean;
}

/**
 * 通知按钮组件
 * 
 * 显示未读通知数量，点击打开通知中心
 */
const NotificationButton: React.FC<NotificationButtonProps> = ({
  className = '',
  iconOnly = false
}) => {
  // 状态
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  
  // 上下文
  const { unreadCount } = useNotifications();
  
  // 处理点击
  const handleClick = () => {
    playSound(SoundType.BUTTON_CLICK);
    setIsNotificationCenterOpen(true);
  };
  
  // 处理关闭通知中心
  const handleCloseNotificationCenter = () => {
    setIsNotificationCenterOpen(false);
  };
  
  return (
    <>
      <button
        className={`relative inline-flex items-center justify-center ${
          iconOnly
            ? 'p-2 rounded-full hover:bg-gray-100'
            : 'px-3 py-2 rounded-md hover:bg-gray-100'
        } focus:outline-none ${className}`}
        onClick={handleClick}
      >
        <svg
          className={`${iconOnly ? 'h-6 w-6' : 'h-5 w-5 mr-1'} text-jade-600`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {!iconOnly && <span className="text-sm text-jade-700">通知</span>}
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={handleCloseNotificationCenter}
      />
    </>
  );
};

export default NotificationButton;
