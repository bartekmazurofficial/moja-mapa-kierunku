import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RaportKoncowy } from "@/components/raport/RaportKoncowy";
import { WynikNowy } from "@/components/raport/WynikNowy";
import { pobierzRaport } from "@/lib/raport/serwer";
import { zbudujWynikNowy } from "@/lib/raport/nowy";
import { pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly } from "@/lib/moduly/otwarcie";
import { programGrupy, KOLEJNOSC_NOWA } from "@/lib/moduly/ekrany";
import { stanDostepu } from "@/lib/raport/dostep";

export const dynamic = "force-dynamic";
export const metadata = { title: "Moja mapa kierunku" };

/**
 * Raport ma dzis dwie wersje, bo program ma dwie wersje.
 *
 * O tym, ktora sie renderuje, rozstrzyga to, co prowadzacy otworzyl grupie.
 * Grupa pilotazowa wypelnila osiem starych modulow i jej raport ma sie dalej
 * otwierac bez zmian: przelaczenie wszystkich na nowy widok skasowaloby jej
 * wynik bez kasowania ani jednego wiersza w bazie.
 */
export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const otwarte = await otwarteModuly(uczestnik.grupaId);
  const nowy = programGrupy(otwarte) === KOLEJNOSC_NOWA;

  if (nowy) {
    const [wynik, dostep] = await Promise.all([
      zbudujWynikNowy(uczestnik.id),
      stanDostepu(uczestnik.id, uczestnik.grupaId),
    ]);
    return (
      <Suspense>
        <WynikNowy
          wynik={wynik}
          kodUczestnika={kod}
          // Ta sama warstwa, ktora odslania zawody w starym raporcie.
          // Regula „nigdy zawody przed obszarami" nie zalezy od wersji programu.
          zawodyOdslonite={dostep.dostepne.has("zawody")}
          imie={uczestnik.imie}
        />
      </Suspense>
    );
  }

  const widok = await pobierzRaport(kod);
  if (!widok) notFound();

  // Nawigacja stoi w pulpicie po lewej, więc raport nie powtarza linku wstecz.
  return (
    <Suspense>
      <RaportKoncowy widok={widok} kodUczestnika={kod} />
    </Suspense>
  );
}
