import { GLIFY, odcien, type KluczGlifu } from "@/lib/ui/glify";
import { obrazKafla } from "@/lib/ui/obrazy";

/**
 * Znak kategorii. Ilustracja, jeśli dla kategorii jest plik; w przeciwnym razie
 * kontur rysowany w odcieniu przypisanym na stałe kluczowi. Ten sam obszar
 * wygląda tak samo w każdym zestawie i w raporcie.
 *
 * Ozdoba i pomoc w orientacji, nigdy jedyny nośnik treści: obok zawsze stoi
 * pełny tekst pozycji.
 */
export function Ikona({
  klucz,
  rozmiar = 44,
  aktywna,
}: {
  klucz: KluczGlifu;
  rozmiar?: number;
  aktywna?: boolean;
}) {
  const h = odcien(klucz);
  const obraz = obrazKafla(klucz);

  if (obraz) {
    return (
      <span
        aria-hidden
        className="przejscie relative block shrink-0 overflow-hidden rounded-xl border"
        style={{
          width: rozmiar,
          height: rozmiar,
          borderColor: `hsl(${h} 70% 72% / ${aktywna ? 0.6 : 0.22})`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={obraz}
          alt=""
          width={rozmiar}
          height={rozmiar}
          loading="lazy"
          decoding="async"
          className="przejscie h-full w-full object-cover"
          style={{ opacity: aktywna ? 1 : 0.82 }}
        />
      </span>
    );
  }

  const sciezki = GLIFY[klucz];
  if (!sciezki) return null;

  return (
    <span
      aria-hidden
      className="przejscie flex shrink-0 items-center justify-center rounded-xl border"
      style={{
        width: rozmiar,
        height: rozmiar,
        borderColor: `hsl(${h} 70% 72% / ${aktywna ? 0.55 : 0.24})`,
        background: `linear-gradient(150deg, hsl(${h} 62% 62% / ${aktywna ? 0.26 : 0.12}), hsl(${h + 18} 58% 46% / 0.06))`,
        color: `hsl(${h} 88% ${aktywna ? 86 : 78}%)`,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={rozmiar * 0.55}
        height={rozmiar * 0.55}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {sciezki.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </span>
  );
}
