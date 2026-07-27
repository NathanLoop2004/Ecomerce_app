import { unstable_cache } from "next/cache";
import { api } from "./api";
import type { Product } from "@/interfaces";

const REVALIDATE_SECONDS = 3600;

export const getProductById = unstable_cache(
  async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);

    return data;
  },
  ["product"],
  { tags: ["products"], revalidate: REVALIDATE_SECONDS },
);
