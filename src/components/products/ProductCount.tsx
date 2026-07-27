"use client";

import { useGetProductsQuery } from "@/store/api/productsApi";

export default function ProductCount({
  limit = 20,
  category,
}: {
  limit?: number;
  category?: string;
}) {
  const { data } = useGetProductsQuery({ limit, category });

  if (data === undefined) return null;

  return (
    <span className="text-sm text-zinc-500 dark:text-zinc-400">
      {data.total} productos
    </span>
  );
}
