# ASSESSMENT 2: W CZYM MOGĘ BYĆ DOBRY
## Pełna specyfikacja wdrożeniowa — wersja 2.0 (30 kompetencji)

Program warsztatów rozwojowo-zawodowych 16–24 | Fundacja Służąc Życiu

**Uwaga o numeracji.** W pierwotnym modelu programu były osobno „Assessment 2: predyspozycje praktyczne” i „Assessment 4: umiejętności”. Zostały połączone w jeden moduł, nazywany dalej **A2**. Moduł zainteresowań to **A1**.

**Zmiana wobec wersji 1.0:** 30 kompetencji zamiast 18, 45 bloków zamiast 27. Uzasadnienie i koszty tej zmiany w sekcji 2.

Dokument jest samowystarczalny: model danych, pełna treść 210 pozycji, gotowy plan 45 bloków, algorytm liczenia, macierz powiązania z A1, progi jakości, szablony wyników, przypadki brzegowe i testy akceptacyjne.

---

# 1. DLACZEGO DWA ASSESSMENTY STAŁY SIĘ JEDNYM

Pierwotny „Assessment 2: predyspozycje praktyczne” miał mierzyć zdolności przez miniscenariusze z wyborem odpowiedzi. To nie jest pomiar zdolności. Uczestnik nie wykonuje zadania i nie da się sprawdzić, czy jego odpowiedź jest trafna — wybiera to, co o sobie sądzi. Psychometrycznie jest to **samoocena skuteczności**, czyli dokładnie ten sam konstrukt, który mierzył „Assessment 4”.

Utrzymanie obu oznaczałoby podanie silnikowi dopasowania jednego sygnału jako dwóch niezależnych dowodów. Rekomendacje wyglądałyby na potwierdzone z dwóch stron, a byłyby oparte na jednym źródle.

## Co ten moduł mierzy naprawdę

**Poczucie własnej skuteczności w konkretnych typach zadań.** To nie to samo co zmierzona zdolność i dokument nigdzie nie udaje, że jest inaczej.

Warto to robić mimo tego ograniczenia, bo poczucie skuteczności jest jednym z najsilniejszych predyktorów tego, **co człowiek wybierze i przy czym zostanie**. Ludzie omijają dziedziny, w których nie wierzą we własny sukces, nawet mając zdolności. Dla programu, którego celem jest wybór drogi, jest to informacja pierwszorzędna.

## Granica wobec A1

| | A1 — Zainteresowania | A2 — W czym mogę być dobry |
|---|---|---|
| Pytanie | Czy chciałbyś to robić? | Czy poszłoby Ci to dobrze? |
| Jednostka | 24 obszary treściowe | 30 kompetencji przenoszalnych |
| Pozycje | nazywają dziedzinę („wytresować psa”) | nazywają zdolność w neutralnej sytuacji („nauczyć kogoś czegoś, czego się bał”) |
| Przyjemność | jest przedmiotem pomiaru | jest **wykluczona** z instrukcji |

**Reguła redakcyjna utrzymująca tę granicę:** pozycja A1 zawsze wskazuje dziedzinę, pozycja A2 nigdy jej nie wskazuje. Jeśli nową pozycję A2 da się jednoznacznie przypisać do jednego obszaru A1, jest napisana źle i nie wchodzi do puli.

## Główny produkt modułu

Nie jest nim lista mocnych stron, tylko **różnica między A1 a A2** — miejsca, w których to, co uczestnika ciągnie, rozjeżdża się z tym, co mu wychodzi. Sekcja 11 opisuje, jak to policzyć.

---

# 2. DLACZEGO 30, A NIE 18 — I CO TO KOSZTUJE

## Co zyskujemy

Wersja 18-kompetencyjna miała luki, które przy pełnym spektrum zawodów są dotkliwe. Sześć wymiarów dopisanych w wersji 2.0:

| Kompetencja | Czego brakowało bez niej |
|---|---|
| Wyobraźnia przestrzenna | rzemiosło, budownictwo, architektura, chirurgia, logistyka |
| Negocjowanie | odrębne od przekonywania: prawo, handel, zakupy, mediacje |
| Zapamiętywanie | medycyna, prawo, języki, gastronomia, obsługa |
| Praca z regułami i przepisami | administracja, księgowość, prawo, BHP, farmacja |
| Uprzejmość pod presją | obsługa, sprzedaż, recepcja, opieka, służby |
| Odporność na odmowę | sprzedaż, przedsiębiorczość, sztuka, rekrutacja |

Doszły też rozdzielenia: sprawność manualna oddzielona od obsługi sprzętu, prowadzenie wielu spraw naraz oddzielone od planowania, samodzielność bez nadzoru wydzielona jako osobny wymiar.

## Co to kosztuje

**Czas.** 45 bloków zamiast 27 i 90 pól dowodów zamiast 54. Łącznie około 26 minut zamiast 21. Mieści się, bo połączenie dwóch pierwotnych assessmentów uwolniło budżet spotkania 2 (model przewidywał 30 + 35 minut na dwa moduły).

**Gęstość porównań.** Przy 30 skalach mamy 270 obserwacji par na 375 możliwych par międzygrupowych. Plan pokrywa 258 z nich, więc rzadsza sieć niż w A1, ale nadal prawie maksymalna dla tej liczby bloków. Każda kompetencja jest porównywana z wszystkimi pięcioma pozostałymi grupami.

**Ryzyko synonimii.** To jest realny koszt. Przy 30 skalach część par może okazać się dla siedemnastolatka tym samym — na przykład *analiza informacji* i *myślenie systemowe* albo *dokładność* i *praca z regułami*. Bez próby 150 osób nie da się tego sprawdzić empirycznie. Dlatego rozdzielenie zostało zrobione **treścią pozycji, nie nazwą**: pozycje kompetencji 2 dotyczą wyławiania i oceny informacji, a kompetencji 4 wyłącznie przewidywania skutków i zależności. Przy przeglądzie eksperckim to jest pierwsza rzecz do sprawdzenia.

**Zmęczenie.** 45 bloków to dużo dla szesnastolatka. Obowiązkowa przerwa ekranowa po bloku 23 (sekcja 4.3). Losowa kolejność bloków sprawia, że zmęczenie końcówki rozkłada się równomiernie na wszystkie kompetencje zamiast uderzać zawsze w te same.

---

# 3. STRUKTURA: 30 KOMPETENCJI W 6 GRUPACH

Grupy służą do bilansowania bloków i porządkowania ekranu wyniku. Uczestnik nie widzi kodów grup.

| Kod | Grupa | Kompetencje |
|---|---|---|
| `AN` | Analiza i myślenie | 1–5 |
| `UT` | Uczenie się i tworzenie | 6–10 |
| `SL` | Słowo i przekaz | 11–15 |
| `LU` | Ludzie i relacje | 16–20 |
| `WY` | Wykonanie i porządek | 21–25 |
| `CP` | Ciało, technika, presja | 26–30 |

| # | Kompetencja | Grupa | Opis na ekranie wyniku |
|---|---|:---:|---|
| 1 | Rozwiązywanie problemów | AN | Kiedy coś się psuje albo blokuje, dochodzisz do przyczyny i ruszasz dalej. |
| 2 | Analiza informacji | AN | Radzisz sobie z nadmiarem informacji i wyciągasz z niego wniosek. |
| 3 | Rachunki i szacowanie | AN | Liczby w praktyce nie sprawiają Ci kłopotu. |
| 4 | Myślenie systemowe | AN | Widzisz, jak jedna zmiana pociąga za sobą kolejne. |
| 5 | Praca z regułami i przepisami | AN | Umiesz czytać zasady i sprawdzać, czy są dotrzymane. |
| 6 | Szybkie uczenie się nowego | UT | Szybko wchodzisz w nowy temat i zaczynasz w nim działać. |
| 7 | Zapamiętywanie i przywoływanie | UT | Trzymasz w głowie dużo szczegółów i potrafisz je przywołać. |
| 8 | Wymyślanie nowych rozwiązań | UT | Łatwo znajdujesz rozwiązania, które nie są oczywiste. |
| 9 | Wyczucie formy i estetyki | UT | Widzisz, kiedy coś wygląda dobrze, a kiedy nie, i umiesz to poprawić. |
| 10 | Wyobraźnia przestrzenna | UT | Dobrze wyobrażasz sobie rzeczy w przestrzeni. |
| 11 | Wyrażanie się słowem | SL | Umiesz ująć rzecz w słowa tak, żeby była jasna. |
| 12 | Wyjaśnianie i uczenie innych | SL | Potrafisz doprowadzić kogoś do zrozumienia. |
| 13 | Wystąpienia przed grupą | SL | Radzisz sobie, kiedy trzeba mówić do wielu osób naraz. |
| 14 | Przekonywanie | SL | Potrafisz zmienić czyjeś zdanie albo decyzję. |
| 15 | Negocjowanie | SL | Umiesz wypracować warunki, które obie strony przyjmą. |
| 16 | Wyczuwanie ludzi | LU | Trafnie odczytujesz, co się dzieje z drugą osobą. |
| 17 | Cierpliwość i opiekuńczość | LU | Wytrzymujesz przy kimś, kto potrzebuje czasu i uwagi. |
| 18 | Rozbrajanie napięć | LU | Umiesz obniżyć napięcie i utrzymać współpracę. |
| 19 | Uprzejmość pod presją | LU | Zostajesz uprzejmy nawet wtedy, kiedy druga strona nie jest. |
| 20 | Prowadzenie grupy | LU | Umiesz ustawić grupę wokół celu i podjąć decyzję. |
| 21 | Organizowanie i planowanie | WY | Potrafisz rozpisać działanie i dowieźć je na czas. |
| 22 | Dokładność | WY | Robisz rzeczy bez błędów i wyłapujesz cudze. |
| 23 | Wytrwałość w powtarzalnym | WY | Ciągniesz długo to samo bez spadku jakości. |
| 24 | Prowadzenie wielu spraw naraz | WY | Ogarniasz kilka spraw jednocześnie i nic nie gubisz. |
| 25 | Samodzielność bez nadzoru | WY | Działasz bez czekania na polecenie i bez kontroli. |
| 26 | Sprawność manualna | CP | Ręce robią to, co im każesz, dokładnie i równo. |
| 27 | Obsługa sprzętu i techniki | CP | Szybko dogadujesz się z każdym sprzętem. |
| 28 | Wytrzymałość fizyczna | CP | Wytrzymujesz wysiłek i niewygodę. |
| 29 | Opanowanie pod presją | CP | Zachowujesz głowę, kiedy robi się gorąco. |
| 30 | Odporność na odmowę i porażkę | CP | Odmowa i porażka nie wybijają Cię z rytmu. |

**Dlaczego grupa `CP` musi zostać w całości.** A1 pokrywa pełne spektrum zawodów, łącznie z rzemiosłem, służbami, rolnictwem i pracą w terenie. Bez kompetencji 26–30 uczestnik o profilu rzemieślniczym nie miałby żadnego zaplecza w silniku dopasowania i system odesłałby go do pracy biurowej. To najczęstszy błąd narzędzi tego typu.

---

# 4. PRZEBIEG DLA UŻYTKOWNIKA

| Ekran | Czas | Zawartość |
|---|---|---|
| 1. Wprowadzenie | 2 min | Instrukcja, zdanie kluczowe |
| 2. Blok próbny | 1 min | 1 blok treningowy, poza wynikiem |
| 3. Część A, pierwsza połowa | 7 min | bloki 1–23 |
| 4. Przerwa | 30 s | ekran przejściowy |
| 5. Część A, druga połowa | 7 min | bloki 24–45 |
| 6. Część B | 6–7 min | 30 kompetencji × 3 pytania o dowód |
| 7. Ekran potwierdzenia | 3 min | konfrontacja z różnicami wobec A1 |
| 8. Wynik | — | 4 ekrany zwrotne |

Łącznie **26–28 minut**.

## 4.1 Treść ekranu wprowadzenia

> **Poprzednio pytaliśmy, co chciałbyś robić. Teraz pytamy o coś innego.**
>
> **W czym, Twoim zdaniem, poradziłbyś sobie najlepiej — nawet jeśli wcale byś tego nie lubił?**
>
> To nie jest to samo pytanie. Często najlepiej wychodzą nam rzeczy, za którymi nie przepadamy. I odwrotnie — uwielbiamy coś, co idzie nam średnio.
>
> **Twoje odpowiedzi nie muszą zgadzać się z poprzednim wynikiem. Jeśli się nie zgadzają, to najciekawsza rzecz, jaką dziś znajdziemy.**
>
> Nie oceniaj, czy to ważne albo czy dobrze brzmi. Pytamy tylko: co poszłoby Ci lepiej niż pozostałe trzy rzeczy w zestawie.

Wytłuszczone zdanie o niezgodności jest obowiązkowe. W modelu programu A1 omawiane jest na spotkaniu 1, a A2 wypełniane na spotkaniu 2. Uczestnik zna więc swój profil zainteresowań i **będzie miał skłonność dopasować odpowiedzi do niego**. To zniszczyłoby wartość modułu, bo różnica między A1 a A2 jest jego głównym produktem.

**Wymaganie techniczne:** nie pokazuj wyniku A1 na ekranach A2 przed zakończeniem części B. Prowadzący nie powinien przypominać wyników A1 w ciągu 15 minut poprzedzających to ćwiczenie.

## 4.2 Interakcja w bloku

Stukanie w kolejności, nie przeciąganie. Pierwsze stuknięcie nadaje numer 1, czwarty przypisuje się automatycznie i blok przechodzi dalej po 400 ms. Ponowne stuknięcie cofa przypisanie i przenumerowuje resztę.

- widoczny pasek postępu
- możliwość cofnięcia do poprzedniego bloku
- autozapis po każdym bloku
- **kolejność bloków losowa dla każdego uczestnika**
- **kolejność 4 kafelków wewnątrz bloku losowa**
- brak licznika czasu na ekranie

Zestaw 45 bloków jest wspólny dla wszystkich; losowana jest wyłącznie kolejność. Dzięki temu wyniki pozostają porównywalne między uczestnikami i kohortami.

## 4.3 Przerwa obowiązkowa

Po 23 blokach ekran przejściowy z jednym zdaniem i przyciskiem dalej: *„Połowa za Tobą. Odetchnij chwilę.”* Bez tego jakość odpowiedzi w drugiej połowie wyraźnie spada, a przy 45 blokach jest to najpoważniejsze zagrożenie dla danych.

---

# 5. CZĘŚĆ A — PEŁNY PLAN 45 BLOKÓW

Plan wygenerowany algorytmicznie i zweryfikowany. Spełnione ograniczenia:

- każda z 30 kompetencji pojawia się **dokładnie 6 razy** (30 × 6 = 180 = 45 × 4)
- każda ze 180 aktywnych pozycji użyta **dokładnie raz**
- w żadnym bloku nie ma dwóch kompetencji z tej samej grupy
- każda grupa występuje w dokładnie 30 z 45 bloków
- maksymalnie **jedna** pozycja o podwyższonej atrakcyjności na blok
- pokryte **258 z 375** możliwych par międzygrupowych, żadna nie powtarza się więcej niż 2 razy

**Nie modyfikuj planu bez ponownego wygenerowania.** Podmiana pojedynczej pozycji łamie bilans i przekrzywia wynik.

° = pozycja o podwyższonej atrakcyjności społecznej

### Blok 1

- `K15_6` — Powiedzieć nie i nie zepsuć relacji  *(kompetencja 15, SL)*
- `K16_5` — Zrozumieć, dlaczego ktoś zachował się właśnie tak  *(kompetencja 16, LU)*
- `K21_6` — Uporządkować chaos, który zastałeś  *(kompetencja 21, WY)*
- `K29_3` — Działać sprawnie, kiedy inni panikują °  *(kompetencja 29, CP)*

### Blok 2

- `K02_1` — Wyłowić z długiego materiału to, co naprawdę istotne  *(kompetencja 2, AN)*
- `K06_2` — Nauczyć się obsługi nowego programu bez pomocy  *(kompetencja 6, UT)*
- `K14_5` — Zbudować argument, którego trudno podważyć  *(kompetencja 14, SL)*
- `K28_3` — Utrzymać sprawność, kiedy inni już opadli z sił °  *(kompetencja 28, CP)*

### Blok 3

- `K05_4` — Wypełnić formalności bez błędu  *(kompetencja 5, AN)*
- `K10_6` — Odczytać rysunek techniczny albo plan  *(kompetencja 10, UT)*
- `K17_2` — Zająć się kimś, kto potrzebuje dużo uwagi  *(kompetencja 17, LU)*
- `K22_2` — Wyłapać pomyłkę, którą inni przeoczyli  *(kompetencja 22, WY)*

### Blok 4

- `K01_3` — Rozłożyć zaplątaną sprawę na części i ruszyć z miejsca  *(kompetencja 1, AN)*
- `K13_4` — Odpowiedzieć na trudne pytanie na żywo  *(kompetencja 13, SL)*
- `K25_1` — Zrobić swoje, choć nikt nie sprawdza  *(kompetencja 25, WY)*
- `K27_6` — Wiedzieć, kiedy sprzęt zaczyna działać nie tak  *(kompetencja 27, CP)*

### Blok 5

- `K07_2` — Przypomnieć sobie, kto co dokładnie powiedział  *(kompetencja 7, UT)*
- `K11_1` — Napisać tekst, który ktoś przeczyta do końca  *(kompetencja 11, SL)*
- `K20_2` — Podjąć decyzję, kiedy inni się wahają  *(kompetencja 20, LU)*
- `K24_2` — Wrócić do przerwanego zadania i od razu wiedzieć gdzie  *(kompetencja 24, WY)*

### Blok 6

- `K04_3` — Wskazać, na co jeszcze wpłynie ta decyzja  *(kompetencja 4, AN)*
- `K09_2` — Zauważyć, że układ elementów jest nie w porządku  *(kompetencja 9, UT)*
- `K19_1` — Zostać miłym wobec kogoś, kto jest niemiły  *(kompetencja 19, LU)*
- `K30_1` — Usłyszeć nie i spróbować jeszcze raz  *(kompetencja 30, CP)*

### Blok 7

- `K12_5` — Sprawdzić, w którym miejscu ktoś się gubi  *(kompetencja 12, SL)*
- `K18_6` — Powiedzieć trudną rzecz tak, żeby nikt nie stracił twarzy  *(kompetencja 18, LU)*
- `K23_2` — Dokończyć nudne zadanie, którego nikt nie chce  *(kompetencja 23, WY)*
- `K26_6` — Zrobić coś, co wymaga pewnej ręki  *(kompetencja 26, CP)*

### Blok 8

- `K03_2` — Sprawdzić, czy rachunek się zgadza  *(kompetencja 3, AN)*
- `K08_3` — Znaleźć nietypowe zastosowanie dla zwykłej rzeczy  *(kompetencja 8, UT)*
- `K17_6` — Nie okazać zniecierpliwienia, gdy ktoś działa wolno  *(kompetencja 17, LU)*
- `K23_4` — Wrócić do czegoś po raz dziesiąty i poprawić  *(kompetencja 23, WY)*

### Blok 9

- `K05_1` — Przeczytać zasady i powiedzieć, co z nich wynika  *(kompetencja 5, AN)*
- `K09_1` — Zrobić, żeby coś dobrze wyglądało  *(kompetencja 9, UT)*
- `K14_1` — Sprawić, że ktoś zmienia zdanie  *(kompetencja 14, SL)*
- `K26_3` — Wykonać dokładne cięcie albo szew  *(kompetencja 26, CP)*

### Blok 10

- `K06_1` — Opanować nową umiejętność w krótkim czasie  *(kompetencja 6, UT)*
- `K16_4` — Przewidzieć, jak ktoś zareaguje  *(kompetencja 16, LU)*
- `K25_4` — Poradzić sobie sam, gdy nie ma kogo zapytać  *(kompetencja 25, WY)*
- `K30_3` — Przyjąć ostrą krytykę i pracować dalej  *(kompetencja 30, CP)*

### Blok 11

- `K01_6` — Poradzić sobie z czymś, do czego nie ma instrukcji  *(kompetencja 1, AN)*
- `K11_2` — Ubrać zawiłą myśl w proste zdanie  *(kompetencja 11, SL)*
- `K18_3` — Powiedzieć coś, co rozładowuje sytuację  *(kompetencja 18, LU)*
- `K22_3` — Sprawdzić wszystko do końca, zanim oddasz  *(kompetencja 22, WY)*

### Blok 12

- `K03_6` — Zauważyć, że kwota jest podejrzanie wysoka  *(kompetencja 3, AN)*
- `K07_5` — Odtworzyć z pamięci przebieg wydarzeń  *(kompetencja 7, UT)*
- `K13_6` — Wejść przed ludzi bez przygotowania i coś powiedzieć °  *(kompetencja 13, SL)*
- `K29_4` — Nie zamarznąć w nagłej, trudnej sytuacji  *(kompetencja 29, CP)*

### Blok 13

- `K02_2` — Streścić dużo materiału w kilku zdaniach  *(kompetencja 2, AN)*
- `K08_6` — Wymyślić, jak zrobić coś taniej albo prościej  *(kompetencja 8, UT)*
- `K24_6` — Obsłużyć dwie sprawy, które trafiły w tym samym momencie  *(kompetencja 24, WY)*
- `K27_2` — Poradzić sobie ze sprzętem, którego wcześniej nie widziałeś  *(kompetencja 27, CP)*

### Blok 14

- `K10_2` — Zorientować się w nieznanym miejscu bez mapy  *(kompetencja 10, UT)*
- `K12_6` — Nauczyć kogoś czegoś, czego bał się spróbować  *(kompetencja 12, SL)*
- `K19_4` — Zachować się uprzejmie, gdy sam masz zły dzień  *(kompetencja 19, LU)*
- `K28_6` — Poradzić sobie w warunkach bez wygód  *(kompetencja 28, CP)*

### Blok 15

- `K04_5` — Zauważyć skutek uboczny, którego nikt nie przewidział  *(kompetencja 4, AN)*
- `K15_5` — Doprowadzić do umowy, gdy strony stoją daleko od siebie  *(kompetencja 15, SL)*
- `K20_4` — Wziąć na siebie odpowiedzialność za wynik całości °  *(kompetencja 20, LU)*
- `K25_3` — Zorganizować sobie dzień bez niczyjej pomocy  *(kompetencja 25, WY)*

### Blok 16

- `K04_4` — Zrozumieć, jak wszystkie części łączą się w całość  *(kompetencja 4, AN)*
- `K07_4` — Pamiętać twarze i imiona  *(kompetencja 7, UT)*
- `K21_4` — Przewidzieć, co może pójść nie tak, i się zabezpieczyć  *(kompetencja 21, WY)*
- `K26_1` — Zrobić coś rękami precyzyjnie i równo  *(kompetencja 26, CP)*

### Blok 17

- `K06_4` — Zrozumieć zasadę i od razu zastosować ją gdzie indziej  *(kompetencja 6, UT)*
- `K12_4` — Wyjaśnić to samo drugi raz, zupełnie inaczej  *(kompetencja 12, SL)*
- `K20_6` — Zebrać ludzi do działania w krótkim czasie  *(kompetencja 20, LU)*
- `K22_4` — Zauważyć drobną niezgodność między dwiema wersjami  *(kompetencja 22, WY)*

### Blok 18

- `K01_1` — Znaleźć powód, dla którego coś przestało działać  *(kompetencja 1, AN)*
- `K15_4` — Wytargować niższą cenę  *(kompetencja 15, SL)*
- `K17_3` — Zostać z kimś, kto długo nie może się uspokoić  *(kompetencja 17, LU)*
- `K28_2` — Działać w zimnie, deszczu i niewygodzie  *(kompetencja 28, CP)*

### Blok 19

- `K03_1` — Policzyć w pamięci, ile to mniej więcej wyjdzie  *(kompetencja 3, AN)*
- `K14_4` — Odpowiedzieć na zarzut tak, że przestaje działać  *(kompetencja 14, SL)*
- `K24_4` — Przełączać się między zadaniami bez chaosu  *(kompetencja 24, WY)*
- `K30_5` — Wrócić do sprawy, w której już raz przegrałeś  *(kompetencja 30, CP)*

### Blok 20

- `K10_1` — Wyobrazić sobie, jak to będzie wyglądać po złożeniu  *(kompetencja 10, UT)*
- `K11_6` — Poprawić czyjś tekst, żeby był jaśniejszy  *(kompetencja 11, SL)*
- `K16_2` — Zgadnąć, o co komuś naprawdę chodzi  *(kompetencja 16, LU)*
- `K23_5` — Dowieźć coś do końca, kiedy zapał już opadł  *(kompetencja 23, WY)*

### Blok 21

- `K02_4` — Porównać kilka wariantów i wskazać najlepszy  *(kompetencja 2, AN)*
- `K09_3` — Dobrać rzeczy tak, żeby do siebie pasowały  *(kompetencja 9, UT)*
- `K18_2` — Doprowadzić do rozmowy dwie skłócone osoby  *(kompetencja 18, LU)*
- `K29_2` — Podjąć decyzję, gdy zostało bardzo mało czasu  *(kompetencja 29, CP)*

### Blok 22

- `K05_6` — Zauważyć, że coś jest niezgodne z ustaleniami  *(kompetencja 5, AN)*
- `K08_5` — Połączyć dwie odległe rzeczy w jedną całość  *(kompetencja 8, UT)*
- `K13_5` — Poprowadzić spotkanie od początku do końca  *(kompetencja 13, SL)*
- `K30_6` — Nie brać odrzucenia do siebie  *(kompetencja 30, CP)*

### Blok 23

- `K03_4` — Oszacować, ile czegoś potrzeba, bez mierzenia  *(kompetencja 3, AN)*
- `K19_6` — Powtarzać to samo wyjaśnienie kolejnym osobom  *(kompetencja 19, LU)*
- `K21_2` — Doprowadzić przedsięwzięcie do końca w terminie  *(kompetencja 21, WY)*
- `K27_3` — Ustawić urządzenie tak, żeby pracowało poprawnie  *(kompetencja 27, CP)*

### Blok 24

- `K09_4` — Poprawić czyjąś pracę, żeby wyglądała lepiej  *(kompetencja 9, UT)*
- `K13_3` — Nie stracić wątku, gdy wszyscy patrzą  *(kompetencja 13, SL)*
- `K16_1` — Poznać po kimś, że coś jest nie tak  *(kompetencja 16, LU)*
- `K24_3` — Pilnować kilku terminów w tym samym tygodniu  *(kompetencja 24, WY)*

### Blok 25

- `K02_6` — Wyciągnąć wniosek z tego, co widać w zestawieniu  *(kompetencja 2, AN)*
- `K07_1` — Zapamiętać dużo szczegółów naraz  *(kompetencja 7, UT)*
- `K12_1` — Wytłumaczyć coś tak, że druga osoba wreszcie rozumie  *(kompetencja 12, SL)*
- `K25_6` — Wiedzieć, co robić dalej, bez pytania  *(kompetencja 25, WY)*

### Blok 26

- `K04_2` — Zobaczyć, że dwa problemy mają wspólną przyczynę  *(kompetencja 4, AN)*
- `K14_3` — Przedstawić swój pomysł tak, żeby go przyjęto  *(kompetencja 14, SL)*
- `K17_5` — Zadbać o czyjeś potrzeby przez wiele godzin  *(kompetencja 17, LU)*
- `K29_6` — Zrobić swoje mimo dużego stresu  *(kompetencja 29, CP)*

### Blok 27

- `K06_3` — Wejść w nieznany temat i szybko się odnaleźć  *(kompetencja 6, UT)*
- `K19_3` — Przyjąć pretensje i nie odpowiedzieć tym samym  *(kompetencja 19, LU)*
- `K23_1` — Robić to samo długo, nie tracąc jakości  *(kompetencja 23, WY)*
- `K29_1` — Zachować spokój, kiedy sytuacja się sypie  *(kompetencja 29, CP)*

### Blok 28

- `K08_1` — Wymyślić pomysł, na który nikt inny nie wpadł °  *(kompetencja 8, UT)*
- `K11_4` — Napisać wiadomość, która załatwia sprawę za pierwszym razem  *(kompetencja 11, SL)*
- `K19_5` — Odpowiedzieć spokojnie na niesprawiedliwy zarzut  *(kompetencja 19, LU)*
- `K25_5` — Utrzymać dyscyplinę, pracując w domu  *(kompetencja 25, WY)*

### Blok 29

- `K05_2` — Sprawdzić, czy coś zrobiono zgodnie z wymogami  *(kompetencja 5, AN)*
- `K15_1` — Ustalić warunki, z których obie strony są zadowolone  *(kompetencja 15, SL)*
- `K23_3` — Utrzymać tempo przez wiele godzin z rzędu  *(kompetencja 23, WY)*
- `K27_1` — Nauczyć się obsługiwać nową maszynę albo urządzenie  *(kompetencja 27, CP)*

### Blok 30

- `K01_4` — Naprawić coś, czego nikt inny nie umiał naprawić °  *(kompetencja 1, AN)*
- `K10_3` — Powiedzieć, czy mebel zmieści się w tym miejscu  *(kompetencja 10, UT)*
- `K20_5` — Ustalić kolejność, kiedy wszyscy mówią naraz  *(kompetencja 20, LU)*
- `K26_2` — Złożyć coś z małych części tak, żeby działało  *(kompetencja 26, CP)*

### Blok 31

- `K02_5` — Ocenić, czy podana informacja jest wiarygodna  *(kompetencja 2, AN)*
- `K10_4` — Wyobrazić sobie przedmiot obrócony na drugą stronę  *(kompetencja 10, UT)*
- `K21_1` — Rozpisać, co, kto i kiedy ma zrobić  *(kompetencja 21, WY)*
- `K30_2` — Nie zniechęcić się po serii niepowodzeń  *(kompetencja 30, CP)*

### Blok 32

- `K06_6` — Poradzić sobie w miejscu, gdzie wszystko jest nowe  *(kompetencja 6, UT)*
- `K11_3` — Znaleźć słowo, które trafia dokładnie w sedno  *(kompetencja 11, SL)*
- `K17_4` — Poczekać, aż ktoś zrobi to sam, zamiast wyręczyć  *(kompetencja 17, LU)*
- `K27_4` — Naprawić rzecz, zamiast ją wyrzucić  *(kompetencja 27, CP)*

### Blok 33

- `K05_3` — Znaleźć w długim dokumencie zapis, który ma znaczenie  *(kompetencja 5, AN)*
- `K12_3` — Znaleźć przykład, który rozjaśnia sprawę  *(kompetencja 12, SL)*
- `K16_3` — Wyczuć nastrój w pomieszczeniu po wejściu  *(kompetencja 16, LU)*
- `K24_1` — Ogarnąć kilka spraw jednocześnie i nic nie zgubić  *(kompetencja 24, WY)*

### Blok 34

- `K03_3` — Rozdzielić koszty między kilka osób  *(kompetencja 3, AN)*
- `K09_5` — Zdecydować, co usunąć, żeby całość zyskała  *(kompetencja 9, UT)*
- `K22_5` — Pilnować, żeby każdy szczegół się zgadzał  *(kompetencja 22, WY)*
- `K28_4` — Nieść albo dźwigać przez dłuższy czas  *(kompetencja 28, CP)*

### Blok 35

- `K07_3` — Trzymać w głowie długą listę bez zapisywania  *(kompetencja 7, UT)*
- `K15_2` — Nie zgodzić się na pierwszą propozycję i uzyskać lepszą  *(kompetencja 15, SL)*
- `K18_4` — Utrzymać współpracę w grupie, która się sypie  *(kompetencja 18, LU)*
- `K30_4` — Zaproponować coś, wiedząc, że mogą odmówić  *(kompetencja 30, CP)*

### Blok 36

- `K01_2` — Wymyślić obejście, gdy zaplanowana droga jest zamknięta  *(kompetencja 1, AN)*
- `K14_6` — Zdobyć zgodę osoby, która na starcie była przeciw  *(kompetencja 14, SL)*
- `K16_6` — Dobrać sposób mówienia do konkretnej osoby  *(kompetencja 16, LU)*
- `K22_1` — Zrobić coś bez ani jednego błędu  *(kompetencja 22, WY)*

### Blok 37

- `K04_6` — Powiedzieć, od czego zacząć, żeby reszta ruszyła  *(kompetencja 4, AN)*
- `K13_1` — Powiedzieć coś do dużej grupy tak, żeby słuchali  *(kompetencja 13, SL)*
- `K18_5` — Nie dać się wciągnąć w kłótnię i wyciszyć ją  *(kompetencja 18, LU)*
- `K28_5` — Funkcjonować dobrze przy małej ilości snu  *(kompetencja 28, CP)*

### Blok 38

- `K08_4` — Wyprodukować dużo pomysłów w krótkim czasie  *(kompetencja 8, UT)*
- `K20_3` — Rozdzielić zadania tak, żeby wszystko zostało zrobione  *(kompetencja 20, LU)*
- `K21_3` — Ustawić kolejność tak, żeby nic się nie zablokowało  *(kompetencja 21, WY)*
- `K28_1` — Wytrzymać długi dzień ciężkiej pracy fizycznej  *(kompetencja 28, CP)*

### Blok 39

- `K05_5` — Wiedzieć, co wolno, a czego nie, w danej sytuacji  *(kompetencja 5, AN)*
- `K07_6` — Nauczyć się na pamięć dużej partii materiału  *(kompetencja 7, UT)*
- `K14_2` — Namówić kogoś do czegoś, na co nie miał ochoty  *(kompetencja 14, SL)*
- `K23_6` — Trzymać się planu przez wiele tygodni  *(kompetencja 23, WY)*

### Blok 40

- `K03_5` — Przeliczyć jedne jednostki na drugie  *(kompetencja 3, AN)*
- `K10_5` — Zaplanować, jak upakować rzeczy, żeby weszły  *(kompetencja 10, UT)*
- `K15_3` — Wiedzieć, kiedy ustąpić, a kiedy trzymać się swego  *(kompetencja 15, SL)*
- `K25_2` — Zacząć działać bez czekania na polecenie  *(kompetencja 25, WY)*

### Blok 41

- `K04_1` — Przewidzieć, co się stanie dalej, jeśli zmienisz jedno  *(kompetencja 4, AN)*
- `K08_2` — Zaproponować inny sposób zrobienia tego samego  *(kompetencja 8, UT)*
- `K18_1` — Uspokoić kogoś, kto się zdenerwował  *(kompetencja 18, LU)*
- `K27_5` — Rozłożyć coś i złożyć z powrotem  *(kompetencja 27, CP)*

### Blok 42

- `K13_2` — Zaprezentować pracę przed klasą albo zespołem  *(kompetencja 13, SL)*
- `K19_2` — Obsłużyć kolejkę ludzi, nie tracąc cierpliwości  *(kompetencja 19, LU)*
- `K22_6` — Znaleźć błąd w cudzej pracy  *(kompetencja 22, WY)*
- `K26_4` — Panować nad narzędziem, które wymaga wprawy  *(kompetencja 26, CP)*

### Blok 43

- `K01_5` — Zorientować się, który element psuje całą resztę  *(kompetencja 1, AN)*
- `K12_2` — Pokazać krok po kroku, jak się coś robi  *(kompetencja 12, SL)*
- `K17_1` — Powtórzyć to samo dziesiąty raz bez zniecierpliwienia  *(kompetencja 17, LU)*
- `K21_5` — Zorganizować wyjazd albo wydarzenie dla grupy  *(kompetencja 21, WY)*

### Blok 44

- `K02_3` — Zauważyć, że coś w zestawieniu nie trzyma się kupy  *(kompetencja 2, AN)*
- `K06_5` — Nadrobić dużą zaległość przed terminem  *(kompetencja 6, UT)*
- `K24_5` — Trzymać porządek, gdy dzieje się dużo naraz  *(kompetencja 24, WY)*
- `K26_5` — Pracować rękami szybko i bez psucia  *(kompetencja 26, CP)*

### Blok 45

- `K09_6` — Ocenić, czy coś wygląda tanio, czy dobrze  *(kompetencja 9, UT)*
- `K11_5` — Opowiedzieć historię tak, żeby ktoś słuchał  *(kompetencja 11, SL)*
- `K20_1` — Ustawić grupę tak, żeby wiedziała, co robi  *(kompetencja 20, LU)*
- `K29_5` — Udźwignąć odpowiedzialność, gdy dużo od Ciebie zależy  *(kompetencja 29, CP)*

---

# 6. CZĘŚĆ B — DOWODY ZAMIAST SKALI

**To główna różnica wobec A1 i świadoma decyzja projektowa.**

W A1 drugą częścią była skala 1–5. Tutaj skala byłaby szkodliwa. Samoocena kompetencji u młodych ludzi jest źle skalibrowana i systematycznie obciążona: osoby z najmniejszym doświadczeniem mylą się najbardziej, a różnice w pewności siebie między uczestnikami przewyższają różnice w rzeczywistych kompetencjach.

Zamiast pytać *jak dobry jesteś*, pytamy o **ślad w rzeczywistości**. Dla każdej z 30 kompetencji trzy pola:

> **{NAZWA KOMPETENCJI}**
> ☐ Robiłem coś takiego i wyszło dobrze
> ☐ Ktoś poprosił mnie o to, bo uznał, że mi to wychodzi
> ☐ Udało mi się to wtedy, kiedy innym nie szło

Wynik: **0–3** na kompetencję, łącznie 90 pól. Podziel na trzy ekrany po 10 kompetencji, żeby nie przytłoczyć.

Drugie pole jest najcenniejsze. Prośba od innej osoby to zewnętrzna informacja zwrotna, znacznie lepiej skalibrowana niż własne przekonanie. Trzecie chwyta porównanie z otoczeniem bez pytania o nie wprost.

**Ograniczenie do obsłużenia.** Dowody są sprzężone z okazjami. Uczestnik, który nigdy nie miał szansy niczego poprowadzić, będzie miał niskie dowody niezależnie od potencjału. Dlatego dowody ważą mniej niż ranking i istnieje osobny wskaźnik okazji (sekcja 8).

---

# 7. ALGORYTM LICZENIA

Silnik identyczny jak w A1 — celowo, żeby implementacja była wspólna.

| Miejsce w bloku | Waga |
|:---:|:---:|
| 1 (poszłoby najlepiej) | **+1,5** |
| 2 | **+0,5** |
| 3 | **−0,5** |
| 4 (poszłoby najgorzej) | **−1,5** |

Środkowe miejsca ważą trzy razy mniej niż skrajne. Ludzie pewnie odróżniają najlepsze od najgorszego, a kolejność drugiego i trzeciego ustalają w dużej mierze przypadkowo.

```
S_raw[k] = suma wag jej 6 pozycji        → [−9, +9]
S[k]     = S_raw / 6                     → [−1,5, +1,5]
Sn[k]    = (S + 1,5) / 3 × 100           → [0, 100]

D[k]     = liczba zaznaczonych pól (0–3)
Dn[k]    = D / 3 × 100                   → [0, 100]

K[k]     = 0,7 × Sn[k] + 0,3 × Dn[k]

G[grupa] = średnia K z jej 5 kompetencji
```

**Test poprawności:** suma `S_raw` po 30 kompetencjach musi wynosić dokładnie 0, a średnia `Sn` dokładnie 50. Każdy blok wnosi +1,5 +0,5 −0,5 −1,5 = 0.

**Remisy** rozstrzyga kolejno: wyższe `Sn`, potem wyższe `D`, potem niższe ID. Deterministycznie.

---

# 8. WSKAŹNIKI JAKOŚCI

| Wskaźnik | Wzór | Próg | Działanie |
|---|---|---|---|
| **Zróżnicowanie** `Df` | `max(K) − min(K)` | `< 18` | Profil płaski — nie pokazuj TOP 5 |
| **Okazje** `Op` | suma `D` (0–90) | `< 8` | Licz `K` wyłącznie z `Sn`; wynik wstępny |
| **Przeszacowanie** | suma `D` | `> 75` | Licz `K` wyłącznie z `Sn` |
| **Spójność** `Cs` | Spearman `Sn` vs `Dn` | `< 0,20` | Wynik niepewny, sygnał dla prowadzącego |
| **Tempo** | czas części A | `< 7 min` | Nie raportuj, zaproponuj powtórzenie |
| **Bloki błyskawiczne** | liczba bloków `< 4000 ms` | `> 10` | To samo |
| **Spadek w drugiej połowie** | średni czas bloków 24–45 / bloków 1–23 | `< 0,45` | Flaga zmęczenia |

Ostatni wskaźnik jest nowy w wersji 2.0 i wynika z długości części A. Wyraźne przyspieszenie po przerwie oznacza, że uczestnik przestał czytać.

## Etykieta pewności

```
Df ≥ 30        → wyrazny
18 ≤ Df < 30   → umiarkowany
Df < 18        → jeszcze_nieuksztaltowany
```

Przy `Df < 18` nie pokazuj rankingu kompetencji. Pokaż wyniki 6 grup i zdanie: *„Na tym etapie trudno wskazać Twoje najmocniejsze strony — masz jeszcze za mało sytuacji, w których mogły się pokazać. To normalne i nie jest złą wiadomością.”*

---

# 9. MODEL DANYCH

```json
{
  "groups": [
    {"code":"AN","name":"Analiza i myslenie","capabilities":[1,2,3,4,5]}
  ],
  "capabilities": [
    {"id":1,"group":"AN","name":"Rozwiazywanie problemow",
     "desc_high":"...","desc_low":"..."}
  ],
  "items": [
    {"id":"K01_1","capability":1,"text":"Znalezc powod, dla ktorego cos przestalo dzialac",
     "desirability":"normal","active":true}
  ],
  "blocks": [{"index":1,"items":["K03_2","K09_5","K16_1","K27_4"]}],
  "crosswalk": [{"a1_area":1,"weights":{"27":0.30,"1":0.25,"26":0.20,"4":0.15,"22":0.10}}]
}
```

```json
{
  "participant_id":"uuid","assessment":"A2","version":"2.0",
  "part_a":[
    {"block_index":1,
     "presented_order":["K16_1","K27_4","K03_2","K09_5"],
     "ranking":{"K03_2":1,"K16_1":2,"K09_5":3,"K27_4":4},
     "ms_spent":14200}
  ],
  "part_b":{"1":[true,true,false],"2":[false,false,false]},
  "confirmation":[{"a1_area":21,"verdict":"zgadza_sie"}]
}
```

Zapisuj `presented_order` i `ms_spent`. Pierwsze pozwala sprawdzić efekt pozycji, drugie jest wejściem do wskaźników jakości.

---

# 10. WYNIK DLA UCZESTNIKA

## Ekran 1 — jedno zdanie

```
Najlepiej szłoby Ci: {kompetencja_1} i {kompetencja_2}.
```

## Ekran 2 — pięć najmocniejszych

Dla każdej: nazwa, `desc_high`, oraz przy `D ≥ 2` dopisek *„i masz na to konkretne przykłady”*, a przy `D = 0` dopisek *„na razie bez doświadczeń, które by to potwierdzały”*.

Drugi dopisek jest ważny. Bez niego uczestnik dostaje mocną stronę opartą wyłącznie na własnym wyobrażeniu, co jest najsłabszą możliwą podstawą decyzji zawodowej.

## Ekran 3 — pięć najsłabszych

Wyłącznie `desc_low` plus zdanie ramujące: *„To nie jest wyrok. W Twoim wieku większość kompetencji dopiero się buduje — to lista rzeczy, których możesz się nauczyć, jeśli będą potrzebne na Twojej drodze.”*

Zdanie ramujące jest obowiązkowe. Assessment mierzy przekonanie o sobie, a nie sufit możliwości, i młody człowiek musi to usłyszeć wprost.

## Ekran 4 — lubię kontra wychodzi mi

Wymaga danych z A1. Opisany w sekcji 11.

---

# 11. POŁĄCZENIE Z A1 — GŁÓWNY PRODUKT

## 11.1 Macierz powiązania

Każdy z 24 obszarów zainteresowań ma przypisane kompetencje z wagami sumującymi się do 1,00.

```
Wsparcie[obszar] = Σ ( waga × K[kompetencja] )
```

| Obszar A1 | Kompetencje A2 (waga) |
|---|---|
| 1. Naprawa i mechanika | Obsługa sprzętu i techniki (0.30), Rozwiązywanie problemów (0.25), Sprawność manualna (0.20), Myślenie systemowe (0.15), Dokładność (0.10) |
| 2. Budowanie i wytwarzanie | Sprawność manualna (0.30), Wyobraźnia przestrzenna (0.20), Wytrwałość w powtarzalnym (0.20), Obsługa sprzętu i techniki (0.15), Dokładność (0.15) |
| 3. Przyroda, zwierzęta, rośliny | Wytrzymałość fizyczna (0.25), Cierpliwość i opiekuńczość (0.25), Wytrwałość w powtarzalnym (0.20), Obsługa sprzętu i techniki (0.15), Dokładność (0.15) |
| 4. Ciało, ruch, teren | Wytrzymałość fizyczna (0.35), Opanowanie pod presją (0.25), Obsługa sprzętu i techniki (0.15), Prowadzenie grupy (0.15), Samodzielność bez nadzoru (0.10) |
| 5. Technologia i programowanie | Rozwiązywanie problemów (0.30), Szybkie uczenie się nowego (0.25), Myślenie systemowe (0.20), Dokładność (0.15), Samodzielność bez nadzoru (0.10) |
| 6. Nauka i eksperyment | Analiza informacji (0.25), Myślenie systemowe (0.25), Dokładność (0.20), Wytrwałość w powtarzalnym (0.15), Szybkie uczenie się nowego (0.15) |
| 7. Zdrowie i ciało człowieka | Cierpliwość i opiekuńczość (0.20), Dokładność (0.20), Opanowanie pod presją (0.20), Zapamiętywanie i przywoływanie (0.15), Wyczuwanie ludzi (0.15), Szybkie uczenie się nowego (0.10) |
| 8. Liczby, dane, wzorce | Analiza informacji (0.30), Rachunki i szacowanie (0.30), Dokładność (0.20), Myślenie systemowe (0.20) |
| 9. Obraz i design | Wyczucie formy i estetyki (0.45), Wymyślanie nowych rozwiązań (0.25), Wyobraźnia przestrzenna (0.20), Dokładność (0.10) |
| 10. Słowo i pisanie | Wyrażanie się słowem (0.50), Wymyślanie nowych rozwiązań (0.20), Analiza informacji (0.20), Dokładność (0.10) |
| 11. Dźwięk i muzyka | Wyczucie formy i estetyki (0.30), Sprawność manualna (0.20), Wytrwałość w powtarzalnym (0.20), Szybkie uczenie się nowego (0.15), Obsługa sprzętu i techniki (0.15) |
| 12. Scena, film, występ | Wystąpienia przed grupą (0.35), Wyczucie formy i estetyki (0.20), Wymyślanie nowych rozwiązań (0.15), Opanowanie pod presją (0.15), Odporność na odmowę i porażkę (0.15) |
| 13. Opieka i troska | Cierpliwość i opiekuńczość (0.40), Wyczuwanie ludzi (0.20), Uprzejmość pod presją (0.15), Wytrwałość w powtarzalnym (0.15), Opanowanie pod presją (0.10) |
| 14. Nauczanie i tłumaczenie | Wyjaśnianie i uczenie innych (0.40), Wystąpienia przed grupą (0.20), Wyczuwanie ludzi (0.15), Cierpliwość i opiekuńczość (0.15), Organizowanie i planowanie (0.10) |
| 15. Rozmowa i wsparcie | Wyczuwanie ludzi (0.40), Rozbrajanie napięć (0.25), Cierpliwość i opiekuńczość (0.20), Wyjaśnianie i uczenie innych (0.15) |
| 16. Wspólnota i służba | Prowadzenie grupy (0.25), Organizowanie i planowanie (0.25), Wyczuwanie ludzi (0.20), Wystąpienia przed grupą (0.15), Przekonywanie (0.15) |
| 17. Sprzedaż i przekonywanie | Przekonywanie (0.35), Negocjowanie (0.20), Odporność na odmowę i porażkę (0.20), Wyczuwanie ludzi (0.15), Uprzejmość pod presją (0.10) |
| 18. Prowadzenie ludzi | Prowadzenie grupy (0.35), Organizowanie i planowanie (0.20), Rozbrajanie napięć (0.15), Opanowanie pod presją (0.15), Negocjowanie (0.15) |
| 19. Przedsiębiorczość i ryzyko | Odporność na odmowę i porażkę (0.25), Wymyślanie nowych rozwiązań (0.20), Samodzielność bez nadzoru (0.20), Przekonywanie (0.15), Organizowanie i planowanie (0.10), Opanowanie pod presją (0.10) |
| 20. Spór, prawo, negocjacje | Negocjowanie (0.25), Praca z regułami i przepisami (0.25), Przekonywanie (0.20), Wyrażanie się słowem (0.15), Analiza informacji (0.15) |
| 21. Porządkowanie i systematyzowanie | Organizowanie i planowanie (0.35), Dokładność (0.25), Prowadzenie wielu spraw naraz (0.20), Praca z regułami i przepisami (0.10), Wytrwałość w powtarzalnym (0.10) |
| 22. Precyzja i kontrola | Dokładność (0.45), Praca z regułami i przepisami (0.20), Wytrwałość w powtarzalnym (0.20), Zapamiętywanie i przywoływanie (0.15) |
| 23. Pieniądze i rozliczenia | Rachunki i szacowanie (0.35), Dokładność (0.30), Praca z regułami i przepisami (0.20), Organizowanie i planowanie (0.15) |
| 24. Planowanie i logistyka | Organizowanie i planowanie (0.35), Prowadzenie wielu spraw naraz (0.30), Opanowanie pod presją (0.15), Wyobraźnia przestrzenna (0.10), Myślenie systemowe (0.10) |

## 11.2 Cztery ćwiartki

| Warunek | Etykieta | Komunikat |
|---|---|---|
| `Z ≥ 60` i `W ≥ 60` | **MOCNA DROGA** | „Ciągnie Cię do tego i masz na to zaplecze. Tu warto szukać najmocniej.” |
| `Z < 45` i `W ≥ 60` | **UKRYTY ATUT** | „Nie palisz się do tego, ale prawdopodobnie poszłoby Ci lepiej niż większości. Warto sprawdzić, zanim odrzucisz.” |
| `Z ≥ 60` i `W < 45` | **CHCĘ, ALE MUSZĘ ZBUDOWAĆ** | „Bardzo Cię to ciągnie, ale zaplecza jeszcze nie ma. To nie znaczy nie — to znaczy: najpierw te umiejętności.” |
| `Z < 45` i `W < 45` | **RACZEJ NIE** | Pokazywane tylko zbiorczo, bez rozwinięcia |

**Ćwiartka UKRYTY ATUT jest powodem, dla którego ten moduł istnieje.** Pokaż maksymalnie 3 takie obszary, posortowane malejąco po `W`.

Ćwiartka CHCĘ, ALE MUSZĘ ZBUDOWAĆ nie może być nigdzie sformułowana jako odradzanie. U siedemnastolatka niskie zaplecze kompetencyjne jest stanem domyślnym, nie diagnozą.

## 11.3 Umiejętności do rozwoju — wyliczane automatycznie

```
Dla 5 obszarów o najwyższym Z:
  zbierz wszystkie kompetencje z ich macierzy powiazania
  posortuj rosnaco po K
  zwroc 5 najnizszych o wadze >= 0,15
```

Ta lista realizuje punkt *jakich umiejętności potrzebuję* z modelu programu i powstaje bez zadawania uczestnikowi dodatkowego pytania.

## 11.4 Ekran potwierdzenia

Po policzeniu ćwiartek, przed raportem, pokaż maksymalnie 3 najsilniejsze UKRYTE ATUTY:

> Wygląda na to, że **{obszar}** mogłoby Ci iść lepiej, niż to lubisz. Zgadza się?
>
> ○ Tak, to brzmi jak ja  ○ Nie, to nie o mnie  ○ Nie wiem

Odpowiedź zapisz w `confirmation`. Ma dwa zastosowania: wchodzi do sesji 1:1 jako materiał do rozmowy i stanowi **najtańszy dostępny dowód trafności narzędzia** — odsetek potwierdzeń można śledzić między kohortami.

Odpowiedź nie zmienia wyników liczbowych, tylko sposób prezentacji.

---

# 12. WYJŚCIE MODUŁU

```json
{
  "participant_id":"uuid","assessment":"A2","version":"2.0",
  "profile_confidence":"wyrazny",
  "quality":{"differentiation":37.5,"opportunity_total":34,"consistency":0.48,
             "part_a_seconds":842,"fast_blocks":2,"fatigue_ratio":0.81,"flags":[]},
  "capabilities":[{"id":12,"K":79.2,"Sn":83.3,"D":2,"rank":1}],
  "groups":{"AN":61.2,"UT":48.0,"SL":70.5,"LU":66.1,"WY":52.8,"CP":39.4},
  "top5":[12,16,1,17,6],
  "bottom5":[28,26,13,3,30],
  "area_support":{"1":48.2,"2":41.0,"14":76.3},
  "quadrants":{"mocna_droga":[14,15],"ukryty_atut":[21,24],
               "chce_ale_musze_zbudowac":[12],"raczej_nie":[2,3,17]},
  "skills_to_develop":[13,21,3,10,30],
  "confirmation":[{"a1_area":21,"verdict":"zgadza_sie"}],
  "suppressed":[]
}
```

`area_support` zawiera wszystkie 24 obszary i jest **głównym wejściem do silnika dopasowania** obok `Z` z A1. `skills_to_develop` zawiera ID kompetencji, nie obszarów.

**Przy braku danych A1** moduł działa, ale zwraca `area_support`, `quadrants` i `skills_to_develop` jako `null`, a ekran 4 jest pomijany.

---

# 13. PRZYPADKI BRZEGOWE

| Sytuacja | Obsługa |
|---|---|
| Brak wyników A1 | Moduł działa samodzielnie; ćwiartki i ekran 4 pominięte |
| Zero zaznaczonych dowodów | `K` liczone z samego `Sn`; flaga niskich okazji |
| Wszystkie 90 dowodów zaznaczonych | To samo; flaga przeszacowania |
| Przerwanie w połowie | Autozapis po każdym bloku; wznowienie w ciągu 48 h |
| Odmowa na ekranie potwierdzenia | Dozwolona; `verdict` = `brak` |
| Wszystkie ukryte atuty odrzucone | Nie ukrywaj ich; oznacz do omówienia 1:1 |
| Płaski profil w A1 i w A2 | `quadrants` = `null`; lepiej nie pokazać nic niż fikcję |
| Powtórzenie assessmentu | Osobna próba, bez nadpisywania |

---

# 14. CZEGO MODUŁ NIE POKAZUJE

- **żadnego słowa sugerującego zmierzoną zdolność** — nie `masz talent do`, nie `jesteś słaby w`; zawsze `Twoim zdaniem poszłoby Ci`
- **porównania z innymi uczestnikami**
- **surowych `K`, `Sn`, `Dn`** — to dane dla silnika i prowadzącego
- **ćwiartki RACZEJ NIE w rozwinięciu** — tylko zbiorczo
- **odradzania czegokolwiek** na podstawie niskiego zaplecza kompetencyjnego
- **nazw ani kodów grup**
- **listy wszystkich 30 kompetencji z wynikami** — top 5 i bottom 5 wystarczą

Ostatni punkt jest nowy w wersji 2.0. Przy 30 kompetencjach pokusa pokazania pełnego rankingu jest duża, a efektem byłby ekran, którego nikt nie przeczyta, i fałszywe wrażenie precyzji na pozycjach 12–25, gdzie różnice są w granicach szumu.

---

# 15. PULA REZERWOWA

30 pozycji nieużywanych w planie bloków. Wymiana jeden do jednego w obrębie tej samej kompetencji zachowuje bilans planu.

| Kompetencja | ID | Treść |
|:---:|---|---|
| 1 | `K01_7` | Doprowadzić do końca sprawę, która się zacięła |
| 2 | `K02_7` | Oddzielić fakty od czyjejś opinii |
| 3 | `K03_7` | Policzyć, o ile procent coś się zmieniło |
| 4 | `K04_7` | Wyjaśnić, dlaczego ten sam problem ciągle wraca |
| 5 | `K05_7` | Dopilnować, żeby procedura została dotrzymana |
| 6 | `K06_7` | Ogarnąć nowe narzędzie w kilka godzin |
| 7 | `K07_7` | Pamiętać, gdzie dokładnie coś leży |
| 8 | `K08_7` | Zaproponować kierunek, gdy nikt nie wie, co dalej |
| 9 | `K09_7` | Nadać czemuś spójny wygląd od początku do końca |
| 10 | `K10_7` | Zapamiętać drogę po jednym przejściu |
| 11 | `K11_7` | Sformułować myśl tak, żeby nie dało się jej przekręcić |
| 12 | `K12_7` | Przygotować materiał, z którego ktoś nauczy się sam |
| 13 | `K13_7` | Utrzymać uwagę ludzi przez dłuższy czas |
| 14 | `K14_7` | Polecić komuś coś tak, żeby naprawdę z tego skorzystał |
| 15 | `K15_7` | Ustalić podział, który wszyscy przyjmą |
| 16 | `K16_7` | Zauważyć, że ktoś mówi co innego, niż myśli |
| 17 | `K17_7` | Być łagodnym wobec kogoś, kto jest trudny |
| 18 | `K18_7` | Przerwać narastającą awanturę |
| 19 | `K19_7` | Zachować się profesjonalnie wobec kogoś, kogo nie lubisz |
| 20 | `K20_7` | Doprowadzić grupę do celu mimo oporu |
| 21 | `K21_7` | Rozpisać duże zadanie na drobne kroki |
| 22 | `K22_7` | Wykonać zadanie dokładnie tak, jak zostało opisane |
| 23 | `K23_7` | Nie odpuścić, kiedy efektu jeszcze nie widać |
| 24 | `K24_7` | Nie zapomnieć o niczym w gorączkowym dniu |
| 25 | `K25_7` | Dokończyć zadanie, o które nikt się nie upomina |
| 26 | `K26_7` | Powtórzyć ten sam ruch dokładnie wiele razy |
| 27 | `K27_7` | Zadbać o sprzęt, żeby wytrzymał dłużej |
| 28 | `K28_7` | Utrzymać skupienie mimo zmęczenia ciała |
| 29 | `K29_7` | Wrócić do działania szybko po wpadce |
| 30 | `K30_7` | Pokazać swoją pracę, choć mogą ją zjechać |

W kompetencji 20 rezerwa usuwa drugą pozycję o podwyższonej atrakcyjności, dzięki czemu w zestawie aktywnym zostaje tylko jedna.

---

# 16. TESTY AKCEPTACYJNE

1. **Bilans zerowy.** Suma `S_raw` po 30 kompetencjach = 0; średnia `Sn` = 50.
2. **Kompletność planu.** Każda kompetencja w 6 blokach; każda ze 180 pozycji raz; żaden blok z dwiema kompetencjami tej samej grupy; każda grupa w 30 blokach.
3. **Atrakcyjność.** Żaden blok nie zawiera dwóch pozycji `desirability: high`.
4. **Macierz.** Wagi w każdym wierszu `crosswalk` sumują się do 1,00 (tolerancja 1e−9).
5. **Determinizm.** Ten sam komplet odpowiedzi daje identyczny raport niezależnie od kolejności prezentacji.
6. **Praca bez A1.** Moduł kończy się poprawnie; `quadrants` = `null`, brak błędu.
7. **Płaski profil.** Przy `Df < 18` brak ekranów 2 i 3, `suppressed` zawiera `top5` i `bottom5`.
8. **Zero dowodów.** Przy sumie `D` = 0 wynik liczy się poprawnie z samego `Sn`.
9. **Izolacja od A1.** Interfejs nie wyświetla żadnych wyników A1 przed zakończeniem części B.
10. **Przerwa.** Ekran przerwy pojawia się dokładnie raz, po 23 bloku.

---

# 17. CO ZOSTAJE DO ZROBIENIA

1. **Przegląd ekspercki 210 pozycji** pod kątem reguły z sekcji 1: żadna pozycja A2 nie może dać się jednoznacznie przypisać do jednego obszaru A1.
2. **Test rozróżnialności par ryzykownych.** Przy 30 skalach trzeba sprawdzić, czy uczestnicy widzą różnicę między parami: 2 i 4, 5 i 22, 14 i 15, 17 i 19, 21 i 24, 26 i 27, 29 i 30. Metoda: w wywiadzie poznawczym pokaż obie nazwy z opisami i zapytaj, czym się różnią. Jeśli uczestnik nie umie powiedzieć, pozycje wymagają przepisania.
3. **Wywiady poznawcze** na tej samej grupie 10–20 osób co przy A1.
4. **Weryfikacja macierzy z sekcji 11** przez dwie osoby niezależnie.
5. **Śledzenie odsetka potwierdzeń** z ekranu 11.4 między kohortami.

Punkt 2 jest specyficzny dla wersji 30-kompetencyjnej i najważniejszy. Punkt 4 pozostaje najsłabszym ogniwem całego systemu: wagi w macierzy są rozsądne, ale pochodzą z osądu, nie z badań. Dopóki nie ma danych, `area_support` należy traktować jako przybliżenie i nie budować na nim rekomendacji ostrzejszych niż pasma opisowe.