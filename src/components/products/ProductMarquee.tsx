"use client";

import { useEffect, useRef, useState } from "react";
import { useGetAllProductsQuery } from "@/store/api/productsApi";
import MarqueeTrack from "./MarqueeTrack";

export default function ProductMarquee() {
  const [hasEntered, setHasEntered] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data } = useGetAllProductsQuery(undefined, { skip: !hasEntered });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setHasEntered(true);
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const products = data ?? [];

  return (
    <section
      ref={sentinelRef}
      className="w-full bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 py-10"
    >
      <div className="mx-auto mb-6 w-full max-w-7xl px-4">
        <h2 className="text-2xl font-semibold text-white">Todo el catálogo</h2>
        <p className="mt-1 text-sm text-white/70">
          {products.length > 0
            ? `${products.length} productos`
            : "Cargando productos..."}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex gap-4 overflow-hidden px-4">
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={index}
              className="h-36 w-36 shrink-0 animate-shimmer rounded-xl bg-linear-to-r from-white/20 via-white/40 to-white/20 bg-size-[200%_100%] motion-reduce:animate-none sm:w-40"
            />
          ))}
        </div>
      ) : (
        <MarqueeTrack products={products} />
      )}
    </section>
  );
}
