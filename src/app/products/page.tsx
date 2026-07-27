import Link from "next/link";
import { Package, X } from "lucide-react";
import {
  ProductCount,
  ProductList,
  ProductPagination,
  ProductSearch,
} from "@/components/products";
import { CategoryTitle } from "@/components/categories";

const PAGE_SIZE = 12;

export default async function ProductsPage(props: PageProps<"/products">) {
  const { category, page, q } = await props.searchParams;

  const search = typeof q === "string" && q.trim() ? q.trim() : undefined;
  const selected = typeof category === "string" ? category : undefined;

  const parsedPage = Number(typeof page === "string" ? page : 1);
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const query = {
    limit: PAGE_SIZE,
    skip: (currentPage - 1) * PAGE_SIZE,
    category: selected,
    search,
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          <Package size={22} aria-hidden="true" />
          {search ? (
            `Resultados para «${search}»`
          ) : (
            <CategoryTitle slug={selected} />
          )}
        </h1>
        <ProductCount {...query} />
      </div>

      <ProductSearch
        key={search ?? ""}
        initialSearch={search ?? ""}
        category={selected}
      />

      {selected && (
        <Link
          href={search ? { pathname: "/products", query: { q: search } } : "/products"}
          className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          <X size={14} aria-hidden="true" />
          <CategoryTitle slug={selected} />
        </Link>
      )}

      <ProductList {...query} />

      <ProductPagination {...query} page={currentPage} />
    </div>
  );
}
