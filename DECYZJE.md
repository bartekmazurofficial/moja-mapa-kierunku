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

---

## Zatwierdzone po fazie 4

| # | Rozstrzygnięcie |
|---|---|
| 1 | Polskie znaki w bazie referencyjnej poprawione po stronie programu, nowa paczka zaimportowana |
| 2 | Nazwy trzech dróg zmienione na opisujące rolę: „Tu pasujesz najmocniej", „Tu też pasujesz, ale to inna praca", „Coś zupełnie innego" |
| 3 | Tekst ćwiartki „ukryty atut" wymieniony, bo porównywał uczestnika z innymi |
| 4 | Pole 14 karty usunięte z metodyki — pierwszy krok należy do sesji 1:1 |
| 5 | Raport profilu płaskiego sprawdzony w fazie 5 |
| 6 | Klawiatura i fokus teraz; prawdziwe urządzenia i druk przed pilotażem |

### Nazwy obszarów: zgłoszenie wycofane

Policzyłem „14 nazw obszarów na 27 bez znaków", licząc nazwy bez **ani jednej**
polskiej litery. Większość z nich żadnej nie potrzebuje: „Prawo", „Transport i
logistyka". Porównanie wszystkich 27 z nagłówkami w `obszary_27_opis.md` nie
pokazuje różnicy. Parser jest w porządku, źródło też. Miara była zła, nie dane.

Reszta braków po imporcie nowej paczki jest w `DO_POPRAWY_polskie_znaki.md`:
osiem miejsc w opisach kierunków, dziewięć w „czego nie daje", pięć w pytaniach
klastrów, trzynaście w opisach różnic, dwie nazwy dróg bez studiów oraz `zl`
zamiast `zł` w 27 z 56 pól kosztu.

---

## Faza 5

### D33. Logowanie bez tabeli użytkowników

Jedno konto, hasło w `PROWADZACY_HASLO`, sesja w ciasteczku podpisanym HMAC
z `SESJA_SEKRET`. Ciasteczko nie niesie żadnych danych poza datą ważności,
więc nie ma czego podmienić, a podpis pilnuje, żeby nie dało się przedłużyć
ważności. Osiem godzin: tyle trwa dzień warsztatowy. Porównania haseł i podpisów
są odporne na pomiar czasu. Krótszy sekret niż 32 znaki to błąd uruchomienia,
nie ciche obniżenie bezpieczeństwa.

### D34. Blokowanie modułów tym samym mechanizmem co warstwy raportu (luka L1)

Osobna tabela `OtwarcieModulu`, klucz `grupa + moduł`, bez stanu na uczestnika.
Egzekwowane w dwóch miejscach: strona modułu nie renderuje kreatora, a `POST
/api/odpowiedz` odrzuca zapis do nieotwartego modułu. Samo ukrycie linku by nie
wystarczyło — odpowiedzi da się wysłać bez interfejsu.

Otwarte zostaje otwarte: ponowne otwarcie nie przesuwa daty, więc przerwany
moduł zawsze da się dokończyć. Zamknięcie istnieje tylko na wypadek pomyłki
i do testów.

Uczestnik widzi moduł zamknięty na liście, wygaszony, z podpisem, na którym
spotkaniu się otworzy. Pusta lista przez trzy tygodnie byłaby gorsza.

### D35. Rozjazdy liczone jako funkcja czysta

`lib/panel/rozjazdy.ts` nie dotyka bazy. Wejście to wynik silnika, wyniki
modułów, baza referencyjna i oceny zawodów. Dzięki temu wszystkie pięć typów
sprawdzają testy na profilach kontrolnych, a nie na atrapie wyniku.

Trzy definicje wymagały rozstrzygnięcia, bo specyfikacja podaje sens, nie próg:

**Odrzucony faworyt** — zawód z pasma „bardzo mocne" albo „mocne", oznaczony
jako nie dla mnie.

**Wybrany outsider** — zawód oznaczony jako interesujący z najsłabszego
pokazanego pasma albo dosypany gwarancją reprezentacji. Mierzymy względem tego,
co uczestnik w ogóle widzi: zawodu spoza raportu nie mógł oznaczyć.

**Sprzeczność A1 z A5** — obszar usunięty wetem, którego ciągnienie z A1 jest
nie niższe niż u trzeciego obszaru w rankingu. Weto na obszarze, do którego nie
ciągnie, to poprawny odsiew, nie sprzeczność. Wymagało dołożenia `ciagniecie`
do usuniętych obszarów: silnik liczył je dopiero po wecie, więc dla usuniętych
nie istniało. Kolejność etapów w warstwie pierwszej się zmieniła, wyniki nie —
ciągnienie nie zależy od wykonalności i wszystkie przebiegi na sucho przechodzą
bez zmiany.

**Sprzeczność z wizją** — Droga A z mnożnikiem zgodności poniżej jedności, czyli
obszar wygrał samym ciągnieniem, mimo że wizja życia działa przeciw niemu.
Nazywamy konkretny wymiar M1 o największym rozjeździe, bo bez tego nie ma
o czym rozmawiać.

### D36. Korekta ręczna zapisywana osobno od wyniku

Tabela `Korekta` z typem, wartością i uzasadnieniem. Raport nie miesza tego
z wynikiem silnika: usunięty zawód znika z listy, dopisany stoi w osobnej ramce
podpisanej „to nie wyszło z kwestionariusza, wskazał to prowadzący", a zmiana
kolejności dróg dokłada zdanie wprost o tym, że zmienił ją człowiek.

### D37. Ekran sesji przepisuje skrypt z dokumentacji, nie streszcza

`lib/panel/przebieg.ts` zawiera siedem etapów z minutami i siedem skryptów do
sytuacji trudnych w pełnym brzmieniu. Prowadzący czyta to na żywo; skracanie
zepsułoby jedyną rzecz, po którą się do tego sięga. Zasada z fazy 3 („instrukcje
skracaj") dotyczy ekranów uczestnika, nie ściągi dla prowadzącego.

---

## Luki i błędy znalezione w fazie 5

### B1. Kod techniczny pasma trafiał na ekran uczestnika

Komponent pasma renderował `{opis || pasmo}`. Pasma bez opisu — `antydopasowanie`
w obszarach i `ponizej_progu` w zawodach — pokazywały uczestnikowi surowy kod.
Przy profilu płaskim wszystkie trzy najmocniejsze obszary dostawały zieloną
plakietkę „antydopasowanie", czyli dokładnie to, czego zabrania reguła numer 3.

Poprawione w trzech miejscach: pasmo bez opisu nie renderuje się wcale, obszar
z czołówki nigdy nie dostaje etykiety antydopasowania, a PDF pomija myślnik
i opis, gdy opisu nie ma. Trzy testy pilnują, żeby kod techniczny nie wrócił.

### B2. Droga C jako inny poziom wejścia dostawała zawody Drogi A

Gdy nie ma sensownej trzeciej dziedziny, silnik buduje Drogę C jako inny poziom
wejścia w obszarze A albo B. Zawody dla drogi brały się z samego obszaru, bez
poziomu, więc obie karty pokazywały te same cztery zawody i tę samą listę
kierunków. Różnica, która jest całym sensem tej drogi, nie była widoczna.

Zawody są teraz filtrowane po poziomie wejścia drogi, z odwrotem do pełnej listy,
gdyby dla danego poziomu nie było ani jednego zawodu. Etykieta i zdanie
wyjaśniające też się zmieniają: „Ta sama dziedzina, inne wejście" zamiast „Coś
zupełnie innego", bo to drugie byłoby nieprawdą.

### L5. Tabela `PunktStartu` jest martwa

Model istnieje od fazy pierwszej, ale nic do niego nie pisze i nic z niego nie
czyta. Moduł A0 żyje w tabeli odpowiedzi i jest składany przez
`zbierzOdpowiedzi`. Panel najpierw zgłaszał przez to „brak metryczki A0" u
wszystkich uczestników, łącznie z tymi, którzy A0 wypełnili. Panel czyta teraz
prawdziwe źródło. **Tabelę warto usunąć, ale to zmiana w modelu danych, więc
czeka na decyzję.**

### L6. Próg profilu płaskiego mierzy wejście, nie wynik

`A1_PROFIL_PLASKI` porównuje rozstęp wyników 24 obszarów zainteresowań. Profil
kontrolny „płaski" ma rozstęp 19,4, czyli tuż nad progiem 18 — flaga nie pada,
a mimo to wszystkie 27 obszarów kariery wychodzi w przedziale 40,7 do 36,9,
czyli w rozstępie czterech punktów, i wszystkie poniżej progu 42.

Raport zachowuje się wtedy poprawnie, bo osobna flaga
`wszystkie_obszary_ponizej_progu` daje komunikat o nieostrym profilu. Ale to
przypadek, nie projekt: gdyby czołówka wypadła po 45 punktów, uczestnik dostałby
pewnie brzmiący ranking oparty na różnicy czterech punktów. **Do rozważenia:
druga reguła degradacji liczona na rozstępie wyników obszarów, nie zainteresowań.**

### Do sprawdzenia przed pilotażem

| Co | Dlaczego nie teraz |
|---|---|
| Prawdziwy telefon: Safari na iOS i Chrome na Androidzie | Chrome przy 390 px to przybliżenie; Safari ma własne zachowania przy wysokości okna i czcionkach |
| Wydrukowany PDF na papierze | Marginesy A4 oceniane dotąd wyłącznie na ekranie |
| Czytnik ekranu na raporcie i na module | Sprawdzona jest nawigacja klawiaturą i widoczny fokus, nie odczyt |
| Zmiana `PROWADZACY_HASLO` i `SESJA_SEKRET` | W repozytorium stoją wartości zastępcze |
| Pomiar czasu wypełniania na żywych danych | Ostrzeżenie o pobieżnym wypełnieniu ma próg połowy czasu ze scenariusza, nieprzetestowany na ludziach |

---

## Zatwierdzone po fazie 5

| # | Rozstrzygnięcie |
|---|---|
| 1 | Polskie znaki poprawione samodzielnie, wyłącznie w polach wyświetlanych, z testem regresyjnym |
| 2 | Druga reguła profilu nieostrego: rozstęp między pierwszym a piątym obszarem poniżej 12 punktów |
| 3 | Tabela `PunktStartu` usunięta |
| 4 | Ostrzeżenie o tempie liczone względem mediany grupy, nie względem czasu ze scenariusza |

### D38. Ortografia poprawiona skryptem, nie ręcznie

`scripts/popraw-polszczyzne.ts` rusza wyłącznie pola wyświetlane — nazwy,
opisy, pytania, uzasadnienia, wymagania, koszty, czas. Kody, identyfikatory,
wartości słownikowe i listy kodów są nietknięte, bo od nich zależą powiązania
między bazami. Skrypt jest idempotentny, ma tryb `--sprawdz`, a poprawki
punktowe są zapisane jako całe frazy, nie pojedyncze słowa: `plac` to raz plac,
raz płac, a `prace` raz prace, raz pracę. Kontekst jest częścią reguły.

**Pułapka, na którą się nadziałem.** Granica słowa `\b` w JavaScripcie nie zna
polskich liter. Dla „zleceń" uznaje, że słowo kończy się przed „ń", więc reguła
`zlece → zleceń` zrobiła ze „zleceń" — „zleceńń". Skrypt ma własną granicę,
która traktuje ą, ć, ę, ł, ń, ó, ś, ź, ż jak litery. Test regresyjny to łapie.

Poprawionych pól: 168 w dwóch przebiegach. Drugi przebieg objął rzeczy, które
wyszły dopiero po pierwszym: końcówki narzędnika i biernika w polach `uwaga`
klastrów oraz `wymagania` dróg bez studiów. Liczby po imporcie bez zmian.

`tests/polszczyzna.test.ts` sprawdza cztery rzeczy: brak `zl`, brak dwudziestu
form, które w tych tekstach zawsze są błędem, brak mianownika po przyimku
wymagającym narzędnika i brak zdania dłuższego niż sto znaków bez ani jednej
polskiej litery.

### D39. Druga reguła profilu nieostrego

`PROFIL_ROZSTEP_CZOLOWKI: 12` w `config.ts`, do strojenia po pilotażu.
Obie reguły działają alternatywnie: pierwsza mierzy rozstęp na wejściu i łapie
osoby, które odpowiadały bez różnicowania, druga mierzy rozstęp na wyjściu
i łapie osoby, które odpowiadały normalnie, ale ich profil rozkłada się
równomiernie na wszystko. Piąty obszar, nie ostatni, bo do raportu trafia
czołówka.

Profil kontrolny „płaski" ma rozstęp A1 równy 19,4, czyli powyżej progu
pierwszej reguły — i teraz dostaje flagę od drugiej. Trzy profile kontrolne
z przebiegu na sucho jej nie dostają.

### D40. Tabela `PunktStartu` usunięta (luka L5)

Model istniał od fazy pierwszej, nic do niego nie pisało i nic z niego nie
czytało. Moduł A0 żyje w tabeli odpowiedzi. **To jest zmiana modelu danych
wobec specyfikacji:** dokumentacja przewidywała osobną tabelę na metryczkę,
a metryczka okazała się zwykłym modułem. Interfejs `PunktStartu` w
`lib/engine/typy.ts` zostaje — to typ wejścia silnika, nie tabela.

### D41. Ostrzeżenie o tempie liczone względem grupy

`TEMPO` w `config.ts`: 40% mediany, co najmniej 5 ukończeń, najwyżej 2 flagi
na moduł. Porównujemy czas na blok uczestnika z medianą tej samej grupy na tym
samym module.

Próg bezwzględny nie działał z powodu, który widać było dopiero na zrzucie
ekranu: dane testowe generuje skrypt, więc każdy moduł był „wypełniony poniżej
połowy czasu" i obwódka świeciła się przy wszystkich kropkach naraz.
Ostrzeżenie u całej grupy nie jest ostrzeżeniem.

Test sprawdza obie strony reguły: osoba odstająca od swojej grupy dostaje
ostrzeżenie, a grupa pracująca szybko w całości — nie dostaje go nikt.

---

## Do obserwacji w pilotażu

Dwie liczby, o które nikt nie pyta, a które mówią, czy progi są dobre:

1. **Ilu uczestników dostało flagę profilu nieostrego.**
2. **Ilu powiedziało „to nie o mnie".**

Jeśli którakolwiek przekroczy jedną trzecią grupy, problem jest w progach,
nie w ludziach. Wtedy wracamy do czterech liczb decyzyjnych każdej warstwy,
zmieniając po jednej naraz i sprawdzając, co się dzieje z trzema profilami
kontrolnymi.

---

## Pomiar obciążenia, wykonany

`scripts/obciazenie.ts` zakłada własną grupę, dwunastu wirtualnych uczestników
pisze przez prawdziwe API, na koniec grupa jest kasowana. Nie dotyka danych
pilotażowych.

**Pięć minut, dwunastu piszących jednocześnie:**

| Co | Ile |
|---|---|
| Wysłanych zapisów | 11 618 |
| Potwierdzonych | 11 618 |
| Odrzuconych i błędów sieci | 0 |
| Opóźnienie, mediana | 8 ms |
| Opóźnienie, p95 | 26 ms |
| Opóźnienie, maksimum | 104 ms |
| Wierszy w bazie po pomiarze | 11 618 |

**Żaden zapis nie przepadł.** SQLite z jednym zapisem naraz wystarcza.

Obciążenie w pomiarze jest kilkadziesiąt razy wyższe niż realne: każdy
wirtualny uczestnik zapisuje trzy razy na sekundę, a prawdziwy odpowiada raz
na kilkanaście sekund. To jest margines, nie wynik na styk.

Czasy odpowiedzi stron przy tej samej bazie: raport uczestnika 11 ms, ekran
grupy 12 ms, karta uczestnika 14 ms, ekran sesji 14 ms. Ekran grupy robi jedno
zapytanie zbiorcze na czasy i jedno na weta, więc nie rośnie liniowo z liczbą
uczestników.

---

## Dostawa po fazie 5: rozszerzenie A5 i A3

### D42. Moduł A5: 32 → 43 pozycje

Jedenaście nowych pozycji wstawionych w istniejące bloki tematyczne, nie na
koniec listy: F33–F38 do „Warunków fizycznych", F39 do „Czasu", F35 i F42 do
„Ludzi", F40 do „Pieniędzy i ryzyka", F41 i F43 do „Odpowiedzialności".
Limit trzech wet bez zmian.

**Blok siódmy warto nazwać inaczej.** Nazywa się „Odpowiedzialność", a trzyma
teraz cztery pozycje, których wspólnym mianownikiem jest raczej **sposób
rozliczania pracy**: odpowiedzialność za czyjeś bezpieczeństwo, presja wyniku,
praca papierkowa i poprawianie własnej pracy na polecenie. Nie zmieniałem
nazwy, bo to treść programu. Do rozstrzygnięcia.

**Siedem kodów z kart dostało źródło:** `halas`, `umieranie`, `agresja`,
`ciasnota`, `wysokosc`, `chemikalia`, `wieczory`. Bez źródła zostały dwa:
`goraco` (6 zawodów) i `powtarzalnosc` (8). `zimno` jest w tabeli
odwzorowania, ale nie występuje w żadnej karcie.

**Do rozstrzygnięcia: `A5_WSKAZNIK_ZAMKNIECIA` zostało na 20.** To liczba
odpowiedzi NIE, powyżej której silnik wyłącza filtry całkowicie. Przy 32
pozycjach oznaczała 62% modułu, przy 43 oznacza 46%. Nie ruszałem jej, bo to
jedna z liczb decyzyjnych. Utrzymanie proporcji dałoby 27.

### D43. Moduł A3: 12 → 13 osi

Oś EFE, pięć par i kotwica, treść z dostawy bez zmian. Krótkie etykiety
biegunów („Efekt szybki", „Efekt odroczony") i warunki środowiskowe napisane
tak, jak pozostałych dwanaście, bo trafiają do sekcji o środowisku w raporcie.

`efekt_widoczny` z kart odwzorowuje się teraz na EFE:A, `efekt_odroczony` na
EFE:B. `rzeczy` zostaje niemapowane: to przedmiot pracy, nie styl działania.

### D44. Kolejność modułów na spotkaniu trzecim

Nowe minuty z dostawy (filtry 81–103, podsumowanie 103–115) układają się
tylko w kolejności **wartości → przerwa → wizja życia → filtry**. Scenariusz
miał dotąd A4, A5, przerwę i M1, a aplikacja M1, A4, A5 — obie wersje były
niezgodne z instrukcją samego A5, która zaczyna się od zdania „Przed chwilą
opisałeś, jak chcesz żyć".

Poprawione w obu miejscach na A4, M1, A5. Czasy modułów: A3 z 18 na 21 minut,
A5 z 15 na 22 minuty.

### D45. Antyprofil: 34 → 48 reguł aktywnych

Klasyfikacja dwudziestu sześciu kodów według reguły trzech kategorii jest
w `ODPOWIEDZ_antyprofil_i_A3.md`. Skrótowo: **14 uaktywnionych** (102 ze 125
trafień), **0 scalonych**, **12 do usunięcia z kart** (23 trafienia).

Trzy z uaktywnionych — `waska_wiedza`, `potrzeba_jakosci`, `konflikt_rodzic` —
miały źródło od początku w warunkach kluczowych A3. W fazie drugiej oceniłem
je zbyt surowo i to rozstrzygnięcie wycofuję.

`efekt_szybki` i `efekt_widoczny` mają ten sam predykat, ale różne zdanie
o zawodzie i żadna karta nie ma obu naraz. Nie scaliłem; czeka na decyzję.

### L7. Nowe filtry działają na poziomie zawodu, nie obszaru

Baza 27 obszarów wymienia wyłącznie F01–F32. Wykluczenie jednej z jedenastu
nowych pozycji usuwa konkretne zawody, ale nigdy całego obszaru. Asymetria
wobec starych filtrów, do rozstrzygnięcia przy redakcji bazy obszarów.

### Audyt po zmianach

`scripts/audyt-pelny.ts` puszcza pełny silnik na losowych profilach, z wetami
i wszystkimi trzynastoma osiami — inaczej niż audyt T11–T14, który liczy tylko
zainteresowania i kompetencje. 400 profili: **157/157 osiągalnych**,
różnorodność TOP3 **0,902** (bez nowych pozycji 0,892), najczęstszy zawód
w TOP10 w 13,5% profili. Stary audyt przechodzi bez zmian.

---

## Zamknięcie budowy

### D46. Obszar bez ani jednego zawodu znika z rankingu

Ostatnia zmiana w silniku. Asymetria między obszarem a zawodem zostaje
świadomie: pojedyncze weto usuwa zawody, nie całą dziedzinę. Obszar
„Medycyna i ratownictwo" to nie tylko lekarz, pielęgniarka i ratownik, ale
także farmaceuta, technik radiolog i opiekun medyczny — role o zupełnie innym
kontakcie ze śmiercią. Usunięcie całego obszaru powiedziałoby uczestnikowi
„medycyna nie jest dla ciebie", co byłoby nieprawdą.

Dopiero gdy **nie zostaje ani jeden zawód**, obszar znika: pusta obietnica nie
ma czego pokazać. Ta sama reguła, która obowiązuje przy kierunkach.

Zmierzone na profilu kontrolnym: weto na kontakcie ze śmiercią usuwa cztery
z ośmiu zawodów obszaru i obszar zostaje. Trzy weta naraz (śmierć, studia,
odpowiedzialność za czyjeś bezpieczeństwo) usuwają wszystkie osiem i obszar
wypada — razem z przeliczeniem trzech dróg, które powstają wtedy z innych
obszarów.

Powód usunięcia zapisujemy jako `weto`, więc taki obszar trafia do sekcji
rozjazdów w panelu: to jest dokładnie ta sprzeczność, o której prowadzący ma
rozmawiać.

### D47. Zapis odpowiedzi odporny na zerwane połączenie

Jedyna rzecz z listy przed pilotażem, która wymagała kodu — i wymagała.

Zapis szedł pojedynczym `fetch` bez ponowień i bez obsługi błędu.
Uczestnik wypełniający moduł na telefonie w szkole tracił odpowiedzi po cichu
i dowiadywał się o tym dopiero wtedy, gdy wracał do modułu.

`lib/moduly/kolejka-zapisu.ts` ponawia trzy razy z rosnącym odstępem, odkłada
to, czego nie udało się wysłać, i dosyła po powrocie połączenia — na zdarzenie
`online` i co piętnaście sekund. Klasa nie zna Reacta ani `fetch`, więc jej
zachowanie da się sprawdzić bez przeglądarki i bez czekania.

Trzy zachowania widoczne dla uczestnika:

1. **Przy działającej sieci nic się nie zmienia.** Żadnego komunikatu.
2. **Przy zerwanej** pojawia się zdanie: ile odpowiedzi czeka i że zapiszą się,
   gdy sieć wróci. Można pisać dalej.
3. **Części nie da się zamknąć, dopóki cokolwiek nie doszło.** Zamknięta część
   znika z ekranu, więc uczestnik nie miałby jak wrócić po utraconą odpowiedź.

Sprawdzone na żywej aplikacji z wyłączoną siecią w przeglądarce: pięć
odpowiedzi zaległo, komunikat się pokazał, zamknięcie części zostało
wstrzymane, a po przywróceniu sieci wszystkie pięć trafiło do bazy
z ostatnią wartością, nie z pierwszą.

### Czego świadomie nie robimy

**Dwunastu nieaktywnych kodów antyprofilu nie usuwamy z kart.** Zostają
nieaktywne do redakcji kart po pilotażu.

**Nierównego pokrycia wymiarów A3 w kartach nie wyrównujemy.** SAM 122
wystąpienia, DEC 7 — to może być wada albo może odzwierciedlać rzeczywistość.
Rozstrzygną to dane od prawdziwych uczestników.

**Progów nie stroimy.** Wszystkie liczby decyzyjne zostają. Kalibracja ma sens
wyłącznie na prawdziwych odpowiedziach.

### Przed pilotażem, do zrobienia raz

| # | Sprawdzenie | Stan |
|---|---|---|
| 1 | Pełna ścieżka na prawdziwym telefonie: Safari na iOS i Chrome na Androidzie | zostaje |
| 2 | Zachowanie przy zerwanym połączeniu podczas zapisu | **zrobione, D47** |
| 3 | Wydrukowany PDF: marginesy i podział stron na papierze A4 | zostaje |
| 4 | Czytnik ekranu na jednym module i na raporcie | zostaje |
| 5 | **Brak `TRYB_TESTOWY` w środowisku produkcyjnym** | zostaje |

Do tego rzeczy, które przychodzą ze strony programu przy redakcji kart:
usunięcie dwunastu nieaktywnych kodów antyprofilu, ewentualne dopisanie NAP
i RYT do kart, decyzja o nazwie siódmego bloku A5 i o progu
`A5_WSKAZNIK_ZAMKNIECIA` po rozszerzeniu modułu do 43 pozycji.

---

## Zmiana wyglądu po zamknięciu budowy

### D48. Nowy system wizualny

Poprzedni — ciepła, jasna baza, typografia szeryfowa, jeden stonowany akcent —
został odrzucony przez fundację. Nowy: głęboki fiolet, szkło z jasną krawędzią
u góry, poświata, gradientowe nagłówki, jedna rodzina kroju (Plus Jakarta
Sans) plus Caveat wyłącznie na odręczne dopiski.

Co zostało z poprzednich ustaleń, bo to nie były kwestie gustu: **kontrast
4,5:1 dla każdego tekstu** (dziewiętnaście par, najsłabsza 6,5:1, sprawdzane
testem), **kolor nigdy jako jedyny nośnik**, **widoczny fokus**, **przejścia
poniżej 200 ms**, **brak modali i gamifikacji**.

### D49. Pulpit uczestnika z nawigacją po lewej

Zamiast jednej listy modułów: przegląd, moduły, raport, zawody. Sekcja
zamknięta jest widoczna, podpisana kłódką i informacją, kiedy się otworzy —
ale nieklikalna. Blokada i tak stoi na serwerze; na ekranie chodzi o to, żeby
uczestnik wiedział, co go czeka.

Nowy ekran: lista kart zawodów. Wcześniej karty były dostępne tylko z raportu.

Ekran modułu został bez nawigacji bocznej, bo tam obowiązuje zasada „jedna
rzecz na ekranie".

### D50. Trzy bramy rysowane wektorem

Znak rozpoznawczy z makiet fundacji, na razie jako SVG: nic się nie pobiera,
skaluje się do każdej szerokości, jest ukryty przed czytnikiem ekranu i znika
na wąskim ekranie. Miejsce na render — wtedy wystarczy podmienić komponent.

### D51. Tryb testowy z listą uczestników

Ekran wejścia dzieli się na dwa: wybór roli (uczestnik albo prowadzący)
i wejście kodem. Przy `TRYB_TESTOWY=1` pod polem kodu pojawia się lista
uczestników, żeby dało się klikać po aplikacji bez wpisywania kodu.

**To łamie zasadę, że nie da się wyliczyć listy uczestników**, a raport zawiera
wizję życia, informacje o zdrowiu i sytuacji finansowej. Dlatego: przełącznik
jest domyślnie wyłączony, włącza go wyłącznie dokładna wartość `1`, komponent
sprawdza go sam zamiast ufać miejscu użycia, a w `.env.example` stoi
zakomentowany. Cztery testy tego pilnują.

**Przed pilotażem trzeba sprawdzić, że tej zmiennej nie ma w środowisku
produkcyjnym.** Dopisane do listy przed pilotażem.

### D52. Testy zasiewają własne dane

Reset postępów uczestników wywrócił dwanaście testów naraz, bo zależały od
tego, co ktoś ręcznie wpisał w aplikacji. To była ukryta wada zestawu: testy
nie mogą zależeć od stanu, który wolno skasować jednym poleceniem.

Logika wypełniania modułów przeniesiona ze skryptu do `lib/testy/wypelnianie.ts`.
`tests/pomocnicze/fixtury.ts` zakłada osobną grupę `TESTAUTO`, wypełnia ją
sama i jest idempotentna. Grupy pilotażowe i testowe nie mieszają się w żadną
stronę: reset nie psuje testów, a testy nie zaśmiecają grupy pilotażowej.

`scripts/reset.ts` kasuje wszystko, co wprowadził uczestnik, i ustawia grupę
na stan pierwszego dnia: otwarte spotkanie pierwsze, żadna warstwa raportu.
Kody dostępu zostają — inaczej trzeba by je rozdawać od nowa. Grupa testów
automatycznych jest kasowana w całości, bo testy odtwarzają ją same.

### D53. Ilustrujemy kategorie, nie pozycje

Pierwsza sesja była ścianą identycznych kafli: 144 pozycje A1, każda wyglądała
tak samo. Ilustrowanie każdej z osobna oznaczałoby **ponad czterysta obrazków**
we wszystkich modułach, których nigdy nie dałoby się utrzymać na równym
poziomie.

Zamiast tego znak bierze się z **kategorii**: 24 obszary zainteresowań na 144
pozycje, 30 kompetencji na 180, 7 bloków warunków na 43. Jedna grafika pracuje
średnio na sześciu ekranach. Kluczowe jest to, że **w jednym zestawie cztery
pozycje pochodzą z czterech różnych kategorii** — pilnuje tego test — więc
żadne dwa kafle obok siebie nie są takie same.

99 znaków rysowanych konturem w `lib/ui/glify.ts`, z odcieniem przypisanym na
stałe kluczowi. Zakres 250°–320°, czyli fiolet, indygo i róż: wyjście poza
niego rozbiłoby paletę, a chodzi tylko o rozróżnialność sąsiadów.

Spis do dosłania prawdziwych grafik jest w `GRAFIKI-KATEGORIE.md`, generowany
skryptem z danych, więc nie rozjedzie się z aplikacją. Podmiana to zamiana
mapy kluczy na mapę adresów — klucze zostają.

### D54. Plansza wyników modułu

Uczestnik widzi własne odpowiedzi od razu po ukończeniu części, na jednej
planszy, po trzy kategorie w rzędzie. **To nie jest raport**: raport mówi,
co z odpowiedzi wynika dla zawodów, i otwiera się warstwami po spotkaniach.
Plansza pokazuje wyłącznie to, co uczestnik sam wybrał, i nie zawiera ani
jednej liczby dopasowania — miejsce na skali opisane jest słowem.

Dostępna z listy części, przyciskiem przy ukończonym module. A0 jej nie ma:
metryczka nie ma kategorii wynikowych.

### D55. Wszystkie moduły otwarte na starcie

`scripts/reset.ts` otwiera domyślnie wszystkie siedem, żeby dało się wejść
w każdy test od razu. `--spotkanie1` wraca do stanu, w którym prowadzący
otwiera je po kolei — tak jak będzie w pilotażu.

Kafel uczestnika na ekranie wyboru prowadzi w trybie testowym prosto na pulpit
pierwszej osoby, bez wybierania konta i bez kodu.

### D56. Część wypełniana od nowa, nie poprawiana po jednej odpowiedzi

Moduły liczą się z całości: rankingi w blokach, pary wymuszonego wyboru,
limit trzech wykluczeń w A5. Podmiana pojedynczej odpowiedzi po policzeniu
wyniku dałaby stan, którego nikt nie umie zinterpretować, więc jej nie ma.

Zamiast tego uczestnik może **wypełnić całą część od nowa**. Kasujemy dwie
rzeczy: odpowiedzi modułu i `PostepModulu`. Postęp trzyma wylosowaną kolejność
bloków — gdyby został, drugi przebieg szedłby w tej samej kolejności, a
kontrola efektu pozycji polega na tym, że kolejność losuje się na nowo.

**Czego nie kasujemy:** korekt prowadzącego i podsumowania sesji. To jest praca
człowieka, nie dane uczestnika. Kasowanie jej po cichu byłoby gorsze niż
niespójność, którą prowadzący widzi w panelu i może ocenić sam.

**Osobny ekran potwierdzenia** (`/u/<kod>/modul/<moduł>/od-nowa`), nie przycisk
na liście. Kasowanie jest nieodwracalne, a M1 zawiera tekst pisany własnymi
słowami. Ekran podaje liczbę odpowiedzi, które znikną.

Wejście od nowa jest możliwe dla każdego modułu z choć jedną zapisaną
odpowiedzią, także przerwanego w połowie pierwszej części. Przy okazji
poprawiona etykieta: moduł z odpowiedziami, ale bez domkniętej części,
pokazywał „do zrobienia"; pokazuje „zaczęte".

Moduł zamknięty przez prowadzącego nie daje się ani wypełnić, ani wyczyścić —
inaczej uczestnik skasowałby odpowiedzi i został z niczym.

### D57. Czas modułu znika z ekranu uczestnika

Siedemnastolatek, który przed startem czyta „27 minut”, zaczyna liczyć zamiast
odpowiadać, a moduł wypełniony w pośpiechu jest gorszy niż wypełniony wolno.
Tabela `CZASY_MODULOW` usunięta, zdanie „Zajmie około 20 minut” z instrukcji A1
usunięte. Postęp mówi „7 z 36 zestawów”, czyli ile zostało, a nie ile to potrwa.

Prowadzący **zachowuje** minutówkę: scenariusz spotkania i panel sesji dalej
podają czasy. To jest jego narzędzie do prowadzenia grupy, nie presja dla
uczestnika.

### D58. Myślnik pauzowy znika z tekstów

Decyzja redakcyjna: zdanie ma być poukładane tak, żeby myślnik nie był
potrzebny. Zamiast niego kropka, przecinek, dwukropek albo spójnik, zależnie
od tego, co zdanie robi. Poprawionych 67 miejsc w treściach, widokach,
raporcie i PDF-ie.

Dwa miejsca dostały coś lepszego niż zamiennik interpunkcyjny:

- wartości A4 miały etykietę `nazwa — znaczenie`; teraz nazwa i wyjaśnienie
  stoją w dwóch liniach (`OpcjaWyboru.podpis`), co czyta się lepiej
  niż jedno długie zdanie,
- puste komórki w panelu pokazywały „—”, teraz piszą „brak” albo „komplet”.

`tests/bez-myslnika.test.ts` przegląda pliki widoków i treści (bez komentarzy)
oraz pola wyświetlane w bazie. Test pada, gdy „—” wróci przy kolejnej edycji.

Półpauza w zakresach („3–5 lat”) **zostaje**: to jest poprawny polski zapis
zakresu, nie myślnik w zdaniu. Poprawione zostały dwa zapisy, które po polsku
nie brzmiały: „0 lat” na „bez dodatkowej nauki” i „0–1 rok” na „do roku”.
Normalizacja siedzi w parserze obszarów, więc przetrwa kolejny import; pole
`lata`, od którego zależy silnik, liczy się dalej z oryginału.

### D59. Poprawki polszczyzny w parach M1 i A3

Jedna z nich była błędem merytorycznym, nie stylistycznym. Para GRA_2 miała
biegun B „Wolę pracować w swoich godzinach i mieć spokój”, a biegun B tej osi
znaczy **ostre rozdzielenie pracy i życia**. „W swoich godzinach” czyta się
jako „sam sobie ustalam pory”, czyli dokładnie biegun A. Uczestnik wybierający
zgodnie z sobą trafiał w przeciwny biegun. Teraz: „Wolę pracować w stałych
godzinach i mieć wolny wieczór”.

Reszta to polszczyzna: „Wolę wynajmować i móc się ruszyć”, „Wolę być lekki”,
„Ulżyło mi, gdy decyduje ktoś inny” (czas przeszły przy stanie stałym),
„Wolę mniejszy, ale pewny” (urwane), „dużą ilość dokumentów” (ilość łączy się
z niepoliczalnymi). Pięć zdań osi EFE miało kropkę na końcu, a wszystkie
pozostałe pary jej nie mają.

**Kody i identyfikatory nietknięte.** Zmienione wyłącznie pola wyświetlane.

### D60. Numery w zestawie zamiast kolejności klikania

Ranking czterech pozycji działał tak, że numer nadawał się sam, w kolejności
stukania, a czwarta pozycja dopełniała się bez udziału uczestnika. Trzy
kliknięcia i nagle wszystko ponumerowane, ekran ucieka.

Teraz każda pozycja ma cztery przyciski `1 2 3 4` i numer wybiera się wprost.
Jedna zasada: **jeden numer należy do jednej pozycji**. Nadanie zajętego numeru
zabiera go poprzedniej pozycji, zamiast blokować przycisk, bo blokada kończy
się tym, że pomyłki nie da się poprawić inaczej niż kasując wszystko.

Reguła jako czysta funkcja w `lib/moduly/ranking.ts`, z testem, który przy stu
losowych kliknięciach sprawdza, że żaden numer nie występuje dwa razy.
Kształt zapisu w bazie bez zmian, silnik nie wie o niczym.

### D61. Ilustracje kategorii zamiast rysowanych glifów

Dwadzieścia cztery obrazy A1 są w aplikacji. Nie są tym, co zamawiałem
(kontur 512 px na przezroczystości), tylko pełnymi ilustracjami z tłem,
1254 px. **Lepiej.** Kafel z obrazem widać z drugiego końca pokoju, a znak
konturowy ginął przy 44 px. Format A1 staje się wzorcem dla reszty modułów.

Oryginały ważą po 2 MB, czyli 49 MB na moduł. Do repozytorium trafiają dwie
przeliczone wersje: 256 px na kafel (razem 470 kB) i 768 px na nagłówek.
Przelicza `scripts/grafiki.ts`, sprawdza `tests/grafiki.test.ts`, który pilnuje
też budżetu wagi i tego, że deklaracja w `lib/ui/obrazy.ts` zgadza się z dyskiem.

Kategoria bez pliku dostaje rysowany glif, więc dosyłanie grafik partiami
niczego nie psuje.

### D62. Przejście między ekranami modułu

Po ostatniej odpowiedzi ekran czekał 400 ms i podmieniał się w jednej klatce,
razem ze skokiem na górę strony. Wyglądało to jak zawieszenie, a potem awaria.

Teraz: 150 ms na zobaczenie własnego wyboru, wygaszenie starego ekranu,
wejście nowego animacją 190 ms. Przewijamy tylko wtedy, gdy strona faktycznie
jest przewinięta, bo skok do zera na ekranie, który się mieści, sam wyglądał
jak błąd. Wszystko pod `prefers-reduced-motion`.

### D63. Pusty ekran przy przejściu między częściami modułu

**To był najpoważniejszy błąd w całej aplikacji i dotyczył wszystkich siedmiu
modułów.**

Po domknięciu części `router.refresh()` podmieniał definicję w locie, a numer
ekranu zostawał ze stanu komponentu, czyli z części poprzedniej. Część A
modułu A1 ma 38 ekranów, część B jeden. Numer 37 wskazywał w pustkę, komponent
trafiał na `return null` i **strona robiła się pusta**. To samo w A2 (47 do 3),
A3 (66 do 1), A4 (37 do 1), A5 (44 do 1) i M1 (49 do 8).

Uczestnik kończył najdłuższą część programu i zostawał z czarnym ekranem, bez
przycisku, bez komunikatu. Jedynym wyjściem było przeładowanie strony, po
którym wszystko wracało, bo przy montowaniu komponent ustawia numer ekranu
z zapisanych odpowiedzi.

Poprawka: `<Runner key={modul-czesc}>`. Nowa część to nowy komponent, czyli
numer ekranu od zera. Do tego bezpiecznik w samym komponencie: numer poza
zakresem jest przycinany do ostatniego ekranu, a nie wygasza strony.

**Zmierzone po poprawce: 26 ms od kliknięcia do następnej części.** Serwer
renderuje część w 6 ms, oba zapisy idą w 13 ms. Nie było tu problemu
z wydajnością, tylko z pustym ekranem.

Test pilnuje trzech rzeczy: że części różnią się długością (bez tego błąd
nigdy by się nie ujawnił), że klucz jest w kodzie strony i że stan serwera
przechodzi do kolejnej części.

### D64. Ile treści na jednym ekranie

Cztery reguły, wszystkie z jednego przeglądu:

**Zestaw czterech pozycji to dwa rzędy po dwa**, nie lista czterech wierszy.
Obraz na górze kafla, tekst pod nim, numery na dole kafla. Na telefonie
zostaje jedna kolumna: przy dwóch kolumnach cztery przyciski numerów zeszłyby
poniżej czterdziestu czterech pikseli, czyli poniżej progu dotyku.

**Warunek A5 dostaje własny ekran.** Było pięć naraz. Wzrok ląduje na
pierwszym, reszta dostaje tę samą odpowiedź co on, a każdy z tych warunków
może samodzielnie usunąć zawód z wyniku. Moduł rośnie z 8 do 44 ekranów,
ale każdy ekran to jedna decyzja i przechodzi sam po odpowiedzi.

**Lista dłuższa niż cztery pozycje idzie w dwie kolumny.** Dotyczy wyborów
pojedynczych i wielokrotnych; „Na jakim etapie nauki jesteś?” miało dziewięć
opcji w jednej kolumnie i nie mieściło się na ekranie.

**Ekran z sześcioma pozycjami i więcej idzie w dwie kolumny.** Dotyczy skal
i kotwic: część B modułu A1 to dwadzieścia cztery pozycje, które w jednej
kolumnie były ścianą. W siatce każda pozycja dostaje własną ramkę, bo kreska
u dołu nie wiadomo czego dotyczy, gdy obok stoi druga kolumna.

### D65. Wymiar dwubiegunowy opisuje się stroną, nie poziomem

Plansza wyników M1 pokazywała „CEN bardzo wysoko”, „GRA bardzo wysoko”.
Kod wymiaru nie znaczy dla uczestnika nic, a „wysoko” przy wymiarze
dwubiegunowym nie znaczy nic dla nikogo: ten wymiar nie ma góry i dołu,
ma dwie strony.

Teraz: nazwa wymiaru („Granica pracy i reszty życia”) i strona, na której
uczestnik jest, słowami („wyraźna granica między pracą a resztą”). Etykiety
były już w kodzie, używał ich raport; plansza ich nie wołała.

Przy okazji poprawiona jednostka postępu. „3 z 36 zestaw” nie jest
polszczyzną, po liczebniku z przyimkiem „z” idzie dopełniacz: „3 z 36
zestawów”, „1 z 43 warunków”.

### D66. Ilustracja jako obraz, nie jako ikonka

Kwadracik 52 px przy tekście gubi wszystko, co na obrazie jest: postać,
światło, scenę. Grafiki są malarskie i mają co pokazać, więc dostają miejsce.

Trzy miejsca, trzy rozmiary. Kafel zestawu w A1 i A2: pasek 104 px na całą
szerokość kafla, nad tekstem. Plansza wyników: pasek 132 px na górze kafla,
wersja 768 px. Ekran pary w A3: 172 px nad dwoma zdaniami do wyboru, jeden
obraz osi pracuje na pięciu parach.

Kategoria bez pliku dostaje ten sam pasek z rysowanym glifem, żeby siatka
kafli nie rozjeżdżała się na dwa różne produkty.

### D67. Trzynaście ilustracji A3

Osie stylu działania. Klucz to kod osi (`a3-INI`), nie numer, więc
`scripts/grafiki.ts` przyjmuje teraz dowolny klucz, nie tylko liczbę.
Przelicza tak samo: 256 px na kafel, 768 px na nagłówek, razem 2,5 MB
zamiast 28 MB oryginałów.

Obraz ilustruje **oś, nie biegun**. To jest świadome: gdyby każdy biegun miał
własny obraz, uczestnik wybierałby ładniejszy obrazek zamiast bliższego zdania.

### D68. Redakcja pozycji: z abstrakcji na obraz

Zgłoszenie z przeglądu: „w zestawie jedna pozycja jest dobra, trzy słabe”.
Po przejrzeniu wszystkich 324 pozycji A1 i A2 zgadzam się co do diagnozy,
choć nie co do proporcji. Słabe były te, których nie da się zobaczyć oczami.

Poprawionych **40 pozycji**: 32 w A1, 8 w A2. Przykłady:

| Było | Jest |
|---|---|
| Dowiedzieć się, dlaczego zjawisko zachodzi właśnie tak | Dojść do tego, dlaczego coś dzieje się tak, a nie inaczej |
| Zebrać ludzi i wyznaczyć kierunek działania | Zebrać ekipę i powiedzieć, w którą stronę idziemy |
| Zadbać o to, żeby ktoś czuł się bezpiecznie | Sprawić, żeby ktoś przestał się bać |
| Nadać nazwy i kategorie chaotycznemu zbiorowi | Ponazywać i pogrupować rzeczy, które leżą bez ładu |
| Podjąć decyzję, mimo że brakuje pewnych informacji | Zdecydować, choć nie wiesz jeszcze wszystkiego |

**Kody, obszary i rodziny nietknięte.** Zmieniona wyłącznie treść wyświetlana,
więc macierze i silnik nie wiedzą o niczym.

Test pilnuje czterech rzeczy, które w tej redakcji łatwo zepsuć: brak
powtórzeń w całym programie, długość od 18 do 70 znaków (żadnych ogryzków
i żadnych akapitów), bezokolicznik na początku i brak słów z urzędu
(`zjawisko`, `przedsięwzięcie`, `realizować`, `aspekt`, `kwestia`).

### D69. Koniec automatycznego przejścia

Ekran przechodził sam, gdy odpowiedź była komplet. Uczestnik klikał czwarty
numer i widok uciekał, zanim zdążył spojrzeć, co ustawił.

Teraz każdy ekran czeka na **Dalej**. Pole `autoDalej` usunięte z modelu,
nie tylko wyłączone, bo półśrodek wróciłby przy pierwszej okazji.

**Koszt jest realny i podaję go wprost:** jedno kliknięcie więcej na ekran,
czyli około 36 w A1, 45 w A2, 65 w A3 i 43 w A5. Dlatego **Enter też
przechodzi dalej** — kto wypełnia z klawiatury, nie sięga po przycisk.

Jeśli po pilotażu okaże się, że to za dużo, wracamy do automatu wyłącznie
tam, gdzie ekran ma jedną decyzję (pary A3, warunki A5), a zestawy z numerami
zostają na przycisku. Zapisuję to jako rzecz do obserwacji, nie do zmiany teraz.

### D70. Biała karta zamiast ciemnego fioletu

Cały system wizualny przewrócony na jasny. Podłoże białe, panele z matowego
szkła, neon pod spodem jako cztery rozmyte plamy. Kolor niosą teraz **bloki
kategorii**, a nie tło strony.

Wszystkie liczby kontrastu policzone od nowa i wpisane do
`lib/ui/kontrast.ts`: 27 par, najsłabsza 4,75:1, większość powyżej 5,5:1.
Test pilnuje też, żeby kolory z arkusza zgadzały się z tymi, które sprawdza.

Kolory znaczeniowe (uwaga, trampolina, koszt, zagrożenie) przeliczone na
jasny motyw: ciemny tekst na bardzo jasnym tle tej samej rodziny.

### D71. Sześć kolorów kategorii, nie cztery

Zamówione były cztery neony: niebieski, żółty, czerwony i zielony. Dołożyłem
turkus i fiolet, i mówię dlaczego.

W zestawie stoją cztery kafle i żadne dwa nie mają prawa być tego samego
koloru. Kolor ma być przypisany kategorii na stałe, żeby ten sam obszar
wyglądał tak samo w module i w raporcie. Te dwa warunki razem to kolorowanie
grafu: wierzchołek to obszar, krawędź to „te dwa kiedyś stanęły obok siebie”.
Graf A1 ma 24 wierzchołki i **stopień szesnaście**, bo zestawy biorą po jednej
pozycji z czterech różnych rodzin RIASEC.

Przeszukiwanie z nawrotami: **czterema kolorami się nie da, pięcioma też nie,
sześcioma tak.** Przy czterech w części zestawów dwa kafle miałyby ten sam
kolor, czyli dokładnie to, czego mieliśmy uniknąć.

Cztery zamówione są główne i pokrywają dwie trzecie kategorii. Turkus i fiolet
są piąty i szósty.

### D72. Ilustracja w całości, nie w kadrze

Pliki są kwadratowe, więc ramka też jest kwadratowa i obraz wchodzi w nią bez
przycinania. Pasek 104 px ucinał tym rysunkom połowę sceny, a scena jest w nich
treścią: warsztat, lampa, ręce nad stołem.

Kafel zestawu: kwadrat 124 px. Ekran pary A3: kwadrat 208 px.

**Na kartach z odpowiedziami zdjęcia nie ma w ogóle.** Tam stoi rysowany znak
w bloku w kolorze kategorii, bo na planszy wyników liczy się to, co uczestnik
wybrał, a nie to, jak ładny jest obraz. Zdjęcia zostają tam, gdzie uczestnik
podejmuje decyzję i obraz pomaga sobie coś wyobrazić.

### D73. Części jednego spotkania w jednym szeregu

Lista części szła po dwie w rzędzie, więc spotkanie pierwsze łamało się na
dwa rzędy i wyglądało jak dwa różne spotkania. Teraz szereg ma tyle kolumn,
ile części ma spotkanie: trzy, jedna, trzy. Na telefonie jedna pod drugą,
bo trzy kolumny nie mieszczą tytułu.

Każda część ma swój kolor, różny w obrębie spotkania.
