// src/components/common/EnhancedTextArea.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputStyleVariant, InputStatus } from './EnhancedInput';

// 文本区域属性
interface EnhancedTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  helpText?: string;
  errorMessage?: string;
  status?: InputStatus;
  variant?: InputStyleVariant;
  size?: 'small' | 'medium' | 'large';
  floatingLabel?: boolean;
  counter?: boolean;
  maxLength?: number;
  animateLabel?: boolean;
  animateError?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
}

/**
 * 增强的文本区域组件
 * 
 * @param label - 文本区域标签
 * @param helpText - 帮助文本
 * @param errorMessage - 错误信息
 * @param status - 文本区域状态
 * @param variant - 文本区域样式变体
 * @param size - 文本区域大小
 * @param floatingLabel - 是否使用浮动标签
 * @param counter - 是否显示字符计数器
 * @param maxLength - 最大字符数
 * @param animateLabel - 是否动画标签
 * @param animateError - 是否动画错误信息
 * @param autoResize - 是否自动调整高度
 * @param minRows - 最小行数
 * @param maxRows - 最大行数
 */
const EnhancedTextArea: React.FC<EnhancedTextAreaProps> = ({
  label,
  helpText,
  errorMessage,
  status = 'default',
  variant = 'default',
  size = 'medium',
  floatingLabel = false,
  counter = false,
  maxLength,
  animateLabel = true,
  animateError = true,
  autoResize = false,
  minRows = 3,
  maxRows = 10,
  className = '',
  disabled = false,
  value = '',
  onChange,
  ...props
}) => {
  // 状态
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [textValue, setTextValue] = useState<string>(value as string);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // 更新内部值
  useEffect(() => {
    setTextValue(value as string);
  }, [value]);

  // 处理聚焦
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  // 处理失焦
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  // 处理输入
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextValue(newValue);
    if (onChange) {
      onChange(e);
    }
    if (autoResize) {
      adjustHeight();
    }
  };

  // 调整高度
  const adjustHeight = () => {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    // 重置高度以获取正确的scrollHeight
    textArea.style.height = 'auto';
    
    // 计算行高
    const lineHeight = parseInt(getComputedStyle(textArea).lineHeight) || 20;
    
    // 计算最小和最大高度
    const minHeight = minRows * lineHeight;
    const maxHeight = maxRows * lineHeight;
    
    // 设置新高度
    const newHeight = Math.min(Math.max(textArea.scrollHeight, minHeight), maxHeight);
    textArea.style.height = `${newHeight}px`;
  };

  // 初始化自动调整高度
  useEffect(() => {
    if (autoResize && textAreaRef.current) {
      adjustHeight();
    }
  }, [autoResize, textValue]);

  // 获取容器类名
  const getContainerClassName = () => {
    const baseClass = 'enhanced-input-container';
    const variantClass = variant !== 'default' ? `${variant}-style` : '';
    const statusClass = status !== 'default' ? status : '';
    const sizeClass = `size-${size}`;
    const floatingClass = floatingLabel ? 'floating-label' : '';
    const disabledClass = disabled ? 'disabled' : '';
    const focusedClass = isFocused ? 'focused' : '';
    const textareaClass = 'textarea';

    return [
      baseClass,
      variantClass,
      statusClass,
      sizeClass,
      floatingClass,
      disabledClass,
      focusedClass,
      textareaClass,
      className
    ].filter(Boolean).join(' ');
  };

  // 获取文本区域大小样式
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
      {/* 文本区域 */}
      <textarea
        ref={textAreaRef}
        className="enhanced-input"
        value={textValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        style={{
          ...getSizeStyle(),
          resize: autoResize ? 'none' : 'vertical'
        }}
        maxLength={maxLength}
        rows={minRows}
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
              ? isFocused || textValue
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
          {textValue.length} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default EnhancedTextArea;
