// src/components/vip/VipValueModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VipValueDashboard from './VipValueDashboard';
import LatticeDialog from '@/components/game/LatticeDialog';
import { playSound, SoundType } from '@/utils/sound';
import { useLocalizedView } from '@/hooks/useLocalizedView';

interface VipValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  isVip: boolean;
  onSubscribe?: () => void;
}

/**
 * VIP价值模态框组件
 * 
 * 在模态框中展示VIP价值仪表盘
 */
const VipValueModal: React.FC<VipValueModalProps> = ({
  isOpen,
  onClose,
  userId,
  isVip,
  onSubscribe
}) => {
  const { content } = useLocalizedView('vipValue');
  
  // 处理关闭
  const handleClose = () => {
    playSound(SoundType.BUTTON_CLICK);
    onClose();
  };
  
  // 处理订阅
  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe();
    }
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <LatticeDialog
          isOpen={true}
          onClose={handleClose}
          title={content.modalTitle || 'VIP会员价值分析'}
          showCloseButton={true}
          size="large"
        >
          <div className="vip-value-modal p-4">
            <VipValueDashboard
              userId={userId}
              isVip={isVip}
              onSubscribe={handleSubscribe}
            />
          </div>
        </LatticeDialog>
      )}
    </AnimatePresence>
  );
};

export default VipValueModal;
