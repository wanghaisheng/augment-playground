// src/components/game/LatticeDialog.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

interface LatticeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

/**
 * 窗棂风格对话框组件
 * 设计为中国传统窗棂样式，适合展示操作确认、设置或表单
 * 
 * @param isOpen - 控制对话框是否显示
 * @param onClose - 关闭对话框的回调函数
 * @param title - 对话框标题
 * @param children - 对话框内容
 * @param footer - 对话框底部内容，通常是按钮
 * @param closeOnOutsideClick - 是否在点击外部区域时关闭，默认为true
 * @param closeOnEsc - 是否在按下ESC键时关闭，默认为true
 * @param showCloseButton - 是否显示关闭按钮，默认为true
 */
const LatticeDialog: React.FC<LatticeDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  showCloseButton = true,
}) => {
  // 默认底部内容
  const defaultFooter = (
    <Button variant="jade" onClick={onClose}>
      确认
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={closeOnOutsideClick}
      closeOnEsc={closeOnEsc}
      className="lattice-modal"
    >
      <div className="lattice-modal-header">
        <h3 className="lattice-modal-title">{title}</h3>
        {showCloseButton && (
          <motion.button
            className="lattice-modal-close"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="关闭"
          >
            ×
          </motion.button>
        )}
      </div>

      <div className="lattice-modal-content">
        {children}
      </div>

      {(footer || defaultFooter) && (
        <div className="lattice-modal-footer">
          {footer || defaultFooter}
        </div>
      )}
    </Modal>
  );
};

export default LatticeDialog;
