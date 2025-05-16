# React Hooks Best Practices

This guide outlines the best practices for using React hooks in the PandaHabit application.

## 1. useEffect

### 1.1 Dependency Arrays

Always include all dependencies used inside the effect in the dependency array:

```typescript
// Good
useEffect(() => {
  const fullName = `${firstName} ${lastName}`;
  console.log(fullName);
}, [firstName, lastName]);

// Avoid
useEffect(() => {
  const fullName = `${firstName} ${lastName}`;
  console.log(fullName);
}, []); // Missing dependencies
```

### 1.2 Handling Functions in Effects

When using functions inside effects, either define them inside the effect or use useCallback:

```typescript
// Option 1: Define inside the effect
useEffect(() => {
  const handleData = (data) => {
    // Process data
  };
  
  fetchData().then(handleData);
}, [fetchData]);

// Option 2: Use useCallback
const handleData = useCallback((data) => {
  // Process data
}, [/* dependencies */]);

useEffect(() => {
  fetchData().then(handleData);
}, [fetchData, handleData]);
```

### 1.3 Cleanup Functions

Always return a cleanup function when needed:

```typescript
useEffect(() => {
  const subscription = subscribe();
  
  return () => {
    unsubscribe(subscription);
  };
}, [subscribe, unsubscribe]);
```

### 1.4 Avoiding Infinite Loops

Be careful with objects and functions in dependency arrays:

```typescript
// Avoid - will cause infinite loop
useEffect(() => {
  // Effect code
}, [{ key: 'value' }]); // New object created on each render

// Good
const obj = useMemo(() => ({ key: 'value' }), []);
useEffect(() => {
  // Effect code
}, [obj]);
```

## 2. useCallback

### 2.1 When to Use useCallback

Use useCallback for:
- Event handlers passed to child components
- Functions used in dependency arrays of other hooks
- Functions that should maintain referential equality

```typescript
// Good
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);

// Avoid for simple functions not passed to children
const calculateTotal = () => price * quantity; // No need for useCallback
```

### 2.2 Dependency Arrays

Include all dependencies used inside the callback:

```typescript
// Good
const handleSubmit = useCallback(() => {
  submitForm(formData);
}, [formData, submitForm]);

// Avoid
const handleSubmit = useCallback(() => {
  submitForm(formData);
}, []); // Missing dependencies
```

## 3. useMemo

### 3.1 When to Use useMemo

Use useMemo for:
- Expensive calculations
- Creating objects or arrays that should maintain referential equality
- Values used in dependency arrays of other hooks

```typescript
// Good - expensive calculation
const sortedItems = useMemo(() => {
  return items.slice().sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// Good - referential equality for objects
const style = useMemo(() => ({
  color: isActive ? 'red' : 'black',
  fontSize: size
}), [isActive, size]);
```

### 3.2 Dependency Arrays

Include all dependencies used in the calculation:

```typescript
// Good
const filteredItems = useMemo(() => {
  return items.filter(item => item.category === selectedCategory);
}, [items, selectedCategory]);
```

## 4. useState

### 4.1 Functional Updates

Use functional updates when the new state depends on the previous state:

```typescript
// Good
setCount(prevCount => prevCount + 1);

// Avoid
setCount(count + 1);
```

### 4.2 Object State

When updating object state, make sure to spread the previous state:

```typescript
// Good
setUser(prevUser => ({ ...prevUser, name: 'John' }));

// Avoid
setUser({ name: 'John' }); // Loses other properties
```

## 5. Custom Hooks

### 5.1 Naming Convention

Name custom hooks with the 'use' prefix:

```typescript
// Good
function useLocalizedView() { /* ... */ }

// Avoid
function getLocalizedView() { /* ... */ }
```

### 5.2 Return Values

Return values in a consistent format:

```typescript
// Good - return object with named properties
return { data, isLoading, error, refetch };

// Avoid - return array with unnamed values (except for useState-like hooks)
return [data, isLoading, error, refetch];
```

### 5.3 Error Handling

Handle errors gracefully within custom hooks:

```typescript
function useData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError);
  }, []);
  
  return { data, error };
}
```

## 6. Data Refresh Patterns

### 6.1 Using DataRefreshProvider

Use the DataRefreshProvider for partial UI updates:

```typescript
// In parent component
<DataRefreshProvider>
  <ChildComponent />
</DataRefreshProvider>

// In child component
const { triggerDataRefresh } = useDataRefresh();

const handleUpdate = async () => {
  await updateData();
  triggerDataRefresh('tableName');
};
```

### 6.2 Registering for Updates

Register components to listen for data changes:

```typescript
function MyComponent() {
  const [data, setData] = useState([]);
  
  const loadData = useCallback(async () => {
    const result = await fetchData();
    setData(result);
  }, []);
  
  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Register for updates
  useRegisterTableRefresh('tableName', loadData);
  
  return (/* component JSX */);
}
```

## 7. Type Safety

### 7.1 Typed Event Handlers

Use proper types for event handlers:

```typescript
// Good
const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
}, []);

// Avoid
const handleChange = useCallback((e: any) => {
  setValue(e.target.value);
}, []);
```

### 7.2 Typed Hook Returns

Properly type the return values of custom hooks:

```typescript
function useLocalizedView<TData, TLabels>(): {
  data: TData | null;
  labels: TLabels | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  // Hook implementation
}
```

### 7.3 Typed State

Use proper types for state:

```typescript
// Good
const [user, setUser] = useState<User | null>(null);

// Avoid
const [user, setUser] = useState(null);
```
