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
import { Marka } from "./pulpit/Marka";
import { Bramy } from "./pulpit/Bramy";
import { Panorama } from "./pulpit/Panorama";
import { DOPISEK, PODTYTUL, WSKAZOWKA } from "@/lib/moduly/opisy";
import { maObraz, paraMaObrazy } from "@/lib/ui/obrazy";
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
  /** Który to moduł z siedmiu. Pasek u góry pokazuje to, a nie postęp w ekranach. */
  numerModulu: number;
  liczbaModulow: number;
}

export function Runner({
  kodUczestnika,
  modul,
  definicja,
  zapisane,
  nazwaModulu,
  numerModulu,
  liczbaModulow,
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

  const typPozycji = widocznePozycje[0]?.typ;
  const ekranWyboru =
    ekran.typ === "pozycje" &&
    (jednaPozycja ||
      (widocznePozycje.length === 1 && ["pojedynczy", "wielokrotny"].includes(typPozycji ?? "")));
  const wskazowka = typPozycji ? WSKAZOWKA[typPozycji] : undefined;
  // Ekran z jednym pytaniem wielokrotnego albo pojedynczego wyboru (A0):
  // pytanie idzie do nagłówka, nazwa bloku zostaje nad nim jako etykieta.
  const pojedynczePytanie = ekranWyboru && !jednaPozycja && widocznePozycje.length === 1;
  /**
   * Gdzie stoi pytanie, zależy od modułu.
   *
   * W A1, A2, A3, A4 i M1 pytanie jest wspólne dla całego ekranu i siedzi
   * w `polecenie` („Co najchętniej byś robił?"), a pozycje mają tylko opcje.
   * W A5 odwrotnie: `polecenie` to stała instrukcja („Jak byś to zniósł?"),
   * a pytany warunek siedzi w treści pozycji („Przeprowadzka do innego
   * miasta"). Bez tego rozróżnienia czterdzieści trzy ekrany A5 pytają
   * o coś, czego nie widać.
   */
  const trescPozycji = jednaPozycja ? widocznePozycje[0]?.tresc : undefined;
  const tytulEkranu = jednaPozycja
    ? (trescPozycji ?? ekran.polecenie ?? ekran.naglowek ?? "")
    : pojedynczePytanie
      ? (widocznePozycje[0].tresc ?? ekran.naglowek ?? "")
      : (ekran.naglowek ?? ekran.polecenie ?? "");
  const etykietaNadTytulem = ekran.naglowek && (pojedynczePytanie || trescPozycji)
    ? ekran.naglowek
    : nazwaModulu;
  // Instrukcja trafia nad odpowiedzi dopiero wtedy, gdy nagłówkiem jest warunek.
  const poleceniePrzyOdpowiedziach = trescPozycji ? ekran.polecenie : undefined;
  const podtytul = jednaPozycja
    ? (trescPozycji ? undefined : (ekran.podpis ?? PODTYTUL[modul]))
    : pojedynczePytanie
      ? (widocznePozycje[0].podpis ?? ekran.podpis ?? ekran.polecenie)
      : undefined;
  // Plansza tylko wtedy, gdy jest prawdziwa ilustracja. Sam glif na pustym
  // pasie wyglada jak brak obrazu, a nie jak obraz. Najpierw obrazek tego
  // pytania, potem obrazek kategorii, a gdy nie ma zadnego, pasa nie ma.
  const kluczPlanszy = [ekran.obraz, ekran.ikona ?? ekran.kolor].find(
    (k): k is string => Boolean(k) && maObraz(k as string),
  );
  // Gdy obie karty pary maja juz wlasna ilustracje, pas nad nimi powtarzalby
  // jedna z nich. Wtedy go nie ma.
  const kartyZObrazami = paraMaObrazy(
    widocznePozycje[0]?.stronaA?.ikona,
    widocznePozycje[0]?.stronaB?.ikona,
  );
  const zPlansza = jednaPozycja && Boolean(kluczPlanszy) && !kartyZObrazami;
  const postepModulu = Math.round((Math.max(0, numerModulu - 1) / Math.max(1, liczbaModulow)) * 100);

  return (
    <div className="relative isolate mx-auto flex min-h-dvh w-full max-w-[54rem] flex-col overflow-hidden px-4 pb-6 pt-4 sm:px-8 sm:pt-5">
      {/*
        Ilustracja modułu: droga, horyzont, wschód słońca. Stoi pod treścią,
        przy dolnej krawędzi, i pojawia się tylko wtedy, gdy ekran nie ma
        własnego obrazu — dwie ilustracje naraz robią szum, nie motyw.
      */}
      {zPlansza ? null : (
        <Panorama klasa="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[34vh] w-full" moc={0.55} />
      )}
      {/*
        Nagłówek: znak programu, numer modułu z siedmiu i licznik ekranów.
        Pasek pokazuje, który to moduł, a nie ile ekranów zostało: pasek rosnący
        o ułamek przy każdym pytaniu każe liczyć, ile jeszcze, zamiast myśleć.
      */}
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <Marka href={`/u/${kodUczestnika}/moduly`} />
        <div className="flex flex-col items-end gap-1.5 pt-1">
          <p className="text-drobne uppercase tracking-[0.16em] text-atrament-slaby">
            Moduł {numerModulu} z {liczbaModulow}
            {ekran.postep ? (
              <span className="normal-case tracking-normal tabular-nums">
                <span aria-hidden className="mx-2">·</span>
                {ekran.postep.nr} z {ekran.postep.z}
              </span>
            ) : null}
          </p>
          <div className="pasek-cienki w-40 sm:w-56" aria-hidden>
            <span style={{ width: `${Math.max(4, postepModulu)}%` }} />
          </div>
        </div>
      </header>

      {/* Uczestnik ma wiedzieć od razu, że coś nie doszło, a nie dopiero wtedy,
          gdy wróci do modułu i zobaczy pustą pozycję. */}
      {nieZapisane > 0 ? (
        <p
          role="status"
          className="mt-4 rounded-xl border border-uwaga/35 bg-uwaga-tlo px-4 py-3 text-male text-uwaga"
        >
          {zablokowane
            ? `Nie ma połączenia, więc ${nieZapisane === 1 ? "jedna odpowiedź" : `${nieZapisane} odpowiedzi`} jeszcze nie ${nieZapisane === 1 ? "doszła" : "doszły"}. Nie zamykam tej części, żeby nic nie przepadło. Zostań na tym ekranie. Spróbuję ponownie, gdy sieć wróci.`
            : `Brak połączenia. ${nieZapisane === 1 ? "Jedna odpowiedź czeka" : `${nieZapisane} odpowiedzi czeka`} na wysłanie i zapisze się, gdy sieć wróci. Możesz pisać dalej.`}
        </p>
      ) : null}

      <main
        key={ekran.klucz ?? bezpiecznyIndeks}
        className={`relative mt-6 flex-1 sm:mt-8 ${wychodzi ? "wyjscie-ekranu" : "wejscie-ekranu"}`}
      >
        {ekran.typ === "wstep" || ekran.typ === "przerwa" ? (
          <div className="szklo relative overflow-hidden p-6 sm:p-9">
            <Bramy klasa="pointer-events-none absolute -right-10 -top-6 hidden h-[13rem] w-[20rem] opacity-60 sm:block" />
            <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">{nazwaModulu}</p>
            {ekran.naglowek ? (
              <h1 className="mt-3 max-w-czytelna text-naglowek font-extrabold leading-tight tracking-tight sm:text-naglowek-duzy">
                <DwaTony tekst={ekran.naglowek} />
              </h1>
            ) : null}
            <div className="proza mt-5 max-w-czytelna">
              {(ekran.akapity ?? []).map((a, i) => (
                <p key={i}>{a}</p>
              ))}
            </div>
            {ekran.typ === "wstep" ? (
              <p className="wskazowka mt-6 max-w-czytelna">
                <span aria-hidden className="mt-0.5 text-akcent">✓</span>
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
            {/* Pytanie jest największym tekstem na ekranie, a ostatnie słowo
                dostaje gradient. Pod nim jedno zdanie z zasadą tego modułu. */}
            <div className="relative sm:pr-[13rem]">
              <p aria-hidden className="odreczny absolute right-0 top-1 hidden max-w-[11rem] whitespace-pre-line text-right sm:block">
                {DOPISEK[modul]}
              </p>
              <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">{etykietaNadTytulem}</p>
              <h1
                className={`mt-3 max-w-[22ch] font-extrabold leading-[1.04] tracking-[-0.02em] text-atrament sm:max-w-[18ch] ${
                  tytulEkranu.length > 46
                    ? "text-naglowek sm:text-naglowek-duzy"
                    : "text-naglowek-duzy sm:text-tytul"
                }`}
              >
                <DwaTony tekst={tytulEkranu} />
              </h1>
              {podtytul ? (
                <p className="mt-3 max-w-czytelna text-tresc leading-relaxed text-atrament-sciszony">{podtytul}</p>
              ) : null}
              {!jednaPozycja && !pojedynczePytanie ? (
                <>
                  {ekran.naglowek && ekran.polecenie ? (
                    <p className="mt-3 max-w-czytelna text-tresc leading-relaxed text-atrament-sciszony">
                      {ekran.polecenie}
                    </p>
                  ) : null}
                  {ekran.podpis ? (
                    <p className="mt-3 max-w-czytelna text-tresc leading-relaxed text-atrament-sciszony">
                      {ekran.podpis}
                    </p>
                  ) : null}
                </>
              ) : null}
            </div>

            {/* Plansza pytania: pas na całej szerokości bloków odpowiedzi.
                Tylko przy pytaniach z jedną decyzją; ekrany z siatką pozycji
                mają znak przy każdej pozycji z osobna. */}
            {zPlansza ? (
              <div className="mt-6">
                <Plansza klucz={kluczPlanszy as string} wybor wysokosc={168} />
              </div>
            ) : null}

            {poleceniePrzyOdpowiedziach ? (
              <p className="mt-6 text-drobne font-semibold uppercase tracking-[0.14em] text-atrament-slaby">
                {poleceniePrzyOdpowiedziach}
              </p>
            ) : null}

            <div
              className={`${siatka ? "grid gap-3 sm:grid-cols-2" : "flex flex-col gap-6"} ${
                ekranWyboru ? (poleceniePrzyOdpowiedziach ? "mt-3" : "mt-6") : "szklo mt-6 p-5 sm:p-7"
              }`}
            >
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
                    pozycja={
                      pojedynczePytanie || (trescPozycji && i === 0)
                        ? { ...p, tresc: undefined, podpis: undefined }
                        : p
                    }
                    pierwsza={i === 0}
                    ostatnia={i === lista.length - 1}
                    wSiatce={siatka}
                    kluczKoloru={ekran.ikona ?? ekran.kolor}
                    miejsce={i}
                    wartosc={odpowiedzi[p.id]}
                    naZmiane={(v) => zmien(p.id, v, p.typ === "tekst" || p.typ === "kilka_tekstow")}
                  />
                </div>
              ))}
            </div>

            {ekranWyboru && wskazowka ? (
              <p className="wskazowka mt-5">
                <Zarowka />
                <span>{wskazowka}</span>
              </p>
            ) : null}

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
            className="przejscie wejscie-ekranu przycisk-pigulka inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-male font-semibold"
          >
            <span aria-hidden>↩</span>
            Cofnij ostatnią odpowiedź
          </button>
        </div>
      ) : null}

      <footer className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            ustawIndeks((i) => Math.max(0, i - 1));
            ustawWychodzi(false);
            if (window.scrollY > 8) window.scrollTo({ top: 0, behavior: "auto" });
          }}
          disabled={bezpiecznyIndeks === 0}
          className="przejscie przycisk-pigulka min-h-12 rounded-full px-6 text-male font-semibold disabled:invisible"
        >
          <span aria-hidden className="mr-2">←</span>
          Wstecz
        </button>

        <button
          type="button"
          onClick={() => void dalej()}
          disabled={!kompletny || konczy}
          className={`przejscie min-h-12 rounded-full px-8 text-tresc font-bold sm:min-w-[14rem] ${
            !kompletny || konczy ? "border border-linia bg-panel text-atrament-sciszony" : "przycisk-gradient"
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

/**
 * Nagłówek dwutonowy: pierwsza połowa ciemna, druga w gradiencie, a znak
 * zapytania osobno w pomarańczu. Rozbicie po spacji, pozostałe znaki
 * interpunkcyjne zostają przy słowie.
 */
function DwaTony({ tekst }: { tekst: string }) {
  const pelny = tekst.trim();
  // Znak zapytania jest trzecim akcentem, nie częścią gradientu, więc
  // odcinamy go, zanim podzielimy nagłówek na część ciemną i gradientową.
  const dopasowanie = /([?!]+)$/.exec(pelny);
  const znak = dopasowanie ? dopasowanie[1] : "";
  const bezZnaku = znak ? pelny.slice(0, -znak.length).trimEnd() : pelny;
  const ogon = znak ? <span className="znak-pytania">{znak}</span> : null;

  const slowa = bezZnaku.split(/\s+/).filter(Boolean);
  if (slowa.length < 2) {
    return (
      <>
        <span className="gradient-tytul">{bezZnaku}</span>
        {ogon}
      </>
    );
  }
  // Podział pada w łamaniu wiersza, nie w środku linii: w referencjach
  // pierwsza linia jest ciemna, druga gradientowa. Bez tego gradient zaczyna
  // się w połowie wiersza i przestaje czytać się jako druga linia.
  // Druga połowa nagłówka dostaje gradient. Przy dwóch słowach to jedno słowo,
  // przy ośmiu cztery — gradient ma być drugą linią, nie końcówką.
  const ile = Math.max(1, Math.floor(slowa.length / 2));
  const poczatek = slowa.slice(0, -ile).join(" ");
  const koniec = slowa.slice(-ile).join(" ");
  return (
    <>
      <span className="block">{poczatek}</span>
      <span className="block">
        <span className="gradient-tytul">{koniec}</span>
        {ogon}
      </span>
    </>
  );
}

function Zarowka() {
  return (
    <span aria-hidden className="mt-0.5 shrink-0 text-akcent">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 3.5 10.9c-.6.5-1 1.2-1 2.1h-5c0-.9-.4-1.6-1-2.1A6 6 0 0 1 12 3Z" />
      </svg>
    </span>
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
