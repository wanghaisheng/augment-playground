// src/components/decoration/ChineseDecoration.tsx
import React from 'react';

/**
 * 中国风装饰组件
 * 添加各种中国风装饰元素到应用程序中
 */
const ChineseDecoration: React.FC = () => {
  return (
    <>
      {/* 云朵装饰 */}
      <div className="chinese-cloud top-right" />
      <div className="chinese-cloud top-left" />
      
      {/* 中国结装饰 */}
      <div className="chinese-knot top-right" />
      
      {/* 荷花装饰 */}
      <div className="lotus-flower bottom-left" />
      
      {/* 山水画装饰 */}
      <div className="mountain-landscape bottom" />
    </>
  );
};

export default ChineseDecoration;
