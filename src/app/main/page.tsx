import { ProductList } from "@/components/products";

export default function MainPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Productos
      </h1>
      <ProductList limit={12} />
    </div>
  );
}
