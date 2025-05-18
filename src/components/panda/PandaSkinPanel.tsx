// src/components/panda/PandaSkinPanel.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PandaSkinRecord,
  PandaSkinType,
  PandaSkinRarity,
  getOwnedSkins,
  getEquippedSkin,
  equipSkin
} from '@/services/pandaSkinService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import ScrollDialog from '@/components/game/ScrollDialog';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { usePandaState } from '@/context/PandaStateProvider';
import { useNavigate } from 'react-router-dom';

interface PandaSkinPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSkinChanged?: () => void;
}

/**
 * 熊猫皮肤面板组件
 * 用于选择和预览熊猫皮肤
 */
const PandaSkinPanel: React.FC<PandaSkinPanelProps> = ({
  isOpen,
  onClose,
  onSkinChanged
}) => {
  const [skins, setSkins] = useState<PandaSkinRecord[]>([]);

  const [selectedSkin, setSelectedSkin] = useState<PandaSkinRecord | null>(null);
  const [selectedType, setSelectedType] = useState<PandaSkinType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { pandaState } = usePandaState();
  const isVip = pandaState?.isVip || false;
  const navigate = useNavigate();

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  // 加载皮肤数据
  const loadSkins = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取用户拥有的皮肤
      const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
      const ownedSkins = await getOwnedSkins(userId);
      setSkins(ownedSkins);

      // 获取当前装备的皮肤
      await getEquippedSkin();

      // 如果有选中的皮肤，更新它
      if (selectedSkin) {
        const updated = ownedSkins.find(s => s.id === selectedSkin.id);
        if (updated) {
          setSelectedSkin(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load skins:', err);
      setError('加载皮肤失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (isOpen) {
      loadSkins();
    }
  }, [isOpen]);

  // 注册数据刷新监听
  useRegisterTableRefresh('pandaSkins', loadSkins);

  // 处理皮肤类型过滤
  const getFilteredSkins = () => {
    if (selectedType === 'all') {
      return skins;
    }
    return skins.filter(skin => skin.type === selectedType);
  };

  // 处理装备皮肤
  const handleEquipSkin = async (skin: PandaSkinRecord) => {
    try {
      setIsUpdating(true);

      // 装备皮肤
      const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
      await equipSkin(skin.id!, userId);

      // 播放音效
      playSound(SoundType.BUTTON_CLICK, 0.5);

      // 重新加载数据
      await loadSkins();

      // 通知父组件
      if (onSkinChanged) {
        onSkinChanged();
      }
    } catch (err) {
      console.error('Failed to equip skin:', err);
      setError('装备皮肤失败，请重试');
    } finally {
      setIsUpdating(false);
    }
  };

  // 处理选择皮肤
  const handleSelectSkin = (skin: PandaSkinRecord) => {
    setSelectedSkin(skin);
    playSound(SoundType.BUTTON_CLICK, 0.3);
  };

  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.BUTTON_CLICK);
    onClose();
    navigate('/vip-benefits');
  };

  // 获取稀有度信息
  const getRarityInfo = (rarity: PandaSkinRarity) => {
    switch (rarity) {
      case PandaSkinRarity.COMMON:
        return { text: '普通', color: 'text-gray-600', bgColor: 'bg-gray-100' };
      case PandaSkinRarity.UNCOMMON:
        return { text: '不常见', color: 'text-green-600', bgColor: 'bg-green-100' };
      case PandaSkinRarity.RARE:
        return { text: '稀有', color: 'text-blue-600', bgColor: 'bg-blue-100' };
      case PandaSkinRarity.EPIC:
        return { text: '史诗', color: 'text-purple-600', bgColor: 'bg-purple-100' };
      case PandaSkinRarity.LEGENDARY:
        return { text: '传说', color: 'text-gold-600', bgColor: 'bg-gold-100' };
      default:
        return { text: '普通', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  // 获取皮肤类型文本
  const getSkinTypeText = (type: PandaSkinType) => {
    switch (type) {
      case PandaSkinType.NORMAL:
        return '普通';
      case PandaSkinType.SEASONAL:
        return '季节';
      case PandaSkinType.FESTIVAL:
        return '节日';
      case PandaSkinType.SPECIAL:
        return '特殊';
      case PandaSkinType.VIP:
        return 'VIP专属';
      default:
        return '普通';
    }
  };

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title="熊猫皮肤"
      showCloseButton={!isUpdating}
      closeOnOutsideClick={!isUpdating}
      closeOnEsc={!isUpdating}
    >
      <div className="panda-skin-panel">
        {isLoading ? (
          <div className="loading-container flex justify-center items-center h-32">
            <LoadingSpinner variant="jade" size="medium" />
          </div>
        ) : error ? (
          <div className="error-container text-center p-4">
            <div className="error-message text-red-500 mb-4">{error}</div>
            <Button variant="jade" onClick={loadSkins}>
              重试
            </Button>
          </div>
        ) : (
          <div className="skin-content">
            {/* 皮肤预览 */}
            {selectedSkin && (
              <div className="skin-preview mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">{selectedSkin.name}</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="skin-image-preview flex-1 flex justify-center">
                    <img
                      src={selectedSkin.imagePath.normal}
                      alt={selectedSkin.name}
                      className="h-40 object-contain"
                    />
                  </div>
                  <div className="skin-details flex-1">
                    <p className="text-gray-600 mb-2">{selectedSkin.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRarityInfo(selectedSkin.rarity).bgColor} ${getRarityInfo(selectedSkin.rarity).color}`}>
                        {getRarityInfo(selectedSkin.rarity).text}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                        {getSkinTypeText(selectedSkin.type)}
                      </span>
                      {selectedSkin.isVipExclusive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gold-100 text-gold-800">
                          VIP专属
                        </span>
                      )}
                    </div>

                    <Button
                      variant={selectedSkin.isEquipped ? 'secondary' : 'jade'}
                      onClick={() => handleEquipSkin(selectedSkin)}
                      disabled={isUpdating || (selectedSkin.isVipExclusive && !isVip)}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <LoadingSpinner variant="white" size="small" />
                      ) : selectedSkin.isEquipped ? (
                        '已装备'
                      ) : selectedSkin.isVipExclusive && !isVip ? (
                        'VIP专属'
                      ) : (
                        '装备'
                      )}
                    </Button>

                    {selectedSkin.isVipExclusive && !isVip && (
                      <Button
                        variant="gold"
                        onClick={handleNavigateToVip}
                        className="w-full mt-2"
                      >
                        升级到VIP
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 皮肤类型过滤 */}
            <div className="skin-filters mb-4">
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedType === 'all' ? 'bg-jade-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedType('all')}
                >
                  全部
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedType === PandaSkinType.NORMAL ? 'bg-jade-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedType(PandaSkinType.NORMAL)}
                >
                  普通
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedType === PandaSkinType.VIP ? 'bg-jade-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedType(PandaSkinType.VIP)}
                >
                  VIP专属
                </button>
              </div>
            </div>

            {/* 皮肤列表 */}
            <div className="skins-list">
              <h3 className="text-lg font-bold mb-3">可用皮肤</h3>
              {getFilteredSkins().length === 0 ? (
                <div className="no-skins text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">暂无可用皮肤</p>
                </div>
              ) : (
                <motion.div
                  className="skins-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {getFilteredSkins().map((skin) => {
                    const isSelected = selectedSkin?.id === skin.id;
                    const rarityInfo = getRarityInfo(skin.rarity);
                    return (
                      <motion.div
                        key={skin.id}
                        className={`skin-item p-2 rounded-lg border cursor-pointer transition-all ${
                          isSelected ? 'border-jade-500 bg-jade-50' : 'border-gray-200 bg-white hover:border-jade-300'
                        } ${skin.isEquipped ? 'ring-2 ring-jade-500' : ''}`}
                        variants={itemVariants}
                        onClick={() => handleSelectSkin(skin)}
                      >
                        <div className="relative">
                          <img
                            src={skin.thumbnailPath}
                            alt={skin.name}
                            className="w-full h-24 object-contain mb-2"
                          />
                          {skin.isEquipped && (
                            <div className="absolute top-0 right-0 bg-jade-500 text-white text-xs px-1 py-0.5 rounded-bl">
                              已装备
                            </div>
                          )}
                          {skin.isVipExclusive && !isVip && (
                            <div className="absolute top-0 left-0 bg-gold-500 text-white text-xs px-1 py-0.5 rounded-br">
                              VIP
                            </div>
                          )}
                        </div>
                        <div className="skin-name text-sm font-medium truncate">{skin.name}</div>
                        <div className="skin-rarity text-xs">
                          <span className={`${rarityInfo.color}`}>{rarityInfo.text}</span>
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

export default PandaSkinPanel;
