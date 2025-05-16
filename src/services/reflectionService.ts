// src/services/reflectionService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { TaskRecord, TaskStatus } from './taskService';
import { updatePandaMood } from './pandaStateService';
import type { PandaMood } from '@/components/game/PandaAvatar';

// 反思记录类型
export interface ReflectionRecord {
  id?: number;
  userId: string;
  taskId?: number;
  mood: string;
  reflection: string;
  action: string;
  createdAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
  tags?: string[];
}

// 反思触发类型
export enum ReflectionTriggerType {
  MOOD_CHANGE = 'mood_change',
  TASK_FAILURE = 'task_failure',
  DAILY_REFLECTION = 'daily_reflection',
  WEEKLY_REVIEW = 'weekly_review',
  MANUAL = 'manual'
}

// 反思触发记录类型
export interface ReflectionTriggerRecord {
  id?: number;
  userId: string;
  type: ReflectionTriggerType;
  createdAt: Date;
  isViewed: boolean;
  isCompleted: boolean;
  data?: any;
}

// 情绪记录类型
export interface MoodRecord {
  id?: number;
  userId: string;
  mood: PandaMood;
  intensity: number;
  note?: string;
  createdAt: Date;
  tags?: string[];
}

// 情绪类型
export enum MoodType {
  HAPPY = 'happy',
  CONTENT = 'content',
  NEUTRAL = 'neutral',
  SAD = 'sad',
  ANXIOUS = 'anxious',
  STRESSED = 'stressed',
  TIRED = 'tired',
  ENERGETIC = 'energetic',
  MOTIVATED = 'motivated',
  FRUSTRATED = 'frustrated',
  ANGRY = 'angry',
  CALM = 'calm'
}

// 情绪强度（1-5）
export type MoodIntensity = 1 | 2 | 3 | 4 | 5;

/**
 * 创建反思记录
 * @param reflection 反思数据
 */
export async function createReflection(
  reflection: Omit<ReflectionRecord, 'id' | 'createdAt' | 'isCompleted'>
): Promise<ReflectionRecord> {
  const now = new Date();

  const newReflection: ReflectionRecord = {
    ...reflection,
    createdAt: now,
    isCompleted: false
  };

  // 添加到数据库
  const id = await db.table('reflections').add(newReflection);
  const createdReflection = { ...newReflection, id: id as number };

  // 添加到同步队列
  await addSyncItem('reflections', 'create', createdReflection);

  return createdReflection;
}

/**
 * 完成反思记录
 * @param id 反思记录ID
 * @param action 采取的行动
 */
export async function completeReflection(
  id: number,
  action: string
): Promise<ReflectionRecord> {
  const reflection = await db.table('reflections').get(id);
  if (!reflection) {
    throw new Error(`Reflection with id ${id} not found`);
  }

  const now = new Date();
  const updatedReflection = {
    ...reflection,
    action,
    completedAt: now,
    isCompleted: true
  };

  // 更新数据库
  await db.table('reflections').update(id, updatedReflection);

  // 添加到同步队列
  await addSyncItem('reflections', 'update', updatedReflection);

  return updatedReflection;
}

/**
 * 获取用户的反思记录
 * @param userId 用户ID
 * @param limit 限制数量
 */
export async function getUserReflections(
  userId: string,
  limit?: number
): Promise<ReflectionRecord[]> {
  let query = db.table('reflections')
    .where('userId')
    .equals(userId)
    .reverse();

  if (limit) {
    query = query.limit(limit);
  }

  return query.sortBy('createdAt');
}

/**
 * 创建反思触发记录
 * @param trigger 触发数据
 */
export async function createReflectionTrigger(
  trigger: Omit<ReflectionTriggerRecord, 'id' | 'createdAt' | 'isViewed' | 'isCompleted'>
): Promise<ReflectionTriggerRecord> {
  const now = new Date();

  const newTrigger: ReflectionTriggerRecord = {
    ...trigger,
    createdAt: now,
    isViewed: false,
    isCompleted: false
  };

  // 添加到数据库
  const id = await db.table('reflectionTriggers').add(newTrigger);
  const createdTrigger = { ...newTrigger, id: id as number };

  // 添加到同步队列
  await addSyncItem('reflectionTriggers', 'create', createdTrigger);

  return createdTrigger;
}

/**
 * 获取用户的未查看反思触发记录
 * @param userId 用户ID
 */
export async function getUnviewedReflectionTriggers(
  userId: string
): Promise<ReflectionTriggerRecord[]> {
  return db.table('reflectionTriggers')
    .where('userId')
    .equals(userId)
    .and(trigger => !trigger.isViewed)
    .sortBy('createdAt');
}

/**
 * 标记反思触发记录为已查看
 * @param id 触发记录ID
 */
export async function markTriggerAsViewed(
  id: number
): Promise<ReflectionTriggerRecord> {
  const trigger = await db.table('reflectionTriggers').get(id);
  if (!trigger) {
    throw new Error(`Reflection trigger with id ${id} not found`);
  }

  const updatedTrigger = {
    ...trigger,
    isViewed: true
  };

  // 更新数据库
  await db.table('reflectionTriggers').update(id, updatedTrigger);

  // 添加到同步队列
  await addSyncItem('reflectionTriggers', 'update', updatedTrigger);

  return updatedTrigger;
}

/**
 * 标记反思触发记录为已完成
 * @param id 触发记录ID
 */
export async function markTriggerAsCompleted(
  id: number
): Promise<ReflectionTriggerRecord> {
  const trigger = await db.table('reflectionTriggers').get(id);
  if (!trigger) {
    throw new Error(`Reflection trigger with id ${id} not found`);
  }

  const updatedTrigger = {
    ...trigger,
    isViewed: true,
    isCompleted: true
  };

  // 更新数据库
  await db.table('reflectionTriggers').update(id, updatedTrigger);

  // 添加到同步队列
  await addSyncItem('reflectionTriggers', 'update', updatedTrigger);

  return updatedTrigger;
}

/**
 * 记录用户情绪
 * @param mood 情绪数据
 */
export async function recordMood(
  mood: Omit<MoodRecord, 'id' | 'createdAt'>
): Promise<MoodRecord> {
  const now = new Date();

  const newMood: MoodRecord = {
    ...mood,
    createdAt: now
  };

  // 添加到数据库
  const id = await db.table('moods').add(newMood);
  const createdMood = { ...newMood, id: id as number };

  // 添加到同步队列
  await addSyncItem('moods', 'create', createdMood);

  // 更新熊猫心情
  await updatePandaMood(mood.mood);

  // 检查是否需要触发反思
  await checkMoodTrigger(mood.userId, mood.mood, mood.intensity);

  return createdMood;
}

/**
 * 获取用户的情绪记录
 * @param userId 用户ID
 * @param limit 限制数量
 */
export async function getUserMoods(
  userId: string,
  limit?: number
): Promise<MoodRecord[]> {
  let query = db.table('moods')
    .where('userId')
    .equals(userId)
    .reverse();

  if (limit) {
    query = query.limit(limit);
  }

  return query.sortBy('createdAt');
}

/**
 * 检查情绪是否需要触发反思
 * @param userId 用户ID
 * @param mood 情绪
 * @param intensity 强度
 */
async function checkMoodTrigger(
  userId: string,
  mood: string,
  intensity: number
): Promise<void> {
  // 如果是负面情绪且强度较高，触发反思
  if (
    (mood === MoodType.SAD ||
     mood === MoodType.ANXIOUS ||
     mood === MoodType.STRESSED ||
     mood === MoodType.FRUSTRATED ||
     mood === MoodType.ANGRY) &&
    intensity >= 4
  ) {
    await createReflectionTrigger({
      userId,
      type: ReflectionTriggerType.MOOD_CHANGE,
      data: { mood, intensity }
    });
  }
}

/**
 * 检查任务失败是否需要触发反思
 * @param userId 用户ID
 * @param task 任务
 */
export async function checkTaskFailureTrigger(
  userId: string,
  task: TaskRecord
): Promise<void> {
  // 如果任务已过期且未完成，触发反思
  if (
    task.status !== TaskStatus.COMPLETED &&
    task.dueDate &&
    new Date(task.dueDate) < new Date()
  ) {
    await createReflectionTrigger({
      userId,
      type: ReflectionTriggerType.TASK_FAILURE,
      data: { taskId: task.id, taskTitle: task.title }
    });
  }
}

/**
 * 检查是否需要触发每日反思
 * @param userId 用户ID
 */
export async function checkDailyReflectionTrigger(
  userId: string
): Promise<void> {
  // 获取最近的每日反思触发记录
  const recentTriggers = await db.table('reflectionTriggers')
    .where('userId')
    .equals(userId)
    .and(trigger => trigger.type === ReflectionTriggerType.DAILY_REFLECTION)
    .reverse()
    .sortBy('createdAt');

  // 如果没有记录或最近的记录是昨天之前的，触发每日反思
  if (
    recentTriggers.length === 0 ||
    isYesterdayOrBefore(recentTriggers[0].createdAt)
  ) {
    await createReflectionTrigger({
      userId,
      type: ReflectionTriggerType.DAILY_REFLECTION,
      data: {}
    });
  }
}

/**
 * 检查是否需要触发每周回顾
 * @param userId 用户ID
 */
export async function checkWeeklyReviewTrigger(
  userId: string
): Promise<void> {
  // 获取最近的每周回顾触发记录
  const recentTriggers = await db.table('reflectionTriggers')
    .where('userId')
    .equals(userId)
    .and(trigger => trigger.type === ReflectionTriggerType.WEEKLY_REVIEW)
    .reverse()
    .sortBy('createdAt');

  // 如果没有记录或最近的记录是一周之前的，触发每周回顾
  if (
    recentTriggers.length === 0 ||
    isWeekOrBefore(recentTriggers[0].createdAt)
  ) {
    await createReflectionTrigger({
      userId,
      type: ReflectionTriggerType.WEEKLY_REVIEW,
      data: {}
    });
  }
}

/**
 * 判断日期是否是昨天或之前
 * @param date 日期
 */
function isYesterdayOrBefore(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  return new Date(date) < yesterday;
}

/**
 * 判断日期是否是一周或之前
 * @param date 日期
 */
function isWeekOrBefore(date: Date): boolean {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);

  return new Date(date) < weekAgo;
}
