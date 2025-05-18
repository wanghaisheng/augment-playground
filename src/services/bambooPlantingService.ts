// src/services/bambooPlantingService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { BambooPlotRecord, BambooSeedRecord, BambooPlantRecord } from '@/db-old';
import { updateUserCurrency } from './storeService';
import { playSound, SoundType } from '@/utils/sound';
import { applyResourceMultiplier } from './resourceMultiplierService';
import { addPandaExperience } from './pandaStateService';
import { RewardType } from '@/services/rewardService';
// import { initializeBambooPlantingLabels } from '@/data/bambooPlantingLabels'; // Temporarily commented out - file missing

/**
 * 竹子种植系统初始化
 */
export async function initializeBambooPlanting(): Promise<void> {
  try {
    // 检查竹子种植相关表是否存在
    // if (!(await db.tableExists('bambooPlots'))) {
    //   await db.createTable('bambooPlots');
    // }
    // if (!(await db.tableExists('bambooSeeds'))) {
    //   await db.createTable('bambooSeeds');
    // }
    // if (!(await db.tableExists('bambooPlants'))) {
    //   await db.createTable('bambooPlants');
    // }

    // 检查是否已经初始化种子数据
    const seeds = await db.bambooSeeds.toArray();
    if (seeds.length === 0) {
      // 添加默认种子
      await db.bambooSeeds.bulkAdd(DEFAULT_BAMBOO_SEEDS.map(s => ({...s, createdAt: new Date(), updatedAt: new Date()})));
    }

    console.log('Bamboo planting system initialized');
  } catch (error) {
    console.error('Failed to initialize bamboo planting system:', error);
  }
}

/**
 * 初始化用户的竹子种植地块
 * @param userId 用户ID
 */
export async function initializeUserPlots(userId: string): Promise<void> {
  try {
    // 检查用户是否已有地块
    const existingPlots = await db.bambooPlots.where('userId').equals(userId).toArray();

    if (existingPlots.length > 0) {
      return; // 用户已有地块，不需要初始化
    }

    // 创建初始地块
    const initialPlot: Omit<BambooPlotRecord, 'id'> = {
      userId,
      name: '初始竹园',
      level: 1,
      size: 4, // 初始可种植4株竹子
      fertility: 50,
      moisture: 50,
      sunlight: 50,
      isUnlocked: true,
      unlockCost: 0, // 初始地块免费
      upgradeCost: 100, // 升级到2级需要100竹子
      maxPlants: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 添加到数据库
    const id = await db.bambooPlots.add(initialPlot);

    // 添加同步项目
    await addSyncItem('bambooPlots', 'create', { ...initialPlot, id });

    // 创建高级地块（未解锁）
    const advancedPlot: Omit<BambooPlotRecord, 'id'> = {
      userId,
      name: '高级竹园',
      level: 1,
      size: 6, // 可种植6株竹子
      fertility: 60,
      moisture: 60,
      sunlight: 60,
      isUnlocked: false,
      unlockCost: 500, // 解锁需要500竹子
      upgradeCost: 200,
      maxPlants: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 添加到数据库
    const advancedId = await db.bambooPlots.add(advancedPlot);

    // 添加同步项目
    await addSyncItem('bambooPlots', 'create', { ...advancedPlot, id: advancedId });

    // 创建稀有地块（未解锁）
    const rarePlot: Omit<BambooPlotRecord, 'id'> = {
      userId,
      name: '稀有竹园',
      level: 1,
      size: 8, // 可种植8株竹子
      fertility: 70,
      moisture: 70,
      sunlight: 70,
      isUnlocked: false,
      unlockCost: 1000, // 解锁需要1000竹子
      upgradeCost: 300,
      maxPlants: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 添加到数据库
    const rareId = await db.bambooPlots.add(rarePlot);

    // 添加同步项目
    await addSyncItem('bambooPlots', 'create', { ...rarePlot, id: rareId });
  } catch (error) {
    console.error('Failed to initialize user plots:', error);
  }
}

/**
 * 默认竹子种子
 */
const DEFAULT_BAMBOO_SEEDS: Omit<BambooSeedRecord, 'id'>[] = [
  {
    name: '普通竹种',
    description: '最常见的竹子种子，生长速度适中',
    rarity: 'common',
    growthTime: 4, // 4小时
    waterNeeds: 50,
    sunlightNeeds: 50,
    fertilityNeeds: 50,
    yieldMin: 10,
    yieldMax: 20,
    imageUrl: '/assets/bamboo/seeds/common_seed.svg',
    isUnlocked: true,
    unlockCost: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '优质竹种',
    description: '品质较好的竹子种子，产量更高',
    rarity: 'uncommon',
    growthTime: 8, // 8小时
    waterNeeds: 60,
    sunlightNeeds: 60,
    fertilityNeeds: 60,
    yieldMin: 20,
    yieldMax: 40,
    imageUrl: '/assets/bamboo/seeds/uncommon_seed.svg',
    isUnlocked: false,
    unlockCost: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '稀有竹种',
    description: '稀有的竹子种子，产量丰富',
    rarity: 'rare',
    growthTime: 12, // 12小时
    waterNeeds: 70,
    sunlightNeeds: 70,
    fertilityNeeds: 70,
    yieldMin: 40,
    yieldMax: 80,
    imageUrl: '/assets/bamboo/seeds/rare_seed.svg',
    isUnlocked: false,
    unlockCost: 300,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '史诗竹种',
    description: '极为珍贵的竹子种子，产量极高',
    rarity: 'epic',
    growthTime: 24, // 24小时
    waterNeeds: 80,
    sunlightNeeds: 80,
    fertilityNeeds: 80,
    yieldMin: 80,
    yieldMax: 150,
    imageUrl: '/assets/bamboo/seeds/epic_seed.svg',
    isUnlocked: false,
    unlockCost: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '传说竹种',
    description: '传说中的竹子种子，产量惊人',
    rarity: 'legendary',
    growthTime: 48, // 48小时
    waterNeeds: 90,
    sunlightNeeds: 90,
    fertilityNeeds: 90,
    yieldMin: 150,
    yieldMax: 300,
    imageUrl: '/assets/bamboo/seeds/legendary_seed.svg',
    isUnlocked: false,
    unlockCost: 1000,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * 获取所有竹子种植地块
 * @param userId 用户ID
 * @returns 地块列表
 */
export async function getAllPlots(userId: string): Promise<BambooPlotRecord[]> {
  try {
    // 确保用户地块已初始化
    await initializeUserPlots(userId);

    // 获取用户地块
    return await db.bambooPlots.where('userId').equals(userId).toArray();
  } catch (error) {
    console.error('Failed to get all plots:', error);
    return [];
  }
}

/**
 * 获取所有竹子种子
 * @returns 种子列表
 */
export async function getAllSeeds(): Promise<BambooSeedRecord[]> {
  try {
    // 确保种子已初始化
    await initializeBambooPlanting();

    // 获取所有种子
    return await db.bambooSeeds.toArray();
  } catch (error) {
    console.error('Failed to get all seeds:', error);
    return [];
  }
}

/**
 * 获取用户已解锁的竹子种子
 * @returns 已解锁的种子列表
 */
export async function getUnlockedSeeds(): Promise<BambooSeedRecord[]> {
  try {
    // 获取所有种子
    const seeds = await getAllSeeds();

    // 过滤出已解锁的种子
    return seeds.filter(seed => seed.isUnlocked);
  } catch (error) {
    console.error('Failed to get unlocked seeds:', error);
    return [];
  }
}

/**
 * 解锁竹子种子
 * @param userId 用户ID
 * @param seedId 种子ID
 * @returns 是否成功解锁
 */
export async function unlockSeed(userId: string, seedId: number): Promise<boolean> {
  try {
    // 获取种子信息
    const seed = await db.bambooSeeds.get(seedId);
    if (!seed) {
      throw new Error(`Seed with id ${seedId} not found`);
    }

    // 检查种子是否已解锁
    if (seed.isUnlocked) {
      return true; // 已经解锁，直接返回成功
    }

    // 检查用户竹子数量是否足够
    const userCurrency = await db.userCurrencies.where('userId').equals(userId).first();

    if (!userCurrency || userCurrency.bamboo < seed.unlockCost) {
      return false; // 竹子不足，无法解锁
    }

    // 扣除竹子
    await updateUserCurrency(userId, -seed.unlockCost, 0);

    // 更新种子状态
    const updatedSeed = {
      ...seed,
      isUnlocked: true,
      updatedAt: new Date()
    };

    // 更新数据库
    await db.bambooSeeds.update(seedId, updatedSeed);

    // 添加同步项目
    await addSyncItem('bambooSeeds', 'update', updatedSeed);

    // 播放解锁音效
    playSound(SoundType.CHALLENGE_UNLOCKED, 0.5);

    return true;
  } catch (error) {
    console.error('Failed to unlock seed:', error);
    return false;
  }
}

/**
 * 解锁竹子种植地块
 * @param userId 用户ID
 * @param plotId 地块ID
 * @returns 是否成功解锁
 */
export async function unlockPlot(userId: string, plotId: number): Promise<boolean> {
  try {
    // 获取地块信息
    const plot = await db.bambooPlots.get(plotId);
    if (!plot) {
      throw new Error(`Plot with id ${plotId} not found`);
    }

    // 检查地块是否已解锁
    if (plot.isUnlocked) {
      return true; // 已经解锁，直接返回成功
    }

    // 检查用户竹子数量是否足够
    const userCurrency = await db.userCurrencies.where('userId').equals(userId).first();

    if (!userCurrency || userCurrency.bamboo < plot.unlockCost) {
      return false; // 竹子不足，无法解锁
    }

    // 扣除竹子
    await updateUserCurrency(userId, -plot.unlockCost, 0);

    // 更新地块状态
    const updatedPlot = {
      ...plot,
      isUnlocked: true,
      updatedAt: new Date()
    };

    // 更新数据库
    await db.bambooPlots.update(plotId, updatedPlot);

    // 添加同步项目
    await addSyncItem('bambooPlots', 'update', updatedPlot);

    // 播放解锁音效
    playSound(SoundType.CHALLENGE_UNLOCKED, 0.5);

    return true;
  } catch (error) {
    console.error('Failed to unlock plot:', error);
    return false;
  }
}

/**
 * 升级竹子种植地块
 * @param userId 用户ID
 * @param plotId 地块ID
 * @returns 是否成功升级
 */
export async function upgradePlot(userId: string, plotId: number): Promise<boolean> {
  try {
    // 获取地块信息
    const plot = await db.bambooPlots.get(plotId);
    if (!plot) {
      throw new Error(`Plot with id ${plotId} not found`);
    }

    // 检查地块是否已解锁
    if (!plot.isUnlocked) {
      return false; // 地块未解锁，无法升级
    }

    // 检查用户竹子数量是否足够
    const userCurrency = await db.userCurrencies.where('userId').equals(userId).first();

    if (!userCurrency || userCurrency.bamboo < plot.upgradeCost) {
      return false; // 竹子不足，无法升级
    }

    // 扣除竹子
    await updateUserCurrency(userId, -plot.upgradeCost, 0);

    // 更新地块状态
    const newLevel = plot.level + 1;
    const updatedPlot = {
      ...plot,
      level: newLevel,
      size: plot.size + 2, // 每升一级增加2个种植位
      fertility: Math.min(100, plot.fertility + 5), // 每升一级增加5点肥力，最高100
      moisture: Math.min(100, plot.moisture + 5), // 每升一级增加5点水分，最高100
      sunlight: Math.min(100, plot.sunlight + 5), // 每升一级增加5点光照，最高100
      maxPlants: plot.maxPlants + 2, // 每升一级增加2个种植位
      upgradeCost: Math.floor(plot.upgradeCost * 1.5), // 下一级升级费用增加50%
      updatedAt: new Date()
    };

    // 更新数据库
    await db.bambooPlots.update(plotId, updatedPlot);

    // 添加同步项目
    await addSyncItem('bambooPlots', 'update', updatedPlot);

    // 播放升级音效
    playSound(SoundType.LEVEL_UP, 0.5);

    return true;
  } catch (error) {
    console.error('Failed to upgrade plot:', error);
    return false;
  }
}

/**
 * 种植竹子
 * @param userId 用户ID
 * @param plotId 地块ID
 * @param seedId 种子ID
 * @returns 种植的竹子记录
 */
export async function plantBamboo(
  userId: string,
  plotId: number,
  seedId: number
): Promise<BambooPlantRecord | null> {
  try {
    // 获取地块信息
    const plot = await db.bambooPlots.get(plotId);
    if (!plot) {
      throw new Error(`Plot with id ${plotId} not found`);
    }

    // 检查地块是否已解锁
    if (!plot.isUnlocked) {
      throw new Error('Plot is not unlocked');
    }

    // 获取种子信息
    const seed = await db.bambooSeeds.get(seedId);
    if (!seed) {
      throw new Error(`Seed with id ${seedId} not found`);
    }

    // 检查种子是否已解锁
    if (!seed.isUnlocked) {
      throw new Error('Seed is not unlocked');
    }

    // 检查地块是否已满
    const existingPlants = await db.bambooPlants.where('[userId+plotId]').equals([userId, plotId]).filter(plant => !plant.harvestedAt).toArray();

    if (existingPlants.length >= plot.maxPlants) {
      throw new Error('Plot is full');
    }

    // 计算预期产量
    const plotQuality = (plot.fertility + plot.moisture + plot.sunlight) / 300; // 0-1之间的值
    const baseYield = Math.floor(seed.yieldMin + Math.random() * (seed.yieldMax - seed.yieldMin));
    const expectedYield = Math.floor(baseYield * (1 + plotQuality));

    // 创建竹子植物记录
    const now = new Date();
    const bambooPlant: Omit<BambooPlantRecord, 'id'> = {
      userId,
      plotId,
      seedId,
      plantedAt: now,
      growthStage: 0, // 初始生长阶段
      growthProgress: 0, // 初始生长进度
      health: 100, // 初始健康度
      fertility: plot.fertility, // Initialize with plot's fertility
      isWatered: true, // 种植时自动浇水
      lastWateredAt: now,
      isFertilized: false, // 初始未施肥
      lastFertilizedAt: null,
      isHarvestable: false, // 初始不可收获
      harvestedAt: null,
      expectedYield,
      createdAt: now,
      updatedAt: now
    };

    // 添加到数据库
    const id = await db.bambooPlants.add(bambooPlant);
    const createdPlant = { ...bambooPlant, id: id as number };

    // 添加同步项目
    await addSyncItem('bambooPlants', 'create', createdPlant);

    // 播放种植音效
    playSound(SoundType.BAMBOO_COLLECT, 0.5);

    return createdPlant;
  } catch (error) {
    console.error('Failed to plant bamboo:', error);
    return null;
  }
}

/**
 * 浇水
 * @param userId 用户ID
 * @param plantId 植物ID
 * @returns 是否成功浇水
 */
export async function waterPlant(userId: string, plantId: number): Promise<boolean> {
  try {
    // 获取植物信息
    const plant = await db.bambooPlants.get(plantId);
    if (!plant) {
      throw new Error(`Plant with id ${plantId} not found`);
    }

    // 检查是否是用户的植物
    if (plant.userId !== userId) {
      throw new Error('Not your plant');
    }

    // 检查植物是否已收获
    if (plant.harvestedAt) {
      throw new Error('Plant already harvested');
    }

    // 检查是否已浇水
    if (plant.isWatered) {
      const lastWatered = new Date(plant.lastWateredAt!);
      const now = new Date();
      const hoursSinceLastWatered = (now.getTime() - lastWatered.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastWatered < 8) { // 8小时内已浇过水
        throw new Error('Plant already watered recently');
      }
    }

    // 更新植物状态
    const now = new Date();
    const updatedPlant = {
      ...plant,
      isWatered: true,
      lastWateredAt: now,
      health: Math.min(100, plant.health + 10), // 浇水增加10点健康度，最高100
      updatedAt: now
    };

    // 更新数据库
    await db.bambooPlants.update(plantId, updatedPlant);

    // 添加同步项目
    await addSyncItem('bambooPlants', 'update', updatedPlant);

    // 播放浇水音效
    playSound(SoundType.WATER, 0.5);

    return true;
  } catch (error) {
    console.error('Failed to water plant:', error);
    return false;
  }
}

/**
 * 为竹子施肥
 * @param userId 用户ID
 * @param plantId 植物ID
 * @param itemId 可选的肥料物品ID
 * @returns 是否成功
 */
export async function fertilizePlant(userId: string, plantId: number, itemId?: string): Promise<boolean> {
  try {
    const plant = await db.bambooPlants.get(plantId);
    if (!plant || plant.userId !== userId) {
      throw new Error('Plant not found or does not belong to user');
    }

    // 检查植物是否可以施肥 (例如, 未收获且健康状态良好)
    if (plant.isHarvestable || (plant.health !== undefined && plant.health <= 0)) {
      console.warn(`Plant ${plantId} cannot be fertilized in its current state.`);
      return false;
    }

    // 确定肥料效果 (示例逻辑)
    const fertilizerEffect = itemId ? 30 : 20; // 假设itemId存在则效果更好

    // 更新植物状态
    // plant.fertility is now part of BambooPlantRecord
    plant.fertility = Math.min(100, (plant.fertility || 0) + fertilizerEffect);
    plant.lastFertilizedAt = new Date();
    plant.isFertilized = true;
    plant.updatedAt = new Date();

    const fieldsToUpdate: Partial<BambooPlantRecord> = {
      fertility: plant.fertility,
      lastFertilizedAt: plant.lastFertilizedAt,
      isFertilized: plant.isFertilized,
      updatedAt: plant.updatedAt,
    };

    await db.bambooPlants.update(plantId, fieldsToUpdate);

    // 添加同步项目
    // Pass the updated fields to sync, plus the fertilizerUsed information
    await addSyncItem('bambooPlants', 'update', {
      id: plantId,
      ...fieldsToUpdate, // Spread the updated fields
      fertilizerUsed: itemId, // Log which fertilizer was used, if any
    });

    // 播放音效
    playSound(SoundType.FERTILIZE);

    // 熊猫状态：假设施肥给经验值
    await addPandaExperience(10); // Assuming 10 experience points for fertilizing

    return true;
  } catch (error) {
    console.error('Failed to fertilize plant:', error);
    return false;
  }
}

/**
 * 收获竹子
 * @param userId 用户ID
 * @param plantId 植物ID
 * @returns 收获的竹子数量
 */
export async function harvestBamboo(userId: string, plantId: number): Promise<number> {
  try {
    // 获取植物信息
    const plant = await db.bambooPlants.get(plantId);
    if (!plant) {
      throw new Error(`Plant with id ${plantId} not found`);
    }

    // 检查是否是用户的植物
    if (plant.userId !== userId) {
      throw new Error('Not your plant');
    }

    // 检查植物是否已收获
    if (plant.harvestedAt) {
      throw new Error('Plant already harvested');
    }

    // 检查植物是否可收获
    if (!plant.isHarvestable) {
      throw new Error('Plant not ready for harvest');
    }

    // 计算实际收获量
    const healthFactor = plant.health / 100; // 健康度影响产量
    let harvestAmount = Math.floor(plant.expectedYield * healthFactor);

    // 应用资源乘数
    harvestAmount = await applyResourceMultiplier(RewardType.COIN, harvestAmount);

    // 更新植物状态
    const now = new Date();
    const updatedPlant = {
      ...plant,
      isHarvestable: false,
      harvestedAt: now,
      updatedAt: now
    };

    // 更新数据库
    await db.bambooPlants.update(plantId, updatedPlant);

    // 添加同步项目
    await addSyncItem('bambooPlants', 'update', updatedPlant);

    // 更新用户竹子数量
    await updateUserCurrency(userId, harvestAmount, 0);

    // 播放收获音效
    playSound(SoundType.BAMBOO_COLLECT, 0.5);

    return harvestAmount;
  } catch (error) {
    console.error('Failed to harvest bamboo:', error);
    return 0;
  }
}

/**
 * 更新植物生长状态
 * @param userId 用户ID
 * @returns 更新的植物数量
 */
export async function updatePlantGrowth(userId: string): Promise<number> {
  try {
    // 获取用户所有未收获的植物
    const plants = await db.bambooPlants.where('userId').equals(userId).filter(plant => !plant.harvestedAt).toArray();

    if (plants.length === 0) {
      return 0;
    }

    // 获取所有种子信息
    const seeds = await getAllSeeds();
    const seedMap = new Map(seeds.map(seed => [seed.id, seed]));

    // 获取所有地块信息
    const plots = await getAllPlots(userId);
    const plotMap = new Map(plots.map(plot => [plot.id, plot]));

    const now = new Date();
    let updatedCount = 0;

    // 更新每个植物的生长状态
    for (const plant of plants) {
      const seed = seedMap.get(plant.seedId);
      const plot = plotMap.get(plant.plotId);

      if (!seed || !plot) {
        continue;
      }

      const plantedAt = new Date(plant.plantedAt);
      const hoursSincePlanted = (now.getTime() - plantedAt.getTime()) / (1000 * 60 * 60);

      // 计算生长进度
      const growthProgress = Math.min(100, (hoursSincePlanted / seed.growthTime) * 100);

      // 计算生长阶段 (0-4)
      const growthStage = Math.min(4, Math.floor(growthProgress / 20));

      // 检查是否需要更新健康度
      let health = plant.health;

      // 如果超过8小时未浇水，健康度下降
      if (plant.lastWateredAt) {
        const lastWatered = new Date(plant.lastWateredAt);
        const hoursSinceLastWatered = (now.getTime() - lastWatered.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastWatered > 8) {
          // 每超过8小时未浇水，健康度下降5点
          const healthDecrease = Math.floor((hoursSinceLastWatered - 8) / 8) * 5;
          health = Math.max(0, health - healthDecrease);
        }
      }

      // 检查是否可收获
      const isHarvestable = growthProgress >= 100;

      // 更新植物状态
      const updatedPlant = {
        ...plant,
        growthProgress,
        growthStage,
        health,
        isHarvestable,
        updatedAt: now
      };

      // 只有状态有变化时才更新数据库
      if (
        plant.growthProgress !== growthProgress ||
        plant.growthStage !== growthStage ||
        plant.health !== health ||
        plant.isHarvestable !== isHarvestable
      ) {
        // 更新数据库
        await db.bambooPlants.update(plant.id!, updatedPlant);

        // 添加同步项目
        await addSyncItem('bambooPlants', 'update', updatedPlant);

        updatedCount++;
      }
    }

    return updatedCount;
  } catch (error) {
    console.error('Failed to update plant growth:', error);
    return 0;
  }
}

/**
 * 获取植物详情
 * @param plantId 植物ID
 * @returns 植物详情
 */
export async function getPlantDetails(plantId: number): Promise<{
  plant: BambooPlantRecord;
  seed: BambooSeedRecord;
  plot: BambooPlotRecord;
} | null> {
  try {
    // 获取植物信息
    const plant = await db.bambooPlants.get(plantId);
    if (!plant) {
      return null;
    }

    // 获取种子信息
    const seed = await db.bambooSeeds.get(plant.seedId);
    if (!seed) {
      return null;
    }

    // 获取地块信息
    const plot = await db.bambooPlots.get(plant.plotId);
    if (!plot) {
      return null;
    }

    return { plant, seed, plot };
  } catch (error) {
    console.error('Failed to get plant details:', error);
    return null;
  }
}

/**
 * 获取地块中的植物
 * @param userId 用户ID
 * @param plotId 地块ID
 * @returns 植物列表
 */
export async function getPlantsInPlot(userId: string, plotId: number): Promise<BambooPlantRecord[]> {
  try {
    // 使用过滤器查询而不是复合索引
    return await db.bambooPlants
      .where('userId').equals(userId)
      .filter(plant => plant.plotId === plotId)
      .toArray();
  } catch (error) {
    console.error('Failed to get plants in plot:', error);
    return [];
  }
}

export async function getAllBambooPlots(userId: string): Promise<BambooPlotRecord[]> {
  return db.bambooPlots.where('userId').equals(userId).toArray();
}

export async function getBambooPlotById(plotId: number): Promise<BambooPlotRecord | undefined> {
  return db.bambooPlots.get(plotId);
}

export async function addBambooPlot(userId: string, plotData: Omit<BambooPlotRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<BambooPlotRecord> {
  const now = new Date();
  const newPlot: BambooPlotRecord = {
    ...plotData,
    userId,
    createdAt: now,
    updatedAt: now,
  };
  const id = await db.bambooPlots.add(newPlot);
  const result = { ...newPlot, id: id as number };
  await addSyncItem('bambooPlots', 'create', result);
  return result;
}

export async function getAllBambooSeeds(): Promise<BambooSeedRecord[]> {
  return db.bambooSeeds.toArray();
}

export async function getBambooSeedById(seedId: number): Promise<BambooSeedRecord | undefined> {
  return db.bambooSeeds.get(seedId);
}

/**
 * 初始化竹子种植系统
 */
export async function initializeBambooPlantingSystem(): Promise<void> {
  try {
    // Only initialize default seeds if the table is empty.
    // Plot initialization is handled by initializeUserPlots for specific users.
    const seedCount = await db.bambooSeeds.count();
    if (seedCount === 0) {
      await db.bambooSeeds.bulkAdd(DEFAULT_BAMBOO_SEEDS.map(s => ({...s, createdAt: new Date(), updatedAt: new Date()})));
    }

    // await initializeBambooPlantingLabels(); // Temporarily commented out - file missing
    console.log('Bamboo planting system initialized, default seeds ensured if table was empty.');
  } catch (error) {
    console.error('Failed to initialize bamboo planting system:', error);
  }
}
