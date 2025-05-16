// src/pages/InputShowcase.tsx
import React, { useState } from 'react';
import EnhancedInput from '@/components/common/EnhancedInput';
import EnhancedTextArea from '@/components/common/EnhancedTextArea';
import EnhancedSelect from '@/components/common/EnhancedSelect';
import { InputStyleVariant, InputStatus } from '@/components/common/EnhancedInput';
import { SelectOption } from '@/components/common/EnhancedSelect';

/**
 * 输入框展示页面
 * 展示各种输入框组件和样式
 */
const InputShowcase: React.FC = () => {
  // 状态
  const [inputValue, setInputValue] = useState<string>('');
  const [textAreaValue, setTextAreaValue] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string | number>('');
  const [selectedVariant, setSelectedVariant] = useState<InputStyleVariant>('default');
  const [selectedStatus, setSelectedStatus] = useState<InputStatus>('default');
  const [floatingLabel, setFloatingLabel] = useState<boolean>(false);
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const [clearable, setClearable] = useState<boolean>(true);
  const [counter, setCounter] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 样式变体选项
  const variantOptions: SelectOption[] = [
    { value: 'default', label: '默认样式' },
    { value: 'chinese', label: '中国风样式' },
    { value: 'bamboo', label: '竹简样式' },
    { value: 'ink', label: '水墨样式' }
  ];

  // 状态选项
  const statusOptions: SelectOption[] = [
    { value: 'default', label: '默认状态' },
    { value: 'error', label: '错误状态' },
    { value: 'success', label: '成功状态' }
  ];

  // 下拉框选项
  const selectOptions: SelectOption[] = [
    { value: 'option1', label: '选项 1' },
    { value: 'option2', label: '选项 2' },
    { value: 'option3', label: '选项 3' },
    { value: 'option4', label: '选项 4', disabled: true },
    { value: 'option5', label: '选项 5' }
  ];

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 处理文本区域变化
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value);
  };

  // 处理选择框变化
  const handleSelectChange = (value: string | number) => {
    setSelectValue(value);
  };

  // 处理变体变化
  const handleVariantChange = (value: string | number) => {
    setSelectedVariant(value as InputStyleVariant);
  };

  // 处理状态变化
  const handleStatusChange = (value: string | number) => {
    setSelectedStatus(value as InputStatus);
    if (value === 'error') {
      setErrorMessage('这是一个错误信息示例');
    } else {
      setErrorMessage('');
    }
  };

  // 渲染图标
  const renderIcon = () => {
    if (!showIcon) return null;
    
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div className="page-container">
      <div className="bamboo-frame">
        <h1>输入框组件展示</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">配置选项</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <EnhancedSelect
              label="样式变体"
              options={variantOptions}
              value={selectedVariant}
              onChange={handleVariantChange}
            />
            <EnhancedSelect
              label="状态"
              options={statusOptions}
              value={selectedStatus}
              onChange={handleStatusChange}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={floatingLabel}
                onChange={(e) => setFloatingLabel(e.target.checked)}
              />
              浮动标签
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showIcon}
                onChange={(e) => setShowIcon(e.target.checked)}
              />
              显示图标
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={clearable}
                onChange={(e) => setClearable(e.target.checked)}
              />
              可清除
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={counter}
                onChange={(e) => setCounter(e.target.checked)}
              />
              字符计数
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
              />
              禁用
            </label>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">文本输入框</h2>
          <div className="grid grid-cols-1 gap-4">
            <EnhancedInput
              label="用户名"
              placeholder="请输入用户名"
              value={inputValue}
              onChange={handleInputChange}
              helpText="请输入您的用户名，长度在3-20个字符之间"
              errorMessage={selectedStatus === 'error' ? errorMessage : ''}
              status={selectedStatus}
              variant={selectedVariant}
              floatingLabel={floatingLabel}
              iconLeft={showIcon ? renderIcon() : undefined}
              clearable={clearable}
              counter={counter}
              maxLength={20}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">文本区域</h2>
          <div className="grid grid-cols-1 gap-4">
            <EnhancedTextArea
              label="反馈内容"
              placeholder="请输入您的反馈内容"
              value={textAreaValue}
              onChange={handleTextAreaChange}
              helpText="请详细描述您的问题或建议"
              errorMessage={selectedStatus === 'error' ? errorMessage : ''}
              status={selectedStatus}
              variant={selectedVariant}
              floatingLabel={floatingLabel}
              counter={counter}
              maxLength={200}
              autoResize={true}
              minRows={3}
              maxRows={8}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">选择框</h2>
          <div className="grid grid-cols-1 gap-4">
            <EnhancedSelect
              label="选择选项"
              placeholder="请选择一个选项"
              options={selectOptions}
              value={selectValue}
              onChange={handleSelectChange}
              helpText="从下拉列表中选择一个选项"
              errorMessage={selectedStatus === 'error' ? errorMessage : ''}
              status={selectedStatus}
              variant={selectedVariant}
              floatingLabel={floatingLabel}
              iconLeft={showIcon ? renderIcon() : undefined}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">输入框大小</h2>
          <div className="grid grid-cols-1 gap-4">
            <EnhancedInput
              label="小尺寸输入框"
              placeholder="小尺寸"
              variant={selectedVariant}
              size="small"
            />
            <EnhancedInput
              label="中尺寸输入框"
              placeholder="中尺寸"
              variant={selectedVariant}
              size="medium"
            />
            <EnhancedInput
              label="大尺寸输入框"
              placeholder="大尺寸"
              variant={selectedVariant}
              size="large"
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">样式变体示例</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedInput
              label="默认样式"
              placeholder="默认样式输入框"
              variant="default"
            />
            <EnhancedInput
              label="中国风样式"
              placeholder="中国风样式输入框"
              variant="chinese"
            />
            <EnhancedInput
              label="竹简样式"
              placeholder="竹简样式输入框"
              variant="bamboo"
            />
            <EnhancedInput
              label="水墨样式"
              placeholder="水墨样式输入框"
              variant="ink"
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">状态示例</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnhancedInput
              label="默认状态"
              placeholder="默认状态输入框"
              variant={selectedVariant}
              status="default"
            />
            <EnhancedInput
              label="错误状态"
              placeholder="错误状态输入框"
              variant={selectedVariant}
              status="error"
              errorMessage="这是一个错误信息"
            />
            <EnhancedInput
              label="成功状态"
              placeholder="成功状态输入框"
              variant={selectedVariant}
              status="success"
              helpText="输入成功"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputShowcase;
