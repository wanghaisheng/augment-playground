// src/types/user.ts

/**
 * 用户个人资料接口
 */
export interface UserProfile {
  // 用户ID
  id: string;
  // 用户名
  username: string;
  // 显示名称
  displayName: string;
  // 头像URL
  avatarUrl: string;
  // 个人简介
  bio: string;
  // 加入日期
  joinDate: number;
  // 等级
  level: number;
  // 经验值
  experience: number;
  // 下一级所需经验
  nextLevelExperience: number;
  // 主题颜色
  themeColor: string;
  // 背景图片URL
  backgroundImageUrl: string;
  // 社交媒体链接
  socialLinks: {
    weibo?: string;
    wechat?: string;
    qq?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  // 隐私设置
  privacySettings: {
    showAchievements: boolean;
    showStatistics: boolean;
    showLevel: boolean;
    showSocialLinks: boolean;
  };
  // 偏好设置
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
  };
  // 自定义字段
  customFields: Record<string, unknown>;
}

/**
 * 用户成就接口
 */
export interface UserAchievement {
  // 成就ID
  id: string;
  // 成就名称
  name: string;
  // 成就描述
  description: string;
  // 成就图标URL
  iconUrl: string;
  // 成就类型
  type: 'task' | 'challenge' | 'panda' | 'social' | 'special';
  // 成就稀有度
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  // 解锁日期
  unlockedAt: number;
  // 解锁进度（百分比）
  progress: number;
  // 是否已解锁
  unlocked: boolean;
  // 成就点数
  points: number;
  // 成就奖励
  rewards: {
    experience: number;
    bamboo: number;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
    }>;
  };
  // 成就条件
  conditions: string[];
  // 相关成就ID
  relatedAchievements: string[];
  // 是否为隐藏成就
  hidden: boolean;
  // 是否为限时成就
  limited: boolean;
  // 限时结束日期
  limitedEndDate?: number;
}

/**
 * 用户统计数据接口
 */
export interface UserStatistics {
  // 任务统计
  tasks: {
    // 已完成任务总数
    completed: number;
    // 已创建任务总数
    created: number;
    // 已失败任务总数
    failed: number;
    // 连续完成天数
    streak: number;
    // 最长连续完成天数
    longestStreak: number;
    // 按类型统计
    byType: Record<string, number>;
    // 按优先级统计
    byPriority: Record<string, number>;
    // 按完成时间统计
    byCompletionTime: {
      morning: number;
      afternoon: number;
      evening: number;
      night: number;
    };
    // 每周完成情况
    weeklyCompletion: number[];
    // 每月完成情况
    monthlyCompletion: number[];
  };
  
  // 挑战统计
  challenges: {
    // 已完成挑战总数
    completed: number;
    // 已参与挑战总数
    participated: number;
    // 已失败挑战总数
    failed: number;
    // 按难度统计
    byDifficulty: Record<string, number>;
    // 按类型统计
    byType: Record<string, number>;
  };
  
  // 熊猫统计
  panda: {
    // 当前等级
    level: number;
    // 互动次数
    interactions: number;
    // 喂食次数
    feedings: number;
    // 训练次数
    trainings: number;
    // 玩耍次数
    plays: number;
    // 进化次数
    evolutions: number;
    // 心情历史
    moodHistory: number[];
    // 能量历史
    energyHistory: number[];
  };
  
  // 资源统计
  resources: {
    // 竹子总数
    bamboo: number;
    // 获得的竹子总数
    bambooEarned: number;
    // 消费的竹子总数
    bambooSpent: number;
    // 茶叶总数
    tea: number;
    // 获得的茶叶总数
    teaEarned: number;
    // 消费的茶叶总数
    teaSpent: number;
    // 其他资源
    other: Record<string, {
      current: number;
      earned: number;
      spent: number;
    }>;
  };
  
  // 时间统计
  time: {
    // 应用使用总时间（分钟）
    totalUsage: number;
    // 每日平均使用时间（分钟）
    dailyAverage: number;
    // 每周使用时间（分钟）
    weeklyUsage: number[];
    // 最活跃的时间段
    mostActiveHour: number;
    // 最活跃的星期几
    mostActiveDay: number;
  };
  
  // 社交统计
  social: {
    // 好友数量
    friends: number;
    // 分享次数
    shares: number;
    // 收到的点赞数
    likesReceived: number;
    // 发出的点赞数
    likesGiven: number;
    // 评论数
    comments: number;
  };
  
  // 成就统计
  achievements: {
    // 已解锁成就总数
    unlocked: number;
    // 成就总数
    total: number;
    // 成就点数
    points: number;
    // 按稀有度统计
    byRarity: Record<string, number>;
    // 按类型统计
    byType: Record<string, number>;
  };
  
  // VIP统计
  vip: {
    // 是否为VIP
    isVip: boolean;
    // VIP等级
    level: number;
    // VIP天数
    days: number;
    // VIP到期日期
    expiryDate?: number;
    // VIP福利使用情况
    benefitsUsed: Record<string, number>;
  };
  
  // 自定义统计
  custom: Record<string, unknown>;
}

/**
 * 用户称号接口
 */
export interface UserTitle {
  // 称号ID
  id: string;
  // 称号名称
  name: string;
  // 称号描述
  description: string;
  // 称号图标URL
  iconUrl: string;
  // 称号稀有度
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  // 解锁日期
  unlockedAt: number;
  // 是否已解锁
  unlocked: boolean;
  // 解锁条件
  unlockCondition: string;
  // 是否为限时称号
  limited: boolean;
  // 限时结束日期
  limitedEndDate?: number;
}
