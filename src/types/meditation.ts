export enum MeditationType {
  GUIDED = 'guided',
  UNGUIDED = 'unguided',
  BREATHWORK = 'breathwork',
  BODY_SCAN = 'body_scan',
  SOUND_BATH = 'sound_bath',
  MINDFULNESS = 'mindfulness',
  LOVING_KINDNESS = 'loving_kindness',
  VISUALIZATION = 'visualization',
  MANTRA = 'mantra',
  ZEN = 'zen',
  TRANSCENDENTAL = 'transcendental',
  YOGA_NIDRA = 'yoga_nidra',
}

export enum MeditationDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  MASTER = 'master',
}

export interface MeditationCourseRecord {
  id?: number;
  title: string;
  description: string;
  type: MeditationType;
  difficulty: MeditationDifficulty;
  durationMinutes: number; // Expected total duration for the course or average session
  isVipExclusive: boolean;
  coverImagePath: string;
  audioPath?: string; // Optional: Main course audio, sessions might have individual audio
  instructorName: string;
  benefits: string[]; // From service definition
  tags: string[]; // From service definition
  completionCount: number;
  averageRating: number;
  isActive: boolean;
  totalSessions?: number; // Number of sessions in the course
  createdAt: Date;
  updatedAt: Date;
}

export interface MeditationSessionRecord {
  id?: number;
  userId: string;
  courseId: number;
  sessionNumber?: number; // Optional: if courses have multiple sessions
  title?: string; // Optional: if sessions have individual titles
  description?: string; // Optional
  audioPath: string; // Specific audio for this session (from types file, service file missed this)
  startTime: Date;
  endTime?: Date;
  durationMinutes: number; // Actual duration of this specific session
  isCompleted: boolean;
  rating?: number; // 1-5
  feedback?: string;
  createdAt: Date;
  updatedAt?: Date;
} 