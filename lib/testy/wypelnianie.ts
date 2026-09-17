/**
 * Wypelnianie modulow prawdopodobnymi odpowiedziami.
 *
 * Nie zastepuje pilotazu: sluzy do sprawdzenia, czy odpowiedzi trafiaja do bazy
 * w formacie, ktory przyjmuje silnik, do ogladania aplikacji w trakcie budowy
 * i do zasiewania danych w testach, zeby nie zalezaly od recznie wpisanego
 * stanu bazy. Profil steruje tym, ktore pozycje sa wybierane wyzej.
 */

import { prisma } from "../db/klient";
import { MARKER_ZAKONCZENIA } from "../moduly/typy";

type Profil = "rzemieslniczy" | "spoleczny" | "analityczny" | "plaski";

export type ProfilTestowy = Profil;

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

/**
 * Ktore czynnosci i tematy wybiera dany profil.
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
 * Wypelnia cztery moduly uczestnika.
 *
 * Lej zweza sie w kazdym kroku: dwanascie pozycji, potem osiem, potem piec.
 * Taka sciezka daje sily rozlozone na wszystkie cztery poziomy, a nie same
 * setki, wiec ranking zawodow ma z czego rozrozniac.
 */
export async function wypelnijUczestnika(
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
