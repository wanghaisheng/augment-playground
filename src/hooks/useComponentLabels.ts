// src/hooks/useComponentLabels.ts
import { useLocalizedView } from './useLocalizedView';
import { fetchComponentsLabels } from '@/services/localizedContentService';
import type { ComponentsLabelsBundle } from '@/types';

/**
 * Hook to access localized labels for common UI components
 *
 * @returns An object containing component labels and loading/error states
 */
export function useComponentLabels() {
  const {
    labels: componentLabels,
    isPending,
    isError,
    error,
    refetch
  } = useLocalizedView<null, ComponentsLabelsBundle>(
    'componentsLabels',
    fetchComponentsLabels
  );

  // Default fallback labels for critical components
  const fallbackLabels: Partial<ComponentsLabelsBundle> = {
    button: {
      loading: 'Loading...',
      retry: 'Retry',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      close: 'Close',
      submit: 'Submit',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      next: 'Next'
    },
    loading: {
      generic: 'Loading...',
      data: 'Loading data...',
      content: 'Loading content...',
      saving: 'Saving...',
      processing: 'Processing...'
    },
    error: {
      generic: 'An error occurred',
      title: 'Error',
      retry: 'Try Again',
      details: 'Details: {message}',
      networkError: 'Network error',
      serverError: 'Server error',
      unknownError: 'Unknown error'
    },
    emptyState: {
      generic: 'No data available',
      noData: 'No data',
      noResults: 'No results found',
      noItems: 'No items'
    },
    modal: {
      close: 'Close',
      confirm: 'Confirm',
      cancel: 'Cancel'
    },
    taskReminder: {
      title: 'Panda Messenger',
      subtitle: 'Task Reminder',
      defaultMessage: 'You have a task to handle.',
      reminderTimeLabel: 'Reminder time:',
      dismissButton: 'Dismiss',
      laterButton: 'Later',
      viewTaskButton: 'View Task',
      unknownTask: 'Unknown Task'
    }
  } as ComponentsLabelsBundle;

  // Merge fetched labels with fallback labels, prioritizing fetched labels
  const mergedLabels = componentLabels
    ? {
        button: { ...fallbackLabels.button, ...componentLabels.button },
        loading: { ...fallbackLabels.loading, ...componentLabels.loading },
        error: { ...fallbackLabels.error, ...componentLabels.error },
        emptyState: { ...fallbackLabels.emptyState, ...componentLabels.emptyState },
        modal: { ...fallbackLabels.modal, ...componentLabels.modal },
        taskReminder: { ...fallbackLabels.taskReminder, ...componentLabels.taskReminder }
      }
    : fallbackLabels;

  return {
    labels: mergedLabels,
    isPending,
    isError,
    error,
    refetch
  };
}
