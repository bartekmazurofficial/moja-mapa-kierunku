# Czego potrzebuję w grafice

Lista miejsc w aplikacji, w których jest przygotowane miejsce na obraz, plus
to, co dostaniesz w zamian. Wszystko jest dziś rysowane wektorem albo puste,
więc podmiana to jedna linijka na slot — nic nie trzeba przebudowywać.

**Dwa rodzaje plików.** Jedne mają własne tło i wchodzą jako kadr. Drugie muszą
być **na jednolitym tle do wycięcia** — trafiają na ciemny fiolet i każde
resztkowe tło zrobi widoczny prostokąt.

Tło aplikacji to `#0B0718` z fioletową poświatą. Akcent: `#A78BFA`.

---

# 1 · Priorytet pierwszy: bramy

**To jest znak rozpoznawczy całego produktu.** Dziś rysowany wektorem i widać,
że rysowany. Jeden porządny render podnosi wszystko naraz, bo wchodzi
w dziesięć miejsc.

| | |
|---|---|
| **Ile** | 1 plik, ewentualnie 3 warianty kadru |
| **Tło** | **przezroczyste** (PNG z alfą) albo czarne do wycięcia |
| **Proporcje** | 3:2, poziomo |
| **Rozmiar** | co najmniej **2048 × 1365 px** |
| **Treść** | trzy świetlne bramy, środkowa wyższa, trzy drogi wychodzące spod nich w stronę patrzącego |
| **Światło** | zimny fiolet i biel, poświata wokół łuków, drogi rozświetlone od bram ku dołowi |

**Dlaczego bez tła.** Wchodzi w prawy dolny róg dziesięciu paneli o różnej
wysokości, na półprzezroczystym szkle. Kadr z własnym niebem będzie się
gryzł z każdym z nich.

Miejsca, w których usiądzie, z realnymi rozmiarami przy dwukrotnej gęstości:

| Ekran | Rozmiar w pikselach |
|---|---|
| Wybór roli | 960 × 640 |
| Wejście kodem | 896 × 640 |
| Logowanie prowadzącego | 832 × 576 |
| Przegląd, moduły, zawody | 768 × 480 |
| Raport, lista grup | 704 × 448 |
| Ekran grupy, ekran sesji | 640 × 384 |

Jeden plik 2048 px wystarczy na wszystkie: skalujemy w dół.

---

# 2 · Priorytet drugi: tła nagłówków

Osiem nagłówków to dziś ciemne szkło z gradientową plamą. Kadr krajobrazu pod
spodem dałby im głębię, której nie da się zrobić kodem.

| | |
|---|---|
| **Ile** | **3 do 5** różnych, żeby ekrany się nie powtarzały |
| **Tło** | **własne**, to są pełne kadry |
| **Proporcje** | bardzo szerokie, **4:1** |
| **Rozmiar** | **2560 × 640 px** |
| **Treść** | nocny krajobraz z drogą: serpentyna w górach, droga przez las, światła miasta w dolinie, most nad wodą, wzgórze o świcie |
| **Ważne** | **lewa połowa musi być spokojna i ciemna** — tam stoi nagłówek. Cała treść obrazu po prawej |
| **Kolorystyka** | fiolet, granat, zimna biel. Bez pomarańczy i bez zieleni |

Bez ludzi i bez twarzy. Program jest dla ludzi 16–24, a każda twarz na zdjęciu
mówi uczestnikowi, kto „pasuje" do tego programu.

---

# 3 · Priorytet trzeci: siedem modułów

Każdy moduł zaczyna się ekranem wstępu, dziś czysto typograficznym. Mały motyw
przy nagłówku nadałby im tożsamość i ułatwiał orientację.

| | |
|---|---|
| **Ile** | **7** |
| **Tło** | **przezroczyste, do wycięcia** |
| **Proporcje** | kwadrat |
| **Rozmiar** | **512 × 512 px** |
| **Styl** | jeden przedmiot, świecący kontur, fiolet i biel — jak ikony z makiet, ale bogatsze |

Co ma przedstawiać każdy:

| Moduł | Motyw |
|---|---|
| **Punkt startu** | drogowskaz na rozstaju, pusty |
| **Co mnie ciągnie** | kompas |
| **Jak naturalnie działam** | dwie ścieżki: prosta i wijąca się |
| **W czym mogę być dobry** | dłoń trzymająca narzędzie |
| **Co jest dla mnie ważne** | waga szalkowa |
| **Jakiego życia chcesz** | okno z widokiem, wieczór |
| **Filtry rzeczywistości** | brama z uchylonymi wrotami |

---

# 4 · Priorytet czwarty: osiem światów zawodowych

Dwadzieścia siedem obszarów dzieli się na osiem grup tematycznych. Kafel
obszaru w raporcie i karta zawodu zyskałyby najwięcej — to jest miejsce,
w którym uczestnik podejmuje decyzję na dekadę.

| | |
|---|---|
| **Ile** | **8** |
| **Tło** | **własne**, kadry |
| **Proporcje** | 16:9 |
| **Rozmiar** | **1600 × 900 px** |
| **Treść** | miejsce pracy bez ludzi, nocą albo o świcie, w tej samej palecie |

| Grupa | Kadr |
|---|---|
| Biznes i wpływ | puste biuro z widokiem na miasto |
| Liczby i porządek | biurko z ekranami i wykresami |
| Prawo i państwo | sala z kolumnami, pusta |
| Technologia i nauka | serwerownia albo laboratorium |
| Ręce, teren i usługi | warsztat z narzędziami |
| Zdrowie i ciało | korytarz szpitalny nocą |
| Ludzie i wsparcie | dwa fotele naprzeciw siebie |
| Tworzenie | pracownia z materiałami |

---

# 5 · Drobiazgi, ale widoczne

| Co | Ile | Tło | Rozmiar |
|---|---|---|---|
| **Znak programu** | 1 | przezroczyste, SVG albo PNG | 512 × 512 |
| **Favicona** | 1 | przezroczyste | 512 × 512 |
| **Obraz do udostępniania** (gdy ktoś wkleja link) | 1 | własne | 1200 × 630 |
| **Okładka PDF-u** raportu | 1 | własne, jasne | 2480 × 1200 |

**Okładka PDF-u jest wyjątkiem kolorystycznym.** PDF drukuje się na białym
papierze i ma czarny tekst, więc ciemny fiolet się tam nie nadaje. Potrzebny
jasny wariant bram: te same łuki, ale na jasnym tle, kontur fioletowy.

---

# Czego nie potrzebuję

**Zdjęć ludzi.** Ani stockowych, ani pozowanych. Każda twarz mówi uczestnikowi,
kto pasuje do tego programu, a to jest dokładnie odwrotność tego, co robimy.

**Ikon interfejsu.** Strzałki, kłódki, ptaszki i kropki są rysowane w kodzie
i mają być spójne z krojem — obraz by je rozstroił.

**Ilustracji zawodów, po jednej na sto pięćdziesiąt siedem.** Osiem światów
wystarczy, a sto pięćdziesiąt siedem obrazków nigdy nie będzie równej jakości.

---

# Format plików

**PNG z przezroczystością** dla wszystkiego do wycięcia. Nie JPG — nie ma alfy.
Jeśli wolisz oddać na jednolitym tle, niech to będzie **czysta czerń
`#000000`**, nie biel: wycinanie z bieli zostawia jasną obwódkę wokół
świecących krawędzi, a właśnie te krawędzie są tu całą treścią.

**JPG albo WebP** dla kadrów z własnym tłem.

Nazwy plików bez polskich znaków i spacji, np. `bramy.png`,
`naglowek-serpentyna.jpg`, `modul-kompas.png`.

Wrzuć je do `public/grafika/` albo przyślij — podmienię.
