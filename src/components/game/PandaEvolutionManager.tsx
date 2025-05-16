// src/components/game/PandaEvolutionManager.tsx
import React, { useState, useEffect } from 'react';
import { onPandaLevelUp, PandaStateRecord } from '@/services/pandaStateService';
import { getUnlockedAbilities } from '@/services/abilityService';
import PandaEvolutionModal from './PandaEvolutionModal';
import { useLocalizedLabels } from '@/hooks/useLocalizedLabels';

/**
 * 熊猫进化管理器组件的标签
 */
interface PandaEvolutionLabels {
  evolutionTitle: string;
  evolutionMessage: string;
  continueButtonLabel: string;
  levelLabel: string;
  newAbilitiesMessage: string;
}

/**
 * 熊猫进化管理器组件
 * 
 * 监听熊猫等级提升事件，并在熊猫升级时显示进化动画
 */
const PandaEvolutionManager: React.FC = () => {
  // 状态
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [previousLevel, setPreviousLevel] = useState<number>(1);
  const [newLevel, setNewLevel] = useState<number>(1);
  const [pandaState, setPandaState] = useState<PandaStateRecord | null>(null);
  const [newAbilities, setNewAbilities] = useState<Array<{id: number; name: string; description: string}>>([]);
  
  // 获取本地化标签
  const { labels, isLoading } = useLocalizedLabels<PandaEvolutionLabels>('pandaEvolution', {
    evolutionTitle: '熊猫进化！',
    evolutionMessage: '恭喜！你的熊猫已经成长到{level}级，获得了新的能力和外观！',
    continueButtonLabel: '继续',
    levelLabel: '等级',
    newAbilitiesMessage: '解锁新能力：'
  });
  
  // 处理熊猫等级提升事件
  useEffect(() => {
    // 注册等级提升回调
    const unsubscribe = onPandaLevelUp(async (prevLevel, newLvl, state) => {
      console.log(`Panda leveled up from ${prevLevel} to ${newLvl}!`);
      
      // 获取新解锁的能力
      const abilities = await getUnlockedAbilities(prevLevel, newLvl);
      
      // 更新状态
      setPreviousLevel(prevLevel);
      setNewLevel(newLvl);
      setPandaState(state);
      setNewAbilities(abilities);
      
      // 显示进化模态框
      setIsModalVisible(true);
    });
    
    // 清理函数
    return () => {
      unsubscribe();
    };
  }, []);
  
  // 处理关闭模态框
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  
  // 如果标签正在加载，不渲染任何内容
  if (isLoading) {
    return null;
  }
  
  // 格式化进化消息，替换{level}占位符
  const formatEvolutionMessage = (message: string, level: number) => {
    return message.replace('{level}', level.toString());
  };
  
  return (
    <>
      {pandaState && (
        <PandaEvolutionModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          previousLevel={previousLevel}
          newLevel={newLevel}
          mood={pandaState.mood}
          energy={pandaState.energy}
          playSoundEffects={true}
          labels={{
            evolutionTitle: labels.evolutionTitle,
            evolutionMessage: formatEvolutionMessage(labels.evolutionMessage, newLevel),
            continueButtonLabel: labels.continueButtonLabel,
            levelLabel: labels.levelLabel,
            newAbilitiesMessage: labels.newAbilitiesMessage
          }}
          newAbilities={newAbilities}
        />
      )}
    </>
  );
};

export default PandaEvolutionManager;
