// src/services/battlePassService.ts
import { db } from '@/db-old';
// import { tursoClient } from '@/db-turso'; // Removed
import { addSyncItem } from './dataSyncService';
import { addItem } from './rewardService';
import { getUserCurrency, updateUserCurrency } from './storeService';
import {
  BattlePassRecord,
  BattlePassLevelRecord,
  BattlePassTaskRecord,
  BattlePassTaskType,
  UserBattlePassOwnershipRecord,
  UserBattlePassProgressRecord,
  BattlePassType,
  BattlePassLevelWithRewards,
  BattlePassViewData,
  BattlePassLevelReward
} from '@/types/battle-pass';
import { triggerDataRefresh } from '@/hooks/useDataRefresh';

/**
 * Get the active Battle Pass
 */
export async function getActiveBattlePass(): Promise<BattlePassRecord | null> {
  try {
    // const now = new Date().toISOString(); // Removed
    const passes = await db.table('battlePasses')
      .where('isActive')
      .equals(1)
      .and(item => {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        const currentDate = new Date();
        return currentDate >= startDate && currentDate <= endDate;
      })
      .toArray();

    return passes.length > 0 ? passes[0] : null;
  } catch (error) {
    console.error('Failed to get active Battle Pass:', error);
    return null;
  }
}

/**
 * Get Battle Pass by ID
 */
export async function getBattlePassById(passId: number): Promise<BattlePassRecord | null> {
  try {
    return await db.table('battlePasses').get(passId);
  } catch (error) {
    console.error(`Failed to get Battle Pass with ID ${passId}:`, error);
    return null;
  }
}

/**
 * Get Battle Pass levels for a specific pass
 */
export async function getBattlePassLevels(passId: number): Promise<BattlePassLevelRecord[]> {
  try {
    return await db.table('battlePassLevels')
      .where('passId')
      .equals(passId)
      .sortBy('levelNumber');
  } catch (error) {
    console.error(`Failed to get levels for Battle Pass ${passId}:`, error);
    return [];
  }
}

/**
 * Get Battle Pass tasks for a specific pass
 */
export async function getBattlePassTasks(
  passId: number,
  taskType?: BattlePassTaskType
): Promise<BattlePassTaskRecord[]> {
  try {
    let query = db.table('battlePassTasks').where('passId').equals(passId);

    if (taskType) {
      query = query.and(item => item.taskType === taskType);
    }

    return await query.toArray();
  } catch (error) {
    console.error(`Failed to get tasks for Battle Pass ${passId}:`, error);
    return [];
  }
}

/**
 * Get user's Battle Pass ownership
 */
export async function getUserBattlePassOwnership(
  userId: string,
  passId: number
): Promise<UserBattlePassOwnershipRecord | null> {
  try {
    const ownerships = await db.table('userBattlePassOwnership')
      .where('userId')
      .equals(userId)
      .and(item => item.passId === passId)
      .toArray();

    return ownerships.length > 0 ? ownerships[0] : null;
  } catch (error) {
    console.error(`Failed to get ownership for user ${userId} and pass ${passId}:`, error);
    return null;
  }
}

/**
 * Get user's Battle Pass progress
 */
export async function getUserBattlePassProgress(
  userId: string,
  passId: number
): Promise<UserBattlePassProgressRecord | null> {
  try {
    const progresses = await db.table('userBattlePassProgress')
      .where('userId')
      .equals(userId)
      .and(item => item.passId === passId)
      .toArray();

    return progresses.length > 0 ? progresses[0] : null;
  } catch (error) {
    console.error(`Failed to get progress for user ${userId} and pass ${passId}:`, error);
    return null;
  }
}

/**
 * Purchase a Battle Pass
 */
export async function purchaseBattlePass(
  userId: string,
  passId: number,
  passType: BattlePassType,
  platformTransactionId?: string
): Promise<UserBattlePassOwnershipRecord | null> {
  try {
    // Get the Battle Pass
    const pass = await getBattlePassById(passId);
    if (!pass) {
      throw new Error(`Battle Pass with ID ${passId} not found`);
    }

    // Check if user already owns this pass
    const existingOwnership = await getUserBattlePassOwnership(userId, passId);
    if (existingOwnership) {
      // If upgrading from standard to premium, update the record
      if (existingOwnership.passType === BattlePassType.STANDARD &&
          passType === BattlePassType.PREMIUM) {
        const updatedOwnership = {
          ...existingOwnership,
          passType: BattlePassType.PREMIUM,
          purchaseDate: new Date().toISOString()
        };

        await db.table('userBattlePassOwnership').update(existingOwnership.id!, updatedOwnership);
        await addSyncItem('userBattlePassOwnership', 'update', updatedOwnership);

        return updatedOwnership;
      }

      // Otherwise, user already owns this pass
      return existingOwnership;
    }

    // Create new ownership record
    const newOwnership: Omit<UserBattlePassOwnershipRecord, 'id'> = {
      userId,
      passId,
      purchaseDate: new Date().toISOString(),
      platformTransactionId: platformTransactionId || '',
      passType
    };

    // Add to database
    const id = await db.table('userBattlePassOwnership').add(newOwnership);
    const createdOwnership = { ...newOwnership, id: id as number };

    // Add to sync queue
    await addSyncItem('userBattlePassOwnership', 'create', createdOwnership);

    // Create progress record if it doesn't exist
    const progress = await ensureUserBattlePassProgress(userId, passId);

    // If premium pass, automatically advance 10 levels
    if (passType === BattlePassType.PREMIUM) {
      // Get the Battle Pass to check max level
      const pass = await getBattlePassById(passId);
      if (pass) {
        // Calculate target level (current + 10, but not exceeding max)
        const targetLevel = Math.min(progress.currentLevel + 10, pass.maxLevel);

        // Only proceed if we need to level up
        if (targetLevel > progress.currentLevel) {
          console.log(`Advancing user ${userId} from level ${progress.currentLevel} to ${targetLevel} for premium pass purchase`);

          // Get Battle Pass levels to determine required XP
          const levels = await getBattlePassLevels(passId);

          // Calculate total XP needed to reach target level
          let totalExpNeeded = 0;
          for (let level = progress.currentLevel; level < targetLevel; level++) {
            const levelData = levels.find(l => l.levelNumber === level + 1);
            if (levelData) {
              totalExpNeeded += levelData.requiredExp;
            }
          }

          // Add the XP to advance to target level
          if (totalExpNeeded > 0) {
            await addBattlePassExperience(userId, passId, totalExpNeeded);
          }
        }
      }
    }

    return createdOwnership;
  } catch (error) {
    console.error(`Failed to purchase Battle Pass ${passId} for user ${userId}:`, error);
    return null;
  }
}

/**
 * Ensure user has a Battle Pass progress record
 */
export async function ensureUserBattlePassProgress(
  userId: string,
  passId: number
): Promise<UserBattlePassProgressRecord> {
  try {
    // Check if progress record exists
    const existingProgress = await getUserBattlePassProgress(userId, passId);
    if (existingProgress) {
      return existingProgress;
    }

    // Create new progress record
    const newProgress: Omit<UserBattlePassProgressRecord, 'id'> = {
      userId,
      passId,
      currentLevel: 1,
      currentExp: 0,
      claimedFreeLevels: [],
      claimedPaidLevels: []
    };

    // Add to database
    const id = await db.table('userBattlePassProgress').add(newProgress);
    const createdProgress = { ...newProgress, id: id as number };

    // Add to sync queue
    await addSyncItem('userBattlePassProgress', 'create', createdProgress);

    return createdProgress;
  } catch (error) {
    console.error(`Failed to ensure progress for user ${userId} and pass ${passId}:`, error);
    throw error;
  }
}

/**
 * Add experience to user's Battle Pass progress
 */
export async function addBattlePassExperience(
  userId: string,
  passId: number,
  expAmount: number
): Promise<UserBattlePassProgressRecord | null> {
  try {
    // Get user's progress
    let progress = await getUserBattlePassProgress(userId, passId);
    if (!progress) {
      progress = await ensureUserBattlePassProgress(userId, passId);
    }

    // Get Battle Pass levels to determine level-up thresholds
    const levels = await getBattlePassLevels(passId);
    if (levels.length === 0) {
      throw new Error(`No levels found for Battle Pass ${passId}`);
    }

    // Get the Battle Pass to check max level
    const pass = await getBattlePassById(passId);
    if (!pass) {
      throw new Error(`Battle Pass with ID ${passId} not found`);
    }

    // Add experience and check for level up
    let newExp = progress.currentExp + expAmount;
    let newLevel = progress.currentLevel;

    // Check if user should level up
    while (newLevel < pass.maxLevel) {
      const nextLevelData = levels.find(level => level.levelNumber === newLevel + 1);
      if (!nextLevelData) break;

      if (newExp >= nextLevelData.requiredExp) {
        newExp -= nextLevelData.requiredExp;
        newLevel++;
      } else {
        break;
      }
    }

    // If at max level, cap the experience
    if (newLevel >= pass.maxLevel) {
      newLevel = pass.maxLevel;
      newExp = 0;
    }

    // Update progress
    const updatedProgress: UserBattlePassProgressRecord = {
      ...progress,
      currentLevel: newLevel,
      currentExp: newExp
    };

    await db.table('userBattlePassProgress').update(progress.id!, updatedProgress);
    await addSyncItem('userBattlePassProgress', 'update', updatedProgress);

    return updatedProgress;
  } catch (error) {
    console.error(`Failed to add experience for user ${userId} and pass ${passId}:`, error);
    return null;
  }
}

/**
 * Claim a Battle Pass level reward
 */
export async function claimBattlePassReward(
  userId: string,
  passId: number,
  levelNumber: number,
  rewardType: 'free' | 'paid'
): Promise<boolean> {
  try {
    // Get user's progress
    const progress = await getUserBattlePassProgress(userId, passId);
    if (!progress) {
      throw new Error(`No progress found for user ${userId} and pass ${passId}`);
    }

    // Check if user has reached this level
    if (progress.currentLevel < levelNumber) {
      throw new Error(`User ${userId} has not reached level ${levelNumber} yet`);
    }

    // Get the claimed levels
    const claimedFreeLevels = progress.claimedFreeLevels || [];
    const claimedPaidLevels = progress.claimedPaidLevels || [];

    // Check if level has already been claimed
    if (rewardType === 'free' && claimedFreeLevels.includes(levelNumber)) {
      throw new Error(`Free reward for level ${levelNumber} has already been claimed`);
    }
    if (rewardType === 'paid' && claimedPaidLevels.includes(levelNumber)) {
      throw new Error(`Paid reward for level ${levelNumber} has already been claimed`);
    }

    // If claiming paid reward, check if user owns the pass
    if (rewardType === 'paid') {
      const ownership = await getUserBattlePassOwnership(userId, passId);
      if (!ownership) {
        throw new Error(`User ${userId} does not own Battle Pass ${passId}`);
      }
    }

    // Get the level data
    const levels = await getBattlePassLevels(passId);
    const levelData = levels.find(level => level.levelNumber === levelNumber);
    if (!levelData) {
      throw new Error(`Level ${levelNumber} not found for Battle Pass ${passId}`);
    }

    // Get the reward data
    const rewardItemId = rewardType === 'free' ? levelData.freeRewardItemId : levelData.paidRewardItemId;
    const rewardQuantity = rewardType === 'free' ? levelData.freeRewardQuantity : levelData.paidRewardQuantity;

    if (!rewardItemId || !rewardQuantity) {
      throw new Error(`No ${rewardType} reward found for level ${levelNumber}`);
    }

    // Add the reward to user's inventory
    await addItem({
      type: 'item', // Placeholder type
      name: `Level ${levelNumber} Reward`,
      description: `Reward from Battle Pass level ${levelNumber}`,
      rarity: 'common',
      iconPath: '/assets/rewards/default.svg',
      quantity: rewardQuantity,
      isUsable: true,
      obtainedAt: new Date()
    });

    // Update claimed levels
    const updatedProgress = {
      ...progress,
      claimedFreeLevels: rewardType === 'free'
        ? [...claimedFreeLevels, levelNumber]
        : claimedFreeLevels,
      claimedPaidLevels: rewardType === 'paid'
        ? [...claimedPaidLevels, levelNumber]
        : claimedPaidLevels
    };

    await db.table('userBattlePassProgress').update(progress.id!, updatedProgress);
    await addSyncItem('userBattlePassProgress', 'update', updatedProgress);

    return true;
  } catch (error) {
    console.error(`Failed to claim ${rewardType} reward for user ${userId}, pass ${passId}, level ${levelNumber}:`, error);
    return false;
  }
}

/**
 * Get complete Battle Pass view data
 *
 * @param userId - The ID of the user
 * @param passId - Optional ID of the Battle Pass to get. If not provided, gets the active pass.
 * @returns A promise that resolves to the Battle Pass view data or null if no pass is found
 */
export async function getBattlePassViewData(
  userId: string,
  passId?: number
): Promise<BattlePassViewData | null> {
  try {
    // Get active pass if passId not provided
    let pass: BattlePassRecord | null = null;
    if (passId) {
      pass = await getBattlePassById(passId);
    } else {
      pass = await getActiveBattlePass();
    }

    if (!pass) {
      return null;
    }

    // Get levels, user progress, and ownership
    const levels = await getBattlePassLevels(pass.id!);
    const userProgress = await getUserBattlePassProgress(userId, pass.id!);
    const userOwnership = await getUserBattlePassOwnership(userId, pass.id!);

    // Get active tasks
    const activeTasks = await getBattlePassTasks(pass.id!);

    // Fetch item details for rewards
    const levelsWithRewards: BattlePassLevelWithRewards[] = await Promise.all(
      levels.map(async (level) => {
        // Get free reward details
        let freeReward: BattlePassLevelReward | undefined;
        if (level.freeRewardItemId && level.freeRewardQuantity) {
          const itemDetails = await getItemDetails(level.freeRewardItemId);
          if (itemDetails) {
            freeReward = {
              itemId: level.freeRewardItemId,
              quantity: level.freeRewardQuantity,
              itemName: itemDetails.name,
              itemDescription: itemDetails.description || '',
              itemType: itemDetails.type,
              itemRarity: itemDetails.rarity,
              iconAssetKey: itemDetails.iconAssetKey || ''
            };
          }
        }

        // Get paid reward details
        let paidReward: BattlePassLevelReward | undefined;
        if (level.paidRewardItemId && level.paidRewardQuantity) {
          const itemDetails = await getItemDetails(level.paidRewardItemId);
          if (itemDetails) {
            paidReward = {
              itemId: level.paidRewardItemId,
              quantity: level.paidRewardQuantity,
              itemName: itemDetails.name,
              itemDescription: itemDetails.description || '',
              itemType: itemDetails.type,
              itemRarity: itemDetails.rarity,
              iconAssetKey: itemDetails.iconAssetKey || ''
            };
          }
        }

        // Ensure both rewards are defined
        if (!freeReward || !paidReward) {
          throw new Error(`Missing rewards for level ${level.levelNumber}`);
        }

        return {
          ...level,
          freeReward,
          paidReward
        };
      })
    );

    return {
      pass,
      levels: levelsWithRewards,
      userProgress: userProgress || {
        id: 0,
        userId,
        passId: pass.id!,
        currentLevel: 1,
        currentExp: 0,
        claimedFreeLevels: [],
        claimedPaidLevels: []
      },
      userOwnership: userOwnership || {
        id: 0,
        userId,
        passId: pass.id!,
        purchaseDate: new Date().toISOString(),
        platformTransactionId: '',
        passType: BattlePassType.STANDARD
      },
      activeTasks
    };
  } catch (error) {
    console.error('Failed to get Battle Pass view data:', error);
    return null;
  }
}

/**
 * Purchase Battle Pass levels with diamonds
 *
 * @param userId - The ID of the user purchasing levels
 * @param passId - The ID of the Battle Pass
 * @param levelsToPurchase - The number of levels to purchase
 * @returns A promise that resolves to true if purchase is successful, false otherwise
 */
export async function purchaseBattlePassLevels(
  userId: string,
  passId: number,
  levelsToPurchase: number
): Promise<boolean> {
  try {
    // Get the Battle Pass
    const pass = await getBattlePassById(passId);
    if (!pass) {
      throw new Error(`Battle Pass with ID ${passId} not found`);
    }

    // Check if user has progress for this pass
    let progress = await getUserBattlePassProgress(userId, passId);
    if (!progress) {
      progress = await ensureUserBattlePassProgress(userId, passId);
    }

    // Calculate target level (current + purchased, but not exceeding max)
    const targetLevel = Math.min(progress.currentLevel + levelsToPurchase, pass.maxLevel);

    // Only proceed if we need to level up
    if (targetLevel <= progress.currentLevel) {
      throw new Error(`User ${userId} is already at or above the target level ${targetLevel}`);
    }

    // Calculate diamond cost
    const diamondCost = levelsToPurchase * pass.levelPurchaseDiamondCost;

    // Check if user has enough jade
    const userCurrency = await getUserCurrency(userId);
    if (!userCurrency || userCurrency.jade < diamondCost) {
      throw new Error('Insufficient jade');
    }

    // Deduct jade
    await updateUserCurrency(userId, 0, -diamondCost, 0);

    // Get Battle Pass levels to determine required XP
    const levels = await getBattlePassLevels(passId);

    // Calculate total XP needed to reach target level
    let totalExpNeeded = 0;
    for (let level = progress.currentLevel; level < targetLevel; level++) {
      const levelData = levels.find(l => l.levelNumber === level + 1);
      if (levelData) {
        totalExpNeeded += levelData.requiredExp;
      }
    }

    // Add the XP to advance to target level
    if (totalExpNeeded > 0) {
      await addBattlePassExperience(userId, passId, totalExpNeeded);
    }

    // Trigger data refresh
    triggerDataRefresh('battlePass');

    return true;
  } catch (error) {
    console.error(`Failed to purchase levels for user ${userId} and pass ${passId}:`, error);
    return false;
  }
}

/**
 * Get item details from the database
 *
 * @param itemId - The ID of the item to get
 * @returns A promise that resolves to the item details or null if not found
 */
async function getItemDetails(itemId: number): Promise<{
  name: string;
  description?: string;
  type: string;
  rarity: string;
  iconAssetKey?: string;
} | null> {
  try {
    const item = await db.table('items').get(itemId);
    if (!item) {
      return null;
    }

    return {
      name: item.name,
      description: item.description,
      type: item.type,
      rarity: item.rarity,
      iconAssetKey: item.iconAssetKey
    };
  } catch (error) {
    console.error(`Failed to get item details for item ${itemId}:`, error);
    return null;
  }
}
