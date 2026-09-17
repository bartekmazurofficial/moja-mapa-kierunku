import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WynikNowy } from "@/components/raport/WynikNowy";
import { zbudujWynikNowy } from "@/lib/raport/nowy";
import { pobierzUczestnika } from "@/lib/moduly/serwer";
import { stanDostepu } from "@/lib/raport/dostep";

export const dynamic = "force-dynamic";
export const metadata = { title: "Moja mapa kierunku" };

export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const [wynik, dostep] = await Promise.all([
    zbudujWynikNowy(uczestnik.id),
    stanDostepu(uczestnik.id, uczestnik.grupaId),
  ]);

  // Nawigacja stoi w pulpicie po lewej, więc raport nie powtarza linku wstecz.
  return (
    <Suspense>
      <WynikNowy
        wynik={wynik}
        kodUczestnika={kod}
        // Reguła „nigdy zawody przed obszarami" jest egzekwowana na serwerze:
        // zamknięta sekcja nie renderuje się wcale, nie jest tylko wygaszona.
        zawodyOdslonite={dostep.dostepne.has("zawody")}
        imie={uczestnik.imie}
      />
    </Suspense>
  );
}
