// src/services/painPointService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { isUserVip } from './storeService';
import { PainPointType, type PainPointSolutionRecord, type PainPointTriggerRecord } from '@/types/painpoints';

/**
 * 初始化痛点解决方案
 */
export async function initializePainPointSolutions(): Promise<void> {
  try {
    // 检查是否已初始化
    const count = await db.painPointSolutions.count();
    if (count === 0) {
      // 创建默认痛点解决方案
      const now = new Date();
      const defaultSolutions: PainPointSolutionRecord[] = [
        {
          type: PainPointType.TASK_OVERDUE,
          title: '任务逾期提醒',
          description: '您有多个任务已经逾期，这可能会影响您的进度和熊猫的心情。',
          vipSolution: 'VIP会员可以使用"时间回溯"功能，重新安排逾期任务而不影响熊猫心情和连续打卡记录。',
          regularSolution: '尝试将逾期任务重新安排到今天或明天，并设置提醒以避免再次逾期。',
          triggerCondition: 'overdueTasks >= triggerThreshold',
          triggerThreshold: 3,
          cooldownHours: 48,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },
        {
          type: PainPointType.LOW_ENERGY,
          title: '熊猫能量不足',
          description: '您的熊猫能量不足，这会减缓成长速度和奖励获取。',
          vipSolution: 'VIP会员可以使用"能量补充剂"，立即恢复熊猫能量并获得2小时的双倍能量恢复速度。',
          regularSolution: '给熊猫喂食竹子可以恢复能量，完成简单任务也能获得少量能量奖励。',
          triggerCondition: 'pandaEnergy <= triggerThreshold',
          triggerThreshold: 20,
          cooldownHours: 24,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },
        {
          type: PainPointType.RESOURCE_SHORTAGE,
          title: '资源不足提醒',
          description: '您的竹子或金币资源不足，这可能会限制您的游戏体验。',
          vipSolution: 'VIP会员每天可以领取额外的资源包，包含50竹子和100金币，并且所有资源获取都有1.5倍加成。',
          regularSolution: '完成每日任务和挑战可以获得资源奖励，您也可以通过竹子收集小游戏获取额外资源。',
          triggerCondition: 'bamboo <= triggerThreshold || coins <= triggerThreshold',
          triggerThreshold: 10,
          cooldownHours: 24,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },
        {
          type: PainPointType.STREAK_BREAK,
          title: '连续打卡中断',
          description: '您的连续打卡记录已经中断，这会影响您的成就和奖励。',
          vipSolution: 'VIP会员可以使用"连续保护"功能，每月最多恢复3次连续打卡记录，就像从未中断一样。',
          regularSolution: '重新开始连续打卡，设置每日提醒，避免再次中断。连续7天后可以获得额外奖励。',
          triggerCondition: 'streakBroken == true',
          triggerThreshold: 1,
          cooldownHours: 72,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },
        {
          type: PainPointType.FOCUS,
          title: '注意力问题',
          description: '您最近的任务完成时间较长，可能存在注意力分散的问题。',
          vipSolution: 'VIP会员可以使用高级专注模式，包括白噪音、番茄钟和分心屏蔽功能，提高工作效率。',
          regularSolution: '尝试使用基础番茄钟功能，将任务分解为25分钟的专注时段，中间短暂休息。',
          triggerCondition: 'averageTaskCompletionTime >= triggerThreshold',
          triggerThreshold: 120,
          cooldownHours: 48,
          isActive: true,
          createdAt: now,
          updatedAt: now
        }
      ];

      // 添加到数据库
      await db.painPointSolutions.bulkAdd(defaultSolutions);

      console.log('Pain point solutions initialized');
    }
  } catch (error) {
    console.error('Failed to initialize pain point solutions:', error);
  }
}

/**
 * 获取所有痛点解决方案
 */
export async function getPainPointSolutions(): Promise<PainPointSolutionRecord[]> {
  return db.painPointSolutions
    .filter((solution: PainPointSolutionRecord) => solution.isActive === true)
    .toArray();
}

/**
 * 获取用户的痛点触发记录
 * @param userId 用户ID
 */
export async function getUserPainPointTriggers(userId: string): Promise<PainPointTriggerRecord[]> {
  return db.painPointTriggers
    .where('userId')
    .equals(userId)
    .toArray();
}

/**
 * 获取用户未查看的痛点触发记录
 * @param userId 用户ID
 */
export async function getUnviewedPainPointTriggers(userId: string): Promise<PainPointTriggerRecord[]> {
  return db.painPointTriggers
    .where('userId')
    .equals(userId)
    .and((trigger: PainPointTriggerRecord) => trigger.isViewed === false)
    .toArray();
}

/**
 * 标记痛点触发记录为已查看
 * @param triggerId 触发记录ID
 */
export async function markPainPointTriggerAsViewed(triggerId: number): Promise<void> {
  const trigger = await db.painPointTriggers.get(triggerId);
  if (!trigger) {
    throw new Error(`Pain point trigger with ID ${triggerId} not found`);
  }

  const updatedTrigger = {
    ...trigger,
    isViewed: true,
    updatedAt: new Date()
  };

  await db.painPointTriggers.update(triggerId, updatedTrigger);
  await addSyncItem('painPointTriggers', 'update', updatedTrigger);
}

/**
 * 标记痛点触发记录为已解决
 * @param triggerId 触发记录ID
 * @param resolution 解决方案
 */
export async function resolvePainPointTrigger(
  triggerId: number,
  resolution: string
): Promise<void> {
  const trigger = await db.painPointTriggers.get(triggerId);
  if (!trigger) {
    throw new Error(`Pain point trigger with ID ${triggerId} not found`);
  }

  const updatedTrigger = {
    ...trigger,
    isResolved: true,
    resolvedAt: new Date(),
    resolution,
    updatedAt: new Date()
  };

  await db.painPointTriggers.update(triggerId, updatedTrigger);
  await addSyncItem('painPointTriggers', 'update', updatedTrigger);
}

/**
 * 触发痛点解决方案
 * @param userId 用户ID
 * @param type 痛点类型
 * @param data 触发数据
 */
export async function triggerPainPointSolution(
  userId: string,
  type: PainPointType,
  data: Record<string, any>
): Promise<PainPointTriggerRecord | null> {
  try {
    // 获取对应类型的痛点解决方案
    const solution = await db.painPointSolutions
      .where('type')
      .equals(type)
      .and((s: PainPointSolutionRecord) => s.isActive === true)
      .first();

    if (!solution) {
      console.log(`No active solution found for pain point type: ${type}`);
      return null;
    }

    // 检查冷却时间
    const now = new Date();
    const lastTriggered = solution.lastTriggeredAt ? new Date(solution.lastTriggeredAt) : null;
    if (lastTriggered) {
      if (typeof solution.cooldownHours !== 'number') {
        console.error('cooldownHours is undefined for solution:', solution);
        return null;
      }
      const hoursSinceLastTriggered = (now.getTime() - lastTriggered.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastTriggered < solution.cooldownHours) {
        console.log(`Solution for ${type} is still in cooldown period`);
        return null;
      }
    }

    // 检查触发条件
    if (typeof solution.triggerThreshold !== 'number') {
      console.error('triggerThreshold is undefined for solution:', solution);
      return null;
    }
    const shouldTrigger = evaluateTriggerCondition(solution.triggerCondition, solution.triggerThreshold, data);
    if (!shouldTrigger) {
      console.log(`Trigger condition not met for pain point type: ${type}`);
      return null;
    }

    // 更新解决方案的最后触发时间
    await db.painPointSolutions.update(solution.id!, {
      ...solution,
      lastTriggeredAt: now,
      updatedAt: now
    });

    // 创建触发记录
    const trigger: PainPointTriggerRecord = {
      userId,
      solutionId: solution.id!,
      triggeredAt: now,
      isViewed: false,
      isResolved: false,
      createdAt: now,
      updatedAt: now
    };

    // 添加到数据库
    const id = await db.painPointTriggers.add(trigger);
    const createdTrigger = { ...trigger, id: id as number };

    // 添加到同步队列
    await addSyncItem('painPointTriggers', 'create', createdTrigger);

    return createdTrigger;
  } catch (error) {
    console.error('Failed to trigger pain point solution:', error);
    return null;
  }
}

/**
 * 评估触发条件
 * @param condition 触发条件表达式
 * @param threshold 触发阈值
 * @param data 触发数据
 */
function evaluateTriggerCondition(
  condition: string,
  threshold: number,
  data: Record<string, any>
): boolean {
  try {
    // 替换条件中的变量
    let evalCondition = condition;
    for (const key in data) {
      evalCondition = evalCondition.replace(new RegExp(key, 'g'), data[key]);
    }
    evalCondition = evalCondition.replace(/triggerThreshold/g, threshold.toString());

    // 评估条件
    return eval(evalCondition);
  } catch (error) {
    console.error('Failed to evaluate trigger condition:', error);
    return false;
  }
}

/**
 * 获取痛点解决方案详情
 * @param triggerId 触发记录ID
 */
export async function getPainPointSolutionDetails(
  triggerId: number
): Promise<{
  trigger: PainPointTriggerRecord;
  solution: PainPointSolutionRecord;
  isVip: boolean;
} | null> {
  try {
    // 获取触发记录
    const trigger = await db.painPointTriggers.get(triggerId);
    if (!trigger) {
      console.error(`Pain point trigger ${triggerId} not found.`);
      return null;
    }

    // 获取解决方案
    const solution = await db.painPointSolutions.get(trigger.solutionId);
    if (!solution) {
      console.error(`Pain point solution ${trigger.solutionId} for trigger ${triggerId} not found.`);
      return null;
    }

    // 检查用户是否是VIP
    const isVip = await isUserVip(trigger.userId);

    return {
      trigger,
      solution,
      isVip
    };
  } catch (error) {
    console.error('Failed to get pain point solution details:', error);
    return null;
  }
}
