// src/components/layout/Header.tsx
import React from 'react';
import type { GlobalLayoutLabelsBundle } from '@/types';

interface HeaderProps {
  labels: GlobalLayoutLabelsBundle | undefined;
  isFetching?: boolean;
}

const Header: React.FC<HeaderProps> = ({ labels, isFetching }) => {
  return (
    <header style={{
      opacity: isFetching ? 0.7 : 1,
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0'
    }}>
      {/* 移动应用通常不需要显示应用标题 */}
      {isFetching && labels &&
        <small style={{ fontStyle: 'italic', color: '#555' }}>(syncing...)</small>
      }
    </header>
  );
};
export default Header;