"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/interfaces";

const MIN_ITEMS = 14;

const fadeMask =
  "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]";

export default function MarqueeTrack({
  products,
  secondsPerProduct = 2,
}: {
  products: ProductSummary[];
  secondsPerProduct?: number;
}) {
  const items = useMemo(() => {
    if (products.length === 0) return [];

    const filled: ProductSummary[] = [];
    while (filled.length < MIN_ITEMS) filled.push(...products);

    return filled;
  }, [products]);

  if (items.length === 0) return null;

  return (
    <div className={`group/marquee relative overflow-hidden ${fadeMask}`}>
      <div
        style={{ animationDuration: `${items.length * secondsPerProduct}s` }}
        className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:overflow-x-auto"
      >
        {items.map((product, index) => (
          <MarqueeItem key={`a-${index}`} product={product} />
        ))}
        {items.map((product, index) => (
          <MarqueeItem key={`b-${index}`} product={product} hidden />
        ))}
      </div>
    </div>
  );
}

function MarqueeItem({
  product,
  hidden = false,
}: {
  product: ProductSummary;
  hidden?: boolean;
}) {
  return (
    <Link
      href={`/main/${product.id}`}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      className="group/item mr-4 flex w-36 shrink-0 flex-col gap-2 sm:w-40"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-md transition duration-300 ease-out group-hover/item:-translate-y-1 group-hover/item:shadow-xl motion-reduce:transform-none">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="160px"
          loading="lazy"
          className="object-contain p-3 transition-transform duration-300 group-hover/item:scale-110 motion-reduce:group-hover/item:scale-100"
        />
      </div>
      <span className="truncate text-xs font-medium text-white/80">
        {product.title}
      </span>
    </Link>
  );
}
