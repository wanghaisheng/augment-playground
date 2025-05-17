// src/services/taskCategoryService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { TaskCategoryRecord } from './taskService';

/**
 * 获取任务类别
 * @param id 类别ID
 * @returns 任务类别记录
 */
export async function getTaskCategory(id: number): Promise<TaskCategoryRecord | undefined> {
  return db.taskCategories.get(id);
}

/**
 * 获取所有任务类别
 * @returns 任务类别记录列表
 */
export async function getAllTaskCategories(): Promise<TaskCategoryRecord[]> {
  return db.taskCategories.toArray();
}

/**
 * 创建新的任务类别
 * @param category 任务类别数据
 * @returns 新创建的类别ID
 */
export async function createTaskCategory(
  category: Omit<TaskCategoryRecord, 'id' | 'createdAt'>
): Promise<number> {
  const now = new Date();
  const newCategory = {
    ...category,
    createdAt: now
  };
  
  // 添加到数据库
  const id = await db.taskCategories.add(newCategory);
  
  // 添加同步项目
  await addSyncItem('taskCategories', 'create', { ...newCategory, id });
  
  return id as number;
}

/**
 * 更新任务类别
 * @param id 类别ID
 * @param updates 更新数据
 */
export async function updateTaskCategory(
  id: number, 
  updates: Partial<Omit<TaskCategoryRecord, 'id' | 'createdAt'>>
): Promise<void> {
  const category = await db.taskCategories.get(id);
  if (!category) {
    throw new Error(`Task category with id ${id} not found`);
  }
  
  const updatedCategory = {
    ...category,
    ...updates
  };
  
  // 更新数据库
  await db.taskCategories.update(id, updatedCategory);
  
  // 添加同步项目
  await addSyncItem('taskCategories', 'update', updatedCategory);
}

/**
 * 删除任务类别
 * @param id 类别ID
 */
export async function deleteTaskCategory(id: number): Promise<void> {
  const category = await db.taskCategories.get(id);
  if (!category) {
    throw new Error(`Task category with id ${id} not found`);
  }
  
  // 检查是否为默认类别
  if (category.isDefault) {
    throw new Error('Cannot delete default task category');
  }
  
  // 从数据库中删除
  await db.taskCategories.delete(id);
  
  // 添加同步项目
  await addSyncItem('taskCategories', 'delete', category);
}

/**
 * 获取默认任务类别
 * @returns 默认任务类别
 */
export async function getDefaultTaskCategory(): Promise<TaskCategoryRecord | undefined> {
  return db.taskCategories.where('isDefault').equals(true).first();
}
