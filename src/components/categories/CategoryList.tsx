"use client";

import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { useGetCategoriesQuery } from "@/store/api/productsApi";

const PLACEHOLDER_COUNT = 12;

export default function CategoryList() {
  const { data, isLoading, isError } = useGetCategoriesQuery();

  if (isLoading) {
    return (
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
          <li
            key={index}
            className="h-28 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
          />
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <p className="py-12 text-center text-sm text-red-600">
        No se pudieron cargar las categorías.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {(data ?? []).map((category) => (
        <li key={category.slug}>
          <Link
            href={{ pathname: "/products", query: { category: category.slug } }}
            className="group flex h-full flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              <Tag size={16} className="text-zinc-400" aria-hidden="true" />
              {category.name}
            </span>
            <span className="mt-4 flex items-center gap-1 text-xs text-zinc-400 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
              Ver productos
              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
