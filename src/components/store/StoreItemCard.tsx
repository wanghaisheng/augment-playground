// src/components/store/StoreItemCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  StoreItemRecord,
  PriceType,
  purchaseStoreItem,
  RewardRarity as StoreItemRarity
} from '@/services/storeService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';

interface StoreItemCardProps {
  item: StoreItemRecord;
  onPurchase?: (item: StoreItemRecord) => void;
  onPreview?: (item: StoreItemRecord) => void;
  userCoins?: number;
  userJade?: number;
  isVip?: boolean;
}

/**
 * 商店物品卡片组件
 * 用于显示商店物品和购买按钮
 */
const StoreItemCard: React.FC<StoreItemCardProps> = ({
  item,
  onPurchase,
  onPreview,
  userCoins = 0,
  userJade = 0,
  isVip = false
}) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 处理购买物品
  const handlePurchase = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡

    // 检查是否需要VIP
    if (item.vipRequired && !isVip) {
      setError('需要VIP会员才能购买');
      return;
    }

    // 检查是否有足够的货币
    const price = item.isOnSale && item.salePrice !== undefined ? item.salePrice : item.price;
    if (item.priceType === PriceType.COINS && userCoins < price) {
      setError('金币不足');
      return;
    }
    if (item.priceType === PriceType.JADE && userJade < price) {
      setError('玉石不足');
      return;
    }

    try {
      setIsPurchasing(true);
      setError(null);

      // 购买物品
      await purchaseStoreItem('current-user', item.id!);

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 通知父组件
      if (onPurchase) {
        onPurchase(item);
      }
    } catch (err) {
      console.error('Failed to purchase item:', err);
      setError('购买失败，请重试');
    } finally {
      setIsPurchasing(false);
    }
  };

  // 处理预览物品
  const handlePreview = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    // 通知父组件
    if (onPreview) {
      onPreview(item);
    }
  };

  // 获取稀有度标签和样式
  const getRarityInfo = (rarity: StoreItemRarity) => {
    switch (rarity) {
      case StoreItemRarity.COMMON:
        return { label: '普通', className: 'bg-gray-100 text-gray-800 border-gray-300' };
      case StoreItemRarity.UNCOMMON:
        return { label: '优秀', className: 'bg-green-100 text-green-800 border-green-300' };
      case StoreItemRarity.RARE:
        return { label: '稀有', className: 'bg-blue-100 text-blue-800 border-blue-300' };
      case StoreItemRarity.EPIC:
        return { label: '史诗', className: 'bg-purple-100 text-purple-800 border-purple-300' };
      case StoreItemRarity.LEGENDARY:
        return { label: '传说', className: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: '未知', className: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  // 获取价格类型图标
  const getPriceTypeIcon = (priceType: PriceType) => {
    switch (priceType) {
      case PriceType.COINS:
        return '🪙';
      case PriceType.JADE:
        return '💎';
      case PriceType.REAL_MONEY:
        return '💵';
      default:
        return '🪙';
    }
  };

  // 检查用户是否有足够的货币
  const canAfford = () => {
    const price = item.isOnSale && item.salePrice !== undefined ? item.salePrice : item.price;
    if (item.priceType === PriceType.COINS) {
      return userCoins >= price;
    }
    if (item.priceType === PriceType.JADE) {
      return userJade >= price;
    }
    return true; // 真实货币需要在应用内购买流程中处理
  };

  const rarityInfo = getRarityInfo(item.rarity);
  const priceTypeIcon = getPriceTypeIcon(item.priceType);
  const displayPrice = item.isOnSale && item.salePrice !== undefined ? item.salePrice : item.price;

  return (
    <motion.div
      className={`store-item-card rounded-lg overflow-hidden shadow-md ${
        item.vipRequired ? 'border-2 border-amber-400' : 'border border-gray-200'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePreview}
    >
      {/* 物品图片 */}
      <div className="item-image-container relative">
        <img
          src={item.imagePath}
          alt={item.name}
          className="w-full h-40 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/assets/store/default-item.png';
          }}
        />

        {/* 稀有度标签 */}
        <div className={`rarity-badge absolute top-2 right-2 px-2 py-1 rounded-full text-xs ${rarityInfo.className}`}>
          {rarityInfo.label}
        </div>

        {/* VIP标签 */}
        {item.vipRequired && (
          <div className="vip-badge absolute top-2 left-2 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-300">
            VIP专属
          </div>
        )}

        {/* 促销标签 */}
        {item.isOnSale && item.salePrice !== undefined && (
          <div className="sale-badge absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 border border-red-300">
            促销
          </div>
        )}
      </div>

      {/* 物品信息 */}
      <div className="item-info p-3">
        <h3 className="item-name text-md font-bold mb-1">{item.name}</h3>
        <p className="item-description text-xs text-gray-600 mb-2 line-clamp-2">
          {item.description}
        </p>

        {/* 价格信息 */}
        <div className="price-info flex justify-between items-center">
          <div className="price-display flex items-center">
            <span className="price-icon mr-1">{priceTypeIcon}</span>
            <span className="price-value font-bold">
              {displayPrice}
            </span>
            {item.isOnSale && item.salePrice !== undefined && (
              <span className="original-price text-xs text-gray-500 line-through ml-2">
                {item.price}
              </span>
            )}
          </div>

          <Button
            variant="jade"
            size="small"
            onClick={handlePurchase}
            disabled={isPurchasing || !canAfford() || (item.vipRequired && !isVip)}
          >
            {isPurchasing ? (
              <LoadingSpinner variant="white" size="small" />
            ) : (
              '购买'
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

export default StoreItemCard;
