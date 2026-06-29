export type ApiResponse<TData> = {
  data: TData;
  message?: string;
};

export type ApiErrorBody = {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
};

export type PaginatedResponse<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
};
