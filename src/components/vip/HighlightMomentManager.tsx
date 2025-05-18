// src/components/vip/HighlightMomentManager.tsx
import React, { useState, useEffect } from 'react';
import {
  registerHighlightMomentHandler,
  HighlightMomentData,
  getVipPromptData,
  HighlightMomentType
} from '@/services/highlightMomentService';
import VipBoostPrompt from './VipBoostPrompt';
import { RewardType, RewardRarity } from '@/services/rewardService';

/**
 * 高光时刻管理器组件
 *
 * 监听高光时刻事件，并在适当的时候显示VIP提示
 */
const HighlightMomentManager: React.FC = () => {
  // 状态
  const [isPromptVisible, setIsPromptVisible] = useState<boolean>(false);
  const [promptData, setPromptData] = useState<{
    rewardType: RewardType;
    baseAmount: number;
    vipAmount: number;
    rarity: RewardRarity;
    source: string;
    promptType: HighlightMomentType;
    title?: string;
    description?: string;
    imageUrl?: string;
  } | null>(null);

  // 处理高光时刻
  useEffect(() => {
    // 注册高光时刻处理器
    const unregister = registerHighlightMomentHandler(async (data: HighlightMomentData) => {
      try {
        // 获取VIP提示数据
        const vipPromptData = await getVipPromptData(data);

        // 如果没有数据，不显示提示
        if (!vipPromptData) {
          return;
        }

        // 设置提示数据
        setPromptData({
          rewardType: vipPromptData.rewardType,
          baseAmount: vipPromptData.baseAmount,
          vipAmount: vipPromptData.vipAmount,
          rarity: vipPromptData.rarity,
          source: vipPromptData.source,
          promptType: vipPromptData.promptType,
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl
        });

        // 显示提示
        setIsPromptVisible(true);
      } catch (error) {
        console.error('Error handling highlight moment:', error);
      }
    });

    // 清理函数
    return () => {
      unregister();
    };
  }, []);

  // 处理关闭提示
  const handleClosePrompt = () => {
    setIsPromptVisible(false);
  };

  // 如果没有提示数据，不渲染任何内容
  if (!promptData) {
    return null;
  }

  return (
    <VipBoostPrompt
      isOpen={isPromptVisible}
      onClose={handleClosePrompt}
      rewardType={promptData.rewardType}
      baseAmount={promptData.baseAmount}
      vipAmount={promptData.vipAmount}
      rarity={promptData.rarity}
      source={promptData.source}
      promptType={promptData.promptType}
      title={promptData.title}
      description={promptData.description}
      imageUrl={promptData.imageUrl}
      animationLevel="normal"
    />
  );
};

export default HighlightMomentManager;

