/**
 * Jednym zdaniem o każdej części, językiem uczestnika.
 *
 * Trzy długości, bo trzy różne miejsca: pełne zdanie na liście modułów, hasło
 * na kafelku podróży i końcówka zdania „Dziś odkrywasz…" na stronie głównej.
 * Wszystkie w jednym pliku, żeby nie rozjechały się przy pierwszej redakcji.
 */

/** Po co jest ta część. Pełne zdanie, na listę modułów. */
export const PO_CO: Record<string, string> = {
  A0: "Kilka podstawowych informacji o Twojej sytuacji: gdzie jesteś, co Ci idzie, na co masz przestrzeń.",
  A1: "Co Cię realnie ciągnie. Nie deklaracje, tylko wybory między konkretnymi zajęciami.",
  A3: "Jak naturalnie działasz: sam czy z ludźmi, z planem czy w biegu, cisza czy ruch.",
  A2: "W czym możesz być dobry. Osobno od tego, co lubisz, bo to nie zawsze to samo.",
  A4: "Czego potrzebujesz od pracy, żeby miała dla Ciebie sens.",
  M1: "Jakiego życia chcesz. Jedyna część, w której piszesz własnymi słowami.",
  A5: "Warunki pracy, które są nie do pogodzenia z tym, jak chcesz żyć.",
};

/** Hasło na kafelek: trzy, cztery słowa, bez kropki. */
export const KROTKO: Record<string, string> = {
  A0: "Twoja sytuacja i możliwości",
  A1: "Co Cię ciekawi w praktyce",
  A3: "Twój styl działania",
  A2: "Twoje naturalne predyspozycje",
  A4: "Twoje wartości w praktyce",
  M1: "Jakiego życia naprawdę chcesz",
  A5: "Warunki, które akceptujesz",
};

/** Końcówka zdania „Dziś odkrywasz…" na stronie głównej. */
export const DZIS_ODKRYWASZ: Record<string, string> = {
  A0: "od czego zaczynasz.",
  A1: "co naprawdę Cię ciągnie.",
  A3: "jak naturalnie działasz.",
  A2: "w czym możesz być dobry.",
  A4: "co jest dla Ciebie ważne.",
  M1: "jakiego życia chcesz.",
  A5: "na co się zgadzasz, a na co nie.",
};

/**
 * Dopisek na marginesie ekranu pytania. Ozdoba, nigdy nośnik treści: obok
 * zawsze stoi pełne pytanie. Bez ocen i bez „świetnie Ci idzie".
 */
export const DOPISEK: Record<string, string> = {
  A0: "Od tego zaczynamy.",
  A1: "Pierwszy odruch\nzwykle ma rację.",
  A3: "Twój styl\nma moc.",
  A2: "Bez oceniania.\nTylko szczerze.",
  A4: "Wybierz,\nnie oceniaj.",
  M1: "To Twoje życie.",
  A5: "Szczerość\nsię opłaca.",
};

/**
 * Jedno zdanie pod pytaniem: przypomnienie zasady tego typu ekranu.
 * Stwierdzenie, nie zachęta.
 */
export const WSKAZOWKA: Record<string, string> = {
  ranking4:
    "Każdemu zadaniu przypisz miejsce od 1 do 4. Każde miejsce możesz użyć tylko raz, więc kliknięcie zajętego numeru zamienia zadania miejscami. Ostatni numer dopisuje się sam.",
  para: "Jedno pytanie naraz. Wybieraj intuicyjnie, nie ma dobrych ani złych odpowiedzi.",
  pojedynczy: "Wybierz jedną odpowiedź, tę najbliższą prawdy o Tobie dzisiaj.",
  wielokrotny: "Możesz zaznaczyć kilka. Liczy się to, co jest prawdą, nie to, co dobrze brzmi.",
  trzystopniowa: "„Zależy” jest pełnoprawną odpowiedzią, nie unikiem.",
};

/**
 * Zdanie pod pytaniem na ekranie wyboru. Powtarza zasadę modułu z instrukcji,
 * bo instrukcję czyta się raz, a pytań jest trzydzieści sześć.
 */
export const PODTYTUL: Record<string, string> = {
  A0: "Kilka informacji o Twojej sytuacji. Bez oceniania.",
  A1: "Nie pytamy, czy Ci to wyjdzie. Pytamy, czy chciałbyś to robić.",
  A3: "Nie ma dobrych ani złych odpowiedzi. Liczy się to, co jest najbliżej Ciebie.",
  A2: "Nie pytamy, czy to lubisz. Pytamy, co poszłoby Ci najlepiej.",
  A4: "Obie odpowiedzi są dobre. Wybierz tę, która bardziej do Ciebie pasuje.",
  M1: "Nie o pracy, tylko o życiu. Pytamy o to, czego chcesz.",
  A5: "Nie pytamy, czy to wytrzymasz. Pytamy, jak byś to zniósł.",
};
