// src/components/vip/ResourceShortagePrompt.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import LatticeDialog from '@/components/game/LatticeDialog';
import { playSound, SoundType } from '@/utils/sound';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { usePandaState } from '@/context/PandaStateProvider';

import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import { fetchResourceShortageView } from '@/services/localizedContentService';
import { Language } from '@/types';

interface ResourceShortagePromptProps {
  isOpen: boolean;
  onClose: () => void;
  resourceType: 'bamboo' | 'coin' | 'energy';
  currentAmount: number;
  thresholdAmount: number;
}

/**
 * 资源不足提示组件
 *
 * 当用户资源不足时提供VIP解决方案
 */
const ResourceShortagePrompt: React.FC<ResourceShortagePromptProps> = ({
  isOpen,
  onClose,
  resourceType,
  currentAmount,
  thresholdAmount
}) => {
  const navigate = useNavigate();
  const { pandaState } = usePandaState();
  const isVip = pandaState?.isVip || false;

  const [isRewarded, setIsRewarded] = useState(false);

  // Function to fetch localized content for resource shortage
  const fetchResourceShortageViewFn = React.useCallback(async (lang: Language) => {
    try {
      return await fetchResourceShortageView(lang);
    } catch (error) {
      console.error('Error fetching resource shortage view:', error);
      throw error;
    }
  }, []);

  // Fetch localized content for the resource shortage
  const { data: viewData } = useLocalizedView<null, { labels: { [key: string]: string } }>('resourceShortage', fetchResourceShortageViewFn);

  // Get content from viewData
  const content = viewData?.labels || {} as { [key: string]: string };

  // Get refresh function from context
  const { refreshTable } = useDataRefreshContext();

  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.BUTTON_CLICK);
    onClose();
    navigate('/vip-benefits');
  };

  // 处理关闭
  const handleClose = () => {
    playSound(SoundType.BUTTON_CLICK);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // 处理领取VIP资源
  const handleClaimVipResource = async () => {
    if (!isVip || isRewarded) return;

    try {
      playSound(SoundType.REWARD);
      setIsRewarded(true);

      // 刷新数据
      refreshTable('rewards');
      refreshTable('userCurrencies');

      // 延迟关闭对话框
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to claim VIP resource:', error);
    }
  };

  // 获取资源类型文本
  const getResourceTypeText = () => {
    switch (resourceType) {
      case 'bamboo':
        return content.bambooText || '竹子';
      case 'coin':
        return content.coinText || '金币';
      case 'energy':
        return content.energyText || '能量';
      default:
        return content.resourceText || '资源';
    }
  };

  // 获取资源图标
  const getResourceIcon = () => {
    switch (resourceType) {
      case 'bamboo':
        return '/assets/resources/bamboo.svg';
      case 'coin':
        return '/assets/resources/coin.svg';
      case 'energy':
        return '/assets/resources/energy.svg';
      default:
        return '/assets/resources/generic.svg';
    }
  };

  // 获取VIP资源数量
  const getVipResourceAmount = () => {
    switch (resourceType) {
      case 'bamboo':
        return 50;
      case 'coin':
        return 100;
      case 'energy':
        return 30;
      default:
        return 50;
    }
  };

  // 获取标题
  const getTitle = () => {
    const resourceText = getResourceTypeText();
    return content.title?.replace('{resource}', resourceText) || `${resourceText}不足提醒`;
  };

  // 获取描述
  const getDescription = () => {
    const resourceText = getResourceTypeText();
    return content.description?.replace('{resource}', resourceText)
                              .replace('{current}', currentAmount.toString())
                              .replace('{threshold}', thresholdAmount.toString()) ||
           `您的${resourceText}不足，当前仅剩${currentAmount}${resourceText}，低于${thresholdAmount}${resourceText}的推荐水平。`;
  };

  // 获取VIP解决方案
  const getVipSolution = () => {
    const resourceText = getResourceTypeText();
    const vipAmount = getVipResourceAmount();
    return content.vipSolution?.replace('{resource}', resourceText)
                              .replace('{amount}', vipAmount.toString()) ||
           `作为VIP会员，您可以立即领取${vipAmount}${resourceText}，并且每天都能获得额外的${resourceText}奖励。`;
  };

  // 获取普通解决方案
  const getRegularSolution = () => {
    const resourceText = getResourceTypeText();
    return content.regularSolution?.replace('{resource}', resourceText) ||
           `您可以通过完成任务和挑战来获取更多${resourceText}，或者升级为VIP会员享受资源加成。`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <LatticeDialog
          isOpen={true}
          onClose={handleClose}
          title={getTitle()}
          showCloseButton={true}
        >
          <div className="resource-shortage-content">
            <div className="flex items-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
                isVip ? 'bg-gold-50 border-2 border-gold-300' : 'bg-gray-50 border border-gray-300'
              }`}>
                <motion.img
                  src={getResourceIcon()}
                  alt="Resource"
                  className="w-10 h-10"
                  animate={isVip ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: isVip ? Infinity : 0,
                    repeatDelay: 1
                  }}
                />
              </div>

              <div className="flex-1">
                <p className="text-gray-700 mb-4">
                  {getDescription()}
                </p>

                <div className={`p-3 rounded-lg ${isVip ? 'bg-gold-50 border border-gold-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <h3 className={`font-medium mb-2 ${isVip ? 'text-gold-700' : 'text-gray-700'}`}>
                    {isVip ? (
                      <span className="flex items-center">
                        <span className="mr-1">★</span>
                        {content.vipSolutionTitle || 'VIP解决方案'}
                      </span>
                    ) : (
                      content.regularSolutionTitle || '推荐解决方案'
                    )}
                  </h3>

                  <p className="text-gray-600">
                    {isVip ? getVipSolution() : getRegularSolution()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isRewarded}
              >
                {content.laterButton || '稍后再说'}
              </Button>

              {!isVip ? (
                <Button
                  variant="gold"
                  onClick={handleNavigateToVip}
                  disabled={isRewarded}
                >
                  {content.upgradeButton || '升级到VIP'}
                </Button>
              ) : (
                <Button
                  variant="gold"
                  onClick={handleClaimVipResource}
                  disabled={isRewarded}
                  isLoading={isRewarded}
                >
                  {isRewarded
                    ? (content.claimedButton || '已领取')
                    : (content.claimButton || '领取VIP资源')}
                </Button>
              )}
            </div>

            {/* 成功领取资源的动画 */}
            <AnimatePresence>
              {isRewarded && (
                <motion.div
                  className="absolute inset-0 bg-gold-500 bg-opacity-20 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white rounded-full p-4"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    <svg className="w-16 h-16 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </LatticeDialog>
      )}
    </AnimatePresence>
  );
};

export default ResourceShortagePrompt;
