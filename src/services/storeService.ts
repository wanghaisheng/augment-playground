// src/services/storeService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { /* ItemRecord, */ addItem, RewardRarity, ItemType } from './rewardService';
import { updateVipTitleStatus } from './userTitleService';

// Re-export RewardRarity so other modules can import it via storeService
export { RewardRarity };

// 商店物品类型
export enum StoreItemType {
  AVATAR = 'avatar',           // 熊猫头像
  ACCESSORY = 'accessory',     // 熊猫配件
  BACKGROUND = 'background',   // 背景
  THEME = 'theme',             // 主题
  ABILITY = 'ability',         // 能力
  CONSUMABLE = 'consumable',   // 消耗品
  VIP = 'vip'                  // VIP会员
}

// 商店物品价格类型
export enum PriceType {
  COINS = 'coins',             // 游戏内货币
  JADE = 'jade',               // 高级货币
  REAL_MONEY = 'real_money'    // 真实货币
}

// 商店物品记录类型
export interface StoreItemRecord {
  id?: number;
  name: string;
  description: string;
  type: StoreItemType;
  rarity: RewardRarity;
  price: number;
  priceType: PriceType;
  imagePath: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  salePrice?: number;
  saleEndDate?: Date;
  categoryId: number;
  createdAt: Date;
  updatedAt?: Date;
  vipRequired?: boolean;
  limitedQuantity?: number;
  remainingQuantity?: number;
  tags?: string[];
}

// 商店类别记录类型
export interface StoreCategoryRecord {
  id?: number;
  name: string;
  description: string;
  iconPath: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// 购买记录类型
export interface PurchaseRecord {
  id?: number;
  userId: string;
  storeItemId: number;
  price: number;
  priceType: PriceType;
  purchaseDate: Date;
  transactionId?: string;
  isRefunded: boolean;
  refundDate?: Date;
}

// VIP订阅记录类型
export interface VipSubscriptionRecord {
  id?: number;
  userId: string;
  tier: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  autoRenew: boolean;
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// 用户货币记录类型
export interface UserCurrencyRecord {
  id?: number;
  userId: string;
  coins: number;
  jade: number;
  gem: number;
  bamboo: number;
  lastUpdated: Date;
}

/**
 * 获取所有商店类别
 */
export async function getStoreCategories(): Promise<StoreCategoryRecord[]> {
  return db.table('storeCategories')
    .filter(category => category.isVisible === true)
    .sortBy('order');
}

/**
 * 获取商店类别
 * @param id 类别ID
 */
export async function getStoreCategory(id: number): Promise<StoreCategoryRecord | undefined> {
  return db.table('storeCategories').get(id);
}

/**
 * 获取商店物品
 * @param id 物品ID
 */
export async function getStoreItem(id: number): Promise<StoreItemRecord | undefined> {
  return db.table('storeItems').get(id);
}

/**
 * 获取类别的商店物品
 * @param categoryId 类别ID
 */
export async function getCategoryItems(categoryId: number): Promise<StoreItemRecord[]> {
  return db.table('storeItems')
    .where('categoryId')
    .equals(categoryId)
    .and(item => item.isAvailable)
    .toArray();
}

/**
 * 获取特色商店物品
 */
export async function getFeaturedItems(): Promise<StoreItemRecord[]> {
  return db.table('storeItems')
    .filter(item => item.isFeatured === true && item.isAvailable === true)
    .toArray();
}

/**
 * 获取促销商店物品
 */
export async function getSaleItems(): Promise<StoreItemRecord[]> {
  const now = new Date();
  return db.table('storeItems')
    .filter(item =>
      item.isOnSale === true &&
      item.isAvailable === true &&
      (!item.saleEndDate || new Date(item.saleEndDate) > now)
    )
    .toArray();
}

/**
 * 获取VIP专属商店物品
 */
export async function getVipItems(): Promise<StoreItemRecord[]> {
  return db.table('storeItems')
    .filter(item => item.vipRequired === true && item.isAvailable === true)
    .toArray();
}

/**
 * 获取用户货币
 * @param userId 用户ID
 */
export async function getUserCurrency(userId: string): Promise<UserCurrencyRecord | null> {
  const currency = await db.table('userCurrencies')
    .where('userId')
    .equals(userId)
    .first();

  if (!currency) {
    // 如果用户没有货币记录，创建一个新的
    const newCurrency: UserCurrencyRecord = {
      userId,
      coins: 0,
      jade: 0,
      gem: 0,
      bamboo: 0,
      lastUpdated: new Date()
    };

    const id = await db.table('userCurrencies').add(newCurrency);
    return { ...newCurrency, id: id as number };
  }

  return currency;
}

/**
 * 更新用户货币
 * @param userId 用户ID
 * @param coins 金币数量变化（可以是正数或负数）
 * @param jade 玉石数量变化（可以是正数或负数）
 * @param bamboo 竹子数量变化（可以是正数或负数）
 */
export async function updateUserCurrency(
  userId: string,
  coins: number = 0,
  jade: number = 0,
  bamboo: number = 0
): Promise<UserCurrencyRecord> {
  const currency = await getUserCurrency(userId);
  if (!currency) {
    throw new Error(`User currency not found for user ${userId}`);
  }

  const updatedCurrency: UserCurrencyRecord = {
    ...currency,
    coins: Math.max(0, currency.coins + coins),
    jade: Math.max(0, currency.jade + jade),
    gem: Math.max(0, currency.gem + 0),
    bamboo: Math.max(0, currency.bamboo + bamboo),
    lastUpdated: new Date()
  };

  // 更新数据库
  await db.table('userCurrencies').update(currency.id!, updatedCurrency);

  // 添加到同步队列
  await addSyncItem('userCurrencies', 'update', updatedCurrency);

  return updatedCurrency;
}

/**
 * 购买商店物品
 * @param userId 用户ID
 * @param storeItemId 商店物品ID
 */
export async function purchaseStoreItem(
  userId: string,
  storeItemId: number
): Promise<PurchaseRecord> {
  // 获取商店物品
  const storeItem = await getStoreItem(storeItemId);
  if (!storeItem) {
    throw new Error(`Store item with id ${storeItemId} not found`);
  }

  // 检查物品是否可用
  if (!storeItem.isAvailable) {
    throw new Error(`Store item ${storeItem.name} is not available for purchase`);
  }

  // 检查是否有足够数量（如果有限量）
  if (storeItem.limitedQuantity && (storeItem.remainingQuantity || 0) <= 0) {
    throw new Error(`Store item ${storeItem.name} is out of stock`);
  }

  // 获取用户货币
  const userCurrency = await getUserCurrency(userId);
  if (!userCurrency) {
    throw new Error(`User currency not found for user ${userId}`);
  }

  // 计算价格
  const price = storeItem.isOnSale && storeItem.salePrice !== undefined ? storeItem.salePrice : storeItem.price;

  // 检查用户是否有足够的货币
  if (storeItem.priceType === PriceType.COINS && userCurrency.coins < price) {
    throw new Error('Insufficient coins');
  } else if (storeItem.priceType === PriceType.JADE && userCurrency.jade < price) {
    throw new Error('Insufficient jade');
  }
  // TODO: Handle PriceType.REAL_MONEY

  // 扣除货币
  if (storeItem.priceType === PriceType.COINS) {
    await updateUserCurrency(userId, -price, 0, 0);
  } else if (storeItem.priceType === PriceType.JADE) {
    await updateUserCurrency(userId, 0, -price, 0);
  }

  // 更新物品剩余数量（如果有限量）
  if (storeItem.limitedQuantity && storeItem.remainingQuantity !== undefined) {
    const updatedStoreItem = { ...storeItem, remainingQuantity: storeItem.remainingQuantity - 1 };
    await db.table('storeItems').update(storeItem.id!, updatedStoreItem);
    await addSyncItem('storeItems', 'update', updatedStoreItem);
  }

  // 根据物品类型执行操作
  switch (storeItem.type) {
    case StoreItemType.VIP:
      // 假设VIP购买会激活一个特定等级和时长的订阅
      // TODO: 需要从storeItem中获取tier和durationDays，或者有默认值
      await activateVipSubscription(userId, 1, 30, 'store_purchase', `vip-purchase-${Date.now()}`);
      break;
    case StoreItemType.ABILITY:
      // TODO: 实现激活能力的逻辑
      // Example: await unlockAbility(userId, storeItem.relatedAbilityId);
      console.log(`Ability ${storeItem.name} purchased, activation logic TBD.`);
      break;
    case StoreItemType.AVATAR:
    case StoreItemType.ACCESSORY:
    case StoreItemType.BACKGROUND:
    case StoreItemType.THEME:
      // TODO: 实现应用皮肤/主题的逻辑
      // Example: await applyCosmetic(userId, storeItem.id, storeItem.type);
      console.log(`Cosmetic item ${storeItem.name} purchased, application logic TBD.`);
      break;
    case StoreItemType.CONSUMABLE:
      // 将消耗品添加到用户物品列表
      // TODO: 需要一个正确的映射 StoreItemType.CONSUMABLE -> ItemType
      // 以及确定消耗品的具体效果描述等。
      // 使用 ItemType.FOOD 作为临时占位符以通过类型检查。
      // 同样，name, description, iconPath, isUsable 应该从 storeItem 传递。
      await addItem({
        type: ItemType.FOOD, // Placeholder: Needs mapping from StoreItemType
        name: storeItem.name,
        description: storeItem.description,
        rarity: storeItem.rarity, // Now using RewardRarity, should be compatible
        iconPath: storeItem.imagePath,
        quantity: 1, // Assuming 1 item purchased, might need quantity from storeItem
        isUsable: true, // Assuming consumables are usable, might depend on item
        // effectDescription: storeItem.effectDescription, // If storeItem has this
        obtainedAt: new Date(),
      });
      break;
  }

  // 创建购买记录
  const purchaseRecord: Omit<PurchaseRecord, 'id'> = {
    userId,
    storeItemId: storeItem.id!,
    price,
    priceType: storeItem.priceType,
    purchaseDate: new Date(),
    isRefunded: false
  };

  const id = await db.table('purchases').add(purchaseRecord);
  const createdPurchaseRecord = { ...purchaseRecord, id: id as number };

  // 添加到同步队列
  await addSyncItem('purchases', 'create', createdPurchaseRecord);

  return createdPurchaseRecord;
}

/**
 * 获取用户的VIP订阅
 * @param userId 用户ID
 */
export async function getUserVipSubscription(userId: string): Promise<VipSubscriptionRecord | null> {
  return db.table('vipSubscriptions')
    .where('userId')
    .equals(userId)
    .and(sub => sub.isActive)
    .first();
}

/**
 * 检查用户是否是VIP
 * @param userId 用户ID
 */
export async function isUserVip(userId: string): Promise<boolean> {
  // First check the panda state for VIP status
  const pandaState = await db.table('pandaState').toArray();
  if (pandaState.length > 0 && pandaState[0].isVip) {
    return true;
  }

  // If not found in panda state, check subscription
  const subscription = await getUserVipSubscription(userId);
  if (!subscription) {
    return false;
  }

  // 检查订阅是否过期
  if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
    // 更新订阅状态
    await db.table('vipSubscriptions').update(subscription.id!, {
      ...subscription,
      isActive: false,
      updatedAt: new Date()
    });
    return false;
  }

  // If subscription is valid, update panda state
  if (pandaState.length > 0) {
    await db.table('pandaState').update(pandaState[0].id!, {
      ...pandaState[0],
      isVip: true,
      lastUpdated: new Date()
    });
  }

  return true;
}

/**
 * 激活VIP试用
 * @param userId 用户ID
 * @param durationDays 试用时长（天）
 */
export async function activateVipTrial(
  userId: string,
  durationDays: number
): Promise<VipSubscriptionRecord> {
  return activateVipSubscription(userId, 1, durationDays, 'trial', `trial-${Date.now()}`);
}

/**
 * 激活VIP订阅
 * @param userId 用户ID
 * @param tier VIP等级
 * @param durationDays 订阅时长（天）
 * @param paymentMethod 支付方式
 * @param transactionId 交易ID
 */
export async function activateVipSubscription(
  userId: string,
  tier: number,
  durationDays: number,
  paymentMethod: string,
  transactionId?: string
): Promise<VipSubscriptionRecord> {
  // 检查用户是否已经有VIP订阅
  const existingSubscription = await getUserVipSubscription(userId);

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + durationDays);

  if (existingSubscription) {
    // 如果已经有订阅，延长订阅时间
    const updatedSubscription: VipSubscriptionRecord = {
      ...existingSubscription,
      tier: Math.max(existingSubscription.tier, tier), // 使用更高的等级
      endDate: existingSubscription.endDate && new Date(existingSubscription.endDate) > now
        ? new Date(new Date(existingSubscription.endDate).getTime() + durationDays * 24 * 60 * 60 * 1000)
        : endDate,
      isActive: true,
      updatedAt: now
    };

    // 更新数据库
    await db.table('vipSubscriptions').update(existingSubscription.id!, updatedSubscription);

    // 添加到同步队列
    await addSyncItem('vipSubscriptions', 'update', updatedSubscription);

    // Update panda state
    const pandaState = await db.table('pandaState').toArray();
    if (pandaState.length > 0) {
      await db.table('pandaState').update(pandaState[0].id!, {
        ...pandaState[0],
        isVip: true,
        lastUpdated: new Date()
      });

      // Add to sync queue
      await addSyncItem('pandaState', 'update', {
        ...pandaState[0],
        isVip: true,
        lastUpdated: new Date()
      });
    }

    // Update VIP title status
    await updateVipTitleStatus(userId, true);

    return updatedSubscription;
  } else {
    // 创建新的订阅
    const newSubscription: VipSubscriptionRecord = {
      userId,
      tier,
      startDate: now,
      endDate,
      isActive: true,
      autoRenew: false,
      paymentMethod,
      transactionId,
      createdAt: now,
      updatedAt: now
    };

    // 添加到数据库
    const id = await db.table('vipSubscriptions').add(newSubscription);
    const createdSubscription = { ...newSubscription, id: id as number };

    // 添加到同步队列
    await addSyncItem('vipSubscriptions', 'create', createdSubscription);

    // Update panda state
    const pandaState = await db.table('pandaState').toArray();
    if (pandaState.length > 0) {
      await db.table('pandaState').update(pandaState[0].id!, {
        ...pandaState[0],
        isVip: true,
        lastUpdated: new Date()
      });

      // Add to sync queue
      await addSyncItem('pandaState', 'update', {
        ...pandaState[0],
        isVip: true,
        lastUpdated: new Date()
      });
    }

    // Update VIP title status
    await updateVipTitleStatus(userId, true);

    return createdSubscription;
  }
}

/**
 * 更新VIP订阅详情
 * @param userId 用户ID
 * @param subscriptionId 订阅ID
 * @param updates 要更新的字段
 */
export async function updateVipSubscriptionDetails(
  subscriptionId: number,
  updates: Partial<Omit<VipSubscriptionRecord, 'id' | 'userId' | 'createdAt'>>
): Promise<VipSubscriptionRecord | null> {
  const subscription = await db.table('vipSubscriptions').get(subscriptionId);
  if (!subscription) {
    console.error(`VipSubscriptionRecord with id ${subscriptionId} not found.`);
    return null;
  }

  const now = new Date();
  const updatedSubscription: VipSubscriptionRecord = {
    ...subscription,
    ...updates,
    updatedAt: now,
  };

  await db.table('vipSubscriptions').update(subscriptionId, updatedSubscription);
  await addSyncItem('vipSubscriptions', 'update', updatedSubscription);

  // If isActive state changed, update panda state and VIP title
  if (updates.isActive !== undefined && updates.isActive !== subscription.isActive) {
    const pandaStateArray = await db.table('pandaState').where('userId').equals(subscription.userId).toArray();
    if (pandaStateArray.length > 0) {
      const pandaState = pandaStateArray[0];
      await db.table('pandaState').update(pandaState.id!, {
        ...pandaState,
        isVip: updatedSubscription.isActive,
        lastUpdated: now,
      });
      await addSyncItem('pandaState', 'update', {
        ...pandaState,
        isVip: updatedSubscription.isActive,
        lastUpdated: now,
      });
    }
    await updateVipTitleStatus(subscription.userId, updatedSubscription.isActive);
  }

  return updatedSubscription;
}
