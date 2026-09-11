import { GLIFY, type KluczGlifu } from "@/lib/ui/glify";
import { kolorKategorii } from "@/lib/ui/kolory";
import { obrazDuzy, obrazKafla } from "@/lib/ui/obrazy";

/**
 * Znak kategorii: rysowany glif w bloku w kolorze kategorii.
 *
 * Bloki odpowiedzi mają nieść kolor, a nie zdjęcie: na karcie z wynikami
 * liczy się to, co uczestnik wybrał, a nie to, jak ładny jest obraz.
 * Kolor jest przypisany kategorii na stałe, więc ten sam obszar wygląda
 * tak samo wszędzie.
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
  const sciezki = GLIFY[klucz];
  if (!sciezki) return null;
  const k = kolorKategorii(klucz);

  return (
    <span
      aria-hidden
      className="przejscie flex shrink-0 items-center justify-center rounded-xl border"
      style={{
        width: rozmiar,
        height: rozmiar,
        borderColor: aktywna ? k.neon : k.obwod,
        background: aktywna ? k.neon : k.tlo,
        color: aktywna ? "#ffffff" : k.atrament,
        boxShadow: aktywna ? `0 8px 20px -10px ${k.neon}` : "none",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={rozmiar * 0.56}
        height={rozmiar * 0.56}
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
    </span>
  );
}

/**
 * Ilustracja kategorii w całości.
 *
 * Pliki są kwadratowe, więc ramka też jest kwadratowa i obraz wchodzi w nią
 * bez przycinania. Kadrowanie do paska ucinało tym rysunkom połowę sceny,
 * a scena jest w nich treścią.
 *
 * Kategoria bez pliku dostaje glif w tym samym bloku, żeby ekran nie
 * rozjeżdżał się na dwa różne produkty.
 */
export function Obraz({
  klucz,
  rozmiar = 128,
  aktywna,
}: {
  klucz: KluczGlifu;
  rozmiar?: number;
  aktywna?: boolean;
}) {
  const k = kolorKategorii(klucz);
  const zrodlo = rozmiar > 200 ? (obrazDuzy(klucz) ?? obrazKafla(klucz)) : obrazKafla(klucz);

  if (!zrodlo) return <Ikona klucz={klucz} rozmiar={rozmiar} aktywna={aktywna} />;

  return (
    <span
      aria-hidden
      className="przejscie block shrink-0 overflow-hidden rounded-xl border"
      style={{
        width: rozmiar,
        height: rozmiar,
        borderColor: aktywna ? k.neon : k.obwod,
        background: k.tlo,
        boxShadow: aktywna ? `0 10px 26px -12px ${k.neon}` : "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={zrodlo}
        alt=""
        width={rozmiar}
        height={rozmiar}
        loading="lazy"
        decoding="async"
        className="przejscie h-full w-full object-contain"
        style={{ opacity: aktywna ? 1 : 0.9 }}
      />
    </span>
  );
}
