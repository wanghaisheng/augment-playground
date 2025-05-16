// src/services/customGoalService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { isUserVip } from './storeService';

/**
 * 自定义目标类型
 */
export enum CustomGoalType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

/**
 * 自定义目标状态
 */
export enum CustomGoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

/**
 * 自定义目标记录
 */
export interface CustomGoalRecord {
  id?: number;
  userId: string;
  title: string;
  description?: string;
  type: CustomGoalType;
  status: CustomGoalStatus;
  targetValue: number;
  currentValue: number;
  startDate: Date;
  endDate?: Date;
  completedDate?: Date;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 自定义目标进度记录
 */
export interface CustomGoalProgressRecord {
  id?: number;
  goalId: number;
  value: number;
  date: Date;
  notes?: string;
  createdAt: Date;
}

/**
 * 获取用户可以创建的自定义目标数量
 * @param userId 用户ID
 * @returns 可以创建的自定义目标数量
 */
export async function getCustomGoalLimit(userId: string): Promise<number> {
  try {
    // 检查用户是否是VIP
    const isVip = await isUserVip(userId);
    
    // VIP用户可以创建5个自定义目标，非VIP用户只能创建1个
    return isVip ? 5 : 1;
  } catch (error) {
    console.error('Failed to get custom goal limit:', error);
    return 1; // 默认限制为1
  }
}

/**
 * 获取用户已创建的自定义目标数量
 * @param userId 用户ID
 * @returns 已创建的自定义目标数量
 */
export async function getCustomGoalCount(userId: string): Promise<number> {
  try {
    // 获取用户的活跃自定义目标
    const goals = await db.table('customGoals')
      .where('userId')
      .equals(userId)
      .and(goal => goal.status === CustomGoalStatus.ACTIVE)
      .count();
    
    return goals;
  } catch (error) {
    console.error('Failed to get custom goal count:', error);
    return 0;
  }
}

/**
 * 检查用户是否可以创建新的自定义目标
 * @param userId 用户ID
 * @returns 是否可以创建新的自定义目标
 */
export async function canCreateCustomGoal(userId: string): Promise<boolean> {
  try {
    const limit = await getCustomGoalLimit(userId);
    const count = await getCustomGoalCount(userId);
    
    return count < limit;
  } catch (error) {
    console.error('Failed to check if user can create custom goal:', error);
    return false;
  }
}

/**
 * 获取用户的自定义目标
 * @param userId 用户ID
 * @param status 目标状态（可选）
 * @returns 用户的自定义目标列表
 */
export async function getUserCustomGoals(
  userId: string,
  status?: CustomGoalStatus
): Promise<CustomGoalRecord[]> {
  try {
    let query = db.table('customGoals').where('userId').equals(userId);
    
    if (status) {
      query = query.and(goal => goal.status === status);
    }
    
    return query.toArray();
  } catch (error) {
    console.error('Failed to get user custom goals:', error);
    return [];
  }
}

/**
 * 创建自定义目标
 * @param goal 自定义目标数据
 * @returns 创建的自定义目标
 */
export async function createCustomGoal(
  goal: Omit<CustomGoalRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CustomGoalRecord> {
  try {
    // 检查用户是否可以创建新的自定义目标
    const canCreate = await canCreateCustomGoal(goal.userId);
    if (!canCreate) {
      throw new Error('User has reached the custom goal limit');
    }
    
    // 创建自定义目标
    const now = new Date();
    const newGoal: CustomGoalRecord = {
      ...goal,
      createdAt: now,
      updatedAt: now
    };
    
    // 添加到数据库
    const id = await db.table('customGoals').add(newGoal);
    const createdGoal = { ...newGoal, id: id as number };
    
    // 添加同步项目
    await addSyncItem('customGoals', 'create', createdGoal);
    
    return createdGoal;
  } catch (error) {
    console.error('Failed to create custom goal:', error);
    throw error;
  }
}

/**
 * 更新自定义目标
 * @param id 自定义目标ID
 * @param updates 更新数据
 * @returns 更新后的自定义目标
 */
export async function updateCustomGoal(
  id: number,
  updates: Partial<Omit<CustomGoalRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<CustomGoalRecord> {
  try {
    // 获取自定义目标
    const goal = await db.table('customGoals').get(id);
    if (!goal) {
      throw new Error(`Custom goal with ID ${id} not found`);
    }
    
    // 更新自定义目标
    const updatedGoal = {
      ...goal,
      ...updates,
      updatedAt: new Date()
    };
    
    // 更新数据库
    await db.table('customGoals').update(id, updatedGoal);
    
    // 添加同步项目
    await addSyncItem('customGoals', 'update', updatedGoal);
    
    return updatedGoal;
  } catch (error) {
    console.error('Failed to update custom goal:', error);
    throw error;
  }
}

/**
 * 删除自定义目标
 * @param id 自定义目标ID
 */
export async function deleteCustomGoal(id: number): Promise<void> {
  try {
    // 获取自定义目标
    const goal = await db.table('customGoals').get(id);
    if (!goal) {
      throw new Error(`Custom goal with ID ${id} not found`);
    }
    
    // 删除自定义目标
    await db.table('customGoals').delete(id);
    
    // 添加同步项目
    await addSyncItem('customGoals', 'delete', { id });
  } catch (error) {
    console.error('Failed to delete custom goal:', error);
    throw error;
  }
}

/**
 * 更新自定义目标进度
 * @param goalId 自定义目标ID
 * @param value 进度值
 * @param notes 备注（可选）
 * @returns 更新后的自定义目标
 */
export async function updateCustomGoalProgress(
  goalId: number,
  value: number,
  notes?: string
): Promise<CustomGoalRecord> {
  try {
    // 获取自定义目标
    const goal = await db.table('customGoals').get(goalId);
    if (!goal) {
      throw new Error(`Custom goal with ID ${goalId} not found`);
    }
    
    // 创建进度记录
    const now = new Date();
    const progress: CustomGoalProgressRecord = {
      goalId,
      value,
      date: now,
      notes,
      createdAt: now
    };
    
    // 添加进度记录到数据库
    await db.table('customGoalProgress').add(progress);
    
    // 更新自定义目标的当前值
    const newCurrentValue = goal.currentValue + value;
    const updates: Partial<CustomGoalRecord> = {
      currentValue: newCurrentValue,
      updatedAt: now
    };
    
    // 如果达到目标值，标记为已完成
    if (newCurrentValue >= goal.targetValue && goal.status === CustomGoalStatus.ACTIVE) {
      updates.status = CustomGoalStatus.COMPLETED;
      updates.completedDate = now;
    }
    
    // 更新自定义目标
    return updateCustomGoal(goalId, updates);
  } catch (error) {
    console.error('Failed to update custom goal progress:', error);
    throw error;
  }
}

/**
 * 获取自定义目标的进度记录
 * @param goalId 自定义目标ID
 * @returns 进度记录列表
 */
export async function getCustomGoalProgress(goalId: number): Promise<CustomGoalProgressRecord[]> {
  try {
    return db.table('customGoalProgress')
      .where('goalId')
      .equals(goalId)
      .toArray();
  } catch (error) {
    console.error('Failed to get custom goal progress:', error);
    return [];
  }
}
