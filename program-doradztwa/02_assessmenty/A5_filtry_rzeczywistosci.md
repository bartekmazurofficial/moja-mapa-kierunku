# ASSESSMENT 5: FILTRY RZECZYWISTOŚCI

## Pełna specyfikacja wdrożeniowa — wersja 1.0

Program warsztatów rozwojowo-zawodowych 16–24 | Fundacja Służąc Życiu

Dokument jest samowystarczalny: model danych, pełna treść 32 pozycji, mechanika wet, algorytm, progi, szablony wyników, przypadki brzegowe, testy akceptacyjne.

---

# 1. CO TEN MODUŁ ROBI I DLACZEGO JEST NAJNIEBEZPIECZNIEJSZY

Wszystkie poprzednie moduły **dodają** informację. Ten jako jedyny **odejmuje** — usuwa z listy rekomendacji zawody, które pasują do profilu, ale zderzają się z realiami, na które uczestnik nie jest gotów.

To czyni go najsilniejszym i najbardziej ryzykownym elementem programu.

**Konkretne zagrożenie.** Siedemnastolatek klika *nie* przy „przeprowadzka do innego miasta", bo dziś nie wyobraża sobie rozstania z przyjaciółmi. Silnik wycina mu połowę dostępnych ścieżek. Za dwa lata ta sama osoba wyjeżdża na studia bez wahania — ale rekomendacji już nie zobaczy.

Cały projekt tego modułu jest podporządkowany temu, żeby to się nie zdarzyło. Stąd trzy rozwiązania opisane niżej: trójstopniowa skala zamiast tak/nie, oddzielenie miękkiej odmowy od twardego weta, i limit trzech wet.

---

# 2. TRZY MECHANIZMY BEZPIECZEŃSTWA

## 2.1 Trzy odpowiedzi, nie dwie

Każda pozycja ma **TAK / MOŻE / NIE**. Brak opcji pośredniej zmusza do deklaracji ostrzejszej niż rzeczywistość.

## 2.2 Miękkie NIE kontra twarde weto

Domyślnie **każde NIE jest miękkie** — działa jako kara punktowa w silniku dopasowania, nie jako usunięcie. Zawód wymagający czegoś, czego uczestnik nie chce, spada w rankingu, ale nadal jest widoczny, z widoczną adnotacją dlaczego.

Twarde weto usuwa zawód całkowicie i uczestnik musi je nadać świadomie, osobnym ruchem.

## 2.3 Limit trzech wet

Uczestnik może wskazać **najwyżej trzy** twarde weta z całej listy. Ekran wyboru wet pojawia się dopiero po wypełnieniu wszystkich 32 pozycji, i tylko spośród tych, przy których zaznaczył NIE.

Limit jest arbitralny, ale konieczny. Bez niego moduł zamienia się w narzędzie do zamykania świata. Z limitem uczestnik musi zdecydować, co naprawdę jest granicą, a co tylko niechęcią.

---

# 3. PRZEBIEG DLA UŻYTKOWNIKA

| Ekran | Czas | Zawartość |
|---|---|---|
| 1. Wprowadzenie | 1,5 min | Instrukcja, zdanie kluczowe |
| 2. Część A | 7–8 min | 32 pozycje TAK / MOŻE / NIE, w 7 blokach tematycznych |
| 3. Część B | 2 min | Wybór najwyżej 3 twardych wet |
| 4. Część C | 1,5 min | Trzy zdania do dokończenia |
| 5. Wynik | — | 2 ekrany zwrotne |

Łącznie **12–13 minut**. Model programu przewiduje 15 minut w spotkaniu 3.

## 3.1 Treść ekranu wprowadzenia

> **Ostatnia rzecz: na co jesteś gotów, a na co nie.**
>
> Zobaczysz listę rzeczy, których różne prace i różne drogi wymagają. Przy każdej odpowiedz szczerze.
>
> **TAK** — dam radę, nie mam z tym problemu
> **MOŻE** — nie wiem, zależy od reszty
> **NIE** — tego bym nie chciał
>
> Odpowiadaj o tym, jak jest **teraz**. Nie próbuj zgadywać, co pomyślisz za pięć lat. Ludzie się zmieniają i my o tym wiemy — dlatego *nie* nie zamyka Ci żadnych drzwi na zawsze.
>
> Jeśli czegoś nigdy nie próbowałeś i naprawdę nie wiesz — zaznacz **MOŻE**. To jest pełnoprawna odpowiedź, a nie unik.

Ostatni akapit jest obowiązkowy. Bez niego uczestnicy traktują MOŻE jako tchórzostwo i uciekają w TAK albo NIE, co psuje cały moduł.

## 3.2 Interakcja

Trzy przyciski w wierszu, jedno stuknięcie. Wszystkie 32 pozycje pogrupowane w 7 bloków tematycznych, każdy blok na osobnym ekranie z nagłówkiem. Kolejność pozycji wewnątrz bloku stała — tu grupowanie tematyczne pomaga uczestnikowi się zorientować i nie ma powodu go rozbijać.

---

# 4. CZĘŚĆ A — 32 POZYCJE

## Blok 1: NAUKA I ZDOBYWANIE UPRAWNIEŃ

| ID | Czy jesteś gotów na… |
|---|---|
| `F01` | studia trwające pięć lat lub dłużej |
| `F02` | studia w ogóle, w jakiejkolwiek formie |
| `F03` | zdawanie trudnych egzaminów zawodowych po studiach |
| `F04` | dokształcanie się przez całe życie zawodowe |
| `F05` | naukę po godzinach, obok pracy |

## Blok 2: MIEJSCE

| ID | Czy jesteś gotów na… |
|---|---|
| `F06` | przeprowadzkę do innego miasta |
| `F07` | pracę albo studia za granicą |
| `F08` | życie daleko od rodziny |
| `F09` | częste wyjazdy służbowe |
| `F10` | pracę w jednym miejscu przez wiele lat |

## Blok 3: CZAS

| ID | Czy jesteś gotów na… |
|---|---|
| `F11` | pracę w weekendy |
| `F12` | pracę zmianową lub nocną |
| `F13` | dyżury i bycie pod telefonem |
| `F14` | nadgodziny w gorących okresach |
| `F15` | nieregularne, zmienne godziny |

## Blok 4: WARUNKI FIZYCZNE

| ID | Czy jesteś gotów na… |
|---|---|
| `F16` | pracę fizyczną, wymagającą siły i wysiłku |
| `F17` | pracę na dworze w każdą pogodę |
| `F18` | stanie lub chodzenie przez większość dnia |
| `F19` | siedzenie przy komputerze przez większość dnia |
| `F20` | kontakt z brudem, zapachami, nieprzyjemnymi warunkami |
| `F21` | widok krwi, ran i ludzkiego cierpienia |

## Blok 5: LUDZIE

| ID | Czy jesteś gotów na… |
|---|---|
| `F22` | ciągły kontakt z ludźmi przez cały dzień |
| `F23` | pracę z małymi dziećmi |
| `F24` | pracę z osobami chorymi lub starszymi |
| `F25` | obsługiwanie niezadowolonych i roszczeniowych ludzi |
| `F26` | częste wystąpienia przed grupą |
| `F27` | pracę w dużej samotności, bez zespołu |

## Blok 6: PIENIĄDZE I RYZYKO

| ID | Czy jesteś gotów na… |
|---|---|
| `F28` | niepewny, zmienny dochód |
| `F29` | prowadzenie własnej działalności |
| `F30` | niskie zarobki przez pierwsze lata |

## Blok 7: ODPOWIEDZIALNOŚĆ

| ID | Czy jesteś gotów na… |
|---|---|
| `F31` | odpowiedzialność za czyjeś zdrowie lub bezpieczeństwo |
| `F32` | pracę pod stałą presją czasu i wyniku |

---

# 5. CZĘŚĆ B — TWARDE WETA

Ekran pokazuje wyłącznie pozycje z odpowiedzią NIE i pyta:

> **Zaznaczyłeś {n} rzeczy, których byś nie chciał.**
>
> Wybierz najwyżej **trzy**, które są dla Ciebie granicą nie do przekroczenia — takie, że nawet praca idealna pod każdym innym względem odpadłaby przez to jedno.
>
> Reszta zostaje jako minus, nie jako koniec rozmowy.

Interfejs blokuje wybór czwartej pozycji. Uczestnik może nie zaznaczyć żadnej.

**Jeśli uczestnik zaznaczył NIE przy trzech pozycjach lub mniej**, ekran nadal się pojawia — samo nadanie weta musi być osobną, świadomą decyzją, a nie automatyczną konsekwencją odpowiedzi.

---

# 6. CZĘŚĆ C — TRZY ZDANIA

Otwarte dokończenia, po jednym polu tekstowym. To jedyny element modułu, w którym uczestnik pisze własnymi słowami.

> Nie chciałbym pracy, w której…
>
> Nie chcę, żeby moja praca wymagała ode mnie…
>
> Nie zgodziłbym się na…

**Po co, skoro część A już zebrała listę.** Lista 32 pozycji jest zamknięta i nie obejmie wszystkiego. Człowiek, którego granicą jest „praca, w której trzeba kogoś oszukiwać" albo „praca, przez którą nie zobaczę dzieci", nie znajdzie tego na liście. Te trzy pola wyłapują granice, których nie przewidzieliśmy.

Odpowiedzi **nie wchodzą do silnika dopasowania**. Trafiają wprost do materiałów na sesję 1:1 i do raportu końcowego, w sekcji *Czego nie chcę*.

Pola mogą zostać puste. Nie blokuj przejścia dalej.

---

# 7. ALGORYTM

## Krok 1 — kodowanie

```
TAK   → G[pozycja] = 1,0
MOZE  → G[pozycja] = 0,5
NIE   → G[pozycja] = 0,0
```

## Krok 2 — status pozycji

```
Weto[pozycja] = true jeśli zaznaczona w części B
```

## Krok 3 — działanie w silniku dopasowania

Każdy zawód w bazie ma przypisane wymagania — podzbiór 32 pozycji z wagą 0–1 określającą, jak silnie zawód tego wymaga.

```
Dla kazdego zawodu Z:
    jesli istnieje pozycja p taka, ze Weto[p] i wymaganie_Z[p] >= 0,6:
        Z zostaje USUNIETY z rekomendacji
        zapisz powod usuniecia
    w przeciwnym razie:
        Kara_Z = suma po p ( wymaganie_Z[p] × (1 − G[p]) )
        Dopasowanie_Z = Dopasowanie_bazowe_Z × (1 − min(Kara_Z / 4 ; 0,5))
```

Trzy rzeczy w tym wzorze są celowe:

**Weto działa tylko przy silnym wymaganiu** (`≥ 0,6`). Zawód, w którym coś zdarza się okazjonalnie, nie odpada przez weto — bo faktycznie nie musi.

**Kara jest ograniczona do 50%.** Nawet komplet niezgodności nie zeruje dopasowania. Zawód spada nisko, ale zostaje widoczny wraz z informacją, co go zepchnęło. To jest różnica między narzędziem, które doradza, a narzędziem, które zamyka.

**MOŻE daje połowę kary.** Nie jest neutralne, bo niepewność to realne ryzyko, ale kosztuje o połowę mniej niż odmowa.

## Krok 4 — wskaźnik zamknięcia

```
Zam = liczba pozycji z odpowiedzia NIE
```

---

# 8. WSKAŹNIKI JAKOŚCI

| Wskaźnik | Próg | Działanie |
|---|---|---|
| **Zamknięcie** `Zam` | `> 20` z 32 | Uczestnik odmawia prawie wszystkiemu; nie stosuj żadnych kar, oznacz flagą, skieruj do 1:1 |
| **Brak odmów** | `Zam = 0` | Prawdopodobnie odpowiadanie pod oczekiwania; kary stosuj, weta nie |
| **Same MOŻE** | ponad 24 odpowiedzi MOŻE | Uczestnik nie ma zdania; kary o połowę słabsze, komunikat o niepewności |
| **Tempo** | część A poniżej 90 s | Nie raportuj |
| **Weta bez odmów** | weto przy pozycji z odpowiedzią TAK lub MOŻE | Niemożliwe — interfejs pokazuje wyłącznie pozycje z NIE |

**Wskaźnik zamknięcia jest najważniejszy.** Uczestnik odmawiający przy ponad dwudziestu pozycjach nie opisuje swoich granic, tylko sygnalizuje coś innego — zmęczenie, lęk przed przyszłością albo bunt wobec całego ćwiczenia. Uruchomienie kar w tej sytuacji dałoby raport, w którym nic nie pasuje, a to jest najgorszy możliwy komunikat dla młodego człowieka.

W takim wypadku silnik pracuje bez filtrów, a prowadzący dostaje sygnał przed sesją 1:1.

---

# 9. MODEL DANYCH

```json
{
  "filters": [
    {"id":"F06","block":2,"block_name":"Miejsce",
     "text":"przeprowadzke do innego miasta"}
  ],
  "occupation_requirements": [
    {"occupation_id":"prod_manager","requirements":{"F19":0.9,"F22":0.8,"F32":0.7}}
  ]
}
```

```json
{
  "participant_id":"uuid","assessment":"A5","version":"1.0",
  "part_a":{"F01":"nie","F02":"moze","F03":"tak"},
  "part_b":["F12","F21"],
  "part_c":{
    "praca_w_ktorej":"...","wymagala_ode_mnie":"...","nie_zgodzilbym_sie":"..."
  }
}
```

**Tabela `occupation_requirements` jest osobnym, dużym zadaniem.** Bez niej moduł zbiera dane, ale nic nie filtruje. Każdy zawód w bazie musi dostać przypisane wymagania z wagami. To praca ekspercka, nie automatyczna.

---

# 10. WYNIK DLA UCZESTNIKA

## Ekran 1 — trzy listy

> **NA TO JESTEŚ GOTÓW**
> {pozycje z odpowiedzią TAK, do 10 najbardziej odróżniających}
>
> **TU NIE MASZ JESZCZE ZDANIA**
> {pozycje z odpowiedzią MOŻE}
>
> **TEGO NIE CHCESZ**
> {pozycje z odpowiedzią NIE, weta wyróżnione}

Środkowa lista dostaje podpis: *„To nie jest brak. To lista rzeczy, których jeszcze nie sprawdziłeś. Kilka z nich może się okazać zupełnie w porządku, kiedy ich spróbujesz."*

## Ekran 2 — co to zmienia

> Twoje odpowiedzi wpłyną na listę zawodów, którą zobaczysz na końcu programu.
>
> **{n} rzeczy oznaczyłeś jako granicę.** Zawody, które ich naprawdę wymagają, nie pojawią się w Twoich rekomendacjach.
>
> Reszta odmów nie usuwa niczego — sprawia tylko, że takie zawody znajdą się niżej, z widoczną informacją dlaczego.

Ten ekran jest obowiązkowy. Uczestnik ma prawo wiedzieć, że jego odpowiedzi coś usuwają, i ma prawo je zmienić, zanim to nastąpi. Dodaj przycisk powrotu do części B.

## Czego moduł nie pokazuje

- **liczby usuniętych zawodów** — to liczba, która przeraża i niczego nie wnosi
- **listy usuniętych zawodów** — usunięte znaczy usunięte; pokazywanie ich niweczy sens filtra
- **porównania z grupą**
- **oceniającego komentarza do odmów** — nigdy „to bardzo zawęża Twoje możliwości"

---

# 11. PRZYPADKI BRZEGOWE

| Sytuacja | Obsługa |
|---|---|
| Zero odpowiedzi NIE | Część B pomijana; brak wet; kary działają normalnie |
| Ponad 20 odpowiedzi NIE | Kary wyłączone całkowicie; flaga do 1:1 |
| Uczestnik nie wybrał żadnego weta | Poprawne i częste; wszystkie odmowy miękkie |
| Weto usuwa wszystkie zawody z top 5 | Silnik pokazuje kolejne w rankingu; nigdy pustej listy |
| Weto powoduje mniej niż 10 zawodów w rekomendacjach | Ostrzeżenie dla prowadzącego, nie dla uczestnika |
| Puste pola w części C | Dozwolone |
| Uczestnik chce zmienić weta po zobaczeniu ekranu 2 | Dozwolone; przycisk powrotu |
| Brak tabeli `occupation_requirements` | Moduł zapisuje dane; filtrowanie nieaktywne, bez błędu |
| Powtórzenie modułu | Osobna próba; filtry zmieniają się najszybciej ze wszystkich modułów — po roku poprzednia próba jest nieaktualna |

---

# 12. TESTY AKCEPTACYJNE

1. **Limit wet.** Interfejs nie pozwala zaznaczyć czwartego weta.
2. **Źródło wet.** Lista w części B zawiera wyłącznie pozycje z odpowiedzią NIE.
3. **Ograniczenie kary.** Przy wszystkich 32 odpowiedziach NIE i braku wet dopasowanie żadnego zawodu nie spada poniżej 50% wartości bazowej.
4. **Próg weta.** Weto przy pozycji o wymaganiu 0,5 nie usuwa zawodu; przy 0,6 usuwa.
5. **Wartość MOŻE.** Przy identycznym zawodzie odpowiedź MOŻE daje dokładnie połowę kary odpowiedzi NIE.
6. **Zamknięcie.** Przy `Zam > 20` żaden zawód nie dostaje kary ani weta.
7. **Nigdy pusto.** Silnik zawsze zwraca co najmniej 10 zawodów, niezależnie od wet.
8. **Praca bez bazy.** Przy braku `occupation_requirements` moduł kończy się bez błędu.
9. **Powrót.** Zmiana wet na ekranie 2 przelicza wynik.

---

# 13. CO ZOSTAJE DO ZROBIENIA

1. **Tabela wymagań zawodowych** — przypisanie 32 pozycji z wagami do każdego zawodu w bazie. To największe pojedyncze zadanie związane z tym modułem i wymaga oceny eksperckiej.
2. **Wywiady poznawcze**, ze szczególnym naciskiem na to, czy uczestnicy rozumieją MOŻE jako pełnoprawną odpowiedź, a nie unik.
3. **Sprawdzenie pozycji `F10`** — „praca w jednym miejscu przez wiele lat" jest jedyną pozycją, przy której NIE oznacza gotowość na więcej, a nie na mniej. Trzeba potwierdzić, że uczestnicy jej nie mylą, albo przepisać.
4. **Ustalenie, czy limit trzech wet jest właściwy.** Po pierwszych kohortach warto sprawdzić rozkład: ile osób wykorzystuje wszystkie trzy, ile ani jednego.
5. **Katamneza.** To jest moduł, którego trafność najłatwiej zweryfikować — po roku wystarczy zapytać, czy uczestnik nadal tak uważa. Rozbieżności powiedzą, jak szybko te deklaracje się starzeją, i czy program nie powinien ich odświeżać.
