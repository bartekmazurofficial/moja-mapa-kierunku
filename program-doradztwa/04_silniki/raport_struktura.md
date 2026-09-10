# RAPORT: MOJA MAPA KIERUNKU

## Specyfikacja — wersja 1.0

Program warsztatów rozwojowo-zawodowych 16–24 | Fundacja Służąc Życiu

Dokument opisuje jedyny artefakt, który uczestnik zabiera ze sobą po programie. Zawiera architekturę warstwową, treść wszystkich sekcji, zasady języka, reguły blokowania, eksport do PDF, przypadki brzegowe i testy.

---

# 1. CZYM TEN RAPORT JEST

**To nie jest wynik testu. To mapa, którą uczestnik sam narysował przez cztery tygodnie.**

Ta różnica musi być widoczna w każdym elemencie — w języku, w układzie, w tym, że raport rośnie stopniowo, a nie pojawia się na końcu jako werdykt.

## Przyjęte decyzje

| Decyzja | Wybór | Konsekwencja |
|---|---|---|
| Forma | ekran w aplikacji **oraz** eksport do PDF | dwa różne artefakty o różnych regułach, sekcja 7 |
| Dostęp | **wyłącznie uczestnik** | rodzic nie ma wglądu; konsekwencje w sekcji 8 |
| Moment | narasta warstwami, całość na spotkaniu 4 | wymaga mechanizmu blokowania, sekcja 4 |

## Czego raport nie robi

- **nie mówi, co uczestnik ma wybrać** — kończy się trzema drogami i pytaniem, nie werdyktem
- **nie zawiera żadnej liczby** — ani procentów dopasowania, ani punktów
- **nie porównuje z innymi uczestnikami**
- **nie diagnozuje** — nie pada słowo *diagnoza*, *profil psychologiczny*, *wynik testu*
- **nie ocenia wizji życia** uczestnika

---

# 2. ARCHITEKTURA WARSTWOWA

Raport istnieje od pierwszego dnia, ale prawie cały jest zamknięty. Uczestnik widzi szkielet z wygaszonymi sekcjami i podpisem, kiedy każda się otworzy.

```
WARSTWA 0   przed startem      szkielet, wszystko zamknięte
WARSTWA 1   po spotkaniu 1     kim jestem i co mnie ciągnie
WARSTWA 2   po spotkaniu 2     w czym mogę być dobry
WARSTWA 3   po spotkaniu 3     jak chcę żyć
WARSTWA 4   spotkanie 4        moje możliwości i trzy drogi
WARSTWA 5   po sesji 1:1       moja decyzja
```

**Dlaczego warstwowo, a nie wszystko na końcu.** Uczestnik przychodzi na cztery spotkania i musi widzieć, że coś z nich zostaje. Pusty raport przez trzy tygodnie to trzy tygodnie bez dowodu, że program działa. Model programu formułuje to wprost: *przychodzi, pracuje i wychodzi z kolejną częścią swojej mapy*.

**Warstwa 0 nie jest pusta.** Pokazuje spis sekcji, które powstaną, z datami. To jest obietnica programu w formie widocznej, a nie obiecanej słownie na pierwszym spotkaniu.

---

# 3. SEKCJE

## WARSTWA 1 — po spotkaniu 1

### 1. Co mnie interesuje
Pięć obszarów z góry, każdy z jednozdaniowym opisem i linijką *co to zmienia*. Pięć z dołu, bez oceniania. Dwa zdania o osiach.

*Źródło: moduł A1.*

### 2. Czego jeszcze nie sprawdziłem
Obszary z wysokim wynikiem, ale bez żadnego doświadczenia. Podpis: *Tego jeszcze nie próbowałeś, a wynik sugeruje, że mogłoby Ci pasować.*

*Źródło: A1, część C.*

### 3. Jak naturalnie działam
Dwanaście osi z zaznaczonym położeniem, posortowanych od najwyraźniejszej. Osie nieostre wyszarzone z podpisem *w tej sprawie jesteś elastyczny*.

*Źródło: moduł A3.*

### 4. Środowisko, w którym będę działał najlepiej
Lista warunków. Jeśli pusta — komunikat o elastyczności, nie o braku.

*Źródło: A3, wyprowadzenie.*

---

## WARSTWA 2 — po spotkaniu 2

### 5. W czym mogę być dobry
Pięć najmocniejszych kompetencji, każda z dopiskiem *masz na to konkretne przykłady* albo *na razie bez doświadczeń, które by to potwierdzały*. Pięć najsłabszych ze zdaniem ramującym o tym, że w tym wieku większość kompetencji dopiero się buduje.

*Źródło: moduł A2.*

### 6. Co lubię, a w czym mogę być dobry
Cztery ćwiartki. Do trzech ukrytych atutów wraz z odpowiedzią uczestnika z ekranu potwierdzenia. Obszary z ćwiartki *chcę, ale muszę zbudować* — nigdy jako odradzanie.

*Źródło: A2 skrzyżowane z A1.*

**To jest najczęściej cytowana sekcja całego raportu.** Warto dać jej najwięcej miejsca.

---

## WARSTWA 3 — po spotkaniu 3

### 7. Czego potrzebuję od pracy
Pięć wartości z góry, trzy z dołu. Wartości nieodzowne wyróżnione. Wynik testu kosztu w formie opisowej.

*Źródło: moduł A4.*

### 8. Jakiego życia chcę
Dwanaście parametrów kształtu życia.

*Źródło: M1, część A.*

### 9. Moja wizja życia
Siedem sekcji własnym tekstem uczestnika. **Cytowane dosłownie, bez skracania i bez interpretacji.**

*Źródło: M1, część B.*

### 10. Czego nie chcę
Pięć dokończonych zdań z M1 plus trzy własne z A5 plus twarde weta. Bez komentarza.

*Źródło: M1 obszar 6, A5 część B i C.*

### 11. Na co jestem gotów
Trzy listy: tak, jeszcze nie wiem, nie. Środkowa z podpisem, że to nie brak, tylko lista rzeczy jeszcze niesprawdzonych.

*Źródło: A5 część A.*

---

## WARSTWA 4 — spotkanie 4

### 0. Mój profil w jednym ekranie
Generowana na końcu, wyświetlana **na samej górze raportu**. Sześć do ośmiu zdań składających całość. Jedyna sekcja, którą uczestnik pokaże komuś na telefonie.

### 12. Moje najmocniejsze obszary
Pięć obszarów z pasmem dopasowania i uzasadnieniem *dlaczego może do Ciebie pasować* oraz *co może Ci przeszkadzać*. Przy każdym poziom wejścia z czasem dojścia.

*Źródło: silnik, etapy 4–7.*

### 13. Konkretne zawody
Dziesięć do dwudziestu zawodów z obszarów z czołówki. Każdy z krótką kartą.

**Sekcja interaktywna.** Uczestnik oznacza każdy zawód: **interesuje mnie / może / nie dla mnie**. Oznaczenia trafiają do sesji 1:1.

### 14. Kierunki studiów
Kierunki prowadzące do obszarów z czołówki, plus zdanie: *Kierunek studiów to nie to samo co zawód. Do jednej pracy prowadzi zwykle kilka dróg.* Przy każdym obszarze także droga bez studiów, jeśli istnieje.

### 15. Umiejętności do rozwoju
Pięć kompetencji wyliczonych automatycznie: najniższe wśród tych, których wymagają obszary z czołówki.

### 16. Trzy drogi
Droga A, B i C. Każda: obszar, poziom wejścia, przykładowe zawody, kierunki, umiejętności, pierwszy krok. Jeśli silnik zgłosił flagę bliskości — komunikat, że A i B to ten sam świat i różnią się drzwiami.

### 17. Czego raczej unikać
Najwyżej trzy antydopasowania. Zawsze ze słowem **aktualnym**.

---

## WARSTWA 5 — po sesji 1:1

### 18. Moja decyzja
Zdanie zapisane własnymi słowami uczestnika na koniec rozmowy. Model programu podaje wzór: *Na ten moment najbardziej sensowna jest dla mnie Droga A. B jest bardzo dobrą alternatywą. C zachowuję jako trzecią możliwość.*

### 19. Pierwsze kroki
Trzy do pięciu konkretnych rzeczy ustalonych na rozmowie. Krótkie, wykonalne w miesiąc.

### 20. Notatka prowadzącego
Wyłącznie to, co prowadzący **przeczytał uczestnikowi na głos** podczas rozmowy. Nic więcej.

---

# 4. BLOKOWANIE — WYMÓG POCHODZĄCY Z MODUŁU A2

**To jest wymaganie techniczne, którego naruszenie psuje jeden z modułów.**

Specyfikacja A2 zakazuje pokazywania wyników modułu A1 bezpośrednio przed pomiarem kompetencji. Uczestnik, który przed chwilą widział swój profil zainteresowań, zacznie dopasowywać do niego odpowiedzi — a różnica między *lubię* a *wychodzi mi* jest głównym produktem modułu A2.

```
Od momentu rozpoczęcia spotkania 2 do zakończenia częsci B modułu A2:
    sekcje 1, 2, 3, 4 są ZABLOKOWANE

    ekran pokazuje: "Wróć tu po dzisiejszym ćwiczeniu.
                     Chcemy, żeby Twoje odpowiedzi były niezależne
                     od tego, co wyszło poprzednio."
```

Ta sama zasada dotyczy dostępu z telefonu i eksportu PDF. **Blokada obejmuje wszystkie kanały.**

Jedyny wyjątek: moduł M1, obszar 2, świadomie pokazuje wynik A3 obok pytań. Tam nie ma pomiaru, tylko wybór.

---

# 5. ZASADY JĘZYKA

Raport czyta siedemnastolatek, często sam, czasem w kiepskim momencie. Zasady są twarde.

| Zasada | Zamiast | Piszemy |
|---|---|---|
| Nigdy nie orzekaj | Jesteś analityczny | Z Twoich odpowiedzi wynika, że… |
| Nigdy nie oceniaj słabszych stron | Jesteś słaby w wystąpieniach | Mówienie do dużej grupy kosztuje Cię więcej niż innych |
| Nigdy nie zamykaj | To nie dla Ciebie | Ta droga zawiera dużo elementów przeciwnych Twoim **aktualnym** preferencjom |
| Nigdy nie sugeruj precyzji | Dopasowanie 87% | Bardzo mocne dopasowanie |
| Nigdy nie porównuj | Lepiej niż 70% grupy | *(nie występuje)* |

**Zakazane słowa w całym raporcie:** diagnoza, wynik testu, profil psychologiczny, iloraz, norma, percentyl, powołanie, przeznaczenie.

**Sekcja 9 i 10 są cytowane dosłownie.** To jedyny tekst w raporcie napisany przez uczestnika i system nie ma prawa go poprawiać ani streszczać.

## Data i zastrzeżenie

Każdy ekran i każda strona PDF ma stopkę:

> Ten raport powstał na podstawie tego, co o sobie wiedziałeś w **{miesiąc rok}**. Ludzie się zmieniają. Za dwa lata część z tego będzie już nieaktualna i to jest normalne.

Zastrzeżenie nie jest formalnością. Uczestnik może wrócić do tego dokumentu za pięć lat i musi wiedzieć, czym on jest.

---

# 6. EKRAN

- **mobile first** — większość otworzy to na telefonie
- sekcje zwijane, domyślnie zwinięte poza sekcją 0
- sekcje zamknięte widoczne, wyszarzone, z datą otwarcia
- pasek postępu warstw
- sekcja 13 interaktywna, oznaczenia zapisywane natychmiast
- sekcje 9 i 10 edytowalne do końca programu
- przycisk eksportu do PDF, aktywny od warstwy 4
- **brak przycisku udostępniania w sieciach społecznościowych**

Ostatni punkt jest celowy. Raport zawiera sekcję *czego nie chcę* i wizję życia. Ułatwianie natychmiastowego wrzucenia tego na Instagram byłoby wyrządzeniem szesnastolatkowi przysługi, o którą nie prosił.

---

# 7. PDF — INNE REGUŁY NIŻ EKRAN

PDF to **zdjęcie z konkretnego dnia**, które będzie istnieć latami. Wymaga ostrożniejszej redakcji niż ekran.

| Element | Ekran | PDF |
|---|---|---|
| Oznaczenia zawodów | interaktywne | zapisany stan z dnia eksportu |
| Sekcje zamknięte | widoczne, wyszarzone | pomijane |
| Data wygenerowania | w stopce | **na stronie tytułowej, dużą czcionką** |
| Notatka prowadzącego | jak na ekranie | tylko jeśli uczestnik potwierdził |
| Flagi jakości i ostrzeżenia dla prowadzącego | nie występują | nie występują |

Reguła nadrzędna: **jeśli zdanie źle zabrzmi czytane za dwa lata, nie wchodzi do PDF.** Dotyczy to zwłaszcza sformułowań o słabszych stronach i antydopasowaniach.

PDF generowany jest na żądanie, najwcześniej po spotkaniu 4. Każdy eksport zapisuje datę; starsze wersje nie są nadpisywane.

---

# 8. DOSTĘP — RAPORT NALEŻY DO UCZESTNIKA

Rodzic ani opiekun nie ma wglądu. To decyzja o konsekwencjach, które trzeba obsłużyć, a nie przemilczeć.

## Dlaczego tak jest lepiej

Uczestnik odpowiada szczerze tylko wtedy, gdy wie, że nikt inny tego nie przeczyta. Sekcje *czego nie chcę*, *jakiego życia chcę* i wartości to miejsca, w których szesnastolatek napisze prawdę wyłącznie pod tym warunkiem. Gdyby wiedział, że raport trafi do rodziców, część odpowiedzi byłaby pisana pod nich — i cały program mierzyłby oczekiwania rodziny zamiast uczestnika.

## Co trzeba zrobić, żeby to nie wybuchło

**Powiedzieć rodzicom na starcie, nie na końcu.** W materiałach rekrutacyjnych i w zgodzie opiekuna musi paść zdanie: raport jest własnością uczestnika i to on decyduje, czy go pokaże. Rodzic, który dowie się o tym dopiero po czterech tygodniach i zapłaceniu za program, poczuje się oszukany — i będzie miał rację.

**Dać uczestnikowi narzędzie do dzielenia się.** Przycisk *pokaż komuś* generuje wersję do pokazania, z możliwością odznaczenia sekcji. Domyślnie odznaczone: wizja życia, czego nie chcę, wartości. Uczestnik świadomie decyduje, co odsłania.

Bez tego przycisku i tak pokaże zrzut ekranu — tylko bez kontroli nad tym, co pokazuje.

**Dla niepełnoletnich:** zgoda opiekuna dotyczy udziału w programie, nie dostępu do wyników. To rozróżnienie musi być w dokumencie zgody napisane wprost.

---

# 9. PRZYPADKI BRZEGOWE

| Sytuacja | Obsługa |
|---|---|
| Profil płaski w A1 | Sekcja 1 pokazuje tylko osie i listę do sprawdzenia; sekcja 12 nie powstaje; zamiast trzech dróg — trzy obszary do wypróbowania |
| Profil płaski w A1 i A2 | Warstwa 4 nie powstaje w ogóle; raport kończy się na warstwie 3 plus notatka z sesji 1:1 |
| Weta usunęły większość obszarów | Uczestnik nie widzi liczby usuniętych ani ich listy; widzi tylko to, co zostało |
| Uczestnik nie napisał nic w wizji życia | Sekcja 9 zawiera same parametry z części A; bez komentarza o brakach |
| Uczestnik opuścił spotkanie | Warstwa nie otwiera się; ekran wyjaśnia, co można uzupełnić i kiedy |
| Uczestnik nie przyszedł na 1:1 | Raport kończy się na warstwie 4; sekcje 18–20 pozostają zamknięte, nie znikają |
| Uczestnik chce usunąć swoje dane | Usuwane w całości, bez pytania o powód |
| Uczestnik wraca po roku | Raport dostępny; komunikat, że minęło dwanaście miesięcy i część mogła się zmienić |
| Wszystkie obszary poniżej progu | Nigdy pustej listy; pięć najwyższych z wyjaśnieniem, że profil jest jeszcze nieostry |

---

# 10. TESTY AKCEPTACYJNE

1. **Blokada A1.** W trakcie spotkania 2, do zakończenia części B modułu A2, sekcje 1–4 są niedostępne na wszystkich urządzeniach i w eksporcie.
2. **Brak liczb.** Żadna sekcja widoczna dla uczestnika nie zawiera wartości liczbowej dopasowania.
3. **Dosłowność.** Sekcje 9 i 10 renderują tekst uczestnika bez zmian, łącznie z błędami.
4. **Warstwy.** Sekcja z wyższej warstwy nie renderuje się przed jej odblokowaniem, nawet przy bezpośrednim odwołaniu do adresu.
5. **PDF.** Eksport przed warstwą 4 jest niemożliwy; każdy eksport ma datę na stronie tytułowej.
6. **Dostęp.** Nie istnieje żadna ścieżka dostępu do raportu dla konta innego niż uczestnik.
7. **Udostępnianie.** Wersja *pokaż komuś* domyślnie ukrywa sekcje 7, 8, 9 i 10.
8. **Nigdy pusto.** Przy każdym możliwym profilu sekcja 12 zawiera co najmniej pięć pozycji albo komunikat o nieostrym profilu.
9. **Zakazane słowa.** Automatyczny test na obecność listy z sekcji 5 w całym wygenerowanym tekście.
10. **Usunięcie danych.** Żądanie usunięcia kasuje raport, odpowiedzi i eksporty.

---

# 11. CO ODBLOKOWUJE TEN DOKUMENT

Raport był umową i teraz wiadomo, co system musi wyprodukować. Trzy rzeczy da się teraz zacząć, każda niezależnie:

**Karty zawodów.** Sekcja 13 określa, co musi zawierać karta: czym się zajmuje, dlaczego może pasować, co może przeszkadzać, czego trzeba się nauczyć, jak można dojść. Nic więcej. To jest pięć pól, nie profil na sto dziesięć pozycji.

**Scenariusze czterech spotkań.** Warstwy określają, kiedy i co się pokazuje. Moment prezentacji wyników w każdym spotkaniu jest już zdefiniowany.

**Scenariusz sesji 1:1.** Warstwa 5 mówi, co z rozmowy musi zostać zapisane. Panel prowadzącego musi pokazywać warstwy 1–4 plus flagi z silnika i pytania wygenerowane w etapie 7.

## Czego wciąż nie ma

Baza kierunków studiów. Sekcja 14 jej wymaga, a jej nie ma — to jest jedyne miejsce, w którym raport odwołuje się do danych, których jeszcze nie zebrano.
