// src/services/resourceMultiplierService.ts
import { db } from '@/db-old';
import { isUserVip } from './storeService';
// import { getPandaState } from './pandaStateService'; // Unused
import { RewardType } from './rewardService';

/**
 * 资源加倍类型
 */
export enum MultiplierType {
  VIP = 'vip',                 // VIP特权加成
  EVENT = 'event',             // 活动加成
  ITEM = 'item',               // 道具加成
  ABILITY = 'ability',         // 熊猫能力加成
  BATTLEPASS = 'battlepass'    // 通行证加成
}

/**
 * 资源加倍记录
 */
export interface ResourceMultiplierRecord {
  id?: number;
  userId: string;
  multiplierType: MultiplierType;
  resourceType: RewardType;
  multiplierValue: number;     // 倍数值，如2.0表示双倍
  startTime: Date;             // 开始时间
  endTime?: Date;              // 结束时间，如果为空则表示永久有效
  isActive: boolean;           // 是否激活
  source: string;              // 来源，如"VIP特权"、"双倍活动"等
  description: string;         // 描述
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 初始化资源加倍表
 */
export async function initializeResourceMultipliers(): Promise<void> {
  try {
    // 检查是否已经初始化
    const multipliers = await db.table('resourceMultipliers').toArray();
    if (multipliers.length > 0) {
      return;
    }

    // 初始化VIP资源加倍
    const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
    const now = new Date();

    // VIP竹子双倍
    const vipBambooMultiplier: ResourceMultiplierRecord = {
      userId,
      multiplierType: MultiplierType.VIP,
      resourceType: RewardType.COIN,
      multiplierValue: 2.0,
      startTime: now,
      isActive: true,
      source: 'VIP特权',
      description: 'VIP会员获得双倍竹子奖励',
      createdAt: now,
      updatedAt: now
    };

    // VIP经验值加成
    const vipExpMultiplier: ResourceMultiplierRecord = {
      userId,
      multiplierType: MultiplierType.VIP,
      resourceType: RewardType.EXPERIENCE,
      multiplierValue: 1.5,
      startTime: now,
      isActive: true,
      source: 'VIP特权',
      description: 'VIP会员获得50%额外经验值',
      createdAt: now,
      updatedAt: now
    };

    // 添加到数据库
    await db.table('resourceMultipliers').bulkAdd([
      vipBambooMultiplier,
      vipExpMultiplier
    ]);

    console.log('Resource multipliers initialized');
  } catch (error) {
    console.error('Failed to initialize resource multipliers:', error);
  }
}

/**
 * 获取资源加倍倍数
 * @param resourceType 资源类型
 * @returns 资源加倍倍数，如果没有加倍则返回1.0
 */
export async function getResourceMultiplier(resourceType: RewardType): Promise<number> {
  try {
    const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
    const now = new Date();

    // 获取所有激活的资源加倍
    const multipliers = await db.table('resourceMultipliers')
      .where('userId')
      .equals(userId)
      .and(m => 
        m.resourceType === resourceType && 
        m.isActive === true && 
        (m.endTime === undefined || m.endTime > now)
      )
      .toArray();

    // 如果没有加倍，返回1.0
    if (multipliers.length === 0) {
      return 1.0;
    }

    // 计算总倍数（所有加成相乘）
    let totalMultiplier = 1.0;
    for (const multiplier of multipliers) {
      // 如果是VIP加成，需要检查用户是否是VIP
      if (multiplier.multiplierType === MultiplierType.VIP) {
        const isVip = await isUserVip(userId);
        if (isVip) {
          totalMultiplier *= multiplier.multiplierValue;
        }
      } else {
        totalMultiplier *= multiplier.multiplierValue;
      }
    }

    return totalMultiplier;
  } catch (error) {
    console.error('Failed to get resource multiplier:', error);
    return 1.0;
  }
}

/**
 * 应用资源加倍
 * @param resourceType 资源类型
 * @param baseAmount 基础数量
 * @returns 加倍后的数量
 */
export async function applyResourceMultiplier(resourceType: RewardType, baseAmount: number): Promise<number> {
  try {
    const multiplier = await getResourceMultiplier(resourceType);
    return Math.floor(baseAmount * multiplier);
  } catch (error) {
    console.error('Failed to apply resource multiplier:', error);
    return baseAmount;
  }
}

/**
 * 添加临时资源加倍
 * @param resourceType 资源类型
 * @param multiplierValue 倍数值
 * @param durationMinutes 持续时间（分钟）
 * @param source 来源
 * @param description 描述
 * @returns 添加的资源加倍记录
 */
export async function addTemporaryMultiplier(
  resourceType: RewardType,
  multiplierValue: number,
  durationMinutes: number,
  source: string,
  description: string
): Promise<ResourceMultiplierRecord> {
  try {
    const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
    const now = new Date();
    const endTime = new Date(now.getTime() + durationMinutes * 60 * 1000);

    const multiplier: ResourceMultiplierRecord = {
      userId,
      multiplierType: MultiplierType.EVENT,
      resourceType,
      multiplierValue,
      startTime: now,
      endTime,
      isActive: true,
      source,
      description,
      createdAt: now,
      updatedAt: now
    };

    // 添加到数据库
    const id = await db.table('resourceMultipliers').add(multiplier);
    return { ...multiplier, id: id as number };
  } catch (error) {
    console.error('Failed to add temporary multiplier:', error);
    throw error;
  }
}

/**
 * 获取所有激活的资源加倍
 * @returns 所有激活的资源加倍记录
 */
export async function getActiveMultipliers(): Promise<ResourceMultiplierRecord[]> {
  try {
    const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
    const now = new Date();

    return db.table('resourceMultipliers')
      .where('userId')
      .equals(userId)
      .and(m => 
        m.isActive === true && 
        (m.endTime === undefined || m.endTime > now)
      )
      .toArray();
  } catch (error) {
    console.error('Failed to get active multipliers:', error);
    return [];
  }
}
