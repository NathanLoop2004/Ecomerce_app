import ProductCardSkeleton from "./ProductCardSkeleton";
import Skeleton from "./Skeleton";

const DEFAULT_COUNT = 5;

export default function ProductRowSkeleton({
  count = DEFAULT_COUNT,
}: {
  count?: number;
}) {
  return (
    <section role="status" aria-label="Cargando categoría">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="flex gap-4 overflow-hidden py-3">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="w-40 shrink-0 sm:w-44 lg:w-52"
          >
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
