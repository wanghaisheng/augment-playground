/**
 * @deprecated 此组件已废弃，请使用 EnhancedAnimatedButton 组件代替。
 * 此组件将在下一个主要版本中移除。
 *
 * EnhancedAnimatedButton 提供了以下优势：
 * 1. 支持多种动画效果（缩放、发光、脉冲、弹跳、抖动、涟漪、水墨）
 * 2. 支持粒子效果（爆发、喷泉、水墨、闪烁）
 * 3. 支持音效（点击、成功、错误）
 * 4. 可以禁用动画、粒子效果和音效
 * 5. 更好的性能和用户体验
 */

// 导出类型定义，以保持向后兼容性
export type ButtonColor =
  | 'jade'     // 翡翠绿 - 主要操作
  | 'gold'     // 黄金 - 高级操作
  | 'silk'     // 丝绸 - 次要操作
  | 'cinnabar' // 朱砂 - 警告操作
  | 'blue'     // 青花 - 信息操作
  | 'purple'   // 紫檀 - 特殊操作
  | 'bamboo'   // 竹子 - 竹子相关操作
  | 'primary'  // 主要 - 兼容性
  | 'secondary'// 次要 - 兼容性
  | 'danger'   // 危险 - 兼容性
  | 'success'  // 成功 - 兼容性
  | 'warning'  // 警告 - 兼容性
  | 'info'     // 信息 - 兼容性
  | 'red'      // 红色 - 兼容性
  | 'gray';    // 灰色 - 兼容性

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonShape = 'rounded' | 'pill' | 'square' | 'circle';

export type ButtonVariant =
  | 'filled'    // 填充样式
  | 'outlined'  // 轮廓样式
  | 'text'      // 文本样式
  | 'jade'      // 翡翠样式 (兼容性)
  | 'gold'      // 黄金样式 (兼容性)
  | 'bamboo'    // 竹子样式 (兼容性)
  | 'contained' // 包含样式 (兼容性)
  | 'standard'  // 标准样式 (兼容性)
  | 'ghost'     // 幽灵样式 (兼容性)
  | 'secondary' // 次要样式 (兼容性)
  | 'error';    // 错误样式 (兼容性)

// 导入增强动画按钮组件
import EnhancedAnimatedButton from '@/components/animation/EnhancedAnimatedButton';

// 导出增强动画按钮组件作为默认导出
export default EnhancedAnimatedButton;