import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/klient";

/** Sprawdzenie kodu dostepu. Nie zwraca zadnych danych uczestnika. */
export async function GET(request: Request) {
  const kod = new URL(request.url).searchParams.get("kod") ?? "";
  if (kod.length < 6 || kod.length > 32) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const istnieje = await prisma.uczestnik.findUnique({
    where: { kodDostepu: kod },
    select: { id: true },
  });
  return istnieje
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ ok: false }, { status: 404 });
}
