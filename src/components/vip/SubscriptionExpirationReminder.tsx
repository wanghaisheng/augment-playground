// src/components/vip/SubscriptionExpirationReminder.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LatticeDialog from '@/components/game/LatticeDialog';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import { VipSubscriptionRecord } from '@/services/storeService';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchSubscriptionExpirationView } from '@/services/localizedContentService';
import { Language } from '@/types';

interface SubscriptionExpirationReminderProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: VipSubscriptionRecord;
  daysLeft: number;
}

/**
 * 订阅到期提醒组件
 *
 * 在VIP订阅即将到期时显示，提醒用户续订
 */
const SubscriptionExpirationReminder: React.FC<SubscriptionExpirationReminderProps> = ({
  isOpen,
  onClose,
  subscription,
  daysLeft
}) => {
  // isClosing state is used to manage animation timing during dialog close
  const [_isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  // Function to fetch localized content for subscription expiration
  const fetchSubscriptionExpirationViewFn = React.useCallback(async (lang: Language) => {
    try {
      return await fetchSubscriptionExpirationView(lang);
    } catch (error) {
      console.error('Error fetching subscription expiration view:', error);
      throw error;
    }
  }, []);

  // Fetch localized content for the subscription expiration
  const { data: viewData } = useLocalizedView<null, { labels: { [key: string]: string } }>('subscriptionExpiration', fetchSubscriptionExpirationViewFn);

  // Get content from viewData
  const content = viewData?.labels || {};

  // 处理关闭
  const handleClose = () => {
    playSound(SoundType.BUTTON_CLICK);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.BUTTON_CLICK);
    onClose();
    navigate('/vip-benefits');
  };

  // 获取到期日期
  const getExpirationDate = () => {
    if (!subscription.endDate) return '';

    const endDate = new Date(subscription.endDate);
    return endDate.toLocaleDateString();
  };

  // 获取标题
  const getTitle = () => {
    if (daysLeft <= 0) {
      return content.expiredTitle || 'VIP会员已到期';
    } else if (daysLeft === 1) {
      return content.oneDayTitle || 'VIP会员即将到期';
    } else {
      return content.reminderTitle?.replace('{days}', daysLeft.toString()) ||
             `VIP会员将在${daysLeft}天后到期`;
    }
  };

  // 获取描述
  const getDescription = () => {
    if (daysLeft <= 0) {
      return content.expiredDescription || '您的VIP会员已经到期，续订以继续享受VIP特权。';
    } else if (daysLeft === 1) {
      return content.oneDayDescription || '您的VIP会员将在明天到期，请及时续订以避免特权中断。';
    } else {
      return content.reminderDescription?.replace('{days}', daysLeft.toString())
                                        .replace('{date}', getExpirationDate()) ||
             `您的VIP会员将在${daysLeft}天后（${getExpirationDate()}）到期，请及时续订以避免特权中断。`;
    }
  };

  // 获取VIP特权列表
  const getVipBenefits = () => [
    {
      title: content.benefitResourceTitle || '资源加成',
      description: content.benefitResourceDescription || '获得2倍竹子和金币奖励，加速熊猫成长',
      icon: '🎁'
    },
    {
      title: content.benefitSkinsTitle || '专属皮肤',
      description: content.benefitSkinsDescription || '解锁VIP专属熊猫皮肤，让您的熊猫与众不同',
      icon: '🐼'
    },
    {
      title: content.benefitGoalsTitle || '更多目标',
      description: content.benefitGoalsDescription || '创建多达5个自定义目标，更好地追踪您的进步',
      icon: '🎯'
    },
    {
      title: content.benefitSolutionsTitle || '智能解决方案',
      description: content.benefitSolutionsDescription || '获得VIP专属解决方案，帮助您克服困难',
      icon: '💡'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <LatticeDialog
          isOpen={true}
          onClose={handleClose}
          title={getTitle()}
          showCloseButton={true}
          // size property is not supported by LatticeDialog
        >
          <div className="subscription-expiration-reminder p-4">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="vip-icon mb-4"
              >
                <span className="text-6xl">⏰</span>
              </motion.div>

              <p className="text-gray-600">
                {getDescription()}
              </p>
            </div>

            <div className="benefits-section mb-6">
              <h3 className="font-bold text-gold-700 mb-3">
                {content.benefitsTitle || '续订后继续享受这些特权：'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getVipBenefits().map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="benefit-card bg-gold-50 p-3 rounded-lg border border-gold-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-2">{benefit.icon}</span>
                      <div>
                        <h4 className="font-medium text-gold-700">{benefit.title}</h4>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="action-buttons flex flex-col sm:flex-row gap-3">
              <Button
                variant="gold"
                onClick={handleNavigateToVip}
                className="flex-1"
              >
                {daysLeft <= 0 ?
                  (content.renewNowButton || '立即续订') :
                  (content.renewButton || '续订VIP')}
              </Button>

              <Button
                variant="secondary"
                onClick={handleClose}
                className="flex-1"
              >
                {content.laterButton || '稍后再说'}
              </Button>
            </div>
          </div>
        </LatticeDialog>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionExpirationReminder;
