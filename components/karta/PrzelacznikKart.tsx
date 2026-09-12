"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Przełącznik między dwiema kartami na telefonie.
 *
 * Na szerokim ekranie obie karty stoją obok siebie i przełącznika nie widać.
 * Na wąskim mieści się jedna, więc trzeba się między nimi przerzucać, i to
 * jest cały problem: skok na górę strony po każdym przełączeniu odbiera sens
 * porównywaniu, bo nie da się zestawić tego samego pola w obu kartach.
 *
 * Dlatego przed przełączeniem zapamiętujemy wiersz, który stoi najwyżej na
 * ekranie, a po przełączeniu wracamy do niego. Uczestnik zostaje przy tym
 * samym polu i widzi drugą odpowiedź w tym samym miejscu.
 */
export function PrzelacznikKart({
  nazwaA,
  nazwaB,
  children,
}: {
  nazwaA: string;
  nazwaB: string;
  children: React.ReactNode;
}) {
  const [strona, ustawStrone] = useState<"a" | "b">("a");
  const pojemnik = useRef<HTMLDivElement | null>(null);

  const przelacz = useCallback((nowa: "a" | "b") => {
    const wiersze = [...(pojemnik.current?.querySelectorAll<HTMLElement>("[data-pole]") ?? [])];
    // Wiersz, który stoi najwyżej, ale jeszcze jest widoczny.
    const trzymany = wiersze.find((w) => w.getBoundingClientRect().bottom > 96);
    const przedGora = trzymany?.getBoundingClientRect().top ?? 0;
    ustawStrone(nowa);
    if (!trzymany) return;
    // Po przemalowaniu wiersz stoi gdzie indziej; wracamy do jego poprzedniej wysokości.
    requestAnimationFrame(() => {
      const poGorze = trzymany.getBoundingClientRect().top;
      window.scrollBy({ top: poGorze - przedGora, behavior: "auto" });
    });
  }, []);

  const przycisk = (ktora: "a" | "b", nazwa: string) => (
    <button
      type="button"
      onClick={() => przelacz(ktora)}
      aria-pressed={strona === ktora}
      className={`przejscie min-h-11 flex-1 rounded-lg px-3 text-male font-semibold ${
        strona === ktora
          ? "bg-akcent text-na-akcencie"
          : "text-atrament-sciszony hover:text-atrament"
      }`}
    >
      {nazwa}
    </button>
  );

  return (
    <div ref={pojemnik} data-strona={strona}>
      <div className="sticky top-2 z-20 mb-4 flex gap-1 rounded-xl border border-linia bg-panel p-1 shadow-sm sm:hidden">
        {przycisk("a", nazwaA)}
        {przycisk("b", nazwaB)}
      </div>
      {children}
    </div>
  );
}
