// src/components/social/Leaderboard.tsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LeaderboardItem from './LeaderboardItem';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { playSound, SoundType } from '@/utils/sound';
import { fetchLeaderboardView } from '@/services/localizedContentService';
import { useLanguage } from '@/context/LanguageProvider';

// 排行榜类型
export enum LeaderboardType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ALL_TIME = 'all_time'
}

// 排行榜类别
export enum LeaderboardCategory {
  TASKS_COMPLETED = 'tasks_completed',
  STREAK_DAYS = 'streak_days',
  BAMBOO_COLLECTED = 'bamboo_collected',
  EXPERIENCE_GAINED = 'experience_gained'
}

// 用户排行数据
interface LeaderboardUserData {
  userId: string;
  username: string;
  score: number;
  avatarUrl?: string;
  isVip?: boolean;
}

interface LeaderboardProps {
  type?: LeaderboardType;
  category?: LeaderboardCategory;
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

/**
 * 排行榜组件
 *
 * 显示用户排行榜，支持不同类型和类别的排行
 */
const Leaderboard: React.FC<LeaderboardProps> = ({
  type = LeaderboardType.WEEKLY,
  category = LeaderboardCategory.TASKS_COMPLETED,
  limit = 10,
  showFilters = true,
  className = ''
}) => {
  const [selectedType, setSelectedType] = useState<LeaderboardType>(type);
  const [selectedCategory, setSelectedCategory] = useState<LeaderboardCategory>(category);
  const [users, setUsers] = useState<LeaderboardUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  // 本地化视图
  const { labels } = useLocalizedView(
    'leaderboardViewContent',
    fetchLeaderboardView
  );

  // 模拟加载排行榜数据
  useEffect(() => {
    const loadLeaderboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟排行榜数据
        // 在实际应用中，这应该是从API获取的数据
        const mockUsers: LeaderboardUserData[] = [
          { userId: 'user1', username: '熊猫大师', score: 1250, isVip: true },
          { userId: 'user2', username: '竹子收集者', score: 980, isVip: true },
          { userId: 'user3', username: '习惯养成家', score: 875, isVip: false },
          { userId: 'user4', username: '专注达人', score: 820, isVip: false },
          { userId: 'user5', username: '任务完成王', score: 750, isVip: true },
          { userId: 'user6', username: '早起鸟', score: 720, isVip: false },
          { userId: 'user7', username: '冥想大师', score: 680, isVip: true },
          { userId: 'user8', username: '阅读爱好者', score: 650, isVip: false },
          { userId: 'user9', username: '运动健将', score: 620, isVip: false },
          { userId: 'user10', username: '学习达人', score: 600, isVip: true },
          { userId: 'user11', username: '写作高手', score: 580, isVip: false },
          { userId: 'user12', username: '健康生活家', score: 550, isVip: false }
        ];

        // 根据类型和类别过滤和排序数据
        // 在实际应用中，这应该是在API端完成的
        const filteredUsers = mockUsers.slice(0, limit);

        setUsers(filteredUsers);
      } catch (error) {
        console.error('Failed to load leaderboard data:', error);
        setError('加载排行榜数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboardData();
  }, [selectedType, selectedCategory, limit]);

  // 处理类型切换
  const handleTypeChange = (newType: LeaderboardType) => {
    if (newType !== selectedType) {
      playSound(SoundType.BUTTON_CLICK);
      setSelectedType(newType);
    }
  };

  // 处理类别切换
  const handleCategoryChange = (newCategory: LeaderboardCategory) => {
    if (newCategory !== selectedCategory) {
      playSound(SoundType.BUTTON_CLICK);
      setSelectedCategory(newCategory);
    }
  };

  // 获取类型文本
  const getTypeText = (type: LeaderboardType) => {
    switch (type) {
      case LeaderboardType.DAILY:
        return labels?.typeDaily?.[language] || '每日';
      case LeaderboardType.WEEKLY:
        return labels?.typeWeekly?.[language] || '每周';
      case LeaderboardType.MONTHLY:
        return labels?.typeMonthly?.[language] || '每月';
      case LeaderboardType.ALL_TIME:
        return labels?.typeAllTime?.[language] || '总榜';
      default:
        return '';
    }
  };

  // 获取类别文本
  const getCategoryText = (category: LeaderboardCategory) => {
    switch (category) {
      case LeaderboardCategory.TASKS_COMPLETED:
        return labels?.categoryTasksCompleted?.[language] || '任务完成';
      case LeaderboardCategory.STREAK_DAYS:
        return labels?.categoryStreakDays?.[language] || '连续打卡';
      case LeaderboardCategory.BAMBOO_COLLECTED:
        return labels?.categoryBambooCollected?.[language] || '竹子收集';
      case LeaderboardCategory.EXPERIENCE_GAINED:
        return labels?.categoryExperienceGained?.[language] || '经验获取';
      default:
        return '';
    }
  };

  // 获取当前用户ID
  const getCurrentUserId = () => {
    // 在实际应用中，这应该是从用户状态或认证服务获取的
    return 'user5';
  };

  // 渲染类型过滤器
  const renderTypeFilters = () => (
    <div className="type-filters flex space-x-2 mb-4 overflow-x-auto pb-2">
      {Object.values(LeaderboardType).map(typeValue => (
        <Button
          key={typeValue}
          variant={selectedType === typeValue ? 'jade' : 'secondary'}
          size="small"
          onClick={() => handleTypeChange(typeValue)}
        >
          {getTypeText(typeValue)}
        </Button>
      ))}
    </div>
  );

  // 渲染类别过滤器
  const renderCategoryFilters = () => (
    <div className="category-filters flex space-x-2 mb-4 overflow-x-auto pb-2">
      {Object.values(LeaderboardCategory).map(categoryValue => (
        <Button
          key={categoryValue}
          variant={selectedCategory === categoryValue ? 'jade' : 'secondary'}
          size="small"
          onClick={() => handleCategoryChange(categoryValue)}
        >
          {getCategoryText(categoryValue)}
        </Button>
      ))}
    </div>
  );

  // 渲染加载状态
  const renderLoading = () => (
    <div className="flex justify-center items-center h-40">
      <LoadingSpinner variant="jade" size="medium" />
    </div>
  );

  // 渲染错误状态
  const renderError = () => (
    <div className="text-center p-4">
      <div className="text-red-500 mb-4">{error}</div>
      <Button
        variant="jade"
        onClick={() => window.location.reload()}
      >
        {labels?.retryButton?.[language] || '重试'}
      </Button>
    </div>
  );

  // 渲染排行榜
  const renderLeaderboard = () => (
    <div className="leaderboard-list space-y-2">
      <AnimatePresence>
        {users.map((user, index) => (
          <LeaderboardItem
            key={user.userId}
            userId={user.userId}
            username={user.username}
            rank={index + 1}
            score={user.score}
            avatarUrl={user.avatarUrl}
            isCurrentUser={user.userId === getCurrentUserId()}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={`leaderboard ${className}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {labels?.title?.[language] || '排行榜'}
      </h2>

      {showFilters && (
        <>
          {renderTypeFilters()}
          {renderCategoryFilters()}
        </>
      )}

      {isLoading ? renderLoading() : error ? renderError() : renderLeaderboard()}
    </div>
  );
};

export default Leaderboard;
