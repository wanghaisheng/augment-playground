// src/services/timelyRewardService.ts
import { db } from '@/db';
import { addSyncItem } from './dataSyncService';
import { generateRewards, RewardRecord, RewardRarity } from './rewardService';
import { TaskRecord, TaskStatus } from './taskService';

// 及时奖励状态枚举
export enum TimelyRewardStatus {
  ACTIVE = 'active',         // 活跃中
  COMPLETED = 'completed',   // 已完成
  EXPIRED = 'expired',       // 已过期
  UPCOMING = 'upcoming'      // 即将开始
}

// 及时奖励类型枚举
export enum TimelyRewardType {
  DAILY = 'daily',           // 每日奖励
  MORNING = 'morning',       // 早起鸟奖励
  STREAK = 'streak',         // 连续完成奖励
  SPECIAL = 'special'        // 特殊奖励
}

// 及时奖励记录类型
export interface TimelyRewardRecord {
  id?: number;               // 奖励ID
  title: string;             // 奖励标题
  description: string;       // 奖励描述
  type: TimelyRewardType;    // 奖励类型
  status: TimelyRewardStatus; // 奖励状态
  progress: number;          // 进度（0-100）
  startTime: Date;           // 开始时间
  endTime: Date;             // 结束时间
  completedTime?: Date;      // 完成时间
  luckyPoints: number;       // 幸运点数
  taskIds?: number[];        // 关联的任务ID列表
  rewardIds?: number[];      // 奖励ID列表
  iconPath: string;          // 图标路径
  createdAt: Date;           // 创建时间
  updatedAt: Date;           // 更新时间
}

// 幸运点记录类型
export interface LuckyPointRecord {
  id?: number;               // 记录ID
  userId: string;            // 用户ID
  amount: number;            // 点数数量
  source: string;            // 来源
  timestamp: Date;           // 时间戳
  expiryDate?: Date;         // 过期日期
  isSpent: boolean;          // 是否已使用
  createdAt: Date;           // 创建时间
}

// 幸运抽奖记录类型
export interface LuckyDrawRecord {
  id?: number;               // 记录ID
  userId: string;            // 用户ID
  pointsSpent: number;       // 使用的点数
  rewards: RewardRecord[];   // 获得的奖励
  timestamp: Date;           // 时间戳
  createdAt: Date;           // 创建时间
}

// 奖品层级
export enum PrizeLevel {
  COMMON = 'common',         // 普通
  UNCOMMON = 'uncommon',     // 不常见
  RARE = 'rare',             // 稀有
  EPIC = 'epic',             // 史诗
  LEGENDARY = 'legendary'    // 传说
}

// 奖品层级概率配置
const PRIZE_LEVEL_PROBABILITIES = {
  [PrizeLevel.COMMON]: 0.6,      // 60%
  [PrizeLevel.UNCOMMON]: 0.25,   // 25%
  [PrizeLevel.RARE]: 0.1,        // 10%
  [PrizeLevel.EPIC]: 0.04,       // 4%
  [PrizeLevel.LEGENDARY]: 0.01   // 1%
};

// 奖品层级对应的奖励稀有度
const PRIZE_LEVEL_TO_RARITY: Record<PrizeLevel, string> = {
  [PrizeLevel.COMMON]: 'common',
  [PrizeLevel.UNCOMMON]: 'uncommon',
  [PrizeLevel.RARE]: 'rare',
  [PrizeLevel.EPIC]: 'epic',
  [PrizeLevel.LEGENDARY]: 'legendary'
};

/**
 * 初始化及时奖励系统
 */
export async function initializeTimelyRewards(): Promise<void> {
  // 检查是否已有及时奖励
  const count = await db.table('timelyRewards').count();

  if (count === 0) {
    // 创建默认的及时奖励
    await createDailyTimelyReward();
    await createMorningTimelyReward();
  }
}

/**
 * 创建每日及时奖励
 */
async function createDailyTimelyReward(): Promise<TimelyRewardRecord> {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(9, 0, 0, 0); // 每天9点开始

  const endTime = new Date(now);
  endTime.setHours(21, 0, 0, 0); // 每天21点结束

  // 如果当前时间已经超过今天的结束时间，则设置为明天
  if (now > endTime) {
    startTime.setDate(startTime.getDate() + 1);
    endTime.setDate(endTime.getDate() + 1);
  }

  const dailyReward: TimelyRewardRecord = {
    title: '每日及时完成',
    description: '在规定时间内完成任务，获得额外奖励',
    type: TimelyRewardType.DAILY,
    status: TimelyRewardStatus.ACTIVE,
    progress: 0,
    startTime,
    endTime,
    luckyPoints: 10,
    iconPath: '/assets/rewards/daily-reward.svg',
    createdAt: now,
    updatedAt: now
  };

  const id = await db.table('timelyRewards').add(dailyReward);
  const newReward = { ...dailyReward, id: id as number };

  // 添加到同步队列
  await addSyncItem('timelyRewards', 'create', newReward);

  return newReward;
}

/**
 * 创建早起鸟及时奖励
 */
async function createMorningTimelyReward(): Promise<TimelyRewardRecord> {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(5, 0, 0, 0); // 每天5点开始

  const endTime = new Date(now);
  endTime.setHours(9, 0, 0, 0); // 每天9点结束

  // 如果当前时间已经超过今天的结束时间，则设置为明天
  if (now > endTime) {
    startTime.setDate(startTime.getDate() + 1);
    endTime.setDate(endTime.getDate() + 1);
  }

  const morningReward: TimelyRewardRecord = {
    title: '早起鸟奖励',
    description: '早起完成任务，获得额外奖励',
    type: TimelyRewardType.MORNING,
    status: TimelyRewardStatus.ACTIVE,
    progress: 0,
    startTime,
    endTime,
    luckyPoints: 15,
    iconPath: '/assets/rewards/morning-reward.svg',
    createdAt: now,
    updatedAt: now
  };

  const id = await db.table('timelyRewards').add(morningReward);
  const newReward = { ...morningReward, id: id as number };

  // 添加到同步队列
  await addSyncItem('timelyRewards', 'create', newReward);

  return newReward;
}

/**
 * 获取所有及时奖励
 * @param filter 过滤条件
 */
export async function getAllTimelyRewards(filter?: {
  status?: TimelyRewardStatus;
  type?: TimelyRewardType;
}): Promise<TimelyRewardRecord[]> {
  let collection = db.table('timelyRewards').toCollection();

  if (filter) {
    if (filter.status) {
      collection = collection.filter(reward => reward.status === filter.status);
    }
    if (filter.type) {
      collection = collection.filter(reward => reward.type === filter.type);
    }
  }

  return collection.toArray();
}

/**
 * 获取单个及时奖励
 * @param id 奖励ID
 */
export async function getTimelyReward(id: number): Promise<TimelyRewardRecord | undefined> {
  return db.table('timelyRewards').get(id);
}

/**
 * 更新及时奖励进度
 * @param id 奖励ID
 * @param progress 进度值（0-100）
 */
export async function updateTimelyRewardProgress(id: number, progress: number): Promise<TimelyRewardRecord> {
  const reward = await db.table('timelyRewards').get(id);

  if (!reward) {
    throw new Error(`Timely reward with id ${id} not found`);
  }

  // 确保进度在0-100范围内
  const validProgress = Math.max(0, Math.min(100, progress));

  // 如果进度达到100%，将状态更新为已完成
  let status = reward.status;
  let completedTime = reward.completedTime;

  if (validProgress >= 100 && status !== TimelyRewardStatus.COMPLETED) {
    status = TimelyRewardStatus.COMPLETED;
    completedTime = new Date();
  }

  const updatedReward = {
    ...reward,
    progress: validProgress,
    status,
    completedTime,
    updatedAt: new Date()
  };

  await db.table('timelyRewards').update(id, updatedReward);

  // 添加到同步队列
  await addSyncItem('timelyRewards', 'update', updatedReward);

  return updatedReward;
}

/**
 * 完成及时奖励
 * @param id 奖励ID
 */
export async function completeTimelyReward(id: number): Promise<RewardRecord[]> {
  const reward = await db.table('timelyRewards').get(id);

  if (!reward) {
    throw new Error(`Timely reward with id ${id} not found`);
  }

  if (reward.status === TimelyRewardStatus.COMPLETED) {
    throw new Error(`Timely reward with id ${id} is already completed`);
  }

  // 检查是否在有效时间范围内
  const now = new Date();
  if (now < reward.startTime || now > reward.endTime) {
    throw new Error(`Timely reward with id ${id} is not active`);
  }

  // 更新奖励状态
  const updatedReward = {
    ...reward,
    status: TimelyRewardStatus.COMPLETED,
    progress: 100,
    completedTime: now,
    updatedAt: now
  };

  await db.table('timelyRewards').update(id, updatedReward);

  // 生成奖励
  const rewards = await generateRewards(2, 'uncommon' as RewardRarity);

  // 添加幸运点
  await addLuckyPoints(reward.luckyPoints, `完成及时奖励: ${reward.title}`);

  // 添加到同步队列
  await addSyncItem('timelyRewards', 'update', updatedReward);

  return rewards;
}

/**
 * 添加幸运点
 * @param amount 点数数量
 * @param source 来源
 */
export async function addLuckyPoints(amount: number, source: string): Promise<LuckyPointRecord> {
  const now = new Date();

  // 设置过期日期为30天后
  const expiryDate = new Date(now);
  expiryDate.setDate(expiryDate.getDate() + 30);

  const luckyPoint: LuckyPointRecord = {
    userId: 'current-user', // 在实际应用中，这应该是当前用户的ID
    amount,
    source,
    timestamp: now,
    expiryDate,
    isSpent: false,
    createdAt: now
  };

  const id = await db.table('luckyPoints').add(luckyPoint);
  const newLuckyPoint = { ...luckyPoint, id: id as number };

  // 添加到同步队列
  await addSyncItem('luckyPoints', 'create', newLuckyPoint);

  return newLuckyPoint;
}

/**
 * 获取用户的幸运点总数
 */
export async function getLuckyPointsTotal(): Promise<number> {
  const points = await db.table('luckyPoints')
    .where('userId')
    .equals('current-user')
    .and(point => !point.isSpent)
    .and(point => !point.expiryDate || point.expiryDate > new Date())
    .toArray();

  return points.reduce((total, point) => total + point.amount, 0);
}

/**
 * 进行幸运抽奖
 * @param pointsToSpend 要使用的点数
 */
export async function performLuckyDraw(pointsToSpend: number): Promise<LuckyDrawRecord> {
  // 检查用户是否有足够的点数
  const totalPoints = await getLuckyPointsTotal();
  if (totalPoints < pointsToSpend) {
    throw new Error(`Not enough lucky points. Required: ${pointsToSpend}, Available: ${totalPoints}`);
  }

  // 确定奖品层级
  const prizeLevel = determinePrizeLevel();

  // 生成奖励
  const rarityString = PRIZE_LEVEL_TO_RARITY[prizeLevel];
  const rarity = rarityString as RewardRarity;
  const rewards = await generateRewards(1, rarity);

  // 使用幸运点
  await spendLuckyPoints(pointsToSpend);

  const now = new Date();
  const luckyDraw: LuckyDrawRecord = {
    userId: 'current-user',
    pointsSpent: pointsToSpend,
    rewards,
    timestamp: now,
    createdAt: now
  };

  const id = await db.table('luckyDraws').add(luckyDraw);
  const newLuckyDraw = { ...luckyDraw, id: id as number };

  // 添加到同步队列
  await addSyncItem('luckyDraws', 'create', newLuckyDraw);

  return newLuckyDraw;
}

/**
 * 使用幸运点
 * @param amount 要使用的点数数量
 */
async function spendLuckyPoints(amount: number): Promise<void> {
  // 获取未使用的幸运点
  const points = await db.table('luckyPoints')
    .where('userId')
    .equals('current-user')
    .and(point => !point.isSpent)
    .and(point => !point.expiryDate || point.expiryDate > new Date())
    .sortBy('expiryDate'); // 先使用快过期的点数

  let remainingAmount = amount;

  for (const point of points) {
    if (remainingAmount <= 0) break;

    if (point.amount <= remainingAmount) {
      // 如果当前点数记录小于等于剩余需要使用的点数，则全部使用
      await db.table('luckyPoints').update(point.id!, { isSpent: true });
      await addSyncItem('luckyPoints', 'update', { ...point, isSpent: true });
      remainingAmount -= point.amount;
    } else {
      // 如果当前点数记录大于剩余需要使用的点数，则拆分记录
      await db.table('luckyPoints').update(point.id!, { amount: point.amount - remainingAmount });
      await addSyncItem('luckyPoints', 'update', { ...point, amount: point.amount - remainingAmount });

      // 创建一个新的已使用记录
      const spentPoint: LuckyPointRecord = {
        userId: point.userId,
        amount: remainingAmount,
        source: point.source,
        timestamp: point.timestamp,
        expiryDate: point.expiryDate,
        isSpent: true,
        createdAt: new Date()
      };

      await db.table('luckyPoints').add(spentPoint);
      await addSyncItem('luckyPoints', 'create', spentPoint);

      remainingAmount = 0;
    }
  }

  if (remainingAmount > 0) {
    throw new Error(`Not enough lucky points. Required: ${amount}, Used: ${amount - remainingAmount}`);
  }
}

/**
 * 确定奖品层级
 */
function determinePrizeLevel(): PrizeLevel {
  const random = Math.random();
  let cumulativeProbability = 0;

  for (const [level, probability] of Object.entries(PRIZE_LEVEL_PROBABILITIES)) {
    cumulativeProbability += probability;
    if (random <= cumulativeProbability) {
      return level as PrizeLevel;
    }
  }

  return PrizeLevel.COMMON; // 默认返回普通层级
}

/**
 * 检查任务是否在及时奖励时间窗口内
 * @param task 任务
 */
export async function checkTaskForTimelyReward(task: TaskRecord): Promise<TimelyRewardRecord | null> {
  if (task.status !== TaskStatus.COMPLETED) {
    return null;
  }

  const now = new Date();

  // 获取活跃的及时奖励
  const activeRewards = await db.table('timelyRewards')
    .where('status')
    .equals(TimelyRewardStatus.ACTIVE)
    .toArray();

  // 检查任务是否在任何及时奖励的时间窗口内
  for (const reward of activeRewards) {
    if (now >= reward.startTime && now <= reward.endTime) {
      // 更新及时奖励进度
      const updatedReward = await updateTimelyRewardProgress(
        reward.id!,
        reward.progress + 20 // 每完成一个任务增加20%的进度
      );

      return updatedReward;
    }
  }

  return null;
}

/**
 * 更新及时奖励状态
 * 检查所有及时奖励，更新它们的状态（过期、即将开始等）
 */
export async function updateTimelyRewardsStatus(): Promise<void> {
  const now = new Date();

  // 获取所有及时奖励
  const rewards = await db.table('timelyRewards').toArray();

  for (const reward of rewards) {
    let newStatus = reward.status;

    // 如果已经完成，则跳过
    if (reward.status === TimelyRewardStatus.COMPLETED) {
      continue;
    }

    // 检查是否过期
    if (now > reward.endTime) {
      newStatus = TimelyRewardStatus.EXPIRED;
    }
    // 检查是否活跃
    else if (now >= reward.startTime && now <= reward.endTime) {
      newStatus = TimelyRewardStatus.ACTIVE;
    }
    // 检查是否即将开始
    else if (now < reward.startTime) {
      newStatus = TimelyRewardStatus.UPCOMING;
    }

    // 如果状态有变化，则更新
    if (newStatus !== reward.status) {
      const updatedReward = {
        ...reward,
        status: newStatus,
        updatedAt: now
      };

      await db.table('timelyRewards').update(reward.id!, updatedReward);
      await addSyncItem('timelyRewards', 'update', updatedReward);
    }
  }
}
