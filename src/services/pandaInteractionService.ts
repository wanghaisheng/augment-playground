// src/services/pandaInteractionService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import {
  getPandaState,
  updatePandaMood,
  updatePandaEnergy,
  addPandaExperience
} from './pandaStateService';
import { playSound, SoundType } from '@/utils/sound';
// import type { PandaMood, EnergyLevel } from '@/components/game/PandaAvatar'; // Removed unused import
import { initializePandaInteractionLabels } from '@/data/pandaInteractionLabels';
// Corrected import: InteractionType is an enum (value), others are types.
import { InteractionType, type InteractionRecord, type InteractionResult } from '@/types/pandaInteractionTypes';
import type { Table, Collection } from 'dexie'; // Ensure Table and Collection are imported

// 互动类型
// export enum InteractionType { ... }

// 互动记录类型
// export interface InteractionRecord { ... }

// 互动结果类型
// export interface InteractionResult { ... }

// 互动冷却时间（毫秒）
const INTERACTION_COOLDOWNS = {
  [InteractionType.PET]: 5000,      // 5秒
  [InteractionType.FEED]: 60000,    // 1分钟
  [InteractionType.PLAY]: 120000,   // 2分钟
  [InteractionType.TRAIN]: 300000,  // 5分钟
  [InteractionType.CLEAN]: 600000,  // 10分钟
  [InteractionType.TALK]: 30000,    // 30秒
  [InteractionType.GIFT]: 3600000,  // 1小时
  [InteractionType.PHOTO]: 60000,   // 1分钟
  [InteractionType.SLEEP]: 28800000,// 8小时
  [InteractionType.WAKE]: 0         // 无冷却
};

// 互动经验值
const INTERACTION_EXPERIENCE = {
  [InteractionType.PET]: 2,
  [InteractionType.FEED]: 10,
  [InteractionType.PLAY]: 15,
  [InteractionType.TRAIN]: 20,
  [InteractionType.CLEAN]: 5,
  [InteractionType.TALK]: 3,
  [InteractionType.GIFT]: 25,
  [InteractionType.PHOTO]: 5,
  [InteractionType.SLEEP]: 30,
  [InteractionType.WAKE]: 5
};

// 互动音效
const INTERACTION_SOUNDS = {
  [InteractionType.PET]: SoundType.PANDA_HAPPY,
  [InteractionType.FEED]: SoundType.PANDA_EAT,
  [InteractionType.PLAY]: SoundType.PANDA_PLAY,
  [InteractionType.TRAIN]: SoundType.PANDA_TRAIN,
  [InteractionType.CLEAN]: SoundType.WATER_SPLASH,
  [InteractionType.TALK]: SoundType.PANDA_TALK,
  [InteractionType.GIFT]: SoundType.SUCCESS,
  [InteractionType.PHOTO]: SoundType.CAMERA_SHUTTER,
  [InteractionType.SLEEP]: SoundType.LULLABY,
  [InteractionType.WAKE]: SoundType.MORNING_BELL
};

// 互动动画
const INTERACTION_ANIMATIONS = {
  [InteractionType.PET]: 'pet',
  [InteractionType.FEED]: 'eat',
  [InteractionType.PLAY]: 'play',
  [InteractionType.TRAIN]: 'train',
  [InteractionType.CLEAN]: 'clean',
  [InteractionType.TALK]: 'talk',
  [InteractionType.GIFT]: 'happy',
  [InteractionType.PHOTO]: 'pose',
  [InteractionType.SLEEP]: 'sleep',
  [InteractionType.WAKE]: 'wake'
};

// 上次互动时间记录
const lastInteractionTimes: Record<InteractionType, Date | null> = {
  [InteractionType.PET]: null,
  [InteractionType.FEED]: null,
  [InteractionType.PLAY]: null,
  [InteractionType.TRAIN]: null,
  [InteractionType.CLEAN]: null,
  [InteractionType.TALK]: null,
  [InteractionType.GIFT]: null,
  [InteractionType.PHOTO]: null,
  [InteractionType.SLEEP]: null,
  [InteractionType.WAKE]: null
};

/**
 * 初始化熊猫互动系统
 */
export async function initializePandaInteraction(): Promise<void> {
  try {
    // Dexie handles table creation via version().stores()
    await initializePandaInteractionLabels();
    console.log('Panda interaction system initialized, tables ensured by Dexie schema.');
  } catch (error) {
    console.error('Failed to initialize panda interaction system:', error);
  }
}

/**
 * 检查互动冷却时间
 * @param type 互动类型
 * @returns 是否在冷却中，如果是，返回剩余冷却时间（毫秒）
 */
export function checkInteractionCooldown(type: InteractionType): { inCooldown: boolean; remainingTime: number } {
  const lastTime = lastInteractionTimes[type];
  if (!lastTime) {
    return { inCooldown: false, remainingTime: 0 };
  }

  const now = new Date();
  const cooldownTime = INTERACTION_COOLDOWNS[type];
  const elapsedTime = now.getTime() - lastTime.getTime();
  const remainingTime = Math.max(0, cooldownTime - elapsedTime);

  return {
    inCooldown: remainingTime > 0,
    remainingTime
  };
}

/**
 * 执行熊猫互动
 * @param type 互动类型
 * @param item 使用的物品（可选）
 * @returns 互动结果
 */
export async function performInteraction(type: InteractionType, item?: string): Promise<InteractionResult> {
  try {
    const cooldownCheck = checkInteractionCooldown(type);
    if (cooldownCheck.inCooldown) {
      return {
        success: false,
        message: `此互动还在冷却中，请等待 ${Math.ceil(cooldownCheck.remainingTime / 1000)} 秒`,
        experienceGained: 0,
        moodChanged: false,
        energyChanged: false,
        cooldown: Math.ceil(cooldownCheck.remainingTime / 1000)
      };
    }

    const currentState = await getPandaState();
    let moodAfter = currentState.mood;
    let energyAfter = currentState.energy;
    let experienceGained = INTERACTION_EXPERIENCE[type];
    let resultMessage = '互动成功！';

    switch (type) {
      case InteractionType.PET:
        moodAfter = 'happy';
        break;
      case InteractionType.FEED:
        energyAfter = 'high';
        moodAfter = 'happy';
        break;
      case InteractionType.PLAY:
        moodAfter = 'happy';
        energyAfter = currentState.energy === 'high' ? 'medium' : 'low';
        break;
      case InteractionType.TRAIN:
        moodAfter = 'focused';
        energyAfter = currentState.energy === 'high' ? 'medium' : 'low';
        experienceGained = INTERACTION_EXPERIENCE[type] * 1.5;
        break;
      case InteractionType.CLEAN:
        moodAfter = 'happy';
        break;
      case InteractionType.TALK:
        moodAfter = 'happy';
        break;
      case InteractionType.GIFT:
        moodAfter = 'happy';
        experienceGained = INTERACTION_EXPERIENCE[type] * 2;
        break;
      case InteractionType.PHOTO:
        resultMessage = '拍照成功！';
        break;
      case InteractionType.SLEEP:
        energyAfter = 'high';
        moodAfter = 'normal';
        break;
      case InteractionType.WAKE:
        moodAfter = 'normal';
        break;
    }

    if (moodAfter !== currentState.mood) {
      await updatePandaMood(moodAfter);
    }
    if (energyAfter !== currentState.energy) {
      await updatePandaEnergy(energyAfter);
    }
    if (experienceGained > 0) {
      await addPandaExperience(experienceGained);
    }

    const interactionRecord: InteractionRecord = {
      type,
      timestamp: new Date(),
      moodBefore: currentState.mood,
      moodAfter,
      energyBefore: currentState.energy,
      energyAfter,
      experienceGained,
      itemUsed: item,
      notes: resultMessage
    };
    const id = await db.pandaInteractions.add(interactionRecord);
    await addSyncItem('pandaInteractions', 'create', { ...interactionRecord, id });

    lastInteractionTimes[type] = new Date();

    const sound = INTERACTION_SOUNDS[type];
    if (sound) {
      playSound(sound, 0.5);
    }

    return {
      success: true,
      message: resultMessage,
      experienceGained,
      moodChanged: moodAfter !== currentState.mood,
      energyChanged: energyAfter !== currentState.energy,
      newMood: moodAfter,
      newEnergy: energyAfter,
      animation: INTERACTION_ANIMATIONS[type],
      sound,
      cooldown: Math.floor(INTERACTION_COOLDOWNS[type] / 1000)
    };

  } catch (error) {
    console.error('Interaction failed:', error);
    return {
      success: false,
      message: `互动失败：${error instanceof Error ? error.message : '未知错误'}`,
      experienceGained: 0,
      moodChanged: false,
      energyChanged: false
    };
  }
}

/**
 * 获取互动历史记录
 * @param limit 限制返回的记录数量
 * @param offset 偏移量
 * @returns 互动记录数组
 */
export async function getInteractionHistory(limit: number = 10, offset: number = 0): Promise<InteractionRecord[]> {
  return db.pandaInteractions
    .orderBy('timestamp')
    .reverse()
    .offset(offset)
    .limit(limit)
    .toArray();
}

/**
 * 获取特定类型的互动历史记录
 * @param type 互动类型
 * @param limit 限制返回的记录数量
 * @param offset 偏移量
 * @returns 互动记录数组
 */
export async function getInteractionHistoryByType(type: InteractionType, limit: number = 10, offset: number = 0): Promise<InteractionRecord[]> {
  const filteredInteractions = await db.pandaInteractions
    .where('type')
    .equals(type)
    .toArray(); // Get all matching records

  // Sort in JavaScript (descending by timestamp)
  const sortedInteractions = filteredInteractions.sort((a, b) => {
    const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
    const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
    return timeB - timeA;
  });

  return sortedInteractions.slice(offset, offset + limit);
}

/**
 * 获取互动统计信息
 * @returns 互动统计信息
 */
export async function getInteractionStats(): Promise<Record<InteractionType, { count: number; lastTime: Date | null; totalExperience: number }>> {
  const allInteractions = await db.pandaInteractions.toArray();

  const stats: Record<InteractionType, { count: number; lastTime: Date | null; totalExperience: number }> = {
    [InteractionType.PET]: { count: 0, lastTime: null, totalExperience: 0 },
    [InteractionType.FEED]: { count: 0, lastTime: null, totalExperience: 0 },
    [InteractionType.PLAY]: { count: 0, lastTime: null, totalExperience: 0 },
    [InteractionType.TRAIN]: { count: 0, lastTime: null, totalExperience: 0 },
    [InteractionType.CLEAN]: { count: 0, lastTime: null, totalExperience: 0 },
    [InteractionType.TALK]: { count: 0, lastTime: null, totalExperience: 0 },
    [InteractionType.GIFT]: { count: 0, lastTime: null, totalExperience: 0 },
    [InteractionType.PHOTO]: { count: 0, lastTime: null, totalExperience: 0 },
    [InteractionType.SLEEP]: { count: 0, lastTime: null, totalExperience: 0 },
    [InteractionType.WAKE]: { count: 0, lastTime: null, totalExperience: 0 }
  };

  for (const interaction of allInteractions) {
    const typeAsEnum: InteractionType = interaction.type;
    stats[typeAsEnum].count++;
    stats[typeAsEnum].totalExperience += interaction.experienceGained;

    if (!stats[typeAsEnum].lastTime || new Date(interaction.timestamp) > stats[typeAsEnum].lastTime) {
      stats[typeAsEnum].lastTime = new Date(interaction.timestamp);
    }
  }

  return stats;
}
