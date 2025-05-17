# TypeScript 工具和脚本

本文档介绍了项目中用于TypeScript错误检查和修复的工具和脚本。

## 目录

1. [TypeScript错误检查](#typescript错误检查)
2. [自动修复TypeScript错误](#自动修复typescript错误)
3. [提交前检查](#提交前检查)
4. [TypeScript最佳实践](#typescript最佳实践)
5. [常见问题解答](#常见问题解答)

## TypeScript错误检查

### 检查TypeScript错误

使用以下命令检查项目中的TypeScript错误：

```bash
node scripts/typescript-check.js
```

这个脚本会运行TypeScript编译器，并生成错误报告。它会：

1. 运行`npx tsc --noEmit`检查TypeScript错误
2. 生成错误摘要，包括错误总数、按类型分类的错误和按文件分类的错误
3. 更新错误历史记录
4. 更新进度文件
5. 保存错误摘要到JSON文件

### 错误摘要

错误摘要会显示在控制台中，并保存到`typescript-error-summary.json`文件中。摘要包括：

- 错误总数
- 按类型分类的错误
- 按文件分类的错误

### 错误历史记录

错误历史记录保存在`docs/typescript-error-history.json`文件中，记录了每次检查的错误数量和类型。这可以用来跟踪错误修复的进度。

### 进度文件

进度文件`docs/typescript-fixes-progress.md`会在每次检查后更新，显示当前的错误修复进度，包括：

- 总错误数
- 已修复错误数
- 剩余错误数
- 完成百分比
- 最新检查时间

## 自动修复TypeScript错误

### 修复常见TypeScript错误

使用以下命令自动修复常见的TypeScript错误：

```bash
node scripts/fix-typescript-errors.js
```

这个脚本会读取`typescript-error-summary.json`文件，并尝试修复常见的TypeScript错误，包括：

- TS6133: 未使用的变量和导入
- TS2322: 类型赋值错误
- TS2339: 属性不存在错误
- TS2345: 参数类型错误
- TS2741: 类型中缺少属性
- TS6192: 导入声明中的所有导入都未使用
- TS2554: 预期的参数数量与实际不符
- TS18048: 可能为undefined的值

### 修复策略

脚本使用以下策略修复错误：

1. **未使用的变量和导入**
   - 添加`// eslint-disable-next-line @typescript-eslint/no-unused-vars`注释
   - 注释掉未使用的导入
   - 移除多导入中的未使用部分

2. **类型赋值错误**
   - 修复常见的类型不匹配，如按钮变体和颜色
   - 替换不兼容的属性名称

3. **属性不存在错误**
   - 添加可选链操作符
   - 为常见组件添加缺失的属性

4. **参数类型错误**
   - 添加类型转换
   - 添加空值合并操作符

5. **类型中缺少属性**
   - 添加缺失的属性
   - 为布尔属性添加适当的值

6. **可能为undefined的值**
   - 添加可选链操作符
   - 添加空值合并操作符和默认值

7. **预期的参数数量与实际不符**
   - 添加缺失的参数

## 提交前检查

### 设置提交前检查

使用以下命令在提交代码前检查TypeScript错误和ESLint问题：

```bash
node scripts/pre-commit-check.js
```

要将其设置为Git提交前钩子，请按照以下步骤操作：

1. 创建文件`.git/hooks/pre-commit`
2. 添加以下内容：
   ```bash
   #!/bin/sh
   node scripts/pre-commit-check.js
   ```
3. 使文件可执行：
   ```bash
   chmod +x .git/hooks/pre-commit
   ```

### 配置选项

可以在`scripts/pre-commit-check.js`文件中修改以下配置选项：

- `blockCommitOnError`: 是否在有错误时阻止提交
- `checkOnlyStagedFiles`: 是否只检查暂存的文件
- `runTypeScriptCheck`: 是否运行TypeScript检查
- `runESLintCheck`: 是否运行ESLint检查
- `maxErrorsToDisplay`: 最多显示的错误数量

## TypeScript最佳实践

查看[TypeScript最佳实践指南](./typescript-best-practices.md)，了解如何避免常见的TypeScript错误，提高代码质量和可维护性。

## 常见问题解答

### 如何查看当前的TypeScript错误？

运行以下命令：

```bash
npx tsc --noEmit
```

或者使用我们的脚本：

```bash
node scripts/typescript-check.js
```

### 如何修复特定类型的错误？

1. 运行`node scripts/typescript-check.js`生成错误摘要
2. 查看`typescript-error-summary.json`文件，找到特定类型的错误
3. 运行`node scripts/fix-typescript-errors.js`自动修复常见错误
4. 对于无法自动修复的错误，参考[TypeScript最佳实践指南](./typescript-best-practices.md)手动修复

### 如何跟踪错误修复进度？

查看`docs/typescript-fixes-progress.md`文件，它会在每次运行`node scripts/typescript-check.js`后更新。

### 自动修复脚本是否安全？

自动修复脚本设计为安全地修复常见错误，但它不能修复所有错误，也可能在某些情况下做出不正确的修复。在运行脚本后，请检查修改的文件，确保修复是正确的。

### 如何贡献新的修复策略？

如果你发现了一种常见的错误模式，可以在`scripts/fix-typescript-errors.js`文件中添加新的修复函数。请确保在添加新的修复策略前进行充分的测试。
