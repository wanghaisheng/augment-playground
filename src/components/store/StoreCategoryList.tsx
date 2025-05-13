// src/components/store/StoreCategoryList.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  StoreCategoryRecord, 
  getStoreCategories
} from '@/services/storeService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';

interface StoreCategoryListProps {
  onCategorySelect: (category: StoreCategoryRecord) => void;
  selectedCategoryId?: number;
}

/**
 * 商店类别列表组件
 * 用于显示和选择商店类别
 */
const StoreCategoryList: React.FC<StoreCategoryListProps> = ({
  onCategorySelect,
  selectedCategoryId
}) => {
  const [categories, setCategories] = useState<StoreCategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 加载商店类别
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 获取商店类别
      const storeCategories = await getStoreCategories();
      setCategories(storeCategories);
    } catch (err) {
      console.error('Failed to load store categories:', err);
      setError('加载商店类别失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadCategories();
  }, []);

  // 注册数据刷新监听
  useRegisterTableRefresh('storeCategories', loadCategories);

  // 处理选择类别
  const handleSelectCategory = (category: StoreCategoryRecord) => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    
    // 通知父组件
    onCategorySelect(category);
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

  if (isLoading) {
    return (
      <div className="store-category-list p-4 flex justify-center">
        <LoadingSpinner variant="jade" size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-category-list p-4">
        <div className="error-message text-red-500 mb-2">{error}</div>
        <button
          className="retry-button text-jade-600 underline"
          onClick={loadCategories}
        >
          重试
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="store-category-list p-4">
        <p className="text-gray-500">暂无商店类别</p>
      </div>
    );
  }

  return (
    <motion.div
      className="store-category-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="categories-container flex overflow-x-auto py-2 px-4 scrollbar-hide">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            className="category-item flex-shrink-0 mr-4 last:mr-0"
            variants={itemVariants}
          >
            <button
              className={`category-button flex flex-col items-center p-2 rounded-lg ${
                selectedCategoryId === category.id ? 'bg-jade-100 border-2 border-jade-500' : 'bg-white border border-gray-200'
              }`}
              onClick={() => handleSelectCategory(category)}
            >
              <div className="category-icon mb-1">
                <img
                  src={category.iconPath}
                  alt={category.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/assets/store/default-category.png';
                  }}
                />
              </div>
              <div className="category-name text-sm">
                {category.name}
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StoreCategoryList;
