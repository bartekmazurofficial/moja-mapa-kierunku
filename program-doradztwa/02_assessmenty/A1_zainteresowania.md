# ASSESSMENT 1: ZAINTERESOWANIA
## Pełna specyfikacja wdrożeniowa — wersja 2.0

Program warsztatów rozwojowo-zawodowych 16–24 | Fundacja Służąc Życiu

**Dokument przeznaczony dla osoby lub narzędzia budującego moduł w aplikacji.** Zawiera wszystko, co potrzebne do implementacji: model danych, pełną treść pozycji, gotowy plan 36 bloków, algorytm liczenia, progi jakości, szablony wyników i przypadki brzegowe. Nie wymaga sięgania do żadnych innych źródeł.

---

# 1. CO TEN MODUŁ ROBI

Uczestnik w wieku 16–24 lat wykonuje w aplikacji ćwiczenie trwające **25–30 minut**. Na wyjściu powstaje profil jego zainteresowań zawodowych: ranking 24 obszarów, dwie osie ogólne, lista obszarów niesprawdzonych oraz etykieta pewności wyniku.

Wynik zasila dwie rzeczy: **ekran zwrotny dla uczestnika** (natychmiast po zakończeniu) oraz **silnik dopasowania do zawodów i kierunków studiów** (osobny moduł aplikacji).

## Granica konstruktu — reguła nadrzędna

Ten assessment mierzy **wyłącznie atrakcyjność samej czynności**. Nie mierzy zdolności, skuteczności ani pewności siebie. Cała treść pozycji i wszystkie teksty interfejsu muszą tę granicę utrzymać. Jeśli w trakcie rozbudowy modułu pojawi się pokusa dodania pytania typu „czy poszłoby Ci to dobrze”, należy ją odrzucić — to jest przedmiot osobnego Assessmentu 4 i zmieszanie obu psuje cały silnik dopasowania.

**Zdanie kluczowe, które musi paść w instrukcji:** *„Nie pytamy, czy Ci to wyjdzie. Pytamy, czy chciałbyś to robić.”*

---

# 2. STRUKTURA POJĘCIOWA

```
POZIOM 3   2 osie          Rzeczy–Ludzie  |  Dane–Idee
              ▲
POZIOM 2   6 rodzin        R I A S E C   ← warstwa wewnętrzna, NIGDY nie pokazywana
              ▲
POZIOM 1   24 obszary      właściwa treść wyniku
              ▲
POZIOM 0   168 pozycji     konkretne czynności (144 aktywne + 24 rezerwowe)
```

Rodziny odpowiadają modelowi RIASEC. Są w systemie wyłącznie po to, żeby moduł dopasowania mógł korzystać z istniejących opisów zawodów. **Uczestnik nigdy nie widzi liter ani nazw typów.**

| Rodzina | Obszary | Nazwa robocza |
|---|---|---|
| R | 1–4 | Rzeczy, ręce, teren |
| I | 5–8 | Dociekanie |
| A | 9–12 | Tworzenie |
| S | 13–16 | Ludzie |
| E | 17–20 | Wpływ |
| C | 21–24 | Porządek |

## 24 obszary

| ID | Nazwa techniczna | Rodzina | Etykieta dla uczestnika |
|---|---|:---:|---|
| 1 | Naprawa i mechanika | R | Naprawianie i rozgryzanie, jak coś działa |
| 2 | Budowanie i wytwarzanie | R | Robienie rzeczy własnymi rękami |
| 3 | Przyroda, zwierzęta, rośliny | R | Zwierzęta, rośliny, przyroda |
| 4 | Ciało, ruch, teren | R | Ruch, teren, praca ciałem |
| 5 | Technologia i programowanie | I | Technologia i programowanie |
| 6 | Nauka i eksperyment | I | Dociekanie, jak działa świat |
| 7 | Zdrowie i ciało człowieka | I | Zdrowie i ludzkie ciało |
| 8 | Liczby, dane, wzorce | I | Liczby i wyciąganie wniosków z danych |
| 9 | Obraz i design | A | Obraz, wygląd, projektowanie |
| 10 | Słowo i pisanie | A | Pisanie i praca ze słowem |
| 11 | Dźwięk i muzyka | A | Dźwięk i muzyka |
| 12 | Scena, film, występ | A | Scena, film, występowanie |
| 13 | Opieka i troska | S | Opiekowanie się drugim człowiekiem |
| 14 | Nauczanie i tłumaczenie | S | Uczenie i tłumaczenie innym |
| 15 | Rozmowa i wsparcie | S | Rozmowa i wspieranie w trudnościach |
| 16 | Wspólnota i służba | S | Wspólnota i robienie czegoś dla innych |
| 17 | Sprzedaż i przekonywanie | E | Przekonywanie ludzi |
| 18 | Prowadzenie ludzi | E | Prowadzenie ludzi i decydowanie |
| 19 | Przedsiębiorczość i ryzyko | E | Własne przedsięwzięcia i ryzyko |
| 20 | Spór, prawo, negocjacje | E | Argumentowanie, spór, negocjacje |
| 21 | Porządkowanie i systematyzowanie | C | Porządkowanie i układanie w system |
| 22 | Precyzja i kontrola | C | Precyzja i wyłapywanie błędów |
| 23 | Pieniądze i rozliczenia | C | Pieniądze i rozliczenia |
| 24 | Planowanie i logistyka | C | Planowanie i ogarnianie logistyki |

Nazwa techniczna służy do logiki i mapowania na zawody. Etykieta dla uczestnika jest jedyną, która pojawia się na ekranie.

---

# 3. MODEL DANYCH

## 3.1 Definicje statyczne (seed aplikacji)

```json
{
  "families": [
    {"code":"R","name":"Rzeczy, ręce, teren","areas":[1,2,3,4]},
    {"code":"I","name":"Dociekanie","areas":[5,6,7,8]},
    {"code":"A","name":"Tworzenie","areas":[9,10,11,12]},
    {"code":"S","name":"Ludzie","areas":[13,14,15,16]},
    {"code":"E","name":"Wpływ","areas":[17,18,19,20]},
    {"code":"C","name":"Porządek","areas":[21,22,23,24]}
  ],
  "areas": [
    {
      "id": 1,
      "family": "R",
      "name_internal": "Naprawa i mechanika",
      "label_user": "Naprawianie i rozgryzanie, jak coś działa",
      "anchor_text": "naprawiać rzeczy i szukać przyczyny awarii",
      "feedback_high_desc": "...",
      "feedback_high_consequence": "...",
      "feedback_low": "..."
    }
  ],
  "items": [
    {"id":"A01_1","area":1,"text":"Rozebrać zepsute urządzenie...","desirability":"normal","active":true}
  ],
  "blocks": [
    {"index":1,"items":["A10_6","A16_1","A20_1","A22_3"]}
  ]
}
```

`desirability` przyjmuje `normal` albo `high`. Pozycje `high` brzmią imponująco lub heroicznie. Plan bloków gwarantuje maksymalnie jedną taką pozycję na blok — bez tego wymuszony wybór przestaje chronić przed odpowiadaniem „pod obraz siebie”.

`active: false` oznacza pozycję rezerwową — nie wchodzi do 36 bloków, czeka na wymianę po wywiadach poznawczych.

## 3.2 Zapis odpowiedzi uczestnika

```json
{
  "participant_id": "uuid",
  "assessment": "A1",
  "version": "2.0",
  "started_at": "2026-09-09T10:00:00Z",
  "finished_at": "2026-09-09T10:21:34Z",
  "part_a": [
    {
      "block_index": 1,
      "presented_order": ["A20_1","A22_3","A10_6","A16_1"],
      "ranking": {"A10_6":1,"A20_1":2,"A22_3":3,"A16_1":4},
      "ms_spent": 15400,
      "revisions": 1
    }
  ],
  "part_b": {"1": 3, "2": 5, "3": 1, "...": 0},
  "part_c": {"1": false, "2": true, "3": false, "...": false}
}
```

**Zapisuj `presented_order` i `ms_spent`.** Pierwsze pozwala później sprawdzić, czy kolejność wyświetlania wpływa na wybory (efekt pozycji). Drugie jest wejściem do wskaźnika niedbałego odpowiadania. Bez tych dwóch pól nie da się kontrolować jakości danych.

---

# 4. PRZEBIEG DLA UŻYTKOWNIKA

| Ekran | Czas | Zawartość |
|---|---|---|
| 1. Wprowadzenie | 2 min | Instrukcja, zdanie kluczowe |
| 2. Blok próbny | 2 min | 2 bloki treningowe, nie liczą się do wyniku |
| 3. Część A | 12–14 min | 36 bloków, ranking 1–4 |
| 4. Część B | 4 min | 24 kotwice, skala 1–5 |
| 5. Część C | 2 min | 24 pytania o doświadczenie, tak/nie |
| 6. Wynik | — | 4 ekrany zwrotne |

## 4.1 Treść ekranu wprowadzenia

> **Za chwilę zobaczysz zestawy po cztery różne czynności.**
>
> Twoim zadaniem jest ustawić je w kolejności — od tej, którą najchętniej byś robił, do tej, którą najmniej chętnie.
>
> **Nie pytamy, czy Ci to wyjdzie. Pytamy, czy chciałbyś to robić.**
>
> Nie zastanawiaj się, czy to dobry zawód, czy dużo się na tym zarabia i czy ktoś byłby z Ciebie dumny. Pytamy tylko o samą czynność.
>
> W każdym zestawie ustawiasz wszystkie cztery, nawet jeśli żadna Ci się nie podoba albo podobają Ci się wszystkie. Chodzi o kolejność, nie o ocenę. Nie ma dobrych i złych odpowiedzi. Zaufaj pierwszemu odruchowi — to zwykle najlepszy wybór.
>
> To zajmie około 20 minut.

Ostatnie zdanie akapitu o kolejności jest krytyczne. Bez niego uczestnicy zacinają się na blokach jednorodnych („wszystkie cztery są nudne”) i albo klikają losowo, albo rezygnują.

## 4.2 Interakcja w bloku

**Stukanie w kolejności, nie przeciąganie.** Pierwsze stuknięcie w kafelek nadaje mu numer 1, drugie stuknięcie w inny kafelek numer 2, i tak dalej. Czwarty przypisuje się automatycznie i blok przechodzi dalej po 400 ms.

Przeciąganie elementów na telefonie jest wolne i frustrujące. Przy 36 blokach to różnica kilku minut i wyraźnie wyższy odsetek porzuceń.

Wymagania:
- ponowne stuknięcie w kafelek z numerem cofa przypisanie i przenumerowuje resztę
- widoczny pasek postępu („blok 14 z 36”)
- możliwość cofnięcia się do poprzedniego bloku
- autozapis po każdym bloku
- **kolejność bloków losowa dla każdego uczestnika**
- **kolejność 4 kafelków wewnątrz bloku losowa**
- brak licznika czasu na ekranie (podnosi pośpiech i psuje dane)

Zestaw 36 bloków jest **taki sam dla wszystkich**. Losowana jest tylko kolejność. Dzięki temu wyniki są porównywalne między uczestnikami i między kohortami.

## 4.3 Przerwa między częściami

Po części A wstaw ekran przejściowy z jednym zdaniem: *„Najtrudniejsze za Tobą. Zostały dwie krótkie części.”* Część A jest męcząca poznawczo i bez wyraźnego domknięcia część B zbiera gorsze dane.

---

# 5. CZĘŚĆ A — PEŁNY PLAN 36 BLOKÓW

Plan wygenerowany algorytmicznie i zweryfikowany. Spełnione ograniczenia:

- każdy z 24 obszarów pojawia się **dokładnie 6 razy** (24 × 6 = 144 = 36 × 4)
- każda ze 144 aktywnych pozycji użyta **dokładnie raz**
- w żadnym bloku nie ma dwóch pozycji z tej samej rodziny
- każda rodzina występuje w dokładnie 24 z 36 bloków
- maksymalnie **jedna** pozycja o podwyższonej atrakcyjności na blok
- pokryte **193 z 240** możliwych par obszarów, żadna para nie powtarza się więcej niż 2 razy

**Nie modyfikuj tego planu bez ponownego wygenerowania.** Podmiana pojedynczej pozycji łamie bilans i przekrzywia wynik na korzyść nadreprezentowanego obszaru.

° = pozycja o podwyższonej atrakcyjności społecznej

### Blok 1

- `A10_6` — Znaleźć jedno zdanie, które oddaje sens całej sprawy  *(obszar 10, A)*
- `A16_1` — Zorganizować zbiórkę dla potrzebujących  *(obszar 16, S)*
- `A20_1` — Bronić czyjejś racji w sporze  *(obszar 20, E)*
- `A22_3` — Porównać dwie wersje i wyłapać różnice  *(obszar 22, C)*

### Blok 2

- `A03_6` — Obserwować, jak rośliny reagują na zmianę warunków  *(obszar 3, R)*
- `A08_2` — Sprawdzić, czy dwie rzeczy naprawdę mają ze sobą związek  *(obszar 8, I)*
- `A12_1` — Zagrać rolę w przedstawieniu  *(obszar 12, A)*
- `A15_3` — Rozmawiać z kimś o tym, co czuje  *(obszar 15, S)*

### Blok 3

- `A02_4` — Postawić od zera coś, czego wcześniej nie było  *(obszar 2, R)*
- `A05_4` — Zautomatyzować czynność powtarzaną codziennie  *(obszar 5, I)*
- `A17_1` — Przekonać kogoś, żeby spróbował czegoś nowego  *(obszar 17, E)*
- `A21_3` — Poukładać dane w tabelę według jasnych zasad  *(obszar 21, C)*

### Blok 4

- `A07_3` — Ustalić, skąd biorą się czyjeś objawy  *(obszar 7, I)*
- `A11_1` — Nauczyć się nowego utworu na instrumencie  *(obszar 11, A)*
- `A13_2` — Pomóc starszej osobie w codziennych czynnościach  *(obszar 13, S)*
- `A24_4` — Przygotować harmonogram, który naprawdę się spina  *(obszar 24, C)*

### Blok 5

- `A01_3` — Znaleźć przyczynę dziwnego dźwięku w silniku  *(obszar 1, R)*
- `A09_1` — Zaprojektować plakat na wydarzenie  *(obszar 9, A)*
- `A14_6` — Sprawdzić, czy ktoś naprawdę zrozumiał  *(obszar 14, S)*
- `A18_5` — Ustalić, kto się czym zajmie  *(obszar 18, E)*

### Blok 6

- `A04_3` — Działać w akcji ratunkowej w terenie °  *(obszar 4, R)*
- `A06_6` — Porównać dwa wyjaśnienia i ocenić, które lepiej pasuje do faktów  *(obszar 6, I)*
- `A19_4` — Zbudować coś od zera, nie wiedząc, czy się uda  *(obszar 19, E)*
- `A23_6` — Zaplanować odkładanie pieniędzy na duży cel  *(obszar 23, C)*

### Blok 7

- `A08_3` — Zebrać wyniki ankiety i zobaczyć, co z nich wynika  *(obszar 8, I)*
- `A09_3` — Zrobić serię zdjęć jednego miejsca  *(obszar 9, A)*
- `A20_5` — Sprawdzić, co w danej sytuacji mówią przepisy  *(obszar 20, E)*
- `A23_5` — Policzyć, ile naprawdę kosztuje dany plan  *(obszar 23, C)*

### Blok 8

- `A04_4` — Nauczyć się prowadzić ciężki pojazd  *(obszar 4, R)*
- `A05_1` — Napisać program, który sam coś liczy  *(obszar 5, I)*
- `A10_1` — Napisać opowiadanie  *(obszar 10, A)*
- `A13_1` — Zaopiekować się małym dzieckiem przez cały dzień  *(obszar 13, S)*

### Blok 9

- `A01_5` — Wyregulować sprzęt, żeby chodził równo  *(obszar 1, R)*
- `A15_2` — Pomóc dwóm osobom dogadać się po kłótni  *(obszar 15, S)*
- `A19_2` — Zainwestować własne pieniądze w pomysł  *(obszar 19, E)*
- `A21_4` — Zrobić spis wszystkiego, co jest na stanie  *(obszar 21, C)*

### Blok 10

- `A03_3` — Rozpoznawać ptaki po głosie  *(obszar 3, R)*
- `A14_5` — Prowadzić korepetycje  *(obszar 14, S)*
- `A17_6` — Prowadzić rozmowę, której celem jest umowa  *(obszar 17, E)*
- `A24_1` — Rozpisać plan wyjazdu dla trzydziestu osób  *(obszar 24, C)*

### Blok 11

- `A02_6` — Wyciąć i dopasować elementy tak, żeby idealnie pasowały  *(obszar 2, R)*
- `A06_5` — Dowiedzieć się, dlaczego zjawisko zachodzi właśnie tak  *(obszar 6, I)*
- `A12_3` — Prowadzić wydarzenie na scenie °  *(obszar 12, A)*
- `A18_6` — Zebrać ludzi i wyznaczyć kierunek działania  *(obszar 18, E)*

### Blok 12

- `A07_2` — Opatrzyć ranę i zaopiekować się poszkodowanym  *(obszar 7, I)*
- `A12_6` — Wymyślić, jak scena ma wyglądać, żeby zapadła w pamięć  *(obszar 12, A)*
- `A16_3` — Pojechać gdzieś po to, żeby pomagać obcym ludziom °  *(obszar 16, S)*
- `A21_6` — Doprowadzić zabałaganione miejsce do porządku  *(obszar 21, C)*

### Blok 13

- `A11_6` — Śpiewać w zespole albo chórze  *(obszar 11, A)*
- `A15_6` — Pomóc komuś nazwać, co się z nim dzieje  *(obszar 15, S)*
- `A20_2` — Przeczytać umowę i wyłapać, co jest w niej niekorzystne  *(obszar 20, E)*
- `A22_4` — Pilnować, żeby każdy element spełniał wymagania  *(obszar 22, C)*

### Blok 14

- `A03_5` — Sadzić drzewa i dbać o teren zielony  *(obszar 3, R)*
- `A07_1` — Uczyć się, jak działa ludzkie ciało  *(obszar 7, I)*
- `A14_2` — Przygotować zajęcia dla grupy dzieci  *(obszar 14, S)*
- `A19_5` — Podjąć decyzję, mimo że brakuje pewnych informacji  *(obszar 19, E)*

### Blok 15

- `A02_5` — Pracować przy remoncie pomieszczenia  *(obszar 2, R)*
- `A08_6` — Zauważyć powtarzający się schemat w liczbach  *(obszar 8, I)*
- `A10_2` — Poprawić czyjś tekst, żeby lepiej się go czytało  *(obszar 10, A)*
- `A24_2` — Ustalić kolejność działań tak, żeby nic się nie zablokowało  *(obszar 24, C)*

### Blok 16

- `A04_2` — Prowadzić rozgrzewkę i trening dla grupy  *(obszar 4, R)*
- `A07_4` — Prowadzić ćwiczenia dla osoby po kontuzji  *(obszar 7, I)*
- `A09_5` — Zaprojektować, jak ma wyglądać aplikacja w telefonie  *(obszar 9, A)*
- `A17_3` — Opowiedzieć o rzeczy tak, żeby ktoś jej zapragnął  *(obszar 17, E)*

### Blok 17

- `A01_1` — Rozebrać zepsute urządzenie i sprawdzić, co jest w środku  *(obszar 1, R)*
- `A13_5` — Towarzyszyć osobie z niepełnosprawnością  *(obszar 13, S)*
- `A20_3` — Wziąć udział w debacie po stronie przeciwnej niż własne zdanie  *(obszar 20, E)*
- `A23_4` — Pilnować, żeby faktury i rachunki się zgadzały  *(obszar 23, C)*

### Blok 18

- `A05_2` — Zbudować stronę internetową  *(obszar 5, I)*
- `A11_2` — Nagrać i zmontować podcast  *(obszar 11, A)*
- `A16_6` — Regularnie poświęcać swój czas dla innych, za darmo  *(obszar 16, S)*
- `A23_3` — Sprawdzić, gdzie w wydatkach uciekają pieniądze  *(obszar 23, C)*

### Blok 19

- `A01_4` — Naprawić coś, co przestało działać w domu  *(obszar 1, R)*
- `A06_2` — Powtarzać pomiar tak długo, aż wynik będzie pewny  *(obszar 6, I)*
- `A10_3` — Napisać tekst, po którym ktoś zmieni zdanie  *(obszar 10, A)*
- `A22_1` — Sprawdzić dokument i znaleźć wszystkie błędy  *(obszar 22, C)*

### Blok 20

- `A02_1` — Zbudować z drewna półkę na książki  *(obszar 2, R)*
- `A09_4` — Narysować postać od podstaw  *(obszar 9, A)*
- `A13_3` — Być przy kimś, kto źle się czuje  *(obszar 13, S)*
- `A19_6` — Zrezygnować ze stałego dochodu dla własnego projektu  *(obszar 19, E)*

### Blok 21

- `A05_5` — Sprawdzić, dlaczego program działa nie tak, jak powinien  *(obszar 5, I)*
- `A15_4` — Zauważyć, że ktoś udaje, że wszystko gra  *(obszar 15, S)*
- `A18_2` — Wziąć odpowiedzialność, kiedy nikt nie chce decydować °  *(obszar 18, E)*
- `A24_3` — Zorganizować transport i sprzęt na wydarzenie  *(obszar 24, C)*

### Blok 22

- `A03_2` — Prowadzić ogród przez cały sezon  *(obszar 3, R)*
- `A11_5` — Wybrać muzykę pasującą do sceny w filmie  *(obszar 11, A)*
- `A16_4` — Zaangażować się w sprawę ważną dla okolicy  *(obszar 16, S)*
- `A18_1` — Podzielić zadania w grupie i pilnować terminów  *(obszar 18, E)*

### Blok 23

- `A04_5` — Wejść na trudny szlak z ciężkim plecakiem  *(obszar 4, R)*
- `A08_4` — Zamienić stos danych w prosty wykres  *(obszar 8, I)*
- `A11_4` — Ustawić nagłośnienie na koncercie  *(obszar 11, A)*
- `A21_5` — Nadać nazwy i kategorie chaotycznemu zbiorowi  *(obszar 21, C)*

### Blok 24

- `A06_4` — Sprawdzić w laboratorium, co się stanie po zmieszaniu substancji  *(obszar 6, I)*
- `A14_1` — Wytłumaczyć koledze materiał, którego nie rozumie  *(obszar 14, S)*
- `A20_4` — Doprowadzić dwie strony do porozumienia w sprawie pieniędzy  *(obszar 20, E)*
- `A21_1` — Uporządkować bałagan w dużym zbiorze plików  *(obszar 21, C)*

### Blok 25

- `A05_3` — Poskładać komputer z części  *(obszar 5, I)*
- `A14_4` — Znaleźć sposób, żeby zawiła rzecz stała się prosta  *(obszar 14, S)*
- `A19_3` — Wymyślić, jak zarobić na tym, co się potrafi  *(obszar 19, E)*
- `A22_6` — Zauważyć szczegół, który wszyscy przeoczyli  *(obszar 22, C)*

### Blok 26

- `A03_1` — Zająć się chorym zwierzęciem  *(obszar 3, R)*
- `A06_1` — Zaplanować doświadczenie, żeby sprawdzić, czy coś jest prawdą  *(obszar 6, I)*
- `A09_6` — Poprawić brzydko wyglądającą rzecz, żeby cieszyła oko  *(obszar 9, A)*
- `A15_5` — Zapytać o coś, o czym trudno mówić  *(obszar 15, S)*

### Blok 27

- `A04_6` — Ćwiczyć tak długo, aż ciało zrobi coś nowego  *(obszar 4, R)*
- `A12_2` — Zmontować film z nagranych materiałów  *(obszar 12, A)*
- `A20_6` — Zbudować argumentację krok po kroku  *(obszar 20, E)*
- `A24_6` — Zaplanować dzień tak, żeby wszystko zdążyło się wydarzyć  *(obszar 24, C)*

### Blok 28

- `A02_3` — Zrobić coś ręcznie z gliny, metalu lub drewna  *(obszar 2, R)*
- `A07_6` — Pomagać przy zabiegu medycznym °  *(obszar 7, I)*
- `A18_4` — Powiedzieć komuś wprost, że robi coś źle  *(obszar 18, E)*
- `A23_2` — Ułożyć budżet na cały rok  *(obszar 23, C)*

### Blok 29

- `A10_4` — Prowadzić bloga albo newsletter  *(obszar 10, A)*
- `A15_1` — Wysłuchać kogoś, kto przeżywa trudny czas  *(obszar 15, S)*
- `A17_2` — Sprzedać coś osobie, która się waha  *(obszar 17, E)*
- `A23_1` — Rozliczyć wydatki z wyjazdu grupowego  *(obszar 23, C)*

### Blok 30

- `A01_2` — Wymienić dętkę w rowerze  *(obszar 1, R)*
- `A08_1` — Znaleźć w długiej tabeli miejsce, w którym coś się nie zgadza  *(obszar 8, I)*
- `A16_5` — Rozmawiać z ludźmi o tym, co w życiu ma sens  *(obszar 16, S)*
- `A17_4` — Zdobyć pierwszych chętnych dla nowego pomysłu  *(obszar 17, E)*

### Blok 31

- `A03_4` — Pracować przy zwierzętach gospodarskich  *(obszar 3, R)*
- `A10_5` — Przetłumaczyć tekst na inny język  *(obszar 10, A)*
- `A13_4` — Nakarmić i dopilnować kogoś, kto sam sobie nie poradzi  *(obszar 13, S)*
- `A21_2` — Wymyślić system, w którym wszystko łatwo znaleźć  *(obszar 21, C)*

### Blok 32

- `A02_2` — Uszyć albo przerobić ubranie  *(obszar 2, R)*
- `A05_6` — Ustawić sieć i sprzęt tak, żeby wszystko się łączyło  *(obszar 5, I)*
- `A12_4` — Nagrywać materiały wideo  *(obszar 12, A)*
- `A19_1` — Zacząć własny mały biznes °  *(obszar 19, E)*

### Blok 33

- `A04_1` — Spędzić cały dzień pracy na dworze, w ruchu  *(obszar 4, R)*
- `A09_2` — Dobrać kolory i czcionki tak, żeby całość dobrze wyglądała  *(obszar 9, A)*
- `A16_2` — Prowadzić spotkanie grupy młodzieżowej  *(obszar 16, S)*
- `A22_5` — Wykonać zadanie tak, żeby nie było ani jednej pomyłki  *(obszar 22, C)*

### Blok 34

- `A06_3` — Czytać o tym, jak działa wszechświat  *(obszar 6, I)*
- `A11_3` — Ułożyć własną melodię  *(obszar 11, A)*
- `A17_5` — Odpowiedzieć na zarzut w sposób, który go rozbraja  *(obszar 17, E)*
- `A24_5` — Dopilnować, żeby dostawa dotarła na czas  *(obszar 24, C)*

### Blok 35

- `A08_5` — Policzyć, która z opcji wychodzi taniej  *(obszar 8, I)*
- `A12_5` — Wcielić się w kogoś zupełnie do siebie niepodobnego  *(obszar 12, A)*
- `A14_3` — Pokazać komuś krok po kroku, jak coś zrobić  *(obszar 14, S)*
- `A18_7` — Ocenić, kto najlepiej nadaje się do danego zadania  *(obszar 18, E)*

### Blok 36

- `A01_6` — Złożyć mebel z części według instrukcji  *(obszar 1, R)*
- `A07_5` — Wiedzieć, jak działają poszczególne leki  *(obszar 7, I)*
- `A13_6` — Zadbać o to, żeby ktoś czuł się bezpiecznie  *(obszar 13, S)*
- `A22_2` — Zmierzyć coś dokładnie, kilka razy pod rząd  *(obszar 22, C)*

---

# 6. CZĘŚĆ B — 24 KOTWICE ABSOLUTNE

Nagłówek ekranu: **„Jak bardzo chciałbyś się tym zajmować?”**

Skala pięciostopniowa: **1 — w ogóle · 2 · 3 · 4 · 5 — bardzo**

Kolejność 24 pozycji losowa dla każdego uczestnika. Wszystkie na jednym przewijanym ekranie, nie po jednej — tu chodzi o szybkie, porównawcze odpowiadanie.

| Obszar | Treść pozycji |
|:---:|---|
| 1 | naprawiać rzeczy i szukać przyczyny awarii |
| 2 | robić rzeczy własnymi rękami |
| 3 | zajmować się zwierzętami i roślinami |
| 4 | pracować w ruchu, w terenie, ciałem |
| 5 | programować i pracować z technologią |
| 6 | badać i sprawdzać, jak działa świat |
| 7 | zajmować się zdrowiem i ludzkim ciałem |
| 8 | pracować z liczbami i danymi |
| 9 | projektować to, jak rzeczy wyglądają |
| 10 | pisać i pracować z tekstem |
| 11 | pracować z dźwiękiem i muzyką |
| 12 | występować, grać, tworzyć filmy |
| 13 | opiekować się osobą, która potrzebuje pomocy |
| 14 | uczyć innych i tłumaczyć im rzeczy |
| 15 | rozmawiać z ludźmi o tym, co przeżywają |
| 16 | robić coś wspólnie dla innych ludzi |
| 17 | przekonywać ludzi i sprzedawać |
| 18 | prowadzić ludzi i podejmować decyzje za grupę |
| 19 | prowadzić coś własnego, na własne ryzyko |
| 20 | spierać się, argumentować, negocjować |
| 21 | porządkować i układać w system |
| 22 | pracować dokładnie i wyłapywać błędy |
| 23 | zajmować się pieniędzmi i rozliczeniami |
| 24 | planować i ogarniać logistykę |

**Po co ta część, skoro jest już część A.** Część A jest ipsatywna: mówi, co u danej osoby wygrywa z czym, ale nie mówi, jak silne jest cokolwiek. Bez kotwic nie da się odróżnić osoby o wąskich, intensywnych zainteresowaniach od osoby, którą nie interesuje nic, a wynik i tak wygląda tak samo. Kotwice dają poziom, którego ranking nie ma.

---

# 7. CZĘŚĆ C — EKSPOZYCJA

Nagłówek: **„A czy próbowałeś już czegoś takiego?”**

Te same 24 pozycje, jedno pole wyboru: **„Tak, robiłem już coś takiego”** / **„Nie”**.

Można połączyć z częścią B na jednym ekranie (skala + checkbox w jednym wierszu). Oszczędza to około 90 sekund.

**Po co.** Zainteresowanie zadeklarowane bez jakiegokolwiek kontaktu z czynnością jest niestabilne i często odzwierciedla wyobrażenie z filmu albo z opowieści. Ekspozycja pozwala podzielić wynik na potwierdzony i wymagający sprawdzenia.

Wyłapuje też realną nierówność między uczestnikami. Osoba z małej miejscowości miała po prostu mniej okazji, żeby cokolwiek wypróbować. Bez tej korekty moduł myli brak dostępu z brakiem zainteresowania i systematycznie ją zaniża.

---

# 8. ALGORYTM LICZENIA WYNIKU

## Krok 1 — punktacja rankingu

| Miejsce w bloku | Waga |
|:---:|:---:|
| 1 (najchętniej) | **+1,5** |
| 2 | **+0,5** |
| 3 | **−0,5** |
| 4 (najmniej chętnie) | **−1,5** |

Środkowe miejsca ważą trzy razy mniej niż skrajne, i to jest celowe. Ludzie pewnie odróżniają najlepsze od najgorszego, ale kolejność drugiego i trzeciego ustalają w dużej mierze przypadkowo. Wagi odzwierciedlają rzeczywistą wiarygodność tych wskazań.

```
W_raw[obszar] = suma wag jego 6 pozycji        → zakres [−9, +9]
W[obszar]     = W_raw / 6                      → zakres [−1,5, +1,5]
Wn[obszar]    = (W + 1,5) / 3 × 100            → zakres [0, 100]
```

Własność kontrolna: suma `W_raw` po wszystkich 24 obszarach musi wynosić **dokładnie 0**, bo każdy blok wnosi +1,5 +0,5 −0,5 −1,5 = 0. Średnia `Wn` zawsze wynosi 50. Użyj tego jako testu poprawności implementacji.

## Krok 2 — poziom absolutny

```
P[obszar]  = odpowiedź z części B (1–5)
Pn[obszar] = (P − 1) / 4 × 100                 → zakres [0, 100]
```

## Krok 3 — wynik złożony

```
Z[obszar] = 0,7 × Wn[obszar] + 0,3 × Pn[obszar]
```

Ranking ipsatywny waży więcej, bo jest odporny na styl odpowiadania — uczestnik nie może zaznaczyć wszystkiego wysoko. Kotwica dokłada informację o poziomie, ale z mniejszą wagą, bo jest podatna na „wszystko brzmi ok”.

## Krok 4 — rodziny

```
F[rodzina] = średnia Z z jej 4 obszarów
```

## Krok 5 — dwie osie

Najpierw wyśrodkuj wyniki rodzin:

```
f[x] = F[x] − 50

Rzeczy_Ludzie = ((2×f[R] + f[I] + f[C]) − (f[A] + 2×f[S] + f[E])) / 6
Dane_Idee     = ((f[E] + f[C]) − (f[I] + f[A])) / 2
```

Wartość dodatnia pierwszej osi = w stronę rzeczy, ujemna = w stronę ludzi. Wartość dodatnia drugiej = w stronę danych i porządku, ujemna = w stronę idei i dociekania.

Wagi wynikają z rozmieszczenia sześciu rodzin na okręgu co 60 stopni. **Osie są najodporniejszą częścią wyniku** — trzymają się nawet wtedy, gdy poszczególne obszary są niestabilne. To pierwsza rzecz, którą pokazujesz uczestnikowi z płaskim profilem, bo często jedyna, która u niego cokolwiek znaczy.

## Krok 6 — rozstrzyganie remisów

Przy równym `Z` decyduje kolejno: wyższe `Wn`, potem wyższe `P`, potem niższe ID obszaru. Zasada musi być deterministyczna, żeby ten sam komplet odpowiedzi zawsze dawał ten sam raport.

---

# 9. WSKAŹNIKI JAKOŚCI ODPOWIEDZI

Ta sekcja jest obowiązkowa. Bez niej moduł produkuje pewność siebie tam, gdzie nie ma danych — a to najszybsza droga do utraty zaufania uczestnika i jego rodziców.

| Wskaźnik | Wzór | Próg | Działanie |
|---|---|---|---|
| **Zróżnicowanie** `D` | `max(Z) − min(Z)` | `< 18` | Profil płaski — nie pokazuj TOP 5 |
| **Podniesienie** `El` | `średnia(P)` | `< 2,0` lub `> 4,3` | Licz `Z` wyłącznie z `Wn` (waga 1,0 / 0,0) |
| **Spójność** `Cs` | korelacja rangowa Spearmana między `Wn` a `Pn` po 24 obszarach | `< 0,30` | Oznacz wynik jako niepewny, sygnał dla prowadzącego |
| **Tempo** | czas części A | `< 6 min` | Nie raportuj wyniku, zaproponuj powtórzenie |
| **Bloki błyskawiczne** | liczba bloków z `ms_spent < 4000` | `> 8` | Ten sam skutek co wyżej |
| **Ekspozycja** `Ex` | liczba obszarów z „nie” | `> 18` | Cały wynik prezentuj jako wstępny |

## Etykieta pewności profilu

```
D ≥ 30            → "wyraźny"
18 ≤ D < 30       → "umiarkowany"
D < 18            → "jeszcze nieukształtowany"
```

Etykieta pojawia się na pierwszym ekranie wyniku i steruje tym, co w ogóle zostaje pokazane.

## Profil płaski to nie błąd

U szesnastolatków profil nieukształtowany bywa u 25–30% grupy i zwykle znaczy dokładnie to, co powinien znaczyć: ta osoba nie miała jeszcze dość kontaktu ze światem, żeby jej zainteresowania się wyostrzyły. **Moduł musi mieć dla niej osobną ścieżkę**, a nie wciśnięty na siłę ranking pięciu obszarów, które różnią się od siebie o szum.

Przy `D < 18` ekran wyniku pokazuje wyłącznie:
1. dwie osie ogólne
2. listę „do sprawdzenia”
3. zdanie: *„Twoje zainteresowania nie są jeszcze wyraźnie ukształtowane, i to zupełnie normalne w Twoim wieku. Zamiast rankingu pokazujemy Ci ogólny kierunek i rzeczy, które warto wypróbować.”*
4. flagę dla prowadzącego przed sesją 1:1

---

# 10. GENEROWANIE WYNIKU DLA UCZESTNIKA

Cztery ekrany, w tej kolejności.

## Ekran 1 — dwa zdania

Szablon:

```
Najbardziej ciągnie Cię do: {etykieta_1} i {etykieta_2}.
Najmniej: {etykieta_24}.
```

Bez liczb, bez liter, bez nazw typów. To ma być zdanie, które uczestnik powtórzy koledze.

## Ekran 2 — pięć obszarów na górze

Dla każdego z TOP 5 trzy linijki:

```
{ETYKIETA}
{feedback_high_desc}
Co to zmienia: {feedback_high_consequence}
{jeśli part_c[obszar] == false: "Tego jeszcze nie próbowałeś."}
```

Linijka „co to zmienia” jest obowiązkowa. Bez niej wynik jest ciekawostką, a nie narzędziem decyzyjnym — i łamie zasadę 5 modelu programu.

## Ekran 3 — pięć obszarów na dole

Wyłącznie `feedback_low`, bez oceniania. Nigdy „jesteś w tym słaby” — assessment tego nie mierzył. Ten ekran przy wyborze studiów bywa wart więcej niż poprzedni, bo skutecznie zawęża pole.

## Ekran 4 — czego jeszcze nie znasz

```
Pokaż obszary spełniające: Z ≥ 60 ORAZ part_c[obszar] == false
Sortuj malejąco po Z, maksymalnie 5 pozycji.

Podpis: "Tego jeszcze nie próbowałeś, a wynik sugeruje, że mogłoby Ci pasować.
         Warto sprawdzić, zanim to odrzucisz — albo zanim się na to zdecydujesz."
```

To jest zabezpieczenie etyczne modułu. Kwestionariusz zainteresowań podany szesnastolatkowi potrafi przedwcześnie zamknąć drzwi, których nikt nawet nie otworzył. Ten ekran je uchyla i musi zostać w produkcie nawet pod presją upraszczania.

## Teksty zwrotne dla 24 obszarów

| # | Opis (gdy w TOP) | Co to zmienia | Gdy na dole |
|---|---|---|---|
| 1 | Ciągnie Cię do tego, żeby zrozumieć, dlaczego coś nie działa, i doprowadzić to do porządku. | Praca, w której nigdy nie widzisz naprawionego efektu, będzie Ci się dłużyć. | Grzebanie w tym, co się zepsuło, raczej Cię nie pociąga. |
| 2 | Lubisz, kiedy na koniec dnia istnieje rzecz, której rano nie było. | Szukaj zajęć, w których efekt jest fizyczny i widoczny, nie tylko w pliku. | Robienie rzeczy własnymi rękami nie jest tym, co Cię napędza. |
| 3 | Dobrze Ci z żywymi organizmami i z cyklem, w którym coś rośnie. | Warto sprawdzić kierunki i zawody, w których praca toczy się poza biurem. | Praca ze zwierzętami czy roślinami raczej Cię nie ciągnie. |
| 4 | Potrzebujesz ruchu i wolisz działać, niż siedzieć. | Osiem godzin przy biurku może Cię wykończyć szybciej niż trudne zadania. | Wysiłek fizyczny i praca w terenie raczej Ci nie odpowiadają. |
| 5 | Interesuje Cię budowanie rzeczy, które potem działają same. | To obszar, w którym dużo da się osiągnąć bez studiów — sprawdź obie drogi. | Praca z kodem i sprzętem raczej Cię nie przyciąga. |
| 6 | Chcesz wiedzieć, dlaczego coś działa tak, a nie inaczej, i to sprawdzić. | Odpowiadają Ci zajęcia, w których wolno drążyć długo, zamiast szybko dowozić. | Dochodzenie do sedna metodą prób i pomiarów raczej Cię nie wciąga. |
| 7 | Ciekawi Cię, jak działa ludzki organizm i co da się z nim zrobić. | Większość dróg w tym obszarze jest długa i wymaga studiów — dobrze wiedzieć to na starcie. | Tematy zdrowia i ludzkiego ciała raczej Cię nie interesują. |
| 8 | Lubisz moment, w którym z liczb wychodzi coś, czego wcześniej nie było widać. | Ten obszar otwiera drzwi w bardzo wielu branżach, nie tylko w finansach. | Grzebanie w danych i liczbach raczej Cię nie pociąga. |
| 9 | Zwracasz uwagę na to, jak rzeczy wyglądają, i chcesz na to wpływać. | Portfolio będzie tu ważniejsze niż dyplom — zacznij je budować wcześnie. | Projektowanie wyglądu rzeczy raczej Cię nie ciągnie. |
| 10 | Lubisz szukać sformułowania, które trafia dokładnie w sedno. | Ta umiejętność wzmacnia prawie każdą inną ścieżkę, także techniczną. | Praca ze słowem i tekstem raczej Cię nie interesuje. |
| 11 | Dźwięk jest dla Ciebie czymś, z czym chcesz pracować, nie tylko tłem. | Sprawdź, ile w tym obszarze istnieje zawodów poza samym graniem. | Praca z dźwiękiem i muzyką raczej Cię nie ciągnie. |
| 12 | Nie przeszkadza Ci bycie widocznym i lubisz tworzyć coś, co ktoś ogląda. | To przydaje się też daleko poza sztuką — wszędzie, gdzie trzeba wystąpić. | Bycie na widoku raczej Cię nie pociąga. |
| 13 | Chcesz być blisko człowieka, który potrzebuje konkretnej pomocy. | To obszar z realnym ryzykiem wypalenia — przy wyborze pytaj też o warunki pracy. | Bezpośrednia opieka nad drugą osobą raczej Cię nie ciągnie. |
| 14 | Lubisz moment, w którym ktoś w końcu rozumie. | Praca, w której nikomu niczego nie tłumaczysz, znudzi Cię szybciej, niż myślisz. | Uczenie innych raczej Cię nie pociąga. |
| 15 | Interesuje Cię to, co dzieje się w drugim człowieku, i rozmowa o tym. | Sprawdź, które drogi wymagają tu formalnych uprawnień, a które nie. | Rozmowy o emocjach i trudnościach raczej Cię nie przyciągają. |
| 16 | Ważne jest dla Ciebie robienie czegoś dla ludzi, nie tylko dla siebie. | To może być zawód, ale równie dobrze mocna część życia obok pracy — rozważ oba warianty. | Angażowanie się we wspólne sprawy raczej Cię nie ciągnie. |
| 17 | Lubisz sytuację, w której ktoś zmienia zdanie pod wpływem tego, co mówisz. | To jeden z niewielu obszarów, w którym wynik widać od razu i bardzo dosłownie. | Przekonywanie ludzi raczej Cię nie pociąga. |
| 18 | Nie unikasz decydowania i brania odpowiedzialności za grupę. | Do tego dochodzi się zwykle po latach — patrz na drogi, które to w ogóle umożliwiają. | Kierowanie ludźmi raczej Cię nie ciągnie. |
| 19 | Wolisz zbudować coś swojego, nawet bez pewności, że się uda. | Sprawdź, czy Twoja gotowość na ryzyko finansowe potwierdzi się w filtrach rzeczywistości. | Prowadzenie czegoś na własny rachunek raczej Cię nie pociąga. |
| 20 | Lubisz układać argumenty i sprawdzać, czyje stanowisko się broni. | Ten obszar prowadzi nie tylko do prawa — także do negocjacji, zakupów i mediacji. | Spory i argumentowanie raczej Cię nie ciągną. |
| 21 | Bałagan Ci przeszkadza i chcesz nadawać rzeczom strukturę. | Ta cecha jest bardzo poszukiwana i rzadko wymieniana wprost w ogłoszeniach. | Porządkowanie i budowanie systemów raczej Cię nie interesuje. |
| 22 | Zauważasz szczegóły i chcesz, żeby wszystko się zgadzało. | Praca, w której liczy się tempo kosztem dokładności, może Cię męczyć. | Drobiazgowe sprawdzanie raczej Cię nie pociąga. |
| 23 | Interesuje Cię, dokąd realnie płyną pieniądze. | To obszar bardzo stabilny zawodowo — sprawdź, czy stabilność jest dla Ciebie wartością. | Praca z pieniędzmi i rozliczeniami raczej Cię nie ciągnie. |
| 24 | Lubisz układać rzeczy w kolejność tak, żeby całość się spinała. | Ta umiejętność przydaje się wszędzie — także w obszarze, który wybierzesz jako główny. | Planowanie i logistyka raczej Cię nie pociągają. |

---

# 11. WYJŚCIE MODUŁU

Struktura przekazywana do silnika dopasowania i do raportu końcowego „Moja mapa kierunku”.

```json
{
  "participant_id": "uuid",
  "assessment": "A1",
  "version": "2.0",
  "completed_at": "2026-09-09T10:21:34Z",
  "profile_confidence": "wyrazny",
  "quality": {
    "differentiation": 41.2,
    "elevation": 3.1,
    "consistency": 0.62,
    "part_a_seconds": 782,
    "fast_blocks": 1,
    "areas_without_exposure": 9,
    "flags": []
  },
  "areas": [
    {"id":14,"Z":78.4,"Wn":81.2,"Pn":72.0,"rank":1,"exposure":true},
    {"id":15,"Z":74.1,"Wn":75.0,"Pn":72.0,"rank":2,"exposure":true}
  ],
  "families": {"R":38.2,"I":52.0,"A":49.8,"S":71.4,"E":47.1,"C":41.5},
  "axes": {"rzeczy_ludzie": -14.8, "dane_idee": -3.2},
  "top5": [14,15,7,13,16],
  "bottom5": [23,22,19,5,20],
  "to_explore": [7,11],
  "suppressed": []
}
```

`suppressed` zawiera nazwy sekcji ukrytych z powodu progów jakości — na przykład `["top5","bottom5"]` przy profilu płaskim. Silnik dopasowania **musi** to pole respektować i przy pustym `top5` obniżyć pewność własnych rekomendacji, zamiast liczyć je na szumie.

---

# 12. PRZYPADKI BRZEGOWE

| Sytuacja | Obsługa |
|---|---|
| Uczestnik przerywa w połowie | Autozapis po każdym bloku; wznowienie od ostatniego bloku; sesja ważna 48 h |
| Niepełna część B lub C | Blokada przejścia dalej; brak danych uniemożliwia policzenie `Z` |
| Wszystkie kotwice na 1 lub na 5 | Wskaźnik podniesienia; `Z` liczone wyłącznie z `Wn` |
| Zerowa ekspozycja we wszystkich 24 obszarach | Cały raport oznaczony jako wstępny + flaga dla prowadzącego |
| Remis w `Z` | Rozstrzyganie deterministyczne wg kroku 6 |
| Uczestnik chce wrócić i zmienić odpowiedź | Dozwolone w częściach A, B, C do momentu zatwierdzenia; potem tylko pełne powtórzenie |
| Powtórzenie assessmentu | Zapisz jako osobną próbę; nie nadpisuj; przy odstępie poniżej 30 dni oznacz jako powtórzenie |
| Uczestnik pyta o swoje litery RIASEC | Nie ujawniaj; odpowiedź: system opisuje obszary, nie typy |

---

# 13. CZEGO MODUŁ NIE POKAZUJE

Lista zakazów. Każda z tych rzeczy jest technicznie łatwa do dodania i każda pogarsza produkt.

- **procentów dopasowania z dokładnością do jedności** — narzędzie tej długości nie ma takiej precyzji; używaj pasm opisowych
- **pojedynczej etykiety typu** („jesteś Twórcą”) — etykieta zamyka, zamiast otwierać
- **liter RIASEC ani nazw modelu**
- **porównania z innymi uczestnikami grupy** — w warsztacie grupowym to prosta droga do wstydu i wycofania
- **oceniającego języka przy dolnych obszarach** — nie mierzyliśmy zdolności
- **surowych liczb `Z`, `Wn`, `Pn`** — są do silnika i do prowadzącego, nie na ekran uczestnika

---

# 14. WYMAGANIA NIEFUNKCJONALNE

- **mobile first** — realnie większość uczestników wypełni to na telefonie
- kafelek bloku czytelny bez przewijania na ekranie 360 px szerokości
- działanie przy chwilowej utracie sieci: bufor lokalny, synchronizacja po powrocie
- pełny wynik dostępny dla uczestnika po zakończeniu, bez oczekiwania
- widok prowadzącego: lista uczestników grupy z etykietą pewności i flagami jakości, przed sesją 1:1
- eksport zbiorczy kohorty do CSV — potrzebny do budowania norm (sekcja 15)
- dane pełnoletnie i niepełnoletnie: zgoda opiekuna dla osób poniżej 18 lat, wyniki niedostępne dla osób trzecich bez zgody uczestnika

---

# 15. NORMY I ROZWÓJ NARZĘDZIA

**W wersji 2.0 nie ma norm i nie wolno ich udawać.** Wszystkie progi w sekcji 9 są oparte na właściwościach skali, nie na rozkładzie populacji.

Plan dojścia do norm:

| Etap | Próg | Co się odblokowuje |
|---|---|---|
| Wywiady poznawcze | 8–12 osób | Wymiana pozycji niezrozumiałych na rezerwowe |
| Pierwsze kohorty | ~100 uczestników | Rozkłady `Z`, uczciwe pasma zamiast progów arbitralnych |
| Rozbudowa bazy | ~150 uczestników | Korelacje pozycja–obszar, pierwsza rewizja puli |
| Walidacja praktyczna | 30–40 sesji 1:1 | Zgodność wyniku z oceną prowadzącego |
| Katamneza | 6 i 12 miesięcy | Czy uczestnik wybrał to, co wskazał profil, i czy przy tym został |

**Walidacja praktyczna jest najtańsza i najmocniejsza.** Po każdej sesji 1:1 prowadzący wypełnia jedno pole: na ile wynik zgadzał się z tym, co zobaczył w rozmowie, plus notatka o rozbieżnościach. Zbuduj to w aplikacji od razu — to jedyny dowód trafności, jaki fundacja może zebrać własnymi siłami.

---

# 16. PULA REZERWOWA

24 pozycje nieużywane w planie bloków. Służą do wymiany pozycji odrzuconych po wywiadach poznawczych — wymiana jeden do jednego w obrębie tego samego obszaru zachowuje bilans planu.

| Obszar | ID | Treść |
|:---:|---|---|
| 1 | `A01_7` | Doprowadzić stary sprzęt do stanu używalności |
| 2 | `A02_7` | Upiec chleb albo przygotować danie od podstaw |
| 3 | `A03_7` | Wytresować psa |
| 4 | `A04_7` | Pilnować bezpieczeństwa na dużej imprezie |
| 5 | `A05_7` | Zaprogramować robota, żeby wykonał zadanie |
| 6 | `A06_7` | Prowadzić notatki z obserwacji przez wiele tygodni |
| 7 | `A07_7` | Sprawdzać, co w codziennych nawykach szkodzi zdrowiu |
| 8 | `A08_7` | Sprawdzić, czy czyjeś wyliczenia są poprawne |
| 9 | `A09_7` | Urządzić wnętrze pokoju |
| 10 | `A10_7` | Napisać scenariusz krótkiego filmu |
| 11 | `A11_7` | Rozpoznać ze słuchu, co w nagraniu brzmi źle |
| 12 | `A12_7` | Wystąpić przed dużą publicznością |
| 13 | `A13_7` | Pomagać komuś wrócić do sił po chorobie |
| 14 | `A14_7` | Ułożyć materiały do nauki dla innych |
| 15 | `A15_7` | Prowadzić rozmowę, po której komuś jest lżej |
| 16 | `A16_7` | Zbudować grupę, w której ludzie się nawzajem wspierają |
| 17 | `A17_7` | Wymyślić hasło, które ludzie zapamiętają |
| 18 | `A18_3` | Poprowadzić zespół przez trudny moment |
| 19 | `A19_7` | Sprawdzić na rynku, czy pomysł ma sens |
| 20 | `A20_7` | Wynegocjować dla siebie lepsze warunki |
| 21 | `A21_7` | Opisać krok po kroku, jak coś ma być robione |
| 22 | `A22_7` | Sprawdzić jakość partii towaru przed wysyłką |
| 23 | `A23_7` | Sprawdzić, czy rozliczenie jest zgodne z przepisami |
| 24 | `A24_7` | Znaleźć miejsce, które opóźnia całą resztę |

W obszarach 12 i 18 rezerwa została dobrana tak, żeby w aktywnym zestawie została tylko jedna pozycja o podwyższonej atrakcyjności. To upraszcza spełnienie ograniczenia jednej takiej pozycji na blok.

---

# 17. TESTY AKCEPTACYJNE

Zestaw kontrolny dla implementacji.

1. **Bilans zerowy.** Dla dowolnego kompletu odpowiedzi suma `W_raw` po 24 obszarach = 0 (tolerancja zmiennoprzecinkowa 1e−9), a średnia `Wn` = 50.
2. **Kompletność planu.** Każdy obszar występuje w dokładnie 6 blokach; każda ze 144 pozycji dokładnie raz; żaden blok nie zawiera dwóch obszarów z tej samej rodziny.
3. **Atrakcyjność.** Żaden blok nie zawiera dwóch pozycji `desirability: high`.
4. **Skrajności.** Uczestnik ustawiający zawsze obszar 14 na miejscu 1 osiąga `Wn[14]` = 100.
5. **Determinizm.** Ten sam komplet odpowiedzi zawsze daje identyczny raport, niezależnie od wylosowanej kolejności prezentacji.
6. **Płaski profil.** Uczestnik odpowiadający tak, że `D < 18`, nie widzi ekranów 2 i 3, a `suppressed` zawiera `top5` i `bottom5`.
7. **Losowanie.** Dwie sesje tego samego uczestnika mają różną kolejność bloków, ale identyczny ich zestaw.
8. **Wznowienie.** Przerwanie po bloku 20 i powrót przywraca stan bez utraty odpowiedzi.

---

# 18. CO POZOSTAJE POZA TYM DOKUMENTEM

Mapowanie 24 obszarów na konkretne polskie zawody i kierunki studiów jest osobnym, dużym modułem. Struktura wyjścia z sekcji 11 została zaprojektowana pod niego (stąd wyniki rodzin i osie obok samych obszarów), ale samo mapowanie wymaga własnej specyfikacji.

Warto zacząć je równolegle, nie po. Uczestnik nie zapamięta, jak dobrze zbudowany był kwestionariusz. Zapamięta, czy lista zawodów, którą zobaczył na końcu, miała dla niego sens.