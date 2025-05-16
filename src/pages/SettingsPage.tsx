// src/pages/SettingsPage.tsx
import React from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchSettingsPageView } from '@/services';
import LanguageSettingsSection from '@/features/settings/LanguageSettingsSection';
import AnimationSettingsPanel from '@/components/settings/AnimationSettingsPanel';
import SkeletonSettingsPanel from '@/components/settings/SkeletonSettingsPanel';
import SyncSettingsPanel from '@/components/settings/SyncSettingsPanel';
import BackgroundMusicControlsNew from '@/components/settings/BackgroundMusicControlsNew';
import SoundSettingsPanel from '@/components/settings/SoundSettingsPanel';
import NotificationPreferencesPanel from '@/components/settings/NotificationPreferencesPanel';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import PageTransition from '@/components/animation/PageTransition';
import DialogDemo from '@/components/game/DialogDemo';
import SkeletonDemo from '@/components/demo/SkeletonDemo';
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

          {/* 动画设置部分 */}
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <AnimationSettingsPanel />
          </div>

          {/* 骨架屏设置部分 */}
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <SkeletonSettingsPanel />
          </div>

          {/* 同步设置部分 */}
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <SyncSettingsPanel />
          </div>

          {/* 通知设置部分 */}
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <NotificationPreferencesPanel />
          </div>

          {/* 音效设置部分 */}
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <SoundSettingsPanel />
          </div>

          {/* 背景音乐设置部分 */}
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <BackgroundMusicControlsNew />
          </div>

          {/* 骨架屏演示部分 */}
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <SkeletonDemo />
          </div>

          {/* 对话框演示部分 */}
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h3>UI组件演示</h3>
            <DialogDemo />
          </div>

          {/* 音效测试链接 */}
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h3>开发工具</h3>
            <div className="mt-4">
              <Button
                variant="jade"
                size="small"
                onClick={() => {
                  playSound(SoundType.CLICK);
                  window.location.href = '/sound-testing';
                }}
              >
                音效测试页面
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
export default SettingsPage;