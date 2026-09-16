/**
 * BARWY RAPORTU KONCOWEGO.
 *
 * Raport koncowy jest jedynym ekranem w aplikacji, ktory ma wlasna, nasycona
 * palete. Reszta produktu jest celowo wyciszona, bo uczestnik siedzi w niej
 * czterdziesci minut i wypelnia pytania; raport czyta sie raz, pokazuje
 * rodzicowi i wiesza na lodowce, wiec ma wygladac jak cos, co sie dostalo,
 * a nie jak wydruk z systemu.
 *
 * **Kazdy kolor pod bialym napisem przechodzi 4,5:1** i kazdy stoi
 * w PARY_KOLOROW, wiec pilnuje go `tests/dostepnosc.test.ts`.
 *
 * Dwa odcienie z makiety zostaly przyciemnione, bo nie przechodzily:
 * zielen `#0f8f68` dawala 4,08 i jest tu jako `#0d8460`, pomarancz `#c2651a`
 * dawal 4,06 i jest tu jako `#b45a14`. Roznicy nie widac, a napis jest czytelny.
 */

/** Pelne kolory: tlo pod bialym napisem albo sam napis na bieli. */
export const BARWA = {
  granat: "#1d2a8c",
  niebieski: "#2f4ae0",
  blekit: "#3a55e8",
  fiolet: "#5c31c9",
  fioletJasny: "#7a4ff5",
  amarant: "#a13fd0",
  magenta: "#a52f9e",
  zielen: "#0b6b55",
  zielenJasna: "#0d8460",
  zielenSrednia: "#0f7a5f",
  rdza: "#8a3f0c",
  rdzaJasna: "#b45a14",
  karmin: "#8d1b3f",
  karminJasny: "#b32f5c",
  wisnia: "#a8244c",
  atrament: "#16203c",
  slaby: "#5a6383",
} as const;

/** Gradienty, po jednym na role. Kolejnosc stopni jak w makiecie. */
export const GRADIENT = {
  /** Pas z jednym zdaniem pod tytulem raportu. */
  zdanie: `linear-gradient(96deg,${BARWA.niebieski},${BARWA.fioletJasny} 45%,${BARWA.amarant})`,
  /** Szesc kafli sekcji pierwszej, po kolei. */
  kafle: [
    `linear-gradient(120deg,${BARWA.granat},${BARWA.blekit})`,
    `linear-gradient(140deg,${BARWA.niebieski},${BARWA.blekit})`,
    `linear-gradient(140deg,${BARWA.fiolet},${BARWA.amarant})`,
    `linear-gradient(140deg,${BARWA.fioletJasny},${BARWA.magenta})`,
    `linear-gradient(140deg,${BARWA.zielen},${BARWA.zielenJasna})`,
    `linear-gradient(140deg,${BARWA.rdza},${BARWA.rdzaJasna})`,
  ],
  /** Karta „dwie rzeczy, o ktorych nie wiedziales". */
  atuty: `linear-gradient(130deg,${BARWA.fiolet},${BARWA.amarant} 60%,${BARWA.magenta})`,
  /** Trzy wartosci, od najwazniejszej. */
  wartosci: [
    `linear-gradient(120deg,${BARWA.granat},${BARWA.blekit})`,
    `linear-gradient(120deg,${BARWA.fiolet},${BARWA.amarant})`,
    `linear-gradient(120deg,${BARWA.rdza},${BARWA.rdzaJasna})`,
  ],
  /** Sekcja granic: lewa kolumna odmow, prawa zgod. */
  weta: `linear-gradient(140deg,${BARWA.karmin},${BARWA.karminJasny})`,
  zgody: `linear-gradient(140deg,${BARWA.zielen},${BARWA.zielenJasna})`,
  /** Pas uwagi pod cytatami i stopka raportu. */
  ciemny: `linear-gradient(120deg,${BARWA.atrament},#3b1f63 55%,#7a2350)`,
  /** Trzy progi wejscia pod kartami sciezek. */
  progi: [
    `linear-gradient(120deg,${BARWA.zielen},${BARWA.zielenJasna})`,
    `linear-gradient(120deg,${BARWA.granat},${BARWA.blekit})`,
    `linear-gradient(120deg,${BARWA.fiolet},${BARWA.amarant})`,
  ],
  /** Karta „jedna decyzja zamiast osmiu". */
  decyzja: `linear-gradient(140deg,${BARWA.fiolet},${BARWA.amarant})`,
} as const;

/** Kolor numeru sekcji. Dziewiec sekcji, dziewiec plakietek. */
export const BARWA_SEKCJI: Record<string, string> = {
  "to-jestes-ty": BARWA.niebieski,
  "co-cie-ciagnie": BARWA.niebieski,
  "co-ci-wychodzi": BARWA.fiolet,
  "jakiej-pracy": BARWA.zielenSrednia,
  "co-wazne": BARWA.rdza,
  granice: BARWA.wisnia,
  "twoje-slowa": BARWA.fiolet,
  "twoje-sciezki": BARWA.niebieski,
  "co-dalej": BARWA.zielenSrednia,
};

/**
 * Pastelowe tla kart z cytatami. Napis na kazdym z nich jest atramentowy
 * i przechodzi z zapasem, bo to sa bardzo jasne odcienie.
 */
export const PASTELE = ["#eef2ff", "#d9ffef", "#f2ecff", "#fff3e0", "#e8f0ff", "#ffeef3", "#f6ecff"];
