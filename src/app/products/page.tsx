import Link from "next/link";
import { Package, X } from "lucide-react";
import { ProductCount, ProductList } from "@/components/products";
import { CategoryTitle } from "@/components/categories";

const PAGE_LIMIT = 50;

export default async function ProductsPage(props: PageProps<"/products">) {
  const { category } = await props.searchParams;
  const selected = typeof category === "string" ? category : undefined;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          <Package size={22} aria-hidden="true" />
          <CategoryTitle slug={selected} />
        </h1>
        <ProductCount limit={PAGE_LIMIT} category={selected} />
      </div>

      {selected && (
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          <X size={14} aria-hidden="true" />
          Quitar filtro
        </Link>
      )}

      <ProductList limit={PAGE_LIMIT} category={selected} />
    </div>
  );
}
