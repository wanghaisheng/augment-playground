export enum GoalType {
  HABIT_FORMATION = 'habit_formation',
  SKILL_DEVELOPMENT = 'skill_development',
  PROJECT_COMPLETION = 'project_completion',
  LEARNING = 'learning',
  FITNESS = 'fitness',
  CUSTOM = 'custom',
}

export enum GoalStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface CustomGoalRecord {
  id?: number;
  userId: string;
  title: string;
  description?: string;
  type: GoalType;
  status: GoalStatus;
  targetValue?: number; // e.g., target number of sessions, pages read
  currentValue?: number;
  unit?: string; // e.g., 'sessions', 'pages', 'hours'
  startDate?: Date;
  targetDate?: Date;
  isPublic: boolean; // Whether this goal can be shared (if social features implemented)
  reminderFrequency?: string; // e.g., 'daily', 'weekly', 'none'
  lastReminderSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomGoalProgressRecord {
  id?: number;
  goalId: number; // Foreign key to CustomGoalRecord
  userId: string; // Denormalized for easier querying
  value: number; // Progress made in this entry
  notes?: string;
  date: Date; // Date of this progress entry
  createdAt: Date;
  updatedAt: Date;
} 