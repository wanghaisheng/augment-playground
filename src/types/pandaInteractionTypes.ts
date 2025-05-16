// src/types/pandaInteractionTypes.ts
import type { PandaMood, EnergyLevel } from '@/components/game/PandaAvatar';
import type { SoundType } from '@/utils/sound';

// 互动类型
export enum InteractionType {
  PET = 'pet',         // 抚摸
  FEED = 'feed',       // 喂食
  PLAY = 'play',       // 玩耍
  TRAIN = 'train',     // 训练
  CLEAN = 'clean',     // 清洁
  TALK = 'talk',       // 对话
  GIFT = 'gift',       // 赠送礼物
  PHOTO = 'photo',     // 拍照
  SLEEP = 'sleep',     // 睡觉
  WAKE = 'wake'        // 唤醒
}

// 互动记录类型
export interface InteractionRecord {
  id?: number;
  type: InteractionType;
  timestamp: Date;
  moodBefore: PandaMood;
  moodAfter: PandaMood;
  energyBefore: EnergyLevel;
  energyAfter: EnergyLevel;
  experienceGained: number;
  itemUsed?: string;
  notes?: string;
}

// 互动结果类型
export interface InteractionResult {
  success: boolean;
  message: string;
  experienceGained: number;
  moodChanged: boolean;
  energyChanged: boolean;
  newMood?: PandaMood;
  newEnergy?: EnergyLevel;
  animation?: string;
  sound?: SoundType;
  cooldown?: number; // 冷却时间（秒）
} 