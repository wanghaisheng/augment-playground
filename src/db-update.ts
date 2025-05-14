// src/db-update.ts
import { db } from './db';

/**
 * Add VIP navigation labels to the database
 * This function adds the VIP and Battle Pass navigation labels to the database
 *
 * @returns A promise that resolves when the labels are added
 */
export async function addVipNavigationLabels(): Promise<void> {
  try {
    // Check if VIP navigation labels already exist
    const existingEnLabel = await db.uiLabels.where({
      scopeKey: 'globalLayout',
      labelKey: 'navVip',
      languageCode: 'en'
    }).first();

    if (existingEnLabel) {
      console.log('VIP navigation labels already exist');
    } else {
      // Add VIP navigation labels
      await db.uiLabels.bulkAdd([
        { scopeKey: 'globalLayout', labelKey: 'navVip', languageCode: 'en', translatedText: 'VIP' },
        { scopeKey: 'globalLayout', labelKey: 'navVip', languageCode: 'zh', translatedText: 'VIP' },
      ]);
      console.log('Added VIP navigation labels');
    }

    // Check if Battle Pass navigation labels already exist
    const existingBattlePassLabel = await db.uiLabels.where({
      scopeKey: 'globalLayout',
      labelKey: 'navBattlePass',
      languageCode: 'en'
    }).first();

    if (existingBattlePassLabel) {
      console.log('Battle Pass navigation labels already exist');
      return;
    }

    // Add Battle Pass navigation labels
    await db.uiLabels.bulkAdd([
      { scopeKey: 'globalLayout', labelKey: 'navBattlePass', languageCode: 'en', translatedText: 'Battle Pass' },
      { scopeKey: 'globalLayout', labelKey: 'navBattlePass', languageCode: 'zh', translatedText: '通行证' },
    ]);

    console.log('Added Battle Pass navigation labels');
  } catch (error) {
    console.error('Failed to add navigation labels:', error);
  }
}

/**
 * Add Battle Pass page view labels to the database
 * This function adds all the labels needed for the Battle Pass page
 *
 * @returns A promise that resolves when the labels are added
 */
export async function addBattlePassPageViewLabels(): Promise<void> {
  try {
    // Check if Battle Pass page view labels already exist
    const existingLabel = await db.uiLabels.where({
      scopeKey: 'battlePassPageView',
      labelKey: 'pageTitle',
      languageCode: 'en'
    }).first();

    if (existingLabel) {
      console.log('Battle Pass page view labels already exist');
      return;
    }

    // Add Battle Pass page view labels
    await db.uiLabels.bulkAdd([
      // Page title and header
      { scopeKey: 'battlePassPageView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Battle Pass' },
      { scopeKey: 'battlePassPageView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '通行证' },
      { scopeKey: 'battlePassPageView', labelKey: 'headerTitle', languageCode: 'en', translatedText: 'Panda Cultivation Realm' },
      { scopeKey: 'battlePassPageView', labelKey: 'headerTitle', languageCode: 'zh', translatedText: '熊猫修行秘境' },
      { scopeKey: 'battlePassPageView', labelKey: 'headerSubtitle', languageCode: 'en', translatedText: 'Complete tasks to earn rewards and advance your journey' },
      { scopeKey: 'battlePassPageView', labelKey: 'headerSubtitle', languageCode: 'zh', translatedText: '完成任务获取奖励，提升你的修行之旅' },

      // Track titles
      { scopeKey: 'battlePassPageView', labelKey: 'freeTrackTitle', languageCode: 'en', translatedText: 'Free Track' },
      { scopeKey: 'battlePassPageView', labelKey: 'freeTrackTitle', languageCode: 'zh', translatedText: '免费赛道' },
      { scopeKey: 'battlePassPageView', labelKey: 'paidTrackTitle', languageCode: 'en', translatedText: 'Premium Track' },
      { scopeKey: 'battlePassPageView', labelKey: 'paidTrackTitle', languageCode: 'zh', translatedText: '高级赛道' },

      // Level and progress labels
      { scopeKey: 'battlePassPageView', labelKey: 'currentLevelLabel', languageCode: 'en', translatedText: 'Current Level' },
      { scopeKey: 'battlePassPageView', labelKey: 'currentLevelLabel', languageCode: 'zh', translatedText: '当前等级' },
      { scopeKey: 'battlePassPageView', labelKey: 'nextLevelLabel', languageCode: 'en', translatedText: 'Next Level' },
      { scopeKey: 'battlePassPageView', labelKey: 'nextLevelLabel', languageCode: 'zh', translatedText: '下一等级' },
      { scopeKey: 'battlePassPageView', labelKey: 'expLabel', languageCode: 'en', translatedText: 'Experience' },
      { scopeKey: 'battlePassPageView', labelKey: 'expLabel', languageCode: 'zh', translatedText: '经验值' },

      // Purchase buttons
      { scopeKey: 'battlePassPageView', labelKey: 'purchaseStandardPassButton', languageCode: 'en', translatedText: 'Purchase Standard Pass' },
      { scopeKey: 'battlePassPageView', labelKey: 'purchaseStandardPassButton', languageCode: 'zh', translatedText: '购买标准通行证' },
      { scopeKey: 'battlePassPageView', labelKey: 'purchasePremiumPassButton', languageCode: 'en', translatedText: 'Purchase Premium Pass' },
      { scopeKey: 'battlePassPageView', labelKey: 'purchasePremiumPassButton', languageCode: 'zh', translatedText: '购买高级通行证' },
      { scopeKey: 'battlePassPageView', labelKey: 'alreadyPurchasedMessage', languageCode: 'en', translatedText: 'You have already purchased this pass' },
      { scopeKey: 'battlePassPageView', labelKey: 'alreadyPurchasedMessage', languageCode: 'zh', translatedText: '你已经购买了此通行证' },
      { scopeKey: 'battlePassPageView', labelKey: 'levelPurchaseButton', languageCode: 'en', translatedText: 'Purchase Level' },
      { scopeKey: 'battlePassPageView', labelKey: 'levelPurchaseButton', languageCode: 'zh', translatedText: '购买等级' },

      // Reward labels
      { scopeKey: 'battlePassPageView', labelKey: 'claimRewardButton', languageCode: 'en', translatedText: 'Claim' },
      { scopeKey: 'battlePassPageView', labelKey: 'claimRewardButton', languageCode: 'zh', translatedText: '领取' },
      { scopeKey: 'battlePassPageView', labelKey: 'alreadyClaimedLabel', languageCode: 'en', translatedText: 'Claimed' },
      { scopeKey: 'battlePassPageView', labelKey: 'alreadyClaimedLabel', languageCode: 'zh', translatedText: '已领取' },
      { scopeKey: 'battlePassPageView', labelKey: 'lockedRewardLabel', languageCode: 'en', translatedText: 'Locked' },
      { scopeKey: 'battlePassPageView', labelKey: 'lockedRewardLabel', languageCode: 'zh', translatedText: '已锁定' },
      { scopeKey: 'battlePassPageView', labelKey: 'vipOnlyLabel', languageCode: 'en', translatedText: 'VIP Only' },
      { scopeKey: 'battlePassPageView', labelKey: 'vipOnlyLabel', languageCode: 'zh', translatedText: '仅限VIP' },

      // Level up modal labels
      { scopeKey: 'battlePassPageView', labelKey: 'levelUpTitle', languageCode: 'en', translatedText: 'Level Up!' },
      { scopeKey: 'battlePassPageView', labelKey: 'levelUpTitle', languageCode: 'zh', translatedText: '等级提升！' },
      { scopeKey: 'battlePassPageView', labelKey: 'levelUpMessage', languageCode: 'en', translatedText: 'You have advanced from level {prevLevel} to level {newLevel}!' },
      { scopeKey: 'battlePassPageView', labelKey: 'levelUpMessage', languageCode: 'zh', translatedText: '你已经从{prevLevel}级提升到{newLevel}级！' },
      { scopeKey: 'battlePassPageView', labelKey: 'rewardsTitle', languageCode: 'en', translatedText: 'New Rewards Unlocked' },
      { scopeKey: 'battlePassPageView', labelKey: 'rewardsTitle', languageCode: 'zh', translatedText: '解锁新奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'freeRewardLabel', languageCode: 'en', translatedText: 'Free Reward' },
      { scopeKey: 'battlePassPageView', labelKey: 'freeRewardLabel', languageCode: 'zh', translatedText: '免费奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumRewardLabel', languageCode: 'en', translatedText: 'Premium Reward' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumRewardLabel', languageCode: 'zh', translatedText: '高级奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumLockedLabel', languageCode: 'en', translatedText: 'Premium Pass Required' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumLockedLabel', languageCode: 'zh', translatedText: '需要高级通行证' },

      // Season theme labels
      { scopeKey: 'battlePassPageView', labelKey: 'seasonEndsIn', languageCode: 'en', translatedText: 'Season ends in' },
      { scopeKey: 'battlePassPageView', labelKey: 'seasonEndsIn', languageCode: 'zh', translatedText: '赛季结束于' },
      { scopeKey: 'battlePassPageView', labelKey: 'daysLabel', languageCode: 'en', translatedText: 'days' },
      { scopeKey: 'battlePassPageView', labelKey: 'daysLabel', languageCode: 'zh', translatedText: '天' },
      { scopeKey: 'battlePassPageView', labelKey: 'hoursLabel', languageCode: 'en', translatedText: 'hours' },
      { scopeKey: 'battlePassPageView', labelKey: 'hoursLabel', languageCode: 'zh', translatedText: '小时' },
      { scopeKey: 'battlePassPageView', labelKey: 'minutesLabel', languageCode: 'en', translatedText: 'minutes' },
      { scopeKey: 'battlePassPageView', labelKey: 'minutesLabel', languageCode: 'zh', translatedText: '分钟' },

      // Stats labels
      { scopeKey: 'battlePassPageView', labelKey: 'statsTitle', languageCode: 'en', translatedText: 'Battle Pass Statistics' },
      { scopeKey: 'battlePassPageView', labelKey: 'statsTitle', languageCode: 'zh', translatedText: '通行证统计' },
      { scopeKey: 'battlePassPageView', labelKey: 'progressLabel', languageCode: 'en', translatedText: 'Progress' },
      { scopeKey: 'battlePassPageView', labelKey: 'progressLabel', languageCode: 'zh', translatedText: '进度' },
      { scopeKey: 'battlePassPageView', labelKey: 'levelLabel', languageCode: 'en', translatedText: 'Level' },
      { scopeKey: 'battlePassPageView', labelKey: 'levelLabel', languageCode: 'zh', translatedText: '等级' },
      { scopeKey: 'battlePassPageView', labelKey: 'expLabel', languageCode: 'en', translatedText: 'Experience' },
      { scopeKey: 'battlePassPageView', labelKey: 'expLabel', languageCode: 'zh', translatedText: '经验' },
      { scopeKey: 'battlePassPageView', labelKey: 'tasksLabel', languageCode: 'en', translatedText: 'Tasks' },
      { scopeKey: 'battlePassPageView', labelKey: 'tasksLabel', languageCode: 'zh', translatedText: '任务' },
      { scopeKey: 'battlePassPageView', labelKey: 'rewardsLabel', languageCode: 'en', translatedText: 'Rewards' },
      { scopeKey: 'battlePassPageView', labelKey: 'rewardsLabel', languageCode: 'zh', translatedText: '奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'daysRemainingLabel', languageCode: 'en', translatedText: 'Days Remaining' },
      { scopeKey: 'battlePassPageView', labelKey: 'daysRemainingLabel', languageCode: 'zh', translatedText: '剩余天数' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumStatusLabel', languageCode: 'en', translatedText: 'Pass Type' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumStatusLabel', languageCode: 'zh', translatedText: '通行证类型' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumPassText', languageCode: 'en', translatedText: 'Premium Pass' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumPassText', languageCode: 'zh', translatedText: '高级通行证' },
      { scopeKey: 'battlePassPageView', labelKey: 'freePassText', languageCode: 'en', translatedText: 'Free Pass' },
      { scopeKey: 'battlePassPageView', labelKey: 'freePassText', languageCode: 'zh', translatedText: '免费通行证' },
      { scopeKey: 'battlePassPageView', labelKey: 'totalExpEarnedLabel', languageCode: 'en', translatedText: 'Total XP Earned' },
      { scopeKey: 'battlePassPageView', labelKey: 'totalExpEarnedLabel', languageCode: 'zh', translatedText: '总获得经验' },

      // Rewards preview labels
      { scopeKey: 'battlePassPageView', labelKey: 'rewardsPreviewTitle', languageCode: 'en', translatedText: 'Rewards Preview' },
      { scopeKey: 'battlePassPageView', labelKey: 'rewardsPreviewTitle', languageCode: 'zh', translatedText: '奖励预览' },
      { scopeKey: 'battlePassPageView', labelKey: 'freeRewardsLabel', languageCode: 'en', translatedText: 'Free Rewards' },
      { scopeKey: 'battlePassPageView', labelKey: 'freeRewardsLabel', languageCode: 'zh', translatedText: '免费奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumRewardsLabel', languageCode: 'en', translatedText: 'Premium Rewards' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumRewardsLabel', languageCode: 'zh', translatedText: '高级奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'closeButtonLabel', languageCode: 'en', translatedText: 'Close' },
      { scopeKey: 'battlePassPageView', labelKey: 'closeButtonLabel', languageCode: 'zh', translatedText: '关闭' },

      // Leaderboard labels
      { scopeKey: 'battlePassPageView', labelKey: 'leaderboardTitle', languageCode: 'en', translatedText: 'Leaderboard' },
      { scopeKey: 'battlePassPageView', labelKey: 'leaderboardTitle', languageCode: 'zh', translatedText: '排行榜' },
      { scopeKey: 'battlePassPageView', labelKey: 'rankLabel', languageCode: 'en', translatedText: 'Rank' },
      { scopeKey: 'battlePassPageView', labelKey: 'rankLabel', languageCode: 'zh', translatedText: '排名' },
      { scopeKey: 'battlePassPageView', labelKey: 'playerLabel', languageCode: 'en', translatedText: 'Player' },
      { scopeKey: 'battlePassPageView', labelKey: 'playerLabel', languageCode: 'zh', translatedText: '玩家' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumBadgeLabel', languageCode: 'en', translatedText: 'Premium' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumBadgeLabel', languageCode: 'zh', translatedText: '高级' },
      { scopeKey: 'battlePassPageView', labelKey: 'refreshButtonLabel', languageCode: 'en', translatedText: 'Refresh' },
      { scopeKey: 'battlePassPageView', labelKey: 'refreshButtonLabel', languageCode: 'zh', translatedText: '刷新' },
      { scopeKey: 'battlePassPageView', labelKey: 'noEntriesLabel', languageCode: 'en', translatedText: 'No entries yet' },
      { scopeKey: 'battlePassPageView', labelKey: 'noEntriesLabel', languageCode: 'zh', translatedText: '暂无数据' },
      { scopeKey: 'battlePassPageView', labelKey: 'loadingLabel', languageCode: 'en', translatedText: 'Loading...' },
      { scopeKey: 'battlePassPageView', labelKey: 'loadingLabel', languageCode: 'zh', translatedText: '加载中...' },
      { scopeKey: 'battlePassPageView', labelKey: 'youLabel', languageCode: 'en', translatedText: 'You' },
      { scopeKey: 'battlePassPageView', labelKey: 'youLabel', languageCode: 'zh', translatedText: '你' },

      // Achievement labels
      { scopeKey: 'battlePassPageView', labelKey: 'achievementsTitle', languageCode: 'en', translatedText: 'Achievements' },
      { scopeKey: 'battlePassPageView', labelKey: 'achievementsTitle', languageCode: 'zh', translatedText: '成就' },
      { scopeKey: 'battlePassPageView', labelKey: 'claimButtonLabel', languageCode: 'en', translatedText: 'Claim' },
      { scopeKey: 'battlePassPageView', labelKey: 'claimButtonLabel', languageCode: 'zh', translatedText: '领取' },
      { scopeKey: 'battlePassPageView', labelKey: 'lockedLabel', languageCode: 'en', translatedText: 'Locked' },
      { scopeKey: 'battlePassPageView', labelKey: 'lockedLabel', languageCode: 'zh', translatedText: '未解锁' },
      { scopeKey: 'battlePassPageView', labelKey: 'unlockedLabel', languageCode: 'en', translatedText: 'Unlocked' },
      { scopeKey: 'battlePassPageView', labelKey: 'unlockedLabel', languageCode: 'zh', translatedText: '已解锁' },
      { scopeKey: 'battlePassPageView', labelKey: 'noAchievementsLabel', languageCode: 'en', translatedText: 'No achievements yet' },
      { scopeKey: 'battlePassPageView', labelKey: 'noAchievementsLabel', languageCode: 'zh', translatedText: '暂无成就' },
      { scopeKey: 'battlePassPageView', labelKey: 'commonRarityLabel', languageCode: 'en', translatedText: 'Common' },
      { scopeKey: 'battlePassPageView', labelKey: 'commonRarityLabel', languageCode: 'zh', translatedText: '普通' },
      { scopeKey: 'battlePassPageView', labelKey: 'uncommonRarityLabel', languageCode: 'en', translatedText: 'Uncommon' },
      { scopeKey: 'battlePassPageView', labelKey: 'uncommonRarityLabel', languageCode: 'zh', translatedText: '稀有' },
      { scopeKey: 'battlePassPageView', labelKey: 'rareRarityLabel', languageCode: 'en', translatedText: 'Rare' },
      { scopeKey: 'battlePassPageView', labelKey: 'rareRarityLabel', languageCode: 'zh', translatedText: '珍贵' },
      { scopeKey: 'battlePassPageView', labelKey: 'epicRarityLabel', languageCode: 'en', translatedText: 'Epic' },
      { scopeKey: 'battlePassPageView', labelKey: 'epicRarityLabel', languageCode: 'zh', translatedText: '史诗' },
      { scopeKey: 'battlePassPageView', labelKey: 'legendaryRarityLabel', languageCode: 'en', translatedText: 'Legendary' },
      { scopeKey: 'battlePassPageView', labelKey: 'legendaryRarityLabel', languageCode: 'zh', translatedText: '传说' },

      // Task recommendation labels
      { scopeKey: 'battlePassPageView', labelKey: 'recommendationsTitle', languageCode: 'en', translatedText: 'Task Recommendations' },
      { scopeKey: 'battlePassPageView', labelKey: 'recommendationsTitle', languageCode: 'zh', translatedText: '任务推荐' },
      { scopeKey: 'battlePassPageView', labelKey: 'recommendedTasksLabel', languageCode: 'en', translatedText: 'Recommended' },
      { scopeKey: 'battlePassPageView', labelKey: 'recommendedTasksLabel', languageCode: 'zh', translatedText: '推荐' },
      { scopeKey: 'battlePassPageView', labelKey: 'easyTasksLabel', languageCode: 'en', translatedText: 'Easy' },
      { scopeKey: 'battlePassPageView', labelKey: 'easyTasksLabel', languageCode: 'zh', translatedText: '简单' },
      { scopeKey: 'battlePassPageView', labelKey: 'quickTasksLabel', languageCode: 'en', translatedText: 'Quick' },
      { scopeKey: 'battlePassPageView', labelKey: 'quickTasksLabel', languageCode: 'zh', translatedText: '快速' },
      { scopeKey: 'battlePassPageView', labelKey: 'highRewardTasksLabel', languageCode: 'en', translatedText: 'High Reward' },
      { scopeKey: 'battlePassPageView', labelKey: 'highRewardTasksLabel', languageCode: 'zh', translatedText: '高奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'startTaskButtonLabel', languageCode: 'en', translatedText: 'Start Task' },
      { scopeKey: 'battlePassPageView', labelKey: 'startTaskButtonLabel', languageCode: 'zh', translatedText: '开始任务' },
      { scopeKey: 'battlePassPageView', labelKey: 'noRecommendationsLabel', languageCode: 'en', translatedText: 'No recommendations available' },
      { scopeKey: 'battlePassPageView', labelKey: 'noRecommendationsLabel', languageCode: 'zh', translatedText: '暂无推荐' },
      { scopeKey: 'battlePassPageView', labelKey: 'difficultyLabel', languageCode: 'en', translatedText: 'Difficulty' },
      { scopeKey: 'battlePassPageView', labelKey: 'difficultyLabel', languageCode: 'zh', translatedText: '难度' },
      { scopeKey: 'battlePassPageView', labelKey: 'timeLabel', languageCode: 'en', translatedText: 'Time' },
      { scopeKey: 'battlePassPageView', labelKey: 'timeLabel', languageCode: 'zh', translatedText: '时间' },

      // History labels
      { scopeKey: 'battlePassPageView', labelKey: 'historyTitle', languageCode: 'en', translatedText: 'Season History' },
      { scopeKey: 'battlePassPageView', labelKey: 'historyTitle', languageCode: 'zh', translatedText: '赛季历史' },
      { scopeKey: 'battlePassPageView', labelKey: 'seasonLabel', languageCode: 'en', translatedText: 'Season' },
      { scopeKey: 'battlePassPageView', labelKey: 'seasonLabel', languageCode: 'zh', translatedText: '赛季' },
      { scopeKey: 'battlePassPageView', labelKey: 'notableRewardsLabel', languageCode: 'en', translatedText: 'Notable Rewards' },
      { scopeKey: 'battlePassPageView', labelKey: 'notableRewardsLabel', languageCode: 'zh', translatedText: '重要奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'noHistoryLabel', languageCode: 'en', translatedText: 'No season history yet' },
      { scopeKey: 'battlePassPageView', labelKey: 'noHistoryLabel', languageCode: 'zh', translatedText: '暂无赛季历史' },
      { scopeKey: 'battlePassPageView', labelKey: 'viewDetailsButtonLabel', languageCode: 'en', translatedText: 'View Details' },
      { scopeKey: 'battlePassPageView', labelKey: 'viewDetailsButtonLabel', languageCode: 'zh', translatedText: '查看详情' },
      { scopeKey: 'battlePassPageView', labelKey: 'seasonDatesLabel', languageCode: 'en', translatedText: 'Season Dates' },
      { scopeKey: 'battlePassPageView', labelKey: 'seasonDatesLabel', languageCode: 'zh', translatedText: '赛季日期' },

      // Friend invite labels
      { scopeKey: 'battlePassPageView', labelKey: 'inviteTitle', languageCode: 'en', translatedText: 'Invite Friends' },
      { scopeKey: 'battlePassPageView', labelKey: 'inviteTitle', languageCode: 'zh', translatedText: '邀请好友' },
      { scopeKey: 'battlePassPageView', labelKey: 'inviteButtonLabel', languageCode: 'en', translatedText: 'Invite' },
      { scopeKey: 'battlePassPageView', labelKey: 'inviteButtonLabel', languageCode: 'zh', translatedText: '邀请' },
      { scopeKey: 'battlePassPageView', labelKey: 'copyLinkButtonLabel', languageCode: 'en', translatedText: 'Copy Invite Link' },
      { scopeKey: 'battlePassPageView', labelKey: 'copyLinkButtonLabel', languageCode: 'zh', translatedText: '复制邀请链接' },
      { scopeKey: 'battlePassPageView', labelKey: 'noFriendsLabel', languageCode: 'en', translatedText: 'No friends to invite' },
      { scopeKey: 'battlePassPageView', labelKey: 'noFriendsLabel', languageCode: 'zh', translatedText: '暂无好友可邀请' },
      { scopeKey: 'battlePassPageView', labelKey: 'inviteMessageLabel', languageCode: 'en', translatedText: 'Invite your friends to join the Battle Pass and earn rewards together!' },
      { scopeKey: 'battlePassPageView', labelKey: 'inviteMessageLabel', languageCode: 'zh', translatedText: '邀请好友加入通行证，一起获得奖励！' },
      { scopeKey: 'battlePassPageView', labelKey: 'inviteRewardsLabel', languageCode: 'en', translatedText: 'You\'ll receive 50 diamonds for each friend who joins!' },
      { scopeKey: 'battlePassPageView', labelKey: 'inviteRewardsLabel', languageCode: 'zh', translatedText: '每邀请一位好友加入，您将获得50钻石！' },
      { scopeKey: 'battlePassPageView', labelKey: 'inviteLinkLabel', languageCode: 'en', translatedText: 'Or share this invite link:' },
      { scopeKey: 'battlePassPageView', labelKey: 'inviteLinkLabel', languageCode: 'zh', translatedText: '或分享此邀请链接：' },
      { scopeKey: 'battlePassPageView', labelKey: 'alreadyInvitedLabel', languageCode: 'en', translatedText: 'Invited' },
      { scopeKey: 'battlePassPageView', labelKey: 'alreadyInvitedLabel', languageCode: 'zh', translatedText: '已邀请' },
      { scopeKey: 'battlePassPageView', labelKey: 'alreadyJoinedLabel', languageCode: 'en', translatedText: 'Joined' },
      { scopeKey: 'battlePassPageView', labelKey: 'alreadyJoinedLabel', languageCode: 'zh', translatedText: '已加入' },
      { scopeKey: 'battlePassPageView', labelKey: 'inviteSentLabel', languageCode: 'en', translatedText: 'Invite Sent!' },
      { scopeKey: 'battlePassPageView', labelKey: 'inviteSentLabel', languageCode: 'zh', translatedText: '邀请已发送！' },
      { scopeKey: 'battlePassPageView', labelKey: 'linkCopiedLabel', languageCode: 'en', translatedText: 'Link Copied!' },
      { scopeKey: 'battlePassPageView', labelKey: 'linkCopiedLabel', languageCode: 'zh', translatedText: '链接已复制！' },

      // Daily check-in labels
      { scopeKey: 'battlePassPageView', labelKey: 'checkinTitle', languageCode: 'en', translatedText: 'Daily Check-in' },
      { scopeKey: 'battlePassPageView', labelKey: 'checkinTitle', languageCode: 'zh', translatedText: '每日签到' },
      { scopeKey: 'battlePassPageView', labelKey: 'streakLabel', languageCode: 'en', translatedText: 'Current Streak' },
      { scopeKey: 'battlePassPageView', labelKey: 'streakLabel', languageCode: 'zh', translatedText: '当前连续签到' },
      { scopeKey: 'battlePassPageView', labelKey: 'claimedLabel', languageCode: 'en', translatedText: 'Claimed' },
      { scopeKey: 'battlePassPageView', labelKey: 'claimedLabel', languageCode: 'zh', translatedText: '已领取' },
      { scopeKey: 'battlePassPageView', labelKey: 'todayLabel', languageCode: 'en', translatedText: 'Today' },
      { scopeKey: 'battlePassPageView', labelKey: 'todayLabel', languageCode: 'zh', translatedText: '今天' },
      { scopeKey: 'battlePassPageView', labelKey: 'rewardClaimedLabel', languageCode: 'en', translatedText: 'Reward Claimed!' },
      { scopeKey: 'battlePassPageView', labelKey: 'rewardClaimedLabel', languageCode: 'zh', translatedText: '奖励已领取！' },
      { scopeKey: 'battlePassPageView', labelKey: 'dayLabel', languageCode: 'en', translatedText: 'Day' },
      { scopeKey: 'battlePassPageView', labelKey: 'dayLabel', languageCode: 'zh', translatedText: '第' },

      // Events labels
      { scopeKey: 'battlePassPageView', labelKey: 'eventsTitle', languageCode: 'en', translatedText: 'Special Events' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventsTitle', languageCode: 'zh', translatedText: '特别活动' },
      { scopeKey: 'battlePassPageView', labelKey: 'joinButtonLabel', languageCode: 'en', translatedText: 'Join Event' },
      { scopeKey: 'battlePassPageView', labelKey: 'joinButtonLabel', languageCode: 'zh', translatedText: '参加活动' },
      { scopeKey: 'battlePassPageView', labelKey: 'noEventsLabel', languageCode: 'en', translatedText: 'No events available' },
      { scopeKey: 'battlePassPageView', labelKey: 'noEventsLabel', languageCode: 'zh', translatedText: '暂无可用活动' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumOnlyLabel', languageCode: 'en', translatedText: 'Premium Only' },
      { scopeKey: 'battlePassPageView', labelKey: 'premiumOnlyLabel', languageCode: 'zh', translatedText: '仅限高级会员' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventDetailsButtonLabel', languageCode: 'en', translatedText: 'Details' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventDetailsButtonLabel', languageCode: 'zh', translatedText: '详情' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventRewardsLabel', languageCode: 'en', translatedText: 'Rewards' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventRewardsLabel', languageCode: 'zh', translatedText: '奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventRequirementsLabel', languageCode: 'en', translatedText: 'Requirements' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventRequirementsLabel', languageCode: 'zh', translatedText: '要求' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventProgressLabel', languageCode: 'en', translatedText: 'Progress' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventProgressLabel', languageCode: 'zh', translatedText: '进度' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventCompletedLabel', languageCode: 'en', translatedText: 'Completed' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventCompletedLabel', languageCode: 'zh', translatedText: '已完成' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventJoinedLabel', languageCode: 'en', translatedText: 'Joined' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventJoinedLabel', languageCode: 'zh', translatedText: '已参加' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventRewardsClaimedLabel', languageCode: 'en', translatedText: 'Rewards Claimed' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventRewardsClaimedLabel', languageCode: 'zh', translatedText: '已领取奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventStartDateLabel', languageCode: 'en', translatedText: 'Start Date' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventStartDateLabel', languageCode: 'zh', translatedText: '开始日期' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventEndDateLabel', languageCode: 'en', translatedText: 'End Date' },
      { scopeKey: 'battlePassPageView', labelKey: 'eventEndDateLabel', languageCode: 'zh', translatedText: '结束日期' },

      // Challenges labels
      { scopeKey: 'battlePassPageView', labelKey: 'challengesTitle', languageCode: 'en', translatedText: 'Limited-Time Challenges' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengesTitle', languageCode: 'zh', translatedText: '限时挑战' },
      { scopeKey: 'battlePassPageView', labelKey: 'acceptButtonLabel', languageCode: 'en', translatedText: 'Accept' },
      { scopeKey: 'battlePassPageView', labelKey: 'acceptButtonLabel', languageCode: 'zh', translatedText: '接受' },
      { scopeKey: 'battlePassPageView', labelKey: 'noChallengesLabel', languageCode: 'en', translatedText: 'No challenges available' },
      { scopeKey: 'battlePassPageView', labelKey: 'noChallengesLabel', languageCode: 'zh', translatedText: '暂无可用挑战' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeDetailsButtonLabel', languageCode: 'en', translatedText: 'Details' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeDetailsButtonLabel', languageCode: 'zh', translatedText: '详情' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeRewardsLabel', languageCode: 'en', translatedText: 'Rewards' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeRewardsLabel', languageCode: 'zh', translatedText: '奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeStepsLabel', languageCode: 'en', translatedText: 'Steps' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeStepsLabel', languageCode: 'zh', translatedText: '步骤' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeDifficultyLabel', languageCode: 'en', translatedText: 'Difficulty' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeDifficultyLabel', languageCode: 'zh', translatedText: '难度' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeCompletedLabel', languageCode: 'en', translatedText: 'Completed' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeCompletedLabel', languageCode: 'zh', translatedText: '已完成' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeAcceptedLabel', languageCode: 'en', translatedText: 'Accepted' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeAcceptedLabel', languageCode: 'zh', translatedText: '已接受' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeRewardsClaimedLabel', languageCode: 'en', translatedText: 'Rewards Claimed' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeRewardsClaimedLabel', languageCode: 'zh', translatedText: '已领取奖励' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeExpiredLabel', languageCode: 'en', translatedText: 'Expired' },
      { scopeKey: 'battlePassPageView', labelKey: 'challengeExpiredLabel', languageCode: 'zh', translatedText: '已过期' },

      // Reward animation labels
      { scopeKey: 'battlePassPageView', labelKey: 'rewardTitle', languageCode: 'en', translatedText: 'Reward Unlocked!' },
      { scopeKey: 'battlePassPageView', labelKey: 'rewardTitle', languageCode: 'zh', translatedText: '奖励已解锁！' },
      { scopeKey: 'battlePassPageView', labelKey: 'claimButtonLabel', languageCode: 'en', translatedText: 'Claim' },
      { scopeKey: 'battlePassPageView', labelKey: 'claimButtonLabel', languageCode: 'zh', translatedText: '领取' },
      { scopeKey: 'battlePassPageView', labelKey: 'rarityLabel', languageCode: 'en', translatedText: 'Rarity' },
      { scopeKey: 'battlePassPageView', labelKey: 'rarityLabel', languageCode: 'zh', translatedText: '稀有度' },
      { scopeKey: 'battlePassPageView', labelKey: 'commonRarityLabel', languageCode: 'en', translatedText: 'Common' },
      { scopeKey: 'battlePassPageView', labelKey: 'commonRarityLabel', languageCode: 'zh', translatedText: '普通' },
      { scopeKey: 'battlePassPageView', labelKey: 'uncommonRarityLabel', languageCode: 'en', translatedText: 'Uncommon' },
      { scopeKey: 'battlePassPageView', labelKey: 'uncommonRarityLabel', languageCode: 'zh', translatedText: '优秀' },
      { scopeKey: 'battlePassPageView', labelKey: 'rareRarityLabel', languageCode: 'en', translatedText: 'Rare' },
      { scopeKey: 'battlePassPageView', labelKey: 'rareRarityLabel', languageCode: 'zh', translatedText: '稀有' },
      { scopeKey: 'battlePassPageView', labelKey: 'epicRarityLabel', languageCode: 'en', translatedText: 'Epic' },
      { scopeKey: 'battlePassPageView', labelKey: 'epicRarityLabel', languageCode: 'zh', translatedText: '史诗' },
      { scopeKey: 'battlePassPageView', labelKey: 'legendaryRarityLabel', languageCode: 'en', translatedText: 'Legendary' },
      { scopeKey: 'battlePassPageView', labelKey: 'legendaryRarityLabel', languageCode: 'zh', translatedText: '传说' },

      // Level up effect labels
      { scopeKey: 'battlePassPageView', labelKey: 'levelUpTitle', languageCode: 'en', translatedText: 'Level Up!' },
      { scopeKey: 'battlePassPageView', labelKey: 'levelUpTitle', languageCode: 'zh', translatedText: '升级了！' },
      { scopeKey: 'battlePassPageView', labelKey: 'levelUpMessage', languageCode: 'en', translatedText: 'Congratulations! You\'ve reached a new level in the Battle Pass!' },
      { scopeKey: 'battlePassPageView', labelKey: 'levelUpMessage', languageCode: 'zh', translatedText: '恭喜！你在通行证中达到了新的等级！' },
      { scopeKey: 'battlePassPageView', labelKey: 'continueButtonLabel', languageCode: 'en', translatedText: 'Continue' },
      { scopeKey: 'battlePassPageView', labelKey: 'continueButtonLabel', languageCode: 'zh', translatedText: '继续' },

      // Share achievement labels
      { scopeKey: 'battlePassPageView', labelKey: 'shareTitle', languageCode: 'en', translatedText: 'Share Achievement' },
      { scopeKey: 'battlePassPageView', labelKey: 'shareTitle', languageCode: 'zh', translatedText: '分享成就' },
      { scopeKey: 'battlePassPageView', labelKey: 'downloadButtonLabel', languageCode: 'en', translatedText: 'Download' },
      { scopeKey: 'battlePassPageView', labelKey: 'downloadButtonLabel', languageCode: 'zh', translatedText: '下载' },
      { scopeKey: 'battlePassPageView', labelKey: 'copyButtonLabel', languageCode: 'en', translatedText: 'Copy' },
      { scopeKey: 'battlePassPageView', labelKey: 'copyButtonLabel', languageCode: 'zh', translatedText: '复制' },
      { scopeKey: 'battlePassPageView', labelKey: 'twitterButtonLabel', languageCode: 'en', translatedText: 'Twitter' },
      { scopeKey: 'battlePassPageView', labelKey: 'twitterButtonLabel', languageCode: 'zh', translatedText: 'Twitter' },
      { scopeKey: 'battlePassPageView', labelKey: 'facebookButtonLabel', languageCode: 'en', translatedText: 'Facebook' },
      { scopeKey: 'battlePassPageView', labelKey: 'facebookButtonLabel', languageCode: 'zh', translatedText: 'Facebook' },
      { scopeKey: 'battlePassPageView', labelKey: 'instagramButtonLabel', languageCode: 'en', translatedText: 'Instagram' },
      { scopeKey: 'battlePassPageView', labelKey: 'instagramButtonLabel', languageCode: 'zh', translatedText: 'Instagram' },
      { scopeKey: 'battlePassPageView', labelKey: 'achievementUnlockedLabel', languageCode: 'en', translatedText: 'Achievement Unlocked!' },
      { scopeKey: 'battlePassPageView', labelKey: 'achievementUnlockedLabel', languageCode: 'zh', translatedText: '成就已解锁！' },
      { scopeKey: 'battlePassPageView', labelKey: 'copiedLabel', languageCode: 'en', translatedText: 'Copied!' },
      { scopeKey: 'battlePassPageView', labelKey: 'copiedLabel', languageCode: 'zh', translatedText: '已复制！' },

      // Tasks section
      { scopeKey: 'battlePassPageView', labelKey: 'tasksTitle', languageCode: 'en', translatedText: 'Battle Pass Tasks' },
      { scopeKey: 'battlePassPageView', labelKey: 'tasksTitle', languageCode: 'zh', translatedText: '通行证任务' },
      { scopeKey: 'battlePassPageView', labelKey: 'taskTypeDaily', languageCode: 'en', translatedText: 'Daily' },
      { scopeKey: 'battlePassPageView', labelKey: 'taskTypeDaily', languageCode: 'zh', translatedText: '每日' },
      { scopeKey: 'battlePassPageView', labelKey: 'taskTypeWeekly', languageCode: 'en', translatedText: 'Weekly' },
      { scopeKey: 'battlePassPageView', labelKey: 'taskTypeWeekly', languageCode: 'zh', translatedText: '每周' },
      { scopeKey: 'battlePassPageView', labelKey: 'taskTypeSeasonal', languageCode: 'en', translatedText: 'Seasonal' },
      { scopeKey: 'battlePassPageView', labelKey: 'taskTypeSeasonal', languageCode: 'zh', translatedText: '赛季' },
      { scopeKey: 'battlePassPageView', labelKey: 'taskProgressLabel', languageCode: 'en', translatedText: 'Progress' },
      { scopeKey: 'battlePassPageView', labelKey: 'taskProgressLabel', languageCode: 'zh', translatedText: '进度' },
      { scopeKey: 'battlePassPageView', labelKey: 'taskCompletedLabel', languageCode: 'en', translatedText: 'Completed' },
      { scopeKey: 'battlePassPageView', labelKey: 'taskCompletedLabel', languageCode: 'zh', translatedText: '已完成' },

      // Empty state and error messages
      { scopeKey: 'battlePassPageView', labelKey: 'noActivePassMessage', languageCode: 'en', translatedText: 'No active Battle Pass at the moment. Check back later!' },
      { scopeKey: 'battlePassPageView', labelKey: 'noActivePassMessage', languageCode: 'zh', translatedText: '当前没有活跃的通行证。请稍后再来！' },
      { scopeKey: 'battlePassPageView', labelKey: 'errorFailedToLoad', languageCode: 'en', translatedText: 'Failed to load Battle Pass data' },
      { scopeKey: 'battlePassPageView', labelKey: 'errorFailedToLoad', languageCode: 'zh', translatedText: '加载通行证数据失败' },
      { scopeKey: 'battlePassPageView', labelKey: 'errorFailedToPurchase', languageCode: 'en', translatedText: 'Failed to purchase Battle Pass' },
      { scopeKey: 'battlePassPageView', labelKey: 'errorFailedToPurchase', languageCode: 'zh', translatedText: '购买通行证失败' },
      { scopeKey: 'battlePassPageView', labelKey: 'errorFailedToClaim', languageCode: 'en', translatedText: 'Failed to claim reward' },
      { scopeKey: 'battlePassPageView', labelKey: 'errorFailedToClaim', languageCode: 'zh', translatedText: '领取奖励失败' },
      { scopeKey: 'battlePassPageView', labelKey: 'errorFailedToCompleteTask', languageCode: 'en', translatedText: 'Failed to complete task' },
      { scopeKey: 'battlePassPageView', labelKey: 'errorFailedToCompleteTask', languageCode: 'zh', translatedText: '完成任务失败' },
      { scopeKey: 'battlePassPageView', labelKey: 'errorFailedToPurchaseLevel', languageCode: 'en', translatedText: 'Failed to purchase levels' },
      { scopeKey: 'battlePassPageView', labelKey: 'errorFailedToPurchaseLevel', languageCode: 'zh', translatedText: '购买等级失败' },

      // Buttons
      { scopeKey: 'battlePassPageView', labelKey: 'buttonBack', languageCode: 'en', translatedText: 'Back' },
      { scopeKey: 'battlePassPageView', labelKey: 'buttonBack', languageCode: 'zh', translatedText: '返回' },
      { scopeKey: 'battlePassPageView', labelKey: 'buttonRetry', languageCode: 'en', translatedText: 'Retry' },
      { scopeKey: 'battlePassPageView', labelKey: 'buttonRetry', languageCode: 'zh', translatedText: '重试' },
      { scopeKey: 'battlePassPageView', labelKey: 'buttonClose', languageCode: 'en', translatedText: 'Close' },
      { scopeKey: 'battlePassPageView', labelKey: 'buttonClose', languageCode: 'zh', translatedText: '关闭' },
    ]);

    console.log('Added Battle Pass page view labels');
  } catch (error) {
    console.error('Failed to add Battle Pass page view labels:', error);
  }
}
