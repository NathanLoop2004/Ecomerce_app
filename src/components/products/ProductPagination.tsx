"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productsApi } from "@/store/api/productsApi";
import { useProductQuery } from "@/store/api/useProductQuery";

const linkStyles =
  "inline-flex items-center gap-1 rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800";

const disabledStyles =
  "inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-zinc-100 px-3 py-2 text-sm font-medium text-zinc-300 dark:border-zinc-800 dark:text-zinc-700";

export default function ProductPagination({
  page,
  limit,
  skip,
  category,
  search,
}: {
  page: number;
  limit: number;
  skip: number;
  category?: string;
  search?: string;
}) {
  const { total } = useProductQuery({ limit, skip, category, search });
  const prefetchProducts = productsApi.usePrefetch("getProducts");

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isSearching = Boolean(search);

  useEffect(() => {
    if (total === 0 || isSearching) return;

    if (page < totalPages) {
      prefetchProducts({ limit, skip: page * limit, category });
    }

    if (page > 1) {
      prefetchProducts({ limit, skip: (page - 2) * limit, category });
    }
  }, [
    total,
    page,
    totalPages,
    limit,
    category,
    isSearching,
    prefetchProducts,
  ]);

  if (total === 0 || totalPages <= 1) return null;

  const buildHref = (target: number) => ({
    pathname: "/products" as const,
    query: {
      ...(search ? { q: search } : {}),
      ...(category ? { category } : {}),
      ...(target > 1 ? { page: target } : {}),
    },
  });

  const warmUp = (target: number) => {
    if (isSearching) return;
    prefetchProducts({ limit, skip: (target - 1) * limit, category });
  };

  return (
    <nav
      aria-label="Paginación de productos"
      className="mt-8 flex items-center justify-between gap-4"
    >
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          onMouseEnter={() => warmUp(page - 1)}
          onFocus={() => warmUp(page - 1)}
          className={linkStyles}
        >
          <ChevronLeft size={15} aria-hidden="true" />
          Anterior
        </Link>
      ) : (
        <span className={disabledStyles} aria-disabled="true">
          <ChevronLeft size={15} aria-hidden="true" />
          Anterior
        </span>
      )}

      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        Página {page} de {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          onMouseEnter={() => warmUp(page + 1)}
          onFocus={() => warmUp(page + 1)}
          className={linkStyles}
        >
          Siguiente
          <ChevronRight size={15} aria-hidden="true" />
        </Link>
      ) : (
        <span className={disabledStyles} aria-disabled="true">
          Siguiente
          <ChevronRight size={15} aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
