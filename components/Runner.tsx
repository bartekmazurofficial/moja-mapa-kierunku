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
import { Plansza, PlanszaPary } from "./Ikona";
import { Marka } from "./pulpit/Marka";
import { Bramy } from "./pulpit/Bramy";
import { Panorama } from "./pulpit/Panorama";
import { DOPISEK, PODTYTUL, WSKAZOWKA } from "@/lib/moduly/opisy";
import { maObraz, obrazPlanszy, paraMaObrazy } from "@/lib/ui/obrazy";
import { pozycjaKompletna } from "@/lib/moduly/walidacja";
import { KolejkaZapisu } from "@/lib/moduly/kolejka-zapisu";
import { ZAPIS_SAM } from "@/lib/content/wspolne";
import { czegoNieZapytamyA0, sciezkaA0 } from "@/lib/content/a0";
import { minutyZPozycji, zakresPozycji } from "@/lib/moduly/miara";
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
  /**
   * Ile pytań ma ta część i ile to potrwa. Liczone z definicji, którą Runner
   * właśnie dostał, więc wstęp do drugiej części M1 mówi o drugiej części,
   * a nie o całym module. W A0 ścieżki mają różną długość, stąd zakres.
   */
  const zakresPytan = useMemo(() => zakresPozycji(definicja.ekrany), [definicja.ekrany]);
  const minuty = minutyZPozycji(zakresPytan.max, modul);
  const rownaSciezka = zakresPytan.min === zakresPytan.max;
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
  // Ekran może nazwać nadpis sam. A4 wpisuje tam numer bloku i formułę,
  // bo w pięciu formułach trzeba powiedzieć, w której uczestnik jest.
  const etykietaNadTytulem =
    ekran.etykieta ??
    (ekran.naglowek && (pojedynczePytanie || trescPozycji) ? ekran.naglowek : nazwaModulu);
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
  // Para z dwiema ilustracjami dostaje pas dzielony na pół: lewa połowa
  // należy do lewej odpowiedzi, prawa do prawej. Symetrycznie, więc obraz
  // nie przechyla wyboru tak, jak przechyliłoby jedno wspólne zdjęcie.
  const paraZObrazami = paraMaObrazy(
    widocznePozycje[0]?.stronaA?.ikona,
    widocznePozycje[0]?.stronaB?.ikona,
  );
  const zPlanszaPary = jednaPozycja && typPozycji === "para" && paraZObrazami;
  // Kadr nad odpowiedziami: przy jednej decyzji (para, trzy stopnie, ranking)
  // albo wtedy, gdy ekran sam wskazal obraz. To drugie robi A0 tam, gdzie
  // kadr ilustruje pytanie, a nie odpowiedzi.
  const zPlansza =
    (jednaPozycja || (Boolean(ekran.obraz) && widocznePozycje.length === 1)) &&
    Boolean(kluczPlanszy) &&
    !zPlanszaPary;
  // Plansza narysowana pod pytanie jest w 16:9 i idzie na ekran w całości.
  // Kwadratowy kafel kategorii zostaje w pasie o stałej wysokości: rozciągnięty
  // do 16:9 miałby po bokach więcej rozmycia niż obrazu.
  const pelnaPlansza = zPlansza && Boolean(obrazPlanszy(kluczPlanszy as string));
  // Pytanie z jedną decyzją stoi na środku ekranu, jak w makiecie panelu
  // wyboru. Siatki pozycji i ranking zostają wyrównane do lewej.
  const naSrodku = jednaPozycja && (typPozycji === "para" || typPozycji === "trzystopniowa");
  const postepModulu = Math.round((Math.max(0, numerModulu - 1) / Math.max(1, liczbaModulow)) * 100);

  /**
   * Licznik pytań dla części, w której pytania zależą od wcześniejszej
   * odpowiedzi.
   *
   * W A0 „pytanie 2 z 11" musi znaczyć jedenaście pytań TEJ ścieżki, a nie
   * dwadzieścia trzy z definicji modułu. `widoczne` jest już przefiltrowane
   * odpowiedziami, więc liczymy prosto z niego i liczba rośnie razem z tym,
   * co uczestnik odpowiedział.
   */
  const pytaniaWidoczne = widoczne.filter((e) => e.typ === "pozycje");
  const numerPytania = pytaniaWidoczne.indexOf(ekran) + 1;
  const postepPytan =
    ekran.postep ??
    (numerPytania > 0 && pytaniaWidoczne.length > 1
      ? { nr: numerPytania, z: pytaniaWidoczne.length, slowo: "pytań" }
      : null);

  /** Ekran, na którym odpowiedzi są kaflami z kadrem, a nie wierszami. */
  const zKartami = widocznePozycje.some((p) => p.uklad === "karty");

  /** Ścieżka A0: którą gałęzią idzie uczestnik po odpowiedzi na pierwsze pytanie. */
  const sciezka = modul === "A0" ? sciezkaA0(odpowiedzi.etap as string | undefined) : null;

  return (
    <div
      /*
        Kolumna treści ma 60rem, bo tyle wynosi wygodna długość wiersza. Ekran
        z kartami odpowiedzi jest wyjątkiem: tam nie ma długich wierszy, tylko
        siatka kafli, a przy 60rem cztery kafle mają po 212 px i etykieta łamie
        się na cztery linie. Szersza kolumna daje 273 px i dwie linie.
      */
      className={`relative isolate mx-auto flex min-h-dvh w-full flex-col px-4 pb-6 pt-4 sm:px-8 sm:pt-5 ${
        zKartami ? "max-w-[74rem]" : "max-w-[60rem]"
      }`}
    >
      {/*
        Ilustracja modułu: droga, horyzont, wschód słońca. Stoi pod treścią,
        przy dolnej krawędzi, i pojawia się tylko wtedy, gdy ekran nie ma
        własnego obrazu — dwie ilustracje naraz robią szum, nie motyw.
      */}
      {zPlansza || ekran.typ === "wstep" ? null : (
        <Panorama klasa="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[34vh] w-full" moc={0.55} />
      )}
      {/*
        Wstęp dostaje własne tło na całą szerokość okna: pastelowy gradient
        i dwie bardzo wolne plamy koloru, te same co ekran ukończenia. Moduł
        zaczyna się i kończy tym samym obrazem, a między nimi tło jest spokojne,
        żeby nie konkurowało z pytaniami.
      */}
      {ekran.typ === "wstep" ? <TloWstepu /> : null}
      {/*
        Nagłówek: znak programu, numer modułu z siedmiu i licznik ekranów.
        Pasek pokazuje, który to moduł, a nie ile ekranów zostało: pasek rosnący
        o ułamek przy każdym pytaniu każe liczyć, ile jeszcze, zamiast myśleć.
      */}
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <Marka href={`/u/${kodUczestnika}/moduly`} />
        <div className="flex flex-col items-end gap-1.5 pt-1">
          <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5">
            {/* Chip ścieżki: uczestnik ma widzieć, że pytania są dobrane pod
                niego, a nie że część ekranów zniknęła bez powodu. */}
            {sciezka ? (
              <span className="rounded-full bg-akcent-tlo px-3 py-1 text-drobne font-semibold text-akcent-jasny">
                Ścieżka {sciezka.nr} · {sciezka.nazwa}
              </span>
            ) : null}
            <p className="text-drobne uppercase tracking-[0.16em] text-atrament-slaby">
              Moduł {numerModulu} z {liczbaModulow}
              {postepPytan ? (
                <span className="normal-case tracking-normal tabular-nums">
                  <span aria-hidden className="mx-2">·</span>
                  {postepPytan.nr} z {postepPytan.z}
                </span>
              ) : null}
            </p>
          </div>
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
        {ekran.typ === "wstep" ? (
          /**
           * Ekran startowy modułu.
           *
           * Uczestnik ma przed sobą kilkadziesiąt pytań i przed kliknięciem
           * musi wiedzieć trzy rzeczy: ile tego jest, ile to zajmie i że nic
           * nie przepadnie, gdy wyjdzie w połowie. Stąd pierścień z liczbą,
           * trzy znaczniki i zdanie o zapisie, a nie sam nagłówek.
           *
           * Czego tu nie ma: trzech kafli „co z tego będziesz miał". W makiecie
           * są (opcjonalnie) i obiecują listę zawodów oraz profil w sześciu
           * wymiarach. To jest obietnica wyniku całego programu, nie tego
           * modułu, a wynik odsłania prowadzący na spotkaniu.
           */
          <div className="ukonczenie flex flex-1 flex-col items-center px-2 text-center">
            <div className="flex flex-1 flex-col items-center justify-center">
              {/* Pierścień: liczba pytań w szklanym krążku, obrys kręci się
                  bardzo wolno, żeby ekran nie stał zupełnie w miejscu. */}
              <div
                data-ruch
                className="relative mb-7 flex h-[8.25rem] w-[8.25rem] items-center justify-center"
                style={{
                  ["--ruch" as string]: "wyskok",
                  ["--czas" as string]: "800ms",
                  ["--zwloka" as string]: "120ms",
                }}
              >
                <span
                  aria-hidden
                  data-ruch
                  className="absolute h-[8.75rem] w-[8.75rem] rounded-full blur-[6px]"
                  style={{
                    background: "radial-gradient(circle, rgba(109,61,245,.3), rgba(109,61,245,0) 70%)",
                    ["--ruch" as string]: "tetno",
                    ["--czas" as string]: "4s",
                    ["--powtorzenia" as string]: "infinite",
                  }}
                />
                <svg
                  aria-hidden
                  data-ruch
                  viewBox="0 0 132 132"
                  className="absolute inset-0"
                  fill="none"
                  style={{
                    ["--ruch" as string]: "obrot",
                    ["--czas" as string]: "14s",
                    ["--krzywa" as string]: "linear",
                    ["--powtorzenia" as string]: "infinite",
                  }}
                >
                  <circle cx="66" cy="66" r="61" stroke="rgba(120,126,180,.14)" strokeWidth="4" />
                  <circle
                    cx="66"
                    cy="66"
                    r="61"
                    stroke="url(#start-pierscien)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="383"
                    strokeDashoffset="290"
                    transform="rotate(-90 66 66)"
                  />
                  <defs>
                    <linearGradient id="start-pierscien" x1="5" y1="16" x2="127" y2="120">
                      <stop stopColor="#1d5bff" />
                      <stop offset=".55" stopColor="#6d3df5" />
                      <stop offset="1" stopColor="#b8460f" />
                    </linearGradient>
                  </defs>
                </svg>
                <span
                  className="relative flex h-[6.75rem] w-[6.75rem] flex-col items-center justify-center rounded-full border border-white/95 backdrop-blur-[14px]"
                  style={{
                    background: "linear-gradient(150deg, rgba(255,255,255,.92), rgba(255,255,255,.58))",
                    boxShadow: "0 20px 48px rgba(86,84,170,.2), inset 0 1px 0 rgba(255,255,255,.9)",
                  }}
                >
                  <span
                    className={`gradient-tytul font-extrabold leading-none tracking-[-0.04em] ${
                      rownaSciezka ? "text-naglowek" : "text-naglowek-maly"
                    }`}
                  >
                    {rownaSciezka ? zakresPytan.max : `do ${zakresPytan.max}`}
                  </span>
                  <span className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-atrament-slaby">
                    {odmianaPytan(zakresPytan.max)}
                  </span>
                </span>
              </div>

              {/* Nadpis nazywa moduł. W połowie modułów nazwa jest zarazem
                  nagłówkiem wstępu (A3: „Jak naturalnie działam"), a ten sam
                  napis dwa razy pod sobą wygląda jak usterka, więc wtedy go
                  nie ma. */}
              {nazwaModulu.toLowerCase() === (ekran.naglowek ?? "").toLowerCase() ? null : (
                <p
                  data-ruch
                  className="text-drobne font-bold uppercase tracking-[0.22em] text-atrament-slaby"
                  style={{ ["--ruch" as string]: "wschod", ["--czas" as string]: "700ms", ["--zwloka" as string]: "220ms" }}
                >
                  {nazwaModulu}
                </p>
              )}
              {ekran.naglowek ? (
                <h1
                  data-ruch
                  className="mt-4 max-w-[20ch] text-naglowek-duzy font-extrabold leading-[1.06] tracking-[-0.035em] text-atrament sm:text-tytul"
                  style={{ ["--ruch" as string]: "wschod", ["--czas" as string]: "820ms", ["--zwloka" as string]: "300ms" }}
                >
                  <DwaTony tekst={ekran.naglowek} />
                </h1>
              ) : null}
              <div
                data-ruch
                className="proza mt-5 max-w-[34rem] [&_p]:text-tresc-duza"
                style={{ ["--ruch" as string]: "wschod", ["--czas" as string]: "780ms", ["--zwloka" as string]: "440ms" }}
              >
                {(ekran.akapity ?? []).map((a, i) => (
                  <p key={i}>{a}</p>
                ))}
              </div>

              {/* Trzy fakty o tym, w co uczestnik właśnie wchodzi. */}
              <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
                {[
                  {
                    tekst: rownaSciezka
                      ? `${zakresPytan.max} ${odmianaPytan(zakresPytan.max)}`
                      : `od ${zakresPytan.min} do ${zakresPytan.max} pytań, zależnie od tego, gdzie jesteś`,
                    kropka: "#1d5bff",
                  },
                  {
                    tekst: `około ${minuty} ${odmiana(minuty, "minuta", "minuty", "minut")}`,
                    kropka: "#6d3df5",
                  },
                  { tekst: "bez limitu czasu, możesz wrócić", kropka: "#b8460f" },
                ].map((z, i) => (
                  <li
                    key={z.tekst}
                    data-ruch
                    className="flex items-center gap-2.5 rounded-full border border-white/90 bg-white/70 px-4 py-2.5 text-male font-semibold text-atrament-sciszony shadow-[0_10px_26px_rgba(86,84,170,0.1)]"
                    style={{
                      ["--ruch" as string]: "wschod",
                      ["--czas" as string]: "700ms",
                      ["--zwloka" as string]: `${540 + i * 70}ms`,
                    }}
                  >
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: z.kropka }} />
                    {z.tekst}
                  </li>
                ))}
              </ul>

              {/* „Jak to działa": reszta instrukcji pod jednym kliknięciem.
                  Na wstępie zostają dwa zdania, a kto chce więcej, rozwija. */}
              {ekran.rozwiniecie ? (
                <details
                  data-ruch
                  className="mt-6 w-full max-w-czytelna"
                  style={{ ["--ruch" as string]: "rozjasnienie", ["--czas" as string]: "700ms", ["--zwloka" as string]: "760ms" }}
                >
                  <summary className="przejscie mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-white/90 bg-white/60 px-4 py-2.5 text-male font-semibold text-atrament-sciszony backdrop-blur-[12px] hover:bg-white/90 hover:text-akcent-jasny">
                    <svg aria-hidden width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 7.2v4M8 4.9v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    Jak to działa?
                  </summary>
                  <div className="proza mt-4 rounded-karta border border-white/90 bg-white/62 p-5 text-left backdrop-blur-[14px]">
                    {ekran.rozwiniecie.map((a, i) => (
                      <p key={i}>{a}</p>
                    ))}
                  </div>
                </details>
              ) : null}

              {/* Jedno duże wejście. Przycisk z połyskiem jest jedyną rzeczą na
                  tym ekranie, którą da się kliknąć. */}
              <div
                data-ruch
                className="relative mt-8"
                style={{ ["--ruch" as string]: "wschod", ["--czas" as string]: "760ms", ["--zwloka" as string]: "860ms" }}
              >
                <span
                  aria-hidden
                  data-ruch
                  className="absolute -inset-x-2.5 -inset-y-3.5 rounded-full blur-[22px]"
                  style={{
                    background: "linear-gradient(96deg, #1d5bff, #6d3df5, #b8460f)",
                    opacity: 0.45,
                    ["--ruch" as string]: "tetno",
                    ["--czas" as string]: "3400ms",
                    ["--zwloka" as string]: "1400ms",
                    ["--powtorzenia" as string]: "infinite",
                  }}
                />
                <button
                  type="button"
                  onClick={() => void dalej()}
                  disabled={konczy}
                  className="przejscie przycisk-gradient relative inline-flex min-h-[5rem] items-center gap-4 overflow-hidden rounded-full px-14 text-naglowek font-bold"
                >
                  {ekran.przyciskDalej ?? "Zaczynamy"}
                  <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12h15M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    aria-hidden
                    data-ruch
                    className="absolute inset-y-0 left-0 w-[38%]"
                    style={{
                      background:
                        "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.5), rgba(255,255,255,0))",
                      ["--ruch" as string]: "polysk",
                      ["--czas" as string]: "3200ms",
                      ["--zwloka" as string]: "1600ms",
                      ["--powtorzenia" as string]: "infinite",
                    }}
                  />
                </button>
              </div>

              <p
                data-ruch
                className="mt-5 max-w-czytelna text-male text-atrament-slaby"
                style={{ ["--ruch" as string]: "rozjasnienie", ["--czas" as string]: "700ms", ["--zwloka" as string]: "1200ms" }}
              >
                {ZAPIS_SAM}
              </p>
            </div>

            {/* Stopka wstępu: dopisek odręczny przy lewej krawędzi, znak
                programu przy prawej. Tak samo jak w makiecie. */}
            <div className="mt-10 flex w-full flex-wrap items-end justify-between gap-6">
              <p
                aria-hidden
                data-ruch
                className="odreczny max-w-[16rem] whitespace-pre-line text-left"
                style={{ ["--ruch" as string]: "rozjasnienie", ["--czas" as string]: "900ms", ["--zwloka" as string]: "1300ms" }}
              >
                {DOPISEK[modul]}
                <svg width="170" height="14" viewBox="0 0 180 14" fill="none" className="mt-0.5 block">
                  <path
                    data-ruch
                    d="M3 9c38-6 108-8 174-4"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeDasharray="210"
                    style={{
                      ["--ruch" as string]: "podkreslenie",
                      ["--czas" as string]: "900ms",
                      ["--zwloka" as string]: "1500ms",
                    }}
                  />
                </svg>
              </p>
              <p className="pb-1.5 text-drobne font-bold uppercase tracking-[0.22em] text-atrament-slaby">
                DreamWork
              </p>
            </div>
          </div>
        ) : ekran.typ === "przerwa" && ekran.ostrzezenie ? (
          /**
           * Zmiana zasady w środku modułu.
           *
           * Jedyny ekran w programie z własnym kolorem: pomarańcz zamiast
           * błękitu, znak skierowany w dół zamiast w górę. To nie jest ozdoba.
           * Blok czwarty A4 pyta odwrotnie i uczestnik, który tego nie zauważy,
           * odpowiada przez sześć pytań wbrew sobie, a wynik wygląda potem
           * sensownie i jest fałszywy. Kolor, znak i zestawienie „przedtem
           * kontra teraz" mówią to trzy razy, różnymi środkami.
           */
          <div className="flex flex-col items-center px-2 text-center">
            <span
              aria-hidden
              className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/90 bg-white shadow-[0_12px_34px_rgba(184,70,15,0.18)]"
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="var(--color-pomarancz)">
                <path d="M12 19 3.5 6h17z" />
              </svg>
            </span>
            <p className="mt-6 text-drobne font-bold uppercase tracking-[0.22em] text-pomarancz">
              {ekran.etykieta ?? nazwaModulu}
            </p>
            {ekran.naglowek ? (
              <h1 className="mt-4 max-w-[18ch] text-naglowek-duzy font-extrabold leading-[1.06] tracking-[-0.03em] text-atrament sm:text-tytul">
                <DwaTony tekst={ekran.naglowek} pomaranczowy />
              </h1>
            ) : null}
            <div className="proza mt-5 max-w-[42rem] [&_p]:text-tresc-duza">
              {(ekran.akapity ?? []).map((a, i) => (
                <p key={i}>{a}</p>
              ))}
            </div>

            {ekran.zestawienie ? (
              <ul className="mt-8 grid w-full max-w-[44rem] gap-4 sm:grid-cols-2">
                {ekran.zestawienie.map((z, i) => (
                  <li
                    key={z.etykieta}
                    className={`rounded-karta border bg-panel/80 px-6 py-5 text-left ${
                      i === ekran.zestawienie!.length - 1
                        ? "border-pomarancz/45 bg-pomarancz-tlo/60"
                        : "border-linia"
                    }`}
                  >
                    <p
                      className={`text-male font-extrabold ${
                        i === ekran.zestawienie!.length - 1 ? "text-pomarancz" : "text-atrament-slaby"
                      }`}
                    >
                      {z.etykieta}
                    </p>
                    <p className="mt-1.5 text-tresc leading-snug text-atrament-sciszony">{z.tresc}</p>
                  </li>
                ))}
              </ul>
            ) : null}

            {ekran.dopisek ? (
              <p aria-hidden className="odreczny odreczny-pomarancz mt-8">
                {ekran.dopisek}
              </p>
            ) : null}
          </div>
        ) : ekran.typ === "przerwa" ? (
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
          </div>
        ) : (
          <>
            {/* Pytanie jest największym tekstem na ekranie, a ostatnie słowo
                dostaje gradient. Pod nim jedno zdanie z zasadą tego modułu. */}
            <div className={naSrodku ? "relative text-center" : "relative sm:pr-[13rem]"}>
              {naSrodku ? null : (
                <p aria-hidden className="odreczny absolute right-0 top-1 hidden max-w-[11rem] whitespace-pre-line text-right sm:block">
                  {ekran.dopisek ?? DOPISEK[modul]}
                </p>
              )}
              <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">{etykietaNadTytulem}</p>
              <h1
                className={`mt-3 font-extrabold leading-[1.04] tracking-[-0.02em] text-atrament ${
                  naSrodku ? "mx-auto max-w-[24ch]" : "max-w-[22ch] sm:max-w-[18ch]"
                } ${
                  tytulEkranu.length > 46
                    ? "text-naglowek sm:text-naglowek-duzy"
                    : "text-naglowek-duzy sm:text-tytul"
                }`}
              >
                <DwaTony tekst={tytulEkranu} pomaranczowy={ekran.akcent === "pomarancz"} />
              </h1>
              {podtytul ? (
                <p
                  className={`mt-3 max-w-czytelna text-tresc leading-relaxed text-atrament-sciszony ${
                    naSrodku ? "mx-auto" : ""
                  }`}
                >
                  {podtytul}
                </p>
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
            {zPlanszaPary ? (
              <div className="mx-auto mt-7 w-full max-w-[52rem]">
                <PlanszaPary
                  lewy={widocznePozycje[0].stronaA!.ikona as string}
                  prawy={widocznePozycje[0].stronaB!.ikona as string}
                  wysokosc={220}
                />
              </div>
            ) : zPlansza && pelnaPlansza ? (
              /* Gotowa plansza pytania: cały kadr w 16:9, bez przycinania.
                 Kolumna węższa niż bloki odpowiedzi, bo przy pełnej szerokości
                 pytanie i odpowiedzi zeszłyby pod krawędź ekranu. */
              <div className="mx-auto mt-6 w-full max-w-[44rem]">
                <Plansza klucz={kluczPlanszy as string} wybor pelnaProporcja />
              </div>
            ) : zPlansza ? (
              /* Kwadratowy kafel kategorii: pas o stałej wysokości, obraz
                 pośrodku, rozmyta kopia dopełnia boki. */
              <div className={`mt-7 ${naSrodku ? "mx-auto w-full max-w-[52rem]" : ""}`}>
                <Plansza klucz={kluczPlanszy as string} wybor wysokosc={naSrodku ? 220 : 168} />
              </div>
            ) : null}

            {/* Polecenie nad odpowiedziami jako linia z podpisem pośrodku:
                w makiecie filtrów oddziela pytanie od trzech możliwych ocen. */}
            {poleceniePrzyOdpowiedziach ? (
              <p className="mt-7 flex items-center gap-4 text-drobne font-bold uppercase tracking-[0.2em] text-atrament-slaby">
                <span aria-hidden className="h-px flex-1 bg-linia" />
                {poleceniePrzyOdpowiedziach}
                <span aria-hidden className="h-px flex-1 bg-linia" />
              </p>
            ) : null}

            <div
              className={`${siatka ? "grid gap-3 sm:grid-cols-2" : "flex flex-col gap-6"} ${
                ekranWyboru ? (poleceniePrzyOdpowiedziach ? "mt-4" : "mt-7") : "szklo mt-6 p-5 sm:p-7"
              } ${naSrodku ? "w-full text-left" : ""}`}
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
                    akcent={ekran.akcent}
                    miejsce={i}
                    wartosc={odpowiedzi[p.id]}
                    naZmiane={(v) => zmien(p.id, v, p.typ === "tekst" || p.typ === "kilka_tekstow")}
                  />
                </div>
              ))}
            </div>

            {/*
              Panel ścieżki pod pierwszym pytaniem A0.
              Odpowiedź na etap rozstrzyga, o co zapytamy dalej, więc od razu
              mówimy, ile pytań przed uczestnikiem i czego nie zapytamy.
              Lista pominiętych tematów jest liczona z pytań, nie wpisana,
              więc nie rozjedzie się przy następnej zmianie treści.
            */}
            {sciezka && ekran.klucz === "A0_etap" ? (
              <div className="szklo mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-6">
                <div className="min-w-0 flex-1">
                  <p className="text-drobne font-bold uppercase tracking-[0.18em] text-atrament-slaby">
                    Twoja ścieżka
                  </p>
                  <p className="mt-1.5 text-tresc-duza font-extrabold leading-tight text-atrament">
                    Ścieżka {sciezka.nr} · {sciezka.nazwa}
                  </p>
                  <p className="mt-1 text-male leading-snug text-atrament-sciszony">{sciezka.opis}</p>
                </div>
                <ul className="flex shrink-0 flex-wrap gap-2">
                  <li className="rounded-full bg-akcent-tlo px-3.5 py-1.5 text-male font-semibold text-akcent-jasny">
                    {pytaniaWidoczne.length} {odmiana(pytaniaWidoczne.length, "pytanie", "pytania", "pytań")}
                  </li>
                  <li className="rounded-full bg-akcent-tlo px-3.5 py-1.5 text-male font-semibold text-akcent-jasny">
                    około {minutyZPozycji(pytaniaWidoczne.length, modul)}{" "}
                    {odmiana(minutyZPozycji(pytaniaWidoczne.length, modul), "minuta", "minuty", "minut")}
                  </li>
                </ul>
                {czegoNieZapytamyA0(odpowiedzi.etap as string | undefined).length > 0 ? (
                  <p className="shrink-0 border-t border-linia pt-3 text-male text-atrament-sciszony sm:max-w-[16rem] sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
                    Nie zapytamy Cię o:{" "}
                    <span className="font-semibold text-atrament">
                      {czegoNieZapytamyA0(odpowiedzi.etap as string | undefined).join(", ")}
                    </span>
                  </p>
                ) : null}
              </div>
            ) : null}

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
            className="przejscie wejscie-ekranu przycisk-pigulka inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 text-male font-semibold"
          >
            <span aria-hidden>↩</span>
            Cofnij ostatnią odpowiedź
          </button>
        </div>
      ) : null}

      {/* Ekran wstępu ma własny duży przycisk w środku kolumny, więc pasek
          u dołu byłby drugim „Zaczynamy" w tym samym widoku. „Wstecz" i tak
          jest tam niewidoczne: wstęp stoi na początku części. */}
      {ekran.typ === "wstep" ? null : (
        <footer className="sticky bottom-0 z-20 -mx-4 mt-6 flex items-center justify-between gap-4 bg-gradient-to-t from-tlo via-tlo/85 to-transparent px-4 pb-3 pt-4 sm:static sm:z-auto sm:m-0 sm:mt-6 sm:bg-none sm:p-0">
          <button
            type="button"
            onClick={() => {
              ustawIndeks((i) => Math.max(0, i - 1));
              ustawWychodzi(false);
              if (window.scrollY > 8) window.scrollTo({ top: 0, behavior: "auto" });
            }}
            disabled={bezpiecznyIndeks === 0}
            className="przejscie przycisk-pigulka min-h-12 rounded-2xl px-6 text-male font-semibold disabled:invisible"
          >
            <span aria-hidden className="mr-2">←</span>
            Wstecz
          </button>

          {/* Ekran wyśrodkowany nie ma miejsca na dopisek przy prawej krawędzi,
              bo tam nic nie stoi. W makiecie siedzi on między przyciskami. */}
          {naSrodku && ekran.dopisek ? (
            <p aria-hidden className="odreczny hidden flex-1 text-center sm:block">
              {ekran.dopisek}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => void dalej()}
            disabled={!kompletny || konczy}
            className={`przejscie min-h-[3.25rem] rounded-2xl px-8 text-tresc font-bold sm:min-w-[14rem] ${
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
      )}
    </div>
  );
}

/**
 * Nagłówek dwutonowy: pierwsza połowa ciemna, druga w gradiencie, a znak
 * zapytania osobno w pomarańczu. Rozbicie po spacji, pozostałe znaki
 * interpunkcyjne zostają przy słowie.
 */
function DwaTony({ tekst, pomaranczowy }: { tekst: string; pomaranczowy?: boolean }) {
  // Ekran zmiany zasady ma własny gradient, pomarańczowy: cały ten ekran
  // mówi „tu jest inaczej", więc niebieski tytuł by mu przeczył.
  const gradient = pomaranczowy ? "gradient-tytul-pomarancz" : "gradient-tytul";
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
        <span className={gradient}>{bezZnaku}</span>
        {ogon}
      </>
    );
  }
  // Podział pada w łamaniu wiersza, nie w środku linii: w referencjach
  // pierwsza linia jest ciemna, druga gradientowa. Bez tego gradient zaczyna
  // się w połowie wiersza i przestaje czytać się jako druga linia.
  // Gradient dostaje 25-45% słów nagłówka: przy czterech jedno, przy pięciu
  // dwa, przy siedmiu trzy. Ciemna część jest zawsze dłuższa od gradientowej.
  const ile = Math.max(1, Math.floor(slowa.length * 0.45));
  const poczatek = slowa.slice(0, -ile).join(" ");
  const koniec = slowa.slice(-ile).join(" ");
  return (
    <>
      <span className="block">{poczatek}</span>
      <span className="block">
        <span className={gradient}>{koniec}</span>
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

/**
 * Polska odmiana po liczbie: 1 pytanie, 2 pytania, 5 pytań. Reguła obejmuje
 * też nastki („12 pytań", nie „12 pytania") i dziesiątki z końcówką 2-4.
 */
function odmiana(
  ile: number,
  jeden: string,
  kilka: string,
  wiele: string,
): string {
  const reszta = ile % 10;
  const setka = ile % 100;
  if (ile === 1) return jeden;
  if (reszta >= 2 && reszta <= 4 && (setka < 12 || setka > 14)) return kilka;
  return wiele;
}

const odmianaPytan = (ile: number) =>
  odmiana(ile, "pytanie", "pytania", "pytań");

/**
 * Tło ekranu wstępu: pastelowy gradient na całe okno i dwie plamy koloru
 * w bardzo wolnym ruchu. `fixed`, bo ma sięgać poza kolumnę treści, i `-z-10`
 * wewnątrz `isolate` Runnera, żeby nie przykryło nagłówka.
 */
function TloWstepu() {
  return (
    <div aria-hidden className="ukonczenie pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 4%, #fde3d6 0%, rgba(253,227,214,0) 46%), radial-gradient(90% 70% at 12% 92%, #f3dcf6 0%, rgba(243,220,246,0) 52%), linear-gradient(168deg, #eef0fc 0%, #e7eafb 42%, #f3eefb 100%)",
        }}
      />
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
