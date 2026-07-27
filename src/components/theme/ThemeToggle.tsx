"use client";

import { Moon, Sun } from "lucide-react";

export const THEME_STORAGE_KEY = "theme";

export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      return;
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar entre modo claro y oscuro"
      className="rounded-full p-2 text-zinc-600 transition duration-200 ease-out hover:bg-zinc-100 active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      <Sun size={18} className="hidden dark:block" aria-hidden="true" />
      <Moon size={18} className="block dark:hidden" aria-hidden="true" />
    </button>
  );
}
