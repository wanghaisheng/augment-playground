// src/services/achievementService.ts
import { db } from '@/db-old';
import { UserAchievement } from '@/types/user';
import { getLocalStorage, setLocalStorage } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { updateUserExperience } from './userProfileService';
import { playSound, SoundType } from '@/utils/sound';
import { NotificationType, NotificationPriority } from '@/types/notification';

// 本地存储键
const USER_ACHIEVEMENTS_STORAGE_KEY = 'panda_habit_user_achievements';

// 示例成就数据
const SAMPLE_ACHIEVEMENTS: UserAchievement[] = [
  {
    id: 'achievement-1',
    name: '初次任务',
    description: '完成你的第一个任务',
    iconUrl: '/assets/images/achievements/first-task.png',
    type: 'task',
    rarity: 'common',
    unlockedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7天前
    progress: 100,
    unlocked: true,
    points: 10,
    rewards: {
      experience: 50,
      bamboo: 10,
      items: []
    },
    conditions: ['完成1个任务'],
    relatedAchievements: ['achievement-2'],
    hidden: false,
    limited: false
  },
  {
    id: 'achievement-2',
    name: '任务达人',
    description: '完成10个任务',
    iconUrl: '/assets/images/achievements/task-master.png',
    type: 'task',
    rarity: 'uncommon',
    unlockedAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3天前
    progress: 100,
    unlocked: true,
    points: 20,
    rewards: {
      experience: 100,
      bamboo: 20,
      items: []
    },
    conditions: ['完成10个任务'],
    relatedAchievements: ['achievement-3'],
    hidden: false,
    limited: false
  },
  {
    id: 'achievement-3',
    name: '任务专家',
    description: '完成50个任务',
    iconUrl: '/assets/images/achievements/task-expert.png',
    type: 'task',
    rarity: 'rare',
    unlockedAt: 0,
    progress: 60,
    unlocked: false,
    points: 50,
    rewards: {
      experience: 250,
      bamboo: 50,
      items: [
        {
          id: 'item-1',
          name: '任务加速器',
          quantity: 1
        }
      ]
    },
    conditions: ['完成50个任务'],
    relatedAchievements: [],
    hidden: false,
    limited: false
  },
  {
    id: 'achievement-4',
    name: '熊猫朋友',
    description: '与熊猫互动10次',
    iconUrl: '/assets/images/achievements/panda-friend.png',
    type: 'panda',
    rarity: 'common',
    unlockedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5天前
    progress: 100,
    unlocked: true,
    points: 15,
    rewards: {
      experience: 75,
      bamboo: 15,
      items: []
    },
    conditions: ['与熊猫互动10次'],
    relatedAchievements: ['achievement-5'],
    hidden: false,
    limited: false
  },
  {
    id: 'achievement-5',
    name: '熊猫训练师',
    description: '训练熊猫5次',
    iconUrl: '/assets/images/achievements/panda-trainer.png',
    type: 'panda',
    rarity: 'uncommon',
    unlockedAt: 0,
    progress: 80,
    unlocked: false,
    points: 25,
    rewards: {
      experience: 125,
      bamboo: 25,
      items: []
    },
    conditions: ['训练熊猫5次'],
    relatedAchievements: [],
    hidden: false,
    limited: false
  },
  {
    id: 'achievement-6',
    name: '挑战接受者',
    description: '参与你的第一个挑战',
    iconUrl: '/assets/images/achievements/challenge-taker.png',
    type: 'challenge',
    rarity: 'common',
    unlockedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2天前
    progress: 100,
    unlocked: true,
    points: 15,
    rewards: {
      experience: 75,
      bamboo: 15,
      items: []
    },
    conditions: ['参与1个挑战'],
    relatedAchievements: ['achievement-7'],
    hidden: false,
    limited: false
  },
  {
    id: 'achievement-7',
    name: '挑战征服者',
    description: '完成5个挑战',
    iconUrl: '/assets/images/achievements/challenge-conqueror.png',
    type: 'challenge',
    rarity: 'rare',
    unlockedAt: 0,
    progress: 40,
    unlocked: false,
    points: 40,
    rewards: {
      experience: 200,
      bamboo: 40,
      items: [
        {
          id: 'item-2',
          name: '挑战徽章',
          quantity: 1
        }
      ]
    },
    conditions: ['完成5个挑战'],
    relatedAchievements: [],
    hidden: false,
    limited: false
  },
  {
    id: 'achievement-8',
    name: '社交蝴蝶',
    description: '添加3个好友',
    iconUrl: '/assets/images/achievements/social-butterfly.png',
    type: 'social',
    rarity: 'uncommon',
    unlockedAt: 0,
    progress: 33,
    unlocked: false,
    points: 20,
    rewards: {
      experience: 100,
      bamboo: 20,
      items: []
    },
    conditions: ['添加3个好友'],
    relatedAchievements: [],
    hidden: false,
    limited: false
  },
  {
    id: 'achievement-9',
    name: '神秘成就',
    description: '???',
    iconUrl: '/assets/images/achievements/mystery.png',
    type: 'special',
    rarity: 'epic',
    unlockedAt: 0,
    progress: 0,
    unlocked: false,
    points: 100,
    rewards: {
      experience: 500,
      bamboo: 100,
      items: [
        {
          id: 'item-3',
          name: '神秘礼盒',
          quantity: 1
        }
      ]
    },
    conditions: ['???'],
    relatedAchievements: [],
    hidden: true,
    limited: false
  },
  {
    id: 'achievement-10',
    name: '春节庆典',
    description: '在春节期间登录',
    iconUrl: '/assets/images/achievements/spring-festival.png',
    type: 'special',
    rarity: 'rare',
    unlockedAt: 0,
    progress: 0,
    unlocked: false,
    points: 30,
    rewards: {
      experience: 150,
      bamboo: 30,
      items: [
        {
          id: 'item-4',
          name: '春节红包',
          quantity: 1
        }
      ]
    },
    conditions: ['在春节期间登录'],
    relatedAchievements: [],
    hidden: false,
    limited: true,
    limitedEndDate: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后
  }
];

/**
 * 获取用户成就
 * @returns 用户成就列表
 */
export const getUserAchievements = async (): Promise<UserAchievement[]> => {
  try {
    // 尝试从数据库获取
    const achievements = await db.table('userAchievements').toArray();
    
    if (achievements && achievements.length > 0) {
      return achievements as UserAchievement[];
    }
    
    // 如果数据库中没有，尝试从本地存储获取
    const storedAchievements = getLocalStorage<UserAchievement[]>(USER_ACHIEVEMENTS_STORAGE_KEY);
    
    if (storedAchievements && storedAchievements.length > 0) {
      // 保存到数据库
      await db.table('userAchievements').bulkPut(storedAchievements);
      return storedAchievements;
    }
    
    // 如果本地存储中也没有，使用示例数据
    const sampleAchievements = SAMPLE_ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      id: achievement.id || uuidv4()
    }));
    
    // 保存到数据库和本地存储
    await db.table('userAchievements').bulkPut(sampleAchievements);
    setLocalStorage(USER_ACHIEVEMENTS_STORAGE_KEY, sampleAchievements);
    
    return sampleAchievements;
  } catch (error) {
    console.error('Failed to get user achievements:', error);
    
    // 如果出错，返回示例数据
    return SAMPLE_ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      id: achievement.id || uuidv4()
    }));
  }
};

/**
 * 解锁成就
 * @param achievementId 成就ID
 * @param addNotification 添加通知的回调函数
 * @returns 解锁后的成就
 */
export const unlockAchievement = async (
  achievementId: string,
  addNotification?: (notification: any) => Promise<any>
): Promise<UserAchievement | null> => {
  try {
    // 获取所有成就
    const achievements = await getUserAchievements();
    
    // 查找要解锁的成就
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex === -1) {
      console.error(`Achievement with ID ${achievementId} not found`);
      return null;
    }
    
    // 如果已经解锁，直接返回
    if (achievements[achievementIndex].unlocked) {
      return achievements[achievementIndex];
    }
    
    // 更新成就状态
    const updatedAchievement: UserAchievement = {
      ...achievements[achievementIndex],
      unlocked: true,
      progress: 100,
      unlockedAt: Date.now()
    };
    
    // 更新成就列表
    achievements[achievementIndex] = updatedAchievement;
    
    // 保存到数据库和本地存储
    await db.table('userAchievements').put(updatedAchievement);
    setLocalStorage(USER_ACHIEVEMENTS_STORAGE_KEY, achievements);
    
    // 更新用户经验值
    await updateUserExperience(updatedAchievement.rewards.experience);
    
    // 播放成就解锁音效
    playSound(SoundType.ACHIEVEMENT);
    
    // 发送通知
    if (addNotification) {
      await addNotification({
        type: NotificationType.ACHIEVEMENT_UNLOCKED,
        title: '成就解锁',
        message: `恭喜你解锁了成就"${updatedAchievement.name}"！`,
        priority: NotificationPriority.MEDIUM,
        icon: updatedAchievement.iconUrl,
        data: {
          achievementId: updatedAchievement.id,
          rewards: updatedAchievement.rewards
        }
      });
    }
    
    return updatedAchievement;
  } catch (error) {
    console.error('Failed to unlock achievement:', error);
    return null;
  }
};

/**
 * 更新成就进度
 * @param achievementId 成就ID
 * @param progress 进度值（0-100）
 * @param addNotification 添加通知的回调函数
 * @returns 更新后的成就
 */
export const updateAchievementProgress = async (
  achievementId: string,
  progress: number,
  addNotification?: (notification: any) => Promise<any>
): Promise<UserAchievement | null> => {
  try {
    // 获取所有成就
    const achievements = await getUserAchievements();
    
    // 查找要更新的成就
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex === -1) {
      console.error(`Achievement with ID ${achievementId} not found`);
      return null;
    }
    
    // 如果已经解锁，直接返回
    if (achievements[achievementIndex].unlocked) {
      return achievements[achievementIndex];
    }
    
    // 规范化进度值
    const normalizedProgress = Math.max(0, Math.min(100, progress));
    
    // 检查是否需要解锁
    const shouldUnlock = normalizedProgress >= 100;
    
    // 更新成就状态
    const updatedAchievement: UserAchievement = {
      ...achievements[achievementIndex],
      progress: normalizedProgress,
      unlocked: shouldUnlock,
      unlockedAt: shouldUnlock ? Date.now() : 0
    };
    
    // 更新成就列表
    achievements[achievementIndex] = updatedAchievement;
    
    // 保存到数据库和本地存储
    await db.table('userAchievements').put(updatedAchievement);
    setLocalStorage(USER_ACHIEVEMENTS_STORAGE_KEY, achievements);
    
    // 如果解锁了成就
    if (shouldUnlock) {
      // 更新用户经验值
      await updateUserExperience(updatedAchievement.rewards.experience);
      
      // 播放成就解锁音效
      playSound(SoundType.ACHIEVEMENT);
      
      // 发送通知
      if (addNotification) {
        await addNotification({
          type: NotificationType.ACHIEVEMENT_UNLOCKED,
          title: '成就解锁',
          message: `恭喜你解锁了成就"${updatedAchievement.name}"！`,
          priority: NotificationPriority.MEDIUM,
          icon: updatedAchievement.iconUrl,
          data: {
            achievementId: updatedAchievement.id,
            rewards: updatedAchievement.rewards
          }
        });
      }
    } else if (normalizedProgress > achievements[achievementIndex].progress && normalizedProgress >= 50) {
      // 如果进度有所提高且超过50%，发送进度通知
      if (addNotification) {
        await addNotification({
          type: NotificationType.ACHIEVEMENT_UNLOCKED,
          title: '成就进度更新',
          message: `你的成就"${updatedAchievement.name}"进度已达到${normalizedProgress}%！`,
          priority: NotificationPriority.LOW,
          icon: updatedAchievement.iconUrl,
          data: {
            achievementId: updatedAchievement.id,
            progress: normalizedProgress
          }
        });
      }
    }
    
    return updatedAchievement;
  } catch (error) {
    console.error('Failed to update achievement progress:', error);
    return null;
  }
};
