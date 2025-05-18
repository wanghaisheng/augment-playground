// src/components/panda/PandaSkinTab.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  getAllSkins,
  getEquippedSkin,
  equipSkin,
  PandaSkinRecord,
  PandaSkinRarity
} from '@/services/pandaSkinService';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { usePandaState } from '@/context/PandaStateProvider';
import { useSkeletonContext } from '@/context/SkeletonProvider';
import EnhancedPandaAvatar from './EnhancedPandaAvatar';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';
import OptimizedAnimatedItem from '@/components/animation/OptimizedAnimatedItem';
import EnhancedDataLoader from '@/components/common/EnhancedDataLoader';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TraditionalWindowModal from '@/components/common/TraditionalWindowModal';

interface PandaSkinTabProps {
  className?: string;
  labels?: {
    title?: string;
    equipped?: string;
    equip?: string;
    preview?: string;
    back?: string;
    unlock?: string;
    locked?: string;
    rarityLabel?: string;
    rarity?: {
      common?: string;
      uncommon?: string;
      rare?: string;
      epic?: string;
      legendary?: string;
    };
    previewTitle?: string;
    equipSuccess?: string;
    equipFailed?: string;
    noSkins?: string;
  };
}

/**
 * 熊猫皮肤标签页组件
 * 显示和管理熊猫的皮肤
 * 
 * @param className - 自定义类名
 * @param labels - 本地化标签
 */
const PandaSkinTab: React.FC<PandaSkinTabProps> = ({
  className = '',
  labels: propLabels
}) => {
  const [skins, setSkins] = useState<PandaSkinRecord[]>([]);
  const [equippedSkin, setEquippedSkin] = useState<PandaSkinRecord | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<PandaSkinRecord | null>(null);
  const [isEquipping, setIsEquipping] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // 获取熊猫状态
  const { pandaState } = usePandaState();
  
  // 获取骨架屏上下文
  const { isSkeletonVisible } = useSkeletonContext();
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    title: propLabels?.title || componentLabels?.pandaSkin?.title || "Panda Skins",
    equipped: propLabels?.equipped || componentLabels?.pandaSkin?.equipped || "Equipped",
    equip: propLabels?.equip || componentLabels?.pandaSkin?.equip || "Equip",
    preview: propLabels?.preview || componentLabels?.pandaSkin?.preview || "Preview",
    back: propLabels?.back || componentLabels?.pandaSkin?.back || "Back",
    unlock: propLabels?.unlock || componentLabels?.pandaSkin?.unlock || "Unlock",
    locked: propLabels?.locked || componentLabels?.pandaSkin?.locked || "Locked",
    rarityLabel: propLabels?.rarityLabel || componentLabels?.pandaSkin?.rarityLabel || "Rarity",
    rarity: {
      common: propLabels?.rarity?.common || componentLabels?.pandaSkin?.rarity?.common || "Common",
      uncommon: propLabels?.rarity?.uncommon || componentLabels?.pandaSkin?.rarity?.uncommon || "Uncommon",
      rare: propLabels?.rarity?.rare || componentLabels?.pandaSkin?.rarity?.rare || "Rare",
      epic: propLabels?.rarity?.epic || componentLabels?.pandaSkin?.rarity?.epic || "Epic",
      legendary: propLabels?.rarity?.legendary || componentLabels?.pandaSkin?.rarity?.legendary || "Legendary"
    },
    previewTitle: propLabels?.previewTitle || componentLabels?.pandaSkin?.previewTitle || "Skin Preview",
    equipSuccess: propLabels?.equipSuccess || componentLabels?.pandaSkin?.equipSuccess || "Skin equipped successfully!",
    equipFailed: propLabels?.equipFailed || componentLabels?.pandaSkin?.equipFailed || "Failed to equip skin",
    noSkins: propLabels?.noSkins || componentLabels?.pandaSkin?.noSkins || "No skins available"
  };

  // 加载皮肤
  const loadSkins = async () => {
    try {
      // 获取所有皮肤
      const allSkins = await getAllSkins();
      setSkins(allSkins);
      
      // 获取已装备的皮肤
      const equipped = await getEquippedSkin();
      setEquippedSkin(equipped);
    } catch (err) {
      console.error('Failed to load skins:', err);
    }
  };

  // 初始加载
  useEffect(() => {
    loadSkins();
  }, []);

  // 注册数据刷新监听
  useRegisterTableRefresh('pandaSkins', loadSkins);

  // 处理选择皮肤
  const handleSelectSkin = (skin: PandaSkinRecord) => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    setSelectedSkin(skin);
  };

  // 处理预览皮肤
  const handlePreviewSkin = () => {
    if (!selectedSkin) return;
    
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    setShowPreview(true);
  };

  // 处理关闭预览
  const handleClosePreview = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    setShowPreview(false);
  };

  // 处理装备皮肤
  const handleEquipSkin = async () => {
    if (!selectedSkin || !selectedSkin.id || !selectedSkin.isUnlocked) return;
    
    try {
      setIsEquipping(true);
      
      // 装备皮肤
      await equipSkin(selectedSkin.id);
      
      // 更新已装备的皮肤
      setEquippedSkin(selectedSkin);
      
      // 显示成功消息
      setMessage({ text: labels.equipSuccess, type: 'success' });
      
      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);
      
      // 刷新皮肤列表
      await loadSkins();
    } catch (err) {
      console.error('Failed to equip skin:', err);
      
      // 显示错误消息
      setMessage({ text: labels.equipFailed, type: 'error' });
      
      // 播放错误音效
      playSound(SoundType.ERROR, 0.5);
    } finally {
      setIsEquipping(false);
      
      // 清除消息
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // 获取稀有度文本
  const getRarityText = (rarity: PandaSkinRarity): string => {
    switch (rarity) {
      case PandaSkinRarity.COMMON:
        return labels.rarity.common;
      case PandaSkinRarity.UNCOMMON:
        return labels.rarity.uncommon;
      case PandaSkinRarity.RARE:
        return labels.rarity.rare;
      case PandaSkinRarity.EPIC:
        return labels.rarity.epic;
      case PandaSkinRarity.LEGENDARY:
        return labels.rarity.legendary;
      default:
        return '';
    }
  };

  // 获取稀有度颜色
  const getRarityColor = (rarity: PandaSkinRarity): string => {
    switch (rarity) {
      case PandaSkinRarity.COMMON:
        return 'text-gray-600 bg-gray-100';
      case PandaSkinRarity.UNCOMMON:
        return 'text-green-600 bg-green-100';
      case PandaSkinRarity.RARE:
        return 'text-blue-600 bg-blue-100';
      case PandaSkinRarity.EPIC:
        return 'text-purple-600 bg-purple-100';
      case PandaSkinRarity.LEGENDARY:
        return 'text-amber-600 bg-amber-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // 渲染皮肤列表
  return (
    <EnhancedDataLoader
      isLoading={isSkeletonVisible}
      isError={false}
      error={null}
      data={skins}
      skeletonVariant="jade"
      skeletonLayout="grid"
      skeletonCount={6}
      emptyState={
        <div className="text-center p-4">
          <p className="text-gray-500">{labels.noSkins}</p>
        </div>
      }
    >
      {(skinList) => (
        <OptimizedAnimatedContainer
          className={`panda-skin-tab ${className}`}
          priority="high"
        >
          {/* 消息提示 */}
          {message && (
            <div className={`message-alert mb-4 p-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* 已选择的皮肤 */}
          {selectedSkin ? (
            <div className="selected-skin-container mb-6">
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="text"
                  onClick={() => setSelectedSkin(null)}
                  className="text-jade-600"
                >
                  ← {labels.back}
                </Button>
                <h3 className="text-lg font-bold text-jade-800">{selectedSkin.name}</h3>
              </div>
              
              <div className="selected-skin-preview flex justify-center mb-4">
                <EnhancedPandaAvatar
                  mood="normal"
                  energy="medium"
                  size={180}
                  showAccessories={false}
                  showEnvironment={false}
                  animate={true}
                />
              </div>
              
              <div className="selected-skin-info bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">{labels.rarityLabel}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getRarityColor(selectedSkin.rarity)}`}>
                    {getRarityText(selectedSkin.rarity)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{selectedSkin.description}</p>
                
                <div className="selected-skin-actions flex justify-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={handlePreviewSkin}
                  >
                    {labels.preview}
                  </Button>
                  
                  {selectedSkin.isUnlocked ? (
                    <Button
                      variant="jade"
                      onClick={handleEquipSkin}
                      disabled={isEquipping || (equippedSkin && equippedSkin.id === selectedSkin.id)}
                    >
                      {isEquipping ? (
                        <LoadingSpinner variant="white" size="small" />
                      ) : equippedSkin && equippedSkin.id === selectedSkin.id ? (
                        labels.equipped
                      ) : (
                        labels.equip
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="jade"
                      onClick={() => {/* 解锁皮肤逻辑 */}}
                    >
                      {labels.unlock}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="skins-grid grid grid-cols-2 gap-3">
              {skinList.map((skin) => (
                <OptimizedAnimatedItem
                  key={skin.id}
                  className={`skin-card cursor-pointer rounded-lg overflow-hidden border ${
                    equippedSkin && equippedSkin.id === skin.id
                      ? 'border-jade-500 bg-jade-50'
                      : 'border-gray-200 bg-white'
                  } ${!skin.isUnlocked ? 'opacity-70' : ''}`}
                  onClick={() => handleSelectSkin(skin)}
                  priority="medium"
                >
                  <div className="skin-card-content p-3">
                    <div className="skin-image-container h-24 flex justify-center items-center mb-2">
                      {/* 皮肤缩略图 */}
                      <img
                        src={skin.thumbnailPath}
                        alt={skin.name}
                        className="h-full object-contain"
                      />
                    </div>
                    
                    <div className="skin-info">
                      <h4 className="text-sm font-bold text-gray-800 mb-1">{skin.name}</h4>
                      
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getRarityColor(skin.rarity)}`}>
                          {getRarityText(skin.rarity)}
                        </span>
                        
                        {equippedSkin && equippedSkin.id === skin.id ? (
                          <span className="text-xs font-medium text-jade-600">{labels.equipped}</span>
                        ) : !skin.isUnlocked ? (
                          <span className="text-xs font-medium text-gray-500">{labels.locked}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </OptimizedAnimatedItem>
              ))}
            </div>
          )}

          {/* 皮肤预览模态框 */}
          {showPreview && selectedSkin && (
            <TraditionalWindowModal
              isOpen={showPreview}
              onClose={handleClosePreview}
              title={labels.previewTitle}
              size="medium"
            >
              <div className="skin-preview-content p-4 flex flex-col items-center">
                <h3 className="text-lg font-bold text-jade-800 mb-4">{selectedSkin.name}</h3>
                
                <div className="preview-container mb-6">
                  <EnhancedPandaAvatar
                    mood="normal"
                    energy="medium"
                    size={240}
                    showAccessories={true}
                    showEnvironment={false}
                    animate={true}
                  />
                </div>
                
                <div className="preview-moods grid grid-cols-4 gap-2 mb-6 w-full">
                  {['normal', 'happy', 'focused', 'tired'].map((mood) => (
                    <div key={mood} className="mood-preview flex flex-col items-center">
                      <EnhancedPandaAvatar
                        mood={mood as any}
                        energy="medium"
                        size={60}
                        showAccessories={false}
                        showEnvironment={false}
                        animate={false}
                      />
                      <span className="text-xs text-gray-600 mt-1">
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button
                  variant="secondary"
                  onClick={handleClosePreview}
                >
                  {labels.back}
                </Button>
              </div>
            </TraditionalWindowModal>
          )}
        </OptimizedAnimatedContainer>
      )}
    </EnhancedDataLoader>
  );
};

export default PandaSkinTab;
