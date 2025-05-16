// src/services/vipTrialService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { getUserMilestones, MilestoneType } from './milestoneService';
import { isUserVip, activateVipTrial } from './storeService';

/**
 * VIP试用状态
 */
export enum VipTrialStatus {
  NOT_STARTED = 'not_started',   // 未开始
  ACTIVE = 'active',             // 活跃中
  COMPLETED = 'completed',       // 已完成
  CONVERTED = 'converted',       // 已转化为付费
  EXPIRED = 'expired'            // 已过期
}

/**
 * VIP试用记录
 */
export interface VipTrialRecord {
  id?: number;
  userId: string;
  status: VipTrialStatus;
  startDate?: Date;
  endDate?: Date;
  triggerMilestoneId?: number;
  hasShownGuide: boolean;
  hasShownValueReview: boolean;
  hasShownExpirationReminder: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 检查用户是否有资格获得VIP试用
 * @param userId 用户ID
 * @returns 是否有资格
 */
export async function checkVipTrialEligibility(userId: string): Promise<boolean> {
  try {
    // 检查用户是否已经是VIP
    const isVip = await isUserVip(userId);
    if (isVip) {
      return false;
    }
    
    // 检查用户是否已经有过VIP试用
    const existingTrial = await db.table('vipTrials')
      .where('userId')
      .equals(userId)
      .first();
    
    if (existingTrial) {
      return false;
    }
    
    // 检查用户是否达到了触发里程碑
    // 例如，完成了10个任务或者使用应用超过7天
    const userMilestones = await getUserMilestones(userId);
    
    // 检查是否完成了至少一个重要里程碑
    const importantMilestones = userMilestones.filter(milestone => 
      milestone.type === MilestoneType.TASK_COMPLETION_COUNT ||
      milestone.type === MilestoneType.APP_USAGE_DAYS ||
      milestone.type === MilestoneType.STREAK_DAYS
    );
    
    const completedImportantMilestones = importantMilestones.filter(milestone => 
      milestone.isCompleted
    );
    
    return completedImportantMilestones.length > 0;
  } catch (error) {
    console.error('Failed to check VIP trial eligibility:', error);
    return false;
  }
}

/**
 * 创建VIP试用记录
 * @param userId 用户ID
 * @param triggerMilestoneId 触发里程碑ID
 * @returns 创建的VIP试用记录
 */
export async function createVipTrial(
  userId: string,
  triggerMilestoneId?: number
): Promise<VipTrialRecord> {
  try {
    // 检查用户是否已经有过VIP试用
    const existingTrial = await db.table('vipTrials')
      .where('userId')
      .equals(userId)
      .first();
    
    if (existingTrial) {
      throw new Error('User already has a VIP trial record');
    }
    
    // 创建试用记录
    const now = new Date();
    const trialDays = 7; // 7天试用期
    
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + trialDays);
    
    const trialRecord: VipTrialRecord = {
      userId,
      status: VipTrialStatus.ACTIVE,
      startDate: now,
      endDate,
      triggerMilestoneId,
      hasShownGuide: false,
      hasShownValueReview: false,
      hasShownExpirationReminder: false,
      createdAt: now,
      updatedAt: now
    };
    
    // 添加到数据库
    const id = await db.table('vipTrials').add(trialRecord);
    const createdTrial = { ...trialRecord, id: id as number };
    
    // 添加同步项目
    await addSyncItem('vipTrials', 'create', createdTrial);
    
    // 激活VIP试用
    await activateVipTrial(userId, trialDays);
    
    return createdTrial;
  } catch (error) {
    console.error('Failed to create VIP trial:', error);
    throw error;
  }
}

/**
 * 获取用户的VIP试用记录
 * @param userId 用户ID
 * @returns VIP试用记录
 */
export async function getUserVipTrial(userId: string): Promise<VipTrialRecord | null> {
  try {
    const trial = await db.table('vipTrials')
      .where('userId')
      .equals(userId)
      .first();
    
    return trial || null;
  } catch (error) {
    console.error('Failed to get user VIP trial:', error);
    return null;
  }
}

/**
 * 更新VIP试用记录
 * @param trialId 试用记录ID
 * @param updates 更新数据
 * @returns 更新后的VIP试用记录
 */
export async function updateVipTrial(
  trialId: number,
  updates: Partial<Omit<VipTrialRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<VipTrialRecord> {
  try {
    // 获取试用记录
    const trial = await db.table('vipTrials').get(trialId);
    if (!trial) {
      throw new Error(`VIP trial with ID ${trialId} not found`);
    }
    
    // 更新试用记录
    const updatedTrial = {
      ...trial,
      ...updates,
      updatedAt: new Date()
    };
    
    // 更新数据库
    await db.table('vipTrials').update(trialId, updatedTrial);
    
    // 添加同步项目
    await addSyncItem('vipTrials', 'update', updatedTrial);
    
    return updatedTrial;
  } catch (error) {
    console.error('Failed to update VIP trial:', error);
    throw error;
  }
}

/**
 * 标记VIP试用指南为已显示
 * @param trialId 试用记录ID
 * @returns 更新后的VIP试用记录
 */
export async function markVipTrialGuideAsShown(trialId: number): Promise<VipTrialRecord> {
  return updateVipTrial(trialId, { hasShownGuide: true });
}

/**
 * 标记VIP试用价值回顾为已显示
 * @param trialId 试用记录ID
 * @returns 更新后的VIP试用记录
 */
export async function markVipTrialValueReviewAsShown(trialId: number): Promise<VipTrialRecord> {
  return updateVipTrial(trialId, { hasShownValueReview: true });
}

/**
 * 标记VIP试用到期提醒为已显示
 * @param trialId 试用记录ID
 * @returns 更新后的VIP试用记录
 */
export async function markVipTrialExpirationReminderAsShown(trialId: number): Promise<VipTrialRecord> {
  return updateVipTrial(trialId, { hasShownExpirationReminder: true });
}

/**
 * 更新VIP试用状态
 * @param userId 用户ID
 * @returns 更新后的VIP试用记录
 */
export async function updateVipTrialStatus(userId: string): Promise<VipTrialRecord | null> {
  try {
    // 获取用户的VIP试用记录
    const trial = await getUserVipTrial(userId);
    if (!trial) {
      return null;
    }
    
    // 如果已经是最终状态，不需要更新
    if (
      trial.status === VipTrialStatus.COMPLETED ||
      trial.status === VipTrialStatus.CONVERTED ||
      trial.status === VipTrialStatus.EXPIRED
    ) {
      return trial;
    }
    
    // 检查用户是否是VIP
    const isVip = await isUserVip(userId);
    
    // 如果用户是VIP，标记为已转化
    if (isVip) {
      return updateVipTrial(trial.id!, { status: VipTrialStatus.CONVERTED });
    }
    
    // 检查试用期是否已过期
    const now = new Date();
    if (trial.endDate && now > trial.endDate) {
      return updateVipTrial(trial.id!, { status: VipTrialStatus.EXPIRED });
    }
    
    return trial;
  } catch (error) {
    console.error('Failed to update VIP trial status:', error);
    return null;
  }
}
