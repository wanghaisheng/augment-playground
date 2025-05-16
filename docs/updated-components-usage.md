# Updated Components Usage Guide

This document provides examples of how to use the updated components with their new type definitions and properties.

## Button Component

The Button component now supports additional variants and colors to match the game theme.

### Available Button Colors

- `jade` - 翡翠绿 (Primary actions)
- `gold` - 黄金 (Premium actions)
- `silk` - 丝绸 (Secondary actions)
- `cinnabar` - 朱砂 (Warning actions)
- `blue` - 青花 (Information actions)
- `purple` - 紫檀 (Special actions)
- `bamboo` - 竹子 (Bamboo-related actions)
- `primary`, `secondary`, `danger`, `success`, `warning`, `info` (Compatibility options)

### Available Button Variants

- `filled` - Filled style (default)
- `outlined` - Outlined style
- `text` - Text-only style
- `jade`, `gold`, `bamboo` - Theme-specific styles (compatibility)
- `contained`, `standard`, `ghost` - Additional styles (compatibility)

### Examples

```tsx
// Primary action button
<Button color="jade" variant="filled">
  确认 (Confirm)
</Button>

// Secondary action button
<Button color="silk" variant="outlined">
  取消 (Cancel)
</Button>

// Premium feature button
<Button color="gold" variant="filled">
  解锁高级功能 (Unlock Premium Feature)
</Button>

// Warning action button
<Button color="cinnabar" variant="filled">
  删除 (Delete)
</Button>

// Bamboo-themed button
<Button color="bamboo" variant="filled">
  收集竹子 (Collect Bamboo)
</Button>

// Text-only button
<Button color="blue" variant="text">
  了解更多 (Learn More)
</Button>

// With icon
<Button color="jade" variant="filled" startIcon={<BambooIcon />}>
  种植竹子 (Plant Bamboo)
</Button>

// Disabled button
<Button color="jade" variant="filled" disabled>
  等待中 (Waiting)
</Button>

// Full width button
<Button color="gold" variant="filled" fullWidth>
  购买 (Purchase)
</Button>
```

## LoadingSpinner Component

The LoadingSpinner component now supports additional variants, sizes, and customization options.

### Available Variants

- `default` - Default spinner style
- `jade` - Jade-themed spinner
- `bamboo` - Bamboo-themed spinner
- `gold` - Gold-themed spinner

### Available Sizes

- `small` - Small spinner
- `medium` - Medium spinner (default)
- `large` - Large spinner
- Custom size (e.g., `"50px"`) - Custom-sized spinner

### Available Types

- `generic` - Generic loading (default)
- `data` - Data loading
- `content` - Content loading
- `saving` - Saving data
- `processing` - Processing request

### Examples

```tsx
// Default spinner
<LoadingSpinner />

// Jade-themed spinner
<LoadingSpinner variant="jade" />

// Bamboo-themed spinner
<LoadingSpinner variant="bamboo" />

// Gold-themed spinner
<LoadingSpinner variant="gold" />

// Different sizes
<LoadingSpinner size="small" />
<LoadingSpinner size="medium" />
<LoadingSpinner size="large" />
<LoadingSpinner size="50px" />

// Different loading types (affects the displayed text)
<LoadingSpinner type="data" />
<LoadingSpinner type="content" />
<LoadingSpinner type="saving" />
<LoadingSpinner type="processing" />

// Custom text
<LoadingSpinner text="正在加载您的熊猫..." />

// With additional CSS classes
<LoadingSpinner className="my-custom-spinner" />

// Combined options
<LoadingSpinner 
  variant="jade" 
  size="large" 
  type="saving" 
  className="profile-spinner" 
/>
```

## Sound Utilities

The sound utilities now support additional sound types for various game events.

### Available Sound Types

The SoundType enum now includes additional sound types:

```typescript
// Original sound types
SoundType.REWARD_COMMON
SoundType.TASK_COMPLETE
SoundType.CHALLENGE_COMPLETE
SoundType.LEVEL_UP
SoundType.BUTTON_CLICK
// ... and many more

// New compatibility aliases
SoundType.CLICK       // Alias for BUTTON_CLICK
SoundType.UNLOCK      // Alias for CHALLENGE_UNLOCKED
SoundType.REWARD      // Alias for REWARD_COMMON
SoundType.COMPLETE    // Alias for TASK_COMPLETE
SoundType.FAIL        // Alias for TASK_FAILED
SoundType.CREATE      // Alias for TASK_CREATED
SoundType.BAMBOO_PLANT    // Alias for BAMBOO_COLLECT
SoundType.BAMBOO_HARVEST  // Alias for BAMBOO_COLLECT
```

### Examples

```typescript
import { playSound, SoundType } from '../utils/sound';

// Play button click sound
playSound(SoundType.CLICK);
// or
playSound(SoundType.BUTTON_CLICK);

// Play reward sound
playSound(SoundType.REWARD);
// or
playSound(SoundType.REWARD_COMMON);

// Play task complete sound
playSound(SoundType.COMPLETE);
// or
playSound(SoundType.TASK_COMPLETE);

// Play challenge unlock sound
playSound(SoundType.UNLOCK);
// or
playSound(SoundType.CHALLENGE_UNLOCKED);

// Play bamboo collect sound
playSound(SoundType.BAMBOO_COLLECT);
// or
playSound(SoundType.BAMBOO_PLANT);
// or
playSound(SoundType.BAMBOO_HARVEST);
```

## Best Practices

1. **Use Consistent Styling**:
   - Prefer using the primary color scheme (`jade`, `gold`, `silk`, etc.) over generic colors
   - Use appropriate button variants based on the action's importance

2. **Loading States**:
   - Use the appropriate LoadingSpinner variant to match your UI theme
   - Choose the right size based on the context (small for inline, medium for components, large for full-page)
   - Use the appropriate type to provide context-specific loading messages

3. **Sound Effects**:
   - Use sound effects consistently for similar actions
   - Prefer using the specific sound types (e.g., `TASK_COMPLETE`) over generic aliases (e.g., `COMPLETE`) when possible

4. **Type Safety**:
   - Take advantage of TypeScript's type checking to ensure you're using valid props
   - Use the autocomplete feature in your IDE to discover available options

By following these guidelines and using the updated components correctly, you can ensure a consistent user experience and reduce TypeScript errors in your codebase.
