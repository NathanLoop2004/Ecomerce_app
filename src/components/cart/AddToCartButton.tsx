"use client";

import { useEffect, useState } from "react";
import { Ban, Check, ShoppingCart } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/features/cart/cartSlice";
import type { CartableProduct } from "@/interfaces";

const FEEDBACK_MS = 1200;

export default function AddToCartButton({
  product,
}: {
  product: CartableProduct;
}) {
  const dispatch = useAppDispatch();
  const [justAdded, setJustAdded] = useState(false);
  const isOutOfStock = product.availabilityStatus === "Out of Stock";

  useEffect(() => {
    if (!justAdded) return;

    const timer = setTimeout(() => setJustAdded(false), FEEDBACK_MS);

    return () => clearTimeout(timer);
  }, [justAdded]);

  const handleClick = () => {
    dispatch(
      addItem({
        id: String(product.id),
        name: product.title,
        price: product.price,
        image: product.thumbnail,
      }),
    );

    setJustAdded(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isOutOfStock}
      className={`flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition duration-200 ease-out active:scale-95 active:duration-75 disabled:cursor-not-allowed disabled:bg-zinc-300 motion-reduce:transition-none motion-reduce:active:scale-100 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500 ${
        justAdded
          ? "bg-emerald-600 text-white"
          : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      }`}
    >
      {isOutOfStock ? (
        <>
          <Ban size={15} aria-hidden="true" />
          Sin stock
        </>
      ) : justAdded ? (
        <>
          <Check size={15} aria-hidden="true" />
          Agregado
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
