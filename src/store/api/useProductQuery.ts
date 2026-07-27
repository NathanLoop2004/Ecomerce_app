"use client";

import { useMemo } from "react";
import {
  useGetAllProductsQuery,
  useGetProductsQuery,
} from "./productsApi";
import type { ProductsQueryArgs } from "./productsApi";
import type { ProductSummary } from "@/interfaces";

export type ProductQueryResult = {
  products: ProductSummary[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
};

export function useProductQuery({
  limit = 12,
  skip = 0,
  category,
  search,
}: ProductsQueryArgs): ProductQueryResult {
  const term = search?.trim().toLowerCase() ?? "";
  const isSearching = term.length > 0;

  const paged = useGetProductsQuery(
    { limit, skip, category },
    { skip: isSearching },
  );

  const catalog = useGetAllProductsQuery(undefined, { skip: !isSearching });

  const matches = useMemo(() => {
    if (!isSearching) return [];

    const all = catalog.data ?? [];
    const scoped = category
      ? all.filter((product) => product.category === category)
      : all;

    return scoped.filter((product) =>
      product.title.toLowerCase().includes(term),
    );
  }, [isSearching, catalog.data, category, term]);

  if (isSearching) {
    return {
      products: matches.slice(skip, skip + limit),
      total: matches.length,
      isLoading: catalog.isLoading,
      isError: catalog.isError,
      errorMessage:
        catalog.error && "message" in catalog.error
          ? catalog.error.message
          : undefined,
    };
  }

  return {
    products: paged.data?.products ?? [],
    total: paged.data?.total ?? 0,
    isLoading: paged.isLoading,
    isError: paged.isError,
    errorMessage:
      paged.error && "message" in paged.error ? paged.error.message : undefined,
  };
}
