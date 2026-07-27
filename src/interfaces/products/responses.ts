import type { PaginationMeta } from "../api/pagination";
import type {
  Product,
  ProductField,
  ProductSelection,
  ProductSummary,
} from "./product";
import type { ProductCategory, ProductCategorySlug } from "./category";

export interface ProductsResponse extends PaginationMeta {
  products: Product[];
}

export interface ProductSummariesResponse extends PaginationMeta {
  products: ProductSummary[];
}

export interface ProductsSelectionResponse<TField extends ProductField>
  extends PaginationMeta {
  products: ProductSelection<TField>[];
}

export type ProductResponse = Product;

export type ProductCategoriesResponse = ProductCategory[];

export type ProductCategoryListResponse = ProductCategorySlug[];
