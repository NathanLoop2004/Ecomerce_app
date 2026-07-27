import { Lock } from "lucide-react";

const chipStyles =
  "flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-800";

export default function PaymentMethods() {
  return (
    <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <p className="mb-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        <Lock size={12} aria-hidden="true" />
        Medios de pago aceptados
      </p>

      <ul className="flex flex-wrap gap-2">
        <li className={chipStyles} title="Visa">
          <span className="text-sm font-bold italic tracking-tight text-[#1a1f71] dark:text-blue-300">
            VISA
          </span>
        </li>

        <li className={chipStyles} title="Mastercard">
          <span className="flex items-center" aria-hidden="true">
            <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
            <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#f79e1b] mix-blend-multiply" />
          </span>
          <span className="sr-only">Mastercard</span>
        </li>

        <li className={chipStyles} title="Bancard">
          <span className="text-xs font-bold tracking-wide text-[#0b5aa2] dark:text-sky-300">
            bancard
          </span>
        </li>

        <li className={chipStyles} title="American Express">
          <span className="rounded-sm bg-[#016fd0] px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white">
            AMEX
          </span>
        </li>
      </ul>

      <p className="mt-3 text-[11px] leading-relaxed text-zinc-400">
        Tienda de demostración: no se procesan pagos reales.
      </p>
    </div>
  );
}
