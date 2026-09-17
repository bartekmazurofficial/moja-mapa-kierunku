import { notFound, redirect } from "next/navigation";
import { pobierzPostepModulow, pobierzUczestnika } from "@/lib/moduly/serwer";
import { stanAssessmentu } from "@/lib/moduly/etapy";

export const dynamic = "force-dynamic";

/**
 * Jedno wejscie w assessment.
 *
 * Uczestnik nie wybiera etapu: klika „zacznij" albo „wroc do assessmentu"
 * i ląduje dokladnie tam, gdzie skonczyl. Gdy ma za soba wszystkie cztery,
 * idzie do raportu.
 *
 * Adres jest zawsze ten sam, wiec da sie go podac na spotkaniu, wpisac na
 * tablicy i wkleic w wiadomosci, a po przerwie dziala tak samo.
 */
export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const { zakonczone, odpowiedziWModule } = await pobierzPostepModulow(uczestnik.id);
  const stan = stanAssessmentu(zakonczone, odpowiedziWModule);

  redirect(stan.biezacy ? `/u/${kod}/modul/${stan.biezacy}` : `/u/${kod}/raport`);
}
