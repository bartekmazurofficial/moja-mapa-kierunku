/**
 * Zdania, które są takie same we wszystkich siedmiu modułach.
 *
 * Trzymane osobno, bo powtórzone siedem razy w siedmiu plikach rozjadą się
 * przy pierwszej redakcji, a to są akurat zdania, które muszą brzmieć
 * identycznie: uczestnik czyta je siedem razy i każda różnica jest zgrzytem.
 */

/**
 * Na ekranie wstępu każdego modułu.
 *
 * Zapis działa na bieżąco i bez przycisku, ale uczestnik nie ma skąd o tym
 * wiedzieć. Osoba wypełniająca na telefonie w szkole, której kończy się
 * lekcja, musi wiedzieć, że wolno jej zamknąć.
 */
export const ZAPIS_SAM =
  "Odpowiedzi zapisują się same. Możesz zamknąć i wrócić później, wejdziesz w to samo miejsce.";

/**
 * Ekrany oddechu w długich modułach.
 *
 * Stwierdzenie faktu, nigdy pochwała. W tych modułach nie da się iść dobrze
 * ani źle, więc „świetnie Ci idzie" byłoby kłamstwem, a odznaka za serię
 * zamieniłaby rozmowę o czyimś życiu w aplikację do nauki słówek.
 */
export const ODDECH = {
  jednaTrzecia: "Jedna trzecia za Tobą. Dalej idzie już szybciej, bo złapałeś rytm.",
  dwieTrzecie: "Zostało dwanaście. To ostatnia prosta.",
  polowa: "Połowa za Tobą. Odetchnij chwilę.",
} as const;

/**
 * Ekran zamykający moduł.
 *
 * Uczestnik kończy kilkadziesiąt minut pracy i ma wiedzieć, że poszła gdzieś
 * konkretnie. Bez ujawniania wyniku: reguła odsłaniania warstwami jest
 * ważniejsza, ale „dziękujemy, dalej" to za mało.
 */
export const ZAMKNIECIE: Record<string, string> = {
  A0: "Gotowe. Te odpowiedzi decydują o tym, których dróg system Ci nie zaproponuje, bo są dla Ciebie zamknięte.",
  A1: "Gotowe. Twoje odpowiedzi z tej części pokazują, do jakich czynności Cię ciągnie. Zobaczysz to po spotkaniu, razem z drugą częścią profilu.",
  A2: "Gotowe. To była druga strona profilu: nie co lubisz, tylko w czym możesz być dobry. Zestawienie obu zobaczysz po spotkaniu.",
  A3: "Gotowe. Z tych par wychodzi, w jakim otoczeniu pracy będzie Ci naturalnie. To zawęzi listę zawodów bardziej, niż się teraz wydaje.",
  A4: "Gotowe. Wiemy już, co wygrywa u Ciebie, kiedy trzeba wybierać. To jest część profilu, której nie da się odczytać z ocen w szkole.",
  M1: "Gotowe. To jedyna część, której nikt nie policzy. Twój tekst trafia do raportu dosłownie, bez skracania.",
  A5: "Gotowe. Te warunki są filtrem: zawody, których nie chcesz, znikną z Twojego wyniku, a nie zjadą niżej.",
};
