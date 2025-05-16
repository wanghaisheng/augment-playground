# 缺少属性修复文档

本文档记录了对类型定义中缺少属性的修复，以解决TypeScript错误。

## 修复概述

我们对以下接口进行了修复，添加了缺少的属性：

1. `ComponentsLabelsBundle` - 添加了 `taskCard` 属性
2. `ErrorLabels` - 添加了多个错误消息属性

这些修复解决了以下TypeScript错误：

- `Property 'taskCard' does not exist on type 'Partial<ComponentsLabelsBundle>'`
- `Property 'loadingError' does not exist on type 'ErrorLabels'`
- `Property 'taskNotFound' does not exist on type 'ErrorLabels'`
- `Property 'completeTaskError' does not exist on type 'ErrorLabels'`

## 具体修复

### 1. ComponentsLabelsBundle 接口

**文件路径**: `src/types/index.ts`

**修复前**:
```typescript
export interface ComponentsLabelsBundle {
  button: ButtonLabels;
  loading: LoadingLabels;
  error: ErrorLabels;
  emptyState: EmptyStateLabels;
  modal: ModalLabels;
  taskReminder: TaskReminderLabels;
  vipSubscription: VipSubscriptionLabels;
}
```

**修复后**:
```typescript
export interface TaskCardLabels {
  subtasksIndicator?: string;
  completeButton?: string;
  editButton?: string;
  deleteButton?: string;
  viewDetailsButton?: string;
  priority?: {
    high?: string;
    medium?: string;
    low?: string;
    unknown?: string;
  };
  status?: {
    overdue?: string;
    completed?: string;
    inProgress?: string;
    todo?: string;
  };
  dates?: {
    dueDate?: string;
    createdDate?: string;
    completedDate?: string;
  };
}

export interface ComponentsLabelsBundle {
  button: ButtonLabels;
  loading: LoadingLabels;
  error: ErrorLabels;
  emptyState: EmptyStateLabels;
  modal: ModalLabels;
  taskReminder: TaskReminderLabels;
  vipSubscription: VipSubscriptionLabels;
  taskCard?: TaskCardLabels;
}
```

**修复说明**:
- 创建了新的 `TaskCardLabels` 接口，定义了任务卡片组件所需的标签
- 在 `ComponentsLabelsBundle` 接口中添加了 `taskCard` 属性
- 这解决了 `AnimatedTaskCard.tsx` 中使用 `componentLabels?.taskCard` 时的类型错误

### 2. ErrorLabels 接口

**文件路径**: `src/types/index.ts`

**修复前**:
```typescript
export interface ErrorLabels {
  generic: string;
  title: string;
  retry: string;
  details: string;
  networkError: string;
  serverError: string;
  unknownError: string;
}
```

**修复后**:
```typescript
export interface ErrorLabels {
  generic: string;
  title: string;
  retry: string;
  details: string;
  networkError: string;
  serverError: string;
  unknownError: string;
  loadingError?: string;
  taskNotFound?: string;
  completeTaskError?: string;
  deleteTaskError?: string;
  createTaskError?: string;
  updateTaskError?: string;
  loadingDataError?: string;
  savingDataError?: string;
  processingError?: string;
  validationError?: string;
  authenticationError?: string;
  permissionError?: string;
}
```

**修复说明**:
- 在 `ErrorLabels` 接口中添加了多个错误消息属性
- 这解决了 `AnimatedTaskList.tsx` 中使用 `errorLabels.loadingError`、`errorLabels.taskNotFound` 和 `errorLabels.completeTaskError` 时的类型错误

### 3. useComponentLabels 钩子

**文件路径**: `src/hooks/useComponentLabels.ts`

**修复前**:
```typescript
// Default fallback labels for critical components
const fallbackLabels: Partial<ComponentsLabelsBundle> = {
  // ...其他属性
  error: {
    generic: 'An error occurred',
    title: 'Error',
    retry: 'Try Again',
    details: 'Details: {message}',
    networkError: 'Network error',
    serverError: 'Server error',
    unknownError: 'Unknown error'
  },
  // ...其他属性
};

// Merge fetched labels with fallback labels, prioritizing fetched labels
const mergedLabels = componentLabels
  ? {
      button: { ...fallbackLabels.button, ...componentLabels.button },
      loading: { ...fallbackLabels.loading, ...componentLabels.loading },
      error: { ...fallbackLabels.error, ...componentLabels.error },
      emptyState: { ...fallbackLabels.emptyState, ...componentLabels.emptyState },
      modal: { ...fallbackLabels.modal, ...componentLabels.modal },
      taskReminder: { ...fallbackLabels.taskReminder, ...componentLabels.taskReminder },
      vipSubscription: { ...fallbackLabels.vipSubscription, ...componentLabels.vipSubscription }
    }
  : fallbackLabels;
```

**修复后**:
```typescript
// Default fallback labels for critical components
const fallbackLabels: Partial<ComponentsLabelsBundle> = {
  // ...其他属性
  error: {
    generic: 'An error occurred',
    title: 'Error',
    retry: 'Try Again',
    details: 'Details: {message}',
    networkError: 'Network error',
    serverError: 'Server error',
    unknownError: 'Unknown error',
    loadingError: 'Error loading data',
    taskNotFound: 'Task not found',
    completeTaskError: 'Error completing task',
    deleteTaskError: 'Error deleting task',
    createTaskError: 'Error creating task',
    updateTaskError: 'Error updating task',
    loadingDataError: 'Error loading data',
    savingDataError: 'Error saving data',
    processingError: 'Error processing request',
    validationError: 'Validation error',
    authenticationError: 'Authentication error',
    permissionError: 'Permission denied'
  },
  // ...其他属性
  taskCard: {
    subtasksIndicator: 'Contains subtasks',
    completeButton: 'Complete',
    editButton: 'Edit',
    deleteButton: 'Delete',
    viewDetailsButton: 'View details',
    priority: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      unknown: 'Unknown'
    },
    status: {
      overdue: 'Overdue',
      completed: 'Completed',
      inProgress: 'In Progress',
      todo: 'To Do'
    },
    dates: {
      dueDate: 'Due date',
      createdDate: 'Created',
      completedDate: 'Completed'
    }
  }
};

// Merge fetched labels with fallback labels, prioritizing fetched labels
const mergedLabels = componentLabels
  ? {
      button: { ...fallbackLabels.button, ...componentLabels.button },
      loading: { ...fallbackLabels.loading, ...componentLabels.loading },
      error: { ...fallbackLabels.error, ...componentLabels.error },
      emptyState: { ...fallbackLabels.emptyState, ...componentLabels.emptyState },
      modal: { ...fallbackLabels.modal, ...componentLabels.modal },
      taskReminder: { ...fallbackLabels.taskReminder, ...componentLabels.taskReminder },
      vipSubscription: { ...fallbackLabels.vipSubscription, ...componentLabels.vipSubscription },
      taskCard: { ...fallbackLabels.taskCard, ...componentLabels.taskCard }
    }
  : fallbackLabels;
```

**修复说明**:
- 在 `fallbackLabels` 对象中添加了 `taskCard` 属性和扩展的 `error` 属性
- 在 `mergedLabels` 对象中添加了 `taskCard` 属性的合并逻辑
- 这确保了即使在服务器返回的标签中缺少这些属性，组件也能使用默认标签

## 最佳实践

在处理多语言标签时，请遵循以下最佳实践：

1. **完整的类型定义**:
   - 为所有组件定义完整的标签接口
   - 使用可选属性（`?`）表示非必需标签
   - 使用嵌套对象组织相关标签

2. **默认标签值**:
   - 在 `useComponentLabels` 钩子中为所有标签提供默认值
   - 确保默认值与接口定义一致
   - 使用英文作为默认语言

3. **标签合并**:
   - 使用扩展运算符（`...`）合并默认标签和服务器返回的标签
   - 优先使用服务器返回的标签
   - 确保合并逻辑包含所有标签属性

4. **组件使用**:
   - 使用可选链（`?.`）访问标签属性
   - 提供回退值处理缺失标签
   - 避免直接访问嵌套属性，使用临时变量存储中间结果

通过遵循这些最佳实践，我们可以确保多语言支持的类型安全和代码可维护性。
