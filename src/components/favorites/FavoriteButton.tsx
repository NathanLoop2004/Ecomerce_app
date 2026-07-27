"use client";

import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFavoriteIds,
  toggleFavorite,
} from "@/store/features/favorites/favoritesSlice";

const variantStyles = {
  icon: "rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-900",
  full: "flex w-full items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800",
};

export default function FavoriteButton({
  productId,
  title,
  variant = "icon",
  className = "",
}: {
  productId: string;
  title: string;
  variant?: keyof typeof variantStyles;
  className?: string;
}) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) =>
    selectFavoriteIds(state).includes(productId),
  );

  const label = isFavorite
    ? `Quitar ${title} de favoritos`
    : `Agregar ${title} a favoritos`;

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleFavorite(productId))}
      aria-pressed={isFavorite}
      aria-label={label}
      className={`transition duration-200 ease-out active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100 ${variantStyles[variant]} ${className}`}
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

      {variant === "full" && (
        <span>{isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}</span>
      )}
    </button>
  );
}
