// src/db.ts
import Dexie, { type Table } from 'dexie';

// -------------- START: TYPE IMPORTS --------------
import type { SyncItem } from './services/dataSyncService';
import type { UILabelRecord } from './types'; // Central type definition
import type { PandaStateRecord } from './services/pandaStateService';
import type {
  UserCurrencyRecord,
  StoreItemRecord,
  StoreCategoryRecord,
  PurchaseRecord,
} from './services/storeService';
import type { InteractionRecord } from './types/pandaInteractionTypes';
import type {
  AbTestExperimentRecord,
  AbTestVariantRecord,
  UserAbTestAssignmentRecord,
  // ExperimentEventRecord, // Defined locally below, or imported from abTestingService
} from './types/ab-testing';
// Import ExperimentEventRecord from where it's robustly defined.
// Assuming it's defined in abTestingService as per previous attempts
import type { ExperimentEventRecord } from './services/abTestingService';

import type { TaskRecord, TaskCategoryRecord, TaskCompletionRecord } from './services/taskService';
import type { SubtaskRecord } from './services/subtaskService';
import type { TaskReminderRecord } from './services/taskReminderService';
import type { RewardRecord, ItemRecord, BadgeRecord, AbilityRecord as PandaAbilityRecordForTable, AbilityRecord as RewardAbilityRecordImport } from './services/rewardService';
import type { PandaAccessoryRecord, PandaEnvironmentRecord } from './services/pandaCustomizationService';
import type { ChallengeCategoryRecord, ChallengeRecord as ChallengeRecordType, ChallengeCompletionRecord as ChallengeCompletionRecordType } from '@/types/challenges';
import type { ChallengeDiscovery } from './services/challengeDiscoveryService';
import type { SocialChallengeRecord, SocialChallengeParticipation, SocialChallengeMilestone } from './services/socialChallengeService';
import type { ReflectionRecord, ReflectionTriggerRecord, MoodRecord } from './services/reflectionService';
import type { UserTitleRecord } from './services/userTitleService';
import type { TimelyRewardRecord, LuckyPointRecord, LuckyDrawRecord } from './services/timelyRewardService';
import type { ResourceMultiplierRecord } from './services/resourceMultiplierService';
import type { GrowthBoostRecord } from './services/growthBoostService';
import type { MilestoneRecord } from './services/milestoneService';
import type { LuckyDrawLimitRecord } from './services/luckyDrawLimitService';
import type { OfflineStateRecord, OfflineActionRecord } from '@/types/offline';
import type { MeditationCourseRecord, MeditationSessionRecord } from '@/types/meditation';
import type { PainPointSolutionRecord, PainPointTriggerRecord } from '@/types/painpoints';
import type { PandaSkinRecord } from '@/types/skins';
import type { VipTaskSeriesRecord, VipTrialRecord, VipSubscriptionRecord as VipSubscriptionRecordTypeFromVipFile } from '@/types/vip';
import type { CustomGoalRecord, CustomGoalProgressRecord } from '@/types/goals';
import type {
  BattlePassRecord,
  BattlePassLevelRecord,
  BattlePassTaskRecord,
  UserBattlePassOwnershipRecord,
  UserBattlePassProgressRecord
} from '@/types/battle-pass';
// -------------- END: TYPE IMPORTS --------------

// -------------- START: LOCAL RECORD TYPE DEFINITIONS (if not imported) --------------
export interface BambooPlotRecord {
  id?: number;
  userId: string;
  name: string;
  level: number;
  size: number;
  fertility: number;
  moisture: number;
  sunlight: number;
  isUnlocked: boolean;
  unlockCost: number;
  upgradeCost: number;
  maxPlants: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BambooSeedRecord {
  id?: number;
  name: string;
  description: string;
  rarity: string;
  growthTime: number; // in hours
  waterNeeds: number;
  sunlightNeeds: number;
  fertilityNeeds: number;
  yieldMin: number;
  yieldMax: number;
  imageUrl: string;
  isUnlocked: boolean;
  unlockCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BambooPlantRecord {
  id?: number;
  userId: string;
  plotId: number;
  seedId: number;
  plantedAt: Date;
  growthStage: number; // Consider using a specific enum or string literal type if stages are fixed
  growthProgress: number; // Percentage or absolute value
  health: number; // Percentage or absolute value
  fertility: number; // Added based on previous fixes in bambooPlantingService
  isWatered: boolean;
  lastWateredAt: Date | null;
  isFertilized: boolean;
  lastFertilizedAt: Date | null;
  isHarvestable: boolean;
  harvestedAt: Date | null;
  expectedYield: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BambooTradeRecord {
  id?: number;
  userId: string;
  resourceId: number; // Could link to a general 'GameResourceRecord' if exists
  bambooAmount: number;
  resourceAmount: number;
  tradeDirection: 'bamboo_to_resource' | 'resource_to_bamboo';
  tradeRate: number;
  tradeDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeableResourceRecord { // Could be a generic GameResourceRecord
  id?: number;
  name: string;
  description: string;
  type: string; // e.g., 'currency', 'material', 'consumable'
  rarity: string; // e.g., 'common', 'rare', 'epic'
  imageUrl: string;
  isAvailable: boolean; // For trading
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeRateRecord {
  id?: number;
  resourceId: number; // FK to TradeableResourceRecord
  bambooToResourceRate: number;
  resourceToBambooRate: number;
  minTradeAmount: number;
  maxTradeAmount: number;
  dailyLimit?: number; // Optional daily trade limit for this rate
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BambooCollectionRecord {
    id?: number;
    userId: string;
    source: string; // e.g., 'spot_harvest', 'daily_gift', 'event_reward'
    amount: number;
    timestamp: Date;
    isProcessed?: boolean; // e.g., if it needs to be claimed or acknowledged
    relatedSpotId?: number; // Optional, if collected from a specific spot
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BambooSpotRecord {
    id?: number;
    name: string;
    type: string; // e.g., 'common_grove', 'rare_spring', 'event_location'
    status: 'available' | 'depleted' | 'regenerating';
    locationDescription: string; // Text description or coordinates
    lastHarvestedAt: Date | null;
    nextAvailableAt: Date | null;
    yieldMin: number;
    yieldMax: number;
    regenerationTimeMinutes: number; // Time in minutes to become available again
    unlockRequirement?: string; // e.g., 'level_5', 'vip_only'
    isUnlocked?: boolean; // default true, or based on requirement
    createdAt?: Date;
    updatedAt?: Date;
}
// -------------- END: LOCAL RECORD TYPE DEFINITIONS --------------


export class AppDB extends Dexie {
  // 添加tableExists方法
  async tableExists(tableName: string): Promise<boolean> {
    return this.tables.some(table => table.name === tableName);
  }
  // Standard Tables
  uiLabels!: Table<UILabelRecord, number>;
  pandaState!: Table<PandaStateRecord, number>;
  syncQueue!: Table<SyncItem, string>; // 'id' is string for SyncItem

  // Task System
  tasks!: Table<TaskRecord, number>;
  taskCategories!: Table<TaskCategoryRecord, number>;
  taskCompletions!: Table<TaskCompletionRecord, number>;
  subtasks!: Table<SubtaskRecord, number>;
  taskReminders!: Table<TaskReminderRecord, number>;

  // Rewards & Items System
  rewards!: Table<RewardRecord, number>;
  items!: Table<ItemRecord, number>; // Generic items
  badges!: Table<BadgeRecord, number>;
  abilities!: Table<PandaAbilityRecordForTable, number>;
  rewardAbilities!: Table<RewardAbilityRecordImport, number>;
  pandaAccessories!: Table<PandaAccessoryRecord, number>;
  pandaEnvironments!: Table<PandaEnvironmentRecord, number>;

  // Challenges System
  challenges!: Table<ChallengeRecordType, number>;
  challengeCategories!: Table<ChallengeCategoryRecord, number>;
  challengeCompletions!: Table<ChallengeCompletionRecordType, number>;
  challengeDiscoveries!: Table<ChallengeDiscovery, number>;
  socialChallenges!: Table<SocialChallengeRecord, number>;
  socialChallengeParticipations!: Table<SocialChallengeParticipation, number>;
  socialChallengeMilestones!: Table<SocialChallengeMilestone, number>;

  // Reflections & Moods
  reflections!: Table<ReflectionRecord, number>;
  reflectionTriggers!: Table<ReflectionTriggerRecord, number>;
  moods!: Table<MoodRecord, number>;

  // Store & Currency System
  storeItems!: Table<StoreItemRecord, number>;
  storeCategories!: Table<StoreCategoryRecord, number>;
  purchases!: Table<PurchaseRecord, number>;
  userCurrencies!: Table<UserCurrencyRecord, number>; // Assuming 'id' is primary key

  // User Profile & Titles
  userTitles!: Table<UserTitleRecord, number>;

  // Timely Events & Luck System
  timelyRewards!: Table<TimelyRewardRecord, number>;
  luckyPoints!: Table<LuckyPointRecord, number>;
  luckyDraws!: Table<LuckyDrawRecord, number>;
  resourceMultipliers!: Table<ResourceMultiplierRecord, number>;
  growthBoosts!: Table<GrowthBoostRecord, number>;
  milestones!: Table<MilestoneRecord, number>;
  luckyDrawLimits!: Table<LuckyDrawLimitRecord, number>;

  // Offline System
  offlineState!: Table<OfflineStateRecord, number>; // Assuming 'id' for primary key
  offlineActions!: Table<OfflineActionRecord, number>;

  // Panda Interaction
  pandaInteractions!: Table<InteractionRecord, number>;

  // Bamboo System
  bambooPlots!: Table<BambooPlotRecord, number>;
  bambooSeeds!: Table<BambooSeedRecord, number>;
  bambooPlants!: Table<BambooPlantRecord, number>;
  bambooTrades!: Table<BambooTradeRecord, number>;
  tradeableResources!: Table<TradeableResourceRecord, number>;
  tradeRates!: Table<TradeRateRecord, number>;
  bambooCollections!: Table<BambooCollectionRecord, number>;
  bambooSpots!: Table<BambooSpotRecord, number>;

  // Meditation System
  meditationCourses!: Table<MeditationCourseRecord, number>;
  meditationSessions!: Table<MeditationSessionRecord, number>;

  // VIP System & Related
  painPointSolutions!: Table<PainPointSolutionRecord, number>;
  painPointTriggers!: Table<PainPointTriggerRecord, number>;
  pandaSkins!: Table<PandaSkinRecord, number>;
  vipTaskSeries!: Table<VipTaskSeriesRecord, number>;
  vipSubscriptions!: Table<VipSubscriptionRecordTypeFromVipFile, number>;
  vipTrials!: Table<VipTrialRecord, number>;

  // Custom Goals
  customGoals!: Table<CustomGoalRecord, number>;
  customGoalProgress!: Table<CustomGoalProgressRecord, number>;

  // Battle Pass System
  battlePasses!: Table<BattlePassRecord, number>;
  battlePassLevels!: Table<BattlePassLevelRecord, number>;
  battlePassTasks!: Table<BattlePassTaskRecord, number>;
  userBattlePassOwnerships!: Table<UserBattlePassOwnershipRecord, number>; // Assuming 'id' is primary key
  userBattlePassProgress!: Table<UserBattlePassProgressRecord, number>; // Assuming 'id' is primary key

  // A/B Testing System
  abTestExperiments!: Table<AbTestExperimentRecord, number>;
  abTestVariants!: Table<AbTestVariantRecord, number>;
  userAbTestAssignments!: Table<UserAbTestAssignmentRecord, number>; // Assuming 'id' is primary key
  abTestEvents!: Table<ExperimentEventRecord, number>;


  constructor() {
    super('PandaHabitDB_V20'); // Incremented version for adding compound index to bambooPlants
    this.version(20).stores({
      // Standard Schemas
      uiLabels: '++id, &[scopeKey+labelKey+languageCode], scopeKey, labelKey, languageCode',
      pandaState: '++id, userId, lastLogin, consecutiveDays, totalPandaXP, currentMood, currentEnergy, accessory1Id, accessory2Id, environmentId, lastInteractionTime, lastFedTime, lastPlayedTime, lastMeditatedTime, lastReflectedTime, pandaName, pandaColor, hatId, glassesId, scarfId, createdAt, updatedAt',
      syncQueue: 'id, table, action, data, timestamp, status, attempts, lastAttemptAt, error', // 'id' is string

      // Task System Schemas
      tasks: '++id, userId, title, categoryId, status, priority, dueDate, &compoundKey, *tags, parentTaskId, reminderId, isRecurring, effort, energyRequired, experienceReward, reflectionPromptId, createdAt, updatedAt, completedAt',
      taskCategories: '++id, name, userId, color, icon, isDefault, order',
      taskCompletions: '++id, taskId, userId, completedAt, experienceGained, notes',
      subtasks: '++id, parentTaskId, title, status, order, createdAt, updatedAt',
      taskReminders: '++id, taskId, userId, reminderTime, isViewed, isCompleted, createdAt, notificationId',

      // Rewards & Items System Schemas
      rewards: '++id, userId, type, rarity, name, description, icon, quantity, obtainedAt, isViewed, relatedEntityId, relatedEntityType',
      items: '++id, name, description, type, rarity, icon, quantity, obtainedAt, isStackable, maxStack, sellPrice, buyPrice, effect', // Assuming generic items table
      badges: '++id, userId, name, description, icon, rarity, obtainedAt, isEquipped, progression, criteria',
      abilities: '++id, name, description, type, effectType, requiredLevel, icon, isUnlocked, isActive, cooldown, duration, cost',
      rewardAbilities: '++id, rewardId, abilityId, unlockCondition', // This seems like a join table. `RewardAbilityRecordImport` might be complex.
      pandaAccessories: '++id, name, type, description, imagePath, overlayPath, isEquipped, isOwned, obtainedAt, storeItemId, rarity, themeType, unlockCondition, statBoosts',
      pandaEnvironments: '++id, name, description, backgroundPath, foregroundPath, ambientSound, isActive, isOwned, obtainedAt, storeItemId, rarity, themeType, interactiveElements, unlockCondition',

      // Challenges System Schemas
      challenges: '++id, title, description, type, difficulty, status, progress, startDate, endDate, rewardIds, categoryId, icon, tags, isRecurring, parentChallengeId, unlockCondition, createdAt, updatedAt',
      challengeCategories: '++id, name, description, iconPath, order',
      challengeCompletions: '++id, challengeId, userId, completedDate, score, notes, createdAt',
      challengeDiscoveries: '++id, userId, challengeId, discoveredAt, isViewed, isAccepted, expiresAt, notificationStatus',
      socialChallenges: '++id, title, description, type, difficulty, status, creatorId, isPublic, inviteCode, participantCount, maxParticipants, startDate, endDate, rewardPool, rules, theme, createdAt, updatedAt',
      socialChallengeParticipations: '++id, challengeId, userId, joinedAt, status, contribution, rank, lastActivityAt',
      socialChallengeMilestones: '++id, challengeId, title, description, targetValue, currentValue, rewardId, isCompleted, order',

      // Reflections & Moods Schemas
      reflections: '++id, userId, taskId, moodBefore, moodAfter, reflectionText, actionItems, createdAt, isCompleted, triggerType, relatedEntryId',
      reflectionTriggers: '++id, userId, type, condition, createdAt, isViewed, isCompleted, relatedEntryId',
      moods: '++id, userId, mood, intensity, note, location, activities, createdAt',

      // Store & Currency System Schemas
      storeItems: '++id, name, description, type, rarity, price, priceType, currencyId, isAvailable, isFeatured, isOnSale, salePrice, saleEndDate, stock, purchaseLimit, categoryId, icon, previewAsset, unlockRequirement, createdAt, updatedAt',
      storeCategories: '++id, name, description, order, icon, isVisible, parentCategoryId, createdAt, updatedAt',
      purchases: '++id, userId, storeItemId, quantity, price, priceType, currencyId, purchaseDate, transactionId, status, isRefunded, platform',
      userCurrencies: '++id, userId, currencyType, balance, lastUpdated', // Changed to support multiple currency types per user. Original: '++id, userId, coins, jade, gem, lastUpdated'

      // User Profile & Titles Schemas
      userTitles: '++id, userId, titleType, titleText, isActive, isVipExclusive, unlockDate, expiryDate, customText, icon, color, unlockCondition, createdAt, updatedAt',

      // Timely Events & Luck System Schemas
      timelyRewards: '++id, title, description, type, status, startTime, endTime, rewardId, unlockCondition, icon, displayPriority, notificationSent, createdAt, updatedAt',
      luckyPoints: '++id, userId, amount, source, isSpent, expiryDate, createdAt, updatedAt',
      luckyDraws: '++id, userId, pointsSpent, rewardId, timestamp, drawType, createdAt',
      resourceMultipliers: '++id, userId, multiplierType, resourceType, multiplierValue, startTime, endTime, isActive, source, icon, createdAt, updatedAt',
      growthBoosts: '++id, userId, boostType, boostValue, startTime, endTime, isActive, source, icon, description, createdAt, updatedAt',
      milestones: '++id, userId, type, name, description, targetValue, currentValue, isCompleted, rewardId, icon, displayOrder, [userId+type], [userId+isCompleted], createdAt, updatedAt',
      luckyDrawLimits: '++id, userId, date, count, &[userId+date]',

      // Offline System Schemas
      offlineState: '++id, userId, isOnline, lastSyncTimestamp, pendingSyncCount, errorCount, updatedAt',
      offlineActions: '++id, userId, tableName, actionType, payload, status, attempts, lastAttemptAt, createdAt, isError, errorMessage',

      // Panda Interaction Schema
      pandaInteractions: '++id, userId, type, timestamp, moodBefore, moodAfter, energyBefore, energyAfter, experienceGained, itemUsedId, notes, location, duration',

      // Bamboo System Schemas
      bambooPlots: '++id, userId, name, level, size, fertility, moisture, sunlight, isUnlocked, unlockCost, upgradeCost, maxPlants, lastHarvested, createdAt, updatedAt',
      bambooSeeds: '++id, name, description, rarity, growthTime, waterNeeds, sunlightNeeds, fertilityNeeds, yieldMin, yieldMax, imageUrl, isUnlocked, unlockCost, storeItemId, createdAt, updatedAt',
      bambooPlants: '++id, userId, plotId, seedId, plantedAt, growthStage, growthProgress, health, fertility, isWatered, lastWateredAt, isFertilized, lastFertilizedAt, isHarvestable, harvestedAt, expectedYield, createdAt, updatedAt, [userId+plotId]',
      bambooTrades: '++id, userId, resourceId, bambooAmount, resourceAmount, tradeDirection, tradeRate, tradeDate, status, platformFee, createdAt, updatedAt',
      tradeableResources: '++id, name, description, type, rarity, imageUrl, isAvailable, baseValue, volatility, source, createdAt, updatedAt',
      tradeRates: '++id, resourceId, bambooToResourceRate, resourceToBambooRate, minTradeAmount, maxTradeAmount, dailyLimit, currentVolume, isActive, startDate, endDate, lastUpdated, createdAt, updatedAt',
      bambooCollections: '++id, userId, source, amount, timestamp, isProcessed, relatedSpotId, quality, notes, createdAt, updatedAt',
      bambooSpots: '++id, name, type, status, locationDescription, lastHarvestedAt, nextAvailableAt, yieldMin, yieldMax, regenerationTimeMinutes, unlockRequirement, isUnlocked, icon, coordinates, createdAt, updatedAt',

      // Meditation System Schemas
      meditationCourses: '++id, title, description, type, difficulty, durationMinutes, instructor, audioUrl, coverImageUrl, tags, benefits, requiredLevel, isVipExclusive, completionCount, averageRating, isActive, createdAt, updatedAt',
      meditationSessions: '++id, userId, courseId, startTime, endTime, durationMinutes, isCompleted, rating, notes, moodBefore, moodAfter, location, device, createdAt, updatedAt',

      // VIP System & Related Schemas
      painPointSolutions: '++id, type, title, description, isActive, lastTriggeredAt, triggerCondition, solutionAction, icon, category, cooldownMinutes, unlockRequirement, createdAt, updatedAt',
      painPointTriggers: '++id, userId, solutionId, triggerContext, isViewed, isResolved, resolutionDetails, timestamp, feedback, createdAt, updatedAt',
      pandaSkins: '++id, name, description, type, rarity, assetKey, icon, isEquipped, isOwned, isVipExclusive, themeType, unlockCondition, storeItemId, obtainedAt, createdAt, updatedAt',
      vipTaskSeries: '++id, type, title, description, iconPath, isActive, isCompleted, startDate, endDate, completedAt, taskIds, rewardId, unlockCondition, displayOrder, createdAt, updatedAt', // taskIds likely string array
      vipSubscriptions: '++id, userId, tier, type, startDate, endDate, isActive, autoRenew, platform, transactionId, purchaseDate, price, currency, createdAt, updatedAt',
      vipTrials: '++id, userId, status, startDate, endDate, hasShownGuide, hasShownValueReview, hasShownExpirationReminder, source, conversionDate, trialType, createdAt, updatedAt',

      // Custom Goals Schemas
      customGoals: '++id, userId, title, description, type, category, status, targetValue, currentValue, unit, startDate, targetDate, reminderEnabled, isPublic, icon, color, createdAt, updatedAt',
      customGoalProgress: '++id, goalId, value, date, notes, mood, location, imageEvidenceUrl, createdAt, updatedAt',

      // Battle Pass System Schemas
      battlePasses: '++id, seasonName, seasonDescription, isActive, startDate, endDate, themeVisualAssetKey, seasonTheme, standardPassProductId, premiumPassProductId, levelPurchaseDiamondCost, maxLevel, version',
      battlePassLevels: '++id, passId, levelNumber, freeRewardItemId, freeRewardQuantity, paidRewardItemId, paidRewardQuantity, requiredExp, visualAssetKey, levelName',
      battlePassTasks: '++id, passId, taskName, description, taskType, targetValue, expReward, relatedGameActionKey, isRepeatable, icon, difficulty, timeLimitMinutes, category',
      userBattlePassOwnerships: '++id, &[userId+passId], purchaseDate, platformTransactionId, passType, status, purchasePrice, currency',
      userBattlePassProgress: '++id, &[userId+passId], currentLevel, currentExp, claimedFreeLevels, claimedPaidLevels, lastTaskCompletedDate, dailyCheckinStreak', // claimedFreeLevels and claimedPaidLevels are likely number[] or string for comma-separated

      // A/B Testing System Schemas
      abTestExperiments: '++id, name, description, status, startDate, endDate, targetAudience, sampleSizePercentage, variantType, goals, controlVariantId, createdAt, updatedAt',
      abTestVariants: '++id, experimentId, name, description, isControl, allocationPercentage, details, createdAt, updatedAt', // details could be JSON string
      userAbTestAssignments: '++id, &[userId+experimentId], variantId, assignedAt, lastViewedAt, conversionEvents, updatedAt', // lastViewedAt and updatedAt added
      abTestEvents: '++id, userId, experimentId, variantId, eventType, eventValue, timestamp, metadata' // metadata could be JSON string
    });
  }
}

export const db = new AppDB();

/**
 * Migrate database to the latest version
 * This function handles any necessary data migrations when upgrading the database schema
 */
export async function migrateDatabase() {
  try {
    console.log('Checking if database migration is needed...');

    // The migration will happen automatically when the database is opened
    // with the new schema version, but we can add specific migration logic here if needed

    // For example, if we need to rebuild indexes or transform data

    console.log('Database migration completed successfully.');
    return true;
  } catch (error) {
    console.error('Database migration failed:', error);
    return false;
  }
}

// Populate DB function (can be extensive)
export async function populateDB() {
  const count = await db.uiLabels.count();
  if (count > 0) {
    // console.log("DB already has labels, skipping population.");
    return;
  }
  console.log("Populating UI Labels in DB...");

  const labels: UILabelRecord[] = [
    // Minimal set for testing, expand as needed
    { scopeKey: 'globalLayout', labelKey: 'appTitle', languageCode: 'en', translatedText: 'PandaHabit App' },
    { scopeKey: 'globalLayout', labelKey: 'appTitle', languageCode: 'zh', translatedText: '熊猫习惯应用' },
    { scopeKey: 'globalLayout', labelKey: 'navHome', languageCode: 'en', translatedText: 'Home' },
    { scopeKey: 'globalLayout', labelKey: 'navHome', languageCode: 'zh', translatedText: '首页' },
    { scopeKey: 'globalLayout', labelKey: 'navSettings', languageCode: 'en', translatedText: 'Settings' },
    { scopeKey: 'globalLayout', labelKey: 'navSettings', languageCode: 'zh', translatedText: '设置' },
    { scopeKey: 'globalLayout', labelKey: 'loadingGeneric', languageCode: 'en', translatedText: 'Loading...' },
    { scopeKey: 'globalLayout', labelKey: 'loadingGeneric', languageCode: 'zh', translatedText: '加载中...' },
    { scopeKey: 'globalLayout', labelKey: 'errorGenericTitle', languageCode: 'en', translatedText: 'Error' },
    { scopeKey: 'globalLayout', labelKey: 'errorGenericTitle', languageCode: 'zh', translatedText: '错误' },
    { scopeKey: 'globalLayout', labelKey: 'errorGenericMessage', languageCode: 'en', translatedText: 'An unexpected error occurred. Please try again.' },
    { scopeKey: 'globalLayout', labelKey: 'errorGenericMessage', languageCode: 'zh', translatedText: '发生未知错误，请重试。' },
    { scopeKey: 'globalLayout', labelKey: 'errorRetryButton', languageCode: 'en', translatedText: 'Retry' },
    { scopeKey: 'globalLayout', labelKey: 'errorRetryButton', languageCode: 'zh', translatedText: '重试' },

    // Home Page
    { scopeKey: 'homeView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Dashboard' },
    { scopeKey: 'homeView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '仪表盘' },
    { scopeKey: 'homeView.welcomeSection', labelKey: 'greeting', languageCode: 'en', translatedText: 'Welcome, {userName}!' },
    { scopeKey: 'homeView.welcomeSection', labelKey: 'greeting', languageCode: 'zh', translatedText: '欢迎，{userName}！' },

    // Settings Page
    { scopeKey: 'settingsView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Settings' },
    { scopeKey: 'settingsView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '设置' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'title', languageCode: 'en', translatedText: 'Language' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'title', languageCode: 'zh', translatedText: '语言' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'selectPrompt', languageCode: 'en', translatedText: 'Select Language:' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'selectPrompt', languageCode: 'zh', translatedText: '选择语言：' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'currentLanguage', languageCode: 'en', translatedText: 'Current: {lang}' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'currentLanguage', languageCode: 'zh', translatedText: '当前：{lang}' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'saveButton', languageCode: 'en', translatedText: 'Save' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'saveButton', languageCode: 'zh', translatedText: '保存' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameEn', languageCode: 'en', translatedText: 'English' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameEn', languageCode: 'zh', translatedText: '英语' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameZh', languageCode: 'en', translatedText: 'Chinese' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameZh', languageCode: 'zh', translatedText: '中文' },

    // Panda Interaction Showcase Labels
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Panda Interactions' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '熊猫互动' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'feedButton', languageCode: 'en', translatedText: 'Feed Panda' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'feedButton', languageCode: 'zh', translatedText: '喂食熊猫' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'playButton', languageCode: 'en', translatedText: 'Play with Panda' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'playButton', languageCode: 'zh', translatedText: '与熊猫玩耍' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'meditateButton', languageCode: 'en', translatedText: 'Meditate with Panda' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'meditateButton', languageCode: 'zh', translatedText: '与熊猫冥想' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'reflectButton', languageCode: 'en', translatedText: 'Reflect with Panda' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'reflectButton', languageCode: 'zh', translatedText: '与熊猫反思' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'interactionResultTitle', languageCode: 'en', translatedText: 'Interaction Result' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'interactionResultTitle', languageCode: 'zh', translatedText: '互动结果' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'moodChangeLabel', languageCode: 'en', translatedText: 'Mood changed from {prevMood} to {newMood}' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'moodChangeLabel', languageCode: 'zh', translatedText: '心情从 {prevMood} 变为 {newMood}' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'energyChangeLabel', languageCode: 'en', translatedText: 'Energy changed by {energyChange}' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'energyChangeLabel', languageCode: 'zh', translatedText: '精力变化 {energyChange}' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'experienceGainedLabel', languageCode: 'en', translatedText: 'Gained {xp} XP' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'experienceGainedLabel', languageCode: 'zh', translatedText: '获得 {xp} 经验' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'itemUsedLabel', languageCode: 'en', translatedText: 'Used: {itemName}' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'itemUsedLabel', languageCode: 'zh', translatedText: '已使用：{itemName}' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'errorNoPandaState', languageCode: 'en', translatedText: 'Could not load panda state.' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'errorNoPandaState', languageCode: 'zh', translatedText: '无法加载熊猫状态。' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'errorInteractionFailed', languageCode: 'en', translatedText: 'Interaction failed.' },
    { scopeKey: 'pandaInteractionShowcase', labelKey: 'errorInteractionFailed', languageCode: 'zh', translatedText: '互动失败。' },

    // Bamboo Planting Page Labels
    { scopeKey: 'bambooPlantingPage', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Bamboo Garden' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '竹园' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'selectPlotPrompt', languageCode: 'en', translatedText: 'Select a Plot' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'selectPlotPrompt', languageCode: 'zh', translatedText: '选择地块' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'plantSeedButton', languageCode: 'en', translatedText: 'Plant Seed' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'plantSeedButton', languageCode: 'zh', translatedText: '种植种子' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'waterPlantButton', languageCode: 'en', translatedText: 'Water Plant' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'waterPlantButton', languageCode: 'zh', translatedText: '浇水' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'fertilizePlantButton', languageCode: 'en', translatedText: 'Fertilize' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'fertilizePlantButton', languageCode: 'zh', translatedText: '施肥' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'harvestPlantButton', languageCode: 'en', translatedText: 'Harvest' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'harvestPlantButton', languageCode: 'zh', translatedText: '收获' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'growthStageLabel', languageCode: 'en', translatedText: 'Growth Stage: {stage}' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'growthStageLabel', languageCode: 'zh', translatedText: '生长阶段：{stage}' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'healthLabel', languageCode: 'en', translatedText: 'Health: {health}%' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'healthLabel', languageCode: 'zh', translatedText: '健康：{health}%' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'readyToHarvest', languageCode: 'en', translatedText: 'Ready to Harvest!' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'readyToHarvest', languageCode: 'zh', translatedText: '可以收获了！' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'needsWater', languageCode: 'en', translatedText: 'Needs Water' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'needsWater', languageCode: 'zh', translatedText: '需要浇水' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'needsFertilizer', languageCode: 'en', translatedText: 'Needs Fertilizer' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'needsFertilizer', languageCode: 'zh', translatedText: '需要施肥' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'noSeedsAvailable', languageCode: 'en', translatedText: 'No seeds available to plant.' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'noSeedsAvailable', languageCode: 'zh', translatedText: '没有可种植的种子。' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'selectSeedModalTitle', languageCode: 'en', translatedText: 'Select a Seed' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'selectSeedModalTitle', languageCode: 'zh', translatedText: '选择种子' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'confirmPlantButton', languageCode: 'en', translatedText: 'Plant this Seed' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'confirmPlantButton', languageCode: 'zh', translatedText: '种植此种子' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'selectFertilizerModalTitle', languageCode: 'en', translatedText: 'Select Fertilizer' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'selectFertilizerModalTitle', languageCode: 'zh', translatedText: '选择肥料' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'confirmFertilizeButton', languageCode: 'en', translatedText: 'Use Fertilizer' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'confirmFertilizeButton', languageCode: 'zh', translatedText: '使用肥料' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'harvestSuccessMessage', languageCode: 'en', translatedText: 'Successfully harvested {yieldAmount} bamboo!' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'harvestSuccessMessage', languageCode: 'zh', translatedText: '成功收获 {yieldAmount} 竹子！' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'errorNoPlotSelected', languageCode: 'en', translatedText: 'Please select a plot first.' },
    { scopeKey: 'bambooPlantingPage', labelKey: 'errorNoPlotSelected', languageCode: 'zh', translatedText: '请先选择一个地块。' },

    // Bamboo Collection View Labels
    { scopeKey: 'bambooCollectionView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Bamboo Collection' },
    { scopeKey: 'bambooCollectionView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '竹子收集' },
    { scopeKey: 'bambooCollectionView', labelKey: 'availableSpotsTitle', languageCode: 'en', translatedText: 'Available Bamboo Spots' },
    { scopeKey: 'bambooCollectionView', labelKey: 'availableSpotsTitle', languageCode: 'zh', translatedText: '可收集的竹林点' },
    { scopeKey: 'bambooCollectionView', labelKey: 'collectButton', languageCode: 'en', translatedText: 'Collect' },
    { scopeKey: 'bambooCollectionView', labelKey: 'collectButton', languageCode: 'zh', translatedText: '收集' },
    { scopeKey: 'bambooCollectionView', labelKey: 'spotStatusAvailable', languageCode: 'en', translatedText: 'Available' },
    { scopeKey: 'bambooCollectionView', labelKey: 'spotStatusAvailable', languageCode: 'zh', translatedText: '可收集' },
    { scopeKey: 'bambooCollectionView', labelKey: 'spotStatusDepleted', languageCode: 'en', translatedText: 'Depleted (regenerates in {time})' },
    { scopeKey: 'bambooCollectionView', labelKey: 'spotStatusDepleted', languageCode: 'zh', translatedText: '已耗尽 (再生于 {time})' },
    { scopeKey: 'bambooCollectionView', labelKey: 'collectionSuccessMessage', languageCode: 'en', translatedText: 'Collected {amount} bamboo from {spotName}!' },
    { scopeKey: 'bambooCollectionView', labelKey: 'collectionSuccessMessage', languageCode: 'zh', translatedText: '从 {spotName} 收集了 {amount} 竹子！' },
    { scopeKey: 'bambooCollectionView', labelKey: 'noSpotsAvailable', languageCode: 'en', translatedText: 'No bamboo spots available right now. Check back later!' },
    { scopeKey: 'bambooCollectionView', labelKey: 'noSpotsAvailable', languageCode: 'zh', translatedText: '目前没有可收集的竹林点，请稍后再来！' },

    // Add more labels for other sections as needed
  ];

  try {
    await db.uiLabels.bulkAdd(labels);
    console.log("Successfully populated UI labels.");
  } catch (e) {
    if (e instanceof Dexie.BulkError) {
      console.warn(`Some UI labels failed to add during population. Failures: ${e.failures.length}`);
    } else {
      console.error("Error populating UI labels:", e);
    }
  }
}