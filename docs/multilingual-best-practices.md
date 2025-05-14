# PandaHabit Multilingual Implementation Best Practices

This document provides comprehensive guidelines for implementing and maintaining multilingual support in the PandaHabit application, focusing on consistent patterns, type safety, and component design.

## 1. Multilingual Architecture Overview

PandaHabit uses a layered approach to multilingual support:

1. **Language Context**: Global state for the current language (`en` | `zh`)
2. **Localized Content Service**: Retrieves localized content from the database
3. **UI Labels Database**: Stores all translatable text with language codes
4. **View-Specific Hooks**: Fetch localized content for specific views/pages
5. **Component Labels**: Pass localized text to components via props

## 2. Using Hooks for Localized Content

### 2.1 Page-Level Content with useLocalizedView

The `useLocalizedView` hook should be used in all page components to fetch localized content:

```typescript
const {
  labels: pageLabels,
  data: pageData,
  isPending,
  isError,
  error,
  refetch
} = useLocalizedView<PageDataType, PageLabelsBundle>(
  'pageViewContent',
  fetchPageView
);
```

### 2.2 Component-Level Content with useComponentLabels

The `useComponentLabels` hook should be used for shared components that need localized content:

```typescript
const { labels } = useComponentLabels();

return (
  <Button variant="primary">
    {labels.button.submit}
  </Button>
);
```

### 2.3 Loading and Error States

Always handle loading and error states with localized content:

```typescript
// Handle loading state
if (isPending && !pageLabels) {
  return <LoadingSpinner text={globalLabels?.loadingGeneric || "Loading..."} />;
}

// Handle error state
if (isError && !pageLabels) {
  return (
    <ErrorDisplay 
      error={error} 
      title={globalLabels?.errorGeneric || "Error"} 
      onRetry={refetch} 
    />
  );
}
```

## 3. Component Design for Multilingual Support

### 3.1 Component Props Structure

All components that display text should accept a `labels` prop:

```typescript
interface ComponentProps {
  // Other props
  labels?: ComponentLabels;
}

interface ComponentLabels {
  title?: string;
  description?: string;
  buttons?: {
    submit?: string;
    cancel?: string;
  };
  // Other labels
}
```

### 3.2 Using Labels with Fallbacks

Always provide English fallbacks for all labels:

```typescript
const MyComponent: React.FC<ComponentProps> = ({ labels }) => {
  return (
    <div>
      <h2>{labels?.title || "Default Title"}</h2>
      <p>{labels?.description || "Default description text."}</p>
      <button>{labels?.buttons?.submit || "Submit"}</button>
      <button>{labels?.buttons?.cancel || "Cancel"}</button>
    </div>
  );
};
```

### 3.3 Passing Labels to Child Components

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

### 3.4 Dynamic Content with Placeholders

For dynamic content, use placeholder patterns:

```typescript
// Using template literals (simple cases)
const message = `${labels?.welcomeMessage || "Welcome"}, ${username}!`;

// Using replacement patterns (complex cases)
const message = (labels?.taskCompletedMessage || "You completed {0} and earned {1} points!")
  .replace("{0}", taskTitle)
  .replace("{1}", points.toString());
```

## 4. Type Definitions for Multilingual Support

### 4.1 Label Bundle Structure

Organize label bundles hierarchically:

```typescript
export interface PageViewLabelsBundle {
  pageTitle: string;
  loadingMessage?: string;
  errorTitle?: string;
  retryButtonText?: string;
  
  // Section-specific labels
  section1?: {
    title?: string;
    description?: string;
  };
  
  // Component-specific labels
  componentA?: ComponentALabels;
  componentB?: ComponentBLabels;
}
```

### 4.2 Component Label Interfaces

Define specific interfaces for component labels:

```typescript
export interface TaskCardLabels {
  title?: string;
  dueDate?: string;
  priority?: {
    high?: string;
    medium?: string;
    low?: string;
  };
  buttons?: {
    complete?: string;
    edit?: string;
    delete?: string;
  };
}
```

### 4.3 Service Return Types

Define return types for localized content services:

```typescript
export type FetchPageViewResult = LocalizedContent<PageDataPayload, PageViewLabelsBundle>;

export async function fetchPageView(lang: Language): Promise<FetchPageViewResult> {
  // Implementation
}
```

## 5. Database Structure for UI Labels

### 5.1 UI Label Record Structure

```typescript
export interface UILabelRecord {
  id?: number;
  scopeKey: string;    // e.g., "homeView", "components.button"
  labelKey: string;    // e.g., "title", "submitButton"
  languageCode: Language;
  translatedText: string;
}
```

### 5.2 Scope Key Hierarchy

Organize scope keys hierarchically:

- **Page-level**: `homeView`, `tasksView`, `settingsView`
- **Section-level**: `homeView.welcomeSection`, `homeView.pandaSection`
- **Component-level**: `components.button`, `components.taskCard`
- **Feature-level**: `features.challenges`, `features.rewards`

### 5.3 Label Key Naming

Use consistent naming for label keys:

- **Titles and Headings**: `title`, `subtitle`, `sectionTitle`
- **Buttons and Actions**: `submitButton`, `cancelButton`, `confirmAction`
- **Messages**: `successMessage`, `errorMessage`, `emptyStateMessage`
- **Form Fields**: `nameLabel`, `emailLabel`, `passwordPlaceholder`

## 6. Common Pitfalls and Solutions

### 6.1 Hardcoded Text

**Problem**: Text is hardcoded in components instead of using labels.

**Solution**: 
- Systematically review all components for hardcoded text
- Replace with labels and English fallbacks
- Use a linting rule to catch hardcoded text

### 6.2 Missing Label Properties

**Problem**: Components use label properties that aren't defined in the interface.

**Solution**:
- Ensure all used label properties are defined in the interface
- Use TypeScript's strict mode to catch undefined properties
- Review component implementations against their interfaces

### 6.3 Inconsistent Fallback Strategy

**Problem**: Different components use different approaches for fallbacks.

**Solution**:
- Standardize on the `labels?.property || "English Fallback"` pattern
- Document the fallback strategy in the component development guide
- Review all components for consistency

### 6.4 Incomplete Label Passing

**Problem**: Parent components don't pass all necessary labels to child components.

**Solution**:
- Ensure parent components pass all relevant labels to child components
- Use TypeScript to enforce proper label passing
- Document the label passing pattern in the component development guide

## 7. Testing Multilingual Support

### 7.1 Manual Testing

- Test the application with both English and Chinese language settings
- Verify that all text is properly translated
- Check for layout issues with different text lengths
- Verify that fallbacks work correctly when translations are missing

### 7.2 Automated Testing

- Write unit tests for components with different label props
- Test with missing labels to verify fallbacks
- Test with different languages to verify proper rendering
- Use snapshot testing to catch unintended text changes

## 8. Extending to Additional Languages

To add support for additional languages:

1. Update the `Language` type:
   ```typescript
   export type Language = "en" | "zh" | "ja" | "ko";
   ```

2. Add language selection options in the settings page

3. Add translations to the database for the new language

4. Test the application with the new language

## 9. Conclusion

Consistent multilingual implementation is crucial for providing a seamless user experience across different languages. By following the best practices in this document, you can ensure that the PandaHabit application maintains high-quality multilingual support.

Key takeaways:
- Use `useLocalizedView` for page-level content
- Use `useComponentLabels` for shared components
- Accept `labels` props in all components that display text
- Provide English fallbacks for all labels
- Pass relevant labels to child components
- Define comprehensive type interfaces for labels
- Organize label bundles hierarchically
- Test with different languages to verify proper rendering
