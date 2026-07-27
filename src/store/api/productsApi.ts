import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";
import type {
  ProductCategory,
  ProductSummariesResponse,
  ProductSummary,
  ProductSummaryField,
} from "@/interfaces";

const SUMMARY_FIELDS: ProductSummaryField[] = [
  "title",
  "price",
  "thumbnail",
  "brand",
  "rating",
  "discountPercentage",
  "availabilityStatus",
  "category",
];

const CACHE_SECONDS = 3600;

export type ProductsQueryArgs = {
  limit?: number;
  skip?: number;
  category?: string;
  search?: string;
};

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: axiosBaseQuery(),
  keepUnusedDataFor: CACHE_SECONDS,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (build) => ({
    getProducts: build.query<ProductSummariesResponse, ProductsQueryArgs>({
      query: ({ limit = 12, skip = 0, category, search }) => {
        const params: Record<string, string | number> = {
          limit,
          skip,
          select: SUMMARY_FIELDS.join(","),
        };

        if (search) {
          return { url: "/products/search", params: { ...params, q: search } };
        }

        return {
          url: category ? `/products/category/${category}` : "/products",
          params,
        };
      },
    }),
    getAllProducts: build.query<ProductSummary[], void>({
      query: () => ({
        url: "/products",
        params: { limit: 0, select: SUMMARY_FIELDS.join(",") },
      }),
      transformResponse: (response: ProductSummariesResponse) =>
        response.products,
    }),
    getCategories: build.query<ProductCategory[], void>({
      query: () => ({ url: "/products/categories" }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetAllProductsQuery,
  useGetCategoriesQuery,
} = productsApi;
