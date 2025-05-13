// src/services/challengeService.ts
import { db } from '@/db';
import { addSyncItem } from './dataSyncService';
import { generateRewardsForChallenge, RewardRecord } from './rewardService';
import { TaskRecord, TaskStatus } from './taskService';

// 挑战状态枚举
export enum ChallengeStatus {
  ACTIVE = 'active',         // 活跃中
  COMPLETED = 'completed',   // 已完成
  EXPIRED = 'expired',       // 已过期
  UPCOMING = 'upcoming'      // 即将开始
}

// 挑战类型枚举
export enum ChallengeType {
  DAILY = 'daily',           // 每日挑战
  WEEKLY = 'weekly',         // 每周挑战
  EVENT = 'event',           // 活动挑战
  ONGOING = 'ongoing'        // 持续性挑战
}

// 挑战难度枚举
export enum ChallengeDifficulty {
  EASY = 'easy',             // 简单
  MEDIUM = 'medium',         // 中等
  HARD = 'hard',             // 困难
  EXPERT = 'expert'          // 专家
}

// 挑战记录类型
export interface ChallengeRecord {
  id?: number;               // 挑战ID
  title: string;             // 挑战标题
  description: string;       // 挑战描述
  type: ChallengeType;       // 挑战类型
  difficulty: ChallengeDifficulty; // 挑战难度
  status: ChallengeStatus;   // 挑战状态
  progress: number;          // 进度（0-100）
  startDate: Date;           // 开始日期
  endDate?: Date;            // 结束日期（可选，持续性挑战可能没有）
  completedDate?: Date;      // 完成日期
  taskIds: number[];         // 关联的任务ID列表
  rewardIds?: number[];      // 奖励ID列表
  iconPath: string;          // 图标路径
  createdAt: Date;           // 创建时间
  updatedAt: Date;           // 更新时间
}

// 挑战完成记录类型
export interface ChallengeCompletionRecord {
  id?: number;               // 记录ID
  challengeId: number;       // 挑战ID
  userId: string;            // 用户ID
  completedDate: Date;       // 完成日期
  rewardIds: number[];       // 获得的奖励ID列表
  createdAt: Date;           // 创建时间
}

// 预定义的挑战类别
export const PREDEFINED_CHALLENGE_CATEGORIES = [
  {
    id: 1,
    name: '健康习惯',
    description: '培养健康的生活方式',
    iconPath: '/assets/challenges/health.svg'
  },
  {
    id: 2,
    name: '学习成长',
    description: '提升知识和技能',
    iconPath: '/assets/challenges/learning.svg'
  },
  {
    id: 3,
    name: '工作效率',
    description: '提高工作和学习效率',
    iconPath: '/assets/challenges/productivity.svg'
  },
  {
    id: 4,
    name: '心灵成长',
    description: '培养积极心态和情绪管理',
    iconPath: '/assets/challenges/mindfulness.svg'
  },
  {
    id: 5,
    name: '社交关系',
    description: '改善人际关系和社交技能',
    iconPath: '/assets/challenges/social.svg'
  }
];

/**
 * 初始化挑战类别
 * 如果数据库中没有挑战类别记录，则添加预定义的类别
 */
export async function initializeChallengeCategories(): Promise<void> {
  try {
    const categories = await db.table('challengeCategories').toArray();

    if (categories.length === 0) {
      // 逐个添加类别，避免批量添加时的冲突
      for (const category of PREDEFINED_CHALLENGE_CATEGORIES) {
        try {
          // 检查类别是否已存在
          const existingCategory = await db.table('challengeCategories').get(category.id);
          if (!existingCategory) {
            await db.table('challengeCategories').add(category);
          }
        } catch (err) {
          console.warn(`Failed to add challenge category ${category.id}: ${err}`);
        }
      }
    }
  } catch (err) {
    console.error('Failed to initialize challenge categories:', err);
  }
}

/**
 * 获取所有挑战类别
 */
export async function getAllChallengeCategories(): Promise<any[]> {
  return db.table('challengeCategories').toArray();
}

/**
 * 获取所有挑战
 * @param filter 过滤条件
 */
export async function getAllChallenges(filter?: {
  status?: ChallengeStatus;
  type?: ChallengeType;
  difficulty?: ChallengeDifficulty;
}): Promise<ChallengeRecord[]> {
  let collection = db.table('challenges').toCollection();

  if (filter) {
    if (filter.status) {
      collection = collection.filter(challenge => challenge.status === filter.status);
    }
    if (filter.type) {
      collection = collection.filter(challenge => challenge.type === filter.type);
    }
    if (filter.difficulty) {
      collection = collection.filter(challenge => challenge.difficulty === filter.difficulty);
    }
  }

  return collection.toArray();
}

/**
 * 获取单个挑战
 * @param id 挑战ID
 */
export async function getChallenge(id: number): Promise<ChallengeRecord | undefined> {
  return db.table('challenges').get(id);
}

/**
 * 创建新挑战
 * @param challengeData 挑战数据
 */
export async function createChallenge(
  challengeData: Omit<ChallengeRecord, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'progress'>
): Promise<ChallengeRecord> {
  const now = new Date();

  const challenge: ChallengeRecord = {
    ...challengeData,
    status: ChallengeStatus.UPCOMING,
    progress: 0,
    createdAt: now,
    updatedAt: now
  };

  const id = await db.table('challenges').add(challenge);
  const newChallenge = { ...challenge, id: id as number };

  // 添加到同步队列
  await addSyncItem('challenges', 'create', newChallenge);

  return newChallenge;
}

/**
 * 更新挑战
 * @param id 挑战ID
 * @param challengeData 挑战数据
 */
export async function updateChallenge(
  id: number,
  challengeData: Partial<ChallengeRecord>
): Promise<ChallengeRecord> {
  const challenge = await db.table('challenges').get(id);

  if (!challenge) {
    throw new Error(`Challenge with id ${id} not found`);
  }

  const updatedChallenge = {
    ...challenge,
    ...challengeData,
    updatedAt: new Date()
  };

  await db.table('challenges').update(id, updatedChallenge);

  // 添加到同步队列
  await addSyncItem('challenges', 'update', updatedChallenge);

  return updatedChallenge;
}

/**
 * 删除挑战
 * @param id 挑战ID
 */
export async function deleteChallenge(id: number): Promise<void> {
  const challenge = await db.table('challenges').get(id);

  if (!challenge) {
    throw new Error(`Challenge with id ${id} not found`);
  }

  await db.table('challenges').delete(id);

  // 添加到同步队列
  await addSyncItem('challenges', 'delete', { id });
}

/**
 * 更新挑战进度
 * @param id 挑战ID
 * @param progress 进度值（0-100）
 */
export async function updateChallengeProgress(id: number, progress: number): Promise<ChallengeRecord> {
  const challenge = await db.table('challenges').get(id);

  if (!challenge) {
    throw new Error(`Challenge with id ${id} not found`);
  }

  // 确保进度在0-100范围内
  const validProgress = Math.max(0, Math.min(100, progress));

  // 如果进度达到100%，将状态更新为已完成
  let status = challenge.status;
  let completedDate = challenge.completedDate;

  if (validProgress >= 100 && status !== ChallengeStatus.COMPLETED) {
    status = ChallengeStatus.COMPLETED;
    completedDate = new Date();
  }

  const updatedChallenge = {
    ...challenge,
    progress: validProgress,
    status,
    completedDate,
    updatedAt: new Date()
  };

  await db.table('challenges').update(id, updatedChallenge);

  // 添加到同步队列
  await addSyncItem('challenges', 'update', updatedChallenge);

  return updatedChallenge;
}

/**
 * 完成挑战
 * @param id 挑战ID
 */
export async function completeChallenge(id: number): Promise<RewardRecord[]> {
  const challenge = await db.table('challenges').get(id);

  if (!challenge) {
    throw new Error(`Challenge with id ${id} not found`);
  }

  if (challenge.status === ChallengeStatus.COMPLETED) {
    throw new Error(`Challenge with id ${id} is already completed`);
  }

  // 更新挑战状态
  const updatedChallenge = {
    ...challenge,
    status: ChallengeStatus.COMPLETED,
    progress: 100,
    completedDate: new Date(),
    updatedAt: new Date()
  };

  await db.table('challenges').update(id, updatedChallenge);

  // 生成奖励
  const rewards = await generateRewardsForChallenge(updatedChallenge);

  // 创建挑战完成记录
  const completionRecord: ChallengeCompletionRecord = {
    challengeId: id,
    userId: 'current-user', // 在实际应用中，这应该是当前用户的ID
    completedDate: new Date(),
    rewardIds: rewards.map(reward => reward.id!),
    createdAt: new Date()
  };

  await db.table('challengeCompletions').add(completionRecord);

  // 添加到同步队列
  await addSyncItem('challenges', 'update', updatedChallenge);
  await addSyncItem('challengeCompletions', 'create', completionRecord);

  return rewards;
}

/**
 * 获取挑战关联的任务
 * @param challengeId 挑战ID
 */
export async function getChallengeTasks(challengeId: number): Promise<TaskRecord[]> {
  const challenge = await db.table('challenges').get(challengeId);

  if (!challenge) {
    throw new Error(`Challenge with id ${challengeId} not found`);
  }

  if (!challenge.taskIds || challenge.taskIds.length === 0) {
    return [];
  }

  return db.table('tasks')
    .where('id')
    .anyOf(challenge.taskIds)
    .toArray();
}

/**
 * 更新挑战进度基于任务完成情况
 * @param challengeId 挑战ID
 */
export async function updateChallengeProgressFromTasks(challengeId: number): Promise<ChallengeRecord> {
  const challenge = await db.table('challenges').get(challengeId);

  if (!challenge) {
    throw new Error(`Challenge with id ${challengeId} not found`);
  }

  if (!challenge.taskIds || challenge.taskIds.length === 0) {
    return challenge;
  }

  // 获取挑战关联的所有任务
  const tasks = await getChallengeTasks(challengeId);

  // 计算已完成任务的数量
  const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED);

  // 计算进度百分比
  const progress = Math.round((completedTasks.length / tasks.length) * 100);

  // 更新挑战进度
  return updateChallengeProgress(challengeId, progress);
}
