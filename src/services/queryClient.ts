// src/services/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

// 创建 QueryClient 实例并导出，以便其他模块使用
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false, // Personal preference for demos
      retry: 1, // Retry failed queries once
    },
  },
});
