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
  isVip?: boolean; // VIP状态
}

// 扩展的熊猫状态（用于游戏初始化）
export interface PandaState extends Omit<PandaStateRecord, 'lastUpdated'> {
  name?: string;
  outfit?: string;
  accessories?: string[];
  isVip?: boolean;
}

// 默认熊猫状态
const DEFAULT_PANDA_STATE: PandaStateRecord = {
  mood: 'normal',
  energy: 'medium',
  lastUpdated: new Date(),
  experience: 0,
  level: 1,
  isVip: false
};


export async function getPandaMood(): Promise<PandaMood> {
  const pandaState = await getPandaState();
  return pandaState.mood;
}

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

/**
 * 更新熊猫状态（用于游戏初始化）
 * @param state 新的熊猫状态
 */
export async function updatePandaState(state: PandaState): Promise<PandaStateRecord> {
  const currentState = await getPandaState();

  // 创建更新后的状态
  const updatedState = {
    ...currentState,
    mood: state.mood || currentState.mood,
    energy: typeof state.energy === 'number' ? state.energy : currentState.energy,
    experience: state.experience !== undefined ? state.experience : currentState.experience,
    level: state.level || currentState.level,
    isVip: state.isVip !== undefined ? state.isVip : currentState.isVip,
    lastUpdated: new Date()
  };

  // 更新数据库
  await db.table('pandaState').update(currentState.id!, updatedState);

  // 添加同步项目
  await addSyncItem('pandaState', 'update', updatedState);

  // 如果提供了名称、装扮或配件，可以在这里处理
  // 这里假设有一个单独的表来存储这些信息
  if (state.name || state.outfit || state.accessories) {
    console.log('Additional panda customization:', {
      name: state.name,
      outfit: state.outfit,
      accessories: state.accessories
    });
    // 在实际应用中，这里可以更新相应的表
  }

  return updatedState;
}

/**
 * 更新熊猫VIP状态
 * @param isVip 新的VIP状态
 */
export async function updatePandaVipStatus(isVip: boolean): Promise<PandaStateRecord> {
  const currentState = await getPandaState();
  const updatedState = {
    ...currentState,
    isVip,
    lastUpdated: new Date()
  };

  // 更新数据库
  await db.table('pandaState').update(currentState.id!, updatedState);

  // 添加同步项目
  await addSyncItem('pandaState', 'update', updatedState);

  return updatedState;
}
