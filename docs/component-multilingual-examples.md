# PandaHabit 组件多语言支持示例

本文档提供了 PandaHabit 应用中常见组件的多语言支持实现示例，可作为开发者的参考指南。

## 目录

1. [基础组件](#基础组件)
2. [游戏组件](#游戏组件)
3. [任务组件](#任务组件)
4. [商店组件](#商店组件)
5. [反思组件](#反思组件)

## 基础组件

### Button 组件

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'jade' | 'gold';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  // 不需要 labels 属性，因为按钮文本通过 children 传入
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  children
}) => {
  // 实现...
};
```

### LoadingSpinner 组件

```typescript
interface LoadingSpinnerProps {
  variant?: 'primary' | 'secondary' | 'jade' | 'white';
  size?: 'small' | 'medium' | 'large';
  text?: string; // 加载文本
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'primary',
  size = 'medium',
  text, // 可以传入本地化的加载文本
  className = ''
}) => {
  return (
    <div className={`loading-spinner-container ${className}`}>
      <div className={`spinner spinner-${variant} spinner-${size}`}>
        {/* 加载动画 */}
      </div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};
```

## 游戏组件

### ChallengeCard 组件

```typescript
interface ChallengeCardProps {
  challenge: ChallengeRecord;
  onClick?: (challenge: ChallengeRecord) => void;
  onComplete?: (challengeId: number) => void;
  labels?: {
    statusActive?: string;
    statusCompleted?: string;
    statusExpired?: string;
    statusUpcoming?: string;
    startLabel?: string;
    endLabel?: string;
    completedOnLabel?: string;
    completeButtonText?: string;
    inProgressText?: string;
  };
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onClick,
  onComplete,
  labels
}) => {
  // 获取挑战状态对应的文本
  const getStatusText = () => {
    switch (challenge.status) {
      case ChallengeStatus.ACTIVE:
        return labels?.statusActive || 'Active';
      case ChallengeStatus.COMPLETED:
        return labels?.statusCompleted || 'Completed';
      case ChallengeStatus.EXPIRED:
        return labels?.statusExpired || 'Expired';
      case ChallengeStatus.UPCOMING:
        return labels?.statusUpcoming || 'Upcoming';
      default:
        return '';
    }
  };

  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick(challenge);
    }
  };

  // 处理完成挑战事件
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (onComplete && challenge.status === ChallengeStatus.ACTIVE) {
      onComplete(challenge.id!);
    }
  };

  return (
    <motion.div
      className={`challenge-card ${getStatusClass()} ${getDifficultyClass()}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {/* 挑战卡片头部 */}
      <div className="challenge-card-header">
        {/* ... */}
        <div className="challenge-meta">
          <span className={`challenge-status ${getStatusClass()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* 挑战卡片内容 */}
      <div className="challenge-card-body">
        <p className="challenge-description">{challenge.description}</p>
        <div className="challenge-dates">
          <span>{labels?.startLabel || 'Start'}: {formatTime(challenge.startDate, false)}</span>
          {challenge.endDate && (
            <span>{labels?.endLabel || 'End'}: {formatTime(challenge.endDate, false)}</span>
          )}
        </div>
      </div>

      {/* 挑战卡片底部 */}
      <div className="challenge-card-footer">
        {challenge.status === ChallengeStatus.ACTIVE && (
          <button
            className="complete-challenge-button"
            onClick={handleComplete}
            disabled={challenge.progress < 100}
          >
            {challenge.progress >= 100 
              ? (labels?.completeButtonText || 'Complete Challenge') 
              : (labels?.inProgressText || 'In Progress...')}
          </button>
        )}
        {challenge.status === ChallengeStatus.COMPLETED && (
          <div className="challenge-completed-info">
            <span className="completion-date">
              {labels?.completedOnLabel || 'Completed on'}: {formatTime(challenge.completedDate!, false)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
```

## 任务组件

### SubtaskList 组件

```typescript
interface SubtaskListProps {
  parentTaskId: number;
  onSubtasksChange?: (hasSubtasks: boolean) => void;
  labels?: {
    loadErrorMessage?: string;
    addErrorMessage?: string;
    completeErrorMessage?: string;
    deleteErrorMessage?: string;
    reorderErrorMessage?: string;
    addSubtaskPlaceholder?: string;
    addButtonText?: string;
    noSubtasksMessage?: string;
    deleteSubtaskAriaLabel?: string;
  };
}

const SubtaskList: React.FC<SubtaskListProps> = ({ 
  parentTaskId, 
  onSubtasksChange,
  labels 
}) => {
  const [subtasks, setSubtasks] = useState<SubtaskRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  // 加载子任务
  const loadSubtasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedSubtasks = await getSubtasks(parentTaskId);
      setSubtasks(loadedSubtasks);
      
      // 通知父组件子任务状态变化
      if (onSubtasksChange) {
        onSubtasksChange(loadedSubtasks.length > 0);
      }
    } catch (err) {
      console.error('Failed to load subtasks:', err);
      setError(labels?.loadErrorMessage || 'Failed to load subtasks, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理添加子任务
  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;

    try {
      setIsAddingSubtask(true);
      await createSubtask({
        parentTaskId,
        title: newSubtaskTitle.trim()
      });
      setNewSubtaskTitle('');
      playSound(SoundType.BUTTON_CLICK, 0.3);
      await loadSubtasks();
    } catch (err) {
      console.error('Failed to add subtask:', err);
      setError(labels?.addErrorMessage || 'Failed to add subtask, please try again');
    } finally {
      setIsAddingSubtask(false);
    }
  };

  // JSX 部分
  return (
    <div className="subtasks-list">
      {/* 子任务列表 */}
      {/* ... */}
      
      {/* 添加子任务表单 */}
      <div className="add-subtask-form mt-4">
        <div className="flex">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            placeholder={labels?.addSubtaskPlaceholder || "Add new subtask..."}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-jade-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSubtask();
              }
            }}
          />
          <Button
            variant="jade"
            onClick={handleAddSubtask}
            disabled={!newSubtaskTitle.trim() || isAddingSubtask}
            className="rounded-l-none"
          >
            {isAddingSubtask ? (
              <LoadingSpinner variant="white" size="small" />
            ) : (
              labels?.addButtonText || 'Add'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
```

## 商店组件

### StoreItemCard 组件

```typescript
interface StoreItemCardProps {
  item: StoreItemRecord;
  onPurchase?: (item: StoreItemRecord) => void;
  onPreview?: (item: StoreItemRecord) => void;
  userCoins?: number;
  userJade?: number;
  isVip?: boolean;
  labels?: {
    vipRequiredError?: string;
    insufficientCoinsError?: string;
    insufficientJadeError?: string;
    purchaseError?: string;
    rarityLabels?: {
      common?: string;
      uncommon?: string;
      rare?: string;
      epic?: string;
      legendary?: string;
    };
    vipExclusiveLabel?: string;
    saleLabel?: string;
    buyButtonText?: string;
  };
}

const StoreItemCard: React.FC<StoreItemCardProps> = ({
  item,
  onPurchase,
  onPreview,
  userCoins = 0,
  userJade = 0,
  isVip = false,
  labels
}) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 处理购买物品
  const handlePurchase = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    
    // 检查是否需要VIP
    if (item.vipRequired && !isVip) {
      setError(labels?.vipRequiredError || 'VIP membership required');
      return;
    }
    
    // 检查是否有足够的货币
    const price = item.isOnSale && item.salePrice !== undefined ? item.salePrice : item.price;
    if (item.priceType === PriceType.COINS && userCoins < price) {
      setError(labels?.insufficientCoinsError || 'Not enough coins');
      return;
    }
    if (item.priceType === PriceType.JADE && userJade < price) {
      setError(labels?.insufficientJadeError || 'Not enough jade');
      return;
    }
    
    // 购买物品
    try {
      setIsPurchasing(true);
      setError(null);
      
      // 调用购买API
      await purchaseStoreItem(item.id!);
      
      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);
      
      // 通知父组件
      if (onPurchase) {
        onPurchase(item);
      }
    } catch (err) {
      console.error('Failed to purchase item:', err);
      setError(labels?.purchaseError || 'Failed to purchase item');
    } finally {
      setIsPurchasing(false);
    }
  };
  
  // JSX 部分
  return (
    <motion.div className="store-item-card">
      {/* 物品图片 */}
      <div className="item-image-container relative">
        {/* ... */}
        
        {/* VIP标签 */}
        {item.vipRequired && (
          <div className="vip-badge absolute top-2 left-2 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-300">
            {labels?.vipExclusiveLabel || 'VIP Exclusive'}
          </div>
        )}
        
        {/* 促销标签 */}
        {item.isOnSale && item.salePrice !== undefined && (
          <div className="sale-badge absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 border border-red-300">
            {labels?.saleLabel || 'Sale'}
          </div>
        )}
      </div>
      
      {/* 购买按钮 */}
      <Button
        variant="jade"
        size="small"
        onClick={handlePurchase}
        disabled={isPurchasing || !canAfford() || (item.vipRequired && !isVip)}
      >
        {isPurchasing ? (
          <LoadingSpinner variant="white" size="small" />
        ) : (
          labels?.buyButtonText || 'Buy'
        )}
      </Button>
    </motion.div>
  );
};
```

## 反思组件

### MoodTracker 组件

```typescript
interface MoodTrackerProps {
  onMoodRecorded?: (mood: MoodRecord) => void;
  compact?: boolean;
  className?: string;
  labels?: {
    title?: string;
    currentMoodQuestion?: string;
    intensityLabel?: string;
    noteLabel?: string;
    notePlaceholder?: string;
    recordMoodButton?: string;
    historyLabel?: string;
    backLabel?: string;
    noMoodsMessage?: string;
    intensityStrength?: {
      veryMild?: string;
      mild?: string;
      moderate?: string;
      strong?: string;
      veryStrong?: string;
    };
  };
}

const MoodTracker: React.FC<MoodTrackerProps> = ({
  onMoodRecorded,
  compact = false,
  className = '',
  labels
}) => {
  // 状态和逻辑...
  
  // 获取强度标签
  const getIntensityLabel = (intensity: MoodIntensity) => {
    switch (intensity) {
      case 1: return labels?.intensityStrength?.veryMild || 'Very Mild';
      case 2: return labels?.intensityStrength?.mild || 'Mild';
      case 3: return labels?.intensityStrength?.moderate || 'Moderate';
      case 4: return labels?.intensityStrength?.strong || 'Strong';
      case 5: return labels?.intensityStrength?.veryStrong || 'Very Strong';
      default: return 'Unknown';
    }
  };
  
  // JSX 部分
  return (
    <div className={`mood-tracker ${className}`}>
      <div className="mood-tracker-header flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-jade-700">
          <span className="mr-2">🍵</span>
          {labels?.title || "Mood Tracking"}
        </h2>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? (labels?.backLabel || "Back") : (labels?.historyLabel || "History")}
        </Button>
      </div>
      
      {/* 情绪选择器 */}
      <div className="mood-selector">
        <h3 className="text-lg font-bold mb-3">
          {labels?.currentMoodQuestion || "How are you feeling right now?"}
        </h3>
        {/* 情绪选项 */}
      </div>
      
      {/* 强度选择器 */}
      <div className="intensity-selector mt-4">
        <h3 className="text-lg font-bold mb-2">
          {labels?.intensityLabel || "How intense is this feeling?"}
        </h3>
        {/* 强度滑块 */}
      </div>
      
      {/* 笔记输入框 */}
      <div className="note-input mt-4">
        <h3 className="text-lg font-bold mb-2">
          {labels?.noteLabel || "Anything you'd like to note? (optional)"}
        </h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500 h-24"
          placeholder={labels?.notePlaceholder || "Write down your thoughts..."}
        />
      </div>
      
      {/* 提交按钮 */}
      <div className="form-actions mt-4 flex justify-end">
        <Button
          variant="jade"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {labels?.recordMoodButton || "Record Mood"}
        </Button>
      </div>
    </div>
  );
};
```

## 结论

通过以上示例，可以看到如何为不同类型的组件实现多语言支持。关键点包括：

1. 为组件添加 `labels` 属性，包含所有需要本地化的文本
2. 为每个文本提供英文默认值作为回退
3. 确保错误消息和状态文本也使用本地化标签
4. 在父组件中正确传递标签给子组件

遵循这些模式可以确保 PandaHabit 应用提供一致的多语言体验。
