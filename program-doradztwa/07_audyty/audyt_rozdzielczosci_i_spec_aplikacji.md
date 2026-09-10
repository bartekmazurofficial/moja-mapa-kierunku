# CZY KAŻDY ZAWÓD WYJDZIE

## Audyt rozdzielczości systemu i pełna specyfikacja pod aplikację

Program warsztatów rozwojowo-zawodowych 16–24 | Fundacja Służąc Życiu

**Metoda:** symulacja 6000 profili uczestników na pełnej bazie 157 zawodów, plus test profili idealnych. Kod: `audyt_osiagalnosci.py`.

---

# CZĘŚĆ I: ODPOWIEDŹ NA PYTANIE

## 1. Krótka odpowiedź

**Tak, każdy zawód może wyjść. Nie, nie każdy zawód da się odróżnić od sąsiada.**

To są dwie różne rzeczy i trzeba je rozdzielić, bo pierwsza jest w porządku, a druga wymaga zmiany w projekcie.

## 2. Co pokazał audyt

| Sprawdzenie | Wynik |
|---|---|
| Zawodów osiągalnych przy losowych profilach | **157 na 157** |
| Zawodów, które nigdy nie wyszły | **0** |
| Zawodów z zerową częstością w 6000 symulacji | **0** |
| Rozrzut częstości | od 3,2% do 10,4%, bez dominacji |
| Różnorodność wyników TOP3 | **0,811**, czyli 4864 różne trójki na 6000 profili |

**Nie ma zawodów-sierot.** Żaden zawód nie jest strukturalnie wykluczony, żaden nie jest martwym wpisem w bazie. Nie ma też zawodu, który wychodzi wszystkim, co byłoby oznaką zepsutej mechaniki.

To jest dobra wiadomość i większa, niż się wydaje. Przy 157 pozycjach łatwo o wpis, do którego nie prowadzi żadna kombinacja odpowiedzi.

## 3. Co audyt wykrył jako wadę

**Sześć par zawodów ma w assessmentach dokładnie tę samą sygnaturę:**

| Para | Obszar |
|---|---|
| specjalista marketingu — copywriter | 2 |
| przedstawiciel handlowy — agent nieruchomości | 3 |
| analityk danych — data scientist | 6 |
| stolarz — krawiec | 13 |
| mechanik samochodowy — technik serwisu | 13 |
| **pielęgniarka — położna** | 16 |

Dla systemu są to te same zawody. Nie dlatego, że kodowanie jest niechlujne, tylko dlatego, że **assessment mierzy zainteresowania, kompetencje i styl, a te dwa zawody mają je identyczne.** Różnią się w rzeczach, których żaden kwestionariusz nie zmierzy: treścią dnia, odpowiedzialnością, drogą dojścia.

**Dwadzieścia osiem par jest prawie nierozróżnialnych**, z różnicą jednego albo dwóch kodów. Elektryk i hydraulik. Radca prawny i prawnik wewnętrzny. Psycholog i psychoterapeuta. Szef kuchni i menedżer restauracji.

**Trzynaście zawodów nigdy nie wygrywa własnego profilu idealnego**, bo są przesłonięte przez sąsiada. Położna zawsze przegrywa z pielęgniarką. Data scientist zawsze przegrywa z analitykiem danych. Recepcjonista z office managerem. **To znaczy, że dla tych trzynastu zawodów nie istnieje żaden zestaw odpowiedzi, przy którym system wskazałby je jako najlepsze dopasowanie.**

## 4. Realna rozdzielczość systemu

Po zgrupowaniu zawodów nierozróżnialnych:

```
157 zawodów w bazie
    ↓
133 pozycje rozróżnialne przez assessment
    ├── 113 zawodów rozróżnialnych samodzielnie   (72%)
    └──  20 klastrów po 2 do 4 zawodów            (44 zawody, 28%)
```

**To jest twarda granica tego, co assessment potrafi.** Nie da się jej przesunąć dodaniem pytań, bo problem nie leży w liczbie pytań, tylko w tym, że mierzone wymiary są dla tych zawodów identyczne.

## 5. Dlaczego to nie jest katastrofa

**Bo assessment nigdy nie miał rozstrzygać między pielęgniarką a położną.** Miał doprowadzić uczestnika do miejsca, w którym takie pytanie w ogóle się pojawia.

Szesnastolatek nie zaczyna od pytania „pielęgniarka czy położna". Zaczyna od pytania „czy w ogóle idę w stronę ludzi i zdrowia". Na to system odpowiada bardzo dobrze. Na to drugie odpowiada **karta zawodu**, a rozstrzyga **sesja indywidualna**.

I tu jest rzecz istotna: **karty różnią te zawody radykalnie**, choć assessment ich nie różni.

| | Pielęgniarka | Położna |
|---|---|---|
| Odpowiedzialność | za pacjenta | **za dwoje jednocześnie** |
| Samodzielność | w ramach zlecenia | **samodzielne prowadzenie porodu** |
| Najcięższy moment | śmierć pacjenta | **poród zakończony śmiercią dziecka** |
| Nieprzewidywalność | 4 | **5** |
| Zagrożenie zawodu | zerowe | zerowe, ale **ryzyko geograficzne** |

Uczestnik, który przeczyta obie karty, wybierze świadomie. Uczestnik, któremu system arbitralnie wskaże jedną z nich, wybierze przypadkowo. **Druga sytuacja jest gorsza, mimo że wygląda na precyzyjniejszą.**

---

# CZĘŚĆ II: POPRAWKA W PROJEKCIE

## 6. Klastry zamiast udawanej precyzji

Wprowadzam do warstwy drugiej **klaster zawodowy** jako jednostkę wyniku tam, gdzie assessment nie rozróżnia.

**Jak to wygląda w raporcie.** Zamiast:

> 1. Pielęgniarka — bardzo mocne dopasowanie
> 2. Położna — bardzo mocne dopasowanie

uczestnik czyta:

> **Opieka pielęgniarska i położnictwo** — bardzo mocne dopasowanie
>
> To są dwa zawody o tej samej drodze wejścia i bardzo podobnym profilu. Twoje odpowiedzi nie rozstrzygają między nimi, bo różnią się rzeczami, których nie da się zmierzyć kwestionariuszem. **Przeczytaj obie karty. Różnią się mocniej, niż sugeruje nazwa.**
>
> Pytanie rozstrzygające: czy chcesz odpowiadać za jedną osobę, czy za dwie naraz.

**Do każdego klastra dopisujemy jedno pytanie rozstrzygające**, wyprowadzone z kart. To jest najbardziej użyteczna rzecz, jaką system może w tym miejscu zrobić.

| Klaster | Pytanie rozstrzygające |
|---|---|
| Elektryk, hydraulik, mechanik, technik serwisu | Wolisz pracować z prądem, z wodą, z pojazdem czy z urządzeniem? Wszystkie cztery to ta sama logika diagnozy |
| Księgowy, główny księgowy, specjalista płac | Wolisz odpowiadać za całość, za rozliczenia firmy czy za wynagrodzenia ludzi? |
| Pielęgniarka, położna | Odpowiedzialność za jedną osobę czy za dwie naraz? |
| Psycholog, psychoterapeuta | Diagnoza i ocena, czy prowadzenie kogoś przez lata? Druga droga to dodatkowe cztery lata i kilkadziesiąt tysięcy złotych |
| Analityk danych, data scientist | Odpowiadanie na pytania czy budowanie modeli? Druga droga wymaga matematyki na poziomie studiów ścisłych |
| Radca prawny, prawnik wewnętrzny | Wielu klientów i rozliczenie z godzin, czy jedna firma i etat? |
| Stolarz, krawiec | Drewno czy tkanina? Poza materiałem to bardzo podobna praca |
| Policjant, żołnierz | Praca w społeczeństwie czy w strukturze zamkniętej? |
| Szef kuchni, menedżer restauracji | Odpowiadasz za kuchnię czy za cały lokal? |
| Fizjoterapeuta, masażysta | Pięć lat studiów i pełne uprawnienia, czy rok kursu i szybsze wejście? |

**Dwadzieścia klastrów, dwadzieścia pytań.** To jest kilka godzin pracy i realnie podnosi jakość wyniku.

## 7. Naprawa trzynastu zawodów przesłoniętych

Trzynaście zawodów nigdy nie wygrywa własnego profilu. Część z nich trafia do klastrów i problem znika. Reszta wymaga **dodania kodu różnicującego** przy kodowaniu kart.

| Zawód | Przesłonięty przez | Kod do dodania |
|---|---|---|
| Specjalista BI | SEO | `estetyka` (projektowanie pulpitów) |
| Notariusz | Urzędnik | `uprzejmosc`, `pieniadze` |
| Inżynier jakości | Tester | `sprzet`, `przestrzenna` |
| Specjalista ochrony środowiska | Specjalista zgodności | `przyroda` jako A1 dominujące |
| Opiekun osoby starszej | Opiekun medyczny | `samodzielnosc` (praca bez zespołu) |
| Katecheta | Nauczyciel | `wspolnota` jako A1 dominujące |
| Recepcjonista | Office manager | `rozmowa` jako A1 dominujące |

**Zasada przy kodowaniu:** zawód musi wygrywać własny profil idealny. Jeśli nie wygrywa, kodowanie jest niepełne albo zawód należy do klastra. Trzeciej możliwości nie ma i to jest test, który trzeba uruchomić po zakodowaniu wszystkich 152 kart.

## 8. Czego assessment nie zmierzy i nigdy nie zmierzy

Warto to powiedzieć wprost, bo chroni przed budowaniem funkcji, które nie zadziałają.

**Nie zmierzy odporności psychicznej na konkretne obciążenie.** Czy udźwigniesz eutanazję, śmierć dziecka na porodówce, hejt w sieci, odmowę pięćdziesiąt razy w miesiącu. Kwestionariusz zbierze deklarację, a deklaracja siedemnastolatka o tym, jak zniesie coś, czego nigdy nie doświadczył, jest bezwartościowa.

**To robi karta plus rozmowa, a najlepiej wolontariat.**

**Nie zmierzy talentu manualnego, wyobraźni przestrzennej ani słuchu** na poziomie, który cokolwiek rozstrzyga. Zbierze samoocenę, a ta jest zawodna w obie strony.

**Nie zmierzy, czy uczestnika stać na drogę.** Dodaliśmy pytanie o wykonalność finansową i to jest maksimum, jakie da się zrobić bez upokarzania.

**Nie zmierzy, czy uczestnik wytrzyma pierwszy rok.** W gastronomii, w sprzedaży i w obsłudze klienta rotacja pierwszoroczna jest bardzo wysoka i żaden test tego nie przewidzi.

**Wniosek projektowy: system ma zawężać pole z 157 do kilkunastu, nie z 157 do jednego.** Ostatni krok należy do człowieka.

---

# CZĘŚĆ III: SPECYFIKACJA POD APLIKACJĘ

## 9. Co jest gotowe, a czego nie ma

| Element | Stan | Uwagi |
|---|---|---|
| Sześć modułów assessmentowych | **gotowe** | A1–A5, M1, pełne treści pozycji |
| Baza 27 obszarów | **gotowe** | z poziomami wejścia i macierzą sąsiedztwa |
| 152 karty zawodów | **gotowe** | 22 pola każda |
| Silnik obszarowy, warstwa 1 | **gotowe** | spec + kod + przebieg na sucho |
| Silnik zawodowy, warstwa 2 | **gotowe** | spec + prototyp + testy |
| Audyt rozdzielczości | **gotowe** | ten dokument |
| Struktura raportu | **gotowe** | 20 sekcji w 5 warstwach |
| **Kodowanie 152 kart do postaci danych** | **brak** | 5 do 6 godzin |
| **20 pytań rozstrzygających do klastrów** | **brak** | 3 godziny |
| **Pytanie o zasoby w A5** | **brak** | 15 minut |
| **Scenariusze 4 spotkań i sesji 1:1** | **brak** | największa pozostała praca merytoryczna |
| **Panel prowadzącego** | **brak** | wymaga scenariuszy |
| Aplikacja | **brak** | świadomie, po pilotażu |

## 10. Model danych aplikacji

Sześć tabel. Nic więcej nie jest potrzebne.

**`zawody`** — 152 wiersze, 15 pól z tabeli kodowania: obszar, poziom wejścia, studia, A1 wysoko, A2 rdzeń, A2 wspierające, A3, A4, A5 gotowość, M1, antyprofil, koszt wejścia, flaga trampoliny, zagrożenie, zdanie kierunkowe, klaster.

**`obszary`** — 27 wierszy: nazwa, grupa, poziomy wejścia, sąsiedztwo, opis dla uczestnika.

**`karty`** — 152 wiersze: pełna treść karty jako tekst, wersja maksymalna albo skrócona.

**`klastry`** — 20 wierszy: skład, nazwa zbiorcza, pytanie rozstrzygające.

**`uczestnicy`** — odpowiedzi z sześciu modułów, znacznik czasu, zgoda opiekuna.

**`wyniki`** — wynik silnika dla uczestnika: obszary z punktacją, zawody z pasmami i flagami, trzy drogi, uzasadnienia, ostrzeżenia antyprofilowe.

## 11. Ekrany aplikacji

**Dla uczestnika, siedem ekranów:**

1. **Moduł assessmentowy** — jeden komponent obsługujący wszystkie sześć: bloki wyboru, pary, rankingi 1–4, skale TAK/MOŻE/NIE, pola tekstowe. Blokada przewijania do przodu, zapis odpowiedzi na bieżąco.
2. **Moja wizja życia** — jedyny moduł z pisaniem własnymi słowami, siedem obszarów.
3. **Mój profil** — odblokowywany warstwami zgodnie z harmonogramem odsłaniania.
4. **Moje obszary** — od spotkania trzeciego.
5. **Moje zawody i trzy drogi** — od spotkania czwartego, z klastrami i flagami.
6. **Karta zawodu** — pełny widok, dostępny dla zawodów z Drogi A i B.
7. **Moja mapa kierunku** — raport końcowy, eksport do PDF.

**Dla prowadzącego, cztery ekrany:**

8. **Grupa** — kto wypełnił, kto utknął, kto ma braki w danych.
9. **Uczestnik** — pełny profil, wyniki silnika, wszystkie flagi i ostrzeżenia w jednym miejscu.
10. **Panel sesji 1:1** — profil, trzy drogi, sprzeczności do omówienia, ostrzeżenia antyprofilowe, proponowany przebieg 60 minut.
11. **Korekta ręczna** — możliwość dopisania zawodu spoza wyniku i oznaczenia go jako „wskazany przez prowadzącego". **To jest funkcja obowiązkowa, nie opcjonalna.** Prowadzący widzi rzeczy, których silnik nie widzi.

## 12. Kolejność budowy

**Etap 1, przed pilotażem, bez aplikacji.** Kodowanie kart, pytania klastrowe, pytanie o zasoby, scenariusze spotkań. Silnik liczony w arkuszu kalkulacyjnym. Assessmenty w formularzach. Raport składany ręcznie.

*Powód:* pilotaż na dwunastu osobach ma sprawdzić, **czy wyniki są trafne**, a nie czy aplikacja działa. Odpowiedzi na to pytanie nie da się kupić kodem.

**Etap 2, po pilotażu, minimalna aplikacja.** Moduły assessmentowe, silnik, raport, panel prowadzącego. Bez kont, bez płatności, bez logowania społecznościowego. Jedna grupa, jeden prowadzący, dane w jednej bazie.

**Etap 3, po drugiej edycji.** Wielu prowadzących, wiele grup, historia, eksport, statystyki dla fundacji.

**Czego nie budować nigdy:** automatycznej rekomendacji bez sesji 1:1, chatbota doradczego, porównania z innymi uczestnikami, punktacji widocznej dla uczestnika.

## 13. Testy przed uruchomieniem aplikacji

Do już istniejących T1–T6 dochodzą wynikające z audytu:

| Test | Warunek |
|---|---|
| T11 | Każdy ze 152 zawodów jest osiągalny przy jakimś profilu |
| T12 | Każdy zawód wygrywa własny profil idealny albo należy do klastra |
| T13 | Żaden zawód nie wychodzi w więcej niż 15% profili |
| T14 | Różnorodność TOP3 powyżej 0,7 |
| T15 | Każdy klaster ma pytanie rozstrzygające |
| T16 | Dwa różne profile nie dostają identycznej listy |

**T11 do T14 są już zaimplementowane w `audyt_osiagalnosci.py`** i mają przechodzić po każdej zmianie w kodowaniu kart. To jest regresja, nie jednorazowe sprawdzenie.

## 14. Co zostało do zrobienia, uporządkowane

**Praca merytoryczna, konieczna przed pilotażem:**

| Zadanie | Nakład |
|---|---|
| Kodowanie 152 kart do postaci danych | 5–6 h |
| 20 pytań rozstrzygających do klastrów | 3 h |
| Dodanie kodów różnicujących do 7 zawodów przesłoniętych | 1 h |
| Pytanie o zasoby finansowe w A5 | 15 min |
| **Scenariusze 4 spotkań** | **największa pozostała pozycja** |
| **Scenariusz sesji 1:1 z panelem prowadzącego** | duża pozycja |
| Ponowne uruchomienie audytu po kodowaniu | 10 min |

**Poza dokumentami:**

Zgody opiekunów dla uczestników niepełnoletnich · informacja o przetwarzaniu danych · komunikat o charakterze programu · wybór i przygotowanie prowadzącego · rekrutacja grupy pilotażowej · kwestionariusz „przed i po".

---

# 15. WERDYKT

**System jest w stanie wskazać każdy zawód z bazy i to zostało zmierzone, a nie założone.**

**System nie jest w stanie odróżnić 44 zawodów od ich najbliższych sąsiadów i to też zostało zmierzone.** Nie jest to wada do naprawienia, tylko granica metody. Poprawka polega na tym, żeby jej nie ukrywać: dwadzieścia klastrów, dwadzieścia pytań rozstrzygających, karta jako narzędzie wyboru i sesja indywidualna jako miejsce decyzji.

**Realna rozdzielczość to 133 pozycje.** Dla szesnastolatka, który przyszedł z pytaniem „co ja mam ze sobą zrobić", jest to o dwa rzędy wielkości więcej niż to, z czym przyszedł.

**Do pilotażu brakuje jednego dnia pracy technicznej i scenariuszy spotkań.** Aplikacja jest po pilotażu, nie przed, i to jest decyzja, przy której warto zostać.
