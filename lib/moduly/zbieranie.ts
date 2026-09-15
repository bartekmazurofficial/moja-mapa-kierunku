/**
 * Zamiana zapisanych odpowiedzi na komplet wejsciowy silnika.
 *
 * To jest jedyne miejsce, w ktorym format zapisu w bazie spotyka sie
 * z formatem, ktorego oczekuje silnik.
 */

import { prisma } from "../db/klient";
import type { KompletOdpowiedzi } from "../engine/moduly";
import type { PunktStartu } from "../engine/typy";
import { MARKER_ZAKONCZENIA } from "./typy";
import { FORMULY_A4, PARY_A4 } from "../content/a4";

type Zapis = Record<string, Record<string, unknown>>;

async function wczytaj(uczestnikId: string): Promise<Record<string, Zapis>> {
  const wiersze = await prisma.odpowiedz.findMany({ where: { uczestnikId } });
  const wynik: Record<string, Zapis> = {};
  for (const w of wiersze) {
    if (w.pozycja === MARKER_ZAKONCZENIA) continue;
    wynik[w.modul] ??= {};
    wynik[w.modul][w.czesc] ??= {};
    wynik[w.modul][w.czesc][w.pozycja] = JSON.parse(w.wartosc) as unknown;
  }
  return wynik;
}

function jakoPunktStartu(a0: Zapis | undefined): PunktStartu | null {
  const o = a0?.["A"];
  if (!o || !o["etap"]) return null;
  const lista = (k: string): string[] => (Array.isArray(o[k]) ? (o[k] as string[]) : []);
  const ograniczenia = lista("ograniczenia");
  const tekst = (k: string): string | null => {
    const v = o[k];
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };
  /**
   * Rozszerzenia dla rekrutacji: bierzemy najmocniejszy dostepny sygnal.
   *
   * Matura zdana bije planowana, planowana bije rozszerzenia szkolne, a te
   * bija plan sprzed wyboru szkoly. Warstwa 3 filtruje kierunki po tym jednym
   * polu, wiec to tutaj decyduje sie, czy filtr dziala na fakcie, czy na
   * domysle (lib/engine/layer3-fields.ts, etap K2).
   */
  const rozszerzenia =
    [
      lista("matura_zdana").filter((x) => x !== "brak"),
      lista("matura_plan").filter((x) => x !== "nie_wiem"),
      lista("rozszerzenia_mam"),
      lista("rozszerzenia").filter((x) => x !== "nie_wiem"),
    ].find((l) => l.length > 0) ?? [];
  return {
    etap: o["etap"] as PunktStartu["etap"],
    rozszerzenia,
    przedmiotyMocne: lista("przedmioty_mocne"),
    przedmiotyTrudne: lista("przedmioty_trudne"),
    matematyka: (o["matematyka"] as PunktStartu["matematyka"]) ?? null,
    doswiadczenie: lista("doswiadczenie").filter((x) => x !== "nic"),
    doswiadczenieOpis: (o["doswiadczenie_opis"] as string | undefined) ?? null,
    miejsce: (o["miejsce"] as PunktStartu["miejsce"]) ?? "srednie_miasto",
    mobilnosc: (o["mobilnosc"] as PunktStartu["mobilnosc"]) ?? "wolalbym_nie",
    dojazdDoMiasta: (o["dojazd"] as PunktStartu["dojazdDoMiasta"]) ?? "godzina",
    zasoby: (o["zasoby"] as PunktStartu["zasoby"]) ?? "raty",
    // Odmowa odpowiedzi nie ma zadnych konsekwencji dla wyniku.
    ograniczenia: ograniczenia.filter((x) => x !== "brak" && x !== "nie_chce" && x !== "inne"),
    ograniczeniaPominiete: ograniczenia.includes("nie_chce"),
    kierunek: tekst("kierunek"),
    kierunekOcena: (o["kierunek_ocena"] as PunktStartu["kierunekOcena"]) ?? null,
    wyksztalcenie: (o["wyksztalcenie"] as PunktStartu["wyksztalcenie"]) ?? null,
    wyksztalcenieKierunek: tekst("wyksztalcenie_kierunek"),
    branza: lista("branza").filter((x) => x !== "nie_pracowalem"),
    stazPracy: (o["staz_pracy"] as PunktStartu["stazPracy"]) ?? null,
    powodZmiany: lista("powod_zmiany"),
    blokada: lista("blokada"),
  };
}

const PARY_A4_PO_NR = new Map(PARY_A4.map((p) => [p.nr, p]));

/**
 * Kto wygrał parę A4, z tego, co uczestnik kliknął.
 *
 * W blokach 1, 2, 3 i 5 wygrywa strona kliknięta. W bloku czwartym pytamy
 * odwrotnie („z czego prędzej byś zrezygnował"), więc kliknięta strona jest
 * wartością MNIEJ ważną i wygraną zapisuje druga strona pary.
 *
 * To jest jedyne miejsce w programie, gdzie następuje to odwrócenie. Błąd
 * tutaj daje wynik, który wygląda sensownie i jest fałszywy, więc funkcja
 * stoi osobno i ma własny test.
 */
export function wygraneA4(odpowiedziCzesciA: Record<string, unknown>): Record<number, string> {
  const wynik: Record<number, string> = {};
  for (const [klucz, wartosc] of Object.entries(odpowiedziCzesciA)) {
    if (typeof wartosc !== "string") continue;
    const nr = Number(klucz.replace("para_", ""));
    const para = PARY_A4_PO_NR.get(nr);
    if (!para) continue;
    wynik[nr] = FORMULY_A4[para.formula].odwrotna
      ? wartosc === para.lewa
        ? para.prawa
        : para.lewa
      : wartosc;
  }
  return wynik;
}

export async function zbierzOdpowiedzi(uczestnikId: string): Promise<KompletOdpowiedzi> {
  const dane = await wczytaj(uczestnikId);
  const cz = (modul: string, czesc: string): Record<string, unknown> => dane[modul]?.[czesc] ?? {};

  const a1a: Record<number, Record<string, number>> = {};
  for (const [klucz, v] of Object.entries(cz("A1", "A"))) {
    a1a[Number(klucz.replace("blok_", ""))] = v as Record<string, number>;
  }
  const a1b: Record<number, number> = {};
  const a1c: Record<number, boolean> = {};
  for (const [klucz, v] of Object.entries(cz("A1", "B"))) {
    const id = Number(klucz.replace("kotwica_", ""));
    const w = v as { skala?: number; probowal?: boolean };
    if (typeof w?.skala === "number") a1b[id] = w.skala;
    a1c[id] = Boolean(w?.probowal);
  }

  const a2a: Record<number, Record<string, number>> = {};
  for (const [klucz, v] of Object.entries(cz("A2", "A"))) {
    a2a[Number(klucz.replace("blok_", ""))] = v as Record<string, number>;
  }
  const a2b: Record<number, boolean[]> = {};
  for (const [klucz, v] of Object.entries(cz("A2", "B"))) {
    a2b[Number(klucz.replace("dowody_", ""))] = (v as boolean[]) ?? [];
  }

  const a3b: Record<string, number> = {};
  for (const [klucz, v] of Object.entries(cz("A3", "B"))) {
    a3b[klucz.replace("kotwica_", "")] = v as number;
  }

  /**
   * Blok czwarty A4 pyta odwrotnie: „z czego prędzej byś zrezygnował".
   * Kliknięta strona jest tam wartością MNIEJ ważną, więc wygraną zapisuje
   * druga strona pary. Odwrócenie stoi tutaj, w jednym miejscu, przed
   * podaniem odpowiedzi silnikowi.
   *
   * Specyfikacja każe odwracać przy zapisie do bazy. Robimy to o krok później
   * i świadomie: w bazie zostaje to, co uczestnik naprawdę kliknął, więc panel
   * prowadzącego pokazuje ten sam wybór co ekran. Odwrócone przy zapisie
   * dałoby „wybrał relacje" tam, gdzie kliknął pieniądze, i nie dałoby się
   * tego odróżnić od błędu.
   */
  const a4a = wygraneA4(cz("A4", "A"));
  const a4c = [1, 2, 3, 4]
    .map((i) => cz("A4", "C")[`koszt_${i}`] as "tak" | "nie" | "zalezy" | undefined)
    .filter((x): x is "tak" | "nie" | "zalezy" => Boolean(x));

  return {
    a0: jakoPunktStartu(dane["A0"]),
    a1: { czescA: a1a, czescB: a1b, czescC: a1c },
    a2: { czescA: a2a, czescB: a2b },
    a3: { czescA: cz("A3", "A") as Record<string, "A" | "B">, czescB: a3b },
    a4: {
      czescA: a4a,
      czescB: (cz("A4", "B")["nieodzowne"] as string[]) ?? [],
      czescC: a4c,
    },
    a5: {
      czescA: cz("A5", "A") as Record<string, "tak" | "moze" | "nie">,
      czescB: (cz("A5", "B")["weta"] as string[]) ?? [],
      czescC: (cz("A5", "C")["zdania"] as string[]) ?? [],
    },
    a6: {
      czescA: cz("A6", "A") as Record<string, "A" | "B">,
      czescB: cz("A6", "B") as Record<string, string>,
    },
    m1: {
      czescA: cz("M1", "A") as Record<string, "A" | "B">,
      czescB: Object.fromEntries(
        Object.entries(cz("M1", "B")).map(([k, v]) => [Number(k.replace(/\D/g, "")), v]),
      ),
    },
  };
}
