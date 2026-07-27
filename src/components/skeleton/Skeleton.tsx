export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer rounded bg-linear-to-r from-zinc-100 via-zinc-200 to-zinc-100 bg-size-[200%_100%] motion-reduce:animate-none dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 ${className}`}
    />
  );
}
