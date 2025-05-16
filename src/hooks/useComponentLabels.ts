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
    },
    vipSubscription: {
      title: 'Choose Your Guardian Plan',
      subtitle: 'Select the plan that suits you best',
      monthly: {
        title: 'Monthly Guardian',
        price: '$9.99',
        monthlyPrice: '$9.99/month',
        benefits: 'All Guardian benefits,Monthly exclusive gift,Cancel anytime'
      },
      seasonal: {
        title: 'Seasonal Guardian',
        price: '$24.99',
        monthlyPrice: '$8.33/month',
        benefits: 'All Guardian benefits,Seasonal exclusive gift,Priority support,10% bonus on all rewards'
      },
      annual: {
        title: 'Annual Guardian',
        price: '$79.99',
        monthlyPrice: '$6.67/month',
        benefits: 'All Guardian benefits,Annual exclusive gift,VIP exclusive panda skin,Priority support,20% bonus on all rewards,Exclusive seasonal events'
      },
      buttons: {
        subscribe: 'Subscribe',
        restore: 'Restore Purchase',
        cancel: 'Cancel'
      },
      badges: {
        recommended: 'RECOMMENDED',
        bestValue: 'BEST VALUE'
      }
    },
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
    },
    deleteConfirmation: {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this item?',
      confirmButton: 'Delete',
      cancelButton: 'Cancel'
    },
    timelyRewardCongrats: {
      title: 'Congratulations!',
      message: 'You have earned a reward!',
      rewardAmount: 'Reward: {amount}',
      closeButton: 'Close',
      claimButton: 'Claim'
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
        taskReminder: { ...fallbackLabels.taskReminder, ...componentLabels.taskReminder },
        vipSubscription: { ...fallbackLabels.vipSubscription, ...componentLabels.vipSubscription },
        taskCard: { ...fallbackLabels.taskCard, ...componentLabels.taskCard },
        deleteConfirmation: { ...fallbackLabels.deleteConfirmation, ...componentLabels.deleteConfirmation },
        timelyRewardCongrats: { ...fallbackLabels.timelyRewardCongrats, ...componentLabels.timelyRewardCongrats }
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
