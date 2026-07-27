"use client";

import { useGetCategoriesQuery } from "@/store/api/productsApi";

export default function CategoryTitle({ slug }: { slug?: string }) {
  const { data } = useGetCategoriesQuery();
  const category = slug ? data?.find((item) => item.slug === slug) : undefined;

  return <>{category ? category.name : "Todos los productos"}</>;
}
