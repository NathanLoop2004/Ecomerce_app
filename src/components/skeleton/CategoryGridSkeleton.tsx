import Skeleton from "./Skeleton";

const DEFAULT_COUNT = 12;

export default function CategoryGridSkeleton({
  count = DEFAULT_COUNT,
}: {
  count?: number;
}) {
  return (
    <ul
      role="status"
      aria-label="Cargando categorías"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className="flex h-full flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="mt-6 h-3 w-1/2" />
        </li>
      ))}
    </ul>
  );
}
