import { unstable_cache } from "next/cache";
import { api } from "./api";
import type { Product, ProductsSelectionResponse } from "@/interfaces";

const REVALIDATE_SECONDS = 3600;

export const getProductById = unstable_cache(
  async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);

    return data;
  },
  ["product"],
  { tags: ["products"], revalidate: REVALIDATE_SECONDS },
);

export const getProductIds = unstable_cache(
  async (): Promise<number[]> => {
    const { data } = await api.get<ProductsSelectionResponse<"id">>(
      "/products",
      { params: { limit: 0, select: "id" } },
    );

    return data.products.map((product) => product.id);
  },
  ["product-ids"],
  { tags: ["products"], revalidate: REVALIDATE_SECONDS },
);
