"use client";

import { RotateCcw } from "lucide-react";
import { useProductQuery } from "@/store/api/useProductQuery";
import type { ProductsQueryArgs } from "@/store/api/productsApi";
import { ProductGridSkeleton } from "@/components/skeleton";
import ProductGrid from "./ProductGrid";
import PullToRefresh from "./PullToRefresh";

export default function ProductList(args: ProductsQueryArgs) {
  const { products, isLoading, isError, errorMessage, refetch } =
    useProductQuery(args);

  if (isLoading) {
    return <ProductGridSkeleton count={args.limit} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-sm text-red-600">
          No se pudieron cargar los productos
          {errorMessage ? `: ${errorMessage}` : "."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition duration-200 ease-out hover:bg-zinc-700 active:scale-95 active:duration-75 motion-reduce:transition-none motion-reduce:active:scale-100 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reintentar
        </button>
      </div>
    );
  }

  if (products.length === 0 && args.search) {
    return (
      <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">
        No encontramos productos cuyo nombre contenga «{args.search}».
      </p>
    );
  }

  return (
    <PullToRefresh onRefresh={refetch}>
      <ProductGrid products={products} />
    </PullToRefresh>
  );
}
