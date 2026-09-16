/**
 * TRESC RAPORTU KONCOWEGO.
 *
 * Raport koncowy mowi krotko. Kafel ma sie czytac z dwoch metrow, wiec nie
 * moze w nim stac ani etykieta obszaru z A1 („Naprawianie i rozgryzanie, jak
 * cos dziala"), ani warunek srodowiskowy z A3 („mozliwosc pracy w pojedynke").
 * Jedno i drugie jest napisane do innego miejsca w raporcie i w kaflu brzmi
 * jak notatka techniczna.
 *
 * Stad ten plik: te same kody, ale powiedziane w drugiej osobie i w szesciu
 * slowach. **Kody sa niezmienne**, zmieniac wolno wylacznie tekst.
 */

/** Szescioslowne zdanie o obszarze zainteresowan. Klucz to numer obszaru A1. */
export const KAFEL_A1: Record<number, string> = {
  1: "Rozgryzasz, dlaczego coś się zepsuło",
  2: "Robisz rzeczy własnymi rękami",
  3: "Pracujesz z tym, co żywe",
  4: "Wolisz ruch niż siedzenie",
  5: "Sprawiasz, że maszyna robi swoje",
  6: "Sprawdzasz zamiast wierzyć na słowo",
  7: "Ciekawi Cię ludzkie ciało",
  8: "Z liczb wyciągasz wnioski",
  9: "Widzisz, jak rzeczy wyglądają",
  10: "Trafiasz słowem w sedno",
  11: "Pracujesz z dźwiękiem",
  12: "Nie przeszkadza Ci bycie widocznym",
  13: "Jesteś blisko człowieka w potrzebie",
  14: "Tłumaczysz tak, że ktoś rozumie",
  15: "Rozmawiasz o tym, co trudne",
  16: "Robisz coś dla innych",
  17: "Zmieniasz czyjeś zdanie",
  18: "Bierzesz decyzje na siebie",
  19: "Budujesz coś swojego",
  20: "Układasz argumenty, które się bronią",
  21: "Nadajesz rzeczom strukturę",
  22: "Wyłapujesz, że coś się nie zgadza",
  23: "Pilnujesz, dokąd płyną pieniądze",
  24: "Spinasz całość w kolejność",
};

/** Szescioslowne zdanie o biegunie stylu dzialania. Kolejnosc: biegun A, biegun B. */
export const KAFEL_A3: Record<string, [string, string]> = {
  INI: ["Sam zaczynasz, bez polecenia", "Ruszasz, gdy wiesz, czego się oczekuje"],
  STR: ["Chcesz wiedzieć z góry, co będzie", "Układasz pracę w trakcie"],
  TEM: ["Wolisz zdążyć niż dopieścić", "Wolisz zrobić porządnie niż szybko"],
  SAM: ["Wolisz pracować sam", "Wolisz pracować z ludźmi"],
  GLE: ["Jedną rzecz naraz, do końca", "Kilka rzeczy naraz"],
  RYZ: ["Ryzyko Ci nie przeszkadza", "Potrzebujesz pewności"],
  DEC: ["Chcesz decydować", "Chcesz jasnego zadania"],
  KON: ["Mówisz wprost", "Pilnujesz, żeby było zgodnie"],
  NOW: ["Ciągnie Cię nowe", "Wolisz sprawdzone"],
  NAP: ["Ruszasz z własnego napędu", "Potrzebujesz terminu z zewnątrz"],
  RYT: ["Chcesz równego tempa", "Pracujesz zrywami"],
  OTO: ["Potrzebujesz ciszy", "Lubisz ruch wokół"],
  EFE: ["Chcesz widzieć efekt tego samego dnia", "Możesz poczekać na efekt"],
};

/** Szescioslowne zdanie o biegunie ksztaltu zycia. */
export const KAFEL_M1: Record<string, [string, string]> = {
  CEN: ["Praca ma być ważną częścią życia", "Praca ma być tylko częścią życia"],
  GRA: ["Praca może wchodzić w wieczory", "Chcesz wyraźnej granicy"],
  GOD: ["Chcesz pracować dużo", "Chcesz pracować mniej"],
  TEMP: ["Chcesz szybko iść w górę", "Nie spieszy Ci się"],
  MIE: ["Chcesz wychodzić do pracy", "Chcesz móc pracować z domu"],
  ORG: ["Chcesz dużej firmy", "Chcesz małego zespołu"],
  KOR: ["Chcesz zostać w swoim regionie", "Chcesz móc się przenieść"],
  INW: ["Chcesz szybko zacząć zarabiać", "Możesz poczekać i się wykształcić"],
  POZ: ["Chcesz móc sobie pozwolić na dużo", "Wystarczy Ci, żeby nie brakowało"],
  LUD: ["Chcesz kiedyś prowadzić ludzi", "Chcesz odpowiadać za siebie"],
  WID: ["Nie przeszkadza Ci bycie widocznym", "Wolisz pracować w cieniu"],
  ROD: ["Chcesz rodziny stosunkowo wcześnie", "Rodzina może poczekać"],
};

/** Szescioslowne zdanie o wartosci. */
export const KAFEL_A4: Record<string, string> = {
  PIE: "Chcesz porządnie zarabiać",
  STA: "Chcesz pewności jutra",
  WOL: "Chcesz decydować o sobie",
  ROZ: "Chcesz się ciągle uczyć",
  WPL: "Chcesz, żeby Twoje decyzje coś zmieniały",
  SEN: "Chcesz, żeby praca komuś służyła",
  UZN: "Chcesz, żeby ktoś to zauważył",
  REL: "Chcesz ludzi, z którymi chce się być",
  CZA: "Chcesz mieć czas poza pracą",
  MIS: "Chcesz być w czymś naprawdę dobry",
  ZMI: "Chcesz, żeby ciągle coś się działo",
  ZAS: "Chcesz być w zgodzie ze sobą",
};

/**
 * Warunek ze stylu dzialania, ktory da sie sprawdzic kompetencja z A2.
 *
 * Uczestnik mowi „potrzebuje pracowac sam", a osobno wychodzi, ze nie ma ani
 * jednego dowodu, ze to potrafi. To nie jest sprzecznosc i nie wolno tego tak
 * nazwac: to pierwsza rzecz, ktora warto o sobie sprawdzic, bo od niej zalezy
 * sens calej drogi „na swoje".
 *
 * Kolejnosc listy jest kolejnoscia waznosci: pokazujemy najwyzej jedna.
 */
export const DOWOD_A3: Array<{
  wymiar: string;
  biegun: "A" | "B";
  kompetencja: number;
  zdanie: string;
}> = [
  {
    wymiar: "SAM",
    biegun: "A",
    kompetencja: 25,
    zdanie: "nikt Cię jeszcze nie zostawił z zadaniem na dwa tygodnie i nie sprawdzał",
  },
  {
    wymiar: "NAP",
    biegun: "A",
    kompetencja: 25,
    zdanie: "nie masz jeszcze sytuacji, w której nikt nie pilnował terminu, a Ty i tak zrobiłeś swoje",
  },
  {
    wymiar: "TEM",
    biegun: "B",
    kompetencja: 22,
    zdanie: "ciągnie Cię do dokładności mocniej, niż ją dziś masz",
  },
  {
    wymiar: "DEC",
    biegun: "A",
    kompetencja: 20,
    zdanie: "nie prowadziłeś jeszcze grupy na tyle długo, żeby wiedzieć, jak to znosisz",
  },
  {
    wymiar: "KON",
    biegun: "A",
    kompetencja: 18,
    zdanie: "mówienie wprost tak, żeby nikt nie stracił twarzy, to osobna umiejętność i jej jeszcze nie ćwiczyłeś",
  },
];

/**
 * Warunki pracy, na ktore wiekszosc ludzi sie nie godzi.
 *
 * Zgoda na nie jest realna przewaga na rynku: w tych zawodach brakuje ludzi
 * i dlatego placa wiecej. Uczestnik ma to uslyszec wprost, bo sam z siebie
 * przeczyta swoja zgode jako „no dobra, wytrzymam", a nie jako atut.
 *
 * To jest wybor, ktorych warunkow to dotyczy, a nie ich tresc: tresc stoi
 * w `data/tresc/warunki.json`, w polu `przewaga`. Tutaj tylko krotkie nazwy,
 * bo na ekranie stoja obok siebie jako plakietki.
 */
export const TRUDNE_A5: Record<string, string> = {
  F11: "weekendy",
  F12: "zmiany nocne",
  F13: "dyżury",
  F17: "praca fizyczna",
  F18: "dwór w każdą pogodę",
  F19: "cały dzień na nogach",
  F21: "brud",
  F24: "hałas",
  F25: "ciasne miejsca",
  F26: "wysokość",
  F27: "chemia",
  F34: "trudni ludzie",
  F38: "niskie zarobki na start",
};

export const TEKSTY_KONCOWE = {
  jakCzytac: [
    "Nie ma tu ocen. Nie ma liczb. Nie ma porównań z innymi.",
    "Jest to, co sam o sobie powiedziałeś przez cztery spotkania, tylko poukładane tak, żeby było widać, co z tego wynika.",
    "Czyta się to dziesięć minut. Możesz wrócić za rok i sprawdzić, co się zmieniło.",
  ],
  zdanieOZdaniu: "To zdanie powstało z siedmiu testów. Za rok możesz je zmienić. Dziś tak wygląda.",
  kropki:
    "Kropki pokazują, ile razy w życiu to się już potwierdziło. Trzy kropki to najmocniejszy dowód, jaki mamy, bo to nie Twoja opinia o sobie, a rzecz, która się naprawdę zdarzyła.",
  przewaga:
    "To Twoja przewaga i warto to wiedzieć. W takich zawodach brakuje ludzi i dlatego płacą więcej. Ty możesz w nie wejść, a większość Twoich kolegów nie.",
  miekkieNie: "Te rzeczy nie zamykają zawodów, tylko przesuwają je na koniec listy.",
  wetaOpis: "To usuwa zawody, które tego wymagają.",
  wetaZostaje:
    "Ale nie usuwa całego obszaru. Zostają w nim zawody, które tego nie wymagają.",
  sciezkiWstep: [
    "To nie ranking. Żadna z tych ścieżek nie jest lepsza.",
    "Przy każdej jest to samo: dlaczego pasuje do Ciebie, jakie są w niej zawody, ile trzeba się uczyć i czy da się bez studiów.",
  ],
  bezStudiow: "Da się bez studiów",
  czegoNieBrac:
    "To nie znaczy, że byś nie dał rady. Znaczy, że łamie coś, na czym Ci zależy, i po roku byś z tego uciekł.",
  coDalej: [
    "Ten raport kończy się tutaj i to jest celowe.",
    "Nie napiszemy Ci, co masz zrobić, bo nie znamy Twojego domu, Twoich pieniędzy ani tego, co Ci się nagle odmieni.",
    "Trzy ostatnie rzeczy wypełniasz razem z prowadzącym, na rozmowie tylko we dwoje.",
  ],
  jednoPytanie:
    "Przyjdź na rozmowę z jednym pytaniem, na które ten raport nie odpowiedział. Takie pytanie zawsze jest. I zwykle jest najważniejsze.",
  naKoniec: [
    {
      tytul: "Nie musisz dziś wybierać",
      tresc:
        "Wszystkie ścieżki z tego raportu zaczynają się od tego samego kroku. To jedna decyzja zamiast ośmiu.",
    },
    {
      tytul: "Nic tu nie jest zamknięte na zawsze",
      tresc:
        "Ludzie zmieniają się najbardziej między siedemnastym a dwudziestym piątym rokiem życia. Jeśli za dwa lata to przeczytasz i pomyślisz „to już nie ja”, to dobrze. Znaczy, że coś się działo.",
    },
    {
      tytul: "Ten raport jest Twój",
      tresc:
        "Nie szkoły, nie rodziców, nie naszej fundacji. Możesz go pokazać, komu chcesz, albo nikomu.",
    },
  ],
} as const;
