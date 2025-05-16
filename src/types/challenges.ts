// src/types/challenges.ts

// Assuming ChallengeRecord, ChallengeCompletionRecord etc. are defined elsewhere
// Adding ChallengeCategoryRecord here.

export interface ChallengeCategoryRecord {
  id?: number;
  name: string;
  description: string;
  iconPath: string; // Path to an icon asset
  color?: string; // Optional color for styling
  order?: number; // Optional display order
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Placeholder for other challenge types if not defined in challengeService.ts
export enum ChallengeType {
  TIMED = 'timed',
  PROGRESS = 'progress',
  COLLECTION = 'collection',
  SOCIAL = 'social',
}

export enum ChallengeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

export enum ChallengeStatus {
  LOCKED = 'locked',
  AVAILABLE = 'available',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

export interface ChallengeRecord {
  id?: number;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  status: ChallengeStatus;
  progress?: number; // 0-100 for progress-based, or count for collection
  targetValue?: number;
  timeLimitMinutes?: number;
  startDate?: Date;
  endDate?: Date;
  rewardId?: number; // Reference to a RewardRecord
  unlockCondition?: string; // e.g., 'level_5', 'completed_challenge_X'
  relatedGameActionKey?: string; // For tracking progress via game actions
  isRepeatable?: boolean;
  cooldownHours?: number;
  lastCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeCompletionRecord {
  id?: number;
  challengeId: number;
  userId: string;
  completedDate: Date;
  score?: number;
  timeTakenSeconds?: number;
  wasSuccessful: boolean;
  createdAt: Date;
  updatedAt: Date;
} 