// src/features/home/PandaSection.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
// import PandaAvatar from '@/components/game/PandaAvatar';
import PandaAnimation from '@/components/game/PandaAnimation';
import { usePandaState } from '@/context/PandaStateProvider';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import AnimatedButton from '@/components/animation/AnimatedButton';
import GoldenGlow from '@/components/animation/GoldenGlow';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PandaCustomizationPanel from '@/components/panda/PandaCustomizationPanel';
import PandaEnvironmentPanel from '@/components/panda/PandaEnvironmentPanel';
import PandaInteractionPanel from '@/components/panda/PandaInteractionPanel';
import PandaSkinPanel from '@/components/panda/PandaSkinPanel';
import { initializePandaCustomization } from '@/services/pandaCustomizationService';
import { initializePandaInteraction } from '@/services/pandaInteractionService';
import { playSound, SoundType } from '@/utils/sound';

interface PandaSectionLabels {
  sectionTitle?: string;
  levelLabel?: string;
  experienceLabel?: string;
  interactButtonText?: string;
  feedButtonText?: string;
  playButtonText?: string;
  trainButtonText?: string;
  customizeButtonText?: string;
  environmentButtonText?: string;
  skinButtonText?: string;
}

interface PandaSectionProps {
  labels?: PandaSectionLabels;
}

/**
 * 熊猫互动区域组件
 * 显示熊猫头像和互动按钮
 */
const PandaSection: React.FC<PandaSectionProps> = ({ labels }) => {
  const {
    pandaState,
    isLoading,
    // setMood and addExperience are currently unused but may be needed in future updates
    // setMood,
    // addExperience
  } = usePandaState();

  // const [interactionMode, setInteractionMode] = useState<'none' | 'feed' | 'play' | 'train'>('none');
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(false);
  const [showEnvironmentPanel, setShowEnvironmentPanel] = useState(false);
  const [showSkinPanel, setShowSkinPanel] = useState(false);
  const [showAccessories] = useState(true); // setShowAccessories is currently unused
  const [showEnvironment, setShowEnvironment] = useState(false);

  // 初始化熊猫系统
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializePandaCustomization();
        await initializePandaInteraction();
      } catch (err) {
        console.error('Failed to initialize panda systems:', err);
      }
    };

    initialize();
  }, []);

  // 默认标签文本
  const defaultLabels: PandaSectionLabels = {
    sectionTitle: '熊猫伙伴',
    levelLabel: '等级',
    experienceLabel: '经验',
    interactButtonText: '互动',
    feedButtonText: '喂食',
    playButtonText: '玩耍',
    trainButtonText: '训练',
    customizeButtonText: '装扮',
    environmentButtonText: '环境',
    skinButtonText: '皮肤'
  };

  // 合并默认标签和传入的标签
  const mergedLabels = { ...defaultLabels, ...labels };

  // 定义熊猫状态更新处理函数
  const handlePandaStateUpdate = useCallback(() => {
    // 熊猫状态已经通过 usePandaState 获取，不需要额外处理
    console.log('Panda state updated in PandaSection');
  }, []);

  // 使用 useRegisterTableRefresh hook 监听熊猫状态变化
  useRegisterTableRefresh('pandaState', handlePandaStateUpdate);

  // 熊猫互动面板状态
  const [showInteractionPanel, setShowInteractionPanel] = useState(false);

  // 处理互动按钮点击
  const handleInteractClick = () => {
    setShowInteractionPanel(true);
    playSound(SoundType.BUTTON_CLICK, 0.3);
  };

  // 处理关闭互动面板
  const handleCloseInteractionPanel = () => {
    setShowInteractionPanel(false);
  };

  // 处理互动完成
  const handleInteractionComplete = (result: any) => {
    console.log('Interaction completed:', result);
    // 互动结果已经通过服务更新了熊猫状态，不需要额外处理
  };

  // 处理打开装扮面板
  const handleOpenCustomizationPanel = () => {
    setShowCustomizationPanel(true);
    playSound(SoundType.BUTTON_CLICK, 0.3);
  };

  // 处理关闭装扮面板
  const handleCloseCustomizationPanel = () => {
    setShowCustomizationPanel(false);
  };

  // 处理装扮变化
  const handleCustomizationChanged = () => {
    playSound(SoundType.SUCCESS, 0.5);
  };

  // 处理打开环境面板
  const handleOpenEnvironmentPanel = () => {
    setShowEnvironmentPanel(true);
    playSound(SoundType.BUTTON_CLICK, 0.3);
  };

  // 处理关闭环境面板
  const handleCloseEnvironmentPanel = () => {
    setShowEnvironmentPanel(false);
  };

  // 处理环境变化
  const handleEnvironmentChanged = () => {
    setShowEnvironment(true);
    playSound(SoundType.SUCCESS, 0.5);
  };

  // 处理打开皮肤面板
  const handleOpenSkinPanel = () => {
    setShowSkinPanel(true);
    playSound(SoundType.BUTTON_CLICK, 0.3);
  };

  // 处理关闭皮肤面板
  const handleCloseSkinPanel = () => {
    setShowSkinPanel(false);
  };

  // 处理皮肤变化
  const handleSkinChanged = () => {
    playSound(SoundType.SUCCESS, 0.5);
  };

  if (isLoading && !pandaState) {
    return <LoadingSpinner variant="jade" text="加载熊猫中..." />;
  }

  if (!pandaState) {
    return <div>无法加载熊猫状态</div>;
  }

  return (
    <motion.section
      className="panda-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {mergedLabels.sectionTitle}
      </motion.h3>

      <div className="panda-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {pandaState.level > 5 ? (
            <GoldenGlow intensity="medium">
              <PandaAnimation
                type="idle"
                mood={pandaState.mood}
                energy={pandaState.energy}
                size={150}
                loop={true}
                autoPlay={true}
                onClick={handleInteractClick}
                className={pandaState.mood}
                showAccessories={showAccessories}
                showEnvironment={showEnvironment}
              />
            </GoldenGlow>
          ) : (
            <PandaAnimation
              type="idle"
              mood={pandaState.mood}
              energy={pandaState.energy}
              size={150}
              loop={true}
              autoPlay={true}
              onClick={handleInteractClick}
              className={pandaState.mood}
              showAccessories={showAccessories}
              showEnvironment={showEnvironment}
            />
          )}
        </motion.div>

        <motion.div
          className="panda-stats"
          style={{ marginTop: '10px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p>
            <strong>{mergedLabels.levelLabel}:</strong> {pandaState.level} |
            <strong> {mergedLabels.experienceLabel}:</strong> {pandaState.experience}
          </p>
        </motion.div>
      </div>

      <motion.div
        key="interact"
        className="panda-actions"
        style={{ textAlign: 'center' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-center gap-2">
          <AnimatedButton
            variant="jade"
            onClick={handleInteractClick}
            disabled={isLoading}
          >
            {isLoading ? '请稍候...' : mergedLabels.interactButtonText}
          </AnimatedButton>

          <AnimatedButton
            variant="secondary"
            onClick={handleOpenCustomizationPanel}
            disabled={isLoading}
          >
            {mergedLabels.customizeButtonText}
          </AnimatedButton>

          <AnimatedButton
            variant="secondary"
            onClick={handleOpenEnvironmentPanel}
            disabled={isLoading}
          >
            {mergedLabels.environmentButtonText}
          </AnimatedButton>

          <AnimatedButton
            variant="secondary"
            onClick={handleOpenSkinPanel}
            disabled={isLoading}
          >
            {mergedLabels.skinButtonText}
          </AnimatedButton>
        </div>
      </motion.div>

      {/* 装扮面板 */}
      <PandaCustomizationPanel
        isOpen={showCustomizationPanel}
        onClose={handleCloseCustomizationPanel}
        onCustomizationChanged={handleCustomizationChanged}
      />

      {/* 环境面板 */}
      <PandaEnvironmentPanel
        isOpen={showEnvironmentPanel}
        onClose={handleCloseEnvironmentPanel}
        onEnvironmentChanged={handleEnvironmentChanged}
      />

      {/* 互动面板 */}
      <PandaInteractionPanel
        isOpen={showInteractionPanel}
        onClose={handleCloseInteractionPanel}
        onInteractionComplete={handleInteractionComplete}
      />

      {/* 皮肤面板 */}
      <PandaSkinPanel
        isOpen={showSkinPanel}
        onClose={handleCloseSkinPanel}
        onSkinChanged={handleSkinChanged}
      />
    </motion.section>
  );
};

export default PandaSection;
