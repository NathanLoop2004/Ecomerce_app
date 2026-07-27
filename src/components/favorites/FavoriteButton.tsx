"use client";

import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFavoriteIds,
  toggleFavorite,
} from "@/store/features/favorites/favoritesSlice";

export default function FavoriteButton({
  productId,
  title,
  className = "",
}: {
  productId: string;
  title: string;
  className?: string;
}) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) =>
    selectFavoriteIds(state).includes(productId),
  );

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleFavorite(productId))}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Quitar ${title} de favoritos`
          : `Agregar ${title} a favoritos`
      }
      className={`rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition duration-200 ease-out hover:bg-white active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100 dark:bg-zinc-900/90 dark:hover:bg-zinc-900 ${className}`}
    >
      <Heart
        size={16}
        className={
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-zinc-500 dark:text-zinc-400"
        }
        aria-hidden="true"
      />
    </button>
  );
}
