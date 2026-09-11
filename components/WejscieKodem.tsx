"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Kod dostepu jest losowy i niewyliczalny. Sluzy takze jako adres raportu. */
export function WejscieKodem() {
  const router = useRouter();
  const [kod, ustawKod] = useState("");
  const [blad, ustawBlad] = useState<string | null>(null);
  const [sprawdza, ustawSprawdza] = useState(false);

  async function wejdz(e: React.FormEvent) {
    e.preventDefault();
    const oczyszczony = kod.trim().toUpperCase().replace(/\s|-/g, "");
    if (oczyszczony.length < 6) {
      ustawBlad("Kod ma dziesięć znaków.");
      return;
    }
    ustawSprawdza(true);
    ustawBlad(null);
    const odpowiedz = await fetch(`/api/wejscie?kod=${encodeURIComponent(oczyszczony)}`);
    if (odpowiedz.ok) {
      router.push(`/u/${oczyszczony}`);
    } else {
      ustawSprawdza(false);
      ustawBlad("Nie znamy tego kodu. Sprawdź, czy nie ma literówki.");
    }
  }

  return (
    <form onSubmit={wejdz} noValidate>
      <label htmlFor="kod" className="mb-2.5 block text-male font-semibold text-atrament-sciszony">
        Kod od prowadzącego
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-atrament-slaby"
          >
            <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="8" cy="8" r="5.2" />
              <path d="m12 12 3.4 3.4" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id="kod"
            value={kod}
            onChange={(e) => ustawKod(e.target.value)}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="np. K7M2X9RTQ4"
            className="pole pole-z-ikona min-h-14 font-mono text-tresc uppercase tracking-[0.14em] placeholder:font-sans placeholder:tracking-normal placeholder:text-atrament-slaby"
          />
        </div>
        <button
          type="submit"
          disabled={sprawdza}
          className="przejscie poswiata min-h-14 rounded-xl bg-gradient-to-r from-akcent-ciemny to-akcent px-8 text-tresc font-bold text-na-akcencie hover:brightness-110 disabled:opacity-60"
        >
          {sprawdza ? "Sprawdzam…" : "Rozpocznij"}
          {sprawdza ? null : (
            <span aria-hidden className="ml-2">
              →
            </span>
          )}
        </button>
      </div>
      {blad ? (
        <p role="alert" className="mt-3 text-male text-uwaga">
          {blad}
        </p>
      ) : null}
    </form>
  );
}
