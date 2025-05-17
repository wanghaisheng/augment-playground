// src/components/game/ReflectionModule.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';
import ScrollDialog from './ScrollDialog';
import { playSound, SoundType } from '@/utils/sound';

import { updatePandaMood } from '@/services/pandaStateService';
import { PandaMood } from '@/components/game/PandaAvatar';

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
 */
const ReflectionModule: React.FC<ReflectionModuleProps> = ({
  isOpen,
  onClose,
  taskName,
  taskId,
  mood: initialMood,
  onReflectionComplete
}) => {
  const [step, setStep] = useState(1);
  const [mood] = useState<PandaMood>(initialMood as PandaMood || 'normal');
  const [reflection, setReflection] = useState('');
  const [action, setAction] = useState('');
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pandaMessage, setPandaMessage] = useState('');

  // 根据任务名称和心情设置熊猫消息
  useEffect(() => {
    if (taskName) {
      if (mood === 'tired' || mood === 'focused') {
        setPandaMessage(`我注意到你最近在"${taskName}"这个任务上遇到了一些困难。想聊聊吗？`);
      } else {
        setPandaMessage('今天感觉如何？想花点时间反思一下吗？');
      }
    } else if (mood === 'tired' || mood === 'focused') {
      setPandaMessage('我注意到你最近心情不太好。想聊聊吗？');
    } else {
      setPandaMessage('今天感觉如何？想花点时间反思一下吗？');
    }
  }, [taskName, mood]);

  // 根据反思内容生成建议行动
  useEffect(() => {
    if (reflection && step === 2) {
      // 这里可以根据反思内容生成建议行动
      // 在实际应用中，可以使用更复杂的算法或API来生成建议
      const lowerReflection = reflection.toLowerCase();

      if (lowerReflection.includes('压力') || lowerReflection.includes('焦虑') || lowerReflection.includes('紧张')) {
        setSuggestedActions([
          '尝试5分钟的深呼吸冥想',
          '出去散步15分钟',
          '与朋友聊天分享感受',
          '写下三件让你感到感激的事情'
        ]);
      } else if (lowerReflection.includes('疲惫') || lowerReflection.includes('累') || lowerReflection.includes('没精力')) {
        setSuggestedActions([
          '确保今晚早点休息',
          '尝试20分钟的午休',
          '减少今天的任务量',
          '喝足够的水，吃些健康的食物'
        ]);
      } else if (lowerReflection.includes('拖延') || lowerReflection.includes('专注') || lowerReflection.includes('分心')) {
        setSuggestedActions([
          '使用番茄工作法，专注25分钟',
          '将大任务分解成小步骤',
          '创建一个无干扰的工作环境',
          '设置一个小的、可实现的目标'
        ]);
      } else {
        setSuggestedActions([
          '花5分钟进行深呼吸冥想',
          '写下三件让你感到感激的事情',
          '设定一个小的、可实现的目标',
          '与朋友或家人分享你的感受'
        ]);
      }
    }
  }, [reflection, step]);

  // 处理提交反思
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);

      // 如果心情不好，尝试更新为正常
      if (mood === 'tired') {
        await updatePandaMood('normal');
      }

      // 通知父组件
      if (onReflectionComplete) {
        onReflectionComplete({
          taskId,
          mood,
          reflection,
          action
        });
      }

      // 重置状态
      setStep(1);
      setReflection('');
      setAction('');

      // 关闭对话框
      onClose();
    } catch (error) {
      console.error('Failed to submit reflection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理选择建议行动
  const handleSelectAction = (selectedAction: string) => {
    setAction(selectedAction);
  };

  // 渲染步骤1：反思输入
  const renderStep1 = () => (
    <div className="reflection-step">
      <div className="panda-message mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start">
          <div className="panda-avatar mr-2">
            <span className="text-2xl">🐼</span>
          </div>
          <div className="panda-text">
            <p>{pandaMessage}</p>
          </div>
        </div>
      </div>

      <div className="reflection-input mb-4">
        <label htmlFor="reflection" className="block text-sm font-medium text-gray-700 mb-1">
          分享你的想法（可以是任何感受、困难或成就）
        </label>
        <textarea
          id="reflection"
          className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-jade focus:border-jade"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="今天我感觉..."
        />
      </div>

      <div className="reflection-actions flex justify-end">
        <Button variant="jade" onClick={() => setStep(2)} disabled={!reflection.trim()}>
          继续
        </Button>
      </div>
    </div>
  );

  // 渲染步骤2：行动选择
  const renderStep2 = () => (
    <div className="reflection-step">
      <div className="panda-message mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start">
          <div className="panda-avatar mr-2">
            <span className="text-2xl">🐼</span>
          </div>
          <div className="panda-text">
            <p>谢谢你的分享。以下是一些可能对你有帮助的小行动，你可以选择一个尝试，或者创建自己的行动。</p>
          </div>
        </div>
      </div>

      <div className="suggested-actions mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">建议的行动</h3>
        <div className="grid grid-cols-1 gap-2">
          {suggestedActions.map((suggestedAction, index) => (
            <motion.div
              key={index}
              className={`p-2 border rounded-md cursor-pointer ${action === suggestedAction ? 'border-jade bg-jade-50' : 'border-gray-300'}`}
              onClick={() => handleSelectAction(suggestedAction)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {suggestedAction}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="custom-action mb-4">
        <label htmlFor="custom-action" className="block text-sm font-medium text-gray-700 mb-1">
          或者，创建你自己的行动
        </label>
        <input
          id="custom-action"
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade focus:border-jade"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="我将..."
        />
      </div>

      <div className="reflection-actions flex justify-between">
        <Button variant="secondary" onClick={() => setStep(1)}>
          返回
        </Button>
        <Button variant="gold" onClick={handleSubmit} disabled={!action.trim() || isSubmitting}>
          {isSubmitting ? '提交中...' : '完成反思'}
        </Button>
      </div>
    </div>
  );

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title="静心茶室"
      closeOnOutsideClick={false}
      closeOnEsc={true}
      showCloseButton={true}
    >
      <div className="reflection-module p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 ? renderStep1() : renderStep2()}
          </motion.div>
        </AnimatePresence>
      </div>
    </ScrollDialog>
  );
};

export default ReflectionModule;
