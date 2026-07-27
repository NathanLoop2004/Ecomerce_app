"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductSummary } from "@/interfaces";
import ProductCard from "./ProductCard";

export default function ProductRow({
  title,
  categorySlug,
  products,
}: {
  title: string;
  categorySlug: string;
  products: ProductSummary[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8 });
  };

  if (products.length === 0) return null;

  return (
    <section className="group/row relative w-full min-w-0">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <Link
          href={{ pathname: "/products", query: { category: categorySlug } }}
          className="inline-flex shrink-0 items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Ver todo
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div
        ref={scrollerRef}
        className="flex w-full min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-3 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="w-40 shrink-0 snap-start sm:w-44 lg:w-52"
          >
            <ProductCard product={product} priority={false} />
            <span className="sr-only">
              {index + 1} de {products.length}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label={`Desplazar ${title} hacia la izquierda`}
        className="absolute left-0 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-zinc-700 opacity-0 shadow-md transition duration-200 ease-out hover:bg-white focus-visible:opacity-100 group-hover/row:opacity-100 active:scale-90 motion-reduce:transition-none lg:block dark:bg-zinc-900/90 dark:text-zinc-200"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label={`Desplazar ${title} hacia la derecha`}
        className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-zinc-700 opacity-0 shadow-md transition duration-200 ease-out hover:bg-white focus-visible:opacity-100 group-hover/row:opacity-100 active:scale-90 motion-reduce:transition-none lg:block dark:bg-zinc-900/90 dark:text-zinc-200"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </section>
  );
}
