// src/hooks/useLocalizedView.ts
import { useLanguage } from '@/context/LanguageProvider';
import { useInternationalizedQuery } from './useInternationalizedQuery';
import type { ApiError, Language, LocalizedContent } from '@/types';
import { QueryKey, UseQueryOptions } from '@tanstack/react-query';

export function useLocalizedView<
  TDataPayload,
  TLabelsBundle
>(
  viewQueryKey: string | QueryKey,
  fetchViewFn: (lang: Language) => Promise<LocalizedContent<TDataPayload, TLabelsBundle>>,
  options?: Omit<UseQueryOptions<LocalizedContent<TDataPayload, TLabelsBundle>, ApiError, LocalizedContent<TDataPayload, TLabelsBundle>, QueryKey>, 'queryKey' | 'queryFn'>
) {
  const { language } = useLanguage();
  const fullQueryKeyWithLang: QueryKey = Array.isArray(viewQueryKey)
    ? [...viewQueryKey, language]
    : [viewQueryKey, language];

  return useInternationalizedQuery<
    LocalizedContent<TDataPayload, TLabelsBundle>,
    ApiError,
    TDataPayload,
    TLabelsBundle
  >({
    queryKey: fullQueryKeyWithLang,
    queryFn: () => fetchViewFn(language),
    enabled: !!language && (options?.enabled === undefined || options.enabled),
    ...options,
  });
} 