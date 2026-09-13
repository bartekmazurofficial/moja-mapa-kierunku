import { Manrope, Caveat } from "next/font/google";

/**
 * Dwa kroje, trzy role.
 *
 * Manrope niesie cały interfejs: nagłówki w grubych odmianach, treść
 * w regularnej, bloki odpowiedzi w medium. Jeden system typograficzny
 * zamiast dwóch groteski — kafel z odpowiedzią odróżnia się wagą,
 * wyśrodkowaniem i tłem, nie osobnym krojem. Pełny latin-ext, więc polskie
 * znaki są rysowane, nie podstawiane.
 *
 * Caveat tylko do odręcznych dopisków na marginesie. Nigdy do treści, nigdy
 * do niczego, co uczestnik musi przeczytać, żeby zrozumieć ekran.
 *
 * next/font pobiera kroje przy budowaniu i serwuje z własnego serwera —
 * żadnego zapytania do zewnętrznej usługi w czasie działania aplikacji.
 */

export const bezszeryfowy = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bezszeryfowy",
  display: "swap",
});

export const odreczny = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-odreczny",
  display: "swap",
});
