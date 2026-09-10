# BAZA OBSZARÓW ZAWODOWYCH
## Specyfikacja — wersja 2.0

Program warsztatów rozwojowo-zawodowych 16–24 | Fundacja Służąc Życiu

27 obszarów zawodowych z mapowaniem na sześć modułów diagnostycznych, poziomami wejścia, macierzą sąsiedztwa i 191 przykładowymi zawodami.

**Zakres tego dokumentu.** Baza opisuje, **czym jest każdy obszar** i z czym się wiąże. Nie opisuje, **jak silnik liczy dopasowanie** — wagi modułów, wzór składania wyniku, progi pasm i mechanika wet należą do osobnej specyfikacji silnika dopasowania. Tutaj są tylko dane wejściowe dla tamtego dokumentu.

**Zmiany wobec wersji 1.0:** dodany obszar 27 wraz z regułą parowania z branżą; każdy obszar ma poziomy wejścia; dodana macierz sąsiedztwa; wagi modułów przeniesione do specyfikacji silnika.

---

# 1. PO CO TA BAZA I DLACZEGO PRZED ZAWODAMI

Sześć modułów mierzy uczestnika. Baza obszarów jest **jedynym miejscem, w którym pomiar zamienia się w odpowiedź**. Bez niej assessmenty są dobrze zrobionym badaniem, które donikąd nie prowadzi.

## Dlaczego obszary, a nie od razu zawody

Każdy zawód wymagałby przypisania około 110 ocen: 24 zainteresowania, 30 kompetencji, 12 wartości, 32 filtry, 12 parametrów życia. Przy 150 zawodach to ponad **szesnaście tysięcy ocen eksperckich**, wykonanych zanim ktokolwiek sprawdzi, czy system działa.

Przy 27 obszarach to około trzech tysięcy. A ponieważ nagłówkiem raportu uczestnika są **TOP obszary**, solidna warstwa obszarów daje sensowny raport nawet przy zgrubnej warstwie zawodów. Odwrotnie nie działa.

```
OBSZAR  →  w którą stronę świata pasujesz
ZAWÓD   →  co konkretnie mógłbyś robić
POZIOM  →  ile lat dzieli Cię od samodzielnej pracy
```

Zawód dziedziczy profil obszaru i modyfikuje go tylko tam, gdzie realnie się różni. Zamiast 110 ocen na zawód wystarczy 5–15 odchyleń.

---

# 2. ILE OBSZARÓW I DLACZEGO 27

Liczba wynika z rachunku pokrycia. Moduł A1 mierzy pełne spektrum — od rzemiosła i rolnictwa po analizę danych. Każdy z jego 24 obszarów zainteresowań musi mieć w bazie co najmniej jeden dom.

| Wariant | Problem |
|---|---|
| 15–20 obszarów | Rodziny *ręce i teren* oraz *porządek* dostają po jednym–dwa obszary; uczestnik o profilu rzemieślniczym trafia do kategorii, która go nie opisuje |
| **27 obszarów** | **Wszystkie 24 zainteresowania, 30 kompetencji, 12 wartości i 32 filtry mają pokrycie. Zweryfikowane algorytmicznie** |
| 30+ obszarów | Obszary zaczynają się zlewać; TOP 5 przestaje różnicować; koszt mapowania rośnie bez zysku |

**Trzy obszary zainteresowań mają tylko jeden dom:** dźwięk i muzyka, przyroda i zwierzęta, przedsiębiorczość. Dla pierwszych dwóch to poprawne. Warto sprawdzić po pierwszych kohortach: jeśli wielu uczestników ma przyrodę w TOP 3, obszar 15 trzeba rozdzielić na *praca ze zwierzętami* i *rolnictwo i środowisko*.

---

# 3. PRZEDSIĘBIORCZOŚĆ — DWIE RÓŻNE RZECZY

To jest najważniejsza korekta w wersji 2.0 i warto rozumieć, na czym polegała pomyłka.

W wersji 1.0 przedsiębiorczość była traktowana jako **tryb** nakładany na inne obszary. To działało dla fizjoterapeuty z własnym gabinetem, ale **nie działało dla właściciela firmy budowlanej** — a to jest przypadek znacznie częstszy i ważniejszy.

## Rozróżnienie

| | **Samozatrudnienie** | **Budowanie firmy** |
|---|---|---|
| Co się zmienia | tylko forma rozliczenia | cała treść pracy |
| Co robisz | to samo, co wcześniej, na swoim | sprzedajesz, zatrudniasz, pilnujesz płynności |
| Przykład | fizjoterapeuta w swoim gabinecie | właściciel firmy budowlanej |
| Kompetencje | te same, co w obszarze macierzystym | inne: sprzedaż, negocjowanie, odporność, rachunki |
| W bazie | **tryb** nakładany na obszar | **obszar 27** |

Właściciel firmy budowlanej nie jest budowlańcem. Jego dzień nie ma nic wspólnego z dniem kierownika budowy. Opisanie mu obszaru *budownictwo* byłoby opisaniem pracy, której nie będzie wykonywał.

## Reguła parowania — obowiązkowa

Firmy nie buduje się w próżni. **Obszar 27 nigdy nie pojawia się sam.** Zawsze jako para:

```
PRZEDSIĘBIORCZOŚĆ — w obszarze: {branża}

gdzie branża = najwyżej dopasowany obszar uczestnika spośród tych,
               które mają realny wariant własnej firmy
```

Obszary z realnym wariantem własnej firmy: Edukacja i szkolenia, Gastronomia i hotelarstwo, Marketing i komunikacja, Media, film i treści, Muzyka i sztuki sceniczne, Projektowanie i sztuki wizualne, Psychologia i wsparcie, Rolnictwo, przyroda i zwierzęta, Rzemiosło i usługi techniczne, Sport i aktywność fizyczna, Sprzedaż i rozwój biznesu, Technologia i oprogramowanie, Wspólnota, organizacje i posługa, Zdrowie, rehabilitacja i ciało, budownictwo, transport, inżynieria.

Dzięki parowaniu uczestnik dowiaduje się i **czym** będzie się zajmował, i **w czym**. Kompetencje pochodzą z obszaru 27, treść branżowa z obszaru macierzystego.

## Tryb samozatrudnienia — osobno

Niezależnie od obszaru 27, każdy obszar z powyższej listy może dostać w raporcie adnotację *„możliwe na własny rachunek”*. To nie zmienia treści pracy ani rekomendacji — mówi tylko, że nie trzeba być czyimś pracownikiem.

Warunek nałożenia adnotacji definiuje specyfikacja silnika. Baza dostarcza jedynie listę obszarów, w których to jest realne.

---

# 4. POZIOMY WEJŚCIA

**To jest druga istotna zmiana w wersji 2.0 i wypełnia lukę, która realnie szkodziła.**

Siedemnastolatek widzi obszar *medycyna i ratownictwo* i myśli: lekarz, jedenaście lat, odpadam. A w tym samym obszarze jest technik po dwóch latach i ratownik po trzech.

Profil obszaru uśredniał wszystkie role i przez to zniekształcał obraz — zwłaszcza w wymaganiach filtrowych dotyczących studiów. Dlatego każdy obszar ma teraz **dwa do czterech poziomów wejścia** z czasem dojścia i informacją o studiach.

Poziomy służą trzem rzeczom:

1. **Uczestnik widzi, że obszar ma różne drzwi.** To jest najważniejsze — otwiera obszary, które inaczej zostałyby skreślone jednym spojrzeniem.
2. **Filtr `F01` i `F02` działa na poziomie, nie na obszarze.** Uczestnik niegotowy na pięcioletnie studia nie traci całego obszaru, tylko jego najdłuższy poziom.
3. **Trzy końcowe drogi mogą mieszać poziomy** — Droga A z długim dojściem, Droga B jako szybsze wejście w ten sam świat.

**Konsekwencja dla silnika:** wymagania edukacyjne z sekcji 7 są wartościami uśrednionymi dla obszaru. Przy filtrowaniu należy używać wymagań **poziomu**, nie obszaru. Reguła przeliczania należy do specyfikacji silnika.

---

# 5. STRUKTURA WPISU

Osiem grup, 27 obszarów. Grupy porządkują raport; uczestnik widzi nazwy obszarów.

| Grupa | Obszary |
|---|---|
| **Biznes i wpływ** | 1. Biznes, strategia i zarządzanie · 2. Marketing i komunikacja · 3. Sprzedaż i rozwój biznesu · 27. Przedsiębiorczość i budowanie firmy |
| **Liczby i porządek** | 4. Finanse i księgowość · 5. Administracja, procesy i obsługa · 6. Analiza danych |
| **Prawo i państwo** | 7. Prawo · 8. Służby mundurowe i bezpieczeństwo |
| **Technologia i nauka** | 9. Technologia i oprogramowanie · 10. Inżynieria i produkcja · 11. Nauka i badania |
| **Ręce, teren i usługi** | 12. Budownictwo i architektura · 13. Rzemiosło i usługi techniczne · 14. Transport i logistyka · 15. Rolnictwo, przyroda i zwierzęta · 26. Gastronomia i hotelarstwo |
| **Zdrowie i ciało** | 16. Medycyna i ratownictwo · 17. Zdrowie, rehabilitacja i ciało · 18. Sport i aktywność fizyczna |
| **Ludzie i wsparcie** | 19. Opieka i praca socjalna · 20. Psychologia i wsparcie · 21. Edukacja i szkolenia · 22. Wspólnota, organizacje i posługa |
| **Tworzenie** | 23. Projektowanie i sztuki wizualne · 24. Media, film i treści · 25. Muzyka i sztuki sceniczne |

Każdy obszar ma siedem profili:

| Profil | Źródło | Postać |
|---|---|---|
| Zainteresowania | A1 | obszary z wagą 3 / 2 / 1 |
| Kompetencje | A2 | kompetencje z wagą 3 / 2 / 1 |
| Wartości | A4 | zaspokajane oraz w konflikcie |
| Filtry | A5 | wymagania 0,00–1,00 |
| Kształt życia | M1 | typowe parametry |
| Środowisko | A3 | warunki, które obszar oferuje |
| Poziomy wejścia | — | 2–4 progi z czasem dojścia |

Waga **3** to rdzeń obszaru. **2** to mocne powiązanie. **1** to element pomocniczy.

Wymaganie filtrowe **0,60 i wyżej** jest progiem, przy którym weto uczestnika usuwa obszar. To czyni te wagi najbardziej wrażliwym elementem całej bazy.

---

# 6. MACIERZ SĄSIEDZTWA

Podobieństwo między obszarami policzone z ich własnych profili — miara kosinusowa na połączonym wektorze zainteresowań i kompetencji. **Nie wymaga dodatkowego osądu eksperckiego** i aktualizuje się automatycznie przy każdej zmianie profilu.

Rozkład w tej wersji bazy: średnie podobieństwo **0,17**, maksymalne **0,79**.

## Pary najbardziej podobne

| Podobieństwo | Para |
|---|---|
| 0.79 | Analiza danych / Technologia i oprogramowanie |
| 0.76 | Analiza danych / Nauka i badania |
| 0.72 | Zdrowie, rehabilitacja i ciało / Sport i aktywność fizyczna |
| 0.72 | Opieka i praca socjalna / Psychologia i wsparcie |
| 0.71 | Sprzedaż i rozwój biznesu / Przedsiębiorczość i budowanie firmy |
| 0.70 | Technologia i oprogramowanie / Nauka i badania |
| 0.68 | Projektowanie i sztuki wizualne / Media, film i treści |
| 0.65 | Marketing i komunikacja / Media, film i treści |

## Po co to jest — reguła trzech dróg

Model programu obiecuje uczestnikowi trzy uporządkowane drogi. Bez reguły odległości uczestnik o profilu analitycznym dostanie **analityka danych, analityka finansowego i analityka rynku** — i wyjdzie z programu z poczuciem, że nic nie dostał.

```
DROGA A = obszar z najwyższym dopasowaniem

DROGA B = najwyżej dopasowany obszar o podobieństwie do A poniżej 0,45

DROGA C = najwyżej dopasowany obszar o podobieństwie poniżej 0,45
          jednocześnie do A i do B

jeśli żaden obszar nie spełnia warunku:
    poluzuj próg do 0,55, potem do 0,65
    jeśli nadal nie ma — zbuduj Drogę C jako inny POZIOM WEJŚCIA
    w obszarze A albo B (np. A: lekarz, C: ratownik medyczny)
```

Ostatnia linia jest istotna. U osoby o bardzo wąskim profilu trzecia droga nie musi być innym obszarem — może być tym samym światem, do którego wchodzi się innymi drzwiami. To jest uczciwsze niż doklejanie na siłę obszaru, który do niej nie pasuje.

Pełna macierz 27 × 27 znajduje się w pliku danych. Poniżej, przy każdym obszarze, wypisane są trzy najbliższe sąsiedztwa.

---

# 7. DWADZIEŚCIA SIEDEM OBSZARÓW

## GRUPA: BIZNES I WPŁYW

### 1. Biznes, strategia i zarządzanie

**Zainteresowania (A1):** Prowadzenie ludzi (3), Planowanie i logistyka (2), Liczby, dane, wzorce (2), Sprzedaż i przekonywanie (1), Porządkowanie i systematyzowanie (1), Pieniądze i rozliczenia (1)

**Kompetencje (A2):** Prowadzenie grupy (3), Organizowanie i planowanie (3), Myślenie systemowe (2), Analiza informacji (2), Prowadzenie wielu spraw naraz (2), Przekonywanie (1), Opanowanie pod presją (1)

**Wartości zaspokajane (A4):** Wpływ, Rozwój, Pieniądze, Uznanie  
**W konflikcie z:** Czas dla siebie

**Wymagania (A5):** komputer cały dzień **0.85**, ciągły kontakt z ludźmi **0.85**, stała presja **0.80**, nadgodziny **0.70**, studia w ogóle **0.60**, przeprowadzka **0.50**, wyjazdy służbowe **0.45**

**Typowy kształt życia (M1):** praca w centrum życia, dużo godzin, duża organizacja, szybka kariera

**Środowisko, które oferuje (A3):** realny wpływ na decyzje, zmienne zadania, stały kontakt z ludźmi, szybkie tempo

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | koordynator, asystent projektu | 0–1 rok | nie |
| średnie | specjalista, potem kierownik zespołu | 3–5 lat | zwykle tak |
| długie | dyrektor, konsultant strategiczny | 8+ lat | tak |

**Co może przeszkadzać:** dużo spotkań, odpowiedzialność za cudze wyniki, praca wchodzi w wieczory

**Przykładowe zawody:** kierownik zespołu, project manager, product manager, konsultant biznesowy, dyrektor operacyjny, analityk biznesowy, specjalista ds. rozwoju

**Kierunki studiów:** zarządzanie, ekonomia, finanse i rachunkowość, kierunki techniczne + doświadczenie

**Droga bez studiów:** Rzadko na starcie. Typowa droga to awans z roli specjalistycznej po 3–6 latach.

**Najbliższe obszary:** Przedsiębiorczość i budowanie firmy (0.50), Transport i logistyka (0.50), Administracja, procesy i obsługa (0.40)

---

### 2. Marketing i komunikacja

**Zainteresowania (A1):** Sprzedaż i przekonywanie (3), Słowo i pisanie (2), Obraz i design (2), Liczby, dane, wzorce (2), Scena, film, występ (1)

**Kompetencje (A2):** Przekonywanie (3), Wyrażanie się słowem (3), Wymyślanie nowych rozwiązań (2), Wyczucie formy i estetyki (2), Analiza informacji (2), Prowadzenie wielu spraw naraz (1)

**Wartości zaspokajane (A4):** Rozwój, Zmienność, Uznanie, Wpływ  
**W konflikcie z:** Stabilność

**Wymagania (A5):** komputer cały dzień **0.90**, ciągły kontakt z ludźmi **0.70**, stała presja **0.70**, nadgodziny **0.60**, studia w ogóle **0.45**

**Typowy kształt życia (M1):** możliwa zdalna, szybka kariera, praca przenika życie

**Środowisko, które oferuje (A3):** przestrzeń na własne pomysły, zmienne zadania, szybkie tempo, widoczny efekt

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | junior content, social media | 0–1 rok | nie |
| średnie | specjalista marketingu | 2–3 lata | nie |
| długie | brand manager, szef marketingu | 6+ lat | częściowo |

**Co może przeszkadzać:** ciągła zmiana priorytetów, praca oceniana liczbami, dużo pracy bez trwałego efektu

**Przykładowe zawody:** specjalista marketingu, content marketer, social media manager, copywriter, brand manager, specjalista PR, specjalista SEO

**Kierunki studiów:** marketing, zarządzanie, dziennikarstwo i komunikacja, psychologia biznesu

**Droga bez studiów:** Tak. Portfolio i kursy branżowe znaczą tu więcej niż dyplom.

**Najbliższe obszary:** Media, film i treści (0.65), Prawo (0.52), Projektowanie i sztuki wizualne (0.46)

**Wariant na własny rachunek:** realny.

---

### 3. Sprzedaż i rozwój biznesu

**Zainteresowania (A1):** Sprzedaż i przekonywanie (3), Prowadzenie ludzi (2), Spór, prawo, negocjacje (2), Przedsiębiorczość i ryzyko (2), Rozmowa i wsparcie (1)

**Kompetencje (A2):** Przekonywanie (3), Negocjowanie (3), Odporność na odmowę i porażkę (3), Wyczuwanie ludzi (2), Uprzejmość pod presją (2), Samodzielność bez nadzoru (2)

**Wartości zaspokajane (A4):** Pieniądze, Wolność, Uznanie, Wpływ  
**W konflikcie z:** Stabilność

**Wymagania (A5):** ciągły kontakt z ludźmi **0.90**, stała presja **0.85**, wyjazdy służbowe **0.70**, roszczeniowi klienci **0.70**, niepewny dochód **0.70**, wystąpienia **0.60**, komputer cały dzień **0.55**

**Typowy kształt życia (M1):** wysoki poziom życia, dużo godzin, szybka kariera

**Środowisko, które oferuje (A3):** duża samodzielność, natychmiastowy efekt pracy, realny wpływ na wynik

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | przedstawiciel handlowy | 0–1 rok | nie |
| średnie | account manager | 2–4 lata | nie |
| długie | dyrektor sprzedaży | 7+ lat | częściowo |

**Co może przeszkadzać:** częste odmowy, dochód zależny od wyniku, presja celów miesięcznych

**Przykładowe zawody:** przedstawiciel handlowy, account manager, specjalista ds. kluczowych klientów, business development manager, doradca klienta, agent nieruchomości, broker

**Kierunki studiów:** zarządzanie, ekonomia, dowolny kierunek + kompetencje sprzedażowe

**Droga bez studiów:** Tak. Jeden z najbardziej otwartych obszarów dla osób bez dyplomu.

**Najbliższe obszary:** Przedsiębiorczość i budowanie firmy (0.71), Prawo (0.37), Marketing i komunikacja (0.33)

**Wariant na własny rachunek:** realny.

---

### 27. Przedsiębiorczość i budowanie firmy

> **Obszar szczególny.** Nigdy nie pokazywany samodzielnie — zawsze w parze z branżą, zgodnie z regułą z sekcji 3.

**Zainteresowania (A1):** Przedsiębiorczość i ryzyko (3), Sprzedaż i przekonywanie (2), Prowadzenie ludzi (2), Pieniądze i rozliczenia (2), Planowanie i logistyka (1)

**Kompetencje (A2):** Odporność na odmowę i porażkę (3), Przekonywanie (3), Samodzielność bez nadzoru (3), Organizowanie i planowanie (2), Rachunki i szacowanie (2), Negocjowanie (2), Prowadzenie grupy (2), Opanowanie pod presją (2), Wymyślanie nowych rozwiązań (1)

**Wartości zaspokajane (A4):** Wolność, Pieniądze, Wpływ, Rozwój  
**W konflikcie z:** Stabilność, Czas dla siebie

**Wymagania (A5):** własna działalność **1.00**, niepewny dochód **0.95**, niskie zarobki na starcie **0.85**, stała presja **0.85**, nadgodziny **0.85**, ciągły kontakt z ludźmi **0.80**, nieregularne godziny **0.70**, roszczeniowi klienci **0.60**, studia w ogóle **0.15**

**Typowy kształt życia (M1):** praca w centrum życia, dużo godzin, mały zespół lub własne, praca przenika życie, wysoki poziom życia, prowadzenie ludzi

**Środowisko, które oferuje (A3):** pełna samodzielność, realny wpływ na wszystko, brak kontroli nad głową, natychmiastowy efekt decyzji

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | jednoosobowa działalność w wyuczonym fachu | 1–3 lata | nie |
| średnie | mała firma z kilkoma osobami | 3–6 lat | nie |
| długie | firma z zespołem i strukturą | 7+ lat | nie |

**Co może przeszkadzać:** brak stałego dochodu przez pierwsze lata, odpowiedzialność za cudze pensje, trudno o granicę między pracą a życiem, większość firm nie przetrwa

**Przykładowe zawody:** właściciel firmy usługowej, właściciel warsztatu lub zakładu, właściciel lokalu gastronomicznego, założyciel firmy technologicznej, właściciel gabinetu lub praktyki, franczyzobiorca, właściciel sklepu, właściciel firmy budowlanej

**Kierunki studiów:** nie są wymagane, zarządzanie i ekonomia pomagają, ale nie przesądzają

**Droga bez studiów:** Tak. To obszar, w którym dyplom znaczy najmniej ze wszystkich w bazie.

**Najbliższe obszary:** Sprzedaż i rozwój biznesu (0.71), Biznes, strategia i zarządzanie (0.50), Wspólnota, organizacje i posługa (0.30)

---

## GRUPA: LICZBY I PORZĄDEK

### 4. Finanse i księgowość

**Zainteresowania (A1):** Pieniądze i rozliczenia (3), Liczby, dane, wzorce (3), Precyzja i kontrola (2), Porządkowanie i systematyzowanie (2)

**Kompetencje (A2):** Rachunki i szacowanie (3), Dokładność (3), Praca z regułami i przepisami (3), Analiza informacji (2), Wytrwałość w powtarzalnym (2)

**Wartości zaspokajane (A4):** Stabilność, Pieniądze, Mistrzostwo  
**W konflikcie z:** Zmienność

**Wymagania (A5):** komputer cały dzień **0.95**, dokształcanie przez całe życie **0.85**, studia w ogóle **0.75**, egzaminy zawodowe **0.70**, nadgodziny **0.65**

**Typowy kształt życia (M1):** wyraźna granica, osiadłość, duża organizacja

**Środowisko, które oferuje (A3):** ciche, uporządkowane miejsce, czas na dokładność, przewidywalny rytm

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | asystent księgowego | 0–1 rok | nie, wystarczy technikum |
| średnie | księgowy, analityk finansowy | 3–5 lat | zwykle tak |
| długie | główny księgowy, biegły rewident | 8+ lat | tak + egzaminy |

**Co może przeszkadzać:** powtarzalność, spiętrzenia w okresach rozliczeniowych, odpowiedzialność za błędy

**Przykładowe zawody:** księgowy, główny księgowy, analityk finansowy, kontroler finansowy, doradca podatkowy, specjalista ds. płac, audytor

**Kierunki studiów:** finanse i rachunkowość, ekonomia, matematyka finansowa

**Droga bez studiów:** Częściowo. Certyfikaty księgowe otwierają drogę bez studiów, ale wolniej.

**Najbliższe obszary:** Administracja, procesy i obsługa (0.54), Analiza danych (0.54), Nauka i badania (0.42)

---

### 5. Administracja, procesy i obsługa

**Zainteresowania (A1):** Porządkowanie i systematyzowanie (3), Precyzja i kontrola (2), Planowanie i logistyka (2), Rozmowa i wsparcie (1), Pieniądze i rozliczenia (1)

**Kompetencje (A2):** Organizowanie i planowanie (3), Dokładność (3), Praca z regułami i przepisami (3), Prowadzenie wielu spraw naraz (2), Uprzejmość pod presją (2), Zapamiętywanie (1)

**Wartości zaspokajane (A4):** Stabilność, Czas dla siebie, Relacje  
**W konflikcie z:** Zmienność, Pieniądze

**Wymagania (A5):** komputer cały dzień **0.85**, ciągły kontakt z ludźmi **0.70**, roszczeniowi klienci **0.60**, dokształcanie przez całe życie **0.50**

**Typowy kształt życia (M1):** mniej godzin, wyraźna granica, praca jako część życia

**Środowisko, które oferuje (A3):** jasne oczekiwania, przewidywalny dzień, spokojna atmosfera

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | pracownik obsługi, asystent | 0–1 rok | nie |
| średnie | specjalista administracyjny, HR | 2–4 lata | częściowo |
| długie | office manager, kierownik działu | 6+ lat | częściowo |

**Co może przeszkadzać:** mała autonomia, powtarzalność, ograniczone możliwości awansu

**Przykładowe zawody:** specjalista administracyjny, office manager, urzędnik, specjalista HR, koordynator biura, specjalista obsługi klienta, asystent zarządu

**Kierunki studiów:** administracja, zarządzanie, socjologia, dowolny kierunek

**Droga bez studiów:** Tak, w wielu rolach wystarczy technikum i doświadczenie.

**Najbliższe obszary:** Transport i logistyka (0.61), Finanse i księgowość (0.54), Budownictwo i architektura (0.45)

---

### 6. Analiza danych

**Zainteresowania (A1):** Liczby, dane, wzorce (3), Nauka i eksperyment (2), Technologia i programowanie (2), Precyzja i kontrola (1)

**Kompetencje (A2):** Analiza informacji (3), Rachunki i szacowanie (3), Myślenie systemowe (3), Dokładność (2), Szybkie uczenie się nowego (2), Rozwiązywanie problemów (2)

**Wartości zaspokajane (A4):** Rozwój, Mistrzostwo, Pieniądze  
**W konflikcie z:** Relacje

**Wymagania (A5):** komputer cały dzień **0.95**, dokształcanie przez całe życie **0.90**, studia w ogóle **0.80**, samotność **0.50**

**Typowy kształt życia (M1):** możliwa zdalna, praca przenika życie, długa inwestycja w naukę

**Środowisko, które oferuje (A3):** cisza i skupienie, skupienie na jednym obszarze, duża samodzielność

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | junior analityk po kursie | 1–2 lata | nie |
| średnie | analityk danych | 3–5 lat | zwykle tak |
| długie | data scientist, lead analityczny | 6+ lat | tak |

**Co może przeszkadzać:** mało kontaktu z ludźmi, efekt pracy bywa niewidoczny, ciągłe dokształcanie

**Przykładowe zawody:** analityk danych, data scientist, analityk rynku, specjalista BI, statystyk, analityk ryzyka

**Kierunki studiów:** informatyka, matematyka, ekonometria, analityka gospodarcza

**Droga bez studiów:** Częściowo. Bootcampy działają, ale bez podstaw matematycznych sufit jest niski.

**Najbliższe obszary:** Technologia i oprogramowanie (0.79), Nauka i badania (0.76), Finanse i księgowość (0.54)

---

## GRUPA: PRAWO I PAŃSTWO

### 7. Prawo

**Zainteresowania (A1):** Spór, prawo, negocjacje (3), Słowo i pisanie (2), Precyzja i kontrola (2), Sprzedaż i przekonywanie (1), Liczby, dane, wzorce (1)

**Kompetencje (A2):** Praca z regułami i przepisami (3), Wyrażanie się słowem (3), Analiza informacji (3), Zapamiętywanie (2), Negocjowanie (2), Przekonywanie (2)

**Wartości zaspokajane (A4):** Uznanie, Pieniądze, Zgodność z zasadami, Mistrzostwo  
**W konflikcie z:** Czas dla siebie

**Wymagania (A5):** 5+ lat studiów **0.95**, egzaminy zawodowe **0.95**, studia w ogóle **0.95**, dokształcanie przez całe życie **0.90**, komputer cały dzień **0.85**, nadgodziny **0.80**, stała presja **0.80**

**Typowy kształt życia (M1):** długa inwestycja w naukę, praca w centrum życia, dużo godzin

**Środowisko, które oferuje (A3):** czas na dokładność, kultura mówienia wprost, skupienie na jednym

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | asystent prawny, paralegal | 1–2 lata | nie |
| średnie | specjalista ds. zgodności | 4–6 lat | tak |
| długie | adwokat, radca prawny, sędzia | 8–9 lat | tak + aplikacja |

**Co może przeszkadzać:** bardzo długa droga do zawodu, duża odpowiedzialność, praca po godzinach

**Przykładowe zawody:** adwokat, radca prawny, notariusz, sędzia, prokurator, prawnik wewnętrzny, specjalista ds. zgodności

**Kierunki studiów:** prawo (jednolite magisterskie + aplikacja), administracja, prawo w biznesie

**Droga bez studiów:** Nie w zawodach regulowanych. Paralegal i compliance częściowo tak.

**Najbliższe obszary:** Marketing i komunikacja (0.52), Sprzedaż i rozwój biznesu (0.37), Finanse i księgowość (0.36)

---

### 8. Służby mundurowe i bezpieczeństwo

**Zainteresowania (A1):** Ciało, ruch, teren (3), Prowadzenie ludzi (2), Wspólnota i służba (2), Naprawa i mechanika (1), Precyzja i kontrola (1)

**Kompetencje (A2):** Opanowanie pod presją (3), Wytrzymałość fizyczna (3), Praca z regułami i przepisami (2), Prowadzenie grupy (2), Rozbrajanie napięć (2), Dokładność (1)

**Wartości zaspokajane (A4):** Stabilność, Sens i pomaganie, Relacje, Zgodność z zasadami  
**W konflikcie z:** Wolność

**Wymagania (A5):** odpowiedzialność za bezpieczeństwo **0.90**, zmiany i noce **0.90**, praca w weekendy **0.85**, dyżury **0.85**, praca fizyczna **0.80**, każda pogoda **0.75**, egzaminy zawodowe **0.70**, krew i cierpienie **0.65**, przeprowadzka **0.60**

**Typowy kształt życia (M1):** praca przenika życie, osiadłość, duża organizacja, szybkie wejście

**Środowisko, które oferuje (A3):** jasne oczekiwania, wyraźna struktura, silny zespół

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | pracownik ochrony | 0–1 rok | nie |
| średnie | policjant, strażak, ratownik | 1–3 lata | nie, szkoła służbowa |
| długie | oficer, specjalista służby | 5+ lat | częściowo |

**Co może przeszkadzać:** praca zmianowa, sztywna hierarchia, kontakt z ludzkim nieszczęściem

**Przykładowe zawody:** policjant, strażak, ratownik, żołnierz zawodowy, funkcjonariusz służby więziennej, specjalista BHP, pracownik ochrony

**Kierunki studiów:** szkoły służb, bezpieczeństwo wewnętrzne, kryminologia

**Droga bez studiów:** Tak. Większość dróg zaczyna się od szkoły służbowej, nie od uczelni.

**Najbliższe obszary:** Sport i aktywność fizyczna (0.53), Gastronomia i hotelarstwo (0.36), Rolnictwo, przyroda i zwierzęta (0.32)

---

## GRUPA: TECHNOLOGIA I NAUKA

### 9. Technologia i oprogramowanie

**Zainteresowania (A1):** Technologia i programowanie (3), Liczby, dane, wzorce (2), Nauka i eksperyment (1), Porządkowanie i systematyzowanie (1)

**Kompetencje (A2):** Rozwiązywanie problemów (3), Szybkie uczenie się nowego (3), Myślenie systemowe (3), Dokładność (2), Samodzielność bez nadzoru (2), Analiza informacji (1)

**Wartości zaspokajane (A4):** Rozwój, Pieniądze, Wolność, Mistrzostwo  
**W konflikcie z:** Relacje

**Wymagania (A5):** komputer cały dzień **0.95**, dokształcanie przez całe życie **0.95**, samotność **0.55**, studia w ogóle **0.40**

**Typowy kształt życia (M1):** możliwa zdalna, szybkie wejście, mały zespół lub własne

**Środowisko, które oferuje (A3):** cisza i skupienie, brak kontroli nad głową, duża samodzielność, możliwość pracy zdalnej

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | tester, wsparcie techniczne | 0–1 rok | nie |
| średnie | programista, administrator | 1–3 lata | nie |
| długie | architekt systemów, specjalista bezpieczeństwa | 6+ lat | częściowo |

**Co może przeszkadzać:** ciągła nauka bez końca, mało ruchu, efekt pracy niewidoczny dla otoczenia

**Przykładowe zawody:** programista, tester oprogramowania, administrator systemów, devops, specjalista cyberbezpieczeństwa, wsparcie techniczne, projektant baz danych

**Kierunki studiów:** informatyka, informatyka stosowana, teleinformatyka

**Droga bez studiów:** Tak, i to jest jeden z najbardziej otwartych obszarów w całej bazie.

**Najbliższe obszary:** Analiza danych (0.79), Nauka i badania (0.70), Inżynieria i produkcja (0.50)

**Wariant na własny rachunek:** realny.

---

### 10. Inżynieria i produkcja

**Zainteresowania (A1):** Naprawa i mechanika (2), Budowanie i wytwarzanie (2), Technologia i programowanie (2), Nauka i eksperyment (2), Precyzja i kontrola (2), Planowanie i logistyka (1)

**Kompetencje (A2):** Rozwiązywanie problemów (3), Wyobraźnia przestrzenna (3), Myślenie systemowe (2), Obsługa sprzętu i techniki (2), Dokładność (2), Organizowanie i planowanie (2)

**Wartości zaspokajane (A4):** Mistrzostwo, Stabilność, Pieniądze  
**W konflikcie z:** Zmienność

**Wymagania (A5):** studia w ogóle **0.85**, komputer cały dzień **0.60**, odpowiedzialność za bezpieczeństwo **0.60**, egzaminy zawodowe **0.55**, praca fizyczna **0.50**, stanie cały dzień **0.50**, zmiany i noce **0.45**

**Typowy kształt życia (M1):** osiadłość, duża organizacja, długa inwestycja w naukę

**Środowisko, które oferuje (A3):** czas na dokładność, wyraźna struktura, widoczny efekt pracy

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | technik, operator maszyn | 0–1 rok | nie, technikum |
| średnie | inżynier | 5 lat | tak |
| długie | konstruktor, kierownik utrzymania ruchu | 8+ lat | tak + uprawnienia |

**Co może przeszkadzać:** odpowiedzialność za bezpieczeństwo, procedury i normy, wolne tempo zmian

**Przykładowe zawody:** inżynier mechanik, inżynier elektryk, technolog produkcji, automatyk, konstruktor, inżynier jakości, kierownik utrzymania ruchu

**Kierunki studiów:** mechanika i budowa maszyn, automatyka i robotyka, elektrotechnika, mechatronika

**Droga bez studiów:** Technikum otwiera role techniczne, ale inżynierskie wymagają dyplomu.

**Najbliższe obszary:** Rzemiosło i usługi techniczne (0.61), Budownictwo i architektura (0.53), Technologia i oprogramowanie (0.50)

---

### 11. Nauka i badania

**Zainteresowania (A1):** Nauka i eksperyment (3), Liczby, dane, wzorce (2), Zdrowie i ciało człowieka (1), Technologia i programowanie (1), Precyzja i kontrola (1)

**Kompetencje (A2):** Myślenie systemowe (3), Analiza informacji (3), Szybkie uczenie się nowego (3), Wytrwałość w powtarzalnym (3), Dokładność (2), Samodzielność bez nadzoru (2)

**Wartości zaspokajane (A4):** Rozwój, Mistrzostwo, Zgodność z zasadami, Wolność  
**W konflikcie z:** Pieniądze, Stabilność

**Wymagania (A5):** 5+ lat studiów **0.95**, studia w ogóle **0.95**, dokształcanie przez całe życie **0.95**, komputer cały dzień **0.80**, niepewny dochód **0.70**, nauka po godzinach **0.70**, zagranica **0.65**

**Typowy kształt życia (M1):** długa inwestycja w naukę, praca w centrum życia, wystarczy wygodnie

**Środowisko, które oferuje (A3):** skupienie na jednym obszarze, duża samodzielność, cisza, czas na dokładność

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| średnie | technik laboratoryjny, specjalista R&D | 3–5 lat | tak |
| długie | pracownik naukowy | 9–11 lat | tak + doktorat |

**Co może przeszkadzać:** długa droga i niepewne zatrudnienie, niskie zarobki przez lata, efekt pracy widoczny po latach

**Przykładowe zawody:** pracownik naukowy, badacz w laboratorium, specjalista R&D, biotechnolog, chemik analityk, fizyk medyczny

**Kierunki studiów:** kierunki ścisłe i przyrodnicze + doktorat

**Droga bez studiów:** Nie. To obszar, w którym droga formalna jest jedyna.

**Najbliższe obszary:** Analiza danych (0.76), Technologia i oprogramowanie (0.70), Finanse i księgowość (0.42)

---

## GRUPA: RĘCE, TEREN I USŁUGI

### 12. Budownictwo i architektura

**Zainteresowania (A1):** Budowanie i wytwarzanie (3), Obraz i design (2), Planowanie i logistyka (2), Precyzja i kontrola (1), Ciało, ruch, teren (1)

**Kompetencje (A2):** Wyobraźnia przestrzenna (3), Organizowanie i planowanie (2), Wyczucie formy i estetyki (2), Dokładność (2), Praca z regułami i przepisami (2), Sprawność manualna (1)

**Wartości zaspokajane (A4):** Mistrzostwo, Pieniądze, Uznanie  
**W konflikcie z:** Czas dla siebie

**Wymagania (A5):** egzaminy zawodowe **0.80**, każda pogoda **0.70**, stanie cały dzień **0.70**, odpowiedzialność za bezpieczeństwo **0.70**, studia w ogóle **0.70**, nadgodziny **0.60**, wyjazdy służbowe **0.55**

**Typowy kształt życia (M1):** osiadłość, długa inwestycja w naukę, duża organizacja

**Środowisko, które oferuje (A3):** widoczny, trwały efekt pracy, czas na dokładność, praca zespołowa

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | technik budowlany | 0–1 rok | nie, technikum |
| średnie | inżynier budownictwa | 4–5 lat | tak |
| długie | kierownik budowy, architekt z uprawnieniami | 8–10 lat | tak + uprawnienia |

**Co może przeszkadzać:** odpowiedzialność prawna, praca w terenie w każdą pogodę, długie uprawnienia

**Przykładowe zawody:** architekt, inżynier budownictwa, kierownik budowy, kosztorysant, projektant instalacji, inspektor nadzoru, geodeta

**Kierunki studiów:** architektura, budownictwo, inżynieria środowiska, geodezja

**Droga bez studiów:** Technikum budowlane daje role wykonawcze; projektowe wymagają uprawnień.

**Najbliższe obszary:** Inżynieria i produkcja (0.53), Projektowanie i sztuki wizualne (0.53), Transport i logistyka (0.47)

---

### 13. Rzemiosło i usługi techniczne

**Zainteresowania (A1):** Naprawa i mechanika (3), Budowanie i wytwarzanie (3), Precyzja i kontrola (2)

**Kompetencje (A2):** Sprawność manualna (3), Obsługa sprzętu i techniki (3), Rozwiązywanie problemów (2), Dokładność (2), Samodzielność bez nadzoru (2), Wytrwałość w powtarzalnym (2)

**Wartości zaspokajane (A4):** Wolność, Mistrzostwo, Stabilność  
**W konflikcie z:** Uznanie

**Wymagania (A5):** stanie cały dzień **0.85**, praca fizyczna **0.80**, brud i zapachy **0.70**, własna działalność **0.60**, niskie zarobki na starcie **0.55**, każda pogoda **0.50**, studia w ogóle **0.10**

**Typowy kształt życia (M1):** szybkie wejście, mały zespół lub własne, praca stacjonarna

**Środowisko, które oferuje (A3):** duża samodzielność, widoczny efekt pracy, brak sztywnych procedur

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | pomocnik, uczeń zawodu | 1–2 lata | nie |
| średnie | samodzielny fachowiec | 3–5 lat | nie |
| długie | mistrz, własny warsztat | 6+ lat | nie |

**Co może przeszkadzać:** obciążenie ciała, dochód zależny od zleceń, mniejszy prestiż społeczny

**Przykładowe zawody:** elektryk, hydraulik, stolarz, mechanik samochodowy, spawacz, tapicer, technik serwisu, krawiec

**Kierunki studiów:** nie są potrzebne

**Droga bez studiów:** Tak. Szkoła branżowa plus praktyka to pełnoprawna, szybka droga do zawodu.

**Najbliższe obszary:** Inżynieria i produkcja (0.61), Budownictwo i architektura (0.39), Rolnictwo, przyroda i zwierzęta (0.34)

**Wariant na własny rachunek:** realny.

---

### 14. Transport i logistyka

**Zainteresowania (A1):** Planowanie i logistyka (3), Ciało, ruch, teren (2), Porządkowanie i systematyzowanie (2), Naprawa i mechanika (1)

**Kompetencje (A2):** Organizowanie i planowanie (3), Prowadzenie wielu spraw naraz (3), Opanowanie pod presją (2), Wyobraźnia przestrzenna (2), Obsługa sprzętu i techniki (1), Dokładność (1)

**Wartości zaspokajane (A4):** Stabilność, Pieniądze, Wolność  
**W konflikcie z:** Czas dla siebie

**Wymagania (A5):** zmiany i noce **0.80**, stała presja **0.80**, praca w weekendy **0.70**, wyjazdy służbowe **0.65**, nieregularne godziny **0.65**, komputer cały dzień **0.60**, życie daleko od rodziny **0.55**

**Typowy kształt życia (M1):** praca przenika życie, dużo godzin, szybkie wejście

**Środowisko, które oferuje (A3):** szybkie tempo, wiele spraw naraz, widoczny efekt

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | magazynier, kierowca po kursie | 0–1 rok | nie |
| średnie | spedytor, dyspozytor | 2–4 lata | nie |
| długie | kierownik logistyki | 6+ lat | częściowo |

**Co może przeszkadzać:** praca zmianowa, presja terminów, odpowiedzialność za straty

**Przykładowe zawody:** specjalista ds. logistyki, spedytor, kierownik magazynu, planista transportu, kierowca zawodowy, dyspozytor, specjalista ds. łańcucha dostaw

**Kierunki studiów:** logistyka, transport, zarządzanie łańcuchem dostaw

**Droga bez studiów:** Tak, w większości ról. Kurs i uprawnienia liczą się bardziej niż dyplom.

**Najbliższe obszary:** Administracja, procesy i obsługa (0.61), Gastronomia i hotelarstwo (0.60), Biznes, strategia i zarządzanie (0.50)

---

### 15. Rolnictwo, przyroda i zwierzęta

**Zainteresowania (A1):** Przyroda, zwierzęta, rośliny (3), Ciało, ruch, teren (2), Budowanie i wytwarzanie (1), Nauka i eksperyment (1)

**Kompetencje (A2):** Wytrzymałość fizyczna (3), Wytrwałość w powtarzalnym (3), Obsługa sprzętu i techniki (2), Cierpliwość i opiekuńczość (2), Samodzielność bez nadzoru (2), Organizowanie i planowanie (1)

**Wartości zaspokajane (A4):** Wolność, Zgodność z zasadami, Sens i pomaganie, Stabilność  
**W konflikcie z:** Uznanie

**Wymagania (A5):** każda pogoda **0.95**, praca fizyczna **0.85**, brud i zapachy **0.85**, praca w weekendy **0.80**, jedno miejsce przez lata **0.65**, niepewny dochód **0.60**, własna działalność **0.55**

**Typowy kształt życia (M1):** osiadłość, praca stacjonarna, wystarczy wygodnie, praca przenika życie

**Środowisko, które oferuje (A3):** duża samodzielność, praca w cyklu i rytmie, spokojne otoczenie

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | pracownik gospodarstwa, ogrodnik | 0–1 rok | nie |
| średnie | technik weterynarii, agronom, leśnik | 3–5 lat | częściowo |
| długie | weterynarz | 6 lat | tak |

**Co może przeszkadzać:** zależność od pogody i sezonu, trudno o urlop, obciążenie fizyczne

**Przykładowe zawody:** weterynarz, technik weterynarii, agronom, leśnik, ogrodnik, hodowca, specjalista ochrony środowiska, behawiorysta zwierząt

**Kierunki studiów:** weterynaria, rolnictwo, leśnictwo, ochrona środowiska, zootechnika

**Droga bez studiów:** Zależy od roli. Weterynarz wymaga studiów, wiele pozostałych nie.

**Najbliższe obszary:** Sport i aktywność fizyczna (0.38), Rzemiosło i usługi techniczne (0.34), Zdrowie, rehabilitacja i ciało (0.34)

**Wariant na własny rachunek:** realny.

---

### 26. Gastronomia i hotelarstwo

**Zainteresowania (A1):** Budowanie i wytwarzanie (2), Planowanie i logistyka (2), Opieka i troska (1), Ciało, ruch, teren (1), Precyzja i kontrola (1)

**Kompetencje (A2):** Opanowanie pod presją (3), Uprzejmość pod presją (3), Prowadzenie wielu spraw naraz (3), Sprawność manualna (2), Wytrzymałość fizyczna (2), Organizowanie i planowanie (2)

**Wartości zaspokajane (A4):** Relacje, Zmienność, Wolność, Mistrzostwo  
**W konflikcie z:** Czas dla siebie

**Wymagania (A5):** praca w weekendy **0.95**, zmiany i noce **0.90**, stanie cały dzień **0.90**, roszczeniowi klienci **0.85**, ciągły kontakt z ludźmi **0.85**, stała presja **0.85**, niskie zarobki na starcie **0.70**, brud i zapachy **0.60**, studia w ogóle **0.15**

**Typowy kształt życia (M1):** szybkie wejście, praca przenika życie, mały zespół lub własne, dużo godzin

**Środowisko, które oferuje (A3):** szybkie tempo, silny zespół, natychmiastowy efekt pracy

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | kelner, pomoc kuchenna | 0 lat | nie |
| średnie | kucharz, barista, cukiernik | 2–3 lata | nie |
| długie | szef kuchni, menedżer lokalu | 6+ lat | nie |

**Co może przeszkadzać:** praca w weekendy i święta, obciążenie fizyczne, wysoka rotacja

**Przykładowe zawody:** kucharz, cukiernik, szef kuchni, barista, kelner, menedżer restauracji, recepcjonista hotelowy, sommelier

**Kierunki studiów:** technologia żywności, hotelarstwo, zarządzanie

**Droga bez studiów:** Tak. Szkoła branżowa i praktyka to główna droga.

**Najbliższe obszary:** Transport i logistyka (0.60), Administracja, procesy i obsługa (0.45), Budownictwo i architektura (0.44)

**Wariant na własny rachunek:** realny.

---

## GRUPA: ZDROWIE I CIAŁO

### 16. Medycyna i ratownictwo

**Zainteresowania (A1):** Zdrowie i ciało człowieka (3), Opieka i troska (2), Nauka i eksperyment (2), Ciało, ruch, teren (1)

**Kompetencje (A2):** Zapamiętywanie (3), Opanowanie pod presją (3), Dokładność (3), Analiza informacji (2), Cierpliwość i opiekuńczość (2), Sprawność manualna (2)

**Wartości zaspokajane (A4):** Sens i pomaganie, Uznanie, Stabilność, Mistrzostwo  
**W konflikcie z:** Czas dla siebie

**Wymagania (A5):** 5+ lat studiów **0.95**, studia w ogóle **0.95**, egzaminy zawodowe **0.95**, dokształcanie przez całe życie **0.95**, krew i cierpienie **0.95**, odpowiedzialność za bezpieczeństwo **0.95**, zmiany i noce **0.90**, dyżury **0.90**, chorzy i starsi **0.90**, ciągły kontakt z ludźmi **0.90**, praca w weekendy **0.85**

**Typowy kształt życia (M1):** długa inwestycja w naukę, praca w centrum życia, dużo godzin, praca przenika życie

**Środowisko, które oferuje (A3):** czas na dokładność, silny zespół, jasne procedury

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | opiekun medyczny, technik | 1–2 lata | nie |
| średnie | ratownik medyczny, pielęgniarka, położna | 3–5 lat | tak, licencjat |
| długie | lekarz | 11+ lat | tak + staż + specjalizacja |

**Co może przeszkadzać:** bardzo długa droga, dyżury i noce, kontakt ze śmiercią i cierpieniem

**Przykładowe zawody:** lekarz, pielęgniarka, ratownik medyczny, położna, farmaceuta, diagnosta laboratoryjny, technik radiolog

**Kierunki studiów:** kierunek lekarski, pielęgniarstwo, ratownictwo medyczne, farmacja, analityka medyczna

**Droga bez studiów:** Nie. Cały obszar jest regulowany.

**Najbliższe obszary:** Zdrowie, rehabilitacja i ciało (0.60), Nauka i badania (0.38), Psychologia i wsparcie (0.36)

---

### 17. Zdrowie, rehabilitacja i ciało

**Zainteresowania (A1):** Zdrowie i ciało człowieka (3), Opieka i troska (2), Ciało, ruch, teren (2), Nauczanie i tłumaczenie (1)

**Kompetencje (A2):** Cierpliwość i opiekuńczość (3), Sprawność manualna (2), Wyjaśnianie i uczenie innych (2), Wyczuwanie ludzi (2), Wytrzymałość fizyczna (2), Zapamiętywanie (1)

**Wartości zaspokajane (A4):** Sens i pomaganie, Relacje, Wolność, Mistrzostwo  
**W konflikcie z:** Pieniądze

**Wymagania (A5):** ciągły kontakt z ludźmi **0.90**, stanie cały dzień **0.85**, studia w ogóle **0.85**, chorzy i starsi **0.75**, dokształcanie przez całe życie **0.75**, praca fizyczna **0.60**, własna działalność **0.50**

**Typowy kształt życia (M1):** mały zespół lub własne, praca stacjonarna, mniej godzin

**Środowisko, które oferuje (A3):** stały kontakt z ludźmi, możliwość pracy na swoim, widoczny efekt

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | masażysta po kursie | 1 rok | nie |
| średnie | dietetyk, terapeuta zajęciowy | 3–5 lat | tak |
| długie | fizjoterapeuta z pełnymi uprawnieniami | 5–6 lat | tak |

**Co może przeszkadzać:** obciążenie ciała, powolne efekty u pacjentów, zarobki poniżej oczekiwań

**Przykładowe zawody:** fizjoterapeuta, masażysta, dietetyk, terapeuta zajęciowy, optyk, protetyk słuchu, podolog

**Kierunki studiów:** fizjoterapia, dietetyka, terapia zajęciowa, zdrowie publiczne

**Droga bez studiów:** Częściowo. Masaż i dietetyka mają drogi kursowe, fizjoterapia nie.

**Najbliższe obszary:** Sport i aktywność fizyczna (0.72), Medycyna i ratownictwo (0.60), Psychologia i wsparcie (0.52)

**Wariant na własny rachunek:** realny.

---

### 18. Sport i aktywność fizyczna

**Zainteresowania (A1):** Ciało, ruch, teren (3), Nauczanie i tłumaczenie (2), Zdrowie i ciało człowieka (2), Prowadzenie ludzi (1)

**Kompetencje (A2):** Wytrzymałość fizyczna (3), Wyjaśnianie i uczenie innych (2), Prowadzenie grupy (2), Wyczuwanie ludzi (2), Odporność na odmowę i porażkę (2), Cierpliwość i opiekuńczość (1)

**Wartości zaspokajane (A4):** Wolność, Relacje, Sens i pomaganie, Zmienność  
**W konflikcie z:** Stabilność

**Wymagania (A5):** stanie cały dzień **0.90**, ciągły kontakt z ludźmi **0.85**, praca fizyczna **0.80**, praca w weekendy **0.80**, nieregularne godziny **0.80**, niepewny dochód **0.70**, własna działalność **0.60**

**Typowy kształt życia (M1):** praca przenika życie, mały zespół lub własne, wystarczy wygodnie, szybkie wejście

**Środowisko, które oferuje (A3):** dużo ruchu, stały kontakt z ludźmi, zmienne zadania

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | instruktor po kursie | 0–1 rok | nie |
| średnie | trener personalny z własnymi klientami | 2–4 lata | nie |
| długie | nauczyciel WF, trener kadry | 5+ lat | tak w szkolnictwie |

**Co może przeszkadzać:** dochód zależny od klientów, praca w godzinach wolnych innych, krótka kariera zawodnicza

**Przykładowe zawody:** trener personalny, trener drużyny, nauczyciel wychowania fizycznego, instruktor, menedżer obiektu sportowego, przygotowanie motoryczne

**Kierunki studiów:** wychowanie fizyczne, sport, fizjoterapia

**Droga bez studiów:** Tak, poza szkolnictwem. Uprawnienia instruktorskie wystarczą.

**Najbliższe obszary:** Zdrowie, rehabilitacja i ciało (0.72), Służby mundurowe i bezpieczeństwo (0.53), Edukacja i szkolenia (0.39)

**Wariant na własny rachunek:** realny.

---

## GRUPA: LUDZIE I WSPARCIE

### 19. Opieka i praca socjalna

**Zainteresowania (A1):** Opieka i troska (3), Rozmowa i wsparcie (2), Wspólnota i służba (2), Nauczanie i tłumaczenie (1)

**Kompetencje (A2):** Cierpliwość i opiekuńczość (3), Wyczuwanie ludzi (3), Rozbrajanie napięć (2), Uprzejmość pod presją (2), Wytrwałość w powtarzalnym (2), Praca z regułami i przepisami (1)

**Wartości zaspokajane (A4):** Sens i pomaganie, Zgodność z zasadami, Relacje  
**W konflikcie z:** Pieniądze, Uznanie

**Wymagania (A5):** chorzy i starsi **0.90**, ciągły kontakt z ludźmi **0.90**, niskie zarobki na starcie **0.75**, studia w ogóle **0.70**, małe dzieci **0.60**, praca w weekendy **0.60**, zmiany i noce **0.60**

**Typowy kształt życia (M1):** wystarczy wygodnie, praca jako część życia, mniej godzin

**Środowisko, które oferuje (A3):** stały kontakt z ludźmi, spokojna atmosfera, widoczny sens pracy

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | opiekun po kursie | 0–1 rok | nie |
| średnie | pracownik socjalny | 3–4 lata | tak |
| długie | koordynator, kierownik placówki | 6+ lat | tak |

**Co może przeszkadzać:** ryzyko wypalenia, niskie zarobki, obciążenie emocjonalne

**Przykładowe zawody:** pracownik socjalny, opiekun osoby starszej, asystent osoby z niepełnosprawnością, opiekun w domu pomocy, koordynator rodzinnej pieczy zastępczej, opiekun w żłobku

**Kierunki studiów:** praca socjalna, pedagogika specjalna, pedagogika

**Droga bez studiów:** Częściowo. Opiekun wymaga kursu, pracownik socjalny studiów.

**Najbliższe obszary:** Psychologia i wsparcie (0.72), Wspólnota, organizacje i posługa (0.58), Edukacja i szkolenia (0.49)

---

### 20. Psychologia i wsparcie

**Zainteresowania (A1):** Rozmowa i wsparcie (3), Opieka i troska (2), Zdrowie i ciało człowieka (1), Nauczanie i tłumaczenie (1), Nauka i eksperyment (1)

**Kompetencje (A2):** Wyczuwanie ludzi (3), Rozbrajanie napięć (3), Wyjaśnianie i uczenie innych (2), Cierpliwość i opiekuńczość (2), Analiza informacji (2), Wyrażanie się słowem (1)

**Wartości zaspokajane (A4):** Sens i pomaganie, Mistrzostwo, Wolność, Zgodność z zasadami  
**W konflikcie z:** Pieniądze

**Wymagania (A5):** studia w ogóle **0.95**, dokształcanie przez całe życie **0.95**, 5+ lat studiów **0.85**, ciągły kontakt z ludźmi **0.85**, egzaminy zawodowe **0.80**, nauka po godzinach **0.80**

**Typowy kształt życia (M1):** długa inwestycja w naukę, mały zespół lub własne, mniej godzin

**Środowisko, które oferuje (A3):** cisza, skupienie na jednej osobie, duża samodzielność

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| średnie | doradca zawodowy, coach | 3–5 lat | częściowo |
| długie | psycholog | 5 lat | tak |
| bardzo długie | psychoterapeuta | 9–10 lat | tak + szkoła terapii |

**Co może przeszkadzać:** długa i kosztowna droga do samodzielności, obciążenie emocjonalne, dochód niepewny na starcie

**Przykładowe zawody:** psycholog, psychoterapeuta, doradca zawodowy, coach, interwent kryzysowy, psycholog szkolny, specjalista HR ds. rozwoju

**Kierunki studiów:** psychologia (jednolite magisterskie), pedagogika, socjologia

**Droga bez studiów:** Nie w zawodach chronionych. Coaching i doradztwo częściowo tak.

**Najbliższe obszary:** Opieka i praca socjalna (0.72), Edukacja i szkolenia (0.54), Zdrowie, rehabilitacja i ciało (0.52)

**Wariant na własny rachunek:** realny.

---

### 21. Edukacja i szkolenia

**Zainteresowania (A1):** Nauczanie i tłumaczenie (3), Rozmowa i wsparcie (2), Wspólnota i służba (1), Słowo i pisanie (1)

**Kompetencje (A2):** Wyjaśnianie i uczenie innych (3), Wystąpienia przed grupą (3), Cierpliwość i opiekuńczość (2), Organizowanie i planowanie (2), Wyczuwanie ludzi (2), Wytrwałość w powtarzalnym (1)

**Wartości zaspokajane (A4):** Sens i pomaganie, Czas dla siebie, Stabilność, Relacje  
**W konflikcie z:** Pieniądze

**Wymagania (A5):** ciągły kontakt z ludźmi **0.95**, studia w ogóle **0.90**, wystąpienia **0.85**, dokształcanie przez całe życie **0.80**, małe dzieci **0.75**, nauka po godzinach **0.60**

**Typowy kształt życia (M1):** mniej godzin, osiadłość, wyraźna granica, duża organizacja

**Środowisko, które oferuje (A3):** stały kontakt z ludźmi, powtarzalny rytm roku, widoczny efekt u ludzi

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | lektor, korepetytor, instruktor | 0–2 lata | nie |
| średnie | trener biznesu | 3–5 lat | częściowo |
| długie | nauczyciel w szkole | 5 lat | tak + przygotowanie pedagogiczne |

**Co może przeszkadzać:** praca z grupą przez cały dzień, niskie zarobki, dokumentacja

**Przykładowe zawody:** nauczyciel, wychowawca, trener biznesu, lektor języka, instruktor, metodyk, edukator

**Kierunki studiów:** kierunek przedmiotowy + przygotowanie pedagogiczne, pedagogika, filologia

**Droga bez studiów:** Nie w szkole. Szkolenia biznesowe i korepetycje tak.

**Najbliższe obszary:** Psychologia i wsparcie (0.54), Opieka i praca socjalna (0.49), Wspólnota, organizacje i posługa (0.49)

**Wariant na własny rachunek:** realny.

---

### 22. Wspólnota, organizacje i posługa

**Zainteresowania (A1):** Wspólnota i służba (3), Rozmowa i wsparcie (2), Opieka i troska (2), Sprzedaż i przekonywanie (1), Planowanie i logistyka (1)

**Kompetencje (A2):** Prowadzenie grupy (2), Wyczuwanie ludzi (2), Organizowanie i planowanie (2), Wystąpienia przed grupą (2), Przekonywanie (1), Odporność na odmowę i porażkę (1)

**Wartości zaspokajane (A4):** Sens i pomaganie, Zgodność z zasadami, Relacje, Wolność  
**W konflikcie z:** Pieniądze, Stabilność

**Wymagania (A5):** ciągły kontakt z ludźmi **0.90**, niskie zarobki na starcie **0.85**, praca w weekendy **0.80**, nieregularne godziny **0.80**, niepewny dochód **0.70**, wystąpienia **0.70**, wyjazdy służbowe **0.55**

**Typowy kształt życia (M1):** praca w centrum życia, wystarczy wygodnie, praca przenika życie

**Środowisko, które oferuje (A3):** widoczny sens pracy, duża samodzielność, silna wspólnota

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | wolontariusz, potem koordynator | 1–2 lata | nie |
| średnie | koordynator projektów, fundraiser | 3–5 lat | częściowo |
| długie | dyrektor organizacji, duszpasterz | 6+ lat | zależy od roli |

**Co może przeszkadzać:** niepewne finansowanie, praca w weekendy, trudno o granicę między pracą a życiem

**Przykładowe zawody:** koordynator projektów w NGO, fundraiser, animator społeczny, pracownik organizacji pomocowej, duszpasterz, misjonarz, koordynator wolontariatu, organizator wydarzeń wspólnotowych

**Kierunki studiów:** teologia, praca socjalna, socjologia, zarządzanie w NGO, dowolny kierunek

**Droga bez studiów:** W dużej części tak. Doświadczenie i zaangażowanie liczą się bardziej.

**Najbliższe obszary:** Opieka i praca socjalna (0.58), Edukacja i szkolenia (0.49), Psychologia i wsparcie (0.42)

**Wariant na własny rachunek:** realny.

---

## GRUPA: TWORZENIE

### 23. Projektowanie i sztuki wizualne

**Zainteresowania (A1):** Obraz i design (3), Słowo i pisanie (1), Budowanie i wytwarzanie (1), Scena, film, występ (1)

**Kompetencje (A2):** Wyczucie formy i estetyki (3), Wymyślanie nowych rozwiązań (3), Wyobraźnia przestrzenna (2), Odporność na odmowę i porażkę (2), Samodzielność bez nadzoru (2), Dokładność (1)

**Wartości zaspokajane (A4):** Wolność, Mistrzostwo, Rozwój, Uznanie  
**W konflikcie z:** Stabilność

**Wymagania (A5):** komputer cały dzień **0.90**, niepewny dochód **0.70**, niskie zarobki na starcie **0.65**, własna działalność **0.60**, studia w ogóle **0.35**

**Typowy kształt życia (M1):** możliwa zdalna, mały zespół lub własne, szybkie wejście

**Środowisko, które oferuje (A3):** przestrzeń na własne pomysły, duża samodzielność, cisza i skupienie

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | junior grafik z portfolio | 1–2 lata | nie |
| średnie | projektant UX, grafik | 3–5 lat | nie |
| długie | art director | 7+ lat | częściowo |

**Co może przeszkadzać:** praca oceniana subiektywnie, niepewny dochód na starcie, dużo poprawek

**Przykładowe zawody:** grafik, projektant UX/UI, ilustrator, projektant wnętrz, fotograf, projektant produktu, art director

**Kierunki studiów:** grafika, wzornictwo, architektura wnętrz, ASP

**Droga bez studiów:** Tak. Portfolio waży tu więcej niż dyplom.

**Najbliższe obszary:** Media, film i treści (0.68), Budownictwo i architektura (0.53), Marketing i komunikacja (0.46)

**Wariant na własny rachunek:** realny.

---

### 24. Media, film i treści

**Zainteresowania (A1):** Scena, film, występ (3), Słowo i pisanie (2), Obraz i design (2), Sprzedaż i przekonywanie (1)

**Kompetencje (A2):** Wymyślanie nowych rozwiązań (3), Wyrażanie się słowem (2), Wyczucie formy i estetyki (2), Prowadzenie wielu spraw naraz (2), Opanowanie pod presją (2), Odporność na odmowę i porażkę (2)

**Wartości zaspokajane (A4):** Zmienność, Uznanie, Wolność, Rozwój  
**W konflikcie z:** Stabilność

**Wymagania (A5):** nieregularne godziny **0.85**, nadgodziny **0.80**, stała presja **0.80**, niepewny dochód **0.75**, komputer cały dzień **0.70**, wyjazdy służbowe **0.60**, wystąpienia **0.60**

**Typowy kształt życia (M1):** praca przenika życie, praca w centrum życia, wystarczy wygodnie, widoczność

**Środowisko, które oferuje (A3):** szybkie tempo, zmienne zadania, praca zespołowa, widoczny efekt

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | asystent produkcji, twórca treści | 0–1 rok | nie |
| średnie | montażysta, dziennikarz, operator | 2–4 lata | częściowo |
| długie | producent, redaktor prowadzący | 6+ lat | częściowo |

**Co może przeszkadzać:** nieregularne godziny, niestabilne zatrudnienie, praca pod ciągłą presją czasu

**Przykładowe zawody:** dziennikarz, montażysta, operator kamery, producent, realizator, twórca internetowy, scenarzysta, redaktor

**Kierunki studiów:** dziennikarstwo, reżyseria, montaż, kulturoznawstwo, dowolny + praktyka

**Droga bez studiów:** Tak. To obszar, w którym dorobek zastępuje dyplom najszybciej.

**Najbliższe obszary:** Projektowanie i sztuki wizualne (0.68), Marketing i komunikacja (0.65), Muzyka i sztuki sceniczne (0.48)

**Wariant na własny rachunek:** realny.

---

### 25. Muzyka i sztuki sceniczne

**Zainteresowania (A1):** Dźwięk i muzyka (3), Scena, film, występ (3), Obraz i design (1)

**Kompetencje (A2):** Wytrwałość w powtarzalnym (3), Wystąpienia przed grupą (3), Odporność na odmowę i porażkę (3), Sprawność manualna (2), Wymyślanie nowych rozwiązań (2), Szybkie uczenie się nowego (1)

**Wartości zaspokajane (A4):** Mistrzostwo, Wolność, Uznanie, Zgodność z zasadami  
**W konflikcie z:** Stabilność, Pieniądze

**Wymagania (A5):** nieregularne godziny **0.90**, praca w weekendy **0.90**, niepewny dochód **0.90**, wystąpienia **0.90**, niskie zarobki na starcie **0.85**, nauka po godzinach **0.85**, wyjazdy służbowe **0.70**

**Typowy kształt życia (M1):** wystarczy wygodnie, praca w centrum życia, mobilność, widoczność

**Środowisko, które oferuje (A3):** duża samodzielność, skupienie na jednej rzeczy, przestrzeń na własne pomysły

**Poziomy wejścia:**

| Poziom | Przykład | Czas do samodzielnej pracy | Studia |
|---|---|---|---|
| szybkie | nauczanie prywatne, gra na zleceniach | 2–4 lata | nie |
| średnie | realizator dźwięku, instruktor | 2–4 lata | nie |
| długie | muzyk zawodowy, aktor | 8+ lat | zwykle tak |

**Co może przeszkadzać:** bardzo niepewny dochód, lata ćwiczeń przed pierwszym efektem, ciągła ocena

**Przykładowe zawody:** muzyk, nauczyciel muzyki, realizator dźwięku, aktor, instruktor teatralny, kompozytor, tancerz

**Kierunki studiów:** akademia muzyczna, szkoła teatralna, realizacja dźwięku, edukacja artystyczna

**Droga bez studiów:** Częściowo. Wykonawstwo tak, nauczanie w szkolnictwie nie.

**Najbliższe obszary:** Media, film i treści (0.48), Projektowanie i sztuki wizualne (0.37), Edukacja i szkolenia (0.20)

**Wariant na własny rachunek:** realny.

---

# 8. MODEL DANYCH

```json
{
  "areas": [
    {
      "id": 16,
      "group": "ZDR",
      "name": "Medycyna i ratownictwo",
      "interests": {"7":3,"13":2,"6":2,"4":1},
      "competencies": {"7":3,"29":3,"22":3,"2":2,"17":2,"26":2},
      "values_served": ["SEN","UZN","STA","MIS"],
      "values_conflict": ["CZA"],
      "filters": {"F01":0.95,"F21":0.95,"F31":0.95,"F12":0.90},
      "life_shape": {"INW":"B","CEN":"A","GOD":"A","GRA":"A"},
      "environment": ["czas na dokladnosc","silny zespol"],
      "friction": ["bardzo dluga droga","dyzury i noce"],
      "entry_levels": [
        {"label":"szybkie","example":"opiekun medyczny, technik",
         "years":"1-2","studies":"nie",
         "filter_overrides":{"F01":0.0,"F02":0.2}},
        {"label":"srednie","example":"ratownik, pielegniarka",
         "years":"3-5","studies":"tak, licencjat",
         "filter_overrides":{"F01":0.3,"F02":0.9}},
        {"label":"dlugie","example":"lekarz","years":"11+",
         "studies":"tak + staz + specjalizacja","filter_overrides":{}}
      ],
      "self_employment_viable": false,
      "entrepreneurial_pairing": false,
      "occupations": ["lekarz","pielegniarka","ratownik medyczny"],
      "studies": ["kierunek lekarski","pielegniarstwo"],
      "without_studies": "Nie. Caly obszar jest regulowany."
    }
  ],
  "similarity": {"16": {"17": 0.61, "19": 0.44}}
}
```

**Pole `filter_overrides` jest kluczowe.** Wymagania zapisane na poziomie obszaru są uśrednione. Poziom wejścia nadpisuje te, które realnie się różnią — najczęściej `F01` i `F02`, czasem `F03`. Silnik przy filtrowaniu używa wartości poziomu, a przy braku nadpisania wartości obszaru.

**Pole `similarity` generuje się automatycznie** z `interests` i `competencies`. Nie należy go wpisywać ręcznie ani edytować.

---

# 9. CO NALEŻY DO SPECYFIKACJI SILNIKA, NIE TUTAJ

Ta baza celowo nie zawiera poniższych rzeczy. Wszystkie są decyzjami o tym, jak system liczy, nie o tym, czym są obszary.

| Element | Dlaczego nie tutaj |
|---|---|
| Wagi modułów przy składaniu wyniku | To decyzja o charakterze programu, nie o obszarach |
| Wzór kary filtrowej i sufit kary | Mechanika silnika |
| Próg weta | Mechanika silnika, choć baza dostarcza wagi |
| Progi pasm dopasowania | Sposób prezentacji |
| Reguły antydopasowania | Mechanika silnika |
| Sposób liczenia trybu przedsiębiorczego | Mechanika silnika; baza daje tylko listę obszarów |
| Wybór poziomu wejścia dla uczestnika | Mechanika silnika |

Reguła trzech dróg z sekcji 6 jest wyjątkiem — została opisana tutaj, bo bez macierzy sąsiedztwa nie da się jej sformułować, a macierz jest częścią bazy. Sam próg 0,45 może zostać przeniesiony do silnika i tam dostrojony.

---

# 10. CZY BAZA JEST KOMPLETNA

**Jako warstwa kategorii — tak.** 27 obszarów pokrywa pełne spektrum i nie powinno rosnąć. Trzy rzeczy pozostają do dobudowania i wszystkie dotyczą **głębokości**, nie liczby obszarów.

| Brakujący element | Waga | Uwagi |
|---|---|---|
| Warstwa zawodów z kartami | wysoka | 191 zawodów wymienionych, żaden nieopisany |
| Baza kierunków studiów z odwróconym mapowaniem | wysoka | *kierunek → do czego prowadzi*, nie odwrotnie |
| Realia rynku: widełki zarobków, dostępność, trend | średnia | starzeje się szybko; tylko pasma, odświeżane raz w roku |

**Świadomie pominięte:** dane o zarobkach z dokładnością do złotówki, prognozy zapotrzebowania, rankingi uczelni. Wszystko to dezaktualizuje się szybciej, niż fundacja będzie w stanie aktualizować, a raport z nieaktualnymi liczbami jest gorszy niż raport bez nich.

---

# 11. TESTY AKCEPTACYJNE

1. **Pokrycie.** Każdy z 24 obszarów A1, 30 kompetencji A2, 12 wartości A4 i 32 filtrów A5 występuje w co najmniej jednym obszarze zawodowym. *Zweryfikowane algorytmicznie.*
2. **Parowanie.** Obszar 27 nigdy nie pojawia się w raporcie bez przypisanej branży.
3. **Poziomy.** Każdy obszar ma co najmniej dwa poziomy wejścia.
4. **Nadpisania.** Poziom *szybkie wejście* ma `F01` nie wyższe niż wartość obszaru.
5. **Macierz.** Podobieństwo jest symetryczne, przekątna wyłączona, wartości w przedziale 0–1.
6. **Trzy drogi.** Dla dowolnego profilu trzy wygenerowane drogi mają wzajemne podobieństwo poniżej przyjętego progu albo różnią się poziomem wejścia.
7. **Regeneracja macierzy.** Zmiana profilu obszaru przelicza macierz automatycznie.

---

# 12. CO DALEJ

## Natychmiast

**Przegląd macierzy przez dwie osoby niezależnie.** To jedyny element systemu oparty w całości na osądzie eksperckim, bez danych. Dla każdego obszaru sprawdź trzy rzeczy: czy zainteresowania z wagą 3 to naprawdę rdzeń, czy nie brakuje kompetencji oczywistej dla ludzi z branży, czy **wymagania filtrowe powyżej 0,60 są prawdziwe**.

Ostatni punkt jest najważniejszy. Wszystko inne najwyżej przesuwa obszar w rankingu — wymaganie 0,60 i wyżej usuwa go całkowicie, jeśli uczestnik nałożył tam weto. Zawyżona jedna waga skreśla komuś cały obszar bez podstawy.

## Potem

1. **Karty zawodów.** 191 zawodów jest wymienionych. Każdy potrzebuje krótkiej karty i listy odchyleń od profilu obszaru. Na pilotaż wystarczy 60–70 opisanych porządnie, byle pokrywały wszystkie osiem grup.
2. **Baza kierunków studiów** z odwróconym mapowaniem. Model programu słusznie podkreśla, że kierunek to nie to samo co zawód i zależność nie jest jeden do jednego.
3. **Weryfikacja na sucho.** Weź trzy fikcyjne profile — wyraźnie rzemieślniczy, wyraźnie społeczny, wyraźnie analityczny — przelicz ręcznie i sprawdź, czy TOP 5 wygląda sensownie. Jeden wieczór pracy, wyłapie większość błędów w macierzy.
4. **Specyfikacja silnika dopasowania** — wszystko z sekcji 9.