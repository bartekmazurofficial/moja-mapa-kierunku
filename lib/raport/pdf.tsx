/**
 * Eksport raportu do PDF.
 *
 * PDF rzadzi sie innymi regulami niz ekran: to jest zdjecie z konkretnego dnia,
 * ktore bedzie istniec latami.
 *   - sekcje zamkniete sa pomijane, nie wygaszane,
 *   - data wygenerowania stoi na stronie tytulowej, duza czcionka,
 *   - nie wchodza flagi i ostrzezenia przeznaczone dla prowadzacego,
 *   - nie wchodzi zadna liczba dopasowania: jesli zdanie zle zabrzmi czytane
 *     za dwa lata, nie ma go w PDF.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { Document, Font, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

const KATALOG_FONTOW = join(process.cwd(), "data/generated/fonty");

let fontyGotowe = false;

function zarejestrujFonty(): void {
  if (fontyGotowe) return;
  const sciezka = (n: string) => join(KATALOG_FONTOW, n);
  if (!existsSync(sciezka("serif-400.ttf"))) {
    throw new Error("Brak fontów do PDF. Uruchom: npm run fonty");
  }
  // Pliki sa scalone z dwoch podzbiorow (alfabet podstawowy i polskie znaki),
  // wiec jedna rodzina wystarcza. Szczegoly w scripts/przygotuj-fonty.ts.
  Font.register({
    family: "Serif",
    fonts: [{ src: sciezka("serif-400.ttf") }, { src: sciezka("serif-600.ttf"), fontWeight: 600 }],
  });
  Font.register({
    family: "Sans",
    fonts: [{ src: sciezka("sans-400.ttf") }, { src: sciezka("sans-500.ttf"), fontWeight: 500 }],
  });
  Font.registerHyphenationCallback((slowo) => [slowo]);
  fontyGotowe = true;
}

/**
 * Fonty musza byc wczytane PRZED pierwszym pomiarem tekstu. Bez tego pierwszy
 * fragment na stronie renderuje sie domyslna Helvetica, ktora nie ma polskich
 * znakow, i w PDF pojawia sie "Fund" zamiast "Fundacja".
 */
async function wczytajFonty(): Promise<void> {
  zarejestrujFonty();
  await Promise.all([Font.load({ fontFamily: "Sans" }), Font.load({ fontFamily: "Serif" })]);
}

const s = StyleSheet.create({
  strona: { paddingTop: 56, paddingBottom: 64, paddingHorizontal: 56, backgroundColor: "#ffffff" },
  tytulowaStrona: { paddingTop: 140, paddingHorizontal: 56, backgroundColor: "#ffffff" },
  nadtytul: { fontFamily: "Sans", fontSize: 9, letterSpacing: 1.4, color: "#6f675e" },
  tytul: { fontFamily: "Serif", fontSize: 34, marginTop: 14, color: "#1c1917" },
  imie: { fontFamily: "Serif", fontSize: 22, marginTop: 26, color: "#1c1917" },
  dataDuza: { fontFamily: "Serif", fontSize: 18, marginTop: 60, color: "#2f5d50" },
  zastrzezenie: { fontFamily: "Sans", fontSize: 9, lineHeight: 1.6, color: "#6f675e", marginTop: 22, maxWidth: 380 },
  naglowekSekcji: { fontFamily: "Serif", fontSize: 16, marginBottom: 10, color: "#1c1917" },
  sekcja: { marginBottom: 26 },
  akapit: { fontFamily: "Serif", fontSize: 10.5, lineHeight: 1.65, color: "#1c1917", marginBottom: 7 },
  drobne: { fontFamily: "Sans", fontSize: 9, lineHeight: 1.55, color: "#57534e", marginBottom: 4 },
  etykieta: { fontFamily: "Sans", fontSize: 8, letterSpacing: 1, color: "#6f675e", marginBottom: 4, marginTop: 8 },
  pozycja: { fontFamily: "Sans", fontSize: 11, color: "#1c1917", marginBottom: 2 },
  punkt: { flexDirection: "row", marginBottom: 3 },
  kropka: { fontFamily: "Sans", fontSize: 10, color: "#6f675e", width: 12 },
  karta: { borderLeftWidth: 2, borderLeftColor: "#d6cec2", paddingLeft: 12, marginBottom: 14 },
  stopka: { position: "absolute", bottom: 28, left: 56, right: 56, fontFamily: "Sans", fontSize: 7.5, lineHeight: 1.5, color: "#6f675e" },
});

function Akapity({ teksty }: { teksty: string[] }) {
  return (
    <>
      {teksty.map((t, i) => (
        <Text key={i} style={s.akapit}>
          {t}
        </Text>
      ))}
    </>
  );
}

function Punkty({ pozycje }: { pozycje: string[] }) {
  return (
    <>
      {pozycje.map((p, i) => (
        <View key={i} style={s.punkt}>
          <Text style={s.kropka}>·</Text>
          <Text style={s.drobne}>{p}</Text>
        </View>
      ))}
    </>
  );
}

/**
 * Cztery sekcje raportu.
 *
 * Uczestnik, ktory pobiera plik przed odsloniecem zawodow, dostaje dokument
 * bez sekcji czwartej, a nie dokument z pusta ramka i obietnica.
 *
 * Zawody sa tu z uzasadnieniem i widelkami, ale **bez liczby dopasowania**,
 * tak samo jak na ekranie. Plik bedzie istniec latami i ktos go przeczyta bez
 * nas w pokoju, wiec nie moze zawierac zdania, ktorego nie dalo sie obronic.
 */
export interface DanePdfNowy {
  imie: string;
  dataWygenerowania: string;
  stopka: string;
  tematy: string[];
  lubie: string[];
  umiem: string[];
  listy: Array<{ tytul: string; opis: string; pozycje: string[] }>;
  poziom: { minimum: string; komfort: string; cel: string; rocznie: string } | null;
  koszty: Array<{ nazwa: string; kwota: string; udzial: number }>;
  /** Pusta lista znaczy: warstwa z zawodami jeszcze zamknieta. */
  zawody: Array<{
    nazwa: string;
    bezStudiow: boolean;
    uzasadnienie: string | null;
    widelki: string | null;
    finanse: string | null;
  }>;
}

function DokumentNowy(d: DanePdfNowy) {
  const stopka = (
    <Text style={s.stopka} fixed render={({ pageNumber }) => `${d.stopka}   ·   ${pageNumber}`} />
  );
  const Naglowek = ({ tytul }: { tytul: string }) => (
    <Text style={s.naglowekSekcji} minPresenceAhead={48}>
      {tytul}
    </Text>
  );

  return (
    <Document title={`Moja mapa kierunku: ${d.imie}`} author="Fundacja Służąc Życiu">
      <Page size="A4" style={s.tytulowaStrona}>
        <Text style={s.nadtytul}>FUNDACJA SŁUŻĄC ŻYCIU</Text>
        <Text style={s.tytul}>Moja mapa kierunku</Text>
        <Text style={s.imie}>{d.imie}</Text>
        <Text style={s.dataDuza}>{d.dataWygenerowania}</Text>
        <Text style={s.zastrzezenie}>{d.stopka}</Text>
      </Page>

      <Page size="A4" style={s.strona}>
        {d.tematy.length > 0 ? (
          <View style={s.sekcja}>
            <Naglowek tytul="Co Cię ciekawi" />
            <Text style={s.akapit}>
              Piątka tematów, przy których zostałeś po trzech coraz trudniejszych pytaniach. Temat
              nie jest zawodem: mówi, w jakiej branży ta sama praca będzie dla Ciebie ciekawsza.
            </Text>
            <Punkty pozycje={d.tematy.map((t, i) => `${i + 1}. ${t}`)} />
          </View>
        ) : null}

        {d.lubie.length > 0 || d.umiem.length > 0 ? (
          <View style={s.sekcja}>
            <Naglowek tytul="Co lubisz i w czym jesteś dobry" />
            <Text style={s.etykieta}>LUBISZ NAJBARDZIEJ</Text>
            <Punkty pozycje={d.lubie.map((t, i) => `${i + 1}. ${t}`)} />
            <Text style={s.etykieta}>WYCHODZI CI NAJLEPIEJ</Text>
            <Punkty pozycje={d.umiem.map((t, i) => `${i + 1}. ${t}`)} />
            {d.listy
              .filter((l) => l.pozycje.length > 0)
              .map((l) => (
                <View key={l.tytul} style={s.karta}>
                  <Text style={s.pozycja}>{l.tytul}</Text>
                  <Text style={s.drobne}>{l.opis}</Text>
                  <Text style={s.drobne}>{l.pozycje.join(" · ")}</Text>
                </View>
              ))}
          </View>
        ) : null}

        {d.poziom ? (
          <View style={s.sekcja}>
            <Naglowek tytul="Ile kosztuje życie, którego chcesz" />
            <Text style={s.akapit}>
              Nie pytaliśmy, ile chcesz zarabiać. Zaprojektowałeś życie, a kwota wyszła z niego
              sama. Dlatego da się ją sprawdzić.
            </Text>
            <Text style={s.drobne}>Minimum: {d.poziom.minimum} netto miesięcznie</Text>
            <Text style={s.drobne}>Komfort: {d.poziom.komfort} netto miesięcznie</Text>
            <Text style={s.drobne}>Cel: {d.poziom.cel} netto miesięcznie</Text>
            <Text style={s.drobne}>Rocznie: {d.poziom.rocznie}</Text>
            <Text style={s.etykieta}>CO NAJBARDZIEJ PODNOSI TEN KOSZT</Text>
            <Punkty pozycje={d.koszty.map((k) => `${k.nazwa}: ${k.kwota}, ${k.udzial}%`)} />
          </View>
        ) : null}

        {d.zawody.length > 0 ? (
          <View style={s.sekcja}>
            <Naglowek tytul="Zawody, od których warto zacząć" />
            <Text style={s.akapit}>
              To nie jest wyrok ani ranking. To lista miejsc, w których Twoje odpowiedzi spotykają
              się z realną pracą, celowo różnorodna.
            </Text>
            {d.zawody.map((z, i) => (
              <View key={z.nazwa} style={s.karta}>
                <Text style={s.pozycja}>
                  {i + 1}. {z.nazwa}
                  {z.bezStudiow ? "  (bez studiów)" : ""}
                </Text>
                {z.uzasadnienie ? <Text style={s.drobne}>{z.uzasadnienie}</Text> : null}
                {z.widelki ? <Text style={s.drobne}>{z.widelki}</Text> : null}
                {z.finanse ? <Text style={s.drobne}>{z.finanse}</Text> : null}
              </View>
            ))}
            <Text style={s.drobne}>
              Ta lista ma być punktem wyjścia do rozmowy, a nie jej końcem.
            </Text>
          </View>
        ) : null}

        {stopka}
      </Page>
    </Document>
  );
}

export async function zbudujPdfNowy(dane: DanePdfNowy): Promise<Buffer> {
  await wczytajFonty();
  return renderToBuffer(<DokumentNowy {...dane} />);
}
