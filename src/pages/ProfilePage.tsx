// src/pages/ProfilePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchProfilePageView } from '@/services';
import { getUserProfile, updateUserProfile } from '@/services/userProfileService';
import { getUserAchievements } from '@/services/achievementService';
import { getUserStatistics } from '@/services/statisticsService';
import { getUserTitles, getActiveUserTitle } from '@/services/userTitleService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { useNotifications } from '@/context/NotificationProvider';
import { NotificationType, NotificationPriority } from '@/types/notification';
import { playSound, SoundType } from '@/utils/sound';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Button from '@/components/common/Button';
import ProfileHeader from '@/components/profile/ProfileHeader';
import AchievementsShowcase from '@/components/profile/AchievementsShowcase';
import UserStatistics from '@/components/profile/UserStatistics';
import ProfileCustomization from '@/components/profile/ProfileCustomization';
import SocialSharePanel from '@/components/profile/SocialSharePanel';
import type { UserProfile, UserAchievement, UserStatistics as UserStatsType, UserTitle } from '@/types/user';
import type { UserTitleRecord } from '@/services/userTitleService';
import type { ProfilePageViewLabelsBundle } from '@/types';

/**
 * 用户个人资料页面
 *
 * 显示用户信息、成就、统计数据和个性化设置
 */
const ProfilePage: React.FC = () => {
  // 状态
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [statistics, setStatistics] = useState<UserStatsType | null>(null);
  const [userTitleRecords, setUserTitleRecords] = useState<UserTitleRecord[]>([]); // Raw records from service
  const [displayTitles, setDisplayTitles] = useState<UserTitle[]>([]); // Mapped for ProfileHeader
  const [activeTitleDisplay, setActiveTitleDisplay] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'achievements' | 'statistics' | 'customization' | 'social'>('achievements');
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // 上下文
  const { addNotification } = useNotifications();

  // 本地化视图
  const {
    labels: pageLabels,
    isPending: labelsPending,
    isError: labelsError,
    error: labelLoadingError,
    refetch: refetchLabels
  } = useLocalizedView<null, ProfilePageViewLabelsBundle>(
    'profilePageViewContent',
    fetchProfilePageView
  );

  // 加载用户数据 (User ID would typically come from auth context)
  const userId = 'current-user'; // Placeholder for actual user ID

  const loadUserData = useCallback(async () => {
    if (!pageLabels) return; // Don't load if labels aren't ready (prevents using undefined error messages)
    setInitialDataLoading(true);
    setDataError(null);
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);

      const userAchievementsData = await getUserAchievements();
      setAchievements(userAchievementsData);

      const userStatsData = await getUserStatistics();
      setStatistics(userStatsData);

      const titlesFromService = await getUserTitles(userId);
      setUserTitleRecords(titlesFromService);

      // Map UserTitleRecord[] to UserTitle[] for ProfileHeader and other display components
      const mappedDisplayTitles: UserTitle[] = titlesFromService.map(record => ({
        id: record.id?.toString() || record.titleType, // UserTitle expects string id
        name: record.titleText, // Map titleText to name
        description: record.customText || '', // Or a default description
        iconUrl: '', // UserTitleRecord doesn't have iconUrl, provide default or extend
        rarity: 'common', // UserTitleRecord doesn't have rarity, provide default or extend
        unlocked: true, // Assuming titles fetched are unlocked
        unlockedAt: record.unlockDate.getTime(),
        unlockCondition: '', // UserTitleRecord doesn't have this
        limited: !!record.expiryDate,
        limitedEndDate: record.expiryDate?.getTime(),
      }));
      setDisplayTitles(mappedDisplayTitles);

      // Get active title directly
      const activeUserTitleRecord = await getActiveUserTitle(userId);
      setActiveTitleDisplay(activeUserTitleRecord?.titleText || null);

    } catch (err) {
      console.error('Failed to load user data:', err);
      setDataError(err instanceof Error ? err.message : 'Unknown error loading data');
      addNotification({
        type: NotificationType.SYSTEM_UPDATE,
        title: pageLabels?.errorLoadingProfile || 'Error Loading Profile',
        message: err instanceof Error ? err.message : 'Unknown error',
        priority: NotificationPriority.MEDIUM
      });
    } finally {
      setInitialDataLoading(false);
    }
  }, [addNotification, pageLabels, userId]);

  // 初始化 and load data when labels are ready
  useEffect(() => {
    if (pageLabels && !labelsError) {
    loadUserData();
    }
  }, [pageLabels, labelsError, loadUserData]);

    // 注册数据刷新回调
  // Example: Refresh if userProfile related tables change. Adjust table names as per your DB structure.
  useRegisterTableRefresh('userProfile', loadUserData); // Placeholder table name
  useRegisterTableRefresh('userAchievements', loadUserData); // Placeholder
  useRegisterTableRefresh('userStatistics', loadUserData); // Placeholder
  useRegisterTableRefresh('userTitles', loadUserData); // For UserTitleRecord changes

  const handleEditClick = () => {
    playSound(SoundType.CLICK);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    playSound(SoundType.CLICK);
    setIsEditing(false);
  };

  const handleSaveProfile = async (updatedProfileData: Partial<UserProfile>) => {
    if (!userProfile) return;

    const profileToSave: UserProfile = { ...userProfile, ...updatedProfileData };

    try {
      setIsSaving(true);
      playSound(SoundType.CLICK);
      await updateUserProfile(profileToSave);
      setUserProfile(profileToSave);
      setIsEditing(false);
      playSound(SoundType.SUCCESS);
      addNotification({
        type: NotificationType.SYSTEM_UPDATE,
        title: pageLabels?.profileSavedSuccess || 'Profile Saved',
        message: '',
        priority: NotificationPriority.LOW
      });
    } catch (err) {
      console.error('Failed to save profile:', err);
      playSound(SoundType.ERROR);
      addNotification({
        type: NotificationType.SYSTEM_UPDATE,
        title: pageLabels?.errorSavingProfile || 'Error Saving Profile',
        message: err instanceof Error ? err.message : 'Unknown error',
        priority: NotificationPriority.MEDIUM
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (tab: 'achievements' | 'statistics' | 'customization' | 'social') => {
    playSound(SoundType.CLICK);
    setActiveTab(tab);
  };

  if (labelsPending) {
    return <LoadingSpinner variant="jade" text={pageLabels?.loadingProfile || "Loading profile..."} />;
  }

  if (labelsError || !pageLabels) {
    return (
      <ErrorDisplay
        error={labelLoadingError} // Use the specific error from useLocalizedView
        title={pageLabels?.errorLoadingProfile || "Error loading profile content"}
        onRetry={refetchLabels} // Retry fetching labels
      />
    );
  }

  if (initialDataLoading && !dataError) { // Show loading for user data if labels are loaded but data isn't
    return <LoadingSpinner variant="jade" text={pageLabels?.loadingProfile || "Loading your information..."} />;
  }

  if (dataError) { // Show error for user data fetching
    return (
      <div className="profile-page p-4">
         <h1 className="text-2xl font-bold text-jade-800 mb-4">
           {pageLabels.pageTitle || 'My Profile'}
         </h1>
        <ErrorDisplay
          error={new Error(dataError)} // Create an error object for display
          title={pageLabels.errorLoadingProfile || "Data Loading Error"}
          onRetry={loadUserData} // Retry fetching data
        />
      </div>
    );
  }

  return (
    <div className="profile-page p-4">
      <h1 className="text-2xl font-bold text-jade-800 mb-4">
        {pageLabels.pageTitle}
      </h1>

      <ProfileHeader
        profile={userProfile}
        title={activeTitleDisplay}
        titles={displayTitles}
        isEditing={isEditing}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
        isSaving={isSaving}
      />

      {!isEditing && (
        <div className="mb-6">
          <Button
            variant="jade"
            onClick={handleEditClick}
          >
            {pageLabels.editProfileButton}
          </Button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-300">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {pageLabels && pageLabels.tabs && (Object.keys(pageLabels.tabs) as Array<keyof typeof pageLabels.tabs>).map((tabKey) => (
        <button
              key={tabKey}
              onClick={() => handleTabChange(tabKey as 'achievements' | 'statistics' | 'customization' | 'social')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm \
                ${activeTab === tabKey
                  ? 'border-jade-500 text-jade-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
              {pageLabels.tabs![tabKey]}
        </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'achievements' && <AchievementsShowcase achievements={achievements} />}
        {activeTab === 'statistics' && <UserStatistics statistics={statistics} />}
        {activeTab === 'customization' && userProfile && (
          <ProfileCustomization
            profile={userProfile}
            titles={displayTitles}
            activeTitle={activeTitleDisplay}
            onSave={handleSaveProfile}
          />
        )}
        {activeTab === 'social' &&
        <SocialSharePanel
          profile={userProfile}
          achievements={achievements}
          statistics={statistics}
        />
        }
      </div>
    </div>
  );
};

export default ProfilePage;
