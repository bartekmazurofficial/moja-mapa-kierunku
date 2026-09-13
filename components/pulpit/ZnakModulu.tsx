/**
 * Znak części programu.
 *
 * Siedem rysowanych glifów, po jednym na moduł, żeby kafelek podróży dało się
 * rozpoznać z odległości, a nie tylko przeczytać. Czysta ozdoba: obok zawsze
 * stoi pełna nazwa części, więc czytnik ekranu niczego nie traci.
 */

const ZNAKI: Record<string, string[]> = {
  // Punkt startu: człowiek na początku drogi.
  A0: ["M12 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z", "M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"],
  // Co mnie ciągnie: igła kompasu.
  A1: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "m15 9-2.2 4.8L8 16l2.2-4.8L15 9Z"],
  // W czym mogę być dobry: rosnące słupki.
  A2: ["M5 20V11", "M12 20V5", "M19 20v-6"],
  // Jak naturalnie działam: dwie osoby obok siebie.
  A3: ["M9 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z", "M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6", "M16 4.2a2.5 2.5 0 0 1 0 4.6", "M17.5 14.4c2.1.8 3.5 2.8 3.5 5.1"],
  // Co jest dla mnie ważne: serce.
  A4: ["M12 20S4 14.6 4 9.4A4.4 4.4 0 0 1 12 6.8 4.4 4.4 0 0 1 20 9.4C20 14.6 12 20 12 20Z"],
  // Moja wizja życia: szczyt z chorągiewką.
  M1: ["M3 19h18", "m7 19 6.5-12L20 19", "M13.5 7V3l3.5 1.4-3.5 1.4"],
  // Filtry rzeczywistości: suwaki.
  A5: ["M4 7h16", "M4 12h16", "M4 17h16", "M9 5v4", "M15 10v4", "M7 15v4"],
};

export function ZnakModulu({ modul, rozmiar = 26 }: { modul: string; rozmiar?: number }) {
  const sciezki = ZNAKI[modul];
  if (!sciezki) return null;
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={rozmiar}
      height={rozmiar}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {sciezki.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
