// src/services/rewardService.ts
import { db } from '@/db';
import { TaskType, TaskPriority, TaskRecord } from './taskService';
import { addSyncItem } from './dataSyncService';

// 奖励类型枚举
export enum RewardType {
  EXPERIENCE = 'experience',   // 经验值
  COIN = 'coin',               // 金币
  ITEM = 'item',               // 物品
  BADGE = 'badge',             // 徽章
  ABILITY = 'ability'          // 熊猫能力
}

// 奖励稀有度枚举
export enum RewardRarity {
  COMMON = 'common',           // 普通
  UNCOMMON = 'uncommon',       // 不常见
  RARE = 'rare',               // 稀有
  EPIC = 'epic',               // 史诗
  LEGENDARY = 'legendary'      // 传说
}

// 奖励记录类型
export interface RewardRecord {
  id?: number;
  type: RewardType;
  rarity: RewardRarity;
  amount: number;
  name: string;
  description: string;
  iconPath: string;
  taskId?: number;
  obtainedAt: Date;
  isNew: boolean;
  isViewed: boolean;
}

// 物品类型枚举
export enum ItemType {
  FOOD = 'food',               // 食物
  TOY = 'toy',                 // 玩具
  DECORATION = 'decoration',   // 装饰
  SCROLL = 'scroll',           // 卷轴
  POTION = 'potion'            // 药水
}

// 物品记录类型
export interface ItemRecord {
  id?: number;
  type: ItemType;
  name: string;
  description: string;
  rarity: RewardRarity;
  iconPath: string;
  quantity: number;
  isUsable: boolean;
  effectDescription?: string;
  obtainedAt: Date;
}

// 徽章记录类型
export interface BadgeRecord {
  id?: number;
  name: string;
  description: string;
  rarity: RewardRarity;
  iconPath: string;
  obtainedAt: Date;
  isEquipped: boolean;
}

// 熊猫能力记录类型
export interface AbilityRecord {
  id?: number;
  name: string;
  description: string;
  rarity: RewardRarity;
  iconPath: string;
  obtainedAt: Date;
  isUnlocked: boolean;
  isActive: boolean;
  cooldownMinutes?: number;
  lastUsedAt?: Date;
}

/**
 * 根据任务生成奖励
 * @param task 完成的任务
 * @returns 生成的奖励
 */
export async function generateRewardsForTask(task: TaskRecord): Promise<RewardRecord[]> {
  const rewards: RewardRecord[] = [];
  const now = new Date();

  // 基础经验值奖励（已在taskService中处理）
  let experienceAmount = 10;

  // 根据优先级调整经验值
  switch (task.priority) {
    case TaskPriority.HIGH:
      experienceAmount += 15;
      break;
    case TaskPriority.MEDIUM:
      experienceAmount += 10;
      break;
    case TaskPriority.LOW:
      experienceAmount += 5;
      break;
  }

  // 根据任务类型调整经验值
  switch (task.type) {
    case TaskType.MAIN:
      experienceAmount += 20;
      break;
    case TaskType.DAILY:
      experienceAmount += 5;
      break;
    case TaskType.SIDE:
      experienceAmount += 10;
      break;
  }

  // 添加经验值奖励
  rewards.push({
    type: RewardType.EXPERIENCE,
    rarity: RewardRarity.COMMON,
    amount: experienceAmount,
    name: '经验值',
    description: '增加熊猫的经验值',
    iconPath: '/assets/rewards/experience.svg',
    taskId: task.id,
    obtainedAt: now,
    isNew: true,
    isViewed: false
  });

  // 添加金币奖励
  const coinAmount = calculateCoinReward(task);
  rewards.push({
    type: RewardType.COIN,
    rarity: RewardRarity.COMMON,
    amount: coinAmount,
    name: '竹币',
    description: '可用于购买物品和升级',
    iconPath: '/assets/rewards/coin.svg',
    taskId: task.id,
    obtainedAt: now,
    isNew: true,
    isViewed: false
  });

  // 随机物品奖励（概率性）
  if (shouldGetItemReward(task)) {
    const itemReward = generateRandomItemReward(task);
    rewards.push({
      ...itemReward,
      taskId: task.id,
      obtainedAt: now,
      isNew: true,
      isViewed: false
    });
  }

  // 保存奖励记录
  await saveRewards(rewards);

  return rewards;
}

/**
 * 计算金币奖励
 */
function calculateCoinReward(task: TaskRecord): number {
  let baseAmount = 5;

  // 根据优先级调整金币数量
  switch (task.priority) {
    case TaskPriority.HIGH:
      baseAmount += 15;
      break;
    case TaskPriority.MEDIUM:
      baseAmount += 10;
      break;
    case TaskPriority.LOW:
      baseAmount += 5;
      break;
  }

  // 根据任务类型调整金币数量
  switch (task.type) {
    case TaskType.MAIN:
      baseAmount += 20;
      break;
    case TaskType.DAILY:
      baseAmount += 5;
      break;
    case TaskType.SIDE:
      baseAmount += 10;
      break;
  }

  // 添加随机波动（±20%）
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 到 1.2 之间
  return Math.round(baseAmount * randomFactor);
}

/**
 * 判断是否应该获得物品奖励
 */
function shouldGetItemReward(task: TaskRecord): boolean {
  let chance = 0.1; // 基础概率10%

  // 根据优先级调整概率
  switch (task.priority) {
    case TaskPriority.HIGH:
      chance += 0.2;
      break;
    case TaskPriority.MEDIUM:
      chance += 0.1;
      break;
    case TaskPriority.LOW:
      chance += 0.05;
      break;
  }

  // 根据任务类型调整概率
  switch (task.type) {
    case TaskType.MAIN:
      chance += 0.3;
      break;
    case TaskType.DAILY:
      chance += 0.05;
      break;
    case TaskType.SIDE:
      chance += 0.15;
      break;
  }

  return Math.random() < chance;
}

/**
 * 生成随机物品奖励
 */
function generateRandomItemReward(task: TaskRecord): RewardRecord {
  // 随机选择物品类型
  const itemTypes = [
    { type: ItemType.FOOD, weight: 0.4 },
    { type: ItemType.TOY, weight: 0.3 },
    { type: ItemType.DECORATION, weight: 0.1 },
    { type: ItemType.SCROLL, weight: 0.1 },
    { type: ItemType.POTION, weight: 0.1 }
  ];

  // 随机选择稀有度
  const rarityTypes = [
    { rarity: RewardRarity.COMMON, weight: 0.6 },
    { rarity: RewardRarity.UNCOMMON, weight: 0.25 },
    { rarity: RewardRarity.RARE, weight: 0.1 },
    { rarity: RewardRarity.EPIC, weight: 0.04 },
    { rarity: RewardRarity.LEGENDARY, weight: 0.01 }
  ];

  // 根据权重随机选择物品类型
  const randomTypeObj = weightedRandom(itemTypes);
  const randomType = randomTypeObj.type;

  // 根据权重随机选择稀有度
  const randomRarityObj = weightedRandom(rarityTypes);
  const randomRarity = randomRarityObj.rarity;

  // 根据类型和稀有度生成物品
  return generateItemByTypeAndRarity(randomType, randomRarity);
}

/**
 * 根据权重随机选择
 */
function weightedRandom<T>(items: Array<T & { weight: number }>): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }

  return items[0]; // 默认返回第一个
}

/**
 * 根据类型和稀有度生成物品
 */
function generateItemByTypeAndRarity(itemType: ItemType, rarity: RewardRarity): RewardRecord {
  // 这里可以根据类型和稀有度从预定义的物品列表中选择
  // 简化版本，直接生成
  const itemNames: Record<ItemType, string[]> = {
    [ItemType.FOOD]: ['竹笋', '竹叶', '竹芽', '竹果', '竹糖'],
    [ItemType.TOY]: ['竹球', '竹环', '竹哑铃', '竹摇铃', '竹陀螺'],
    [ItemType.DECORATION]: ['竹帽', '竹围巾', '竹眼镜', '竹项链', '竹手镯'],
    [ItemType.SCROLL]: ['初级卷轴', '中级卷轴', '高级卷轴', '大师卷轴', '宗师卷轴'],
    [ItemType.POTION]: ['小型药水', '中型药水', '大型药水', '特效药水', '神奇药水']
  };

  const rarityDescriptions: Record<RewardRarity, string> = {
    [RewardRarity.COMMON]: '普通',
    [RewardRarity.UNCOMMON]: '不常见',
    [RewardRarity.RARE]: '稀有',
    [RewardRarity.EPIC]: '史诗',
    [RewardRarity.LEGENDARY]: '传说'
  };

  // 随机选择物品名称
  const names = itemNames[itemType];
  const name = names[Math.floor(Math.random() * names.length)];

  // 生成物品描述
  const description = `${rarityDescriptions[rarity]}的${name}`;

  // 生成图标路径
  const iconPath = `/assets/rewards/${itemType.toLowerCase()}_${rarity.toLowerCase()}.svg`;

  return {
    type: RewardType.ITEM,
    rarity,
    amount: 1,
    name,
    description,
    iconPath,
    obtainedAt: new Date(),
    isNew: true,
    isViewed: false
  };
}

/**
 * 保存奖励记录
 */
async function saveRewards(rewards: RewardRecord[]): Promise<void> {
  await db.table('rewards').bulkAdd(rewards);
}

/**
 * 获取未查看的奖励
 */
export async function getUnviewedRewards(): Promise<RewardRecord[]> {
  return db.table('rewards')
    .filter(reward => reward.isViewed === false)
    .toArray();
}

/**
 * 标记奖励为已查看
 */
export async function markRewardsAsViewed(rewardIds: number[]): Promise<void> {
  await Promise.all(
    rewardIds.map(id =>
      db.table('rewards')
        .update(id, { isViewed: true, isNew: false })
    )
  );
}

/**
 * 获取玩家的金币数量
 */
export async function getPlayerCoins(): Promise<number> {
  const coinRewards = await db.table('rewards')
    .where('type')
    .equals(RewardType.COIN)
    .toArray();

  return coinRewards.reduce((total, reward) => total + reward.amount, 0);
}

/**
 * 添加物品到用户库存
 * @param item 物品数据
 */
export async function addItem(item: Omit<ItemRecord, 'id'>): Promise<ItemRecord> {
  const id = await db.table('items').add(item);
  const newItem = { ...item, id: id as number };

  // 添加到同步队列
  await addSyncItem('items', 'create', newItem);

  return newItem;
}

/**
 * 生成指定数量和稀有度的奖励
 * @param count 奖励数量
 * @param rarity 奖励稀有度
 * @returns 生成的奖励列表
 */
export async function generateRewards(count: number, rarity: RewardRarity): Promise<RewardRecord[]> {
  const rewards: RewardRecord[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    // 随机选择物品类型
    const itemTypes = [
      { type: ItemType.FOOD, weight: 0.4 },
      { type: ItemType.TOY, weight: 0.3 },
      { type: ItemType.DECORATION, weight: 0.1 },
      { type: ItemType.SCROLL, weight: 0.1 },
      { type: ItemType.POTION, weight: 0.1 }
    ];

    // 根据权重随机选择物品类型
    const randomTypeObj = weightedRandom(itemTypes);
    const randomType = randomTypeObj.type;

    // 生成物品
    const reward = generateItemByTypeAndRarity(randomType, rarity);

    rewards.push({
      ...reward,
      obtainedAt: now,
      isNew: true,
      isViewed: false
    });
  }

  // 保存奖励记录
  await saveRewards(rewards);

  return rewards;
}

/**
 * 为挑战生成奖励
 * @param challenge 完成的挑战
 * @returns 生成的奖励列表
 */
export async function generateRewardsForChallenge(challenge: any): Promise<RewardRecord[]> {
  // 根据挑战难度决定奖励稀有度
  let rarity = RewardRarity.COMMON;

  if (challenge.difficulty === 'hard') {
    rarity = RewardRarity.RARE;
  } else if (challenge.difficulty === 'medium') {
    rarity = RewardRarity.UNCOMMON;
  } else if (challenge.difficulty === 'expert') {
    rarity = RewardRarity.EPIC;
  }

  // 生成2-4个奖励
  const count = 2 + Math.floor(Math.random() * 3);

  return generateRewards(count, rarity);
}
