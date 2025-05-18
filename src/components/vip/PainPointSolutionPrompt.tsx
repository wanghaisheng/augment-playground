// src/components/vip/PainPointSolutionPrompt.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import LatticeDialog from '@/components/game/LatticeDialog';
import {
  markPainPointTriggerAsViewed,
  resolvePainPointTrigger,
  getPainPointSolutionDetails
} from '@/services/painPointService';
import type { PainPointSolutionRecord, PainPointTriggerRecord } from '@/types/painpoints';
import { playSound, SoundType } from '@/utils/sound';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchPainPointSolutionView } from '@/services/localizedContentService';


interface PainPointSolutionPromptProps {
  triggerId: number;
  onClose: () => void;
}

/**
 * 痛点解决方案提示组件
 *
 * 在用户遇到困难时提供帮助和解决方案
 */
const PainPointSolutionPrompt: React.FC<PainPointSolutionPromptProps> = ({
  triggerId,
  onClose
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<PainPointSolutionRecord | null>(null);
  const [trigger, setTrigger] = useState<PainPointTriggerRecord | null>(null);
  const [isVip, setIsVip] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  // Fetch localized content for the pain point solution
  const { data: viewData } = useLocalizedView<null, { labels: { [key: string]: string } }>('painPointSolution', fetchPainPointSolutionView);

  // Get content from viewData
  const content = viewData?.labels || {} as { [key: string]: string };

  // 加载痛点解决方案详情
  useEffect(() => {
    const loadSolutionDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const details = await getPainPointSolutionDetails(triggerId);
        if (!details) {
          setError('无法加载解决方案详情');
          return;
        }

        setSolution(details.solution);
        setTrigger(details.trigger);
        setIsVip(details.isVip);

        // 标记为已查看
        await markPainPointTriggerAsViewed(triggerId);
      } catch (error) {
        console.error('Failed to load pain point solution details:', error);
        setError('加载解决方案详情时出错');
      } finally {
        setIsLoading(false);
      }
    };

    loadSolutionDetails();
  }, [triggerId]);

  // 处理解决方案应用
  const handleApplySolution = async () => {
    try {
      if (!trigger || !solution) return;

      playSound(SoundType.CONFIRM);

      // 标记为已解决
      await resolvePainPointTrigger(
        trigger.id!,
        isVip ? 'Applied VIP solution' : 'Applied regular solution'
      );

      setIsResolved(true);

      // 如果是VIP用户，可能需要应用特殊解决方案
      if (isVip) {
        // 这里可以根据不同的痛点类型应用不同的VIP解决方案
        // 例如，如果是资源不足，可以给用户增加资源
        // 如果是连续打卡中断，可以恢复连续打卡记录
        // 等等
      }

      // 延迟关闭对话框
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to apply pain point solution:', error);
      setError('应用解决方案时出错');
    }
  };

  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.BUTTON_CLICK);
    onClose();
    navigate('/vip-benefits');
  };

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <LatticeDialog
        isOpen={true}
        onClose={onClose}
        title={content.loadingTitle || '加载中...'}
      >
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-jade-500"></div>
        </div>
      </LatticeDialog>
    );
  }

  // 如果出错，显示错误信息
  if (error || !solution || !trigger) {
    return (
      <LatticeDialog
        isOpen={true}
        onClose={onClose}
        title={content.errorTitle || '出错了'}
      >
        <div className="text-center py-8">
          <p className="text-red-500">{error || '无法加载解决方案'}</p>
          <Button
            variant="filled"
            color="jade"
            onClick={onClose}
            className="mt-4"
          >
            {content.closeButton || '关闭'}
          </Button>
        </div>
      </LatticeDialog>
    );
  }

  return (
    <LatticeDialog
      isOpen={true}
      onClose={onClose}
      title={solution.title}
      showCloseButton={true}
    >
      <div className="pain-point-solution-content">
        <p className="text-gray-700 mb-4">
          {solution.description}
        </p>

        <div className="solution-container mb-6">
          <div className={`p-4 rounded-lg ${isVip ? 'bg-gold-50 border border-gold-200' : 'bg-gray-50 border border-gray-200'}`}>
            <h3 className={`font-medium mb-2 ${isVip ? 'text-gold-700' : 'text-gray-700'}`}>
              {isVip ? (
                <span className="flex items-center">
                  <span className="mr-1">★</span>
                  {content.vipSolutionTitle || 'VIP解决方案'}
                </span>
              ) : (
                content.regularSolutionTitle || '推荐解决方案'
              )}
            </h3>

            <p className="text-gray-600">
              {isVip ? solution.vipSolution : solution.regularSolution}
            </p>

            {!isVip && (
              <div className="mt-4 p-3 bg-gold-50 border border-gold-200 rounded-lg">
                <h4 className="font-medium text-gold-700 flex items-center">
                  <span className="mr-1">★</span>
                  {content.vipAlternativeTitle || 'VIP专属解决方案'}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {solution.vipSolution}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isResolved}
          >
            {content.laterButton || '稍后再说'}
          </Button>

          {!isVip && (
            <Button
              variant="gold"
              onClick={handleNavigateToVip}
              disabled={isResolved}
            >
              {content.upgradeButton || '升级到VIP'}
            </Button>
          )}

          <Button
            variant="filled"
            color="jade"
            onClick={handleApplySolution}
            disabled={isResolved}
            isLoading={isResolved}
          >
            {isResolved
              ? (content.appliedButton || '已应用')
              : (content.applyButton || '应用解决方案')}
          </Button>
        </div>

        {/* 成功应用解决方案的动画 */}
        <AnimatePresence>
          {isResolved && (
            <motion.div
              className="absolute inset-0 bg-jade-500 bg-opacity-20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-full p-4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <svg className="w-16 h-16 text-jade-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LatticeDialog>
  );
};

export default PainPointSolutionPrompt;
