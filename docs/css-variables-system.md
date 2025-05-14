# PandaHabit CSS变量系统

本文档定义了PandaHabit应用中使用的CSS变量系统，包括颜色、间距、边框半径等设计元素。这些变量应在整个应用中一致使用，以确保视觉一致性和简化维护。

## 1. 颜色变量

### 1.1 主色调

| 变量名 | 值 | 描述 | 用途 |
|--------|-----|------|------|
| `--royal-jade` | `#1A5F4A` | 皇家翡翠绿 | 主要品牌颜色，用于主要UI元素和强调 |
| `--bamboo-green` | `#88B04B` | 富贵竹绿 | 次要品牌颜色，用于辅助UI元素 |
| `--snow-white` | `#F7F9F9` | 瑞雪白 | 背景色和文本背景 |
| `--cinnabar-red` | `#D73E35` | 朱砂红 | 警告和错误状态 |

### 1.2 强调色

| 变量名 | 值 | 描述 | 用途 |
|--------|-----|------|------|
| `--imperial-gold` | `#D4AF37` | 华贵金 | VIP元素、高级功能和奖励 |
| `--imperial-blue` | `#1A6DB0` | 青花蓝 | 信息提示和特殊功能 |
| `--peony-pink` | `#F8C8DC` | 牡丹粉 | 柔和强调和装饰元素 |
| `--rosewood-purple` | `#5D3954` | 紫檀紫 | 高级装饰和特殊状态 |

### 1.3 功能色

| 变量名 | 值 | 描述 | 用途 |
|--------|-----|------|------|
| `--ruyi-green` | `#2E8B57` | 如意绿 | 成功状态和确认操作 |
| `--amber-yellow` | `#FFA500` | 琥珀黄 | 警告和注意状态 |
| `--ink-gray` | `#8A8D91` | 墨灰 | 禁用状态和次要文本 |

### 1.4 文本色

| 变量名 | 值 | 描述 | 用途 |
|--------|-----|------|------|
| `--deep-night` | `#1F2937` | 深夜黑 | 主要文本 |
| `--ink-dark` | `#374151` | 墨黑 | 次要文本 |
| `--ink-light` | `#6B7280` | 淡墨 | 辅助文本 |
| `--text-on-accent` | `#FFFFFF` | 纯白 | 强调色上的文本 |

### 1.5 背景色

| 变量名 | 值 | 描述 | 用途 |
|--------|-----|------|------|
| `--background-main` | `#F7F9F9` | 主背景 | 页面主背景 |
| `--background-panel` | `#FFFFFF` | 面板背景 | 卡片和面板背景 |
| `--background-panel-light` | `#F3F4F6` | 浅面板背景 | 次要面板和悬停状态 |
| `--background-panel-dark` | `#E5E7EB` | 深面板背景 | 按下状态和分隔元素 |

### 1.6 边框色

| 变量名 | 值 | 描述 | 用途 |
|--------|-----|------|------|
| `--border-color` | `#D1D5DB` | 标准边框 | 大多数UI元素的边框 |
| `--border-light` | `#E5E7EB` | 浅边框 | 次要分隔和装饰边框 |
| `--border-focus` | `#1A5F4A` | 焦点边框 | 输入框和交互元素的焦点状态 |

### 1.7 渐变色

| 变量名 | 值 | 描述 | 用途 |
|--------|-----|------|------|
| `--jade-gradient` | `linear-gradient(145deg, #1A5F4A, #88B04B)` | 翡翠渐变 | 主要按钮和强调元素 |
| `--gold-gradient` | `linear-gradient(145deg, #D4AF37, #FFA000)` | 黄金渐变 | VIP元素和高级功能 |
| `--silk-gradient` | `linear-gradient(145deg, #F8C8DC, #F9E2D2)` | 丝绸渐变 | 柔和背景和装饰元素 |

## 2. 间距变量

| 变量名 | 值 | 描述 |
|--------|-----|------|
| `--spacing-xs` | `4px` | 超小间距 |
| `--spacing-sm` | `8px` | 小间距 |
| `--spacing-md` | `16px` | 中间距 |
| `--spacing-lg` | `24px` | 大间距 |
| `--spacing-xl` | `32px` | 超大间距 |
| `--spacing-xxl` | `48px` | 特大间距 |

## 3. 边框半径变量

| 变量名 | 值 | 描述 |
|--------|-----|------|
| `--radius-sm` | `4px` | 小圆角 |
| `--radius-md` | `8px` | 中圆角 |
| `--radius-lg` | `12px` | 大圆角 |
| `--radius-xl` | `16px` | 超大圆角 |
| `--radius-round` | `50%` | 圆形 |
| `--radius-full` | `9999px` | 胶囊形 |

## 4. 阴影变量

| 变量名 | 值 | 描述 |
|--------|-----|------|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.05)` | 小阴影 |
| `--shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.1)` | 中阴影 |
| `--shadow-lg` | `0 10px 15px rgba(0, 0, 0, 0.1)` | 大阴影 |
| `--shadow-xl` | `0 20px 25px rgba(0, 0, 0, 0.15)` | 超大阴影 |
| `--shadow-inner` | `inset 0 2px 4px rgba(0, 0, 0, 0.05)` | 内阴影 |
| `--shadow-color` | `rgba(0, 0, 0, 0.1)` | 阴影颜色 |

## 5. 字体变量

| 变量名 | 值 | 描述 |
|--------|-----|------|
| `--font-title` | `"方正清刻本悦宋", "Playfair Display", serif` | 主标题字体 |
| `--font-main` | `"思源宋体", "Nunito Sans", sans-serif` | 正文字体 |
| `--font-decorative` | `"庞门正道行书", "Caveat", cursive` | 装饰字体 |
| `--font-accent` | `"方正清刻本悦宋", "Playfair Display", serif` | 强调字体 |
| `--font-modern` | `"思源宋体", "Nunito Sans", sans-serif` | 现代字体 |

## 6. 动画变量

| 变量名 | 值 | 描述 |
|--------|-----|------|
| `--timing-quick` | `0.15s` | 快速过渡 |
| `--timing-medium` | `0.3s` | 中速过渡 |
| `--timing-slow` | `0.5s` | 慢速过渡 |
| `--easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | 标准缓动 |
| `--easing-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | 减速缓动 |
| `--easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | 加速缓动 |

## 7. 使用指南

1. 始终使用变量而不是硬编码值
2. 为新组件选择适当的变量
3. 如需新变量，请在此文档中添加并更新CSS文件
4. 确保变量名称清晰描述其用途
5. 遵循命名约定：`--category-descriptor`
