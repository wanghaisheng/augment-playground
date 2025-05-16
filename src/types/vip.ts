// src/types/vip.ts

// Assuming VipSubscriptionRecord is already defined elsewhere or will be added
// For now, let's add VipTaskSeriesRecord and VipTrialRecord here.

export enum VipTaskSeriesType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  SPECIAL_EVENT = 'special_event',
}

export interface VipTaskSeriesRecord {
  id?: number;
  type: VipTaskSeriesType;
  title: string;
  description?: string;
  isActive: boolean;
  isCompleted?: boolean; // Optional, can be derived from tasks
  startDate?: Date;
  endDate?: Date;
  completedAt?: Date;
  taskIds: string; // Comma-separated string of TaskRecord IDs
  rewardPreview?: string; // Description or image key for series completion reward
  unlockCondition?: string; // e.g., "vip_level_2"
  createdAt: Date;
  updatedAt: Date;
}

export enum VipTrialStatus {
  NOT_STARTED = 'not_started',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CONVERTED = 'converted',
}

export interface VipTrialRecord {
  id?: number;
  userId: string;
  status: VipTrialStatus;
  startDate?: Date;
  endDate?: Date;
  triggerMilestoneId?: number; // ID of milestone that triggered trial offer
  hasShownGuide: boolean; // Whether the initial guide/info was shown
  hasShownValueReview: boolean; // Whether a mid-trial value proposition was shown
  hasShownExpirationReminder: boolean; // Whether an expiration reminder was shown
  source?: string; // How the trial was initiated e.g. 'milestone_unlock', 'manual_offer'
  createdAt: Date;
  updatedAt: Date;
}

// Placeholder for VipSubscriptionRecord if not defined elsewhere
// Ensure this matches the definition in storeService.ts or a central types file
export interface VipSubscriptionRecord {
  id?: number;
  userId: string;
  tier: string; // e.g., 'premium', 'gold'
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  autoRenews?: boolean;
  platform?: string; // 'apple', 'google', 'stripe'
  transactionId?: string;
  cancellationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
} 