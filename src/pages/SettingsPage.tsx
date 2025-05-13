// src/pages/SettingsPage.tsx
import React from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchSettingsPageView } from '@/services';
import LanguageSettingsSection from '@/features/settings/LanguageSettingsSection';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import PageTransition from '@/components/animation/PageTransition';
import DialogDemo from '@/components/game/DialogDemo';
import type { SettingsPageViewLabelsBundle, ApiError } from '@/types';

const SettingsPage: React.FC = () => {
  const {
    labels: pageLabels, isPending, isError, error, refetch, isFetching
  } = useLocalizedView<null, SettingsPageViewLabelsBundle>(
    'settingsPageViewContent',
    fetchSettingsPageView
  );

  if (isPending && !pageLabels) { // Full page initial load
    return <LoadingSpinner variant="jade" text="Loading Settings Page Content..." />;
  }

  if (isError || !pageLabels) { // Critical: Page labels failed
     return (
      <div className="page-content">
        <ErrorDisplay
          error={error}
          title={pageLabels?.pageTitle || "Settings Load Error"}
          messageTemplate="Could not load settings. Details: {message}"
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="page-content"> {/* Use regular container first */}
        <div className="bamboo-frame"> {/* Wrap content in bamboo-frame */}
          <h2>{pageLabels.pageTitle || "Settings"}</h2>
          <LanguageSettingsSection
            labels={pageLabels.languageSection}
            isUpdatingPage={isFetching && !!pageLabels} // Page is fetching if labels are present but still fetching
          />

          {/* 对话框演示部分 */}
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h3>UI组件演示</h3>
            <DialogDemo />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
export default SettingsPage;