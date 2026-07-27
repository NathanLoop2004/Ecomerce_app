import Skeleton from "./Skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando producto"
      className="mx-auto w-full max-w-7xl px-4 py-8"
    >
      <Skeleton className="mb-6 h-5 w-40" />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-52 rounded-md" />

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className="h-9 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
