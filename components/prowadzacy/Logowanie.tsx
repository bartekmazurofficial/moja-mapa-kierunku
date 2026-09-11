"use client";

import { useActionState } from "react";
import { zaloguj } from "@/lib/prowadzacy/akcje";
import { Znak } from "@/components/pulpit/Znak";
import { Bramy } from "@/components/pulpit/Bramy";

export function Logowanie() {
  const [blad, akcja, wTrakcie] = useActionState(zaloguj, null);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[64rem] items-center px-5 py-10 sm:px-8">
      <div className="szklo relative w-full overflow-hidden p-8 sm:p-12">
        <Bramy klasa="pointer-events-none absolute -right-12 bottom-0 hidden h-[18rem] w-[26rem] opacity-70 lg:block" />

        <div className="relative max-w-[26rem]">
          <div className="flex items-center gap-3">
            <Znak rozmiar={40} />
            <span>
              <span className="block text-tresc-duza font-extrabold tracking-tight">Kierunek</span>
              <span className="block text-drobne uppercase tracking-[0.14em] text-atrament-slaby">
                panel prowadzącego
              </span>
            </span>
          </div>

          <h1 className="mt-8 text-naglowek-duzy font-extrabold leading-tight tracking-tight">
            <span className="gradient-tytul">Dzień dobry.</span>
          </h1>
          <p className="proza mt-3">
            Grupy, karty uczestników i ekran sesji indywidualnej.
          </p>

          <form action={akcja} className="mt-8 flex flex-col gap-3">
            <label htmlFor="haslo" className="text-male font-semibold text-atrament-sciszony">
              Hasło
            </label>
            <input
              id="haslo"
              name="haslo"
              type="password"
              autoComplete="current-password"
              required
              aria-describedby={blad ? "blad-hasla" : undefined}
              className="pole min-h-14 text-tresc"
            />
            {blad ? (
              <p id="blad-hasla" role="alert" className="text-male text-uwaga">
                {blad}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={wTrakcie}
              className="przejscie poswiata mt-2 min-h-14 rounded-xl bg-gradient-to-r from-akcent-ciemny to-akcent px-8 text-tresc font-bold text-na-akcencie hover:brightness-110 disabled:opacity-60"
            >
              {wTrakcie ? "Sprawdzam…" : "Wejdź"}
              {wTrakcie ? null : (
                <span aria-hidden className="ml-2">
                  →
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-drobne text-atrament-slaby">
            Jedno konto na cały program. Hasło jest w zmiennej środowiskowej, nie w bazie.
          </p>
        </div>
      </div>
    </main>
  );
}
