export interface PaginationMeta {
  total: number;
  skip: number;
  limit: number;
}

export interface PaginationParams {
  limit?: number;
  skip?: number;
}

export type SortOrder = "asc" | "desc";
