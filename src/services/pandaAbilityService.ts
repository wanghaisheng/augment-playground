// src/services/pandaAbilityService.ts
import { db } from '@/db-old';
import { RewardRarity } from './rewardService';

// Panda ability type enum
export enum AbilityType {
  PASSIVE = 'passive',   // Passive ability (permanent effect)
  ACTIVE = 'active',     // Active ability (needs activation)
  ULTIMATE = 'ultimate'  // Ultimate ability (powerful but with cooldown)
}

// Panda ability effect type enum
export enum AbilityEffectType {
  EXPERIENCE_BOOST = 'experience_boost',       // Experience boost
  ENERGY_BOOST = 'energy_boost',               // Energy boost
  TASK_EFFICIENCY = 'task_efficiency',         // Task efficiency boost
  REWARD_BOOST = 'reward_boost',               // Reward boost
  MOOD_STABILIZER = 'mood_stabilizer',         // Mood stabilizer
  TIME_EXTENSION = 'time_extension',           // Time extension
  FOCUS_ENHANCEMENT = 'focus_enhancement',     // Focus enhancement
  INSPIRATION = 'inspiration',                 // Inspiration
  RESILIENCE = 'resilience',                   // Resilience
  WISDOM = 'wisdom'                            // Wisdom
}

// Panda ability record type
export interface PandaAbilityRecord {
  id?: number;
  name: string;
  description: string;
  type: AbilityType;
  effectType: AbilityEffectType;
  effectValue: number;
  iconPath: string;
  rarity: RewardRarity;
  requiredLevel: number;
  isUnlocked: boolean;
  isActive: boolean;
  cooldownMinutes?: number;
  lastUsedAt?: Date;
  unlockDate?: Date;
}

// Predefined panda abilities list
const PREDEFINED_ABILITIES: PandaAbilityRecord[] = [
  // Passive abilities - Basic
  {
    name: 'Bamboo Heart',
    description: 'Passive: Increases experience gained from completing tasks by 10%',
    type: AbilityType.PASSIVE,
    effectType: AbilityEffectType.EXPERIENCE_BOOST,
    effectValue: 0.1,
    iconPath: '/assets/abilities/bamboo-heart.svg',
    rarity: RewardRarity.COMMON,
    requiredLevel: 2,
    isUnlocked: false,
    isActive: false
  },
  {
    name: 'Panda Vitality',
    description: 'Passive: Increases panda energy recovery rate by 15%',
    type: AbilityType.PASSIVE,
    effectType: AbilityEffectType.ENERGY_BOOST,
    effectValue: 0.15,
    iconPath: '/assets/abilities/panda-vitality.svg',
    rarity: RewardRarity.COMMON,
    requiredLevel: 3,
    isUnlocked: false,
    isActive: false
  },

  // Active abilities - Intermediate
  {
    name: 'Bamboo Focus',
    description: 'Active: When activated, increases experience gained from completing tasks by 25% for 1 hour',
    type: AbilityType.ACTIVE,
    effectType: AbilityEffectType.FOCUS_ENHANCEMENT,
    effectValue: 0.25,
    iconPath: '/assets/abilities/bamboo-focus.svg',
    rarity: RewardRarity.UNCOMMON,
    requiredLevel: 5,
    isUnlocked: false,
    isActive: false,
    cooldownMinutes: 120
  },
  {
    name: 'Panda Wisdom',
    description: 'Active: When activated, increases rewards from completed tasks by 20% for 2 hours',
    type: AbilityType.ACTIVE,
    effectType: AbilityEffectType.REWARD_BOOST,
    effectValue: 0.2,
    iconPath: '/assets/abilities/panda-wisdom.svg',
    rarity: RewardRarity.UNCOMMON,
    requiredLevel: 7,
    isUnlocked: false,
    isActive: false,
    cooldownMinutes: 240
  },

  // Ultimate abilities - Advanced
  {
    name: 'Bamboo Master',
    description: 'Ultimate: When activated, increases all ability effects by 50% for 4 hours',
    type: AbilityType.ULTIMATE,
    effectType: AbilityEffectType.WISDOM,
    effectValue: 0.5,
    iconPath: '/assets/abilities/bamboo-master.svg',
    rarity: RewardRarity.RARE,
    requiredLevel: 10,
    isUnlocked: false,
    isActive: false,
    cooldownMinutes: 1440 // 24 hours
  }
];

/**
 * Initialize panda abilities system
 * If there are no ability records in the database, add predefined abilities
 */
export async function initializePandaAbilities(): Promise<void> {
  const abilities = await db.table('abilities').toArray();

  if (abilities.length === 0) {
    await db.table('abilities').bulkAdd(PREDEFINED_ABILITIES);
  }
}

/**
 * Get all panda abilities
 */
export async function getAllPandaAbilities(): Promise<PandaAbilityRecord[]> {
  return db.table('abilities').toArray();
}

/**
 * Get unlocked panda abilities
 */
export async function getUnlockedPandaAbilities(): Promise<PandaAbilityRecord[]> {
  try {
    // Check if table exists
    if (!db.tables.some(table => table.name === 'abilities')) {
      console.warn('abilities table does not exist yet');
      // Initialize abilities system
      await initializePandaAbilities();
    }

    // Try to get all abilities, then filter in memory
    try {
      const allAbilities = await db.table('abilities').toArray();
      // Ensure the result is an array and each element has the correct properties
      return allAbilities
        .filter(ability => ability && typeof ability === 'object')
        .filter(ability => ability.isUnlocked === true);
    } catch (err) {
      console.error('Error querying unlocked abilities:', err);
      // If query fails, return empty array
      return [];
    }
  } catch (err) {
    console.error('Error in getUnlockedPandaAbilities:', err);
    return [];
  }
}

/**
 * Get available panda abilities (unlocked and not on cooldown)
 */
export async function getAvailablePandaAbilities(): Promise<PandaAbilityRecord[]> {
  const now = new Date();
  const unlockedAbilities = await getUnlockedPandaAbilities();

  return unlockedAbilities.filter(ability => {
    // Passive abilities are always available
    if (ability.type === AbilityType.PASSIVE) {
      return true;
    }

    // Active or ultimate abilities need to check cooldown time
    if (ability.lastUsedAt && ability.cooldownMinutes) {
      const cooldownEndTime = new Date(ability.lastUsedAt);
      cooldownEndTime.setMinutes(cooldownEndTime.getMinutes() + ability.cooldownMinutes);

      return now >= cooldownEndTime;
    }

    return true;
  });
}

/**
 * Check and unlock panda abilities
 * Unlock abilities based on the current panda level
 * @param currentLevel Current panda level
 */
export async function checkAndUnlockAbilities(currentLevel: number): Promise<PandaAbilityRecord[]> {
  const abilities = await getAllPandaAbilities();
  const newlyUnlocked: PandaAbilityRecord[] = [];

  for (const ability of abilities) {
    if (!ability.isUnlocked && ability.requiredLevel <= currentLevel) {
      // Unlock ability
      const now = new Date();
      await db.table('abilities').update(ability.id!, {
        isUnlocked: true,
        unlockDate: now
      });

      // Add to newly unlocked list
      newlyUnlocked.push({
        ...ability,
        isUnlocked: true,
        unlockDate: now
      });
    }
  }

  return newlyUnlocked;
}

/**
 * Activate panda ability
 * @param abilityId ID of the ability to activate
 */
export async function activateAbility(abilityId: number): Promise<PandaAbilityRecord> {
  const ability = await db.table('abilities').get(abilityId);

  if (!ability) {
    throw new Error(`Ability with id ${abilityId} not found`);
  }

  if (!ability.isUnlocked) {
    throw new Error(`Ability with id ${abilityId} is not unlocked yet`);
  }

  // Passive abilities don't need activation
  if (ability.type === AbilityType.PASSIVE) {
    return ability;
  }

  // Check cooldown time
  if (ability.lastUsedAt && ability.cooldownMinutes) {
    const now = new Date();
    const cooldownEndTime = new Date(ability.lastUsedAt);
    cooldownEndTime.setMinutes(cooldownEndTime.getMinutes() + ability.cooldownMinutes);

    if (now < cooldownEndTime) {
      throw new Error(`Ability with id ${abilityId} is still in cooldown`);
    }
  }

  // Activate ability
  const now = new Date();
  const updatedAbility = {
    ...ability,
    isActive: true,
    lastUsedAt: now
  };

  await db.table('abilities').update(abilityId, updatedAbility);
  return updatedAbility;
}

/**
 * Get ability effect description
 * @param effectType Ability effect type
 */
export function getAbilityEffectDescription(effectType: AbilityEffectType): string {
  switch (effectType) {
    case AbilityEffectType.EXPERIENCE_BOOST:
      return 'Experience Boost';
    case AbilityEffectType.ENERGY_BOOST:
      return 'Energy Boost';
    case AbilityEffectType.TASK_EFFICIENCY:
      return 'Task Efficiency Boost';
    case AbilityEffectType.REWARD_BOOST:
      return 'Reward Boost';
    case AbilityEffectType.MOOD_STABILIZER:
      return 'Mood Stabilizer';
    case AbilityEffectType.TIME_EXTENSION:
      return 'Time Extension';
    case AbilityEffectType.FOCUS_ENHANCEMENT:
      return 'Focus Enhancement';
    case AbilityEffectType.INSPIRATION:
      return 'Inspiration';
    case AbilityEffectType.RESILIENCE:
      return 'Resilience';
    case AbilityEffectType.WISDOM:
      return 'Wisdom';
    default:
      return 'Unknown Effect';
  }
}

/**
 * Get localized ability name
 * @param abilityKey The key of the ability (e.g., 'bambooHeart')
 * @param defaultName Default name to use if localized name is not found
 */
export async function getLocalizedAbilityName(abilityKey: string, defaultName: string): Promise<string> {
  const languageCode = localStorage.getItem('language') || 'en';
  try {
    // Query the database directly
    const label = await db.table('uiLabels')
      .where('[scopeKey+labelKey+languageCode]')
      .equals(['abilities', `${abilityKey}.name`, languageCode])
      .first();

    return label ? label.translatedText : defaultName;
  } catch (error) {
    console.error(`Error getting localized name for ability ${abilityKey}:`, error);
    return defaultName;
  }
}

/**
 * Get localized ability description
 * @param abilityKey The key of the ability (e.g., 'bambooHeart')
 * @param defaultDescription Default description to use if localized description is not found
 */
export async function getLocalizedAbilityDescription(abilityKey: string, defaultDescription: string): Promise<string> {
  const languageCode = localStorage.getItem('language') || 'en';
  try {
    // Query the database directly
    const label = await db.table('uiLabels')
      .where('[scopeKey+labelKey+languageCode]')
      .equals(['abilities', `${abilityKey}.description`, languageCode])
      .first();

    return label ? label.translatedText : defaultDescription;
  } catch (error) {
    console.error(`Error getting localized description for ability ${abilityKey}:`, error);
    return defaultDescription;
  }
}

/**
 * Get ability key from name
 * @param name The name of the ability
 */
export function getAbilityKeyFromName(name: string): string {
  const nameMap: Record<string, string> = {
    'Bamboo Heart': 'bambooHeart',
    'Panda Vitality': 'pandaVitality',
    'Bamboo Focus': 'bambooFocus',
    'Panda Wisdom': 'pandaWisdom',
    'Bamboo Master': 'bambooMaster',
    '竹林之心': 'bambooHeart',
    '熊猫活力': 'pandaVitality',
    '竹影专注': 'bambooFocus',
    '熊猫智慧': 'pandaWisdom',
    '竹林大师': 'bambooMaster'
  };

  return nameMap[name] || '';
}
