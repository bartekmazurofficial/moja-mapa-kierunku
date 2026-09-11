"use client";

/**
 * Przebieg modulu: jeden ekran naraz, zapis na biezaco, bez przycisku "zapisz".
 *
 * Trzy rzeczy, ktore ten komponent musi gwarantowac:
 *   - nie da sie przewinac do przodu przed odpowiedzia,
 *   - kazda odpowiedz jest zapisana natychmiast, wiec przerwany modul
 *     mozna dokonczyc od miejsca, w ktorym sie skonczylo,
 *   - czas spedzony na kazdym ekranie jest mierzony, bo zbyt szybkie
 *     wypelnianie jest sygnalem dla prowadzacego.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pozycja } from "./Pozycja";
import { pozycjaKompletna } from "@/lib/moduly/walidacja";
import type { CzescModulu, Ekran } from "@/lib/moduly/typy";

const MARKER_ZAKONCZENIA = "__zakonczono";

interface Wlasciwosci {
  kodUczestnika: string;
  modul: string;
  definicja: CzescModulu;
  zapisane: Record<string, unknown>;
  nazwaModulu: string;
  /** Ile czesci modulu jest juz za uczestnikiem. */
  czescNumer: number;
  czescLacznie: number;
}

export function Runner({
  kodUczestnika,
  modul,
  definicja,
  zapisane,
  nazwaModulu,
  czescNumer,
  czescLacznie,
}: Wlasciwosci) {
  const router = useRouter();
  const [odpowiedzi, ustawOdpowiedzi] = useState<Record<string, unknown>>(zapisane);
  const [indeks, ustawIndeks] = useState(0);
  const [konczy, ustawKonczy] = useState(false);
  const wejscieNaEkran = useRef<number>(Date.now());
  const kolejkaZapisu = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const widoczne = useMemo(
    () => definicja.ekrany.filter((e) => spelniaWarunek(e.warunek, odpowiedzi)),
    // Warunki zaleza wylacznie od odpowiedzi wczesniejszych, wiec przeliczamy
    // liste przy kazdej zmianie odpowiedzi.
    [definicja.ekrany, odpowiedzi],
  );

  // Wznowienie: pierwszy ekran, ktory nie jest jeszcze kompletny. Przy pustej
  // czesci zaczynamy od poczatku, zeby uczestnik zobaczyl instrukcje.
  useEffect(() => {
    if (Object.keys(zapisane).length === 0) return;
    const pierwszyNiekompletny = widoczne.findIndex((e) => !ekranKompletny(e, zapisane));
    ustawIndeks(pierwszyNiekompletny === -1 ? Math.max(0, widoczne.length - 1) : pierwszyNiekompletny);
    // Ustawiane raz, przy wejsciu do czesci.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    wejscieNaEkran.current = Date.now();
  }, [indeks]);

  const zapisz = useCallback(
    (pozycjaId: string, wartosc: unknown, natychmiast: boolean) => {
      const istniejacy = kolejkaZapisu.current.get(pozycjaId);
      if (istniejacy) clearTimeout(istniejacy);
      const wyslij = () => {
        kolejkaZapisu.current.delete(pozycjaId);
        void fetch("/api/odpowiedz", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kod: kodUczestnika,
            modul,
            czesc: definicja.kod,
            pozycja: pozycjaId,
            wartosc,
            msSpent: Date.now() - wejscieNaEkran.current,
            rozpoczeta: new Date(wejscieNaEkran.current).toISOString(),
          }),
        });
      };
      if (natychmiast) wyslij();
      else kolejkaZapisu.current.set(pozycjaId, setTimeout(wyslij, 700));
    },
    [definicja.kod, kodUczestnika, modul],
  );

  const ekran = widoczne[indeks];

  const zmien = useCallback(
    (pozycjaId: string, wartosc: unknown, tekstowa: boolean) => {
      ustawOdpowiedzi((poprzednie) => ({ ...poprzednie, [pozycjaId]: wartosc }));
      zapisz(pozycjaId, wartosc, !tekstowa);
    },
    [zapisz],
  );

  const dalej = useCallback(async () => {
    if (indeks < widoczne.length - 1) {
      ustawIndeks((i) => i + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    ustawKonczy(true);
    for (const [, timeout] of kolejkaZapisu.current) clearTimeout(timeout);
    // Zapisujemy wszystko, co czekalo w kolejce, zanim zamkniemy czesc.
    await Promise.all(
      [...kolejkaZapisu.current.keys()].map((id) =>
        fetch("/api/odpowiedz", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kod: kodUczestnika,
            modul,
            czesc: definicja.kod,
            pozycja: id,
            wartosc: odpowiedzi[id],
          }),
        }),
      ),
    );
    kolejkaZapisu.current.clear();
    await fetch("/api/odpowiedz", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kod: kodUczestnika,
        modul,
        czesc: definicja.kod,
        pozycja: MARKER_ZAKONCZENIA,
        wartosc: true,
      }),
    });
    router.refresh();
  }, [definicja.kod, indeks, kodUczestnika, modul, odpowiedzi, router, widoczne.length]);

  if (!ekran) return null;

  const kompletny = ekranKompletny(ekran, odpowiedzi);
  const ostatni = indeks === widoczne.length - 1;
  // Ekran z jedna pozycja jest optycznie wysrodkowany: nic wiecej na nim nie ma.
  const jednaPozycja = ekran.typ === "pozycje" && (ekran.pozycje?.length ?? 0) === 1 && Boolean(ekran.autoDalej);

  return (
    <div className="mx-auto flex min-h-dvh max-w-artykul flex-col px-5 pb-10 pt-5 sm:px-8 sm:pt-10">
      <header className="mb-7 flex items-baseline justify-between gap-4">
        <p className="truncate text-drobne uppercase tracking-[0.08em] text-atrament-slaby">
          {nazwaModulu}
        </p>
        <p className="shrink-0 text-drobne tabular-nums text-atrament-slaby">
          {ekran.postep
            ? `${ekran.postep.slowo} ${ekran.postep.nr} z ${ekran.postep.z}`
            : czescLacznie > 1
              ? `część ${czescNumer} z ${czescLacznie}`
              : ""}
        </p>
      </header>

      <main className={`flex-1 ${jednaPozycja ? "flex flex-col justify-center pb-12" : ""}`}>
        {ekran.typ === "wstep" || ekran.typ === "przerwa" ? (
          <div className="max-w-czytelna">
            {ekran.naglowek ? (
              <h1 className="font-serif text-naglowek text-atrament">{ekran.naglowek}</h1>
            ) : null}
            <div className="proza mt-5">
              {(ekran.akapity ?? []).map((a, i) => (
                <p key={i}>{a}</p>
              ))}
            </div>
            {ekran.rozwiniecie ? (
              <details className="mt-5 max-w-czytelna">
                <summary className="cursor-pointer list-none text-male text-atrament-sciszony underline decoration-linia-mocna underline-offset-4 hover:text-atrament">
                  Więcej o tym ćwiczeniu
                </summary>
                <div className="proza mt-3 text-atrament-sciszony">
                  {ekran.rozwiniecie.map((a, i) => (
                    <p key={i}>{a}</p>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        ) : (
          <>
            {ekran.naglowek ? (
              <h1 className="mb-1 font-serif text-naglowek-maly text-atrament">{ekran.naglowek}</h1>
            ) : null}
            {ekran.polecenie ? (
              <p className="mb-5 max-w-czytelna text-tresc text-atrament-sciszony">{ekran.polecenie}</p>
            ) : null}
            {ekran.podpis ? (
              <p className="mb-6 max-w-czytelna font-serif text-tresc leading-relaxed text-atrament-sciszony">
                {ekran.podpis}
              </p>
            ) : null}

            <div className="mt-1 flex flex-col gap-6">
              {(ekran.pozycje ?? [])
                .filter((p) => spelniaWarunek(p.warunek, odpowiedzi))
                .map((p, i, lista) => (
                  <div
                    key={p.id}
                    // Skupiska sa wylacznie przestrzenne i nienazwane.
                    className={
                      ekran.skupiskaCo && i > 0 && i % ekran.skupiskaCo === 0 ? "mt-8" : undefined
                    }
                  >
                    <Pozycja
                      pozycja={p}
                      pierwsza={i === 0}
                      ostatnia={i === lista.length - 1}
                      wartosc={odpowiedzi[p.id]}
                      naZmiane={(v) => zmien(p.id, v, p.typ === "tekst" || p.typ === "kilka_tekstow")}
                      naDomkniecie={
                        ekran.autoDalej && !ostatni ? () => setTimeout(() => void dalej(), 400) : undefined
                      }
                    />
                  </div>
                ))}
            </div>

            {/* Szkic jest odbiciem, nie podpowiedzia: pojawia sie dopiero wtedy,
                gdy uczestnik cos napisal. Przy pustym polu nie ma ani szkicu,
                ani zachety - wizja zycia to jedyny modul, w ktorym wolno
                zostawic puste pole bez konsekwencji. */}
            {ekran.notatka && maTresc(ekran, odpowiedzi) ? (
              <div className="mt-8 max-w-czytelna border-l-2 border-akcent/40 pl-4">
                <p className="font-serif text-tresc leading-relaxed text-atrament-sciszony">
                  {zloszNotatke(ekran, odpowiedzi)}
                </p>
                <p className="mt-1.5 text-drobne text-atrament-slaby">
                  Tak wyszło z poprzedniego ćwiczenia. Możesz się z tym zgodzić albo napisać
                  zupełnie co innego — to Twój tekst, nie nasz.
                </p>
              </div>
            ) : null}
          </>
        )}
      </main>

      <footer className="mt-9 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            ustawIndeks((i) => Math.max(0, i - 1));
            window.scrollTo({ top: 0 });
          }}
          disabled={indeks === 0}
          className="przejscie -ml-2 min-h-11 rounded-md px-2 text-male text-atrament-slaby hover:text-atrament disabled:invisible"
        >
          Wstecz
        </button>

        {!ekran.autoDalej || ostatni ? (
          <button
            type="button"
            onClick={() => void dalej()}
            disabled={!kompletny || konczy}
            className="przejscie min-h-11 rounded-md bg-akcent px-6 text-male font-medium text-white hover:bg-akcent-ciemny disabled:bg-podklad disabled:text-atrament-slaby"
          >
            {konczy ? "Zapisuję…" : (ekran.przyciskDalej ?? "Dalej")}
          </button>
        ) : (
          <p className="text-drobne text-atrament-slaby">
            {kompletny ? "Zapisano" : "Wybierz, żeby przejść dalej"}
          </p>
        )}
      </footer>
    </div>
  );
}

function spelniaWarunek(
  warunek: { pozycja: string; wartosci: string[] } | undefined,
  odpowiedzi: Record<string, unknown>,
): boolean {
  if (!warunek) return true;
  const wartosc = odpowiedzi[warunek.pozycja];
  return typeof wartosc === "string" && warunek.wartosci.includes(wartosc);
}

/** Wstawia w miejsce {…} to, co uczestnik wlasnie napisal albo zaznaczyl. */
function zloszNotatke(ekran: Ekran, odpowiedzi: Record<string, unknown>): string {
  const notatka = ekran.notatka ?? "";
  if (!ekran.notatkaZPola || !notatka.includes("{…}")) return notatka;
  const wartosc = odpowiedzi[ekran.notatkaZPola];
  let tekst = "";
  if (Array.isArray(wartosc)) {
    const elementy = wartosc.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
    tekst = elementy.length > 1 ? `${elementy.slice(0, -1).join(", ")} i ${elementy.at(-1)}` : (elementy[0] ?? "");
  } else if (typeof wartosc === "string") {
    tekst = wartosc.trim();
  }
  if (!tekst) return "";
  return notatka.replace("{…}", tekst.replace(/\.$/, "").toLowerCase());
}

/** Czy uczestnik cokolwiek na tym ekranie napisal. */
function maTresc(ekran: Ekran, odpowiedzi: Record<string, unknown>): boolean {
  return (ekran.pozycje ?? []).some((p) => {
    const w = odpowiedzi[p.id];
    if (typeof w === "string") return w.trim().length > 0;
    if (Array.isArray(w)) return w.some((x) => typeof x === "string" && x.trim().length > 0);
    return false;
  });
}

function ekranKompletny(ekran: Ekran, odpowiedzi: Record<string, unknown>): boolean {
  if (ekran.typ !== "pozycje") return true;
  return (ekran.pozycje ?? [])
    .filter((p) => spelniaWarunek(p.warunek, odpowiedzi))
    .every((p) => pozycjaKompletna(p, odpowiedzi[p.id]));
}
