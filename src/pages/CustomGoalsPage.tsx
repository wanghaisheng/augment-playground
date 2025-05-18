// src/pages/CustomGoalsPage.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// import { CustomGoalRecord, CustomGoalStatus } from '@/services/customGoalService'; // REMOVE THIS LINE
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchCustomGoalsPageView } from '@/services/localizedContentService';
import type {
  CustomGoalsPageViewLabelsBundle,
  CustomGoalsPageViewDataPayload,
  CustomGoalRecord as CustomGoalViewModel,
  // ApiError
} from '@/types';
// import { usePandaState } from '@/context/PandaStateProvider'; // Keep commented until PandaState integration is clarified
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import CustomGoalCard from '@/components/goals/CustomGoalCard';
import CustomGoalForm from '@/components/goals/CustomGoalForm';
// import Header from '@/components/layout/Header';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import VipModal from '@/components/vip/VipValueModal';
import { playSound, SoundType } from '@/utils/sound';
import { GoalStatus } from '@/types/goals'; // Ensure GoalStatus is imported correctly
// import { useQueryClientContext } from '@/contexts/QueryClientContext'; // REMOVE THIS - not used and path is incorrect

const CustomGoalsPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    labels: pageLabels,
    data: pageData,
    isPending,
    isError: pageLoadError,
    error: pageLoadErrorInfo,
    refetch,
    isFetching
  } = useLocalizedView<CustomGoalsPageViewDataPayload | null, CustomGoalsPageViewLabelsBundle>(
    'customGoalsViewContent',
    fetchCustomGoalsPageView
  );

  // Local UI state
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<CustomGoalViewModel | null>(null);
  const [showVipModal, setShowVipModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<CustomGoalViewModel | null>(null);

  // TODO: Integrate pandaState for isVipUser, goal limits, and CRUD operations
  // const { userProfile, isVipUser, customGoals, canCreateCustomGoal, getCustomGoalCount, getCustomGoalLimit, createCustomGoal, updateCustomGoal, deleteCustomGoal } = usePandaState();
  const isVipUser = pageData?.isVipUser ?? false;

  const filteredGoals = useMemo(() => {
    if (!pageData?.goals) return [];
    return pageData.goals.filter(goal => {
      if (filter === 'all') return true;
      if (filter === 'active') return goal.status === GoalStatus.ACTIVE;
      if (filter === 'completed') return goal.status === GoalStatus.COMPLETED;
      // if (filter === 'archived') return goal.status === GoalStatus.ARCHIVED; // If archived filter is added
      return true;
    });
  }, [pageData?.goals, filter]);

  const currentGoalCount = pageData?.currentGoalCount ?? 0;
  const goalLimit = pageData?.goalLimit ?? (isVipUser ? 5 : 1);
  const canCreateMoreGoals = isVipUser || currentGoalCount < goalLimit;

  const handleCreateGoal = () => {
    if (!canCreateMoreGoals && !isVipUser) {
      setShowVipModal(true);
      return;
    }
    setEditingGoal(null);
    setShowGoalForm(true);
    playSound(SoundType.CREATE);
  };

  const handleEditGoal = (goalToEdit: CustomGoalViewModel) => {
    setEditingGoal(goalToEdit);
    setShowGoalForm(true);
    playSound(SoundType.CLICK);
  };

  const _handleSaveGoal = () => {
    // Mock implementation:
    // Real implementation would use a service call and potentially updateCustomGoal from pandaState
    setShowGoalForm(false);
    setEditingGoal(null);
    refetch();
    playSound(SoundType.SUCCESS);
    alert(editingGoal ? (pageLabels?.formTitleEdit ?? 'Goal updated (mock)') : (pageLabels?.formTitleCreate ?? 'Goal created (mock)'));
  };

  const handleCloseGoalForm = () => {
    setShowGoalForm(false);
    setEditingGoal(null);
    };

  const handleDeleteGoal = (goalToDeleteConfirmation: CustomGoalViewModel) => {
    setGoalToDelete(goalToDeleteConfirmation);
  };

  const confirmDeleteGoal = async () => {
    if (!goalToDelete ) return;
    // await deleteCustomGoal(goalToDelete.id); // Assuming string ID
    setGoalToDelete(null);
    refetch();
    playSound(SoundType.SUCCESS);
    alert(`Goal "${goalToDelete.title}" ${pageLabels?.deleteConfirmMessage ?? 'deleted (mock)'}`);
  };

  const handleToggleComplete = async (goalToToggle: CustomGoalViewModel) => {
    if (!goalToToggle || !goalToToggle.id) return;
    playSound(SoundType.CLICK);

    const newStatus = goalToToggle.status === GoalStatus.COMPLETED ? GoalStatus.ACTIVE : GoalStatus.COMPLETED;

    try {
      // TODO: Replace with actual service call: updateCustomGoalProgress(goalToToggle.id, newStatus === GoalStatus.COMPLETED ? goalToToggle.targetValue : goalToToggle.currentValue, newStatus);
      // For now, assuming it can handle string ID and the GoalStatus enum

      alert(`Goal "${goalToToggle.title}" status set to ${newStatus} (mocked)`);
      refetch();
      playSound(newStatus === GoalStatus.COMPLETED ? SoundType.TASK_COMPLETE_HIGH : SoundType.CLICK);

    } catch (err) {
      console.error("Failed to toggle goal completion:", err);
      playSound(SoundType.ERROR);
    }
  };

  const handleOpenVipModal = () => {
    setShowVipModal(true);
  };

  const handleNavigateToVipPage = () => {
    playSound(SoundType.CLICK);
    navigate('/vip-benefits');
    setShowVipModal(false);
  };

  // Render Logic
  // Temporary cast for diagnostics of persistent 'never' errors
  const safePageLabels = pageLabels as any;

  if (isPending && !safePageLabels && !pageData) {
      return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner text={safePageLabels?.loadingMessage ?? 'Loading Custom Goals...'} />
        </div>
      );
    }

  if (pageLoadError && !safePageLabels && !pageData) {
      return (
      <div className="p-4">
        <ErrorDisplay
          error={pageLoadErrorInfo}
          title={safePageLabels?.errorTitle ?? 'Error Loading Goals'}
          messageTemplate={safePageLabels?.errorMessage ?? 'Could not load your custom goals. {message}'}
          onRetry={refetch}
          retryButtonText={safePageLabels?.retryButtonText ?? 'Try Again'}
        />
        </div>
      );
    }

  if (!safePageLabels) { // If pageLabels are still not available (e.g. initial load error after some retries, or still pending)
      return (
          <div className="flex justify-center items-center h-screen">
            <LoadingSpinner text={"Loading interface..."} />
        </div>
      );
    }

  const displayGoals = filteredGoals;
  const noGoalsExist = !pageData?.goals || pageData.goals.length === 0;

    return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-6"
    >
      <h2 className="text-2xl font-semibold mb-6">{pageLabels?.pageTitle ?? 'Custom Goals'}</h2>

      {isFetching && <LoadingSpinner text={pageLabels?.loadingMessage ?? 'Updating goals...'} />}
      {pageLoadError && pageData === undefined && ( // Show error only if data specifically failed and labels might be present
         <ErrorDisplay
            error={pageLoadErrorInfo}
            title={pageLabels?.errorTitle ?? 'Data Fetch Error'}
            messageTemplate={pageLabels?.errorMessage ?? 'Could not refresh goal data: {message}'}
            onRetry={refetch}
            retryButtonText={pageLabels?.retryButtonText ?? 'Try Again'}
          />
      )}

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'active', 'completed'] as const).map(filterType => (
            <Button
              key={filterType}
              color={filter === filterType ? 'primary' : 'secondary'}
              variant={filter === filterType ? 'filled' : 'outlined'}
              onClick={() => setFilter(filterType)}
            >
              {filterType === 'all' && (pageLabels?.filterAll ?? 'All')}
              {filterType === 'active' && (pageLabels?.filterActive ?? 'Active')}
              {filterType === 'completed' && (pageLabels?.filterCompleted ?? 'Completed')}
            </Button>
          ))}
        </div>
        <Button
          color="primary"
          variant="filled"
          onClick={handleCreateGoal}
          disabled={isFetching || (!canCreateMoreGoals && !isVipUser)}
            >
          {pageLabels?.createGoalButton ?? 'Create Goal'}
        </Button>
          </div>

      {!canCreateMoreGoals && !isVipUser && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md text-sm">
          {(pageLabels?.goalLimitInfo ?? 'You have created {count} of {limit} goals.')
            .replace('{count}', String(currentGoalCount))
            .replace('{limit}', String(goalLimit))}
          <Button
            variant="text"
            onClick={handleOpenVipModal}
            className="ml-2 text-yellow-700 hover:text-yellow-800 underline font-semibold"
          >
            {pageLabels?.becomeVipButton ?? 'Become VIP'}
          </Button>
          {pageLabels?.vipBenefitHint ?? ' to create more.'}
        </div>
      )}

      {noGoalsExist && !isFetching ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{pageLabels?.emptyStateTitle ?? 'No Goals Yet'}</h3>
          <p className="text-gray-500 mb-4">{pageLabels?.emptyStateDescription ?? 'Start creating goals to track your progress!'}</p>
          <Button
            color="primary"
            variant="filled"
            onClick={handleCreateGoal}
            disabled={isFetching || (!canCreateMoreGoals && !isVipUser)}
                >
            {pageLabels?.createGoalButton ?? 'Create Your First Goal'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayGoals.map(goal => (
            <CustomGoalCard
              key={goal.id}
              goal={goal}
              labels={pageLabels?.customGoalCardLabels}
              onEdit={() => handleEditGoal(goal)}
              onDelete={() => handleDeleteGoal(goal)}
              onToggleComplete={() => handleToggleComplete(goal)}
            />
          ))}
        </div>
      )}

      {showGoalForm && (
        <CustomGoalForm
          isOpen={showGoalForm}
          onClose={handleCloseGoalForm}
        />
      )}

      {goalToDelete && (
        <ConfirmationDialog
          title={pageLabels?.deleteConfirmTitle ?? 'Confirm Deletion'}
          message={(pageLabels?.deleteConfirmMessage ?? 'Are you sure you want to delete this goal: "{goalName}"?')
            .replace('{goalName}', goalToDelete.title)}
          confirmText={pageLabels?.confirmButtonText ?? 'Delete'}
          cancelText={pageLabels?.cancelButtonText ?? 'Cancel'}
          onConfirm={confirmDeleteGoal}
          onCancel={() => setGoalToDelete(null)}
        />
      )}

      {showVipModal && (
        <VipModal
          isOpen={showVipModal}
          userId={pageData?.username ?? 'demoUser'}
          isVip={pageData?.isVipUser ?? false}
          onSubscribe={handleNavigateToVipPage}
          onClose={() => setShowVipModal(false)}
      />
      )}
    </motion.div>
  );
};

export default CustomGoalsPage;
