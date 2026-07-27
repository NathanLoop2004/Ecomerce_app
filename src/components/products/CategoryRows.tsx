"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  useGetAllProductsQuery,
  useGetCategoriesQuery,
} from "@/store/api/productsApi";
import { ProductRowSkeleton } from "@/components/skeleton";
import MarqueeTrack from "./MarqueeTrack";
import ProductRow from "./ProductRow";

const ROWS_STEP = 3;
const PRODUCTS_PER_ROW = 10;
const HIGHLIGHT_EVERY = 4;

export default function CategoryRows() {
  const [hasEntered, setHasEntered] = useState(false);
  const [visibleRows, setVisibleRows] = useState(ROWS_STEP);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: categories } = useGetCategoriesQuery();
  const { data: catalog, isLoading } = useGetAllProductsQuery(undefined, {
    skip: !hasEntered,
  });

  const rows = useMemo(() => {
    if (!categories || !catalog) return [];

    const grouped = new Map<string, typeof catalog>();
    for (const product of catalog) {
      const bucket = grouped.get(product.category);
      if (bucket) bucket.push(product);
      else grouped.set(product.category, [product]);
    }

    return categories
      .map((category) => ({
        slug: category.slug,
        name: category.name,
        products: (grouped.get(category.slug) ?? []).slice(0, PRODUCTS_PER_ROW),
      }))
      .filter((row) => row.products.length > 0);
  }, [categories, catalog]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        setHasEntered(true);
        setVisibleRows((current) => current + ROWS_STEP);
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const shown = rows.slice(0, visibleRows);
  const hasMore = rows.length > shown.length;
  const isWaiting = hasEntered && (isLoading || rows.length === 0);

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      {shown.map((row, index) => {
        const isHighlighted = (index + 1) % HIGHLIGHT_EVERY === 0;

        if (!isHighlighted) {
          return (
            <ProductRow
              key={row.slug}
              title={row.name}
              categorySlug={row.slug}
              products={row.products}
            />
          );
        }

        return (
          <ColorBand
            key={row.slug}
            variant={Math.floor(index / HIGHLIGHT_EVERY)}
          >
            <div className="mx-auto mb-6 flex w-full max-w-7xl items-baseline justify-between gap-4 px-4">
              <h3 className="text-2xl font-semibold text-white">{row.name}</h3>
              <Link
                href={{
                  pathname: "/products",
                  query: { category: row.slug },
                }}
                className="inline-flex shrink-0 items-center gap-1 text-sm text-white/75 transition-colors hover:text-white"
              >
                Ver todo
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <MarqueeTrack products={row.products} />
          </ColorBand>
        );
      })}

      {isWaiting && (
        <>
          <ProductRowSkeleton />
          <ProductRowSkeleton />
        </>
      )}

      {(hasMore || !hasEntered) && (
        <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
      )}

      {hasEntered && !hasMore && rows.length > 0 && (
        <p className="py-4 text-center text-sm text-zinc-400">
          Ya viste todas las categorías.
        </p>
      )}
    </div>
  );
}

const bandGradients = [
  "from-indigo-600 via-purple-600 to-pink-600",
  "from-emerald-600 via-teal-600 to-cyan-600",
  "from-amber-600 via-orange-600 to-red-600",
  "from-sky-600 via-blue-600 to-indigo-700",
  "from-fuchsia-600 via-rose-600 to-orange-500",
];

function ColorBand({
  variant,
  children,
}: {
  variant: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-r py-10 ${
        bandGradients[variant % bandGradients.length]
      }`}
    >
      {children}
    </section>
  );
}
