"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { wypelnijOdNowa } from "@/lib/moduly/akcje";

/**
 * Potwierdzenie przed skasowaniem odpowiedzi modułu.
 *
 * Okno dialogowe, nie zwykła strona: pod spodem widać rozmytą listę modułów,
 * więc widać, że to przerwanie czegoś, a nie kolejny krok. Wyjście bezpieczne
 * jest przyciskiem głównym, kasowanie stoi obok w czerwieni.
 *
 * Trzy rzeczy, które wyglądają na drobiazgi, a są regułą:
 *
 *   - **Lista „stracisz" jest liczona z bazy**, nie wpisana z palca. Makieta
 *     obiecywała w tym miejscu „listę 12 dopasowanych zawodów"; tego nie da
 *     się tu napisać, bo wynik odsłania prowadzący na spotkaniu i uczestnik
 *     nie ma prawa zobaczyć liczby dopasowań przed rozmową.
 *   - **Zgoda jest osobnym kliknięciem.** Makieta miała w tym miejscu
 *     przełącznik „zachowaj ulubione zawody", który u nas nie robiłby nic
 *     (ulubione są osobno od odpowiedzi). Zamiast martwego przełącznika stoi
 *     tam potwierdzenie, które odblokowuje kasowanie.
 *   - **Escape wychodzi**, bo to okno dialogowe i tak się ich zamyka.
 */
export function PotwierdzenieResetu({
  kod,
  modul,
  nazwaModulu,
  gotowy,
  data,
  stracisz,
}: {
  kod: string;
  modul: string;
  nazwaModulu: string;
  /** Czy cały moduł jest wypełniony. Zmienia tylko nadpis, nie działanie. */
  gotowy: boolean;
  /** Data ostatniego zapisu, sformatowana na serwerze. Null, gdy jej nie ma. */
  data: string | null;
  /** Co dokładnie zniknie. Policzone z bazy, nie z makiety. */
  stracisz: string[];
}) {
  const [rozumiem, ustawRozumiem] = useState(false);
  const wyjscie = `/u/${kod}/moduly`;

  useEffect(() => {
    function naKlawisz(zdarzenie: KeyboardEvent) {
      if (zdarzenie.key === "Escape") window.location.assign(wyjscie);
    }
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, [wyjscie]);

  return (
    /*
     * Wszystkie warstwy pod oknem sa `fixed`: tlo, plamy, zarys strony i
     * przyciemnienie. Przy `absolute` rosly razem z trescia, a `backdrop-filter`
     * na warstwie wyzszej niz okno przegladarki zostawia na telefonie widoczny
     * szew w polowie ekranu.
     */
    <main className="ukonczenie relative flex min-h-dvh w-full items-center justify-center px-4 py-4 sm:px-5 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 4%, #fde3d6 0%, rgba(253,227,214,0) 46%), radial-gradient(90% 70% at 12% 92%, #f3dcf6 0%, rgba(243,220,246,0) 52%), linear-gradient(168deg, #eef0fc 0%, #e7eafb 42%, #f3eefb 100%)",
        }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          data-ruch
          className="absolute -right-[8%] -top-[14%] h-[38rem] w-[38rem] rounded-full blur-[14px]"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(255,176,140,.5), rgba(255,176,140,0) 68%)",
            ["--ruch" as string]: "plyniecie",
            ["--czas" as string]: "18s",
            ["--powtorzenia" as string]: "infinite",
          }}
        />
        <div
          data-ruch
          className="absolute -bottom-[22%] -left-[10%] h-[42rem] w-[42rem] rounded-full blur-[16px]"
          style={{
            background: "radial-gradient(circle at 55% 45%, rgba(150,140,255,.4), rgba(150,140,255,0) 68%)",
            ["--ruch" as string]: "plyniecie-wstecz",
            ["--czas" as string]: "22s",
            ["--powtorzenia" as string]: "infinite",
          }}
        />
      </div>

      {/* Zarys strony, którą okno przykrywa. Sama plama, bez jednej litery:
          ma mówić „przerywasz coś", a nie udawać treści, której tam nie ma. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 hidden flex-col gap-4 px-16 py-24 blur-[7px] sm:flex"
        style={{ opacity: 0.55 }}
      >
        <div className="h-9 w-80 rounded-xl bg-white/75" />
        <div className="h-4 w-[32rem] max-w-full rounded-lg bg-white/60" />
        <div className="mt-3 grid grid-cols-3 gap-5">
          <div className="h-44 rounded-[1.375rem] bg-white/60" />
          <div className="h-44 rounded-[1.375rem] bg-white/60" />
          <div className="h-44 rounded-[1.375rem] bg-white/60" />
        </div>
        <div className="mt-1 h-56 rounded-karta bg-white/55" />
      </div>

      <div
        aria-hidden
        data-ruch
        className="fixed inset-0 backdrop-blur-[3px]"
        style={{
          background: "rgba(72,74,120,.28)",
          ["--ruch" as string]: "rozjasnienie",
          ["--czas" as string]: "500ms",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-tytul"
        data-ruch
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[42.5rem] overflow-y-auto rounded-[2rem] border border-white/95 p-6 backdrop-blur-[22px] sm:p-11"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,.92), rgba(255,255,255,.78))",
          boxShadow: "0 40px 100px rgba(60,58,130,.28), inset 0 1px 0 rgba(255,255,255,.9)",
          ["--ruch" as string]: "wschod",
          ["--czas" as string]: "640ms",
        }}
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
          <span
            aria-hidden
            data-ruch
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.125rem] border border-white/90"
            style={{
              background: "linear-gradient(150deg, rgba(192,0,48,.1), rgba(255,176,140,.22))",
              ["--ruch" as string]: "wyskok",
              ["--czas" as string]: "640ms",
              ["--zwloka" as string]: "120ms",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.5 12a8.5 8.5 0 1 1-2.9-6.4"
                stroke="var(--color-kasowanie)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M20 3v4h-4"
                stroke="var(--color-kasowanie)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="flex min-w-0 flex-col gap-2.5">
            <p className="text-drobne font-bold uppercase tracking-[0.22em] text-atrament-slaby">
              {nazwaModulu}
            </p>
            <h1
              id="reset-tytul"
              className="text-naglowek font-extrabold leading-[1.18] tracking-[-0.03em] text-atrament"
            >
              Wypełnienie od nowa skasuje Twoje odpowiedzi w tym module
            </h1>
            <p className="text-tresc font-medium leading-relaxed text-atrament-slaby">
              {gotowy ? "Ten moduł jest ukończony. " : "Masz w nim zapisane odpowiedzi. "}
              {data ? `Ostatni raz odpowiadałeś ${data}. ` : ""}
              Jeśli zaczniesz go jeszcze raz, nowe odpowiedzi zastąpią poprzednie i nie da się wrócić
              do starych.
            </p>
          </div>
        </div>

        <div
          className="mt-7 rounded-[1.25rem] border border-white/90 bg-white/62 p-5 shadow-[0_10px_26px_rgba(86,84,170,0.08)] sm:p-6"
        >
          <p className="text-drobne font-bold uppercase tracking-[0.14em] text-atrament-slaby">Stracisz</p>
          <ul className="mt-4 flex flex-col gap-3.5">
            {stracisz.map((pozycja) => (
              <li key={pozycja} className="flex items-start gap-3 text-male font-semibold text-atrament">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full bg-kasowanie-tlo"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6h7" stroke="var(--color-kasowanie)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                {pozycja}
              </li>
            ))}
          </ul>

          <div aria-hidden className="my-5 h-px bg-linia" />

          <label className="flex cursor-pointer items-center gap-3.5">
            <input
              type="checkbox"
              checked={rozumiem}
              onChange={(z) => ustawRozumiem(z.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="przejscie flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-linia-mocna bg-white/90 peer-checked:border-transparent peer-checked:bg-[linear-gradient(140deg,#1d5bff,#6d3df5)] peer-checked:shadow-[0_6px_14px_rgba(85,74,200,.32)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-akcent-jasny"
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className={rozumiem ? "" : "hidden"}>
                <path
                  d="M3 7.4 5.8 10 11 4"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-male font-semibold text-atrament">
              Rozumiem, że tych odpowiedzi nie da się odzyskać
            </span>
          </label>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3.5">
          <Link
            href={wyjscie}
            className="przejscie przycisk-gradient inline-flex min-h-[3.5rem] flex-[1_1_14rem] items-center justify-center rounded-full px-7 text-tresc font-bold"
          >
            Zostaw jak jest
          </Link>
          <form action={wypelnijOdNowa} className="flex-[1_1_14rem]">
            <input type="hidden" name="kod" value={kod} />
            <input type="hidden" name="modul" value={modul} />
            <button
              type="submit"
              disabled={!rozumiem}
              className="przejscie inline-flex min-h-[3.5rem] w-full items-center justify-center rounded-full border-[1.5px] border-kasowanie/45 bg-white/60 px-7 text-tresc font-bold text-kasowanie hover:border-kasowanie hover:bg-kasowanie-tlo disabled:border-linia-mocna disabled:bg-white/40 disabled:text-atrament-slaby"
            >
              Skasuj i wypełnię od nowa
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-male font-medium text-atrament-slaby">
          Reset dotyczy tylko tego modułu. Pozostałe moduły, Twój raport i to, co zapisał prowadzący,
          zostają bez zmian. Raport przeliczy się sam z nowych odpowiedzi, kiedy skończysz.
        </p>
      </div>
    </main>
  );
}
