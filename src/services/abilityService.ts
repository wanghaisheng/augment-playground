// src/services/abilityService.ts
import { db } from '@/db';
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
