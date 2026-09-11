/**
 * Budowanie zawartosci raportu.
 *
 * Zasady, ktore ten plik musi utrzymac:
 *   - zadna liczba dopasowania nie trafia na ekran uczestnika, tylko pasmo,
 *   - nigdzie nie ma porownania z grupa,
 *   - przy profilu plaskim nie pada komunikat, ze nic nie pasuje,
 *   - niskie kompetencje pojawiaja sie wylacznie jako lista do nauczenia sie,
 *   - lista zawodow usunietych przez weto nie trafia do uczestnika,
 *   - lista drog bez studiow jest w kazdym raporcie.
 */

import { PASMA_OBSZAROW, PASMA_ZAWODOW } from "../engine/config";
import { komunikatFlagi } from "../engine/komunikaty";
import { KIERUNEK_TO_NIE_ZAWOD } from "../engine/layer3-fields";
import { sekcjaPunktStartu } from "../engine/layer0-start";
import { policzA1, policzA2, policzA3, policzA4, policzA5, policzM1, zlozWynikiModulow, type KompletOdpowiedzi } from "../engine/moduly";
import { uruchomSilnik } from "../engine";
import { KOMPETENCJE_A2, OBSZARY_A1, WARTOSCI_A4, WYMIARY_A3, WYMIARY_M1, FILTRY_A5 } from "../domain/slowniki";
import { PODPISY_A1, TEKSTY_A1 } from "../content/a1";
import { CWIARTKI, MACIERZ_WSPARCIA, RAMKI_A2 } from "../content/a2";
import { OBSZARY_M1 } from "../content/m1";
import { etykietaM1 } from "../moduly/ekrany";
import { stopkaRaportu } from "./sekcje";
import type { BazaReferencyjna } from "../domain/typy";
import type { Raport } from "./typy";

const A1_PO_ID = new Map(OBSZARY_A1.map((o) => [o.id, o]));
const A2_PO_ID = new Map(KOMPETENCJE_A2.map((k) => [k.id, k]));
const A4_PO_KODZIE = new Map(WARTOSCI_A4.map((w) => [w.kod, w]));
const A5_PO_KODZIE = new Map(FILTRY_A5.map((f) => [f.kod, f]));
const TEKST_A1 = new Map(TEKSTY_A1.map((t) => [t.id, t]));

function pasmoOpisObszaru(kod: string): string {
  return PASMA_OBSZAROW.find((p) => p.kod === kod)?.opis ?? "";
}
function pasmoOpisZawodu(kod: string): string {
  return PASMA_ZAWODOW.find((p) => p.kod === kod)?.opis ?? "";
}

export interface DaneRaportu {
  imie: string;
  odpowiedzi: KompletOdpowiedzi;
  baza: BazaReferencyjna;
  karty: Map<string, { pelna: boolean }>;
  /** Sekcje, ktore wolno zbudowac. Reszta nie powstaje w ogole. */
  dostepne: Set<string>;
  decyzja?: { tresc: string | null; kroki: string[]; notatka: string | null };
  /** Korekty wprowadzone przez prowadzacego podczas sesji indywidualnej. */
  korekty?: Array<{ typ: string; wartosc: string | null; uzasadnienie: string | null }>;
}

export function zbudujRaport(dane: DaneRaportu): Raport {
  const { odpowiedzi, baza } = dane;
  const wolno = (id: string) => dane.dostepne.has(id);

  const a1 = policzA1(odpowiedzi.a1);
  const a2 = policzA2(odpowiedzi.a2);
  const a3 = policzA3(odpowiedzi.a3);
  const a4 = policzA4(odpowiedzi.a4);
  const a5 = policzA5(odpowiedzi.a5);
  const m1 = policzM1(odpowiedzi.m1);
  const wyniki = zlozWynikiModulow(odpowiedzi);
  const silnik = uruchomSilnik(wyniki, baza);

  const teraz = new Date();
  const raport: Raport = {
    imie: dane.imie,
    dataWygenerowania: teraz.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" }),
    stopka: stopkaRaportu(teraz),
    pewnosc: a1.pewnosc,
  };

  const posortowaneA1 = [...OBSZARY_A1].sort((x, y) => a1.z[y.id] - a1.z[x.id] || x.id - y.id);

  // --- TWOJ PUNKT STARTU ---
  if (wolno("punkt_startu") && odpowiedzi.a0) {
    // Nazwy obszarow trafiaja do punktu startu dopiero wtedy, gdy sekcja
    // obszarow jest odslonieta. Inaczej sekcja z warstwy pierwszej
    // wyprzedzalaby wynik silnika i lamala kolejnosc odslaniania.
    const najlepsze = wolno("obszary") ? silnik.warstwa1.obszary.slice(0, 3).map((o) => o.nazwa) : [];
    const s = sekcjaPunktStartu(odpowiedzi.a0, najlepsze);
    if (s) raport.punkt_startu = s;
  }

  // --- CO MNIE INTERESUJE ---
  if (wolno("co_mnie_interesuje")) {
    const gora = posortowaneA1.slice(0, 5).map((o) => {
      const t = TEKST_A1.get(o.id)!;
      return {
        tytul: o.etykieta,
        opis: t.opis,
        coZmienia: t.coZmienia,
        nieProbowal: a1.ekspozycja[o.id] === false,
      };
    });
    const dol = posortowaneA1.slice(-5).reverse().map((o) => ({
      tytul: o.etykieta,
      opis: TEKST_A1.get(o.id)!.naDole,
    }));
    const osieZdanie =
      `${a1.osie.rzeczyLudzie > 0 ? "Bardziej ciągnie Cię do rzeczy i zadań niż do ludzi" : "Bardziej ciągnie Cię do ludzi niż do rzeczy i zadań"}. ` +
      `${a1.osie.daneIdee > 0 ? "Wolisz porządek i konkret niż dociekanie i pomysły" : "Wolisz dociekanie i pomysły niż porządek i konkret"}.`;
    raport.co_mnie_interesuje = {
      zdanie: a1.pewnosc === "jeszcze_nieuksztaltowany"
        ? "Twoje zainteresowania nie są jeszcze wyraźnie ukształtowane, i to zupełnie normalne w Twoim wieku. Zamiast rankingu pokazujemy Ci ogólny kierunek i rzeczy, które warto wypróbować."
        : `Najbardziej ciągnie Cię do: ${gora[0].tytul.toLowerCase()} i ${gora[1].tytul.toLowerCase()}.`,
      gora: a1.pewnosc === "jeszcze_nieuksztaltowany" ? [] : gora,
      dol: a1.pewnosc === "jeszcze_nieuksztaltowany" ? [] : dol,
      osie: osieZdanie,
    };
  }

  // --- CZEGO JESZCZE NIE SPRAWDZILEM ---
  if (wolno("czego_nie_sprawdzilem")) {
    const pozycje = posortowaneA1
      .filter((o) => a1.z[o.id] >= 60 && a1.ekspozycja[o.id] === false)
      .slice(0, 5)
      .map((o) => o.etykieta);
    raport.czego_nie_sprawdzilem = { podpis: PODPISY_A1.doSprawdzenia, pozycje };
  }

  // --- JAK NATURALNIE DZIALAM ---
  if (wolno("jak_dzialam")) {
    const osie = WYMIARY_A3.map((w) => {
      const poz = a3.pozycje[w.kod] ?? 50;
      const wyrazista = a3.wyrazistosc[w.kod] >= 40;
      return {
        kod: w.kod,
        biegunA: w.biegunA,
        biegunB: w.biegunB,
        polozenie: poz,
        wyrazista,
        opis: wyrazista ? (poz > 50 ? w.warunekA : w.warunekB) : "w tej sprawie jesteś elastyczny",
      };
    }).sort((x, y) => Math.abs(y.polozenie - 50) - Math.abs(x.polozenie - 50));
    raport.jak_dzialam = {
      osie,
      zdanie: "To nie są typy ani etykiety. To dwanaście osi, na których każdy gdzieś stoi, i żaden biegun nie jest lepszy.",
    };
  }

  // --- SRODOWISKO ---
  if (wolno("srodowisko")) {
    const kluczowe = a3.warunkiKluczowe.map((w) => w.warunek);
    raport.srodowisko = {
      warunki: kluczowe.length > 0 ? kluczowe : a3.preferencje.slice(0, 3).map((w) => w.warunek),
      komunikatGdyPusto:
        kluczowe.length === 0
          ? "Na tym etapie jesteś elastyczny środowiskowo i to jest przewaga, nie brak."
          : null,
    };
  }

  // --- W CZYM MOGE BYC DOBRY ---
  if (wolno("w_czym_dobry")) {
    const posortowane = [...KOMPETENCJE_A2].sort((x, y) => a2.k[y.id] - a2.k[x.id] || x.id - y.id);
    raport.w_czym_dobry = {
      zdanie: `Najlepiej szłoby Ci: ${posortowane[0].nazwa.toLowerCase()} i ${posortowane[1].nazwa.toLowerCase()}.`,
      mocne: posortowane.slice(0, 5).map((k) => ({
        tytul: k.nazwa,
        opis: k.opis,
        dopisek: a2.dowody[k.id] >= 2 ? RAMKI_A2.zDowodami : a2.dowody[k.id] === 0 ? RAMKI_A2.bezDowodow : undefined,
        dowody: a2.dowody[k.id],
      })),
      slabsze: posortowane.slice(-5).reverse().map((k) => ({ tytul: k.nazwa })),
      ramka: RAMKI_A2.najslabsze,
    };
  }

  // --- CO LUBIE, A W CZYM MOGE BYC DOBRY ---
  if (wolno("lubie_a_wychodzi")) {
    const wsparcie = (obszar: number): number => {
      const wagi = MACIERZ_WSPARCIA[String(obszar)] ?? {};
      return Object.entries(wagi).reduce((s, [id, waga]) => s + waga * (a2.k[Number(id)] ?? 50), 0);
    };
    const cwiartka = (o: (typeof OBSZARY_A1)[number]) => {
      const z = a1.z[o.id];
      const w = wsparcie(o.id);
      if (z >= 60 && w >= 60) return "mocna_droga";
      if (z < 45 && w >= 60) return "ukryty_atut";
      if (z >= 60 && w < 45) return "do_zbudowania";
      return "raczej_nie";
    };
    const wybierz = (kod: string) =>
      OBSZARY_A1.filter((o) => cwiartka(o) === kod)
        .sort((x, y) => wsparcie(y.id) - wsparcie(x.id))
        .map((o) => ({ tytul: o.etykieta }));
    raport.lubie_a_wychodzi = {
      mocneDrogi: wybierz("mocna_droga"),
      ukryteAtuty: wybierz("ukryty_atut").slice(0, 3),
      doZbudowania: wybierz("do_zbudowania"),
      komunikaty: Object.fromEntries(CWIARTKI.map((c) => [c.kod, c.komunikat])),
    };
  }

  // --- CZEGO POTRZEBUJE OD PRACY ---
  if (wolno("wartosci")) {
    const opisKosztu =
      a4.koszt >= 3
        ? "Ta wartość jest u Ciebie mocno zakorzeniona. Jesteś gotów za nią zapłacić."
        : a4.koszt >= 1
          ? "Ta wartość jest ważna, ale ma swoją granicę."
          : "Deklarujesz ją jako najważniejszą, ale nie chcesz za nią nic oddać. Warto o tym porozmawiać.";
    raport.wartosci = {
      gora: a4.top5.map((kod) => ({
        tytul: A4_PO_KODZIE.get(kod)?.nazwa ?? kod,
        opis: A4_PO_KODZIE.get(kod)?.znaczenie,
        dopisek: a4.progowe.includes(kod) ? "bez tego nie wyobrażasz sobie pracy" : undefined,
      })),
      dol: a4.bottom3.map((kod) => ({ tytul: A4_PO_KODZIE.get(kod)?.nazwa ?? kod })),
      progowe: a4.progowe.map((kod) => A4_PO_KODZIE.get(kod)?.nazwa ?? kod),
      testKosztu: opisKosztu,
    };
  }

  // --- JAKIEGO ZYCIA CHCE ---
  if (wolno("ksztalt_zycia")) {
    raport.ksztalt_zycia = {
      parametry: WYMIARY_M1.map((w) => ({
        wymiar: w.kod,
        opis: etykietaM1(w.kod, m1.shape[w.kod]),
      })).filter((p) => p.opis.length > 0),
      zdanie:
        "To nie jest przepowiednia ani zobowiązanie. To punkt wyjścia do tego, co napisałeś obok. Możesz się z tym zgodzić albo napisać zupełnie co innego.",
    };
  }

  // --- MOJA WIZJA ZYCIA. Cytowana doslownie, bez skracania i bez interpretacji. ---
  if (wolno("wizja_zycia")) {
    const obszary = OBSZARY_M1.map((o) => {
      const wartosc = m1.czescB[o.nr];
      const tresc = Array.isArray(wartosc)
        ? (wartosc as string[]).filter((x) => typeof x === "string" && x.trim().length > 0)
        : typeof wartosc === "string" && wartosc.trim().length > 0
          ? [wartosc.trim()]
          : [];
      return { tytul: o.tytul, tresc };
    }).filter((o) => o.tresc.length > 0);
    raport.wizja_zycia = { obszary };
  }

  // --- CZEGO NIE CHCE. Bez komentarza. ---
  if (wolno("czego_nie_chce")) {
    const zM1 = Array.isArray(m1.czescB[6]) ? (m1.czescB[6] as string[]) : [];
    const zdania = [...zM1, ...a5.zdania].map((x) => (x ?? "").trim()).filter((x) => x.length > 0);
    raport.czego_nie_chce = {
      zdania,
      weta: a5.weta.map((kod) => A5_PO_KODZIE.get(kod)?.tekst ?? kod),
    };
  }

  // --- NA CO JESTEM GOTOW ---
  if (wolno("na_co_gotow")) {
    const wg = (odp: string) =>
      FILTRY_A5.filter((f) => odpowiedzi.a5.czescA[f.kod] === odp).map((f) => f.tekst);
    raport.na_co_gotow = {
      tak: wg("tak"),
      moze: wg("moze"),
      nie: wg("nie"),
      podpisMoze: "To nie jest brak zdania, tylko lista rzeczy jeszcze niesprawdzonych.",
    };
  }

  // --- MOJE NAJMOCNIEJSZE OBSZARY ---
  if (wolno("obszary")) {
    raport.obszary = {
      pozycje: silnik.warstwa1.obszary.slice(0, 5).map((o) => ({
        nazwa: o.nazwa,
        pasmo: o.pasmo,
        // Regula 3: nigdy nie mowimy, ze nic nie pasuje. Obszar, ktory u tego
        // uczestnika wyszedl najwyzej, nie moze byc podpisany „antydopasowanie"
        // tylko dlatego, ze caly profil siedzi nisko. Wtedy pasma nie ma wcale,
        // a wyjasnienie niesie komunikat o nieostrym profilu.
        pasmoOpis: o.pasmo === "antydopasowanie" ? "" : pasmoOpisObszaru(o.pasmo),
        poziom: o.poziomWejscia.etykieta,
        przyklad: o.poziomWejscia.przyklad,
        czas: o.poziomWejscia.czas,
        dlaczego: o.dlaczegoPasuje.slice(0, 4),
        przeszkadza: o.coPrzeszkadza.slice(0, 3),
      })),
      profilNieostry: silnik.warstwa1.profilNieostry,
      komunikatNieostry: silnik.warstwa1.profilNieostry
        ? komunikatFlagi("profil_nieostry")
        : silnik.warstwa1.flagi.includes("wszystkie_obszary_ponizej_progu")
          ? komunikatFlagi("wszystkie_obszary_ponizej_progu")
          : null,
    };
  }

  // --- KOREKTY PROWADZACEGO ---
  // Uczestnik ma wiedziec, co powiedzial mu algorytm, a co czlowiek, wiec
  // korekty nie mieszaja sie z wynikiem: usuniecia znikaja, dopiski stoja
  // osobno i podpisane.
  const korekty = dane.korekty ?? [];
  const usunieteRecznie = new Set(
    korekty.filter((k) => k.typ === "usuniety_zawod" && k.wartosc).map((k) => k.wartosc as string),
  );
  const kolejnoscDrog = korekty.filter((k) => k.typ === "kolejnosc_drog" && k.wartosc).at(-1)?.wartosc ?? null;

  // --- KONKRETNE ZAWODY ---
  if (wolno("zawody")) {
    const nazwaObszaru = new Map(baza.obszary.map((o) => [o.id, o.nazwa]));
    const nazwyWszystkich = new Map(baza.zawody.map((z) => [z.kod, z.nazwaWyswietlana]));
    raport.zawody = {
      wynikiWstepne: silnik.warstwa2.wynikiWstepne,
      odProwadzacego: korekty
        .filter((k) => k.typ === "dopisany_zawod" && k.wartosc)
        .map((k) => ({
          kod: k.wartosc as string,
          nazwa: nazwyWszystkich.get(k.wartosc as string) ?? (k.wartosc as string),
          uzasadnienie: k.uzasadnienie,
        })),
      pozycje: silnik.warstwa2.pozycje
        .map((p) => ({ ...p, zawody: p.zawody.filter((z) => !usunieteRecznie.has(z.kod)) }))
        .filter((p) => p.zawody.length > 0)
        .map((p) => ({
        typ: p.typ,
        kod: p.kod,
        nazwa: p.nazwa,
        pasmo: p.pasmo,
        pasmoOpis: pasmoOpisZawodu(p.pasmo),
        pytanieRozstrzygajace: p.pytanieRozstrzygajace,
        roznica: p.roznica,
        uwaga: p.uwaga,
        zawody: p.zawody.map((z) => ({
          kod: z.kod,
          nazwa: z.nazwa,
          pasmo: z.pasmo,
          pasmoOpis: pasmoOpisZawodu(z.pasmo),
          obszar: nazwaObszaru.get(z.obszar) ?? "",
          uzasadnienie: uzasadnienieZawodu(z, silnik, a1, a2),
          flagi: {
            trampolina: z.flagi.trampolina,
            zagrozony: z.flagi.zagrozony,
            barieraKosztowa: z.flagi.barieraKosztowa,
            zdanieKierunkowe: z.flagi.zdanieKierunkowe,
          },
          ostrzezenia: z.ostrzezenia.map((o) => o.zdanie),
          zGwarancji: z.zGwarancji,
          maPelnaKarte: dane.karty.get(z.kod)?.pelna ?? false,
        })),
      })),
    };
  }

  // --- KIERUNKI I DROGI BEZ STUDIOW ---
  if (wolno("kierunki")) {
    const w3 = silnik.warstwa3;
    raport.kierunki = {
      sensStudiow: w3.sensStudiow,
      komunikat: w3.komunikatOSensie,
      drogiBezStudiowPierwsze: w3.drogiBezStudiowPierwsze,
      kierunki: w3.kierunki.slice(0, 6).map((k) => ({
        kod: k.kod,
        nazwa: k.nazwa,
        pasmo: k.pasmo,
        prowadziDo: k.prowadziDo.slice(0, 4),
        rekrutacja:
          k.wymagane.length > 0
            ? `wymagane: ${k.wymagane.join(", ")}; trudność: ${k.trudnosc.replace("_", " ")}`
            : `bez przedmiotów obowiązkowych; trudność: ${k.trudnosc.replace("_", " ")}`,
        twojaSytuacja: k.sytuacjaRekrutacyjna,
        coSieRobi: k.coSieRobi,
        czegoNieDaje: k.czegoNieDaje,
        ostrzezenia: k.ostrzezenia,
      })),
      drogiBezStudiow: w3.drogiBezStudiow.slice(0, 8).map((d) => ({
        nazwa: d.nazwa,
        typ: d.typ,
        czas: d.czas,
        koszt: d.koszt,
        prowadziDo: d.prowadziDo.slice(0, 4),
        wymagania: d.wymagania,
      })),
      kierunekToNieZawod: KIERUNEK_TO_NIE_ZAWOD,
    };
  }

  // --- UMIEJETNOSCI DO ROZWOJU ---
  if (wolno("umiejetnosci")) {
    raport.umiejetnosci = {
      pozycje: silnik.warstwa1.umiejetnosciDoRozwoju.map((id) => ({
        tytul: A2_PO_ID.get(id)?.nazwa ?? String(id),
        opis: A2_PO_ID.get(id)?.opis,
      })),
    };
  }

  // --- TRZY DROGI ---
  if (wolno("trzy_drogi")) {
    const nazwyZawodow = new Map(baza.zawody.map((z) => [z.kod, z.nazwaWyswietlana]));
    // Kierunki drogi bierzemy z warstwy trzeciej, a nie z opisu obszaru:
    // opis obszaru bywa zdaniem ("nie sa potrzebne"), nie lista kierunkow.
    const kierunkiObszaru = (kodyZawodow: string[]): string[] => {
      const zbior = new Set(kodyZawodow);
      return silnik.warstwa3.kierunki
        .filter((k) => {
          const zrodlo = baza.kierunki.find((x) => x.kod === k.kod);
          return zrodlo ? zrodlo.bezposrednie.some((z) => zbior.has(z)) : false;
        })
        .slice(0, 3)
        .map((k) => k.nazwa);
    };
    // Umiejetnosci sa liczone dla kazdej drogi osobno: kompetencje wazne dla TEGO
    // obszaru, w ktorych uczestnik ma najnizej. Wspolna lista z warstwy pierwszej
    // dawalaby trzy razy to samo i nie mowilaby nic o roznicy miedzy drogami.
    const umiejetnosciDrogi = (idObszaru: number): string[] => {
      const obszar = baza.obszary.find((o) => o.id === idObszaru);
      if (!obszar) return [];
      return Object.entries(obszar.kompetencje)
        .filter(([, waga]) => waga >= 2)
        .map(([id]) => Number(id))
        .sort((x, y) => (a2.k[x] ?? 50) - (a2.k[y] ?? 50) || x - y)
        .slice(0, 2)
        .map((id) => A2_PO_ID.get(id)?.nazwa ?? String(id));
    };
    // Prowadzacy moze zmienic kolejnosc drog, jesli rozmowa to uzasadnia.
    const kolejnosc = kolejnoscDrog && /^[ABC]{1,3}$/.test(kolejnoscDrog) ? kolejnoscDrog : null;
    const drogiWKolejnosci = kolejnosc
      ? [...silnik.warstwa1.drogi].sort(
          (a, b) => kolejnosc.indexOf(a.etykieta) - kolejnosc.indexOf(b.etykieta),
        )
      : silnik.warstwa1.drogi;

    raport.trzy_drogi = {
      flagi: silnik.warstwa1.flagi.map((f) => komunikatFlagi(f)).filter((x): x is string => Boolean(x)),
      pierwszyKrok: silnik.zakonczenie?.pierwszyKrok ?? "Ustal to na rozmowie indywidualnej.",
      kolejnoscOdProwadzacego: kolejnosc !== null,
      drogi: drogiWKolejnosci.map((d) => ({
        etykieta: d.etykieta,
        obszar: d.nazwaObszaru,
        tenSamObszar:
          d.etykieta === "C" &&
          silnik.warstwa1.drogi.some((x) => x.etykieta !== "C" && x.obszar === d.obszar),
        poziom: d.poziom.etykieta,
        przyklad: d.poziom.przyklad,
        czas: d.poziom.czas,
        zawody: d.zawody.map((kod) => ({ kod, nazwa: nazwyZawodow.get(kod) ?? kod })),
        kierunki: kierunkiObszaru(d.zawody),
        umiejetnosci: umiejetnosciDrogi(d.obszar),
      })),
    };
  }

  // --- CZEGO RACZEJ UNIKAC ---
  if (wolno("czego_unikac")) {
    raport.czego_unikac = {
      pozycje: silnik.warstwa1.antydopasowania.map((a) => ({ nazwa: a.nazwa, komunikat: a.komunikat })),
    };
  }

  // --- PROFIL W JEDNYM EKRANIE ---
  if (wolno("profil_w_jednym_ekranie")) {
    raport.profil_w_jednym_ekranie = { zdania: profilWJednymEkranie(silnik, a1, a2, a4, dane.imie) };
  }

  // --- PO SESJI 1:1 ---
  if (wolno("moja_decyzja")) raport.moja_decyzja = { tresc: dane.decyzja?.tresc ?? null };
  if (wolno("pierwsze_kroki")) raport.pierwsze_kroki = { kroki: dane.decyzja?.kroki ?? [] };
  if (wolno("notatka")) raport.notatka = { tresc: dane.decyzja?.notatka ?? null };

  return raport;
}

/** Trzy zdania przy zawodzie: co Cie ciagnie, co masz, co moze przeszkadzac. */
/**
 * Silnik zwraca powody jako osobne frazy z przedrostkiem („ciagnie Cie: X").
 * Zlozone w jedno zdanie powtarzalyby przedrostek, wiec powody o tym samym
 * przedrostku laczymy w jedna liste.
 */
function scalPowody(powody: string[]): string {
  const grupy: Array<{ przedrostek: string; pozycje: string[] }> = [];
  for (const powod of powody) {
    const i = powod.indexOf(": ");
    const przedrostek = i === -1 ? "" : powod.slice(0, i);
    const tresc = i === -1 ? powod : powod.slice(i + 2);
    const ostatnia = grupy[grupy.length - 1];
    if (ostatnia && ostatnia.przedrostek === przedrostek) ostatnia.pozycje.push(tresc);
    else grupy.push({ przedrostek, pozycje: [tresc] });
  }
  const zdanie = grupy
    .map((g) => (g.przedrostek ? `${g.przedrostek}: ${g.pozycje.join(", ")}` : g.pozycje.join(", ")))
    .join("; ");
  return `${zdanie.charAt(0).toUpperCase()}${zdanie.slice(1)}.`;
}

function uzasadnienieZawodu(
  z: { pokrycie: { a1: number; a2: number; a3: number }; obszar: number; ostrzezenia: Array<{ zdanie: string }> },
  silnik: ReturnType<typeof uruchomSilnik>,
  a1: ReturnType<typeof policzA1>,
  a2: ReturnType<typeof policzA2>,
): string[] {
  const obszar = silnik.warstwa1.obszary.find((o) => o.id === z.obszar);
  const zdania: string[] = [];
  if (obszar && obszar.dlaczegoPasuje.length > 0) {
    zdania.push(scalPowody(obszar.dlaczegoPasuje.slice(0, 2)));
  }
  if (z.pokrycie.a2 >= 0.5) zdania.push("Kompetencje, na których ten zawód stoi, masz już mocne.");
  else zdania.push("Część kompetencji, na których ten zawód stoi, dopiero zbudujesz. To normalne w Twoim wieku.");
  if (obszar && obszar.coPrzeszkadza.length > 0) zdania.push(`Może przeszkadzać: ${obszar.coPrzeszkadza[0]}.`);
  return zdania;
}

/** Szesc do osmiu zdan skladajacych calosc. Jedyna sekcja, ktora uczestnik komus pokaze. */
function profilWJednymEkranie(
  silnik: ReturnType<typeof uruchomSilnik>,
  a1: ReturnType<typeof policzA1>,
  a2: ReturnType<typeof policzA2>,
  a4: ReturnType<typeof policzA4>,
  imie: string,
): string[] {
  const zdania: string[] = [];
  const najA1 = [...OBSZARY_A1].sort((x, y) => a1.z[y.id] - a1.z[x.id]).slice(0, 2);
  const najA2 = [...KOMPETENCJE_A2].sort((x, y) => a2.k[y.id] - a2.k[x.id]).slice(0, 2);

  zdania.push(
    `${imie}, najmocniej ciągnie Cię do dwóch rzeczy: ${najA1[0].etykieta.toLowerCase()} i ${najA1[1].etykieta.toLowerCase()}.`,
  );
  zdania.push(
    `Najlepiej szłoby Ci to, w czym liczy się ${najA2[0].nazwa.toLowerCase()} i ${najA2[1].nazwa.toLowerCase()}.`,
  );
  const progowa = a4.progowe[0] ?? a4.top5[0];
  if (progowa) {
    // Nazwa, nie "znaczenie": opisy wartosci sa pisane w pierwszej osobie
    // i w zdaniu skierowanym do uczestnika brzmialyby jak cudza wypowiedz.
    const w = WARTOSCI_A4.find((x) => x.kod === progowa);
    zdania.push(`Najważniejsze, czego potrzebujesz od pracy, to: ${w?.nazwa.toLowerCase()}.`);
  }
  const drogi = silnik.warstwa1.drogi;
  if (drogi.length >= 2) {
    zdania.push(
      `Twoje dwie najmocniejsze drogi to ${drogi[0].nazwaObszaru.toLowerCase()} i ${drogi[1].nazwaObszaru.toLowerCase()}.`,
    );
  }
  if (drogi.length === 3) {
    zdania.push(`Trzecia, celowo inna, to ${drogi[2].nazwaObszaru.toLowerCase()}.`);
  }
  const sens = silnik.warstwa3.sensStudiow;
  zdania.push(
    sens === "warunek"
      ? "W Twoim przypadku studia są warunkiem, bo większość Twoich dróg jest bez dyplomu zamknięta."
      : sens === "niepotrzebne"
        ? "Większość Twoich dróg nie wymaga studiów. To nie jest gorsza wiadomość, tylko inna."
        : "Studia otwierają część Twoich dróg, ale nie wszystkie. Masz realny wybór.",
  );
  zdania.push("To nie jest ocena ani wyrok. To uporządkowanie tego, co sam odpowiedziałeś.");
  return zdania;
}
