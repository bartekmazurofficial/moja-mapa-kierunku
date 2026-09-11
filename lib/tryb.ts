/**
 * Tryb testowy.
 *
 * Włączony pokazuje na ekranie wejścia listę uczestników, żeby dało się wejść
 * bez wpisywania kodu. To jest **wyłącznie do testów**: publiczna lista
 * uczestników łamie zasadę, że nie da się wyliczyć, kto jest w programie,
 * a raport zawiera wizję życia, informacje o zdrowiu i sytuacji finansowej.
 *
 * Domyślnie wyłączony. Włącza go `TRYB_TESTOWY=1` w `.env`, którego nie ma
 * w repozytorium. Na produkcji zmiennej nie ustawiamy i ekran wejścia prosi
 * o kod, tak jak wcześniej.
 */
export function trybTestowy(): boolean {
  return process.env.TRYB_TESTOWY === "1";
}
