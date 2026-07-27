import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import { House, LayoutGrid, Package } from "lucide-react";

export type NavLink = {
  href: Route;
  label: string;
  icon: LucideIcon;
};

export const navLinks: NavLink[] = [
  { href: "/main", label: "Inicio", icon: House },
  { href: "/products", label: "Productos", icon: Package },
  { href: "/categories", label: "Categorías", icon: LayoutGrid },
];
