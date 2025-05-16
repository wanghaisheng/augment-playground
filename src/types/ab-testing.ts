export enum ExperimentStatus {
  DRAFT = 'draft',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum VariantType {
  FEATURE_FLAG = 'feature_flag',
  UI_TEXT = 'ui_text',
  ALGORITHM = 'algorithm',
  USER_FLOW = 'user_flow',
}

export interface ExperimentGoal {
  id: string; // Unique identifier for the goal
  name: string;
  metric: string; // e.g., 'conversion_rate', 'retention_rate', 'avg_session_duration'
  targetChange?: number; // e.g., 0.05 for a 5% increase
  baselineValue?: number;
}

export interface AbTestExperimentRecord {
  id?: number;
  name: string;
  description: string;
  status: ExperimentStatus;
  startDate: Date | null;
  endDate: Date | null;
  targetAudience: string; // JSON string with targeting criteria
  sampleSizePercentage: number; // 0-100
  goals: ExperimentGoal[]; // Array of goals
  variantType: VariantType;
  controlVersionDetails: string; // Description of the control
  createdAt: Date;
  updatedAt: Date;
}

export interface AbTestVariantRecord {
  id?: number;
  experimentId: number; // Foreign key to AbTestExperimentRecord
  name: string; // e.g., 'Variant A', 'Control'
  description?: string;
  configJson: string; // JSON string with variant-specific configuration
  allocationPercentage: number; // 0-100, sum of variants for an experiment should be 100
  isControl: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAbTestAssignmentRecord {
  id?: number;
  userId: string;
  experimentId: number;
  variantId: number;
  assignedAt: Date;
  conversionEvents?: Record<string, Date>; // Goal ID -> Timestamp
  lastViewedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
} 