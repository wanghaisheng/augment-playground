// src/services/userTitleService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { isUserVip } from './storeService';

/**
 * 用户称号类型
 */
export enum UserTitleType {
  /** 无称号 */
  NONE = 'none',
  /** 守护者称号 (VIP专属) */
  GUARDIAN = 'guardian',
  /** 竹林守护者称号 (VIP专属) */
  BAMBOO_GUARDIAN = 'bamboo_guardian',
  /** 熊猫大师称号 */
  PANDA_MASTER = 'panda_master',
  /** 冥想大师称号 */
  MEDITATION_MASTER = 'meditation_master',
  /** 任务达人称号 */
  TASK_MASTER = 'task_master',
  /** 挑战王者称号 */
  CHALLENGE_CHAMPION = 'challenge_champion',
  /** 收藏家称号 */
  COLLECTOR = 'collector',
  /** 自定义称号 */
  CUSTOM = 'custom'
}

/**
 * 用户称号记录
 */
export interface UserTitleRecord {
  id?: number;
  userId: string;
  titleType: UserTitleType;
  titleText: string;
  isActive: boolean;
  isVipExclusive: boolean;
  unlockDate: Date;
  expiryDate?: Date;
  customText?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 初始化用户称号表
 */
export async function initializeUserTitles(): Promise<void> {
  try {
    // 检查是否已经初始化
    const titles = await db.table('userTitles').toArray();
    if (titles.length > 0) {
      return;
    }

    // 创建默认称号
    const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
    const now = new Date();

    // VIP守护者称号
    const guardianTitle: UserTitleRecord = {
      userId,
      titleType: UserTitleType.GUARDIAN,
      titleText: '守护者',
      isActive: false,
      isVipExclusive: true,
      unlockDate: now,
      createdAt: now,
      updatedAt: now
    };

    // 竹林守护者称号
    const bambooGuardianTitle: UserTitleRecord = {
      userId,
      titleType: UserTitleType.BAMBOO_GUARDIAN,
      titleText: '竹林守护者',
      isActive: false,
      isVipExclusive: true,
      unlockDate: now,
      createdAt: now,
      updatedAt: now
    };

    // 添加到数据库
    await db.table('userTitles').bulkAdd([
      guardianTitle,
      bambooGuardianTitle
    ]);

    console.log('User titles initialized');
  } catch (error) {
    console.error('Failed to initialize user titles:', error);
  }
}

/**
 * 获取用户所有称号
 * @param userId 用户ID
 * @returns 用户所有称号
 */
export async function getUserTitles(userId: string): Promise<UserTitleRecord[]> {
  return db.table('userTitles')
    .where('userId')
    .equals(userId)
    .toArray();
}

/**
 * 获取用户当前激活的称号
 * @param userId 用户ID
 * @returns 用户当前激活的称号，如果没有则返回null
 */
export async function getActiveUserTitle(userId: string): Promise<UserTitleRecord | null> {
  return db.table('userTitles')
    .where('userId')
    .equals(userId)
    .and(title => title.isActive === true)
    .first();
}

/**
 * 激活用户称号
 * @param titleId 称号ID
 * @returns 激活后的称号
 */
export async function activateUserTitle(titleId: number): Promise<UserTitleRecord> {
  // 获取要激活的称号
  const title = await db.table('userTitles').get(titleId);
  if (!title) {
    throw new Error(`Title with ID ${titleId} not found`);
  }

  // 检查是否是VIP专属称号
  if (title.isVipExclusive) {
    const isVip = await isUserVip(title.userId);
    if (!isVip) {
      throw new Error('Cannot activate VIP exclusive title without VIP status');
    }
  }

  // 获取用户所有称号
  const userTitles = await getUserTitles(title.userId);

  // 更新所有称号为非激活状态
  for (const userTitle of userTitles) {
    if (userTitle.isActive) {
      await db.table('userTitles').update(userTitle.id!, {
        ...userTitle,
        isActive: false,
        updatedAt: new Date()
      });

      // 添加同步项目
      await addSyncItem('userTitles', 'update', {
        ...userTitle,
        isActive: false,
        updatedAt: new Date()
      });
    }
  }

  // 激活选定的称号
  const updatedTitle = {
    ...title,
    isActive: true,
    updatedAt: new Date()
  };

  await db.table('userTitles').update(titleId, updatedTitle);

  // 添加同步项目
  await addSyncItem('userTitles', 'update', updatedTitle);

  return updatedTitle;
}

/**
 * 解锁用户称号
 * @param userId 用户ID
 * @param titleType 称号类型
 * @param titleText 称号文本
 * @param isVipExclusive 是否VIP专属
 * @param customText 自定义文本（可选）
 * @returns 解锁的称号
 */
export async function unlockUserTitle(
  userId: string,
  titleType: UserTitleType,
  titleText: string,
  isVipExclusive: boolean,
  customText?: string
): Promise<UserTitleRecord> {
  // 检查称号是否已存在
  const existingTitle = await db.table('userTitles')
    .where('userId')
    .equals(userId)
    .and(title => title.titleType === titleType)
    .first();

  if (existingTitle) {
    return existingTitle;
  }

  // 创建新称号
  const now = new Date();
  const newTitle: UserTitleRecord = {
    userId,
    titleType,
    titleText,
    isActive: false,
    isVipExclusive,
    unlockDate: now,
    customText,
    createdAt: now,
    updatedAt: now
  };

  // 添加到数据库
  const id = await db.table('userTitles').add(newTitle);
  const createdTitle = { ...newTitle, id: id as number };

  // 添加同步项目
  await addSyncItem('userTitles', 'create', createdTitle);

  return createdTitle;
}

/**
 * 检查并更新VIP称号状态
 * 当用户VIP状态变化时调用此函数
 * @param userId 用户ID
 * @param isVip 是否VIP用户
 */
export async function updateVipTitleStatus(userId: string, isVip: boolean): Promise<void> {
  try {
    // 获取用户所有称号
    const userTitles = await getUserTitles(userId);
    
    // 获取当前激活的称号
    const activeTitle = userTitles.find(title => title.isActive);
    
    // 如果用户是VIP，确保VIP称号可用
    if (isVip) {
      // 检查是否有守护者称号
      const guardianTitle = userTitles.find(title => title.titleType === UserTitleType.GUARDIAN);
      
      if (!guardianTitle) {
        // 如果没有，创建守护者称号
        await unlockUserTitle(userId, UserTitleType.GUARDIAN, '守护者', true);
      }
      
      // 检查是否有竹林守护者称号
      const bambooGuardianTitle = userTitles.find(title => title.titleType === UserTitleType.BAMBOO_GUARDIAN);
      
      if (!bambooGuardianTitle) {
        // 如果没有，创建竹林守护者称号
        await unlockUserTitle(userId, UserTitleType.BAMBOO_GUARDIAN, '竹林守护者', true);
      }
    } else {
      // 如果用户不是VIP，但当前激活的是VIP专属称号，取消激活
      if (activeTitle && activeTitle.isVipExclusive) {
        // 更新称号为非激活状态
        await db.table('userTitles').update(activeTitle.id!, {
          ...activeTitle,
          isActive: false,
          updatedAt: new Date()
        });
        
        // 添加同步项目
        await addSyncItem('userTitles', 'update', {
          ...activeTitle,
          isActive: false,
          updatedAt: new Date()
        });
      }
    }
  } catch (error) {
    console.error('Failed to update VIP title status:', error);
  }
}
