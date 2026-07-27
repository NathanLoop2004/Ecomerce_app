"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { hydrateCart } from "./features/cart/cartSlice";
import { loadCartItems } from "./middleware/cartPersistence";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(makeStore);

  useEffect(() => {
    const items = loadCartItems();

    if (items.length > 0) {
      store.dispatch(hydrateCart(items));
    }
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
