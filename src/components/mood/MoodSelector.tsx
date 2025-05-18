// src/components/mood/MoodSelector.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodType, MoodIntensity } from '@/services/reflectionService';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useSkeletonContext } from '@/context/SkeletonProvider';
import EnhancedInput from '@/components/common/EnhancedInput';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';
import OptimizedAnimatedItem from '@/components/animation/OptimizedAnimatedItem';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// 情绪类型数组
const moods: MoodType[] = [
  MoodType.HAPPY,
  MoodType.CONTENT,
  MoodType.NEUTRAL,
  MoodType.SAD,
  MoodType.ANXIOUS,
  MoodType.ANGRY,
  MoodType.TIRED,
  MoodType.EXCITED
];

interface MoodSelectorProps {
  onMoodSelected: (mood: MoodType, intensity: MoodIntensity) => void;
  initialMood?: MoodType | null;
  initialIntensity?: MoodIntensity;
  compact?: boolean;
  className?: string;
  priority?: 'low' | 'medium' | 'high';
  disableOnLowPerformance?: boolean;
  labels?: {
    title?: string;
    question?: string;
    intensityLabel?: string;
    intensityPrefix?: string;
    selectButton?: string;
    intensityStrength?: {
      veryMild?: string;
      mild?: string;
      moderate?: string;
      strong?: string;
      veryStrong?: string;
    };
    moods?: {
      happy?: string;
      content?: string;
      neutral?: string;
      sad?: string;
      anxious?: string;
      angry?: string;
      tired?: string;
      excited?: string;
    };
  };
}

/**
 * 情绪选择器组件
 * 用于选择当前情绪和强度
 * 
 * @param onMoodSelected - 选择情绪后的回调函数
 * @param initialMood - 初始情绪
 * @param initialIntensity - 初始强度
 * @param compact - 是否使用紧凑模式
 * @param className - 自定义类名
 * @param priority - 动画优先级
 * @param disableOnLowPerformance - 是否在低性能设备上禁用动画
 * @param labels - 本地化标签
 */
const MoodSelector: React.FC<MoodSelectorProps> = ({
  onMoodSelected,
  initialMood = null,
  initialIntensity = 3,
  compact = false,
  className = '',
  priority = 'medium',
  disableOnLowPerformance = false,
  labels: propLabels
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(initialMood);
  const [intensity, setIntensity] = useState<MoodIntensity>(initialIntensity);
  
  // 获取骨架屏上下文
  const { isSkeletonVisible } = useSkeletonContext();
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    title: propLabels?.title || componentLabels?.moodSelector?.title || "Mood Selector",
    question: propLabels?.question || componentLabels?.moodSelector?.question || "How are you feeling right now?",
    intensityLabel: propLabels?.intensityLabel || componentLabels?.moodSelector?.intensityLabel || "How intense is this feeling?",
    intensityPrefix: propLabels?.intensityPrefix || componentLabels?.moodSelector?.intensityPrefix || "Intensity",
    selectButton: propLabels?.selectButton || componentLabels?.moodSelector?.selectButton || "Select",
    intensityStrength: {
      veryMild: propLabels?.intensityStrength?.veryMild || componentLabels?.moodSelector?.intensityStrength?.veryMild || "Very Mild",
      mild: propLabels?.intensityStrength?.mild || componentLabels?.moodSelector?.intensityStrength?.mild || "Mild",
      moderate: propLabels?.intensityStrength?.moderate || componentLabels?.moodSelector?.intensityStrength?.moderate || "Moderate",
      strong: propLabels?.intensityStrength?.strong || componentLabels?.moodSelector?.intensityStrength?.strong || "Strong",
      veryStrong: propLabels?.intensityStrength?.veryStrong || componentLabels?.moodSelector?.intensityStrength?.veryStrong || "Very Strong"
    },
    moods: {
      happy: propLabels?.moods?.happy || componentLabels?.moodSelector?.moods?.happy || "Happy",
      content: propLabels?.moods?.content || componentLabels?.moodSelector?.moods?.content || "Content",
      neutral: propLabels?.moods?.neutral || componentLabels?.moodSelector?.moods?.neutral || "Neutral",
      sad: propLabels?.moods?.sad || componentLabels?.moodSelector?.moods?.sad || "Sad",
      anxious: propLabels?.moods?.anxious || componentLabels?.moodSelector?.moods?.anxious || "Anxious",
      angry: propLabels?.moods?.angry || componentLabels?.moodSelector?.moods?.angry || "Angry",
      tired: propLabels?.moods?.tired || componentLabels?.moodSelector?.moods?.tired || "Tired",
      excited: propLabels?.moods?.excited || componentLabels?.moodSelector?.moods?.excited || "Excited"
    }
  };

  // 获取情绪信息
  const getMoodInfo = (mood: MoodType) => {
    const moodInfo = {
      icon: '',
      color: '',
      label: ''
    };

    switch (mood) {
      case MoodType.HAPPY:
        moodInfo.icon = '😊';
        moodInfo.color = 'bg-green-100';
        moodInfo.label = labels.moods.happy;
        break;
      case MoodType.CONTENT:
        moodInfo.icon = '😌';
        moodInfo.color = 'bg-teal-100';
        moodInfo.label = labels.moods.content;
        break;
      case MoodType.NEUTRAL:
        moodInfo.icon = '😐';
        moodInfo.color = 'bg-gray-100';
        moodInfo.label = labels.moods.neutral;
        break;
      case MoodType.SAD:
        moodInfo.icon = '😢';
        moodInfo.color = 'bg-blue-100';
        moodInfo.label = labels.moods.sad;
        break;
      case MoodType.ANXIOUS:
        moodInfo.icon = '😰';
        moodInfo.color = 'bg-purple-100';
        moodInfo.label = labels.moods.anxious;
        break;
      case MoodType.ANGRY:
        moodInfo.icon = '😠';
        moodInfo.color = 'bg-red-100';
        moodInfo.label = labels.moods.angry;
        break;
      case MoodType.TIRED:
        moodInfo.icon = '😴';
        moodInfo.color = 'bg-indigo-100';
        moodInfo.label = labels.moods.tired;
        break;
      case MoodType.EXCITED:
        moodInfo.icon = '🤩';
        moodInfo.color = 'bg-yellow-100';
        moodInfo.label = labels.moods.excited;
        break;
      default:
        moodInfo.icon = '😐';
        moodInfo.color = 'bg-gray-100';
        moodInfo.label = labels.moods.neutral;
    }

    return moodInfo;
  };

  // 获取强度标签
  const getIntensityLabel = (intensityValue: MoodIntensity): string => {
    switch (intensityValue) {
      case 1:
        return labels.intensityStrength.veryMild;
      case 2:
        return labels.intensityStrength.mild;
      case 3:
        return labels.intensityStrength.moderate;
      case 4:
        return labels.intensityStrength.strong;
      case 5:
        return labels.intensityStrength.veryStrong;
      default:
        return labels.intensityStrength.moderate;
    }
  };

  // 处理情绪选择
  const handleMoodSelect = (mood: MoodType) => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    
    // 设置选中的情绪
    setSelectedMood(mood);
  };

  // 处理强度变化
  const handleIntensityChange = (value: string) => {
    const intensityValue = parseInt(value) as MoodIntensity;
    setIntensity(intensityValue);
  };

  // 处理选择完成
  const handleSelectComplete = () => {
    if (!selectedMood) return;
    
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    
    // 调用回调函数
    onMoodSelected(selectedMood, intensity);
  };

  // 如果正在加载或显示骨架屏，显示加载状态
  if (isSkeletonVisible) {
    return (
      <div className={`mood-selector-skeleton ${className}`}>
        <div className="h-8 bg-gray-200 animate-pulse rounded-lg mb-4 w-3/4"></div>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
        <div className="h-8 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
      </div>
    );
  }

  // 紧凑模式
  if (compact) {
    return (
      <OptimizedAnimatedContainer
        className={`mood-selector-compact ${className}`}
        priority={priority}
      >
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => {
            const { icon, color } = getMoodInfo(mood);
            return (
              <OptimizedAnimatedItem
                key={mood}
                className={`mood-item p-2 rounded-full cursor-pointer ${
                  selectedMood === mood ? 'ring-2 ring-jade-500' : ''
                } ${color}`}
                onClick={() => handleMoodSelect(mood)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                priority={priority}
              >
                <div className="mood-icon text-xl">{icon}</div>
              </OptimizedAnimatedItem>
            );
          })}
        </div>
        
        {selectedMood && (
          <div className="mt-2 flex items-center">
            <EnhancedInput
              type="range"
              min="1"
              max="5"
              value={intensity.toString()}
              onChange={(e) => handleIntensityChange(e.target.value)}
              className="flex-grow"
            />
            <Button
              variant="jade"
              size="small"
              onClick={handleSelectComplete}
              className="ml-2"
            >
              {labels.selectButton}
            </Button>
          </div>
        )}
      </OptimizedAnimatedContainer>
    );
  }

  // 标准模式
  return (
    <OptimizedAnimatedContainer
      className={`mood-selector ${className}`}
      priority={priority}
    >
      <h3 className="text-lg font-bold mb-3">
        {labels.question}
      </h3>
      
      <div className="grid grid-cols-4 gap-3 mb-4">
        {moods.map((mood) => {
          const { icon, color, label } = getMoodInfo(mood);
          return (
            <OptimizedAnimatedItem
              key={mood}
              className={`mood-item p-3 rounded-lg cursor-pointer text-center ${
                selectedMood === mood ? 'ring-2 ring-jade-500 shadow-md' : ''
              } ${color} hover:shadow-md transition-all duration-200`}
              onClick={() => handleMoodSelect(mood)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              priority={priority}
            >
              <div className="mood-icon text-2xl mb-1">{icon}</div>
              <div className="mood-label text-xs font-medium">{label}</div>
            </OptimizedAnimatedItem>
          );
        })}
      </div>
      
      {selectedMood && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="intensity-selector mt-4"
          >
            <h3 className="text-lg font-bold mb-2">{labels.intensityLabel}</h3>
            <div className="flex items-center mb-4">
              <EnhancedInput
                type="range"
                min="1"
                max="5"
                value={intensity.toString()}
                onChange={(e) => handleIntensityChange(e.target.value)}
                className="flex-grow"
              />
              <span className="ml-3 text-sm font-medium px-2 py-1 bg-jade-100 text-jade-800 rounded-md">
                {getIntensityLabel(intensity)}
              </span>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="jade"
                onClick={handleSelectComplete}
              >
                {labels.selectButton}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </OptimizedAnimatedContainer>
  );
};

export default MoodSelector;
