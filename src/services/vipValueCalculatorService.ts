// src/services/vipValueCalculatorService.ts
// import { db } from '@/db'; // Removed
import { getUserVipSubscription } from './storeService';
// import { getUserMeditationStats } from './meditationService'; // Removed
import { getUserMeditationSessions } from './meditationService';
import { getVipMeditationCourses } from './meditationService';
// import { getUserMoodStats } from './reflectionService'; // Removed
// import { getUserReflectionStats } from './reflectionService'; // Removed
// import { getUserTaskStats } from './taskService'; // Removed
// import { getUserChallengeStats } from './challengeService'; // Removed
// import { getUserRewardStats } from './rewardService'; // Removed
import { getAllSkins } from './pandaSkinService'; // Changed from getUserPandaSkins
import { getUserCustomGoals } from './customGoalService';
import { getUserStatistics } from './statisticsService'; // Added

/**
 * VIP价值统计数据
 */
export interface VipValueStats {
  // 资源加成
  resourceBoost: {
    bambooBonus: number;
    coinsBonus: number;
    totalBambooSaved: number;
    totalCoinsSaved: number;
  };
  
  // 成长速度加成
  growthBoost: {
    experienceBonus: number;
    totalExperienceSaved: number;
    levelProgressBonus: number;
  };
  
  // 抽奖次数加成
  luckyDrawBoost: {
    drawsBonus: number;
    totalExtraDraws: number;
  };
  
  // 自定义目标加成
  customGoalsBoost: {
    goalsBonus: number;
    currentGoalsCount: number;
    maxGoalsCount: number;
  };
  
  // 专属内容
  exclusiveContent: {
    vipSkins: {
      totalCount: number;
      unlockedCount: number;
    };
    vipTasks: {
      totalCount: number;
      completedCount: number;
    };
    vipMeditations: {
      totalCount: number;
      completedCount: number;
      totalMinutes: number;
    };
  };
  
  // 总价值
  totalValue: {
    estimatedMonthlySavings: number;
    estimatedYearlySavings: number;
    returnOnInvestment: number;
  };
  
  // 订阅信息
  subscription: {
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
    daysLeft: number;
    totalDays: number;
  };
}

/**
 * 计算VIP价值统计数据
 * @param userId 用户ID
 * @returns VIP价值统计数据
 */
export async function calculateVipValueStats(userId: string): Promise<VipValueStats> {
  try {
    // 获取用户VIP订阅信息
    const subscription = await getUserVipSubscription(userId);
    const userStats = await getUserStatistics(); // Removed userId argument
    
    // 计算订阅信息
    const now = new Date();
    const startDate = subscription?.startDate ? new Date(subscription.startDate) : now;
    const endDate = subscription?.endDate ? new Date(subscription.endDate) : now;
    const totalDays = subscription?.endDate 
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const daysLeft = subscription?.endDate 
      ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) // Removed extra parenthesis
      : 0;
    
    // 获取用户任务统计数据
    const taskStats = userStats.tasks; // Changed
    
    // 获取用户奖励统计数据
    const rewardStats = userStats.resources; // Changed
    
    // 获取用户冥想统计数据
    // const meditationStats = await getUserMeditationStats(userId); // Removed as unused
    const meditationSessions = await getUserMeditationSessions(userId);
    const vipMeditationCourses = await getVipMeditationCourses();
    
    // 获取用户熊猫皮肤
    const pandaSkins = await getAllSkins(); // Changed from getUserPandaSkins(), removed userId argument
    const vipSkins = pandaSkins.filter(skin => skin.isVipExclusive);
    const unlockedVipSkins = vipSkins.filter(skin => skin.isOwned);
    
    // 获取用户自定义目标
    const customGoals = await getUserCustomGoals(userId);
    
    // 计算资源加成
    const bambooBonus = 2.0; // VIP会员竹子奖励倍数
    const coinsBonus = 2.0; // VIP会员金币奖励倍数
    const totalBambooSaved = (rewardStats.bambooEarned || 0) * (bambooBonus - 1); // Changed
    const totalCoinsSaved = (rewardStats.other?.coins?.earned || 0) * (coinsBonus - 1); // Changed
    
    // 计算成长速度加成
    const experienceBonus = 1.5; // VIP会员经验值倍数
    const totalExperienceSaved = ((taskStats as any).totalExperience || 0) * (experienceBonus - 1); // Used type assertion for now
    const levelProgressBonus = 1.5; // VIP会员等级进度倍数
    
    // 计算抽奖次数加成
    const drawsBonus = 3; // VIP会员每日额外抽奖次数
    const totalExtraDraws = Math.ceil(totalDays / 7) * drawsBonus; // 假设用户每周抽奖一次
    
    // 计算自定义目标加成
    const regularGoalsLimit = 1; // 普通用户自定义目标上限
    const vipGoalsLimit = 5; // VIP会员自定义目标上限
    const goalsBonus = vipGoalsLimit - regularGoalsLimit;
    const currentGoalsCount = customGoals.length;
    
    // 计算VIP专属任务完成情况
    const vipTasksTotal = 10; // 假设有10个VIP专属任务
    const vipTasksCompleted = 3; // 假设完成了3个VIP专属任务
    
    // 计算VIP专属冥想完成情况
    const vipMeditationsTotal = vipMeditationCourses.length;
    const vipMeditationsCompleted = meditationSessions
      .filter(session => session.isCompleted)
      .filter(session => {
        const course = vipMeditationCourses.find(c => c.id === session.courseId);
        return course && course.isVipExclusive;
      }).length;
    
    const vipMeditationMinutes = meditationSessions
      .filter(session => session.isCompleted)
      .filter(session => {
        const course = vipMeditationCourses.find(c => c.id === session.courseId);
        return course && course.isVipExclusive;
      })
      .reduce((total, session) => total + session.durationMinutes, 0);
    
    // 计算总价值
    // const monthlySubscriptionCost = 30; // 假设月度订阅费用为30元 // Removed
    const yearlySubscriptionCost = 298; // 假设年度订阅费用为298元
    
    // 估算每月节省的价值
    const estimatedMonthlySavings = 
      (totalBambooSaved / (totalDays || 1)) * 30 +  // Added || 1 to prevent division by zero
      (totalCoinsSaved / (totalDays || 1)) * 30 +    // Added || 1
      (totalExperienceSaved / (totalDays || 1)) * 30 + // Added || 1
      (drawsBonus * 4) + // 假设每月4次抽奖机会
      (goalsBonus * 10) + // 假设每个额外目标价值10元
      (vipMeditationsTotal * 5); // 假设每个VIP冥想课程价值5元
    
    // 估算每年节省的价值
    const estimatedYearlySavings = estimatedMonthlySavings * 12;
    
    // 计算投资回报率
    const returnOnInvestment = yearlySubscriptionCost > 0 ? estimatedYearlySavings / yearlySubscriptionCost : 0; // Added check for division by zero
    
    return {
      resourceBoost: {
        bambooBonus,
        coinsBonus,
        totalBambooSaved,
        totalCoinsSaved
      },
      growthBoost: {
        experienceBonus,
        totalExperienceSaved,
        levelProgressBonus
      },
      luckyDrawBoost: {
        drawsBonus,
        totalExtraDraws
      },
      customGoalsBoost: {
        goalsBonus,
        currentGoalsCount,
        maxGoalsCount: vipGoalsLimit
      },
      exclusiveContent: {
        vipSkins: {
          totalCount: vipSkins.length,
          unlockedCount: unlockedVipSkins.length
        },
        vipTasks: {
          totalCount: vipTasksTotal,
          completedCount: vipTasksCompleted
        },
        vipMeditations: {
          totalCount: vipMeditationsTotal,
          completedCount: vipMeditationsCompleted,
          totalMinutes: vipMeditationMinutes
        }
      },
      totalValue: {
        estimatedMonthlySavings,
        estimatedYearlySavings,
        returnOnInvestment
      },
      subscription: {
        isActive: subscription?.isActive || false,
        startDate: subscription?.startDate,
        endDate: subscription?.endDate,
        daysLeft,
        totalDays
      }
    };
  } catch (error) {
    console.error('Failed to calculate VIP value stats:', error);
    
    // 返回默认值
    return {
      resourceBoost: {
        bambooBonus: 2.0,
        coinsBonus: 2.0,
        totalBambooSaved: 0,
        totalCoinsSaved: 0
      },
      growthBoost: {
        experienceBonus: 1.5,
        totalExperienceSaved: 0,
        levelProgressBonus: 1.5
      },
      luckyDrawBoost: {
        drawsBonus: 3,
        totalExtraDraws: 0
      },
      customGoalsBoost: {
        goalsBonus: 4,
        currentGoalsCount: 0,
        maxGoalsCount: 5
      },
      exclusiveContent: {
        vipSkins: {
          totalCount: 3,
          unlockedCount: 0
        },
        vipTasks: {
          totalCount: 10,
          completedCount: 0
        },
        vipMeditations: {
          totalCount: 5,
          completedCount: 0,
          totalMinutes: 0
        }
      },
      totalValue: {
        estimatedMonthlySavings: 50,
        estimatedYearlySavings: 600,
        returnOnInvestment: 2.0
      },
      subscription: {
        isActive: false,
        daysLeft: 0,
        totalDays: 0
      }
    };
  }
}
