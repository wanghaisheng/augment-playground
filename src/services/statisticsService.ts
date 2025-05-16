// src/services/statisticsService.ts
import { db } from '@/db-old';
import { UserStatistics } from '@/types/user';
import { getLocalStorage, setLocalStorage } from '@/utils/storage';

// 本地存储键
const USER_STATISTICS_STORAGE_KEY = 'panda_habit_user_statistics';

// 默认用户统计数据
const DEFAULT_USER_STATISTICS: UserStatistics = {
  tasks: {
    completed: 15,
    created: 25,
    failed: 3,
    streak: 5,
    longestStreak: 7,
    byType: {
      daily: 10,
      weekly: 3,
      monthly: 2
    },
    byPriority: {
      high: 5,
      medium: 8,
      low: 2
    },
    byCompletionTime: {
      morning: 4,
      afternoon: 6,
      evening: 4,
      night: 1
    },
    weeklyCompletion: [2, 3, 1, 2, 4, 2, 1],
    monthlyCompletion: [10, 15, 12, 8, 20, 18]
  },
  challenges: {
    completed: 3,
    participated: 5,
    failed: 1,
    byDifficulty: {
      easy: 2,
      medium: 2,
      hard: 1
    },
    byType: {
      daily: 3,
      weekly: 2,
      special: 0
    }
  },
  panda: {
    level: 3,
    interactions: 42,
    feedings: 15,
    trainings: 10,
    plays: 17,
    evolutions: 1,
    moodHistory: [70, 75, 80, 85, 90, 85, 80],
    energyHistory: [60, 70, 80, 75, 65, 70, 75]
  },
  resources: {
    bamboo: 250,
    bambooEarned: 350,
    bambooSpent: 100,
    tea: 15,
    teaEarned: 20,
    teaSpent: 5,
    other: {
      coins: {
        current: 50,
        earned: 75,
        spent: 25
      },
      gems: {
        current: 10,
        earned: 10,
        spent: 0
      }
    }
  },
  time: {
    totalUsage: 720, // 12小时
    dailyAverage: 45, // 45分钟
    weeklyUsage: [30, 45, 60, 40, 50, 35, 55],
    mostActiveHour: 20, // 晚上8点
    mostActiveDay: 3 // 周四
  },
  social: {
    friends: 2,
    shares: 5,
    likesReceived: 10,
    likesGiven: 15,
    comments: 8
  },
  achievements: {
    unlocked: 5,
    total: 20,
    points: 85,
    byRarity: {
      common: 3,
      uncommon: 1,
      rare: 1,
      epic: 0,
      legendary: 0
    },
    byType: {
      task: 2,
      challenge: 1,
      panda: 1,
      social: 0,
      special: 1
    }
  },
  vip: {
    isVip: false,
    level: 0,
    days: 0,
    benefitsUsed: {}
  },
  custom: {}
};

/**
 * 获取用户统计数据
 * @returns 用户统计数据
 */
export const getUserStatistics = async (): Promise<UserStatistics> => {
  try {
    // 尝试从数据库获取
    const statistics = await db.table('userStatistics').toArray();
    
    if (statistics && statistics.length > 0) {
      return statistics[0] as UserStatistics;
    }
    
    // 如果数据库中没有，尝试从本地存储获取
    const storedStatistics = getLocalStorage<UserStatistics>(USER_STATISTICS_STORAGE_KEY);
    
    if (storedStatistics) {
      // 保存到数据库
      await db.table('userStatistics').put(storedStatistics);
      return storedStatistics;
    }
    
    // 如果本地存储中也没有，使用默认数据
    const defaultStatistics = { ...DEFAULT_USER_STATISTICS };
    
    // 保存到数据库和本地存储
    await db.table('userStatistics').put(defaultStatistics);
    setLocalStorage(USER_STATISTICS_STORAGE_KEY, defaultStatistics);
    
    return defaultStatistics;
  } catch (error) {
    console.error('Failed to get user statistics:', error);
    
    // 如果出错，返回默认数据
    return { ...DEFAULT_USER_STATISTICS };
  }
};

/**
 * 更新用户统计数据
 * @param statistics 更新后的统计数据
 * @returns 更新后的统计数据
 */
export const updateUserStatistics = async (statistics: UserStatistics): Promise<UserStatistics> => {
  try {
    // 更新数据库
    await db.table('userStatistics').put(statistics);
    
    // 更新本地存储
    setLocalStorage(USER_STATISTICS_STORAGE_KEY, statistics);
    
    return statistics;
  } catch (error) {
    console.error('Failed to update user statistics:', error);
    throw error;
  }
};

/**
 * 更新任务完成统计
 * @param taskType 任务类型
 * @param priority 任务优先级
 * @returns 更新后的统计数据
 */
export const updateTaskCompletionStatistics = async (
  taskType: string,
  priority: string
): Promise<UserStatistics> => {
  try {
    // 获取当前统计数据
    const statistics = await getUserStatistics();
    
    // 获取当前时间
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay(); // 0-6，0表示周日
    
    // 确定完成时间段
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    if (hour >= 5 && hour < 12) {
      timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = 'afternoon';
    } else if (hour >= 18 && hour < 22) {
      timeOfDay = 'evening';
    } else {
      timeOfDay = 'night';
    }
    
    // 更新统计数据
    const updatedStatistics: UserStatistics = {
      ...statistics,
      tasks: {
        ...statistics.tasks,
        completed: statistics.tasks.completed + 1,
        byType: {
          ...statistics.tasks.byType,
          [taskType]: (statistics.tasks.byType[taskType] || 0) + 1
        },
        byPriority: {
          ...statistics.tasks.byPriority,
          [priority]: (statistics.tasks.byPriority[priority] || 0) + 1
        },
        byCompletionTime: {
          ...statistics.tasks.byCompletionTime,
          [timeOfDay]: statistics.tasks.byCompletionTime[timeOfDay] + 1
        },
        weeklyCompletion: statistics.tasks.weeklyCompletion.map((count, index) => 
          index === dayOfWeek ? count + 1 : count
        )
      }
    };
    
    // 保存更新后的统计数据
    await updateUserStatistics(updatedStatistics);
    
    return updatedStatistics;
  } catch (error) {
    console.error('Failed to update task completion statistics:', error);
    throw error;
  }
};

/**
 * 更新任务创建统计
 * @param taskType 任务类型
 * @param priority 任务优先级
 * @returns 更新后的统计数据
 */
export const updateTaskCreationStatistics = async (
  _taskType: string,
  _priority: string
): Promise<UserStatistics> => {
  try {
    // 获取当前统计数据
    const statistics = await getUserStatistics();
    
    // 更新统计数据
    const updatedStatistics: UserStatistics = {
      ...statistics,
      tasks: {
        ...statistics.tasks,
        created: statistics.tasks.created + 1
      }
    };
    
    // 保存更新后的统计数据
    await updateUserStatistics(updatedStatistics);
    
    return updatedStatistics;
  } catch (error) {
    console.error('Failed to update task creation statistics:', error);
    throw error;
  }
};

/**
 * 更新熊猫互动统计
 * @param interactionType 互动类型
 * @param moodValue 心情值
 * @param energyValue 能量值
 * @returns 更新后的统计数据
 */
export const updatePandaInteractionStatistics = async (
  interactionType: 'feeding' | 'training' | 'playing',
  moodValue: number,
  energyValue: number
): Promise<UserStatistics> => {
  try {
    // 获取当前统计数据
    const statistics = await getUserStatistics();
    
    // 更新互动类型计数
    const updatedPandaStats = {
      ...statistics.panda,
      interactions: statistics.panda.interactions + 1
    };
    
    // 根据互动类型更新特定计数
    if (interactionType === 'feeding') {
      updatedPandaStats.feedings += 1;
    } else if (interactionType === 'training') {
      updatedPandaStats.trainings += 1;
    } else if (interactionType === 'playing') {
      updatedPandaStats.plays += 1;
    }
    
    // 更新心情和能量历史
    updatedPandaStats.moodHistory = [...statistics.panda.moodHistory.slice(-6), moodValue];
    updatedPandaStats.energyHistory = [...statistics.panda.energyHistory.slice(-6), energyValue];
    
    // 更新统计数据
    const updatedStatistics: UserStatistics = {
      ...statistics,
      panda: updatedPandaStats
    };
    
    // 保存更新后的统计数据
    await updateUserStatistics(updatedStatistics);
    
    return updatedStatistics;
  } catch (error) {
    console.error('Failed to update panda interaction statistics:', error);
    throw error;
  }
};

/**
 * 更新成就统计
 * @param rarity 成就稀有度
 * @param type 成就类型
 * @param points 成就点数
 * @returns 更新后的统计数据
 */
export const updateAchievementStatistics = async (
  rarity: string,
  type: string,
  points: number
): Promise<UserStatistics> => {
  try {
    // 获取当前统计数据
    const statistics = await getUserStatistics();
    
    // 更新统计数据
    const updatedStatistics: UserStatistics = {
      ...statistics,
      achievements: {
        ...statistics.achievements,
        unlocked: statistics.achievements.unlocked + 1,
        points: statistics.achievements.points + points,
        byRarity: {
          ...statistics.achievements.byRarity,
          [rarity]: (statistics.achievements.byRarity[rarity] || 0) + 1
        },
        byType: {
          ...statistics.achievements.byType,
          [type]: (statistics.achievements.byType[type] || 0) + 1
        }
      }
    };
    
    // 保存更新后的统计数据
    await updateUserStatistics(updatedStatistics);
    
    return updatedStatistics;
  } catch (error) {
    console.error('Failed to update achievement statistics:', error);
    throw error;
  }
};
