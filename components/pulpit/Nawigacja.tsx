"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface PozycjaNawigacji {
  etykieta: string;
  podpis: string;
  href: string;
  ikona: "przeglad" | "moduly" | "raport" | "zawody";
  /** Zamknięte, dopóki prowadzący nie odsłoni. Widoczne, ale nieklikalne. */
  zamkniete?: string;
  odznaka?: string;
}

export function Nawigacja({ pozycje }: { pozycje: PozycjaNawigacji[] }) {
  const sciezka = usePathname();

  return (
    <nav aria-label="Sekcje programu" className="flex flex-col gap-1.5">
      {pozycje.map((p) => {
        const aktywna = p.href === sciezka || sciezka.startsWith(`${p.href}/`);

        if (p.zamkniete) {
          return (
            <span
              key={p.href}
              className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-atrament-slaby"
            >
              <Ikona rodzaj={p.ikona} przygaszona />
              <span className="min-w-0 flex-1">
                <span className="block text-male font-medium">{p.etykieta}</span>
                <span className="block text-drobne">{p.zamkniete}</span>
              </span>
              <Klodka />
            </span>
          );
        }

        return (
          <Link
            key={p.href}
            href={p.href}
            aria-current={aktywna ? "page" : undefined}
            className={`przejscie flex items-start gap-3 rounded-xl px-3 py-2.5 ${
              aktywna
                ? "bg-akcent-tlo text-akcent-jasny"
                : "text-atrament-sciszony hover:bg-panel hover:text-atrament"
            }`}
          >
            <Ikona rodzaj={p.ikona} aktywna={aktywna} />
            <span className="min-w-0 flex-1">
              <span className="block text-male font-semibold">{p.etykieta}</span>
              <span className="block text-drobne text-atrament-slaby">{p.podpis}</span>
            </span>
            {p.odznaka ? (
              <span className="mt-0.5 shrink-0 rounded-full bg-akcent-tlo px-2 py-0.5 text-drobne font-semibold text-akcent-jasny">
                {p.odznaka}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function Klodka() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1.5 h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3.2" y="7" width="9.6" height="6.6" rx="1.4" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

const SCIEZKI: Record<PozycjaNawigacji["ikona"], string> = {
  przeglad: "M3 10.5 10 4l7 6.5M5.5 9v7h9V9",
  moduly: "M4 5h12M4 10h12M4 15h7",
  raport: "M5.5 3.5h6l3.5 3.5v9.5h-9.5zM11.5 3.5V7H15",
  zawody: "M4 7h12v8H4zM7.5 7V5.2h5V7",
};

function Ikona({
  rodzaj,
  aktywna,
  przygaszona,
}: {
  rodzaj: PozycjaNawigacji["ikona"];
  aktywna?: boolean;
  przygaszona?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`przejscie znak-sekcji mt-0.5 ${
        aktywna
          ? "bg-akcent-tlo text-akcent-jasny"
          : przygaszona
            ? "bg-tlo text-atrament-slaby"
            : "bg-panel text-atrament-sciszony"
      }`}
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={SCIEZKI[rodzaj]} />
      </svg>
    </span>
  );
}
