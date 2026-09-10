/**
 * SQLite nie ma typu tablicowego ani JSON-owego, wiec pola listowe i mapy
 * trzymamy jako String z JSON-em. Te trzy funkcje sa jedynym miejscem,
 * w ktorym o tym pamietamy. Przy przejsciu na PostgreSQL znikaja.
 */

export function zapiszJson(wartosc: unknown): string {
  return JSON.stringify(wartosc);
}

export function czytajListe(pole: string): string[] {
  const v = JSON.parse(pole) as unknown;
  if (!Array.isArray(v)) throw new Error(`oczekiwano listy, jest ${typeof v}`);
  return v as string[];
}

export function czytajMape<T = number>(pole: string): Record<string, T> {
  const v = JSON.parse(pole) as unknown;
  if (typeof v !== "object" || v === null || Array.isArray(v)) {
    throw new Error("oczekiwano obiektu");
  }
  return v as Record<string, T>;
}

export function czytajObiekt<T>(pole: string): T {
  return JSON.parse(pole) as T;
}
