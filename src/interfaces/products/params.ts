import type { PaginationParams, SortOrder } from "../api/pagination";
import type { ProductField } from "./product";
import type { ProductCategorySlug } from "./category";

export interface ProductListParams extends PaginationParams {
  select?: ProductField[];
  sortBy?: ProductField;
  order?: SortOrder;
}

export interface ProductSearchParams extends ProductListParams {
  q: string;
}

export interface ProductsByCategoryParams extends ProductListParams {
  category: ProductCategorySlug;
}
