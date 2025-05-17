# TypeScript Error Fixes

This document summarizes the common TypeScript errors in the project and how to fix them.

## Common Error Types

### 1. TS6133: Unused Variables and Imports

**Error Message:** `'variableName' is declared but its value is never read.`

**Fixes:**
- Add `// eslint-disable-next-line @typescript-eslint/no-unused-vars` comment above the variable
- Rename the variable with an underscore prefix: `_variableName`
- Use the `void` operator: `void variableName;`
- Comment out the variable declaration
- Remove the variable if it's not needed

**Example:**
```typescript
// Before
const unusedVar = getValue();

// After (Option 1)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unusedVar = getValue();

// After (Option 2)
const _unusedVar = getValue();

// After (Option 3)
const unusedVar = getValue();
void unusedVar;

// After (Option 4)
// const unusedVar = getValue();
```

### 2. TS2322: Type Assignment Errors

**Error Message:** `Type 'X' is not assignable to type 'Y'.`

**Fixes:**
- Use type assertions: `value as Type`
- Fix the type to match the expected type
- Use optional chaining or nullish coalescing for nullable values
- Update component props to match the expected types

**Example:**
```typescript
// Before
const position = 'relative';

// After
const position = 'relative' as const;
```

### 3. TS2339: Property Does Not Exist Errors

**Error Message:** `Property 'X' does not exist on type 'Y'.`

**Fixes:**
- Add optional chaining: `obj?.property`
- Add the missing property to the interface/type
- Use type assertions: `(obj as SomeType).property`
- Fix typos in property names

**Example:**
```typescript
// Before
interface User {
  name: string;
}

const user: User = { name: 'John' };
console.log(user.age);

// After (Option 1)
interface User {
  name: string;
  age?: number;
}

// After (Option 2)
console.log(user?.age);
```

### 4. TS2345: Argument Type Errors

**Error Message:** `Argument of type 'X' is not assignable to parameter of type 'Y'.`

**Fixes:**
- Convert the argument to the expected type: `String(numValue)`, `Number(strValue)`
- Add nullish coalescing for optional values: `value ?? defaultValue`
- Use type assertions: `value as ExpectedType`
- Fix the function signature to accept the provided type

**Example:**
```typescript
// Before
function processNumber(num: number) {
  return num * 2;
}
processNumber(undefined);

// After
processNumber(undefined ?? 0);
```

### 5. TS2741: Property Missing in Type

**Error Message:** `Property 'X' is missing in type '{ ... }' but required in type 'Y'.`

**Fixes:**
- Add the missing property to the object
- Make the property optional in the interface/type
- Use a type assertion to override the type check

**Example:**
```typescript
// Before
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

<Modal onClose={() => {}} />

// After
<Modal isOpen={true} onClose={() => {}} />
```

### 6. TS6192: All Imports in Import Declaration are Unused

**Error Message:** `All imports in import declaration are unused.`

**Fixes:**
- Remove the unused import
- Comment out the import if it might be needed later
- Use the imported value somewhere in the code

**Example:**
```typescript
// Before
import { motion } from 'framer-motion';

// After (Option 1)
// Remove the import entirely

// After (Option 2)
// import { motion } from 'framer-motion';
```

### 7. TS2554: Expected X Arguments, but Got Y

**Error Message:** `Expected X arguments, but got Y.`

**Fixes:**
- Add the missing arguments to the function call
- Update the function signature to match the call
- Use optional parameters in the function definition

**Example:**
```typescript
// Before
function fetchData(id: string, options: object) {
  // ...
}
fetchData('123');

// After (Option 1)
fetchData('123', {});

// After (Option 2)
function fetchData(id: string, options?: object) {
  // ...
}
```

## Specific Component Fixes

### 1. RewardModal and ScrollDialog Components

**Error:** Missing `isOpen` prop

**Fix:** Add the `isOpen` prop to all instances of these components:

```typescript
// Before
<RewardModal
  rewards={rewards}
  onClose={handleCloseRewardModal}
/>

// After
<RewardModal
  rewards={rewards}
  onClose={handleCloseRewardModal}
  isOpen={showRewardModal}
/>
```

### 2. Button Component Variant Issues

**Error:** Invalid variant values like "primary" and "danger"

**Fix:** Update to use the correct variant values:

```typescript
// Before
<Button variant="primary">Click Me</Button>
<Button variant="danger">Delete</Button>

// After
<Button variant="filled">Click Me</Button>
<Button variant="error">Delete</Button>
```

### 3. BattlePassTaskRecord Interface

**Error:** Missing properties in the interface

**Fix:** Add the missing properties to the interface:

```typescript
// Before
export interface BattlePassTaskRecord {
  id: number;
  passId: number;
  taskName: string;
  taskType: BattlePassTaskType;
  targetValue: number;
  expReward: number;
  relatedGameActionKey: string;
  isRepeatable: boolean;
  isCompleted?: boolean;
}

// After
export interface BattlePassTaskRecord {
  id: number;
  passId: number;
  taskName: string;
  taskType: BattlePassTaskType;
  targetValue: number;
  expReward: number;
  relatedGameActionKey: string;
  isRepeatable: boolean;
  isCompleted?: boolean;
  estimatedTimeMinutes?: number;
  difficulty?: number;
  taskDescription?: string;
}
```

## Best Practices for Preventing TypeScript Errors

1. **Use proper typing from the start**
   - Define interfaces and types for all data structures
   - Use TypeScript's utility types like `Partial<T>`, `Pick<T>`, `Omit<T>`

2. **Handle nullable values properly**
   - Use optional chaining (`?.`) for properties that might be undefined
   - Use nullish coalescing (`??`) for default values

3. **Be consistent with naming**
   - Use the same property names across related interfaces
   - Follow naming conventions for props and state variables

4. **Document complex types**
   - Add JSDoc comments to explain the purpose of interfaces and types
   - Include examples for non-obvious usage

5. **Use ESLint with TypeScript rules**
   - Configure ESLint to catch common TypeScript issues
   - Run linting as part of your development workflow

6. **Regularly run the TypeScript compiler**
   - Use `npx tsc --noEmit` to check for errors without generating output files
   - Fix errors as they appear rather than letting them accumulate
