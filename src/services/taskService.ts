// src/services/taskService.ts
import { db } from '@/db';
import { addPandaExperience, updatePandaMood } from './pandaStateService';
import { generateRewardsForTask, RewardRecord } from './rewardService';
import { addSyncItem } from './dataSyncService';
import { checkTaskForTimelyReward, TimelyRewardRecord } from './timelyRewardService';

// 任务状态枚举
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// 任务优先级枚举
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// 任务类型枚举
export enum TaskType {
  DAILY = 'daily',    // 日常任务
  MAIN = 'main',      // 主线任务
  SIDE = 'side'       // 支线任务
}

// 任务记录类型
export interface TaskRecord {
  id?: number;
  title: string;
  description?: string;
  categoryId: number;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  reminderTime?: Date;
  estimatedMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  repeatPattern?: string; // 例如: "daily", "weekly:1,3,5", "monthly:15"
  tags?: string[];
}

// 任务类别记录类型
export interface TaskCategoryRecord {
  id?: number;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isDefault: boolean;
  createdAt: Date;
}

// 任务完成记录类型
export interface TaskCompletionRecord {
  id?: number;
  taskId: number;
  completedAt: Date;
  experienceGained: number;
  notes?: string;
}

// 默认任务类别
const DEFAULT_CATEGORIES: Omit<TaskCategoryRecord, 'id'>[] = [
  {
    name: 'Work',
    description: 'Work related tasks',
    color: '#4A6FA5',
    icon: 'briefcase',
    isDefault: true,
    createdAt: new Date()
  },
  {
    name: 'Personal',
    description: 'Personal tasks',
    color: '#6B8F71',
    icon: 'user',
    isDefault: true,
    createdAt: new Date()
  },
  {
    name: 'Health',
    description: 'Health and fitness tasks',
    color: '#D98580',
    icon: 'heart',
    isDefault: true,
    createdAt: new Date()
  },
  {
    name: 'Learning',
    description: 'Learning and education tasks',
    color: '#B4A7D6',
    icon: 'book',
    isDefault: true,
    createdAt: new Date()
  }
];

/**
 * 初始化任务类别
 * 如果没有任务类别，则创建默认类别
 */
export async function initializeTaskCategories(): Promise<void> {
  const count = await db.taskCategories.count();
  if (count === 0) {
    console.log('Initializing default task categories...');
    await db.taskCategories.bulkAdd(DEFAULT_CATEGORIES);
  }
}

/**
 * 获取所有任务类别
 */
export async function getAllTaskCategories(): Promise<TaskCategoryRecord[]> {
  return db.taskCategories.toArray();
}

/**
 * 创建新的任务类别
 */
export async function createTaskCategory(category: Omit<TaskCategoryRecord, 'id' | 'createdAt'>): Promise<number> {
  const newCategory = {
    ...category,
    createdAt: new Date()
  };
  return db.taskCategories.add(newCategory);
}

/**
 * 获取单个任务
 * @param id 任务ID
 */
export async function getTask(id: number): Promise<TaskRecord | undefined> {
  return db.tasks.get(id);
}

/**
 * 获取所有任务
 * @param filter 可选的过滤条件
 */
export async function getAllTasks(filter?: {
  status?: TaskStatus;
  categoryId?: number;
  type?: TaskType;
  priority?: TaskPriority;
}): Promise<TaskRecord[]> {
  let query = db.tasks.toCollection();

  if (filter) {
    if (filter.status) {
      query = query.filter(task => task.status === filter.status);
    }
    if (filter.categoryId) {
      query = query.filter(task => task.categoryId === filter.categoryId);
    }
    if (filter.type) {
      query = query.filter(task => task.type === filter.type);
    }
    if (filter.priority) {
      query = query.filter(task => task.priority === filter.priority);
    }
  }

  return query.toArray();
}

/**
 * 创建新任务
 */
export async function createTask(task: Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<number> {
  const now = new Date();
  const newTask = {
    ...task,
    status: TaskStatus.TODO,
    createdAt: now,
    updatedAt: now
  };

  // 添加任务到数据库
  const id = await db.tasks.add(newTask);

  // 添加同步项目
  await addSyncItem('tasks', 'create', { ...newTask, id });

  return id;
}

/**
 * 更新任务
 */
export async function updateTask(id: number, updates: Partial<Omit<TaskRecord, 'id' | 'createdAt'>>): Promise<void> {
  const task = await db.tasks.get(id);
  if (!task) {
    throw new Error(`Task with id ${id} not found`);
  }

  const updatedTask = {
    ...task,
    ...updates,
    updatedAt: new Date()
  };

  // 更新数据库
  await db.tasks.update(id, updatedTask);

  // 添加同步项目
  await addSyncItem('tasks', 'update', updatedTask);
}

/**
 * 完成任务
 * 更新任务状态为已完成，创建完成记录，生成奖励，并增加熊猫经验值
 * @returns 生成的奖励列表和及时奖励（如果有）
 */
export async function completeTask(id: number, notes?: string): Promise<{
  rewards: RewardRecord[];
  timelyReward?: TimelyRewardRecord | null;
}> {
  const task = await db.tasks.get(id);
  if (!task) {
    throw new Error(`Task with id ${id} not found`);
  }

  const now = new Date();

  // 计算获得的经验值（基于任务优先级和类型）
  let experienceGained = 10; // 基础经验值

  // 根据优先级增加经验值
  switch (task.priority) {
    case TaskPriority.HIGH:
      experienceGained += 15;
      break;
    case TaskPriority.MEDIUM:
      experienceGained += 10;
      break;
    case TaskPriority.LOW:
      experienceGained += 5;
      break;
  }

  // 根据任务类型增加经验值
  switch (task.type) {
    case TaskType.MAIN:
      experienceGained += 20;
      break;
    case TaskType.DAILY:
      experienceGained += 5;
      break;
    case TaskType.SIDE:
      experienceGained += 10;
      break;
  }

  // 更新任务状态
  await updateTask(id, {
    status: TaskStatus.COMPLETED,
    completedAt: now
  });

  // 创建完成记录
  await db.taskCompletions.add({
    taskId: id,
    completedAt: now,
    experienceGained,
    notes
  });

  // 增加熊猫经验值
  await addPandaExperience(experienceGained);

  // 更新熊猫心情为开心
  await updatePandaMood('happy');

  // 生成任务奖励
  const rewards = await generateRewardsForTask(task);

  // 检查是否符合及时奖励条件
  const timelyReward = await checkTaskForTimelyReward({
    ...task,
    status: TaskStatus.COMPLETED,
    completedAt: now
  });

  return {
    rewards,
    timelyReward
  };
}

/**
 * 获取任务统计信息
 */
export async function getTaskStats(): Promise<{
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  byCategory: Record<number, number>;
  byPriority: Record<TaskPriority, number>;
}> {
  const tasks = await db.tasks.toArray();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
    byCategory: {} as Record<number, number>,
    byPriority: {
      [TaskPriority.LOW]: 0,
      [TaskPriority.MEDIUM]: 0,
      [TaskPriority.HIGH]: 0
    }
  };

  // 按类别统计
  tasks.forEach(task => {
    if (!stats.byCategory[task.categoryId]) {
      stats.byCategory[task.categoryId] = 0;
    }
    stats.byCategory[task.categoryId]++;

    // 按优先级统计
    stats.byPriority[task.priority]++;
  });

  return stats;
}

/**
 * 获取任务完成历史
 */
export async function getTaskCompletionHistory(): Promise<TaskCompletionRecord[]> {
  return db.taskCompletions.toArray();
}

/**
 * 获取今日待办任务
 */
export async function getTodayTasks(): Promise<TaskRecord[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return db.tasks
    .where('dueDate')
    .between(today, tomorrow, true, false)
    .and(task => task.status !== TaskStatus.COMPLETED && task.status !== TaskStatus.ARCHIVED)
    .toArray();
}

/**
 * 获取逾期任务
 */
export async function getOverdueTasks(): Promise<TaskRecord[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return db.tasks
    .where('dueDate')
    .below(today)
    .and(task => task.status !== TaskStatus.COMPLETED && task.status !== TaskStatus.ARCHIVED)
    .toArray();
}

/**
 * 删除任务
 */
export async function deleteTask(id: number): Promise<void> {
  const task = await db.tasks.get(id);
  if (!task) {
    throw new Error(`Task with id ${id} not found`);
  }

  // 从数据库中删除
  await db.tasks.delete(id);

  // 添加同步项目
  await addSyncItem('tasks', 'delete', task);
}

/**
 * 归档任务
 */
export async function archiveTask(id: number): Promise<void> {
  await updateTask(id, { status: TaskStatus.ARCHIVED });
}
