import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  addItem,
  clearCart,
  removeItem,
  setQuantity,
} from "../features/cart/cartSlice";
import type { CartItem } from "../features/cart/cartSlice";

export const CART_STORAGE_KEY = "ecommerce_app.cart";

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    (item.image === undefined || typeof item.image === "string")
  );
}

export function loadCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];

  let raw: string | null = null;

  try {
    raw = window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return [];
  }

  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

export const cartPersistenceMiddleware = createListenerMiddleware();

cartPersistenceMiddleware.startListening({
  matcher: isAnyOf(addItem, removeItem, setQuantity, clearCart),
  effect: (_action, listenerApi) => {
    if (typeof window === "undefined") return;

    const { cart } = listenerApi.getState() as { cart: { items: CartItem[] } };

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items));
    } catch {
      return;
    }
  },
});
