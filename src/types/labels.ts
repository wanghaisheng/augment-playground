// src/types/labels.ts

/**
 * 标签类型定义
 * 提供与标签相关的类型定义
 */

/**
 * 组件标签包
 * 包含所有组件的标签
 */
export interface ComponentsLabelsBundle {
  button: ButtonLabels;
  loading: LoadingLabels;
  error: ErrorLabels;
  emptyState: EmptyStateLabels;
  modal: ModalLabels;
  taskReminder: TaskReminderLabels;
  vipSubscription: VipSubscriptionLabels;
  taskCard: TaskCardLabels;
  deleteConfirmation: DeleteConfirmationLabels;
  timelyRewardCongrats: TimelyRewardCongratsLabels;
}

/**
 * 按钮标签
 */
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

/**
 * 加载标签
 */
export interface LoadingLabels {
  generic: string;
  data: string;
  content: string;
  saving: string;
  processing: string;
}

/**
 * 错误标签
 */
export interface ErrorLabels {
  generic: string;
  title: string;
  retry: string;
  details: string;
  networkError: string;
  serverError: string;
  unknownError: string;
  loadingError: string;
  taskNotFound: string;
  completeTaskError: string;
  deleteTaskError: string;
  createTaskError: string;
  updateTaskError: string;
  loadingDataError: string;
  savingDataError: string;
  processingError: string;
  validationError: string;
  authenticationError: string;
  permissionError: string;
}

/**
 * 空状态标签
 */
export interface EmptyStateLabels {
  generic: string;
  noData: string;
  noResults: string;
  noItems: string;
}

/**
 * 模态框标签
 */
export interface ModalLabels {
  close: string;
  confirm: string;
  cancel: string;
}

/**
 * 任务提醒标签
 */
export interface TaskReminderLabels {
  title: string;
  message: string;
  remindLater: string;
  dismiss: string;
}

/**
 * VIP订阅标签
 */
export interface VipSubscriptionLabels {
  title: string;
  description: string;
  subscribe: string;
  cancel: string;
  benefits: string;
  price: string;
  period: string;
}

/**
 * 任务卡片标签
 */
export interface TaskCardLabels {
  subtasksIndicator: string;
  completeButton: string;
  editButton: string;
  deleteButton: string;
  viewDetailsButton: string;
  priority: {
    high: string;
    medium: string;
    low: string;
    unknown: string;
  };
  status: {
    overdue: string;
    completed: string;
    inProgress: string;
    todo: string;
  };
  dates: {
    dueDate: string;
    createdDate: string;
    completedDate: string;
  };
}

/**
 * 删除确认标签
 */
export interface DeleteConfirmationLabels {
  title: string;
  message: string;
  confirmButton: string;
  cancelButton: string;
}

/**
 * 及时奖励恭喜标签
 */
export interface TimelyRewardCongratsLabels {
  title: string;
  message: string;
  claimButton: string;
  closeButton: string;
}

/**
 * 任务表单标签
 */
export interface TaskFormLabels {
  title: string;
  titlePlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  dueDate: string;
  dueDatePlaceholder: string;
  priority: string;
  priorityOptions: {
    low: string;
    medium: string;
    high: string;
  };
  category: string;
  categoryPlaceholder: string;
  tags: string;
  tagsPlaceholder: string;
  estimatedTime: string;
  estimatedTimePlaceholder: string;
  reminder: string;
  reminderOptions: {
    none: string;
    onDueDate: string;
    oneDayBefore: string;
    twoDaysBefore: string;
    oneWeekBefore: string;
  };
  repeat: string;
  repeatOptions: {
    none: string;
    daily: string;
    weekly: string;
    monthly: string;
    custom: string;
  };
  attachments: string;
  attachmentsPlaceholder: string;
  subtasks: string;
  addSubtaskButton: string;
  subtaskPlaceholder: string;
  saveButton: string;
  cancelButton: string;
  deleteButton: string;
  validation: {
    titleRequired: string;
    dueDateInvalid: string;
    priorityRequired: string;
    categoryRequired: string;
    estimatedTimeInvalid: string;
  };
  successMessage: string;
  errorMessage: string;
  loadingMessage: string;
}

/**
 * 挑战卡片标签
 */
export interface ChallengeCardLabels {
  title: string;
  description: string;
  difficulty: string;
  difficultyLevels: {
    easy: string;
    medium: string;
    hard: string;
    expert: string;
  };
  duration: string;
  durationUnits: {
    days: string;
    weeks: string;
    months: string;
  };
  rewards: string;
  rewardTypes: {
    experience: string;
    coins: string;
    items: string;
    achievements: string;
  };
  progress: string;
  progressUnits: {
    percent: string;
    steps: string;
    tasks: string;
  };
  status: {
    notStarted: string;
    inProgress: string;
    completed: string;
    failed: string;
    expired: string;
  };
  actions: {
    start: string;
    continue: string;
    complete: string;
    abandon: string;
    retry: string;
  };
  participants: string;
  participantsCount: string;
  leaderboard: string;
  leaderboardRank: string;
  timeRemaining: string;
  timeUnits: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  tags: string;
  tagTypes: {
    daily: string;
    weekly: string;
    monthly: string;
    special: string;
    seasonal: string;
  };
  requirements: string;
  requirementsList: {
    level: string;
    items: string;
    achievements: string;
    previousChallenges: string;
  };
  successMessage: string;
  errorMessage: string;
  loadingMessage: string;
}

/**
 * 幸运抽奖标签
 */
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

/**
 * 能力过滤器标签
 */
export interface AbilityFilterLabels {
  title: string;
  searchPlaceholder: string;
  categories: {
    all: string;
    active: string;
    passive: string;
    special: string;
  };
  rarities: {
    common: string;
    uncommon: string;
    rare: string;
    epic: string;
    legendary: string;
  };
  types: {
    combat: string;
    utility: string;
    support: string;
    movement: string;
    defense: string;
  };
  status: {
    unlocked: string;
    locked: string;
    inProgress: string;
    mastered: string;
  };
  sortOptions: {
    name: string;
    rarity: string;
    type: string;
    level: string;
    unlockDate: string;
  };
  sortDirections: {
    ascending: string;
    descending: string;
  };
  filterButton: string;
  clearButton: string;
  applyButton: string;
  resetButton: string;
  noResultsMessage: string;
  loadingMessage: string;
  errorMessage: string;
}

/**
 * VIP福利类别标签
 */
export interface VipBenefitCategoryLabels {
  identity: string;
  resources: string;
  features: string;
  exclusive: string;
  daily: string;
  weekly: string;
  monthly: string;
  seasonal: string;
  special: string;
  permanent: string;
  temporary: string;
  limited: string;
  premium: string;
  deluxe: string;
  ultimate: string;
  categories: {
    rewards: string;
    abilities: string;
    items: string;
    cosmetics: string;
    services: string;
    support: string;
  };
  status: {
    active: string;
    inactive: string;
    upcoming: string;
    expired: string;
  };
  tiers: {
    basic: string;
    standard: string;
    premium: string;
    deluxe: string;
    ultimate: string;
  };
  duration: {
    daily: string;
    weekly: string;
    monthly: string;
    quarterly: string;
    yearly: string;
    lifetime: string;
  };
  availability: {
    all: string;
    vip: string;
    premium: string;
    deluxe: string;
    ultimate: string;
  };
}

/**
 * VIP福利项标签
 */
export interface VipBenefitItemLabels {
  title: string;
  description: string;
  free: string;
  vip: string;
  premium: string;
  deluxe: string;
  ultimate: string;
  status: {
    available: string;
    locked: string;
    inProgress: string;
    completed: string;
    expired: string;
  };
  rewards: {
    experience: string;
    coins: string;
    items: string;
    abilities: string;
    cosmetics: string;
  };
  requirements: {
    level: string;
    vipLevel: string;
    items: string;
    achievements: string;
  };
  duration: {
    permanent: string;
    temporary: string;
    limited: string;
  };
  timeRemaining: string;
  timeUnits: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  actions: {
    claim: string;
    purchase: string;
    upgrade: string;
    activate: string;
    deactivate: string;
  };
  messages: {
    success: string;
    error: string;
    loading: string;
    insufficient: string;
    expired: string;
    locked: string;
  };
}

/**
 * 标签包类型
 * 用于定义不同页面和组件的标签包
 */
export type LabelsBundle =
  | ComponentsLabelsBundle
  | GlobalLayoutLabelsBundle
  | HomePageViewLabelsBundle
  | SettingsPageViewLabelsBundle
  | TasksPageViewLabelsBundle
  | ChallengesPageViewLabelsBundle
  | TimelyRewardsPageViewLabelsBundle
  | AbilitiesPageViewLabelsBundle
  | VipBenefitsPageViewLabelsBundle
  | StorePageViewLabelsBundle
  | TeaRoomPageViewLabelsBundle;

/**
 * 全局布局标签包
 */
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
  navCustomGoals: string;
  navSocial: string;
  navAvatarFrames: string;
  navBambooPlanting: string;
  navBambooTrading: string;
  navBambooDashboard: string;
  navSettings: string;
  footerText: string;
  loadingGeneric: string;
  errorGeneric: string;
  appErrorHeading: string;
  appErrorGeneralMessage: string;
}

/**
 * 首页欢迎区域标签
 */
export interface HomeWelcomeSectionLabels {
  welcomeMessage: string;
  changeTitleText: string;
  subtitle: string;
  dailyStreak: string;
  streakDays: string;
  levelProgress: string;
  levelUpButton: string;
  viewProfileButton: string;
}

/**
 * 心情项
 */
export interface MoodItem {
  readonly id: number;
  readonly name: string;
  readonly feeling: string;
}

/**
 * 首页心情区域标签
 */
export interface HomeMoodsSectionLabels {
  sectionTitle: string;
  noMoodsMessage: string;
  refreshButtonText: string;
  addMoodButton: string;
  moodHistoryTitle: string;
  moodTypes: {
    happy: string;
    content: string;
    neutral: string;
    sad: string;
    anxious: string;
    stressed: string;
    tired: string;
    energetic: string;
    motivated: string;
    frustrated: string;
    angry: string;
    calm: string;
    unknown: string;
  };
  intensityLevels: {
    veryMild: string;
    mild: string;
    moderate: string;
    strong: string;
    veryStrong: string;
  };
}

/**
 * 首页熊猫区域标签
 */
export interface HomePandaSectionLabels {
  sectionTitle: string;
  levelLabel: string;
  experienceLabel: string;
  interactButtonText: string;
  feedButtonText: string;
  playButtonText: string;
  trainButtonText: string;
  pandaStatus: {
    happy: string;
    content: string;
    neutral: string;
    sad: string;
    tired: string;
    energetic: string;
    hungry: string;
    full: string;
    playful: string;
    sleepy: string;
  };
  interactionTypes: {
    feed: string;
    play: string;
    train: string;
    pet: string;
    talk: string;
  };
  rewards: {
    experience: string;
    bamboo: string;
    coins: string;
    items: string;
  };
}

/**
 * 主页视图标签包
 */
export interface HomePageViewLabelsBundle {
  pageTitle: string;
  welcomeSection: HomeWelcomeSectionLabels;
  moodsSection: HomeMoodsSectionLabels;
  pandaSection: HomePandaSectionLabels;
  someActionText: string;
  initializeGameText: string;
  initializingText: string;
  initializeGameDescription: string;
}

/**
 * 主页视图数据负载
 */
export interface HomePageViewDataPayload {
  username: string;
  moods: readonly MoodItem[];
}

/**
 * 设置页面语言区域标签
 */
export interface SettingsLanguageSectionLabels {
  sectionTitle: string;
  selectLanguagePrompt: string;
  currentLanguageIs: string;
  langNameEn: string;
  langNameZh: string;
  saveButtonText: string;
  successMessage: string;
  errorMessage: string;
  loadingMessage: string;
  languageChangedMessage: string;
  languageChangeFailedMessage: string;
  languageOptions: {
    en: string;
    zh: string;
  };
  languageDescriptions: {
    en: string;
    zh: string;
  };
  languageFlags: {
    en: string;
    zh: string;
  };
}

/**
 * 设置页面视图标签包
 */
export interface SettingsPageViewLabelsBundle {
  pageTitle: string;
  languageSection: SettingsLanguageSectionLabels;
  themeSection: {
    sectionTitle: string;
    lightMode: string;
    darkMode: string;
    systemDefault: string;
    themeChangedMessage: string;
    themeChangeFailedMessage: string;
  };
  notificationSection: {
    sectionTitle: string;
    enableNotifications: string;
    notificationTypes: {
      taskReminders: string;
      dailyCheckin: string;
      achievements: string;
      rewards: string;
      events: string;
    };
    notificationChangedMessage: string;
    notificationChangeFailedMessage: string;
  };
  accountSection: {
    sectionTitle: string;
    profileSettings: string;
    privacySettings: string;
    securitySettings: string;
    dataExport: string;
    deleteAccount: string;
  };
  aboutSection: {
    sectionTitle: string;
    version: string;
    termsOfService: string;
    privacyPolicy: string;
    contactUs: string;
    feedback: string;
  };
  loadingMessage: string;
  errorMessage: string;
  saveSuccessMessage: string;
  saveFailedMessage: string;
}

/**
 * 任务管理器标签
 */
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

/**
 * 任务页面视图标签包
 */
export interface TasksPageViewLabelsBundle {
  pageTitle: string;
  taskManager: TaskManagerLabels;
  loadingMessage: string;
  errorTitle: string;
  errorMessage: string;
  retryButtonText: string;
}

/**
 * 挑战过滤器标签
 */
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

/**
 * 挑战发现卡片标签
 */
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

/**
 * 挑战推荐卡片标签
 */
export interface ChallengeRecommendationCardLabels {
  matchRateLabel?: string;
  startDateLabel?: string;
  endDateLabel?: string;
  viewDetailsButton?: string;
  acceptButton?: string;
}

/**
 * 社交挑战卡片标签
 */
export interface SocialChallengeCardLabels {
  progressLabel?: string;
  shareButton?: string;
  leaveButton?: string;
  joinButton?: string;
}

/**
 * 挑战页面视图标签包
 */
export interface ChallengesPageViewLabelsBundle {
  pageTitle: string;
  filters: ChallengeFilterLabels;
  statusFilterLabel: string;
  typeFilterLabel: string;
  difficultyFilterLabel: string;
  noChallengesMessage: string;
  loadingMessage: string;
  errorTitle: string;
  errorMessage: string;
  retryButtonText: string;
  challengeCard: ChallengeCardLabels;
  challengeDiscoveryCard: ChallengeDiscoveryCardLabels;
  challengeRecommendationCard: ChallengeRecommendationCardLabels;
  socialChallengeCard: SocialChallengeCardLabels;
}

/**
 * 及时奖励过滤器标签
 */
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

/**
 * 及时奖励卡片标签
 */
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

/**
 * 及时奖励页面视图标签包
 */
export interface TimelyRewardsPageViewLabelsBundle {
  pageTitle: string;
  filters: TimelyRewardFilterLabels;
  luckyDraw: LuckyDrawLabels;
  noRewardsMessage: string;
  rewardCard: TimelyRewardCardLabels;
  loadingMessage: string;
  errorTitle: string;
  errorMessage: string;
}

/**
 * 能力卡片标签
 */
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

/**
 * 能力详情标签
 */
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

/**
 * 能力解锁通知标签
 */
export interface AbilityUnlockNotificationLabels {
  title: string;
  newAbilityTitle: string;
  nextButtonText: string;
  viewAllButtonText: string;
  allUnlockedTitle: string;
  closeButtonText: string;
}

/**
 * 能力页面视图标签包
 */
export interface AbilitiesPageViewLabelsBundle {
  pageTitle: string;
  filters: AbilityFilterLabels;
  noAbilitiesMessage: string;
  loadingMessage: string;
  errorTitle: string;
  errorMessage: string;
  retryButtonText: string;
  pandaLevelLabel: string;
  unlockedAbilitiesLabel: string;
  abilitiesDescription: string;
  abilityCard: AbilityCardLabels;
  abilityDetail: AbilityDetailLabels;
  abilityUnlockNotification: AbilityUnlockNotificationLabels;
}

/**
 * VIP福利标签
 */
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

/**
 * VIP福利按钮标签
 */
export interface VipBenefitsButtonLabels {
  subscribe: string;
  viewOptions: string;
  back: string;
}

/**
 * VIP福利页面视图标签包
 */
export interface VipBenefitsPageViewLabelsBundle {
  pageTitle: string;
  headerTitle: string;
  headerSubtitle: string;
  alreadyVipMessage: string;
  compareTitle: string;
  freeTitle: string;
  vipTitle: string;
  benefitCategories: VipBenefitCategoryLabels;
  benefits: VipBenefitsLabels;
  buttons: VipBenefitsButtonLabels;
  loadingMessage: string;
  errorTitle: string;
  errorMessage: string;
  retryButtonText: string;
}

/**
 * 商店页面视图标签包
 */
export interface StorePageViewLabelsBundle {
  pageTitle: string;
  loadingMessage: string;
  errorTitle: string;
  retryButtonText: string;
  currencySection: {
    coinsLabel: string;
    jadeLabel: string;
    vipLabel: string;
  };
  vipToggleButton: {
    showVip: string;
    backToStore: string;
  };
  vipSection: {
    description: string;
    tierLabels: {
      basic: string;
      premium: string;
      deluxe: string;
    }
  };
  categoriesTitle: string;
  featuredItemsTitle: string;
  saleItemsTitle: string;
  categoryItemsTitle: string;
  noCategoriesMessage: string;
  noItemsMessage: string;
}

/**
 * 茶室页面视图标签包
 */
export interface TeaRoomPageViewLabelsBundle {
  pageTitle: string;
  loadingMessage: string;
  errorTitle: string;
  retryButtonText: string;
  moodTrackingSection: {
    title: string;
    description: string;
    currentMoodQuestion: string;
    recordMoodButton: string;
    recordButtonCompact: string;
    intensityLabel: string;
    intensityPrefix: string;
    noteLabel: string;
    notePlaceholder: string;
    historyLabel: string;
    recentMoodsTitle: string;
    noMoodsMessage: string;
    backLabel: string;
    intensityStrength: {
      veryMild: string;
      mild: string;
      moderate: string;
      strong: string;
      veryStrong: string;
    };
    moodTypes: {
      happy: string;
      content: string;
      neutral: string;
      sad: string;
      anxious: string;
      stressed: string;
      tired: string;
      energetic: string;
      motivated: string;
      frustrated: string;
      angry: string;
      calm: string;
      unknown: string;
    };
  };
  reflectionSection: {
    title: string;
    description: string;
    startReflectionButton: string;
    viewHistoryButton: string;
  };
  dailyTipSection: {
    title: string;
    content: string;
  };
  reflectionTriggers: {
    title: string;
    description: string;
    triggerTypes: {
      moodChange: string;
      taskFailure: string;
      dailyReflection: string;
      weeklyReview: string;
      manual: string;
      unknown: string;
    };
    messages: {
      moodChange: string;
      taskFailureWithTitle: string;
      taskFailureGeneric: string;
      dailyReflection: string;
      weeklyReview: string;
      manual: string;
      unknown: string;
    };
    buttons: {
      dismiss: string;
      later: string;
      start: string;
    };
  };
  enhancedReflectionModule: {
    title: string;
    triggerMessages: {
      moodChange: string;
      taskFailureWithTitle: string;
      taskFailureGeneric: string;
      dailyReflection: string;
      weeklyReview: string;
      defaultWelcome: string;
      taskSpecific: string;
    };
    step1: {
      toggleMoodTrackerShow: string;
      toggleMoodTrackerHide: string;
      reflectionInputLabel: string;
      reflectionInputPlaceholder: string;
      continueButton: string;
    };
    step2: {
      thankYouMessage: string;
      tagsLabel: string;
      selectTagPlaceholder: string;
      customTagPlaceholder: string;
      addTagButton: string;
      suggestedActionsLabel: string;
      customActionLabel: string;
      customActionPlaceholder: string;
      backButton: string;
      completeButton: string;
    };
    tags: {
      achievement: string;
      challenge: string;
      growth: string;
      learning: string;
      mindfulness: string;
      motivation: string;
      productivity: string;
      selfCare: string;
      social: string;
      stress: string;
      timeManagement: string;
      wellness: string;
    };
  };
}
