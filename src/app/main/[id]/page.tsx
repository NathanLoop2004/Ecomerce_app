import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Barcode,
  Boxes,
  CalendarDays,
  PackageCheck,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Star,
  Truck,
  Weight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AvailabilityStatus } from "@/interfaces";
import { AddToCartButton } from "@/components/cart";
import { ProductGallery } from "@/components/products";
import { getProductById } from "@/services/products";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("es", { dateStyle: "medium" });

const availabilityStyles: Record<AvailabilityStatus, string> = {
  "In Stock": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Low Stock": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Out of Stock": "bg-red-50 text-red-700 ring-red-600/20",
};

export default async function ProductDetailPage(
  props: PageProps<"/main/[id]">,
) {
  const { id } = await props.params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId < 1) {
    notFound();
  }

  const product = await getProductById(productId).catch(() => null);

  if (!product) {
    notFound();
  }

  const finalPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <Link
        href="/main"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Volver a productos
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={
            product.images.length > 0 ? product.images : [product.thumbnail]
          }
          title={product.title}
        />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              {product.brand ?? product.category}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {product.title}
            </h1>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 font-medium">
                <Star
                  size={15}
                  className="fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                <span className="text-zinc-600 dark:text-zinc-400">
                  {product.rating.toFixed(1)}
                </span>
              </span>
              <span className="text-zinc-400">
                {product.reviews.length} reseñas
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${availabilityStyles[product.availabilityStatus]}`}
              >
                {product.availabilityStatus}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {priceFormatter.format(finalPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-zinc-400 line-through">
                  {priceFormatter.format(product.price)}
                </span>
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                  -{Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>

          <div className="max-w-xs">
            <AddToCartButton product={product} />
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-zinc-200 pt-5 text-sm dark:border-zinc-800">
            <Detail icon={Barcode} label="SKU" value={product.sku} />
            <Detail
              icon={Boxes}
              label="Stock"
              value={`${product.stock} unidades`}
            />
            <Detail
              icon={ShieldCheck}
              label="Garantía"
              value={product.warrantyInformation}
            />
            <Detail
              icon={Truck}
              label="Envío"
              value={product.shippingInformation}
            />
            <Detail
              icon={RotateCcw}
              label="Devoluciones"
              value={product.returnPolicy}
            />
            <Detail
              icon={PackageCheck}
              label="Pedido mínimo"
              value={`${product.minimumOrderQuantity} unidades`}
            />
            <Detail icon={Weight} label="Peso" value={`${product.weight} g`} />
            <Detail
              icon={Ruler}
              label="Dimensiones"
              value={`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`}
            />
          </dl>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {product.reviews.length > 0 && (
        <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <h2 className="mb-5 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Reseñas
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((review) => (
              <li
                key={`${review.reviewerEmail}-${review.date}-${review.comment}`}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {review.reviewerName}
                  </span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }, (_, index) => (
                      <Star
                        key={index}
                        size={12}
                        className="fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {review.comment}
                </p>
                <span className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
                  <CalendarDays size={12} aria-hidden="true" />
                  {dateFormatter.format(new Date(review.date))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2.5">
      <Icon
        size={16}
        className="mt-0.5 shrink-0 text-zinc-400"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wide text-zinc-400">
          {label}
        </dt>
        <dd className="text-zinc-700 dark:text-zinc-300">{value}</dd>
      </div>
    </div>
  );
}
