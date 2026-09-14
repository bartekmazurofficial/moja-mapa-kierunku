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
  { nazwa: "słaby na tle akcentu", tekst: "#5b6480", tlo: "#e9f0ff" },
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

  // Trzeci akcent: pomaranycz. Znak zapytania, adnotacje, koniec gradientu
  // naglowka. Jasne pomarancze (#ff7a1a, #ff9500, #f97316, #ea580c) nie
  // przechodza ani jako tekst, ani pod bialym napisem, wiec ich tu nie ma.
  { nazwa: "pomarańcz na tle", tekst: "#b8460f", tlo: "#f4f6fb" },
  { nazwa: "pomarańcz na panelu", tekst: "#b8460f", tlo: "#ffffff" },
  { nazwa: "pomarańcz na tle pomarańczu", tekst: "#b8460f", tlo: "#fff1e8" },
  { nazwa: "biały na pomarańczu", tekst: "#ffffff", tlo: "#b8460f" },

  // Naglowek gradientowy: kazdy przystanek JEST kolorem tekstu, bo gradient
  // idzie przez background-clip. Tu nie wystarczy sprawdzic bieli na tle.
  { nazwa: "tytuł gradientowy, błękit", tekst: "#1d5bff", tlo: "#f4f6fb" },
  { nazwa: "tytuł gradientowy, fiolet", tekst: "#6d3df5", tlo: "#f4f6fb" },
  { nazwa: "tytuł gradientowy, pomarańcz", tekst: "#b8460f", tlo: "#f4f6fb" },
  { nazwa: "tytuł gradientowy na panelu, błękit", tekst: "#1d5bff", tlo: "#ffffff" },
  { nazwa: "tytuł gradientowy na panelu, fiolet", tekst: "#6d3df5", tlo: "#ffffff" },
  { nazwa: "tytuł gradientowy na panelu, pomarańcz", tekst: "#b8460f", tlo: "#ffffff" },

  // Przystanki tla strony: kazdy tekst musi przejsc takze na nich, bo karta
  // jest polprzezroczysta i tlo przez nia przechodzi.
  { nazwa: "atrament słaby na górze tła", tekst: "#5b6480", tlo: "#f2f7ff" },
  { nazwa: "atrament słaby na dole tła", tekst: "#5b6480", tlo: "#faf3f8" },
  { nazwa: "uwaga na dole tła", tekst: "#a15c00", tlo: "#faf3f8" },

  // Adnotacja odreczna: fiolet, nie neon. Neonowy #8b5cf6 ma na tle 3,92:1.
  { nazwa: "odręczny fiolet na tle", tekst: "#5b21b6", tlo: "#f4f6fb" },
  { nazwa: "odręczny fiolet na tle akcentu", tekst: "#5b21b6", tlo: "#e9f0ff" },

  // Ramka z podpowiedzia: tinta fioletu zamiast szklistej bieli.
  { nazwa: "podpowiedź na tincie fioletu", tekst: "#3d4460", tlo: "#f2ecff" },

  // Ciemna plyta przyszlosci zawodu: jedyne miejsce z odwroconym kontrastem.
  { nazwa: "tekst na ciemnej płycie", tekst: "#dfe4fb", tlo: "#202a5e" },
  { nazwa: "tekst na ciemnej płycie, jaśniejszy kraniec", tekst: "#dfe4fb", tlo: "#362b66" },
  { nazwa: "biały na ciemnej płycie", tekst: "#ffffff", tlo: "#362b66" },
  { nazwa: "znak na ciemnej płycie", tekst: "#a9bdff", tlo: "#202a5e" },
  { nazwa: "odznaka na ciemnej płycie", tekst: "#d8deff", tlo: "#362b66" },

  // Wnetrze karty: kafle na jasnej plycie.
  { nazwa: "atrament na płycie karty", tekst: "#10132a", tlo: "#f6f7fc" },
  { nazwa: "ściszony na płycie karty", tekst: "#3d4460", tlo: "#f6f7fc" },
  { nazwa: "słaby na płycie karty", tekst: "#5b6480", tlo: "#f6f7fc" },

  // Naglowki kafli na ciemnej plycie przyszlosci.
  { nazwa: "pomarańcz na ciemnej płycie", tekst: "#ffb06b", tlo: "#202a5e" },
  { nazwa: "zieleń na ciemnej płycie", tekst: "#8de0b6", tlo: "#202a5e" },
  { nazwa: "błękit na ciemnej płycie", tekst: "#a9bdff", tlo: "#362b66" },

  // Znaczniki modulow w profilu karty zawodu.
  { nazwa: "znacznik braku w profilu", tekst: "#5b6480", tlo: "#f1f2f8" },
  { nazwa: "znacznik A5 w profilu", tekst: "#b8460f", tlo: "#fff1e8" },
  { nazwa: "znacznik M1 w profilu", tekst: "#a15c00", tlo: "#fff4dc" },

  // Ekran ukonczenia assessmentu: pastelowe tlo pod tekstem.
  { nazwa: "ściszony na tle ukończenia", tekst: "#3d4460", tlo: "#eef0fc" },
  { nazwa: "słaby na tle ukończenia", tekst: "#5b6480", tlo: "#eef0fc" },
  { nazwa: "słaby na różowym rogu ukończenia", tekst: "#5b6480", tlo: "#fde3d6" },
  { nazwa: "odręczny na tle ukończenia", tekst: "#5b21b6", tlo: "#f3eefb" },

  // Kasowanie modulu: czerwien na karcie dialogu i na kazdym przystanku tla,
  // bo karta jest polprzezroczysta i przepuszcza rogi gradientu.
  { nazwa: "kasowanie na karcie", tekst: "#c00030", tlo: "#ffffff" },
  { nazwa: "kasowanie na tincie kasowania", tekst: "#c00030", tlo: "#ffe9ee" },
  { nazwa: "kasowanie na tle ukończenia", tekst: "#c00030", tlo: "#eef0fc" },
  { nazwa: "kasowanie na różowym rogu", tekst: "#c00030", tlo: "#fde3d6" },
  { nazwa: "kasowanie na fioletowym rogu", tekst: "#c00030", tlo: "#f3eefb" },
  { nazwa: "atrament na tincie kasowania", tekst: "#10132a", tlo: "#ffe9ee" },
  { nazwa: "ściszony na tincie kasowania", tekst: "#3d4460", tlo: "#ffe9ee" },

  // Plyty raportu: tekst sciszony na tintach sekcji.
  { nazwa: "ściszony na tincie pomarańczu", tekst: "#3d4460", tlo: "#fff1e8" },
  { nazwa: "ściszony na tincie błękitu", tekst: "#3d4460", tlo: "#e9f0ff" },
];
