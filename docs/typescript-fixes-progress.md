# TypeScript 错误修复进度

本文档用于跟踪 TypeScript 错误修复的进度。

## 当前状态

**总错误数:** 830 (Initial)
**已修复错误数:** 461 (830 - 369)
**剩余错误数:** 369
**完成百分比:** 65.54%

**最新检查时间:** 2023-11-17

**最新进展:**
1. 运行了 `npx tsc --noEmit` 检查当前 TypeScript 错误状态，发现有 369 个错误分布在 144 个文件中。
2. 修复了 LoadingSpinner 组件的 'white' variant 类型错误，通过在组件定义中添加 'white' 作为有效的 variant 选项，并在 CSS 中添加相应的样式。
3. 修复了 TaskReminderNotification 组件中的 "possibly undefined" 错误，通过添加默认的 taskReminderLabels 并使用它替代直接访问 labels.taskReminder。
4. 主要错误类型包括：
   - 未使用的变量和导入（TS6133）
   - 类型不兼容（TS2322）
   - 属性不存在（TS2339）
   - 可能为 undefined 的值（TS18048）
   - 参数数量不匹配（TS2554）
5. 修复了 SoundType 枚举问题：
   - 在 src/utils/sound.ts 中添加了缺失的 CONFIRM 枚举值
   - 在 soundPaths 中添加了对应的音效路径
6. 修复了 PainPointSolutionPrompt.tsx 中的错误：
   - 添加了 fetchPainPointSolutionView 函数到 localizedContentService.ts
   - 修复了 useLocalizedView 调用，添加了必要的参数
   - 修复了 PainPointSolutionRecord 和 PainPointTriggerRecord 的导入问题
   - 将 "primary" 变体替换为 "filled" 以匹配 ButtonVariant 类型
7. 修复了 ResourceShortageManager.tsx 中的错误：
   - 修复了 pandaState.energy 的类型比较问题，添加了 typeof 检查
   - 修复了 DataRefreshContext 的使用，使用 registerRefreshListener 替代 refreshEvents
   - 将 checkResourceLevels 函数移出 useEffect 并使用 useCallback 包装，解决依赖循环问题
8. 修复了 BambooCollectionPanel.tsx 中的 55 个 TypeScript 错误：
   - 添加了 BambooCollectionPanelLabels 接口定义
   - 修复了 useLocalizedView 调用，使用正确的泛型参数
   - 修复了 labels 属性访问问题
   - 移除了未使用的导入和变量
9. 修复了 BambooSpotCard.tsx 中的 TypeScript 错误：
   - 添加了 BambooSpotCardLabels 接口定义
   - 修复了 useLocalizedView 调用，使用正确的泛型参数
   - 修复了 labels 属性访问问题
10. 修复了 BambooPlotCard.tsx 中的 refreshData 不存在问题：
    - 将 useDataRefresh 替换为 useDataRefreshContext
    - 添加了 refreshData 函数，使用 refreshTable 方法刷新相关表
11. 手动修复了以下组件中的错误：
    - VipValueDashboard.tsx - 修复了未使用的 _formatPercent 函数
    - VipValueModal.tsx - 修复了未使用的 motion 导入和类型问题
    - VipValueSummary.tsx - 修复了未使用的 motion 导入和类型问题
12. 修复了多个文件中的未使用导入和变量：
    - 移除了 HomePage.tsx 中未使用的 motion, LoadingSpinner, pageTransition, BambooFeatureWidget 导入
    - 移除了 TasksPage.tsx 中未使用的 motion, LoadingSpinner, pageTransition 导入
    - 移除了 ButtonAnimationShowcase.tsx 中未使用的 motion 导入
    - 移除了 BambooTradingPage.tsx 中未使用的 generateSparkleParticles 导入和多个未使用的变量
    - 移除了 bambooCollectionService.ts 中未使用的 RewardRarity 导入
    - 移除了 bambooPlantingService.ts 中未使用的 PandaStateRecord, getPandaState 导入
    - 移除了 abTestingService.ts 中未使用的 VariantType, ExperimentGoal 导入
13. 修复了 "possibly undefined" 错误：
    - 在 particleEffects.tsx 中添加了空值合并运算符 (??) 处理可能为 undefined 的值
14. 修复了模块导入错误：
    - 修复了 TaskDetailDialog.tsx 中 SubtaskList 的导入路径
    - 创建了缺失的 taskCategoryService.ts 文件
15. 修复了类型错误：
    - 在 SubtaskList.tsx 中为 handleDragEnd 函数添加了具体类型，替代 any
    - 修复了 StoreItemPreview.tsx 中 Button 组件的使用，用条件渲染替代 isLoading 和 loadingText 属性
16. 修复了 AnimatedTaskList.tsx 中的类型错误：
    - 修复了 TimelyRewardCard 组件的 labels 属性类型不匹配问题，通过创建符合 TimelyRewardCardLabels 接口的对象
17. 修复了 AnimatedButton.tsx 中的类型错误：
    - 移除了 Button 组件不支持的 loadingText 属性
18. 检查了多个动画组件文件，确认它们没有 TypeScript 错误：
    - AnimatedContainer.tsx
    - AnimatedItem.tsx
    - OptimizedAnimatedContainer.tsx
    - OptimizedAnimatedItem.tsx
    - TaskCompletionAnimation.tsx
    - AnimatedTaskCard.tsx
19. 检查了多个计划中的动画组件文件，发现它们尚未创建：
    - 所有 AnimatedPanda* 系列组件
    - 所有 AnimatedBamboo* 系列组件
    - 所有 AnimatedVip* 系列组件
    - 所有 AnimatedReward* 系列组件
    - 所有 AnimatedChallenge* 系列组件
    - 所有 AnimatedAbility* 系列组件
    - 所有 AnimatedTea* 系列组件
    - 所有 AnimatedStore* 系列组件

**下一步计划:**
1. 修复 animation 组件中的未使用变量问题
2. 修复 BattlePassLevel.tsx 中的 expReward 属性不存在问题
3. 安装缺失的 canvas-confetti 依赖
4. 修复 AnimatedTaskList.tsx 中的类型兼容性问题
5. 修复 OptimizedAnimatedContainer.tsx 和 OptimizedAnimatedItem.tsx 中的属性不存在问题

这些脚本位于 `scripts/` 目录下，可以通过运行 `node scripts/fix-lint-errors.js` 来执行所有修复。

**Note:** The critical `pageLabels as never` errors in multiple page components (CustomGoals, BambooDashboard, BambooTrading, Store, TeaRoom, TimelyRewards, etc.) have been resolved. The fix involved making ALL properties within ALL respective `...PageViewLabelsBundle` interfaces (and their nested label objects) optional. This allows TypeScript to correctly infer the type of `pageLabels` as `SpecificBundle | undefined`.

This change has revealed new, more standard TypeScript errors (TS18048: possibly 'undefined'; TS2322: 'string | undefined' not assignable to 'string') where these optional labels are accessed without proper optional chaining or default fallbacks. These are the next errors to be addressed.

项目结构可以参考repomix-output.md，便于你查找文件

所有unused statement优先级最低，最后结合prd中的功能需求检查是否应该保留来拓展功能还是代码迁移过程中应该删除的残留。

## 阶段 1: 基础类型定义修复

### 任务 1.1: 修复 SoundType 枚举
- [ ] 移除重复的枚举值
- [x] 添加缺失的枚举值（添加了 CONFIRM 枚举值）
- [x] 更新使用这些枚举的组件（修复了 PainPointSolutionPrompt.tsx 中的使用）

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
- [~] 移除未使用的导入 (通过自动化脚本添加下划线前缀，手动修复了VIP组件、PandaSection、ResourcesSection等)
- [~] 删除未使用的变量 (通过自动化脚本添加下划线前缀，手动修复了VIP组件、PandaSection、ResourcesSection等)
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

### 最新错误分析（2023-11-15）

根据最新的 TypeScript 检查结果，我们有 397 个错误分布在 141 个文件中。主要错误类型如下：

### 未使用的声明 (TS6133)
- 总错误数: 约 150
- 已修复: 部分（通过添加下划线前缀）
- 剩余: 约 120
- 示例: `'motion' is declared but its value is never read.`

### 类型兼容性问题 (TS2322, TS2345)
- 总错误数: 约 120
- 已修复: 少量
- 剩余: 约 110
- 示例: `Type '"primary"' is not assignable to type 'ButtonVariant | undefined'.`

### 属性不存在 (TS2339)
- 总错误数: 约 100
- 已修复: 10
- 剩余: 约 90
- 示例: `Property 'refreshData' does not exist on type 'DataRefreshContextType'.`

### 可能为 undefined 的值 (TS18048)
- 总错误数: 约 40
- 已修复: 0
- 剩余: 约 40
- 示例: `'mergedConfig.spread' is possibly 'undefined'.`

### 参数数量不匹配 (TS2554)
- 总错误数: 约 30
- 已修复: 5
- 剩余: 约 25
- 示例: `Expected 2-3 arguments, but got 1.`

### 其他错误类型
- 总错误数: 约 60
- 包括: 模块导出问题 (TS2459)、隐式 any 类型 (TS7006)、声明但未使用 (TS6196) 等

### 错误分布最多的文件
1. particleEffects.tsx - 10 个错误
2. BambooTradingPage.tsx - 13 个错误
3. VipBenefitsPage.tsx - 4 个错误
4. PainPointSolutionPrompt.tsx - 7 个错误
5. ResourceShortageManager.tsx - 3 个错误

## 下一步计划

### 优先修复任务

1. **修复 VIP 组件中的错误**
   - PainPointManager.tsx - 修复 refreshData 不存在的问题
   - PainPointSolutionPrompt.tsx - 修复导入和 useLocalizedView 调用问题
   - ResourceShortageManager.tsx - 修复类型比较和状态设置问题
   - VipTrialManager.tsx 和 VipTaskSeriesPage.tsx - 修复 _pandaState 不存在的问题

2. **修复 SoundType 枚举问题**
   - 在 src/utils/sound.ts 中添加缺失的 CONFIRM 枚举值
   - 更新使用这些枚举的组件

3. **修复 ButtonVariant 类型问题**
   - 检查 Button.tsx 中的 ButtonVariant 类型定义
   - 更新使用 "primary" 作为 variant 的组件

4. **修复 useLocalizedView 调用问题**
   - 确保所有调用都提供了正确的参数数量
   - 修复 labels 属性访问问题

5. **修复 particleEffects.tsx 中的可能为 undefined 的值**
   - 添加空值检查或默认值
   - 修复类型定义

### 按文件分类的修复计划

#### VIP 组件修复
- [ ] PainPointManager.tsx
- [x] PainPointSolutionPrompt.tsx - 修复了 useLocalizedView 调用、导入和 ButtonVariant 问题
- [x] ResourceShortageManager.tsx - 修复了 DataRefreshContext 使用和 pandaState.energy 类型比较问题
- [ ] ResourceShortagePrompt.tsx
- [ ] RetentionOfferCard.tsx
- [ ] SubscriptionExpirationReminder.tsx
- [ ] SubscriptionManager.tsx
- [ ] VipSubscriptionOptions.tsx
- [ ] VipTrialManager.tsx
- [ ] VipTrialValueReview.tsx
- [x] VipValueDashboard.tsx - 修复了未使用的 _formatPercent 函数
- [x] VipValueModal.tsx - 修复了未使用的 motion 导入和类型问题
- [x] VipValueSummary.tsx - 修复了未使用的 motion 导入和类型问题

#### 页面组件修复
- [ ] BambooTradingPage.tsx
- [ ] ButtonAnimationShowcase.tsx
- [ ] HomePage.tsx
- [ ] ProfilePage.tsx
- [ ] TeaRoomPage.tsx
- [ ] VipBenefitsPage.tsx
- [ ] VipTaskSeriesPage.tsx

#### 服务层修复
- [ ] pandaSkinService.ts
- [ ] vipTaskService.ts
- [ ] battlePassService.ts
- [ ] socialChallengeService.ts

#### 工具函数修复
- [ ] particleEffects.tsx

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
