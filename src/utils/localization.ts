// src/utils/localization.ts
import { db } from '@/db-old';

/**
 * Get a localized label from the database
 * @param scopeKey The scope key of the label (e.g., 'abilities')
 * @param labelKey The label key (e.g., 'bambooHeart.name')
 * @param languageCode The language code (e.g., 'en', 'zh')
 * @returns The localized text or null if not found
 */
export async function getLocalizedLabel(
  scopeKey: string,
  labelKey: string,
  languageCode: string
): Promise<string | null> {
  try {
    // Check if the database is initialized
    if (!db.tables.some(table => table.name === 'uiLabels')) {
      console.warn('uiLabels table does not exist yet');
      return null;
    }

    // Query the database for the label
    const label = await db.table('uiLabels')
      .where('[scopeKey+labelKey+languageCode]')
      .equals([scopeKey, labelKey, languageCode])
      .first();

    return label ? label.translatedText : null;
  } catch (error) {
    console.error(`Error getting localized label for ${scopeKey}.${labelKey} in ${languageCode}:`, error);
    return null;
  }
}

/**
 * Get all localized labels for a specific scope and language
 * @param scopeKey The scope key of the labels (e.g., 'abilities')
 * @param languageCode The language code (e.g., 'en', 'zh')
 * @returns An object with label keys as properties and translated text as values
 */
export async function getLocalizedLabels(
  scopeKey: string,
  languageCode: string
): Promise<Record<string, string>> {
  try {
    // Check if the database is initialized
    if (!db.tables.some(table => table.name === 'uiLabels')) {
      console.warn('uiLabels table does not exist yet');
      return {};
    }

    // Query the database for all labels in the scope and language
    const labels = await db.table('uiLabels')
      .where('[scopeKey+languageCode]')
      .equals([scopeKey, languageCode])
      .toArray();

    // Convert to an object with label keys as properties
    const result: Record<string, string> = {};
    for (const label of labels) {
      result[label.labelKey] = label.translatedText;
    }

    return result;
  } catch (error) {
    console.error(`Error getting localized labels for ${scopeKey} in ${languageCode}:`, error);
    return {};
  }
}

/**
 * Get the current language code from localStorage
 * @returns The current language code (defaults to 'en')
 */
export function getCurrentLanguageCode(): string {
  return localStorage.getItem('language') || 'en';
}

/**
 * Set the current language code in localStorage
 * @param languageCode The language code to set
 */
export function setCurrentLanguageCode(languageCode: string): void {
  localStorage.setItem('language', languageCode);
}

/**
 * Format a date according to the current locale
 * @param date The date to format
 * @param options The Intl.DateTimeFormatOptions to use
 * @returns The formatted date string
 */
export function formatLocalizedDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string {
  const languageCode = getCurrentLanguageCode();
  return new Intl.DateTimeFormat(languageCode, options).format(date);
}

/**
 * Format a number according to the current locale
 * @param number The number to format
 * @param options The Intl.NumberFormatOptions to use
 * @returns The formatted number string
 */
export function formatLocalizedNumber(
  number: number,
  options: Intl.NumberFormatOptions = { 
    style: 'decimal'
  }
): string {
  const languageCode = getCurrentLanguageCode();
  return new Intl.NumberFormat(languageCode, options).format(number);
}
