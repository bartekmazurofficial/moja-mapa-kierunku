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
import { PARY_M1 } from "../content/m1";
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

const M1_BIEGUNY: Record<Profil, Record<string, "A" | "B">> = {
  rzemieslniczy: { CEN: "B", GRA: "B", GOD: "A", TEMP: "B", MIE: "A", ORG: "B", KOR: "A", INW: "A", POZ: "B", LUD: "B", WID: "B", ROD: "A" },
  spoleczny: { CEN: "B", GRA: "B", GOD: "B", TEMP: "B", MIE: "A", ORG: "B", KOR: "A", INW: "B", POZ: "B", LUD: "B", WID: "B", ROD: "A" },
  analityczny: { CEN: "A", GRA: "A", GOD: "A", TEMP: "A", MIE: "B", ORG: "A", KOR: "B", INW: "B", POZ: "A", LUD: "B", WID: "B", ROD: "B" },
  plaski: {},
};

const A0: Record<Profil, Record<string, unknown>> = {
  rzemieslniczy: {
    etap: "liceum_1_2",
    przedmioty_mocne: ["zawodowe", "warsztat", "wf"],
    przedmioty_trudne: ["matematyka", "polski", "jezyki"],
    matematyka: "trudna",
    doswiadczenie: ["hobby", "firma_rodzinna"],
    doswiadczenie_opis: "Od trzech lat naprawiam motocykle z bratem w garażu.",
    miejsce: "wies",
    mobilnosc: "wolalbym_nie",
    dojazd: "godzina",
    zasoby: "bardzo_trudne",
    ograniczenia: ["brak"],
  },
  spoleczny: {
    etap: "liceum_maturalna",
    rozszerzenia: ["biologia", "polski"],
    przedmioty_mocne: ["biologia", "polski", "wos"],
    przedmioty_trudne: ["matematyka", "fizyka", "informatyka"],
    matematyka: "najwiekszy_problem",
    doswiadczenie: ["wolontariat", "prowadzenie"],
    doswiadczenie_opis: "Wolontariat w hospicjum, prowadzę grupę w szkole.",
    miejsce: "srednie_miasto",
    mobilnosc: "tak_region",
    dojazd: "blisko",
    zasoby: "raty",
    ograniczenia: ["nie_chce"],
  },
  analityczny: {
    etap: "po_maturze",
    rozszerzenia: ["matematyka", "informatyka", "fizyka"],
    przedmioty_mocne: ["matematyka", "informatyka", "fizyka"],
    przedmioty_trudne: ["wf", "artystyczne", "historia"],
    matematyka: "dobrze",
    doswiadczenie: ["projekty", "konkursy", "kursy"],
    doswiadczenie_opis: "Olimpiada informatyczna, własne projekty na githubie.",
    miejsce: "duze_miasto",
    mobilnosc: "tak_daleko",
    dojazd: "blisko",
    zasoby: "realne",
    ograniczenia: ["brak"],
  },
  plaski: {
    etap: "liceum_1_2",
    przedmioty_mocne: ["polski", "historia", "wf"],
    przedmioty_trudne: ["matematyka", "fizyka", "chemia"],
    matematyka: "radze_sobie",
    doswiadczenie: ["brak"],
    doswiadczenie_opis: null,
    miejsce: "male_miasto",
    mobilnosc: "tak_region",
    dojazd: "godzina",
    zasoby: "raty",
    ograniczenia: ["brak"],
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
  for (const [i, para] of PARY_M1.entries()) {
    // Profil plaski nie ma zadeklarowanych biegunow: odpowiedzi na przemian,
    // zeby wizja zycia tez wyszla nieostra, a nie sztucznie zdecydowana.
    const domyslny = profil === "plaski" ? (i % 2 === 0 ? "A" : "B") : "A";
    await zapisz(id, "M1", "A", para.id, M1_BIEGUNY[profil][para.wymiar] ?? domyslny, czas() / 4);
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

  return prisma.odpowiedz.count({ where: { uczestnikId: id } });
}
