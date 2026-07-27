"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCart,
  removeItem,
  setQuantity,
  selectCount,
  selectItems,
  selectSubtotal,
} from "@/store/features/cart/cartSlice";
import type { CartItem } from "@/store/features/cart/cartSlice";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const items = useAppSelector(selectItems);
  const count = useAppSelector(selectCount);
  const subtotal = useAppSelector(selectSubtotal);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Carrito, ${count} productos`}
        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <ShoppingCart size={18} aria-hidden="true" />
        <span className="min-w-5 rounded-full bg-zinc-900 px-1.5 py-0.5 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
          {count}
        </span>
        <span className="hidden tabular-nums text-zinc-500 sm:inline dark:text-zinc-400">
          {priceFormatter.format(subtotal)}
        </span>
      </button>

      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out sm:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-label="Resumen del carrito"
        inert={!isOpen}
        className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[80vh] flex-col rounded-t-2xl border-t border-zinc-200 bg-white shadow-2xl transition-all duration-300 ease-out sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-[70vh] sm:w-96 sm:rounded-xl sm:border dark:border-zinc-800 dark:bg-zinc-900 ${
          isOpen
            ? "translate-y-0 opacity-100 sm:translate-y-0"
            : "pointer-events-none translate-y-full opacity-0 sm:translate-y-2"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <span className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <ShoppingCart size={16} aria-hidden="true" />
            Tu carrito ({count})
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar carrito"
            className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
            <ShoppingCart size={32} className="text-zinc-300" aria-hidden="true" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Tu carrito está vacío.
            </p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-zinc-100 overflow-y-auto overscroll-contain dark:divide-zinc-800">
              {items.map((item) => (
                <CartRow key={item.id} item={item} />
              ))}
            </ul>

            <CartFooter
              subtotal={subtotal}
              onNavigate={() => setIsOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}

function CartRow({ item }: { item: CartItem }) {
  const dispatch = useAppDispatch();

  return (
    <li className="flex gap-3 p-3">
      {item.image && (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="56px"
            className="object-contain p-1"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {item.name}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {priceFormatter.format(item.price)} c/u
        </span>

        <div className="mt-1 flex items-center gap-2">
          <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() =>
                dispatch(
                  setQuantity({ id: item.id, quantity: item.quantity - 1 }),
                )
              }
              aria-label={`Quitar una unidad de ${item.name}`}
              className="px-2 py-1 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Minus size={13} aria-hidden="true" />
            </button>
            <span className="min-w-7 text-center text-sm tabular-nums text-zinc-900 dark:text-zinc-100">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                dispatch(
                  setQuantity({ id: item.id, quantity: item.quantity + 1 }),
                )
              }
              aria-label={`Agregar una unidad de ${item.name}`}
              className="px-2 py-1 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Plus size={13} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => dispatch(removeItem(item.id))}
            aria-label={`Quitar ${item.name} del carrito`}
            className="rounded p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
          >
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
        {priceFormatter.format(item.price * item.quantity)}
      </span>
    </li>
  );
}

function CartFooter({
  subtotal,
  onNavigate,
}: {
  subtotal: number;
  onNavigate: () => void;
}) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-2 border-t border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Subtotal
        </span>
        <span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
          {priceFormatter.format(subtotal)}
        </span>
      </div>

      <Link
        href="/main/carrito"
        onClick={onNavigate}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition duration-200 ease-out hover:bg-zinc-700 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Seguir comprando
        <ArrowRight size={15} aria-hidden="true" />
      </Link>

      <button
        type="button"
        onClick={() => dispatch(clearCart())}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <Trash2 size={14} aria-hidden="true" />
        Vaciar carrito
      </button>
    </div>
  );
}
