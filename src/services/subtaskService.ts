// src/services/subtaskService.ts
import { db } from '@/db';
import { addSyncItem } from './dataSyncService';
import { TaskRecord, TaskStatus, updateTask } from './taskService';

// 子任务记录类型
export interface SubtaskRecord {
  id?: number;
  parentTaskId: number;
  title: string;
  description?: string;
  status: TaskStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

/**
 * 创建子任务
 * @param subtask 子任务数据
 */
export async function createSubtask(
  subtask: Omit<SubtaskRecord, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'order'>
): Promise<SubtaskRecord> {
  // 获取父任务
  const parentTask = await db.table('tasks').get(subtask.parentTaskId);
  if (!parentTask) {
    throw new Error(`Parent task with id ${subtask.parentTaskId} not found`);
  }

  // 获取当前子任务数量，用于设置顺序
  const existingSubtasks = await getSubtasks(subtask.parentTaskId);
  const order = existingSubtasks.length;

  const now = new Date();
  const newSubtask: SubtaskRecord = {
    ...subtask,
    status: TaskStatus.TODO,
    order,
    createdAt: now,
    updatedAt: now
  };

  // 添加子任务到数据库
  const id = await db.table('subtasks').add(newSubtask);
  const createdSubtask = { ...newSubtask, id: id as number };

  // 添加到同步队列
  await addSyncItem('subtasks', 'create', createdSubtask);

  return createdSubtask;
}

/**
 * 获取任务的所有子任务
 * @param parentTaskId 父任务ID
 */
export async function getSubtasks(parentTaskId: number): Promise<SubtaskRecord[]> {
  return db.table('subtasks')
    .where('parentTaskId')
    .equals(parentTaskId)
    .sortBy('order');
}

/**
 * 更新子任务
 * @param id 子任务ID
 * @param updates 更新数据
 */
export async function updateSubtask(
  id: number,
  updates: Partial<Omit<SubtaskRecord, 'id' | 'parentTaskId' | 'createdAt'>>
): Promise<SubtaskRecord> {
  const subtask = await db.table('subtasks').get(id);
  if (!subtask) {
    throw new Error(`Subtask with id ${id} not found`);
  }

  const updatedSubtask = {
    ...subtask,
    ...updates,
    updatedAt: new Date()
  };

  // 更新数据库
  await db.table('subtasks').update(id, updatedSubtask);

  // 添加到同步队列
  await addSyncItem('subtasks', 'update', updatedSubtask);

  // 如果状态变为已完成，更新完成时间
  if (updates.status === TaskStatus.COMPLETED && !updatedSubtask.completedAt) {
    updatedSubtask.completedAt = new Date();
    await db.table('subtasks').update(id, { completedAt: updatedSubtask.completedAt });
  }

  // 更新父任务进度
  await updateParentTaskProgress(subtask.parentTaskId);

  return updatedSubtask;
}

/**
 * 完成子任务
 * @param id 子任务ID
 */
export async function completeSubtask(id: number): Promise<SubtaskRecord> {
  return updateSubtask(id, {
    status: TaskStatus.COMPLETED,
    completedAt: new Date()
  });
}

/**
 * 删除子任务
 * @param id 子任务ID
 */
export async function deleteSubtask(id: number): Promise<void> {
  const subtask = await db.table('subtasks').get(id);
  if (!subtask) {
    throw new Error(`Subtask with id ${id} not found`);
  }

  // 删除子任务
  await db.table('subtasks').delete(id);

  // 添加到同步队列
  await addSyncItem('subtasks', 'delete', { id });

  // 更新父任务进度
  await updateParentTaskProgress(subtask.parentTaskId);

  // 重新排序剩余子任务
  const remainingSubtasks = await getSubtasks(subtask.parentTaskId);
  for (let i = 0; i < remainingSubtasks.length; i++) {
    if (remainingSubtasks[i].order !== i) {
      await updateSubtask(remainingSubtasks[i].id!, { order: i });
    }
  }
}

/**
 * 更新子任务顺序
 * @param id 子任务ID
 * @param newOrder 新顺序
 */
export async function updateSubtaskOrder(id: number, newOrder: number): Promise<void> {
  const subtask = await db.table('subtasks').get(id);
  if (!subtask) {
    throw new Error(`Subtask with id ${id} not found`);
  }

  const oldOrder = subtask.order;
  if (oldOrder === newOrder) {
    return; // 顺序没有变化
  }

  // 获取所有同级子任务
  const siblingSubtasks = await getSubtasks(subtask.parentTaskId);

  // 更新受影响的子任务顺序
  for (const sibling of siblingSubtasks) {
    if (sibling.id === id) {
      // 更新当前子任务的顺序
      await updateSubtask(id, { order: newOrder });
    } else if (
      (oldOrder < newOrder && sibling.order > oldOrder && sibling.order <= newOrder) ||
      (oldOrder > newOrder && sibling.order >= newOrder && sibling.order < oldOrder)
    ) {
      // 更新受影响的其他子任务顺序
      const newSiblingOrder = oldOrder < newOrder
        ? sibling.order - 1 // 向上移动时，中间的子任务顺序减1
        : sibling.order + 1; // 向下移动时，中间的子任务顺序加1
      await updateSubtask(sibling.id!, { order: newSiblingOrder });
    }
  }
}

/**
 * 更新父任务进度
 * @param parentTaskId 父任务ID
 */
export async function updateParentTaskProgress(parentTaskId: number): Promise<void> {
  const subtasks = await getSubtasks(parentTaskId);
  if (subtasks.length === 0) {
    return;
  }

  // 计算完成的子任务数量
  const completedCount = subtasks.filter(
    subtask => subtask.status === TaskStatus.COMPLETED
  ).length;

  // 计算进度百分比
  const progressPercentage = Math.round((completedCount / subtasks.length) * 100);

  // 如果所有子任务都完成，将父任务标记为已完成
  if (completedCount === subtasks.length) {
    await updateTask(parentTaskId, {
      status: TaskStatus.COMPLETED,
      completedAt: new Date()
    });
  } else if (completedCount > 0) {
    // 如果有部分子任务完成，将父任务标记为进行中
    await updateTask(parentTaskId, {
      status: TaskStatus.IN_PROGRESS
    });
  }
}

/**
 * 将任务转换为带有子任务的任务
 * @param taskId 任务ID
 * @param subtaskTitles 子任务标题列表
 */
export async function convertTaskToParentTask(
  taskId: number,
  subtaskTitles: string[]
): Promise<SubtaskRecord[]> {
  const task = await db.table('tasks').get(taskId);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }

  const createdSubtasks: SubtaskRecord[] = [];

  // 创建子任务
  for (let i = 0; i < subtaskTitles.length; i++) {
    const subtask = await createSubtask({
      parentTaskId: taskId,
      title: subtaskTitles[i]
    });
    createdSubtasks.push(subtask);
  }

  // 将父任务状态更新为进行中
  await updateTask(taskId, {
    status: TaskStatus.IN_PROGRESS
  });

  return createdSubtasks;
}

/**
 * 检查任务是否有子任务
 * @param taskId 任务ID
 */
export async function hasSubtasks(taskId: number): Promise<boolean> {
  const count = await db.table('subtasks')
    .where('parentTaskId')
    .equals(taskId)
    .count();
  return count > 0;
}
