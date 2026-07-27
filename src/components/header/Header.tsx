import Link from "next/link";
import { Store } from "lucide-react";
import { Cart } from "@/components/cart";
import Nav from "./Nav";
import MobileDrawer from "./MobileDrawer";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 dark:border-zinc-800">
      <div className="absolute inset-0 bg-white/80 backdrop-blur dark:bg-black/80" />

      <nav className="relative mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-2">
          <MobileDrawer />
          <Link
            href="/main"
            className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100"
          >
            <Store size={20} aria-hidden="true" />
            Tienda
          </Link>
        </div>

        <Nav />

        <div className="flex justify-end">
          <Cart />
        </div>
      </nav>
    </header>
  );
}
