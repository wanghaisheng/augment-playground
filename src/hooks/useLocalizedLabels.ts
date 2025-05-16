// src/hooks/useLocalizedLabels.ts
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import { db } from '@/db-old';

/**
 * 本地化标签钩子的返回类型
 */
interface UseLocalizedLabelsResult<T> {
  /** 本地化的标签 */
  labels: T;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 加载错误 */
  error: Error | null;
}

/**
 * 获取本地化标签的钩子
 * 
 * @param scope 标签的作用域
 * @param defaultLabels 默认标签（当数据库中没有对应标签时使用）
 * @returns 本地化的标签、加载状态和错误
 */
export function useLocalizedLabels<T extends Record<string, string>>(
  scope: string,
  defaultLabels: T
): UseLocalizedLabelsResult<T> {
  const { language } = useLanguage();
  const [labels, setLabels] = useState<T>(defaultLabels);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        setIsLoading(true);
        
        // 从数据库获取指定作用域和语言的标签
        const uiLabels = await db.table('uiLabels')
          .where({ scopeKey: scope, languageCode: language })
          .toArray();
        
        if (uiLabels.length > 0) {
          // 将数据库中的标签转换为对象
          const fetchedLabels = uiLabels.reduce((acc, label) => {
            return {
              ...acc,
              [label.labelKey]: label.translatedText
            };
          }, {} as Record<string, string>);
          
          // 合并默认标签和获取的标签
          setLabels({
            ...defaultLabels,
            ...fetchedLabels
          });
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error(`Error fetching labels for scope ${scope}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    };

    fetchLabels();
  }, [scope, language]);

  return { labels, isLoading, error };
}
