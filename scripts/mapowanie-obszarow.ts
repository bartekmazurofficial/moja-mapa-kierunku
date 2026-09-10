/**
 * Odwzorowanie etykiet prozy z 03_dane/obszary_27_opis.md na kody modulow.
 *
 * Baza 27 obszarow istnieje wylacznie jako tekst. Ten plik jest jedynym
 * miejscem, w ktorym tlumaczymy jej etykiety na kody, zeby przy zmianie
 * dokumentu bylo widac, co dokladnie trzeba poprawic.
 */

/** Etykieta A5 uzywana w dokumencie obszarow -> kod filtru. Dokladnie 32 pozycje. */
export const A5_ETYKIETY: Record<string, string> = {
  "5+ lat studiów": "F01",
  "studia w ogóle": "F02",
  "egzaminy zawodowe": "F03",
  "dokształcanie przez całe życie": "F04",
  "nauka po godzinach": "F05",
  "przeprowadzka": "F06",
  "zagranica": "F07",
  "życie daleko od rodziny": "F08",
  "wyjazdy służbowe": "F09",
  "jedno miejsce przez lata": "F10",
  "praca w weekendy": "F11",
  "zmiany i noce": "F12",
  "dyżury": "F13",
  "nadgodziny": "F14",
  "nieregularne godziny": "F15",
  "praca fizyczna": "F16",
  "każda pogoda": "F17",
  "stanie cały dzień": "F18",
  "komputer cały dzień": "F19",
  "brud i zapachy": "F20",
  "krew i cierpienie": "F21",
  "ciągły kontakt z ludźmi": "F22",
  "małe dzieci": "F23",
  "chorzy i starsi": "F24",
  "roszczeniowi klienci": "F25",
  "wystąpienia": "F26",
  "samotność": "F27",
  "niepewny dochód": "F28",
  "własna działalność": "F29",
  "niskie zarobki na starcie": "F30",
  "odpowiedzialność za bezpieczeństwo": "F31",
  "stała presja": "F32",
};

/** Etykieta A4 w dokumencie obszarow -> kod wartosci. */
export const A4_ETYKIETY: Record<string, string> = {
  "Pieniądze": "PIE",
  "Stabilność": "STA",
  "Wolność": "WOL",
  "Rozwój": "ROZ",
  "Wpływ": "WPL",
  "Sens i pomaganie": "SEN",
  "Uznanie": "UZN",
  "Relacje": "REL",
  "Czas dla siebie": "CZA",
  "Mistrzostwo": "MIS",
  "Zmienność": "ZMI",
  "Zgodność z zasadami": "ZAS",
};

/** Fraza M1 w dokumencie obszarow -> wymiar i biegun. */
export const M1_FRAZY: Record<string, string> = {
  "praca w centrum życia": "CEN:A",
  "praca jako część życia": "CEN:B",
  "praca przenika życie": "GRA:A",
  "wyraźna granica": "GRA:B",
  "dużo godzin": "GOD:A",
  "mniej godzin": "GOD:B",
  "szybka kariera": "TEMP:A",
  "praca stacjonarna": "MIE:A",
  "możliwa zdalna": "MIE:B",
  "duża organizacja": "ORG:A",
  "mały zespół lub własne": "ORG:B",
  "osiadłość": "KOR:A",
  "mobilność": "KOR:B",
  "szybkie wejście": "INW:A",
  "długa inwestycja w naukę": "INW:B",
  "wysoki poziom życia": "POZ:A",
  "wystarczy wygodnie": "POZ:B",
  "prowadzenie ludzi": "LUD:A",
  "widoczność": "WID:A",
};

/**
 * Fraza srodowiskowa A3 w dokumencie obszarow -> wymiar i biegun.
 *
 * Wartosc null oznacza fraze, ktora nie odpowiada zadnemu z 12 wymiarow A3.
 * Sa to warianty "widoczny efekt" i "praca zdalna" - w module A3 nie ma
 * takiego wymiaru. Fraza zostaje w danych jako tekst i trafia do wyjasnien
 * w raporcie, ale nie jest porownywana z wynikiem A3.
 */
export const A3_FRAZY: Record<string, string | null> = {
  "przestrzeń na własne pomysły": "INI:A",
  "jasne oczekiwania": "INI:B",
  "wyraźna struktura": "STR:A",
  "jasne procedury": "STR:A",
  "przewidywalny dzień": "STR:A",
  "brak sztywnych procedur": "STR:B",
  "szybkie tempo": "TEM:A",
  "czas na dokładność": "TEM:B",
  "praca zespołowa": "SAM:B",
  "silny zespół": "SAM:B",
  "silna wspólnota": "SAM:B",
  "stały kontakt z ludźmi": "SAM:B",
  "skupienie na jednym": "GLE:A",
  "skupienie na jednym obszarze": "GLE:A",
  "skupienie na jednej rzeczy": "GLE:A",
  "skupienie na jednej osobie": "GLE:A",
  "wiele spraw naraz": "GLE:B",
  "duża samodzielność": "DEC:A",
  "pełna samodzielność": "DEC:A",
  "możliwość pracy na swoim": "DEC:A",
  "realny wpływ na decyzje": "DEC:A",
  "realny wpływ na wynik": "DEC:A",
  "realny wpływ na wszystko": "DEC:A",
  "kultura mówienia wprost": "KON:A",
  "spokojna atmosfera": "KON:B",
  "zmienne zadania": "NOW:A",
  "brak kontroli nad głową": "NAP:A",
  "przewidywalny rytm": "RYT:A",
  "powtarzalny rytm roku": "RYT:A",
  "praca w cyklu i rytmie": "RYT:A",
  "cisza": "OTO:A",
  "ciche": "OTO:A",
  "cisza i skupienie": "OTO:A",
  "spokojne otoczenie": "OTO:A",
  "uporządkowane miejsce": "OTO:A",
  "dużo ruchu": "OTO:B",
  // Bez odpowiednika w 12 wymiarach A3:
  "możliwość pracy zdalnej": null,
  "natychmiastowy efekt pracy": null,
  "natychmiastowy efekt decyzji": null,
  "trwały efekt pracy": null,
  "widoczny": null,
  "widoczny efekt": null,
  "widoczny efekt pracy": null,
  "widoczny efekt u ludzi": null,
  "widoczny sens pracy": null,
};

/** Etykieta poziomu wejscia w dokumencie -> kod poziomu uzywany w bazie zawodow. */
export const POZIOMY_ETYKIETY: Record<string, string> = {
  "szybkie": "szybki",
  "średnie": "sredni",
  "długie": "dlugi",
  "bardzo długie": "bardzo_dlugi",
};

/**
 * Nazwy kompetencji skrocone w dokumencie obszarow wobec pelnej nazwy z modulu A2.
 * Klucz to zapis z dokumentu, wartosc to numer kompetencji.
 */
export const A2_ALIASY: Record<string, number> = {
  "Zapamiętywanie": 7, // w A2: "Zapamiętywanie i przywoływanie"
};
