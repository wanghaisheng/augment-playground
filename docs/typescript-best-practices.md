# TypeScript 最佳实践指南

本文档提供了在PandaHabit项目中使用TypeScript的最佳实践和指导方针，帮助开发者避免常见的TypeScript错误，提高代码质量和可维护性。

## 目录

1. [类型定义](#类型定义)
2. [接口和类型别名](#接口和类型别名)
3. [函数](#函数)
4. [类](#类)
5. [泛型](#泛型)
6. [空值处理](#空值处理)
7. [导入和导出](#导入和导出)
8. [React组件](#react组件)
9. [状态管理](#状态管理)
10. [异步操作](#异步操作)
11. [错误处理](#错误处理)
12. [代码组织](#代码组织)
13. [常见错误及解决方案](#常见错误及解决方案)

## 类型定义

### 使用明确的类型

- 尽量避免使用`any`类型，它会绕过TypeScript的类型检查
- 使用具体类型代替`any`，如`string`、`number`、`boolean`等
- 如果不确定类型，可以使用`unknown`代替`any`，它更安全

```typescript
// 不推荐
let value: any = 'hello';
value = 123; // 不会报错

// 推荐
let value: string = 'hello';
// value = 123; // 类型错误，会被编译器捕获
```

### 使用联合类型

- 当一个变量可能有多种类型时，使用联合类型

```typescript
// 推荐
let id: string | number;
id = 'abc123';
id = 456;
```

### 使用类型断言

- 当你比TypeScript更了解某个值的类型时，可以使用类型断言
- 使用`as`语法进行类型断言，避免使用尖括号语法（在JSX中会产生歧义）

```typescript
// 推荐
const element = document.getElementById('root') as HTMLElement;

// 不推荐（在JSX中会产生歧义）
const element = <HTMLElement>document.getElementById('root');
```

### 使用字面量类型

- 使用字面量类型可以限制变量的可能值

```typescript
// 推荐
type Direction = 'north' | 'south' | 'east' | 'west';
let direction: Direction = 'north';
// direction = 'northeast'; // 类型错误
```

## 接口和类型别名

### 接口命名

- 接口名称使用PascalCase命名法
- 接口名称通常不使用前缀`I`

```typescript
// 推荐
interface User {
  id: string;
  name: string;
  email: string;
}

// 不推荐
interface IUser {
  id: string;
  name: string;
  email: string;
}
```

### 接口vs类型别名

- 优先使用接口（interface）定义对象类型
- 使用类型别名（type）定义联合类型、交叉类型、元组类型等

```typescript
// 对象类型使用接口
interface User {
  id: string;
  name: string;
}

// 联合类型使用类型别名
type ID = string | number;

// 元组类型使用类型别名
type Point = [number, number];
```

### 扩展接口

- 使用`extends`关键字扩展接口

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: string;
  department: string;
}
```

### 可选属性

- 使用`?`标记可选属性

```typescript
interface User {
  id: string;
  name: string;
  email?: string; // 可选属性
}
```

## 函数

### 函数参数和返回值类型

- 明确指定函数参数和返回值的类型

```typescript
// 推荐
function add(a: number, b: number): number {
  return a + b;
}

// 不推荐
function add(a, b) {
  return a + b;
}
```

### 可选参数

- 使用`?`标记可选参数
- 可选参数必须放在必选参数后面

```typescript
// 推荐
function greet(name: string, greeting?: string): string {
  return greeting ? `${greeting}, ${name}!` : `Hello, ${name}!`;
}
```

### 默认参数

- 使用默认参数值代替可选参数

```typescript
// 推荐
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}!`;
}
```

### 函数重载

- 使用函数重载定义多种参数类型组合

```typescript
// 函数重载
function createElement(tag: 'a'): HTMLAnchorElement;
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'span'): HTMLSpanElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}
```

## 空值处理

### 使用可选链操作符

- 使用`?.`操作符安全地访问可能为`null`或`undefined`的属性

```typescript
// 推荐
const userName = user?.name;

// 不推荐
const userName = user ? user.name : undefined;
```

### 使用空值合并操作符

- 使用`??`操作符为`null`或`undefined`的值提供默认值

```typescript
// 推荐
const userName = user?.name ?? 'Anonymous';

// 不推荐
const userName = (user && user.name) || 'Anonymous';
```

### 非空断言

- 谨慎使用非空断言操作符`!`，它会告诉TypeScript某个值不可能为`null`或`undefined`
- 只在确定值不为空的情况下使用

```typescript
// 谨慎使用
const element = document.getElementById('root')!;
```

## React组件

### 函数组件类型

- 使用`React.FC`或`React.FunctionComponent`类型定义函数组件
- 或者使用更简洁的箭头函数类型定义

```typescript
// 使用React.FC
const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

// 使用箭头函数类型定义
const Button = ({ children, onClick }: ButtonProps): JSX.Element => {
  return <button onClick={onClick}>{children}</button>;
};
```

### 组件Props类型

- 为组件Props定义明确的接口
- 使用可选属性标记非必需的Props

```typescript
interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

### 事件处理函数类型

- 使用React提供的事件类型

```typescript
// 推荐
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Button clicked');
};

// 推荐
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
};
```

### 使用useRef

- 为useRef指定正确的类型

```typescript
// 推荐
const inputRef = useRef<HTMLInputElement>(null);
```

### 使用useState

- 为useState指定状态类型

```typescript
// 推荐
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
```

## 常见错误及解决方案

### TS6133: 未使用的变量

**错误信息:** `'variableName' is declared but its value is never read.`

**解决方案:**
- 添加`// eslint-disable-next-line @typescript-eslint/no-unused-vars`注释
- 使用下划线前缀：`_variableName`
- 使用`void`操作符：`void variableName;`
- 注释掉变量声明
- 如果不需要，删除变量

### TS2322: 类型赋值错误

**错误信息:** `Type 'X' is not assignable to type 'Y'.`

**解决方案:**
- 使用类型断言：`value as Type`
- 修复类型以匹配预期类型
- 对可空值使用可选链或空值合并
- 更新组件props以匹配预期类型

### TS2339: 属性不存在错误

**错误信息:** `Property 'X' does not exist on type 'Y'.`

**解决方案:**
- 添加可选链：`obj?.property`
- 在接口/类型中添加缺失的属性
- 使用类型断言：`(obj as SomeType).property`
- 修复属性名称中的拼写错误

### TS2345: 参数类型错误

**错误信息:** `Argument of type 'X' is not assignable to parameter of type 'Y'.`

**解决方案:**
- 将参数转换为预期类型：`String(numValue)`，`Number(strValue)`
- 为可选值添加空值合并：`value ?? defaultValue`
- 使用类型断言：`value as ExpectedType`
- 修复函数签名以接受提供的类型

### TS2741: 类型中缺少属性

**错误信息:** `Property 'X' is missing in type '{ ... }' but required in type 'Y'.`

**解决方案:**
- 向对象添加缺失的属性
- 在接口/类型中将属性设为可选
- 使用类型断言覆盖类型检查

### TS18048: 可能为undefined的值

**错误信息:** `'X' is possibly 'undefined'.`

**解决方案:**
- 使用可选链操作符：`obj?.prop`
- 使用空值合并操作符：`obj?.prop ?? defaultValue`
- 添加类型守卫：`if (obj && obj.prop) { ... }`
- 使用非空断言（谨慎使用）：`obj!.prop`
