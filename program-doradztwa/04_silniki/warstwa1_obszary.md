# SILNIK DOPASOWANIA

## Specyfikacja — wersja 1.0

Program warsztatów rozwojowo-zawodowych 16–24 | Fundacja Służąc Życiu

Dokument opisuje, jak wyniki sześciu modułów diagnostycznych zamieniają się w ranking obszarów, trzy drogi i rekomendacje. Zawiera architekturę, wzory, cztery liczby decyzyjne, obsługę słabych danych, wyjście do raportu oraz **wyniki przebiegu na sucho na trzech profilach**.

---

# 1. DLACZEGO NIE WAGI

Pierwsza wersja tej architektury zakładała ważoną sumę czterech modułów. **Została odrzucona** i warto rozumieć, dlaczego, bo pokusa powrotu do niej będzie duża — jest łatwa do zaprogramowania i wygląda naukowo.

## Trzy powody

**Suma ważona zakłada kompensację, której tu nie ma.** Ważona suma mówi, że wysokie zainteresowanie może nadrobić niezgodność z wizją życia. To nieprawda. Jeśli ktoś chce być w domu o siedemnastej, a obszar wymaga sześćdziesięciu godzin tygodniowo, żadne zainteresowanie tego nie odkupi. Moduły mają **różną logikę działania**, a suma traktuje je identycznie.

**Wagi są niesprawdzalne.** Nikt nie powie, czy 40/30/20/10 jest lepsze niż 45/25/20/10. Nie ma danych i długo nie będzie. Liczba, której nie da się sfalsyfikować, nie powinna dźwigać całego systemu.

**Kompetencje w tej grupie wiekowej nie mogą działać symetrycznie.** Niska samoocena skuteczności u siedemnastolatka prawie zawsze znaczy *nie miałem okazji*, nie *nie potrafię*. Waga działa w obie strony — a tu potrzebna jest asymetria.

## Odpowiedź na zarzut, że zainteresowania też się zmieniają

Zmieniają. Ale trzeba je porównać z alternatywami, nie z ideałem.

W grupie 16–24 zainteresowania są **względnie najstabilniejsze i najlepiej zmierzone** ze wszystkiego, co zbieramy. Poczucie skuteczności jest słabo skalibrowane i szybko rośnie. Parametry życia dotyczące rodziny i miejsca zmieniają się w tym przedziale wiekowym prawdopodobnie najmocniej ze wszystkiego.

Wniosek nie brzmi jednak *więc zainteresowania mają większą wagę*. Brzmi: **każdy moduł ma pracować inaczej**.

| Moduł | Rola w silniku | Dlaczego taka |
|---|---|---|
| A5 filtry | bramka i mnożnik | niekompensacyjne z natury |
| A1 zainteresowania | **oś rankingu** | najlepiej zmierzone, najstabilniejsze |
| A2 kompetencje | **wzmocnienie, tylko w górę** | niskie wyniki to brak okazji, nie sufit |
| A4 wartości | mnożnik zgodności | częściowo niekompensacyjne, progowe całkiem |
| M1 kształt życia | mnożnik zgodności | twarde parametry nie podlegają wymianie |
| A3 styl | wyjaśnienie, nie punkty | niska stawka, wysoka wartość opisowa |

**Zainteresowania są osią, nie największą wagą.** Różnica jest istotna: oś to skala, na której obszary się ustawiają. Reszta ją modyfikuje, każde po swojemu.

---

# 2. ARCHITEKTURA

```
ETAP 0   WYKONALNOŚĆ        filtry, weta          → usunięcie albo mnożnik 0,50–1,00
ETAP 1   CIĄGNIĘCIE         zainteresowania       → oś, 0–100
ETAP 2   WZMOCNIENIE        kompetencje           → bonus 0 do +15, nigdy ujemny
ETAP 3   ZGODNOŚĆ           wartości + życie      → mnożnik 0,65–1,15
ETAP 4   WYNIK              złożenie
ETAP 5   POZIOM WEJŚCIA     gotowość edukacyjna   → wybór drzwi do obszaru
ETAP 6   TRZY DROGI         macierz sąsiedztwa
ETAP 7   WYJAŚNIENIA        dlaczego i co przeszkadza
```

---

# 3. ETAP 0 — WYKONALNOŚĆ

```
dla każdego obszaru:
    jeśli istnieje filtr p taki, że Weto[p] oraz wymaganie[p] ≥ 0,60:
        USUŃ obszar, zapisz powód
        przejdź dalej

    Kara = Σ( wymaganie[p] × (1 − G[p]) ) / Σ wymaganie[p]
    Wykonalność = 1 − 0,50 × Kara
```

gdzie `G`: TAK = 1,0 · MOŻE = 0,5 · NIE = 0,0

Kara jest **samonormalizująca się**. Obszar z dziesięcioma wymaganiami nie jest karany surowiej niż obszar z czterema tylko dlatego, że ma ich więcej.

Sufit kary wynosi 50%. Nawet komplet niezgodności nie zeruje obszaru — spada nisko, ale zostaje widoczny wraz z informacją, co go zepchnęło. To jest różnica między narzędziem, które doradza, a takim, które zamyka.

**Weta to jedyny mechanizm usuwający w całym silniku.** Uczestnik może nadać najwyżej trzy i robi to świadomym ruchem w module A5.

---

# 4. ETAP 1 — CIĄGNIĘCIE

```
Ciągnięcie = Σ( waga_A1[a] × Z[a] ) / Σ waga_A1[a]        → 0–100
```

`Z` to wynik obszaru zainteresowań z modułu A1, wagi z bazy obszarów zawodowych.

To jest cała oś. Nie ma tu żadnego współczynnika do dostrojenia i to jest celowe.

---

# 5. ETAP 2 — WZMOCNIENIE, TYLKO W GÓRĘ

**Najważniejsza decyzja projektowa w całym silniku.**

```
Kompetencje = Σ( waga_A2[c] × K[c] ) / Σ waga_A2[c]        → 0–100

Bonus = max(0 ; Kompetencje − 50) / 50 × 12                → 0 do +12
jeśli co najmniej połowa kompetencji rdzeniowych obszaru (waga 3)
   ma w module A2 co najmniej dwa dowody:
        Bonus += 3
Bonus = min(Bonus ; 15)
```

**Bonus nigdy nie jest ujemny.** Kompetencje poniżej średniej nie obniżają obszaru ani o punkt.

Uzasadnienie jest merytoryczne, nie techniczne. Siedemnastolatek, który nisko ocenia swoją zdolność negocjowania, w dziewięciu przypadkach na dziesięć nigdy nie negocjował. Odjęcie mu za to punktów oznaczałoby zamykanie drogi z powodu braku doświadczenia, którego w tym wieku nie może mieć. Wysoka samoocena **poparta dowodami z części B modułu A2** to realna informacja i może działać — ale w jedną stronę.

Dodatek za dowody jest osobny i mały. Chodzi o to, żeby profil oparty na samym wyobrażeniu ważył mniej niż profil, za którym stoją konkretne sytuacje.

---

# 6. ETAP 3 — MNOŻNIK ZGODNOŚCI

Wartości i kształt życia **nie dokładają punktów**. Przemnażają wynik.

```
d = 0

# wartości
dla każdej wartości zaspokajanej przez obszar:
    jeśli w TOP5 uczestnika:            d += 0,04

dla każdej wartości w konflikcie z obszarem:
    jeśli PROGOWA u uczestnika:         d −= 0,25
    w przeciwnym razie jeśli w TOP5:    d −= 0,10
    w przeciwnym razie jeśli w BOTTOM3: d += 0,02

# kształt życia
wspólne = wymiary M1 obecne i w obszarze, i u uczestnika (pominięte = null wyłączone)
dla każdego wspólnego wymiaru:
    cel = 100 jeśli obszar ma biegun A, w przeciwnym razie 0
    dystans = |Poz_uczestnika − cel| / 100
    jeśli wymiar jest TWARDY i dystans = 1,00:   d −= 0,08

d −= 0,20 × średni dystans

Mnożnik = ogranicz(1,0 + d ; 0,65 ; 1,15)
```

**Wymiary twarde:** `MIE` (stacjonarnie kontra zdalnie), `GOD` (ile godzin), `KOR` (osiadłość kontra mobilność). To parametry, w których pełna niezgodność oznacza realny konflikt z codziennością, a nie preferencję.

Kara za wartość progową (−0,25) jest najsilniejszym pojedynczym czynnikiem w całym etapie. Realizuje rozróżnienie wprowadzone w module A4: wartość, bez której uczestnik nie wyobraża sobie pracy, musi działać inaczej niż wartość po prostu wysoka.

---

# 7. ETAP 4 — WYNIK

```
Wynik = (Ciągnięcie + Bonus) × Mnożnik × Wykonalność
```

Zakres praktyczny: **0 do około 130**. Wynik nie jest obcinany do stu.

Obcięcie na setce nasycałoby czubek rankingu i gubiło różnicę między obszarem świetnym a bardzo dobrym — dokładnie tam, gdzie różnica jest najbardziej potrzebna.

## Pasma

| Wynik | Pasmo |
|---|---|
| ≥ 85 | bardzo mocne dopasowanie |
| 70–84 | mocne dopasowanie |
| 55–69 | dobre dopasowanie |
| 42–54 | umiarkowane dopasowanie |
| < 42 | antydopasowanie |

**Liczba nigdy nie trafia na ekran uczestnika.** Tylko pasmo.

---

# 8. ETAP 5 — POZIOM WEJŚCIA

Obszar nie ma jednych drzwi. Baza obszarów definiuje dla każdego dwa do czterech poziomów wejścia z czasem dojścia i wymogiem studiów.

```
dostępne = poziomy obszaru, dla których:
    NIE (wymaga studiów ORAZ G[F02] = 0)
    NIE (czas ≥ 5 lat ORAZ G[F01] = 0)

jeśli dostępne puste:
    USUŃ obszar, powód: brak dostępnego poziomu edukacyjnego

wybór:
    INW ≥ 75 (uczestnik chce szybkiego wejścia)  → najkrótszy dostępny
    INW ≤ 25 (gotów na długą inwestycję)         → najdłuższy dostępny
    w przeciwnym razie                            → środkowy
```

**To rozwiązuje problem, który realnie szkodził.** Uczestnik widzi obszar *medycyna* i myśli: lekarz, jedenaście lat, odpadam. Filtrowanie na poziomie obszaru odbierało mu cały obszar. Filtrowanie na poziomie wejścia odbiera tylko najdłuższe drzwi — technik i ratownik zostają.

Wymagania `F01`, `F02` i `F03` zapisane w bazie na poziomie obszaru są uśrednione. Poziom nadpisuje je przez `filter_overrides`.

---

# 9. ETAP 6 — TRZY DROGI

Model programu nazywa je poprawnie: **Droga A — najmocniejsze dopasowanie, Droga B — bardzo dobre dopasowanie, Droga C — alternatywa**. Silnik odtwarza dokładnie tę semantykę.

```
A = obszar z najwyższym wynikiem

B = najwyżej punktowany obszar o wyniku ≥ 0,55 × wynik(A)
    (czyli po prostu drugi w rankingu, o ile nie odstaje)
    jeśli podobieństwo(A,B) ≥ 0,60 → flaga „ten sam świat"

C = spośród obszarów o wyniku ≥ 0,40 × wynik(A) oraz ≥ 42 punktów
    wybierz ten o najmniejszym max(podobieństwo do A, podobieństwo do B)
    przy remisie: wyższy wynik
```

**Droga B odpowiada za jakość, Droga C za odmienność.** To jest cała reguła i wynika z semantyki, a nie z optymalizacji.

Wcześniejsza wersja filtrowała B po odmienności i **przebieg na sucho pokazał, że to katastrofa**: uczestniczka o profilu społecznym z wynikiem 83 na edukacji dostawała jako Drogę B administrację z wynikiem 40, bo edukacja była zbyt podobna do opieki. Utrata jakości była nieproporcjonalna do zysku z różnorodności.

## Gdy trzeciej drogi nie ma

```
jeśli brak kandydata spełniającego warunki C:
    zbuduj Drogę C jako INNY POZIOM WEJŚCIA w obszarze A albo B
    przykład: A = lekarz (11 lat), C = ratownik medyczny (3 lata)
```

U osoby o bardzo wąskim profilu trzecia droga nie musi być innym obszarem. Może być tym samym światem, do którego wchodzi się innymi drzwiami. To uczciwsze niż doklejanie obszaru, który nie pasuje.

## Flagi

Silnik nie ukrywa, kiedy drogi są blisko siebie:

| Flaga | Komunikat w raporcie |
|---|---|
| A i B podobne ≥ 0,60 | *Twoje dwie najmocniejsze drogi to w gruncie rzeczy ten sam świat. Różnią się drzwiami, nie kierunkiem.* |
| Droga B wyraźnie słabsza od A | *Jedna droga wyszła wyraźnie mocniej niż pozostałe.* |
| Brak sensownej trzeciej drogi | Droga C budowana jako inny poziom wejścia |

---

# 10. ETAP 7 — WYJAŚNIENIA

**Silnik produkuje uzasadnienia, nie tylko liczby.** Bez tego raport jest wyrocznią, a model programu wymaga czegoś innego.

Dla każdego obszaru w TOP 5:

```
DLACZEGO MOŻE DO CIEBIE PASOWAĆ
  → 3–4 obszary zainteresowań o wadze 3 lub 2, w których uczestnik ma Z ≥ 60
  → kompetencje rdzeniowe, w których uczestnik ma K ≥ 60 (jeśli są)
  → wartości obszaru obecne w TOP5 uczestnika
  → warunki środowiskowe obszaru zgodne z warunkami kluczowymi z A3

CO MOŻE CI PRZESZKADZAĆ
  → pozycja "trudne" z bazy obszaru
  → filtry z wymaganiem ≥ 0,50, na które uczestnik odpowiedział MOŻE albo NIE
  → wartości w konflikcie obecne w TOP5 uczestnika
  → wymiary życia z pełną niezgodnością

CZEGO TRZEBA SIĘ NAUCZYĆ
  → kompetencje rdzeniowe obszaru, w których uczestnik ma K < 50
```

Ostatnia sekcja jest ważna: to **jedyne miejsce, gdzie niskie kompetencje w ogóle się pojawiają** — jako lista do nauczenia się, nigdy jako powód obniżenia wyniku.

## Antydopasowania

Obszar trafia na listę ostrzegawczą, gdy spełni którykolwiek warunek:

| Warunek | Komunikat |
|---|---|
| Wynik < 42 | Ta droga zawiera dużo elementów przeciwnych Twoim obecnym preferencjom |
| Konflikt z wartością progową | Ta praca prawdopodobnie nie da Ci tego, bez czego nie wyobrażasz sobie pracy |
| Kara filtrowa > 0,60 | Ta droga wymaga kilku rzeczy, na które nie jesteś gotów |
| Ciągnięcie < 30 przy Kompetencjach > 70 | Prawdopodobnie poszłoby Ci to dobrze, ale nic Cię tam nie ciągnie |

Ostatni wiersz jest odwrotnością ćwiartki *ukryty atut* z modułu A2. Program musi umieć powiedzieć: **dasz radę, ale po co**.

Pokazuj najwyżej **trzy** antydopasowania. Dłuższa lista brzmi jak wyrok. Zawsze ze słowem **aktualnym** — *przeciwne Twoim aktualnym preferencjom*.

---

# 11. CZTERY LICZBY DECYZYJNE

Cała arbitralność systemu zebrana w jednym miejscu. Zamiast czterech wag sumujących się do jedynki — cztery liczby o mniejszych konsekwencjach, z których każdą da się uzasadnić osobno.

| # | Liczba | Wartość | Co robi | Kiedy zmienić |
|---|---|---|---|---|
| 1 | Sufit bonusu kompetencyjnego | **15** | Ile maksymalnie kompetencje mogą podnieść obszar | W górę, jeśli program ma kłaść większy nacisk na to, w czym ktoś już jest dobry |
| 2 | Rozpiętość mnożnika zgodności | **0,65–1,15** | Jak mocno wartości i wizja życia przestawiają ranking | Poszerzyć, jeśli uczestnicy skarżą się, że rekomendacje nie pasują do ich życia |
| 3 | Próg jakości Drogi B | **0,55** | Jak słaba może być druga droga | W górę, jeśli Droga B bywa nieprzekonująca |
| 4 | Próg jakości Drogi C | **0,40** | Jak słaba może być alternatywa | W górę, jeśli Droga C bywa nierealna |

Do tego dwie liczby dziedziczone z modułów i **niepodlegające dostrajaniu tutaj**: próg weta 0,60 z bazy obszarów i sufit kary filtrowej 0,50 z modułu A5.

**Rekomendacja:** nie dostrajać niczego przed pilotażem. Po pilotażu zmieniać po jednej liczbie naraz i patrzeć, co się dzieje z trzema profilami kontrolnymi.

---

# 12. DEGRADACJA PRZY SŁABYCH DANYCH

Silnik musi wiedzieć, kiedy nie wie. Reguły w kolejności ważności:

| Sytuacja | Zachowanie |
|---|---|
| A1 profil płaski (`D < 18`) | **Nie generuj rankingu obszarów.** Pokaż grupy obszarów zgodne z osiami Rzeczy–Ludzie i Dane–Idee. Trzy drogi nie powstają |
| A1 i A2 płaskie jednocześnie | Silnik nie działa w ogóle. Sesja 1:1 pracuje na ekspozycji z A1 i wizji życia |
| A5 wskaźnik zamknięcia > 20 | Wyłącz filtry całkowicie — ani kar, ani wet. Flaga dla prowadzącego |
| A2 wskaźnik okazji < 8 | Bonus kompetencyjny wyłączony. Ranking na samym ciągnięciu i zgodności |
| Brak danych z A4 albo M1 | Mnożnik zgodności liczony z dostępnego składnika; przy braku obu Mnożnik = 1,0 |
| Weta usuwają ponad połowę obszarów | Ranking na pozostałych; **ostrzeżenie dla prowadzącego, nie dla uczestnika** |
| Wszystkie obszary poniżej 42 | Pokaż pięć najwyższych z etykietą *umiarkowane* i wyjaśnieniem, że profil jest jeszcze nieostry |

**Zasada nadrzędna: system nigdy nie mówi młodemu człowiekowi, że nic do niego nie pasuje.** Jeśli wszystko wypada nisko, znaczy to, że profil jest jeszcze nieostry — i tak właśnie ma to zostać nazwane.

---

# 13. WYJŚCIE SILNIKA

```json
{
  "participant_id": "uuid",
  "engine_version": "1.0",
  "confidence": "wyrazny",
  "areas_ranked": [
    {"id": 13, "score": 104.1, "band": "bardzo_mocne",
     "pull": 88.4, "competence": 79.1, "bonus": 10.0,
     "fit_multiplier": 1.09, "feasibility": 0.94,
     "entry_level": {"label":"szybkie","example":"pomocnik, uczen zawodu","years":"1-2"}}
  ],
  "removed": [
    {"id": 3, "reason": "veto", "filter": "F26", "requirement": 0.60},
    {"id": 11, "reason": "no_available_entry_level"}
  ],
  "paths": {
    "A": {"area": 13, "level": "szybkie"},
    "B": {"area": 15, "level": "szybkie"},
    "C": {"area": 26, "level": "szybkie"},
    "similarity": {"AB": 0.34, "AC": 0.30, "BC": 0.26},
    "flags": ["droga_b_slabsza_od_a"]
  },
  "anti_fit": [
    {"id": 19, "reason": "score_below_42"},
    {"id": 2, "reason": "score_below_42"}
  ],
  "entrepreneurial_mode": 68,
  "entrepreneurial_pairing": 13,
  "skills_to_develop": [14, 21, 11],
  "questions_for_1on1": [
    "Droga A i B roznia sie tempem wejscia - co jest dla Ciebie wazniejsze?",
    "Weto na wystapienia usunelo cztery obszary - czy to na pewno granica?"
  ]
}
```

**Pole `questions_for_1on1` jest wymagane.** Silnik nie kończy pracy na rankingu — generuje materiał do rozmowy. Powstaje z flag: każda flaga, każde weto o dużym zasięgu, każda rozbieżność między modułami zamienia się w pytanie dla prowadzącego.

To jest realizacja zasady z modelu programu: sesja 1:1 ma być poświęcona decyzji, nie ponownemu poznawaniu uczestnika.

---

# 14. PRZEBIEG NA SUCHO

Silnik został zaimplementowany i przepuszczony przez trzy zmyślone profile. Poniżej rzeczywiste wyniki, nie ilustracje.

## Profil 1 — rzemieślnik, 17 lat

Wysokie zainteresowanie naprawą i budowaniem, niskie rozmową i pisaniem. Kompetencje manualne i techniczne wysokie. Wartości: wolność, mistrzostwo, stabilność. Nie na studia, nie na komputer cały dzień, **weto na wystąpienia publiczne**. Chce szybko wejść na rynek, zostać w jednym miejscu, na swoim.

| Wynik | Obszar | Poziom |
|---|---|---|
| 104,1 | Rzemiosło i usługi techniczne | szybkie: pomocnik, uczeń zawodu, 1–2 lata |
| 56,4 | Rolnictwo, przyroda i zwierzęta | szybkie: pracownik gospodarstwa, 0–1 rok |
| 54,4 | Inżynieria i produkcja | szybkie: technik, operator maszyn, 0–1 rok |
| 47,1 | Gastronomia i hotelarstwo | szybkie: kelner, pomoc kuchenna |

Najniżej: psychologia, marketing, opieka. **Usuniętych 6 obszarów** — cztery przez weto na wystąpienia, nauka i badania przez brak dostępnego poziomu edukacyjnego.

Trzy drogi: rzemiosło → rolnictwo → gastronomia. Podobieństwa 0,34 i 0,30. Flaga: *Droga B wyraźnie słabsza od A*.

## Profil 2 — profil społeczny, 19 lat

Wysokie zainteresowanie opieką, rozmową, nauczaniem. Kompetencje: cierpliwość, wyczuwanie ludzi, wyjaśnianie. Wartości: sens jako progowa, relacje, zgodność z zasadami. **Weto na widok krwi i cierpienia.** Chce mniej godzin, gotowa na długą naukę.

| Wynik | Obszar | Poziom |
|---|---|---|
| 95,8 | Opieka i praca socjalna | długie: koordynator, kierownik placówki |
| 83,1 | Edukacja i szkolenia | długie: nauczyciel w szkole, 5 lat |
| 77,6 | Psychologia i wsparcie | bardzo długie: psychoterapeuta, 9–10 lat |
| 68,3 | Zdrowie, rehabilitacja i ciało | długie: fizjoterapeuta, 5–6 lat |

Usunięte: medycyna i służby mundurowe — oba przez weto na krew. **To jest dokładnie ten przypadek, dla którego weta istnieją**: bez nich medycyna wylądowałaby w czołówce, bo profil zainteresowań pasuje.

Trzy drogi: opieka → edukacja → administracja.

## Profil 3 — profil analityczny, 22 lata

Wysokie zainteresowanie liczbami, technologią, nauką. Kompetencje analityczne wysokie. Wartości: rozwój jako progowa, mistrzostwo, pieniądze. Gotowy na długie studia, chce pracować zdalnie, praca w centrum życia. Nie na pracę fizyczną i zmianową.

| Wynik | Obszar | Poziom |
|---|---|---|
| 108,0 | Analiza danych | długie: data scientist, 6+ lat |
| 99,1 | Technologia i oprogramowanie | długie: architekt systemów, 6+ lat |
| 66,5 | Nauka i badania | długie: pracownik naukowy, 9–11 lat |
| 66,2 | Finanse i księgowość | długie: główny księgowy, 8+ lat |

Trzy drogi: analiza danych → technologia → **prawo**. Podobieństwo A–B wynosi 0,80, więc silnik zgłasza flagę *ten sam świat*. Droga C została dobrana jako najodleglejszy sensowny obszar i wypadła na prawie, przy podobieństwie 0,24 do A.

**To jest zachowanie prawidłowe i warto je rozumieć.** Analiza danych i technologia to dla tej osoby dwie najlepsze opcje i byłoby nieuczciwe pokazać tylko jedną. Ale uczestnik dostaje wprost informację, że to nie są dwa różne kierunki, tylko dwoje drzwi do tego samego świata — a trzecia droga jest naprawdę inna.

## Co przebieg na sucho wyłapał

Trzy błędy, wszystkie poprawione przed napisaniem tego dokumentu:

1. **Parsowanie czasu dojścia.** Zapis *6+ lat* nie parsował się na liczbę i wracał jako zero, przez co uczestnik chcący szybkiego wejścia dostawał najdłuższy poziom. Rzemieślnik miał rekomendowanego mistrza z własnym warsztatem zamiast ucznia zawodu.
2. **Obcięcie wyniku na setce.** Nasycało czubek rankingu i gubiło różnicę tam, gdzie jest najbardziej potrzebna.
3. **Reguła trzech dróg.** Pierwsza wersja filtrowała Drogę B po odmienności i produkowała katastrofalne wyniki: profil społeczny z 83 punktami na edukacji dostawał jako Drogę B administrację z 40 punktami. Reguła została przepisana zgodnie z semantyką z modelu programu.

Wszystkie trzy były niewidoczne w samej specyfikacji i ujawniły się dopiero na konkretnych liczbach. **To jest argument za tym, żeby każdą zmianę w silniku weryfikować na tych samych trzech profilach.**

---

# 15. TESTY AKCEPTACYJNE

1. **Asymetria kompetencji.** Obniżenie wszystkich `K` do zera nie obniża żadnego wyniku obszaru.
2. **Sufit kary.** Przy wszystkich odpowiedziach NIE i braku wet żaden obszar nie spada poniżej 50% wartości bez filtrów.
3. **Normalizacja kary.** Dwa obszary o różnej liczbie wymagań, przy tym samym profilu odpowiedzi, dostają tę samą karę procentową.
4. **Próg weta.** Weto przy wymaganiu 0,55 nie usuwa obszaru; przy 0,60 usuwa.
5. **Wartość progowa.** Konflikt z wartością progową daje −0,25 na `d`, nie na całym wyniku.
6. **Poziom wejścia.** `INW ≥ 75` daje najkrótszy dostępny poziom; `INW ≤ 25` najdłuższy. *Test wprowadzony po błędzie wykrytym w przebiegu na sucho.*
7. **Trzy drogi.** Droga B jest zawsze drugim w rankingu, o ile przekracza próg jakości.
8. **Nigdy pusto.** Silnik zawsze zwraca co najmniej pięć obszarów albo komunikat o nieostrym profilu.
9. **Determinizm.** Ten sam komplet odpowiedzi daje identyczny ranking i identyczne drogi.
10. **Brak liczb na ekranie.** Żaden ekran uczestnika nie zawiera wartości `score`.
11. **Profile kontrolne.** Trzy profile z sekcji 14 dają wyniki zgodne z zapisanymi. Uruchamiane po każdej zmianie w silniku albo w bazie.

---

# 16. CO ZOSTAJE DO ZROBIENIA

1. **Przyjęcie czterech liczb decyzyjnych przez fundację.** Nie technicznie, tylko merytorycznie — zwłaszcza sufitu bonusu kompetencyjnego, bo on wyraża stosunek programu do pytania *czy liczy się bardziej to, co mnie ciągnie, czy to, w czym jestem dobry*.
2. **Rozszerzenie zestawu profili kontrolnych** z trzech do sześciu. Brakuje profilu płaskiego, profilu z bardzo wieloma wetami i profilu artystycznego.
3. **Generator wyjaśnień** z sekcji 10 — sama logika jest opisana, implementacji nie ma.
4. **Generator pytań na sesję 1:1** — najbardziej niedoceniany element wyjścia i jedyny, który realnie odciąża prowadzącego.
5. **Karty zawodów** — silnik operuje na obszarach i poziomach wejścia; warstwa zawodów jest kolejnym krokiem.

Punkt 2 jest tańszy, niż wygląda, i zwraca się natychmiast. Trzy profile wykryły trzy błędy w jeden wieczór.
