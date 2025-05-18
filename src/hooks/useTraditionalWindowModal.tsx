// src/hooks/useTraditionalWindowModal.tsx
import { useTraditionalWindowModal as useContextModal } from '@/components/common/TraditionalWindowModalProvider';

/**
 * 使用传统窗棂样式弹窗的钩子
 * 这是一个便捷的导出，直接从TraditionalWindowModalProvider中导出useTraditionalWindowModal
 * 
 * @returns 弹窗上下文，包含openModal和closeModal方法
 */
const useTraditionalWindowModal = useContextModal;

export default useTraditionalWindowModal;
