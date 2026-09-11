/** Znak programu. Trzy drogi zbiegające się w jeden punkt. */
export function Znak({ rozmiar = 40 }: { rozmiar?: number }) {
  return (
    <span
      aria-hidden
      className="szklo szklo-akcent flex shrink-0 items-center justify-center"
      style={{ width: rozmiar, height: rozmiar, borderRadius: rozmiar * 0.3 }}
    >
      <svg viewBox="0 0 24 24" width={rozmiar * 0.55} height={rozmiar * 0.55} fill="none">
        <defs>
          <linearGradient id="znak" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e6d8ff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path
          d="M12 3 3.5 20h4.2L12 11l4.3 9h4.2z"
          stroke="url(#znak)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M8.6 15.2h6.8" stroke="url(#znak)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}
