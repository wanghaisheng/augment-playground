// src/components/common/TraditionalWindowModalProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import TraditionalWindowModal from './TraditionalWindowModal';

// 弹窗配置接口
interface ModalConfig {
  title: string;
  content: ReactNode;
  footer?: ReactNode;
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
  onClose?: () => void;
}

// 上下文接口
interface TraditionalWindowModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

// 创建上下文
const TraditionalWindowModalContext = createContext<TraditionalWindowModalContextType | undefined>(undefined);

/**
 * 传统窗棂样式弹窗提供者组件
 * 提供一个上下文，允许在应用的任何地方打开弹窗
 *
 * @param children - 子元素
 */
export const TraditionalWindowModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 弹窗状态
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  // 打开弹窗
  const openModal = (config: ModalConfig) => {
    setModalConfig(config);
    setIsOpen(true);
  };

  // 关闭弹窗
  const closeModal = () => {
    setIsOpen(false);
    if (modalConfig?.onClose) {
      modalConfig.onClose();
    }
  };

  return (
    <TraditionalWindowModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalConfig && (
        <TraditionalWindowModal
          isOpen={isOpen}
          onClose={closeModal}
          title={modalConfig.title}
          footer={modalConfig.footer}
          width={modalConfig.width}
          height={modalConfig.height}
          closeButtonText={modalConfig.closeButtonText}
          showCloseButton={modalConfig.showCloseButton}
          closeOnOutsideClick={modalConfig.closeOnOutsideClick}
          closeOnEsc={modalConfig.closeOnEsc}
          className={modalConfig.className}
          overlayClassName={modalConfig.overlayClassName}
          contentClassName={modalConfig.contentClassName}
          ariaLabelledBy={modalConfig.ariaLabelledBy}
          ariaDescribedBy={modalConfig.ariaDescribedBy}
          playSounds={modalConfig.playSounds}
        >
          {modalConfig.content}
        </TraditionalWindowModal>
      )}
    </TraditionalWindowModalContext.Provider>
  );
};

/**
 * 使用传统窗棂样式弹窗上下文的钩子
 * 
 * @returns 弹窗上下文
 * @throws 如果在TraditionalWindowModalProvider外部使用，则抛出错误
 */
export const useTraditionalWindowModal = (): TraditionalWindowModalContextType => {
  const context = useContext(TraditionalWindowModalContext);
  if (!context) {
    throw new Error('useTraditionalWindowModal must be used within a TraditionalWindowModalProvider');
  }
  return context;
};

export default TraditionalWindowModalProvider;
