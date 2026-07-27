"use client";

import { useProductQuery } from "@/store/api/useProductQuery";
import type { ProductsQueryArgs } from "@/store/api/productsApi";

export default function ProductCount(args: ProductsQueryArgs) {
  const { products, total, isLoading } = useProductQuery(args);

  if (isLoading || total === 0) return null;

  const from = (args.skip ?? 0) + 1;
  const to = Math.min((args.skip ?? 0) + products.length, total);

  return (
    <span className="text-sm text-zinc-500 dark:text-zinc-400">
      {from}–{to} de {total} productos
    </span>
  );
}
