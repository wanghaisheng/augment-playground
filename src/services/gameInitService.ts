// src/services/gameInitService.ts
import { db } from '@/db';
import { generateTestChallengeData } from './challengeService';
import { initializeTimelyRewards, addLuckyPoints } from './timelyRewardService';
import { recordMood, MoodType } from './reflectionService';
import { createTask, TaskStatus, TaskPriority, TaskCategory, TaskType } from './taskService';
import { updatePandaState, PandaState } from './pandaStateService';
import { generateRewards, RewardRarity, RewardType } from './rewardService';
import { unlockAbility } from './abilityService';
import { AbilityType } from './pandaAbilityService';

/**
 * Initialize game data
 * Creates sample data for all game systems
 */
export async function initializeGameData(): Promise<void> {
  try {
    console.log('Starting game data initialization...');

    // Initialize challenges
    await generateTestChallengeData();

    // Initialize timely rewards
    await initializeTimelyRewards();

    // Add some lucky points
    await addLuckyPoints(50, 'Game initialization');

    // Record initial mood
    await recordMood({
      userId: 'current-user',
      mood: 'content',
      intensity: 3,
      note: 'Starting my productivity journey'
    });

    // Create some initial tasks
    await createInitialTasks();

    // Initialize panda state
    await updatePandaState({
      mood: 'content',
      energy: 80 as any, // Type assertion to handle number vs enum
      level: 1,
      experience: 0,
      name: 'Bamboo',
      outfit: 'default',
      accessories: [],
      isVip: false // Initialize with non-VIP status
    });

    // Generate some initial rewards
    await generateInitialRewards();

    // Unlock initial abilities
    await unlockInitialAbilities();

    console.log('Game data initialization completed successfully');
  } catch (error) {
    console.error('Error initializing game data:', error);
  }
}

/**
 * Create initial tasks
 */
async function createInitialTasks(): Promise<void> {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Get category IDs
  const categories = await db.table('taskCategories').toArray();
  const getCategoryId = (name: string) => {
    const category = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    return category ? category.id : 1; // Default to first category if not found
  };

  const tasks = [
    {
      title: 'Set up daily routine',
      description: 'Create a structured daily routine to improve productivity',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      categoryId: getCategoryId('Personal'),
      type: TaskType.DAILY,
      dueDate: tomorrow,
      estimatedMinutes: 30,
      tags: ['planning', 'productivity']
    },
    {
      title: 'Complete project proposal',
      description: 'Finish the draft proposal for the new project',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      categoryId: getCategoryId('Work'),
      type: TaskType.MAIN,
      dueDate: nextWeek,
      estimatedMinutes: 120,
      tags: ['work', 'project']
    },
    {
      title: 'Morning meditation',
      description: 'Practice mindfulness meditation for 10 minutes',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.MEDIUM,
      categoryId: getCategoryId('Health'),
      type: TaskType.DAILY,
      completedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      estimatedMinutes: 10,
      tags: ['health', 'mindfulness']
    },
    {
      title: 'Weekly grocery shopping',
      description: 'Buy groceries for the week',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      categoryId: getCategoryId('Errands'),
      type: TaskType.SIDE,
      dueDate: tomorrow,
      estimatedMinutes: 60,
      tags: ['shopping', 'food']
    }
  ];

  for (const task of tasks) {
    await createTask(task);
  }
}

/**
 * Generate initial rewards
 */
async function generateInitialRewards(): Promise<void> {
  // Generate some common rewards
  await generateRewards(2, RewardRarity.COMMON, RewardType.ITEM);

  // Generate an uncommon reward
  await generateRewards(1, RewardRarity.UNCOMMON, RewardType.CURRENCY);
}

/**
 * Unlock initial abilities
 */
async function unlockInitialAbilities(): Promise<void> {
  // Unlock basic abilities
  await unlockAbility('focus_boost', AbilityType.PASSIVE);
  await unlockAbility('quick_start', AbilityType.ACTIVE);
}
