// src/components/panda/PandaCustomizationPanel.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PandaAccessoryRecord,
  PandaAccessoryType,
  getOwnedAccessories,
  getEquippedAccessories,
  equipAccessory,
  unequipAccessory
} from '@/services/pandaCustomizationService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import ScrollDialog from '@/components/game/ScrollDialog';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';

interface PandaCustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomizationChanged?: () => void;
}

/**
 * 熊猫定制面板组件
 * 用于定制熊猫的外观，包括帽子、眼镜、围巾等装饰
 */
const PandaCustomizationPanel: React.FC<PandaCustomizationPanelProps> = ({
  isOpen,
  onClose,
  onCustomizationChanged
}) => {
  const [accessories, setAccessories] = useState<PandaAccessoryRecord[]>([]);
  const [equippedAccessories, setEquippedAccessories] = useState<PandaAccessoryRecord[]>([]);
  const [selectedType, setSelectedType] = useState<PandaAccessoryType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 加载装饰数据
  const loadAccessories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取已拥有的装饰
      const ownedAccessories = await getOwnedAccessories();
      setAccessories(ownedAccessories);

      // 获取已装备的装饰
      const equipped = await getEquippedAccessories();
      setEquippedAccessories(equipped);
    } catch (err) {
      console.error('Failed to load accessories:', err);
      setError('加载装饰失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (isOpen) {
      loadAccessories();
    }
  }, [isOpen]);

  // 注册数据刷新监听
  useRegisterTableRefresh('pandaAccessories', loadAccessories);

  // 处理装备装饰
  const handleEquipAccessory = async (accessory: PandaAccessoryRecord) => {
    try {
      setIsUpdating(true);

      if (accessory.isEquipped) {
        // 取消装备
        await unequipAccessory(accessory.id!);
      } else {
        // 装备
        await equipAccessory(accessory.id!);
      }

      // 播放音效
      playSound(SoundType.BUTTON_CLICK, 0.5);

      // 重新加载数据
      await loadAccessories();

      // 通知父组件
      if (onCustomizationChanged) {
        onCustomizationChanged();
      }
    } catch (err) {
      console.error('Failed to update accessory:', err);
      setError('更新装饰失败，请重试');
    } finally {
      setIsUpdating(false);
    }
  };

  // 获取装饰类型标签
  const getAccessoryTypeLabel = (type: PandaAccessoryType): string => {
    switch (type) {
      case PandaAccessoryType.HAT:
        return '帽子';
      case PandaAccessoryType.GLASSES:
        return '眼镜';
      case PandaAccessoryType.SCARF:
        return '围巾';
      case PandaAccessoryType.PENDANT:
        return '挂饰';
      case PandaAccessoryType.BACKGROUND:
        return '背景';
      case PandaAccessoryType.FRAME:
        return '边框';
      case PandaAccessoryType.EFFECT:
        return '特效';
      default:
        return '未知';
    }
  };

  // 获取稀有度标签和样式
  const getRarityInfo = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return { label: '普通', className: 'bg-gray-100 text-gray-800 border-gray-300' };
      case 'uncommon':
        return { label: '优秀', className: 'bg-green-100 text-green-800 border-green-300' };
      case 'rare':
        return { label: '稀有', className: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'epic':
        return { label: '史诗', className: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'legendary':
        return { label: '传说', className: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: '未知', className: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  // 过滤装饰
  const getFilteredAccessories = (): PandaAccessoryRecord[] => {
    if (selectedType === 'all') {
      return accessories;
    }

    return accessories.filter(accessory => accessory.type === selectedType);
  };

  // 获取已装备的装饰
  const getEquippedAccessory = (type: PandaAccessoryType): PandaAccessoryRecord | undefined => {
    return equippedAccessories.find(accessory => accessory.type === type);
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

  // 装饰类型选项
  const accessoryTypes = [
    'all' as const,
    PandaAccessoryType.HAT,
    PandaAccessoryType.GLASSES,
    PandaAccessoryType.SCARF,
    PandaAccessoryType.PENDANT,
    PandaAccessoryType.BACKGROUND,
    PandaAccessoryType.FRAME,
    PandaAccessoryType.EFFECT
  ];

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title="熊猫定制"
      closeOnOutsideClick={!isUpdating}
      closeOnEsc={!isUpdating}
      showCloseButton={!isUpdating}
    >
      <div className="panda-customization-panel p-4">
        {isLoading ? (
          <div className="loading-container flex justify-center items-center h-32">
            <LoadingSpinner variant="jade" size="medium" />
          </div>
        ) : error ? (
          <div className="error-container text-center p-4">
            <div className="error-message text-red-500 mb-4">{error}</div>
            <Button variant="jade" onClick={loadAccessories}>
              重试
            </Button>
          </div>
        ) : (
          <div className="customization-content">
            {/* 当前装备 */}
            <div className="current-equipment mb-6">
              <h3 className="text-lg font-bold mb-3">当前装备</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {accessoryTypes.slice(1).map((type) => {
                  // We know these are all PandaAccessoryType since we sliced off the 'all' value
                  const equipped = getEquippedAccessory(type as PandaAccessoryType);
                  return (
                    <div key={type} className="equipped-item p-2 border border-gray-200 rounded-lg">
                      <div className="item-type text-sm font-medium mb-1">
                        {getAccessoryTypeLabel(type as PandaAccessoryType)}
                      </div>
                      {equipped ? (
                        <div className="item-info flex items-center">
                          <img
                            src={equipped.imagePath}
                            alt={equipped.name}
                            className="w-8 h-8 object-contain mr-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/assets/accessories/default.svg';
                            }}
                          />
                          <div className="item-name text-sm truncate">
                            {equipped.name}
                          </div>
                        </div>
                      ) : (
                        <div className="item-empty text-sm text-gray-500">
                          未装备
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 装饰类型过滤器 */}
            <div className="accessory-type-filter mb-4">
              <h3 className="text-lg font-bold mb-2">装饰类型</h3>
              <div className="flex flex-wrap gap-2">
                {accessoryTypes.map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedType === type ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type === 'all' ? '全部' : getAccessoryTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            {/* 装饰列表 */}
            <div className="accessories-list">
              <h3 className="text-lg font-bold mb-3">可用装饰</h3>
              {getFilteredAccessories().length === 0 ? (
                <div className="no-accessories text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">暂无可用装饰</p>
                </div>
              ) : (
                <motion.div
                  className="accessories-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {getFilteredAccessories().map((accessory) => {
                    const rarityInfo = getRarityInfo(accessory.rarity);
                    return (
                      <motion.div
                        key={accessory.id}
                        className={`accessory-item p-3 rounded-lg border ${
                          accessory.isEquipped ? 'border-jade-500 bg-jade-50' : 'border-gray-200 bg-white'
                        }`}
                        variants={itemVariants}
                      >
                        <div className="accessory-header flex justify-between items-start mb-2">
                          <div className="accessory-name font-medium">
                            {accessory.name}
                          </div>
                          <div className="accessory-meta flex gap-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${rarityInfo.className}`}>
                              {rarityInfo.label}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                              {getAccessoryTypeLabel(accessory.type)}
                            </span>
                          </div>
                        </div>

                        <div className="accessory-image-container mb-2 flex justify-center">
                          <img
                            src={accessory.imagePath}
                            alt={accessory.name}
                            className="h-24 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/assets/accessories/default.svg';
                            }}
                          />
                        </div>

                        <div className="accessory-description text-sm text-gray-600 mb-3">
                          {accessory.description}
                        </div>

                        <div className="accessory-actions">
                          <Button
                            variant={accessory.isEquipped ? 'secondary' : 'jade'}
                            onClick={() => handleEquipAccessory(accessory)}
                            disabled={isUpdating}
                            className="w-full"
                          >
                            {isUpdating ? (
                              <LoadingSpinner variant="white" size="small" />
                            ) : accessory.isEquipped ? (
                              '取消装备'
                            ) : (
                              '装备'
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </ScrollDialog>
  );
};

export default PandaCustomizationPanel;
