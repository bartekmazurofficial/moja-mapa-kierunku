# Ilustracje do wygenerowania

Ten spis powstaje ze słowników platformy (`npx tsx scripts/grafiki-spis.ts`),
więc kody i teksty zgadzają się co do znaku z tym, co widzi uczestnik.

## Jak to wgrać

1. Pliki źródłowe nazwij **kluczem z kolumny Plik, z katalogiem zamienionym
   na myślnik**: dla `a3/INI-A.png` plik nazywa się `a3-INI-A.png`, dla
   `a5/F01.png` plik nazywa się `a5-F01.png`. Skrypt rozpoznaje pliki po
   tym przedrostku i pomija wszystko, co do niego nie pasuje.
2. Wrzuć wszystkie pliki jednego modułu do jednego katalogu.
3. Uruchom `npx tsx scripts/grafiki.ts <katalog> <moduł>`, na przykład
   `npx tsx scripts/grafiki.ts ~/Downloads/grafiki_a3 a3`. Skrypt zrobi dwie
   wersje: 256 px na kafel i 768 px na nagłówek, i położy je w
   `public/grafika/<moduł>/`.
4. Dopisz klucze do listy `Z_OBRAZEM` w `lib/ui/obrazy.ts`. **Dopóki klucza
   tam nie ma, obrazek się nie pokaże**, i to jest celowe: klucz bez pliku
   dawałby pustą ramkę.

Dopóki pliku nie ma, ekran po prostu rysuje się bez obrazka i nic się nie psuje.

## Format i styl

**Format:** PNG albo JPG, kwadrat 1:1, co najmniej 1024 × 1024 px. Bez tekstu
na obrazku: każdy napis musiałby być tłumaczony i skalowany razem z obrazem,
a przy 256 px zrobi się nieczytelny.

**Styl, żeby całość trzymała się kupy z tym, co już jest w `public/grafika/a1`:**

- ilustracja, nie fotografia: miękkie światło, delikatny blask, lekko
  bajkowy realizm,
- jedna scena, jeden bohater albo jeden przedmiot, bez tłoku i bez kolaży,
- paleta chłodna z ciepłym akcentem: fiolet, granat i błękit jako podstawa,
  pomarańcz albo złoto jako źródło światła,
- tło rozmyte, bez ostrych krawędzi po brzegach, żeby kadr dobrze wyglądał
  po przycięciu do kwadratu i do pasa,
- ludzie różnorodni i w wieku uczestników programu, czyli 16 do 24 lat,
- bez marek, logotypów, twarzy konkretnych osób i bez czytelnych napisów.

**Czego nie rysować:** ocen i wartościowania. Obrazek bieguna „wolę pracować
sam" nie może wyglądać na smutny, a „wolę w grupie" na radosny. Obie strony
każdej pary muszą być tak samo atrakcyjne, bo inaczej obrazek wybiera za
uczestnika i psuje pomiar.

## A3 · Jak naturalnie działam, bieguny osi

Najpilniejsze. Dziś obie karty pary dzielą jeden obrazek osi, więc nie pomagają wybrać. Każdy biegun potrzebuje własnej sceny, pokazującej **to samo zajęcie w dwóch stylach działania**, nie dwa różne zawody.

**Ile: 26.**

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

To samo co w A3, tylko o życiu, a nie o pracy. Sceny z życia codziennego, nie z biura.

**Ile: 24.**

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

## A4 · Co jest dla mnie ważne, dwanaście wartości

Tu obie strony pary to dwie różne wartości, więc wystarczy jeden obrazek na wartość. Scena ma pokazywać wartość w działaniu, a nie symbol: nie waga dla sprawiedliwości, tylko ktoś, kto właśnie to robi.

**Ile: 12.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `a4/PIE.png` | Pieniądze i poziom życia | **do zrobienia** |
| `a4/STA.png` | Stabilność i bezpieczeństwo | **do zrobienia** |
| `a4/WOL.png` | Wolność i decydowanie o sobie | **do zrobienia** |
| `a4/ROZ.png` | Rozwój i uczenie się | **do zrobienia** |
| `a4/WPL.png` | Wpływ | **do zrobienia** |
| `a4/SEN.png` | Sens i pomaganie ludziom | **do zrobienia** |
| `a4/UZN.png` | Uznanie | **do zrobienia** |
| `a4/REL.png` | Bliskie relacje w pracy | **do zrobienia** |
| `a4/CZA.png` | Czas dla siebie i bliskich | **do zrobienia** |
| `a4/MIS.png` | Mistrzostwo | **do zrobienia** |
| `a4/ZMI.png` | Zmienność i wyzwania | **do zrobienia** |
| `a4/ZAS.png` | Zgodność z własnymi zasadami | **do zrobienia** |

## A5 · Filtry rzeczywistości, warunki pracy

Czterdzieści trzy konkretne warunki. Jeśli to za dużo, wystarczy siedem obrazków blokowych (`a5/1.png` … `a5/7.png`) i wtedy jeden obrazek obsłuży wszystkie pytania swojego bloku. Platforma bierze najpierw obrazek warunku, a gdy go nie ma, obrazek bloku. Warunek pokazujemy **neutralnie**: hałas w pracy ma być pokazany rzeczowo, a nie jako ktoś cierpiący.

**Ile: 43.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `a5/F01.png` | Studia trwające pięć lat albo dłużej (blok: Nauka i zdobywanie uprawnień) | **do zrobienia** |
| `a5/F02.png` | Studia, w jakiejkolwiek formie (blok: Nauka i zdobywanie uprawnień) | **do zrobienia** |
| `a5/F03.png` | Trudne egzaminy zawodowe po studiach (blok: Nauka i zdobywanie uprawnień) | **do zrobienia** |
| `a5/F04.png` | Dokształcanie się przez cały czas pracy (blok: Nauka i zdobywanie uprawnień) | **do zrobienia** |
| `a5/F05.png` | Nauka po godzinach, obok pracy (blok: Nauka i zdobywanie uprawnień) | **do zrobienia** |
| `a5/F06.png` | Przeprowadzka do innego miasta (blok: Miejsce) | **do zrobienia** |
| `a5/F07.png` | Praca albo studia za granicą (blok: Miejsce) | **do zrobienia** |
| `a5/F08.png` | Życie daleko od rodziny (blok: Miejsce) | **do zrobienia** |
| `a5/F09.png` | Częste wyjazdy służbowe (blok: Miejsce) | **do zrobienia** |
| `a5/F10.png` | Praca w jednym miejscu przez wiele lat (blok: Miejsce) | **do zrobienia** |
| `a5/F11.png` | Praca w weekendy (blok: Czas) | **do zrobienia** |
| `a5/F12.png` | Praca na zmiany, także nocne (blok: Czas) | **do zrobienia** |
| `a5/F13.png` | Dyżury i bycie pod telefonem (blok: Czas) | **do zrobienia** |
| `a5/F14.png` | Nadgodziny w gorących okresach (blok: Czas) | **do zrobienia** |
| `a5/F15.png` | Nieregularne, zmienne godziny (blok: Czas) | **do zrobienia** |
| `a5/F39.png` | Samodzielne zdobywanie klientów (blok: Czas) | **do zrobienia** |
| `a5/F16.png` | Praca wieczorami, gdy dzień się kończy (blok: Warunki fizyczne) | **do zrobienia** |
| `a5/F17.png` | Praca fizyczna, wymagająca siły (blok: Warunki fizyczne) | **do zrobienia** |
| `a5/F18.png` | Praca na dworze w każdą pogodę (blok: Warunki fizyczne) | **do zrobienia** |
| `a5/F19.png` | Stanie albo chodzenie przez większość dnia (blok: Warunki fizyczne) | **do zrobienia** |
| `a5/F20.png` | Siedzenie przy komputerze przez większość dnia (blok: Warunki fizyczne) | **do zrobienia** |
| `a5/F21.png` | Brud, zapachy i nieprzyjemne warunki (blok: Warunki fizyczne) | **do zrobienia** |
| `a5/F34.png` | Agresja słowna albo fizyczna w pracy (blok: Warunki fizyczne) | **do zrobienia** |
| `a5/F33.png` | Praca w pojedynkę, bez zespołu (blok: Warunki fizyczne) | **do zrobienia** |
| `a5/F36.png` | Niepewny, zmienny dochód (blok: Warunki fizyczne) | **do zrobienia** |
| `a5/F37.png` | Prowadzenie własnej działalności (blok: Warunki fizyczne) | **do zrobienia** |
| `a5/F38.png` | Niskie zarobki przez pierwsze lata (blok: Warunki fizyczne) | **do zrobienia** |
| `a5/F22.png` | Codzienny kontakt z krwią i ranami (blok: Ludzie) | **do zrobienia** |
| `a5/F23.png` | Kontakt ze śmiercią i z umieraniem (blok: Ludzie) | **do zrobienia** |
| `a5/F24.png` | Hałas taki, że trzeba nosić ochronniki (blok: Ludzie) | **do zrobienia** |
| `a5/F25.png` | Ciasne przestrzenie, na przykład szachty (blok: Ludzie) | **do zrobienia** |
| `a5/F26.png` | Praca na wysokości, na dachu albo rusztowaniu (blok: Ludzie) | **do zrobienia** |
| `a5/F27.png` | Codzienny kontakt z chemikaliami (blok: Ludzie) | **do zrobienia** |
| `a5/F35.png` | Słyszenie odmowy kilkadziesiąt razy w miesiącu (blok: Ludzie) | **do zrobienia** |
| `a5/F42.png` | Dużo papierów i sprawozdań (blok: Ludzie) | **do zrobienia** |
| `a5/F28.png` | Kontakt z ludźmi przez cały dzień (blok: Pieniądze i ryzyko) | **do zrobienia** |
| `a5/F29.png` | Praca z małymi dziećmi (blok: Pieniądze i ryzyko) | **do zrobienia** |
| `a5/F30.png` | Praca z osobami chorymi albo starszymi (blok: Pieniądze i ryzyko) | **do zrobienia** |
| `a5/F40.png` | Odpowiedzialność za czyjeś zdrowie (blok: Pieniądze i ryzyko) | **do zrobienia** |
| `a5/F31.png` | Obsługa niezadowolonych klientów (blok: Odpowiedzialność) | **do zrobienia** |
| `a5/F32.png` | Częste wystąpienia przed grupą (blok: Odpowiedzialność) | **do zrobienia** |
| `a5/F41.png` | Stała presja czasu i wyniku (blok: Odpowiedzialność) | **do zrobienia** |
| `a5/F43.png` | Poprawianie swojej pracy po raz czwarty (blok: Odpowiedzialność) | **do zrobienia** |

## A2 · W czym mogę być dobry, trzydzieści kompetencji

Najmniej pilne: A2 ma układ wierszy jak A1 i działa bez obrazków. Warto zrobić na końcu, żeby oba moduły z zestawami wyglądały tak samo.

**Ile: 30.**

| Plik | Co ma być na obrazku | Stan |
|---|---|---|
| `a2/1.png` | Rozwiązywanie problemów | **do zrobienia** |
| `a2/2.png` | Analiza informacji | **do zrobienia** |
| `a2/3.png` | Rachunki i szacowanie | **do zrobienia** |
| `a2/4.png` | Myślenie systemowe | **do zrobienia** |
| `a2/5.png` | Praca z regułami i przepisami | **do zrobienia** |
| `a2/6.png` | Szybkie uczenie się nowego | **do zrobienia** |
| `a2/7.png` | Zapamiętywanie i przywoływanie | **do zrobienia** |
| `a2/8.png` | Wymyślanie nowych rozwiązań | **do zrobienia** |
| `a2/9.png` | Wyczucie formy i estetyki | **do zrobienia** |
| `a2/10.png` | Wyobraźnia przestrzenna | **do zrobienia** |
| `a2/11.png` | Wyrażanie się słowem | **do zrobienia** |
| `a2/12.png` | Wyjaśnianie i uczenie innych | **do zrobienia** |
| `a2/13.png` | Wystąpienia przed grupą | **do zrobienia** |
| `a2/14.png` | Przekonywanie | **do zrobienia** |
| `a2/15.png` | Negocjowanie | **do zrobienia** |
| `a2/16.png` | Wyczuwanie ludzi | **do zrobienia** |
| `a2/17.png` | Cierpliwość i opiekuńczość | **do zrobienia** |
| `a2/18.png` | Rozbrajanie napięć | **do zrobienia** |
| `a2/19.png` | Uprzejmość pod presją | **do zrobienia** |
| `a2/20.png` | Prowadzenie grupy | **do zrobienia** |
| `a2/21.png` | Organizowanie i planowanie | **do zrobienia** |
| `a2/22.png` | Dokładność | **do zrobienia** |
| `a2/23.png` | Wytrwałość w powtarzalnym | **do zrobienia** |
| `a2/24.png` | Prowadzenie wielu spraw naraz | **do zrobienia** |
| `a2/25.png` | Samodzielność bez nadzoru | **do zrobienia** |
| `a2/26.png` | Sprawność manualna | **do zrobienia** |
| `a2/27.png` | Obsługa sprzętu i techniki | **do zrobienia** |
| `a2/28.png` | Wytrzymałość fizyczna | **do zrobienia** |
| `a2/29.png` | Opanowanie pod presją | **do zrobienia** |
| `a2/30.png` | Odporność na odmowę i porażkę | **do zrobienia** |
