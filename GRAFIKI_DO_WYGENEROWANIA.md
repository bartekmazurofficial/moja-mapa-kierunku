# Ilustracje do wygenerowania

Spis powstaje ze słowników platformy (`npx tsx scripts/grafiki-spis.ts`), więc
kody i teksty zgadzają się co do znaku z tym, co widzi uczestnik, a kolumna
**Stan** mówi prawdę o tym, co już leży w repozytorium.

## Ile tego jest

| Zestaw | Gdzie się pokazuje | Sztuk | Stan |
|---|---|---|---|
| A1 · obszary zainteresowań | kafel przy wierszu rankingu | 24 | komplet |
| A2 · kompetencje | kafel przy wierszu rankingu | 30 | komplet |
| A3 · osie | pas nad dwiema kartami wyboru | 13 | komplet |
| A3 · bieguny | połowa pasa nad kartą wyboru | 26 | **brakuje 26** |
| A4 · wartości | połowa pasa nad kartą wyboru | 12 | komplet |
| A5 · bloki warunków | pas nad trzema odpowiedziami | 7 | **brakuje 7** |
| A5 · pojedyncze warunki | pas nad trzema odpowiedziami | 43 | **brakuje 43** |
| M1 · bieguny wymiarów | połowa pasa nad kartą wyboru | 24 | **brakuje 24** |
| Plansze obszarów | nagłówek karty zawodu | 24 | **brakuje 24** |

**Minimum, żeby wszystkie panele miały komplet: 81 plików.**
To wariant z siedmioma obrazkami blokowymi dla A5 zamiast czterdziestu trzech
pojedynczych. Z pełnym A5 wychodzi 117.

## Jak to wgrać

1. Nazwij pliki źródłowe tak, jak mówi kolumna **Plik**, z ukośnikiem
   zamienionym na myślnik: `a3/INI-A.png` → plik `a3-INI-A.png`,
   `m1w/CEN-A.png` → plik `m1w-CEN-A.png`. **Wyjątek: plansze.** Tam klucz
   jest już w nazwie, więc `plansze/a5-1.png` → plik `a5-1.png`,
   a `plansze/a1-7.png` → plik `a1-7.png`.
2. Wrzuć wszystkie pliki jednego zestawu do jednego katalogu.
3. Uruchom `npx tsx scripts/grafiki.ts <katalog> <zestaw>`:
   - `npx tsx scripts/grafiki.ts ~/Downloads/a3_bieguny a3`
   - `npx tsx scripts/grafiki.ts ~/Downloads/m1_bieguny m1w`
   - `npx tsx scripts/grafiki.ts ~/Downloads/a5_bloki plansze`
   - `npx tsx scripts/grafiki.ts ~/Downloads/plansze_obszarow plansze`

   Kwadraty dostają dwie wersje, 256 px na kafel i 768 px na pas. Plansze
   jedną, szeroką 1200 px.
4. Dopisz klucze do list w `lib/ui/obrazy.ts`: kwadraty do `Z_OBRAZEM`,
   plansze do `Z_PLANSZA`. **Dopóki klucza tam nie ma, obrazek się nie
   pokaże**, i to jest celowe: klucz bez pliku dawałby pustą ramkę.

Warunki A5 i plansze obszarów idą **wyłącznie** do `Z_PLANSZA`, bo pokazują
się tylko jako pas. Bieguny A3 i M1 idą do `Z_OBRAZEM`.

Dopóki pliku nie ma, ekran po prostu rysuje się bez obrazka i nic się nie psuje.

## Dwa kształty, nie jeden

Panele assessmentów pokazują obrazki na dwa sposoby i od tego zależy kadr.

**Kwadrat 1:1, co najmniej 1024 × 1024 px.** Kafel przy wierszu rankingu
(A1, A2) i połowa pasa nad kartą wyboru (A3 bieguny, A4, M1). Połowa pasa ma
proporcję mniej więcej 1,9:1, więc kwadrat jest przycinany do środka: **ważna
rzecz musi być w środku kadru, nie przy krawędzi**.

**Pas poziomy 16:9, co najmniej 1600 × 900 px.** Pas nad trzema odpowiedziami
w A5 i nagłówek karty zawodu (plansze obszarów). Tu obrazek jest przycinany do
mniej więcej 3,8:1 w assessmencie i 1,5:1 na karcie zawodu, więc **dolne
i górne dwadzieścia procent kadru może zniknąć**.

Bez tekstu na obrazku: każdy napis musiałby być tłumaczony i skalowany razem
z obrazem, a przy 256 px zrobi się nieczytelny.

## Styl

Tak, żeby całość trzymała się kupy z tym, co już leży w `public/grafika/a1`:

- ilustracja, nie fotografia: miękkie światło, delikatny blask, lekko
  bajkowy realizm,
- jedna scena, jeden bohater albo jeden przedmiot, bez tłoku i bez kolaży,
- paleta chłodna z ciepłym akcentem: fiolet, granat i błękit jako podstawa,
  pomarańcz albo złoto jako źródło światła,
- tło rozmyte, bez ostrych krawędzi po brzegach, żeby kadr dobrze wyglądał
  po przycięciu do kwadratu i do pasa,
- ludzie różnorodni i w wieku uczestników programu, czyli 16 do 24 lat,
- bez marek, logotypów, twarzy konkretnych osób i bez czytelnych napisów.

## Czego nie rysować

**Ocen i wartościowania.** Obrazek bieguna „wolę pracować sam" nie może
wyglądać na smutny, a „wolę w grupie" na radosny. Obie strony każdej pary
muszą być tak samo atrakcyjne, bo inaczej obrazek wybiera za uczestnika
i psuje pomiar. To samo dotyczy warunków pracy w A5: hałas pokazujemy
rzeczowo, a nie jako kogoś cierpiącego.

Ta zasada jest twardsza niż wygląda. Pas nad dwiema kartami wyboru jest
dzielony na pół białą linią i obie połowy mają **dokładnie tę samą
szerokość i wysokość**, właśnie po to, żeby żadna strona nie dostała
przewagi. Jeśli jedna ilustracja będzie jaśniejsza, cieplejsza albo po
prostu ładniejsza od drugiej, przewagę odzyska obrazem.

## A3 · Jak naturalnie działam, bieguny osi

**Najpilniejsze.** Panel wyboru z dwóch pokazuje jeden pas ilustracji dzielony na pół: lewa połowa należy do lewej odpowiedzi, prawa do prawej. Dziś A3 ma tylko obrazki całych osi, więc obie karty dzielą jedno zdjęcie i nie pomaga ono wybrać. Każdy biegun potrzebuje własnej sceny pokazującej **to samo zajęcie w dwóch stylach działania**, nie dwa różne zawody.

Kwadrat 1:1.

**Ile: 26, w tym 26 do zrobienia.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `a3/INI-A.png` | Zaczynam działać, zanim ktoś mnie poprosi | **do zrobienia** |
| `a3/INI-B.png` | Czekam, aż będzie jasne, czego się ode mnie oczekuje | **do zrobienia** |
| `a3/STR-A.png` | Muszę mieć plan przed startem | **do zrobienia** |
| `a3/STR-B.png` | Plan powstaje mi w trakcie | **do zrobienia** |
| `a3/TEM-A.png` | Wolę skończyć szybko i poprawić później | **do zrobienia** |
| `a3/TEM-B.png` | Wolę zrobić raz, ale porządnie | **do zrobienia** |
| `a3/SAM-A.png` | Najlepiej pracuje mi się samemu | **do zrobienia** |
| `a3/SAM-B.png` | Najlepiej pracuje mi się w grupie | **do zrobienia** |
| `a3/GLE-A.png` | Wolę jedną rzecz doprowadzić do końca | **do zrobienia** |
| `a3/GLE-B.png` | Wolę mieć kilka rzeczy naraz | **do zrobienia** |
| `a3/RYZ-A.png` | Wolę spróbować i zobaczyć | **do zrobienia** |
| `a3/RYZ-B.png` | Wolę najpierw się upewnić | **do zrobienia** |
| `a3/DEC-A.png` | Chcę mieć wpływ na to, co się dzieje | **do zrobienia** |
| `a3/DEC-B.png` | Chcę wiedzieć, co mam zrobić | **do zrobienia** |
| `a3/KON-A.png` | Mówię wprost, że się nie zgadzam | **do zrobienia** |
| `a3/KON-B.png` | Wolę nie zaogniać | **do zrobienia** |
| `a3/NOW-A.png` | Lubię próbować nieznanych rzeczy | **do zrobienia** |
| `a3/NOW-B.png` | Wolę to, co znam | **do zrobienia** |
| `a3/NAP-A.png` | Robię swoje, choć nikt nie patrzy | **do zrobienia** |
| `a3/NAP-B.png` | Potrzebuję, żeby ktoś sprawdzał | **do zrobienia** |
| `a3/RYT-A.png` | Wolę równe tempo codziennie | **do zrobienia** |
| `a3/RYT-B.png` | Wolę usiąść raz i zrobić dużo naraz | **do zrobienia** |
| `a3/OTO-A.png` | Potrzebuję ciszy, żeby się skupić | **do zrobienia** |
| `a3/OTO-B.png` | Skupiam się mimo hałasu | **do zrobienia** |
| `a3/EFE-A.png` | Wolę pracę, po której na koniec dnia widać, co zrobiłem | **do zrobienia** |
| `a3/EFE-B.png` | Nie przeszkadza mi, że efekt mojej pracy będzie widać dopiero za rok | **do zrobienia** |

## M1 · Jakiego życia chcesz, bieguny wymiarów

To samo co w A3, tylko o życiu, a nie o pracy. Sceny z życia codziennego, nie z biura. Dwanaście par, żadna jeszcze nie ma obrazka, więc ten panel jest dziś bez ilustracji w ogóle.

Kwadrat 1:1.

**Ile: 24, w tym 24 do zrobienia.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `m1w/CEN-A.png` | Chcę, żeby praca była jedną z najważniejszych rzeczy w życiu | **do zrobienia** |
| `m1w/CEN-B.png` | Chcę, żeby praca była tylko częścią życia | **do zrobienia** |
| `m1w/GRA-A.png` | Nie przeszkadza mi, gdy praca wchodzi w wieczory | **do zrobienia** |
| `m1w/GRA-B.png` | Chcę mieć wyraźną granicę | **do zrobienia** |
| `m1w/GOD-A.png` | Wolę pracować dużo i dużo osiągać | **do zrobienia** |
| `m1w/GOD-B.png` | Wolę pracować mniej i mieć więcej czasu | **do zrobienia** |
| `m1w/TEMP-A.png` | Chcę szybko awansować | **do zrobienia** |
| `m1w/TEMP-B.png` | Nie spieszy mi się, byle w dobrą stronę | **do zrobienia** |
| `m1w/MIE-A.png` | Chcę codziennie wychodzić do pracy | **do zrobienia** |
| `m1w/MIE-B.png` | Chcę móc pracować z domu | **do zrobienia** |
| `m1w/ORG-A.png` | Wolę dużą firmę z jasną strukturą | **do zrobienia** |
| `m1w/ORG-B.png` | Wolę małe miejsce, gdzie ludzie się znają | **do zrobienia** |
| `m1w/KOR-A.png` | Chcę mieć jedno miejsce, do którego wracam | **do zrobienia** |
| `m1w/KOR-B.png` | Chcę móc się przenieść, kiedy zechcę | **do zrobienia** |
| `m1w/INW-A.png` | Chcę zacząć zarabiać jak najszybciej | **do zrobienia** |
| `m1w/INW-B.png` | Mogę poczekać kilka lat, jeśli to się opłaci | **do zrobienia** |
| `m1w/POZ-A.png` | Chcę móc sobie pozwolić na dużo | **do zrobienia** |
| `m1w/POZ-B.png` | Wystarczy mi, żeby niczego nie brakowało | **do zrobienia** |
| `m1w/LUD-A.png` | Chcę kiedyś kierować zespołem | **do zrobienia** |
| `m1w/LUD-B.png` | Wolę odpowiadać tylko za swoją pracę | **do zrobienia** |
| `m1w/WID-A.png` | Nie przeszkadza mi, że ludzie mnie kojarzą | **do zrobienia** |
| `m1w/WID-B.png` | Wolę pozostać nierozpoznawalny | **do zrobienia** |
| `m1w/ROD-A.png` | Chciałbym mieć rodzinę stosunkowo wcześnie | **do zrobienia** |
| `m1w/ROD-B.png` | Chciałbym najpierw pożyć inaczej | **do zrobienia** |

## A5 · Filtry rzeczywistości, siedem bloków

**Wariant zalecany.** Panel z trzema odpowiedziami ma nad pytaniem pas na całą szerokość i dziś jest pusty. Siedem obrazków blokowych obsłuży wszystkie czterdzieści trzy warunki: platforma bierze najpierw obrazek warunku, a gdy go nie ma, obrazek bloku.

Pas poziomy 16:9.

**Ile: 7, w tym 7 do zrobienia.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `plansze/a5-1.png` | Nauka i zdobywanie uprawnień (5 warunków w bloku) | **do zrobienia** |
| `plansze/a5-2.png` | Miejsce (5 warunków w bloku) | **do zrobienia** |
| `plansze/a5-3.png` | Czas (6 warunków w bloku) | **do zrobienia** |
| `plansze/a5-4.png` | Warunki fizyczne (11 warunków w bloku) | **do zrobienia** |
| `plansze/a5-5.png` | Ludzie (8 warunków w bloku) | **do zrobienia** |
| `plansze/a5-6.png` | Pieniądze i ryzyko (4 warunki w bloku) | **do zrobienia** |
| `plansze/a5-7.png` | Odpowiedzialność (4 warunki w bloku) | **do zrobienia** |

## Plansze obszarów, nagłówek karty zawodu

Karta zawodu ma w nagłówku zdjęcie dochodzące do prawej i górnej krawędzi, zszyte z tekstem maską gradientową. Bierze obrazek obszaru, do którego należy zawód. Dziś nie ma ani jednej planszy, więc kadr jest kwadratowy i rozciągany. Te same dwadzieścia cztery sceny co w A1, ale **kadrowane poziomo**, z miejscem po lewej, gdzie wchodzi biała maska.

Pas poziomy 16:9. Ważna rzecz po prawej stronie kadru.

**Ile: 24, w tym 24 do zrobienia.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `plansze/a1-1.png` | Naprawianie i rozgryzanie, jak coś działa, kadr poziomy | **do zrobienia** |
| `plansze/a1-2.png` | Robienie rzeczy własnymi rękami, kadr poziomy | **do zrobienia** |
| `plansze/a1-3.png` | Zwierzęta, rośliny, przyroda, kadr poziomy | **do zrobienia** |
| `plansze/a1-4.png` | Ruch, teren, praca ciałem, kadr poziomy | **do zrobienia** |
| `plansze/a1-5.png` | Technologia i programowanie, kadr poziomy | **do zrobienia** |
| `plansze/a1-6.png` | Dociekanie, jak działa świat, kadr poziomy | **do zrobienia** |
| `plansze/a1-7.png` | Zdrowie i ludzkie ciało, kadr poziomy | **do zrobienia** |
| `plansze/a1-8.png` | Liczby i wyciąganie wniosków z danych, kadr poziomy | **do zrobienia** |
| `plansze/a1-9.png` | Obraz, wygląd, projektowanie, kadr poziomy | **do zrobienia** |
| `plansze/a1-10.png` | Pisanie i praca ze słowem, kadr poziomy | **do zrobienia** |
| `plansze/a1-11.png` | Dźwięk i muzyka, kadr poziomy | **do zrobienia** |
| `plansze/a1-12.png` | Scena, film, występowanie, kadr poziomy | **do zrobienia** |
| `plansze/a1-13.png` | Opiekowanie się drugim człowiekiem, kadr poziomy | **do zrobienia** |
| `plansze/a1-14.png` | Uczenie i tłumaczenie innym, kadr poziomy | **do zrobienia** |
| `plansze/a1-15.png` | Rozmowa i wspieranie w trudnościach, kadr poziomy | **do zrobienia** |
| `plansze/a1-16.png` | Wspólnota i robienie czegoś dla innych, kadr poziomy | **do zrobienia** |
| `plansze/a1-17.png` | Przekonywanie ludzi, kadr poziomy | **do zrobienia** |
| `plansze/a1-18.png` | Prowadzenie ludzi i decydowanie, kadr poziomy | **do zrobienia** |
| `plansze/a1-19.png` | Własne przedsięwzięcia i ryzyko, kadr poziomy | **do zrobienia** |
| `plansze/a1-20.png` | Argumentowanie, spór, negocjacje, kadr poziomy | **do zrobienia** |
| `plansze/a1-21.png` | Porządkowanie i układanie w system, kadr poziomy | **do zrobienia** |
| `plansze/a1-22.png` | Precyzja i wyłapywanie błędów, kadr poziomy | **do zrobienia** |
| `plansze/a1-23.png` | Pieniądze i rozliczenia, kadr poziomy | **do zrobienia** |
| `plansze/a1-24.png` | Planowanie i ogarnianie logistyki, kadr poziomy | **do zrobienia** |

## A5 · Filtry rzeczywistości, pojedyncze warunki

**Wariant pełny, zamiast siedmiu bloków albo po nich.** Czterdzieści trzy konkretne warunki. Każdy dosłany warunek nadpisuje obrazek swojego bloku, więc da się to robić partiami i nic się po drodze nie psuje.

Pas poziomy 16:9.

**Ile: 43, w tym 43 do zrobienia.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `plansze/a5-F01.png` | Studia trwające pięć lat albo dłużej (blok: Nauka i zdobywanie uprawnień) | **do zrobienia** |
| `plansze/a5-F02.png` | Studia, w jakiejkolwiek formie (blok: Nauka i zdobywanie uprawnień) | **do zrobienia** |
| `plansze/a5-F03.png` | Trudne egzaminy zawodowe po studiach (blok: Nauka i zdobywanie uprawnień) | **do zrobienia** |
| `plansze/a5-F04.png` | Dokształcanie się przez cały czas pracy (blok: Nauka i zdobywanie uprawnień) | **do zrobienia** |
| `plansze/a5-F05.png` | Nauka po godzinach, obok pracy (blok: Nauka i zdobywanie uprawnień) | **do zrobienia** |
| `plansze/a5-F06.png` | Przeprowadzka do innego miasta (blok: Miejsce) | **do zrobienia** |
| `plansze/a5-F07.png` | Praca albo studia za granicą (blok: Miejsce) | **do zrobienia** |
| `plansze/a5-F08.png` | Życie daleko od rodziny (blok: Miejsce) | **do zrobienia** |
| `plansze/a5-F09.png` | Częste wyjazdy służbowe (blok: Miejsce) | **do zrobienia** |
| `plansze/a5-F10.png` | Praca w jednym miejscu przez wiele lat (blok: Miejsce) | **do zrobienia** |
| `plansze/a5-F11.png` | Praca w weekendy (blok: Czas) | **do zrobienia** |
| `plansze/a5-F12.png` | Praca na zmiany, także nocne (blok: Czas) | **do zrobienia** |
| `plansze/a5-F13.png` | Dyżury i bycie pod telefonem (blok: Czas) | **do zrobienia** |
| `plansze/a5-F14.png` | Nadgodziny w gorących okresach (blok: Czas) | **do zrobienia** |
| `plansze/a5-F15.png` | Nieregularne, zmienne godziny (blok: Czas) | **do zrobienia** |
| `plansze/a5-F39.png` | Samodzielne zdobywanie klientów (blok: Czas) | **do zrobienia** |
| `plansze/a5-F16.png` | Praca wieczorami, gdy dzień się kończy (blok: Warunki fizyczne) | **do zrobienia** |
| `plansze/a5-F17.png` | Praca fizyczna, wymagająca siły (blok: Warunki fizyczne) | **do zrobienia** |
| `plansze/a5-F18.png` | Praca na dworze w każdą pogodę (blok: Warunki fizyczne) | **do zrobienia** |
| `plansze/a5-F19.png` | Stanie albo chodzenie przez większość dnia (blok: Warunki fizyczne) | **do zrobienia** |
| `plansze/a5-F20.png` | Siedzenie przy komputerze przez większość dnia (blok: Warunki fizyczne) | **do zrobienia** |
| `plansze/a5-F21.png` | Brud, zapachy i nieprzyjemne warunki (blok: Warunki fizyczne) | **do zrobienia** |
| `plansze/a5-F34.png` | Agresja słowna albo fizyczna w pracy (blok: Warunki fizyczne) | **do zrobienia** |
| `plansze/a5-F33.png` | Praca w pojedynkę, bez zespołu (blok: Warunki fizyczne) | **do zrobienia** |
| `plansze/a5-F36.png` | Niepewny, zmienny dochód (blok: Warunki fizyczne) | **do zrobienia** |
| `plansze/a5-F37.png` | Prowadzenie własnej działalności (blok: Warunki fizyczne) | **do zrobienia** |
| `plansze/a5-F38.png` | Niskie zarobki przez pierwsze lata (blok: Warunki fizyczne) | **do zrobienia** |
| `plansze/a5-F22.png` | Codzienny kontakt z krwią i ranami (blok: Ludzie) | **do zrobienia** |
| `plansze/a5-F23.png` | Kontakt ze śmiercią i z umieraniem (blok: Ludzie) | **do zrobienia** |
| `plansze/a5-F24.png` | Hałas taki, że trzeba nosić ochronniki (blok: Ludzie) | **do zrobienia** |
| `plansze/a5-F25.png` | Ciasne przestrzenie, na przykład szachty (blok: Ludzie) | **do zrobienia** |
| `plansze/a5-F26.png` | Praca na wysokości, na dachu albo rusztowaniu (blok: Ludzie) | **do zrobienia** |
| `plansze/a5-F27.png` | Codzienny kontakt z chemikaliami (blok: Ludzie) | **do zrobienia** |
| `plansze/a5-F35.png` | Słyszenie odmowy kilkadziesiąt razy w miesiącu (blok: Ludzie) | **do zrobienia** |
| `plansze/a5-F42.png` | Dużo papierów i sprawozdań (blok: Ludzie) | **do zrobienia** |
| `plansze/a5-F28.png` | Kontakt z ludźmi przez cały dzień (blok: Pieniądze i ryzyko) | **do zrobienia** |
| `plansze/a5-F29.png` | Praca z małymi dziećmi (blok: Pieniądze i ryzyko) | **do zrobienia** |
| `plansze/a5-F30.png` | Praca z osobami chorymi albo starszymi (blok: Pieniądze i ryzyko) | **do zrobienia** |
| `plansze/a5-F40.png` | Odpowiedzialność za czyjeś zdrowie (blok: Pieniądze i ryzyko) | **do zrobienia** |
| `plansze/a5-F31.png` | Obsługa niezadowolonych klientów (blok: Odpowiedzialność) | **do zrobienia** |
| `plansze/a5-F32.png` | Częste wystąpienia przed grupą (blok: Odpowiedzialność) | **do zrobienia** |
| `plansze/a5-F41.png` | Stała presja czasu i wyniku (blok: Odpowiedzialność) | **do zrobienia** |
| `plansze/a5-F43.png` | Poprawianie swojej pracy po raz czwarty (blok: Odpowiedzialność) | **do zrobienia** |

## A1 · Co mnie ciągnie, dwadzieścia cztery obszary

Komplet. Kafel przy wierszu w siatce rankingu. Spis dla porządku.

**Ile: 24. Komplet leży w repozytorium.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `a1/1.png` | Naprawianie i rozgryzanie, jak coś działa | jest |
| `a1/2.png` | Robienie rzeczy własnymi rękami | jest |
| `a1/3.png` | Zwierzęta, rośliny, przyroda | jest |
| `a1/4.png` | Ruch, teren, praca ciałem | jest |
| `a1/5.png` | Technologia i programowanie | jest |
| `a1/6.png` | Dociekanie, jak działa świat | jest |
| `a1/7.png` | Zdrowie i ludzkie ciało | jest |
| `a1/8.png` | Liczby i wyciąganie wniosków z danych | jest |
| `a1/9.png` | Obraz, wygląd, projektowanie | jest |
| `a1/10.png` | Pisanie i praca ze słowem | jest |
| `a1/11.png` | Dźwięk i muzyka | jest |
| `a1/12.png` | Scena, film, występowanie | jest |
| `a1/13.png` | Opiekowanie się drugim człowiekiem | jest |
| `a1/14.png` | Uczenie i tłumaczenie innym | jest |
| `a1/15.png` | Rozmowa i wspieranie w trudnościach | jest |
| `a1/16.png` | Wspólnota i robienie czegoś dla innych | jest |
| `a1/17.png` | Przekonywanie ludzi | jest |
| `a1/18.png` | Prowadzenie ludzi i decydowanie | jest |
| `a1/19.png` | Własne przedsięwzięcia i ryzyko | jest |
| `a1/20.png` | Argumentowanie, spór, negocjacje | jest |
| `a1/21.png` | Porządkowanie i układanie w system | jest |
| `a1/22.png` | Precyzja i wyłapywanie błędów | jest |
| `a1/23.png` | Pieniądze i rozliczenia | jest |
| `a1/24.png` | Planowanie i ogarnianie logistyki | jest |

## A2 · W czym mogę być dobry, trzydzieści kompetencji

Komplet. Kafel przy wierszu w siatce rankingu. Spis dla porządku.

**Ile: 30. Komplet leży w repozytorium.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `a2/1.png` | Rozwiązywanie problemów | jest |
| `a2/2.png` | Analiza informacji | jest |
| `a2/3.png` | Rachunki i szacowanie | jest |
| `a2/4.png` | Myślenie systemowe | jest |
| `a2/5.png` | Praca z regułami i przepisami | jest |
| `a2/6.png` | Szybkie uczenie się nowego | jest |
| `a2/7.png` | Zapamiętywanie i przywoływanie | jest |
| `a2/8.png` | Wymyślanie nowych rozwiązań | jest |
| `a2/9.png` | Wyczucie formy i estetyki | jest |
| `a2/10.png` | Wyobraźnia przestrzenna | jest |
| `a2/11.png` | Wyrażanie się słowem | jest |
| `a2/12.png` | Wyjaśnianie i uczenie innych | jest |
| `a2/13.png` | Wystąpienia przed grupą | jest |
| `a2/14.png` | Przekonywanie | jest |
| `a2/15.png` | Negocjowanie | jest |
| `a2/16.png` | Wyczuwanie ludzi | jest |
| `a2/17.png` | Cierpliwość i opiekuńczość | jest |
| `a2/18.png` | Rozbrajanie napięć | jest |
| `a2/19.png` | Uprzejmość pod presją | jest |
| `a2/20.png` | Prowadzenie grupy | jest |
| `a2/21.png` | Organizowanie i planowanie | jest |
| `a2/22.png` | Dokładność | jest |
| `a2/23.png` | Wytrwałość w powtarzalnym | jest |
| `a2/24.png` | Prowadzenie wielu spraw naraz | jest |
| `a2/25.png` | Samodzielność bez nadzoru | jest |
| `a2/26.png` | Sprawność manualna | jest |
| `a2/27.png` | Obsługa sprzętu i techniki | jest |
| `a2/28.png` | Wytrzymałość fizyczna | jest |
| `a2/29.png` | Opanowanie pod presją | jest |
| `a2/30.png` | Odporność na odmowę i porażkę | jest |

## A3 · osie, trzynaście wymiarów

Komplet. Dopóki nie ma biegunów, ten obrazek stoi jako wspólny pas nad obiema kartami. Po dosłaniu biegunów przestaje być używany na ekranie wyboru, ale zostaje jako znak wymiaru w innych miejscach.

**Ile: 13. Komplet leży w repozytorium.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `a3/INI.png` | Inicjatywa / Reagowanie | jest |
| `a3/STR.png` | Potrzeba struktury / Elastyczność | jest |
| `a3/TEM.png` | Tempo i przybliżenie / Wolniej i dokładnie | jest |
| `a3/SAM.png` | Samodzielnie / Z ludźmi | jest |
| `a3/GLE.png` | Głębia, jedno do końca / Szerokość, wiele naraz | jest |
| `a3/RYZ.png` | Gotowość na ryzyko / Potrzeba pewności | jest |
| `a3/DEC.png` | Chcę decydować / Chcę jasne zadanie | jest |
| `a3/KON.png` | Konfrontacja / Utrzymanie zgody | jest |
| `a3/NOW.png` | Nowe i nieznane / Sprawdzone | jest |
| `a3/NAP.png` | Napęd własny / Napęd z zewnątrz | jest |
| `a3/RYT.png` | Równe tempo / Praca zrywami | jest |
| `a3/OTO.png` | Cisza i porządek / Ruch i bodźce | jest |
| `a3/EFE.png` | Efekt szybki / Efekt odroczony | jest |

## A4 · Co jest dla mnie ważne, dwanaście wartości

Komplet. Tu obie strony pary to dwie różne wartości, więc jeden obrazek na wartość wystarcza i pas dzielony na pół działa od razu.

**Ile: 12. Komplet leży w repozytorium.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `a4/PIE.png` | Pieniądze i poziom życia | jest |
| `a4/STA.png` | Stabilność i bezpieczeństwo | jest |
| `a4/WOL.png` | Wolność i decydowanie o sobie | jest |
| `a4/ROZ.png` | Rozwój i uczenie się | jest |
| `a4/WPL.png` | Wpływ | jest |
| `a4/SEN.png` | Sens i pomaganie ludziom | jest |
| `a4/UZN.png` | Uznanie | jest |
| `a4/REL.png` | Bliskie relacje w pracy | jest |
| `a4/CZA.png` | Czas dla siebie i bliskich | jest |
| `a4/MIS.png` | Mistrzostwo | jest |
| `a4/ZMI.png` | Zmienność i wyzwania | jest |
| `a4/ZAS.png` | Zgodność z własnymi zasadami | jest |
