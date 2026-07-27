"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { productsApi, useGetCategoriesQuery } from "@/store/api/productsApi";
import type { ProductCategory } from "@/interfaces";

const SLIDE_COUNT = 5;
const AUTOPLAY_MS = 5000;

const gradients = [
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-amber-500 via-orange-500 to-red-500",
  "from-sky-500 via-blue-500 to-indigo-600",
  "from-fuchsia-500 via-rose-500 to-orange-400",
];

function pickRandom(categories: ProductCategory[], count: number) {
  const pool = [...categories];
  const picked: ProductCategory[] = [];

  while (pool.length > 0 && picked.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool[index]);
    pool.splice(index, 1);
  }

  return picked;
}

export default function CategoryCarousel() {
  const { data } = useGetCategoriesQuery();
  const prefetchProducts = productsApi.usePrefetch("getProducts");

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = useMemo(
    () => (data ? pickRandom(data, SLIDE_COUNT) : []),
    [data],
  );

  useEffect(() => {
    if (slides.length < 2 || isPaused) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = setInterval(() => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const next = (Math.round(scroller.scrollLeft / scroller.clientWidth) + 1) % slides.length;
      scroller.scrollTo({ left: next * scroller.clientWidth });
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (slides.length === 0) {
    return (
      <div className="h-56 w-full animate-shimmer bg-linear-to-r from-zinc-100 via-zinc-200 to-zinc-100 bg-size-[200%_100%] motion-reduce:animate-none sm:h-72 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" />
    );
  }

  const goTo = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const target = (index + slides.length) % slides.length;
    scroller.scrollTo({ left: target * scroller.clientWidth });
  };

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Categorías destacadas"
      className="relative w-full"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        ref={scrollerRef}
        onScroll={(event) => {
          const scroller = event.currentTarget;
          if (scroller.clientWidth === 0) return;
          setActive(Math.round(scroller.scrollLeft / scroller.clientWidth));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((category, index) => (
          <div
            key={category.slug}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${slides.length}: ${category.name}`}
            className={`flex h-56 w-full shrink-0 snap-center items-center justify-center bg-linear-to-br sm:h-72 ${gradients[index % gradients.length]}`}
          >
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Categoría destacada
              </span>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {category.name}
              </h2>
              <Link
                href={{
                  pathname: "/products",
                  query: { category: category.slug },
                }}
                onMouseEnter={() =>
                  prefetchProducts({ limit: 12, skip: 0, category: category.slug })
                }
                className="group mt-2 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition duration-200 ease-out hover:bg-zinc-100 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
              >
                Ver productos
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(active - 1)}
        aria-label="Categoría anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/25 p-2 text-white backdrop-blur-sm transition duration-200 ease-out hover:bg-black/40 active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => goTo(active + 1)}
        aria-label="Categoría siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/25 p-2 text-white backdrop-blur-sm transition duration-200 ease-out hover:bg-black/40 active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((category, index) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Ir a ${category.name}`}
            aria-current={index === active}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === active ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
