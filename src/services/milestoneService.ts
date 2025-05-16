// src/services/milestoneService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';

/**
 * 里程碑类型
 */
export enum MilestoneType {
  TASK_COMPLETION_COUNT = 'task_completion_count',
  CHALLENGE_COMPLETION_COUNT = 'challenge_completion_count',
  STREAK_DAYS = 'streak_days',
  APP_USAGE_DAYS = 'app_usage_days',
  PANDA_LEVEL = 'panda_level',
  BAMBOO_COLLECTED = 'bamboo_collected',
  CUSTOM = 'custom'
}

/**
 * 里程碑记录
 */
export interface MilestoneRecord {
  id?: number;
  userId: string;
  type: MilestoneType;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  isCompleted: 0 | 1;
  completedAt?: Date;
  rewardType?: string;
  rewardAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 初始化用户里程碑
 * @param userId 用户ID
 */
export async function initializeUserMilestones(userId: string): Promise<void> {
  try {
    // 检查用户是否已有里程碑
    const existingMilestones = await db.milestones
      .where('userId')
      .equals(userId)
      .toArray();
    
    if (existingMilestones.length > 0) {
      return; // 用户已有里程碑，不需要初始化
    }
    
    // 默认里程碑列表
    const defaultMilestones: Omit<MilestoneRecord, 'id'>[] = [
      // 任务完成数量里程碑
      {
        userId,
        type: MilestoneType.TASK_COMPLETION_COUNT,
        name: '任务新手',
        description: '完成10个任务',
        targetValue: 10,
        currentValue: 0,
        isCompleted: 0,
        rewardType: 'experience',
        rewardAmount: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId,
        type: MilestoneType.TASK_COMPLETION_COUNT,
        name: '任务达人',
        description: '完成50个任务',
        targetValue: 50,
        currentValue: 0,
        isCompleted: 0,
        rewardType: 'experience',
        rewardAmount: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId,
        type: MilestoneType.TASK_COMPLETION_COUNT,
        name: '任务大师',
        description: '完成100个任务',
        targetValue: 100,
        currentValue: 0,
        isCompleted: 0,
        rewardType: 'experience',
        rewardAmount: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // 连续打卡里程碑
      {
        userId,
        type: MilestoneType.STREAK_DAYS,
        name: '坚持一周',
        description: '连续打卡7天',
        targetValue: 7,
        currentValue: 0,
        isCompleted: 0,
        rewardType: 'bamboo',
        rewardAmount: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId,
        type: MilestoneType.STREAK_DAYS,
        name: '坚持一月',
        description: '连续打卡30天',
        targetValue: 30,
        currentValue: 0,
        isCompleted: 0,
        rewardType: 'bamboo',
        rewardAmount: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // 应用使用天数里程碑
      {
        userId,
        type: MilestoneType.APP_USAGE_DAYS,
        name: '初次相识',
        description: '使用应用7天',
        targetValue: 7,
        currentValue: 0,
        isCompleted: 0,
        rewardType: 'experience',
        rewardAmount: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId,
        type: MilestoneType.APP_USAGE_DAYS,
        name: '老朋友',
        description: '使用应用30天',
        targetValue: 30,
        currentValue: 0,
        isCompleted: 0,
        rewardType: 'experience',
        rewardAmount: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // 批量添加里程碑
    const milestoneIds = await db.milestones.bulkAdd(
      defaultMilestones,
      { allKeys: true }
    );
    
    // 添加同步项目
    for (let i = 0; i < defaultMilestones.length; i++) {
      const milestone = {
        ...defaultMilestones[i],
        id: milestoneIds[i] as number
      };
      
      await addSyncItem('milestones', 'create', milestone);
    }
  } catch (error) {
    console.error('Failed to initialize user milestones:', error);
    throw error;
  }
}

/**
 * 获取用户里程碑
 * @param userId 用户ID
 * @returns 里程碑列表
 */
export async function getUserMilestones(userId: string): Promise<MilestoneRecord[]> {
  try {
    // 确保用户里程碑已初始化
    await initializeUserMilestones(userId);
    
    // 获取用户里程碑
    return await db.milestones
      .where('userId')
      .equals(userId)
      .toArray();
  } catch (error) {
    console.error('Failed to get user milestones:', error);
    return [];
  }
}

/**
 * 更新里程碑进度
 * @param userId 用户ID
 * @param type 里程碑类型
 * @param value 当前值
 * @returns 更新后的里程碑列表
 */
export async function updateMilestoneProgress(
  userId: string,
  type: MilestoneType,
  value: number
): Promise<MilestoneRecord[]> {
  try {
    // 获取指定类型的里程碑
    const milestones = await db.milestones
      .where('[userId+type]')
      .equals([userId, type])
      .toArray();
    
    const updatedMilestones: MilestoneRecord[] = [];
    const now = new Date();
    
    // 更新每个里程碑的进度
    for (const milestone of milestones) {
      // 如果里程碑已完成，跳过
      if (milestone.isCompleted === 1) {
        updatedMilestones.push(milestone);
        continue;
      }
      
      // 更新当前值
      const updatedMilestone = {
        ...milestone,
        currentValue: value,
        updatedAt: now
      };
      
      // 检查是否达成里程碑
      if (value >= milestone.targetValue && milestone.isCompleted === 0) {
        updatedMilestone.isCompleted = 1;
        updatedMilestone.completedAt = now;
      }
      
      // 更新数据库
      await db.milestones.update(milestone.id!, updatedMilestone);
      
      // 添加同步项目
      await addSyncItem('milestones', 'update', updatedMilestone);
      
      updatedMilestones.push(updatedMilestone);
    }
    
    return updatedMilestones;
  } catch (error) {
    console.error('Failed to update milestone progress:', error);
    return [];
  }
}

/**
 * 获取已完成的里程碑
 * @param userId 用户ID
 * @returns 已完成的里程碑列表
 */
export async function getCompletedMilestones(userId: string): Promise<MilestoneRecord[]> {
  try {
    return await db.milestones
      .where('[userId+isCompleted]')
      .equals([userId, 1])
      .toArray();
  } catch (error) {
    console.error('Failed to get completed milestones:', error);
    return [];
  }
}

/**
 * 获取未完成的里程碑
 * @param userId 用户ID
 * @returns 未完成的里程碑列表
 */
export async function getIncompleteMilestones(userId: string): Promise<MilestoneRecord[]> {
  try {
    return await db.milestones
      .where('[userId+isCompleted]')
      .equals([userId, 0])
      .toArray();
  } catch (error) {
    console.error('Failed to get incomplete milestones:', error);
    return [];
  }
}

/**
 * 创建自定义里程碑
 * @param milestone 里程碑对象
 * @returns 创建的里程碑
 */
export async function createCustomMilestone(
  milestone: Omit<MilestoneRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MilestoneRecord> {
  try {
    const now = new Date();
    
    const newMilestone: Omit<MilestoneRecord, 'id'> = {
      ...milestone,
      type: MilestoneType.CUSTOM,
      currentValue: milestone.currentValue || 0,
      isCompleted: milestone.currentValue >= milestone.targetValue ? 1 : 0,
      completedAt: milestone.currentValue >= milestone.targetValue ? now : undefined,
      createdAt: now,
      updatedAt: now
    };
    
    // 添加到数据库
    const id = await db.milestones.add(newMilestone);
    const createdMilestone = { ...newMilestone, id: id as number };
    
    // 添加同步项目
    await addSyncItem('milestones', 'create', createdMilestone);
    
    return createdMilestone;
  } catch (error) {
    console.error('Failed to create custom milestone:', error);
    throw error;
  }
}
