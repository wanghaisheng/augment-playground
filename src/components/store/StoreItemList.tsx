// src/components/store/StoreItemList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StoreItemRecord,
  getCategoryItems,
  getFeaturedItems,
  getSaleItems
} from '@/services/storeService';
import StoreItemCard from './StoreItemCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useOptimizedDataRefresh } from '@/hooks/useOptimizedDataRefresh';
import { StoreItemCardSkeleton } from '@/components/skeleton';
import { createContainerVariants } from '@/utils/animation';
import { useStableCallback } from '@/hooks/useStableCallback';
import { useAsyncEffect } from '@/hooks/useAsyncEffect';

interface StoreItemListProps {
  categoryId?: number;
  type?: 'category' | 'featured' | 'sale';
  maxItems?: number;
  onItemSelect?: (item: StoreItemRecord) => void;
  onItemPurchase?: (item: StoreItemRecord) => void;
  userCoins?: number;
  userJade?: number;
  isVip?: boolean;
  className?: string;
  emptyMessage?: string;
}

/**
 * 商店物品列表组件
 * 用于显示商店物品列表
 */
const StoreItemList: React.FC<StoreItemListProps> = ({
  categoryId,
  type = 'category',
  maxItems,
  onItemSelect,
  onItemPurchase,
  userCoins = 0,
  userJade = 0,
  isVip = false,
  className = '',
  emptyMessage = '暂无物品'
}) => {
  const [items, setItems] = useState<StoreItemRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载商店物品 - 使用useCallback确保函数引用稳定
  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let loadedItems: StoreItemRecord[] = [];

      // 根据类型加载不同的物品
      switch (type) {
        case 'featured':
          loadedItems = await getFeaturedItems();
          break;
        case 'sale':
          loadedItems = await getSaleItems();
          break;
        case 'category':
          if (categoryId) {
            loadedItems = await getCategoryItems(categoryId);
          }
          break;
      }

      // 限制数量
      if (maxItems && loadedItems.length > maxItems) {
        loadedItems = loadedItems.slice(0, maxItems);
      }

      setItems(loadedItems);
    } catch (err) {
      console.error('Failed to load store items:', err);
      setError('加载商店物品失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, type, maxItems]);

  // 初始加载 - 使用useAsyncEffect替代useEffect
  useAsyncEffect(async () => {
    await loadItems();
  }, [loadItems]);

  // 使用优化的数据刷新钩子替代直接的useRegisterTableRefresh
  useOptimizedDataRefresh(['storeItems'], loadItems, 300);

  // 处理选择物品 - 使用useStableCallback确保回调函数稳定
  const handleSelectItem = useStableCallback((item: StoreItemRecord) => {
    if (onItemSelect) {
      onItemSelect(item);
    }
  });

  // 处理购买物品 - 使用useStableCallback确保回调函数稳定
  const handlePurchaseItem = useStableCallback((item: StoreItemRecord) => {
    if (onItemPurchase) {
      onItemPurchase(item);
    }
  });

  // 容器变体
  const containerVariants = createContainerVariants(0.1, 0);

  // 项目变体
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // 如果正在加载，显示骨架屏
  if (isLoading) {
    return (
      <div className={`store-item-list-skeleton grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        <StoreItemCardSkeleton variant="jade" />
        <StoreItemCardSkeleton variant="jade" />
        <StoreItemCardSkeleton variant="jade" isVip={true} />
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className={`store-item-list-error text-center p-4 ${className}`}>
        <div className="error-message text-red-500 mb-4">{error}</div>
        <button
          className="retry-button px-4 py-2 bg-jade-500 text-white rounded-md hover:bg-jade-600"
          onClick={loadItems}
        >
          重试
        </button>
      </div>
    );
  }

  // 如果没有物品，显示空消息
  if (items.length === 0) {
    return (
      <div className={`store-item-list-empty text-center p-6 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // 渲染物品列表
  return (
    <motion.div
      className={`store-item-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            layout
          >
            <StoreItemCard
              item={item}
              onPurchase={handlePurchaseItem}
              onPreview={handleSelectItem}
              userCoins={userCoins}
              userJade={userJade}
              isVip={isVip}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default StoreItemList;
