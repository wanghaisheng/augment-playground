// src/components/social/LeaderboardItem.tsx
import React from 'react';
import { motion } from 'framer-motion';
import UserProfileBadge from './UserProfileBadge';
import { isUserVip } from '@/services/storeService';
import { useAsyncEffect } from '@/hooks/useAsyncEffect';

interface LeaderboardItemProps {
  userId: string;
  username: string;
  rank: number;
  score: number;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

/**
 * 排行榜项目组件
 * 
 * 显示排行榜中的用户项目，包括VIP标识和排名
 */
const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  userId,
  username,
  rank,
  score,
  avatarUrl,
  isCurrentUser = false
}) => {
  const [isVip, setIsVip] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // 加载用户VIP状态
  useAsyncEffect(async () => {
    try {
      setIsLoading(true);
      
      // 检查用户是否是VIP
      const vipStatus = await isUserVip(userId);
      setIsVip(vipStatus);
    } catch (error) {
      console.error('Failed to load user VIP status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  // 获取排名徽章样式
  const getRankBadgeStyles = () => {
    switch (rank) {
      case 1:
        return 'bg-gold-500 text-white';
      case 2:
        return 'bg-gray-300 text-gray-800';
      case 3:
        return 'bg-amber-600 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };
  
  // 获取默认头像
  const getDefaultAvatar = () => {
    return '/assets/default-avatar.svg';
  };
  
  return (
    <motion.div
      className={`leaderboard-item flex items-center p-3 rounded-lg ${
        isCurrentUser ? 'bg-jade-50 border border-jade-200' : 'bg-white border border-gray-200'
      } ${isVip ? 'shadow-sm' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* 排名 */}
      <div className={`rank-badge ${getRankBadgeStyles()} w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3`}>
        {rank}
      </div>
      
      {/* 头像 */}
      <div className="avatar-container relative mr-3">
        <img
          src={avatarUrl || getDefaultAvatar()}
          alt={username}
          className={`w-10 h-10 rounded-full ${isVip ? 'border-2 border-gold-300' : ''}`}
        />
        
        {/* VIP光环效果 */}
        {isVip && (
          <motion.div
            className="vip-halo absolute inset-0 rounded-full"
            style={{
              boxShadow: '0 0 8px 2px rgba(212, 175, 55, 0.5)',
              zIndex: -1
            }}
            animate={{
              boxShadow: ['0 0 8px 2px rgba(212, 175, 55, 0.3)', '0 0 12px 4px rgba(212, 175, 55, 0.6)', '0 0 8px 2px rgba(212, 175, 55, 0.3)']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        )}
      </div>
      
      {/* 用户信息 */}
      <div className="user-info flex-1">
        <div className="flex items-center">
          <span className="username font-medium text-gray-800 mr-2">{username}</span>
          <UserProfileBadge userId={userId} size="small" />
        </div>
        
        <div className="score text-sm text-gray-500">
          {score} 分
        </div>
      </div>
      
      {/* VIP标识 */}
      {isVip && (
        <div className="vip-indicator flex items-center">
          <motion.div
            className="text-gold-500"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default LeaderboardItem;
