"use client";

import { useProductQuery } from "@/store/api/useProductQuery";
import type { ProductsQueryArgs } from "@/store/api/productsApi";
import { ProductGridSkeleton } from "@/components/skeleton";
import ProductGrid from "./ProductGrid";

export default function ProductList(args: ProductsQueryArgs) {
  const { products, isLoading, isError, errorMessage } = useProductQuery(args);

  if (isLoading) {
    return <ProductGridSkeleton count={args.limit} />;
  }

  if (isError) {
    return (
      <p className="py-12 text-center text-sm text-red-600">
        No se pudieron cargar los productos
        {errorMessage ? `: ${errorMessage}` : "."}
      </p>
    );
  }

  if (products.length === 0 && args.search) {
    return (
      <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">
        No encontramos productos cuyo nombre contenga «{args.search}».
      </p>
    );
  }

  return <ProductGrid products={products} />;
}
