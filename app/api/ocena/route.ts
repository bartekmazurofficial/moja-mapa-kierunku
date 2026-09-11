import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/klient";
import { stanDostepu } from "@/lib/raport/dostep";

/**
 * Oznaczenie zawodu przez uczestnika oraz pytanie na sesje indywidualna.
 * Zapis mozliwy dopiero wtedy, gdy sekcja zawodow jest odsloniata.
 */
export async function POST(request: Request) {
  const dane = (await request.json().catch(() => null)) as
    | { kod: string; zawod?: string; ocena?: string; pytanie?: string }
    | null;
  if (!dane?.kod) return NextResponse.json({ blad: "brak kodu" }, { status: 400 });

  const uczestnik = await prisma.uczestnik.findUnique({
    where: { kodDostepu: dane.kod },
    select: { id: true, grupaId: true },
  });
  if (!uczestnik) return NextResponse.json({ blad: "nieznany kod" }, { status: 404 });

  const dostep = await stanDostepu(uczestnik.id, uczestnik.grupaId);
  if (!dostep.dostepne.has("zawody")) {
    return NextResponse.json({ blad: "sekcja jeszcze zamknięta" }, { status: 403 });
  }

  if (dane.zawod && dane.ocena) {
    if (!["interesuje", "moze", "nie_dla_mnie"].includes(dane.ocena)) {
      return NextResponse.json({ blad: "nieznana ocena" }, { status: 400 });
    }
    await prisma.ocenaZawodu.upsert({
      where: { uczestnikId_zawodKod: { uczestnikId: uczestnik.id, zawodKod: dane.zawod } },
      create: { uczestnikId: uczestnik.id, zawodKod: dane.zawod, ocena: dane.ocena },
      update: { ocena: dane.ocena },
    });
  }

  if (typeof dane.pytanie === "string") {
    await prisma.pytanieUczestnika.upsert({
      where: { uczestnikId: uczestnik.id },
      create: { uczestnikId: uczestnik.id, tresc: dane.pytanie },
      update: { tresc: dane.pytanie },
    });
  }

  return NextResponse.json({ ok: true });
}
