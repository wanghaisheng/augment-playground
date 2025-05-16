// src/components/common/EnhancedInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 输入框样式变体
export type InputStyleVariant = 'default' | 'chinese' | 'bamboo' | 'ink';

// 输入框状态
export type InputStatus = 'default' | 'error' | 'success';

// 输入框属性
interface EnhancedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helpText?: string;
  errorMessage?: string;
  status?: InputStatus;
  variant?: InputStyleVariant;
  size?: 'small' | 'medium' | 'large';
  floatingLabel?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  clearable?: boolean;
  counter?: boolean;
  maxLength?: number;
  animateLabel?: boolean;
  animateError?: boolean;
  onClear?: () => void;
}

/**
 * 增强的输入框组件
 * 
 * @param label - 输入框标签
 * @param helpText - 帮助文本
 * @param errorMessage - 错误信息
 * @param status - 输入框状态
 * @param variant - 输入框样式变体
 * @param size - 输入框大小
 * @param floatingLabel - 是否使用浮动标签
 * @param iconLeft - 左侧图标
 * @param iconRight - 右侧图标
 * @param clearable - 是否可清除
 * @param counter - 是否显示字符计数器
 * @param maxLength - 最大字符数
 * @param animateLabel - 是否动画标签
 * @param animateError - 是否动画错误信息
 * @param onClear - 清除回调
 */
const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  helpText,
  errorMessage,
  status = 'default',
  variant = 'default',
  size = 'medium',
  floatingLabel = false,
  iconLeft,
  iconRight,
  clearable = false,
  counter = false,
  maxLength,
  animateLabel = true,
  animateError = true,
  onClear,
  className = '',
  disabled = false,
  value = '',
  onChange,
  ...props
}) => {
  // 状态
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(value as string);
  const inputRef = useRef<HTMLInputElement>(null);

  // 更新内部值
  useEffect(() => {
    setInputValue(value as string);
  }, [value]);

  // 处理聚焦
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  // 处理失焦
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  // 处理输入
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(e);
    }
  };

  // 处理清除
  const handleClear = () => {
    setInputValue('');
    if (onClear) {
      onClear();
    }
    if (onChange) {
      const event = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    // 聚焦输入框
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 获取容器类名
  const getContainerClassName = () => {
    const baseClass = 'enhanced-input-container';
    const variantClass = variant !== 'default' ? `${variant}-style` : '';
    const statusClass = status !== 'default' ? status : '';
    const sizeClass = `size-${size}`;
    const floatingClass = floatingLabel ? 'floating-label' : '';
    const iconLeftClass = iconLeft ? 'with-icon-left' : '';
    const iconRightClass = iconRight ? 'with-icon-right' : '';
    const clearableClass = clearable && inputValue ? 'with-clear-button' : '';
    const disabledClass = disabled ? 'disabled' : '';
    const focusedClass = isFocused ? 'focused' : '';

    return [
      baseClass,
      variantClass,
      statusClass,
      sizeClass,
      floatingClass,
      iconLeftClass,
      iconRightClass,
      clearableClass,
      disabledClass,
      focusedClass,
      className
    ].filter(Boolean).join(' ');
  };

  // 获取输入框大小样式
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { fontSize: '0.875rem', padding: '0.5rem 0.75rem' };
      case 'large':
        return { fontSize: '1.125rem', padding: '0.875rem 1.25rem' };
      case 'medium':
      default:
        return {};
    }
  };

  // 标签动画变体
  const labelVariants = {
    default: { y: 0, scale: 1, color: disabled ? 'var(--text-color-light)' : 'var(--text-color)' },
    focused: { y: 0, scale: 1, color: status === 'error' ? 'var(--cinnabar-red)' : 'var(--primary-green)' },
    floating: { y: -20, scale: 0.85, color: status === 'error' ? 'var(--cinnabar-red)' : 'var(--primary-green)' }
  };

  // 错误信息动画变体
  const errorVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto' }
  };

  return (
    <div className={getContainerClassName()}>
      {/* 左侧图标 */}
      {iconLeft && (
        <div className="enhanced-input-icon enhanced-input-icon-left">
          {iconLeft}
        </div>
      )}

      {/* 输入框 */}
      <input
        ref={inputRef}
        className="enhanced-input"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        style={getSizeStyle()}
        maxLength={maxLength}
        {...props}
      />

      {/* 标签 */}
      {label && (
        <motion.label
          className="enhanced-input-label"
          htmlFor={props.id}
          variants={animateLabel ? labelVariants : undefined}
          initial="default"
          animate={
            floatingLabel
              ? isFocused || inputValue
                ? 'floating'
                : 'default'
              : isFocused
              ? 'focused'
              : 'default'
          }
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}

      {/* 右侧图标 */}
      {iconRight && (
        <div className="enhanced-input-icon enhanced-input-icon-right">
          {iconRight}
        </div>
      )}

      {/* 清除按钮 */}
      {clearable && inputValue && !disabled && (
        <button
          type="button"
          className="enhanced-input-clear-button"
          onClick={handleClear}
          aria-label="清除输入"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* 帮助文本 */}
      {helpText && !errorMessage && (
        <div className="enhanced-input-help-text">
          {helpText}
        </div>
      )}

      {/* 错误信息 */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            className="enhanced-input-error-message"
            variants={animateError ? errorVariants : undefined}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 字符计数器 */}
      {counter && maxLength && (
        <div className="enhanced-input-counter">
          {inputValue.length} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default EnhancedInput;
