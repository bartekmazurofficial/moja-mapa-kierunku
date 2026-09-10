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
