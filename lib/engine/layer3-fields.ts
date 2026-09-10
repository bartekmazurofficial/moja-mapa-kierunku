/**
 * WARSTWA 3: KIERUNKI STUDIOW I DROGI BEZ STUDIOW.
 *
 * Etapy K1-K6, zgodnie z 04_silniki/warstwa3_kierunki.md.
 *
 * Warstwa pochodna wobec drugiej: kierunek nie jest oceniany profilem
 * uczestnika. Jest oceniany przez to, do ktorych zawodow prowadzi i jak
 * wysoko te zawody wypadly. Uczestnik nie ma dopasowania do "zarzadzania"
 * jako takiego - ma dopasowanie do zawodow, do ktorych zarzadzanie prowadzi.
 */

import { MNOZNIK_DOSTEPU, WARSTWA3 } from "./config";
import { pasmoZawodu } from "./layer2-professions";
import type { DrogaBezStudiow, Kierunek, Zawod } from "../domain/typy";
import type {
  EtapEdukacji,
  PunktStartu,
  SensStudiow,
  WynikKierunku,
  WynikWarstwy2,
  WynikWarstwy3,
} from "./typy";

/** Etapy, na ktorych brak przedmiotu jest jeszcze informacja, a nie faktem. */
const ETAPY_PRZEDMATURALNE = new Set<EtapEdukacji>([
  "podstawowka",
  "liceum_1_2",
  "liceum_maturalna",
  "branzowa",
]);

const PRZEDMIOTY_SCISLE = new Set(["matematyka", "fizyka", "informatyka", "chemia"]);

function kierunekScisly(k: Kierunek): boolean {
  if (k.typ === "techniczny") return true;
  return k.wymagane.some((p) => PRZEDMIOTY_SCISLE.has(p));
}

export interface OpcjeWarstwy3 {
  punktStartu: PunktStartu | null;
}

export function warstwa3(
  wynik2: WynikWarstwy2,
  zawody: Zawod[],
  kierunki: Kierunek[],
  drogi: DrogaBezStudiow[],
  opcje: OpcjeWarstwy3,
): WynikWarstwy3 {
  const a0 = opcje.punktStartu;
  const wynikiZawodow = new Map(wynik2.wszystkie.map((z) => [z.kod, z.wynik]));
  const nazwyZawodow = new Map(zawody.map((z) => [z.kod, z.nazwa]));
  const usuniete: WynikWarstwy3["usuniete"] = [];
  const oceniane: WynikKierunku[] = [];

  for (const k of kierunki) {
    // --- ETAP K1: WYNIK POCHODNY ---
    // Zawod usuniety w warstwie drugiej (weto, przeciwwskazanie) liczy sie
    // jako zero, ale zostaje w mianowniku. Kierunek prowadzacy glownie do
    // zawodow, ktorych uczestnik nie chce, ma z tego powodu spasc.
    const licznik =
      k.bezposrednie.reduce((s, kod) => s + (wynikiZawodow.get(kod) ?? 0), 0) +
      WARSTWA3.WAGA_POSREDNICH * k.posrednie.reduce((s, kod) => s + (wynikiZawodow.get(kod) ?? 0), 0);
    const mianownik = k.bezposrednie.length + WARSTWA3.WAGA_POSREDNICH * k.posrednie.length;
    if (mianownik === 0) continue;
    let wynik = licznik / mianownik;
    /** Test K-1: kierunek nigdy nie wychodzi wyzej niz najlepszy zawod, do ktorego prowadzi. */
    const sufitZawodowy = Math.max(
      0,
      ...[...k.bezposrednie, ...k.posrednie].map((kod) => wynikiZawodow.get(kod) ?? 0),
    );

    const ostrzezenia: string[] = [];

    // --- ETAP K2: FILTR REKRUTACYJNY ---
    let sytuacjaRekrutacyjna = "Rekrutacja bez przedmiotów obowiązkowych.";
    if (k.wymagane.length > 0) {
      const znaneRozszerzenia = (a0?.rozszerzenia.length ?? 0) > 0;
      const brakujace = znaneRozszerzenia
        ? k.wymagane.filter((p) => !a0!.rozszerzenia.includes(p))
        : [];
      const przedMatura = a0 === null || ETAPY_PRZEDMATURALNE.has(a0.etap);

      if (brakujace.length > 0 && !przedMatura) {
        usuniete.push({
          kod: k.kod,
          nazwa: k.nazwa,
          powod: `wymaga przedmiotów, których nie masz po maturze: ${brakujace.join(", ")}`,
        });
        continue;
      }
      if (brakujace.length > 0) {
        ostrzezenia.push(
          `Ten kierunek wymaga rozszerzeń: ${brakujace.join(", ")}. Nie masz ich w planach. Jeszcze można to zmienić.`,
        );
        sytuacjaRekrutacyjna = `Brakuje Ci rozszerzeń: ${brakujace.join(", ")}.`;
      } else if (znaneRozszerzenia) {
        sytuacjaRekrutacyjna = "Masz wymagane rozszerzenia.";
      } else {
        sytuacjaRekrutacyjna = `Wymagane rozszerzenia: ${k.wymagane.join(", ")}.`;
      }
    }

    const trudneWymagane = a0 ? k.wymagane.filter((p) => a0.przedmiotyTrudne.includes(p)) : [];
    if (trudneWymagane.length > 0) {
      wynik *= 1 - WARSTWA3.KARA_PRZEDMIOT_TRUDNY;
      ostrzezenia.push(
        `Wskazałeś jako trudne: ${trudneWymagane.join(", ")}. To jest tu przedmiot wymagany.`,
      );
    }
    if (a0?.matematyka === "najwiekszy_problem" && kierunekScisly(k)) {
      wynik *= 1 - WARSTWA3.KARA_MATEMATYKA;
      ostrzezenia.push(
        "To kierunek ścisły, a matematyka jest u Ciebie największym problemem. Zobacz drogi alternatywne obok.",
      );
    }
    const mocneWymagane = a0
      ? [...k.wymagane, ...k.punktowane].filter((p) => a0.przedmiotyMocne.includes(p))
      : [];
    if (mocneWymagane.length > 0) {
      // Wzmocnienie, wylacznie w gore.
      wynik *= 1 + WARSTWA3.WZMOCNIENIE_PRZEDMIOT_MOCNY;
    }

    // --- ETAP K3: MNOZNIK DOSTEPU. Nie karzemy nikogo za ambicje. ---
    const tabela = MNOZNIK_DOSTEPU[k.trudnosc] ?? { mocne: 1, trudne: 1 };
    wynik *= trudneWymagane.length > 0 ? tabela.trudne : tabela.mocne;

    // --- ETAP K4: FILTR GEOGRAFICZNY ---
    if (a0) {
      if (k.gdzie === "jeden_dwa" && a0.mobilnosc === "nie") {
        usuniete.push({
          kod: k.kod,
          nazwa: k.nazwa,
          powod: "kierunek jest w jednym lub dwóch ośrodkach, a przeprowadzka nie wchodzi w grę",
        });
        continue;
      }
      if (k.gdzie === "duze_miasta" && a0.mobilnosc === "wolalbym_nie") {
        wynik *= 1 - WARSTWA3.KARA_GEOGRAFICZNA;
        ostrzezenia.push("Ten kierunek jest tylko w dużych miastach, a wolałbyś się nie przeprowadzać.");
      }
    }

    // --- ETAP K6: OSTRZEZENIA. Dopinane, nie zmieniaja pozycji. ---
    if (k.odsetek !== null && k.odsetek < WARSTWA3.PROG_OSTRZEZENIA_O_ODSETKU) {
      ostrzezenia.push(
        `Mniej niż ${k.odsetek}% absolwentów tego kierunku pracuje w zawodzie. To nie znaczy, że studia są bezwartościowe, ale warto wiedzieć, po co się na nie idzie.`,
      );
    }
    const prowadziDoZagrozonych = k.bezposrednie.some((kod) =>
      wynik2.wszystkie.find((z) => z.kod === kod)?.flagi.zagrozony,
    );
    if (prowadziDoZagrozonych) {
      ostrzezenia.push(
        "Zawody, do których ten kierunek prowadzi wprost, zmieniają się szybko. Sprawdź sekcje o przyszłości w kartach.",
      );
    }
    const krotszaDroga = drogi.find((d) => d.zawody.some((z) => k.bezposrednie.includes(z)));
    if (krotszaDroga) {
      ostrzezenia.push(`Do tych zawodów prowadzi też droga krótsza. Zobacz: ${krotszaDroga.nazwa}.`);
    }

    wynik = Math.min(wynik, sufitZawodowy);

    oceniane.push({
      kod: k.kod,
      nazwa: k.nazwa,
      wynik: Number(wynik.toFixed(1)),
      pasmo: pasmoZawodu(wynik).kod,
      prowadziDo: k.bezposrednie.map((kod) => nazwyZawodow.get(kod) ?? kod),
      trudnosc: k.trudnosc,
      wymagane: k.wymagane,
      punktowane: k.punktowane,
      sytuacjaRekrutacyjna,
      coSieRobi: k.robi,
      czegoNieDaje: k.nieDaje,
      ostrzezenia,
      odsetek: k.odsetek,
      lata: k.lata,
    });
  }

  oceniane.sort((a, b) => b.wynik - a.wynik || a.kod.localeCompare(b.kod));

  // --- ETAP K5: PYTANIE O SENS STUDIOW. Osobne wyjscie, nie ranking. ---
  const top = wynik2.wszystkie.slice(0, WARSTWA3.TOP_DO_PYTANIA_O_STUDIA);
  const zeStudiami = top.filter((z) => z.studia === "tak").length;
  const udzial = top.length > 0 ? zeStudiami / WARSTWA3.TOP_DO_PYTANIA_O_STUDIA : 0;
  const { sens, komunikat } = komunikatOSensieStudiow(udzial);

  // Lista drog bez studiow pojawia sie w KAZDYM raporcie, niezaleznie od profilu.
  const kodyZawodowWCzolowce = new Set(top.map((z) => z.kod));
  let pasujaceDrogi = drogi.filter((d) => d.zawody.some((z) => kodyZawodowWCzolowce.has(z)));
  if (pasujaceDrogi.length === 0) {
    // Nigdy pusto. Program, ktory pokazuje drogi bez studiow tylko tym, ktorzy
    // nie rokuja na studia, powielalby to, co model programu ma naprawiac.
    const najlepsze = [...wynik2.wszystkie].sort((a, b) => b.wynik - a.wynik).slice(0, 30);
    const kody = new Set(najlepsze.map((z) => z.kod));
    pasujaceDrogi = drogi.filter((d) => d.zawody.some((z) => kody.has(z))).slice(0, 5);
  }
  if (pasujaceDrogi.length === 0) pasujaceDrogi = drogi.slice(0, 5);

  const punktacjaDrogi = (d: DrogaBezStudiow): number =>
    Math.max(0, ...d.zawody.map((z) => wynikiZawodow.get(z) ?? 0));
  pasujaceDrogi = [...pasujaceDrogi].sort((a, b) => punktacjaDrogi(b) - punktacjaDrogi(a));

  return {
    sensStudiow: sens,
    komunikatOSensie: komunikat,
    udzialZawodowZeStudiami: Number(udzial.toFixed(2)),
    kierunki: oceniane,
    drogiBezStudiow: pasujaceDrogi.map((d) => ({
      kod: d.kod,
      nazwa: d.nazwa,
      typ: d.typ,
      czas: d.czas,
      koszt: d.koszt,
      prowadziDo: d.zawody.map((z) => nazwyZawodow.get(z) ?? z),
      wymagania: d.wymagania,
    })),
    // Kolejnosc w raporcie odzwierciedla to, co dla uczestnika realne,
    // a nie hierarchie prestizu.
    drogiBezStudiowPierwsze: udzial < WARSTWA3.PROG_ODWROCENIA_KOLEJNOSCI,
    usuniete,
  };
}

export function komunikatOSensieStudiow(udzial: number): {
  sens: SensStudiow;
  komunikat: string;
} {
  const p = WARSTWA3.PROGI_SENSU_STUDIOW;
  if (udzial > p.warunek) {
    return {
      sens: "warunek",
      komunikat:
        "W Twoim przypadku studia są warunkiem. Większość dróg, które do Ciebie pasują, jest zamknięta bez dyplomu.",
    };
  }
  if (udzial >= p.czesc_drog) {
    return {
      sens: "czesc_drog",
      komunikat:
        "Studia otwierają część Twoich dróg, ale nie wszystkie. Masz realny wybór i warto go zrobić świadomie.",
    };
  }
  if (udzial >= p.jedna_z_opcji) {
    return {
      sens: "jedna_z_opcji",
      komunikat:
        "Studia są w Twoim przypadku jedną z opcji, nie regułą. Większość dróg, które do Ciebie pasują, prowadzi inaczej.",
    };
  }
  return {
    sens: "niepotrzebne",
    komunikat:
      "Większość dróg, które do Ciebie pasują, nie wymaga studiów. To nie jest gorsza wiadomość, tylko inna. Elektryk z własną działalnością po sześciu latach zarabia zwykle więcej niż absolwent studiów humanistycznych po sześciu latach pracy. Studia zawsze możesz zrobić później i wielu ludzi tak robi. Odwrotnej kolejności nie da się nadrobić tak łatwo.",
  };
}

/** Stały blok, obowiązkowy w każdym raporcie. */
export const KIERUNEK_TO_NIE_ZAWOD =
  "Kierunek studiów nie jest tym samym co zawód. Jedna ścieżka zawodowa ma zwykle kilka dróg dojścia, a jeden kierunek prowadzi do kilkunastu różnych zawodów. Wybierając kierunek, nie wybierasz zawodu. Wybierasz zestaw drzwi, które będziesz mógł otworzyć.";
