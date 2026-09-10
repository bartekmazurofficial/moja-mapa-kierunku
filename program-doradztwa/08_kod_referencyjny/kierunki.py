# -*- coding: utf-8 -*-
"""
BAZA DROG EDUKACYJNYCH
68 kierunkow studiow + 20 drog bez studiow.
Pole "czego nie daje" jest wyprowadzone z kart zawodow i nie istnieje w informatorach.
"""

K = {}
def k(kod, nazwa, typ, poziom, lata, wym, punkt, trud, bezp, posr, odsetek,
      gdzie, robi, nie_daje=None, alt=False):
    K[kod] = dict(nazwa=nazwa, typ=typ, poziom=poziom, lata=lata,
                  wymagane=wym.split(), punktowane=punkt.split(), trudnosc=trud,
                  bezposrednie=bezp.split(), posrednie=posr.split(),
                  odsetek=odsetek, gdzie=gdzie, robi=robi, nie_daje=nie_daje,
                  alternatywa_bez_studiow=alt)

# ================= BIZNES I ZARZADZANIE =================
k("zarzadzanie","Zarzadzanie","uniwersytecki","lic_mgr",5,"","matematyka jezyki wos","srednia",
  "project_manager kierownik_zespolu konsultant","product_manager spec_marketingu handlowiec account_manager wlasciciel_uslugowej franczyzobiorca",
  35,"wszedzie",
  "Podstawy ekonomii, finansow, marketingu i prawa gospodarczego. Duzo teorii organizacji, malo praktyki.",
  "Konkretnego zawodu. Otwiera wiele drzwi, zadnych na osciez. Bez praktyk i wlasnych projektow dyplom sam w sobie nie wystarcza.")

k("ekonomia","Ekonomia","uniwersytecki","lic_mgr",5,"matematyka","jezyki wos","srednia",
  "analityk_finansowy analityk_rynku","kontroler_finansowy ksiegowy analityk_biznesowy konsultant",
  40,"wszedzie",
  "Mikro i makroekonomia, statystyka, ekonometria. Duzo matematyki, wiecej niz spodziewa sie wiekszosc kandydatow.",
  "Umiejetnosci praktycznych. Excel i modelowanie finansowe trzeba opanowac samodzielnie.")

k("finanse_rach","Finanse i rachunkowosc","uniwersytecki","lic_mgr",5,"matematyka","jezyki wos","srednia",
  "ksiegowy analityk_finansowy kontroler_finansowy doradca_podatkowy","glowny_ksiegowy spec_plac doradca_bank",
  60,"wszedzie",
  "Rachunkowosc, podatki, finanse przedsiebiorstw, sprawozdawczosc. Bardzo konkretny kierunek.",
  "Uprawnien. Do glownego ksiegowego i doradcy podatkowego prowadza osobne certyfikaty i egzaminy.")

k("marketing_kier","Marketing","uniwersytecki","lic_mgr",5,"","jezyki polski wos","niska",
  "spec_marketingu brand_manager","copywriter social_media pr analityk_rynku seo",
  45,"wszedzie",
  "Zachowania konsumenta, badania rynku, komunikacja, podstawy zarzadzania.",
  "Umiejetnosci technicznych. Reklama platna, analityka i narzedzia to nauka wlasna albo kursy.")

k("logistyka","Logistyka","uniwersytecki","lic_mgr",5,"","matematyka jezyki geografia","niska",
  "spec_logistyki kierownik_magazynu spedytor dyspozytor","technolog_produkcji",
  55,"wszedzie",
  "Lancuchy dostaw, transport, magazynowanie, planowanie produkcji.",
  "Znajomosci jezyka na poziomie negocjacji, ktora w spedycji decyduje o zarobkach.")

k("zarz_zasob","Zarzadzanie zasobami ludzkimi","uniwersytecki","lic_mgr",5,"","polski wos jezyki","niska",
  "spec_hr rekruter","trener_biznesu doradca_zawodowy coach", 40,"duze_miasta",
  "Prawo pracy, psychologia organizacji, rekrutacja, systemy wynagrodzen.",
  "Doswiadczenia, ktore w HR liczy sie bardziej niz dyplom.")

k("miedzynarodowe","Stosunki miedzynarodowe","uniwersytecki","lic_mgr",5,"","jezyki historia wos","srednia",
  "","business_dev dziennikarz koordynator_ngo fundraiser handlowiec", 20,"duze_miasta",
  "Prawo miedzynarodowe, ekonomia globalna, jezyki, historia dyplomacji.",
  "Konkretnego zawodu. Mniej niz co piaty absolwent pracuje w obszarze zwiazanym z kierunkiem.")

k("administracja_kier","Administracja","uniwersytecki","lic_mgr",5,"","polski wos historia","niska",
  "urzednik spec_admin","spec_zgodnosci prawnik_wewnetrzny office_manager", 45,"wszedzie",
  "Prawo administracyjne, postepowanie administracyjne, finanse publiczne.",
  "Przewagi w sektorze prywatnym. Kierunek jest silnie nastawiony na administracje publiczna.")

# ================= LICZBY I ANALIZA =================
k("informatyka","Informatyka","techniczny","inz_mgr",5,"matematyka","fizyka informatyka","wysoka",
  "programista devops inzynier_danych cyberbezpieczenstwo administrator","data_scientist analityk_danych tester zalozyciel_tech spec_wdrozen",
  75,"wszedzie",
  "Algorytmy, struktury danych, matematyka dyskretna, systemy operacyjne, sieci. Duzo teorii przed praktyka.",
  "Umiejetnosci komercyjnych od reki. Pierwsza prace zdobywa sie portfolio, nie dyplomem.", alt=True)

k("informatyka_ekon","Informatyka i ekonometria","uniwersytecki","lic_mgr",5,"matematyka","informatyka","srednia",
  "analityk_danych spec_bi","data_scientist analityk_finansowy analityk_biznesowy", 55,"duze_miasta",
  "Statystyka, ekonometria, programowanie w R i Pythonie, modelowanie.",
  None)

k("matematyka","Matematyka","uniwersytecki","lic_mgr",5,"matematyka","fizyka informatyka","wysoka",
  "data_scientist pracownik_naukowy","analityk_danych analityk_finansowy nauczyciel programista",
  35,"duze_miasta",
  "Analiza matematyczna, algebra, rachunek prawdopodobienstwa. Bardzo abstrakcyjny kierunek.",
  "Bezposredniej sciezki zawodowej. Otwiera analize i nauke, ale wymaga douczenia narzedzi.")

k("analityka_danych","Analityka danych","techniczny","lic_mgr",5,"matematyka","informatyka","srednia",
  "analityk_danych spec_bi inzynier_danych","data_scientist analityk_rynku", 65,"duze_miasta",
  "SQL, Python, statystyka, wizualizacja, hurtownie danych. Kierunek mlody i praktyczny.",
  None)

k("statystyka","Statystyka","uniwersytecki","lic_mgr",5,"matematyka","informatyka","srednia",
  "analityk_danych analityk_rynku","data_scientist pracownik_naukowy", 45,"kilka_osrodkow",
  "Wnioskowanie statystyczne, projektowanie badan, analiza danych.", None)

k("ekonomia_mat","Metody ilosciowe w ekonomii","uniwersytecki","lic_mgr",5,"matematyka","informatyka","srednia",
  "analityk_finansowy analityk_danych","kontroler_finansowy data_scientist", 50,"duze_miasta",
  "Modelowanie ekonomiczne, prognozowanie, optymalizacja.", None)

k("cyberbezp_kier","Cyberbezpieczenstwo","techniczny","inz_mgr",5,"matematyka","fizyka informatyka","wysoka",
  "cyberbezpieczenstwo administrator","programista devops spec_zgodnosci", 70,"duze_miasta",
  "Kryptografia, bezpieczenstwo sieci, analiza zlosliwego oprogramowania, prawo.", None, alt=True)

# ================= PRAWO I ADMINISTRACJA =================
k("prawo","Prawo","uniwersytecki","jednolite",5,"","polski historia wos jezyki","wysoka",
  "prawnik_wewnetrzny spec_zgodnosci kurator_sadowy","radca_prawny notariusz doradca_podatkowy urzednik",
  50,"wszedzie",
  "Prawo cywilne, karne, administracyjne, konstytucyjne. Bardzo duzo pamieciowego przyswajania.",
  "Mozliwosci wykonywania zawodu. To aplikacja, czyli kolejne 3 do 4 lat i trudny egzamin wstepny.")

k("bezp_wewn","Bezpieczenstwo wewnetrzne","uniwersytecki","lic_mgr",5,"","wos historia wf","niska",
  "","policjant funkcjonariusz_sw spec_bhp zolnierz urzednik", 30,"wszedzie",
  "Prawo karne, zarzadzanie kryzysowe, kryminologia, ochrona informacji.",
  "Przewagi przy naborze do sluzb. Do policji i wojska przyjmuja takze po innych kierunkach i bez studiow.")

k("kryminologia","Kryminologia","uniwersytecki","lic_mgr",5,"","wos polski biologia","srednia",
  "","policjant kurator_sadowy funkcjonariusz_sw psycholog", 25,"kilka_osrodkow",
  "Przyczyny przestepczosci, psychologia kryminalna, wiktymologia.",
  "Konkretnego zawodu. Wiekszosc absolwentow pracuje poza obszarem kierunku.")

k("praca_socj_kier","Praca socjalna","uniwersytecki","lic_mgr",5,"","wos polski biologia","niska",
  "pracownik_socjalny asystent_rodziny","kierownik_placowki kurator_sadowy koordynator_ngo animator",
  60,"wszedzie",
  "Metodyka pracy socjalnej, polityka spoleczna, psychologia, prawo pomocy spolecznej.",
  "Odpornosci psychicznej, ktora w tym zawodzie decyduje o przetrwaniu. Superwizji tez nie uczy.")

k("politologia","Politologia","uniwersytecki","lic_mgr",5,"","wos historia polski","niska",
  "","urzednik dziennikarz koordynator_ngo fundraiser", 20,"wszedzie",
  "Systemy polityczne, mysl polityczna, administracja publiczna.",
  "Konkretnego zawodu. Co piaty absolwent pracuje w obszarze zwiazanym z kierunkiem.")

# ================= TECHNOLOGIA I NAUKA =================
k("automatyka","Automatyka i robotyka","techniczny","inz_mgr",5,"matematyka","fizyka informatyka","wysoka",
  "automatyk kierownik_ruchu","inzynier_mechanik technolog_produkcji programista devops",
  70,"kilka_osrodkow",
  "Sterowanie, programowanie PLC, robotyka, napedy, elektronika.", None, alt=True)

k("mechanika","Mechanika i budowa maszyn","techniczny","inz_mgr",5,"matematyka","fizyka","srednia",
  "inzynier_mechanik technolog_produkcji inzynier_jakosci","kierownik_ruchu operator_cnc projektant_produktu",
  65,"kilka_osrodkow",
  "Wytrzymalosc materialow, konstrukcja maszyn, CAD, technologie wytwarzania.", None, alt=True)

k("elektrotechnika","Elektrotechnika","techniczny","inz_mgr",5,"matematyka","fizyka","srednia",
  "automatyk projektant_instalacji","elektryk kierownik_ruchu instalator_pv inzynier_mechanik",
  65,"kilka_osrodkow",
  "Obwody elektryczne, maszyny elektryczne, energetyka, instalacje.", None, alt=True)

k("mechatronika","Mechatronika","techniczny","inz_mgr",5,"matematyka","fizyka informatyka","srednia",
  "automatyk technik_serwisu","inzynier_mechanik operator_cnc mechanik", 60,"kilka_osrodkow",
  "Polaczenie mechaniki, elektroniki i informatyki. Systemy sterowania urzadzeniami.", None, alt=True)

k("inz_srodowiska","Inzynieria srodowiska","techniczny","inz_mgr",5,"matematyka","fizyka chemia","niska",
  "projektant_instalacji spec_srodowiska","hydraulik instalator_pv agronom", 50,"kilka_osrodkow",
  "Instalacje sanitarne, wodociagi, ogrzewanie, wentylacja, gospodarka odpadami.", None)

k("energetyka","Energetyka","techniczny","inz_mgr",5,"matematyka","fizyka","srednia",
  "projektant_instalacji automatyk","instalator_pv kierownik_ruchu spec_srodowiska", 65,"kilka_osrodkow",
  "Zrodla energii, sieci, odnawialne zrodla, efektywnosc energetyczna.", None, alt=True)

k("biotechnologia","Biotechnologia","techniczny","inz_mgr",5,"biologia","chemia matematyka","srednia",
  "spec_rd technik_lab","pracownik_naukowy diagnosta_lab spec_srodowiska", 40,"duze_miasta",
  "Biologia molekularna, mikrobiologia, inzynieria genetyczna, procesy biotechnologiczne.",
  "Latwej pracy. Rynek biotechnologiczny w Polsce jest waski, wielu absolwentow trafia do laboratoriow diagnostycznych.")

k("chemia","Chemia","uniwersytecki","lic_mgr",5,"chemia","matematyka fizyka biologia","niska",
  "spec_rd technik_lab pracownik_naukowy","diagnosta_lab spec_srodowiska nauczyciel", 45,"wszedzie",
  "Chemia organiczna, nieorganiczna, analityczna, fizyczna. Bardzo duzo laboratorium.", None)

k("fizyka","Fizyka","uniwersytecki","lic_mgr",5,"fizyka","matematyka","niska",
  "pracownik_naukowy","data_scientist programista nauczyciel spec_rd", 30,"duze_miasta",
  "Mechanika, elektrodynamika, fizyka kwantowa, metody numeryczne.",
  "Bezposredniej sciezki zawodowej. Otwiera analize danych i nauke, ale wymaga douczenia.")

k("inz_materialowa","Inzynieria materialowa","techniczny","inz_mgr",5,"matematyka","fizyka chemia","niska",
  "inzynier_jakosci spec_rd","inzynier_mechanik technolog_produkcji spawacz", 55,"kilka_osrodkow",
  "Wlasciwosci materialow, badania nieniszczace, obrobka cieplna.", None)

k("zarz_inz","Zarzadzanie i inzynieria produkcji","techniczny","inz_mgr",5,"matematyka","fizyka","niska",
  "technolog_produkcji inzynier_jakosci kierownik_magazynu","kierownik_ruchu spec_logistyki project_manager",
  60,"kilka_osrodkow",
  "Polaczenie techniki z zarzadzaniem. Organizacja produkcji, jakosc, logistyka wewnetrzna.", None)

k("inz_biomedyczna","Inzynieria biomedyczna","techniczny","inz_mgr",5,"matematyka","fizyka biologia","srednia",
  "technik_serwisu","technik_radiolog spec_rd programista", 40,"kilka_osrodkow",
  "Aparatura medyczna, sygnaly biomedyczne, obrazowanie.",
  "Duzego rynku pracy w Polsce. Czesc absolwentow trafia do serwisu aparatury i sprzedazy technicznej.")

k("telekomunikacja","Telekomunikacja","techniczny","inz_mgr",5,"matematyka","fizyka informatyka","srednia",
  "administrator devops","programista cyberbezpieczenstwo technik_serwisu", 60,"kilka_osrodkow",
  "Sieci, transmisja danych, systemy radiowe.", None, alt=True)

# ================= RECE, TEREN I PRZYRODA =================
k("budownictwo","Budownictwo","techniczny","inz_mgr",5,"matematyka","fizyka","srednia",
  "inzynier_budownictwa kierownik_budowy kosztorysant","geodeta projektant_instalacji architekt",
  70,"wszedzie",
  "Konstrukcje, materialy budowlane, technologia robot, geotechnika.",
  "Uprawnien budowlanych. To 1 do 3 lata praktyki po dyplomie i egzamin.", alt=True)

k("architektura","Architektura","techniczny","inz_mgr",6,"matematyka rysunek","fizyka","bardzo_wysoka",
  "architekt","projektant_wnetrz inzynier_budownictwa projektant_produktu", 55,"kilka_osrodkow",
  "Projektowanie, historia architektury, konstrukcje, urbanistyka. Bardzo duzo pracy wlasnej po nocach.",
  "Uprawnien projektowych. To kolejne 2 do 3 lata praktyki i egzamin. Do tego projektowanie tworcze to okolo 10% realnej pracy.")

k("arch_wnetrz","Architektura wnetrz","artystyczny","lic_mgr",5,"rysunek","artystyczne","wysoka",
  "projektant_wnetrz","architekt grafik projektant_produktu", 50,"kilka_osrodkow",
  "Projektowanie przestrzeni, materialy wykonczeniowe, rysunek, wizualizacje.",
  "Umiejetnosci prowadzenia realizacji, ktora decyduje o zarobkach. Wizualizacje to kilka procent pracy.")

k("geodezja","Geodezja i kartografia","techniczny","inz_mgr",5,"matematyka","fizyka geografia","niska",
  "geodeta","inzynier_budownictwa kierownik_budowy spec_srodowiska", 70,"kilka_osrodkow",
  "Pomiary, rachunek wyrownawczy, kataster, systemy informacji przestrzennej.",
  "Uprawnien zawodowych. Wymagaja 1 do 3 lat praktyki i egzaminu.", alt=True)

k("gosp_przestrzenna","Gospodarka przestrzenna","uniwersytecki","lic_mgr",5,"","geografia matematyka wos","niska",
  "","geodeta spec_srodowiska urzednik architekt", 35,"kilka_osrodkow",
  "Planowanie przestrzenne, urbanistyka, prawo planistyczne, GIS.",
  "Konkretnego zawodu. Absolwenci trafiaja najczesciej do administracji i biur projektowych.")

k("rolnictwo","Rolnictwo","uniwersytecki","inz_mgr",5,"biologia","chemia geografia","niska",
  "agronom","spec_srodowiska ogrodnik lesnik technik_wet", 55,"kilka_osrodkow",
  "Produkcja roslinna i zwierzeca, gleboznawstwo, ochrona roslin, ekonomika.", None, alt=True)

k("lesnictwo","Lesnictwo","uniwersytecki","inz_mgr",5,"biologia","chemia geografia","srednia",
  "lesnik","spec_srodowiska agronom ogrodnik", 65,"kilka_osrodkow",
  "Hodowla lasu, uzytkowanie, ochrona, urzadzanie lasu.",
  "Etatu. Konkurencja o miejsca w Lasach Panstwowych jest bardzo duza, a nabory ograniczone.")

k("ogrodnictwo","Ogrodnictwo","uniwersytecki","inz_mgr",5,"biologia","chemia","niska",
  "ogrodnik","agronom spec_srodowiska", 50,"kilka_osrodkow",
  "Uprawa roslin ozdobnych i warzyw, projektowanie zieleni, szkolkarstwo.", None, alt=True)

k("weterynaria","Weterynaria","medyczny","jednolite",6,"biologia chemia","","bardzo_wysoka",
  "weterynarz","technik_wet spec_srodowiska diagnosta_lab", 80,"kilka_osrodkow",
  "Anatomia, fizjologia, choroby zwierzat, chirurgia, farmakologia. Bardzo obciazajacy kierunek.",
  "Odpornosci psychicznej. Wskazniki wypalenia i problemow psychicznych w tym zawodzie naleza do najwyzszych wsrod zawodow medycznych.")

k("technologia_zywnosci","Technologia zywnosci","techniczny","inz_mgr",5,"","chemia biologia matematyka","niska",
  "spec_rd inzynier_jakosci technik_lab","cukiernik kucharz spec_srodowiska", 55,"kilka_osrodkow",
  "Procesy technologiczne, mikrobiologia zywnosci, bezpieczenstwo, jakosc.", None)

k("ochrona_srodowiska","Ochrona srodowiska","uniwersytecki","lic_mgr",5,"biologia","chemia geografia","niska",
  "spec_srodowiska","agronom lesnik technik_lab urzednik", 45,"wszedzie",
  "Ekologia, monitoring, prawo ochrony srodowiska, gospodarka odpadami.",
  "Praktycznej znajomosci przepisow, ktora w tym zawodzie jest najwazniejsza i zmienia sie co roku.")

# ================= ZDROWIE =================
k("lekarski","Kierunek lekarski","medyczny","jednolite",6,"biologia chemia","","bardzo_wysoka",
  "lekarz","diagnosta_lab pracownik_naukowy", 90,"kilka_osrodkow",
  "Anatomia, fizjologia, patologia, przedmioty kliniczne. Sześć lat bardzo intensywnej nauki.",
  "Prawa do samodzielnej pracy. Po dyplomie sa staz i specjalizacja, razem 5 do 7 lat.")

k("pielegniarstwo","Pielegniarstwo","medyczny","lic_mgr",3,"biologia","chemia","niska",
  "pielegniarka","opiekun_med polozna ratownik_med", 75,"wszedzie",
  "Anatomia, farmakologia, pielegniarstwo kliniczne, bardzo duzo praktyk od pierwszego roku.",
  "Przygotowania na kontakt ze smiercia, ktory na wiekszosci oddzialow jest czescia miesiaca.")

k("poloznictwo","Poloznictwo","medyczny","lic_mgr",3,"biologia","chemia","srednia",
  "polozna","pielegniarka opiekun_med", 80,"kilka_osrodkow",
  "Fizjologia ciazy i porodu, opieka nad noworodkiem, ginekologia, bardzo duzo praktyk.",
  "Przygotowania na porod zakonczony smiercia dziecka. Zdarza sie rzadko, ale zdarza.")

k("ratownictwo_med","Ratownictwo medyczne","medyczny","lic",3,"biologia","chemia wf","srednia",
  "ratownik_med","pielegniarka strazak opiekun_med", 70,"kilka_osrodkow",
  "Medyczne czynnosci ratunkowe, farmakologia, procedury, bardzo duzo praktyk w karetce.",
  "Wsparcia psychologicznego, ktore w tym zawodzie jest konieczne. Zespol stresu pourazowego jest tu udokumentowany.")

k("fizjoterapia","Fizjoterapia","medyczny","jednolite",5,"biologia","chemia wf","srednia",
  "fizjoterapeuta","masazysta trener_personalny terapeuta_zajeciowy", 70,"wszedzie",
  "Anatomia funkcjonalna, kinezyterapia, terapia manualna, neurorehabilitacja.",
  "Poziomu, ktory decyduje o zarobkach. Ten daja platne kursy po dyplomie, po 3 do 12 tysiecy za kurs.")

k("farmacja","Farmacja","medyczny","jednolite",6,"biologia chemia","","wysoka",
  "farmaceuta","diagnosta_lab spec_rd technik_farm", 85,"kilka_osrodkow",
  "Chemia leku, farmakologia, technologia postaci leku, receptura.",
  "Przygotowania na presje sprzedazowa w aptekach sieciowych, ktora jest glowna przyczyna odejsc.")

k("analityka_med","Analityka medyczna","medyczny","jednolite",5,"biologia chemia","","srednia",
  "diagnosta_lab","technik_lab spec_rd", 80,"kilka_osrodkow",
  "Diagnostyka laboratoryjna, hematologia, mikrobiologia, biochemia kliniczna.", None)

k("dietetyka","Dietetyka","medyczny","lic_mgr",5,"biologia","chemia","niska",
  "dietetyk","technik_lab trener_personalny", 45,"wszedzie",
  "Zywienie czlowieka, dietoterapia, biochemia, psychologia zywienia.",
  "Umiejetnosci prowadzenia gabinetu i pozyskiwania klientow, od ktorych zalezy caly dochod.")

k("elektroradiologia","Elektroradiologia","medyczny","lic",3,"biologia","fizyka","srednia",
  "technik_radiolog","diagnosta_lab technik_serwisu", 80,"kilka_osrodkow",
  "Fizyka promieniowania, anatomia radiologiczna, obsluga aparatury, ochrona radiologiczna.", None)

k("kosmetologia","Kosmetologia","medyczny","lic_mgr",5,"biologia","chemia","niska",
  "kosmetolog","masazysta dietetyk fryzjer", 60,"wszedzie",
  "Dermatologia, chemia kosmetyczna, zabiegi pielegnacyjne i aparaturowe.",
  "Granicy z medycyna estetyczna, ktora jest przedmiotem sporow prawnych. Jej przekraczanie niesie ryzyko.", alt=True)

k("zdrowie_publiczne","Zdrowie publiczne","medyczny","lic_mgr",5,"biologia","wos matematyka","niska",
  "","urzednik kierownik_placowki spec_srodowiska analityk_danych", 35,"kilka_osrodkow",
  "Epidemiologia, polityka zdrowotna, zarzadzanie w ochronie zdrowia.",
  "Konkretnego zawodu. Absolwenci trafiaja najczesciej do administracji i NFZ.")

# ================= LUDZIE I EDUKACJA =================
k("psychologia","Psychologia","uniwersytecki","jednolite",5,"biologia","polski wos matematyka","bardzo_wysoka",
  "psycholog interwent","psychoterapeuta doradca_zawodowy spec_hr rekruter analityk_rynku coach", 45,"wszedzie",
  "Psychologia ogolna, rozwojowa, kliniczna, spoleczna, statystyka i metodologia badan.",
  "Uprawnien do prowadzenia terapii. To czteroletnia szkola po studiach i 60 do 120 tysiecy zlotych wlasnych srodkow.")

k("pedagogika","Pedagogika","uniwersytecki","lic_mgr",5,"","polski biologia wos","niska",
  "","nauczyciel_przedszkola pedagog_specjalny animator asystent_rodziny terapeuta_zajeciowy doradca_zawodowy",
  50,"wszedzie",
  "Teoria wychowania, dydaktyka, psychologia rozwojowa, metodyka.",
  "Uprawnien do konkretnego stanowiska. Te daja specjalnosci i przygotowanie pedagogiczne.")

k("pedagogika_przedszk","Pedagogika przedszkolna i wczesnoszkolna","uniwersytecki","jednolite",5,"","polski biologia","niska",
  "nauczyciel_przedszkola nauczyciel","opiekunka_dziecieca pedagog_specjalny", 75,"wszedzie",
  "Metodyka nauczania poczatkowego, psychologia dziecka, dydaktyka przedmiotowa.", None)

k("pedagogika_spec","Pedagogika specjalna","uniwersytecki","jednolite",5,"","biologia polski","srednia",
  "pedagog_specjalny","terapeuta_zajeciowy nauczyciel_przedszkola asystent_niepelno", 80,"wszedzie",
  "Praca z niepelnosprawnoscia, spektrum autyzmu, komunikacja alternatywna, terapia.", None)

k("socjologia","Socjologia","uniwersytecki","lic_mgr",5,"","polski wos matematyka","niska",
  "analityk_rynku","pracownik_socjalny doradca_zawodowy animator koordynator_ngo dziennikarz", 25,"wszedzie",
  "Teorie spoleczne, metody badan, statystyka spoleczna.",
  "Konkretnego zawodu. Co czwarty absolwent pracuje w obszarze zwiazanym z kierunkiem.")

k("filologia_ang","Filologia angielska","uniwersytecki","lic_mgr",5,"jezyki","polski","niska",
  "lektor","nauczyciel redaktor obsluga_klienta recepcjonista", 40,"wszedzie",
  "Jezyk, literatura, jezykoznawstwo, przeklad. Duzo literatury, mniej praktycznego jezyka, niz sie spodziewasz.",
  "Przewagi na rynku. Znajomosc jezyka to dzis warunek, nie kwalifikacja. Potrzebna jest druga dziedzina.")

k("filologia_pol","Filologia polska","uniwersytecki","lic_mgr",5,"polski","historia","niska",
  "redaktor nauczyciel","dziennikarz copywriter lektor", 40,"wszedzie",
  "Literatura, jezykoznawstwo, gramatyka opisowa i historyczna.",
  "Umiejetnosci pisania uzytkowego. Copywriting i redakcja merytoryczna to nauka wlasna.")

k("filologia_inne","Filologia germanska, romanska, hiszpanska i inne","uniwersytecki","lic_mgr",5,"jezyki","polski","niska",
  "lektor","nauczyciel obsluga_klienta spedytor recepcjonista", 40,"kilka_osrodkow",
  "Jak filologia angielska, ale przy rzadszym jezyku przewaga na rynku pracy jest wieksza.",
  "Praktycznego jezyka na poziomie zawodowym bez wlasnej pracy poza uczelnia.")

k("teologia","Teologia","uniwersytecki","jednolite",5,"","polski historia","niska",
  "katecheta duszpasterz","koordynator_ngo animator nauczyciel", 55,"kilka_osrodkow",
  "Pismo Swiete, dogmatyka, historia Kosciola, etyka, filozofia.",
  "Zabezpieczenia zawodowego. Liczba etatow katechetycznych maleje, warto zdobyc drugi przedmiot.")

# ================= TWORZENIE I MEDIA =================
k("grafika","Grafika","artystyczny","jednolite",5,"rysunek","artystyczne","wysoka",
  "grafik ilustrator","projektant_ux montazysta projektant_produktu", 55,"kilka_osrodkow",
  "Rysunek, malarstwo, projektowanie graficzne, typografia, techniki druku.",
  "Umiejetnosci sprzedazy wlasnych uslug, od ktorej zalezy caly dochod przy pracy na swoim.")

k("wzornictwo","Wzornictwo przemyslowe","artystyczny","lic_mgr",5,"rysunek","artystyczne fizyka","wysoka",
  "projektant_produktu","grafik projektant_wnetrz architekt", 50,"kilka_osrodkow",
  "Projektowanie form uzytkowych, modelowanie 3D, technologie wytwarzania, prototypowanie.",
  "Duzego rynku w Polsce. Malo firm projektuje wlasne produkty, licz sie z klientami zagranicznymi.")

k("dziennikarstwo","Dziennikarstwo i komunikacja spoleczna","uniwersytecki","lic_mgr",5,"","polski historia wos","niska",
  "dziennikarz","pr redaktor copywriter social_media tworca_internetowy", 35,"duze_miasta",
  "Warsztat dziennikarski, prawo prasowe, media, komunikacja.",
  "Przewagi na rynku. Redakcje czesciej zatrudniaja specjalistow z dziedziny, o ktorej pisza, niz absolwentow dziennikarstwa.")

k("realizacja_obrazu","Realizacja obrazu filmowego i fotografia","artystyczny","lic_mgr",5,"","artystyczne rysunek","bardzo_wysoka",
  "operator_kamery fotograf","montazysta producent", 50,"jeden_osrodek",
  "Zdjecia, swiatlo, montaz, technologia filmowa. Bardzo duzo praktyki warsztatowej.",
  "Dostepu do zlecen. Ten daje reputacja na planie, budowana od noszenia sprzetu.")

k("produkcja_filmowa","Organizacja produkcji filmowej","artystyczny","lic_mgr",5,"","wos matematyka","wysoka",
  "producent","project_manager operator_kamery montazysta", 45,"jeden_osrodek",
  "Budzetowanie, harmonogramowanie, prawo autorskie, organizacja planu.", None)

k("muzyka_kier","Instrumentalistyka i wokalistyka","artystyczny","lic_mgr",5,"artystyczne","","bardzo_wysoka",
  "muzyk nauczyciel_muzyki","realizator_dzwieku instruktor_teatralny", 65,"kilka_osrodkow",
  "Gra na instrumencie, teoria muzyki, harmonia, gra zespolowa.",
  "Utrzymania z samego koncertowania. Wiekszosc muzykow w Polsce utrzymuje sie z nauczania.")

k("aktorstwo","Aktorstwo","artystyczny","jednolite",5,"artystyczne","polski","bardzo_wysoka",
  "aktor","instruktor_teatralny tworca_internetowy", 55,"kilka_osrodkow",
  "Warsztat aktorski, ruch sceniczny, emisja glosu, praca przed kamera.",
  "Etatu ani zlecen. Rekrutacja przyjmuje kilka procent kandydatow, a po dyplomie konkurencja jest jeszcze ostrzejsza.")

k("realizacja_dzwieku","Rezyseria dzwieku","artystyczny","lic_mgr",5,"","fizyka artystyczne matematyka","wysoka",
  "realizator_dzwieku","montazysta muzyk", 60,"kilka_osrodkow",
  "Akustyka, technika studyjna, miks, mastering, dzwiek w filmie.", None, alt=True)


k("wychowanie_fiz","Wychowanie fizyczne","uniwersytecki","lic_mgr",5,"","wf biologia","niska",
  "nauczyciel_wf trener_druzyny","trener_personalny instruktor_rekreacji fizjoterapeuta", 60,"kilka_osrodkow",
  "Anatomia, fizjologia wysilku, metodyka wychowania fizycznego, teoria sportu.",
  "Uprawnien trenerskich w dyscyplinie. Te daja licencje zwiazkowe, zdobywane osobno.")

k("praca_socj_organiz","Organizacja pomocy spolecznej","uniwersytecki","mgr",2,"","wos","niska",
  "kierownik_placowki","pracownik_socjalny asystent_rodziny", 65,"kilka_osrodkow",
  "Zarzadzanie placowkami, prawo pomocy spolecznej, finanse jednostek.", None)

k("doradztwo_zaw_kier","Doradztwo zawodowe i personalne","uniwersytecki","lic_mgr",5,"","wos polski","niska",
  "doradca_zawodowy","spec_hr rekruter coach trener_biznesu", 55,"kilka_osrodkow",
  "Metody diagnozy zawodowej, rynek pracy, poradnictwo, prowadzenie warsztatow.", None)

# ================= DROGI BEZ STUDIOW =================
A = {}
def a(kod, nazwa, typ, czas, koszt, zawody, wymagania):
    A[kod] = dict(nazwa=nazwa, typ=typ, czas=czas, koszt=koszt,
                  zawody=zawody.split(), wymagania=wymagania)

a("bs_elektryk","Szkola branzowa: elektryk","branzowa","3 lata","bezplatna",
  "elektryk instalator_pv technik_serwisu","Po szkole podstawowej. Uprawnienia SEP po 18 roku zycia.")
a("bs_mechanik","Szkola branzowa: mechanik pojazdow","branzowa","3 lata","bezplatna",
  "mechanik technik_serwisu operator_cnc","Po szkole podstawowej.")
a("bs_instalator","Szkola branzowa: monter instalacji","branzowa","3 lata","bezplatna",
  "hydraulik instalator_pv elektryk","Po szkole podstawowej. Uprawnienia gazowe i F-gazowe osobno.")
a("bs_stolarz","Szkola branzowa: stolarz","branzowa","3 lata","bezplatna",
  "stolarz krawiec","Po szkole podstawowej.")
a("bs_fryzjer","Szkola branzowa: fryzjer","branzowa","3 lata","bezplatna",
  "fryzjer kosmetolog","Po szkole podstawowej.")
a("bs_kucharz","Szkola branzowa: kucharz","branzowa","3 lata","bezplatna",
  "kucharz cukiernik szef_kuchni","Po szkole podstawowej.")
a("bs_slusarz","Szkola branzowa: slusarz i mechanik","branzowa","3 lata","bezplatna",
  "spawacz operator_cnc mechanik","Po szkole podstawowej. Uprawnienia spawalnicze osobno.")
a("bs_rolnik","Szkola branzowa: rolnik i ogrodnik","branzowa","3 lata","bezplatna",
  "ogrodnik agronom","Po szkole podstawowej.")

a("tech_informatyk","Technikum informatyczne","technikum","5 lat","bezplatna",
  "programista tester administrator wsparcie_tech","Po szkole podstawowej. Matura otwiera dodatkowo studia.")
a("tech_elektronik","Technikum elektroniczne i mechatroniczne","technikum","5 lat","bezplatna",
  "technik_serwisu automatyk elektryk operator_cnc","Po szkole podstawowej.")
a("tech_budowlane","Technikum budowlane","technikum","5 lat","bezplatna",
  "kosztorysant geodeta kierownik_budowy","Po szkole podstawowej. Uprawnienia wymagaja studiow.")
a("tech_ekonomiczne","Technikum ekonomiczne","technikum","5 lat","bezplatna",
  "ksiegowy spec_plac spec_admin obsluga_klienta","Po szkole podstawowej.")
a("tech_gastro","Technikum gastronomiczne i hotelarskie","technikum","5 lat","bezplatna",
  "kucharz cukiernik kelner recepcjonista barista","Po szkole podstawowej.")
a("tech_weterynarii","Technikum weterynaryjne","technikum","5 lat","bezplatna",
  "technik_wet","Po szkole podstawowej.")

a("sp_farmaceutyczny","Szkola policealna: technik farmaceutyczny","policealna","2 lata","bezplatna w publicznej",
  "technik_farm","Po maturze albo po szkole sredniej.")
a("sp_opiekun","Szkola policealna: opiekun medyczny","policealna","1 do 1,5 roku","bezplatna w publicznej",
  "opiekun_med opiekun_starszej asystent_niepelno","Po szkole sredniej. Najszybsze wejscie do ochrony zdrowia.")
a("sp_bhp","Szkola policealna: technik BHP","policealna","1,5 roku","bezplatna w publicznej",
  "spec_bhp","Po szkole sredniej.")
a("sp_masaz","Szkola policealna: technik masazysta","policealna","2 lata","bezplatna w publicznej",
  "masazysta","Po szkole sredniej.")
a("sp_optyk","Szkola policealna: technik optyk","policealna","2 lata","bezplatna w publicznej",
  "optyk protetyk_sluchu","Po szkole sredniej.")
a("sp_analityk","Szkola policealna: technik analityki","policealna","2 lata","bezplatna w publicznej",
  "technik_lab","Po szkole sredniej.")

a("kurs_spawanie","Kurs spawania z uprawnieniami","kurs","2 do 6 tygodni","1500 do 3500 zl",
  "spawacz","Od 18 lat. Najkrotsza droga do zarobkow powyzej sredniej krajowej.")
a("kurs_pv","Kurs instalatora fotowoltaiki","kurs","1 do 3 tygodni","1500 do 4000 zl",
  "instalator_pv","Od 18 lat. Plus uprawnienia SEP i do pracy na wysokosci.")
a("kurs_cnc","Kurs operatora CNC","kurs","1 do 3 miesiecy","2000 do 5000 zl",
  "operator_cnc","Czesto finansowany przez pracodawce albo urzad pracy.")
a("kurs_prawo_jazdy_c","Prawo jazdy C, CE i kwalifikacja wstepna","kurs","3 do 6 miesiecy","11000 do 20000 zl",
  "kierowca","Od 18 lat, transport miedzynarodowy zwykle od 21. Czesto finansowany przez przewoznika.")
a("kurs_opiekun","Kurs opiekuna osoby starszej","kurs","kilka tygodni","800 do 3000 zl",
  "opiekun_starszej asystent_niepelno","Czesto bezplatny w programach urzedu pracy albo agencji.")
a("kurs_zlobek","Kurs opiekuna w zlobku","kurs","280 godzin","600 do 2500 zl",
  "opiekunka_dziecieca","Najszybsze wejscie do pracy z dziecmi.")
a("kurs_barber","Kurs fryzjerski i barberski","kurs","3 do 12 miesiecy","3000 do 12000 zl",
  "fryzjer","Alternatywa dla szkoly branzowej dla osob po maturze.")
a("kurs_ksiegowosc","Kurs ksiegowosci od podstaw","kurs","3 do 6 miesiecy","2500 do 7000 zl",
  "ksiegowy spec_plac","Realna droga takze dla osob zmieniajacych zawod.")
a("kurs_kosztorys","Kurs kosztorysowania","kurs","1 do 3 miesiecy","2000 do 6000 zl",
  "kosztorysant","Najlepsza droga dla osoby z budowy przechodzacej do biura.")
a("kurs_trener","Kurs instruktora i trenera personalnego","kurs","kilka tygodni","1500 do 4000 zl",
  "trener_personalny instruktor_rekreacji","Od 18 lat.")
a("kurs_it","Bootcamp albo nauka wlasna: programowanie i testowanie","kurs","6 do 18 miesiecy","0 do 20000 zl",
  "programista tester wsparcie_tech administrator","Bez wymagan formalnych. Decyduje portfolio, nie certyfikat.")
a("kurs_marketing","Nauka wlasna i kursy: marketing cyfrowy","kurs","6 do 12 miesiecy","0 do 6000 zl",
  "spec_marketingu seo social_media copywriter","Bez wymagan. Decyduje wlasny projekt z realnym odbiorca.")
a("kurs_grafika","Nauka wlasna i kursy: projektowanie","kurs","6 do 18 miesiecy","0 do 15000 zl",
  "grafik projektant_ux ilustrator montazysta","Bez wymagan. Decyduje portfolio.")
a("pod_pedagogiczne","Studia podyplomowe: przygotowanie pedagogiczne","podyplomowe","2 semestry","3000 do 6000 zl",
  "nauczyciel katecheta nauczyciel_wf","Dla osob po dowolnych studiach kierunkowych.")
a("pod_doradztwo","Studia podyplomowe: doradztwo zawodowe","podyplomowe","2 semestry","4000 do 8000 zl",
  "doradca_zawodowy","Najczestsza droga do tego zawodu.")
a("pod_pedspec","Studia podyplomowe: pedagogika specjalna","podyplomowe","2 do 3 semestry","4000 do 9000 zl",
  "pedagog_specjalny terapeuta_zajeciowy","Dla nauczycieli innych przedmiotow. Droga coraz czestsza.")
a("aplikacje","Aplikacja prawnicza","aplikacja","3 do 4 lata","20000 do 40000 zl",
  "radca_prawny notariusz","Po studiach prawniczych, po zdaniu egzaminu wstepnego.")
a("szkola_terapii","Szkola psychoterapii","szkolenie","4 lata","35000 do 70000 zl",
  "psychoterapeuta interwent","Po studiach i po doswiadczeniu w ochronie zdrowia albo pomocy.")
a("specjalizacja_med","Rezydentura i specjalizacja medyczna","specjalizacja","4 do 6 lat","bezplatna, platna praca",
  "lekarz","Po studiach i stazu, po egzaminie LEK.")
a("uprawnienia_bud","Uprawnienia budowlane","uprawnienia","1 do 3 lata praktyki","2000 do 3500 zl egzamin",
  "inzynier_budownictwa kierownik_budowy architekt projektant_instalacji","Po studiach technicznych.")


# --- drogi wejsciowe: nabor, pracodawca, wlasna dzialalnosc ---
a("nabor_sluzby","Nabor do sluzb mundurowych","nabor","6 do 12 miesiecy","bezplatny",
  "policjant zolnierz funkcjonariusz_sw strazak",
  "Matura, testy sprawnosciowe, psychologiczne i badania. Szkolenie w szkole sluzby, platne od pierwszego dnia.")
a("nabor_ratownictwo","Kursy ratownictwa gorskiego i wodnego","kurs","6 do 24 miesiecy","2000 do 8000 zl",
  "ratownik_gorski strazak",
  "Czlonkostwo w sluzbie ochotniczej, kursy stopniowe, bardzo dobra sprawnosc fizyczna.")
a("praca_handel","Wejscie przez pracodawce: sprzedaz i obsluga","pracodawca","0 do 3 miesiecy szkolenia","bezplatne",
  "handlowiec account_manager agent_nieruchomosci rekruter doradca_bank obsluga_klienta",
  "Bez wymagan formalnych. Pracodawca szkoli, daje narzedzia, czesto samochod. Najtansze wejscie do dobrze platnego zawodu.")
a("praca_transport","Wejscie przez pracodawce: spedycja i dyspozytornia","pracodawca","0 do 3 miesiecy szkolenia","bezplatne",
  "spedytor dyspozytor kierownik_magazynu",
  "Bez wymagan formalnych. Jezyk obcy podnosi stawke bardziej niz dyplom.")
a("praca_it_wejscie","Wejscie przez pracodawce: wsparcie i wdrozenia IT","pracodawca","1 do 3 miesiecy szkolenia","bezplatne",
  "wsparcie_tech spec_wdrozen tester administrator devops",
  "Podstawy techniczne plus jezyk. Czesto brama do dalszych rol w IT.")
a("praca_gastro","Wejscie przez pracodawce: gastronomia i hotelarstwo","pracodawca","od zaraz","bezplatne",
  "kelner barista kucharz recepcjonista menedzer_restauracji",
  "Bez zadnych wymagan wstepnych. Najlatwiejsze wejscie na rynek pracy w calej bazie.")
a("awans_wewnetrzny","Awans wewnetrzny po latach pracy","awans","4 do 10 lat","bezplatny",
  "kierownik_zespolu szef_kuchni menedzer_restauracji kierownik_magazynu kierownik_ruchu kierownik_placowki glowny_ksiegowy",
  "Droga przez lata pracy w tym samym obszarze. Bez doswiadczenia wykonawczego zespol nie uzna autorytetu.")
a("wlasna_po_fachu","Wlasna dzialalnosc po latach w fachu","dzialalnosc","3 do 8 lat fachu","20 do 500 tys. zl",
  "wlasciciel_uslugowej wlasciciel_warsztatu wlasciciel_lokalu franczyzobiorca zalozyciel_tech",
  "Najpierw fach albo branza, potem firma. Przedsiebiorczosc jest nadbudowa nad kompetencja, nie jej zamiennikiem.")
a("kurs_fotografia","Kursy i asysta: fotografia i obraz","kurs","1 do 3 lata","4000 do 50000 zl sprzetu",
  "fotograf operator_kamery montazysta",
  "Bez wymagan formalnych. Decyduje portfolio i asysta u doswiadczonego fotografa albo na planie.")
a("kurs_dzwiek","Kursy i asysta: realizacja dzwieku","kurs","1 do 3 lata","0 do 20000 zl",
  "realizator_dzwieku","Wejscie od noszenia sprzetu przy naglosnieniu wydarzen. Szkola pomaga, ale nie zastapi godzin przy konsolecie.")
a("kurs_trenerski","Kursy trenerskie i licencje sportowe","kurs","1 do 4 lata","1500 do 8000 zl",
  "trener_druzyny trener_personalny instruktor_rekreacji nauczyciel_wf",
  "Licencje zwiazkowe zdobywane stopniowo. W wielu dyscyplinach znacza wiecej niz studia.")
a("kurs_coaching","Szkola coachingu i szkolen","kurs","6 do 18 miesiecy","8000 do 25000 zl",
  "coach trener_biznesu","Wymaga wczesniejszego doswiadczenia zawodowego. Bez niego nie ma czego uczyc.")
a("kurs_lektorski","Certyfikat jezykowy i kurs metodyczny","kurs","6 do 18 miesiecy","2500 do 9000 zl",
  "lektor","Certyfikat C1 albo C2 plus metodyka. Decyduje poziom jezyka, nie dyplom.")
a("wolontariat_ngo","Wolontariat i praca w organizacji","wolontariat","6 miesiecy do 2 lat","bezplatny",
  "animator koordynator_ngo fundraiser asystent_niepelno misjonarz",
  "Najczestsza i najtansza droga do sektora pozarzadowego. Kierunek studiow ma tu mniejsze znaczenie niz doswiadczenie.")
a("nauka_wlasna_media","Nauka wlasna: tworzenie tresci","nauka_wlasna","1 do 3 lata","1000 do 8000 zl sprzetu",
  "tworca_internetowy montazysta social_media",
  "Brak formalnej drogi. Decyduje regularnosc publikowania przez lata. Realistycznie: rok do trzech bez dochodu.")
a("misje_formacja","Formacja misyjna","formacja","6 do 24 miesiecy","bezplatna albo symboliczna",
  "misjonarz","Wymaga wczesniej zdobytego zawodu. Krotki wyjazd przed decyzja jest odpowiednikiem stazu.")

if __name__ == "__main__":
    print(f"kierunkow studiow: {len(K)}")
    print(f"drog bez studiow: {len(A)}")