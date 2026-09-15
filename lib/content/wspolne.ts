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
export const ODDECHY: Record<string, Record<number, string>> = {
  /** 36 zestawów: oddech po dwunastym i po dwudziestym czwartym. */
  A1: {
    12: "Jedna trzecia za Tobą. Dalej idzie już szybciej, bo złapałeś rytm.",
    24: "Zostało dwanaście. To ostatnia prosta.",
  },
  /** 45 zestawów: co dwanaście, a w środku ta sama przerwa co dotąd. */
  A2: {
    12: "Dwanaście zestawów za Tobą. Dalej idzie szybciej, bo złapałeś rytm.",
    24: "Połowa za Tobą. Odetchnij chwilę.",
    36: "Zostało dziewięć. To ostatnia prosta.",
  },
};

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
  A6: "Gotowe. To była ostatnia część. Teraz prowadzący otwiera Twój raport.",
};
