# PandaHabit UI 实现分析与任务清单

本文档基于对现有实现页面与设计文档的深入对比分析，整理了需要实现或更新的UI任务。分析重点关注了每个页面的布局、样式和组件是否符合设计要求，并提供了具体的改进建议。

## 1. 现有页面分析

### 1.1 主页/家园 (HomePage)

**现状分析**：
- 已实现基本布局和功能
- 使用了`WelcomeSection`、`MoodsSection`、`PandaSection`和`ResourcesSection`组件
- 部分使用了华丽游戏风格元素

**差距**：
- 缺少设计文档中指定的水墨画风格图标
- 部分组件未使用`bamboo-frame`样式包装
- 熊猫展示区域未完全按照设计实现动画效果
- 资源显示部分样式与设计不完全一致

**任务**：
- 更新图标为水墨画风格
- 统一使用`bamboo-frame`样式
- 增强熊猫动画效果
- 调整资源显示样式

### 1.2 任务列表页 (TasksPage)

**现状分析**：
- 已实现基本布局和功能
- 使用了任务卡片组件和筛选器

**差距**：
- 筛选器样式与设计不一致
- 任务卡片样式缺少华丽游戏风格元素
- 缺少水墨画风格图标
- 添加任务按钮样式不符合设计

**任务**：
- 重新设计筛选器组件
- 更新任务卡片样式
- 替换图标为水墨画风格
- 更新添加任务按钮样式

### 1.3 熊猫互动/详情页 (PandaInteractionPage)

**现状分析**：
- 部分功能已在`PandaSection`组件中实现
- 存在`PandaInteractionPanel`组件
- 已有熊猫状态管理和互动服务

**差距**：
- 缺少完整的独立页面
- 缺少设计文档中指定的三个标签页（状态、皮肤、互动）
- 现有互动功能不完整
- 样式与设计不一致

**任务**：
- 创建完整的`PandaInteractionPage`页面
- 实现三个标签页
- 完善互动功能
- 按设计更新样式

### 1.4 心情打卡/反思模块 (MoodCheckPage)

**现状分析**：
- 已有`TeaRoomPage`实现了部分功能
- 存在反思相关组件和服务

**差距**：
- `TeaRoomPage`与设计文档中的`MoodCheckPage`不完全一致
- 缺少心情选择器组件
- 历史记录展示不完整
- 样式与设计不一致

**任务**：
- 重构`TeaRoomPage`为`MoodCheckPage`
- 实现心情选择器组件
- 完善历史记录展示
- 按设计更新样式

### 1.5 个人资料/设置页 (ProfilePage/SettingsPage)

**现状分析**：
- 已有`SettingsPage`实现了设置功能
- 包含语言设置、动画设置、骨架屏设置等

**差距**：
- 缺少个人资料标签页
- 设置项样式与设计不完全一致
- 缺少用户统计和成就展示
- 缺少水墨画风格图标

**任务**：
- 创建个人资料标签页
- 更新设置项样式
- 实现用户统计和成就展示
- 替换图标为水墨画风格

### 1.6 VIP特权总览页 (VipBenefitsPage)

**现状分析**：
- 已有`VipBenefitsPage`实现了基本功能
- 存在`VipValueSummary`和`VipValueModal`组件

**差距**：
- 样式与设计不完全一致
- 特权项展示不完整
- 缺少水墨画风格图标
- 订阅入口样式不符合设计

**任务**：
- 更新页面样式
- 完善特权项展示
- 替换图标为水墨画风格
- 更新订阅入口样式

## 2. 未实现页面分析

### 2.1 订阅选择页 (SubscriptionPage)

**现状分析**：
- 尚未实现
- 可能有部分相关组件在VIP功能中

**设计要求**：
- 需要展示月度、季度和年度套餐选项
- 包含价格、折扣和赠品信息
- 需要华丽游戏风格元素
- 需要水墨画风格图标

**任务**：
- 创建`SubscriptionPage`页面
- 实现套餐选择组件
- 实现价格和折扣展示
- 实现赠品信息展示

### 2.2 通知中心/消息页 (NotificationPage)

**现状分析**：
- 尚未实现
- 存在`NotificationManager`组件

**设计要求**：
- 需要系统和消息两个标签页
- 需要通知列表和消息列表
- 需要华丽游戏风格元素
- 需要水墨画风格图标

**任务**：
- 创建`NotificationPage`页面
- 实现系统和消息标签页
- 实现通知列表和消息列表
- 按设计实现样式

### 2.3 帮助与反馈/FAQ页 (HelpPage)

**现状分析**：
- 尚未实现

**设计要求**：
- 需要FAQ和反馈两个标签页
- 需要FAQ列表和反馈表单
- 需要华丽游戏风格元素
- 需要水墨画风格图标

**任务**：
- 创建`HelpPage`页面
- 实现FAQ和反馈标签页
- 实现FAQ列表和反馈表单
- 按设计实现样式

## 3. 共通组件分析

### 3.1 按钮组件

**现状分析**：
- 已有`Button`组件支持多种样式和变体
- 包括jade、gold等游戏风格按钮
- 支持不同大小和形状

**差距**：
- 部分页面未使用统一的按钮组件
- 部分按钮样式与设计不完全一致
- 缺少水墨画风格图标

**任务**：
- 统一使用`Button`组件
- 更新按钮样式
- 添加水墨画风格图标

### 3.2 骨架屏组件

**现状分析**：
- 已有骨架屏系统
- 支持不同变体和样式
- 包括jade、gold等游戏风格

**差距**：
- 部分页面未使用骨架屏
- 骨架屏样式与设计不完全一致

**任务**：
- 为所有页面添加骨架屏
- 更新骨架屏样式

### 3.3 弹窗组件

**现状分析**：
- 已有多种弹窗组件
- 部分使用了游戏风格元素

**差距**：
- 缺少传统窗棂样式
- 部分弹窗样式与设计不一致

**任务**：
- 实现传统窗棂样式弹窗
- 更新现有弹窗样式

## 4. 优先级任务清单

### 4.1 高优先级任务

1. **熊猫互动页面实现**
   - 创建完整的`PandaInteractionPage`页面
   - 实现状态、皮肤、互动三个标签页
   - 完善互动功能
   - 按设计更新样式

2. **心情打卡/反思模块重构**
   - 重构`TeaRoomPage`为`MoodCheckPage`
   - 实现心情选择器组件
   - 完善历史记录展示
   - 按设计更新样式

3. **个人资料标签页实现**
   - 创建个人资料标签页
   - 实现用户统计和成就展示
   - 集成到现有`SettingsPage`

4. **传统窗棂样式弹窗实现**
   - 创建传统窗棂样式弹窗组件
   - 更新现有弹窗样式

### 4.2 中优先级任务

1. **订阅选择页实现**
   - 创建`SubscriptionPage`页面
   - 实现套餐选择组件
   - 实现价格和折扣展示

2. **通知中心/消息页实现**
   - 创建`NotificationPage`页面
   - 实现系统和消息标签页
   - 实现通知列表和消息列表

3. **现有页面样式更新**
   - 更新主页样式
   - 更新任务列表页样式
   - 更新VIP特权总览页样式

### 4.3 低优先级任务

1. **帮助与反馈/FAQ页实现**
   - 创建`HelpPage`页面
   - 实现FAQ和反馈标签页
   - 实现FAQ列表和反馈表单

2. **水墨画风格图标库实现**
   - 创建水墨画风格图标组件
   - 替换现有图标

3. **骨架屏完善**
   - 为所有页面添加骨架屏
   - 更新骨架屏样式

## 5. 实施计划

### 第一阶段（1-2周）
- 实现熊猫互动页面
- 重构心情打卡/反思模块
- 实现传统窗棂样式弹窗

### 第二阶段（2-3周）
- 实现个人资料标签页
- 实现订阅选择页
- 更新现有页面样式

### 第三阶段（3-4周）
- 实现通知中心/消息页
- 实现帮助与反馈/FAQ页
- 实现水墨画风格图标库
- 完善骨架屏

## 6. 具体组件实现任务与代码示例

### 6.1 熊猫互动页面组件

1. **PandaStatusTab**
   - 实现熊猫状态标签页
   - 显示熊猫心情、能量、经验值等状态
   - 显示熊猫技能列表
   - 按设计实现样式

2. **PandaSkinTab**
   - 实现熊猫皮肤标签页
   - 显示可用皮肤列表
   - 实现皮肤预览和选择功能
   - 按设计实现样式

3. **PandaInteractionTab**
   - 实现熊猫互动标签页
   - 显示互动选项（抚摸、喂食、玩耍、训练等）
   - 实现互动动画和效果
   - 按设计实现样式

### 6.2 心情打卡/反思模块组件

1. **MoodSelector**
   - 实现心情选择器组件
   - 显示不同心情图标（开心、平静、活泼、专注、疲惫、沮丧）
   - 实现心情选择功能
   - 按设计实现样式

2. **ReflectionInput**
   - 实现反思输入组件
   - 提供文本输入区域
   - 实现标签选择功能
   - 按设计实现样式

3. **MoodHistory**
   - 实现心情历史记录组件
   - 显示历史心情和反思记录
   - 实现历史记录筛选功能
   - 按设计实现样式

### 6.3 个人资料/设置页组件

1. **UserInfoSection**
   - 实现用户信息部分
   - 显示用户头像、用户名、ID和加入日期
   - 实现编辑功能
   - 按设计实现样式

2. **UserStatsSection**
   - 实现用户统计部分
   - 显示任务完成数、连续天数和成就数
   - 按设计实现样式

3. **AchievementsSection**
   - 实现成就展示部分
   - 显示已获得和未获得的成就
   - 实现成就详情查看功能
   - 按设计实现样式

### 6.4 通用组件

1. **TraditionalWindowModal**
   - 实现传统窗棂样式弹窗组件
   - 支持不同大小和内容
   - 实现动画效果
   - 按设计实现样式

2. **InkWashIcon**
   - 实现水墨画风格图标组件
   - 支持不同图标类型
   - 实现微动画效果
   - 按设计实现样式

## 7. 代码示例

### 7.1 熊猫互动页面示例

```tsx
// src/pages/PandaInteractionPage.tsx
import React, { useState } from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchPandaInteractionPageView } from '@/services/localizedContentService';
import PandaStatusTab from '@/components/panda/PandaStatusTab';
import PandaSkinTab from '@/components/panda/PandaSkinTab';
import PandaInteractionTab from '@/components/panda/PandaInteractionTab';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { usePandaState } from '@/context/PandaStateProvider';
import { PageTransition } from '@/components/animation/PageTransition';

// 标签类型
type TabType = 'status' | 'skin' | 'interaction';

const PandaInteractionPage: React.FC = () => {
  // 获取本地化内容
  const { labels: pageLabels, isLoading, error } = useLocalizedView(fetchPandaInteractionPageView);

  // 熊猫状态
  const { pandaState } = usePandaState();

  // 当前标签
  const [activeTab, setActiveTab] = useState<TabType>('status');

  // 处理标签切换
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // 加载中
  if (isLoading) {
    return <LoadingSpinner variant="jade" size="large" />;
  }

  // 错误处理
  if (error || !pageLabels) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <PageTransition>
      <div className="page-content">
        <div className="bamboo-frame">
          <h2>{pageLabels.pageTitle}</h2>

          {/* 熊猫名称和等级 */}
          <div className="panda-name-container">
            <h3>{pandaState?.name}</h3>
            <div className="panda-level">
              <span>{pageLabels.levelLabel}: {pandaState?.level}</span>
            </div>
          </div>

          {/* 标签切换 */}
          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
              onClick={() => handleTabChange('status')}
            >
              {pageLabels.statusTab}
            </button>
            <button
              className={`tab-button ${activeTab === 'skin' ? 'active' : ''}`}
              onClick={() => handleTabChange('skin')}
            >
              {pageLabels.skinTab}
            </button>
            <button
              className={`tab-button ${activeTab === 'interaction' ? 'active' : ''}`}
              onClick={() => handleTabChange('interaction')}
            >
              {pageLabels.interactionTab}
            </button>
          </div>

          {/* 标签内容 */}
          <div className="tab-content">
            {activeTab === 'status' && (
              <PandaStatusTab labels={pageLabels.statusSection} />
            )}
            {activeTab === 'skin' && (
              <PandaSkinTab labels={pageLabels.skinSection} />
            )}
            {activeTab === 'interaction' && (
              <PandaInteractionTab labels={pageLabels.interactionSection} />
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PandaInteractionPage;
```

### 7.2 心情选择器组件示例

```tsx
// src/components/mood/MoodSelector.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { playSound, SoundType } from '@/utils/sound';
import type { MoodType } from '@/types';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType) => void;
  labels: {
    happy?: string;
    calm?: string;
    playful?: string;
    focused?: string;
    tired?: string;
    sad?: string;
    title?: string;
  };
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  labels
}) => {
  // 心情类型
  const moods: MoodType[] = ['happy', 'calm', 'playful', 'focused', 'tired', 'sad'];

  // 处理选择心情
  const handleSelectMood = (mood: MoodType) => {
    playSound(SoundType.BUTTON_CLICK);
    onSelectMood(mood);
  };

  return (
    <div className="mood-selector">
      <h3 className="mood-selector-title">{labels.title || '今日心情'}</h3>

      <div className="mood-icons-container">
        {moods.map((mood) => (
          <motion.button
            key={mood}
            className={`mood-icon-button ${selectedMood === mood ? 'selected' : ''}`}
            onClick={() => handleSelectMood(mood)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="mood-icon">
              <img
                src={`/assets/images/mood_icon_${mood}.png`}
                alt={labels[mood] || mood}
              />
            </div>
            <span className="mood-label">{labels[mood] || mood}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
```

### 7.3 传统窗棂样式弹窗示例

```tsx
// src/components/common/TraditionalWindowModal.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, SoundType } from '@/utils/sound';
import Button from './Button';

interface TraditionalWindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  closeButtonText?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const TraditionalWindowModal: React.FC<TraditionalWindowModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 600,
  height = 'auto',
  closeButtonText = '关闭',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  // 处理ESC键关闭
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // 处理打开音效
  useEffect(() => {
    if (isOpen) {
      playSound(SoundType.MODAL_OPEN);
    }
  }, [isOpen]);

  // 处理关闭
  const handleClose = () => {
    playSound(SoundType.MODAL_CLOSE);
    onClose();
  };

  // 处理遮罩点击
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={`traditional-window-modal ${className}`}
            style={{ width, height }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="traditional-window-frame">
              <div className="traditional-window-header">
                <h3 className="traditional-window-title">{title}</h3>
                <button
                  className="traditional-window-close-icon"
                  onClick={handleClose}
                  aria-label="关闭"
                >
                  ×
                </button>
              </div>

              <div className="traditional-window-content">
                {children}
              </div>

              {showCloseButton && (
                <div className="traditional-window-footer">
                  <Button
                    variant="outlined"
                    color="jade"
                    onClick={handleClose}
                  >
                    {closeButtonText}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TraditionalWindowModal;
```
