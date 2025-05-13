// src/db.ts
import Dexie, { Table } from 'dexie';
import type { UILabelRecord } from '@/types';

export class AppDB extends Dexie {
  uiLabels!: Table<UILabelRecord, number>;
  constructor() {
    super('FinalMinimalI18nDB_V3'); // Unique DB name for this version
    this.version(1).stores({
      uiLabels: '++id, scopeKey, labelKey, languageCode, &[scopeKey+labelKey+languageCode]',
    });
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
  ];
  await db.uiLabels.bulkAdd(labels);
  console.log("Final V3 DB populated.");
} 