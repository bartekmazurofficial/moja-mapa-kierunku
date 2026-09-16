/**
 * Eksport raportu do PDF.
 *
 * PDF rzadzi sie innymi regulami niz ekran: to jest zdjecie z konkretnego dnia,
 * ktore bedzie istniec latami.
 *   - sekcje zamkniete sa pomijane, nie wygaszane,
 *   - data wygenerowania stoi na stronie tytulowej, duza czcionka,
 *   - oznaczenia zawodow to zapisany stan z dnia eksportu,
 *   - nie wchodza flagi i ostrzezenia przeznaczone dla prowadzacego,
 *   - nie wchodza sformulowania o slabszych stronach i antydopasowaniach:
 *     jesli zdanie zle zabrzmi czytane za dwa lata, nie ma go w PDF.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { Document, Font, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import type { Raport } from "./typy";
import { SEKCJE_PO_ID } from "./sekcje";

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

function Sekcja({ id, children }: { id: string; children: React.ReactNode }) {
  const def = SEKCJE_PO_ID.get(id);
  return (
    // Sekcja musi moc sie lamac miedzy stronami. Wczesniej stalo tu
    // `wrap={false}` i dokument przestawal sie renderowac w ogole, gdy sekcja
    // urosla ponad wysokosc strony: „Node of type VIEW can't wrap between pages".
    // Naglowek trzyma sie tresci przez minPresenceAhead, zeby nie zostawal sam
    // na dole strony.
    <View style={s.sekcja}>
      <Text style={s.naglowekSekcji} minPresenceAhead={48}>
        {def?.tytul ?? id}
      </Text>
      {children}
    </View>
  );
}

export interface DanePdf {
  raport: Raport;
  oceny: Record<string, string>;
}

const NAZWY_OCEN: Record<string, string> = {
  interesuje: "interesuje mnie",
  moze: "może",
  nie_dla_mnie: "nie dla mnie",
};

function Dokument({ raport, oceny }: DanePdf) {
  const stopka = (
    <Text style={s.stopka} fixed render={({ pageNumber }) => `${raport.stopka}   ·   ${pageNumber}`} />
  );

  return (
    <Document title={`Moja mapa kierunku: ${raport.imie}`} author="Fundacja Służąc Życiu">
      <Page size="A4" style={s.tytulowaStrona}>
        <Text style={s.nadtytul}>FUNDACJA SŁUŻĄC ŻYCIU</Text>
        <Text style={s.tytul}>Moja mapa kierunku</Text>
        <Text style={s.imie}>{raport.imie}</Text>
        <Text style={s.dataDuza}>{raport.dataWygenerowania}</Text>
        <Text style={s.zastrzezenie}>{raport.stopka}</Text>
      </Page>

      <Page size="A4" style={s.strona}>
        {raport.profil_w_jednym_ekranie ? (
          <Sekcja id="profil_w_jednym_ekranie">
            <Akapity teksty={raport.profil_w_jednym_ekranie.zdania} />
          </Sekcja>
        ) : null}

        {raport.punkt_startu ? (
          <Sekcja id="punkt_startu">
            <Text style={s.drobne}>Gdzie jesteś: {raport.punkt_startu.gdzieJestes}</Text>
            <Text style={s.drobne}>Co Ci idzie: {raport.punkt_startu.coCiIdzie.join(", ")}</Text>
            <Text style={s.drobne}>Skąd startujesz: {raport.punkt_startu.skadStartujesz}</Text>
            <Text style={s.etykieta}>CO TO OTWIERA</Text>
            <Punkty pozycje={raport.punkt_startu.coToOtwiera} />
          </Sekcja>
        ) : null}

        {raport.co_mnie_interesuje ? (
          <Sekcja id="co_mnie_interesuje">
            <Text style={s.akapit}>{raport.co_mnie_interesuje.zdanie}</Text>
            {raport.co_mnie_interesuje.gora.map((p) => (
              <View key={p.tytul} style={s.karta}>
                <Text style={s.pozycja}>{p.tytul}</Text>
                <Text style={s.drobne}>{p.opis}</Text>
                <Text style={s.drobne}>Co to zmienia: {p.coZmienia}</Text>
              </View>
            ))}
          </Sekcja>
        ) : null}

        {raport.jak_dzialam ? (
          <Sekcja id="jak_dzialam">
            <Punkty pozycje={raport.jak_dzialam.osie.filter((o) => o.wyrazista).map((o) => o.opis)} />
          </Sekcja>
        ) : null}

        {raport.srodowisko ? (
          <Sekcja id="srodowisko">
            <Punkty pozycje={raport.srodowisko.warunki} />
          </Sekcja>
        ) : null}

        {/* Z sekcji o kompetencjach do PDF wchodza wylacznie mocne strony. */}
        {raport.w_czym_dobry ? (
          <Sekcja id="w_czym_dobry">
            <Text style={s.akapit}>{raport.w_czym_dobry.zdanie}</Text>
            {raport.w_czym_dobry.mocne.map((p) => (
              <View key={p.tytul} style={s.karta}>
                <Text style={s.pozycja}>{p.tytul}</Text>
                <Text style={s.drobne}>{p.opis}</Text>
              </View>
            ))}
          </Sekcja>
        ) : null}

        {raport.wartosci ? (
          <Sekcja id="wartosci">
            <Punkty pozycje={raport.wartosci.gora.map((w) => `${w.tytul}: ${w.opis ?? ""}`)} />
            {raport.wartosci.progowe.length > 0 ? (
              <>
                <Text style={s.etykieta}>BEZ TEGO NIE WYOBRAŻASZ SOBIE PRACY</Text>
                <Punkty pozycje={raport.wartosci.progowe} />
              </>
            ) : null}
          </Sekcja>
        ) : null}

        {raport.ksztalt_zycia ? (
          <Sekcja id="ksztalt_zycia">
            <Punkty pozycje={raport.ksztalt_zycia.parametry.map((p) => p.opis)} />
          </Sekcja>
        ) : null}

        {raport.wizja_zycia && raport.wizja_zycia.obszary.length > 0 ? (
          <Sekcja id="wizja_zycia">
            {raport.wizja_zycia.obszary.map((o) => (
              <View key={o.tytul}>
                <Text style={s.etykieta}>{o.tytul.toUpperCase()}</Text>
                <Akapity teksty={o.tresc} />
              </View>
            ))}
          </Sekcja>
        ) : null}

        {raport.czego_nie_chce ? (
          <Sekcja id="czego_nie_chce">
            <Akapity teksty={raport.czego_nie_chce.zdania} />
            {raport.czego_nie_chce.weta.length > 0 ? (
              <>
                <Text style={s.etykieta}>GRANICE NIE DO PRZEJŚCIA</Text>
                <Punkty pozycje={raport.czego_nie_chce.weta} />
              </>
            ) : null}
          </Sekcja>
        ) : null}

        {raport.obszary ? (
          <Sekcja id="obszary">
            {raport.obszary.pozycje.map((o) => (
              <View key={o.nazwa} style={s.karta}>
                <Text style={s.pozycja}>
                  {o.pasmoOpis ? `${o.nazwa}: ${o.pasmoOpis}` : o.nazwa}
                </Text>
                <Text style={s.drobne}>
                  Wejście: {o.przyklad} · {o.czas}
                </Text>
                <Punkty pozycje={o.dlaczego} />
              </View>
            ))}
          </Sekcja>
        ) : null}

        {raport.zawody ? (
          <Sekcja id="zawody">
            {raport.zawody.pozycje.map((p) => (
              <View key={p.kod} style={s.karta}>
                <Text style={s.pozycja}>
                  {p.pasmoOpis ? `${p.nazwa}: ${p.pasmoOpis}` : p.nazwa}
                </Text>
                {p.pytanieRozstrzygajace ? (
                  <Text style={s.drobne}>Pytanie rozstrzygające: {p.pytanieRozstrzygajace}</Text>
                ) : null}
                {/* Pusty `Text` wywraca cały dokument: renderer mierzy go
                    i wychodzi mu liczba, której nie umie zapisać
                    („unsupported number”). Przy profilu bez odpowiedzi żadna
                    z trzech części tej linii nie ma treści, więc składamy ją
                    najpierw, a rysujemy tylko wtedy, gdy coś w niej jest. */}
                {p.zawody.map((z) => {
                  const linia = [
                    p.typ === "klaster" ? `${z.nazwa}.` : null,
                    z.flagi.zdanieKierunkowe ? `${z.flagi.zdanieKierunkowe}.` : null,
                    oceny[z.kod] ? `Twoje oznaczenie: ${NAZWY_OCEN[oceny[z.kod]]}.` : null,
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return linia ? (
                    <Text key={z.kod} style={s.drobne}>
                      {linia}
                    </Text>
                  ) : null;
                })}
              </View>
            ))}
          </Sekcja>
        ) : null}

        {raport.kierunki ? (
          <Sekcja id="kierunki">
            <Text style={s.akapit}>{raport.kierunki.komunikat}</Text>
            <Text style={s.etykieta}>
              {raport.kierunki.drogiBezStudiowPierwsze ? "DROGI BEZ STUDIÓW" : "KIERUNKI"}
            </Text>
            <Punkty
              pozycje={
                raport.kierunki.drogiBezStudiowPierwsze
                  ? raport.kierunki.drogiBezStudiow.map((d) => `${d.nazwa}: ${d.czas}, ${d.koszt}`)
                  : raport.kierunki.kierunki.map((k) => `${k.nazwa}: ${k.rekrutacja}`)
              }
            />
            <Text style={s.etykieta}>
              {raport.kierunki.drogiBezStudiowPierwsze ? "KIERUNKI" : "DROGI BEZ STUDIÓW"}
            </Text>
            <Punkty
              pozycje={
                raport.kierunki.drogiBezStudiowPierwsze
                  ? raport.kierunki.kierunki.map((k) => `${k.nazwa}: ${k.rekrutacja}`)
                  : raport.kierunki.drogiBezStudiow.map((d) => `${d.nazwa}: ${d.czas}, ${d.koszt}`)
              }
            />
            <Text style={s.akapit}>{raport.kierunki.kierunekToNieZawod}</Text>
          </Sekcja>
        ) : null}

        {raport.trzy_drogi ? (
          <Sekcja id="trzy_drogi">
            {raport.trzy_drogi.drogi.map((d) => (
              <View key={d.etykieta} style={s.karta}>
                <Text style={s.pozycja}>
                  {d.tenSamObszar
                    ? "Ta sama dziedzina, inne wejście"
                    : d.etykieta === "A"
                      ? "Tu pasujesz najmocniej"
                      : d.etykieta === "B"
                        ? "Tu też pasujesz, ale to inna praca"
                        : "Coś zupełnie innego"}
                </Text>
                <Text style={s.akapit}>{d.obszar}</Text>
                <Text style={s.drobne}>
                  {d.przyklad} · {d.czas}
                </Text>
                {d.zawody.length > 0 ? (
                  <Text style={s.drobne}>Zawody: {d.zawody.map((z) => z.nazwa).join(", ")}</Text>
                ) : null}
                {d.kierunki.length > 0 ? (
                  <Text style={s.drobne}>Kierunki: {d.kierunki.join(", ")}</Text>
                ) : null}
                {d.umiejetnosci.length > 0 ? (
                  <Text style={s.drobne}>Do nauczenia się: {d.umiejetnosci.join(", ")}</Text>
                ) : null}
                {d.etykieta === "C" ? (
                  <Text style={s.drobne}>
                    Jest tutaj celowo. Jeśli za dwa lata okaże się, że A i B były pomyłką, to jest
                    miejsce, od którego zaczniesz szukać ponownie.
                  </Text>
                ) : null}
              </View>
            ))}
            <Text style={s.drobne}>
              Pierwszy krok, przy każdej z tych dróg: {raport.trzy_drogi.pierwszyKrok}
            </Text>
            <Akapity teksty={raport.trzy_drogi.flagi} />
          </Sekcja>
        ) : null}

        {raport.moja_decyzja?.tresc ? (
          <Sekcja id="moja_decyzja">
            <Text style={s.akapit}>{raport.moja_decyzja.tresc}</Text>
          </Sekcja>
        ) : null}

        {raport.pierwsze_kroki && raport.pierwsze_kroki.kroki.length > 0 ? (
          <Sekcja id="pierwsze_kroki">
            <Punkty pozycje={raport.pierwsze_kroki.kroki} />
          </Sekcja>
        ) : null}

        {stopka}
      </Page>
    </Document>
  );
}

export async function zbudujPdf(dane: DanePdf): Promise<Buffer> {
  await wczytajFonty();
  return renderToBuffer(<Dokument {...dane} />);
}

/* ================================================================== */
/* PDF NOWEGO PROGRAMU                                                 */
/* ================================================================== */

/**
 * Cztery sekcje zamiast dwudziestu dwoch, w tej samej typografii.
 *
 * Reguly PDF sa te same co w starej wersji i najwazniejsza z nich obowiazuje
 * tu tak samo: **sekcje zamkniete sa pomijane, nie wygaszane**. Uczestnik,
 * ktory pobiera plik przed odsloniecem zawodow, dostaje dokument bez sekcji
 * czwartej, a nie dokument z pusta ramka i obietnica.
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
