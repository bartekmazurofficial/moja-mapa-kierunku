/**
 * RANKING ZAWODOW Z DWOCH TOROW.
 *
 *     DOPASOWANIE = 55% zgodnosci z „LUBIE" + 45% zgodnosci z „UMIEM"
 *
 * Umiejetnosci waza mniej i to jest decyzja o grupie docelowej, nie
 * o metodzie: osoba w wieku 16-24 lat mogla jeszcze nie miec okazji rozwinac
 * wielu kompetencji. Brak dzisiejszej umiejetnosci nie znaczy braku
 * potencjalu, a brak checi znaczy brak checi.
 *
 * **Zainteresowania nie wchodza do tej matematyki w ogole.** Sprzedaz jest
 * sprzedaza i w motoryzacji, i w medycynie. To, ze ktos lubi samochody, nie
 * czyni go lepszym sprzedawca i nie wolno mu za to podnosic wyniku. Wchodza
 * dopiero pozniej, jako warstwa branzowa przy zawodach, ktore juz sa wysoko.
 *
 * Wymuszona roznorodnosc przy wyborze osmiu jest najwazniejszym krokiem
 * w calym pliku. Bez niej uczestnik dostaje osiem wariantow tego samego
 * zawodu, bo osiem najwyzszych wynikow prawie zawsze siedzi w jednej
 * kategorii czynnosci.
 */

import { BANK_CZYNNOSCI, CZYNNOSC_PO_ID, type KategoriaCzynnosci } from "../content/bank-czynnosci";
import { wagiZawodu, zgodnosc } from "./mostek";
import type { Zawod } from "../domain/typy";

export const WAGA_LUBIE = 0.55;
export const WAGA_UMIEM = 0.45;

/** Ile zawodow trafia do raportu. */
export const DO_RAPORTU = { min: 8, max: 10 } as const;

export interface DopasowanieZawodu {
  kod: string;
  nazwa: string;
  obszar: number;
  /** 0-100. Nigdy nie pokazywane uczestnikowi. */
  dopasowanie: number;
  zgodnoscLubie: number;
  zgodnoscUmiem: number;
  /** Kategoria czynnosci, ktora w tym zawodzie waży najwiecej. */
  kategoriaWiodaca: KategoriaCzynnosci;
  bezStudiow: boolean;
  /** Czynnosci zawodu, od najwazniejszej. Sekcja „co sie w tej pracy robi". */
  czynnosci: Array<{ czynnosc: number; nazwa: string; waga: number }>;
  /** Czynnosci z TOP 5 uczestnika, ktore w tym zawodzie cos znacza. */
  trafienia: string[];
}

/**
 * Kategoria, ktora w tym zawodzie wazy najwiecej.
 *
 * Potrzebna wylacznie do wymuszania roznorodnosci: bez niej osiem kart
 * wychodzi z jednej rodziny. Uczestnik tej etykiety nie widzi.
 */
function kategoriaWiodaca(wagi: Array<{ czynnosc: number; waga: number }>): KategoriaCzynnosci {
  const suma = new Map<KategoriaCzynnosci, number>();
  for (const { czynnosc, waga } of wagi) {
    const k = CZYNNOSC_PO_ID.get(czynnosc)?.kategoria;
    if (k) suma.set(k, (suma.get(k) ?? 0) + waga);
  }
  let najlepsza: KategoriaCzynnosci = "Analiza";
  let max = -1;
  for (const [k, v] of suma) {
    if (v > max) {
      max = v;
      najlepsza = k;
    }
  }
  return najlepsza;
}

export function policzDopasowania(
  silaLubie: Record<number, number>,
  silaUmiem: Record<number, number>,
  zawody: Zawod[],
): DopasowanieZawodu[] {
  const top5Lubie = new Set(
    BANK_CZYNNOSCI.filter((c) => (silaLubie[c.id] ?? 0) >= 60).map((c) => c.id),
  );

  return zawody
    .map((z) => {
      const wagi = wagiZawodu(z);
      const l = zgodnosc(silaLubie, wagi);
      const u = zgodnosc(silaUmiem, wagi);
      return {
        kod: z.kod,
        nazwa: z.nazwaWyswietlana,
        obszar: z.obszar,
        dopasowanie: WAGA_LUBIE * l + WAGA_UMIEM * u,
        zgodnoscLubie: l,
        zgodnoscUmiem: u,
        kategoriaWiodaca: kategoriaWiodaca(wagi),
        bezStudiow: z.studia === "nie",
        czynnosci: wagi.map((w) => ({
          czynnosc: w.czynnosc,
          nazwa: CZYNNOSC_PO_ID.get(w.czynnosc)?.nazwa ?? String(w.czynnosc),
          waga: w.waga,
        })),
        trafienia: wagi
          .filter((w) => top5Lubie.has(w.czynnosc))
          .slice(0, 4)
          .map((w) => CZYNNOSC_PO_ID.get(w.czynnosc)?.nazwa ?? String(w.czynnosc)),
      };
    })
    .sort((a, b) => b.dopasowanie - a.dopasowanie || a.kod.localeCompare(b.kod));
}

/**
 * Wybor osmiu do dziesieciu z wymuszona roznorodnoscia.
 *
 * Kwoty bierzemy w kolejnosci trudnosci spelnienia: najpierw drogi bez
 * studiow, bo tych bywa malo wysoko w rankingu i to jest zasada programu,
 * potem limit trzech zawodow z jednej kategorii. Reszte dobieramy po wyniku.
 *
 * Limit trzech na kategorie jest tym, co odroznia to narzedzie od
 * wyszukiwarki: wyszukiwarka pokazalaby osiem odmian tej samej roboty.
 */
export const MIN_BEZ_STUDIOW = 3;
export const MAX_Z_KATEGORII = 3;

export function wybierzDoRaportu(ranking: DopasowanieZawodu[]): DopasowanieZawodu[] {
  // Pula kandydatow jest szeroka celowo. Przy dwudziestu najlepszych limit
  // trzech na kategorie potrafil zdusic liste ponizej osmiu i wtedy trzeba
  // bylo ten limit zlamac. Przy calym rankingu zawsze znajdzie sie osmy zawod
  // z innej kategorii, wiec roznorodnosc zostaje, a lista ma pelna dlugosc.
  const kandydaci = ranking;
  const wybrani: DopasowanieZawodu[] = [];
  const wKategorii = new Map<KategoriaCzynnosci, number>();

  const mozna = (z: DopasowanieZawodu) =>
    (wKategorii.get(z.kategoriaWiodaca) ?? 0) < MAX_Z_KATEGORII &&
    !wybrani.some((w) => w.kod === z.kod);

  const dodaj = (z: DopasowanieZawodu) => {
    wybrani.push(z);
    wKategorii.set(z.kategoriaWiodaca, (wKategorii.get(z.kategoriaWiodaca) ?? 0) + 1);
  };

  // Kwota pierwsza: drogi bez studiow. Zawsze co najmniej trzy.
  for (const z of kandydaci) {
    if (wybrani.filter((w) => w.bezStudiow).length >= MIN_BEZ_STUDIOW) break;
    if (z.bezStudiow && mozna(z)) dodaj(z);
  }

  // Reszta po wyniku, z limitem na kategorie.
  for (const z of kandydaci) {
    if (wybrani.length >= DO_RAPORTU.max) break;
    if (mozna(z)) dodaj(z);
  }

  // Ostatnia deska: gdyby baza byla tak waska, ze limity nie pozwalaja zebrac
  // osmiu, dobieramy bez limitu kategorii. Lepiej osiem podobnych niz szesc,
  // bo „nic nie pasuje" nie jest wynikiem, ktory ten program dopuszcza.
  // Przy obecnej bazie ta petla nie ma prawa sie uruchomic.
  for (const z of kandydaci) {
    if (wybrani.length >= DO_RAPORTU.min) break;
    if (!wybrani.some((w) => w.kod === z.kod)) dodaj(z);
  }

  return wybrani.sort((a, b) => b.dopasowanie - a.dopasowanie);
}
