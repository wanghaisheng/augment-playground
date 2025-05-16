// src/services/growthBoostService.ts
import { db } from '@/db-old';
import { isUserVip } from './storeService';
import { MultiplierType } from './resourceMultiplierService';

/**
 * 成长速度加成记录
 */
export interface GrowthBoostRecord {
  id?: number;
  userId: string;
  boostType: MultiplierType;
  boostValue: number;     // 加成值，如1.5表示50%加成
  startTime: Date;         // 开始时间
  endTime?: Date;          // 结束时间，如果为空则表示永久有效
  isActive: boolean;       // 是否激活
  source: string;          // 来源，如"VIP特权"、"活动加成"等
  description: string;     // 描述
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 初始化成长速度加成表
 */
export async function initializeGrowthBoosts(): Promise<void> {
  try {
    // 检查是否已经初始化
    const boosts = await db.table('growthBoosts').toArray();
    if (boosts.length > 0) {
      return;
    }

    // 初始化VIP成长速度加成
    const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
    const now = new Date();

    // VIP成长速度加成
    const vipGrowthBoost: GrowthBoostRecord = {
      userId,
      boostType: MultiplierType.VIP,
      boostValue: 1.5,
      startTime: now,
      isActive: true,
      source: 'VIP特权',
      description: 'VIP会员获得50%成长速度加成',
      createdAt: now,
      updatedAt: now
    };

    // 添加到数据库
    await db.table('growthBoosts').add(vipGrowthBoost);

    console.log('Growth boosts initialized');
  } catch (error) {
    console.error('Failed to initialize growth boosts:', error);
  }
}

/**
 * 获取成长速度加成倍数
 * @returns 成长速度加成倍数，如果没有加成则返回1.0
 */
export async function getGrowthBoostMultiplier(): Promise<number> {
  try {
    const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
    const now = new Date();

    // 获取所有激活的成长速度加成
    const boosts = await db.table('growthBoosts')
      .where('userId')
      .equals(userId)
      .and(b => 
        b.isActive === true && 
        (b.endTime === undefined || b.endTime > now)
      )
      .toArray();

    // 如果没有加成，返回1.0
    if (boosts.length === 0) {
      return 1.0;
    }

    // 计算总加成（所有加成相乘）
    let totalBoost = 1.0;
    for (const boost of boosts) {
      // 如果是VIP加成，需要检查用户是否是VIP
      if (boost.boostType === MultiplierType.VIP) {
        const isVip = await isUserVip(userId);
        if (isVip) {
          totalBoost *= boost.boostValue;
        }
      } else {
        totalBoost *= boost.boostValue;
      }
    }

    return totalBoost;
  } catch (error) {
    console.error('Failed to get growth boost multiplier:', error);
    return 1.0;
  }
}

/**
 * 应用成长速度加成
 * @param baseExperience 基础经验值
 * @returns 加成后的经验值
 */
export async function applyGrowthBoost(baseExperience: number): Promise<number> {
  try {
    const multiplier = await getGrowthBoostMultiplier();
    return Math.floor(baseExperience * multiplier);
  } catch (error) {
    console.error('Failed to apply growth boost:', error);
    return baseExperience;
  }
}

/**
 * 添加临时成长速度加成
 * @param boostValue 加成值
 * @param durationMinutes 持续时间（分钟）
 * @param source 来源
 * @param description 描述
 * @returns 添加的成长速度加成记录
 */
export async function addTemporaryGrowthBoost(
  boostValue: number,
  durationMinutes: number,
  source: string,
  description: string
): Promise<GrowthBoostRecord> {
  try {
    const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
    const now = new Date();
    const endTime = new Date(now.getTime() + durationMinutes * 60 * 1000);

    const boost: GrowthBoostRecord = {
      userId,
      boostType: MultiplierType.EVENT,
      boostValue,
      startTime: now,
      endTime,
      isActive: true,
      source,
      description,
      createdAt: now,
      updatedAt: now
    };

    // 添加到数据库
    const id = await db.table('growthBoosts').add(boost);
    return { ...boost, id: id as number };
  } catch (error) {
    console.error('Failed to add temporary growth boost:', error);
    throw error;
  }
}

/**
 * 获取所有激活的成长速度加成
 * @returns 所有激活的成长速度加成记录
 */
export async function getActiveGrowthBoosts(): Promise<GrowthBoostRecord[]> {
  try {
    const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
    const now = new Date();

    return db.table('growthBoosts')
      .where('userId')
      .equals(userId)
      .and(b => 
        b.isActive === true && 
        (b.endTime === undefined || b.endTime > now)
      )
      .toArray();
  } catch (error) {
    console.error('Failed to get active growth boosts:', error);
    return [];
  }
}
