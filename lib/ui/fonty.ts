import { Plus_Jakarta_Sans, Poppins, Caveat } from "next/font/google";

/**
 * Cztery role, trzy kroje.
 *
 * Plus Jakarta Sans niesie wszystko: nagłówki w grubych odmianach, treść
 * w regularnej. Geometryczny grotesk z pełnym latin-ext, więc polskie znaki
 * są rysowane, nie podstawiane.
 *
 * Poppins niesie treść bloków odpowiedzi. Geometryczny, okrągły, wyraźnie
 * inny od tekstu prowadzącego przez ekran, więc kafel z odpowiedzią czyta się
 * jako coś osobnego, a nie jako kolejny akapit. Też z pełnym latin-ext.
 *
 * Caveat tylko do odręcznych dopisków na marginesie. Nigdy do treści, nigdy
 * do niczego, co uczestnik musi przeczytać, żeby zrozumieć ekran.
 *
 * next/font pobiera oba przy budowaniu i serwuje z własnego serwera — żadnego
 * zapytania do zewnętrznej usługi w czasie działania aplikacji.
 */

export const bezszeryfowy = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bezszeryfowy",
  display: "swap",
});

export const boksowy = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-boksowy",
  display: "swap",
});

export const odreczny = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-odreczny",
  display: "swap",
});
