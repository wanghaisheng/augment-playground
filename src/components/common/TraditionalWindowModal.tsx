// src/components/common/TraditionalWindowModal.tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';

interface TraditionalWindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  closeButtonText?: string;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  playSounds?: boolean;
}

/**
 * 传统窗棂样式弹窗组件
 * 设计为中国传统窗棂样式，适合展示操作确认、设置或表单
 *
 * @param isOpen - 控制弹窗是否显示
 * @param onClose - 关闭弹窗的回调函数
 * @param title - 弹窗标题
 * @param children - 弹窗内容
 * @param footer - 弹窗底部内容，通常是按钮
 * @param width - 弹窗宽度，可以是数字或CSS字符串
 * @param height - 弹窗高度，可以是数字或CSS字符串
 * @param closeButtonText - 关闭按钮文本
 * @param showCloseButton - 是否显示关闭按钮，默认为true
 * @param closeOnOutsideClick - 是否在点击外部区域时关闭，默认为true
 * @param closeOnEsc - 是否在按下ESC键时关闭，默认为true
 * @param className - 自定义类名
 * @param overlayClassName - 遮罩层自定义类名
 * @param contentClassName - 内容区域自定义类名
 * @param ariaLabelledBy - 可访问性：弹窗标签元素ID
 * @param ariaDescribedBy - 可访问性：弹窗描述元素ID
 * @param playSounds - 是否播放音效，默认为true
 */
const TraditionalWindowModal: React.FC<TraditionalWindowModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = 500,
  height = 'auto',
  closeButtonText,
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  ariaLabelledBy,
  ariaDescribedBy,
  playSounds = true,
}) => {
  // 获取本地化标签
  const { labels } = useComponentLabels();
  const contentRef = useRef<HTMLDivElement>(null);

  // 处理ESC键关闭
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && closeOnEsc) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEsc]);

  // 处理打开/关闭音效
  useEffect(() => {
    if (isOpen && playSounds) {
      playSound(SoundType.MODAL_OPEN);
    }
    return () => {
      if (isOpen && playSounds) {
        playSound(SoundType.MODAL_CLOSE);
      }
    };
  }, [isOpen, playSounds]);

  // 处理点击遮罩层关闭
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // 动画变体
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
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
      scale: 0.9, 
      y: -20, 
      transition: { 
        duration: 0.2 
      } 
    },
  };

  // 默认底部内容
  const defaultFooter = showCloseButton ? (
    <Button 
      variant="jade" 
      onClick={onClose}
    >
      {closeButtonText || labels?.modal?.close || '关闭'}
    </Button>
  ) : null;

  // 使用Portal将弹窗渲染到body
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`traditional-window-modal-overlay ${overlayClassName}`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          <motion.div
            ref={contentRef}
            className={`traditional-window-modal ${className}`}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: typeof width === 'number' ? `${width}px` : width,
              height: typeof height === 'number' ? `${height}px` : height,
            }}
          >
            {/* 角落装饰 */}
            <div className="traditional-window-corner traditional-window-corner-tl" aria-hidden="true" />
            <div className="traditional-window-corner traditional-window-corner-tr" aria-hidden="true" />
            <div className="traditional-window-corner traditional-window-corner-bl" aria-hidden="true" />
            <div className="traditional-window-corner traditional-window-corner-br" aria-hidden="true" />

            {/* 标题栏 */}
            <div className="traditional-window-header">
              <h3 className="traditional-window-title">{title}</h3>
              {showCloseButton && (
                <button
                  className="traditional-window-close"
                  onClick={onClose}
                  aria-label={labels?.modal?.close || "关闭"}
                >
                  ×
                </button>
              )}
            </div>

            {/* 内容区域 */}
            <div className={`traditional-window-content ${contentClassName}`}>
              {children}
            </div>

            {/* 底部区域 */}
            {(footer || defaultFooter) && (
              <div className="traditional-window-footer">
                {footer || defaultFooter}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default TraditionalWindowModal;
