/**
 * WARSTWA 0: PUNKT STARTU.
 *
 * Modul A0 nie jest assessmentem, tylko metryczka. Zbiera fakty, nie opinie
 * o sobie, i zasila silnik w trzech miejscach:
 *
 *   - dwa filtry TWARDE, jedyne poza wetem, ktore cokolwiek usuwaja,
 *   - filtry MIEKKIE, ktore obnizaja i ostrzegaja,
 *   - WZMOCNIENIA, wylacznie w gore.
 *
 * Etap edukacji NIE zmienia doboru zawodow. Zmienia zakonczenie raportu.
 */

import { OBSZARY_WARSZTATOWE, WARSTWA0 } from "./config";
import type { Zawod } from "../domain/typy";
import type { EtapEdukacji, PunktStartu } from "./typy";

// =====================================================================
// FILTRY TWARDE. Tylko dwa. Reszta jest miekka.
// =====================================================================

export function filtrTwardyA0(zawod: Zawod, a0: PunktStartu | null): string | null {
  if (!a0) return null;

  // Ograniczenie zdrowotne wymienione w karcie jako wykluczajace.
  const przeciwwskazanie = zawod.przeciw.find((p) => a0.ograniczenia.includes(p));
  if (przeciwwskazanie) return `przeciwwskazanie zdrowotne: ${przeciwwskazanie}`;

  // Brak mobilnosci plus zawod wielkomiejski plus brak realnego dojazdu.
  if (zawod.duzeMiasto && a0.mobilnosc === "nie" && a0.dojazdDoMiasta === "nie") {
    return "zawód wymaga dużego miasta, przeprowadzka nie wchodzi w grę, dojazd nierealny";
  }
  return null;
}

// =====================================================================
// FILTRY MIEKKIE I WZMOCNIENIA
// =====================================================================

export interface KorektaA0 {
  mnoznik: number;
  ostrzezenia: string[];
}

export function korektaMiekkaA0(zawod: Zawod, a0: PunktStartu | null): KorektaA0 {
  const ostrzezenia: string[] = [];
  let mnoznik = 1;
  if (!a0) return { mnoznik, ostrzezenia };

  if (zawod.duzeMiasto && a0.mobilnosc === "wolalbym_nie") {
    mnoznik *= 1 - WARSTWA0.KARA_MOBILNOSC;
    ostrzezenia.push("Ten zawód istnieje głównie w dużych miastach, a wolałbyś się nie przeprowadzać.");
  }
  if (zawod.teren && (a0.miejsce === "duze_miasto" || a0.miejsce === "wielkie_miasto")) {
    // Ostrzezenie bez obnizenia.
    ostrzezenia.push("Ten zawód wykonuje się poza miastem. Mieszkasz w dużym mieście.");
  }

  // Wzmocnienia, wylacznie w gore.
  if (a0.przedmiotyMocne.includes("warsztat") && OBSZARY_WARSZTATOWE.has(zawod.obszar)) {
    mnoznik *= 1 + WARSTWA0.WZMOCNIENIE_WARSZTAT;
  }
  const maDoswiadczenie = zawod.dosw.some((d) => d !== "konkursy" && a0.doswiadczenie.includes(d));
  if (maDoswiadczenie) mnoznik *= 1 + WARSTWA0.WZMOCNIENIE_DOSWIADCZENIE;
  if (zawod.dosw.includes("konkursy") && a0.doswiadczenie.includes("konkursy")) {
    mnoznik *= 1 + WARSTWA0.WZMOCNIENIE_KONKURSY;
  }

  return { mnoznik, ostrzezenia };
}

// =====================================================================
// STEROWANIE TRESCIA REKOMENDACJI WEDLUG ETAPU EDUKACJI
// =====================================================================

const ZAKONCZENIA: Record<EtapEdukacji, { rekomendacja: string; pierwszyKrok: string }> = {
  podstawowka: {
    rekomendacja:
      "Na tym etapie najważniejszy jest wybór szkoły i rozszerzeń, nie wybór zawodu. Rozszerzenia otwierają albo zamykają całe grupy dróg, i to jest jedyna decyzja, którą podejmujesz teraz.",
    pierwszyKrok: "Wypisz, które przedmioty otwierają najwięcej Twoich dróg, i sprawdź, czy są w szkole, którą rozważasz.",
  },
  liceum_1_2: {
    rekomendacja:
      "Masz jeszcze czas na zmianę rozszerzeń i to jest teraz najważniejsza decyzja. Rozszerzenia otwierają albo zamykają całe grupy kierunków.",
    pierwszyKrok: "Sprawdź, jakich rozszerzeń wymagają trzy kierunki z Twojej listy, i porównaj z tym, co masz w planach.",
  },
  liceum_maturalna: {
    rekomendacja:
      "Na tym etapie liczą się konkretne kierunki i progi rekrutacyjne. Rozszerzenia są już wybrane, więc pytanie brzmi: co się w nie mieści.",
    pierwszyKrok: "Sprawdź progi na trzech uczelniach z Twojej listy i zapisz, czego Ci brakuje.",
  },
  branzowa: {
    rekomendacja:
      "Twoja droga prowadzi przez uprawnienia i pierwszą pracę, nie przez dyplom. Uprawnienia zdobywa się stopniowo i każde kolejne podnosi stawkę.",
    pierwszyKrok: "Wybierz jedno uprawnienie do zdobycia w tym roku i sprawdź, gdzie w Twojej okolicy prowadzą ten kurs.",
  },
  po_maturze: {
    rekomendacja:
      "Twoje pytanie brzmi: studia czy droga krótsza. Obie są otwarte i obie da się sprawdzić, zanim podejmiesz decyzję na pięć lat.",
    pierwszyKrok: "Sprawdź jedną drogę studiową i jedną krótszą: ile trwają, ile kosztują i gdzie kończą po trzech latach.",
  },
  studiuje: {
    rekomendacja:
      "Na tym etapie decyduje specjalizacja i pierwsza praca, nie zmiana kierunku. Wybór segmentu wewnątrz zawodu waży dziś więcej niż wybór zawodu.",
    pierwszyKrok: "Znajdź jedną praktykę albo staż w segmencie, który Cię interesuje, i złóż aplikację w tym miesiącu.",
  },
  po_studiach: {
    rekomendacja:
      "Twoje pytanie brzmi: wejście na rynek czy uzupełnienie kwalifikacji. Dyplom masz, więc liczy się to, co do niego dołożysz.",
    pierwszyKrok: "Wybierz jedną konkretną ofertę pracy albo jeden kurs z uprawnieniami i sprawdź, czego Ci brakuje do wymagań.",
  },
  pracuje_zmiana: {
    rekomendacja:
      "Przekwalifikowanie jest łatwiejsze, niż wygląda, jeśli oprze się na tym, co już umiesz. Szukamy drogi, która nie zaczyna się od zera.",
    pierwszyKrok: "Wypisz trzy umiejętności z obecnej pracy, które przenoszą się do wybranej drogi, i jedno uprawnienie, którego brakuje.",
  },
  nie_uczy_nie_pracuje: {
    rekomendacja:
      "Najważniejsze jest teraz jedno wejście, niekoniecznie docelowe. Zawód pierwszy nie musi być zawodem na zawsze, a bez pierwszego nie ma kolejnych.",
    pierwszyKrok: "Wybierz jedną drogę z listy krótkich wejść i sprawdź, co trzeba zrobić, żeby zacząć w ciągu trzech miesięcy.",
  },
};

export function zakonczenieWedlugEtapu(
  a0: PunktStartu | null,
): { etap: EtapEdukacji | null; rekomendacja: string; pierwszyKrok: string } | null {
  if (!a0) return null;
  const z = ZAKONCZENIA[a0.etap];
  return { etap: a0.etap, rekomendacja: z.rekomendacja, pierwszyKrok: z.pierwszyKrok };
}

// =====================================================================
// SEKCJA "TWOJ PUNKT STARTU" W RAPORCIE
//
// Zasada redakcyjna: sekcja zaczyna sie od tego, co jest OTWARTE, nigdy od
// tego, co zamkniete. Uczestnik z matematyka jako najwiekszym problemem czyta
// najpierw, ze otwiera to szeroko rzemioslo, zdrowie, opieke i prace z ludzmi,
// a dopiero potem, ze zawezA kierunki scisle.
// =====================================================================

export interface SekcjaPunktStartu {
  gdzieJestes: string;
  coCiIdzie: string[];
  coJuzRobiles: string[];
  skadStartujesz: string;
  coToOtwiera: string[];
  oCzymWartoWiedziec: string[];
}

const OPIS_ETAPU: Record<EtapEdukacji, string> = {
  podstawowka: "ostatnia klasa szkoły podstawowej",
  liceum_1_2: "liceum lub technikum, klasa pierwsza albo druga",
  liceum_maturalna: "liceum lub technikum, klasa przedmaturalna albo maturalna",
  branzowa: "szkoła branżowa",
  po_maturze: "po maturze, przerwa albo szukanie kierunku",
  studiuje: "w trakcie studiów",
  po_studiach: "po studiach",
  pracuje_zmiana: "praca i rozważanie zmiany",
  nie_uczy_nie_pracuje: "przerwa w nauce i pracy",
};

const OPIS_MIEJSCA: Record<PunktStartu["miejsce"], string> = {
  wies: "wieś",
  male_miasto: "miasto do 20 tysięcy",
  srednie_miasto: "miasto od 20 do 100 tysięcy",
  duze_miasto: "miasto od 100 do 500 tysięcy",
  wielkie_miasto: "duże miasto powyżej 500 tysięcy",
};

const OPIS_MOBILNOSCI: Record<PunktStartu["mobilnosc"], string> = {
  tak_daleko: "gotowość na przeprowadzkę, także daleko",
  tak_region: "gotowość na przeprowadzkę w granicach regionu",
  wolalbym_nie: "przeprowadzka raczej niechętnie",
  nie: "bez przeprowadzki",
};

const OPIS_DOSWIADCZENIA: Record<string, string> = {
  praca_doryw: "praca dorywcza albo wakacyjna",
  praca_stala: "praca stała",
  wolontariat: "wolontariat",
  firma_rodzinna: "pomoc w rodzinnej firmie albo gospodarstwie",
  projekty: "własne projekty, które ktoś zobaczył",
  hobby: "hobby uprawiane od kilku lat",
  prowadzenie: "prowadzenie czegoś w szkole albo w grupie",
  kursy: "kursy albo szkolenia poza szkołą",
  konkursy: "konkursy, olimpiady, zawody",
};

export function sekcjaPunktStartu(
  a0: PunktStartu | null,
  najlepszeObszary: string[],
): SekcjaPunktStartu | null {
  if (!a0) return null;

  const coToOtwiera: string[] = [];
  if (a0.przedmiotyMocne.length > 0) {
    coToOtwiera.push(
      `Radzisz sobie z: ${a0.przedmiotyMocne.join(", ")}. To podnosi Twoje szanse na kierunkach, które te przedmioty punktują.`,
    );
  }
  if (a0.doswiadczenie.length > 0 && !a0.doswiadczenie.includes("nic")) {
    coToOtwiera.push(
      "Masz już za sobą realne doświadczenie. W tym wieku to jest przewaga, której większość rówieśników nie ma, i wzmacnia część Twoich dróg.",
    );
  }
  if (a0.miejsce === "wies" || a0.miejsce === "male_miasto") {
    coToOtwiera.push(
      "Mieszkasz poza dużym miastem. Znaczna część zawodów w Twoim wyniku działa wszędzie i to jest ich niedoceniana przewaga.",
    );
  }
  if (a0.mobilnosc === "tak_daleko" || a0.mobilnosc === "tak_region") {
    coToOtwiera.push("Jesteś gotów się przeprowadzić, co otwiera kierunki dostępne w kilku ośrodkach.");
  }
  if (najlepszeObszary.length > 0) {
    coToOtwiera.push(`Twoje najmocniejsze kierunki świata pracy: ${najlepszeObszary.join(", ")}.`);
  }
  if (coToOtwiera.length === 0) {
    coToOtwiera.push("Na tym etapie masz otwarte praktycznie wszystkie drogi i to jest dobra pozycja startowa.");
  }

  const oCzymWartoWiedziec: string[] = [];
  if (a0.matematyka === "najwiekszy_problem") {
    oCzymWartoWiedziec.push(
      "Kierunki ścisłe wymagają matematyki, która jest u Ciebie największym problemem. To zawęża część kierunków, ale nie zawęża zawodów: do wielu z nich prowadzą inne drogi.",
    );
  }
  if (a0.przedmiotyTrudne.length > 0) {
    oCzymWartoWiedziec.push(
      `Przedmioty, które wskazałeś jako trudne (${a0.przedmiotyTrudne.join(", ")}), są wymagane na części kierunków. Przy każdym takim kierunku jest o tym uwaga.`,
    );
  }
  if (a0.mobilnosc === "nie" || a0.dojazdDoMiasta === "nie") {
    oCzymWartoWiedziec.push(
      "Część zawodów istnieje praktycznie tylko w największych miastach. Te, przy których to ma znaczenie, są oznaczone.",
    );
  }
  if (a0.zasoby === "nierealne" || a0.zasoby === "bardzo_trudne") {
    oCzymWartoWiedziec.push(
      "Część dróg wymaga opłacenia kursów albo sprzętu. Przy tych, gdzie bariera jest realna, jest o tym informacja wraz z tym, gdzie szukać dofinansowania.",
    );
  }
  // Odmowa odpowiedzi o zdrowiu nie zostawia zadnego sladu w raporcie.

  return {
    gdzieJestes: OPIS_ETAPU[a0.etap],
    coCiIdzie: a0.przedmiotyMocne,
    coJuzRobiles: a0.doswiadczenie.map((d) => OPIS_DOSWIADCZENIA[d] ?? d),
    skadStartujesz: `${OPIS_MIEJSCA[a0.miejsce]}, ${OPIS_MOBILNOSCI[a0.mobilnosc]}`,
    coToOtwiera,
    oCzymWartoWiedziec,
  };
}
