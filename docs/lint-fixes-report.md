# Lint Fixes Report

## Summary

We've created a set of automated scripts to fix common lint errors in the codebase. These scripts are located in the `scripts/` directory and can be run individually or together.

Initial manual fixes have been made to:
- Fix case declarations in `src/animations/utils.ts`
- Add ESLint configuration for scripts directory

## Details

### Unused Variables

Unused variables were fixed by adding an underscore prefix to the variable name.

### React Hooks Rules

React hooks rules violations were fixed by:
- Moving conditional hook calls outside conditions
- Adding missing dependencies to useEffect hooks

### Explicit Any Types

Explicit any types were replaced with more specific types based on context:
- Function parameters: `unknown`
- Arrays: `unknown[]`
- Records: `Record<string, unknown>`
- Promises: `Promise<unknown>`
- Type assertions: `as unknown`
- Event handlers: `React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>`

### Case Declarations

Lexical declarations in case blocks were fixed by moving the declarations to the beginning of the switch statement.

## Scripts

1. **fix-unused-vars.js**: Fixes unused variables by adding an underscore prefix to variable names.
2. **fix-hooks-rules.js**: Fixes React hooks rules violations by adding missing dependencies and adding TODO comments for conditional hook calls.
3. **fix-explicit-any.js**: Fixes explicit any types by replacing them with more specific types based on context.
4. **fix-case-declarations.js**: Fixes lexical declarations in case blocks by moving them to the beginning of the switch statement.
5. **fix-lint-errors.js**: Runs all the above scripts in sequence.

## Next Steps

1. Run the scripts to fix the lint errors:
   ```
   node scripts/fix-unused-vars.js
   node scripts/fix-hooks-rules.js
   node scripts/fix-explicit-any.js
   node scripts/fix-case-declarations.js
   ```

2. Run the lint check to verify the fixes:
   ```
   npm run lint
   ```

3. Fix any remaining errors manually.

4. Update the TypeScript fixes progress document with the new progress.

## Common Patterns for Manual Fixes

### Unused Variables

Add an underscore prefix to unused variables:

```typescript
// Before
const unusedVar = 'value';

// After
const _unusedVar = 'value';
```

### React Hooks Rules

Move conditional hook calls outside conditions:

```typescript
// Before
if (condition) {
  useEffect(() => {
    // ...
  }, []);
}

// After
const shouldRunEffect = condition;
useEffect(() => {
  if (!shouldRunEffect) return;
  // ...
}, [shouldRunEffect]);
```

Add missing dependencies to useEffect hooks:

```typescript
// Before
useEffect(() => {
  doSomething(value);
}, []);

// After
useEffect(() => {
  doSomething(value);
}, [value]);
```

### Explicit Any Types

Replace explicit any types with more specific types:

```typescript
// Before
const handleChange = (event: any) => {
  // ...
};

// After
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  // ...
};
```

### Case Declarations

Move lexical declarations in case blocks to the beginning of the switch statement:

```typescript
// Before
switch (type) {
  case 'value':
    const variable = getValue();
    return variable;
}

// After
let variable;
switch (type) {
  case 'value':
    variable = getValue();
    return variable;
}
```
