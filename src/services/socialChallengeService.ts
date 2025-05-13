// src/services/socialChallengeService.ts
import { db } from '@/db';
import { addSyncItem } from './dataSyncService';
import { ChallengeDifficulty, ChallengeStatus } from './challengeService';

// 社交挑战类型
export enum SocialChallengeType {
  COOPERATIVE = 'cooperative', // 合作型
  COMPETITIVE = 'competitive', // 竞争型
  TEAM = 'team' // 团队型
}

// 社交挑战记录类型
export interface SocialChallengeRecord {
  id?: number;
  title: string;
  description: string;
  type: SocialChallengeType;
  difficulty: ChallengeDifficulty;
  status: ChallengeStatus;
  creatorId: string;
  participantIds: string[];
  maxParticipants: number;
  progress: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  iconPath?: string;
  rewards?: any[];
  isPublic: boolean;
  inviteCode?: string;
  milestones?: SocialChallengeMilestone[];
}

// 社交挑战里程碑类型
export interface SocialChallengeMilestone {
  id?: number;
  challengeId: number;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: Date;
  order: number;
}

// 社交挑战参与记录类型
export interface SocialChallengeParticipation {
  id?: number;
  challengeId: number;
  userId: string;
  joinedAt: Date;
  status: 'active' | 'completed' | 'abandoned';
  contribution: number;
  lastContributedAt?: Date;
}

/**
 * 创建社交挑战
 * @param challenge 社交挑战数据
 */
export async function createSocialChallenge(
  challenge: Omit<SocialChallengeRecord, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'participantIds' | 'inviteCode'>
): Promise<SocialChallengeRecord> {
  const now = new Date();
  
  // 生成邀请码
  const inviteCode = generateInviteCode();
  
  const newChallenge: SocialChallengeRecord = {
    ...challenge,
    participantIds: [challenge.creatorId], // 创建者自动成为参与者
    progress: 0,
    createdAt: now,
    updatedAt: now,
    inviteCode
  };
  
  // 添加到数据库
  const id = await db.table('socialChallenges').add(newChallenge);
  const createdChallenge = { ...newChallenge, id: id as number };
  
  // 添加到同步队列
  await addSyncItem('socialChallenges', 'create', createdChallenge);
  
  // 创建参与记录
  await createParticipation(id as number, challenge.creatorId);
  
  return createdChallenge;
}

/**
 * 获取社交挑战
 * @param id 社交挑战ID
 */
export async function getSocialChallenge(id: number): Promise<SocialChallengeRecord | null> {
  return db.table('socialChallenges').get(id);
}

/**
 * 获取所有社交挑战
 * @param filter 过滤条件
 */
export async function getAllSocialChallenges(
  filter?: Partial<SocialChallengeRecord>
): Promise<SocialChallengeRecord[]> {
  let collection = db.table('socialChallenges').toCollection();
  
  if (filter) {
    collection = collection.filter(challenge => {
      for (const key in filter) {
        if (filter[key as keyof typeof filter] !== undefined) {
          if (challenge[key as keyof typeof challenge] !== filter[key as keyof typeof filter]) {
            return false;
          }
        }
      }
      return true;
    });
  }
  
  return collection.sortBy('createdAt');
}

/**
 * 获取用户参与的社交挑战
 * @param userId 用户ID
 */
export async function getUserSocialChallenges(userId: string): Promise<SocialChallengeRecord[]> {
  return db.table('socialChallenges')
    .filter(challenge => challenge.participantIds.includes(userId))
    .sortBy('createdAt');
}

/**
 * 获取公开的社交挑战
 */
export async function getPublicSocialChallenges(): Promise<SocialChallengeRecord[]> {
  return db.table('socialChallenges')
    .filter(challenge => 
      challenge.isPublic && 
      challenge.status === ChallengeStatus.ACTIVE &&
      challenge.participantIds.length < challenge.maxParticipants
    )
    .sortBy('createdAt');
}

/**
 * 更新社交挑战
 * @param id 社交挑战ID
 * @param updates 更新数据
 */
export async function updateSocialChallenge(
  id: number,
  updates: Partial<Omit<SocialChallengeRecord, 'id' | 'createdAt'>>
): Promise<SocialChallengeRecord> {
  const challenge = await db.table('socialChallenges').get(id);
  if (!challenge) {
    throw new Error(`Social challenge with id ${id} not found`);
  }
  
  const updatedChallenge = {
    ...challenge,
    ...updates,
    updatedAt: new Date()
  };
  
  // 更新数据库
  await db.table('socialChallenges').update(id, updatedChallenge);
  
  // 添加到同步队列
  await addSyncItem('socialChallenges', 'update', updatedChallenge);
  
  return updatedChallenge;
}

/**
 * 加入社交挑战
 * @param challengeId 社交挑战ID
 * @param userId 用户ID
 * @param inviteCode 邀请码（如果是非公开挑战）
 */
export async function joinSocialChallenge(
  challengeId: number,
  userId: string,
  inviteCode?: string
): Promise<SocialChallengeRecord> {
  const challenge = await db.table('socialChallenges').get(challengeId);
  if (!challenge) {
    throw new Error(`Social challenge with id ${challengeId} not found`);
  }
  
  // 检查是否已经是参与者
  if (challenge.participantIds.includes(userId)) {
    return challenge;
  }
  
  // 检查是否已达到最大参与人数
  if (challenge.participantIds.length >= challenge.maxParticipants) {
    throw new Error('Challenge has reached maximum number of participants');
  }
  
  // 检查邀请码（如果是非公开挑战）
  if (!challenge.isPublic && challenge.inviteCode !== inviteCode) {
    throw new Error('Invalid invite code');
  }
  
  // 更新参与者列表
  const updatedParticipantIds = [...challenge.participantIds, userId];
  const updatedChallenge = await updateSocialChallenge(challengeId, {
    participantIds: updatedParticipantIds
  });
  
  // 创建参与记录
  await createParticipation(challengeId, userId);
  
  return updatedChallenge;
}

/**
 * 离开社交挑战
 * @param challengeId 社交挑战ID
 * @param userId 用户ID
 */
export async function leaveSocialChallenge(
  challengeId: number,
  userId: string
): Promise<SocialChallengeRecord> {
  const challenge = await db.table('socialChallenges').get(challengeId);
  if (!challenge) {
    throw new Error(`Social challenge with id ${challengeId} not found`);
  }
  
  // 检查是否是参与者
  if (!challenge.participantIds.includes(userId)) {
    return challenge;
  }
  
  // 如果是创建者，不允许离开
  if (challenge.creatorId === userId) {
    throw new Error('Creator cannot leave the challenge');
  }
  
  // 更新参与者列表
  const updatedParticipantIds = challenge.participantIds.filter(id => id !== userId);
  const updatedChallenge = await updateSocialChallenge(challengeId, {
    participantIds: updatedParticipantIds
  });
  
  // 更新参与记录
  await updateParticipation(challengeId, userId, {
    status: 'abandoned'
  });
  
  return updatedChallenge;
}

/**
 * 创建参与记录
 * @param challengeId 社交挑战ID
 * @param userId 用户ID
 */
export async function createParticipation(
  challengeId: number,
  userId: string
): Promise<SocialChallengeParticipation> {
  const now = new Date();
  
  const participation: SocialChallengeParticipation = {
    challengeId,
    userId,
    joinedAt: now,
    status: 'active',
    contribution: 0
  };
  
  // 添加到数据库
  const id = await db.table('socialChallengeParticipations').add(participation);
  const createdParticipation = { ...participation, id: id as number };
  
  // 添加到同步队列
  await addSyncItem('socialChallengeParticipations', 'create', createdParticipation);
  
  return createdParticipation;
}

/**
 * 更新参与记录
 * @param challengeId 社交挑战ID
 * @param userId 用户ID
 * @param updates 更新数据
 */
export async function updateParticipation(
  challengeId: number,
  userId: string,
  updates: Partial<Omit<SocialChallengeParticipation, 'id' | 'challengeId' | 'userId' | 'joinedAt'>>
): Promise<SocialChallengeParticipation> {
  const participation = await db.table('socialChallengeParticipations')
    .filter(p => p.challengeId === challengeId && p.userId === userId)
    .first();
  
  if (!participation) {
    throw new Error(`Participation record not found for challenge ${challengeId} and user ${userId}`);
  }
  
  const updatedParticipation = {
    ...participation,
    ...updates
  };
  
  // 如果更新了贡献值，设置最后贡献时间
  if (updates.contribution !== undefined) {
    updatedParticipation.lastContributedAt = new Date();
  }
  
  // 更新数据库
  await db.table('socialChallengeParticipations').update(participation.id!, updatedParticipation);
  
  // 添加到同步队列
  await addSyncItem('socialChallengeParticipations', 'update', updatedParticipation);
  
  return updatedParticipation;
}

/**
 * 获取社交挑战的参与记录
 * @param challengeId 社交挑战ID
 */
export async function getChallengeParticipations(
  challengeId: number
): Promise<SocialChallengeParticipation[]> {
  return db.table('socialChallengeParticipations')
    .filter(p => p.challengeId === challengeId)
    .sortBy('joinedAt');
}

/**
 * 贡献社交挑战进度
 * @param challengeId 社交挑战ID
 * @param userId 用户ID
 * @param amount 贡献量
 */
export async function contributeToChallenge(
  challengeId: number,
  userId: string,
  amount: number
): Promise<SocialChallengeRecord> {
  const challenge = await db.table('socialChallenges').get(challengeId);
  if (!challenge) {
    throw new Error(`Social challenge with id ${challengeId} not found`);
  }
  
  // 检查是否是参与者
  if (!challenge.participantIds.includes(userId)) {
    throw new Error('User is not a participant of this challenge');
  }
  
  // 获取参与记录
  const participation = await db.table('socialChallengeParticipations')
    .filter(p => p.challengeId === challengeId && p.userId === userId)
    .first();
  
  if (!participation) {
    throw new Error(`Participation record not found for challenge ${challengeId} and user ${userId}`);
  }
  
  // 更新参与记录
  await updateParticipation(challengeId, userId, {
    contribution: participation.contribution + amount
  });
  
  // 更新挑战进度
  const newProgress = Math.min(100, challenge.progress + amount);
  const updatedChallenge = await updateSocialChallenge(challengeId, {
    progress: newProgress
  });
  
  // 如果进度达到100%，标记为已完成
  if (newProgress >= 100 && challenge.status !== ChallengeStatus.COMPLETED) {
    await updateSocialChallenge(challengeId, {
      status: ChallengeStatus.COMPLETED
    });
    
    // 更新所有活跃参与者的状态为已完成
    const participations = await getChallengeParticipations(challengeId);
    for (const p of participations) {
      if (p.status === 'active') {
        await updateParticipation(challengeId, p.userId, {
          status: 'completed'
        });
      }
    }
  }
  
  return updatedChallenge;
}

/**
 * 生成邀请码
 */
function generateInviteCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
