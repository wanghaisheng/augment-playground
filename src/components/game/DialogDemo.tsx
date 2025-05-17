// src/components/game/DialogDemo.tsx
import React, { useState } from 'react';
import ScrollDialog from './ScrollDialog';
import LatticeDialog from './LatticeDialog';
import Button from '@/components/common/Button';

/**
 * 对话框演示组件
 * 用于展示不同风格的对话框组件
 */
const DialogDemo: React.FC = () => {
  const [isScrollDialogOpen, setIsScrollDialogOpen] = useState(false);
  const [isLatticeDialogOpen, setIsLatticeDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // 打开卷轴对话框
  const openScrollDialog = () => {
    setIsScrollDialogOpen(true);
  };

  // 关闭卷轴对话框
  const closeScrollDialog = () => {
    setIsScrollDialogOpen(false);
  };

  // 打开窗棂对话框
  const openLatticeDialog = () => {
    setIsLatticeDialogOpen(true);
  };

  // 关闭窗棂对话框
  const closeLatticeDialog = () => {
    setIsLatticeDialogOpen(false);
  };

  // 打开确认对话框
  const openConfirmDialog = () => {
    setIsConfirmDialogOpen(true);
  };

  // 关闭确认对话框
  const closeConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
  };

  // 确认操作
  const handleConfirm = () => {
    alert('操作已确认！');
    closeConfirmDialog();
  };

  // 确认对话框的底部按钮
  const confirmDialogFooter = (
    <>
      <Button variant="secondary" onClick={closeConfirmDialog}>
        取消
      </Button>
      <Button variant="jade" onClick={handleConfirm}>
        确认
      </Button>
    </>
  );

  return (
    <div className="dialog-demo">
      <h2>对话框演示</h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <Button variant="jade" onClick={openScrollDialog}>
          打开卷轴对话框
        </Button>

        <Button variant="gold" onClick={openLatticeDialog}>
          打开窗棂对话框
        </Button>

        <Button variant="filled" onClick={openConfirmDialog}>
          打开确认对话框
        </Button>
      </div>

      {/* 卷轴风格对话框 */}
      <ScrollDialog
        isOpen={isScrollDialogOpen}
        onClose={closeScrollDialog}
        title="熊猫传说"
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
      </ScrollDialog>

      {/* 窗棂风格对话框 */}
      <LatticeDialog
        isOpen={isLatticeDialogOpen}
        onClose={closeLatticeDialog}
        title="熊猫伙伴设置"
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
            <label>熊猫互动提醒</label>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <label className="checkbox-styled">
                <input type="checkbox" defaultChecked />
                <span>喂食提醒</span>
              </label>
              <label className="checkbox-styled">
                <input type="checkbox" defaultChecked />
                <span>玩耍提醒</span>
              </label>
              <label className="checkbox-styled">
                <input type="checkbox" defaultChecked />
                <span>训练提醒</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="panda-personality">熊猫性格特点</label>
            <textarea
              id="panda-personality"
              className="textarea-styled"
              placeholder="描述你的熊猫伙伴的性格特点..."
              defaultValue="活泼好动，喜欢竹子，爱睡觉"
              rows={3}
            />
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
      </LatticeDialog>

      {/* 确认对话框 */}
      <LatticeDialog
        isOpen={isConfirmDialogOpen}
        onClose={closeConfirmDialog}
        title="操作确认"
        footer={confirmDialogFooter}
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p>您确定要执行此操作吗？</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            此操作无法撤销，请谨慎确认。
          </p>
        </div>
      </LatticeDialog>
    </div>
  );
};

export default DialogDemo;
