// src/pages/PandaInteractionPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { usePandaState } from '@/context/PandaStateProvider';
import { useSkeletonContext } from '@/context/SkeletonProvider';
import EnhancedPageTransition from '@/components/animation/EnhancedPageTransition';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';
import EnhancedDataLoader from '@/components/common/EnhancedDataLoader';
import TraditionalWindowModal from '@/components/common/TraditionalWindowModal';
import Button from '@/components/common/Button';
import PandaStatusTab from '@/components/panda/PandaStatusTab';
import PandaSkinTab from '@/components/panda/PandaSkinTab';
import PandaInteractionTab from '@/components/panda/PandaInteractionTab';

// 标签页类型
type TabType = 'status' | 'interaction' | 'skin';

/**
 * 熊猫互动页面
 * 提供熊猫状态、互动和皮肤管理功能
 */
const PandaInteractionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('status');
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // 获取导航
  const navigate = useNavigate();
  
  // 获取熊猫状态
  const { pandaState } = usePandaState();
  
  // 获取骨架屏上下文
  const { isSkeletonVisible, showSkeleton, hideSkeleton } = useSkeletonContext();
  
  // 获取本地化内容
  const { view, loading: viewLoading } = useLocalizedView('pandaInteraction');
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  
  // 初始加载
  useEffect(() => {
    // 显示骨架屏
    showSkeleton();
    
    // 加载完成后隐藏骨架屏
    if (!viewLoading) {
      setTimeout(() => {
        hideSkeleton();
      }, 500);
    }
  }, [viewLoading]);

  // 处理标签切换
  const handleTabChange = (tab: TabType) => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    setActiveTab(tab);
  };

  // 处理返回
  const handleBack = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    navigate('/home');
  };

  // 处理显示帮助
  const handleShowHelp = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    setShowHelpModal(true);
  };

  // 处理关闭帮助
  const handleCloseHelp = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    setShowHelpModal(false);
  };

  // 渲染熊猫互动页面
  return (
    <EnhancedPageTransition>
      <EnhancedDataLoader
        isLoading={viewLoading || isSkeletonVisible}
        isError={false}
        error={null}
        data={view}
        skeletonVariant="jade"
        skeletonLayout="page"
        skeletonCount={1}
      >
        {(localizedView) => (
          <div className="panda-interaction-page p-4">
            {/* 页面标题 */}
            <div className="page-header flex justify-between items-center mb-4">
              <div className="flex items-center">
                <button
                  className="back-button mr-2 text-jade-600"
                  onClick={handleBack}
                >
                  <span className="text-xl">←</span>
                </button>
                <h1 className="text-xl font-bold text-jade-800">
                  {localizedView.title || "Panda Companion"}
                </h1>
              </div>
              <button
                className="help-button text-jade-600"
                onClick={handleShowHelp}
              >
                <span className="text-xl">?</span>
              </button>
            </div>

            {/* 标签页导航 */}
            <div className="tabs-navigation flex border-b border-gray-200 mb-4">
              <button
                className={`tab-button py-2 px-4 ${
                  activeTab === 'status' ? 'border-b-2 border-jade-500 text-jade-600' : 'text-gray-500'
                }`}
                onClick={() => handleTabChange('status')}
              >
                {localizedView.tabs?.status || "Status"}
              </button>
              <button
                className={`tab-button py-2 px-4 ${
                  activeTab === 'interaction' ? 'border-b-2 border-jade-500 text-jade-600' : 'text-gray-500'
                }`}
                onClick={() => handleTabChange('interaction')}
              >
                {localizedView.tabs?.interaction || "Interaction"}
              </button>
              <button
                className={`tab-button py-2 px-4 ${
                  activeTab === 'skin' ? 'border-b-2 border-jade-500 text-jade-600' : 'text-gray-500'
                }`}
                onClick={() => handleTabChange('skin')}
              >
                {localizedView.tabs?.skin || "Skin"}
              </button>
            </div>

            {/* 标签页内容 */}
            <OptimizedAnimatedContainer
              className="tab-content"
              priority="high"
            >
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'status' && (
                  <PandaStatusTab
                    labels={{
                      title: localizedView.statusTab?.title,
                      level: localizedView.statusTab?.level,
                      experience: localizedView.statusTab?.experience,
                      nextLevel: localizedView.statusTab?.nextLevel,
                      mood: localizedView.statusTab?.mood,
                      energy: localizedView.statusTab?.energy,
                      focus: localizedView.statusTab?.focus,
                      happiness: localizedView.statusTab?.happiness,
                      health: localizedView.statusTab?.health,
                      evolution: {
                        baby: localizedView.statusTab?.evolution?.baby,
                        child: localizedView.statusTab?.evolution?.child,
                        teen: localizedView.statusTab?.evolution?.teen,
                        adult: localizedView.statusTab?.evolution?.adult,
                        master: localizedView.statusTab?.evolution?.master
                      },
                      stats: localizedView.statusTab?.stats,
                      details: localizedView.statusTab?.details,
                      close: localizedView.statusTab?.close
                    }}
                  />
                )}
                {activeTab === 'interaction' && (
                  <PandaInteractionTab
                    labels={{
                      title: localizedView.interactionTab?.title,
                      interactions: localizedView.interactionTab?.interactions,
                      statistics: localizedView.interactionTab?.statistics,
                      pet: localizedView.interactionTab?.pet,
                      feed: localizedView.interactionTab?.feed,
                      play: localizedView.interactionTab?.play,
                      train: localizedView.interactionTab?.train,
                      sleep: localizedView.interactionTab?.sleep,
                      cooldownMessage: localizedView.interactionTab?.cooldownMessage,
                      seconds: localizedView.interactionTab?.seconds,
                      experienceGained: localizedView.interactionTab?.experienceGained,
                      lastInteraction: localizedView.interactionTab?.lastInteraction,
                      totalInteractions: localizedView.interactionTab?.totalInteractions,
                      rewardTitle: localizedView.interactionTab?.rewardTitle,
                      rewardMessage: localizedView.interactionTab?.rewardMessage,
                      close: localizedView.interactionTab?.close
                    }}
                  />
                )}
                {activeTab === 'skin' && (
                  <PandaSkinTab
                    labels={{
                      title: localizedView.skinTab?.title,
                      equipped: localizedView.skinTab?.equipped,
                      equip: localizedView.skinTab?.equip,
                      preview: localizedView.skinTab?.preview,
                      back: localizedView.skinTab?.back,
                      unlock: localizedView.skinTab?.unlock,
                      locked: localizedView.skinTab?.locked,
                      rarityLabel: localizedView.skinTab?.rarityLabel,
                      rarity: {
                        common: localizedView.skinTab?.rarity?.common,
                        uncommon: localizedView.skinTab?.rarity?.uncommon,
                        rare: localizedView.skinTab?.rarity?.rare,
                        epic: localizedView.skinTab?.rarity?.epic,
                        legendary: localizedView.skinTab?.rarity?.legendary
                      },
                      previewTitle: localizedView.skinTab?.previewTitle,
                      equipSuccess: localizedView.skinTab?.equipSuccess,
                      equipFailed: localizedView.skinTab?.equipFailed,
                      noSkins: localizedView.skinTab?.noSkins
                    }}
                  />
                )}
              </motion.div>
            </OptimizedAnimatedContainer>

            {/* 帮助模态框 */}
            {showHelpModal && (
              <TraditionalWindowModal
                isOpen={showHelpModal}
                onClose={handleCloseHelp}
                title={localizedView.help?.title || "Help"}
                size="medium"
              >
                <div className="help-content p-4">
                  <div className="help-section mb-4">
                    <h3 className="text-lg font-bold text-jade-800 mb-2">
                      {localizedView.help?.statusTitle || "Status"}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {localizedView.help?.statusDescription || "View your panda's status, including level, experience, mood, energy, and attributes."}
                    </p>
                  </div>
                  
                  <div className="help-section mb-4">
                    <h3 className="text-lg font-bold text-jade-800 mb-2">
                      {localizedView.help?.interactionTitle || "Interaction"}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {localizedView.help?.interactionDescription || "Interact with your panda by petting, feeding, playing, training, or putting it to sleep."}
                    </p>
                  </div>
                  
                  <div className="help-section mb-4">
                    <h3 className="text-lg font-bold text-jade-800 mb-2">
                      {localizedView.help?.skinTitle || "Skin"}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {localizedView.help?.skinDescription || "Change your panda's appearance by selecting different skins."}
                    </p>
                  </div>
                  
                  <div className="modal-actions flex justify-center mt-4">
                    <Button
                      variant="jade"
                      onClick={handleCloseHelp}
                    >
                      {localizedView.help?.close || "Close"}
                    </Button>
                  </div>
                </div>
              </TraditionalWindowModal>
            )}
          </div>
        )}
      </EnhancedDataLoader>
    </EnhancedPageTransition>
  );
};

export default PandaInteractionPage;
