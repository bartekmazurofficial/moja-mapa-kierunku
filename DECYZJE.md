# Decyzje podjęte przy budowie, spoza specyfikacji

Ten plik zawiera wyłącznie miejsca, w których aplikacja musiała rozstrzygnąć
coś, czego dokumentacja nie rozstrzyga, oraz rozbieżności znalezione w samej
dokumentacji. Wszystko inne jest przepisaniem specyfikacji.

---

## Zatwierdzone przed budową

Odpowiedzi z `ODPOWIEDZI_dla_claude_code.md`, wiążące:

| # | Rozstrzygnięcie |
|---|---|
| 1 | Harmonogram odsłaniania według scenariuszy, nie tabeli z polecenia. Dane w tabeli `odslony` per grupa |
| 2 | A0 na początku spotkania 1; spotkanie 3 odwrócone (wizja → wartości → filtry); ranking umiejętności zostaje, dochodzi pomiar korelacji z A2 |
| 3 | Progi wyprowadzania profilu z limitem górnym: A1 > 60 maks. 6, A2 > 60 maks. 8, A3 siła > 65 maks. 5, A5 wszystkie NIE |
| 4 | Antyprofil kodowany tylko tam, gdzie odwzorowanie jest jednoznaczne; reszta nieaktywna, lista do uzupełnienia po stronie fundacji |
| 5 | Kod `dzwiek` dodany do słownika A1, trzy zawody muzyczne poprawione (zrobione po stronie danych) |
| 6 | Martwe kody A5 zostają nieaktywne, lista w raporcie z fazy 2 |
| 7 | Klaster: wynik = najwyższy ze składu; gwarancje liczone przez skład; przy jednym zawodzie powyżej progu pokazujemy pojedynczy zawód, bez nazwy zbiorczej |
| 8 | PDF przez `@react-pdf/renderer`, wymóg: poprawne polskie znaki |
| 9 | Jedno konto prowadzącego, hasło ze zmiennej środowiskowej; kod dostępu uczestnika losowy i niewyliczalny |
| 10 | Jedenaście tabel, w tym `grupy` |

---

## Faza 1

### D1. Dwunasta tabela: `postep_modulu`

Nie było jej na liście. Dodana, bo trzy wymagania jej wymagają i nie da się ich
spełnić inaczej: dokończenie przerwanego modułu, pomiar czasu wypełniania oraz
utrwalenie losowej kolejności bloków, która według specyfikacji A1 i A2 ma być
losowana raz na uczestnika, a nie przy każdym wejściu na ekran.

### D2. Pola listowe jako JSON w kolumnie `String`

SQLite nie ma typu tablicowego. Rozpakowanie jest w jednym miejscu
(`lib/db/json.ts`, `lib/db/repozytorium.ts`), więc przejście na PostgreSQL to
zamiana typu kolumny na `Json`, bez dotykania kodu domenowego.

### D3. Macierz sąsiedztwa liczona, nie wpisana

Dokument obszarów mówi, że macierz jest „miarą kosinusową na połączonym
wektorze zainteresowań i kompetencji" i „aktualizuje się automatycznie przy
każdej zmianie profilu". Pełnej macierzy nie ma w paczce, są tylko trzy
najbliższe sąsiedztwa przy każdym obszarze, czyli 81 wartości. Parser liczy
całość.

**Żadna wersja wzoru nie odtwarza tych 81 wartości dokładnie.** Sprawdzone:

| Wariant | Średnie odchylenie | Trafień co do setnej |
|---|---|---|
| wektor połączony A1+A2 (zapis dosłowny) | 0,017 | 10/81 |
| średnia dwóch kosinusów, A1 i A2 osobno | 0,007 | 39/81 |
| z dołożonym A4 albo A5 | 0,021–0,025 | 15–16/81 |

Wybrany jest **wektor połączony**, bo tak brzmi zapis w dokumencie i bo
odtwarza podane tam statystyki zbiorcze (średnia 0,171 wobec 0,17, maksimum
0,779 wobec 0,79; wariant uśredniony daje 0,167 i 0,800).

Konsekwencja jest wąska: macierz wpływa wyłącznie na wybór Drogi C
i na flagę „ten sam świat", nigdy na punktację. Jedno miejsce warte uwagi to
para zdrowie–medycyna, w dokumencie 0,60, czyli dokładnie na progu flagi;
policzona wychodzi 0,56, więc flaga tam nie zapali się.

**Do rozstrzygnięcia:** czy zostajemy przy zapisie dosłownym, czy przechodzimy
na wariant lepiej pasujący do opublikowanych liczb.

### D3a. Przebieg na sucho warstwy pierwszej odtworzony

Odtworzona z prozy baza obszarów została sprawdzona prototypem warstwy
pierwszej na trzech profilach kontrolnych z rozdziału 14 `warstwa1_obszary.md`.
**Wszystkie wyniki punktowe zgadzają się co do dziesiątej części punktu:**

| Profil | Uzyskane | W dokumencie |
|---|---|---|
| rzemieślnik 17 | 104,1 · 56,4 · 54,4 · 47,1 | 104,1 · 56,4 · 54,4 · 47,1 |
| społeczna 19 | 95,8 · 83,1 · 77,6 · 68,3 | 95,8 · 83,1 · 77,6 · 68,3 |
| analityk 22 | 108,0 · 99,1 · 66,5 · 66,2 | 108,0 · 99,1 · 66,5 · 66,2 |

Zgadzają się też poziomy wejścia, usunięcia przez weto, kolejność trzech dróg
i flagi. Różnią się wyłącznie podobieństwa, zgodnie z D3.

To jest najmocniejszy dowód, że parser odczytał bazę obszarów poprawnie: wynik
zależy od wszystkich wag jednocześnie i pomyłka w jednej z nich rozjechałaby
liczby.

Uwaga na marginesie: dokument pisze przy profilu rzemieślniczym „usuniętych
6 obszarów, cztery przez weto na wystąpienia". Usuniętych jest sześć, ale
przez weto pięć, nie cztery. Suma się zgadza, rozpiska nie.

### D4. Poziom wejścia a wymóg studiów

Kolumna „Studia" w tabelach poziomów ma 17 różnych wartości, w tym
„zwykle tak", „tak + aplikacja", „nie, technikum", „zależy od roli".
Zachowana reguła z prototypu warstwy pierwszej: poziom wymaga studiów tylko
wtedy, gdy opis **zaczyna się** od „tak". „Zwykle tak" nie zamyka poziomu
osobie, która nie idzie na studia. Pełny opis zostaje w danych.

### D5. `Zapamiętywanie` jako alias

Dokument obszarów skraca nazwę kompetencji nr 7 („Zapamiętywanie
i przywoływanie") do „Zapamiętywanie". Alias w `scripts/mapowanie-obszarow.ts`.

### D6. Dziewięć fraz środowiskowych bez wymiaru A3

Dokument obszarów opisuje środowisko pracy 45 frazami, z których 36
odwzorowuje się na 12 wymiarów modułu A3. Dziewięć nie ma odpowiednika:
warianty „widoczny efekt", „natychmiastowy efekt", „trwały efekt pracy"
i „możliwość pracy zdalnej". W module A3 nie ma takiego wymiaru.

Frazy zostają w danych jako tekst i trafią do wyjaśnień w raporcie, ale nie są
porównywane z wynikiem A3. Środowisko obszaru zasila w warstwie pierwszej
wyłącznie etap 7, czyli wyjaśnienia, a nie punktację, więc nie zmienia to
żadnego wyniku.

---

## Rozbieżności w dokumentacji, do rozstrzygnięcia

### R1. Wariant na własny rachunek: 14 obszarów czy 17

Rozdział 3 dokumentu obszarów wymienia w prozie **17 obszarów** z realnym
wariantem własnej firmy, w tym budownictwo, transport i inżynierię, i podaje
właściciela firmy budowlanej jako sztandarowy przykład całego rozróżnienia.

Adnotacja **„Wariant na własny rachunek: realny"** stoi natomiast przy
**14 obszarach** — i brakuje jej dokładnie przy budownictwie (12), transporcie
(14) i inżynierii (10).

Ma to znaczenie dla etapu H warstwy drugiej, gdzie obszar 27 jest parowany
z „najwyżej punktowanym obszarem branżowym uczestnika". Przy profilu
technicznym różnica decyduje, czy przedsiębiorczość w ogóle się z czymś
sparuje.

Parser jest na razie wierny adnotacji (14 obszarów). **Proponuję sumę obu
list, czyli 17**, bo lista z rozdziału 3 jest jawną decyzją, a adnotacja
wygląda na pominięcie. Do potwierdzenia przed fazą 2.

### R2. Rozdzielczość systemu: 129, nie 133

Audyty podają 133 pozycje rozróżnialne. Liczba pochodzi z wcześniejszej wersji
bazy (152 zawody, 20 klastrów). Przy obecnych 157 zawodach i 26 klastrach
obejmujących 54 zawody wychodzi **157 − 54 + 26 = 129**. Test w `tests/dane.test.ts`
sprawdza 129.

### R3. Liczby w specyfikacji warstwy trzeciej

`warstwa3_kierunki.md` mówi o 68 kierunkach i 20 drogach bez studiów. W danych
jest 75 i 56. Implementacja idzie za danymi.


---

## Zatwierdzone po fazie 1

| # | Rozstrzygnięcie |
|---|---|
| 1 | Macierz sąsiedztwa: **wariant uśredniony**, statystyki zbiorcze poprawione na 0,167 i 0,800 |
| 1b | Próg flagi „ten sam świat" zostaje **0,60** |
| 2 | Wariant na własny rachunek: **17 obszarów**, suma obu list |
| 3 | `postep_modulu` zatwierdzona, plus znaczniki czasu per blok |
| 4 | Przy rozjeździe prozy z liczbami **wygrywają liczby**; zgłaszać, ale nie blokować się |

---

## Faza 2

### D7. Macierz sąsiedztwa: wariant uśredniony

Podobieństwo obszarów to teraz średnia dwóch kosinusów, liczonych osobno dla
wektora zainteresowań i wektora kompetencji. Statystyki zbiorcze poprawione
w `obszary_27_opis.md` i w przebiegu na sucho w `warstwa1_obszary.md`.

**Skutek uboczny, o który pytałeś:** para medycyna–rehabilitacja wychodzi
teraz **0,62**, czyli powyżej progu. Problem, który miał wymusić obniżenie
progu, zniknął przy zmianie wzoru. Próg zostaje 0,60.

### D8. Droga C: próg absolutny 42 punktów

Specyfikacja mówi „wynik ≥ 0,40 × wynik(A) **oraz** ≥ 42 punktów".
Prototyp `silnik.py` implementuje tylko pierwszy warunek.

Różnica ujawnia się dokładnie na profilu społecznym: administracja ma
**40,6 punktu**, czyli mieści się w progu względnym (38,3), ale nie w progu
absolutnym. Prototyp pokazywał ją jako Drogę C, mimo że 40,6 to pasmo
antydopasowania.

Przyjęta specyfikacja: **alternatywa nie może być antydopasowaniem.**
Droga C profilu społecznego zmienia się z administracji na zdrowie
i rehabilitację. Liczba stoi w `config.ts` jako `PROG_DROGI_C_ABSOLUTNY`;
ustawienie 0 przywraca zachowanie prototypu.

Koszt tej decyzji jest realny i wart nazwania: przy tym profilu wszyscy
kandydaci powyżej 42 punktów są z tego samego świata ludzi, więc Droga C
jest mniej odmienna, niż była u prototypu. Zysk: nie proponujemy jako
alternatywy czegoś, co według własnych pasm systemu do uczestnika nie pasuje.

### D9. Zaokrąglanie przed normalizacją

Prototyp warstwy drugiej zaokrągla wynik surowy do jednego miejsca **przed**
normalizacją i dopiero potem dzieli przez najlepszy. Odtworzone dokładnie,
razem z zaokrąglaniem bankierskim Pythona. Bez tego opublikowane liczby
przebiegu na sucho rozjeżdżają się o jedną dziesiątą (fryzjer 72,5 zamiast
72,4, wsparcie techniczne 59,4 zamiast 59,5).

### D10. Antyprofil: zasada wyprowadzania i podział 34/26

Przyjęta zasada: **antyprofil wynika wyłącznie z tego, co uczestnik
zadeklarował jako granicę albo preferencję** — z warunków kluczowych A3,
wartości A4, odpowiedzi A5, twardych parametrów M1 i faktów z A0. Nigdy
z zainteresowań A1 ani z samooceny kompetencji A2.

Powód: zdanie „Twoje odpowiedzi sugerują, że to może być dla Ciebie
trudniejsze" oparte na samoocenie siedemnastolatka byłoby dokładnie tym,
przed czym ostrzega cały moduł A2.

Wynik: **34 kody aktywne, 26 nieaktywnych.** Pełna lista z uzasadnieniami:
`npx tsx scripts/raport-luk.ts`.

### D11. Kierunek nie może wyjść wyżej niż najlepszy zawód

Test K-1 wymaga tego wprost, a wzmocnienie za mocny przedmiot (do 15%)
potrafiło ten warunek złamać. Wynik kierunku jest teraz ograniczany z góry
przez najlepszy zawód, do którego kierunek prowadzi.

### D12. Zawody z zawetowanego obszaru trafiają na listę prowadzącego

Kiedy warstwa pierwsza usunie cały obszar przez weto, jego zawody nie
docierają do warstwy drugiej. Bez dodatkowego przepływu informacji
pielęgniarka znikałaby po cichu i prowadzący nie miałby o czym rozmawiać na
sesji. Warstwa druga dostaje teraz listę usunięć z warstwy pierwszej i
zapisuje takie zawody jako usunięte wetem.

### D13. Każda droga dostaje dwa do czterech zawodów, bez progu pokazania

Przy wąskim profilu po normalizacji tylko zawody z Drogi A przekraczają
próg 55 i Drogi B oraz C zostawały puste. Zawody dróg są teraz brane
z rankingu obszaru bez progu — pasmo opisowe i tak mówi uczciwie, jak mocne
jest dopasowanie.

### D14. Zasoby z A0: cztery odpowiedzi na trzy kategorie

`realne` → dobre, `raty` → ograniczone, `bardzo_trudne` i `nierealne` → brak.
„Bardzo trudne, musiałbym zarobić na to sam" traktujemy jak brak zasobów:
to jest sytuacja, w której bariera jest realna, a nie kwestia rozłożenia na raty.

### D15. Etapy przedmaturalne w filtrze rekrutacyjnym

Klasa maturalna liczy się jako **przedmaturalna**: matura jeszcze nie padła,
więc brak przedmiotu jest informacją, nie faktem. Usunięcie kierunku
następuje dopiero od etapu „po maturze".

Kierunek ścisły w regule o matematyce: typ techniczny albo wymagany przedmiot
z zestawu matematyka, fizyka, informatyka, chemia.

### D16. Mianownik w etapie K1

`liczba_zawodów_ważona` nie jest w specyfikacji zdefiniowana. Przyjęte:
liczba zawodów bezpośrednich razy 1,0 plus liczba pośrednich razy 0,4, czyli
średnia ważona wyników zawodów. Zawód usunięty w warstwie drugiej liczy się
jako zero, ale zostaje w mianowniku — inaczej kierunek prowadzący głównie do
zawodów zawetowanych wychodziłby wysoko na resztce.

### D17. Profile kontrolne warstwy drugiej chodzą na prototypowym podzbiorze

Przebieg na sucho z rozdziału 4 powstał na 24 zawodach zakodowanych ręcznie
w `silnik_zawodowy.py`, które różnią się od pełnej bazy. Te 24 zawody są
przepisane jako fixture i tylko na nich sprawdzamy opublikowane liczby.
Testy na pełnej bazie 157 zawodów są osobne i sprawdzają warunki, nie cyfry.

Jedna poprawka w fixture: prototyp używał innego słownika zagrożenia
(`niski`) niż baza (`niskie`). Wartości przełożone na słownik bazy, inaczej
tie-breaker nie działałby na danych prototypu.

---

## Luki w rozdzielczości, do rozstrzygnięcia po fazie 2

Pełne listy z liczbami: `npx tsx scripts/raport-luk.ts`.

### R4. Dwanaście wymogów gotowości z kart nie ma pozycji w module A5

`halas` (14 zawodów), `umieranie` (11), `agresja` (8), `powtarzalnosc` (8),
`chemikalia` (6), `goraco` (6), `wieczory` (4), `ciasnota` (2), `wysokosc` (1),
`zimno` (0). Łącznie 60 wystąpień w kartach, których uczestnik nigdy nie może
ani zawetować, ani odrzucić.

### R5. Dwa wymiary modułu A3 nie mają odpowiednika w kartach

`NAP` (napęd własny kontra zewnętrzny) i `RYT` (równe tempo kontra zrywy).
Odwrotnie: `efekt_widoczny` z kart (15 zawodów) nie jest wymiarem A3.
Skutek: składowa A3 mnożnika kartowego pracuje na dziesięciu wymiarach
z dwunastu.


---

## Zatwierdzone po fazie 2

| # | Rozstrzygnięcie |
|---|---|
| 1 | Droga C: **próg absolutny 42 zostaje**, plus komunikat, gdy trzy drogi są z jednej grupy obszarów |
| 2 | **`MAX_KARA_REKRUTACYJNA = 0,40`** jako sufit łącznej kary z etapów K2 i K3 |
| 3 | Składowa A3 zostaje na dziesięciu wymiarach z dwunastu — do poprawy przy redakcji kart, nie blokuje pilotażu |
| 4 | Mianownik K1 przyjęty w całości; kierunek, którego wszystkie zawody odpadły przez weto, **znika** |
| — | Zasada wyprowadzania antyprofilu zatwierdzona wprost |
| — | Moduł A5 zostanie rozszerzony o siedem pozycji; do tego czasu kody nieaktywne |

### D18. Rysunek nie jest rozszerzeniem maturalnym

Cztery kierunki (architektura, architektura wnętrz, grafika, wzornictwo) mają
`rysunek` wśród przedmiotów wymaganych. To jest egzamin wstępny, a nie
rozszerzenie, którego uczestnik może nie mieć „w planach". Bez wyjątku etap K2
usuwałby te cztery kierunki każdemu po maturze.

Rysunek jest więc wyłączony z reguły o brakującym przedmiocie i zamiast tego
dopina ostrzeżenie: „Na ten kierunek jest egzamin z rysunku. To osobna rzecz
od matury i trzeba się do niej przygotować z wyprzedzeniem."

---

## Faza 3

### D19. Treść pozycji wyciągnięta z dokumentów, nie przepisana ręcznie

144 pozycje A1, 180 pozycji A2, 60 par A3, 36 par A4, 48 par M1 i 32 pozycje A5
zostały wyciągnięte z dokumentów źródłowych skryptem i zapisane w `lib/content/`.
Skrypt sprawdzał przy okazji bilans planów: każdy obszar dokładnie sześć razy,
brak powtórzonej pary, maksymalnie jedna pozycja o podwyższonej atrakcyjności
na blok. Te same warunki są teraz testami.

### D20. Jeden komponent pozycji, dziesięć typów

`components/Pozycja.tsx` obsługuje: ranking czterech, parę dwubiegunową, skalę
1–5, kotwicę ze skalą i pytaniem o doświadczenie, skalę TAK/MOŻE/NIE, wybór
pojedynczy, wybór wielokrotny z limitem, dowody, pole tekstowe i zestaw pól.

Reguła „brak możliwości przewijania do przodu przed odpowiedzią" żyje osobno,
w `lib/moduly/walidacja.ts`, bo to jest wymaganie programu, nie zachowanie
widoku, i ma własne testy.

### D21. Plan losowy utrwalany w bazie

Kolejność bloków, kolejność opcji w bloku i strona wyświetlania każdej pary są
losowane raz i zapisywane w `postep_modulu.kolejnosc`. Uczestnik, który
przerwie moduł i wróci, dostaje tę samą kolejność.

### D22. Marker zamknięcia części

Części złożone z samych pól nieobowiązkowych (dowody w A2, zdania w A5, wizja
życia w M1) nie dają się odróżnić od nierozpoczętych po samej liczbie
odpowiedzi. Zamknięcie części zapisujemy więc jawnie, jako pozycję
`__zakonczono`.

### D23. Części zależne budowane na serwerze

Kotwice A3 zależą od bieguna, który wyszedł w części A. Test kosztu A4 zależy
od najwyższej wartości. Ekran wet A5 pokazuje wyłącznie pozycje z odpowiedzią
NIE. Szkice w M1 powstają z części A i z warunków środowiskowych z A3.
Te części są budowane dopiero wtedy, gdy uczestnik do nich dojdzie.

### D24. Kontrast sprawdzany testem, nie okiem

Pierwsza wersja koloru podpisów miała 3,5:1, czyli poniżej wymaganych 4,5:1.
Po poprawce wszystkie jedenaście par kolorów interfejsu przechodzi próg,
a `tests/dostepnosc.test.ts` pilnuje, żeby tak zostało.

### D25. Dwa kroje, oba z pełnym zestawem polskich znaków

Source Serif 4 do treści czytelniczej i nagłówków, Inter do interfejsu.
Pobierane przy budowaniu przez `next/font` i serwowane z własnego serwera —
w czasie działania aplikacja nie odpytuje żadnej zewnętrznej usługi.
Sprawdzone na tekstach z kart zawodów, nie na „Lorem ipsum".


---

## Zatwierdzone po fazie 3

| # | Rozstrzygnięcie |
|---|---|
| 1 | Teksty z dokumentacji to materiał źródłowy, nie gotowa treść interfejsu. **Instrukcje skracać, komunikaty o znaczeniu zostawiać w pełnym brzmieniu** |
| 2 | Siedem nowych szkiców w M1, pokazywanych **po** wypełnieniu obszaru, nigdy przed |
| 3 | Kotwice A1 zostają na jednym ekranie, pogrupowane wizualnie po pięć, bez nazw grup |
| 4 | Prowadzący otwiera moduły tak samo jak warstwy raportu — faza 5 |
| 5 | `warsztat` wśród przedmiotów mocnych daje wzmocnienie do 10% dla obszarów 10, 12 i 13 |

### L1. Luka wykryta podczas budowy: nic nie blokowało modułów w czasie

To nie jest decyzja projektowa, tylko dziura w specyfikacji, znaleziona przy
składaniu fazy trzeciej.

Specyfikacja A2 wymaga wprost, żeby uczestnik nie widział wyniku A1 przed
wypełnieniem A2, bo oceni własne kompetencje pod to, co przed chwilą
przeczytał. Reguły odsłaniania z dokumentacji dotyczyły jednak wyłącznie
raportu. Nic nie stało na przeszkodzie, żeby uczestnik wszedł pierwszego dnia
i wypełnił wszystkie siedem modułów — a to zanieczyściłoby najważniejszy
pomiar w całym programie.

Rozwiązanie: moduły otwiera prowadzący, tym samym mechanizmem co warstwy
raportu. Otwarte zostaje otwarte, żeby dało się dokończyć przerwany moduł.
Moduł nieotwarty jest niedostępny także pod bezpośrednim adresem.
Do zbudowania w fazie piątej.

### D26. Szkice w M1: dwa miejsca, gdzie nie dało się utrzymać oryginalnej treści

Dwa sloty w przekazanych tekstach nie mają źródła w żadnym module.

**Obszar 1**, „chcesz mieszkać {w dużym mieście / w mniejszym mieście / na
wsi}": wielkość miejscowości, w której uczestnik chce mieszkać, nie jest
mierzona. A0 zbiera, gdzie mieszka teraz, a to nie to samo. Slot usunięty,
zdanie oparte na `KOR` i na gotowości do przeprowadzki z A5.

**Obszar 3**, „dzień zaczyna się {wcześnie / raczej później}": godzina
rozpoczęcia pracy nie jest mierzona przez żaden moduł. Slot usunięty, zdanie
oparte na `GOD` i `GRA`.

Pozostałe pięć szkiców odtwarza przekazane brzmienie w całości.

---

## Faza 4

### D27. Odsłanianie egzekwowane przez niebudowanie, nie przez ukrywanie

`lib/raport/budowa.ts` dostaje zbiór identyfikatorów sekcji, które wolno
zbudować, i każda sekcja jest opakowana w `if (wolno("…"))`. Sekcja zamknięta
nie powstaje w obiekcie raportu, więc nie da się jej zobaczyć ani w HTML, ani
w źródle strony, ani w PDF, ani przez podmianę adresu. Karta zawodu ma osobną
bramkę w `pobierzKarte`: bez otwartej warstwy „zawody" zwraca `null`, nawet
gdy ktoś zna kod zawodu.

**Przeciek znaleziony przy składaniu fazy.** Sekcja „punkt startu" wypisywała
trzy najmocniejsze obszary, mimo że warstwa z obszarami była jeszcze zamknięta
— czyli pokazywała wynik spotkania drugiego na spotkaniu pierwszym. Poprawione,
z testem: lista jest pusta, dopóki sekcja „obszary" nie jest otwarta.

### D28. Parser kart: trzy układy nagłówków w tych samych plikach

Osiemnaście plików z kartami używa trzech różnych układów: karta na `#` i
sekcje na `##`, karta na `##` i sekcje na `###`, oraz — w obu plikach grupy
„biznes" — karta na `#` i sekcje na `###`. Pierwsza wersja parsera zakładała
stałą różnicę jednego poziomu i gubiła 21 zawodów. Parser rozpoznaje teraz
poziom nagłówka karty w pliku i traktuje **każdy głębszy nagłówek** jako
sekcję.

Wynik: **157 zawodów na 157 ma kartę**, 126 pełnych i 31 skróconych. Skrócone
to zawody z obszarów 1, 2, 3, 10, 11 i 27. Skrypt wypisuje listę braków przy
każdym imporcie; obecnie jest pusta.

### D29. Nazwy wyświetlane odtworzone z tytułów kart

Nazwy zawodów w bazie referencyjnej są bez polskich znaków (`pielegniarka`,
`ksiegowy`). Tytuły kart mają znaki, ale są wersalikami. `nazwaZeZnakami`
składa wielkość liter z nazwy bazowej z glifami z tytułu karty. Poprawiło 46
nazw. Jeden wyjątek wpisany ręcznie: `koordynator_ngo`, bo tytuł karty i nazwa
w bazie różnią się nie tylko znakami.

### D30. Fonty do PDF scalane z dwóch podzbiorów

`@react-pdf/renderer` nie umie wybrać kroju per znak, a podzbiory `latin` z
@fontsource nie zawierają polskich znaków — pierwsza wersja PDF-u renderowała
polskie litery Helveticą albo gubiła je. Podanie dwóch krojów naraz działało,
ale dawało plik 818 kB, bo każdy przebieg osadzał osobny podzbiór.
`scripts/przygotuj-fonty.ts` rozpakowuje woff2 do TTF i **scala `latin` z
`latin-ext`** w jeden plik na odmianę. Raport ma 46 kB i osadza wyłącznie
Source Serif 4 oraz Inter.

### D31. PDF pomija to, co źle się zestarzeje

Raport na ekranie i raport w PDF nie mają tej samej zawartości. PDF pomija
słabsze strony i antydopasowania. Kryterium: jeśli zdanie źle zabrzmi czytane
za dwa lata, nie wchodzi do pliku, który uczestnik zachowa. Sekcje zamknięte
nie wchodzą do PDF-u tak samo jak na ekran.

### D32. Trzy drogi: umiejętności liczone per droga, pierwszy krok raz

Silnik liczy jedną listę umiejętności do rozwoju dla całego profilu i jeden
pierwszy krok, wynikający z etapu edukacji. Wstawione do trzech kart dawały
trzy razy to samo zdanie, co wygląda na błąd szablonu i nie mówi nic o różnicy
między drogami.

Umiejętności są teraz liczone osobno dla każdej drogi: kompetencje ważne dla
**tego** obszaru (waga ≥ 2), w których uczestnik ma najniżej. Pierwszy krok
stoi raz, pod trzema kartami, podpisany „przy każdej z tych dróg".

---

## Luki i uwagi z fazy 4, do rozstrzygnięcia

### L2. Pole 14 karty („pierwszy krok w tym miesiącu") nie istnieje w żadnej karcie

`00_metodyka_kart.md` wymienia dwadzieścia pól, w tym pole 14 — pierwszy krok
wykonalny w cztery tygodnie — i osobno zapowiada, że ekran karty w raporcie ma
pokazywać „pierwsze zdanie, skalę, obciążenie i pierwszy krok". W 157 kartach
tego pola nie ma ani razu. Karta zawodu pokazuje więc pierwsze zdanie, skalę i
obciążenie, a pierwszy krok jest wyłącznie ogólny, z etapu edukacji.

### L3. Nazwy pasm przy trzech drogach a wymóg braku hierarchii

`warstwa1_obszary.md` nazywa drogi wprost: „Droga A — najmocniejsze
dopasowanie, Droga B — bardzo dobre dopasowanie, Droga C — alternatywa".
Oczekiwanie po fazie 3 brzmi: na ekranie trzech dróg nie ma być widać
hierarchii ważności.

Układ jest zrównany — trzy identyczne karty, bez numeracji, bez wyróżnienia
kolorem, w kolejności A, B, C tylko dlatego, że jakaś musi być pierwsza.
Hierarchię niesie samo słownictwo pasm. Zdanie wstępne zostało przepisane tak,
żeby nie zaprzeczać etykietom („to nie jest ranking" tuż nad słowem
„najmocniejsze" czytało się jak wykręt), tylko nazywać rolę każdej drogi.
Zmiana samych etykiet wymaga decyzji, bo to słownictwo z modelu programu.

### U1. Tekst ćwiartki „ukryty atut" porównuje uczestnika z innymi

`A2_w_czym_moge_byc_dobry.md`, komunikat dla `Z < 45` i `W ≥ 60`: „Nie palisz
się do tego, ale prawdopodobnie **poszłoby Ci lepiej niż większości**".
Reguła nienaruszalna numer 2 zabrania porównywania uczestnika z innymi.
Tekst jest w programie, więc został użyty bez zmiany, ale to jedyne miejsce w
całym produkcie, gdzie pada porównanie z grupą.

### U2. Test zakazanych słów obejmuje tylko tekst generowany przez aplikację

`SLOWA_ZAKAZANE` sprawdza zdania, które składa aplikacja. Nie obejmuje treści
kart, bo słowo „diagnoza" pada tam w znaczeniu technicznym — diagnostyka
usterek w zawodach warsztatowych — i wycięcie go zepsułoby karty.

### L4. Baza referencyjna nie ma polskich znaków, a jej treść trafia na ekran

`kierunki_baza.csv`, `drogi_bez_studiow.csv`, `klastry.csv` i opis obszarów są
zapisane bez znaków diakrytycznych. W fazie pierwszej to nie było widać, bo
dane szły do silnika. W fazie czwartej ta sama treść trafia do raportu
uczestnika, więc na ekranie stoi „Szkola branzowa: slusarz i mechanik" oraz
całe akapity w rodzaju „Duzo teorii organizacji, malo praktyki".

Skala: 14 nazw obszarów na 27, wszystkie 75 nazw kierunków, 74 opisy „co się
tam robi", wszystkie 56 nazw dróg bez studiów, wszystkie 26 nazw klastrów,
pytań rozstrzygających i opisów różnicy. Karty zawodów mają pełną polszczyznę,
więc nazwy zawodów udało się odtworzyć z ich tytułów; dla pozostałych tabel nie
ma takiego źródła.

To jest przywrócenie ortografii, nie zmiana treści, ale dotyczy tekstu
programu, więc czeka na decyzję: poprawiam pliki źródłowe i przedstawiam
do sprawdzenia, czy dostaję poprawione pliki.

### U3. Powody dopasowania sklejały się w powtórzenie

Silnik zwraca powody jako osobne frazy z przedrostkiem, więc dwa powody tego
samego rodzaju dawały „ciągnie Cię: X; ciągnie Cię: Y". Powody o tym samym
przedrostku są teraz łączone w jedną listę.
