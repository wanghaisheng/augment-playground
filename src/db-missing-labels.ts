// src/db-missing-labels.ts
import { db } from '@/db-old';
import { UILabelRecord } from '@/types';

/**
 * Add missing labels for components scope
 */
export async function addComponentsLabels(): Promise<void> {
  console.log("Adding missing components labels...");

  const labels: UILabelRecord[] = [
    // Common button labels
    { scopeKey: 'components', labelKey: 'confirmButton', languageCode: 'en', translatedText: 'Confirm' },
    { scopeKey: 'components', labelKey: 'confirmButton', languageCode: 'zh', translatedText: '确认' },
    { scopeKey: 'components', labelKey: 'cancelButton', languageCode: 'en', translatedText: 'Cancel' },
    { scopeKey: 'components', labelKey: 'cancelButton', languageCode: 'zh', translatedText: '取消' },
    { scopeKey: 'components', labelKey: 'saveButton', languageCode: 'en', translatedText: 'Save' },
    { scopeKey: 'components', labelKey: 'saveButton', languageCode: 'zh', translatedText: '保存' },
    { scopeKey: 'components', labelKey: 'deleteButton', languageCode: 'en', translatedText: 'Delete' },
    { scopeKey: 'components', labelKey: 'deleteButton', languageCode: 'zh', translatedText: '删除' },
    { scopeKey: 'components', labelKey: 'editButton', languageCode: 'en', translatedText: 'Edit' },
    { scopeKey: 'components', labelKey: 'editButton', languageCode: 'zh', translatedText: '编辑' },
    { scopeKey: 'components', labelKey: 'closeButton', languageCode: 'en', translatedText: 'Close' },
    { scopeKey: 'components', labelKey: 'closeButton', languageCode: 'zh', translatedText: '关闭' },
    { scopeKey: 'components', labelKey: 'backButton', languageCode: 'en', translatedText: 'Back' },
    { scopeKey: 'components', labelKey: 'backButton', languageCode: 'zh', translatedText: '返回' },
    { scopeKey: 'components', labelKey: 'nextButton', languageCode: 'en', translatedText: 'Next' },
    { scopeKey: 'components', labelKey: 'nextButton', languageCode: 'zh', translatedText: '下一步' },
    { scopeKey: 'components', labelKey: 'previousButton', languageCode: 'en', translatedText: 'Previous' },
    { scopeKey: 'components', labelKey: 'previousButton', languageCode: 'zh', translatedText: '上一步' },

    // Common dialog labels
    { scopeKey: 'components', labelKey: 'dialogTitle', languageCode: 'en', translatedText: 'Confirmation' },
    { scopeKey: 'components', labelKey: 'dialogTitle', languageCode: 'zh', translatedText: '确认' },
    { scopeKey: 'components', labelKey: 'dialogMessage', languageCode: 'en', translatedText: 'Are you sure you want to proceed?' },
    { scopeKey: 'components', labelKey: 'dialogMessage', languageCode: 'zh', translatedText: '您确定要继续吗？' },

    // Common form labels
    { scopeKey: 'components', labelKey: 'requiredField', languageCode: 'en', translatedText: 'Required' },
    { scopeKey: 'components', labelKey: 'requiredField', languageCode: 'zh', translatedText: '必填' },
    { scopeKey: 'components', labelKey: 'optionalField', languageCode: 'en', translatedText: 'Optional' },
    { scopeKey: 'components', labelKey: 'optionalField', languageCode: 'zh', translatedText: '选填' },
    { scopeKey: 'components', labelKey: 'invalidInput', languageCode: 'en', translatedText: 'Invalid input' },
    { scopeKey: 'components', labelKey: 'invalidInput', languageCode: 'zh', translatedText: '输入无效' },

    // Common notification labels
    { scopeKey: 'components', labelKey: 'successTitle', languageCode: 'en', translatedText: 'Success' },
    { scopeKey: 'components', labelKey: 'successTitle', languageCode: 'zh', translatedText: '成功' },
    { scopeKey: 'components', labelKey: 'errorTitle', languageCode: 'en', translatedText: 'Error' },
    { scopeKey: 'components', labelKey: 'errorTitle', languageCode: 'zh', translatedText: '错误' },
    { scopeKey: 'components', labelKey: 'warningTitle', languageCode: 'en', translatedText: 'Warning' },
    { scopeKey: 'components', labelKey: 'warningTitle', languageCode: 'zh', translatedText: '警告' },
    { scopeKey: 'components', labelKey: 'infoTitle', languageCode: 'en', translatedText: 'Information' },
    { scopeKey: 'components', labelKey: 'infoTitle', languageCode: 'zh', translatedText: '信息' },
  ];

  try {
    // 使用 bulkPut 而不是 bulkAdd，这样如果标签已经存在，它会被更新而不是引发错误
    await db.uiLabels.bulkPut(labels);
    console.log("Successfully added components labels.");
  } catch (e) {
    console.error("Error adding components labels:", e);
  }
}

/**
 * Add missing labels for resourceShortage scope
 */
export async function addResourceShortageLabels(): Promise<void> {
  console.log("Adding missing resourceShortage labels...");

  const labels: UILabelRecord[] = [
    // Resource shortage prompt labels
    { scopeKey: 'resourceShortage', labelKey: 'title', languageCode: 'en', translatedText: '{resource} Shortage Alert' },
    { scopeKey: 'resourceShortage', labelKey: 'title', languageCode: 'zh', translatedText: '{resource}不足提醒' },
    { scopeKey: 'resourceShortage', labelKey: 'description', languageCode: 'en', translatedText: 'You are running low on {resource}. You currently have {current} {resource}, which is below the recommended level of {threshold} {resource}.' },
    { scopeKey: 'resourceShortage', labelKey: 'description', languageCode: 'zh', translatedText: '您的{resource}不足，当前仅剩{current}{resource}，低于{threshold}{resource}的推荐水平。' },
    { scopeKey: 'resourceShortage', labelKey: 'vipSolutionTitle', languageCode: 'en', translatedText: 'VIP Solution' },
    { scopeKey: 'resourceShortage', labelKey: 'vipSolutionTitle', languageCode: 'zh', translatedText: 'VIP解决方案' },
    { scopeKey: 'resourceShortage', labelKey: 'regularSolutionTitle', languageCode: 'en', translatedText: 'Recommended Solution' },
    { scopeKey: 'resourceShortage', labelKey: 'regularSolutionTitle', languageCode: 'zh', translatedText: '推荐解决方案' },
    { scopeKey: 'resourceShortage', labelKey: 'vipSolution', languageCode: 'en', translatedText: 'As a VIP member, you can claim {amount} {resource} immediately and receive additional {resource} rewards daily.' },
    { scopeKey: 'resourceShortage', labelKey: 'vipSolution', languageCode: 'zh', translatedText: '作为VIP会员，您可以立即领取{amount}{resource}，并且每天都能获得额外的{resource}奖励。' },
    { scopeKey: 'resourceShortage', labelKey: 'regularSolution', languageCode: 'en', translatedText: 'You can earn more {resource} by completing tasks and challenges, or upgrade to VIP membership for resource bonuses.' },
    { scopeKey: 'resourceShortage', labelKey: 'regularSolution', languageCode: 'zh', translatedText: '您可以通过完成任务和挑战来获取更多{resource}，或者升级为VIP会员享受资源加成。' },
    { scopeKey: 'resourceShortage', labelKey: 'laterButton', languageCode: 'en', translatedText: 'Later' },
    { scopeKey: 'resourceShortage', labelKey: 'laterButton', languageCode: 'zh', translatedText: '稍后再说' },
    { scopeKey: 'resourceShortage', labelKey: 'upgradeButton', languageCode: 'en', translatedText: 'Upgrade to VIP' },
    { scopeKey: 'resourceShortage', labelKey: 'upgradeButton', languageCode: 'zh', translatedText: '升级到VIP' },
    { scopeKey: 'resourceShortage', labelKey: 'claimButton', languageCode: 'en', translatedText: 'Claim VIP Resource' },
    { scopeKey: 'resourceShortage', labelKey: 'claimButton', languageCode: 'zh', translatedText: '领取VIP资源' },
    { scopeKey: 'resourceShortage', labelKey: 'claimedButton', languageCode: 'en', translatedText: 'Claimed' },
    { scopeKey: 'resourceShortage', labelKey: 'claimedButton', languageCode: 'zh', translatedText: '已领取' },
    { scopeKey: 'resourceShortage', labelKey: 'bambooText', languageCode: 'en', translatedText: 'Bamboo' },
    { scopeKey: 'resourceShortage', labelKey: 'bambooText', languageCode: 'zh', translatedText: '竹子' },
    { scopeKey: 'resourceShortage', labelKey: 'coinText', languageCode: 'en', translatedText: 'Coins' },
    { scopeKey: 'resourceShortage', labelKey: 'coinText', languageCode: 'zh', translatedText: '金币' },
    { scopeKey: 'resourceShortage', labelKey: 'energyText', languageCode: 'en', translatedText: 'Energy' },
    { scopeKey: 'resourceShortage', labelKey: 'energyText', languageCode: 'zh', translatedText: '能量' },
    { scopeKey: 'resourceShortage', labelKey: 'resourceText', languageCode: 'en', translatedText: 'Resource' },
    { scopeKey: 'resourceShortage', labelKey: 'resourceText', languageCode: 'zh', translatedText: '资源' },
  ];

  try {
    // 使用 bulkPut 而不是 bulkAdd，这样如果标签已经存在，它会被更新而不是引发错误
    await db.uiLabels.bulkPut(labels);
    console.log("Successfully added resourceShortage labels.");
  } catch (e) {
    console.error("Error adding resourceShortage labels:", e);
  }
}

/**
 * Add missing labels for userTitle scope
 */
export async function addUserTitleLabels(): Promise<void> {
  console.log("Adding missing userTitle labels...");

  const labels: UILabelRecord[] = [
    // User title labels
    { scopeKey: 'userTitle', labelKey: 'title', languageCode: 'en', translatedText: 'User Title' },
    { scopeKey: 'userTitle', labelKey: 'title', languageCode: 'zh', translatedText: '用户称号' },
    { scopeKey: 'userTitle', labelKey: 'description', languageCode: 'en', translatedText: 'Display your achievements with special titles' },
    { scopeKey: 'userTitle', labelKey: 'description', languageCode: 'zh', translatedText: '展示您的成就与特殊称号' },
    { scopeKey: 'userTitle', labelKey: 'currentTitle', languageCode: 'en', translatedText: 'Current Title' },
    { scopeKey: 'userTitle', labelKey: 'currentTitle', languageCode: 'zh', translatedText: '当前称号' },
    { scopeKey: 'userTitle', labelKey: 'changeTitle', languageCode: 'en', translatedText: 'Change Title' },
    { scopeKey: 'userTitle', labelKey: 'changeTitle', languageCode: 'zh', translatedText: '更换称号' },
    { scopeKey: 'userTitle', labelKey: 'noTitle', languageCode: 'en', translatedText: 'No Title Selected' },
    { scopeKey: 'userTitle', labelKey: 'noTitle', languageCode: 'zh', translatedText: '未选择称号' },
    { scopeKey: 'userTitle', labelKey: 'vipExclusive', languageCode: 'en', translatedText: 'VIP Exclusive' },
    { scopeKey: 'userTitle', labelKey: 'vipExclusive', languageCode: 'zh', translatedText: 'VIP专属' },
  ];

  try {
    await db.uiLabels.bulkPut(labels);
    console.log("Successfully added userTitle labels.");
  } catch (e) {
    console.error("Error adding userTitle labels:", e);
  }
}

/**
 * Add missing labels for userTitleSelector scope
 */
export async function addUserTitleSelectorLabels(): Promise<void> {
  console.log("Adding missing userTitleSelector labels...");

  const labels: UILabelRecord[] = [
    // User title selector labels
    { scopeKey: 'userTitleSelector', labelKey: 'title', languageCode: 'en', translatedText: 'Select a Title' },
    { scopeKey: 'userTitleSelector', labelKey: 'title', languageCode: 'zh', translatedText: '选择称号' },
    { scopeKey: 'userTitleSelector', labelKey: 'filterAll', languageCode: 'en', translatedText: 'All Titles' },
    { scopeKey: 'userTitleSelector', labelKey: 'filterAll', languageCode: 'zh', translatedText: '所有称号' },
    { scopeKey: 'userTitleSelector', labelKey: 'filterVip', languageCode: 'en', translatedText: 'VIP Titles' },
    { scopeKey: 'userTitleSelector', labelKey: 'filterVip', languageCode: 'zh', translatedText: 'VIP称号' },
    { scopeKey: 'userTitleSelector', labelKey: 'filterAchievement', languageCode: 'en', translatedText: 'Achievement Titles' },
    { scopeKey: 'userTitleSelector', labelKey: 'filterAchievement', languageCode: 'zh', translatedText: '成就称号' },
    { scopeKey: 'userTitleSelector', labelKey: 'filterCustom', languageCode: 'en', translatedText: 'Custom Titles' },
    { scopeKey: 'userTitleSelector', labelKey: 'filterCustom', languageCode: 'zh', translatedText: '自定义称号' },
    { scopeKey: 'userTitleSelector', labelKey: 'confirmButton', languageCode: 'en', translatedText: 'Confirm' },
    { scopeKey: 'userTitleSelector', labelKey: 'confirmButton', languageCode: 'zh', translatedText: '确认' },
    { scopeKey: 'userTitleSelector', labelKey: 'cancelButton', languageCode: 'en', translatedText: 'Cancel' },
    { scopeKey: 'userTitleSelector', labelKey: 'cancelButton', languageCode: 'zh', translatedText: '取消' },
  ];

  try {
    await db.uiLabels.bulkPut(labels);
    console.log("Successfully added userTitleSelector labels.");
  } catch (e) {
    console.error("Error adding userTitleSelector labels:", e);
  }
}

/**
 * Add missing labels for vipValue scope
 */
export async function addVipValueLabels(): Promise<void> {
  console.log("Adding missing vipValue labels...");

  const labels: UILabelRecord[] = [
    // VIP value labels
    { scopeKey: 'vipValue', labelKey: 'title', languageCode: 'en', translatedText: 'VIP Value' },
    { scopeKey: 'vipValue', labelKey: 'title', languageCode: 'zh', translatedText: 'VIP价值' },
    { scopeKey: 'vipValue', labelKey: 'description', languageCode: 'en', translatedText: 'Your VIP membership has provided you with the following value:' },
    { scopeKey: 'vipValue', labelKey: 'description', languageCode: 'zh', translatedText: '您的VIP会员已为您提供以下价值：' },
    { scopeKey: 'vipValue', labelKey: 'resourceBonus', languageCode: 'en', translatedText: 'Resource Bonus' },
    { scopeKey: 'vipValue', labelKey: 'resourceBonus', languageCode: 'zh', translatedText: '资源加成' },
    { scopeKey: 'vipValue', labelKey: 'exclusiveItems', languageCode: 'en', translatedText: 'Exclusive Items' },
    { scopeKey: 'vipValue', labelKey: 'exclusiveItems', languageCode: 'zh', translatedText: '专属物品' },
    { scopeKey: 'vipValue', labelKey: 'timeValue', languageCode: 'en', translatedText: 'Time Saved' },
    { scopeKey: 'vipValue', labelKey: 'timeValue', languageCode: 'zh', translatedText: '节省时间' },
    { scopeKey: 'vipValue', labelKey: 'totalValue', languageCode: 'en', translatedText: 'Total Value' },
    { scopeKey: 'vipValue', labelKey: 'totalValue', languageCode: 'zh', translatedText: '总价值' },
    { scopeKey: 'vipValue', labelKey: 'renewButton', languageCode: 'en', translatedText: 'Renew VIP' },
    { scopeKey: 'vipValue', labelKey: 'renewButton', languageCode: 'zh', translatedText: '续费VIP' },
  ];

  try {
    await db.uiLabels.bulkPut(labels);
    console.log("Successfully added vipValue labels.");
  } catch (e) {
    console.error("Error adding vipValue labels:", e);
  }
}

/**
 * Add missing labels for bambooCollectionPanel scope
 */
export async function addBambooCollectionPanelLabels(): Promise<void> {
  console.log("Adding missing bambooCollectionPanel labels...");

  const labels: UILabelRecord[] = [
    // Bamboo collection panel labels
    { scopeKey: 'bambooCollectionPanel', labelKey: 'title', languageCode: 'en', translatedText: 'Bamboo Collection' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'title', languageCode: 'zh', translatedText: '竹子收集' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'totalCollected', languageCode: 'en', translatedText: 'Total Collected: {amount}' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'totalCollected', languageCode: 'zh', translatedText: '总收集量：{amount}' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'todayCollected', languageCode: 'en', translatedText: 'Today: {amount}' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'todayCollected', languageCode: 'zh', translatedText: '今日：{amount}' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'collectionRate', languageCode: 'en', translatedText: 'Collection Rate: {rate}/hour' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'collectionRate', languageCode: 'zh', translatedText: '收集速率：{rate}/小时' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'vipBonus', languageCode: 'en', translatedText: 'VIP Bonus: +{percent}%' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'vipBonus', languageCode: 'zh', translatedText: 'VIP加成：+{percent}%' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'collectButton', languageCode: 'en', translatedText: 'Collect' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'collectButton', languageCode: 'zh', translatedText: '收集' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'viewDetailsButton', languageCode: 'en', translatedText: 'View Details' },
    { scopeKey: 'bambooCollectionPanel', labelKey: 'viewDetailsButton', languageCode: 'zh', translatedText: '查看详情' },
  ];

  try {
    await db.uiLabels.bulkPut(labels);
    console.log("Successfully added bambooCollectionPanel labels.");
  } catch (e) {
    console.error("Error adding bambooCollectionPanel labels:", e);
  }
}

/**
 * Add all missing labels
 */
export async function addMissingLabels(): Promise<void> {
  try {
    await addComponentsLabels();
    await addResourceShortageLabels();
    await addUserTitleLabels();
    await addUserTitleSelectorLabels();
    await addVipValueLabels();
    await addBambooCollectionPanelLabels();
    console.log("Successfully added all missing labels.");
  } catch (e) {
    console.error("Error adding missing labels:", e);
  }
}
