// src/services/pandaService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { getNewlyUnlockedAbilities } from './abilityService';

/**
 * 熊猫状态接口
 */
export interface PandaState {
  id?: number;
  userId: string;
  name: string;
  level: number;
  experience: number;
  nextLevelExperience: number;
  mood: number;
  energy: number;
  lastFed: Date;
  lastInteraction: Date;
  lastRest: Date;
  evolutionStage: number;
  skinId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 熊猫皮肤接口
 */
export interface PandaSkin {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  requiredLevel: number;
  isDefault: boolean;
  isUnlocked: boolean;
  unlockCondition: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 熊猫进化阶段接口
 */
export interface PandaEvolutionStage {
  stage: number;
  name: string;
  description: string;
  imageUrl: string;
  requiredLevel: number;
  abilities: string[];
}

/**
 * 熊猫互动类型
 */
export enum PandaInteractionType {
  FEED = 'feed',
  PET = 'pet',
  PLAY = 'play',
  TRAIN = 'train',
  REST = 'rest'
}

/**
 * 熊猫互动结果接口
 */
export interface PandaInteractionResult {
  success: boolean;
  message: string;
  moodChange: number;
  energyChange: number;
  experienceGained: number;
  levelUp?: boolean;
  newLevel?: number;
  newAbilities?: Array<{id: number; name: string; description: string}>;
}

/**
 * 默认熊猫状态
 */
const DEFAULT_PANDA_STATE: Omit<PandaState, 'id'> = {
  userId: 'current-user',
  name: '竹竹',
  level: 1,
  experience: 0,
  nextLevelExperience: 100,
  mood: 80,
  energy: 100,
  lastFed: new Date(),
  lastInteraction: new Date(),
  lastRest: new Date(),
  evolutionStage: 1,
  skinId: 'default',
  createdAt: new Date(),
  updatedAt: new Date()
};

/**
 * 熊猫进化阶段配置
 */
const PANDA_EVOLUTION_STAGES: PandaEvolutionStage[] = [
  {
    stage: 1,
    name: '幼年熊猫',
    description: '刚出生的小熊猫，充满好奇心',
    imageUrl: '/assets/images/panda/stage1.png',
    requiredLevel: 1,
    abilities: []
  },
  {
    stage: 2,
    name: '少年熊猫',
    description: '活泼好动的少年熊猫',
    imageUrl: '/assets/images/panda/stage2.png',
    requiredLevel: 5,
    abilities: ['focus_boost']
  },
  {
    stage: 3,
    name: '成年熊猫',
    description: '成熟稳重的成年熊猫',
    imageUrl: '/assets/images/panda/stage3.png',
    requiredLevel: 10,
    abilities: ['bamboo_boost', 'meditation_master']
  },
  {
    stage: 4,
    name: '大师熊猫',
    description: '智慧与力量并存的熊猫大师',
    imageUrl: '/assets/images/panda/stage4.png',
    requiredLevel: 20,
    abilities: ['time_control', 'panda_wisdom']
  }
];

/**
 * 经验值计算公式
 * @param level 当前等级
 * @returns 下一级所需经验值
 */
const calculateNextLevelExperience = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

/**
 * 初始化熊猫状态
 */
export async function initializePandaState(): Promise<PandaState> {
  try {
    // 检查是否已存在熊猫状态
    const existingState = await db.table('pandaState').toArray();

    if (existingState.length > 0) {
      return existingState[0];
    }

    // 创建新的熊猫状态
    const pandaState: Omit<PandaState, 'id'> = {
      ...DEFAULT_PANDA_STATE
    };

    // 添加到数据库
    const id = await db.table('pandaState').add(pandaState);
    const createdState = { ...pandaState, id: id as number };

    // 添加同步项目
    await addSyncItem('pandaState', 'create', createdState);

    return createdState;
  } catch (error) {
    console.error('Failed to initialize panda state:', error);
    throw error;
  }
}

/**
 * 获取熊猫状态
 * @returns 熊猫状态
 */
export async function getPandaState(): Promise<PandaState> {
  try {
    // 确保熊猫状态已初始化
    const pandaState = await initializePandaState();

    // 更新熊猫状态（自动衰减心情和能量）
    return await updatePandaStateOverTime(pandaState);
  } catch (error) {
    console.error('Failed to get panda state:', error);
    throw error;
  }
}

/**
 * 更新熊猫状态
 * @param pandaState 熊猫状态
 * @returns 更新后的熊猫状态
 */
export async function updatePandaState(pandaState: PandaState): Promise<PandaState> {
  try {
    // 更新数据库
    await db.table('pandaState').update(pandaState.id!, pandaState);

    // 添加同步项目
    await addSyncItem('pandaState', 'update', pandaState);

    return pandaState;
  } catch (error) {
    console.error('Failed to update panda state:', error);
    throw error;
  }
}

/**
 * 随时间更新熊猫状态（自动衰减心情和能量）
 * @param pandaState 熊猫状态
 * @returns 更新后的熊猫状态
 */
async function updatePandaStateOverTime(pandaState: PandaState): Promise<PandaState> {
  try {
    const now = new Date();
    const lastInteraction = new Date(pandaState.lastInteraction);
    const hoursSinceLastInteraction = (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60);

    // 如果距离上次互动超过1小时，降低心情和能量
    if (hoursSinceLastInteraction >= 1) {
      // 每小时降低心情2点，最低降至40
      const moodDecay = Math.min(pandaState.mood - 40, hoursSinceLastInteraction * 2);

      // 每小时降低能量1点，最低降至50
      const energyDecay = Math.min(pandaState.energy - 50, hoursSinceLastInteraction * 1);

      // 更新状态
      const updatedState: PandaState = {
        ...pandaState,
        mood: Math.max(40, pandaState.mood - moodDecay),
        energy: Math.max(50, pandaState.energy - energyDecay),
        updatedAt: now
      };

      // 保存更新后的状态
      return await updatePandaState(updatedState);
    }

    return pandaState;
  } catch (error) {
    console.error('Failed to update panda state over time:', error);
    return pandaState;
  }
}

/**
 * 与熊猫互动
 * @param interactionType 互动类型
 * @returns 互动结果
 */
export async function interactWithPanda(
  interactionType: PandaInteractionType
): Promise<PandaInteractionResult> {
  try {
    // 获取熊猫状态
    const pandaState = await getPandaState();
    const now = new Date();

    // 根据互动类型计算效果
    let moodChange = 0;
    let energyChange = 0;
    let experienceGained = 0;
    let message = '';

    switch (interactionType) {
      case PandaInteractionType.FEED:
        // 检查是否可以喂食（距离上次喂食至少1小时）
        const lastFed = new Date(pandaState.lastFed);
        const hoursSinceLastFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastFed < 1) {
          return {
            success: false,
            message: '熊猫刚刚吃过，现在不饿',
            moodChange: 0,
            energyChange: 0,
            experienceGained: 0
          };
        }

        moodChange = 10;
        energyChange = 15;
        experienceGained = 5;
        message = '熊猫吃得很开心！';
        break;

      case PandaInteractionType.PET:
        moodChange = 5;
        energyChange = -2;
        experienceGained = 2;
        message = '熊猫享受你的抚摸';
        break;

      case PandaInteractionType.PLAY:
        // 检查能量是否足够
        if (pandaState.energy < 20) {
          return {
            success: false,
            message: '熊猫太累了，不想玩',
            moodChange: 0,
            energyChange: 0,
            experienceGained: 0
          };
        }

        moodChange = 15;
        energyChange = -15;
        experienceGained = 10;
        message = '熊猫玩得很开心！';
        break;

      case PandaInteractionType.TRAIN:
        // 检查能量是否足够
        if (pandaState.energy < 30) {
          return {
            success: false,
            message: '熊猫太累了，无法训练',
            moodChange: 0,
            energyChange: 0,
            experienceGained: 0
          };
        }

        moodChange = -5;
        energyChange = -20;
        experienceGained = 15;
        message = '熊猫完成了训练，变得更强了！';
        break;

      case PandaInteractionType.REST:
        // 检查是否可以休息（距离上次休息至少2小时）
        const lastRest = new Date(pandaState.lastRest);
        const hoursSinceLastRest = (now.getTime() - lastRest.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastRest < 2) {
          return {
            success: false,
            message: '熊猫刚刚休息过，现在很精神',
            moodChange: 0,
            energyChange: 0,
            experienceGained: 0
          };
        }

        moodChange = 5;
        energyChange = 30;
        experienceGained = 3;
        message = '熊猫休息得很好，恢复了精力';
        break;
    }

    // 更新熊猫状态
    let updatedState: PandaState = {
      ...pandaState,
      mood: Math.min(100, Math.max(0, pandaState.mood + moodChange)),
      energy: Math.min(100, Math.max(0, pandaState.energy + energyChange)),
      experience: pandaState.experience + experienceGained,
      lastInteraction: now,
      updatedAt: now
    };

    // 根据互动类型更新特定字段
    if (interactionType === PandaInteractionType.FEED) {
      updatedState.lastFed = now;
    } else if (interactionType === PandaInteractionType.REST) {
      updatedState.lastRest = now;
    }

    // 检查是否升级
    let levelUp = false;
    let newLevel = pandaState.level;
    let newAbilities: Array<{id: number; name: string; description: string}> = [];

    if (updatedState.experience >= updatedState.nextLevelExperience) {
      levelUp = true;
      newLevel = pandaState.level + 1;

      // 计算新的经验值和下一级所需经验值
      const remainingExp = updatedState.experience - updatedState.nextLevelExperience;
      const nextLevelExp = calculateNextLevelExperience(newLevel);

      // 获取新解锁的能力
      newAbilities = await getNewlyUnlockedAbilities(pandaState.level, newLevel);

      // 检查是否需要进化
      const currentEvolutionStage = PANDA_EVOLUTION_STAGES.find(stage => stage.stage === updatedState.evolutionStage);
      const nextEvolutionStage = PANDA_EVOLUTION_STAGES.find(stage =>
        stage.requiredLevel > currentEvolutionStage!.requiredLevel &&
        stage.requiredLevel <= newLevel
      );

      // 更新状态
      updatedState = {
        ...updatedState,
        level: newLevel,
        experience: remainingExp,
        nextLevelExperience: nextLevelExp,
        evolutionStage: nextEvolutionStage ? nextEvolutionStage.stage : updatedState.evolutionStage
      };
    }

    // 保存更新后的状态
    await updatePandaState(updatedState);

    // 返回互动结果
    return {
      success: true,
      message,
      moodChange,
      energyChange,
      experienceGained,
      levelUp,
      newLevel: levelUp ? newLevel : undefined,
      newAbilities: levelUp ? newAbilities : undefined
    };
  } catch (error) {
    console.error('Failed to interact with panda:', error);
    return {
      success: false,
      message: '与熊猫互动失败',
      moodChange: 0,
      energyChange: 0,
      experienceGained: 0
    };
  }
}
