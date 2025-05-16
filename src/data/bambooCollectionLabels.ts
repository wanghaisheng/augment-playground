// src/data/bambooCollectionLabels.ts
import { db } from '@/db-old';
import type { UILabelRecord } from '@/types';

/**
 * 竹子收集标签
 */
export const bambooCollectionLabels: UILabelRecord[] = [
  // 中文标签
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'title', 
    languageCode: 'zh', 
    translatedText: '竹子收集' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'spotsTab', 
    languageCode: 'zh', 
    translatedText: '收集点' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'statsTab', 
    languageCode: 'zh', 
    translatedText: '统计' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'available', 
    languageCode: 'zh', 
    translatedText: '可收集' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'cooldown', 
    languageCode: 'zh', 
    translatedText: '冷却中' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'depleted', 
    languageCode: 'zh', 
    translatedText: '已耗尽' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'commonBamboo', 
    languageCode: 'zh', 
    translatedText: '普通竹子' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'goldenBamboo', 
    languageCode: 'zh', 
    translatedText: '金色竹子' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'ancientBamboo', 
    languageCode: 'zh', 
    translatedText: '古老竹子' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'magicalBamboo', 
    languageCode: 'zh', 
    translatedText: '魔法竹子' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'homeGarden', 
    languageCode: 'zh', 
    translatedText: '家园花园' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'forestEdge', 
    languageCode: 'zh', 
    translatedText: '森林边缘' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'mountainPath', 
    languageCode: 'zh', 
    translatedText: '山间小路' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'sacredGrove', 
    languageCode: 'zh', 
    translatedText: '神圣竹林' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'enchantedValley', 
    languageCode: 'zh', 
    translatedText: '魔法山谷' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'baseAmount', 
    languageCode: 'zh', 
    translatedText: '基础数量' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'status', 
    languageCode: 'zh', 
    translatedText: '状态' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collections', 
    languageCode: 'zh', 
    translatedText: '收集次数' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collect', 
    languageCode: 'zh', 
    translatedText: '收集' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collecting', 
    languageCode: 'zh', 
    translatedText: '收集中...' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'unknownError', 
    languageCode: 'zh', 
    translatedText: '未知错误' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'noSpotsFound', 
    languageCode: 'zh', 
    translatedText: '没有找到竹子收集点' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'noStatsFound', 
    languageCode: 'zh', 
    translatedText: '没有找到竹子收集统计' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'totalCollected', 
    languageCode: 'zh', 
    translatedText: '总共收集' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'todayCollected', 
    languageCode: 'zh', 
    translatedText: '今日收集' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collectionBySource', 
    languageCode: 'zh', 
    translatedText: '按来源统计' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'source', 
    languageCode: 'zh', 
    translatedText: '来源' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'amount', 
    languageCode: 'zh', 
    translatedText: '数量' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'taskSource', 
    languageCode: 'zh', 
    translatedText: '任务奖励' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'dailySource', 
    languageCode: 'zh', 
    translatedText: '每日奖励' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collectionSource', 
    languageCode: 'zh', 
    translatedText: '主动收集' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'giftSource', 
    languageCode: 'zh', 
    translatedText: '礼物' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'purchaseSource', 
    languageCode: 'zh', 
    translatedText: '购买' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'challengeSource', 
    languageCode: 'zh', 
    translatedText: '挑战奖励' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'battlePassSource', 
    languageCode: 'zh', 
    translatedText: '通行证奖励' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'vipSource', 
    languageCode: 'zh', 
    translatedText: 'VIP奖励' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'noCollectionData', 
    languageCode: 'zh', 
    translatedText: '暂无收集数据' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'errorTitle', 
    languageCode: 'zh', 
    translatedText: '加载错误' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'retry', 
    languageCode: 'zh', 
    translatedText: '重试' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'availableSpots', 
    languageCode: 'zh', 
    translatedText: '可用收集点' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'topSources', 
    languageCode: 'zh', 
    translatedText: '主要来源' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collectionTips', 
    languageCode: 'zh', 
    translatedText: '收集提示' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'tip1', 
    languageCode: 'zh', 
    translatedText: '不同类型的竹子有不同的冷却时间' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'tip2', 
    languageCode: 'zh', 
    translatedText: '金色竹子和古老竹子每天有收集次数限制' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'tip3', 
    languageCode: 'zh', 
    translatedText: '完成任务和挑战也可以获得竹子' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'tip4', 
    languageCode: 'zh', 
    translatedText: 'VIP会员可以获得额外的竹子奖励' 
  },
  
  // 英文标签
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'title', 
    languageCode: 'en', 
    translatedText: 'Bamboo Collection' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'spotsTab', 
    languageCode: 'en', 
    translatedText: 'Collection Spots' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'statsTab', 
    languageCode: 'en', 
    translatedText: 'Statistics' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'available', 
    languageCode: 'en', 
    translatedText: 'Available' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'cooldown', 
    languageCode: 'en', 
    translatedText: 'Cooldown' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'depleted', 
    languageCode: 'en', 
    translatedText: 'Depleted' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'commonBamboo', 
    languageCode: 'en', 
    translatedText: 'Common Bamboo' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'goldenBamboo', 
    languageCode: 'en', 
    translatedText: 'Golden Bamboo' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'ancientBamboo', 
    languageCode: 'en', 
    translatedText: 'Ancient Bamboo' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'magicalBamboo', 
    languageCode: 'en', 
    translatedText: 'Magical Bamboo' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'homeGarden', 
    languageCode: 'en', 
    translatedText: 'Home Garden' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'forestEdge', 
    languageCode: 'en', 
    translatedText: 'Forest Edge' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'mountainPath', 
    languageCode: 'en', 
    translatedText: 'Mountain Path' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'sacredGrove', 
    languageCode: 'en', 
    translatedText: 'Sacred Grove' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'enchantedValley', 
    languageCode: 'en', 
    translatedText: 'Enchanted Valley' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'baseAmount', 
    languageCode: 'en', 
    translatedText: 'Base Amount' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'status', 
    languageCode: 'en', 
    translatedText: 'Status' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collections', 
    languageCode: 'en', 
    translatedText: 'Collections' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collect', 
    languageCode: 'en', 
    translatedText: 'Collect' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collecting', 
    languageCode: 'en', 
    translatedText: 'Collecting...' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'unknownError', 
    languageCode: 'en', 
    translatedText: 'Unknown Error' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'noSpotsFound', 
    languageCode: 'en', 
    translatedText: 'No bamboo collection spots found' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'noStatsFound', 
    languageCode: 'en', 
    translatedText: 'No bamboo collection statistics found' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'totalCollected', 
    languageCode: 'en', 
    translatedText: 'Total Collected' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'todayCollected', 
    languageCode: 'en', 
    translatedText: 'Collected Today' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collectionBySource', 
    languageCode: 'en', 
    translatedText: 'Collection by Source' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'source', 
    languageCode: 'en', 
    translatedText: 'Source' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'amount', 
    languageCode: 'en', 
    translatedText: 'Amount' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'taskSource', 
    languageCode: 'en', 
    translatedText: 'Task Reward' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'dailySource', 
    languageCode: 'en', 
    translatedText: 'Daily Reward' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collectionSource', 
    languageCode: 'en', 
    translatedText: 'Active Collection' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'giftSource', 
    languageCode: 'en', 
    translatedText: 'Gift' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'purchaseSource', 
    languageCode: 'en', 
    translatedText: 'Purchase' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'challengeSource', 
    languageCode: 'en', 
    translatedText: 'Challenge Reward' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'battlePassSource', 
    languageCode: 'en', 
    translatedText: 'Battle Pass Reward' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'vipSource', 
    languageCode: 'en', 
    translatedText: 'VIP Reward' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'noCollectionData', 
    languageCode: 'en', 
    translatedText: 'No collection data available' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'errorTitle', 
    languageCode: 'en', 
    translatedText: 'Loading Error' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'retry', 
    languageCode: 'en', 
    translatedText: 'Retry' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'availableSpots', 
    languageCode: 'en', 
    translatedText: 'Available Collection Spots' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'topSources', 
    languageCode: 'en', 
    translatedText: 'Top Sources' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'collectionTips', 
    languageCode: 'en', 
    translatedText: 'Collection Tips' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'tip1', 
    languageCode: 'en', 
    translatedText: 'Different types of bamboo have different cooldown times' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'tip2', 
    languageCode: 'en', 
    translatedText: 'Golden and Ancient bamboo have daily collection limits' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'tip3', 
    languageCode: 'en', 
    translatedText: 'Complete tasks and challenges to earn more bamboo' 
  },
  { 
    scopeKey: 'bambooCollection', 
    labelKey: 'tip4', 
    languageCode: 'en', 
    translatedText: 'VIP members receive additional bamboo rewards' 
  }
];

/**
 * 初始化竹子收集标签
 */
export async function initializeBambooCollectionLabels(): Promise<void> {
  // 检查标签是否已存在
  const existingLabels = await db.table('uiLabels')
    .where('scopeKey')
    .equals('bambooCollection')
    .count();

  // 如果标签不存在，添加标签
  if (existingLabels === 0) {
    await db.table('uiLabels').bulkAdd(bambooCollectionLabels);
    console.log('Bamboo collection labels initialized');
  }
}
