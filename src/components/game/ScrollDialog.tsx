// src/components/game/ScrollDialog.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

interface ScrollDialogProps {
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
 * 卷轴风格对话框组件
 * 设计为古代卷轴样式，适合展示重要信息、成就或故事内容
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
const ScrollDialog: React.FC<ScrollDialogProps> = ({
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
    <Button variant="gold" onClick={onClose}>
      关闭
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={closeOnOutsideClick}
      closeOnEsc={closeOnEsc}
      className="scroll-modal"
    >
      <div className="scroll-modal-header">
        <h3 className="scroll-modal-title">{title}</h3>
        {showCloseButton && (
          <motion.button
            className="scroll-modal-close"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="关闭"
          >
            ×
          </motion.button>
        )}
      </div>

      <div className="scroll-modal-content">
        {children}
      </div>

      {(footer || defaultFooter) && (
        <div className="scroll-modal-footer">
          {footer || defaultFooter}
        </div>
      )}
    </Modal>
  );
};

export default ScrollDialog;
