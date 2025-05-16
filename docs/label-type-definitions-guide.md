# Label Type Definitions Guide

This guide outlines the best practices for defining and using label types in the PandaHabit application.

## 1. Label Type Structure

### 1.1 Basic Structure

All label interfaces should follow a consistent structure:

```typescript
export interface ComponentNameLabels {
  // Required properties (always needed)
  title: string;
  description: string;
  
  // Optional properties (may not be needed in all cases)
  subtitle?: string;
  
  // Nested properties for logical grouping
  buttons?: {
    submit: string;
    cancel: string;
    // Other button labels
  };
  
  // Other label properties
}
```

### 1.2 Naming Conventions

- Use `ComponentNameLabels` for component-specific label interfaces
- Use `PageNameViewLabelsBundle` for page-level label bundles
- Use `SectionNameLabels` for section-specific label interfaces

## 2. Label Type Best Practices

### 2.1 Make Required Properties Non-Optional

Properties that are always needed should be non-optional:

```typescript
// Good
export interface ButtonLabels {
  text: string;
  ariaLabel: string;
}

// Avoid
export interface ButtonLabels {
  text?: string;
  ariaLabel?: string;
}
```

### 2.2 Use Nested Objects for Logical Grouping

Group related labels into nested objects:

```typescript
// Good
export interface FormLabels {
  title: string;
  fields: {
    name: string;
    email: string;
    password: string;
  };
  buttons: {
    submit: string;
    cancel: string;
  };
}

// Avoid
export interface FormLabels {
  title: string;
  nameFieldLabel: string;
  emailFieldLabel: string;
  passwordFieldLabel: string;
  submitButtonLabel: string;
  cancelButtonLabel: string;
}
```

### 2.3 Use Utility Types for Validation

Use the utility types from `label-utils.ts` to ensure all required labels are present:

```typescript
import { RequiredLabels, createLabelValidator } from '@/types';

// Define the label interface
export interface ButtonLabels {
  text?: string;
  ariaLabel?: string;
}

// Create a validator for required labels
const requiredButtonLabels: (keyof RequiredLabels<ButtonLabels>)[] = ['text', 'ariaLabel'];
export const validateButtonLabels = createLabelValidator<ButtonLabels>(requiredButtonLabels);
```

### 2.4 Use Consistent Fallback Strategy

Always provide English fallbacks for all labels:

```typescript
const MyComponent: React.FC<ComponentProps> = ({ labels }) => {
  // Merge with fallbacks
  const mergedLabels = mergeLabelBundles(labels, {
    text: 'Submit',
    ariaLabel: 'Submit form'
  });

  return (
    <button aria-label={mergedLabels.ariaLabel}>
      {mergedLabels.text}
    </button>
  );
};
```

## 3. Label Bundle Organization

### 3.1 Component-Level Labels

Component-level labels should be defined in the component's props interface:

```typescript
interface ButtonProps {
  // Other props
  labels?: ButtonLabels;
}
```

### 3.2 Page-Level Labels

Page-level labels should be organized into a bundle that includes all sections:

```typescript
export interface HomePageViewLabelsBundle {
  pageTitle: string;
  welcomeSection: HomeWelcomeSectionLabels;
  moodsSection: HomeMoodsSectionLabels;
  pandaSection: HomePandaSectionLabels;
}
```

### 3.3 Global Labels

Global labels should be organized into a bundle that can be accessed throughout the application:

```typescript
export interface GlobalLayoutLabelsBundle {
  appTitle: string;
  navHome: string;
  navTasks: string;
  // Other global labels
}
```

## 4. Label Passing

### 4.1 Parent to Child

Parent components should pass relevant labels to child components:

```typescript
const ParentComponent: React.FC<ParentProps> = ({ labels }) => {
  return (
    <div>
      <h1>{labels?.title || "Parent Title"}</h1>
      <ChildComponent 
        labels={labels?.childComponent}
        // Other props
      />
    </div>
  );
};
```

### 4.2 Using Hooks

Components should use the appropriate hooks to access labels:

```typescript
// For common components
const { labels } = useComponentLabels();

// For page-specific components
const { labels } = useLocalizedView<null, HomePageViewLabelsBundle>(
  'homeView',
  fetchHomePageView
);
```

## 5. Label Type Migration

When migrating existing components to use proper label types:

1. Identify all hardcoded text in the component
2. Create or update the label interface to include all text
3. Update the component to use the labels with fallbacks
4. Add the labels to the database or label files
5. Test the component with both languages

## 类型安全的标签合并最佳实践

在实现多语言标签合并（如 mergeLabelBundles）时，推荐如下类型安全写法：

```ts
export function mergeLabelBundles<T>(
  primary: Partial<T> | undefined | null,
  fallback: Partial<T>
): T {
  if (!primary || typeof primary !== 'object' || primary === null) {
    return fallback as T;
  }
  const result = { ...fallback } as T;
  for (const key in primary) {
    if (Object.prototype.hasOwnProperty.call(primary, key)) {
      const value = primary[key];
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          result[key] = mergeLabelBundles(
            value as Partial<T[typeof key]>,
            (fallback[key] as Partial<T[typeof key]>) || {}
          ) as T[typeof key];
        } else {
          result[key] = value as T[typeof key];
        }
      }
    }
  }
  return result;
}
```

- 推荐用 Partial<T>、Record<string, unknown> 替代 any
- 递归合并时用 Partial<T[typeof key]> 断言，赋值时用 T[typeof key] 断言
- 保证类型安全，避免 any 带来的类型不确定性
