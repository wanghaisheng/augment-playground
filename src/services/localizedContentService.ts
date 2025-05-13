import { db } from '@/db';
import type {
  Language, LocalizedContent,
  HomePageViewLabelsBundle, HomePageViewDataPayload, MoodItem,
  SettingsPageViewLabelsBundle,
  TasksPageViewLabelsBundle,
  ChallengesPageViewLabelsBundle,
  TimelyRewardsPageViewLabelsBundle,
  GlobalLayoutLabelsBundle,
  UILabelRecord, ApiError,
  FetchHomePageViewResult, FetchSettingsPageViewResult, FetchGlobalLayoutViewResult,
  FetchTasksPageViewResult, FetchChallengesPageViewResult, FetchTimelyRewardsPageViewResult
} from '@/types';

const SIMULATED_DELAY_MS = 150;

function buildLabelsObject<TLabelsBundle>(records: UILabelRecord[], baseScope: string): TLabelsBundle {
  const labels = {} as any;
  records.forEach(record => {
    let keyPath = record.labelKey;
    if (record.scopeKey.startsWith(baseScope + '.') && record.scopeKey.length > baseScope.length) {
        const sectionPath = record.scopeKey.substring(baseScope.length + 1);
        keyPath = `${sectionPath}.${record.labelKey}`;
    } else if (record.scopeKey !== baseScope) {
        // This label is not directly under baseScope or a direct sub-scope path, might be an issue or intended for a different structure.
        // For this demo, we'll assume labels fetched by getScopedLabels are correctly targeted.
        // console.warn(`Label with key ${record.labelKey} has scope ${record.scopeKey} which is not directly under or part of ${baseScope}`);
    }

    const keys = keyPath.split('.');
    let current = labels;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = record.translatedText;
      } else {
        current[key] = current[key] || {};
        current = current[key];
      }
    });
  });
  return labels as TLabelsBundle;
}

async function getScopedLabels<TLabelsBundle>(baseScopeKey: string, lang: Language): Promise<TLabelsBundle> {
  let labelRecords = await db.uiLabels
    .where('languageCode').equals(lang)
    .and((record: UILabelRecord) => record.scopeKey.startsWith(baseScopeKey))
    .toArray();

  if (!labelRecords.length && lang !== 'en') {
    console.warn(`No '${lang}' labels for scope ${baseScopeKey}, falling back to 'en'`);
    labelRecords = await db.uiLabels
      .where('languageCode').equals('en')
      .and((record: UILabelRecord) => record.scopeKey.startsWith(baseScopeKey))
      .toArray();
  }

  if (!labelRecords.length) {
    const errorMessage = `CRITICAL: No labels found for essential scope ${baseScopeKey} (lang: ${lang} or fallback 'en').`;
    console.error(errorMessage);
    // In a real app, you might throw an error or have a more robust fallback
    return {} as TLabelsBundle;
  }
  return buildLabelsObject<TLabelsBundle>(labelRecords, baseScopeKey);
}

export async function fetchGlobalLayoutView(lang: Language): Promise<FetchGlobalLayoutViewResult> {
  console.log(`SVC_DEXIE: Fetching GLOBAL LAYOUT VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<GlobalLayoutLabelsBundle>('globalLayout', lang);
  return { labels, data: null };
}

export async function fetchHomePageView(lang: Language): Promise<FetchHomePageViewResult> {
  console.log(`SVC_DEXIE: Fetching HOME PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS));
  const labels = await getScopedLabels<HomePageViewLabelsBundle>('homeView', lang);

  const moods: MoodItem[] = [
    { id: 1, name: labels.moodsSection?.sectionTitle || (lang === 'zh' ? '心情' : 'Moods'), feeling: lang === 'zh' ? '专注的' : 'Focused' },
    { id: 2, name: lang === 'zh' ? '锻炼会议' : 'Workout Session', feeling: lang === 'zh' ? '精力充沛的' : 'Energized' },
  ];
  const data: HomePageViewDataPayload = { username: "DevUser", moods };
  return { labels, data };
}

export async function fetchSettingsPageView(lang: Language): Promise<FetchSettingsPageViewResult> {
  console.log(`SVC_DEXIE: Fetching SETTINGS PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<SettingsPageViewLabelsBundle>('settingsView', lang);
  return { labels, data: null };
}

export async function fetchTasksPageView(lang: Language): Promise<FetchTasksPageViewResult> {
  console.log(`SVC_DEXIE: Fetching TASKS PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<TasksPageViewLabelsBundle>('tasksView', lang);
  return { labels, data: null };
}

export async function fetchChallengesPageView(lang: Language): Promise<FetchChallengesPageViewResult> {
  console.log(`SVC_DEXIE: Fetching CHALLENGES PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<ChallengesPageViewLabelsBundle>('challengesView', lang);
  return { labels, data: null };
}

export async function fetchTimelyRewardsPageView(lang: Language): Promise<FetchTimelyRewardsPageViewResult> {
  console.log(`SVC_DEXIE: Fetching TIMELY REWARDS PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<TimelyRewardsPageViewLabelsBundle>('timelyRewardsView', lang);
  return { labels, data: null };
}