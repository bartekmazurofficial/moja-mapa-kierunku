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
  { nazwa: "atrament na tle", tekst: "#1c1917", tlo: "#faf8f5" },
  { nazwa: "atrament na papierze", tekst: "#1c1917", tlo: "#ffffff" },
  { nazwa: "atrament ściszony na tle", tekst: "#57534e", tlo: "#faf8f5" },
  { nazwa: "atrament słaby na tle", tekst: "#6f675e", tlo: "#faf8f5" },
  { nazwa: "atrament słaby na podkładzie", tekst: "#6f675e", tlo: "#f2eee8" },
  { nazwa: "biały na akcencie", tekst: "#ffffff", tlo: "#2f5d50" },
  { nazwa: "akcent na jasnym akcencie", tekst: "#2f5d50", tlo: "#e6efeb" },
  { nazwa: "uwaga antyprofilowa", tekst: "#8a6a1f", tlo: "#fbf4e2" },
  { nazwa: "flaga trampoliny", tekst: "#3f5a6b", tlo: "#eef3f6" },
  { nazwa: "bariera kosztowa", tekst: "#7a5230", tlo: "#f7f0e8" },
  { nazwa: "zagrożenie przyszłościowe", tekst: "#5f574d", tlo: "#f1eee9" },
];
