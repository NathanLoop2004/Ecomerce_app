import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { FavoritesList } from "@/components/favorites";

export default function FavoritosPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8">
      <Link
        href="/main"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Volver a productos
      </Link>

      <h1 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        <Heart size={22} aria-hidden="true" />
        Tus favoritos
      </h1>

      <FavoritesList />
    </div>
  );
}
