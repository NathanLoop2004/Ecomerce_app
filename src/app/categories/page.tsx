import { LayoutGrid } from "lucide-react";
import { CategoryList } from "@/components/categories";

export default function CategoriesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        <LayoutGrid size={22} aria-hidden="true" />
        Categorías
      </h1>
      <CategoryList />
    </div>
  );
}
