# GRAFIKI · MODUŁ A0 „Punkt startu"

**104 pliki.** Każda odpowiedź w A0 ma nad sobą kadr 16:9, tak jak w makietach.
Opcji jest 175, ale przedmioty szkolne wracają w sześciu pytaniach i dzielą
pliki, a siedem opcji wyjścia („nie wiem", „nic z tego", odmowa) kadru nie ma
wcale. Zostaje 104.

---

## Format

| | |
|---|---|
| Proporcja | **16:9**, tak jak plansze A5, zdjęcia zawodów i bieguny M1 |
| Rozmiar źródła | **1600 × 900 px**, PNG |
| Nazwa pliku | dokładnie z kolumny „plik", z rozszerzeniem `.png` |
| Wgranie | `npx tsx scripts/grafiki.ts <katalog> a0` |
| Co robi platforma | skaluje do 480 i 1000 px, robi JPEG, **nic nie przycina** |

Na ekranie kadr ma od **200 do 330 px szerokości** (pięć kolumn przy dziesięciu
opcjach, trzy przy trzech). Temat musi być czytelny w tej skali: jedna rzecz
w kadrze, bez drobnych szczegółów i bez tekstu na obrazku.

---

## ⚠️ Dwie zasady

**Żadna odpowiedź nie może wyglądać lepiej od sąsiedniej.** W jednym pytaniu
trzymajcie tę samą porę dnia, ten sam typ ujęcia i ten sam nastrój. „Wypaliłem
się" nie może wyglądać na załamanie, a „zarabiam za mało" na biedę: to są
odpowiedzi o sytuacji, nie oceny człowieka.

**Bohaterowie 16 do 24 lata**, poza pytaniami dla zmieniających zawód
(`branza`, `staz_pracy`, `powod_zmiany`, `blokada`), gdzie naturalne jest
24 do 35 lat.

---

## Kolejność

Tabele idą w kolejności, w jakiej uczestnik spotyka pytania. Kolumna „kto
widzi" mówi, na której ścieżce pytanie się pojawia: **nikt nie zobaczy
wszystkich 104 kadrów**, jedna osoba widzi od 11 do 14 pytań.


### etap · Na jakim etapie nauki jesteś?

**Kto widzi:** wszyscy · **plików: 9**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-etap-podstawowka.png` | Ostatnia klasa szkoły podstawowej | Ostatnia klasa podstawówki: uczeń 14-15 lat przed szkołą, plecak, koledzy w tle. |
| `a0-etap-liceum_1_2.png` | Liceum lub technikum, klasa pierwsza lub druga | Korytarz liceum, uczniowie 16-17 lat między lekcjami, zwyczajny dzień. |
| `a0-etap-liceum_maturalna.png` | Liceum lub technikum, klasa przedmaturalna lub maturalna | Klasa maturalna: uczeń 18 lat przy ławce z arkuszem i notatkami, skupienie bez stresu. |
| `a0-etap-branzowa.png` | Szkoła branżowa | Pracownia szkoły branżowej: uczeń w fartuchu albo kombinezonie przy stanowisku. |
| `a0-etap-po_maturze.png` | Po maturze, przerwa albo szukam kierunku | Osoba 19-20 lat po maturze, na zewnątrz, między jednym a drugim, bez szkoły w kadrze. |
| `a0-etap-studiuje.png` | Studiuję | Kampus albo sala wykładowa, student 20-22 lata z laptopem. |
| `a0-etap-po_studiach.png` | Po studiach | Osoba 23-25 lat z dyplomem albo świeżo po obronie, wnętrze uczelni w tle. |
| `a0-etap-pracuje_zmiana.png` | Pracuję, rozważam zmianę | Osoba 24-30 lat przy swoim stanowisku pracy, spokojna, w trakcie zwykłego dnia. |
| `a0-etap-nie_uczy_nie_pracuje.png` | Nie uczę się i nie pracuję | Osoba 19-24 lata w domu przy oknie, dzień w toku, spokojnie, bez smutku i bez oceny. |

### rozszerzenia · Jakie rozszerzenia planujesz?

**Kto widzi:** ścieżka 1 · **plików: 13**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-przedmiot-matematyka.png` | matematyka | Tablica z zapisanym działaniem albo zeszyt w kratkę z obliczeniami. Bez twarzy. |
| `a0-przedmiot-fizyka.png` | fizyka | Prosty układ doświadczalny: wahadło, siłomierz, obwód. Szkolna pracownia. |
| `a0-przedmiot-chemia.png` | chemia | Szkło laboratoryjne na blacie, probówki i kolba, szkolna pracownia. |
| `a0-przedmiot-biologia.png` | biologia | Mikroskop i preparat albo model anatomiczny na blacie. |
| `a0-przedmiot-geografia.png` | geografia | Mapa, globus i kompas na stole. |
| `a0-przedmiot-informatyka.png` | informatyka | Ekran z kodem albo schemat blokowy na monitorze, klawiatura. |
| `a0-przedmiot-polski.png` | język polski | Otwarta książka z zakładkami i zeszyt z pismem odręcznym. |
| `a0-przedmiot-jezyki.png` | języki obce | Słowniki dwóch języków i fiszki albo napisy w dwóch alfabetach. |
| `a0-przedmiot-historia.png` | historia | Oś czasu, stara mapa albo źródło archiwalne na biurku. |
| `a0-przedmiot-wos.png` | wiedza o społeczeństwie | Sala debaty szkolnej albo urna i plakietki, przestrzeń publiczna. |
| `a0-przedmiot-artystyczne.png` | przedmioty artystyczne | Sztaluga, pędzle i farby albo instrument, pracownia szkolna. |
| `a0-przedmiot-wf.png` | wychowanie fizyczne | Sala gimnastyczna albo boisko, sprzęt sportowy, bez rywalizacji. |
| `a0-przedmiot-zawodowe.png` | przedmioty zawodowe | Pracownia zawodowa: stanowisko z narzędziami danej branży. |

### przedmioty_mocne · Z czym radzisz sobie w szkole najlepiej? Wskaż trzy.

**Kto widzi:** ścieżka 1, 2, 5 · **plików: 1**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-przedmiot-warsztat.png` | praca w warsztacie lub pracowni | Warsztat albo pracownia, ręce przy pracy z materiałem. |

### matematyka · Jak wygląda u Ciebie matematyka?

**Kto widzi:** ścieżka 1, 2, 5 · **plików: 4**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-matematyka-dobrze.png` | Idzie dobrze, myślę o rozszerzeniu | Zeszyt z rozwiązanym zadaniem i pewna ręka trzymająca długopis. |
| `a0-matematyka-radze_sobie.png` | Radzę sobie, ale bez entuzjazmu | Zeszyt z zadaniem w połowie, spokojna praca. |
| `a0-matematyka-trudna.png` | Jest trudna, ale daję radę | Zadanie z poprawkami i skreśleniami, ale doprowadzone do końca. |
| `a0-matematyka-najwiekszy_problem.png` | To mój największy problem | Zamknięty podręcznik do matematyki odsunięty na bok. Spokojnie, bez dramatu. |

### kierunek_ocena · Na ile ten kierunek okazał się tym, czego oczekiwałeś?

**Kto widzi:** ścieżka 3 · **plików: 3**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-kierunek_ocena-dokladnie.png` | To jest dokładnie to, czego chciałem | Student na zajęciach, wyraźnie zaangażowany, to jest jego miejsce. |
| `a0-kierunek_ocena-w_porzadku.png` | Jest w porządku, ale nie porywa | Student na wykładzie, obecny, ale bez iskry. Neutralnie. |
| `a0-kierunek_ocena-zupelnie_nie.png` | Zupełnie nie to, czego się spodziewałem | Student patrzący przez okno sali, myślami gdzie indziej. Bez oceniania. |

### wyksztalcenie · Co skończyłeś?

**Kto widzi:** ścieżka 4 · **plików: 7**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-wyksztalcenie-podstawowe.png` | Szkołę podstawową | Budynek szkoły podstawowej albo świadectwo ukończenia. |
| `a0-wyksztalcenie-branzowe.png` | Szkołę branżową albo zawodową | Warsztat szkoły branżowej i świadectwo czeladnicze. |
| `a0-wyksztalcenie-srednie.png` | Liceum albo technikum | Budynek liceum albo świadectwo ukończenia szkoły średniej. |
| `a0-wyksztalcenie-technikum_matura.png` | Technikum z maturą | Pracownia technikum i świadectwo dojrzałości obok. |
| `a0-wyksztalcenie-licencjat.png` | Studia licencjackie albo inżynierskie | Dyplom licencjata albo inżyniera na biurku. |
| `a0-wyksztalcenie-magister.png` | Studia magisterskie | Toga i dyplom magisterski, aula w tle. |
| `a0-wyksztalcenie-podyplomowe.png` | Studia podyplomowe albo doktorat | Biblioteka uczelniana i dyplom podyplomowy albo doktorski. |

### branza · Czym się zajmujesz albo zajmowałeś zawodowo?

**Kto widzi:** ścieżka 4 · **plików: 15**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-branza-handel.png` | Handel i sprzedaż | Lada sklepowa, obsługa klienta, zwyczajny dzień. |
| `a0-branza-biuro.png` | Biuro i administracja | Biurko z dokumentami i monitorem, praca administracyjna. |
| `a0-branza-produkcja.png` | Produkcja i magazyn | Hala produkcyjna albo magazyn, regały i wózek. |
| `a0-branza-budowlanka.png` | Budownictwo i instalacje | Budowa albo instalacja: rusztowanie, narzędzia, kask. |
| `a0-branza-transport.png` | Transport i logistyka | Kabina ciężarówki albo plac przeładunkowy. |
| `a0-branza-gastronomia.png` | Gastronomia i hotelarstwo | Kuchnia restauracyjna albo recepcja hotelowa. |
| `a0-branza-opieka.png` | Opieka, zdrowie, praca z ludźmi | Gabinet albo dom opieki, kontakt z drugą osobą, spokojnie. |
| `a0-branza-edukacja.png` | Edukacja i szkolenia | Sala zajęć, osoba prowadząca przy tablicy. |
| `a0-branza-it.png` | Informatyka i technologie | Stanowisko programistyczne, dwa monitory z kodem. |
| `a0-branza-kreatywne.png` | Media, projektowanie, twórczość | Pracownia projektowa albo plan zdjęciowy, sprzęt twórczy. |
| `a0-branza-uslugi.png` | Usługi osobiste i rzemiosło | Salon albo zakład rzemieślniczy, praca rękami przy kliencie. |
| `a0-branza-sluzby.png` | Służby mundurowe i ochrona | Mundur i sprzęt służby, dyżur, bez scen dramatycznych. |
| `a0-branza-rolnictwo.png` | Rolnictwo, przyroda, zwierzęta | Pole, szklarnia albo obora, praca przy roślinach lub zwierzętach. |
| `a0-branza-inne.png` | Coś innego | Neutralna scena pracy, której nie da się przypisać do branży. |
| `a0-branza-nie_pracowalem.png` | Nie pracowałem zawodowo | Osoba młoda w domu albo w szkole, przed pierwszą pracą. |

### staz_pracy · Jak długo?

**Kto widzi:** ścieżka 4 · **plików: 4**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-staz_pracy-do_roku.png` | Do roku | Pierwsze miesiące w pracy: osoba uczy się przy kimś. |
| `a0-staz_pracy-rok_trzy.png` | Od roku do trzech lat | Osoba pewna w swoim stanowisku, ale nadal z kimś obok. |
| `a0-staz_pracy-powyzej_trzech.png` | Powyżej trzech lat | Osoba prowadzi zadanie samodzielnie, pokazuje coś młodszemu. |
| `a0-staz_pracy-nie_pracowalem.png` | Nie pracowałem zawodowo | Neutralny kadr: osoba przed pierwszym doświadczeniem zawodowym. |

### powod_zmiany · Dlaczego szukasz zmiany?

**Kto widzi:** ścieżka 4 · **plików: 8**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-powod_zmiany-brak_pracy_w_zawodzie.png` | Nie znalazłem pracy w swoim zawodzie | Dyplom na biurku obok ogłoszeń z innej branży. |
| `a0-powod_zmiany-nie_to_czego_chcialem.png` | Znalazłem, ale to nie jest to, czego chciałem | Osoba przy biurku, praca idzie, ale to nie jest to. Neutralnie. |
| `a0-powod_zmiany-wypalenie.png` | Wypaliłem się | Osoba odsuwa się od ekranu pod koniec dnia. Zmęczenie, nie rozpacz. |
| `a0-powod_zmiany-zdrowie.png` | Zdrowie nie pozwala mi robić tego dalej | Ręka z opaską albo plecy przy podnoszeniu. Fakt, nie cierpienie. |
| `a0-powod_zmiany-zarobki.png` | Zarabiam za mało | Rachunki i kalkulator na stole kuchennym. |
| `a0-powod_zmiany-na_swoim.png` | Chcę pracować na swoim | Mały własny lokal albo warsztat, szyld w robocie. |
| `a0-powod_zmiany-sytuacja_zyciowa.png` | Zmieniła się moja sytuacja życiowa | Przeprowadzka albo małe dziecko w tle codzienności. |
| `a0-powod_zmiany-zawsze_co_innego.png` | Zawsze chciałem robić coś innego | Notes ze szkicami czegoś zupełnie innego niż obecna praca. |

### blokada · Co dziś najbardziej Cię blokuje?

**Kto widzi:** ścieżka 4 · **plików: 7**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-blokada-nie_wiem_co.png` | Nie wiem, co chciałbym robić | Pusta kartka i długopis, człowiek przed decyzją. |
| `a0-blokada-nie_mam_jak.png` | Wiem, ale nie mam jak zacząć | Zamknięte drzwi z domofonem, ktoś stoi przed nimi. |
| `a0-blokada-uprawnienia.png` | Brakuje mi uprawnień albo wykształcenia | Formularz wymagań albo certyfikat, którego brakuje. |
| `a0-blokada-koszt.png` | Nie stać mnie na przekwalifikowanie | Cennik kursu i portfel, rachunek nie wychodzi. |
| `a0-blokada-przerwa_w_zarobkach.png` | Nie mogę sobie pozwolić na przerwę w zarobkach | Kalendarz z wypłatami i przerwa zaznaczona pośrodku. |
| `a0-blokada-rodzina.png` | Zobowiązania rodzinne | Dziecko albo osoba starsza w domu, codzienna opieka. |
| `a0-blokada-od_czego_zaczac.png` | Nic konkretnego, po prostu nie wiem, od czego zacząć | Rozdroże, kilka ścieżek, nikt nie wskazuje kierunku. |

### doswiadczenie · Co z tego już robiłeś? Zaznacz wszystko, co pasuje.

**Kto widzi:** wszyscy · **plików: 10**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-doswiadczenie-praca_doryw.png` | Praca dorywcza albo wakacyjna | Praca wakacyjna: ogródek gastronomiczny albo magazyn latem. |
| `a0-doswiadczenie-praca_stala.png` | Praca stała | Regularne stanowisko pracy, identyfikator, rutyna dnia. |
| `a0-doswiadczenie-wolontariat.png` | Wolontariat | Zbiórka albo akcja społeczna, koszulka wolontariusza. |
| `a0-doswiadczenie-firma_rodzinna.png` | Pomoc w rodzinnej firmie albo gospodarstwie | Rodzinny sklep, warsztat albo gospodarstwo, dwa pokolenia. |
| `a0-doswiadczenie-projekty.png` | Własne projekty, które ktoś zobaczył | Własny projekt pokazany komuś: makieta, aplikacja, wystawa. |
| `a0-doswiadczenie-hobby.png` | Hobby uprawiane od kilku lat | Pasja uprawiana od lat: sprzęt zużyty od używania. |
| `a0-doswiadczenie-prowadzenie.png` | Prowadzenie czegoś w szkole albo w grupie | Osoba prowadzi grupę w szkole albo na obozie. |
| `a0-doswiadczenie-praktyki.png` | Praktyki, staż albo praca studencka | Praktykant przy stanowisku, ktoś obok tłumaczy. |
| `a0-doswiadczenie-kursy.png` | Kursy albo szkolenia poza szkołą | Sala szkoleniowa albo kurs online, certyfikat. |
| `a0-doswiadczenie-konkursy.png` | Konkursy, olimpiady, zawody | Dyplom konkursowy, scena albo zawody, moment ogłoszenia. |

### miejsce · Gdzie mieszkasz?

**Kto widzi:** wszyscy · **plików: 5**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-miejsce-wies.png` | Wieś | Wieś z lotu ptaka albo droga między polami, kilka domów. |
| `a0-miejsce-male_miasto.png` | Miasto do 20 tysięcy | Rynek małego miasteczka, niska zabudowa. |
| `a0-miejsce-srednie_miasto.png` | Miasto 20 do 100 tysięcy | Miasto powiatowe: kamienice, ruch uliczny, skala średnia. |
| `a0-miejsce-duze_miasto.png` | Miasto 100 do 500 tysięcy | Miasto wojewódzkie: tramwaj, wyższa zabudowa. |
| `a0-miejsce-wielkie_miasto.png` | Duże miasto powyżej 500 tysięcy | Panorama dużego miasta z wieżowcami. |

### mobilnosc · Czy jesteś gotów przeprowadzić się dla nauki albo pracy?

**Kto widzi:** wszyscy · **plików: 4**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-mobilnosc-tak_daleko.png` | Tak, także daleko | Walizka i mapa Polski, dworzec, gotowość do wyjazdu. |
| `a0-mobilnosc-tak_region.png` | Tak, ale w granicach mojego regionu | Droga regionalna z drogowskazami do sąsiednich miast. |
| `a0-mobilnosc-wolalbym_nie.png` | Wolałbym nie | Osoba na progu własnego domu, waha się. |
| `a0-mobilnosc-nie.png` | Nie, to nie wchodzi w grę | Dom i okolica jako miejsce, w którym się zostaje. |

### dojazd · Czy dojazd do dużego miasta jest dla Ciebie realny na co dzień?

**Kto widzi:** wszyscy · **plików: 3**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-dojazd-blisko.png` | Tak, mieszkam blisko | Przystanek tuż przy domu, miasto w zasięgu wzroku. |
| `a0-dojazd-godzina.png` | Tak, ale to godzina w jedną stronę | Pociąg albo autobus podmiejski, godzina drogi, widok z okna. |
| `a0-dojazd-nie.png` | Nie | Droga bez połączeń, pusty przystanek, duża odległość. |

### zasoby · Część dróg zawodowych wymaga opłacenia kursów, uprawnień albo sprzętu. Bywa to od kilku tysięcy do kilkudziesięciu. Na ile realne jest to w Twojej sytuacji w ciągu najbliższych lat?

**Kto widzi:** wszyscy · **plików: 4**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-zasoby-realne.png` | Realne, gdyby to była dobra droga | Opłacony kurs i sprzęt gotowy do startu. |
| `a0-zasoby-raty.png` | Trudne, ale przy rozłożeniu na raty albo dofinansowaniu możliwe | Umowa z rozłożeniem na raty albo wniosek o dofinansowanie. |
| `a0-zasoby-bardzo_trudne.png` | Bardzo trudne, musiałbym zarobić na to sam | Skarbonka albo oszczędności odkładane miesiąc po miesiącu. |
| `a0-zasoby-nierealne.png` | Nierealne | Darmowe zasoby: biblioteka, kurs online za zero złotych. |

### ograniczenia · Czy jest coś, o czym warto wiedzieć przy dobieraniu ścieżek?

**Kto widzi:** wszyscy · **plików: 7**

| plik | odpowiedź | co ma być w kadrze |
|---|---|---|
| `a0-ograniczenia-alergie_wziewne.png` | Alergie wziewne, na przykład na mąkę, pył, sierść | Maska przeciwpyłowa i mąka albo pył w powietrzu. |
| `a0-ograniczenia-alergie_skorne.png` | Alergie skórne, na przykład na chemikalia i preparaty | Rękawice ochronne i preparaty chemiczne. |
| `a0-ograniczenia-kregoslup.png` | Ograniczenia ruchowe albo problemy z kręgosłupem | Podnoszenie ciężaru z prawidłową postawą, pas lędźwiowy. |
| `a0-ograniczenia-wzrok.png` | Wada wzroku, której nie da się w pełni skorygować | Okulary i drobny druk albo ekran z powiększeniem. |
| `a0-ograniczenia-sluch.png` | Ubytek słuchu | Aparat słuchowy albo ochronniki słuchu w hałaśliwym miejscu. |
| `a0-ograniczenia-wysokosc.png` | Lęk wysokości | Rusztowanie albo drabina widziane z dołu. |
| `a0-ograniczenia-inne.png` | Coś innego, o czym chcę powiedzieć prowadzącemu | Neutralna rozmowa z prowadzącym przy stole. |

---

## Czego NIE zamawiam

**Opcji wyjścia.** „Jeszcze nie wiem", „Nic z tego", „Nie zdawałem żadnego
rozszerzenia", „Nie chcę odpowiadać" i „Nic z powyższych" renderują się jako
szeroka karta bez kadru. To jest wyjście z pytania, nie jedna z odpowiedzi,
i kadr stawiałby je na równi z treścią.

**Osobnych przedmiotów na każde pytanie.** Matematyka wygląda tak samo, gdy
uczestnik ją planuje, gdy ją zdaje i gdy się z nią męczy: różni się pytanie,
nie przedmiot. Czternaście plików obsługuje sześć pytań zamiast osiemdziesięciu.

**Pól tekstowych** (`kierunek`, `wyksztalcenie_kierunek`, `miejsce_nazwa`).
Tam uczestnik pisze, a nie wybiera.
