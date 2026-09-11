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
import { Baner } from "./Ikona";
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
  /** Ekran gasnie przez chwilę przed podmianą: bez tego podmiana wygląda jak przeskok. */
  const [wychodzi, ustawWychodzi] = useState(false);
  const wejscieNaEkran = useRef<number>(Date.now());
  /** Odroczenie zapisu pola tekstowego: nie wysyłamy przy każdej literze. */
  const odroczone = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const [nieZapisane, ustawNieZapisane] = useState(0);
  const [zablokowane, ustawZablokowane] = useState(false);
  /** `domknij` powstaje przed `dalej`, więc sięga po nie referencją. */
  const dalejRef = useRef<null | (() => Promise<void>)>(null);

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

  // Enter przechodzi dalej. Przy sześćdziesięciu sześciu parach A3 jedno
  // wciśnięcie klawisza zamiast sięgania po przycisk robi realną różnicę.
  useEffect(() => {
    const naKlawisz = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
      const cel = e.target as HTMLElement | null;
      // W polu tekstowym Enter robi nowy wiersz, a na przycisku klika.
      if (cel && ["TEXTAREA", "INPUT", "BUTTON", "A", "SUMMARY"].includes(cel.tagName)) return;
      void dalejRef.current?.();
    };
    window.addEventListener("keydown", naKlawisz);
    return () => window.removeEventListener("keydown", naKlawisz);
  }, []);

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

  // Bezpiecznik: numer ekranu poza zakresem nie ma prawa wygasić ekranu.
  // Pusta strona wyglada jak zawieszenie aplikacji i nie da sie z niej wyjsc.
  const bezpiecznyIndeks = Math.min(indeks, Math.max(0, widoczne.length - 1));
  const ekran = widoczne[bezpiecznyIndeks];

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
      ustawWychodzi(false);
      // Przewijamy tylko wtedy, gdy strona faktycznie jest przewinięta.
      // Skok do zera na ekranie, który się mieści, sam wygląda jak błąd.
      if (window.scrollY > 8) window.scrollTo({ top: 0, behavior: "auto" });
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

  dalejRef.current = dalej;

  if (!ekran) return null;

  const kompletny = ekranKompletny(ekran, odpowiedzi);
  const widocznePozycje = (ekran.pozycje ?? []).filter((p) => spelniaWarunek(p.warunek, odpowiedzi));
  /**
   * Ekran z dwudziestoma czterema pozycjami w jednej kolumnie jest ścianą,
   * przez którą trzeba przewijać. Od sześciu pozycji układamy je w dwie
   * kolumny. Dotyczy tylko typów, które mieszczą się w kolumnie: pole
   * tekstowe i ranking zostają na całej szerokości.
   */
  const siatka =
    widocznePozycje.length >= 6 &&
    widocznePozycje.every((p) => ["skala5", "kotwica", "dowody"].includes(p.typ));
  const ostatni = bezpiecznyIndeks === widoczne.length - 1;
  // Ekran z jedna decyzja jest optycznie wysrodkowany: nic wiecej na nim nie ma.
  // Lista wyborow (A0) tak nie dziala, bo tam naglowek jest pytaniem.
  const JEDNA_DECYZJA = ["para", "trzystopniowa", "ranking4"];
  const jednaPozycja =
    ekran.typ === "pozycje" &&
    widocznePozycje.length === 1 &&
    JEDNA_DECYZJA.includes(widocznePozycje[0].typ);

  const postepCzesci = czescLacznie > 1 ? (czescNumer - 1) / czescLacznie : 0;
  const postepEkranu = ekran.postep
    ? ekran.postep.nr / ekran.postep.z
    : (bezpiecznyIndeks + 1) / widoczne.length;
  const postep = Math.round((postepCzesci + postepEkranu / Math.max(1, czescLacznie)) * 100);

  return (
    <div className="mx-auto flex min-h-dvh max-w-artykul flex-col px-5 pb-6 pt-4 sm:px-8 sm:pt-6">
      <header className="szklo mb-5 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/u/${kodUczestnika}/moduly`}
            className="przejscie flex min-w-0 items-center gap-2.5 text-drobne uppercase tracking-[0.14em] text-atrament-slaby hover:text-atrament"
          >
            <span aria-hidden>←</span>
            <span className="truncate">{nazwaModulu}</span>
          </Link>

          {/* Liczby, nie procent: procent wywołuje pośpiech, a „krok 7 z 36”
              mówi dokładnie tyle, ile trzeba. */}
          <p className="shrink-0 text-male font-semibold tabular-nums">
            {ekran.postep ? (
              <>
                <span className="text-akcent-jasny">{ekran.postep.nr}</span>
                <span className="text-atrament-slaby"> z {ekran.postep.z}</span>
                <span className="ml-1.5 text-drobne font-normal text-atrament-slaby">
                  {ekran.postep.slowo}
                </span>
              </>
            ) : czescLacznie > 1 ? (
              <>
                <span className="text-akcent-jasny">{czescNumer}</span>
                <span className="text-atrament-slaby"> z {czescLacznie}</span>
                <span className="ml-1.5 text-drobne font-normal text-atrament-slaby">część</span>
              </>
            ) : null}
          </p>
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={postep}
          aria-label="Postęp w tej części"
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-linia"
        >
          <div
            className="przejscie h-full rounded-full bg-gradient-to-r from-akcent-ciemny to-akcent-jasny"
            style={{ width: `${Math.min(100, Math.max(3, postep))}%` }}
          />
        </div>

        {czescLacznie > 1 && ekran.postep ? (
          <p className="mt-2 text-drobne text-atrament-slaby">
            część {czescNumer} z {czescLacznie}
          </p>
        ) : null}
      </header>

      {/* Uczestnik ma wiedzieć od razu, że coś nie doszło, a nie dopiero wtedy,
          gdy wróci do modułu i zobaczy pustą pozycję. */}
      {nieZapisane > 0 ? (
        <p
          role="status"
          className="mb-5 rounded-xl border border-uwaga/35 bg-uwaga-tlo px-4 py-3 text-male text-uwaga"
        >
          {zablokowane
            ? `Nie ma połączenia, więc ${nieZapisane === 1 ? "jedna odpowiedź" : `${nieZapisane} odpowiedzi`} jeszcze nie ${nieZapisane === 1 ? "doszła" : "doszły"}. Nie zamykam tej części, żeby nic nie przepadło. Zostań na tym ekranie. Spróbuję ponownie, gdy sieć wróci.`
            : `Brak połączenia. ${nieZapisane === 1 ? "Jedna odpowiedź czeka" : `${nieZapisane} odpowiedzi czeka`} na wysłanie i zapisze się, gdy sieć wróci. Możesz pisać dalej.`}
        </p>
      ) : null}

      <main
        key={ekran.klucz ?? bezpiecznyIndeks}
        className={`szklo flex-1 p-5 sm:p-7 ${jednaPozycja ? "flex flex-col justify-center" : ""} ${
          wychodzi ? "wyjscie-ekranu" : "wejscie-ekranu"
        }`}
      >
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
              <h1
                className={`mb-1 font-bold text-atrament ${
                  jednaPozycja
                    ? "text-center text-drobne uppercase tracking-[0.16em] text-atrament-slaby"
                    : "text-naglowek-maly"
                }`}
              >
                {ekran.naglowek}
              </h1>
            ) : null}
            {ekran.polecenie ? (
              <p
                className={`mb-4 text-tresc text-atrament-sciszony ${
                  jednaPozycja ? "text-center" : "max-w-czytelna"
                }`}
              >
                {ekran.polecenie}
              </p>
            ) : null}
            {ekran.podpis ? (
              <p className="mb-6 max-w-czytelna text-tresc leading-relaxed text-atrament-sciszony">
                {ekran.podpis}
              </p>
            ) : null}
            {/* Ilustracja ekranu: jeden obraz na kategorię, nie na pozycję. */}
            {ekran.ikona ? (
              <div className="mx-auto mb-5 w-full max-w-lg">
                <Baner klucz={ekran.ikona} wysokosc={172} aktywna />
              </div>
            ) : null}

            <div className={siatka ? "mt-1 grid gap-3 sm:grid-cols-2" : "mt-1 flex flex-col gap-6"}>
              {widocznePozycje.map((p, i, lista) => (
                <div
                  key={p.id}
                  // Skupiska sa wylacznie przestrzenne i nienazwane. W siatce
                  // robia je same kolumny, wiec dokladamy je tylko w liscie.
                  className={
                    !siatka && ekran.skupiskaCo && i > 0 && i % ekran.skupiskaCo === 0
                      ? "mt-8"
                      : undefined
                  }
                >
                  <Pozycja
                    pozycja={p}
                    pierwsza={i === 0}
                    ostatnia={i === lista.length - 1}
                    wSiatce={siatka}
                    wartosc={odpowiedzi[p.id]}
                    naZmiane={(v) => zmien(p.id, v, p.typ === "tekst" || p.typ === "kilka_tekstow")}
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
                  zupełnie co innego. To Twój tekst, nie nasz.
                </p>
              </div>
            ) : null}
          </>
        )}
      </main>

      <footer className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            ustawIndeks((i) => Math.max(0, i - 1));
            ustawWychodzi(false);
            if (window.scrollY > 8) window.scrollTo({ top: 0, behavior: "auto" });
          }}
          disabled={bezpiecznyIndeks === 0}
          className="przejscie min-h-12 rounded-xl border border-linia px-5 text-male font-semibold text-atrament-sciszony hover:border-linia-mocna hover:text-atrament disabled:invisible"
        >
          <span aria-hidden className="mr-2">←</span>
          Wstecz
        </button>

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
