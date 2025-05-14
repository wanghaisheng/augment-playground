# PandaHabit 字体变量系统

本文档定义了PandaHabit应用中使用的字体变量系统，包括各种字体的用途、特点和适用场景。这些变量应在整个应用中一致使用，以确保视觉一致性和简化维护。

## 1. 字体导入

PandaHabit应用导入了多种西文和中文字体，以支持不同的设计需求和多语言环境。

### 1.1 西文字体

```css
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Fredoka+One&family=Nunito+Sans:wght@300;400;600;700&family=Caveat:wght@400;600&display=swap');
```

| 字体名称 | 风格 | 用途 |
|---------|------|------|
| Quicksand | 现代无衬线 | 清新简约的界面元素 |
| Playfair Display | 优雅衬线 | 标题和强调文本 |
| Fredoka One | 圆润可爱 | 游戏风格元素 |
| Nunito Sans | 现代无衬线 | 正文和界面元素 |
| Caveat | 手写风格 | 装饰性文本 |

### 1.2 中文基础字体

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap');
```

| 字体名称 | 风格 | 用途 |
|---------|------|------|
| Noto Serif SC | 中文衬线 | 正式内容和强调文本 |
| Noto Sans SC | 中文无衬线 | 界面元素和正文 |

### 1.3 中文装饰字体

```css
@import url('https://fonts.font.im/css?family=ZCOOL+QingKe+HuangYou'); /* 站酷高端黑 - 现代风格 */
@import url('https://fonts.font.im/css?family=ZCOOL+KuaiLe'); /* 站酷快乐体 - 趣味风格 */
@import url('https://fonts.font.im/css?family=ZCOOL+XiaoWei'); /* 站酷文艺体 - 文艺风格 */
@import url('https://fonts.font.im/css?family=Ma+Shan+Zheng'); /* 马善政毛笔体 - 书法风格 */
@import url('https://fonts.font.im/css?family=Long+Cang'); /* 龙藏体 - 书法风格 */
@import url('https://fonts.font.im/css?family=Liu+Jian+Mao+Cao'); /* 刘建毛草 - 草书风格 */
@import url('https://fonts.font.im/css?family=Zhi+Mang+Xing'); /* 智慢行 - 手写风格 */
@import url('https://fonts.font.im/css?family=Noto+Serif+TC'); /* 思源宋体繁体 - 传统风格 */
```

| 字体名称 | 风格 | 用途 |
|---------|------|------|
| ZCOOL QingKe HuangYou | 现代风格 | 现代界面元素 |
| ZCOOL KuaiLe | 趣味风格 | 活泼有趣的元素 |
| ZCOOL XiaoWei | 文艺风格 | 装饰性文本 |
| Ma Shan Zheng | 书法风格 | 主标题和强调 |
| Long Cang | 书法风格 | 流畅书法文本 |
| Liu Jian Mao Cao | 草书风格 | 艺术性文本 |
| Zhi Mang Xing | 手写风格 | 随性手写文本 |
| Noto Serif TC | 传统风格 | 繁体中文内容 |

## 2. 字体变量

PandaHabit应用定义了多种字体变量，以满足不同的设计需求。

### 2.1 主要字体

| 变量名 | 值 | 描述 | 用途 |
|--------|-----|------|------|
| `--font-title` | `'Ma Shan Zheng', 'Playfair Display', serif` | 主标题字体 - 书法风格 | 页面主标题、重要标题 |
| `--font-main` | `'Noto Sans SC', 'Nunito Sans', sans-serif` | 正文字体 - 清晰易读 | 正文内容、界面元素 |
| `--font-decorative` | `'ZCOOL XiaoWei', 'Caveat', cursive` | 装饰字体 - 文艺风格 | 装饰性文本、特殊强调 |
| `--font-accent` | `'Noto Serif SC', 'Playfair Display', serif` | 强调字体 - 优雅衬线 | 副标题、强调文本 |
| `--font-modern` | `'ZCOOL QingKe HuangYou', 'Nunito Sans', sans-serif` | 现代字体 - 简约现代 | 现代界面元素、按钮 |
| `--font-game` | `'Fredoka One', cursive` | 游戏风格字体 - 圆润可爱 | 游戏元素、活泼内容 |
| `--font-fun` | `'ZCOOL KuaiLe', cursive` | 趣味字体 - 活泼有趣 | 趣味内容、轻松元素 |

### 2.2 特殊字体

| 变量名 | 值 | 描述 | 用途 |
|--------|-----|------|------|
| `--font-calligraphy` | `'Long Cang', 'Liu Jian Mao Cao', cursive` | 书法字体 - 流畅书法 | 艺术性文本、引用 |
| `--font-handwriting` | `'Zhi Mang Xing', 'Caveat', cursive` | 手写字体 - 随性手写 | 个性化内容、笔记 |
| `--font-traditional` | `'Noto Serif TC', 'Noto Serif SC', serif` | 传统字体 - 古典风格 | 传统内容、正式文本 |
| `--font-elegant` | `'Playfair Display', 'Noto Serif SC', serif` | 优雅字体 - 高贵典雅 | 高端内容、VIP元素 |
| `--font-modern-sans` | `'Quicksand', 'Noto Sans SC', sans-serif` | 现代无衬线 - 简约清新 | 现代界面、简约元素 |

### 2.3 功能字体

| 变量名 | 值 | 描述 | 用途 |
|--------|-----|------|------|
| `--font-heading` | `var(--font-title)` | 页面标题 | 页面主标题 |
| `--font-subheading` | `var(--font-accent)` | 页面副标题 | 页面副标题、章节标题 |
| `--font-body` | `var(--font-main)` | 正文内容 | 正文文本、描述 |
| `--font-button` | `var(--font-modern)` | 按钮文字 | 按钮、交互元素 |
| `--font-label` | `var(--font-main)` | 标签文字 | 表单标签、小标题 |
| `--font-quote` | `var(--font-calligraphy)` | 引用文字 | 引用、名言 |
| `--font-special` | `var(--font-decorative)` | 特殊文字 | 特殊强调、装饰 |
| `--font-vip` | `var(--font-elegant)` | VIP相关文字 | VIP内容、高级功能 |

## 3. 字体使用指南

### 3.1 字体选择原则

1. **可读性优先**：正文内容应使用清晰易读的字体，如`--font-main`或`--font-body`。
2. **层次分明**：使用不同字体变量创建视觉层次，如标题使用`--font-heading`，副标题使用`--font-subheading`。
3. **一致性**：同类元素应使用相同的字体变量，保持视觉一致性。
4. **特殊用途**：装饰性字体如`--font-decorative`、`--font-calligraphy`应仅用于特殊场合，不适合长文本。
5. **响应式考虑**：某些装饰性字体在小屏幕上可能不易读，应考虑在移动设备上使用更简洁的替代字体。

### 3.2 字体大小指南

| 元素 | 推荐字体变量 | 推荐字体大小 |
|------|------------|------------|
| 页面主标题 | `--font-heading` | 1.8rem - 2.2rem |
| 页面副标题 | `--font-subheading` | 1.4rem - 1.6rem |
| 卡片标题 | `--font-subheading` | 1.1rem - 1.3rem |
| 正文内容 | `--font-body` | 0.9rem - 1rem |
| 按钮文字 | `--font-button` | 0.9rem - 1.1rem |
| 标签文字 | `--font-label` | 0.8rem - 0.9rem |
| 辅助文字 | `--font-body` | 0.8rem |
| 特殊强调 | `--font-special` | 根据上下文调整 |

### 3.3 多语言支持

- 所有字体变量都包含中文和西文字体，以支持多语言环境。
- 中文内容优先使用中文字体，西文内容会自动回退到西文字体。
- 确保所有文本元素使用字体变量而非硬编码字体，以便统一管理多语言字体。

### 3.4 性能考虑

- 导入多种字体会增加页面加载时间，应谨慎使用。
- 考虑使用字体子集或延迟加载非关键字体。
- 在实际使用中，可以根据性能需求调整导入的字体数量。

## 4. 示例用法

```css
/* 页面标题 */
.page-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--text-primary);
}

/* 页面副标题 */
.page-subtitle {
  font-family: var(--font-subheading);
  font-size: 1.5rem;
  color: var(--text-secondary);
}

/* 卡片标题 */
.card-title {
  font-family: var(--font-subheading);
  font-size: 1.2rem;
  color: var(--text-primary);
}

/* 正文内容 */
.content-text {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.6;
}

/* 按钮文字 */
.button {
  font-family: var(--font-button);
  font-size: 1rem;
  font-weight: 600;
}

/* VIP元素 */
.vip-element {
  font-family: var(--font-vip);
  color: var(--imperial-gold);
}

/* 引用文字 */
.quote {
  font-family: var(--font-quote);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--ink-dark);
}
```
