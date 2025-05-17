// src/components/store/StoreItemPreview.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StoreItemRecord,
  RewardRarity,
  StoreItemType,
  PriceType,
  purchaseStoreItem
} from '@/services/storeService';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import ScrollDialog from '@/components/game/ScrollDialog';
import type { StoreItemPreviewLabelsBundle } from '@/types'; // Import the new labels bundle type

interface StoreItemPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  item: StoreItemRecord;
  onPurchase?: (item: StoreItemRecord) => void;
  userCoins?: number;
  userJade?: number;
  isVip?: boolean;
  labels?: StoreItemPreviewLabelsBundle; // Add labels prop
}

/**
 * 商店物品预览组件
 * 用于预览商店物品的详细信息和购买
 */
const StoreItemPreview: React.FC<StoreItemPreviewProps> = ({
  isOpen,
  onClose,
  item,
  onPurchase,
  userCoins = 0,
  userJade = 0,
  isVip = false,
  labels // Destructure labels
}) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewAnimating, setIsPreviewAnimating] = useState(false);

  const safeLabels = labels || {} as StoreItemPreviewLabelsBundle; // Create a safe fallback

  // 处理购买物品
  const handlePurchase = async () => {
    // 检查是否需要VIP
    if (item.vipRequired && !isVip) {
      setError(safeLabels.vipRequiredError ?? '需要VIP会员才能购买');
      return;
    }

    // 检查是否有足够的货币
    const price = item.isOnSale && item.salePrice !== undefined ? item.salePrice : item.price;
    if (item.priceType === PriceType.COINS && userCoins < price) {
      setError(safeLabels.insufficientCurrencyError ?? '金币不足');
      return;
    }
    if (item.priceType === PriceType.JADE && userJade < price) {
      setError(safeLabels.insufficientCurrencyError ?? '玉石不足'); // Assuming same message for jade
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

      // 关闭预览
      onClose();
    } catch (err) {
      console.error('Failed to purchase item:', err);
      setError(safeLabels.purchaseFailedError ?? '购买失败，请重试');
    } finally {
      setIsPurchasing(false);
    }
  };

  // 获取稀有度标签和样式
  const getRarityInfo = (rarity: RewardRarity) => {
    switch (rarity) {
      case RewardRarity.COMMON:
        return { label: safeLabels.rarityCommon ?? '普通', className: 'bg-gray-100 text-gray-800 border-gray-300' };
      case RewardRarity.UNCOMMON:
        return { label: safeLabels.rarityUncommon ?? '优秀', className: 'bg-green-100 text-green-800 border-green-300' };
      case RewardRarity.RARE:
        return { label: safeLabels.rarityRare ?? '稀有', className: 'bg-blue-100 text-blue-800 border-blue-300' };
      case RewardRarity.EPIC:
        return { label: safeLabels.rarityEpic ?? '史诗', className: 'bg-purple-100 text-purple-800 border-purple-300' };
      case RewardRarity.LEGENDARY:
        return { label: safeLabels.rarityLegendary ?? '传说', className: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: safeLabels.rarityUnknown ?? '未知', className: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  // 获取物品类型标签
  const getItemTypeLabel = (type: StoreItemType) => {
    switch (type) {
      case StoreItemType.AVATAR:
        return safeLabels.itemTypeAvatar ?? '熊猫头像';
      case StoreItemType.ACCESSORY:
        return safeLabels.itemTypeAccessory ?? '熊猫配件';
      case StoreItemType.BACKGROUND:
        return safeLabels.itemTypeBackground ?? '背景';
      case StoreItemType.THEME:
        return safeLabels.itemTypeTheme ?? '主题';
      case StoreItemType.ABILITY:
        return safeLabels.itemTypeAbility ?? '能力';
      case StoreItemType.CONSUMABLE:
        return safeLabels.itemTypeConsumable ?? '消耗品';
      case StoreItemType.VIP:
        return safeLabels.itemTypeVip ?? 'VIP会员';
      default:
        return safeLabels.itemTypeUnknown ?? '未知';
    }
  };

  // 获取价格类型图标和标签
  const getPriceTypeInfo = (priceType: PriceType) => {
    switch (priceType) {
      case PriceType.COINS:
        return { icon: '🪙', label: safeLabels.priceTypeCoins ?? '金币' };
      case PriceType.JADE:
        return { icon: '💎', label: safeLabels.priceTypeJade ?? '玉石' };
      case PriceType.REAL_MONEY:
        return { icon: '💵', label: safeLabels.priceTypeRealMoney ?? '真实货币' };
      default:
        return { icon: '🪙', label: safeLabels.priceTypeCoins ?? '金币' };
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

  // 处理预览动画
  const handlePreviewAnimation = () => {
    setIsPreviewAnimating(true);
    setTimeout(() => {
      setIsPreviewAnimating(false);
    }, 2000);
  };

  const rarityInfo = getRarityInfo(item.rarity);
  const itemTypeLabel = getItemTypeLabel(item.type);
  const priceTypeInfo = getPriceTypeInfo(item.priceType);
  const displayPrice = item.isOnSale && item.salePrice !== undefined ? item.salePrice : item.price;

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title={safeLabels.dialogTitle ?? "物品预览"}
      closeOnOutsideClick={!isPurchasing}
      closeOnEsc={!isPurchasing}
      showCloseButton={!isPurchasing}
    >
      <div className="store-item-preview p-4">
        {/* 物品图片 */}
        <div className="item-image-container mb-4 relative">
          <div className="preview-image-wrapper relative overflow-hidden rounded-lg border border-gray-200">
            <img
              src={item.imagePath}
              alt={item.name}
              className={`w-full h-64 object-contain ${isPreviewAnimating ? 'animate-pulse' : ''}`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/assets/store/default-item.png';
              }}
            />

            {/* 预览动画按钮 */}
            {(item.type === StoreItemType.AVATAR || item.type === StoreItemType.ACCESSORY) && (
              <button
                className="preview-animation-button absolute bottom-2 right-2 bg-white bg-opacity-80 p-2 rounded-full shadow-md"
                onClick={handlePreviewAnimation}
                aria-label={safeLabels.previewAnimationButtonLabel ?? 'Preview animation'}
              >
                <span role="img" aria-label="preview">👁️</span>
              </button>
            )}
          </div>

          {/* 稀有度标签 */}
          <div className={`rarity-badge absolute top-2 right-2 px-2 py-1 rounded-full text-xs ${rarityInfo.className}`}>
            {rarityInfo.label}
          </div>

          {/* VIP标签 */}
          {item.vipRequired && (
            <div className="vip-badge absolute top-2 left-2 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-300">
              {safeLabels.vipExclusiveBadge ?? 'VIP专属'}
            </div>
          )}

          {/* 促销标签 */}
          {item.isOnSale && item.salePrice !== undefined && (
            <div className="sale-badge absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 border border-red-300">
              {safeLabels.saleBadge ?? '促销'}
            </div>
          )}
        </div>

        {/* 物品信息 */}
        <div className="item-info mb-4">
          <h3 className="item-name text-xl font-bold mb-2">{item.name}</h3>

          <div className="item-meta flex flex-wrap gap-2 mb-2">
            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
              {itemTypeLabel}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${rarityInfo.className}`}>
              {rarityInfo.label}
            </span>
          </div>

          <p className="item-description text-gray-700 mb-4">
            {item.description}
          </p>

          {/* 标签 */}
          {item.tags && item.tags.length > 0 && (
            <div className="item-tags flex flex-wrap gap-1 mb-4">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 限量信息 */}
          {item.limitedQuantity && item.remainingQuantity !== undefined && (
            <div className="limited-quantity mb-4">
              <p className="text-sm text-gray-600">
                限量: {item.remainingQuantity}/{item.limitedQuantity}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-jade-500 h-2 rounded-full"
                  style={{ width: `${(item.remainingQuantity / item.limitedQuantity) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 促销信息 */}
          {item.isOnSale && item.salePrice !== undefined && item.saleEndDate && (
            <div className="sale-info mb-4">
              <p className="text-sm text-red-600">
                促销截止日期: {new Date(item.saleEndDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* 价格和购买 */}
        <div className="price-purchase-section">
          <div className="price-info flex items-center mb-4">
            <span className="price-label text-gray-600 mr-2">价格:</span>
            <span className="price-icon mr-1">{priceTypeInfo.icon}</span>
            <span className="price-value font-bold text-lg">
              {displayPrice}
            </span>
            <span className="price-type text-sm text-gray-500 ml-1">
              ({priceTypeInfo.label})
            </span>
            {item.isOnSale && item.salePrice !== undefined && (
              <span className="original-price text-sm text-gray-500 line-through ml-2">
                {item.price}
              </span>
            )}
          </div>

          {/* 错误信息 */}
          {error && <p className="error-message text-red-500 text-sm mb-2">{error}</p>}

          <div className="purchase-actions flex gap-2">
            <Button
              onClick={handlePurchase}
              color="primary"
              variant="filled"
              disabled={isPurchasing || (item.vipRequired && !isVip) || !canAfford()}
            >
              {isPurchasing ? '处理中...' : (safeLabels.purchaseButtonText ?? '购买')}
            </Button>
            <Button onClick={onClose} variant="outlined" color="secondary" disabled={isPurchasing}>
              {safeLabels.closeButtonText ?? '关闭'}
            </Button>
          </div>
        </div>
      </div>
    </ScrollDialog>
  );
};

export default StoreItemPreview;
