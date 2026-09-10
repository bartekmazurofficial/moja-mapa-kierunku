# AUDYT PRZED BUDOWĄ PLATFORMY

## Czy czegoś brakuje i czy kolejność jest właściwa

Program warsztatów rozwojowo-zawodowych 16–24 | Fundacja Służąc Życiu

**Cel dokumentu:** rozstrzygnąć wątpliwości projektowe, zanim powstanie kod. Zmiana w modelu danych po napisaniu aplikacji kosztuje wielokrotnie więcej niż teraz.

---

# CZĘŚĆ I: CO MAMY

| Element | Stan |
|---|---|
| Sześć modułów assessmentowych | gotowe, z pełnymi treściami pozycji |
| Baza 27 obszarów zawodowych | gotowa |
| 152 karty zawodów, 22 pola każda | gotowe |
| Silnik obszarowy, warstwa 1 | gotowy, sprawdzony na sucho |
| Silnik zawodowy, warstwa 2 | gotowy, sprawdzony na sucho |
| Audyt rozdzielczości | wykonany, 133 pozycje rozróżnialne |
| Raport, 20 sekcji w 5 warstwach | gotowy |
| Scenariusze 4 spotkań | gotowe, minuta po minucie |
| Sesja indywidualna i panel | gotowe |

**To jest kompletny program.** Poniżej to, co przy przeglądzie całości okazało się brakujące albo źle ułożone.

---

# CZĘŚĆ II: TRZY LUKI

## Luka 1: nie pytamy, co uczestnikowi idzie w szkole

**To jest najpoważniejszy brak w całym systemie.**

Program jest skierowany do osób 16–24, z których większość ma przed sobą wybór rozszerzeń, kierunku studiów albo rekrutację. A system **ani razu nie pyta, z czym radzą sobie w nauce.**

Skutki są konkretne i kosztowne:

| Zawód | Twardy warunek | Czy system to sprawdza |
|---|---|---|
| Data scientist | matematyka na poziomie studiów ścisłych | **nie** |
| Lekarz, weterynarz | biologia i chemia rozszerzone, bardzo wysokie progi | **nie** |
| Architekt | zdany egzamin z rysunku | **nie** |
| Inżynier budownictwa | matematyka i fizyka | **nie** |
| Muzyk | szkoła muzyczna od dzieciństwa | **nie** |
| Analityk finansowy | matematyka rozszerzona | **nie** |

System może dziś wskazać siedemnastolatkowi z matematyką podstawową i tróją z fizyki drogę na data scientist jako najmocniejsze dopasowanie. **Wszystko w profilu będzie się zgadzać, a droga będzie zamknięta.** To jest dokładnie ten rodzaj błędu, którego program ma unikać.

**Rozwiązanie:** moduł A0, opisany w części III.

## Luka 2: wszyscy są traktowani tak samo, niezależnie od etapu

Szesnastolatek przed wyborem liceum, dziewiętnastolatek przed maturą i dwudziestodwulatek po licencjacie zadają zupełnie różne pytania. **System daje im identyczny wynik i identyczną rekomendację.**

Co powinno się różnić:

| Etap | Czego naprawdę potrzebuje | Czym powinien być pierwszy krok |
|---|---|---|
| **16–17, przed wyborem szkoły albo rozszerzeń** | które rozszerzenia otwierają, a które zamykają drogi | wybór przedmiotów, nie zawodu |
| **18–19, przed maturą** | które kierunki i jakie progi | konkretne uczelnie i wymagania |
| **20–22, w trakcie studiów albo po nich** | pierwsza praca, zmiana kierunku, uzupełnienie | rekrutacja albo kurs |
| **22–24, po studiach albo po przerwie** | wejście na rynek, przekwalifikowanie | konkretna oferta albo uprawnienia |

**Rozwiązanie:** etap zbierany w A0 i sterujący **treścią rekomendacji**, nie doborem zawodów. Ten sam wynik silnika, inne zakończenie raportu.

To jest tania zmiana o dużym efekcie. **Dla szesnastolatka rekomendacja „wybierz rozszerzoną matematykę i fizykę, bo otwierają cztery z pięciu Twoich dróg" jest wartościowsza niż nazwa zawodu.**

## Luka 3: nie pytamy o ograniczenia, które karty wymieniają jako wykluczające

Karty zawierają twarde przeciwwskazania. Assessment ich nie zbiera.

| Karta mówi | System nie wie |
|---|---|
| Alergia na mąkę jest przeciwwskazaniem do cukiernictwa | czy uczestnik ma alergie |
| Lęk wysokości wyklucza instalatora fotowoltaiki | czy uczestnik ma lęk wysokości |
| Wada wzroku wyklucza spawacza i optyka | czy uczestnik dobrze widzi |
| Ubytek słuchu wyklucza realizatora dźwięku | czy uczestnik dobrze słyszy |
| Alergie kontaktowe wykluczają fryzjera i kosmetologa | czy uczestnik ma alergie skórne |
| Problemy z kręgosłupem to przeciwwskazanie do opieki i rzemiosła | czy uczestnik ma ograniczenia ruchowe |
| Praca zmianowa: część ludzi nigdy się nie adaptuje | nic |

**Rozwiązanie:** trzy pytania w A0, sformułowane jako informacja, nie jako badanie lekarskie:

> „Czy jest coś w Twoim zdrowiu, o czym warto wiedzieć przy dobieraniu ścieżek? Na przykład alergie, ograniczenia ruchowe, wzrok, słuch, lęk wysokości. **To nie jest badanie i nikt tego nie sprawdzi. Chodzi o to, żeby nie proponować Ci drogi, która jest dla Ciebie zamknięta.**"

Odpowiedź opcjonalna, z możliwością pominięcia. Działa jako filtr miękki: obniża wynik i dopina ostrzeżenie, nie usuwa.

---

# CZĘŚĆ III: MODUŁ A0, PUNKT STARTU

Nowy moduł, **osiem minut, na początku spotkania pierwszego**. Nie jest assessmentem, jest metryczką, ale zasila silnik.

## Zawartość

**1. Etap** — jedno pytanie zamknięte. Szkoła podstawowa · liceum lub technikum, klasa · po maturze · w trakcie studiów · po studiach · przerwa w nauce · pracuję.

**2. Przedmioty** — dwie listy. *„Z którymi przedmiotami radzisz sobie najlepiej?"* i *„Które sprawiają Ci największą trudność?"* Po trzy wskazania. **Nie pytamy o oceny.**

**3. Rozszerzenia** — jeśli etap na to wskazuje. *„Jakie rozszerzenia masz albo planujesz?"*

**4. Co już robiłeś** — pole wielokrotnego wyboru plus tekst. Praca dorywcza · wolontariat · własne projekty · hobby uprawiane od lat · pomoc w rodzinnym biznesie · nic z tego. **To jest darmowy i mocny sygnał**, dziś całkowicie pomijany.

**5. Miejsce i mobilność** — wieś lub małe miasto · średnie miasto · duże miasto. Plus: *„Czy jesteś gotów przeprowadzić się dla pracy albo nauki?"* z odpowiedziami tak, może, nie.

**6. Ograniczenia** — pytanie opisane w luce 3, opcjonalne.

## Jak A0 wpływa na silnik

| Dane | Działanie |
|---|---|
| Przedmioty trudne | **Twardy filtr na kierunki studiów**, miękki na zawody. Zawód zostaje, kierunek wymagający tego przedmiotu dostaje ostrzeżenie |
| Przedmioty mocne | Wzmocnienie, wyłącznie w górę, jak kompetencje w warstwie pierwszej |
| Etap | Steruje treścią rekomendacji i pierwszego kroku. **Nie zmienia doboru zawodów** |
| Mobilność „nie" | Filtr na zawody wymagające dużych miast: konsultant, bankowość inwestycyjna, produkcja filmowa, brand manager |
| Miejsce „duże miasto" plus mobilność „nie" | Ostrzeżenie przy zawodach wymagających wsi: leśnik, agronom, rolnictwo |
| Ograniczenia zdrowotne | Filtr miękki plus ostrzeżenie |
| Co już robił | Wzmocnienie odpowiednich kompetencji, wyłącznie w górę |

**Zasada zachowana z warstwy pierwszej: A0 może podnieść i ostrzec, ale usuwa tylko w dwóch przypadkach**, przy jawnym braku mobilności i przy ograniczeniu zdrowotnym wymienionym w karcie jako wykluczające.

---

# CZĘŚĆ IV: KOLEJNOŚĆ, JEDNA REALNA WADA

## Wada: filtry rzeczywistości przed wizją życia

Obecnie na spotkaniu trzecim: **wartości (22 min) → filtry (17 min) → wizja życia (45 min)**.

**To jest zła kolejność i trzeba ją odwrócić.**

Moduł A5 zawiera weta, które **usuwają zawody całkowicie**. Uczestnik stawia je, zanim w ogóle zastanowi się, jakiego życia chce. Weto na „praca zmianowa" postawione w piętnastej minucie spotkania jest odruchem. To samo weto postawione po czterdziestu pięciu minutach pisania o tym, jak ma wyglądać jego zwykły dzień, jest decyzją.

**Ta różnica ma bezpośrednie konsekwencje**, bo weto jest jedynym mechanizmem w całym systemie, który usuwa bezwarunkowo.

## Poprawiona kolejność spotkania trzeciego

| Było | Ma być |
|---|---|
| Wartości → Filtry → Wizja życia | **Wizja życia → Wartości → Filtry** |

**Nowy przebieg spotkania 3:**

| Czas | Moduł |
|---|---|
| 0–6 | Wejście |
| 6–51 | **Moja wizja życia**, 45 min |
| 51–59 | Przerwa |
| 59–81 | **Wartości**, 22 min |
| 81–98 | **Filtry rzeczywistości**, 17 min |
| 98–115 | Podsumowanie |
| 115–120 | Zapowiedź |

Do instrukcji przy filtrach dochodzi jedno zdanie, które domyka logikę spotkania:

> „Przed chwilą opisałeś, jak chcesz żyć. **Teraz zaznacz warunki pracy, które są z tym nie do pogodzenia.** Wykluczyć możesz maksymalnie trzy i one usuwają zawody całkowicie, więc wybierz te, które naprawdę nie przejdą."

## Co pozostaje bez zmian i dlaczego

**Spotkanie 1: zainteresowania, potem styl działania.** Oba odpowiadają na pytanie „kim jestem", więc trzymają się razem. Zainteresowania pierwsze, bo są osią całego silnika i najłatwiejsze do wypełnienia na wejściu.

**Spotkanie 2: predyspozycje, potem ranking umiejętności.** Kolejność od zewnątrz do wewnątrz: najpierw scenariusze, w których uczestnik reaguje, potem samoocena, która wymaga już pewnego rozeznania w sobie. Odwrócenie kazałoby mu oceniać własne kompetencje, zanim je zobaczył nazwane.

**Obszary przed zawodami na spotkaniu 4, z przerwą między nimi.** Uzasadnione osobno w scenariuszach.

---

# CZĘŚĆ V: JEDNA RZECZ DO SPRAWDZENIA W PILOTAŻU

**Podejrzenie redundancji między modułem A2 a rankingiem umiejętności.**

Spotkanie drugie zawiera 64 minuty assessmentów. Oba moduły odpowiadają na to samo pytanie: **w czym poradziłbyś sobie najlepiej.** Różnią się metodą, nie konstruktem.

- **A2**, 45 bloków MaxDiff plus miniscenariusze, mierzy 30 kompetencji
- **Ranking 1–4**, zestawy zadań układane od najlepszego do najgorszego

Model programu traktuje je jako osobne assessmenty i ma ku temu argument: **pomiar tego samego dwiema metodami daje pewniejszy wynik.** To jest uczciwa metodologia.

Ale 64 minuty to jedna czwarta całego czasu programu poświęcona jednemu konstruktowi. **Trzeba sprawdzić, czy to się opłaca.**

**Test w pilotażu:** policzyć korelację między wynikami obu modułów. Jeśli przekracza 0,80, drugi moduł nie wnosi nic i można go skrócić o połowę, uwalniając trzydzieści minut. Jeśli jest niższa, mierzą różne rzeczy i zostają oba.

**To jest jedna linijka kodu w silniku i trzeba ją napisać przed pilotażem**, żeby dane zebrały się od razu.

---

# CZĘŚĆ VI: CZEGO ŚWIADOMIE NIE DODAJEMY

Rozważone i odrzucone.

**Testu osobowości.** Kusi, bo wygląda profesjonalnie. Model programu odrzuca go słusznie: uczestnik dostaje literę albo typ i nie wie, co z tym zrobić. Wszystko, co potrzebne z osobowości, jest już w module stylu działania, ale wyrażone przez zachowania, nie przez etykiety.

**Testu zdolności poznawczych.** Model odrzuca to wprost i ma rację. Wynik „rozumowanie werbalne 76" nic szesnastolatkowi nie mówi, a źle znosi porównanie. Do tego wymagałby normalizacji na próbie, której nie mamy.

**Ankiety o oczekiwaniach rodziców.** Rozważone poważnie, bo presja rodzinna jest realna i często decydująca. Odrzucone, bo **uczestnik odpowiadałby nieszczerze**, a temat i tak wychodzi na sesji indywidualnej, gdzie jest miejsce na rozmowę. Zostaje w skryptach sesji.

**Testowania zawodów i zadań domowych.** Model wyklucza to wprost. Zgoda: to są rzeczy, których szesnastolatek nie zrobi, a ich brak zamienia się w poczucie porażki.

**Więcej niż trzech wet.** Ograniczenie jest twarde i ma zostać. Bez niego uczestnik wykreśla pół bazy w piętnaście sekund.

---

# CZĘŚĆ VII: CO SIĘ ZMIENIA W SPECYFIKACJI

## W modelu danych

**Nowa tabela `punkt_startu`:** etap, przedmioty mocne, przedmioty trudne, rozszerzenia, doświadczenie, miejsce, mobilność, ograniczenia.

**Nowe pola w tabeli `zawody`:** wymagane przedmioty maturalne, wymaganie dużego miasta, wymaganie terenu poza miastem, przeciwwskazania zdrowotne. **Wszystkie cztery są już w kartach**, trzeba je tylko zakodować razem z resztą.

## W silniku

Nowy **etap 0 warstwy pierwszej**: filtr A0 przed filtrem A5.

Nowy **etap J warstwy drugiej**: dobór treści rekomendacji według etapu edukacji.

## W scenariuszach

Spotkanie 1: **dodanie 8 minut na A0** na początku, skrócenie wprowadzenia z 12 do 10 minut i rozgrzewki z 8 do 6.

Spotkanie 3: **odwrócenie kolejności modułów**.

## W raporcie

Nowa sekcja, między profilem a zawodami: **„Twój punkt startu"**. Etap, mocne przedmioty, co już robiłeś, co to otwiera.

Zmieniona sekcja końcowa: **rekomendacja i pierwszy krok zależne od etapu.**

---

# CZĘŚĆ VIII: CO ROBIĆ, W JAKIEJ KOLEJNOŚCI

## Krok 1: domknięcie projektu, przed kodem

| Zadanie | Nakład |
|---|---|
| Napisanie modułu A0, sześć bloków pytań | 2 h |
| Dopisanie do silnika etapu filtrowania A0 i etapu doboru rekomendacji | 2 h |
| Poprawka kolejności w scenariuszu spotkania 3 | 30 min |
| Cztery warianty zakończenia raportu według etapu | 3 h |
| **Kodowanie 152 kart, z czterema nowymi polami** | **6 h** |
| 20 pytań rozstrzygających do klastrów | 3 h |
| Kody różnicujące dla 7 zawodów przesłoniętych | 1 h |
| Ponowne uruchomienie audytu osiągalności | 10 min |

**Razem około osiemnastu godzin.** To jest wszystko, czego brakuje do kompletnej specyfikacji.

## Krok 2: prompt do Claude Code

**Dopiero po kroku pierwszym**, bo prompt musi zawierać ostateczny model danych. Zmiana schematu po napisaniu aplikacji kosztuje wielokrotnie więcej niż teraz.

Prompt będzie zawierał: model danych z siedmiu tabel · specyfikację obu warstw silnika · jedenaście ekranów · reguły odsłaniania treści · komplet testów regresyjnych.

## Krok 3: pilotaż

Dwunastu uczestników, jeden prowadzący. **Aplikacja w wersji minimalnej albo w ogóle arkusz**, bo pilotaż sprawdza trafność wyników, a nie działanie kodu.

## Krok 4: kalibracja

Cztery liczby decyzyjne warstwy pierwszej, cztery warstwy drugiej, korelacja A2 z rankingiem, przypadki „to nie o mnie".

---

# WERDYKT

**Program jest kompletny co do struktury i ma trzy luki co do treści.** Najpoważniejsza to brak pytania o przedmioty szkolne, bo pozwala systemowi wskazać drogę formalnie zamkniętą. Druga to traktowanie szesnastolatka i dwudziestodwulatka identycznie. Trzecia to brak pytania o ograniczenia, które karty same wymieniają jako wykluczające.

**Wszystkie trzy zamyka jeden nowy moduł na osiem minut.**

**Kolejność jest właściwa poza jednym miejscem.** Filtry rzeczywistości muszą przyjść po wizji życia, a nie przed nią, bo weto jest jedynym mechanizmem usuwającym bezwarunkowo i nie powinno być odruchem.

**Osiemnaście godzin dzieli nas od kompletnej specyfikacji gotowej do przekazania do budowy.**

Mogę zacząć od modułu A0, bo bez niego model danych nie jest ostateczny, a prompt do Claude Code musi go zawierać.
