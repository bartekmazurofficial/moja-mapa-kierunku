import { pobierzRaport } from "@/lib/raport/serwer";
import { zbudujPdf, zbudujPdfNowy } from "@/lib/raport/pdf";
import { zbudujWynikNowy } from "@/lib/raport/nowy";
import { pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly } from "@/lib/moduly/otwarcie";
import { KOLEJNOSC_NOWA, programGrupy } from "@/lib/moduly/ekrany";
import { stanDostepu } from "@/lib/raport/dostep";
import { stopkaRaportu } from "@/lib/raport/sekcje";
import { zl } from "@/lib/ui/kwota";

/**
 * Node, nie Edge: renderer PDF czyta fonty z dysku i korzysta z Buffera.
 * Domyslnie tak jest, ale na wdrozeniu nie chcemy tego zostawiac domysle.
 */
export const runtime = "nodejs";

export const dynamic = "force-dynamic";

function nazwaPliku(imie: string): string {
  return `moja-mapa-kierunku-${imie.toLowerCase().replace(/[^a-ząćęłńóśźż]/gi, "")}.pdf`;
}

function odpowiedz(plik: Buffer, imie: string): Response {
  return new Response(new Uint8Array(plik), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(nazwaPliku(imie))}`,
    },
  });
}

/**
 * Eksport raportu do PDF. Mozliwy najwczesniej po odsloniecu warstwy czwartej.
 * PDF powstaje na zadanie i nosi date dnia, w ktorym zostal pobrany, wiec
 * kazda pobrana wersja jest osobnym zdjeciem z konkretnego dnia.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kod: string }> },
) {
  const { kod } = await params;

  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) return new Response("Nie znaleziono", { status: 404 });

  const otwarte = await otwarteModuly(uczestnik.grupaId);

  if (programGrupy(otwarte) === KOLEJNOSC_NOWA) {
    const [w, dostep] = await Promise.all([
      zbudujWynikNowy(uczestnik.id),
      stanDostepu(uczestnik.id, uczestnik.grupaId),
    ]);
    // Bez ani jednego domknietego modulu nie ma czego eksportowac. Pusty
    // dokument z sama strona tytulowa wyglada jak blad, nie jak wynik.
    if (!w.domkniete.L && !w.domkniete.U && !w.domkniete.Z) {
      return new Response("Raport nie jest jeszcze gotowy do pobrania.", { status: 403 });
    }
    const teraz = new Date();
    const plik = await zbudujPdfNowy({
      imie: uczestnik.imie,
      dataWygenerowania: teraz.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      stopka: stopkaRaportu(teraz),
      tematy: w.ciekawosc.top5.map((p) => p.nazwa),
      lubie: w.lubie.top5.map((p) => p.nazwa),
      umiem: w.umiem.top5.map((p) => p.nazwa),
      listy: w.listy.map((l) => ({
        tytul: l.tytul,
        opis: l.opis,
        pozycje: l.pozycje.map((p) => p.nazwa),
      })),
      poziom: w.poziom
        ? {
            minimum: zl(w.poziom.minimum),
            komfort: zl(w.poziom.komfort),
            cel: zl(w.poziom.cel),
            rocznie: zl(w.poziom.kosztRoczny),
          }
        : null,
      koszty: (w.poziom?.skladniki ?? [])
        .slice(0, 7)
        .map((s) => ({ nazwa: s.nazwa, kwota: zl(s.kwota), udzial: s.udzial })),
      // Zawody wchodza do pliku dopiero po odsloniecu warstwy. Regula „nigdy
      // zawody przed obszarami" nie konczy sie na ekranie: plik zyje dluzej.
      zawody: dostep.dostepne.has("zawody")
        ? w.zawody.map((z) => ({
            nazwa: z.nazwa,
            bezStudiow: z.bezStudiow,
            uzasadnienie:
              z.trafienia.length > 0 ? `Z Twoich zaznaczeń: ${z.trafienia.join(", ")}.` : null,
            widelki: z.finanse.zarobki
              ? `Widełki: od ${zl(z.finanse.zarobki.start)} na start, typowo ${zl(z.finanse.zarobki.typowy)}, do ${zl(z.finanse.zarobki.szczyt)} na szczycie. Na rękę, miesięcznie.`
              : null,
            finanse: w.poziom ? z.finanse.komunikat : null,
          }))
        : [],
    });
    return odpowiedz(plik, uczestnik.imie);
  }

  const widok = await pobierzRaport(kod);
  if (!widok) return new Response("Nie znaleziono", { status: 404 });

  // Eksport przed warstwa czwarta jest niemozliwy.
  if (!widok.dostepne.includes("trzy_drogi")) {
    return new Response("Raport nie jest jeszcze gotowy do pobrania.", { status: 403 });
  }

  const plik = await zbudujPdf({ raport: widok.raport, oceny: widok.oceny });
  return odpowiedz(plik, widok.raport.imie);
}
