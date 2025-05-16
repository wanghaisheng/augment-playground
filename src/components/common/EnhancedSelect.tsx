// src/components/common/EnhancedSelect.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputStyleVariant, InputStatus } from './EnhancedInput';

// 选项类型
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// 选择框属性
interface EnhancedSelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  label?: string;
  helpText?: string;
  errorMessage?: string;
  status?: InputStatus;
  variant?: InputStyleVariant;
  size?: 'small' | 'medium' | 'large';
  floatingLabel?: boolean;
  iconLeft?: React.ReactNode;
  animateLabel?: boolean;
  animateError?: boolean;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

/**
 * 增强的选择框组件
 * 
 * @param options - 选项数组
 * @param value - 当前值
 * @param onChange - 值变化回调
 * @param label - 选择框标签
 * @param helpText - 帮助文本
 * @param errorMessage - 错误信息
 * @param status - 选择框状态
 * @param variant - 选择框样式变体
 * @param size - 选择框大小
 * @param floatingLabel - 是否使用浮动标签
 * @param iconLeft - 左侧图标
 * @param animateLabel - 是否动画标签
 * @param animateError - 是否动画错误信息
 * @param placeholder - 占位符
 * @param disabled - 是否禁用
 * @param required - 是否必填
 * @param className - 自定义类名
 * @param id - 元素ID
 * @param name - 元素名称
 */
const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  options,
  value,
  onChange,
  label,
  helpText,
  errorMessage,
  status = 'default',
  variant = 'default',
  size = 'medium',
  floatingLabel = false,
  iconLeft,
  animateLabel = true,
  animateError = true,
  placeholder = '请选择',
  disabled = false,
  required = false,
  className = '',
  id,
  name
}) => {
  // 状态
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(value);
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const selectRef = useRef<HTMLDivElement>(null);

  // 更新选中值和标签
  useEffect(() => {
    setSelectedValue(value);
    const option = options.find(opt => opt.value === value);
    setSelectedLabel(option ? option.label : '');
  }, [value, options]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理选择框点击
  const handleSelectClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(true);
    }
  };

  // 处理选项点击
  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    
    setSelectedValue(option.value);
    setSelectedLabel(option.label);
    setIsOpen(false);
    
    if (onChange) {
      onChange(option.value);
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
    const disabledClass = disabled ? 'disabled' : '';
    const focusedClass = isFocused ? 'focused' : '';
    const selectClass = 'select';

    return [
      baseClass,
      variantClass,
      statusClass,
      sizeClass,
      floatingClass,
      iconLeftClass,
      disabledClass,
      focusedClass,
      selectClass,
      className
    ].filter(Boolean).join(' ');
  };

  // 获取选择框大小样式
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

  // 下拉框动画变体
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto' }
  };

  return (
    <div className={getContainerClassName()} ref={selectRef}>
      {/* 左侧图标 */}
      {iconLeft && (
        <div className="enhanced-input-icon enhanced-input-icon-left">
          {iconLeft}
        </div>
      )}

      {/* 选择框 */}
      <div
        className="enhanced-input select-input"
        onClick={handleSelectClick}
        style={{
          ...getSizeStyle(),
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-disabled={disabled}
        aria-required={required}
      >
        <div className="select-value">
          {selectedLabel || (
            <span style={{ color: 'var(--text-color-light)' }}>
              {placeholder}
            </span>
          )}
        </div>
        <div className="select-arrow">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* 标签 */}
      {label && (
        <motion.label
          id={id ? `${id}-label` : undefined}
          className="enhanced-input-label"
          variants={animateLabel ? labelVariants : undefined}
          initial="default"
          animate={
            floatingLabel
              ? isFocused || selectedValue
                ? 'floating'
                : 'default'
              : isFocused
              ? 'focused'
              : 'default'
          }
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span style={{ color: 'var(--cinnabar-red)' }}> *</span>}
        </motion.label>
      )}

      {/* 下拉选项 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="select-dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: 'white',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginTop: '4px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}
            role="listbox"
            aria-labelledby={label ? `${id}-label` : undefined}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`select-option ${
                  option.value === selectedValue ? 'selected' : ''
                } ${option.disabled ? 'disabled' : ''}`}
                onClick={() => handleOptionClick(option)}
                style={{
                  padding: '0.5rem 1rem',
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                  backgroundColor:
                    option.value === selectedValue
                      ? 'var(--bg-selected)'
                      : 'transparent',
                  color: option.disabled
                    ? 'var(--text-color-light)'
                    : 'var(--text-color)',
                  opacity: option.disabled ? 0.6 : 1
                }}
                role="option"
                aria-selected={option.value === selectedValue}
                aria-disabled={option.disabled}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* 隐藏的原生选择框（用于表单提交） */}
      <select
        id={id}
        name={name}
        value={selectedValue}
        onChange={() => {}}
        disabled={disabled}
        required={required}
        style={{ display: 'none' }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EnhancedSelect;
