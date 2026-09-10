# ASSESSMENT 3: JAK NATURALNIE DZIAŁAM

## Pełna specyfikacja wdrożeniowa — wersja 1.0

Program warsztatów rozwojowo-zawodowych 16–24 | Fundacja Służąc Życiu

Dokument jest samowystarczalny: model danych, pełna treść 72 pozycji, algorytm liczenia, wyprowadzenie środowiska pracy, progi jakości, szablony wyników, przypadki brzegowe, testy akceptacyjne.

---

# 1. CO TEN MODUŁ MIERZY I CZEGO NIE DUBLUJE

**Mierzy tryb działania, nie zdolność i nie upodobanie.** Dwanaście dwubiegunowych wymiarów opisujących, jak uczestnik domyślnie pracuje, kiedy nikt mu nie narzuca sposobu.

## Granica wobec pozostałych modułów

| Moduł | Pytanie | Przykład |
|---|---|---|
| A1 | Czy chciałbyś to robić? | wytresować psa |
| A2 | Czy poszłoby Ci to dobrze? | nauczyć kogoś czegoś, czego się bał |
| **A3** | **Jak domyślnie działasz?** | **wolę mieć plan, zanim zacznę** |
| A4 | Czego chcesz od pracy? | wolność ważniejsza niż stabilność |
| A5 | Na co jesteś gotów? | praca zmianowa: tak / może / nie |

**Zagrożenie, które trzeba świadomie ominąć.** Przykładowe pytanie z pierwotnego modelu programu — *„zespół nic nie zrobił, termin za pięć dni, co zrobisz najbardziej naturalnie: rozpiszę zadania / zrobię sam / przekonam ludzi / znajdę prostszy sposób"* — mapuje się niemal jeden do jednego na kompetencje 21, 25, 14 i 8 z modułu A2. To nie jest pomiar stylu, tylko trzeci pomiar tego samego.

**Reguła redakcyjna:** pozycja A3 nigdy nie opisuje zadania do wykonania. Opisuje **warunek pracy albo odruch**, i obie strony wyboru muszą być tak samo dobre. Jeśli jedna z opcji brzmi jak lepsza odpowiedź, pozycja jest napisana źle.

## Główny produkt modułu

Nie jest nim opis charakteru. Jest nim **wyprowadzone środowisko pracy** — lista warunków, w których uczestnik będzie działał najlepiej, gotowa do porównania z realiami konkretnych zawodów. Sekcja 7.

---

# 2. STRUKTURA: 12 WYMIARÓW DWUBIEGUNOWYCH

Każdy wymiar ma dwa równoprawne bieguny. Nie ma bieguna lepszego.

| # | Kod | Biegun A | Biegun B |
|---|---|---|---|
| 1 | `INI` | Inicjatywa | Reagowanie |
| 2 | `STR` | Potrzeba struktury | Elastyczność |
| 3 | `TEM` | Tempo i przybliżenie | Wolniej i dokładnie |
| 4 | `SAM` | Samodzielnie | Z ludźmi |
| 5 | `GLE` | Głębia, jedno do końca | Szerokość, wiele naraz |
| 6 | `RYZ` | Gotowość na ryzyko | Potrzeba pewności |
| 7 | `DEC` | Chcę decydować | Chcę jasne zadanie |
| 8 | `KON` | Konfrontacja | Utrzymanie zgody |
| 9 | `NOW` | Nowe i nieznane | Sprawdzone |
| 10 | `NAP` | Napęd własny | Napęd z zewnątrz |
| 11 | `RYT` | Równe tempo | Praca zrywami |
| 12 | `OTO` | Cisza i porządek | Ruch i bodźce |

**Dlaczego dwubiegunowo, a nie jak w A1 i A2.** Styl nie ma poziomu — nie da się mieć „dużo struktury" w oderwaniu od tego, ile ma się elastyczności. To zawsze jest położenie na osi. Ranking 1–4 wymuszałby porównywanie rzeczy, które nie są porównywalne, i dałby wynik bez sensownej interpretacji.

**Dlaczego to również dobrze wpływa na dane.** A3 jest trzecim modułem z rzędu. Trzecia identyczna mechanika oznaczałaby klikanie bez czytania. Zmiana formatu jest wymaganiem jakościowym, nie kosmetyką.

---

# 3. PRZEBIEG DLA UŻYTKOWNIKA

| Ekran | Czas | Zawartość |
|---|---|---|
| 1. Wprowadzenie | 1,5 min | Instrukcja, zdanie kluczowe |
| 2. Część A | 7–8 min | 60 wyborów A/B |
| 3. Część B | 3 min | 12 kotwic ważności |
| 4. Wynik | — | 3 ekrany zwrotne |

Łącznie **12–13 minut**. Model programu przewiduje na styl działania 25–30 minut w spotkaniu 1, więc zostaje miejsce na omówienie.

## 3.1 Treść ekranu wprowadzenia

> **Teraz nie pytamy ani o to, co lubisz, ani o to, w czym jesteś dobry.**
>
> **Pytamy, jak Ci się naturalnie pracuje.**
>
> Zobaczysz pary zdań. W każdej wybierz to, które bardziej do Ciebie pasuje — nawet jeśli tylko odrobinę.
>
> **Żadna odpowiedź nie jest lepsza.** Nie ma tu wersji, którą warto zaznaczyć, żeby wyjść na kogoś zaradnego. Obie strony opisują ludzi, którzy świetnie sobie radzą — tylko w innych warunkach.
>
> Odpowiadaj szybko i pierwszym odruchem. To zajmie około 10 minut.

Akapit o braku lepszej odpowiedzi jest obowiązkowy. Bez niego uczestnik odgaduje, czego się od niego oczekuje, i cały moduł mierzy wyobrażenie o dobrym pracowniku.

## 3.2 Interakcja

Dwa duże kafelki, jedno stuknięcie, natychmiastowe przejście dalej. Bez potwierdzania.

- kolejność 60 par losowa dla każdego uczestnika
- **strona wyświetlania biegunów losowana niezależnie dla każdej pary** — biegun A raz po lewej, raz po prawej
- możliwość cofnięcia do poprzedniej pary
- autozapis co 10 par
- pasek postępu

Losowanie strony jest istotne. Przy stałym układzie część uczestników zaczyna klikać jedną stronę z przyzwyczajenia, a wynik przechyla się systematycznie w stronę bieguna A.

---

# 4. CZĘŚĆ A — 60 PAR

Format zapisu: `KOD_n` — biegun A / biegun B.

## INI — Inicjatywa kontra reagowanie

| ID | Biegun A | Biegun B |
|---|---|---|
| `INI_1` | Zaczynam działać, zanim ktoś mnie poprosi | Czekam, aż będzie jasne, czego się ode mnie oczekuje |
| `INI_2` | Sam zgłaszam pomysł na forum | Odzywam się, kiedy ktoś zapyta mnie o zdanie |
| `INI_3` | Kiedy widzę problem, biorę go na siebie | Kiedy widzę problem, zgłaszam go komuś |
| `INI_4` | Wolę wyznaczyć kierunek | Wolę dostać kierunek |
| `INI_5` | Pierwszy ruch należy do mnie | Wolę najpierw zobaczyć, co zrobią inni |

## STR — Potrzeba struktury kontra elastyczność

| ID | Biegun A | Biegun B |
|---|---|---|
| `STR_1` | Muszę mieć plan przed startem | Plan powstaje mi w trakcie |
| `STR_2` | Lubię wiedzieć, co będzie w przyszłym tygodniu | Wolę, żeby tydzień układał się na bieżąco |
| `STR_3` | Zapisuję i odhaczam | Trzymam w głowie i improwizuję |
| `STR_4` | Zmiana planu mnie irytuje | Zmiana planu mnie ożywia |
| `STR_5` | Wolę jasne zasady | Wolę móc naginać zasady |

## TEM — Tempo kontra dokładność

| ID | Biegun A | Biegun B |
|---|---|---|
| `TEM_1` | Wolę skończyć szybko i poprawić później | Wolę zrobić raz, ale porządnie |
| `TEM_2` | Lepiej coś niż nic | Lepiej nic niż byle co |
| `TEM_3` | Nudzi mnie dopracowywanie | Dopracowywanie daje mi satysfakcję |
| `TEM_4` | Decyduję szybko, na wyczucie | Decyduję po sprawdzeniu wszystkiego |
| `TEM_5` | Wolę zdążyć | Wolę mieć pewność |

## SAM — Samodzielnie kontra z ludźmi

| ID | Biegun A | Biegun B |
|---|---|---|
| `SAM_1` | Najlepiej pracuje mi się samemu | Najlepiej pracuje mi się w grupie |
| `SAM_2` | Ludzie wokół mnie rozpraszają | Ludzie wokół mnie napędzają |
| `SAM_3` | Wolę odpowiadać tylko za siebie | Wolę wspólną odpowiedzialność |
| `SAM_4` | Rozwiązuję problem w głowie | Rozwiązuję problem, gadając o nim |
| `SAM_5` | Cały dzień bez rozmów mi nie przeszkadza | Cały dzień bez rozmów mnie męczy |

## GLE — Głębia kontra szerokość

| ID | Biegun A | Biegun B |
|---|---|---|
| `GLE_1` | Wolę jedną rzecz doprowadzić do końca | Wolę mieć kilka rzeczy naraz |
| `GLE_2` | Lubię wchodzić głęboko w jeden temat | Lubię liznąć wielu tematów |
| `GLE_3` | Przerwanie w połowie mnie frustruje | Przeskakiwanie mi nie przeszkadza |
| `GLE_4` | Wolę być ekspertem od jednego | Wolę ogarniać wiele rzeczy |
| `GLE_5` | Kilka spraw naraz mnie rozprasza | Jedna sprawa na raz mnie nudzi |

## RYZ — Ryzyko kontra pewność

| ID | Biegun A | Biegun B |
|---|---|---|
| `RYZ_1` | Wolę spróbować i zobaczyć | Wolę najpierw się upewnić |
| `RYZ_2` | Niepewność mnie ekscytuje | Niepewność mnie męczy |
| `RYZ_3` | Postawiłbym na siebie | Wolę pewne rozwiązanie |
| `RYZ_4` | Porażka to koszt nauki | Porażki wolę unikać |
| `RYZ_5` | Wolę duży zysk z ryzykiem | Wolę mniejszy, ale pewny |

## DEC — Decydowanie kontra jasne zadanie

| ID | Biegun A | Biegun B |
|---|---|---|
| `DEC_1` | Chcę mieć wpływ na to, co się dzieje | Chcę wiedzieć, co mam zrobić |
| `DEC_2` | Wolę decydować i odpowiadać | Wolę wykonać dobrze i nie martwić się resztą |
| `DEC_3` | Denerwuje mnie, gdy decyduje ktoś inny | Ulżyło mi, gdy decyduje ktoś inny |
| `DEC_4` | Chcę znać powód każdej decyzji | Wystarczy mi, że wiem, co robić |
| `DEC_5` | Wolę kierować | Wolę wykonywać |

## KON — Konfrontacja kontra utrzymanie zgody

| ID | Biegun A | Biegun B |
|---|---|---|
| `KON_1` | Mówię wprost, że się nie zgadzam | Wolę nie zaogniać |
| `KON_2` | Spór bywa potrzebny | Spór zwykle szkodzi |
| `KON_3` | Powiem komuś, że zrobił źle | Wolę to przemilczeć |
| `KON_4` | Wolę wyjaśnić na miejscu | Wolę odczekać, aż samo przejdzie |
| `KON_5` | Napięcie mi nie przeszkadza | Napięcie mnie blokuje |

## NOW — Nowe kontra sprawdzone

| ID | Biegun A | Biegun B |
|---|---|---|
| `NOW_1` | Lubię próbować nieznanych rzeczy | Wolę to, co znam |
| `NOW_2` | Nudzi mnie robienie tego samego | Powtarzalność mnie uspokaja |
| `NOW_3` | Chętnie zmieniam sposób działania | Wolę trzymać się tego, co działa |
| `NOW_4` | Nowe miejsce mnie ciekawi | Nowe miejsce mnie stresuje |
| `NOW_5` | Wolę eksperyment | Wolę sprawdzoną receptę |

## NAP — Napęd własny kontra zewnętrzny

| ID | Biegun A | Biegun B |
|---|---|---|
| `NAP_1` | Robię swoje, choć nikt nie patrzy | Potrzebuję, żeby ktoś sprawdzał |
| `NAP_2` | Sam wyznaczam sobie terminy | Bez terminu z zewnątrz odkładam |
| `NAP_3` | Motywuje mnie sama rzecz | Motywuje mnie ocena albo nagroda |
| `NAP_4` | Zaczynam wcześnie | Ruszam, gdy termin blisko |
| `NAP_5` | Nie potrzebuję przypominania | Przypomnienia mi pomagają |

## RYT — Równe tempo kontra zrywy

| ID | Biegun A | Biegun B |
|---|---|---|
| `RYT_1` | Wolę równe tempo codziennie | Wolę zerwać się i zrobić dużo naraz |
| `RYT_2` | Krótkie sesje, ale regularnie | Długie sesje, ale rzadziej |
| `RYT_3` | Nie lubię pracować po nocach | Najlepiej działam w nocnym zrywie |
| `RYT_4` | Wolę rozłożyć na tygodnie | Wolę zrobić w dwa dni |
| `RYT_5` | Rutyna mi służy | Rutyna mnie usypia |

## OTO — Cisza kontra bodźce

| ID | Biegun A | Biegun B |
|---|---|---|
| `OTO_1` | Potrzebuję ciszy, żeby się skupić | Skupiam się mimo hałasu |
| `OTO_2` | Bałagan wokół mi przeszkadza | Bałagan wokół nie robi mi różnicy |
| `OTO_3` | Wolę pracować w jednym stałym miejscu | Wolę zmieniać miejsca |
| `OTO_4` | Przerwy mnie wybijają | Przerwy mi nie przeszkadzają |
| `OTO_5` | Wolę spokojne otoczenie | Wolę, żeby coś się działo wokół |

---

# 5. CZĘŚĆ B — KOTWICE WAŻNOŚCI

Nagłówek: **„Jak bardzo Ci na tym zależy?"**

Dwanaście pozycji, jedna na wymiar, skala 1–5. Treść zależy od wyniku uczestnika w części A — pytamy o **jego** biegun, nie o oba.

| Wymiar | Jeśli wyszedł biegun A | Jeśli wyszedł biegun B |
|---|---|---|
| `INI` | żeby móc sam wychodzić z inicjatywą | żeby ktoś jasno mówił, czego oczekuje |
| `STR` | żeby wiedzieć z góry, co się będzie działo | żeby móc działać bez sztywnego planu |
| `TEM` | żeby móc pracować szybko | żeby mieć czas na dokładność |
| `SAM` | żeby móc pracować samodzielnie | żeby mieć ludzi wokół siebie |
| `GLE` | żeby móc skupić się na jednej rzeczy | żeby mieć różnorodne zadania |
| `RYZ` | żeby móc podejmować ryzyko | żeby mieć poczucie bezpieczeństwa |
| `DEC` | żeby móc decydować | żeby ktoś inny brał decyzje na siebie |
| `KON` | żeby móc mówić wprost | żeby atmosfera była spokojna |
| `NOW` | żeby ciągle działo się coś nowego | żeby dało się opanować rutynę |
| `NAP` | żeby nikt nie stał nad Tobą | żeby ktoś pilnował terminów |
| `RYT` | żeby dało się pracować równym tempem | żeby dało się pracować zrywami |
| `OTO` | żeby było cicho i spokojnie | żeby coś się działo wokół |

**Po co ta część.** Wynik części A mówi, gdzie uczestnik jest na osi. Nie mówi, czy to dla niego ważne. Człowiek może być wyraźnie samodzielny, a jednocześnie bez problemu znosić pracę w zespole. Dopiero połączenie położenia z ważnością daje warunek środowiskowy, którego naprawdę warto pilnować przy wyborze zawodu.

Kotwica pojawia się dopiero po części A, bo jej treść zależy od wyniku. To wymaga policzenia części A przed wyświetleniem części B.

---

# 6. ALGORYTM LICZENIA

## Krok 1 — położenie na osi

```
A[wymiar] = liczba wyborów bieguna A       → [0, 5]
Poz[wymiar] = A / 5 × 100                  → [0, 100]
```

`Poz = 100` to czysty biegun A, `Poz = 0` to czysty biegun B, `Poz = 50` to środek.

## Krok 2 — wyrazistość

```
Wyr[wymiar] = |Poz − 50| × 2               → [0, 100]
```

`Wyr = 100` przy wynikach 0/5 i 5/5. `Wyr = 20` przy 2/5 i 3/5.

## Krok 3 — ważność

```
Wag[wymiar] = kotwica z części B (1–5)
Wagn[wymiar] = (Wag − 1) / 4 × 100         → [0, 100]
```

## Krok 4 — siła warunku środowiskowego

```
Sila[wymiar] = √( Wyr × Wagn )
```

Średnia geometryczna, nie arytmetyczna. Warunek liczy się dopiero wtedy, gdy uczestnik jest jednocześnie **wyraźny** i **przywiązany**. Wyraźny, ale obojętny — nie jest wymaganiem. Ważny, ale niezdecydowany — nie wiadomo, w którą stronę. Średnia arytmetyczna zamazałaby oba przypadki.

## Krok 5 — klasyfikacja

| Warunek | Etykieta | Co robi |
|---|---|---|
| `Sila ≥ 65` | **WARUNEK KLUCZOWY** | Wchodzi do środowiska pracy; silnik dopasowania stosuje karę za niezgodność |
| `40 ≤ Sila < 65` | **PREFERENCJA** | Pokazywana uczestnikowi, bez wpływu na dopasowanie |
| `Sila < 40` | **OBOJĘTNE** | Nie pokazywana |

---

# 7. WYPROWADZENIE ŚRODOWISKA PRACY

To jest właściwy produkt modułu i powód, dla którego środowisko pracy nie jest osobnym assessmentem.

Każdy wymiar z `Sila ≥ 65` generuje jedno zdanie warunku:

| Wymiar | Biegun A → warunek | Biegun B → warunek |
|---|---|---|
| `INI` | przestrzeń na własne inicjatywy | jasne oczekiwania i polecenia |
| `STR` | przewidywalny plan i harmonogram | swoboda w układaniu pracy |
| `TEM` | tempo ważniejsze niż wykończenie | czas na porządne dopracowanie |
| `SAM` | możliwość pracy w pojedynkę | stały kontakt z ludźmi |
| `GLE` | skupienie na jednym obszarze | różnorodne zadania |
| `RYZ` | dopuszczalne ryzyko i niepewność | stabilne, przewidywalne warunki |
| `DEC` | realny wpływ na decyzje | jasno określony zakres zadań |
| `KON` | kultura mówienia wprost | atmosfera bez napięć |
| `NOW` | ciągła zmiana i nowe rzeczy | możliwość opanowania rutyny |
| `NAP` | brak kontroli nad głową | zewnętrzne terminy i przypomnienia |
| `RYT` | równomierne obciążenie | praca projektowa, zrywami |
| `OTO` | ciche, uporządkowane miejsce | żywe, ruchliwe otoczenie |

Powstaje lista 0–12 zdań pod nagłówkiem **ŚRODOWISKO, W KTÓRYM BĘDZIESZ DZIAŁAŁ NAJLEPIEJ**, posortowana malejąco po `Sila`.

**Jeśli lista jest pusta** (żaden wymiar nie osiągnął 65), pokaż trzy najwyższe preferencje z dopiskiem, że na tym etapie uczestnik jest elastyczny środowiskowo i to jest przewaga, nie brak.

---

# 8. WSKAŹNIKI JAKOŚCI

| Wskaźnik | Wzór | Próg | Działanie |
|---|---|---|---|
| **Wyrazistość ogólna** | średnia `Wyr` po 12 wymiarach | `< 25` | Profil nieukształtowany — pokaż tylko 3 najwyższe, bez warunków kluczowych |
| **Stronniczość układu** | odsetek wyborów po tej samej stronie ekranu | `> 0,70` | Klikanie pozycji, nie treści — nie raportuj |
| **Tempo** | czas części A | `< 2,5 min` | Nie raportuj, zaproponuj powtórzenie |
| **Skrajność kotwic** | wszystkie 12 kotwic identyczne | — | `Sila` liczona wyłącznie z `Wyr`; flaga |
| **Sprzeczność wewnętrzna** | liczba wymiarów z wynikiem dokładnie 2/5 lub 3/5 | `> 8` | Uczestnik nie rozpoznaje siebie w tych osiach; sygnał dla prowadzącego |

**Wskaźnik stronniczości układu jest specyficzny dla tego modułu.** Ponieważ strona wyświetlania jest losowana, wybór zawsze tej samej strony ekranu jest matematycznie niemożliwy przy uważnym odpowiadaniu i jednoznacznie wskazuje na klikanie bez czytania. Żaden inny moduł nie ma tak czystego testu.

## Etykieta pewności

```
średnia Wyr ≥ 45   → wyrazny
25 ≤ srednia < 45  → umiarkowany
średnia Wyr < 25   → jeszcze_nieuksztaltowany
```

---

# 9. MODEL DANYCH

```json
{
  "dimensions": [
    {"code":"INI","name":"Inicjatywa","pole_a":"Inicjatywa","pole_b":"Reagowanie",
     "env_a":"przestrzen na wlasne inicjatywy","env_b":"jasne oczekiwania i polecenia",
     "anchor_a":"zeby moc sam wychodzic z inicjatywa","anchor_b":"zeby ktos jasno mowil, czego oczekuje"}
  ],
  "items": [
    {"id":"INI_1","dimension":"INI",
     "text_a":"Zaczynam dzialac, zanim ktos mnie poprosi",
     "text_b":"Czekam, az bedzie jasne, czego sie ode mnie oczekuje"}
  ]
}
```

```json
{
  "participant_id":"uuid","assessment":"A3","version":"1.0",
  "part_a":[
    {"item_id":"INI_1","choice":"a","displayed_left":"b","ms_spent":3100}
  ],
  "part_b":{"INI":4,"STR":2,"TEM":5}
}
```

**Zapisuj `displayed_left`.** Bez tego pola nie da się policzyć wskaźnika stronniczości układu, który jest jedynym twardym testem uważności w tym module.

---

# 10. WYNIK DLA UCZESTNIKA

## Ekran 1 — trzy zdania

```
Najczęściej: {biegun_1} + {biegun_2} + {biegun_3}
Rzadziej:    {biegun_przeciwny_1} + {biegun_przeciwny_2}
```

Przykład wypełnienia:

> **Najczęściej:** ruszasz sam · działasz szybko · lubisz mieć wpływ
> **Rzadziej:** czekasz na dokładną instrukcję · trzymasz się jednej rzeczy do końca

## Ekran 2 — dwanaście osi

Suwak dla każdego wymiaru z zaznaczonym położeniem, nazwy obu biegunów po bokach. Wymiary posortowane malejąco po `Wyr`, żeby najwyraźniejsze były u góry.

Wymiary z `Wyr < 20` wyświetl wyszarzone z podpisem *w tej sprawie jesteś elastyczny*.

## Ekran 3 — środowisko pracy

Lista z sekcji 7 pod nagłówkiem **ŚRODOWISKO, W KTÓRYM BĘDZIESZ DZIAŁAŁ NAJLEPIEJ**, plus zdanie: *„To nie jest lista wymagań, tylko warunków, przy których będzie Ci łatwiej. Im więcej z nich spełnia dana praca, tym mniejszym kosztem będziesz w niej działał."*

## Czego moduł nie pokazuje

- **nazwy typu ani kodu wymiaru** — żadnego `INI`, żadnego „jesteś Inicjatorem"
- **oceniającego języka** — nigdy „brak inicjatywy", zawsze „wolisz jasne oczekiwania"
- **porównania z grupą**
- **surowych `Poz`, `Wyr`, `Sila`**
- **wymiarów obojętnych** — pusty warunek to szum, nie informacja

---

# 11. PRZYPADKI BRZEGOWE

| Sytuacja | Obsługa |
|---|---|
| Wszystkie 12 wymiarów w środku | Brak warunków kluczowych; komunikat o elastyczności, nie o braku |
| Uczestnik pyta, który biegun jest lepszy | Interfejs odpowiada, że żaden; treść przygotowana z góry |
| Kotwice wypełnione przed częścią A | Niemożliwe — treść kotwic zależy od wyniku A; blokada kolejności |
| Przerwanie w połowie części A | Autozapis co 10 par; wznowienie w ciągu 48 h |
| Wynik dokładnie 50 na wymiarze | Niemożliwe przy 5 pozycjach; wartości to 0, 20, 40, 60, 80, 100 |
| Powtórzenie modułu | Osobna próba; przy odstępie poniżej 30 dni oznacz jako powtórzenie |

---

# 12. TESTY AKCEPTACYJNE

1. **Zakres.** `Poz` przyjmuje wyłącznie wartości 0, 20, 40, 60, 80, 100.
2. **Symetria.** Odwrócenie wszystkich wyborów daje `Poz' = 100 − Poz` na każdym wymiarze.
3. **Losowanie strony.** W 60 parach odsetek pozycji z biegunem A po lewej mieści się w 40–60%.
4. **Kolejność części.** Część B nie da się wyświetlić przed policzeniem części A.
5. **Średnia geometryczna.** Przy `Wyr = 100` i `Wagn = 0` wynik `Sila = 0`, nie 50.
6. **Pusty wynik.** Przy braku wymiarów z `Sila ≥ 65` moduł kończy się poprawnie i pokazuje trzy preferencje.
7. **Determinizm.** Ten sam komplet odpowiedzi daje identyczny raport niezależnie od kolejności prezentacji.

---

# 13. CO ZOSTAJE DO ZROBIENIA

1. **Przegląd ekspercki 60 par** pod kątem symetrii atrakcyjności. Metoda: pokaż samą parę bez kontekstu i zapytaj oceniającego, która strona brzmi jak lepsza odpowiedź. Jeśli oceniający wskazuje którąś, para wymaga przepisania. To jest jedyne zagrożenie, które może zniszczyć ten moduł.
2. **Wywiady poznawcze** na tej samej grupie co przy A1 i A2.
3. **Sprawdzenie wymiarów `NAP` i `RYT`** — są najbliżej wzajemnie i najbardziej podatne na to, że uczestnik uzna je za to samo pytanie.
4. **Weryfikacja zdań środowiskowych z sekcji 7** przez osobę prowadzącą warsztaty, pod kątem tego, czy da się je realnie porównać z opisami zawodów.
