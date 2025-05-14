// src/types/battle-pass.ts

/**
 * Battle Pass Season record
 */
export interface BattlePassRecord {
  id?: number;
  seasonName: string;
  seasonDescription?: string;
  startDate: Date | string;
  endDate: Date | string;
  maxLevel: number;
  themeVisualAssetKey?: string;
  /** Theme key for the season (e.g., 'spring_blossom', 'summer_heat', 'autumn_harvest', 'winter_frost') */
  seasonTheme?: string;
  standardPassProductId?: string;
  premiumPassProductId?: string;
  levelPurchaseDiamondCost?: number;
  isActive: boolean;
}

/**
 * Battle Pass Level record
 */
export interface BattlePassLevelRecord {
  id?: number;
  passId: number;
  levelNumber: number;
  freeRewardItemId?: number;
  freeRewardQuantity?: number;
  paidRewardItemId?: number;
  paidRewardQuantity?: number;
  requiredExp: number;
}

/**
 * Battle Pass Task Type
 */
export enum BattlePassTaskType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  SEASONAL = 'seasonal'
}

/**
 * Battle Pass Task record
 */
export interface BattlePassTaskRecord {
  id?: number;
  passId: number;
  taskName: string;
  taskType: BattlePassTaskType;
  targetValue: number;
  expReward: number;
  relatedGameActionKey?: string;
  isRepeatable: boolean;
}

/**
 * Battle Pass Ownership Type
 */
export enum BattlePassType {
  STANDARD = 'standard',
  PREMIUM = 'premium'
}

/**
 * User Battle Pass Ownership record
 */
export interface UserBattlePassOwnershipRecord {
  id?: number;
  userId: string;
  passId: number;
  purchaseDate: Date | string;
  platformTransactionId?: string;
  passType: BattlePassType;
}

/**
 * User Battle Pass Progress record
 */
export interface UserBattlePassProgressRecord {
  id?: number;
  userId: string;
  passId: number;
  currentLevel: number;
  currentExp: number;
  claimedFreeLevels: string; // Comma-separated list of level numbers
  claimedPaidLevels: string; // Comma-separated list of level numbers
}

/**
 * Battle Pass Level Reward
 */
export interface BattlePassLevelReward {
  itemId: number;
  quantity: number;
  itemName: string;
  itemDescription?: string;
  itemType: string;
  itemRarity: string;
  iconAssetKey?: string;
}

/**
 * Battle Pass Level with Rewards
 */
export interface BattlePassLevelWithRewards extends BattlePassLevelRecord {
  freeReward?: BattlePassLevelReward;
  paidReward?: BattlePassLevelReward;
}

/**
 * Battle Pass View Data
 */
export interface BattlePassViewData {
  pass: BattlePassRecord;
  levels: BattlePassLevelWithRewards[];
  userProgress?: UserBattlePassProgressRecord;
  userOwnership?: UserBattlePassOwnershipRecord;
  activeTasks: BattlePassTaskRecord[];
}

/**
 * Battle Pass Page View Labels Bundle
 */
export interface BattlePassPageViewLabelsBundle {
  pageTitle: string;
  headerTitle?: string;
  headerSubtitle?: string;
  freeTrackTitle?: string;
  paidTrackTitle?: string;
  currentLevelLabel?: string;
  nextLevelLabel?: string;
  expLabel?: string;
  purchaseStandardPassButton?: string;
  purchasePremiumPassButton?: string;
  alreadyPurchasedMessage?: string;
  levelPurchaseButton?: string;
  claimRewardButton?: string;
  alreadyClaimedLabel?: string;
  lockedRewardLabel?: string;
  vipOnlyLabel?: string;
  tasksTitle?: string;
  taskTypes?: {
    daily?: string;
    weekly?: string;
    seasonal?: string;
  };
  taskProgressLabel?: string;
  taskCompletedLabel?: string;
  noActivePassMessage?: string;
  // Season theme labels
  seasonEndsIn?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  // Level up modal labels
  levelUpTitle?: string;
  levelUpMessage?: string;
  rewardsTitle?: string;
  freeRewardLabel?: string;
  premiumRewardLabel?: string;
  premiumLockedLabel?: string;
  // Stats labels
  statsTitle?: string;
  progressLabel?: string;
  levelLabel?: string;
  expLabel?: string;
  tasksLabel?: string;
  rewardsLabel?: string;
  daysRemainingLabel?: string;
  premiumStatusLabel?: string;
  premiumPassText?: string;
  freePassText?: string;
  totalExpEarnedLabel?: string;
  // Rewards preview labels
  rewardsPreviewTitle?: string;
  freeRewardsLabel?: string;
  premiumRewardsLabel?: string;
  closeButtonLabel?: string;

  // Leaderboard labels
  leaderboardTitle?: string;
  rankLabel?: string;
  playerLabel?: string;
  premiumBadgeLabel?: string;
  refreshButtonLabel?: string;
  noEntriesLabel?: string;
  loadingLabel?: string;
  youLabel?: string;

  // Achievement labels
  achievementsTitle?: string;
  claimButtonLabel?: string;
  lockedLabel?: string;
  unlockedLabel?: string;
  noAchievementsLabel?: string;
  commonRarityLabel?: string;
  uncommonRarityLabel?: string;
  rareRarityLabel?: string;
  epicRarityLabel?: string;
  legendaryRarityLabel?: string;

  // Task recommendation labels
  recommendationsTitle?: string;
  recommendedTasksLabel?: string;
  easyTasksLabel?: string;
  quickTasksLabel?: string;
  highRewardTasksLabel?: string;
  startTaskButtonLabel?: string;
  noRecommendationsLabel?: string;
  difficultyLabel?: string;
  timeLabel?: string;

  // History labels
  historyTitle?: string;
  seasonLabel?: string;
  notableRewardsLabel?: string;
  noHistoryLabel?: string;
  viewDetailsButtonLabel?: string;
  seasonDatesLabel?: string;

  // Friend invite labels
  inviteTitle?: string;
  inviteButtonLabel?: string;
  copyLinkButtonLabel?: string;
  noFriendsLabel?: string;
  inviteMessageLabel?: string;
  inviteRewardsLabel?: string;
  inviteLinkLabel?: string;
  alreadyInvitedLabel?: string;
  alreadyJoinedLabel?: string;
  inviteSentLabel?: string;
  linkCopiedLabel?: string;

  // Daily check-in labels
  checkinTitle?: string;
  streakLabel?: string;
  claimedLabel?: string;
  todayLabel?: string;
  rewardClaimedLabel?: string;
  dayLabel?: string;

  // Events labels
  eventsTitle?: string;
  joinButtonLabel?: string;
  noEventsLabel?: string;
  premiumOnlyLabel?: string;
  eventDetailsButtonLabel?: string;
  eventRewardsLabel?: string;
  eventRequirementsLabel?: string;
  eventProgressLabel?: string;
  eventCompletedLabel?: string;
  eventJoinedLabel?: string;
  eventRewardsClaimedLabel?: string;
  eventStartDateLabel?: string;
  eventEndDateLabel?: string;

  // Challenges labels
  challengesTitle?: string;
  acceptButtonLabel?: string;
  noChallengesLabel?: string;
  challengeDetailsButtonLabel?: string;
  challengeRewardsLabel?: string;
  challengeStepsLabel?: string;
  challengeDifficultyLabel?: string;
  challengeCompletedLabel?: string;
  challengeAcceptedLabel?: string;
  challengeRewardsClaimedLabel?: string;
  challengeExpiredLabel?: string;

  // Reward animation labels
  rewardTitle?: string;
  claimButtonLabel?: string;
  rarityLabel?: string;
  commonRarityLabel?: string;
  uncommonRarityLabel?: string;
  rareRarityLabel?: string;
  epicRarityLabel?: string;
  legendaryRarityLabel?: string;

  // Level up effect labels
  levelUpTitle?: string;
  levelUpMessage?: string;
  continueButtonLabel?: string;

  // Share achievement labels
  shareTitle?: string;
  downloadButtonLabel?: string;
  copyButtonLabel?: string;
  twitterButtonLabel?: string;
  facebookButtonLabel?: string;
  instagramButtonLabel?: string;
  achievementUnlockedLabel?: string;
  copiedLabel?: string;
  // Error messages
  errorMessages?: {
    failedToLoad?: string;
    failedToPurchase?: string;
    failedToClaim?: string;
    failedToCompleteTask?: string;
    failedToPurchaseLevel?: string;
  };
  buttons?: {
    back?: string;
    retry?: string;
    close?: string;
  };
}
