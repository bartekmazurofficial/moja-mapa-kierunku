/**
 * Kolory kategorii.
 *
 * Bloki odpowiedzi niosą kolor, a kolor jest przypisany **kategorii na stałe**:
 * ten sam obszar wygląda tak samo w zestawie, w raporcie i na planszy wyników.
 *
 * Dlaczego sześć kolorów, skoro w zestawie są cztery pozycje. Bo cztery nie
 * wystarczą. Zestawy A1 biorą po jednej pozycji z czterech różnych rodzin
 * RIASEC, przez co graf „te dwa obszary kiedyś stanęły obok siebie” ma stopień
 * szesnaście i **nie da się go pokolorować czterema kolorami** (sprawdzone
 * przeszukiwaniem z nawrotami: 4 nie, 5 nie, 6 tak). Przy czterech kolorach
 * w części zestawów dwa kafle miałyby ten sam, a tego właśnie mieliśmy unikać.
 *
 * Cztery główne to niebieski, żółty, czerwony i zielony. Turkus i fiolet
 * dochodzą jako piąty i szósty; razem pokrywają 24 obszary i 30 kompetencji
 * tak, że w żadnym z 36 zestawów A1 ani 45 zestawów A2 nie ma powtórki.
 */

export type KodKoloru = "niebieski" | "zolty" | "czerwony" | "zielony" | "turkus" | "fiolet";

export interface Kolor {
  kod: KodKoloru;
  /** Pełna moc: wypełnienie, obwódka, poświata. */
  neon: string;
  /** Bardzo jasne tło bloku. */
  tlo: string;
  /** Krawędź bloku. */
  obwod: string;
  /** Tekst na tle bloku. Każda para ma co najmniej 4,5:1. */
  atrament: string;
}

export const KOLORY: Record<KodKoloru, Kolor> = {
  niebieski: { kod: "niebieski", neon: "#1d5bff", tlo: "#e9f0ff", obwod: "#9cbcff", atrament: "#0a3ac9" },
  zolty: { kod: "zolty", neon: "#ffc400", tlo: "#fff6dc", obwod: "#f0cf6a", atrament: "#8a5a00" },
  czerwony: { kod: "czerwony", neon: "#ff2d55", tlo: "#ffe9ee", obwod: "#ffa9bc", atrament: "#c00030" },
  zielony: { kod: "zielony", neon: "#00c56a", tlo: "#e3faed", obwod: "#8fe3b8", atrament: "#067a45" },
  turkus: { kod: "turkus", neon: "#00c2d8", tlo: "#e2f8fb", obwod: "#86dbe6", atrament: "#056b78" },
  fiolet: { kod: "fiolet", neon: "#8b5cf6", tlo: "#f2ecff", obwod: "#c3a9f7", atrament: "#5b21b6" },
};

export const KOLEJNOSC_KOLOROW: KodKoloru[] = [
  "niebieski",
  "zolty",
  "czerwony",
  "zielony",
  "turkus",
  "fiolet",
];

/**
 * A1: 24 obszary w sześciu grupach po cztery. Podział wyszedł z kolorowania
 * grafu współwystępowania, przypisanie kolorów do grup jest znaczeniowe.
 */
const A1: Record<number, KodKoloru> = {
  1: "zielony", 2: "zielony", 3: "zielony", 4: "zielony",
  5: "niebieski", 6: "niebieski", 7: "niebieski", 8: "niebieski",
  9: "fiolet", 10: "fiolet", 11: "fiolet", 12: "fiolet",
  13: "zolty", 14: "zolty", 15: "zolty", 16: "zolty",
  17: "czerwony", 18: "czerwony", 19: "czerwony", 20: "czerwony",
  21: "turkus", 22: "turkus", 23: "turkus", 24: "turkus",
};

/** A2: 30 kompetencji w sześciu grupach po pięć. */
const A2: Record<number, KodKoloru> = {
  1: "niebieski", 2: "niebieski", 3: "niebieski", 4: "niebieski", 5: "niebieski",
  6: "fiolet", 7: "fiolet", 8: "fiolet", 9: "fiolet", 10: "fiolet",
  11: "zolty", 12: "zolty", 13: "zolty", 14: "zolty", 15: "zolty",
  16: "turkus", 17: "turkus", 18: "turkus", 19: "turkus", 20: "turkus",
  21: "czerwony", 22: "czerwony", 23: "czerwony", 24: "czerwony", 25: "czerwony",
  26: "zielony", 27: "zielony", 28: "zielony", 29: "zielony", 30: "zielony",
};

/** Stabilny skrót klucza. Ten sam klucz zawsze daje ten sam kolor. */
function skrot(klucz: string): number {
  let suma = 0;
  for (let i = 0; i < klucz.length; i++) suma = (suma * 31 + klucz.charCodeAt(i)) >>> 0;
  return suma;
}

/**
 * Kolor kategorii po jej kluczu (`a1-7`, `a2-13`, `a3-INI`, `a4-PIE`…).
 * A1 i A2 mają mapy ułożone tak, żeby w zestawie nie było powtórki; pozostałe
 * moduły pokazują jedną kategorię na ekran, więc wystarczy stały skrót.
 */
export function kolorKategorii(klucz: string): Kolor {
  const [modul, reszta] = [klucz.slice(0, klucz.indexOf("-")), klucz.slice(klucz.indexOf("-") + 1)];
  if (modul === "a1") {
    const k = A1[Number(reszta)];
    if (k) return KOLORY[k];
  }
  if (modul === "a2") {
    const k = A2[Number(reszta)];
    if (k) return KOLORY[k];
  }
  return KOLORY[KOLEJNOSC_KOLOROW[skrot(klucz) % KOLEJNOSC_KOLOROW.length]];
}

/**
 * Kolor części programu. W obrębie jednego spotkania kolory są różne, bo
 * części tego spotkania stoją obok siebie w jednym szeregu.
 */
export const KOLORY_MODULOW: Record<string, Kolor> = {
  A0: KOLORY.turkus,
  A1: KOLORY.zielony,
  A3: KOLORY.fiolet,
  A2: KOLORY.niebieski,
  A4: KOLORY.zolty,
  M1: KOLORY.czerwony,
  A5: KOLORY.turkus,
};

/**
 * Dwa różne kolory dla ekranu z parą do wyboru.
 *
 * Para to dwie strony, nie jedna kategoria. Gdyby obie karty miały ten sam
 * kolor, kolor nie pomagałby ich rozróżnić, a po to tu jest. Drugi kolor jest
 * zawsze o trzy pozycje dalej w kole, więc nigdy nie wypadnie taki sam.
 */
export function paraKolorow(klucz: string): [Kolor, Kolor] {
  const i = skrot(klucz) % KOLEJNOSC_KOLOROW.length;
  const j = (i + 3) % KOLEJNOSC_KOLOROW.length;
  return [KOLORY[KOLEJNOSC_KOLOROW[i]], KOLORY[KOLEJNOSC_KOLOROW[j]]];
}
