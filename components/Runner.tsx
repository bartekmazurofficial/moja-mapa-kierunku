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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pozycja } from "./Pozycja";
import { pozycjaKompletna } from "@/lib/moduly/walidacja";
import { KolejkaZapisu } from "@/lib/moduly/kolejka-zapisu";
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
  /** Odroczenie zapisu pola tekstowego: nie wysyłamy przy każdej literze. */
  const odroczone = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const [nieZapisane, ustawNieZapisane] = useState(0);
  const [zablokowane, ustawZablokowane] = useState(false);

  const kolejka = useRef<KolejkaZapisu | null>(null);
  if (kolejka.current === null) {
    kolejka.current = new KolejkaZapisu({
      naZmiane: ustawNieZapisane,
      wyslij: async ({ pozycja, tresc }) => {
        const odpowiedz = await fetch("/api/odpowiedz", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kod: kodUczestnika,
            modul,
            czesc: definicja.kod,
            pozycja,
            wartosc: tresc,
            msSpent: Date.now() - wejscieNaEkran.current,
            rozpoczeta: new Date(wejscieNaEkran.current).toISOString(),
          }),
        });
        // Błąd sieci rzuca sam; 5xx trzeba zgłosić, bo fetch uznaje go za sukces.
        if (!odpowiedz.ok && odpowiedz.status >= 500) throw new Error(String(odpowiedz.status));
      },
    });
  }

  // Powrót połączenia to najlepszy moment na dosłanie zaległych odpowiedzi.
  useEffect(() => {
    const ponow = () => void kolejka.current?.ponow();
    window.addEventListener("online", ponow);
    const co15s = setInterval(ponow, 15_000);
    return () => {
      window.removeEventListener("online", ponow);
      clearInterval(co15s);
    };
  }, []);

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
      const istniejacy = odroczone.current.get(pozycjaId);
      if (istniejacy) clearTimeout(istniejacy);
      const wyslij = () => {
        odroczone.current.delete(pozycjaId);
        kolejka.current?.zapisz(pozycjaId, wartosc);
      };
      if (natychmiast) wyslij();
      else odroczone.current.set(pozycjaId, setTimeout(wyslij, 700));
    },
    [],
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
    ustawZablokowane(false);
    // Odroczone pola tekstowe wysyłamy od razu, bez czekania na 700 ms.
    for (const [id, timeout] of odroczone.current) {
      clearTimeout(timeout);
      kolejka.current?.zapisz(id, odpowiedzi[id]);
    }
    odroczone.current.clear();

    // Części nie wolno zamknąć, dopóki cokolwiek nie doszło. Zamknięta część
    // znika z ekranu, więc uczestnik nie miałby jak wrócić po utraconą odpowiedź.
    const wszystkoZapisane = await kolejka.current!.oproznij();
    if (!wszystkoZapisane) {
      ustawKonczy(false);
      ustawZablokowane(true);
      return;
    }

    kolejka.current!.zapisz(MARKER_ZAKONCZENIA, true);
    if (!(await kolejka.current!.oproznij())) {
      ustawKonczy(false);
      ustawZablokowane(true);
      return;
    }
    router.refresh();
  }, [indeks, odpowiedzi, router, widoczne.length]);

  if (!ekran) return null;

  const kompletny = ekranKompletny(ekran, odpowiedzi);
  const ostatni = indeks === widoczne.length - 1;
  // Ekran z jedna pozycja jest optycznie wysrodkowany: nic wiecej na nim nie ma.
  const jednaPozycja = ekran.typ === "pozycje" && (ekran.pozycje?.length ?? 0) === 1 && Boolean(ekran.autoDalej);

  const postepCzesci = czescLacznie > 1 ? (czescNumer - 1) / czescLacznie : 0;
  const postepEkranu = ekran.postep ? ekran.postep.nr / ekran.postep.z : (indeks + 1) / widoczne.length;
  const postep = Math.round((postepCzesci + postepEkranu / Math.max(1, czescLacznie)) * 100);

  return (
    <div className="mx-auto flex min-h-dvh max-w-artykul flex-col px-5 pb-10 pt-5 sm:px-8 sm:pt-8">
      <header className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/u/${kodUczestnika}/moduly`}
            className="przejscie flex min-w-0 items-center gap-2.5 text-drobne uppercase tracking-[0.14em] text-atrament-slaby hover:text-atrament"
          >
            <span aria-hidden>←</span>
            <span className="truncate">{nazwaModulu}</span>
          </Link>
          <p className="shrink-0 text-drobne tabular-nums text-atrament-slaby">
            {ekran.postep
              ? `${ekran.postep.slowo} ${ekran.postep.nr} z ${ekran.postep.z}`
              : czescLacznie > 1
                ? `część ${czescNumer} z ${czescLacznie}`
                : ""}
          </p>
        </div>

        {/* Szyna postępu. Nigdy procent liczbą: procent wywołuje pośpiech. */}
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={postep}
          aria-label="Postęp w tej części"
          className="mt-3 h-1 overflow-hidden rounded-full bg-linia"
        >
          <div
            className="przejscie h-full rounded-full bg-gradient-to-r from-akcent-ciemny to-akcent-jasny"
            style={{ width: `${Math.min(100, Math.max(4, postep))}%` }}
          />
        </div>
      </header>

      {/* Uczestnik ma wiedzieć od razu, że coś nie doszło, a nie dopiero wtedy,
          gdy wróci do modułu i zobaczy pustą pozycję. */}
      {nieZapisane > 0 ? (
        <p
          role="status"
          className="mb-5 rounded-xl border border-uwaga/35 bg-uwaga-tlo px-4 py-3 text-male text-uwaga"
        >
          {zablokowane
            ? `Nie ma połączenia, więc ${nieZapisane === 1 ? "jedna odpowiedź" : `${nieZapisane} odpowiedzi`} jeszcze nie ${nieZapisane === 1 ? "doszła" : "doszły"}. Nie zamykam tej części, żeby nic nie przepadło. Zostań na tym ekranie — spróbuję ponownie, gdy sieć wróci.`
            : `Brak połączenia. ${nieZapisane === 1 ? "Jedna odpowiedź czeka" : `${nieZapisane} odpowiedzi czeka`} na wysłanie i zapisze się, gdy sieć wróci. Możesz pisać dalej.`}
        </p>
      ) : null}

      <main className={`szklo flex-1 p-6 sm:p-8 ${jednaPozycja ? "flex flex-col justify-center" : ""}`}>
        {ekran.typ === "wstep" || ekran.typ === "przerwa" ? (
          <div className="max-w-czytelna">
            {ekran.naglowek ? (
              <h1 className="text-naglowek font-extrabold tracking-tight text-atrament">{ekran.naglowek}</h1>
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
              <h1 className="mb-1 text-naglowek-maly font-bold text-atrament">{ekran.naglowek}</h1>
            ) : null}
            {ekran.polecenie ? (
              <p className="mb-5 max-w-czytelna text-tresc text-atrament-sciszony">{ekran.polecenie}</p>
            ) : null}
            {ekran.podpis ? (
              <p className="mb-6 max-w-czytelna text-tresc leading-relaxed text-atrament-sciszony">
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
                <p className="text-tresc leading-relaxed text-atrament-sciszony">
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

      <footer className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            ustawIndeks((i) => Math.max(0, i - 1));
            window.scrollTo({ top: 0 });
          }}
          disabled={indeks === 0}
          className="przejscie min-h-12 rounded-xl border border-linia px-5 text-male font-semibold text-atrament-sciszony hover:border-linia-mocna hover:text-atrament disabled:invisible"
        >
          <span aria-hidden className="mr-2">←</span>
          Wstecz
        </button>

        {!ekran.autoDalej || ostatni ? (
          <button
            type="button"
            onClick={() => void dalej()}
            disabled={!kompletny || konczy}
            className={`przejscie min-h-12 rounded-xl px-8 text-tresc font-bold ${
              !kompletny || konczy
                ? "border border-linia text-atrament-slaby"
                : "poswiata bg-gradient-to-r from-akcent-ciemny to-akcent text-na-akcencie hover:brightness-110"
            }`}
          >
            {konczy ? "Zapisuję…" : (ekran.przyciskDalej ?? "Dalej")}
            {konczy ? null : (
              <span aria-hidden className="ml-2">
                →
              </span>
            )}
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
