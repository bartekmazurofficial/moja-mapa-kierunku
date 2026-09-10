/**
 * Komunikaty do flag silnika. Jedno zrodlo tekstu dla raportu i dla panelu.
 *
 * Zasady jezyka z raport_struktura.md rozdzial 5: nigdy nie orzekaj, nigdy nie
 * oceniaj slabszych stron, nigdy nie zamykaj, nigdy nie sugeruj precyzji,
 * nigdy nie porownuj.
 */

export const KOMUNIKATY_FLAG: Record<string, string> = {
  ten_sam_swiat_a_b:
    "Twoje dwie najmocniejsze drogi to w gruncie rzeczy ten sam świat. Różnią się drzwiami, nie kierunkiem.",
  droga_b_slabsza_od_a: "Jedna droga wyszła wyraźnie mocniej niż pozostałe.",
  droga_c_jako_inny_poziom:
    "Trzecia droga to ten sam świat, do którego wchodzi się innymi drzwiami. Przy Twoim profilu to uczciwsze niż doklejanie obszaru, który do Ciebie nie pasuje.",
  trzy_drogi_z_jednego_swiata:
    "Twoje trzy drogi są sobie bliższe niż zwykle. To znaczy, że Twój profil jest wyraźny i konsekwentny, a nie że zabrakło alternatyw. Osoby o takim profilu zwykle nie potrzebują szukać daleko.",
  nawet_alternatywa_blisko:
    "Nawet najbardziej odmienna z Twoich dróg leży blisko dwóch pozostałych. Twój profil jest wąski i wyraźny.",
  profil_nieostry:
    "Twoje zainteresowania nie są jeszcze wyraźnie ukształtowane, i to zupełnie normalne w Twoim wieku. Zamiast rankingu pokazujemy Ci ogólny kierunek i rzeczy, które warto wypróbować.",
  wszystkie_obszary_ponizej_progu:
    "Twój profil jest na tym etapie jeszcze nieostry. To nie znaczy, że nic do Ciebie nie pasuje — znaczy, że warto sprawdzić kilka rzeczy w praktyce.",
};

/** Flagi widoczne wylacznie dla prowadzacego. Uczestnik ich nie dostaje. */
export const FLAGI_TYLKO_DLA_PROWADZACEGO = new Set([
  "weta_usunely_ponad_polowe",
]);

export const KOMUNIKATY_DLA_PROWADZACEGO: Record<string, string> = {
  weta_usunely_ponad_polowe:
    "Weta uczestnika usunęły ponad połowę obszarów. Sprawdź na sesji, czy wszystkie trzy są równie twarde.",
};

export function komunikatFlagi(flaga: string): string | null {
  if (FLAGI_TYLKO_DLA_PROWADZACEGO.has(flaga)) return null;
  return KOMUNIKATY_FLAG[flaga] ?? null;
}
