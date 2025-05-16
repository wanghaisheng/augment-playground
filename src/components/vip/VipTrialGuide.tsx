// src/components/vip/VipTrialGuide.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LatticeDialog from '@/components/game/LatticeDialog';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import { VipTrialRecord, markVipTrialGuideAsShown } from '@/services/vipTrialService';
import { useLocalizedView } from '@/hooks/useLocalizedView';

interface VipTrialGuideProps {
  isOpen: boolean;
  onClose: () => void;
  trial: VipTrialRecord;
}

/**
 * VIP试用指南组件
 * 
 * 在用户获得VIP试用资格后显示，介绍VIP特权并引导用户体验
 */
const VipTrialGuide: React.FC<VipTrialGuideProps> = ({
  isOpen,
  onClose,
  trial
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const { content } = useLocalizedView('vipTrialGuide');
  
  // VIP特权列表
  const vipBenefits = [
    {
      title: content.benefitResourceTitle || '资源加成',
      description: content.benefitResourceDescription || '获得2倍竹子和金币奖励，加速熊猫成长',
      icon: '🎁'
    },
    {
      title: content.benefitSkinsTitle || '专属皮肤',
      description: content.benefitSkinsDescription || '解锁VIP专属熊猫皮肤，让您的熊猫与众不同',
      icon: '🐼'
    },
    {
      title: content.benefitGoalsTitle || '更多目标',
      description: content.benefitGoalsDescription || '创建多达5个自定义目标，更好地追踪您的进步',
      icon: '🎯'
    },
    {
      title: content.benefitSolutionsTitle || '智能解决方案',
      description: content.benefitSolutionsDescription || '获得VIP专属解决方案，帮助您克服困难',
      icon: '💡'
    }
  ];
  
  // 处理下一步
  const handleNext = () => {
    playSound(SoundType.BUTTON_CLICK);
    if (currentStep < vipBenefits.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };
  
  // 处理上一步
  const handlePrevious = () => {
    playSound(SoundType.BUTTON_CLICK);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // 处理完成
  const handleFinish = async () => {
    try {
      playSound(SoundType.SUCCESS);
      
      // 标记为已显示
      await markVipTrialGuideAsShown(trial.id!);
      
      // 关闭对话框
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, 300);
    } catch (error) {
      console.error('Failed to mark VIP trial guide as shown:', error);
    }
  };
  
  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.BUTTON_CLICK);
    onClose();
    navigate('/vip-benefits');
  };
  
  // 计算试用结束日期
  const getTrialEndDate = () => {
    if (!trial.endDate) return '';
    
    const endDate = new Date(trial.endDate);
    return endDate.toLocaleDateString();
  };
  
  // 渲染欢迎步骤
  const renderWelcomeStep = () => (
    <div className="welcome-step text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="vip-icon mb-6"
      >
        <span className="text-6xl">✨</span>
      </motion.div>
      
      <h2 className="text-2xl font-bold text-gold-700 mb-4">
        {content.welcomeTitle || '恭喜！您获得了7天VIP试用特权'}
      </h2>
      
      <p className="text-gray-600 mb-6">
        {content.welcomeDescription || '感谢您使用熊猫习惯，我们很高兴为您提供7天的VIP会员试用期，让您体验所有高级功能。'}
      </p>
      
      <div className="trial-info bg-gold-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700">
          {content.trialPeriodInfo?.replace('{endDate}', getTrialEndDate()) || 
           `您的VIP试用期将于 ${getTrialEndDate()} 结束。在此期间，您可以体验所有VIP特权。`}
        </p>
      </div>
    </div>
  );
  
  // 渲染特权步骤
  const renderBenefitStep = (index: number) => {
    const benefit = vipBenefits[index];
    return (
      <div className="benefit-step">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="benefit-content"
        >
          <div className="benefit-icon text-4xl mb-4">
            {benefit.icon}
          </div>
          
          <h3 className="text-xl font-bold text-gold-700 mb-2">
            {benefit.title}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {benefit.description}
          </p>
        </motion.div>
        
        <div className="step-indicator flex justify-center mb-4">
          {vipBenefits.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full mx-1 ${
                i === index ? 'bg-gold-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };
  
  // 渲染最终步骤
  const renderFinalStep = () => (
    <div className="final-step text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="vip-icon mb-6"
      >
        <span className="text-6xl">🎉</span>
      </motion.div>
      
      <h2 className="text-2xl font-bold text-gold-700 mb-4">
        {content.finalTitle || '开始您的VIP之旅吧！'}
      </h2>
      
      <p className="text-gray-600 mb-6">
        {content.finalDescription || '现在您可以享受所有VIP特权了。试用期结束前，我们会提醒您是否要继续订阅。'}
      </p>
      
      <Button
        variant="gold"
        onClick={handleNavigateToVip}
        className="mb-4"
      >
        {content.exploreVipButton || '探索VIP特权'}
      </Button>
    </div>
  );
  
  // 渲染当前步骤
  const renderCurrentStep = () => {
    if (currentStep === 0) {
      return renderWelcomeStep();
    } else if (currentStep <= vipBenefits.length) {
      return renderBenefitStep(currentStep - 1);
    } else {
      return renderFinalStep();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <LatticeDialog
          isOpen={true}
          onClose={onClose}
          title={content.dialogTitle || 'VIP试用特权'}
          showCloseButton={true}
          size="large"
        >
          <div className="vip-trial-guide p-4">
            {renderCurrentStep()}
            
            <div className="navigation-buttons flex justify-between mt-6">
              {currentStep > 0 && currentStep <= vipBenefits.length && (
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                >
                  {content.previousButton || '上一步'}
                </Button>
              )}
              
              {currentStep <= vipBenefits.length && (
                <Button
                  variant="gold"
                  onClick={handleNext}
                  className={currentStep === 0 ? 'mx-auto' : 'ml-auto'}
                >
                  {content.nextButton || '下一步'}
                </Button>
              )}
              
              {currentStep > vipBenefits.length && (
                <Button
                  variant="jade"
                  onClick={handleFinish}
                  className="mx-auto"
                >
                  {content.finishButton || '开始体验'}
                </Button>
              )}
            </div>
          </div>
        </LatticeDialog>
      )}
    </AnimatePresence>
  );
};

export default VipTrialGuide;
