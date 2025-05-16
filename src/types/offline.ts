export interface OfflineStateRecord {
  id?: number;
  isOnline: boolean;
  lastOnlineTime: Date;
  lastOfflineTime: Date | null;
  pendingSyncCount: number;
  updatedAt: Date;
}

export interface OfflineActionRecord {
  id?: number;
  actionType: string;
  actionData: string; // JSON string
  tableName: string;
  recordId: number | string | null;
  createdAt: Date;
  processedAt: Date | null;
  syncItemId: number | null;
  isError: boolean;
  errorMessage: string | null;
} 