/**
 * Ilustracje odpowiedzi w A0.
 *
 * Lista jest generowana z katalogu `public/grafika/a0/`:
 *
 *   npx tsx scripts/grafiki.ts <katalog ze zrodlami> a0
 *   npx tsx scripts/spis-a0.ts
 *
 * Aplikacja czyta te liste, a nie dysk, bo build nie ma chodzic po plikach.
 * Klucz bez pliku pokazalby pusta ramke, a plik bez klucza nie pokazalby sie
 * wcale, wiec jedno i drugie trzyma w zgodzie test `tests/grafiki.test.ts`.
 *
 * Klucze `a0-pytanie-*` to kadr nad odpowiedziami, jeden na cale pytanie.
 * Reszta to kadry przy pojedynczych odpowiedziach.
 */

export const OBRAZY_A0: ReadonlySet<string> = new Set([
  "a0-branza-biuro",
  "a0-branza-budowlanka",
  "a0-branza-edukacja",
  "a0-branza-gastronomia",
  "a0-branza-handel",
  "a0-branza-inne",
  "a0-branza-it",
  "a0-branza-kreatywne",
  "a0-branza-nie_pracowalem",
  "a0-branza-opieka",
  "a0-branza-produkcja",
  "a0-branza-rolnictwo",
  "a0-branza-sluzby",
  "a0-branza-transport",
  "a0-branza-uslugi",
  "a0-doswiadczenie-firma_rodzinna",
  "a0-doswiadczenie-hobby",
  "a0-doswiadczenie-konkursy",
  "a0-doswiadczenie-kursy",
  "a0-doswiadczenie-praca_doryw",
  "a0-doswiadczenie-praca_stala",
  "a0-doswiadczenie-praktyki",
  "a0-doswiadczenie-projekty",
  "a0-doswiadczenie-prowadzenie",
  "a0-doswiadczenie-wolontariat",
  "a0-etap-branzowa",
  "a0-etap-liceum_1_2",
  "a0-etap-liceum_maturalna",
  "a0-etap-nie_uczy_nie_pracuje",
  "a0-etap-po_maturze",
  "a0-etap-po_studiach",
  "a0-etap-podstawowka",
  "a0-etap-pracuje_zmiana",
  "a0-etap-studiuje",
  "a0-ograniczenia-alergie_skorne",
  "a0-ograniczenia-alergie_wziewne",
  "a0-ograniczenia-inne",
  "a0-ograniczenia-kregoslup",
  "a0-ograniczenia-sluch",
  "a0-ograniczenia-wysokosc",
  "a0-ograniczenia-wzrok",
  "a0-przedmiot-artystyczne",
  "a0-przedmiot-biologia",
  "a0-przedmiot-chemia",
  "a0-przedmiot-fizyka",
  "a0-przedmiot-geografia",
  "a0-przedmiot-historia",
  "a0-przedmiot-informatyka",
  "a0-przedmiot-jezyki",
  "a0-przedmiot-matematyka",
  "a0-przedmiot-polski",
  "a0-przedmiot-warsztat",
  "a0-przedmiot-wf",
  "a0-przedmiot-wos",
  "a0-przedmiot-zawodowe",
  "a0-pytanie-dojazd",
  "a0-pytanie-kierunek_ocena",
  "a0-pytanie-miejsce",
  "a0-pytanie-mobilnosc",
  "a0-pytanie-staz_pracy",
  "a0-pytanie-zasoby",
  "a0-wyksztalcenie-branzowe",
  "a0-wyksztalcenie-licencjat",
  "a0-wyksztalcenie-magister",
  "a0-wyksztalcenie-podstawowe",
  "a0-wyksztalcenie-podyplomowe",
  "a0-wyksztalcenie-srednie",
  "a0-wyksztalcenie-technikum_matura",
]);
