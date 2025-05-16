// src/services/luckyDrawLimitService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { isUserVip } from './storeService';

// 抽奖次数限制记录类型
export interface LuckyDrawLimitRecord {
  id?: number;
  userId: string;
  date: string; // 日期字符串，格式为 YYYY-MM-DD
  drawCount: number; // 已使用的抽奖次数
  createdAt: Date;
  updatedAt: Date;
}

// 默认每日抽奖次数限制
const DEFAULT_DAILY_DRAW_LIMIT = 3;

// VIP每日抽奖次数限制
const VIP_DAILY_DRAW_LIMIT = {
  1: 5,  // 基础VIP: 5次
  2: 7,  // 高级VIP: 7次
  3: 10  // 豪华VIP: 10次
};

/**
 * 初始化抽奖次数限制表
 */
export async function initializeLuckyDrawLimits(): Promise<void> {
  try {
    // 检查表是否存在 - This should be defined in db.ts
    // if (!(await db.tableExists('luckyDrawLimits'))) {
    //   await db.createTable('luckyDrawLimits');
    // }
    console.log('Lucky draw limits table initialized');
  } catch (error) {
    console.error('Failed to initialize lucky draw limits table:', error);
  }
}

/**
 * 获取今天的日期字符串，格式为 YYYY-MM-DD
 */
function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * 获取用户今天的抽奖次数限制记录
 * @param userId 用户ID
 */
async function getUserTodayLimitRecord(userId: string): Promise<LuckyDrawLimitRecord | null> {
  const today = getTodayDateString();
  const record = await db.luckyDrawLimits
    .where('userId')
    .equals(userId)
    .and(record => record.date === today)
    .first();
  return record === undefined ? null : record;
}

/**
 * 创建用户今天的抽奖次数限制记录
 * @param userId 用户ID
 */
async function createUserTodayLimitRecord(userId: string): Promise<LuckyDrawLimitRecord> {
  const today = getTodayDateString();
  const now = new Date();
  
  const record: LuckyDrawLimitRecord = {
    userId,
    date: today,
    drawCount: 0,
    createdAt: now,
    updatedAt: now
  };
  
  const id = await db.table('luckyDrawLimits').add(record);
  const newRecord = { ...record, id: id as number };
  
  // 添加到同步队列
  await addSyncItem('luckyDrawLimits', 'create', newRecord);
  
  return newRecord;
}

/**
 * 获取用户的VIP等级
 * @param userId 用户ID
 */
async function getUserVipTier(userId: string): Promise<number> {
  try {
    // 检查用户是否是VIP
    const isVip = await isUserVip(userId);
    if (!isVip) {
      return 0; // 非VIP用户
    }
    
    // 获取用户的VIP订阅
    const subscription = await db.table('vipSubscriptions')
      .where('userId')
      .equals(userId)
      .and(sub => sub.isActive)
      .first();
    
    return subscription ? subscription.tier : 0;
  } catch (error) {
    console.error('Failed to get user VIP tier:', error);
    return 0;
  }
}

/**
 * 获取用户的每日抽奖次数限制
 * @param userId 用户ID
 */
export async function getUserDailyDrawLimit(userId: string): Promise<number> {
  try {
    // 获取用户的VIP等级
    const vipTier = await getUserVipTier(userId);
    
    // 根据VIP等级返回对应的限制
    if (vipTier > 0) {
      return VIP_DAILY_DRAW_LIMIT[vipTier as keyof typeof VIP_DAILY_DRAW_LIMIT] || DEFAULT_DAILY_DRAW_LIMIT;
    }
    
    return DEFAULT_DAILY_DRAW_LIMIT;
  } catch (error) {
    console.error('Failed to get user daily draw limit:', error);
    return DEFAULT_DAILY_DRAW_LIMIT;
  }
}

/**
 * 获取用户今天已使用的抽奖次数
 * @param userId 用户ID
 */
export async function getUserTodayDrawCount(userId: string): Promise<number> {
  try {
    // 获取用户今天的抽奖次数限制记录
    const record = await getUserTodayLimitRecord(userId);
    
    // 如果记录不存在，返回0
    if (!record) {
      return 0;
    }
    
    return record.drawCount;
  } catch (error) {
    console.error('Failed to get user today draw count:', error);
    return 0;
  }
}

/**
 * 获取用户今天剩余的抽奖次数
 * @param userId 用户ID
 */
export async function getUserTodayRemainingDraws(userId: string): Promise<number> {
  try {
    // 获取用户的每日抽奖次数限制
    const limit = await getUserDailyDrawLimit(userId);
    
    // 获取用户今天已使用的抽奖次数
    const used = await getUserTodayDrawCount(userId);
    
    // 计算剩余次数
    return Math.max(0, limit - used);
  } catch (error) {
    console.error('Failed to get user today remaining draws:', error);
    return 0;
  }
}

/**
 * 检查用户今天是否还有抽奖次数
 * @param userId 用户ID
 */
export async function canUserDrawToday(userId: string): Promise<boolean> {
  try {
    // 获取用户今天剩余的抽奖次数
    const remaining = await getUserTodayRemainingDraws(userId);
    
    return remaining > 0;
  } catch (error) {
    console.error('Failed to check if user can draw today:', error);
    return false;
  }
}

/**
 * 增加用户今天的抽奖次数
 * @param userId 用户ID
 */
export async function incrementUserTodayDrawCount(userId: string): Promise<void> {
  try {
    // 获取用户今天的抽奖次数限制记录
    let record = await getUserTodayLimitRecord(userId);
    
    // 如果记录不存在，创建一个新记录
    if (!record) {
      record = await createUserTodayLimitRecord(userId);
    }
    
    // 增加抽奖次数
    const updatedRecord = {
      ...record,
      drawCount: record.drawCount + 1,
      updatedAt: new Date()
    };
    
    // 更新数据库
    await db.table('luckyDrawLimits').update(record.id!, updatedRecord);
    
    // 添加到同步队列
    await addSyncItem('luckyDrawLimits', 'update', updatedRecord);
  } catch (error) {
    console.error('Failed to increment user today draw count:', error);
  }
}

/**
 * 重置用户今天的抽奖次数
 * @param userId 用户ID
 */
export async function resetUserTodayDrawCount(userId: string): Promise<void> {
  try {
    // 获取用户今天的抽奖次数限制记录
    const record = await getUserTodayLimitRecord(userId);
    
    // 如果记录不存在，不需要重置
    if (!record) {
      return;
    }
    
    // 重置抽奖次数
    const updatedRecord = {
      ...record,
      drawCount: 0,
      updatedAt: new Date()
    };
    
    // 更新数据库
    await db.table('luckyDrawLimits').update(record.id!, updatedRecord);
    
    // 添加到同步队列
    await addSyncItem('luckyDrawLimits', 'update', updatedRecord);
  } catch (error) {
    console.error('Failed to reset user today draw count:', error);
  }
}

/**
 * 获取VIP每日抽奖次数限制
 */
export function getVipDailyDrawLimits(): typeof VIP_DAILY_DRAW_LIMIT {
  return { ...VIP_DAILY_DRAW_LIMIT };
}

/**
 * 获取默认每日抽奖次数限制
 */
export function getDefaultDailyDrawLimit(): number {
  return DEFAULT_DAILY_DRAW_LIMIT;
}

export async function getRemainingDraws(userId: string): Promise<number> {
  try {
    // Ensure the table exists - This should be defined in db.ts
    // if (!(await db.tableExists('luckyDrawLimits'))) {
    //   await db.createTable('luckyDrawLimits');
    //   // Initialize if created for the first time
    //   await db.table('luckyDrawLimits').add({
    //     userId,
    //     dailyDraws: 0,
    //     weeklyDraws: 0,
    //     lastDailyReset: new Date(),
    //     lastWeeklyReset: new Date(),
    //   });
    // }

    const limitRecord = await getOrCreateLimitRecord(userId);
    // Assuming limitRecord now is guaranteed to be a LuckyDrawLimitRecord
    const dailyLimit = await getUserDailyDrawLimit(userId); // existing function in this file
    const usedToday = limitRecord.drawCount;
    return Math.max(0, dailyLimit - usedToday);
  } catch (error) {
    console.error('Failed to get remaining draws:', error);
    return 0;
  }
}

export async function recordDraw(userId: string): Promise<LuckyDrawLimitRecord | null> {
  try {
    // Ensure the table exists - This should be defined in db.ts
    // if (!(await db.tableExists('luckyDrawLimits'))) {
    //   await db.createTable('luckyDrawLimits');
    // }
    const limitRecord = await getOrCreateLimitRecord(userId);
    
    // Check if user can draw
    const dailyLimit = await getUserDailyDrawLimit(userId);
    if (limitRecord.drawCount >= dailyLimit) {
      console.warn('User has reached their daily draw limit.');
      // Optionally throw an error or return a specific status
      return null; // Or return the current record without modification
    }

    const updatedRecord = {
        ...limitRecord,
        drawCount: limitRecord.drawCount + 1,
        updatedAt: new Date()
    };
    await db.table('luckyDrawLimits').update(limitRecord.id!, updatedRecord);
    await addSyncItem('luckyDrawLimits', 'update', updatedRecord);
    return updatedRecord;
  } catch (error) {
    console.error('Failed to record draw:', error);
    return null;
  }
}

async function getOrCreateLimitRecord(userId: string): Promise<LuckyDrawLimitRecord> {
  // Ensure the table exists - This should be defined in db.ts
  // if (!(await db.tableExists('luckyDrawLimits'))) {
  //   await db.createTable('luckyDrawLimits');
  // }
  let limitRecord = await db.table('luckyDrawLimits')
    .where({ userId: userId, date: getTodayDateString() }) // More specific query
    .first();

  if (!limitRecord) {
    const today = getTodayDateString(); 
    const now = new Date();
    const newRecordData: Omit<LuckyDrawLimitRecord, 'id'> = { 
      userId,
      date: today, 
      drawCount: 0,
      createdAt: now,
      updatedAt: now
    };
    const id = await db.table('luckyDrawLimits').add(newRecordData);
    limitRecord = { ...newRecordData, id: id as number }; 
    await addSyncItem('luckyDrawLimits', 'create', limitRecord); 
  }
  return limitRecord; 
}
