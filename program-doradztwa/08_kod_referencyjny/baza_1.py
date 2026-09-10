# -*- coding: utf-8 -*-
"""
BAZA ZAWODOW, POSTAC DANYCH
152 zawody zakodowane ze 17 dokumentow z kartami.
Pola: obszar, poziom, studia, A1, A2 rdzen, A2 wspierajace, A3, A4+, A4-, A5, M1,
antyprofil, koszt, flaga, zagrozenie, zdanie kierunkowe, klaster,
oraz pola z audytu A0: duze_miasto, teren, przeciwwskazania, przedmioty, doswiadczenie.
"""

# ================= SLOWNIKI KONTROLOWANE =================

A1_KODY = """przekonywanie prowadzenie planowanie liczby pieniadze porzadek precyzja prawo
tech dociekanie naprawianie rece ruch przyroda zdrowie opieka rozmowa uczenie wspolnota
obraz pisanie dzwiek scena przedsiebiorczosc""".split()

A2_KODY = """problemy analiza system uczenie_sie zapamietywanie dokladnosc rachunki reguly
organizowanie wielozadaniowosc manualne sprzet wytrzymalosc przestrzenna estetyka tworzenie
slowo wystapienia przekonywanie negocjowanie wyczuwanie opiekunczosc cierpliwosc uprzejmosc
rozbrajanie prowadzenie_grupy wyjasnianie opanowanie samodzielnosc odpornosc
konfrontacja wytrwalosc zespol""".split()

A3_KODY = """struktura elastycznosc cisza bodzce glebia szerokosc samodzielnie zespol
dokladnosc tempo ludzie rzeczy inicjatywa reagowanie konfrontacja zgoda ryzyko bezpieczenstwo
efekt_widoczny efekt_odroczony wlasne_pomysly gotowe powtarzalnosc zmiennosc""".split()

A4_KODY = """pieniadze stabilnosc wolnosc wplyw sens uznanie rozwoj mistrzostwo relacje
czas_dla_siebie zasady zmiennosc wspolnota bezpieczenstwo cisza efekt_widoczny""".split()

A5_KODY = """studia dlugie_studia egzaminy doksztalcanie zmiany noce weekendy dyzury
nadgodziny nieregularne wyjazdy przeprowadzka fizyczna stanie dzwiganie brud halas goraco
zimno wysokosc kazda_pogoda krew chorzy umieranie agresja ludzie_ciagle roszczeniowi
wystapienia komputer samotnosc presja odpowiedzialnosc niepewny_dochod wlasna_dzialalnosc
ryzyko_finansowe powtarzalnosc dzieci ciasnota chemikalia wieczory zagranica""".split()

M1_KODY = """osiadlosc mobilnosc duza_organizacja maly_zespol wlasne zdalna stacjonarna
duzo_godzin mniej_godzin granica_ostra przenika szybkie_wejscie dluga_inwestycja
wysoki_poziom_zycia prowadzenie""".split()

ANTY_KODY = """potrzeba_ludzi potrzeba_ciszy potrzeba_ruchu potrzeba_stabilnosci
efekt_szybki efekt_widoczny kontrola_efektu nuda_powtarzalnosc unikanie_konfliktu
cudza_zlosc krytyka_osobista odmowa_do_siebie zabieranie_do_domu umieranie fizycznosc
dotyk brud_nie ciasnota_nie wysokosc_nie stanie_nie kregoslup_slaby rece_slabe wzrok_slaby
sluch_slaby potrzeba_uznania potrzeba_rozwoju sprzedaz_nie dokumentacja_nie procedury_nie
bez_ograniczen nietykalnosc_pracy doksztalcanie_nie weekendy_nie noce_nie wieczory_nie
stala_pensja samodyscyplina_brak mierzenie potrzeba_decydowania waska_wiedza agresja bez_uzasadnienia
bez_zawodu goraco_nie komunikacja_ostra konflikt_rodzic konfrontacja_nie potrzeba_doradzania
potrzeba_gotowania potrzeba_jakosci potrzeba_pewnosci potrzeba_prywatnosci potrzeba_relacji
potrzeba_tworzenia potrzeba_zmiennosci rachunki_nie samotnosc_w_roli tworczosc_od_razu
wczesne_wstawanie wizualizacje_tylko""".split()

PRZEDM = """matematyka fizyka chemia biologia informatyka polski jezyki historia wos
geografia artystyczne wf zawodowe rysunek""".split()

PRZECIW = "alergie_wziewne alergie_skorne kregoslup wzrok sluch wysokosc".split()

DOSW = """praca_doryw praca_stala wolontariat firma_rodzinna projekty hobby prowadzenie
kursy konkursy""".split()

KOSZTY = "zerowy bardzo_niski niski sredni wysoki bardzo_wysoki".split()
ZAGROZ = "bardzo_niskie niskie umiarkowane wysokie bardzo_wysokie".split()
POZIOMY = "szybki sredni dlugi bardzo_dlugi".split()

Z = {}

def z(kod, nazwa, obszar, poziom, studia, a1, a2r, a2w, a3, a4p, a4m, a5, m1,
      anty, koszt, flaga, zagr, kier=None, klaster=None,
      miasto=False, teren=False, przeciw="", przedm="", dosw=""):
    Z[kod] = dict(
        nazwa=nazwa, obszar=obszar, poziom=poziom, studia=studia,
        a1=a1.split(), a2r=a2r.split(), a2w=a2w.split(), a3=a3.split(),
        a4p=a4p.split(), a4m=a4m.split(), a5=a5.split(), m1=m1.split(),
        anty=anty.split(), koszt=koszt, flaga=flaga, zagr=zagr,
        kier=kier, klaster=klaster, duze_miasto=miasto, teren=teren,
        przeciw=przeciw.split(), przedm=przedm.split(), dosw=dosw.split())

# ============================================================
# GRUPA 1: BIZNES I WPLYW  (obszary 1, 2, 3, 27)
# ============================================================

# --- obszar 1: biznes, strategia, zarzadzanie ---
z("project_manager","Project manager",1,"sredni","czesciowo",
  "planowanie prowadzenie porzadek","organizowanie wielozadaniowosc prowadzenie_grupy",
  "rozbrajanie opanowanie system","struktura konfrontacja szerokosc",
  "wplyw rozwoj pieniadze","czas_dla_siebie",
  "komputer ludzie_ciagle nadgodziny presja","duza_organizacja przenika",
  "efekt_widoczny unikanie_konfliktu potrzeba_decydowania","niski","docelowy","umiarkowane",
  "Ucz sie dziedziny projektu, nie tylko administrowania tablica", miasto=True, dosw="prowadzenie")

z("product_manager","Product manager",1,"sredni","czesciowo",
  "prowadzenie liczby tech","analiza system przekonywanie",
  "wyczuwanie tworzenie negocjowanie","inicjatywa szerokosc konfrontacja",
  "wplyw rozwoj pieniadze","stabilnosc",
  "komputer ludzie_ciagle presja","zdalna duza_organizacja",
  "potrzeba_decydowania efekt_widoczny procedury_nie","niski","docelowy","niskie",
  miasto=True, przedm="matematyka informatyka", dosw="projekty prowadzenie")

z("analityk_biznesowy","Analityk biznesowy",1,"sredni","czesciowo",
  "porzadek liczby uczenie","analiza system wyjasnianie",
  "dokladnosc wyczuwanie slowo","dokladnosc ludzie struktura",
  "rozwoj mistrzostwo stabilnosc","zmiennosc",
  "komputer doksztalcanie nadgodziny","duza_organizacja zdalna",
  "dokumentacja_nie efekt_szybki nuda_powtarzalnosc","niski","docelowy","umiarkowane",
  "Ucz sie rozmowy z ludzmi, nie tylko dokumentowania", przedm="matematyka informatyka")

z("konsultant","Konsultant biznesowy",1,"dlugi","tak",
  "liczby prowadzenie przekonywanie","analiza system wystapienia",
  "uczenie_sie opanowanie slowo","tempo inicjatywa szerokosc",
  "pieniadze rozwoj uznanie","czas_dla_siebie stabilnosc",
  "studia wyjazdy nadgodziny presja wystapienia","przenika duzo_godzin wysoki_poziom_zycia",
  "kontrola_efektu krytyka_osobista weekendy_nie","niski","docelowy","umiarkowane",
  miasto=True, przedm="matematyka", dosw="konkursy projekty")

z("kierownik_zespolu","Kierownik zespolu",1,"dlugi","czesciowo",
  "prowadzenie planowanie rozmowa","prowadzenie_grupy organizowanie rozbrajanie",
  "wyczuwanie przekonywanie opanowanie","inicjatywa konfrontacja ludzie",
  "wplyw pieniadze rozwoj","mistrzostwo",
  "ludzie_ciagle odpowiedzialnosc presja","duza_organizacja prowadzenie",
  "unikanie_konfliktu waska_wiedza potrzeba_uznania","zerowy","docelowy","bardzo_niskie",
  dosw="prowadzenie praca_stala")

# --- obszar 2: marketing i komunikacja ---
z("spec_marketingu","Specjalista marketingu",2,"szybki","nie",
  "przekonywanie pisanie obraz","przekonywanie slowo tworzenie",
  "analiza wielozadaniowosc estetyka","zmiennosc tempo inicjatywa",
  "rozwoj zmiennosc uznanie","stabilnosc",
  "komputer nadgodziny presja","zdalna szybkie_wejscie",
  "efekt_widoczny mierzenie nietykalnosc_pracy","niski","docelowy","wysokie",
  "Celuj w analityke albo strategie, nie w wykonawstwo", klaster="marketing_tresc",
  przedm="polski informatyka", dosw="projekty hobby")

z("copywriter","Copywriter",2,"szybki","nie",
  "pisanie przekonywanie obraz","slowo przekonywanie tworzenie",
  "analiza samodzielnosc estetyka","cisza samodzielnie glebia",
  "wolnosc mistrzostwo rozwoj","stabilnosc relacje",
  "komputer niepewny_dochod samotnosc wlasna_dzialalnosc","zdalna wlasne",
  "nietykalnosc_pracy potrzeba_ludzi samodyscyplina_brak sprzedaz_nie",
  "zerowy","docelowy","bardzo_wysokie",
  "Celuj w copywriting sprzedazowy albo branzowy, nie w tresci masowe",
  klaster="marketing_tresc", przedm="polski", dosw="projekty hobby")

z("social_media","Social media manager",2,"szybki","nie",
  "obraz pisanie scena","tworzenie estetyka slowo",
  "wielozadaniowosc uprzejmosc odpornosc","tempo bodzce elastycznosc",
  "zmiennosc uznanie rozwoj","stabilnosc czas_dla_siebie",
  "komputer nieregularne roszczeniowi","przenika zdalna",
  "cudza_zlosc efekt_widoczny doksztalcanie_nie","zerowy","docelowy","umiarkowane",
  "Buduj obecnosc niezalezna od jednej platformy", przedm="polski artystyczne", dosw="projekty hobby")

z("seo","Specjalista SEO",2,"szybki","nie",
  "liczby tech porzadek","analiza system dokladnosc",
  "wytrzymalosc problemy samodzielnosc","cisza dokladnosc samodzielnie",
  "mistrzostwo rozwoj wolnosc","relacje",
  "komputer doksztalcanie","zdalna",
  "efekt_szybki kontrola_efektu potrzeba_ludzi","bardzo_niski","docelowy","wysokie",
  "Ucz sie mechanizmow wyszukiwania, nie narzedzi", przedm="informatyka matematyka")

z("pr","Specjalista PR",2,"sredni","czesciowo",
  "pisanie przekonywanie prawo","slowo przekonywanie opanowanie",
  "wyczuwanie rozbrajanie analiza","tempo konfrontacja ludzie",
  "wplyw uznanie zmiennosc","stabilnosc",
  "nieregularne presja ludzie_ciagle","przenika",
  "unikanie_konfliktu wieczory_nie stala_pensja","niski","docelowy","niskie",
  miasto=True, przedm="polski jezyki", dosw="projekty")

z("brand_manager","Brand manager",2,"dlugi","czesciowo",
  "przekonywanie obraz prowadzenie","estetyka analiza system",
  "przekonywanie tworzenie organizowanie","glebia struktura ludzie",
  "wplyw uznanie mistrzostwo pieniadze","zmiennosc",
  "komputer ludzie_ciagle presja","duza_organizacja duzo_godzin",
  "efekt_szybki kontrola_efektu nietykalnosc_pracy","niski","docelowy","niskie",
  miasto=True, przedm="polski artystyczne")

# --- obszar 3: sprzedaz ---
z("handlowiec","Przedstawiciel handlowy",3,"szybki","nie",
  "przekonywanie prawo przedsiebiorczosc","przekonywanie negocjowanie odpornosc",
  "wyczuwanie samodzielnosc uprzejmosc","inicjatywa ryzyko tempo",
  "pieniadze wolnosc uznanie","stabilnosc",
  "ludzie_ciagle wyjazdy niepewny_dochod presja","duzo_godzin wysoki_poziom_zycia mobilnosc",
  "odmowa_do_siebie stala_pensja mierzenie samodyscyplina_brak",
  "zerowy","docelowy","umiarkowane",
  "Celuj w sprzedaz zlozona, nie w prosta", klaster="sprzedaz_terenowa", dosw="praca_doryw")

z("account_manager","Account manager",3,"sredni","nie",
  "przekonywanie rozmowa planowanie","negocjowanie wyczuwanie uprzejmosc",
  "organizowanie wielozadaniowosc rozbrajanie","ludzie elastycznosc tempo",
  "relacje pieniadze stabilnosc","czas_dla_siebie",
  "ludzie_ciagle roszczeniowi presja","zdalna duza_organizacja",
  "cudza_zlosc unikanie_konfliktu","zerowy","docelowy","niskie", dosw="praca_doryw")

z("doradca_bank","Doradca klienta w banku",3,"szybki","czesciowo",
  "pieniadze przekonywanie rozmowa","przekonywanie uprzejmosc rachunki",
  "reguly wyczuwanie dokladnosc","ludzie struktura powtarzalnosc",
  "stabilnosc pieniadze relacje","wolnosc mistrzostwo",
  "ludzie_ciagle roszczeniowi weekendy komputer","osiadlosc granica_ostra",
  "sprzedaz_nie nuda_powtarzalnosc cudza_zlosc","zerowy","trampolina","wysokie",
  "Dobra pierwsza praca, zaplanuj wyjscie w ciagu kilku lat", przedm="matematyka")

z("agent_nieruchomosci","Agent nieruchomosci",3,"szybki","nie",
  "przekonywanie prawo przedsiebiorczosc","przekonywanie negocjowanie odpornosc",
  "samodzielnosc wyczuwanie organizowanie","ryzyko inicjatywa elastycznosc",
  "pieniadze wolnosc","stabilnosc czas_dla_siebie",
  "weekendy nieregularne niepewny_dochod ludzie_ciagle","przenika wysoki_poziom_zycia",
  "stala_pensja weekendy_nie odmowa_do_siebie","niski","docelowy","umiarkowane",
  klaster="sprzedaz_terenowa", dosw="praca_doryw")

z("business_dev","Business development manager",3,"dlugi","czesciowo",
  "przekonywanie prawo prowadzenie","negocjowanie przekonywanie analiza",
  "system odpornosc wyczuwanie","ryzyko inicjatywa szerokosc",
  "pieniadze wplyw rozwoj","stabilnosc",
  "wyjazdy ludzie_ciagle presja","mobilnosc duzo_godzin",
  "efekt_szybki odmowa_do_siebie","zerowy","docelowy","niskie",
  miasto=True, przedm="jezyki")

# --- obszar 27: przedsiebiorczosc ---
z("wlasciciel_uslugowej","Wlasciciel firmy uslugowej",27,"sredni","nie",
  "przedsiebiorczosc przekonywanie prowadzenie","odpornosc przekonywanie samodzielnosc",
  "organizowanie rachunki prowadzenie_grupy","ryzyko inicjatywa konfrontacja",
  "wolnosc pieniadze wplyw","stabilnosc czas_dla_siebie",
  "wlasna_dzialalnosc niepewny_dochod nadgodziny ryzyko_finansowe presja","wlasne przenika maly_zespol",
  "stala_pensja waska_wiedza unikanie_konfliktu","sredni","docelowy","niskie",
  "Najpierw fach, potem firma", klaster="wlasna_firma", dosw="firma_rodzinna praca_stala")

z("wlasciciel_warsztatu","Wlasciciel warsztatu lub zakladu",27,"sredni","nie",
  "przedsiebiorczosc naprawianie rece","manualne samodzielnosc odpornosc",
  "organizowanie rachunki prowadzenie_grupy","samodzielnie inicjatywa efekt_widoczny",
  "wolnosc mistrzostwo pieniadze","czas_dla_siebie",
  "wlasna_dzialalnosc fizyczna niepewny_dochod ryzyko_finansowe odpowiedzialnosc","wlasne osiadlosc stacjonarna",
  "stala_pensja procedury_nie","wysoki","docelowy","bardzo_niskie",
  "Rozwaz przejecie istniejacego zakladu zamiast budowania od zera",
  przeciw="kregoslup", dosw="praca_stala firma_rodzinna")

z("wlasciciel_lokalu","Wlasciciel lokalu gastronomicznego",27,"dlugi","nie",
  "przedsiebiorczosc rece prowadzenie","opanowanie wielozadaniowosc prowadzenie_grupy",
  "rachunki uprzejmosc odpornosc","tempo bodzce ryzyko",
  "wolnosc relacje mistrzostwo","stabilnosc czas_dla_siebie",
  "weekendy zmiany fizyczna ryzyko_finansowe roszczeniowi presja","przenika wlasne",
  "weekendy_nie stala_pensja","bardzo_wysoki","docelowy","niskie",
  "Bez lat w gastronomii ryzyko jest bardzo wysokie", klaster="wlasna_firma", dosw="praca_stala")

z("zalozyciel_tech","Zalozyciel firmy technologicznej",27,"dlugi","nie",
  "przedsiebiorczosc tech przekonywanie","odpornosc samodzielnosc przekonywanie",
  "tworzenie system uczenie_sie","ryzyko inicjatywa wlasne_pomysly",
  "wolnosc wplyw rozwoj","stabilnosc czas_dla_siebie",
  "wlasna_dzialalnosc niepewny_dochod nadgodziny ryzyko_finansowe","przenika wlasne zdalna",
  "stala_pensja potrzeba_stabilnosci sprzedaz_nie","niski","docelowy","niskie",
  "Przewaga nie jest w budowaniu, tylko w dostepie do klientow",
  miasto=True, przedm="informatyka matematyka", dosw="projekty konkursy")

z("franczyzobiorca","Franczyzobiorca",27,"sredni","nie",
  "przedsiebiorczosc prowadzenie planowanie","organizowanie prowadzenie_grupy reguly",
  "rachunki uprzejmosc samodzielnosc","struktura inicjatywa ryzyko",
  "pieniadze stabilnosc wplyw","wolnosc mistrzostwo",
  "wlasna_dzialalnosc ryzyko_finansowe weekendy ludzie_ciagle","wlasne osiadlosc maly_zespol",
  "bez_ograniczen procedury_nie","bardzo_wysoki","docelowy","niskie",
  "Umowa franczyzowa jest najwazniejsza decyzja, przeczytaj z prawnikiem")

print(f"Grupa 1 (biznes): {len(Z)} zawodow")
