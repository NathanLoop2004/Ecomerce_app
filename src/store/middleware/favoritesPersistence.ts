import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  clearFavorites,
  removeFavorite,
  toggleFavorite,
} from "../features/favorites/favoritesSlice";

export const FAVORITES_STORAGE_KEY = "ecommerce_app.favorites";

export function loadFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];

  let raw: string | null = null;

  try {
    raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
  } catch {
    return [];
  }

  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (id): id is string => typeof id === "string" && id.length > 0,
    );
  } catch {
    return [];
  }
}

export const favoritesPersistenceMiddleware = createListenerMiddleware();

favoritesPersistenceMiddleware.startListening({
  matcher: isAnyOf(toggleFavorite, removeFavorite, clearFavorites),
  effect: (_action, listenerApi) => {
    if (typeof window === "undefined") return;

    const { favorites } = listenerApi.getState() as {
      favorites: { ids: string[] };
    };

    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites.ids),
      );
    } catch {
      return;
    }
  },
});
