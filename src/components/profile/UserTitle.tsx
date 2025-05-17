// src/components/profile/UserTitle.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getActiveUserTitle, UserTitleRecord, UserTitleType } from '@/services/userTitleService';
import { usePandaState } from '@/context/PandaStateProvider';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchUserTitleView } from '@/services/localizedContentService';
import { useLanguage } from '@/context/LanguageProvider';

interface UserTitleProps {
  userId: string;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  className?: string;
}

/**
 * 用户称号组件
 *
 * 显示用户当前激活的称号
 */
const UserTitle: React.FC<UserTitleProps> = ({
  userId,
  size = 'medium',
  showIcon = true,
  className = ''
}) => {
  const [title, setTitle] = useState<UserTitleRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { pandaState } = usePandaState();
  const isVip = pandaState?.isVip || false;
  const { language } = useLanguage();

  // 本地化视图
  const { labels } = useLocalizedView(
    'userTitleViewContent',
    fetchUserTitleView
  );

  // 加载用户称号
  useEffect(() => {
    const loadTitle = async () => {
      try {
        setIsLoading(true);
        const activeTitle = await getActiveUserTitle(userId);
        setTitle(activeTitle);
      } catch (error) {
        console.error('Failed to load user title:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTitle();
  }, [userId]);

  // 如果正在加载或没有称号，不显示任何内容
  if (isLoading || !title) {
    return null;
  }

  // 根据称号类型获取图标
  const getTitleIcon = () => {
    switch (title.titleType) {
      case UserTitleType.GUARDIAN:
        return '/assets/titles/guardian.svg';
      case UserTitleType.BAMBOO_GUARDIAN:
        return '/assets/titles/bamboo_guardian.svg';
      case UserTitleType.PANDA_MASTER:
        return '/assets/titles/panda_master.svg';
      case UserTitleType.MEDITATION_MASTER:
        return '/assets/titles/meditation_master.svg';
      case UserTitleType.TASK_MASTER:
        return '/assets/titles/task_master.svg';
      case UserTitleType.CHALLENGE_CHAMPION:
        return '/assets/titles/challenge_champion.svg';
      case UserTitleType.COLLECTOR:
        return '/assets/titles/collector.svg';
      case UserTitleType.CUSTOM:
        return '/assets/titles/custom.svg';
      default:
        return '/assets/titles/default.svg';
    }
  };

  // 根据称号类型获取颜色
  const getTitleColor = () => {
    if (title.isVipExclusive) {
      return 'text-gold-600';
    }

    switch (title.titleType) {
      case UserTitleType.PANDA_MASTER:
      case UserTitleType.MEDITATION_MASTER:
      case UserTitleType.TASK_MASTER:
        return 'text-jade-600';
      case UserTitleType.CHALLENGE_CHAMPION:
        return 'text-cinnabar-600';
      case UserTitleType.COLLECTOR:
        return 'text-indigo-600';
      case UserTitleType.CUSTOM:
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  // 根据尺寸获取样式
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'text-xs py-0.5 px-1.5';
      case 'large':
        return 'text-sm py-1 px-3';
      case 'medium':
      default:
        return 'text-xs py-0.5 px-2';
    }
  };

  // 获取本地化的称号文本
  const getLocalizedTitleText = () => {
    const key = `title_${title.titleType.toLowerCase()}`;
    return labels?.[key]?.[language] || title.titleText;
  };

  return (
    <motion.div
      className={`inline-flex items-center rounded-full ${
        title.isVipExclusive ? 'bg-gold-50 border border-gold-200' : 'bg-gray-50 border border-gray-200'
      } ${getSizeStyles()} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showIcon && (
        <img
          src={getTitleIcon()}
          alt=""
          className={`mr-1 ${size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4'}`}
        />
      )}
      <span className={`font-medium ${getTitleColor()}`}>
        {getLocalizedTitleText()}
      </span>
      {title.isVipExclusive && (
        <motion.span
          className="ml-1 text-gold-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ★
        </motion.span>
      )}
    </motion.div>
  );
};

export default UserTitle;
