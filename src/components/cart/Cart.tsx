"use client";

import { useAppSelector } from "@/store/hooks";
import { selectCount, selectSubtotal } from "@/store/features/cart/cartSlice";

export default function Cart() {
  const count = useAppSelector(selectCount);
  const subtotal = useAppSelector(selectSubtotal);

  return (
    <div className="flex items-center gap-2">
      <span>{count}</span>
      <span>{subtotal.toFixed(2)}</span>
    </div>
  );
}
