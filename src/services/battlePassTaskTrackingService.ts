// src/services/battlePassTaskTrackingService.ts
import { db } from '@/db-old';
import {
  getBattlePassViewData,
  addBattlePassExperience
} from './battlePassService';
import { BattlePassTaskRecord, BattlePassTaskType } from '@/types/battle-pass';
import { playSound, SoundType } from '@/utils/sound';

// Define the types of game actions that can be tracked
export enum GameActionType {
  COMPLETE_TASK = 'complete_task',
  COMPLETE_DAILY_TASK = 'complete_daily_task',
  COMPLETE_CHALLENGE = 'complete_challenge',
  LOG_MOOD = 'log_mood',
  FEED_PANDA = 'feed_panda',
  CLAIM_DAILY_REWARD = 'claim_daily_reward',
  PANDA_LEVEL_UP = 'panda_level_up',
  UNLOCK_ABILITY = 'unlock_ability'
}

// Interface for task progress tracking
interface TaskProgressRecord {
  userId: string;
  taskId: number;
  currentValue: number;
  lastUpdated: string;
  isCompleted: boolean;
}

// Map to store task progress in memory
const taskProgressMap = new Map<string, TaskProgressRecord>();

/**
 * Initialize the Battle Pass task tracking system
 * This should be called when the app starts
 *
 * @param userId - The ID of the user to initialize tracking for
 * @returns A promise that resolves when initialization is complete
 */
export async function initializeBattlePassTaskTracking(userId: string): Promise<void> {
  try {
    console.log('Initializing Battle Pass task tracking...');

    // Get active Battle Pass
    const battlePassData = await getBattlePassViewData(userId);
    if (!battlePassData || !battlePassData.pass) {
      console.log('No active Battle Pass found');
      return;
    }

    // Get all tasks for the active Battle Pass
    const tasks = battlePassData.activeTasks || [];

    // Initialize progress tracking for each task
    for (const task of tasks) {
      const key = `${userId}_${task.id}`;

      // Check if we already have progress for this task
      const existingProgress = await db.table('battlePassTaskProgress')
        .where('userId')
        .equals(userId)
        .and(item => item.taskId === task.id)
        .first();

      if (existingProgress) {
        // Store in memory map
        taskProgressMap.set(key, existingProgress);
      } else {
        // Create new progress record
        const newProgress: TaskProgressRecord = {
          userId,
          taskId: task.id!,
          currentValue: 0,
          lastUpdated: new Date().toISOString(),
          isCompleted: false
        };

        // Add to database
        await db.table('battlePassTaskProgress').add(newProgress);

        // Store in memory map
        taskProgressMap.set(key, newProgress);
      }
    }

    console.log(`Initialized tracking for ${tasks.length} Battle Pass tasks`);
  } catch (error) {
    console.error('Failed to initialize Battle Pass task tracking:', error);
  }
}

/**
 * Track a game action and update related Battle Pass tasks
 * This function finds all tasks related to the given action type and updates their progress
 *
 * @param userId - The ID of the user performing the action
 * @param actionType - The type of game action being performed
 * @param value - The value to increment the task progress by (default: 1)
 * @returns A promise that resolves when the tracking is complete
 */
export async function trackGameAction(
  userId: string,
  actionType: GameActionType,
  value: number = 1
): Promise<void> {
  try {
    // Get active Battle Pass
    const battlePassData = await getBattlePassViewData(userId);
    if (!battlePassData || !battlePassData.pass) {
      return;
    }

    const passId = battlePassData.pass.id!;
    const tasks = battlePassData.activeTasks || [];

    // Find tasks related to this action
    const relatedTasks = tasks.filter(task =>
      task.relatedGameActionKey === actionType && !task.isCompleted
    );

    if (relatedTasks.length === 0) {
      return;
    }

    // Update progress for each related task
    for (const task of relatedTasks) {
      await updateTaskProgress(userId, task, value, passId);
    }
  } catch (error) {
    console.error(`Failed to track game action ${actionType}:`, error);
  }
}

/**
 * Update progress for a specific task
 * This function updates the progress of a task and awards experience points if the task is completed
 *
 * @param userId - The ID of the user
 * @param task - The task record to update
 * @param incrementValue - The value to increment the task progress by
 * @param passId - The ID of the Battle Pass
 * @returns A promise that resolves when the update is complete
 */
async function updateTaskProgress(
  userId: string,
  task: BattlePassTaskRecord,
  incrementValue: number,
  passId: number
): Promise<void> {
  try {
    const key = `${userId}_${task.id}`;
    let progress = taskProgressMap.get(key);

    if (!progress) {
      // Create new progress record if it doesn't exist
      progress = {
        userId,
        taskId: task.id!,
        currentValue: 0,
        lastUpdated: new Date().toISOString(),
        isCompleted: false
      };
      taskProgressMap.set(key, progress);
      await db.table('battlePassTaskProgress').add(progress);
    }

    // Skip if task is already completed
    if (progress.isCompleted) {
      return;
    }

    // Update progress
    const newValue = progress.currentValue + incrementValue;
    progress.currentValue = newValue;
    progress.lastUpdated = new Date().toISOString();

    // Check if task is completed
    if (newValue >= task.targetValue) {
      progress.isCompleted = true;

      // Award experience points
      await addBattlePassExperience(userId, passId, task.expReward);

      // Play sound effect
      playSound(SoundType.COMPLETE);

      // Show notification
      showTaskCompletionNotification(task);

      // If task is repeatable, reset progress after a delay
      if (task.isRepeatable) {
        // For daily tasks, reset at midnight
        if (task.taskType === BattlePassTaskType.DAILY) {
          scheduleTaskReset(userId, task.id!, 'daily');
        }
        // For weekly tasks, reset on Sunday midnight
        else if (task.taskType === BattlePassTaskType.WEEKLY) {
          scheduleTaskReset(userId, task.id!, 'weekly');
        }
      }
    }

    // Update in database
    await db.table('battlePassTaskProgress')
      .where('userId')
      .equals(userId)
      .and(item => item.taskId === task.id)
      .modify({
        currentValue: progress.currentValue,
        lastUpdated: progress.lastUpdated,
        isCompleted: progress.isCompleted
      });

  } catch (error) {
    console.error(`Failed to update task progress for task ${task.id}:`, error);
  }
}

/**
 * Schedule a task to be reset
 */
function scheduleTaskReset(userId: string, taskId: number, resetType: 'daily' | 'weekly'): void {
  // Calculate reset time
  const now = new Date();
  const resetTime = new Date(now);

  // Reset at midnight
  resetTime.setHours(24, 0, 0, 0);

  // For weekly tasks, set to next Sunday
  if (resetType === 'weekly') {
    const daysUntilSunday = 7 - resetTime.getDay();
    resetTime.setDate(resetTime.getDate() + daysUntilSunday);
  }

  // Calculate delay in milliseconds
  const delay = resetTime.getTime() - now.getTime();

  // Schedule reset
  setTimeout(() => {
    resetTask(userId, taskId);
  }, delay);
}

/**
 * Reset a task's progress
 */
async function resetTask(userId: string, taskId: number): Promise<void> {
  try {
    const key = `${userId}_${taskId}`;
    const progress = taskProgressMap.get(key);

    if (progress) {
      // Reset progress
      progress.currentValue = 0;
      progress.isCompleted = false;
      progress.lastUpdated = new Date().toISOString();

      // Update in database
      await db.table('battlePassTaskProgress')
        .where('userId')
        .equals(userId)
        .and(item => item.taskId === taskId)
        .modify({
          currentValue: 0,
          isCompleted: false,
          lastUpdated: progress.lastUpdated
        });
    }
  } catch (error) {
    console.error(`Failed to reset task ${taskId}:`, error);
  }
}

/**
 * Show a notification when a task is completed
 */
function showTaskCompletionNotification(task: BattlePassTaskRecord): void {
  // This would be implemented with a notification system
  // For now, just log to console
  console.log(`Task completed: ${task.taskName} (+${task.expReward} XP)`);

  // In a real app, you would show a toast or notification
  // Example:
  // showToast({
  //   title: 'Battle Pass Task Completed!',
  //   message: `${task.taskName} (+${task.expReward} XP)`,
  //   type: 'success',
  //   duration: 3000
  // });
}

/**
 * Get current progress for a specific task
 * This function retrieves the current progress of a task for a user
 *
 * @param userId - The ID of the user
 * @param taskId - The ID of the task
 * @returns A promise that resolves to an object containing the current progress, target value, and completion status
 */
export async function getTaskProgress(
  userId: string,
  taskId: number
): Promise<{ currentValue: number; targetValue: number; isCompleted: boolean }> {
  try {
    const key = `${userId}_${taskId}`;
    const progress = taskProgressMap.get(key);

    if (progress) {
      // Get the task to get the target value
      const task = await db.table('battlePassTasks').get(taskId);

      return {
        currentValue: progress.currentValue,
        targetValue: task ? task.targetValue : 0,
        isCompleted: progress.isCompleted
      };
    }

    return { currentValue: 0, targetValue: 0, isCompleted: false };
  } catch (error) {
    console.error(`Failed to get progress for task ${taskId}:`, error);
    return { currentValue: 0, targetValue: 0, isCompleted: false };
  }
}
