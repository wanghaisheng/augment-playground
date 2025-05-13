// src/services/taskReminderService.ts
import { db } from '@/db';
import { addSyncItem } from './dataSyncService';
import { TaskRecord, getTask, getAllTasks, TaskStatus } from './taskService';

// 任务提醒记录类型
export interface TaskReminderRecord {
  id?: number;
  taskId: number;
  userId: string;
  reminderTime: Date;
  isViewed: boolean;
  isCompleted: boolean;
  createdAt: Date;
  message?: string;
}

// 提醒类型
export enum ReminderType {
  DUE_SOON = 'due_soon',      // 即将到期
  OVERDUE = 'overdue',        // 已过期
  SCHEDULED = 'scheduled',    // 计划提醒
  CUSTOM = 'custom'           // 自定义提醒
}

/**
 * 创建任务提醒
 * @param taskId 任务ID
 * @param reminderTime 提醒时间
 * @param message 自定义消息（可选）
 */
export async function createTaskReminder(
  taskId: number,
  reminderTime: Date,
  message?: string
): Promise<TaskReminderRecord> {
  const now = new Date();

  // 获取当前用户ID（在实际应用中，这应该从用户会话中获取）
  const userId = 'current-user';

  const reminder: TaskReminderRecord = {
    taskId,
    userId,
    reminderTime,
    isViewed: false,
    isCompleted: false,
    createdAt: now,
    message
  };

  // 添加到数据库
  const id = await db.table('taskReminders').add(reminder);
  const createdReminder = { ...reminder, id: id as number };

  // 添加到同步队列
  await addSyncItem('taskReminders', 'create', createdReminder);

  return createdReminder;
}

/**
 * 获取任务的提醒
 * @param taskId 任务ID
 */
export async function getTaskReminders(taskId: number): Promise<TaskReminderRecord[]> {
  return db.table('taskReminders')
    .where('taskId')
    .equals(taskId)
    .toArray();
}

/**
 * 获取用户的未查看提醒
 * @param userId 用户ID
 */
export async function getUnviewedReminders(userId: string): Promise<TaskReminderRecord[]> {
  return db.table('taskReminders')
    .where('userId')
    .equals(userId)
    .and(reminder => !reminder.isViewed)
    .toArray();
}

/**
 * 获取用户的活跃提醒（未查看且未完成）
 * @param userId 用户ID
 */
export async function getActiveReminders(userId: string): Promise<TaskReminderRecord[]> {
  return db.table('taskReminders')
    .where('userId')
    .equals(userId)
    .and(reminder => !reminder.isViewed && !reminder.isCompleted)
    .toArray();
}

/**
 * 标记提醒为已查看
 * @param id 提醒ID
 */
export async function markReminderAsViewed(id: number): Promise<TaskReminderRecord> {
  const reminder = await db.table('taskReminders').get(id);
  if (!reminder) {
    throw new Error(`Reminder with id ${id} not found`);
  }

  const updatedReminder = {
    ...reminder,
    isViewed: true
  };

  // 更新数据库
  await db.table('taskReminders').update(id, updatedReminder);

  // 添加到同步队列
  await addSyncItem('taskReminders', 'update', updatedReminder);

  return updatedReminder;
}

/**
 * 标记提醒为已完成
 * @param id 提醒ID
 */
export async function markReminderAsCompleted(id: number): Promise<TaskReminderRecord> {
  const reminder = await db.table('taskReminders').get(id);
  if (!reminder) {
    throw new Error(`Reminder with id ${id} not found`);
  }

  const updatedReminder = {
    ...reminder,
    isViewed: true,
    isCompleted: true
  };

  // 更新数据库
  await db.table('taskReminders').update(id, updatedReminder);

  // 添加到同步队列
  await addSyncItem('taskReminders', 'update', updatedReminder);

  return updatedReminder;
}

/**
 * 删除提醒
 * @param id 提醒ID
 */
export async function deleteReminder(id: number): Promise<void> {
  // 检查提醒是否存在
  const reminder = await db.table('taskReminders').get(id);
  if (!reminder) {
    throw new Error(`Reminder with id ${id} not found`);
  }

  // 从数据库中删除
  await db.table('taskReminders').delete(id);

  // 添加到同步队列
  await addSyncItem('taskReminders', 'delete', { id });
}

/**
 * 为即将到期的任务创建提醒
 * 检查未完成的任务，如果任务即将到期（24小时内），创建提醒
 */
export async function checkDueSoonTasks(): Promise<void> {
  // 获取当前用户ID（在实际应用中，这应该从用户会话中获取）
  const userId = 'current-user';

  // 获取所有未完成的任务
  const tasks = await getAllTasks({ status: TaskStatus.TODO });

  // 当前时间
  const now = new Date();

  // 24小时后
  const tomorrow = new Date(now);
  tomorrow.setHours(tomorrow.getHours() + 24);

  // 检查每个任务
  for (const task of tasks) {
    // 如果任务有截止日期且在24小时内
    if (task.dueDate && new Date(task.dueDate) <= tomorrow && new Date(task.dueDate) > now) {
      // 检查是否已经有提醒
      const reminders = await getTaskReminders(task.id!);
      const hasDueSoonReminder = reminders.some(r =>
        r.message?.includes('即将到期') ||
        (r.reminderTime >= now && r.reminderTime <= tomorrow)
      );

      // 如果没有提醒，创建一个
      if (!hasDueSoonReminder) {
        await createTaskReminder(
          task.id!,
          new Date(task.dueDate),
          `任务"${task.title}"即将到期，请尽快完成。`
        );
      }
    }
  }
}

/**
 * 为已过期的任务创建提醒
 * 检查未完成的任务，如果任务已过期，创建提醒
 */
export async function checkOverdueTasks(): Promise<void> {
  // 获取当前用户ID（在实际应用中，这应该从用户会话中获取）
  const userId = 'current-user';

  // 获取所有未完成的任务
  const tasks = await getAllTasks({ status: TaskStatus.TODO });

  // 当前时间
  const now = new Date();

  // 检查每个任务
  for (const task of tasks) {
    // 如果任务有截止日期且已过期
    if (task.dueDate && new Date(task.dueDate) < now) {
      // 检查是否已经有提醒
      const reminders = await getTaskReminders(task.id!);
      const hasOverdueReminder = reminders.some(r =>
        r.message?.includes('已过期') &&
        new Date(r.createdAt) > new Date(task.dueDate!)
      );

      // 如果没有提醒，创建一个
      if (!hasOverdueReminder) {
        await createTaskReminder(
          task.id!,
          now,
          `任务"${task.title}"已过期，请及时处理。`
        );
      }
    }
  }
}

/**
 * 为计划任务创建提醒
 * @param taskId 任务ID
 * @param reminderTime 提醒时间
 */
export async function scheduleTaskReminder(
  taskId: number,
  reminderTime: Date
): Promise<TaskReminderRecord> {
  // 获取任务
  const task = await getTask(taskId);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }

  // 创建提醒
  return createTaskReminder(
    taskId,
    reminderTime,
    `计划提醒：任务"${task.title}"需要处理。`
  );
}

/**
 * 创建自定义提醒
 * @param taskId 任务ID
 * @param reminderTime 提醒时间
 * @param message 自定义消息
 */
export async function createCustomReminder(
  taskId: number,
  reminderTime: Date,
  message: string
): Promise<TaskReminderRecord> {
  return createTaskReminder(taskId, reminderTime, message);
}
