# GRAFIKI · MODUŁ M1 „Jakiego życia chcesz"

**Czego brakuje: 31 plików.** Dwadzieścia cztery bieguny do ekranów
odpowiedzi i siedem obszarów do części pisanej. Ekran wyniku nie potrzebuje
nic ponad to: bierze te same pliki.

Dziś moduł nie ma ani jednej grafiki. Ekrany odpowiedzi pokazują rysowany
znak wymiaru, a wynik same nazwy.

---

## Format

| | |
|---|---|
| Proporcja | **16:9**, tak jak plansze A5 i zdjęcia zawodów |
| Rozmiar źródła | **1600 × 900 px**, PNG |
| Co robi platforma | skaluje do 480 i 1000 px, konwertuje do JPEG, **nic nie przycina** |
| Gdzie kłaść | nazwa pliku = nazwa z kolumny „plik", katalog dowolny |
| Wgranie | `npx tsx scripts/grafiki.ts <katalog> m1w` oraz `... m1` |

Bieguny stoją **obok siebie**, dzielone białą linią, każdy na połowie pasa.
Przy szerokości panelu 832 px jedna połowa ma około **416 × 234 px** na
ekranie, więc temat musi być czytelny w tej skali: jedna scena, jedna osoba
albo jedno miejsce, bez drobnych szczegółów.

---

## ⚠️ Zasada, od której zależy poprawność wyniku

**Obie strony pary muszą wyglądać równie dobrze.** W tym module wybór JEST
pomiarem: jeśli lewa grafika będzie cieplejsza, ładniejsza albo bardziej
zapraszająca od prawej, uczestnicy przechylą się w jej stronę i zmierzymy
grafikę, a nie człowieka.

W obrębie jednej pary trzymajcie stałe:

| | |
|---|---|
| Pora dnia i światło | ta sama po obu stronach |
| Liczba osób | ta sama |
| Wiek i typ bohatera | ten sam, najlepiej ta sama osoba w dwóch sytuacjach |
| Nastrój | neutralny po obu stronach, **żadna strona nie może wyglądać na gorszą** |
| Kadr | ta sama odległość i ten sam typ ujęcia |

Żadna strona nie jest lepsza od drugiej. „Dużo godzin" nie może wyglądać na
wypalenie, a „mniej godzin" na lenistwo.

**Bohaterowie: 16 do 24 lata.** To jest wiek uczestników i mają się w tych
kadrach rozpoznać.

---

## Dwadzieścia cztery bieguny · ekrany odpowiedzi

Pas nad dwiema kartami wyboru. Lewa połowa należy do lewej odpowiedzi,
prawa do prawej.


### CEN · Praca jako centrum ↔ Praca jako środek

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-CEN-A.png` | **Praca jako centrum** | Osoba wieczorem przy biurku w mieszkaniu, skupiona, na ekranie własny projekt; widać, że została z wyboru, nie z przymusu. |
| `m1w-CEN-B.png` | **Praca jako środek** | Ta sama osoba wieczorem w tym samym mieszkaniu, laptop zamknięty i odłożony, zajęta czymś swoim poza pracą. |

### GRA · Praca przemieszana z życiem ↔ Ostro rozdzielona

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-GRA-A.png` | **Praca przemieszana z życiem** | Kuchenny stół: laptop, kubek, rzeczy domowe i robocze obok siebie, jedna przestrzeń na wszystko. |
| `m1w-GRA-B.png` | **Ostro rozdzielona** | Dwie wyraźnie oddzielone strefy w kadrze: zamknięte biurko po jednej stronie, część mieszkalna po drugiej. |

### GOD · Dużo godzin ↔ Mniej godzin

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-GOD-A.png` | **Dużo godzin** | Pełny dzień pracy w toku, późne światło za oknem, osoba w rytmie, bez oznak wyczerpania. |
| `m1w-GOD-B.png` | **Mniej godzin** | Wczesne wyjście: osoba zamyka biuro przy dziennym świetle i wychodzi w miasto. |

### TEMP · Kariera szybka ↔ Budowana powoli

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-TEMP-A.png` | **Kariera szybka** | Młoda osoba prowadzi spotkanie ze starszymi od siebie, pewna, wcześnie w roli. |
| `m1w-TEMP-B.png` | **Budowana powoli** | Ta sama osoba uczy się przy kimś doświadczonym, spokojnie, bez pośpiechu. |

### MIE · Stacjonarnie ↔ Zdalnie

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-MIE-A.png` | **Stacjonarnie** | Wejście do biura rano, ludzie przy sąsiednich biurkach, wspólna przestrzeń. |
| `m1w-MIE-B.png` | **Zdalnie** | Praca z domu przy własnym oknie, ten sam sprzęt, spokojne otoczenie. |

### ORG · Duża organizacja ↔ Mały zespół

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-ORG-A.png` | **Duża organizacja** | Duże, jasne biuro korporacyjne, wiele osób, czytelna struktura przestrzeni. |
| `m1w-ORG-B.png` | **Mały zespół** | Cztery osoby przy jednym stole w małym lokalu, wszyscy się znają. |

### KOR · Osiąść na stałe ↔ Mobilność

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-KOR-A.png` | **Osiąść na stałe** | Własne mieszkanie urządzone na lata: rośliny, książki, ślady mieszkania tu od dawna. |
| `m1w-KOR-B.png` | **Mobilność** | Wynajęte mieszkanie gotowe do zmiany: walizka, lekkie rzeczy, ta sama osoba. |

### INW · Szybko zarabiać ↔ Długo inwestować w naukę

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-INW-A.png` | **Szybko zarabiać** | Pierwsza praca tuż po szkole: osoba uczy się w działaniu, na miejscu, przy ludziach. |
| `m1w-INW-B.png` | **Długo inwestować w naukę** | Ta sama osoba nad książkami i notatkami, kilka lat nauki przed zarabianiem. |

### POZ · Wysoki poziom życia ↔ Wystarczy wygodnie

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-POZ-A.png` | **Wysoki poziom życia** | Dobre mieszkanie z widokiem, spokojny dostatek, bez przepychu i bez luksusu z reklamy. |
| `m1w-POZ-B.png` | **Wystarczy wygodnie** | Mniejsze, ciepłe mieszkanie, wszystkiego wystarczy, nic nie brakuje. |

### LUD · Prowadzić ludzi ↔ Odpowiadać za siebie

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-LUD-A.png` | **Prowadzić ludzi** | Osoba prowadzi zespół: stoi przy tablicy, kilka osób słucha, rozmowa w toku. |
| `m1w-LUD-B.png` | **Odpowiadać za siebie** | Ta sama osoba przy własnej pracy, skupiona, odpowiada za swój kawałek. |

### WID · Życie widoczne ↔ Prywatne

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-WID-A.png` | **Życie widoczne** | Osoba na scenie albo przed kamerą, widoczna, rozpoznawalna w tym, co robi. |
| `m1w-WID-B.png` | **Prywatne** | Ta sama osoba przy pracy, której efekt widać, a jej samej nie; bez publiczności. |

### ROD · Rodzina wcześnie ↔ Później albo niekoniecznie

| plik | biegun | co ma być na grafice |
|---|---|---|
| `m1w-ROD-A.png` | **Rodzina wcześnie** | Młoda osoba w domu z małym dzieckiem, zwyczajne popołudnie, spokój. |
| `m1w-ROD-B.png` | **Później albo niekoniecznie** | Ta sama osoba w podróży albo z przyjaciółmi, czas dla siebie, bez pośpiechu. |

---

## Siedem obszarów · część pisana i ekran wyniku

Te same pliki pracują w dwóch miejscach: nad polem tekstowym, gdy uczestnik
pisze, i jako kafel na ekranie wyniku modułu.

**Bez ludzi patrzących w obiektyw.** Ta część jest o tym, co uczestnik sam
napisze, więc grafika ma otwierać temat, a nie go rozstrzygać.

| plik | obszar | co ma być na grafice |
|---|---|---|
| `m1-1.png` | **Gdzie chcę żyć** | Panorama miejsca do życia: dom, okolica, skala miejscowości. Bez ludzi na pierwszym planie. |
| `m1-2.png` | **Jak chcę pracować** | Miejsce pracy jako przestrzeń: biurko, warsztat, teren. Rodzaj pracy nieokreślony. |
| `m1-3.png` | **Jak ma wyglądać mój dzień** | Rytm dnia: poranek, południe, wieczór w jednym kadrze albo jedna scena o wyraźnej porze. |
| `m1-4.png` | **Co chcę mieć poza pracą** | Życie po godzinach: sport, ludzie, cisza, pasja. Nic z pracy w kadrze. |
| `m1-5.png` | **Jak ważne są dla mnie pieniądze** | Pieniądze jako codzienność, nie jako bogactwo: zakupy, rachunki, decyzja o wydatku. |
| `m1-6.png` | **Czego nie chcę** | Granica, próg, zamknięte drzwi. Spokojnie, bez straszenia i bez oceniania. |
| `m1-7.png` | **Jak chcę żyć za pięć do dziesięciu lat** | Horyzont, droga, otwarta przestrzeń. Przyszłość jako kierunek, nie jako cel. |

---

## Ekran wyniku modułu

**Nie potrzebuje osobnych plików.** Pokazuje dwie sekcje:

- **Siedem obszarów, Twoimi słowami** · kafle z `m1-1` do `m1-7`,
- **Kształt życia, z par zdań** · dwanaście kafli, po jednym na wymiar.

Przy drugiej sekcji kafel weźmie grafikę tego bieguna, który u uczestnika
wyszedł, czyli jeden z `m1w-*-A` albo `m1w-*-B`. To jest zmiana po mojej
stronie, do zrobienia razem z wgraniem plików.

---

## Czego świadomie NIE zamawiam

**Grafik do samych 48 par.** Ilustrujemy wymiar, nie pojedyncze zdanie:
cztery pary tego samego wymiaru pytają o to samo z czterech stron, więc
cztery różne obrazki rozpraszałyby zamiast pomagać. Dwadzieścia cztery
bieguny obsługują wszystkie czterdzieści osiem ekranów.

**Grafiki na ekran ukończenia modułu.** Ten ekran ma animację, nie zdjęcie.
