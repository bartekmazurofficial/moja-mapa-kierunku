/**
 * Trzy świetlne bramy i drogi, które przez nie prowadzą.
 *
 * Znak rozpoznawczy programu, rysowany wektorem: nic się nie pobiera, nic nie
 * waży, skaluje się do każdej szerokości. Miejsce na render, gdyby kiedyś
 * przyszedł — wtedy wystarczy podmienić ten komponent na obraz.
 *
 * Czysta ozdoba: nie niesie żadnej informacji, więc jest ukryta przed
 * czytnikiem ekranu i znika na wąskim ekranie.
 */
export function Bramy({ klasa = "" }: { klasa?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 560 360" className={klasa} fill="none">
      <defs>
        <linearGradient id="brama-luk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4edff" stopOpacity="1" />
          <stop offset="45%" stopColor="#b79cff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7c5cf0" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="brama-wnetrze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#e3d5ff" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="brama-droga" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#c7aeff" stopOpacity="0" />
          <stop offset="40%" stopColor="#c7aeff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f6f1ff" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="brama-halo" cx="50%" cy="46%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="brama-ziemia" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#b79cff" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#b79cff" stopOpacity="0" />
        </radialGradient>
        <filter id="brama-blask" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="5" result="r" />
          <feMerge>
            <feMergeNode in="r" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="280" cy="165" rx="250" ry="150" fill="url(#brama-halo)" />
      <ellipse cx="280" cy="252" rx="230" ry="40" fill="url(#brama-ziemia)" />

      {/* Drogi wychodzą spod bram i schodzą ku dołowi kadru. */}
      <g stroke="url(#brama-droga)" strokeLinecap="round" fill="none">
        <path d="M152 250 C 136 286, 104 312, 52 356" strokeWidth="10" opacity="0.7" />
        <path d="M280 250 C 278 288, 270 322, 264 358" strokeWidth="13" />
        <path d="M408 250 C 424 286, 456 312, 508 356" strokeWidth="10" opacity="0.7" />
      </g>

      {/* Wnętrza bram: światło w przejściu. */}
      <g fill="url(#brama-wnetrze)">
        <path d="M120 250 V 150 a32 32 0 0 1 64 0 V 250 Z" />
        <path d="M240 250 V 122 a40 40 0 0 1 80 0 V 250 Z" />
        <path d="M376 250 V 150 a32 32 0 0 1 64 0 V 250 Z" />
      </g>

      {/* Łuki. Środkowa brama wyższa i szersza. */}
      <g filter="url(#brama-blask)" stroke="url(#brama-luk)" fill="none" strokeLinecap="round">
        <path d="M120 250 V 150 a32 32 0 0 1 64 0 V 250" strokeWidth="3" />
        <path d="M240 250 V 122 a40 40 0 0 1 80 0 V 250" strokeWidth="3.6" />
        <path d="M376 250 V 150 a32 32 0 0 1 64 0 V 250" strokeWidth="3" />
      </g>

      {/* Próg każdej bramy. */}
      <g fill="#dcccff">
        <ellipse cx="152" cy="250" rx="34" ry="4" opacity="0.55" />
        <ellipse cx="280" cy="250" rx="42" ry="5" opacity="0.75" />
        <ellipse cx="408" cy="250" rx="34" ry="4" opacity="0.55" />
      </g>

      {/* Latarnie przy środkowej drodze. */}
      <g fill="#f4edff">
        <circle cx="250" cy="286" r="2.4" opacity="0.8" />
        <circle cx="302" cy="322" r="2.4" opacity="0.6" />
        <circle cx="246" cy="344" r="2.4" opacity="0.45" />
      </g>
    </svg>
  );
}
