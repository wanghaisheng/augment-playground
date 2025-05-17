// src/db.ts
import Dexie, { Table } from 'dexie';
import type { UILabelRecord } from '@/types';
import type { PandaStateRecord } from '@/services/pandaStateService';
import type {
  TaskRecord,
  TaskCategoryRecord,
  TaskCompletionRecord
} from '@/services/taskService';
import type { RewardRecord, ItemRecord, BadgeRecord, AbilityRecord as RewardAbilityRecordImport } from '@/services/rewardService';
import type { PandaAbilityRecord } from '@/services/pandaAbilityService';
import type { SyncItem } from '@/services/dataSyncService';
import type { TimelyRewardRecord, LuckyPointRecord, LuckyDrawRecord } from '@/services/timelyRewardService';
import type { SubtaskRecord } from '@/services/subtaskService';
import type { ChallengeDiscovery } from '@/services/challengeDiscoveryService';
import type { SocialChallengeRecord, SocialChallengeParticipation, SocialChallengeMilestone } from '@/services/socialChallengeService';
import type { ReflectionRecord, ReflectionTriggerRecord, MoodRecord } from '@/services/reflectionService';
import type { TaskReminderRecord } from '@/services/taskReminderService';
import type { StoreItemRecord, StoreCategoryRecord, PurchaseRecord, VipSubscriptionRecord as StoreVipSubscriptionRecord, UserCurrencyRecord } from '@/services/storeService';
import type { PandaAccessoryRecord, PandaEnvironmentRecord } from '@/services/pandaCustomizationService';
import type { ResourceMultiplierRecord } from '@/services/resourceMultiplierService';
import type { GrowthBoostRecord } from '@/services/growthBoostService';
import type { UserTitleRecord } from '@/services/userTitleService';
import type { MilestoneRecord } from '@/services/milestoneService';
import type { LuckyDrawLimitRecord } from '@/services/luckyDrawLimitService';
import type { OfflineStateRecord, OfflineActionRecord } from '@/types';
import type { InteractionRecord } from '@/types/pandaInteractionTypes';
import type { BambooCollectionRecord, BambooSpotRecord } from '@/services/bambooCollectionService';

// Newly Added Type Imports
import type { MeditationCourseRecord, MeditationSessionRecord } from '@/types/meditation';
import type { PainPointSolutionRecord, PainPointTriggerRecord } from '@/types/painpoints';
import type { PandaSkinRecord } from '@/types/skins';
import type { VipTaskSeriesRecord, VipTrialRecord, VipSubscriptionRecord as VipSubscriptionRecordTypeFromVipFile } from '@/types/vip';
import type { ChallengeCategoryRecord, ChallengeRecord as ChallengeRecordType, ChallengeCompletionRecord as ChallengeCompletionRecordType } from '@/types/challenges';
import type { CustomGoalRecord, CustomGoalProgressRecord } from '@/types/goals';
import type { AbTestExperimentRecord, AbTestVariantRecord, UserAbTestAssignmentRecord } from '@/types/ab-testing';
import type {
  BattlePassRecord,
  BattlePassLevelRecord,
  BattlePassTaskRecord,
  UserBattlePassOwnershipRecord,
  UserBattlePassProgressRecord
} from '@/types/battle-pass';

// Bamboo Planting System Types
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
  growthStage: number;
  growthProgress: number;
  health: number;
  fertility: number;
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

// Bamboo Trading System Types
export interface BambooTradeRecord {
  id?: number;
  userId: string;
  resourceId: number;
  bambooAmount: number;
  resourceAmount: number;
  tradeDirection: 'bamboo_to_resource' | 'resource_to_bamboo';
  tradeRate: number;
  tradeDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeableResourceRecord {
  id?: number;
  name: string;
  description: string;
  type: string;
  rarity: string;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeRateRecord {
  id?: number;
  resourceId: number;
  bambooToResourceRate: number;
  resourceToBambooRate: number;
  minTradeAmount: number;
  maxTradeAmount: number;
  dailyLimit: number;
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AppDB extends Dexie {
  // 添加tableExists方法
  async tableExists(tableName: string): Promise<boolean> {
    return this.tables.some(table => table.name === tableName);
  }
  uiLabels!: Table<UILabelRecord, number>;
  pandaState!: Table<PandaStateRecord, number>;
  tasks!: Table<TaskRecord, number>;
  taskCategories!: Table<TaskCategoryRecord, number>;
  taskCompletions!: Table<TaskCompletionRecord, number>;
  subtasks!: Table<SubtaskRecord, number>;
  taskReminders!: Table<TaskReminderRecord, number>;
  rewards!: Table<RewardRecord, number>;
  items!: Table<ItemRecord, number>;
  badges!: Table<BadgeRecord, number>;
  abilities!: Table<PandaAbilityRecord, number>;
  rewardAbilities!: Table<RewardAbilityRecordImport, number>; // Use renamed import
  pandaAccessories!: Table<PandaAccessoryRecord, number>;
  pandaEnvironments!: Table<PandaEnvironmentRecord, number>;
  syncQueue!: Table<SyncItem, string>;
  challenges!: Table<ChallengeRecordType, number>;
  challengeCategories!: Table<ChallengeCategoryRecord, number>; // Refined type
  challengeCompletions!: Table<ChallengeCompletionRecordType, number>;
  challengeDiscoveries!: Table<ChallengeDiscovery, number>;
  socialChallenges!: Table<SocialChallengeRecord, number>;
  socialChallengeParticipations!: Table<SocialChallengeParticipation, number>;
  socialChallengeMilestones!: Table<SocialChallengeMilestone, number>;
  reflections!: Table<ReflectionRecord, number>;
  reflectionTriggers!: Table<ReflectionTriggerRecord, number>;
  moods!: Table<MoodRecord, number>;
  storeItems!: Table<StoreItemRecord, number>;
  storeCategories!: Table<StoreCategoryRecord, number>;
  purchases!: Table<PurchaseRecord, number>;
  vipSubscriptions!: Table<VipSubscriptionRecordTypeFromVipFile, number>; // Ensure this uses the type from @/types/vip
  userCurrencies!: Table<UserCurrencyRecord, number>;
  userTitles!: Table<UserTitleRecord, number>;
  timelyRewards!: Table<TimelyRewardRecord, number>;
  luckyPoints!: Table<LuckyPointRecord, number>;
  luckyDraws!: Table<LuckyDrawRecord, number>;
  resourceMultipliers!: Table<ResourceMultiplierRecord, number>;
  growthBoosts!: Table<GrowthBoostRecord, number>;
  milestones!: Table<MilestoneRecord, number>;
  luckyDrawLimits!: Table<LuckyDrawLimitRecord, number>;
  offlineState!: Table<OfflineStateRecord, number>;
  offlineActions!: Table<OfflineActionRecord, number>;
  pandaInteractions!: Table<InteractionRecord, number>;

  // Bamboo Planting System
  bambooPlots!: Table<BambooPlotRecord, number>;
  bambooSeeds!: Table<BambooSeedRecord, number>;
  bambooPlants!: Table<BambooPlantRecord, number>;

  // Bamboo Trading System
  bambooTrades!: Table<BambooTradeRecord, number>;
  tradeableResources!: Table<TradeableResourceRecord, number>;
  tradeRates!: Table<TradeRateRecord, number>;

  // Bamboo Collection System
  bambooCollections!: Table<BambooCollectionRecord, number>;
  bambooSpots!: Table<BambooSpotRecord, number>;

  // Added Missing Tables
  meditationCourses!: Table<MeditationCourseRecord, number>;
  meditationSessions!: Table<MeditationSessionRecord, number>;
  painPointSolutions!: Table<PainPointSolutionRecord, number>;
  painPointTriggers!: Table<PainPointTriggerRecord, number>;
  pandaSkins!: Table<PandaSkinRecord, number>;
  vipTaskSeries!: Table<VipTaskSeriesRecord, number>;
  customGoals!: Table<CustomGoalRecord, number>;
  customGoalProgress!: Table<CustomGoalProgressRecord, number>;
  vipTrials!: Table<VipTrialRecord, number>;

  // Battle Pass System
  battlePasses!: Table<BattlePassRecord, number>;
  battlePassLevels!: Table<BattlePassLevelRecord, number>;
  battlePassTasks!: Table<BattlePassTaskRecord, number>;
  userBattlePassOwnerships!: Table<UserBattlePassOwnershipRecord, number>;
  userBattlePassProgress!: Table<UserBattlePassProgressRecord, number>;

  // A/B Testing System
  abTestExperiments!: Table<AbTestExperimentRecord, number>;
  abTestVariants!: Table<AbTestVariantRecord, number>;
  userAbTestAssignments!: Table<UserAbTestAssignmentRecord, number>;
  abTestEvents!: Table<any, number>; // Use 'any' for now, will be ExperimentEventRecord

  constructor() {
    super('PandaHabitDB_V19'); // Incremented version for schema change
    this.version(19).stores({
      // Add new tables here, and re-declare existing ones if their schema changes for this version
      bambooSpots: '++id, type, status, location, nextAvailableAt', // Schema for bambooSpots

      // Re-declare all existing tables from V17
      bambooCollections: '++id, userId, source, timestamp, isProcessed',
      uiLabels: '++id, scopeKey, labelKey, languageCode, &[scopeKey+labelKey+languageCode]',
      pandaState: '++id, mood, energy, lastUpdated, level',
      tasks: '++id, title, categoryId, priority, status, dueDate, createdAt',
      taskCategories: '++id, name, color, icon, isDefault',
      taskCompletions: '++id, taskId, completedAt, experienceGained',
      subtasks: '++id, parentTaskId, title, status, order, createdAt',
      taskReminders: '++id, taskId, userId, reminderTime, isViewed, isCompleted, createdAt',
      rewards: '++id, type, rarity, taskId, obtainedAt, isViewed',
      items: '++id, type, rarity, quantity, obtainedAt',
      badges: '++id, rarity, obtainedAt, isEquipped',
      abilities: '++id, name, type, effectType, requiredLevel, isUnlocked, isActive', // PandaAbilityRecord
      rewardAbilities: '++id, rarity, obtainedAt, isUnlocked, isActive', // RewardAbilityRecordImport
      pandaAccessories: '++id, name, type, isEquipped, isOwned, obtainedAt, rarity, themeType',
      pandaEnvironments: '++id, name, isActive, isOwned, obtainedAt, rarity, themeType',
      syncQueue: 'id, table, action, timestamp, status',
      challenges: '++id, title, type, difficulty, status, progress, startDate, endDate, createdAt', // ChallengeRecordType
      challengeCategories: '++id, name, description, iconPath', // ChallengeCategoryRecord
      challengeCompletions: '++id, challengeId, userId, completedDate, createdAt', // ChallengeCompletionRecordType
      challengeDiscoveries: '++id, userId, challengeId, discoveredAt, isViewed, isAccepted, expiresAt',
      socialChallenges: '++id, title, type, difficulty, status, creatorId, isPublic, inviteCode, createdAt',
      socialChallengeParticipations: '++id, challengeId, userId, joinedAt, status, contribution',
      socialChallengeMilestones: '++id, challengeId, title, targetValue, currentValue, isCompleted, order',
      reflections: '++id, userId, taskId, mood, reflection, action, createdAt, isCompleted',
      reflectionTriggers: '++id, userId, type, createdAt, isViewed, isCompleted',
      moods: '++id, userId, mood, intensity, createdAt',
      storeItems: '++id, name, type, rarity, price, priceType, isAvailable, isFeatured, isOnSale, categoryId, createdAt',
      storeCategories: '++id, name, order, isVisible, createdAt',
      purchases: '++id, userId, storeItemId, price, priceType, purchaseDate, isRefunded',
      vipSubscriptions: '++id, userId, tier, startDate, endDate, isActive, createdAt', // VipSubscriptionRecordType
      userCurrencies: '++id, userId, coins, jade, gem, lastUpdated', // Added gem here from previous fix
      userTitles: '++id, userId, titleType, titleText, isActive, isVipExclusive, unlockDate, expiryDate, customText, createdAt, updatedAt',
      timelyRewards: '++id, title, type, status, startTime, endTime, createdAt',
      luckyPoints: '++id, userId, amount, isSpent, expiryDate, createdAt',
      luckyDraws: '++id, userId, pointsSpent, timestamp, createdAt',
      resourceMultipliers: '++id, userId, multiplierType, resourceType, multiplierValue, startTime, endTime, isActive, createdAt',
      growthBoosts: '++id, userId, boostType, boostValue, startTime, endTime, isActive, createdAt',
      milestones: '++id, userId, type, isCompleted, [userId+type], [userId+isCompleted], createdAt, updatedAt',
      luckyDrawLimits: '++id, userId, date, &[userId+date]',
      offlineState: '++id, isOnline, pendingSyncCount, updatedAt',
      offlineActions: '++id, tableName, actionType, processedAt, createdAt, isError',
      pandaInteractions: '++id, type, timestamp, moodBefore, moodAfter, energyBefore, energyAfter, experienceGained, itemUsed',
      bambooPlots: '++id, userId, name, level, isUnlocked, createdAt, updatedAt',
      bambooSeeds: '++id, name, rarity, growthTime, isUnlocked, createdAt, updatedAt',
      bambooPlants: '++id, userId, plotId, seedId, plantedAt, growthStage, isHarvestable, createdAt, updatedAt',
      bambooTrades: '++id, userId, resourceId, tradeDirection, tradeDate, createdAt, updatedAt',
      tradeableResources: '++id, name, type, rarity, isAvailable, createdAt, updatedAt',
      tradeRates: '++id, resourceId, isActive, startDate, endDate, createdAt, updatedAt',
      meditationCourses: '++id, title, type, difficulty, durationMinutes, isVipExclusive, completionCount, averageRating, isActive',
      meditationSessions: '++id, userId, courseId, startTime, endTime, durationMinutes, isCompleted, rating',
      painPointSolutions: '++id, type, title, isActive, lastTriggeredAt',
      painPointTriggers: '++id, userId, solutionId, isViewed, isResolved',
      pandaSkins: '++id, name, type, rarity, isEquipped, isOwned, isVipExclusive, themeType',
      vipTaskSeries: '++id, type, title, isActive, isCompleted, startDate, endDate, completedAt, taskIds',
      customGoals: '++id, userId, title, type, status, targetValue, currentValue, startDate, isPublic',
      customGoalProgress: '++id, goalId, value, date, createdAt',
      vipTrials: '++id, userId, status, startDate, endDate, hasShownGuide, hasShownValueReview, hasShownExpirationReminder',
      battlePasses: '++id, seasonName, isActive, startDate, endDate, themeVisualAssetKey, seasonTheme, standardPassProductId, premiumPassProductId, levelPurchaseDiamondCost',
      battlePassLevels: '++id, passId, levelNumber, freeRewardItemId, paidRewardItemId, requiredExp',
      battlePassTasks: '++id, passId, taskName, taskType, targetValue, expReward, relatedGameActionKey, isRepeatable',
      userBattlePassOwnerships: '++id, &[userId+passId], purchaseDate, platformTransactionId, passType',
      userBattlePassProgress: '++id, &[userId+passId], currentLevel, currentExp, claimedFreeLevels, claimedPaidLevels',
      abTestExperiments: '++id, name, status, startDate, endDate, targetAudience, sampleSizePercentage, variantType',
      abTestVariants: '++id, experimentId, name, isControl, allocationPercentage',
      userAbTestAssignments: '++id, &[userId+experimentId], variantId, assignedAt',
      abTestEvents: '++id, userId, experimentId, variantId, eventType, timestamp' // Added abTestEvents schema
    });
    // Chain previous versions if necessary for migrations
    // this.version(17).stores({ bambooCollections: '...', ... (all tables from v17 if they changed) ... });
    // this.version(16).stores({ ... (all tables from v16 if they changed) ... });
  }
}
export const db = new AppDB();

let hasAttemptedPopulation = false;

export async function populateDB() {
  if (hasAttemptedPopulation) return;
  hasAttemptedPopulation = true;

  const count = await db.uiLabels.count();
  if (count > 0) { /* console.log("DB V3 already populated."); */ return; }
  console.log("Populating Final V3 Dexie DB...");

  const labels: UILabelRecord[] = [
    // GlobalLayout scope
    { scopeKey: 'globalLayout', labelKey: 'appTitle', languageCode: 'en', translatedText: 'App V3 - Consistent' },
    { scopeKey: 'globalLayout', labelKey: 'appTitle', languageCode: 'zh', translatedText: '应用 V3 - 一致性' },
    { scopeKey: 'globalLayout', labelKey: 'navHome', languageCode: 'en', translatedText: 'Home' },
    { scopeKey: 'globalLayout', labelKey: 'navHome', languageCode: 'zh', translatedText: '主页' },
    { scopeKey: 'globalLayout', labelKey: 'navTasks', languageCode: 'en', translatedText: 'Tasks' },
    { scopeKey: 'globalLayout', labelKey: 'navTasks', languageCode: 'zh', translatedText: '任务' },
    { scopeKey: 'globalLayout', labelKey: 'navSettings', languageCode: 'en', translatedText: 'Settings' },
    { scopeKey: 'globalLayout', labelKey: 'navSettings', languageCode: 'zh', translatedText: '设定' },
    { scopeKey: 'globalLayout', labelKey: 'footerText', languageCode: 'en', translatedText: '© 2024 Final Demo App' },
    { scopeKey: 'globalLayout', labelKey: 'footerText', languageCode: 'zh', translatedText: '© 2024 最终演示应用' },
    { scopeKey: 'globalLayout', labelKey: 'loadingGeneric', languageCode: 'en', translatedText: 'Loading, one moment...' },
    { scopeKey: 'globalLayout', labelKey: 'loadingGeneric', languageCode: 'zh', translatedText: '加载中，请稍候...' },
    { scopeKey: 'globalLayout', labelKey: 'errorGeneric', languageCode: 'en', translatedText: 'An unexpected error occurred.' },
    { scopeKey: 'globalLayout', labelKey: 'errorGeneric', languageCode: 'zh', translatedText: '发生了一个意外错误。' },

    // homeView scope
    { scopeKey: 'homeView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'My Dashboard' },
    { scopeKey: 'homeView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '我的仪表板' },
    { scopeKey: 'homeView.welcomeSection', labelKey: 'welcomeMessage', languageCode: 'en', translatedText: 'Greetings, {user}! Have a productive day.' },
    { scopeKey: 'homeView.welcomeSection', labelKey: 'welcomeMessage', languageCode: 'zh', translatedText: '你好 {user}，祝你拥有高效的一天！' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'sectionTitle', languageCode: 'en', translatedText: 'Recent Mood Entries' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'sectionTitle', languageCode: 'zh', translatedText: '近期心情记录' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'noMoodsMessage', languageCode: 'en', translatedText: 'No moods logged. Why not add one?' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'noMoodsMessage', languageCode: 'zh', translatedText: '暂无心情记录。要不要添加一条？' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'refreshButtonText', languageCode: 'en', translatedText: 'Refresh Moods' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'refreshButtonText', languageCode: 'zh', translatedText: '刷新心情' },

    // 熊猫区域标签
    { scopeKey: 'homeView.pandaSection', labelKey: 'sectionTitle', languageCode: 'en', translatedText: 'Panda Companion' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'sectionTitle', languageCode: 'zh', translatedText: '熊猫伙伴' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'levelLabel', languageCode: 'en', translatedText: 'Level' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'levelLabel', languageCode: 'zh', translatedText: '等级' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'experienceLabel', languageCode: 'en', translatedText: 'Experience' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'experienceLabel', languageCode: 'zh', translatedText: '经验' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'interactButtonText', languageCode: 'en', translatedText: 'Interact' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'interactButtonText', languageCode: 'zh', translatedText: '互动' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'feedButtonText', languageCode: 'en', translatedText: 'Feed' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'feedButtonText', languageCode: 'zh', translatedText: '喂食' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'playButtonText', languageCode: 'en', translatedText: 'Play' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'playButtonText', languageCode: 'zh', translatedText: '玩耍' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'trainButtonText', languageCode: 'en', translatedText: 'Train' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'trainButtonText', languageCode: 'zh', translatedText: '训练' },

    { scopeKey: 'homeView', labelKey: 'someActionText', languageCode: 'en', translatedText: 'Perform Action' },
    { scopeKey: 'homeView', labelKey: 'someActionText', languageCode: 'zh', translatedText: '执行操作' },

    // settingsView scope
    { scopeKey: 'settingsView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Configuration Panel' },
    { scopeKey: 'settingsView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '配置面板' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'sectionTitle', languageCode: 'en', translatedText: 'Display Language' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'sectionTitle', languageCode: 'zh', translatedText: '显示语言' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'selectLanguagePrompt', languageCode: 'en', translatedText: 'Select your preferred language:' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'selectLanguagePrompt', languageCode: 'zh', translatedText: '请选择您的偏好语言：' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'currentLanguageIs', languageCode: 'en', translatedText: 'Currently using: {lang}' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'currentLanguageIs', languageCode: 'zh', translatedText: '当前使用：{lang}' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameEn', languageCode: 'en', translatedText: 'English (US)' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameEn', languageCode: 'zh', translatedText: '美式英语' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameZh', languageCode: 'en', translatedText: 'Chinese (Simplified)' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameZh', languageCode: 'zh', translatedText: '简体中文' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'saveButtonText', languageCode: 'en', translatedText: 'Save Preferences' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'saveButtonText', languageCode: 'zh', translatedText: '保存偏好' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'successMessage', languageCode: 'en', translatedText: 'Preferences have been updated!' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'successMessage', languageCode: 'zh', translatedText: '偏好设置已更新！' },

    // tasksView scope
    { scopeKey: 'tasksView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Task Management' },
    { scopeKey: 'tasksView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '任务管理' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'sectionTitle', languageCode: 'en', translatedText: 'My Tasks' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'sectionTitle', languageCode: 'zh', translatedText: '我的任务' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'createTaskButton', languageCode: 'en', translatedText: 'Create New Task' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'createTaskButton', languageCode: 'zh', translatedText: '创建新任务' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterAllLabel', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterAllLabel', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterTodoLabel', languageCode: 'en', translatedText: 'To Do' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterTodoLabel', languageCode: 'zh', translatedText: '待办' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterInProgressLabel', languageCode: 'en', translatedText: 'In Progress' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterInProgressLabel', languageCode: 'zh', translatedText: '进行中' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterCompletedLabel', languageCode: 'en', translatedText: 'Completed' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterCompletedLabel', languageCode: 'zh', translatedText: '已完成' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'noTasksMessage', languageCode: 'en', translatedText: 'No tasks found' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'noTasksMessage', languageCode: 'zh', translatedText: '暂无任务' },

    // challengesView scope
    { scopeKey: 'challengesView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Challenges' },
    { scopeKey: 'challengesView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '挑战' },
    { scopeKey: 'challengesView', labelKey: 'statusFilterLabel', languageCode: 'en', translatedText: 'Status' },
    { scopeKey: 'challengesView', labelKey: 'statusFilterLabel', languageCode: 'zh', translatedText: '状态' },
    { scopeKey: 'challengesView', labelKey: 'typeFilterLabel', languageCode: 'en', translatedText: 'Type' },
    { scopeKey: 'challengesView', labelKey: 'typeFilterLabel', languageCode: 'zh', translatedText: '类型' },
    { scopeKey: 'challengesView', labelKey: 'difficultyFilterLabel', languageCode: 'en', translatedText: 'Difficulty' },
    { scopeKey: 'challengesView', labelKey: 'difficultyFilterLabel', languageCode: 'zh', translatedText: '难度' },
    { scopeKey: 'challengesView', labelKey: 'filterAllLabel', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'challengesView', labelKey: 'filterAllLabel', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'challengesView', labelKey: 'filterActiveLabel', languageCode: 'en', translatedText: 'Active' },
    { scopeKey: 'challengesView', labelKey: 'filterActiveLabel', languageCode: 'zh', translatedText: '进行中' },
    { scopeKey: 'challengesView', labelKey: 'filterCompletedLabel', languageCode: 'en', translatedText: 'Completed' },
    { scopeKey: 'challengesView', labelKey: 'filterCompletedLabel', languageCode: 'zh', translatedText: '已完成' },
    { scopeKey: 'challengesView', labelKey: 'filterUpcomingLabel', languageCode: 'en', translatedText: 'Upcoming' },
    { scopeKey: 'challengesView', labelKey: 'filterUpcomingLabel', languageCode: 'zh', translatedText: '即将开始' },
    { scopeKey: 'challengesView', labelKey: 'clearFiltersButton', languageCode: 'en', translatedText: 'Clear All Filters' },
    { scopeKey: 'challengesView', labelKey: 'clearFiltersButton', languageCode: 'zh', translatedText: '清除所有过滤器' },
    { scopeKey: 'challengesView', labelKey: 'noChallengesMessage', languageCode: 'en', translatedText: 'No challenges found' },
    { scopeKey: 'challengesView', labelKey: 'noChallengesMessage', languageCode: 'zh', translatedText: '暂无挑战' },

    // 挑战页面过滤器标签 - 类型
    { scopeKey: 'challengesView.filters', labelKey: 'typeAllLabel', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'challengesView.filters', labelKey: 'typeAllLabel', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'challengesView.filters', labelKey: 'typeDailyLabel', languageCode: 'en', translatedText: 'Daily' },
    { scopeKey: 'challengesView.filters', labelKey: 'typeDailyLabel', languageCode: 'zh', translatedText: '每日' },
    { scopeKey: 'challengesView.filters', labelKey: 'typeWeeklyLabel', languageCode: 'en', translatedText: 'Weekly' },
    { scopeKey: 'challengesView.filters', labelKey: 'typeWeeklyLabel', languageCode: 'zh', translatedText: '每周' },
    { scopeKey: 'challengesView.filters', labelKey: 'typeEventLabel', languageCode: 'en', translatedText: 'Event' },
    { scopeKey: 'challengesView.filters', labelKey: 'typeEventLabel', languageCode: 'zh', translatedText: '活动' },
    { scopeKey: 'challengesView.filters', labelKey: 'typeOngoingLabel', languageCode: 'en', translatedText: 'Ongoing' },
    { scopeKey: 'challengesView.filters', labelKey: 'typeOngoingLabel', languageCode: 'zh', translatedText: '持续' },

    // 挑战页面过滤器标签 - 难度
    { scopeKey: 'challengesView.filters', labelKey: 'difficultyAllLabel', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'challengesView.filters', labelKey: 'difficultyAllLabel', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'challengesView.filters', labelKey: 'difficultyEasyLabel', languageCode: 'en', translatedText: 'Easy' },
    { scopeKey: 'challengesView.filters', labelKey: 'difficultyEasyLabel', languageCode: 'zh', translatedText: '简单' },
    { scopeKey: 'challengesView.filters', labelKey: 'difficultyMediumLabel', languageCode: 'en', translatedText: 'Medium' },
    { scopeKey: 'challengesView.filters', labelKey: 'difficultyMediumLabel', languageCode: 'zh', translatedText: '中等' },
    { scopeKey: 'challengesView.filters', labelKey: 'difficultyHardLabel', languageCode: 'en', translatedText: 'Hard' },
    { scopeKey: 'challengesView.filters', labelKey: 'difficultyHardLabel', languageCode: 'zh', translatedText: '困难' },
    { scopeKey: 'challengesView.filters', labelKey: 'difficultyExpertLabel', languageCode: 'en', translatedText: 'Expert' },
    { scopeKey: 'challengesView.filters', labelKey: 'difficultyExpertLabel', languageCode: 'zh', translatedText: '专家' },

    // 挑战页面错误和加载消息
    { scopeKey: 'challengesView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading challenges...' },
    { scopeKey: 'challengesView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载挑战中...' },
    { scopeKey: 'challengesView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Challenge Page Error' },
    { scopeKey: 'challengesView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '挑战页面错误' },
    { scopeKey: 'challengesView', labelKey: 'errorMessage', languageCode: 'en', translatedText: 'Failed to load challenges: {message}' },
    { scopeKey: 'challengesView', labelKey: 'errorMessage', languageCode: 'zh', translatedText: '加载挑战失败: {message}' },
    { scopeKey: 'challengesView', labelKey: 'retryButtonText', languageCode: 'en', translatedText: 'Retry' },
    { scopeKey: 'challengesView', labelKey: 'retryButtonText', languageCode: 'zh', translatedText: '重试' },

    // 及时奖励页面标签
    { scopeKey: 'timelyRewardsPageView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Timely Rewards' },
    { scopeKey: 'timelyRewardsPageView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '及时奖励' },
    { scopeKey: 'timelyRewardsPageView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading rewards...' },
    { scopeKey: 'timelyRewardsPageView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载奖励中...' },
    { scopeKey: 'timelyRewardsPageView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Timely Rewards Page Error' },
    { scopeKey: 'timelyRewardsPageView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '及时奖励页面错误' },

    // 及时奖励页面过滤器标签
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'statusLabel', languageCode: 'en', translatedText: 'Status' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'statusLabel', languageCode: 'zh', translatedText: '状态' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'allLabel', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'allLabel', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'activeLabel', languageCode: 'en', translatedText: 'Active' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'activeLabel', languageCode: 'zh', translatedText: '进行中' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'completedLabel', languageCode: 'en', translatedText: 'Completed' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'completedLabel', languageCode: 'zh', translatedText: '已完成' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'upcomingLabel', languageCode: 'en', translatedText: 'Upcoming' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'upcomingLabel', languageCode: 'zh', translatedText: '即将开始' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeLabel', languageCode: 'en', translatedText: 'Type' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeLabel', languageCode: 'zh', translatedText: '类型' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeAllLabel', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeAllLabel', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeDailyLabel', languageCode: 'en', translatedText: 'Daily Reward' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeDailyLabel', languageCode: 'zh', translatedText: '每日奖励' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeMorningLabel', languageCode: 'en', translatedText: 'Early Bird Reward' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeMorningLabel', languageCode: 'zh', translatedText: '早起鸟奖励' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeStreakLabel', languageCode: 'en', translatedText: 'Streak Reward' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeStreakLabel', languageCode: 'zh', translatedText: '连续完成奖励' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeSpecialLabel', languageCode: 'en', translatedText: 'Special Reward' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'typeSpecialLabel', languageCode: 'zh', translatedText: '特殊奖励' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'clearFiltersLabel', languageCode: 'en', translatedText: 'Clear All Filters' },
    { scopeKey: 'timelyRewardsPageView.filters', labelKey: 'clearFiltersLabel', languageCode: 'zh', translatedText: '清除所有过滤器' },

    // 及时奖励卡片标签
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'typeDaily', languageCode: 'en', translatedText: 'Daily Reward' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'typeDaily', languageCode: 'zh', translatedText: '每日奖励' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'typeMorning', languageCode: 'en', translatedText: 'Early Bird Reward' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'typeMorning', languageCode: 'zh', translatedText: '早起鸟奖励' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'typeStreak', languageCode: 'en', translatedText: 'Streak Reward' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'typeStreak', languageCode: 'zh', translatedText: '连续完成奖励' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'typeSpecial', languageCode: 'en', translatedText: 'Special Reward' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'typeSpecial', languageCode: 'zh', translatedText: '特殊奖励' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'statusActive', languageCode: 'en', translatedText: 'Active' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'statusActive', languageCode: 'zh', translatedText: '进行中' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'statusCompleted', languageCode: 'en', translatedText: 'Completed' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'statusCompleted', languageCode: 'zh', translatedText: '已完成' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'statusExpired', languageCode: 'en', translatedText: 'Expired' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'statusExpired', languageCode: 'zh', translatedText: '已过期' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'statusUpcoming', languageCode: 'en', translatedText: 'Upcoming' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'statusUpcoming', languageCode: 'zh', translatedText: '即将开始' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'timeEnded', languageCode: 'en', translatedText: 'Ended' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'timeEnded', languageCode: 'zh', translatedText: '已结束' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'hourUnit', languageCode: 'en', translatedText: 'h' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'hourUnit', languageCode: 'zh', translatedText: '小时' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'minuteUnit', languageCode: 'en', translatedText: 'm' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'minuteUnit', languageCode: 'zh', translatedText: '分钟' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'remainingTimeLabel', languageCode: 'en', translatedText: 'Remaining time' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'remainingTimeLabel', languageCode: 'zh', translatedText: '剩余时间' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'luckyPointsLabel', languageCode: 'en', translatedText: 'Lucky Points' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'luckyPointsLabel', languageCode: 'zh', translatedText: '幸运点' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'claimRewardButton', languageCode: 'en', translatedText: 'Claim Reward' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'claimRewardButton', languageCode: 'zh', translatedText: '领取奖励' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'inProgressButton', languageCode: 'en', translatedText: 'In Progress...' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'inProgressButton', languageCode: 'zh', translatedText: '进行中...' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'completedOnLabel', languageCode: 'en', translatedText: 'Completed on' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'completedOnLabel', languageCode: 'zh', translatedText: '完成于' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'noRewardsMessage', languageCode: 'en', translatedText: 'No timely rewards available' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'noRewardsMessage', languageCode: 'zh', translatedText: '暂无及时奖励' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'typeLabel', languageCode: 'en', translatedText: 'Type' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'typeLabel', languageCode: 'zh', translatedText: '类型' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'statusLabel', languageCode: 'en', translatedText: 'Status' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'statusLabel', languageCode: 'zh', translatedText: '状态' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'progressLabel', languageCode: 'en', translatedText: 'Progress' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'progressLabel', languageCode: 'zh', translatedText: '进度' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'startTimeLabel', languageCode: 'en', translatedText: 'Start Time' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'startTimeLabel', languageCode: 'zh', translatedText: '开始时间' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'endTimeLabel', languageCode: 'en', translatedText: 'End Time' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'endTimeLabel', languageCode: 'zh', translatedText: '结束时间' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'completedTimeLabel', languageCode: 'en', translatedText: 'Completed Time' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'completedTimeLabel', languageCode: 'zh', translatedText: '完成时间' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'continueEffortButton', languageCode: 'en', translatedText: 'Keep Going' },
    { scopeKey: 'timelyRewardsPageView.rewardCard', labelKey: 'continueEffortButton', languageCode: 'zh', translatedText: '继续努力' },

    // 幸运抽奖标签
    { scopeKey: 'timelyRewardsPageView.luckyDraw', labelKey: 'title', languageCode: 'en', translatedText: 'Lucky Draw' },
    { scopeKey: 'timelyRewardsPageView.luckyDraw', labelKey: 'title', languageCode: 'zh', translatedText: '幸运抽奖' },
    { scopeKey: 'timelyRewardsPageView.luckyDraw', labelKey: 'buttonText', languageCode: 'en', translatedText: 'Lucky Draw' },
    { scopeKey: 'timelyRewardsPageView.luckyDraw', labelKey: 'buttonText', languageCode: 'zh', translatedText: '幸运抽奖' },

    // 幸运点显示组件标签
    { scopeKey: 'luckyPointsDisplay', labelKey: 'label', languageCode: 'en', translatedText: 'Lucky Points' },
    { scopeKey: 'luckyPointsDisplay', labelKey: 'label', languageCode: 'zh', translatedText: '幸运点' },
    { scopeKey: 'luckyPointsDisplay', labelKey: 'loadingText', languageCode: 'en', translatedText: 'Loading...' },
    { scopeKey: 'luckyPointsDisplay', labelKey: 'loadingText', languageCode: 'zh', translatedText: '加载中...' },

    // 幸运抽奖组件标签
    { scopeKey: 'luckyDraw', labelKey: 'title', languageCode: 'en', translatedText: 'Lucky Draw' },
    { scopeKey: 'luckyDraw', labelKey: 'title', languageCode: 'zh', translatedText: '幸运抽奖' },
    { scopeKey: 'luckyDraw', labelKey: 'basicDrawLabel', languageCode: 'en', translatedText: 'Basic Draw' },
    { scopeKey: 'luckyDraw', labelKey: 'basicDrawLabel', languageCode: 'zh', translatedText: '基础抽奖' },
    { scopeKey: 'luckyDraw', labelKey: 'basicDrawDescription', languageCode: 'en', translatedText: 'Chance to get common rewards' },
    { scopeKey: 'luckyDraw', labelKey: 'basicDrawDescription', languageCode: 'zh', translatedText: '获得普通奖励的机会' },
    { scopeKey: 'luckyDraw', labelKey: 'premiumDrawLabel', languageCode: 'en', translatedText: 'Premium Draw' },
    { scopeKey: 'luckyDraw', labelKey: 'premiumDrawLabel', languageCode: 'zh', translatedText: '高级抽奖' },
    { scopeKey: 'luckyDraw', labelKey: 'premiumDrawDescription', languageCode: 'en', translatedText: 'Higher chance to get rare rewards' },
    { scopeKey: 'luckyDraw', labelKey: 'premiumDrawDescription', languageCode: 'zh', translatedText: '获得稀有奖励的更高机会' },
    { scopeKey: 'luckyDraw', labelKey: 'deluxeDrawLabel', languageCode: 'en', translatedText: 'Deluxe Draw' },
    { scopeKey: 'luckyDraw', labelKey: 'deluxeDrawLabel', languageCode: 'zh', translatedText: '豪华抽奖' },
    { scopeKey: 'luckyDraw', labelKey: 'deluxeDrawDescription', languageCode: 'en', translatedText: 'Highest chance to get epic and legendary rewards' },
    { scopeKey: 'luckyDraw', labelKey: 'deluxeDrawDescription', languageCode: 'zh', translatedText: '获得史诗和传说奖励的最高机会' },
    { scopeKey: 'luckyDraw', labelKey: 'notEnoughPointsError', languageCode: 'en', translatedText: 'Not enough lucky points' },
    { scopeKey: 'luckyDraw', labelKey: 'notEnoughPointsError', languageCode: 'zh', translatedText: '幸运点不足' },
    { scopeKey: 'luckyDraw', labelKey: 'loadPointsError', languageCode: 'en', translatedText: 'Failed to load lucky points, please try again' },
    { scopeKey: 'luckyDraw', labelKey: 'loadPointsError', languageCode: 'zh', translatedText: '加载幸运点失败，请重试' },
    { scopeKey: 'luckyDraw', labelKey: 'drawError', languageCode: 'en', translatedText: 'Failed to perform lucky draw, please try again' },
    { scopeKey: 'luckyDraw', labelKey: 'drawError', languageCode: 'zh', translatedText: '抽奖失败，请重试' },
    { scopeKey: 'luckyDraw', labelKey: 'continueDrawingButton', languageCode: 'en', translatedText: 'Continue Drawing' },
    { scopeKey: 'luckyDraw', labelKey: 'continueDrawingButton', languageCode: 'zh', translatedText: '继续抽奖' },
    { scopeKey: 'luckyDraw', labelKey: 'closeButton', languageCode: 'en', translatedText: 'Close' },
    { scopeKey: 'luckyDraw', labelKey: 'closeButton', languageCode: 'zh', translatedText: '关闭' },
    { scopeKey: 'luckyDraw', labelKey: 'drawingButton', languageCode: 'en', translatedText: 'Drawing...' },
    { scopeKey: 'luckyDraw', labelKey: 'drawingButton', languageCode: 'zh', translatedText: '抽奖中...' },
    { scopeKey: 'luckyDraw', labelKey: 'drawButton', languageCode: 'en', translatedText: 'Draw' },
    { scopeKey: 'luckyDraw', labelKey: 'drawButton', languageCode: 'zh', translatedText: '抽奖' },

    // Challenge Discovery Card Labels
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'closeButtonAriaLabel', languageCode: 'en', translatedText: 'Close' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'closeButtonAriaLabel', languageCode: 'zh', translatedText: '关闭' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading challenge...' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载挑战中...' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'errorLoadingChallenge', languageCode: 'en', translatedText: 'Failed to load challenge, please try again' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'errorLoadingChallenge', languageCode: 'zh', translatedText: '加载挑战失败，请重试' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'cannotLoadChallenge', languageCode: 'en', translatedText: 'Unable to load challenge data' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'cannotLoadChallenge', languageCode: 'zh', translatedText: '无法加载挑战数据' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'startDateLabel', languageCode: 'en', translatedText: 'Start Date' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'startDateLabel', languageCode: 'zh', translatedText: '开始日期' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'endDateLabel', languageCode: 'en', translatedText: 'End Date' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'endDateLabel', languageCode: 'zh', translatedText: '结束日期' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'laterButton', languageCode: 'en', translatedText: 'Maybe Later' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'laterButton', languageCode: 'zh', translatedText: '稍后再说' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'acceptButton', languageCode: 'en', translatedText: 'Accept Challenge' },
    { scopeKey: 'challengesView.challengeDiscoveryCard', labelKey: 'acceptButton', languageCode: 'zh', translatedText: '接受挑战' },

    // Challenge Recommendation Card Labels
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'matchScoreLabel', languageCode: 'en', translatedText: 'Match Score' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'matchScoreLabel', languageCode: 'zh', translatedText: '匹配度' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'difficultyEasy', languageCode: 'en', translatedText: 'Easy' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'difficultyEasy', languageCode: 'zh', translatedText: '简单' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'difficultyMedium', languageCode: 'en', translatedText: 'Medium' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'difficultyMedium', languageCode: 'zh', translatedText: '中等' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'difficultyHard', languageCode: 'en', translatedText: 'Hard' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'difficultyHard', languageCode: 'zh', translatedText: '困难' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'difficultyExpert', languageCode: 'en', translatedText: 'Expert' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'difficultyExpert', languageCode: 'zh', translatedText: '专家' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'difficultyUnknown', languageCode: 'en', translatedText: 'Unknown' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'difficultyUnknown', languageCode: 'zh', translatedText: '未知' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'startDateLabel', languageCode: 'en', translatedText: 'Start Date' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'startDateLabel', languageCode: 'zh', translatedText: '开始日期' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'endDateLabel', languageCode: 'en', translatedText: 'End Date' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'endDateLabel', languageCode: 'zh', translatedText: '结束日期' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'viewDetailsButton', languageCode: 'en', translatedText: 'View Details' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'viewDetailsButton', languageCode: 'zh', translatedText: '查看详情' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'acceptButton', languageCode: 'en', translatedText: 'Accept Challenge' },
    { scopeKey: 'challengesView.challengeRecommendationCard', labelKey: 'acceptButton', languageCode: 'zh', translatedText: '接受挑战' },

    // VIP Benefits Page Labels
    { scopeKey: 'vipBenefits', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'VIP Benefits' },
    { scopeKey: 'vipBenefits', labelKey: 'pageTitle', languageCode: 'zh', translatedText: 'VIP特权' },
    { scopeKey: 'vipBenefits', labelKey: 'headerTitle', languageCode: 'en', translatedText: 'Become a Panda Guardian' },
    { scopeKey: 'vipBenefits', labelKey: 'headerTitle', languageCode: 'zh', translatedText: '成为熊猫守护者' },
    { scopeKey: 'vipBenefits', labelKey: 'headerSubtitle', languageCode: 'en', translatedText: 'Unlock exclusive benefits and accelerate your growth' },
    { scopeKey: 'vipBenefits', labelKey: 'headerSubtitle', languageCode: 'zh', translatedText: '解锁专属特权，加速你的成长' },
    { scopeKey: 'vipBenefits', labelKey: 'alreadyVipMessage', languageCode: 'en', translatedText: 'You are already enjoying all the VIP benefits as a Panda Guardian!' },
    { scopeKey: 'vipBenefits', labelKey: 'alreadyVipMessage', languageCode: 'zh', translatedText: '你已经是熊猫守护者，正在享受所有VIP特权！' },
    { scopeKey: 'vipBenefits', labelKey: 'compareTitle', languageCode: 'en', translatedText: 'Compare Benefits' },
    { scopeKey: 'vipBenefits', labelKey: 'compareTitle', languageCode: 'zh', translatedText: '特权对比' },
    { scopeKey: 'vipBenefits', labelKey: 'freeTitle', languageCode: 'en', translatedText: 'Free Panda Friend' },
    { scopeKey: 'vipBenefits', labelKey: 'freeTitle', languageCode: 'zh', translatedText: '免费熊猫好友' },
    { scopeKey: 'vipBenefits', labelKey: 'vipTitle', languageCode: 'en', translatedText: 'VIP Panda Guardian' },
    { scopeKey: 'vipBenefits', labelKey: 'vipTitle', languageCode: 'zh', translatedText: 'VIP熊猫守护者' },

    // VIP Benefits Categories
    { scopeKey: 'vipBenefits.benefitCategories', labelKey: 'identity', languageCode: 'en', translatedText: 'Identity' },
    { scopeKey: 'vipBenefits.benefitCategories', labelKey: 'identity', languageCode: 'zh', translatedText: '身份标识' },
    { scopeKey: 'vipBenefits.benefitCategories', labelKey: 'resources', languageCode: 'en', translatedText: 'Resources' },
    { scopeKey: 'vipBenefits.benefitCategories', labelKey: 'resources', languageCode: 'zh', translatedText: '资源加成' },
    { scopeKey: 'vipBenefits.benefitCategories', labelKey: 'features', languageCode: 'en', translatedText: 'Features' },
    { scopeKey: 'vipBenefits.benefitCategories', labelKey: 'features', languageCode: 'zh', translatedText: '功能特权' },
    { scopeKey: 'vipBenefits.benefitCategories', labelKey: 'exclusive', languageCode: 'en', translatedText: 'Exclusive Content' },
    { scopeKey: 'vipBenefits.benefitCategories', labelKey: 'exclusive', languageCode: 'zh', translatedText: '专属内容' },

    // VIP Benefits Buttons
    { scopeKey: 'vipBenefits.buttons', labelKey: 'subscribe', languageCode: 'en', translatedText: 'Become a Guardian' },
    { scopeKey: 'vipBenefits.buttons', labelKey: 'subscribe', languageCode: 'zh', translatedText: '成为守护者' },
    { scopeKey: 'vipBenefits.buttons', labelKey: 'viewOptions', languageCode: 'en', translatedText: 'View Subscription Options' },
    { scopeKey: 'vipBenefits.buttons', labelKey: 'viewOptions', languageCode: 'zh', translatedText: '查看订阅选项' },
    { scopeKey: 'vipBenefits.buttons', labelKey: 'back', languageCode: 'en', translatedText: 'Back' },
    { scopeKey: 'vipBenefits.buttons', labelKey: 'back', languageCode: 'zh', translatedText: '返回' },

    // VIP Benefits Details - Avatar Frame
    { scopeKey: 'vipBenefits.benefits.avatarFrame', labelKey: 'title', languageCode: 'en', translatedText: 'Avatar Frame' },
    { scopeKey: 'vipBenefits.benefits.avatarFrame', labelKey: 'title', languageCode: 'zh', translatedText: '头像框' },
    { scopeKey: 'vipBenefits.benefits.avatarFrame', labelKey: 'free', languageCode: 'en', translatedText: 'Basic frame' },
    { scopeKey: 'vipBenefits.benefits.avatarFrame', labelKey: 'free', languageCode: 'zh', translatedText: '基础框架' },
    { scopeKey: 'vipBenefits.benefits.avatarFrame', labelKey: 'vip', languageCode: 'en', translatedText: 'Dynamic bamboo leaf frame' },
    { scopeKey: 'vipBenefits.benefits.avatarFrame', labelKey: 'vip', languageCode: 'zh', translatedText: '动态竹叶框架' },

    // VIP Benefits Details - Title
    { scopeKey: 'vipBenefits.benefits.title', labelKey: 'title', languageCode: 'en', translatedText: 'Title Display' },
    { scopeKey: 'vipBenefits.benefits.title', labelKey: 'title', languageCode: 'zh', translatedText: '称号显示' },
    { scopeKey: 'vipBenefits.benefits.title', labelKey: 'free', languageCode: 'en', translatedText: 'None' },
    { scopeKey: 'vipBenefits.benefits.title', labelKey: 'free', languageCode: 'zh', translatedText: '无' },
    { scopeKey: 'vipBenefits.benefits.title', labelKey: 'vip', languageCode: 'en', translatedText: '"Guardian" title next to name' },
    { scopeKey: 'vipBenefits.benefits.title', labelKey: 'vip', languageCode: 'zh', translatedText: '名字旁显示"守护者"称号' },

    // VIP Benefits Details - Bamboo Reward
    { scopeKey: 'vipBenefits.benefits.bambooReward', labelKey: 'title', languageCode: 'en', translatedText: 'Bamboo Rewards' },
    { scopeKey: 'vipBenefits.benefits.bambooReward', labelKey: 'title', languageCode: 'zh', translatedText: '竹子奖励' },
    { scopeKey: 'vipBenefits.benefits.bambooReward', labelKey: 'free', languageCode: 'en', translatedText: 'Normal (x1)' },
    { scopeKey: 'vipBenefits.benefits.bambooReward', labelKey: 'free', languageCode: 'zh', translatedText: '普通 (x1)' },
    { scopeKey: 'vipBenefits.benefits.bambooReward', labelKey: 'vip', languageCode: 'en', translatedText: 'Double (x2)' },
    { scopeKey: 'vipBenefits.benefits.bambooReward', labelKey: 'vip', languageCode: 'zh', translatedText: '双倍 (x2)' },

    // VIP Benefits Details - Growth Speed
    { scopeKey: 'vipBenefits.benefits.growthSpeed', labelKey: 'title', languageCode: 'en', translatedText: 'Panda Growth Speed' },
    { scopeKey: 'vipBenefits.benefits.growthSpeed', labelKey: 'title', languageCode: 'zh', translatedText: '熊猫成长速度' },
    { scopeKey: 'vipBenefits.benefits.growthSpeed', labelKey: 'free', languageCode: 'en', translatedText: 'Normal speed' },
    { scopeKey: 'vipBenefits.benefits.growthSpeed', labelKey: 'free', languageCode: 'zh', translatedText: '正常速度' },
    { scopeKey: 'vipBenefits.benefits.growthSpeed', labelKey: 'vip', languageCode: 'en', translatedText: '+50% experience' },
    { scopeKey: 'vipBenefits.benefits.growthSpeed', labelKey: 'vip', languageCode: 'zh', translatedText: '+50% 经验值' },

    // VIP Benefits Details - Lucky Draw
    { scopeKey: 'vipBenefits.benefits.luckyDraw', labelKey: 'title', languageCode: 'en', translatedText: 'Daily Lucky Draw' },
    { scopeKey: 'vipBenefits.benefits.luckyDraw', labelKey: 'title', languageCode: 'zh', translatedText: '每日幸运抽奖' },
    { scopeKey: 'vipBenefits.benefits.luckyDraw', labelKey: 'free', languageCode: 'en', translatedText: '1 time' },
    { scopeKey: 'vipBenefits.benefits.luckyDraw', labelKey: 'free', languageCode: 'zh', translatedText: '1 次' },
    { scopeKey: 'vipBenefits.benefits.luckyDraw', labelKey: 'vip', languageCode: 'en', translatedText: '3 times' },
    { scopeKey: 'vipBenefits.benefits.luckyDraw', labelKey: 'vip', languageCode: 'zh', translatedText: '3 次' },

    // VIP Benefits Details - Custom Goals
    { scopeKey: 'vipBenefits.benefits.customGoals', labelKey: 'title', languageCode: 'en', translatedText: 'Custom Goals' },
    { scopeKey: 'vipBenefits.benefits.customGoals', labelKey: 'title', languageCode: 'zh', translatedText: '自定义目标' },
    { scopeKey: 'vipBenefits.benefits.customGoals', labelKey: 'free', languageCode: 'en', translatedText: '1 goal' },
    { scopeKey: 'vipBenefits.benefits.customGoals', labelKey: 'free', languageCode: 'zh', translatedText: '1 个目标' },
    { scopeKey: 'vipBenefits.benefits.customGoals', labelKey: 'vip', languageCode: 'en', translatedText: '5 goals' },
    { scopeKey: 'vipBenefits.benefits.customGoals', labelKey: 'vip', languageCode: 'zh', translatedText: '5 个目标' },

    // VIP Benefits Details - Panda Skins
    { scopeKey: 'vipBenefits.benefits.pandaSkins', labelKey: 'title', languageCode: 'en', translatedText: 'Panda Appearances' },
    { scopeKey: 'vipBenefits.benefits.pandaSkins', labelKey: 'title', languageCode: 'zh', translatedText: '熊猫外观' },
    { scopeKey: 'vipBenefits.benefits.pandaSkins', labelKey: 'free', languageCode: 'en', translatedText: 'Basic skins' },
    { scopeKey: 'vipBenefits.benefits.pandaSkins', labelKey: 'free', languageCode: 'zh', translatedText: '基础外观' },
    { scopeKey: 'vipBenefits.benefits.pandaSkins', labelKey: 'vip', languageCode: 'en', translatedText: 'Exclusive VIP skins' },
    { scopeKey: 'vipBenefits.benefits.pandaSkins', labelKey: 'vip', languageCode: 'zh', translatedText: '专属VIP外观' },

    // VIP Benefits Details - Special Tasks
    { scopeKey: 'vipBenefits.benefits.specialTasks', labelKey: 'title', languageCode: 'en', translatedText: 'Special Quests' },
    { scopeKey: 'vipBenefits.benefits.specialTasks', labelKey: 'title', languageCode: 'zh', translatedText: '特殊任务' },
    { scopeKey: 'vipBenefits.benefits.specialTasks', labelKey: 'free', languageCode: 'en', translatedText: 'None' },
    { scopeKey: 'vipBenefits.benefits.specialTasks', labelKey: 'free', languageCode: 'zh', translatedText: '无' },
    { scopeKey: 'vipBenefits.benefits.specialTasks', labelKey: 'vip', languageCode: 'en', translatedText: 'Exclusive "Secret Garden" series' },
    { scopeKey: 'vipBenefits.benefits.specialTasks', labelKey: 'vip', languageCode: 'zh', translatedText: '专属"秘密花园"系列' },

    // VIP Benefits Details - Meditation
    { scopeKey: 'vipBenefits.benefits.meditation', labelKey: 'title', languageCode: 'en', translatedText: 'Meditation Courses' },
    { scopeKey: 'vipBenefits.benefits.meditation', labelKey: 'title', languageCode: 'zh', translatedText: '冥想课程' },
    { scopeKey: 'vipBenefits.benefits.meditation', labelKey: 'free', languageCode: 'en', translatedText: 'Basic courses' },
    { scopeKey: 'vipBenefits.benefits.meditation', labelKey: 'free', languageCode: 'zh', translatedText: '基础课程' },
    { scopeKey: 'vipBenefits.benefits.meditation', labelKey: 'vip', languageCode: 'en', translatedText: 'All premium courses' },
    { scopeKey: 'vipBenefits.benefits.meditation', labelKey: 'vip', languageCode: 'zh', translatedText: '所有高级课程' },

    // 商店页面标签
    { scopeKey: 'storeView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Store' },
    { scopeKey: 'storeView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '商店' },
    { scopeKey: 'storeView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading store content...' },
    { scopeKey: 'storeView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载商店内容...' },
    { scopeKey: 'storeView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Store Page Error' },
    { scopeKey: 'storeView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '商店页面错误' },
    { scopeKey: 'storeView', labelKey: 'retryButtonText', languageCode: 'en', translatedText: 'Retry' },
    { scopeKey: 'storeView', labelKey: 'retryButtonText', languageCode: 'zh', translatedText: '重试' },
    { scopeKey: 'storeView.vipToggleButton', labelKey: 'showVip', languageCode: 'en', translatedText: 'View VIP Membership' },
    { scopeKey: 'storeView.vipToggleButton', labelKey: 'showVip', languageCode: 'zh', translatedText: '查看VIP会员' },
    { scopeKey: 'storeView.vipToggleButton', labelKey: 'backToStore', languageCode: 'en', translatedText: 'Back to Store' },
    { scopeKey: 'storeView.vipToggleButton', labelKey: 'backToStore', languageCode: 'zh', translatedText: '返回商店' },
    { scopeKey: 'storeView', labelKey: 'featuredItemsTitle', languageCode: 'en', translatedText: 'Featured Items' },
    { scopeKey: 'storeView', labelKey: 'featuredItemsTitle', languageCode: 'zh', translatedText: '特色物品' },
    { scopeKey: 'storeView', labelKey: 'saleItemsTitle', languageCode: 'en', translatedText: 'Sale Items' },
    { scopeKey: 'storeView', labelKey: 'saleItemsTitle', languageCode: 'zh', translatedText: '促销物品' },
    { scopeKey: 'storeView', labelKey: 'categoryItemsTitle', languageCode: 'en', translatedText: 'Category Items' },
    { scopeKey: 'storeView', labelKey: 'categoryItemsTitle', languageCode: 'zh', translatedText: '分类物品' },
    { scopeKey: 'storeView', labelKey: 'noItemsMessage', languageCode: 'en', translatedText: 'No items in this category' },
    { scopeKey: 'storeView', labelKey: 'noItemsMessage', languageCode: 'zh', translatedText: '该类别暂无物品' },

    // 茶室页面标签
    { scopeKey: 'teaRoomView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Tea Room' },
    { scopeKey: 'teaRoomView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '静心茶室' },
    { scopeKey: 'teaRoomView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading tea room content...' },
    { scopeKey: 'teaRoomView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载茶室内容...' },
    { scopeKey: 'teaRoomView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Tea Room Page Error' },
    { scopeKey: 'teaRoomView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '茶室页面错误' },
    { scopeKey: 'teaRoomView', labelKey: 'retryButtonText', languageCode: 'en', translatedText: 'Retry' },
    { scopeKey: 'teaRoomView', labelKey: 'retryButtonText', languageCode: 'zh', translatedText: '重试' },
    { scopeKey: 'teaRoomView.moodTrackingSection', labelKey: 'title', languageCode: 'en', translatedText: 'Mood Tracking' },
    { scopeKey: 'teaRoomView.moodTrackingSection', labelKey: 'title', languageCode: 'zh', translatedText: '情绪追踪' },
    { scopeKey: 'teaRoomView.reflectionSection', labelKey: 'title', languageCode: 'en', translatedText: 'Reflection' },
    { scopeKey: 'teaRoomView.reflectionSection', labelKey: 'title', languageCode: 'zh', translatedText: '反思' },
    { scopeKey: 'teaRoomView.reflectionSection', labelKey: 'description', languageCode: 'en', translatedText: 'Take some time to reflect on your experiences, feelings, and thoughts to better understand yourself and find direction.' },
    { scopeKey: 'teaRoomView.reflectionSection', labelKey: 'description', languageCode: 'zh', translatedText: '花点时间反思你的经历、感受和想法，可以帮助你更好地了解自己，并找到前进的方向。' },
    { scopeKey: 'teaRoomView.reflectionSection', labelKey: 'startReflectionButton', languageCode: 'en', translatedText: 'Start Reflection' },
    { scopeKey: 'teaRoomView.reflectionSection', labelKey: 'startReflectionButton', languageCode: 'zh', translatedText: '开始反思' },
    { scopeKey: 'teaRoomView.reflectionSection', labelKey: 'viewHistoryButton', languageCode: 'en', translatedText: 'View Reflection History' },
    { scopeKey: 'teaRoomView.reflectionSection', labelKey: 'viewHistoryButton', languageCode: 'zh', translatedText: '查看历史反思' },
    { scopeKey: 'teaRoomView.dailyTipSection', labelKey: 'title', languageCode: 'en', translatedText: 'Daily Wisdom' },
    { scopeKey: 'teaRoomView.dailyTipSection', labelKey: 'title', languageCode: 'zh', translatedText: '每日智慧' },
    { scopeKey: 'teaRoomView.dailyTipSection', labelKey: 'content', languageCode: 'en', translatedText: 'Self-compassion is an essential part of mental health. When facing difficulties, try to treat yourself as you would a good friend, with understanding and kindness.' },
    { scopeKey: 'teaRoomView.dailyTipSection', labelKey: 'content', languageCode: 'zh', translatedText: '自我关怀是心理健康的重要组成部分。面对困难时，试着像对待好朋友一样对待自己，给予理解和善意。' },

    // 能力页面标签
    { scopeKey: 'abilitiesView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Panda Abilities' },
    { scopeKey: 'abilitiesView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '熊猫能力' },
    { scopeKey: 'abilitiesView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading abilities...' },
    { scopeKey: 'abilitiesView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载能力中...' },
    { scopeKey: 'abilitiesView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Abilities Page Error' },
    { scopeKey: 'abilitiesView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '能力页面错误' },
    { scopeKey: 'abilitiesView', labelKey: 'errorMessage', languageCode: 'en', translatedText: 'Failed to load abilities' },
    { scopeKey: 'abilitiesView', labelKey: 'errorMessage', languageCode: 'zh', translatedText: '加载能力失败' },
    { scopeKey: 'abilitiesView', labelKey: 'retryButtonText', languageCode: 'en', translatedText: 'Retry' },
    { scopeKey: 'abilitiesView', labelKey: 'retryButtonText', languageCode: 'zh', translatedText: '重试' },
    { scopeKey: 'abilitiesView', labelKey: 'pandaLevelLabel', languageCode: 'en', translatedText: 'Panda Level' },
    { scopeKey: 'abilitiesView', labelKey: 'pandaLevelLabel', languageCode: 'zh', translatedText: '熊猫等级' },
    { scopeKey: 'abilitiesView', labelKey: 'unlockedAbilitiesLabel', languageCode: 'en', translatedText: 'Unlocked Abilities' },
    { scopeKey: 'abilitiesView', labelKey: 'unlockedAbilitiesLabel', languageCode: 'zh', translatedText: '已解锁能力' },
    { scopeKey: 'abilitiesView', labelKey: 'abilitiesDescription', languageCode: 'en', translatedText: 'Abilities are special powers that your panda can use to help you in your tasks.' },
    { scopeKey: 'abilitiesView', labelKey: 'abilitiesDescription', languageCode: 'zh', translatedText: '能力是熊猫可以使用的特殊力量，可以帮助你完成任务。' },
    { scopeKey: 'abilitiesView', labelKey: 'noAbilitiesMessage', languageCode: 'en', translatedText: 'No abilities found' },
    { scopeKey: 'abilitiesView', labelKey: 'noAbilitiesMessage', languageCode: 'zh', translatedText: '暂无能力' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'statusLabel', languageCode: 'en', translatedText: 'Status' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'statusLabel', languageCode: 'zh', translatedText: '状态' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'typeLabel', languageCode: 'en', translatedText: 'Type' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'typeLabel', languageCode: 'zh', translatedText: '类型' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'allLabel', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'allLabel', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'unlockedLabel', languageCode: 'en', translatedText: 'Unlocked' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'unlockedLabel', languageCode: 'zh', translatedText: '已解锁' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'activeLabel', languageCode: 'en', translatedText: 'Active' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'activeLabel', languageCode: 'zh', translatedText: '已激活' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'lockedLabel', languageCode: 'en', translatedText: 'Locked' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'lockedLabel', languageCode: 'zh', translatedText: '已锁定' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'passiveLabel', languageCode: 'en', translatedText: 'Passive' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'passiveLabel', languageCode: 'zh', translatedText: '被动' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'ultimateLabel', languageCode: 'en', translatedText: 'Ultimate' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'ultimateLabel', languageCode: 'zh', translatedText: '终极' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'clearFiltersLabel', languageCode: 'en', translatedText: 'Clear All Filters' },
    { scopeKey: 'abilitiesView.filters', labelKey: 'clearFiltersLabel', languageCode: 'zh', translatedText: '清除所有过滤器' },

    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'typePassive', languageCode: 'en', translatedText: 'Passive' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'typePassive', languageCode: 'zh', translatedText: '被动' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'typeActive', languageCode: 'en', translatedText: 'Active' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'typeActive', languageCode: 'zh', translatedText: '主动' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'typeUltimate', languageCode: 'en', translatedText: 'Ultimate' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'typeUltimate', languageCode: 'zh', translatedText: '终极' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'typeUnknown', languageCode: 'en', translatedText: 'Unknown' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'typeUnknown', languageCode: 'zh', translatedText: '未知' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'rarityCommon', languageCode: 'en', translatedText: 'Common' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'rarityCommon', languageCode: 'zh', translatedText: '普通' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'rarityUncommon', languageCode: 'en', translatedText: 'Uncommon' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'rarityUncommon', languageCode: 'zh', translatedText: '不常见' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'rarityRare', languageCode: 'en', translatedText: 'Rare' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'rarityRare', languageCode: 'zh', translatedText: '稀有' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'rarityEpic', languageCode: 'en', translatedText: 'Epic' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'rarityEpic', languageCode: 'zh', translatedText: '史诗' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'rarityLegendary', languageCode: 'en', translatedText: 'Legendary' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'rarityLegendary', languageCode: 'zh', translatedText: '传说' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'requiredLevelLabel', languageCode: 'en', translatedText: 'Required Level' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'requiredLevelLabel', languageCode: 'zh', translatedText: '需要等级' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'cooldownLabel', languageCode: 'en', translatedText: 'Cooldown' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'cooldownLabel', languageCode: 'zh', translatedText: '冷却时间' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'cooldownRemainingLabel', languageCode: 'en', translatedText: 'Cooling down' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'cooldownRemainingLabel', languageCode: 'zh', translatedText: '冷却中' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'activateButtonText', languageCode: 'en', translatedText: 'Activate Ability' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'activateButtonText', languageCode: 'zh', translatedText: '激活能力' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'alreadyActivatedText', languageCode: 'en', translatedText: 'Already Activated' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'alreadyActivatedText', languageCode: 'zh', translatedText: '已激活' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'minutesUnit', languageCode: 'en', translatedText: 'min' },
    { scopeKey: 'abilitiesView.abilityCard', labelKey: 'minutesUnit', languageCode: 'zh', translatedText: '分钟' },

    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'title', languageCode: 'en', translatedText: 'Ability Details' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'title', languageCode: 'zh', translatedText: '能力详情' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'requiredLevelLabel', languageCode: 'en', translatedText: 'Required Level' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'requiredLevelLabel', languageCode: 'zh', translatedText: '解锁等级' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'levelsNeededText', languageCode: 'en', translatedText: 'Need' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'levelsNeededText', languageCode: 'zh', translatedText: '还需' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'cooldownLabel', languageCode: 'en', translatedText: 'Cooldown' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'cooldownLabel', languageCode: 'zh', translatedText: '冷却时间' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'rarityLabel', languageCode: 'en', translatedText: 'Rarity' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'rarityLabel', languageCode: 'zh', translatedText: '稀有度' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'typeLabel', languageCode: 'en', translatedText: 'Type' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'typeLabel', languageCode: 'zh', translatedText: '类型' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'effectLabel', languageCode: 'en', translatedText: 'Effect Value' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'effectLabel', languageCode: 'zh', translatedText: '效果值' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'activateButtonText', languageCode: 'en', translatedText: 'Activate Ability' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'activateButtonText', languageCode: 'zh', translatedText: '激活能力' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'alreadyActivatedText', languageCode: 'en', translatedText: 'Already Activated' },
    { scopeKey: 'abilitiesView.abilityDetail', labelKey: 'alreadyActivatedText', languageCode: 'zh', translatedText: '已激活' },

    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'title', languageCode: 'en', translatedText: 'Ability Unlocked' },
    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'title', languageCode: 'zh', translatedText: '能力解锁' },
    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'newAbilityTitle', languageCode: 'en', translatedText: 'New Ability Unlocked!' },
    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'newAbilityTitle', languageCode: 'zh', translatedText: '解锁新能力！' },
    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'nextButtonText', languageCode: 'en', translatedText: 'Next Ability' },
    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'nextButtonText', languageCode: 'zh', translatedText: '下一个能力' },
    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'viewAllButtonText', languageCode: 'en', translatedText: 'View All Abilities' },
    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'viewAllButtonText', languageCode: 'zh', translatedText: '查看所有能力' },
    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'allUnlockedTitle', languageCode: 'en', translatedText: 'Newly Unlocked Abilities' },
    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'allUnlockedTitle', languageCode: 'zh', translatedText: '新解锁的能力' },
    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'closeButtonText', languageCode: 'en', translatedText: 'Close' },
    { scopeKey: 'abilitiesView.abilityUnlockNotification', labelKey: 'closeButtonText', languageCode: 'zh', translatedText: '关闭' },

    // Ability names and descriptions
    { scopeKey: 'abilities', labelKey: 'bambooHeart.name', languageCode: 'en', translatedText: 'Bamboo Heart' },
    { scopeKey: 'abilities', labelKey: 'bambooHeart.name', languageCode: 'zh', translatedText: '竹林之心' },
    { scopeKey: 'abilities', labelKey: 'bambooHeart.description', languageCode: 'en', translatedText: 'Passive: Increases experience gained from completing tasks by 10%' },
    { scopeKey: 'abilities', labelKey: 'bambooHeart.description', languageCode: 'zh', translatedText: '被动：完成任务时获得的经验值增加10%' },

    { scopeKey: 'abilities', labelKey: 'pandaVitality.name', languageCode: 'en', translatedText: 'Panda Vitality' },
    { scopeKey: 'abilities', labelKey: 'pandaVitality.name', languageCode: 'zh', translatedText: '熊猫活力' },
    { scopeKey: 'abilities', labelKey: 'pandaVitality.description', languageCode: 'en', translatedText: 'Passive: Increases panda energy recovery rate by 15%' },
    { scopeKey: 'abilities', labelKey: 'pandaVitality.description', languageCode: 'zh', translatedText: '被动：熊猫能量恢复速度提高15%' },

    { scopeKey: 'abilities', labelKey: 'bambooFocus.name', languageCode: 'en', translatedText: 'Bamboo Focus' },
    { scopeKey: 'abilities', labelKey: 'bambooFocus.name', languageCode: 'zh', translatedText: '竹影专注' },
    { scopeKey: 'abilities', labelKey: 'bambooFocus.description', languageCode: 'en', translatedText: 'Active: When activated, increases experience gained from completing tasks by 25% for 1 hour' },
    { scopeKey: 'abilities', labelKey: 'bambooFocus.description', languageCode: 'zh', translatedText: '主动：激活后，1小时内完成任务获得的经验值增加25%' },

    { scopeKey: 'abilities', labelKey: 'pandaWisdom.name', languageCode: 'en', translatedText: 'Panda Wisdom' },
    { scopeKey: 'abilities', labelKey: 'pandaWisdom.name', languageCode: 'zh', translatedText: '熊猫智慧' },
    { scopeKey: 'abilities', labelKey: 'pandaWisdom.description', languageCode: 'en', translatedText: 'Active: When activated, increases rewards from completed tasks by 20% for 2 hours' },
    { scopeKey: 'abilities', labelKey: 'pandaWisdom.description', languageCode: 'zh', translatedText: '主动：激活后，2小时内任务完成奖励数量增加20%' },

    { scopeKey: 'abilities', labelKey: 'bambooMaster.name', languageCode: 'en', translatedText: 'Bamboo Master' },
    { scopeKey: 'abilities', labelKey: 'bambooMaster.name', languageCode: 'zh', translatedText: '竹林大师' },
    { scopeKey: 'abilities', labelKey: 'bambooMaster.description', languageCode: 'en', translatedText: 'Ultimate: When activated, increases all ability effects by 50% for 4 hours' },
    { scopeKey: 'abilities', labelKey: 'bambooMaster.description', languageCode: 'zh', translatedText: '终极：激活后，4小时内所有能力效果提升50%' },

    // 及时奖励页面标签
    { scopeKey: 'timelyRewardsView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Timely Rewards' },
    { scopeKey: 'timelyRewardsView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '及时奖励' },
    { scopeKey: 'timelyRewardsView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading rewards...' },
    { scopeKey: 'timelyRewardsView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载奖励中...' },
    { scopeKey: 'timelyRewardsView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Timely Rewards Page Error' },
    { scopeKey: 'timelyRewardsView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '及时奖励页面错误' },
    { scopeKey: 'timelyRewardsView', labelKey: 'noRewardsMessage', languageCode: 'en', translatedText: 'No rewards found' },
    { scopeKey: 'timelyRewardsView', labelKey: 'noRewardsMessage', languageCode: 'zh', translatedText: '暂无奖励' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'statusLabel', languageCode: 'en', translatedText: 'Status' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'statusLabel', languageCode: 'zh', translatedText: '状态' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'allLabel', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'allLabel', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'statusActiveLabel', languageCode: 'en', translatedText: 'Active' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'statusActiveLabel', languageCode: 'zh', translatedText: '进行中' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'statusCompletedLabel', languageCode: 'en', translatedText: 'Completed' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'statusCompletedLabel', languageCode: 'zh', translatedText: '已完成' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'statusExpiredLabel', languageCode: 'en', translatedText: 'Expired' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'statusExpiredLabel', languageCode: 'zh', translatedText: '已过期' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'typeLabel', languageCode: 'en', translatedText: 'Type' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'typeLabel', languageCode: 'zh', translatedText: '类型' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'typeDailyLabel', languageCode: 'en', translatedText: 'Daily' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'typeDailyLabel', languageCode: 'zh', translatedText: '每日' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'typeWeeklyLabel', languageCode: 'en', translatedText: 'Weekly' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'typeWeeklyLabel', languageCode: 'zh', translatedText: '每周' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'typeStreakLabel', languageCode: 'en', translatedText: 'Streak' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'typeStreakLabel', languageCode: 'zh', translatedText: '连续完成' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'typeSpecialLabel', languageCode: 'en', translatedText: 'Special' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'typeSpecialLabel', languageCode: 'zh', translatedText: '特殊' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'clearFiltersLabel', languageCode: 'en', translatedText: 'Clear All Filters' },
    { scopeKey: 'timelyRewardsView.filters', labelKey: 'clearFiltersLabel', languageCode: 'zh', translatedText: '清除所有过滤器' },
    { scopeKey: 'timelyRewardsView.luckyDraw', labelKey: 'buttonText', languageCode: 'en', translatedText: 'Lucky Draw' },
    { scopeKey: 'timelyRewardsView.luckyDraw', labelKey: 'buttonText', languageCode: 'zh', translatedText: '幸运抽奖' },
    { scopeKey: 'timelyRewardsView.luckyDraw', labelKey: 'title', languageCode: 'en', translatedText: 'Lucky Draw' },
    { scopeKey: 'timelyRewardsView.luckyDraw', labelKey: 'title', languageCode: 'zh', translatedText: '幸运抽奖' },

    // TimelyRewardCard 组件标签
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeLabel', languageCode: 'en', translatedText: 'Type' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeLabel', languageCode: 'zh', translatedText: '类型' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeDaily', languageCode: 'en', translatedText: 'Daily Reward' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeDaily', languageCode: 'zh', translatedText: '每日奖励' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeMorning', languageCode: 'en', translatedText: 'Early Bird Reward' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeMorning', languageCode: 'zh', translatedText: '早起鸟奖励' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeStreak', languageCode: 'en', translatedText: 'Streak Reward' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeStreak', languageCode: 'zh', translatedText: '连续完成奖励' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeSpecial', languageCode: 'en', translatedText: 'Special Reward' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeSpecial', languageCode: 'zh', translatedText: '特殊奖励' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusLabel', languageCode: 'en', translatedText: 'Status' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusLabel', languageCode: 'zh', translatedText: '状态' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusActive', languageCode: 'en', translatedText: 'Active' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusActive', languageCode: 'zh', translatedText: '进行中' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusCompleted', languageCode: 'en', translatedText: 'Completed' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusCompleted', languageCode: 'zh', translatedText: '已完成' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusExpired', languageCode: 'en', translatedText: 'Expired' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusExpired', languageCode: 'zh', translatedText: '已过期' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusUpcoming', languageCode: 'en', translatedText: 'Upcoming' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusUpcoming', languageCode: 'zh', translatedText: '即将开始' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'remainingTimeLabel', languageCode: 'en', translatedText: 'Remaining time' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'remainingTimeLabel', languageCode: 'zh', translatedText: '剩余时间' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'timeEnded', languageCode: 'en', translatedText: 'Ended' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'timeEnded', languageCode: 'zh', translatedText: '已结束' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'hourUnit', languageCode: 'en', translatedText: 'h' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'hourUnit', languageCode: 'zh', translatedText: '小时' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'minuteUnit', languageCode: 'en', translatedText: 'm' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'minuteUnit', languageCode: 'zh', translatedText: '分钟' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'luckyPointsLabel', languageCode: 'en', translatedText: 'Lucky Points' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'luckyPointsLabel', languageCode: 'zh', translatedText: '幸运点' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'claimRewardButton', languageCode: 'en', translatedText: 'Claim Reward' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'claimRewardButton', languageCode: 'zh', translatedText: '领取奖励' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'inProgressButton', languageCode: 'en', translatedText: 'In Progress...' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'inProgressButton', languageCode: 'zh', translatedText: '进行中...' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'completedOnLabel', languageCode: 'en', translatedText: 'Completed on' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'completedOnLabel', languageCode: 'zh', translatedText: '完成于' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'progressLabel', languageCode: 'en', translatedText: 'Progress' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'progressLabel', languageCode: 'zh', translatedText: '进度' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'startTimeLabel', languageCode: 'en', translatedText: 'Start Time' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'startTimeLabel', languageCode: 'zh', translatedText: '开始时间' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'endTimeLabel', languageCode: 'en', translatedText: 'End Time' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'endTimeLabel', languageCode: 'zh', translatedText: '结束时间' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'completedTimeLabel', languageCode: 'en', translatedText: 'Completed Time' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'completedTimeLabel', languageCode: 'zh', translatedText: '完成时间' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'continueEffortButton', languageCode: 'en', translatedText: 'Keep Going' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'continueEffortButton', languageCode: 'zh', translatedText: '继续努力' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'noRewardsMessage', languageCode: 'en', translatedText: 'No timely rewards available' },
    { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'noRewardsMessage', languageCode: 'zh', translatedText: '暂无及时奖励' },

    // VIP Benefits Page
    { scopeKey: 'vipBenefitsView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'VIP Benefits' },
    { scopeKey: 'vipBenefitsView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: 'VIP特权' },
    { scopeKey: 'vipBenefitsView', labelKey: 'headerTitle', languageCode: 'en', translatedText: 'Become a Panda Guardian' },
    { scopeKey: 'vipBenefitsView', labelKey: 'headerTitle', languageCode: 'zh', translatedText: '成为熊猫守护者' },
    { scopeKey: 'vipBenefitsView', labelKey: 'headerSubtitle', languageCode: 'en', translatedText: 'Unlock exclusive benefits and accelerate your growth' },
    { scopeKey: 'vipBenefitsView', labelKey: 'headerSubtitle', languageCode: 'zh', translatedText: '解锁专属特权，加速您的成长' },
    { scopeKey: 'vipBenefitsView', labelKey: 'compareTitle', languageCode: 'en', translatedText: 'Compare Benefits' },
    { scopeKey: 'vipBenefitsView', labelKey: 'compareTitle', languageCode: 'zh', translatedText: '特权对比' },
    { scopeKey: 'vipBenefitsView', labelKey: 'freeTitle', languageCode: 'en', translatedText: 'Free Panda Friend' },
    { scopeKey: 'vipBenefitsView', labelKey: 'freeTitle', languageCode: 'zh', translatedText: '免费熊猫好友' },
    { scopeKey: 'vipBenefitsView', labelKey: 'vipTitle', languageCode: 'en', translatedText: 'VIP Panda Guardian' },
    { scopeKey: 'vipBenefitsView', labelKey: 'vipTitle', languageCode: 'zh', translatedText: 'VIP熊猫守护者' },

    { scopeKey: 'vipBenefitsView.benefitCategories', labelKey: 'identity', languageCode: 'en', translatedText: 'Identity' },
    { scopeKey: 'vipBenefitsView.benefitCategories', labelKey: 'identity', languageCode: 'zh', translatedText: '身份标识' },
    { scopeKey: 'vipBenefitsView.benefitCategories', labelKey: 'resources', languageCode: 'en', translatedText: 'Resources' },
    { scopeKey: 'vipBenefitsView.benefitCategories', labelKey: 'resources', languageCode: 'zh', translatedText: '资源获取' },
    { scopeKey: 'vipBenefitsView.benefitCategories', labelKey: 'features', languageCode: 'en', translatedText: 'Features' },
    { scopeKey: 'vipBenefitsView.benefitCategories', labelKey: 'features', languageCode: 'zh', translatedText: '功能特权' },
    { scopeKey: 'vipBenefitsView.benefitCategories', labelKey: 'exclusive', languageCode: 'en', translatedText: 'Exclusive Content' },
    { scopeKey: 'vipBenefitsView.benefitCategories', labelKey: 'exclusive', languageCode: 'zh', translatedText: '专属内容' },

    { scopeKey: 'vipBenefitsView.benefits.avatarFrame', labelKey: 'title', languageCode: 'en', translatedText: 'Avatar Frame' },
    { scopeKey: 'vipBenefitsView.benefits.avatarFrame', labelKey: 'title', languageCode: 'zh', translatedText: '头像框' },
    { scopeKey: 'vipBenefitsView.benefits.avatarFrame', labelKey: 'free', languageCode: 'en', translatedText: 'Basic frame' },
    { scopeKey: 'vipBenefitsView.benefits.avatarFrame', labelKey: 'free', languageCode: 'zh', translatedText: '基础头像框' },
    { scopeKey: 'vipBenefitsView.benefits.avatarFrame', labelKey: 'vip', languageCode: 'en', translatedText: 'Dynamic bamboo leaf frame' },
    { scopeKey: 'vipBenefitsView.benefits.avatarFrame', labelKey: 'vip', languageCode: 'zh', translatedText: '动态竹叶头像框' },

    { scopeKey: 'vipBenefitsView.benefits.title', labelKey: 'title', languageCode: 'en', translatedText: 'Title Display' },
    { scopeKey: 'vipBenefitsView.benefits.title', labelKey: 'title', languageCode: 'zh', translatedText: '称号显示' },
    { scopeKey: 'vipBenefitsView.benefits.title', labelKey: 'free', languageCode: 'en', translatedText: 'None' },
    { scopeKey: 'vipBenefitsView.benefits.title', labelKey: 'free', languageCode: 'zh', translatedText: '无' },
    { scopeKey: 'vipBenefitsView.benefits.title', labelKey: 'vip', languageCode: 'en', translatedText: '"Guardian" title next to name' },
    { scopeKey: 'vipBenefitsView.benefits.title', labelKey: 'vip', languageCode: 'zh', translatedText: '名字旁显示"守护者"称号' },

    { scopeKey: 'vipBenefitsView.benefits.bambooReward', labelKey: 'title', languageCode: 'en', translatedText: 'Bamboo Rewards' },
    { scopeKey: 'vipBenefitsView.benefits.bambooReward', labelKey: 'title', languageCode: 'zh', translatedText: '竹子奖励' },
    { scopeKey: 'vipBenefitsView.benefits.bambooReward', labelKey: 'free', languageCode: 'en', translatedText: 'Normal (x1)' },
    { scopeKey: 'vipBenefitsView.benefits.bambooReward', labelKey: 'free', languageCode: 'zh', translatedText: '正常 (x1)' },
    { scopeKey: 'vipBenefitsView.benefits.bambooReward', labelKey: 'vip', languageCode: 'en', translatedText: 'Double (x2)' },
    { scopeKey: 'vipBenefitsView.benefits.bambooReward', labelKey: 'vip', languageCode: 'zh', translatedText: '双倍 (x2)' },

    { scopeKey: 'vipBenefitsView.benefits.growthSpeed', labelKey: 'title', languageCode: 'en', translatedText: 'Panda Growth Speed' },
    { scopeKey: 'vipBenefitsView.benefits.growthSpeed', labelKey: 'title', languageCode: 'zh', translatedText: '熊猫成长速度' },
    { scopeKey: 'vipBenefitsView.benefits.growthSpeed', labelKey: 'free', languageCode: 'en', translatedText: 'Normal speed' },
    { scopeKey: 'vipBenefitsView.benefits.growthSpeed', labelKey: 'free', languageCode: 'zh', translatedText: '正常速度' },
    { scopeKey: 'vipBenefitsView.benefits.growthSpeed', labelKey: 'vip', languageCode: 'en', translatedText: '+50% experience' },
    { scopeKey: 'vipBenefitsView.benefits.growthSpeed', labelKey: 'vip', languageCode: 'zh', translatedText: '经验值+50%' },

    { scopeKey: 'vipBenefitsView.benefits.luckyDraw', labelKey: 'title', languageCode: 'en', translatedText: 'Daily Lucky Draw' },
    { scopeKey: 'vipBenefitsView.benefits.luckyDraw', labelKey: 'title', languageCode: 'zh', translatedText: '每日幸运抽奖' },
    { scopeKey: 'vipBenefitsView.benefits.luckyDraw', labelKey: 'free', languageCode: 'en', translatedText: '1 time' },
    { scopeKey: 'vipBenefitsView.benefits.luckyDraw', labelKey: 'free', languageCode: 'zh', translatedText: '1次' },
    { scopeKey: 'vipBenefitsView.benefits.luckyDraw', labelKey: 'vip', languageCode: 'en', translatedText: '3 times' },
    { scopeKey: 'vipBenefitsView.benefits.luckyDraw', labelKey: 'vip', languageCode: 'zh', translatedText: '3次' },

    { scopeKey: 'vipBenefitsView.benefits.customGoals', labelKey: 'title', languageCode: 'en', translatedText: 'Custom Goals' },
    { scopeKey: 'vipBenefitsView.benefits.customGoals', labelKey: 'title', languageCode: 'zh', translatedText: '自定义目标' },
    { scopeKey: 'vipBenefitsView.benefits.customGoals', labelKey: 'free', languageCode: 'en', translatedText: '1 goal' },
    { scopeKey: 'vipBenefitsView.benefits.customGoals', labelKey: 'free', languageCode: 'zh', translatedText: '1个目标' },
    { scopeKey: 'vipBenefitsView.benefits.customGoals', labelKey: 'vip', languageCode: 'en', translatedText: '5 goals' },
    { scopeKey: 'vipBenefitsView.benefits.customGoals', labelKey: 'vip', languageCode: 'zh', translatedText: '5个目标' },

    { scopeKey: 'vipBenefitsView.benefits.pandaSkins', labelKey: 'title', languageCode: 'en', translatedText: 'Panda Appearances' },
    { scopeKey: 'vipBenefitsView.benefits.pandaSkins', labelKey: 'title', languageCode: 'zh', translatedText: '熊猫外观' },
    { scopeKey: 'vipBenefitsView.benefits.pandaSkins', labelKey: 'free', languageCode: 'en', translatedText: 'Basic skins' },
    { scopeKey: 'vipBenefitsView.benefits.pandaSkins', labelKey: 'free', languageCode: 'zh', translatedText: '基础外观' },
    { scopeKey: 'vipBenefitsView.benefits.pandaSkins', labelKey: 'vip', languageCode: 'en', translatedText: 'Exclusive VIP skins' },
    { scopeKey: 'vipBenefitsView.benefits.pandaSkins', labelKey: 'vip', languageCode: 'zh', translatedText: 'VIP专属外观' },

    { scopeKey: 'vipBenefitsView.benefits.specialTasks', labelKey: 'title', languageCode: 'en', translatedText: 'Special Quests' },
    { scopeKey: 'vipBenefitsView.benefits.specialTasks', labelKey: 'title', languageCode: 'zh', translatedText: '特殊任务' },
    { scopeKey: 'vipBenefitsView.benefits.specialTasks', labelKey: 'free', languageCode: 'en', translatedText: 'None' },
    { scopeKey: 'vipBenefitsView.benefits.specialTasks', labelKey: 'free', languageCode: 'zh', translatedText: '无' },
    { scopeKey: 'vipBenefitsView.benefits.specialTasks', labelKey: 'vip', languageCode: 'en', translatedText: 'Exclusive "Secret Garden" series' },
    { scopeKey: 'vipBenefitsView.benefits.specialTasks', labelKey: 'vip', languageCode: 'zh', translatedText: '专属"秘密花园"系列任务' },

    { scopeKey: 'vipBenefitsView.benefits.meditation', labelKey: 'title', languageCode: 'en', translatedText: 'Meditation Courses' },
    { scopeKey: 'vipBenefitsView.benefits.meditation', labelKey: 'title', languageCode: 'zh', translatedText: '冥想课程' },
    { scopeKey: 'vipBenefitsView.benefits.meditation', labelKey: 'free', languageCode: 'en', translatedText: 'Basic courses' },
    { scopeKey: 'vipBenefitsView.benefits.meditation', labelKey: 'free', languageCode: 'zh', translatedText: '基础课程' },
    { scopeKey: 'vipBenefitsView.benefits.meditation', labelKey: 'vip', languageCode: 'en', translatedText: 'All premium courses' },
    { scopeKey: 'vipBenefitsView.benefits.meditation', labelKey: 'vip', languageCode: 'zh', translatedText: '所有高级课程' },

    { scopeKey: 'vipBenefitsView.buttons', labelKey: 'subscribe', languageCode: 'en', translatedText: 'Become a Guardian' },
    { scopeKey: 'vipBenefitsView.buttons', labelKey: 'subscribe', languageCode: 'zh', translatedText: '成为守护者' },
    { scopeKey: 'vipBenefitsView.buttons', labelKey: 'viewOptions', languageCode: 'en', translatedText: 'View Subscription Options' },
    { scopeKey: 'vipBenefitsView.buttons', labelKey: 'viewOptions', languageCode: 'zh', translatedText: '查看订阅选项' },
    { scopeKey: 'vipBenefitsView.buttons', labelKey: 'back', languageCode: 'en', translatedText: 'Back' },
    { scopeKey: 'vipBenefitsView.buttons', labelKey: 'back', languageCode: 'zh', translatedText: '返回' },

    { scopeKey: 'vipBenefitsView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading VIP benefits...' },
    { scopeKey: 'vipBenefitsView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载VIP特权...' },
    { scopeKey: 'vipBenefitsView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Error Loading VIP Benefits' },
    { scopeKey: 'vipBenefitsView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '加载VIP特权时出错' },
    { scopeKey: 'vipBenefitsView', labelKey: 'errorMessage', languageCode: 'en', translatedText: 'Failed to load VIP benefits. Please try again.' },
    { scopeKey: 'vipBenefitsView', labelKey: 'errorMessage', languageCode: 'zh', translatedText: '无法加载VIP特权。请重试。' },
    { scopeKey: 'vipBenefitsView', labelKey: 'retryButtonText', languageCode: 'en', translatedText: 'Retry' },
    { scopeKey: 'vipBenefitsView', labelKey: 'retryButtonText', languageCode: 'zh', translatedText: '重试' },

    // VIP Subscription Component
    { scopeKey: 'vipSubscription', labelKey: 'title', languageCode: 'en', translatedText: 'Choose Your Guardian Plan' },
    { scopeKey: 'vipSubscription', labelKey: 'title', languageCode: 'zh', translatedText: '选择您的守护者计划' },
    { scopeKey: 'vipSubscription', labelKey: 'subtitle', languageCode: 'en', translatedText: 'Select the plan that suits you best' },
    { scopeKey: 'vipSubscription', labelKey: 'subtitle', languageCode: 'zh', translatedText: '选择最适合您的计划' },

    { scopeKey: 'vipSubscription.monthly', labelKey: 'title', languageCode: 'en', translatedText: 'Monthly Guardian' },
    { scopeKey: 'vipSubscription.monthly', labelKey: 'title', languageCode: 'zh', translatedText: '月度守护者' },
    { scopeKey: 'vipSubscription.monthly', labelKey: 'price', languageCode: 'en', translatedText: '$9.99' },
    { scopeKey: 'vipSubscription.monthly', labelKey: 'price', languageCode: 'zh', translatedText: '¥69.99' },
    { scopeKey: 'vipSubscription.monthly', labelKey: 'monthlyPrice', languageCode: 'en', translatedText: '$9.99/month' },
    { scopeKey: 'vipSubscription.monthly', labelKey: 'monthlyPrice', languageCode: 'zh', translatedText: '¥69.99/月' },
    { scopeKey: 'vipSubscription.monthly', labelKey: 'benefits', languageCode: 'en', translatedText: 'All Guardian benefits,Monthly exclusive gift,Cancel anytime' },
    { scopeKey: 'vipSubscription.monthly', labelKey: 'benefits', languageCode: 'zh', translatedText: '所有守护者特权,月度专属礼物,随时可取消' },

    { scopeKey: 'vipSubscription.seasonal', labelKey: 'title', languageCode: 'en', translatedText: 'Seasonal Guardian' },
    { scopeKey: 'vipSubscription.seasonal', labelKey: 'title', languageCode: 'zh', translatedText: '季度守护者' },
    { scopeKey: 'vipSubscription.seasonal', labelKey: 'price', languageCode: 'en', translatedText: '$24.99' },
    { scopeKey: 'vipSubscription.seasonal', labelKey: 'price', languageCode: 'zh', translatedText: '¥169.99' },
    { scopeKey: 'vipSubscription.seasonal', labelKey: 'monthlyPrice', languageCode: 'en', translatedText: '$8.33/month' },
    { scopeKey: 'vipSubscription.seasonal', labelKey: 'monthlyPrice', languageCode: 'zh', translatedText: '¥56.66/月' },
    { scopeKey: 'vipSubscription.seasonal', labelKey: 'benefits', languageCode: 'en', translatedText: 'All Guardian benefits,Seasonal exclusive gift,Priority support,10% bonus on all rewards' },
    { scopeKey: 'vipSubscription.seasonal', labelKey: 'benefits', languageCode: 'zh', translatedText: '所有守护者特权,季度专属礼物,优先支持,所有奖励10%加成' },

    { scopeKey: 'vipSubscription.annual', labelKey: 'title', languageCode: 'en', translatedText: 'Annual Guardian' },
    { scopeKey: 'vipSubscription.annual', labelKey: 'title', languageCode: 'zh', translatedText: '年度守护者' },
    { scopeKey: 'vipSubscription.annual', labelKey: 'price', languageCode: 'en', translatedText: '$79.99' },
    { scopeKey: 'vipSubscription.annual', labelKey: 'price', languageCode: 'zh', translatedText: '¥549.99' },
    { scopeKey: 'vipSubscription.annual', labelKey: 'monthlyPrice', languageCode: 'en', translatedText: '$6.67/month' },
    { scopeKey: 'vipSubscription.annual', labelKey: 'monthlyPrice', languageCode: 'zh', translatedText: '¥45.83/月' },
    { scopeKey: 'vipSubscription.annual', labelKey: 'benefits', languageCode: 'en', translatedText: 'All Guardian benefits,Annual exclusive gift,VIP exclusive panda skin,Priority support,20% bonus on all rewards,Exclusive seasonal events' },
    { scopeKey: 'vipSubscription.annual', labelKey: 'benefits', languageCode: 'zh', translatedText: '所有守护者特权,年度专属礼物,VIP专属熊猫皮肤,优先支持,所有奖励20%加成,专属季节活动' },

    { scopeKey: 'vipSubscription.buttons', labelKey: 'subscribe', languageCode: 'en', translatedText: 'Subscribe' },
    { scopeKey: 'vipSubscription.buttons', labelKey: 'subscribe', languageCode: 'zh', translatedText: '订阅' },
    { scopeKey: 'vipSubscription.buttons', labelKey: 'restore', languageCode: 'en', translatedText: 'Restore Purchase' },
    { scopeKey: 'vipSubscription.buttons', labelKey: 'restore', languageCode: 'zh', translatedText: '恢复购买' },
    { scopeKey: 'vipSubscription.buttons', labelKey: 'cancel', languageCode: 'en', translatedText: 'Cancel' },
    { scopeKey: 'vipSubscription.buttons', labelKey: 'cancel', languageCode: 'zh', translatedText: '取消' },

    { scopeKey: 'vipSubscription.badges', labelKey: 'recommended', languageCode: 'en', translatedText: 'RECOMMENDED' },
    { scopeKey: 'vipSubscription.badges', labelKey: 'recommended', languageCode: 'zh', translatedText: '推荐' },
    { scopeKey: 'vipSubscription.badges', labelKey: 'bestValue', languageCode: 'en', translatedText: 'BEST VALUE' },
    { scopeKey: 'vipSubscription.badges', labelKey: 'bestValue', languageCode: 'zh', translatedText: '最优惠' },

    // meditationView scope
    { scopeKey: 'meditationView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Meditation Courses' },
    { scopeKey: 'meditationView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '冥想课程' },
    { scopeKey: 'meditationView', labelKey: 'pageDescription', languageCode: 'en', translatedText: 'Explore various meditation courses to enhance focus and inner peace.' },
    { scopeKey: 'meditationView', labelKey: 'pageDescription', languageCode: 'zh', translatedText: '探索各种冥想课程，提升专注力和内心平静。' },
    { scopeKey: 'meditationView', labelKey: 'statsTitle', languageCode: 'en', translatedText: 'Meditation Stats' },
    { scopeKey: 'meditationView', labelKey: 'statsTitle', languageCode: 'zh', translatedText: '冥想统计' },
    { scopeKey: 'meditationView', labelKey: 'statsTotalSessions', languageCode: 'en', translatedText: 'Total Sessions' },
    { scopeKey: 'meditationView', labelKey: 'statsTotalSessions', languageCode: 'zh', translatedText: '总冥想次数' },
    { scopeKey: 'meditationView', labelKey: 'statsTotalMinutes', languageCode: 'en', translatedText: 'Total Minutes' },
    { scopeKey: 'meditationView', labelKey: 'statsTotalMinutes', languageCode: 'zh', translatedText: '总冥想分钟' },
    { scopeKey: 'meditationView', labelKey: 'statsCurrentStreak', languageCode: 'en', translatedText: 'Current Streak' },
    { scopeKey: 'meditationView', labelKey: 'statsCurrentStreak', languageCode: 'zh', translatedText: '当前连续天数' },
    { scopeKey: 'meditationView', labelKey: 'statsLongestStreak', languageCode: 'en', translatedText: 'Longest Streak' },
    { scopeKey: 'meditationView', labelKey: 'statsLongestStreak', languageCode: 'zh', translatedText: '最长连续天数' },
    { scopeKey: 'meditationView', labelKey: 'statsCompletedCourses', languageCode: 'en', translatedText: 'Completed Courses' },
    { scopeKey: 'meditationView', labelKey: 'statsCompletedCourses', languageCode: 'zh', translatedText: '完成课程数' },
    { scopeKey: 'meditationView', labelKey: 'vipPromotionTitle', languageCode: 'en', translatedText: 'VIP Exclusive Advanced Courses' },
    { scopeKey: 'meditationView', labelKey: 'vipPromotionTitle', languageCode: 'zh', translatedText: 'VIP专属高级冥想课程' },
    { scopeKey: 'meditationView', labelKey: 'vipPromotionDescription', languageCode: 'en', translatedText: 'Upgrade to VIP to unlock advanced meditation courses, including Zen, Yoga Nidra, and Transcendental Meditation techniques for a deeper experience.' },
    { scopeKey: 'meditationView', labelKey: 'vipPromotionDescription', languageCode: 'zh', translatedText: '升级到VIP会员，解锁高级冥想课程，包括禅修、瑜伽睡眠和超觉冥想等专业技术，帮助您达到更深层次的冥想体验。' },
    { scopeKey: 'meditationView', labelKey: 'upgradeButton', languageCode: 'en', translatedText: 'Upgrade to VIP' },
    { scopeKey: 'meditationView', labelKey: 'upgradeButton', languageCode: 'zh', translatedText: '升级到VIP' },
    { scopeKey: 'meditationView', labelKey: 'difficultyFilterTitle', languageCode: 'en', translatedText: 'Difficulty' },
    { scopeKey: 'meditationView', labelKey: 'difficultyFilterTitle', languageCode: 'zh', translatedText: '难度' },
    { scopeKey: 'meditationView', labelKey: 'typeFilterTitle', languageCode: 'en', translatedText: 'Type' },
    { scopeKey: 'meditationView', labelKey: 'typeFilterTitle', languageCode: 'zh', translatedText: '类型' },
    { scopeKey: 'meditationView', labelKey: 'durationFilterTitle', languageCode: 'en', translatedText: 'Duration' },
    { scopeKey: 'meditationView', labelKey: 'durationFilterTitle', languageCode: 'zh', translatedText: '时长' },
    { scopeKey: 'meditationView', labelKey: 'allLabel', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'meditationView', labelKey: 'allLabel', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'meditationView', labelKey: 'difficultyBeginner', languageCode: 'en', translatedText: 'Beginner' },
    { scopeKey: 'meditationView', labelKey: 'difficultyBeginner', languageCode: 'zh', translatedText: '初级' },
    { scopeKey: 'meditationView', labelKey: 'difficultyIntermediate', languageCode: 'en', translatedText: 'Intermediate' },
    { scopeKey: 'meditationView', labelKey: 'difficultyIntermediate', languageCode: 'zh', translatedText: '中级' },
    { scopeKey: 'meditationView', labelKey: 'difficultyAdvanced', languageCode: 'en', translatedText: 'Advanced' },
    { scopeKey: 'meditationView', labelKey: 'difficultyAdvanced', languageCode: 'zh', translatedText: '高级' },
    { scopeKey: 'meditationView', labelKey: 'difficultyMaster', languageCode: 'en', translatedText: 'Master' },
    { scopeKey: 'meditationView', labelKey: 'difficultyMaster', languageCode: 'zh', translatedText: '大师' },
    { scopeKey: 'meditationView', labelKey: 'typeMindfulness', languageCode: 'en', translatedText: 'Mindfulness' },
    { scopeKey: 'meditationView', labelKey: 'typeMindfulness', languageCode: 'zh', translatedText: '正念冥想' },
    { scopeKey: 'meditationView', labelKey: 'typeBreathwork', languageCode: 'en', translatedText: 'Breathwork' },
    { scopeKey: 'meditationView', labelKey: 'typeBreathwork', languageCode: 'zh', translatedText: '呼吸练习' },
    { scopeKey: 'meditationView', labelKey: 'typeBodyScan', languageCode: 'en', translatedText: 'Body Scan' },
    { scopeKey: 'meditationView', labelKey: 'typeBodyScan', languageCode: 'zh', translatedText: '身体扫描' },
    { scopeKey: 'meditationView', labelKey: 'typeLovingKindness', languageCode: 'en', translatedText: 'Loving-Kindness' },
    { scopeKey: 'meditationView', labelKey: 'typeLovingKindness', languageCode: 'zh', translatedText: '慈心冥想' },
    { scopeKey: 'meditationView', labelKey: 'typeVisualization', languageCode: 'en', translatedText: 'Visualization' },
    { scopeKey: 'meditationView', labelKey: 'typeVisualization', languageCode: 'zh', translatedText: '可视化冥想' },
    { scopeKey: 'meditationView', labelKey: 'typeMantra', languageCode: 'en', translatedText: 'Mantra' },
    { scopeKey: 'meditationView', labelKey: 'typeMantra', languageCode: 'zh', translatedText: '咒语冥想' },
    { scopeKey: 'meditationView', labelKey: 'typeGuided', languageCode: 'en', translatedText: 'Guided Meditation' },
    { scopeKey: 'meditationView', labelKey: 'typeGuided', languageCode: 'zh', translatedText: '引导冥想' },
    { scopeKey: 'meditationView', labelKey: 'typeZen', languageCode: 'en', translatedText: 'Zen' },
    { scopeKey: 'meditationView', labelKey: 'typeZen', languageCode: 'zh', translatedText: '禅修' },
    { scopeKey: 'meditationView', labelKey: 'typeTranscendental', languageCode: 'en', translatedText: 'Transcendental' },
    { scopeKey: 'meditationView', labelKey: 'typeTranscendental', languageCode: 'zh', translatedText: '超觉冥想' },
    { scopeKey: 'meditationView', labelKey: 'typeYogaNidra', languageCode: 'en', translatedText: 'Yoga Nidra' },
    { scopeKey: 'meditationView', labelKey: 'typeYogaNidra', languageCode: 'zh', translatedText: '瑜伽睡眠' },
    { scopeKey: 'meditationView', labelKey: 'durationShort', languageCode: 'en', translatedText: 'Short (≤10 min)' },
    { scopeKey: 'meditationView', labelKey: 'durationShort', languageCode: 'zh', translatedText: '短 (≤10分钟)' },
    { scopeKey: 'meditationView', labelKey: 'durationMedium', languageCode: 'en', translatedText: 'Medium (11-20 min)' },
    { scopeKey: 'meditationView', labelKey: 'durationMedium', languageCode: 'zh', translatedText: '中 (11-20分钟)' },
    { scopeKey: 'meditationView', labelKey: 'durationLong', languageCode: 'en', translatedText: 'Long (>20 min)' },
    { scopeKey: 'meditationView', labelKey: 'durationLong', languageCode: 'zh', translatedText: '长 (>20分钟)' },
    { scopeKey: 'meditationView', labelKey: 'noCourseFound', languageCode: 'en', translatedText: 'No courses match your criteria.' },
    { scopeKey: 'meditationView', labelKey: 'noCourseFound', languageCode: 'zh', translatedText: '没有找到符合条件的课程。' },
    { scopeKey: 'meditationView', labelKey: 'tryDifferentFilters', languageCode: 'en', translatedText: 'Please try different filters.' },
    { scopeKey: 'meditationView', labelKey: 'tryDifferentFilters', languageCode: 'zh', translatedText: '请尝试不同的过滤条件。' },
    { scopeKey: 'meditationView', labelKey: 'selectCoursePrompt', languageCode: 'en', translatedText: 'Please select a course to begin.' },
    { scopeKey: 'meditationView', labelKey: 'selectCoursePrompt', languageCode: 'zh', translatedText: '请选择一个课程开始。' },
    { scopeKey: 'meditationView.error', labelKey: 'generic', languageCode: 'en', translatedText: 'An error occurred with meditations.' },
    { scopeKey: 'meditationView.error', labelKey: 'generic', languageCode: 'zh', translatedText: '冥想功能出现错误。' },
    { scopeKey: 'meditationView.error', labelKey: 'retry', languageCode: 'en', translatedText: 'Retry Meditation' },
    { scopeKey: 'meditationView.error', labelKey: 'retry', languageCode: 'zh', translatedText: '重试冥想' },

    // profileView scope
    { scopeKey: 'profileView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'My Profile' },
    { scopeKey: 'profileView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '我的资料' },
    { scopeKey: 'profileView', labelKey: 'editProfileButton', languageCode: 'en', translatedText: 'Edit Profile' },
    { scopeKey: 'profileView', labelKey: 'editProfileButton', languageCode: 'zh', translatedText: '编辑资料' },
    { scopeKey: 'profileView', labelKey: 'saveProfileButton', languageCode: 'en', translatedText: 'Save Profile' },
    { scopeKey: 'profileView', labelKey: 'saveProfileButton', languageCode: 'zh', translatedText: '保存资料' },
    { scopeKey: 'profileView', labelKey: 'cancelEditButton', languageCode: 'en', translatedText: 'Cancel' },
    { scopeKey: 'profileView', labelKey: 'cancelEditButton', languageCode: 'zh', translatedText: '取消' },
    { scopeKey: 'profileView', labelKey: 'loadingProfile', languageCode: 'en', translatedText: 'Loading profile...' },
    { scopeKey: 'profileView', labelKey: 'loadingProfile', languageCode: 'zh', translatedText: '加载个人资料中...' },
    { scopeKey: 'profileView', labelKey: 'errorLoadingProfile', languageCode: 'en', translatedText: 'Error loading profile' },
    { scopeKey: 'profileView', labelKey: 'errorLoadingProfile', languageCode: 'zh', translatedText: '加载个人资料出错' },
    { scopeKey: 'profileView', labelKey: 'profileSavedSuccess', languageCode: 'en', translatedText: 'Profile saved successfully' },
    { scopeKey: 'profileView', labelKey: 'profileSavedSuccess', languageCode: 'zh', translatedText: '个人资料保存成功' },
    { scopeKey: 'profileView', labelKey: 'errorSavingProfile', languageCode: 'en', translatedText: 'Error saving profile' },
    { scopeKey: 'profileView', labelKey: 'errorSavingProfile', languageCode: 'zh', translatedText: '保存个人资料出错' },
    { scopeKey: 'profileView.tabs', labelKey: 'achievements', languageCode: 'en', translatedText: 'Achievements' },
    { scopeKey: 'profileView.tabs', labelKey: 'achievements', languageCode: 'zh', translatedText: '成就' },
    { scopeKey: 'profileView.tabs', labelKey: 'statistics', languageCode: 'en', translatedText: 'Statistics' },
    { scopeKey: 'profileView.tabs', labelKey: 'statistics', languageCode: 'zh', translatedText: '统计' },
    { scopeKey: 'profileView.tabs', labelKey: 'customization', languageCode: 'en', translatedText: 'Customization' },
    { scopeKey: 'profileView.tabs', labelKey: 'customization', languageCode: 'zh', translatedText: '个性化' },
    { scopeKey: 'profileView.tabs', labelKey: 'social', languageCode: 'en', translatedText: 'Social' },
    { scopeKey: 'profileView.tabs', labelKey: 'social', languageCode: 'zh', translatedText: '社交' },

    // bambooPlantingView scope
    { scopeKey: 'bambooPlantingView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Bamboo Garden' },
    { scopeKey: 'bambooPlantingView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '我的竹园' },
    { scopeKey: 'bambooPlantingView', labelKey: 'seedSelectionTitle', languageCode: 'en', translatedText: 'Select Seed' },
    { scopeKey: 'bambooPlantingView', labelKey: 'seedSelectionTitle', languageCode: 'zh', translatedText: '选择种子' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plantButton', languageCode: 'en', translatedText: 'Plant' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plantButton', languageCode: 'zh', translatedText: '种植' },
    { scopeKey: 'bambooPlantingView', labelKey: 'waterButton', languageCode: 'en', translatedText: 'Water' },
    { scopeKey: 'bambooPlantingView', labelKey: 'waterButton', languageCode: 'zh', translatedText: '浇水' },
    { scopeKey: 'bambooPlantingView', labelKey: 'fertilizeButton', languageCode: 'en', translatedText: 'Fertilize' },
    { scopeKey: 'bambooPlantingView', labelKey: 'fertilizeButton', languageCode: 'zh', translatedText: '施肥' },
    { scopeKey: 'bambooPlantingView', labelKey: 'harvestButton', languageCode: 'en', translatedText: 'Harvest' },
    { scopeKey: 'bambooPlantingView', labelKey: 'harvestButton', languageCode: 'zh', translatedText: '收获' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plotStatusAvailable', languageCode: 'en', translatedText: 'Available' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plotStatusAvailable', languageCode: 'zh', translatedText: '可种植' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plotStatusGrowing', languageCode: 'en', translatedText: 'Growing' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plotStatusGrowing', languageCode: 'zh', translatedText: '生长中' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plotStatusReady', languageCode: 'en', translatedText: 'Ready to Harvest' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plotStatusReady', languageCode: 'zh', translatedText: '可收获' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plotStatusLocked', languageCode: 'en', translatedText: 'Locked' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plotStatusLocked', languageCode: 'zh', translatedText: '未解锁' },
    { scopeKey: 'bambooPlantingView', labelKey: 'noSeedsMessage', languageCode: 'en', translatedText: 'No seeds available. Unlock more seeds to plant!' },
    { scopeKey: 'bambooPlantingView', labelKey: 'noSeedsMessage', languageCode: 'zh', translatedText: '没有可用的种子。解锁更多种子吧！' },
    { scopeKey: 'bambooPlantingView', labelKey: 'confirmPlantTitle', languageCode: 'en', translatedText: 'Confirm Planting' },
    { scopeKey: 'bambooPlantingView', labelKey: 'confirmPlantTitle', languageCode: 'zh', translatedText: '确认种植' },
    { scopeKey: 'bambooPlantingView', labelKey: 'confirmPlantMessage', languageCode: 'en', translatedText: 'Plant {seedName} in {plotName}?' },
    { scopeKey: 'bambooPlantingView', labelKey: 'confirmPlantMessage', languageCode: 'zh', translatedText: '确定在 {plotName} 种植 {seedName} 吗？' },
    { scopeKey: 'bambooPlantingView', labelKey: 'confirmHarvestTitle', languageCode: 'en', translatedText: 'Confirm Harvest' },
    { scopeKey: 'bambooPlantingView', labelKey: 'confirmHarvestTitle', languageCode: 'zh', translatedText: '确认收获' },
    { scopeKey: 'bambooPlantingView', labelKey: 'confirmHarvestMessage', languageCode: 'en', translatedText: 'Harvest bamboo from {plotName}?' },
    { scopeKey: 'bambooPlantingView', labelKey: 'confirmHarvestMessage', languageCode: 'zh', translatedText: '确定从 {plotName} 收获竹子吗？' },
    { scopeKey: 'bambooPlantingView', labelKey: 'insufficientWater', languageCode: 'en', translatedText: 'Not enough water resources.' },
    { scopeKey: 'bambooPlantingView', labelKey: 'insufficientWater', languageCode: 'zh', translatedText: '水资源不足。' },
    { scopeKey: 'bambooPlantingView', labelKey: 'insufficientFertilizer', languageCode: 'en', translatedText: 'Not enough fertilizer.' },
    { scopeKey: 'bambooPlantingView', labelKey: 'insufficientFertilizer', languageCode: 'zh', translatedText: '肥料不足。' },
    { scopeKey: 'bambooPlantingView', labelKey: 'errorLoadingBambooData', languageCode: 'en', translatedText: 'Error loading your bamboo garden. Please try again.' },
    { scopeKey: 'bambooPlantingView', labelKey: 'errorLoadingBambooData', languageCode: 'zh', translatedText: '加载竹园数据失败，请重试。' },
    { scopeKey: 'bambooPlantingView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Cultivating your garden...' },
    { scopeKey: 'bambooPlantingView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '正在精心培育您的竹园...' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plantSuccessMessage', languageCode: 'en', translatedText: 'Successfully planted in {plotName}!' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plantSuccessMessage', languageCode: 'zh', translatedText: '已成功种植到 {plotName}！' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plantFailureMessage', languageCode: 'en', translatedText: 'Planting failed. The plot might be occupied or an error occurred.' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plantFailureMessage', languageCode: 'zh', translatedText: '种植失败。地块可能已被占用或发生错误。' },
    { scopeKey: 'bambooPlantingView', labelKey: 'noPlantSelectedMessage', languageCode: 'en', translatedText: 'No plant selected for this action.' },
    { scopeKey: 'bambooPlantingView', labelKey: 'noPlantSelectedMessage', languageCode: 'zh', translatedText: '未选择植物执行此操作。' },
    { scopeKey: 'bambooPlantingView', labelKey: 'waterSuccessMessage', languageCode: 'en', translatedText: 'Plant watered successfully!' },
    { scopeKey: 'bambooPlantingView', labelKey: 'waterSuccessMessage', languageCode: 'zh', translatedText: '植物浇水成功！' },
    { scopeKey: 'bambooPlantingView', labelKey: 'waterFailureMessage', languageCode: 'en', translatedText: 'Watering failed. You might be out of water.' },
    { scopeKey: 'bambooPlantingView', labelKey: 'waterFailureMessage', languageCode: 'zh', translatedText: '浇水失败，可能水资源不足。' },
    { scopeKey: 'bambooPlantingView', labelKey: 'fertilizeSuccessMessage', languageCode: 'en', translatedText: 'Plant fertilized successfully!' },
    { scopeKey: 'bambooPlantingView', labelKey: 'fertilizeSuccessMessage', languageCode: 'zh', translatedText: '植物施肥成功！' },
    { scopeKey: 'bambooPlantingView', labelKey: 'fertilizeFailureMessage', languageCode: 'en', translatedText: 'Fertilizing failed. You might be out of fertilizer.' },
    { scopeKey: 'bambooPlantingView', labelKey: 'fertilizeFailureMessage', languageCode: 'zh', translatedText: '施肥失败，可能肥料不足。' },
    { scopeKey: 'bambooPlantingView', labelKey: 'harvestNotReadyMessage', languageCode: 'en', translatedText: 'This plant is not yet ready for harvest.' },
    { scopeKey: 'bambooPlantingView', labelKey: 'harvestNotReadyMessage', languageCode: 'zh', translatedText: '该植物尚未成熟，无法收获。' },
    { scopeKey: 'bambooPlantingView', labelKey: 'harvestSuccessMessage', languageCode: 'en', translatedText: 'Bamboo harvested successfully!' },
    { scopeKey: 'bambooPlantingView', labelKey: 'harvestSuccessMessage', languageCode: 'zh', translatedText: '竹子收获成功！' },
    { scopeKey: 'bambooPlantingView', labelKey: 'harvestFailureMessage', languageCode: 'en', translatedText: 'Harvesting failed. Please try again.' },
    { scopeKey: 'bambooPlantingView', labelKey: 'harvestFailureMessage', languageCode: 'zh', translatedText: '收获失败，请重试。' },
    { scopeKey: 'bambooPlantingView', labelKey: 'selectedPlotTitle', languageCode: 'en', translatedText: 'Selected Plot: {plotName}' },
    { scopeKey: 'bambooPlantingView', labelKey: 'selectedPlotTitle', languageCode: 'zh', translatedText: '选定地块：{plotName}' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plantDetailsTitle', languageCode: 'en', translatedText: 'Plant Details:' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plantDetailsTitle', languageCode: 'zh', translatedText: '植物详情：' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plotLockedMessage', languageCode: 'en', translatedText: 'This plot is locked. Unlock it to plant bamboo.' },
    { scopeKey: 'bambooPlantingView', labelKey: 'plotLockedMessage', languageCode: 'zh', translatedText: '此地块已锁定。解锁后方可种植竹子。' },
    { scopeKey: 'bambooPlantingView', labelKey: 'growthStageSeedling', languageCode: 'en', translatedText: 'Seedling' },
    { scopeKey: 'bambooPlantingView', labelKey: 'growthStageSeedling', languageCode: 'zh', translatedText: '幼苗期' },
    { scopeKey: 'bambooPlantingView', labelKey: 'growthStageGrowing', languageCode: 'en', translatedText: 'Growing' },
    { scopeKey: 'bambooPlantingView', labelKey: 'growthStageGrowing', languageCode: 'zh', translatedText: '生长期' },
    { scopeKey: 'bambooPlantingView', labelKey: 'growthStageReady', languageCode: 'en', translatedText: 'Ready to Harvest' },
    { scopeKey: 'bambooPlantingView', labelKey: 'growthStageReady', languageCode: 'zh', translatedText: '可收获' },
    { scopeKey: 'bambooPlantingView', labelKey: 'growthStageUnknown', languageCode: 'en', translatedText: 'Unknown Stage' },
    { scopeKey: 'bambooPlantingView', labelKey: 'growthStageUnknown', languageCode: 'zh', translatedText: '未知阶段' },

    // bambooCollectionView Scope
    { scopeKey: 'bambooCollectionView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Bamboo Collection Spots' },
    { scopeKey: 'bambooCollectionView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '竹子收集点' },
    { scopeKey: 'bambooCollectionView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading collection spots...' },
    { scopeKey: 'bambooCollectionView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载收集中...' },
    { scopeKey: 'bambooCollectionView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Error Loading Spots' },
    { scopeKey: 'bambooCollectionView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '加载收集点错误' },
    { scopeKey: 'bambooCollectionView', labelKey: 'errorMessage', languageCode: 'en', translatedText: 'Could not load bamboo collection spots. Please try again.' },
    { scopeKey: 'bambooCollectionView', labelKey: 'errorMessage', languageCode: 'zh', translatedText: '无法加载竹子收集点，请重试。' },
    { scopeKey: 'bambooCollectionView', labelKey: 'retryButtonText', languageCode: 'en', translatedText: 'Retry' },
    { scopeKey: 'bambooCollectionView', labelKey: 'retryButtonText', languageCode: 'zh', translatedText: '重试' },
    { scopeKey: 'bambooCollectionView', labelKey: 'noSpotsMessage', languageCode: 'en', translatedText: 'No bamboo spots available right now. Check back later!' },
    { scopeKey: 'bambooCollectionView', labelKey: 'noSpotsMessage', languageCode: 'zh', translatedText: '当前没有可用的竹子收集点，请稍后再来！' },
    { scopeKey: 'bambooCollectionView', labelKey: 'collectButton', languageCode: 'en', translatedText: 'Collect' },
    { scopeKey: 'bambooCollectionView', labelKey: 'collectButton', languageCode: 'zh', translatedText: '收集' },
    { scopeKey: 'bambooCollectionView', labelKey: 'spotStatusAvailable', languageCode: 'en', translatedText: 'Available' },
    { scopeKey: 'bambooCollectionView', labelKey: 'spotStatusAvailable', languageCode: 'zh', translatedText: '可收集' },
    { scopeKey: 'bambooCollectionView', labelKey: 'spotStatusDepleted', languageCode: 'en', translatedText: 'Depleted' },
    { scopeKey: 'bambooCollectionView', labelKey: 'spotStatusDepleted', languageCode: 'zh', translatedText: '已耗尽' },
    { scopeKey: 'bambooCollectionView', labelKey: 'spotStatusRespawning', languageCode: 'en', translatedText: 'Respawning' },
    { scopeKey: 'bambooCollectionView', labelKey: 'spotStatusRespawning', languageCode: 'zh', translatedText: '再生中' },
    { scopeKey: 'bambooCollectionView', labelKey: 'nextAvailableLabel', languageCode: 'en', translatedText: 'Next collection in:' },
    { scopeKey: 'bambooCollectionView', labelKey: 'nextAvailableLabel', languageCode: 'zh', translatedText: '下次收集时间：' },

    // bambooDashboardView Scope
    { scopeKey: 'bambooDashboardView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Bamboo Dashboard' },
    { scopeKey: 'bambooDashboardView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '竹子仪表盘' },
    { scopeKey: 'bambooDashboardView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading dashboard data...' },
    { scopeKey: 'bambooDashboardView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载仪表盘数据中...' },
    { scopeKey: 'bambooDashboardView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Dashboard Error' },
    { scopeKey: 'bambooDashboardView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '仪表盘错误' },
    { scopeKey: 'bambooDashboardView', labelKey: 'errorMessage', languageCode: 'en', translatedText: 'Could not load dashboard data. Please try again.' },
    { scopeKey: 'bambooDashboardView', labelKey: 'errorMessage', languageCode: 'zh', translatedText: '无法加载仪表盘数据，请重试。' },
    { scopeKey: 'bambooDashboardView', labelKey: 'retryButtonText', languageCode: 'en', translatedText: 'Retry' },
    { scopeKey: 'bambooDashboardView', labelKey: 'retryButtonText', languageCode: 'zh', translatedText: '重试' },
    { scopeKey: 'bambooDashboardView', labelKey: 'overviewSectionTitle', languageCode: 'en', translatedText: 'Overview' },
    { scopeKey: 'bambooDashboardView', labelKey: 'overviewSectionTitle', languageCode: 'zh', translatedText: '概览' },
    { scopeKey: 'bambooDashboardView', labelKey: 'growthSectionTitle', languageCode: 'en', translatedText: 'Growth & Planting' },
    { scopeKey: 'bambooDashboardView', labelKey: 'growthSectionTitle', languageCode: 'zh', translatedText: '生长与种植' },
    { scopeKey: 'bambooDashboardView', labelKey: 'marketSectionTitle', languageCode: 'en', translatedText: 'Market Trends' },
    { scopeKey: 'bambooDashboardView', labelKey: 'marketSectionTitle', languageCode: 'zh', translatedText: '市场趋势' },
    { scopeKey: 'bambooDashboardView', labelKey: 'totalBambooLabel', languageCode: 'en', translatedText: 'Total Bamboo Stock:' },
    { scopeKey: 'bambooDashboardView', labelKey: 'totalBambooLabel', languageCode: 'zh', translatedText: '竹子总库存：' },
    { scopeKey: 'bambooDashboardView', labelKey: 'bambooGrowthRateLabel', languageCode: 'en', translatedText: 'Current Growth Rate (per hour):' },
    { scopeKey: 'bambooDashboardView', labelKey: 'bambooGrowthRateLabel', languageCode: 'zh', translatedText: '当前生长速率（每小时）：' },
    { scopeKey: 'bambooDashboardView', labelKey: 'marketPriceLabel', languageCode: 'en', translatedText: 'Market Price (per unit):' },
    { scopeKey: 'bambooDashboardView', labelKey: 'marketPriceLabel', languageCode: 'zh', translatedText: '市场价格（每单位）：' },

    // bambooTradingView Scope
    { scopeKey: 'bambooTradingView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Bamboo Marketplace' },
    { scopeKey: 'bambooTradingView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '竹子交易所' },
    { scopeKey: 'bambooTradingView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading market data...' },
    { scopeKey: 'bambooTradingView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载市场数据中...' },
    { scopeKey: 'bambooTradingView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Market Error' },
    { scopeKey: 'bambooTradingView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '交易所错误' },
    { scopeKey: 'bambooTradingView', labelKey: 'errorMessage', languageCode: 'en', translatedText: 'Could not load market data. Please try again.' },
    { scopeKey: 'bambooTradingView', labelKey: 'errorMessage', languageCode: 'zh', translatedText: '无法加载市场数据，请重试。' },
    { scopeKey: 'bambooTradingView', labelKey: 'retryButtonText', languageCode: 'en', translatedText: 'Retry' },
    { scopeKey: 'bambooTradingView', labelKey: 'retryButtonText', languageCode: 'zh', translatedText: '重试' },
    { scopeKey: 'bambooTradingView', labelKey: 'currentPriceLabel', languageCode: 'en', translatedText: 'Current Market Price (per unit):' },
    { scopeKey: 'bambooTradingView', labelKey: 'currentPriceLabel', languageCode: 'zh', translatedText: '当前市场价格（每单位）：' },
    { scopeKey: 'bambooTradingView', labelKey: 'yourBambooLabel', languageCode: 'en', translatedText: 'Your Bamboo Stock:' },
    { scopeKey: 'bambooTradingView', labelKey: 'yourBambooLabel', languageCode: 'zh', translatedText: '您的竹子库存：' },
    { scopeKey: 'bambooTradingView', labelKey: 'sellAmountLabel', languageCode: 'en', translatedText: 'Amount to Sell:' },
    { scopeKey: 'bambooTradingView', labelKey: 'sellAmountLabel', languageCode: 'zh', translatedText: '出售数量：' },
    { scopeKey: 'bambooTradingView', labelKey: 'sellButtonText', languageCode: 'en', translatedText: 'Sell Bamboo' },
    { scopeKey: 'bambooTradingView', labelKey: 'sellButtonText', languageCode: 'zh', translatedText: '出售竹子' },
    { scopeKey: 'bambooTradingView', labelKey: 'buyAmountLabel', languageCode: 'en', translatedText: 'Amount to Buy:' },
    { scopeKey: 'bambooTradingView', labelKey: 'buyAmountLabel', languageCode: 'zh', translatedText: '购买数量：' },
    { scopeKey: 'bambooTradingView', labelKey: 'buyButtonText', languageCode: 'en', translatedText: 'Buy Bamboo' },

    // customGoalsView scope
    { scopeKey: 'customGoalsView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Custom Goals' },
    { scopeKey: 'customGoalsView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '自定义目标' },
    { scopeKey: 'customGoalsView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading your custom goals...' },
    { scopeKey: 'customGoalsView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '加载自定义目标中...' },
    { scopeKey: 'customGoalsView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Custom Goals Error' },
    { scopeKey: 'customGoalsView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '自定义目标错误' },
    { scopeKey: 'customGoalsView', labelKey: 'errorMessage', languageCode: 'en', translatedText: 'Could not load your custom goals. Please try again.' },
    { scopeKey: 'customGoalsView', labelKey: 'errorMessage', languageCode: 'zh', translatedText: '无法加载您的自定义目标，请重试。' },
    { scopeKey: 'customGoalsView', labelKey: 'retryButtonText', languageCode: 'en', translatedText: 'Retry' },
    { scopeKey: 'customGoalsView', labelKey: 'retryButtonText', languageCode: 'zh', translatedText: '重试' },
    { scopeKey: 'customGoalsView', labelKey: 'noGoalsMessage', languageCode: 'en', translatedText: 'You haven\'t set any custom goals yet. Create one to get started!' },
    { scopeKey: 'customGoalsView', labelKey: 'noGoalsMessage', languageCode: 'zh', translatedText: '您还没有设定任何自定义目标。创建一个开始吧！' },
    { scopeKey: 'customGoalsView', labelKey: 'createGoalButton', languageCode: 'en', translatedText: 'Create New Goal' },
    { scopeKey: 'customGoalsView', labelKey: 'createGoalButton', languageCode: 'zh', translatedText: '创建新目标' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'editButton', languageCode: 'en', translatedText: 'Edit' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'editButton', languageCode: 'zh', translatedText: '编辑' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'deleteButton', languageCode: 'en', translatedText: 'Delete' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'deleteButton', languageCode: 'zh', translatedText: '删除' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'progressLabel', languageCode: 'en', translatedText: 'Progress' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'progressLabel', languageCode: 'zh', translatedText: '进度' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'targetLabel', languageCode: 'en', translatedText: 'Target' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'targetLabel', languageCode: 'zh', translatedText: '目标' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'statusInProgress', languageCode: 'en', translatedText: 'In Progress' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'statusInProgress', languageCode: 'zh', translatedText: '进行中' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'statusCompleted', languageCode: 'en', translatedText: 'Completed' },
    { scopeKey: 'customGoalsView.goalCard', labelKey: 'statusCompleted', languageCode: 'zh', translatedText: '已完成' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'titleLabel', languageCode: 'en', translatedText: 'Goal Title' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'titleLabel', languageCode: 'zh', translatedText: '目标标题' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'descriptionLabel', languageCode: 'en', translatedText: 'Description (Optional)' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'descriptionLabel', languageCode: 'zh', translatedText: '描述（可选）' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'targetValueLabel', languageCode: 'en', translatedText: 'Target Value' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'targetValueLabel', languageCode: 'zh', translatedText: '目标值' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'currentValueLabel', languageCode: 'en', translatedText: 'Current Value' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'currentValueLabel', languageCode: 'zh', translatedText: '当前值' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'saveButton', languageCode: 'en', translatedText: 'Save Goal' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'saveButton', languageCode: 'zh', translatedText: '保存目标' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'cancelButton', languageCode: 'en', translatedText: 'Cancel' },
    { scopeKey: 'customGoalsView.goalForm', labelKey: 'cancelButton', languageCode: 'zh', translatedText: '取消' },

    // vipBenefitsView labels (continued)
    { scopeKey: 'vipBenefitsView.buttons', labelKey: 'back', languageCode: 'en', translatedText: 'Back to Benefits' },
    { scopeKey: 'vipBenefitsView.buttons', labelKey: 'back', languageCode: 'zh', translatedText: '返回福利' },

    // CustomGoalsPage labels
    { scopeKey: 'customGoalsView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'My Custom Goals' },
    { scopeKey: 'customGoalsView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '我的自定义目标' },
    { scopeKey: 'customGoalsView', labelKey: 'loadingMessage', languageCode: 'en', translatedText: 'Loading your goals...' },
    { scopeKey: 'customGoalsView', labelKey: 'loadingMessage', languageCode: 'zh', translatedText: '正在加载您的目标...' },
    { scopeKey: 'customGoalsView', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Goal Error' },
    { scopeKey: 'customGoalsView', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '目标错误' },
    { scopeKey: 'customGoalsView', labelKey: 'errorMessage', languageCode: 'en', translatedText: 'Could not load or update your goals. Please try again. Details: {message}' },
    { scopeKey: 'customGoalsView', labelKey: 'errorMessage', languageCode: 'zh', translatedText: '无法加载或更新您的目标。请重试。详情: {message}' },
    { scopeKey: 'customGoalsView', labelKey: 'retryButtonText', languageCode: 'en', translatedText: 'Retry' },
    { scopeKey: 'customGoalsView', labelKey: 'retryButtonText', languageCode: 'zh', translatedText: '重试' },
    { scopeKey: 'customGoalsView', labelKey: 'createGoalButton', languageCode: 'en', translatedText: 'New Goal' },
    { scopeKey: 'customGoalsView', labelKey: 'createGoalButton', languageCode: 'zh', translatedText: '新建目标' },
    { scopeKey: 'customGoalsView', labelKey: 'emptyStateTitle', languageCode: 'en', translatedText: 'No Goals Yet' },
    { scopeKey: 'customGoalsView', labelKey: 'emptyStateTitle', languageCode: 'zh', translatedText: '暂无目标' },
    { scopeKey: 'customGoalsView', labelKey: 'emptyStateDescription', languageCode: 'en', translatedText: 'Ready to achieve something great? Create your first custom goal!' },
    { scopeKey: 'customGoalsView', labelKey: 'emptyStateDescription', languageCode: 'zh', translatedText: '准备好实现伟大的目标了吗？创建您的第一个自定义目标吧！' },
    { scopeKey: 'customGoalsView', labelKey: 'filterAll', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'customGoalsView', labelKey: 'filterAll', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'customGoalsView', labelKey: 'filterActive', languageCode: 'en', translatedText: 'Active' },
    { scopeKey: 'customGoalsView', labelKey: 'filterActive', languageCode: 'zh', translatedText: '进行中' },
    { scopeKey: 'customGoalsView', labelKey: 'filterCompleted', languageCode: 'en', translatedText: 'Completed' },
    { scopeKey: 'customGoalsView', labelKey: 'filterCompleted', languageCode: 'zh', translatedText: '已完成' },
    { scopeKey: 'customGoalsView', labelKey: 'goalLimitInfo', languageCode: 'en', translatedText: 'You have {count} of {limit} custom goals.' },
    { scopeKey: 'customGoalsView', labelKey: 'goalLimitInfo', languageCode: 'zh', translatedText: '您已创建 {count}/{limit} 个自定义目标。' },
    { scopeKey: 'customGoalsView', labelKey: 'becomeVipButton', languageCode: 'en', translatedText: 'Become VIP' },
    { scopeKey: 'customGoalsView', labelKey: 'becomeVipButton', languageCode: 'zh', translatedText: '成为VIP会员' },
    { scopeKey: 'customGoalsView', labelKey: 'vipBenefitHint', languageCode: 'en', translatedText: 'to create more goals and unlock other benefits!' },
    { scopeKey: 'customGoalsView', labelKey: 'vipBenefitHint', languageCode: 'zh', translatedText: '以创建更多目标并解锁其他福利！' },
    { scopeKey: 'customGoalsView', labelKey: 'vipPromotionTitle', languageCode: 'en', translatedText: 'Unlock Unlimited Goals!' },
    { scopeKey: 'customGoalsView', labelKey: 'vipPromotionTitle', languageCode: 'zh', translatedText: '解锁无限目标！' },
    { scopeKey: 'customGoalsView', labelKey: 'vipPromotionDescription', languageCode: 'en', translatedText: 'Become a VIP member to create unlimited custom goals, access exclusive features, and accelerate your progress.' },
    { scopeKey: 'customGoalsView', labelKey: 'vipPromotionDescription', languageCode: 'zh', translatedText: '成为VIP会员，创建无限自定义目标，访问专属功能，加速您的进步。' },
    { scopeKey: 'customGoalsView', labelKey: 'upgradeButton', languageCode: 'en', translatedText: 'Upgrade to VIP' },
    { scopeKey: 'customGoalsView', labelKey: 'upgradeButton', languageCode: 'zh', translatedText: '升级到VIP' },
    // Labels for CustomGoalCard
    { scopeKey: 'customGoalsView', labelKey: 'editGoalButton', languageCode: 'en', translatedText: 'Edit' },
    { scopeKey: 'customGoalsView', labelKey: 'editGoalButton', languageCode: 'zh', translatedText: '编辑' },
    { scopeKey: 'customGoalsView', labelKey: 'deleteGoalButton', languageCode: 'en', translatedText: 'Delete' },
    { scopeKey: 'customGoalsView', labelKey: 'deleteGoalButton', languageCode: 'zh', translatedText: '删除' },
    { scopeKey: 'customGoalsView', labelKey: 'markCompleteButton', languageCode: 'en', translatedText: 'Mark Complete' },
    { scopeKey: 'customGoalsView', labelKey: 'markCompleteButton', languageCode: 'zh', translatedText: '标记完成' },
    { scopeKey: 'customGoalsView', labelKey: 'markActiveButton', languageCode: 'en', translatedText: 'Mark Active' },
    { scopeKey: 'customGoalsView', labelKey: 'markActiveButton', languageCode: 'zh', translatedText: '标记进行中' },
    // Labels for CustomGoalForm
    { scopeKey: 'customGoalsView', labelKey: 'formTitleCreate', languageCode: 'en', translatedText: 'Create New Goal' },
    { scopeKey: 'customGoalsView', labelKey: 'formTitleCreate', languageCode: 'zh', translatedText: '创建新目标' },
    { scopeKey: 'customGoalsView', labelKey: 'formTitleEdit', languageCode: 'en', translatedText: 'Edit Goal' },
    { scopeKey: 'customGoalsView', labelKey: 'formTitleEdit', languageCode: 'zh', translatedText: '编辑目标' },
    // Labels for ConfirmationDialog (delete goal)
    { scopeKey: 'customGoalsView', labelKey: 'deleteConfirmTitle', languageCode: 'en', translatedText: 'Confirm Deletion' },
    { scopeKey: 'customGoalsView', labelKey: 'deleteConfirmTitle', languageCode: 'zh', translatedText: '确认删除' },
    { scopeKey: 'customGoalsView', labelKey: 'deleteConfirmMessage', languageCode: 'en', translatedText: 'Are you sure you want to delete the goal "{goalTitle}"? This action cannot be undone.' },
    { scopeKey: 'customGoalsView', labelKey: 'deleteConfirmMessage', languageCode: 'zh', translatedText: '您确定要删除目标"{goalTitle}"吗？此操作无法撤销。' },
    { scopeKey: 'customGoalsView', labelKey: 'confirmButtonText', languageCode: 'en', translatedText: 'Delete' }, // General confirm, can be overridden by component
    { scopeKey: 'customGoalsView', labelKey: 'confirmButtonText', languageCode: 'zh', translatedText: '删除' },
    { scopeKey: 'customGoalsView', labelKey: 'cancelButtonText', languageCode: 'en', translatedText: 'Cancel' }, // General cancel
    { scopeKey: 'customGoalsView', labelKey: 'cancelButtonText', languageCode: 'zh', translatedText: '取消' },
    // Labels for VipValueModal
    { scopeKey: 'customGoalsView', labelKey: 'vipModalTitle', languageCode: 'en', translatedText: 'Unlock More with VIP!' },
    { scopeKey: 'customGoalsView', labelKey: 'vipModalTitle', languageCode: 'zh', translatedText: 'VIP解锁更多精彩！' },

    // Nested labels for CustomGoalCard for customGoalsView
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'editButton', languageCode: 'en', translatedText: 'Edit' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'editButton', languageCode: 'zh', translatedText: '编辑' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'deleteButton', languageCode: 'en', translatedText: 'Delete' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'deleteButton', languageCode: 'zh', translatedText: '删除' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'markCompleteButton', languageCode: 'en', translatedText: 'Mark Complete' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'markCompleteButton', languageCode: 'zh', translatedText: '标记完成' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'markActiveButton', languageCode: 'en', translatedText: 'Mark Active' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'markActiveButton', languageCode: 'zh', translatedText: '标记进行中' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'progressLabel', languageCode: 'en', translatedText: 'Progress' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'progressLabel', languageCode: 'zh', translatedText: '进度' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'startDateLabel', languageCode: 'en', translatedText: 'Started' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'startDateLabel', languageCode: 'zh', translatedText: '开始于' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'endDateLabel', languageCode: 'en', translatedText: 'End Date' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'endDateLabel', languageCode: 'zh', translatedText: '结束日期' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'publicLabel', languageCode: 'en', translatedText: 'Public' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'publicLabel', languageCode: 'zh', translatedText: '公开' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'updateProgressButton', languageCode: 'en', translatedText: 'Updating Progress...' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'updateProgressButton', languageCode: 'zh', translatedText: '更新进度中...' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'logProgressButton', languageCode: 'en', translatedText: 'Log Progress' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'logProgressButton', languageCode: 'zh', translatedText: '记录进度' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'cancelProgressButton', languageCode: 'en', translatedText: 'Cancel' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'cancelProgressButton', languageCode: 'zh', translatedText: '取消' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'progressNotesPlaceholder', languageCode: 'en', translatedText: 'Add a note (optional)' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'progressNotesPlaceholder', languageCode: 'zh', translatedText: '添加备注 (可选)' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'addProgressValueLabel', languageCode: 'en', translatedText: 'Enter value' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'addProgressValueLabel', languageCode: 'zh', translatedText: '输入数值' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'typeDaily', languageCode: 'en', translatedText: 'Daily' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'typeDaily', languageCode: 'zh', translatedText: '每日' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'typeWeekly', languageCode: 'en', translatedText: 'Weekly' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'typeWeekly', languageCode: 'zh', translatedText: '每周' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'typeMonthly', languageCode: 'en', translatedText: 'Monthly' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'typeMonthly', languageCode: 'zh', translatedText: '每月' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'typeYearly', languageCode: 'en', translatedText: 'Yearly' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'typeYearly', languageCode: 'zh', translatedText: '每年' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'typeCustom', languageCode: 'en', translatedText: 'Custom' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'typeCustom', languageCode: 'zh', translatedText: '自定义' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'statusActive', languageCode: 'en', translatedText: 'Active' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'statusActive', languageCode: 'zh', translatedText: '进行中' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'statusCompleted', languageCode: 'en', translatedText: 'Completed' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'statusCompleted', languageCode: 'zh', translatedText: '已完成' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'statusArchived', languageCode: 'en', translatedText: 'Archived' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'statusArchived', languageCode: 'zh', translatedText: '已归档' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'deleteConfirmation', languageCode: 'en', translatedText: 'Confirm delete action?' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'deleteConfirmation', languageCode: 'zh', translatedText: '确认删除操作吗？' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'toggleCompleteButton', languageCode: 'en', translatedText: 'Toggle Completion' },
    { scopeKey: 'customGoalsView.customGoalCardLabels', labelKey: 'toggleCompleteButton', languageCode: 'zh', translatedText: '切换完成状态' },

    // PandaInteractionShowcase labels
    { scopeKey: 'pandaInteractionShowcaseView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Panda Interactions' },
  ];
  await db.uiLabels.bulkAdd(labels);
  console.log("Final V3 DB populated.");
}