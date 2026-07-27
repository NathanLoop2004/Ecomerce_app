import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";
import type {
  ProductCategory,
  ProductSummariesResponse,
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

type ProductsQueryArgs = {
  limit?: number;
  category?: string;
};

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: axiosBaseQuery(),
  keepUnusedDataFor: CACHE_SECONDS,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (build) => ({
    getProducts: build.query<ProductSummariesResponse, ProductsQueryArgs>({
      query: ({ limit = 20, category }) => ({
        url: category ? `/products/category/${category}` : "/products",
        params: { limit, select: SUMMARY_FIELDS.join(",") },
      }),
    }),
    getCategories: build.query<ProductCategory[], void>({
      query: () => ({ url: "/products/categories" }),
    }),
  }),
});

export const { useGetProductsQuery, useGetCategoriesQuery } = productsApi;
