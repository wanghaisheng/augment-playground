// src/components/vip/VipValueModal.tsx
import React, { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import VipValueDashboard from './VipValueDashboard';
import LatticeDialog from '@/components/game/LatticeDialog';
import { playSound, SoundType } from '@/utils/sound';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchVipValueView } from '@/services/localizedContentService';
import { Language } from '@/types';

interface VipValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  isVip: boolean;
  onSubscribe?: () => void;
  labels?: any;
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
  // Function to fetch localized content for VIP value
  const fetchVipValueViewFn = useCallback(async (lang: Language) => {
    try {
      return await fetchVipValueView(lang);
    } catch (error) {
      console.error('Error fetching VIP value view:', error);
      throw error;
    }
  }, []);

  // Fetch localized content for the VIP value
  const { data: viewData } = useLocalizedView<null, { labels: { [key: string]: string } }>('vipValue', fetchVipValueViewFn);

  // Get content from viewData or use provided labels
  const content = viewData?.labels || labels || {} as { [key: string]: string };

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
          // size prop is not supported by LatticeDialog
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
