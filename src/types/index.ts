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

// --- Global / Layout Content Types ---
export interface GlobalLayoutLabelsBundle {
  appTitle: string;
  navHome: string;
  navTasks: string;
  navAbilities: string;
  navRewards: string;
  navChallenges: string;
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
export interface TaskManagerLabels {
  sectionTitle: string;
  createTaskButton: string;
  filterAllLabel: string;
  filterTodoLabel: string;
  filterInProgressLabel: string;
  filterCompletedLabel: string;
  noTasksMessage: string;
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

export interface ChallengesPageViewLabelsBundle {
  pageTitle: string;
  filters: ChallengeFilterLabels;
  noChallengesMessage: string;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
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

export interface TimelyRewardsPageViewLabelsBundle {
  pageTitle: string;
  filters: TimelyRewardFilterLabels;
  luckyDraw: LuckyDrawLabels;
  noRewardsMessage: string;
}
export type FetchTimelyRewardsPageViewResult = LocalizedContent<null, TimelyRewardsPageViewLabelsBundle>;

// --- Abilities Page/View Specific Types ---
export interface AbilityFilterLabels {
  allLabel: string;
  activeLabel: string;
  lockedLabel: string;
  typeAllLabel: string;
  typeAttackLabel: string;
  typeDefenseLabel: string;
  typeUtilityLabel: string;
  typeSpecialLabel: string;
  clearFiltersLabel: string;
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
}
export type FetchAbilitiesPageViewResult = LocalizedContent<null, AbilitiesPageViewLabelsBundle>;