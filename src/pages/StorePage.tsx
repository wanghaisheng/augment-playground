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
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { pageTransition } from '@/utils/animation';

/**
 * 商店页面
 * 用于显示和购买商店物品
 */
const StorePage: React.FC = () => {
  const [categories, setCategories] = useState<StoreCategoryRecord[]>([]);
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 当前用户ID（在实际应用中，这应该从用户会话中获取）
  const userId = 'current-user';

  // 加载商店数据
  const loadStoreData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 获取商店类别
      const storeCategories = await getStoreCategories();
      setCategories(storeCategories);
      
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
      setError('加载商店数据失败，请重试');
    } finally {
      setIsLoading(false);
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
      setError('加载类别物品失败，请重试');
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
        '商店9折优惠'
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
        '商店8折优惠'
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
        '专属熊猫头像和背景'
      ],
      imagePath: '/assets/store/vip-deluxe.png'
    }
  ];

  return (
    <motion.div
      className="page-container"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="bamboo-frame">
        <h2>商店</h2>
        
        {isLoading ? (
          <div className="loading-container flex justify-center items-center h-64">
            <LoadingSpinner variant="jade" size="large" />
          </div>
        ) : error ? (
          <div className="error-container text-center p-4">
            <div className="error-message text-red-500 mb-4">{error}</div>
            <Button variant="jade" onClick={loadStoreData}>
              重试
            </Button>
          </div>
        ) : (
          <div className="store-content">
            {/* 用户货币显示 */}
            {userCurrency && (
              <div className="currency-section mb-4">
                <CurrencyDisplay
                  currency={userCurrency}
                  isVip={isVip}
                />
              </div>
            )}
            
            {/* VIP切换按钮 */}
            <div className="vip-toggle-section mb-4">
              <Button
                variant={showVipSection ? 'gold' : 'secondary'}
                onClick={handleToggleVipSection}
                className="w-full"
              >
                {showVipSection ? '返回商店' : '查看VIP会员'}
              </Button>
            </div>
            
            <AnimatePresence mode="wait">
              {showVipSection ? (
                <motion.div
                  key="vip-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="vip-section"
                >
                  <h3 className="text-lg font-bold mb-4">VIP会员</h3>
                  
                  <div className="vip-options-grid grid grid-cols-1 md:grid-cols-3 gap-4">
                    {vipOptions.map((option) => (
                      <VipSubscriptionCard
                        key={option.tier}
                        tier={option.tier}
                        title={option.title}
                        description={option.description}
                        price={option.price}
                        duration={option.duration}
                        benefits={option.benefits}
                        imagePath={option.imagePath}
                        currentSubscription={vipSubscription}
                        onSubscribe={handleSubscribeVip}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="store-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="store-section"
                >
                  {/* 商店类别 */}
                  {categories.length > 0 && (
                    <div className="categories-section mb-4">
                      <StoreCategoryList
                        onCategorySelect={handleCategorySelect}
                        selectedCategoryId={selectedCategory?.id}
                      />
                    </div>
                  )}
                  
                  {/* 特色物品 */}
                  {featuredItems.length > 0 && (
                    <div className="featured-items-section mb-6">
                      <h3 className="text-lg font-bold mb-2">特色物品</h3>
                      <motion.div
                        className="featured-items-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {featuredItems.map((item) => (
                          <motion.div
                            key={item.id}
                            variants={itemVariants}
                          >
                            <StoreItemCard
                              item={item}
                              onPurchase={handlePurchaseItem}
                              onPreview={handlePreviewItem}
                              userCoins={userCurrency?.coins}
                              userJade={userCurrency?.jade}
                              isVip={isVip}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )}
                  
                  {/* 促销物品 */}
                  {saleItems.length > 0 && (
                    <div className="sale-items-section mb-6">
                      <h3 className="text-lg font-bold mb-2">促销物品</h3>
                      <motion.div
                        className="sale-items-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {saleItems.map((item) => (
                          <motion.div
                            key={item.id}
                            variants={itemVariants}
                          >
                            <StoreItemCard
                              item={item}
                              onPurchase={handlePurchaseItem}
                              onPreview={handlePreviewItem}
                              userCoins={userCurrency?.coins}
                              userJade={userCurrency?.jade}
                              isVip={isVip}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )}
                  
                  {/* 类别物品 */}
                  {selectedCategory && (
                    <div className="category-items-section">
                      <h3 className="text-lg font-bold mb-2">{selectedCategory.name}</h3>
                      {items.length > 0 ? (
                        <motion.div
                          className="category-items-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {items.map((item) => (
                            <motion.div
                              key={item.id}
                              variants={itemVariants}
                            >
                              <StoreItemCard
                                item={item}
                                onPurchase={handlePurchaseItem}
                                onPreview={handlePreviewItem}
                                userCoins={userCurrency?.coins}
                                userJade={userCurrency?.jade}
                                isVip={isVip}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <div className="no-items text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">该类别暂无物品</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* 物品预览对话框 */}
      {selectedItem && (
        <StoreItemPreview
          isOpen={showItemPreview}
          onClose={() => setShowItemPreview(false)}
          item={selectedItem}
          onPurchase={handlePurchaseItem}
          userCoins={userCurrency?.coins}
          userJade={userCurrency?.jade}
          isVip={isVip}
        />
      )}
    </motion.div>
  );
};

export default StorePage;
