# 每日抽奖次数限制系统文档

## 概述

每日抽奖次数限制系统是 PandaHabit 应用中的一个重要功能，用于管理用户每日可进行的抽奖次数，并为 VIP 用户提供额外的抽奖次数特权。本文档描述了该系统的设计、实现和使用方法。

## 系统组件

每日抽奖次数限制系统由以下主要组件组成：

### 1. 抽奖次数限制服务

抽奖次数限制服务负责管理用户的抽奖次数限制，包括：

- **每日限制**：定义用户每日可进行的抽奖次数。
- **VIP 特权**：根据用户的 VIP 等级提供额外的抽奖次数。
- **次数跟踪**：跟踪用户已使用的抽奖次数。
- **冷却管理**：管理抽奖的冷却时间。

相关文件：
- `src/services/luckyDrawLimitService.ts`：抽奖次数限制服务

### 2. 抽奖服务集成

抽奖服务与抽奖次数限制服务集成，在执行抽奖前检查用户是否还有剩余的抽奖次数。

相关文件：
- `src/services/timelyRewardService.ts`：抽奖服务

### 3. 抽奖界面组件

抽奖界面组件显示用户的剩余抽奖次数和总限制，并为非 VIP 用户提供 VIP 特权提示。

相关文件：
- `src/components/game/LuckyDraw.tsx`：抽奖组件
- `src/components/game/LuckyDrawWheel.tsx`：抽奖轮盘组件

## 抽奖次数限制

系统定义了不同用户类型的每日抽奖次数限制：

### 1. 普通用户

- **每日限制**：3 次
- **冷却时间**：无特殊冷却时间

### 2. 基础 VIP (Tier 1)

- **每日限制**：5 次
- **冷却时间**：无特殊冷却时间
- **额外特权**：无

### 3. 高级 VIP (Tier 2)

- **每日限制**：7 次
- **冷却时间**：无特殊冷却时间
- **额外特权**：无

### 4. 豪华 VIP (Tier 3)

- **每日限制**：10 次
- **冷却时间**：无特殊冷却时间
- **额外特权**：无

## 数据结构

### 抽奖次数限制记录

```typescript
interface LuckyDrawLimitRecord {
  id?: number;
  userId: string;
  date: string; // 日期字符串，格式为 YYYY-MM-DD
  drawCount: number; // 已使用的抽奖次数
  createdAt: Date;
  updatedAt: Date;
}
```

## 主要功能

### 1. 初始化抽奖次数限制

在应用启动时，初始化抽奖次数限制系统：

```typescript
import { initializeLuckyDrawLimits } from '@/services/luckyDrawLimitService';

// 在应用启动时初始化
initializeLuckyDrawLimits();
```

### 2. 获取用户的每日抽奖次数限制

根据用户的 VIP 等级获取每日抽奖次数限制：

```typescript
import { getUserDailyDrawLimit } from '@/services/luckyDrawLimitService';

// 获取用户的每日抽奖次数限制
const limit = await getUserDailyDrawLimit(userId);
```

### 3. 获取用户今天已使用的抽奖次数

获取用户今天已使用的抽奖次数：

```typescript
import { getUserTodayDrawCount } from '@/services/luckyDrawLimitService';

// 获取用户今天已使用的抽奖次数
const used = await getUserTodayDrawCount(userId);
```

### 4. 获取用户今天剩余的抽奖次数

获取用户今天剩余的抽奖次数：

```typescript
import { getUserTodayRemainingDraws } from '@/services/luckyDrawLimitService';

// 获取用户今天剩余的抽奖次数
const remaining = await getUserTodayRemainingDraws(userId);
```

### 5. 检查用户今天是否还有抽奖次数

检查用户今天是否还有抽奖次数：

```typescript
import { canUserDrawToday } from '@/services/luckyDrawLimitService';

// 检查用户今天是否还有抽奖次数
const canDraw = await canUserDrawToday(userId);
```

### 6. 增加用户今天的抽奖次数

增加用户今天的抽奖次数：

```typescript
import { incrementUserTodayDrawCount } from '@/services/luckyDrawLimitService';

// 增加用户今天的抽奖次数
await incrementUserTodayDrawCount(userId);
```

### 7. 重置用户今天的抽奖次数

重置用户今天的抽奖次数：

```typescript
import { resetUserTodayDrawCount } from '@/services/luckyDrawLimitService';

// 重置用户今天的抽奖次数
await resetUserTodayDrawCount(userId);
```

## 抽奖流程

1. 用户打开抽奖界面
2. 系统检查用户的剩余抽奖次数
3. 如果用户还有剩余抽奖次数，允许用户进行抽奖
4. 用户点击抽奖按钮
5. 系统检查用户是否有足够的幸运点数
6. 系统再次检查用户是否还有剩余抽奖次数
7. 如果条件满足，执行抽奖
8. 增加用户今天的抽奖次数
9. 返回抽奖结果
10. 更新界面显示用户的剩余抽奖次数

## VIP 特权提示

对于非 VIP 用户，系统会在抽奖界面显示 VIP 特权提示，鼓励用户升级到 VIP 以获得更多的每日抽奖次数：

```tsx
{!isVip && (
  <div className="vip-promotion mt-2 p-2 bg-gold bg-opacity-10 rounded-lg border border-gold">
    <p className="text-sm text-gold">
      <span className="font-bold">VIP特权:</span> 每日抽奖次数提升至
      <span className="font-bold ml-1">
        {getDefaultDailyDrawLimit()} → {vipLimits[1] || 5}/{vipLimits[2] || 7}/{vipLimits[3] || 10}次
      </span>
    </p>
    <Button
      variant="gold"
      size="small"
      className="mt-1"
      onClick={onClose}
    >
      了解VIP特权
    </Button>
  </div>
)}
```

## 多语言支持

系统支持多语言，包括中文和英文。所有的文本内容都通过标签系统获取，确保在不同语言环境下显示正确的文本。

## 数据同步

抽奖次数限制记录会通过数据同步服务进行同步，确保用户在不同设备上的数据一致性。

## 日期处理

系统使用 YYYY-MM-DD 格式的日期字符串作为抽奖次数限制记录的日期标识，每天零点自动重置用户的抽奖次数。

## 最佳实践

1. **定期检查**：定期检查抽奖次数限制系统的运行状况，确保用户能够正常进行抽奖。
2. **数据备份**：定期备份抽奖次数限制记录，防止数据丢失。
3. **性能优化**：优化抽奖次数限制系统的性能，减少对数据库的访问次数。
4. **用户体验**：提供清晰的抽奖次数限制提示，帮助用户了解自己的抽奖次数情况。
5. **VIP 特权**：突出显示 VIP 特权，鼓励用户升级到 VIP 以获得更多的每日抽奖次数。

## 未来计划

1. **更多 VIP 特权**：为不同等级的 VIP 用户提供更多的抽奖特权，如更高的中奖概率、特殊奖品等。
2. **抽奖次数恢复**：实现抽奖次数恢复功能，允许用户通过完成特定任务或观看广告来恢复抽奖次数。
3. **抽奖活动**：实现限时抽奖活动，在特定时间段内提供更多的抽奖次数或特殊奖品。
4. **抽奖历史**：实现抽奖历史记录功能，允许用户查看自己的抽奖历史和获得的奖品。
5. **抽奖分析**：实现抽奖数据分析功能，帮助开发团队了解用户的抽奖行为和偏好。
