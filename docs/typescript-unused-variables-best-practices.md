# TypeScript 未使用变量处理最佳实践

本文档提供了在 PandaHabit 项目中处理未使用变量的最佳实践和指导方针。

## 为什么要处理未使用变量？

未使用的变量可能会导致以下问题：

1. 代码膨胀 - 增加代码体积，降低可读性
2. 混淆意图 - 让其他开发者困惑这些变量的用途
3. TypeScript 错误 - 触发 TS6133 错误："变量已声明但从未使用"
4. ESLint 警告 - 触发 @typescript-eslint/no-unused-vars 规则警告

## 处理未使用变量的方法

根据变量的具体情况，我们推荐以下几种处理方式：

### 1. 移除不需要的变量

如果变量确实不需要，最好的做法是直接移除它：

```typescript
// 不好的做法
const unusedVariable = someValue;
// ... 代码中从不使用 unusedVariable

// 好的做法
// 直接移除未使用的变量声明
```

### 2. 使用下划线前缀

对于函数参数或解构赋值中不需要使用的变量，使用下划线前缀：

```typescript
// 不好的做法
function process(data, config) {
  // 只使用 data，不使用 config
  return transformData(data);
}

// 好的做法
function process(data, _config) {
  return transformData(data);
}

// 解构赋值示例
const { name, age: _age } = person; // 只使用 name，不使用 age
```

### 3. 使用 ESLint 禁用注释

对于暂时不使用但将来可能会使用的变量，可以使用 ESLint 禁用注释：

```typescript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const futureVariable = computeValue();
```

### 4. 使用 void 操作符

对于需要保留但暂时不使用的函数或变量，可以使用 void 操作符：

```typescript
const stopAnimation = () => {
  setIsPlaying(false);
};

// 防止未使用变量警告
void stopAnimation;
```

### 5. 在注释中使用变量

对于需要保留以供文档目的的变量，可以在注释中使用它们：

```typescript
const refreshData = () => {
  // 刷新数据逻辑
};

// 在注释中使用变量，防止未使用变量警告
// 此函数可用于将来的数据刷新: ${refreshData()}
```

### 6. 使用类型断言

对于仅用于类型检查的变量，可以使用类型断言：

```typescript
const config = { /* ... */ } as const;
```

## 不同场景下的最佳实践

### React 组件中的 Props

对于组件接收但不使用的 props，使用下划线前缀：

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

function Button({ 
  label, 
  onClick, 
  disabled: _disabled = false, // 暂时不使用但保留 API
  variant: _variant = 'primary' // 暂时不使用但保留 API
}) {
  return <button onClick={onClick}>{label}</button>;
}
```

### React Hooks

对于 useState 返回的 setter 函数，如果暂时不使用，可以使用下划线或省略：

```typescript
// 只使用状态值，不使用 setter
const [isOpen, _setIsOpen] = useState(false);

// 或者完全省略 setter
const [isOpen] = useState(false);
```

### 事件处理函数

对于事件对象不使用的事件处理函数：

```typescript
// 不好的做法
const handleClick = (event) => {
  doSomething();
};

// 好的做法
const handleClick = (_event) => {
  doSomething();
};
```

### 暂时保留的功能

对于暂时不使用但计划在未来实现的功能：

```typescript
// 停止动画功能 - 保留但暂未使用，计划在未来版本中实现
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stopAnimation = () => {
  setIsPlaying(false);
};
```

## 项目中的一致性

为了保持项目的一致性，我们建议：

1. 对于同一类型的未使用变量，在整个项目中使用相同的处理方式
2. 在代码审查中关注未使用变量的处理方式
3. 定期检查和清理未使用的代码
4. 使用 ESLint 和 TypeScript 编译器来帮助识别未使用的变量

## 总结

处理未使用变量的最佳实践：

1. 如果确实不需要，直接移除
2. 对于函数参数或解构赋值，使用下划线前缀
3. 对于将来可能使用的变量，使用 ESLint 禁用注释
4. 对于需要保留的函数，使用 void 操作符或在注释中使用
5. 对于仅用于类型检查的变量，使用类型断言
6. 保持项目中处理方式的一致性

通过遵循这些最佳实践，我们可以提高代码质量，减少 TypeScript 和 ESLint 警告，并使代码更易于维护。
