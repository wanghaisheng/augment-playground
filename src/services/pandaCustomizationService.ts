// src/services/pandaCustomizationService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { StoreItemType } from './storeService';

// 熊猫装饰类型
export enum PandaAccessoryType {
  HAT = 'hat',               // 帽子
  GLASSES = 'glasses',       // 眼镜
  SCARF = 'scarf',           // 围巾
  PENDANT = 'pendant',       // 挂饰
  BACKGROUND = 'background', // 背景
  FRAME = 'frame',           // 边框
  EFFECT = 'effect'          // 特效
}

// 熊猫装饰记录类型
export interface PandaAccessoryRecord {
  id?: number;
  name: string;
  type: PandaAccessoryType;
  description: string;
  imagePath: string;
  overlayPath?: string; // 叠加图层路径
  isEquipped: boolean;
  isOwned: boolean;
  obtainedAt?: Date;
  storeItemId?: number;
  rarity: string;
  themeType: string; // 中国风主题类型：传统、现代、节日等
}

// 熊猫环境记录类型
export interface PandaEnvironmentRecord {
  id?: number;
  name: string;
  description: string;
  backgroundPath: string;
  foregroundPath?: string;
  ambientSound?: string;
  isActive: boolean;
  isOwned: boolean;
  obtainedAt?: Date;
  storeItemId?: number;
  rarity: string;
  themeType: string; // 中国风主题类型：园林、山水、竹林等
  interactiveElements?: PandaEnvironmentElement[];
}

// 环境互动元素类型
export interface PandaEnvironmentElement {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  imagePath: string;
  animationPath?: string;
  interactionType: 'click' | 'hover' | 'drag';
  interactionEffect: string;
  soundEffect?: string;
}

// 默认熊猫装饰
const DEFAULT_ACCESSORIES: PandaAccessoryRecord[] = [
  {
    name: '竹叶帽',
    type: PandaAccessoryType.HAT,
    description: '用竹叶编织的简单帽子，清新自然',
    imagePath: '/assets/accessories/bamboo-hat.svg',
    isEquipped: false,
    isOwned: true,
    obtainedAt: new Date(),
    rarity: 'common',
    themeType: '传统'
  },
  {
    name: '红丝带',
    type: PandaAccessoryType.SCARF,
    description: '象征好运的红丝带，为熊猫带来喜气',
    imagePath: '/assets/accessories/red-ribbon.svg',
    isEquipped: false,
    isOwned: true,
    obtainedAt: new Date(),
    rarity: 'common',
    themeType: '传统'
  },
  {
    name: '金框',
    type: PandaAccessoryType.FRAME,
    description: '华丽的金色边框，彰显尊贵',
    imagePath: '/assets/accessories/gold-frame.svg',
    isEquipped: false,
    isOwned: true,
    obtainedAt: new Date(),
    rarity: 'rare',
    themeType: '传统'
  }
];

// 默认熊猫环境
const DEFAULT_ENVIRONMENTS: PandaEnvironmentRecord[] = [
  {
    name: '竹林小径',
    description: '宁静的竹林小径，熊猫的最爱',
    backgroundPath: '/assets/environments/bamboo-path.svg',
    ambientSound: '/assets/sounds/bamboo-forest.mp3',
    isActive: true,
    isOwned: true,
    obtainedAt: new Date(),
    rarity: 'common',
    themeType: '竹林',
    interactiveElements: [
      {
        id: 'bamboo1',
        name: '竹子',
        type: 'plant',
        position: { x: 20, y: 50 },
        size: { width: 30, height: 100 },
        imagePath: '/assets/environments/elements/bamboo.svg',
        animationPath: '/assets/environments/animations/bamboo-sway.json',
        interactionType: 'click',
        interactionEffect: 'sway',
        soundEffect: '/assets/sounds/bamboo-rustle.mp3'
      },
      {
        id: 'butterfly1',
        name: '蝴蝶',
        type: 'animal',
        position: { x: 70, y: 30 },
        size: { width: 20, height: 20 },
        imagePath: '/assets/environments/elements/butterfly.svg',
        animationPath: '/assets/environments/animations/butterfly-flutter.json',
        interactionType: 'hover',
        interactionEffect: 'flutter',
        soundEffect: '/assets/sounds/butterfly-wings.mp3'
      }
    ]
  },
  {
    name: '中式园林',
    description: '精致的中式园林，亭台楼阁，山水相依',
    backgroundPath: '/assets/environments/chinese-garden.svg',
    ambientSound: '/assets/sounds/garden-birds.mp3',
    isActive: false,
    isOwned: true,
    obtainedAt: new Date(),
    rarity: 'uncommon',
    themeType: '园林',
    interactiveElements: [
      {
        id: 'pavilion1',
        name: '亭子',
        type: 'structure',
        position: { x: 60, y: 40 },
        size: { width: 50, height: 60 },
        imagePath: '/assets/environments/elements/pavilion.svg',
        interactionType: 'click',
        interactionEffect: 'glow',
        soundEffect: '/assets/sounds/wind-chimes.mp3'
      },
      {
        id: 'koi1',
        name: '锦鲤',
        type: 'animal',
        position: { x: 30, y: 70 },
        size: { width: 25, height: 15 },
        imagePath: '/assets/environments/elements/koi.svg',
        animationPath: '/assets/environments/animations/koi-swim.json',
        interactionType: 'hover',
        interactionEffect: 'swim',
        soundEffect: '/assets/sounds/water-splash.mp3'
      }
    ]
  }
];

/**
 * 初始化熊猫定制系统
 */
export async function initializePandaCustomization(): Promise<void> {
  // 检查装饰是否已初始化
  const accessories = await db.table('pandaAccessories').toArray();
  if (accessories.length === 0) {
    await db.table('pandaAccessories').bulkAdd(DEFAULT_ACCESSORIES);
  }

  // 检查环境是否已初始化
  const environments = await db.table('pandaEnvironments').toArray();
  if (environments.length === 0) {
    await db.table('pandaEnvironments').bulkAdd(DEFAULT_ENVIRONMENTS);
  }
}

/**
 * 获取所有熊猫装饰
 */
export async function getAllAccessories(): Promise<PandaAccessoryRecord[]> {
  return db.table('pandaAccessories').toArray();
}

/**
 * 获取已拥有的熊猫装饰
 */
export async function getOwnedAccessories(): Promise<PandaAccessoryRecord[]> {
  return db.table('pandaAccessories')
    .filter(accessory => accessory.isOwned === true)
    .toArray();
}

/**
 * 获取已装备的熊猫装饰
 */
export async function getEquippedAccessories(): Promise<PandaAccessoryRecord[]> {
  return db.table('pandaAccessories')
    .filter(accessory => accessory.isEquipped === true)
    .toArray();
}

/**
 * 装备熊猫装饰
 * @param accessoryId 装饰ID
 */
export async function equipAccessory(accessoryId: number): Promise<PandaAccessoryRecord> {
  const accessory = await db.table('pandaAccessories').get(accessoryId);

  if (!accessory) {
    throw new Error(`Accessory with id ${accessoryId} not found`);
  }

  if (!accessory.isOwned) {
    throw new Error(`Accessory with id ${accessoryId} is not owned`);
  }

  // 先取消同类型的其他装饰
  const sameTypeAccessories = await db.table('pandaAccessories')
    .where('type')
    .equals(accessory.type)
    .filter(item => item.isEquipped === true)
    .toArray();

  for (const item of sameTypeAccessories) {
    await db.table('pandaAccessories').update(item.id!, { isEquipped: false });
    await addSyncItem('pandaAccessories', 'update', { ...item, isEquipped: false });
  }

  // 装备新装饰
  const updatedAccessory = { ...accessory, isEquipped: true };
  await db.table('pandaAccessories').update(accessoryId, updatedAccessory);
  await addSyncItem('pandaAccessories', 'update', updatedAccessory);

  return updatedAccessory;
}

/**
 * 取消装备熊猫装饰
 * @param accessoryId 装饰ID
 */
export async function unequipAccessory(accessoryId: number): Promise<PandaAccessoryRecord> {
  const accessory = await db.table('pandaAccessories').get(accessoryId);

  if (!accessory) {
    throw new Error(`Accessory with id ${accessoryId} not found`);
  }

  const updatedAccessory = { ...accessory, isEquipped: false };
  await db.table('pandaAccessories').update(accessoryId, updatedAccessory);
  await addSyncItem('pandaAccessories', 'update', updatedAccessory);

  return updatedAccessory;
}

/**
 * 添加新的熊猫装饰
 * @param accessory 装饰数据
 */
export async function addAccessory(accessory: Omit<PandaAccessoryRecord, 'id'>): Promise<PandaAccessoryRecord> {
  const id = await db.table('pandaAccessories').add(accessory);
  const newAccessory = { ...accessory, id: id as number };
  await addSyncItem('pandaAccessories', 'create', newAccessory);
  return newAccessory;
}

/**
 * 获取所有熊猫环境
 */
export async function getAllEnvironments(): Promise<PandaEnvironmentRecord[]> {
  return db.table('pandaEnvironments').toArray();
}

/**
 * 获取已拥有的熊猫环境
 */
export async function getOwnedEnvironments(): Promise<PandaEnvironmentRecord[]> {
  return db.table('pandaEnvironments')
    .filter(environment => environment.isOwned === true)
    .toArray();
}

/**
 * 获取当前激活的熊猫环境
 */
export async function getActiveEnvironment(): Promise<PandaEnvironmentRecord | undefined> {
  return db.table('pandaEnvironments')
    .filter(environment => environment.isActive === true)
    .first();
}

/**
 * 激活熊猫环境
 * @param environmentId 环境ID
 */
export async function activateEnvironment(environmentId: number): Promise<PandaEnvironmentRecord> {
  const environment = await db.table('pandaEnvironments').get(environmentId);

  if (!environment) {
    throw new Error(`Environment with id ${environmentId} not found`);
  }

  if (!environment.isOwned) {
    throw new Error(`Environment with id ${environmentId} is not owned`);
  }

  // 先取消其他环境的激活状态
  const activeEnvironments = await db.table('pandaEnvironments')
    .filter(environment => environment.isActive === true)
    .toArray();

  for (const item of activeEnvironments) {
    await db.table('pandaEnvironments').update(item.id!, { isActive: false });
    await addSyncItem('pandaEnvironments', 'update', { ...item, isActive: false });
  }

  // 激活新环境
  const updatedEnvironment = { ...environment, isActive: true };
  await db.table('pandaEnvironments').update(environmentId, updatedEnvironment);
  await addSyncItem('pandaEnvironments', 'update', updatedEnvironment);

  return updatedEnvironment;
}

/**
 * 添加新的熊猫环境
 * @param environment 环境数据
 */
export async function addEnvironment(environment: Omit<PandaEnvironmentRecord, 'id'>): Promise<PandaEnvironmentRecord> {
  const id = await db.table('pandaEnvironments').add(environment);
  const newEnvironment = { ...environment, id: id as number };
  await addSyncItem('pandaEnvironments', 'create', newEnvironment);
  return newEnvironment;
}

/**
 * 从商店购买装饰或环境后添加到用户拥有的物品中
 * @param storeItemId 商店物品ID
 * @param itemType 物品类型
 * @param itemData 物品数据
 */
export async function addCustomizationFromStore(
  storeItemId: number,
  itemType: StoreItemType,
  itemData: any
): Promise<void> {
  const now = new Date();

  if (itemType === StoreItemType.ACCESSORY) {
    // 添加装饰
    await addAccessory({
      name: itemData.name,
      type: itemData.accessoryType,
      description: itemData.description,
      imagePath: itemData.imagePath,
      overlayPath: itemData.overlayPath,
      isEquipped: false,
      isOwned: true,
      obtainedAt: now,
      storeItemId,
      rarity: itemData.rarity,
      themeType: itemData.themeType
    });
  } else if (itemType === StoreItemType.BACKGROUND) {
    // 添加环境
    await addEnvironment({
      name: itemData.name,
      description: itemData.description,
      backgroundPath: itemData.backgroundPath,
      foregroundPath: itemData.foregroundPath,
      ambientSound: itemData.ambientSound,
      isActive: false,
      isOwned: true,
      obtainedAt: now,
      storeItemId,
      rarity: itemData.rarity,
      themeType: itemData.themeType,
      interactiveElements: itemData.interactiveElements
    });
  }
}
