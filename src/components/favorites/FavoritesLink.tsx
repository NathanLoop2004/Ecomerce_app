"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectFavoritesCount } from "@/store/features/favorites/favoritesSlice";

export default function FavoritesLink() {
  const count = useAppSelector(selectFavoritesCount);

  return (
    <Link
      href="/main/favoritos"
      aria-label={`Favoritos, ${count} productos`}
      className="relative rounded-full p-2 text-zinc-600 transition duration-200 ease-out hover:bg-zinc-100 active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      <Heart
        size={18}
        className={count > 0 ? "fill-red-500 text-red-500" : undefined}
        aria-hidden="true"
      />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-4 text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
