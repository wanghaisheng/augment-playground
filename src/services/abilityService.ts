// src/services/abilityService.ts
import { db } from '@/db-old';
import {
  AbilityType,
  PandaAbilityRecord,
  initializePandaAbilities,
  getAllPandaAbilities
} from './pandaAbilityService';

/**
 * Unlock a specific ability by key
 * @param abilityKey The key of the ability to unlock (e.g., 'focus_boost')
 * @param abilityType The type of the ability (passive, active, ultimate)
 */
export async function unlockAbility(abilityKey: string, abilityType: AbilityType): Promise<PandaAbilityRecord | null> {
  try {
    // Ensure abilities are initialized
    await initializePandaAbilities();

    // Get all abilities
    const abilities = await getAllPandaAbilities();

    // Find the ability by key and type
    // Note: In a real implementation, we would have a more robust way to find abilities by key
    // For now, we'll use a simple name-based approach
    const abilityToUnlock = abilities.find(ability => {
      const nameLower = ability.name.toLowerCase();
      const keyParts = abilityKey.split('_');

      // Check if all parts of the key are in the name
      return keyParts.every(part => nameLower.includes(part)) && ability.type === abilityType;
    });

    if (!abilityToUnlock) {
      console.warn(`No ability found with key ${abilityKey} and type ${abilityType}`);
      return null;
    }

    // Unlock the ability
    const now = new Date();
    const updatedAbility = {
      ...abilityToUnlock,
      isUnlocked: true,
      unlockDate: now
    };

    await db.table('abilities').update(abilityToUnlock.id!, updatedAbility);
    return updatedAbility;
  } catch (error) {
    console.error(`Error unlocking ability ${abilityKey}:`, error);
    return null;
  }
}

/**
 * Get all unlocked abilities
 */
export async function getUnlockedAbilities(): Promise<PandaAbilityRecord[]> {
  try {
    // Ensure abilities are initialized
    await initializePandaAbilities();

    // Get all abilities and filter for unlocked ones
    const abilities = await getAllPandaAbilities();
    return abilities.filter(ability => ability.isUnlocked);
  } catch (error) {
    console.error('Error getting unlocked abilities:', error);
    return [];
  }
}

/**
 * Get abilities by type
 * @param type The type of abilities to get
 */
export async function getAbilitiesByType(type: AbilityType): Promise<PandaAbilityRecord[]> {
  try {
    // Ensure abilities are initialized
    await initializePandaAbilities();

    // Get all abilities and filter by type
    const abilities = await getAllPandaAbilities();
    return abilities.filter(ability => ability.type === type);
  } catch (error) {
    console.error(`Error getting abilities of type ${type}:`, error);
    return [];
  }
}

/**
 * Get ability by ID
 * @param id The ID of the ability to get
 */
export async function getAbilityById(id: number): Promise<PandaAbilityRecord | undefined> {
  try {
    return await db.table('abilities').get(id);
  } catch (error) {
    console.error(`Error getting ability with ID ${id}:`, error);
    return undefined;
  }
}

/**
 * 获取在特定等级范围内解锁的能力
 * @param previousLevel 之前的等级
 * @param newLevel 新的等级
 * @returns 新解锁的能力数组
 */
export async function getNewlyUnlockedAbilities(
  previousLevel: number,
  newLevel: number
): Promise<Array<{id: number; name: string; description: string}>> {
  try {
    // 确保能力已初始化
    await initializePandaAbilities();

    // 获取所有能力
    const abilities = await getAllPandaAbilities();

    // 定义每个等级解锁的能力
    const levelAbilityMap: Record<number, Array<{id: number; name: string; description: string}>> = {
      2: [
        {
          id: 1,
          name: '专注提升',
          description: '提高专注度，使任务完成效率提升10%'
        }
      ],
      3: [
        {
          id: 2,
          name: '竹子加速',
          description: '增加竹子收集速度，每日竹子上限提高15%'
        }
      ],
      5: [
        {
          id: 3,
          name: '冥想大师',
          description: '冥想效果提升30%，恢复精力速度加快'
        }
      ],
      7: [
        {
          id: 4,
          name: '时间掌控',
          description: '任务时间管理能力提升，任务完成时间减少15%'
        }
      ],
      10: [
        {
          id: 5,
          name: '熊猫智慧',
          description: '解锁特殊能力：每周可以重置一次失败的挑战'
        }
      ]
    };

    // 收集在这个等级范围内解锁的所有能力
    const newlyUnlockedAbilities: Array<{id: number; name: string; description: string}> = [];

    // 检查每个等级是否有新解锁的能力
    for (let level = previousLevel + 1; level <= newLevel; level++) {
      if (levelAbilityMap[level]) {
        newlyUnlockedAbilities.push(...levelAbilityMap[level]);

        // 在数据库中标记这些能力为已解锁
        for (const ability of levelAbilityMap[level]) {
          const dbAbility = abilities.find(a => a.id === ability.id);
          if (dbAbility && !dbAbility.isUnlocked) {
            await db.table('abilities').update(dbAbility.id!, {
              ...dbAbility,
              isUnlocked: true,
              unlockDate: new Date()
            });
          }
        }
      }
    }

    return newlyUnlockedAbilities;
  } catch (error) {
    console.error('Error getting unlocked abilities for level range:', error);
    return [];
  }
}
