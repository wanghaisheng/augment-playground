// src/components/vip/RetentionOfferCard.tsx
import React, { useEffect } from 'react';
import { RetentionStep } from '@/services/subscriptionRetentionService';

interface RetentionOfferCardProps {
  step: RetentionStep;
  language: string;
  onCreateOffer: () => void;
}

/**
 * 挽留优惠卡片组件
 */
const RetentionOfferCard: React.FC<RetentionOfferCardProps> = ({
  step,
  language,
  onCreateOffer
}) => {
  // 自动创建优惠
  useEffect(() => {
    onCreateOffer();
  }, [onCreateOffer]);

  // 获取优惠值文本
  const getOfferValueText = () => {
    switch (step.type) {
      case 'discount':
        return language === 'zh'
          ? `${step.value}%折扣`
          : `${step.value}% Discount`;
      case 'extension':
        return language === 'zh'
          ? `延长${step.value}天`
          : `${step.value} Days Extension`;
      case 'bonus':
        return language === 'zh'
          ? `${step.value}玉石`
          : `${step.value} Jade`;
      case 'custom':
        return language === 'zh'
          ? '个性化优惠'
          : 'Custom Offer';
      default:
        return '';
    }
  };

  // 获取优惠类型图标
  const getOfferTypeIcon = () => {
    switch (step.type) {
      case 'discount':
        return '💰';
      case 'extension':
        return '⏱️';
      case 'bonus':
        return '🎁';
      case 'custom':
        return '✨';
      default:
        return '🎯';
    }
  };

  // 获取优惠类型文本
  const getOfferTypeText = () => {
    switch (step.type) {
      case 'discount':
        return language === 'zh' ? '折扣优惠' : 'Discount Offer';
      case 'extension':
        return language === 'zh' ? '会员延期' : 'Membership Extension';
      case 'bonus':
        return language === 'zh' ? '资源奖励' : 'Resource Bonus';
      case 'custom':
        return language === 'zh' ? '个性化优惠' : 'Custom Offer';
      default:
        return '';
    }
  };

  return (
    <div className="retention-offer-card bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200 shadow-sm">
      {/* 优惠图标和类型 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="offer-icon text-3xl">
          {getOfferTypeIcon()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-amber-800">
            {getOfferTypeText()}
          </h3>
          <p className="text-amber-600 font-bold">
            {getOfferValueText()}
          </p>
        </div>
      </div>

      {/* 优惠图片 */}
      {step.imageUrl && (
        <div className="offer-image mb-4 flex justify-center">
          <img
            src={step.imageUrl}
            alt={language === 'zh' ? step.title.zh : step.title.en}
            className="max-h-40 object-contain"
          />
        </div>
      )}

      {/* 优惠描述 */}
      <p className="text-gray-600 mb-4">
        {language === 'zh' ? step.description.zh : step.description.en}
      </p>

      {/* 限时提示 */}
      <div className="limited-time-notice bg-amber-100 border border-amber-200 rounded-md p-3 text-sm text-amber-700 flex items-center gap-2">
        <span className="text-amber-500">⏰</span>
        <span>
          {language === 'zh'
            ? '限时优惠，仅在24小时内有效'
            : 'Limited time offer, valid for 24 hours only'}
        </span>
      </div>
    </div>
  );
};

export default RetentionOfferCard;
