// src/components/social/UserProfileBadge.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { isUserVip } from '@/services/storeService';
import { getUserTitles } from '@/services/userTitleService';
import { useAsyncEffect } from '@/hooks/useAsyncEffect';

interface UserProfileBadgeProps {
  userId: string;
  size?: 'small' | 'medium' | 'large';
  showVipBadge?: boolean;
  showTitle?: boolean;
  className?: string;
}

/**
 * 用户资料徽章组件
 * 
 * 显示用户的VIP状态和称号
 */
const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({
  userId,
  size = 'medium',
  showVipBadge = true,
  showTitle = true,
  className = ''
}) => {
  const [isVip, setIsVip] = React.useState(false);
  const [userTitle, setUserTitle] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  
  // 加载用户VIP状态和称号
  useAsyncEffect(async () => {
    try {
      setIsLoading(true);
      
      // 检查用户是否是VIP
      const vipStatus = await isUserVip(userId);
      setIsVip(vipStatus);
      
      // 获取用户称号
      if (showTitle) {
        const titles = await getUserTitles(userId);
        const activeTitle = titles.find(title => title.isActive);
        if (activeTitle) {
          setUserTitle(activeTitle.titleText);
        }
      }
    } catch (error) {
      console.error('Failed to load user profile data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, showTitle]);
  
  // 根据尺寸获取样式
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          vipBadge: 'text-xs px-1 py-0.5',
          title: 'text-xs'
        };
      case 'large':
        return {
          vipBadge: 'text-sm px-2 py-1',
          title: 'text-base'
        };
      case 'medium':
      default:
        return {
          vipBadge: 'text-xs px-1.5 py-0.5',
          title: 'text-sm'
        };
    }
  };
  
  const sizeStyles = getSizeStyles();
  
  // 如果正在加载，显示占位符
  if (isLoading) {
    return (
      <div className={`user-profile-badge-skeleton flex items-center ${className}`}>
        {showVipBadge && (
          <div className="vip-badge-skeleton bg-gray-200 animate-pulse rounded-full h-4 w-12 mr-2"></div>
        )}
        {showTitle && (
          <div className="title-skeleton bg-gray-200 animate-pulse rounded h-4 w-20"></div>
        )}
      </div>
    );
  }
  
  // 如果没有VIP徽章和称号，不显示任何内容
  if (!showVipBadge && !showTitle) {
    return null;
  }
  
  // 如果没有VIP状态和称号，不显示任何内容
  if (!isVip && !userTitle) {
    return null;
  }
  
  return (
    <div className={`user-profile-badge flex items-center ${className}`}>
      {/* VIP徽章 */}
      {showVipBadge && isVip && (
        <motion.div
          className={`vip-badge ${sizeStyles.vipBadge} bg-gold-500 text-white font-medium rounded-full mr-2`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          VIP
        </motion.div>
      )}
      
      {/* 用户称号 */}
      {showTitle && userTitle && (
        <motion.div
          className={`user-title ${sizeStyles.title} text-gray-700`}
          initial={{ x: -5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {userTitle}
        </motion.div>
      )}
    </div>
  );
};

export default UserProfileBadge;
