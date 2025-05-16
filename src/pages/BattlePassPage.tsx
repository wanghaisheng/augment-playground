// src/pages/BattlePassPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchBattlePassPageView } from '@/services/localizedContentService';
import { BattlePassPageViewLabelsBundle } from '@/types/battle-pass';
import {
  getBattlePassViewData,
  claimBattlePassReward,
  addBattlePassExperience,
  purchaseBattlePass,
  purchaseBattlePassLevels
} from '@/services/battlePassService';
import {
  BattlePassType,
  BattlePassRecord,
  BattlePassLevelWithRewards,
  BattlePassTaskRecord,
  UserBattlePassProgressRecord,
  UserBattlePassOwnershipRecord
} from '@/types/battle-pass';
import { trackGameAction, GameActionType } from '@/services/battlePassTaskTrackingService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import PageTransition from '@/components/animation/PageTransition';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import BattlePassLevel from '@/components/game/BattlePassLevel';
import BattlePassTask from '@/components/game/BattlePassTask';
import BattlePassLevelUpModal from '@/components/game/BattlePassLevelUpModal';
import BattlePassSeasonTheme from '@/components/game/BattlePassSeasonTheme';
import BattlePassStats from '@/components/game/BattlePassStats';
import BattlePassRewardsPreview from '@/components/game/BattlePassRewardsPreview';
import BattlePassLeaderboard from '@/components/game/BattlePassLeaderboard';
import BattlePassAchievements from '@/components/game/BattlePassAchievements';
import BattlePassTaskRecommendations from '@/components/game/BattlePassTaskRecommendations';
import BattlePassHistory from '@/components/game/BattlePassHistory';
import BattlePassFriendInvite from '@/components/game/BattlePassFriendInvite';
import BattlePassDailyCheckin from '@/components/game/BattlePassDailyCheckin';
import BattlePassEvents from '@/components/game/BattlePassEvents';
import BattlePassChallenges from '@/components/game/BattlePassChallenges';
import BattlePassRewardAnimation from '@/components/game/BattlePassRewardAnimation';
import BattlePassLevelUpEffect from '@/components/game/BattlePassLevelUpEffect';
import BattlePassShareAchievement from '@/components/game/BattlePassShareAchievement';
import TaskCompletionToast from '@/components/common/TaskCompletionToast';
import { playSound, SoundType } from '@/utils/sound';
import '@/game-theme.css';

/**
 * Interface for the Battle Pass view data
 */
interface BattlePassPageViewData {
  pass: BattlePassRecord;
  levels: BattlePassLevelWithRewards[];
  userProgress?: UserBattlePassProgressRecord;
  userOwnership?: UserBattlePassOwnershipRecord;
  activeTasks: BattlePassTaskRecord[];
}

/**
 * Battle Pass Page
 * Displays the current Battle Pass season, levels, rewards, and tasks
 */
const BattlePassPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerRefreshListener } = useDataRefreshContext();

  // State for Battle Pass data - using individual state variables for better performance
  // as we don't need to update all state properties at once
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [battlePassData, setBattlePassData] = useState<BattlePassPageViewData | null>(null);
  const [_claimingReward, setClaimingReward] = useState<boolean>(false);
  const [_completingTask, setCompletingTask] = useState<boolean>(false);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [purchasingLevel, setPurchasingLevel] = useState<boolean>(false);
  const [levelsToPurchase, setLevelsToPurchase] = useState<number>(1);
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [newLevel, setNewLevel] = useState<number>(1);
  const [previousLevel, setPreviousLevel] = useState<number>(1);
  const [levelUpRewards, setLevelUpRewards] = useState<{
    freeReward?: { name: string; icon?: string; quantity: number };
    paidReward?: { name: string; icon?: string; quantity: number };
  }>({});
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [completedTask, setCompletedTask] = useState<{name: string, expReward: number} | null>(null);

  // Mock data for leaderboard
  const [leaderboardEntries, _setLeaderboardEntries] = useState<Array<{
    userId: string;
    userName: string;
    avatarUrl?: string;
    level: number;
    exp: number;
    hasPremiumPass: boolean;
    rank: number;
  }>>([
    { userId: 'user1', userName: 'PandaMaster', level: 25, exp: 2500, hasPremiumPass: true, rank: 1 },
    { userId: 'user2', userName: 'BambooLover', level: 23, exp: 2300, hasPremiumPass: true, rank: 2 },
    { userId: 'user3', userName: 'JadeCollector', level: 21, exp: 2100, hasPremiumPass: false, rank: 3 },
    { userId: 'current-user', userName: 'You', level: 18, exp: 1800, hasPremiumPass: false, rank: 4 },
    { userId: 'user5', userName: 'TeaMaster', level: 15, exp: 1500, hasPremiumPass: true, rank: 5 },
  ]);

  // Mock data for achievements
  const [achievements, _setAchievements] = useState<Array<{
    id: string;
    name: string;
    description: string;
    icon?: string;
    unlocked: boolean;
    progress: number;
    reward?: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    unlockedAt?: string;
  }>>([
    {
      id: 'achievement1',
      name: 'First Steps',
      description: 'Complete your first task in the Battle Pass',
      unlocked: true,
      progress: 100,
      reward: '50 Diamonds',
      rarity: 'common',
      unlockedAt: new Date().toISOString()
    },
    {
      id: 'achievement2',
      name: 'Task Master',
      description: 'Complete 10 tasks in the Battle Pass',
      unlocked: false,
      progress: 40,
      reward: '100 Diamonds',
      rarity: 'uncommon'
    },
    {
      id: 'achievement3',
      name: 'Premium Member',
      description: 'Purchase the Premium Battle Pass',
      unlocked: false,
      progress: 0,
      reward: 'Special Avatar Frame',
      rarity: 'rare'
    },
    {
      id: 'achievement4',
      name: 'Completionist',
      description: 'Reach level 50 in the Battle Pass',
      unlocked: false,
      progress: 36,
      reward: '500 Diamonds',
      rarity: 'epic'
    },
    {
      id: 'achievement5',
      name: 'Season Champion',
      description: 'Reach rank 1 on the leaderboard',
      unlocked: false,
      progress: 0,
      reward: 'Exclusive Panda Skin',
      rarity: 'legendary'
    },
  ]);

  // Mock data for history
  const [historyEntries, _setHistoryEntries] = useState<Array<{
    seasonId: string;
    seasonName: string;
    seasonTheme: string;
    startDate: string;
    endDate: string;
    finalLevel: number;
    maxLevel: number;
    completedTasks: number;
    totalTasks: number;
    claimedRewards: number;
    totalRewards: number;
    hadPremiumPass: boolean;
    finalRank?: number;
    totalPlayers?: number;
    notableRewards?: Array<{
      name: string;
      icon?: string;
      rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    }>;
    achievements?: Array<{
      name: string;
      icon?: string;
      rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    }>;
  }>>([
    {
      seasonId: 'season1',
      seasonName: 'Spring Awakening',
      seasonTheme: 'spring',
      startDate: '2023-03-01T00:00:00Z',
      endDate: '2023-05-31T23:59:59Z',
      finalLevel: 45,
      maxLevel: 50,
      completedTasks: 87,
      totalTasks: 100,
      claimedRewards: 42,
      totalRewards: 50,
      hadPremiumPass: true,
      finalRank: 12,
      totalPlayers: 1000,
      notableRewards: [
        { name: 'Spring Panda Skin', rarity: 'legendary' },
        { name: 'Cherry Blossom Frame', rarity: 'epic' },
        { name: 'Bamboo Sprout Pet', rarity: 'rare' }
      ],
      achievements: [
        { name: 'Spring Champion', rarity: 'epic' },
        { name: 'Task Master', rarity: 'rare' }
      ]
    },
    {
      seasonId: 'season2',
      seasonName: 'Summer Heat',
      seasonTheme: 'summer',
      startDate: '2023-06-01T00:00:00Z',
      endDate: '2023-08-31T23:59:59Z',
      finalLevel: 38,
      maxLevel: 50,
      completedTasks: 75,
      totalTasks: 100,
      claimedRewards: 35,
      totalRewards: 50,
      hadPremiumPass: false,
      finalRank: 56,
      totalPlayers: 1200,
      notableRewards: [
        { name: 'Beach Panda Avatar', rarity: 'epic' },
        { name: 'Sunglasses Accessory', rarity: 'uncommon' }
      ]
    }
  ]);

  // Mock data for friends
  const [friends, _setFriends] = useState<Array<{
    id: string;
    name: string;
    avatarUrl?: string;
    isInvited: boolean;
    hasJoined: boolean;
    currentLevel?: number;
  }>>([
    { id: 'friend1', name: 'BambooLover', isInvited: false, hasJoined: false, currentLevel: 5 },
    { id: 'friend2', name: 'PandaFan', isInvited: true, hasJoined: false },
    { id: 'friend3', name: 'TeaMaster', isInvited: false, hasJoined: true, currentLevel: 12 },
    { id: 'friend4', name: 'JadeDragon', isInvited: false, hasJoined: false }
  ]);

  // Mock data for events
  const [events, setEvents] = useState<Array<{
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
    theme: 'spring' | 'summer' | 'autumn' | 'winter' | 'special';
    rewards: Array<{
      name: string;
      icon?: string;
      quantity: number;
      rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    }>;
    requirements?: string;
    isPremiumOnly: boolean;
    hasParticipated: boolean;
    progress: number;
    isCompleted: boolean;
    hasClaimedRewards: boolean;
  }>>([
    {
      id: 'event1',
      name: 'Summer Festival',
      description: 'Celebrate the summer season with special rewards and activities!',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      theme: 'summer',
      rewards: [
        { name: 'Summer Panda Skin', icon: '🐼', quantity: 1, rarity: 'legendary' },
        { name: 'Diamonds', icon: '💎', quantity: 500, rarity: 'rare' },
        { name: 'Experience Boost', icon: '⚡', quantity: 3, rarity: 'uncommon' }
      ],
      requirements: 'Complete all summer festival tasks to earn special rewards!',
      isPremiumOnly: false,
      hasParticipated: true,
      progress: 75,
      isCompleted: false,
      hasClaimedRewards: false
    },
    {
      id: 'event2',
      name: 'Premium Treasure Hunt',
      description: 'Exclusive event for premium pass holders. Find hidden treasures and earn valuable rewards!',
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      theme: 'special',
      rewards: [
        { name: 'Treasure Hunter Title', icon: '👑', quantity: 1, rarity: 'epic' },
        { name: 'Diamonds', icon: '💎', quantity: 1000, rarity: 'rare' },
        { name: 'Mystery Box', icon: '🎁', quantity: 5, rarity: 'uncommon' }
      ],
      isPremiumOnly: true,
      hasParticipated: false,
      progress: 0,
      isCompleted: false,
      hasClaimedRewards: false
    }
  ]);

  // Mock data for challenges
  const [challenges, setChallenges] = useState<Array<{
    id: string;
    name: string;
    description: string;
    icon?: string;
    difficulty: number;
    endTime: string;
    rewards: Array<{
      name: string;
      icon?: string;
      quantity: number;
      rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    }>;
    steps: Array<{
      description: string;
      isCompleted: boolean;
    }>;
    isPremiumOnly: boolean;
    isAccepted: boolean;
    isCompleted: boolean;
    hasClaimedRewards: boolean;
  }>>([
    {
      id: 'challenge1',
      name: 'Meditation Master',
      description: 'Complete a series of meditation tasks to earn the Meditation Master title and rewards.',
      icon: '🧘',
      difficulty: 3,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      rewards: [
        { name: 'Meditation Master Title', icon: '🧘', quantity: 1, rarity: 'epic' },
        { name: 'Diamonds', icon: '💎', quantity: 300, rarity: 'rare' },
        { name: 'Zen Garden Background', icon: '🏯', quantity: 1, rarity: 'uncommon' }
      ],
      steps: [
        { description: 'Complete 5 meditation sessions', isCompleted: true },
        { description: 'Achieve a 3-day meditation streak', isCompleted: true },
        { description: 'Complete a 10-minute meditation session', isCompleted: false },
        { description: 'Share your meditation progress with a friend', isCompleted: false }
      ],
      isPremiumOnly: false,
      isAccepted: true,
      isCompleted: false,
      hasClaimedRewards: false
    },
    {
      id: 'challenge2',
      name: 'Premium Focus Challenge',
      description: 'An exclusive challenge for premium pass holders. Improve your focus and earn valuable rewards!',
      icon: '🎯',
      difficulty: 4,
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      rewards: [
        { name: 'Focus Master Title', icon: '🎯', quantity: 1, rarity: 'legendary' },
        { name: 'Diamonds', icon: '💎', quantity: 500, rarity: 'epic' },
        { name: 'Focus Boost Item', icon: '⚡', quantity: 3, rarity: 'rare' }
      ],
      steps: [
        { description: 'Complete 3 focus sessions of at least 25 minutes', isCompleted: false },
        { description: 'Achieve a 2-day focus streak', isCompleted: false },
        { description: 'Complete tasks without distractions', isCompleted: false },
        { description: 'Track your focus improvements', isCompleted: false }
      ],
      isPremiumOnly: true,
      isAccepted: false,
      isCompleted: false,
      hasClaimedRewards: false
    }
  ]);

  // Mock data for daily check-in
  const [dailyRewards, _setDailyRewards] = useState<Array<{
    day: number;
    rewardName: string;
    rewardIcon?: string;
    quantity: number;
    isClaimed: boolean;
    isAvailable: boolean;
  }>>([
    { day: 1, rewardName: 'Diamonds', rewardIcon: '💎', quantity: 50, isClaimed: true, isAvailable: true },
    { day: 2, rewardName: 'Experience Boost', rewardIcon: '⚡', quantity: 1, isClaimed: true, isAvailable: true },
    { day: 3, rewardName: 'Diamonds', rewardIcon: '💎', quantity: 100, isClaimed: false, isAvailable: true },
    { day: 4, rewardName: 'Avatar Frame', rewardIcon: '🖼️', quantity: 1, isClaimed: false, isAvailable: false },
    { day: 5, rewardName: 'Diamonds', rewardIcon: '💎', quantity: 150, isClaimed: false, isAvailable: false },
    { day: 6, rewardName: 'Task Skip Token', rewardIcon: '⏭️', quantity: 1, isClaimed: false, isAvailable: false },
    { day: 7, rewardName: 'Premium Skin', rewardIcon: '👑', quantity: 1, isClaimed: false, isAvailable: false }
  ]);

  // Get localized labels
  const {
    labels: pageLabels,
    isPending: isLabelsPending,
    isError: isLabelsError,
    error: labelsError,
  } = useLocalizedView<null, BattlePassPageViewLabelsBundle>(
    'battlePassPageViewContent',
    fetchBattlePassPageView
  );

  // Animation states
  const [showRewardAnimation, setShowRewardAnimation] = useState<boolean>(false);
  const [showLevelUpEffect, setShowLevelUpEffect] = useState<boolean>(false);
  const [showShareAchievement, setShowShareAchievement] = useState<boolean>(false);

  // Animation data
  const [rewardToShow, setRewardToShow] = useState<{
    name: string;
    icon?: string;
    quantity: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    description?: string;
  } | null>(null);

  const [levelUpData, setLevelUpData] = useState<{
    previousLevel: number;
    newLevel: number;
  } | null>(null);

  // Demo functions for animations
  const showReward = (reward: typeof rewardToShow) => {
    setRewardToShow(reward);
    setShowRewardAnimation(true);
  };

  const showLevelUp = (previousLevel: number, newLevel: number) => {
    setLevelUpData({ previousLevel, newLevel });
    setShowLevelUpEffect(true);
  };

  /**
   * Default labels for the Battle Pass page
   * These are used as fallbacks if the localized labels are not available
   */
  const defaultLabels: BattlePassPageViewLabelsBundle = {
    pageTitle: 'Battle Pass',
    headerTitle: 'Panda Cultivation Realm',
    headerSubtitle: 'Complete tasks to earn rewards and advance your journey',
    freeTrackTitle: 'Free Track',
    paidTrackTitle: 'Premium Track',
    currentLevelLabel: 'Current Level',
    nextLevelLabel: 'Next Level',
    expLabel: 'Experience',
    purchaseStandardPassButton: 'Purchase Standard Pass',
    purchasePremiumPassButton: 'Purchase Premium Pass',
    alreadyPurchasedMessage: 'You have already purchased this pass',
    levelPurchaseButton: 'Purchase Level',
    claimRewardButton: 'Claim',
    alreadyClaimedLabel: 'Claimed',
    lockedRewardLabel: 'Locked',
    tasksTitle: 'Battle Pass Tasks',
    taskTypes: {
      daily: 'Daily',
      weekly: 'Weekly',
      seasonal: 'Seasonal'
    },
    taskProgressLabel: 'Progress',
    taskCompletedLabel: 'Completed',
    noActivePassMessage: 'No active Battle Pass at the moment. Check back later!',
    // Season theme labels
    seasonEndsIn: 'Season ends in',
    daysLabel: 'days',
    hoursLabel: 'hours',
    minutesLabel: 'minutes',
    errorMessages: {
      failedToLoad: 'Failed to load Battle Pass data',
      failedToPurchase: 'Failed to purchase Battle Pass',
      failedToClaim: 'Failed to claim reward',
      failedToCompleteTask: 'Failed to complete task'
    },
    buttons: {
      back: 'Back',
      retry: 'Retry',
      close: 'Close'
    }
  };

  // Labels with fallbacks
  const labels: BattlePassPageViewLabelsBundle = pageLabels || defaultLabels;

  // Memoize the fetchBattlePassData function to prevent unnecessary re-renders
  const fetchBattlePassData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real app, you would get the current user ID
      const userId = 'current-user';
      const data = await getBattlePassViewData(userId);

      // Check if user has leveled up
      if (battlePassData && data &&
          battlePassData.userProgress && data.userProgress &&
          data.userProgress.currentLevel > battlePassData.userProgress.currentLevel) {
        // Store the new level for the modal
        const newLevel = data.userProgress.currentLevel;
        const previousLevel = battlePassData.userProgress.currentLevel;
        setNewLevel(newLevel);
        setPreviousLevel(previousLevel);

        // Get rewards for the new level
        const levelData = data.levels.find(level => level.levelNumber === newLevel);
        if (levelData) {
          const rewards = {
            freeReward: levelData.freeReward ? {
              name: levelData.freeReward.itemName,
              icon: levelData.freeReward.iconAssetKey,
              quantity: levelData.freeReward.quantity
            } : undefined,
            paidReward: levelData.paidReward ? {
              name: levelData.paidReward.itemName,
              icon: levelData.paidReward.iconAssetKey,
              quantity: levelData.paidReward.quantity
            } : undefined
          };
          setLevelUpRewards(rewards);
        }

        // Show level up modal
        setShowLevelUpModal(true);
      }

      setBattlePassData(data);
    } catch (err) {
      console.error('Failed to fetch Battle Pass data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [battlePassData]);

  // Initial data fetch
  useEffect(() => {
    fetchBattlePassData();

    // Register for data refresh events
    const unregister = registerRefreshListener('battlePass', fetchBattlePassData);

    return () => {
      unregister();
    };
  }, [fetchBattlePassData, registerRefreshListener]);

  // Handle back button click
  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Handle retry button click
  const handleRetry = useCallback(() => {
    fetchBattlePassData();
  }, [fetchBattlePassData]);

  // Helper function to determine the game action type for a task
  const getGameActionTypeForTask = (task: BattlePassTaskRecord): GameActionType => {
    // Use the relatedGameActionKey if available
    if (task.relatedGameActionKey && Object.values(GameActionType).includes(task.relatedGameActionKey as GameActionType)) {
      return task.relatedGameActionKey as GameActionType;
    }

    // Otherwise, determine based on task name or type
    const taskName = task.taskName.toLowerCase();

    if (taskName.includes('daily task') || taskName.includes('每日任务')) {
      return GameActionType.COMPLETE_DAILY_TASK;
    }

    if (taskName.includes('task') || taskName.includes('任务')) {
      return GameActionType.COMPLETE_TASK;
    }

    if (taskName.includes('challenge') || taskName.includes('挑战')) {
      return GameActionType.COMPLETE_CHALLENGE;
    }

    if (taskName.includes('mood') || taskName.includes('心情')) {
      return GameActionType.LOG_MOOD;
    }

    if (taskName.includes('feed') || taskName.includes('喂食')) {
      return GameActionType.FEED_PANDA;
    }

    if (taskName.includes('reward') || taskName.includes('奖励')) {
      return GameActionType.CLAIM_DAILY_REWARD;
    }

    if (taskName.includes('level') || taskName.includes('等级')) {
      return GameActionType.PANDA_LEVEL_UP;
    }

    if (taskName.includes('ability') || taskName.includes('能力')) {
      return GameActionType.UNLOCK_ABILITY;
    }

    // Default to COMPLETE_TASK if no match
    return GameActionType.COMPLETE_TASK;
  };

  // Render loading state
  if (isLoading || isLabelsPending) {
    return (
      <PageTransition>
        <div className="battle-pass-page">
          <LoadingSpinner text={labels.loadingMessage || 'Loading Battle Pass...'} />
        </div>
      </PageTransition>
    );
  }

  // Render error state
  if (error || isLabelsError) {
    return (
      <PageTransition>
        <div className="battle-pass-page">
          <ErrorDisplay
            error={error || labelsError}
            title={labels.errorMessages?.failedToLoad || 'Error'}
            messageTemplate={ (error?.message || labelsError?.message) ? 'Details: {message}' : (labels.errorMessages?.dataLoadFailedMessage || 'Failed to load Battle Pass data')}
            onRetry={handleRetry}
            retryButtonText={labels.buttons?.retry || 'Retry'}
          />
        </div>
      </PageTransition>
    );
  }

  // Render no active Battle Pass state
  if (!battlePassData || !battlePassData.pass) {
    return (
      <PageTransition>
        <div className="battle-pass-page">
          <div className="battle-pass-header">
            <button
              className="back-button jade-button"
              onClick={handleBackClick}
            >
              {labels.buttons?.back || 'Back'}
            </button>
            <h1 className="battle-pass-title">{labels.pageTitle}</h1>
          </div>
          <div className="battle-pass-empty-state">
            <p>{labels.noActivePassMessage}</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Render Battle Pass page
  return (
    <PageTransition>
      <div className="battle-pass-page">

      {/* Reward Animation */}
      {rewardToShow && (
        <BattlePassRewardAnimation
          reward={rewardToShow}
          isVisible={showRewardAnimation}
          onClose={() => setShowRewardAnimation(false)}
          labels={{
            rewardTitle: labels.rewardTitle || 'Reward Unlocked!',
            closeButtonLabel: labels.buttons?.close || 'Close',
            claimButtonLabel: labels.claimRewardButton || 'Claim',
            rarityLabel: labels.rarityLabels?.common ? 'Rarity' : '',
            rarityLabels: {
              common: labels.rarityLabels?.common || 'Common',
              uncommon: labels.rarityLabels?.uncommon || 'Uncommon',
              rare: labels.rarityLabels?.rare || 'Rare',
              epic: labels.rarityLabels?.epic || 'Epic',
              legendary: labels.rarityLabels?.legendary || 'Legendary'
            }
          }}
        />
      )}

      {/* Level Up Effect */}
      {levelUpData && (
        <BattlePassLevelUpEffect
          previousLevel={levelUpData.previousLevel}
          newLevel={levelUpData.newLevel}
          isVisible={showLevelUpEffect}
          onClose={() => setShowLevelUpEffect(false)}
          labels={{
            levelUpTitle: labels.levelUpTitle || 'Level Up!',
            levelUpMessage: labels.levelUpMessage || 'Congratulations! You\'ve reached a new level in the Battle Pass!',
            continueButtonLabel: labels.buttons?.continue || 'Continue',
            levelLabel: labels.levelLabel || 'Level'
          }}
        />
      )}

      {/* Share Achievement */}
      {showShareAchievement && (
        <BattlePassShareAchievement
          achievement={{
            id: 'placeholder-id',
            name: 'Placeholder Achievement',
            description: 'This is a placeholder description.',
            rarity: 'common',
            unlockedAt: new Date().toISOString(),
            userName: 'Player',
            userLevel: 1,
            seasonName: battlePassData?.pass?.seasonName || 'Current Season',
            // icon: 'placeholder-icon.png' // Optional icon
          }}
          isVisible={showShareAchievement}
          onClose={() => setShowShareAchievement(false)}
          onShare={(platform) => console.log(`Sharing achievement to ${platform}`)}
          labels={{
            shareTitle: labels.shareTitle || 'Share Achievement',
            closeButtonLabel: labels.buttons?.close || 'Close',
            downloadButtonLabel: labels.buttons?.download || 'Download',
            copyButtonLabel: labels.buttons?.copyLink || 'Copy',
            twitterButtonLabel: labels.twitterButtonLabel || 'Twitter',
            facebookButtonLabel: labels.facebookButtonLabel || 'Facebook',
            instagramButtonLabel: labels.instagramButtonLabel || 'Instagram',
            achievementUnlockedLabel: labels.achievementUnlockedLabel || 'Achievement Unlocked!',
            seasonLabel: labels.seasonLabel || 'Season',
            levelLabel: labels.levelLabel || 'Level',
            rarityLabel: labels.rarityLabels?.common ? 'Rarity' : '',
            rarityLabels: {
              common: labels.rarityLabels?.common || 'Common',
              uncommon: labels.rarityLabels?.uncommon || 'Uncommon',
              rare: labels.rarityLabels?.rare || 'Rare',
              epic: labels.rarityLabels?.epic || 'Epic',
              legendary: labels.rarityLabels?.legendary || 'Legendary'
            },
            copiedLabel: labels.copiedLabel || 'Copied!'
          }}
        />
      )}
        {/* Level Up Modal */}
        <BattlePassLevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          level={newLevel}
          freeReward={levelUpRewards.freeReward}
          paidReward={levelUpRewards.paidReward}
          hasPremiumPass={battlePassData?.userOwnership?.passType === BattlePassType.PREMIUM}
          labels={{
            levelUpTitle: labels.levelUpTitle || 'Level Up!',
            levelUpMessage: labels.levelUpMessage?.replace('{prevLevel}', previousLevel.toString()).replace('{newLevel}', newLevel.toString()) ||
                           `You have advanced from level ${previousLevel} to level ${newLevel}!`,
            closeButton: labels.buttons?.close || 'Continue',
            rewardsTitle: labels.rewardTitle || 'New Rewards Unlocked',
            freeRewardLabel: labels.freeRewardsLabel || 'Free Reward',
            premiumRewardLabel: labels.premiumRewardsLabel || 'Premium Reward',
            premiumLockedLabel: labels.premiumLockedLabel || 'Premium Pass Required'
          }}
        />

        {/* Season Theme Banner */}
        <BattlePassSeasonTheme
          themeKey={battlePassData?.pass?.seasonTheme || 'default'}
          seasonName={battlePassData?.pass?.seasonName || 'Current Season'}
          endDate={battlePassData?.pass?.endDate ? new Date(battlePassData.pass.endDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
          labels={{
            seasonEndsIn: labels.seasonEndsIn || 'Season ends in',
            days: labels.daysLabel || 'days',
            hours: labels.hoursLabel || 'hours',
            minutes: labels.minutesLabel || 'minutes'
          }}
        />

        <div className="battle-pass-content" style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
          {/* Header Section */}
          <motion.div
            className="battle-pass-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className="back-button jade-button"
              onClick={handleBackClick}
            >
              {labels.buttons?.back || 'Back'}
            </button>
            <h1 className="battle-pass-title">
              {labels.headerTitle || battlePassData.pass.seasonName}
            </h1>
            <p className="battle-pass-subtitle">
              {labels.headerSubtitle}
            </p>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            className="battle-pass-progress-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="battle-pass-level-info">
              <div className="current-level">
                <span className="level-label">{labels.currentLevelLabel}</span>
                <span className="level-value">{battlePassData.userProgress?.currentLevel || 1}</span>
              </div>
              <div className="next-level">
                <span className="level-label">{labels.nextLevelLabel}</span>
                <span className="level-value">{(battlePassData.userProgress?.currentLevel || 1) + 1}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="battle-pass-progress-bar">
              <div
                className="battle-pass-progress-fill"
                style={{
                  width: `${battlePassData.userProgress ?
                    (battlePassData.userProgress.currentExp / 100) : 0}%`
                }}
              ></div>
            </div>

            <div className="battle-pass-exp-info">
              <span className="exp-label">{labels.expLabel}</span>
              <span className="exp-value">{battlePassData.userProgress?.currentExp || 0}</span>
            </div>
          </motion.div>

          {/* Purchase Section (if not purchased) */}
          {!battlePassData.userOwnership && (
            <motion.div
              className="battle-pass-purchase-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button
                className="purchase-standard-button gold-button"
                onClick={async () => {
                  try {
                    setPurchasing(true);
                    // In a real app, you would get the current user ID
                    const userId = 'current-user';
                    const passId = battlePassData.pass.id;

                    const result = await purchaseBattlePass(
                      userId,
                      passId,
                      BattlePassType.STANDARD
                    );

                    if (result) {
                      // Play purchase sound
                      playSound(SoundType.REWARD_RARE);
                      // Refresh Battle Pass data
                      fetchBattlePassData();
                    } else {
                      throw new Error(labels.errorMessages?.failedToPurchase || 'Failed to purchase Battle Pass');
                    }
                  } catch (err) {
                    console.error('Failed to purchase Battle Pass:', err);
                    // Show error message to user
                    alert(labels.errorMessages?.failedToPurchase || 'Failed to purchase Battle Pass');
                  } finally {
                    setPurchasing(false);
                  }
                }}
                disabled={purchasing}
              >
                {purchasing ? (labels.buttons?.processing || 'Processing...') : labels.purchaseStandardPassButton}
              </button>
              <button
                className="purchase-premium-button imperial-button"
                onClick={async () => {
                  try {
                    setPurchasing(true);
                    // In a real app, you would get the current user ID
                    const userId = 'current-user';
                    const passId = battlePassData.pass.id;

                    const result = await purchaseBattlePass(
                      userId,
                      passId,
                      BattlePassType.PREMIUM
                    );

                    if (result) {
                      // Play purchase sound
                      playSound(SoundType.REWARD_LEGENDARY);
                      // Refresh Battle Pass data
                      fetchBattlePassData();
                    } else {
                      throw new Error(labels.errorMessages?.failedToPurchase || 'Failed to purchase Battle Pass');
                    }
                  } catch (err) {
                    console.error('Failed to purchase Battle Pass:', err);
                    // Show error message to user
                    alert(labels.errorMessages?.failedToPurchase || 'Failed to purchase Battle Pass');
                  } finally {
                    setPurchasing(false);
                  }
                }}
                disabled={purchasing}
              >
                {purchasing ? (labels.buttons?.processing || 'Processing...') : labels.purchasePremiumPassButton}
              </button>
            </motion.div>
          )}

          {/* Levels Section */}
          {/* Stats Section */}
          {battlePassData.userProgress && (
            <BattlePassStats
              currentLevel={battlePassData.userProgress.currentLevel}
              maxLevel={battlePassData.pass.maxLevel}
              currentExp={battlePassData.userProgress.currentExp}
              expForNextLevel={100} // Assuming 100 exp per level
              totalExpEarned={battlePassData.userProgress.totalExpEarned || 0}
              completedTasks={battlePassData.activeTasks.filter(task => task.isCompleted).length}
              totalTasks={battlePassData.activeTasks.length}
              claimedRewards={(battlePassData.userProgress.claimedFreeLevels?.filter(Boolean).length || 0) +
                             (battlePassData.userProgress.claimedPaidLevels?.filter(Boolean).length || 0)}
              totalRewards={battlePassData.levels.length * 2} // Free + Premium rewards
              daysRemaining={Math.ceil((new Date(battlePassData.pass.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
              hasPremiumPass={battlePassData.userOwnership?.passType === BattlePassType.PREMIUM}
              labels={{
                statsTitle: labels.statsTitle || 'Battle Pass Statistics',
                progressLabel: labels.progressLabel || 'Progress',
                levelLabel: labels.levelLabel || 'Level',
                expLabel: labels.expLabel || 'Experience',
                tasksLabel: labels.tasksLabel || 'Tasks',
                rewardsLabel: labels.rewardsLabel || 'Rewards',
                daysRemainingLabel: labels.daysRemainingLabel || 'Days Remaining',
                premiumStatusLabel: labels.premiumStatusLabel || 'Pass Type',
                premiumPassText: labels.premiumPassText || 'Premium Pass',
                freePassText: labels.freePassText || 'Free Pass',
                totalExpEarnedLabel: labels.totalExpEarnedLabel || 'Total XP Earned'
              }}
            />
          )}

          {/* Social Features */}
          <div className="battle-pass-social-features">
            <div className="social-features-row">
              <BattlePassDailyCheckin
                rewards={dailyRewards}
                currentDay={3}
                currentStreak={2}
                onClaimReward={async (day) => {
                  console.log(`Claiming reward for day ${day}`);
                  // In a real app, you would call an API to claim the reward
                  // and update the dailyRewards state
                  return true;
                }}
                labels={{
                  checkinTitle: labels.checkinTitle || 'Daily Check-in',
                  claimButtonLabel: labels.claimRewardButton || 'Claim',
                  closeButtonLabel: labels.buttons?.close || 'Close',
                  streakLabel: labels.streakLabel || 'Current Streak',
                  claimedLabel: labels.alreadyClaimedLabel || 'Claimed',
                  todayLabel: labels.todayLabel || 'Today',
                  lockedLabel: labels.lockedRewardLabel || 'Locked',
                  rewardClaimedLabel: labels.rewardClaimedLabel || 'Reward Claimed!',
                  dayLabel: labels.dayLabel || 'Day'
                }}
              />

              <BattlePassFriendInvite
                friends={friends}
                seasonName={battlePassData?.pass?.seasonName || 'Current Season'}
                onInviteFriend={async (friendId) => {
                  console.log(`Inviting friend ${friendId}`);
                  // In a real app, you would call an API to invite the friend
                  // and update the friends state
                  return true;
                }}
                onCopyInviteLink={async () => {
                  console.log('Copying invite link');
                  // In a real app, you would copy the invite link to the clipboard
                  return true;
                }}
                labels={{
                  inviteTitle: labels.inviteTitle || 'Invite Friends',
                  inviteButtonLabel: labels.buttons?.invite || 'Invite',
                  copyLinkButtonLabel: labels.buttons?.copyLink || 'Copy Invite Link',
                  closeButtonLabel: labels.buttons?.close || 'Close',
                  noFriendsLabel: labels.noFriendsLabel || 'No friends to invite',
                  inviteMessageLabel: labels.inviteMessageLabel || 'Invite your friends to join the Battle Pass and earn rewards together!',
                  inviteRewardsLabel: labels.inviteRewardsLabel || 'You\'ll receive 50 diamonds for each friend who joins!',
                  inviteLinkLabel: labels.inviteLinkLabel || 'Or share this invite link:',
                  alreadyInvitedLabel: labels.alreadyInvitedLabel || 'Invited',
                  alreadyJoinedLabel: labels.alreadyJoinedLabel || 'Joined',
                  inviteSentLabel: labels.inviteSentLabel || 'Invite Sent!',
                  linkCopiedLabel: labels.linkCopiedLabel || 'Link Copied!'
                }}
              />
            </div>

            <div className="social-features-row">
              <BattlePassEvents
                events={events}
                hasPremiumPass={!!battlePassData.userOwnership &&
                              battlePassData.userOwnership.passType === BattlePassType.PREMIUM}
                onJoinEvent={async (eventId) => {
                  console.log(`Joining event ${eventId}`);
                  // In a real app, you would call an API to join the event
                  // and update the events state
                  setEvents(prev => prev.map(event =>
                    event.id === eventId ? { ...event, hasParticipated: true } : event
                  ));
                  return true;
                }}
                onClaimRewards={async (eventId) => {
                  console.log(`Claiming rewards for event ${eventId}`);
                  // In a real app, you would call an API to claim the rewards
                  // and update the events state
                  setEvents(prev => prev.map(event =>
                    event.id === eventId ? { ...event, hasClaimedRewards: true } : event
                  ));

                  // Show reward animation
                  const event = events.find(e => e.id === eventId);
                  if (event && event.rewards.length > 0) {
                    const mainReward = event.rewards[0];
                    showReward({
                      name: mainReward.name,
                      icon: mainReward.icon,
                      quantity: mainReward.quantity,
                      rarity: mainReward.rarity,
                      description: `Reward for completing the "${event.name}" event`
                    });
                  }

                  return true;
                }}
                labels={{
                  eventsTitle: labels.eventsTitle || 'Special Events',
                  joinButtonLabel: labels.buttons?.participate || 'Join Event',
                  claimRewardsButtonLabel: labels.buttons?.claimRewardsButtonLabel || 'Claim Rewards',
                  closeButtonLabel: labels.buttons?.close || 'Close',
                  noEventsLabel: labels.noEventsLabel || 'No events available',
                  premiumOnlyLabel: labels.premiumOnlyLabel || 'Premium Only',
                  eventDetailsButtonLabel: labels.buttons?.viewDetails || 'Details',
                  eventRewardsLabel: labels.eventRewardsLabel || 'Rewards',
                  eventRequirementsLabel: labels.eventRequirementsLabel || 'Requirements',
                  eventProgressLabel: labels.eventProgressLabel || 'Progress',
                  eventCompletedLabel: labels.eventCompletedLabel || 'Completed',
                  eventJoinedLabel: labels.eventJoinedLabel || 'Joined',
                  eventRewardsClaimedLabel: labels.eventRewardsClaimedLabel || 'Rewards Claimed',
                  timeRemainingLabel: labels.timeRemainingLabel || 'Time Remaining',
                  daysLabel: labels.daysLabel || 'days',
                  hoursLabel: labels.hoursLabel || 'hours',
                  minutesLabel: labels.minutesLabel || 'minutes',
                  eventStartDateLabel: labels.eventStartDateLabel || 'Start Date',
                  eventEndDateLabel: labels.eventEndDateLabel || 'End Date'
                }}
              />

              <BattlePassChallenges
                challenges={challenges}
                hasPremiumPass={!!battlePassData.userOwnership &&
                              battlePassData.userOwnership.passType === BattlePassType.PREMIUM}
                onAcceptChallenge={async (challengeId) => {
                  console.log(`Accepting challenge ${challengeId}`);
                  // In a real app, you would call an API to accept the challenge
                  // and update the challenges state
                  setChallenges(prev => prev.map(challenge =>
                    challenge.id === challengeId ? { ...challenge, isAccepted: true } : challenge
                  ));
                  return true;
                }}
                onClaimRewards={async (challengeId) => {
                  console.log(`Claiming rewards for challenge ${challengeId}`);
                  // In a real app, you would call an API to claim the rewards
                  // and update the challenges state
                  setChallenges(prev => prev.map(challenge =>
                    challenge.id === challengeId ? { ...challenge, hasClaimedRewards: true } : challenge
                  ));

                  // Show reward animation
                  const challenge = challenges.find(c => c.id === challengeId);
                  if (challenge && challenge.rewards.length > 0) {
                    const mainReward = challenge.rewards[0];
                    showReward({
                      name: mainReward.name,
                      icon: mainReward.icon,
                      quantity: mainReward.quantity,
                      rarity: mainReward.rarity,
                      description: `Reward for completing the "${challenge.name}" challenge`
                    });
                  }

                  return true;
                }}
                labels={{
                  challengesTitle: labels.challengesTitle || 'Limited-Time Challenges',
                  acceptButtonLabel: labels.buttons?.acceptChallenge || 'Accept',
                  claimRewardsButtonLabel: labels.buttons?.claimRewardsButtonLabel || 'Claim Rewards',
                  closeButtonLabel: labels.buttons?.close || 'Close',
                  noChallengesLabel: labels.noChallengesLabel || 'No challenges available',
                  premiumOnlyLabel: labels.premiumOnlyLabel || 'Premium Only',
                  challengeDetailsButtonLabel: labels.buttons?.viewDetails || 'Details',
                  challengeRewardsLabel: labels.challengeRewardsLabel || 'Rewards',
                  challengeStepsLabel: labels.challengeStepsLabel || 'Steps',
                  challengeDifficultyLabel: labels.challengeDifficultyLabel || 'Difficulty',
                  challengeCompletedLabel: labels.challengeCompletedLabel || 'Completed',
                  challengeAcceptedLabel: labels.challengeAcceptedLabel || 'Accepted',
                  challengeRewardsClaimedLabel: labels.challengeRewardsClaimedLabel || 'Rewards Claimed',
                  timeRemainingLabel: labels.timeRemainingLabel || 'Time Remaining',
                  daysLabel: labels.daysLabel || 'days',
                  hoursLabel: labels.hoursLabel || 'hours',
                  minutesLabel: labels.minutesLabel || 'minutes',
                  challengeExpiredLabel: labels.challengeExpiredLabel || 'Expired'
                }}
              />
            </div>

            <div className="social-features-row">
              <BattlePassLeaderboard
                entries={leaderboardEntries}
                currentUserId="current-user"
                onRefresh={() => console.log('Refreshing leaderboard...')}
                labels={{
                  leaderboardTitle: labels.leaderboardTitle || 'Leaderboard',
                  rankLabel: labels.rankLabel || 'Rank',
                  playerLabel: labels.playerLabel || 'Player',
                  levelLabel: labels.levelLabel || 'Level',
                  premiumBadgeLabel: labels.premiumBadgeLabel || 'Premium',
                  refreshButtonLabel: labels.refreshButtonLabel || 'Refresh',
                  noEntriesLabel: labels.noEntriesLabel || 'No entries yet',
                  loadingLabel: labels.loadingLabel || 'Loading...',
                  youLabel: labels.youLabel || 'You'
                }}
              />

              <BattlePassHistory
                historyEntries={historyEntries}
                onSeasonSelected={(seasonId) => {
                  console.log(`Selected season ${seasonId}`);
                  // In a real app, you would navigate to the season details page
                }}
                labels={{
                  historyTitle: labels.historyTitle || 'Season History',
                  seasonLabel: labels.seasonLabel || 'Season',
                  levelLabel: labels.levelLabel || 'Level',
                  tasksLabel: labels.tasksLabel || 'Tasks',
                  rewardsLabel: labels.rewardsLabel || 'Rewards',
                  rankLabel: labels.rankLabel || 'Rank',
                  premiumStatusLabel: labels.premiumStatusLabel || 'Pass Type',
                  premiumPassText: labels.premiumPassText || 'Premium Pass',
                  freePassText: labels.freePassText || 'Free Pass',
                  notableRewardsLabel: labels.notableRewardsLabel || 'Notable Rewards',
                  achievementsLabel: labels.achievementsLabel || 'Achievements',
                  closeButtonLabel: labels.buttons?.close || 'Close',
                  noHistoryLabel: labels.noHistoryLabel || 'No season history yet',
                  viewDetailsButtonLabel: labels.buttons?.viewDetails || 'View Details',
                  seasonDatesLabel: labels.seasonDatesLabel || 'Season Dates'
                }}
              />
            </div>

            <BattlePassAchievements
              achievements={achievements}
              onClaimReward={(achievementId) => {
                console.log(`Claiming reward for achievement ${achievementId}`);
                // In a real app, you would call an API to claim the reward
                // and update the achievements state

                // Show reward animation
                const achievement = achievements.find(a => a.id === achievementId);
                if (achievement) {
                  showReward({
                    name: achievement.reward || 'Mystery Reward',
                    icon: '🎁',
                    quantity: 1,
                    rarity: achievement.rarity,
                    description: `Reward for completing the "${achievement.name}" achievement`
                  });
                }
              }}
              labels={{
                achievementsTitle: labels.achievementsTitle || 'Achievements',
                progressLabel: labels.progressLabel || 'Progress',
                claimButtonLabel: labels.claimRewardButton || 'Claim',
                lockedLabel: labels.lockedRewardLabel || 'Locked',
                unlockedLabel: labels.unlockedLabel || 'Unlocked',
                closeButtonLabel: labels.buttons?.close || 'Close',
                noAchievementsLabel: labels.noAchievementsLabel || 'No achievements yet',
                rarityLabels: {
                  common: labels.rarityLabels?.common || 'Common',
                  uncommon: labels.rarityLabels?.uncommon || 'Uncommon',
                  rare: labels.rarityLabels?.rare || 'Rare',
                  epic: labels.rarityLabels?.epic || 'Epic',
                  legendary: labels.rarityLabels?.legendary || 'Legendary'
                }
              }}
            />
          </div>

          {/* Task Recommendations */}
          {battlePassData.activeTasks && battlePassData.activeTasks.length > 0 && (
            <BattlePassTaskRecommendations
              allTasks={battlePassData.activeTasks}
              userLevel={battlePassData.userProgress?.currentLevel || 1}
              onTaskSelected={(taskId) => {
                console.log(`Selected task ${taskId}`);
                // In a real app, you would navigate to the task or show more details
              }}
              labels={{
                recommendationsTitle: labels.recommendationsTitle || 'Task Recommendations',
                recommendedTasksLabel: labels.recommendedTasksLabel || 'Recommended',
                easyTasksLabel: labels.easyTasksLabel || 'Easy',
                quickTasksLabel: labels.quickTasksLabel || 'Quick',
                highRewardTasksLabel: labels.highRewardTasksLabel || 'High Reward',
                startTaskButtonLabel: labels.buttons?.startTask || 'Start Task',
                noRecommendationsLabel: labels.noRecommendationsLabel || 'No recommendations available',
                difficultyLabel: labels.difficultyLabel || 'Difficulty',
                timeLabel: labels.timeLabel || 'Time',
                rewardLabel: labels.rewardLabel || 'Reward'
              }}
            />
          )}

          {/* Rewards Preview */}
          <BattlePassRewardsPreview
            levels={battlePassData.levels}
            hasPremiumPass={!!battlePassData.userOwnership &&
                          battlePassData.userOwnership.passType === BattlePassType.PREMIUM}
            labels={{
              rewardsPreviewTitle: labels.rewardsPreviewTitle || 'Rewards Preview',
              freeRewardsLabel: labels.freeRewardsLabel || 'Free Rewards',
              premiumRewardsLabel: labels.premiumRewardsLabel || 'Premium Rewards',
              premiumLockedLabel: labels.premiumLockedLabel || 'Premium Pass Required',
              closeButtonLabel: labels.buttons?.close || 'Close'
            }}
          />

          <motion.div
            className="battle-pass-levels-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="battle-pass-tracks-header">
              <div className="free-track-header">
                <h3>{labels.freeTrackTitle}</h3>
              </div>
              <div className="paid-track-header">
                <h3>{labels.paidTrackTitle}</h3>
              </div>

              {/* Level Purchase UI */}
              {battlePassData.userOwnership && (
                <div className="level-purchase-container">
                  <div className="level-purchase-controls">
                    <button
                      className="level-adjust-button"
                      onClick={() => setLevelsToPurchase(Math.max(1, levelsToPurchase - 1))}
                      disabled={levelsToPurchase <= 1}
                    >
                      -
                    </button>
                    <span className="levels-to-purchase">{levelsToPurchase}</span>
                    <button
                      className="level-adjust-button"
                      onClick={() => setLevelsToPurchase(Math.min(10, levelsToPurchase + 1))}
                      disabled={levelsToPurchase >= 10}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="purchase-level-button jade-button"
                    onClick={async () => {
                      try {
                        setPurchasingLevel(true);

                        // Calculate diamond cost
                        const diamondCost = levelsToPurchase * battlePassData.pass.levelPurchaseDiamondCost;

                        // Confirm purchase with user
                        if (!window.confirm(`Purchase ${levelsToPurchase} level(s) for ${diamondCost} diamonds?`)) {
                          setPurchasingLevel(false);
                          return;
                        }

                        const result = await purchaseBattlePassLevels(
                          'current-user',
                          battlePassData.pass.id,
                          levelsToPurchase
                        );

                        if (result) {
                          // Play purchase sound
                          playSound(SoundType.REWARD_EPIC);
                          // Refresh Battle Pass data
                          fetchBattlePassData();
                        } else {
                          throw new Error(labels.errorMessages?.failedToPurchaseLevel || 'Failed to purchase levels');
                        }
                      } catch (err) {
                        console.error('Failed to purchase levels:', err);
                        // Show error message to user
                        alert(labels.errorMessages?.failedToPurchaseLevel || 'Failed to purchase levels');
                      } finally {
                        setPurchasingLevel(false);
                      }
                    }}
                    disabled={purchasingLevel}
                  >
                    {purchasingLevel ? (labels.buttons?.processing || 'Processing...') : `${labels.levelPurchaseButton} (${levelsToPurchase * battlePassData.pass.levelPurchaseDiamondCost} 💎)`}
                  </button>
                </div>
              )}
            </div>

            <div className="battle-pass-levels">
              {battlePassData.levels && battlePassData.levels.map((level) => {
                // Get claimed levels arrays
                const claimedFreeLevels = battlePassData.userProgress?.claimedFreeLevels
                  ? battlePassData.userProgress.claimedFreeLevels.filter(Boolean)
                  : [];

                const claimedPaidLevels = battlePassData.userProgress?.claimedPaidLevels
                  ? battlePassData.userProgress.claimedPaidLevels.filter(Boolean)
                  : [];

                // Check if user has purchased the pass
                const isPurchased = !!battlePassData.userOwnership;

                // Get current level
                const currentLevel = battlePassData.userProgress?.currentLevel || 1;

                return (
                  <BattlePassLevel
                    key={level.levelNumber}
                    level={level}
                    currentLevel={currentLevel}
                    isPurchased={isPurchased}
                    claimedFreeLevels={claimedFreeLevels}
                    claimedPaidLevels={claimedPaidLevels}
                    onLevelUp={(prevLevel, newLevel) => {
                      // Show level up animation
                      showLevelUp(prevLevel, newLevel);
                    }}
                    onClaimReward={async (levelNumber, rewardType) => {
                      try {
                        setClaimingReward(true);
                        // In a real app, you would get the current user ID
                        const userId = 'current-user';
                        const passId = battlePassData.pass.id;

                        const success = await claimBattlePassReward(
                          userId,
                          passId,
                          levelNumber,
                          rewardType
                        );

                        if (success) {
                          // Play reward sound
                          playSound(SoundType.REWARD_UNCOMMON);
                          // Refresh Battle Pass data
                          fetchBattlePassData();
                        } else {
                          throw new Error(labels.errorMessages?.failedToClaim || 'Failed to claim reward');
                        }
                      } catch (err) {
                        console.error('Failed to claim reward:', err);
                        // Show error message to user
                        alert(labels.errorMessages?.failedToClaim || 'Failed to claim reward');
                      } finally {
                        setClaimingReward(false);
                      }
                    }}
                    labels={{
                      claimRewardButton: labels.claimRewardButton,
                      alreadyClaimedLabel: labels.alreadyClaimedLabel,
                      lockedRewardLabel: labels.lockedRewardLabel,
                      vipOnlyLabel: labels.vipOnlyLabel
                    }}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Tasks Section */}
          <motion.div
            className="battle-pass-tasks-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="tasks-title">{labels.tasksTitle}</h2>

            <div className="battle-pass-tasks">
              {battlePassData.activeTasks && battlePassData.activeTasks.map((task) => (
                <BattlePassTask
                  key={task.id}
                  task={task}
                  onCompleteTask={async (taskId) => {
                    try {
                      setCompletingTask(true);
                      // In a real app, you would get the current user ID
                      const userId = 'current-user';
                      const passId = battlePassData.pass.id;

                      // Find the task to get its exp reward
                      const task = battlePassData.activeTasks.find((t: any) => t.id === taskId);
                      if (!task) {
                        throw new Error('Task not found');
                      }

                      // Track the game action based on task type
                      const actionType = getGameActionTypeForTask(task);
                      await trackGameAction(userId, actionType);

                      // Add experience to user's Battle Pass progress
                      const updatedProgress = await addBattlePassExperience(
                        userId,
                        passId,
                        task.expReward
                      );

                      if (updatedProgress) {
                        // Play task completion sound
                        playSound(SoundType.COMPLETE);

                        // Show toast notification
                        setCompletedTask({
                          name: task.taskName,
                          expReward: task.expReward
                        });
                        setToastVisible(true);

                        // Refresh Battle Pass data
                        fetchBattlePassData();
                      } else {
                        throw new Error(labels.errorMessages?.failedToCompleteTask || 'Failed to complete task');
                      }
                    } catch (err) {
                      console.error('Failed to complete task:', err);
                      // Show error message to user
                      alert(labels.errorMessages?.failedToCompleteTask || 'Failed to complete task');
                    } finally {
                      setCompletingTask(false);
                    }
                  }}
                  labels={{
                    taskTypes: labels.taskTypes,
                    taskProgressLabel: labels.taskProgressLabel,
                    taskCompletedLabel: labels.taskCompletedLabel
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Task Completion Toast */}
      {completedTask && (
        <TaskCompletionToast
          isVisible={toastVisible}
          taskName={completedTask.name}
          expReward={completedTask.expReward}
          onClose={() => setToastVisible(false)}
        />
      )}
    </PageTransition>
  );
};

export default BattlePassPage;