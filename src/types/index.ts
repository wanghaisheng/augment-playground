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
export interface HomePageViewLabelsBundle {
  pageTitle: string;
  welcomeSection: HomeWelcomeSectionLabels;
  moodsSection: HomeMoodsSectionLabels;
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