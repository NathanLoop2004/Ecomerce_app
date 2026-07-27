import {
  CategoryRows,
  ProductList,
  ProductMarquee,
} from "@/components/products";
import { CategoryCarousel } from "@/components/categories";

export default function MainPage() {
  return (
    <>
      <CategoryCarousel />

      <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Productos
        </h1>
        <ProductList limit={12} />
      </div>

      <ProductMarquee />

      <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Explorá por categoría
        </h2>
        <CategoryRows />
      </div>
    </>
  );
}
