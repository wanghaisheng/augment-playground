// src/types/callback-types.ts

/**
 * Type for a generic callback function with no parameters and no return value
 */
export type VoidCallback = () => void;

/**
 * Type for a generic callback function with no parameters and a promise return value
 */
export type AsyncVoidCallback = () => Promise<void>;

/**
 * Type for a generic callback function with a single parameter and no return value
 */
export type ParamCallback<T> = (param: T) => void;

/**
 * Type for a generic callback function with a single parameter and a promise return value
 */
export type AsyncParamCallback<T> = (param: T) => Promise<void>;

/**
 * Type for a generic callback function with multiple parameters and no return value
 */
export type MultiParamCallback<T extends unknown[]> = (...params: T) => void;

/**
 * Type for a generic callback function with multiple parameters and a promise return value
 */
export type AsyncMultiParamCallback<T extends unknown[]> = (...params: T) => Promise<void>;

/**
 * Type for a generic callback function with a return value
 */
export type ReturnCallback<R> = () => R;

/**
 * Type for a generic callback function with a parameter and a return value
 */
export type ParamReturnCallback<T, R> = (param: T) => R;

/**
 * Type for a generic callback function with multiple parameters and a return value
 */
export type MultiParamReturnCallback<T extends unknown[], R> = (...params: T) => R;

/**
 * Type for a generic callback function with a promise return value
 */
export type AsyncReturnCallback<R> = () => Promise<R>;

/**
 * Type for a generic callback function with a parameter and a promise return value
 */
export type AsyncParamReturnCallback<T, R> = (param: T) => Promise<R>;

/**
 * Type for a generic callback function with multiple parameters and a promise return value
 */
export type AsyncMultiParamReturnCallback<T extends unknown[], R> = (...params: T) => Promise<R>;

// Event handler types

/**
 * Type for a React change event handler for input elements
 */
export type InputChangeHandler = React.ChangeEventHandler<HTMLInputElement>;

/**
 * Type for a React change event handler for textarea elements
 */
export type TextAreaChangeHandler = React.ChangeEventHandler<HTMLTextAreaElement>;

/**
 * Type for a React change event handler for select elements
 */
export type SelectChangeHandler = React.ChangeEventHandler<HTMLSelectElement>;

/**
 * Type for a React form submit event handler
 */
export type FormSubmitHandler = React.FormEventHandler<HTMLFormElement>;

/**
 * Type for a React click event handler
 */
export type ClickHandler = React.MouseEventHandler<HTMLElement>;

/**
 * Type for a React button click event handler
 */
export type ButtonClickHandler = React.MouseEventHandler<HTMLButtonElement>;

/**
 * Type for a React focus event handler
 */
export type FocusHandler = React.FocusEventHandler<HTMLElement>;

/**
 * Type for a React blur event handler
 */
export type BlurHandler = React.FocusEventHandler<HTMLElement>;

/**
 * Type for a React key press event handler
 */
export type KeyPressHandler = React.KeyboardEventHandler<HTMLElement>;

/**
 * Type for a React drag event handler
 */
export type DragHandler = React.DragEventHandler<HTMLElement>;

/**
 * Type for a React drop event handler
 */
export type DropHandler = React.DragEventHandler<HTMLElement>;

// Typed event handlers with parameters

/**
 * Type for a handler that takes a value and returns void
 */
export type ValueChangeHandler<T> = (value: T) => void;

/**
 * Type for a handler that takes a value and returns a promise
 */
export type AsyncValueChangeHandler<T> = (value: T) => Promise<void>;

/**
 * Type for a handler that takes an ID and returns void
 */
export type IdHandler = (id: number | string) => void;

/**
 * Type for a handler that takes an ID and returns a promise
 */
export type AsyncIdHandler = (id: number | string) => Promise<void>;

/**
 * Type for a handler that takes an item and returns void
 */
export type ItemHandler<T> = (item: T) => void;

/**
 * Type for a handler that takes an item and returns a promise
 */
export type AsyncItemHandler<T> = (item: T) => Promise<void>;
