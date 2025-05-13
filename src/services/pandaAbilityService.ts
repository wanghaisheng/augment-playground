// src/services/pandaAbilityService.ts
import { db } from '@/db';
import { RewardRarity } from './rewardService';

// 熊猫能力类型枚举
export enum AbilityType {
  PASSIVE = 'passive',   // 被动能力（常驻效果）
  ACTIVE = 'active',     // 主动能力（需要激活）
  ULTIMATE = 'ultimate'  // 终极能力（强力但有冷却）
}

// 熊猫能力效果类型枚举
export enum AbilityEffectType {
  EXPERIENCE_BOOST = 'experience_boost',       // 经验值提升
  ENERGY_BOOST = 'energy_boost',               // 能量提升
  TASK_EFFICIENCY = 'task_efficiency',         // 任务效率提升
  REWARD_BOOST = 'reward_boost',               // 奖励提升
  MOOD_STABILIZER = 'mood_stabilizer',         // 情绪稳定
  TIME_EXTENSION = 'time_extension',           // 时间延长
  FOCUS_ENHANCEMENT = 'focus_enhancement',     // 专注力增强
  INSPIRATION = 'inspiration',                 // 灵感激发
  RESILIENCE = 'resilience',                   // 韧性增强
  WISDOM = 'wisdom'                            // 智慧提升
}

// 熊猫能力记录类型
export interface PandaAbilityRecord {
  id?: number;
  name: string;
  description: string;
  type: AbilityType;
  effectType: AbilityEffectType;
  effectValue: number;
  iconPath: string;
  rarity: RewardRarity;
  requiredLevel: number;
  isUnlocked: boolean;
  isActive: boolean;
  cooldownMinutes?: number;
  lastUsedAt?: Date;
  unlockDate?: Date;
}

// 预定义的熊猫能力列表
const PREDEFINED_ABILITIES: PandaAbilityRecord[] = [
  // 被动能力 - 初级
  {
    name: '竹林之心',
    description: '被动：完成任务时获得的经验值增加10%',
    type: AbilityType.PASSIVE,
    effectType: AbilityEffectType.EXPERIENCE_BOOST,
    effectValue: 0.1,
    iconPath: '/assets/abilities/bamboo-heart.svg',
    rarity: RewardRarity.COMMON,
    requiredLevel: 2,
    isUnlocked: false,
    isActive: false
  },
  {
    name: '熊猫活力',
    description: '被动：熊猫能量恢复速度提高15%',
    type: AbilityType.PASSIVE,
    effectType: AbilityEffectType.ENERGY_BOOST,
    effectValue: 0.15,
    iconPath: '/assets/abilities/panda-vitality.svg',
    rarity: RewardRarity.COMMON,
    requiredLevel: 3,
    isUnlocked: false,
    isActive: false
  },

  // 主动能力 - 中级
  {
    name: '竹影专注',
    description: '主动：激活后，1小时内完成任务获得的经验值增加25%',
    type: AbilityType.ACTIVE,
    effectType: AbilityEffectType.FOCUS_ENHANCEMENT,
    effectValue: 0.25,
    iconPath: '/assets/abilities/bamboo-focus.svg',
    rarity: RewardRarity.UNCOMMON,
    requiredLevel: 5,
    isUnlocked: false,
    isActive: false,
    cooldownMinutes: 120
  },
  {
    name: '熊猫智慧',
    description: '主动：激活后，2小时内任务完成奖励数量增加20%',
    type: AbilityType.ACTIVE,
    effectType: AbilityEffectType.REWARD_BOOST,
    effectValue: 0.2,
    iconPath: '/assets/abilities/panda-wisdom.svg',
    rarity: RewardRarity.UNCOMMON,
    requiredLevel: 7,
    isUnlocked: false,
    isActive: false,
    cooldownMinutes: 240
  },

  // 终极能力 - 高级
  {
    name: '竹林大师',
    description: '终极：激活后，4小时内所有能力效果提升50%',
    type: AbilityType.ULTIMATE,
    effectType: AbilityEffectType.WISDOM,
    effectValue: 0.5,
    iconPath: '/assets/abilities/bamboo-master.svg',
    rarity: RewardRarity.RARE,
    requiredLevel: 10,
    isUnlocked: false,
    isActive: false,
    cooldownMinutes: 1440 // 24小时
  }
];

/**
 * 初始化熊猫能力系统
 * 如果数据库中没有能力记录，则添加预定义的能力
 */
export async function initializePandaAbilities(): Promise<void> {
  const abilities = await db.table('abilities').toArray();

  if (abilities.length === 0) {
    await db.table('abilities').bulkAdd(PREDEFINED_ABILITIES);
  }
}

/**
 * 获取所有熊猫能力
 */
export async function getAllPandaAbilities(): Promise<PandaAbilityRecord[]> {
  return db.table('abilities').toArray();
}

/**
 * 获取已解锁的熊猫能力
 */
export async function getUnlockedPandaAbilities(): Promise<PandaAbilityRecord[]> {
  try {
    // 检查表是否存在
    if (!db.tables.some(table => table.name === 'abilities')) {
      console.warn('abilities table does not exist yet');
      // 初始化能力系统
      await initializePandaAbilities();
    }

    // 尝试获取所有能力，然后在内存中过滤
    try {
      const allAbilities = await db.table('abilities').toArray();
      // 确保返回的是一个数组，并且每个元素都有正确的属性
      return allAbilities
        .filter(ability => ability && typeof ability === 'object')
        .filter(ability => ability.isUnlocked === true);
    } catch (err) {
      console.error('Error querying unlocked abilities:', err);
      // 如果查询失败，返回空数组
      return [];
    }
  } catch (err) {
    console.error('Error in getUnlockedPandaAbilities:', err);
    return [];
  }
}

/**
 * 获取可用的熊猫能力（已解锁且未在冷却中）
 */
export async function getAvailablePandaAbilities(): Promise<PandaAbilityRecord[]> {
  const now = new Date();
  const unlockedAbilities = await getUnlockedPandaAbilities();

  return unlockedAbilities.filter(ability => {
    // 被动能力总是可用
    if (ability.type === AbilityType.PASSIVE) {
      return true;
    }

    // 主动或终极能力需要检查冷却时间
    if (ability.lastUsedAt && ability.cooldownMinutes) {
      const cooldownEndTime = new Date(ability.lastUsedAt);
      cooldownEndTime.setMinutes(cooldownEndTime.getMinutes() + ability.cooldownMinutes);

      return now >= cooldownEndTime;
    }

    return true;
  });
}

/**
 * 检查并解锁熊猫能力
 * 根据熊猫当前等级解锁相应的能力
 * @param currentLevel 熊猫当前等级
 */
export async function checkAndUnlockAbilities(currentLevel: number): Promise<PandaAbilityRecord[]> {
  const abilities = await getAllPandaAbilities();
  const newlyUnlocked: PandaAbilityRecord[] = [];

  for (const ability of abilities) {
    if (!ability.isUnlocked && ability.requiredLevel <= currentLevel) {
      // 解锁能力
      const now = new Date();
      await db.table('abilities').update(ability.id!, {
        isUnlocked: true,
        unlockDate: now
      });

      // 添加到新解锁列表
      newlyUnlocked.push({
        ...ability,
        isUnlocked: true,
        unlockDate: now
      });
    }
  }

  return newlyUnlocked;
}

/**
 * 激活熊猫能力
 * @param abilityId 要激活的能力ID
 */
export async function activateAbility(abilityId: number): Promise<PandaAbilityRecord> {
  const ability = await db.table('abilities').get(abilityId);

  if (!ability) {
    throw new Error(`Ability with id ${abilityId} not found`);
  }

  if (!ability.isUnlocked) {
    throw new Error(`Ability with id ${abilityId} is not unlocked yet`);
  }

  // 被动能力不需要激活
  if (ability.type === AbilityType.PASSIVE) {
    return ability;
  }

  // 检查冷却时间
  if (ability.lastUsedAt && ability.cooldownMinutes) {
    const now = new Date();
    const cooldownEndTime = new Date(ability.lastUsedAt);
    cooldownEndTime.setMinutes(cooldownEndTime.getMinutes() + ability.cooldownMinutes);

    if (now < cooldownEndTime) {
      throw new Error(`Ability with id ${abilityId} is still in cooldown`);
    }
  }

  // 激活能力
  const now = new Date();
  const updatedAbility = {
    ...ability,
    isActive: true,
    lastUsedAt: now
  };

  await db.table('abilities').update(abilityId, updatedAbility);
  return updatedAbility;
}

/**
 * 获取能力效果描述
 * @param effectType 能力效果类型
 */
export function getAbilityEffectDescription(effectType: AbilityEffectType): string {
  switch (effectType) {
    case AbilityEffectType.EXPERIENCE_BOOST:
      return '经验值提升';
    case AbilityEffectType.ENERGY_BOOST:
      return '能量提升';
    case AbilityEffectType.TASK_EFFICIENCY:
      return '任务效率提升';
    case AbilityEffectType.REWARD_BOOST:
      return '奖励提升';
    case AbilityEffectType.MOOD_STABILIZER:
      return '情绪稳定';
    case AbilityEffectType.TIME_EXTENSION:
      return '时间延长';
    case AbilityEffectType.FOCUS_ENHANCEMENT:
      return '专注力增强';
    case AbilityEffectType.INSPIRATION:
      return '灵感激发';
    case AbilityEffectType.RESILIENCE:
      return '韧性增强';
    case AbilityEffectType.WISDOM:
      return '智慧提升';
    default:
      return '未知效果';
  }
}
