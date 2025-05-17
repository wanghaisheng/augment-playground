// src/services/challengeDiscoveryService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import {
  ChallengeRecord,
  ChallengeStatus,
  ChallengeType,
  ChallengeDifficulty,
  getAllChallenges,
  getUserCompletedChallenges
} from './challengeService';
import {
  TaskRecord,
  TaskStatus,
  getAllTasks
} from './taskService';
import { getPandaState } from './pandaStateService';
import { playSound, SoundType } from '@/utils/sound';

/**
 * 挑战推荐记录类型
 */
export interface ChallengeRecommendation {
  challenge: ChallengeRecord;
  score: number;
  reason: string;
}

/**
 * 挑战发现记录类型
 */
export interface ChallengeDiscovery {
  id?: number;
  userId: string;
  challengeId: number;
  discoveredAt: Date;
  isViewed: boolean;
  isAccepted: boolean;
  expiresAt?: Date;
}

/**
 * 获取推荐的挑战
 * 根据用户的任务完成情况、熊猫等级和偏好推荐挑战
 */
export async function getRecommendedChallenges(
  userId: number | string,
  count: number = 5
): Promise<ChallengeRecord[]> {
  try {
    const allChallenges = await getAllChallenges();
    const completedChallenges = await getUserCompletedChallenges(userId);
    const { level: pandaLevel } = await getPandaState();

    // Filter out completed challenges
    const availableChallenges = allChallenges.filter(
      challenge => !completedChallenges.some((c: ChallengeRecord) => c.id === challenge.id)
    );

    // 计算每个挑战的推荐分数
    const recommendations: ChallengeRecommendation[] = [];

    for (const challenge of availableChallenges) {
      let score = 0;
      let reason = '';

      // 根据挑战难度和熊猫等级计算分数
      if (challenge.difficulty === ChallengeDifficulty.EASY) {
        score += 10;
        reason += '这个挑战难度适中，';
      } else if (challenge.difficulty === ChallengeDifficulty.MEDIUM && pandaLevel >= 3) {
        score += 15;
        reason += '这个挑战难度适合你当前的等级，';
      } else if (challenge.difficulty === ChallengeDifficulty.HARD && pandaLevel >= 5) {
        score += 20;
        reason += '这个挑战有一定难度，但你已经达到了足够的等级，';
      } else if (challenge.difficulty === ChallengeDifficulty.EXPERT && pandaLevel >= 8) {
        score += 25;
        reason += '这个挑战非常有挑战性，适合你的高等级，';
      }

      // 根据挑战类型计算分数
      if (challenge.type === ChallengeType.DAILY) {
        score += 5;
        reason += '这是一个日常挑战，';
      } else if (challenge.type === ChallengeType.WEEKLY) {
        score += 10;
        reason += '这是一个每周挑战，';
      } else if (challenge.type === ChallengeType.EVENT) {
        score += 15;
        reason += '这是一个限时活动挑战，';
      }

      // 根据已完成任务的相关性计算分数
      const relatedTaskCount = completedChallenges.filter((task: ChallengeRecord) => {
        // 检查任务标题或描述是否与挑战相关
        const taskTitle = task.title.toLowerCase();
        const taskDesc = task.description?.toLowerCase() || '';
        const challengeTitle = challenge.title.toLowerCase();
        const challengeDesc = challenge.description.toLowerCase();

        return (
          taskTitle.includes(challengeTitle) ||
          taskDesc.includes(challengeTitle) ||
          challengeTitle.includes(taskTitle) ||
          taskDesc.includes(challengeDesc) ||
          challengeDesc.includes(taskTitle)
        );
      }).length;

      if (relatedTaskCount > 0) {
        score += relatedTaskCount * 5;
        reason += `你已经完成了${relatedTaskCount}个相关任务，`;
      }

      // 添加到推荐列表
      recommendations.push({
        challenge,
        score,
        reason: reason + '推荐你尝试这个挑战。'
      });
    }

    // 按分数排序并限制数量
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(recommendation => recommendation.challenge);
  } catch (err) {
    console.error('Failed to get recommended challenges:', err);
    return [];
  }
}

/**
 * 发现新挑战
 * 根据用户的任务完成情况自动发现新挑战
 */
export async function discoverNewChallenges(): Promise<ChallengeDiscovery[]> {
  try {
    // 获取用户的熊猫等级
    const { level: pandaLevel } = await getPandaState();

    // 获取所有即将开始的挑战
    const upcomingChallenges = await getAllChallenges({
      status: ChallengeStatus.UPCOMING
    });

    // 获取用户已完成的任务
    const completedTasks = await getAllTasks({
      status: TaskStatus.COMPLETED
    });

    // 获取已发现的挑战
    const discoveredChallenges = await db.table('challengeDiscoveries')
      .where('userId')
      .equals('current-user') // 在实际应用中，这应该是当前用户的ID
      .toArray();

    const discoveredChallengeIds = discoveredChallenges.map(dc => dc.challengeId);

    // 筛选出符合发现条件的挑战
    const newDiscoveries: ChallengeDiscovery[] = [];

    for (const challenge of upcomingChallenges) {
      // 跳过已发现的挑战
      if (discoveredChallengeIds.includes(challenge.id!)) {
        continue;
      }

      // 检查是否符合发现条件
      let shouldDiscover = false;

      // 条件1：熊猫等级达到要求
      if (
        (challenge.difficulty === ChallengeDifficulty.EASY && pandaLevel >= 1) ||
        (challenge.difficulty === ChallengeDifficulty.MEDIUM && pandaLevel >= 3) ||
        (challenge.difficulty === ChallengeDifficulty.HARD && pandaLevel >= 5) ||
        (challenge.difficulty === ChallengeDifficulty.EXPERT && pandaLevel >= 8)
      ) {
        shouldDiscover = true;
      }

      // 条件2：完成了相关任务
      const relatedTaskCount = completedTasks.filter((task: TaskRecord) => {
        const taskTitle = task.title.toLowerCase();
        const taskDesc = task.description?.toLowerCase() || '';
        const challengeTitle = challenge.title.toLowerCase();
        const challengeDesc = challenge.description.toLowerCase();

        return (
          taskTitle.includes(challengeTitle) ||
          taskDesc.includes(challengeTitle) ||
          challengeTitle.includes(taskTitle) ||
          taskDesc.includes(challengeDesc) ||
          challengeDesc.includes(taskTitle)
        );
      }).length;

      if (relatedTaskCount >= 3) {
        shouldDiscover = true;
      }

      // 如果符合条件，创建新的发现记录
      if (shouldDiscover) {
        const now = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7天后过期

        const discovery: ChallengeDiscovery = {
          userId: 'current-user', // 在实际应用中，这应该是当前用户的ID
          challengeId: challenge.id!,
          discoveredAt: now,
          isViewed: false,
          isAccepted: false,
          expiresAt
        };

        // 添加到数据库
        const id = await db.table('challengeDiscoveries').add(discovery);

        newDiscoveries.push({ ...discovery, id: id as number });
      }
    }

    return newDiscoveries;
  } catch (err) {
    console.error('Failed to discover new challenges:', err);
    return [];
  }
}

/**
 * 获取未查看的挑战发现
 */
export async function getUnviewedDiscoveries(): Promise<ChallengeDiscovery[]> {
  return db.table('challengeDiscoveries')
    .where('userId')
    .equals('current-user') // 在实际应用中，这应该是当前用户的ID
    .and(discovery => !discovery.isViewed)
    .toArray();
}

/**
 * 标记挑战发现为已查看
 */
export async function markDiscoveryAsViewed(discoveryId: number): Promise<void> {
  await db.table('challengeDiscoveries').update(discoveryId, { isViewed: true });
}

/**
 * 接受挑战发现
 */
export async function acceptChallenge(discoveryId: number): Promise<void> {
  // 获取发现记录
  const discovery = await db.table('challengeDiscoveries').get(discoveryId);
  if (!discovery) {
    throw new Error(`Challenge discovery with id ${discoveryId} not found`);
  }

  // 获取挑战
  const challenge = await db.table('challenges').get(discovery.challengeId);
  if (!challenge) {
    throw new Error(`Challenge with id ${discovery.challengeId} not found`);
  }

  // 更新挑战状态为活跃
  await db.table('challenges').update(challenge.id!, {
    status: ChallengeStatus.ACTIVE,
    updatedAt: new Date()
  });

  // 更新发现记录为已接受
  await db.table('challengeDiscoveries').update(discoveryId, {
    isAccepted: true,
    isViewed: true
  });
}
