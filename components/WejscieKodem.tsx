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
      <label htmlFor="kod" className="mb-2 block text-male text-atrament-sciszony">
        Kod dostępu
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="kod"
          value={kod}
          onChange={(e) => ustawKod(e.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="np. K7M2X9RTQ4"
          className="min-h-12 flex-1 rounded-lg border border-linia bg-papier px-4 font-mono text-tresc uppercase tracking-[0.12em] placeholder:font-sans placeholder:tracking-normal placeholder:text-atrament-slaby"
        />
        <button
          type="submit"
          disabled={sprawdza}
          className="przejscie min-h-12 rounded-lg bg-akcent px-6 text-male font-medium text-white hover:bg-akcent-ciemny disabled:opacity-60"
        >
          {sprawdza ? "Sprawdzam…" : "Wejdź"}
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
