// src/services/pandaStateService.ts
import { db } from '@/db';
import { addSyncItem } from './dataSyncService';
import type { PandaMood, EnergyLevel } from '@/components/game/PandaAvatar';

// 熊猫状态记录类型
export interface PandaStateRecord {
  id?: number;
  mood: PandaMood;
  energy: EnergyLevel;
  lastUpdated: Date;
  experience: number; // 经验值
  level: number; // 等级
}

// 默认熊猫状态
const DEFAULT_PANDA_STATE: PandaStateRecord = {
  mood: 'normal',
  energy: 'medium',
  lastUpdated: new Date(),
  experience: 0,
  level: 1
};

/**
 * 获取当前熊猫状态
 * 如果不存在，则创建默认状态
 */
export async function getPandaState(): Promise<PandaStateRecord> {
  // 检查数据库中是否已有熊猫状态记录
  const pandaState = await db.table('pandaState').toArray();

  if (pandaState.length === 0) {
    // 如果没有记录，创建默认状态
    const id = await db.table('pandaState').add(DEFAULT_PANDA_STATE);
    return { ...DEFAULT_PANDA_STATE, id };
  }

  return pandaState[0];
}

/**
 * 更新熊猫情绪状态
 * @param mood 新的情绪状态
 */
export async function updatePandaMood(mood: PandaMood): Promise<PandaStateRecord> {
  const currentState = await getPandaState();
  const updatedState = {
    ...currentState,
    mood,
    lastUpdated: new Date()
  };

  // 更新数据库
  await db.table('pandaState').update(currentState.id!, updatedState);

  // 添加同步项目
  await addSyncItem('pandaState', 'update', updatedState);

  return updatedState;
}

/**
 * 更新熊猫能量级别
 * @param energy 新的能量级别
 */
export async function updatePandaEnergy(energy: EnergyLevel): Promise<PandaStateRecord> {
  const currentState = await getPandaState();
  const updatedState = {
    ...currentState,
    energy,
    lastUpdated: new Date()
  };

  // 更新数据库
  await db.table('pandaState').update(currentState.id!, updatedState);

  // 添加同步项目
  await addSyncItem('pandaState', 'update', updatedState);

  return updatedState;
}

/**
 * 增加熊猫经验值
 * @param amount 增加的经验值数量
 */
export async function addPandaExperience(amount: number): Promise<PandaStateRecord> {
  const currentState = await getPandaState();
  const newExperience = currentState.experience + amount;

  // 简单的等级计算逻辑：每100点经验升一级
  const newLevel = Math.floor(newExperience / 100) + 1;

  const updatedState = {
    ...currentState,
    experience: newExperience,
    level: newLevel,
    lastUpdated: new Date()
  };

  // 如果升级了，更新情绪为开心
  if (newLevel > currentState.level) {
    updatedState.mood = 'happy';
  }

  // 更新数据库
  await db.table('pandaState').update(currentState.id!, updatedState);

  // 添加同步项目
  await addSyncItem('pandaState', 'update', updatedState);

  return updatedState;
}

/**
 * 重置熊猫状态（用于测试或重新开始）
 */
export async function resetPandaState(): Promise<PandaStateRecord> {
  const currentState = await getPandaState();
  const resetState = {
    ...DEFAULT_PANDA_STATE,
    id: currentState.id,
    lastUpdated: new Date()
  };

  // 更新数据库
  await db.table('pandaState').update(currentState.id!, resetState);

  // 添加同步项目
  await addSyncItem('pandaState', 'update', resetState);

  return resetState;
}
