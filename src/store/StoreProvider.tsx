"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { hydrateCart } from "./features/cart/cartSlice";
import { hydrateFavorites } from "./features/favorites/favoritesSlice";
import { loadCartItems } from "./middleware/cartPersistence";
import { loadFavoriteIds } from "./middleware/favoritesPersistence";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(makeStore);

  useEffect(() => {
    store.dispatch(hydrateCart(loadCartItems()));

    const favorites = loadFavoriteIds();
    if (favorites.length > 0) {
      store.dispatch(hydrateFavorites(favorites));
    }
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
