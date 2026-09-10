/**
 * Wyprowadzenie profilu uczestnika z wynikow modulow.
 *
 * Warstwa druga porownuje zbiory kodow. Karta ma zbior, uczestnik ma liczby.
 * Tutaj zamieniamy jedno na drugie, wedlug progow z config.ts.
 */

import { DEGRADACJA, PROGI_PROFILU } from "./config";
import { ANTYPROFIL } from "./antyprofil";
import type { WskaznikiJakosci, WynikiModulow } from "./typy";
import { A1_KARTA_NA_MODUL, A2_KARTA_NA_MODUL, A3_KARTA_NA_MODUL, A5_KARTA_NA_MODUL } from "./mapowanie";

/** Profil uczestnika w postaci zbiorow kodow kart, gotowy do porownania z karta. */
export interface ProfilKartowy {
  /** Kody A1 kart, w ktorych uczestnik jest wysoko. */
  a1: Set<string>;
  /** Kody A2 kart, ktore sa u uczestnika mocne. */
  a2: Set<string>;
  /** Kody A3 kart odpowiadajace warunkom kluczowym uczestnika. */
  a3: Set<string>;
  /** Kody A5 kart, ktore uczestnik odrzucil (NIE), ale nie zawetowal. */
  a5Odrzucone: Set<string>;
  /** Kody A5 kart objete wetem. Usuwaja zawod bezwarunkowo. */
  a5Weta: Set<string>;
  /** Kody antyprofilu, ktore u tego uczestnika trafiaja. */
  anty: Set<string>;
}

/** Zwraca n najwyzszych kluczy mapy, ktore przekraczaja prog. Deterministycznie. */
function najwyzsze(mapa: Record<number, number>, prog: number, maks: number): number[] {
  return Object.entries(mapa)
    .map(([id, v]) => ({ id: Number(id), v }))
    .filter((x) => x.v > prog)
    .sort((a, b) => b.v - a.v || a.id - b.id)
    .slice(0, maks)
    .map((x) => x.id);
}

export function wskaznikiJakosci(w: WynikiModulow): WskaznikiJakosci {
  const z = Object.values(w.z);
  const k = Object.values(w.k);
  const zroznicowanieA1 = z.length ? Math.max(...z) - Math.min(...z) : 0;
  const zroznicowanieA2 = k.length ? Math.max(...k) - Math.min(...k) : 0;
  const wskaznikZamkniecia = Object.values(w.g).filter((v) => v === 0).length;
  const wskaznikOkazji = Object.values(w.dowody).reduce((s, v) => s + v, 0);

  const profilPlaskiA1 = zroznicowanieA1 < DEGRADACJA.A1_PROFIL_PLASKI;

  return {
    zroznicowanieA1,
    zroznicowanieA2,
    wskaznikZamkniecia,
    wskaznikOkazji,
    profilPlaskiA1,
    profilPlaskiA2: zroznicowanieA2 < DEGRADACJA.A2_PROFIL_PLASKI,
    // Uczestnik odmawiajacy przy ponad dwudziestu pozycjach nie opisuje granic,
    // tylko sygnalizuje cos innego. Uruchomienie kar dalo by raport, w ktorym
    // nic nie pasuje, a to najgorszy mozliwy komunikat.
    filtryWylaczone: wskaznikZamkniecia > DEGRADACJA.A5_WSKAZNIK_ZAMKNIECIA,
    bonusWylaczony: wskaznikOkazji < DEGRADACJA.A2_WSKAZNIK_OKAZJI,
    pewnosc:
      zroznicowanieA1 >= 30 ? "wyrazny" : profilPlaskiA1 ? "jeszcze_nieuksztaltowany" : "umiarkowany",
  };
}

export function profilKartowy(w: WynikiModulow): ProfilKartowy {
  const idA1 = new Set(najwyzsze(w.z, PROGI_PROFILU.A1_PROG, PROGI_PROFILU.A1_MAKS));
  const idA2 = new Set(najwyzsze(w.k, PROGI_PROFILU.A2_PROG, PROGI_PROFILU.A2_MAKS));

  const a1 = new Set<string>();
  for (const [kod, id] of Object.entries(A1_KARTA_NA_MODUL)) if (idA1.has(id)) a1.add(kod);

  const a2 = new Set<string>();
  for (const [kod, id] of Object.entries(A2_KARTA_NA_MODUL)) if (id !== null && idA2.has(id)) a2.add(kod);

  // Warunki kluczowe A3: najsilniejsze wymiary powyzej progu sily.
  const kluczowe = Object.entries(w.a3Sila)
    .filter(([, sila]) => sila >= PROGI_PROFILU.A3_PROG_SILY)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, PROGI_PROFILU.A3_MAKS)
    .map(([wymiar]) => `${wymiar}:${(w.a3Pozycje[wymiar] ?? 50) > 50 ? "A" : "B"}`);
  const zbiorKluczowych = new Set(kluczowe);
  const a3 = new Set<string>();
  for (const [kod, cel] of Object.entries(A3_KARTA_NA_MODUL)) {
    if (cel !== null && zbiorKluczowych.has(cel)) a3.add(kod);
  }

  const a5Odrzucone = new Set<string>();
  const a5Weta = new Set<string>();
  for (const [kod, filtr] of Object.entries(A5_KARTA_NA_MODUL)) {
    if (filtr === null) continue;
    if (w.weta.includes(filtr)) a5Weta.add(kod);
    else if (w.g[filtr] === 0) a5Odrzucone.add(kod);
  }

  const anty = new Set<string>();
  for (const [kod, regula] of Object.entries(ANTYPROFIL)) {
    if (regula.aktywna && regula.sprawdz(w)) anty.add(kod);
  }

  return { a1, a2, a3, a5Odrzucone, a5Weta, anty };
}

/**
 * Docelowy poziom wejscia uczestnika. Wyprowadzany z osi INW modulu M1,
 * tak samo jak wybor poziomu w etapie 5 warstwy pierwszej.
 * INW = 100 to "szybko zarabiac", INW = 0 to "dlugo inwestowac w nauke".
 */
export function poziomDocelowy(w: WynikiModulow): string {
  const inw = w.shape["INW"];
  if (inw === null || inw === undefined) return "sredni";
  if (inw >= 75) return "szybki";
  if (inw <= 25) return "dlugi";
  return "sredni";
}
