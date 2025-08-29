export interface AppPaginator {
  offset: number;
  limit: number;
  includeTotals: boolean;
}

export interface AppPageRequest extends AppPaginator{
  filter: string[];
  sort: string[];
}

export interface AppPageResult<T> extends AppPaginator {
  totalElements?: number;
  totalPages?: number;
  hasPrevious: boolean;
  hasNext: boolean;
  content: T[];
}
