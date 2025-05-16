// src/services/pandaSkinService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { isUserVip } from './storeService';

/**
 * 熊猫皮肤类型
 */
export enum PandaSkinType {
  NORMAL = 'normal',         // 普通皮肤
  SEASONAL = 'seasonal',     // 季节性皮肤
  FESTIVAL = 'festival',     // 节日皮肤
  SPECIAL = 'special',       // 特殊皮肤
  VIP = 'vip'                // VIP专属皮肤
}

/**
 * 熊猫皮肤稀有度
 */
export enum PandaSkinRarity {
  COMMON = 'common',         // 普通
  UNCOMMON = 'uncommon',     // 不常见
  RARE = 'rare',             // 稀有
  EPIC = 'epic',             // 史诗
  LEGENDARY = 'legendary'    // 传说
}

/**
 * 熊猫皮肤记录
 */
export interface PandaSkinRecord {
  id?: number;
  name: string;
  description: string;
  type: PandaSkinType;
  rarity: PandaSkinRarity;
  imagePath: {
    normal: string;          // 普通状态图片路径
    happy: string;           // 开心状态图片路径
    focused: string;         // 专注状态图片路径
    tired: string;           // 疲惫状态图片路径
  };
  thumbnailPath: string;     // 缩略图路径
  isEquipped: boolean;       // 是否装备
  isOwned: boolean;          // 是否拥有
  isVipExclusive: boolean;   // 是否VIP专属
  obtainedAt?: Date;         // 获取时间
  storeItemId?: number;      // 商店物品ID
  themeType: string;         // 主题类型
  specialEffects?: string[]; // 特殊效果
  createdAt: Date;           // 创建时间
  updatedAt: Date;           // 更新时间
}

// 默认熊猫皮肤
const DEFAULT_SKINS: PandaSkinRecord[] = [
  {
    name: '经典熊猫',
    description: '经典的黑白熊猫形象，简单而可爱',
    type: PandaSkinType.NORMAL,
    rarity: PandaSkinRarity.COMMON,
    imagePath: {
      normal: '/assets/panda-normal.svg',
      happy: '/assets/panda-happy.svg',
      focused: '/assets/panda-focused.svg',
      tired: '/assets/panda-tired.svg'
    },
    thumbnailPath: '/assets/skins/classic-panda-thumb.svg',
    isEquipped: true,
    isOwned: true,
    isVipExclusive: false,
    obtainedAt: new Date(),
    themeType: '经典',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '金色守护者',
    description: 'VIP专属皮肤，金色点缀的华丽熊猫形象，象征着尊贵与荣耀',
    type: PandaSkinType.VIP,
    rarity: PandaSkinRarity.LEGENDARY,
    imagePath: {
      normal: '/assets/skins/golden-guardian-normal.svg',
      happy: '/assets/skins/golden-guardian-happy.svg',
      focused: '/assets/skins/golden-guardian-focused.svg',
      tired: '/assets/skins/golden-guardian-tired.svg'
    },
    thumbnailPath: '/assets/skins/golden-guardian-thumb.svg',
    isEquipped: false,
    isOwned: false,
    isVipExclusive: true,
    themeType: '皇家',
    specialEffects: ['goldGlow', 'sparkle'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '竹林仙子',
    description: 'VIP专属皮肤，翡翠绿色的熊猫形象，散发着自然的灵动气息',
    type: PandaSkinType.VIP,
    rarity: PandaSkinRarity.EPIC,
    imagePath: {
      normal: '/assets/skins/jade-fairy-normal.svg',
      happy: '/assets/skins/jade-fairy-happy.svg',
      focused: '/assets/skins/jade-fairy-focused.svg',
      tired: '/assets/skins/jade-fairy-tired.svg'
    },
    thumbnailPath: '/assets/skins/jade-fairy-thumb.svg',
    isEquipped: false,
    isOwned: false,
    isVipExclusive: true,
    themeType: '自然',
    specialEffects: ['leafTrail', 'greenGlow'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '墨韵国风',
    description: 'VIP专属皮肤，水墨画风格的熊猫形象，展现中国传统艺术之美',
    type: PandaSkinType.VIP,
    rarity: PandaSkinRarity.EPIC,
    imagePath: {
      normal: '/assets/skins/ink-style-normal.svg',
      happy: '/assets/skins/ink-style-happy.svg',
      focused: '/assets/skins/ink-style-focused.svg',
      tired: '/assets/skins/ink-style-tired.svg'
    },
    thumbnailPath: '/assets/skins/ink-style-thumb.svg',
    isEquipped: false,
    isOwned: false,
    isVipExclusive: true,
    themeType: '传统',
    specialEffects: ['inkDrip', 'brushStroke'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * 初始化熊猫皮肤系统
 */
export async function initializePandaSkins(): Promise<void> {
  try {
    // 检查皮肤是否已初始化
    const skins = await db.pandaSkins.toArray();
    if (skins.length === 0) {
      await db.pandaSkins.bulkAdd(DEFAULT_SKINS);
      console.log('Panda skins initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize panda skins:', error);
  }
}

/**
 * 获取所有熊猫皮肤
 */
export async function getAllSkins(): Promise<PandaSkinRecord[]> {
  return db.pandaSkins.toArray();
}

/**
 * 获取用户拥有的熊猫皮肤
 * @param userId 用户ID
 */
export async function getOwnedSkins(userId: string): Promise<PandaSkinRecord[]> {
  try {
    // 获取所有皮肤
    const allSkins = await getAllSkins();
    
    // 检查用户是否是VIP
    const isVip = await isUserVip(userId);
    
    // 过滤出用户拥有的皮肤
    return allSkins.filter(skin => {
      // 如果皮肤已拥有，直接返回true
      if (skin.isOwned) {
        return true;
      }
      
      // 如果是VIP专属皮肤且用户是VIP，返回true
      if (skin.isVipExclusive && isVip) {
        return true;
      }
      
      return false;
    });
  } catch (error) {
    console.error('Failed to get owned skins:', error);
    return [];
  }
}

/**
 * 获取当前装备的熊猫皮肤
 */
export async function getEquippedSkin(): Promise<PandaSkinRecord | null> {
  try {
    const skin = await db.pandaSkins
      .filter((s: PandaSkinRecord) => s.isEquipped === true)
      .first();
    
    return skin || null;
  } catch (error) {
    console.error('Failed to get equipped skin:', error);
    return null;
  }
}

/**
 * 装备熊猫皮肤
 * @param skinId 皮肤ID
 * @param userId 用户ID
 */
export async function equipSkin(skinId: number, userId: string): Promise<void> {
  try {
    // 获取要装备的皮肤
    const skin = await db.pandaSkins.get(skinId);
    if (!skin) {
      throw new Error(`Skin with ID ${skinId} not found`);
    }
    
    // 检查用户是否拥有该皮肤或是否是VIP专属皮肤
    if (!skin.isOwned && skin.isVipExclusive) {
      const isVip = await isUserVip(userId);
      if (!isVip) {
        throw new Error('This skin is VIP exclusive');
      }
    }
    
    // 开始事务
    await db.transaction('rw', db.pandaSkins, async () => {
      // 取消当前装备的皮肤
      const currentlyEquipped = await db.pandaSkins
                                      .filter((s: PandaSkinRecord) => s.isEquipped === true)
                                      .toArray();
      for (const s of currentlyEquipped) {
        await db.pandaSkins.update(s.id!, { isEquipped: false, updatedAt: new Date() });
      }
      
      // 装备新皮肤
      await db.pandaSkins.update(skinId, { isEquipped: true, updatedAt: new Date() });
    });
    
    // 添加同步项目
    await addSyncItem('pandaSkins', 'update', { id: skinId, isEquipped: true });
  } catch (error) {
    console.error('Failed to equip skin:', error);
    throw error;
  }
}

/**
 * 解锁熊猫皮肤
 * @param skinId 皮肤ID
 */
export async function unlockSkin(skinId: number): Promise<void> {
  try {
    // 获取皮肤
    const skin = await db.pandaSkins.get(skinId);
    if (!skin) {
      throw new Error(`Skin with ID ${skinId} not found`);
    }
    
    // 如果皮肤已拥有，则不执行任何操作
    if (skin.isOwned) {
      return;
    }
    
    // 更新皮肤状态
    await db.pandaSkins.update(skinId, {
      isOwned: true,
      obtainedAt: new Date(),
      updatedAt: new Date()
    });
    
    // 添加同步项目
    await addSyncItem('pandaSkins', 'update', { id: skinId, isOwned: true, obtainedAt: new Date() });
    console.log(`Skin ${skin.name} unlocked successfully`);
  } catch (error) {
    console.error('Failed to unlock skin:', error);
    throw error;
  }
}
