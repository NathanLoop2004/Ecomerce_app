"use client";

import { useGetProductsQuery } from "@/store/api/productsApi";
import ProductGrid from "./ProductGrid";
import ProductGridSkeleton from "./ProductGridSkeleton";

export default function ProductList({
  limit = 20,
  category,
}: {
  limit?: number;
  category?: string;
}) {
  const { data, isLoading, isError, error } = useGetProductsQuery({
    limit,
    category,
  });

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (isError) {
    return (
      <p className="py-12 text-center text-sm text-red-600">
        No se pudieron cargar los productos
        {error && "message" in error ? `: ${error.message}` : "."}
      </p>
    );
  }

  return <ProductGrid products={data?.products ?? []} />;
}
