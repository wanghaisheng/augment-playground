/**
 * @deprecated 此组件已废弃，请使用 EnhancedReflectionModule 组件代替。
 * 此组件将在下一个主要版本中移除。
 *
 * EnhancedReflectionModule 提供了以下优势：
 * 1. 使用增强的组件（如EnhancedTextArea和EnhancedInput）
 * 2. 支持更完整的反思流程，包括情绪追踪、标签管理等
 * 3. 支持多语言，通过labels属性提供本地化文本
 * 4. 更复杂的建议行动生成逻辑，基于反思内容和标签
 * 5. 支持与反思服务的集成，包括创建和完成反思记录
 */

import React from 'react';
import EnhancedReflectionModule from '@/components/reflection/EnhancedReflectionModule';
import { PandaMood } from '@/components/game/PandaAvatar';
import { ReflectionTriggerRecord } from '@/services/reflectionService';

interface ReflectionModuleProps {
  isOpen: boolean;
  onClose: () => void;
  taskName?: string;
  taskId?: number;
  mood?: PandaMood;
  onReflectionComplete?: (reflectionData: {
    taskId?: number;
    mood?: string;
    reflection: string;
    action: string;
  }) => void;
}

/**
 * 反思模块组件
 * 用于帮助用户反思任务完成情况和情绪状态
 *
 * @deprecated 此组件已废弃，请使用 EnhancedReflectionModule 组件代替。
 */
const ReflectionModule: React.FC<ReflectionModuleProps> = ({
  isOpen,
  onClose,
  taskName,
  taskId,
  mood,
  onReflectionComplete
}) => {
  // 创建一个触发记录对象，用于传递给EnhancedReflectionModule
  const trigger: ReflectionTriggerRecord | undefined = mood === 'tired' || mood === 'focused'
    ? {
        id: 0, // 临时ID
        userId: 0, // 临时用户ID
        type: 'mood_change',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    : undefined;

  // 处理反思完成
  const handleReflectionComplete = () => {
    if (onReflectionComplete) {
      // 由于EnhancedReflectionModule不返回反思数据，我们创建一个模拟的数据对象
      onReflectionComplete({
        taskId,
        mood: mood as string,
        reflection: '', // 无法获取实际的反思内容
        action: '' // 无法获取实际的行动内容
      });
    }
  };

  // 使用EnhancedReflectionModule实现
  return (
    <EnhancedReflectionModule
      isOpen={isOpen}
      onClose={onClose}
      taskId={taskId}
      taskName={taskName}
      trigger={trigger}
      onReflectionComplete={handleReflectionComplete}
      // 提供中文标签
      labels={{
        title: "静心茶室",
        triggerMessages: {
          moodChange: "我注意到你最近心情不太好。想聊聊吗？",
          taskFailureWithTitle: `我注意到你最近在"{0}"这个任务上遇到了一些困难。想聊聊吗？`,
          taskFailureGeneric: "我注意到你最近在任务上遇到了一些困难。想聊聊吗？",
          dailyReflection: "今天感觉如何？想花点时间反思一下吗？",
          weeklyReview: "这周过得怎么样？让我们一起回顾一下。",
          defaultWelcome: "欢迎来到静心茶室。想分享一下你的感受吗？",
          taskSpecific: `关于"{0}"任务，你有什么想分享的吗？`
        },
        step1: {
          toggleMoodTrackerShow: "显示情绪追踪器",
          toggleMoodTrackerHide: "隐藏情绪追踪器",
          reflectionInputLabel: "分享你的想法（可以是任何感受、困难或成就）",
          reflectionInputPlaceholder: "今天我感觉...",
          continueButton: "继续"
        },
        step2: {
          thankYouMessage: "谢谢你的分享。以下是一些可能对你有帮助的小行动，你可以选择一个尝试，或者创建自己的行动。",
          tagsLabel: "标签",
          selectTagPlaceholder: "选择或创建标签",
          customTagPlaceholder: "创建新标签",
          addTagButton: "添加",
          suggestedActionsLabel: "建议的行动",
          customActionLabel: "或者，创建你自己的行动",
          customActionPlaceholder: "我将...",
          backButton: "返回",
          completeButton: "完成反思"
        }
      }}
    />
  );
};

export default ReflectionModule;
