// src/pages/StorePage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StoreCategoryRecord,
  StoreItemRecord,
  VipSubscriptionRecord,
  UserCurrencyRecord,
  getStoreCategories,
  getCategoryItems,
  getFeaturedItems,
  getSaleItems,
  getUserCurrency,
  getUserVipSubscription,
  isUserVip
} from '@/services/storeService';
import StoreCategoryList from '@/components/store/StoreCategoryList';
import StoreItemCard from '@/components/store/StoreItemCard';
import StoreItemPreview from '@/components/store/StoreItemPreview';
import VipSubscriptionCard from '@/components/store/VipSubscriptionCard';
import CurrencyDisplay from '@/components/store/CurrencyDisplay';
import Button from '@/components/common/Button';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { playSound, SoundType } from '@/utils/sound';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { pageTransition } from '@/utils/animation';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchStorePageView } from '@/services';
import { StorePageSkeleton } from '@/components/skeleton';
import type { StorePageViewLabelsBundle, FetchStorePageViewResult, UserStoreDataPayload } from '@/types';

/**
 * 商店页面
 * 用于显示和购买商店物品
 */
const StorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<StoreCategoryRecord | null>(null);
  const [items, setItems] = useState<StoreItemRecord[]>([]);
  const [featuredItems, setFeaturedItems] = useState<StoreItemRecord[]>([]);
  const [saleItems, setSaleItems] = useState<StoreItemRecord[]>([]);
  const [selectedItem, setSelectedItem] = useState<StoreItemRecord | null>(null);
  const [showItemPreview, setShowItemPreview] = useState(false);
  const [showVipSection, setShowVipSection] = useState(false);
  const [userCurrency, setUserCurrency] = useState<UserCurrencyRecord | null>(null);
  const [vipSubscription, setVipSubscription] = useState<VipSubscriptionRecord | null>(null);
  const [isVip, setIsVip] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // 获取本地化标签
  const {
    labels: pageLabels,
    isPending: isLabelsPending,
    isError: isLabelsError,
    error: labelsErrorInfo,
    refetch: refetchLabels
  } = useLocalizedView<null, StorePageViewLabelsBundle>(
    'storePageViewContent',
    fetchStorePageView
  );

  const safePageLabels = (pageLabels || {}) as StorePageViewLabelsBundle;

  // 当前用户ID（在实际应用中，这应该从用户会话中获取）
  const userId = 'current-user';

  // 加载商店数据
  const loadStoreData = async () => {
    try {
      setIsLoadingData(true);
      setDataError(null);

      // 获取商店类别
      const storeCategories = await getStoreCategories();

      // 如果有类别，选择第一个
      if (storeCategories.length > 0) {
        setSelectedCategory(storeCategories[0]);

        // 获取该类别的物品
        const categoryItems = await getCategoryItems(storeCategories[0].id!);
        setItems(categoryItems);
      }

      // 获取特色物品
      const featured = await getFeaturedItems();
      setFeaturedItems(featured);

      // 获取促销物品
      const sale = await getSaleItems();
      setSaleItems(sale);

      // 获取用户货币
      const currency = await getUserCurrency(userId);
      setUserCurrency(currency);

      // 获取用户VIP订阅
      const subscription = await getUserVipSubscription(userId);
      setVipSubscription(subscription);

      // 检查用户是否是VIP
      const userIsVip = await isUserVip(userId);
      setIsVip(userIsVip);
    } catch (err) {
      console.error('Failed to load store data:', err);
      setDataError(safePageLabels.errorLoadingData ?? '加载商店数据失败，请重试');
    } finally {
      setIsLoadingData(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadStoreData();
  }, []);

  // 注册数据刷新监听
  useRegisterTableRefresh('storeCategories', loadStoreData);
  useRegisterTableRefresh('storeItems', loadStoreData);
  useRegisterTableRefresh('userCurrencies', loadStoreData);
  useRegisterTableRefresh('vipSubscriptions', loadStoreData);

  // 处理选择类别
  const handleCategorySelect = async (category: StoreCategoryRecord) => {
    setSelectedCategory(category);

    try {
      // 获取该类别的物品
      const categoryItems = await getCategoryItems(category.id!);
      setItems(categoryItems);
    } catch (err) {
      console.error('Failed to load category items:', err);
      setDataError('加载类别物品失败，请重试');
    }
  };

  // 处理预览物品
  const handlePreviewItem = (item: StoreItemRecord) => {
    setSelectedItem(item);
    setShowItemPreview(true);
  };

  // 处理购买物品
  const handlePurchaseItem = async () => {
    // 重新加载数据
    await loadStoreData();
  };

  // 处理订阅VIP
  const handleSubscribeVip = async () => {
    // 重新加载数据
    await loadStoreData();
  };

  // 处理切换VIP部分
  const handleToggleVipSection = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    setShowVipSection(!showVipSection);
  };

  // 容器变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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

  // VIP订阅选项
  const vipOptions = [
    {
      tier: 1,
      title: '基础VIP',
      description: '解锁基础VIP特权，享受更多游戏乐趣',
      price: 18,
      duration: 30,
      benefits: [
        '解锁VIP专属物品',
        '每日额外10金币',
        '商店9折优惠',
        '每日抽奖次数增加至5次'
      ],
      imagePath: '/assets/store/vip-basic.png'
    },
    {
      tier: 2,
      title: '高级VIP',
      description: '解锁高级VIP特权，享受更多游戏乐趣',
      price: 38,
      duration: 30,
      benefits: [
        '包含基础VIP所有特权',
        '每日额外20金币',
        '每周赠送1玉石',
        '商店8折优惠',
        '每日抽奖次数增加至7次'
      ],
      imagePath: '/assets/store/vip-premium.png'
    },
    {
      tier: 3,
      title: '豪华VIP',
      description: '解锁豪华VIP特权，享受最佳游戏体验',
      price: 68,
      duration: 30,
      benefits: [
        '包含高级VIP所有特权',
        '每日额外30金币',
        '每周赠送3玉石',
        '商店7折优惠',
        '专属熊猫头像和背景',
        '每日抽奖次数增加至10次'
      ],
      imagePath: '/assets/store/vip-deluxe.png'
    }
  ];

  // 显示加载状态 (优先显示骨架屏如果标签未加载)
  if (isLabelsPending && !pageLabels) {
    return (
      <motion.div
        className="page-container"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="bamboo-frame">
          <StorePageSkeleton />
        </div>
      </motion.div>
    );
  }

  // 显示标签加载错误
  if (isLabelsError && !pageLabels) {
    return (
      <div className="p-4">
        <ErrorDisplay
          error={labelsErrorInfo}
          title={safePageLabels.errorLoadingLabelsTitle ?? 'Error Loading Interface'}
          messageTemplate={safePageLabels.errorLoadingLabelsMessage ?? 'Could not load store interface: {message}'}
          onRetry={refetchLabels}
          retryButtonText={safePageLabels.retryButtonText ?? 'Try Again'}
        />
      </div>
    );
  }

  // 如果标签加载成功，但数据仍在加载 (secondary loading state)
  if (isLoadingData && pageLabels) {
    return (
      <motion.div
        className="page-container"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="bamboo-frame">
          <StorePageSkeleton />
        </div>
      </motion.div>
    );
  }

  // 如果标签加载成功，但数据加载出错
  if (dataError && pageLabels) {
    return (
      <div className="p-4">
        <ErrorDisplay
          error={{ name: 'StoreDataError', message: dataError }}
          title={safePageLabels.errorLoadingDataTitle ?? 'Store Error'}
          messageTemplate='{message}'
          onRetry={loadStoreData}
          retryButtonText={safePageLabels.retryButtonText ?? 'Try Again'}
        />
      </div>
    );
  }

  // Ensure pageLabels are available before rendering the main content (even if empty object from safePageLabels)
  if (!pageLabels && !isLabelsPending) {
      return (
          <div className="p-4">
             <p>{safePageLabels.unexpectedError ?? "An unexpected error occurred. Please try refreshing."}</p>
          </div>
      );
  }

  // 主渲染逻辑
  return (
    <motion.div
      className="page-container"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="bamboo-frame">
        <header className="store-header">
          <h1 className="store-title">{safePageLabels.pageTitle ?? 'Panda Store'}</h1>
              {userCurrency && (
                  <CurrencyDisplay
                    currency={userCurrency}
              labels={safePageLabels.currencyDisplayLabels}
                  />
              )}
        </header>

              <div className="vip-toggle-section">
          <Button variant="gold" onClick={handleToggleVipSection}>
            {showVipSection ? (safePageLabels.hideVipButton ?? 'Hide VIP') : (safePageLabels.showVipButton ?? 'VIP Membership')}
                </Button>
            </div>

        <AnimatePresence>
          {showVipSection && (
            <motion.section
              className="vip-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
              <h2 className="section-title">{safePageLabels.vipSectionTitle ?? 'VIP Membership'}</h2>
              {isVip && vipSubscription ? (
                <div className="vip-status">
                  <p>{(safePageLabels.vipStatusActive ?? 'Your VIP is active until: {date}').replace('{date}', vipSubscription.endDate ? new Date(vipSubscription.endDate).toLocaleDateString() : (safePageLabels.vipStatusNoExpiry ?? 'N/A'))}</p>
                    </div>
              ) : (
                <div className="vip-options-grid">
                  {vipOptions.map(option => (
                      <VipSubscriptionCard
                        key={option.tier}
                      {...option}
                        currentSubscription={vipSubscription}
                        onSubscribe={handleSubscribeVip}
                      />
                    ))}
                  </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

                  {featuredItems.length > 0 && (
          <section className="featured-items-section">
            <h2 className="section-title">{safePageLabels.featuredItemsTitle ?? 'Featured Items'}</h2>
                      <motion.div
              className="items-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
              {featuredItems.map(item => (
                <motion.div key={item.id} variants={itemVariants}>
                            <StoreItemCard
                              item={item}
                    onPreview={handlePreviewItem}
                              onPurchase={handlePurchaseItem}
                              isVip={isVip}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
          </section>
                  )}

                  {saleItems.length > 0 && (
          <section className="sale-items-section">
            <h2 className="section-title">{safePageLabels.saleItemsTitle ?? 'On Sale'}</h2>
                      <motion.div
              className="items-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
              {saleItems.map(item => (
                <motion.div key={item.id} variants={itemVariants}>
                            <StoreItemCard
                              item={item}
                    onPreview={handlePreviewItem}
                              onPurchase={handlePurchaseItem}
                              isVip={isVip}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
          </section>
                  )}

        <StoreCategoryList
          selectedCategoryId={selectedCategory?.id}
          onCategorySelect={handleCategorySelect}
        />

                  {selectedCategory && (
          <section className="category-items-section">
            <h2 className="section-title">{selectedCategory.name}</h2>
                      {items.length > 0 ? (
                        <motion.div
                className="items-grid"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                {items.map(item => (
                  <motion.div key={item.id} variants={itemVariants}>
                              <StoreItemCard
                                item={item}
                      onPreview={handlePreviewItem}
                                onPurchase={handlePurchaseItem}
                                isVip={isVip}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
              <p className="empty-category-message">{safePageLabels.emptyCategoryMessage ?? 'No items in this category.'}</p>
                      )}
          </section>
              )}

        {showItemPreview && selectedItem && (
        <StoreItemPreview
          isOpen={showItemPreview}
            item={selectedItem}
          onClose={() => setShowItemPreview(false)}
          onPurchase={handlePurchaseItem}
            userCoins={userCurrency?.coins ?? 0}
            userJade={userCurrency?.jade ?? 0}
          isVip={isVip}
            labels={safePageLabels?.itemPreview}
        />
      )}
      </div>
    </motion.div>
  );
};

export default StorePage;
