import type { ProductSummary } from "@/interfaces";
import ProductCard from "./ProductCard";

const PRIORITY_IMAGE_COUNT = 4;

export default function ProductGrid({
  products,
}: {
  products: ProductSummary[];
}) {
  if (!products.length) {
    return (
      <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">
        No hay productos para mostrar.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id} className="flex">
          <div className="flex w-full">
            <ProductCard
              product={product}
              priority={index < PRIORITY_IMAGE_COUNT}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
