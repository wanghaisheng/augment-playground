// src/components/panda/PandaStatusTab.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  getPandaStatus, 
  PandaStatusRecord,
  PandaLevel,
  PandaEvolutionStage
} from '@/services/pandaStatusService';
import { formatNumber } from '@/utils/formatters';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { usePandaState } from '@/context/PandaStateProvider';
import { useSkeletonContext } from '@/context/SkeletonProvider';
import EnhancedPandaAvatar from './EnhancedPandaAvatar';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';
import EnhancedDataLoader from '@/components/common/EnhancedDataLoader';
import Button from '@/components/common/Button';
import ProgressBar from '@/components/common/ProgressBar';
import TraditionalWindowModal from '@/components/common/TraditionalWindowModal';

interface PandaStatusTabProps {
  className?: string;
  labels?: {
    title?: string;
    level?: string;
    experience?: string;
    nextLevel?: string;
    mood?: string;
    energy?: string;
    focus?: string;
    happiness?: string;
    health?: string;
    evolution?: {
      baby?: string;
      child?: string;
      teen?: string;
      adult?: string;
      master?: string;
    };
    stats?: string;
    details?: string;
    close?: string;
  };
}

/**
 * 熊猫状态标签页组件
 * 显示熊猫的等级、经验、情绪、能量等状态信息
 * 
 * @param className - 自定义类名
 * @param labels - 本地化标签
 */
const PandaStatusTab: React.FC<PandaStatusTabProps> = ({
  className = '',
  labels: propLabels
}) => {
  const [pandaStatus, setPandaStatus] = useState<PandaStatusRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // 获取熊猫状态
  const { pandaState, updatePandaState } = usePandaState();
  
  // 获取骨架屏上下文
  const { isSkeletonVisible } = useSkeletonContext();
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    title: propLabels?.title || componentLabels?.pandaStatus?.title || "Panda Status",
    level: propLabels?.level || componentLabels?.pandaStatus?.level || "Level",
    experience: propLabels?.experience || componentLabels?.pandaStatus?.experience || "Experience",
    nextLevel: propLabels?.nextLevel || componentLabels?.pandaStatus?.nextLevel || "Next Level",
    mood: propLabels?.mood || componentLabels?.pandaStatus?.mood || "Mood",
    energy: propLabels?.energy || componentLabels?.pandaStatus?.energy || "Energy",
    focus: propLabels?.focus || componentLabels?.pandaStatus?.focus || "Focus",
    happiness: propLabels?.happiness || componentLabels?.pandaStatus?.happiness || "Happiness",
    health: propLabels?.health || componentLabels?.pandaStatus?.health || "Health",
    evolution: {
      baby: propLabels?.evolution?.baby || componentLabels?.pandaStatus?.evolution?.baby || "Baby",
      child: propLabels?.evolution?.child || componentLabels?.pandaStatus?.evolution?.child || "Child",
      teen: propLabels?.evolution?.teen || componentLabels?.pandaStatus?.evolution?.teen || "Teen",
      adult: propLabels?.evolution?.adult || componentLabels?.pandaStatus?.evolution?.adult || "Adult",
      master: propLabels?.evolution?.master || componentLabels?.pandaStatus?.evolution?.master || "Master"
    },
    stats: propLabels?.stats || componentLabels?.pandaStatus?.stats || "Stats",
    details: propLabels?.details || componentLabels?.pandaStatus?.details || "Details",
    close: propLabels?.close || componentLabels?.pandaStatus?.close || "Close"
  };

  // 加载熊猫状态
  const loadPandaStatus = async () => {
    try {
      const status = await getPandaStatus();
      setPandaStatus(status);
      
      // 更新全局熊猫状态
      if (updatePandaState) {
        updatePandaState({
          mood: status.mood,
          energy: status.energyLevel,
          level: status.level,
          evolutionStage: status.evolutionStage
        });
      }
    } catch (err) {
      console.error('Failed to load panda status:', err);
    }
  };

  // 初始加载
  useEffect(() => {
    loadPandaStatus();
  }, []);

  // 注册数据刷新监听
  useRegisterTableRefresh('pandaStatus', loadPandaStatus);
  useRegisterTableRefresh('pandaExperience', loadPandaStatus);

  // 处理查看详情
  const handleViewDetails = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    setShowDetailsModal(true);
  };

  // 处理关闭详情
  const handleCloseDetails = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    setShowDetailsModal(false);
  };

  // 获取进化阶段文本
  const getEvolutionStageText = (stage: PandaEvolutionStage): string => {
    switch (stage) {
      case PandaEvolutionStage.BABY:
        return labels.evolution.baby;
      case PandaEvolutionStage.CHILD:
        return labels.evolution.child;
      case PandaEvolutionStage.TEEN:
        return labels.evolution.teen;
      case PandaEvolutionStage.ADULT:
        return labels.evolution.adult;
      case PandaEvolutionStage.MASTER:
        return labels.evolution.master;
      default:
        return '';
    }
  };

  // 获取情绪颜色
  const getMoodColor = (mood: string): string => {
    switch (mood) {
      case 'happy':
        return 'text-green-600';
      case 'focused':
        return 'text-blue-600';
      case 'tired':
        return 'text-orange-600';
      case 'normal':
      default:
        return 'text-gray-600';
    }
  };

  // 获取能量颜色
  const getEnergyColor = (energy: string): string => {
    switch (energy) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-blue-600';
      case 'low':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  // 渲染熊猫状态
  return (
    <EnhancedDataLoader
      isLoading={isSkeletonVisible}
      isError={false}
      error={null}
      data={pandaStatus}
      skeletonVariant="jade"
      skeletonLayout="card"
      skeletonCount={1}
    >
      {(status) => (
        <OptimizedAnimatedContainer
          className={`panda-status-tab ${className}`}
          priority="high"
        >
          <div className="panda-avatar-container flex justify-center mb-6">
            <EnhancedPandaAvatar
              mood={status.mood}
              energy={status.energyLevel}
              size={180}
              showAccessories={true}
              showEnvironment={false}
              animate={true}
              onClick={handleViewDetails}
            />
          </div>

          <div className="panda-level-info bg-jade-50 rounded-lg p-4 mb-4 border border-jade-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-jade-800">
                {labels.level} {status.level}
              </h3>
              <span className="text-sm text-jade-600">
                {getEvolutionStageText(status.evolutionStage)}
              </span>
            </div>
            
            <div className="experience-bar mb-2">
              <ProgressBar
                value={status.experience}
                maxValue={status.experienceToNextLevel}
                variant="jade"
                showPercentage={true}
                height={12}
                label={`${labels.experience}: ${formatNumber(status.experience)}/${formatNumber(status.experienceToNextLevel)}`}
              />
            </div>
            
            <div className="text-xs text-gray-500 text-right">
              {labels.nextLevel}: {formatNumber(status.experienceToNextLevel - status.experience)} XP
            </div>
          </div>

          <div className="panda-status-info grid grid-cols-2 gap-3 mb-4">
            <div className="status-item bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-600">{labels.mood}</h4>
              <p className={`text-lg font-bold ${getMoodColor(status.mood)}`}>
                {status.mood.charAt(0).toUpperCase() + status.mood.slice(1)}
              </p>
            </div>
            
            <div className="status-item bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-600">{labels.energy}</h4>
              <p className={`text-lg font-bold ${getEnergyColor(status.energyLevel)}`}>
                {status.energyLevel.charAt(0).toUpperCase() + status.energyLevel.slice(1)}
              </p>
            </div>
          </div>

          <div className="panda-attributes grid grid-cols-1 gap-2 mb-4">
            <div className="attribute-item">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">{labels.focus}</span>
                <span className="text-sm font-bold text-gray-700">{status.focus}/100</span>
              </div>
              <ProgressBar
                value={status.focus}
                maxValue={100}
                variant="blue"
                height={8}
              />
            </div>
            
            <div className="attribute-item">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">{labels.happiness}</span>
                <span className="text-sm font-bold text-gray-700">{status.happiness}/100</span>
              </div>
              <ProgressBar
                value={status.happiness}
                maxValue={100}
                variant="green"
                height={8}
              />
            </div>
            
            <div className="attribute-item">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">{labels.health}</span>
                <span className="text-sm font-bold text-gray-700">{status.health}/100</span>
              </div>
              <ProgressBar
                value={status.health}
                maxValue={100}
                variant="red"
                height={8}
              />
            </div>
          </div>

          <div className="panda-actions flex justify-center">
            <Button
              variant="jade"
              onClick={handleViewDetails}
            >
              {labels.details}
            </Button>
          </div>

          {/* 详情模态框 */}
          {showDetailsModal && (
            <TraditionalWindowModal
              isOpen={showDetailsModal}
              onClose={handleCloseDetails}
              title={labels.stats}
              size="medium"
            >
              <div className="panda-details-content p-4">
                {/* 详细统计信息 */}
                <div className="stats-grid grid grid-cols-2 gap-4 mb-4">
                  <div className="stat-item">
                    <h4 className="text-sm font-medium text-gray-600">{labels.level}</h4>
                    <p className="text-lg font-bold text-jade-700">{status.level}</p>
                  </div>
                  
                  <div className="stat-item">
                    <h4 className="text-sm font-medium text-gray-600">{labels.evolution.baby}</h4>
                    <p className="text-lg font-bold text-jade-700">{getEvolutionStageText(status.evolutionStage)}</p>
                  </div>
                  
                  {/* 更多统计信息 */}
                </div>
                
                <div className="modal-actions flex justify-end mt-4">
                  <Button
                    variant="secondary"
                    onClick={handleCloseDetails}
                  >
                    {labels.close}
                  </Button>
                </div>
              </div>
            </TraditionalWindowModal>
          )}
        </OptimizedAnimatedContainer>
      )}
    </EnhancedDataLoader>
  );
};

export default PandaStatusTab;
