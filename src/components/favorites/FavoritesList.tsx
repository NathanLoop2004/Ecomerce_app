"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearFavorites,
  selectFavoriteIds,
  selectFavoritesHydrated,
} from "@/store/features/favorites/favoritesSlice";
import { useGetAllProductsQuery } from "@/store/api/productsApi";
import { ProductGrid } from "@/components/products";
import { ProductGridSkeleton } from "@/components/skeleton";

export default function FavoritesList() {
  const dispatch = useAppDispatch();
  const isHydrated = useAppSelector(selectFavoritesHydrated);
  const favoriteIds = useAppSelector(selectFavoriteIds);

  const { data: catalog, isLoading } = useGetAllProductsQuery(undefined, {
    skip: !isHydrated || favoriteIds.length === 0,
  });

  const products = useMemo(() => {
    if (!catalog) return [];

    const wanted = new Set(favoriteIds);

    return catalog.filter((product) => wanted.has(String(product.id)));
  }, [catalog, favoriteIds]);

  if (!isHydrated) {
    return <ProductGridSkeleton count={4} />;
  }

  if (favoriteIds.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-zinc-200 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <Heart size={40} className="text-zinc-300" aria-hidden="true" />
        <p className="text-zinc-500 dark:text-zinc-400">
          Todavía no marcaste ningún producto como favorito.
        </p>
        <Link
          href="/main"
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Ver productos
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <ProductGridSkeleton count={favoriteIds.length} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {products.length} de {favoriteIds.length} guardados
        </span>

        <button
          type="button"
          onClick={() => dispatch(clearFavorites())}
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <Trash2 size={14} aria-hidden="true" />
          Vaciar favoritos
        </button>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
