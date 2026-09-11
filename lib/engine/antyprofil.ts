/**
 * ANTYPROFIL: 60 kodow "kto sie w tym nie odnajdzie" z kart zawodow.
 *
 * Etap E warstwy drugiej. Trafienie NIE OBNIZA wyniku. Dopina zdanie do
 * raportu i temat na sesje indywidualna. Uzasadnienie jest takie samo jak
 * przy zasadzie "kompetencje tylko w gore": antyprofil jest hipoteza,
 * a odejmowanie punktow za hipoteze zamyka drogi, ktorych zamykac nie wolno.
 *
 * ZASADA WYPROWADZANIA, przyjeta przy kodowaniu:
 * antyprofil wynika wylacznie z tego, co uczestnik ZADEKLAROWAL jako granice
 * albo preferencje - z warunkow kluczowych A3, wartosci A4, odpowiedzi A5,
 * twardych parametrow M1 i faktow z A0. Nigdy z zainteresowan A1 ani
 * z samooceny kompetencji A2.
 *
 * Powod: zdanie "Twoje odpowiedzi sugeruja, ze to moze byc dla Ciebie
 * trudniejsze" oparte na samoocenie siedemnastolatka bylo by dokladnie tym,
 * przed czym ostrzega caly modul A2.
 *
 * Kody NIEAKTYWNE nigdy nie trafiaja. Po fazie piatej zostalo ich dwanascie:
 * kazdy wymagalby pozycji, ktora brzmialaby jak test osobowosci albo jak
 * samoocena, przed ktora ostrzega caly modul A2. Do usuniecia z kart.
 */

import { PROGI_PROFILU } from "./config";
import type { WynikiModulow } from "./typy";

// =====================================================================
// PREDYKATY POMOCNICZE
// =====================================================================

/** Czy wymiar A3 jest u uczestnika warunkiem kluczowym po danej stronie osi. */
function warunekKluczowy(w: WynikiModulow, wymiar: string, biegun: "A" | "B"): boolean {
  const sila = w.a3Sila[wymiar];
  const poz = w.a3Pozycje[wymiar];
  if (sila === undefined || poz === undefined) return false;
  if (sila < PROGI_PROFILU.A3_PROG_SILY) return false;
  return biegun === "A" ? poz > 50 : poz < 50;
}

/** Czy uczestnik odpowiedzial NIE na pozycje modulu A5. */
function odmowa(w: WynikiModulow, filtr: string): boolean {
  return w.g[filtr] === 0;
}

/** Czy wartosc jest u uczestnika wysoka albo nieodzowna. */
function wartoscWazna(w: WynikiModulow, kod: string): boolean {
  return w.a4Top5.includes(kod) || w.a4Progowe.includes(kod);
}

/** Czy uczestnik wskazal ograniczenie zdrowotne w module A0. */
function ograniczenie(w: WynikiModulow, kod: string): boolean {
  return w.punktStartu?.ograniczenia.includes(kod) ?? false;
}

/** Czy uczestnik jest wyraznie po danym biegunie osi ksztaltu zycia. */
function biegunZycia(w: WynikiModulow, wymiar: string, biegun: "A" | "B"): boolean {
  const poz = w.shape[wymiar];
  if (poz === null || poz === undefined) return false;
  return biegun === "A" ? poz >= 75 : poz <= 25;
}

/** Czy uczestnik wskazal przedmiot jako trudny w module A0. */
function przedmiotTrudny(w: WynikiModulow, przedmiot: string): boolean {
  return w.punktStartu?.przedmiotyTrudne.includes(przedmiot) ?? false;
}

// =====================================================================
// TABELA 60 KODOW
// =====================================================================

export interface ReguleAktywna {
  aktywna: true;
  /** Co w tym zawodzie jest faktem, o ktorym mowa. Zdanie pierwsze. */
  wZawodzie: string;
  /** Skad w profilu uczestnika bierzemy hipoteze. Zdanie drugie. */
  zrodlo: string;
  sprawdz: (w: WynikiModulow) => boolean;
}

export interface RegulaNieaktywna {
  aktywna: false;
  /** Dlaczego kodu nie da sie odwzorowac jednoznacznie. */
  powod: string;
}

export type RegulaAntyprofilu = ReguleAktywna | RegulaNieaktywna;

export const ANTYPROFIL: Record<string, RegulaAntyprofilu> = {
  // --- granice z modulu A5 ---
  brud_nie: {
    aktywna: true,
    wZawodzie: "Kontakt z brudem i nieprzyjemnymi warunkami jest tu codziennością, nie wyjątkiem.",
    zrodlo: "odpowiedziałeś NIE na pytanie o pracę w brudzie i nieprzyjemnych warunkach",
    sprawdz: (w) => odmowa(w, "F20"),
  },
  cudza_zlosc: {
    aktywna: true,
    wZawodzie: "Znaczna część rozmów w tej pracy jest z osobami niezadowolonymi.",
    zrodlo: "odpowiedziałeś NIE na pytanie o obsługiwanie roszczeniowych ludzi",
    sprawdz: (w) => odmowa(w, "F25"),
  },
  doksztalcanie_nie: {
    aktywna: true,
    wZawodzie: "Ten zawód wymaga dokształcania się przez całe życie zawodowe, nie tylko na starcie.",
    zrodlo: "odpowiedziałeś NIE na pytanie o dokształcanie przez całe życie",
    sprawdz: (w) => odmowa(w, "F04"),
  },
  fizycznosc: {
    aktywna: true,
    wZawodzie: "To jest praca wymagająca fizycznie, przez większość dnia i przez całą karierę.",
    zrodlo: "odpowiedziałeś NIE na pytanie o pracę fizyczną",
    sprawdz: (w) => odmowa(w, "F16"),
  },
  noce_nie: {
    aktywna: true,
    wZawodzie: "Praca zmianowa i nocna jest tu regułą, nie okresowym wyjątkiem.",
    zrodlo: "odpowiedziałeś NIE na pytanie o pracę zmianową lub nocną",
    sprawdz: (w) => odmowa(w, "F12"),
  },
  potrzeba_ruchu: {
    aktywna: true,
    wZawodzie: "To jest praca przy biurku przez większość dnia.",
    zrodlo: "odpowiedziałeś NIE na pytanie o siedzenie przy komputerze przez większość dnia",
    sprawdz: (w) => odmowa(w, "F19"),
  },
  samotnosc_w_roli: {
    aktywna: true,
    wZawodzie: "W tej roli jest się w dużej mierze samemu, bez zespołu obok.",
    zrodlo: "odpowiedziałeś NIE na pytanie o pracę w dużej samotności",
    sprawdz: (w) => odmowa(w, "F27"),
  },
  stala_pensja: {
    aktywna: true,
    wZawodzie: "Dochód w tym zawodzie bywa nierówny i zależy od tego, ile pracy uda się zdobyć.",
    zrodlo: "odpowiedziałeś NIE na pytanie o niepewny, zmienny dochód",
    sprawdz: (w) => odmowa(w, "F28"),
  },
  stanie_nie: {
    aktywna: true,
    wZawodzie: "Większość dnia spędza się tu na nogach.",
    zrodlo: "odpowiedziałeś NIE na pytanie o stanie lub chodzenie przez większość dnia",
    sprawdz: (w) => odmowa(w, "F18"),
  },
  weekendy_nie: {
    aktywna: true,
    wZawodzie: "Weekendy są tu normalnym czasem pracy.",
    zrodlo: "odpowiedziałeś NIE na pytanie o pracę w weekendy",
    sprawdz: (w) => odmowa(w, "F11"),
  },
  mierzenie: {
    aktywna: true,
    wZawodzie: "Pracę ocenia się tu liczbami: celem, wynikiem, terminem.",
    zrodlo: "odpowiedziałeś NIE na pytanie o pracę pod stałą presją czasu i wyniku",
    sprawdz: (w) => odmowa(w, "F32"),
  },

  // --- warunki kluczowe z modulu A3 ---
  potrzeba_ciszy: {
    aktywna: true,
    wZawodzie: "To jest praca w ruchu, hałasie i ciągłych przerwaniach.",
    zrodlo: "ciche, uporządkowane miejsce jest u Ciebie warunkiem kluczowym",
    sprawdz: (w) => warunekKluczowy(w, "OTO", "A"),
  },
  potrzeba_ludzi: {
    aktywna: true,
    wZawodzie: "To jeden z bardziej samotnych zawodów: kontakt z ludźmi jest tu rzadki.",
    zrodlo: "stały kontakt z ludźmi jest u Ciebie warunkiem kluczowym",
    sprawdz: (w) => warunekKluczowy(w, "SAM", "B"),
  },
  unikanie_konfliktu: {
    aktywna: true,
    wZawodzie: "Ta praca regularnie stawia w sytuacji, w której trzeba komuś powiedzieć nie.",
    zrodlo: "atmosfera bez napięć jest u Ciebie warunkiem kluczowym",
    sprawdz: (w) => warunekKluczowy(w, "KON", "B"),
  },
  konfrontacja_nie: {
    aktywna: true,
    wZawodzie: "Konfrontacja jest tu częścią zawodu, nie wypadkiem przy pracy.",
    zrodlo: "atmosfera bez napięć jest u Ciebie warunkiem kluczowym",
    sprawdz: (w) => warunekKluczowy(w, "KON", "B"),
  },
  komunikacja_ostra: {
    aktywna: true,
    wZawodzie: "Komunikacja bywa tu ostra i bezpośrednia, zwłaszcza pod presją czasu.",
    zrodlo: "atmosfera bez napięć jest u Ciebie warunkiem kluczowym",
    sprawdz: (w) => warunekKluczowy(w, "KON", "B"),
  },
  nuda_powtarzalnosc: {
    aktywna: true,
    wZawodzie: "Duża część tej pracy jest powtarzalna i wygląda tak samo przez lata.",
    zrodlo: "ciągła zmiana i nowe rzeczy są u Ciebie warunkiem kluczowym",
    sprawdz: (w) => warunekKluczowy(w, "NOW", "A") || wartoscWazna(w, "ZMI"),
  },
  potrzeba_decydowania: {
    aktywna: true,
    wZawodzie: "Decyzje zapadają tu zwykle nad Tobą, a Ty odpowiadasz za ich wykonanie.",
    zrodlo: "realny wpływ na decyzje jest u Ciebie warunkiem kluczowym",
    sprawdz: (w) => warunekKluczowy(w, "DEC", "A"),
  },
  potrzeba_pewnosci: {
    aktywna: true,
    wZawodzie: "W tej pracy trzeba działać przy niepełnych danych i brać na siebie ryzyko pomyłki.",
    zrodlo: "stabilne, przewidywalne warunki są u Ciebie warunkiem kluczowym",
    sprawdz: (w) => warunekKluczowy(w, "RYZ", "B"),
  },
  procedury_nie: {
    aktywna: true,
    wZawodzie: "Ta praca jest ściśle proceduralna i skróty kończą się źle.",
    zrodlo: "swoboda w układaniu pracy jest u Ciebie warunkiem kluczowym",
    sprawdz: (w) => warunekKluczowy(w, "STR", "B"),
  },
  samodyscyplina_brak: {
    aktywna: true,
    wZawodzie: "Nikt tu nie pilnuje terminów za Ciebie. Rytm pracy ustalasz sam.",
    zrodlo: "zewnętrzne terminy i przypomnienia są u Ciebie warunkiem kluczowym",
    sprawdz: (w) => warunekKluczowy(w, "NAP", "B"),
  },

  // --- wartosci z modulu A4 ---
  bez_ograniczen: {
    aktywna: true,
    wZawodzie: "Ta droga oznacza pracę w cudzych ramach: standardach, regulaminie albo umowie.",
    zrodlo: "wolność i decydowanie o sobie są dla Ciebie jedną z najważniejszych rzeczy",
    sprawdz: (w) => wartoscWazna(w, "WOL"),
  },
  potrzeba_relacji: {
    aktywna: true,
    wZawodzie: "Kontakt z ludźmi jest tu krótki i zadaniowy, bez budowania relacji.",
    zrodlo: "bliskie relacje w pracy są dla Ciebie jedną z najważniejszych rzeczy",
    sprawdz: (w) => wartoscWazna(w, "REL"),
  },
  potrzeba_rozwoju: {
    aktywna: true,
    wZawodzie: "Po kilku latach ta praca przestaje uczyć czegokolwiek nowego.",
    zrodlo: "rozwój i uczenie się są dla Ciebie jedną z najważniejszych rzeczy",
    sprawdz: (w) => wartoscWazna(w, "ROZ"),
  },
  potrzeba_stabilnosci: {
    aktywna: true,
    wZawodzie: "Ta droga nie daje pewności jutra, zwłaszcza przez pierwsze lata.",
    zrodlo: "stabilność i bezpieczeństwo są dla Ciebie jedną z najważniejszych rzeczy",
    sprawdz: (w) => wartoscWazna(w, "STA"),
  },
  potrzeba_uznania: {
    aktywna: true,
    wZawodzie: "To praca w tle. Widać jej efekt, nie widać osoby, która go zrobiła.",
    zrodlo: "uznanie jest dla Ciebie jedną z najważniejszych rzeczy",
    sprawdz: (w) => wartoscWazna(w, "UZN"),
  },
  potrzeba_zmiennosci: {
    aktywna: true,
    wZawodzie: "Rok w tym zawodzie wygląda jak poprzedni, a zmiany są rzadkie i powolne.",
    zrodlo: "zmienność i wyzwania są dla Ciebie jedną z najważniejszych rzeczy",
    sprawdz: (w) => wartoscWazna(w, "ZMI") || warunekKluczowy(w, "NOW", "A"),
  },

  // --- ksztalt zycia, modul M1 ---
  potrzeba_prywatnosci: {
    aktywna: true,
    wZawodzie: "W tej roli jest się osobą publiczną także poza godzinami pracy.",
    zrodlo: "napisałeś, że chcesz życia raczej prywatnego niż widocznego",
    sprawdz: (w) => biegunZycia(w, "WID", "B"),
  },
  zabieranie_do_domu: {
    aktywna: true,
    wZawodzie: "Sprawy z tej pracy wraca się z nimi do domu. To jest jeden z głównych powodów odejść.",
    zrodlo: "napisałeś, że chcesz wyraźnej granicy między pracą a życiem",
    sprawdz: (w) => biegunZycia(w, "GRA", "B"),
  },

  // --- fakty z modulu A0 ---
  kregoslup_slaby: {
    aktywna: true,
    wZawodzie: "Ta praca obciąża kręgosłup: dźwiganie, wymuszone pozycje, długie stanie.",
    zrodlo: "zaznaczyłeś ograniczenia ruchowe albo problemy z kręgosłupem",
    sprawdz: (w) => ograniczenie(w, "kregoslup"),
  },
  wzrok_slaby: {
    aktywna: true,
    wZawodzie: "Ten zawód wymaga bardzo dobrego wzroku i precyzji w małej skali.",
    zrodlo: "zaznaczyłeś wadę wzroku, której nie da się w pełni skorygować",
    sprawdz: (w) => ograniczenie(w, "wzrok"),
  },
  sluch_slaby: {
    aktywna: true,
    wZawodzie: "Ten zawód opiera się na słuchu i nie da się go obejść techniką.",
    zrodlo: "zaznaczyłeś ubytek słuchu",
    sprawdz: (w) => ograniczenie(w, "sluch"),
  },
  wysokosc_nie: {
    aktywna: true,
    wZawodzie: "Praca na wysokości jest tu stałym elementem dnia.",
    zrodlo: "zaznaczyłeś lęk wysokości",
    sprawdz: (w) => ograniczenie(w, "wysokosc"),
  },
  rachunki_nie: {
    aktywna: true,
    wZawodzie: "Ta rola to w dużej części liczby: marża, koszt, rozliczenie.",
    zrodlo: "wskazałeś matematykę jako przedmiot, który sprawia Ci największą trudność",
    sprawdz: (w) =>
      przedmiotTrudny(w, "matematyka") || w.punktStartu?.matematyka === "najwiekszy_problem",
  },


  // --- granice z jedenastu pozycji A5 dolozonych po fazie 5 ---
  umieranie: {
    aktywna: true,
    wZawodzie: "Kontakt ze śmiercią i z umieraniem jest tu regularną częścią pracy, nie wyjątkiem.",
    zrodlo: "odpowiedziałeś NIE na pytanie o regularny kontakt ze śmiercią i z umieraniem",
    sprawdz: (w) => odmowa(w, "F34"),
  },
  agresja: {
    aktywna: true,
    wZawodzie: "Zdarzają się tu sytuacje, w których ktoś jest wobec Ciebie agresywny słownie albo fizycznie.",
    zrodlo: "odpowiedziałeś NIE na pytanie o sytuacje z cudzą agresją",
    sprawdz: (w) => odmowa(w, "F35"),
  },
  ciasnota_nie: {
    aktywna: true,
    wZawodzie: "Część pracy odbywa się w ciasnych przestrzeniach: pod podłogą, w szachcie, w wąskim przejściu.",
    zrodlo: "odpowiedziałeś NIE na pytanie o pracę w ciasnych przestrzeniach",
    sprawdz: (w) => odmowa(w, "F36"),
  },
  wieczory_nie: {
    aktywna: true,
    wZawodzie: "Ta praca zaczyna się wtedy, gdy inni kończą. Wieczory są tu regułą, nie wyjątkiem.",
    zrodlo: "odpowiedziałeś NIE na pytanie o pracę wieczorami",
    sprawdz: (w) => odmowa(w, "F39"),
  },
  sprzedaz_nie: {
    aktywna: true,
    wZawodzie: "Tu trzeba samemu zdobywać klientów i sprzedawać własną usługę. Bez tego nie ma dochodu.",
    zrodlo: "odpowiedziałeś NIE na pytanie o samodzielne zdobywanie klientów",
    sprawdz: (w) => odmowa(w, "F40"),
  },
  dokumentacja_nie: {
    aktywna: true,
    wZawodzie: "Dokumenty, sprawozdania i praca papierkowa zajmują tu znaczną część dnia.",
    zrodlo: "odpowiedziałeś NIE na pytanie o dużą ilość dokumentów i sprawozdań",
    sprawdz: (w) => odmowa(w, "F41"),
  },
  odmowa_do_siebie: {
    aktywna: true,
    wZawodzie: "Odmowa jest tu codziennością: kilkadziesiąt razy w miesiącu, przez całą karierę.",
    zrodlo: "odpowiedziałeś NIE na pytanie o regularne słyszenie odmowy",
    sprawdz: (w) => odmowa(w, "F42"),
  },
  nietykalnosc_pracy: {
    aktywna: true,
    wZawodzie: "Własną pracę poprawia się tu na cudze polecenie, także po raz czwarty.",
    zrodlo: "odpowiedziałeś NIE na pytanie o poprawianie własnej pracy na cudze polecenie",
    sprawdz: (w) => odmowa(w, "F43"),
  },

  // --- efekt pracy: os EFE, dolozona do A3 po fazie 5 ---
  efekt_szybki: {
    aktywna: true,
    wZawodzie: "Efekt tej pracy przychodzi późno: miesiące albo lata od momentu, w którym się ją robi.",
    zrodlo: "wskazałeś szybko widoczny wynik pracy jako warunek kluczowy",
    sprawdz: (w) => warunekKluczowy(w, "EFE", "A"),
  },
  efekt_widoczny: {
    aktywna: true,
    // Ten sam predykat co `efekt_szybki`, ale inne zdanie o zawodzie: tam efekt
    // przychodzi pozno, tu nie widac, kto go zrobil. Zadna karta nie ma obu
    // kodow naraz, wiec uczestnik nigdy nie dostanie dwoch zdan o tej samej rzeczy.
    wZawodzie: "Efektu tej pracy nie widać na zewnątrz i trudno powiedzieć, że to Twoja zasługa.",
    zrodlo: "wskazałeś wyraźnie widoczny wynik pracy jako warunek kluczowy",
    sprawdz: (w) => warunekKluczowy(w, "EFE", "A"),
  },
  kontrola_efektu: {
    aktywna: true,
    wZawodzie: "Wynik tej pracy zależy od rzeczy, na które nie masz wpływu: od klienta, pogody albo od drugiego człowieka.",
    zrodlo: "wskazałeś jednocześnie widoczny efekt i realny wpływ na decyzje jako warunki kluczowe",
    sprawdz: (w) => warunekKluczowy(w, "EFE", "A") && warunekKluczowy(w, "DEC", "A"),
  },

  // --- warunki kluczowe A3, ktore mialy zrodlo od poczatku ---
  waska_wiedza: {
    aktywna: true,
    wZawodzie: "Ta droga zawęża: po kilku latach jest się specjalistą od jednej wąskiej rzeczy.",
    zrodlo: "wskazałeś różnorodność zadań jako warunek kluczowy",
    sprawdz: (w) => warunekKluczowy(w, "GLE", "B"),
  },
  potrzeba_jakosci: {
    aktywna: true,
    wZawodzie: "Tu rzadko da się dopracować rzecz do końca: termin zamyka pracę wcześniej niż jakość.",
    zrodlo: "wskazałeś czas na porządne dopracowanie jako warunek kluczowy",
    sprawdz: (w) => warunekKluczowy(w, "TEM", "B"),
  },
  konflikt_rodzic: {
    aktywna: true,
    wZawodzie: "Konflikt z rodzicami albo z rodziną podopiecznego jest tu stałym elementem pracy.",
    zrodlo: "wskazałeś atmosferę bez napięć jako warunek kluczowy",
    sprawdz: (w) => warunekKluczowy(w, "KON", "B"),
  },

  // =====================================================================
  // KODY NIEAKTYWNE
  // Nie da sie ich wyprowadzic z niczego, co uczestnik deklaruje.
  // Jedynym zrodlem bylaby samoocena albo zainteresowania A1, a z zadnego
  // z tych dwoch antyprofilu nie budujemy. Nieaktywny kod nigdy nie trafia.
  // =====================================================================

  goraco_nie: { aktywna: false, powod: "brak pozycji w A5: moduł nie pyta o pracę w wysokiej temperaturze" },
  wczesne_wstawanie: { aktywna: false, powod: "brak pozycji w A5: moduł nie pyta o godzinę rozpoczęcia pracy" },
  dotyk: { aktywna: false, powod: "brak pozycji: żaden moduł nie pyta o komfort z dotykaniem obcych osób" },
  bez_uzasadnienia: { aktywna: false, powod: "brak pozycji: żaden moduł nie mierzy gotowości do uzasadniania decyzji" },
  bez_zawodu: { aktywna: false, powod: "wymaga oceny, czy uczestnik ma wyuczony fach; A0 zbiera etap, nie kwalifikacje" },
  krytyka_osobista: {
    aktywna: false,
    powod:
      "dałoby się wyprowadzić z niskiej samooceny odporności (A2/30), ale antyprofil nie jest budowany z samooceny kompetencji",
  },
  rece_slabe: {
    aktywna: false,
    powod: "jedynym źródłem byłaby samoocena sprawności manualnej; A0 nie pyta o ograniczenia rąk",
  },
  potrzeba_tworzenia: { aktywna: false, powod: "wynikałoby z zainteresowań A1, a antyprofil nie jest budowany z A1" },
  potrzeba_gotowania: { aktywna: false, powod: "jak wyżej: to zainteresowanie, nie granica" },
  potrzeba_doradzania: { aktywna: false, powod: "brak pozycji: żaden moduł nie pyta o potrzebę udzielania rad" },
  tworczosc_od_razu: { aktywna: false, powod: "brak pozycji: oczekiwanie twórczości od pierwszego dnia nie jest mierzone" },
  wizualizacje_tylko: { aktywna: false, powod: "brak pozycji: dotyczy wyobrażenia o zawodzie, nie cechy uczestnika" },
};

/** Kody, ktore nigdy nie trafiaja. Do raportu z fazy 2. */
export function kodyNieaktywne(): Array<{ kod: string; powod: string }> {
  return Object.entries(ANTYPROFIL)
    .filter(([, r]) => !r.aktywna)
    .map(([kod, r]) => ({ kod, powod: (r as RegulaNieaktywna).powod }))
    .sort((a, b) => a.kod.localeCompare(b.kod));
}
