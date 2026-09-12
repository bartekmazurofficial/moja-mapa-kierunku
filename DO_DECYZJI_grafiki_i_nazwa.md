# Dwie rzeczy do decyzji zamawiającego

Dokument zbiera to, czego nie wolno mi rozstrzygnąć samemu: poprawkę 3 i 14
z przeglądu kodu. Wszystkie pozostałe poprawki są już wdrożone.

---

## 1 · Grafiki przy pozycjach assessmentowych (poprawka 3)

### Co jest dzisiaj

W `public/grafika` leży **37 ilustracji kategorii**, każda w dwóch rozmiarach,
czyli 74 pliki:

| Moduł | Ile ilustracji | Czego dotyczą |
|---|---|---|
| A1 „Co mnie ciągnie" | 24 | 24 obszary zainteresowań |
| A3 „Jak naturalnie działam" | 13 | 13 osi |

Ilustrujemy **kategorię, nie pozycję**: A1 ma 144 pozycje i 24 obszary, więc
24 obrazy obsługują cały moduł. Pozostałe moduły (A0, A2, A4, A5, M1) grafik
nie mają i dostają rysowany znak.

Grafiki pojawiają się w trzech miejscach:

1. **na kaflach zestawu A1** (cztery obrazy na ekranie, po jednym na kafel),
2. **jako pas nad pytaniem w A3** (jeden obraz na ekranie),
3. na ekranach, na których uczestnik niczego nie wybiera.

### Co mówi recenzent

Usunąć z ekranów wyboru. Trzy argumenty: wybór estetyczny zamiast
merytorycznego, spowolnienie decyzji odruchowej, brak miejsca na telefonie.

### Co da się zmierzyć

**Telefon: to prawda.** Ekran zestawu A1 przy szerokości 375 px ma **1395 px
wysokości**, a okno 812 px. Uczestnik musi przewinąć **583 px**, żeby zobaczyć
czwarty kafel. Jeden kafel to 276 px, z czego 124 px to obraz. Bez obrazów
cztery kafle zmieściłyby się na jednym ekranie bez przewijania.

**Czas: rzędu kilku minut.** Przy 36 zestawach A1 każda dodatkowa sekunda
patrzenia na obraz to 36 sekund na moduł, przy czterech obrazach na ekranie
realnie więcej.

**Wpływ na wybór: nie da się zmierzyć bez badania.** To jest hipoteza
recenzenta, prawdopodobna, ale nie sprawdzona na uczestnikach.

### Co jest po drugiej stronie

Grafiki są zamówione i dostarczone, a moduł A1 jest najdłuższym odcinkiem
programu. Ekran z samym tekstem przy 36 powtórzeniach jest surowy i to też ma
swój koszt, tyle że w rezygnacjach, a nie w czasie.

### Trzy warianty

| Wariant | Telefon | Czas | Ryzyko dla pomiaru |
|---|---|---|---|
| **A. Zostawić jak jest** | przewijanie 583 px | bez zmian | obraz może ciągnąć wybór |
| **B. Usunąć z ekranów wyboru** | mieści się bez przewijania | krócej o kilka minut | brak |
| **C. Zostawić w A3, usunąć z A1** | A1 się mieści, A3 i tak ma jeden obraz | krócej o kilka minut | tylko w A3, gdzie na ekranie jest jedna kategoria, nie cztery |

**Wariant C wydaje mi się najlepszy**, bo problem dotyczy zestawu czterech
pozycji z czterech różnych rodzin, a nie pojedynczego pytania. W A3 obraz
ilustruje całą oś, więc nie da się nim wybrać „ładniejszej" strony.

Decyzja jest odwracalna jednym przełącznikiem i nie dotyka danych.

---

## 2 · Nazwa produktu (poprawka 14)

Recenzent zgłosił konflikt dwóch nazw. **Konfliktu nie ma: to są nazwy dwóch
różnych rzeczy** i zamawiający już to rozstrzygnął.

**DreamWork** to nazwa programu i platformy. Siedem miejsc:

| Plik | Co to jest |
|---|---|
| `app/layout.tsx` | tytuł karty przeglądarki |
| `app/page.tsx` (dwa miejsca) | tytuł strony i znak w nagłówku |
| `app/wejscie/page.tsx` | znak nad polem kodu |
| `app/u/[kod]/(pulpit)/layout.tsx` | znak w panelu bocznym uczestnika |
| `app/prowadzacy/page.tsx` | znak w panelu prowadzącego |
| `components/prowadzacy/Logowanie.tsx` | znak nad logowaniem |

**Moja mapa kierunku** to tytuł raportu, czyli dokumentu, który uczestnik
dostaje. Sześć miejsc:

| Plik | Co to jest |
|---|---|
| `app/u/[kod]/(pulpit)/raport/page.tsx` | tytuł karty przeglądarki |
| `app/u/[kod]/(pulpit)/raport/pdf/route.ts` | nazwa pobieranego pliku PDF |
| `components/raport/Raport.tsx` (dwa miejsca) | komentarz i nagłówek raportu |
| `lib/raport/pdf.tsx` (dwa miejsca) | metadane i nagłówek PDF |

Adres testowy `moja-mapa-kierunku.vercel.app` pochodzi z nazwy repozytorium,
nie z nazwy produktu, i da się zmienić osobno.

**Nic tu nie wymaga zmiany**, chyba że zamawiający zdecyduje, że raport ma się
nazywać inaczej. Wtedy to jest sześć miejsc i jeden ruch.

---

## 3 · Jeszcze jedna rzecz, którą warto potwierdzić

Kolor kategorii zszedł z ekranów wyboru (poprawka 2). To **odwraca wcześniejszą
prośbę** o kolorowe bloki przy odpowiedziach. Powód jest w
`lib/ui/kolory.ts`: kolor jest przypisany kategorii na stałe, więc przy 36
zestawach da się nauczyć, że zielony to jedna rodzina zawodów, a to jest
informacja, której uczestnik nie powinien mieć w trakcie wypełniania.

Ekrany wyboru są dalej kolorowe, ale kolorem akcentu, jednym dla wszystkich
siedmiu modułów. Powrót do kolorów kategorii to zmiana jednej stałej
`KOLOR_KATEGORII_NA_WYBORZE` z `false` na `true`.
