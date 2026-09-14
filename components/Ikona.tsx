import { GLIFY, type KluczGlifu } from "@/lib/ui/glify";
import { kolorKategorii, type Kolor } from "@/lib/ui/kolory";
import { obrazDuzy, obrazKafla, obrazPlanszy } from "@/lib/ui/obrazy";

/**
 * Paleta znaku. Na ekranie wyboru znak nie zdradza kategorii: wszystkie
 * bloki w zestawie wygladaja tak samo, a wybrany zaznacza jeden akcent
 * (lib/ui/kolory.ts, KOLOR_KATEGORII_NA_WYBORZE).
 */
const NEUTRALNY: Kolor = {
  kod: "niebieski",
  neon: "var(--color-akcent)",
  tlo: "var(--color-panel)",
  obwod: "var(--color-linia)",
  atrament: "var(--color-atrament-sciszony)",
};

function paleta(klucz: KluczGlifu, wybor?: boolean, kolor?: Kolor | null): Kolor {
  if (!wybor) return kolorKategorii(klucz);
  return kolor ?? NEUTRALNY;
}

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
  wybor,
  kolor,
}: {
  klucz: KluczGlifu;
  rozmiar?: number;
  aktywna?: boolean;
  /** Znak stoi na ekranie wyboru: nie wolno mu zdradzac kategorii. */
  wybor?: boolean;
  /** Kolor miejsca na ekranie wyboru. Bez niego znak jest neutralny. */
  kolor?: Kolor | null;
}) {
  const sciezki = GLIFY[klucz];
  if (!sciezki) return null;
  const k = paleta(klucz, wybor, kolor);

  return (
    <span
      aria-hidden
      className="przejscie flex shrink-0 items-center justify-center rounded-xl border"
      style={{
        width: rozmiar,
        height: rozmiar,
        // Wypelnienie bierze atrament kategorii, nie neon: bialy znak na
        // neonowym zoltym ma 1,7:1 i po prostu znika.
        borderColor: aktywna ? k.atrament : k.obwod,
        background: aktywna ? k.atrament : k.tlo,
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
  wybor,
  kolor,
  pelny,
}: {
  klucz: KluczGlifu;
  rozmiar?: number;
  aktywna?: boolean;
  /** Ilustracja stoi na ekranie wyboru: nie wolno jej zdradzac kategorii. */
  wybor?: boolean;
  /** Kolor miejsca na ekranie wyboru. Bez niego ilustracja jest neutralna. */
  kolor?: Kolor | null;
  /**
   * Obraz na cala szerokosc karty, przyciety do 4:3, bez wlasnej ramki —
   * krawedzie daje karta. Dla kart odpowiedzi, gdzie obraz JEST decyzja,
   * a nie miniaturka przy tekscie.
   */
  pelny?: boolean;
}) {
  const k = paleta(klucz, wybor, kolor);
  const zrodlo = pelny || rozmiar > 200 ? (obrazDuzy(klucz) ?? obrazKafla(klucz)) : obrazKafla(klucz);

  if (!zrodlo) return <Ikona klucz={klucz} rozmiar={rozmiar} aktywna={aktywna} wybor={wybor} kolor={kolor} />;

  if (pelny) {
    return (
      <span
        aria-hidden
        className="relative block w-full overflow-hidden"
        style={{ aspectRatio: "4 / 3", background: k.tlo }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={zrodlo}
          alt=""
          loading="lazy"
          decoding="async"
          className="przejscie absolute inset-0 h-full w-full object-cover"
          style={{ opacity: aktywna ? 1 : 0.94 }}
        />
      </span>
    );
  }

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

/**
 * Plansza pytania: szeroki pas nad blokami odpowiedzi.
 *
 * Każde pytanie ma tu miejsce na dużą grafikę, na całej szerokości bloków
 * do odpowiadania. Dopóki grafiki nie ma, pas pokazuje duży znak kategorii
 * na jej kolorze — miejsce jest zajęte i widać, czego pytanie dotyczy.
 *
 * Dostarczone pliki są kwadratowe, więc wchodzą w pas w całości, bez
 * przycinania, a tło pasa dopełnia rozmyta kopia tego samego obrazu.
 * Grafika w proporcji pasa wypełni go od krawędzi do krawędzi.
 *
 * `pelnaProporcja` zdejmuje sztywną wysokość i oddaje ramkę proporcji 16:9,
 * czyli tej, w której przychodzą plansze pytań. Bez tego pas o stałej
 * wysokości przycinał im górę i dół.
 */
/**
 * Pas ilustracji pary: dwie połowy, jedna biała linia między nimi.
 *
 * Lewa połowa należy do lewej odpowiedzi, prawa do prawej, obie tej samej
 * szerokości i wysokości — pas jest symetryczny, więc nie przechyla wyboru.
 * Gdy któraś strona nie ma obrazu, pasa nie ma wcale: jedno zdjęcie na dwie
 * odpowiedzi ustawiałoby jedną z nich w uprzywilejowanej pozycji.
 */
export function PlanszaPary({
  lewy,
  prawy,
  wysokosc = 250,
}: {
  lewy: KluczGlifu;
  prawy: KluczGlifu;
  wysokosc?: number;
}) {
  const zrodla = [lewy, prawy].map((k) => obrazPlanszy(k) ?? obrazDuzy(k) ?? obrazKafla(k));
  if (zrodla.some((z) => !z)) return null;
  return (
    <span
      aria-hidden
      className="relative grid w-full grid-cols-2 overflow-hidden rounded-[1.4rem] border border-white/90 shadow-[0_14px_40px_rgba(46,60,120,0.12)]"
      style={{ height: wysokosc }}
    >
      {zrodla.map((z, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={z as string}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ))}
      <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-px bg-white/95" />
    </span>
  );
}

export function Plansza({
  klucz,
  wysokosc = 176,
  wybor,
  kolor,
  pelnaProporcja,
}: {
  klucz: KluczGlifu;
  wysokosc?: number;
  /** Pas stoi nad blokami wyboru: nie wolno mu zdradzac kategorii. */
  wybor?: boolean;
  /** Kolor ekranu wyboru. Bez niego pas jest neutralny. */
  kolor?: Kolor | null;
  /**
   * Cała grafika, nie wycinek. Plansze pytań są w 16:9 i przy sztywnej
   * wysokości pasa `object-cover` zabierał im górę i dół: na ekranie
   * zostawał środkowy pasek zdjęcia. Tutaj ramka bierze proporcję obrazu,
   * więc nie ma czego przycinać. Kafle zawodów zostają przy sztywnej
   * wysokości, bo tam pas jest miniaturą w siatce, a nie ilustracją pytania.
   */
  pelnaProporcja?: boolean;
}) {
  const k = paleta(klucz, wybor, kolor);
  const plansza = obrazPlanszy(klucz);
  const obraz = obrazDuzy(klucz) ?? obrazKafla(klucz);
  const sciezki = GLIFY[klucz];

  return (
    <span
      aria-hidden
      className={`relative block w-full overflow-hidden border ${
        pelnaProporcja ? "aspect-[16/9] rounded-xl" : "rounded-2xl"
      }`}
      style={{
        height: pelnaProporcja ? undefined : wysokosc,
        borderColor: k.obwod,
        background: k.tlo,
      }}
    >
      {plansza ? (
        /* Plansza ma proporcje pasa, więc wypełnia go od krawędzi do krawędzi. */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={plansza}
          alt=""
          loading="lazy"
          decoding="async"
          className={`h-full w-full ${pelnaProporcja ? "object-contain" : "object-cover"}`}
        />
      ) : obraz ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={obraz}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-xl"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={obraz}
            alt=""
            loading="lazy"
            decoding="async"
            className="relative mx-auto h-full w-auto object-contain"
          />
        </>
      ) : sciezki ? (
        <span className="flex h-full w-full items-center justify-center" style={{ color: k.neon }}>
          <svg
            viewBox="0 0 24 24"
            width={wysokosc * 0.46}
            height={wysokosc * 0.46}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {sciezki.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </svg>
        </span>
      ) : null}
    </span>
  );
}
