import { Source_Serif_4, Inter } from "next/font/google";

/**
 * Dwa kroje o wyraznie roznych rolach: szeryfowy do naglowkow i tresci
 * czytelniczej, bezszeryfowy do interfejsu. Oba maja pelny zestaw polskich
 * znakow (subset latin-ext), sprawdzony na tekstach z kart zawodow.
 *
 * next/font pobiera je przy budowaniu i serwuje z wlasnego serwera - zadnego
 * zapytania do zewnetrznej uslugi w czasie dzialania aplikacji.
 */

export const szeryfowy = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-szeryfowy",
  display: "swap",
});

export const bezszeryfowy = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-bezszeryfowy",
  display: "swap",
});
