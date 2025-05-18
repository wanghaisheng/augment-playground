// src/services/highlightMomentService.ts
import { isUserVip } from './storeService';
import { RewardType, RewardRarity } from './rewardService';
import { applyResourceMultiplier } from './resourceMultiplierService';

/**
 * 高光时刻类型
 */
export enum HighlightMomentType {
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',   // 成就解锁
  LEVEL_UP = 'level_up',                           // 等级提升
  RARE_REWARD = 'rare_reward',                     // 稀有奖励
  CHALLENGE_COMPLETED = 'challenge_completed',     // 挑战完成
  STREAK_MILESTONE = 'streak_milestone',           // 连续打卡里程碑
  ABILITY_UNLOCKED = 'ability_unlocked',           // 能力解锁
  COLLECTION_COMPLETED = 'collection_completed',   // 收集完成
  SPECIAL_EVENT = 'special_event'                  // 特殊事件
}

/**
 * 高光时刻数据
 */
export interface HighlightMomentData {
  type: HighlightMomentType;                       // 高光时刻类型
  title?: string;                                  // 标题
  description?: string;                            // 描述
  rewardType?: RewardType;                         // 奖励类型
  rewardAmount?: number;                           // 奖励数量
  rarity?: RewardRarity;                           // 稀有度
  imageUrl?: string;                               // 图片URL
  sourceId?: number | string;                      // 来源ID（如成就ID、挑战ID等）
  sourceName?: string;                             // 来源名称
  additionalData?: Record<string, any>;            // 额外数据
}

/**
 * 高光时刻处理器
 */
export type HighlightMomentHandler = (data: HighlightMomentData) => Promise<void>;

// 存储高光时刻处理器
const highlightMomentHandlers: HighlightMomentHandler[] = [];

/**
 * 注册高光时刻处理器
 * @param handler 处理器函数
 * @returns 取消注册的函数
 */
export function registerHighlightMomentHandler(handler: HighlightMomentHandler): () => void {
  highlightMomentHandlers.push(handler);

  // 返回取消注册的函数
  return () => {
    const index = highlightMomentHandlers.indexOf(handler);
    if (index !== -1) {
      highlightMomentHandlers.splice(index, 1);
    }
  };
}

/**
 * 触发高光时刻
 * @param data 高光时刻数据
 */
export async function triggerHighlightMoment(data: HighlightMomentData): Promise<void> {
  try {
    // 调用所有注册的处理器
    for (const handler of highlightMomentHandlers) {
      await handler(data);
    }
  } catch (error) {
    console.error('Error triggering highlight moment:', error);
  }
}

/**
 * 检查是否应该显示VIP提示
 * @param data 高光时刻数据
 * @returns 是否应该显示VIP提示
 */
export async function shouldShowVipPrompt(data: HighlightMomentData): Promise<boolean> {
  try {
    // 检查用户是否已经是VIP
    const isVip = await isUserVip('current-user');

    // 如果用户已经是VIP，根据高光时刻类型决定是否显示
    if (isVip) {
      // 对于VIP用户，只在特定情况下显示（如获得了VIP加成的奖励）
      return data.rewardType !== undefined && data.rewardAmount !== undefined;
    }

    // 对于非VIP用户，根据高光时刻类型决定是否显示
    switch (data.type) {
      case HighlightMomentType.ACHIEVEMENT_UNLOCKED:
      case HighlightMomentType.LEVEL_UP:
      case HighlightMomentType.RARE_REWARD:
      case HighlightMomentType.CHALLENGE_COMPLETED:
      case HighlightMomentType.STREAK_MILESTONE:
        // 这些高光时刻总是显示VIP提示
        return true;

      case HighlightMomentType.ABILITY_UNLOCKED:
      case HighlightMomentType.COLLECTION_COMPLETED:
      case HighlightMomentType.SPECIAL_EVENT:
        // 这些高光时刻根据稀有度决定是否显示
        if (data.rarity) {
          return data.rarity === RewardRarity.RARE ||
                 data.rarity === RewardRarity.EPIC ||
                 data.rarity === RewardRarity.LEGENDARY;
        }
        return false;

      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking if should show VIP prompt:', error);
    return false;
  }
}

/**
 * 计算VIP奖励数量
 * @param data 高光时刻数据
 * @returns VIP奖励数量
 */
export async function calculateVipRewardAmount(data: HighlightMomentData): Promise<number> {
  try {
    if (data.rewardType === undefined || data.rewardAmount === undefined) {
      return 0;
    }

    // 计算VIP奖励数量
    const vipAmount = await applyResourceMultiplier(data.rewardType, data.rewardAmount);
    return vipAmount;
  } catch (error) {
    console.error('Error calculating VIP reward amount:', error);
    return data.rewardAmount || 0;
  }
}

/**
 * 获取高光时刻的VIP提示数据
 * @param data 高光时刻数据
 * @returns VIP提示数据
 */
export async function getVipPromptData(data: HighlightMomentData): Promise<{
  baseAmount: number;
  vipAmount: number;
  rewardType: RewardType;
  rarity: RewardRarity;
  source: string;
  promptType: HighlightMomentType;
} | null> {
  try {
    // 检查是否应该显示VIP提示
    const shouldShow = await shouldShowVipPrompt(data);
    if (!shouldShow) {
      return null;
    }

    // 如果没有奖励类型或数量，返回null
    if (data.rewardType === undefined || data.rewardAmount === undefined) {
      return null;
    }

    // 计算VIP奖励数量
    const vipAmount = await calculateVipRewardAmount(data);

    return {
      baseAmount: data.rewardAmount,
      vipAmount,
      rewardType: data.rewardType,
      rarity: data.rarity || RewardRarity.COMMON,
      source: data.sourceName || '',
      promptType: data.type
    };
  } catch (error) {
    console.error('Error getting VIP prompt data:', error);
    return null;
  }
}
