"use server";

/**
 * Akcje uczestnika.
 *
 * Uwierzytelnienie jest takie samo jak przy zapisie odpowiedzi: kodem dostepu,
 * ktory jest losowy i pelni jednoczesnie role identyfikatora. Akcja serwerowa
 * ma wlasny adres i mozna ja wywolac z pominieciem ekranu, wiec sprawdza
 * wszystko sama: czy kod istnieje i czy modul jest otwarty.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../db/klient";
import { KOLEJNOSC_MODULOW } from "./ekrany";
import { wyczyscModul } from "./odnowa";
import type { KodModulu } from "./typy";

export async function wypelnijOdNowa(dane: FormData) {
  const kod = String(dane.get("kod") ?? "");
  const modul = String(dane.get("modul") ?? "") as KodModulu;
  if (!KOLEJNOSC_MODULOW.includes(modul)) throw new Error(`nieznany moduł: ${modul}`);

  const uczestnik = await prisma.uczestnik.findUnique({
    where: { kodDostepu: kod },
    select: { id: true, grupaId: true },
  });
  if (!uczestnik) throw new Error("nieznany kod dostępu");

  await wyczyscModul(uczestnik.id, modul);

  revalidatePath(`/u/${kod}`, "layout");
  redirect(`/u/${kod}/modul/${modul}`);
}
