export interface CadPaginator {
  offset: number;
  limit: number;
  includeTotals: boolean;
}

export interface CadPageRequest extends CadPaginator{
  filter: string[];
  sort: string[];
}

export interface CadPageResult<T> extends CadPaginator {
  totalElements?: number;
  totalPages?: number;
  hasPrevious: boolean;
  hasNext: boolean;
  content: T[];
}
