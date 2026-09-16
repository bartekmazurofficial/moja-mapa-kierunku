/**
 * Zapis kwoty po polsku: „3 500 zł".
 *
 * Osobny plik, a nie eksport z komponentu panelu, bo tej samej funkcji uzywa
 * panel (komponent klienta) i raport (komponent serwera). Eksport z pliku
 * „use client" wywoluje na serwerze blad o wolaniu funkcji klienta.
 *
 * Separator tysiecy zamieniamy na zwykla spacje celowo: spacja niełamiąca
 * z `toLocaleString` w niektorych krojach rysuje sie szerzej niz zwykla
 * i kwota w tabeli wyglada, jakby miala dodatkowy odstep.
 */
export function zl(kwota: number): string {
  return `${Math.round(kwota).toLocaleString("pl-PL").replace(/ /g, " ")} zł`;
}
