import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { AvailabilityStatus, ProductSummary } from "@/interfaces";
import { AddToCartButton } from "@/components/cart";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const availabilityStyles: Record<AvailabilityStatus, string> = {
  "In Stock": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Low Stock": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Out of Stock": "bg-red-50 text-red-700 ring-red-600/20",
};

export default function ProductCard({
  product,
  priority = false,
}: {
  product: ProductSummary;
  priority?: boolean;
}) {
  const finalPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <Link
        href={`/main/${product.id}`}
        className="flex flex-1 flex-col rounded-t-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-white"
      >
        <div className="relative aspect-square overflow-hidden bg-linear-to-br from-zinc-50 to-zinc-200 dark:from-zinc-800 dark:to-zinc-950">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-110"
          />

          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}

          <span
            className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${availabilityStyles[product.availabilityStatus]}`}
          >
            {product.availabilityStatus}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              {product.brand ?? product.category}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
              <Star
                size={13}
                className="fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              <span className="text-zinc-500 dark:text-zinc-400">
                {product.rating.toFixed(1)}
              </span>
            </span>
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
            {product.title}
          </h3>

          <div className="mt-auto flex items-baseline gap-2 pt-3">
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {priceFormatter.format(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-zinc-400 line-through">
                {priceFormatter.format(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
