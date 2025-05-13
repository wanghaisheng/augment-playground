// src/db.ts
import Dexie, { Table } from 'dexie';
import type { UILabelRecord } from '@/types';
import type { PandaStateRecord } from '@/services/pandaStateService';
import type {
  TaskRecord,
  TaskCategoryRecord,
  TaskCompletionRecord
} from '@/services/taskService';
import type { RewardRecord, ItemRecord, BadgeRecord, AbilityRecord as RewardAbilityRecord } from '@/services/rewardService';
import type { PandaAbilityRecord } from '@/services/pandaAbilityService';
import type { SyncItem } from '@/services/dataSyncService';
import type { ChallengeRecord, ChallengeCompletionRecord } from '@/services/challengeService';
import type { TimelyRewardRecord, LuckyPointRecord, LuckyDrawRecord } from '@/services/timelyRewardService';

export class AppDB extends Dexie {
  uiLabels!: Table<UILabelRecord, number>;
  pandaState!: Table<PandaStateRecord, number>;
  tasks!: Table<TaskRecord, number>;
  taskCategories!: Table<TaskCategoryRecord, number>;
  taskCompletions!: Table<TaskCompletionRecord, number>;
  rewards!: Table<RewardRecord, number>;
  items!: Table<ItemRecord, number>;
  badges!: Table<BadgeRecord, number>;
  abilities!: Table<PandaAbilityRecord, number>;
  rewardAbilities!: Table<RewardAbilityRecord, number>;
  syncQueue!: Table<SyncItem, string>;
  challenges!: Table<ChallengeRecord, number>;
  challengeCategories!: Table<any, number>;
  challengeCompletions!: Table<ChallengeCompletionRecord, number>;
  timelyRewards!: Table<TimelyRewardRecord, number>;
  luckyPoints!: Table<LuckyPointRecord, number>;
  luckyDraws!: Table<LuckyDrawRecord, number>;

  constructor() {
    super('PandaHabitDB_V6'); // 更新数据库版本
    this.version(6).stores({
      uiLabels: '++id, scopeKey, labelKey, languageCode, &[scopeKey+labelKey+languageCode]',
      pandaState: '++id, mood, energy, lastUpdated, level',
      tasks: '++id, title, categoryId, priority, status, dueDate, createdAt',
      taskCategories: '++id, name, color, icon, isDefault',
      taskCompletions: '++id, taskId, completedAt, experienceGained',
      rewards: '++id, type, rarity, taskId, obtainedAt, isViewed',
      items: '++id, type, rarity, quantity, obtainedAt',
      badges: '++id, rarity, obtainedAt, isEquipped',
      abilities: '++id, name, type, effectType, requiredLevel, isUnlocked, isActive',
      rewardAbilities: '++id, rarity, obtainedAt, isUnlocked, isActive',
      syncQueue: 'id, table, action, timestamp, status',
      challenges: '++id, title, type, difficulty, status, progress, startDate, endDate, createdAt',
      challengeCategories: '++id, name, description, iconPath',
      challengeCompletions: '++id, challengeId, userId, completedDate, createdAt',
      timelyRewards: '++id, title, type, status, startTime, endTime, createdAt',
      luckyPoints: '++id, userId, amount, isSpent, expiryDate, createdAt',
      luckyDraws: '++id, userId, pointsSpent, timestamp, createdAt'
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
    { scopeKey: 'globalLayout', labelKey: 'navTasks', languageCode: 'en', translatedText: 'Tasks' },
    { scopeKey: 'globalLayout', labelKey: 'navTasks', languageCode: 'zh', translatedText: '任务' },
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

    // 熊猫区域标签
    { scopeKey: 'homeView.pandaSection', labelKey: 'sectionTitle', languageCode: 'en', translatedText: 'Panda Companion' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'sectionTitle', languageCode: 'zh', translatedText: '熊猫伙伴' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'levelLabel', languageCode: 'en', translatedText: 'Level' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'levelLabel', languageCode: 'zh', translatedText: '等级' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'experienceLabel', languageCode: 'en', translatedText: 'Experience' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'experienceLabel', languageCode: 'zh', translatedText: '经验' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'interactButtonText', languageCode: 'en', translatedText: 'Interact' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'interactButtonText', languageCode: 'zh', translatedText: '互动' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'feedButtonText', languageCode: 'en', translatedText: 'Feed' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'feedButtonText', languageCode: 'zh', translatedText: '喂食' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'playButtonText', languageCode: 'en', translatedText: 'Play' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'playButtonText', languageCode: 'zh', translatedText: '玩耍' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'trainButtonText', languageCode: 'en', translatedText: 'Train' },
    { scopeKey: 'homeView.pandaSection', labelKey: 'trainButtonText', languageCode: 'zh', translatedText: '训练' },

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

    // tasksView scope
    { scopeKey: 'tasksView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Task Management' },
    { scopeKey: 'tasksView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '任务管理' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'sectionTitle', languageCode: 'en', translatedText: 'My Tasks' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'sectionTitle', languageCode: 'zh', translatedText: '我的任务' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'createTaskButton', languageCode: 'en', translatedText: 'Create New Task' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'createTaskButton', languageCode: 'zh', translatedText: '创建新任务' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterAllLabel', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterAllLabel', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterTodoLabel', languageCode: 'en', translatedText: 'To Do' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterTodoLabel', languageCode: 'zh', translatedText: '待办' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterInProgressLabel', languageCode: 'en', translatedText: 'In Progress' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterInProgressLabel', languageCode: 'zh', translatedText: '进行中' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterCompletedLabel', languageCode: 'en', translatedText: 'Completed' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'filterCompletedLabel', languageCode: 'zh', translatedText: '已完成' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'noTasksMessage', languageCode: 'en', translatedText: 'No tasks found' },
    { scopeKey: 'tasksView.taskManager', labelKey: 'noTasksMessage', languageCode: 'zh', translatedText: '暂无任务' },

    // challengesView scope
    { scopeKey: 'challengesView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Challenges' },
    { scopeKey: 'challengesView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '挑战' },
    { scopeKey: 'challengesView', labelKey: 'filterStatusLabel', languageCode: 'en', translatedText: 'Status' },
    { scopeKey: 'challengesView', labelKey: 'filterStatusLabel', languageCode: 'zh', translatedText: '状态' },
    { scopeKey: 'challengesView', labelKey: 'filterTypeLabel', languageCode: 'en', translatedText: 'Type' },
    { scopeKey: 'challengesView', labelKey: 'filterTypeLabel', languageCode: 'zh', translatedText: '类型' },
    { scopeKey: 'challengesView', labelKey: 'filterDifficultyLabel', languageCode: 'en', translatedText: 'Difficulty' },
    { scopeKey: 'challengesView', labelKey: 'filterDifficultyLabel', languageCode: 'zh', translatedText: '难度' },
    { scopeKey: 'challengesView', labelKey: 'filterAllLabel', languageCode: 'en', translatedText: 'All' },
    { scopeKey: 'challengesView', labelKey: 'filterAllLabel', languageCode: 'zh', translatedText: '全部' },
    { scopeKey: 'challengesView', labelKey: 'filterActiveLabel', languageCode: 'en', translatedText: 'Active' },
    { scopeKey: 'challengesView', labelKey: 'filterActiveLabel', languageCode: 'zh', translatedText: '进行中' },
    { scopeKey: 'challengesView', labelKey: 'filterCompletedLabel', languageCode: 'en', translatedText: 'Completed' },
    { scopeKey: 'challengesView', labelKey: 'filterCompletedLabel', languageCode: 'zh', translatedText: '已完成' },
    { scopeKey: 'challengesView', labelKey: 'filterUpcomingLabel', languageCode: 'en', translatedText: 'Upcoming' },
    { scopeKey: 'challengesView', labelKey: 'filterUpcomingLabel', languageCode: 'zh', translatedText: '即将开始' },
    { scopeKey: 'challengesView', labelKey: 'clearFiltersButton', languageCode: 'en', translatedText: 'Clear All Filters' },
    { scopeKey: 'challengesView', labelKey: 'clearFiltersButton', languageCode: 'zh', translatedText: '清除所有过滤器' },
    { scopeKey: 'challengesView', labelKey: 'noChallengesMessage', languageCode: 'en', translatedText: 'No challenges found' },
    { scopeKey: 'challengesView', labelKey: 'noChallengesMessage', languageCode: 'zh', translatedText: '暂无挑战' },
  ];
  await db.uiLabels.bulkAdd(labels);
  console.log("Final V3 DB populated.");
}