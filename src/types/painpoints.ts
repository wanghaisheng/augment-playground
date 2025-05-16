export enum PainPointType {
  TIME_MANAGEMENT = 'time_management',
  MOTIVATION = 'motivation',
  PROCRASTINATION = 'procrastination',
  STRESS = 'stress',
  FOCUS = 'focus',
  OTHER = 'other',
  TASK_OVERDUE = 'task_overdue',
  LOW_ENERGY = 'low_energy',
  RESOURCE_SHORTAGE = 'resource_shortage',
  STREAK_BREAK = 'streak_break',
  CHALLENGE_FAILED = 'challenge_failed',
  GOAL_MISSED = 'goal_missed',
}

export interface PainPointSolutionRecord {
  id?: number;
  type: PainPointType;
  title: string;
  description: string;
  vipSolution: string;
  regularSolution: string;
  triggerCondition: string; // Description of when this solution might be suggested
  triggerThreshold?: number; // e.g., number of overdue tasks, low mood streak
  cooldownHours?: number; // How long before this solution can be suggested again
  lastTriggeredAt?: Date;
  isActive: boolean;
  relatedFeature?: string; // e.g., 'task_scheduling', 'meditation_course_id_X'
  createdAt: Date;
  updatedAt: Date;
}

export interface PainPointTriggerRecord {
  id?: number;
  userId: string;
  solutionId: number;
  triggeredAt: Date;
  isViewed: boolean;
  isResolved: boolean;
  resolvedAt?: Date;
  resolution?: string; // e.g., 'user_completed_meditation', 'user_ignored'
  userFeedback?: 'helpful' | 'not_helpful' | 'neutral';
  createdAt: Date;
  updatedAt: Date;
} 