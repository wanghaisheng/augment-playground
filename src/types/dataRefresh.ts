// src/types/dataRefresh.ts

/**
 * 数据刷新事件类型
 */
export interface DataRefreshEvent {
  table: string;
  data?: unknown;
}
