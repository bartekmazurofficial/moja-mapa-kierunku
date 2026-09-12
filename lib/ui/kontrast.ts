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
  { nazwa: "atrament na tle", tekst: "#10132a", tlo: "#f4f6fb" },
  { nazwa: "atrament na panelu", tekst: "#10132a", tlo: "#ffffff" },
  { nazwa: "atrament ściszony na tle", tekst: "#3d4460", tlo: "#f4f6fb" },
  { nazwa: "atrament ściszony na panelu", tekst: "#3d4460", tlo: "#ffffff" },
  { nazwa: "atrament słaby na tle", tekst: "#5b6480", tlo: "#f4f6fb" },
  { nazwa: "atrament słaby na panelu", tekst: "#5b6480", tlo: "#ffffff" },
  { nazwa: "akcent na tle", tekst: "#0a3ac9", tlo: "#f4f6fb" },
  { nazwa: "akcent na panelu", tekst: "#0a3ac9", tlo: "#ffffff" },
  { nazwa: "akcent na tle akcentu", tekst: "#0a3ac9", tlo: "#e9f0ff" },
  { nazwa: "biały na akcencie", tekst: "#ffffff", tlo: "#1d5bff" },
  { nazwa: "uwaga antyprofilowa", tekst: "#a15c00", tlo: "#fff4dc" },
  { nazwa: "uwaga na tle", tekst: "#a15c00", tlo: "#f4f6fb" },
  { nazwa: "flaga trampoliny", tekst: "#05607a", tlo: "#e2f6fc" },
  { nazwa: "bariera kosztowa", tekst: "#a03b12", tlo: "#ffeee6" },
  { nazwa: "zagrożenie przyszłościowe", tekst: "#4a4a6a", tlo: "#f0eefa" },

  // Sześć kolorów kategorii: tekst bloku na tle bloku.
  { nazwa: "blok niebieski", tekst: "#0a3ac9", tlo: "#e9f0ff" },
  { nazwa: "blok żółty", tekst: "#8a5a00", tlo: "#fff6dc" },
  { nazwa: "blok czerwony", tekst: "#c00030", tlo: "#ffe9ee" },
  { nazwa: "blok zielony", tekst: "#067a45", tlo: "#e3faed" },
  { nazwa: "blok turkusowy", tekst: "#056b78", tlo: "#e2f8fb" },
  { nazwa: "blok fioletowy", tekst: "#5b21b6", tlo: "#f2ecff" },

  // Atrament na tle bloku: odpowiedź stoi zawsze na kolorowym tle.
  { nazwa: "atrament na bloku niebieskim", tekst: "#10132a", tlo: "#e9f0ff" },
  { nazwa: "atrament na bloku żółtym", tekst: "#10132a", tlo: "#fff6dc" },
  { nazwa: "atrament na bloku czerwonym", tekst: "#10132a", tlo: "#ffe9ee" },
  { nazwa: "atrament na bloku zielonym", tekst: "#10132a", tlo: "#e3faed" },
  { nazwa: "atrament na bloku turkusowym", tekst: "#10132a", tlo: "#e2f8fb" },
  { nazwa: "atrament na bloku fioletowym", tekst: "#10132a", tlo: "#f2ecff" },
  { nazwa: "atrament ściszony na bloku żółtym", tekst: "#3d4460", tlo: "#fff6dc" },

  // Zaznaczenie: biały numer na pelnym kolorze. Pelny kolor to atrament
  // kategorii, a nie neon: bialy na neonowym zoltym ma 1,7:1 i jest nieczytelny.
  { nazwa: "biały na pełnym niebieskim", tekst: "#ffffff", tlo: "#0a3ac9" },
  { nazwa: "biały na pełnym żółtym", tekst: "#ffffff", tlo: "#8a5a00" },
  { nazwa: "biały na pełnym czerwonym", tekst: "#ffffff", tlo: "#c00030" },
  { nazwa: "biały na pełnym zielonym", tekst: "#ffffff", tlo: "#067a45" },
  { nazwa: "biały na pełnym turkusowym", tekst: "#ffffff", tlo: "#056b78" },
  { nazwa: "biały na pełnym fioletowym", tekst: "#ffffff", tlo: "#5b21b6" },

  // Przycisk gradientowy: bialy napis na kazdym z czterech przystankow.
  { nazwa: "biały na gradiencie, granat", tekst: "#ffffff", tlo: "#0730a8" },
  { nazwa: "biały na gradiencie, niebieski", tekst: "#ffffff", tlo: "#1d5bff" },
  { nazwa: "biały na gradiencie, fiolet", tekst: "#ffffff", tlo: "#6d3df5" },
  { nazwa: "biały na gradiencie, róż", tekst: "#ffffff", tlo: "#c2185b" },
];
