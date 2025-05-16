// src/types/index.ts
import type {
  StoreCategoryRecord,
  StoreItemRecord,
  VipSubscriptionRecord,
  UserCurrencyRecord
} from '@/services/storeService'; // Adjust path as necessary if services are structured differently

export type Language = "en" | "zh";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export interface ApiError extends Error { errorCode?: string; statusCode?: number; }

// Export utility types
export * from './label-utils';
export * from './callback-types';
export * from './offline';

// Structure for Dexie uiLabels store
export interface UILabelRecord {
  id?: number;
  scopeKey: string; // e.g., "globalLayout", "homeView", "homeView.welcomeSection", "components.button"
  labelKey: string; // e.g., "appTitle", "welcomeMessage", "confirmText"
  languageCode: Language;
  translatedText: string;
}

// --- Generic Localized Content Structure (from services) ---
export interface LocalizedContent<TDataPayload, TLabelsBundle> {
  labels: TLabelsBundle | undefined;
  data: TDataPayload | null;
}

// --- Definition for CustomGoalCardLabels ---
export interface CustomGoalCardLabels {
  editButton?: string;
  deleteButton?: string;
  markCompleteButton?: string;
  markActiveButton?: string;
  progressLabel?: string;
  startDateLabel?: string;
  endDateLabel?: string;
  updateProgressButton?: string;
  logProgressButton?: string;
  cancelProgressButton?: string;
  progressNotesPlaceholder?: string;
  addProgressValueLabel?: string;
  statusActive?: string;
  statusCompleted?: string;
  statusArchived?: string;
  deleteConfirmation?: string; 
  toggleCompleteButton?: string; 
  cancelButtonText?: string; 
}

// --- Common Components Labels ---
export interface ButtonLabels {
  loading: string;
  retry: string;
  confirm: string;
  cancel: string;
  save: string;
  close: string;
  submit: string;
  edit: string;
  delete: string;
  back: string;
  next: string;
}

export interface LoadingLabels {
  generic: string;
  data: string;
  content: string;
  saving: string;
  processing: string;
}

export interface ErrorLabels {
  generic: string;
  title: string;
  retry: string;
  details: string;
  networkError: string;
  serverError: string;
  unknownError: string;
  loadingError?: string;
  taskNotFound?: string;
  completeTaskError?: string;
  deleteTaskError?: string;
  createTaskError?: string;
  updateTaskError?: string;
  loadingDataError?: string;
  savingDataError?: string;
  processingError?: string;
  validationError?: string;
  authenticationError?: string;
  permissionError?: string;
}

export interface EmptyStateLabels {
  generic: string;
  noData: string;
  noResults: string;
  noItems: string;
}

export interface ModalLabels {
  close: string;
  confirm: string;
  cancel: string;
}

export interface TaskReminderLabels {
  title: string;
  subtitle: string;
  defaultMessage: string;
  reminderTimeLabel: string;
  dismissButton: string;
  laterButton: string;
  viewTaskButton: string;
  unknownTask: string;
}

export interface VipSubscriptionBadgeLabels {
  recommended: string;
  bestValue: string;
}

export interface VipSubscriptionButtonLabels {
  subscribe: string;
  restore: string;
  cancel: string;
}

export interface VipSubscriptionPlanLabels {
  title: string;
  price: string;
  monthlyPrice: string;
  benefits: string;
}

export interface VipSubscriptionLabels {
  title: string;
  subtitle: string;
  monthly: VipSubscriptionPlanLabels;
  seasonal: VipSubscriptionPlanLabels;
  annual: VipSubscriptionPlanLabels;
  buttons: VipSubscriptionButtonLabels;
  badges: VipSubscriptionBadgeLabels;
}

export interface TaskCardLabels {
  subtasksIndicator?: string;
  completeButton?: string;
  editButton?: string;
  deleteButton?: string;
  viewDetailsButton?: string;
  priority?: {
    high?: string;
    medium?: string;
    low?: string;
    unknown?: string;
  };
  status?: {
    overdue?: string;
    completed?: string;
    inProgress?: string;
    todo?: string;
  };
  dates?: {
    dueDate?: string;
    createdDate?: string;
    completedDate?: string;
  };
}

export interface DeleteConfirmationLabels {
  title?: string;
  message?: string;
  confirmButton?: string;
  cancelButton?: string;
}

export interface TimelyRewardCongratsLabels {
  title?: string;
  message?: string;
  rewardAmount?: string;
  closeButton?: string;
  claimButton?: string;
}

export interface ComponentsLabelsBundle {
  button: ButtonLabels;
  loading: LoadingLabels;
  error: ErrorLabels;
  emptyState: EmptyStateLabels;
  modal: ModalLabels;
  taskReminder: TaskReminderLabels;
  vipSubscription: VipSubscriptionLabels;
  taskCard?: TaskCardLabels;
  deleteConfirmation?: DeleteConfirmationLabels;
  timelyRewardCongrats?: TimelyRewardCongratsLabels;
}

export type FetchComponentsLabelsResult = LocalizedContent<null, ComponentsLabelsBundle>;

// --- Global / Layout Content Types ---
export interface GlobalLayoutLabelsBundle {
  appTitle?: string;
  navHome?: string;
  navTasks?: string;
  navAbilities?: string;
  navRewards?: string;
  navChallenges?: string;
  navTeaRoom?: string;
  navStore?: string;
  navVip?: string;
  navBattlePass?: string;
  navCustomGoals?: string;
  navSocial?: string;
  navAvatarFrames?: string;
  navBambooPlanting?: string;
  navBambooTrading?: string;
  navBambooDashboard?: string;
  navSettings?: string;
  footerText?: string;
  loadingGeneric?: string;
  errorGeneric?: string;
  appErrorHeading?: string;
  appErrorGeneralMessage?: string;
}
export type FetchGlobalLayoutViewResult = LocalizedContent<null, GlobalLayoutLabelsBundle>;

// --- Home Page/View Specific Types ---
export interface HomeWelcomeSectionLabels {
  welcomeMessage?: string;
  changeTitleText?: string;
}
export interface MoodItem { readonly id: number; readonly name: string; readonly feeling: string; }
export interface HomeMoodsSectionLabels {
  sectionTitle?: string;
  noMoodsMessage?: string;
  refreshButtonText?: string;
}
export interface HomePandaSectionLabels {
  sectionTitle?: string;
  levelLabel?: string;
  experienceLabel?: string;
  interactButtonText?: string;
  feedButtonText?: string;
  playButtonText?: string;
  trainButtonText?: string;
}
export interface HomePageViewLabelsBundle {
  pageTitle?: string;
  welcomeSection?: HomeWelcomeSectionLabels;
  moodsSection?: HomeMoodsSectionLabels;
  pandaSection?: HomePandaSectionLabels;
  resourcesSection?: HomeResourcesSectionLabels;
  tasksSection?: HomeTasksSectionLabels;
  someActionText?: string;
  initializeGameText?: string;
  initializingText?: string;
  initializeGameDescription?: string;
}
export interface HomePageViewDataPayload {
  username: string;
  moods: readonly MoodItem[];
}
export type FetchHomePageViewResult = LocalizedContent<HomePageViewDataPayload, HomePageViewLabelsBundle>;

// --- Settings Page/View Specific Types ---
export interface SettingsLanguageSectionLabels {
  sectionTitle?: string;
  selectLanguagePrompt?: string;
  currentLanguageIs?: string;
  langNameEn?: string;
  langNameZh?: string;
  saveButtonText?: string;
  successMessage?: string;
}
export interface SettingsPageViewLabelsBundle {
  pageTitle?: string;
  languageSection?: SettingsLanguageSectionLabels;
  soundSettingsSection?: SoundSettingsSectionLabels;
  notificationSettingsSection?: NotificationSettingsSectionLabels;
  animationSettingsSection?: AnimationSettingsSectionLabels;
}
export type FetchSettingsPageViewResult = LocalizedContent<null, SettingsPageViewLabelsBundle>;

// --- Bamboo Planting Page/View Specific Types ---
export interface BambooPlantingPageViewLabelsBundle {
  pageTitle?: string;
  seedSelectionTitle?: string;
  plantButton?: string;
  waterButton?: string;
  fertilizeButton?: string;
  harvestButton?: string;
  plotStatusAvailable?: string;
  plotStatusGrowing?: string;
  plotStatusReady?: string;
  plotStatusLocked?: string;
  noSeedsMessage?: string;
  confirmPlantTitle?: string;
  confirmPlantMessage?: string;
  confirmHarvestTitle?: string;
  confirmHarvestMessage?: string;
  insufficientWater?: string;
  insufficientFertilizer?: string;
  errorLoadingBambooData?: string;
  loadingMessage?: string;
  plantSuccessMessage?: string;
  plantFailureMessage?: string;
  noPlantSelectedMessage?: string;
  waterSuccessMessage?: string;
  waterFailureMessage?: string;
  fertilizeSuccessMessage?: string;
  fertilizeFailureMessage?: string;
  harvestNotReadyMessage?: string;
  harvestSuccessMessage?: string;
  harvestFailureMessage?: string;
  selectedPlotTitle?: string;
  plantDetailsTitle?: string;
  plotLockedMessage?: string;
  growthStageSeedling?: string;
  growthStageGrowing?: string;
  growthStageReady?: string;
  growthStageUnknown?: string;
  cancelButtonText?: string;
}

export interface BambooPlantingPageViewDataPayload {
  availableSeeds: { id: string; name: string; icon: string; growthTime: number }[];
  bambooPlots: { id: string; status: string; growthProgress?: number; plantedSeedId?: string }[];
  userResources: { water: number; fertilizer: number };
}

export type FetchBambooPlantingPageViewResult = LocalizedContent<
  BambooPlantingPageViewDataPayload,
  BambooPlantingPageViewLabelsBundle
>;

// --- Meditation Page/View Specific Types ---
export interface MeditationPageViewLabelsBundle {
  pageTitle?: string;
  pageDescription?: string;
  statsTitle?: string;
  statsTotalSessions?: string;
  statsTotalMinutes?: string;
  statsCurrentStreak?: string;
  statsLongestStreak?: string;
  statsCompletedCourses?: string;
  vipPromotionTitle?: string;
  vipPromotionDescription?: string;
  upgradeButton?: string;
  difficultyFilterTitle?: string;
  typeFilterTitle?: string;
  durationFilterTitle?: string;
  allLabel?: string;
  difficultyBeginner?: string;
  difficultyIntermediate?: string;
  difficultyAdvanced?: string;
  difficultyMaster?: string;
  typeMindfulness?: string;
  typeBreathwork?: string;
  typeBodyScan?: string;
  typeLovingKindness?: string;
  typeVisualization?: string;
  typeMantra?: string;
  typeGuided?: string;
  typeZen?: string;
  typeTranscendental?: string;
  typeYogaNidra?: string;
  durationShort?: string;
  durationMedium?: string;
  durationLong?: string;
  noCourseFound?: string;
  tryDifferentFilters?: string;
  startSessionButton?: string;
  selectCoursePrompt?: string;
  error?: {
    generic?: string;
    retry?: string;
  };
}

export interface MeditationPageViewDataPayload { 
}

export type FetchMeditationPageViewResult = LocalizedContent<MeditationPageViewDataPayload | null, MeditationPageViewLabelsBundle>;

// --- Profile Page/View Specific Types ---
export interface ProfilePageViewLabelsBundle {
  pageTitle?: string;
  editProfileButton?: string;
  saveProfileButton?: string;
  cancelEditButton?: string;
  loadingProfile?: string;
  errorLoadingProfile?: string;
  profileSavedSuccess?: string;
  errorSavingProfile?: string;
  tabs?: {
    achievements?: string;
    statistics?: string;
    customization?: string;
    social?: string;
  };
}

export type FetchProfilePageViewResult = LocalizedContent<null, ProfilePageViewLabelsBundle>;

// --- Tasks Page/View Specific Types ---
export interface TaskFormLabels {
  title?: {
    create?: string;
    edit?: string;
  };
  fields?: {
    titleLabel?: string;
    titlePlaceholder?: string;
    titleRequired?: string;
    descriptionLabel?: string;
    descriptionPlaceholder?: string;
    categoryLabel?: string;
    categoryPlaceholder?: string;
    categoryRequired?: string;
    typeLabel?: string;
    priorityLabel?: string;
    dueDateLabel?: string;
    estimatedTimeLabel?: string;
    estimatedTimePlaceholder?: string;
  };
  types?: {
    daily?: string;
    main?: string;
    side?: string;
  };
  priorities?: {
    low?: string;
    medium?: string;
    high?: string;
  };
  buttons?: {
    create?: string;
    save?: string;
    cancel?: string;
  };
}

export interface TaskManagerLabels {
  sectionTitle?: string;
  createTaskButton?: string;
  filterAllLabel?: string;
  filterTodoLabel?: string;
  filterInProgressLabel?: string;
  filterCompletedLabel?: string;
  noTasksMessage?: string;
  taskForm?: TaskFormLabels;
}

export interface TasksPageViewLabelsBundle {
  pageTitle?: string;
  taskManager?: TaskManagerLabels;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
}
export type FetchTasksPageViewResult = LocalizedContent<null, TasksPageViewLabelsBundle>;

// --- Challenges Page/View Specific Types ---
export interface ChallengeFilterLabels {
  statusLabel?: string;
  typeLabel?: string;
  difficultyLabel?: string;
  allLabel?: string;
  activeLabel?: string;
  completedLabel?: string;
  upcomingLabel?: string;
  typeAllLabel?: string;
  typeDailyLabel?: string;
  typeWeeklyLabel?: string;
  typeEventLabel?: string;
  typeOngoingLabel?: string;
  difficultyAllLabel?: string;
  difficultyEasyLabel?: string;
  difficultyMediumLabel?: string;
  difficultyHardLabel?: string;
  difficultyExpertLabel?: string;
  clearFiltersLabel?: string;
}

export interface ChallengeCardLabels {
  statusActive?: string;
  statusCompleted?: string;
  statusExpired?: string;
  statusUpcoming?: string;
  difficultyEasy?: string;
  difficultyMedium?: string;
  difficultyHard?: string;
  difficultyExpert?: string;
  startLabel?: string;
  endLabel?: string;
  completedOnLabel?: string;
  completeButtonText?: string;
  inProgressText?: string;
}

export interface ChallengeDiscoveryCardLabels {
  closeButtonAriaLabel?: string;
  loadingMessage?: string;
  errorLoadingChallenge?: string;
  cannotLoadChallenge?: string;
  startDateLabel?: string;
  endDateLabel?: string;
  laterButton?: string;
  acceptButton?: string;
}

export interface ChallengeRecommendationCardLabels {
  matchRateLabel?: string;
  startDateLabel?: string;
  endDateLabel?: string;
  viewDetailsButton?: string;
  acceptButton?: string;
}

export interface SocialChallengeCardLabels {
  progressLabel?: string;
  shareButton?: string;
  leaveButton?: string;
  joinButton?: string;
}

export interface ChallengesPageViewLabelsBundle {
  pageTitle?: string;
  filters?: ChallengeFilterLabels;
  statusFilterLabel?: string;
  typeFilterLabel?: string;
  difficultyFilterLabel?: string;
  noChallengesMessage?: string;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
  challengeCard?: ChallengeCardLabels;
  challengeDiscoveryCard?: ChallengeDiscoveryCardLabels;
  challengeRecommendationCard?: ChallengeRecommendationCardLabels;
  socialChallengeCard?: SocialChallengeCardLabels;
}
export type FetchChallengesPageViewResult = LocalizedContent<null, ChallengesPageViewLabelsBundle>;

// --- Timely Rewards Page/View Specific Types ---
export interface TimelyRewardFilterLabels {
  statusSectionTitle?: string;
  allLabel?: string;
  activeLabel?: string;
  completedLabel?: string;
  upcomingLabel?: string;
  typeAllLabel?: string;
  typeDailyLabel?: string;
  typeMorningLabel?: string;
  typeStreakLabel?: string;
  typeSpecialLabel?: string;
  clearFiltersLabel?: string;
}

export interface LuckyDrawLabels {
  title?: string;
  buttonText?: string;
  basicDrawLabel?: string;
  advancedDrawLabel?: string;
  premiumDrawLabel?: string;
  basicDrawDescription?: string;
  advancedDrawDescription?: string;
  premiumDrawDescription?: string;
  insufficientPointsLabel?: string;
  drawingLabel?: string;
  closeLabel?: string;
  continueLabel?: string;
}

export interface TimelyRewardCardLabels {
  typeDaily?: string;
  typeMorning?: string;
  typeStreak?: string;
  typeSpecial?: string;
  statusActive?: string;
  statusCompleted?: string;
  statusExpired?: string;
  statusUpcoming?: string;
  remainingTimeLabel?: string;
  timeEnded?: string;
  hourUnit?: string;
  minuteUnit?: string;
  luckyPointsLabel?: string;
  claimRewardButton?: string;
  inProgressButton?: string;
  completedOnLabel?: string;
  typeLabel?: string;
  statusLabel?: string;
  progressLabel?: string;
  startTimeLabel?: string;
  endTimeLabel?: string;
  completedTimeLabel?: string;
  continueEffortButton?: string;
  noRewardsMessage?: string;
}

export interface TimelyRewardsPageViewLabelsBundle {
  pageTitle?: string;
  filters?: TimelyRewardFilterLabels;
  luckyDraw?: LuckyDrawLabels;
  noRewardsMessage?: string;
  rewardCard?: TimelyRewardCardLabels;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
}
export type FetchTimelyRewardsPageViewResult = LocalizedContent<null, TimelyRewardsPageViewLabelsBundle>;

// --- Abilities Page/View Specific Types ---
export interface AbilityFilterLabels {
  statusLabel?: string;
  typeLabel?: string;
  allLabel?: string;
  unlockedLabel?: string;
  lockedLabel?: string;
  passiveLabel?: string;
  activeLabel?: string;
  ultimateLabel?: string;
  clearFiltersLabel?: string;
}

export interface AbilityCardLabels {
  typePassive: string;
  typeActive: string;
  typeUltimate: string;
  typeUnknown: string;
  rarityCommon: string;
  rarityUncommon: string;
  rarityRare: string;
  rarityEpic: string;
  rarityLegendary: string;
  requiredLevelLabel: string;
  cooldownLabel: string;
  cooldownRemainingLabel: string;
  activateButtonText: string;
  alreadyActivatedText: string;
  minutesUnit: string;
}

export interface AbilityDetailLabels {
  title: string;
  requiredLevelLabel: string;
  levelsNeededText: string;
  cooldownLabel: string;
  rarityLabel: string;
  typeLabel: string;
  effectLabel: string;
  activateButtonText: string;
  alreadyActivatedText: string;
}

export interface AbilityUnlockNotificationLabels {
  title: string;
  newAbilityTitle: string;
  nextButtonText: string;
  viewAllButtonText: string;
  allUnlockedTitle: string;
  closeButtonText: string;
}

export interface AbilitiesPageViewLabelsBundle {
  pageTitle?: string;
  filters?: AbilityFilterLabels;
  noAbilitiesMessage?: string;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
  pandaLevelLabel?: string;
  unlockedAbilitiesLabel?: string;
  abilitiesDescription?: string;
  abilityCard?: AbilityCardLabels;
  abilityDetail?: AbilityDetailLabels;
  abilityUnlockNotification?: AbilityUnlockNotificationLabels;
  benefitCardLabels?: VipBenefitCardLabelsBundle;
  vipSubscriptionOptionsLabels?: VipSubscriptionOptionsLabelsBundle;
  vipValueSummaryLabels?: VipValueSummaryLabelsBundle;
  vipHighlightDemoLabels?: VipHighlightDemoLabelsBundle;
  painPointDemoLabels?: PainPointDemoLabelsBundle;
  resourceShortageDemoLabels?: ResourceShortageDemoLabelsBundle;
  pandaSkinDemoLabels?: PandaSkinDemoLabelsBundle;
  vipValueModalLabels?: VipValueModalLabelsBundle;
}
export type FetchAbilitiesPageViewResult = LocalizedContent<null, AbilitiesPageViewLabelsBundle>;

// --- VIP Benefits Page/View Specific Types ---
export interface VipBenefitCategoryLabels {
  identity?: string;
  resources?: string;
  features?: string;
  exclusive?: string;
}

export interface VipBenefitItemLabels {
  title?: string;
  free?: string;
  vip?: string;
}

export interface VipBenefitsLabels {
  avatarFrame?: VipBenefitItemLabels;
  title?: VipBenefitItemLabels;
  bambooReward?: VipBenefitItemLabels;
  growthSpeed?: VipBenefitItemLabels;
  luckyDraw?: VipBenefitItemLabels;
  customGoals?: VipBenefitItemLabels;
  pandaSkins?: VipBenefitItemLabels;
  specialTasks?: VipBenefitItemLabels;
  meditation?: VipBenefitItemLabels;
}

export interface VipBenefitsButtonLabels {
  subscribe?: string;
  viewOptions?: string;
  back?: string;
}

export interface VipBenefitsPageViewLabelsBundle {
  pageTitle?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  alreadyVipMessage?: string;
  compareTitle?: string;
  freeTitle?: string;
  vipTitle?: string;
  benefitCategories?: VipBenefitCategoryLabels;
  benefits?: VipBenefitsLabels;
  buttons?: VipBenefitsButtonLabels;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
  benefitCardLabels?: VipBenefitCardLabelsBundle;
  vipSubscriptionOptionsLabels?: VipSubscriptionOptionsLabelsBundle;
  vipValueSummaryLabels?: VipValueSummaryLabelsBundle;
  vipHighlightDemoLabels?: VipHighlightDemoLabelsBundle;
  painPointDemoLabels?: PainPointDemoLabelsBundle;
  resourceShortageDemoLabels?: ResourceShortageDemoLabelsBundle;
  pandaSkinDemoLabels?: PandaSkinDemoLabelsBundle;
  vipValueModalLabels?: VipValueModalLabelsBundle;
}

export type FetchVipBenefitsPageViewResult = LocalizedContent<null, VipBenefitsPageViewLabelsBundle>;

// --- Definition for VipBenefitCardLabelsBundle (moved here for clarity) ---
export interface VipBenefitCardLabelsBundle { 
  freeUserLabel?: string;
  vipUserLabel?: string;
  activeLabel?: string;
  valueComparisonLabel?: string;
  standardLabel?: string;
  vipLabel?: string;
  coinsLabel?: string;
  experienceLabel?: string;
  itemsLabel?: string;
  timeLabel?: string;
  rewardsLabel?: string; // Default for generic valueType
}

// --- Definitions for other placeholder label bundles (moved here for clarity) ---
export interface VipSubscriptionOptionsLabelsBundle { 
  closeButton?: string; 
  title?: string;
  // ... other labels for subscription options ...
}
export interface VipValueSummaryLabelsBundle { 
  detailsButton?: string; 
  title?: string;
  totalValueLabel?: string;
  // ... other labels ...
}
export interface VipHighlightDemoLabelsBundle { 
  title?: string; 
  // ... other labels ...
}
export interface PainPointDemoLabelsBundle { 
  title?: string; 
  // ... other labels ...
}
export interface ResourceShortageDemoLabelsBundle { 
  title?: string; 
  // ... other labels ...
}
export interface PandaSkinDemoLabelsBundle { 
  title?: string; 
  // ... other labels ...
}
export interface VipValueModalLabelsBundle { 
  title?: string; 
  closeButton?: string;
  // ... other labels ...
}

// --- Store Page/View Specific Types ---
export interface StoreItemPreviewLabelsBundle {
  dialogTitle: string;
  purchaseButtonText: string;
  insufficientCurrencyError: string;
  vipRequiredError: string;
  purchaseFailedError: string;
  closeButtonText: string; // Though ScrollDialog might handle its own close button text
  rarityCommon: string;
  rarityUncommon: string;
  rarityRare: string;
  rarityEpic: string;
  rarityLegendary: string;
  rarityUnknown: string;
  itemTypeAvatar: string;
  itemTypeAccessory: string;
  itemTypeBackground: string;
  itemTypeTheme: string;
  itemTypeAbility: string;
  itemTypeConsumable: string;
  itemTypeVip: string;
  itemTypeUnknown: string;
  priceTypeCoins: string;
  priceTypeJade: string;
  priceTypeRealMoney: string;
  vipExclusiveBadge: string;
  saleBadge: string;
  previewAnimationButtonLabel: string; // for the eye icon
}

export interface StoreCategoryLabels {
  // Potentially labels for category names if not from DB
}

export interface StorePageViewLabelsBundle {
  pageTitle: string;
  featuredItemsTitle: string;
  saleItemsTitle: string;
  allItemsTitle: string;
  categoriesTitle: string;
  vipSectionTitle: string;
  vipSectionButtonOpen: string;
  vipSectionButtonClose: string;
  viewCartButtonText: string; // Assuming a cart feature might exist
  errorLoadingData: string;
  itemPreview: StoreItemPreviewLabelsBundle; // Nested structure for item preview labels
  vipCard: StoreVipCardLabelsBundle; // Nested for VIP card
  // currencyDisplay: { coinsLabel: string; jadeLabel: string; } // If needed
}

export type FetchStorePageViewResult = LocalizedContent<UserStoreDataPayload | null, StorePageViewLabelsBundle>;

export interface UserStoreDataPayload { // Assuming we might fetch all this together for the page
  categories: StoreCategoryRecord[];
  featuredItems: StoreItemRecord[];
  saleItems: StoreItemRecord[];
  userCurrency: UserCurrencyRecord | null;
  vipSubscription: VipSubscriptionRecord | null;
  isVip: boolean;
}

// --- Tea Room Page/View Specific Types ---
export interface TeaRoomPageViewLabelsBundle {
  pageTitle?: string;
  loadingMessage?: string;
  errorTitle?: string;
  retryButtonText?: string;
  moodTrackingSection?: {
    title?: string;
    description?: string;
    currentMoodQuestion?: string;
    recordMoodButton?: string;
    recordButtonCompact?: string;
    intensityLabel?: string;
    intensityPrefix?: string;
    noteLabel?: string;
    notePlaceholder?: string;
    historyLabel?: string;
    recentMoodsTitle?: string;
    noMoodsMessage?: string;
    backLabel?: string;
    intensityStrength?: {
      veryMild?: string;
      mild?: string;
      moderate?: string;
      strong?: string;
      veryStrong?: string;
    };
    moodTypes?: {
      happy?: string;
      content?: string;
      neutral?: string;
      sad?: string;
      anxious?: string;
      stressed?: string;
      tired?: string;
      energetic?: string;
      motivated?: string;
      frustrated?: string;
      angry?: string;
      calm?: string;
      unknown?: string;
    };
  };
  reflectionSection?: {
    title?: string;
    description?: string;
    startReflectionButton?: string;
    viewHistoryButton?: string;
  };
  dailyTipSection?: {
    title?: string;
    content?: string;
  };
  reflectionTriggers?: {
    title?: string;
    description?: string;
    triggerTypes?: {
      moodChange?: string;
      taskFailure?: string;
      dailyReflection?: string;
      weeklyReview?: string;
      manual?: string;
      unknown?: string;
    };
    messages?: {
      moodChange?: string;
      taskFailureWithTitle?: string;
      taskFailureGeneric?: string;
      dailyReflection?: string;
      weeklyReview?: string;
      manual?: string;
      unknown?: string;
    };
    buttons?: {
      dismiss?: string;
      later?: string;
      start?: string;
    };
  };
  enhancedReflectionModule?: {
    title?: string;
    triggerMessages?: {
      moodChange?: string;
      taskFailureWithTitle?: string;
      taskFailureGeneric?: string;
      dailyReflection?: string;
      weeklyReview?: string;
      defaultWelcome?: string;
      taskSpecific?: string;
    };
    step1?: {
      toggleMoodTrackerShow?: string;
      toggleMoodTrackerHide?: string;
      reflectionInputLabel?: string;
      reflectionInputPlaceholder?: string;
      continueButton?: string;
    };
    step2?: {
      thankYouMessage?: string;
      tagsLabel?: string;
      selectTagPlaceholder?: string;
      customTagPlaceholder?: string;
      addTagButton?: string;
      suggestedActionsLabel?: string;
      customActionLabel?: string;
      customActionPlaceholder?: string;
      backButton?: string;
      completeButton?: string;
    };
    tags?: {
      happy?: string;
      sad?: string;
      anxious?: string;
      stressed?: string;
      tired?: string;
      work?: string;
      study?: string;
      family?: string;
      social?: string;
      health?: string;
    };
    suggestedActions?: {
      meditation?: string;
      walking?: string;
      talkToFriend?: string;
      gratitude?: string;
      restEarly?: string;
      takeNap?: string;
      reduceTasks?: string;
      stayHydrated?: string;
      pomodoro?: string;
      breakDownTasks?: string;
      noDistractions?: string;
      smallGoal?: string;
      callFriend?: string;
      joinActivity?: string;
      newHobby?: string;
    };
  };
}
export type FetchTeaRoomPageViewResult = LocalizedContent<null, TeaRoomPageViewLabelsBundle>;

// --- Battle Pass Page/View Specific Types ---
import { BattlePassPageViewLabelsBundle } from './battle-pass';
export type FetchBattlePassPageViewResult = LocalizedContent<null, BattlePassPageViewLabelsBundle>;

// --- Bamboo Collection Page/View Specific Types ---
export interface BambooCollectionPageViewLabelsBundle {
  pageTitle?: string;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
  noSpotsMessage?: string;
  collectButton?: string;
  spotStatusAvailable?: string;
  spotStatusDepleted?: string;
  spotStatusRespawning?: string;
  nextAvailableLabel?: string;
}

export interface BambooCollectionPageViewDataPayload {
  totalBambooCollected?: number;
}

export type FetchBambooCollectionPageViewResult = LocalizedContent<
  BambooCollectionPageViewDataPayload | null,
  BambooCollectionPageViewLabelsBundle
>;

// --- Bamboo Dashboard Page/View Specific Types ---
export interface BambooDashboardPageViewLabelsBundle {
  pageTitle?: string;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
  overviewSectionTitle?: string;
  growthSectionTitle?: string;
  marketSectionTitle?: string;
  totalBambooLabel?: string;
  bambooGrowthRateLabel?: string;
  marketPriceLabel?: string;
}

export interface BambooDashboardPageViewDataPayload {
  totalBamboo?: number;
  growthRate?: number;
  currentMarketPrice?: number;
  userName?: string;
  lastActivityDate?: string;
}

export type FetchBambooDashboardPageViewResult = LocalizedContent<
  BambooDashboardPageViewDataPayload | null,
  BambooDashboardPageViewLabelsBundle
>;

// --- Bamboo Trading Page/View Specific Types ---
export interface BambooTradingPageViewLabelsBundle {
  pageTitle?: string;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
  currentPriceLabel?: string;
  yourBambooLabel?: string;
  sellAmountLabel?: string;
  sellButtonText?: string;
  buyAmountLabel?: string;
  buyButtonText?: string;
  notEnoughBambooError?: string;
  transactionSuccessMessage?: string;
  transactionFailedMessage?: string;
}

export interface BambooTradingPageViewDataPayload {
  currentMarketPrice?: number;
  userBambooStock?: number;
  recentTransactions?: Array<{ id: string; type: 'buy' | 'sell'; amount: number; price: number; timestamp: string }>;
}

export type FetchBambooTradingPageViewResult = LocalizedContent<
  BambooTradingPageViewDataPayload | null,
  BambooTradingPageViewLabelsBundle
>;

// --- Custom Goals Page/View Specific Types ---
import type { GoalStatus } from './goals';

export interface CustomGoalRecord {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit?: string;
  createdAt: string;
  deadline?: string;
  isAchieved: boolean;
  status?: GoalStatus;
}

export interface CustomGoalsPageViewLabelsBundle {
  pageTitle?: string;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
  createGoalButton?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  filterAll?: string;
  filterActive?: string;
  filterCompleted?: string;
  goalLimitInfo?: string;
  becomeVipButton?: string;
  vipBenefitHint?: string;
  vipPromotionTitle?: string;
  vipPromotionDescription?: string;
  upgradeButton?: string;
  editGoalButton?: string;
  deleteGoalButton?: string;
  markCompleteButton?: string;
  markActiveButton?: string;
  formTitleCreate?: string;
  formTitleEdit?: string;
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  vipModalTitle?: string;
  customGoalCardLabels?: CustomGoalCardLabels;
}

export interface CustomGoalsPageViewDataPayload {
  username?: string; 
  goals?: CustomGoalRecord[];
  isVipUser?: boolean;
  currentGoalCount?: number;
  goalLimit?: number;
}

export type FetchCustomGoalsPageViewResult = LocalizedContent<
  CustomGoalsPageViewDataPayload | null,
  CustomGoalsPageViewLabelsBundle
>;

// --- Avatar Frame Showcase Page/View Specific Types ---
export interface AvatarFrameShowcaseLabelsBundle {
  pageTitle?: string;
  pageDescription?: string;
  animationToggleLabel?: string;
  vipBadgeToggleLabel?: string;
  onlineStatusToggleLabel?: string;
  frameTypeSectionTitle?: string;
  frameTypeLabels?: {
    [key in AvatarFrameType]?: string; // AvatarFrameType will need to be importable or defined here
  };
  frameDescriptionSectionTitle?: string;
  frameDescriptions?: {
    [key in AvatarFrameType]?: string; // AvatarFrameType will need to be importable or defined here
  };
}

export enum AvatarFrameType {
  NONE = 'none',
  BASIC = 'basic',
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  JADE = 'jade',
  BAMBOO = 'bamboo',
  DRAGON = 'dragon',
  PHOENIX = 'phoenix',
  CUSTOM = 'custom',
}

export type FetchAvatarFrameShowcaseViewResult = LocalizedContent<null, AvatarFrameShowcaseLabelsBundle>;

// Ensure HomeResourcesSectionLabels and HomeTasksSectionLabels are defined with optional properties
export interface HomeResourcesSectionLabels {
    sectionTitle?: string;
    bambooLabel?: string;
    coinsLabel?: string;
    jadeLabel?: string;
    viewAllButton?: string;
}

export interface HomeTasksSectionLabels {
    sectionTitle?: string;
    noTasksMessage?: string;
    viewTasksButton?: string;
    quickAddTaskPlaceholder?: string;
    quickAddTaskButton?: string;
}

// Assuming SoundSettingsSectionLabels, NotificationSettingsSectionLabels, AnimationSettingsSectionLabels exist
export interface SoundSettingsSectionLabels {
    masterVolume?: string;
    musicVolume?: string;
    sfxVolume?: string;
    voiceVolume?: string;
}
export interface NotificationSettingsSectionLabels {
    enableAll?: string;
    taskReminders?: string;
    eventUpdates?: string;
}
export interface AnimationSettingsSectionLabels {
    enableAnimations?: string;
    reduceMotion?: string;
}

// Re-add StoreVipCardLabelsBundle
export interface StoreVipCardLabelsBundle {
  subscribeButtonText?: string;
  currentPlanText?: string;
  expiresText?: string;
  benefitsTitle?: string;
  // Add any other specific labels for this card
}

// --- Social Comparison Page/View Specific Types ---
export interface SocialComparisonPageFeatureLabels {
  featureName?: string;
  userScore?: string;
  friendScore?: string;
  rankGlobal?: string;
  rankFriends?: string;
}

export interface SocialComparisonPageViewLabelsBundle {
  pageTitle?: string;
  loadingText?: string;
  errorText?: string;
  noFriendsMessage?: string;
  inviteFriendsButton?: string;
  comparisonSectionTitle?: string;
  featureComparison?: SocialComparisonPageFeatureLabels[]; // Array of features to compare

  // Add missing properties based on SocialComparisonPage.tsx usage
  pageDescription?: string;
  leaderboardTab?: string;
  friendsTab?: string;
  vipPromotionTitle?: string;
  vipPromotionDescription?: string;
  upgradeButton?: string; 
  comingSoonTitle?: string;
  comingSoonDescription?: string;
  vipEarlyAccessTitle?: string;
  vipEarlyAccessDescription?: string;
}

export interface SocialComparisonPageDataPayload {
  currentUser?: { id: string; name: string; avatarUrl?: string; };
  friends?: Array<{ 
    id: string; 
    name: string; 
    avatarUrl?: string; 
    comparisonData?: Record<string, { userScore: number; friendScore: number }>;
  }>;
}

export type FetchSocialComparisonPageViewResult = LocalizedContent<SocialComparisonPageDataPayload | null, SocialComparisonPageViewLabelsBundle>;