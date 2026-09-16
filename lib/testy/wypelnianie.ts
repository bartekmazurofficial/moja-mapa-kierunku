/**
 * Wypelnianie modulow prawdopodobnymi odpowiedziami.
 *
 * Nie zastepuje pilotazu: sluzy do sprawdzenia, czy odpowiedzi trafiaja do bazy
 * w formacie, ktory przyjmuje silnik, do ogladania aplikacji w trakcie budowy
 * i do zasiewania danych w testach, zeby nie zalezaly od recznie wpisanego
 * stanu bazy. Profil steruje tym, ktore pozycje sa wybierane wyzej.
 */

import { prisma } from "../db/klient";
import { zbudujPlan } from "../moduly/plan";
import { BLOKI_A1 } from "../content/a1";
import { BLOKI_A2 } from "../content/a2";
import { PARY_A3 } from "../content/a3";
import { PARY_A4 } from "../content/a4";
import { PARY_MIEKKIE_M1, PYTANIA_WPROST_M1 } from "../content/m1";
import { INWESTYCJA_A6, PARY_A6 } from "../content/a6";
import { FILTRY_A5 } from "../domain/slowniki";
import { OBSZARY_M1 } from "../content/m1";
import { OBSZARY_A1, KOMPETENCJE_A2 } from "../domain/slowniki";
import { MARKER_ZAKONCZENIA, type KodModulu } from "../moduly/typy";

type Profil = "rzemieslniczy" | "spoleczny" | "analityczny" | "plaski";

/** Obszary zainteresowan i kompetencje preferowane przez dany profil. */
const PREFERENCJE: Record<Profil, { a1: number[]; a2: number[]; a3A: string[] }> = {
  rzemieslniczy: { a1: [1, 2, 22, 4], a2: [26, 27, 1, 22], a3A: ["SAM", "OTO", "GLE", "NAP"] },
  spoleczny: { a1: [13, 14, 15, 16], a2: [17, 16, 12, 19], a3A: ["STR", "RYT", "KON"] },
  analityczny: { a1: [8, 5, 6, 22], a2: [2, 4, 1, 6], a3A: ["GLE", "OTO", "SAM", "DEC"] },
  // Profil plaski: brak preferencji w ogole. Sluzy do sprawdzenia, jak wyglada
  // raport osoby, u ktorej zaden obszar nie odstaje - najtrudniejszy przypadek
  // dla reguly „nigdy nie mow, ze nic nie pasuje".
  plaski: { a1: [], a2: [], a3A: [] },
};

const A5_ODPOWIEDZI: Record<Profil, Record<string, "tak" | "moze" | "nie">> = {
  rzemieslniczy: { F01: "nie", F02: "nie", F16: "tak", F17: "tak", F18: "tak", F19: "nie", F20: "tak", F26: "nie", F29: "tak" },
  spoleczny: { F01: "moze", F02: "tak", F21: "nie", F22: "tak", F23: "tak", F24: "tak", F12: "moze", F16: "moze", F28: "nie" },
  analityczny: { F01: "tak", F02: "tak", F04: "tak", F19: "tak", F16: "nie", F17: "nie", F11: "nie", F12: "nie", F27: "tak" },
  plaski: { F01: "moze", F02: "moze", F04: "moze", F16: "moze", F19: "moze", F22: "moze" },
};

const WETA: Record<Profil, string[]> = {
  rzemieslniczy: ["F26"],
  spoleczny: ["F21"],
  analityczny: [],
  plaski: [],
};

const A4_TOP: Record<Profil, string[]> = {
  rzemieslniczy: ["WOL", "MIS", "STA", "PIE", "CZA"],
  spoleczny: ["SEN", "REL", "ZAS", "CZA", "STA"],
  analityczny: ["ROZ", "MIS", "PIE", "WOL", "STA"],
  plaski: [],
};

/**
 * A6: jak sie ucze. Rzemieslnik uczy sie robiac i nie chce dlugiej szkoly,
 * analityk odwrotnie. Profil plaski zostawia wszystko na „nie wiem", zeby
 * test mial przypadek, w ktorym werdykt nie powstaje.
 */
const A6_BIEGUNY: Record<Profil, Record<string, "A" | "B">> = {
  rzemieslniczy: { TEO: "B", EGZ: "B", PRO: "A", CZY: "B", JED: "A" },
  spoleczny: { TEO: "A", EGZ: "B", PRO: "B", CZY: "A", JED: "B" },
  analityczny: { TEO: "A", EGZ: "A", PRO: "A", CZY: "A", JED: "A" },
  plaski: {},
};

const A6_INWESTYCJA: Record<Profil, Record<string, string>> = {
  rzemieslniczy: { lata: "do_dwoch", wieczorami: "tak", przeprowadzka_nauka: "region" },
  spoleczny: { lata: "trzy_cztery", wieczorami: "zalezy", przeprowadzka_nauka: "tak" },
  analityczny: { lata: "piec_wiecej", wieczorami: "tak", przeprowadzka_nauka: "tak" },
  plaski: { lata: "nie_wiem", wieczorami: "nie_wiem", przeprowadzka_nauka: "nie_wiem" },
};

/**
 * Trzy wymiary twarde: odpowiedzi wprost. Profil plaski odpowiada „nie wiem"
 * na wszystkie trzy, zeby fikstura miala przypadek, w ktorym te wymiary nie
 * przycinaja niczego.
 */
const M1_WPROST: Record<Profil, Record<string, string>> = {
  rzemieslniczy: { GOD: "osiem", MIE: "na_miejscu", KOR: "osiasc" },
  spoleczny: { GOD: "osiem", MIE: "na_miejscu", KOR: "region" },
  analityczny: { GOD: "duzo", MIE: "mieszanie", KOR: "gdziekolwiek" },
  plaski: { GOD: "nie_wiem", MIE: "nie_wiem", KOR: "nie_wiem" },
};

const M1_BIEGUNY: Record<Profil, Record<string, "A" | "B">> = {
  rzemieslniczy: { CEN: "B", GRA: "B", GOD: "A", TEMP: "B", MIE: "A", ORG: "B", KOR: "A", INW: "A", POZ: "B", LUD: "B", WID: "B", ROD: "A" },
  spoleczny: { CEN: "B", GRA: "B", GOD: "B", TEMP: "B", MIE: "A", ORG: "B", KOR: "A", INW: "B", POZ: "B", LUD: "B", WID: "B", ROD: "A" },
  analityczny: { CEN: "A", GRA: "A", GOD: "A", TEMP: "A", MIE: "B", ORG: "A", KOR: "B", INW: "B", POZ: "A", LUD: "B", WID: "B", ROD: "B" },
  plaski: {},
};

const A0: Record<Profil, Record<string, unknown>> = {
  rzemieslniczy: {
    etap: "liceum_1_2",
    przedmioty_mocne: ["wf", "geografia", "biologia"],
    przedmioty_trudne: ["matematyka", "polski", "jezyki"],
    doswiadczenie: ["hobby", "firma_rodzinna"],
    doswiadczenie_opis: "Od trzech lat naprawiam motocykle z bratem w garażu.",
    miejsce: "wies",
    mobilnosc: "wolalbym_nie",
    dojazd: "godzina",
    zasoby: "bardzo_trudne",
    ograniczenia: [],
  },
  spoleczny: {
    etap: "liceum_maturalna",
    rozszerzenia: ["biologia", "polski"],
    przedmioty_mocne: ["biologia", "polski", "wos"],
    przedmioty_trudne: ["matematyka", "fizyka", "informatyka"],
    doswiadczenie: ["wolontariat", "prowadzenie"],
    doswiadczenie_opis: "Wolontariat w hospicjum, prowadzę grupę w szkole.",
    miejsce: "srednie_miasto",
    mobilnosc: "tak_region",
    dojazd: "blisko",
    zasoby: "raty",
    ograniczenia: [],
  },
  analityczny: {
    etap: "po_maturze",
    rozszerzenia: ["matematyka", "informatyka", "fizyka"],
    przedmioty_mocne: ["matematyka", "informatyka", "fizyka"],
    przedmioty_trudne: ["wf", "artystyczne", "historia"],
    doswiadczenie: ["projekty", "konkursy", "kursy"],
    doswiadczenie_opis: "Olimpiada informatyczna, własne projekty na githubie.",
    miejsce: "duze_miasto",
    mobilnosc: "tak_daleko",
    dojazd: "blisko",
    zasoby: "realne",
    ograniczenia: [],
  },
  plaski: {
    etap: "liceum_1_2",
    przedmioty_mocne: ["polski", "historia", "wf"],
    przedmioty_trudne: ["matematyka", "fizyka", "chemia"],
    doswiadczenie: ["brak"],
    doswiadczenie_opis: null,
    miejsce: "male_miasto",
    mobilnosc: "tak_region",
    dojazd: "godzina",
    zasoby: "raty",
    ograniczenia: [],
  },
};

/** Utrwala plan modulu tak samo jak zrobilaby to strona modulu. */
async function utrwalPlan(uczestnikId: string, modul: KodModulu) {
  const istnieje = await prisma.postepModulu.findUnique({
    where: { uczestnikId_kod: { uczestnikId, kod: modul } },
  });
  if (istnieje?.kolejnosc) return;
  await prisma.postepModulu.upsert({
    where: { uczestnikId_kod: { uczestnikId, kod: modul } },
    create: { uczestnikId, kod: modul, rozpoczety: new Date(), kolejnosc: JSON.stringify(zbudujPlan(modul)) },
    update: { kolejnosc: JSON.stringify(zbudujPlan(modul)) },
  });
}

async function zapisz(
  uczestnikId: string,
  modul: string,
  czesc: string,
  pozycja: string,
  wartosc: unknown,
  msSpent: number,
) {
  await prisma.odpowiedz.upsert({
    where: { uczestnikId_modul_czesc_pozycja: { uczestnikId, modul, czesc, pozycja } },
    create: { uczestnikId, modul, czesc, pozycja, wartosc: JSON.stringify(wartosc), msSpent },
    update: { wartosc: JSON.stringify(wartosc), msSpent },
  });
}

export type ProfilTestowy = Profil;

/**
 * Wypelnia siedem modulow uczestnika prawdopodobnymi odpowiedziami.
 * Zwraca liczbe zapisanych pozycji.
 */
export async function wypelnijUczestnika(
  id: string,
  profil: Profil = "rzemieslniczy",
): Promise<number> {
  if (!PREFERENCJE[profil]) throw new Error(`nieznany profil: ${profil}`);
  const pref = PREFERENCJE[profil];
  const czas = () => 4000 + Math.floor(Math.random() * 9000);

  // --- A0 ---
  for (const [pozycja, wartosc] of Object.entries(A0[profil])) {
    await zapisz(id, "A0", "A", pozycja, wartosc, czas());
  }
  await zapisz(id, "A0", "A", MARKER_ZAKONCZENIA, true, 0);

  // --- A1 ---
  await utrwalPlan(id, "A1");
  // Profil plaski wymaga wyrownanych sum rang. Losowanie ich nie daje: szum na
  // szesciu blokach potrafi rozciagnac wyniki o czterdziesci punktow, a wtedy
  // przypadek, ktory chcemy zobaczyc, w ogole nie powstaje.
  const sumyA1 = new Map<number, number>();
  for (const blok of BLOKI_A1) {
    const oceny = blok.pozycje.map((p) => ({
      id: p.id,
      obszar: p.obszar,
      waga: pref.a1.includes(p.obszar) ? 10 - pref.a1.indexOf(p.obszar) : Math.random(),
    }));
    if (profil === "plaski") {
      // Najwyzsza ranga dla obszaru, ktory ma dotad najnizsza sume.
      oceny.sort((a, b) => (sumyA1.get(a.obszar) ?? 0) - (sumyA1.get(b.obszar) ?? 0));
      oceny.forEach((o, i) => sumyA1.set(o.obszar, (sumyA1.get(o.obszar) ?? 0) + (4 - i)));
    } else {
      oceny.sort((a, b) => b.waga - a.waga);
    }
    await zapisz(
      id, "A1", "A", `blok_${blok.index}`,
      Object.fromEntries(oceny.map((o, i) => [o.id, i + 1])), czas(),
    );
  }
  await zapisz(id, "A1", "A", MARKER_ZAKONCZENIA, true, 0);
  for (const o of OBSZARY_A1) {
    const wysoki = pref.a1.includes(o.id);
    const skala = profil === "plaski" ? 3 : wysoki ? 5 : o.id % 3 === 0 ? 3 : 2;
    await zapisz(id, "A1", "B", `kotwica_${o.id}`, { skala, probowal: wysoki }, 3000);
  }
  await zapisz(id, "A1", "B", MARKER_ZAKONCZENIA, true, 0);

  // --- A2 ---
  await utrwalPlan(id, "A2");
  const sumyA2 = new Map<number, number>();
  for (const blok of BLOKI_A2) {
    const oceny = blok.pozycje.map((p) => ({
      id: p.id,
      kompetencja: p.kompetencja,
      waga: pref.a2.includes(p.kompetencja) ? 10 - pref.a2.indexOf(p.kompetencja) : Math.random(),
    }));
    if (profil === "plaski") {
      oceny.sort((a, b) => (sumyA2.get(a.kompetencja) ?? 0) - (sumyA2.get(b.kompetencja) ?? 0));
      oceny.forEach((o, i) => sumyA2.set(o.kompetencja, (sumyA2.get(o.kompetencja) ?? 0) + (4 - i)));
    } else {
      oceny.sort((a, b) => b.waga - a.waga);
    }
    await zapisz(
      id, "A2", "A", `blok_${blok.index}`,
      Object.fromEntries(oceny.map((o, i) => [o.id, i + 1])), czas(),
    );
  }
  await zapisz(id, "A2", "A", MARKER_ZAKONCZENIA, true, 0);
  for (const k of KOMPETENCJE_A2) {
    const mocna = pref.a2.includes(k.id);
    await zapisz(id, "A2", "B", `dowody_${k.id}`, [mocna, mocna, mocna && k.id % 2 === 0], 2000);
  }
  await zapisz(id, "A2", "B", MARKER_ZAKONCZENIA, true, 0);

  // --- A3 ---
  await utrwalPlan(id, "A3");
  for (const para of PARY_A3) {
    await zapisz(id, "A3", "A", para.id, pref.a3A.includes(para.wymiar) ? "A" : "B", czas() / 3);
  }
  await zapisz(id, "A3", "A", MARKER_ZAKONCZENIA, true, 0);
  for (const wymiar of [...new Set(PARY_A3.map((p) => p.wymiar))]) {
    await zapisz(id, "A3", "B", `kotwica_${wymiar}`, pref.a3A.includes(wymiar) ? 5 : 2, 2000);
  }
  await zapisz(id, "A3", "B", MARKER_ZAKONCZENIA, true, 0);

  // --- A4 ---
  await utrwalPlan(id, "A4");
  const ranga = (kod: string) => {
    const i = A4_TOP[profil].indexOf(kod);
    return i === -1 ? 99 : i;
  };
  for (const para of PARY_A4) {
    await zapisz(id, "A4", "A", `para_${para.nr}`, ranga(para.lewa) <= ranga(para.prawa) ? para.lewa : para.prawa, czas() / 4);
  }
  await zapisz(id, "A4", "A", MARKER_ZAKONCZENIA, true, 0);
  await zapisz(id, "A4", "B", "nieodzowne", [A4_TOP[profil][0]], 8000);
  await zapisz(id, "A4", "B", MARKER_ZAKONCZENIA, true, 0);
  for (let i = 1; i <= 4; i++) {
    await zapisz(id, "A4", "C", `koszt_${i}`, i <= 2 ? "tak" : "zalezy", 4000);
  }
  await zapisz(id, "A4", "C", MARKER_ZAKONCZENIA, true, 0);

  // --- A5 ---
  for (const f of FILTRY_A5) {
    await zapisz(id, "A5", "A", f.kod, A5_ODPOWIEDZI[profil][f.kod] ?? "moze", czas() / 4);
  }
  await zapisz(id, "A5", "A", MARKER_ZAKONCZENIA, true, 0);
  await zapisz(id, "A5", "B", "weta", WETA[profil], 12000);
  await zapisz(id, "A5", "B", MARKER_ZAKONCZENIA, true, 0);
  await zapisz(id, "A5", "C", "zdania", ["w której nie widać, po co to robię", "", ""], 20000);
  await zapisz(id, "A5", "C", MARKER_ZAKONCZENIA, true, 0);

  // --- M1 ---
  await utrwalPlan(id, "M1");
  for (const [i, para] of PARY_MIEKKIE_M1.entries()) {
    // Profil plaski nie ma zadeklarowanych biegunow: odpowiedzi na przemian,
    // zeby wizja zycia tez wyszla nieostra, a nie sztucznie zdecydowana.
    const domyslny = profil === "plaski" ? (i % 2 === 0 ? "A" : "B") : "A";
    await zapisz(id, "M1", "A", para.id, M1_BIEGUNY[profil][para.wymiar] ?? domyslny, czas() / 4);
  }
  // Trzy wymiary twarde: jedna odpowiedz wprost zamiast czterech par.
  for (const p of PYTANIA_WPROST_M1) {
    await zapisz(id, "M1", "A", `wprost_${p.wymiar}`, M1_WPROST[profil][p.wymiar], czas() / 8);
  }
  await zapisz(id, "M1", "A", MARKER_ZAKONCZENIA, true, 0);
  for (const obszar of OBSZARY_M1) {
    const wartosc =
      obszar.typ === "piec_zdan"
        ? ["pracy bez sensu", "życia w biegu", "", "", ""]
        : obszar.typ === "lista_i_tekst"
          ? "Rodzina i spokój. Reszta może poczekać."
          : "Chcę pracować blisko domu i wiedzieć wieczorem, co zrobiłem.";
    if (obszar.typ === "lista_i_tekst") {
      await zapisz(id, "M1", "B", `obszar_${obszar.nr}_lista`, ["rodzina", "bliscy przyjaciele", "spokój i cisza"], 15000);
    }
    await zapisz(id, "M1", "B", `obszar_${obszar.nr}`, wartosc, 60000);
  }
  await zapisz(id, "M1", "B", MARKER_ZAKONCZENIA, true, 0);

  // --- A6 ---
  await utrwalPlan(id, "A6");
  for (const [i, para] of PARY_A6.entries()) {
    const wybor = A6_BIEGUNY[profil][para.os];
    if (!wybor) continue;
    // Co czwarta odpowiedz idzie pod prad, zeby os nie wychodzila zawsze
    // piec na piec: profil bez ani jednego wahania nie istnieje.
    const domyslny = i % 4 === 3 ? (wybor === "A" ? "B" : "A") : wybor;
    await zapisz(id, "A6", "A", para.id, domyslny, czas() / 4);
  }
  await zapisz(id, "A6", "A", MARKER_ZAKONCZENIA, true, 0);
  for (const p of INWESTYCJA_A6) {
    await zapisz(id, "A6", "B", p.id, A6_INWESTYCJA[profil][p.id] ?? "nie_wiem", 8000);
  }
  await zapisz(id, "A6", "B", MARKER_ZAKONCZENIA, true, 0);

  return prisma.odpowiedz.count({ where: { uczestnikId: id } });
}

/* ================================================================== */
/* NOWY PROGRAM: CZTERY MODULY                                         */
/* ================================================================== */

/**
 * Ktore czynnosci i tematy wybiera dany profil w nowym programie.
 *
 * Numery odnosza sie do banku czynnosci i banku zainteresowan. Listy sa
 * celowo krotsze niz limity: uczestnik, ktory zaznacza maksimum na kazdym
 * etapie, nie odsiewa niczego, a lej ma pokazac wlasnie odsiewanie.
 *
 * Tor „umiem" rozni sie od toru „lubie" w kazdym profilu i to jest jedyna
 * rzecz, ktora te dane maja tu udowodnic: gdyby oba byly identyczne, trzy
 * listy z nalozenia wychodzilyby puste i nikt by nie zauwazyl bledu.
 */
const NOWY_PROGRAM: Record<
  Profil,
  { tematy: number[]; lubie: number[]; umiem: number[]; miasto: string; mieszkanie: string }
> = {
  rzemieslniczy: {
    tematy: [22, 27, 34, 42, 9, 18, 30, 44, 51, 13, 25, 37],
    lubie: [12, 13, 14, 15, 2, 3, 1, 21, 25, 31, 40, 44],
    umiem: [12, 14, 15, 13, 10, 21, 30, 41, 2, 45, 50, 55],
    miasto: "srednie",
    mieszkanie: "male",
  },
  spoleczny: {
    tematy: [1, 3, 4, 5, 6, 14, 20, 28, 33, 47, 52, 58],
    lubie: [31, 32, 33, 34, 35, 36, 41, 42, 25, 26, 5, 8],
    umiem: [31, 33, 35, 41, 26, 42, 8, 46, 51, 22, 36, 2],
    miasto: "duze",
    mieszkanie: "wynajem",
  },
  analityczny: {
    tematy: [16, 19, 23, 29, 35, 38, 41, 45, 49, 53, 57, 60],
    lubie: [1, 2, 3, 4, 5, 6, 7, 11, 21, 23, 43, 49],
    umiem: [1, 2, 4, 6, 7, 11, 23, 43, 52, 56, 3, 19],
    miasto: "warszawa",
    mieszkanie: "wynajem",
  },
  // Profil plaski: dwanascie pozycji rozrzuconych po calym banku, bez skupiska
  // w zadnej kategorii. Sluzy do sprawdzenia, jak wyglada wynik kogos, kto nie
  // ma wyraznego ciazenia w zadna strone.
  plaski: {
    tematy: [2, 8, 13, 18, 24, 29, 33, 39, 44, 50, 55, 59],
    lubie: [3, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59],
    umiem: [5, 10, 16, 21, 26, 31, 36, 41, 46, 51, 56, 60],
    miasto: "mala",
    mieszkanie: "pokoj",
  },
};

/**
 * Wypelnia cztery moduly nowego programu.
 *
 * Lej zweza sie w kazdym kroku: dwanascie pozycji, potem osiem, potem piec.
 * Taka sciezka daje sily rozlozone na wszystkie cztery poziomy, a nie same
 * setki, wiec ranking zawodow ma z czego rozrozniac.
 */
export async function wypelnijNowyProgram(
  id: string,
  profil: Profil = "rzemieslniczy",
): Promise<number> {
  const d = NOWY_PROGRAM[profil];
  if (!d) throw new Error(`nieznany profil: ${profil}`);
  const czas = () => 4000 + Math.floor(Math.random() * 9000);
  let ile = 0;

  const lej = async (modul: string, pozycje: number[]) => {
    const etap1 = pozycje.slice(0, 12);
    const etap2 = etap1.slice(0, 8);
    const etap3 = etap2.slice(0, 5);
    for (const [czesc, pole, wartosc] of [
      ["A", "etap1", etap1],
      ["B", "etap2", etap2],
      ["C", "etap3", etap3],
      ["D", "kolejnosc", etap3],
    ] as const) {
      await zapisz(id, modul, czesc, pole, wartosc, czas());
      await zapisz(id, modul, czesc, MARKER_ZAKONCZENIA, true, 0);
      ile += 1;
    }
  };

  await lej("Z", d.tematy);
  await lej("L", d.lubie);
  await lej("U", d.umiem);

  for (const [pozycja, wartosc] of Object.entries({
    z_kim: "sam",
    dzieci: "0",
    miasto: d.miasto,
    mieszkanie_forma: d.mieszkanie,
    zwierze: "brak",
  })) {
    await zapisz(id, "F", "A", pozycja, wartosc, czas());
    ile += 1;
  }
  await zapisz(id, "F", "A", MARKER_ZAKONCZENIA, true, 0);
  await zapisz(
    id,
    "F",
    "B",
    "panel",
    { decyzje: { mieszkanie: d.mieszkanie === "pokoj" ? "pokoj" : "dobre" }, opcjonalne: {} },
    czas(),
  );
  await zapisz(id, "F", "B", MARKER_ZAKONCZENIA, true, 0);
  ile += 1;

  return ile;
}
