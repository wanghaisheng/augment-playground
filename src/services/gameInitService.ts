// src/services/gameInitService.ts
import { db } from '@/db-old';
import { generateTestChallengeData } from './challengeService';
import { initializeTimelyRewards, addLuckyPoints } from './timelyRewardService';
import { recordMood } from './reflectionService';
import { createTask, TaskStatus, TaskPriority, TaskType } from './taskService';
import { updatePandaState } from './pandaStateService';
import { generateRewards, RewardRarity } from './rewardService';
import { unlockAbility } from './abilityService';
import { AbilityType } from './pandaAbilityService';
import { teaRoomLabels } from '@/data/teaRoomLabels';
import { homeLabels } from '@/data/homeLabels';

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
      mood: 'normal',
      intensity: 3,
      note: 'Starting my productivity journey'
    });

    // Create some initial tasks
    await createInitialTasks();

    // Initialize panda state
    await updatePandaState({
      mood: 'normal',
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

    // Initialize Tea Room labels
    await initializeTeaRoomLabels();

    // Initialize Home labels
    await initializeHomeLabels();

    console.log('Game data initialization completed successfully');
  } catch (error) {
    console.error('Error initializing game data:', error);
  }
}

/**
 * Initialize Tea Room labels
 */
async function initializeTeaRoomLabels(): Promise<void> {
  console.log('Initializing Tea Room labels...');

  // Check if labels already exist
  const existingLabels = await db.uiLabels
    .where('scopeKey').equals('teaRoomView')
    .and(label => label.labelKey === 'enhancedReflectionModule.title')
    .count();

  if (existingLabels > 0) {
    console.log('Tea Room labels already exist, skipping initialization');
    return;
  }

  // Add all Tea Room labels
  await db.uiLabels.bulkAdd(teaRoomLabels);

  console.log('Tea Room labels initialized successfully');
}

/**
 * Initialize Home labels
 */
async function initializeHomeLabels(): Promise<void> {
  console.log('Initializing Home labels...');

  // Check if labels already exist
  const existingLabels = await db.uiLabels
    .where('scopeKey').equals('homeView')
    .and(label => label.labelKey === 'initializeGameText')
    .count();

  if (existingLabels > 0) {
    console.log('Home labels already exist, skipping initialization');
    return;
  }

  // Add all Home labels
  await db.uiLabels.bulkAdd(homeLabels);

  console.log('Home labels initialized successfully');
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
  await generateRewards(2, RewardRarity.COMMON);

  // Generate an uncommon reward
  await generateRewards(1, RewardRarity.UNCOMMON);
}

/**
 * Unlock initial abilities
 */
async function unlockInitialAbilities(): Promise<void> {
  // Unlock basic abilities
  await unlockAbility('focus_boost', AbilityType.PASSIVE);
  await unlockAbility('quick_start', AbilityType.ACTIVE);
}
