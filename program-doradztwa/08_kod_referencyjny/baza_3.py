# -*- coding: utf-8 -*-
"""Czesc 3: obszary 12-18. Rece teren uslugi, Zdrowie i cialo."""

def wpisz(z):
    # ---------- obszar 12: budownictwo ----------
    z("architekt","Architekt",12,"bardzo_dlugi","tak",
      "obraz precyzja naprawianie planowanie","przestrzenna estetyka dokladnosc",
      "system reguly organizowanie","glebia dokladnosc wlasne_pomysly",
      "mistrzostwo uznanie","pieniadze czas_dla_siebie",
      "dlugie_studia egzaminy komputer nadgodziny odpowiedzialnosc","dluga_inwestycja osiadlosc",
      "efekt_szybki bez_ograniczen","sredni","docelowy","umiarkowane",
      "Projektowanie tworcze to 10% pracy, reszta to przepisy i koordynacja",
      miasto=True, przedm="matematyka rysunek artystyczne", dosw="projekty hobby")

    z("inzynier_budownictwa","Inzynier budownictwa",12,"sredni","tak",
      "naprawianie precyzja tech liczby","rachunki przestrzenna dokladnosc",
      "system reguly analiza","dokladnosc struktura glebia",
      "mistrzostwo stabilnosc pieniadze","zmiennosc",
      "studia egzaminy komputer odpowiedzialnosc","osiadlosc duza_organizacja",
      "potrzeba_pewnosci procedury_nie","niski","docelowy","niskie",
      "Rosnie rynek modernizacji istniejacych budynkow",
      klaster="budowlanka_biuro", przedm="matematyka fizyka")

    z("kierownik_budowy","Kierownik budowy",12,"bardzo_dlugi","tak",
      "naprawianie prowadzenie planowanie ruch","organizowanie prowadzenie_grupy opanowanie",
      "problemy reguly rozbrajanie","inicjatywa konfrontacja elastycznosc",
      "wplyw pieniadze mistrzostwo","czas_dla_siebie",
      "studia egzaminy kazda_pogoda wyjazdy odpowiedzialnosc presja nadgodziny",
      "mobilnosc przenika",
      "unikanie_konfliktu potrzeba_pewnosci brud_nie","niski","docelowy","bardzo_niskie",
      przeciw="kregoslup", przedm="matematyka fizyka", dosw="praca_doryw")

    z("kosztorysant","Kosztorysant",12,"sredni","czesciowo",
      "liczby precyzja naprawianie pieniadze","rachunki dokladnosc przestrzenna",
      "analiza wytrzymalosc reguly","dokladnosc cisza struktura",
      "stabilnosc mistrzostwo pieniadze","zmiennosc relacje",
      "komputer nadgodziny powtarzalnosc","granica_ostra zdalna",
      "nuda_powtarzalnosc potrzeba_ludzi","niski","docelowy","umiarkowane",
      "Ucz sie pracy z modelem budynku, nie samego przedmiarowania",
      klaster="budowlanka_biuro", przedm="matematyka")

    z("geodeta","Geodeta",12,"sredni","czesciowo",
      "precyzja liczby ruch tech","dokladnosc rachunki sprzet",
      "przestrzenna reguly samodzielnosc","samodzielnie dokladnosc efekt_widoczny",
      "stabilnosc mistrzostwo wolnosc","relacje uznanie",
      "studia kazda_pogoda fizyczna odpowiedzialnosc","osiadlosc mobilnosc wlasne",
      "unikanie_konfliktu potrzeba_ludzi","wysoki","docelowy","niskie",
      "Ucz sie skanowania i chmur punktow, klasyczny pomiar sie kurczy",
      teren=True, przedm="matematyka geografia")

    z("projektant_instalacji","Projektant instalacji",12,"dlugi","tak",
      "naprawianie tech precyzja liczby","rachunki system przestrzenna",
      "dokladnosc reguly organizowanie","dokladnosc struktura glebia",
      "stabilnosc mistrzostwo pieniadze","uznanie",
      "studia egzaminy komputer odpowiedzialnosc","osiadlosc maly_zespol",
      "potrzeba_uznania","niski","docelowy","bardzo_niskie",
      "Ucz sie pomp ciepla i automatyki budynkowej, tam rosnie rynek",
      klaster="budowlanka_biuro", przedm="matematyka fizyka")

    # ---------- obszar 13: rzemioslo ----------
    z("elektryk","Elektryk",13,"szybki","nie",
      "naprawianie rece precyzja tech","manualne sprzet problemy",
      "dokladnosc samodzielnosc przestrzenna","samodzielnie efekt_widoczny elastycznosc",
      "wolnosc mistrzostwo stabilnosc","uznanie",
      "fizyczna stanie brud ciasnota odpowiedzialnosc","szybkie_wejscie wlasne stacjonarna",
      "ciasnota_nie procedury_nie stala_pensja","sredni","docelowy","bardzo_niskie",
      "Ucz sie fotowoltaiki i automatyki budynkowej",
      klaster="instalacje", przeciw="kregoslup", przedm="fizyka zawodowe", dosw="hobby firma_rodzinna")

    z("hydraulik","Hydraulik",13,"szybki","nie",
      "naprawianie rece precyzja","manualne problemy sprzet",
      "samodzielnosc dokladnosc wytrzymalosc","samodzielnie efekt_widoczny elastycznosc",
      "wolnosc pieniadze mistrzostwo","uznanie czas_dla_siebie",
      "fizyczna brud ciasnota nieregularne odpowiedzialnosc","szybkie_wejscie wlasne stacjonarna",
      "ciasnota_nie brud_nie potrzeba_pewnosci","sredni","docelowy","bardzo_niskie",
      "Ucz sie pomp ciepla, tam sa najwyzsze stawki",
      klaster="instalacje", przeciw="kregoslup", przedm="fizyka zawodowe", dosw="hobby firma_rodzinna")

    z("stolarz","Stolarz",13,"szybki","nie",
      "rece precyzja obraz","manualne dokladnosc przestrzenna",
      "estetyka wytrzymalosc sprzet","samodzielnie dokladnosc efekt_widoczny",
      "mistrzostwo wolnosc","uznanie stabilnosc",
      "fizyczna stanie halas dzwiganie","szybkie_wejscie wlasne osiadlosc",
      "nuda_powtarzalnosc stanie_nie","wysoki","docelowy","niskie",
      "Meble na wymiar sa bezpieczne, produkcja seryjna nie",
      klaster="rzemioslo_material", przeciw="alergie_wziewne sluch kregoslup",
      przedm="zawodowe artystyczne", dosw="hobby projekty")

    z("mechanik","Mechanik samochodowy",13,"szybki","nie",
      "naprawianie rece tech","problemy manualne sprzet",
      "analiza uczenie_sie dokladnosc","samodzielnie efekt_widoczny tempo",
      "mistrzostwo wolnosc pieniadze","uznanie",
      "fizyczna brud halas doksztalcanie roszczeniowi","szybkie_wejscie wlasne osiadlosc",
      "brud_nie doksztalcanie_nie cudza_zlosc","sredni","docelowy","niskie",
      "Celuj w diagnostyke i pojazdy elektryczne",
      klaster="serwis_techniczny", przeciw="kregoslup", przedm="fizyka zawodowe", dosw="hobby")

    z("spawacz","Spawacz",13,"szybki","nie",
      "rece precyzja naprawianie","manualne dokladnosc wytrzymalosc",
      "sprzet wytrwalosc samodzielnosc","cisza samodzielnie dokladnosc",
      "pieniadze mistrzostwo stabilnosc","relacje uznanie",
      "fizyczna goraco halas wyjazdy samotnosc odpowiedzialnosc","szybkie_wejscie mobilnosc",
      "potrzeba_ludzi wzrok_slaby goraco_nie","bardzo_niski","docelowy","umiarkowane",
      "Zdobywaj kolejne uprawnienia, TIG jest celem",
      przeciw="wzrok alergie_wziewne", przedm="zawodowe")

    z("fryzjer","Fryzjer",13,"szybki","nie",
      "obraz rece rozmowa","manualne estetyka uprzejmosc",
      "wyczuwanie dokladnosc wytrzymalosc","ludzie efekt_widoczny powtarzalnosc",
      "relacje wolnosc mistrzostwo","stabilnosc uznanie",
      "stanie weekendy ludzie_ciagle chemikalia","szybkie_wejscie wlasne osiadlosc",
      "potrzeba_ciszy stanie_nie","niski","docelowy","bardzo_niskie",
      klaster="uroda", przeciw="alergie_skorne kregoslup", przedm="artystyczne zawodowe")

    z("kosmetolog","Kosmetolog",13,"sredni","czesciowo",
      "obraz zdrowie rozmowa","manualne dokladnosc uprzejmosc",
      "wyczuwanie zapamietywanie przekonywanie","ludzie dokladnosc efekt_widoczny",
      "relacje wolnosc mistrzostwo","stabilnosc",
      "stanie weekendy ludzie_ciagle chemikalia","szybkie_wejscie wlasne osiadlosc",
      "stanie_nie sprzedaz_nie","wysoki","docelowy","niskie",
      "Podologia jest deficytowa i dobrze platna",
      klaster="uroda", przeciw="alergie_skorne kregoslup", przedm="biologia chemia")

    z("krawiec","Krawiec",13,"szybki","nie",
      "rece precyzja obraz","manualne dokladnosc przestrzenna",
      "wytrwalosc estetyka cierpliwosc","cisza samodzielnie dokladnosc",
      "mistrzostwo wolnosc","pieniadze uznanie",
      "stanie powtarzalnosc","szybkie_wejscie wlasne osiadlosc",
      "potrzeba_ludzi wzrok_slaby","niski","docelowy","niskie",
      "Uslugi i przerobki rosna, produkcja masowa nie",
      klaster="rzemioslo_material", przeciw="wzrok kregoslup", przedm="artystyczne zawodowe", dosw="hobby")

    z("technik_serwisu","Technik serwisu urzadzen",13,"szybki","nie",
      "naprawianie tech rece","problemy sprzet manualne",
      "analiza samodzielnosc uprzejmosc","samodzielnie efekt_widoczny elastycznosc",
      "mistrzostwo wolnosc pieniadze","uznanie",
      "fizyczna wyjazdy roszczeniowi doksztalcanie","mobilnosc wlasne szybkie_wejscie",
      "cudza_zlosc doksztalcanie_nie","sredni","docelowy","niskie",
      "Wybor specjalizacji zmienia dochod dwukrotnie, celuj w medyczny albo przemyslowy",
      klaster="serwis_techniczny", przedm="fizyka informatyka zawodowe", dosw="hobby")

    z("instalator_pv","Instalator fotowoltaiki",13,"szybki","nie",
      "rece ruch tech","manualne wytrzymalosc sprzet",
      "reguly problemy zespol","zespol efekt_widoczny tempo",
      "pieniadze zmiennosc mistrzostwo","stabilnosc",
      "fizyczna wysokosc kazda_pogoda goraco wyjazdy","szybkie_wejscie mobilnosc",
      "wysokosc_nie fizycznosc stala_pensja","bardzo_niski","docelowy","bardzo_niskie",
      "Lacz z uprawnieniami elektrycznymi, to zabezpieczenie przed wahaniami rynku",
      przeciw="wysokosc kregoslup", przedm="fizyka zawodowe")

    # ---------- obszar 14: transport ----------
    z("spedytor","Spedytor",14,"sredni","nie",
      "planowanie przekonywanie porzadek","organizowanie wielozadaniowosc opanowanie",
      "negocjowanie przestrzenna odpornosc","tempo bodzce szerokosc",
      "pieniadze zmiennosc stabilnosc","czas_dla_siebie",
      "presja ludzie_ciagle nieregularne komputer","duzo_godzin przenika",
      "potrzeba_ciszy mierzenie","zerowy","docelowy","umiarkowane",
      "Buduj wlasny portfel klientow, nie tylko obsluguj zlecenia",
      klaster="transport_biuro", przedm="jezyki geografia")

    z("spec_logistyki","Specjalista do spraw logistyki",14,"sredni","czesciowo",
      "planowanie liczby porzadek","organizowanie analiza system",
      "negocjowanie dokladnosc wielozadaniowosc","struktura szerokosc elastycznosc",
      "stabilnosc pieniadze wplyw","czas_dla_siebie",
      "komputer presja ludzie_ciagle","osiadlosc duza_organizacja",
      "unikanie_konfliktu potrzeba_pewnosci","niski","docelowy","umiarkowane",
      "Celuj w zarzadzanie ryzykiem lancucha dostaw, nie w planowanie operacyjne",
      przedm="matematyka geografia")

    z("kierownik_magazynu","Kierownik magazynu",14,"sredni","czesciowo",
      "planowanie prowadzenie porzadek","organizowanie prowadzenie_grupy dokladnosc",
      "opanowanie rozbrajanie system","struktura inicjatywa bodzce",
      "stabilnosc wplyw pieniadze","cisza mistrzostwo",
      "zmiany noce stanie halas ludzie_ciagle odpowiedzialnosc","osiadlosc duza_organizacja",
      "potrzeba_ciszy noce_nie","zerowy","docelowy","umiarkowane",
      "Ucz sie automatyki magazynowej, to podnosi wartosc",
      dosw="praca_doryw praca_stala")

    z("kierowca","Kierowca zawodowy",14,"szybki","nie",
      "ruch naprawianie planowanie","sprzet samodzielnosc wytrzymalosc",
      "opanowanie dokladnosc przestrzenna","samodzielnie cisza powtarzalnosc",
      "pieniadze wolnosc stabilnosc","relacje czas_dla_siebie",
      "wyjazdy noce nieregularne fizyczna samotnosc odpowiedzialnosc","mobilnosc przenika",
      "potrzeba_ludzi kregoslup_slaby nuda_powtarzalnosc","sredni","docelowy","niskie",
      "Zdobywaj uprawnienia specjalistyczne, potem rozwaz przejscie do spedycji",
      przeciw="kregoslup wzrok", przedm="zawodowe")

    z("dyspozytor","Dyspozytor transportu",14,"sredni","nie",
      "planowanie prowadzenie porzadek","organizowanie wielozadaniowosc opanowanie",
      "rozbrajanie przestrzenna reguly","tempo bodzce konfrontacja",
      "pieniadze stabilnosc wplyw","cisza czas_dla_siebie",
      "presja ludzie_ciagle nieregularne","osiadlosc przenika",
      "unikanie_konfliktu potrzeba_pewnosci","zerowy","docelowy","umiarkowane",
      klaster="transport_biuro", przedm="geografia", dosw="praca_stala")

    # ---------- obszar 15: rolnictwo i przyroda ----------
    z("weterynarz","Weterynarz",15,"dlugi","tak",
      "przyroda zdrowie dociekanie","opiekunczosc dokladnosc opanowanie",
      "zapamietywanie manualne wyczuwanie","dokladnosc ludzie glebia",
      "sens mistrzostwo wolnosc","czas_dla_siebie pieniadze",
      "dlugie_studia dyzury weekendy krew umieranie odpowiedzialnosc","dluga_inwestycja przenika",
      "umieranie potrzeba_pewnosci fizycznosc","niski","docelowy","bardzo_niskie",
      "Sprawdz wolontariatem w lecznicy przed decyzja o szesciu latach",
      przedm="biologia chemia", dosw="wolontariat hobby")

    z("technik_wet","Technik weterynarii",15,"sredni","nie",
      "przyroda opieka zdrowie","opiekunczosc manualne dokladnosc",
      "wytrzymalosc opanowanie uprzejmosc","zespol ludzie efekt_widoczny",
      "sens relacje","pieniadze mistrzostwo wplyw",
      "fizyczna krew umieranie dyzury chorzy","szybkie_wejscie osiadlosc",
      "umieranie fizycznosc kregoslup_slaby","bardzo_niski","trampolina","bardzo_niskie",
      "Naturalna sciezka to uzupelnienie studiow weterynaryjnych",
      przeciw="alergie_wziewne kregoslup", przedm="biologia", dosw="wolontariat")

    z("agronom","Agronom",15,"sredni","tak",
      "przyroda ruch dociekanie","analiza dokladnosc wyjasnianie",
      "przekonywanie samodzielnosc zapamietywanie","samodzielnie elastycznosc dokladnosc",
      "wolnosc mistrzostwo stabilnosc","czas_dla_siebie",
      "studia kazda_pogoda wyjazdy weekendy chemikalia","osiadlosc mobilnosc",
      "kontrola_efektu potrzeba_ludzi","niski","docelowy","niskie",
      "Ucz sie rolnictwa precyzyjnego i pracy z danymi",
      teren=True, przedm="biologia chemia geografia", dosw="firma_rodzinna")

    z("lesnik","Lesnik",15,"sredni","czesciowo",
      "przyroda ruch porzadek","samodzielnosc dokladnosc analiza",
      "reguly wytrzymalosc rozbrajanie","samodzielnie cisza dokladnosc",
      "wolnosc stabilnosc zasady sens","uznanie zmiennosc",
      "studia kazda_pogoda fizyczna samotnosc przeprowadzka","osiadlosc stacjonarna",
      "potrzeba_ludzi efekt_szybki dokumentacja_nie","zerowy","docelowy","niskie",
      teren=True, przedm="biologia geografia", dosw="hobby")

    z("ogrodnik","Ogrodnik",15,"szybki","nie",
      "przyroda rece ruch","wytrzymalosc manualne sprzet",
      "dokladnosc estetyka samodzielnosc","efekt_widoczny samodzielnie zmiennosc",
      "wolnosc mistrzostwo czas_dla_siebie","pieniadze stabilnosc uznanie",
      "fizyczna kazda_pogoda goraco niepewny_dochod","szybkie_wejscie wlasne osiadlosc",
      "fizycznosc stala_pensja","niski","docelowy","bardzo_niskie",
      "Arborystyka jest deficytowa i dobrze platna",
      przeciw="alergie_wziewne kregoslup", przedm="biologia zawodowe", dosw="hobby praca_doryw")

    z("spec_srodowiska","Specjalista ochrony srodowiska",15,"sredni","tak",
      "przyroda prawo porzadek","analiza reguly dokladnosc",
      "wyjasnianie system slowo","struktura dokladnosc konfrontacja",
      "zasady stabilnosc sens","zmiennosc uznanie",
      "studia komputer doksztalcanie odpowiedzialnosc","osiadlosc duza_organizacja",
      "dokumentacja_nie unikanie_konfliktu","niski","docelowy","bardzo_niskie",
      "Raportowanie zrownowazonego rozwoju rosnie najszybciej",
      przedm="biologia chemia geografia")

    # ---------- obszar 16: medycyna ----------
    z("lekarz","Lekarz",16,"bardzo_dlugi","tak",
      "zdrowie dociekanie opieka","zapamietywanie opanowanie dokladnosc",
      "analiza wyczuwanie manualne","dokladnosc ludzie glebia",
      "sens mistrzostwo uznanie stabilnosc","czas_dla_siebie wolnosc",
      "dlugie_studia egzaminy doksztalcanie dyzury noce weekendy krew chorzy umieranie odpowiedzialnosc",
      "dluga_inwestycja przenika duzo_godzin",
      "umieranie potrzeba_pewnosci doksztalcanie_nie","niski","docelowy","bardzo_niskie",
      przedm="biologia chemia", dosw="wolontariat")

    z("pielegniarka","Pielegniarka",16,"sredni","tak",
      "zdrowie opieka rozmowa","opiekunczosc opanowanie dokladnosc",
      "zapamietywanie wytrzymalosc uprzejmosc","ludzie zespol struktura",
      "sens stabilnosc relacje","czas_dla_siebie wolnosc",
      "studia zmiany noce weekendy krew chorzy umieranie fizyczna odpowiedzialnosc",
      "przenika stacjonarna",
      "umieranie noce_nie fizycznosc kregoslup_slaby","niski","docelowy","bardzo_niskie",
      klaster="pielegniarstwo", przeciw="kregoslup", przedm="biologia", dosw="wolontariat")

    z("ratownik_med","Ratownik medyczny",16,"sredni","tak",
      "zdrowie ruch opieka","opanowanie dokladnosc wytrzymalosc",
      "zapamietywanie rozbrajanie problemy","zespol bodzce tempo",
      "sens relacje stabilnosc","czas_dla_siebie bezpieczenstwo",
      "studia zmiany noce weekendy krew umieranie fizyczna agresja","przenika mobilnosc",
      "umieranie noce_nie fizycznosc","niski","docelowy","bardzo_niskie",
      przeciw="kregoslup", przedm="biologia wf", dosw="wolontariat kursy")

    z("polozna","Polozna",16,"sredni","tak",
      "zdrowie opieka rozmowa","opanowanie opiekunczosc dokladnosc",
      "wyczuwanie manualne wyjasnianie","ludzie tempo samodzielnie",
      "sens mistrzostwo stabilnosc","czas_dla_siebie",
      "studia zmiany noce weekendy krew odpowiedzialnosc fizyczna","przenika stacjonarna",
      "umieranie potrzeba_pewnosci noce_nie","niski","docelowy","bardzo_niskie",
      klaster="pielegniarstwo", przeciw="kregoslup", przedm="biologia", dosw="wolontariat")

    z("farmaceuta","Farmaceuta",16,"dlugi","tak",
      "zdrowie precyzja dociekanie","zapamietywanie dokladnosc reguly",
      "wyjasnianie uprzejmosc analiza","dokladnosc ludzie struktura",
      "sens stabilnosc mistrzostwo","zmiennosc wolnosc",
      "studia stanie ludzie_ciagle weekendy","osiadlosc granica_ostra",
      "stanie_nie sprzedaz_nie nuda_powtarzalnosc","niski","docelowy","umiarkowane",
      "Opieka farmaceutyczna rosnie, samo wydawanie lekow sie kurczy",
      przedm="biologia chemia")

    z("technik_farm","Technik farmaceutyczny",16,"sredni","nie",
      "zdrowie precyzja rozmowa","dokladnosc uprzejmosc zapamietywanie",
      "reguly cierpliwosc organizowanie","struktura ludzie powtarzalnosc",
      "sens stabilnosc","pieniadze mistrzostwo",
      "stanie ludzie_ciagle weekendy","szybkie_wejscie osiadlosc",
      "stanie_nie potrzeba_rozwoju","zerowy","trampolina","wysokie",
      "Dobre wejscie, rozwaz uzupelnienie studiow farmaceutycznych", przedm="biologia chemia")

    z("technik_radiolog","Technik radiolog",16,"sredni","tak",
      "zdrowie tech precyzja","dokladnosc sprzet reguly",
      "wyczuwanie uprzejmosc zapamietywanie","dokladnosc struktura ludzie",
      "sens stabilnosc mistrzostwo","zmiennosc",
      "studia zmiany dyzury chorzy fizyczna","osiadlosc stacjonarna",
      "nuda_powtarzalnosc potrzeba_relacji","niski","docelowy","niskie",
      przedm="biologia fizyka")

    z("opiekun_med","Opiekun medyczny",16,"szybki","nie",
      "opieka zdrowie rozmowa","opiekunczosc wytrzymalosc uprzejmosc",
      "cierpliwosc dokladnosc wyczuwanie","ludzie powtarzalnosc struktura",
      "sens relacje zasady","pieniadze uznanie mistrzostwo",
      "fizyczna brud zmiany chorzy umieranie dzwiganie","szybkie_wejscie stacjonarna",
      "fizycznosc umieranie kregoslup_slaby","bardzo_niski","trampolina","bardzo_niskie",
      "Naturalna sciezka to studia pielegniarskie",
      klaster="opieka_bezposrednia", przeciw="kregoslup", dosw="wolontariat")

    # ---------- obszar 17: rehabilitacja ----------
    z("fizjoterapeuta","Fizjoterapeuta",17,"dlugi","tak",
      "zdrowie opieka ruch","opiekunczosc wyjasnianie manualne",
      "wyczuwanie wytrzymalosc zapamietywanie","ludzie dokladnosc samodzielnie",
      "sens mistrzostwo wolnosc","pieniadze stabilnosc",
      "studia stanie ludzie_ciagle chorzy doksztalcanie fizyczna","wlasne osiadlosc",
      "efekt_szybki dotyk kontrola_efektu","sredni","docelowy","bardzo_niskie",
      "Etat placi zle, planuj wlasny gabinet od poczatku",
      klaster="cialo_terapia", przeciw="kregoslup", przedm="biologia wf", dosw="wolontariat")

    z("masazysta","Masazysta",17,"szybki","nie",
      "zdrowie opieka ruch","manualne opiekunczosc wytrzymalosc",
      "wyczuwanie uprzejmosc cierpliwosc","ludzie samodzielnie powtarzalnosc",
      "sens wolnosc relacje","stabilnosc pieniadze",
      "stanie fizyczna ludzie_ciagle niepewny_dochod","szybkie_wejscie wlasne",
      "rece_slabe dotyk stala_pensja","niski","docelowy","niskie",
      "Zawod zuzywa rece, planuj przejscie do specjalizacji mniej obciazajacych",
      klaster="cialo_terapia", przeciw="kregoslup", przedm="biologia wf")

    z("dietetyk","Dietetyk",17,"sredni","tak",
      "zdrowie rozmowa uczenie","wyjasnianie wyczuwanie analiza",
      "cierpliwosc przekonywanie dokladnosc","ludzie samodzielnie dokladnosc",
      "sens wolnosc mistrzostwo","stabilnosc",
      "studia ludzie_ciagle niepewny_dochod komputer","zdalna wlasne",
      "kontrola_efektu sprzedaz_nie","sredni","docelowy","umiarkowane",
      "Celuj w dietetyke kliniczna, ukladanie jadlospisow jest zagrozone",
      przedm="biologia chemia")

    z("terapeuta_zajeciowy","Terapeuta zajeciowy",17,"sredni","czesciowo",
      "opieka uczenie rece","opiekunczosc wyjasnianie wyczuwanie",
      "tworzenie manualne cierpliwosc","ludzie zespol powtarzalnosc",
      "sens relacje czas_dla_siebie","pieniadze uznanie mistrzostwo",
      "fizyczna chorzy ludzie_ciagle","osiadlosc mniej_godzin",
      "efekt_szybki fizycznosc","zerowy","docelowy","bardzo_niskie",
      przedm="biologia artystyczne", dosw="wolontariat")

    z("optyk","Optyk",17,"szybki","nie",
      "precyzja rece zdrowie","manualne dokladnosc uprzejmosc",
      "estetyka przekonywanie sprzet","dokladnosc ludzie struktura",
      "stabilnosc mistrzostwo","wolnosc zmiennosc",
      "stanie weekendy ludzie_ciagle","szybkie_wejscie osiadlosc",
      "sprzedaz_nie stanie_nie","wysoki","docelowy","umiarkowane",
      "Uzupelnij optometrie, tam jest czesc odporna i lepiej platna",
      przeciw="wzrok", przedm="fizyka biologia")

    z("protetyk_sluchu","Protetyk sluchu",17,"sredni","czesciowo",
      "zdrowie precyzja rozmowa","dokladnosc cierpliwosc wyjasnianie",
      "sprzet uprzejmosc wyczuwanie","dokladnosc ludzie struktura",
      "sens stabilnosc mistrzostwo","zmiennosc",
      "ludzie_ciagle komputer doksztalcanie","osiadlosc granica_ostra",
      "sprzedaz_nie nuda_powtarzalnosc","niski","docelowy","niskie",
      przeciw="sluch", przedm="fizyka biologia")

    # ---------- obszar 18: sport ----------
    z("trener_personalny","Trener personalny",18,"sredni","nie",
      "ruch uczenie zdrowie","wyjasnianie wytrzymalosc przekonywanie",
      "wyczuwanie samodzielnosc odpornosc","ludzie inicjatywa efekt_widoczny",
      "wolnosc relacje sens","stabilnosc czas_dla_siebie",
      "nieregularne weekendy fizyczna niepewny_dochod wlasna_dzialalnosc","wlasne przenika",
      "sprzedaz_nie stala_pensja wieczory_nie","niski","docelowy","niskie",
      "Specjalizuj sie w treningu medycznym, tam nie konkurujesz z aplikacja",
      przeciw="kregoslup", przedm="biologia wf", dosw="hobby")

    z("trener_druzyny","Trener druzyny",18,"sredni","czesciowo",
      "ruch prowadzenie uczenie","prowadzenie_grupy wyjasnianie opanowanie",
      "wyczuwanie odpornosc system","zespol inicjatywa konfrontacja",
      "wplyw sens relacje","stabilnosc czas_dla_siebie",
      "weekendy wyjazdy nieregularne niepewny_dochod presja","przenika mobilnosc",
      "kontrola_efektu odmowa_do_siebie weekendy_nie","niski","docelowy","niskie",
      przedm="wf", dosw="hobby prowadzenie konkursy")

    z("nauczyciel_wf","Nauczyciel wychowania fizycznego",18,"dlugi","tak",
      "ruch uczenie rozmowa","wyjasnianie prowadzenie_grupy cierpliwosc",
      "wytrzymalosc rozbrajanie wystapienia","ludzie bodzce powtarzalnosc",
      "sens czas_dla_siebie stabilnosc relacje","pieniadze uznanie",
      "studia ludzie_ciagle dzieci halas odpowiedzialnosc","osiadlosc granica_ostra",
      "potrzeba_ciszy cudza_zlosc","niski","docelowy","niskie",
      przeciw="kregoslup", przedm="wf biologia", dosw="hobby prowadzenie")

    z("instruktor_rekreacji","Instruktor rekreacji",18,"szybki","nie",
      "ruch uczenie wspolnota","wyjasnianie wytrzymalosc opanowanie",
      "prowadzenie_grupy wyczuwanie sprzet","zespol zmiennosc bodzce",
      "wolnosc relacje zmiennosc","stabilnosc pieniadze",
      "weekendy nieregularne fizyczna kazda_pogoda niepewny_dochod","mobilnosc szybkie_wejscie",
      "stala_pensja weekendy_nie","bardzo_niski","docelowy","niskie",
      przeciw="kregoslup", przedm="wf", dosw="hobby")

print("czesc 3 zaladowana")
