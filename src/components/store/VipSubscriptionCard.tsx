// src/components/store/VipSubscriptionCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  VipSubscriptionRecord, 
  activateVipSubscription
} from '@/services/storeService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';

interface VipSubscriptionCardProps {
  tier: number;
  title: string;
  description: string;
  price: number;
  duration: number; // 天数
  benefits: string[];
  imagePath: string;
  currentSubscription?: VipSubscriptionRecord | null;
  onSubscribe?: (tier: number, duration: number) => void;
}

/**
 * VIP订阅卡片组件
 * 用于显示VIP订阅信息和订阅按钮
 */
const VipSubscriptionCard: React.FC<VipSubscriptionCardProps> = ({
  tier,
  title,
  description,
  price,
  duration,
  benefits,
  imagePath,
  currentSubscription,
  onSubscribe
}) => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 检查是否已经订阅了该等级或更高等级的VIP
  const isAlreadySubscribed = () => {
    if (!currentSubscription) return false;
    return currentSubscription.tier >= tier;
  };

  // 处理订阅
  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      setError(null);
      
      // 激活VIP订阅
      await activateVipSubscription(
        'current-user',
        tier,
        duration,
        'in_app_purchase', // 支付方式
        `vip_${tier}_${Date.now()}` // 模拟交易ID
      );
      
      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);
      
      // 通知父组件
      if (onSubscribe) {
        onSubscribe(tier, duration);
      }
    } catch (err) {
      console.error('Failed to subscribe to VIP:', err);
      setError('订阅失败，请重试');
    } finally {
      setIsSubscribing(false);
    }
  };

  // 获取剩余天数
  const getRemainingDays = () => {
    if (!currentSubscription || !currentSubscription.endDate) return 0;
    
    const endDate = new Date(currentSubscription.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  // 获取VIP等级标签
  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 1:
        return '基础';
      case 2:
        return '高级';
      case 3:
        return '豪华';
      default:
        return `等级 ${tier}`;
    }
  };

  const tierLabel = getTierLabel(tier);
  const remainingDays = getRemainingDays();
  const isSubscribed = isAlreadySubscribed();

  return (
    <motion.div
      className={`vip-subscription-card rounded-lg overflow-hidden shadow-md ${
        isSubscribed ? 'border-2 border-amber-500' : 'border border-gray-200'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* VIP图片 */}
      <div className="vip-image-container relative">
        <img
          src={imagePath}
          alt={title}
          className="w-full h-40 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/assets/store/default-vip.png';
          }}
        />
        
        {/* VIP等级标签 */}
        <div className="tier-badge absolute top-2 right-2 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-300">
          {tierLabel} VIP
        </div>
        
        {/* 已订阅标签 */}
        {isSubscribed && (
          <div className="subscribed-badge absolute top-2 left-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-300">
            已订阅
          </div>
        )}
      </div>
      
      {/* VIP信息 */}
      <div className="vip-info p-3">
        <h3 className="vip-title text-md font-bold mb-1">{title}</h3>
        <p className="vip-description text-xs text-gray-600 mb-2">
          {description}
        </p>
        
        {/* VIP福利 */}
        <div className="vip-benefits mb-3">
          <h4 className="text-xs font-bold text-gray-700 mb-1">会员福利</h4>
          <ul className="benefits-list text-xs text-gray-600">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start mb-1">
                <span className="mr-1">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 价格和订阅 */}
        <div className="price-subscribe-section">
          <div className="price-info flex justify-between items-center mb-2">
            <div className="price-display">
              <span className="price-value font-bold">¥{price}</span>
              <span className="duration text-xs text-gray-500 ml-1">
                / {duration} 天
              </span>
            </div>
            
            {isSubscribed && (
              <div className="remaining-days text-xs text-green-600">
                剩余 {remainingDays} 天
              </div>
            )}
          </div>
          
          <Button
            variant={isSubscribed ? 'secondary' : 'gold'}
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="w-full"
          >
            {isSubscribing ? (
              <LoadingSpinner variant="white" size="small" />
            ) : isSubscribed ? (
              '续订'
            ) : (
              '订阅'
            )}
          </Button>
        </div>
        
        {/* 错误信息 */}
        {error && (
          <div className="error-message mt-2 text-xs text-red-500">
            {error}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VipSubscriptionCard;
