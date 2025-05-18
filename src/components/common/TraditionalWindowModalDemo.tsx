// src/components/common/TraditionalWindowModalDemo.tsx
import React, { useState } from 'react';
import TraditionalWindowModal from './TraditionalWindowModal';
import Button from './Button';
import { useTraditionalWindowModal } from '@/hooks/useTraditionalWindowModal';

/**
 * 传统窗棂样式弹窗演示组件
 * 用于展示传统窗棂样式弹窗的使用方法
 */
const TraditionalWindowModalDemo: React.FC = () => {
  // 直接使用弹窗
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // 使用上下文弹窗
  const { openModal, closeModal } = useTraditionalWindowModal();

  // 打开直接弹窗
  const openDirectModal = () => {
    setIsDirectModalOpen(true);
  };

  // 关闭直接弹窗
  const closeDirectModal = () => {
    setIsDirectModalOpen(false);
  };

  // 打开表单弹窗
  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  // 关闭表单弹窗
  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  // 打开确认弹窗
  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  // 关闭确认弹窗
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  // 确认操作
  const handleConfirm = () => {
    alert('操作已确认！');
    closeConfirmModal();
  };

  // 打开上下文弹窗
  const openContextModal = () => {
    openModal({
      title: '上下文弹窗',
      content: (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p>这是通过上下文打开的弹窗</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            使用上下文可以在应用的任何地方打开弹窗，而不需要在组件中维护状态
          </p>
        </div>
      ),
      footer: (
        <Button variant="jade" onClick={closeModal}>
          关闭
        </Button>
      ),
      width: 500,
      height: 'auto',
    });
  };

  // 确认对话框的底部按钮
  const confirmModalFooter = (
    <>
      <Button variant="secondary" onClick={closeConfirmModal}>
        取消
      </Button>
      <Button variant="jade" onClick={handleConfirm}>
        确认
      </Button>
    </>
  );

  return (
    <div className="traditional-window-modal-demo">
      <h2>传统窗棂样式弹窗演示</h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <Button variant="jade" onClick={openDirectModal}>
          打开基本弹窗
        </Button>

        <Button variant="gold" onClick={openFormModal}>
          打开表单弹窗
        </Button>

        <Button variant="filled" onClick={openConfirmModal}>
          打开确认弹窗
        </Button>

        <Button variant="outlined" onClick={openContextModal}>
          打开上下文弹窗
        </Button>
      </div>

      {/* 基本弹窗 */}
      <TraditionalWindowModal
        isOpen={isDirectModalOpen}
        onClose={closeDirectModal}
        title="熊猫传说"
        width={600}
      >
        <div style={{ padding: '0 16px' }}>
          <p>
            很久很久以前，在一个被竹林环绕的山谷里，生活着一群神奇的熊猫。它们不仅会说人类的语言，还掌握着古老的智慧。
          </p>
          <p>
            传说中，这些熊猫是天上的星辰化身，它们来到人间是为了指引人们找到内心的平静与坚持。每当有人迷失方向或放弃自己的目标时，熊猫就会出现，用它们的智慧和耐心帮助人们重新找回前进的道路。
          </p>
          <p>
            这些熊猫会教导人们如何像竹子一样坚韧不拔，在风雨中依然挺立；如何像流水一样灵活应变，绕过生活中的障碍；如何像山石一样沉稳坚定，不被外界的喧嚣所动摇。
          </p>
          <p>
            据说，只要你真心相信并坚持不懈地追求自己的目标，熊猫的智慧就会在你的心中显现，指引你走向成功和幸福。
          </p>
        </div>
      </TraditionalWindowModal>

      {/* 表单弹窗 */}
      <TraditionalWindowModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title="熊猫伙伴设置"
        width={500}
      >
        <div>
          <div className="form-group">
            <label htmlFor="panda-name">熊猫名称</label>
            <input
              id="panda-name"
              type="text"
              placeholder="给你的熊猫伙伴起个名字"
              defaultValue="竹竹"
              className="input-styled"
            />
          </div>

          <div className="form-group">
            <label htmlFor="panda-color">熊猫颜色主题</label>
            <select id="panda-color" defaultValue="classic" className="select-styled">
              <option value="classic">经典黑白</option>
              <option value="golden">金色传说</option>
              <option value="jade">翡翠绿</option>
              <option value="blue">青花蓝</option>
            </select>
          </div>

          <div className="form-group">
            <label>熊猫外观装饰</label>
            <div className="option-grid">
              <div className="option-item">
                <input type="radio" name="decoration" id="dec-none" defaultChecked />
                <label htmlFor="dec-none">无装饰</label>
              </div>
              <div className="option-item">
                <input type="radio" name="decoration" id="dec-hat" />
                <label htmlFor="dec-hat">竹编帽子</label>
              </div>
              <div className="option-item">
                <input type="radio" name="decoration" id="dec-scarf" />
                <label htmlFor="dec-scarf">丝绸围巾</label>
              </div>
              <div className="option-item">
                <input type="radio" name="decoration" id="dec-glasses" />
                <label htmlFor="dec-glasses">竹框眼镜</label>
              </div>
            </div>
          </div>
        </div>
      </TraditionalWindowModal>

      {/* 确认弹窗 */}
      <TraditionalWindowModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        title="操作确认"
        footer={confirmModalFooter}
        width={400}
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p>您确定要执行此操作吗？</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            此操作无法撤销，请谨慎确认。
          </p>
        </div>
      </TraditionalWindowModal>
    </div>
  );
};

export default TraditionalWindowModalDemo;
