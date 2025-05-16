// src/data/vipBoostPromptLabels.ts
import { db } from '@/db-old';
import type { UILabelRecord } from '@/types';

/**
 * VIP助推提示标签
 */
export const vipBoostPromptLabels: UILabelRecord[] = [
  // 中文标签
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'experienceReward', 
    languageCode: 'zh', 
    translatedText: '经验值' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'coinReward', 
    languageCode: 'zh', 
    translatedText: '竹币' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'itemReward', 
    languageCode: 'zh', 
    translatedText: '物品' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'badgeReward', 
    languageCode: 'zh', 
    translatedText: '徽章' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'abilityReward', 
    languageCode: 'zh', 
    translatedText: '能力' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'genericReward', 
    languageCode: 'zh', 
    translatedText: '奖励' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipAchievementTitle', 
    languageCode: 'zh', 
    translatedText: 'VIP成就奖励加成!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipTaskTitle', 
    languageCode: 'zh', 
    translatedText: 'VIP任务奖励加成!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipChallengeTitle', 
    languageCode: 'zh', 
    translatedText: 'VIP挑战奖励加成!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipBambooTitle', 
    languageCode: 'zh', 
    translatedText: 'VIP竹子奖励加成!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipGenericTitle', 
    languageCode: 'zh', 
    translatedText: 'VIP奖励加成!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipAchievementTitle', 
    languageCode: 'zh', 
    translatedText: '成为VIP获得更多成就奖励!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipTaskTitle', 
    languageCode: 'zh', 
    translatedText: '成为VIP获得更多任务奖励!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipChallengeTitle', 
    languageCode: 'zh', 
    translatedText: '成为VIP获得更多挑战奖励!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipBambooTitle', 
    languageCode: 'zh', 
    translatedText: '成为VIP获得更多竹子奖励!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipGenericTitle', 
    languageCode: 'zh', 
    translatedText: '成为VIP获得更多奖励!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipDescription', 
    languageCode: 'zh', 
    translatedText: '作为VIP会员，您获得了{multiplier}倍的{rewardType}奖励!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipDescription', 
    languageCode: 'zh', 
    translatedText: '成为VIP会员，您将获得{multiplier}倍的{rewardType}奖励!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'standardReward', 
    languageCode: 'zh', 
    translatedText: '标准奖励' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipReward', 
    languageCode: 'zh', 
    translatedText: 'VIP奖励' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'closeButton', 
    languageCode: 'zh', 
    translatedText: '关闭' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'learnMoreButton', 
    languageCode: 'zh', 
    translatedText: '了解VIP特权' 
  },
  
  // 英文标签
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'experienceReward', 
    languageCode: 'en', 
    translatedText: 'Experience' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'coinReward', 
    languageCode: 'en', 
    translatedText: 'Bamboo Coins' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'itemReward', 
    languageCode: 'en', 
    translatedText: 'Items' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'badgeReward', 
    languageCode: 'en', 
    translatedText: 'Badges' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'abilityReward', 
    languageCode: 'en', 
    translatedText: 'Abilities' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'genericReward', 
    languageCode: 'en', 
    translatedText: 'Rewards' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipAchievementTitle', 
    languageCode: 'en', 
    translatedText: 'VIP Achievement Bonus!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipTaskTitle', 
    languageCode: 'en', 
    translatedText: 'VIP Task Bonus!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipChallengeTitle', 
    languageCode: 'en', 
    translatedText: 'VIP Challenge Bonus!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipBambooTitle', 
    languageCode: 'en', 
    translatedText: 'VIP Bamboo Bonus!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipGenericTitle', 
    languageCode: 'en', 
    translatedText: 'VIP Reward Bonus!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipAchievementTitle', 
    languageCode: 'en', 
    translatedText: 'Get More Achievement Rewards as VIP!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipTaskTitle', 
    languageCode: 'en', 
    translatedText: 'Get More Task Rewards as VIP!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipChallengeTitle', 
    languageCode: 'en', 
    translatedText: 'Get More Challenge Rewards as VIP!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipBambooTitle', 
    languageCode: 'en', 
    translatedText: 'Get More Bamboo Rewards as VIP!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipGenericTitle', 
    languageCode: 'en', 
    translatedText: 'Get More Rewards as VIP!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipDescription', 
    languageCode: 'en', 
    translatedText: 'As a VIP member, you received {multiplier}x {rewardType} bonus!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'nonVipDescription', 
    languageCode: 'en', 
    translatedText: 'Become a VIP member to get {multiplier}x {rewardType} bonus!' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'standardReward', 
    languageCode: 'en', 
    translatedText: 'Standard Reward' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'vipReward', 
    languageCode: 'en', 
    translatedText: 'VIP Reward' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'closeButton', 
    languageCode: 'en', 
    translatedText: 'Close' 
  },
  { 
    scopeKey: 'vipBoostPrompt', 
    labelKey: 'learnMoreButton', 
    languageCode: 'en', 
    translatedText: 'Learn About VIP' 
  }
];

/**
 * 初始化VIP助推提示标签
 */
export async function initializeVipBoostPromptLabels(): Promise<void> {
  // 检查标签是否已存在
  const existingLabels = await db.table('uiLabels')
    .where('scopeKey')
    .equals('vipBoostPrompt')
    .count();

  // 如果标签不存在，添加标签
  if (existingLabels === 0) {
    await db.table('uiLabels').bulkAdd(vipBoostPromptLabels);
    console.log('VIP boost prompt labels initialized');
  }
}
