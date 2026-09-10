# OD ASSESSMENTU DO ZAWODU

## Projekt systemu dopasowania, warstwa druga

Program warsztatów rozwojowo-zawodowych 16–24 | Fundacja Służąc Życiu

**Status:** specyfikacja 1.0, po przebiegu na sucho na trzech profilach kontrolnych.
**Zależności:** silnik obszarowy (istnieje), baza 27 obszarów (istnieje), 152 karty zawodów (istnieją).

---

# 1. CO BYŁO, A CZEGO BRAKOWAŁO

Silnik obszarowy prowadzi uczestnika od odpowiedzi do **obszarów zawodowych**: siedem etapów, cztery liczby decyzyjne, trzy drogi. Działa i został sprawdzony na sucho.

Ale obszar to nie zawód. Uczestnik dowiaduje się, że pasuje do obszaru „rzemiosło i usługi techniczne", w którym jest dziesięć zawodów różniących się od siebie bardziej, niż niektóre obszary między sobą. **Elektryk i fryzjer są w tym samym obszarze.** Silnik obszarowy nie ma czym ich rozróżnić.

Do tego doszedł zasób, którego nie było, gdy silnik powstawał: **każda ze 152 kart zawiera własny profil z sześciu modułów**, pole „kto się nie odnajdzie", koszt wejścia, poziom zagrożenia i ocenę, czy zawód jest celem, czy punktem startu. To są dane, których obszar nie ma, bo są zbyt szczegółowe.

**Warstwa druga wykorzystuje te dane i rozstrzyga cztery rzeczy, których warstwa pierwsza nie rozstrzyga:**

| Pytanie | Warstwa 1 | Warstwa 2 |
|---|---|---|
| Który obszar? | tak | dziedziczy |
| Który zawód w obszarze? | nie | **tak** |
| Czy uczestnika na to stać? | nie | **tak** |
| Czy to cel, czy punkt startu? | nie | **tak** |
| Czy coś w tym zawodzie go zniszczy? | częściowo | **tak, imiennie** |

---

# 2. ARCHITEKTURA CAŁOŚCI

```
SZEŚĆ MODUŁÓW  →  WARSTWA 1  →  WARSTWA 2  →  RAPORT
A1 A2 A3 A4 A5 M1   obszary       zawody      trzy drogi
                    (27)          (152)       + karty
```

**Warstwa 1, silnik obszarowy.** Lejek: wykonalność, ciągnięcie, wzmocnienie tylko w górę, mnożnik zgodności, wynik, poziom wejścia, trzy drogi obszarowe. Wynik: uporządkowana lista 27 obszarów z punktacją 0–100 i uzasadnieniami.

**Warstwa 2, silnik zawodowy.** Bierze punktację obszarów jako bazę i modyfikuje ją profilem karty. Wynik: uporządkowana lista zawodów z pasmami, flagami i ostrzeżeniami.

**Kluczowa zasada relacji między warstwami:** wynik obszaru jest bazą, karta jest korektą. Zawód dobrze dopasowany z obszaru trzeciego może wyprzedzić zawód słabo dopasowany z obszaru pierwszego, ale tylko wtedy, gdy różnica obszarowa jest niewielka. **Karta nie unieważnia obszaru, tylko go dostraja.**

---

# 3. WARSTWA 2, ETAP PO ETAPIE

```
ETAP A   WETO ZAWODOWE       filtry A5 z karty        → usunięcie
ETAP B   MNOŻNIK KARTOWY     A1 A2 A3 z karty         → 0,55 do 1,15
ETAP C   KARA ZA POZIOM      rozjazd drogi dojścia    → 0 do −15%
ETAP D   BARIERA KOSZTOWA    koszt wejścia a zasoby   → 0 do −10%
ETAP E   ANTYPROFIL          „kto się nie odnajdzie"  → ostrzeżenie, nie kara
ETAP F   NORMALIZACJA        najlepszy = 100
ETAP G   ROZSTRZYGANIE       remisy poniżej 3 punktów
ETAP H   GWARANCJE           dosypanie reprezentacji
ETAP I   FLAGI               trampolina, zagrożenie, segment
```

## Etap A: weto zawodowe

Filtry z modułu A5 są w karcie wypisane imiennie: `studia`, `zmiany i noce`, `weekendy`, `widok krwi`, `praca fizyczna`, `wyjazdy`, `praca na wysokości`, `odpowiedzialność za bezpieczeństwo` i pozostałe.

**Jeśli którykolwiek z wymogów gotowości zawodu trafia w weto uczestnika, zawód znika całkowicie.** Nie jest obniżany, nie jest pokazywany z gwiazdką. Znika.

To jest jedyne miejsce w całym systemie, gdzie coś jest usuwane bezwarunkowo, i tak ma pozostać. Uczestnik, który postawił weto na widok krwi, nie ma zobaczyć pielęgniarki jako „propozycji do rozważenia".

**Ograniczenie do trzech wet** obowiązuje jak w warstwie pierwszej. Bez tego uczestnik wykreśla pół bazy w piętnaście sekund.

## Etap B: mnożnik kartowy

Sedno warstwy drugiej. Porównuje profil uczestnika z profilem wypisanym w karcie.

```
a1_pokrycie = |zainteresowania uczestnika ∩ A1 wysoko w karcie| / |A1 wysoko w karcie|
a2_pokrycie = |kompetencje uczestnika    ∩ A2 rdzeń w karcie|  / |A2 rdzeń w karcie|
a3_pokrycie = |bieguny uczestnika        ∩ A3 w karcie|        / |A3 w karcie|

baza    = 0,45 · a1 + 0,35 · a2 + 0,20 · a3
kara_a5 = 0,05 × liczba wymogów gotowości, które uczestnik odrzucił (nie zawetował)
mnożnik = 0,65 + 0,50 · baza − kara_a5,  obcięty do przedziału 0,55 – 1,15
```

**Dlaczego A1 waży najwięcej.** Ta sama logika co w warstwie pierwszej: zainteresowania są osią, kompetencje wzmacniają. Karta wypisuje kompetencje rdzeniowe, czyli te, bez których zawodu się nie wykonuje, więc ich waga jest wysoka, ale nie najwyższa.

**Dlaczego zakres sięga aż 0,55.** Pierwszy przebieg na sucho miał zakres 0,80–1,15 i wyszło z niego, że fryzjer dostaje 81,7 punktu u uczestnika o profilu czysto technicznym, tylko dlatego, że dziedziczy wysoki wynik obszaru 13. Pokrycie A1 wynosiło 0,33, pokrycie A2 wynosiło 0,33, a mnożnik 0,93. **Zbyt wąski zakres nie pozwalał karcie zrobić tego, po co powstała.** Po rozszerzeniu do 0,55–1,15 fryzjer spada na 72,4 i przestaje udawać dopasowanie.

**Odrzucenie a weto.** Odrzucenie w A5, czyli odpowiedź „nie" bez postawienia weta, kosztuje pięć procent za każdy wymóg, maksymalnie piętnaście. Uczestnik, który nie chce weekendów, ale ich nie zawetował, zobaczy kucharza niżej, ale go zobaczy. To jest różnica między „wolałbym nie" a „nie ma mowy" i system musi ją utrzymać.

## Etap C: kara za rozjazd poziomu wejścia

Warstwa pierwsza ustala **poziom wejścia**, na jaki uczestnik jest gotów: szybki, średni, długi, bardzo długi. Karta zawodu ma własny poziom.

```
kara = 5% × (poziom zawodu − poziom uczestnika), tylko gdy różnica dodatnia
```

Zawód krótszy niż gotowość uczestnika **nie jest karany**. Osoba gotowa na studia może zobaczyć zawód bez studiów i to jest wartościowa informacja, a nie błąd.

Zawód dłuższy jest karany łagodnie, nie usuwany. Szesnastolatek deklarujący „szybkie wejście" ma prawo zobaczyć, że istnieje droga dłuższa, prowadząca gdzieś indziej. **Deklaracja z A5 to stan na dziś, a nie zobowiązanie na dekadę.**

## Etap D: bariera kosztowa

**To jest mechanizm, którego nie było w warstwie pierwszej i którego brak był realnym błędem.**

Karty ujawniły coś, czego moduł A5 nie mierzy: droga do części zawodów kosztuje pieniądze, których szesnastolatek z niezamożnej rodziny nie ma i nie będzie miał.

Skrajne przykłady z bazy:
- psychoterapeuta: **○**60 000 do 120 000 zł kosztów własnych, ponoszonych przy jednoczesnej pracy za niewielkie pieniądze
- fotograf: **○**15 000 do 50 000 zł na sprzęt, zanim pojawi się pierwszy poważny klient
- własny warsztat stolarski: **○**60 000 do 300 000 zł
- weterynarz: sześć lat bez dochodu, potem niskie zarobki przez kolejne trzy

Przeciwnie: spawacz, instalator fotowoltaiki, kelner i barista mają wejście za kilka tysięcy albo za zero.

```
kategorie kosztu z karty: zerowy, bardzo niski, niski, średni, wysoki, bardzo wysoki
zasoby uczestnika:        brak, ograniczone, dobre

kara = 10% gdy zasoby = brak i koszt ∈ {wysoki, bardzo wysoki}
kara =  5% gdy zasoby = ograniczone i koszt = bardzo wysoki
```

**Kara jest łagodna celowo.** System nie ma zamykać drogi z powodu pieniędzy, bo istnieją stypendia, kredyty studenckie, dofinansowania z urzędu pracy i pracodawcy finansujący kursy. Ma tylko przesunąć na niższą pozycję zawód, w którym bariera jest realna, **i pokazać ją wprost w raporcie**, zamiast pozwolić odkryć ją po dwóch latach.

**Skąd system bierze informację o zasobach.** Jedno pytanie w module A5, sformułowane bez upokarzania: *„Gdyby droga do zawodu wymagała opłacenia kursów albo sprzętu za kilkanaście tysięcy złotych, na ile realne jest to w Twojej sytuacji w ciągu najbliższych lat?"* Trzy odpowiedzi. **Pytanie nie o dochód rodziny, tylko o wykonalność.**

## Etap E: antyprofil jako ostrzeżenie, nigdy jako kara

Każda karta ma pole „kto się w tym nie odnajdzie", pisane imiennie i konkretnie: *ktoś, kto nie udźwignie regularnego kontaktu ze śmiercią*, *ktoś, kto bierze odmowę do siebie*, *ktoś z lękiem wysokości*, *ktoś, kto nie zniesie stania przez osiem godzin*.

Te zdania kodujemy jako warunki i sprawdzamy przeciwko profilowi uczestnika.

**Trafienie nie obniża wyniku.** Trafienie dopina do zawodu zdanie w raporcie.

Uzasadnienie tej decyzji jest takie samo jak przy zasadzie „kompetencje tylko w górę". **Antyprofil bywa przewidywalnie zawodny.** Osoba, która w A3 wskazała potrzebę ciszy, może świetnie odnaleźć się w zawodzie z ludźmi, jeśli ma inne zasoby. Odejmowanie punktów za coś, co jest hipotezą, zamyka drogi, których zamykać nie wolno.

Za to zdanie w raporcie działa. Uczestnik czyta: *„W tym zawodzie kontakt ze śmiercią jest częścią miesiąca, nie wyjątkiem. Twoje odpowiedzi sugerują, że to może być dla Ciebie trudne. Warto o tym porozmawiać na sesji indywidualnej."* **To jest zaproszenie do rozmowy, nie werdykt.**

## Etap F: normalizacja zamiast obcinania

Pierwszy przebieg dał wyniki 101,2. Obcięcie do 100 powtórzyłoby błąd, który silnik obszarowy już raz popełnił: **saturację, w której trzy najlepsze zawody mają identyczne 100 i ranking przestaje istnieć.**

Rozwiązanie: najlepszy zawód dostaje 100, reszta proporcjonalnie do niego. Uczestnik i tak nie widzi liczb, ale kolejność musi być prawdziwa.

## Etap G: rozstrzyganie remisów

Przebieg na sucho pokazał trzy zawody z identycznym wynikiem 100,0 u profilu rzemieślniczego: elektryk, hydraulik, mechanik. **To jest realny problem, bo uczestnik dostaje trzy równorzędne odpowiedzi i żadnej wskazówki.**

Przy różnicy poniżej trzech punktów rozstrzygają, w tej kolejności:

1. **Niższe zagrożenie przyszłościowe.** Przy równym dopasowaniu wskazujemy zawód bezpieczniejszy.
2. **Niższy koszt wejścia.** Przy równym bezpieczeństwie wskazujemy tańszy.
3. **Krótsza droga dojścia.** Przy równych pozostałych wskazujemy szybszy.

Ta kolejność jest decyzją wartościującą i trzeba ją nazwać: **przy niepewności system wybiera bezpieczeństwo uczestnika, nie atrakcyjność zawodu.**

Efekt widać w przebiegu: u profilu analitycznego devops z wynikiem 88,8 pokazuje się przed testerem z wynikiem 90,6, ponieważ różnica jest mniejsza niż trzy punkty, a tester jest oznaczony jako zawód o wysokim zagrożeniu.

**Warunek działania:** kodowanie kart musi być na tyle szczegółowe, żeby zawody z jednego obszaru realnie się różniły. Remis elektryka z hydraulikiem w prototypie wynika z uproszczenia danych, nie z wady mechaniki, ale przy kodowaniu 152 kart trzeba tego pilnować.

## Etap H: gwarancje reprezentacji

Trzy gwarancje przeniesione z warstwy pierwszej i rozszerzone.

**Co najmniej trzy zawody bez studiów** w każdym wyniku, niezależnie od profilu. Jeśli ranking ich nie zawiera, dosypujemy najwyżej punktowane z pominiętych, wyraźnie oznaczone jako „droga krótsza".

**Co najmniej dwa zawody o szybkim wejściu**, do dwóch lat. Uzasadnienie: uczestnik ma prawo wiedzieć, że istnieje droga, która zaczyna się w przyszłym roku, a nie za sześć lat.

**Przedsiębiorczość zawsze w parze z branżą.** Obszar 27 nie pojawia się samodzielnie. Jeśli wchodzi do wyniku, to jako „własna firma w obszarze X", gdzie X jest najwyżej punktowanym obszarem branżowym uczestnika.

## Etap I: flagi

Flagi nie zmieniają pozycji. Zmieniają to, co uczestnik czyta obok zawodu.

**Flaga trampoliny.** Zawody, które są dobrym wejściem i złym celem: obsługa klienta, specjalista administracyjny, tester manualny, wsparcie techniczne, barista, kelner, opiekun medyczny, doradca w banku, technik farmaceutyczny.

Etykieta w raporcie: **„dobre pierwsze miejsce, warto mieć plan wyjścia"**, plus wskazanie, dokąd ta droga zwykle prowadzi. To wynika wprost z kart i jest jedną z najbardziej praktycznych rzeczy, jakie system może powiedzieć.

**Flaga zagrożenia.** Zawody z oceną „wysokie" albo „bardzo wysokie" w sekcji o przyszłości. Etykieta nie brzmi „ten zawód zniknie", tylko **„ta część zawodu się kurczy, ta rośnie"**, bo tak wynika z kart.

**Flaga segmentu.** Największe odkrycie z pisania bazy: wybór segmentu wewnątrz zawodu waży dziś więcej niż wybór zawodu.

System nie rankuje segmentów, bo byłoby to udawaniem precyzji, której nie ma. Zamiast tego **dopina do zawodu zdanie kierunkowe**:

| Zawód | Zdanie kierunkowe |
|---|---|
| Fotograf | Celuj w wydarzenia, nie w fotografię produktową |
| Grafik | Celuj w systemy wizualne i druk, nie w wykonawstwo |
| Kosztorysant | Ucz się pracy z modelem budynku, nie samego przedmiarowania |
| Mechanik | Celuj w diagnostykę i pojazdy elektryczne |
| Operator CNC | Zaplanuj przejście na ustawiacza w ciągu dwóch, trzech lat |
| Analityk danych | Buduj podstawy statystyczne, nie tylko znajomość narzędzi |
| Redaktor | Celuj w redakcję merytoryczną, nie w korektę |
| Spawacz | Zdobywaj kolejne uprawnienia, TIG jest celem |

---

# 4. PRZEBIEG NA SUCHO

Prototyp z 24 zawodami i trzema profilami kontrolnymi. Pełny kod i wyniki: `silnik_zawodowy.py`.

## Profil rzemieślniczy, 17 lat, weto na studia, brak zasobów

| Zawód | Wynik | Obszar | Mnożnik | A1 | A2 | A3 |
|---|---:|---:|---:|---:|---:|---:|
| elektryk | 100,0 | 88 | 1,15 | 1,00 | 1,00 | 1,00 |
| hydraulik | 100,0 | 88 | 1,15 | 1,00 | 1,00 | 1,00 |
| mechanik | 100,0 | 88 | 1,15 | 1,00 | 1,00 | 1,00 |
| spawacz | 97,1 | 88 | 1,12 | 1,00 | 1,00 | 0,67 |
| fryzjer | 72,4 | 88 | 0,83 | 0,33 | 0,33 | 0,50 |
| kucharz | 46,6 | 55 | 0,86 | 0,67 | 0,33 | 0,00 |

**Weto usunęło sześć zawodów wymagających studiów.** Fryzjer, mimo tego samego obszaru co elektryk, spada o dwadzieścia osiem punktów, bo karta go nie potwierdza. Spawacz dostaje ostrzeżenie antyprofilowe: uczestnik deklaruje potrzebę kontaktu z ludźmi, a to jeden z najbardziej samotnych zawodów w bazie.

## Profil społeczny, 19 lat, weto na widok krwi

| Zawód | Wynik | Obszar | Mnożnik |
|---|---:|---:|---:|
| pedagog specjalny | 100,0 | 84 | 1,09 |
| nauczyciel | 93,9 | 84 | 1,02 |
| lektor języka | 93,2 | 84 | 0,97 |
| opiekun osoby starszej | 92,2 | 81 | 0,99 |
| pracownik socjalny | 92,2 | 81 | 0,99 |
| opiekun medyczny | 73,5 | 68 | 0,94 |

**Weto usunęło pielęgniarkę i ratownika medycznego**, mimo wysokiego wyniku obszaru 16. To jest zachowanie poprawne: uczestnik, który nie zniesie widoku krwi, nie ma czytać o pielęgniarstwie.

Pracownik socjalny dostaje **dwa ostrzeżenia antyprofilowe naraz**: uczestnik deklaruje unikanie konfrontacji i skłonność do zabierania spraw do domu, a karta wymienia oba jako główne powody, dla których ludzie odchodzą z tego zawodu. Zawód zostaje w wyniku, ale z wyraźnym zdaniem do omówienia na sesji.

## Profil analityczny, 22 lata, bez wet, dobre zasoby

| Zawód | Wynik | Obszar | Mnożnik | Flagi |
|---|---:|---:|---:|---|
| programista | 100,0 | 86 | 1,15 | anty: potrzeba ruchu |
| devops | 88,8 | 86 | 1,07 | |
| tester | 90,6 | 86 | 1,04 | trampolina, zagrożony |
| wsparcie techniczne | 59,5 | 86 | 0,68 | trampolina, zagrożony |

**Trzy zawody z tego samego obszaru, wyniki od 59,5 do 100.** To jest dokładnie ta dyskryminacja, której silnik obszarowy nie potrafił zrobić, i główne uzasadnienie istnienia warstwy drugiej.

Devops wyprzedza testera mimo niższego wyniku, bo różnica jest poniżej trzech punktów, a tester jest zawodem zagrożonym.

## Co przebieg wyłapał

| Wada | Objaw | Poprawka |
|---|---|---|
| Zbyt wąski zakres mnożnika | fryzjer 81,7 u profilu technicznego | rozszerzenie z 0,80–1,15 na 0,55–1,15 |
| Wyniki powyżej stu | elektryk 101,2 | normalizacja do najlepszego zamiast obcinania |
| Brak rozstrzygania remisów | trzy zawody po 100,0 bez wskazówki | tie-breaker: bezpieczeństwo, koszt, czas |
| Brak bariery kosztowej | zawody za 100 tysięcy na równi z darmowymi | etap D z pytaniem o wykonalność |

---

# 5. CO UCZESTNIK WIDZI, A CZEGO NIE

## Nigdy nie widzi

Liczb dopasowania · nazw modułów i kodów · porównania z grupą · słowa „nie nadajesz się" · listy zawodów odrzuconych przez weto.

**Ostatni punkt jest istotny.** Uczestnik, który zawetował widok krwi, nie ma zobaczyć komunikatu „usunięto dla Ciebie: pielęgniarka, ratownik medyczny". To zamienia jego własną decyzję w listę strat.

## Widzi

**Trzy drogi**, jak w warstwie pierwszej: najmocniejsze dopasowanie, bardzo dobre dopasowanie, alternatywa najbardziej odmienna.

**Wewnątrz każdej drogi: dwa do czterech konkretnych zawodów**, z pasmem opisowym zamiast liczby.

| Pasmo | Sformułowanie w raporcie |
|---|---|
| 85–100 | To bardzo mocno do Ciebie pasuje |
| 70–84 | To dobrze do Ciebie pasuje |
| 55–69 | To warto rozważyć |
| poniżej 55 | nie pokazywane, chyba że w ramach gwarancji |

**Uzasadnienie przy każdym zawodzie**, złożone z trzech zdań: co Cię tu ciągnie, co masz albo czego się nauczysz, co może przeszkadzać.

**Flagi**, gdy występują: trampolina, kierunek segmentu, bariera kosztowa.

**Kartę zawodu w pełnej wersji** dla zawodów z Drogi A i B, w skróconej dla pozostałych.

---

# 6. KIEDY UCZESTNIK CO WIDZI

Kolejność odsłaniania jest częścią projektu, nie szczegółem technicznym. **Pokazanie zawodów za wcześnie zakotwicza i psuje wszystko, co dzieje się później.**

| Moment | Co uczestnik ma | Co widzi |
|---|---|---|
| Przed spotkaniem 1 | nic | nic |
| Spotkanie 1 | wypełnia A1 | nic, sekcja zablokowana |
| Między 1 a 2 | A2, A3 | nic |
| Spotkanie 2 | A4, A5, M1 | **odblokowanie sekcji A1**: swoje zainteresowania, bez zawodów |
| Między 2 a 3 | silnik liczy | warstwa: jak działam, co jest dla mnie ważne |
| Spotkanie 3 | | **obszary**, jeszcze bez konkretnych zawodów |
| Między 3 a 4 | czas na przetrawienie | |
| Spotkanie 4 | | **zawody i trzy drogi**, pełne karty |
| Sesja 1:1 | | omówienie ostrzeżeń, wybór jednej drogi, pierwszy krok |

**Dlaczego obszary przed zawodami.** Uczestnik, który najpierw zobaczy „elektryk", przestaje myśleć o obszarze i zaczyna reagować na słowo. Uczestnik, który najpierw zobaczy „naprawianie, precyzja, praca rękami", ma szansę rozpoznać w tym siebie, zanim pojawi się etykieta zawodowa.

**Dlaczego ostrzeżenia dopiero na sesji indywidualnej.** Zdanie „w tym zawodzie kontakt ze śmiercią jest częścią miesiąca" przeczytane samotnie w raporcie może zamknąć drogę bez rozmowy. Przeczytane przy prowadzącym otwiera ją.

---

# 7. CZTERY LICZBY DECYZYJNE WARSTWY DRUGIEJ

Warstwa pierwsza miała cztery liczby zamiast czterech wag. Warstwa druga też, i też należy je trzymać jawnie w jednym miejscu.

| Liczba | Wartość | Co robi | Kiedy zmieniać |
|---|---|---|---|
| Dolna granica mnożnika kartowego | **0,55** | jak mocno karta może obniżyć zawód z dobrego obszaru | gdy zawody w jednym obszarze nie odróżniają się w wynikach |
| Górna granica mnożnika | **1,15** | jak mocno karta może wynieść zawód z gorszego obszaru | gdy ranking obszarowy przestaje mieć znaczenie |
| Próg remisu | **3 punkty** | kiedy rozstrzyga bezpieczeństwo zamiast punktów | gdy tie-breaker działa zbyt często albo zbyt rzadko |
| Próg pokazania | **55 punktów** | poniżej czego zawód nie trafia do raportu | gdy uczestnicy dostają za mało albo za dużo pozycji |

**Cała reszta mechaniki wynika z tych czterech liczb i z zawartości kart.** Prowadzący, który po pilotażu chce coś poprawić, zmienia liczbę, nie logikę.

---

# 8. CO TRZEBA ZAKODOWAĆ ZE 152 KART

To jest największa pozostała praca i warto wiedzieć, ile jej jest.

Dla każdego zawodu, ze struktury, którą karty już mają:

| Pole | Skąd w karcie | Format |
|---|---|---|
| obszar | nagłówek | liczba 1–27 |
| poziom wejścia | podtytuł | szybki / średni / długi / bardzo długi |
| studia | podtytuł | tak / nie / częściowo |
| A1 wysoko | tabela profilu | 2–4 kody obszarów zainteresowań |
| A2 rdzeń | tabela profilu | 3 kody kompetencji |
| A2 wspierające | tabela profilu | 2–3 kody |
| A3 | tabela profilu | 2–4 bieguny |
| A4 zaspokaja i nie zaspokaja | tabela profilu | po 2–4 kody |
| A5 gotowość | tabela profilu | 3–6 kodów filtrów |
| M1 | tabela profilu | 1–3 kody |
| antyprofil | „kto się nie odnajdzie" | 3–5 kodów warunków |
| koszt wejścia | „ile kosztuje wejście" | 6 kategorii |
| flaga trampoliny | sekcja o przyszłości | tak / nie |
| zagrożenie | sekcja o przyszłości | 5 stopni |
| zdanie kierunkowe | wniosek z sekcji o przyszłości | tekst albo puste |

**Nakład:** przy dwóch minutach na zawód to około pięciu godzin pracy, wykonalnej w jednej sesji. Karty są już napisane tak, że każde z tych pól ma w nich swoje miejsce, więc jest to przepisanie, nie tworzenie.

**Wymóg jakościowy:** zawody z jednego obszaru muszą mieć realnie różne zbiory A1 i A2, inaczej tie-breaker rozstrzyga wszystko, a mnożnik nie robi nic. Przy kodowaniu warto sprawdzać parami: elektryk kontra hydraulik, kucharz kontra cukiernik, pielęgniarka kontra położna.

---

# 9. DEGRADACJA PRZY SŁABYCH DANYCH

Warstwa druga dziedziczy zasadę z warstwy pierwszej: **system nigdy nie mówi, że nic nie pasuje.**

| Sytuacja | Zachowanie |
|---|---|
| Profil płaski, żaden obszar nie odstaje | Pokaż zawody z trzech obszarów o najwyższej zgodności kartowej, nazwij to „profil jeszcze nieostry, to normalne w Twoim wieku" |
| Sprzeczność A1 z A5 | Pokaż zawód i nazwij sprzeczność wprost: „ciągnie Cię do X, a odrzuciłeś warunek, który jest w tym zawodzie nieuchronny. To jest do rozmowy" |
| Trzy weta wykreślające większość bazy | Pokaż to, co zostało, plus jedno zdanie: „Twoje warunki bardzo zawężają pole, warto sprawdzić na sesji, czy wszystkie trzy są równie twarde" |
| Mniej niż pięć zawodów powyżej progu | Obniż próg do 45 i oznacz wyniki jako wstępne |
| Braki w module A2 albo A3 | Licz mnożnik z dostępnych składowych, przeskaluj wagi, oznacz wynik jako mniej pewny |

---

# 10. TESTY AKCEPTACYJNE

Wszystkie przechodzą w prototypie.

| Test | Warunek | Wynik |
|---|---|---|
| T1 | Weto na widok krwi usuwa pielęgniarkę i ratownika | OK |
| T2 | Weto na studia usuwa wszystkie zawody wymagające studiów | OK |
| T3 | W jednym obszarze karta różnicuje zawody o co najmniej 20 punktów | OK, programista 100 wobec wsparcia technicznego 59,5 |
| T4 | Każdy profil dostaje co najmniej trzy zawody bez studiów | OK |
| T5 | Zawody trampolinowe są oznaczone w wyniku | OK |
| T6 | Bariera kosztowa aktywuje się przy braku zasobów | OK |

**Testy do dopisania przed pilotażem:**

T7: profil płaski nie wywala systemu i produkuje sensowny wynik.
T8: uczestnik z trzema wetami dostaje co najmniej pięć zawodów.
T9: żaden zawód z flagą trampoliny nie trafia do Drogi A jako jedyna pozycja.
T10: dwa różne profile nie dostają identycznej listy.

---

# 11. CO ZOSTAJE DO ZROBIENIA

**Przed pilotażem, konieczne:**

1. Zakodowanie 152 kart według tabeli z rozdziału 8, około pięciu godzin.
2. Dopisanie pytania o zasoby do modułu A5.
3. Testy T7 do T10.
4. Ręczne sprawdzenie wyniku na pięciu realnych, wypełnionych ankietach, zanim system zobaczy grupę.

**Przed pilotażem, zalecane:**

5. Przegląd zdań kierunkowych przez praktyków z branż, których dotyczą.
6. Sprawdzenie parami, czy zawody z jednego obszaru mają różne profile kartowe.

**Po pilotażu:**

7. Kalibracja czterech liczb decyzyjnych na podstawie tego, ile pozycji uczestnicy realnie dostali i czy uznali je za trafne.
8. Zebranie przypadków, w których uczestnik powiedział „to zupełnie nie o mnie", i sprawdzenie, czy wina leży w karcie, w kodowaniu, czy w mechanice.

**Pilotaż papierowy pozostaje w mocy.** Warstwa druga liczy się w arkuszu równie dobrze jak w kodzie, a przy grupie dwunastu osób jest to wykonalne ręcznie w dwie godziny. **Nie budujemy aplikacji przed sprawdzeniem, czy wyniki są trafne.**
