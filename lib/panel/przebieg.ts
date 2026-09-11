/**
 * Przebieg sesji indywidualnej, rozdziały 3 i 4 `sesja_indywidualna_i_panel.md`.
 *
 * Treść jest przepisana z dokumentu, nie streszczona: prowadzący czyta to na
 * żywo w trakcie rozmowy. Skracanie skryptu psułoby jedyną rzecz, po którą
 * się do niego sięga.
 */

export interface EtapSesji {
  minuty: string;
  tytul: string;
  cel?: string;
  pytania: string[];
  uwagi: string[];
}

export const PRZEBIEG: EtapSesji[] = [
  {
    minuty: "0–6",
    tytul: "Otwarcie",
    cel: "Dowiedzieć się, co uczestnik realnie zapamiętał. To zwykle nie jest to, co system uznał za najważniejsze.",
    pytania: [
      "Zanim wejdziemy w wyniki: co z tego wszystkiego zostało Ci w głowie przez ten tydzień?",
      "Zapisałeś pytanie. Zaczniemy od niego czy zostawiamy na koniec?",
    ],
    uwagi: ["Nie od wyników. Od uczestnika.", "Uczestnik decyduje. To ustawia całą sesję jako jego."],
  },
  {
    minuty: "6–14",
    tytul: "Najważniejsze wnioski",
    cel: "Trzy do czterech zdań syntezy, której uczestnik sam nie ułoży. Nie odczytywanie raportu.",
    pytania: [],
    uwagi: [
      "Wzór: „Widzę trzy rzeczy. Po pierwsze… Po drugie… Po trzecie…”",
      "Potem cisza. Czekasz na reakcję.",
    ],
  },
  {
    minuty: "14–28",
    tytul: "Trzy drogi",
    cel: "Pytanie o odrzucenie zawęża pole szybciej niż jakiekolwiek inne.",
    pytania: [
      "Patrząc na te trzy drogi: która z nich najbardziej Cię odpycha?",
      "A która najbardziej Cię ciekawi? Nie która jest najrozsądniejsza. Która ciekawi.",
    ],
    uwagi: ["Nie korygujesz odpowiedzi. Zapisujesz."],
  },
  {
    minuty: "28–40",
    tytul: "Rozjazdy i sprzeczności",
    cel: "Sedno sesji. Po dwie, trzy minuty na każdy rozjazd z prawej kolumny.",
    pytania: [
      "System pokazał Ci X wysoko, a Ty zaznaczyłeś NIE DLA MNIE. Co Cię tam odrzuca?",
      "Które z tych dwóch jest twardsze?",
    ],
    uwagi: [
      "„Nie wiedziałem, że to tak wygląda” — wyobrażenie, nie decyzja. Otwórzcie kartę i przeczytajcie konkretną sekcję.",
      "„Znam kogoś, kto to robi i to koszmar” — jedno źródło, uogólnione. To jedna osoba i jedno miejsce pracy.",
      "„Po prostu nie chcę” — decyzja. Przyjąć bez drążenia: „Dobrze. Wykreślamy”.",
      "Ostrzeżenie antyprofilowe wprowadzasz miękko: „Nie mówię, żebyś rezygnował. Mówię, żebyś to sprawdził, zanim zainwestujesz w to pięć lat”.",
    ],
  },
  {
    minuty: "40–50",
    tytul: "Zawężenie i sprawdzenie",
    cel: "Jedna droga na najbliższe dwa lata, nie na zawsze.",
    pytania: [
      "Gdybyś musiał dziś wybrać jedną z tych trzech na najbliższe dwa lata, nie na zawsze, to która?",
      "Dobrze. To co musiałbyś sprawdzić, żeby móc wybrać?",
      "Co musi się wydarzyć, żeby ta droga była możliwa? Wymień wszystko, także rzeczy niezależne od Ciebie.",
    ],
    uwagi: [
      "Jeśli droga A zawiera klaster, przeczytaj pytanie rozstrzygające z prawej kolumny.",
      "Pytanie o warunki ujawnia bariery, o których uczestnik dotąd nie mówił.",
    ],
  },
  {
    minuty: "50–58",
    tytul: "Rekomendacja i pierwszy krok",
    cel: "Rekomendację formułuje uczestnik, nie prowadzący.",
    pytania: ["Powiedz to własnymi słowami. Jak dziś wygląda Twoja decyzja?"],
    uwagi: [
      "Zapisujesz dosłownie, słowami uczestnika.",
      "Pierwszy krok musi mieć datę, liczbę i czasownik.",
      "Źle: „popytam ludzi o ten zawód”. Dobrze: „napiszę do dwóch osób z tego zawodu z trzema pytaniami”.",
    ],
  },
  {
    minuty: "58–60",
    tytul: "Zamknięcie",
    pytania: [],
    uwagi: [
      "„Raport zostaje Twój. Za pół roku będzie wyglądał inaczej, niż wygląda dziś, i to jest w porządku. Wróć do niego, gdy coś się zmieni.”",
    ],
  },
];

export interface SytuacjaTrudna {
  sytuacja: string;
  skrypt: string;
}

export const SYTUACJE_TRUDNE: SytuacjaTrudna[] = [
  {
    sytuacja: "„Nadal nie wiem, co robić”",
    skrypt:
      "To jest uczciwa odpowiedź i wcale nie znaczy, że program nie zadziałał. Wiesz teraz znacznie więcej niż na początku, w szczególności czego nie chcesz. Ustalmy jedną rzecz do sprawdzenia w tym miesiącu i to wystarczy.",
  },
  {
    sytuacja: "„Rodzice chcą, żebym poszedł na X”",
    skrypt:
      "Co Ty o tym myślisz? I osobno: co oni widzą, czego Ty nie widzisz? Czasem rodzice mają rację co do obserwacji, a mylą się co do wniosku. Nie stajesz po żadnej stronie.",
  },
  {
    sytuacja: "„Mój wynik jest bez sensu”",
    skrypt:
      "Sprawdźmy, gdzie się rozjechało. Otwórzcie konkretną sekcję i przejdźcie odpowiedź po odpowiedzi. Zwykle wychodzi jeden moduł wypełniony pobieżnie. Jeśli wina jest po stronie systemu, powiedz to wprost.",
  },
  {
    sytuacja: "„Chcę być [zawód spoza wyniku]”",
    skrypt:
      "Sprawdź w sekcji odpadłych, czy zawód odpadł przez weto. Jeśli tak: „Odpadł, bo wykluczyłeś Y. Czy to weto jest naprawdę twarde?”. Jeśli nie: dopisz go korektą i omówcie kartę. Uczestnik zawsze ma prawo do zawodu spoza listy.",
  },
  {
    sytuacja: "Ujawnienie trudnej sytuacji osobistej",
    skrypt:
      "Przyjąć, nie drążyć, nie diagnozować. „Dziękuję, że mi to powiedziałeś. To zmienia obraz. Czy jest ktoś, z kim o tym rozmawiasz?”. W razie potrzeby przekaż kontakt do wsparcia. Nie kontynuuj sesji zawodowej na siłę.",
  },
  {
    sytuacja: "Uczestnik milczy przez większość sesji",
    skrypt: "Przejdź na pytania zamknięte i wybory. „Powiem trzy rzeczy, a Ty powiesz, która jest najbliżej prawdy”.",
  },
  {
    sytuacja: "Uczestnik chce, żeby prowadzący zdecydował",
    skrypt:
      "Nie zrobię tego i to nie jest wykręt. Gdybym wybrał za Ciebie, przy pierwszym trudnym semestrze uznałbyś, że to nie był Twój wybór, i miałbyś rację.",
  },
];
