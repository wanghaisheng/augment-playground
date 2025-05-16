// src/db-battle-pass-sample.ts
import { db } from './db-old';
// import { tursoClient } from './db-turso'; // Removed unused import
import {
  BattlePassRecord,
  BattlePassLevelRecord,
  BattlePassTaskRecord,
  BattlePassTaskType
} from './types/battle-pass';

/**
 * Populate the database with sample Battle Pass data
 * This function creates a sample Battle Pass season with levels, tasks, and rewards
 *
 * @returns A promise that resolves to true if data population is successful, false otherwise
 */
export async function populateBattlePassSampleData(): Promise<boolean> {
  try {
    // Check if Battle Pass data already exists
    const existingPasses = await db.table('battlePasses').count();
    if (existingPasses > 0) {
      console.log('Battle Pass sample data already exists');
      return true;
    }

    console.log('Populating Battle Pass sample data...');

    // Create a sample Battle Pass season
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 30); // 30-day season

    const battlePass: BattlePassRecord = {
      id: 0,
      seasonName: 'Bamboo Forest Season',
      seasonDescription: 'Explore the mystical bamboo forest and discover ancient secrets',
      startDate: startDate,
      endDate: endDate,
      maxLevel: 30,
      themeVisualAssetKey: 'bamboo-forest-theme',
      seasonTheme: 'bamboo_season_1',
      standardPassProductId: 'com.pandahabit.battlepass.standard',
      premiumPassProductId: 'com.pandahabit.battlepass.premium',
      levelPurchaseDiamondCost: 100,
      isActive: true
    };

    // Add Battle Pass to database
    const passId = await db.table('battlePasses').add(battlePass);
    console.log(`Created Battle Pass with ID: ${passId}`);

    // Create Battle Pass levels
    const levels: BattlePassLevelRecord[] = [];
    for (let i = 1; i <= 30; i++) {
      const level: BattlePassLevelRecord = {
        id: i,
        passId: passId as number,
        levelNumber: i,
        requiredExp: i * 100, // Increasing XP requirements per level
        freeRewardItemId: i % 5 === 0 ? 1001 : 1000, // Special reward every 5 levels
        freeRewardQuantity: i % 5 === 0 ? 5 : 1,
        paidRewardItemId: i % 5 === 0 ? 2001 : 2000, // Premium reward every 5 levels
        paidRewardQuantity: i % 5 === 0 ? 10 : 2
      };
      levels.push(level);
    }

    // Add levels to database
    await db.table('battlePassLevels').bulkAdd(levels);
    console.log(`Created ${levels.length} Battle Pass levels`);

    // Create Battle Pass tasks
    const tasks: BattlePassTaskRecord[] = [
      // Daily tasks
      {
        id: 1,
        passId: passId as number,
        taskName: 'Complete 3 daily tasks',
        taskType: BattlePassTaskType.DAILY,
        targetValue: 3,
        expReward: 50,
        relatedGameActionKey: 'complete_daily_task',
        isRepeatable: true
      },
      {
        id: 2,
        passId: passId as number,
        taskName: 'Log your mood',
        taskType: BattlePassTaskType.DAILY,
        targetValue: 1,
        expReward: 30,
        relatedGameActionKey: 'log_mood',
        isRepeatable: true
      },
      {
        id: 3,
        passId: passId as number,
        taskName: 'Feed your panda',
        taskType: BattlePassTaskType.DAILY,
        targetValue: 1,
        expReward: 20,
        relatedGameActionKey: 'feed_panda',
        isRepeatable: true
      },

      // Weekly tasks
      {
        id: 4,
        passId: passId as number,
        taskName: 'Complete 15 tasks',
        taskType: BattlePassTaskType.WEEKLY,
        targetValue: 15,
        expReward: 150,
        relatedGameActionKey: 'complete_task',
        isRepeatable: true
      },
      {
        id: 5,
        passId: passId as number,
        taskName: 'Complete 3 challenges',
        taskType: BattlePassTaskType.WEEKLY,
        targetValue: 3,
        expReward: 200,
        relatedGameActionKey: 'complete_challenge',
        isRepeatable: true
      },
      {
        id: 6,
        passId: passId as number,
        taskName: 'Claim 7 daily rewards',
        taskType: BattlePassTaskType.WEEKLY,
        targetValue: 7,
        expReward: 100,
        relatedGameActionKey: 'claim_daily_reward',
        isRepeatable: true
      },

      // Seasonal tasks
      {
        id: 7,
        passId: passId as number,
        taskName: 'Reach level 10 with your panda',
        taskType: BattlePassTaskType.SEASONAL,
        targetValue: 10,
        expReward: 500,
        relatedGameActionKey: 'panda_level_up',
        isRepeatable: false
      },
      {
        id: 8,
        passId: passId as number,
        taskName: 'Complete 50 tasks',
        taskType: BattlePassTaskType.SEASONAL,
        targetValue: 50,
        expReward: 300,
        relatedGameActionKey: 'complete_task',
        isRepeatable: false
      },
      {
        id: 9,
        passId: passId as number,
        taskName: 'Unlock 5 abilities',
        taskType: BattlePassTaskType.SEASONAL,
        targetValue: 5,
        expReward: 400,
        relatedGameActionKey: 'unlock_ability',
        isRepeatable: false
      }
    ];

    // Add tasks to database
    await db.table('battlePassTasks').bulkAdd(tasks);
    console.log(`Created ${tasks.length} Battle Pass tasks`);

    // Create sample items for rewards if they don't exist
    const existingItems = await db.table('items').count();
    if (existingItems === 0) {
      const items = [
        // Free track rewards
        {
          id: 1000,
          name: 'Bamboo',
          description: 'Fresh bamboo for your panda',
          type: 'resource',
          rarity: 'common',
          iconAssetKey: 'bamboo-icon'
        },
        {
          id: 1001,
          name: 'Jade Coins',
          description: 'Premium currency',
          type: 'currency',
          rarity: 'rare',
          iconAssetKey: 'jade-coin-icon'
        },

        // Premium track rewards
        {
          id: 2000,
          name: 'Premium Bamboo',
          description: 'High-quality bamboo for your panda',
          type: 'resource',
          rarity: 'uncommon',
          iconAssetKey: 'premium-bamboo-icon'
        },
        {
          id: 2001,
          name: 'Panda Accessory',
          description: 'Decorative item for your panda',
          type: 'accessory',
          rarity: 'epic',
          iconAssetKey: 'panda-accessory-icon'
        }
      ];

      await db.table('items').bulkAdd(items);
      console.log(`Created ${items.length} items for Battle Pass rewards`);
    }

    console.log('Battle Pass sample data populated successfully');
    return true;
  } catch (error) {
    console.error('Failed to populate Battle Pass sample data:', error);
    return false;
  }
}
