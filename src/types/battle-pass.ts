// src/types/battle-pass.ts

/**
 * Battle Pass Season record
 */
export interface BattlePassRecord {
  id: number;
  seasonName: string;
  seasonDescription: string;
  startDate: Date;
  endDate: Date;
  maxLevel: number;
  themeVisualAssetKey: string;
  /** Theme key for the season (e.g., 'spring_blossom', 'summer_heat', 'autumn_harvest', 'winter_frost') */
  seasonTheme: string;
  standardPassProductId: string;
  premiumPassProductId: string;
  levelPurchaseDiamondCost: number;
  isActive: boolean;
}

/**
 * Battle Pass Level record
 */
export interface BattlePassLevelRecord {
  id: number;
  passId: number;
  levelNumber: number;
  freeRewardItemId: number;
  freeRewardQuantity: number;
  paidRewardItemId: number;
  paidRewardQuantity: number;
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
  id: number;
  passId: number;
  taskName: string;
  taskType: BattlePassTaskType;
  targetValue: number;
  expReward: number;
  relatedGameActionKey: string;
  isRepeatable: boolean;
  isCompleted?: boolean;
  estimatedTimeMinutes?: number;
  difficulty?: number;
  taskDescription?: string;
  currentValue?: number;
  progressPercentage?: number;
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
  id: number;
  userId: string;
  passId: number;
  purchaseDate: string; // ISO string date format
  platformTransactionId: string;
  passType: BattlePassType;
}

/**
 * User Battle Pass Progress record
 */
export interface UserBattlePassProgressRecord {
  id: number;
  userId: string;
  passId: number;
  currentLevel: number;
  currentExp: number;
  claimedFreeLevels: number[]; // Array of claimed level numbers
  claimedPaidLevels: number[]; // Array of claimed level numbers
  totalExpEarned?: number;
}

/**
 * Battle Pass Level Reward
 */
export interface BattlePassLevelReward {
  itemId: number;
  quantity: number;
  itemName: string;
  itemDescription: string;
  itemType: string;
  itemRarity: string;
  iconAssetKey: string;
  expReward?: number;
}

/**
 * Battle Pass Level with Rewards
 */
export interface BattlePassLevelWithRewards extends BattlePassLevelRecord {
  freeReward: BattlePassLevelReward;
  paidReward: BattlePassLevelReward;
}

/**
 * Battle Pass View Data
 */
export interface BattlePassViewData {
  pass: BattlePassRecord;
  levels: BattlePassLevelWithRewards[];
  userProgress: UserBattlePassProgressRecord;
  userOwnership: UserBattlePassOwnershipRecord;
  activeTasks: BattlePassTaskRecord[];
}

/**
 * Battle Pass Page View Labels Bundle
 * This structure should mirror the defaultLabels object in BattlePassPage.tsx
 */
export interface BattlePassPageViewLabelsBundle {
  pageTitle?: string;
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
  tasksTitle?: string;
  taskTypes?: {
    daily?: string;
    weekly?: string;
    seasonal?: string;
  };
  taskProgressLabel?: string;
  taskCompletedLabel?: string;
  noActivePassMessage?: string;
  seasonEndsIn?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  errorMessages?: {
    failedToLoad?: string;
    failedToPurchase?: string;
    failedToClaim?: string;
    failedToCompleteTask?: string;
    // Adding other error messages that might be used by components
    dataLoadFailedTitle?: string;
    dataLoadFailedMessage?: string;
    genericErrorTitle?: string;
    genericErrorMessage?: string;
    notEnoughFunds?: string;
    maxLevelReached?: string;
    genericPurchaseError?: string;
    failedToPurchaseLevel?: string;
  };
  buttons?: {
    back?: string;
    retry?: string;
    close?: string;
    // Adding other button labels that might be used by components
    completeTask?: string;
    continue?: string;
    // claim is already top-level as claimRewardButton
    // claimed is already top-level as alreadyClaimedLabel
    // locked is already top-level as lockedRewardLabel
    purchaseLevels?: string;
    purchase?: string;
    cancel?: string;
    processing?: string;
    viewProfile?: string;
    claimRewardsButtonLabel?: string; // For BattlePassEvents, BattlePassChallenges
    viewDetails?: string;
    startTask?: string;
    invite?: string;
    invited?: string;
    viewProgress?: string;
    participate?: string; // For BattlePassEvents
    acceptChallenge?: string; // For BattlePassChallenges
    download?: string; // For BattlePassShareAchievement
    copyLink?: string; // For BattlePassShareAchievement
  };

  // Labels for BattlePassStats component
  statsTitle?: string;
  progressLabel?: string;
  // levelLabel is already top-level as currentLevelLabel/nextLevelLabel
  // expLabel is already top-level
  tasksLabel?: string; // Different from tasksTitle
  rewardsLabel?: string;
  daysRemainingLabel?: string;
  premiumStatusLabel?: string;
  premiumPassText?: string;
  freePassText?: string;
  totalExpEarnedLabel?: string;

  // Labels for BattlePassDailyCheckin component
  checkinTitle?: string;
  // claimButtonLabel is in buttons
  // closeButtonLabel is in buttons
  streakLabel?: string;
  // claimedLabel is already top-level
  todayLabel?: string;
  // lockedLabel is already top-level
  rewardClaimedLabel?: string;
  dayLabel?: string;

  // Labels for BattlePassFriendInvite component
  inviteTitle?: string;
  // inviteButtonLabel is in buttons
  // copyLinkButtonLabel is in buttons
  // closeButtonLabel is in buttons
  noFriendsLabel?: string;
  inviteMessageLabel?: string;
  inviteRewardsLabel?: string;
  inviteLinkLabel?: string;
  alreadyInvitedLabel?: string;
  alreadyJoinedLabel?: string;
  inviteSentLabel?: string;
  linkCopiedLabel?: string;

  // Labels for BattlePassEvents component
  eventsTitle?: string;
  joinButtonLabel?: string; // Potentially in buttons object too. For now, separate.
  // claimRewardsButtonLabel is in buttons
  // closeButtonLabel is in buttons
  noEventsLabel?: string;
  premiumOnlyLabel?: string; // Also for Challenges
  eventDetailsButtonLabel?: string;
  eventRewardsLabel?: string;
  eventRequirementsLabel?: string;
  eventProgressLabel?: string;
  eventCompletedLabel?: string;
  eventJoinedLabel?: string;
  eventRewardsClaimedLabel?: string;
  timeRemainingLabel?: string; // Also for Challenges
  // daysLabel, hoursLabel, minutesLabel are top-level
  eventStartDateLabel?: string;
  eventEndDateLabel?: string;

  // Labels for BattlePassChallenges component
  challengesTitle?: string;
  acceptButtonLabel?: string; // Potentially in buttons
  // claimRewardsButtonLabel is in buttons
  // closeButtonLabel is in buttons
  noChallengesLabel?: string;
  // premiumOnlyLabel is shared with Events
  challengeDetailsButtonLabel?: string;
  challengeRewardsLabel?: string;
  challengeStepsLabel?: string;
  challengeDifficultyLabel?: string;
  challengeCompletedLabel?: string;
  challengeAcceptedLabel?: string;
  challengeRewardsClaimedLabel?: string;
  // timeRemainingLabel is shared with Events
  challengeExpiredLabel?: string;

  // Labels for BattlePassLeaderboard component
  leaderboardTitle?: string;
  rankLabel?: string; // Also for History
  playerLabel?: string;
  // levelLabel is top-level
  premiumBadgeLabel?: string;
  refreshButtonLabel?: string; // Potentially in buttons
  noEntriesLabel?: string;
  loadingLabel?: string; // Also general loading
  youLabel?: string;

  // Labels for BattlePassHistory component
  historyTitle?: string;
  // seasonLabel is for ShareAchievement
  // levelLabel is top-level
  // tasksLabel is for Stats
  // rewardsLabel is for Stats
  // rankLabel is shared with Leaderboard
  // premiumStatusLabel, premiumPassText, freePassText are for Stats
  notableRewardsLabel?: string;
  achievementsLabel?: string; // Also for Achievements section
  // closeButtonLabel is in buttons
  noHistoryLabel?: string;
  viewDetailsButtonLabel?: string; // Potentially in buttons
  seasonDatesLabel?: string;

  // Labels for BattlePassAchievements component
  achievementsTitle?: string;
  // progressLabel is for Stats
  // claimButtonLabel is in buttons
  // lockedLabel is top-level
  unlockedLabel?: string;
  // closeButtonLabel is in buttons
  noAchievementsLabel?: string;
  rarityLabels?: { // Shared with RewardAnimation, ShareAchievement
    common?: string;
    uncommon?: string;
    rare?: string;
    epic?: string;
    legendary?: string;
  };

  // Labels for BattlePassTaskRecommendations component
  recommendationsTitle?: string;
  recommendedTasksLabel?: string;
  easyTasksLabel?: string;
  quickTasksLabel?: string;
  highRewardTasksLabel?: string;
  startTaskButtonLabel?: string; // Potentially in buttons
  noRecommendationsLabel?: string;
  difficultyLabel?: string; // Generic, could be top-level
  timeLabel?: string; // Generic
  rewardLabel?: string; // Generic

  // Labels for BattlePassRewardsPreview component
  rewardsPreviewTitle?: string;
  freeRewardsLabel?: string; // Also for LevelUpModal
  premiumRewardsLabel?: string; // Also for LevelUpModal
  // premiumLockedLabel is for LevelUpModal
  // closeButtonLabel is in buttons

  // Labels for BattlePassRewardAnimation component
  rewardTitle?: string;
  // closeButtonLabel, claimButtonLabel, rarityLabel, rarityLabels are covered

  // Labels for BattlePassLevelUpEffect component
  levelUpTitle?: string; // Also for LevelUpModal
  levelUpMessage?: string; // Also for LevelUpModal
  continueButtonLabel?: string; // Potentially in buttons
  levelLabel?: string; // Generic, potentially top-level like currentLevelLabel

  // Labels for BattlePassShareAchievement component
  shareTitle?: string;
  // closeButtonLabel, downloadButtonLabel, copyButtonLabel are in buttons
  twitterButtonLabel?: string; // Potentially in buttons
  facebookButtonLabel?: string; // Potentially in buttons
  instagramButtonLabel?: string; // Potentially in buttons
  achievementUnlockedLabel?: string;
  seasonLabel?: string; // Generic
  // levelLabel, rarityLabel, rarityLabels are covered
  copiedLabel?: string; // Specific to this modal

  // Labels for BattlePassLevelUpModal (some already listed under LevelUpEffect)
  // levelUpTitle, levelUpMessage, rewardsTitle, freeRewardLabel, premiumRewardLabel are relevant
  // closeButton is in buttons
  premiumLockedLabel?: string; // Specific

  // Labels for BattlePassLevel (component passed specific labels)
  vipOnlyLabel?: string; // Passed to BattlePassLevel component

  // General/Fallback
  loadingMessage?: string; // For LoadingSpinner
}
