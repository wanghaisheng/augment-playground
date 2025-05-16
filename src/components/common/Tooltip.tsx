// src/components/common/Tooltip.tsx
import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  delay = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // If content is empty, don't show tooltip
  if (!content) {
    return <>{children}</>;
  }
  
  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };
  
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };
  
  const updatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return;
    
    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;
    
    switch (placement) {
      case 'top':
        top = childRect.top - tooltipRect.height - 8;
        left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'right':
        top = childRect.top + (childRect.height / 2) - (tooltipRect.height / 2);
        left = childRect.right + 8;
        break;
      case 'bottom':
        top = childRect.bottom + 8;
        left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = childRect.top + (childRect.height / 2) - (tooltipRect.height / 2);
        left = childRect.left - tooltipRect.width - 8;
        break;
    }
    
    // Adjust if tooltip goes out of viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8;
    }
    
    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewportHeight - 8) {
      top = viewportHeight - tooltipRect.height - 8;
    }
    
    setPosition({ top, left });
  };
  
  // Update position when window is resized
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isVisible]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return (
    <>
      <div 
        ref={childRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`tooltip fixed z-50 px-3 py-2 text-sm bg-gray-800 text-white rounded shadow-lg max-w-xs ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
            pointerEvents: 'none'
          }}
        >
          {content}
          <div 
            className={`tooltip-arrow absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
              placement === 'top' ? 'bottom-0 translate-y-1/2' :
              placement === 'right' ? 'left-0 -translate-x-1/2' :
              placement === 'bottom' ? 'top-0 -translate-y-1/2' :
              'right-0 translate-x-1/2'
            }`}
            style={{
              left: placement === 'top' || placement === 'bottom' ? '50%' : undefined,
              top: placement === 'left' || placement === 'right' ? '50%' : undefined
            }}
          />
        </div>
      )}
    </>
  );
};
