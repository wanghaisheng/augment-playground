import { db } from '@/db-old';
import type {
  Language, LocalizedContent,
  HomePageViewLabelsBundle, HomePageViewDataPayload, MoodItem,
  SettingsPageViewLabelsBundle,
  TasksPageViewLabelsBundle,
  ChallengesPageViewLabelsBundle,
  TimelyRewardsPageViewLabelsBundle,
  AbilitiesPageViewLabelsBundle,
  VipBenefitsPageViewLabelsBundle,
  StorePageViewLabelsBundle,
  TeaRoomPageViewLabelsBundle,
  GlobalLayoutLabelsBundle,
  ComponentsLabelsBundle,
  UILabelRecord, // ApiError, // Unused
  FetchHomePageViewResult, FetchSettingsPageViewResult, FetchGlobalLayoutViewResult,
  FetchTasksPageViewResult, FetchChallengesPageViewResult, FetchTimelyRewardsPageViewResult,
  FetchAbilitiesPageViewResult, FetchVipBenefitsPageViewResult, FetchStorePageViewResult, FetchTeaRoomPageViewResult,
  FetchComponentsLabelsResult,
  MeditationPageViewLabelsBundle,
  FetchMeditationPageViewResult,
  ProfilePageViewLabelsBundle,
  FetchProfilePageViewResult,
  BambooPlantingPageViewLabelsBundle,
  BambooPlantingPageViewDataPayload,
  FetchBambooPlantingPageViewResult,
  BambooCollectionPageViewLabelsBundle,
  BambooCollectionPageViewDataPayload,
  FetchBambooCollectionPageViewResult,
  BambooDashboardPageViewLabelsBundle,
  BambooDashboardPageViewDataPayload,
  FetchBambooDashboardPageViewResult,
  BambooTradingPageViewLabelsBundle,
  BambooTradingPageViewDataPayload,
  FetchBambooTradingPageViewResult,
  CustomGoalsPageViewLabelsBundle,
  CustomGoalsPageViewDataPayload,
  FetchCustomGoalsPageViewResult,
  CustomGoalRecord,
  AvatarFrameShowcaseLabelsBundle,
  FetchAvatarFrameShowcaseViewResult,
  SocialComparisonPageViewLabelsBundle,
  SocialComparisonPageDataPayload,
  FetchSocialComparisonPageViewResult
} from '@/types';
import { AvatarFrameType } from '@/types';
import { GoalStatus, type CustomGoalRecord as DbCustomGoalRecord } from '@/types/goals'; // Import DB types

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

async function getScopedLabels<TLabelsBundle>(
  baseScopeKey: string,
  lang: Language
): Promise<TLabelsBundle | undefined> {
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
    const errorMessage = `CRITICAL: No labels found for essential scope ${baseScopeKey} (lang: ${lang} or fallback 'en'). Unable to build labels bundle.`;
    console.error(errorMessage);
    // throw new Error(errorMessage); // Option 1: Throw an error
    return undefined; // MODIFIED: Return undefined instead of {} as TLabelsBundle
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
    { id: 1, name: labels?.moodsSection?.sectionTitle || (lang === 'zh' ? '心情' : 'Moods'), feeling: lang === 'zh' ? '专注的' : 'Focused' },
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

export async function fetchAbilitiesPageView(lang: Language): Promise<FetchAbilitiesPageViewResult> {
  console.log(`SVC_DEXIE: Fetching ABILITIES PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<AbilitiesPageViewLabelsBundle>('abilitiesView', lang);
  return { labels, data: null };
}

export async function fetchStorePageView(lang: Language): Promise<LocalizedContent<null, StorePageViewLabelsBundle>> {
  console.log(`SVC_DEXIE: Fetching STORE PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<StorePageViewLabelsBundle>('storeView', lang);
  return { labels, data: null };
}

export async function fetchTeaRoomPageView(lang: Language): Promise<FetchTeaRoomPageViewResult> {
  console.log(`SVC_DEXIE: Fetching TEA ROOM PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<TeaRoomPageViewLabelsBundle>('teaRoomView', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the VIP benefits page
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized VIP benefits page content
 */
export async function fetchVipBenefitsPageView(lang: Language): Promise<FetchVipBenefitsPageViewResult> {
  console.log(`SVC_DEXIE: Fetching VIP BENEFITS PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<VipBenefitsPageViewLabelsBundle>('vipBenefitsView', lang);
  return { labels, data: null };
}

/**
 * Fetches localized labels for common UI components
 *
 * @param lang - The language to fetch labels for
 * @returns A promise that resolves to the localized component labels
 */
export async function fetchComponentsLabels(lang: Language): Promise<FetchComponentsLabelsResult> {
  console.log(`SVC_DEXIE: Fetching COMPONENTS LABELS for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<ComponentsLabelsBundle>('components', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the Battle Pass page
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized Battle Pass page content
 */
export async function fetchBattlePassPageView(lang: Language): Promise<any> {
  console.log(`SVC_DEXIE: Fetching BATTLE PASS PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('battlePassView', lang);
  return { labels, data: null };
}

export async function fetchMeditationPageView(lang: Language): Promise<FetchMeditationPageViewResult> {
  console.log(`SVC_DEXIE: Fetching MEDITATION PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2)); // Simulate network delay
  const labels = await getScopedLabels<MeditationPageViewLabelsBundle>('meditationView', lang);
  // Data payload can be null or include some initial data if needed by the page
  // For this example, MeditationPage.tsx fetches its own course/stats data, so payload is null initially.
  return { labels, data: null };
}

export async function fetchProfilePageView(lang: Language): Promise<FetchProfilePageViewResult> {
  console.log(`SVC_DEXIE: Fetching PROFILE PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<ProfilePageViewLabelsBundle>('profileView', lang);
  return { labels, data: null }; // Data is fetched separately in the component for profile page
}

/**
 * Fetches localized content for the VIP value view
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized VIP value content
 */
export async function fetchVipValueView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching VIP VALUE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('vipValue', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the VIP trial value review
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized VIP trial value review content
 */
export async function fetchVipTrialValueReviewView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching VIP TRIAL VALUE REVIEW VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('vipTrialValueReview', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the VIP trial guide
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized VIP trial guide content
 */
export async function fetchVipTrialGuideView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching VIP TRIAL GUIDE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('vipTrialGuide', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the VIP boost prompt
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized VIP boost prompt content
 */
export async function fetchVipBoostPromptView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching VIP BOOST PROMPT VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('vipBoostPrompt', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the custom goal form
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized custom goal form content
 */
export async function fetchCustomGoalFormView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching CUSTOM GOAL FORM VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('customGoalForm', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the panda interaction panel
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized panda interaction panel content
 */
export async function fetchPandaInteractionView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching PANDA INTERACTION VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('pandaInteraction', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the subscription expiration reminder
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized subscription expiration reminder content
 */
export async function fetchSubscriptionExpirationView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching SUBSCRIPTION EXPIRATION VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('subscriptionExpiration', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the resource shortage prompt
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized resource shortage prompt content
 */
export async function fetchResourceShortageView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching RESOURCE SHORTAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('resourceShortage', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the pain point solution prompt
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized pain point solution prompt content
 */
export async function fetchPainPointSolutionView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching PAIN POINT SOLUTION VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('painPointSolution', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the bamboo collection panel
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized bamboo collection panel content
 */
export async function fetchBambooCollectionPanelView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching BAMBOO COLLECTION PANEL VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('bambooCollectionPanel', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the bamboo spot card
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized bamboo spot card content
 */
export async function fetchBambooSpotCardView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching BAMBOO SPOT CARD VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('bambooSpotCard', lang);
  return { labels, data: null };
}

// --- Bamboo Planting Page Service ---
export async function fetchBambooPlantingPageView(lang: Language): Promise<FetchBambooPlantingPageViewResult> {
  console.log(`SVC_DEXIE: Fetching BAMBOO PLANTING PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS));

  const labels = await getScopedLabels<BambooPlantingPageViewLabelsBundle>('bambooPlantingView', lang);

  // Simulate fetching data related to bamboo planting
  const data: BambooPlantingPageViewDataPayload = {
    availableSeeds: [
      { id: 'seed1', name: labels?.seedSelectionTitle || 'Basic Bamboo Seed', icon: '🎋', growthTime: 60 },
      { id: 'seed2', name: 'Fast-Grow Bamboo Seed', icon: '🎍', growthTime: 30 },
      { id: 'seed3', name: 'Golden Bamboo Seed', icon: '🌟', growthTime: 120 },
    ],
    bambooPlots: [
      { id: 'plot1', status: 'available' },
      { id: 'plot2', status: 'growing', growthProgress: 50, plantedSeedId: 'seed1' },
      { id: 'plot3', status: 'locked' },
    ],
    userResources: {
      water: 100,
      fertilizer: 50,
    },
  };

  return { labels, data };
}

// --- Fetch Function for Bamboo Collection Page ---
export async function fetchBambooCollectionPageView(lang: Language): Promise<FetchBambooCollectionPageViewResult> {
  console.log(`SVC_DEXIE: Fetching BAMBOO COLLECTION PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<BambooCollectionPageViewLabelsBundle>('bambooCollectionView', lang);
  const data: BambooCollectionPageViewDataPayload = {
    totalBambooCollected: 0,
  };
  return { labels, data };
}

// --- Fetch Function for Bamboo Dashboard Page ---
export async function fetchBambooDashboardPageView(lang: Language): Promise<FetchBambooDashboardPageViewResult> {
  console.log(`SVC_DEXIE: Fetching BAMBOO DASHBOARD PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS)); // Simulate slightly longer delay for dashboard data

  const labels = await getScopedLabels<BambooDashboardPageViewLabelsBundle>('bambooDashboardView', lang);

  // Simulate fetching some dashboard data
  const data: BambooDashboardPageViewDataPayload = {
    totalBamboo: Math.floor(Math.random() * 10000),
    growthRate: Math.floor(Math.random() * 100),
    currentMarketPrice: parseFloat((Math.random() * 0.5 + 0.1).toFixed(2)), // Random price between 0.10 and 0.60
    userName: "PandaUser123",
    lastActivityDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(), // Random date in last 7 days
  };

  return { labels, data };
}

// --- Fetch Function for Bamboo Trading Page ---
export async function fetchBambooTradingPageView(lang: Language): Promise<FetchBambooTradingPageViewResult> {
  console.log(`SVC_DEXIE: Fetching BAMBOO TRADING PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS));

  const labels = await getScopedLabels<BambooTradingPageViewLabelsBundle>('bambooTradingView', lang);

  const data: BambooTradingPageViewDataPayload = {
    currentMarketPrice: 1.5, // Example value
    userBambooStock: 500,    // Example value
    recentTransactions: [
      { id: 'trade1', type: 'sell', amount: 100, price: 1.4, timestamp: new Date().toISOString() },
      { id: 'trade2', type: 'buy', amount: 50, price: 1.6, timestamp: new Date().toISOString() },
    ],
    // Removed fields not in BambooTradingPageViewDataPayload:
    // availableResourcesForTrading, currentExchangeRates, userInventory, tradingVolumeLimit, currentTradingVolume
  };
  return { labels, data };
}

// --- Fetch Function for Custom Goals Page ---
export async function fetchCustomGoalsPageView(lang: Language): Promise<FetchCustomGoalsPageViewResult> {
  console.log(`SVC_DEXIE: Fetching CUSTOM GOALS PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<CustomGoalsPageViewLabelsBundle>('customGoalsView', lang);

  // Fetch actual goals from the database
  let viewModalGoals: CustomGoalRecord[] = [];
  try {
    const dbGoals: DbCustomGoalRecord[] = await db.customGoals.toArray();

    viewModalGoals = dbGoals.map(dbGoal => {
      // Assertions to ensure dbGoal.id, targetValue, and currentValue are numbers
      const id = dbGoal.id?.toString() || Math.random().toString(36).substring(2); // Ensure ID is a string
      const targetValue = typeof dbGoal.targetValue === 'number' ? dbGoal.targetValue : 0;
      const currentValue = typeof dbGoal.currentValue === 'number' ? dbGoal.currentValue : 0;

      return {
        ...dbGoal,
        id: id, // Convert number id to string for ViewModel
        title: dbGoal.title || (lang === 'zh' ? '未命名目标' : 'Untitled Goal'),
        targetValue: targetValue,
        currentValue: currentValue,
        isAchieved: currentValue >= targetValue && targetValue > 0, // Calculate isAchieved
        createdAt: dbGoal.createdAt ? new Date(dbGoal.createdAt).toISOString() : new Date().toISOString(),
        deadline: dbGoal.targetDate ? new Date(dbGoal.targetDate).toISOString() : undefined, // Map targetDate to deadline
        status: dbGoal.status || GoalStatus.ACTIVE, // Ensure status is present, map from GoalStatus
        // unit, description, type, isPublic, reminderFrequency, lastReminderSentAt will be mapped if they exist on DbCustomGoalRecord
        // and are compatible or transformed as needed for CustomGoalRecord (ViewModel)
        // CustomGoalRecord (ViewModel) definition:
        // id: string; title: string; description?: string; targetValue: number; currentValue: number; unit?: string;
        // createdAt: string; deadline?: string; isAchieved: boolean; (status is not directly on VM record but handled by page logic)
        // The `status` from dbGoal is used, but the ViewModel in index.ts doesn't explicitly list it currently
        // It would be good if CustomGoalRecord in index.ts also had `status: GoalStatus` for clarity.
      } as CustomGoalRecord; // Asserting the shape, be careful with type compatibility
    });
  } catch (e) {
    console.error("Failed to fetch or map custom goals from DB:", e);
  }

  const pageViewData: CustomGoalsPageViewDataPayload = {
    username: "User123",
    goals: viewModalGoals,
    isVipUser: false, // Mock data
    currentGoalCount: viewModalGoals.length,
    goalLimit: 5, // Mock data for non-VIP users
  };

  return { labels, data: pageViewData };
}

// --- Service function for Avatar Frame Showcase Page ---
export async function fetchAvatarFrameShowcaseView(lang: Language): Promise<FetchAvatarFrameShowcaseViewResult> {
  console.log(`SVC_DEXIE: Fetching AVATAR FRAME SHOWCASE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));

  // For this dummy function, we'll return mostly default English labels
  // In a real scenario, these would come from getScopedLabels('avatarFrameShowcaseView', lang)
  const labels: AvatarFrameShowcaseLabelsBundle = {
    pageTitle: lang === 'zh' ? '头像框展示' : 'Avatar Frame Showcase',
    pageDescription: lang === 'zh' ? '探索PandaHabit中可用的不同头像框' : 'Explore different avatar frames available in PandaHabit',
    animationToggleLabel: lang === 'zh' ? '启用动画' : 'Enable Animation',
    vipBadgeToggleLabel: lang === 'zh' ? '显示VIP徽章' : 'Show VIP Badge',
    onlineStatusToggleLabel: lang === 'zh' ? '显示在线状态' : 'Show Online Status',
    frameTypeSectionTitle: lang === 'zh' ? '边框类型' : 'Frame Types',
    frameDescriptionSectionTitle: lang === 'zh' ? '边框描述' : 'Frame Description',
    frameTypeLabels: {
      [AvatarFrameType.NONE]: lang === 'zh' ? '无边框' : 'No Frame',
      [AvatarFrameType.BASIC]: lang === 'zh' ? '基础边框' : 'Basic Frame',
      // ... (add more for other frame types as needed for a complete dummy)
    },
    frameDescriptions: {
      [AvatarFrameType.NONE]: lang === 'zh' ? '无边框，仅显示头像图片。' : 'No frame, just the avatar image.',
      [AvatarFrameType.BASIC]: lang === 'zh' ? '所有用户可用的简单边框。' : 'A simple frame available to all users.',
      // ... (add more for other frame types as needed)
    },
  };

  return { labels, data: null };
}

// --- Service function for Social Comparison Page ---
/**
 * Fetches localized content for the profile customization component
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized profile customization content
 */
export async function fetchProfileCustomizationView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching PROFILE CUSTOMIZATION VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('profileCustomization', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the social share component
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized social share content
 */
export async function fetchSocialShareView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching SOCIAL SHARE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('socialShare', lang);
  return { labels, data: null };
}

/**
 * Fetches localized content for the leaderboard component
 *
 * @param lang - The language to fetch content for
 * @returns A promise that resolves to the localized leaderboard content
 */
export async function fetchLeaderboardView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching LEADERBOARD VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('leaderboard', lang);
  return { labels, data: null };
}

export async function fetchUserTitleSelectorView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching USER TITLE SELECTOR VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('userTitleSelector', lang);
  return { labels, data: null };
}

export async function fetchUserTitleView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching USER TITLE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('userTitle', lang);
  return { labels, data: null };
}

export async function fetchUserStatisticsView(lang: Language): Promise<LocalizedContent<null, any>> {
  console.log(`SVC_DEXIE: Fetching USER STATISTICS VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<any>('userStatistics', lang);
  return { labels, data: null };
}

export async function fetchSocialComparisonPageView(lang: Language): Promise<FetchSocialComparisonPageViewResult> {
  console.log(`SVC_DEXIE: Fetching SOCIAL COMPARISON VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS));

  const labels: SocialComparisonPageViewLabelsBundle = {
    pageTitle: lang === 'zh' ? '社交比较' : 'Social Comparison',
    loadingText: lang === 'zh' ? '加载中...' : 'Loading...',
    errorText: lang === 'zh' ? '加载比较数据时出错' : 'Error loading comparison data',
    noFriendsMessage: lang === 'zh' ? '您还没有朋友，快去邀请吧！' : 'You haven\'t added any friends yet. Go invite some!',
    inviteFriendsButton: lang === 'zh' ? '邀请朋友' : 'Invite Friends',
    comparisonSectionTitle: lang === 'zh' ? '与朋友比较' : 'Comparison with Friends',
    featureComparison: [
      {
        featureName: lang === 'zh' ? '总任务完成数' : 'Total Tasks Completed',
        userScore: lang === 'zh' ? '你的分数' : 'Your Score',
        friendScore: lang === 'zh' ? '好友分数' : 'Friend Score',
      }
    ]
  };

  const data: SocialComparisonPageDataPayload = {
    currentUser: { id: 'user1', name: 'PandaUser' },
    friends: [
      {
        id: 'friend1',
        name: 'BambooBuddy',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=bamboo',
        comparisonData: {
          totalTasks: { userScore: 150, friendScore: 120 }
        }
      },
      {
        id: 'friend2',
        name: 'ZenExplorer',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=zen',
        comparisonData: {
          totalTasks: { userScore: 150, friendScore: 180 }
        }
      }
    ]
  };

  return { labels, data };
}