# Reszta polskich znaków — lista do dopisania w słowniku

Paczka zaimportowana, liczby bez zmian: **27 obszarów, 157 zawodów, 75 kierunków,
56 dróg bez studiów, 26 klastrów (54 zawody), 157 kart**.

Poniżej to, co słownik jeszcze przepuścił. Znalezione porównaniem każdego słowa
z jego wersją występującą gdzie indziej w dokumentacji, potem sprawdzone w
kontekście zdania, więc formy gramatyczne poprawne („administracja" obok
„administracją") są już odsiane.

Dwie grupy: **zgubiony znak wewnątrz słowa** i **końcówka `-a` zamiast `-ą`,
`-e` zamiast `-ę`**. Tej drugiej słownik nie łapie z definicji, bo obie formy
istnieją.

---

## Nazwy obszarów — pomyłka po mojej stronie

**Wycofuję zgłoszenie.** Nazwy obszarów są poprawne i były poprawne cały czas.
Porównałem wszystkie 27 z nagłówkami w `obszary_27_opis.md` — zgadzają się co do
znaku. Policzyłem wcześniej „14 na 27 bez znaków", licząc nazwy bez **ani jednej**
polskiej litery, a większość z nich żadnej nie potrzebuje: „Prawo", „Transport i
logistyka", „Marketing i komunikacja". Parser jest w porządku, źródło też.

---

## Kierunki — pole „co się tam robi"

| kod | jest | ma być |
|---|---|---|
| `miedzynarodowe` | jezyki | **języki** |
| `informatyka` | Dużo teorii przed praktyka | przed **praktyką** |
| `inz_biomedyczna` | sygnaly biomedyczne | **sygnały** |
| `budownictwo` | technologia robot | technologia **robót** |
| `filologia_ang` | Jezyk, literatura … mniej praktycznego jezyka | **Język** … **języka** |
| `filologia_inne` | przy rzadszym jezyku | **języku** |
| `muzyka_kier` | gra zespolowa | gra **zespołowa** |
| `aktorstwo` | praca przed kamera | przed **kamerą** |

## Kierunki — pole „czego nie daje"

| kod | jest | ma być |
|---|---|---|
| `logistyka` | Znajomości jezyka | **języka** |
| `filologia_ang` | Znajomość jezyka | **języka** |
| `filologia_inne` | Praktycznego jezyka … poza uczelnia | **języka** … poza **uczelnią** |
| `teologia` | Liczba etatow | **etatów** |
| `muzyka_kier` | Większość muzykow | **muzyków** |
| `administracja_kier` | nastawiony na administrację publiczna | **publiczną** |
| `informatyka` | Pierwsza prace zdobywa się portfolio | **Pierwszą pracę** |
| `farmacja` | presję sprzedażowa … która jest główna przyczyną | **sprzedażową** … **główną** |
| `kosmetologia` | Granicy z medycyna estetyczna | z **medycyną estetyczną** |

## Klastry — pytanie rozstrzygające

| kod | jest | ma być |
|---|---|---|
| `sprzedaz_terenowa` | Wolisz stała pensję z prowizja | **stałą** pensję z **prowizją** |
| `prawo_urzad` | nadawać dokumentom moc prawna | moc **prawną** |
| `szkola` | uczyć przedmiotu cała klasę | **całą** klasę |
| `wlasna_firma` | usługę, która wykonujesz z ekipa | **którą** … z **ekipą** |
| `instalacje` | Prad czy woda? | **Prąd** czy woda? |

## Klastry — opis różnicy

| kod | jest | ma być |
|---|---|---|
| `sprzedaz_terenowa` | ma podstawę i samochod | **samochód** |
| `analiza_fin` | musi im mówić, ze nie ma | **że** nie ma |
| `prawnicy` | prowadzi własna praktykę … ma stała pensję | **własną** … **stałą** |
| `prawo_urzad` | prowadzi własna kancelarię | **własną** |
| `ratownictwo_teren` | Ratownik gorski … łączy to z inna praca | **górski** … z **inną pracą** |
| `budowlanka_biuro` | który rosnie najszybciej | **rośnie** |
| `instalacje` | w kontakcie z kanalizacja | z **kanalizacją** |
| `serwis_techniczny` | spędza jedna czwarta czasu | **jedną czwartą** |
| `transport_biuro` | często z prowizja … zarządza własna flota | z **prowizją** … **własną flotą** |
| `opieka_bezposrednia` | także za granica | za **granicą** |
| `szkola` | prowadzi 30-osobowa grupe | **30-osobową grupę** |
| `projektowanie_wiz` | pracuje z forma i marka | z **formą i marką** |
| `wlasna_firma` | koszty stale … można ja zacząć … nie osiaga trwalej | **stałe** … **ją** … **osiąga trwałej** |

## Drogi bez studiów

| kod | jest | ma być |
|---|---|---|
| `nabor_ratownictwo` | Kursy ratownictwa gorskiego | **górskiego** |
| `kurs_lektorski` | Certyfikat jezykowy | **językowy** |

Do tego **pole `koszt` w 27 z 56 dróg** ma `zl` zamiast `zł`: „1500 do 3500 zl",
„20 do 500 tys. zl". To widać w raporcie przy każdej drodze bez studiów.

---

Poprawki są jednoznaczne, więc mogę je wprowadzić od ręki, jeśli wolisz nie
wracać do słownika. Czekam na decyzję — nie ruszam plików źródłowych sam.
