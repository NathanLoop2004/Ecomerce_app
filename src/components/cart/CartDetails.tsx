"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCart,
  removeItem,
  setQuantity,
  selectCount,
  selectIsHydrated,
  selectItems,
  selectSubtotal,
} from "@/store/features/cart/cartSlice";
import type { CartItem } from "@/store/features/cart/cartSlice";
import { Skeleton } from "@/components/skeleton";
import PaymentMethods from "./PaymentMethods";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function CartDetails() {
  const dispatch = useAppDispatch();
  const [showPaymentNotice, setShowPaymentNotice] = useState(false);
  const isHydrated = useAppSelector(selectIsHydrated);
  const items = useAppSelector(selectItems);
  const count = useAppSelector(selectCount);
  const subtotal = useAppSelector(selectSubtotal);

  if (!isHydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-zinc-200 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <ShoppingCart size={40} className="text-zinc-300" aria-hidden="true" />
        <p className="text-zinc-500 dark:text-zinc-400">
          Todavía no agregaste nada al carrito.
        </p>
        <Link
          href="/main"
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <CartLine key={item.id} item={item} />
        ))}
      </ul>

      <aside className="h-fit rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Resumen
        </h2>

        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500 dark:text-zinc-400">Productos</dt>
            <dd className="tabular-nums text-zinc-900 dark:text-zinc-100">
              {count}
            </dd>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <dt className="font-medium text-zinc-900 dark:text-zinc-100">
              Subtotal
            </dt>
            <dd className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
              {priceFormatter.format(subtotal)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowPaymentNotice(true)}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition duration-200 ease-out hover:bg-emerald-700 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <CreditCard size={16} aria-hidden="true" />
            Pagar {priceFormatter.format(subtotal)}
          </button>

          {showPaymentNotice && (
            <p
              role="status"
              className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200"
            >
              El checkout todavía no está conectado a ninguna pasarela de pago.
            </p>
          )}

          <Link
            href="/main"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition duration-200 ease-out hover:bg-zinc-700 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Seguir comprando
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

        <PaymentMethods />
      </aside>
    </div>
  );
}

function CartLine({ item }: { item: CartItem }) {
  const dispatch = useAppDispatch();

  return (
    <li className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      {item.image && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-contain p-2"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={`/main/${item.id}`}
          className="truncate font-medium text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
        >
          {item.name}
        </Link>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {priceFormatter.format(item.price)} c/u
        </span>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() =>
                dispatch(
                  setQuantity({ id: item.id, quantity: item.quantity - 1 }),
                )
              }
              aria-label={`Quitar una unidad de ${item.name}`}
              className="px-2.5 py-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Minus size={14} aria-hidden="true" />
            </button>
            <span className="min-w-8 text-center text-sm tabular-nums text-zinc-900 dark:text-zinc-100">
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
              className="px-2.5 py-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => dispatch(removeItem(item.id))}
            aria-label={`Quitar ${item.name} del carrito`}
            className="inline-flex items-center gap-1 rounded p-1 text-sm text-zinc-400 transition-colors hover:text-red-600"
          >
            <Trash2 size={14} aria-hidden="true" />
            Quitar
          </button>
        </div>
      </div>

      <span className="shrink-0 font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
        {priceFormatter.format(item.price * item.quantity)}
      </span>
    </li>
  );
}
