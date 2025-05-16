// src/data/vipBenefitsLabels.ts
import { db } from '@/db-old';
import type { UILabelRecord } from '@/types';

/**
 * VIP特权标签
 */
export const vipBenefitsLabels: UILabelRecord[] = [
  // 中文标签
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'freeUserLabel', 
    languageCode: 'zh', 
    translatedText: '免费用户' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'vipUserLabel', 
    languageCode: 'zh', 
    translatedText: 'VIP用户' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'activeLabel', 
    languageCode: 'zh', 
    translatedText: '已激活' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'valueComparisonLabel', 
    languageCode: 'zh', 
    translatedText: '价值对比' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'standardLabel', 
    languageCode: 'zh', 
    translatedText: '标准' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'vipLabel', 
    languageCode: 'zh', 
    translatedText: 'VIP' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'coinsLabel', 
    languageCode: 'zh', 
    translatedText: '竹币' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'experienceLabel', 
    languageCode: 'zh', 
    translatedText: '经验值' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'itemsLabel', 
    languageCode: 'zh', 
    translatedText: '物品' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'timeLabel', 
    languageCode: 'zh', 
    translatedText: '时间' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'rewardsLabel', 
    languageCode: 'zh', 
    translatedText: '奖励' 
  },
  
  // 英文标签
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'freeUserLabel', 
    languageCode: 'en', 
    translatedText: 'Free User' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'vipUserLabel', 
    languageCode: 'en', 
    translatedText: 'VIP User' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'activeLabel', 
    languageCode: 'en', 
    translatedText: 'Active' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'valueComparisonLabel', 
    languageCode: 'en', 
    translatedText: 'Value Comparison' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'standardLabel', 
    languageCode: 'en', 
    translatedText: 'Standard' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'vipLabel', 
    languageCode: 'en', 
    translatedText: 'VIP' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'coinsLabel', 
    languageCode: 'en', 
    translatedText: 'Bamboo Coins' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'experienceLabel', 
    languageCode: 'en', 
    translatedText: 'Experience' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'itemsLabel', 
    languageCode: 'en', 
    translatedText: 'Items' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'timeLabel', 
    languageCode: 'en', 
    translatedText: 'Time' 
  },
  { 
    scopeKey: 'vipBenefits', 
    labelKey: 'rewardsLabel', 
    languageCode: 'en', 
    translatedText: 'Rewards' 
  }
];

/**
 * 初始化VIP特权标签
 */
export async function initializeVipBenefitsLabels(): Promise<void> {
  // 检查标签是否已存在
  const existingLabels = await db.table('uiLabels')
    .where('scopeKey')
    .equals('vipBenefits')
    .count();

  // 如果标签不存在，添加标签
  if (existingLabels === 0) {
    await db.table('uiLabels').bulkAdd(vipBenefitsLabels);
    console.log('VIP benefits labels initialized');
  }
}
