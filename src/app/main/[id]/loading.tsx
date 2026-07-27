export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 h-5 w-40 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        <div className="flex flex-col gap-4">
          <div className="h-3 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-5 w-48 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-10 w-40 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-20 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-10 w-52 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
