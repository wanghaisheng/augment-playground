// src/types/index.ts
export type Language = "en" | "zh";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export interface ApiError extends Error { errorCode?: string; statusCode?: number; }

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
  labels: TLabelsBundle;
  data: TDataPayload | null;
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

export interface ComponentsLabelsBundle {
  button: ButtonLabels;
  loading: LoadingLabels;
  error: ErrorLabels;
  emptyState: EmptyStateLabels;
  modal: ModalLabels;
  taskReminder: TaskReminderLabels;
  vipSubscription: VipSubscriptionLabels;
}

export type FetchComponentsLabelsResult = LocalizedContent<null, ComponentsLabelsBundle>;

// --- Global / Layout Content Types ---
export interface GlobalLayoutLabelsBundle {
  appTitle: string;
  navHome: string;
  navTasks: string;
  navAbilities: string;
  navRewards: string;
  navChallenges: string;
  navTeaRoom: string;
  navStore: string;
  navVip: string;
  navBattlePass: string;
  navSettings: string;
  footerText: string;
  loadingGeneric: string;
  errorGeneric: string;
  appErrorHeading?: string;
  appErrorGeneralMessage?: string;
}
export type FetchGlobalLayoutViewResult = LocalizedContent<null, GlobalLayoutLabelsBundle>;

// --- Home Page/View Specific Types ---
export interface HomeWelcomeSectionLabels {
  welcomeMessage: string;
}
export interface MoodItem { readonly id: number; readonly name: string; readonly feeling: string; }
export interface HomeMoodsSectionLabels {
  sectionTitle: string;
  noMoodsMessage: string;
  refreshButtonText: string;
}
export interface HomePandaSectionLabels {
  sectionTitle: string;
  levelLabel: string;
  experienceLabel: string;
  interactButtonText: string;
  feedButtonText: string;
  playButtonText: string;
  trainButtonText: string;
}
export interface HomePageViewLabelsBundle {
  pageTitle: string;
  welcomeSection: HomeWelcomeSectionLabels;
  moodsSection: HomeMoodsSectionLabels;
  pandaSection: HomePandaSectionLabels;
  someActionText: string; // Example of a page-level label for a generic action
}
export interface HomePageViewDataPayload {
  username: string;
  moods: readonly MoodItem[];
}
export type FetchHomePageViewResult = LocalizedContent<HomePageViewDataPayload, HomePageViewLabelsBundle>;

// --- Settings Page/View Specific Types ---
export interface SettingsLanguageSectionLabels {
  sectionTitle: string;
  selectLanguagePrompt: string;
  currentLanguageIs: string;
  langNameEn: string;
  langNameZh: string;
  saveButtonText: string;
  successMessage: string;
}
export interface SettingsPageViewLabelsBundle {
  pageTitle: string;
  languageSection: SettingsLanguageSectionLabels;
}
export type FetchSettingsPageViewResult = LocalizedContent<null, SettingsPageViewLabelsBundle>;

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
  sectionTitle: string;
  createTaskButton: string;
  filterAllLabel: string;
  filterTodoLabel: string;
  filterInProgressLabel: string;
  filterCompletedLabel: string;
  noTasksMessage: string;
  taskForm?: TaskFormLabels;
}

export interface TasksPageViewLabelsBundle {
  pageTitle: string;
  taskManager: TaskManagerLabels;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
}
export type FetchTasksPageViewResult = LocalizedContent<null, TasksPageViewLabelsBundle>;

// --- Challenges Page/View Specific Types ---
export interface ChallengeFilterLabels {
  statusLabel: string;
  typeLabel: string;
  difficultyLabel: string;
  allLabel: string;
  activeLabel: string;
  completedLabel: string;
  upcomingLabel: string;
  typeAllLabel: string;
  typeDailyLabel: string;
  typeWeeklyLabel: string;
  typeEventLabel: string;
  typeOngoingLabel: string;
  difficultyAllLabel: string;
  difficultyEasyLabel: string;
  difficultyMediumLabel: string;
  difficultyHardLabel: string;
  difficultyExpertLabel: string;
  clearFiltersLabel: string;
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
  pageTitle: string;
  filters: ChallengeFilterLabels;
  statusFilterLabel?: string;
  typeFilterLabel?: string;
  difficultyFilterLabel?: string;
  noChallengesMessage: string;
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
  allLabel: string;
  activeLabel: string;
  completedLabel: string;
  upcomingLabel: string;
  typeAllLabel: string;
  typeDailyLabel: string;
  typeMorningLabel: string;
  typeStreakLabel: string;
  typeSpecialLabel: string;
  clearFiltersLabel: string;
}

export interface LuckyDrawLabels {
  title: string;
  buttonText: string;
  basicDrawLabel: string;
  advancedDrawLabel: string;
  premiumDrawLabel: string;
  basicDrawDescription: string;
  advancedDrawDescription: string;
  premiumDrawDescription: string;
  insufficientPointsLabel: string;
  drawingLabel: string;
  closeLabel: string;
  continueLabel: string;
}

export interface TimelyRewardCardLabels {
  typeDaily: string;
  typeMorning: string;
  typeStreak: string;
  typeSpecial: string;
  statusActive: string;
  statusCompleted: string;
  statusExpired: string;
  statusUpcoming: string;
  remainingTimeLabel: string;
  timeEnded: string;
  hourUnit: string;
  minuteUnit: string;
  luckyPointsLabel: string;
  claimRewardButton: string;
  inProgressButton: string;
  completedOnLabel: string;
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
  pageTitle: string;
  filters: TimelyRewardFilterLabels;
  luckyDraw: LuckyDrawLabels;
  noRewardsMessage: string;
  rewardCard: TimelyRewardCardLabels;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
}
export type FetchTimelyRewardsPageViewResult = LocalizedContent<null, TimelyRewardsPageViewLabelsBundle>;

// --- Abilities Page/View Specific Types ---
export interface AbilityFilterLabels {
  statusLabel: string;
  typeLabel: string;
  allLabel: string;
  unlockedLabel: string;
  lockedLabel: string;
  passiveLabel: string;
  activeLabel: string;
  ultimateLabel: string;
  clearFiltersLabel: string;
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
  pageTitle: string;
  filters: AbilityFilterLabels;
  noAbilitiesMessage: string;
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
}
export type FetchAbilitiesPageViewResult = LocalizedContent<null, AbilitiesPageViewLabelsBundle>;

// --- VIP Benefits Page/View Specific Types ---
export interface VipBenefitCategoryLabels {
  identity: string;
  resources: string;
  features: string;
  exclusive: string;
}

export interface VipBenefitItemLabels {
  title: string;
  free: string;
  vip: string;
}

export interface VipBenefitsLabels {
  avatarFrame: VipBenefitItemLabels;
  title: VipBenefitItemLabels;
  bambooReward: VipBenefitItemLabels;
  growthSpeed: VipBenefitItemLabels;
  luckyDraw: VipBenefitItemLabels;
  customGoals: VipBenefitItemLabels;
  pandaSkins: VipBenefitItemLabels;
  specialTasks: VipBenefitItemLabels;
  meditation: VipBenefitItemLabels;
}

export interface VipBenefitsButtonLabels {
  subscribe: string;
  viewOptions: string;
  back: string;
}

export interface VipBenefitsPageViewLabelsBundle {
  pageTitle: string;
  headerTitle: string;
  headerSubtitle: string;
  alreadyVipMessage?: string;
  compareTitle: string;
  freeTitle: string;
  vipTitle: string;
  benefitCategories: VipBenefitCategoryLabels;
  benefits: VipBenefitsLabels;
  buttons: VipBenefitsButtonLabels;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
}

export type FetchVipBenefitsPageViewResult = LocalizedContent<null, VipBenefitsPageViewLabelsBundle>;

// --- Store Page/View Specific Types ---
export interface StorePageViewLabelsBundle {
  pageTitle: string;
  loadingMessage?: string;
  errorTitle?: string;
  retryButtonText?: string;
  currencySection?: {
    coinsLabel?: string;
    jadeLabel?: string;
    vipLabel?: string;
  };
  vipToggleButton?: {
    showVip?: string;
    backToStore?: string;
  };
  vipSection?: {
    description?: string;
    tierLabels?: {
      basic?: string;
      premium?: string;
      deluxe?: string;
    }
  };
  categoriesTitle?: string;
  featuredItemsTitle?: string;
  saleItemsTitle?: string;
  categoryItemsTitle?: string;
  noCategoriesMessage?: string;
  noItemsMessage?: string;
}
export type FetchStorePageViewResult = LocalizedContent<null, StorePageViewLabelsBundle>;

// --- Tea Room Page/View Specific Types ---
export interface TeaRoomPageViewLabelsBundle {
  pageTitle: string;
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
}
export type FetchTeaRoomPageViewResult = LocalizedContent<null, TeaRoomPageViewLabelsBundle>;

// --- Battle Pass Page/View Specific Types ---
import { BattlePassPageViewLabelsBundle } from './battle-pass';
export type FetchBattlePassPageViewResult = LocalizedContent<null, BattlePassPageViewLabelsBundle>;