# PandaHabit 最佳实践指南

本文档整合了 PandaHabit 项目中的所有最佳实践和开发指南，为开发团队提供统一的参考标准。

## 1. 多语言支持

### 1.1 架构概述

PandaHabit 使用分层架构实现多语言支持：

1. **LanguageProvider**: 全局语言上下文，管理当前语言设置
2. **useLocalizedView**: 页面级本地化内容获取
3. **useComponentLabels**: 组件级本地化内容获取
4. **标签数据库**: 使用 Dexie.js 存储所有语言的标签

### 1.2 组件实现

#### 组件接口定义

```typescript
interface ComponentProps {
  labels?: {
    title: string;
    description: string;
    buttons?: {
      submit: string;
      cancel: string;
    };
  };
}
```

#### 组件实现示例

```typescript
const MyComponent: React.FC<ComponentProps> = ({ labels }) => {
  return (
    <div>
      <h2>{labels?.title || "Default Title"}</h2>
      <p>{labels?.description || "Default description"}</p>
      <button>{labels?.buttons?.submit || "Submit"}</button>
    </div>
  );
};
```

### 1.3 最佳实践

1. **避免硬编码文本**
   - 所有显示文本的组件都应支持多语言
   - 使用标签系统而非硬编码文本
   - 为所有文本提供英文默认值

2. **标签组织**
   - 使用层次结构组织标签：`[页面/视图].[组件].[标签]`
   - 例如：`homeView.welcomeSection.title`

3. **错误处理**
   - 错误消息应使用多语言标签
   - 提供有意义的默认英文错误消息

## 2. React Hooks 最佳实践

### 2.1 useEffect

```typescript
// 正确示例
useEffect(() => {
  const fullName = `${firstName} ${lastName}`;
  console.log(fullName);
}, [firstName, lastName]);

// 避免
useEffect(() => {
  const fullName = `${firstName} ${lastName}`;
  console.log(fullName);
}, []); // 缺少依赖
```

### 2.2 useCallback

```typescript
// 正确示例
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);

// 避免用于简单函数
const calculateTotal = () => price * quantity; // 不需要 useCallback
```

### 2.3 useMemo

```typescript
// 正确示例 - 复杂计算
const sortedItems = useMemo(() => {
  return items.slice().sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// 正确示例 - 对象引用
const style = useMemo(() => ({
  color: isActive ? 'red' : 'black',
  fontSize: size
}), [isActive, size]);
```

## 3. 组件开发指南

### 3.1 通用组件使用

#### Button 组件

```typescript
<Button 
  variant="primary" 
  isLoading={isLoading} 
  onClick={handleClick}
>
  {labels.button.submit}
</Button>
```

#### LoadingSpinner 组件

```typescript
<LoadingSpinner 
  type="data" 
  size="medium"
/>
```

#### ErrorDisplay 组件

```typescript
<ErrorDisplay 
  error={error} 
  onRetry={refetch}
/>
```

#### DataLoader 组件

```typescript
<DataLoader
  isLoading={isLoading}
  isError={isError}
  error={error}
  data={data}
  onRetry={refetch}
>
  {(data) => (
    <div>{data.name}</div>
  )}
</DataLoader>
```

### 3.2 最佳实践

1. **使用组件而非 HTML 元素**
   - 使用 Button 替代 button
   - 使用 EnhancedInput 替代 input
   - 使用 EnhancedTextArea 替代 textarea

2. **处理加载和错误状态**
   - 使用 LoadingSpinner 显示加载状态
   - 使用 ErrorDisplay 显示错误状态
   - 使用 DataLoader 处理数据加载流程

3. **数据刷新与局部更新**
   - 使用 DataRefreshProvider 实现数据同步
   - 使用 useDataRefresh 监听数据刷新事件
   - 使用 useTableRefresh 监听表数据刷新

## 4. 类型定义最佳实践

### 4.1 命名规范

- **接口**: 使用 PascalCase (例如：`TaskRecord`)
- **枚举**: 使用 PascalCase 命名，SCREAMING_SNAKE_CASE 值 (例如：`TaskStatus.TODO`)
- **类型**: 使用 PascalCase (例如：`Language`)
- **泛型**: 使用 T 前缀 (例如：`TDataPayload`)

### 4.2 类型安全

1. **避免 any**
   - 使用 unknown 替代 any
   - 创建具体的类型定义
   - 使用类型守卫确保类型安全

2. **可选属性**
   - 仅在真正可选时使用 `?`
   - 为多语言标签提供默认值
   - 考虑 API 响应中可能为 null 的属性

3. **回调函数类型**
   - 定义具体的参数和返回类型
   - 使用函数类型注解
   - 使用泛型处理不同数据类型

### 4.3 类型安全最佳实践

#### 4.3.1 处理可能未定义的值

```typescript
// 错误示例
const title = labels.title; // 可能未定义

// 正确示例 - 使用可选链
const title = labels?.title;

// 正确示例 - 使用空值合并
const title = labels?.title ?? "Default Title";

// 正确示例 - 使用类型守卫
if (labels && 'title' in labels) {
  const title = labels.title;
}
```

#### 4.3.2 类型断言和类型守卫

```typescript
// 错误示例 - 不安全的类型断言
const data = response as UserData;

// 正确示例 - 使用类型守卫
function isUserData(data: unknown): data is UserData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}

if (isUserData(response)) {
  const { id, name } = response;
}
```

#### 4.3.3 处理数组和对象

```typescript
// 错误示例
const firstItem = items[0].name; // items 可能为空

// 正确示例 - 数组检查
if (items.length > 0) {
  const firstItem = items[0].name;
}

// 正确示例 - 使用可选链和空值合并
const firstItem = items?.[0]?.name ?? "Unknown";

// 正确示例 - 对象属性检查
const hasRequiredProps = (obj: unknown): obj is RequiredProps => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'prop1' in obj &&
    'prop2' in obj
  );
};
```

#### 4.3.4 泛型约束

```typescript
// 错误示例 - 无约束的泛型
function processData<T>(data: T) {
  return data.value; // 错误：T 可能没有 value 属性
}

// 正确示例 - 使用泛型约束
interface HasValue {
  value: string;
}

function processData<T extends HasValue>(data: T) {
  return data.value;
}
```

#### 4.3.5 组件 Props 类型安全

```typescript
// 错误示例
interface Props {
  data: any; // 使用 any
  onAction: Function; // 使用 Function
}

// 正确示例
interface Props {
  data: UserData;
  onAction: (id: string) => void;
}

// 正确示例 - 使用泛型
interface DataProps<T> {
  data: T;
  render: (item: T) => React.ReactNode;
}
```

#### 4.3.6 事件处理类型安全

```typescript
// 错误示例
const handleChange = (e) => {
  console.log(e.target.value);
};

// 正确示例
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// 正确示例 - 使用类型推断
const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  console.log(e.target.value);
};
```

#### 4.3.7 异步操作类型安全

```typescript
// 错误示例
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json(); // 返回 any
}

// 正确示例
async function fetchData(): Promise<UserData> {
  const response = await fetch('/api/data');
  const data = await response.json();
  
  if (isUserData(data)) {
    return data;
  }
  throw new Error('Invalid data format');
}
```

#### 4.3.8 常见类型错误修复

1. **属性访问错误**
```typescript
// 错误
const value = obj.prop; // 可能未定义

// 修复
const value = obj?.prop;
const value = obj.prop ?? defaultValue;
```

2. **数组操作错误**
```typescript
// 错误
const first = array[0]; // 可能未定义

// 修复
const first = array?.[0];
const first = array.length > 0 ? array[0] : defaultValue;
```

3. **函数参数错误**
```typescript
// 错误
function process(data) { // 无类型
  return data.value;
}

// 修复
function process(data: DataType) {
  return data.value;
}
```

4. **组件 Props 错误**
```typescript
// 错误
const Component = (props) => { // 无类型
  return <div>{props.data}</div>;
};

// 修复
interface Props {
  data: string;
}
const Component: React.FC<Props> = ({ data }) => {
  return <div>{data}</div>;
};
```

### 4.4 类型安全检查清单

1. **代码审查清单**
   - [ ] 避免使用 any 类型
   - [ ] 为所有变量和函数提供类型注解
   - [ ] 使用类型守卫处理可能未定义的值
   - [ ] 为组件 Props 定义接口
   - [ ] 使用泛型约束确保类型安全
   - [ ] 为异步操作定义返回类型
   - [ ] 使用可选链和空值合并运算符
   - [ ] 为事件处理函数提供正确的类型

2. **常见错误修复**
   - [ ] 检查属性访问是否安全
   - [ ] 验证数组操作是否安全
   - [ ] 确保函数参数有类型定义
   - [ ] 验证组件 Props 类型完整性
   - [ ] 检查异步操作的类型安全
   - [ ] 确保事件处理函数类型正确

3. **最佳实践验证**
   - [ ] 使用 TypeScript 严格模式
   - [ ] 启用所有类型检查选项
   - [ ] 定期运行类型检查
   - [ ] 在 CI/CD 流程中包含类型检查
   - [ ] 保持类型定义文件更新
   - [ ] 使用类型生成工具

## 5. 数据刷新与同步

### 5.1 使用 DataRefreshProvider

```typescript
// 监听多个表
useDataRefresh(['table1', 'table2'], (event) => {
  // 处理数据刷新
});

// 监听单个表
useTableRefresh('tableName', (data) => {
  // 处理表数据刷新
});
```

### 5.2 最佳实践

1. **标准化数据刷新模式**
   - 使用 useRegisterTableRefresh 统一处理
   - 在组件开发指南中记录推荐模式

2. **改进类型安全**
   - 为数据刷新回调定义具体类型
   - 替换 any 类型为具体类型

3. **简化回调逻辑**
   - 将复杂回调逻辑提取为独立函数
   - 使用 ref 模式处理复杂依赖

## 6. 页面转场动画

### 6.1 使用 EnhancedPageTransition

```typescript
<EnhancedPageTransition type="inkSpread">
  <div className="page-content">
    <h1>页面标题</h1>
    <p>页面内容</p>
  </div>
</EnhancedPageTransition>
```

### 6.2 最佳实践

1. **保持一致性**
   - 为同类型页面使用相同转场动画
   - 根据页面内容选择适合的动画效果

2. **性能优化**
   - 使用 GPU 加速的动画属性
   - 在移动设备上降低装饰元素不透明度
   - 为偏好减少动画的用户提供选项

3. **可访问性**
   - 提供关闭或简化动画的选项
   - 考虑有特殊需求的用户

## 7. 测试最佳实践

### 7.1 单元测试

- 测试组件在不同语言设置下的渲染
- 测试错误处理和加载状态
- 测试数据刷新和同步功能

### 7.2 集成测试

- 测试组件间的交互
- 测试数据流和状态管理
- 测试页面转场和动画效果

## 8. 性能优化

### 8.1 组件优化

- 使用 React.memo 避免不必要的重渲染
- 使用 useMemo 缓存计算结果
- 使用 useCallback 缓存回调函数

### 8.2 数据优化

- 实现数据分页和虚拟滚动
- 使用数据缓存减少请求
- 优化数据刷新策略

## 9. 可访问性

### 9.1 基本原则

- 提供适当的 ARIA 标签
- 确保键盘导航支持
- 提供足够的颜色对比度

### 9.2 动画和交互

- 提供减少动画的选项
- 确保动画不会影响可访问性
- 提供清晰的焦点指示器

## 10. 错误处理

### 10.1 错误边界

- 使用错误边界捕获渲染错误
- 提供友好的错误提示
- 实现错误报告机制

### 10.2 错误恢复

- 提供重试机制
- 保存用户操作状态
- 实现优雅的降级策略

## 11. 枚举和常量使用规范

### 11.1 枚举定义规范

```typescript
// 正确示例
enum SoundType {
  CLICK = 'CLICK',
  UNLOCK = 'UNLOCK',
  REWARD = 'REWARD',
  BAMBOO_PLANT = 'BAMBOO_PLANT',
  BAMBOO_HARVEST = 'BAMBOO_HARVEST',
  COMPLETE = 'COMPLETE',
  FAIL = 'FAIL',
  CREATE = 'CREATE'
}

// 使用示例
const soundType: SoundType = SoundType.CLICK;
```

### 11.2 常量定义规范

```typescript
// 正确示例
const NOTIFICATION_PRIORITIES = {
  URGENT: 'URGENT',
  HIGH: 'HIGH',
  LOW: 'LOW'
} as const;

type NotificationPriority = typeof NOTIFICATION_PRIORITIES[keyof typeof NOTIFICATION_PRIORITIES];
```

## 12. 未使用代码处理指南

### 12.1 未使用导入处理

```typescript
// 错误示例
import { unused1, unused2 } from './module';

// 正确示例
import { used1, used2 } from './module';
```

### 12.2 未使用变量处理

```typescript
// 错误示例
const unused = 'value';

// 正确示例
const used = 'value';
console.log(used);
```

### 12.3 未使用参数处理

```typescript
// 错误示例
function handler(unused: string) {
  console.log('Hello');
}

// 正确示例
function handler(_unused: string) {
  console.log('Hello');
}
```

## 13. 数据库类型定义规范

### 13.1 数据库方法类型

```typescript
interface DatabaseMethods {
  tableExists: (tableName: string) => Promise<boolean>;
  createTable: (tableName: string) => Promise<void>;
  insert: <T>(tableName: string, data: T) => Promise<void>;
  update: <T>(tableName: string, id: string, data: Partial<T>) => Promise<void>;
  delete: (tableName: string, id: string) => Promise<void>;
  query: <T>(tableName: string, query: QueryOptions) => Promise<T[]>;
}

// 使用示例
class Database implements DatabaseMethods {
  async tableExists(tableName: string): Promise<boolean> {
    // 实现
  }
  // ... 其他方法实现
}
```

### 13.2 数据库模型类型

```typescript
interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserModel extends BaseModel {
  name: string;
  email: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  notifications: boolean;
}
```

## 14. 服务层类型安全指南

### 14.1 服务响应类型

```typescript
interface ServiceResponse<T> {
  data: T;
  error?: Error;
  status: 'success' | 'error';
  timestamp: number;
}

// 使用示例
async function fetchUserData(): Promise<ServiceResponse<UserModel>> {
  try {
    const data = await db.query<UserModel>('users', {});
    return {
      data,
      status: 'success',
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      data: null as any,
      error: error as Error,
      status: 'error',
      timestamp: Date.now()
    };
  }
}
```

### 14.2 服务方法类型

```typescript
interface UserService {
  getUser: (id: string) => Promise<ServiceResponse<UserModel>>;
  updateUser: (id: string, data: Partial<UserModel>) => Promise<ServiceResponse<UserModel>>;
  deleteUser: (id: string) => Promise<ServiceResponse<void>>;
}

// 使用示例
class UserServiceImpl implements UserService {
  async getUser(id: string): Promise<ServiceResponse<UserModel>> {
    // 实现
  }
  // ... 其他方法实现
}
```

### 14.3 错误处理类型

```typescript
interface ServiceError extends Error {
  code: string;
  details?: Record<string, unknown>;
  timestamp: number;
}

// 使用示例
class ServiceErrorImpl extends Error implements ServiceError {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.timestamp = Date.now();
  }
}
```

## 15. 类型安全检查清单

### 15.1 代码审查清单

- [ ] 检查所有枚举值是否正确定义和使用
- [ ] 确保没有未使用的导入和变量
- [ ] 验证数据库方法类型是否完整
- [ ] 检查服务层响应类型是否统一
- [ ] 确保错误处理类型正确实现
- [ ] 验证所有异步操作都有正确的返回类型
- [ ] 检查所有组件 Props 类型是否完整
- [ ] 确保所有可能为 undefined 的值都有适当的处理

### 15.2 自动化检查

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 15.3 定期维护任务

1. 每周运行类型检查
2. 清理未使用的代码
3. 更新类型定义
4. 验证类型安全性
5. 更新文档

## 结论

通过遵循这些最佳实践，我们可以确保 PandaHabit 项目保持高质量、可维护性和可扩展性。这些指南应该随着项目的发展不断更新和完善。 