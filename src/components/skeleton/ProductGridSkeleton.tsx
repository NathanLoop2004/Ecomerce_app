import ProductCardSkeleton from "./ProductCardSkeleton";

const DEFAULT_COUNT = 12;

export default function ProductGridSkeleton({
  count = DEFAULT_COUNT,
}: {
  count?: number;
}) {
  return (
    <ul
      role="status"
      aria-label="Cargando productos"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
