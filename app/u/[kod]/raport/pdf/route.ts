import { pobierzRaport } from "@/lib/raport/serwer";
import { zbudujPdf } from "@/lib/raport/pdf";

export const dynamic = "force-dynamic";

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
  const widok = await pobierzRaport(kod);
  if (!widok) return new Response("Nie znaleziono", { status: 404 });

  // Eksport przed warstwa czwarta jest niemozliwy.
  if (!widok.dostepne.includes("trzy_drogi")) {
    return new Response("Raport nie jest jeszcze gotowy do pobrania.", { status: 403 });
  }

  const plik = await zbudujPdf({ raport: widok.raport, oceny: widok.oceny });
  const nazwa = `moja-mapa-kierunku-${widok.raport.imie.toLowerCase().replace(/[^a-ząćęłńóśźż]/gi, "")}.pdf`;

  return new Response(new Uint8Array(plik), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(nazwa)}`,
    },
  });
}
