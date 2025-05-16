# 水墨画风格图标设计指南

## 设计理念

水墨画风格图标系统旨在为PandaHabit应用提供具有中国传统艺术特色的视觉元素，增强应用的文化氛围和美学价值。这些图标应当体现水墨画的特点：留白、笔触变化、墨色渐变和自然流动感。

## 设计原则

1. **简约而富有表现力**：保持图标设计简洁明了，同时通过笔触变化表达丰富内涵
2. **墨色渐变**：利用墨色的浓淡变化创造层次感和空间感
3. **留白艺术**：合理运用留白，让图标"呼吸"
4. **自然流动感**：笔触应当自然流畅，避免机械和生硬的线条
5. **中国传统元素**：适当融入传统中国元素，如竹、梅、兰、菊等

## 技术规范

### 尺寸规范

- 基础尺寸：24x24px, 36x36px, 48x48px
- 线条粗细：1.5-2.5px（视图标大小而定）
- 内边距：至少2px，确保图标在各种背景下都清晰可见

### 颜色规范

主要使用以下颜色：

- 深墨色：#1A1A1A（主要线条）
- 中墨色：#333333（次要线条）
- 淡墨色：#666666（填充和装饰）
- 留白：透明或#FFFFFF
- 点缀色：
  - 翡翠绿：#1A5F4A（强调和交互元素）
  - 朱砂红：#D73E35（警告和错误状态）
  - 琥珀黄：#FFA500（提示和注意状态）

### 文件格式

- 主要格式：SVG（可缩放矢量图形）
- 命名规范：`ink-[category]-[name].svg`
  - 例如：`ink-action-add.svg`, `ink-navigation-home.svg`

## 图标分类

### 1. 导航图标

- 首页 (ink-navigation-home)
- 任务 (ink-navigation-tasks)
- 挑战 (ink-navigation-challenges)
- 商店 (ink-navigation-store)
- 设置 (ink-navigation-settings)
- VIP (ink-navigation-vip)
- 通行证 (ink-navigation-battlepass)

### 2. 操作图标

- 添加 (ink-action-add)
- 删除 (ink-action-delete)
- 编辑 (ink-action-edit)
- 完成 (ink-action-complete)
- 刷新 (ink-action-refresh)
- 搜索 (ink-action-search)
- 分享 (ink-action-share)
- 收藏 (ink-action-favorite)

### 3. 状态图标

- 成功 (ink-status-success)
- 错误 (ink-status-error)
- 警告 (ink-status-warning)
- 信息 (ink-status-info)
- 锁定 (ink-status-locked)
- 解锁 (ink-status-unlocked)
- 加载 (ink-status-loading)

### 4. 资源图标

- 经验 (ink-resource-experience)
- 金币 (ink-resource-coin)
- 竹子 (ink-resource-bamboo)
- 钻石 (ink-resource-diamond)
- 物品 (ink-resource-item)
- 徽章 (ink-resource-badge)
- 食物 (ink-resource-food)

### 5. 熊猫相关图标

- 熊猫 (ink-panda-normal)
- 熊猫开心 (ink-panda-happy)
- 熊猫专注 (ink-panda-focused)
- 熊猫疲惫 (ink-panda-tired)
- 熊猫能力 (ink-panda-ability)

## 设计示例

### 基础元素

1. **水墨笔触**：
   - 起笔轻盈，中间加重，收笔轻盈
   - 墨色由浓到淡的自然过渡
   - 笔触边缘略微模糊，模拟墨水在宣纸上的扩散效果

2. **留白处理**：
   - 图标内部适当留白，增加呼吸感
   - 利用留白形成图形的一部分，而非仅作为背景

3. **装饰元素**：
   - 墨点：模拟泼墨效果的小点
   - 墨晕：墨色向外扩散的效果
   - 飞白：笔触中断但形态连续的效果

## 实现建议

1. 使用SVG格式，便于缩放和样式调整
2. 利用SVG的`stroke-dasharray`和`stroke-linecap`属性模拟毛笔笔触
3. 使用渐变填充模拟墨色浓淡变化
4. 添加适当的模糊效果模拟墨水扩散
5. 考虑使用CSS动画增强图标的交互体验

## 使用指南

1. 保持图标风格一致性，避免在同一界面混用不同风格的图标
2. 确保图标在各种尺寸下都清晰可辨
3. 为图标添加适当的悬停和点击效果，增强用户体验
4. 考虑为重要操作的图标添加简单的动画效果
5. 确保图标与应用整体设计风格协调一致

---

*注：本指南将随项目发展持续更新和完善。*
