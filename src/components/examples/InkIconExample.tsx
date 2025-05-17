import React from 'react';
import InkIcon, { InkIconType } from '../common/InkIcon';

/**
 * 水墨风格图标示例组件
 * 展示各种类型和尺寸的水墨风格图标
 */
const InkIconExample: React.FC = () => {
  // 图标类型分组
  const iconGroups = {
    '导航图标': [
      'navigation-home',
      'navigation-tasks',
      'navigation-challenges',
      'navigation-store',
      'navigation-settings',
      'navigation-vip',
      'navigation-battlepass'
    ],
    '操作图标': [
      'action-add',
      'action-delete',
      'action-edit',
      'action-complete',
      'action-refresh',
      'action-search',
      'action-share',
      'action-favorite'
    ],
    '状态图标': [
      'status-success',
      'status-error',
      'status-warning',
      'status-info',
      'status-locked',
      'status-unlocked',
      'status-loading'
    ],
    '资源图标': [
      'resource-experience',
      'resource-coin',
      'resource-bamboo',
      'resource-diamond',
      'resource-item',
      'resource-badge',
      'resource-food'
    ]
  };

  // 图标尺寸
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

  return (
    <div className="ink-icon-example">
      <h1>水墨风格图标示例</h1>

      {/* 图标类型展示 */}
      {Object.entries(iconGroups).map(([groupName, icons]) => (
        <div key={groupName} className="icon-group">
          <h2>{groupName}</h2>
          <div className="icon-grid">
            {icons.map((icon) => {
              // 检查图标是否存在
              const iconExists = true; // 实际应用中可以添加检查逻辑

              return (
                <div key={icon} className="icon-item">
                  {iconExists ? (
                    <>
                      <InkIcon type={icon as InkIconType} size="md" />
                      <div className="icon-name">{icon}</div>
                    </>
                  ) : (
                    <>
                      <div className="icon-placeholder">未实现</div>
                      <div className="icon-name">{icon}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* 图标尺寸展示 */}
      <div className="icon-group">
        <h2>图标尺寸</h2>
        <div className="size-grid">
          {sizes.map((size) => (
            <div key={size} className="size-item">
              <InkIcon type="navigation-home" size={size as any} />
              <div className="size-name">{size}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 图标交互示例 */}
      <div className="icon-group">
        <h2>图标交互</h2>
        <div className="interactive-icons">
          <div className="interactive-icon">
            <InkIcon
              type="action-add"
              size="lg"
              onClick={() => alert('添加按钮被点击')}
              className="clickable-icon"
            />
            <div>可点击图标</div>
          </div>

          <div className="interactive-icon">
            <InkIcon
              type="resource-coin"
              size="lg"
              className="animated-icon"
            />
            <div>动画效果图标</div>
          </div>
        </div>
      </div>

      <style>{`
        .ink-icon-example {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .icon-group {
          margin-bottom: 30px;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 20px;
        }

        .icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .icon-name {
          margin-top: 8px;
          font-size: 12px;
          color: #666;
        }

        .icon-placeholder {
          width: 32px;
          height: 32px;
          background-color: #f0f0f0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #999;
        }

        .size-grid {
          display: flex;
          align-items: flex-end;
          gap: 30px;
        }

        .size-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .size-name {
          margin-top: 8px;
          font-size: 12px;
          color: #666;
        }

        .interactive-icons {
          display: flex;
          gap: 40px;
        }

        .interactive-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .clickable-icon {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .clickable-icon:hover {
          transform: scale(1.1);
        }

        .animated-icon {
          animation: float 2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default InkIconExample;
