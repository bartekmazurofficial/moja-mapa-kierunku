# WARSTWA TRZECIA: KIERUNKI STUDIÓW

## Specyfikacja dopasowania i baza kierunków

Program warsztatów rozwojowo-zawodowych 16–24 | Fundacja Służąc Życiu

**Status:** kierunki były dotąd traktowane jako lista dopięta do zawodu. To za mało dla programu, w którym większość uczestników stoi przed wyborem kierunku, a nie przed wyborem zawodu.

---

# 1. DLACZEGO KIERUNKI POTRZEBUJĄ OSOBNEJ WARSTWY

## Cztery różnice, których poprzedni układ nie obsługiwał

**Kierunek to nie zawód i model programu mówi to wprost.** Jedna ścieżka zawodowa ma kilka dróg dojścia, jeden kierunek prowadzi do kilkunastu zawodów. Traktowanie kierunku jako etykiety przy zawodzie gubi całą tę strukturę.

**Rekrutacja jest twardym warunkiem, którego zawód nie ma.** Do zawodu elektryka wchodzi się zawsze. Na medycynę nie, jeśli nie ma się biologii i chemii rozszerzonej oraz bardzo wysokiego wyniku. **Po wprowadzeniu modułu A0 system po raz pierwszy ma dane, żeby to sprawdzić.**

**Znaczna część absolwentów nie pracuje w zawodzie kierunku** i uczestnik ma prawo o tym wiedzieć przed wyborem. To jest informacja, której nie poda żaden informator uczelniany.

**Pytanie „czy studia są w ogóle konieczne" jest w modelu programu jednym z pytań, na które uczestnik ma dostać odpowiedź.** Bez osobnej warstwy nie da się jej wygenerować.

---

# 2. ARCHITEKTURA TRZECH WARSTW

```
SIEDEM MODUŁÓW  →  WARSTWA 1  →  WARSTWA 2  →  WARSTWA 3  →  RAPORT
A0 A1 A2 A3        obszary       zawody       kierunki      trzy drogi
A4 A5 M1            (27)         (152)         (68)        + wszystko
```

**Warstwa trzecia jest pochodna wobec drugiej.** Kierunek nie jest oceniany bezpośrednio profilem uczestnika. **Jest oceniany przez to, do których zawodów prowadzi i jak wysoko te zawody wypadły.**

To jest właściwa logika: uczestnik nie ma dopasowania do „zarządzania" jako takiego. Ma dopasowanie do zawodów, do których zarządzanie prowadzi.

---

# 3. STRUKTURA WPISU KIERUNKU

Każdy z 68 kierunków ma czternaście pól.

| Pole | Zawartość |
|---|---|
| **nazwa** | jak w rekrutacji |
| **typ** | uniwersytecki · techniczny · medyczny · artystyczny · praktyczny |
| **poziom** | jednolite magisterskie · licencjat plus magister · inżynier plus magister |
| **czas** | lata do dyplomu uprawniającego do pracy |
| **przedmioty wymagane** | bez których nie ma rekrutacji |
| **przedmioty punktowane** | podnoszące wynik rekrutacyjny |
| **trudność rekrutacji** | bardzo wysoka · wysoka · średnia · niska · przyjmują wszystkich |
| **zawody bezpośrednie** | do których kierunek prowadzi wprost, z kodami |
| **zawody pośrednie** | do których otwiera drogę, ale nie jest warunkiem |
| **czy zamyka drogę bez studiów** | czy do tych zawodów da się dojść inaczej |
| **odsetek w zawodzie** | jaka część absolwentów pracuje w zawodzie kierunku |
| **gdzie studiować** | wszędzie · duże miasta · kilka ośrodków · jeden lub dwa |
| **co się realnie robi** | dwa, trzy zdania o treści studiów, nie o sylwetce absolwenta |
| **czego nie daje** | najczęstsze rozczarowanie |

## Dwa pola, których nie ma w żadnym informatorze

**„Odsetek w zawodzie".** Dla części kierunków wynosi ponad osiemdziesiąt procent, dla części poniżej dwudziestu. Uczestnik wybierający psychologię, filologię albo dziennikarstwo ma prawo wiedzieć, że większość absolwentów pracuje gdzie indziej. **To nie jest argument przeciwko kierunkowi, tylko informacja o tym, czym on realnie jest.**

**„Czego nie daje".** Najczęstsze rozczarowanie, wyprowadzone z kart zawodów. Przykłady:

| Kierunek | Czego nie daje |
|---|---|
| Psychologia | **Uprawnień do prowadzenia terapii.** To dodatkowe cztery lata i kilkadziesiąt tysięcy złotych |
| Architektura | Uprawnień projektowych. To dodatkowe dwa do trzech lat praktyki i egzamin |
| Prawo | Możliwości wykonywania zawodu. To aplikacja, kolejne trzy do czterech lat |
| Dziennikarstwo | Przewagi na rynku. Redakcje częściej zatrudniają specjalistów z dziedziny, o której piszą |
| Zarządzanie | Konkretnego zawodu. Otwiera wiele drzwi, żadnych na oścież |
| Fizjoterapia | Poziomu, który decyduje o zarobkach. Ten dają płatne kursy po dyplomie |

**To pole jest w tej bazie najcenniejsze** i nie istnieje nigdzie indziej w takiej formie.

---

# 4. SILNIK WARSTWY TRZECIEJ

```
ETAP K1   WYNIK POCHODNY      z zawodów, do których prowadzi
ETAP K2   FILTR REKRUTACYJNY  przedmioty z A0
ETAP K3   MNOŻNIK DOSTĘPU     trudność rekrutacji a profil
ETAP K4   FILTR GEOGRAFICZNY  gdzie studiować a mobilność
ETAP K5   PYTANIE O SENS      czy studia są konieczne
ETAP K6   OSTRZEŻENIA         odsetek w zawodzie, czego nie daje
```

## Etap K1: wynik pochodny

```
wynik_kierunku = (Σ wynik_zawodu × 1,0 dla zawodów bezpośrednich
                + Σ wynik_zawodu × 0,4 dla zawodów pośrednich)
                / liczba_zawodów_ważona
```

**Waga 0,4 dla zawodów pośrednich jest celowo niska.** Kierunek, który „otwiera wiele dróg", nie ma z tego powodu wygrywać z kierunkiem prowadzącym wprost do dwóch zawodów, które uczestnikowi bardzo pasują. **Szerokość nie jest zaletą, gdy uczestnik ma wyraźny profil.**

## Etap K2: filtr rekrutacyjny

| Sytuacja | Działanie |
|---|---|
| Brak wymaganego przedmiotu, etap przedmaturalny | **Ostrzeżenie, nie usunięcie.** „Ten kierunek wymaga X, którego nie masz w planach. Jeszcze można to zmienić" |
| Brak wymaganego przedmiotu, po maturze | **Usunięcie**, z komunikatem o powodzie i alternatywach |
| Przedmiot wymagany wskazany jako trudny | Obniżenie o 25%, ostrzeżenie |
| Matematyka „największy problem", kierunek ścisły | Obniżenie o 35%, ostrzeżenie z listą dróg alternatywnych |
| Przedmiot wymagany wskazany jako mocny | Podniesienie do 15% |

**Rozróżnienie między etapem przedmaturalnym a późniejszym jest kluczowe.** Dla szesnastolatka brak przedmiotu to informacja do wykorzystania. Dla dwudziestolatka po maturze to fakt.

## Etap K3: mnożnik dostępu

Trudność rekrutacji zestawiona z sytuacją uczestnika.

| Trudność | Mnożnik przy mocnych przedmiotach | Przy trudnych |
|---|---|---|
| Bardzo wysoka, medycyna, weterynaria, psychologia | 1,00 | 0,60 |
| Wysoka | 1,00 | 0,75 |
| Średnia | 1,00 | 0,90 |
| Niska | 1,00 | 1,00 |

**Nie karzemy nikogo za ambicję.** Uczestnik z mocnymi przedmiotami widzi medycynę bez obniżenia, nawet jeśli progi są wysokie. Obniżamy tylko wtedy, gdy przedmioty wymagane są jednocześnie wskazane jako trudne, a to jest fakt, nie przypuszczenie.

## Etap K4: filtr geograficzny

| Sytuacja | Działanie |
|---|---|
| Kierunek dostępny w jednym lub dwóch ośrodkach, mobilność „nie" | Usunięcie z komunikatem |
| Kierunek tylko w dużych miastach, mobilność „wolałbym nie" | Obniżenie o 15%, ostrzeżenie |
| Kierunek dostępny wszędzie | Bez zmian |

## Etap K5: pytanie o sens studiów

**To jest osobne wyjście silnika, nie ranking.** Model programu wymaga odpowiedzi na pytanie „czy studia w ogóle są konieczne w mojej drodze".

```
udział_zawodów_wymagających_studiów = 
    liczba zawodów w TOP15 z pola studia = "tak" / 15
```

| Udział | Komunikat w raporcie |
|---|---|
| powyżej 0,7 | **„W Twoim przypadku studia są warunkiem."** Większość dróg, które do Ciebie pasują, jest zamknięta bez dyplomu |
| 0,4 do 0,7 | **„Studia otwierają część Twoich dróg, ale nie wszystkie."** Masz realny wybór i warto go zrobić świadomie |
| 0,15 do 0,4 | **„Studia są w Twoim przypadku jedną z opcji, nie regułą."** Większość dróg, które do Ciebie pasują, prowadzi inaczej |
| poniżej 0,15 | **„W Twoim przypadku studia prawdopodobnie nie są potrzebne."** Twoje drogi prowadzą przez szkołę branżową, kursy i praktykę |

**Ostatni komunikat jest najtrudniejszy do napisania i najważniejszy.** Musi być postawiony jako informacja, nie jako pocieszenie. Wersja robocza:

> „Większość dróg, które do Ciebie pasują, nie wymaga studiów. To nie jest gorsza wiadomość, tylko inna. Elektryk z własną działalnością po sześciu latach zarabia zwykle więcej niż absolwent studiów humanistycznych po sześciu latach pracy. **Studia zawsze możesz zrobić później i wielu ludzi tak robi. Odwrotnej kolejności nie da się nadrobić tak łatwo.**"

## Etap K6: ostrzeżenia

Dopinane do kierunku, nie zmieniające pozycji.

| Warunek | Ostrzeżenie |
|---|---|
| Odsetek w zawodzie poniżej 40% | „Mniej niż X% absolwentów tego kierunku pracuje w zawodzie. To nie znaczy, że studia są bezwartościowe, ale warto wiedzieć, po co się na nie idzie" |
| Pole „czego nie daje" niepuste | Treść pola, dosłownie |
| Kierunek prowadzi do zawodu z flagą zagrożenia | „Zawody, do których ten kierunek prowadzi wprost, zmieniają się szybko. Sprawdź sekcje o przyszłości w kartach" |
| Istnieje droga bez studiów do tych samych zawodów | „Do tych zawodów prowadzi też droga krótsza. Zobacz X" |

---

# 5. BAZA KIERUNKÓW, STRUKTURA

**68 kierunków w ośmiu grupach**, odpowiadających grupom obszarów zawodowych.

| Grupa | Kierunki | Przykłady |
|---|---|---|
| Biznes i zarządzanie | 8 | zarządzanie, ekonomia, marketing, logistyka, finanse i rachunkowość |
| Liczby i analiza | 7 | matematyka, informatyka i ekonometria, analityka danych, statystyka |
| Prawo i administracja | 5 | prawo, administracja, bezpieczeństwo wewnętrzne, kryminologia |
| Technologia i nauka | 13 | informatyka, automatyka, mechanika, elektrotechnika, biotechnologia, fizyka, chemia |
| Ręce, teren i przyroda | 10 | budownictwo, architektura, geodezja, rolnictwo, leśnictwo, weterynaria, technologia żywności |
| Zdrowie | 9 | lekarski, pielęgniarstwo, położnictwo, fizjoterapia, farmacja, analityka medyczna, dietetyka |
| Ludzie i edukacja | 9 | psychologia, pedagogika, pedagogika specjalna, praca socjalna, socjologia, filologie |
| Tworzenie i media | 7 | grafika, wzornictwo, architektura wnętrz, dziennikarstwo, reżyseria, muzyka, aktorstwo |

**Poza kierunkami: druga lista, równorzędna.**

Model programu wymaga pokazania **alternatywnych dróg edukacyjnych**, nie tylko studiów. Ta lista ma dwadzieścia pozycji i jest prezentowana obok kierunków, nie pod nimi.

| Typ | Przykłady |
|---|---|
| Szkoła branżowa | elektryk, mechanik, fryzjer, stolarz, kucharz, ślusarz |
| Technikum | informatyk, elektronik, mechanik, budowlaniec, ekonomista, weterynarii |
| Szkoła policealna | technik farmaceutyczny, opiekun medyczny, technik BHP, kosmetolog, technik weterynarii |
| Kursy z uprawnieniami | spawacz, operator CNC, instalator OZE, uprawnienia SEP, F-gazowe, kurs na prawo jazdy C |
| Kwalifikacyjne kursy zawodowe | pojedyncze kwalifikacje bez pełnej szkoły |
| Studia podyplomowe | przygotowanie pedagogiczne, doradztwo zawodowe, kosztorysowanie |

**Zasada prezentacji:** jeśli udział zawodów wymagających studiów jest poniżej 0,4, **lista alternatywna jest wyświetlana pierwsza**, przed kierunkami. Kolejność w raporcie odzwierciedla to, co dla uczestnika realne, a nie hierarchię prestiżu.

---

# 6. SEKCJA W RAPORCIE

```
MOJE KIERUNKI I DROGI EDUKACYJNE

CZY STUDIA SĄ W TWOIM PRZYPADKU POTRZEBNE
[komunikat z etapu K5, dwa do czterech zdań]

────────────────────────────────────────

[jeśli studia sensowne: NAJBARDZIEJ LOGICZNE KIERUNKI]

1. NAZWA KIERUNKU                        bardzo mocne dopasowanie
   Prowadzi do:        [zawody z Twojej listy]
   Rekrutacja:         [przedmioty, trudność]
   Twoja sytuacja:     [masz / nie masz wymaganych przedmiotów]
   Co się tam robi:    [dwa zdania o treści studiów]
   Czego nie daje:     [jeśli jest]
   ⚠ [ostrzeżenia, jeśli są]

────────────────────────────────────────

DROGI BEZ STUDIÓW PROWADZĄCE DO TYCH SAMYCH ZAWODÓW
[lista alternatywna, zawsze pokazywana, niezależnie od wyniku]

────────────────────────────────────────

KIERUNEK TO NIE ZAWÓD
[stałe wyjaśnienie, dwa zdania, w każdym raporcie]
```

**Ostatni blok jest stały i obowiązkowy**, bo model programu wymienia to jako rzecz do wyjaśnienia:

> „Kierunek studiów nie jest tym samym co zawód. Jedna ścieżka zawodowa ma zwykle kilka dróg dojścia, a jeden kierunek prowadzi do kilkunastu różnych zawodów. **Wybierając kierunek, nie wybierasz zawodu. Wybierasz zestaw drzwi, które będziesz mógł otworzyć.**"

---

# 7. MODEL DANYCH

```
kierunki
├── kod, nazwa, typ, poziom, czas
├── przedmioty_wymagane      lista
├── przedmioty_punktowane    lista
├── trudnosc_rekrutacji      enum, 5 wartości
├── zawody_bezposrednie      lista kodów zawodów
├── zawody_posrednie         lista kodów zawodów
├── zamyka_droge_bez_studiow bool
├── odsetek_w_zawodzie       liczba lub null
├── gdzie_studiowac          enum, 4 wartości
├── co_sie_robi              tekst
└── czego_nie_daje           tekst lub null

drogi_alternatywne
├── kod, nazwa, typ
├── czas, koszt
├── zawody_docelowe          lista kodów zawodów
└── wymagania                tekst
```

---

# 8. TESTY

| Test | Warunek |
|---|---|
| K-1 | Kierunek nigdy nie wychodzi wyżej niż najlepszy zawód, do którego prowadzi |
| K-2 | Brak wymaganego przedmiotu po maturze usuwa kierunek, przed maturą tylko ostrzega |
| K-3 | Uczestnik z profilem rzemieślniczym dostaje komunikat, że studia nie są konieczne |
| K-4 | Uczestnik z profilem medycznym dostaje komunikat, że studia są warunkiem |
| K-5 | Lista dróg bez studiów pojawia się w **każdym** raporcie, niezależnie od profilu |
| K-6 | Kierunek o odsetku w zawodzie poniżej 40% zawsze ma ostrzeżenie |
| K-7 | Blok „kierunek to nie zawód" jest w każdym raporcie |
| K-8 | Kierunek szeroki nie wygrywa z wąskim, gdy profil uczestnika jest wyraźny |

**Test K-5 jest zasadą, nie techniką.** Program dla osób 16–24 w Polsce, który pokazuje drogi bez studiów tylko tym, którzy nie rokują na studia, powielałby dokładnie to, co model programu ma naprawiać.

---

# 9. CO ZOSTAJE DO ZROBIENIA W TEJ WARSTWIE

| Zadanie | Uwagi |
|---|---|
| Opisanie 68 kierunków według struktury z rozdziału 3 | czternaście pól, w tym dwa nieistniejące gdzie indziej |
| Zebranie danych o odsetku pracujących w zawodzie | źródło: ogólnopolski system monitorowania losów absolwentów |
| Napisanie pola „czego nie daje" dla wszystkich kierunków | wyprowadzone z kart zawodów, najcenniejsza część |
| Opisanie 20 dróg alternatywnych | krótsze wpisy, pięć pól |
| Sprawdzenie kompletności powiązań | każdy ze 152 zawodów musi mieć co najmniej jedną drogę dojścia |

**Ostatni punkt jest testem, który trzeba uruchomić:** zawód bez żadnej drogi edukacyjnej to błąd w bazie, a nie zawód niedostępny.
