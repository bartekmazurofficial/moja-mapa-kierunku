/**
 * Slowniki kontrolowane bazy 157 zawodow (kody kart).
 *
 * Zrodlo: program-doradztwa/08_kod_referencyjny/baza_1.py.
 * To NIE sa te same kody, co w modulach diagnostycznych - karty maja wlasny,
 * bogatszy slownik. Odwzorowanie kodow kart na wyniki modulow zyje w
 * lib/engine/mapowanie.ts i jest osobna decyzja projektowa.
 */

export const KODY_A1 = [
  "przekonywanie", "prowadzenie", "planowanie", "liczby", "pieniadze", "porzadek", "precyzja",
  "prawo", "tech", "dociekanie", "naprawianie", "rece", "ruch", "przyroda", "zdrowie",
  "opieka", "rozmowa", "uczenie", "wspolnota", "obraz", "pisanie", "dzwiek", "scena",
  "przedsiebiorczosc"
] as const;

export const KODY_A2 = [
  "problemy", "analiza", "system", "uczenie_sie", "zapamietywanie", "dokladnosc", "rachunki",
  "reguly", "organizowanie", "wielozadaniowosc", "manualne", "sprzet", "wytrzymalosc",
  "przestrzenna", "estetyka", "tworzenie", "slowo", "wystapienia", "przekonywanie",
  "negocjowanie", "wyczuwanie", "opiekunczosc", "cierpliwosc", "uprzejmosc", "rozbrajanie",
  "prowadzenie_grupy", "wyjasnianie", "opanowanie", "samodzielnosc", "odpornosc",
  "konfrontacja", "wytrwalosc", "zespol"
] as const;

export const KODY_A3 = [
  "struktura", "elastycznosc", "cisza", "bodzce", "glebia", "szerokosc", "samodzielnie",
  "zespol", "dokladnosc", "tempo", "ludzie", "rzeczy", "inicjatywa", "reagowanie",
  "konfrontacja", "zgoda", "ryzyko", "bezpieczenstwo", "efekt_widoczny", "efekt_odroczony",
  "wlasne_pomysly", "gotowe", "powtarzalnosc", "zmiennosc"
] as const;

export const KODY_A4 = [
  "pieniadze", "stabilnosc", "wolnosc", "wplyw", "sens", "uznanie", "rozwoj", "mistrzostwo",
  "relacje", "czas_dla_siebie", "zasady", "zmiennosc", "wspolnota", "bezpieczenstwo", "cisza",
  "efekt_widoczny"
] as const;

export const KODY_A5 = [
  "studia", "dlugie_studia", "egzaminy", "doksztalcanie", "zmiany", "noce", "weekendy",
  "dyzury", "nadgodziny", "nieregularne", "wyjazdy", "przeprowadzka", "fizyczna", "stanie",
  "dzwiganie", "brud", "halas", "goraco", "zimno", "wysokosc", "kazda_pogoda", "krew",
  "chorzy", "umieranie", "agresja", "ludzie_ciagle", "roszczeniowi", "wystapienia", "komputer",
  "samotnosc", "presja", "odpowiedzialnosc", "niepewny_dochod", "wlasna_dzialalnosc",
  "ryzyko_finansowe", "powtarzalnosc", "dzieci", "ciasnota", "chemikalia", "wieczory",
  "zagranica"
] as const;

export const KODY_M1 = [
  "osiadlosc", "mobilnosc", "duza_organizacja", "maly_zespol", "wlasne", "zdalna",
  "stacjonarna", "duzo_godzin", "mniej_godzin", "granica_ostra", "przenika", "szybkie_wejscie",
  "dluga_inwestycja", "wysoki_poziom_zycia", "prowadzenie"
] as const;

export const KODY_ANTY = [
  "potrzeba_ludzi", "potrzeba_ciszy", "potrzeba_ruchu", "potrzeba_stabilnosci", "efekt_szybki",
  "efekt_widoczny", "kontrola_efektu", "nuda_powtarzalnosc", "unikanie_konfliktu",
  "cudza_zlosc", "krytyka_osobista", "odmowa_do_siebie", "zabieranie_do_domu", "umieranie",
  "fizycznosc", "dotyk", "brud_nie", "ciasnota_nie", "wysokosc_nie", "stanie_nie",
  "kregoslup_slaby", "rece_slabe", "wzrok_slaby", "sluch_slaby", "potrzeba_uznania",
  "potrzeba_rozwoju", "sprzedaz_nie", "dokumentacja_nie", "procedury_nie", "bez_ograniczen",
  "nietykalnosc_pracy", "doksztalcanie_nie", "weekendy_nie", "noce_nie", "wieczory_nie",
  "stala_pensja", "samodyscyplina_brak", "mierzenie", "potrzeba_decydowania", "waska_wiedza",
  "agresja", "bez_uzasadnienia", "bez_zawodu", "goraco_nie", "komunikacja_ostra",
  "konflikt_rodzic", "konfrontacja_nie", "potrzeba_doradzania", "potrzeba_gotowania",
  "potrzeba_jakosci", "potrzeba_pewnosci", "potrzeba_prywatnosci", "potrzeba_relacji",
  "potrzeba_tworzenia", "potrzeba_zmiennosci", "rachunki_nie", "samotnosc_w_roli",
  "tworczosc_od_razu", "wczesne_wstawanie", "wizualizacje_tylko"
] as const;

export const KODY_PRZEDMIOTY = [
  "matematyka", "fizyka", "chemia", "biologia", "informatyka", "polski", "jezyki", "historia",
  "wos", "geografia", "artystyczne", "wf", "zawodowe", "rysunek"
] as const;

export const KODY_PRZECIWWSKAZANIA = [
  "alergie_wziewne", "alergie_skorne", "kregoslup", "wzrok", "sluch", "wysokosc"
] as const;

export const KODY_DOSWIADCZENIE = [
  "praca_doryw", "praca_stala", "wolontariat", "firma_rodzinna", "projekty", "hobby",
  "prowadzenie", "kursy", "konkursy"
] as const;

export const KODY_KOSZTY = [
  "zerowy", "bardzo_niski", "niski", "sredni", "wysoki", "bardzo_wysoki"
] as const;

export const KODY_ZAGROZENIA = [
  "bardzo_niskie", "niskie", "umiarkowane", "wysokie", "bardzo_wysokie"
] as const;

export const KODY_POZIOMY = [
  "szybki", "sredni", "dlugi", "bardzo_dlugi"
] as const;

export type KodPoziomu = (typeof KODY_POZIOMY)[number];
export type KodKosztu = (typeof KODY_KOSZTY)[number];
export type KodZagrozenia = (typeof KODY_ZAGROZENIA)[number];
