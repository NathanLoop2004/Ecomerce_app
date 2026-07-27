"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const hasMultiple = images.length > 1;

  const goTo = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const target = Math.max(0, Math.min(index, images.length - 1));
    scroller.scrollTo({ left: target * scroller.clientWidth });
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scroller = event.currentTarget;
    if (scroller.clientWidth === 0) return;

    setActive(Math.round(scroller.scrollLeft / scroller.clientWidth));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label={`Fotos de ${title}`}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl border border-zinc-200 bg-linear-to-br from-zinc-50 to-zinc-200 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-zinc-900 motion-reduce:scroll-auto dark:border-zinc-800 dark:from-zinc-800 dark:to-zinc-950 dark:focus-visible:ring-white [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <div
              key={image}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`Imagen ${index + 1} de ${images.length}`}
              className="relative aspect-square w-full shrink-0 snap-center"
            >
              <Image
                src={image}
                alt={`${title} — imagen ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
                className="object-contain p-8"
              />
            </div>
          ))}
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-zinc-700 shadow-md transition duration-200 ease-out hover:bg-white active:scale-90 disabled:pointer-events-none disabled:opacity-0 motion-reduce:transition-none motion-reduce:active:scale-100 dark:bg-zinc-900/90 dark:text-zinc-200"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === images.length - 1}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-zinc-700 shadow-md transition duration-200 ease-out hover:bg-white active:scale-90 disabled:pointer-events-none disabled:opacity-0 motion-reduce:transition-none motion-reduce:active:scale-100 dark:bg-zinc-900/90 dark:text-zinc-200"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-2.5 py-1.5 backdrop-blur-sm">
              {images.map((image, index) => (
                <span
                  key={image}
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === active ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ver imagen ${index + 1}`}
              aria-current={index === active}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-white transition duration-200 ease-out hover:opacity-100 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 dark:bg-zinc-900 ${
                index === active
                  ? "border-zinc-900 opacity-100 dark:border-zinc-100"
                  : "border-zinc-200 opacity-60 dark:border-zinc-800"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="15vw"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
