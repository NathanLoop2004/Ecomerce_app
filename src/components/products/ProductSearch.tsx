"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { productsApi } from "@/store/api/productsApi";

export default function ProductSearch({
  initialSearch = "",
  category,
}: {
  initialSearch?: string;
  category?: string;
}) {
  const router = useRouter();
  const prefetchCatalog = productsApi.usePrefetch("getAllProducts");
  const [value, setValue] = useState(initialSearch);

  const goToSearch = (term: string) => {
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    if (category) params.set("category", category);

    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");
  };

  const handleClear = () => {
    setValue("");
    if (initialSearch) goToSearch("");
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        goToSearch(value.trim());
      }}
      role="search"
      className="mb-6 flex gap-2"
    >
      <div className="relative flex-1">
        <Search
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />

        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => prefetchCatalog()}
          onPointerEnter={() => prefetchCatalog()}
          placeholder="Buscar por nombre..."
          aria-label="Buscar productos por nombre"
          className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <button
        type="submit"
        className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition duration-200 ease-out hover:bg-zinc-700 active:scale-95 active:duration-75 motion-reduce:transition-none motion-reduce:active:scale-100 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        <Search size={16} aria-hidden="true" />
        <span className="hidden sm:inline">Buscar</span>
      </button>
    </form>
  );
}
