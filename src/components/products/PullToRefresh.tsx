"use client";

import { useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

const TRIGGER_DISTANCE = 64;
const MAX_DISTANCE = 96;
const RESISTANCE = 0.5;

export default function PullToRefresh({
  onRefresh,
  children,
}: {
  onRefresh: () => Promise<unknown>;
  children: React.ReactNode;
}) {
  const startY = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [distance, setDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isArmed = distance >= TRIGGER_DISTANCE;

  const handleTouchStart = (event: React.TouchEvent) => {
    if (isRefreshing || window.scrollY > 0) return;

    startY.current = event.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (startY.current === null) return;

    const delta = event.touches[0].clientY - startY.current;

    if (delta <= 0) {
      startY.current = null;
      setIsDragging(false);
      setDistance(0);
      return;
    }

    setDistance(Math.min(delta * RESISTANCE, MAX_DISTANCE));
  };

  const handleTouchEnd = async () => {
    if (startY.current === null) return;

    startY.current = null;
    setIsDragging(false);

    if (!isArmed) {
      setDistance(0);
      return;
    }

    setIsRefreshing(true);
    setDistance(TRIGGER_DISTANCE);

    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setDistance(0);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center"
        style={{ height: distance, opacity: distance / TRIGGER_DISTANCE }}
      >
        <RefreshCw
          size={20}
          className={`text-zinc-500 dark:text-zinc-400 ${
            isRefreshing ? "animate-spin" : ""
          }`}
          style={{ transform: `rotate(${distance * 3}deg)` }}
        />
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {isRefreshing
          ? "Actualizando productos"
          : isArmed
            ? "Soltá para actualizar"
            : ""}
      </div>

      <div
        style={{ transform: `translateY(${distance}px)` }}
        className={
          isDragging ? undefined : "transition-transform duration-300"
        }
      >
        {children}
      </div>
    </div>
  );
}
