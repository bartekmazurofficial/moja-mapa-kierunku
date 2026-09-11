"use client";

import { useActionState } from "react";
import { zaloguj } from "@/lib/prowadzacy/akcje";

export function Logowanie() {
  const [blad, akcja, wTrakcie] = useActionState(zaloguj, null);

  return (
    <main className="mx-auto flex min-h-dvh max-w-czytelna flex-col justify-center px-6 py-16">
      <h1 className="text-naglowek font-extrabold tracking-tight">Panel prowadzącego</h1>
      <form action={akcja} className="mt-8 flex flex-col gap-3">
        <label htmlFor="haslo" className="text-male text-atrament-sciszony">
          Hasło
        </label>
        <input
          id="haslo"
          name="haslo"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={blad ? "blad-hasla" : undefined}
          className="min-h-11 rounded-lg border border-linia-mocna bg-szklo px-4 text-tresc"
        />
        {blad ? (
          <p id="blad-hasla" role="alert" className="text-male text-uwaga">
            {blad}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={wTrakcie}
          className="przejscie mt-2 min-h-11 rounded-lg bg-akcent px-6 text-male font-medium text-na-akcencie hover:bg-akcent-ciemny disabled:opacity-60"
        >
          {wTrakcie ? "Sprawdzam…" : "Wejdź"}
        </button>
      </form>
      <p className="mt-8 text-male text-atrament-slaby">
        Jedno konto na cały program. Hasło jest w zmiennej środowiskowej, nie w bazie.
      </p>
    </main>
  );
}
