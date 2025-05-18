// src/services/vipTaskService.ts
import { db } from '@/db-old';
import {
  TaskRecord,
  TaskType,
  TaskStatus,
  TaskPriority,
  createTask,
  getAllTaskCategories
} from './taskService';
import { isUserVip } from './storeService';
import { addSyncItem } from './dataSyncService';
import { VipTaskSeriesType, VipTaskSeriesRecord as BaseVipTaskSeriesRecord } from '@/types/vip';

/**
 * 扩展VIP任务系列记录，添加额外的字段
 */
export interface ExtendedVipTaskSeriesRecord extends Omit<BaseVipTaskSeriesRecord, 'taskIds'> {
  iconPath?: string;
  taskIds: number[]; // Override the string type with number[]
}

/**
 * 检查用户是否可以访问VIP任务
 * @param userId 用户ID
 * @returns 是否可以访问VIP任务
 */
export async function canAccessVipTasks(userId: string): Promise<boolean> {
  return isUserVip(userId);
}

/**
 * 获取所有VIP任务系列
 * @returns VIP任务系列列表
 */
export async function getAllVipTaskSeries(): Promise<ExtendedVipTaskSeriesRecord[]> {
  const series = await db.vipTaskSeries.toArray();

  // Convert taskIds from string to number[] and ensure iconPath exists
  return series.map(item => ({
    ...item,
    iconPath: item.iconPath || '/assets/vip/default-series-icon.svg',
    taskIds: item.taskIds ? JSON.parse(item.taskIds as unknown as string) : []
  })) as ExtendedVipTaskSeriesRecord[];
}

/**
 * 获取活跃的VIP任务系列
 * @returns 活跃的VIP任务系列列表
 */
export async function getActiveVipTaskSeries(): Promise<ExtendedVipTaskSeriesRecord[]> {
  const series = await db.vipTaskSeries
    .filter(series => series.isActive === true)
    .toArray();

  // Convert taskIds from string to number[] and ensure iconPath exists
  return series.map(item => ({
    ...item,
    iconPath: item.iconPath || '/assets/vip/default-series-icon.svg',
    taskIds: item.taskIds ? JSON.parse(item.taskIds as unknown as string) : []
  })) as ExtendedVipTaskSeriesRecord[];
}

/**
 * 获取VIP任务系列
 * @param seriesId 系列ID
 * @returns VIP任务系列
 */
export async function getVipTaskSeries(seriesId: number): Promise<ExtendedVipTaskSeriesRecord | undefined> {
  const series = await db.vipTaskSeries.get(seriesId);

  if (!series) return undefined;

  // Convert taskIds from string to number[] and ensure iconPath exists
  return {
    ...series,
    iconPath: series.iconPath || '/assets/vip/default-series-icon.svg',
    taskIds: series.taskIds ? JSON.parse(series.taskIds as unknown as string) : []
  } as ExtendedVipTaskSeriesRecord;
}

/**
 * 获取VIP任务系列的任务
 * @param seriesId 系列ID
 * @returns 任务列表
 */
export async function getVipTaskSeriesTasks(seriesId: number): Promise<TaskRecord[]> {
  const series = await getVipTaskSeries(seriesId);
  if (!series) {
    return [];
  }

  const tasks: TaskRecord[] = [];
  for (const taskId of series.taskIds) {
    const task = await db.tasks.get(taskId);
    if (task) {
      tasks.push(task);
    }
  }

  return tasks;
}

/**
 * 创建VIP任务系列
 * @param series VIP任务系列数据
 * @returns 创建的VIP任务系列
 */
export async function createVipTaskSeries(
  series: Omit<ExtendedVipTaskSeriesRecord, 'id' | 'isCompleted' | 'taskIds' | 'createdAt' | 'updatedAt'>
): Promise<ExtendedVipTaskSeriesRecord> {
  const now = new Date();
  const newSeries: ExtendedVipTaskSeriesRecord = {
    ...series,
    isCompleted: false,
    taskIds: [], // Using number[] for our extended type
    createdAt: now,
    updatedAt: now
  };

  // Convert taskIds to string for database storage (to match BaseVipTaskSeriesRecord)
  const dbSeries = {
    ...newSeries,
    taskIds: JSON.stringify(newSeries.taskIds)
  };

  // 添加到数据库
  const id = await db.vipTaskSeries.add(dbSeries);
  const createdSeries = { ...newSeries, id: id as number };

  // 添加到同步队列
  await addSyncItem('vipTaskSeries', 'create', {
    ...dbSeries,
    id: id as number
  });

  return createdSeries;
}

/**
 * 更新VIP任务系列
 * @param seriesId 系列ID
 * @param updates 更新数据
 * @returns 更新后的VIP任务系列
 */
export async function updateVipTaskSeries(
  seriesId: number,
  updates: Partial<Omit<ExtendedVipTaskSeriesRecord, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ExtendedVipTaskSeriesRecord> {
  const series = await getVipTaskSeries(seriesId);
  if (!series) {
    throw new Error(`VIP task series with id ${seriesId} not found`);
  }

  const updatedSeries = {
    ...series,
    ...updates,
    updatedAt: new Date()
  };

  // Convert taskIds to string for database storage
  const dbSeries = {
    ...updatedSeries,
    taskIds: Array.isArray(updatedSeries.taskIds) ? JSON.stringify(updatedSeries.taskIds) : updatedSeries.taskIds
  };

  // 更新数据库
  await db.vipTaskSeries.update(seriesId, dbSeries);

  // 添加到同步队列
  await addSyncItem('vipTaskSeries', 'update', dbSeries);

  return updatedSeries;
}

/**
 * 向VIP任务系列添加任务
 * @param seriesId 系列ID
 * @param taskData 任务数据
 * @returns 添加的任务
 */
export async function addTaskToVipSeries(
  seriesId: number,
  taskData: Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'type'>
): Promise<TaskRecord> {
  const series = await getVipTaskSeries(seriesId);
  if (!series) {
    throw new Error(`VIP task series with id ${seriesId} not found`);
  }

  // 创建VIP任务
  const taskId = await createTask({
    ...taskData,
    type: TaskType.VIP
  });

  // 获取创建的任务
  const task = await db.tasks.get(taskId);
  if (!task) {
    throw new Error(`Failed to get created task with id ${taskId}`);
  }

  // 更新系列的任务ID列表
  const updatedTaskIds = [...series.taskIds, taskId];
  await updateVipTaskSeries(seriesId, { taskIds: updatedTaskIds });

  return task;
}

/**
 * 检查VIP任务系列是否已完成
 * @param seriesId 系列ID
 * @returns 是否已完成
 */
export async function checkVipTaskSeriesCompletion(seriesId: number): Promise<boolean> {
  const tasks = await getVipTaskSeriesTasks(seriesId);

  // 如果没有任务，则系列未完成
  if (tasks.length === 0) {
    return false;
  }

  // 检查所有任务是否都已完成
  const allCompleted = tasks.every(task => task.status === TaskStatus.COMPLETED);

  // 如果所有任务都已完成，更新系列状态
  if (allCompleted) {
    const now = new Date();
    await updateVipTaskSeries(seriesId, {
      isCompleted: true,
      completedAt: now
    });
  }

  return allCompleted;
}

/**
 * 初始化默认VIP任务系列
 */
export async function initializeVipTaskSeries(): Promise<void> {
  try {
    // 检查是否已经初始化
    const existingSeries = await getAllVipTaskSeries();
    if (existingSeries.length > 0) {
      return;
    }

    // 获取任务类别
    const categories = await getAllTaskCategories();
    const getCategoryId = (name: string) => {
      const category = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
      return category?.id || categories[0].id;
    };

    // 创建默认VIP任务系列
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30天后结束

    // 创建生产力提升系列
    const productivitySeries = await createVipTaskSeries({
      type: VipTaskSeriesType.DAILY,
      title: '生产力提升大师',
      description: '完成这个系列的任务，掌握高效工作的技巧，提升您的生产力',
      iconPath: '/assets/vip/productivity-icon.svg',
      isActive: true,
      startDate: now,
      endDate
    });

    // 添加生产力系列任务
    await addTaskToVipSeries(productivitySeries.id!, {
      title: '制定每周计划',
      description: '花30分钟制定下周的详细计划，包括工作任务、个人目标和休息时间',
      categoryId: getCategoryId('Personal') as number,
      priority: TaskPriority.HIGH,
      estimatedMinutes: 30
    });

    await addTaskToVipSeries(productivitySeries.id!, {
      title: '学习时间管理技巧',
      description: '阅读或观看关于时间管理的资料，学习至少3个新技巧',
      categoryId: getCategoryId('Learning') as number,
      priority: TaskPriority.MEDIUM,
      estimatedMinutes: 60
    });

    await addTaskToVipSeries(productivitySeries.id!, {
      title: '实践番茄工作法',
      description: '使用番茄工作法完成一天的工作，每25分钟工作后休息5分钟',
      categoryId: getCategoryId('Work') as number,
      priority: TaskPriority.MEDIUM,
      estimatedMinutes: 240
    });

    // 创建健康与幸福系列
    const wellnessSeries = await createVipTaskSeries({
      type: VipTaskSeriesType.WEEKLY,
      title: '健康生活方式',
      description: '通过这个系列的任务，培养健康的生活习惯，提升身心健康',
      iconPath: '/assets/vip/wellness-icon.svg',
      isActive: true,
      startDate: now,
      endDate
    });

    // 添加健康系列任务
    await addTaskToVipSeries(wellnessSeries.id!, {
      title: '制定健康饮食计划',
      description: '规划一周的健康饮食，包括每日所需的蛋白质、碳水化合物和脂肪',
      categoryId: getCategoryId('Health') as number,
      priority: TaskPriority.HIGH,
      estimatedMinutes: 45
    });

    await addTaskToVipSeries(wellnessSeries.id!, {
      title: '完成30分钟有氧运动',
      description: '进行30分钟的有氧运动，如跑步、游泳或骑自行车',
      categoryId: getCategoryId('Health') as number,
      priority: TaskPriority.MEDIUM,
      estimatedMinutes: 30
    });

    await addTaskToVipSeries(wellnessSeries.id!, {
      title: '练习15分钟冥想',
      description: '花15分钟进行冥想练习，专注于呼吸和当下',
      categoryId: getCategoryId('Health') as number,
      priority: TaskPriority.LOW,
      estimatedMinutes: 15
    });

    console.log('VIP task series initialized successfully');
  } catch (error) {
    console.error('Failed to initialize VIP task series:', error);
  }
}
