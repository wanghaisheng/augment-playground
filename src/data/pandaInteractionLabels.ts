// src/data/pandaInteractionLabels.ts
import { db } from '@/db-old';
import type { UILabelRecord } from '@/types';

/**
 * 熊猫互动标签
 */
export const pandaInteractionLabels: UILabelRecord[] = [
  // 中文标签
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'title', 
    languageCode: 'zh', 
    translatedText: '熊猫互动' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'interactions', 
    languageCode: 'zh', 
    translatedText: '互动' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'statistics', 
    languageCode: 'zh', 
    translatedText: '统计' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'pet', 
    languageCode: 'zh', 
    translatedText: '抚摸' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'feed', 
    languageCode: 'zh', 
    translatedText: '喂食' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'play', 
    languageCode: 'zh', 
    translatedText: '玩耍' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'train', 
    languageCode: 'zh', 
    translatedText: '训练' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'clean', 
    languageCode: 'zh', 
    translatedText: '清洁' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'talk', 
    languageCode: 'zh', 
    translatedText: '对话' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'gift', 
    languageCode: 'zh', 
    translatedText: '赠送礼物' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'photo', 
    languageCode: 'zh', 
    translatedText: '拍照' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'sleep', 
    languageCode: 'zh', 
    translatedText: '睡觉' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'wake', 
    languageCode: 'zh', 
    translatedText: '唤醒' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'confirm', 
    languageCode: 'zh', 
    translatedText: '确认' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'cancel', 
    languageCode: 'zh', 
    translatedText: '取消' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'interacting', 
    languageCode: 'zh', 
    translatedText: '互动中...' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'backToMenu', 
    languageCode: 'zh', 
    translatedText: '返回菜单' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'confirmInteraction', 
    languageCode: 'zh', 
    translatedText: '确定要{interaction}吗？' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'interactionFailed', 
    languageCode: 'zh', 
    translatedText: '互动失败' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'unknownError', 
    languageCode: 'zh', 
    translatedText: '未知错误' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'experience', 
    languageCode: 'zh', 
    translatedText: '经验' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'cooldownMessage', 
    languageCode: 'zh', 
    translatedText: '还在冷却中，剩余' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'seconds', 
    languageCode: 'zh', 
    translatedText: '秒' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'interactionStats', 
    languageCode: 'zh', 
    translatedText: '互动统计' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'interaction', 
    languageCode: 'zh', 
    translatedText: '互动' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'count', 
    languageCode: 'zh', 
    translatedText: '次数' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'lastTime', 
    languageCode: 'zh', 
    translatedText: '上次时间' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'never', 
    languageCode: 'zh', 
    translatedText: '从未' 
  },

  // 英文标签
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'title', 
    languageCode: 'en', 
    translatedText: 'Panda Interaction' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'interactions', 
    languageCode: 'en', 
    translatedText: 'Interactions' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'statistics', 
    languageCode: 'en', 
    translatedText: 'Statistics' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'pet', 
    languageCode: 'en', 
    translatedText: 'Pet' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'feed', 
    languageCode: 'en', 
    translatedText: 'Feed' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'play', 
    languageCode: 'en', 
    translatedText: 'Play' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'train', 
    languageCode: 'en', 
    translatedText: 'Train' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'clean', 
    languageCode: 'en', 
    translatedText: 'Clean' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'talk', 
    languageCode: 'en', 
    translatedText: 'Talk' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'gift', 
    languageCode: 'en', 
    translatedText: 'Gift' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'photo', 
    languageCode: 'en', 
    translatedText: 'Photo' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'sleep', 
    languageCode: 'en', 
    translatedText: 'Sleep' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'wake', 
    languageCode: 'en', 
    translatedText: 'Wake' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'confirm', 
    languageCode: 'en', 
    translatedText: 'Confirm' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'cancel', 
    languageCode: 'en', 
    translatedText: 'Cancel' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'interacting', 
    languageCode: 'en', 
    translatedText: 'Interacting...' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'backToMenu', 
    languageCode: 'en', 
    translatedText: 'Back to Menu' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'confirmInteraction', 
    languageCode: 'en', 
    translatedText: 'Are you sure you want to {interaction}?' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'interactionFailed', 
    languageCode: 'en', 
    translatedText: 'Interaction Failed' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'unknownError', 
    languageCode: 'en', 
    translatedText: 'Unknown Error' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'experience', 
    languageCode: 'en', 
    translatedText: 'Experience' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'cooldownMessage', 
    languageCode: 'en', 
    translatedText: 'is on cooldown, remaining' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'seconds', 
    languageCode: 'en', 
    translatedText: 'seconds' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'interactionStats', 
    languageCode: 'en', 
    translatedText: 'Interaction Statistics' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'interaction', 
    languageCode: 'en', 
    translatedText: 'Interaction' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'count', 
    languageCode: 'en', 
    translatedText: 'Count' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'lastTime', 
    languageCode: 'en', 
    translatedText: 'Last Time' 
  },
  { 
    scopeKey: 'pandaInteraction', 
    labelKey: 'never', 
    languageCode: 'en', 
    translatedText: 'Never' 
  }
];

/**
 * 初始化熊猫互动标签
 */
export async function initializePandaInteractionLabels(): Promise<void> {
  // 检查标签是否已存在
  const existingLabels = await db.table('uiLabels')
    .where('scopeKey')
    .equals('pandaInteraction')
    .count();

  // 如果标签不存在，添加标签
  if (existingLabels === 0) {
    await db.table('uiLabels').bulkAdd(pandaInteractionLabels);
    console.log('Panda interaction labels initialized');
  }
}
