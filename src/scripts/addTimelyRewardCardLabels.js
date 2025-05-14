// src/scripts/addTimelyRewardCardLabels.js
// 此脚本用于向数据库添加TimelyRewardCard组件的标签

// 导入数据库
const { db } = require('../db');

// 定义要添加的标签
const timelyRewardCardLabels = [
  // 类型标签
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeLabel', languageCode: 'en', translatedText: 'Type' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeLabel', languageCode: 'zh', translatedText: '类型' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeDaily', languageCode: 'en', translatedText: 'Daily Reward' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeDaily', languageCode: 'zh', translatedText: '每日奖励' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeMorning', languageCode: 'en', translatedText: 'Early Bird Reward' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeMorning', languageCode: 'zh', translatedText: '早起鸟奖励' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeStreak', languageCode: 'en', translatedText: 'Streak Reward' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeStreak', languageCode: 'zh', translatedText: '连续完成奖励' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeSpecial', languageCode: 'en', translatedText: 'Special Reward' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'typeSpecial', languageCode: 'zh', translatedText: '特殊奖励' },
  
  // 状态标签
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusLabel', languageCode: 'en', translatedText: 'Status' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusLabel', languageCode: 'zh', translatedText: '状态' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusActive', languageCode: 'en', translatedText: 'Active' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusActive', languageCode: 'zh', translatedText: '进行中' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusCompleted', languageCode: 'en', translatedText: 'Completed' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusCompleted', languageCode: 'zh', translatedText: '已完成' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusExpired', languageCode: 'en', translatedText: 'Expired' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusExpired', languageCode: 'zh', translatedText: '已过期' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusUpcoming', languageCode: 'en', translatedText: 'Upcoming' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'statusUpcoming', languageCode: 'zh', translatedText: '即将开始' },
  
  // 其他标签
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'remainingTimeLabel', languageCode: 'en', translatedText: 'Remaining time' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'remainingTimeLabel', languageCode: 'zh', translatedText: '剩余时间' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'timeEnded', languageCode: 'en', translatedText: 'Ended' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'timeEnded', languageCode: 'zh', translatedText: '已结束' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'hourUnit', languageCode: 'en', translatedText: 'h' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'hourUnit', languageCode: 'zh', translatedText: '小时' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'minuteUnit', languageCode: 'en', translatedText: 'm' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'minuteUnit', languageCode: 'zh', translatedText: '分钟' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'luckyPointsLabel', languageCode: 'en', translatedText: 'Lucky Points' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'luckyPointsLabel', languageCode: 'zh', translatedText: '幸运点' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'claimRewardButton', languageCode: 'en', translatedText: 'Claim Reward' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'claimRewardButton', languageCode: 'zh', translatedText: '领取奖励' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'inProgressButton', languageCode: 'en', translatedText: 'In Progress...' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'inProgressButton', languageCode: 'zh', translatedText: '进行中...' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'completedOnLabel', languageCode: 'en', translatedText: 'Completed on' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'completedOnLabel', languageCode: 'zh', translatedText: '完成于' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'progressLabel', languageCode: 'en', translatedText: 'Progress' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'progressLabel', languageCode: 'zh', translatedText: '进度' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'startTimeLabel', languageCode: 'en', translatedText: 'Start Time' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'startTimeLabel', languageCode: 'zh', translatedText: '开始时间' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'endTimeLabel', languageCode: 'en', translatedText: 'End Time' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'endTimeLabel', languageCode: 'zh', translatedText: '结束时间' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'completedTimeLabel', languageCode: 'en', translatedText: 'Completed Time' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'completedTimeLabel', languageCode: 'zh', translatedText: '完成时间' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'continueEffortButton', languageCode: 'en', translatedText: 'Keep Going' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'continueEffortButton', languageCode: 'zh', translatedText: '继续努力' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'noRewardsMessage', languageCode: 'en', translatedText: 'No timely rewards available' },
  { scopeKey: 'timelyRewardsView.rewardCard', labelKey: 'noRewardsMessage', languageCode: 'zh', translatedText: '暂无及时奖励' },
];

// 添加标签到数据库
async function addTimelyRewardCardLabels() {
  try {
    console.log('Adding TimelyRewardCard labels to database...');
    
    // 检查标签是否已存在
    for (const label of timelyRewardCardLabels) {
      const existingLabel = await db.uiLabels
        .where({
          scopeKey: label.scopeKey,
          labelKey: label.labelKey,
          languageCode: label.languageCode
        })
        .first();
      
      if (!existingLabel) {
        await db.uiLabels.add(label);
        console.log(`Added label: ${label.scopeKey}.${label.labelKey} (${label.languageCode})`);
      } else {
        console.log(`Label already exists: ${label.scopeKey}.${label.labelKey} (${label.languageCode})`);
      }
    }
    
    console.log('TimelyRewardCard labels added successfully.');
  } catch (error) {
    console.error('Error adding TimelyRewardCard labels:', error);
  }
}

// 执行添加标签操作
addTimelyRewardCardLabels();
