// src/services/subscriptionRetentionService.ts
import { db } from '@/db-old';
import { addSyncItem } from './dataSyncService';
import { 
  getUserVipSubscription as getUserVipStatus, 
  updateVipSubscriptionDetails as updateVipSubscription,
  // UserCurrencyRecord, // Unused
  // getUserCurrency, // Unused
  updateUserCurrency 
} from './storeService';
import { playSound, SoundType } from '@/utils/sound';

/**
 * 订阅挽留记录类型
 */
export interface RetentionOfferRecord {
  id?: number;
  userId: string;
  offerType: 'discount' | 'extension' | 'bonus' | 'custom';
  offerValue: number; // 折扣百分比、延长天数、赠送资源数量等
  offerDescription: string;
  offerExpiry: Date;
  isAccepted: boolean;
  isRejected: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 挽留步骤类型
 */
export interface RetentionStep {
  id: string;
  type: 'discount' | 'extension' | 'bonus' | 'custom';
  title: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  value: number;
  imageUrl?: string;
}

/**
 * 挽留流程配置
 */
const RETENTION_STEPS: RetentionStep[] = [
  {
    id: 'discount-30',
    type: 'discount',
    title: {
      zh: '限时7折优惠',
      en: '30% Off Limited Time Offer'
    },
    description: {
      zh: '我们注意到您准备取消订阅。作为我们珍贵的用户，我们想提供您7折优惠续订，仅限今天！',
      en: 'We noticed you\'re about to cancel. As our valued user, we\'d like to offer you a 30% discount on renewal, today only!'
    },
    value: 30,
    imageUrl: '/assets/vip/retention/discount_offer.svg'
  },
  {
    id: 'extension-14',
    type: 'extension',
    title: {
      zh: '免费延长14天',
      en: '14-Day Free Extension'
    },
    description: {
      zh: '不想现在做决定？我们理解。让我们免费延长您的VIP会员14天，让您有更多时间考虑。',
      en: 'Not ready to decide? We understand. Let\'s extend your VIP membership for 14 days free of charge to give you more time.'
    },
    value: 14,
    imageUrl: '/assets/vip/retention/extension_offer.svg'
  },
  {
    id: 'bonus-jade',
    type: 'bonus',
    title: {
      zh: '500玉石奖励',
      en: '500 Jade Bonus'
    },
    description: {
      zh: '续订您的VIP会员，我们将立即赠送您500玉石，可用于购买稀有物品和加速您的进度！',
      en: 'Renew your VIP membership and we\'ll instantly gift you 500 Jade, which you can use to purchase rare items and boost your progress!'
    },
    value: 500,
    imageUrl: '/assets/vip/retention/bonus_offer.svg'
  },
  {
    id: 'custom-feedback',
    type: 'custom',
    title: {
      zh: '告诉我们您的想法',
      en: 'Tell Us What You Think'
    },
    description: {
      zh: '我们重视您的反馈。请告诉我们如何改进，我们将根据您的建议提供个性化优惠。',
      en: 'We value your feedback. Please tell us how we can improve, and we\'ll provide a personalized offer based on your suggestions.'
    },
    value: 0,
    imageUrl: '/assets/vip/retention/feedback_offer.svg'
  }
];

/**
 * 获取用户的挽留优惠记录
 * @param userId 用户ID
 * @returns 挽留优惠记录
 */
export async function getUserRetentionOffers(userId: string): Promise<RetentionOfferRecord[]> {
  try {
    // 确保表存在 - Предполагается, что таблица retentionOffers определена в db.ts
    // if (!(await db.tableExists('retentionOffers'))) { 
    //   await db.createTable('retentionOffers');      
    // }
    
    // 获取用户的挽留优惠记录
    return await db.table('retentionOffers')
      .where('userId')
      .equals(userId)
      .toArray();
  } catch (error) {
    console.error('Failed to get user retention offers:', error);
    return [];
  }
}

/**
 * 创建挽留优惠
 * @param userId 用户ID
 * @param stepId 挽留步骤ID
 * @returns 创建的挽留优惠记录
 */
export async function createRetentionOffer(
  userId: string,
  stepId: string
): Promise<RetentionOfferRecord | null> {
  try {
    // 获取挽留步骤
    const step = RETENTION_STEPS.find(s => s.id === stepId);
    if (!step) {
      throw new Error(`Retention step with id ${stepId} not found`);
    }
    
    // 创建挽留优惠记录
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1); // 24小时有效期
    
    const offer: Omit<RetentionOfferRecord, 'id'> = {
      userId,
      offerType: step.type,
      offerValue: step.value,
      offerDescription: JSON.stringify({
        zh: step.description.zh,
        en: step.description.en
      }),
      offerExpiry: expiryDate,
      isAccepted: false,
      isRejected: false,
      createdAt: now,
      updatedAt: now
    };
    
    // 添加到数据库
    const id = await db.table('retentionOffers').add(offer);
    const createdOffer = { ...offer, id: id as number };
    
    // 添加同步项目
    await addSyncItem('retentionOffers', 'create', createdOffer);
    
    return createdOffer;
  } catch (error) {
    console.error('Failed to create retention offer:', error);
    return null;
  }
}

/**
 * 接受挽留优惠
 * @param userId 用户ID
 * @param offerId 优惠ID
 * @returns 是否成功接受
 */
export async function acceptRetentionOffer(
  userId: string,
  offerId: number
): Promise<boolean> {
  try {
    // 获取优惠记录
    const offer = await db.table('retentionOffers').get(offerId);
    if (!offer) {
      throw new Error(`Retention offer with id ${offerId} not found`);
    }
    
    // 检查是否是用户的优惠
    if (offer.userId !== userId) {
      throw new Error('Not your offer');
    }
    
    // 检查优惠是否已过期
    const now = new Date();
    if (now > new Date(offer.offerExpiry)) {
      throw new Error('Offer has expired');
    }
    
    // 检查优惠是否已被接受或拒绝
    if (offer.isAccepted || offer.isRejected) {
      throw new Error('Offer already processed');
    }
    
    // 根据优惠类型执行相应操作
    const vipStatus = await getUserVipStatus(userId);
    
    switch (offer.offerType) {
      case 'discount':
        // 应用折扣
        if (vipStatus && vipStatus.id) {
          // const standardPrice = 100; // Placeholder: This should come from a reliable source
          // const discountedPrice = standardPrice * (1 - offer.offerValue / 100); // Unused variable
          
          await updateVipSubscription(vipStatus.id, {
            updatedAt: now,
          });
          console.warn('VipSubscriptionRecord does not have a price field. Discount offer logic needs review.');
        }
        break;
      
      case 'extension':
        // 延长会员期限
        if (vipStatus && vipStatus.id && vipStatus.endDate) {
          const newExpiryDate = new Date(vipStatus.endDate);
          newExpiryDate.setDate(newExpiryDate.getDate() + offer.offerValue);
          
          await updateVipSubscription(vipStatus.id, {
            endDate: newExpiryDate,
            isActive: true,
            updatedAt: now
          });
        }
        break;
      
      case 'bonus':
        // 赠送资源
        await updateUserCurrency(userId, 0, offer.offerValue, 0);
        break;
      
      case 'custom':
        // 自定义优惠，需要根据具体情况处理
        break;
    }
    
    // 更新优惠状态
    const updatedOffer = {
      ...offer,
      isAccepted: true,
      updatedAt: now
    };
    
    // 更新数据库
    await db.table('retentionOffers').update(offerId, updatedOffer);
    
    // 添加同步项目
    await addSyncItem('retentionOffers', 'update', updatedOffer);
    
    // 播放接受音效
    playSound(SoundType.SUCCESS);
    
    return true;
  } catch (error) {
    console.error('Failed to accept retention offer:', error);
    return false;
  }
}

/**
 * 拒绝挽留优惠
 * @param userId 用户ID
 * @param offerId 优惠ID
 * @returns 是否成功拒绝
 */
export async function rejectRetentionOffer(
  userId: string,
  offerId: number
): Promise<boolean> {
  try {
    // 获取优惠记录
    const offer = await db.table('retentionOffers').get(offerId);
    if (!offer) {
      throw new Error(`Retention offer with id ${offerId} not found`);
    }
    
    // 检查是否是用户的优惠
    if (offer.userId !== userId) {
      throw new Error('Not your offer');
    }
    
    // 检查优惠是否已被接受或拒绝
    if (offer.isAccepted || offer.isRejected) {
      throw new Error('Offer already processed');
    }
    
    // 更新优惠状态
    const updatedOffer = {
      ...offer,
      isRejected: true,
      updatedAt: new Date()
    };
    
    // 更新数据库
    await db.table('retentionOffers').update(offerId, updatedOffer);
    
    // 添加同步项目
    await addSyncItem('retentionOffers', 'update', updatedOffer);
    
    return true;
  } catch (error) {
    console.error('Failed to reject retention offer:', error);
    return false;
  }
}

/**
 * 获取挽留步骤
 * @returns 挽留步骤列表
 */
export function getRetentionSteps(): RetentionStep[] {
  return RETENTION_STEPS;
}

/**
 * 获取下一个挽留步骤
 * @param userId 用户ID
 * @returns 下一个挽留步骤
 */
export async function getNextRetentionStep(userId: string): Promise<RetentionStep | null> {
  try {
    // 获取用户的挽留优惠记录
    const offers = await getUserRetentionOffers(userId);
    
    // 如果没有记录，返回第一个步骤
    if (offers.length === 0) {
      return RETENTION_STEPS[0];
    }
    
    // 获取已使用的步骤ID
    const usedStepIds = new Set(
      offers.map(offer => {
        const step = RETENTION_STEPS.find(s => s.type === offer.offerType && s.value === offer.offerValue);
        return step ? step.id : '';
      }).filter(id => id !== '')
    );
    
    // 查找未使用的步骤
    const nextStep = RETENTION_STEPS.find(step => !usedStepIds.has(step.id));
    
    return nextStep || null;
  } catch (error) {
    console.error('Failed to get next retention step:', error);
    return null;
  }
}
