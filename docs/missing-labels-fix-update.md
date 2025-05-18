# 缺失标签修复更新

## 问题描述

在之前的修复中，我们尝试添加 `components` 和 `resourceShortage` 作用域的标签，但遇到了以下错误：

```
Error adding components labels: 
Object { _e: Error, name: "BulkError", failures: (36) […], failuresByPos: (36) […], message: "uiLabels.bulkAdd(): 36 of 36 operations failed. Errors: ConstraintError: A mutation operation in the transaction failed because a constraint was not satisfied.", _promise: {…}, stack: "", … }
```

此外，我们还发现了其他缺失的标签作用域：

```
CRITICAL: No labels found for essential scope userTitle (lang: zh or fallback 'en'). Unable to build labels bundle.
CRITICAL: No labels found for essential scope userTitleSelector (lang: zh or fallback 'en'). Unable to build labels bundle.
CRITICAL: No labels found for essential scope vipValue (lang: zh or fallback 'en'). Unable to build labels bundle.
CRITICAL: No labels found for essential scope bambooCollectionPanel (lang: zh or fallback 'en'). Unable to build labels bundle.
```

## 根本原因

1. **约束错误**：在数据库模式中，`uiLabels` 表有一个唯一约束：`&[scopeKey+labelKey+languageCode]`，这意味着 `scopeKey`、`labelKey` 和 `languageCode` 的组合必须是唯一的。当我们使用 `bulkAdd` 尝试添加可能已经存在的标签时，会引发约束错误。

2. **缺失的标签作用域**：除了 `components` 和 `resourceShortage` 作用域外，我们还需要添加 `userTitle`、`userTitleSelector`、`vipValue` 和 `bambooCollectionPanel` 作用域的标签。

## 解决方案

1. **使用 `bulkPut` 而不是 `bulkAdd`**：
   - 修改 `db-missing-labels.ts` 文件中的代码，将 `bulkAdd` 替换为 `bulkPut`
   - `bulkPut` 会更新已存在的记录，而不是尝试添加重复记录，从而避免约束错误

2. **添加其他缺失的标签作用域**：
   - 添加了 `addUserTitleLabels()` 函数，用于添加用户称号相关标签
   - 添加了 `addUserTitleSelectorLabels()` 函数，用于添加用户称号选择器相关标签
   - 添加了 `addVipValueLabels()` 函数，用于添加VIP价值相关标签
   - 添加了 `addBambooCollectionPanelLabels()` 函数，用于添加竹子收集面板相关标签
   - 更新了 `addMissingLabels()` 函数，调用所有这些函数

## 实现细节

### 1. 修改 bulkAdd 为 bulkPut

将 `db-missing-labels.ts` 文件中的 `bulkAdd` 调用替换为 `bulkPut`：

```typescript
// 原代码
try {
  await db.uiLabels.bulkAdd(labels);
  console.log("Successfully added components labels.");
} catch (e) {
  console.error("Error adding components labels:", e);
}

// 修改后的代码
try {
  // 使用 bulkPut 而不是 bulkAdd，这样如果标签已经存在，它会被更新而不是引发错误
  await db.uiLabels.bulkPut(labels);
  console.log("Successfully added components labels.");
} catch (e) {
  console.error("Error adding components labels:", e);
}
```

### 2. 添加其他缺失的标签作用域

添加了以下函数来处理其他缺失的标签作用域：

- `addUserTitleLabels()`：添加用户称号相关标签
- `addUserTitleSelectorLabels()`：添加用户称号选择器相关标签
- `addVipValueLabels()`：添加VIP价值相关标签
- `addBambooCollectionPanelLabels()`：添加竹子收集面板相关标签

并更新了 `addMissingLabels()` 函数，调用所有这些函数：

```typescript
export async function addMissingLabels(): Promise<void> {
  try {
    await addComponentsLabels();
    await addResourceShortageLabels();
    await addUserTitleLabels();
    await addUserTitleSelectorLabels();
    await addVipValueLabels();
    await addBambooCollectionPanelLabels();
    console.log("Successfully added all missing labels.");
  } catch (e) {
    console.error("Error adding missing labels:", e);
  }
}
```

## 修复的好处

- **解决约束错误**：使用 `bulkPut` 而不是 `bulkAdd`，避免了唯一约束错误
- **添加所有缺失的标签**：添加了所有缺失的标签作用域，包括 `userTitle`、`userTitleSelector`、`vipValue` 和 `bambooCollectionPanel`
- **改善用户体验**：确保所有组件都能显示正确的本地化文本
- **支持多语言**：为所有标签提供了英语和中文版本

## 测试

实施这些更改后，应用程序不应再显示有关缺失标签的错误消息。所有组件应该能够正确显示本地化文本。

## 未来考虑

1. **标签验证工具**：开发一个工具，可以扫描代码库并检测所有使用的标签作用域，然后验证这些作用域是否在数据库中有对应的标签
2. **标签管理界面**：创建一个管理界面，允许开发人员和内容管理员查看、添加和编辑标签
3. **自动化标签导入**：实现从外部源（如CSV或JSON文件）自动导入标签的功能
4. **标签版本控制**：实现标签的版本控制，以便在需要时回滚更改
