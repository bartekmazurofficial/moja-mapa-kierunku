import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/klient";

/**
 * Zapis odpowiedzi na biezaco. Bez przycisku "zapisz".
 *
 * Uczestnik uwierzytelnia sie kodem dostepu, ktory jest losowy i pelni
 * jednoczesnie role identyfikatora. Nie ma sciezki, ktora pozwalalaby
 * wyliczyc liste uczestnikow przez podmiane identyfikatora w adresie.
 */

interface Zadanie {
  kod: string;
  modul: string;
  czesc: string;
  pozycja: string;
  wartosc: unknown;
  msSpent?: number;
  rozpoczeta?: string;
}

export async function POST(request: Request) {
  let dane: Zadanie;
  try {
    dane = (await request.json()) as Zadanie;
  } catch {
    return NextResponse.json({ blad: "nieczytelne żądanie" }, { status: 400 });
  }

  if (!dane.kod || !dane.modul || !dane.czesc || !dane.pozycja) {
    return NextResponse.json({ blad: "brak wymaganych pól" }, { status: 400 });
  }

  const uczestnik = await prisma.uczestnik.findUnique({
    where: { kodDostepu: dane.kod },
    select: { id: true },
  });
  if (!uczestnik) {
    return NextResponse.json({ blad: "nieznany kod dostępu" }, { status: 404 });
  }

  const teraz = new Date();
  const wartosc = JSON.stringify(dane.wartosc ?? null);
  const rozpoczeta = dane.rozpoczeta ? new Date(dane.rozpoczeta) : null;

  await prisma.odpowiedz.upsert({
    where: {
      uczestnikId_modul_czesc_pozycja: {
        uczestnikId: uczestnik.id,
        modul: dane.modul,
        czesc: dane.czesc,
        pozycja: dane.pozycja,
      },
    },
    create: {
      uczestnikId: uczestnik.id,
      modul: dane.modul,
      czesc: dane.czesc,
      pozycja: dane.pozycja,
      wartosc,
      msSpent: dane.msSpent ?? null,
      rozpoczeta,
      zakonczona: teraz,
    },
    update: {
      wartosc,
      msSpent: dane.msSpent ?? undefined,
      zakonczona: teraz,
      rewizje: { increment: 1 },
    },
  });

  await prisma.postepModulu.upsert({
    where: { uczestnikId_kod: { uczestnikId: uczestnik.id, kod: dane.modul } },
    create: {
      uczestnikId: uczestnik.id,
      kod: dane.modul,
      rozpoczety: teraz,
      ostatniaPozycja: dane.pozycja,
    },
    update: { ostatniaPozycja: dane.pozycja },
  });

  return NextResponse.json({ ok: true });
}
