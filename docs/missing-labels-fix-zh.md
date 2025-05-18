# 缺失标签修复

## 问题描述

应用程序在浏览器控制台中遇到以下错误：

```
CRITICAL: No labels found for essential scope components (lang: en or fallback 'en'). Unable to build labels bundle. localizedContentService.ts:35:13

CRITICAL: No labels found for essential scope resourceShortage (lang: en or fallback 'en'). Unable to build labels bundle. localizedContentService.ts:35:13
```

这些错误发生是因为应用程序试图访问两个作用域的本地化标签：
1. `components` 作用域 - 用于整个应用程序中的通用UI组件
2. `resourceShortage` 作用域 - 用于资源短缺提示组件

然而，这些标签在数据库中的英语语言版本中找不到。

## 根本原因

在 `localizedContentService.ts` 文件中，`getScopedLabels` 函数尝试从数据库中获取特定作用域和语言的标签：

```typescript
async function getScopedLabels<TLabelsBundle>(
  baseScopeKey: string,
  lang: Language
): Promise<TLabelsBundle | undefined> {
  let labelRecords = await db.uiLabels
    .where('languageCode').equals(lang)
    .and((record: UILabelRecord) => record.scopeKey.startsWith(baseScopeKey))
    .toArray();

  if (!labelRecords.length && lang !== 'en') {
    console.warn(`No '${lang}' labels for scope ${baseScopeKey}, falling back to 'en'`);
    labelRecords = await db.uiLabels
      .where('languageCode').equals('en')
      .and((record: UILabelRecord) => record.scopeKey.startsWith(baseScopeKey))
      .toArray();
  }

  if (!labelRecords.length) {
    const errorMessage = `CRITICAL: No labels found for essential scope ${baseScopeKey} (lang: ${lang} or fallback 'en'). Unable to build labels bundle.`;
    console.error(errorMessage);
    return undefined;
  }
  return buildLabelsObject<TLabelsBundle>(labelRecords, baseScopeKey);
}
```

问题在于数据库中不包含 `components` 和 `resourceShortage` 作用域的任何标签，导致函数记录严重错误并返回 `undefined`。

## 解决方案

解决方案是在应用程序初始化期间将两个作用域的缺失标签添加到数据库中：

1. 创建了一个新文件 `src/db-missing-labels.ts`，其中包含添加缺失标签的函数：
   - `addComponentsLabels()` - 添加通用UI组件的标签
   - `addResourceShortageLabels()` - 添加资源短缺提示的标签
   - `addMissingLabels()` - 调用这两个函数添加所有缺失的标签

2. 更新 `App.tsx` 以在初始化期间导入并调用 `addMissingLabels()` 函数：
   ```typescript
   // 添加组件和资源短缺的缺失标签
   await addMissingLabels();
   ```

## 实现细节

### 1. 创建新文件：src/db-missing-labels.ts

此文件包含向数据库添加缺失标签的函数：

- `addComponentsLabels()` - 添加按钮、对话框、表单和通知等通用UI组件的标签
- `addResourceShortageLabels()` - 添加资源短缺提示的标签，包括标题、描述和按钮文本
- `addMissingLabels()` - 调用这两个函数添加所有缺失的标签

### 2. 更新 App.tsx

- 添加新函数的导入：
  ```typescript
  import { addMissingLabels } from '@/db-missing-labels';
  ```

- 在初始化期间添加对该函数的调用：
  ```typescript
  // 添加组件和资源短缺的缺失标签
  await addMissingLabels();
  ```

## 修复的好处

- **修复严重错误**：应用程序不再显示有关缺失标签的严重错误
- **改善用户体验**：组件现在显示正确的本地化文本，而不是回退或空值
- **更好的国际化**：这些组件同时支持英语和中文
- **可维护的解决方案**：标签以结构化的方式添加，可以扩展到其他作用域

## 测试

实施这些更改后，浏览器控制台中不应再出现这些错误。使用这些标签的组件现在应该显示正确的本地化文本。

## 未来考虑

1. **全面的标签管理**：考虑实施更全面的标签管理系统，确保所有必需的标签都存在
2. **标签验证**：添加验证以在开发或构建时检查缺失的标签
3. **自动标签生成**：考虑从中央真实来源自动生成标签文件
4. **标签文档**：记录每个组件所需的所有标签，使开发人员更容易添加新组件
