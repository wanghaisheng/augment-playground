// src/components/vip/SubscriptionRetentionFlow.tsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import { useDataRefresh } from '@/context/DataRefreshProvider';
import {
  RetentionStep,
  // getRetentionSteps, // Commented out as it's not used
  getNextRetentionStep,
  createRetentionOffer,
  acceptRetentionOffer,
  rejectRetentionOffer
} from '@/services/subscriptionRetentionService';
// import { getUserVipStatus } from '@/services/vipService'; // Commented out as it's not used
import { playSound, SoundType } from '@/utils/sound';
import { generateSparkleParticles } from '@/utils/particleEffects';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RetentionOfferCard from './RetentionOfferCard';
import FeedbackForm from './FeedbackForm';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';

interface SubscriptionRetentionFlowProps {
  userId: string;
  onComplete: (retained: boolean) => void;
  onClose: () => void;
}

/**
 * 订阅挽留流程组件
 * 多步骤挽留流程，尝试挽留准备取消订阅的用户
 */
const SubscriptionRetentionFlow: React.FC<SubscriptionRetentionFlowProps> = ({
  userId,
  onComplete,
  onClose
}) => {
  const { language } = useLanguage();
  const { refreshTable } = useDataRefresh();

  // 状态
  const [currentStep, setCurrentStep] = useState<RetentionStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [offerId, setOfferId] = useState<number | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successParticles, setSuccessParticles] = useState<React.ReactNode[]>([]);
  const [isRetained, setIsRetained] = useState(false);

  // 加载下一个挽留步骤
  useEffect(() => {
    const loadNextStep = async () => {
      setIsLoading(true);
      try {
        const nextStep = await getNextRetentionStep(userId);
        setCurrentStep(nextStep);

        // 如果没有下一步，直接完成流程
        if (!nextStep) {
          onComplete(isRetained);
        }
      } catch (error) {
        console.error('Failed to load next retention step:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNextStep();
  }, [userId, currentStepIndex, isRetained, onComplete]);

  // 创建优惠
  const handleCreateOffer = async () => {
    if (!currentStep) return;

    setIsProcessing(true);
    try {
      const offer = await createRetentionOffer(userId, currentStep.id);

      if (offer) {
        setOfferId(offer.id || null);

        // 如果是自定义反馈类型，显示反馈表单
        if (currentStep.type === 'custom') {
          setShowFeedbackForm(true);
        }
      }
    } catch (error) {
      console.error('Failed to create retention offer:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 接受优惠
  const handleAcceptOffer = async () => {
    if (!offerId) return;

    setIsProcessing(true);
    try {
      const success = await acceptRetentionOffer(userId, offerId);

      if (success) {
        // 播放成功音效
        playSound(SoundType.SUCCESS);

        // 显示成功动画
        setShowSuccessAnimation(true);
        setSuccessParticles(generateSparkleParticles({
          count: 50,
          colors: ['#FFD700', '#FFEB3B', '#FFC107', '#FFFDE7']
        }));

        // 刷新数据
        refreshTable('vipSubscriptions');
        refreshTable('userCurrencies');

        // 标记为已挽留
        setIsRetained(true);

        // 3秒后隐藏动画并进入下一步
        setTimeout(() => {
          setShowSuccessAnimation(false);
          setCurrentStepIndex(prev => prev + 1);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to accept retention offer:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 拒绝优惠
  const handleRejectOffer = async () => {
    if (!offerId) return;

    setIsProcessing(true);
    try {
      await rejectRetentionOffer(userId, offerId);

      // 进入下一步
      setCurrentStepIndex(prev => prev + 1);
    } catch (error) {
      console.error('Failed to reject retention offer:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 处理反馈提交
  const handleFeedbackSubmit = async (feedback: string) => {
    // 这里可以保存用户反馈
    console.log('User feedback:', feedback);

    // 隐藏反馈表单
    setShowFeedbackForm(false);

    // 进入下一步
    setCurrentStepIndex(prev => prev + 1);
  };

  // 确认取消订阅
  const handleConfirmCancel = () => {
    setShowConfirmation(true);
  };

  // 最终取消订阅
  const handleFinalCancel = () => {
    // 关闭确认对话框
    setShowConfirmation(false);

    // 完成流程，未挽留
    onComplete(false);
  };

  // 获取标题
  const getTitle = () => {
    if (!currentStep) {
      return language === 'zh' ? '特别优惠' : 'Special Offer';
    }

    return language === 'zh' ? currentStep.title.zh : currentStep.title.en;
  };

  // 获取描述
  const getDescription = () => {
    if (!currentStep) {
      return language === 'zh'
        ? '我们很遗憾看到您准备离开。在您做最终决定前，我们想为您提供一些特别优惠。'
        : 'We\'re sorry to see you go. Before you make your final decision, we\'d like to offer you something special.';
    }

    return language === 'zh' ? currentStep.description.zh : currentStep.description.en;
  };

  // 获取按钮文本
  const getButtonText = (type: 'accept' | 'reject') => {
    if (type === 'accept') {
      return language === 'zh' ? '接受优惠' : 'Accept Offer';
    } else {
      return language === 'zh' ? '不，谢谢' : 'No, Thanks';
    }
  };

  // 获取确认对话框文本
  const getConfirmationText = () => {
    return language === 'zh'
      ? '您确定要取消订阅吗？这将导致您失去所有VIP特权。'
      : 'Are you sure you want to cancel your subscription? This will result in the loss of all VIP privileges.';
  };

  return (
    <div className="subscription-retention-flow bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto relative">
      {/* 关闭按钮 */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        onClick={onClose}
      >
        ✕
      </button>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* 成功动画 */}
          {showSuccessAnimation && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="particles-container absolute inset-0">
                {successParticles}
              </div>
              <div className="success-message bg-green-600 text-white px-4 py-2 rounded-full text-lg font-bold animate-bounce">
                {language === 'zh' ? '优惠已应用！' : 'Offer Applied!'}
              </div>
            </div>
          )}

          {/* 标题 */}
          <h2 className="text-2xl font-bold text-center mb-4 text-amber-800">
            {getTitle()}
          </h2>

          {/* 描述 */}
          <p className="text-gray-600 text-center mb-6">
            {getDescription()}
          </p>

          {/* 优惠卡片 */}
          {currentStep && !showFeedbackForm && (
            <RetentionOfferCard
              step={currentStep}
              language={language}
              onCreateOffer={handleCreateOffer}
            />
          )}

          {/* 反馈表单 */}
          {showFeedbackForm && (
            <FeedbackForm
              onSubmit={handleFeedbackSubmit}
              onCancel={() => setShowFeedbackForm(false)}
              language={language}
            />
          )}

          {/* 操作按钮 */}
          {offerId && !showFeedbackForm && (
            <div className="flex justify-center gap-4 mt-6">
              <Button
                color="primary"
                onClick={handleAcceptOffer}
                disabled={isProcessing}
              >
                {getButtonText('accept')}
              </Button>

              <Button
                color="secondary"
                onClick={handleRejectOffer}
                disabled={isProcessing}
              >
                {getButtonText('reject')}
              </Button>
            </div>
          )}

          {/* 最终取消按钮 */}
          <div className="mt-8 text-center">
            <button
              className="text-gray-500 hover:text-gray-700 text-sm"
              onClick={handleConfirmCancel}
            >
              {language === 'zh' ? '继续取消订阅' : 'Continue with Cancellation'}
            </button>
          </div>

          {/* 确认对话框 */}
          {showConfirmation && (
            <ConfirmationDialog
              title={language === 'zh' ? '确认取消' : 'Confirm Cancellation'}
              message={getConfirmationText()}
              confirmText={language === 'zh' ? '确认取消' : 'Confirm'}
              cancelText={language === 'zh' ? '返回' : 'Go Back'}
              onConfirm={handleFinalCancel}
              onCancel={() => setShowConfirmation(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SubscriptionRetentionFlow;
