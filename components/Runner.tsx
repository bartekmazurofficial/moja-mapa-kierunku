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
import { Plansza } from "./Ikona";
import { pozycjaKompletna } from "@/lib/moduly/walidacja";
import { KolejkaZapisu } from "@/lib/moduly/kolejka-zapisu";
import { ZAPIS_SAM } from "@/lib/content/wspolne";
import type { CzescModulu, Ekran } from "@/lib/moduly/typy";

const MARKER_ZAKONCZENIA = "__zakonczono";

/**
 * Jak dlugo po przejsciu dalej widac przycisk cofniecia.
 *
 * Pieć sekund, nie trzy: przycisk, ktory znika szybciej, nie daje sie
 * zauwazyc i siegnac po niego osobie, ktora czyta wolniej. Nie chowamy go
 * takze wtedy, gdy stoi na nim fokus klawiatury.
 */
const WIDOCZNOSC_COFNIECIA = 5000;

interface Wlasciwosci {
  kodUczestnika: string;
  modul: string;
  definicja: CzescModulu;
  zapisane: Record<string, unknown>;
  nazwaModulu: string;
}

export function Runner({
  kodUczestnika,
  modul,
  definicja,
  zapisane,
  nazwaModulu,
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
  /** Ostatnie przejście dalej: pozwala cofnąć jedną decyzję zaraz po niej. */
  const [cofniecie, ustawCofniecie] = useState<{ indeks: number; pozycje: string[] } | null>(null);
  const licznikCofniecia = useRef<ReturnType<typeof setTimeout> | null>(null);
  const przyciskCofniecia = useRef<HTMLButtonElement | null>(null);

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
            // Cofnieta odpowiedz ma zniknac z bazy, a nie zostac jako pusta.
            usun: tresc === null || tresc === undefined,
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

  /**
   * Pokazuje przycisk cofnięcia i chowa go po chwili. Przycisk z fokusem
   * zostaje: zniknięcie celu spod palca jest gorsze niż chwilę dłuższy przycisk.
   */
  const zaproponujCofniecie = useCallback((indeksEkranu: number, pozycje: string[]) => {
    if (licznikCofniecia.current) clearTimeout(licznikCofniecia.current);
    ustawCofniecie({ indeks: indeksEkranu, pozycje });
    const sprobujSchowac = () => {
      if (przyciskCofniecia.current && document.activeElement === przyciskCofniecia.current) {
        licznikCofniecia.current = setTimeout(sprobujSchowac, 2000);
        return;
      }
      ustawCofniecie(null);
    };
    licznikCofniecia.current = setTimeout(sprobujSchowac, WIDOCZNOSC_COFNIECIA);
  }, []);

  /**
   * Cofnięcie jednej decyzji: wraca na poprzedni ekran i kasuje to, co na nim
   * padło. Nie jest to nawigacja wstecz — odpowiedź trzeba dać jeszcze raz,
   * więc „Dalej” jest znowu zablokowane. Kasowanie idzie też na serwer, bo
   * inaczej po powrocie do modułu wróciłaby stara odpowiedź.
   */
  const cofnij = useCallback(() => {
    if (!cofniecie) return;
    const { indeks: doKtorego, pozycje } = cofniecie;
    ustawIndeks(doKtorego);
    ustawOdpowiedzi((poprzednie) => {
      const nowe = { ...poprzednie };
      for (const id of pozycje) delete nowe[id];
      return nowe;
    });
    for (const id of pozycje) {
      const odroczony = odroczone.current.get(id);
      if (odroczony) {
        clearTimeout(odroczony);
        odroczone.current.delete(id);
      }
      kolejka.current?.zapisz(id, null);
    }
    if (licznikCofniecia.current) clearTimeout(licznikCofniecia.current);
    ustawCofniecie(null);
    if (window.scrollY > 8) window.scrollTo({ top: 0, behavior: "auto" });
  }, [cofniecie]);

  const dalej = useCallback(async () => {
    if (indeks < widoczne.length - 1) {
      const zEkranu = (widoczne[indeks]?.pozycje ?? []).map((p) => p.id);
      if (zEkranu.length > 0) zaproponujCofniecie(indeks, zEkranu);
      ustawIndeks((i) => i + 1);
      ustawWychodzi(false);
      // Przewijamy tylko wtedy, gdy strona faktycznie jest przewinięta.
      // Skok do zera na ekranie, który się mieści, sam wygląda jak błąd.
      if (window.scrollY > 8) window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    ustawKonczy(true);
    ustawZablokowane(false);
    ustawCofniecie(null);
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
  }, [indeks, odpowiedzi, router, widoczne, zaproponujCofniecie]);

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

  return (
    <div className="mx-auto flex min-h-dvh max-w-artykul flex-col px-5 pb-6 pt-4 sm:px-8 sm:pt-6">
      {/*
        Nagłówek jest cichy z rozmysłem. Pasek wypełniający się procentowo każe
        liczyć, ile zostało, zamiast myśleć o pytaniu, a trzy wskaźniki postępu
        naraz to o dwa za dużo. Zostaje sam licznik sztuk, mały i szary.
        Nazwa modułu schodzi z ekranów z jedną decyzją: uczestnik wie, co robi,
        a to miejsce należy się pytaniu.
      */}
      <header className="mb-5 flex items-center justify-between gap-4 px-1">
        <Link
          href={`/u/${kodUczestnika}/moduly`}
          aria-label="Wróć do listy modułów"
          className="przejscie -ml-1 flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg px-1 text-drobne uppercase tracking-[0.14em] text-atrament-slaby hover:text-atrament"
        >
          <span aria-hidden>←</span>
          {jednaPozycja ? null : <span className="truncate">{nazwaModulu}</span>}
        </Link>

        {ekran.postep ? (
          <p className="shrink-0 text-drobne tabular-nums text-atrament-slaby">
            {ekran.postep.nr} z {ekran.postep.z}
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
            {ekran.typ === "wstep" ? (
              <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-linia bg-panel px-4 py-3 text-male text-atrament-sciszony">
                <span aria-hidden className="text-akcent">✓</span>
                <span>{ZAPIS_SAM}</span>
              </p>
            ) : null}
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
            {/* Na ekranie z jedną decyzją pytanie jest największym tekstem.
                Wcześniej było najmniejszym i najbledszym, przez co wyglądało
                na podpis pod odpowiedziami. */}
            {jednaPozycja ? (
              <h1 className="mx-auto mb-6 max-w-czytelna text-balance text-center text-naglowek-maly font-bold leading-snug text-atrament">
                {ekran.polecenie ?? ekran.naglowek}
              </h1>
            ) : (
              <>
                {ekran.naglowek ? (
                  <h1 className="mb-1 text-naglowek-maly font-bold text-atrament">
                    {ekran.naglowek}
                  </h1>
                ) : null}
                {ekran.polecenie ? (
                  <p className="mb-4 max-w-czytelna text-tresc text-atrament-sciszony">
                    {ekran.polecenie}
                  </p>
                ) : null}
              </>
            )}
            {ekran.podpis ? (
              <p className="mb-6 max-w-czytelna text-tresc leading-relaxed text-atrament-sciszony">
                {ekran.podpis}
              </p>
            ) : null}
            {/* Plansza pytania: pas na całej szerokości bloków odpowiedzi.
                Tylko przy pytaniach z jedną decyzją; ekrany z siatką pozycji
                mają znak przy każdej pozycji z osobna. */}
            {jednaPozycja && (ekran.ikona ?? ekran.kolor) ? (
              <div className="mb-5">
                <Plansza klucz={(ekran.ikona ?? ekran.kolor) as string} wybor />
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
                    kluczKoloru={ekran.ikona ?? ekran.kolor}
                    wartosc={odpowiedzi[p.id]}
                    naZmiane={(v) => zmien(p.id, v, p.typ === "tekst" || p.typ === "kilka_tekstow")}
                  />
                </div>
              ))}
            </div>

            {/* To samo pytanie od drugiej strony. Łatwiej powiedzieć, czego
                się nie chce, niż czego się chce. */}
            {ekran.odwrotnie ? (
              <p className="mt-6 max-w-czytelna border-l-2 border-linia-mocna pl-4 text-tresc italic leading-relaxed text-atrament-sciszony">
                {ekran.odwrotnie}
              </p>
            ) : null}

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

      {/* Cofnięcie jednej decyzji, zaraz po niej. Kto stuknął odruchowo nie
          tam, gdzie chciał, ma to jak naprawić, nie szukając nawigacji. */}
      {cofniecie ? (
        <div className="mt-3 flex justify-end">
          <button
            ref={przyciskCofniecia}
            type="button"
            onClick={cofnij}
            className="przejscie wejscie-ekranu inline-flex min-h-11 items-center gap-2 rounded-full border border-linia-mocna bg-panel px-4 text-male font-semibold text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
          >
            <span aria-hidden>↩</span>
            Cofnij ostatnią odpowiedź
          </button>
        </div>
      ) : null}

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
