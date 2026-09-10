# PROGRAM DORADZTWA ZAWODOWEGO 16–24

## Fundacja Służąc Życiu · komplet dokumentacji projektowej

**Czym to jest.** Kompletna specyfikacja programu warsztatów rozwojowo-zawodowych dla młodzieży, wraz z bazami danych i silnikami dopasowania. Wszystko zostało zaprojektowane, zakodowane i zwalidowane. **Nie ma tu rzeczy do wymyślenia, są rzeczy do zbudowania.**

**Czego nie ma.** Nie ma aplikacji. Ten katalog jest wsadem do jej zbudowania.

---

# JAK CZYTAĆ TĘ DOKUMENTACJĘ

## Kolejność, jeśli czytasz pierwszy raz

1. `01_model/model_programu.md` — po co to wszystko, dla kogo, jaka obietnica
2. Ten plik do końca
3. `04_silniki/` — trzy warstwy dopasowania, w kolejności warstwa1, warstwa2, warstwa3
4. `03_dane/` — cztery bazy, wszystkie zwalidowane
5. `06_scenariusze/` — jak program przebiega w czasie

## Co gdzie leży

| Katalog | Zawartość | Rola przy budowie aplikacji |
|---|---|---|
| `01_model` | Model programu, dokument źródłowy | Kontekst i obietnica, do której wszystko ma być wierne |
| `02_assessmenty` | Siedem modułów z pełnymi treściami pozycji | **Treść do wprowadzenia do bazy i wyświetlenia** |
| `03_dane` | Cztery bazy w JSON i CSV | **Import bezpośrednio do bazy danych** |
| `04_silniki` | Specyfikacje trzech warstw dopasowania i struktura raportu | **Logika do zaimplementowania** |
| `05_karty_zawodow` | 152 karty w 17 dokumentach, po 22 pola każda | **Treść wyświetlana uczestnikowi** |
| `06_scenariusze` | Cztery spotkania minuta po minucie, sesja indywidualna, panel | **Reguły odsłaniania treści i wymagania panelu** |
| `07_audyty` | Pomiary rozdzielczości systemu, wykryte ograniczenia | Kontekst, dlaczego pewne decyzje są takie, a nie inne |
| `08_kod_referencyjny` | Działające prototypy silników i walidatory w Pythonie | **Wzorzec logiki i zestaw testów regresyjnych** |

---

# ARCHITEKTURA W JEDNYM OBRAZKU

```
SIEDEM MODUŁÓW           TRZY WARSTWY SILNIKA              WYNIK
─────────────────        ────────────────────────          ──────────────
A0 punkt startu     ┐
A1 zainteresowania  │
A2 kompetencje      ├──► WARSTWA 1: obszary (27)     ─┐
A3 styl działania   │                                  │
A4 wartości         │    WARSTWA 2: zawody (157)     ─┼─► TRZY DROGI
A5 filtry           │                                  │   + karty
M1 wizja życia      ┘    WARSTWA 3: kierunki (75)    ─┘   + raport
                              + drogi bez studiów (56)
```

**Zasada nadrzędna:** system zawęża pole ze 157 do kilkunastu pozycji. **Nie do jednej.** Ostatni krok należy do człowieka i odbywa się na sesji indywidualnej.

---

# CZTERY BAZY DANYCH

Wszystkie w `03_dane/`, w JSON dla aplikacji i CSV do przeglądania.

## `zawody_baza.json` — 157 zawodów, 24 pola

Kluczowe pola: `obszar` (1–27), `poziom` wejścia, `studia`, profil z sześciu modułów (`a1`, `a2r`, `a2w`, `a3`, `a4p`, `a4m`, `a5`, `m1`), `anty` (antyprofil), `koszt` wejścia, `flaga` (docelowy albo trampolina), `zagr` (pięciostopniowe zagrożenie przyszłościowe), `kier` (zdanie kierunkowe), `klaster`, `duze_miasto`, `teren`, `przeciw` (przeciwwskazania zdrowotne), `przedm` (przedmioty szkolne), `dosw` (wzmacniające doświadczenie).

## `kierunki_baza.json` — 75 kierunków + 56 dróg bez studiów

Kierunki mają m.in. `wymagane` i `punktowane` przedmioty, `trudnosc` rekrutacji, `bezposrednie` i `posrednie` zawody, `odsetek` absolwentów pracujących w zawodzie oraz **`nie_daje`**, czyli najczęstsze rozczarowanie, wyprowadzone z kart zawodów.

**Pole `nie_daje` nie istnieje w żadnym informatorze uczelnianym i jest najcenniejszą częścią tej bazy.** Przykład: psychologia nie daje uprawnień do prowadzenia terapii, architektura nie daje uprawnień projektowych.

## `klastry.json` — 26 klastrów

Grupy zawodów, których assessment **nie jest w stanie rozróżnić**, bo mają identyczny profil. Każdy klaster ma nazwę zbiorczą, **pytanie rozstrzygające** i wyjaśnienie różnicy.

## `obszary_27_opis.md` — 27 obszarów zawodowych

Z poziomami wejścia i macierzą sąsiedztwa, używaną do budowy trzeciej drogi.

---

# CO ZOSTAŁO ZMIERZONE, A NIE ZAŁOŻONE

Audyt na 8000 symulowanych profili, kod w `08_kod_referencyjny/audyt_osiagalnosci.py`:

| Sprawdzenie | Wynik |
|---|---|
| Zawodów osiągalnych | **157 na 157** |
| Zawodów, które nigdy nie wychodzą | **0** |
| Najczęstszy zawód | 10,3% profili, brak dominacji |
| Różnorodność wyników TOP3 | **0,812** |
| Zawodów wygrywających własny profil idealny | **wszystkie albo w klastrze** |
| Zawodów bez drogi edukacyjnej | **0** |
| Zawodów bez studiów bez drogi krótkiej | **0** |

**Znane i świadome ograniczenie:** 54 zawody w 26 klastrach nie są rozróżnialne przez assessment. Realna rozdzielczość systemu to **133 pozycje, nie 157**. To nie jest wada do naprawienia, tylko granica metody, i system mówi o niej wprost zamiast udawać precyzję.

---

# DZIESIĘĆ ZASAD, KTÓRYCH NIE WOLNO ZŁAMAĆ

Wynikają z modelu programu i z audytów. Ich naruszenie psuje program, nawet jeśli aplikacja będzie działać.

1. **Uczestnik nigdy nie widzi liczb dopasowania.** Tylko pasma opisowe.
2. **Uczestnik nigdy nie jest porównywany z grupą.**
3. **Nigdy nie pada komunikat, że nic nie pasuje.** Przy profilu płaskim: „profil jeszcze nieostry, to normalne w Twoim wieku".
4. **Kompetencje i doświadczenie mogą tylko podnosić wynik, nigdy go nie obniżają.** Samoocena bywa zawodna w obie strony.
5. **Antyprofil nie odejmuje punktów.** Dopina zdanie do raportu i temat na sesję.
6. **Weta usuwają bezwarunkowo, ale maksymalnie trzy.**
7. **Uczestnik nie widzi listy zawodów usuniętych przez weto.** To zamieniałoby jego decyzję w listę strat.
8. **Lista dróg bez studiów pojawia się w każdym raporcie**, niezależnie od profilu.
9. **Obszary są odsłaniane przed zawodami, z przerwą między nimi.**
10. **Prowadzący może ręcznie dopisać zawód spoza wyniku.** Ta funkcja jest obowiązkowa.

---

# CO ZOSTAŁO DO ZROBIENIA POZA KODEM

Rzeczy, których w tej paczce nie ma i których aplikacja nie załatwi:

- Zgody opiekunów dla uczestników niepełnoletnich
- Informacja o przetwarzaniu danych osobowych
- Wybór i przeszkolenie prowadzącego (jeden dzień, zakres w `06_scenariusze/`)
- Rekrutacja grupy pilotażowej, 10 do 14 osób
- Kwestionariusz „przed i po", cztery pytania, opisany w `06_scenariusze/sesja_indywidualna_i_panel.md`

**Pilotaż ma sprawdzić trafność wyników, nie działanie aplikacji.** Można go przeprowadzić w arkuszu kalkulacyjnym i przy dwunastu osobach zajmuje to około dwóch godzin ręcznie.

---

# STAN GOTOWOŚCI

| Element | Stan |
|---|---|
| Siedem modułów assessmentowych z treściami | gotowe |
| 157 zawodów zakodowanych i zwalidowanych | gotowe |
| 75 kierunków i 56 dróg bez studiów | gotowe |
| 26 klastrów z pytaniami rozstrzygającymi | gotowe |
| Trzy warstwy silnika, specyfikacje | gotowe |
| Prototypy silników w Pythonie, testy przechodzą | gotowe |
| 152 karty zawodów, po 22 pola | gotowe |
| Scenariusze czterech spotkań i sesji 1:1 | gotowe |
| Struktura raportu, 20 sekcji w 5 warstwach | gotowe |
| **Aplikacja** | **do zbudowania** |

---

# WERSJA 2, PO PYTANIACH Z CLAUDE CODE

Dwie poprawki wobec wersji pierwszej:

1. **Harmonogram odsłaniania** — obowiązują scenariusze z `06_scenariusze/`, nie tabela z pierwotnego polecenia. Szczegóły w `00_ODPOWIEDZI_na_pytania_v2.md` punkt 1.
2. **Brakujący kod `dzwiek`** — obszar zainteresowań nr 11 nie był użyty przy kodowaniu zawodów. Poprawione: `zawody_baza.json` używa teraz wszystkich 24 kodów A1, a muzyk, nauczyciel muzyki i realizator dźwięku mają poprawione profile.

Walidacja po poprawkach: 24 kody A1 na 24, osiągalność 157 na 157, różnorodność TOP3 0,809, zero zawodów przegrywających własny profil idealny.
