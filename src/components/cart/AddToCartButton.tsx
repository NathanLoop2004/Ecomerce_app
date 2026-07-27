"use client";

import { Ban, ShoppingCart } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/features/cart/cartSlice";
import type { CartableProduct } from "@/interfaces";

export default function AddToCartButton({
  product,
}: {
  product: CartableProduct;
}) {
  const dispatch = useAppDispatch();
  const isOutOfStock = product.availabilityStatus === "Out of Stock";

  const handleClick = () =>
    dispatch(
      addItem({
        id: String(product.id),
        name: product.title,
        price: product.price,
        image: product.thumbnail,
      }),
    );

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isOutOfStock}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
    >
      {isOutOfStock ? (
        <>
          <Ban size={15} aria-hidden="true" />
          Sin stock
        </>
      ) : (
        <>
          <ShoppingCart size={15} aria-hidden="true" />
          Agregar al carrito
        </>
      )}
    </button>
  );
}
