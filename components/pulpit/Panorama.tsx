/**
 * Panorama: góry, ścieżka, wschód słońca i postać na grani.
 *
 * Motyw przewodni całej platformy, rysowany wektorem: nic się nie pobiera,
 * nic nie waży, skaluje się do każdej szerokości. Miejsce na prawdziwy render,
 * gdyby kiedyś przyszedł — wtedy wystarczy podmienić ten komponent na obraz.
 *
 * Czysta ozdoba: nie niesie żadnej informacji, więc jest ukryta przed
 * czytnikiem ekranu. Stoi zawsze **pod** treścią i ma tak dobrane krycie, żeby
 * tekst na niej zachował wymagany kontrast: najciemniejszy punkt grafiki jest
 * jaśniejszy niż tło strony, więc atrament czyta się na niej tak samo.
 */
export function Panorama({
  klasa = "",
  /** Mocniejsza wersja na baner, delikatniejsza w tle ekranu. */
  moc = 1,
}: {
  klasa?: string;
  moc?: number;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 320"
      className={klasa}
      fill="none"
      preserveAspectRatio="xMidYMax slice"
      // Ilustracja rozpływa się przy wszystkich krawędziach. Bez tego prostokąt
      // rysunku urywa się twardą linią i czyta się jak przycięty obrazek.
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, #000 16%, #000 84%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 55%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, #000 16%, #000 84%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 55%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <defs>
        <radialGradient id="pan-slonce" cx="0.62" cy="0.74" r="0.42">
          <stop offset="0%" stopColor="#ffb35c" stopOpacity={0.95 * moc} />
          <stop offset="45%" stopColor="#ffc98a" stopOpacity={0.45 * moc} />
          <stop offset="100%" stopColor="#ffd9b0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pan-dal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3 * moc} />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.06 * moc} />
        </linearGradient>
        <linearGradient id="pan-srodek" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b6fd8" stopOpacity={0.42 * moc} />
          <stop offset="100%" stopColor="#5b6fd8" stopOpacity={0.1 * moc} />
        </linearGradient>
        <linearGradient id="pan-blisko" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f3f96" stopOpacity={0.5 * moc} />
          <stop offset="100%" stopColor="#2f3f96" stopOpacity={0.16 * moc} />
        </linearGradient>
        <linearGradient id="pan-sciezka" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15 * moc} />
          <stop offset="45%" stopColor="#ffd9a8" stopOpacity={0.85 * moc} />
          <stop offset="100%" stopColor="#ffb35c" stopOpacity={0.95 * moc} />
        </linearGradient>
      </defs>

      <circle cx="496" cy="237" r="150" fill="url(#pan-slonce)" />
      <circle cx="496" cy="215" r="26" fill="#ffc07a" opacity={0.75 * moc} />

      {/* Trzy grzbiety, od najdalszego. Każdy jaśniejszy od poprzedniego u dołu,
          żeby dół kadru został jasny i tekst na nim się czytał. */}
      <path d="M0 196 118 108l74 58 68-44 96 74 84-52 122 90 106-64 132 96v122H0z" fill="url(#pan-dal)" />
      <path d="M0 238 96 168l86 54 92-36 74 56 108-70 118 84 96-50 130 70v144H0z" fill="url(#pan-srodek)" />
      <path d="M0 282 132 216l92 44 118-28 96 46 122-34 118 52 122-30v92H0z" fill="url(#pan-blisko)" />

      {/* Ścieżka wijąca się w stronę słońca. */}
      <path
        d="M262 320c34-34 6-58 52-78 46-20 96 6 132-22 36-28 18-52 50-66"
        stroke="url(#pan-sciezka)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Postać na grani: mała, bez twarzy, plecami do patrzącego. */}
      <g opacity={0.85 * moc} fill="#2b2f5e">
        <circle cx="258" cy="206" r="6" />
        <path d="M252 214h12l4 26h-6l-2-14-2 14h-6l-4-26z" />
        <path d="M266 216l9 7-3 4-8-5z" />
      </g>
    </svg>
  );
}
