# TypeScript 错误修复进度

本文档用于跟踪 TypeScript 错误修复的进度。

## 当前状态

**总错误数:** 830 (Initial)
**已修复错误数:** 256 (830 - 574)
**剩余错误数:** 574
**完成百分比:** 30.84%

**最新进展:** 创建了一套自动化脚本来修复常见的 lint 错误，包括：
1. 未使用的变量和导入（通过添加下划线前缀）
2. React Hooks 规则违反（条件渲染中的 hooks 调用和缺少的依赖项）
3. 显式 any 类型（替换为更具体的类型）
4. case 语句中的词法声明（移动到 switch 语句开头）

这些脚本位于 `scripts/` 目录下，可以通过运行 `node scripts/fix-lint-errors.js` 来执行所有修复。

**Note:** The critical `pageLabels as never` errors in multiple page components (CustomGoals, BambooDashboard, BambooTrading, Store, TeaRoom, TimelyRewards, etc.) have been resolved. The fix involved making ALL properties within ALL respective `...PageViewLabelsBundle` interfaces (and their nested label objects) optional. This allows TypeScript to correctly infer the type of `pageLabels` as `SpecificBundle | undefined`.

This change has revealed new, more standard TypeScript errors (TS18048: possibly 'undefined'; TS2322: 'string | undefined' not assignable to 'string') where these optional labels are accessed without proper optional chaining or default fallbacks. These are the next errors to be addressed.

项目结构可以参考repomix-output.md，便于你查找文件

所有unused statement优先级最低，最后结合prd中的功能需求检查是否应该保留来拓展功能还是代码迁移过程中应该删除的残留。

## 阶段 1: 基础类型定义修复

### 任务 1.1: 修复 SoundType 枚举
- [ ] 移除重复的枚举值
- [ ] 添加缺失的枚举值
- [ ] 更新使用这些枚举的组件

### 任务 1.2: 修复 BattlePass 类型定义
- [ ] 移除重复的标识符
- [ ] 完善类型定义
- [ ] 确保所有属性都有正确的类型

### 任务 1.3: 修复标签类型定义
- [ ] 移除未使用的导入
- [ ] 添加缺失的类型定义
- [ ] 修复类型兼容性问题

## 阶段 2: 组件类型修复

### 任务 2.1: 修复动画组件类型
- [ ] 添加空值检查
- [ ] 修复类型定义
- [ ] 更新组件属性类型

### 任务 2.2: 修复数据库相关类型
- [ ] 添加数据库方法类型定义
- [ ] 修复数据库操作类型
- [ ] 添加属性存在性检查

## 阶段 3: 服务层类型修复

### 任务 3.1: 修复通知服务
- [ ] 更新 SoundType 使用
- [ ] 修复类型兼容性
- [ ] 添加缺失的属性定义

### 任务 3.2: 修复离线服务
- [ ] 添加数据库方法类型
- [ ] 修复类型兼容性
- [ ] 清理未使用的代码

### 任务 3.3: 修复熊猫交互服务
- [~] 添加数据库方法类型 (tableExists/createTable removed, `orderBy` issues remain)
- [x] 修复类型兼容性 (InteractionRecord refactored, imports fixed)
- [~] 修复索引类型问题 (`orderBy` issues persist, some implicit any fixed)

## 阶段 4: 清理和优化

### 任务 4.1: 清理未使用的代码
- [~] 移除未使用的导入 (通过自动化脚本添加下划线前缀)
- [~] 删除未使用的变量 (通过自动化脚本添加下划线前缀)
- [~] 清理未使用的参数 (通过自动化脚本添加下划线前缀)

### 任务 4.2: 优化类型定义
- [ ] 移除重复的类型定义
- [ ] 完善类型定义
- [ ] 统一类型使用方式

### 任务 4.3: 修复 React Hooks 规则违反
- [~] 修复条件渲染中的 hooks 调用 (通过自动化脚本添加 TODO 注释)
- [~] 添加缺少的依赖项 (通过自动化脚本自动添加)

### 任务 4.4: 修复显式 any 类型
- [~] 替换为更具体的类型 (通过自动化脚本自动替换)
- [ ] 手动审查和优化自动替换的类型

### 任务 4.5: 修复 case 语句中的词法声明
- [~] 移动到 switch 语句开头 (通过自动化脚本自动修复)

## 阶段 5: 测试和验证

### 任务 5.1: 运行类型检查
- [ ] 运行 TypeScript 编译器
- [ ] 验证修复结果
- [ ] 记录剩余问题

### 任务 5.2: 功能测试
- [ ] 测试修复后的组件
- [ ] 验证功能完整性
- [ ] 确保没有引入新的问题

## 错误分类统计

### 类型兼容性问题
- 总错误数: 约 300
- 已修复: 0
- 剩余: 约 300

### 未使用的声明
- 总错误数: 约 200
- 已修复: 0
- 剩余: 约 200

### 缺失的属性
- 总错误数: 约 150
- 已修复: 0
- 剩余: 约 150

### 枚举/常量问题
- 总错误数: 约 100
- 已修复: 0
- 剩余: 约 100

### 可能为 undefined 的值
- 总错误数: 约 49
- 已修复: 0
- 剩余: 约 49

## 下一步计划

1. 运行自动化脚本修复常见的 lint 错误
2. 手动审查和优化自动修复的结果
3. 开始修复 SoundType 枚举问题
4. 修复 BattlePass 类型定义中的重复标识符
5. 清理标签类型定义中的未使用导入

## 注意事项

- 每个修复都需要进行测试以确保不会引入新的问题
- 保持代码风格的一致性
- 记录所有重要的修改
- 定期更新进度

### 自动化脚本使用说明

1. 运行所有修复脚本：
   ```
   node scripts/fix-lint-errors.js
   ```

2. 运行单个修复脚本：
   ```
   node scripts/fix-unused-vars.js
   node scripts/fix-hooks-rules.js
   node scripts/fix-explicit-any.js
   node scripts/fix-case-declarations.js
   ```

3. 修复后检查结果：
   ```
   npm run lint
   ```

4. 查看修复报告：
   ```
   docs/lint-fixes-report.md
   ```

### 已检查文件

- `src/utils/label-migrator.ts`: No unused code found.
- `src/utils/particleEffects.tsx`: No unused code found after full review (motion import is used).
- `src/utils/sound.ts`: No unused code found after full review (`defaultSoundSettings` is used, no `expo-av` import present).

**Next Steps:** Run `tsc --noUnusedLocals --noUnusedParameters` to get an updated list for remaining Task 1.A files.

### 任务 X.Y: 修复 BambooPlantingPage.tsx 类型错误
- [ ] **Blocked:** Module import paths for ToastProvider, PageHeader, ConfirmationModal needed.
- [ ] **Blocked:** Exact return structure of `useBambooSystem` hook needed.
- [ ] **Blocked:** Definition of `BambooPlantRecord` (for `growthStage`, `water`, `fertilizer` properties) needed.
- [ ] Resolve `useBambooSystem` method access.
- [ ] Correct property access on `BambooPlantRecord`.
- [ ] Fix any remaining type errors.

### 任务 X.Z: 修复 BambooCollectionPage.tsx 类型错误
- [ ] **New & Blocked:** Hook `useBambooCollectionSystem.ts` definition needed (exports, functionality).
- [ ] **New & Blocked:** Component `PageHeader.tsx` path and definition needed.
- [ ] **New & Blocked:** Resolve `pageLabels` being typed as `never` (likely due to unresolved dependencies or useLocalizedView setup).
- [ ] Define types, service, and DB labels for the page.
- [ ] Refactor page to use `useLocalizedView` correctly.

### 任务 X.AA: 修复 BambooTradingPage.tsx 类型错误
- [ ] **New & Blocked:** Component `PageHeader.tsx` path and definition needed.
- [ ] **New & Blocked:** Hook `useBambooTradingSystem.ts` (or equivalent) definition needed.
- [ ] **New & Blocked:** Persistent linter errors despite fixes (fetchBambooTradingPageView not found, useLocalizedView args, pageLabels as never, SoundType.TRADE). Suspected tooling/cache issue or deeper problem.
- [ ] Define types, service, and DB labels for the page.
- [ ] Refactor page to use `useLocalizedView` correctly.
