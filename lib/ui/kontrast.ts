/** Kontrast WCAG. Wymog programu: 4,5:1 dla kazdego tekstu, takze podpisow. */

export function luminancja(hex: string): number {
  const kanaly = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = kanaly.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function kontrast(a: string, b: string): number {
  const [x, y] = [luminancja(a), luminancja(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Pary kolorow uzywane w interfejsie uczestnika. */
export const PARY_KOLOROW: Array<{ nazwa: string; tekst: string; tlo: string }> = [
  { nazwa: "atrament na tle", tekst: "#f3efff", tlo: "#0b0718" },
  { nazwa: "atrament na panelu", tekst: "#f3efff", tlo: "#150e2e" },
  { nazwa: "atrament na szkle", tekst: "#f3efff", tlo: "#1b1338" },
  { nazwa: "atrament ściszony na tle", tekst: "#c9bcf0", tlo: "#0b0718" },
  { nazwa: "atrament ściszony na panelu", tekst: "#c9bcf0", tlo: "#150e2e" },
  { nazwa: "atrament ściszony na szkle", tekst: "#c9bcf0", tlo: "#1b1338" },
  { nazwa: "atrament słaby na tle", tekst: "#a395d4", tlo: "#0b0718" },
  { nazwa: "atrament słaby na panelu", tekst: "#a395d4", tlo: "#150e2e" },
  { nazwa: "atrament słaby na szkle", tekst: "#a395d4", tlo: "#1b1338" },
  { nazwa: "atrament słaby na mocnym szkle", tekst: "#a395d4", tlo: "#241a47" },
  { nazwa: "akcent na tle", tekst: "#b79cff", tlo: "#0b0718" },
  { nazwa: "akcent na szkle", tekst: "#b79cff", tlo: "#1b1338" },
  { nazwa: "akcent na tle akcentu", tekst: "#b79cff", tlo: "#1e1540" },
  { nazwa: "ciemny na akcencie", tekst: "#120a26", tlo: "#a78bfa" },
  { nazwa: "uwaga antyprofilowa", tekst: "#f2c96b", tlo: "#2a2010" },
  { nazwa: "uwaga na tle", tekst: "#f2c96b", tlo: "#0b0718" },
  { nazwa: "flaga trampoliny", tekst: "#7fd3ec", tlo: "#0f2530" },
  { nazwa: "bariera kosztowa", tekst: "#f0a87a", tlo: "#2c1b12" },
  { nazwa: "zagrożenie przyszłościowe", tekst: "#c3b7e0", tlo: "#1c1730" },
];
