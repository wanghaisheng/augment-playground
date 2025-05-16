// src/services/bambooTradingService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { BambooTradeRecord, TradeableResourceRecord, TradeRateRecord } from '@/db-old';
import { updateUserCurrency } from './storeService';
import { playSound, SoundType } from '@/utils/sound';
import { applyResourceMultiplier } from './resourceMultiplierService';
import { RewardType } from './rewardService';

/**
 * 竹子交易系统初始化
 */
export async function initializeBambooTrading(): Promise<void> {
  try {
    // 检查竹子交易相关表是否存在 (Dexie handles table creation via version().stores())
    // if (!(await db.tableExists('bambooTrades'))) {
    //   await db.createTable('bambooTrades');
    // }

    // if (!(await db.tableExists('tradeableResources'))) {
    //   await db.createTable('tradeableResources');
    // }

    // if (!(await db.tableExists('tradeRates'))) {
    //   await db.createTable('tradeRates');
    // }

    // 检查是否已经初始化可交易资源数据
    const resources = await db.table('tradeableResources').toArray();
    if (resources.length === 0) {
      // 添加默认可交易资源
      await db.table('tradeableResources').bulkAdd(DEFAULT_TRADEABLE_RESOURCES);

      // 添加默认交易汇率
      const defaultResources = await db.table('tradeableResources').toArray();
      const tradeRates: Omit<TradeRateRecord, 'id'>[] = [];

      for (const resource of defaultResources) {
        tradeRates.push({
          resourceId: resource.id!,
          bambooToResourceRate: getDefaultBambooToResourceRate(resource.type, resource.rarity),
          resourceToBambooRate: getDefaultResourceToBambooRate(resource.type, resource.rarity),
          minTradeAmount: 10,
          maxTradeAmount: 1000,
          dailyLimit: 500,
          isActive: true,
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await db.table('tradeRates').bulkAdd(tradeRates);
    }

    console.log('Bamboo trading system initialized');
  } catch (error) {
    console.error('Failed to initialize bamboo trading system:', error);
  }
}

/**
 * 默认可交易资源
 */
const DEFAULT_TRADEABLE_RESOURCES: Omit<TradeableResourceRecord, 'id'>[] = [
  {
    name: '金币',
    description: '通用货币，可用于购买商店物品',
    type: 'currency',
    rarity: 'common',
    imageUrl: '/assets/bamboo/resources/coins.svg',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '经验值',
    description: '提升熊猫等级的经验值',
    type: 'experience',
    rarity: 'common',
    imageUrl: '/assets/bamboo/resources/experience.svg',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '肥料',
    description: '用于提高竹子生长速度和产量',
    type: 'item',
    rarity: 'uncommon',
    imageUrl: '/assets/bamboo/resources/fertilizer.svg',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '幸运点',
    description: '用于抽奖的幸运点',
    type: 'currency',
    rarity: 'rare',
    imageUrl: '/assets/bamboo/resources/lucky_points.svg',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '玉石',
    description: '高级货币，可用于购买稀有物品',
    type: 'currency',
    rarity: 'epic',
    imageUrl: '/assets/bamboo/resources/jade.svg',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * 获取默认的竹子兑换资源汇率
 * @param type 资源类型
 * @param rarity 资源稀有度
 * @returns 汇率
 */
function getDefaultBambooToResourceRate(type: string, rarity: string): number {
  // 基础汇率
  let baseRate = 1;

  // 根据类型调整
  switch (type) {
    case 'currency':
      baseRate = 2;
      break;
    case 'experience':
      baseRate = 1;
      break;
    case 'item':
      baseRate = 5;
      break;
    default:
      baseRate = 1;
  }

  // 根据稀有度调整
  switch (rarity) {
    case 'common':
      return baseRate;
    case 'uncommon':
      return baseRate * 0.5;
    case 'rare':
      return baseRate * 0.2;
    case 'epic':
      return baseRate * 0.1;
    case 'legendary':
      return baseRate * 0.05;
    default:
      return baseRate;
  }
}

/**
 * 获取默认的资源兑换竹子汇率
 * @param type 资源类型
 * @param rarity 资源稀有度
 * @returns 汇率
 */
function getDefaultResourceToBambooRate(type: string, rarity: string): number {
  // 基础汇率
  let baseRate = 1;

  // 根据类型调整
  switch (type) {
    case 'currency':
      baseRate = 0.4;
      break;
    case 'experience':
      baseRate = 0.8;
      break;
    case 'item':
      baseRate = 0.15;
      break;
    default:
      baseRate = 0.5;
  }

  // 根据稀有度调整
  switch (rarity) {
    case 'common':
      return baseRate;
    case 'uncommon':
      return baseRate * 1.5;
    case 'rare':
      return baseRate * 4;
    case 'epic':
      return baseRate * 8;
    case 'legendary':
      return baseRate * 15;
    default:
      return baseRate;
  }
}

/**
 * 获取所有可交易资源
 * @returns 可交易资源列表
 */
export async function getTradeableResources(): Promise<TradeableResourceRecord[]> {
  try {
    // 确保交易系统已初始化
    await initializeBambooTrading();

    // 获取所有可交易资源
    return await db.tradeableResources
      .where('isAvailable')
      .equals(1)
      .toArray();
  } catch (error) {
    console.error('Failed to get tradeable resources:', error);
    return [];
  }
}

/**
 * 获取资源的交易汇率
 * @param resourceId 资源ID
 * @returns 交易汇率
 */
export async function getTradeRate(resourceId: number): Promise<TradeRateRecord | null> {
  try {
    // 获取资源的交易汇率
    const tradeRate = await db.tradeRates
      .where('resourceId')
      .equals(resourceId)
      .and(rate => rate.isActive === true)
      .first();

    return tradeRate || null;
  } catch (error) {
    console.error('Failed to get trade rate:', error);
    return null;
  }
}

/**
 * 获取所有激活的交易汇率
 * @returns 交易汇率列表
 */
export async function getAllActiveTradeRates(): Promise<TradeRateRecord[]> {
  try {
    return await db.tradeRates
      .where('isActive')
      .equals(1)
      .toArray();
  } catch (error) {
    console.error('Failed to get all active trade rates:', error);
    return [];
  }
}

/**
 * 获取用户的交易历史
 * @param userId 用户ID
 * @param limit 限制数量
 * @returns 交易历史
 */
export async function getTradeHistory(userId: string, limit: number = 10): Promise<BambooTradeRecord[]> {
  try {
    // 获取用户的交易历史
    return await db.table('bambooTrades')
      .where('userId')
      .equals(userId)
      .reverse()
      .limit(limit)
      .toArray();
  } catch (error) {
    console.error('Failed to get trade history:', error);
    return [];
  }
}

/**
 * 用竹子兑换资源
 * @param userId 用户ID
 * @param resourceId 资源ID
 * @param bambooAmount 竹子数量
 * @returns 获得的资源数量
 */
export async function tradeBambooForResource(
  userId: string,
  resourceId: number,
  bambooAmount: number
): Promise<number> {
  try {
    // 获取资源信息
    const resource = await db.table('tradeableResources').get(resourceId);
    if (!resource) {
      throw new Error(`Resource with id ${resourceId} not found`);
    }

    // 检查资源是否可交易
    if (!resource.isAvailable) {
      throw new Error('Resource is not available for trading');
    }

    // 获取交易汇率
    const tradeRate = await getTradeRate(resourceId);
    if (!tradeRate) {
      throw new Error('Trade rate not found');
    }

    // 检查交易数量是否在限制范围内
    if (bambooAmount < tradeRate.minTradeAmount) {
      throw new Error(`Minimum trade amount is ${tradeRate.minTradeAmount}`);
    }

    if (bambooAmount > tradeRate.maxTradeAmount) {
      throw new Error(`Maximum trade amount is ${tradeRate.maxTradeAmount}`);
    }

    // 检查用户今日交易量是否超过限制
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTrades = await db.table('bambooTrades')
      .where('userId')
      .equals(userId)
      .and(trade =>
        trade.resourceId === resourceId &&
        trade.tradeDirection === 'bamboo_to_resource' &&
        new Date(trade.tradeDate) >= today
      )
      .toArray();

    const todayTradedAmount = todayTrades.reduce((sum, trade) => sum + trade.bambooAmount, 0);

    if (todayTradedAmount + bambooAmount > tradeRate.dailyLimit) {
      throw new Error(`Daily trade limit is ${tradeRate.dailyLimit}`);
    }

    // 检查用户竹子数量是否足够
    const userCurrency = await db.userCurrencies.where('userId').equals(userId).first();
    if (!userCurrency || userCurrency.bamboo < bambooAmount) {
      throw new Error('Bamboo insufficient');
    }

    // 计算可兑换的资源数量
    let resourceAmount = Math.floor(bambooAmount / tradeRate.bambooToResourceRate);

    // 应用资源加成
    resourceAmount = await applyResourceMultiplier(resource.type as RewardType, resourceAmount);

    // 扣除用户竹子
    await updateUserCurrency(userId, -bambooAmount, 0);

    // 增加用户资源 (这里需要根据resource.type来调用不同的更新方法)
    // 这是一个简化示例，实际应用中可能需要更复杂的逻辑
    switch (resource.type) {
      case 'currency':
        await updateUserCurrency(userId, 0, resourceAmount, resource.name);
        break;
      case 'experience':
        console.warn(`Experience gain of ${resourceAmount} for user ${userId} not implemented yet in tradeBambooForResource.`);
        break;
      case 'item':
        console.warn(`Item gain for resource ID ${resource.id} (amount: ${resourceAmount}) for user ${userId} not implemented yet in tradeBambooForResource.`);
        break;
      default:
        console.warn(`Unsupported resource type for trading: ${resource.type}`);
        return 0;
    }

    // 记录交易
    const tradeRecord: Omit<BambooTradeRecord, 'id'> = {
      userId,
      resourceId,
      bambooAmount,
      resourceAmount,
      tradeDirection: 'bamboo_to_resource',
      tradeRate: tradeRate.bambooToResourceRate,
      tradeDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const id = await db.bambooTrades.add(tradeRecord);
    await addSyncItem('bambooTrades', 'create', { ...tradeRecord, id: id as number });

    // 播放交易成功音效
    playSound(SoundType.REWARD_COMMON, 0.5);

    return resourceAmount;
  } catch (error) {
    console.error('Failed to trade bamboo for resource:', error);
    return 0;
  }
}

/**
 * 用资源兑换竹子
 * @param userId 用户ID
 * @param resourceId 资源ID
 * @param resourceAmount 资源数量
 * @returns 兑换的竹子数量
 */
export async function tradeResourceForBamboo(
  userId: string,
  resourceId: number,
  resourceAmount: number
): Promise<number> {
  try {
    // 获取资源信息
    const resource = await db.table('tradeableResources').get(resourceId);
    if (!resource) {
      throw new Error(`Resource with id ${resourceId} not found`);
    }

    // 检查资源是否可交易
    if (!resource.isAvailable) {
      throw new Error('Resource is not available for trading');
    }

    // 获取交易汇率
    const tradeRate = await getTradeRate(resourceId);
    if (!tradeRate) {
      throw new Error('Trade rate not found');
    }

    // 检查用户资源数量是否足够 (这里需要根据resource.type来调用不同的检查方法)
    // 这是一个简化示例
    switch (resource.type) {
      case 'currency':
        const userCurrency = await db.userCurrencies.where('userId').equals(userId).first();
        // Assuming other currencies are stored in a flexible way or need specific checks
        if (!userCurrency) throw new Error('User currency data not found.');
        // This part needs to be adapted based on how 'other' currencies are stored in UserCurrencyRecord
        // For now, let's assume a generic check or that it's handled by the currency update logic if it fails
        // if (userCurrency[resource.name] < resourceAmount) throw new Error(`${resource.name} insufficient`);
        break;
      case 'experience':
        // No direct "spending" of experience typically, this might be an invalid trade direction or require specific logic
        throw new Error('Trading experience for bamboo is not supported.');
      case 'item':
        // const userItemCount = await getItemCount(userId, resource.id); // Assuming an getItemCount function exists
        // if (userItemCount < resourceAmount) throw new Error('Item insufficient');
        console.warn(`Item quantity check for resource ID ${resource.id} for user ${userId} not implemented yet in tradeResourceForBamboo.`);
        break;
      default:
        console.warn(`Unsupported resource type for trading: ${resource.type}`);
        return 0;
    }

    // 计算可兑换的竹子数量
    let bambooAmount = Math.floor(resourceAmount * tradeRate.resourceToBambooRate);

    // 应用资源加成 (竹子本身是否也受加成？通常是对获得的资源加成)
    // For now, let's assume the bamboo received is also subject to multipliers like VIP bonus for bamboo.
    bambooAmount = await applyResourceMultiplier(RewardType.COIN, bambooAmount); // Assuming bamboo is COIN, remove userId

    // 扣除用户资源
    switch (resource.type) {
      case 'currency':
        await updateUserCurrency(userId, 0, -resourceAmount, resource.name); // Example for spending other currency
        break;
      // item deduction would go here
      default:
        // Already handled above or by throwing error
        break;
    }
    
    // 增加用户竹子
    await updateUserCurrency(userId, bambooAmount, 0);

    // 记录交易
    const tradeRecord: Omit<BambooTradeRecord, 'id'> = {
      userId,
      resourceId,
      bambooAmount,
      resourceAmount,
      tradeDirection: 'resource_to_bamboo',
      tradeRate: tradeRate.resourceToBambooRate,
      tradeDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const id = await db.bambooTrades.add(tradeRecord);
    await addSyncItem('bambooTrades', 'create', { ...tradeRecord, id: id as number });
    
    // 播放交易成功音效
    playSound(SoundType.REWARD_COMMON, 0.5);

    return bambooAmount;
  } catch (error) {
    console.error('Failed to trade resource for bamboo:', error);
    return 0;
  }
}
