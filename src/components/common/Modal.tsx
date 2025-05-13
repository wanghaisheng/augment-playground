// src/components/common/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

/**
 * 基础模态框组件
 * 提供可重用的模态框功能，支持动画和自定义样式
 * 
 * @param isOpen - 控制模态框是否显示
 * @param onClose - 关闭模态框的回调函数
 * @param children - 模态框内容
 * @param closeOnOutsideClick - 是否在点击外部区域时关闭模态框，默认为true
 * @param closeOnEsc - 是否在按下ESC键时关闭模态框，默认为true
 * @param className - 自定义模态框容器类名
 * @param overlayClassName - 自定义遮罩层类名
 * @param contentClassName - 自定义内容区域类名
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // 处理ESC键关闭
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // 恢复背景滚动
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, closeOnEsc]);

  // 处理点击外部区域关闭
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // 动画变体
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300,
        delay: 0.1
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10, 
      transition: { 
        duration: 0.2 
      } 
    }
  };

  // 使用Portal将模态框渲染到body下
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`modal-overlay ${overlayClassName}`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={contentRef}
            className={`modal-content ${contentClassName}`}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`modal-container ${className}`}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
