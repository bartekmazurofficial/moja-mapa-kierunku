"use server";

/**
 * Akcje panelu prowadzacego.
 *
 * Kazda sprawdza sesje samodzielnie. Sprawdzenie w komponencie nie wystarcza:
 * akcja serwerowa ma wlasny adres i mozna ja wywolac z pominieciem ekranu.
 */

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../db/klient";
import { hasloPoprawne, rolaSesji, zbudujCiasteczko, NAZWA_CIASTECZKA } from "./sesja";
import { pokazWlaczony } from "../pokaz";
import { otworzModul, otworzSpotkanie, otworzSpotkanieNowe } from "../moduly/otwarcie";
import { odblokujWarstwe } from "../raport/dostep";
import type { KodModulu } from "../moduly/typy";
import type { KodWarstwy } from "../raport/sekcje";

/**
 * Sesja z prawem zapisu.
 *
 * Sesja pokazowa jest **wyłącznie do czytania**. Powód nie jest ostrożnością
 * na wyrost: akcje biorą `grupaId` z formularza, więc sesja pokazowa z prawem
 * zapisu mogłaby otworzyć moduł albo odsłonić warstwę raportu w dowolnej,
 * prawdziwej grupie. Filtr widoku tego nie zatrzyma, bo zapis nie przechodzi
 * przez zapytania z `dane.ts`.
 */
async function wymagajSesji() {
  const rola = await rolaSesji();
  if (rola === null) throw new Error("brak sesji prowadzącego");
  if (rola === "pokaz") throw new Error("sesja pokazowa nie zmienia danych");
}

export async function zaloguj(_stan: string | null, dane: FormData): Promise<string | null> {
  const haslo = String(dane.get("haslo") ?? "");
  if (!hasloPoprawne(haslo)) return "Hasło się nie zgadza.";
  const c = zbudujCiasteczko();
  (await cookies()).set(c.nazwa, c.wartosc, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: c.maxAge,
  });
  redirect("/prowadzacy");
}

/**
 * Wejscie w panel prowadzacego bez hasla, w roli pokazowej.
 *
 * Dziala tylko przy `POKAZ_DEMO=1`. Sesja widzi jedna grupe pokazowa i nie ma
 * prawa zapisu, wiec nie jest obejsciem hasla, tylko osobnym, wezszym wejsciem.
 */
export async function zalogujPokaz() {
  if (!pokazWlaczony()) throw new Error("pokaz demonstracyjny jest wyłączony");
  const c = zbudujCiasteczko(Date.now(), "pokaz");
  (await cookies()).set(c.nazwa, c.wartosc, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: c.maxAge,
  });
  redirect("/prowadzacy");
}

export async function wyloguj() {
  (await cookies()).delete(NAZWA_CIASTECZKA);
  redirect("/prowadzacy");
}

export async function otworzModulAkcja(dane: FormData) {
  await wymagajSesji();
  const grupaId = String(dane.get("grupaId"));
  const modul = String(dane.get("modul"));
  // „N1" to spotkanie pierwsze nowego programu. Numery spotkan obu wersji
  // sie pokrywaja, wiec prefiks rozstrzyga, ktorej dotycza.
  if (/^N\d$/.test(modul)) await otworzSpotkanieNowe(grupaId, Number(modul.slice(1)));
  else if (/^\d$/.test(modul)) await otworzSpotkanie(grupaId, Number(modul));
  else await otworzModul(grupaId, modul as KodModulu);
  revalidatePath("/prowadzacy/grupa/[kod]", "page");
}

export async function odslonWarstweAkcja(dane: FormData) {
  await wymagajSesji();
  await odblokujWarstwe(String(dane.get("grupaId")), String(dane.get("warstwa")) as KodWarstwy);
  revalidatePath("/prowadzacy/grupa/[kod]", "page");
}

export async function dopiszKorekte(dane: FormData) {
  await wymagajSesji();
  const kodDostepu = String(dane.get("kod"));
  const uczestnik = await prisma.uczestnik.findUniqueOrThrow({ where: { kodDostepu } });
  const typ = String(dane.get("typ"));
  const wartosc = String(dane.get("wartosc") ?? "").trim() || null;
  const uzasadnienie = String(dane.get("uzasadnienie") ?? "").trim() || null;

  if (!["dopisany_zawod", "usuniety_zawod", "kolejnosc_drog", "do_przeliczenia"].includes(typ)) {
    throw new Error(`nieznany typ korekty: ${typ}`);
  }
  await prisma.korekta.create({
    data: { uczestnikId: uczestnik.id, typ, wartosc, uzasadnienie },
  });
  revalidatePath(`/prowadzacy/uczestnik/${kodDostepu}`);
  revalidatePath(`/prowadzacy/sesja/${kodDostepu}`);
}

export async function cofnijKorekte(dane: FormData) {
  await wymagajSesji();
  const id = String(dane.get("id"));
  const kodDostepu = String(dane.get("kod"));
  await prisma.korekta.delete({ where: { id } });
  revalidatePath(`/prowadzacy/uczestnik/${kodDostepu}`);
  revalidatePath(`/prowadzacy/sesja/${kodDostepu}`);
}

export async function zapiszSesje(dane: FormData) {
  await wymagajSesji();
  const kodDostepu = String(dane.get("kod"));
  const uczestnik = await prisma.uczestnik.findUniqueOrThrow({ where: { kodDostepu } });
  const tekst = (pole: string) => String(dane.get(pole) ?? "").trim() || null;
  const kroki = [1, 2, 3]
    .map((i) => String(dane.get(`krok${i}`) ?? "").trim())
    .filter((k) => k.length > 0);

  const pola = {
    decyzja: tekst("decyzja"),
    coPrzekonalo: tekst("coPrzekonalo"),
    coSprawdzic: tekst("coSprawdzic"),
    kroki: kroki.length > 0 ? JSON.stringify(kroki) : null,
    wrocicZa: tekst("wrocicZa"),
    notatka: tekst("notatka"),
    odbyta: new Date(),
  };
  await prisma.sesja.upsert({
    where: { uczestnikId: uczestnik.id },
    create: { uczestnikId: uczestnik.id, ...pola },
    update: pola,
  });
  revalidatePath(`/prowadzacy/sesja/${kodDostepu}`);
  revalidatePath(`/u/${kodDostepu}/raport`);
}
