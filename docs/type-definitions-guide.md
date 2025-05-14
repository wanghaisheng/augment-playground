# PandaHabit Type Definitions Guide

This document provides guidelines for maintaining consistent type definitions and interfaces in the PandaHabit project, with a focus on multilingual support, component props, and API responses.

## 1. Core Type Definitions

### 1.1 Language Types

```typescript
// Base language type
export type Language = "en" | "zh";

// Language context type
export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}
```

### 1.2 Localized Content Types

```typescript
// Generic localized content structure
export interface LocalizedContent<TDataPayload, TLabelsBundle> {
  labels: TLabelsBundle;
  data: TDataPayload | null;
}

// API error type
export interface ApiError extends Error { 
  errorCode?: string; 
  statusCode?: number; 
}

// UI label record for database
export interface UILabelRecord {
  id?: number;
  scopeKey: string;
  labelKey: string;
  languageCode: Language;
  translatedText: string;
}
```

## 2. Page-Specific Types

### 2.1 Page View Label Bundles

Each page should have a corresponding label bundle interface:

```typescript
// Example: Home Page
export interface HomePageViewLabelsBundle {
  pageTitle: string;
  loadingMessage?: string;
  errorTitle?: string;
  retryButtonText?: string;
  welcomeSection: HomeWelcomeSectionLabels;
  moodsSection: HomeMoodsSectionLabels;
  pandaSection: HomePandaSectionLabels;
  // Other section-specific labels
}

// Example: Tasks Page
export interface TasksPageViewLabelsBundle {
  pageTitle: string;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
  taskManager: TaskManagerLabels;
  // Other section-specific labels
}
```

### 2.2 Page Data Payloads

Each page should have a corresponding data payload interface:

```typescript
// Example: Home Page
export interface HomePageViewDataPayload {
  username: string;
  moods: MoodItem[];
  // Other data properties
}

// Example: Tasks Page
export interface TasksPageViewDataPayload {
  tasks: TaskRecord[];
  categories: TaskCategoryRecord[];
  // Other data properties
}
```

### 2.3 Fetch Result Types

Each page should have a corresponding fetch result type:

```typescript
// Example: Home Page
export type FetchHomePageViewResult = LocalizedContent<HomePageViewDataPayload, HomePageViewLabelsBundle>;

// Example: Tasks Page
export type FetchTasksPageViewResult = LocalizedContent<TasksPageViewDataPayload, TasksPageViewLabelsBundle>;
```

## 3. Component-Specific Types

### 3.1 Component Props Interfaces

Each component should have a corresponding props interface:

```typescript
// Example: Button Component
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'jade' | 'gold';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Example: TaskCard Component
export interface TaskCardProps {
  task: TaskRecord;
  onComplete?: (taskId: number) => void;
  onEdit?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  onTaskUpdated?: () => void;
  className?: string;
  labels?: TaskCardLabels;
}
```

### 3.2 Component Label Interfaces

Each component that displays text should have a corresponding labels interface:

```typescript
// Example: TaskCard Component
export interface TaskCardLabels {
  subtasks?: {
    hasSubtasks?: string;
  };
  buttons?: {
    complete?: string;
    edit?: string;
    delete?: string;
  };
  priority?: {
    high?: string;
    medium?: string;
    low?: string;
    unknown?: string;
  };
  status?: {
    overdue?: string;
  };
}

// Example: MoodTracker Component
export interface MoodTrackerLabels {
  title?: string;
  currentMoodQuestion?: string;
  intensityLabel?: string;
  intensityPrefix?: string;
  noteLabel?: string;
  notePlaceholder?: string;
  recordMoodButton?: string;
  recordButtonCompact?: string;
  historyLabel?: string;
  recentMoodsTitle?: string;
  noMoodsMessage?: string;
  backLabel?: string;
  intensityStrength?: {
    veryMild?: string;
    mild?: string;
    moderate?: string;
    strong?: string;
    veryStrong?: string;
  };
  moodTypes?: {
    happy?: string;
    content?: string;
    neutral?: string;
    sad?: string;
    anxious?: string;
    stressed?: string;
    tired?: string;
    energetic?: string;
    motivated?: string;
    frustrated?: string;
    angry?: string;
    calm?: string;
    unknown?: string;
  };
}
```

## 4. Domain-Specific Types

### 4.1 Task-Related Types

```typescript
// Task record
export interface TaskRecord {
  id: number;
  title: string;
  description?: string;
  categoryId: number;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  dueDate?: string;
  estimatedMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

// Task category record
export interface TaskCategoryRecord {
  id: number;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
}

// Task status enum
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

// Task priority enum
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Task type enum
export enum TaskType {
  DAILY = 'daily',
  MAIN = 'main',
  SIDE = 'side'
}
```

### 4.2 Panda-Related Types

```typescript
// Panda state record
export interface PandaStateRecord {
  id: number;
  mood: PandaMood;
  energy: number;
  experience: number;
  level: number;
  lastFed: string;
  lastPlayed: string;
  lastTrained: string;
  lastUpdated: string;
}

// Panda mood enum
export enum PandaMood {
  HAPPY = 'happy',
  CONTENT = 'content',
  NEUTRAL = 'neutral',
  TIRED = 'tired',
  SAD = 'sad'
}

// Panda ability record
export interface PandaAbilityRecord {
  id: number;
  key: string;
  name: string;
  description: string;
  icon: string;
  requiredLevel: number;
  isActive: boolean;
  isUnlocked: boolean;
  cooldownMinutes: number;
  lastUsed?: string;
}
```

## 5. Hook Return Types

### 5.1 useLocalizedView Hook

```typescript
// Return type for useLocalizedView hook
interface UseLocalizedViewResult<TDataPayload, TLabelsBundle> {
  data: TDataPayload | undefined | null;
  labels: TLabelsBundle | undefined;
  isPending: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<QueryObserverResult<LocalizedContent<TDataPayload, TLabelsBundle>, ApiError>>;
  status: 'loading' | 'error' | 'success';
  isSuccess: boolean;
}
```

### 5.2 useComponentLabels Hook

```typescript
// Return type for useComponentLabels hook
interface UseComponentLabelsResult {
  labels: ComponentsLabelsBundle;
  isPending: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<QueryObserverResult<LocalizedContent<null, ComponentsLabelsBundle>, ApiError>>;
}
```

### 5.3 useDataRefresh Hook

```typescript
// Return type for useDataRefresh hook
interface UseDataRefreshResult {
  lastRefresh: DataRefreshEvent | null;
}

// Data refresh event type
interface DataRefreshEvent {
  table: string;
  data: any; // This should be more specific based on the table
}
```

## 6. Best Practices

### 6.1 Type Naming Conventions

- **Interfaces**: Use PascalCase and descriptive names (e.g., `TaskRecord`, `HomePageViewLabelsBundle`)
- **Enums**: Use PascalCase for enum names and SCREAMING_SNAKE_CASE for enum values (e.g., `TaskStatus.TODO`)
- **Types**: Use PascalCase for type aliases (e.g., `Language`, `FetchHomePageViewResult`)
- **Generics**: Use PascalCase with T prefix for generic type parameters (e.g., `TDataPayload`, `TLabelsBundle`)

### 6.2 Optional vs. Required Properties

- Mark properties as optional (`?`) only if they are truly optional
- For multilingual labels, make most properties optional to allow for partial translations
- For API responses, consider which properties might be null or undefined

### 6.3 Type Safety for Callbacks

- Define specific parameter and return types for callbacks
- Use function type annotations instead of `Function` or `any`
- Consider using generics for callbacks that handle different data types

### 6.4 Avoiding `any`

- Avoid using `any` type whenever possible
- Use `unknown` instead of `any` when the type is truly unknown
- Create specific types for data structures instead of using `any`

## 7. Conclusion

Consistent type definitions are crucial for maintaining a robust and maintainable codebase. By following the guidelines in this document, you can ensure that the PandaHabit project maintains high type safety and consistency across all components and features.

Remember to regularly review and update type definitions as the application evolves, and to ensure that all new components and features follow these guidelines.
