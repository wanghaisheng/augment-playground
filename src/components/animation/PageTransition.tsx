/**
 * @deprecated 此组件已废弃，请使用 EnhancedPageTransition 组件代替。
 * 此组件将在下一个主要版本中移除。
 *
 * EnhancedPageTransition 提供了以下优势：
 * 1. 支持多种中国风页面转场效果（水墨扩散、卷轴展开、竹帘下降等）
 * 2. 支持自动根据路径选择变体
 * 3. 支持装饰元素，如飘落的竹叶、水墨滴落、卷轴装饰等
 * 4. 提供更多自定义选项，如装饰元素颜色、透明度等
 */

import React, { ReactNode } from 'react';
import { Variants, HTMLMotionProps } from 'framer-motion';
import EnhancedPageTransition, { PageTransitionType } from './EnhancedPageTransition';

interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  className?: string;
}

/**
 * 页面过渡组件，用于为页面添加进入和退出动画
 *
 * @deprecated 此组件已废弃，请使用 EnhancedPageTransition 组件代替。
 *
 * @param children - 子元素
 * @param variants - 动画变体
 * @param className - CSS类名
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variants,
  className = '',
  ...props
}) => {
  // 使用 EnhancedPageTransition 实现
  return (
    <EnhancedPageTransition
      type="basic" // 使用基础转场类型，保持与原 PageTransition 一致
      className={className}
      showDecorations={false} // 默认不显示装饰元素，保持与原 PageTransition 一致
      {...props}
    >
      {children}
    </EnhancedPageTransition>
  );
};

export default PageTransition;
