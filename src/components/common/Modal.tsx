// src/components/common/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useComponentLabels } from '@/hooks/useComponentLabels';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  title?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

/**
 * Basic modal component
 * Provides reusable modal functionality with animation and customizable styles
 *
 * @param isOpen - Controls whether the modal is displayed
 * @param onClose - Callback function to close the modal
 * @param children - Modal content
 * @param closeOnOutsideClick - Whether to close the modal when clicking outside, defaults to true
 * @param closeOnEsc - Whether to close the modal when pressing ESC, defaults to true
 * @param className - Custom class name for the modal container
 * @param overlayClassName - Custom class name for the overlay
 * @param contentClassName - Custom class name for the content area
 * @param title - Optional title for accessibility
 * @param ariaLabelledBy - Optional ID of element that labels the modal
 * @param ariaDescribedBy - Optional ID of element that describes the modal
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
  title,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  // Get localized labels
  const { labels } = useComponentLabels();
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Restore background scrolling
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Handle clicking outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Animation variants
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

  // Use Portal to render the modal to the body
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
          role="dialog"
          aria-modal="true"
          aria-label={title || labels.modal.close}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
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
