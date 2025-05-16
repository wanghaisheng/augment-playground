// src/services/userProfileService.ts
import { db } from '@/db-old';
import { UserProfile } from '@/types/user';
import { getLocalStorage, setLocalStorage } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';

// 本地存储键
const USER_PROFILE_STORAGE_KEY = 'panda_habit_user_profile';

// 默认用户资料
const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'default-user',
  username: 'panda_user',
  displayName: '熊猫习惯用户',
  avatarUrl: '/assets/images/avatars/default-avatar.png',
  bio: '我是一名熊猫习惯的用户，正在培养良好的习惯！',
  joinDate: Date.now(),
  level: 1,
  experience: 0,
  nextLevelExperience: 100,
  themeColor: '#4CAF50',
  backgroundImageUrl: '/assets/images/backgrounds/default-background.jpg',
  socialLinks: {},
  privacySettings: {
    showAchievements: true,
    showStatistics: true,
    showLevel: true,
    showSocialLinks: true
  },
  preferences: {
    language: 'zh',
    theme: 'light',
    notificationsEnabled: true
  },
  customFields: {}
};

/**
 * 获取用户资料
 * @returns 用户资料
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    // 尝试从数据库获取
    const userProfile = await db.table('userProfile').toArray();
    
    if (userProfile && userProfile.length > 0) {
      return userProfile[0] as UserProfile;
    }
    
    // 如果数据库中没有，尝试从本地存储获取
    const storedProfile = getLocalStorage<UserProfile>(USER_PROFILE_STORAGE_KEY);
    
    if (storedProfile) {
      // 保存到数据库
      await db.table('userProfile').put(storedProfile);
      return storedProfile;
    }
    
    // 如果本地存储中也没有，使用默认资料
    const defaultProfile = { ...DEFAULT_USER_PROFILE, id: uuidv4() };
    
    // 保存到数据库和本地存储
    await db.table('userProfile').put(defaultProfile);
    setLocalStorage(USER_PROFILE_STORAGE_KEY, defaultProfile);
    
    return defaultProfile;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    
    // 如果出错，返回默认资料
    return { ...DEFAULT_USER_PROFILE, id: uuidv4() };
  }
};

/**
 * 更新用户资料
 * @param profile 更新后的用户资料
 * @returns 更新后的用户资料
 */
export const updateUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    // 更新数据库
    await db.table('userProfile').put(profile);
    
    // 更新本地存储
    setLocalStorage(USER_PROFILE_STORAGE_KEY, profile);
    
    return profile;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

/**
 * 更新用户经验值
 * @param experienceGained 获得的经验值
 * @returns 更新后的用户资料
 */
export const updateUserExperience = async (experienceGained: number): Promise<UserProfile> => {
  try {
    // 获取当前用户资料
    const profile = await getUserProfile();
    
    // 计算新的经验值
    const newExperience = profile.experience + experienceGained;
    
    // 检查是否升级
    let newLevel = profile.level;
    let nextLevelExp = profile.nextLevelExperience;
    
    while (newExperience >= nextLevelExp) {
      newLevel++;
      
      // 计算下一级所需经验（每级增加20%）
      nextLevelExp = Math.floor(nextLevelExp * 1.2);
    }
    
    // 更新用户资料
    const updatedProfile: UserProfile = {
      ...profile,
      experience: newExperience,
      level: newLevel,
      nextLevelExperience: nextLevelExp
    };
    
    // 保存更新后的资料
    await updateUserProfile(updatedProfile);
    
    return updatedProfile;
  } catch (error) {
    console.error('Failed to update user experience:', error);
    throw error;
  }
};

/**
 * 更新用户头像
 * @param avatarUrl 新的头像URL
 * @returns 更新后的用户资料
 */
export const updateUserAvatar = async (avatarUrl: string): Promise<UserProfile> => {
  try {
    // 获取当前用户资料
    const profile = await getUserProfile();
    
    // 更新头像
    const updatedProfile: UserProfile = {
      ...profile,
      avatarUrl
    };
    
    // 保存更新后的资料
    await updateUserProfile(updatedProfile);
    
    return updatedProfile;
  } catch (error) {
    console.error('Failed to update user avatar:', error);
    throw error;
  }
};

/**
 * 更新用户背景图片
 * @param backgroundImageUrl 新的背景图片URL
 * @returns 更新后的用户资料
 */
export const updateUserBackground = async (backgroundImageUrl: string): Promise<UserProfile> => {
  try {
    // 获取当前用户资料
    const profile = await getUserProfile();
    
    // 更新背景图片
    const updatedProfile: UserProfile = {
      ...profile,
      backgroundImageUrl
    };
    
    // 保存更新后的资料
    await updateUserProfile(updatedProfile);
    
    return updatedProfile;
  } catch (error) {
    console.error('Failed to update user background:', error);
    throw error;
  }
};

/**
 * 更新用户主题颜色
 * @param themeColor 新的主题颜色
 * @returns 更新后的用户资料
 */
export const updateUserThemeColor = async (themeColor: string): Promise<UserProfile> => {
  try {
    // 获取当前用户资料
    const profile = await getUserProfile();
    
    // 更新主题颜色
    const updatedProfile: UserProfile = {
      ...profile,
      themeColor
    };
    
    // 保存更新后的资料
    await updateUserProfile(updatedProfile);
    
    return updatedProfile;
  } catch (error) {
    console.error('Failed to update user theme color:', error);
    throw error;
  }
};

/**
 * 更新用户隐私设置
 * @param privacySettings 新的隐私设置
 * @returns 更新后的用户资料
 */
export const updateUserPrivacySettings = async (
  privacySettings: UserProfile['privacySettings']
): Promise<UserProfile> => {
  try {
    // 获取当前用户资料
    const profile = await getUserProfile();
    
    // 更新隐私设置
    const updatedProfile: UserProfile = {
      ...profile,
      privacySettings
    };
    
    // 保存更新后的资料
    await updateUserProfile(updatedProfile);
    
    return updatedProfile;
  } catch (error) {
    console.error('Failed to update user privacy settings:', error);
    throw error;
  }
};

/**
 * 更新用户社交链接
 * @param socialLinks 新的社交链接
 * @returns 更新后的用户资料
 */
export const updateUserSocialLinks = async (
  socialLinks: UserProfile['socialLinks']
): Promise<UserProfile> => {
  try {
    // 获取当前用户资料
    const profile = await getUserProfile();
    
    // 更新社交链接
    const updatedProfile: UserProfile = {
      ...profile,
      socialLinks
    };
    
    // 保存更新后的资料
    await updateUserProfile(updatedProfile);
    
    return updatedProfile;
  } catch (error) {
    console.error('Failed to update user social links:', error);
    throw error;
  }
};
