# 输入框组件文档

## 概述

PandaHabit 应用使用增强的输入框组件，为用户提供美观、功能丰富的表单交互体验。本文档描述了应用中使用的输入框组件类型、实现方式和最佳实践。

## 输入框组件类型

PandaHabit 应用提供了三种主要的输入框组件，每种组件都有其独特的功能和适用场景。

### 1. 增强文本输入框 (EnhancedInput)

用于单行文本输入，适用于用户名、邮箱、密码等简短信息的输入。

```tsx
<EnhancedInput
  label="用户名"
  placeholder="请输入用户名"
  value={inputValue}
  onChange={handleInputChange}
  helpText="请输入您的用户名，长度在3-20个字符之间"
/>
```

### 2. 增强文本区域 (EnhancedTextArea)

用于多行文本输入，适用于描述、反馈、评论等长文本的输入。

```tsx
<EnhancedTextArea
  label="反馈内容"
  placeholder="请输入您的反馈内容"
  value={textAreaValue}
  onChange={handleTextAreaChange}
  helpText="请详细描述您的问题或建议"
  autoResize={true}
/>
```

### 3. 增强选择框 (EnhancedSelect)

用于从预定义选项中选择一个值，适用于类别、状态、优先级等选择。

```tsx
<EnhancedSelect
  label="选择选项"
  placeholder="请选择一个选项"
  options={selectOptions}
  value={selectValue}
  onChange={handleSelectChange}
  helpText="从下拉列表中选择一个选项"
/>
```

## 样式变体

PandaHabit 应用提供了多种输入框样式变体，用于适应不同的场景和设计风格。

### 1. 默认样式 (Default)

标准的输入框样式，适用于大多数场景。

```tsx
<EnhancedInput
  label="默认样式"
  placeholder="默认样式输入框"
  variant="default"
/>
```

### 2. 中国风样式 (Chinese)

简约的中国风样式，适用于与中国传统文化相关的场景。

```tsx
<EnhancedInput
  label="中国风样式"
  placeholder="中国风样式输入框"
  variant="chinese"
/>
```

### 3. 竹简样式 (Bamboo)

模拟竹简的样式，适用于游戏化场景。

```tsx
<EnhancedInput
  label="竹简样式"
  placeholder="竹简样式输入框"
  variant="bamboo"
/>
```

### 4. 水墨样式 (Ink)

模拟水墨效果的样式，适用于艺术化场景。

```tsx
<EnhancedInput
  label="水墨样式"
  placeholder="水墨样式输入框"
  variant="ink"
/>
```

## 状态类型

PandaHabit 应用提供了多种输入框状态类型，用于表示输入框的不同状态。

### 1. 默认状态 (Default)

输入框的默认状态。

```tsx
<EnhancedInput
  label="默认状态"
  placeholder="默认状态输入框"
  status="default"
/>
```

### 2. 错误状态 (Error)

输入框的错误状态，通常用于表示输入内容不符合要求。

```tsx
<EnhancedInput
  label="错误状态"
  placeholder="错误状态输入框"
  status="error"
  errorMessage="这是一个错误信息"
/>
```

### 3. 成功状态 (Success)

输入框的成功状态，通常用于表示输入内容符合要求。

```tsx
<EnhancedInput
  label="成功状态"
  placeholder="成功状态输入框"
  status="success"
  helpText="输入成功"
/>
```

## 特性和选项

PandaHabit 应用的输入框组件提供了多种特性和选项，用于增强用户体验。

### 1. 浮动标签 (Floating Label)

标签在输入框获得焦点或有内容时浮动到输入框上方，节省空间并提供更好的视觉引导。

```tsx
<EnhancedInput
  label="浮动标签"
  placeholder="浮动标签输入框"
  floatingLabel={true}
/>
```

### 2. 图标 (Icon)

在输入框左侧或右侧显示图标，提供视觉提示或额外功能。

```tsx
<EnhancedInput
  label="带图标的输入框"
  placeholder="带图标的输入框"
  iconLeft={<SearchIcon />}
/>
```

### 3. 可清除 (Clearable)

在输入框右侧显示清除按钮，方便用户清除输入内容。

```tsx
<EnhancedInput
  label="可清除的输入框"
  placeholder="可清除的输入框"
  clearable={true}
/>
```

### 4. 字符计数器 (Counter)

显示已输入字符数和最大字符数，帮助用户控制输入长度。

```tsx
<EnhancedInput
  label="带计数器的输入框"
  placeholder="带计数器的输入框"
  counter={true}
  maxLength={20}
/>
```

### 5. 自动调整高度 (Auto Resize)

文本区域根据内容自动调整高度，提供更好的编辑体验。

```tsx
<EnhancedTextArea
  label="自动调整高度的文本区域"
  placeholder="自动调整高度的文本区域"
  autoResize={true}
  minRows={3}
  maxRows={8}
/>
```

## 实现方式

输入框组件使用 React 和 Framer Motion 库实现，通过 CSS 和 JavaScript 实现各种特性和效果。主要实现方式包括：

1. **组件封装**：将原生 HTML 输入元素封装为 React 组件，提供更丰富的功能和更好的开发体验。
2. **状态管理**：使用 React 的状态管理功能，跟踪输入框的值、焦点状态等。
3. **动画效果**：使用 Framer Motion 库实现标签浮动、错误信息显示等动画效果。
4. **样式变体**：通过 CSS 类和样式对象实现不同的样式变体。
5. **辅助功能**：添加适当的 ARIA 属性，提高输入框的可访问性。

## 性能优化

为了确保输入框组件在各种设备上都能流畅运行，我们采取了以下优化措施：

1. **响应式设计**：在不同屏幕尺寸上调整输入框大小和样式，提供一致的用户体验。
2. **减少重渲染**：使用 React 的 `useRef` 和 `useEffect` 钩子，减少不必要的重渲染。
3. **条件渲染**：只在需要时渲染辅助元素，如错误信息、帮助文本等。
4. **优化动画**：使用 Framer Motion 的性能优化功能，减少动画对性能的影响。
5. **减少动画**：对于偏好减少动画的用户，提供禁用动画的选项。

## 最佳实践

1. **保持一致性**：在整个应用中使用一致的输入框样式和行为，提供一致的用户体验。
2. **提供反馈**：使用适当的状态和消息，为用户提供清晰的反馈。
3. **考虑可访问性**：确保输入框组件对所有用户都可访问，包括使用屏幕阅读器的用户。
4. **适当使用变体**：根据场景选择适当的样式变体，增强用户体验。
5. **验证输入**：在客户端和服务器端都进行输入验证，确保数据的有效性和安全性。

## 示例

### 基础示例

```tsx
import EnhancedInput from '@/components/common/EnhancedInput';

const MyComponent = () => {
  const [value, setValue] = useState('');
  
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  
  return (
    <EnhancedInput
      label="用户名"
      placeholder="请输入用户名"
      value={value}
      onChange={handleChange}
      helpText="请输入您的用户名，长度在3-20个字符之间"
    />
  );
};
```

### 表单示例

```tsx
import EnhancedInput from '@/components/common/EnhancedInput';
import EnhancedTextArea from '@/components/common/EnhancedTextArea';
import EnhancedSelect from '@/components/common/EnhancedSelect';
import Button from '@/components/common/Button';

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: ''
  });
  
  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };
  
  const handleSelectChange = (field) => (value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <EnhancedInput
        label="姓名"
        placeholder="请输入您的姓名"
        value={formData.name}
        onChange={handleChange('name')}
        required
      />
      
      <EnhancedInput
        label="邮箱"
        placeholder="请输入您的邮箱"
        value={formData.email}
        onChange={handleChange('email')}
        type="email"
        required
      />
      
      <EnhancedSelect
        label="类别"
        placeholder="请选择类别"
        options={[
          { value: 'feedback', label: '反馈' },
          { value: 'question', label: '问题' },
          { value: 'suggestion', label: '建议' }
        ]}
        value={formData.category}
        onChange={handleSelectChange('category')}
        required
      />
      
      <EnhancedTextArea
        label="消息"
        placeholder="请输入您的消息"
        value={formData.message}
        onChange={handleChange('message')}
        autoResize={true}
        required
      />
      
      <Button type="submit" variant="jade">
        提交
      </Button>
    </form>
  );
};
```

## 输入框组件展示页面

PandaHabit 应用提供了一个输入框组件展示页面，用于展示各种输入框组件和样式。可以通过访问 `/input-showcase` 路径查看。

在这个页面上，你可以：

1. 选择不同的样式变体
2. 选择不同的状态
3. 启用或禁用各种特性，如浮动标签、图标、可清除、字符计数器等
4. 查看不同大小的输入框
5. 查看不同样式变体的示例
6. 查看不同状态的示例
