// src/pages/SocialComparisonPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Leaderboard, { LeaderboardType, LeaderboardCategory } from '@/components/social/Leaderboard';
import Button from '@/components/common/Button';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { usePandaState } from '@/context/PandaStateProvider';
import { useNavigate } from 'react-router-dom';
import { playSound, SoundType } from '@/utils/sound';
import type { SocialComparisonPageViewLabelsBundle, SocialComparisonPageDataPayload } from '@/types'; // Import types
import { fetchSocialComparisonPageView } from '@/services'; // Import service
import LoadingSpinner from '@/components/common/LoadingSpinner'; // For loading state
import ErrorDisplay from '@/components/common/ErrorDisplay'; // For error state

/**
 * 社交比较页面
 * 
 * 显示用户排行榜和社交比较功能
 */
const SocialComparisonPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends'>('leaderboard');
  
  const { 
    labels,
    data,
    isLoading,
    isError,
    error,
    refetch 
  } = useLocalizedView<SocialComparisonPageDataPayload | null, SocialComparisonPageViewLabelsBundle>(
    'socialComparisonPageView', // queryKey
    fetchSocialComparisonPageView // fetchViewFn
  );

  const { pandaState } = usePandaState();
  const isVip = pandaState?.isVip || false;
  const navigate = useNavigate();
  
  // Handle loading and error states
  if (isLoading) {
    return <LoadingSpinner text={labels?.loadingText || 'Loading social features...'} />;
  }

  if (isError) {
    return <ErrorDisplay error={error} title={labels?.errorText || 'Error'} onRetry={refetch} />;
  }

  // Fallback for labels if still not loaded (should ideally be handled by isLoading/isError)
  const safeLabels = labels || {} as SocialComparisonPageViewLabelsBundle;
  // const safeData = data || {} as SocialComparisonPageDataPayload;
  
  // 处理切换标签
  const handleTabChange = (tab: 'leaderboard' | 'friends') => {
    if (tab !== activeTab) {
      playSound(SoundType.BUTTON_CLICK);
      setActiveTab(tab);
    }
  };
  
  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.BUTTON_CLICK);
    navigate('/vip-benefits');
  };
  
  return (
    <div className="social-comparison-page p-4">
      <div className="page-header mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {safeLabels.pageTitle || '社区排行'}
        </h1>
        <p className="text-gray-600">
          {safeLabels.pageDescription || '查看社区中的排行榜和好友动态'} 
        </p>
      </div>
      
      {/* 标签切换 */}
      <div className="tabs-container mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`tab-button py-2 px-4 font-medium ${
              activeTab === 'leaderboard' ? 'text-jade-600 border-b-2 border-jade-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('leaderboard')}
          >
            {safeLabels.leaderboardTab || '排行榜'} 
          </button>
          <button
            className={`tab-button py-2 px-4 font-medium ${
              activeTab === 'friends' ? 'text-jade-600 border-b-2 border-jade-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('friends')}
          >
            {safeLabels.friendsTab || '好友动态'} 
          </button>
        </div>
      </div>
      
      {/* 排行榜标签内容 */}
      {activeTab === 'leaderboard' && (
        <div className="leaderboard-tab">
          <Leaderboard
            type={LeaderboardType.WEEKLY}
            category={LeaderboardCategory.TASKS_COMPLETED}
            limit={10}
            showFilters={true}
            // Consider passing labels to Leaderboard if it needs them
          />
          
          {/* VIP提示 */}
          {!isVip && (
            <motion.div
              className="vip-promotion mt-8 p-4 bg-gold-50 border border-gold-200 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-bold text-gold-700 mb-2">
                <span className="mr-1">★</span>
                {safeLabels.vipPromotionTitle || 'VIP会员特权'} 
              </h3>
              <p className="text-gray-600 mb-4">
                {safeLabels.vipPromotionDescription || 'VIP会员在排行榜中拥有专属标识和特效，让您在社区中脱颖而出。此外，VIP会员还可以查看更详细的排行数据和历史记录。'} 
              </p>
              <Button
                variant="gold"
                onClick={handleNavigateToVip}
              >
                {safeLabels.upgradeButton || '升级到VIP'} 
              </Button>
            </motion.div>
          )}
        </div>
      )}
      
      {/* 好友动态标签内容 */}
      {activeTab === 'friends' && (
        <div className="friends-tab">
          <div className="friends-coming-soon text-center p-8 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {safeLabels.comingSoonTitle || '好友功能即将推出'} 
            </h3>
            <p className="text-gray-600 mb-6">
              {safeLabels.comingSoonDescription || '我们正在开发好友功能，敬请期待！您将能够添加好友、查看好友动态，以及与好友一起完成挑战。'} 
            </p>
            
            {/* VIP提示 */}
            {!isVip && (
              <div className="vip-promotion mt-4 p-4 bg-gold-50 border border-gold-200 rounded-lg max-w-md mx-auto">
                <h4 className="font-medium text-gold-700 mb-2">
                  <span className="mr-1">★</span>
                  {safeLabels.vipEarlyAccessTitle || 'VIP抢先体验'} 
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {safeLabels.vipEarlyAccessDescription || 'VIP会员将优先体验好友功能，并获得更多社交互动特权。'} 
                </p>
                <Button
                  variant="gold"
                  onClick={handleNavigateToVip}
                  className="w-full"
                >
                  {safeLabels.upgradeButton || '升级到VIP'} 
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* TODO: Display friend comparison data from `safeData` if available */}
    </div>
  );
};

export default SocialComparisonPage;
