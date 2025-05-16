// src/components/layout/Header.tsx
import React from 'react';
import type { GlobalLayoutLabelsBundle } from '@/types';
import NotificationButton from '@/components/notification/NotificationButton';
import BambooCounter from '@/components/bamboo/BambooCounter';

interface HeaderProps {
  labels: GlobalLayoutLabelsBundle | undefined;
  isFetching?: boolean;
}

const Header: React.FC<HeaderProps> = ({ labels, isFetching }) => {
  return (
    <header className="flex justify-between items-center px-4 py-2">
      <div className="flex-1">
        {/* 左侧空间 */}
      </div>

      <div className="flex-1 text-center">
        {/* 移动应用通常不需要显示应用标题 */}
        {isFetching && labels &&
          <small style={{ fontStyle: 'italic', color: '#555' }}>(syncing...)</small>
        }
      </div>

      <div className="flex-1 flex justify-end items-center gap-3">
        {/* 竹子计数器 */}
        <BambooCounter size="small" />

        {/* 通知按钮 */}
        <NotificationButton iconOnly={true} />
      </div>
    </header>
  );
};
export default Header;