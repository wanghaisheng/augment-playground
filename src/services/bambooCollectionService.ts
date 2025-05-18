// src/services/bambooCollectionService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { RewardType } from './rewardService';
import { applyResourceMultiplier } from './resourceMultiplierService';
import { playSound, SoundType } from '@/utils/sound';
import { updateUserCurrency } from './storeService';
import { initializeBambooCollectionLabels } from '@/data/bambooCollectionLabels';

// 竹子收集记录类型
export interface BambooCollectionRecord {
  id?: number;
  userId: string;
  amount: number;
  source: BambooSource;
  timestamp: Date;
  location?: string;
  multiplier?: number;
  baseAmount?: number;
  isProcessed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 竹子收集源类型
export enum BambooSource {
  TASK = 'task',               // 任务奖励
  DAILY_REWARD = 'daily',      // 每日奖励
  COLLECTION = 'collection',   // 主动收集
  GIFT = 'gift',               // 礼物
  PURCHASE = 'purchase',       // 购买
  CHALLENGE = 'challenge',     // 挑战奖励
  BATTLE_PASS = 'battle_pass', // 通行证奖励
  VIP = 'vip'                  // VIP奖励
}

// 竹子收集点类型
export enum BambooSpotType {
  COMMON = 'common',           // 普通竹子
  GOLDEN = 'golden',           // 金色竹子
  ANCIENT = 'ancient',         // 古老竹子
  MAGICAL = 'magical'          // 魔法竹子
}

// 竹子收集点状态
export enum BambooSpotStatus {
  AVAILABLE = 'available',     // 可收集
  COOLDOWN = 'cooldown',       // 冷却中
  DEPLETED = 'depleted'        // 已耗尽
}

// 竹子收集点记录类型
export interface BambooSpotRecord {
  id?: number;
  type: BambooSpotType;
  baseAmount: number;
  location: string;
  status: BambooSpotStatus;
  cooldownMinutes: number;
  lastCollectedAt: Date | null;
  nextAvailableAt: Date | null;
  totalCollections: number;
  maxCollections: number | null; // null表示无限制
  visualAsset: string;
  createdAt: Date;
  updatedAt: Date;
}

// 默认竹子收集点 - 暂时未使用
/* Commented out to fix TypeScript errors
const DEFAULT_BAMBOO_SPOTS: Omit<BambooSpotRecord, 'id'>[] = [
  {
    type: BambooSpotType.COMMON,
    baseAmount: 10,
    location: 'home_garden',
    status: BambooSpotStatus.AVAILABLE,
    cooldownMinutes: 60, // 1小时
    lastCollectedAt: null,
    nextAvailableAt: null,
    totalCollections: 0,
    maxCollections: null,
    visualAsset: '/assets/bamboo/common_bamboo.svg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: BambooSpotType.COMMON,
    baseAmount: 15,
    location: 'forest_edge',
    status: BambooSpotStatus.AVAILABLE,
    cooldownMinutes: 120, // 2小时
    lastCollectedAt: null,
    nextAvailableAt: null,
    totalCollections: 0,
    maxCollections: null,
    visualAsset: '/assets/bamboo/common_bamboo_cluster.svg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: BambooSpotType.GOLDEN,
    baseAmount: 30,
    location: 'mountain_path',
    status: BambooSpotStatus.AVAILABLE,
    cooldownMinutes: 240, // 4小时
    lastCollectedAt: null,
    nextAvailableAt: null,
    totalCollections: 0,
    maxCollections: 5, // 每天最多收集5次
    visualAsset: '/assets/bamboo/golden_bamboo.svg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: BambooSpotType.ANCIENT,
    baseAmount: 50,
    location: 'sacred_grove',
    status: BambooSpotStatus.AVAILABLE,
    cooldownMinutes: 480, // 8小时
    lastCollectedAt: null,
    nextAvailableAt: null,
    totalCollections: 0,
    maxCollections: 3, // 每天最多收集3次
    visualAsset: '/assets/bamboo/ancient_bamboo.svg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: BambooSpotType.MAGICAL,
    baseAmount: 100,
    location: 'enchanted_valley',
    status: BambooSpotStatus.AVAILABLE,
    cooldownMinutes: 1440, // 24小时
    lastCollectedAt: null,
    nextAvailableAt: null,
    totalCollections: 0,
    maxCollections: 1, // 每天最多收集1次
    visualAsset: '/assets/bamboo/magical_bamboo.svg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
*/

/**
 * 初始化竹子收集系统
 */
export async function initializeBambooCollectionSystem(): Promise<void> {
  try {
    await initializeBambooCollectionLabels();
    console.log('Bamboo collection system initialized, tables ensured by Dexie schema.');
  } catch (error) {
    console.error('Failed to initialize bamboo collection system:', error);
  }
}

/**
 * 获取用户的竹子收集记录
 * @param userId 用户ID
 * @returns 竹子收集记录
 */
export async function getBambooCollection(userId: string): Promise<BambooCollectionRecord[]> {
  return db.bambooCollections.where('userId').equals(userId).toArray();
}

/**
 * 添加竹子到用户收集记录
 * @param userId 用户ID
 * @param amount 数量
 * @param source 来源
 * @param location 可选的收集地点
 * @returns 新的竹子收集记录
 */
export async function addBambooToCollection(
  userId: string,
  amount: number,
  source: BambooSource,
  location?: string
): Promise<BambooCollectionRecord> {
  const now = new Date();
  const record: BambooCollectionRecord = {
    userId,
    amount,
    source,
    timestamp: now,
    location,
    isProcessed: false,
    createdAt: now,
    updatedAt: now
  };
  const id = await db.bambooCollections.add(record);
  const newRecord = { ...record, id: id as number };
  await addSyncItem('bambooCollections', 'create', newRecord);
  return newRecord;
}

/**
 * 收集竹子
 * @param userId 用户ID
 * @param spotId 竹子收集点ID
 * @returns 收集记录
 */
export async function collectBamboo(userId: string, spotId: number): Promise<BambooCollectionRecord> {
  try {
    const spot = await db.bambooSpots.get(spotId);
    if (!spot) {
      throw new Error(`Bamboo spot with id ${spotId} not found`);
    }

    if (spot.status !== BambooSpotStatus.AVAILABLE) {
      throw new Error(`Bamboo spot is not available for collection (status: ${spot.status})`);
    }

    if (spot.maxCollections !== null && spot.totalCollections >= spot.maxCollections) {
      throw new Error(`Maximum collections reached for this bamboo spot`);
    }

    const baseAmount = spot.baseAmount;
    const multipliedAmount = await applyResourceMultiplier(RewardType.COIN, baseAmount);
    const multiplier = multipliedAmount / baseAmount;

    const now = new Date();
    const collection: BambooCollectionRecord = {
      userId,
      amount: multipliedAmount,
      source: BambooSource.COLLECTION,
      timestamp: now,
      location: spot.location,
      multiplier,
      baseAmount,
      isProcessed: false,
      createdAt: now,
      updatedAt: now
    };

    const id = await db.bambooCollections.add(collection);
    const newCollection = { ...collection, id: id as number };

    await addSyncItem('bambooCollections', 'create', newCollection);

    const nextAvailableAt = new Date(now.getTime() + spot.cooldownMinutes * 60 * 1000);
    const updatedSpot = {
      ...spot,
      status: BambooSpotStatus.COOLDOWN,
      lastCollectedAt: now,
      nextAvailableAt,
      totalCollections: spot.totalCollections + 1,
      updatedAt: now
    };

    await db.bambooSpots.update(spotId, updatedSpot);
    await addSyncItem('bambooSpots', 'update', updatedSpot);

    await updateUserCurrency(userId, multipliedAmount, 0);
    playSound(SoundType.BAMBOO_COLLECT, 0.5);

    return newCollection;
  } catch (error) {
    console.error('Failed to collect bamboo:', error);
    throw error;
  }
}

/**
 * 获取所有竹子收集点
 * @returns 竹子收集点列表
 */
export async function getAllBambooSpots(): Promise<BambooSpotRecord[]> {
  try {
    const spots = await db.bambooSpots.toArray();

    const now = new Date();
    const updatedSpots = spots.map(spot => {
      if (spot.status === BambooSpotStatus.COOLDOWN && spot.nextAvailableAt && spot.nextAvailableAt < now) {
        return {
          ...spot,
          status: BambooSpotStatus.AVAILABLE,
          updatedAt: now
        };
      }
      return spot;
    });

    for (const spot of updatedSpots) {
      const originalSpot = spots.find(s => s.id === spot.id);
      if (originalSpot && spot.updatedAt > originalSpot.updatedAt) {
        await db.bambooSpots.update(spot.id!, spot);
        await addSyncItem('bambooSpots', 'update', spot);
      }
    }
    return updatedSpots;
  } catch (error) {
    console.error('Failed to get bamboo spots:', error);
    return [];
  }
}

/**
 * 获取可用的竹子收集点
 * @returns 可用的竹子收集点列表
 */
export async function getAvailableBambooSpots(): Promise<BambooSpotRecord[]> {
  const spots = await getAllBambooSpots();
  return spots.filter(spot => spot.status === BambooSpotStatus.AVAILABLE);
}

/**
 * 获取竹子收集历史
 * @param userId 用户ID
 * @param limit 限制数量
 * @param offset 偏移量
 * @returns 竹子收集记录列表
 */
export async function getBambooCollectionHistory(
  userId: string,
  limit: number = 10,
  offset: number = 0
): Promise<BambooCollectionRecord[]> {
  return db.bambooCollections
    .where('userId')
    .equals(userId)
    .reverse()
    .offset(offset)
    .limit(limit)
    .toArray();
}

/**
 * 获取竹子收集统计
 * @param userId 用户ID
 * @returns 竹子收集统计
 */
export async function getBambooCollectionStats(
  userId: string
): Promise<{ total: number; today: number; bySource: Record<BambooSource, number> }> {
  try {
    const collections = await db.bambooCollections
      .where('userId')
      .equals(userId)
      .toArray();

    const total = collections.reduce((sum, record) => sum + record.amount, 0);

    const todayString = new Date().toISOString().split('T')[0];
    const todayCollections = collections.filter(record =>
      record.timestamp.toISOString().split('T')[0] === todayString
    );
    const todayTotal = todayCollections.reduce((sum, record) => sum + record.amount, 0);

    const bySource: Record<BambooSource, number> = {
      [BambooSource.TASK]: 0,
      [BambooSource.DAILY_REWARD]: 0,
      [BambooSource.COLLECTION]: 0,
      [BambooSource.GIFT]: 0,
      [BambooSource.PURCHASE]: 0,
      [BambooSource.CHALLENGE]: 0,
      [BambooSource.BATTLE_PASS]: 0,
      [BambooSource.VIP]: 0
    };

    for (const record of collections) {
      if (record.source in bySource) {
        bySource[record.source] += record.amount;
      } else {
        // console.warn(`Unknown BambooSource: ${record.source}`);
      }
    }

    return { total, today: todayTotal, bySource };
  } catch (error) {
    console.error('Failed to get bamboo collection stats:', error);
    return {
      total: 0,
      today: 0,
      bySource: {
        [BambooSource.TASK]: 0,
        [BambooSource.DAILY_REWARD]: 0,
        [BambooSource.COLLECTION]: 0,
        [BambooSource.GIFT]: 0,
        [BambooSource.PURCHASE]: 0,
        [BambooSource.CHALLENGE]: 0,
        [BambooSource.BATTLE_PASS]: 0,
        [BambooSource.VIP]: 0
      }
    };
  }
}
