// src/hooks/useInternationalizedQuery.ts
import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { ApiError, LocalizedContent } from '@/types';

interface UseInternationalizedQueryResult<TDataPayload, TLabelsBundle, TErrorResponse> {
  data: TDataPayload | undefined | null; // Data can be TDataPayload OR null
  labels: TLabelsBundle | undefined;
  isPending: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: TErrorResponse | null;
  refetch: UseQueryResult<LocalizedContent<TDataPayload, TLabelsBundle>, TErrorResponse>['refetch'];
  status: UseQueryResult<LocalizedContent<TDataPayload, TLabelsBundle>, TErrorResponse>['status'];
  isSuccess: boolean;
}

export function useInternationalizedQuery<
  TLocalizedContent extends LocalizedContent<TDataPayload, TLabelsBundle>,
  TErrorResponse extends Error = ApiError,
  TDataPayload = TLocalizedContent['data'],
  TLabelsBundle = TLocalizedContent['labels'],
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TLocalizedContent, TErrorResponse, TLocalizedContent, TQueryKey>
): UseInternationalizedQueryResult<TDataPayload, TLabelsBundle, TErrorResponse> {
  const {
    data: queryResult,
    isPending,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    status,
    isSuccess,
  } = useQuery<TLocalizedContent, TErrorResponse, TLocalizedContent, TQueryKey>(options);

  return {
    data: queryResult?.data, // queryResult can be undefined during initial fetch
    labels: queryResult?.labels as any, // RE-APPLYING 'as any' FOR DIAGNOSTICS & TO UNBLOCK
    isPending,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    status,
    isSuccess,
  };
} 