// src/components/demo/SkeletonDemo.tsx
import React, { useState } from 'react';
import { useSkeletonLoader } from '@/hooks/useSkeletonLoader';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import {
  SkeletonText,
  SkeletonImage,
  SkeletonButton,
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonStatCard,
  SkeletonDetailPage
} from '@/components/skeleton/SkeletonSystem';

interface SkeletonDemoProps {
  className?: string;
}

/**
 * 骨架屏演示组件
 * 
 * 展示各种骨架屏组件和加载效果
 */
const SkeletonDemo: React.FC<SkeletonDemoProps> = ({
  className = ''
}) => {
  // 骨架屏加载器
  const { 
    isLoading, 
    setIsLoading, 
    withSkeleton 
  } = useSkeletonLoader({
    variant: 'jade',
    minDuration: 1000
  });
  
  // 当前演示的骨架屏组件
  const [demoComponent, setDemoComponent] = useState<string>('card');
  
  // 模拟加载数据
  const loadData = async () => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };
  
  // 处理加载演示
  const handleLoadDemo = async () => {
    playSound(SoundType.BUTTON_CLICK);
    await withSkeleton(loadData);
  };
  
  // 处理切换演示组件
  const handleChangeDemoComponent = (component: string) => {
    playSound(SoundType.BUTTON_CLICK);
    setDemoComponent(component);
  };
  
  // 渲染当前演示的骨架屏组件
  const renderDemoComponent = () => {
    switch (demoComponent) {
      case 'text':
        return (
          <div className="demo-component">
            <h3 className="text-lg font-medium mb-4">文本骨架屏</h3>
            <SkeletonText lines={3} variant="jade" />
          </div>
        );
      case 'image':
        return (
          <div className="demo-component">
            <h3 className="text-lg font-medium mb-4">图像骨架屏</h3>
            <SkeletonImage width="100%" height={200} variant="jade" />
          </div>
        );
      case 'button':
        return (
          <div className="demo-component">
            <h3 className="text-lg font-medium mb-4">按钮骨架屏</h3>
            <div className="flex space-x-4">
              <SkeletonButton width={100} height={40} variant="jade" />
              <SkeletonButton width={150} height={40} variant="gold" rounded={false} />
            </div>
          </div>
        );
      case 'card':
        return (
          <div className="demo-component">
            <h3 className="text-lg font-medium mb-4">卡片骨架屏</h3>
            <SkeletonCard variant="jade" />
          </div>
        );
      case 'list':
        return (
          <div className="demo-component">
            <h3 className="text-lg font-medium mb-4">列表骨架屏</h3>
            <SkeletonList count={3} variant="jade" />
          </div>
        );
      case 'grid':
        return (
          <div className="demo-component">
            <h3 className="text-lg font-medium mb-4">网格骨架屏</h3>
            <SkeletonList count={4} layout="grid" columns={2} variant="jade" />
          </div>
        );
      case 'table':
        return (
          <div className="demo-component">
            <h3 className="text-lg font-medium mb-4">表格骨架屏</h3>
            <SkeletonTable rows={3} columns={3} variant="jade" />
          </div>
        );
      case 'stat':
        return (
          <div className="demo-component">
            <h3 className="text-lg font-medium mb-4">统计卡片骨架屏</h3>
            <div className="grid grid-cols-2 gap-4">
              <SkeletonStatCard variant="jade" />
              <SkeletonStatCard variant="gold" />
            </div>
          </div>
        );
      case 'detail':
        return (
          <div className="demo-component">
            <h3 className="text-lg font-medium mb-4">详情页骨架屏</h3>
            <SkeletonDetailPage variant="jade" />
          </div>
        );
      default:
        return (
          <div className="demo-component">
            <h3 className="text-lg font-medium mb-4">卡片骨架屏</h3>
            <SkeletonCard variant="jade" />
          </div>
        );
    }
  };
  
  return (
    <div className={`skeleton-demo ${className}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">骨架屏演示</h2>
      
      {/* 演示控制 */}
      <div className="demo-controls mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={demoComponent === 'text' ? 'jade' : 'secondary'}
            size="small"
            onClick={() => handleChangeDemoComponent('text')}
          >
            文本
          </Button>
          <Button
            variant={demoComponent === 'image' ? 'jade' : 'secondary'}
            size="small"
            onClick={() => handleChangeDemoComponent('image')}
          >
            图像
          </Button>
          <Button
            variant={demoComponent === 'button' ? 'jade' : 'secondary'}
            size="small"
            onClick={() => handleChangeDemoComponent('button')}
          >
            按钮
          </Button>
          <Button
            variant={demoComponent === 'card' ? 'jade' : 'secondary'}
            size="small"
            onClick={() => handleChangeDemoComponent('card')}
          >
            卡片
          </Button>
          <Button
            variant={demoComponent === 'list' ? 'jade' : 'secondary'}
            size="small"
            onClick={() => handleChangeDemoComponent('list')}
          >
            列表
          </Button>
          <Button
            variant={demoComponent === 'grid' ? 'jade' : 'secondary'}
            size="small"
            onClick={() => handleChangeDemoComponent('grid')}
          >
            网格
          </Button>
          <Button
            variant={demoComponent === 'table' ? 'jade' : 'secondary'}
            size="small"
            onClick={() => handleChangeDemoComponent('table')}
          >
            表格
          </Button>
          <Button
            variant={demoComponent === 'stat' ? 'jade' : 'secondary'}
            size="small"
            onClick={() => handleChangeDemoComponent('stat')}
          >
            统计
          </Button>
          <Button
            variant={demoComponent === 'detail' ? 'jade' : 'secondary'}
            size="small"
            onClick={() => handleChangeDemoComponent('detail')}
          >
            详情页
          </Button>
        </div>
        
        <Button
          variant="jade"
          onClick={handleLoadDemo}
          disabled={isLoading}
        >
          {isLoading ? '加载中...' : '模拟加载 (2秒)'}
        </Button>
      </div>
      
      {/* 演示内容 */}
      <div className="demo-content bg-gray-50 p-4 rounded-lg">
        {renderDemoComponent()}
      </div>
      
      {/* 说明 */}
      <div className="explanation mt-6 bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium text-gray-700 mb-2">使用说明</h4>
        <p className="mb-2">
          骨架屏系统提供了多种骨架屏组件，可以根据不同的场景选择合适的组件。
        </p>
        <p>
          点击"模拟加载"按钮可以看到骨架屏的加载效果，加载完成后会自动隐藏骨架屏。
        </p>
      </div>
    </div>
  );
};

export default SkeletonDemo;
