// src/types/label-utils.ts

/**
 * Utility type to make all properties in a label bundle required
 * This helps identify missing label properties during development
 */
export type RequiredLabels<T> = {
  [K in keyof T]-?: T[K] extends object ? RequiredLabels<T[K]> : NonNullable<T[K]>;
};

/**
 * Utility type to make all properties in a label bundle optional
 * This helps with partial label bundles
 */
export type OptionalLabels<T> = {
  [K in keyof T]?: T[K] extends object ? OptionalLabels<T[K]> : T[K];
};

/**
 * Utility type to make all properties in a label bundle deeply partial
 * This helps with nested partial label bundles
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Utility type to create a label validator function type
 * Used to validate that all required labels are present in a bundle
 */
export type LabelValidator<T> = (labels: T) => boolean;

/**
 * Creates a validator function for a label bundle
 * @param requiredKeys An array of required keys in the label bundle
 * @returns A function that validates if all required keys are present in the bundle
 */
export function createLabelValidator<T extends object>(requiredKeys: (keyof T)[]): LabelValidator<T> {
  return (labels: T): boolean => {
    return requiredKeys.every(key => key in labels && labels[key] !== undefined);
  };
}

/**
 * Utility type to create a label bundle with nested properties
 * This helps ensure that all nested properties are properly typed
 */
export type NestedLabelBundle<T> = {
  [K in keyof T]: T[K] extends object ? NestedLabelBundle<T[K]> : string;
};

/**
 * Utility function to merge label bundles with proper fallbacks
 * @param primary The primary label bundle (from API/database)
 * @param fallback The fallback label bundle (hardcoded defaults)
 * @returns A merged label bundle with all properties
 */
export function mergeLabelBundles<T>(
  primary: Partial<T> | undefined | null,
  fallback: Partial<T>
): T {
  if (!primary || typeof primary !== 'object' || primary === null) {
    return fallback as T;
  }
  const result = { ...fallback } as T;
  for (const key in primary) {
    if (Object.prototype.hasOwnProperty.call(primary, key)) {
      const value = primary[key];
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          result[key] = mergeLabelBundles(
            value as Partial<T[typeof key]>,
            (fallback[key] as Partial<T[typeof key]>) || {}
          ) as T[typeof key];
        } else {
          result[key] = value as T[typeof key];
        }
      }
    }
  }
  return result;
}
